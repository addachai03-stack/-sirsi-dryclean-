// Shared helpers for Sirsi Dryclean Pages Functions. No credentials in Git.
export function json(data, status=200, extra={}) {
  return new Response(JSON.stringify(data), {
    status,
    headers:{ 'Content-Type':'application/json; charset=utf-8',
      'Cache-Control':'no-store, max-age=0',
      'X-Content-Type-Options':'nosniff',
      ...extra }
  });
}
export function securityHeaders(){
  return { 'Referrer-Policy':'no-referrer', 'X-Content-Type-Options':'nosniff',
    'Cache-Control':'no-store, max-age=0' };
}
export function safeOrigin(request){
  const origin=request.headers.get('Origin');
  return !!origin && origin===new URL(request.url).origin;
}
const bytesHex=(buffer)=>Array.from(new Uint8Array(buffer),x=>x.toString(16).padStart(2,'0')).join('');
export async function sha256(value){
  return bytesHex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));
}
export function equalFixed(a,b){
  if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;
  let diff=0;for(let i=0;i<a.length;i++)diff |= a.charCodeAt(i)^b.charCodeAt(i);
  return diff===0;
}
export async function getSession(request,db){
  const raw=(request.headers.get('Cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('sirsi_owner='));
  if(!raw)return null;
  const token=raw.slice('sirsi_owner='.length);
  if(!/^[a-f0-9]{64}$/.test(token))return null;
  const hash=await sha256(token);
  const found=await db.prepare('SELECT token_hash FROM owner_sessions WHERE token_hash=? AND expires_at>?').bind(hash,Math.floor(Date.now()/1000)).first();
  return found?hash:null;
}
export async function requireSession(context){
  if(!context.env.PRICE_DB)return json({error:'Price database not configured.'},503);
  if(!await getSession(context.request,context.env.PRICE_DB))return json({error:'Please sign in as owner.'},401);
  return null;
}
export function cookie(token,age){
  return `sirsi_owner=${token}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
}
export function dbReady(env){return !!env.PRICE_DB;}
export async function loadPrices(db){
  const [rows,setting]=await Promise.all([
    db.prepare('SELECT id,category,name,price,detail,position FROM prices ORDER BY category,position,name').all(),
    db.prepare("SELECT value FROM shop_settings WHERE key='published'").first()
  ]);
  const prices={iron:[],dry:[],wash:[],other:[]};
  for(const x of rows.results||[]){
    if(prices[x.category])prices[x.category].push({id:x.id,name:x.name,price:Number(x.price),detail:x.detail});
  }
  return {prices,published:setting?.value==='1'};
}
export function isValidPriceItem(item){
  return item && typeof item==='object' &&
    /^[a-z0-9_-]{3,64}$/.test(item.id||'') &&
    ['iron','dry','wash','other'].includes(item.category) &&
    typeof item.name==='string' && item.name.trim().length>0 && item.name.trim().length<=70 &&
    Number.isInteger(item.price) && item.price>=0 && item.price<=100000 &&
    typeof item.detail==='string' && item.detail.trim().length>0 && item.detail.trim().length<=70;
}
