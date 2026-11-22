import {json,requireSession,safeOrigin,sha256,equalFixed,cookie} from '../../_lib.js';
export async function onRequestPost(context){
 const {request,env}=context;
 if(!safeOrigin(request))return json({error:'Invalid request origin'},403);
 try{
  const denied=await requireSession(context);if(denied)return denied;
  if(Number(request.headers.get('Content-Length')||0)>4096)return json({error:'Request too large'},413);
  let input;try{input=await request.json();}catch(_){return json({error:'Invalid request'},400);}
  const current=input?.currentPassword,newPassword=input?.newPassword;
  if(typeof current!=='string'||typeof newPassword!=='string'||newPassword.length<16||newPassword.length>128||!/\d/.test(newPassword)||!/[A-Z]/.test(newPassword)||!/[a-z]/.test(newPassword))
    return json({error:'New password needs 16+ characters with upper/lowercase and a number'},400);
  const saved=await env.PRICE_DB.prepare("SELECT value FROM shop_settings WHERE key='owner_password_hash'").first();
  const oldHash=saved?.value||env.OWNER_PASSWORD_HASH;
  if(!equalFixed(await sha256(current),oldHash))return json({error:'Current password is incorrect'},401);
  if(current===newPassword)return json({error:'Choose a different new password'},400);
  const nextHash=await sha256(newPassword);
  await env.PRICE_DB.batch([
   env.PRICE_DB.prepare("INSERT INTO shop_settings(key,value) VALUES('owner_password_hash',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(nextHash),
   env.PRICE_DB.prepare('DELETE FROM owner_sessions')
  ]);
  return json({changed:true,authenticated:false},200,{'Set-Cookie':cookie('',0)});
 }catch(_error){return json({error:'Password change failed'},503);}
}
