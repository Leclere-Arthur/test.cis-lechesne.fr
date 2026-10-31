/* Catégories pharmacie, deux niveaux. Aucune modification du journal de stocks. */
(function(g){'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=s=>String(s||'').trim().toLocaleLowerCase('fr');
 const uid=()=>typeof utilisateurConnecte!=='undefined'?String(utilisateurConnecte?.id||''):'';
 const key=()=>`cis-pharma-categories-v1:${uid()}`;
 let rows=[],owner='',busy=false,edit=null,message='';
 function lire(){const id=uid();if(owner!==id){owner=id;try{rows=id?JSON.parse(localStorage.getItem(key())||'[]'):[];}catch(_){rows=[];}if(!Array.isArray(rows))rows=[];}return rows;}
 function recevoir(data){owner=uid();rows=(data||[]).filter(x=>x.id&&x.nom).map(x=>({id:String(x.id),nom:String(x.nom),parent_id:x.parent_id?String(x.parent_id):null,ordre:Number(x.ordre)||0}));if(owner)try{localStorage.setItem(key(),JSON.stringify(rows));}catch(_){} }
 function chemin(nom){const rs=lire(),x=rs.find(x=>norm(x.nom)===norm(nom)),p=rs.find(p=>p.id===x?.parent_id);return p?`${p.nom} › ${nom}`:nom;}
 function arbre(noms){const rs=lire(),liste=[...new Set(noms||[])],present=new Set(liste.map(norm));
  const records=liste.map(nom=>{const r=rs.find(x=>norm(x.nom)===norm(nom));return {...r,nom,id:r?.id||'local:'+nom};});
  const roots=records.filter(x=>!x.parent_id||!records.some(p=>p.id===x.parent_id));
  return roots.sort(trier).map(x=>({...x,enfants:records.filter(c=>c.parent_id===x.id&&c.id!==x.id).sort(trier)}));
 }
 function blocs(noms,materiels,carte){const match=(m,n)=>Array.isArray(m.categories)&&m.categories.some(c=>norm(c)===norm(n));
  function node(x){const enfants=x.enfants||[],sous=enfants.map(c=>c.nom),liste=materiels.filter(m=>match(m,x.nom)&&!sous.some(n=>match(m,n))),tous=materiels.filter(m=>match(m,x.nom)||sous.some(n=>match(m,n)));
   return `<section class="categorie-bloc${x.parent_id?' pharmacie-sous-categorie':''}"><button class="categorie-titre" type="button" aria-expanded="false" onclick="basculerCategorie(this)"><span>${esc(x.nom)} <small>${tous.length}</small></span><span>▼</span></button><div class="categorie-contenu" style="display:none">${liste.map(carte).join('')}${enfants.map(node).join('')}${!tous.length&&!enfants.length?'<div class="materiel"><p>Aucun matériel dans cette catégorie.</p></div>':''}</div></section>`;
  }const connus=new Set((noms||[]).map(norm));
  const sans=materiels.filter(m=>!Array.isArray(m.categories)||!m.categories.some(n=>connus.has(norm(n))));
  const hors=sans.length?`<section class="categorie-bloc pharmacie-sans-categorie"><button class="categorie-titre" type="button" aria-expanded="false" onclick="basculerCategorie(this)"><span>Sans catégorie <small>${sans.length}</small></span><span>▼</span></button><div class="categorie-contenu" style="display:none">${sans.map(carte).join('')}</div></section>`:'';
  return arbre(noms).map(node).join('')+hors;
 }
 function style(){if(document.getElementById('pharma-categories-style'))return;const s=document.createElement('style');s.id='pharma-categories-style';s.textContent='#cat-deplacement-annonce:not(:empty){position:fixed!important;top:auto!important;bottom:100px;left:16px;right:16px;max-width:520px;margin:auto;box-sizing:border-box;pointer-events:none;z-index:2147482000!important}'+'[data-pharma-ligne],[data-pharma-ligne] *{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}[data-pharma-ligne]{touch-action:pan-y;cursor:grab}[data-pharma-ligne][hidden]{display:none!important}.cat-drag-active,.cat-drag-active *{cursor:grabbing!important;-webkit-user-select:none!important;user-select:none!important}.cat-fantome{margin:0!important;position:fixed!important;z-index:2147483000!important;pointer-events:none!important;opacity:.96;will-change:transform;box-shadow:0 16px 40px #18394a44!important;outline:2px solid #1687ff!important;transform-origin:50% 50%;overflow:hidden}.cat-fantome *{pointer-events:none!important}.cat-espace{box-sizing:border-box;border:2px dashed #1687ff;background:#e4f2ff;border-radius:18px;margin:14px 0;min-height:90px;transition:margin-left 120ms ease}.cat-options{min-height:44px;padding:8px 12px!important;font-size:14px!important}.cat-cible-dedans{outline:3px solid #21815c;background:#e7f5ee!important}.cat-ligne-titre h3{overflow-wrap:anywhere;min-width:0}'+'.cat-ligne-titre{display:flex;align-items:center;justify-content:space-between;gap:12px}.cat-poignee{touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;min-width:52px;cursor:grab}.cat-deplacee{outline:3px solid #1687ff;opacity:.65}.cat-cible-avant{border-top:6px solid #1687ff!important}.cat-cible-apres{border-bottom:6px solid #1687ff!important}.cat-cible-dedans{outline:3px solid #21815c;background:#e7f5ee!important}#cat-deplacement-annonce:not(:empty){position:sticky;top:10px;z-index:20;background:#fff;padding:12px;border:2px solid #1687ff;border-radius:12px}.cat-move-menu{padding:14px;border:1px solid #bbcbd7;border-radius:12px;margin-top:14px}.cat-move-menu>button{display:block;margin:8px 0;width:100%}'+'.pharmacie-sous-categorie{margin:10px 0 10px 12px;border-left:3px solid #d6dde3;padding-left:10px}.pharma-cat-page .materiel{margin:14px 0}.pharma-cat-page button{min-height:44px;white-space:normal}.pharma-cat-page .actions-materiel{display:flex;flex-wrap:wrap;gap:10px}.pharma-cat-page label{display:block;margin:18px 0}.pharma-cat-page input,.pharma-cat-page select{display:block;width:100%;box-sizing:border-box;font-size:16px;padding:12px;margin-top:8px;border:1px solid #c9d1d9;border-radius:12px;background:#fff;color:#20272c}.pharma-cat-enfant{margin-left:20px!important;border-left:3px solid #d6dde3;padding-left:16px!important}.pharma-cat-message{white-space:pre-wrap;color:#9f1c26}.pharma-cat-page fieldset{border:0;padding:0;min-width:0}';document.head.append(s);}
 const permission=()=>verifierPermissionOuRetourAccueil('acces_gestion_categories');
 function render(){if(!permission())return;style();const rs=lire(),parId=new Map(rs.map(x=>[x.id,x]));
 finGeste();
 const titre=edit?(edit.id?'Modifier la catégorie':'Nouvelle catégorie'):'Catégories pharmacie';
 const liste=arbre(rs.map(x=>x.nom)).flatMap(x=>[x,...x.enfants]);
 const btn=(action,id,label)=>`<button type="button" data-pharma-cat="${action}" data-id="${esc(id||'')}">${label}</button>`;
 document.getElementById('app').innerHTML=`<main class="page navigation-fixe-page pharma-cat-page"><button type="button" class="retour-button" data-navigation-equipe data-pharma-cat="retour">← Retour</button><h2>${titre}</h2><p role="status" class="pharma-cat-message">${esc(message)}</p>${edit?`<form id="pharma-cat-form" data-cat-id="${esc(edit.id||'')}"><fieldset ${busy?'disabled':''}><label>Nom<input name="nom" value="${esc(edit.nom||'')}" maxlength="120" required autocomplete="off"></label><label>Catégorie principale<select name="parent"><option value="">Aucune — catégorie principale</option>${rs.filter(x=>!x.parent_id&&x.id!==edit.id).map(x=>`<option value="${esc(x.id)}" ${x.id===edit.parent_id?'selected':''}>${esc(x.nom)}</option>`).join('')}</select></label><div class="actions-materiel"><button type="submit">${busy?'Enregistrement…':'Enregistrer'}</button>${btn('annuler','','Annuler')}</div></fieldset></form>`:`<div class="actions-materiel">${btn('nouvelle','','Nouvelle catégorie')}${btn('actualiser','','Actualiser')}</div><p>Maintiens une catégorie puis déplace-la avec ton doigt.</p><p id="cat-deplacement-annonce" role="status" aria-live="polite"></p><fieldset ${busy?'disabled':''}>${liste.map(x=>`<article data-pharma-ligne="${esc(x.id)}" class="materiel ${x.parent_id?'pharma-cat-enfant':''}"><div class="cat-ligne-titre"><h3>${esc(x.nom)}</h3><button type="button" data-cat-move="menu" data-id="${esc(x.id)}" class="cat-options" aria-label="Déplacer ${esc(x.nom)}">Déplacer</button></div>${x.parent_id?`<p>Sous-catégorie de ${esc(parId.get(x.parent_id)?.nom||'')}</p>`:''}<div class="actions-materiel">${!x.parent_id?btn('sous',x.id,'Ajouter une sous-catégorie'):''}${btn('modifier',x.id,'Modifier')}${btn('supprimer',x.id,'Supprimer')}</div>${menuDeplacement===x.id?menuHTML(x.id):''}</article>`).join('')||'<p>Aucune catégorie.</p>'}</fieldset>`}</main>${navigationPrincipale('pharmacie','pharmacie')}`;
 }
 async function actualiser(){const account=uid();const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),15000);try{if(!navigator.onLine)throw Error('Hors connexion : les catégories enregistrées restent consultables.');const {data,error}=await obtenirClientSupabase().from('categories').select('id,nom,parent_id,ordre').order('ordre').order('nom').abortSignal(ac.signal);if(error)throw error;if(uid()!==account)return false;recevoir(data);return true;}finally{clearTimeout(timer);}}
 async function ouvrir(){if(!permission())return;edit=null;message='';render();try{await actualiser();}catch(e){message=e.message||'Chargement impossible.';}if(document.querySelector('.pharma-cat-page'))render();}
 async function executer(n,p){if(!navigator.onLine)throw Error('Connexion nécessaire pour modifier les catégories.');if(existeModificationsEnAttente()||lireJournalStock().length)throw Error('Des modifications attendent leur synchronisation. Actualise l’application avant de modifier les catégories.');const account=uid(),ac=new AbortController(),timer=setTimeout(()=>ac.abort(),15000);try{const {error}=await obtenirClientSupabase().rpc(n,p).abortSignal(ac.signal);if(error)throw error;if(uid()!==account)throw Error('Le compte a changé.');
 // Met à jour noms, relations matériel et snapshot ensemble ; aucune écriture de stock.
 const donnees=await recupererDonneesSupabase();if(uid()!==account)return;await appliquerDonneesSupabaseLocalement(donnees);
 }finally{clearTimeout(timer);}}
 async function action(a,id){if(busy||!permission())return;const rs=lire(),x=rs.find(x=>x.id===id);message='';
 if(a==='retour'){if(document.getElementById('pharma-cat-form')){edit=null;render();}else afficherMenuAdministration();return;}
 if(a==='annuler'){edit=null;render();return;}
 if(a==='nouvelle'||a==='sous'){edit={id:null,nom:'',parent_id:a==='sous'?id:null};render();return;}
 if(a==='modifier'){if(x){edit={...x};render();}return;}
 if(a==='supprimer'){if(rs.some(c=>c.parent_id===id)){message='Déplace ou supprime d’abord les sous-catégories.';render();return;}if(!x||!await afficherConfirmationCIS(`Supprimer « ${chemin(x.nom)} » ? Le matériel est conservé, mais son rattachement à cette catégorie sera retiré.`))return;}
 busy=true;render();try{if(a==='supprimer')await executer('pharmacie_categorie_supprimer',{p_id:id});else await actualiser();}catch(e){message=e.message||'Opération impossible. Actualise pour vérifier le résultat.';}finally{busy=false;if(document.querySelector('.pharma-cat-page'))render();}}
 document.addEventListener('click',e=>{const b=e.target.closest('[data-pharma-cat]');if(!b)return;e.preventDefault();void action(b.dataset.pharmaCat,b.dataset.id);});
 document.addEventListener('submit',async e=>{if(e.target.id!=='pharma-cat-form')return;e.preventDefault();if(busy||!permission())return;const formId=e.target.dataset.catId||null;const f=new FormData(e.target),nom=String(f.get('nom')||'').trim(),parent=String(f.get('parent')||'')||null;if(!nom)return;edit={id:formId,nom,parent_id:parent};busy=true;message='';render();try{await executer('pharmacie_categorie_enregistrer',{p_id:edit.id,p_nom:nom,p_parent:parent});edit=null;}catch(error){message=error.message||'Enregistrement impossible. Actualise pour vérifier le résultat.';}finally{busy=false;if(document.querySelector('.pharma-cat-page'))render();}});
 async function ouvrirAction(a,nom){await ouvrir();const x=lire().find(x=>norm(x.nom)===norm(nom));return action(a,x?.id||'');}
 // Appui long sur toute la carte, déplacement visuel et défilement tactile normal.
 let geste=null,menuDeplacement=null,bloquerClickJusqua=0;
 const trier=(a,b)=>(Number(a.ordre)||0)-(Number(b.ordre)||0)||norm(a.nom).localeCompare(norm(b.nom),'fr')||a.id.localeCompare(b.id);
 function instantane(){return lire().map(x=>({id:x.id,nom:x.nom,parent_id:x.parent_id,ordre:Number(x.ordre)||0})).sort((a,b)=>a.id.localeCompare(b.id));}
 function destination(id,cibleId,zone){
  const rs=lire(),x=rs.find(r=>r.id===id),t=rs.find(r=>r.id===cibleId);if(!x||!t||x.id===t.id)return null;
  if(zone==='dedans'){
   if(t.parent_id||rs.some(r=>r.parent_id===x.id))return null;
   return {parent:t.id,avant:null,texte:'Sous-catégorie de '+t.nom};
  }
  const siblings=rs.filter(r=>r.parent_id===t.parent_id&&r.id!==x.id).sort(trier),idx=siblings.findIndex(r=>r.id===t.id);
  if(t.parent_id&&rs.some(r=>r.parent_id===x.id))return null;
  return {parent:t.parent_id,avant:zone==='avant'?t.id:(siblings[idx+1]?.id||null),texte:(zone==='avant'?'Avant ':'Après ')+t.nom};
 }
 function effacerSelection(){const s=window.getSelection?.();if(s?.rangeCount)s.removeAllRanges();}
 function cartes(){return [...document.querySelectorAll('[data-pharma-ligne]')];}
 function poserEspace(g,d){
  const cle=d.parent+'|'+d.avant;if(g.position===cle)return;g.position=cle;
  const visibles=cartes().filter(x=>!x.hidden),avant=new Map(visibles.map(x=>[x,x.getBoundingClientRect().top]));
  g.espace.classList.toggle('pharma-cat-enfant',!!d.parent);
  let ancre=d.avant?cartes().find(x=>x.dataset.pharmaLigne===d.avant):null;
  if(!ancre){
   if(d.parent){const parent=cartes().find(x=>x.dataset.pharmaLigne===d.parent);if(parent){const enfants=cartes().filter(n=>!g.sources.includes(n)&&lire().find(r=>r.id===n.dataset.pharmaLigne)?.parent_id===d.parent);ancre=(enfants.at(-1)||parent).nextElementSibling;}}
   else ancre=null;
  }
  // Ne pas déplacer l’espace devant lui-même ; les cartes source restent cachées à leur emplacement original.
  while(ancre===g.espace||g.sources.includes(ancre))ancre=ancre.nextElementSibling;
  const parent=g.source.parentElement;if(ancre&&ancre.parentElement===parent)parent.insertBefore(g.espace,ancre);else parent.appendChild(g.espace);
  if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){for(const node of visibles){const delta=avant.get(node)-node.getBoundingClientRect().top;if(Math.abs(delta)>1){node.getAnimations?.().forEach(a=>a.cancel());node.animate?.([{transform:`translateY(${delta}px)`},{transform:'translateY(0)'}],{duration:150,easing:'ease-out'});}}}
 }
 function finGeste(){const g=geste;if(!g)return;geste=null;clearTimeout(g.timer);if(g.frame)cancelAnimationFrame(g.frame);g.fantome?.remove();g.espace?.remove();for(const x of g.sources||[])x.hidden=false;document.body.classList.remove('cat-drag-active');cartes().forEach(x=>x.classList.remove('cat-cible-dedans'));const annonce=document.getElementById('cat-deplacement-annonce');if(annonce)annonce.textContent='';}
 function positionLocale(id,parent,avant){const rs=lire(),cible=rs.find(x=>x.id===id);if(!cible)return;const liste=rs.filter(x=>x.parent_id===parent&&x.id!==id).sort(trier),i=avant?liste.findIndex(x=>x.id===avant):liste.length;liste.splice(i<0?liste.length:i,0,cible);cible.parent_id=parent;liste.forEach((x,i)=>x.ordre=(i+1)*10);}
 async function deplacer(id,parent,avant,attendu){if(busy||!permission())return;const precedent=lire().map(x=>({...x}));positionLocale(id,parent,avant);busy=true;message='';menuDeplacement=null;render();try{await executer('pharmacie_categorie_deplacer',{p_id:id,p_parent:parent,p_avant:avant,p_attendu:attendu});await actualiser();message='Position enregistrée.';}catch(e){message=e.message||'Déplacement non confirmé. Actualise pour vérifier.';try{await actualiser();}catch(_){rows=precedent;}}finally{busy=false;if(document.querySelector('.pharma-cat-page'))render();}}
 function menuHTML(id){const rs=lire(),x=rs.find(r=>r.id===id);if(!x)return '';const siblings=rs.filter(r=>r.parent_id===x.parent_id).sort(trier),i=siblings.findIndex(r=>r.id===id),btn=(action,label,extra='')=>`<button type="button" data-cat-move="${action}" data-id="${esc(id)}" ${extra}>${esc(label)}</button>`;
 return `<section class="cat-move-menu" aria-label="Déplacer ${esc(x.nom)}"><strong>${esc(x.nom)}</strong><div class="actions-materiel">${i>0?btn('monter','Monter'):''}${i<siblings.length-1?btn('descendre','Descendre'):''}${x.parent_id?btn('sortir','Sortir de la catégorie'):''}</div>${!rs.some(r=>r.parent_id===id)?rs.filter(r=>!r.parent_id&&r.id!==id&&r.id!==x.parent_id).map(r=>btn('rattacher','Placer dans '+r.nom,`data-parent="${esc(r.id)}"`)).join(''):''}${btn('fermer','Fermer')}</section>`;
 }
 document.addEventListener('click',e=>{const b=e.target.closest('[data-cat-move]');if(!b)return;e.preventDefault();if(busy||Date.now()<bloquerClickJusqua)return;const id=b.dataset.id,x=lire().find(r=>r.id===id);if(!x)return;const a=b.dataset.catMove;
  if(a==='menu'){menuDeplacement=menuDeplacement===id?null:id;render();return;}
  if(a==='fermer'){menuDeplacement=null;render();return;}
  let d;
  if(a==='sortir')d={parent:null,avant:null};
  else if(a==='rattacher')d={parent:b.dataset.parent,avant:null};
  else{const siblings=lire().filter(r=>r.parent_id===x.parent_id).sort(trier),i=siblings.findIndex(r=>r.id===id);d=a==='monter'&&i>0?{parent:x.parent_id,avant:siblings[i-1].id}:a==='descendre'&&i<siblings.length-1?{parent:x.parent_id,avant:siblings[i+2]?.id||null}:null;}
  if(d)void deplacer(id,d.parent,d.avant,instantane());
 });
 function demarrerGeste(source,x,y,type,identifiant){
  if(busy||!permission()||!source)return;finGeste();
  const id=source.dataset.pharmaLigne,g={id,source,x,y,startX:x,startY:y,type,identifiant,active:false,attendu:instantane(),dest:null};geste=g;
  g.timer=setTimeout(()=>{
   if(geste!==g||!source.isConnected)return;
   const rect=source.getBoundingClientRect();g.active=true;g.moved=false;effacerSelection();document.body.classList.add('cat-drag-active');
   g.offsetX=g.x-rect.left;g.offsetY=g.y-rect.top;
   g.fantome=source.cloneNode(true);g.fantome.removeAttribute('data-pharma-ligne');g.fantome.removeAttribute('id');g.fantome.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));g.fantome.querySelectorAll('button').forEach(n=>n.tabIndex=-1);g.fantome.setAttribute('aria-hidden','true');g.fantome.classList.add('cat-fantome');
   Object.assign(g.fantome.style,{width:rect.width+'px',height:rect.height+'px',left:'0',top:'0',margin:'0',boxSizing:'border-box'});document.body.appendChild(g.fantome);g.fantome.style.transform=`translate3d(${g.x-g.offsetX}px,${g.y-g.offsetY}px,0) scale(1.015)`;
   const descendants=lire().filter(r=>r.parent_id===id).map(r=>r.id);g.sources=cartes().filter(n=>n===source||descendants.includes(n.dataset.pharmaLigne));
   g.espace=document.createElement('div');g.espace.className='cat-espace'+(source.classList.contains('pharma-cat-enfant')?' pharma-cat-enfant':'');g.espace.setAttribute('aria-hidden','true');g.espace.style.height=g.sources.reduce((s,n)=>s+n.getBoundingClientRect().height+28,0)+'px';source.before(g.espace);g.sources.forEach(n=>n.hidden=true);
   document.getElementById('cat-deplacement-annonce').textContent='Déplace la carte. Au centre : ranger dedans. Au bord : changer sa position.';
   g.frame=requestAnimationFrame(cadreGeste);
  },400);
 }
 function viserGeste(x,y){
  const g=geste;if(!g?.active)return;
  const survole=document.elementFromPoint(x,y);if(survole?.closest('.cat-espace'))return;
  const target=survole?.closest('[data-pharma-ligne]');cartes().forEach(n=>n.classList.remove('cat-cible-dedans'));g.dest=null;
  if(!target||target.hidden||g.sources.includes(target))return;
  const r=target.getBoundingClientRect(),ratio=(y-r.top)/r.height,zone=ratio<.28?'avant':ratio>.72?'apres':'dedans',d=destination(g.id,target.dataset.pharmaLigne,zone),annonce=document.getElementById('cat-deplacement-annonce');
  if(!d){annonce.textContent='Dépose sur le bord pour changer la position. Deux niveaux maximum.';return;}
  g.dest=d;annonce.textContent=d.texte;if(zone==='dedans')target.classList.add('cat-cible-dedans');poserEspace(g,d);
 }
 function cadreGeste(){const g=geste;if(!g?.active)return;
  g.fantome.style.transform=`translate3d(${g.x-g.offsetX}px,${g.y-g.offsetY}px,0) scale(1.015)`;
  const bord=85,y=g.y;if(g.moved&&y<bord)window.scrollBy(0,-Math.ceil((bord-y)/8));else if(g.moved&&y>window.innerHeight-bord)window.scrollBy(0,Math.ceil((y-window.innerHeight+bord)/8));
  if(g.moved)viserGeste(g.x,g.y);g.frame=requestAnimationFrame(cadreGeste);
 }
 function bougerGeste(x,y,e){const g=geste;if(!g)return;if(!g.active){if(Math.hypot(x-g.startX,y-g.startY)>10)finGeste();return;}if(e.cancelable)e.preventDefault();g.x=x;g.y=y;g.moved=true;}
 function terminerGeste(x,y,e){const g=geste;if(!g)return;if(g.active){bloquerClickJusqua=Date.now()+700;if(e.cancelable)e.preventDefault();g.x=x;g.y=y;if(g.moved)viserGeste(x,y);}const d=g.dest;finGeste();if(g.active&&d)void deplacer(g.id,d.parent,d.avant,g.attendu);}
 // Sur mobile, touchmove non passif bloque le défilement seulement APRÈS l’appui long.
 // Le défilement normal avant l’appui long reste disponible sur toute la carte.
 document.addEventListener('touchstart',e=>{if(e.touches.length!==1){finGeste();return;}const t=e.touches[0];demarrerGeste(e.target.closest('[data-pharma-ligne]'),t.clientX,t.clientY,'touch',t.identifier);},{passive:true});
 document.addEventListener('touchmove',e=>{if(geste?.type!=='touch')return;if(e.touches.length!==1){finGeste();return;}const t=[...e.touches].find(t=>t.identifier===geste.identifiant);if(t)bougerGeste(t.clientX,t.clientY,e);},{passive:false});
 document.addEventListener('touchend',e=>{if(geste?.type!=='touch')return;const t=[...e.changedTouches].find(t=>t.identifier===geste.identifiant);if(t)terminerGeste(t.clientX,t.clientY,e);},{passive:false});
 document.addEventListener('touchcancel',()=>{if(geste?.type==='touch')finGeste();});
 document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.isPrimary===false||e.button>0)return;demarrerGeste(e.target.closest('[data-pharma-ligne]'),e.clientX,e.clientY,'pointer',e.pointerId);});
 document.addEventListener('pointermove',e=>{if(geste?.type==='pointer'&&e.pointerId===geste.identifiant)bougerGeste(e.clientX,e.clientY,e);},{passive:false});
 document.addEventListener('pointerup',e=>{if(geste?.type==='pointer'&&e.pointerId===geste.identifiant)terminerGeste(e.clientX,e.clientY,e);});
 document.addEventListener('pointercancel',()=>{if(geste?.type==='pointer')finGeste();});
 document.addEventListener('click',e=>{if(Date.now()<bloquerClickJusqua){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-pharma-ligne]'))e.preventDefault();});
 document.addEventListener('selectstart',e=>{if(e.target.closest('[data-pharma-ligne]'))e.preventDefault();});
 document.addEventListener('dragstart',e=>{if(e.target.closest('[data-pharma-ligne]'))e.preventDefault();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')finGeste();});window.addEventListener('blur',finGeste);document.addEventListener('visibilitychange',()=>{if(document.hidden)finGeste();});

 g.CISPharmaCategories={recevoir,chemin,arbre,blocs,ouvrir,ouvrirAction,lire,style};
})(globalThis);
