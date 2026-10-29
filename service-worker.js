"use strict";
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);
 const autreProjet=u.hostname.endsWith('.supabase.co')&&u.hostname!=='lcpwnybtcsvnlcutnate.supabase.co';
 const fonctionExterne=u.hostname==='lcpwnybtcsvnlcutnate.supabase.co'&&u.pathname.startsWith('/functions/v1/');
 if(autreProjet||fonctionExterne||['cis-lechesne.fr','admin.cis-lechesne.fr','pilotage.cis-lechesne.fr'].includes(u.hostname)){
  event.stopImmediatePropagation();event.respondWith(Promise.resolve(new Response(JSON.stringify({error:'Requête désactivée dans la version de test.'}),{status:403,headers:{'Content-Type':'application/json'}})));
 }
});
importScripts("./notifications-history.js?v=vsav-sans-stock-v1");

/* =========================================================
   INVENTAIRE CASERNE
   SERVICE WORKER
   MODE HORS CONNEXION
   ========================================================= */


/*
 * VERSION DU CACHE
 *
 * On passe à V4 pour forcer l'iPhone et l'iPad
 * à récupérer le nouvel app.js.
 */

const CACHE_NAME = "cis-test-vsav-sans-stock-20261029-v1";


/*
 * Fichiers nécessaires au fonctionnement
 * de l'application hors connexion.
 */

const FICHIERS_APPLICATION = ["./isolation-test.js?v=1","./maintenance-client.js","./interface-personnelle.js","./equipe-evolution.js",
 "./inventaire-technique.js", "./inventaire-technique.css",

    "./",

    "./index.html",
    "./vsav-sans-stock.js?v=1",
    "./suivi-vsav.js?v=sans-stock-v1",

    "./app.js?v=vsav-sans-stock-test-v1",
    "./pharmacie-categories.js?v=3",
    "./formations-commun.js",
    "./formations.js",
    "./formations.css",

    "./travail-equipe.js?v=retour-normal-20261028c",
    "./fiche-garde.js?v=retour-normal-20261028c",
    "./fiche-garde-pdf.js",
    "./fiche-garde.css",
    "./fiche-fin-garde-modele.pdf",

    "./pilotage-suivi.js",
    "./pilotage-mesures.js",
    "./messages-application.js",
    "./nettoyage-sync.js",

    "./notifications-history.js",

    "./style.css",

    "./manifest.json",

    "./supabase-config.js",

    "./icon-192.png",

    "./icon-512.png",

    "./apple-touch-icon.png",

    "./profil-logo-admin.png",

    "./profil-logo-pilotage.svg",

    "./fond-connexion.png",

    "./fond-connexion-pc.png",

    "./logo-version-pc.png",

    "./plan-caserne.png"

];


/* =========================================================
   INSTALLATION
   ========================================================= */

self.addEventListener(
    "install",
    function (event) {

        console.log(
            "Installation du Service Worker V83..."
        );


        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )
                .then(
                    function (cache) {

                        console.log(
                            "Mise en cache de l'application..."
                        );


                        return Promise.all(
                            FICHIERS_APPLICATION.map(
                                async function (fichier) {

                                    const requete =
                                        new Request(
                                            fichier,
                                            {
                                                cache:
                                                    "reload"
                                            }
                                        );

                                    const reponse =
                                        await fetch(
                                            requete
                                        );

                                    if (
                                        !reponse ||
                                        !reponse.ok
                                    ) {
                                        throw new Error(
                                            "Impossible de mettre à jour : " +
                                            fichier
                                        );
                                    }

                                    await cache.put(
                                        fichier,
                                        reponse.clone()
                                    );

                                }
                            )
                        );

                    }
                )
        );

    }
);



/* =========================================================
   ACTIVATION MANUELLE D'UNE MISE À JOUR
   ========================================================= */

self.addEventListener(
    "message",
    function (event) {

        if (
            event.data &&
            event.data.type ===
            "SKIP_WAITING"
        ) {

            self.skipWaiting();

        }

    }
);


/* =========================================================
   ACTIVATION
   ========================================================= */

