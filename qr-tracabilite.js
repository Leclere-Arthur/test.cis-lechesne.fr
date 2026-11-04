/* CIS Le Chesne — Module de traçabilité QR — VERSION TEST UNIQUEMENT.
 * Dépendances de démonstration PDF/caméra chargées via CDN ; phase de tests avec Internet.
 * Les opérations QR restent dans les tables cis_qr_*, isolées des stocks historiques.
 */
(function (g) {
'use strict';
if (!g.CIS_MODE_TEST) { console.warn('Traçabilité QR : chargement interdit hors application de test.'); return; }
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state = { config:new Set(), loaded:false, lots:[], retour:new Map(), scanner:null, scanModal:null, cours:false };
const chargementsSuivi=new WeakSet();
const uid = () => String(typeof utilisateurConnecte !== 'undefined' ? utilisateurConnecte?.id || '' : '');
const isAdmin = () => typeof utilisateurAPermission === 'function' && utilisateurAPermission('acces_administration') && utilisateurAPermission('acces_gestion_materiel');
const client = () => typeof obtenirClientSupabase === 'function' && obtenirClientSupabase();
const materiel = id => (typeof materiels !== 'undefined' ? materiels : []).find(m => String(m.id)===String(id));
function setStatut(id, message, error=false){const e=document.getElementById(id);if(e){e.textContent=message||'';e.className='cisqr-status '+(error?'cisqr-error':'cisqr-ok');}}
function erreur(e) { const t=String(e?.message||e); return /Could not find the function|schema cache|does not exist/i.test(t)?'Le SQL du module QR n’a pas encore été installé dans le Supabase de TEST. '+t:t; }
async function rpc(name,args={}){
 if(!navigator.onLine)throw Error('Connexion requise pour confirmer les mouvements QR. Aucune modification effectuée.');
 const s=client();if(!s)throw Error('Supabase indisponible.');
 const {data,error}=await s.rpc(name,args);if(error)throw Error(error.message||String(error));return data;
}
async function config(force=false){if(state.loaded&&!force)return state.config;const rows=await rpc('cis_qr_config_lire');state.config=new Set((rows||[]).filter(x=>x.actif).map(x=>String(x.materiel_id)));state.loaded=true;return state.config;}
function estSuivi(id){return state.config.has(String(id));}
function newID(){return crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=crypto.getRandomValues(new Uint8Array(1))[0]%16;return(c==='x'?r:(r&3|8)).toString(16)});}
const scripts=new Map();function load(url,test){if(test())return Promise.resolve();if(scripts.has(url))return scripts.get(url);const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=()=>test()?resolve():reject(Error('Bibliothèque chargée mais indisponible'));s.onerror=()=>reject(Error('Impossible de télécharger la bibliothèque. Vérifie la connexion Internet.'));document.head.appendChild(s)});scripts.set(url,p);return p;}
async function exporterPDF(codes,label='lot'){
 if(!g.CISQRLocalPDF)throw Error('Module PDF local indisponible. Actualise l’application pour installer la mise à jour.');
 return g.CISQRLocalPDF.exporter(codes,label);
}
async function scanner(callback){
 if(state.scanModal)return;
 const backdrop=document.createElement('div');backdrop.className='cisqr-scan-dialog';backdrop.innerHTML=`<div class="cisqr-scan-card" role="dialog" aria-modal="true" aria-label="Scanner une étiquette QR"><h2>Scanner le QR code</h2><p>Place le QR code dans le cadre. Le scan est automatique.</p><div class="cisqr-reader" id="cisqr-camera"></div><p id="cisqr-camera-status" class="cisqr-small">Activation de la caméra…</p><div class="cisqr-row"><input id="cisqr-manuel" placeholder="Référence QR (6 chiffres)" inputmode="numeric" maxlength="40" autocomplete="off" aria-label="Identifiant QR"><button type="button" id="cisqr-manuel-go">Valider le code</button></div><button type="button" id="cisqr-fermer">Fermer</button></div>`;
 document.body.appendChild(backdrop);state.scanModal=backdrop;let done=false;
 const cleanup=async()=>{if(state.scanner){try{await state.scanner.stop();}catch(_){}try{state.scanner.clear();}catch(_){}state.scanner=null;}backdrop.remove();if(state.scanModal===backdrop)state.scanModal=null;};
 const found=async(code)=>{if(done)return;done=true;await cleanup();try{await callback(String(code).trim().toUpperCase());}catch(e){alert(erreur(e));}};
 backdrop.querySelector('#cisqr-fermer').onclick=()=>{done=true;void cleanup();};
 backdrop.querySelector('#cisqr-manuel-go').onclick=()=>{const c=backdrop.querySelector('#cisqr-manuel').value.trim();if(c)void found(c)};
 try{
  await load('https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',()=>typeof g.Html5Qrcode==='function');
  if(done)return;
  const options={fps:12,aspectRatio:1.3,disableFlip:false};
  const reader=new g.Html5Qrcode('cisqr-camera',{verbose:false,formatsToSupport:[g.Html5QrcodeSupportedFormats.QR_CODE]});state.scanner=reader;
  await reader.start({facingMode:'environment'},options,code=>void found(code),()=>{});
  if(backdrop.isConnected)backdrop.querySelector('#cisqr-camera-status').textContent='Caméra activée — lecture automatique.';
 }catch(e){if(!done&&backdrop.isConnected){backdrop.querySelector('#cisqr-camera-status').textContent='Caméra indisponible : '+erreur(e)+'. Saisie manuelle possible.';}}
}
function shell(titre,inside){document.getElementById('app').innerHTML=`<main class="cisqr-page"><button type="button" onclick="afficherMenuAdministration()">← Retour administration</button><h1>${titre}</h1><p class="cisqr-app-test-note">VERSION TEST — ces mouvements QR utilisent uniquement les tables QR du projet Supabase de test.</p>${inside}</main>${typeof navigationPrincipale==='function'?navigationPrincipale('pharmacie','pharmacie'):''}`;}
function labelPosition(code){return esc(String(code).slice(0,14))+'…';}
async function ouvrir(){
 if(!isAdmin())return alert('Fonction réservée aux administrateurs pharmacie.');
 shell('Traçabilité QR code',`<section class="cisqr-panel"><h2>Générer des étiquettes vierges</h2><div class="cisqr-row"><label for="cisqr-qt">Quantité</label><select id="cisqr-qt"><option>10</option><option>25</option><option selected>50</option><option>100</option></select><button class="cisqr-main" id="cisqr-generer">Générer le lot</button></div><p>Références aléatoires à 6 chiffres, réservées définitivement dans Supabase avant le téléchargement du PDF.</p><p id="cisqr-generation-statut" class="cisqr-status"></p></section><section class="cisqr-panel"><button id="cisqr-avance" class="cisqr-main">Traçabilité avancée</button> <button id="cisqr-reappro">Réapprovisionnement QR (TEST)</button></section><section class="cisqr-panel"><h2>Lots déjà créés</h2><div id="cisqr-lots">Chargement…</div></section><section class="cisqr-panel"><h2>Attribuer ou déplacer une étiquette</h2><div class="cisqr-row"><button id="cisqr-assigner" class="cisqr-main">Scanner une étiquette vierge</button><button id="cisqr-deplacer">Déplacer un exemplaire (stock / VSAV)</button></div></section><section class="cisqr-panel"><h2>Matériels suivis et manquants</h2><div id="cisqr-materiels">Chargement…</div></section>`);
 document.getElementById('cisqr-generer').onclick=generer;
 document.getElementById('cisqr-avance').onclick=()=>void ouvrirAvance();
 document.getElementById('cisqr-reappro').onclick=()=>void reapprovisionnerParUnite();
 document.getElementById('cisqr-assigner').onclick=()=>void choisirUnitePuisScanner(false);
 document.getElementById('cisqr-deplacer').onclick=()=>void scanner(async code=>{const f=await rpc('cis_qr_fiche',{p_code:code});if(!f||f.etat!=='attribuee')throw Error('QR non attribué');const lieu=f.emplacement==='vsav'?'pharmacie':'vsav';if(!confirm('Déplacer '+f.nom+' ('+code+') vers '+lieu.toUpperCase()+' ?'))return;await rpc('cis_qr_deplacer',{p_code:code,p_emplacement:lieu});alert('Déplacement enregistré.');await afficherProduits();});
 try{await config(true);await Promise.all([chargerLots(),afficherProduits()]);}catch(e){setStatut('cisqr-generation-statut',erreur(e),true);document.getElementById('cisqr-lots').textContent='Installation SQL requise pour activer les QR codes.';}
}
async function generer(){const b=document.getElementById('cisqr-generer');if(!b)return;b.disabled=true;setStatut('cisqr-generation-statut','Création des identifiants…');try{
 const n=Number(document.getElementById('cisqr-qt').value);const result=await rpc('cis_qr_generer_lot',{p_quantite:n});
 // Si le PDF est bloqué, le lot existe déjà et reste réexportable dans l’application.
 setStatut('cisqr-generation-statut',`Lot créé : ${n} étiquettes uniques. Préparation du PDF…`);await chargerLots();
 await exporterPDF(result.codes,result.lot_id.slice(0,8));setStatut('cisqr-generation-statut','PDF enregistré. Lot disponible pour réimpression.');await chargerLots();
 }catch(e){setStatut('cisqr-generation-statut',erreur(e),true);try{await chargerLots();}catch(_){}}finally{b.disabled=false;}}
