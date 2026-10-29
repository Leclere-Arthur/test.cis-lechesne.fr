/* Catégories pharmacie, deux niveaux. Aucune modification du journal de stocks. */
(function(g){'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=s=>String(s||'').trim().toLocaleLowerCase('fr');
 const uid=()=>typeof utilisateurConnecte!=='undefined'?String(utilisateurConnecte?.id||''):'';
 const key=()=>`cis-pharma-categories-v1:${uid()}`;
 let rows=[],owner='',busy=false,edit=null,message='';
 function lire(){const id=uid();if(owner!==id){owner=id;try{rows=id?JSON.parse(localStorage.getItem(key())||'[]'):[];}catch(_){rows=[];}if(!Array.isArray(rows))rows=[];}return rows;}
 function recevoir(data){owner=uid();rows=(data||[]).filter(x=>x.id&&x.nom).map(x=>({id:String(x.id),nom:String(x.nom),parent_id:x.parent_id?String(x.parent_id):null}));if(owner)try{localStorage.setItem(key(),JSON.stringify(rows));}catch(_){} }
 function chemin(nom){const rs=lire(),x=rs.find(x=>norm(x.nom)===norm(nom)),p=rs.find(p=>p.id===x?.parent_id);return p?`${p.nom} › ${nom}`:nom;}
 function arbre(noms){const rs=lire(),liste=[...new Set(noms||[])],present=new Set(liste.map(norm));
  const records=liste.map(nom=>{const r=rs.find(x=>norm(x.nom)===norm(nom));return {...r,nom,id:r?.id||'local:'+nom};});
  const roots=records.filter(x=>!x.parent_id||!records.some(p=>p.id===x.parent_id));
  return roots.map(x=>({...x,enfants:records.filter(c=>c.parent_id===x.id&&c.id!==x.id)}));
 }
 function blocs(noms,materiels,carte){const match=(m,n)=>Array.isArray(m.categories)&&m.categories.some(c=>norm(c)===norm(n));
  function node(x){const enfants=x.enfants||[],sous=enfants.map(c=>c.nom),liste=materiels.filter(m=>match(m,x.nom)&&!sous.some(n=>match(m,n))),tous=materiels.filter(m=>match(m,x.nom)||sous.some(n=>match(m,n)));
   return `<section class="categorie-bloc${x.parent_id?' pharmacie-sous-categorie':''}"><button class="categorie-titre" type="button" aria-expanded="false" onclick="basculerCategorie(this)"><span>${esc(x.nom)} <small>${tous.length}</small></span><span>▼</span></button><div class="categorie-contenu" style="display:none">${liste.map(carte).join('')}${enfants.map(node).join('')}${!tous.length&&!enfants.length?'<div class="materiel"><p>Aucun matériel dans cette catégorie.</p></div>':''}</div></section>`;
  }return arbre(noms).map(node).join('');
 }
 function style(){if(document.getElementById('pharma-categories-style'))return;const s=document.createElement('style');s.id='pharma-categories-style';s.textContent='.pharmacie-sous-categorie{margin:10px 0 10px 12px;border-left:3px solid #d6dde3;padding-left:10px}.pharma-cat-page .materiel{margin:14px 0}.pharma-cat-page button{min-height:44px;white-space:normal}.pharma-cat-page .actions-materiel{display:flex;flex-wrap:wrap;gap:10px}.pharma-cat-page label{display:block;margin:18px 0}.pharma-cat-page input,.pharma-cat-page select{display:block;width:100%;box-sizing:border-box;font-size:16px;padding:12px;margin-top:8px;border:1px solid #c9d1d9;border-radius:12px;background:#fff;color:#20272c}.pharma-cat-enfant{margin-left:20px!important;border-left:3px solid #d6dde3;padding-left:16px!important}.pharma-cat-message{white-space:pre-wrap;color:#9f1c26}.pharma-cat-page fieldset{border:0;padding:0;min-width:0}';document.head.append(s);}
 const permission=()=>verifierPermissionOuRetourAccueil('acces_gestion_categories');
 function render(){if(!permission())return;style();const rs=lire(),parId=new Map(rs.map(x=>[x.id,x]));
 const titre=edit?(edit.id?'Modifier la catégorie':'Nouvelle catégorie'):'Catégories pharmacie';
 const liste=arbre(rs.map(x=>x.nom)).flatMap(x=>[x,...x.enfants]);
 const btn=(action,id,label)=>`<button type="button" data-pharma-cat="${action}" data-id="${esc(id||'')}">${label}</button>`;
 document.getElementById('app').innerHTML=`<main class="page navigation-fixe-page pharma-cat-page"><button type="button" class="retour-button" data-navigation-equipe data-pharma-cat="retour">← Retour</button><h2>${titre}</h2><p role="status" class="pharma-cat-message">${esc(message)}</p>${edit?`<form id="pharma-cat-form" data-cat-id="${esc(edit.id||'')}"><fieldset ${busy?'disabled':''}><label>Nom<input name="nom" value="${esc(edit.nom||'')}" maxlength="120" required autocomplete="off"></label><label>Catégorie principale<select name="parent"><option value="">Aucune — catégorie principale</option>${rs.filter(x=>!x.parent_id&&x.id!==edit.id).map(x=>`<option value="${esc(x.id)}" ${x.id===edit.parent_id?'selected':''}>${esc(x.nom)}</option>`).join('')}</select></label><div class="actions-materiel"><button type="submit">${busy?'Enregistrement…':'Enregistrer'}</button>${btn('annuler','','Annuler')}</div></fieldset></form>`:`<div class="actions-materiel">${btn('nouvelle','','Nouvelle catégorie')}${btn('actualiser','','Actualiser')}</div><fieldset ${busy?'disabled':''}>${liste.map(x=>`<article class="materiel ${x.parent_id?'pharma-cat-enfant':''}"><h3>${esc(x.nom)}</h3>${x.parent_id?`<p>Sous-catégorie de ${esc(parId.get(x.parent_id)?.nom||'')}</p>`:''}<div class="actions-materiel">${!x.parent_id?btn('sous',x.id,'Ajouter une sous-catégorie'):''}${btn('modifier',x.id,'Modifier')}${btn('supprimer',x.id,'Supprimer')}</div></article>`).join('')||'<p>Aucune catégorie.</p>'}</fieldset>`}</main>${navigationPrincipale('pharmacie','pharmacie')}`;
 }
 async function actualiser(){const account=uid();const ac=new AbortController(),timer=setTimeout(()=>ac.abort(),15000);try{if(!navigator.onLine)throw Error('Hors connexion : les catégories enregistrées restent consultables.');const {data,error}=await obtenirClientSupabase().from('categories').select('id,nom,parent_id').order('nom').abortSignal(ac.signal);if(error)throw error;if(uid()!==account)return false;recevoir(data);return true;}finally{clearTimeout(timer);}}
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
 g.CISPharmaCategories={recevoir,chemin,arbre,blocs,ouvrir,lire,style};
})(globalThis);
