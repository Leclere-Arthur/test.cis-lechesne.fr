(function(){'use strict';
 const projet='lcpwnybtcsvnlcutnate.supabase.co';
 function verifier(input){const u=new URL(typeof input==='string'||input instanceof URL?String(input):input.url,location.href);
  if(u.hostname.endsWith('.supabase.co')&&u.hostname!==projet)throw Error('Version de test : accès à un autre projet Supabase bloqué.');
  if(['cis-lechesne.fr','admin.cis-lechesne.fr','pilotage.cis-lechesne.fr'].includes(u.hostname))throw Error('Version de test : accès à l’application en service bloqué.');
  if(u.hostname===projet&&u.pathname.startsWith('/functions/v1/'))throw Error('Les fonctions externes, mails et notifications sont désactivés pour ces premiers tests.');
  return u;
 }
 const fetchOrigine=window.fetch.bind(window);window.fetch=function(input,options){try{verifier(input);}catch(e){return Promise.reject(e);}return fetchOrigine(input,options);};
 const openOrigine=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url,...suite){verifier(url);return openOrigine.call(this,method,url,...suite);};
 const SocketOrigine=window.WebSocket;if(SocketOrigine)window.WebSocket=new Proxy(SocketOrigine,{construct(cible,args){verifier(args[0]);return Reflect.construct(cible,args);}});
 const openFenetre=window.open.bind(window);window.open=function(url,...suite){if(url&&url!=='about:blank')verifier(url);return openFenetre(url,...suite);};
 document.addEventListener('click',event=>{const a=event.target.closest?.('a[href]');if(!a)return;try{verifier(a.href);if(a.getAttribute('aria-disabled')==='true')throw Error('Cette autre application n’a pas encore de version de test configurée.');}catch(e){event.preventDefault();event.stopImmediatePropagation();alert(e.message);}},true);
 function afficher(){
  if(document.getElementById('bandeau-version-test'))return;
  const s=document.createElement('style');s.textContent='body{padding-top:calc(30px + env(safe-area-inset-top,0px))!important}#bandeau-version-test{position:fixed;top:0;left:0;right:0;z-index:2147483647;box-sizing:border-box;min-height:30px;padding:calc(7px + env(safe-area-inset-top,0px)) 10px 7px;background:#ffd861;color:#372900;text-align:center;font:700 12px/16px Arial,sans-serif}';document.head.appendChild(s);
  const b=document.createElement('div');b.id='bandeau-version-test';b.textContent='VERSION DE TEST — Données séparées du centre';document.body.appendChild(b);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',afficher,{once:true});else afficher();
})();
