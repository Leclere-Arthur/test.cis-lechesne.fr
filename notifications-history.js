/* Historique des Push effectivement reçus sur cet appareil, isolé par compte.
 * Partagé entre la page et le service worker ; aucune clé Supabase nécessaire. */
(function (scope) {
 'use strict';
 let opening;
 function open() {
  if (opening) return opening;
  opening = new Promise((resolve, reject) => {
   const req = indexedDB.open('cis-notifications-received-v1', 2);
   req.onupgradeneeded = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains('notifications')) {
     const records = db.createObjectStore('notifications', {keyPath:'id'});
     records.createIndex('user_date', ['userId','receivedAt']);
    }
    if (!db.objectStoreNames.contains('owners')) db.createObjectStore('owners', {keyPath:'endpoint'});
    if (!db.objectStoreNames.contains('suppressions')) db.createObjectStore('suppressions', {keyPath:'id'});
   };
   req.onsuccess = () => {req.result.onversionchange = () => {req.result.close();opening = null;};resolve(req.result);};
   req.onerror = () => {opening = null;reject(req.error);};
  });
  return opening;
 }
 function done(tx) {return new Promise((resolve,reject) => {tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Enregistrement interrompu.'));});}
 function result(req) {return new Promise((resolve,reject) => {req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
 function range(userId) {return IDBKeyRange.bound([String(userId),''],[String(userId),'\uffff']);}
 async function bind(endpoint,userId) {
  if (!endpoint||!userId) return;
  const db=await open(),tx=db.transaction('owners','readwrite'),completion=done(tx);
  tx.objectStore('owners').put({endpoint:String(endpoint),userId:String(userId)});await completion;
 }
 async function owner(endpoint) {
  if (!endpoint) return null;
  const db=await open();return (await result(db.transaction('owners').objectStore('owners').get(String(endpoint))))?.userId||null;
 }
 function plain(value) {
  return String(value||'').replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D\u20E3]/gu,'').replace(/\s+/g,' ').trim();
 }
 const caserneTypes=['sport','manoeuvre','casernement','reunion','amical','comite_centre','entretien_individuel','administratif'];
 function route(data) {
  const raw=String(data.target||data.destination||data.type_notification||data.type||data.data?.target||'').toLowerCase();
  const words=plain([data.title,data.body,data.tag,raw].join(' ')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/œ/g,'oe');
  if (/menage/.test(words)&&/stock|rupture|inventaire|produit/.test(words)) return 'menage-inventaire';
  if (['menage-inventaire','vehicules-inventaire','heures','pharmacie','accueil','suivi-vsav'].includes(raw)) return raw;
  const type=raw.replace(/^caserne[_:]/,'');
  if (caserneTypes.includes(type)) return 'caserne:'+type;
  if (/inventaire.*vehicule|vehicule.*inventaire/.test(words)) return 'vehicules-inventaire';
  if (/alerte stock|rupture de stock|stock minimum/.test(words)||raw==='pharmacie') return 'pharmacie';
  const names=[['sport','sport'],['manoeuvre','manoeuvre'],['casernement','casernement'],['reunion','reunion'],['amical','amical'],['comite de centre','comite_centre'],['entretien individuel','entretien_individuel']];
  if (/rappel|actualite|caserne/.test(words)) for (const [label,key] of names) if(words.includes(label)) return 'caserne:'+key;
  return 'accueil';
 }
 async function receive(data,userId) {
  if(!userId) return null;
  const db=await open(),tx=db.transaction(['notifications','suppressions'],'readwrite'),completion=done(tx),store=tx.objectStore('notifications');
  const stable=data.notification_id||(/^menage-rupture-/.test(String(data.tag||''))?data.tag:null);
  const id=String(userId)+':'+(stable||crypto.randomUUID());
  const record={id,userId:String(userId),title:plain(data.title)||'Notification',body:plain(data.body),receivedAt:data.receivedAt&&Number.isFinite(Date.parse(data.receivedAt))?new Date(data.receivedAt).toISOString():new Date().toISOString(),target:route(data),read:false};
  // Un renvoi de la même alerte ménage ne doit pas créer un doublon ni modifier sa date.
  let dejaRecue=null;
  const suppression=tx.objectStore('suppressions').get(id);
  suppression.onsuccess=()=>{
   if(suppression.result){dejaRecue={...record,deleted:true};return;}
   const existing=store.get(id);existing.onsuccess=()=>{if(!existing.result)store.put(record);else dejaRecue=existing.result;};
  };
  await completion;
  const cleanup=db.transaction('notifications','readwrite'),cleanDone=done(cleanup),records=cleanup.objectStore('notifications');
  let count=0;const cursor=records.index('user_date').openCursor(range(userId),'prev');
  cursor.onsuccess=()=>{const c=cursor.result;if(!c)return;if(++count>200)c.delete();c.continue();};
  await cleanDone;return dejaRecue?{...dejaRecue,duplicate:true}:record;
 }
 async function list(userId) {
  if(!userId)return [];
  const db=await open(),tx=db.transaction('notifications'),req=tx.objectStore('notifications').index('user_date').openCursor(range(userId),'prev');
  return new Promise((resolve,reject)=>{const rows=[];req.onsuccess=()=>{const c=req.result;if(!c||rows.length>=200)return resolve(rows);rows.push(c.value);c.continue();};req.onerror=()=>reject(req.error);});
 }
 async function get(id,userId) {
  const db=await open(),r=await result(db.transaction('notifications').objectStore('notifications').get(String(id)));
  return r&&r.userId===String(userId)?r:null;
 }
 async function read(id,userId) {
  const db=await open(),tx=db.transaction('notifications','readwrite'),completion=done(tx),store=tx.objectStore('notifications'),req=store.get(String(id));
  req.onsuccess=()=>{const r=req.result;if(r&&r.userId===String(userId))store.put({...r,read:true});};await completion;
 }
 async function remove(ids,userId) {
  if(!userId||!Array.isArray(ids))return;
  const db=await open(),tx=db.transaction(['notifications','suppressions'],'readwrite'),completion=done(tx);
  const store=tx.objectStore('notifications'),supprimees=tx.objectStore('suppressions');
  for(const value of ids){const id=String(value);if(!id.startsWith(String(userId)+':'))continue;store.delete(id);supprimees.put({id,userId:String(userId)});}
  await completion;
 }
 scope.CISNotifications={bind,owner,receive,list,get,read,remove,route,plain};
})(globalThis);