async function chargerLots(){const el=document.getElementById('cisqr-lots');if(!el)return;const lots=await rpc('cis_qr_lots_lire');state.lots=lots||[];el.innerHTML=lots.length?lots.map(l=>`<div class="cisqr-label"><strong>Lot ${esc(l.lot_id.slice(0,8))}</strong><span>${l.total} étiquettes · ${l.vierges} vierges</span><div class="cisqr-row"><button type="button" data-pdf-lot="${esc(l.lot_id)}">Exporter en PDF</button></div></div>`).join(''):'Aucun lot créé.';el.querySelectorAll('[data-pdf-lot]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{const codes=await rpc('cis_qr_lot_etats',{p_lot:b.dataset.pdfLot});await exporterPDF(codes,b.dataset.pdfLot.slice(0,8));}catch(e){alert(erreur(e));}finally{b.disabled=false;}});}
async function afficherProduits(){const el=document.getElementById('cisqr-materiels');if(!el)return;const r=await rpc('cis_qr_suivi_lire');const liste=typeof materiels!=='undefined'?materiels.filter(x=>estSuivi(x.id)):[];el.innerHTML=liste.length?liste.map(m=>{const manque=(r||[]).find(q=>q.materiel_id===m.id)?.manquant||0;return `<div class="cisqr-label"><strong>${esc(m.nom)}</strong><span>QR actifs · Manquants VSAV : <b class="${manque?'cisqr-error':''}">${manque}</b></span><div class="cisqr-row"><button data-assign-id="${esc(m.id)}">Attribuer QR</button><button data-list-id="${esc(m.id)}">Voir les exemplaires</button></div><div id="cisqr-sub-${esc(m.id)}"></div></div>`;}).join(''):'Aucun produit n’a été activé pour le suivi QR. Active un produit depuis Gestion du matériel → Modifier.';el.querySelectorAll('[data-assign-id]').forEach(b=>b.onclick=()=>void attribuerMateriel(b.dataset.assignId));el.querySelectorAll('[data-list-id]').forEach(b=>b.onclick=()=>void afficherExemplaires(b.dataset.listId));}
async function afficherExemplaires(id){const box=document.getElementById('cisqr-sub-'+id);if(!box)return;box.textContent='Chargement…';try{const data=await rpc('cis_qr_exemplaires_lire',{p_materiel:id});box.innerHTML=(data||[]).map(x=>`<p class="cisqr-card-detail"><code>${esc(x.code)}</code> — ${esc(x.emplacement||x.etat)} — Péremption : ${esc(x.peremption||'non renseignée')} — Lot : ${esc(x.lot||'—')}</p>`).join('')||'Aucun exemplaire attribué.';}catch(e){box.textContent=erreur(e);}}
async function attribuerMateriel(id){await choisirUnitePuisScanner(false,id);}
/* Réapprovisionnement TEST : chaque exemplaire a son QR distinct. */
async function reapprovisionnerParUnite(selected=null){
 if(!isAdmin())return alert('Accès réservé à la pharmacie.');
 try{await config(true);}catch(e){return alert(erreur(e));}
 const possibles=(typeof materiels!=='undefined'?materiels:[]).filter(m=>estSuivi(m.id));
 if(!possibles.length)return alert('Active d’abord le suivi QR pour un matériel.');
 const w=document.createElement('div');w.className='cisqr-scan-dialog';
 w.innerHTML=`<div class="cisqr-scan-card" role="dialog" aria-modal="true" aria-label="Réapprovisionnement par unité"><h2>Réapprovisionnement QR — TEST</h2>
 <label for="cisqr-mat">Matériel</label><select id="cisqr-mat">${possibles.map(m=>`<option value="${esc(m.id)}" ${String(m.id)===String(selected)?'selected':''}>${esc(m.nom)}</option>`).join('')}</select>
 <div id="cisqr-demarrage"><label for="cisqr-quantite">Quantité à enregistrer</label><input id="cisqr-quantite" type="number" min="1" max="100" step="1" value="1" inputmode="numeric"><p class="cisqr-small">Chaque unité doit posséder un QR code unique, sa date de péremption et sa destination.</p><button class="cisqr-main" id="cisqr-commencer">Commencer</button></div>
 <div id="cisqr-etape" hidden><h3 id="cisqr-progression">Unité 1/1</h3><p id="cisqr-confirmes" class="cisqr-small"></p>
 <label for="cisqr-lot">Numéro de lot (facultatif)</label><input id="cisqr-lot" autocomplete="off" placeholder="Lot fabricant">
 <label for="cisqr-peremption">Date de péremption</label><input type="date" id="cisqr-peremption">
 <label for="cisqr-destination">Destination de cette unité</label><select id="cisqr-destination"><option value="pharmacie">Réserve pharmacie</option><option value="vsav">VSAV</option></select>
 <button class="cisqr-main" id="cisqr-unite-scan">Scanner le QR de cette unité</button></div>
 <p id="cisqr-unite-statut" class="cisqr-status" aria-live="polite"></p><button id="cisqr-unite-annuler">Fermer</button></div>`;
 document.body.appendChild(w);
 const mat=w.querySelector('#cisqr-mat'),etape=w.querySelector('#cisqr-etape'),depart=w.querySelector('#cisqr-demarrage');
 let total=0,fait=0,occupe=false,pending=null;const codes=new Set();
 const statut=(m,err=false)=>setStatut('cisqr-unite-statut',m,err);
 function actualiser(){w.querySelector('#cisqr-progression').textContent=`Unité ${fait+1}/${total}`;w.querySelector('#cisqr-confirmes').textContent=`${fait} unité(s) enregistrée(s) sur ${total}.`;}
 w.querySelector('#cisqr-unite-annuler').onclick=()=>{if(occupe)return;if(fait&&fait<total&&!confirm(`${fait} unité(s) déjà enregistrée(s). Fermer sans enregistrer les autres ?`))return;w.remove();};
 w.querySelector('#cisqr-commencer').onclick=()=>{const n=Number(w.querySelector('#cisqr-quantite').value);if(!Number.isInteger(n)||n<1||n>100)return statut('Indique une quantité entière entre 1 et 100.',true);total=n;mat.disabled=true;depart.hidden=true;etape.hidden=false;actualiser();statut('Scanne le QR unique de la première unité.');};
 w.querySelector('#cisqr-unite-scan').onclick=async()=>{
  if(occupe||fait>=total)return;
  const peremption=w.querySelector('#cisqr-peremption').value;
  if(!peremption)return statut('Renseigne la date de péremption de cette unité.',true);
  const destination=w.querySelector('#cisqr-destination').value;
  const lot=w.querySelector('#cisqr-lot').value.trim();
  await scanner(async code=>{
   if(occupe)return;occupe=true;const bouton=w.querySelector('#cisqr-unite-scan');bouton.disabled=true;
   try{
    if(codes.has(code))throw Error('Ce QR a déjà été utilisé dans ce réapprovisionnement. Chaque unité doit avoir un QR différent.');
    if(pending?.id&&pending.code!==code)throw Error('Une unité a déjà été créée pour le QR '+pending.code+'. Réessaie avec ce même QR pour éviter une unité orpheline.');
    const fiche=await rpc('cis_qr_fiche',{p_code:code});
    if(!fiche)throw Error('QR inconnu : génère d’abord des étiquettes QR dans le module de test.');
    if(fiche.etat!=='vierge')throw Error('QR déjà attribué ou utilisé : ce code ne peut pas être réutilisé.');
    if(!confirm(`Confirmer l’unité ${fait+1}/${total} ?\nQR : ${code}\nPéremption : ${peremption}\nDestination : ${destination==='vsav'?'VSAV':'Réserve'}`))return;
    // On réutilise l’unité créée si l’envoi échoue, afin d’éviter les doublons lors d’un nouvel essai.
    if(!pending||pending.code!==code){pending={code,id:null};}
    if(!pending.id){
     const u=await rpc('cis_qr_unite_creer',{p_materiel:mat.value,p_reference:'Unité '+newID().slice(0,8).toUpperCase(),p_emplacement:destination});
     if(!u?.id)throw Error('Création de l’unité non confirmée par Supabase.');
     pending.id=u.id;
    }
    await rpc('cis_qr_reapprovisionner',{p_code:code,p_unite:pending.id,p_lot:lot,p_peremption:peremption,p_emplacement:destination});
    codes.add(code);pending=null;fait++;actualiser();
    if(fait>=total){statut(`Terminé : ${fait} unités distinctes enregistrées et confirmées par Supabase.`);bouton.hidden=true;w.querySelector('#cisqr-unite-annuler').textContent='Terminer';if(document.getElementById('cisqr-materiels'))await afficherProduits();}
    else{statut(`Unité ${fait}/${total} enregistrée. Passe à la suivante.`);}
   }catch(e){statut(erreur(e),true);throw e;}
   finally{occupe=false;bouton.disabled=false;}
  });
 };
}

/* Pont du réapprovisionnement classique vers la traçabilité individuelle (TEST). */
async function enregistrerDepuisReapproClassique(materielId, quantite, uniteConfirmee){
 if(!isAdmin())throw Error('Accès pharmacie requis.');
 await config(true);
 if(!estSuivi(materielId))throw Error('Ce matériel n’est pas configuré pour le suivi QR.');
 const n=Number(quantite);
 if(!Number.isInteger(n)||n<1||n>99)throw Error('Quantité incorrecte.');
 return new Promise(resolve=>{
  const w=document.createElement('div');w.className='cisqr-scan-dialog';
  w.innerHTML=`<div class="cisqr-scan-card" role="dialog" aria-modal="true"><h2>Réapprovisionnement — unités QR</h2><p><strong>${esc(materiel(materielId)?.nom||'Matériel')}</strong></p><h3 id="cisqr-progress-classique">Unité 1/${n}</h3><p id="cisqr-count-classique" class="cisqr-small">0 unité enregistrée.</p><label>Numéro de lot (facultatif)</label><input id="cisqr-lot-classique" autocomplete="off"><label>Date de péremption</label><input id="cisqr-date-classique" type="date"><label>Destination</label><select id="cisqr-lieu-classique"><option value="pharmacie">Réserve</option><option value="vsav">VSAV</option></select><p id="cisqr-status-classique" role="status" class="cisqr-status"></p><div class="cisqr-row"><button type="button" class="cisqr-main" id="cisqr-scan-classique">Scanner le QR de cette unité</button><button type="button" id="cisqr-stop-classique">Fermer</button></div></div>`;
  document.body.appendChild(w);
  let fait=0,busy=false,pending=null;const codes=new Set();
  const status=(t)=>{const e=w.querySelector('#cisqr-status-classique');if(e)e.textContent=t;};
  const terminer=()=>{w.remove();resolve({enregistrees:fait,total:n,termine:fait===n});};
  w.querySelector('#cisqr-stop-classique').onclick=()=>{if(busy)return;if(fait<n&&fait&&!confirm(`${fait} unité(s) enregistrée(s) sur ${n}. Fermer maintenant ?`))return;terminer();};
  w.querySelector('#cisqr-scan-classique').onclick=async()=>{
   if(busy)return;
   const date=w.querySelector('#cisqr-date-classique').value;
   if(!date){status('Indique la date de péremption de cette unité.');return;}
   const lieu=w.querySelector('#cisqr-lieu-classique').value;
   const lot=w.querySelector('#cisqr-lot-classique').value.trim();
   await scanner(async code=>{
    if(busy)return;busy=true;const b=w.querySelector('#cisqr-scan-classique');b.disabled=true;
    try{
     if(codes.has(code))throw Error('Ce QR a déjà été scanné. Chaque unité doit avoir son propre QR.');
     const f=await rpc('cis_qr_fiche',{p_code:code});
     if(!f)throw Error('QR inconnu. Génère les étiquettes dans Traçabilité QR.');
     if(f.etat!=='vierge')throw Error('QR déjà utilisé : attribution impossible.');
     if(!confirm(`Confirmer l’unité ${fait+1}/${n} ?\nQR : ${code}\nPéremption : ${date}\nDestination : ${lieu==='vsav'?'VSAV':'Réserve'}`))return;
     if(!pending||pending.code!==code)pending={code,id:null};
     if(!pending.id){const u=await rpc('cis_qr_unite_creer',{p_materiel:materielId,p_reference:'Unité '+newID().slice(0,8).toUpperCase(),p_emplacement:lieu});if(!u?.id)throw Error('Unité non confirmée.');pending.id=u.id;}
     await rpc('cis_qr_reapprovisionner',{p_code:code,p_unite:pending.id,p_lot:lot,p_peremption:date,p_emplacement:lieu});
     codes.add(code);pending=null;fait++;
     // Notification immédiate au réapprovisionnement classique, une seule fois par QR confirmé.
     await uniteConfirmee(code,lieu);
     w.querySelector('#cisqr-count-classique').textContent=`${fait} unité(s) enregistrée(s) sur ${n}.`;
     if(fait===n){status('Toutes les unités ont été enregistrées.');terminer();}
     else{w.querySelector('#cisqr-progress-classique').textContent=`Unité ${fait+1}/${n}`;status('Unité confirmée. Scanne la suivante.');}
    }catch(e){status(erreur(e));throw e;}
    finally{busy=false;if(b.isConnected)b.disabled=false;}
   });
  };
 });
}
g.CISQRReapproClassique={estSuivi:async id=>{await config(true);return estSuivi(id);},enregistrer:enregistrerDepuisReapproClassique};
async function choisirUnitePuisScanner(reappro=false,selected=null){
 if(!isAdmin())return alert('Accès réservé à la pharmacie.');
 try{await config(true);}catch(e){return alert(erreur(e));}
 const possibles=(typeof materiels!=='undefined'?materiels:[]).filter(m=>estSuivi(m.id));
 if(!possibles.length)return alert('Active d’abord le suivi QR pour un matériel.');
 const w=document.createElement('div');w.className='cisqr-scan-dialog';
 w.innerHTML=`<div class="cisqr-scan-card" role="dialog" aria-modal="true"><h2>${reappro?'Réapprovisionnement QR':'Attribuer une étiquette vierge'}</h2>
 <label>Matériel</label><select id="cisqr-mat">${possibles.map(m=>`<option value="${esc(m.id)}" ${String(m.id)===String(selected)?'selected':''}>${esc(m.nom)}</option>`).join('')}</select>
 <label>Unité physique précise</label><select id="cisqr-unite"></select>
 <div class="cisqr-row"><input id="cisqr-nouvelle-unite" placeholder="Nouvelle unité (ex : Bouteille 03)"><select id="cisqr-unite-place"><option value="pharmacie">Réserve pharmacie</option><option value="vsav">VSAV</option></select><button id="cisqr-ajouter-unite">Créer unité</button></div>
 <p class="cisqr-small">Chaque unité possède un identifiant unique. Une unité déjà équipée d’un QR actif ne peut pas recevoir une seconde étiquette.</p>
 <label>Numéro de lot</label><input id="cisqr-lot" placeholder="Numéro de lot">
 <label>Date de péremption</label><input type="date" id="cisqr-peremption">
 ${reappro?'<label>Destination du réapprovisionnement</label><select id="cisqr-destination"><option value="pharmacie">Stock pharmacie</option><option value="vsav">VSAV</option></select>':''}
 <p id="cisqr-unite-statut" class="cisqr-status"></p><div class="cisqr-row"><button class="cisqr-main" id="cisqr-unite-scan">Continuer : scanner le QR vierge</button><button id="cisqr-unite-annuler">Annuler</button></div></div>`;
 document.body.appendChild(w);
 const mat=w.querySelector('#cisqr-mat'),unit=w.querySelector('#cisqr-unite');
 async function refresh(){unit.innerHTML='<option value="">Chargement…</option>';try{const us=await rpc('cis_qr_unites_lire',{p_materiel:mat.value});unit.innerHTML='<option value="">Sélectionner une unité libre</option>'+us.filter(u=>!u.code).map(u=>`<option value="${esc(u.id)}">${esc(u.reference)} — ${u.emplacement==='vsav'?'VSAV':'Réserve'}</option>`).join('');if(!us.some(u=>!u.code))setStatut('cisqr-unite-statut','Aucune unité libre : crée une unité physique.',false);}catch(e){setStatut('cisqr-unite-statut',erreur(e),true);}}
 mat.onchange=()=>void refresh();await refresh();
 w.querySelector('#cisqr-unite-annuler').onclick=()=>w.remove();
 w.querySelector('#cisqr-ajouter-unite').onclick=async()=>{const b=w.querySelector('#cisqr-ajouter-unite');b.disabled=true;try{const u=await rpc('cis_qr_unite_creer',{p_materiel:mat.value,p_reference:w.querySelector('#cisqr-nouvelle-unite').value,p_emplacement:w.querySelector('#cisqr-unite-place').value});await refresh();unit.value=u.id;setStatut('cisqr-unite-statut','Unité créée.');}catch(e){setStatut('cisqr-unite-statut',erreur(e),true);}finally{b.disabled=false;}};
 w.querySelector('#cisqr-unite-scan').onclick=async()=>{
  if(!unit.value)return setStatut('cisqr-unite-statut','Sélectionne une unité physique précise.',true);
  const params={p_unite:unit.value,p_lot:w.querySelector('#cisqr-lot').value,p_peremption:w.querySelector('#cisqr-peremption').value||null};
  if(reappro)params.p_emplacement=w.querySelector('#cisqr-destination').value;
  await scanner(async code=>{const f=await rpc('cis_qr_fiche',{p_code:code});if(!f)throw Error('QR inconnu : il ne figure pas dans les lots enregistrés.');if(f.etat!=='vierge')throw Error('QR non vierge : '+f.etat);
   if(!confirm('Confirmer '+(reappro?'le réapprovisionnement':'l’attribution')+' de cette unité avec le QR '+code+' ?'))return;
   try{await rpc(reappro?'cis_qr_reapprovisionner':'cis_qr_attribuer_unite',{p_code:code,...params});w.remove();alert('Opération QR enregistrée.');if(document.getElementById('cisqr-materiels'))await afficherProduits();}catch(e){setStatut('cisqr-unite-statut',erreur(e),true);throw e;}
  });
 };
}
async function ouvrirAvance(){
 if(!isAdmin())return;
 shell('Traçabilité avancée',`<section class="cisqr-panel"><button id="cisqr-adv-retour">Retour à la traçabilité QR</button><h2>Rechercher une unité ou un QR code</h2><div class="cisqr-row"><input id="cisqr-adv-search" placeholder="Code QR ou numéro de lot"><button id="cisqr-adv-go">Rechercher</button><button id="cisqr-adv-scan" class="cisqr-main">Scanner un QR code</button></div><p id="cisqr-adv-status" class="cisqr-status"></p><div id="cisqr-adv-results"></div></section><section class="cisqr-panel" id="cisqr-adv-detail"><h2>Fiche et historique détaillé</h2><p>Sélectionne une unité ou scanne son QR code.</p></section>`);
 document.getElementById('cisqr-adv-retour').onclick=()=>void ouvrir();
 document.getElementById('cisqr-adv-scan').onclick=()=>void scanner(code=>afficherHistorique(code));
 document.getElementById('cisqr-adv-go').onclick=()=>void rechercherHistorique();
 document.getElementById('cisqr-adv-search').onkeydown=e=>{if(e.key==='Enter')void rechercherHistorique();};
 await rechercherHistorique();
}
async function rechercherHistorique(){try{const q=document.getElementById('cisqr-adv-search')?.value||'';const rows=await rpc('cis_qr_historique_rechercher',{p_recherche:q});const host=document.getElementById('cisqr-adv-results');if(!host)return;host.innerHTML=rows.length?rows.map(x=>`<div class="cisqr-label"><strong>${esc(x.materiel||'Matériel')} — ${esc(x.unite||'Unité non renseignée')}</strong><p><code>${esc(x.code)}</code> · ${esc(x.etat)} · ${esc(x.emplacement||'—')}</p><button data-cisqr-hist="${esc(x.code)}">Voir la fiche complète</button></div>`).join(''):'Aucun résultat.';host.querySelectorAll('[data-cisqr-hist]').forEach(b=>b.onclick=()=>void afficherHistorique(b.dataset.cisqrHist));}catch(e){setStatut('cisqr-adv-status',erreur(e),true);}}
function cisqrDate(d){if(!d)return '—';const x=new Date(d);return Number.isNaN(x.getTime())?'—':x.toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});}
function cisqrJour(d){if(!d)return '—';const x=new Date(d);return Number.isNaN(x.getTime())?'—':x.toLocaleDateString('fr-FR');}
function cisqrLieu(v){return ({vsav:'VSAV',pharmacie:'Réserve pharmacie',sorti:'Sorti du VSAV',utilise:'Utilisé',attribuee:'Attribué',vierge:'Vierge',utilisee:'Utilisé'})[v]||v||'Non renseigné';}
function cisqrNomUtilisateur(id){
 if(!id)return 'Utilisateur non renseigné';
 const pools=[typeof utilisateurs!=='undefined'?utilisateurs:null,typeof listeUtilisateurs!=='undefined'?listeUtilisateurs:null];
 for(const pool of pools){if(!Array.isArray(pool))continue;const u=pool.find(x=>String(x.id)===String(id)||String(x.user_id)===String(id));if(u){const n=[u.prenom,u.nom].filter(Boolean).join(' ').trim();if(n)return n;if(u.nom_complet)return u.nom_complet;}}
 if(String(uid())===String(id)&&typeof utilisateurConnecte!=='undefined'){const u=utilisateurConnecte;const n=[u.prenom,u.nom].filter(Boolean).join(' ').trim();if(n)return n;}
 return 'Utilisateur non identifié';
}
function cisqrNature(n){return ({attribution:['QR code attribué','tag','attribution'],utilisation:['Matériel utilisé','check','utilisation'],deplacement:['Matériel déplacé','move','deplacement'],reapprovisionnement:['Matériel réapprovisionné','plus','reapprovisionnement'],rearmement:['Matériel réarmé','plus','reapprovisionnement'],modification:['Fiche modifiée','edit','modification']})[n]||[String(n||'Mouvement').replaceAll('_',' '),'info','modification'];}
function cisqrDetailMouvement(e){
 const avant=e.ancien&&typeof e.ancien==='object'?e.ancien:{};const apres=e.nouveau&&typeof e.nouveau==='object'?e.nouveau:{};
 const parts=[];
 if(avant.emplacement!==apres.emplacement&&apres.emplacement)parts.push((avant.emplacement?cisqrLieu(avant.emplacement)+' → ':'')+cisqrLieu(apres.emplacement));
 if(apres.numero_lot&&avant.numero_lot!==apres.numero_lot)parts.push('Lot : '+apres.numero_lot);
 if(apres.date_peremption&&avant.date_peremption!==apres.date_peremption)parts.push('Péremption : '+cisqrJour(apres.date_peremption));
 if(apres.commentaire)parts.push('Commentaire : '+apres.commentaire);
 return parts;
}
async function afficherHistorique(code){try{
 const h=await rpc('cis_qr_historique',{p_code:code}),f=h.fiche,host=document.getElementById('cisqr-adv-detail');if(!host)return;
 const etat=String(f.etat||'').toLowerCase();const statut=etat==='utilisee'?'Utilisé':etat==='attribuee'?'En service':etat==='vierge'?'Vierge':cisqrLieu(etat);
 const events=Array.isArray(h.evenements)?h.evenements:[];
 host.innerHTML=`<div class="cisqr-fiche-head"><div><h2>${esc(f.materiel||'Matériel')}</h2><p>Fiche individuelle ${f.unite?'— '+esc(f.unite):''}</p></div><span class="cisqr-etat ${etat==='utilisee'?'cisqr-etat-sorti':etat==='attribuee'?'cisqr-etat-actif':''}">${esc(statut)}</span></div>
 <div class="cisqr-fiche-grid"><div><small>Emplacement</small><strong>${esc(cisqrLieu(f.emplacement))}</strong></div><div><small>Péremption</small><strong>${esc(cisqrJour(f.date_peremption))}</strong></div><div><small>Numéro de lot</small><strong>${esc(f.numero_lot||'Non renseigné')}</strong></div><div><small>Unité</small><strong>${esc(f.unite||'Non renseignée')}</strong></div></div>
 <div class="cisqr-ref"><div><small>Référence QR</small><strong>${esc(f.code)}</strong></div><button type="button" id="cisqr-copy-ref">Copier</button></div>
 <h3 class="cisqr-historique-titre">Historique du matériel <span>(${events.length})</span></h3>
 <div class="cisqr-timeline">${events.map(e=>{const [titre,icone,classe]=cisqrNature(e.nature),details=cisqrDetailMouvement(e);return `<article class="cisqr-event cisqr-event-${classe}"><div class="cisqr-event-icon">${esc(icone==='check'?'✓':icone==='tag'?'#':icone==='move'?'↔':icone==='plus'?'+':'i')}</div><div class="cisqr-event-body"><div class="cisqr-event-title"><strong>${esc(titre)}</strong><time>${esc(cisqrDate(e.date))}</time></div>${e.numero_intervention?`<p><b>Intervention n° ${esc(e.numero_intervention)}</b></p>`:''}${details.map(d=>`<p>${esc(d)}</p>`).join('')}<small>Par ${esc(cisqrNomUtilisateur(e.acteur_id))}</small></div></article>`;}).join('')||'<p>Aucun mouvement enregistré.</p>'}</div>`;
 host.querySelector('#cisqr-copy-ref').onclick=async()=>{try{await navigator.clipboard.writeText(f.code);const b=host.querySelector('#cisqr-copy-ref');if(b)b.textContent='Copié';}catch(_){alert('Référence : '+f.code);}};
 host.scrollIntoView({behavior:'smooth',block:'start'});
 }catch(e){setStatut('cisqr-adv-status',erreur(e),true);}}
