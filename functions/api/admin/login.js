import {json,sha256,equalFixed,safeOrigin,cookie} from '../../_lib.js';
export async function onRequestPost({env,request}){
  if(!safeOrigin(request))return json({error:'Invalid request origin'},403);
  if(!env.PRICE_DB||!env.OWNER_PASSWORD_HASH)return json({error:'Owner login unavailable'},503);
  if((Number(request.headers.get('Content-Length')||0))>4096)return json({error:'Request too large'},413);
  let body;try{body=await request.json();}catch(_e){return json({error:'Invalid JSON'},400);}
  if(typeof body?.password!=='string'||body.password.length>128||body.password.length<8)return json({error:'Invalid credentials'},401);
  const ip=request.headers.get('CF-Connecting-IP')||'unknown';
  const ipHash=await sha256(ip);const now=Math.floor(Date.now()/1000);
  try{
    const prior=await env.PRICE_DB.prepare('SELECT failures,reset_at FROM login_attempts WHERE ip_hash=?').bind(ipHash).first();
    if(prior && prior.reset_at>now && prior.failures>=8)return json({error:'Too many attempts. Try after 15 minutes.'},429);
    const supplied=await sha256(body.password);
    if(!equalFixed(supplied,env.OWNER_PASSWORD_HASH)){
      await env.PRICE_DB.prepare('INSERT INTO login_attempts(ip_hash,failures,reset_at) VALUES(?,1,?) ON CONFLICT(ip_hash) DO UPDATE SET failures=CASE WHEN reset_at <= ? THEN 1 ELSE failures + 1 END, reset_at=CASE WHEN reset_at <= ? THEN excluded.reset_at ELSE reset_at END').bind(ipHash,now+900,now,now).run();
      return json({error:'Invalid credentials'},401);
    }
    await env.PRICE_DB.prepare('DELETE FROM login_attempts WHERE ip_hash=?').bind(ipHash).run();
    const raw=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
    const hash=await sha256(raw);
    await env.PRICE_DB.batch([
      env.PRICE_DB.prepare('DELETE FROM owner_sessions WHERE expires_at<=?').bind(now),
      env.PRICE_DB.prepare('INSERT INTO owner_sessions(token_hash,expires_at) VALUES(?,?)').bind(hash,now+12*60*60)
    ]);
    return json({authenticated:true},200,{'Set-Cookie':cookie(raw,12*60*60)});
  }catch(_error){return json({error:'Login service unavailable'},503);}
}
