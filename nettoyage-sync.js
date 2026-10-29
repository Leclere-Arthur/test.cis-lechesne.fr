/* Applique les suppressions explicites de Pilotage, sans modifier les stocks ni la session. */
(function(){
 'use strict';
 var owner='',etat={curseur:0,ids:{}},marksPromise=null,notificationsBusy=false,lastMarks=0,lastNotifications=0;
 function uid(){try{return utilisateurConnecte&&profilUtilisateurConnecte?.actif?String(utilisateurConnecte.id):''}catch(_){return ''}}
 function cle(u){return 'cis-nettoyage-local-v1:'+u}
 function changer(){var u=uid();if(u===owner)return;owner=u;etat={curseur:0,ids:{}};lastMarks=0;lastNotifications=0;try{var d=JSON.parse(localStorage.getItem(cle(u))||'null');if(d&&Number.isFinite(d.curseur)&&d.ids&&typeof d.ids==='object')etat=d}catch(_){} }
 function sauver(){try{if(owner)localStorage.setItem(cle(owner),JSON.stringify(etat))}catch(_){} }
 function supprime(module,id){return !!etat.ids[module]?.[String(id)]}
 function appliquer(){changer();if(!owner)return false;var changed=false;
  try{var h=historique.filter(function(i){return !supprime('retours',i.id)});if(h.length!==historique.length){historique=h;changed=true;}}catch(_){}
  try{var a=archivesHistorique.filter(function(i){return !supprime('commandes',i.id)}).map(function(i){var items=(i.interventions||[]).filter(function(r,index){return !supprime('retours',r.id||('@'+i.id+':'+(index+1)))});if(items.length!==(i.interventions||[]).length){changed=true;return Object.assign({},i,{interventions:items})}return i});if(a.length!==archivesHistorique.length)changed=true;archivesHistorique=a;}catch(_){}
  try{choixInventairesPDFEquipe=choixInventairesPDFEquipe.filter(function(i){return !supprime('inventaires',i.id)})}catch(_){}
  try{for(var type of ['meducore','vsav'])if(archivesControlesPharmacie[type])archivesControlesPharmacie[type]=archivesControlesPharmacie[type].map(function(page){return page.filter(function(i){return !supprime('controles',i.id)})}).filter(function(page){return page.length});}catch(_){}
  try{var map=window.__publicationsCaserneParId;if(map)Object.keys(map).forEach(function(id){if(supprime('evenements',id))delete map[id]})}catch(_){}
  try{if(window.CISTravail?.appliquerSuppressions)changed=window.CISTravail.appliquerSuppressions(etat.ids.travail)||changed;}catch(_){}
  return changed;
 }
 async function requete(u,nom,body){if(!u||uid()!==u||!navigator.onLine)throw Error('Indisponible');var c;try{c=obtenirClientSupabase()}catch(_){}if(!c)throw Error('Indisponible');var timer,session;
  try{session=(await Promise.race([c.auth.getSession(),new Promise(function(_,reject){timer=setTimeout(function(){reject(Error('Délai dépassé'))},4000)})])).data?.session}finally{clearTimeout(timer)}
  if(!session||String(session.user.id)!==u||Number(session.expires_at||0)*1000<Date.now()+10000||uid()!==u)throw Error('Indisponible');
  var controller=new AbortController();timer=setTimeout(function(){controller.abort()},8000);
  try{var r=await fetch(window.SUPABASE_URL+'/rest/v1/rpc/'+nom,{method:'POST',headers:{apikey:window.SUPABASE_ANON_KEY,Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},body:JSON.stringify(body||{}),signal:controller.signal});if(!r.ok)throw Error('Indisponible');var data=await r.json();if(uid()!==u)throw Error('Compte changé');return data}finally{clearTimeout(timer)}
 }
 function persisterEtAfficher(changed){if(!changed)return;try{sauvegarderToutesLesDonnees();if(document.getElementById('historique-total')){afficherHistoriqueTotal();afficherHistoriqueInterventions();}}catch(_){} }
 async function suppressions(force){changer();var u=owner;if(!u||!navigator.onLine||(!force&&Date.now()-lastMarks<60000)){persisterEtAfficher(appliquer());return;}
  if(marksPromise){await marksPromise;if(owner===u)persisterEtAfficher(appliquer());return;}
  marksPromise=(async function(){try{var hasNew=false;for(var lot=0;lot<20;lot++){var d=await requete(u,'cis_lire_suppressions_pilotage',{p_apres:etat.curseur});if(owner!==u||!Array.isArray(d.lignes))return;
    for(var r of d.lignes){if(!etat.ids[r.module])etat.ids[r.module]={};etat.ids[r.module][r.reference]=true;etat.curseur=Math.max(etat.curseur,Number(r.numero)||0);hasNew=true;}sauver();if(d.lignes.length<500)break;}
   if(hasNew){try{if(envoiDocumentsEquipeEtat)envoiDocumentsEquipeEtat.pending=null;}catch(_){} }
   persisterEtAfficher(appliquer());
  }catch(_){}finally{lastMarks=owner===u?Date.now():0;marksPromise=null;}})();await marksPromise;
 }
 async function notifications(){changer();var u=owner;if(!u||notificationsBusy||!navigator.onLine||document.hidden)return;notificationsBusy=true;
  try{var store=await chargerHistoriqueNotificationsModule();if(uid()!==u)return;var rows=await store.list(u);var d=await requete(u,'cis_synchroniser_notifications_recues',{p_notifications:rows});if(uid()!==u||owner!==u)return;
   var ids=Array.isArray(d.supprime_ids)?d.supprime_ids:[];if(ids.length&&typeof store.remove==='function'){await store.remove(ids,u);if(uid()===u){if(typeof actualiserPointNotifications==='function')void actualiserPointNotifications();if(document.getElementById('notifications-liste')&&typeof remplirHistoriqueNotifications==='function')void remplirHistoriqueNotifications();}}
  }catch(_){}finally{notificationsBusy=false;lastNotifications=owner===u?Date.now():0;}
 }
 function tick(){changer();if(!owner||document.hidden||document.body.classList.contains('mode-connexion'))return;void suppressions(false);if(Date.now()-lastNotifications>60000)void notifications();}
 window.CISNettoyageLocal={appliquer:appliquer,avant:async function(){changer();if(Date.now()-lastMarks>5000)await suppressions(true);persisterEtAfficher(appliquer());}};
 setInterval(tick,5000);window.addEventListener('online',function(){lastMarks=0;lastNotifications=0;tick()});document.addEventListener('visibilitychange',function(){if(!document.hidden){lastMarks=0;lastNotifications=0;tick()}});
 if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',function(e){if(e.data?.type==='CIS_NOTIFICATIONS_UPDATED'){lastNotifications=0;void notifications();}});
 tick();
})();
function appliquerSuppressionsLocalesPilotage(){return window.CISNettoyageLocal?.appliquer()||false;}
async function appliquerNettoyageAvantSynchronisation(){if(window.CISNettoyageLocal)await window.CISNettoyageLocal.avant();}