function injectAdmin(){if(!isAdmin())return;const menu=document.querySelector('.menu-administration');if(!menu||menu.querySelector('[data-cisqr-menu]'))return;const b=document.createElement('button');b.type='button';b.className='menu-button';b.dataset.cisqrMenu='1';b.innerHTML='<span class="menu-icon">▦</span><span><strong>Traçabilité QR code (TEST)</strong><small>Générer des étiquettes, PDF, attribution et suivi</small></span>';b.onclick=ouvrir;menu.appendChild(b);}
function injectFormulaire(m){if(!m?.id||!isAdmin())return;const formulaire=document.querySelector('#nom-materiel')?.closest('.formulaire');if(!formulaire)return;const c=document.createElement('div');c.className='cisqr-admin-mini';c.innerHTML=`<h3>Traçabilité QR code (TEST)</h3><label><input type="checkbox" id="cisqr-suivi-enable"> Activer le suivi individuel par QR code pour ce produit</label><div class="cisqr-row"><button type="button" id="cisqr-assign-direct">Attribuer un QR code (caméra)</button><button type="button" id="cisqr-open-admin">Gestion des étiquettes</button></div><p class="cisqr-small">Une étiquette = un exemplaire physique, comme les bouteilles d’oxygène.</p><p class="cisqr-status" id="cisqr-form-status"></p>`;formulaire.appendChild(c);
 const check=c.querySelector('#cisqr-suivi-enable');check.checked=estSuivi(m.id);check.onchange=async()=>{check.disabled=true;try{await rpc('cis_qr_configurer',{p_materiel:m.id,p_actif:check.checked});await config(true);setStatut('cisqr-form-status',check.checked?'Suivi activé.':'Suivi désactivé.');}catch(e){check.checked=!check.checked;setStatut('cisqr-form-status',erreur(e),true);}finally{check.disabled=false;}};
 c.querySelector('#cisqr-assign-direct').onclick=()=>void attribuerMateriel(m.id);c.querySelector('#cisqr-open-admin').onclick=ouvrir;
 void config(true).then(()=>{if(check.isConnected)check.checked=estSuivi(m.id);}).catch(e=>setStatut('cisqr-form-status',erreur(e),true));
}
function getState(id){if(!state.retour.has(id))state.retour.set(id,{utilises:[],rearmes:[],confirmeNonRearme:false});return state.retour.get(id);}
function selectionQR(){if(typeof consommationsEnCours==='undefined')return [];return Object.entries(consommationsEnCours).filter(([id,n])=>Number(n)>0 && estSuivi(id)).map(([id,n])=>({id,qt:Number(n),s:getState(id),m:materiel(id)}));}
function clearOverflow(){const active=new Set(selectionQR().map(x=>x.id));for(const [id,x] of state.retour){if(!active.has(id))state.retour.delete(id);else{const n=Number(consommationsEnCours[id]||0);if(x.utilises.length>n)x.utilises=x.utilises.slice(0,n);if(x.rearmes.length>n)x.rearmes=x.rearmes.slice(0,n);}}}
function retourUI(){
 const host=document.getElementById('resume-consommation');if(!host)return;const old=host.querySelector('#cisqr-retour-panel');if(old)old.remove();clearOverflow();const selected=selectionQR();if(!selected.length)return;
 const panel=document.createElement('div');panel.id='cisqr-retour-panel';panel.className='cisqr-controls';panel.innerHTML=`<h3>Traçabilité QR — scans obligatoires</h3><p class="cisqr-small">Le scan seul ne déclare pas l’utilisation. La confirmation enregistre les mouvements dans le suivi QR de TEST.</p>`+selected.map(({id,qt,s,m})=>{
 const rest=qt-s.rearmes.length;return `<div class="cisqr-label"><h4>${esc(m?.nom||id)} · ${qt} utilisé(s)</h4><div class="cisqr-qrline"><button type="button" data-cisqr-used="${esc(id)}">Scanner le matériel utilisé</button><b>${s.utilises.length}/${qt}</b></div>${s.utilises.map(x=>`<small><code>${esc(labelPosition(x))}</code> (utilisé) </small>`).join('')}<div class="cisqr-qrline"><button type="button" data-cisqr-rearm="${esc(id)}">Scanner un remplacement du stock</button><b>${s.rearmes.length}/${qt}</b></div>${s.rearmes.map(x=>`<small><code>${esc(labelPosition(x))}</code> (réarmement) </small>`).join('')}${rest>0?`<label style="display:block;margin-top:12px"><input type="checkbox" data-cisqr-none="${esc(id)}" ${s.confirmeNonRearme?'checked':''}> ${s.rearmes.length?'Confirmer le réarmement partiel : '+rest+' manquant(s)':'Aucun matériel réarmé ('+rest+' manquant(s))'}</label>`:'<p class="cisqr-ok">Réarmement complet.</p>'}</div>`;
 }).join('')+`<p class="cisqr-app-test-note">IMPORTANT : première phase de test. Les sorties QR sont enregistrées dans le journal QR dédié ; elles ne sont pas encore fusionnées au journal historique des interventions ni aux quantités de l’inventaire VSAV existant.</p><p id="cisqr-retour-status" class="cisqr-status"></p>`;
 host.appendChild(panel);
 panel.querySelectorAll('[data-cisqr-used]').forEach(b=>b.onclick=()=>void scanRetour(b.dataset.cisqrUsed,'utilises'));
 panel.querySelectorAll('[data-cisqr-rearm]').forEach(b=>b.onclick=()=>void scanRetour(b.dataset.cisqrRearm,'rearmes'));
 panel.querySelectorAll('[data-cisqr-none]').forEach(b=>b.onchange=()=>{getState(b.dataset.cisqrNone).confirmeNonRearme=b.checked;});
}
async function scanRetour(id,type){const st=getState(id),q=Number(consommationsEnCours?.[id]||0);if(st[type].length>=q)return alert('Quantité atteinte.');await scanner(async code=>{
 const f=await rpc('cis_qr_fiche',{p_code:code});if(!f||f.etat!=='attribuee'||String(f.materiel_id)!==String(id))throw Error('Ce QR code ne correspond pas au matériel sélectionné ou n’est pas disponible.');
 if(type==='utilises'&&f.emplacement!=='vsav')throw Error('Le matériel utilisé doit provenir du VSAV.');
 if(type==='rearmes'&&f.emplacement!=='pharmacie')throw Error('Le réarmement doit provenir du stock pharmacie.');
 for(const x of state.retour.values())if(x.utilises.includes(code)||x.rearmes.includes(code))throw Error('QR déjà scanné pour ce retour.');
 st[type].push(code);st.confirmeNonRearme=false;retourUI();
});}
async function enregistrerRetourQRSeulement(){
 const sel=selectionQR();if(!sel.length)return false;
 if(typeof consommationsEnCours==='undefined'||Object.entries(consommationsEnCours).some(([id,n])=>n>0&&!estSuivi(id))){alert('En phase de test QR, effectue séparément le retour des matériels non suivis. Un retour mixte n’est pas encore pris en charge.');return true;}
 const date=document.getElementById('date-intervention')?.value,numero=document.getElementById('numero-intervention')?.value.trim();if(!date||!numero){alert('Renseigne la date et le numéro d’intervention.');return true;}
 for(const {qt,s,m} of sel){if(s.utilises.length!==qt){alert('Scanne tous les exemplaires utilisés pour '+m?.nom);return true;}if(s.rearmes.length<qt&&!s.confirmeNonRearme){alert('Scanne les remplacements ou confirme la quantité non réarmée pour '+m?.nom);return true;}}
 if(!navigator.onLine){alert('Pour cette première version de test, un retour QR doit être validé en ligne afin de garantir les quantités.');return true;}
 if(state.cours)return true;
 if(!confirm('Confirmer la sortie des exemplaires scannés et le réarmement du VSAV dans le registre QR de TEST ?'))return true;
 state.cours=true;const button=document.querySelector('button[onclick*="validerRetourIntervention"]');if(button)button.disabled=true;
 try{const payload=sel.map(({id,s})=>({materiel_id:id,utilises:s.utilises,rearmes:s.rearmes,aucun_rearme:s.rearmes.length===0?s.confirmeNonRearme:s.confirmeNonRearme}));
 const res=await rpc('cis_qr_retour_enregistrer',{p_operation:newID(),p_numero:numero,p_date:date,p_operations:payload});
 state.retour.clear();consommationsEnCours={};if(typeof mettreAJourResume==='function')mettreAJourResume();
 alert('Retour QR enregistré dans le registre de TEST. Manquants supplémentaires : '+(res.manquants_ajoutes||0)+'. La synchronisation avec le journal historique classique sera réalisée à l’étape suivante.');
 }catch(e){setStatut('cisqr-retour-status',erreur(e),true);alert('Retour QR non validé : '+erreur(e));}finally{state.cours=false;if(button)button.disabled=false;}
 return true;
}
async function afficherSuiviDans(box){if(!box?.isConnected||chargementsSuivi.has(box))return;chargementsSuivi.add(box);try{const r=await rpc('cis_qr_suivi_lire');let panel=box.querySelector('[data-cisqr-manquants]');if(!panel){panel=document.createElement('section');panel.dataset.cisqrManquants='1';panel.className='cisqr-controls';box.prepend(panel);}panel.innerHTML='<h3>Manquants QR (TEST)</h3>'+((r||[]).map(x=>`<p><strong>${esc(x.nom)}</strong> — <span class="cisqr-error">${Number(x.manquant)||0} exemplaire(s) manquant(s)</span></p>`).join('')||'<p>Aucun matériel QR manquant.</p>');}catch(e){console.warn('Suivi QR indisponible :',erreur(e));}finally{chargementsSuivi.delete(box);}}
function observerSuivi(){const obs=new MutationObserver(()=>{const e=document.getElementById('suivi-vsav-liste');if(e&&e.isConnected&&!e.querySelector('[data-cisqr-manquants]')&&!chargementsSuivi.has(e)){void afficherSuiviDans(e);}});obs.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});}
async function afficherManquantsInventaire(){
 const main=document.querySelector('main.garde-section');if(!main||!main.querySelector('.veh-inventaire-liste,.veh-inventaire-contenu,.veh-card'))return;
 const old=main.querySelector('[data-cisqr-inventaire]');if(old)old.remove();
 const el=document.createElement('section');el.className='cisqr-controls';el.dataset.cisqrInventaire='1';el.innerHTML='<h3>Traçabilité QR — état du VSAV (TEST)</h3><p>Lecture des matériels manquants…</p>';main.insertBefore(el,main.firstChild);
 try{const lignes=await rpc('cis_qr_suivi_lire');if(!el.isConnected)return;el.innerHTML='<h3>Traçabilité QR — état du VSAV (TEST)</h3>'+((lignes||[]).map(x=>`<p><b>${esc(x.nom)}</b> : <strong class="cisqr-error">${Number(x.manquant)} manquant(s)</strong></p>`).join('')||'<p>Aucun manque QR signalé.</p>')+'<p class="cisqr-small">Ce compteur est indépendant des quantités de référence de l’inventaire véhicule pour les premiers tests.</p>';}catch(e){if(el.isConnected)el.textContent='Suivi QR non disponible : '+erreur(e);}
}
function installer(){
 const v=g.vehInventaireAfficher;if(typeof v==='function')g.vehInventaireAfficher=function(...args){const r=v.apply(this,args);void afficherManquantsInventaire();return r;};
 const a=g.afficherMenuAdministration;if(typeof a==='function')g.afficherMenuAdministration=function(...args){const r=a.apply(this,args);injectAdmin();return r;};
 const f=g.afficherFormulaireMateriel;if(typeof f==='function')g.afficherFormulaireMateriel=function(...args){const r=f.apply(this,args);injectFormulaire(args[0]);return r;};
 const carte=g.genererCarteRetour;if(typeof carte==='function')g.genererCarteRetour=function(m){if(!estSuivi(m?.id))return carte(m);const ancien=m.gere_stock_pharmacie;m.gere_stock_pharmacie=false;try{return carte(m).replace('Sans réserve pharmacie — réarmement à prévoir','Exemplaires QR du VSAV');}finally{m.gere_stock_pharmacie=ancien;}};
 for(const name of ['augmenterConsommation','selectionnerQuantiteRetour']){const fn=g[name];if(typeof fn==='function')g[name]=function(id,...rest){const m=materiel(id);if(!m||!estSuivi(id))return fn.call(this,id,...rest);const ancien=m.gere_stock_pharmacie;m.gere_stock_pharmacie=false;try{return fn.call(this,id,...rest);}finally{m.gere_stock_pharmacie=ancien;}};}
 const retour=g.afficherRetourIntervention;if(typeof retour==='function')g.afficherRetourIntervention=async function(...args){state.retour.clear();try{await config(true);}catch(e){console.warn('QR retour :',erreur(e));}const r=await retour.apply(this,args);retourUI();return r;};
 const resume=g.mettreAJourResume;if(typeof resume==='function')g.mettreAJourResume=function(...args){const r=resume.apply(this,args);retourUI();return r;};
 const valider=g.validerRetourIntervention;if(typeof valider==='function')g.validerRetourIntervention=async function(...args){try{await config();}catch(e){console.warn('Traçabilité QR indisponible :',erreur(e));return valider.apply(this,args);}if(await enregistrerRetourQRSeulement())return;return valider.apply(this,args);};
 observerSuivi();
}
g.CISQR={ouvrir,ouvrirAvance,scanner,exporterPDF,attribuerMateriel,estSuivi,config,retourUI};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installer,{once:true});else installer();
})(window);
