import {json,requireSession,loadPrices,isValidPriceItem,safeOrigin} from '../../_lib.js';
export async function onRequestGet(context){
  try{
    const denied=await requireSession(context);if(denied)return denied;
    return json(await loadPrices(context.env.PRICE_DB));
  }catch(_error){return json({error:'Unable to load prices'},503);}
}
export async function onRequestPut(context){
  const {request,env}=context;
  if(!safeOrigin(request))return json({error:'Invalid request origin'},403);
  if((Number(request.headers.get('Content-Length')||0))>45000)return json({error:'Request too large'},413);
  try{
    const denied=await requireSession(context);if(denied)return denied;
    let data;try{data=await request.json();}catch(_e){return json({error:'Invalid JSON'},400);}
    if(!Array.isArray(data?.items)||data.items.length<1||data.items.length>120||typeof data.published!=='boolean')
      return json({error:'Add 1 to 120 items and set confirmation status'},400);
    const ids=new Set();
    for(const item of data.items){
      if(!isValidPriceItem(item)||ids.has(item.id))return json({error:'Each item needs a valid unique ID, service, name and price'},400);
      ids.add(item.id);
    }
    const statements=[env.PRICE_DB.prepare('DELETE FROM prices')];
    data.items.forEach((i,n)=>{
      statements.push(env.PRICE_DB.prepare('INSERT INTO prices(id,category,name,price,detail,position) VALUES(?,?,?,?,?,?)').bind(i.id,i.category,i.name.trim(),i.price,i.detail.trim(),n));
    });
    statements.push(env.PRICE_DB.prepare("INSERT INTO shop_settings(key,value) VALUES('published',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(data.published?'1':'0'));
    await env.PRICE_DB.batch(statements);
    return json({saved:true,...await loadPrices(env.PRICE_DB)});
  }catch(_error){return json({error:'Save failed; previous prices retained.'},503);}
}
