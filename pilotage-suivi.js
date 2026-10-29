/* Suivi agrégé CIS : aucun champ saisi, URL, mot de passe ni contenu de message collecté. */
(function(){
 'use strict';
 var last=Date.now(),interaction=Date.now(),busy=false,lastSend=0,currentUid=null,mem={},visible=!document.hidden;
 var IDLE=120000,MAX_AGE=7*86400000;
 function client(){try{return typeof obtenirClientSupabase==='function'?obtenirClientSupabase():null}catch(_){return null}}
 function uid(){try{return typeof utilisateurConnecte!=='undefined'&&utilisateurConnecte?String(utilisateurConnecte.id):null}catch(_){return null}}
 function key(u){return 'cis_pilotage_presence_v1:'+u}
 function read(u){try{var a=JSON.parse(localStorage.getItem(key(u))||'[]');return Array.isArray(a)?a.filter(function(x){return x&&Number.isFinite(x.a)&&Number.isFinite(x.b)&&x.b>x.a&&x.a>Date.now()-MAX_AGE}).slice(-4000):[]}catch(_){return mem[u]||[]}}
 function write(u,a){mem[u]=a;try{localStorage.setItem(key(u),JSON.stringify(a));}catch(_){} }
 function espace(){var app=document.getElementById('app');if(!app)return 'Autre';var main=app.querySelector('main'),cl=String(main?.className||'');if(/portail-cis/.test(cl))return 'Accueil';if(/garde|equipe|travail/.test(cl)||app.querySelector('[data-navigation-equipe]'))return 'Équipe';if(/caserne|agenda/.test(cl))return 'Caserne';var h=String(app.querySelector('h1')?.textContent||'').trim().toLowerCase();if(h==='profil'||h==='mon profil')return 'Profil';if(/pharmacie|inventaire|intervention|historique|matériel|réapprovisionnement/.test(h))return 'Pharmacie';return 'Autre'}
 function add(u,a,b){var q=read(u),tail=q[q.length-1];if(tail&&tail.e===espace()&&a>=tail.b&&a-tail.b<300&&b-tail.a<=295000)tail.b=b;else q.push({a:a,b:b,e:espace()});write(u,q.slice(-4000))}
 function capture(){var now=Date.now(),u=uid(),elapsed=now-last;if(u&&u===currentUid&&visible&&elapsed>0&&elapsed<=15000&&last<interaction+IDLE)add(u,last,Math.min(now,interaction+IDLE));last=now;currentUid=u;visible=!document.hidden;}
 function touch(){capture();interaction=Date.now();}
 async function flush(){
  if(busy||!navigator.onLine)return;
  var u=uid(),c=client();if(!u||!c)return;
  var q=read(u);if(!q.length)return;busy=true;
  try{
   var session=(await c.auth.getSession()).data.session;
   if(!session||String(session.user.id)!==u||Number(session.expires_at||0)*1000<Date.now()+30000)return;
   var batch=q.slice(0,100),controller=new AbortController(),timer=setTimeout(function(){controller.abort()},8000);
   var response;try{response=await fetch(window.SUPABASE_URL+'/rest/v1/rpc/pilotage_enregistrer_presence',{method:'POST',headers:{apikey:window.SUPABASE_ANON_KEY,Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},body:JSON.stringify({p_plages:batch.map(function(x){return {debut:new Date(x.a).toISOString(),fin:new Date(x.b).toISOString(),espace:x.e||'Autre'}})}),signal:controller.signal});}finally{clearTimeout(timer)}
   if(response.ok){var saved=new Set(batch.map(function(x){return x.a+':'+x.b}));write(u,read(u).filter(function(x){return !saved.has(x.a+':'+x.b)}));}
  }catch(_){}finally{busy=false;lastSend=Date.now();}
 }
 // Le suivi n'appelle jamais refreshSession, signOut ou la synchronisation métier.
 ['pointerdown','keydown','touchstart','scroll'].forEach(function(n){window.addEventListener(n,touch,{passive:true})});
 document.addEventListener('visibilitychange',function(){capture();last=Date.now();if(!document.hidden)interaction=last;void flush()});
 window.addEventListener('pagehide',function(){capture();void flush()});
 window.addEventListener('online',function(){void flush()});
 setInterval(function(){capture();if(Date.now()-lastSend>=60000)void flush();},5000);
 // Journaliser la confirmation du service, sans enregistrer le contenu de la notification.
 function uuid(){var b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;var h=Array.from(b,function(x){return x.toString(16).padStart(2,'0')}).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)}
 function hook(){var c=client();if(!c||!c.functions||c.functions.__pilotage)return;var invoke=c.functions.invoke.bind(c.functions);c.functions.__pilotage=true;c.functions.invoke=async function(n,o){var r=await invoke(n,o);if(n==='envoyer-notification'&&!r.error&&r.data&&r.data.ok!==false){try{var id=uuid();void c.rpc('pilotage_noter_notification',{p_cle:id}).then(function(){},function(){});}catch(_){}}return r;};}
 hook();setInterval(hook,10000);
})();


