import {openDB} from 'idb';
export type StoreKey = 'tasks'|'commitments'|'availability'|'schedule'|'moods'|'favorites'|'settings';
const dbPromise = typeof indexedDB !== 'undefined' ? openDB('solace-local',1,{upgrade(db){db.createObjectStore('preferences');}}) : null;
export async function loadLocal<T>(key:StoreKey,fallback:T):Promise<T>{try {const db=await dbPromise;const value=await db?.get('preferences',key);return value === undefined ? fallback : value as T;}catch{return fallback;}}
export async function saveLocal<T>(key:StoreKey,value:T):Promise<void>{const db=await dbPromise;if(!db)throw new Error('Local storage is unavailable in this browser');await db.put('preferences',value,key);}
export async function clearLocal():Promise<void>{const db=await dbPromise;if(!db)throw new Error('Local storage is unavailable');await db.clear('preferences');}