self.addEventListener(
    "activate",
    function (event) {

        console.log(
            "Activation du Service Worker V58..."
        );


        event.waitUntil(

            caches
                .keys()
                .then(
                    function (nomsCaches) {

                        return Promise.all(

                            nomsCaches
                                .filter(
                                    function (nom) {

                                        return (
                                            nom !==
                                            CACHE_NAME
                                        );

                                    }
                                )
                                .map(
                                    function (nom) {

                                        console.log(
                                            "Suppression ancien cache :",
                                            nom
                                        );


                                        return caches.delete(
                                            nom
                                        );

                                    }
                                )

                        );

                    }
                )
                .then(
                    function () {

                        /*
                         * Prend immédiatement le contrôle
                         * des pages ouvertes.
                         */

                        return self.clients.claim();

                    }
                )

        );

    }
);


/* =========================================================
   REQUETES
   ========================================================= */



/* =========================================================
   NOTIFICATIONS WEB PUSH
   Compatible Android + PWA iPhone/iPad
   ========================================================= */

self.addEventListener('push', event => {
 let data={};try{data=event.data?event.data.json():{};}catch(_){data={body:event.data?.text()||''};}
 if(!data||typeof data!=='object')data={body:String(data||'')};
 event.waitUntil((async()=>{
  let record=null;
  try{
   const subscription=await self.registration.pushManager.getSubscription();
   const owner=await CISNotifications.owner(subscription?.endpoint);
   // Le propriétaire est enregistré après l'association réussie côté Supabase.
   record=await CISNotifications.receive(data,owner);
  }catch(e){console.warn('Historique Push indisponible',e);}
  const url=new URL('./',self.registration.scope);if(record)url.searchParams.set('notification',record.id);
  if(!record?.duplicate) await self.registration.showNotification(data.title||'Inventaire Caserne',{
   ...(data.tag?{tag:String(data.tag)}:{}),body:data.body||'Nouvelle notification',icon:data.icon||'./icon-192.png',badge:data.badge||'./icon-192.png',
   data:{url:record?url.href:(data.url||'./'),notificationId:record?.id||null,userId:record?.userId||null}
  });
  if(record){const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of windows)client.postMessage({type:'CIS_NOTIFICATIONS_UPDATED',userId:record.userId});}
 })());
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{
  const data=event.notification.data||{};let url;
  try{url=new URL(data.url||'./',self.registration.scope);if(url.origin!==self.location.origin)url=new URL('./',self.registration.scope);}catch(_){url=new URL('./',self.registration.scope);}
  const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of windows){
   if(!client.url.startsWith(self.registration.scope))continue;
   if(data.notificationId){client.postMessage({type:'CIS_OPEN_NOTIFICATION',id:data.notificationId});return client.focus();}
   if('navigate' in client)await client.navigate(url.href);return client.focus();
  }
  return self.clients.openWindow(url.href);
 })());
});


self.addEventListener(
    "fetch",
    function (event) {

        /*
         * On ne traite que les requêtes GET.
         */
        if (
            event.request.method !==
            "GET"
        ) {
            return;
        }


        const url =
            new URL(
                event.request.url
            );


        /*
         * IMPORTANT :
         * on ne met JAMAIS en cache les requêtes vers
         * Supabase, le CDN JavaScript ou un autre domaine.
         *
         * Ainsi les stocks, interventions et consommations
         * sont toujours lus directement depuis Supabase.
         */
        if (
            url.origin !==
            self.location.origin
        ) {
            return;
        }


        event.respondWith(

            fetch(
                new Request(
                    event.request,
                    {
                        cache:
                            "no-store"
                    }
                )
            )
                .then(
                    async function (
                        reponseReseau
                    ) {

                        if (
                            reponseReseau &&
                            reponseReseau.status === 200 &&
                            reponseReseau.type !== "opaque"
                        ) {

                            const cache =
                                await caches.open(
                                    CACHE_NAME
                                );

                            await cache.put(
                                event.request,
                                reponseReseau.clone()
                            );

                        }

                        return reponseReseau;

                    }
                )
                .catch(
                    async function () {

                        const reponseCache =
                            await caches.match(
                                event.request,
                                {ignoreSearch:url.pathname.endsWith("/plan-caserne.png")}
                            );

                        if (
                            reponseCache
                        ) {
                            return reponseCache;
                        }

                        if (
                            event.request.mode ===
                            "navigate"
                        ) {
                            return caches.match(
                                "./index.html"
                            );
                        }

                        return new Response(
                            "",
                            {
                                status: 503,
                                statusText:
                                    "Hors connexion"
                            }
                        );

                    }
                )

        );

    }
);

























