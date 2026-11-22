import {json,loadPrices} from '../_lib.js';
export async function onRequestGet({env}){
  if(!env.PRICE_DB)return json({error:'Pricing unavailable'},503);
  try{return json(await loadPrices(env.PRICE_DB));}
  catch(_error){return json({error:'Pricing unavailable'},503);}
}
