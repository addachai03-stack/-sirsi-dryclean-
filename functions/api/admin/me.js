import {json,getSession} from '../../_lib.js';
export async function onRequestGet({env,request}){
  if(!env.PRICE_DB)return json({authenticated:false,error:'Database unavailable'},503);
  try{return json({authenticated:!!(await getSession(request,env.PRICE_DB))});}
  catch(_error){return json({authenticated:false,error:'Service unavailable'},503);}
}
