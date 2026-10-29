/* Messages créés dans Pilotage : indépendants des notifications et des files métier. */
(function () {
 'use strict';
 var owner='',memo={messages:[],valides:{}},fetching=false,last=0,overlay=null,previousFocus=null,previousOverflow='',previousAria=null,previousInert=false,appElement=null;
 function utilisateur(){try{return utilisateurConnecte&&profilUtilisateurConnecte&&profilUtilisateurConnecte.actif&&!document.body.classList.contains('mode-connexion')&&window.__cisNotificationsApplicationPrete?String(utilisateurConnecte.id):''}catch(_){return ''}}
 function cle(u){return 'cis-messages-application-v1:'+u}
 function lire(u){try{var d=JSON.parse(localStorage.getItem(cle(u))||'null');if(d&&Array.isArray(d.messages)&&d.valides&&typeof d.valides==='object')return d}catch(_){}return {messages:[],valides:{}}}
 function sauver(u,d){try{localStorage.setItem(cle(u),JSON.stringify(d));return true}catch(_){return false}}
 function fermer(){if(!overlay)return;overlay.remove();overlay=null;document.body.style.overflow=previousOverflow;if(appElement){if(previousAria===null)appElement.removeAttribute('aria-hidden');else appElement.setAttribute('aria-hidden',previousAria);if('inert' in appElement)appElement.inert=previousInert;}appElement=null;if(previousFocus&&previousFocus.isConnected)try{previousFocus.focus({preventScroll:true})}catch(_){}previousFocus=null;}
 function changerCompte(u){if(u===owner)return;fermer();owner=u;memo=u?lire(u):{messages:[],valides:{}};last=0;}
 function autresFenetres(){var elements=document.querySelectorAll('[aria-modal="true"],dialog[open],.modal-stock-fond,#cis-signature-modal');for(var i=0;i<elements.length;i++){if(elements[i]===overlay)continue;var style=getComputedStyle(elements[i]);if(style.display!=='none'&&style.visibility!=='hidden'&&elements[i].getClientRects().length)return true;}return false;}
 function style(){if(document.getElementById('cis-message-style'))return;var s=document.createElement('style');s.id='cis-message-style';s.textContent=`
 #cis-message-fenetre{position:fixed;inset:0;z-index:2147482000;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:20px;padding-top:max(20px,env(safe-area-inset-top));padding-bottom:max(20px,env(safe-area-inset-bottom));background:rgba(8,15,24,.6);font-family:Arial,sans-serif;color:#20272d}
 #cis-message-fenetre .cis-message-carte{width:100%;max-width:520px;max-height:85vh;max-height:85dvh;display:flex;flex-direction:column;background:#fff;border:1px solid #dce2e8;border-radius:20px;box-shadow:0 18px 70px #0004;overflow:hidden}
 #cis-message-fenetre h2{flex:none;margin:0;padding:25px 25px 16px;font-size:23px;font-weight:750;line-height:1.3;overflow-wrap:anywhere;color:inherit}
 #cis-message-fenetre .cis-message-texte{margin:0;padding:0 25px 12px;overflow:auto;overscroll-behavior:contain;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6;font-size:16px;color:inherit}
 #cis-message-fenetre .cis-message-actions{padding:12px 25px 25px;flex:none}
 #cis-message-fenetre button{display:block;width:100%;min-height:48px;padding:13px;border:0;border-radius:12px;background:#207448;color:#fff;font:700 16px Arial,sans-serif;cursor:pointer}
 #cis-message-fenetre button:focus-visible{outline:3px solid #1687ff;outline-offset:3px}
 #cis-message-fenetre [role=status]{margin:0 0 10px;font-size:14px;line-height:1.4;color:#b3262e}
 #cis-message-fenetre [role=status]:empty{display:none}
 @media(min-width:1000px){#cis-message-fenetre .cis-message-carte{background:#18232d;border-color:#40515e;color:#f4f7fa}}
 `;document.head.appendChild(s);}
 function afficher(){var u=utilisateur();if(!u||u!==owner||document.hidden)return;var m=memo.messages.find(function(x){return x&&x.id&&!memo.valides[x.id]});if(overlay){if(!m||overlay.dataset.message!==m.id)fermer();else return;}if(!m||autresFenetres())return;
  style();previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  overlay=document.createElement('div');overlay.id='cis-message-fenetre';overlay.dataset.message=m.id;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','cis-message-objet');
  overlay.innerHTML='<section class="cis-message-carte"><h2 id="cis-message-objet"></h2><div class="cis-message-texte" tabindex="0"></div><div class="cis-message-actions"><p role="status"></p><button type="button">Valider</button></div></section>';
  overlay.querySelector('h2').textContent=String(m.objet||'');overlay.querySelector('.cis-message-texte').textContent=String(m.description||'');document.body.appendChild(overlay);
  appElement=document.getElementById('app');if(appElement){previousAria=appElement.getAttribute('aria-hidden');previousInert=!!appElement.inert;if('inert'in appElement)appElement.inert=true;appElement.setAttribute('aria-hidden','true');}
  overlay.querySelector('button').addEventListener('click',function(){void valider(u,m.id)});try{overlay.querySelector('button').focus({preventScroll:true})}catch(_){overlay.querySelector('button').focus()}
 }
 async function requete(u,nom,args){
  if(!navigator.onLine||utilisateur()!==u)throw Error('Indisponible');var c;try{c=obtenirClientSupabase()}catch(_){}if(!c)throw Error('Indisponible');
  var timer,session;try{session=(await Promise.race([c.auth.getSession(),new Promise(function(_,reject){timer=setTimeout(function(){reject(Error('Délai dépassé'))},5000)})])).data?.session}finally{clearTimeout(timer)}
  if(!session||String(session.user.id)!==u||Number(session.expires_at||0)*1000<=Date.now()+15000||utilisateur()!==u)throw Error('Indisponible');
  var controller=new AbortController();timer=setTimeout(function(){controller.abort()},8000);
  try{var r=await fetch(window.SUPABASE_URL+'/rest/v1/rpc/'+nom,{method:'POST',headers:{apikey:window.SUPABASE_ANON_KEY,Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},body:JSON.stringify(args||{}),signal:controller.signal});if(!r.ok)throw Error('Indisponible');var d=await r.json();if(utilisateur()!==u)throw Error('Compte changé');return d}finally{clearTimeout(timer)}
 }
 async function valider(u,id){
  if(utilisateur()!==u||owner!==u||!overlay||overlay.dataset.message!==id)return;
  var next={messages:memo.messages,valides:Object.assign({},memo.valides)};next.valides[id]={envoye:false};
  if(!sauver(u,next)){
   var element=overlay,b=overlay.querySelector('button');b.disabled=true;
   try{await requete(u,'cis_valider_message_application',{p_id:id});if(owner!==u||utilisateur()!==u)return;next.valides[id].envoye=true;memo=next;fermer();afficher();}
   catch(_){if(overlay===element)overlay.querySelector('[role=status]').textContent='Validation non enregistrée. Réessaie lorsque la connexion est disponible.';}
   finally{if(overlay===element)b.disabled=false;}return;
  }
  memo=next;fermer();afficher();last=0;void synchroniser();
 }
 async function synchroniser(){
  var u=utilisateur();changerCompte(u);if(!u||fetching||!navigator.onLine||document.hidden)return;fetching=true;
  try{
   var ids=Object.keys(memo.valides).filter(function(id){return !memo.valides[id].envoye}).slice(0,20);
   for(var i=0;i<ids.length;i++){await requete(u,'cis_valider_message_application',{p_id:ids[i]});if(owner!==u)return;memo.valides[ids[i]].envoye=true;sauver(u,memo);}
   var messages=await requete(u,'cis_lire_messages_application',{});if(owner!==u||!Array.isArray(messages))return;
   memo.messages=messages.filter(function(m){return m&&typeof m.id==='string'&&typeof m.objet==='string'&&typeof m.description==='string'});sauver(u,memo);
  }catch(_){/* Une connexion faible ne change jamais la session ni les files d'attente métier. */}
  finally{fetching=false;last=owner===u?Date.now():0;if(utilisateur()===owner)afficher();}
 }
 function tick(){changerCompte(utilisateur());afficher();if(owner&&Date.now()-last>60000)void synchroniser();}
 document.addEventListener('keydown',function(e){if(!overlay)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();}if(e.key==='Tab'){var text=overlay.querySelector('.cis-message-texte'),button=overlay.querySelector('button');if(e.shiftKey&&document.activeElement===text){e.preventDefault();button.focus()}else if(!e.shiftKey&&document.activeElement===button){e.preventDefault();text.focus()}}},true);
 window.addEventListener('online',function(){last=0;tick()});document.addEventListener('visibilitychange',function(){if(!document.hidden){last=0;tick()}});
 window.addEventListener('storage',function(e){if(owner&&e.key===cle(owner)){memo=lire(owner);afficher();last=0;}});
 new MutationObserver(function(){changerCompte(utilisateur());afficher()}).observe(document.body,{attributes:true,attributeFilter:['class']});
 setInterval(tick,2000);tick();
})();
