/* Utilisation sans réserve pharmacie : file métier serveur et alertes propres au compte. */
(function(g){'use strict';let derniereLecture=0,compte='',lecture=null;const suiviGenerations=new WeakMap();
const esc=s=>echapperHTML(String(s??''));
async function rpc(n,p={},ms=15000){const ac=new AbortController(),t=setTimeout(()=>ac.abort(),ms);try{const r=await obtenirClientSupabase().rpc(n,p).abortSignal(ac.signal);if(r.error)throw r.error;return r.data;}finally{clearTimeout(t);}}
function configurerFormulaire(m){const c=document.getElementById('gere-stock-pharmacie'),stock=document.getElementById('quantite-materiel'),minimum=document.getElementById('minimum-materiel');if(!c)return;
 const appliquer=()=>{if(!c.checked&&Number(m?.stock||0)>0){c.checked=true;alert('Ramène le stock pharmacie à zéro avant de passer ce matériel sans réserve pharmacie.');}if(!c.checked){stock.value='0';minimum.value='0';}stock.disabled=minimum.disabled=!c.checked;};c.onchange=appliquer;appliquer();void initialiserLien(m);}
function stylesVSAV(){
 if(document.getElementById('styles-vsav-selection'))return;
 const style=document.createElement('style');style.id='styles-vsav-selection';style.textContent=`
 .vsav-choix{display:block;width:100%;text-align:left;padding:16px;margin:10px 0;border:1px solid #ccd5d9;border-radius:14px;background:#fff;color:#253238;font:inherit;cursor:pointer;overflow-wrap:anywhere}
 .vsav-choix strong,.vsav-choix small{display:block}.vsav-choix small{margin-top:6px;color:#596975}
 .vsav-choix:focus-visible{outline:3px solid #1687ff}.vsav-choix[aria-pressed=true]{border:2px solid #21815c;background:#e7f5ee}
 .vsav-recherche{box-sizing:border-box;width:100%;padding:14px;border:1px solid #bccbd2;border-radius:12px;font:inherit;font-size: max(16px,1em)}
 .vsav-selection{margin:12px 0;padding:14px;background:#e7f5ee;border:2px solid #21815c;border-radius:14px;overflow-wrap:anywhere}.vsav-selection strong,.vsav-selection small{display:block}
 .vsav-statut{display:block;padding:14px 16px;border-radius:12px;font-size:1.08em;font-weight:800;border:2px solid;margin:12px 0;line-height:1.4}
 .vsav-statut-commander{background:#b71924;border-color:#b71924;color:#fff}.vsav-statut-commande{background:#fff0c2;border-color:#a56a00;color:#714900}.vsav-statut-recu{background:#e4f1ff;border-color:#2469a8;color:#164a7a}
 .vsav-attente-actions button{white-space:normal;text-align:center;min-height:48px;max-width:100%}
 `;document.head.appendChild(style);
}
async function initialiserLien(m){
 stylesVSAV();
 const select=document.getElementById('inventaire-vsav-lien'),groupe=document.getElementById('vsav-lien-groupe'),c=document.getElementById('gere-stock-pharmacie'),statut=document.getElementById('vsav-lien-statut'),box=document.getElementById('vsav-lien-selecteur');if(!select||!c||!box)return;
 const visibilite=()=>{groupe.hidden=c.checked;};c.addEventListener('change',visibilite);visibilite();
 const owner=String(utilisateurConnecte?.id||''),key='cis-vsav-correspondances:'+owner;
 let rows=[],vehicle=null,zone=null,terme='';
 const normaliser=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
 box.innerHTML='<div data-vsav-selection aria-live="polite"></div><label for="vsav-recherche-lien">Rechercher un matériel</label><input class="vsav-recherche" id="vsav-recherche-lien" type="search" placeholder="Nom du matériel ou du coffre" autocomplete="off"><div data-vsav-parcours></div>';
 const choix=box.querySelector('[data-vsav-parcours]'),selection=box.querySelector('[data-vsav-selection]');
 const bouton=(label,action,valeur,detail='',choisi=false)=>`<button type="button" class="vsav-choix" data-lien-action="${action}" data-lien-valeur="${esc(valeur)}" ${action==='choisir'?`aria-pressed="${choisi}"`:''}><strong>${esc(label)}</strong>${detail?`<small>${esc(detail)}</small>`:''}</button>`;
 function render(){
 const courant=rows.find(r=>String(r.id)===select.value);
 selection.innerHTML=select.value?`<div class="vsav-selection"><strong>${esc(courant?.nom||'Correspondance enregistrée')}</strong><small>${courant?esc(courant.vehicule+' › '+courant.zone+' · '+courant.quantite+' prévu(s)'):'Chargement de son emplacement…'}</small><button type="button" class="vsav-choix" data-lien-action="effacer">Retirer le lien</button></div>`:'<p>Aucun matériel lié.</p>';
 const items=rs=>rs.map(r=>bouton(r.nom,'choisir',r.id,r.vehicule+' › '+r.zone+' · '+r.quantite+' prévu(s)',String(r.id)===select.value)).join('');
 if(terme){const mots=normaliser(terme).trim().split(/\s+/);const trouves=rows.filter(r=>mots.every(mot=>normaliser(r.nom+' '+r.zone+' '+r.vehicule).includes(mot)));choix.innerHTML=items(trouves)||'<p>Aucun matériel trouvé.</p>';return;}
 if(vehicle===null){choix.innerHTML=[...new Set(rows.map(r=>r.vehicule))].map(v=>bouton(v,'vehicule',v,'Choisir un coffre')).join('')||'<p>Aucun matériel disponible.</p>';return;}
 const back=bouton('← '+(zone===null?'Véhicules':vehicle),'retour','');
 if(zone===null){choix.innerHTML=back+[...new Set(rows.filter(r=>r.vehicule===vehicle).map(r=>r.zone))].map(z=>bouton(z,'zone',z)).join('');return;}
 choix.innerHTML=back+'<h4>'+esc(zone)+'</h4>'+items(rows.filter(r=>r.vehicule===vehicle&&r.zone===zone));
 }
 box.querySelector('input[type=search]').addEventListener('input',e=>{terme=e.target.value;render();});
 box.addEventListener('click',e=>{const b=e.target.closest('[data-lien-action]');if(!b)return;const v=b.dataset.lienValeur;switch(b.dataset.lienAction){case 'vehicule':vehicle=v;zone=null;break;case 'zone':zone=v;break;case 'retour':if(zone!==null)zone=null;else vehicle=null;break;case 'choisir':if(!rows.some(r=>String(r.id)===v))return;select.value=v;select.dispatchEvent(new Event('change',{bubbles:true}));break;case 'effacer':select.value='';select.dispatchEvent(new Event('change',{bubbles:true}));break;}render();});
 const afficher=data=>{rows=Array.isArray(data)?data:[];render();};
 render();
 try{let cached=null;try{cached=JSON.parse(localStorage.getItem(key)||'null');}catch(_){}if(Array.isArray(cached))afficher(cached);if(!navigator.onLine){statut.textContent='Liste enregistrée sur cet appareil.';return;}const data=await rpc('vsav_correspondances_inventaire');if(!select.isConnected||owner!==String(utilisateurConnecte?.id||''))return;afficher(data);try{localStorage.setItem(key,JSON.stringify(rows));}catch(_){}statut.textContent='';}catch(e){if(statut.isConnected&&owner===String(utilisateurConnecte?.id||''))statut.textContent='Liste indisponible : '+(e.message||'réessaie.');}
}
async function importerAlertes(){const uid=String(utilisateurConnecte?.id||'');if(!uid||!navigator.onLine)return;if(compte!==uid){compte=uid;derniereLecture=0;lecture=null;}if(lecture)return lecture;if(Date.now()-derniereLecture<30000)return;
 const demande=(async()=>{try{const rows=await rpc('vsav_notifications_lire',{},6000);if(String(utilisateurConnecte?.id)!==uid)return;const store=await chargerHistoriqueNotificationsModule();for(const r of rows||[]){if(String(utilisateurConnecte?.id)!==uid)return;await store.receive({notification_id:String(r.id).slice(uid.length+1),title:r.titre,body:r.description,target:'suivi-vsav',receivedAt:r.recu_le},uid);if(r.lu)await store.read(r.id,uid);}derniereLecture=Date.now();}catch(e){console.warn('Alertes VSAV : reprise différée.',e?.message||e);}})();lecture=demande;try{await demande;}finally{if(lecture===demande)lecture=null;}}
function lireCles(){const texte=localStorage.getItem('cis-vsav-rearmements-pending-v1');if(!texte)return {};const x=JSON.parse(texte);if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Journal local de réarmement illisible.');return x;}
function cleOperation(signature){const x=lireCles();if(!x[signature]){x[signature]=crypto.randomUUID();localStorage.setItem('cis-vsav-rearmements-pending-v1',JSON.stringify(x));}return x[signature];}
function oublierOperation(signature){const x=lireCles();delete x[signature];localStorage.setItem('cis-vsav-rearmements-pending-v1',JSON.stringify(x));}
function carte(r){const classe=r.reception_le?'recu':r.commande_le?'commande':'commander';const etat=r.reception_le?'Reçu — à remettre dans le VSAV':r.commande_le?'Commande passée — en attente de réception':'À commander — VSAV à réarmer';return `<article class="vsav-attente" style="margin:14px 0;padding:18px;border:2px solid #bd252b;border-radius:14px;background:#ffe8e8;color:#302626"><h3>${esc(r.nom)}</h3><div class="vsav-statut vsav-statut-${classe}" role="status">${esc(etat)}</div><p>Intervention ${esc(r.numero)} · ${esc(r.date_intervention)}</p><p>Utilisé : ${r.quantite} · Déjà remis : ${r.remis}<br><strong>Reste à remettre : ${r.restant}</strong></p><p>Déclaré par ${esc(r.auteur_nom)}</p><div class="vsav-attente-actions" style="display:flex;flex-wrap:wrap;gap:10px">${!r.commande_le?`<button type="button" class="equipe-action-button" data-vsav-action="commander" data-vsav-id="${esc(r.id)}">Commande passée</button>`:''}${!r.reception_le?`<button type="button" class="equipe-action-button" data-vsav-action="receptionner" data-vsav-id="${esc(r.id)}">Commande reçue</button>`:''}</div><label style="display:block;margin-top:14px">Quantité remise dans le VSAV <input type="number" data-vsav-quantite min="1" max="${r.restant}" step="1" value="${r.restant}" style="font-size:16px;width:100px;padding:10px"></label><button type="button" class="equipe-action-button" data-vsav-action="rearmer" data-vsav-id="${esc(r.id)}">Réarmement effectué</button><p role="status" data-vsav-resultat></p></article>`;}
async function chargerSuivi(box){stylesVSAV();if(!box?.isConnected)return;const owner=String(utilisateurConnecte?.id||''),generation=(suiviGenerations.get(box)||0)+1;suiviGenerations.set(box,generation);box.textContent='Chargement du réarmement…';try{const rows=await rpc('vsav_sans_stock_lire');if(!box.isConnected||suiviGenerations.get(box)!==generation||String(utilisateurConnecte?.id||'')!==owner)return;box.innerHTML='<h2>Matériel utilisé sans réserve pharmacie</h2>'+((rows||[]).map(carte).join('')||'<p>Aucun réarmement en attente.</p>');}catch(e){if(box.isConnected&&suiviGenerations.get(box)===generation&&String(utilisateurConnecte?.id||'')===owner)box.textContent='Réarmement indisponible : '+(e.message||'réessaie.');}}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-vsav-action]');if(!b||b.disabled)return;const card=b.closest('.vsav-attente'),status=card.querySelector('[data-vsav-resultat]'),id=b.dataset.vsavId,action=b.dataset.vsavAction;
 const quantite=action==='rearmer'?Number(card.querySelector('[data-vsav-quantite]').value):0;
 if(action==='rearmer'&&(!Number.isSafeInteger(quantite)||quantite<1)){status.textContent='Indique une quantité entière positive.';return;}
 if(!await afficherConfirmationCIS(action==='rearmer'?`Confirmer que ${quantite} unité(s) ont réellement été remises dans le VSAV ?`:'Confirmer cette étape ?'))return;
 const signature=[String(utilisateurConnecte?.id||''),id,action,quantite].join(':');card.querySelectorAll('button,input').forEach(x=>x.disabled=true);
 try{const cle=cleOperation(signature);await rpc('vsav_sans_stock_traiter',{p_cle:cle,p_ligne:id,p_action:action,p_quantite:quantite});oublierOperation(signature);if(card.isConnected)await chargerSuivi(card.closest('#suivi-vsav-attente'));}
 catch(error){if(status.isConnected)status.textContent=(error.message||'Réponse non reçue.')+' Réessaie avec la même quantité ; aucun double réarmement ne sera appliqué.';card.querySelectorAll('button,input').forEach(x=>x.disabled=false);}
});
setInterval(()=>{if(!document.hidden&&utilisateurConnecte?.id)void importerAlertes().then(()=>actualiserPointNotifications());},45000);
g.CISVSAVSansStock={configurerFormulaire,importerAlertes,chargerSuivi};
})(globalThis);
