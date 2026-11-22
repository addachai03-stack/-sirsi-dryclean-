import {json,getSession,safeOrigin,cookie} from '../../_lib.js';
export async function onRequestPost({env,request}){
 if(!safeOrigin(request))return json({error:'Invalid request origin'},403);
 try{
   if(env.PRICE_DB){const hash=await getSession(request,env.PRICE_DB);if(hash)await env.PRICE_DB.prepare('DELETE FROM owner_sessions WHERE token_hash=?').bind(hash).run();}
   return json({authenticated:false},200,{'Set-Cookie':cookie('',0)});
 }catch(_e){return json({error:'Sign out unavailable'},503);}
}
