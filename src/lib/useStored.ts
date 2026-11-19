import {useEffect,useRef,useState} from 'react';
import {loadLocal,saveLocal,type StoreKey} from './storage';

/** The initial fallback is intentionally stable; a fresh [] or {} passed by a caller must not rehydrate the store. */
export function useStored<T>(key:StoreKey,fallback:T):[T,(value:T|((old:T)=>T))=>void,boolean,string|null]{
 const initial=useRef(fallback);
 const [value,setValue]=useState<T>(initial.current);
 const [ready,setReady]=useState(false);
 const [error,setError]=useState<string|null>(null);
 useEffect(()=>{
  let active=true;
  setReady(false);
  loadLocal(key,initial.current).then(x=>{if(active){setValue(x);setReady(true);}})
   .catch(()=>{if(active){setError('Unable to load saved data.');setReady(true);}});
  return()=>{active=false;};
 },[key]);
 useEffect(()=>{
  if(!ready)return;
  saveLocal(key,value).catch(()=>setError('Your changes could not be saved on this device.'));
 },[key,value,ready]);
 return [value,setValue,ready,error];
}
