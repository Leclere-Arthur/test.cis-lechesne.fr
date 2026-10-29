"use strict";

/* =========================================================
   FENETRES PERSONNALISEES CIS LE CHESNE
   Remplace les alert() du navigateur par une fenêtre intégrée
   avec un message qui reprend exactement l'opération effectuée.
   ========================================================= */

function initialiserFenetreCIS() {

    if (document.getElementById("fenetre-cis-style")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "fenetre-cis-style";
    style.textContent = `
        .fenetre-cis-overlay {
            position: fixed;
            inset: 0;
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            background: rgba(0, 0, 0, .48);
            backdrop-filter: blur(3px);
        }

        .fenetre-cis {
            width: min(92vw, 430px);
            box-sizing: border-box;
            overflow: hidden;
            border-radius: 16px;
            background: #ffffff;
            color: #17202a;
            box-shadow: 0 20px 60px rgba(0, 0, 0, .28);
            animation: fenetreCisEntree .16s ease-out;
        }

        .fenetre-cis-entete {
            padding: 18px 20px 15px;
            background: #111820;
            color: #ffffff;
        }

        .fenetre-cis-entete strong {
            display: block;
            font-size: 17px;
            line-height: 1.2;
        }

        .fenetre-cis-corps {
            padding: 20px;
            font-size: 15px;
            line-height: 1.45;
            white-space: pre-line;
        }

        .fenetre-cis-actions {
            display: flex;
            justify-content: flex-end;
            padding: 0 20px 20px;
        }

        .fenetre-cis-ok {
            min-width: 92px;
            min-height: 42px;
            padding: 9px 18px;
            border: 0;
            border-radius: 9px;
            background: #1f6f4a;
            color: #ffffff;
            font: inherit;
            font-weight: 800;
            cursor: pointer;
        }

        .fenetre-cis-ok:hover {
            filter: brightness(1.05);
        }

        .fenetre-cis-actions-double {
            gap: 10px;
        }

        .fenetre-cis-annuler {
            min-width: 92px;
            min-height: 42px;
            padding: 9px 18px;
            border: 1px solid #cfd5da;
            border-radius: 9px;
            background: #f2f4f6;
            color: #26313a;
            font: inherit;
            font-weight: 800;
            cursor: pointer;
        }

        .fenetre-cis-question {
            margin-bottom: 12px;
        }

        .fenetre-cis-input {
            width: 100%;
            min-height: 44px;
            box-sizing: border-box;
            padding: 10px 12px;
            border: 1px solid #c7d0d7;
            border-radius: 8px;
            background: #ffffff;
            color: #17202a;
            font: inherit;
            outline: none;
        }

        .fenetre-cis-input:focus {
            border-color: #1f6f4a;
            box-shadow: 0 0 0 3px rgba(31,111,74,.12);
        }

        .fenetre-cis.succes .fenetre-cis-entete {
            background: #146b43;
        }

        .fenetre-cis.avertissement .fenetre-cis-entete {
            background: #9b6518;
        }

        .fenetre-cis.erreur .fenetre-cis-entete {
            background: #9f2832;
        }

        @keyframes fenetreCisEntree {
            from {
                opacity: 0;
                transform: translateY(8px) scale(.985);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;

    document.head.appendChild(style);
}


function determinerTypeFenetreCIS(message) {

    const texte =
        String(message || "").toLowerCase();

    if (
        texte.includes("erreur") ||
        texte.includes("échou") ||
        texte.includes("refus") ||
        texte.includes("impossible")
    ) {
        return "erreur";
    }

    if (
        texte.includes("⚠️") ||
        texte.includes("attention") ||
        texte.includes("hors connexion")
    ) {
        return "avertissement";
    }

    if (
        texte.includes("✅") ||
        texte.includes("succès") ||
        texte.includes("enregistré") ||
        texte.includes("ajouté") ||
        texte.includes("supprimé") ||
        texte.includes("modifié") ||
        texte.includes("effectué")
    ) {
        return "succes";
    }

    return "information";
}



function afficherConfirmationCIS(message) {

    initialiserFenetreCIS();

    return new Promise(function (resolve) {

        const ancienne =
            document.querySelector(
                ".fenetre-cis-overlay"
            );

        if (ancienne) {
            ancienne.remove();
        }

        const overlay =
            document.createElement("div");

        overlay.className =
            "fenetre-cis-overlay";

        const contenu =
            document.createElement("div");

        contenu.className =
            "fenetre-cis information";

        const entete =
            document.createElement("div");

        entete.className =
            "fenetre-cis-entete";

        entete.innerHTML =
            "<strong>CIS Le Chesne</strong>";

        const corps =
            document.createElement("div");

        corps.className =
            "fenetre-cis-corps";

        corps.textContent =
            String(message || "");

        const actions =
            document.createElement("div");

        actions.className =
            "fenetre-cis-actions fenetre-cis-actions-double";

        const annuler =
            document.createElement("button");

        annuler.type = "button";
        annuler.className =
            "fenetre-cis-annuler";
        annuler.textContent =
            "Annuler";

        const confirmer =
            document.createElement("button");

        confirmer.type = "button";
        confirmer.className =
            "fenetre-cis-ok";
        confirmer.textContent =
            "Confirmer";

        let termine = false;

        const fermer =
            function (valeur) {

                if (termine) {
                    return;
                }

                termine = true;
                overlay.remove();
                resolve(valeur);

            };

        annuler.addEventListener(
            "click",
            function () {
                fermer(false);
            }
        );

        confirmer.addEventListener(
            "click",
            function () {
                fermer(true);
            }
        );

        overlay.addEventListener(
            "click",
            function (event) {

                if (event.target === overlay) {
                    fermer(false);
                }

            }
        );

        const gestionTouche =
            function (event) {

                if (event.key === "Escape") {

                    document.removeEventListener(
                        "keydown",
                        gestionTouche
                    );

                    fermer(false);

                } else if (event.key === "Enter") {

                    document.removeEventListener(
                        "keydown",
                        gestionTouche
                    );

                    fermer(true);

                }

            };

        document.addEventListener(
            "keydown",
            gestionTouche
        );

        actions.appendChild(annuler);
        actions.appendChild(confirmer);

        contenu.appendChild(entete);
        contenu.appendChild(corps);
        contenu.appendChild(actions);

        overlay.appendChild(contenu);
        document.body.appendChild(overlay);

        window.setTimeout(
            function () {
                confirmer.focus();
            },
            20
        );

    });
}


function afficherSaisieCIS(
    message,
    valeurInitiale = "",
    typeChamp = "text"
) {

    initialiserFenetreCIS();

    return new Promise(function (resolve) {

        const ancienne =
            document.querySelector(
                ".fenetre-cis-overlay"
            );

        if (ancienne) {
            ancienne.remove();
        }

        const overlay =
            document.createElement("div");

        overlay.className =
            "fenetre-cis-overlay";

        const contenu =
            document.createElement("div");

        contenu.className =
            "fenetre-cis information";

        const entete =
            document.createElement("div");

        entete.className =
            "fenetre-cis-entete";

        entete.innerHTML =
            "<strong>CIS Le Chesne</strong>";

        const corps =
            document.createElement("div");

        corps.className =
            "fenetre-cis-corps";

        const texte =
            document.createElement("div");

        texte.className =
            "fenetre-cis-question";

        texte.textContent =
            String(message || "");

        const champ =
            document.createElement("input");

        champ.type = typeChamp === "password" ? "password" : "text";
        champ.className =
            "fenetre-cis-input";
        champ.value =
            String(valeurInitiale || "");

        corps.appendChild(texte);
        corps.appendChild(champ);

        const actions =
            document.createElement("div");

        actions.className =
            "fenetre-cis-actions fenetre-cis-actions-double";

        const annuler =
            document.createElement("button");

        annuler.type = "button";
        annuler.className =
            "fenetre-cis-annuler";
        annuler.textContent =
            "Annuler";

        const valider =
            document.createElement("button");

        valider.type = "button";
        valider.className =
            "fenetre-cis-ok";
        valider.textContent =
            "Valider";

        let termine = false;

        const fermer =
            function (valeur) {

                if (termine) {
                    return;
                }

                termine = true;
                overlay.remove();
                resolve(valeur);

            };

        annuler.addEventListener(
            "click",
            function () {
                fermer(null);
            }
        );

        valider.addEventListener(
            "click",
            function () {
                fermer(champ.value);
            }
        );

        overlay.addEventListener(
            "click",
            function (event) {

                if (event.target === overlay) {
                    fermer(null);
                }

            }
        );

        champ.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();
                    fermer(champ.value);

                } else if (event.key === "Escape") {

                    event.preventDefault();
                    fermer(null);

                }

            }
        );

        actions.appendChild(annuler);
        actions.appendChild(valider);

        contenu.appendChild(entete);
        contenu.appendChild(corps);
        contenu.appendChild(actions);

        overlay.appendChild(contenu);
        document.body.appendChild(overlay);

        window.setTimeout(
            function () {

                champ.focus();
                champ.select();

            },
            20
        );

    });
}


/* Retour haptique discret après une confirmation de réussite.
   navigator.vibrate est facultatif : iOS et certains navigateurs l'ignorent. */
let dernierRetourHaptiqueCIS = 0;
function vibrerConfirmationEnregistrementCIS(message) {
    if (determinerTypeFenetreCIS(message) !== "succes") return;
    if (typeof navigator.vibrate !== "function") return;
    const maintenant = Date.now();
    if (maintenant - dernierRetourHaptiqueCIS < 700) return;
    dernierRetourHaptiqueCIS = maintenant;
    try { navigator.vibrate(80); } catch (_) { /* Vibration non prise en charge. */ }
}

function afficherFenetreCIS(message) {

    initialiserFenetreCIS();

    return new Promise(function (resolve) {

        const ancienne =
            document.querySelector(
                ".fenetre-cis-overlay"
            );

        if (ancienne) {
            ancienne.remove();
        }

        const type =
            determinerTypeFenetreCIS(message);

        vibrerConfirmationEnregistrementCIS(message);

        const overlay =
            document.createElement("div");

        overlay.className =
            "fenetre-cis-overlay";

        const contenu =
            document.createElement("div");

        contenu.className =
            "fenetre-cis " + type;

        const entete =
            document.createElement("div");

        entete.className =
            "fenetre-cis-entete";

        entete.innerHTML =
            "<strong>CIS Le Chesne</strong>";

        const corps =
            document.createElement("div");

        corps.className =
            "fenetre-cis-corps";

        corps.textContent =
            String(message || "");

        const actions =
            document.createElement("div");

        actions.className =
            "fenetre-cis-actions";

        const ok =
            document.createElement("button");

        ok.type = "button";
        ok.className =
            "fenetre-cis-ok";
        ok.textContent = "OK";

        const fermer =
            function () {

                overlay.remove();
                resolve();

            };

        ok.addEventListener(
            "click",
            fermer
        );

        overlay.addEventListener(
            "click",
            function (event) {

                if (event.target === overlay) {
                    fermer();
                }

            }
        );

        document.addEventListener(
            "keydown",
            function gestionTouche(event) {

                if (
                    event.key === "Enter" ||
                    event.key === "Escape"
                ) {
                    document.removeEventListener(
                        "keydown",
                        gestionTouche
                    );
                    fermer();
                }

            }
        );

        actions.appendChild(ok);
        contenu.appendChild(entete);
        contenu.appendChild(corps);
        contenu.appendChild(actions);
        overlay.appendChild(contenu);
        document.body.appendChild(overlay);

        window.setTimeout(
            function () {
                ok.focus();
            },
            20
        );

    });
}


/*
 * Tous les anciens alert() de l'application passent maintenant
 * par la fenêtre CIS Le Chesne. Le texte reste celui de l'action
 * réelle : retour enregistré, stock ajouté, utilisateur modifié, etc.
 */
window.alert = function (message) {
    const texte = String(message || "");
    if (determinerTypeFenetreCIS(texte) === "succes" &&
        /enregistr|ajouté|modifié|supprimé|effectué|sauvegardé|validé/i.test(texte)) {
        void animationValidationEnregistrementCIS(texte.replace(/^[\s✅✓]+/, ""));
        return;
    }
    afficherFenetreCIS(message);
};



/* Confirmation plein écran : cercle vert qui s'ouvre après une sauvegarde réussie. */
let confirmationEnregistrementActiveCIS = false;
async function animationValidationEnregistrementCIS(texte, destination) {
    if (confirmationEnregistrementActiveCIS) return;
    confirmationEnregistrementActiveCIS = true;
    const ancien = document.getElementById("cis-validation-plein-ecran");
    if (ancien) ancien.remove();
    if (!document.getElementById("cis-validation-animation-style")) {
        const style = document.createElement("style");
        style.id = "cis-validation-animation-style";
        style.textContent = `
          #cis-validation-plein-ecran{position:fixed;inset:0;z-index:300000;display:grid;place-items:center;overflow:hidden;pointer-events:all;color:white}
          #cis-validation-plein-ecran .cis-validation-bulle{position:absolute;left:50%;top:50%;width:120vmax;height:120vmax;border-radius:50%;background:#16844b;transform:translate(-50%,-50%) scale(0);animation:cis-bulle-ouvrir .7s cubic-bezier(.2,.7,.2,1) forwards}
          #cis-validation-plein-ecran .cis-validation-contenu{position:relative;z-index:1;text-align:center;padding:24px;opacity:0;animation:cis-texte-apparaitre .4s ease .42s forwards;font:inherit}
          #cis-validation-plein-ecran .cis-validation-coche{font-size:70px;font-weight:900;line-height:1.2}
          #cis-validation-plein-ecran .cis-validation-message{font-size:clamp(19px,5vw,27px);font-weight:800;max-width:85vw}
          @keyframes cis-bulle-ouvrir{to{transform:translate(-50%,-50%) scale(1)}}
          @keyframes cis-texte-apparaitre{to{opacity:1}}
          @media(prefers-reduced-motion:reduce){#cis-validation-plein-ecran .cis-validation-bulle{animation-duration:.01s}#cis-validation-plein-ecran .cis-validation-contenu{animation-delay:0s;animation-duration:.01s}}
        `;
        document.head.appendChild(style);
    }
    const overlay = document.createElement("div");
    overlay.id = "cis-validation-plein-ecran";
    const bulle = document.createElement("div"); bulle.className = "cis-validation-bulle";
    const contenu = document.createElement("div"); contenu.className = "cis-validation-contenu";
    const coche = document.createElement("div"); coche.className = "cis-validation-coche"; coche.textContent = "✓";
    const message = document.createElement("div"); message.className = "cis-validation-message";
    message.textContent = texte || "Enregistrement effectué";
    contenu.append(coche, message); overlay.append(bulle, contenu); document.body.appendChild(overlay);
    try {
        vibrerConfirmationEnregistrementCIS("Enregistré");
        await new Promise(resolve => setTimeout(resolve, 1350));
        if (typeof destination === "function") await destination();
    } finally {
        overlay.remove(); confirmationEnregistrementActiveCIS = false;
    }
}

/* =========================================================
   INVENTAIRE CASERNE
   APP.JS COMPLET
   ========================================================= */

/*
 * Authentification et rôles
 */
const DOMAINE_EMAIL_INTERNE =
    "inventaire-caserne.local";

const VERSION_APPLICATION =
    "2.9.70";

const CLE_PROFIL_UTILISATEUR_CACHE =
    "profil_utilisateur_connecte_v1";

let utilisateurConnecte = null;
let profilUtilisateurConnecte = null;
let connexionApplicationEnCours = false;

/*
 * Retour du profil : on mémorise exactement la page affichée avant
 * d'ouvrir le profil afin que « Retour » revienne au bon endroit
 * (Caserne, Pharmacie, Accueil, rubrique, etc.).
 */
let etatPageAvantProfil = null;

/* =========================================================
   HISTORIQUE DE NAVIGATION INTERNE
   Tous les boutons « Retour » reviennent désormais à la page
   réellement consultée juste avant, quel que soit l'espace.
   ========================================================= */
const historiqueNavigationApplication = [];
let etatNavigationCourante = null;
let restaurationNavigationEnCours = false;
let observateurHistoriqueNavigationInstalle = false;

function obtenirSignaturePageApplication() {
    const app = document.getElementById("app");
    if (!app) return "";
    const principal = app.querySelector("main");
    const titre = String(app.querySelector("h1,h2")?.textContent || "").trim();
    const classes = String(principal?.className || "").trim();
    return `${classes}::${titre}`;
}

function capturerEtatPageApplication() {
    const app = document.getElementById("app");
    if (!app) return null;
    return {
        html: app.innerHTML,
        scrollX: window.scrollX || 0,
        scrollY: window.scrollY || 0,
        bodyClassName: document.body.className || "",
        signature: obtenirSignaturePageApplication()
    };
}

function memoriserTransitionNavigation() {
    if (restaurationNavigationEnCours) return;
    const nouvelEtat = capturerEtatPageApplication();
    if (!nouvelEtat || !nouvelEtat.signature) return;

    if (!etatNavigationCourante) {
        etatNavigationCourante = nouvelEtat;
        return;
    }

    if (nouvelEtat.signature !== etatNavigationCourante.signature) {
        historiqueNavigationApplication.push(etatNavigationCourante);
        if (historiqueNavigationApplication.length > 40) historiqueNavigationApplication.shift();
        etatNavigationCourante = nouvelEtat;
    } else {
        etatNavigationCourante = nouvelEtat;
    }
    nettoyerListesHistoriquesProgressives();
}

function installerHistoriqueNavigationApplication() {
    if (observateurHistoriqueNavigationInstalle) return;
    observateurHistoriqueNavigationInstalle = true;
    const app = document.getElementById("app");
    if (!app) return;

    etatNavigationCourante = capturerEtatPageApplication();
    const obs = new MutationObserver(() => {
        requestAnimationFrame(memoriserTransitionNavigation);
    });
    obs.observe(app, { childList: true, subtree: false });

    document.addEventListener("click", (event) => {
        const bouton = event.target?.closest?.(".retour-button, .reappro-retour, [data-retour-page]");
        if (!bouton) return;
        // Les modules d'équipe gèrent leurs retours et réinitialisent leurs actions.
        // Ne pas remplacer leur navigation par une restauration de HTML sans écouteurs.
        if (bouton.classList.contains("veh-retour") || bouton.hasAttribute("data-navigation-equipe") ||
            bouton.hasAttribute("data-fg-action") || bouton.closest(".travail-page")) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        retourPagePrecedente();
    }, true);
}

function retourPagePrecedente() {
    const precedent = historiqueNavigationApplication.pop();
    if (!precedent || !precedent.html) {
        afficherPortailPrincipal();
        return;
    }

    restaurationNavigationEnCours = true;
    document.body.className = precedent.bodyClassName || "";
    const app = document.getElementById("app");
    if (!app) {
        restaurationNavigationEnCours = false;
        afficherPortailPrincipal();
        return;
    }

    // Recréer les pages dynamiques : leurs événements ne sont pas stockés dans innerHTML.
    const pageEquipe = document.createElement("template");
    pageEquipe.innerHTML = precedent.html;
    const ficheEquipe = pageEquipe.content.querySelector("#fiche-garde-page[data-fg-semaine]");
    if (ficheEquipe && window.CISFicheGarde) {
        restaurationNavigationEnCours = false;
        void CISFicheGarde.ouvrir(ficheEquipe.dataset.fgSemaine, ficheEquipe.dataset.fgMode || "recap");
        return;
    }
    if (pageEquipe.content.querySelector("#travail-contenu") && window.CISTravail) {
        restaurationNavigationEnCours = false;
        CISTravail.retourFiche();
        return;
    }

    app.innerHTML = precedent.html;
    etatNavigationCourante = precedent;
    void initialiserListesHistoriquesProgressives(app);
    if (app.querySelector('#garde-planning-calendrier')) {
        restaurationNavigationEnCours = false;
        void afficherPlanningEspaceGarde(app.querySelector('#garde-planning-calendrier').dataset.mois);
        return;
    }
    if (app.querySelector('#garde-menage-duree')) {
        restaurationNavigationEnCours = false;
        void afficherMenageEspaceGarde();
        return;
    }
    if (app.querySelector('#notifications-historique-page')) {
        restaurationNavigationEnCours = false;
        void afficherHistoriqueNotifications();
        return;
    }
    // Une page inventaire restaurée doit retrouver ses données et ses photos.
    // La restauration HTML seule ne relance pas les chargements asynchrones.
    if (app.querySelector(".veh-inventaire-liste")) {
        restaurationNavigationEnCours = false;
        void afficherInventaireVehiculeEspaceGarde();
        return;
    }
    if (app.querySelector(".veh-inventaire-contenu") && vehInventaireSession) {
        restaurationNavigationEnCours = false;
        vehInventaireAfficherZones();
        return;
    }
    if (app.querySelector(".veh-photo-miniature")) void vehInventaireChargerPhotos();
    actualiserInterfaceBureau();
    synchroniserApparencePWACaserne();

    // Si le retour restaure le portail principal depuis l'historique HTML,
    // la carte de garde mémorisée peut être ancienne. On la recharge aussitôt.
    if (document.getElementById("carte-garde-accueil")) {
        requestAnimationFrame(() =>
            requestAnimationFrame(() => void actualiserCarteGardeAccueil())
        );
    }

    requestAnimationFrame(() => {
        window.scrollTo({
            left: precedent.scrollX || 0,
            top: precedent.scrollY || 0,
            behavior: "auto"
        });
        setTimeout(() => { restaurationNavigationEnCours = false; }, 0);
    });
}

function ouvrirProfilDepuisPageCourante() {
    const app = document.getElementById("app");

    etatPageAvantProfil = {
        html: app ? app.innerHTML : "",
        scrollX: window.scrollX || 0,
        scrollY: window.scrollY || 0,
        bodyClassName: document.body.className || ""
    };

    afficherProfilUtilisateur();
}

function retournerDepuisProfil() {
    etatPageAvantProfil = null;
    retourPagePrecedente();
}

/*
 * Notifications Web Push
 * Compatible PWA Android + iPhone/iPad (iOS/iPadOS 16.4+,
 * lorsque l'application est ajoutée à l'écran d'accueil).
 * La clé VAPID publique peut être présente dans le navigateur.
 */
const VAPID_PUBLIC_KEY =
    "BBl_OlQR456avmsTxk4ywCSvGvedYFaPe4RV8M-evqk6wkEwQFnQIjWHpRFQw74reIo8AazwCgeueutZjDATGCI";

let activationNotificationsEnCours = false;
let envoiNotificationsStockEnCours = false;

const CLE_NOTIFICATIONS_STOCK_EN_ATTENTE =
    "notifications_stock_en_attente_v1";

const STORAGE = {
    materiels: "materiels",
    categories: "categories",
    historique: "historiqueConsommations",
    archivesHistorique: "archives_historique",

    materielsV3: "materiels_v3",
    categoriesV3: "categories_v3",
    historiqueV3: "historique_v3",
    archivesHistoriqueV3: "archives_historique_v3"
};



let materiels = [];
let categories = [];
let historique = [];
let archivesHistorique = [];

let consommationsEnCours = {};
let materielEnModification = null;

let validationRetourInterventionEnCours = false;


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", async function () {

    initialiserIndicateurSynchronisation();
    initialiserCentreNotifications();
    initialiserBandeauConnexion();

    void initialiserSystemeMiseAJourApplication();

    chargerToutesLesDonnees();

    const authentifie =
        await initialiserAuthentificationApplication();

    if (!authentifie) {
        afficherConnexion();
        return;
    }

    initialiserBoutonNotifications();

    await initialiserSynchronisationSupabase();
    preparerRepriseHorsConnexion();

    afficherPortailPrincipal();
    window.__cisNotificationsApplicationPrete=true;
    void traiterNotificationEnAttente();

});


function chargerToutesLesDonnees() {

    chargerMateriels();
    chargerCategories();
    chargerHistorique();
    chargerArchivesHistorique();

    normaliserToutesLesDonnees();

    sauvegarderToutesLesDonnees();

}





/* =========================================================
   MISE À JOUR DE L'APPLICATION
   ========================================================= */

let inscriptionServiceWorkerApplication =
    null;

let miseAJourApplicationDisponible =
    false;

let activationMiseAJourEnCours =
    false;

let rechargementApresMiseAJourEnCours =
    false;

let verificationMiseAJourEnCours =
    false;

let derniereVerificationMiseAJour =
    0;

let minuteurVerificationMiseAJour =
    null;

/*
 * VERSION DU FICHIER APP.JS
 * Cette valeur change à chaque nouvelle version que je te prépare.
 * Elle permet de détecter une nouvelle version même si seul app.js change.
 */
const VERSION_APPLICATION_JS =
    "2026-10-21-suppression-menage-v79";

async function verifierNouvelleVersionAppJs() {

    try {

        const url =
            new URL(
                "./app.js",
                window.location.href
            );

        url.searchParams.set(
            "_verification_version",
            Date.now()
        );

        const reponse =
            await fetch(
                url.toString(),
                {
                    cache: "no-store",
                    headers: {
                        "Cache-Control": "no-cache"
                    }
                }
            );

        if (!reponse.ok) {
            return false;
        }

        const texte =
            await reponse.text();

        const correspondance =
            texte.match(
                /const\s+VERSION_APPLICATION_JS\s*=\s*[\r\n\s]*["']([^"']+)["']/
            );

        if (!correspondance) {
            return false;
        }

        const versionEnLigne =
            correspondance[1];

        return (
            versionEnLigne &&
            versionEnLigne !==
                VERSION_APPLICATION_JS
        );

    } catch (erreur) {

        console.warn(
            "Vérification directe app.js impossible :",
            erreur
        );

        return false;
    }
}


function initialiserStyleMiseAJourApplication() {

    if (
        document.getElementById(
            "style-mise-a-jour-application"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );

    style.id =
        "style-mise-a-jour-application";

    style.textContent = `
        .bandeau-mise-a-jour {
            position: fixed;
            left: 14px;
            right: 14px;
            bottom:
                calc(
                    96px +
                    env(safe-area-inset-bottom, 0px)
                );
            z-index: 200000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            max-width: 620px;
            margin: 0 auto;
            padding: 13px 14px;
            box-sizing: border-box;
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 14px;
            background: rgba(255,255,255,.97);
            box-shadow:
                0 10px 30px rgba(0,0,0,.16);
            color: #202124;
        }

        .bandeau-mise-a-jour strong {
            display: block;
            font-size: 14px;
            line-height: 1.3;
        }

        .bandeau-mise-a-jour small {
            display: block;
            margin-top: 3px;
            opacity: .65;
            line-height: 1.3;
        }

        .bandeau-mise-a-jour button {
            flex: 0 0 auto;
            min-height: 40px;
            border: 0;
            border-radius: 10px;
            padding: 8px 12px;
            background: #1687ff;
            color: #fff;
            font: inherit;
            font-weight: 800;
            cursor: pointer;
            touch-action: manipulation;
        }

        .bandeau-mise-a-jour button:disabled {
            opacity: .65;
        }

        .profil-mise-a-jour-texte {
            display: block;
            margin-top: 8px;
            color: #6b7077;
            font-size: 13px;
            line-height: 1.35;
        }
    `;


    document.head.appendChild(
        style
    );

}


function afficherBandeauMiseAJourApplication() {

    initialiserStyleMiseAJourApplication();


    if (
        document.getElementById(
            "bandeau-mise-a-jour-application"
        )
    ) {
        return;
    }


    const bandeau =
        document.createElement(
            "div"
        );

    bandeau.id =
        "bandeau-mise-a-jour-application";

    bandeau.className =
        "bandeau-mise-a-jour";

    bandeau.innerHTML = `

        <div>
            <strong>
                Une nouvelle version est disponible
            </strong>

            <small>
                La mise à jour ne supprime pas tes données.
            </small>
        </div>

        <button
            id="btn-bandeau-mise-a-jour"
            type="button"
        >
            Mettre à jour
        </button>

    `;


    bandeau
        .querySelector(
            "#btn-bandeau-mise-a-jour"
        )
        ?.addEventListener(
            "click",
            function () {
                void appliquerMiseAJourApplication();
            }
        );


    document.body.appendChild(
        bandeau
    );

}


function signalerMiseAJourApplicationDisponible() {

    miseAJourApplicationDisponible =
        true;

    afficherBandeauMiseAJourApplication();

    mettreAJourEtatBoutonMiseAJourProfil(
        "Nouvelle version disponible."
    );

}


function surveillerInscriptionServiceWorker(
    inscription
) {

    if (!inscription) {
        return;
    }


    if (inscription.waiting) {
        signalerMiseAJourApplicationDisponible();
    }


    inscription.addEventListener(
        "updatefound",
        function () {

            const nouveauWorker =
                inscription.installing;


            if (!nouveauWorker) {
                return;
            }


            nouveauWorker.addEventListener(
                "statechange",
                function () {

                    if (
                        nouveauWorker.state ===
                        "installed" &&
                        navigator.serviceWorker.controller
                    ) {

                        signalerMiseAJourApplicationDisponible();

                    }

                }
            );

        }
    );

}


async function obtenirInscriptionServiceWorkerApplication() {

    if (
        !(
            "serviceWorker" in navigator
        )
    ) {
        return null;
    }


    if (
        inscriptionServiceWorkerApplication
    ) {
        return inscriptionServiceWorkerApplication;
    }


    try {

        inscriptionServiceWorkerApplication =
            await navigator.serviceWorker.register(
                "./service-worker.js",
                {
                    updateViaCache:
                        "none"
                }
            );


        surveillerInscriptionServiceWorker(
            inscriptionServiceWorkerApplication
        );


        return inscriptionServiceWorkerApplication;

    } catch (erreur) {

        console.warn(
            "Service Worker indisponible :",
            erreur
        );

        return null;

    }

}


async function verifierMiseAJourApplication(
    silencieux = true,
    forcer = false
) {

    if (!navigator.onLine) {
        if (!silencieux) {
            alert(
                "Une connexion Internet est nécessaire pour rechercher une mise à jour."
            );
        }
        return false;
    }

    if (
        verificationMiseAJourEnCours &&
        !forcer
    ) {
        return miseAJourApplicationDisponible;
    }

    const maintenant = Date.now();

    /*
     * Pour les vérifications automatiques, on évite de relancer
     * plusieurs contrôles à quelques secondes d'intervalle.
     * Le bouton du profil utilise forcer=true et ignore ce délai.
     */
    if (
        !forcer &&
        maintenant - derniereVerificationMiseAJour < 15000
    ) {
        return miseAJourApplicationDisponible;
    }

    verificationMiseAJourEnCours = true;
    derniereVerificationMiseAJour = maintenant;

    try {

        /*
         * Contrôle direct de app.js sur le réseau.
         * Contrairement au Service Worker, ceci détecte aussi une mise à jour
         * lorsque seul app.js a changé sur GitHub.
         */
        const nouvelleVersionAppJs =
            await verifierNouvelleVersionAppJs();

        if (nouvelleVersionAppJs) {
            signalerMiseAJourApplicationDisponible();
            return true;
        }

        const inscription =
            await obtenirInscriptionServiceWorkerApplication();

        if (!inscription) {
            if (!silencieux) {
                alert(
                    "La recherche de mise à jour n'est pas disponible sur cet appareil."
                );
            }
            return false;
        }

        if (inscription.waiting) {
            signalerMiseAJourApplicationDisponible();
            return true;
        }

        /*
         * registration.update() demande explicitement au navigateur
         * de recontrôler service-worker.js sur le réseau.
         */
        try {
            await inscription.update();
        } catch (erreur) {
            console.warn(
                "Recherche de mise à jour impossible :",
                erreur
            );

            if (!silencieux) {
                alert(
                    "Impossible de rechercher une mise à jour pour le moment."
                );
            }
            return false;
        }

        /*
         * Sur iPhone, l'installation peut prendre plusieurs secondes.
         * On attend jusqu'à 20 secondes et on surveille directement
         * l'état du nouveau Service Worker.
         */
        const trouvee = await new Promise(
            function (resolve) {

                let termine = false;

                function finir(valeur) {
                    if (termine) {
                        return;
                    }
                    termine = true;
                    clearInterval(intervalle);
                    clearTimeout(timeout);
                    resolve(valeur);
                }

                function verifierEtat() {

                    if (inscription.waiting) {
                        signalerMiseAJourApplicationDisponible();
                        finir(true);
                        return;
                    }

                    if (
                        inscription.installing &&
                        inscription.installing.state === "installed"
                    ) {
                        signalerMiseAJourApplicationDisponible();
                        finir(true);
                    }

                }

                const intervalle =
                    setInterval(
                        verifierEtat,
                        250
                    );

                const timeout =
                    setTimeout(
                        function () {
                            finir(false);
                        },
                        20000
                    );

                verifierEtat();
            }
        );

        if (trouvee) {
            return true;
        }

        /*
         * Deuxième contrôle forcé pour les PWA iPhone qui peuvent
         * retarder le premier contrôle après une reprise en avant-plan.
         */
        if (forcer) {
            try {
                await inscription.update();

                await new Promise(
                    function (resolve) {
                        setTimeout(resolve, 1500);
                    }
                );

                if (inscription.waiting) {
                    signalerMiseAJourApplicationDisponible();
                    return true;
                }
            } catch (erreur) {
                console.warn(
                    "Deuxième contrôle de mise à jour impossible :",
                    erreur
                );
            }
        }

        if (!silencieux) {
            mettreAJourEtatBoutonMiseAJourProfil(
                "L'application est déjà à jour."
            );

            alert(
                "L'application est déjà à jour."
            );
        }

        return false;

    } finally {

        verificationMiseAJourEnCours = false;

    }

}


async function appliquerMiseAJourApplication() {

    if (activationMiseAJourEnCours) {
        return;
    }


    activationMiseAJourEnCours =
        true;


    const boutonBandeau =
        document.getElementById(
            "btn-bandeau-mise-a-jour"
        );

    const boutonProfil =
        document.getElementById(
            "btn-mise-a-jour-profil"
        );


    if (boutonBandeau) {
        boutonBandeau.disabled = true;
        boutonBandeau.textContent =
            "Mise à jour…";
    }


    if (boutonProfil) {
        boutonProfil.disabled = true;
        boutonProfil.textContent =
            "Mise à jour…";
    }


    try {

        /*
         * Si seul app.js a changé, il n'y a pas forcément de nouveau
         * Service Worker en attente. On vide alors les caches de l'application
         * et on recharge immédiatement la version publiée sur GitHub.
         */
        const nouvelleVersionAppJs =
            await verifierNouvelleVersionAppJs();

        if (nouvelleVersionAppJs) {

            if ("caches" in window) {
                const nomsCaches =
                    await caches.keys();

                await Promise.all(
                    nomsCaches
                        .filter(function (nom) {
                            return nom.startsWith(
                                "inventaire-caserne-"
                            );
                        })
                        .map(function (nom) {
                            return caches.delete(nom);
                        })
                );
            }

            const url =
                new URL(
                    window.location.href
                );

            url.searchParams.set(
                "_maj",
                Date.now()
            );

            window.location.replace(
                url.toString()
            );

            return;
        }

        const inscription =
            await obtenirInscriptionServiceWorkerApplication();


        if (!inscription) {
            throw new Error(
                "Service Worker indisponible."
            );
        }


        if (!inscription.waiting) {

            const trouvee =
                await verifierMiseAJourApplication(
                    false
                );


            if (!trouvee) {
                return;
            }

        }


        const worker =
            inscription.waiting;


        if (!worker) {
            throw new Error(
                "La nouvelle version n'est pas encore prête."
            );
        }


        rechargementApresMiseAJourEnCours =
            true;


        worker.postMessage({
            type:
                "SKIP_WAITING"
        });


        /*
         * Le rechargement se fera automatiquement
         * dès que le nouveau Service Worker prendra le contrôle.
         */
        setTimeout(
            function () {

                if (
                    rechargementApresMiseAJourEnCours
                ) {
                    const url =
                        new URL(
                            window.location.href
                        );

                    url.searchParams.set(
                        "_maj",
                        Date.now()
                    );

                    window.location.replace(
                        url.toString()
                    );
                }

            },
            4000
        );

    } catch (erreur) {

        console.error(
            "Mise à jour application :",
            erreur
        );

        alert(
            "Impossible d'installer la mise à jour pour le moment."
        );

    } finally {

        activationMiseAJourEnCours =
            false;


        if (boutonBandeau) {
            boutonBandeau.disabled = false;
            boutonBandeau.textContent =
                "Mettre à jour";
        }


        if (boutonProfil) {
            boutonProfil.disabled = false;
            boutonProfil.textContent =
                "Mettre à jour l'application";
        }

    }

}


async function rechercherMiseAJourDepuisProfil() {

    const bouton =
        document.getElementById(
            "btn-mise-a-jour-profil"
        );


    if (bouton) {
        bouton.disabled = true;
        bouton.textContent =
            "Recherche…";
    }


    mettreAJourEtatBoutonMiseAJourProfil(
        "Recherche d'une nouvelle version…"
    );


    try {

        const disponible =
            await verifierMiseAJourApplication(
                true,
                true
            );


        if (disponible) {

            mettreAJourEtatBoutonMiseAJourProfil(
                "Nouvelle version disponible."
            );


            await appliquerMiseAJourApplication();

        } else {

            mettreAJourEtatBoutonMiseAJourProfil(
                "L'application est déjà à jour."
            );


            alert(
                "L'application est déjà à jour."
            );

        }

    } catch (erreur) {

        console.error(
            "Recherche mise à jour depuis le profil :",
            erreur
        );


        mettreAJourEtatBoutonMiseAJourProfil(
            "Recherche impossible pour le moment."
        );


        alert(
            "Impossible de rechercher une mise à jour pour le moment."
        );

    } finally {

        if (
            bouton &&
            !activationMiseAJourEnCours
        ) {
            bouton.disabled = false;
            bouton.textContent =
                "Mettre à jour l'application";
        }

    }

}


function mettreAJourEtatBoutonMiseAJourProfil(
    texte
) {

    const element =
        document.getElementById(
            "etat-mise-a-jour-profil"
        );


    if (element) {
        element.textContent =
            texte;
    }

}


async function initialiserSystemeMiseAJourApplication() {

    initialiserStyleMiseAJourApplication();

    /*
     * IMPORTANT : la vérification directe de app.js fonctionne même
     * si le Service Worker n'est pas disponible ou rencontre un problème.
     * C'est ce qui permet d'afficher le bouton de mise à jour après une
     * simple modification de app.js sur GitHub.
     */
    async function verifierMaintenant() {

        if (
            document.visibilityState !== "visible" ||
            !navigator.onLine
        ) {
            return;
        }

        await verifierMiseAJourApplication(
            true,
            false
        );
    }

    /* Premier contrôle rapidement après l'ouverture. */
    setTimeout(
        function () {
            void verifierMaintenant();
        },
        1200
    );

    /* Puis nouveau contrôle quelques secondes plus tard, utile sur iPhone. */
    setTimeout(
        function () {
            void verifierMaintenant();
        },
        8000
    );

    document.addEventListener(
        "visibilitychange",
        function () {
            if (document.visibilityState === "visible") {
                void verifierMaintenant();
            }
        }
    );

    window.addEventListener(
        "pageshow",
        function () {
            void verifierMaintenant();
        }
    );

    window.addEventListener(
        "focus",
        function () {
            void verifierMaintenant();
        }
    );

    window.addEventListener(
        "online",
        function () {
            void verifierMaintenant();
        }
    );

    if (minuteurVerificationMiseAJour) {
        clearInterval(
            minuteurVerificationMiseAJour
        );
    }

    /*
     * Une vérification toutes les 5 minutes suffit. Les contrôles au retour
     * dans l'application (focus/pageshow/visibilitychange) restent immédiats.
     * Cela évite du travail réseau permanent sur les téléphones anciens.
     */
    minuteurVerificationMiseAJour =
        setInterval(
            function () {
                if (document.visibilityState === "visible") {
                    void verifierMaintenant();
                }
            },
            300000
        );

    /*
     * Le Service Worker reste un deuxième moyen de détecter une mise à jour,
     * mais son absence ne bloque plus la vérification directe de app.js.
     */
    if (!("serviceWorker" in navigator)) {
        return;
    }

    navigator.serviceWorker.addEventListener(
        "controllerchange",
        function () {

            if (rechargementApresMiseAJourEnCours) {

                rechargementApresMiseAJourEnCours = false;

                const url =
                    new URL(
                        window.location.href
                    );

                url.searchParams.set(
                    "_maj",
                    Date.now()
                );

                window.location.replace(
                    url.toString()
                );
            }

        }
    );

    const inscription =
        await obtenirInscriptionServiceWorkerApplication();

    if (inscription) {
        surveillerInscriptionServiceWorker(
            inscription
        );
    }

}



/* =========================================================
   AUTHENTIFICATION ET RÔLES
   ========================================================= */

function normaliserIdentifiantConnexion(
    valeur
) {

    return String(
        valeur || ""
    )
        .trim()
        .toUpperCase()
        .replace(
            /[^A-Z0-9_-]/g,
            ""
        );

}


function preparerMotDePasseSupabase(motDePasse) {

    const valeur = String(motDePasse ?? "");

    /*
     * Supabase Auth impose 6 caractères minimum.
     * L'utilisateur peut cependant choisir un code plus court.
     * Les codes de 6 caractères ou plus restent inchangés,
     * afin de préserver tous les comptes existants.
     */
    if (valeur.length >= 6) {
        return valeur;
    }

    return valeur + "|CIS|" + valeur.length;

}


function traduireErreurAuthentification(message) {

    const texte = String(message || "").trim();

    if (/password should be at least\s+\d+\s+characters?/i.test(texte)) {
        return "Le code choisi n'a pas pu être accepté.";
    }

    if (/invalid login credentials/i.test(texte)) {
        return "Identifiant ou code incorrect.";
    }

    if (/user already registered/i.test(texte)) {
        return "Cet utilisateur existe déjà.";
    }

    if (/email not confirmed/i.test(texte)) {
        return "Le compte n'est pas encore activé.";
    }

    if (/new password should be different from the old password/i.test(texte) ||
        /same password/i.test(texte)) {
        return "Le nouveau code doit être différent de l'ancien.";
    }

    if (/rate limit/i.test(texte) || /too many requests/i.test(texte)) {
        return "Trop de tentatives. Réessayez dans quelques instants.";
    }

    if (/edge function returned a non-2xx status code/i.test(texte)) {
        return "L'opération n'a pas pu être effectuée.";
    }

    return texte;
}


function construireEmailTechnique(
    identifiant
) {

    return (
        normaliserIdentifiantConnexion(
            identifiant
        ).toLowerCase() +
        "@" +
        DOMAINE_EMAIL_INTERNE
    );

}


function sauvegarderProfilUtilisateurCache() {

    try {

        if (!profilUtilisateurConnecte) {
            localStorage.removeItem(
                CLE_PROFIL_UTILISATEUR_CACHE
            );
            return;
        }

        localStorage.setItem(
            CLE_PROFIL_UTILISATEUR_CACHE,
            JSON.stringify(
                profilUtilisateurConnecte
            )
        );

    } catch (erreur) {

        console.warn(
            "Impossible de sauvegarder le profil utilisateur :",
            erreur
        );

    }

}


function chargerProfilUtilisateurCache() {

    try {

        const texte =
            localStorage.getItem(
                CLE_PROFIL_UTILISATEUR_CACHE
            );

        if (!texte) {
            return null;
        }

        const profil =
            JSON.parse(texte);

        if (
            !profil ||
            profil.actif !== true ||
            !profil.roles
        ) {
            return null;
        }

        return profil;

    } catch (erreur) {

        console.warn(
            "Profil utilisateur en cache illisible :",
            erreur
        );

        return null;

    }

}


function obtenirRoleUtilisateur() {

    if (!profilUtilisateurConnecte) {
        return null;
    }

    const roles =
        profilUtilisateurConnecte.roles;

    return Array.isArray(roles)
        ? roles[0] || null
        : roles || null;

}


function utilisateurEstSPVAdmin() {

    const role =
        obtenirRoleUtilisateur();

    return Boolean(
        profilUtilisateurConnecte &&
        profilUtilisateurConnecte.actif === true &&
        role &&
        String(role.nom || "")
            .trim()
            .toUpperCase() ===
            "SPV ADMIN"
    );

}


function verifierAccesAdministrateurAppli() {

    if (
        utilisateurEstSPVAdmin()
    ) {
        return true;
    }

    alert(
        "Accès réservé au rôle SPV ADMIN."
    );

    afficherAccueil();

    return false;

}


function utilisateurAPermission(
    permission
) {
    const role = obtenirRoleUtilisateur();
    const personnelles = profilUtilisateurConnecte?.permissions_personnalisees;
    if (!profilUtilisateurConnecte || profilUtilisateurConnecte.actif !== true) return false;
    if (personnelles && typeof personnelles === "object" && typeof personnelles[permission] === "boolean") {
        return personnelles[permission] === true;
    }
    return Boolean(role && role[permission] === true);
}


function verifierPermissionOuRetourAccueil(
    permission,
    message
) {

    if (
        utilisateurAPermission(
            permission
        )
    ) {
        return true;
    }

    alert(
        message ||
        "⛔ Tu n'as pas accès à cette rubrique."
    );

    afficherAccueil();

    return false;

}


async function chargerProfilUtilisateurDepuisSupabase(
    utilisateur
) {

    const generation = generationSessionPrincipale;
    if (sessionPrincipaleInvalidee && !connexionApplicationEnCours) throw new Error("Session fermée.");
    const supabase =
        obtenirClientSupabase();

    if (
        !supabase ||
        !utilisateur?.id
    ) {
        throw new Error(
            "Supabase indisponible."
        );
    }

    const {
        data,
        error
    } =
        await supabase
            .from(
                "profils_utilisateurs"
            )
            .select(`
                id,
                identifiant,
                nom,
                prenom,
                actif,
                role_id,
                permissions_personnalisees,
                roles (
                    id,
                    nom,
                    acces_inventaire,
                    acces_retour_intervention,
                    acces_historique,
                    acces_archives,
                    acces_administration,
                    acces_ajout_materiel,
                    acces_gestion_materiel,
                    acces_gestion_categories,
                    acces_reapprovisionnement,
                    acces_remise_zero_historique,
                    acces_gestion_utilisateurs,
                    acces_notifications,
                    acces_espace_caserne,
                    acces_sport,
                    acces_sport_admin,
                    acces_manoeuvre,
                    acces_manoeuvre_admin,
                    acces_casernement,
                    acces_casernement_admin,
                    acces_reunion,
                    acces_reunion_admin,
                    acces_amical_public,
                    acces_amical_membre,
                    acces_amical_admin,
                    acces_comite_centre,
                    acces_comite_centre_admin,
                    acces_administratif,
                    acces_administratif_admin,
                    acces_entretien_individuel,
                    acces_entretien_individuel_admin,
                    acces_admin_menage,
                    acces_admin_travail_equipe,
                    acces_admin_heures,
                    acces_envoi_mail
                )
            `)
            .eq(
                "id",
                utilisateur.id
            )
            .single();

    if (error) {
        throw error;
    }

    if (
        !data ||
        data.actif !== true
    ) {
        fermerSessionPrincipaleInvalide();
        throw new Error("Ce compte est désactivé.");
    }

    if (generation !== generationSessionPrincipale) throw new Error("Session fermée pendant le chargement.");
    sessionPrincipaleInvalidee = false;
    utilisateurConnecte =
        utilisateur;

    profilUtilisateurConnecte =
        data;

    sauvegarderProfilUtilisateurCache();
    setTimeout(() => synchroniserAbonnementPushUtilisateurConnecte(), 0);

    return data;

}


async function initialiserAuthentificationApplication() {

    const profilCache =
        chargerProfilUtilisateurCache();


    if (!navigator.onLine) {

        if (!sessionPrincipaleInvalidee && profilCache) {

            profilUtilisateurConnecte =
                profilCache;

            utilisateurConnecte = {
                id:
                    profilCache.id
            };

            return true;

        }

        return false;

    }


    const supabase =
        await assurerBibliothequeSupabaseDisponible();

    if (!supabase) {

        if (!sessionPrincipaleInvalidee && profilCache) {

            profilUtilisateurConnecte =
                profilCache;

            utilisateurConnecte = {
                id:
                    profilCache.id
            };

            return true;

        }

        return false;

    }


    try {

        const session = await obtenirSessionPrincipaleValide(supabase);

        await chargerProfilUtilisateurDepuisSupabase(
            session.user
        );


        return true;

    } catch (erreur) {

        console.warn(
            "Session utilisateur non disponible :",
            erreur
        );
        signalerConnexionPrincipaleIndisponible(erreur);
        if (sessionPrincipaleInvalidee || erreur?.reconnexionNecessaire === true) return false;


        if (!sessionPrincipaleInvalidee && profilCache) {

            profilUtilisateurConnecte =
                profilCache;

            utilisateurConnecte = {
                id:
                    profilCache.id
            };

            return true;

        }


        return false;

    }

}


function appliquerVisibiliteElementsConnectes(
    connecte
) {

    const synchronisation =
        document.getElementById(
            "indicateur-synchronisation"
        );

    if (synchronisation) {
        synchronisation.style.display =
            connecte
                ? ""
                : "none";
    }


    const notifications =
        document.getElementById(
            "btn-notifications-push"
        );

    if (notifications) {
        notifications.style.display =
            connecte
                ? ""
                : "none";
    }

}


function initialiserStyleConnexion() {

    if (
        document.getElementById(
            "style-auth-utilisateurs"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );

    style.id =
        "style-auth-utilisateurs";

    style.textContent = `
        html,
        body {
            min-height: 100%;
        }

        html {
            min-height: 100%;
            background: #ffffff;
        }

        body.mode-connexion {
            min-height: 100vh;
            min-height: 100dvh;
            margin: 0;
            background-color: #ffffff;
            background-image:
                url("./fond-connexion.png");
            background-position:
                center center;
            background-size:
                cover;
            background-repeat:
                no-repeat;
            background-attachment:
                scroll;
        }

        body.mode-connexion #app {
            min-height: 100vh;
            min-height: 100dvh;
            background: transparent;
        }

        @media (min-width: 1000px) {
            body.mode-connexion {
                background-image:
                    url("./fond-connexion-pc.png");
                background-position:
                    center center;
                background-size:
                    cover;
                background-repeat:
                    no-repeat;
            }
        }

        .connexion-page {
            min-height: 100vh;
            min-height: 100dvh;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            padding:
                calc(24px + env(safe-area-inset-top, 0px))
                22px
                calc(24px + env(safe-area-inset-bottom, 0px));
            background: transparent;
        }

        .connexion-carte {
            width: min(100%, 370px);
            box-sizing: border-box;
            padding: 22px 20px 22px;
            border-radius: 22px;
            background: rgba(255,255,255,.76);
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
            box-shadow:
                0 16px 38px rgba(0,0,0,.12);
            border:
                1px solid rgba(255,255,255,.82);
        }

        .connexion-titre {
            text-align: center;
            margin-bottom: 18px;
        }

        .connexion-titre h1 {
            margin: 0;
            font-size: 18px;
            line-height: 1.2;
            font-weight: 800;
        }

        .connexion-titre p {
            display: none;
        }

        .connexion-carte label {
            display: block;
            margin: 13px 0 7px;
            font-weight: 750;
            font-size: 14px;
        }

        .connexion-carte input,
        .profil-page input,
        .gestion-utilisateurs-page input,
        .gestion-utilisateurs-page select {
            width: 100%;
            box-sizing: border-box;
            min-height: 50px;
            border: 1px solid #d9dde3;
            border-radius: 13px;
            padding: 11px 13px;
            font: inherit;
            background: rgba(255,255,255,.94);
            outline: none;
        }

        .connexion-carte input:focus,
        .profil-page input:focus {
            border-color: #d92121;
            box-shadow:
                0 0 0 3px rgba(217,33,33,.10);
        }

        .connexion-bouton {
            width: 100%;
            min-height: 50px;
            margin-top: 20px;
            border: 0;
            border-radius: 13px;
            background: #d91f1f;
            color: #fff;
            font: inherit;
            font-weight: 800;
            cursor: pointer;
            box-shadow:
                0 7px 18px rgba(217,31,31,.22);
        }

        .connexion-bouton:disabled {
            opacity: .65;
            cursor: default;
        }

        .connexion-erreur {
            display: none;
            margin-top: 14px;
            padding: 11px 12px;
            border-radius: 12px;
            background: rgba(255,227,227,.95);
            color: #8a1111;
            font-weight: 700;
            font-size: 14px;
        }

        .utilisateur-entete {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            margin-bottom: 18px;
        }

        .bouton-profil-accueil {
            appearance: none;
            -webkit-appearance: none;
            display: inline-flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            width: auto;
            max-width: 78%;
            border: 1px solid rgba(0,0,0,.08);
            border-radius: 13px;
            background: rgba(255,255,255,.92);
            box-shadow:
                0 3px 10px rgba(0,0,0,.06);
            margin: 0;
            padding: 9px 12px;
            text-align: left;
            cursor: pointer;
            color: inherit;
            font: inherit;
            -webkit-tap-highlight-color: transparent;
        }

        .bouton-profil-accueil:active {
            transform: scale(.985);
            background: #f3f4f6;
        }

        .bouton-profil-accueil strong {
            display: block;
            width: 100%;
            font-size: 16px;
            line-height: 1.2;
            white-space: nowrap;
        }

        .bouton-profil-accueil span {
            display: block;
            width: 100%;
            margin-top: 4px;
            font-size: 12px;
            line-height: 1.2;
            opacity: .62;
            font-weight: 750;
            letter-spacing: .02em;
            white-space: nowrap;
        }

        .retour-button {
            appearance: none;
            -webkit-appearance: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: fit-content;
            min-height: 40px;
            padding: 8px 13px;
            border: 1px solid rgba(0,0,0,.09);
            border-radius: 12px;
            background: #ffffff;
            box-shadow:
                0 3px 10px rgba(0,0,0,.06);
            color: #202124;
            font: inherit;
            font-weight: 750;
            cursor: pointer;
            text-decoration: none;
        }

        .retour-button:active {
            transform: scale(.985);
            background: #f2f3f5;
        }

        .profil-page {
            min-height: 100vh;
            min-height: 100dvh;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }

        .profil-entete {
            margin: 12px 0 22px;
        }

        .profil-entete h2 {
            margin: 0;
        }

        .profil-entete .profil-role {
            margin-top: 5px;
            opacity: .65;
            font-weight: 700;
        }

        .profil-carte {
            background: #fff;
            border-radius: 18px;
            padding: 18px;
            margin-bottom: 16px;
            box-shadow:
                0 5px 18px rgba(0,0,0,.07);
        }

        .profil-identite {
            display: grid;
            gap: 12px;
        }

        .profil-identite-ligne small {
            display: block;
            margin-bottom: 3px;
            opacity: .58;
            font-weight: 700;
        }

        .profil-identite-ligne strong {
            font-size: 18px;
        }

        .profil-carte h3 {
            margin: 0 0 14px;
        }

        .profil-carte label {
            display: block;
            margin: 11px 0 6px;
            font-weight: 700;
            font-size: 14px;
        }

        .profil-notification-ligne {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
        }

        .profil-notification-texte strong {
            display: block;
        }

        .profil-notification-texte small {
            display: block;
            margin-top: 4px;
            opacity: .62;
            line-height: 1.3;
        }

        .switch-notifications {
            position: relative;
            display: inline-block;
            width: 54px;
            height: 31px;
            flex: 0 0 auto;
        }

        .switch-notifications input {
            width: 1px;
            height: 1px;
            opacity: 0;
            position: absolute;
        }

        .switch-notifications span {
            position: absolute;
            inset: 0;
            background: #c7cbd1;
            border-radius: 999px;
            transition: .2s ease;
            cursor: pointer;
        }

        .switch-notifications span::before {
            content: "";
            position: absolute;
            width: 25px;
            height: 25px;
            left: 3px;
            top: 3px;
            border-radius: 50%;
            background: #fff;
            box-shadow:
                0 2px 5px rgba(0,0,0,.2);
            transition: .2s ease;
        }

        .switch-notifications input:checked + span {
            background: #25a244;
        }

        .switch-notifications input:checked + span::before {
            transform: translateX(23px);
        }

        .profil-bouton-principal,
        .profil-bouton-deconnexion {
            width: 100%;
            min-height: 48px;
            border: 0;
            border-radius: 13px;
            font: inherit;
            font-weight: 800;
            cursor: pointer;
        }

        .profil-bouton-principal {
            margin-top: 16px;
            background: #17191c;
            color: #fff;
        }

        .profil-bouton-deconnexion {
            margin-top: 2px;
            background: #f1f2f4;
            color: #b31212;
        }

        .profil-applications-liens {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
        }
        #app .profil-application-lien {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 18px;
            width: 100%;
            min-width: 0;
            min-height: 100px;
            box-sizing: border-box;
            padding: 18px;
            border: 1px solid #dce2e8;
            border-radius: 13px;
            background: #f4f6f8;
            color: #087be5;
            font: inherit;
            text-align: left;
            text-decoration: none;
        }
        #app .profil-application-lien img {
            width: 58px;
            height: 58px;
            flex: 0 0 58px;
            object-fit: contain;
            border-radius: 12px;
        }
        #app .profil-application-nom {
            display: block;
            min-width: 0;
            font-size: clamp(22px, 6vw, 28px);
            font-weight: 800;
            line-height: 1.2;
        }
        #app .profil-application-pilotage {
            background: #101827;
            border-color: #2b3b54;
            color: #eff3fa;
        }
        #app .profil-application-pilotage .profil-application-nom { letter-spacing: 1px; }
        #app .profil-application-point { color: #53dbca; }
        #app .profil-application-sous-titre {
            display: block;
            margin-top: 7px;
            color: #a5b2c7;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 2.5px;
            line-height: 1.5;
        }
        #app .profil-application-lien:hover { background: #e9f2fc; }
        #app .profil-application-pilotage:hover { background: #1b293c; }
        #app .profil-application-lien:focus-visible { outline: 3px solid #1687ff; outline-offset: 3px; }
        @media (min-width: 1000px) {
            body:not(.mode-connexion) #app .profil-application-lien {
                background: #202c36;
                border-color: #3a4854;
                color: #75b9ff;
            }
            body:not(.mode-connexion) #app .profil-application-pilotage { background: #101827; color: #eff3fa; }
            body:not(.mode-connexion) #app .profil-application-lien:hover { background: #2c3d4b; }
        }

        .profil-version {
            margin-top: auto;
            padding:
                22px 0
                calc(10px + env(safe-area-inset-bottom, 0px));
            text-align: center;
            opacity: .42;
            font-size: 12px;
            font-weight: 700;
        }

        .gestion-utilisateurs-page .bloc-admin {
            background: #fff;
            border-radius: 18px;
            padding: 18px;
            margin: 16px 0;
            box-shadow:
                0 5px 18px rgba(0,0,0,.08);
        }

        .gestion-utilisateurs-page .grille-formulaire {
            display: grid;
            gap: 10px;
        }

        .gestion-utilisateurs-page .carte-utilisateur,
        .gestion-utilisateurs-page .carte-role {
            border: 1px solid #e0e3e7;
            border-radius: 14px;
            padding: 14px;
            margin-top: 12px;
        }

        .gestion-utilisateurs-page .ligne-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .gestion-utilisateurs-page .petit-bouton {
            border: 0;
            border-radius: 10px;
            padding: 9px 11px;
            font-weight: 700;
            cursor: pointer;
            background: #e9edf2;
        }

        .gestion-utilisateurs-page .permissions-role {
            display: grid;
            gap: 7px;
            margin-top: 10px;
        }

        .gestion-utilisateurs-page .permissions-role label {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gestion-utilisateurs-page .permissions-role input {
            width: auto;
            min-height: 0;
        }

        .badge-role {
            display: inline-block;
            margin-top: 4px;
            padding: 4px 8px;
            border-radius: 999px;
            background: #e8f3ff;
            font-size: 12px;
            font-weight: 800;
        }

        .permissions-utilisateur-details { margin-top:14px; padding-top:12px; border-top:1px solid #e0e3e7; }
        .permissions-utilisateur-details summary { cursor:pointer; font-weight:850; color:#b51f2a; }
        .permissions-utilisateur { display:grid; gap:7px; margin-top:10px; }
        .permission-utilisateur-rouge { display:flex!important; align-items:center; gap:8px; min-height:38px; padding:8px 10px; box-sizing:border-box; border:1px solid #d65b63; border-radius:9px; background:#fff4f4; color:#8f1e27!important; font-size:13px; font-weight:750; }
        .permission-utilisateur-rouge input[type="checkbox"] { width:18px!important; height:18px!important; min-height:0!important; accent-color:#c62828!important; }
        .bouton-permissions-utilisateur { margin-top:10px; background:#b3262e!important; color:#fff!important; }
    `;

    document.head.appendChild(
        style
    );

}

function afficherConnexion() {

    initialiserStyleConnexion();

    document.body.classList.add(
        "mode-connexion"
    );

    appliquerVisibiliteElementsConnectes(
        false
    );


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="connexion-page">

            <section class="connexion-carte">

                <div class="connexion-titre">

                    <h1>
                        Connexion
                    </h1>

                </div>


                <label for="connexion-identifiant">
                    Identifiant
                </label>

                <input
                    id="connexion-identifiant"
                    type="text"
                    autocomplete="username"
                    autocapitalize="characters"
                    placeholder="Identifiant"
                >


                <label for="connexion-mot-de-passe">
                    Mot de passe
                </label>

                <input
                    id="connexion-mot-de-passe"
                    type="password"
                    autocomplete="current-password"
                    placeholder="Mot de passe"
                >


                <button
                    class="connexion-bouton"
                    id="btn-connexion-application"
                    type="button"
                    onclick="seConnecterApplication()"
                >
                    Se connecter
                </button>


                <div
                    class="connexion-erreur"
                    id="connexion-erreur"
                ></div>

            </section>

        </main>

    `;


    const identifiant =
        document.getElementById(
            "connexion-identifiant"
        );

    const motDePasse =
        document.getElementById(
            "connexion-mot-de-passe"
        );


    function gererEntree(
        event
    ) {

        if (
            event.key ===
            "Enter"
        ) {
            void seConnecterApplication();
        }

    }


    identifiant?.addEventListener(
        "keydown",
        gererEntree
    );

    motDePasse?.addEventListener(
        "keydown",
        gererEntree
    );


    identifiant?.focus();

}

async function seConnecterApplication() {

    if (connexionApplicationEnCours) {
        return;
    }


    const champIdentifiant =
        document.getElementById(
            "connexion-identifiant"
        );

    const champMotDePasse =
        document.getElementById(
            "connexion-mot-de-passe"
        );

    const bouton =
        document.getElementById(
            "btn-connexion-application"
        );

    const erreurElement =
        document.getElementById(
            "connexion-erreur"
        );


    const identifiant =
        normaliserIdentifiantConnexion(
            champIdentifiant?.value
        );

    const motDePasse =
        String(
            champMotDePasse?.value ||
            ""
        );


    if (
        !identifiant ||
        !motDePasse
    ) {

        if (erreurElement) {
            erreurElement.textContent =
                "Identifiant et mot de passe obligatoires.";
            erreurElement.style.display =
                "block";
        }

        return;

    }


    if (!navigator.onLine) {

        if (erreurElement) {
            erreurElement.textContent =
                "Une connexion Internet est nécessaire pour une première connexion.";
            erreurElement.style.display =
                "block";
        }

        return;

    }


    connexionApplicationEnCours =
        true;


    if (bouton) {
        bouton.disabled = true;
        bouton.textContent =
            "Connexion…";
    }


    if (erreurElement) {
        erreurElement.style.display =
            "none";
    }


    try {
        if (fermetureSessionPrincipaleEnCours) await fermetureSessionPrincipaleEnCours;
        const supabase =
            await assurerBibliothequeSupabaseDisponible();


        if (!supabase) {
            throw new Error(
                "Supabase n'est pas disponible."
            );
        }


        let {
            data,
            error
        } =
            await supabase.auth
                .signInWithPassword({
                    email:
                        construireEmailTechnique(
                            identifiant
                        ),
                    password:
                        motDePasse
                });

        if (
            error &&
            String(motDePasse).length < 6
        ) {
            const secondeTentative =
                await supabase.auth
                    .signInWithPassword({
                        email:
                            construireEmailTechnique(
                                identifiant
                            ),
                        password:
                            preparerMotDePasseSupabase(
                                motDePasse
                            )
                    });

            data = secondeTentative.data;
            error = secondeTentative.error;
        }


        if (
            error ||
            !data?.user
        ) {
            throw (
                error ||
                new Error(
                    "Connexion impossible."
                )
            );
        }


        await chargerProfilUtilisateurDepuisSupabase(
            data.user
        );


        initialiserBoutonNotifications();

        appliquerVisibiliteElementsConnectes(
            true
        );

        document.body.classList.remove(
            "mode-connexion"
        );


        await initialiserSynchronisationSupabase();
        preparerRepriseHorsConnexion();


        afficherPortailPrincipal();
        window.__cisNotificationsApplicationPrete=true;
        void traiterNotificationEnAttente();

    } catch (erreur) {

        console.error(
            "Connexion impossible :",
            erreur
        );


        if (erreurElement) {

            const texte =
                String(
                    erreur?.message ||
                    ""
                );


            if (
                /invalid login credentials/i
                    .test(texte)
            ) {

                erreurElement.textContent =
                    "Identifiant ou mot de passe incorrect.";

            } else {

                erreurElement.textContent =
                    texte ||
                    "Connexion impossible.";

            }


            erreurElement.style.display =
                "block";

        }

    } finally {

        connexionApplicationEnCours =
            false;


        if (bouton) {
            bouton.disabled = false;
            bouton.textContent =
                "Se connecter";
        }

    }

}


async function deconnecterApplication() {

    if (
        !await afficherConfirmationCIS(
            "Veux-tu te déconnecter ?"
        )
    ) {
        return;
    }


    try {

        const supabase =
            obtenirClientSupabase();

        if (supabase) {
            await supabase.auth
                .signOut();
        }

    } catch (erreur) {

        console.warn(
            "Déconnexion Supabase :",
            erreur
        );

    }


    utilisateurConnecte =
        null;

    profilUtilisateurConnecte =
        null;

    localStorage.removeItem(
        CLE_PROFIL_UTILISATEUR_CACHE
    );


    afficherConnexion();

}


function obtenirNomUtilisateurAffiche() {

    if (!profilUtilisateurConnecte) {
        return "";
    }


    const prenom =
        String(
            profilUtilisateurConnecte
                .prenom || ""
        ).trim();

    const nom =
        String(
            profilUtilisateurConnecte
                .nom || ""
        ).trim();

    const identifiant =
        String(
            profilUtilisateurConnecte
                .identifiant || ""
        ).trim();


    const complet =
        [prenom, nom]
            .filter(Boolean)
            .join(" ");


    return complet ||
        identifiant;

}



async function desactiverNotificationsPushProfil() {

    if (!navigator.onLine) {
        throw new Error(
            "Une connexion Internet est nécessaire."
        );
    }


    if (!notificationsWebPushDisponibles()) {
        return;
    }


    const abonnement =
        await obtenirAbonnementPushActuel();


    if (!abonnement) {
        return;
    }


    const endpoint =
        abonnement.endpoint;


    const supabase =
        await assurerBibliothequeSupabaseDisponible();


    if (supabase && endpoint) {

        const {
            error
        } =
            await supabase
                .from(
                    "push_subscriptions"
                )
                .update({
                    actif: false,
                    updated_at:
                        new Date()
                            .toISOString()
                })
                .eq(
                    "endpoint",
                    endpoint
                );


        if (error) {
            throw error;
        }

    }


    await abonnement.unsubscribe();

}


async function obtenirEtatNotificationsProfil() {

    if (!notificationsWebPushDisponibles()) {
        return false;
    }


    if (
        Notification.permission !==
        "granted"
    ) {
        return false;
    }


    try {

        const abonnement =
            await obtenirAbonnementPushActuel();

        return Boolean(
            abonnement
        );

    } catch (erreur) {

        console.warn(
            "État notifications profil indisponible :",
            erreur
        );

        return false;

    }

}


async function afficherProfilUtilisateur() {

    if (!profilUtilisateurConnecte) {
        afficherConnexion();
        return;
    }


    initialiserStyleConnexion();


    const role =
        obtenirRoleUtilisateur();

    const nom =
        String(
            profilUtilisateurConnecte.nom || ""
        ).trim();

    const prenom =
        String(
            profilUtilisateurConnecte.prenom || ""
        ).trim();


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page profil-page">

            <button
                class="retour-button"
                type="button"
                onclick="retournerDepuisProfil()"
            >
                ← Retour
            </button>


            <div class="profil-entete">

                <h2>
                    Mon profil
                </h2>

                <div class="profil-role">
                    ${echapperHTML(
                        role?.nom || ""
                    )}
                </div>

            </div>


            <section class="profil-carte profil-identite">

                <div class="profil-identite-ligne">
                    <small>Nom</small>
                    <strong>
                        ${echapperHTML(nom)}
                    </strong>
                </div>

                <div class="profil-identite-ligne">
                    <small>Prénom</small>
                    <strong>
                        ${echapperHTML(prenom)}
                    </strong>
                </div>

            </section>


            <section class="profil-carte">
                <h3>Ma signature</h3>
                <p>Enregistre ta signature au doigt pour les fiches d’entretien VSAV.</p>
                <button type="button" class="profil-bouton-principal" onclick="ouvrirSignaturePharmacie()">✍️ Enregistrer ma signature</button>
            </section>

            <section class="profil-carte">

                <h3>
                    Changer mon mot de passe
                </h3>


                <label for="profil-ancien-mdp">
                    Ancien mot de passe
                </label>

                <input
                    id="profil-ancien-mdp"
                    type="password"
                    autocomplete="current-password"
                >


                <label for="profil-nouveau-mdp">
                    Nouveau mot de passe
                </label>

                <input
                    id="profil-nouveau-mdp"
                    type="password"
                    autocomplete="new-password"
                >


                <label for="profil-confirmation-mdp">
                    Confirmer le nouveau mot de passe
                </label>

                <input
                    id="profil-confirmation-mdp"
                    type="password"
                    autocomplete="new-password"
                >


                <button
                    class="profil-bouton-principal"
                    type="button"
                    onclick="changerMonMotDePasse()"
                >
                    Modifier le mot de passe
                </button>

            </section>


            <section class="profil-carte">

                <div class="profil-notification-ligne">

                    <div class="profil-notification-texte">

                        <strong>
                            Recevoir les notifications
                        </strong>

                        <small id="texte-etat-notifications-profil">
                            Vérification…
                        </small>

                    </div>


                    <label class="switch-notifications">

                        <input
                            id="switch-notifications-profil"
                            type="checkbox"
                            onchange="changerNotificationsProfil(this)"
                        >

                        <span></span>

                    </label>

                </div>

                <button class="profil-bouton-principal" type="button" id="profil-gerer-notifications" aria-expanded="false" aria-controls="profil-notifications-details" disabled onclick="basculerGestionProfil('notifications')">Gérer les notifications</button>
                <div id="profil-notifications-details" style="display:none; margin-top:16px; padding-top:14px; border-top:1px solid rgba(0,0,0,.08);">
                    <strong style="display:block; margin-bottom:10px;">Notifications souhaitées</strong>
                    <div id="profil-notifications-choix"></div>
                    <small style="display:block; margin-top:10px; opacity:.62; line-height:1.35;">
                        Seules les rubriques auxquelles tu as accès sont proposées.
                    </small>
                </div>

            </section>


            <section class="profil-carte">
                <h3>Raccourcis rapides</h3>
                <button class="profil-bouton-principal" type="button" id="profil-gerer-raccourcis" aria-expanded="false" aria-controls="profil-raccourcis-details" onclick="basculerGestionProfil('raccourcis')">Gérer les raccourcis</button>
                <div id="profil-raccourcis-details" style="display:none;margin-top:16px">
                <small class="profil-mise-a-jour-texte">Optionnel : choisis jusqu’à 6 raccourcis à afficher sur l’accueil général.</small>
                <div style="margin:10px 0 14px">${(()=>{const selection=new Set(lireRaccourcisAccueil());return optionsRaccourcisAccueil().map(x=>`<label style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(0,0,0,.06)"><input type="checkbox" data-raccourci-profil value="${echapperHTML(x.id)}" ${selection.has(x.id)?"checked":""} onchange="verifierRaccourcisProfil(this)" style="width:20px;height:20px"><span style="display:flex;align-items:center;gap:9px">${x.logo?`<img src="${echapperHTML(x.logo)}" alt="" style="width:32px;height:32px;border-radius:8px;object-fit:cover">`:`<span>${x.icone}</span>`}<span>${echapperHTML(x.libelle)}</span></span></label>`).join("")})()}</div>
                <button class="profil-bouton-principal" type="button" onclick="enregistrerRaccourcisProfil()">Enregistrer mes raccourcis</button>
                </div>
            </section>




            <section class="profil-carte">

                <h3>
                    Mise à jour de l'application
                </h3>

                <button
                    class="profil-bouton-principal"
                    id="btn-mise-a-jour-profil"
                    type="button"
                    onclick="rechercherMiseAJourDepuisProfil()"
                >
                    Mettre à jour l'application
                </button>

                <small
                    class="profil-mise-a-jour-texte"
                    id="etat-mise-a-jour-profil"
                >
                    Appuie ici pour rechercher une nouvelle version.
                </small>

            </section>


            <section class="profil-carte profil-autres-applications" aria-labelledby="profil-autres-applications-titre">
                <h3 id="profil-autres-applications-titre">Autres applications</h3>
                <div class="profil-applications-liens">
                    <a class="profil-application-lien" href="#application-admin-test-non-configuree" aria-disabled="true" target="_blank" rel="noopener noreferrer">
                        <img src="./profil-logo-admin.png" alt="" width="48" height="48">
                        <span class="profil-application-nom">CIS Admin</span>
                    </a>
                    <a class="profil-application-lien profil-application-pilotage" href="#application-pilotage-test-non-configuree" aria-disabled="true" target="_blank" rel="noopener noreferrer">
                        <img src="./profil-logo-pilotage.svg" alt="" width="48" height="48">
                        <span><span class="profil-application-nom">PILOTAGE<span class="profil-application-point">.</span></span><span class="profil-application-sous-titre">CIS LE CHESNE</span></span>
                    </a>
                </div>
            </section>


            <button
                class="profil-bouton-deconnexion"
                type="button"
                onclick="deconnecterApplication()"
            >
                Déconnexion
            </button>


            <div class="profil-version">
                Version ${echapperHTML(
                    VERSION_APPLICATION
                )}
            </div>

        </main>

    `;


    await rafraichirNotificationsProfil();

}


function obtenirCategoriesNotificationsProfil() {
    const categories = [
        { cle: "sport", libelle: "Sport", permission: "acces_sport" },
        { cle: "manoeuvre", libelle: "Manœuvre", permission: "acces_manoeuvre" },
        { cle: "casernement", libelle: "Casernement", permission: "acces_casernement" },
        { cle: "reunion", libelle: "Réunion", permission: "acces_reunion" },
        { cle: "amical", libelle: "Amical", permission: "acces_amical_public", permissionAlternative: "acces_amical_membre" },
        { cle: "comite_centre", libelle: "Comité de centre", permission: "acces_comite_centre" },
        { cle: "administratif", libelle: "Administratif", permission: "acces_administratif" },
        { cle: "entretien_individuel", libelle: "Entretien individuel", permission: "acces_entretien_individuel" }
    ];

    return categories.filter(function (categorie) {
        if (utilisateurEstSPVAdmin()) return true;
        return utilisateurAPermission(categorie.permission) ||
            (categorie.permissionAlternative && utilisateurAPermission(categorie.permissionAlternative));
    });
}


async function chargerPreferencesNotificationsProfil() {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) return null;

    const { data, error } = await supabase.rpc("initialiser_preferences_notifications");
    if (error) {
        console.warn("Préférences notifications :", error);
        return null;
    }

    return data || null;
}


function afficherChoixNotificationsProfil(preferences) {
    const zone = document.getElementById("profil-notifications-choix");
    if (!zone) return;

    const categories = obtenirCategoriesNotificationsProfil();

    if (!categories.length) {
        zone.innerHTML = `<small>Aucune rubrique de notification disponible pour ton compte.</small>`;
        return;
    }

    zone.innerHTML = categories.map(function (categorie) {
        const active = preferences?.[categorie.cle] !== false;
        return `
            <div class="profil-notification-ligne" style="padding:9px 0;">
                <div class="profil-notification-texte">
                    <strong>${echapperHTML(categorie.libelle)}</strong>
                </div>
                <label class="switch-notifications">
                    <input
                        type="checkbox"
                        data-notification-categorie="${echapperHTML(categorie.cle)}"
                        ${active ? "checked" : ""}
                        onchange="enregistrerPreferencesNotificationsProfil()"
                    >
                    <span></span>
                </label>
            </div>
        `;
    }).join("");
}


async function enregistrerPreferencesNotificationsProfil() {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) {
        alert("Une connexion Internet est nécessaire pour modifier les notifications.");
        return;
    }

    const valeurs = {
        sport: true,
        manoeuvre: true,
        casernement: true,
        reunion: true,
        amical: true,
        comite_centre: true,
        administratif: true,
        entretien_individuel: true
    };

    document.querySelectorAll("[data-notification-categorie]").forEach(function (caseNotification) {
        const cle = caseNotification.getAttribute("data-notification-categorie");
        if (cle && Object.prototype.hasOwnProperty.call(valeurs, cle)) {
            valeurs[cle] = caseNotification.checked === true;
        }
    });

    const { error } = await supabase.rpc("enregistrer_preferences_notifications", {
        p_sport: valeurs.sport,
        p_manoeuvre: valeurs.manoeuvre,
        p_casernement: valeurs.casernement,
        p_reunion: valeurs.reunion,
        p_amical: valeurs.amical,
        p_comite_centre: valeurs.comite_centre,
        p_administratif: valeurs.administratif,
        p_entretien_individuel: valeurs.entretien_individuel
    });

    if (error) {
        console.error("Enregistrement préférences notifications :", error);
        alert("Impossible d'enregistrer ce choix.");
    }
}


async function rafraichirNotificationsProfil() {

    const interrupteur =
        document.getElementById(
            "switch-notifications-profil"
        );

    const texte =
        document.getElementById(
            "texte-etat-notifications-profil"
        );


    if (!interrupteur) {
        return;
    }


    if (!notificationsWebPushDisponibles()) {

        interrupteur.checked =
            false;

        interrupteur.disabled =
            true;

        if (texte) {
            texte.textContent =
                "Non disponible sur cet appareil";
        }

        return;

    }


    const actif =
        await obtenirEtatNotificationsProfil();


    interrupteur.checked =
        actif;

    interrupteur.disabled =
        false;


    if (texte) {
        texte.textContent =
            actif
                ? "Activées sur cet appareil"
                : "Désactivées sur cet appareil";
    }

    const details = document.getElementById("profil-notifications-details");

    if (details) {
        details.style.display = actif && details.dataset.ouvert === "true" ? "block" : "none";
        const gestion=document.getElementById("profil-gerer-notifications");if(gestion){gestion.disabled=!actif;gestion.title=actif?"Choisir les notifications souhaitées":"Active les notifications sur cet appareil pour choisir les rubriques";gestion.setAttribute("aria-expanded",String(actif&&details.dataset.ouvert==="true"));}
    }

    if (actif) {
        const preferences = await chargerPreferencesNotificationsProfil();
        afficherChoixNotificationsProfil(preferences);
    }

}


async function changerNotificationsProfil(
    interrupteur
) {

    if (!interrupteur) {
        return;
    }


    interrupteur.disabled =
        true;


    try {

        if (interrupteur.checked) {

            await activerNotificationsPush();

        } else {

            await desactiverNotificationsPushProfil();

        }

    } catch (erreur) {

        console.error(
            "Modification notifications profil :",
            erreur
        );

        alert(
            "⚠️ Impossible de modifier les notifications pour le moment."
        );

    } finally {

        await rafraichirNotificationsProfil();

    }

}


async function changerMonMotDePasse() {

    if (!navigator.onLine) {

        alert(
            "⚠️ Une connexion Internet est nécessaire pour changer le mot de passe."
        );

        return;

    }


    const ancien =
        String(
            document.getElementById(
                "profil-ancien-mdp"
            )?.value || ""
        );

    const nouveau =
        String(
            document.getElementById(
                "profil-nouveau-mdp"
            )?.value || ""
        );

    const confirmation =
        String(
            document.getElementById(
                "profil-confirmation-mdp"
            )?.value || ""
        );


    if (
        !ancien ||
        !nouveau ||
        !confirmation
    ) {

        alert(
            "⚠️ Remplis les trois champs."
        );

        return;

    }


    if (
        nouveau !==
        confirmation
    ) {

        alert(
            "⚠️ Les deux nouveaux mots de passe ne correspondent pas."
        );

        return;

    }


    if (
        nouveau.length < 4
    ) {

        alert(
            "⚠️ Le nouveau mot de passe doit contenir au moins 4 caractères."
        );

        return;

    }


    if (
        ancien ===
        nouveau
    ) {

        alert(
            "⚠️ Le nouveau mot de passe doit être différent de l'ancien."
        );

        return;

    }


    try {

        const supabase =
            await assurerBibliothequeSupabaseDisponible();


        if (!supabase) {
            throw new Error(
                "Supabase n'est pas disponible."
            );
        }


        const identifiant =
            profilUtilisateurConnecte
                .identifiant;


        let {
            error: erreurVerification
        } =
            await supabase.auth
                .signInWithPassword({
                    email:
                        construireEmailTechnique(
                            identifiant
                        ),
                    password:
                        ancien
                });

        if (
            erreurVerification &&
            String(ancien).length < 6
        ) {
            const verificationAlternative =
                await supabase.auth
                    .signInWithPassword({
                        email:
                            construireEmailTechnique(
                                identifiant
                            ),
                        password:
                            preparerMotDePasseSupabase(
                                ancien
                            )
                    });

            erreurVerification =
                verificationAlternative.error;
        }


        if (erreurVerification) {

            alert(
                "❌ L'ancien mot de passe est incorrect."
            );

            return;

        }


        const {
            error: erreurModification
        } =
            await supabase.auth
                .updateUser({
                    password:
                        preparerMotDePasseSupabase(nouveau)
                });


        if (erreurModification) {
            throw erreurModification;
        }


        document.getElementById(
            "profil-ancien-mdp"
        ).value = "";

        document.getElementById(
            "profil-nouveau-mdp"
        ).value = "";

        document.getElementById(
            "profil-confirmation-mdp"
        ).value = "";


        alert(
            "✅ Code modifié."
        );

    } catch (erreur) {

        console.error(
            "Changement mot de passe :",
            erreur
        );

        alert(
            "⚠️ " +
            traduireErreurAuthentification(
                erreur?.message ||
                "Impossible de changer le code pour le moment."
            )
        );

    }

}


/* =========================================================
   ENVOI DES NOTIFICATIONS
   ========================================================= */

// Les appels Edge doivent utiliser le jeton de la session la plus récente.
let sessionPrincipaleInvalidee = false;
let fermetureSessionPrincipaleEnCours = null;
let generationSessionPrincipale = 0;
function sessionDefinitivementRefusee(erreur) {
    return ["refresh_token_not_found","refresh_token_already_used","session_not_found","user_banned","user_not_found"].includes(String(erreur?.code || ""));
}
function fermerSessionPrincipaleInvalide() {
    if (sessionPrincipaleInvalidee) return;
    sessionPrincipaleInvalidee = true;
    generationSessionPrincipale++;
    utilisateurConnecte = null;
    profilUtilisateurConnecte = null;
    // Les journaux d'envoi restent rattachés à leur propriétaire. Ils ne sont
    // ni supprimés ni attribués à la prochaine personne qui se connecte.
    localStorage.removeItem(CLE_PROFIL_UTILISATEUR_CACHE);
    document.getElementById("cis-etat-connexion-serveur")?.remove();
    document.getElementById("cis-conflit-comptage-stock")?.remove();
    afficherConnexion();
    const client = obtenirClientSupabase();
    if (client) fermetureSessionPrincipaleEnCours = client.auth.signOut({scope:"local"})
        .catch(e => console.warn("Fermeture locale de session différée.",e))
        .finally(() => { fermetureSessionPrincipaleEnCours = null; });
}
const renouvellementsSessionPrincipale = new WeakMap();
let renouvellementApresRefusRequis = false;
async function renouvelerSessionPrincipale(client){
    if(renouvellementsSessionPrincipale.has(client))return renouvellementsSessionPrincipale.get(client);
    const demande=(async()=>{
        const {data,error}=await client.auth.refreshSession();
        if(error) {
            const definitive = sessionDefinitivementRefusee(error);
            const e = new Error(definitive ? "La session a été révoquée. Une nouvelle identification est nécessaire."
                : "Connexion au serveur momentanément indisponible. Nouvelle tentative automatique.");
            e.reconnexionNecessaire = definitive;
            if (definitive) fermerSessionPrincipaleInvalide();
            throw e;
        }
        if(!data?.session?.access_token) {
            fermerSessionPrincipaleInvalide();
            throw new Error("La session n'est plus disponible. Identifie-toi à nouveau.");
        }
        renouvellementApresRefusRequis = false;
        return data.session;
    })();
    renouvellementsSessionPrincipale.set(client,demande);
    try{return await demande;}finally{renouvellementsSessionPrincipale.delete(client);}
}
const validationsSessionPrincipale = new WeakMap();
let jetonPrincipaleRefuse = null;
async function obtenirSessionPrincipaleValide(client){
    if (validationsSessionPrincipale.has(client)) return validationsSessionPrincipale.get(client);
    const verification = (async () => {
        if (renouvellementsSessionPrincipale.has(client)) return renouvellementsSessionPrincipale.get(client);
        if (navigator.onLine === false) throw new Error("Connexion Internet indisponible. Réessaie lorsque la connexion est rétablie.");
        const {data,error} = await client.auth.getSession();
        if (error) {
            if (sessionDefinitivementRefusee(error)) fermerSessionPrincipaleInvalide();
            throw error;
        }
        const session = data?.session;
        if (!session?.access_token) {
            const e = new Error("La session n'est plus disponible. Identifie-toi pour effectuer cette action.");
            e.reconnexionNecessaire = true;
            if (utilisateurConnecte?.id) fermerSessionPrincipaleInvalide();
            throw e;
        }
        // Une réponse 401 tardive portant sur l'ancien jeton ne doit pas forcer
        // une nouvelle rotation du jeton qui vient déjà d'être renouvelé.
        const refusActuel = jetonPrincipaleRefuse && session.access_token === jetonPrincipaleRefuse;
        if (renouvellementApresRefusRequis && (!jetonPrincipaleRefuse || refusActuel) ||
            Number(session.expires_at || 0) <= Math.floor(Date.now()/1000)+90) {
            const nouvelle = await renouvelerSessionPrincipale(client);
            jetonPrincipaleRefuse = null;
            return nouvelle;
        }
        renouvellementApresRefusRequis = false;
        jetonPrincipaleRefuse = null;
        return session;
    })();
    validationsSessionPrincipale.set(client, verification);
    try { return await verification; }
    finally { if (validationsSessionPrincipale.get(client) === verification) validationsSessionPrincipale.delete(client); }
}
async function appelerFonctionPrincipale(client,nom,options={}){
    const session=await obtenirSessionPrincipaleValide(client);
    const invoquer=session=>client.functions.invoke(nom,{
        ...options,headers:{...options.headers,Authorization:"Bearer "+session.access_token}
    });
    let resultat=await invoquer(session);
    if(Number(resultat.error?.context?.status)===401){
        let nouvelle=await obtenirSessionPrincipaleValide(client);
        if(nouvelle.access_token===session.access_token)nouvelle=await renouvelerSessionPrincipale(client);
        resultat=await invoquer(nouvelle);
    }
    return resultat;
}
// All authenticated REST / RPC / storage / Edge requests use a current session.
// Auth endpoints are excluded to avoid recursive refresh or lock deadlocks.
let connexionPrincipaleIndisponible = false;
let derniereErreurConnexionPrincipale = "";
let derniereErreurLectureArchives = false;
let derniereLecturePharmacieReussie = false;
let restaurationConnexionPrincipaleEnCours = null;
let derniereTentativeRestaurationPrincipale = 0;
const lecturesPrincipaleEnErreur = new Set();
function signalerConnexionPrincipaleIndisponible(erreur) {
    if (erreur?.reconnexionNecessaire === true || sessionDefinitivementRefusee(erreur)) {
        fermerSessionPrincipaleInvalide();
        return;
    }
    connexionPrincipaleIndisponible = true;
    derniereErreurConnexionPrincipale = String(erreur?.message || "Le serveur n'a pas répondu").slice(0,180);
    // Une panne réseau ne bloque pas l'application et ne demande pas de connexion.
    // Les reprises existantes utilisent cet état pour retenter silencieusement.
    document.getElementById("cis-etat-connexion-serveur")?.remove();
}
// The Supabase SDK owns token attachment and its authentication locks.
// This transport only observes errors; it must not call auth from inside fetch.
async function requeteProjetAvecDelai(input, options = {}) {
    const controleur = new AbortController();
    const signalExterne = options.signal || (typeof input === "object" ? input.signal : null);
    const annuler = () => controleur.abort();
    if (signalExterne?.aborted) annuler();
    else signalExterne?.addEventListener("abort", annuler, {once:true});
    const delai = setTimeout(annuler, 25000);
    try { return await window.fetch(input, {...options, signal:controleur.signal}); }
    finally { clearTimeout(delai); signalExterne?.removeEventListener("abort", annuler); }
}
async function requeteSupabaseAuthentifiee(input, options = {}) {
    const adresse = new URL(typeof input === "string" ? input : input.url || String(input), window.SUPABASE_URL);
    const projet = new URL(window.SUPABASE_URL);
    const protegee = adresse.origin === projet.origin && /^\/(rest|functions|storage)\/v1(?:\/|$)/.test(adresse.pathname);
    if (!protegee) return requeteProjetAvecDelai(input, options);
    if (sessionPrincipaleInvalidee && !["GET","HEAD"].includes(String(options.method || input.method || "GET").toUpperCase()))
        throw new Error("Session fermée. Reconnecte-toi avant de modifier des données.");
    const methode = String(options.method || input.method || "GET").toUpperCase();
    const lecture = methode === "GET" || methode === "HEAD";
    try {
        const reponse = await requeteProjetAvecDelai(input, options);
        if (lecture) {
            if (reponse.ok) lecturesPrincipaleEnErreur.delete(adresse.pathname);
            else lecturesPrincipaleEnErreur.add(adresse.pathname);
        }
        // 403 denotes a permission refusal, not an Internet outage. The caller
        // handles its own error. No network-layer replay of any mutation.
        if (reponse.status === 401 && navigator.onLine) {
            const entetes = new Headers(options.headers || (typeof input === "object" ? input.headers : undefined));
            jetonPrincipaleRefuse = String(entetes.get("Authorization") || "").replace(/^Bearer\s+/i, "") || null;
            renouvellementApresRefusRequis = true;
            signalerConnexionPrincipaleIndisponible(new Error("Vérification automatique de la session en cours."));
        }
        return reponse;
    } catch (erreur) {
        if (lecture) lecturesPrincipaleEnErreur.add(adresse.pathname);
        if (navigator.onLine) signalerConnexionPrincipaleIndisponible(erreur);
        throw erreur;
    }
}
async function restaurerConnexionPrincipale(force = false) {
    if (restaurationConnexionPrincipaleEnCours) return restaurationConnexionPrincipaleEnCours;
    if (!navigator.onLine || document.hidden || !utilisateurConnecte?.id || validationRetourInterventionEnCours || synchronisationSupabaseEnCours) return;
    if (!force && (!connexionPrincipaleIndisponible || Date.now() - derniereTentativeRestaurationPrincipale < 30000)) return;
    derniereTentativeRestaurationPrincipale = Date.now();
    const demande = (async () => {
        try {
            const client = await assurerBibliothequeSupabaseDisponible();
            if (!client) throw new Error("Serveur indisponible");
            const session = await obtenirSessionPrincipaleValide(client);
            if (String(session.user?.id || "") !== String(utilisateurConnecte.id)) throw new Error("La session ne correspond plus au profil local. Identifie-toi à nouveau.");
            await chargerProfilUtilisateurDepuisSupabase(session.user);
            // Use the existing upload-first path to preserve pending offline returns.
            derniereSynchronisationNavigation = 0;
            await synchroniserAvantNavigation();
            if (!derniereLecturePharmacieReussie) throw new Error("Les données du serveur ne sont pas encore accessibles");
            // Only refresh read-only views; do not replace a form or a signature being drawn.
            const app = document.getElementById("app");
            if (!document.getElementById("cis-signature-modal")) {
                if (document.getElementById("historique-interventions")) rafraichirAffichageApresSynchronisation();
                else if (app?.querySelector("[data-archives-pharmacie]")) await afficherArchivesHistorique();
                else if (app?.querySelector(".caserne-shell-actualites")) await afficherActualitesCaserne(true);
            }
            // Successful authenticated reads prove that the connection is restored.
            // A stale failure from another page must not keep this banner alive.
            connexionPrincipaleIndisponible = false;
            document.getElementById("cis-etat-connexion-serveur")?.remove();
            void synchroniserMenagesEnAttente();
            void synchroniserHorsConnexionAutomatiquement();
        } catch (erreur) {
            signalerConnexionPrincipaleIndisponible(erreur);
            console.warn("Restauration de la connexion différée ; copie locale conservée.", erreur);
        }
    })();
    restaurationConnexionPrincipaleEnCours = demande;
    try { return await demande; } finally { restaurationConnexionPrincipaleEnCours = null; }
}
window.addEventListener("offline", () => { document.getElementById("cis-etat-connexion-serveur")?.remove(); });
window.addEventListener("online", () => { void restaurerConnexionPrincipale(true); });
window.addEventListener("focus", () => { void restaurerConnexionPrincipale(); });
window.addEventListener("pageshow", () => { void restaurerConnexionPrincipale(); });
window.addEventListener("storage", evenement => {
    if (String(evenement.key || "").startsWith("sb-") && String(evenement.key).endsWith("-auth-token")) {
        void restaurerConnexionPrincipale(true);
    }
});
document.addEventListener("visibilitychange", () => { if (!document.hidden) void restaurerConnexionPrincipale(); });
setInterval(() => { void restaurerConnexionPrincipale(); }, 15000);

async function detailErreurNotification(error){
    const code=Number(error?.context?.status)||0;
    let detail="";
    try{
        const contenu=await error.context.clone().json();
        detail=String(contenu?.error||contenu?.message||"").trim();
    }catch(_){}
    return new Error((detail||error?.message||"L’envoi de la notification a échoué.")+(code?" (HTTP "+code+")":""));
}
function entretenirSessionPrincipale(){
    if(document.hidden||navigator.onLine===false||!profilUtilisateurConnecte)return;
    const client=obtenirClientSupabase();
    if(client)void obtenirSessionPrincipaleValide(client).catch(()=>{});
}
setInterval(entretenirSessionPrincipale,60000);
document.addEventListener("visibilitychange",entretenirSessionPrincipale);
window.addEventListener("focus",entretenirSessionPrincipale);
window.addEventListener("pageshow",entretenirSessionPrincipale);
window.addEventListener("online",entretenirSessionPrincipale);

async function envoyerNotificationPush(
    titre,
    message,
    typeNotification = "generale"
) {

    if (!navigator.onLine) {

        throw new Error(
            "Connexion Internet indisponible."
        );

    }


    const supabase =
        await assurerBibliothequeSupabaseDisponible();

    if (!supabase) {

        throw new Error(
            "Supabase n'est pas disponible."
        );

    }


    const { data, error } =
        await appelerFonctionPrincipale(supabase,
            "envoyer-notification",
            {
                body: {
                    titre:
                        String(
                            titre ||
                            "CIS Le Chesne"
                        ),
                    message:
                        String(
                            message || ""
                        ),
                    type_notification:
                        String(
                            typeNotification || "generale"
                        )
                }
            }
        );


    if (error) {
        throw await detailErreurNotification(error);
    }


    if (
        data &&
        data.ok === false
    ) {

        throw new Error(
            data.error ||
            "L'envoi de la notification a échoué."
        );

    }


    return data;

}


function chargerNotificationsStockEnAttente() {

    try {

        const valeur =
            localStorage.getItem(
                CLE_NOTIFICATIONS_STOCK_EN_ATTENTE
            );

        if (!valeur) {
            return [];
        }


        const liste =
            JSON.parse(valeur);

        return Array.isArray(liste)
            ? liste
            : [];

    } catch (erreur) {

        console.warn(
            "File notifications illisible :",
            erreur
        );

        return [];

    }

}


function sauvegarderNotificationsStockEnAttente(
    liste
) {

    localStorage.setItem(
        CLE_NOTIFICATIONS_STOCK_EN_ATTENTE,
        JSON.stringify(liste)
    );

}


// Journal séparé, durable et rattaché au compte : aucune écriture de stock
// ne dépend de la réussite d'un simple rafraîchissement de page.
function cleJournalStock() {
    if (!utilisateurConnecte?.id) throw new Error("Connexion requise pour enregistrer le stock.");
    return "cis_operations_stock_v1:" + String(utilisateurConnecte.id);
}
function lireJournalStock() {
    const texte = localStorage.getItem(cleJournalStock());
    if (!texte) return [];
    const lignes = JSON.parse(texte);
    if (!Array.isArray(lignes)) throw new Error("Journal de stock illisible : les données sont conservées.");
    return lignes;
}
function ecrireJournalStock(lignes) {
    localStorage.setItem(cleJournalStock(), JSON.stringify(lignes));
}
// Conserver une copie des données de l'ancienne version et reprendre les
// retours hors connexion qui n'avaient pas encore atteint le serveur.
function preparerMigrationJournalStock() {
    const cle = cleJournalStock() + ":migration";
    let migration = JSON.parse(localStorage.getItem(cle) || "null");
    if (!migration) {
        migration = {terminee:false, retours:historique.filter(i => i.synchronisationEnAttente &&
            String(i.createdBy || utilisateurConnecte.id) === String(utilisateurConnecte.id)),
            stocksAvantMigration:materiels.map(m => ({id:String(m.id),stock:m.stock})), date:new Date().toISOString()};
        localStorage.setItem(cle, JSON.stringify(migration));
    }
    return migration;
}
async function migrerRetoursVersJournalStock(sb) {
    const cle = cleJournalStock() + ":migration";
    const migration = preparerMigrationJournalStock();
    if (migration.terminee) return;
    const uid = String(utilisateurConnecte.id);
    for (const retour of migration.retours) {
        if (retour.migrationStockTraitee) continue;
        const {data,error} = await sb.from("interventions").select("id").eq("id",retour.id).maybeSingle();
        if (error) throw error;
        if (String(utilisateurConnecte?.id) !== uid) throw new Error("Compte différent pendant la reprise des retours.");
        if (!data) {
            const lignes = lireJournalStock();
            for (const c of retour.consommations || []) {
                const quantite = Number(c.quantite);
                const origine = String(retour.id) + ":" + String(c.materielId);
                if (Number.isSafeInteger(quantite) && quantite > 0 && !lignes.some(x => x.origine === origine))
                    lignes.push({id:genererUUID(), origine, materielId:String(c.materielId), delta:-quantite,
                        utilisateurId:uid, creeLe:retour.createdAt || new Date().toISOString()});
            }
            ecrireJournalStock(lignes);
        }
        retour.migrationStockTraitee = true;
        localStorage.setItem(cle, JSON.stringify(migration));
    }
    migration.terminee = true;
    localStorage.setItem(cle, JSON.stringify(migration));
}
function enregistrerMouvementStock(materiel, ancienStock, reference = null) {
    preparerMigrationJournalStock();
    const avant = Number(ancienStock), apres = Number(materiel.stock);
    if (!Number.isSafeInteger(avant) || !Number.isSafeInteger(apres) || apres < 0)
        throw new Error("Quantité de stock invalide.");
    if (avant === apres) return;
    const lignes = lireJournalStock();
    lignes.push({id:genererUUID(), materielId:String(materiel.id), delta:apres-avant, reference,
        utilisateurId:String(utilisateurConnecte.id), creeLe:new Date().toISOString()});
    // En cas de stockage plein, la validation est interrompue ; aucune promesse
    // d'envoi ultérieur n'est faite sans avoir persisté le mouvement.
    try { ecrireJournalStock(lignes); }
    catch (e) { materiel.stock = avant; throw e; }
}
async function synchroniserJournalStock(sb) {
    const proprietaire = String(utilisateurConnecte?.id || "");
    const cle = cleJournalStock();
    for (const op of lireJournalStock()) {
        if (String(op.utilisateurId) !== proprietaire) throw new Error("Compte différent du mouvement en attente.");
        const session = await obtenirSessionPrincipaleValide(sb);
        if (String(session.user?.id) !== proprietaire || String(utilisateurConnecte?.id) !== proprietaire) throw new Error("Session différente du mouvement en attente.");
        const {data,error} = await sb.rpc("pharmacie_appliquer_stock", {
            p_id:op.id, p_materiel:op.materielId, p_delta:op.delta, p_reference:op.reference ?? null
        });
        if (error) {
            if (error.code === "40001" && op.reference != null) afficherComptageStockAConfirmer(op);
            throw error;
        }
        if (!data || data.id !== op.id || !Number.isSafeInteger(data.stock_apres))
            throw new Error("Le serveur n'a pas confirmé le mouvement de stock.");
        if (String(utilisateurConnecte?.id) !== proprietaire || cleJournalStock() !== cle)
            throw new Error("Le compte a changé pendant l'envoi.");
        if (data.alerte) mettreNotificationStockEnAttente({id:op.id, operationId:op.id,
            utilisateurId:proprietaire, creeLe:op.creeLe});
        // Relire le journal : une autre saisie peut avoir eu lieu pendant l'attente.
        const restantes = lireJournalStock().filter(x => x.id !== op.id);
        ecrireJournalStock(restantes);
        const m = materiels.find(x => String(x.id) === op.materielId);
        if (m) m.stock = data.stock_apres + restantes.filter(x => x.materielId === op.materielId)
            .reduce((s,x) => s + x.delta, 0);
        sauvegarderToutesLesDonnees();
    }
}
function afficherComptageStockAConfirmer(op) {
    if (!document.body || document.getElementById("cis-conflit-comptage-stock")) return;
    const zone = document.createElement("div");
    zone.id = "cis-conflit-comptage-stock";
    zone.setAttribute("role","status");
    zone.style.cssText = "position:fixed;top:calc(env(safe-area-inset-top,0px) + 12px);left:12px;right:12px;z-index:300000;background:#fff4d6;color:#382c12;border:2px solid #b17b00;border-radius:12px;padding:16px;font:14px Arial";
    zone.appendChild(document.createTextNode("Un comptage de stock doit être vérifié : la quantité a changé sur un autre appareil. "));
    const bouton = document.createElement("button");
    bouton.textContent = "Vérifier le comptage";
    bouton.onclick = async () => {
        bouton.disabled = true;
        try { await resoudreComptageStock(op.id); }
        catch (e) { alert(e.message || "Vérification indisponible pour le moment."); }
        finally { bouton.disabled = false; }
    };
    zone.appendChild(bouton);document.body.appendChild(zone);
}
async function resoudreComptageStock(id) {
    const op = lireJournalStock().find(x => x.id === id);
    if (!op || op.reference == null) return;
    const uid = String(utilisateurConnecte.id);
    const sb = await assurerBibliothequeSupabaseDisponible();
    const session = await obtenirSessionPrincipaleValide(sb);
    if (String(session.user?.id) !== uid) throw new Error("Compte différent du comptage.");
    const {data,error} = await sb.from("materiels").select("nom,stock").eq("id",op.materielId).single();
    if (error) throw error;
    if (!Number.isSafeInteger(data?.stock)) throw new Error("Stock du serveur indisponible.");
    const cible = op.reference + op.delta;
    if (!await afficherConfirmationCIS(data.nom + " : le serveur indique " + data.stock +
        ". Confirmer ton comptage à " + cible + " ?")) return;
    if (String(utilisateurConnecte?.id) !== uid) throw new Error("Le compte a changé.");
    const lignes = lireJournalStock();
    const index = lignes.findIndex(x => x.id === id);
    if (index < 0) return;
    if (cible === data.stock) lignes.splice(index,1);
    else lignes[index] = {...op,id:genererUUID(),reference:data.stock,delta:cible-data.stock};
    ecrireJournalStock(lignes);
    document.getElementById("cis-conflit-comptage-stock")?.remove();
    marquerModificationsEnAttente();
    reprendreHorsConnexionMaintenant();
}
function mettreNotificationStockEnAttente(notification) {
    if (!notification?.operationId) return;
    const liste = chargerNotificationsStockEnAttente();
    if (!liste.some(x => x.id === notification.id)) liste.push(notification);
    sauvegarderNotificationsStockEnAttente(liste);
}
async function envoyerNotificationsStockEnAttente() {
    if (envoiNotificationsStockEnCours || !navigator.onLine || !utilisateurConnecte?.id) return;
    envoiNotificationsStockEnCours = true;
    try {
        const sb = await assurerBibliothequeSupabaseDisponible();
        if (!sb) return;
        const session = await obtenirSessionPrincipaleValide(sb);
        const uid = String(utilisateurConnecte.id);
        if (String(session.user?.id) !== uid) return;
        for (const notification of chargerNotificationsStockEnAttente()) {
            // Les anciennes notifications locales n'ont aucune preuve serveur :
            // on ne les réémet pas après une mise à jour ou un réapprovisionnement.
            if (notification.operationId && notification.utilisateurId !== uid) continue;
            if (notification.operationId) {
                const {data,error} = await appelerFonctionPrincipale(sb, "pharmacie-notifications", {
                    body:{operation_id:notification.operationId}
                });
                if (error) throw error;
                if (!data?.ok) throw new Error("L'alerte reste en attente d'envoi.");
            }
            sauvegarderNotificationsStockEnAttente(chargerNotificationsStockEnAttente().filter(x => x.id !== notification.id));
        }
    } catch (e) { console.warn("Vérification des alertes différée.", e); }
    finally { envoiNotificationsStockEnCours = false; }
}

function preparerNotificationStock(materiel, ancienStock, reference = null) {
    enregistrerMouvementStock(materiel, ancienStock, reference);
}


/* =========================================================
   NOTIFICATIONS WEB PUSH - IOS + ANDROID
   ========================================================= */

function convertirCleVapidEnUint8Array(cleBase64) {

    const remplissage =
        "=".repeat(
            (4 - cleBase64.length % 4) % 4
        );

    const base64 =
        (cleBase64 + remplissage)
            .replace(/-/g, "+")
            .replace(/_/g, "/");

    const donneesBrutes =
        window.atob(base64);

    return Uint8Array.from(
        Array.from(donneesBrutes).map(
            function (caractere) {
                return caractere.charCodeAt(0);
            }
        )
    );

}


function notificationsWebPushDisponibles() {

    return (
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window
    );

}


function estAppareilIOS() {

    return (
        /iPhone|iPad|iPod/i.test(
            navigator.userAgent || ""
        ) ||
        (
            navigator.platform === "MacIntel" &&
            navigator.maxTouchPoints > 1
        )
    );

}


function estPwaInstallee() {

    return (
        window.matchMedia &&
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches
    ) ||
    window.navigator.standalone === true;

}


async function obtenirAbonnementPushActuel() {

    if (!notificationsWebPushDisponibles()) {
        return null;
    }

    const inscription =
        await navigator.serviceWorker.ready;

    return inscription.pushManager.getSubscription();

}


function mettreAJourBoutonNotifications(
    bouton,
    etat
) {

    if (!bouton) {
        return;
    }

    bouton.disabled =
        activationNotificationsEnCours;

    if (activationNotificationsEnCours) {

        bouton.textContent =
            "🔔 …";

        bouton.title =
            "Activation des notifications…";

        return;
    }


    if (etat === "active") {

        bouton.textContent =
            "🔔 ✓";

        bouton.title =
            "Notifications activées";

        bouton.setAttribute(
            "aria-label",
            "Notifications activées"
        );

        return;
    }


    if (etat === "bloque") {

        bouton.textContent =
            "🔕";

        bouton.title =
            "Notifications bloquées dans les réglages de l'appareil";

        bouton.setAttribute(
            "aria-label",
            "Notifications bloquées"
        );

        return;
    }


    bouton.textContent =
        "🔔";

    bouton.title =
        "Activer les notifications";

    bouton.setAttribute(
        "aria-label",
        "Activer les notifications"
    );

}


async function rafraichirEtatBoutonNotifications() {

    const bouton =
        document.getElementById(
            "btn-notifications-push"
        );

    if (!bouton) {
        return;
    }

    if (!notificationsWebPushDisponibles()) {

        bouton.hidden = true;
        return;
    }

    bouton.hidden = false;


    if (
        Notification.permission ===
        "denied"
    ) {

        mettreAJourBoutonNotifications(
            bouton,
            "bloque"
        );

        return;
    }


    try {

        const abonnement =
            await obtenirAbonnementPushActuel();

        mettreAJourBoutonNotifications(
            bouton,
            abonnement
                ? "active"
                : "inactive"
        );

    } catch (erreur) {

        console.warn(
            "État notifications indisponible :",
            erreur
        );

        mettreAJourBoutonNotifications(
            bouton,
            "inactive"
        );

    }

}


async function enregistrerAbonnementPushSupabase(
    abonnement
) {

    const supabase =
        await assurerBibliothequeSupabaseDisponible();

    if (!supabase) {

        throw new Error(
            "Supabase n'est pas disponible."
        );

    }


    const json =
        abonnement.toJSON();

    const endpoint =
        json.endpoint ||
        abonnement.endpoint;

    const p256dh =
        json.keys?.p256dh || "";

    const auth =
        json.keys?.auth || "";


    if (
        !endpoint ||
        !p256dh ||
        !auth
    ) {

        throw new Error(
            "Abonnement Push incomplet."
        );

    }


    const { error } =
        await supabase
            .from("push_subscriptions")
            .upsert(
                {
                    endpoint: endpoint,
                    p256dh: p256dh,
                    auth: auth,
                    user_agent:
                        navigator.userAgent || "",
                    user_id:
                        utilisateurConnecte?.id || profilUtilisateurConnecte?.id || null,
                    actif: true,
                    updated_at:
                        new Date().toISOString()
                },
                {
                    onConflict: "endpoint"
                }
            );


    if (error) {
        throw error;
    }
    await associerHistoriqueNotifications(abonnement, utilisateurConnecte?.id || profilUtilisateurConnecte?.id);

}


async function synchroniserAbonnementPushUtilisateurConnecte() {
    try {
        if (!navigator.onLine || !notificationsWebPushDisponibles() || !utilisateurConnecte?.id) return;
        const abonnement = await obtenirAbonnementPushActuel();
        if (!abonnement) return;
        await enregistrerAbonnementPushSupabase(abonnement);
    } catch (erreur) {
        console.warn("Association notification/utilisateur impossible :", erreur);
    }
}

async function activerNotificationsPush() {
    alert("Les notifications externes sont désactivées dans cette version de test.");return;

    if (activationNotificationsEnCours) {
        return;
    }


    if (!navigator.onLine) {

        alert(
            "⚠️ Une connexion Internet est nécessaire pour activer les notifications."
        );

        return;
    }


    if (!notificationsWebPushDisponibles()) {

        alert(
            "⚠️ Les notifications Push ne sont pas disponibles sur ce navigateur."
        );

        return;
    }


    /*
     * Sur iPhone/iPad, Web Push fonctionne pour une PWA
     * ajoutée à l'écran d'accueil.
     */
    if (
        estAppareilIOS() &&
        !estPwaInstallee()
    ) {

        alert(
            "📱 Sur iPhone/iPad, ouvre CIS Le Chesne depuis l’icône ajoutée à l’écran d’accueil pour activer les notifications."
        );

        return;
    }


    activationNotificationsEnCours =
        true;

    await rafraichirEtatBoutonNotifications();


    try {

        let autorisation =
            Notification.permission;


        if (autorisation === "default") {

            autorisation =
                await Notification.requestPermission();

        }


        if (autorisation !== "granted") {

            if (autorisation === "denied") {

                alert(
                    "🔕 Les notifications ont été refusées. Tu pourras les autoriser plus tard dans les réglages de ton appareil."
                );

            }

            return;
        }


        const inscription =
            await navigator.serviceWorker.ready;


        let abonnement =
            await inscription
                .pushManager
                .getSubscription();


        if (!abonnement) {

            abonnement =
                await inscription
                    .pushManager
                    .subscribe({
                        userVisibleOnly: true,
                        applicationServerKey:
                            convertirCleVapidEnUint8Array(
                                VAPID_PUBLIC_KEY
                            )
                    });

        }


        await enregistrerAbonnementPushSupabase(
            abonnement
        );


        alert(
            "✅ Notifications activées sur cet appareil."
        );

    } catch (erreur) {

        console.error(
            "Activation notifications impossible :",
            erreur
        );

        alert(
            "⚠️ Impossible d'activer les notifications pour le moment."
        );

    } finally {

        activationNotificationsEnCours =
            false;

        await rafraichirEtatBoutonNotifications();

    }

}


function initialiserBoutonNotifications() {

    /*
     * La cloche globale a été retirée.
     * Les notifications se règlent maintenant
     * depuis la page Profil.
     */

    const ancienBouton =
        document.getElementById(
            "btn-notifications-push"
        );

    if (ancienBouton) {
        ancienBouton.remove();
    }


    if (
        window.__ecouteNotificationsStockInitialisee
        !== true
    ) {

        window.__ecouteNotificationsStockInitialisee =
            true;

        window.addEventListener(
            "online",
            function () {
                void envoyerNotificationsStockEnAttente();
            }
        );

    }


    if (navigator.onLine) {
        void envoyerNotificationsStockEnAttente();
    }

}

/* =========================================================
   NORMALISATION
   ========================================================= */

function normaliserToutesLesDonnees() {
    if (typeof appliquerSuppressionsLocalesPilotage === "function") appliquerSuppressionsLocalesPilotage();

    materiels = materiels.map(function (materiel, index) {

        return normaliserMateriel(
            materiel,
            index
        );

    });


    categories = categories
        .map(function (categorie) {

            if (
                typeof categorie === "object" &&
                categorie !== null
            ) {

                return String(
                    categorie.nom || ""
                ).trim();

            }

            return String(
                categorie || ""
            ).trim();

        })
        .filter(Boolean);


    categories = categories.filter(
        function (categorie, index, array) {

            return (
                array.findIndex(function (c) {

                    return (
                        c.toLowerCase() ===
                        categorie.toLowerCase()
                    );

                }) === index
            );

        }
    );


    historique = historique.map(
        normaliserIntervention
    );

}


/* =========================================================
   NORMALISER MATERIEL
   ========================================================= */

function normaliserMateriel(materiel, index) {

    const m = materiel || {};

    let id = m.id;


    if (
        id === undefined ||
        id === null ||
        id === ""
    ) {

        id =
            "materiel-" +
            Date.now() +
            "-" +
            index;

    }


    let stock;


    if (
        m.stock !== undefined &&
        m.stock !== null
    ) {

        stock = Number(m.stock);

    } else {

        stock = Number(m.quantite);

    }


    if (!Number.isFinite(stock)) {

        stock = 0;

    }


    let cats = [];


    if (Array.isArray(m.categories)) {

        cats = m.categories
            .map(function (categorie) {

                if (
                    typeof categorie === "object" &&
                    categorie !== null
                ) {

                    return String(
                        categorie.nom || ""
                    );

                }

                return String(
                    categorie || ""
                );

            })
            .map(function (categorie) {

                return categorie.trim();

            })
            .filter(Boolean);

    } else if (m.categorie) {

        cats = [
            String(
                m.categorie
            ).trim()
        ];

    }


    return {

        id: id,

        nom:
            String(
                m.nom ||
                "Matériel"
            ),

        reference:
            String(
                m.reference ||
                ""
            ),

        description:
            String(
                m.description ||
                ""
            ),

        categories:
            cats,

        stock:
            Math.max(
                0,
                Math.floor(stock)
            ),

        minimum:
            Math.max(
                0,
                Math.floor(
                    Number(
                        m.minimum || 0
                    )
                )
            ),

        emplacement:
            String(
                m.emplacement ||
                ""
            ),

        photo:
            String(
                m.photo ||
                ""
            )

    };

}


/* =========================================================
   NORMALISER INTERVENTION
   ========================================================= */

function normaliserIntervention(intervention) {

    const i = intervention || {};

    const consommations =
        Array.isArray(
            i.consommations
        )
            ? i.consommations
            : [];


    return {

        id:
            i.id ||
            genererUUID(),

        date:
            String(
                i.date ||
                ""
            ),

        numeroIntervention:
            String(
                i.numeroIntervention ||
                i.numero ||
                ""
            ),

        createdBy:
            String(
                i.createdBy ||
                i.created_by ||
                ""
            ),

        createdByPrenom:
            String(
                i.createdByPrenom ||
                i.created_by_prenom ||
                ""
            ),

        createdByNom:
            String(
                i.createdByNom ||
                i.created_by_nom ||
                ""
            ),

        createdAt:
            String(
                i.createdAt ||
                i.created_at ||
                ""
            ),

        synchronisationEnAttente:
            i.synchronisationEnAttente === true,

        consommations:
            consommations.map(function (consommation) {

                return {

                    materielId:
                        consommation.materielId,

                    materiel:
                        String(
                            consommation.materiel ||
                            consommation.materielNom ||
                            "Matériel"
                        ),

                    quantite:
                        Math.max(
                            0,
                            Number(
                                consommation.quantite ||
                                0
                            )
                        )

                };

            })

    };

}


/* =========================================================
   CHARGEMENT DES MATERIELS
   ========================================================= */

function chargerMateriels() {

    let donnees = null;


    const ancien =
        localStorage.getItem(
            STORAGE.materiels
        );


    const v3 =
        localStorage.getItem(
            STORAGE.materielsV3
        );


    if (ancien) {

        try {

            donnees =
                JSON.parse(
                    ancien
                );

        } catch (e) {

            console.error(
                "Erreur lecture matériels :",
                e
            );

        }

    }


    if (
        !Array.isArray(donnees) &&
        v3
    ) {

        try {

            donnees =
                JSON.parse(
                    v3
                );

        } catch (e) {

            console.error(
                "Erreur lecture matériels V3 :",
                e
            );

        }

    }


    materiels =
        Array.isArray(donnees)
            ? donnees
            : [];

}


/* =========================================================
   CHARGEMENT DES CATEGORIES
   ========================================================= */

function chargerCategories() {

    let donnees = null;


    const ancien =
        localStorage.getItem(
            STORAGE.categories
        );


    const v3 =
        localStorage.getItem(
            STORAGE.categoriesV3
        );


    if (ancien) {

        try {

            donnees =
                JSON.parse(
                    ancien
                );

        } catch (e) {

            console.error(
                "Erreur lecture catégories :",
                e
            );

        }

    }


    if (
        !Array.isArray(donnees) &&
        v3
    ) {

        try {

            donnees =
                JSON.parse(
                    v3
                );

        } catch (e) {

            console.error(
                "Erreur lecture catégories V3 :",
                e
            );

        }

    }


    categories =
        Array.isArray(donnees)
            ? donnees
            : [];

}


/* =========================================================
   CHARGEMENT DE L'HISTORIQUE
   ========================================================= */

function chargerHistorique() {

    let donnees = null;


    const ancien =
        localStorage.getItem(
            STORAGE.historique
        );


    const v3 =
        localStorage.getItem(
            STORAGE.historiqueV3
        );


    if (ancien) {

        try {

            donnees =
                JSON.parse(
                    ancien
                );

        } catch (e) {

            console.error(
                "Erreur lecture historique :",
                e
            );

        }

    }


    if (
        !Array.isArray(donnees) &&
        v3
    ) {

        try {

            donnees =
                JSON.parse(
                    v3
                );

        } catch (e) {

            console.error(
                "Erreur lecture historique V3 :",
                e
            );

        }

    }


    historique =
        Array.isArray(donnees)
            ? donnees
            : [];

}



/* =========================================================
   CHARGEMENT DES ARCHIVES DE L'HISTORIQUE
   ========================================================= */

function chargerArchivesHistorique() {

    let donnees = null;

    const principal =
        localStorage.getItem(
            STORAGE.archivesHistorique
        );

    const v3 =
        localStorage.getItem(
            STORAGE.archivesHistoriqueV3
        );

    for (const source of [principal, v3]) {

        if (!source) {
            continue;
        }

        try {

            const valeur =
                JSON.parse(source);

            if (Array.isArray(valeur)) {
                donnees = valeur;
                break;
            }

        } catch (erreur) {

            console.error(
                "Erreur lecture archives historique :",
                erreur
            );

        }

    }


    archivesHistorique =
        Array.isArray(donnees)
            ? donnees
            : [];

}


/* =========================================================
   SAUVEGARDE
   ========================================================= */

function sauvegarderToutesLesDonnees() {

    localStorage.setItem(
        STORAGE.materiels,
        JSON.stringify(
            materiels
        )
    );


    localStorage.setItem(
        STORAGE.categories,
        JSON.stringify(
            categories.map(function (nom, index) {

                return {

                    id:
                        index + 1,

                    nom:
                        nom

                };

            })
        )
    );


    localStorage.setItem(
        STORAGE.historique,
        JSON.stringify(
            historique
        )
    );


    localStorage.setItem(
        STORAGE.archivesHistorique,
        JSON.stringify(
            archivesHistorique
        )
    );


    localStorage.setItem(
        STORAGE.materielsV3,
        JSON.stringify(
            materiels
        )
    );


    localStorage.setItem(
        STORAGE.categoriesV3,
        JSON.stringify(
            categories
        )
    );


    localStorage.setItem(
        STORAGE.historiqueV3,
        JSON.stringify(
            historique
        )
    );


    localStorage.setItem(
        STORAGE.archivesHistoriqueV3,
        JSON.stringify(
            archivesHistorique
        )
    );

    // La sauvegarde locale reste immédiate. Les données en attente sont aussi
    // renvoyées automatiquement lorsque le réseau redevient disponible.

}


/* =========================================================
   SYNCHRONISATION SUPABASE
   ========================================================= */

let clientSupabase = null;
let synchronisationSupabaseActive = false;
let synchronisationSupabaseEnCours = false;
let synchronisationSupabaseProgrammee = false;
let abonnementSupabase = null;

// Évite de retélécharger toute la base à chaque changement rapide d'onglet.
// Les modifications locales, elles, restent toujours prioritaires et sont envoyées immédiatement.
let derniereSynchronisationNavigation = 0;
const DELAI_SYNCHRONISATION_NAVIGATION = 20000;

const STORAGE_SYNC = {
    snapshot: "inventaire_caserne_supabase_snapshot_v1",
    modificationsEnAttente: "inventaire_caserne_supabase_modifications_en_attente_v1"
};

let nombreSynchronisationsVisuelles = 0;

function initialiserIndicateurSynchronisation() {

    if (document.getElementById("indicateur-synchronisation")) {
        return;
    }

    const style = document.createElement("style");

    style.textContent = `
        #indicateur-synchronisation {
            position: fixed;
            top: calc(12px + env(safe-area-inset-top, 0px));
            right: calc(12px + env(safe-area-inset-right, 0px));
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            pointer-events: auto;
            opacity: 0.95;
            border: 0;
            padding: 0;
            margin: 0;
            background: transparent;
            cursor: pointer;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        #indicateur-synchronisation:active {
            transform: scale(0.94);
        }

        #indicateur-synchronisation:focus-visible {
            outline: 2px solid #1687ff;
            outline-offset: 2px;
            border-radius: 50%;
        }

        .historique-total.historique-rupture-stock {
            background: #d71920 !important;
            border-color: #d71920 !important;
            color: #ffffff !important;
        }

        .historique-total.historique-rupture-stock *,
        .historique-total .texte-rupture-stock,
        .historique-total .texte-rupture-stock * {
            color: #ffffff !important;
        }

        .historique-total.historique-rupture-stock:active {
            background: #b80f15 !important;
        }

        #indicateur-synchronisation svg {
            width: 27px;
            height: 27px;
            display: block;
            transform-origin: center;
        }

        #indicateur-synchronisation.en-cours svg {
            animation: rotation-synchronisation 0.8s linear infinite;
        }

        @keyframes rotation-synchronisation {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;

    document.head.appendChild(style);

    const indicateur = document.createElement("button");
    indicateur.id = "indicateur-synchronisation";
    indicateur.type = "button";
    indicateur.setAttribute(
        "aria-label",
        "Synchroniser maintenant"
    );
    indicateur.setAttribute(
        "title",
        "Synchroniser maintenant"
    );

    indicateur.addEventListener(
        "click",
        function () {
            void synchroniserManuellement();
        }
    );

    indicateur.innerHTML = `
        <svg viewBox="0 0 32 32" aria-hidden="true">
            <path
                d="M25.5 10.5A11 11 0 0 0 7.2 7.8"
                fill="none"
                stroke="#1687ff"
                stroke-width="3"
                stroke-linecap="round"
            />
            <path
                d="M7.1 7.8l5.2-.4-2.2 4.8"
                fill="none"
                stroke="#1687ff"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M6.5 21.5a11 11 0 0 0 18.3 2.7"
                fill="none"
                stroke="#1687ff"
                stroke-width="3"
                stroke-linecap="round"
            />
            <path
                d="M24.9 24.2l-5.2.4 2.2-4.8"
                fill="none"
                stroke="#1687ff"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    `;

    document.body.appendChild(indicateur);

}


function initialiserBandeauConnexion() {

    if (
        !document.getElementById(
            "style-bandeau-connexion"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "style-bandeau-connexion";

        style.textContent = `
            #bandeau-hors-connexion {
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                min-height: 64px;
                box-sizing: border-box;
                z-index: 100000;
                padding:
                    16px
                    14px
                    calc(16px + env(safe-area-inset-bottom, 0px));
                background: #fff3cd;
                border-top: 1px solid #e6cf75;
                color: #5c4b00;
                text-align: center;
                font-size: 15px;
                font-weight: 700;
                line-height: 1.3;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
            }

            #bandeau-hors-connexion[hidden] {
                display: none !important;
            }

            body.mode-hors-connexion {
                padding-bottom:
                    calc(84px + env(safe-area-inset-bottom, 0px));
            }

            .intervention-en-attente-sync {
                background: #fff8d9 !important;
                border-color: #ead67a !important;
            }

            .intervention-en-attente-sync small {
                color: #806600 !important;
                font-weight: 700;
            }
        `;

        document.head.appendChild(
            style
        );

    }


    let bandeau =
        document.getElementById(
            "bandeau-hors-connexion"
        );


    if (!bandeau) {

        bandeau =
            document.createElement(
                "div"
            );

        bandeau.id =
            "bandeau-hors-connexion";

        bandeau.textContent =
            "Tu es actuellement hors connexion internet";

        document.body.appendChild(
            bandeau
        );

    }


    function mettreAJourBandeauConnexion() {

        bandeau.hidden =
            navigator.onLine;

        document.body.classList.toggle(
            "mode-hors-connexion",
            !navigator.onLine
        );

    }


    window.addEventListener(
        "online",
        mettreAJourBandeauConnexion
    );

    window.addEventListener(
        "offline",
        mettreAJourBandeauConnexion
    );


    mettreAJourBandeauConnexion();

}


function demarrerIndicateurSynchronisation() {

    nombreSynchronisationsVisuelles += 1;

    const indicateur =
        document.getElementById("indicateur-synchronisation");

    if (indicateur) {
        indicateur.classList.add("en-cours");
    }

}

function arreterIndicateurSynchronisation() {

    nombreSynchronisationsVisuelles =
        Math.max(
            0,
            nombreSynchronisationsVisuelles - 1
        );

    if (nombreSynchronisationsVisuelles > 0) {
        return;
    }

    const indicateur =
        document.getElementById("indicateur-synchronisation");

    if (indicateur) {
        indicateur.classList.remove("en-cours");
    }

}

function marquerModificationsEnAttente() {

    localStorage.setItem(
        STORAGE_SYNC.modificationsEnAttente,
        "1"
    );
    localStorage.setItem("cis_sync_proprietaire", String(utilisateurConnecte?.id || ""));

}

function effacerModificationsEnAttente() {
    localStorage.removeItem("cis_sync_proprietaire");

    localStorage.removeItem(
        STORAGE_SYNC.modificationsEnAttente
    );

}

function existeModificationsEnAttente() {

    return (
        localStorage.getItem(
            STORAGE_SYNC.modificationsEnAttente
        ) === "1"
    );

}

async function synchroniserManuellement() {

    const debutAnimationSynchronisation =
        Date.now();

    while (synchronisationSupabaseEnCours) {

        await new Promise(
            function (resolve) {
                setTimeout(resolve, 80);
            }
        );

    }

    if (!navigator.onLine) {

        alert(
            "📴 Pas de connexion Internet. La synchronisation sera possible dès que la connexion reviendra."
        );

        return;
    }

    demarrerIndicateurSynchronisation();

    try {

        const supabase =
            await assurerBibliothequeSupabaseDisponible();

        if (!supabase) {

            alert(
                "⚠️ La connexion Internet vient peut-être de revenir. Impossible de joindre Supabase pour le moment. Réessayez dans quelques secondes."
            );

            return;
        }

        // S'il reste une modification locale en attente,
        // on l'envoie d'abord vers Supabase.
        if (existeModificationsEnAttente()) {

            synchronisationSupabaseEnCours = true;

            try {

                await envoyerDonneesLocalesVersSupabase();
                effacerModificationsEnAttente();

            } finally {

                synchronisationSupabaseEnCours = false;

            }

        }

        // Puis on relit la base centrale.
        const donnees =
            await recupererDonneesSupabase();

        synchronisationSupabaseEnCours = true;

        try {

            await appliquerDonneesSupabaseLocalement(
                donnees
            );

        } finally {

            synchronisationSupabaseEnCours = false;

        }

        synchronisationSupabaseActive = true;

        // Le clic sur les flèches est une action volontaire :
        // on met donc immédiatement à jour l'écran affiché.
        rafraichirAffichageApresSynchronisation();

        console.log(
            "🔄 Synchronisation manuelle terminée."
        );

    } catch (erreur) {

        console.warn(
            "⚠️ Synchronisation manuelle impossible.",
            erreur
        );

        const detailErreur =
            String(
                erreur?.message ||
                erreur?.details ||
                erreur?.hint ||
                ""
            ).trim();

        alert(
            "⚠️ La synchronisation n'a pas pu être effectuée." +
            (
                detailErreur
                    ? "\n\nDétail : " + detailErreur
                    : ""
            )
        );

    } finally {

        const tempsEcoule =
            Date.now() -
            debutAnimationSynchronisation;

        const tempsRestant =
            Math.max(
                0,
                600 - tempsEcoule
            );

        if (tempsRestant > 0) {

            await new Promise(
                function (resolve) {

                    setTimeout(
                        resolve,
                        tempsRestant
                    );

                }
            );

        }

        arreterIndicateurSynchronisation();

    }

}

async function synchroniserAvantNavigation() {

    while (synchronisationSupabaseEnCours) {

        await new Promise(
            function (resolve) {
                setTimeout(resolve, 80);
            }
        );

    }

    if (!navigator.onLine) {
        return;
    }

    // Si une synchronisation complète vient juste d'être faite et qu'il
    // n'y a aucune modification locale en attente, on réutilise les données
    // déjà chargées. Cela rend les changements d'onglet beaucoup plus rapides.
    if (
        !existeModificationsEnAttente() &&
        derniereSynchronisationNavigation > 0 &&
        Date.now() - derniereSynchronisationNavigation < DELAI_SYNCHRONISATION_NAVIGATION
    ) {
        return;
    }

    const supabase =
        await assurerBibliothequeSupabaseDisponible();

    if (!supabase) {
        return;
    }

    demarrerIndicateurSynchronisation();

    try {

        // Si une modification a été faite hors connexion,
        // elle est envoyée avant de récupérer la base centrale.
        if (existeModificationsEnAttente()) {

            synchronisationSupabaseEnCours = true;

            try {
                await envoyerDonneesLocalesVersSupabase();
                effacerModificationsEnAttente();
            } finally {
                synchronisationSupabaseEnCours = false;
            }

        }

        const donnees =
            await recupererDonneesSupabase();

        synchronisationSupabaseEnCours = true;

        try {
            await appliquerDonneesSupabaseLocalement(
                donnees
            );
        } finally {
            synchronisationSupabaseEnCours = false;
        }

        synchronisationSupabaseActive = true;
        derniereSynchronisationNavigation = Date.now();

        console.log(
            "🔄 Synchronisation avant affichage terminée."
        );

    } catch (erreur) {

        console.warn(
            "⚠️ Synchronisation avant affichage impossible. Les données locales restent disponibles.",
            erreur
        );

    } finally {

        arreterIndicateurSynchronisation();

    }

}

async function synchroniserApresModification() {

    while (synchronisationSupabaseEnCours) {

        await new Promise(
            function (resolve) {
                setTimeout(resolve, 80);
            }
        );

    }

    marquerModificationsEnAttente();

    if (!navigator.onLine) {

        console.log(
            "📴 Modification enregistrée localement. Elle sera synchronisée automatiquement au retour de la connexion."
        );

        return false;
    }


    const supabase =
        await assurerBibliothequeSupabaseDisponible();

    if (!supabase) {

        console.log(
            "⚠️ Supabase n'est pas encore joignable. La modification reste enregistrée localement."
        );

        return false;

    }

    demarrerIndicateurSynchronisation();

    try {

        synchronisationSupabaseEnCours = true;

        try {

            await envoyerDonneesLocalesVersSupabase();
            effacerModificationsEnAttente();

        } finally {

            synchronisationSupabaseEnCours = false;

        }

        // Une fois l'envoi terminé, on relit immédiatement la base centrale.
        // Cela évite qu'un iPhone/iPad garde une ancienne copie locale.
        const donnees =
            await recupererDonneesSupabase();

        synchronisationSupabaseEnCours = true;

        try {

            await appliquerDonneesSupabaseLocalement(
                donnees
            );

        } finally {

            synchronisationSupabaseEnCours = false;

        }

        synchronisationSupabaseActive = true;

        // Cette actualisation n'a lieu qu'après une validation utilisateur,
        // jamais pendant la saisie d'un formulaire.
        rafraichirAffichageApresSynchronisation();

        console.log(
            "✅ Modification synchronisée avec Supabase."
        );

        return true;

    } catch (erreur) {

        console.warn(
            "⚠️ La modification reste enregistrée localement et sera renvoyée plus tard.",
            erreur
        );

        return false;

    } finally {

        arreterIndicateurSynchronisation();

    }

}


async function assurerBibliothequeSupabaseDisponible() {

    if (
        window.supabase &&
        typeof window.supabase.createClient === "function"
    ) {

        return obtenirClientSupabase();

    }


    if (!navigator.onLine) {

        return null;

    }


    const scriptExistant =
        document.getElementById(
            "supabase-reconnexion"
        );


    if (scriptExistant) {

        scriptExistant.remove();

    }


    return await new Promise(
        function (resolve) {

            const script =
                document.createElement(
                    "script"
                );

            script.id =
                "supabase-reconnexion";

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

            script.async =
                true;


            const minuterie =
                setTimeout(
                    function () {

                        resolve(
                            obtenirClientSupabase()
                        );

                    },
                    8000
                );


            script.onload =
                function () {

                    clearTimeout(
                        minuterie
                    );

                    resolve(
                        obtenirClientSupabase()
                    );

                };


            script.onerror =
                function () {

                    clearTimeout(
                        minuterie
                    );

                    resolve(
                        null
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


function obtenirClientSupabase() {

    try {

        if (clientSupabase) {
            return clientSupabase;
        }

        if (!window.supabase || typeof window.supabase.createClient !== "function") {
            return null;
        }

        if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
            console.warn("Supabase non configuré : URL ou clé publique absente.");
            return null;
        }

        clientSupabase = window.supabase.createClient(
            window.SUPABASE_URL,
            window.SUPABASE_ANON_KEY,
            {auth:{persistSession:true,autoRefreshToken:true},global:{fetch:requeteSupabaseAuthentifiee,headers:{"x-client-info":"cis-principale"}}}
        );

        return clientSupabase;

    } catch (erreur) {

        console.error("Impossible d'initialiser Supabase :", erreur);
        return null;

    }

}

function estUUID(value) {

    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        String(value || "")
    );

}

function genererUUID() {

    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
    );

}

function lireSnapshotSynchronisation() {

    try {

        const texte = localStorage.getItem(
            STORAGE_SYNC.snapshot
        );

        if (!texte) {
            return {
                materiels: [],
                categories: [],
                interventions: [],
                archives: []
            };
        }

        const valeur = JSON.parse(texte);

        return {
            materiels: Array.isArray(valeur.materiels) ? valeur.materiels : [],
            categories: Array.isArray(valeur.categories) ? valeur.categories : [],
            interventions: Array.isArray(valeur.interventions) ? valeur.interventions : [],
            archives: Array.isArray(valeur.archives) ? valeur.archives : []
        };

    } catch (erreur) {

        console.error("Erreur lecture snapshot Supabase :", erreur);

        return {
            materiels: [],
            categories: [],
            interventions: []
        };

    }

}

function enregistrerSnapshotSynchronisation() {

    const snapshot = {
        materiels: materiels.map(function (materiel) {
            return String(materiel.id);
        }),
        categories: categories.map(function (categorie) {
            return String(categorie).trim();
        }),
        interventions: historique.map(function (intervention) {
            return String(intervention.id);
        }),
        archives: archivesHistorique.map(function (archive) {
            return String(archive.id);
        })
    };

    localStorage.setItem(
        STORAGE_SYNC.snapshot,
        JSON.stringify(snapshot)
    );

}

async function recupererDonneesSupabase() {

    derniereLecturePharmacieReussie = false;

    const supabase = obtenirClientSupabase();

    if (!supabase) {
        throw new Error("Client Supabase indisponible.");
    }

    await obtenirSessionPrincipaleValide(supabase);
    const resultats = await Promise.all([
        supabase.from("categories").select("id,nom,parent_id"),
        supabase
            .from("materiels")
            .select("id,nom,reference,description,stock,minimum,emplacement"),
        supabase
            .from("materiel_categories")
            .select("materiel_id,categorie_id"),
        supabase
            .from("interventions")
            .select("id,date,numero,created_by,created_by_prenom,created_by_nom,created_at"),
        supabase
            .from("consommations")
            .select("id,intervention_id,materiel_id,materiel_nom,quantite")
    ]);

    resultats.forEach(function (resultat) {
        if (resultat.error) {
            signalerConnexionPrincipaleIndisponible(resultat.error);
            throw resultat.error;
        }
    });


    /*
     * Les archives sont volontairement lues séparément.
     * Ainsi, si la table n'a pas encore été créée dans Supabase,
     * le reste de l'application continue de fonctionner normalement.
     */
    let archivesDistantes = null;
    derniereErreurLectureArchives = false;

    try {

        const resultatArchives =
            await supabase
                .from("archives_historique")
                .select("id,date_commande,interventions,created_at")
                .order("date_commande", {
                    ascending: false
                })
                .order("created_at", {
                    ascending: false
                });

        if (resultatArchives.error) {
            derniereErreurLectureArchives = true;
            signalerConnexionPrincipaleIndisponible(resultatArchives.error);
            console.warn(
                "Archives Supabase indisponibles :",
                resultatArchives.error
            );

        } else {

            archivesDistantes =
                resultatArchives.data || [];

        }

    } catch (erreurArchives) {
        derniereErreurLectureArchives = true;
        signalerConnexionPrincipaleIndisponible(erreurArchives);
        console.warn(
            "Lecture archives Supabase impossible :",
            erreurArchives
        );

    }


    derniereLecturePharmacieReussie = true;
    connexionPrincipaleIndisponible = false;
    document.getElementById("cis-etat-connexion-serveur")?.remove();
    return {
        categories: resultats[0].data || [],
        materiels: resultats[1].data || [],
        materielCategories: resultats[2].data || [],
        interventions: resultats[3].data || [],
        consommations: resultats[4].data || [],
        archivesHistorique: archivesDistantes
    };

}

function convertirDonneesSupabaseEnDonneesApplication(donnees) {

    const categoriesParId = new Map();

    donnees.categories.forEach(function (categorie) {
        categoriesParId.set(
            String(categorie.id),
            String(categorie.nom || "").trim()
        );
    });

    const categoriesParMateriel = new Map();

    donnees.materielCategories.forEach(function (relation) {

        const materielId = String(relation.materiel_id);
        const nomCategorie = categoriesParId.get(
            String(relation.categorie_id)
        );

        if (!nomCategorie) {
            return;
        }

        if (!categoriesParMateriel.has(materielId)) {
            categoriesParMateriel.set(materielId, []);
        }

        categoriesParMateriel.get(materielId).push(
            nomCategorie
        );

    });

    const materielsApplication = donnees.materiels.map(function (materiel) {

        let listeCategories =
            categoriesParMateriel.get(String(materiel.id)) || [];

        if (listeCategories.length === 0) {
            listeCategories = [];
        }

        return {
            id: String(materiel.id),
            nom: String(materiel.nom || "Matériel"),
            reference: String(materiel.reference || ""),
            description: String(materiel.description || ""),
            categories: listeCategories,
            stock: Math.max(0, Math.floor(Number(materiel.stock || 0))),
            minimum: Math.max(0, Math.floor(Number(materiel.minimum || 0))),
            emplacement: String(materiel.emplacement || ""),
            photo: ""
        };

    });

    const consommationsParIntervention = new Map();

    donnees.consommations.forEach(function (consommation) {

        const interventionId = String(
            consommation.intervention_id
        );

        if (!consommationsParIntervention.has(interventionId)) {
            consommationsParIntervention.set(
                interventionId,
                []
            );
        }

        consommationsParIntervention.get(interventionId).push({
            materielId: String(consommation.materiel_id),
            materiel: String(consommation.materiel_nom || "Matériel"),
            quantite: Math.max(
                0,
                Number(consommation.quantite || 0)
            )
        });

    });

    const historiqueApplication = donnees.interventions.map(function (intervention) {

        return {
            id: String(intervention.id),
            date: String(intervention.date || ""),
            numeroIntervention: String(intervention.numero || ""),
            createdBy: String(intervention.created_by || ""),
            createdByPrenom: String(intervention.created_by_prenom || ""),
            createdByNom: String(intervention.created_by_nom || ""),
            createdAt: String(intervention.created_at || ""),
            consommations:
                consommationsParIntervention.get(
                    String(intervention.id)
                ) || []
        };

    });

    const archivesApplication =
        (
            Array.isArray(
                donnees.archivesHistorique
            )
                ? donnees.archivesHistorique
                : []
        )
        .map(function (archive) {

            return {
                id: String(
                    archive.id || genererUUID()
                ),
                date: String(
                    archive.date_commande || ""
                ),
                createdAt: String(
                    archive.created_at || ""
                ),
                interventions:
                    Array.isArray(
                        archive.interventions
                    )
                        ? archive.interventions
                        : []
            };

        });


    return {
        categories: donnees.categories
            .map(function (categorie) {
                return String(categorie.nom || "").trim();
            })
            .filter(Boolean),
        materiels: materielsApplication,
        historique: historiqueApplication,
        archivesHistorique: Array.isArray(donnees.archivesHistorique) ? archivesApplication : archivesHistorique
    };

}

async function appliquerDonneesSupabaseLocalement(donnees) {

    if (existeModificationsEnAttente() || (utilisateurConnecte?.id && lireJournalStock().length)) return;

    CISPharmaCategories.recevoir(donnees.categories);

    const application =
        convertirDonneesSupabaseEnDonneesApplication(
            donnees
        );

    // Une liste distante vide est un résultat valide, pas un échec de lecture.
    categories = application.categories;

    materiels = application.materiels;
    historique = application.historique;
    archivesHistorique =
        Array.isArray(application.archivesHistorique)
            ? application.archivesHistorique
            : [];

    normaliserToutesLesDonnees();

    synchronisationSupabaseEnCours = true;

    try {
        localStorage.setItem(
            STORAGE.materiels,
            JSON.stringify(materiels)
        );
        localStorage.setItem(
            STORAGE.categories,
            JSON.stringify(
                categories.map(function (nom, index) {
                    return {
                        id: index + 1,
                        nom: nom
                    };
                })
            )
        );
        localStorage.setItem(
            STORAGE.historique,
            JSON.stringify(historique)
        );
        localStorage.setItem(
            STORAGE.materielsV3,
            JSON.stringify(materiels)
        );
        localStorage.setItem(
            STORAGE.categoriesV3,
            JSON.stringify(categories)
        );
        localStorage.setItem(
            STORAGE.historiqueV3,
            JSON.stringify(historique)
        );
        localStorage.setItem(
            STORAGE.archivesHistorique,
            JSON.stringify(archivesHistorique)
        );
        localStorage.setItem(
            STORAGE.archivesHistoriqueV3,
            JSON.stringify(archivesHistorique)
        );
    } finally {
        synchronisationSupabaseEnCours = false;
    }

    enregistrerSnapshotSynchronisation();

}

function rafraichirAffichageApresSynchronisation() {

    // Inventaire
    if (document.getElementById("inventaire-contenu")) {
        afficherResultatsInventaire();
        return;
    }

    // Gestion du matériel (administration)
    if (document.getElementById("liste-admin")) {
        afficherListeAdmin();
        return;
    }

    // Historique
    if (
        document.getElementById("historique-total") ||
        document.getElementById("historique-interventions")
    ) {
        afficherHistoriqueTotal();
        afficherHistoriqueInterventions();
        return;
    }

    // Retour d'intervention :
    // on actualise les stocks sans effacer les quantités déjà sélectionnées.
    if (document.getElementById("categories-retour")) {
        afficherCategoriesRetour();

        const champRecherche =
            document.getElementById("recherche-retour");

        if (
            champRecherche &&
            String(champRecherche.value || "").trim()
        ) {
            rechercherMaterielRetour();
        }

        mettreAJourResume();
    }

}

function migrerIdentifiantsVersUUID() {

    const correspondanceMateriels = new Map();
    const correspondanceInterventions = new Map();

    materiels.forEach(function (materiel) {

        const ancienId = String(materiel.id);

        if (!estUUID(ancienId)) {
            const nouveauId = genererUUID();
            correspondanceMateriels.set(ancienId, nouveauId);
            materiel.id = nouveauId;
        }

    });

    historique.forEach(function (intervention) {

        const ancienId = String(intervention.id);

        if (!estUUID(ancienId)) {
            const nouveauId = genererUUID();
            correspondanceInterventions.set(ancienId, nouveauId);
            intervention.id = nouveauId;
        }

        intervention.consommations =
            Array.isArray(intervention.consommations)
                ? intervention.consommations.map(function (consommation) {
                    const ancienMaterielId =
                        String(consommation.materielId || "");

                    if (correspondanceMateriels.has(ancienMaterielId)) {
                        consommation.materielId =
                            correspondanceMateriels.get(ancienMaterielId);
                    }

                    return consommation;
                })
                : [];

    });

    let archivesModifiees = false;

    archivesHistorique.forEach(
        function (archive) {

            if (!estUUID(archive.id)) {
                archive.id = genererUUID();
                archivesModifiees = true;
            }

        }
    );


    if (
        correspondanceMateriels.size ||
        correspondanceInterventions.size ||
        archivesModifiees
    ) {
        synchronisationSupabaseEnCours = true;
        try {
            localStorage.setItem(
                STORAGE.materiels,
                JSON.stringify(materiels)
            );
            localStorage.setItem(
                STORAGE.materielsV3,
                JSON.stringify(materiels)
            );
            localStorage.setItem(
                STORAGE.historique,
                JSON.stringify(historique)
            );
            localStorage.setItem(
                STORAGE.historiqueV3,
                JSON.stringify(historique)
            );
            localStorage.setItem(
                STORAGE.archivesHistorique,
                JSON.stringify(archivesHistorique)
            );
            localStorage.setItem(
                STORAGE.archivesHistoriqueV3,
                JSON.stringify(archivesHistorique)
            );
        } finally {
            synchronisationSupabaseEnCours = false;
        }
    }

}

async function envoyerDonneesLocalesVersSupabase() {
    if (typeof appliquerNettoyageAvantSynchronisation === "function") await appliquerNettoyageAvantSynchronisation();

    const supabase = obtenirClientSupabase();

    if (!supabase) {
        return;
    }

    const sessionEnvoi = await obtenirSessionPrincipaleValide(supabase);
    if (String(sessionEnvoi.user?.id || "") !== String(utilisateurConnecte?.id || "")) throw new Error("La session ne correspond pas aux données à envoyer");
    const auteurEnAttente = localStorage.getItem("cis_sync_proprietaire");
    if (existeModificationsEnAttente() && auteurEnAttente && auteurEnAttente !== String(sessionEnvoi.user.id)) throw new Error("Des données d’un autre utilisateur sont en attente sur cet appareil");

    migrerIdentifiantsVersUUID();

    await migrerRetoursVersJournalStock(supabase);
    const ancienSnapshot = lireSnapshotSynchronisation();

    const anciennesCategories = new Set(
        ancienSnapshot.categories.map(function (nom) {
            return String(nom).trim().toLowerCase();
        })
    );

    const categoriesLocales = categories
        .map(function (nom) {
            return String(nom || "").trim();
        })
        .filter(Boolean);

    if (categoriesLocales.length > 0) {

        const lignesCategories =
            categoriesLocales.map(function (nom) {
                return { nom: nom };
            });

        const resultatsCategories = await supabase
            .from("categories")
            .upsert(
                lignesCategories,
                { onConflict: "nom" }
            )
            .select("id,nom");

        if (resultatsCategories.error) {
            throw resultatsCategories.error;
        }

    }

    const { data: categoriesDistantes, error: erreurCategories } =
        await supabase
            .from("categories")
            .select("id,nom");

    if (erreurCategories) {
        throw erreurCategories;
    }

    const categorieIdParNom = new Map();

    (categoriesDistantes || []).forEach(function (categorie) {
        categorieIdParNom.set(
            String(categorie.nom).trim().toLowerCase(),
            String(categorie.id)
        );
    });

    const lignesMateriels = materiels.map(function (materiel) {

        return {
            id: String(materiel.id),
            nom: String(materiel.nom || "Matériel"),
            reference: String(materiel.reference || ""),
            description: String(materiel.description || ""),
            minimum: Math.max(0, Math.floor(Number(materiel.minimum || 0))),
            emplacement: String(materiel.emplacement || ""),
        };

    });

    if (lignesMateriels.length > 0) {
        const idsConnus = new Set(ancienSnapshot.materiels.map(String));
        const nouvelles = lignesMateriels.filter(m => !idsConnus.has(m.id)).map(m => {
            const local = materiels.find(x => String(x.id) === m.id);
            const deltas = lireJournalStock().filter(x => x.materielId === m.id).reduce((n,x) => n+x.delta,0);
            return {...m, stock:Math.max(0, Number(local.stock)-deltas)};
        });
        if (nouvelles.length) {
            const creation = await supabase.from("materiels").upsert(nouvelles, {onConflict:"id", ignoreDuplicates:true});
            if (creation.error) throw creation.error;
        }
        const resultatMateriels = await supabase
            .from("materiels")
            .upsert(lignesMateriels, { onConflict: "id" });

        if (resultatMateriels.error) {
            throw resultatMateriels.error;
        }

    }

    for (const materiel of materiels) {

        const idMateriel = String(materiel.id);

        await supabase
            .from("materiel_categories")
            .delete()
            .eq("materiel_id", idMateriel);

        const relations =
            Array.isArray(materiel.categories)
                ? materiel.categories
                    .map(function (nomCategorie) {
                        return categorieIdParNom.get(
                            String(nomCategorie).trim().toLowerCase()
                        );
                    })
                    .filter(Boolean)
                    .map(function (categorieId) {
                        return {
                            materiel_id: idMateriel,
                            categorie_id: categorieId
                        };
                    })
                : [];

        if (relations.length > 0) {

            const resultatRelations = await supabase
                .from("materiel_categories")
                .upsert(
                    relations,
                    { onConflict: "materiel_id,categorie_id" }
                );

            if (resultatRelations.error) {
                throw resultatRelations.error;
            }

        }

    }

    /*
     * Les archives ne sont pas écrites pendant une synchronisation normale.
     * Elles sont créées uniquement par l'action "Commande effectuée"
     * via la fonction Supabase sécurisée archiver_historique_courant.
     * Cela évite qu'un retour d'intervention soit bloqué par les règles RLS
     * de la table archives_historique.
     */

    const lignesInterventions = historique.map(function (intervention) {

        return {
            id: String(intervention.id),
            date: String(intervention.date || dateAujourdhui()),
            numero: String(intervention.numeroIntervention || ""),
            ...(intervention.createdBy ? { created_by: String(intervention.createdBy) } : {}),
            ...(intervention.createdByPrenom ? { created_by_prenom: String(intervention.createdByPrenom) } : {}),
            ...(intervention.createdByNom ? { created_by_nom: String(intervention.createdByNom) } : {}),
            created_at: String(
                intervention.createdAt ||
                ((intervention.date || dateAujourdhui()) + "T00:00:00.000Z")
            )
        };

    });

    if (lignesInterventions.length > 0) {

        const resultatInterventions = await supabase
            .from("interventions")
            .upsert(lignesInterventions, { onConflict: "id" });

        if (resultatInterventions.error) {
            throw resultatInterventions.error;
        }

    }

    const lignesConsommations = [];

    historique.forEach(function (intervention) {

        (Array.isArray(intervention.consommations)
            ? intervention.consommations
            : []
        ).forEach(function (consommation) {

            if (!estUUID(consommation.materielId)) {
                return;
            }

            lignesConsommations.push({
                intervention_id: String(intervention.id),
                materiel_id: String(consommation.materielId),
                materiel_nom: String(
                    consommation.materiel || "Matériel"
                ),
                quantite: Math.max(
                    1,
                    Math.floor(
                        Number(consommation.quantite || 0)
                    )
                )
            });

        });

    });

    // Les consommations existantes sont conservées. Les nouvelles lignes sont ajoutées.
    // Pour éviter les doublons, nous vérifions les interventions déjà présentes ci-dessous.
    if (lignesConsommations.length > 0) {

        const { data: consommationsExistantes, error: erreurConsommations } =
            await supabase
                .from("consommations")
                .select("intervention_id,materiel_id,quantite");

        if (erreurConsommations) {
            throw erreurConsommations;
        }

        const dejaVues = new Set(
            (consommationsExistantes || []).map(function (ligne) {
                return [
                    ligne.intervention_id,
                    ligne.materiel_id,
                    ligne.quantite
                ].join("|");
            })
        );

        const nouvellesConsommations = lignesConsommations.filter(function (ligne) {
            const cle = [
                ligne.intervention_id,
                ligne.materiel_id,
                ligne.quantite
            ].join("|");

            if (dejaVues.has(cle)) {
                return false;
            }

            dejaVues.add(cle);
            return true;
        });

        if (nouvellesConsommations.length > 0) {

            const resultatConsommations = await supabase
                .from("consommations")
                .upsert(
                    nouvellesConsommations,
                    {
                        onConflict:
                            "intervention_id,materiel_id"
                    }
                );

            if (resultatConsommations.error) {
                throw resultatConsommations.error;
            }

        }

    }

    // Suppressions effectuées depuis ce poste depuis la dernière synchronisation.
    const idsMaterielsActuels = new Set(
        materiels.map(function (materiel) {
            return String(materiel.id);
        })
    );

    const idsMaterielsSupprimes = ancienSnapshot.materiels
        .filter(function (id) {
            return estUUID(id) && !idsMaterielsActuels.has(String(id));
        });

    if (idsMaterielsSupprimes.length > 0) {

        const resultatSuppressionMateriels = await supabase
            .from("materiels")
            .delete()
            .in("id", idsMaterielsSupprimes);

        if (resultatSuppressionMateriels.error) {
            throw resultatSuppressionMateriels.error;
        }

    }

    const idsInterventionsActuels = new Set(
        historique.map(function (intervention) {
            return String(intervention.id);
        })
    );

    const idsInterventionsSupprimes = ancienSnapshot.interventions
        .filter(function (id) {
            return estUUID(id) && !idsInterventionsActuels.has(String(id));
        });

    if (idsInterventionsSupprimes.length > 0) {

        const resultatSuppressionInterventions = await supabase
            .from("interventions")
            .delete()
            .in("id", idsInterventionsSupprimes);

        if (resultatSuppressionInterventions.error) {
            throw resultatSuppressionInterventions.error;
        }

    }

    const nouvellesCategoriesMaj = new Set(
        categoriesLocales.map(function (nom) {
            return String(nom).trim().toLowerCase();
        })
    );

    const categoriesSupprimees = Array.from(anciennesCategories).filter(function (nom) {
        return !nouvellesCategoriesMaj.has(nom);
    });

    for (const ancienNom of categoriesSupprimees) {

        const resultatSuppressionCategorie = await supabase
            .from("categories")
            .delete()
            .eq("nom", ancienNom);

        if (resultatSuppressionCategorie.error) {
            // La suppression peut échouer si la politique distante est plus restrictive.
            console.warn(
                "Suppression catégorie Supabase impossible pour :",
                ancienNom,
                resultatSuppressionCategorie.error
            );
        }

    }

    await synchroniserJournalStock(supabase);
    void envoyerNotificationsStockEnAttente();

    // A failed control stays in its own journal; do not resend old stocks solely
    // because a signature or the control service is temporarily unavailable.
    try { await synchroniserControlesPharmacieEnAttente(); }
    catch (e) { console.warn("Contrôles conservés en attente d’envoi automatique.", e); }
    enregistrerSnapshotSynchronisation();

}

async function synchroniserVersSupabase() {

    if (synchronisationSupabaseEnCours) {
        return;
    }

    const supabase = obtenirClientSupabase();

    if (!supabase || !navigator.onLine) {
        return;
    }

    synchronisationSupabaseEnCours = true;

    try {
        await envoyerDonneesLocalesVersSupabase();
        console.log("✅ Synchronisation Supabase terminée.");
    } catch (erreur) {
        console.warn(
            "⚠️ Synchronisation Supabase échouée. Les données locales sont conservées.",
            erreur
        );
    } finally {
        synchronisationSupabaseEnCours = false;
    }

}

function programmerSynchronisationSupabase() {

    if (!synchronisationSupabaseActive || synchronisationSupabaseEnCours) {
        return;
    }

    if (synchronisationSupabaseProgrammee) {
        return;
    }

    synchronisationSupabaseProgrammee = true;

    setTimeout(async function () {

        synchronisationSupabaseProgrammee = false;
        await synchroniserVersSupabase();

    }, 350);

}

let rechargementSupabaseProgramme = false;

function programmerRechargementDepuisSupabase() {

    if (rechargementSupabaseProgramme) {
        return;
    }

    rechargementSupabaseProgramme = true;

    setTimeout(async function () {

        rechargementSupabaseProgramme = false;

        if (synchronisationSupabaseEnCours || !navigator.onLine) {
            return;
        }

        try {
            const donnees = await recupererDonneesSupabase();

            synchronisationSupabaseEnCours = true;
            try {
                await appliquerDonneesSupabaseLocalement(donnees);
            } finally {
                synchronisationSupabaseEnCours = false;
            }

            console.log("🔄 Données Supabase reçues.");

        } catch (erreur) {

            console.warn(
                "⚠️ Impossible de recharger les données Supabase :",
                erreur
            );

        }

    }, 600);

}

function installerAbonnementTempsReelSupabase() {

    if (!clientSupabase || abonnementSupabase) {
        return;
    }

    try {

        abonnementSupabase = clientSupabase
            .channel("inventaire-caserne-sync")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "materiels" },
                function () {
                    programmerRechargementDepuisSupabase();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "categories" },
                function () {
                    programmerRechargementDepuisSupabase();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "materiel_categories" },
                function () {
                    programmerRechargementDepuisSupabase();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "interventions" },
                function () {
                    programmerRechargementDepuisSupabase();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "consommations" },
                function () {
                    programmerRechargementDepuisSupabase();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "archives_historique" },
                function () {
                    programmerRechargementDepuisSupabase();
                }
            )
            .subscribe(function (statut) {
                console.log("Supabase Realtime :", statut);
            });

    } catch (erreur) {
        console.warn(
            "⚠️ Impossible d'activer Supabase Realtime :",
            erreur
        );
    }

}

async function initialiserSynchronisationSupabase() {

    if (!navigator.onLine) {

        console.log(
            "📴 Hors connexion : utilisation des données locales."
        );

        synchronisationSupabaseActive =
            false;

        return;

    }


    const supabase =
        await assurerBibliothequeSupabaseDisponible();


    if (!supabase) {

        console.log(
            "ℹ️ Supabase n'est pas encore disponible. L'application reste en mode local."
        );

        return;

    }


    try {

        /*
         * IMPORTANT :
         * s'il existe un retour d'intervention enregistré hors connexion,
         * on l'envoie AVANT de télécharger les données de Supabase.
         * Sinon les données distantes pourraient écraser la copie locale
         * avant que le retour hors connexion ait été envoyé.
         */
        if (
            existeModificationsEnAttente()
        ) {

            synchronisationSupabaseEnCours =
                true;

            try {

                await envoyerDonneesLocalesVersSupabase();

                effacerModificationsEnAttente();

            } finally {

                synchronisationSupabaseEnCours =
                    false;

            }

        }


        const donneesDistantes =
            await recupererDonneesSupabase();


        const baseDistanteContientDesDonnees =
            donneesDistantes.materiels.length > 0 ||
            donneesDistantes.interventions.length > 0;


        const baseLocaleContientDesDonnees =
            materiels.length > 0 ||
            historique.length > 0;


        if (
            baseDistanteContientDesDonnees
        ) {

            await appliquerDonneesSupabaseLocalement(
                donneesDistantes
            );

        } else if (
            baseLocaleContientDesDonnees
        ) {

            synchronisationSupabaseEnCours =
                true;

            try {

                await envoyerDonneesLocalesVersSupabase();

            } finally {

                synchronisationSupabaseEnCours =
                    false;

            }

        } else {

            synchronisationSupabaseEnCours =
                true;

            try {

                await envoyerDonneesLocalesVersSupabase();

            } finally {

                synchronisationSupabaseEnCours =
                    false;

            }

        }


        synchronisationSupabaseActive =
            true;

        enregistrerSnapshotSynchronisation();


        console.log(
            "✅ Connexion Supabase opérationnelle."
        );

    } catch (erreur) {

        synchronisationSupabaseActive =
            false;

        /*
         * On NE supprime PAS le marqueur de modification en attente
         * si l'envoi échoue. Le retour hors connexion reste donc
         * conservé localement pour une prochaine tentative.
         */
        console.warn(
            "⚠️ Supabase indisponible. Les données locales en attente sont conservées.",
            erreur
        );

    }

}

// Reprise silencieuse : aucune navigation et aucune remise à zéro des formulaires.
let repriseHorsConnexionEnCours = false;
let prochaineRepriseHorsConnexion = 0;
let echecsRepriseHorsConnexion = 0;
function preparerRepriseHorsConnexion() {
    void preparerMenageHorsConnexion();
    void synchroniserMenagesEnAttente();
    if (connexionPrincipaleIndisponible) void restaurerConnexionPrincipale(true);
    if (navigator.onLine && utilisateurConnecte?.id) {
        void chargerSignaturePharmacie().catch(() => {});
        void synchroniserHorsConnexionAutomatiquement();
    }
}
async function synchroniserHorsConnexionAutomatiquement() {
    if (!navigator.onLine || !utilisateurConnecte?.id || repriseHorsConnexionEnCours ||
        synchronisationSupabaseEnCours || validationRetourInterventionEnCours ||
        Date.now() < prochaineRepriseHorsConnexion) return;
    const proprietaire = String(utilisateurConnecte.id);
    const proprietaireModifications = localStorage.getItem("cis_sync_proprietaire");
    if (existeModificationsEnAttente() && proprietaireModifications && proprietaireModifications !== proprietaire) return;
    // Les anciennes versions n'avaient pas de propriétaire pour ce marqueur.
    if (historique.some(i => i.synchronisationEnAttente && i.createdBy && String(i.createdBy) !== proprietaire)) return;
    if (lireJournalStock().length) marquerModificationsEnAttente();
    void envoyerNotificationsStockEnAttente();
    if (!existeModificationsEnAttente() && !lireControlesPharmacieEnAttente().some(c => c.user_id === proprietaire)) return;
    repriseHorsConnexionEnCours = true;
    synchronisationSupabaseEnCours = true;
    demarrerIndicateurSynchronisation();
    try {
        const sb = await assurerBibliothequeSupabaseDisponible();
        if (!sb) throw new Error("Connexion au serveur indisponible");
        const session = await obtenirSessionPrincipaleValide(sb);
        if (String(session.user?.id || "") !== proprietaire || String(utilisateurConnecte?.id || "") !== proprietaire) {
            throw new Error("La session ne correspond pas aux données en attente");
        }
        if (existeModificationsEnAttente()) {
            await envoyerDonneesLocalesVersSupabase();
            effacerModificationsEnAttente();
            historique.forEach(i => { i.synchronisationEnAttente = false; });
            sauvegarderToutesLesDonnees();
            synchronisationSupabaseActive = true;
        }
        await synchroniserControlesPharmacieEnAttente();
        echecsRepriseHorsConnexion = 0;
        prochaineRepriseHorsConnexion = 0;
        // L'historique peut être mis à jour sans remplacer la page en cours.
        if (document.getElementById("historique-interventions")) {
            afficherHistoriqueTotal();
            afficherHistoriqueInterventions();
        }
    } catch (erreur) {
        echecsRepriseHorsConnexion++;
        prochaineRepriseHorsConnexion = Date.now() + Math.min(60000, 5000 * 2 ** Math.min(echecsRepriseHorsConnexion - 1, 4));
        console.warn("Synchronisation automatique différée ; les données restent sur cet appareil.", erreur);
    } finally {
        synchronisationSupabaseEnCours = false;
        repriseHorsConnexionEnCours = false;
        actualiserStatutControlesPharmacie();
        arreterIndicateurSynchronisation();
    }
}
function reprendreHorsConnexionMaintenant() {
    prochaineRepriseHorsConnexion = 0;
    void synchroniserHorsConnexionAutomatiquement();
}
window.addEventListener("online", reprendreHorsConnexionMaintenant);
window.addEventListener("focus", reprendreHorsConnexionMaintenant);
window.addEventListener("pageshow", reprendreHorsConnexionMaintenant);
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) reprendreHorsConnexionMaintenant();
});
// Retry even when Wi-Fi remains connected during a temporary server/network failure.
setInterval(() => { void synchroniserHorsConnexionAutomatiquement(); }, 5000);


/* =========================================================
   OUTILS
   ========================================================= */

function genererId() {

    /*
     * Tous les identifiants créés par l'application utilisent désormais
     * le même format UUID que les tables Supabase.
     */
    return genererUUID();

}


function echapperHTML(texte) {

    return String(
        texte ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function dateAujourdhui() {

    const date =
        new Date();


    const annee =
        date.getFullYear();


    const mois =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const jour =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        annee +
        "-" +
        mois +
        "-" +
        jour
    );

}


function formaterDate(date) {

    if (!date) {

        return "";

    }


    const parties =
        String(date).split("-");


    if (
        parties.length !== 3
    ) {

        return date;

    }


    return (
        parties[2] +
        "/" +
        parties[1] +
        "/" +
        parties[0]
    );

}


/* =========================================================
   PORTAIL PRINCIPAL
   ========================================================= */

function utilisateurPeutAccederPharmacie() {
    return obtenirOngletsPharmacieAccessibles().length > 0;
}

const CLE_RACCOURCIS_ACCUEIL = "cis_raccourcis_accueil_v1";
function optionsRaccourcisAccueil(){
 const o=[{id:"formations",libelle:"Formation",icone:"▤",action:"CISFormations.ouvrir()"}];
 if(utilisateurAPermission("acces_espace_caserne")){o.push({id:"caserne",libelle:"Espace Caserne",icone:"🏠",action:"afficherEspaceCaserne()"});o.push({id:"agenda",libelle:"Agenda général",icone:"📅",action:"afficherAgendaGeneralCaserne()"});}
 if(utilisateurPeutAccederPharmacie())o.push({id:"pharmacie",libelle:"Espace Pharmacie",icone:"💊",action:"afficherAccueil()"});
 o.push({id:"equipe",libelle:"Espace équipe",icone:"🚒",action:"afficherEspaceGarde()"});
 if(utilisateurAPermission("acces_envoi_mail"))o.push({id:"envoi_mail",libelle:"Envoi par mail",icone:"✉",action:"afficherEnvoiDocumentsEquipe()"});
 for(const x of obtenirOngletsPharmacieAccessibles())o.push({id:"pharma_"+x.libelle.toLowerCase().replace(/[^a-z0-9]+/g,"_"),libelle:x.libelle,icone:x.icone,action:x.action});

 if(utilisateurAPermission("acces_espace_caserne")){
  o.push({id:"annuaire",libelle:"Annuaire du centre",icone:"📇",action:"afficherAnnuaireCentre()"});
  for(const r of obtenirRubriquesCaserne().filter(utilisateurPeutVoirRubriqueCaserne)){const p=obtenirPresentationRubriqueCaserne(r[0]);o.push({id:"caserne_"+r[0],libelle:r[1],icone:p.icone,action:`afficherRubriqueCaserne('${r[0]}')`});}
 }
 o.push({id:"menage",libelle:"Enregistrer un ménage",icone:"🧹",action:"afficherMenageEspaceGarde()"},{id:"vehicules",libelle:"Enregistrer un inventaire véhicule",icone:"🚒",action:"afficherInventaireVehiculeEspaceGarde()"},{id:"planning",libelle:"Planning des gardes",icone:"📅",action:"afficherPlanningEspaceGarde()"},{id:"heures",libelle:"Enregistrer des heures",icone:"⏱️",action:"afficherEnregistrerHeuresEquipe()"});
 if(utilisateurAPermission("acces_admin_menage"))o.push({id:"menage_stock",libelle:"Ménage inventaire",icone:"📦",action:"afficherInventaireMenage()"},{id:"menage_admin",libelle:"Ménage admin",icone:"🧹",action:"afficherAdminMenageEquipe()"},{id:"inventaires_admin",libelle:"Inventaires véhicules enregistrés",icone:"🚒",action:"afficherAdminInventairesEquipe()"});
 if(utilisateurAPermission("acces_admin_heures"))o.push({id:"heures_admin",libelle:"Historique des heures",icone:"⏱️",action:"afficherHistoriqueHeuresEquipe()"});
 if(utilisateurAccesAdministratifCentral())o.push({id:"equipe_admin",libelle:"Administratif",icone:"⚙️",action:"afficherAdministratifCaserne()"});
 o.push({id:'travail_equipe',libelle:'Travail de l’équipe',icone:'✓',action:'CISTravail.ouvrir()'});
 if(utilisateurAPermission("acces_archives"))o.push({id:"pharma_archives",libelle:"Archives pharmacie",icone:"📁",action:"afficherArchivesHistorique()"});
 if(utilisateurAPermission("acces_reapprovisionnement"))o.push({id:"pharma_reappro",libelle:"Réapprovisionnement pharmacie",icone:"📦",action:"afficherReapprovisionnementAdministration()"});
 if(utilisateurPeutExporterPharmaciePDF())o.push({id:"pharma_tracabilite",libelle:"Fiches Meducore et VSAV",icone:"📄",action:"afficherArchivesControlesPharmacie()"});
 o.push({id:"profil",libelle:"Mon profil",icone:"○",action:"ouvrirProfilDepuisPageCourante()"});
 o.push({id:"notifications",libelle:"Mes notifications",icone:"🔔",action:"afficherHistoriqueNotifications()"});
 const actions=new Set();return o.filter(x=>{if(actions.has(x.action))return false;actions.add(x.action);return true;});

}
function lireRaccourcisAccueil(){try{const k=CLE_RACCOURCIS_ACCUEIL+"_"+String(profilUtilisateurConnecte?.id||"");const v=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(v)?[...new Set(v)].filter(id=>optionsRaccourcisAccueil().some(o=>o.id===id)).slice(0,6):[]}catch(_){return []}}
function enregistrerRaccourcisProfil(){
 const cases=[...document.querySelectorAll("[data-raccourci-profil]:checked")];
 if(cases.length>6){alert("Tu peux choisir au maximum 6 raccourcis.");return}
 try{const k=CLE_RACCOURCIS_ACCUEIL+"_"+String(profilUtilisateurConnecte?.id||"");localStorage.setItem(k,JSON.stringify(cases.map(x=>x.value)));alert("Raccourcis enregistrés.")}catch(_){alert("Impossible d’enregistrer les raccourcis.")}
}
function verifierRaccourcisProfil(el){const c=[...document.querySelectorAll("[data-raccourci-profil]:checked")];if(c.length>6){el.checked=false;alert("Tu peux choisir au maximum 6 raccourcis.")}}
function htmlRaccourcisAccueil(){const ids=lireRaccourcisAccueil(),opts=optionsRaccourcisAccueil();const a=ids.map(id=>opts.find(x=>x.id===id)).filter(Boolean);if(!a.length)return "";return `<section class="raccourcis-accueil-rapides">${a.map(x=>`<button type="button" onclick="${x.action}">${x.logo?`<img class="raccourci-logo-appli" src="${echapperHTML(x.logo)}" alt="Logo ${echapperHTML(x.libelle)}">`:`<span>${x.icone}</span>`}<strong>${echapperHTML(x.libelle)}</strong></button>`).join("")}</section>`}

let observationCarteEquipeAccueil=null;
function positionnerCarteEquipeAccueil(){
 observationCarteEquipeAccueil?.disconnect();
 const carte=document.getElementById('carte-garde-accueil'),nav=document.querySelector('.caserne-nav-bas');
 if(!carte||!nav)return;
 const ajuster=()=>{if(!carte.isConnected)return;if(innerWidth<=520){const bas=Math.max(0,innerHeight-nav.getBoundingClientRect().top)+8;carte.style.setProperty('--equipe-accueil-bas',bas+'px');}};
 ajuster();requestAnimationFrame(ajuster);
 if(typeof ResizeObserver!=='undefined'){observationCarteEquipeAccueil=new ResizeObserver(ajuster);observationCarteEquipeAccueil.observe(nav);}
 window.addEventListener('resize',ajuster,{once:true});
}

function afficherPortailPrincipal() {
    if (sessionPrincipaleInvalidee) { afficherConnexion(); return; }
    initialiserStyleConnexion();
    initialiserStyleEspaceCaserne();
    document.body.classList.remove("mode-connexion");
    if (!profilUtilisateurConnecte) { afficherConnexion(); return; }
    appliquerVisibiliteElementsConnectes(true);
    const role = obtenirRoleUtilisateur();
    const peutCaserne = utilisateurAPermission("acces_espace_caserne");
    const peutPharmacie = utilisateurPeutAccederPharmacie();
    document.getElementById("app").innerHTML = `
        <main class="page portail-cis-page navigation-fixe-page">
            <div class="utilisateur-entete"><button class="bouton-profil-accueil" type="button" onclick="ouvrirProfilDepuisPageCourante()"><strong>${echapperHTML(obtenirNomUtilisateurAffiche())}</strong><span>${echapperHTML(role?.nom || "")}</span></button></div>
            <section class="portail-cis-espaces">
                ${peutCaserne ? `<button type="button" class="portail-cis-carte portail-cis-caserne" onclick="afficherEspaceCaserne()"><span class="portail-cis-titre">Espace Caserne</span><span class="portail-cis-fleche">›</span></button>` : ""}
                ${peutPharmacie ? `<button type="button" class="portail-cis-carte portail-cis-pharmacie" onclick="afficherAccueil()"><span class="portail-cis-titre">Espace Pharmacie</span><span class="portail-cis-fleche">›</span></button>` : ""}
            </section>
            ${htmlRaccourcisAccueil()}
            <section id="carte-garde-accueil" class="garde-accueil-zone">
                ${cacheCarteGardeAccueilHTML || `<div class="garde-accueil-carte sans-garde" role="button" tabindex="0" onclick="afficherEspaceGarde()"><small>ÉQUIPE</small><strong>ESPACE ÉQUIPE</strong></div>`}
            </section>
        </main>${navigationPrincipale("accueil", "accueil")}`;
    actualiserInterfaceBureau();
    void actualiserCarteGardeAccueil();
    positionnerCarteEquipeAccueil();
}


async function synchroniserCaserneAvantNavigation() {
    /*
     * L'Espace Caserne charge déjà ses propres données directement depuis
     * Supabase. On évite donc ici la synchronisation complète de la Pharmacie,
     * qui ralentissait inutilement chaque changement de rubrique.
     */
    if (!navigator.onLine) return;

    try {
        const supabase = obtenirClientSupabase();
        if (supabase) {
            await obtenirSessionPrincipaleValide(supabase);
        }
    } catch (erreur) {
        console.warn("Vérification session Caserne :", erreur);
    }
}

async function afficherEspaceCaserne() {

    if (!utilisateurAPermission("acces_espace_caserne")) {
        alert("Tu n'as pas accès à l'Espace Caserne.");
        afficherPortailPrincipal();
        return;
    }

    initialiserStyleEspaceCaserne();
    await synchroniserCaserneAvantNavigation();
    await afficherActualitesCaserne(true);
}

function obtenirRubriquesCaserne() {
    return [
        ["sport", "Sport", "acces_sport", "acces_sport_admin"],
        ["manoeuvre", "Manœuvre", "acces_manoeuvre", "acces_manoeuvre_admin"],
        ["casernement", "Casernement", "acces_casernement", "acces_casernement_admin"],
        ["reunion", "Réunion", "acces_reunion", "acces_reunion_admin"],
        ["amical", "Amical", "acces_amical_public", "acces_amical_admin"],
        ["comite_centre", "Comité de centre", "acces_comite_centre", "acces_comite_centre_admin"],
        ["administratif", "Administratif", "acces_administratif", "acces_administratif_admin"],
        ["entretien_individuel", "Entretien individuel", "acces_entretien_individuel", "acces_entretien_individuel_admin"]
    ];
}

function utilisateurPeutVoirRubriqueCaserne(rubrique) {
    if (!utilisateurAPermission("acces_espace_caserne")) return false;
    if (rubrique[0] === "amical" && utilisateurAPermission("acces_amical_membre")) return true;
    return utilisateurAPermission(rubrique[2]) || utilisateurAPermission(rubrique[3]);
}

function navigationPrincipale(active, theme = "caserne") {
    const classeTheme = theme === "pharmacie" ? "nav-theme-pharmacie" : theme === "accueil" ? "nav-theme-accueil" : "nav-theme-caserne";
    const actionMenu = theme === "caserne" ? "ouvrirMenuCaserne()" : theme === "pharmacie" ? "ouvrirMenuPharmacie()" : "ouvrirMenuPrincipal()";
    const peutCaserne = utilisateurAPermission("acces_espace_caserne");
    const peutPharmacie = utilisateurPeutAccederPharmacie();
    return `<nav class="caserne-nav-bas ${classeTheme}">
        <button onclick="afficherPortailPrincipal()" class="${active === "accueil" ? "actif" : ""}"><span>⌂</span>Accueil</button>
        ${peutCaserne ? `<button onclick="afficherEspaceCaserne()" class="${active === "caserne" ? "actif" : ""}"><span>▣</span>Caserne</button>` : ""}
        ${peutPharmacie ? `<button onclick="afficherAccueil()" class="${active === "pharmacie" ? "actif" : ""}"><span>✚</span>Pharmacie</button>` : ""}
        <button onclick="ouvrirProfilDepuisPageCourante()" class="${active === "profil" ? "actif" : ""}"><span>○</span>Profil</button>
        <button onclick="${actionMenu}" class="caserne-menu-bulle" aria-label="Menu"><span>☰</span></button></nav>`;
}


function navigationCaserne(active) {
    return navigationPrincipale(active, "caserne");
}

function obtenirOngletsPharmacieAccessibles() {
    const onglets = [];

    if (utilisateurAPermission("acces_inventaire")) {
        onglets.push({
            libelle: "Inventaire",
            aide: "Consulter le matériel disponible",
            icone: "📦",
            action: "afficherInventaire()"
        });
    }

    if (utilisateurAPermission("acces_retour_intervention")) {
        onglets.push({
            libelle: "Retour d'intervention",
            aide: "Déclarer le matériel utilisé",
            icone: "🚒",
            action: "afficherRetourIntervention()"
        });
    }

    if (utilisateurAPermission("acces_historique")) {
        onglets.push({
            libelle: "Historique",
            aide: "Voir les mouvements et consommations",
            icone: "📊",
            action: "afficherHistorique()"
        });
    }

    if (utilisateurAPermission("acces_administration")) {
        onglets.push({
            libelle: "Administration pharmacie",
            aide: "Gérer le matériel et les réglages autorisés",
            icone: "⚙️",
            action: "ouvrirAdministration()"
        });
    }


    return onglets;
}

function carteMenuNavigationSimple(onglet) {
    return `<button type="button" onclick="${onglet.action}">
        <span class="caserne-menu-icone" aria-hidden="true">${onglet.icone}</span>
        <span class="caserne-menu-texte"><strong>${echapperHTML(onglet.libelle)}</strong><small>${echapperHTML(onglet.aide || "")}</small></span>
        <span class="caserne-menu-fleche" aria-hidden="true">›</span>
    </button>`;
}

function obtenirSectionsMenuGlobal() {
    const caserne = [];
    if (utilisateurAPermission("acces_espace_caserne")) {
        
        caserne.push({libelle:"Fil d'actualité Caserne", aide:"Informations récentes", icone:"▤", action:"afficherEspaceCaserne()"});
        caserne.push({libelle:"Annuaire du centre", aide:"Coordonnées des personnels", icone:"📇", action:"afficherAnnuaireCentre()"});
        for (const rubrique of obtenirRubriquesCaserne().filter(utilisateurPeutVoirRubriqueCaserne)) {
            const presentation = obtenirPresentationRubriqueCaserne(rubrique[0]);
            caserne.push({libelle:rubrique[1], aide:presentation.aide, icone:presentation.icone, action:`afficherRubriqueCaserne('${rubrique[0]}')`});
        }
    }
    const pharmacie = utilisateurPeutAccederPharmacie() ? obtenirOngletsPharmacieAccessibles() : [];
    const sections = [
        {titre:"Caserne", onglets:caserne},
        {titre:"Pharmacie", onglets:pharmacie},
        {titre:"Compte", onglets:[{libelle:"Mon profil", aide:"Compte et préférences", icone:"○", action:"ouvrirProfilDepuisPageCourante()"}]}
    ];
    return sections.filter(section => section.onglets.length).map(section => `
        <div class="menu-navigation-section-titre">${section.titre}</div>
        <section class="caserne-menu-liste-simple">${section.onglets.map(carteMenuNavigationSimple).join("")}</section>
    `).join("");
}

function carteMenuNavigationSimple(onglet) {
    return `<button type="button" onclick="${onglet.action}">
        <span class="caserne-menu-icone" aria-hidden="true">${onglet.icone}</span>
        <span class="caserne-menu-texte"><strong>${echapperHTML(onglet.libelle)}</strong><small>${echapperHTML(onglet.aide || "")}</small></span>
        <span class="caserne-menu-fleche" aria-hidden="true">›</span>
    </button>`;
}

function afficherMenuGlobal(theme) {
    const options = {
        accueil:{classe:"menu-navigation-principal", entete:"menu-top-principal", petit:"CIS LE CHESNE", retour:"Retour à l'accueil", action:"afficherPortailPrincipal()", actif:"accueil"},
        pharmacie:{classe:"menu-navigation-pharmacie", entete:"menu-top-pharmacie", petit:"ESPACE PHARMACIE", retour:"Retour à la pharmacie", action:"afficherAccueil()", actif:"pharmacie"},
        caserne:{classe:"menu-navigation-caserne", entete:"menu-top-caserne", petit:"ESPACE CASERNE", retour:"Retour aux actualités", action:"afficherActualitesCaserne()", actif:"caserne"}
    };
    const option = options[theme] || options.accueil;
    if (document.querySelector(`.caserne-menu-page.${option.classe}`)) {
        if (theme === "caserne") afficherActualitesCaserne();
        else if (theme === "pharmacie") afficherAccueil();
        else afficherPortailPrincipal();
        return;
    }
    initialiserStyleEspaceCaserne();
    document.getElementById("app").innerHTML = `
        <main class="page caserne-shell caserne-menu-page caserne-public-simple navigation-fixe-page ${option.classe}">
            <header class="caserne-top caserne-top-simple ${option.entete}">
                <small>${option.petit}</small><h1>Menu</h1>
            </header>
            <button type="button" class="caserne-retour-actualites" onclick="${option.action}">← ${option.retour}</button>
            ${obtenirSectionsMenuGlobal()}
        </main>
        ${navigationPrincipale(option.actif, theme)}`;
    actualiserInterfaceBureau();
    synchroniserApparencePWACaserne();
    window.scrollTo({top:0,behavior:"auto"});
}

function ouvrirMenuPharmacie() { afficherMenuGlobal("pharmacie"); }
function ouvrirMenuPrincipal() { afficherMenuGlobal("accueil"); }

function obtenirPresentationRubriqueCaserne(type) {
    return ({
        sport: {icone:"🏃", aide:"Séances de sport et informations associées"},
        manoeuvre: {icone:"🚒", aide:"Manœuvres, exercices et préparations"},
        casernement: {icone:"🏠", aide:"Informations pratiques de la caserne"},
        reunion: {icone:"👥", aide:"Réunions et convocations"},
        amical: {icone:"🤝", aide:"Actualités et événements de l’Amicale"},
        comite_centre: {icone:"📋", aide:"Informations du comité de centre"},
        administratif: {icone:"⚙️", aide:"Outils administratifs autorisés"},
        entretien_individuel: {icone:"🗓️", aide:"Choisir ou consulter ton rendez-vous"}
    })[type] || {icone:"•", aide:"Ouvrir cette rubrique"};
}

function ouvrirMenuCaserne() { afficherMenuGlobal("caserne"); }


function initialiserStyleAnnuaireCentre() {
    if (document.getElementById("style-annuaire-centre-v23")) return;
    const style = document.createElement("style");
    style.id = "style-annuaire-centre-v23";
    style.textContent = `
      .annuaire-centre-liste{display:grid;gap:10px;margin-top:14px}
      .annuaire-centre-personne{width:100%;border:1px solid #eadbd7;background:#fff;border-radius:16px;padding:15px 16px;text-align:left;display:flex;align-items:center;gap:12px;box-shadow:0 3px 12px rgba(70,35,30,.06);cursor:pointer;color:#2b1716}
      .annuaire-centre-avatar{width:44px;height:44px;border-radius:50%;background:#f1e4e1;display:grid;place-items:center;font-weight:900;font-size:17px;flex:0 0 auto}
      .annuaire-centre-personne strong{display:block;font-size:16px}.annuaire-centre-personne small{display:block;margin-top:3px;color:#7d6965}.annuaire-centre-personne .fleche{margin-left:auto;font-size:24px;color:#a68d87}
      .annuaire-centre-fiche{background:#fff;border:1px solid #eadbd7;border-radius:18px;padding:18px;margin-top:14px;box-shadow:0 4px 16px rgba(70,35,30,.07)}
      .annuaire-centre-fiche h2{margin:0 0 16px;font-size:23px}.annuaire-centre-info{padding:12px 0;border-bottom:1px solid #eee4e1}.annuaire-centre-info:last-of-type{border-bottom:0}
      .annuaire-centre-info small{display:block;color:#806e69;font-weight:800;text-transform:uppercase;font-size:10px;letter-spacing:.07em;margin-bottom:4px}.annuaire-centre-info strong,.annuaire-centre-info a{font-size:16px;color:#2b1716;text-decoration:none;overflow-wrap:anywhere}
      .annuaire-centre-appeler{width:100%;border:0;border-radius:14px;background:#197348;color:#fff;font-weight:900;font-size:16px;padding:15px;margin-top:18px;cursor:pointer}
      .annuaire-centre-recherche{width:100%;box-sizing:border-box;border:1px solid #d9cbc7;border-radius:14px;padding:13px 14px;font:inherit;background:#fff;color:#2b1716;margin-top:8px}
    `;
    document.head.appendChild(style);
}

let annuaireCentreUtilisateurs = [];

async function chargerAnnuaireCentre() {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) throw new Error("Connexion internet nécessaire pour charger l’annuaire.");
    const {data, error} = await supabase.rpc("lister_annuaire_centre");
    if (error) throw error;
    return (data || []).filter(u => u.actif !== false).sort((a,b) =>
        `${a.nom || ""} ${a.prenom || ""}`.localeCompare(`${b.nom || ""} ${b.prenom || ""}`, "fr", {sensitivity:"base"})
    );
}

function initialesAnnuaire(u) {
    return `${String(u.prenom || "").trim().charAt(0)}${String(u.nom || "").trim().charAt(0)}`.toUpperCase() || "?";
}

function rendreListeAnnuaireCentre(filtre = "") {
    const zone = document.getElementById("annuaire-centre-liste");
    if (!zone) return;
    const q = String(filtre || "").trim().toLocaleLowerCase("fr");
    const liste = annuaireCentreUtilisateurs.filter(u => !q || `${u.prenom || ""} ${u.nom || ""}`.toLocaleLowerCase("fr").includes(q));
    zone.innerHTML = liste.length ? liste.map(u => `
      <button type="button" class="annuaire-centre-personne" onclick="afficherFicheAnnuaireCentre('${echapperHTML(String(u.id))}')">
        <span class="annuaire-centre-avatar">${echapperHTML(initialesAnnuaire(u))}</span>
        <span><strong>${echapperHTML([u.prenom,u.nom].filter(Boolean).join(" ") || "Utilisateur")}</strong><small>Voir les coordonnées</small></span><span class="fleche">›</span>
      </button>`).join("") : '<div class="caserne-vide"><strong>Aucun utilisateur trouvé</strong></div>';
}

async function afficherAnnuaireCentre() {
    if (!utilisateurAPermission("acces_espace_caserne")) { alert("Tu n’as pas accès à l’Espace Caserne."); return; }
    initialiserStyleEspaceCaserne(); initialiserStyleAnnuaireCentre();
    document.getElementById("app").innerHTML = `
      <main class="page caserne-shell caserne-public-simple navigation-fixe-page">
        <header class="caserne-top caserne-top-simple"><small>ESPACE CASERNE</small><h1>Annuaire du centre</h1></header>
        <button type="button" class="caserne-retour-actualites" onclick="afficherActualitesCaserne()">← Retour aux actualités</button>
        <input class="annuaire-centre-recherche" type="search" placeholder="Rechercher un nom…" oninput="rendreListeAnnuaireCentre(this.value)">
        <section id="annuaire-centre-liste" class="annuaire-centre-liste"><div class="caserne-vide"><strong>Chargement…</strong></div></section>
      </main>${navigationCaserne("caserne")}`;
    actualiserInterfaceBureau(); window.scrollTo({top:0,behavior:"auto"});
    try { annuaireCentreUtilisateurs = await chargerAnnuaireCentre(); rendreListeAnnuaireCentre(); }
    catch (e) { const z=document.getElementById("annuaire-centre-liste"); if(z) z.innerHTML=`<div class="caserne-vide"><strong>Annuaire indisponible</strong><p>${echapperHTML(e?.message || "Chargement impossible.")}</p></div>`; }
}

function afficherFicheAnnuaireCentre(id) {
    const u = annuaireCentreUtilisateurs.find(x => String(x.id) === String(id)); if (!u) return;
    const nom = [u.prenom,u.nom].filter(Boolean).join(" ") || "Utilisateur";
    const tel = String(u.telephone || "").trim(); const email = String(u.email_contact || "").trim(); const adresse = String(u.adresse || "").trim();
    const telLien = tel.replace(/[^+0-9]/g, "");
    document.getElementById("app").innerHTML = `
      <main class="page caserne-shell caserne-public-simple navigation-fixe-page">
        <header class="caserne-top caserne-top-simple"><small>ANNUAIRE DU CENTRE</small><h1>Profil</h1></header>
        <button type="button" class="caserne-retour-actualites" onclick="afficherAnnuaireCentre()">← Retour à l’annuaire</button>
        <section class="annuaire-centre-fiche">
          <h2>${echapperHTML(nom)}</h2>
          <div class="annuaire-centre-info"><small>Prénom</small><strong>${echapperHTML(u.prenom || "Non renseigné")}</strong></div>
          <div class="annuaire-centre-info"><small>Nom</small><strong>${echapperHTML(u.nom || "Non renseigné")}</strong></div>
          <div class="annuaire-centre-info"><small>Adresse</small><strong>${echapperHTML(adresse || "Non renseignée")}</strong></div>
          <div class="annuaire-centre-info"><small>Adresse mail</small>${email ? `<a href="mailto:${echapperHTML(email)}">${echapperHTML(email)}</a>` : '<strong>Non renseignée</strong>'}</div>
          <div class="annuaire-centre-info"><small>Numéro de téléphone</small>${tel ? `<a href="tel:${echapperHTML(telLien)}">${echapperHTML(tel)}</a>` : '<strong>Non renseigné</strong>'}</div>
          ${tel ? `<button type="button" class="annuaire-centre-appeler" onclick="window.location.href='tel:${echapperHTML(telLien)}'">Appeler</button>` : ""}
        </section>
      </main>${navigationCaserne("caserne")}`;
    actualiserInterfaceBureau(); window.scrollTo({top:0,behavior:"auto"});
}
window.afficherAnnuaireCentre=afficherAnnuaireCentre;
window.afficherFicheAnnuaireCentre=afficherFicheAnnuaireCentre;
window.rendreListeAnnuaireCentre=rendreListeAnnuaireCentre;

function formaterDateHeureCaserne(valeur) {
    if (!valeur) return "Date à définir";
    const d = new Date(valeur);
    if (Number.isNaN(d.getTime())) return String(valeur);
    return d.toLocaleString("fr-FR", {day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit"});
}


function formaterDateICSCalendrierCaserne(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function echapperTexteICSCalendrierCaserne(texte) {
    return String(texte ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/\r?\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
}

function nomFichierCalendrierCaserne(titre) {
    const base = String(titre || "evenement-cis-le-chesne")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
    return (base || "evenement-cis-le-chesne") + ".ics";
}

function ajouterEvenementCalendrierCaserne(titre, dateDebut, description = "", dureeMinutes = 60) {
    const debut = new Date(dateDebut);
    if (Number.isNaN(debut.getTime())) {
        alert("La date de cet événement n'est pas disponible.");
        return;
    }
    const duree = Math.max(1, Number(dureeMinutes) || 60);
    const fin = new Date(debut.getTime() + duree * 60000);
    const maintenant = formaterDateICSCalendrierCaserne(new Date());
    const uid = `${debut.getTime()}-${Math.random().toString(36).slice(2)}@cis-le-chesne`;
    const contenu = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//CIS Le Chesne//Espace Caserne//FR",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${maintenant}`,
        `DTSTART:${formaterDateICSCalendrierCaserne(debut)}`,
        `DTEND:${formaterDateICSCalendrierCaserne(fin)}`,
        `SUMMARY:${echapperTexteICSCalendrierCaserne(titre || "Événement CIS Le Chesne")}`,
        `DESCRIPTION:${echapperTexteICSCalendrierCaserne(description || "CIS Le Chesne")}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([contenu], {type:"text/calendar;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichierCalendrierCaserne(titre);
    lien.rel = "noopener";
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function boutonCalendrierCaserne(titre, date, description = "", dureeMinutes = 60, libelle = "Ajouter au calendrier") {
    if (!date || Number.isNaN(new Date(date).getTime())) return "";
    const code = `ajouterEvenementCalendrierCaserne(${JSON.stringify(titre || "Événement CIS Le Chesne")},${JSON.stringify(date)},${JSON.stringify(description || "")},${Number(dureeMinutes) || 60})`;
    return `<button type="button" class="caserne-bouton-calendrier" onclick="${echapperHTML(code)}">${echapperHTML(libelle)}</button>`;
}


/* =========================================================
   EXPORTS PDF ADMINISTRATIFS
   Evenements Caserne / Entretiens / Commandes Pharmacie
   ========================================================= */

let promesseBibliothequesPDF = null;

function chargerScriptExternePDF(src, id) {
    return new Promise(function(resolve, reject) {
        if (id && document.getElementById(id)) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        if (id) script.id = id;
        script.src = src;
        script.async = true;
        script.onload = function() { resolve(); };
        script.onerror = function() { reject(new Error("Impossible de charger le module PDF.")); };
        document.head.appendChild(script);
    });
}

async function obtenirBibliothequesPDF() {
    if (window.jspdf?.jsPDF && typeof window.jspdf.jsPDF === "function") {
        const test = new window.jspdf.jsPDF();
        if (typeof test.autoTable === "function") return window.jspdf.jsPDF;
    }

    if (!navigator.onLine) {
        throw new Error("Une connexion Internet est nécessaire lors du premier export PDF.");
    }

    if (!promesseBibliothequesPDF) {
        promesseBibliothequesPDF = (async function() {
            if (!window.jspdf?.jsPDF) {
                await chargerScriptExternePDF(
                    "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js",
                    "cis-jspdf"
                );
            }
            if (!window.jspdf?.jsPDF) throw new Error("Le moteur PDF n'a pas pu être chargé.");

            const test = new window.jspdf.jsPDF();
            if (typeof test.autoTable !== "function") {
                await chargerScriptExternePDF(
                    "https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js",
                    "cis-jspdf-autotable"
                );
            }
            return window.jspdf.jsPDF;
        })().catch(function(erreur) {
            promesseBibliothequesPDF = null;
            throw erreur;
        });
    }

    return promesseBibliothequesPDF;
}

function texteCompatiblePDF(valeur) {
    return String(valeur ?? "")
        .replaceAll("œ", "oe")
        .replaceAll("Œ", "OE")
        .replace(/[’‘]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[–—]/g, "-")
        .replace(/…/g, "...")
        .replace(/\u00a0/g, " ");
}

function nomFichierPDF(valeur) {
    const base = texteCompatiblePDF(valeur || "document")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
    return (base || "document") + ".pdf";
}

function couleurPDF() {
    return {
        principal: [125, 36, 37],
        sombre: [73, 22, 23],
        clair: [247, 239, 237],
        texte: [43, 23, 22],
        gris: [108, 99, 96],
        ligne: [225, 211, 207],
        blanc: [255, 255, 255]
    };
}

function ajouterEntetePDF(doc, titre, sousTitre = "") {
    const c = couleurPDF();
    const largeur = doc.internal.pageSize.getWidth();
    doc.setFillColor(...c.principal);
    doc.rect(0, 0, largeur, 31, "F");
    doc.setTextColor(...c.blanc);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CIS LE CHESNE", 14, 10);
    doc.setFontSize(18);
    doc.text(texteCompatiblePDF(titre), 14, 20);
    if (sousTitre) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(texteCompatiblePDF(sousTitre), 14, 26);
    }
    return 39;
}

function ajouterPiedDePagePDF(doc) {
    const pages = doc.getNumberOfPages();
    const c = couleurPDF();
    const dateEdition = new Date().toLocaleString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
    for (let page = 1; page <= pages; page++) {
        doc.setPage(page);
        const largeur = doc.internal.pageSize.getWidth();
        const hauteur = doc.internal.pageSize.getHeight();
        doc.setDrawColor(...c.ligne);
        doc.line(14, hauteur - 12, largeur - 14, hauteur - 12);
        doc.setTextColor(...c.gris);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.text("Document administratif - CIS Le Chesne", 14, hauteur - 7);
        doc.text(texteCompatiblePDF(`Edite le ${dateEdition}`), largeur / 2, hauteur - 7, {align:"center"});
        doc.text(`${page} / ${pages}`, largeur - 14, hauteur - 7, {align:"right"});
    }
}

function afficherErreurExportPDF(erreur) {
    console.error("Export PDF :", erreur);
    alert("Impossible de creer le PDF : " + (erreur?.message || "erreur inconnue"));
}

function estMacBureauExport(){return /Macintosh|Mac OS X/i.test(navigator.userAgent||'')&&!partageMobileExportPrincipal();}
function texteResultatExportPrincipal(resultat){
 return ({enregistre:'Document enregistré.',annule:'Enregistrement annulé.',partage:'Options d’enregistrement ouvertes.',navigateur:'Document transmis au navigateur.'})[resultat]||'';
}

async function ecrireDocumentPrincipal(blob,nom){
 const extension='.'+(nom.split('.').pop()||'pdf').toLowerCase();
 const mime=({'application/pdf':'application/pdf','image/png':'image/png','text/csv':'text/csv'})[blob.type.split(';')[0]]||'application/octet-stream';
 const handle=await window.showSaveFilePicker({id:'cis-principal-exports',suggestedName:nom,types:[{description:extension.slice(1).toUpperCase(),accept:{[mime]:[extension]}}]});
 const flux=await handle.createWritable();
 try{await flux.write(blob);await flux.close();}
 catch(erreur){try{await flux.abort();}catch(_){}throw erreur;}
 return 'enregistre';
}

function partageMobileExportPrincipal(){const ua=navigator.userAgent||'';return /iPhone|iPad|iPod|Android/i.test(ua)||(/Macintosh/i.test(ua)&&Number(navigator.maxTouchPoints)>1);}
function choisirEnregistrementDocumentPrincipal(blob,nom){
 return new Promise(resolve=>{
  const precedent=document.activeElement;
  const fond=document.createElement('div');fond.id='principal-enregistrer-document';
  fond.style.cssText='position:fixed;inset:0;background:#0007;z-index:1000000;display:flex;align-items:center;justify-content:center;padding:16px';
  fond.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="principal-save-title" style="box-sizing:border-box;width:440px;max-width:100%;background:#fff;color:#20272b;border:1px solid #dce1e6;border-radius:20px;padding:24px;font:inherit;box-shadow:0 18px 60px #0003"><header style="display:flex;align-items:center;gap:12px"><h2 id="principal-save-title" style="flex:1;margin:0;font-size:22px">Enregistrer le document</h2><button type="button" data-save-close aria-label="Fermer" style="border:0;background:transparent;color:#52616b;font-size:26px;padding:8px">×</button></header><div><p>Le document est prêt.</p><label for="principal-save-name">Nom du fichier</label><input id="principal-save-name" style="box-sizing:border-box;display:block;width:100%;margin:8px 0 16px;padding:12px;border:1px solid #cbd5df;border-radius:10px;background:white;color:#20272b;font:inherit;font-size:16px" maxlength="180"><p data-save-help style="line-height:1.5;color:#52616b"></p><p data-save-status role="status" style="color:#a12129;line-height:1.5"></p><div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap"><button type="button" data-save-cancel style="padding:12px 18px;border:1px solid #cbd5df;border-radius:10px;background:#fff;color:#20272b;font:inherit">Annuler</button><button type="button" data-save-confirm style="padding:12px 18px;border:0;border-radius:10px;background:#20734b;color:#fff;font:inherit;font-weight:700">Enregistrer</button></div></div></section>';
  document.body.appendChild(fond);
  const input=fond.querySelector('input'),bouton=fond.querySelector('[data-save-confirm]'),statut=fond.querySelector('[data-save-status]');input.value=nom;
  const natif=typeof window.showSaveFilePicker==='function';
  const peutPartager=nomFichier=>{if(!partageMobileExportPrincipal()||typeof navigator.share!=='function'||typeof navigator.canShare!=='function')return false;try{return navigator.canShare({files:[new File([blob],nomFichier,{type:blob.type})]});}catch(_){return false;}};
  fond.querySelector('[data-save-help]').textContent=natif?'':peutPartager(nom)?'Dans le menu de partage, choisissez « Enregistrer dans Fichiers ».':/Macintosh|Mac OS X/i.test(navigator.userAgent||'')?'Le fichier sera téléchargé sur ton Mac. Pour choisir le dossier à chaque fois dans Safari : Safari > Réglages > Général > Emplacement de téléchargement des fichiers > Demander pour chaque téléchargement.':'Le fichier sera téléchargé. Le choix du dossier dépend des réglages de téléchargement de ton navigateur.';
  let occupe=false;
  function fermer(resultat){document.removeEventListener('keydown',touche,true);fond.remove();precedent?.focus?.();resolve(resultat);}
  function annuler(){if(!occupe)fermer('annule');}
  function touche(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();annuler();}if(e.key==='Tab'){const elements=[...fond.querySelectorAll('button,input')].filter(el=>!el.disabled),premier=elements[0],dernier=elements[elements.length-1];if(e.shiftKey&&document.activeElement===premier){e.preventDefault();dernier.focus();}else if(!e.shiftKey&&document.activeElement===dernier){e.preventDefault();premier.focus();}}}
  document.addEventListener('keydown',touche,true);
  fond.querySelector('[data-save-close]').onclick=annuler;fond.querySelector('[data-save-cancel]').onclick=annuler;
  bouton.onclick=async()=>{
   if(occupe)return;
   let choix=input.value.trim().replace(/[\\/:*?"<>|]/g,'-');if(!choix){statut.textContent='Indiquez un nom de fichier.';return;}
   const extension=nom.slice(nom.lastIndexOf('.'));if(!choix.toLowerCase().endsWith(extension.toLowerCase()))choix+=extension;
   occupe=true;input.disabled=true;bouton.disabled=true;statut.textContent='';
   try{
    if(natif){await ecrireDocumentPrincipal(blob,choix);fermer('enregistre');}
    else if(peutPartager(choix)){await navigator.share({files:[new File([blob],choix,{type:blob.type})],title:choix});fermer('partage');}
    else{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=choix;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);fermer('navigateur');}
   }catch(erreur){if(erreur?.name==='AbortError'){fermer('annule');}else statut.textContent=erreur?.message||'Enregistrement impossible. Réessayez.';}
   finally{occupe=false;input.disabled=false;bouton.disabled=false;}
  };
  bouton.focus();
 });
}

let enregistrementDocumentPrincipalEnCours=false;
async function enregistrerDocumentPrincipal(blob,nom){
 if(enregistrementDocumentPrincipalEnCours)throw new Error('Terminez l’enregistrement du document en cours.');
 enregistrementDocumentPrincipalEnCours=true;
 try{
  if(typeof window.showSaveFilePicker==='function'&&navigator.userActivation?.isActive!==false){
   try{return await ecrireDocumentPrincipal(blob,nom);}
   catch(erreur){if(erreur?.name==='AbortError')return 'annule';if(erreur?.name!=='SecurityError')throw erreur;}
  }
  // Un nouveau clic garde le sélecteur utilisable après une génération longue.
  return await choisirEnregistrementDocumentPrincipal(blob,nom);
 }finally{enregistrementDocumentPrincipalEnCours=false;}
}
window.enregistrerDocumentPrincipal=enregistrerDocumentPrincipal;


async function enregistrerPDFSansApercuNavigateur(doc, nomFichier) {
    if(estMacBureauExport())return enregistrerDocumentPrincipal(doc.output('blob'),nomFichier);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);

    // Ouvre maintenant le PDF en prévisualisation dans le navigateur
    // au lieu de lancer directement son téléchargement ou son partage.
    const fenetrePDF = window.open(url, "_blank");

    if (!fenetrePDF) {
        // Solution de secours si le navigateur bloque l'ouverture du nouvel onglet.
        window.location.href = url;
        return;
    }

    // On laisse suffisamment de temps au navigateur pour charger le PDF.
    setTimeout(() => URL.revokeObjectURL(url), 120000);
}

function iconePDFHTML() {
    return `<svg viewBox="0 0 30 30" width="30" height="30" aria-hidden="true" focusable="false">
        <path d="M6 2.75h11L24 9.75V27.25H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M17 2.75v7h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <rect x="7.5" y="15" width="15" height="7.2" rx="1.4" fill="currentColor"/>
        <text x="15" y="20.25" text-anchor="middle" font-size="5.2" font-weight="800" font-family="Arial, Helvetica, sans-serif" fill="white">PDF</text>
    </svg>`;
}

async function exporterPublicationCasernePDF(publicationId, modeMail=false) {
    const publication = window.__publicationsCaserneParId?.[publicationId];
    if (!publication) {
        alert("Publication introuvable.");
        return;
    }

    const rubrique = obtenirRubriquesCaserne().find(r => r[0] === publication.type_publication);
    const estAdmin = utilisateurEstSPVAdmin() || (rubrique && utilisateurAPermission(rubrique[3]));
    if (!estAdmin) {
        alert("Export PDF reserve aux administrateurs.");
        return;
    }

    try {
        const jsPDF = await obtenirBibliothequesPDF();
        const doc = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
        const c = couleurPDF();
        const type = obtenirLibelleTypeCaserne(publication.type_publication);
        const titre = publication.titre || obtenirConfigurationPublicationCaserne(publication.type_publication).titre;
        let y = ajouterEntetePDF(doc, "FICHE EVENEMENT", `${type} - document de suivi`);

        doc.setTextColor(...c.texte);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        const titreLignes = doc.splitTextToSize(texteCompatiblePDF(titre), 180);
        doc.text(titreLignes, 14, y);
        y += titreLignes.length * 6 + 2;

        const infos = [];
        if (publication.date_evenement) infos.push(["Date de l'evenement", formaterDateHeureCaserne(publication.date_evenement)]);
        infos.push(["Type", type]);
        if (publication.sous_type) infos.push(["Sous-type", publication.sous_type]);
        if (publication.description) infos.push(["Informations", publication.description]);

        doc.autoTable({
            startY: y,
            body: infos.map(l => [texteCompatiblePDF(l[0]), texteCompatiblePDF(l[1])]),
            theme: "plain",
            margin: {left:14, right:14},
            styles: {font:"helvetica", fontSize:9, cellPadding:2.4, textColor:c.texte, valign:"top"},
            columnStyles: {0:{fontStyle:"bold", cellWidth:42, textColor:c.principal}, 1:{cellWidth:"auto"}},
            didDrawCell: function(data) {
                if (data.column.index === 0) {
                    doc.setDrawColor(...c.ligne);
                    doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
                }
            }
        });
        y = doc.lastAutoTable.finalY + 7;

        const reponses = Array.isArray(publication.reponses) ? publication.reponses : [];
        const listes = [
            {
                titre: "EVENEMENT",
                date: publication.date_evenement,
                contexte: "evenement",
                actif: publication.demande_reponse || reponses.some(r => r.contexte === "evenement")
            },
            {
                titre: "PREPARATION",
                date: publication.date_preparation,
                contexte: "preparation",
                actif: !!publication.date_preparation
            }
        ].filter(x => x.actif);

        for (const partie of listes) {
            const presents = reponses
                .filter(r => r.contexte === partie.contexte && r.reponse === "present")
                .map(r => [r.user_prenom, r.user_nom].filter(Boolean).join(" ") || "Utilisateur")
                .sort((a,b) => a.localeCompare(b, "fr", {sensitivity:"base"}));

            if (y > 245) {
                doc.addPage();
                y = ajouterEntetePDF(doc, "FICHE EVENEMENT", texteCompatiblePDF(titre));
            }

            doc.setFillColor(...(partie.contexte === "preparation" ? c.sombre : c.principal));
            doc.roundedRect(14, y, 182, 13, 2, 2, "F");
            doc.setTextColor(...c.blanc);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(texteCompatiblePDF(partie.titre), 19, y + 5.3);
            doc.setFontSize(8.5);
            const datePartie = partie.date ? formaterDateHeureCaserne(partie.date) : "Date non renseignee";
            doc.text(texteCompatiblePDF(datePartie), 19, y + 10);
            doc.text(`${presents.length} present${presents.length > 1 ? "s" : ""}`, 191, y + 7.5, {align:"right"});
            y += 16;

            const lignes = presents.length ? presents.map((nom, index) => [String(index + 1), texteCompatiblePDF(nom)]) : [["", "Aucune personne presente enregistree"]];
            doc.autoTable({
                startY: y,
                head: [["#", "PERSONNES PRESENTES"]],
                body: lignes,
                theme: "grid",
                margin: {left:14, right:14, bottom:20},
                headStyles: {fillColor:c.clair, textColor:c.principal, fontStyle:"bold", lineColor:c.ligne, lineWidth:.2},
                styles: {font:"helvetica", fontSize:9, textColor:c.texte, cellPadding:2.6, lineColor:c.ligne, lineWidth:.15},
                columnStyles: {0:{cellWidth:12, halign:"center", textColor:c.gris}, 1:{cellWidth:"auto"}}
            });
            y = doc.lastAutoTable.finalY + 8;
        }

        ajouterPiedDePagePDF(doc);
        if(modeMail)return pieceJointeDocumentMail(doc.output("blob"), nomFichierPDF(`${type}-${titre}`));
        await enregistrerPDFSansApercuNavigateur(doc, nomFichierPDF(`${type}-${titre}`));
    } catch (erreur) {
        if(modeMail)throw erreur;
        afficherErreurExportPDF(erreur);
    }
}

async function exporterEntretienPDF(entretienId, modeMail=false) {
    if (!utilisateurEstSPVAdmin() && !utilisateurAPermission("acces_entretien_individuel_admin")) {
        alert("Export PDF réservé aux administrateurs.");
        return;
    }

    try {
        const entretiens = await chargerEntretiensCaserne();
        const entretien = (entretiens || []).find(e => String(e.id) === String(entretienId));
        if (!entretien) {
            alert("Planning introuvable.");
            return;
        }

        const reponses = await chargerReponsesEntretiensAdminCaserne();
        const idsCreneaux = new Set((entretien.creneaux || []).map(c => String(c.creneau_id || c.id || "")).filter(Boolean));
        const titreEntretien = String(entretien.titre || "Entretien individuel");
        const filtrees = (reponses || []).filter(r => {
            if (r.entretien_id != null) return String(r.entretien_id) === String(entretienId);
            if (r.creneau_id != null && idsCreneaux.size) return idsCreneaux.has(String(r.creneau_id));
            return String(r.titre || "Entretien individuel") === titreEntretien;
        });
        const triees = filtrees
            .filter(r => r.date_heure && !Number.isNaN(new Date(r.date_heure).getTime()))
            .sort((a,b) => new Date(a.date_heure) - new Date(b.date_heure));

        if (!triees.length) {
            alert("Aucun rendez-vous réservé pour ce planning.");
            return;
        }

        const jsPDF = await obtenirBibliothequesPDF();
        const doc = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
        const c = couleurPDF();
        let y = ajouterEntetePDF(doc, titreEntretien.toUpperCase(), "Rendez-vous réservés pour ce planning");
        const groupes = new Map();
        triees.forEach(r => {
            const d = new Date(r.date_heure);
            const cle = d.toLocaleDateString("fr-FR", {year:"numeric", month:"2-digit", day:"2-digit"});
            if (!groupes.has(cle)) groupes.set(cle, []);
            groupes.get(cle).push(r);
        });

        for (const lignes of groupes.values()) {
            if (y > 248) {
                doc.addPage();
                y = ajouterEntetePDF(doc, titreEntretien.toUpperCase(), "Suite du planning");
            }
            const premier = new Date(lignes[0].date_heure);
            const libelleJour = premier.toLocaleDateString("fr-FR", {weekday:"long", day:"2-digit", month:"long", year:"numeric"});
            doc.setFillColor(...c.principal);
            doc.roundedRect(14, y, 182, 10, 2, 2, "F");
            doc.setTextColor(...c.blanc);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.text(texteCompatiblePDF(libelleJour.toUpperCase()), 18, y + 6.5);
            y += 13;
            const body = lignes.map(r => {
                const d = new Date(r.date_heure);
                const heure = d.toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"});
                const nom = [r.user_prenom, r.user_nom].filter(Boolean).join(" ") || "Utilisateur";
                return [texteCompatiblePDF(heure), texteCompatiblePDF(nom)];
            });
            doc.autoTable({
                startY:y,
                head:[["HEURE", "NOM / PRÉNOM"]],
                body,
                theme:"grid",
                margin:{left:14, right:14, bottom:20},
                headStyles:{fillColor:c.clair, textColor:c.principal, fontStyle:"bold", lineColor:c.ligne, lineWidth:.2},
                styles:{font:"helvetica", fontSize:9, textColor:c.texte, cellPadding:2.7, lineColor:c.ligne, lineWidth:.15},
                columnStyles:{0:{cellWidth:30, halign:"center", fontStyle:"bold"}, 1:{cellWidth:"auto"}}
            });
            y = doc.lastAutoTable.finalY + 8;
        }
        ajouterPiedDePagePDF(doc);
        if(modeMail)return pieceJointeDocumentMail(doc.output("blob"), nomFichierPDF(`entretien-${titreEntretien}`));
        await enregistrerPDFSansApercuNavigateur(doc, nomFichierPDF(`entretien-${titreEntretien}`));
    } catch (erreur) {
        if(modeMail)throw erreur;
        afficherErreurExportPDF(erreur);
    }
}

async function exporterEntretiensPDF( modeMail=false) {
    if (!utilisateurEstSPVAdmin() && !utilisateurAPermission("acces_entretien_individuel_admin")) {
        alert("Export PDF reserve aux administrateurs.");
        return;
    }

    try {
        const reponses = await chargerReponsesEntretiensAdminCaserne();
        const triees = [...reponses].filter(r => r.date_heure && !Number.isNaN(new Date(r.date_heure).getTime())).sort((a,b) => new Date(a.date_heure) - new Date(b.date_heure));
        if (!triees.length) {
            alert("Aucun rendez-vous a exporter.");
            return;
        }

        const jsPDF = await obtenirBibliothequesPDF();
        const doc = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
        const c = couleurPDF();
        let y = ajouterEntetePDF(doc, "PLANNING DES ENTRETIENS", "Liste chronologique des rendez-vous reserves");

        const groupes = new Map();
        triees.forEach(function(r) {
            const d = new Date(r.date_heure);
            const cle = d.toLocaleDateString("fr-FR", {year:"numeric", month:"2-digit", day:"2-digit"});
            if (!groupes.has(cle)) groupes.set(cle, []);
            groupes.get(cle).push(r);
        });

        for (const [jour, lignes] of groupes.entries()) {
            if (y > 248) {
                doc.addPage();
                y = ajouterEntetePDF(doc, "PLANNING DES ENTRETIENS", "Suite du planning");
            }
            const premier = new Date(lignes[0].date_heure);
            const libelleJour = premier.toLocaleDateString("fr-FR", {weekday:"long", day:"2-digit", month:"long", year:"numeric"});
            doc.setFillColor(...c.principal);
            doc.roundedRect(14, y, 182, 10, 2, 2, "F");
            doc.setTextColor(...c.blanc);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            doc.text(texteCompatiblePDF(libelleJour.toUpperCase()), 18, y + 6.5);
            y += 13;

            const body = lignes.map(function(r) {
                const d = new Date(r.date_heure);
                const heure = d.toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"});
                const nom = [r.user_prenom, r.user_nom].filter(Boolean).join(" ") || "Utilisateur";
                return [texteCompatiblePDF(heure), texteCompatiblePDF(nom), texteCompatiblePDF(r.titre || "Entretien individuel")];
            });

            doc.autoTable({
                startY:y,
                head:[["HEURE", "NOM / PRENOM", "ENTRETIEN"]],
                body,
                theme:"grid",
                margin:{left:14, right:14, bottom:20},
                headStyles:{fillColor:c.clair, textColor:c.principal, fontStyle:"bold", lineColor:c.ligne, lineWidth:.2},
                styles:{font:"helvetica", fontSize:9, textColor:c.texte, cellPadding:2.7, lineColor:c.ligne, lineWidth:.15},
                columnStyles:{0:{cellWidth:24, halign:"center", fontStyle:"bold"}, 1:{cellWidth:72}, 2:{cellWidth:"auto"}}
            });
            y = doc.lastAutoTable.finalY + 8;
        }

        ajouterPiedDePagePDF(doc);
        if(modeMail)return pieceJointeDocumentMail(doc.output("blob"), nomFichierPDF("planning-entretiens"));
        await enregistrerPDFSansApercuNavigateur(doc, nomFichierPDF("planning-entretiens"));
    } catch (erreur) {
        if(modeMail)throw erreur;
        afficherErreurExportPDF(erreur);
    }
}

function utilisateurPeutExporterPharmaciePDF() {
    return utilisateurEstSPVAdmin() || utilisateurAPermission("acces_administration");
}

async function exporterCommandeArchivePDF(archiveId, modeMail=false) {
    if (!utilisateurPeutExporterPharmaciePDF()) {
        alert("Export PDF reserve aux administrateurs.");
        return;
    }

    const archive = trouverArchiveHistorique(archiveId);
    if (!archive) {
        alert("Archive introuvable.");
        return;
    }

    try {
        const interventions = Array.isArray(archive.interventions) ? [...archive.interventions] : [];
        interventions.sort(function(a,b) {
            const dateA = Date.parse(a.date || a.createdAt || "") || 0;
            const dateB = Date.parse(b.date || b.createdAt || "") || 0;
            return dateA - dateB;
        });

        const materielsMap = new Map();
        interventions.forEach(function(intervention) {
            (Array.isArray(intervention.consommations) ? intervention.consommations : []).forEach(function(consommation) {
                const cle = String(consommation.materielId || consommation.materiel || "");
                if (!cle) return;
                if (!materielsMap.has(cle)) {
                    materielsMap.set(cle, {
                        cle,
                        nom: String(consommation.materiel || "Materiel")
                    });
                }
            });
        });
        const materielsUtilises = [...materielsMap.values()].sort((a,b) => a.nom.localeCompare(b.nom, "fr", {sensitivity:"base"}));
        if (!interventions.length) {
            alert("Cette commande ne contient aucune intervention.");
            return;
        }

        const jsPDF = await obtenirBibliothequesPDF();
        const doc = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
        const c = couleurPDF();
        let y = ajouterEntetePDF(doc, "COMMANDE EFFECTUEE", `Synthese des consommations - ${formaterDate(archive.date)}`);

        let totalGeneral = 0;
        const totauxMateriels = new Map(materielsUtilises.map(m => [m.cle, 0]));
        const body = interventions.map(function(intervention) {
            const quantites = new Map();
            let totalIntervention = 0;
            (Array.isArray(intervention.consommations) ? intervention.consommations : []).forEach(function(consommation) {
                const cle = String(consommation.materielId || consommation.materiel || "");
                const q = Math.max(0, Number(consommation.quantite || 0));
                if (!cle || !q) return;
                quantites.set(cle, (quantites.get(cle) || 0) + q);
                totauxMateriels.set(cle, (totauxMateriels.get(cle) || 0) + q);
                totalIntervention += q;
                totalGeneral += q;
            });
            const numero = String(intervention.numeroIntervention || "").trim();
            const date = intervention.date ? formaterDate(intervention.date) : "";
            const entete = `${numero ? `N° ${numero}` : "Intervention"}${date ? `\n${date}` : ""}`;
            return [
                texteCompatiblePDF(entete),
                ...materielsUtilises.map(m => {
                    const q = quantites.get(m.cle) || 0;
                    return q > 0 ? String(q) : "";
                }),
                totalIntervention > 0 ? String(totalIntervention) : ""
            ];
        });

        const head = [[
            "INTERVENTION",
            ...materielsUtilises.map(m => texteCompatiblePDF(m.nom)),
            "TOTAL"
        ]];
        const foot = [[
            "TOTAL",
            ...materielsUtilises.map(m => {
                const q = totauxMateriels.get(m.cle) || 0;
                return q > 0 ? String(q) : "";
            }),
            String(totalGeneral)
        ]];

        const stylesColonnes = {0:{cellWidth:36, halign:"left", fontStyle:"bold"}};
        for (let i=1; i<=materielsUtilises.length; i++) stylesColonnes[i] = {cellWidth:18, halign:"center"};
        stylesColonnes[materielsUtilises.length + 1] = {cellWidth:16, halign:"center", fontStyle:"bold"};

        doc.autoTable({
            startY:y,
            head,
            body,
            foot,
            theme:"grid",
            margin:{left:10, right:10, bottom:18},
            styles:{font:"helvetica", fontSize:7, textColor:c.texte, cellPadding:2, lineColor:c.ligne, lineWidth:.15, valign:"middle"},
            headStyles:{fillColor:c.principal, textColor:c.blanc, fontStyle:"bold", halign:"center", fontSize:6.5},
            footStyles:{fillColor:c.clair, textColor:c.principal, fontStyle:"bold", halign:"center"},
            columnStyles:stylesColonnes,
            horizontalPageBreak:true,
            horizontalPageBreakRepeat:0,
            didParseCell:function(data) {
                if (data.section === "body" && data.column.index > 0 && data.column.index < materielsUtilises.length + 1 && !String(data.cell.raw || "").trim()) {
                    data.cell.styles.fillColor = [255,255,255];
                }
            }
        });

        const finalY = doc.lastAutoTable.finalY + 6;
        if (finalY < doc.internal.pageSize.getHeight() - 25) {
            doc.setTextColor(...c.gris);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text(
                texteCompatiblePDF(`${interventions.length} intervention(s) - ${materielsUtilises.length} reference(s) utilisee(s) - ${totalGeneral} unite(s) au total`),
                10,
                finalY
            );
        }

        ajouterPiedDePagePDF(doc);
        if(modeMail)return pieceJointeDocumentMail(doc.output("blob"), nomFichierPDF(`commande-${archive.date || "pharmacie"}`));
        await enregistrerPDFSansApercuNavigateur(doc, nomFichierPDF(`commande-${archive.date || "pharmacie"}`));
    } catch (erreur) {
        if(modeMail)throw erreur;
        afficherErreurExportPDF(erreur);
    }
}

async function chargerPublicationsCaserne(type) {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) return [];
    const {data,error}=await chargerMetadonneesHistorique(() => {
        let q = supabase.from("caserne_publications").select("id,type_publication,titre,description,sous_type,visibilite,date_evenement,date_preparation,demande_reponse,demande_reponse_preparation,notification_auto,notification_delai_minutes,created_at").order("date_evenement", {ascending:true, nullsFirst:false}).order("id", {ascending:true});
        if (type) q = q.eq("type_publication", type);
        return q;
    });
    if (error) {
        signalerConnexionPrincipaleIndisponible(error);
        console.warn("Publications Caserne :", error);
        return Object.values(window.__publicationsCaserneParId || {}).filter(p => !type || p.type_publication === type);
    }
    return Array.isArray(data) ? data : [];
}

function obtenirLibelleTypeCaserne(type) {
    return ({
        sport:"Sport",
        manoeuvre:"Manœuvre",
        casernement:"Casernement",
        reunion:"Réunion",
        amical:"Amical",
        comite_centre:"Comité de centre",
        administratif:"Administratif"
    })[type] || "Actualité";
}

async function chargerDetailsPublicationsCaserne(publications) {
    const liste = Array.isArray(publications) ? publications : [];
    if (!liste.length) return liste;
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) return liste;
    const ids = liste.map(p => p.id).filter(Boolean);
    if (!ids.length) return liste;

    const [{data: photos, error: erreurPhotos}, {data: reponses, error: erreurReponses}] = await Promise.all([
        supabase.from("caserne_publication_photos").select("id,publication_id,photo_url,ordre").in("publication_id", ids).order("ordre", {ascending:true}),
        supabase.from("caserne_reponses").select("id,publication_id,user_id,user_prenom,user_nom,contexte,reponse").in("publication_id", ids)
    ]);
    if (erreurPhotos) console.warn("Photos Caserne :", erreurPhotos);
    if (erreurReponses) console.warn("Réponses Caserne :", erreurReponses);

    return liste.map(p => ({
        ...p,
        photos: (photos || []).filter(x => x.publication_id === p.id),
        reponses: (reponses || []).filter(x => x.publication_id === p.id)
    }));
}

function ouvrirPhotoCaserne(url) {
    if (!url) return;
    const ancien = document.getElementById("caserne-photo-plein-ecran");
    if (ancien) ancien.remove();
    const overlay = document.createElement("div");
    overlay.id = "caserne-photo-plein-ecran";
    overlay.className = "caserne-photo-overlay";
    overlay.innerHTML = `<button type="button" class="caserne-photo-fermer" aria-label="Fermer">×</button><img src="${echapperHTML(url)}" alt="Photo" />`;
    overlay.querySelector(".caserne-photo-fermer").onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);
}

function obtenirConfigurationPublicationCaserne(type) {
    return ({
        sport:{titre:"Séance de sport", admin:"ADMINISTRATION SPORT", action:"Publier la séance", dossier:"sport", aide:"Créer une séance de sport"},
        manoeuvre:{titre:"Manœuvre", admin:"ADMINISTRATION MANŒUVRE", action:"Publier la manœuvre", dossier:"manoeuvre", aide:"Créer une manœuvre"},
        casernement:{titre:"Casernement", admin:"ADMINISTRATION CASERNEMENT", action:"Publier", dossier:"casernement", aide:"Créer une publication de casernement"},
        reunion:{titre:"Réunion", admin:"ADMINISTRATION RÉUNION", action:"Publier la réunion", dossier:"reunion", aide:"Créer une réunion"},
        amical:{titre:"Amical", admin:"ADMINISTRATION AMICAL", action:"Publier", dossier:"amical", aide:"Créer une publication de l'Amical"},
        comite_centre:{titre:"Comité de centre", admin:"ADMINISTRATION COMITÉ DE CENTRE", action:"Publier", dossier:"comite-centre", aide:"Créer une publication du Comité de centre"},
        administratif:{titre:"Administratif", admin:"ADMINISTRATION", action:"Ouvrir", dossier:"administratif", aide:"Gestion administrative"}
    })[type] || {titre:"Publication", admin:"ADMINISTRATION", action:"Publier", dossier:"caserne", aide:"Créer une publication"};
}

function rafraichirVuePublicationCaserne(retour) {
    if (retour === "actualites") return afficherActualitesCaserne();
    return afficherRubriqueCaserne(retour || "sport");
}

function blocReponsePublicationCaserne(p, contexte, libelle, retour) {
    const reponses = Array.isArray(p.reponses) ? p.reponses : [];
    const monId = String(utilisateurConnecte?.id || "");
    const maReponse = reponses.find(r => r.contexte === contexte && String(r.user_id) === monId);
    const presents = reponses.filter(r => r.contexte === contexte && r.reponse === "present");
    const present = maReponse?.reponse === "present";
    const absent = maReponse?.reponse === "absent";
    const question = contexte === "preparation" ? "Seras-tu présent à la préparation ?" : "Seras-tu présent ?";
    const etat = present ? "Ta réponse : présent" : absent ? "Ta réponse : absent" : "Choisis ta réponse";
    return `<div class="caserne-zone-reponse caserne-zone-reponse-simple">
        <strong class="caserne-question-reponse">${echapperHTML(question)}</strong>
        <small class="caserne-etat-reponse">${echapperHTML(etat)}</small>
        <div class="caserne-boutons-reponse">
            <button type="button" class="${present ? "selectionne present" : ""}" onclick="repondrePublicationCaserne('${p.id}','present','${contexte}','${retour}')">✓ Je serai présent</button>
            <button type="button" class="${absent ? "selectionne absent" : ""}" onclick="repondrePublicationCaserne('${p.id}','absent','${contexte}','${retour}')">✕ Je serai absent</button>
        </div>
        <details class="caserne-presents-details">
            <summary>Voir les présents${presents.length ? ` (${presents.length})` : ""}</summary>
            <div class="caserne-liste-presents">${presents.length ? `<div>${presents.map(r => `<span>${echapperHTML([r.user_prenom,r.user_nom].filter(Boolean).join(" ") || "Utilisateur")}</span>`).join("")}</div>` : `<small>Aucune réponse « Présent » pour le moment.</small>`}</div>
        </details>
    </div>`;
}

function blocReponsePublicationPasseeCaserne(p, contexte, libelle) {
    const reponses = Array.isArray(p.reponses) ? p.reponses : [];
    const presents = reponses.filter(r => r.contexte === contexte && r.reponse === "present");
    return `<div class="caserne-zone-reponse caserne-zone-reponse-passee">
        <strong class="caserne-reponse-contexte">${echapperHTML(libelle)}</strong>
        <div class="caserne-liste-presents"><strong>Présents${presents.length ? ` · ${presents.length}` : ""}</strong>${presents.length ? `<div>${presents.map(r => `<span>${echapperHTML([r.user_prenom,r.user_nom].filter(Boolean).join(" ") || "Utilisateur")}</span>`).join("")}</div>` : `<small>Aucune réponse « Présent » enregistrée.</small>`}</div>
    </div>`;
}

function cartePublicationCaserne(p, options = {}) {
    const titre = p.titre || obtenirConfigurationPublicationCaserne(p.type_publication).titre;
    const photos = Array.isArray(p.photos) ? p.photos : [];
    const retour = options.retour || "actualites";
    const estPasse = options.passe === true;
    const reponses = Array.isArray(p.reponses) ? p.reponses : [];
    const maReponse = reponses.find(r => r.contexte === "evenement" && String(r.user_id) === String(utilisateurConnecte?.id || ""));
    const classeReponse = !estPasse && maReponse?.reponse === "present" ? " caserne-actu-present" : "";
    const classePasse = estPasse ? " caserne-actu-passee" : "";
    const sousType = p.type_publication === "amical" && p.sous_type ? `<span class="caserne-badge-soustype">${echapperHTML(({evenement:"Événement",reunion:"Réunion",autre:"Autre"})[p.sous_type] || p.sous_type)}</span>` : "";
    const visibilite = p.type_publication === "amical" && p.visibilite === "membre" ? `<span class="caserne-badge-visibilite">Membres de l'Amical</span>` : "";
    const rappelAuto = !estPasse && p.notification_auto && p.date_evenement ? `<span class="caserne-badge-visibilite">Rappel ${echapperHTML(libelleDelaiNotificationCaserne(p.notification_delai_minutes))} avant</span>` : "";
    const classeType = ` caserne-type-${String(p.type_publication || "autre").replace(/[^a-z0-9_-]/gi, "-")}`;

    return `<article class="caserne-actu-card${classeType}${classeReponse}${classePasse}">
        <div class="caserne-actu-meta"><span>${echapperHTML(obtenirLibelleTypeCaserne(p.type_publication))}</span>${p.date_evenement ? `<time>${echapperHTML(formaterDateHeureCaserne(p.date_evenement))}</time>` : ""}</div>
        <div class="caserne-badges-publication">${sousType}${visibilite}${rappelAuto}</div>
        <h2>${echapperHTML(titre)}</h2>
        ${p.description ? `<p>${echapperHTML(p.description).replaceAll("\n","<br>")}</p>` : ""}
        ${photos.length ? `<div class="caserne-photos">${photos.map(ph => `<button type="button" onclick='ouvrirPhotoCaserne(${JSON.stringify(ph.photo_url)})'><img src="${echapperHTML(ph.photo_url || "")}" alt="Photo de la publication"></button>`).join("")}</div>` : ""}
        ${p.demande_reponse ? (estPasse ? blocReponsePublicationPasseeCaserne(p,"evenement","Réponses pour l’événement") : blocReponsePublicationCaserne(p,"evenement","Réponse pour l'événement",retour)) : ""}
        ${p.date_preparation ? `<div class="caserne-preparation-bloc"><strong>Préparation</strong><span>${echapperHTML(formaterDateHeureCaserne(p.date_preparation))}</span>${p.demande_reponse_preparation ? (estPasse ? blocReponsePublicationPasseeCaserne(p,"preparation","Réponses pour la préparation") : blocReponsePublicationCaserne(p,"preparation","Réponse pour la préparation",retour)) : ""}</div>` : ""}
        ${!estPasse ? `<div class="caserne-calendrier-actions">
            ${boutonCalendrierCaserne(titre, p.date_evenement, p.description || "", 60, "Ajouter l'événement au calendrier")}
            ${p.date_preparation ? boutonCalendrierCaserne(`${titre} · Préparation`, p.date_preparation, p.description || "", 60, "Ajouter la préparation au calendrier") : ""}
        </div>` : ""}
        ${options.admin ? `<div class="caserne-actions-admin"><button type="button" onclick="CISEquipeEvolution.reponses('${p.id}','${p.type_publication}')">Voir toutes les réponses</button><button type="button" class="caserne-export-pdf bouton-pdf-icone" onclick="exporterPublicationCasernePDF('${p.id}')" aria-label="Exporter en PDF" title="Exporter en PDF">${iconePDFHTML()}</button><button type="button" onclick="modifierPublicationCaserne('${p.id}','${p.type_publication}')">Modifier</button><button type="button" onclick="supprimerPublicationCaserne('${p.id}','${p.type_publication}')">Supprimer</button></div>` : ""}
    </article>`;
}

async function repondrePublicationCaserne(publicationId, reponse, contexte = "evenement", retour = "actualites") {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) { alert("Une connexion Internet est nécessaire pour enregistrer la réponse."); return; }
    if (!utilisateurConnecte?.id) { alert("Session utilisateur introuvable."); return; }
    const payload = {
        publication_id: publicationId,
        user_id: utilisateurConnecte.id,
        user_prenom: profilUtilisateurConnecte?.prenom || null,
        user_nom: profilUtilisateurConnecte?.nom || null,
        contexte: contexte === "preparation" ? "preparation" : "evenement",
        reponse
    };
    const {error} = await supabase.from("caserne_reponses").upsert(payload, {onConflict:"publication_id,user_id,contexte"});
    if (error) { console.error(error); alert("Impossible d'enregistrer la réponse : " + (error.message || "erreur inconnue")); return; }
    await rafraichirVuePublicationCaserne(retour);
}

function formulaireAdminPublicationCaserne(type) {
    const cfg = obtenirConfigurationPublicationCaserne(type);
    const estAmical = type === "amical";
    return `<section class="caserne-admin-bloc caserne-admin-publication" data-type="${echapperHTML(type)}">
        <div class="caserne-admin-titre"><div><small>${echapperHTML(cfg.admin)}</small><h2>${echapperHTML(cfg.aide)}</h2></div></div>
        <div class="caserne-formulaire-sport caserne-formulaire-publication">
            <label>Titre<input id="caserne-publication-titre" type="text" placeholder="Titre de la publication"></label>
            <label>Description<textarea id="caserne-publication-description" rows="4" placeholder="Informations utiles"></textarea></label>
            ${estAmical ? `<label>Type<select id="caserne-publication-sous-type"><option value="evenement">Événement</option><option value="reunion">Réunion</option><option value="autre">Autre</option></select></label><label>Visibilité<select id="caserne-publication-visibilite"><option value="public">Tout le personnel autorisé</option><option value="membre">Membres de l'Amical</option></select></label>` : ""}
            <label>Date et heure${type === "administratif" || type === "casernement" ? " (facultatif)" : ""}<input id="caserne-publication-date" type="datetime-local"></label>
            <label class="caserne-switch-ligne"><input id="caserne-publication-reponse" type="checkbox"><span>Demander une réponse Présent / Absent</span></label>
            <label class="caserne-switch-ligne"><input id="caserne-publication-notification-creation" type="checkbox"><span>Envoyer une notification : nouvelle actualité disponible</span></label>
            <label class="caserne-switch-ligne"><input id="caserne-publication-notification-auto" type="checkbox" onchange="gererOptionNotificationAutoCaserne(this)"><span>Envoyer une notification automatique aux personnes présentes</span></label>
            <label id="caserne-publication-notification-delai-ligne" style="display:none">Délai avant l'événement<select id="caserne-publication-notification-delai"><option value="15">15 minutes avant</option><option value="30">30 minutes avant</option><option value="60" selected>1 heure avant</option><option value="120">2 heures avant</option><option value="360">6 heures avant</option><option value="720">12 heures avant</option><option value="1440">1 jour avant</option><option value="2880">2 jours avant</option><option value="10080">7 jours avant</option></select><small>Le rappel est envoyé uniquement aux utilisateurs ayant répondu « Présent ».</small></label>
            ${estAmical ? `<label>Date et heure de préparation (facultatif)<input id="caserne-publication-preparation" type="datetime-local"></label><label class="caserne-switch-ligne"><input id="caserne-publication-reponse-preparation" type="checkbox"><span>Demander une réponse Présent / Absent pour la préparation</span></label>` : ""}
            <label>Photos<input id="caserne-publication-photos" type="file" accept="image/*" multiple></label>
            <small class="caserne-aide-photo">Les photos sont facultatives. Tu peux en sélectionner plusieurs.</small>
            <button type="button" class="caserne-bouton-admin-principal" onclick="creerPublicationModuleCaserne('${type}')">${echapperHTML(cfg.action)}</button>
        </div>
    </section>`;
}

function gererOptionNotificationAutoCaserne(checkbox) {
    const ligne = document.getElementById("caserne-publication-notification-delai-ligne");
    const reponse = document.getElementById("caserne-publication-reponse");
    if (ligne) ligne.style.display = checkbox?.checked ? "flex" : "none";
    if (checkbox?.checked && reponse) reponse.checked = true;
}

function libelleDelaiNotificationCaserne(minutes) {
    const valeur = Math.max(1, Number(minutes) || 60);
    if (valeur % 1440 === 0) { const j = valeur / 1440; return `${j} jour${j > 1 ? "s" : ""}`; }
    if (valeur % 60 === 0) { const h = valeur / 60; return `${h} heure${h > 1 ? "s" : ""}`; }
    return `${valeur} minutes`;
}

function formulaireAdminSportCaserne() {
    return formulaireAdminPublicationCaserne("sport");
}

async function televerserPhotosCaserne(publicationId, fichiers, dossier = "caserne") {
    const supabase = obtenirClientSupabase();
    if (!supabase || !Array.isArray(fichiers) || !fichiers.length) return [];
    const urls = [];
    for (let i=0; i<fichiers.length; i++) {
        const fichier = fichiers[i];
        const extension = String(fichier.name || "photo.jpg").split(".").pop().replace(/[^a-zA-Z0-9]/g, "") || "jpg";
        const nom = `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}.${extension}`;
        const chemin = `${dossier}/${publicationId}/${nom}`;
        const {error: uploadError} = await supabase.storage.from("caserne").upload(chemin, fichier, {cacheControl:"3600", upsert:false});
        if (uploadError) throw uploadError;
        const {data} = supabase.storage.from("caserne").getPublicUrl(chemin);
        if (data?.publicUrl) urls.push({photo_url:data.publicUrl, ordre:i});
    }
    return urls;
}

async function creerPublicationModuleCaserne(type) {
    const rubrique = obtenirRubriquesCaserne().find(r => r[0] === type);
    if (!rubrique || (!utilisateurEstSPVAdmin() && !utilisateurAPermission(rubrique[3]))) { alert("Accès non autorisé."); return; }
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) { alert("Une connexion Internet est nécessaire pour publier."); return; }
    const cfg = obtenirConfigurationPublicationCaserne(type);
    const titre = document.getElementById("caserne-publication-titre")?.value?.trim() || null;
    const description = document.getElementById("caserne-publication-description")?.value?.trim() || null;
    const dateValeur = document.getElementById("caserne-publication-date")?.value || "";
    const prepValeur = type === "amical" ? (document.getElementById("caserne-publication-preparation")?.value || "") : "";
    const notificationCreation = !!document.getElementById("caserne-publication-notification-creation")?.checked;
    const notificationAuto = !!document.getElementById("caserne-publication-notification-auto")?.checked;
    const notificationDelaiMinutes = Math.max(1, Number(document.getElementById("caserne-publication-notification-delai")?.value || 60));
    const demandeReponse = notificationAuto || !!document.getElementById("caserne-publication-reponse")?.checked;
    const demandeReponsePreparation = type === "amical" && !!prepValeur && !!document.getElementById("caserne-publication-reponse-preparation")?.checked;
    const sousType = type === "amical" ? (document.getElementById("caserne-publication-sous-type")?.value || "evenement") : null;
    const visibilite = type === "amical" ? (document.getElementById("caserne-publication-visibilite")?.value || "public") : "public";
    const fichiers = Array.from(document.getElementById("caserne-publication-photos")?.files || []);
    const dateEvenement = dateValeur ? new Date(dateValeur).toISOString() : null;
    const datePreparation = prepValeur ? new Date(prepValeur).toISOString() : null;
    if (notificationAuto && !dateEvenement) {
        alert("Renseigne une date et une heure pour utiliser la notification automatique.");
        return;
    }
    const bouton = document.querySelector(".caserne-admin-publication .caserne-bouton-admin-principal");
    if (bouton) { bouton.disabled = true; bouton.textContent = "Publication…"; }
    let publicationId = null;
    try {
        const {data, error} = await supabase.rpc("creer_publication_caserne", {
            p_type_publication:type,
            p_titre:titre,
            p_description:description,
            p_sous_type:sousType,
            p_visibilite:visibilite,
            p_date_evenement:dateEvenement,
            p_date_preparation:datePreparation,
            p_demande_reponse:demandeReponse,
            p_demande_reponse_preparation:demandeReponsePreparation
        });
        if (error) throw error;
        publicationId = data;
        const {error: rappelError} = await supabase.rpc("configurer_rappel_publication_caserne", {
            p_publication_id: publicationId,
            p_notification_auto: notificationAuto,
            p_notification_delai_minutes: notificationDelaiMinutes
        });
        if (rappelError) throw rappelError;
        if (fichiers.length) {
            const photos = await televerserPhotosCaserne(publicationId, fichiers, cfg.dossier);
            if (photos.length) {
                const {error: photoError} = await supabase.from("caserne_publication_photos").insert(photos.map(ph => ({...ph, publication_id:publicationId})));
                if (photoError) throw photoError;
            }
        }
        if (notificationCreation) {
            try {
                const libelleRubrique = obtenirLibelleTypeCaserne(type);
                await envoyerNotificationPush(
                    `Nouvelle actualité · ${libelleRubrique}`,
                    `${titre || cfg.titre || libelleRubrique} · Nouvelle actualité disponible`,
                    `caserne_${type}`
                );
            } catch (erreurNotification) {
                console.error("Notification de création :", erreurNotification);
                alert("La publication est créée, mais la notification n'a pas pu être envoyée : " + (erreurNotification?.message || "erreur inconnue"));
            }
        }
        alert("Publication enregistrée.");
        await afficherRubriqueCaserne(type);
    } catch (erreur) {
        console.error(erreur);
        if (publicationId) { try { await supabase.rpc("supprimer_publication_caserne", {p_publication_id:publicationId}); } catch (_) {} }
        alert("Impossible de publier : " + (erreur?.message || "erreur inconnue"));
        if (bouton) { bouton.disabled = false; bouton.textContent = cfg.action; }
    }
}

async function creerSeanceSportCaserne() {
    return creerPublicationModuleCaserne("sport");
}

function valeurDateLocalePourPromptCaserne(valeur) {
    if (!valeur) return "";
    const d = new Date(valeur);
    if (Number.isNaN(d.getTime())) return "";
    const local = new Date(d.getTime() - d.getTimezoneOffset()*60000);
    return local.toISOString().slice(0,16);
}

async function modifierPublicationCaserne(publicationId, type) {
    const rubrique = obtenirRubriquesCaserne().find(r => r[0] === type);
    if (!rubrique || (!utilisateurEstSPVAdmin() && !utilisateurAPermission(rubrique[3]))) {
        alert("Tu n'as pas l'autorisation de modifier cette publication.");
        return;
    }
    const p = window.__publicationsCaserneParId?.[publicationId];
    if (!p) { alert("Publication introuvable. Recharge la rubrique puis réessaie."); return; }
    const titre = prompt("Titre", p.titre || "");
    if (titre === null) return;
    const description = prompt("Description", p.description || "");
    if (description === null) return;
    const dateTexte = prompt("Date et heure de l'événement (AAAA-MM-JJTHH:MM). Laisse vide si aucune date.", valeurDateLocalePourPromptCaserne(p.date_evenement));
    if (dateTexte === null) return;
    let sousType = p.sous_type || null, visibilite = p.visibilite || "public", prepTexte = valeurDateLocalePourPromptCaserne(p.date_preparation);
    if (type === "amical") {
        const st = prompt("Type : evenement, reunion ou autre", sousType || "evenement"); if (st === null) return; sousType = ["evenement","reunion","autre"].includes(st) ? st : "autre";
        const vis = prompt("Visibilité : public ou membre", visibilite); if (vis === null) return; visibilite = vis === "membre" ? "membre" : "public";
        const prep = prompt("Date et heure de préparation (AAAA-MM-JJTHH:MM), ou vide", prepTexte); if (prep === null) return; prepTexte = prep;
    }
    const dateEvenement = dateTexte ? new Date(dateTexte).toISOString() : null;
    const datePreparation = prepTexte ? new Date(prepTexte).toISOString() : null;
    let notificationAuto = false;
    let notificationDelaiMinutes = Math.max(1, Number(p.notification_delai_minutes) || 60);
    if (dateEvenement) {
        notificationAuto = confirm("Activer une notification automatique pour les personnes ayant répondu Présent ?");
        if (notificationAuto) {
            const saisieDelai = prompt("Combien de minutes avant l'événement ? Exemples : 60 = 1 heure, 1440 = 1 jour", String(notificationDelaiMinutes));
            if (saisieDelai === null) return;
            notificationDelaiMinutes = Math.max(1, Number(saisieDelai) || 60);
        }
    }
    const demandeReponse = notificationAuto || confirm("Demander une réponse Présent / Absent pour l'événement ?");
    const demandeReponsePreparation = type === "amical" && !!datePreparation ? confirm("Demander une réponse Présent / Absent pour la préparation ?") : false;
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) { alert("Une connexion Internet est nécessaire."); return; }
    const {error} = await supabase.rpc("modifier_publication_caserne", {
        p_publication_id:publicationId,
        p_titre:titre.trim() || null,
        p_description:description.trim() || null,
        p_sous_type:sousType,
        p_visibilite:visibilite,
        p_date_evenement:dateEvenement,
        p_date_preparation:datePreparation,
        p_demande_reponse:demandeReponse,
        p_demande_reponse_preparation:demandeReponsePreparation
    });
    if (error) { alert("Modification impossible : " + (error.message || "erreur inconnue")); return; }
    const {error: rappelError} = await supabase.rpc("configurer_rappel_publication_caserne", {
        p_publication_id: publicationId,
        p_notification_auto: notificationAuto,
        p_notification_delai_minutes: notificationDelaiMinutes
    });
    if (rappelError) { alert("Publication modifiée, mais le rappel automatique n'a pas pu être enregistré : " + (rappelError.message || "erreur inconnue")); return; }
    alert("Publication modifiée.");
    await afficherRubriqueCaserne(type);
}

async function supprimerPublicationCaserne(publicationId, typeRetour) {
    const rubrique = obtenirRubriquesCaserne().find(r => r[0] === typeRetour);
    if (!rubrique || (!utilisateurEstSPVAdmin() && !utilisateurAPermission(rubrique[3]))) {
        alert("Tu n'as pas l'autorisation de supprimer cette publication.");
        return;
    }
    if (!confirm("Supprimer cette publication ?")) return;
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) { alert("Une connexion Internet est nécessaire."); return; }
    const {error} = await supabase.rpc("supprimer_publication_caserne", {p_publication_id:publicationId});
    if (error) { alert("Suppression impossible : " + (error.message || "erreur inconnue")); return; }
    await afficherRubriqueCaserne(typeRetour || "sport");
}



/* =========================================================
   ENTRETIENS INDIVIDUELS
   Planification / réservation / réponses
   ========================================================= */

let vueAdminEntretienCaserne = "planification";
let groupesDatesEntretienCaserne = [{ id: Date.now(), date: "", heures: [""] }];

function echapperAttributCaserne(valeur) {
    return echapperHTML(String(valeur ?? "")).replaceAll('"', '&quot;');
}

function normaliserHeureEntretienCaserne(heure) {
    const valeur = String(heure || "").trim();
    return /^\d{2}:\d{2}$/.test(valeur) ? valeur : "";
}

function renduGroupesDatesEntretienCaserne() {
    return groupesDatesEntretienCaserne.map((groupe, index) => `
        <div class="caserne-entretien-date-groupe" data-groupe-id="${groupe.id}">
            <div class="caserne-entretien-date-entete">
                <label>Date
                    <input type="date" value="${echapperAttributCaserne(groupe.date)}" onchange="modifierDateEntretienCaserne(${groupe.id},this.value)">
                </label>
                ${groupesDatesEntretienCaserne.length > 1 ? `<button type="button" class="caserne-entretien-retirer" onclick="retirerDateEntretienCaserne(${groupe.id})">Retirer la date</button>` : ""}
            </div>
            <div class="caserne-entretien-heures">
                ${groupe.heures.map((heure, i) => `
                    <div class="caserne-entretien-heure-ligne">
                        <input type="time" value="${echapperAttributCaserne(heure)}" onchange="modifierHeureEntretienCaserne(${groupe.id},${i},this.value)">
                        ${groupe.heures.length > 1 ? `<button type="button" onclick="retirerHeureEntretienCaserne(${groupe.id},${i})" aria-label="Retirer ce créneau">×</button>` : ""}
                    </div>`).join("")}
            </div>
            <button type="button" class="caserne-entretien-ajouter-heure" onclick="ajouterHeureEntretienCaserne(${groupe.id})">+ Ajouter un horaire</button>
        </div>
    `).join("");
}

function rafraichirGroupesDatesEntretienCaserne() {
    const zone = document.getElementById("caserne-entretien-dates-zone");
    if (zone) zone.innerHTML = renduGroupesDatesEntretienCaserne();
}

function ajouterDateEntretienCaserne() {
    groupesDatesEntretienCaserne.push({ id: Date.now() + Math.floor(Math.random()*1000), date: "", heures: [""] });
    rafraichirGroupesDatesEntretienCaserne();
}

function retirerDateEntretienCaserne(id) {
    groupesDatesEntretienCaserne = groupesDatesEntretienCaserne.filter(g => g.id !== id);
    if (!groupesDatesEntretienCaserne.length) groupesDatesEntretienCaserne = [{ id: Date.now(), date: "", heures: [""] }];
    rafraichirGroupesDatesEntretienCaserne();
}

function modifierDateEntretienCaserne(id, valeur) {
    const groupe = groupesDatesEntretienCaserne.find(g => g.id === id);
    if (groupe) groupe.date = String(valeur || "");
}

function ajouterHeureEntretienCaserne(id) {
    const groupe = groupesDatesEntretienCaserne.find(g => g.id === id);
    if (groupe) groupe.heures.push("");
    rafraichirGroupesDatesEntretienCaserne();
}

function retirerHeureEntretienCaserne(id, index) {
    const groupe = groupesDatesEntretienCaserne.find(g => g.id === id);
    if (!groupe) return;
    groupe.heures.splice(index, 1);
    if (!groupe.heures.length) groupe.heures.push("");
    rafraichirGroupesDatesEntretienCaserne();
}

function modifierHeureEntretienCaserne(id, index, valeur) {
    const groupe = groupesDatesEntretienCaserne.find(g => g.id === id);
    if (groupe && groupe.heures[index] !== undefined) groupe.heures[index] = String(valeur || "");
}

function formulaireAdminEntretienCaserne() {
    return `<section class="caserne-admin-bloc caserne-admin-entretien">
        <div class="caserne-admin-titre"><div><small>ADMINISTRATION ENTRETIENS</small><h2>Planification</h2></div></div>
        <div class="caserne-entretien-onglets-admin">
            <button type="button" class="${vueAdminEntretienCaserne === 'planification' ? 'actif' : ''}" onclick="changerVueAdminEntretienCaserne('planification')">Planification</button>
            <button type="button" class="${vueAdminEntretienCaserne === 'reponses' ? 'actif' : ''}" onclick="changerVueAdminEntretienCaserne('reponses')">Réponses</button>
        </div>
        ${vueAdminEntretienCaserne === 'planification' ? `
            <div class="caserne-formulaire-sport caserne-formulaire-entretien">
                <label>Titre<input id="caserne-entretien-titre" type="text" placeholder="Ex. Entretiens annuels"></label>
                <label>Description<textarea id="caserne-entretien-description" rows="4" placeholder="Informations utiles"></textarea></label>
                <label>Durée d'un entretien (minutes)<input id="caserne-entretien-duree" type="number" min="1" inputmode="numeric" placeholder="Ex. 30"></label>
                <label class="caserne-switch-ligne"><input id="caserne-entretien-unique" type="checkbox" checked><span>Une seule personne peut choisir un même créneau</span></label>
                <label class="caserne-switch-ligne"><input id="caserne-entretien-notification-auto" type="checkbox" onchange="gererOptionNotificationEntretienCaserne(this)"><span>Envoyer une notification automatique avant le créneau réservé</span></label>
                <label id="caserne-entretien-notification-delai-ligne" style="display:none">Délai avant l'entretien<select id="caserne-entretien-notification-delai"><option value="15">15 minutes avant</option><option value="30">30 minutes avant</option><option value="60" selected>1 heure avant</option><option value="120">2 heures avant</option><option value="360">6 heures avant</option><option value="720">12 heures avant</option><option value="1440">1 jour avant</option><option value="2880">2 jours avant</option><option value="10080">7 jours avant</option></select><small>Le rappel sera envoyé automatiquement à chaque personne ayant réservé un créneau.</small></label>
                <div class="caserne-entretien-dates-titre"><strong>Dates et créneaux</strong><small>Ajoute autant de dates et d'horaires que nécessaire.</small></div>
                <div id="caserne-entretien-dates-zone">${renduGroupesDatesEntretienCaserne()}</div>
                <button type="button" class="caserne-entretien-ajouter-date" onclick="ajouterDateEntretienCaserne()">+ Ajouter une date</button>
                <button type="button" class="caserne-bouton-admin-principal" onclick="creerPlanningEntretienCaserne()">Publier le planning</button>
            </div>` : `<div class="caserne-entretien-export-actions"><button type="button" class="caserne-bouton-admin-principal caserne-export-pdf bouton-pdf-icone bouton-pdf-icone-entretien" onclick="exporterEntretiensPDF()" aria-label="Exporter le planning en PDF" title="Exporter le planning en PDF">${iconePDFHTML()}</button></div><div id="caserne-entretien-reponses-admin" class="caserne-entretien-chargement">Chargement des réponses…</div>`}
    </section>`;
}

function changerVueAdminEntretienCaserne(vue) {
    vueAdminEntretienCaserne = vue === "reponses" ? "reponses" : "planification";
    afficherRubriqueCaserne("entretien_individuel");
}

function gererOptionNotificationEntretienCaserne(checkbox) {
    const ligne = document.getElementById("caserne-entretien-notification-delai-ligne");
    if (ligne) ligne.style.display = checkbox?.checked ? "flex" : "none";
}

function construireCreneauxEntretienCaserne() {
    const dates = [];
    for (const groupe of groupesDatesEntretienCaserne) {
        if (!groupe.date) continue;
        for (const heureBrute of groupe.heures) {
            const heure = normaliserHeureEntretienCaserne(heureBrute);
            if (!heure) continue;
            const d = new Date(`${groupe.date}T${heure}:00`);
            if (!Number.isNaN(d.getTime())) dates.push(d.toISOString());
        }
    }
    return [...new Set(dates)].sort();
}

async function creerPlanningEntretienCaserne() {
    if (!utilisateurEstSPVAdmin() && !utilisateurAPermission("acces_entretien_individuel_admin")) { alert("Accès non autorisé."); return; }
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) { alert("Une connexion Internet est nécessaire pour publier le planning."); return; }
    const titre = document.getElementById("caserne-entretien-titre")?.value?.trim() || null;
    const description = document.getElementById("caserne-entretien-description")?.value?.trim() || null;
    const dureeBrute = document.getElementById("caserne-entretien-duree")?.value || "";
    const duree = dureeBrute ? Number.parseInt(dureeBrute, 10) : null;
    const unique = !!document.getElementById("caserne-entretien-unique")?.checked;
    const notificationAuto = !!document.getElementById("caserne-entretien-notification-auto")?.checked;
    const notificationDelaiMinutes = Math.max(1, Number(document.getElementById("caserne-entretien-notification-delai")?.value) || 60);
    const creneaux = construireCreneauxEntretienCaserne();
    if(!creneaux.length){alert("Ajoute au moins une date et un horaire.");return;}
    const bouton = document.querySelector(".caserne-admin-entretien .caserne-bouton-admin-principal");
    if (bouton) { bouton.disabled = true; bouton.textContent = "Publication…"; }
    try {
        const {error} = await supabase.rpc("creer_planning_entretien_caserne", {
            p_titre: titre,
            p_description: description,
            p_duree_minutes: Number.isFinite(duree) && duree > 0 ? duree : null,
            p_une_personne_par_creneau: unique,
            p_creneaux: creneaux,
            p_notification_auto: notificationAuto,
            p_notification_delai_minutes: notificationDelaiMinutes
        });
        if (error) throw error;
        groupesDatesEntretienCaserne = [{ id: Date.now(), date: "", heures: [""] }];
        alert("Planning d'entretien publié.");
        await afficherRubriqueCaserne("entretien_individuel");
    } catch (erreur) {
        console.error(erreur);
        alert("Impossible de publier le planning : " + (erreur?.message || "erreur inconnue"));
        if (bouton) { bouton.disabled = false; bouton.textContent = "Publier le planning"; }
    }
}

async function chargerEntretiensCaserne() {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) return [];
    const {data: entretiens, error} = await supabase.from("caserne_entretiens")
        .select("id,titre,description,duree_minutes,une_personne_par_creneau,created_at")
        .order("created_at", {ascending:false});
    if (error) { console.warn("Entretiens Caserne :", error); return []; }
    const liste = Array.isArray(entretiens) ? entretiens : [];
    if (!liste.length) return [];
    const ids = liste.map(e => e.id);
    const {data: etats, error: erreurEtats} = await supabase.rpc("lister_creneaux_entretien_caserne", {p_entretien_ids: ids});
    if (erreurEtats) console.warn("Créneaux entretien :", erreurEtats);
    const lignes = Array.isArray(etats) ? etats : [];
    return liste.map(e => ({...e, creneaux:lignes.filter(c => String(c.entretien_id) === String(e.id))}));
}

function grouperCreneauxParDateCaserne(creneaux) {
    const groupes = new Map();
    (creneaux || []).forEach(c => {
        if (!c.date_heure) return;
        const d = new Date(c.date_heure);
        if (Number.isNaN(d.getTime())) return;
        const cle = d.toISOString().slice(0,10);
        if (!groupes.has(cle)) groupes.set(cle, []);
        groupes.get(cle).push(c);
    });
    return [...groupes.entries()].sort((a,b) => a[0].localeCompare(b[0]));
}

function carteEntretienCaserne(entretien, estAdmin) {
    const groupes = grouperCreneauxParDateCaserne(entretien.creneaux || []);
    const maReservation = (entretien.creneaux || []).find(c => c.ma_reservation === true);
    return `<article class="caserne-entretien-card${maReservation ? ' caserne-entretien-reserve' : ''}">
        <div class="caserne-entretien-card-entete">
            <div><small>ENTRETIEN INDIVIDUEL</small><h2>${echapperHTML(entretien.titre || "Entretien individuel")}</h2></div>
            ${entretien.duree_minutes ? `<span>${Number(entretien.duree_minutes)} min</span>` : ""}
        </div>
        ${entretien.description ? `<p>${echapperHTML(entretien.description).replaceAll("\n","<br>")}</p>` : ""}
        ${maReservation ? `<div class="caserne-entretien-mon-rdv"><strong>Mon rendez-vous</strong><span>${echapperHTML(formaterDateHeureCaserne(maReservation.date_heure))}</span>${boutonCalendrierCaserne(entretien.titre || "Entretien individuel", maReservation.date_heure, entretien.description || "", entretien.duree_minutes || 60, "Ajouter mon rendez-vous au calendrier")}<button type="button" class="caserne-entretien-annuler" onclick="annulerReservationEntretienCaserne('${maReservation.creneau_id}')">Annuler mon créneau</button></div>` : ""}
        <div class="caserne-entretien-creneaux">
            ${groupes.length ? groupes.map(([date, lignes]) => {
                const d = new Date(date + "T12:00:00");
                const libelle = d.toLocaleDateString("fr-FR", {weekday:"long", day:"2-digit", month:"long", year:"numeric"});
                return `<div class="caserne-entretien-jour"><strong>${echapperHTML(libelle)}</strong><div>${lignes.map(c => {
                    const heure = new Date(c.date_heure).toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"});
                    const reserveParMoi = c.ma_reservation === true;
                    const complet = c.est_complet === true && !reserveParMoi;
                    return `<button type="button" ${complet ? 'disabled' : ''} class="${reserveParMoi ? 'selectionne' : ''} ${complet ? 'complet' : ''}" onclick="reserverCreneauEntretienCaserne('${c.creneau_id}')"><span>${echapperHTML(heure)}</span><small>${reserveParMoi ? 'Mon créneau' : (complet ? 'Indisponible' : 'Choisir')}</small></button>`;
                }).join("")}</div></div>`;
            }).join("") : `<div class="caserne-entretien-sans-creneau">Aucun créneau n'a encore été ajouté.</div>`}
        </div>
        ${estAdmin ? `<div class="caserne-actions-admin"><button type="button" class="caserne-export-pdf bouton-pdf-icone" onclick="exporterEntretienPDF('${entretien.id}')" aria-label="Exporter ce planning en PDF" title="Exporter ce planning en PDF">${iconePDFHTML()}</button><button type="button" onclick="supprimerPlanningEntretienCaserne('${entretien.id}')">Supprimer le planning</button></div>` : ""}
    </article>`;
}

async function reserverCreneauEntretienCaserne(creneauId, retourActualites = false) {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) { alert("Une connexion Internet est nécessaire pour choisir un créneau."); return; }
    try {
        const {error} = await supabase.rpc("reserver_creneau_entretien_caserne", {p_creneau_id:creneauId});
        if (error) throw error;
        alert("Créneau réservé.");
        if (retourActualites) await afficherActualitesCaserne();
        else await afficherRubriqueCaserne("entretien_individuel");
    } catch (erreur) {
        console.error(erreur);
        alert("Impossible de réserver ce créneau : " + (erreur?.message || "erreur inconnue"));
        if (retourActualites) await afficherActualitesCaserne();
        else await afficherRubriqueCaserne("entretien_individuel");
    }
}

async function annulerReservationEntretienCaserne(creneauId, retourActualites = false) {
    if (!confirm("Annuler ce rendez-vous ?")) return;
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) { alert("Une connexion Internet est nécessaire."); return; }
    const {error} = await supabase.rpc("annuler_reservation_entretien_caserne", {p_creneau_id:creneauId});
    if (error) { alert("Annulation impossible : " + (error.message || "erreur inconnue")); return; }
    if (retourActualites) await afficherActualitesCaserne();
    else await afficherRubriqueCaserne("entretien_individuel");
}

async function supprimerPlanningEntretienCaserne(entretienId) {
    if (!confirm("Supprimer ce planning et toutes ses réservations ?")) return;
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) { alert("Une connexion Internet est nécessaire."); return; }
    const {error} = await supabase.rpc("supprimer_planning_entretien_caserne", {p_entretien_id:entretienId});
    if (error) { alert("Suppression impossible : " + (error.message || "erreur inconnue")); return; }
    await afficherRubriqueCaserne("entretien_individuel");
}

async function chargerReponsesEntretiensAdminCaserne() {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) return [];
    const {data,error} = await supabase.rpc("lister_reponses_entretiens_admin_caserne");
    if (error) { console.warn(error); return []; }
    return Array.isArray(data) ? data : [];
}

async function remplirReponsesEntretiensAdminCaserne() {
    const zone = document.getElementById("caserne-entretien-reponses-admin");
    if (!zone) return;
    const reponses = await chargerReponsesEntretiensAdminCaserne();
    if (!document.getElementById("caserne-entretien-reponses-admin")) return;
    zone.innerHTML = reponses.length ? `<div class="caserne-entretien-reponses-liste">${reponses.map(r => `
        <article><time>${echapperHTML(formaterDateHeureCaserne(r.date_heure))}</time><strong>${echapperHTML([r.user_prenom,r.user_nom].filter(Boolean).join(" ") || "Utilisateur")}</strong><span>${echapperHTML(r.titre || "Entretien individuel")}</span></article>
    `).join("")}</div>` : `<div class="caserne-entretien-sans-creneau">Aucune réponse enregistrée pour le moment.</div>`;
}

async function chargerMesRendezVousEntretienCaserne() {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) return [];
    if (!utilisateurAPermission("acces_entretien_individuel") && !utilisateurAPermission("acces_entretien_individuel_admin") && !utilisateurEstSPVAdmin()) return [];
    const {data,error} = await supabase.rpc("mes_rendez_vous_entretien_caserne");
    if (error) { console.warn("Mes rendez-vous entretien :", error); return []; }
    return Array.isArray(data) ? data : [];
}

function carteRendezVousEntretienActualitesCaserne(rdv) {
    return `<article class="caserne-actu-card caserne-type-entretien caserne-actu-rendezvous">
        <div class="caserne-actu-meta"><span>Entretien individuel</span><time>${echapperHTML(formaterDateHeureCaserne(rdv.date_heure))}</time></div>
        <h2>${echapperHTML(rdv.titre || "Entretien individuel")}</h2>
        ${rdv.description ? `<p>${echapperHTML(rdv.description).replaceAll("\n","<br>")}</p>` : ""}
        <div class="caserne-rdv-badge">Rendez-vous prévu avec toi</div>
        <div class="caserne-calendrier-actions">${boutonCalendrierCaserne(rdv.titre || "Entretien individuel", rdv.date_heure, rdv.description || "", rdv.duree_minutes || 60, "Ajouter mon rendez-vous au calendrier")}</div>
    </article>`;
}

function cartePlanningEntretienActualitesCaserne(entretien) {
    const maintenant = Date.now() - 86400000;
    const creneauxFuturs = (entretien.creneaux || [])
        .filter(c => c.date_heure && new Date(c.date_heure).getTime() >= maintenant)
        .sort((a,b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime());
    const groupes = grouperCreneauxParDateCaserne(creneauxFuturs);
    const maReservation = creneauxFuturs.find(c => c.ma_reservation === true);
    const libres = creneauxFuturs.filter(c => c.est_complet !== true || c.ma_reservation === true).length;

    return `<article class="caserne-actu-card caserne-type-entretien caserne-actu-entretien-detail${maReservation ? " caserne-actu-rendezvous" : ""}">
        <div class="caserne-actu-meta"><span>Entretien individuel</span>${creneauxFuturs[0]?.date_heure ? `<time>${echapperHTML(formaterDateHeureCaserne(creneauxFuturs[0].date_heure))}</time>` : ""}</div>
        <div class="caserne-entretien-card-entete">
            <div><h2>${echapperHTML(entretien.titre || "Entretien individuel")}</h2></div>
            ${entretien.duree_minutes ? `<span>${Number(entretien.duree_minutes)} min</span>` : ""}
        </div>
        ${entretien.description ? `<p>${echapperHTML(entretien.description).replaceAll("\n","<br>")}</p>` : ""}
        ${maReservation ? `<div class="caserne-entretien-mon-rdv"><strong>Mon rendez-vous</strong><span>${echapperHTML(formaterDateHeureCaserne(maReservation.date_heure))}</span>${boutonCalendrierCaserne(entretien.titre || "Entretien individuel", maReservation.date_heure, entretien.description || "", entretien.duree_minutes || 60, "Ajouter mon rendez-vous au calendrier")}<button type="button" class="caserne-entretien-annuler" onclick="annulerReservationEntretienCaserne('${maReservation.creneau_id}', true)">Annuler mon créneau</button></div>` : `<div class="caserne-entretien-actu-badge">${libres > 0 ? `${libres} créneau${libres > 1 ? "x" : ""} disponible${libres > 1 ? "s" : ""}` : "Aucun créneau disponible"}</div>`}
        <div class="caserne-entretien-creneaux caserne-entretien-creneaux-actualites">
            ${groupes.length ? groupes.map(([date, lignes]) => {
                const d = new Date(date + "T12:00:00");
                const libelle = d.toLocaleDateString("fr-FR", {weekday:"long", day:"2-digit", month:"long", year:"numeric"});
                return `<div class="caserne-entretien-jour"><strong>${echapperHTML(libelle)}</strong><div>${lignes.map(c => {
                    const heure = new Date(c.date_heure).toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"});
                    const reserveParMoi = c.ma_reservation === true;
                    const complet = c.est_complet === true && !reserveParMoi;
                    return `<button type="button" ${complet ? "disabled" : ""} class="${reserveParMoi ? "selectionne" : ""} ${complet ? "complet" : ""}" onclick="reserverCreneauEntretienCaserne('${c.creneau_id}', true)"><span>${echapperHTML(heure)}</span><small>${reserveParMoi ? "Mon créneau" : (complet ? "Indisponible" : "Choisir")}</small></button>`;
                }).join("")}</div></div>`;
            }).join("") : `<div class="caserne-entretien-sans-creneau">Aucun créneau à venir.</div>`}
        </div>
    </article>`;
}

async function nettoyerEvenementsCaserneAnciens() {
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) return;
    try {
        const {error} = await supabase.rpc("nettoyer_evenements_caserne_anciens");
        if (error) console.warn("Nettoyage automatique des anciens événements Caserne :", error);
    } catch (erreur) {
        console.warn("Nettoyage automatique Caserne indisponible :", erreur);
    }
}

function carteEntretienPasseActualitesCaserne(entretien, dateReference) {
    const creneauxPasses = (entretien.creneaux || [])
        .filter(c => c.date_heure && new Date(c.date_heure).getTime() <= Date.now())
        .sort((a,b) => new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime());
    const groupes = grouperCreneauxParDateCaserne([...creneauxPasses].sort((a,b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime()));
    return `<article class="caserne-actu-card caserne-type-entretien caserne-actu-entretien-detail caserne-actu-passee">
        <div class="caserne-actu-meta"><span>Entretien individuel</span>${dateReference ? `<time>${echapperHTML(formaterDateHeureCaserne(dateReference))}</time>` : ""}</div>
        <div class="caserne-entretien-card-entete">
            <div><h2>${echapperHTML(entretien.titre || "Entretien individuel")}</h2></div>
            ${entretien.duree_minutes ? `<span>${Number(entretien.duree_minutes)} min</span>` : ""}
        </div>
        ${entretien.description ? `<p>${echapperHTML(entretien.description).replaceAll("\n","<br>")}</p>` : ""}
        <div class="caserne-entretien-creneaux caserne-entretien-creneaux-actualites">
            ${groupes.length ? groupes.map(([date, lignes]) => {
                const d = new Date(date + "T12:00:00");
                const libelle = d.toLocaleDateString("fr-FR", {weekday:"long", day:"2-digit", month:"long", year:"numeric"});
                return `<div class="caserne-entretien-jour"><strong>${echapperHTML(libelle)}</strong><div>${lignes.map(c => {
                    const heure = new Date(c.date_heure).toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"});
                    return `<div class="caserne-creneau-passe"><span>${echapperHTML(heure)}</span></div>`;
                }).join("")}</div></div>`;
            }).join("") : `<div class="caserne-entretien-sans-creneau">Aucun créneau enregistré.</div>`}
        </div>
    </article>`;
}


function initialiserStyleAgendaGeneralCaserne(){
 if(document.getElementById("style-agenda-general-caserne"))return;
 const st=document.createElement("style");st.id="style-agenda-general-caserne";st.textContent=`
 .caserne-actu-card.caserne-actu-present{border:3px solid #178447!important;background:#e8f7ee!important}
 .agenda-general-page{padding-bottom:120px;color:#232535}
 .agenda-general-panel{background:#fff;border-radius:20px;padding:17px 13px;box-shadow:0 8px 28px rgba(25,30,65,.08);margin-top:16px}
 .agenda-general-controles{display:flex;align-items:center;gap:8px;margin:4px 0 16px}
 .agenda-general-controles button,.agenda-general-switch button{border:0;background:#f1f0f8;color:#33334d;border-radius:12px;padding:10px 13px;font-weight:800;cursor:pointer}
 .agenda-general-mois{flex:1;text-align:center;font-size:18px;font-weight:900;text-transform:capitalize}
 .agenda-general-switch{display:flex;background:#f4f3f9;padding:4px;border-radius:13px;gap:4px;margin-bottom:15px}
 .agenda-general-switch button{flex:1;background:transparent}.agenda-general-switch button.actif{background:#fff;color:#6846d9;box-shadow:0 2px 7px #0001}
 .agenda-general-semaine,.agenda-general-grille{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;text-align:center}
 .agenda-general-semaine{font-size:11px;font-weight:800;color:#9192a0;margin-bottom:8px}
 .agenda-general-date{border:0;min-height:49px;border-radius:12px;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-weight:800;color:#333;cursor:pointer}
 .agenda-general-date.hors-mois{color:#b9b9c1}.agenda-general-date.avec-evenement{background:#d9ccfa;color:#392365}.agenda-general-date.selection{background:#7048dd;color:#fff}.agenda-general-date.aujourdhui:not(.selection){outline:2px solid #7048dd;outline-offset:-2px}
 .agenda-general-jour-titre{font-size:16px;font-weight:900;text-transform:capitalize;margin:21px 3px 15px}
 .agenda-general-timeline{display:grid;grid-template-columns:58px minmax(0,1fr);gap:10px;align-items:stretch;margin:10px 0}
 .agenda-general-heure{font-size:12px;font-weight:850;color:#9294a5;text-align:right;padding-top:14px}
 .agenda-general-ligne{border:0;border-left:4px solid var(--agenda-couleur,#7654d9);border-radius:12px;background:var(--agenda-fond,#f1edff);padding:13px 14px;min-height:67px;text-align:left;cursor:pointer;color:#27263a;width:100%;box-shadow:0 2px 6px #00000008}
 .agenda-general-ligne strong{display:block;font-size:14px;line-height:1.35}.agenda-general-ligne small{display:block;font-size:11px;font-weight:800;opacity:.72;margin-top:5px}
 .agenda-general-ligne.present{border-left-color:#16844b!important;background:#e8f7ee!important}
 .agenda-general-present{display:inline-block!important;color:#087b3c;font-weight:900!important;opacity:1!important}
 .agenda-general-vide{padding:25px 12px;text-align:center;color:#888b9a;background:#f8f8fb;border-radius:13px;font-size:14px}
 .agenda-general-retour{margin:10px 0 14px!important}
 @media(min-width:720px){.agenda-general-panel{max-width:680px;margin-left:auto;margin-right:auto;padding:24px}.agenda-general-date{min-height:65px}}
 @media(min-width:1000px){
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel{background:#141e27!important;border:1px solid #34424f;color:#f5f7f9!important;box-shadow:0 8px 28px #0002}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-mois,
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-jour-titre{color:#f5f7f9!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-switch{background:#1d2934!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-controles button,
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-switch button{background:#26333f!important;color:#e4eaf0!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-switch button.actif{background:#7048dd!important;color:#fff!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-semaine,
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-heure{color:#a6b3c0!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-date{color:#f5f7f9!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-date.hors-mois{color:#a6b3c0!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-date.avec-evenement{background:#d9ccfa!important;color:#392365!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-date.selection{color:#fff!important;background:#7048dd!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-ligne,
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-ligne strong,
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-ligne small{color:#27263a!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-ligne .agenda-general-present{color:#087b3c!important}
  body:not(.mode-connexion) #app .caserne-shell .agenda-general-panel .agenda-general-vide{background:#1d2934!important;color:#a6b3c0!important}
 }

 `;document.head.appendChild(st);
}
let agendaGeneralMoisCaserne=null;
let agendaGeneralDateSelectionneeCaserne=null;
let agendaGeneralVueCaserne="mois";
let agendaGeneralItemsCaserne=[];
function agendaGeneralCouleurCaserne(type){
 const palette={sport:["#168c6b","#e2f7ed"],manoeuvre:["#e4a222","#fff6dc"],reunion:["#4879db","#eaf1ff"],amical:["#db6483","#ffedf2"],casernement:["#8659d3","#f1eaff"]};
 return palette[Object.keys(palette).find(k=>String(type).includes(k))]||["#7351d8","#f1edff"];
}
function agendaGeneralRenduCaserne(){
 const app=document.getElementById("app");if(!app)return;
 const selection=agendaGeneralDateSelectionneeCaserne;
 const an=agendaGeneralMoisCaserne.getFullYear(),mo=agendaGeneralMoisCaserne.getMonth();
 const mois=agendaGeneralMoisCaserne.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});
 const aujourdHui=dateISOlocale(new Date());
 const compte=new Map();agendaGeneralItemsCaserne.forEach(x=>{const k=dateISOlocale(x.d);compte.set(k,(compte.get(k)||0)+1)});
 const debut=new Date(an,mo,1,12);const decalage=(debut.getDay()+6)%7;
 const jours=Array.from({length:42},(_,i)=>{const d=new Date(an,mo,1-decalage+i,12),cle=dateISOlocale(d),nombre=compte.get(cle)||0;return `<button type="button" class="agenda-general-date ${nombre?'avec-evenement':''} ${d.getMonth()!==mo?'hors-mois':''} ${cle===selection?'selection':''} ${cle===aujourdHui?'aujourdhui':''}" onclick="selectionnerJourAgendaGeneralCaserne('${cle}')" aria-pressed="${cle===selection}" aria-label="${echapperHTML(d.toLocaleDateString('fr-FR',{day:'numeric',month:'long'}))}${nombre?', '+nombre+' événement(s)':''}"><span>${d.getDate()}</span></button>`}).join("");
 const date=new Date(selection+"T12:00:00");
 const duJour=agendaGeneralItemsCaserne.filter(x=>dateISOlocale(x.d)===selection);
 const titreJour=date.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
 const elements=duJour.map(x=>{const present=(x.p.reponses||[]).some(r=>r.contexte===x.ctx&&String(r.user_id)===String(utilisateurConnecte?.id||"")&&r.reponse==="present");const titre=(x.p.titre||obtenirConfigurationPublicationCaserne(x.p.type_publication).titre)+(x.ctx==="preparation"?" · Préparation":"");const [couleur,fond]=agendaGeneralCouleurCaserne(x.p.type_publication);return `<div class="agenda-general-timeline"><div class="agenda-general-heure">${x.d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</div><button type="button" class="agenda-general-ligne ${present?'present':''}" style="--agenda-couleur:${couleur};--agenda-fond:${fond}" onclick="afficherRubriqueCaserne('${x.p.type_publication}')"><strong>${echapperHTML(titre)}</strong><small>${echapperHTML(obtenirLibelleTypeCaserne(x.p.type_publication))}</small>${present?'<small class="agenda-general-present">✓ Présent</small>':''}</button></div>`}).join("");
 const joursDuMois=[...new Set(agendaGeneralItemsCaserne.filter(x=>x.d.getMonth()===mo&&x.d.getFullYear()===an).map(x=>dateISOlocale(x.d)))];
 const listeMois=joursDuMois.map(k=>{const d=new Date(k+"T12:00:00");return `<section><h3 class="agenda-general-jour-titre">${echapperHTML(d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}))}</h3>${agendaGeneralItemsCaserne.filter(x=>dateISOlocale(x.d)===k).map(x=>{const [c,f]=agendaGeneralCouleurCaserne(x.p.type_publication);const titre=x.p.titre||obtenirConfigurationPublicationCaserne(x.p.type_publication).titre;return `<div class="agenda-general-timeline"><div class="agenda-general-heure">${x.d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</div><button class="agenda-general-ligne" style="--agenda-couleur:${c};--agenda-fond:${f}" onclick="afficherRubriqueCaserne('${x.p.type_publication}')"><strong>${echapperHTML(titre)}${x.ctx==='preparation'?' · Préparation':''}</strong><small>${echapperHTML(obtenirLibelleTypeCaserne(x.p.type_publication))}</small></button></div>`}).join('')}</section>`}).join('');
 app.innerHTML=`<main class="caserne-shell agenda-general-page"><header class="caserne-top caserne-top-simple"><small>ESPACE CASERNE</small><h1>Agenda général</h1></header><button class="caserne-retour-actualites agenda-general-retour" onclick="afficherActualitesCaserne()">← Retour aux actualités</button><div class="agenda-general-panel"><div class="agenda-general-controles"><button onclick="afficherAgendaGeneralCaserne(-1)" aria-label="Mois précédent">‹</button><div class="agenda-general-mois">${echapperHTML(mois)}</div><button onclick="afficherAgendaGeneralCaserne(1)" aria-label="Mois suivant">›</button></div><div class="agenda-general-switch"><button class="${agendaGeneralVueCaserne==='jour'?'actif':''}" onclick="changerVueAgendaGeneralCaserne('jour')">Journée</button><button class="${agendaGeneralVueCaserne==='mois'?'actif':''}" onclick="changerVueAgendaGeneralCaserne('mois')">Mois</button></div><div class="agenda-general-semaine">${['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(j=>`<span>${j}</span>`).join('')}</div><div class="agenda-general-grille">${jours}</div><h2 class="agenda-general-jour-titre">${agendaGeneralVueCaserne==='jour'?echapperHTML(titreJour):'Événements du mois'}</h2>${agendaGeneralVueCaserne==='jour'?(elements||'<div class="agenda-general-vide">Aucune activité pour cette journée.</div>'):(listeMois||'<div class="agenda-general-vide">Aucune activité ce mois-ci.</div>')}</div></main>${navigationCaserne("caserne")}`;
 actualiserInterfaceBureau();
}
function changerVueAgendaGeneralCaserne(vue){agendaGeneralVueCaserne=vue==='jour'?'jour':'mois';agendaGeneralRenduCaserne()}
function selectionnerJourAgendaGeneralCaserne(cle){if(!/^\d{4}-\d{2}-\d{2}$/.test(cle))return;agendaGeneralDateSelectionneeCaserne=cle;const d=new Date(cle+'T12:00:00');if(d.getMonth()!==agendaGeneralMoisCaserne.getMonth()||d.getFullYear()!==agendaGeneralMoisCaserne.getFullYear()){agendaGeneralMoisCaserne=new Date(d.getFullYear(),d.getMonth(),1,12);void afficherAgendaGeneralCaserne();return}agendaGeneralVueCaserne='jour';agendaGeneralRenduCaserne()}
async function afficherAgendaGeneralCaserne(decalage=0){
 initialiserStyleEspaceCaserne();initialiserStyleAgendaGeneralCaserne();
 if(!agendaGeneralMoisCaserne){const n=new Date();agendaGeneralMoisCaserne=new Date(n.getFullYear(),n.getMonth(),1,12)}
 if(decalage){agendaGeneralMoisCaserne=new Date(agendaGeneralMoisCaserne.getFullYear(),agendaGeneralMoisCaserne.getMonth()+decalage,1,12);agendaGeneralDateSelectionneeCaserne=dateISOlocale(new Date(agendaGeneralMoisCaserne.getFullYear(),agendaGeneralMoisCaserne.getMonth(),1,12))}
 if(!agendaGeneralDateSelectionneeCaserne)agendaGeneralDateSelectionneeCaserne=dateISOlocale(new Date());
 document.getElementById('app').innerHTML=`<main class="caserne-shell agenda-general-page"><header class="caserne-top caserne-top-simple"><small>ESPACE CASERNE</small><h1>Agenda général</h1></header><div class="garde-planning-attente">Chargement de l’agenda…</div></main>${navigationCaserne('caserne')}`;actualiserInterfaceBureau();
 let pubs=await chargerPublicationsCaserne();pubs=pubs.filter(p=>p.type_publication!=='entretien_individuel'&&p.type_publication!=='administratif'&&p.date_evenement);
 const rubriques=new Map(obtenirRubriquesCaserne().map(r=>[r[0],r]));pubs=pubs.filter(p=>{const r=rubriques.get(p.type_publication);return r?utilisateurPeutVoirRubriqueCaserne(r):false});pubs=await chargerDetailsPublicationsCaserne(pubs);
 const debut=new Date(agendaGeneralMoisCaserne.getFullYear(),agendaGeneralMoisCaserne.getMonth(),1),fin=new Date(agendaGeneralMoisCaserne.getFullYear(),agendaGeneralMoisCaserne.getMonth()+1,1);
 const items=[];pubs.forEach(p=>{const d=new Date(p.date_evenement);if(!Number.isNaN(d.getTime())&&d>=debut&&d<fin)items.push({d,p,ctx:'evenement'});if(p.date_preparation){const x=new Date(p.date_preparation);if(!Number.isNaN(x.getTime())&&x>=debut&&x<fin)items.push({d:x,p,ctx:'preparation'})}});
 items.sort((a,b)=>a.d-b.d);agendaGeneralItemsCaserne=items;agendaGeneralRenduCaserne();window.scrollTo({top:0,behavior:'auto'});
}
window.afficherAgendaGeneralCaserne=afficherAgendaGeneralCaserne;
window.selectionnerJourAgendaGeneralCaserne=selectionnerJourAgendaGeneralCaserne;
window.changerVueAgendaGeneralCaserne=changerVueAgendaGeneralCaserne;

// Les données légères restent disponibles pour les statistiques et le tri.
// Les cartes (et leurs détails volumineux) ne sont créées que par petits lots.
const listesHistoriquesProgressives = new Map();
const chargementsHistoriquesProgressifs = new WeakSet();
let sequenceHistoriqueProgressif = 0;

function nettoyerListesHistoriquesProgressives() {
    if (listesHistoriquesProgressives.size <= 60) return;
    const html = [document.getElementById("app")?.innerHTML, etatNavigationCourante?.html, etatPageAvantProfil?.html, ...historiqueNavigationApplication.map(e=>e.html)].join("\n");
    const conserves = new Set(html.match(/historique-progressif-\d+/g) || []);
    for (const id of listesHistoriquesProgressives.keys()) if (!conserves.has(id)) listesHistoriquesProgressives.delete(id);
}

function creerListeHistoriqueProgressive(lignes, taille, rendreLot, classeListe = "") {
    if (!document.getElementById("style-historiques-progressifs")) {
        const style = document.createElement("style");
        style.id = "style-historiques-progressifs";
        style.textContent = `.historique-voir-plus{display:block;width:100%;box-sizing:border-box;min-height:46px;padding:12px 16px;margin:16px 0;border:1px solid #ccd5df;border-radius:12px;background:#fff;color:#007aff;font:inherit;font-weight:750;cursor:pointer}.historique-voir-plus:disabled{opacity:.6;cursor:wait}.historique-voir-plus[hidden]{display:none}.historique-pagination-statut{margin:8px 0;color:#a22020;line-height:1.4}.historique-pagination-statut:empty{display:none}@media(min-width:1000px){body:not(.mode-connexion) .historique-voir-plus{background:#202c36;border-color:#617687;color:#75b9ff}body:not(.mode-connexion) .historique-pagination-statut{color:#ff9595}}`;
        document.head.appendChild(style);
    }
    const id = `historique-progressif-${++sequenceHistoriqueProgressif}`;
    listesHistoriquesProgressives.set(id, {lignes, taille, rendreLot, utilisateur: String(profilUtilisateurConnecte?.id || "")});
    return `<div id="${id}" data-historique-progressif data-historique-affiches="0"><div class="${classeListe}" data-historique-liste></div><button type="button" class="historique-voir-plus" onclick="chargerSuiteHistoriqueProgressif('${id}')" aria-controls="${id}-contenu">Voir plus</button><p class="historique-pagination-statut" role="status" aria-live="polite"></p></div>`
        .replace('data-historique-liste', `id="${id}-contenu" data-historique-liste`);
}

async function chargerSuiteHistoriqueProgressif(id) {
    const zone = document.getElementById(id), etat = listesHistoriquesProgressives.get(id);
    if (!zone || !etat || chargementsHistoriquesProgressifs.has(zone)) return;
    if (etat.utilisateur !== String(profilUtilisateurConnecte?.id || "")) return;
    const liste = zone.querySelector("[data-historique-liste]");
    const bouton = zone.querySelector(".historique-voir-plus"), statut = zone.querySelector("[role=status]");
    const debut = Number(zone.dataset.historiqueAffiches) || 0;
    const lot = etat.lignes.slice(debut, debut + etat.taille);
    if (!lot.length) { bouton.hidden = true; return; }
    zone.dataset.historiqueChargement = "true";
    chargementsHistoriquesProgressifs.add(zone);
    zone.setAttribute("aria-busy", "true");
    bouton.disabled = true; bouton.textContent = "Chargement…"; statut.textContent = "";
    try {
        const html = await etat.rendreLot(lot);
        if (!zone.isConnected) return;
        liste.insertAdjacentHTML("beforeend", html);
        zone.dataset.historiqueAffiches = String(debut + lot.length);
        bouton.hidden = debut + lot.length >= etat.lignes.length;
    } catch (erreur) {
        if (zone.isConnected) statut.textContent = "Chargement impossible. Appuie sur « Voir plus » pour réessayer.";
        console.warn("Historique :", erreur);
    } finally {
        zone.dataset.historiqueChargement = "false";
        chargementsHistoriquesProgressifs.delete(zone);
        zone.setAttribute("aria-busy", "false");
        bouton.disabled = false; bouton.textContent = "Voir plus";
        if (zone.isConnected) memoriserTransitionNavigation();
    }
}

function initialiserListesHistoriquesProgressives(racine = document) {
    const zones = [...racine.querySelectorAll("[data-historique-progressif]")];
    // Un retour de navigation peut restaurer le HTML d'un chargement interrompu.
    for (const zone of zones) {
        if (!chargementsHistoriquesProgressifs.has(zone)) {
            zone.dataset.historiqueChargement = "false";
            zone.setAttribute("aria-busy", "false");
            const bouton = zone.querySelector(".historique-voir-plus");
            bouton.disabled = false; bouton.textContent = "Voir plus";
        }
    }
    return Promise.all(zones
        .filter(zone => (!zone.closest("details") || zone.closest("details").open) && !(Number(zone.dataset.historiqueAffiches) > 0))
        .map(zone => chargerSuiteHistoriqueProgressif(zone.id)));
}

function htmlEvenementsPassesProgressifs(lignes, rendreLot, classeListe = "caserne-fil") {
    if (!lignes.length) return "";
    return `<details class="caserne-anciens-evenements" ontoggle="if(this.open) initialiserListesHistoriquesProgressives(this)"><summary>Voir les événements passés</summary>${creerListeHistoriqueProgressive(lignes, 10, rendreLot, classeListe)}</details>`;
}

async function cartesPublicationsPasseesProgressives(lignes, options) {
    const publications = await chargerDetailsPublicationsCaserne(lignes);
    window.__publicationsCaserneParId = {...window.__publicationsCaserneParId, ...Object.fromEntries(publications.map(p => [p.id, p]))};
    return publications.map(p => cartePublicationCaserne(p, {...options, passe:true})).join("");
}

async function chargerMetadonneesHistorique(fabriquerRequete) {
    try {
        const lignes = [], ids = new Set();
        for (let debut = 0; ; debut += 500) {
            const {data, error} = await fabriquerRequete().range(debut, debut + 499);
            if (error) return {data:null, error};
            for (const ligne of data || []) {
                if (!ids.has(String(ligne.id))) { ids.add(String(ligne.id)); lignes.push(ligne); }
            }
            if ((data || []).length < 500) return {data:lignes, error:null};
        }
    } catch (error) { return {data:null, error}; }
}

async function afficherActualitesCaserne(synchronisationDejaFaite = false) {
    initialiserStyleAgendaGeneralCaserne();
    if (!synchronisationDejaFaite) await synchroniserCaserneAvantNavigation();
    await nettoyerEvenementsCaserneAnciens();

    let publications = await chargerPublicationsCaserne();
    publications = publications.filter(p => p.type_publication !== "administratif");
    const dateChargement = Date.now();
    const publicationsActuelles = publications.filter(p => !p.date_evenement || !Number.isFinite(Date.parse(p.date_evenement)) || Date.parse(p.date_evenement) >= dateChargement);
    const detailsActuels = await chargerDetailsPublicationsCaserne(publicationsActuelles);
    const parId = new Map(detailsActuels.map(p => [p.id, p]));
    publications = publications.map(p => parId.get(p.id) || p);
    window.__publicationsCaserneParId = Object.fromEntries(publications.map(p => [p.id,p]));

    const peutVoirEntretiens = utilisateurAPermission("acces_entretien_individuel") || utilisateurAPermission("acces_entretien_individuel_admin") || utilisateurEstSPVAdmin();
    const entretiens = peutVoirEntretiens ? await chargerEntretiensCaserne() : [];
    const maintenant = Date.now();
    const sansDate = [];
    const aVenir = [];
    const passes = [];

    publications.forEach(p => {
        if (!p.date_evenement) {
            sansDate.push({type:"publication", date:null, valeur:p});
            return;
        }
        const date = new Date(p.date_evenement).getTime();
        if (Number.isNaN(date)) sansDate.push({type:"publication", date:null, valeur:p});
        else if (date >= maintenant) aVenir.push({type:"publication", date, valeur:p});
        else passes.push({type:"publication", date, valeur:p});
    });

    (entretiens || []).forEach(entretien => {
        const tousLesCreneaux = (entretien.creneaux || [])
            .filter(c => c.date_heure && !Number.isNaN(new Date(c.date_heure).getTime()))
            .sort((a,b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime());
        if (!tousLesCreneaux.length) return;
        const creneauxFuturs = tousLesCreneaux.filter(c => new Date(c.date_heure).getTime() >= maintenant);
        if (creneauxFuturs.length) {
            const maReservation = creneauxFuturs.find(c => c.ma_reservation === true);
            aVenir.push({type:"entretien", date:new Date((maReservation || creneauxFuturs[0]).date_heure).getTime(), valeur:{...entretien, creneaux:creneauxFuturs}});
        } else {
            const dernier = tousLesCreneaux[tousLesCreneaux.length - 1];
            passes.push({type:"entretien_passe", date:new Date(dernier.date_heure).getTime(), valeur:{...entretien, creneaux:tousLesCreneaux}, dateReference:dernier.date_heure});
        }
    });

    sansDate.sort((a,b) => new Date(b.valeur.created_at || 0).getTime() - new Date(a.valeur.created_at || 0).getTime());
    aVenir.sort((a,b) => a.date - b.date);
    passes.sort((a,b) => b.date - a.date);

    const futursHTML = [...sansDate, ...aVenir].map(e => e.type === "entretien"
        ? cartePlanningEntretienActualitesCaserne(e.valeur)
        : cartePublicationCaserne(e.valeur,{retour:"actualites"})
    ).join("");
    const passesHTML = htmlEvenementsPassesProgressifs(passes, async lot => {
        const pubs = lot.filter(e => e.type !== "entretien_passe").map(e => e.valeur);
        const details = await chargerDetailsPublicationsCaserne(pubs);
        const parId = new Map(details.map(p => [p.id, p]));
        window.__publicationsCaserneParId = {...window.__publicationsCaserneParId, ...Object.fromEntries(details.map(p => [p.id, p]))};
        return lot.map(e => e.type === "entretien_passe" ? carteEntretienPasseActualitesCaserne(e.valeur, e.dateReference) : cartePublicationCaserne(parId.get(e.valeur.id) || e.valeur, {retour:"actualites", passe:true})).join("");
    });

    const accesEntretien = peutVoirEntretiens
        ? `<button type="button" class="caserne-raccourci caserne-raccourci-secondaire" onclick="afficherRubriqueCaserne('entretien_individuel')"><span>🗓️</span><strong>Mon entretien</strong></button>`
        : "";

    document.getElementById("app").innerHTML = `
        <main class="caserne-shell caserne-shell-actualites caserne-public-simple">
            <header class="caserne-top caserne-top-simple">
                <small>ESPACE CASERNE</small>
                <h1>Actualités</h1>
                
            </header>

            <section class="caserne-raccourcis-publics" aria-label="Raccourcis">
                <button type="button" class="caserne-raccourci" onclick="afficherAgendaGeneralCaserne()"><strong>Agenda général</strong></button>
            </section>

            <div class="caserne-titre-section"><strong>À venir</strong><span>${aVenir.length + sansDate.length ? `${aVenir.length + sansDate.length} élément${aVenir.length + sansDate.length > 1 ? "s" : ""}` : ""}</span></div>
            <section class="caserne-fil caserne-fil-actuel">
                ${futursHTML || (lecturesPrincipaleEnErreur.has('/rest/v1/caserne_publications') ? '<div class="caserne-vide"><strong>Actualités temporairement indisponibles</strong><p>La connexion sera rétablie automatiquement.</p></div>' : '<div class="caserne-vide"><strong>Rien de prévu pour le moment</strong><p>Tu n’as aucune action à faire.</p></div>')}
            </section>

            ${passesHTML}
        </main>${navigationCaserne("caserne")}`;
    actualiserInterfaceBureau();
    void initialiserListesHistoriquesProgressives();
    window.scrollTo({top:0, behavior:"auto"});
}

function utilisateurAccesAdministratifCentral() {
    return utilisateurEstSPVAdmin() || [
        "acces_admin_travail_equipe", "acces_admin_menage", "acces_admin_heures", "acces_sport_admin",
        "acces_manoeuvre_admin", "acces_casernement_admin", "acces_reunion_admin",
        "acces_amical_admin", "acces_comite_centre_admin",
        "acces_administratif_admin", "acces_entretien_individuel_admin",
        "acces_notifications", "acces_gestion_utilisateurs"
    ].some(permission => utilisateurAPermission(permission));
}

function afficherAdministratifCaserne() {
    rubriqueEquipeOrigine=null;
    if (!utilisateurAccesAdministratifCentral()) {
        alert("Accès non autorisé."); return;
    }
    initialiserStyleEspaceGardeUtilisateur();
    initialiserStyleAdministratifCarres();
    const admin = utilisateurEstSPVAdmin();
    const autorise = permission => admin || utilisateurAPermission(permission);
    const cartes = [
        ["✓", "Travail des équipes", "CISTravail.historique()", utilisateurAPermission("acces_admin_travail_equipe")],
        ["📦", "Ménage inventaire", "afficherInventaireMenage()", utilisateurAPermission("acces_admin_menage")],
        ["🧹", "Ménage Admin", "afficherAdminMenageEquipe()", autorise("acces_admin_menage")],
        ["🚒", "Inventaires Admin", "afficherAdminInventairesEquipe()", autorise("acces_admin_menage")],
        ["⏱️", "Historique des heures", "afficherHistoriqueHeuresEquipe()", autorise("acces_admin_heures")],
        ["🔔", "Notifications", "afficherNotificationsAdministration()", autorise("acces_notifications")],
    ].filter(carte => carte[3]);
    const app = document.getElementById("app");
    app.innerHTML = `<main class="garde-menu-page administratif-carres">
        <button class="retour-button" onclick="afficherEspaceGarde()">← Retour</button>
        <header class="garde-menu-entete"><h1>Administratif</h1></header>
        <div class="garde-menu-cartes">${cartes.map(([icone, titre, action]) => `
            <button type="button" class="garde-menu-carte" onclick="${action}">
                <span class="ico">${icone}</span><span><strong>${echapperHTML(titre)}</strong></span><b class="fleche">›</b>
            </button>`).join("")}</div>
    </main>${navigationPrincipale("","accueil")}`;
    actualiserInterfaceBureau();
    window.scrollTo({top:0,behavior:"auto"});
}

// Même classement temporel que le fil d’actualité ; archives fermées par défaut.
function separerPublicationsRubriqueCaserne(publications,maintenant=Date.now()){
 const sansDate=[],avenir=[],passes=[];
 for(const p of publications||[]){const date=p.date_evenement?new Date(p.date_evenement).getTime():NaN;if(!Number.isFinite(date))sansDate.push(p);else(date>=maintenant?avenir:passes).push(p);}
 sansDate.sort((a,b)=>(Date.parse(b.created_at||'')||0)-(Date.parse(a.created_at||'')||0));
 avenir.sort((a,b)=>new Date(a.date_evenement)-new Date(b.date_evenement));
 passes.sort((a,b)=>new Date(b.date_evenement)-new Date(a.date_evenement));
 return {actuels:[...sansDate,...avenir],passes};
}
function separerEntretiensRubriqueCaserne(entretiens,maintenant=Date.now()){
 const actuels=[],passes=[];
 for(const e of entretiens||[]){
  const valides=(e.creneaux||[]).filter(c=>c.date_heure&&Number.isFinite(Date.parse(c.date_heure)));
  const futurs=valides.filter(c=>Date.parse(c.date_heure)>=maintenant).sort((a,b)=>Date.parse(a.date_heure)-Date.parse(b.date_heure));
  const anciens=valides.filter(c=>Date.parse(c.date_heure)<maintenant).sort((a,b)=>Date.parse(a.date_heure)-Date.parse(b.date_heure));
  if(futurs.length)actuels.push({...e,creneaux:futurs});else if(!valides.length)actuels.push(e);
  if(anciens.length)passes.push({entretien:{...e,creneaux:anciens},dateReference:anciens[anciens.length-1].date_heure});
 }
 passes.sort((a,b)=>Date.parse(b.dateReference)-Date.parse(a.dateReference));
 return {actuels,passes};
}
async function afficherRubriqueCaserne(type) {
    const rubrique = obtenirRubriquesCaserne().find(r => r[0] === type);
    if (!rubrique || !utilisateurPeutVoirRubriqueCaserne(rubrique)) { alert("Accès non autorisé."); return; }
    await synchroniserCaserneAvantNavigation();
    const estAdmin = utilisateurEstSPVAdmin() || utilisateurAPermission(rubrique[3]);

    if (type === "administratif") {
        afficherAdministratifCaserne();
        return;
    }

    if (type === "entretien_individuel") {
        const entretiens = await chargerEntretiensCaserne();
        const classement=separerEntretiensRubriqueCaserne(entretiens);
        document.getElementById("app").innerHTML = `
            <main class="caserne-shell ${estAdmin ? "caserne-avec-admin" : "caserne-public-simple"}">
                <header class="caserne-top ${estAdmin ? "" : "caserne-top-simple"}"><small>ESPACE CASERNE</small><h1>${echapperHTML(rubrique[1])}</h1><p>${estAdmin ? "Planification · réponses · créneaux" : "Choisis ton rendez-vous en appuyant sur un créneau disponible."}</p></header>
                ${estAdmin ? formulaireAdminEntretienCaserne() : `<button type="button" class="caserne-retour-actualites" onclick="afficherActualitesCaserne()">← Retour aux actualités</button>`}
                <section class="caserne-fil caserne-entretiens-fil">
                    ${classement.actuels.length ? classement.actuels.map(e => carteEntretienCaserne(e, estAdmin)).join("") : '<div class="caserne-vide"><strong>Aucun entretien à venir</strong><p>Aucun créneau à venir pour le moment.</p></div>'}
                </section>
                ${htmlEvenementsPassesProgressifs(classement.passes, lot => lot.map(e=>carteEntretienPasseActualitesCaserne(e.entretien,e.dateReference)).join(""), "caserne-fil caserne-entretiens-fil")}
            </main>${navigationCaserne("caserne")}`;
        actualiserInterfaceBureau();
        if (estAdmin && vueAdminEntretienCaserne === "reponses") remplirReponsesEntretiensAdminCaserne();
        window.scrollTo({top:0, behavior:"auto"});
        return;
    }

    let publications = await chargerPublicationsCaserne(type);
    const classement=separerPublicationsRubriqueCaserne(publications);
    classement.actuels = await chargerDetailsPublicationsCaserne(classement.actuels);
    window.__publicationsCaserneParId = Object.fromEntries(classement.actuels.map(p => [p.id,p]));
    const formulaireAdmin = estAdmin ? formulaireAdminPublicationCaserne(type) : "";
    const presentation = obtenirPresentationRubriqueCaserne(type);
    document.getElementById("app").innerHTML = `
        <main class="caserne-shell ${estAdmin ? "caserne-avec-admin" : "caserne-public-simple"}">
            <header class="caserne-top ${estAdmin ? "" : "caserne-top-simple"}"><small>ESPACE CASERNE</small><h1>${echapperHTML(rubrique[1])}</h1><p>${estAdmin ? "Vue publique · administration" : echapperHTML(presentation.aide)}</p></header>
            ${estAdmin ? formulaireAdmin : `<button type="button" class="caserne-retour-actualites" onclick="afficherActualitesCaserne()">← Retour aux actualités</button>`}
            <section class="caserne-fil">
                ${classement.actuels.length ? classement.actuels.map(p => cartePublicationCaserne(p, {admin:estAdmin,retour:type})).join("") : '<div class="caserne-vide"><strong>Aucun événement à venir</strong><p>Aucune nouvelle information dans cette rubrique.</p></div>'}
            </section>
            ${htmlEvenementsPassesProgressifs(classement.passes, lot => cartesPublicationsPasseesProgressives(lot, {admin:estAdmin,retour:type}))}
        </main>${navigationCaserne("caserne")}`;
    actualiserInterfaceBureau();
    window.scrollTo({top:0, behavior:"auto"});
}

function initialiserStyleEspaceCaserne() {
    if (document.getElementById("style-espace-caserne-v74")) return;
    const style=document.createElement("style");
    style.id="style-espace-caserne-v74";
    style.textContent=`
        html:has(body .caserne-shell){background:#7d2425!important}
        body:has(.caserne-shell){background:#7d2425!important;padding-bottom:92px!important;min-height:100dvh;overscroll-behavior-y:none}
        body:has(.caserne-shell) #app{background:#f4ebe8!important;min-height:100dvh}
        .caserne-shell{max-width:820px;margin:0 auto;padding:0 18px 110px;font-family:Arial,sans-serif;color:#2b1716;min-height:100dvh;background:#f4ebe8}
        html.cis-espace-caserne,html.cis-espace-caserne body{background:#7d2425!important}
        html.cis-espace-caserne body #app{background:#f4ebe8!important;min-height:100dvh}
        .caserne-top{margin:calc(-1 * env(safe-area-inset-top, 0px)) -18px 22px;padding:calc(34px + env(safe-area-inset-top, 0px)) 22px 28px;background:#7d2425;color:white;border-radius:0 0 28px 28px;box-shadow:0 10px 28px rgba(70,20,20,.16)}
        .caserne-top small{font-size:11px;font-weight:800;letter-spacing:2px;opacity:.72}.caserne-top h1{font-size:34px;line-height:1;margin:8px 0 9px}.caserne-top p{margin:0;opacity:.86}
        .caserne-fil{display:grid;gap:14px}.caserne-actu-card{background:#fff;border:1px solid #ead9d4;border-radius:18px;padding:18px;box-shadow:0 6px 18px rgba(80,40,30,.06)}
        .caserne-actu-meta{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:12px;margin-bottom:12px}.caserne-actu-meta span{text-transform:uppercase;font-weight:800;letter-spacing:.8px;color:#7d2425}.caserne-actu-meta time{color:#745f5b;text-align:right}
        .caserne-actu-card h2{font-size:20px;margin:0 0 8px}.caserne-actu-card p{margin:0;line-height:1.5;color:#5b4945}.caserne-reponse-attente{margin-top:14px;background:#f3d6d0;border-radius:10px;padding:10px 12px;font-weight:700;color:#702022}
        .caserne-vide{background:#fff;border:1px dashed #cfaeaa;border-radius:18px;padding:28px 20px;text-align:center}.caserne-vide strong{font-size:18px}.caserne-vide p{color:#75615e;margin-bottom:0}
        .caserne-menu-grille{display:grid;grid-template-columns:1fr 1fr;gap:12px}.caserne-menu-grille button{border:0;border-radius:18px;background:#fff;padding:20px 16px;text-align:left;box-shadow:0 5px 18px rgba(80,40,30,.07);min-height:105px;display:flex;flex-direction:column;justify-content:space-between;color:#2b1716}.caserne-menu-grille button strong{font-size:17px}.caserne-menu-grille button span{font-size:12px;color:#8c3434;font-weight:700}
        .caserne-admin-acces{margin:0 0 16px;background:#e7c2a5;border-left:5px solid #9b5d2e;border-radius:14px;padding:15px 16px;display:flex;flex-direction:column;gap:4px}.caserne-admin-acces strong{color:#5f3215}.caserne-admin-acces span{font-size:13px;color:#654c3c}
        .caserne-admin-bloc{margin:0 0 22px;background:#3f1718;color:#fff;border-radius:20px;padding:18px;box-shadow:0 8px 22px rgba(60,20,20,.16)}.caserne-admin-titre small{font-size:10px;font-weight:800;letter-spacing:1.7px;opacity:.68}.caserne-admin-titre h2{margin:5px 0 16px;font-size:23px}.caserne-formulaire-sport{display:grid;gap:12px;min-width:0;overflow:hidden}.caserne-formulaire-sport label{display:grid;gap:6px;font-size:12px;font-weight:800;min-width:0;max-width:100%;overflow:hidden}.caserne-formulaire-sport input[type=text],.caserne-formulaire-sport input[type=datetime-local],.caserne-formulaire-sport input[type=file],.caserne-formulaire-sport textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.18);background:#fff;color:#2b1716;border-radius:12px;padding:12px;font:inherit}.caserne-formulaire-sport textarea{resize:vertical}.caserne-formulaire-sport input[type=datetime-local],.caserne-formulaire-sport input[type=date]{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;-webkit-appearance:none;appearance:none;overflow:hidden;font-size:16px}.caserne-formulaire-sport input[type=datetime-local]::-webkit-date-and-time-value,.caserne-formulaire-sport input[type=date]::-webkit-date-and-time-value{min-width:0;text-align:left}.caserne-switch-ligne{display:flex!important;align-items:center;gap:10px!important;background:rgba(255,255,255,.09);padding:11px;border-radius:12px}.caserne-switch-ligne input{width:20px;height:20px}.caserne-aide-photo{opacity:.65;margin-top:-7px}.caserne-bouton-admin-principal{border:0;border-radius:12px;background:#f2d7d1;color:#5b1b1d;padding:13px 16px;font-weight:900;font-size:14px}.caserne-bouton-admin-principal:disabled{opacity:.55}.caserne-photos{display:flex;gap:8px;overflow-x:auto;margin-top:14px;padding-bottom:3px}.caserne-photos button{flex:0 0 128px;height:100px;border:0;padding:0;border-radius:12px;overflow:hidden;background:#eadbd7}.caserne-photos img{width:100%;height:100%;object-fit:cover;display:block}.caserne-photo-overlay{position:fixed;inset:0;z-index:20000;background:rgba(18,8,8,.94);display:flex;align-items:center;justify-content:center;padding:55px 12px 20px}.caserne-photo-overlay img{max-width:100%;max-height:100%;object-fit:contain;touch-action:pinch-zoom}.caserne-photo-fermer{position:absolute;left:14px;right:auto;top:14px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.12);color:#fff;font-size:30px;line-height:1}.caserne-zone-reponse{margin-top:16px;border-top:1px solid #ead9d4;padding-top:14px}.caserne-boutons-reponse{display:grid;grid-template-columns:1fr 1fr;gap:9px}.caserne-boutons-reponse button{border:2px solid #d4b7b3;background:#fff;border-radius:11px;padding:12px 10px;font-weight:900;color:#672426;transition:transform .12s ease,box-shadow .12s ease,background .12s ease}.caserne-boutons-reponse button:first-child{background:#e8f6ed;color:#176b3a;border-color:#78c795}.caserne-boutons-reponse button:last-child{background:#fdeaea;color:#a12d32;border-color:#e4a0a3}.caserne-boutons-reponse button.selectionne.present{background:#23864f;color:#fff;border-color:#23864f;box-shadow:0 4px 12px rgba(35,134,79,.24)}.caserne-boutons-reponse button.selectionne.absent{background:#c94349;color:#fff;border-color:#c94349;box-shadow:0 4px 12px rgba(201,67,73,.22)}.caserne-liste-presents{margin-top:13px}.caserne-liste-presents>strong{display:block;font-size:12px;color:#7d2425;margin-bottom:7px}.caserne-liste-presents>div{display:flex;gap:6px;flex-wrap:wrap}.caserne-liste-presents span{display:inline-block;background:#f3e4e0;border-radius:999px;padding:6px 9px;font-size:12px;font-weight:700}.caserne-liste-presents small{color:#7d6b67}.caserne-actu-present{background:#f8dfda}.caserne-actions-admin{display:flex;justify-content:flex-end;margin-top:12px}.caserne-actions-admin button{border:0;background:#4a181a;color:#fff;border-radius:9px;padding:8px 11px;font-weight:800;font-size:11px}
        .caserne-entretien-onglets-admin{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 16px}.caserne-entretien-onglets-admin button{border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:10px;background:rgba(255,255,255,.06);color:#fff;font-weight:800}.caserne-entretien-onglets-admin button.actif{background:#f2d7d1;color:#5b1b1d;border-color:#f2d7d1}.caserne-formulaire-entretien input[type=number]{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.18);background:#fff;color:#2b1716;border-radius:12px;padding:12px;font:inherit}.caserne-entretien-dates-titre{display:grid;gap:3px;margin-top:3px}.caserne-entretien-dates-titre small{opacity:.68}.caserne-entretien-date-groupe{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:12px;display:grid;gap:10px}.caserne-entretien-date-entete{display:flex;gap:10px;align-items:end}.caserne-entretien-date-entete label{flex:1}.caserne-entretien-date-entete input,.caserne-entretien-heure-ligne input{width:100%;box-sizing:border-box;border:0;border-radius:10px;padding:10px;background:#fff;color:#2b1716;font:inherit}.caserne-entretien-retirer,.caserne-entretien-ajouter-heure,.caserne-entretien-ajouter-date{border:1px solid rgba(255,255,255,.24);border-radius:9px;padding:9px 11px;background:transparent;color:#fff;font-weight:800}.caserne-entretien-retirer{font-size:11px}.caserne-entretien-ajouter-heure{text-align:left}.caserne-entretien-ajouter-date{width:100%;padding:11px}.caserne-entretien-heures{display:grid;gap:7px}.caserne-entretien-heure-ligne{display:grid;grid-template-columns:1fr 42px;gap:7px}.caserne-entretien-heure-ligne button{border:0;border-radius:9px;background:#702326;color:#fff;font-size:22px}.caserne-entretien-card{background:#fff;border:1px solid #ead9d4;border-radius:18px;padding:18px;box-shadow:0 6px 18px rgba(80,40,30,.06)}.caserne-entretien-card-entete{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.caserne-entretien-card-entete small{font-size:10px;font-weight:900;letter-spacing:1.2px;color:#7d2425}.caserne-entretien-card-entete h2{font-size:20px;margin:5px 0 0}.caserne-entretien-card-entete>span{background:#f2e4e0;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:800;white-space:nowrap}.caserne-entretien-card>p{color:#5b4945;line-height:1.5}.caserne-entretien-mon-rdv{margin:14px 0;background:#5b1719;color:#fff;border-radius:13px;padding:13px;display:grid;gap:4px}.caserne-entretien-mon-rdv strong{font-size:11px;text-transform:uppercase;letter-spacing:.8px;opacity:.72}.caserne-entretien-mon-rdv span{font-size:16px;font-weight:900}.caserne-entretien-mon-rdv button{margin-top:6px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:8px;padding:8px;font-weight:800}.caserne-entretien-creneaux{display:grid;gap:14px;margin-top:14px}.caserne-entretien-jour>strong{display:block;text-transform:capitalize;margin-bottom:8px;font-size:13px;color:#6b2426}.caserne-entretien-jour>div{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.caserne-entretien-jour button{border:1px solid #d9c1bc;background:#fff;border-radius:11px;padding:9px 5px;display:grid;gap:2px;color:#4b2926}.caserne-entretien-jour button span{font-weight:900}.caserne-entretien-jour button small{font-size:9px}.caserne-entretien-jour button.selectionne{background:#7d2425;color:#fff;border-color:#7d2425}.caserne-entretien-jour button.complet{background:#eee8e6;color:#998984;border-color:#e0d6d3}.caserne-entretien-sans-creneau{padding:13px;border-radius:11px;background:#f5ece9;color:#765f5b;font-size:13px}.caserne-entretien-reponses-liste{display:grid;gap:8px}.caserne-entretien-reponses-liste article{background:rgba(255,255,255,.09);border-radius:11px;padding:11px;display:grid;gap:3px}.caserne-entretien-reponses-liste time{font-size:11px;opacity:.7}.caserne-entretien-reponses-liste strong{font-size:16px}.caserne-entretien-reponses-liste span{font-size:12px;opacity:.78}.caserne-entretien-chargement{padding:14px;border-radius:11px;background:rgba(255,255,255,.07);opacity:.8}.caserne-actu-entretien{cursor:pointer}.caserne-entretien-actu-badge{margin-top:14px;display:inline-block;background:#f3e3df;color:#6b2426;border:1px solid #e4cbc5;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900}.caserne-actu-rendezvous{background:#651c1f!important;color:#fff;border-color:#651c1f}.caserne-actu-rendezvous .caserne-actu-meta span,.caserne-actu-rendezvous .caserne-actu-meta time,.caserne-actu-rendezvous p{color:#fff}.caserne-rdv-badge{margin-top:14px;display:inline-block;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900}.caserne-calendrier-actions{display:grid;gap:8px;margin-top:14px}.caserne-bouton-calendrier{width:100%;border:1px solid #d7b9b4;background:#fff;color:#6b2426;border-radius:11px;padding:11px 12px;font-weight:900;font-size:12px}.caserne-actu-rendezvous .caserne-bouton-calendrier,.caserne-entretien-mon-rdv .caserne-bouton-calendrier{background:#fff;color:#651c1f;border-color:#fff}.caserne-entretien-mon-rdv .caserne-entretien-annuler{margin-top:0}.caserne-actu-entretien-detail .caserne-entretien-card-entete{margin-bottom:10px}.caserne-actu-entretien-detail .caserne-entretien-card-entete h2{margin:0}.caserne-actu-entretien-detail .caserne-entretien-creneaux{margin-top:15px}.caserne-actu-rendezvous .caserne-entretien-jour>strong{color:#fff}.caserne-actu-rendezvous .caserne-entretien-card-entete>span{background:rgba(255,255,255,.14);color:#fff}.caserne-actu-rendezvous .caserne-entretien-actu-badge{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.2)}
        .caserne-formulaire-publication select{width:100%;box-sizing:border-box;border:1px solid #d9c7c2;border-radius:12px;background:#fff;padding:12px;font-size:15px;color:#2b1716}.caserne-badges-publication{display:flex;flex-wrap:wrap;gap:7px;margin:6px 0 9px}.caserne-badge-soustype,.caserne-badge-visibilite{display:inline-flex;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:900;background:#f5e3df;color:#7d2425}.caserne-badge-visibilite{background:#7d2425;color:#fff}.caserne-reponse-contexte{display:block;margin-bottom:9px;color:#6f2325}.caserne-preparation-bloc{margin-top:14px;padding:14px;border-radius:14px;background:#f7eeee;border:1px solid #ead1cc;display:grid;gap:8px}.caserne-preparation-bloc>strong{color:#7d2425}.caserne-actions-admin{display:flex;gap:8px;flex-wrap:wrap}.caserne-actions-admin button{flex:1;min-width:120px}.caserne-actions-admin .caserne-export-pdf,.caserne-entretien-export-actions .caserne-export-pdf{background:#fff;color:#6b2426;border:2px solid #6b2426}.bouton-pdf-icone{flex:0 0 48px!important;width:48px!important;min-width:48px!important;height:48px!important;padding:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:12px!important}.bouton-pdf-icone svg{width:25px;height:25px;display:block}.caserne-entretien-export-actions{text-align:right}.caserne-entretien-export-actions .bouton-pdf-icone-entretien{margin-left:auto}.archive-export-pdf.bouton-pdf-icone{margin:18px 0 0 auto;width:48px!important}.caserne-entretien-export-actions{margin:0 0 14px}.caserne-entretien-export-actions button{width:100%}.caserne-actu-present .caserne-preparation-bloc{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.25)}.caserne-actu-present .caserne-preparation-bloc>strong,.caserne-actu-present .caserne-reponse-contexte{color:inherit}
        .caserne-separateur-passe{display:flex;align-items:center;gap:12px;margin:24px 2px 4px;color:#786f6c;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1px}.caserne-separateur-passe::before,.caserne-separateur-passe::after{content:"";height:1px;background:#c9c0bd;flex:1}.caserne-separateur-passe span{white-space:nowrap}.caserne-passes-au-dessus{display:grid;gap:14px;padding:0;background:transparent}.caserne-passes-au-dessus .caserne-separateur-passe{margin:8px 2px 0}.caserne-shell-actualites{min-height:100vh}.caserne-shell-actualites .caserne-top{position:sticky;top:0;z-index:40}.caserne-fil-actuel{min-height:55vh}
        .caserne-actu-passee{background:#dedbd9!important;border-color:#cbc6c3!important;color:#5d5957!important;box-shadow:none!important}.caserne-actu-passee .caserne-actu-meta span,.caserne-actu-passee .caserne-actu-meta time,.caserne-actu-passee h2,.caserne-actu-passee p,.caserne-actu-passee .caserne-reponse-contexte,.caserne-actu-passee .caserne-liste-presents>strong,.caserne-actu-passee .caserne-entretien-jour>strong{color:#5d5957!important}.caserne-actu-passee .caserne-liste-presents span,.caserne-actu-passee .caserne-badge-soustype,.caserne-actu-passee .caserne-badge-visibilite,.caserne-actu-passee .caserne-entretien-card-entete>span{background:#c9c5c2!important;color:#55514f!important}.caserne-actu-passee .caserne-preparation-bloc,.caserne-actu-passee .caserne-zone-reponse{background:rgba(255,255,255,.22)!important;border-color:#c7c2bf!important}.caserne-creneau-passe{border:1px solid #c2bdb9;background:#d2cfcc;border-radius:10px;padding:9px 5px;text-align:center;color:#5d5957}.caserne-creneau-passe span{font-weight:900}.caserne-zone-reponse-passee .caserne-liste-presents{margin-top:0}
        .caserne-admin-centre{display:grid;grid-template-columns:1fr 1fr;gap:12px}.caserne-admin-centre>button{border:1px solid #dcc7c2;background:#fff;border-radius:18px;padding:19px;text-align:left;min-height:108px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;color:#2b1716;box-shadow:0 6px 18px rgba(80,40,30,.06)}.caserne-admin-centre>button strong{font-size:17px}.caserne-admin-centre>button span{font-size:12px;line-height:1.4;color:#765f5b}.caserne-administratif-page .caserne-vide{grid-column:1/-1}@media(max-width:560px){.caserne-admin-centre{grid-template-columns:1fr}}
        .caserne-nav-bas{position:fixed;z-index:5000;left:50%;bottom:12px;transform:translateX(-50%);width:min(calc(100% - 24px),620px);height:68px;background:#fff;border:1px solid #eadbd7;border-radius:22px;box-shadow:0 12px 34px rgba(50,20,20,.18);display:grid;grid-template-columns:repeat(4,1fr);padding:5px 54px 5px 6px}
        .caserne-nav-bas>button:not(.caserne-menu-bulle){border:0;background:transparent;color:#7d6b67;font-size:10px;font-weight:700;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}.caserne-nav-bas>button span{font-size:21px;line-height:1}.caserne-nav-bas>button.actif{color:#8a2527}.caserne-menu-bulle{position:absolute;right:8px;top:8px;width:50px;height:50px;border-radius:50%;border:0;background:#7d2425;color:#fff;box-shadow:0 5px 15px rgba(80,20,20,.25)}.caserne-menu-bulle span{font-size:20px!important}
        .navigation-fixe-page{padding-bottom:110px!important}
        .caserne-nav-bas.nav-theme-pharmacie>button.actif{color:#237448}.caserne-nav-bas.nav-theme-pharmacie .caserne-menu-bulle{background:#237448;box-shadow:0 5px 15px rgba(20,85,52,.24)}
        .caserne-nav-bas.nav-theme-accueil>button.actif{color:#171717}.caserne-nav-bas.nav-theme-accueil .caserne-menu-bulle{background:#171717;box-shadow:0 5px 15px rgba(0,0,0,.22)}
        /* Interface publique simplifiée */
        .caserne-public-simple{font-size:16px}.caserne-public-simple .caserne-top-simple{padding-bottom:24px}.caserne-public-simple .caserne-top-simple h1{font-size:32px;line-height:1.08}.caserne-public-simple .caserne-top-simple p{font-size:16px;line-height:1.45;max-width:560px}
        .caserne-retour-actualites{width:100%;min-height:52px;margin:0 0 16px;border:1px solid #d7c5c0;background:#fff;color:#542326;border-radius:14px;padding:12px 16px;text-align:left;font-size:16px;font-weight:900;box-shadow:0 3px 10px rgba(70,20,20,.05)}
        .caserne-raccourcis-publics{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 22px}.caserne-raccourci{min-height:70px;border:0;border-radius:17px;background:#fff;color:#542326;padding:13px 14px;display:flex;align-items:center;gap:11px;text-align:left;box-shadow:0 5px 16px rgba(70,20,20,.08)}.caserne-raccourci span{font-size:25px}.caserne-raccourci strong{font-size:15px;line-height:1.2}.caserne-raccourci-secondaire{background:#efe0dc}
        .caserne-titre-section{display:flex;align-items:center;justify-content:space-between;margin:0 2px 10px}.caserne-titre-section strong{font-size:21px}.caserne-titre-section span{font-size:12px;color:#79635e;font-weight:800}
        .caserne-menu-liste-simple{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.caserne-menu-liste-simple>button{width:100%;min-width:0;min-height:112px;border:1px solid #e0cfca;background:#fff;border-radius:18px;padding:12px 7px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;color:#2b1716;box-shadow:0 4px 13px rgba(80,40,30,.05)}.caserne-menu-icone{font-size:29px;line-height:1;text-align:center}.caserne-menu-texte{display:block;min-width:0;width:100%}.caserne-menu-texte strong{display:block;font-size:13px;line-height:1.18;overflow-wrap:anywhere}.caserne-menu-texte small{display:none}.caserne-menu-fleche{display:none}.menu-navigation-section-titre{margin:22px 2px 9px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1.1px;color:#6d5651}.menu-navigation-pharmacie .menu-top-pharmacie{background:linear-gradient(180deg,#1f6a45 0%,#2e8a5c 100%)}.menu-navigation-principal .menu-top-principal{background:linear-gradient(180deg,#242424 0%,#3a3a3a 100%)}.menu-navigation-pharmacie .caserne-menu-fleche{color:#237448}.menu-navigation-pharmacie .caserne-menu-liste-simple>button{border-color:#cee1d6}
        /* v28 : la barre système iPhone suit le menu affiché. Ces règles
           passent après le fond rouge générique de l'espace Caserne. */
        html:has(body .menu-navigation-principal),html.cis-espace-caserne:has(body .menu-navigation-principal),body:has(.menu-navigation-principal){background:#242424!important}
        html:has(body .menu-navigation-pharmacie),html.cis-espace-caserne:has(body .menu-navigation-pharmacie),body:has(.menu-navigation-pharmacie){background:#1f6a45!important}
        /* v32 : priorité explicite aux couleurs des menus sur iPhone.
           La couleur est appliquée à html ET body, y compris les règles
           génériques rouges de l'espace Caserne. */
        html.cis-menu-accueil,html.cis-menu-accueil body,
        html.cis-menu-accueil body.cis-espace-caserne{background:#242424!important;background-color:#242424!important}
        html.cis-menu-pharmacie,html.cis-menu-pharmacie body,
        html.cis-menu-pharmacie body.cis-espace-caserne{background:#1f6a45!important;background-color:#1f6a45!important}
        html.cis-menu-caserne,html.cis-menu-caserne body,
        html.cis-menu-caserne body.cis-espace-caserne{background:#7d2425!important;background-color:#7d2425!important}
        /* v34 : fond neutre uniquement dans les menus, sans modifier les pages Caserne. */
        body:has(.caserne-menu-page) #app,
        html.cis-espace-caserne body:has(.caserne-menu-page) #app{background:#f3f4f6!important}
        .caserne-shell.caserne-menu-page{background:#f3f4f6!important;color:#28313b}
        .caserne-menu-page .caserne-menu-liste-simple>button{background:#fff;border-color:#dce2e8;color:#28313b;box-shadow:0 3px 12px rgba(30,41,59,.045)}
        .caserne-menu-page .menu-navigation-section-titre{color:#566273}
        .caserne-menu-page .caserne-retour-actualites{color:#334155;border-color:#dce2e8;box-shadow:0 2px 9px rgba(30,41,59,.04)}
        .menu-navigation-pharmacie .caserne-menu-liste-simple>button{border-color:#dce2e8}
        /* Menu visuel : 3 rubriques par ligne sur Accueil, Caserne et Pharmacie. */
        .caserne-menu-page .caserne-menu-liste-simple{grid-template-columns:repeat(3,minmax(0,1fr))}
        .caserne-menu-page .caserne-menu-liste-simple>button{aspect-ratio:1/1;min-height:0}
        .caserne-menu-page .caserne-menu-icone{font-size:30px}
        .caserne-menu-page .caserne-menu-texte strong{font-size:12px}

        .caserne-public-simple .caserne-actu-card{padding:17px;border-radius:17px}.caserne-public-simple .caserne-actu-meta{display:grid;grid-template-columns:1fr;margin-bottom:10px;gap:4px}.caserne-public-simple .caserne-actu-meta span{font-size:12px}.caserne-public-simple .caserne-actu-meta time{text-align:left;color:#4e3b37;font-size:16px;font-weight:900}.caserne-public-simple .caserne-actu-card h2{font-size:22px;line-height:1.2;margin-bottom:10px}.caserne-public-simple .caserne-actu-card p{font-size:16px;line-height:1.55}
        /* Repères visuels très marqués dans le fil d'actualité : pas d'emoji, une couleur fixe par rubrique */
        .caserne-public-simple .caserne-actu-card[class*="caserne-type-"]{position:relative;overflow:hidden;border-left:9px solid var(--caserne-type-couleur,#7d2425);box-shadow:0 6px 18px rgba(80,40,30,.06);padding-top:18px}
        .caserne-public-simple .caserne-actu-card[class*="caserne-type-"] .caserne-actu-meta span{display:inline-flex;width:max-content;max-width:100%;align-items:center;padding:7px 11px;border-radius:8px;background:var(--caserne-type-couleur,#7d2425);color:#fff!important;font-size:13px;font-weight:950;letter-spacing:.7px;line-height:1.1}
        .caserne-public-simple .caserne-type-sport{--caserne-type-couleur:#23824f}
        .caserne-public-simple .caserne-type-manoeuvre{--caserne-type-couleur:#d06a16}
        .caserne-public-simple .caserne-type-reunion{--caserne-type-couleur:#2f6fbd}
        .caserne-public-simple .caserne-type-casernement{--caserne-type-couleur:#7b5b43}
        .caserne-public-simple .caserne-type-amical{--caserne-type-couleur:#8b4ca8}
        .caserne-public-simple .caserne-type-comite_centre{--caserne-type-couleur:#a82f59}
        .caserne-public-simple .caserne-type-administratif{--caserne-type-couleur:#4f5e6d}
        .caserne-public-simple .caserne-type-entretien{--caserne-type-couleur:#177d87}
        .caserne-public-simple .caserne-actu-passee[class*="caserne-type-"]{border-left-color:var(--caserne-type-couleur,#777)!important;box-shadow:none!important}
        .caserne-public-simple .caserne-actu-passee[class*="caserne-type-"] .caserne-actu-meta span{background:var(--caserne-type-couleur,#777)!important;color:#fff!important}
        .caserne-zone-reponse-simple{background:#f8f2f0;border:1px solid #ead7d2!important;border-radius:14px;padding:14px;margin-top:16px}.caserne-question-reponse{display:block;font-size:17px;color:#3f2020;margin-bottom:3px}.caserne-etat-reponse{display:block;color:#78635e;margin-bottom:11px}.caserne-zone-reponse-simple .caserne-boutons-reponse button{min-height:52px;font-size:15px;padding:10px 8px}.caserne-presents-details{margin-top:10px}.caserne-presents-details summary{cursor:pointer;padding:8px 2px;font-weight:800;color:#6a3434;font-size:14px}.caserne-presents-details .caserne-liste-presents{margin-top:6px}
        .caserne-public-simple .caserne-bouton-calendrier{min-height:48px;font-size:14px}.caserne-public-simple .caserne-preparation-bloc{font-size:15px}
        .caserne-anciens-evenements{margin-top:24px;border-top:1px solid #d5c8c4;padding-top:16px}.caserne-anciens-evenements>summary{cursor:pointer;list-style:none;background:#e6dedb;color:#5f5350;border-radius:14px;padding:14px 16px;font-weight:900;text-align:center}.caserne-anciens-evenements>summary::-webkit-details-marker{display:none}.caserne-anciens-evenements[open]>summary{margin-bottom:14px}.caserne-anciens-evenements .caserne-actu-card{opacity:.86}
        @media(max-width:520px){.caserne-raccourcis-publics{grid-template-columns:1fr}.caserne-public-simple .caserne-boutons-reponse{grid-template-columns:1fr}.caserne-nav-bas{height:74px}.caserne-nav-bas>button:not(.caserne-menu-bulle){font-size:11px}.caserne-menu-bulle{width:54px;height:54px;top:10px}}
        @media(min-width:1000px){body:has(.caserne-shell) .sidebar-pc{display:none!important}.caserne-shell{padding-top:20px}.caserne-top{border-radius:28px;margin:0 0 24px}.caserne-nav-bas{bottom:22px}}
    `;
    document.head.appendChild(style);
}


function synchroniserApparencePWACaserne() {
    const pageCaserne = document.querySelector(".caserne-shell");
    const menuPharmacie = Boolean(document.querySelector(".menu-navigation-pharmacie"));
    const menuPrincipal = Boolean(document.querySelector(".menu-navigation-principal"));
    const dansCaserne = Boolean(pageCaserne);
    // Les classes sont indépendantes de la navigation et reflètent
    // exclusivement le menu visible (Accueil, Pharmacie, Caserne).
    document.documentElement.classList.remove("cis-menu-accueil", "cis-menu-pharmacie", "cis-menu-caserne");
    if (document.querySelector(".caserne-menu-page")) {
        document.documentElement.classList.add(menuPharmacie ? "cis-menu-pharmacie" : menuPrincipal ? "cis-menu-accueil" : "cis-menu-caserne");
    }


    let theme = document.querySelector('meta[name="theme-color"]');
    if (!theme) {
        theme = document.createElement("meta");
        theme.name = "theme-color";
        document.head.appendChild(theme);
    }

    let status = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!status) {
        status = document.createElement("meta");
        status.name = "apple-mobile-web-app-status-bar-style";
        document.head.appendChild(status);
    }

    const viewport = document.querySelector('meta[name="viewport"]');

    if (!window.__cisThemeInitial) {
        window.__cisThemeInitial = theme.getAttribute("content") || "#1f2937";
        window.__cisStatusInitial = status.getAttribute("content") || "default";
        window.__cisViewportInitial = viewport ? (viewport.getAttribute("content") || "width=device-width, initial-scale=1.0") : null;
    }

    if (dansCaserne) {
        // La zone derrière l'heure, le Wi-Fi et la batterie doit suivre
        // l'espace réellement affiché, et non simplement la classe caserne-shell.
        const couleurSysteme = menuPharmacie
            ? "#1f6a45"
            : menuPrincipal
                ? "#242424"
                : "#7d2425";

        theme.setAttribute("content", couleurSysteme);
        // Conserver le mode iOS défini dans index.html pour éviter les décalages.
        status.setAttribute("content", window.__cisStatusInitial || "default");
        document.documentElement.classList.add("cis-espace-caserne");
        document.body.classList.add("cis-espace-caserne");
        if (viewport) {
            const base = (window.__cisViewportInitial || viewport.getAttribute("content") || "width=device-width, initial-scale=1.0")
                .replace(/\s*,?\s*viewport-fit\s*=\s*[^,]+/gi, "");
            viewport.setAttribute("content", `${base}, viewport-fit=cover`);
        }
        document.documentElement.style.backgroundColor = couleurSysteme;
        document.body.style.backgroundColor = couleurSysteme;
    } else {
        theme.setAttribute("content", window.__cisThemeInitial || "#1f2937");
        status.setAttribute("content", window.__cisStatusInitial || "default");
        document.documentElement.classList.remove("cis-espace-caserne");
        document.body.classList.remove("cis-espace-caserne");
        if (viewport && window.__cisViewportInitial) viewport.setAttribute("content", window.__cisViewportInitial);
        document.documentElement.style.backgroundColor = "";
        document.body.style.backgroundColor = "";
    }
}

if (!window.__cisThemeObserverInstalle) {
    window.__cisThemeObserverInstalle = true;
    const observerThemeCaserne = new MutationObserver(() => synchroniserApparencePWACaserne());
    observerThemeCaserne.observe(document.documentElement, {subtree:true, childList:true});
    window.addEventListener("pageshow", synchroniserApparencePWACaserne);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) synchroniserApparencePWACaserne();
    });
    setTimeout(synchroniserApparencePWACaserne, 0);
}


function initialiserStylePortailCIS() {

    if (document.getElementById("style-portail-cis")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "style-portail-cis";
    style.textContent = `
        .portail-cis-page {
            max-width: 760px;
            margin: 0 auto;
        }

        .portail-cis-entete {
            margin: 26px 0 30px;
        }

        .portail-cis-entete h1 {
            margin-bottom: 6px;
        }

        .portail-cis-entete p {
            margin: 0;
            opacity: .72;
        }

        .portail-cis-retour {
            margin: 18px 0 20px;
        }

        .portail-cis-espaces {
            display: grid;
            gap: 12px;
        }
        .raccourcis-accueil-rapides{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0 12px}.raccourcis-accueil-rapides button{min-height:64px;border:1px solid #dde2e5;border-radius:15px;background:#fff;display:flex;align-items:center;gap:10px;padding:12px 14px;text-align:left;box-shadow:0 3px 12px rgba(0,0,0,.06)}.raccourcis-accueil-rapides button span{font-size:23px}.raccourcis-accueil-rapides button strong{font-size:14px;color:#20272b}.raccourcis-accueil-rapides .raccourci-logo-appli{width:38px;height:38px;border-radius:10px;object-fit:cover;flex:0 0 38px}

        .portail-cis-carte {
            width: 100%;
            min-height: 82px;
            border: 0;
            border-radius: 16px;
            padding: 18px 20px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: left;
            box-shadow: 0 5px 14px rgba(0,0,0,.10);
            cursor: pointer;
        }

        .portail-cis-caserne {
            background: #741f25;
        }

        .portail-cis-pharmacie {
            background: #205f43;
        }

        .portail-cis-titre {
            font-size: 1.08rem;
            font-weight: 800;
        }

        .portail-cis-fleche {
            font-size: 1.9rem;
            line-height: 1;
            font-weight: 300;
        }

        .espace-caserne-attente {
            margin-top: 28px;
            padding: 28px;
            border-radius: 22px;
            background: #fff;
            border: 1px solid #e1e5e8;
            box-shadow: 0 8px 22px rgba(0,0,0,.06);
        }

        .espace-caserne-attente strong {
            font-size: 1.2rem;
        }

        .bouton-retour-portail {
            width: 100%;
            margin: 0 0 18px;
            padding: 13px 16px;
            border: 1px solid #d9e0e5;
            border-radius: 14px;
            background: #fff;
            color: #27313a;
            font-weight: 700;
            cursor: pointer;
        }

        @media (min-width: 1000px) {
            .portail-cis-page {
                max-width: 980px;
                padding-top: 42px;
            }

            .portail-cis-espaces {
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .portail-cis-carte {
                min-height: 112px;
                padding: 24px 26px;
            }

            .portail-cis-titre {
                font-size: 1.25rem;
            }
        }
    `;

    document.head.appendChild(style);
}

initialiserStylePortailCIS();

/* =========================================================
   ACCUEIL
   ========================================================= */

function connecterBoutonsAccueil() {

    const inventaire =
        document.getElementById(
            "btn-inventaire"
        );


    const retour =
        document.getElementById(
            "btn-retour"
        );


    const historiqueBtn =
        document.getElementById(
            "btn-historique"
        );


    const administration =
        document.getElementById(
            "btn-administration"
        );


    if (inventaire) {

        inventaire.onclick =
            afficherInventaire;

    }


    if (retour) {

        retour.onclick =
            afficherRetourIntervention;

    }


    if (historiqueBtn) {

        historiqueBtn.onclick =
            afficherHistorique;

    }


    if (administration) {

        administration.onclick =
            ouvrirAdministration;

    }

}


function afficherAccueil() {
    if (sessionPrincipaleInvalidee) { afficherConnexion(); return; }

    initialiserStyleConnexion();
    initialiserStyleEspaceCaserne();

    document.body.classList.remove(
        "mode-connexion"
    );

    if (!profilUtilisateurConnecte) {
        afficherConnexion();
        return;
    }


    appliquerVisibiliteElementsConnectes(
        true
    );


    const role =
        obtenirRoleUtilisateur();

    const boutons = [];


    if (
        utilisateurAPermission(
            "acces_inventaire"
        )
    ) {

        boutons.push(`
            <button
                class="menu-button"
                type="button"
                onclick="afficherInventaire()"
            >
                <span class="menu-icon">
                    📦
                </span>
                <span>
                    <strong>
                        Inventaire
                    </strong>
                    <small>
                        Consulter le matériel
                    </small>
                </span>
            </button>
        `);

    }


    if (
        utilisateurAPermission(
            "acces_retour_intervention"
        )
    ) {

        boutons.push(`
            <button
                class="menu-button"
                type="button"
                onclick="afficherRetourIntervention()"
            >
                <span class="menu-icon">
                    🚒
                </span>
                <span>
                    <strong>
                        Retour d'intervention
                    </strong>
                    <small>
                        Enregistrer le matériel utilisé
                    </small>
                </span>
            </button>
        `);

    }


    if (
        utilisateurAPermission(
            "acces_historique"
        )
    ) {

        boutons.push(`
            <button
                class="menu-button"
                type="button"
                onclick="afficherHistorique()"
            >
                <span class="menu-icon">
                    📊
                </span>
                <span>
                    <strong>
                        Historique
                    </strong>
                    <small>
                        Consulter les consommations
                    </small>
                </span>
            </button>
        `);

    }


    if (
        utilisateurAPermission(
            "acces_administration"
        )
    ) {

        boutons.push(`
            <button
                class="menu-button"
                type="button"
                onclick="ouvrirAdministration()"
            >
                <span class="menu-icon">
                    ⚙️
                </span>
                <span>
                    <strong>
                        Administration
                    </strong>
                    <small>
                        Gestion du matériel
                    </small>
                </span>
            </button>
        `);

    }


    if (
        utilisateurEstSPVAdmin()
    ) {

        boutons.push(`
            <button
                class="menu-button"
                type="button"
                onclick="afficherMenuAdministrateurAppli()"
            >
                <span class="menu-icon">
                    🛠️
                </span>
                <span>
                    <strong>
                        Administrateur APPLI
                    </strong>
                    <small>
                        Utilisateurs et notifications
                    </small>
                </span>
            </button>
        `);

    }


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page navigation-fixe-page">

            <div class="utilisateur-entete">

                <button
                    class="retour-button"
                    type="button"
                    onclick="afficherPortailPrincipal()"
                >
                    ← Retour
                </button>

            </div>


            <header class="accueil-header">

                <h1>
                    Pharmacie
                </h1>

            </header>


            <section class="menu-principal">

                ${boutons.join("")}

            </section>

        </main>

        ${navigationPrincipale("pharmacie", "pharmacie")}

    `;

}

/* =========================================================
   INVENTAIRE
   ========================================================= */

async function afficherInventaire() {

    if (!verifierPermissionOuRetourAccueil(
        "acces_inventaire"
    )) {
        return;
    }


    await synchroniserAvantNavigation();

    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page navigation-fixe-page">

            <button
                class="retour-button"
                type="button"
                onclick="afficherAccueil()"
            >
                ← Retour
            </button>


            <h2>Inventaire
            </h2>


            <div class="recherche">

                <input
                    type="search"
                    id="recherche-inventaire"
                    placeholder="🔎 Rechercher un matériel..."
                    autocomplete="off"
                >

            </div>


            <div id="inventaire-contenu"></div>

        </main>

        ${navigationPrincipale("pharmacie", "pharmacie")}

    `;


    document
        .getElementById(
            "recherche-inventaire"
        )
        .addEventListener(
            "input",
            afficherResultatsInventaire
        );


    afficherResultatsInventaire();

}


function afficherResultatsInventaire() {

    const conteneur =
        document.getElementById(
            "inventaire-contenu"
        );


    if (!conteneur) {

        return;

    }


    const recherche =
        (
            document.getElementById(
                "recherche-inventaire"
            )?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    if (recherche) {

        const resultats =
            materiels.filter(
                function (materiel) {

                    return (

                        materiel.nom
                            .toLowerCase()
                            .includes(
                                recherche
                            )

                        ||

                        materiel.reference
                            .toLowerCase()
                            .includes(
                                recherche
                            )

                        ||

                        materiel.emplacement
                            .toLowerCase()
                            .includes(
                                recherche
                            )

                        ||

                        materiel.categories
                            .join(" ")
                            .toLowerCase()
                            .includes(
                                recherche
                            )

                    );

                }
            );


        conteneur.innerHTML = `

            <h3>
                🔎 Résultats
            </h3>

        `;


        if (
            resultats.length === 0
        ) {

            conteneur.innerHTML += `

                <div class="materiel">

                    <h3>
                        ❌ Aucun résultat
                    </h3>

                </div>

            `;

            return;

        }


        resultats.forEach(
            function (materiel) {

                conteneur.innerHTML +=
                    genererCarteInventaire(
                        materiel
                    );

            }
        );


        return;

    }


    conteneur.innerHTML = "";


    CISPharmaCategories.style();
    conteneur.innerHTML = CISPharmaCategories.blocs(categories, materiels, genererCarteInventaire);

}


function basculerCategorie(
    bouton
) {

    const contenu =
        bouton.nextElementSibling;


    if (!contenu) {

        return;

    }


    const ouvert =
        contenu.style.display !== "none";
    bouton.setAttribute("aria-expanded", String(!ouvert));


    if (ouvert) {

        contenu.style.display =
            "none";


        bouton.lastElementChild
            .textContent =
            "▼";

    } else {

        contenu.style.display =
            "block";


        bouton.lastElementChild
            .textContent =
            "▲";

    }

}


/* =========================================================
   CARTE INVENTAIRE
   ========================================================= */

function genererCarteInventaire(
    materiel
) {

    const photo = "";

    const categoriesMateriel =
        materiel.categories
            .map(nom => echapperHTML(CISPharmaCategories.chemin(nom)))
            .join(
                " • "
            );


    let alerte = "";


    if (
        materiel.minimum > 0 &&
        materiel.stock <=
        materiel.minimum
    ) {

        alerte = `

            <div class="alerte-stock">
                ⚠️ Stock faible
            </div>

        `;

    }


    return `

        <matériel
            class="
                materiel
                carte-materiel-horizontal
            "
        >

            <div class="carte-texte">

                <h3>
                    ${echapperHTML(
                        materiel.nom
                    )}
                </h3>


                ${
                    materiel.reference
                    ?
                    `
                    <p>

                        <strong>
                            Référence :
                        </strong>

                        ${echapperHTML(
                            materiel.reference
                        )}

                    </p>
                    `
                    :
                    ""
                }


                ${
                    materiel.description
                    ?
                    `
                    <p>
                        ${echapperHTML(
                            materiel.description
                        )}
                    </p>
                    `
                    :
                    ""
                }


                <div class="stock-ligne">

                    <span>
                        Stock :
                    </span>

                    <strong>
                        ${materiel.stock}
                    </strong>

                </div>


                ${
                    materiel.emplacement
                    ?
                    `
                    <p>
                        📍
                        ${echapperHTML(
                            materiel.emplacement
                        )}
                    </p>
                    `
                    :
                    ""
                }


                ${
                    categoriesMateriel
                    ?
                    `
                    <p class="categories-materiel">
                        ${categoriesMateriel}
                    </p>
                    `
                    :
                    ""
                }


                ${alerte}

            </div>


            ${photo}

        </matériel>

    `;

}



/* =========================================================
   INTERFACE STOCK ET QUANTITÉS
   ========================================================= */

function initialiserStylesStockEtRetour() {

    if (
        document.getElementById(
            "style-stock-retour-v21"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );

    style.id =
        "style-stock-retour-v21";

    style.textContent = `
        input[type="date"] {
            display: block;
            width: 100%;
            max-width: 100%;
            min-width: 0;
            box-sizing: border-box;
            -webkit-appearance: none;
            appearance: none;
        }

        .quantite-retour-zone {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 12px;
        }

        .quantite-controle-retour {
            display: inline-flex;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
            touch-action: manipulation;
        }

        .quantite-controle-retour button {
            width: 42px;
            height: 42px;
            min-width: 42px;
            border: 1px solid #d8dce2;
            border-radius: 11px;
            background: #f4f5f7;
            color: #111;
            font-size: 24px;
            font-weight: 700;
            line-height: 1;
            cursor: pointer;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        .quantite-controle-retour button:active {
            transform: scale(.96);
            background: #e9ebee;
        }

        .select-quantite-retour {
            min-width: 62px;
            height: 42px;
            border: 1px solid #d8dce2;
            border-radius: 11px;
            background: #fff;
            padding: 0 25px 0 12px;
            color: #111;
            font-size: 17px;
            font-weight: 800;
            text-align: center;
            text-align-last: center;
            cursor: pointer;
            touch-action: manipulation;
        }

        .modal-stock-fond {
            position: fixed;
            inset: 0;
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 22px;
            box-sizing: border-box;
            background: rgba(0,0,0,.38);
        }

        .modal-stock-carte {
            width: min(100%, 430px);
            max-height: calc(100vh - 44px);
            overflow-y: auto;
            box-sizing: border-box;
            background: #fff;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 18px 50px rgba(0,0,0,.22);
        }

        .modal-stock-carte h3 {
            margin: 0 0 6px;
            font-size: 21px;
        }

        .modal-stock-actuel {
            margin: 0 0 18px;
            color: #62666d;
        }

        .modal-stock-bloc {
            border: 1px solid #e0e3e7;
            border-radius: 14px;
            padding: 14px;
            margin-top: 12px;
        }

        .modal-stock-bloc label {
            display: block;
            margin-bottom: 8px;
            font-weight: 800;
        }

        .modal-stock-bloc input {
            width: 100%;
            min-height: 48px;
            box-sizing: border-box;
            border: 1px solid #d5d9df;
            border-radius: 11px;
            padding: 9px 12px;
            font: inherit;
            font-size: 17px;
            background: #fff;
        }

        .modal-stock-bloc small {
            display: block;
            margin-top: 7px;
            color: #73777e;
            line-height: 1.3;
        }

        .modal-stock-actions {
            display: grid;
            gap: 9px;
            margin-top: 12px;
        }

        .modal-stock-actions button,
        .modal-stock-annuler {
            width: 100%;
            min-height: 44px;
            border: 0;
            border-radius: 11px;
            font: inherit;
            font-weight: 800;
            cursor: pointer;
            touch-action: manipulation;
        }

        .modal-stock-actions button {
            background: #1687ff;
            color: #fff;
        }

        .modal-stock-annuler {
            margin-top: 14px;
            background: #eef0f3;
            color: #222;
        }

        @media (max-width: 520px) {
            .carte-retour-horizontal .carte-texte {
                min-width: 0;
            }

            .carte-retour-horizontal .carte-photo-droite {
                align-self: flex-start;
            }
        }
    `;


    document.head.appendChild(
        style
    );

}


function fermerFenetreStock() {

    document.getElementById(
        "modal-stock-fond"
    )?.remove();

}


function ouvrirFenetreStock(
    id
) {

    initialiserStylesStockEtRetour();


    const materiel =
        materiels.find(
            function (m) {
                return String(m.id) === String(id);
            }
        );


    if (!materiel) {
        return;
    }


    fermerFenetreStock();


    const fond =
        document.createElement(
            "div"
        );

    fond.id =
        "modal-stock-fond";

    fond.className =
        "modal-stock-fond";


    fond.innerHTML = `

        <div
            class="modal-stock-carte"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-modal-stock"
        >

            <h3 id="titre-modal-stock">
                ${echapperHTML(materiel.nom)}
            </h3>

            <p class="modal-stock-actuel">
                Stock actuel :
                <strong>
                    ${Number(materiel.stock || 0)}
                </strong>
            </p>


            <div class="modal-stock-bloc">

                <label for="stock-total-modal">
                    Stock total
                </label>

                <input
                    id="stock-total-modal"
                    type="number"
                    min="0"
                    step="1"
                    inputmode="numeric"
                    value="${Number(materiel.stock || 0)}"
                >

                <small>
                    Permet de remplacer directement le stock actuel par le nombre indiqué.
                </small>

                <div class="modal-stock-actions">

                    <button
                        type="button"
                        onclick="enregistrerStockTotal('${String(materiel.id)}')"
                    >
                        Enregistrer le stock total
                    </button>

                </div>

            </div>


            <div class="modal-stock-bloc">

                <label for="stock-ajoute-modal">
                    Nombre rajouté au stock
                </label>

                <input
                    id="stock-ajoute-modal"
                    type="number"
                    min="1"
                    step="1"
                    inputmode="numeric"
                    placeholder="Ex : 10"
                >

                <small>
                    Le nombre indiqué sera ajouté au stock actuel.
                </small>

                <div class="modal-stock-actions">

                    <button
                        type="button"
                        onclick="ajouterAuStock('${String(materiel.id)}')"
                    >
                        Ajouter au stock
                    </button>

                </div>

            </div>


            <button
                class="modal-stock-annuler"
                type="button"
                onclick="fermerFenetreStock()"
            >
                Annuler
            </button>

        </div>

    `;


    fond.addEventListener(
        "click",
        function (event) {

            if (event.target === fond) {
                fermerFenetreStock();
            }

        }
    );


    document.body.appendChild(
        fond
    );

}


function appliquerNouveauStock(
    materiel,
    nouveauStock,
    comptage = false
) {

    const stockFinal =
        Math.floor(
            Number(nouveauStock)
        );


    if (
        !Number.isFinite(stockFinal) ||
        stockFinal < 0
    ) {

        alert(
            "Stock invalide."
        );

        return false;
    }


    const ancienStock =
        Number(
            materiel.stock
        );


    materiel.stock =
        stockFinal;


    preparerNotificationStock(
        materiel,
        ancienStock,
        comptage ? ancienStock : null
    );


    sauvegarderToutesLesDonnees();

    void synchroniserApresModification();


    return true;

}


function enregistrerStockTotal(
    id
) {

    const materiel =
        materiels.find(
            function (m) {
                return String(m.id) === String(id);
            }
        );


    if (!materiel) {
        return;
    }


    const valeur =
        document.getElementById(
            "stock-total-modal"
        )?.value;


    if (
        valeur === "" ||
        valeur === undefined
    ) {

        alert(
            "Indique le stock total."
        );

        return;
    }


    if (
        !appliquerNouveauStock(
            materiel,
            valeur,
            true
        )
    ) {
        return;
    }


    fermerFenetreStock();

    alert(
        "Comptage enregistré sur cet appareil, en attente de confirmation du serveur."
    );

    gestionMateriels();

}


function ajouterAuStock(
    id
) {

    const materiel =
        materiels.find(
            function (m) {
                return String(m.id) === String(id);
            }
        );


    if (!materiel) {
        return;
    }


    const valeur =
        Number(
            document.getElementById(
                "stock-ajoute-modal"
            )?.value
        );


    if (
        !Number.isFinite(valeur) ||
        valeur <= 0
    ) {

        alert(
            "Indique un nombre à ajouter supérieur à 0."
        );

        return;
    }


    const nouveauStock =
        Number(
            materiel.stock || 0
        ) +
        Math.floor(
            valeur
        );


    if (
        !appliquerNouveauStock(
            materiel,
            nouveauStock
        )
    ) {
        return;
    }


    fermerFenetreStock();

    alert(
        "Stock ajouté."
    );

    gestionMateriels();

}


/* =========================================================
   RETOUR D'INTERVENTION
   ========================================================= */

async function afficherRetourIntervention() {

    initialiserStylesStockEtRetour();

    if (!verifierPermissionOuRetourAccueil(
        "acces_retour_intervention"
    )) {
        return;
    }


    await synchroniserAvantNavigation();

    consommationsEnCours = {};
    if (navigator.onLine) void chargerSignaturePharmacie().catch(() => {});


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page navigation-fixe-page">

            <button
                class="retour-button"
                onclick="afficherAccueil()"
            >
                ← Retour
            </button>


            <h2>Retour d'intervention
            </h2>


            <div class="formulaire">

                <label>
                    Date
                </label>


                <input
                    type="date"
                    id="date-intervention"
                    value="${dateAujourdhui()}"
                >


                <label>
                    Numéro d'intervention
                </label>


                <input
                    type="text"
                    id="numero-intervention"
                    placeholder="Ex : 2026-001"
                >

            </div>


            <section class="formulaire" style="margin:15px 0;padding:15px;background:#f3faf5;border-radius:15px">
                <strong>Contrôles au retour d’intervention</strong>
                <label style="display:flex;align-items:center;gap:12px;margin:12px 0"><input type="checkbox" id="controle-meducore-retour" style="width:22px;height:22px"> Contrôle du Meducore</label>
                <label style="display:flex;align-items:center;gap:12px;margin:12px 0"><input type="checkbox" id="entretien-vsav-retour" style="width:22px;height:22px"> Entretien du VSAV</label>
                <p id="statut-controles-pharmacie" role="status">${echapperHTML(texteStatutControlesPharmacie())}</p>
            </section>

            <div class="recherche">

                <input
                    type="search"
                    id="recherche-retour"
                    placeholder="🔎 Rechercher un matériel..."
                >

            </div>


            <div
                id="categories-retour"
            ></div>


            <div
                id="resultats-retour"
                style="display:none"
            ></div>


            <div
                id="resume-consommation"
            ></div>


            <button
                class="add-button"
                onclick="
                    validerRetourIntervention()
                "
            >

                ✓ Enregistrer le retour

            </button>

        </main>

        ${navigationPrincipale("pharmacie", "pharmacie")}

    `;


    document
        .getElementById(
            "recherche-retour"
        )
        .addEventListener(
            "input",
            rechercherMaterielRetour
        );


    afficherCategoriesRetour();

}


function afficherCategoriesRetour() {
    const conteneur=document.getElementById('categories-retour');
    CISPharmaCategories.style();
    if(conteneur) conteneur.innerHTML=CISPharmaCategories.blocs(categories,materiels,genererCarteRetour);
}

/* =========================================================
   CARTE RETOUR
   ========================================================= */

function genererCarteRetour(
    materiel
) {

    const id =
        String(
            materiel.id
        );


    const quantite =
        Number(
            consommationsEnCours[id] ||
            0
        );


    const photo = "";

    let optionsQuantite =
        `<option value="0" ${quantite === 0 ? "selected" : ""}>0</option>`;


    for (
        let nombre = 1;
        nombre <= 99;
        nombre += 1
    ) {

        const indisponible =
            nombre >
            Number(
                materiel.stock
            );

        optionsQuantite += `
            <option
                value="${nombre}"
                ${nombre === quantite ? "selected" : ""}
                ${indisponible ? "disabled" : ""}
            >
                ${nombre}
            </option>
        `;

    }


    return `

        <matériel
            class="
                materiel
                carte-materiel-horizontal
                carte-retour-horizontal
            "
        >

            <div class="carte-texte">

                <h3>
                    ${echapperHTML(
                        materiel.nom
                    )}
                </h3>


                ${
                    materiel.reference
                    ?
                    `
                    <p>
                        Référence :
                        ${echapperHTML(
                            materiel.reference
                        )}
                    </p>
                    `
                    :
                    ""
                }


                <p>
                    Stock :
                    <strong>
                        ${materiel.stock}
                    </strong>
                </p>


                <div class="quantite-retour-zone">

                    <div class="quantite-controle-retour">

                        <button
                            type="button"
                            aria-label="Diminuer"
                            onclick="diminuerConsommation('${id}')"
                        >
                            −
                        </button>


                        <select
                            class="select-quantite-retour"
                            id="quantite-retour-${id}"
                            aria-label="Quantité utilisée"
                            onchange="selectionnerQuantiteRetour('${id}', this.value)"
                        >
                            ${optionsQuantite}
                        </select>


                        <button
                            type="button"
                            aria-label="Augmenter"
                            onclick="augmenterConsommation('${id}')"
                        >
                            +
                        </button>

                    </div>

                </div>

            </div>


            ${photo}

        </matériel>

    `;

}

/* =========================================================
   AUGMENTER / DIMINUER
   ========================================================= */

function augmenterConsommation(
    id
) {

    const materiel =
        materiels.find(
            function (m) {

                return (
                    String(m.id) ===
                    String(id)
                );

            }
        );


    if (!materiel) {

        return;

    }


    const cle =
        String(id);


    const actuelle =
        Number(
            consommationsEnCours[cle]
            ||
            0
        );


    if (
        actuelle >=
        Number(
            materiel.stock
        )
    ) {

        alert(
            "⚠️ Stock disponible insuffisant."
        );

        return;

    }


    consommationsEnCours[cle] =
        actuelle + 1;


    mettreAJourQuantiteRetour(
        cle
    );


    mettreAJourResume();

}


function diminuerConsommation(
    id
) {

    const cle =
        String(id);


    const actuelle =
        Number(
            consommationsEnCours[cle]
            ||
            0
        );


    if (
        actuelle <= 0
    ) {

        return;

    }


    const nouvelle =
        actuelle - 1;


    if (
        nouvelle === 0
    ) {

        delete consommationsEnCours[
            cle
        ];

    } else {

        consommationsEnCours[cle] =
            nouvelle;

    }


    mettreAJourQuantiteRetour(
        cle
    );


    mettreAJourResume();

}



function selectionnerQuantiteRetour(
    id,
    valeur
) {

    const cle =
        String(id);


    const materiel =
        materiels.find(
            function (m) {
                return String(m.id) === cle;
            }
        );


    if (!materiel) {
        return;
    }


    let quantite =
        Math.floor(
            Number(
                valeur
            )
        );


    if (
        !Number.isFinite(quantite) ||
        quantite < 0
    ) {
        quantite = 0;
    }


    quantite =
        Math.min(
            99,
            quantite
        );


    if (
        quantite >
        Number(
            materiel.stock
        )
    ) {

        alert(
            "Stock disponible insuffisant."
        );

        quantite =
            Math.min(
                99,
                Number(
                    materiel.stock
                )
            );

    }


    if (
        quantite <= 0
    ) {

        delete consommationsEnCours[
            cle
        ];

    } else {

        consommationsEnCours[cle] =
            quantite;

    }


    mettreAJourQuantiteRetour(
        cle
    );


    mettreAJourResume();

}


/* =========================================================
   MISE A JOUR DU COMPTEUR
   ========================================================= */

function mettreAJourQuantiteRetour(
    id
) {

    const cle =
        String(id);


    const element =
        document.getElementById(
            "quantite-retour-" +
            cle
        );


    if (!element) {

        console.error(
            "Élément quantité introuvable pour :",
            cle
        );

        return;

    }


    const valeur =
        String(
            consommationsEnCours[cle]
            ||
            0
        );


    if (
        element.tagName ===
        "SELECT"
    ) {

        element.value =
            valeur;

    } else {

        element.textContent =
            valeur;

    }

}


/* =========================================================
   RECHERCHE RETOUR
   ========================================================= */

function rechercherMaterielRetour() {

    const champ =
        document.getElementById(
            "recherche-retour"
        );


    const categoriesConteneur =
        document.getElementById(
            "categories-retour"
        );


    const resultatsConteneur =
        document.getElementById(
            "resultats-retour"
        );


    if (
        !champ ||
        !categoriesConteneur ||
        !resultatsConteneur
    ) {

        return;

    }


    const texte =
        champ.value
            .trim()
            .toLowerCase();


    if (!texte) {

        categoriesConteneur.style.display =
            "block";


        resultatsConteneur.style.display =
            "none";


        return;

    }


    const resultats =
        materiels.filter(
            function (materiel) {

                return (

                    materiel.nom
                        .toLowerCase()
                        .includes(
                            texte
                        )

                    ||

                    materiel.reference
                        .toLowerCase()
                        .includes(
                            texte
                        )

                    ||

                    materiel.categories
                        .join(" ")
                        .toLowerCase()
                        .includes(
                            texte
                        )

                );

            }
        );


    categoriesConteneur.style.display =
        "none";


    resultatsConteneur.style.display =
        "block";


    resultatsConteneur.innerHTML = `

        <h3>
            🔎 Résultats
        </h3>

    `;


    if (
        resultats.length === 0
    ) {

        resultatsConteneur.innerHTML += `

            <div class="materiel">

                <h3>
                    ❌ Aucun résultat
                </h3>

            </div>

        `;

        return;

    }


    resultatsConteneur.innerHTML +=
        resultats
            .map(
                genererCarteRetour
            )
            .join("");

}


/* =========================================================
   RESUME CONSOMMATION
   ========================================================= */

function mettreAJourResume() {

    const conteneur =
        document.getElementById(
            "resume-consommation"
        );


    if (!conteneur) {

        return;

    }


    const ids =
        Object.keys(
            consommationsEnCours
        );


    if (
        ids.length === 0
    ) {

        conteneur.innerHTML =
            "";

        return;

    }


    let html = `

        <div
            class="resume"
        >

            <h3>
                📋 Matériel sélectionné
            </h3>

    `;


    ids.forEach(
        function (id) {

            const materiel =
                materiels.find(
                    function (m) {

                        return (
                            String(m.id) ===
                            String(id)
                        );

                    }
                );


            if (!materiel) {

                return;

            }


            html += `

                <p>

                    ${echapperHTML(
                        materiel.nom
                    )}

                    :

                    <strong>
                        ${consommationsEnCours[id]}
                    </strong>

                </p>

            `;

        }
    );


    html += `
        </div>
    `;


    conteneur.innerHTML =
        html;

}


/* =========================================================
   VALIDATION RETOUR
   ========================================================= */

async function validerRetourIntervention() {

    if (
        validationRetourInterventionEnCours
    ) {

        return;

    }

    const date =
        document.getElementById(
            "date-intervention"
        )?.value;


    const numero =
        document.getElementById(
            "numero-intervention"
        )?.value.trim();


    if (!date) {

        alert(
            "Renseigne la date."
        );

        return;

    }


    if (!numero) {

        alert(
            "Renseigne le numéro d'intervention."
        );

        return;

    }


    const meducoreCoche = Boolean(document.getElementById("controle-meducore-retour")?.checked);
    const vsavCoche = Boolean(document.getElementById("entretien-vsav-retour")?.checked);
    let signatureRetour = null;
    if (vsavCoche) {
        const proprietaireSignature = String(utilisateurConnecte?.id || "");
        if (navigator.onLine) {
            try {
                signatureRetour = await chargerSignaturePharmacie();
                if (!signatureRetour) {
                    alert("Enregistre d’abord ta signature dans Mon profil pour valider l’entretien VSAV.");
                    return;
                }
            } catch (e) {
                // Une coupure pendant la validation ne doit pas empêcher la sauvegarde locale.
                signatureRetour = lireSignaturePharmacieCache(proprietaireSignature);
            }
        } else {
            signatureRetour = lireSignaturePharmacieCache(proprietaireSignature);
        }
        // Sans copie locale, la signature sera recherchée au retour du réseau,
        // exclusivement pour l'agent qui a validé ce retour.
    }

    const ids =
        Object.keys(
            consommationsEnCours
        );


    if (
        ids.length === 0
    ) {

        alert(
            "Sélectionne au moins un matériel."
        );

        return;

    }


    for (
        let i = 0;
        i < ids.length;
        i++
    ) {

        const id =
            ids[i];


        const materiel =
            materiels.find(
                function (m) {

                    return (
                        String(m.id) ===
                        String(id)
                    );

                }
            );


        if (!materiel) {

            continue;

        }


        const quantite =
            Number(
                consommationsEnCours[id]
            );


        if (
            quantite >
            Number(
                materiel.stock
            )
        ) {

            alert(
                "Stock insuffisant pour : " +
                materiel.nom
            );

            return;

        }

    }


    if (
        !await afficherConfirmationCIS(
            "Confirmer l'enregistrement du retour d'intervention ?"
        )
    ) {

        return;

    }


    validationRetourInterventionEnCours =
        true;


    while (synchronisationSupabaseEnCours) {
        await new Promise(resolve => setTimeout(resolve, 80));
    }
    const idRetourPourControles = genererUUID();
    // Write the durable control journal before changing stocks or clearing the form.
    try {
        mettreControlesPharmacieEnAttente({
            interventionId: idRetourPourControles, date, numero,
            meducore: meducoreCoche, vsav: vsavCoche, signature: signatureRetour
        });
    } catch (e) {
        validationRetourInterventionEnCours = false;
        alert("Impossible de sauvegarder les contrôles sur cet appareil. Libère de l’espace puis réessaie. " + e.message);
        return;
    }
    const consommations = [];


    ids.forEach(
        function (id) {

            const materiel =
                materiels.find(
                    function (m) {

                        return (
                            String(m.id) ===
                            String(id)
                        );

                    }
                );


            if (!materiel) {

                return;

            }


            const quantite =
                Number(
                    consommationsEnCours[id]
                );


            const ancienStock =
                Number(
                    materiel.stock
                );


            materiel.stock =
                Math.max(
                    0,
                    ancienStock -
                    quantite
                );


            preparerNotificationStock(
                materiel,
                ancienStock
            );


            consommations.push({

                materielId:
                    materiel.id,

                materiel:
                    materiel.nom,

                quantite:
                    quantite

            });

        }
    );


    historique.push({

        id:
            idRetourPourControles,

        date:
            date,

        numeroIntervention:
            numero,

        createdBy:
            String(utilisateurConnecte?.id || ""),

        createdByPrenom:
            String(profilUtilisateurConnecte?.prenom || ""),

        createdByNom:
            String(profilUtilisateurConnecte?.nom || ""),

        createdAt:
            new Date().toISOString(),

        consommations:
            consommations,

        synchronisationEnAttente:
            true

    });


    sauvegarderToutesLesDonnees();
    marquerModificationsEnAttente();


    consommationsEnCours = {};


    try {

        const synchronise =
            await synchroniserApresModification();

        if (!navigator.onLine) {

            console.info("Retour enregistré hors connexion ; synchronisation ultérieure.");

        } else if (synchronise) {

            console.info("Retour d'intervention enregistré et synchronisé.");

        } else {

            alert(
                "⚠️ Retour enregistré sur cet appareil, mais la synchronisation avec la base de données a échoué. Les données sont conservées et pourront être renvoyées."
            );

        }

        await animationValidationEnregistrementCIS("Retour d’intervention enregistré", () => afficherHistorique());

    } finally {

        validationRetourInterventionEnCours =
            false;

    }

}


/* =========================================================
   HISTORIQUE
   ========================================================= */

async function afficherHistorique() {

    if (!verifierPermissionOuRetourAccueil(
        "acces_historique"
    )) {
        return;
    }


    await synchroniserAvantNavigation();

    initialiserStylesArchivesHistorique();

    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page navigation-fixe-page">

            <button
                class="retour-button"
                onclick="afficherAccueil()"
            >
                ← Retour
            </button>


            <h2>Historique
            </h2>
            <p id="statut-controles-pharmacie" role="status">${echapperHTML(texteStatutControlesPharmacie())}</p>


            <h3>Total consommé par matériel
            </h3>


            <div
                id="historique-total"
            ></div>


            <h3
                class="titre-interventions"
            >Historique des interventions
            </h3>


            <div
                id="historique-interventions"
            ></div>


            ${
                utilisateurAPermission("acces_archives")
                    ? `
                        <div class="archives-historique-lien-zone">
                            <button
                                type="button"
                                class="archives-historique-lien"
                                onclick="afficherArchivesHistorique()"
                            >
                                Consulter les archives
                            </button>
                        </div>
                    `
                    : ""
            }

        </main>

        ${navigationPrincipale("pharmacie", "pharmacie")}

    `;


    afficherHistoriqueTotal();

    afficherHistoriqueInterventions();

}



/* =========================================================
   ARCHIVES DE L'HISTORIQUE
   ========================================================= */

function initialiserStylesArchivesHistorique() {

    if (
        document.getElementById(
            "style-archives-historique"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");

    style.id =
        "style-archives-historique";

    style.textContent = `
        .archives-historique-lien-zone {
            margin: 28px 0 14px;
            text-align: center;
        }

        .archives-historique-lien {
            border: 0;
            padding: 8px 10px;
            background: transparent;
            color: #1687ff;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            touch-action: manipulation;
        }

        .archive-periode {
            margin-bottom: 28px;
        }

        .archive-commande {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            box-sizing: border-box;
            margin: 0 0 10px;
            padding: 16px 18px;
            border: 0;
            border-radius: 14px;
            background: #218c4b;
            color: #fff;
            text-align: left;
            font: inherit;
            cursor: pointer;
            box-shadow: 0 5px 16px rgba(0,0,0,.12);
            touch-action: manipulation;
        }

        .archive-commande strong {
            display: block;
            font-size: 17px;
            line-height: 1.25;
        }

        .archive-commande small {
            display: block;
            margin-top: 4px;
            color: rgba(255,255,255,.86);
            font-size: 13px;
        }

        .archive-commande .fleche-detail {
            color: #fff;
            font-size: 28px;
        }

        .archive-export-pdf {
            width: 100%;
            margin: 9px 0 13px;
            border: 2px solid #7d2425;
            border-radius: 12px;
            padding: 12px 14px;
            background: #fff;
            color: #7d2425;
            font: inherit;
            font-weight: 900;
            cursor: pointer;
        }

        .archive-export-pdf-detail {
            margin-top: 18px;
        }

        .archive-interventions-titre {
            margin: 11px 4px 8px;
            color: #70757a;
            font-size: 13px;
            font-weight: 700;
        }

        .archive-vide {
            margin-top: 18px;
        }
    `;


    document.head.appendChild(style);

}


function trouverArchiveHistorique(
    archiveId
) {

    return archivesHistorique.find(
        function (archive) {

            return (
                String(archive.id) ===
                String(archiveId)
            );

        }
    );

}


function calculerTotauxArchive(
    archive
) {

    const totaux =
        new Map();


    (
        Array.isArray(archive?.interventions)
            ? archive.interventions
            : []
    ).forEach(
        function (intervention) {

            (
                Array.isArray(
                    intervention.consommations
                )
                    ? intervention.consommations
                    : []
            ).forEach(
                function (consommation) {

                    const id =
                        String(
                            consommation.materielId ||
                            consommation.materiel ||
                            ""
                        );

                    if (!id) {
                        return;
                    }

                    const ancienne =
                        totaux.get(id) || {
                            materielId:
                                String(
                                    consommation.materielId ||
                                    ""
                                ),
                            materiel:
                                String(
                                    consommation.materiel ||
                                    "Matériel"
                                ),
                            quantite: 0
                        };

                    ancienne.quantite +=
                        Math.max(
                            0,
                            Number(
                                consommation.quantite ||
                                0
                            )
                        );

                    totaux.set(
                        id,
                        ancienne
                    );

                }
            );

        }
    );


    return Array.from(
        totaux.values()
    ).sort(
        function (a, b) {

            return (
                b.quantite -
                a.quantite
            );

        }
    );

}


async function afficherArchivesHistorique() {

    if (
        !verifierPermissionOuRetourAccueil(
            "acces_archives"
        )
    ) {
        return;
    }


    await synchroniserAvantNavigation();

    initialiserStylesArchivesHistorique();


    const archivesTriees =
        [...archivesHistorique]
            .sort(
                function (a, b) {

                    const dateCreationA =
                        Date.parse(
                            a.createdAt ||
                            a.created_at ||
                            ""
                        );

                    const dateCreationB =
                        Date.parse(
                            b.createdAt ||
                            b.created_at ||
                            ""
                        );

                    if (
                        Number.isFinite(dateCreationA) &&
                        Number.isFinite(dateCreationB) &&
                        dateCreationA !== dateCreationB
                    ) {
                        return dateCreationB - dateCreationA;
                    }

                    return String(
                        b.date || ""
                    ).localeCompare(
                        String(a.date || "")
                    );

                }
            );


    let contenu = "";


    if (
        archivesTriees.length === 0
    ) {

        contenu = `

            <div
                class="materiel archive-vide"
            >
                ${derniereErreurLectureArchives || !derniereLecturePharmacieReussie ? "Archives indisponibles pour le moment. Reconnexion automatique en cours ; aucune archive n’a été supprimée." : "Aucune archive pour le moment."}
            </div>

        `;

    } else {

        contenu =
            creerListeHistoriqueProgressive(archivesTriees, 5, lot => lot.map(
                function (archive) {

                    const interventions =
                        Array.isArray(
                            archive.interventions
                        )
                            ? archive.interventions
                            : [];


                    const cartesInterventions =
                        [...interventions]
                            .reverse()
                            .map(
                                function (intervention) {

                                    const total =
                                        (
                                            Array.isArray(
                                                intervention.consommations
                                            )
                                                ? intervention.consommations
                                                : []
                                        ).reduce(
                                            function (
                                                somme,
                                                consommation
                                            ) {

                                                return (
                                                    somme +
                                                    Number(
                                                        consommation.quantite ||
                                                        0
                                                    )
                                                );

                                            },
                                            0
                                        );


                                    return `

                                        <button
                                            type="button"
                                            class="
                                                detail-historique
                                                intervention-cliquable
                                            "
                                            onclick="
                                                afficherDetailInterventionArchive(
                                                    '${archive.id}',
                                                    '${intervention.id}'
                                                )
                                            "
                                        >

                                            <div>

                                                <strong>
                                                    Intervention
                                                    ${echapperHTML(
                                                        intervention.numeroIntervention ||
                                                        ""
                                                    )}
                                                </strong>

                                                <span>
                                                    ${formaterDate(
                                                        intervention.date
                                                    )}
                                                </span>

                                                <small>
                                                    Cliquer pour voir le détail
                                                </small>

                                            </div>


                                            <div
                                                class="intervention-total"
                                            >

                                                <strong>
                                                    ${total}
                                                </strong>

                                                <span>
                                                    utilisés
                                                </span>

                                            </div>


                                            <span
                                                class="fleche-detail"
                                            >
                                                ›
                                            </span>

                                        </button>

                                    `;

                                }
                            )
                            .join("");


                    return `

                        <section
                            class="archive-periode"
                        >

                            <button
                                type="button"
                                class="archive-commande"
                                onclick="
                                    afficherDetailCommandeArchive(
                                        '${archive.id}'
                                    )
                                "
                            >

                                <div>

                                    <strong>
                                        Commande effectuée
                                    </strong>

                                    <small>
                                        ${formaterDate(
                                            archive.date
                                        )}
                                    </small>

                                </div>


                                <span
                                    class="fleche-detail"
                                >
                                    ›
                                </span>

                            </button>

                            <div
                                class="archive-interventions-titre"
                            >
                                Interventions archivées
                            </div>


                            ${
                                cartesInterventions ||
                                `
                                    <div class="materiel">
                                        Aucune intervention.
                                    </div>
                                `
                            }

                        </section>

                    `;

                }
            ).join(""));

    }


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page navigation-fixe-page">

            <button
                class="retour-button"
                onclick="afficherHistorique()"
            >
                ← Retour
            </button>


            <h2 data-archives-pharmacie>
                Archives de l'historique
            </h2>


            ${contenu}

        </main>

        ${navigationPrincipale("pharmacie", "pharmacie")}

    `;

    void initialiserListesHistoriquesProgressives();
}


function afficherDetailCommandeArchive(
    archiveId
) {

    initialiserStylesReapprovisionnementArchive();

    if (
        !verifierPermissionOuRetourAccueil(
            "acces_historique"
        )
    ) {
        return;
    }


    const archive =
        trouverArchiveHistorique(
            archiveId
        );


    if (!archive) {

        alert(
            "Archive introuvable."
        );

        return;

    }


    const totaux =
        calculerTotauxArchive(
            archive
        );


    const lignes =
        totaux.length > 0
            ? totaux.map(
                function (ligne) {

                    return `

                        <div
                            class="detail-historique"
                        >

                            <div>

                                <strong>
                                    ${echapperHTML(
                                        ligne.materiel
                                    )}
                                </strong>

                            </div>


                            <strong
                                class="detail-quantite"
                            >
                                ${ligne.quantite}
                            </strong>

                        </div>

                    `;

                }
            ).join("")
            : `
                <div class="materiel">
                    Aucun matériel consommé.
                </div>
            `;


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page">

            <button
                class="retour-button"
                onclick="afficherArchivesHistorique()"
            >
                ← Retour
            </button>


            <h2>
                Commande effectuée
            </h2>


            <div
                class="detail-header"
            >

                <strong>
                    Consommations depuis la remise à zéro précédente
                </strong>

                <span>
                    Date :
                    ${formaterDate(
                        archive.date
                    )}
                </span>

                <span>
                    ${
                        Array.isArray(
                            archive.interventions
                        )
                            ? archive.interventions.length
                            : 0
                    }
                    intervention(s)
                </span>

            </div>


            <h3>
                Matériel consommé
            </h3>


            ${lignes}

            ${
                utilisateurAPermission(
                    "acces_administration"
                )
                    ? `
                        <button
                            type="button"
                            class="archive-reappro-bouton"
                            onclick="afficherReapprovisionnementArchive('${String(archive.id)}')"
                        >
                            Réapprovisionnement rapide
                        </button>
                    `
                    : ""
            }

            ${utilisateurPeutExporterPharmaciePDF() ? `
                <button
                    type="button"
                    class="archive-export-pdf archive-export-pdf-detail"
                    onclick="exporterCommandeArchivePDF('${String(archive.id)}')"
                >
                    Exporter la commande en PDF
                </button>
            ` : ""}

        </main>

    `;

}


function afficherDetailInterventionArchive(
    archiveId,
    interventionId
) {

    if (
        !verifierPermissionOuRetourAccueil(
            "acces_historique"
        )
    ) {
        return;
    }


    const archive =
        trouverArchiveHistorique(
            archiveId
        );


    const intervention =
        archive &&
        Array.isArray(
            archive.interventions
        )
            ? archive.interventions.find(
                function (item) {

                    return (
                        String(item.id) ===
                        String(interventionId)
                    );

                }
            )
            : null;


    if (!intervention) {

        alert(
            "Intervention archivée introuvable."
        );

        return;

    }


    const consommations =
        Array.isArray(
            intervention.consommations
        )
            ? intervention.consommations
            : [];


    const lignes =
        consommations.length > 0
            ? consommations.map(
                function (consommation) {

                    return `

                        <div
                            class="detail-historique"
                        >

                            <div>

                                <strong>
                                    ${echapperHTML(
                                        consommation.materiel ||
                                        "Matériel"
                                    )}
                                </strong>

                            </div>


                            <strong
                                class="detail-quantite"
                            >
                                ${
                                    Number(
                                        consommation.quantite ||
                                        0
                                    )
                                }
                            </strong>

                        </div>

                    `;

                }
            ).join("")
            : `
                <div class="materiel">
                    Aucun matériel enregistré pour cette intervention.
                </div>
            `;


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page">

            <button
                class="retour-button"
                onclick="afficherArchivesHistorique()"
            >
                ← Retour
            </button>


            <h2>
                Détail de l'intervention
            </h2>


            <div
                class="detail-header"
            >

                <strong>
                    Intervention
                    ${echapperHTML(
                        intervention.numeroIntervention ||
                        ""
                    )}
                </strong>

                <span>
                    Date :
                    ${formaterDate(
                        intervention.date
                    )}
                </span>

                <span>
                    ${echapperHTML(
                        (intervention.createdByPrenom || intervention.created_by_prenom || "") +
                        ((intervention.createdByPrenom || intervention.created_by_prenom) && (intervention.createdByNom || intervention.created_by_nom) ? " " : "") +
                        (intervention.createdByNom || intervention.created_by_nom || "Non renseigné")
                    )}
                </span>

            </div>


            <h3>
                Matériel utilisé
            </h3>


            ${lignes}

        </main>

    `;

}



/* =========================================================
   REAPPROVISIONNEMENT RAPIDE DEPUIS UNE ARCHIVE
   ========================================================= */

function initialiserStylesReapprovisionnementArchive() {

    if (
        document.getElementById(
            "style-reapprovisionnement-archive"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "style-reapprovisionnement-archive";

    style.textContent = `
        .menu-reapprovisionnement-admin {
            background: #14532d !important;
            color: #ffffff !important;
            border-color: #14532d !important;
        }

        .menu-reapprovisionnement-admin strong,
        .menu-reapprovisionnement-admin small {
            color: #ffffff !important;
        }

        .archive-reappro-bouton {
            display: block;
            width: 100%;
            max-width: 460px;
            min-height: 54px;
            margin: 28px auto 8px;
            padding: 13px 18px;
            border: 0;
            border-radius: 15px;
            background: #14532d;
            color: #fff;
            font: inherit;
            font-size: 16px;
            font-weight: 850;
            letter-spacing: .01em;
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(20,83,45,.23);
        }

        .reappro-page {
            min-height: 100vh;
            min-height: 100dvh;
            box-sizing: border-box;
            margin: 0;
            padding:
                calc(18px + env(safe-area-inset-top, 0px))
                14px
                calc(30px + env(safe-area-inset-bottom, 0px));
            background:
                linear-gradient(180deg, #10261d 0, #16372a 190px, #edf1ec 190px);
            color: #172019;
        }

        .reappro-retour {
            display: inline-flex;
            align-items: center;
            min-height: 42px;
            padding: 8px 12px;
            border: 1px solid rgba(255,255,255,.28);
            border-radius: 999px;
            background: rgba(255,255,255,.10);
            color: #fff;
            font: inherit;
            font-weight: 800;
            cursor: pointer;
        }

        .reappro-entete {
            padding: 24px 4px 28px;
            color: #fff;
        }

        .reappro-entete .reappro-sur-titre {
            margin: 0 0 6px;
            font-size: 12px;
            font-weight: 850;
            letter-spacing: .16em;
            text-transform: uppercase;
            opacity: .72;
        }

        .reappro-entete h2 {
            margin: 0;
            font-size: clamp(27px, 8vw, 38px);
            line-height: 1;
            font-weight: 900;
            letter-spacing: -.035em;
        }

        .reappro-entete p {
            margin: 12px 0 0;
            max-width: 520px;
            color: rgba(255,255,255,.78);
            line-height: 1.45;
            font-size: 14px;
        }

        .reappro-feuille {
            width: min(100%, 680px);
            margin: 0 auto;
            box-sizing: border-box;
            padding: 18px;
            border-radius: 6px;
            background: #fffefa;
            box-shadow:
                0 18px 42px rgba(17,41,30,.18),
                inset 0 0 0 1px rgba(30,45,35,.05);
        }

        .reappro-meta {
            display: flex;
            justify-content: space-between;
            gap: 14px;
            align-items: baseline;
            padding-bottom: 14px;
            margin-bottom: 6px;
            border-bottom: 2px solid #1b3829;
            font-size: 13px;
        }

        .reappro-meta strong {
            font-size: 15px;
        }

        .reappro-section-titre {
            margin: 20px 0 10px;
            font-size: 12px;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: .11em;
            font-weight: 900;
            color: #5d6d63;
        }

        .reappro-ligne {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 92px;
            gap: 12px;
            align-items: center;
            padding: 13px 0;
            border-bottom: 1px dashed #c9cec9;
        }

        .reappro-nom {
            min-width: 0;
            font-weight: 850;
            line-height: 1.25;
            overflow-wrap: anywhere;
        }

        .reappro-stock {
            display: block;
            margin-top: 4px;
            color: #748078;
            font-size: 12px;
            font-weight: 650;
        }

        .reappro-quantite {
            width: 100%;
            min-width: 0;
            height: 46px;
            box-sizing: border-box;
            border: 2px solid #bac2bc;
            border-radius: 5px;
            padding: 7px 8px;
            background: #fff;
            color: #172019;
            font: inherit;
            font-size: 18px;
            font-weight: 850;
            text-align: center;
            outline: none;
        }

        .reappro-quantite:focus {
            border-color: #1c5a36;
            box-shadow: 0 0 0 3px rgba(28,90,54,.10);
        }

        .reappro-ajout-zone {
            margin-top: 22px;
            padding-top: 16px;
            border-top: 3px double #c5cbc6;
        }

        .reappro-ajouter {
            width: 100%;
            min-height: 48px;
            border: 2px solid #1c5a36;
            border-radius: 5px;
            background: transparent;
            color: #17472c;
            font: inherit;
            font-weight: 900;
            cursor: pointer;
        }

        .reappro-ligne-supplementaire {
            grid-template-columns: minmax(0, 1fr) 86px 36px;
            align-items: start;
        }

        .reappro-recherche-wrap {
            position: relative;
            min-width: 0;
        }

        .reappro-recherche {
            width: 100%;
            min-width: 0;
            min-height: 46px;
            box-sizing: border-box;
            border: 2px solid #bac2bc;
            border-radius: 5px;
            padding: 7px 10px;
            background: #fff;
            color: #172019;
            font: inherit;
            font-weight: 750;
            outline: none;
        }

        .reappro-recherche:focus {
            border-color: #1c5a36;
            box-shadow: 0 0 0 3px rgba(28,90,54,.10);
        }

        .reappro-resultats {
            display: none;
            position: absolute;
            z-index: 20;
            left: 0;
            right: 0;
            top: calc(100% + 4px);
            max-height: 240px;
            overflow-y: auto;
            border: 1px solid #b9c1bb;
            border-radius: 6px;
            background: #fff;
            box-shadow: 0 10px 24px rgba(16,38,29,.18);
        }

        .reappro-resultats.ouvert {
            display: block;
        }

        .reappro-resultat {
            display: block;
            width: 100%;
            border: 0;
            border-bottom: 1px solid #edf0ed;
            padding: 11px 12px;
            background: #fff;
            color: #172019;
            text-align: left;
            font: inherit;
            cursor: pointer;
        }

        .reappro-resultat:last-child {
            border-bottom: 0;
        }

        .reappro-resultat strong {
            display: block;
            font-size: 14px;
        }

        .reappro-resultat small {
            display: block;
            margin-top: 3px;
            color: #6d776f;
            font-size: 11px;
        }

        .reappro-recherche-vide {
            padding: 11px 12px;
            color: #6d776f;
            font-size: 13px;
        }

        .reappro-supprimer-ligne {
            width: 36px;
            height: 36px;
            padding: 0;
            border: 0;
            border-radius: 50%;
            background: #ecefec;
            color: #5b665f;
            font: inherit;
            font-size: 22px;
            line-height: 1;
            cursor: pointer;
        }

        .reappro-validation {
            width: 100%;
            min-height: 56px;
            margin-top: 24px;
            border: 0;
            border-radius: 5px;
            background: #10261d;
            color: #fff;
            font: inherit;
            font-size: 16px;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 8px 18px rgba(16,38,29,.18);
        }

        .reappro-note {
            margin: 10px 0 0;
            color: #69756d;
            font-size: 12px;
            line-height: 1.4;
            text-align: center;
        }

        @media (max-width: 430px) {
            .reappro-feuille {
                padding: 15px 14px 17px;
            }

            .reappro-ligne {
                grid-template-columns: minmax(0, 1fr) 78px;
                gap: 9px;
            }

            .reappro-ligne-supplementaire {
                grid-template-columns: minmax(0, 1fr) 72px 34px;
                gap: 7px;
            }
        }
    `;

    document.head.appendChild(
        style
    );

}


function trouverMaterielDepuisLigneArchive(
    ligne
) {

    const id =
        String(
            ligne?.materielId ||
            ""
        );

    if (id) {

        const parId =
            materiels.find(
                function (materiel) {

                    return (
                        String(materiel.id) ===
                        id
                    );

                }
            );

        if (parId) {
            return parId;
        }

    }


    const nom =
        String(
            ligne?.materiel ||
            ""
        )
            .trim()
            .toLocaleLowerCase();


    if (!nom) {
        return null;
    }


    return (
        materiels.find(
            function (materiel) {

                return (
                    String(
                        materiel.nom ||
                        ""
                    )
                        .trim()
                        .toLocaleLowerCase() ===
                    nom
                );

            }
        ) ||
        null
    );

}


async function afficherReapprovisionnementArchive(
    archiveId
) {

    if (
        !verifierPermissionOuRetourAccueil(
            "acces_reapprovisionnement",
            "Tu n'as pas accès au réapprovisionnement."
        )
    ) {
        return;
    }


    await synchroniserAvantNavigation();

    initialiserStylesReapprovisionnementArchive();


    const archive =
        trouverArchiveHistorique(
            archiveId
        );


    if (!archive) {

        alert(
            "Archive introuvable."
        );

        afficherArchivesHistorique();

        return;
    }


    const materielsDejaAjoutes =
        new Set();


    const lignesConsommees =
        calculerTotauxArchive(
            archive
        )
            .map(
                trouverMaterielDepuisLigneArchive
            )
            .filter(
                function (materiel) {

                    if (
                        !materiel ||
                        materielsDejaAjoutes.has(
                            String(materiel.id)
                        )
                    ) {
                        return false;
                    }

                    materielsDejaAjoutes.add(
                        String(materiel.id)
                    );

                    return true;

                }
            );


    const lignesHTML =
        lignesConsommees.length > 0
            ? lignesConsommees.map(
                function (materiel) {

                    return `
                        <div
                            class="reappro-ligne reappro-ligne-consommee"
                            data-materiel-id="${echapperHTML(String(materiel.id))}"
                        >
                            <div>
                                <div class="reappro-nom">
                                    ${echapperHTML(materiel.nom)}
                                </div>
                                <span class="reappro-stock">
                                    Stock actuel :
                                    ${Number(materiel.stock || 0)}
                                </span>
                            </div>

                            <select
            class="reappro-quantite"
            aria-label="Quantité à ajouter"
        >
            <option value="">Quantité</option>
            ${Array.from({ length: 99 }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join("")}
        </select>
                        </div>
                    `;

                }
            ).join("")
            : `
                <div class="reappro-note">
                    Aucun matériel consommé de cette archive n'existe encore dans l'inventaire.
                </div>
            `;


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="reappro-page">

            <button
                type="button"
                class="reappro-retour"
                onclick="afficherDetailCommandeArchive('${String(archive.id)}')"
            >
                ← Retour à la commande
            </button>


            <header class="reappro-entete">

                <p class="reappro-sur-titre">
                    Pharmacie · Stock
                </p>

                <h2>
                    Réapprovisionnement
                </h2>


            </header>


            <section class="reappro-feuille">

                <div class="reappro-meta">
                    <strong>
                        Commande du
                        ${formaterDate(archive.date)}
                    </strong>

                    <span>
                        ${lignesConsommees.length}
                        matériel(s)
                    </span>
                </div>


                <div class="reappro-section-titre">
                    Matériels issus de la commande
                </div>


                <div id="reappro-lignes-consommees">
                    ${lignesHTML}
                </div>


                <div class="reappro-ajout-zone">

                    <div class="reappro-section-titre">
                        Compléter la livraison
                    </div>

                    <div id="reappro-lignes-supplementaires"></div>

                    <button
                        type="button"
                        class="reappro-ajouter"
                        onclick="ajouterLigneReapprovisionnementArchive()"
                    >
                        Ajouter un autre matériel
                    </button>

                </div>


                <button
                    type="button"
                    class="reappro-validation"
                    onclick="validerReapprovisionnementArchive('${String(archive.id)}')"
                >
                    Ajouter au stock
                </button>


                <p class="reappro-note">
                    Les quantités laissées vides ne modifieront pas le stock.
                </p>

            </section>

        </main>

    `;

}


async function afficherReapprovisionnementAdministration() {

    if (
        !verifierPermissionOuRetourAccueil(
            "acces_reapprovisionnement",
            "Tu n'as pas accès au réapprovisionnement."
        )
    ) {
        return;
    }

    await synchroniserAvantNavigation();

    initialiserStylesReapprovisionnementArchive();

    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="reappro-page">

            <button
                type="button"
                class="reappro-retour"
                onclick="afficherMenuAdministration()"
            >
                ← Retour à l'administration
            </button>

            <header class="reappro-entete">

                <div class="reappro-entete-contenu">
                    <p class="reappro-sur-titre">
                        Stock
                    </p>

                    <h2>
                        Réapprovisionnement
                    </h2>

                    <p class="reappro-sous-titre-bureau bureau-seulement">
                        Ajoutez les matériels reçus pour les remettre en stock.
                    </p>
                </div>

                <div class="reappro-date-bureau bureau-seulement">
                    <span class="reappro-date-label">
                        Date du réapprovisionnement
                    </span>
                    <strong>
                        ${formaterDate(dateAujourdhui())}
                    </strong>
                </div>

            </header>

            <section class="reappro-feuille">

                <div class="reappro-icone-bureau bureau-seulement">
                    +
                </div>

                <h3 class="reappro-grand-titre bureau-seulement">
                    Nouveau réapprovisionnement
                </h3>

                <div class="reappro-table-entete bureau-seulement">
                    <span>#</span>
                    <span>Matériel</span>
                    <span>Quantité</span>
                    <span>Action</span>
                </div>

                <div class="reappro-section-titre mobile-seulement">
                    Matériels à ajouter au stock
                </div>

                <div id="reappro-lignes-consommees"></div>
                <div id="reappro-lignes-supplementaires"></div>

                <div class="reappro-ajout-zone">
                    <button
                        type="button"
                        class="reappro-ajouter"
                        onclick="ajouterLigneReapprovisionnementArchive()"
                    >
                        <span class="bureau-seulement">+&nbsp;&nbsp; Ajouter un autre matériel</span>
                        <span class="mobile-seulement">Ajouter un matériel</span>
                    </button>
                </div>

                <button
                    type="button"
                    class="reappro-validation"
                    onclick="validerReapprovisionnementAdministration()"
                >
                    <span class="bureau-seulement">
                        Enregistrer le réapprovisionnement
                    </span>
                    <span class="mobile-seulement">
                        Ajouter au stock
                    </span>
                </button>

                <p class="reappro-note">
                    Les quantités saisies seront ajoutées au stock actuel des matériels.
                </p>

            </section>

        </main>

    `;

}


let validationReapprovisionnementEnCours = false;
async function validerReapprovisionnementAdministration() {
    if (validationReapprovisionnementEnCours) return;
    validationReapprovisionnementEnCours = true;
    try {


    if (
        !verifierPermissionOuRetourAccueil(
            "acces_reapprovisionnement",
            "Tu n'as pas accès au réapprovisionnement."
        )
    ) {
        return;
    }

    const ajouts = new Map();

    document.querySelectorAll(
        ".reappro-ligne-supplementaire"
    ).forEach(
        function (ligne) {

            const materielId =
                String(
                    ligne.querySelector(
                        ".reappro-materiel-id"
                    )?.value ||
                    ""
                );

            const quantite =
                Math.floor(
                    Number(
                        ligne.querySelector(
                            ".reappro-quantite"
                        )?.value ||
                        0
                    )
                );

            if (
                materielId &&
                Number.isFinite(quantite) &&
                quantite > 0
            ) {
                ajouts.set(
                    materielId,
                    (ajouts.get(materielId) || 0) +
                    quantite
                );
            }
        }
    );

    if (ajouts.size === 0) {
        alert(
            "Ajoute au moins un matériel avec une quantité supérieure à 0."
        );
        return;
    }

    const lignesConfirmation =
        Array.from(ajouts.entries())
            .map(
                function ([materielId, quantite]) {
                    const materiel =
                        materiels.find(
                            function (item) {
                                return String(item.id) === String(materielId);
                            }
                        );
                    return materiel
                        ? `${materiel.nom} : +${quantite}`
                        : "";
                }
            )
            .filter(Boolean);

    if (
        !await afficherConfirmationCIS(
            "Ajouter au stock :\\n\\n" +
            lignesConfirmation.join("\\n") +
            "\\n\\nConfirmer ?"
        )
    ) {
        return;
    }

    let confirme = false;
    let nombreModifie = 0;

    ajouts.forEach(
        function (quantite, materielId) {
            const materiel =
                materiels.find(
                    function (item) {
                        return String(item.id) === String(materielId);
                    }
                );

            if (!materiel) {
                return;
            }

            const ancienStock =
                Number(materiel.stock || 0);

            materiel.stock =
                ancienStock +
                Number(quantite);

            preparerNotificationStock(
                materiel,
                ancienStock
            );

            nombreModifie += 1;
        }
    );

    sauvegarderToutesLesDonnees();

    try {
        confirme = await synchroniserApresModification();
    } catch (erreur) {
        console.warn(
            "Synchronisation du réapprovisionnement différée :",
            erreur
        );
    }

    alert(
        confirme
            ? nombreModifie + " matériel(s) ajouté(s) au stock et confirmé(s) par le serveur."
            : "Réapprovisionnement enregistré sur cet appareil, en attente de confirmation du serveur. L'envoi sera retenté automatiquement : ne le ressaisis pas."
    );

    afficherReapprovisionnementAdministration();

    } finally { validationReapprovisionnementEnCours = false; }
}


function ajouterLigneReapprovisionnementArchive() {

    const conteneur =
        document.getElementById(
            "reappro-lignes-supplementaires"
        );


    if (!conteneur) {
        return;
    }


    if (materiels.length === 0) {

        alert(
            "Aucun matériel disponible."
        );

        return;
    }


    const ligne =
        document.createElement(
            "div"
        );

    ligne.className =
        "reappro-ligne reappro-ligne-supplementaire";


    ligne.innerHTML = `

        <div class="reappro-recherche-wrap">

            <input
                class="reappro-recherche"
                type="search"
                autocomplete="off"
                placeholder="Rechercher un matériel"
                aria-label="Rechercher un matériel"
            >

            <input
                class="reappro-materiel-id"
                type="hidden"
                value=""
            >

            <div
                class="reappro-resultats"
            ></div>

        </div>

        <select
            class="reappro-quantite"
            aria-label="Quantité à ajouter"
        >
            <option value="">Quantité</option>
            ${Array.from({ length: 99 }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join("")}
        </select>

        <button
            type="button"
            class="reappro-supprimer-ligne"
            aria-label="Retirer cette ligne"
            title="Retirer"
        >
            ×
        </button>

    `;


    ligne.querySelector(
        ".reappro-supprimer-ligne"
    )?.addEventListener(
        "click",
        function () {

            ligne.remove();

        }
    );


    const recherche =
        ligne.querySelector(
            ".reappro-recherche"
        );

    const champId =
        ligne.querySelector(
            ".reappro-materiel-id"
        );

    const resultats =
        ligne.querySelector(
            ".reappro-resultats"
        );


    function fermerResultats() {

        resultats?.classList.remove(
            "ouvert"
        );

    }


    function afficherResultats(
        texte
    ) {

        if (
            !recherche ||
            !champId ||
            !resultats
        ) {
            return;
        }


        champId.value =
            "";


        const terme =
            String(
                texte ||
                ""
            )
                .trim()
                .toLocaleLowerCase();


        if (!terme) {

            resultats.innerHTML =
                "";

            fermerResultats();

            return;
        }


        const correspondances =
            [...materiels]
                .filter(
                    function (materiel) {

                        const nom =
                            String(
                                materiel.nom ||
                                ""
                            )
                                .toLocaleLowerCase();

                        const reference =
                            String(
                                materiel.reference ||
                                ""
                            )
                                .toLocaleLowerCase();

                        return (
                            nom.includes(
                                terme
                            ) ||
                            reference.includes(
                                terme
                            )
                        );

                    }
                )
                .sort(
                    function (a, b) {

                        return String(
                            a.nom ||
                            ""
                        ).localeCompare(
                            String(
                                b.nom ||
                                ""
                            ),
                            "fr",
                            {
                                sensitivity:
                                    "base"
                            }
                        );

                    }
                )
                .slice(
                    0,
                    12
                );


        if (
            correspondances.length === 0
        ) {

            resultats.innerHTML = `
                <div class="reappro-recherche-vide">
                    Aucun matériel trouvé
                </div>
            `;

            resultats.classList.add(
                "ouvert"
            );

            return;
        }


        resultats.innerHTML =
            correspondances
                .map(
                    function (materiel) {

                        const reference =
                            String(
                                materiel.reference ||
                                ""
                            ).trim();

                        return `
                            <button
                                type="button"
                                class="reappro-resultat"
                                data-materiel-id="${echapperHTML(String(materiel.id))}"
                            >
                                <strong>
                                    ${echapperHTML(materiel.nom)}
                                </strong>

                                ${
                                    reference
                                        ? `
                                            <small>
                                                Réf. ${echapperHTML(reference)}
                                            </small>
                                        `
                                        : ""
                                }
                            </button>
                        `;

                    }
                )
                .join("");


        resultats.classList.add(
            "ouvert"
        );


        resultats.querySelectorAll(
            ".reappro-resultat"
        ).forEach(
            function (bouton) {

                bouton.addEventListener(
                    "click",
                    function () {

                        const materielId =
                            String(
                                bouton.dataset.materielId ||
                                ""
                            );

                        const materiel =
                            materiels.find(
                                function (item) {

                                    return (
                                        String(item.id) ===
                                        materielId
                                    );

                                }
                            );


                        if (!materiel) {
                            return;
                        }


                        champId.value =
                            String(
                                materiel.id
                            );

                        recherche.value =
                            String(
                                materiel.nom ||
                                ""
                            );

                        fermerResultats();


                        ligne.querySelector(
                            ".reappro-quantite"
                        )?.focus();

                    }
                );

            }
        );

    }


    recherche?.addEventListener(
        "input",
        function () {

            afficherResultats(
                recherche.value
            );

        }
    );


    recherche?.addEventListener(
        "focus",
        function () {

            if (
                String(
                    recherche.value ||
                    ""
                ).trim()
            ) {

                afficherResultats(
                    recherche.value
                );

            }

        }
    );


    document.addEventListener(
        "click",
        function fermerSiClicExterieur(
            event
        ) {

            if (
                !ligne.isConnected
            ) {

                document.removeEventListener(
                    "click",
                    fermerSiClicExterieur
                );

                return;
            }


            if (
                !ligne.contains(
                    event.target
                )
            ) {

                fermerResultats();

            }

        }
    );


    conteneur.appendChild(
        ligne
    );


    recherche?.focus();

}


async function validerReapprovisionnementArchive(
    archiveId
) {
    if (validationReapprovisionnementEnCours) return;
    validationReapprovisionnementEnCours = true;
    try {


    if (
        !verifierPermissionOuRetourAccueil(
            "acces_reapprovisionnement",
            "Tu n'as pas accès au réapprovisionnement."
        )
    ) {
        return;
    }


    const ajouts =
        new Map();


    document.querySelectorAll(
        ".reappro-ligne-consommee"
    ).forEach(
        function (ligne) {

            const materielId =
                String(
                    ligne.dataset.materielId ||
                    ""
                );

            const quantite =
                Math.floor(
                    Number(
                        ligne.querySelector(
                            ".reappro-quantite"
                        )?.value ||
                        0
                    )
                );


            if (
                materielId &&
                Number.isFinite(quantite) &&
                quantite > 0
            ) {

                ajouts.set(
                    materielId,
                    (
                        ajouts.get(
                            materielId
                        ) ||
                        0
                    ) +
                    quantite
                );

            }

        }
    );


    document.querySelectorAll(
        ".reappro-ligne-supplementaire"
    ).forEach(
        function (ligne) {

            const materielId =
                String(
                    ligne.querySelector(
                        ".reappro-materiel-id"
                    )?.value ||
                    ""
                );

            const quantite =
                Math.floor(
                    Number(
                        ligne.querySelector(
                            ".reappro-quantite"
                        )?.value ||
                        0
                    )
                );


            if (
                materielId &&
                Number.isFinite(quantite) &&
                quantite > 0
            ) {

                ajouts.set(
                    materielId,
                    (
                        ajouts.get(
                            materielId
                        ) ||
                        0
                    ) +
                    quantite
                );

            }

        }
    );


    if (ajouts.size === 0) {

        alert(
            "Indique au moins une quantité à ajouter au stock."
        );

        return;
    }


    const lignesConfirmation =
        Array.from(
            ajouts.entries()
        )
            .map(
                function (
                    [materielId, quantite]
                ) {

                    const materiel =
                        materiels.find(
                            function (item) {

                                return (
                                    String(item.id) ===
                                    String(materielId)
                                );

                            }
                        );

                    return (
                        materiel
                            ? `${materiel.nom} : +${quantite}`
                            : ""
                    );

                }
            )
            .filter(Boolean);


    if (
        !await afficherConfirmationCIS(
            "Ajouter au stock :\n\n" +
            lignesConfirmation.join(
                "\n"
            ) +
            "\n\nConfirmer ?"
        )
    ) {
        return;
    }


    let confirme = false;
    let nombreModifie =
        0;


    ajouts.forEach(
        function (
            quantite,
            materielId
        ) {

            const materiel =
                materiels.find(
                    function (item) {

                        return (
                            String(item.id) ===
                            String(materielId)
                        );

                    }
                );


            if (!materiel) {
                return;
            }


            const ancienStock =
                Number(
                    materiel.stock ||
                    0
                );


            const nouveauStock =
                ancienStock +
                Number(
                    quantite
                );


            materiel.stock =
                nouveauStock;


            preparerNotificationStock(
                materiel,
                ancienStock
            );


            nombreModifie +=
                1;

        }
    );


    if (nombreModifie === 0) {

        alert(
            "Aucun stock n'a été modifié."
        );

        return;
    }


    sauvegarderToutesLesDonnees();


    try {

        confirme = await synchroniserApresModification();

    } catch (erreur) {

        console.warn(
            "Synchronisation du réapprovisionnement différée :",
            erreur
        );

    }


    alert(
        confirme
            ? nombreModifie + " matériel(s) ajouté(s) au stock et confirmé(s) par le serveur."
            : "Réapprovisionnement enregistré sur cet appareil, en attente de confirmation du serveur. L'envoi sera retenté automatiquement : ne le ressaisis pas."
    );


    afficherDetailCommandeArchive(
        archiveId
    );

    } finally { validationReapprovisionnementEnCours = false; }
}


/* =========================================================
   TOTAL CONSOMME
   ========================================================= */

function totalConsommeMateriel(
    materielId
) {

    let total = 0;


    historique.forEach(
        function (intervention) {

            if (
                !Array.isArray(
                    intervention.consommations
                )
            ) {

                return;

            }


            intervention.consommations.forEach(
                function (consommation) {

                    if (
                        String(
                            consommation.materielId
                        ) ===
                        String(materielId)
                    ) {

                        total +=
                            Number(
                                consommation.quantite ||
                                0
                            );

                    }

                }
            );

        }
    );


    return total;

}


/* =========================================================
   HISTORIQUE TOTAL
   ========================================================= */

function afficherHistoriqueTotal() {

    const conteneur =
        document.getElementById(
            "historique-total"
        );


    if (!conteneur) {

        return;

    }


    const liste =
        materiels
            .map(
                function (materiel) {

                    return {

                        materiel:
                            materiel,

                        total:
                            totalConsommeMateriel(
                                materiel.id
                            )

                    };

                }
            )

            // Dans l'historique, on affiche uniquement
            // les matériels qui ont réellement été consommés.
            .filter(
                function (ligne) {

                    return (
                        Number(ligne.total) > 0
                    );

                }
            )

            .sort(
                function (a, b) {

                    const aStockFaible =
                        a.materiel.minimum > 0 &&
                        a.materiel.stock <=
                        a.materiel.minimum;

                    const bStockFaible =
                        b.materiel.minimum > 0 &&
                        b.materiel.stock <=
                        b.materiel.minimum;

                    // Les ruptures de stock sont tout en haut.
                    const aRupture =
                        Number(a.materiel.stock) === 0;

                    const bRupture =
                        Number(b.materiel.stock) === 0;

                    if (aRupture !== bRupture) {

                        return (
                            aRupture
                                ? -1
                                : 1
                        );

                    }

                    // Puis viennent les stocks faibles.
                    if (aStockFaible !== bStockFaible) {

                        return (
                            aStockFaible
                                ? -1
                                : 1
                        );

                    }

                    // Ensuite on classe par quantité consommée.
                    return (
                        b.total -
                        a.total
                    );

                }
            );


    if (
        liste.length === 0
    ) {

        conteneur.innerHTML = `

            <div class="materiel">

                Aucun matériel consommé.

            </div>

        `;

        return;

    }


    conteneur.innerHTML =
        liste
            .map(
                function (ligne) {

                    const stockMinimum =
                        ligne.materiel.minimum > 0 &&
                        ligne.materiel.stock <=
                        ligne.materiel.minimum;

                    const ruptureStock =
                        Number(
                            ligne.materiel.stock
                        ) === 0;


                    const classeAlerte =
                        ruptureStock
                            ? " historique-rupture-stock"
                            : (
                                stockMinimum
                                    ? " historique-stock-faible"
                                    : ""
                            );


                    return `

                        <button
                            class="
                                historique-total
                                ${classeAlerte}
                            "
                            type="button"
                            onclick="
                                afficherDetailConsommation(
                                    '${ligne.materiel.id}'
                                )
                            "
                        >

                            <span
                                class="
                                    historique-icone
                                "
                            >
                                ${
                                    ruptureStock
                                        ? "⛔"
                                        : "📦"
                                }
                            </span>


                            <span
                                class="
                                    historique-nom
                                    ${
                                        ruptureStock
                                            ? "texte-rupture-stock"
                                            : (
                                                stockMinimum
                                                    ? "texte-stock-faible"
                                                    : ""
                                            )
                                    }
                                "
                            >

                                <strong>
                                    ${echapperHTML(
                                        ligne.materiel.nom
                                    )}
                                </strong>


                                <small>
                                    ${
                                        ruptureStock
                                            ? "⛔ RUPTURE DE STOCK"
                                            : (
                                                stockMinimum
                                                    ? "⚠️ Stock minimum"
                                                    : "Voir le détail"
                                            )
                                    }
                                </small>

                            </span>


                            <span
                                class="
                                    historique-chiffre
                                    ${
                                        ruptureStock
                                            ? "texte-rupture-stock"
                                            : (
                                                stockMinimum
                                                    ? "texte-stock-faible"
                                                    : ""
                                            )
                                    }
                                "
                            >

                                <strong>
                                    ${ligne.total}
                                </strong>


                                <small>
                                    UTILISÉS
                                </small>

                            </span>


                            <span>
                                ›
                            </span>

                        </button>

                    `;

                }
            )
            .join("");

}

/* =========================================================
   DETAIL PAR MATERIEL
   ========================================================= */

function afficherDetailConsommation(
    materielId
) {

    const materiel =
        materiels.find(
            function (m) {

                return (
                    String(m.id) ===
                    String(materielId)
                );

            }
        );


    if (!materiel) {

        alert(
            "Matériel introuvable."
        );

        return;

    }


    const details = [];


    historique.forEach(
        function (intervention) {

            if (
                !Array.isArray(
                    intervention.consommations
                )
            ) {

                return;

            }


            intervention.consommations.forEach(
                function (consommation) {

                    if (
                        String(
                            consommation.materielId
                        ) ===
                        String(materielId)
                    ) {

                        details.push({

                            date:
                                intervention.date,

                            numero:
                                intervention.numeroIntervention,

                            quantite:
                                Number(
                                    consommation.quantite ||
                                    0
                                )

                        });

                    }

                }
            );

        }
    );


    details.sort(
        function (a, b) {

            return String(b.date)
                .localeCompare(
                    String(a.date)
                );

        }
    );


    const stockMinimum =
        materiel.minimum > 0 &&
        materiel.stock <=
        materiel.minimum;


    let html = `

        <main class="page">

            <button
                class="retour-button"
                onclick="afficherHistorique()"
            >
                ← Retour
            </button>


            <h2>
                📋 Détail des consommations
            </h2>


            <div
                class="
                    detail-header
                    ${
                        stockMinimum
                        ?
                        "detail-stock-faible"
                        :
                        ""
                    }
                "
            >

                <strong>
                    ${echapperHTML(
                        materiel.nom
                    )}
                </strong>


                <span>
                    Stock actuel :
                    ${materiel.stock}
                </span>

            </div>

    `;


    if (
        details.length === 0
    ) {

        html += `

            <div class="materiel">

                Aucune consommation enregistrée.

            </div>

        `;

    } else {

        details.forEach(
            function (detail) {

                html += `

                    <div
                        class="detail-historique"
                    >

                        <div>

                            <strong>
                                Intervention
                                ${echapperHTML(
                                    detail.numero
                                )}
                            </strong>


                            <span>
                                ${formaterDate(
                                    detail.date
                                )}
                            </span>

                        </div>


                        <strong
                            class="
                                detail-quantite
                                ${
                                    stockMinimum
                                    ?
                                    "texte-stock-faible"
                                    :
                                    ""
                                }
                            "
                        >
                            ${detail.quantite}
                        </strong>

                    </div>

                `;

            }
        );

    }


    html += `
        </main>
    `;


    document.getElementById(
        "app"
    ).innerHTML =
        html;

}


/* =========================================================
   HISTORIQUE DES INTERVENTIONS
   ========================================================= */

function afficherHistoriqueInterventions() {

    const conteneur =
        document.getElementById(
            "historique-interventions"
        );


    if (!conteneur) {

        return;

    }


    if (
        historique.length === 0
    ) {

        conteneur.innerHTML = `

            <div class="materiel">

                ${!derniereLecturePharmacieReussie ? "Historique indisponible pour le moment. Les données seront chargées à la reconnexion." : "Aucun retour d’intervention enregistré."}

            </div>

        `;

        return;

    }


    conteneur.innerHTML =
        [...historique]
            .reverse()
            .map(
                function (intervention) {

                    const total =
                        intervention.consommations
                            .reduce(
                                function (
                                    somme,
                                    consommation
                                ) {

                                    return (
                                        somme +
                                        Number(
                                            consommation.quantite ||
                                            0
                                        )
                                    );

                                },
                                0
                            );


                    return `

                        <button
                            type="button"
                            class="
                                detail-historique
                                intervention-cliquable
                                ${
                                    intervention.synchronisationEnAttente
                                        ? "intervention-en-attente-sync"
                                        : ""
                                }
                            "
                            onclick="
                                afficherDetailIntervention(
                                    '${intervention.id}'
                                )
                            "
                        >

                            <div>

                                <strong>
                                    Intervention
                                    ${echapperHTML(
                                        intervention.numeroIntervention
                                    )}
                                </strong>


                                <span>
                                    ${formaterDate(
                                        intervention.date
                                    )}
                                </span>

                                <span class="auteur-intervention">
                                    ${echapperHTML(nomAuteurIntervention(intervention))}
                                </span>

                                <small>
                                    ${
                                        intervention.synchronisationEnAttente
                                            ? "⏳ En attente de synchronisation"
                                            : "👆 Cliquer pour voir le détail"
                                    }
                                </small>

                            </div>


                            <div
                                class="
                                    intervention-total
                                "
                            >

                                <strong>
                                    ${total}
                                </strong>


                                <span>
                                    utilisés
                                </span>

                            </div>


                            <span
                                class="
                                    fleche-detail
                                "
                            >
                                ›
                            </span>

                        </button>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   DETAIL D'UNE INTERVENTION
   ========================================================= */

function initialiserStylesActionsIntervention() {
    if (document.getElementById("style-actions-intervention")) return;
    const style = document.createElement("style");
    style.id = "style-actions-intervention";
    style.textContent = `
        .auteur-intervention { margin-top: 7px; font-weight: 700; }
        .actions-intervention { display:flex; gap:10px; margin:24px 0 8px; flex-wrap:wrap; }
        .bouton-modifier-intervention, .bouton-supprimer-intervention { flex:1; min-width:140px; min-height:48px; border:0; border-radius:12px; color:#fff; font:inherit; font-weight:800; cursor:pointer; }
        .bouton-modifier-intervention { background:#1687ff; }
        .bouton-supprimer-intervention { background:#d62828; }
        .bouton-supprimer-intervention:disabled { background:#8b9298 !important; color:#e7e7e7 !important; cursor:not-allowed; opacity:.8; }

        /* Espace volontairement distinct pour la modification d'un retour */
        .editeur-retour-special {
            min-height:100vh;
            box-sizing:border-box;
            background:linear-gradient(180deg,#eef4f8 0,#f7f9fb 260px,#f7f9fb 100%);
            padding-bottom:38px;
        }
        .editeur-retour-special .retour-button { margin-bottom:18px; }
        .bandeau-edition-retour {
            background:#17324a;
            color:#fff;
            border-radius:18px;
            padding:20px;
            margin:0 0 18px;
            box-shadow:0 8px 24px rgba(20,42,60,.16);
        }
        .bandeau-edition-retour .sur-titre {
            display:block;
            font-size:.82rem;
            font-weight:800;
            letter-spacing:.08em;
            text-transform:uppercase;
            opacity:.72;
            margin-bottom:5px;
        }
        .bandeau-edition-retour h2 {
            color:#fff !important;
            margin:0;
            font-size:1.7rem;
            line-height:1.15;
        }
        .infos-retour-verrouillees {
            display:grid;
            grid-template-columns:1fr;
            gap:10px;
            background:#fff;
            border:1px solid #dce4ea;
            border-radius:16px;
            padding:16px;
            margin-bottom:20px;
            box-shadow:0 3px 12px rgba(30,50,65,.06);
        }
        .info-retour-verrouillee {
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:18px;
            padding:8px 0;
            border-bottom:1px solid #edf1f4;
        }
        .info-retour-verrouillee:last-child { border-bottom:0; }
        .info-retour-verrouillee .libelle {
            color:#667783;
            font-size:.9rem;
            font-weight:700;
        }
        .info-retour-verrouillee .valeur {
            color:#17232c;
            font-size:1rem;
            font-weight:800;
            text-align:right;
            overflow-wrap:anywhere;
        }
        .note-verrouillage-retour {
            color:#64727c;
            font-size:.86rem;
            margin:-7px 0 21px;
        }
        .titre-materiel-edition {
            color:#17324a;
            font-size:1.25rem;
            margin:0 0 12px;
        }
        .liste-materiels-edition {
            display:flex;
            flex-direction:column;
            gap:10px;
            margin-bottom:18px;
        }
        .ligne-edition-materiel {
            display:grid;
            grid-template-columns:minmax(0,1fr) auto;
            gap:12px;
            align-items:center;
            background:#fff;
            border:1px solid #dce4ea;
            border-radius:15px;
            padding:13px 14px;
            box-shadow:0 2px 9px rgba(30,50,65,.05);
        }
        .ligne-edition-materiel .nom-materiel-edition {
            color:#1d2932;
            font-size:1rem;
            font-weight:800;
            line-height:1.25;
        }
        .controle-quantite-edition {
            display:flex;
            align-items:center;
            gap:7px;
        }
        .controle-quantite-edition button {
            width:38px;
            height:38px;
            min-width:38px;
            padding:0;
            border:0;
            border-radius:10px;
            background:#e8eef2;
            color:#17324a;
            font-size:1.35rem;
            font-weight:900;
            line-height:1;
        }
        .controle-quantite-edition input[type="number"] {
            width:58px !important;
            min-width:58px !important;
            height:38px !important;
            min-height:38px !important;
            box-sizing:border-box !important;
            padding:5px 4px !important;
            margin:0 !important;
            border:1px solid #cbd6dd !important;
            border-radius:9px !important;
            background:#fff !important;
            color:#111 !important;
            font-size:1rem !important;
            font-weight:800 !important;
            text-align:center !important;
        }
        .bloc-ajout-materiel-edition {
            background:#dfeaf1;
            border:1px solid #c5d6e1;
            border-radius:16px;
            padding:15px;
            margin:17px 0 22px;
        }
        .bloc-ajout-materiel-edition strong {
            display:block;
            color:#17324a;
            margin-bottom:9px;
            font-size:1rem;
        }
        .bloc-ajout-materiel-edition .recherche-materiel-edition {
            display:block !important;
            width:100% !important;
            min-width:0 !important;
            height:50px !important;
            min-height:50px !important;
            box-sizing:border-box !important;
            margin:0 0 10px !important;
            padding:0 12px !important;
            border:1px solid #b9cbd6 !important;
            border-radius:11px !important;
            background:#fff !important;
            color:#17232c !important;
            font-size:1rem !important;
        }
        .bloc-ajout-materiel-edition .reappro-resultats {
            position:static !important;
            width:100% !important;
            max-height:230px !important;
            overflow-y:auto !important;
            margin:8px 0 0 !important;
            padding:0 !important;
            border:0 !important;
            background:transparent !important;
            box-shadow:none !important;
        }
        .bloc-ajout-materiel-edition .reappro-resultat {
            display:flex !important;
            width:100% !important;
            min-height:58px !important;
            box-sizing:border-box !important;
            align-items:center !important;
            justify-content:space-between !important;
            gap:12px !important;
            margin:0 0 8px !important;
            padding:13px 15px !important;
            border:1px solid #b9cbd6 !important;
            border-radius:12px !important;
            background:#fff !important;
            color:#17324a !important;
            text-align:left !important;
            box-shadow:0 2px 7px rgba(30,50,65,.06) !important;
            font:inherit !important;
            cursor:pointer !important;
        }
        .bloc-ajout-materiel-edition .reappro-resultat strong {
            display:block !important;
            margin:0 !important;
            color:#17324a !important;
            font-size:1rem !important;
            line-height:1.2 !important;
        }
        .bloc-ajout-materiel-edition .reappro-resultat small {
            display:block !important;
            margin:3px 0 0 !important;
            color:#657785 !important;
            font-size:.78rem !important;
            font-weight:600 !important;
        }
        .bloc-ajout-materiel-edition .reappro-resultat .action-ajout-rapide {
            flex:0 0 auto;
            color:#286b94;
            font-size:.82rem;
            font-weight:900;
            white-space:nowrap;
        }
        .bouton-enregistrer-edition-retour {
            width:100%;
            min-height:56px;
            border:0;
            border-radius:14px;
            background:#19754b;
            color:#fff;
            font:inherit;
            font-size:1.05rem;
            font-weight:900;
            box-shadow:0 6px 16px rgba(25,117,75,.18);
        }
        @media (min-width: 700px) {
            .infos-retour-verrouillees { grid-template-columns:repeat(3,minmax(0,1fr)); }
            .info-retour-verrouillee { display:block; border:0; padding:4px 8px; }
            .info-retour-verrouillee .valeur { display:block; text-align:left; margin-top:5px; }
            .editeur-retour-special .contenu-editeur-retour { max-width:820px; margin:0 auto; }
        }
        @media (max-width: 430px) {
            .editeur-retour-special { padding-left:16px !important; padding-right:16px !important; }
            .bandeau-edition-retour { padding:17px; border-radius:15px; }
            .bandeau-edition-retour h2 { font-size:1.45rem; }
            .ligne-edition-materiel { grid-template-columns:1fr; }
            .controle-quantite-edition { justify-content:flex-end; }
        }
    `;
    document.head.appendChild(style);
}

function auteurInterventionEstUtilisateur(intervention) {
    return Boolean(
        intervention?.createdBy &&
        utilisateurConnecte?.id &&
        String(intervention.createdBy) === String(utilisateurConnecte.id)
    );
}

function ageInterventionMs(intervention) {
    const creation = Date.parse(intervention?.createdAt || "");
    return Number.isFinite(creation) ? Math.max(0, Date.now() - creation) : Infinity;
}

function nomAuteurIntervention(intervention) {
    const prenom = String(intervention?.createdByPrenom || "").trim();
    const nom = String(intervention?.createdByNom || "").trim();
    return (prenom + (prenom && nom ? " " : "") + nom) || "Non renseigné";
}

async function verifierMotDePasseUtilisateurConnecte(motDePasse) {
    const supabase = await assurerBibliothequeSupabaseDisponible();
    const identifiant = String(profilUtilisateurConnecte?.identifiant || "").trim();
    if (!supabase || !identifiant) return false;
    let tentative = await supabase.auth.signInWithPassword({
        email: construireEmailTechnique(identifiant),
        password: String(motDePasse ?? "")
    });
    if (tentative.error && String(motDePasse ?? "").length < 6) {
        tentative = await supabase.auth.signInWithPassword({
            email: construireEmailTechnique(identifiant),
            password: preparerMotDePasseSupabase(motDePasse)
        });
    }
    return !tentative.error && Boolean(tentative.data?.user);
}

async function supprimerRetourIntervention(interventionId) {
    const intervention = historique.find(i => String(i.id) === String(interventionId));
    if (!intervention) return alert("Intervention introuvable.");
    const auteur = auteurInterventionEstUtilisateur(intervention);
    const admin = utilisateurEstSPVAdmin();
    if (!admin && (!auteur || ageInterventionMs(intervention) > 60 * 60 * 1000)) {
        return alert("La suppression de ce retour n'est plus autorisée.");
    }
    const motDePasse = await afficherSaisieCIS("Saisis le mot de passe de ton compte pour confirmer la suppression :", "", "password");
    if (motDePasse === null) return;
    if (!navigator.onLine) return alert("Une connexion Internet est nécessaire pour supprimer un retour d'intervention.");
    if (!await verifierMotDePasseUtilisateurConnecte(motDePasse)) return alert("Mot de passe incorrect.");
    if (!await afficherConfirmationCIS("Supprimer définitivement ce retour d'intervention et remettre les quantités dans le stock ?")) return;
    const supabase = obtenirClientSupabase();
    const { error } = await supabase.rpc("supprimer_retour_intervention", { p_intervention_id: String(interventionId) });
    if (error) return alert("Suppression impossible : " + (error.message || "Erreur Supabase"));
    try {
        const donnees = await recupererDonneesSupabase();
        await appliquerDonneesSupabaseLocalement(donnees);
    } catch (_) {}
    alert("Retour d'intervention supprimé.");
    await afficherHistorique();
}

function htmlLigneMaterielEdition(materiel, quantite) {
    return `
        <div class="ligne-edition-materiel" data-ligne-materiel-id="${echapperHTML(String(materiel.id))}">
            <div class="nom-materiel-edition">${echapperHTML(materiel.nom)}</div>
            <div class="controle-quantite-edition">
                <button type="button" aria-label="Retirer une unité" onclick="changerQuantiteMaterielEdition('${materiel.id}', -1)">−</button>
                <input id="edit-qte-${materiel.id}" data-materiel-id="${materiel.id}" class="edit-qte-intervention" type="number" min="0" step="1" value="${Math.max(0, Math.floor(Number(quantite || 0)))}" inputmode="numeric">
                <button type="button" aria-label="Ajouter une unité" onclick="changerQuantiteMaterielEdition('${materiel.id}', 1)">+</button>
            </div>
        </div>`;
}

function changerQuantiteMaterielEdition(materielId, delta) {
    const champ = document.getElementById(`edit-qte-${materielId}`);
    if (!champ) return;
    const actuelle = Math.max(0, Math.floor(Number(champ.value || 0)));
    champ.value = Math.max(0, actuelle + Number(delta || 0));
}

function rechercherMaterielEditionRetour() {
    const recherche = document.getElementById("recherche-materiel-edition");
    const champId = document.getElementById("ajout-materiel-edition-id");
    const resultats = document.getElementById("resultats-materiel-edition");
    if (!recherche || !champId || !resultats) return;

    champId.value = "";
    const terme = String(recherche.value || "").trim().toLocaleLowerCase();
    if (!terme) {
        resultats.innerHTML = "";
        resultats.classList.remove("ouvert");
        return;
    }

    const dejaPresents = new Set(
        Array.from(document.querySelectorAll(".edit-qte-intervention"))
            .map(champ => String(champ.dataset.materielId || ""))
    );

    const correspondances = [...materiels]
        .filter(m => !dejaPresents.has(String(m.id)))
        .filter(m => {
            const nom = String(m.nom || "").toLocaleLowerCase();
            const reference = String(m.reference || "").toLocaleLowerCase();
            return nom.includes(terme) || reference.includes(terme);
        })
        .sort((a,b) => String(a.nom || "").localeCompare(String(b.nom || ""), "fr", { sensitivity:"base" }))
        .slice(0, 12);

    if (!correspondances.length) {
        resultats.innerHTML = '<div class="reappro-recherche-vide">Aucun matériel trouvé</div>';
        resultats.classList.add("ouvert");
        return;
    }

    resultats.innerHTML = correspondances.map(m => {
        const reference = String(m.reference || "").trim();
        return `<button type="button" class="reappro-resultat" onclick="ajouterMaterielEditionRetourDirect('${echapperHTML(String(m.id))}')"><span><strong>${echapperHTML(m.nom)}</strong>${reference ? `<small>Réf. ${echapperHTML(reference)}</small>` : ""}</span><span class="action-ajout-rapide">Ajouter +</span></button>`;
    }).join("");
    resultats.classList.add("ouvert");
}

function selectionnerMaterielEditionRetour(materielId) {
    const materiel = materiels.find(m => String(m.id) === String(materielId));
    const recherche = document.getElementById("recherche-materiel-edition");
    const champId = document.getElementById("ajout-materiel-edition-id");
    const resultats = document.getElementById("resultats-materiel-edition");
    if (!materiel || !recherche || !champId || !resultats) return;
    recherche.value = String(materiel.nom || "");
    champId.value = String(materiel.id);
    resultats.innerHTML = "";
    resultats.classList.remove("ouvert");
}

function ajouterMaterielEditionRetourDirect(materielId) {
    const materiel = materiels.find(m => String(m.id) === String(materielId));
    const recherche = document.getElementById("recherche-materiel-edition");
    const champId = document.getElementById("ajout-materiel-edition-id");
    const resultats = document.getElementById("resultats-materiel-edition");
    const conteneur = document.getElementById("liste-materiels-edition");
    if (!materiel || !conteneur) return;
    if (document.getElementById(`edit-qte-${materiel.id}`)) return alert("Ce matériel est déjà renseigné.");
    conteneur.insertAdjacentHTML("beforeend", htmlLigneMaterielEdition(materiel, 1));
    if (champId) champId.value = "";
    if (recherche) {
        recherche.value = "";
        recherche.focus();
    }
    if (resultats) {
        resultats.innerHTML = "";
        resultats.classList.remove("ouvert");
    }
}

function ajouterMaterielEditionRetour() {
    const champId = document.getElementById("ajout-materiel-edition-id");
    const recherche = document.getElementById("recherche-materiel-edition");
    const resultats = document.getElementById("resultats-materiel-edition");
    const conteneur = document.getElementById("liste-materiels-edition");
    if (!champId || !conteneur || !champId.value) return alert("Sélectionnez un matériel dans les propositions.");
    const materiel = materiels.find(m => String(m.id) === String(champId.value));
    if (!materiel) return alert("Matériel introuvable.");
    if (document.getElementById(`edit-qte-${materiel.id}`)) return alert("Ce matériel est déjà renseigné.");
    conteneur.insertAdjacentHTML("beforeend", htmlLigneMaterielEdition(materiel, 1));
    champId.value = "";
    if (recherche) recherche.value = "";
    if (resultats) {
        resultats.innerHTML = "";
        resultats.classList.remove("ouvert");
    }
}

function afficherModificationRetourIntervention(interventionId) {
    initialiserStylesActionsIntervention();
    const intervention = historique.find(i => String(i.id) === String(interventionId));
    if (!intervention) return alert("Intervention introuvable.");
    const admin = utilisateurEstSPVAdmin();
    if (!admin) {
        return alert("Ce retour ne peut plus être modifié.");
    }

    const quantites = new Map((intervention.consommations || []).map(c => [String(c.materielId), Number(c.quantite || 0)]));
    const idsActuels = new Set(Array.from(quantites.keys()));
    const lignes = materiels
        .filter(m => idsActuels.has(String(m.id)))
        .sort((a,b)=>String(a.nom).localeCompare(String(b.nom),"fr"))
        .map(m => htmlLigneMaterielEdition(m, quantites.get(String(m.id))))
        .join("");



    document.getElementById("app").innerHTML = `
        <main class="page editeur-retour-special">
            <div class="contenu-editeur-retour">
                <button class="retour-button" onclick="afficherDetailIntervention('${intervention.id}')">← Retour</button>

                <section class="bandeau-edition-retour">
                    <span class="sur-titre">Espace de modification</span>
                    <h2>Matériel déclaré · Inter n°${echapperHTML(intervention.numeroIntervention)}</h2>
                </section>

                <section class="infos-retour-verrouillees">
                    <div class="info-retour-verrouillee">
                        <span class="libelle">Enregistré par</span>
                        <span class="valeur">${echapperHTML(nomAuteurIntervention(intervention))}</span>
                    </div>
                    <div class="info-retour-verrouillee">
                        <span class="libelle">Date</span>
                        <span class="valeur">${echapperHTML(formaterDate(intervention.date))}</span>
                    </div>
                </section>
                <p class="note-verrouillage-retour">La date, le numéro d'intervention et l'identité d'origine ne peuvent pas être modifiés.</p>

                <div id="liste-materiels-edition" class="liste-materiels-edition">${lignes || '<div class="materiel">Aucun matériel renseigné.</div>'}</div>

                <section class="bloc-ajout-materiel-edition">
                    <strong>Ajouter un matériel</strong>
                    <div class="reappro-recherche-wrap">
                        <input id="recherche-materiel-edition" class="reappro-recherche recherche-materiel-edition" type="search" autocomplete="off" placeholder="Rechercher un matériel" aria-label="Rechercher un matériel" oninput="rechercherMaterielEditionRetour()" onfocus="rechercherMaterielEditionRetour()">
                        <input id="ajout-materiel-edition-id" type="hidden" value="">
                        <div id="resultats-materiel-edition" class="reappro-resultats"></div>
                    </div>
                </section>

                <button class="bouton-enregistrer-edition-retour" onclick="enregistrerModificationRetourIntervention('${intervention.id}')">Enregistrer les modifications</button>
            </div>
        </main>`;
}

async function enregistrerModificationRetourIntervention(interventionId) {
    const intervention = historique.find(i => String(i.id) === String(interventionId));
    if (!intervention) return alert("Intervention introuvable.");
    const admin = utilisateurEstSPVAdmin();
    if (!admin) return alert("Ce retour ne peut plus être modifié.");
    if (!navigator.onLine) return alert("Une connexion Internet est nécessaire pour modifier un retour d'intervention.");

    const consommations = Array.from(document.querySelectorAll(".edit-qte-intervention"))
        .map(champ => ({ materiel_id: champ.dataset.materielId, quantite: Math.floor(Number(champ.value || 0)) }))
        .filter(x => x.quantite > 0);

    if (!consommations.length) return alert("Conserve au moins un matériel utilisé.");
    if (!await afficherConfirmationCIS("Enregistrer les modifications du matériel utilisé ?")) return;

    const supabase = obtenirClientSupabase();
    const { error } = await supabase.rpc("modifier_retour_intervention", {
        p_intervention_id: String(interventionId),
        p_date: String(intervention.date),
        p_numero: String(intervention.numeroIntervention),
        p_consommations: consommations
    });
    if (error) return alert("Modification impossible : " + (error.message || "Erreur Supabase"));

    const donnees = await recupererDonneesSupabase();
    await appliquerDonneesSupabaseLocalement(donnees);
    alert("Retour d'intervention modifié.");
    afficherDetailIntervention(interventionId);
}

function afficherDetailIntervention(
    interventionId
) {
    initialiserStylesActionsIntervention();
    const intervention = historique.find(item => String(item.id) === String(interventionId));
    if (!intervention) { alert("Intervention introuvable."); return; }
    const auteur = auteurInterventionEstUtilisateur(intervention);
    const admin = utilisateurEstSPVAdmin();
    const modificationPossible = admin;
    const suppressionAuteurPossible = auteur && ageInterventionMs(intervention) <= 60 * 60 * 1000;
    const afficherSuppression = auteur || admin;
    let html = `<main class="page">
        <button class="retour-button" onclick="afficherHistorique()">← Retour</button>
        <h2>Détail de l'intervention</h2>
        <div class="detail-header">
            <strong>Intervention ${echapperHTML(intervention.numeroIntervention)}</strong>
            <span>Date : ${formaterDate(intervention.date)}</span>
            <span class="auteur-intervention">${echapperHTML(nomAuteurIntervention(intervention))}</span>
        </div>
        <h3>Matériel utilisé</h3>`;
    if (!Array.isArray(intervention.consommations) || !intervention.consommations.length) {
        html += `<div class="materiel">Aucun matériel enregistré pour cette intervention.</div>`;
    } else {
        intervention.consommations.forEach(function(consommation) {
            const materiel = materiels.find(m => String(m.id) === String(consommation.materielId));
            const stockMinimum = materiel && materiel.minimum > 0 && materiel.stock <= materiel.minimum;
            html += `<div class="detail-historique ${stockMinimum ? "detail-stock-faible" : ""}"><div><strong>${echapperHTML(consommation.materiel)}</strong>${materiel ? `<span>Stock actuel : ${materiel.stock}</span>` : ""}</div><strong class="detail-quantite ${stockMinimum ? "texte-stock-faible" : ""}">${consommation.quantite}</strong></div>`;
        });
    }
    if (auteur || admin) {
        html += `<div class="actions-intervention">`;
        if (admin) html += `<button class="bouton-modifier-intervention" ${modificationPossible ? `onclick="afficherModificationRetourIntervention('${intervention.id}')"` : "disabled"}>Modifier</button>`;
        if (afficherSuppression) {
            const suppressionPossible = admin || suppressionAuteurPossible;
            html += `<button class="bouton-supprimer-intervention" ${suppressionPossible ? `onclick="supprimerRetourIntervention('${intervention.id}')"` : "disabled"}>Supprimer</button>`;
        }
        html += `</div>`;
    }
    html += `</main>`;
    document.getElementById("app").innerHTML = html;
}


/* =========================================================
   ADMINISTRATION
   ========================================================= */

async function ouvrirAdministration() {

    if (!verifierPermissionOuRetourAccueil(
        "acces_administration"
    )) {
        return;
    }

    await synchroniserAvantNavigation();

    afficherMenuAdministration();

}


function verifierCodeAdmin() {

    ouvrirAdministration();

}

/* =========================================================
   MENU ADMINISTRATION
   ========================================================= */

function afficherMenuAdministration() {

    if (!verifierPermissionOuRetourAccueil(
        "acces_administration"
    )) {
        return;
    }

    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page navigation-fixe-page">

            <button
                class="retour-button"
                onclick="afficherAccueil()"
            >
                ← Retour
            </button>

            <h2>Administration</h2>

            <div class="menu-administration">
                <button class="menu-button" onclick="afficherArchivesControlesPharmacie()">
                    <span class="menu-icon">📄</span>
                    <span><strong>Traçabilité Meducore / VSAV</strong><small>Consulter et exporter les feuilles de contrôle</small></span>
                </button>

                ${
                    utilisateurAPermission("acces_ajout_materiel")
                        ? `
                            <button class="menu-button" onclick="ajouterMateriel()">
                                <span class="menu-icon">➕</span>
                                <span>
                                    <strong>Ajouter du matériel</strong>
                                    <small>Créer un nouveau matériel</small>
                                </span>
                            </button>
                        `
                        : ""
                }

                ${
                    utilisateurAPermission("acces_gestion_materiel")
                        ? `
                            <button class="menu-button" onclick="gestionMateriels()">
                                <span class="menu-icon">📦</span>
                                <span>
                                    <strong>Gestion du matériel</strong>
                                    <small>Modifier ou supprimer</small>
                                </span>
                            </button>
                        `
                        : ""
                }

                ${
                    utilisateurAPermission("acces_gestion_categories")
                        ? `
                            <button class="menu-button" onclick="gestionCategories()">
                                <span class="menu-icon">📂</span>
                                <span>
                                    <strong>Gestion des catégories</strong>
                                    <small>Créer, modifier ou supprimer</small>
                                </span>
                            </button>
                        `
                        : ""
                }

                ${
                    utilisateurAPermission("acces_reapprovisionnement")
                        ? `
                            <button
                                class="menu-button menu-reapprovisionnement-admin"
                                onclick="afficherReapprovisionnementAdministration()"
                            >
                                <span>
                                    <strong>Réapprovisionnement</strong>
                                    <small>Ajouter du matériel au stock</small>
                                </span>
                            </button>
                        `
                        : ""
                }

                ${
                    utilisateurAPermission("acces_remise_zero_historique")
                        ? `
                            <button class="menu-button" onclick="remiseZeroHistorique()">
                                <span class="menu-icon">🗑️</span>
                                <span>
                                    <strong>Remise à zéro de l'historique</strong>
                                    <small>Archiver la période actuelle</small>
                                </span>
                            </button>
                        `
                        : ""
                }

<button class="menu-button" onclick="ouvrirSuiviVSAVPharma()"><span><strong>Suivi VSAV</strong><small>Matériels à surveiller et remises en état</small></span></button>
            </div>

        </main>

        ${navigationPrincipale("pharmacie", "pharmacie")}

    `;

    initialiserStylesReapprovisionnementArchive();

}

/* =========================================================
   ADMINISTRATEUR APPLI
   ========================================================= */

function afficherMenuAdministrateurAppli() {

    if (
        !verifierAccesAdministrateurAppli()
    ) {
        return;
    }


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page">

            <button
                class="retour-button"
                onclick="afficherAccueil()"
            >
                ← Retour
            </button>


            <h2>
                Administrateur APPLI
            </h2>


            <div class="menu-administration">

                <button
                    class="menu-button"
                    onclick="afficherNotificationsAdministration()"
                >

                    <span class="menu-icon">
                        🔔
                    </span>

                    <span>

                        <strong>
                            Envoyer une notification
                        </strong>

                        <small>
                            Écrire et envoyer un message
                        </small>

                    </span>

                </button>

            </div>

        </main>

    `;

}


/* =========================================================
   GESTION DES UTILISATEURS ET DES RÔLES
   ========================================================= */

let donneesGestionUtilisateurs = {
    utilisateurs: [],
    roles: []
};


async function appelerGestionUtilisateurs(
    action,
    donnees = {}
) {

    if (
        !utilisateurEstSPVAdmin() ||
        !utilisateurAPermission(
            "acces_gestion_utilisateurs"
        )
    ) {
        throw new Error(
            "Accès refusé."
        );
    }


    if (!navigator.onLine) {
        throw new Error(
            "Une connexion Internet est nécessaire."
        );
    }


    const supabase =
        await assurerBibliothequeSupabaseDisponible();


    if (!supabase) {
        throw new Error(
            "Supabase n'est pas disponible."
        );
    }


    const {
        data,
        error
    } =
        await appelerFonctionPrincipale(supabase,
            "gestion-utilisateurs",
            {
                body: {
                    action,
                    ...donnees
                }
            }
        );


    if (error) {

        /*
         * Supabase renvoie souvent seulement :
         * "Edge Function returned a non-2xx status code".
         * On lit donc le corps réel de la réponse de l'Edge Function
         * pour afficher à l'utilisateur la vraie cause.
         */
        let messageDetaille = "";

        try {

            if (
                error.context &&
                typeof error.context.clone === "function"
            ) {

                const reponse =
                    error.context.clone();

                const contenu =
                    await reponse.json();

                messageDetaille =
                    String(
                        contenu?.error ||
                        contenu?.message ||
                        ""
                    ).trim();

            }

        } catch (erreurLecture) {

            console.warn(
                "Lecture du détail Edge Function impossible :",
                erreurLecture
            );

        }

        throw new Error(
            traduireErreurAuthentification(
                messageDetaille ||
                error?.message ||
                "Opération impossible."
            )
        );
    }


    if (
        !data ||
        data.ok !== true
    ) {
        throw new Error(
            traduireErreurAuthentification(
                data?.error ||
                "Opération impossible."
            )
        );
    }


    return data;

}


async function chargerGestionUtilisateurs() {

    const data =
        await appelerGestionUtilisateurs(
            "liste"
        );


    donneesGestionUtilisateurs = {
        utilisateurs:
            Array.isArray(
                data.utilisateurs
            )
                ? data.utilisateurs
                : [],
        roles:
            Array.isArray(
                data.roles
            )
                ? data.roles
                : []
    };


    return donneesGestionUtilisateurs;

}


function roleUtilisateurGestion(
    utilisateur
) {

    const roles =
        utilisateur.roles;

    return Array.isArray(roles)
        ? roles[0] || null
        : roles || null;

}


function permissionRoleHTML(
    role,
    permission,
    libelle,
    prefixe
) {

    return `
        <label>
            <input
                type="checkbox"
                id="${prefixe}-${permission}"
                ${role?.[permission] === true
                    ? "checked"
                    : ""}
            >
            ${libelle}
        </label>
    `;

}


const PERMISSIONS_APPLICATION = [
["acces_inventaire","Inventaire"],["acces_retour_intervention","Retour d'intervention"],["acces_historique","Historique"],["acces_archives","Archives"],["acces_administration","Administration"],["acces_ajout_materiel","Ajouter du matériel"],["acces_gestion_materiel","Gestion du matériel"],["acces_gestion_categories","Gestion des catégories"],["acces_reapprovisionnement","Réapprovisionnement"],["acces_remise_zero_historique","Remise à zéro de l'historique"],["acces_gestion_utilisateurs","Gestion des utilisateurs"],["acces_notifications","Envoyer une notification"],["acces_notifications_pharmacie","Notifications pharmacie"],["acces_espace_caserne","Espace Caserne"],["acces_sport","Sport"],["acces_sport_admin","Sport — Admin"],["acces_manoeuvre","Manœuvre"],["acces_manoeuvre_admin","Manœuvre — Admin"],["acces_casernement","Casernement"],["acces_casernement_admin","Casernement — Admin"],["acces_reunion","Réunion"],["acces_reunion_admin","Réunion — Admin"],["acces_amical_public","Amical — Public"],["acces_amical_membre","Amical — Membre"],["acces_amical_admin","Amical — Admin"],["acces_comite_centre","Comité de centre"],["acces_comite_centre_admin","Comité de centre — Admin"],["acces_administratif","Administratif"],["acces_administratif_admin","Administratif — Admin"],["acces_entretien_individuel","Entretien individuel"],["acces_entretien_individuel_admin","Entretien individuel — Admin"]];

function permissionsUtilisateurHTML(utilisateur, role) {
 const perso=(utilisateur.permissions_personnalisees&&typeof utilisateur.permissions_personnalisees==="object")?utilisateur.permissions_personnalisees:{};
 return PERMISSIONS_APPLICATION.map(([permission,libelle])=>{const valeur=typeof perso[permission]==="boolean"?perso[permission]:role?.[permission]===true; return `<label class="permission-utilisateur-rouge"><input type="checkbox" data-permission-utilisateur="${permission}" data-user-id="${echapperHTML(utilisateur.id)}" ${valeur?"checked":""}> ${echapperHTML(libelle)}</label>`;}).join("");
}
async function enregistrerPermissionsUtilisateur(userId) {
 const permissions={}; document.querySelectorAll(`input[data-permission-utilisateur][data-user-id="${CSS.escape(String(userId))}"]`).forEach(input=>{permissions[input.dataset.permissionUtilisateur]=input.checked===true;});
 try { await appelerGestionUtilisateurs("modifier_permissions_utilisateur",{user_id:userId,permissions_personnalisees:permissions}); if(profilUtilisateurConnecte?.id===userId){profilUtilisateurConnecte.permissions_personnalisees=permissions;sauvegarderProfilUtilisateurCache();} alert("✅ Permissions personnelles enregistrées."); await afficherGestionUtilisateurs(); } catch(erreur){alert("⚠️ "+(erreur?.message||"Enregistrement impossible."));}
}
window.enregistrerPermissionsUtilisateur=enregistrerPermissionsUtilisateur;


async function afficherGestionUtilisateurs() {
    alert("L’application admin de production n’est pas accessible depuis cette version de test.");
    return;

    if (
        !verifierAccesAdministrateurAppli()
    ) {
        return;
    }


    initialiserStyleConnexion();


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page gestion-utilisateurs-page">

            <button
                class="retour-button"
                onclick="afficherMenuAdministrateurAppli()"
            >
                ← Retour
            </button>

            <h2>Gestion des utilisateurs
            </h2>

            <div class="bloc-admin">
                Chargement…
            </div>

        </main>

    `;


    try {

        await chargerGestionUtilisateurs();

        rendreGestionUtilisateurs();

    } catch (erreur) {

        console.error(
            "Gestion utilisateurs :",
            erreur
        );

        document.getElementById(
            "app"
        ).innerHTML += `
            <div class="page">
                <div class="bloc-admin">
                    ⚠️ ${echapperHTML(
                        erreur?.message ||
                        "Chargement impossible."
                    )}
                </div>
            </div>
        `;

    }

}


function rendreGestionUtilisateurs() {

    const utilisateurs =
        donneesGestionUtilisateurs
            .utilisateurs;

    const roles =
        donneesGestionUtilisateurs
            .roles;


    const optionsRoles =
        roles.map(
            function (role) {

                return `
                    <option
                        value="${echapperHTML(role.id)}"
                    >
                        ${echapperHTML(role.nom)}
                    </option>
                `;

            }
        ).join("");


    const cartesUtilisateurs =
        utilisateurs.map(
            function (utilisateur) {

                const role =
                    roleUtilisateurGestion(
                        utilisateur
                    );

                const options =
                    roles.map(
                        function (r) {

                            return `
                                <option
                                    value="${echapperHTML(r.id)}"
                                    ${String(r.id) ===
                                        String(utilisateur.role_id)
                                        ? "selected"
                                        : ""}
                                >
                                    ${echapperHTML(r.nom)}
                                </option>
                            `;

                        }
                    ).join("");


                return `
                    <div class="carte-utilisateur">

                        <strong>
                            ${echapperHTML(
                                utilisateur.prenom || ""
                            )}
                            ${echapperHTML(
                                utilisateur.nom || ""
                            )}
                        </strong>

                        <div>
                            ${echapperHTML(
                                utilisateur.identifiant
                            )}
                        </div>

                        <span class="badge-role">
                            ${echapperHTML(
                                role?.nom || "Sans rôle"
                            )}
                        </span>

                        <label>
                            Rôle
                        </label>

                        <select
                            id="role-user-${echapperHTML(utilisateur.id)}"
                        >
                            ${options}
                        </select>

                        <div class="ligne-actions">

                            <button
                                class="petit-bouton"
                                onclick="modifierRoleUtilisateur('${echapperHTML(utilisateur.id)}')"
                            >
                                💾 Enregistrer le rôle
                            </button>

                            <button
                                class="petit-bouton"
                                onclick="changerMotDePasseUtilisateur('${echapperHTML(utilisateur.id)}','${echapperHTML(utilisateur.identifiant)}')"
                            >
                                🔑 Mot de passe
                            </button>

                            <button
                                class="petit-bouton"
                                onclick="changerEtatUtilisateur('${echapperHTML(utilisateur.id)}', ${utilisateur.actif === true ? "false" : "true"})"
                            >
                                ${utilisateur.actif === true
                                    ? "⛔ Désactiver"
                                    : "✅ Réactiver"}
                            </button>

                        </div>

                        <small>
                            État :
                            <strong>
                                ${utilisateur.actif === true
                                    ? "ACTIF"
                                    : "DÉSACTIVÉ"}
                            </strong>
                        </small>
                        <details class="permissions-utilisateur-details">
                            <summary>Permissions de cet utilisateur</summary>
                            <small>Rouge = permissions individuelles propres à cette personne.</small>
                            <div class="permissions-utilisateur">${permissionsUtilisateurHTML(utilisateur, role)}</div>
                            <button class="petit-bouton bouton-permissions-utilisateur" onclick="enregistrerPermissionsUtilisateur('${echapperHTML(utilisateur.id)}')">💾 Enregistrer les permissions</button>
                        </details>

                    </div>
                `;

            }
        ).join("");


    const cartesRoles =
        roles.map(
            function (role) {

                const prefixe =
                    "role-" +
                    role.id;

                return `
                    <div class="carte-role">

                        <label>
                            Nom du rôle
                        </label>

                        <input
                            id="${prefixe}-nom"
                            value="${echapperHTML(role.nom)}"
                        >

                        <div class="permissions-role">

                            ${permissionRoleHTML(role,"acces_inventaire","Inventaire",prefixe)}
                            ${permissionRoleHTML(role,"acces_retour_intervention","Retour d'intervention",prefixe)}
                            ${permissionRoleHTML(role,"acces_historique","Historique",prefixe)}
                            ${permissionRoleHTML(role,"acces_archives","Archives",prefixe)}
                            ${permissionRoleHTML(role,"acces_administration","Administration",prefixe)}
                            ${permissionRoleHTML(role,"acces_ajout_materiel","Ajouter du matériel",prefixe)}
                            ${permissionRoleHTML(role,"acces_gestion_materiel","Gestion du matériel",prefixe)}
                            ${permissionRoleHTML(role,"acces_gestion_categories","Gestion des catégories",prefixe)}
                            ${permissionRoleHTML(role,"acces_reapprovisionnement","Réapprovisionnement",prefixe)}
                            ${permissionRoleHTML(role,"acces_remise_zero_historique","Remise à zéro de l'historique",prefixe)}
                            ${permissionRoleHTML(role,"acces_gestion_utilisateurs","Gestion des utilisateurs",prefixe)}
                            ${permissionRoleHTML(role,"acces_notifications","Envoyer une notification",prefixe)}
                            ${permissionRoleHTML(role,"acces_notifications_pharmacie","Notifications pharmacie",prefixe)}
                            ${permissionRoleHTML(role,"acces_espace_caserne","Espace Caserne",prefixe)}
${permissionRoleHTML(role,"acces_sport","Sport",prefixe)}
${permissionRoleHTML(role,"acces_sport_admin","Sport — Admin",prefixe)}
${permissionRoleHTML(role,"acces_manoeuvre","Manœuvre",prefixe)}
${permissionRoleHTML(role,"acces_manoeuvre_admin","Manœuvre — Admin",prefixe)}
${permissionRoleHTML(role,"acces_casernement","Casernement",prefixe)}
${permissionRoleHTML(role,"acces_casernement_admin","Casernement — Admin",prefixe)}
${permissionRoleHTML(role,"acces_reunion","Réunion",prefixe)}
${permissionRoleHTML(role,"acces_reunion_admin","Réunion — Admin",prefixe)}
${permissionRoleHTML(role,"acces_amical_public","Amical — Public",prefixe)}
${permissionRoleHTML(role,"acces_amical_membre","Amical — Membre",prefixe)}
${permissionRoleHTML(role,"acces_amical_admin","Amical — Admin",prefixe)}
${permissionRoleHTML(role,"acces_comite_centre","Comité de centre",prefixe)}
${permissionRoleHTML(role,"acces_comite_centre_admin","Comité de centre — Admin",prefixe)}
${permissionRoleHTML(role,"acces_administratif","Administratif",prefixe)}
${permissionRoleHTML(role,"acces_administratif_admin","Administratif — Admin",prefixe)}
${permissionRoleHTML(role,"acces_entretien_individuel","Entretien individuel",prefixe)}
${permissionRoleHTML(role,"acces_entretien_individuel_admin","Entretien individuel — Admin",prefixe)}

                        </div>

                        <div class="ligne-actions">

                            <button
                                class="petit-bouton"
                                onclick="enregistrerRole('${echapperHTML(role.id)}')"
                            >
                                💾 Enregistrer
                            </button>

                            <button
                                class="petit-bouton"
                                onclick="supprimerRoleGestion('${echapperHTML(role.id)}','${echapperHTML(role.nom)}')"
                            >
                                🗑️ Supprimer
                            </button>

                        </div>

                    </div>
                `;

            }
        ).join("");


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page gestion-utilisateurs-page">

            <button
                class="retour-button"
                onclick="afficherMenuAdministrateurAppli()"
            >
                ← Retour
            </button>

            <h2>Gestion des utilisateurs
            </h2>


            <section class="bloc-admin">

                <h3>Nouvel utilisateur
                </h3>

                <div class="grille-formulaire">

                    <input
                        id="new-user-identifiant"
                        placeholder="Identifiant (ex. DUPONTJ)"
                        autocapitalize="characters"
                    >

                    <input
                        id="new-user-nom"
                        placeholder="Nom"
                    >

                    <input
                        id="new-user-prenom"
                        placeholder="Prénom"
                    >

                    <input
                        id="new-user-password"
                        type="password"
                        placeholder="Mot de passe"
                    >

                    <select
                        id="new-user-role"
                    >
                        ${optionsRoles}
                    </select>

                    <button
                        class="add-button"
                        onclick="creerUtilisateurAdministration()"
                    >
                        👤 Créer l'utilisateur
                    </button>

                </div>

            </section>


            <section class="bloc-admin">

                <h3>
                    Utilisateurs
                </h3>

                ${cartesUtilisateurs ||
                    "<p>Aucun utilisateur.</p>"}

            </section>


            <section class="bloc-admin">

                <h3>Nouveau rôle
                </h3>

                <div class="grille-formulaire">

                    <input
                        id="new-role-nom"
                        placeholder="Nom du rôle"
                    >

                    <div class="permissions-role">
<label><input type="checkbox" id="new-role-inventaire"> Inventaire</label>
<label><input type="checkbox" id="new-role-retour"> Retour d'intervention</label>
<label><input type="checkbox" id="new-role-historique"> Historique</label>
<label><input type="checkbox" id="new-role-archives"> Archives</label>
<label><input type="checkbox" id="new-role-administration"> Administration</label>
<label><input type="checkbox" id="new-role-ajout-materiel"> Ajouter du matériel</label>
<label><input type="checkbox" id="new-role-gestion-materiel"> Gestion du matériel</label>
<label><input type="checkbox" id="new-role-categories"> Gestion des catégories</label>
<label><input type="checkbox" id="new-role-reapprovisionnement"> Réapprovisionnement</label>
<label><input type="checkbox" id="new-role-remise-zero"> Remise à zéro de l'historique</label>
<label><input type="checkbox" id="new-role-utilisateurs"> Gestion des utilisateurs</label>
<label><input type="checkbox" id="new-role-notifications"> Envoyer une notification</label>
<label><input type="checkbox" id="new-role-notifications-pharmacie"> Notifications pharmacie</label>
<label><input type="checkbox" id="new-role-espace-caserne"> Espace Caserne</label>
<label><input type="checkbox" id="new-role-sport"> Sport</label>
<label><input type="checkbox" id="new-role-sport-admin"> Sport — Admin</label>
<label><input type="checkbox" id="new-role-manoeuvre"> Manœuvre</label>
<label><input type="checkbox" id="new-role-manoeuvre-admin"> Manœuvre — Admin</label>
<label><input type="checkbox" id="new-role-casernement"> Casernement</label>
<label><input type="checkbox" id="new-role-casernement-admin"> Casernement — Admin</label>
<label><input type="checkbox" id="new-role-reunion"> Réunion</label>
<label><input type="checkbox" id="new-role-reunion-admin"> Réunion — Admin</label>
<label><input type="checkbox" id="new-role-amical-public"> Amical — Public</label>
<label><input type="checkbox" id="new-role-amical-membre"> Amical — Membre</label>
<label><input type="checkbox" id="new-role-amical-admin"> Amical — Admin</label>
<label><input type="checkbox" id="new-role-comite-centre"> Comité de centre</label>
<label><input type="checkbox" id="new-role-comite-centre-admin"> Comité de centre — Admin</label>
<label><input type="checkbox" id="new-role-administratif"> Administratif</label>
<label><input type="checkbox" id="new-role-administratif-admin"> Administratif — Admin</label>
<label><input type="checkbox" id="new-role-entretien-individuel"> Entretien individuel</label>
<label><input type="checkbox" id="new-role-entretien-individuel-admin"> Entretien individuel — Admin</label>
</div>

                    <button
                        class="add-button"
                        onclick="creerRoleAdministration()"
                    >
                        ➕ Créer le rôle
                    </button>

                </div>

            </section>


            <section class="bloc-admin">

                <h3>
                    Rôles et permissions
                </h3>

                ${cartesRoles}

            </section>

        </main>

    `;

}


async function creerUtilisateurAdministration() {

    const identifiant =
        normaliserIdentifiantConnexion(
            document.getElementById(
                "new-user-identifiant"
            )?.value
        );

    const nom =
        document.getElementById(
            "new-user-nom"
        )?.value.trim() || "";

    const prenom =
        document.getElementById(
            "new-user-prenom"
        )?.value.trim() || "";

    const motDePasse =
        document.getElementById(
            "new-user-password"
        )?.value || "";

    const roleId =
        document.getElementById(
            "new-user-role"
        )?.value || "";


    if (
        !identifiant ||
        !motDePasse ||
        !roleId
    ) {
        alert(
            "Identifiant, mot de passe et rôle obligatoires."
        );
        return;
    }



    try {

        await appelerGestionUtilisateurs(
            "creer_utilisateur",
            {
                identifiant,
                nom,
                prenom,
                mot_de_passe:
                    preparerMotDePasseSupabase(motDePasse),
                role_id:
                    roleId
            }
        );


        alert(
            "✅ Utilisateur créé."
        );


        await afficherGestionUtilisateurs();

    } catch (erreur) {

        alert(
            "⚠️ " +
            (
                erreur?.message ||
                "Création impossible."
            )
        );

    }

}


async function modifierRoleUtilisateur(
    userId
) {

    const roleId =
        document.getElementById(
            "role-user-" +
            userId
        )?.value;


    if (!roleId) {
        return;
    }


    try {

        await appelerGestionUtilisateurs(
            "modifier_utilisateur",
            {
                user_id:
                    userId,
                role_id:
                    roleId
            }
        );


        alert(
            "✅ Rôle modifié."
        );


        await afficherGestionUtilisateurs();

    } catch (erreur) {

        alert(
            "⚠️ " +
            (
                erreur?.message ||
                "Modification impossible."
            )
        );

    }

}


async function changerMotDePasseUtilisateur(
    userId,
    identifiant
) {

    const motDePasse =
        await afficherSaisieCIS(
            "Nouveau code pour " +
            identifiant +
            " :"
        );


    if (motDePasse === null) {
        return;
    }



    try {

        await appelerGestionUtilisateurs(
            "changer_mot_de_passe",
            {
                user_id:
                    userId,
                mot_de_passe:
                    preparerMotDePasseSupabase(motDePasse)
            }
        );


        alert(
            "✅ Code modifié."
        );

    } catch (erreur) {

        alert(
            "⚠️ " +
            (
                erreur?.message ||
                "Modification impossible."
            )
        );

    }

}


async function changerEtatUtilisateur(
    userId,
    nouvelEtat
) {

    if (
        !await afficherConfirmationCIS(
            nouvelEtat
                ? "Réactiver cet utilisateur ?"
                : "Désactiver cet utilisateur ?"
        )
    ) {
        return;
    }


    try {

        await appelerGestionUtilisateurs(
            "changer_etat",
            {
                user_id:
                    userId,
                actif:
                    nouvelEtat === true
            }
        );


        alert(
            nouvelEtat
                ? "✅ Utilisateur réactivé."
                : "✅ Utilisateur désactivé."
        );


        await afficherGestionUtilisateurs();

    } catch (erreur) {

        alert(
            "⚠️ " +
            (
                erreur?.message ||
                "Modification impossible."
            )
        );

    }

}


function lirePermissionRole(
    id
) {

    return document.getElementById(
        id
    )?.checked === true;

}


async function creerRoleAdministration() {

    const nom =
        document.getElementById(
            "new-role-nom"
        )?.value.trim() || "";


    if (!nom) {
        alert(
            "Nom du rôle obligatoire."
        );
        return;
    }


    try {

        await appelerGestionUtilisateurs(
            "creer_role",
            {
                nom,
                acces_inventaire:
                    lirePermissionRole(
                        "new-role-inventaire"
                    ),
                acces_retour_intervention:
                    lirePermissionRole(
                        "new-role-retour"
                    ),
                acces_historique:
                    lirePermissionRole(
                        "new-role-historique"
                    ),
                acces_administration:
                    lirePermissionRole(
                        "new-role-administration"
                    ),
                acces_archives:
                    lirePermissionRole("new-role-archives"),
                acces_ajout_materiel:
                    lirePermissionRole("new-role-ajout-materiel"),
                acces_gestion_materiel:
                    lirePermissionRole("new-role-gestion-materiel"),
                acces_gestion_categories:
                    lirePermissionRole("new-role-categories"),
                acces_reapprovisionnement:
                    lirePermissionRole("new-role-reapprovisionnement"),
                acces_remise_zero_historique:
                    lirePermissionRole("new-role-remise-zero"),
                acces_gestion_utilisateurs:
                    lirePermissionRole("new-role-utilisateurs"),
                acces_notifications:
                    lirePermissionRole("new-role-notifications"),
                acces_notifications_pharmacie:
                    lirePermissionRole("new-role-notifications-pharmacie"),
                acces_espace_caserne:
                    lirePermissionRole("new-role-espace-caserne"),
                acces_sport:
                    lirePermissionRole("new-role-sport"),
                acces_sport_admin:
                    lirePermissionRole("new-role-sport-admin"),
                acces_manoeuvre:
                    lirePermissionRole("new-role-manoeuvre"),
                acces_manoeuvre_admin:
                    lirePermissionRole("new-role-manoeuvre-admin"),
                acces_casernement:
                    lirePermissionRole("new-role-casernement"),
                acces_casernement_admin:
                    lirePermissionRole("new-role-casernement-admin"),
                acces_reunion:
                    lirePermissionRole("new-role-reunion"),
                acces_reunion_admin:
                    lirePermissionRole("new-role-reunion-admin"),
                acces_amical_public:
                    lirePermissionRole("new-role-amical-public"),
                acces_amical_membre:
                    lirePermissionRole("new-role-amical-membre"),
                acces_amical_admin:
                    lirePermissionRole("new-role-amical-admin"),
                acces_comite_centre:
                    lirePermissionRole("new-role-comite-centre"),
                acces_comite_centre_admin:
                    lirePermissionRole("new-role-comite-centre-admin"),
                acces_administratif:
                    lirePermissionRole("new-role-administratif"),
                acces_administratif_admin:
                    lirePermissionRole("new-role-administratif-admin"),
                acces_entretien_individuel:
                    lirePermissionRole("new-role-entretien-individuel"),
                acces_entretien_individuel_admin:
                    lirePermissionRole("new-role-entretien-individuel-admin")
            }
        );


        alert(
            "✅ Rôle créé."
        );


        await afficherGestionUtilisateurs();

    } catch (erreur) {

        alert(
            "⚠️ " +
            (
                erreur?.message ||
                "Création impossible."
            )
        );

    }

}


async function enregistrerRole(
    roleId
) {

    const prefixe =
        "role-" +
        roleId;

    const nom =
        document.getElementById(
            prefixe +
            "-nom"
        )?.value.trim() || "";


    if (!nom) {
        alert(
            "Nom du rôle obligatoire."
        );
        return;
    }


    try {

        await appelerGestionUtilisateurs(
            "modifier_role",
            {
                role_id:
                    roleId,
                nom,
                acces_inventaire:
                    lirePermissionRole(
                        prefixe +
                        "-acces_inventaire"
                    ),
                acces_retour_intervention:
                    lirePermissionRole(
                        prefixe +
                        "-acces_retour_intervention"
                    ),
                acces_historique:
                    lirePermissionRole(
                        prefixe +
                        "-acces_historique"
                    ),
                acces_administration:
                    lirePermissionRole(
                        prefixe +
                        "-acces_administration"
                    ),
                acces_archives:
                    lirePermissionRole(prefixe + "-acces_archives"),
                acces_ajout_materiel:
                    lirePermissionRole(prefixe + "-acces_ajout_materiel"),
                acces_gestion_materiel:
                    lirePermissionRole(prefixe + "-acces_gestion_materiel"),
                acces_gestion_categories:
                    lirePermissionRole(prefixe + "-acces_gestion_categories"),
                acces_reapprovisionnement:
                    lirePermissionRole(prefixe + "-acces_reapprovisionnement"),
                acces_remise_zero_historique:
                    lirePermissionRole(prefixe + "-acces_remise_zero_historique"),
                acces_gestion_utilisateurs:
                    lirePermissionRole(prefixe + "-acces_gestion_utilisateurs"),
                acces_notifications:
                    lirePermissionRole(prefixe + "-acces_notifications"),
                acces_notifications_pharmacie:
                    lirePermissionRole(prefixe + "-acces_notifications_pharmacie"),
                acces_espace_caserne:
                    lirePermissionRole(prefixe + "-acces_espace_caserne"),
                acces_sport:
                    lirePermissionRole(prefixe + "-acces_sport"),
                acces_sport_admin:
                    lirePermissionRole(prefixe + "-acces_sport_admin"),
                acces_manoeuvre:
                    lirePermissionRole(prefixe + "-acces_manoeuvre"),
                acces_manoeuvre_admin:
                    lirePermissionRole(prefixe + "-acces_manoeuvre_admin"),
                acces_casernement:
                    lirePermissionRole(prefixe + "-acces_casernement"),
                acces_casernement_admin:
                    lirePermissionRole(prefixe + "-acces_casernement_admin"),
                acces_reunion:
                    lirePermissionRole(prefixe + "-acces_reunion"),
                acces_reunion_admin:
                    lirePermissionRole(prefixe + "-acces_reunion_admin"),
                acces_amical_public:
                    lirePermissionRole(prefixe + "-acces_amical_public"),
                acces_amical_membre:
                    lirePermissionRole(prefixe + "-acces_amical_membre"),
                acces_amical_admin:
                    lirePermissionRole(prefixe + "-acces_amical_admin"),
                acces_comite_centre:
                    lirePermissionRole(prefixe + "-acces_comite_centre"),
                acces_comite_centre_admin:
                    lirePermissionRole(prefixe + "-acces_comite_centre_admin"),
                acces_administratif:
                    lirePermissionRole(prefixe + "-acces_administratif"),
                acces_administratif_admin:
                    lirePermissionRole(prefixe + "-acces_administratif_admin"),
                acces_entretien_individuel:
                    lirePermissionRole(prefixe + "-acces_entretien_individuel"),
                acces_entretien_individuel_admin:
                    lirePermissionRole(prefixe + "-acces_entretien_individuel_admin")
            }
        );


        alert(
            "✅ Rôle modifié."
        );


        /*
         * Si l'admin modifie son propre rôle,
         * recharger immédiatement ses permissions.
         */
        if (
            utilisateurConnecte?.id &&
            navigator.onLine
        ) {

            const supabase =
                obtenirClientSupabase();

            if (supabase) {

                const {
                    data
                } =
                    await supabase.auth
                        .getUser();

                if (data?.user) {
                    await chargerProfilUtilisateurDepuisSupabase(
                        data.user
                    );
                }

            }

        }


        await afficherGestionUtilisateurs();

    } catch (erreur) {

        alert(
            "⚠️ " +
            (
                erreur?.message ||
                "Modification impossible."
            )
        );

    }

}


async function supprimerRoleGestion(
    roleId,
    nom
) {

    if (
        !await afficherConfirmationCIS(
            "Supprimer le rôle « " +
            nom +
            " » ?"
        )
    ) {
        return;
    }


    try {

        await appelerGestionUtilisateurs(
            "supprimer_role",
            {
                role_id:
                    roleId
            }
        );


        alert(
            "✅ Rôle supprimé."
        );


        await afficherGestionUtilisateurs();

    } catch (erreur) {

        alert(
            "⚠️ " +
            (
                erreur?.message ||
                "Suppression impossible."
            )
        );

    }

}


/* =========================================================
   NOTIFICATIONS MANUELLES - ADMINISTRATION
   ========================================================= */

function afficherNotificationsAdministration() {

    if (
        !verifierPermissionOuRetourAccueil(
            "acces_notifications"
        )
    ) {
        return;
    }


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page">

            <button
                class="retour-button"
                onclick="afficherMenuAdministrateurAppli()"
            >
                ← Retour
            </button>


            <h2>Envoyer une notification
            </h2>


            <div class="formulaire">

                <label for="notification-admin-message">
                    Message à envoyer
                </label>


                <textarea
                    id="notification-admin-message"
                    rows="7"
                    maxlength="500"
                    placeholder="Écris ici le message que tu souhaites envoyer..."
                ></textarea>


                <button
                    class="add-button"
                    id="btn-envoyer-notification-admin"
                    onclick="envoyerNotificationAdministration()"
                >
                    📣 Envoyer la notification
                </button>

            </div>

        </main>

    `;


    const zone =
        document.getElementById(
            "notification-admin-message"
        );


    if (zone) {
        zone.focus();
    }

}


async function envoyerNotificationAdministration() {

    if (
        !verifierAccesAdministrateurAppli()
    ) {
        return;
    }


    const zone =
        document.getElementById(
            "notification-admin-message"
        );

    const bouton =
        document.getElementById(
            "btn-envoyer-notification-admin"
        );


    const message =
        zone?.value.trim() || "";


    if (!message) {

        alert(
            "Écris un message."
        );

        return;

    }


    if (!navigator.onLine) {

        alert(
            "⚠️ Une connexion Internet est nécessaire pour envoyer une notification."
        );

        return;

    }


    if (
        !await afficherConfirmationCIS(
            "Envoyer cette notification à tous les appareils inscrits ?"
        )
    ) {

        return;

    }


    if (bouton) {
        bouton.disabled = true;
        bouton.textContent =
            "📣 Envoi en cours…";
    }


    try {

        const resultat =
            await envoyerNotificationPush(
                "CIS Le Chesne",
                message
            );


        const nombre =
            Number(
                resultat?.envoyees || 0
            );


        alert(
            "✅ Notification envoyée à " +
            nombre +
            (
                nombre > 1
                    ? " appareils."
                    : " appareil."
            )
        );


        if (zone) {
            zone.value = "";
        }

    } catch (erreur) {

        console.error(
            "Envoi notification admin impossible :",
            erreur
        );


        alert(
            "⚠️ Impossible d'envoyer la notification."
        );

    } finally {

        if (bouton) {
            bouton.disabled = false;
            bouton.textContent =
                "📣 Envoyer la notification";
        }

    }

}


/* =========================================================
   GESTION DU MATERIEL
   ========================================================= */

function gestionMateriels() {

    if (!verifierPermissionOuRetourAccueil(
        "acces_gestion_materiel"
    )) {
        return;
    }


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page">

            <button
                class="retour-button"
                onclick="
                    afficherMenuAdministration()
                "
            >
                ← Retour
            </button>


            <h2>Gestion du matériel
            </h2>


            <button
                class="add-button"
                onclick="ajouterMateriel()"
            >
                ➕ Ajouter du matériel
            </button>


            <div class="recherche">

                <input
                    type="search"
                    id="recherche-admin"
                    placeholder="🔎 Rechercher..."
                >

            </div>


            <div
                id="liste-admin"
            ></div>

        </main>

    `;


    document
        .getElementById(
            "recherche-admin"
        )
        .addEventListener(
            "input",
            afficherListeAdmin
        );


    afficherListeAdmin();

}


function afficherListeAdmin() {

    const conteneur =
        document.getElementById(
            "liste-admin"
        );


    if (!conteneur) {

        return;

    }


    const recherche =
        (
            document.getElementById(
                "recherche-admin"
            )?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const liste =
        materiels.filter(
            function (materiel) {

                return (
                    !recherche
                    ||
                    materiel.nom
                        .toLowerCase()
                        .includes(
                            recherche
                        )
                    ||
                    materiel.reference
                        .toLowerCase()
                        .includes(
                            recherche
                        )
                );

            }
        );


    if (
        liste.length === 0
    ) {

        conteneur.innerHTML = `

            <div class="materiel">

                Aucun matériel trouvé.

            </div>

        `;

        return;

    }


    conteneur.innerHTML =
        liste
            .map(
                function (materiel) {

                    return `

                        <div
                            class="materiel"
                        >

                            <h3>
                                ${echapperHTML(
                                    materiel.nom
                                )}
                            </h3>


                            <p>
                                Stock :
                                <strong>
                                    ${materiel.stock}
                                </strong>
                            </p>


                            <p>
                                Catégories :
                                ${materiel.categories
                                    .map(
                                        echapperHTML
                                    )
                                    .join(", ")}
                            </p>


                            <div
                                class="
                                    actions-materiel
                                "
                            >

                                <button
                                    onclick="
                                        modifierMateriel(
                                            '${materiel.id}'
                                        )
                                    "
                                >
                                    ✏️ Modifier
                                </button>


                                <button
                                    onclick="
                                        modifierStock(
                                            '${materiel.id}'
                                        )
                                    "
                                >
                                    📦 Stock
                                </button>


                                <button
                                    onclick="
                                        supprimerMateriel(
                                            '${materiel.id}'
                                        )
                                    "
                                >
                                    🗑️ Supprimer
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   FORMULAIRE MATERIEL
   ========================================================= */

function ajouterMateriel() {

    if (!verifierPermissionOuRetourAccueil(
        "acces_ajout_materiel"
    )) {
        return;
    }


    afficherFormulaireMateriel(
        null
    );

}


function modifierMateriel(
    id
) {

    const materiel =
        materiels.find(
            function (m) {

                return (
                    String(m.id) ===
                    String(id)
                );

            }
        );


    if (!materiel) {

        alert(
            "Matériel introuvable."
        );

        return;

    }


    afficherFormulaireMateriel(
        materiel
    );

}


function afficherFormulaireMateriel(
    materiel
) {

    materielEnModification =
        materiel
            ? materiel.id
            : null;


    const modification =
        Boolean(
            materiel
        );


    const options =
        categories
            .map(
                function (categorie) {

                    const coche =
                        materiel &&
                        materiel.categories.some(
                            function (cat) {

                                return (
                                    cat.toLowerCase() ===
                                    categorie.toLowerCase()
                                );

                            }
                        );


                    return `

                        <label
                            class="case-categorie"
                        >

                            <input
                                type="checkbox"
                                name="categories-materiel"
                                value="${echapperHTML(
                                    categorie
                                )}"
                                ${coche ? "checked" : ""}
                            >

                            <span>
                                ${echapperHTML(
                                    CISPharmaCategories.chemin(categorie)
                                )}
                            </span>

                        </label>

                    `;

                }
            )
            .join("");


    document.getElementById(
        "app"
    ).innerHTML = `

        <main class="page">

            <button
                class="retour-button"
                onclick="
                    gestionMateriels()
                "
            >
                ← Retour
            </button>


            <h2>

                ${
                    modification
                    ?
                    "✏️ Modifier le matériel"
                    :
                    "➕ Ajouter du matériel"
                }

            </h2>


            <div
                class="formulaire"
            >

                <label>
                    Nom du matériel
                </label>


                <input
                    type="text"
                    id="nom-materiel"
                    placeholder="Nom du matériel"
                    value="${
                        modification
                        ?
                        echapperHTML(
                            materiel.nom
                        )
                        :
                        ""
                    }"
                >


                <label>
                    Référence
                </label>


                <input
                    type="text"
                    id="reference-materiel"
                    placeholder="Référence"
                    value="${
                        modification
                        ?
                        echapperHTML(
                            materiel.reference
                        )
                        :
                        ""
                    }"
                >


                <label>
                    Catégories
                </label>


                <div
                    class="
                        cases-categories
                    "
                >

                    ${options}

                </div>


                <label>
                    Quantité en stock
                </label>


                <input
                    type="number"
                    id="quantite-materiel"
                    min="0"
                    value="${
                        modification
                        ?
                        materiel.stock
                        :
                        0
                    }"
                >


                <label>
                    Stock minimum
                </label>


                <input
                    type="number"
                    id="minimum-materiel"
                    min="0"
                    value="${
                        modification
                        ?
                        materiel.minimum
                        :
                        0
                    }"
                >


                <label>
                    Emplacement
                </label>


                <input
                    type="text"
                    id="emplacement-materiel"
                    placeholder="Ex : VSAV 1"
                    value="${
                        modification
                        ?
                        echapperHTML(
                            materiel.emplacement
                        )
                        :
                        ""
                    }"
                >


                <label>
                    Description
                </label>


                <textarea
                    id="description-materiel"
                    rows="4"
                    placeholder="Description"
                >${
                    modification
                    ?
                    echapperHTML(
                        materiel.description
                    )
                    :
                    ""
                }</textarea>


                <button
                    class="add-button"
                    onclick="
                        enregistrerMateriel()
                    "
                >

                    💾

                    ${
                        modification
                        ?
                        "Enregistrer les modifications"
                        :
                        "Créer le matériel"
                    }

                </button>

            </div>

        </main>

    `;


    const photo =
        document.getElementById(
            "photo-materiel"
        );


    if (photo) {

        photo.addEventListener(
            "change",
            afficherApercuPhoto
        );

    }

}


/* =========================================================
   PHOTO
   ========================================================= */

function afficherApercuPhoto(
    event
) {

    const fichier =
        event.target.files[0];


    if (!fichier) {

        return;

    }


    const lecteur =
        new FileReader();


    lecteur.onload =
        function (e) {

            const conteneur =
                document.getElementById(
                    "apercu-photo"
                );


            if (!conteneur) {

                return;

            }


            conteneur.innerHTML = `

                <img
                    src="${e.target.result}"
                    class="apercu-photo"
                    alt="Aperçu"
                >

            `;

        };


    lecteur.readAsDataURL(
        fichier
    );

}


/* =========================================================
   ENREGISTRER MATERIEL
   ========================================================= */

function enregistrerMateriel() {

    const nom =
        document.getElementById(
            "nom-materiel"
        )?.value
        .trim();


    const reference =
        document.getElementById(
            "reference-materiel"
        )?.value
        .trim();


    const stock =
        Math.max(
            0,
            Math.floor(
                Number(
                    document.getElementById(
                        "quantite-materiel"
                    )?.value
                ) || 0
            )
        );


    const minimum =
        Math.max(
            0,
            Math.floor(
                Number(
                    document.getElementById(
                        "minimum-materiel"
                    )?.value
                ) || 0
            )
        );


    const emplacement =
        document.getElementById(
            "emplacement-materiel"
        )?.value
        .trim();


    const description =
        document.getElementById(
            "description-materiel"
        )?.value
        .trim();


    /*
     * CORRECTION DEFINITIVE :
     * on récupère les cases cochées avec
     * exactement le bon name.
     */

    const cases =
        document.querySelectorAll(
            'input[type="checkbox"][name="categories-materiel"]:checked'
        );


    const categoriesSelectionnees =
        Array.from(
            cases
        )
            .map(
                function (input) {

                    return input.value;

                }
            )
            .filter(Boolean);


    if (!nom) {

        alert(
            "Indique le nom du matériel."
        );

        return;

    }


    if (
        categoriesSelectionnees.length ===
        0
    ) {

        alert(
            "Sélectionne au moins une catégorie."
        );

        return;

    }


    const fichier = null;


    /* =====================================================
       MODIFICATION
       ===================================================== */

    if (
        materielEnModification !==
        null
    ) {

        const materiel =
            materiels.find(
                function (m) {

                    return (
                        String(m.id) ===
                        String(
                            materielEnModification
                        )
                    );

                }
            );


        if (!materiel) {

            alert(
                "Matériel introuvable."
            );

            return;

        }


        const ancienStock =
            Number(
                materiel.stock
            );


        materiel.nom =
            nom;

        materiel.reference =
            reference;

        materiel.stock =
            stock;

        materiel.minimum =
            minimum;

        materiel.emplacement =
            emplacement;

        materiel.description =
            description;

        materiel.categories =
            categoriesSelectionnees;


        preparerNotificationStock(
            materiel,
            ancienStock,
            ancienStock
        );


        if (fichier) {

            lirePhotoPuis(
                fichier,
                function (photo) {

                    materiel.photo =
                        photo;


                    sauvegarderToutesLesDonnees();

    void synchroniserApresModification();


                    materielEnModification =
                        null;


                    alert(
                        "✅ Matériel modifié."
                    );


                    gestionMateriels();

                }
            );

        } else {

            sauvegarderToutesLesDonnees();

    void synchroniserApresModification();


            materielEnModification =
                null;


            alert(
                "✅ Matériel modifié."
            );


            gestionMateriels();

        }


        return;

    }


    /* =====================================================
       CREATION
       ===================================================== */

    const nouveauMateriel = {

        id:
            genererUUID(),

        nom:
            nom,

        reference:
            reference,

        stock:
            stock,

        minimum:
            minimum,

        emplacement:
            emplacement,

        description:
            description,

        categories:
            categoriesSelectionnees,

        photo:
            ""

    };


    if (fichier) {

        lirePhotoPuis(
            fichier,
            function (photo) {

                nouveauMateriel.photo =
                    photo;


                materiels.push(
                    nouveauMateriel
                );


                sauvegarderToutesLesDonnees();

    void synchroniserApresModification();


                alert(
                    "✅ Matériel créé."
                );


                gestionMateriels();

            }
        );

    } else {

        materiels.push(
            nouveauMateriel
        );


        sauvegarderToutesLesDonnees();

    void synchroniserApresModification();


        alert(
            "✅ Matériel créé."
        );


        gestionMateriels();

    }

}


function lirePhotoPuis(
    fichier,
    callback
) {

    const lecteur =
        new FileReader();


    lecteur.onload =
        function (event) {

            callback(
                event.target.result
            );

        };


    lecteur.onerror =
        function () {

            alert(
                "Impossible de lire la photo."
            );

        };


    lecteur.readAsDataURL(
        fichier
    );

}


/* =========================================================
   CATEGORIES
   ========================================================= */

function gestionCategories() { return CISPharmaCategories.ouvrir(); }
// Conserve les points d’entrée exportés par l’application et les anciens liens.
function ajouterCategorie() { return CISPharmaCategories.ouvrirAction('nouvelle'); }
function modifierCategorie(nom) { return CISPharmaCategories.ouvrirAction('modifier', nom); }
function supprimerCategorie(nom) { return CISPharmaCategories.ouvrirAction('supprimer', nom); }


/* =========================================================
   STOCK
   ========================================================= */

function modifierStock(
    id
) {

    if (!verifierPermissionOuRetourAccueil(
        "acces_administration"
    )) {
        return;
    }


    ouvrirFenetreStock(
        id
    );

}

/* =========================================================
   SUPPRESSION MATERIEL
   ========================================================= */

async function supprimerMateriel(
    id
) {

    if (!verifierPermissionOuRetourAccueil(
        "acces_administration"
    )) {
        return;
    }


    const materiel =
        materiels.find(
            function (m) {

                return (
                    String(m.id) ===
                    String(id)
                );

            }
        );


    if (!materiel) {

        return;

    }


    if (
        !await afficherConfirmationCIS(
            "Veux-tu supprimer « " +
            materiel.nom +
            " » ?"
        )
    ) {

        return;

    }



    materiels =
        materiels.filter(
            function (m) {

                return (
                    String(m.id)
                    !==
                    String(id)
                );

            }
        );


    sauvegarderToutesLesDonnees();

    void synchroniserApresModification();


    alert(
        "✅ Matériel supprimé."
    );


    gestionMateriels();

}


/* =========================================================
   REMISE A ZERO HISTORIQUE
   ========================================================= */

async function remiseZeroHistorique() {

    if (
        !verifierPermissionOuRetourAccueil(
            "acces_remise_zero_historique"
        )
    ) {
        return;
    }


    if (
        historique.length === 0
    ) {

        alert(
            "L'historique est déjà vide."
        );

        return;
    }


    if (
        !navigator.onLine
    ) {

        alert(
            "Une connexion Internet est nécessaire pour archiver l'historique en toute sécurité."
        );

        return;
    }


    if (
        !await afficherConfirmationCIS(
            "Archiver l'historique actuel et commencer une nouvelle période ?"
        )
    ) {

        return;
    }


    const archive = {
        id:
            genererUUID(),
        date:
            dateAujourdhui(),
        createdAt:
            new Date().toISOString(),
        interventions:
            JSON.parse(
                JSON.stringify(
                    historique
                )
            )
    };


    const supabase =
        await assurerBibliothequeSupabaseDisponible();


    if (!supabase) {

        alert(
            "Impossible de joindre Supabase. Réessaie dans quelques instants."
        );

        return;
    }


    demarrerIndicateurSynchronisation();

    synchronisationSupabaseEnCours =
        true;


    try {

        /*
         * Cette fonction Supabase effectue les 3 opérations ensemble :
         * 1. création de l'archive,
         * 2. suppression des consommations courantes,
         * 3. suppression des interventions courantes.
         *
         * L'historique local n'est vidé qu'après réussite.
         */
        const resultat =
            await supabase.rpc(
                "archiver_historique_courant",
                {
                    p_archive_id:
                        archive.id,
                    p_date_commande:
                        archive.date,
                    p_interventions:
                        archive.interventions
                }
            );


        if (resultat.error) {
            throw resultat.error;
        }


        archivesHistorique.push(
            archive
        );

        historique = [];


        sauvegarderToutesLesDonnees();

        effacerModificationsEnAttente();

        enregistrerSnapshotSynchronisation();


        /*
         * Relire la base centrale pour confirmer immédiatement
         * que tous les appareils verront le même état.
         */
        const donnees =
            await recupererDonneesSupabase();

        await appliquerDonneesSupabaseLocalement(
            donnees
        );


        alert(
            "Historique archivé. Une nouvelle période a commencé."
        );


        afficherMenuAdministration();

    } catch (erreur) {

        console.error(
            "Archivage de l'historique impossible :",
            erreur
        );


        alert(
            "L'archivage n'a pas pu être effectué. Rien n'a été supprimé.\n\n" +
            "Erreur : " +
            (
                erreur?.message ||
                String(erreur)
            )
        );

    } finally {

        synchronisationSupabaseEnCours =
            false;

        arreterIndicateurSynchronisation();

    }

}


/* =========================================================
   FONCTIONS GLOBALES
   ========================================================= */

window.afficherConnexion =
    afficherConnexion;

window.seConnecterApplication =
    seConnecterApplication;

window.deconnecterApplication =
    deconnecterApplication;

window.rechercherMiseAJourDepuisProfil =
    rechercherMiseAJourDepuisProfil;

window.afficherProfilUtilisateur =
    afficherProfilUtilisateur;

window.changerMonMotDePasse =
    changerMonMotDePasse;

window.changerNotificationsProfil =
    changerNotificationsProfil;

window.afficherMenuAdministrateurAppli =
    afficherMenuAdministrateurAppli;

window.afficherGestionUtilisateurs =
    afficherGestionUtilisateurs;

window.creerUtilisateurAdministration =
    creerUtilisateurAdministration;

window.modifierRoleUtilisateur =
    modifierRoleUtilisateur;

window.changerMotDePasseUtilisateur =
    changerMotDePasseUtilisateur;

window.changerEtatUtilisateur =
    changerEtatUtilisateur;

window.creerRoleAdministration =
    creerRoleAdministration;

window.enregistrerRole =
    enregistrerRole;

window.supprimerRoleGestion =
    supprimerRoleGestion;

window.afficherPortailPrincipal =
    afficherPortailPrincipal;


window.afficherActualitesCaserne = afficherActualitesCaserne;
window.afficherAdministratifCaserne = afficherAdministratifCaserne;
window.afficherRubriqueCaserne = afficherRubriqueCaserne;
window.retourPagePrecedente = retourPagePrecedente;
window.ouvrirMenuCaserne = ouvrirMenuCaserne;
window.ouvrirPhotoCaserne = ouvrirPhotoCaserne;
window.repondrePublicationCaserne = repondrePublicationCaserne;
window.creerSeanceSportCaserne = creerSeanceSportCaserne;
window.creerPublicationModuleCaserne = creerPublicationModuleCaserne;
window.modifierPublicationCaserne = modifierPublicationCaserne;
window.supprimerPublicationCaserne = supprimerPublicationCaserne;
window.changerVueAdminEntretienCaserne = changerVueAdminEntretienCaserne;
window.exporterPublicationCasernePDF = exporterPublicationCasernePDF;
window.exporterEntretiensPDF = exporterEntretiensPDF;
window.exporterEntretienPDF = exporterEntretienPDF;
window.exporterCommandeArchivePDF = exporterCommandeArchivePDF;
window.ajouterDateEntretienCaserne = ajouterDateEntretienCaserne;
window.retirerDateEntretienCaserne = retirerDateEntretienCaserne;
window.modifierDateEntretienCaserne = modifierDateEntretienCaserne;
window.ajouterHeureEntretienCaserne = ajouterHeureEntretienCaserne;
window.retirerHeureEntretienCaserne = retirerHeureEntretienCaserne;
window.modifierHeureEntretienCaserne = modifierHeureEntretienCaserne;
window.creerPlanningEntretienCaserne = creerPlanningEntretienCaserne;
window.reserverCreneauEntretienCaserne = reserverCreneauEntretienCaserne;
window.annulerReservationEntretienCaserne = annulerReservationEntretienCaserne;
window.supprimerPlanningEntretienCaserne = supprimerPlanningEntretienCaserne;

window.afficherEspaceCaserne =
    afficherEspaceCaserne;

window.afficherAccueil =
    afficherAccueil;

window.afficherInventaire =
    afficherInventaire;

window.fermerFenetreStock =
    fermerFenetreStock;

window.enregistrerStockTotal =
    enregistrerStockTotal;

window.ajouterAuStock =
    ajouterAuStock;

window.selectionnerQuantiteRetour =
    selectionnerQuantiteRetour;

window.afficherRetourIntervention =
    afficherRetourIntervention;

window.validerRetourIntervention =
    validerRetourIntervention;

window.augmenterConsommation =
    augmenterConsommation;

window.diminuerConsommation =
    diminuerConsommation;

window.rechercherMaterielRetour =
    rechercherMaterielRetour;

window.afficherArchivesHistorique =
    afficherArchivesHistorique;

window.afficherDetailCommandeArchive =
    afficherDetailCommandeArchive;

window.afficherReapprovisionnementArchive =
    afficherReapprovisionnementArchive;

window.afficherReapprovisionnementAdministration =
    afficherReapprovisionnementAdministration;

window.validerReapprovisionnementAdministration =
    validerReapprovisionnementAdministration;

window.ajouterLigneReapprovisionnementArchive =
    ajouterLigneReapprovisionnementArchive;

window.validerReapprovisionnementArchive =
    validerReapprovisionnementArchive;

window.afficherDetailInterventionArchive =
    afficherDetailInterventionArchive;

window.afficherHistorique =
    afficherHistorique;

window.afficherDetailConsommation =
    afficherDetailConsommation;

window.afficherDetailIntervention =
    afficherDetailIntervention;

window.afficherModificationRetourIntervention =
    afficherModificationRetourIntervention;

window.enregistrerModificationRetourIntervention =
    enregistrerModificationRetourIntervention;

window.supprimerRetourIntervention =
    supprimerRetourIntervention;

window.ouvrirAdministration =
    ouvrirAdministration;

window.verifierCodeAdmin =
    verifierCodeAdmin;

window.afficherMenuAdministration =
    afficherMenuAdministration;

window.ajouterMateriel =
    ajouterMateriel;

window.modifierMateriel =
    modifierMateriel;

window.afficherFormulaireMateriel =
    afficherFormulaireMateriel;

window.enregistrerMateriel =
    enregistrerMateriel;

window.gestionMateriels =
    gestionMateriels;

window.modifierStock =
    modifierStock;

window.supprimerMateriel =
    supprimerMateriel;

window.gestionCategories =
    gestionCategories;

window.ajouterCategorie =
    ajouterCategorie;

window.modifierCategorie =
    modifierCategorie;

window.supprimerCategorie =
    supprimerCategorie;

window.remiseZeroHistorique =
    remiseZeroHistorique;

window.basculerCategorie =
    basculerCategorie;


/* =========================================================
   INTERFACE BUREAU V43
   Mobile inchangé / PC entièrement dédié
   ========================================================= */

function initialiserInterfaceBureau() {

    if (document.getElementById("style-interface-bureau")) {
        actualiserInterfaceBureau();
        return;
    }

    const style = document.createElement("style");
    style.id = "style-interface-bureau";

    style.textContent = `
        #navigation-bureau {
            display: none;
        }

        .bureau-seulement {
            display: none !important;
        }

        @media (min-width: 1000px) {

            :root {
                --pc-sidebar: 252px;
                --pc-fond: #0d141b;
                --pc-fond-2: #111a22;
                --pc-panel: #141e27;
                --pc-panel-2: #18232d;
                --pc-bordure: #26333f;
                --pc-bordure-claire: #34424f;
                --pc-texte: #f5f7f9;
                --pc-secondaire: #9eabb6;
                --pc-vert: #0f6a43;
                --pc-vert-fonce: #084b30;
                --pc-vert-clair: #dff3e7;
                --pc-rouge: #df3b45;
            }

            .bureau-seulement {
                display: block !important;
            }

            .mobile-seulement {
                display: none !important;
            }

            html,
            body {
                min-height: 100%;
                background: var(--pc-fond);
            }

            body:not(.mode-connexion) {
                background:
                    radial-gradient(circle at 85% 8%, rgba(49,72,89,.16), transparent 30%),
                    linear-gradient(135deg, #0b1117 0%, #101820 100%) !important;
                color: var(--pc-texte);
            }

            body:not(.mode-connexion) #app {
                width: calc(100% - var(--pc-sidebar));
                min-height: 100vh;
                margin-left: var(--pc-sidebar);
                box-sizing: border-box;
                background: transparent;
            }

            /* =====================================================
               MENU LATERAL
               ===================================================== */

            #navigation-bureau {
                position: fixed;
                z-index: 9000;
                inset: 0 auto 0 0;
                width: var(--pc-sidebar);
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                padding: 20px 15px 18px;
                background:
                    linear-gradient(180deg, #111820 0%, #161f29 100%);
                color: #fff;
                border-right: 1px solid rgba(255,255,255,.07);
                box-shadow: 10px 0 30px rgba(0,0,0,.12);
            }

            body.mode-connexion #navigation-bureau,
            #navigation-bureau.masquee {
                display: none !important;
            }

            .bureau-marque {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 2px 18px;
                margin-bottom: 12px;
                border-bottom: 1px solid rgba(255,255,255,.08);
            }

            .bureau-logo {
                display: block;
                width: 100%;
                max-width: 218px;
                height: auto;
                max-height: 190px;
                object-fit: contain;
                border-radius: 0;
                background: transparent;
                box-shadow: none;
            }

            .bureau-nav {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .bureau-nav-separateur {
                margin: 17px 10px 7px;
                color: #65727d;
                font-size: 10px;
                font-weight: 850;
                text-transform: uppercase;
                letter-spacing: .13em;
            }

            .bureau-nav-bouton {
                width: 100%;
                min-height: 43px;
                display: flex;
                align-items: center;
                gap: 11px;
                box-sizing: border-box;
                padding: 9px 11px;
                border: 1px solid transparent;
                border-radius: 9px;
                background: transparent;
                color: #c8d0d7;
                text-align: left;
                font: inherit;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                transition: .16s ease;
            }

            .bureau-nav-bouton:hover {
                background: #1b2631;
                border-color: #293642;
                color: #fff;
            }

            .bureau-nav-bouton.actif {
                background: #29333f;
                border-color: #36434f;
                color: #fff;
                box-shadow: inset 3px 0 0 #fff;
            }

            .bureau-nav-bouton.reappro {
                color: #bfe6d2;
            }

            .bureau-nav-bouton.reappro.actif {
                background: #0c5537;
                border-color: #137149;
                box-shadow: inset 3px 0 0 #7ee0aa;
                color: #fff;
            }

            .bureau-nav-puce {
                width: 7px;
                height: 7px;
                flex: 0 0 7px;
                border-radius: 50%;
                background: currentColor;
                opacity: .8;
            }

            .bureau-utilisateur {
                margin-top: auto;
                padding-top: 14px;
                border-top: 1px solid rgba(255,255,255,.08);
            }

            .bureau-profil {
                width: 100%;
                display: block;
                box-sizing: border-box;
                padding: 10px 11px;
                border: 1px solid transparent;
                border-radius: 9px;
                background: transparent;
                color: #fff;
                text-align: left;
                cursor: pointer;
            }

            .bureau-profil:hover {
                background: #1b2631;
                border-color: #293642;
            }

            .bureau-profil strong,
            .bureau-profil small {
                display: block;
            }

            .bureau-profil strong {
                font-size: 13px;
            }

            .bureau-profil small {
                margin-top: 3px;
                color: #8e9ba7;
                font-size: 11px;
            }

            /* =====================================================
               STRUCTURE GENERALE DES PAGES
               ===================================================== */

            body:not(.mode-connexion) #app > .page,
            body:not(.mode-connexion) #app > .reappro-page {
                width: auto !important;
                max-width: none !important;
                min-height: 100vh;
                margin: 0 !important;
                padding: 34px 42px 58px !important;
                box-sizing: border-box;
            }

            body:not(.mode-connexion) #app > .page {
                background: transparent !important;
            }

            body:not(.mode-connexion) .page > .retour-button,
            body:not(.mode-connexion) .reappro-retour,
            body:not(.mode-connexion) .utilisateur-entete {
                display: none !important;
            }

            body:not(.mode-connexion) .page > h1,
            body:not(.mode-connexion) .page > h2,
            body:not(.mode-connexion) .page > h3 {
                color: var(--pc-texte) !important;
            }

            body:not(.mode-connexion) .page > h2 {
                margin: 0 0 25px !important;
                font-size: 28px !important;
                font-weight: 850 !important;
                line-height: 1.15 !important;
                letter-spacing: -.025em;
            }

            body:not(.mode-connexion) .page > h3 {
                margin: 26px 0 12px !important;
                color: #cbd3d9 !important;
                font-size: 14px !important;
                font-weight: 800 !important;
            }

            body:not(.mode-connexion) .accueil-header {
                margin: 0 0 28px !important;
                padding: 0 !important;
                text-align: left !important;
            }

            body:not(.mode-connexion) .accueil-header h1 {
                margin: 0 !important;
                color: var(--pc-texte) !important;
                font-size: 31px !important;
                line-height: 1.1 !important;
                letter-spacing: -.03em;
            }

            body:not(.mode-connexion) .accueil-header p {
                margin: 7px 0 0 !important;
                color: var(--pc-secondaire) !important;
                font-size: 13px !important;
            }

            /* =====================================================
               ACCUEIL / ADMINISTRATION
               Plus de gros boutons type téléphone
               ===================================================== */

            body:not(.mode-connexion) .menu-principal,
            body:not(.mode-connexion) .menu-administration {
                display: grid !important;
                grid-template-columns: repeat(3, minmax(210px, 1fr));
                gap: 12px !important;
                max-width: 1120px;
            }

            body:not(.mode-connexion) .menu-principal .menu-button,
            body:not(.mode-connexion) .menu-administration .menu-button {
                min-height: 76px !important;
                margin: 0 !important;
                padding: 15px 16px !important;
                display: flex !important;
                align-items: center;
                gap: 13px;
                box-sizing: border-box;
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 9px !important;
                background: linear-gradient(180deg, #151f28, #121a22) !important;
                color: var(--pc-texte) !important;
                box-shadow: none !important;
                text-align: left !important;
                cursor: pointer;
                transition: .16s ease;
            }

            body:not(.mode-connexion) .menu-principal .menu-button:hover,
            body:not(.mode-connexion) .menu-administration .menu-button:hover {
                background: #1a2630 !important;
                border-color: var(--pc-bordure-claire) !important;
                transform: translateY(-1px);
            }

            body:not(.mode-connexion) .menu-button .menu-icon {
                width: 34px;
                height: 34px;
                display: grid;
                place-items: center;
                flex: 0 0 34px;
                border-radius: 8px;
                background: #202d38;
                font-size: 16px !important;
            }

            body:not(.mode-connexion) .menu-button strong {
                display: block;
                color: #f4f7f9 !important;
                font-size: 13px !important;
                line-height: 1.2;
            }

            body:not(.mode-connexion) .menu-button small {
                display: block;
                margin-top: 5px !important;
                color: var(--pc-secondaire) !important;
                font-size: 11px !important;
                line-height: 1.3;
            }

            body:not(.mode-connexion) .menu-administration .menu-reapprovisionnement-admin {
                background: linear-gradient(180deg, #12603f, #0c4c32) !important;
                border-color: #1a7450 !important;
            }

            body:not(.mode-connexion) .menu-administration .menu-reapprovisionnement-admin strong,
            body:not(.mode-connexion) .menu-administration .menu-reapprovisionnement-admin small {
                color: #fff !important;
            }

            /* =====================================================
               FORMULAIRES / PANNEAUX
               ===================================================== */

            body:not(.mode-connexion) .formulaire,
            body:not(.mode-connexion) .bloc-admin,
            body:not(.mode-connexion) .profil-carte,
            body:not(.mode-connexion) .detail-header {
                box-sizing: border-box;
                max-width: 1120px;
                padding: 20px !important;
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 10px !important;
                background: linear-gradient(180deg, #151f28, #121a22) !important;
                color: var(--pc-texte) !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .formulaire label,
            body:not(.mode-connexion) .bloc-admin label,
            body:not(.mode-connexion) .profil-carte label {
                color: #cbd4da !important;
                font-size: 12px !important;
                font-weight: 750 !important;
            }

            body:not(.mode-connexion) input,
            body:not(.mode-connexion) select,
            body:not(.mode-connexion) textarea {
                color-scheme: dark;
                box-sizing: border-box;
                border: 1px solid #34414c !important;
                border-radius: 7px !important;
                background: #0f171e !important;
                color: #f2f5f7 !important;
                font-size: 13px !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) input::placeholder,
            body:not(.mode-connexion) textarea::placeholder {
                color: #73808b !important;
            }

            body:not(.mode-connexion) input:focus,
            body:not(.mode-connexion) select:focus,
            body:not(.mode-connexion) textarea:focus {
                border-color: #63717d !important;
                outline: none !important;
                box-shadow: 0 0 0 3px rgba(99,113,125,.12) !important;
            }

            body:not(.mode-connexion) .recherche {
                max-width: 560px;
                margin: 0 0 22px !important;
            }

            body:not(.mode-connexion) .recherche input {
                min-height: 42px !important;
            }

            /*
             * Contraste PC :
             * les résumés issus de la mise en page mobile avaient un fond clair
             * mais conservaient le texte clair du thème bureau.
             */
            body:not(.mode-connexion) .resume,
            body:not(.mode-connexion) #resume-consommation .resume {
                box-sizing: border-box;
                padding: 16px 18px !important;
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 10px !important;
                background: #151f28 !important;
                color: #f5f7f9 !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .resume h1,
            body:not(.mode-connexion) .resume h2,
            body:not(.mode-connexion) .resume h3,
            body:not(.mode-connexion) .resume p,
            body:not(.mode-connexion) .resume span,
            body:not(.mode-connexion) .resume strong,
            body:not(.mode-connexion) #resume-consommation * {
                color: #f5f7f9 !important;
            }

            body:not(.mode-connexion) .add-button,
            body:not(.mode-connexion) .petit-bouton,
            body:not(.mode-connexion) .profil-bouton-principal {
                min-height: 38px !important;
                padding: 8px 13px !important;
                border: 1px solid #3a4854 !important;
                border-radius: 7px !important;
                background: #202c36 !important;
                color: #fff !important;
                font-size: 12px !important;
                font-weight: 750 !important;
                box-shadow: none !important;
            }

            /* =====================================================
               INVENTAIRE / HISTORIQUE / ARCHIVES
               Cartes transformées en lignes bureau
               ===================================================== */

            body:not(.mode-connexion) .categorie-bloc {
                max-width: 1180px;
                margin-bottom: 18px !important;
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 10px !important;
                overflow: hidden;
                background: #121b23 !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .categorie-titre {
                min-height: 46px !important;
                padding: 10px 15px !important;
                border: 0 !important;
                border-bottom: 1px solid var(--pc-bordure) !important;
                border-radius: 0 !important;
                background: #18232d !important;
                color: #f5f7f9 !important;
                box-shadow: none !important;
                font-size: 13px !important;
            }

            body:not(.mode-connexion) .categorie-contenu {
                padding: 0 !important;
            }

            body:not(.mode-connexion) .materiel,
            body:not(.mode-connexion) .detail-historique,
            body:not(.mode-connexion) .historique-total,
            body:not(.mode-connexion) .intervention-cliquable,
            body:not(.mode-connexion) .archive-commande {
                max-width: 1180px;
                box-sizing: border-box;
                margin: 0 !important;
                padding: 12px 15px !important;
                border: 0 !important;
                border-bottom: 1px solid #222f39 !important;
                border-radius: 0 !important;
                background: #111a22 !important;
                color: var(--pc-texte) !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .materiel:last-child,
            body:not(.mode-connexion) .detail-historique:last-child,
            body:not(.mode-connexion) .intervention-cliquable:last-child {
                border-bottom: 0 !important;
            }

            body:not(.mode-connexion) .materiel:hover,
            body:not(.mode-connexion) .intervention-cliquable:hover {
                background: #16212a !important;
            }

            body:not(.mode-connexion) .carte-materiel-horizontal {
                min-height: 78px !important;
            }

            body:not(.mode-connexion) .carte-photo-droite {
                width: 58px !important;
                height: 58px !important;
                border-radius: 7px !important;
            }

            body:not(.mode-connexion) .photo-materiel {
                border-radius: 7px !important;
            }

            body:not(.mode-connexion) .archive-periode {
                max-width: 1180px;
                margin-bottom: 18px !important;
                border: 1px solid var(--pc-bordure);
                border-radius: 10px;
                overflow: hidden;
                background: #111a22;
            }

            body:not(.mode-connexion) .archive-commande {
                background: #124d35 !important;
                border-bottom-color: #1f684a !important;
            }

            body:not(.mode-connexion) .archive-interventions-titre {
                margin: 0 !important;
                padding: 10px 15px !important;
                background: #17212a;
                color: #9ba8b2 !important;
                font-size: 11px !important;
            }

            /* =====================================================
               GESTION UTILISATEURS / ROLES
               ===================================================== */

            body:not(.mode-connexion) .gestion-utilisateurs-page {
                max-width: none !important;
            }

            body:not(.mode-connexion) .gestion-utilisateurs-page .bloc-admin {
                max-width: 1180px;
                margin-bottom: 18px !important;
            }

            body:not(.mode-connexion) .carte-utilisateur,
            body:not(.mode-connexion) .carte-role {
                margin: 10px 0 !important;
                padding: 16px !important;
                border: 1px solid #2b3944 !important;
                border-radius: 9px !important;
                background: #101820 !important;
                color: #eef2f5 !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .gestion-utilisateurs-page .badge-role {
                background: #dfe8ef !important;
                color: #101820 !important;
                border: 1px solid #c4d0da !important;
            }

            body:not(.mode-connexion) .gestion-utilisateurs-page input,
            body:not(.mode-connexion) .gestion-utilisateurs-page select {
                background: #16212a !important;
                color: #eef2f5 !important;
                border-color: #394955 !important;
            }

            body:not(.mode-connexion) .gestion-utilisateurs-page input::placeholder {
                color: #9ba8b2 !important;
                opacity: 1;
            }

            body:not(.mode-connexion) .gestion-utilisateurs-page select option {
                background: #ffffff;
                color: #17202a;
            }

            body:not(.mode-connexion) .gestion-utilisateurs-page label,
            body:not(.mode-connexion) .gestion-utilisateurs-page small,
            body:not(.mode-connexion) .gestion-utilisateurs-page strong {
                color: inherit;
            }

            body:not(.mode-connexion) .permissions-role {
                display: grid !important;
                grid-template-columns: repeat(3, minmax(190px, 1fr));
                gap: 7px !important;
                margin-top: 13px !important;
            }

            body:not(.mode-connexion) .permissions-role label {
                min-height: 38px;
                display: flex;
                align-items: center;
                gap: 8px;
                box-sizing: border-box;
                padding: 8px 10px;
                border: 1px solid #2a3741;
                border-radius: 7px;
                background: #151e26;
                color: #dce3e8 !important;
                font-size: 11px !important;
            }

            body:not(.mode-connexion) .permissions-role input[type="checkbox"] {
                width: 15px !important;
                height: 15px !important;
                min-height: 0 !important;
                accent-color: #18a766;
            }

            /* =====================================================
               REAPPROVISIONNEMENT PC
               Reprise fidèle de la direction visuelle de la maquette
               ===================================================== */

            body:not(.mode-connexion) #app > .reappro-page {
                position: relative;
                overflow: hidden;
                max-width: none !important;
                padding: 34px 42px 58px !important;
                background:
                    radial-gradient(circle at 82% 5%, rgba(51,142,92,.25), transparent 26%),
                    radial-gradient(circle at 105% 105%, rgba(63,146,101,.18), transparent 34%),
                    linear-gradient(145deg, #073b29 0%, #075237 45%, #043522 100%) !important;
                color: #fff;
            }

            body:not(.mode-connexion) #app > .reappro-page::before,
            body:not(.mode-connexion) #app > .reappro-page::after {
                content: "";
                position: absolute;
                pointer-events: none;
                border: 40px solid rgba(255,255,255,.035);
                border-radius: 50%;
            }

            body:not(.mode-connexion) #app > .reappro-page::before {
                width: 640px;
                height: 640px;
                right: -330px;
                top: -390px;
            }

            body:not(.mode-connexion) #app > .reappro-page::after {
                width: 760px;
                height: 760px;
                left: 20%;
                bottom: -690px;
            }

            body:not(.mode-connexion) .reappro-entete,
            body:not(.mode-connexion) .reappro-feuille {
                position: relative;
                z-index: 1;
                width: min(100%, 1120px) !important;
                max-width: 1120px !important;
                margin-left: 0 !important;
                box-sizing: border-box;
            }

            body:not(.mode-connexion) .reappro-entete {
                min-height: 144px;
                display: flex !important;
                align-items: flex-start;
                justify-content: space-between;
                gap: 28px;
                padding: 8px 2px 26px !important;
                background: transparent !important;
                color: #fff !important;
            }

            body:not(.mode-connexion) .reappro-entete-contenu {
                min-width: 0;
            }

            body:not(.mode-connexion) .reappro-sur-titre {
                margin: 0 0 8px !important;
                color: #96cdb0 !important;
                font-size: 11px !important;
                font-weight: 850 !important;
                letter-spacing: .15em !important;
                text-transform: uppercase;
            }

            body:not(.mode-connexion) .reappro-entete h2 {
                margin: 0 !important;
                color: #fff !important;
                font-size: 35px !important;
                line-height: 1.08;
                font-weight: 900 !important;
                letter-spacing: -.035em;
            }

            body:not(.mode-connexion) .reappro-sous-titre-bureau {
                margin: 10px 0 0 !important;
                color: rgba(255,255,255,.74) !important;
                font-size: 13px !important;
            }

            body:not(.mode-connexion) .reappro-date-bureau {
                min-width: 190px;
                padding: 14px 17px;
                border: 1px solid rgba(157,224,185,.30);
                border-radius: 11px;
                background: rgba(46,140,88,.24);
                color: #fff;
                text-align: left;
                backdrop-filter: blur(4px);
            }

            body:not(.mode-connexion) .reappro-date-label {
                display: block;
                margin-bottom: 4px;
                color: rgba(255,255,255,.72);
                font-size: 10px;
            }

            body:not(.mode-connexion) .reappro-date-bureau strong {
                font-size: 13px;
            }

            body:not(.mode-connexion) .reappro-feuille {
                margin-top: 0 !important;
                padding: 54px 30px 28px !important;
                border: 14px solid rgba(208,247,224,.38) !important;
                border-radius: 16px !important;
                background:
                    linear-gradient(180deg, #fbfffc 0%, #f4fbf6 100%) !important;
                color: #111a15 !important;
                box-shadow: 0 18px 48px rgba(0,0,0,.18) !important;
            }

            body:not(.mode-connexion) .reappro-icone-bureau {
                position: absolute;
                left: 50%;
                top: -35px;
                transform: translateX(-50%);
                width: 64px;
                height: 64px;
                display: grid !important;
                place-items: center;
                border-radius: 14px;
                background: #178b54;
                color: #fff;
                font-size: 35px;
                font-weight: 400;
                box-shadow: 0 8px 18px rgba(20,112,67,.25);
            }

            body:not(.mode-connexion) .reappro-grand-titre {
                margin: 0 0 20px !important;
                color: #101713 !important;
                text-align: center;
                font-size: 24px !important;
                font-weight: 900 !important;
                letter-spacing: -.02em;
            }

            body:not(.mode-connexion) .reappro-table-entete {
                display: grid !important;
                grid-template-columns: 36px minmax(300px, 1fr) 120px 70px;
                gap: 12px;
                align-items: center;
                padding: 10px 4px;
                border-top: 1px solid #dce9e0;
                border-bottom: 1px solid #dce9e0;
                color: #27342c;
                font-size: 11px;
                font-weight: 850;
            }

            body:not(.mode-connexion) .reappro-ligne-supplementaire {
                position: relative;
                grid-template-columns: minmax(300px, 1fr) 120px 42px !important;
                gap: 12px !important;
                align-items: center !important;
                min-height: 58px !important;
                margin: 0 !important;
                padding: 10px 4px 10px 52px !important;
                border-bottom: 1px solid #e1ebe4 !important;
                background: transparent !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .reappro-ligne-supplementaire::before {
                content: counter(reappro-row);
                counter-increment: reappro-row;
                position: absolute;
                left: 8px;
                top: 50%;
                transform: translateY(-50%);
                color: #526059;
                font-size: 12px;
                font-weight: 750;
            }

            body:not(.mode-connexion) #reappro-lignes-supplementaires {
                counter-reset: reappro-row;
            }

            body:not(.mode-connexion) .reappro-recherche,
            body:not(.mode-connexion) .reappro-quantite {
                min-height: 42px !important;
                border: 1px solid #cfdad2 !important;
                border-radius: 7px !important;
                background: #fff !important;
                color: #172019 !important;
                font-size: 12px !important;
            }

            body:not(.mode-connexion) .reappro-quantite {
                color-scheme: light;
                text-align: center;
                cursor: pointer;
                appearance: auto !important;
            }

            body:not(.mode-connexion) .reappro-resultats {
                border: 1px solid #cfdad2 !important;
                border-radius: 7px !important;
                background: #fff !important;
                box-shadow: 0 10px 28px rgba(20,45,30,.16) !important;
            }

            body:not(.mode-connexion) .reappro-resultat {
                background: #fff !important;
                color: #172019 !important;
            }

            body:not(.mode-connexion) .reappro-resultat:hover {
                background: #edf7f1 !important;
            }

            body:not(.mode-connexion) .reappro-supprimer-ligne {
                width: 36px !important;
                height: 36px !important;
                border: 0 !important;
                border-radius: 7px !important;
                background: #df3b45 !important;
                color: #fff !important;
                font-size: 18px !important;
            }

            body:not(.mode-connexion) .reappro-ajout-zone {
                margin: 18px 0 22px !important;
                padding: 0 !important;
                border: 0 !important;
            }

            body:not(.mode-connexion) .reappro-ajouter {
                width: 100% !important;
                min-height: 66px !important;
                border: 2px dashed #1c9b5e !important;
                border-radius: 9px !important;
                background: rgba(231,248,237,.55) !important;
                color: #126a41 !important;
                font-size: 13px !important;
                font-weight: 850 !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .reappro-ajouter:hover {
                background: #e8f7ed !important;
            }

            body:not(.mode-connexion) .reappro-validation {
                width: 100% !important;
                min-height: 48px !important;
                margin: 0 !important;
                border: 0 !important;
                border-radius: 8px !important;
                background: linear-gradient(180deg, #087c49, #05663d) !important;
                color: #fff !important;
                font-size: 13px !important;
                font-weight: 900 !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .reappro-note {
                max-width: none !important;
                margin: 18px 0 0 !important;
                padding: 13px 15px !important;
                border: 1px solid rgba(47,160,95,.40);
                border-radius: 8px;
                background: rgba(31,139,78,.08);
                color: #316044 !important;
                font-size: 11px !important;
                text-align: left !important;
            }

            /* Réappro rapide depuis archives : même DA générale sur PC */
            body:not(.mode-connexion) .reappro-ligne-consommee {
                grid-template-columns: minmax(300px, 1fr) 120px !important;
                gap: 12px !important;
                padding: 10px 4px !important;
                border-bottom: 1px solid #e1ebe4 !important;
                background: transparent !important;
                color: #172019 !important;
            }

            body:not(.mode-connexion) .reappro-nom {
                color: #172019 !important;
            }

            body:not(.mode-connexion) .reappro-stock {
                color: #6e7a72 !important;
            }

            /* Profil PC */
            body:not(.mode-connexion) .profil-page {
                max-width: 980px !important;
            }

            body:not(.mode-connexion) .profil-entete {
                color: var(--pc-texte) !important;
            }

            body:not(.mode-connexion) .profil-role,
            body:not(.mode-connexion) .profil-version,
            body:not(.mode-connexion) .profil-notification-texte,
            body:not(.mode-connexion) .profil-mise-a-jour-texte {
                color: var(--pc-secondaire) !important;
            }

            /* =====================================================
               ESPACE CASERNE SUR PC
               Interface dédiée bordeaux, large et structurée.
               ===================================================== */
            body:not(.mode-connexion):has(.caserne-shell) {
                background:
                    radial-gradient(circle at 88% 8%, rgba(143,47,49,.14), transparent 28%),
                    linear-gradient(135deg, #160f10 0%, #211416 100%) !important;
            }

            body:not(.mode-connexion):has(.caserne-shell) #app {
                background: transparent !important;
            }

            body:not(.mode-connexion) .caserne-shell {
                width: auto !important;
                max-width: none !important;
                min-height: 100vh !important;
                margin: 0 !important;
                padding: 34px 42px 70px !important;
                box-sizing: border-box;
                background: transparent !important;
                color: #f7eeee !important;
            }

            body:not(.mode-connexion) .caserne-top {
                margin: 0 0 24px !important;
                padding: 24px 28px !important;
                border: 1px solid rgba(255,255,255,.08);
                border-radius: 16px !important;
                background: linear-gradient(135deg, #6c2022, #8a2b2d) !important;
                box-shadow: 0 16px 34px rgba(0,0,0,.20) !important;
            }

            body:not(.mode-connexion) .caserne-top h1 {
                margin: 7px 0 8px !important;
                font-size: 34px !important;
            }

            body:not(.mode-connexion) .caserne-top p {
                font-size: 13px;
            }

            body:not(.mode-connexion) .caserne-fil {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px !important;
            }

            body:not(.mode-connexion) .caserne-shell-actualites .caserne-fil,
            body:not(.mode-connexion) .caserne-entretiens-fil {
                grid-template-columns: minmax(0, 1fr);
                max-width: 1180px;
            }

            body:not(.mode-connexion) .caserne-actu-card,
            body:not(.mode-connexion) .caserne-entretien-card,
            body:not(.mode-connexion) .caserne-vide {
                border-radius: 12px !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .caserne-admin-bloc {
                max-width: 1180px;
                border: 1px solid rgba(255,255,255,.10) !important;
                border-radius: 14px !important;
                background: linear-gradient(180deg, #351719, #2a1113) !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .caserne-menu-grille,
            body:not(.mode-connexion) .caserne-admin-centre {
                max-width: 1180px;
                display: grid;
                grid-template-columns: repeat(3, minmax(220px, 1fr));
                gap: 14px;
            }

            body:not(.mode-connexion) .caserne-menu-grille button,
            body:not(.mode-connexion) .caserne-admin-centre button {
                min-height: 92px;
                border-radius: 12px !important;
            }

            body:not(.mode-connexion) .caserne-nav-bas {
                display: none !important;
            }

            #navigation-bureau.theme-caserne {
                background: linear-gradient(180deg, #441416 0%, #241012 100%);
                border-right-color: rgba(255,220,220,.10);
            }

            #navigation-bureau.theme-caserne .bureau-nav-separateur {
                color: #c99191;
            }

            #navigation-bureau.theme-caserne .bureau-nav-bouton {
                color: #ead2d2;
            }

            #navigation-bureau.theme-caserne .bureau-nav-bouton:hover {
                background: #5a1c1f;
                border-color: #74272a;
                color: #fff;
            }

            #navigation-bureau.theme-caserne .bureau-nav-bouton.actif {
                background: #742326;
                border-color: #96383b;
                color: #fff;
                box-shadow: inset 3px 0 0 #ffd7d7;
            }

            #navigation-bureau.theme-caserne .bureau-nav-sous-bouton {
                min-height: 35px;
                margin-left: 12px;
                padding-top: 6px;
                padding-bottom: 6px;
                font-size: 12px;
                font-weight: 650;
            }

            #navigation-bureau.theme-caserne .bureau-nav {
                overflow-y: auto;
                overflow-x: hidden;
                padding-right: 2px;
                scrollbar-width: thin;
            }

            #navigation-bureau.theme-caserne .bureau-nav-sous-bouton {
                width: calc(100% - 12px);
            }

            body:not(.mode-connexion) #app > .caserne-shell {
                width: auto !important;
                max-width: none !important;
                min-height: 100vh;
                margin: 0 !important;
                padding: 34px 42px 58px !important;
                box-sizing: border-box;
                background: #f4ebe8 !important;
            }

            body:not(.mode-connexion) #app > .caserne-shell .caserne-top {
                margin: 0 0 24px !important;
                padding: 28px 32px !important;
                border-radius: 18px !important;
            }

            body:not(.mode-connexion) #app > .caserne-shell .caserne-fil,
            body:not(.mode-connexion) #app > .caserne-shell .caserne-passes-au-dessus,
            body:not(.mode-connexion) #app > .caserne-shell .caserne-fil-actuel {
                width: 100%;
                max-width: 1180px;
            }

            /* =====================================================
               DA PC SOBRE GLOBALE + CASERNE DEDIEE BUREAU
               Mobile volontairement inchangé.
               ===================================================== */

            /* Portail général : même sobriété que la Pharmacie */
            body:not(.mode-connexion) .portail-cis-page {
                max-width: 1180px !important;
            }

            body:not(.mode-connexion) .portail-cis-espaces {
                grid-template-columns: repeat(2, minmax(300px, 1fr)) !important;
                gap: 14px !important;
                width: 100%;
                max-width: none;
            }

            body:not(.mode-connexion) .portail-cis-carte {
                min-height: 104px !important;
                padding: 20px 22px !important;
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 10px !important;
                background: linear-gradient(180deg, #151f28, #121a22) !important;
                color: var(--pc-texte) !important;
                box-shadow: none !important;
                position: relative;
                overflow: hidden;
            }

            body:not(.mode-connexion) .portail-cis-carte::before {
                content: "";
                position: absolute;
                inset: 0 auto 0 0;
                width: 4px;
                background: #5c6974;
            }

            body:not(.mode-connexion) .portail-cis-caserne::before { background: #8b4447; }
            body:not(.mode-connexion) .portail-cis-pharmacie::before { background: #2b7a58; }

            body:not(.mode-connexion) .portail-cis-carte:hover {
                background: #1a2630 !important;
                border-color: var(--pc-bordure-claire) !important;
                transform: translateY(-1px);
            }

            body:not(.mode-connexion) .portail-cis-titre {
                font-size: 15px !important;
                letter-spacing: -.01em;
            }

            body:not(.mode-connexion) .portail-cis-fleche {
                color: #7f8d98 !important;
                font-size: 24px !important;
            }

            /* CASERNE : vrai thème PC, cohérent avec la Pharmacie */
            html:has(body .caserne-shell),
            body:not(.mode-connexion):has(.caserne-shell) {
                background: #0d141b !important;
            }

            body:not(.mode-connexion):has(.caserne-shell) {
                background:
                    radial-gradient(circle at 90% 0%, rgba(56,76,92,.16), transparent 28%),
                    linear-gradient(135deg, #0b1117 0%, #101820 100%) !important;
                color: var(--pc-texte) !important;
            }

            body:not(.mode-connexion):has(.caserne-shell) #app,
            body:not(.mode-connexion):has(.caserne-shell) #app > .caserne-shell {
                background: transparent !important;
            }

            #navigation-bureau.theme-caserne {
                background: linear-gradient(180deg, #111820 0%, #161f29 100%) !important;
                border-right-color: rgba(255,255,255,.07) !important;
            }

            #navigation-bureau.theme-caserne .bureau-nav-separateur {
                color: #65727d !important;
            }

            #navigation-bureau.theme-caserne .bureau-nav-bouton {
                color: #c8d0d7 !important;
            }

            #navigation-bureau.theme-caserne .bureau-nav-bouton:hover {
                background: #1b2631 !important;
                border-color: #293642 !important;
                color: #fff !important;
            }

            #navigation-bureau.theme-caserne .bureau-nav-bouton.actif {
                background: #29333f !important;
                border-color: #36434f !important;
                color: #fff !important;
                box-shadow: inset 3px 0 0 #9caab5 !important;
            }

            body:not(.mode-connexion) #app > .caserne-shell {
                padding: 32px 40px 64px !important;
                color: var(--pc-texte) !important;
            }

            body:not(.mode-connexion) #app > .caserne-shell .caserne-top {
                position: static !important;
                max-width: 1180px;
                margin: 0 0 18px !important;
                padding: 22px 24px !important;
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 10px !important;
                background: linear-gradient(180deg, #151f28, #121a22) !important;
                color: var(--pc-texte) !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) #app > .caserne-shell .caserne-top::before {
                content: "ESPACE CASERNE";
                display: block;
                margin-bottom: 7px;
                color: #7f8d98;
                font-size: 10px;
                font-weight: 850;
                letter-spacing: .14em;
            }

            body:not(.mode-connexion) #app > .caserne-shell .caserne-top > small {
                display: none !important;
            }

            body:not(.mode-connexion) #app > .caserne-shell .caserne-top h1 {
                margin: 0 0 6px !important;
                color: #f5f7f9 !important;
                font-size: 28px !important;
                line-height: 1.15 !important;
                letter-spacing: -.025em;
            }

            body:not(.mode-connexion) #app > .caserne-shell .caserne-top p {
                margin: 0 !important;
                color: var(--pc-secondaire) !important;
                font-size: 12px !important;
            }

            body:not(.mode-connexion) .caserne-raccourcis-publics {
                grid-template-columns: repeat(3, minmax(200px, 1fr)) !important;
                gap: 10px !important;
                max-width: 1180px;
                margin-bottom: 18px !important;
            }

            body:not(.mode-connexion) .caserne-raccourci,
            body:not(.mode-connexion) .caserne-raccourci-secondaire,
            body:not(.mode-connexion) .caserne-menu-liste-simple .caserne-menu-item,
            body:not(.mode-connexion) .caserne-menu-liste-simple button {
                min-height: 64px !important;
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 9px !important;
                background: linear-gradient(180deg, #151f28, #121a22) !important;
                color: var(--pc-texte) !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .caserne-raccourci:hover,
            body:not(.mode-connexion) .caserne-menu-liste-simple button:hover {
                background: #1a2630 !important;
                border-color: var(--pc-bordure-claire) !important;
            }

            body:not(.mode-connexion) .caserne-raccourci span {
                font-size: 18px !important;
            }

            body:not(.mode-connexion) .caserne-raccourci strong,
            body:not(.mode-connexion) .caserne-menu-texte strong {
                color: #f4f7f9 !important;
                font-size: 13px !important;
            }

            body:not(.mode-connexion) .caserne-menu-texte small,
            body:not(.mode-connexion) .caserne-menu-fleche {
                color: var(--pc-secondaire) !important;
            }

            body:not(.mode-connexion) .caserne-fil,
            body:not(.mode-connexion) .caserne-fil-actuel,
            body:not(.mode-connexion) .caserne-passes-au-dessus,
            body:not(.mode-connexion) .caserne-entretiens-fil {
                width: 100% !important;
                max-width: 1180px !important;
            }

            body:not(.mode-connexion) .caserne-shell:not(.caserne-shell-actualites) .caserne-fil {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                align-items: start;
            }

            body:not(.mode-connexion) .caserne-shell-actualites .caserne-fil,
            body:not(.mode-connexion) .caserne-shell-actualites .caserne-fil-actuel,
            body:not(.mode-connexion) .caserne-entretiens-fil {
                grid-template-columns: minmax(0, 1fr) !important;
            }

            body:not(.mode-connexion) .caserne-actu-card,
            body:not(.mode-connexion) .caserne-entretien-card,
            body:not(.mode-connexion) .caserne-vide {
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 10px !important;
                background: linear-gradient(180deg, #151f28, #121a22) !important;
                color: var(--pc-texte) !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .caserne-actu-card {
                padding: 17px 18px !important;
            }

            body:not(.mode-connexion) .caserne-actu-card:hover,
            body:not(.mode-connexion) .caserne-entretien-card:hover {
                border-color: #34424f !important;
            }

            body:not(.mode-connexion) .caserne-actu-card h2,
            body:not(.mode-connexion) .caserne-entretien-card h2,
            body:not(.mode-connexion) .caserne-question-reponse,
            body:not(.mode-connexion) .caserne-vide strong {
                color: #f5f7f9 !important;
            }

            body:not(.mode-connexion) .caserne-actu-card p,
            body:not(.mode-connexion) .caserne-entretien-card > p,
            body:not(.mode-connexion) .caserne-vide p,
            body:not(.mode-connexion) .caserne-etat-reponse,
            body:not(.mode-connexion) .caserne-actu-meta time {
                color: var(--pc-secondaire) !important;
            }

            body:not(.mode-connexion) .caserne-actu-meta {
                padding-bottom: 10px;
                border-bottom: 1px solid #26333f;
            }

            body:not(.mode-connexion) .caserne-actu-meta span,
            body:not(.mode-connexion) .caserne-liste-presents > strong,
            body:not(.mode-connexion) .caserne-entretien-card-entete small {
                color: #c8d0d7 !important;
            }

            body:not(.mode-connexion) .caserne-zone-reponse,
            body:not(.mode-connexion) .caserne-zone-reponse-simple {
                border-color: #293642 !important;
                background: #101820 !important;
            }

            body:not(.mode-connexion) .caserne-liste-presents span,
            body:not(.mode-connexion) .caserne-entretien-card-entete > span {
                background: #202c36 !important;
                color: #dce3e8 !important;
            }

            body:not(.mode-connexion) .caserne-presents-details summary {
                color: #c5d0d7 !important;
            }

            body:not(.mode-connexion) .caserne-separateur-passe {
                color: #778590 !important;
            }

            body:not(.mode-connexion) .caserne-separateur-passe::before,
            body:not(.mode-connexion) .caserne-separateur-passe::after {
                background: #26333f !important;
            }

            body:not(.mode-connexion) .caserne-anciens-evenements {
                border-top-color: #26333f !important;
            }

            body:not(.mode-connexion) .caserne-anciens-evenements > summary {
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 8px !important;
                background: #151f28 !important;
                color: #c8d0d7 !important;
            }

            body:not(.mode-connexion) .caserne-admin-acces {
                max-width: 1180px;
                border: 1px solid #3a4854 !important;
                border-left: 4px solid #71808c !important;
                border-radius: 9px !important;
                background: #151f28 !important;
                color: var(--pc-texte) !important;
            }

            body:not(.mode-connexion) .caserne-admin-acces strong { color: #f5f7f9 !important; }
            body:not(.mode-connexion) .caserne-admin-acces span { color: var(--pc-secondaire) !important; }

            body:not(.mode-connexion) .caserne-admin-bloc {
                border: 1px solid var(--pc-bordure) !important;
                border-radius: 10px !important;
                background: linear-gradient(180deg, #151f28, #121a22) !important;
                color: var(--pc-texte) !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .caserne-formulaire-sport input[type=text],
            body:not(.mode-connexion) .caserne-formulaire-sport input[type=datetime-local],
            body:not(.mode-connexion) .caserne-formulaire-sport input[type=date],
            body:not(.mode-connexion) .caserne-formulaire-sport input[type=file],
            body:not(.mode-connexion) .caserne-formulaire-sport textarea,
            body:not(.mode-connexion) .caserne-formulaire-entretien input[type=number],
            body:not(.mode-connexion) .caserne-entretien-date-entete input,
            body:not(.mode-connexion) .caserne-entretien-heure-ligne input {
                border: 1px solid #34414c !important;
                border-radius: 7px !important;
                background: #0f171e !important;
                color: #f2f5f7 !important;
            }

            body:not(.mode-connexion) .caserne-switch-ligne,
            body:not(.mode-connexion) .caserne-entretien-date-groupe {
                border: 1px solid #293642 !important;
                background: #101820 !important;
            }

            body:not(.mode-connexion) .caserne-bouton-admin-principal,
            body:not(.mode-connexion) .caserne-entretien-ajouter-date,
            body:not(.mode-connexion) .caserne-entretien-ajouter-heure,
            body:not(.mode-connexion) .caserne-entretien-retirer,
            body:not(.mode-connexion) .caserne-retour-actualites {
                border: 1px solid #3a4854 !important;
                border-radius: 7px !important;
                background: #202c36 !important;
                color: #fff !important;
                box-shadow: none !important;
            }

            body:not(.mode-connexion) .caserne-actions-admin button {
                border: 1px solid #3a4854 !important;
                background: #202c36 !important;
                color: #fff !important;
            }

            body:not(.mode-connexion) .caserne-entretien-mon-rdv {
                border: 1px solid #31404c !important;
                background: #17232c !important;
                color: #fff !important;
            }

            body:not(.mode-connexion) .caserne-photo-overlay {
                background: rgba(5,9,12,.96) !important;
            }

            /* Les trois espaces partagent le même cadre sur ordinateur. */
            body:not(.mode-connexion) #app > .portail-cis-page {
                display: flex;
                flex-direction: column;
                gap: 22px;
                min-height: 100vh;
                min-height: 100dvh;
            }
            body:not(.mode-connexion) .portail-cis-page .garde-accueil-zone {
                width: 100%;
                max-width: none;
                margin: auto 0 0;
            }
            body:not(.mode-connexion) .portail-cis-page .raccourcis-accueil-rapides {
                flex-shrink: 0;
            }
            #navigation-bureau .bureau-nav {
                min-height: 0;
                overflow-y: auto;
                flex-shrink: 1;
            }
            #navigation-bureau .bureau-marque,
            #navigation-bureau .bureau-utilisateur { flex-shrink: 0; }
            #navigation-bureau .bureau-nav-bouton { flex-shrink: 0; }

            /* L'équipe conserve le thème sombre PC, y compris les panneaux
               ajoutés après le chargement (inventaires, heures et mail). */
            body:not(.mode-connexion) #app > .garde-menu-page,
            body:not(.mode-connexion) #app > .garde-section {
                width: 100%;
                max-width: 1180px;
                min-height: 100vh;
                margin: 0 auto;
                padding: 34px 42px 58px !important;
                background: transparent;
                color: var(--pc-texte);
            }
            body:not(.mode-connexion) .garde-menu-page::before,
            body:not(.mode-connexion) .garde-section::before { display: none; }

            body:not(.mode-connexion) :is(.garde-menu-carte, .garde-zone:not(.garde-zone-poubelle), .garde-personne-v2, .garde-vehicule-v2, .garde-admin-card:not(.menage-rupture), .garde-stat-ligne, .garde-planning-card, .garde-planning-attente, .gardes-bloc, .veh-card, .veh-materiel-ligne, .mail-doc-section) {
                background: var(--pc-panel) !important;
                border: 1px solid var(--pc-bordure-claire);
                color: var(--pc-texte);
                box-shadow: none;
            }
            body:not(.mode-connexion) :is(.garde-menu-carte strong, .garde-admin-card button, .veh-materiel-ouvrir, .veh-materiel-ouvrir strong) {
                color: var(--pc-texte);
            }
            body:not(.mode-connexion) :is(.garde-menu-carte span, .garde-menu-carte .fleche, .garde-stat-ligne small, .garde-admin-card small, .veh-muted, .veh-materiel-ouvrir small, .veh-materiel-chevron, .mail-doc-destinataire, .mail-doc-compteur) {
                color: #a6b3c0;
            }
            body:not(.mode-connexion) .garde-menu-carte .ico {
                background: #203e32;
                color: #c6edda;
            }
            body:not(.mode-connexion) :is(.garde-personnes-plus, .garde-menage-admin, .equipe-action-button, .heures-resultat, .heures-resultats, .menage-stock-actions button) {
                background: #202c36;
                color: var(--pc-texte);
                border-color: var(--pc-bordure-claire);
            }
            body:not(.mode-connexion) .heures-resultat:hover { background: #2d3e4c; }
            body:not(.mode-connexion) .mail-doc-ligne small { color: #a6b3c0; }
            body:not(.mode-connexion) .mail-doc-ligne:has(input:checked) {
                background: #203e32;
                color: #c6edda;
            }
            body:not(.mode-connexion) .mail-doc-section a { color: #72dda0; }
            body:not(.mode-connexion) .mail-doc-statut.erreur { color: #ff9595; }
            body:not(.mode-connexion) .mail-doc-statut.succes { color: #72dda0; }
            body:not(.mode-connexion) .heures-chip { background: #203e32; color: #c6edda; }
            body:not(.mode-connexion) .heures-chip button { color: inherit; }
            body:not(.mode-connexion) .veh-etat label:not(:has(input:checked)) {
                background: #202c36;
                color: var(--pc-texte);
                border-color: #617687;
            }
            /* Les états colorés restent lisibles, ainsi que le plan du ménage. */
            body:not(.mode-connexion) .garde-zone-poubelle { color: #493b00; }
            body:not(.mode-connexion) .garde-date-recente,
            body:not(.mode-connexion) .garde-presence-pct { color: #72dda0 !important; }
            body:not(.mode-connexion) .garde-date-ancienne,
            body:not(.mode-connexion) .veh-quantite-erreur { color: #ff9595 !important; }
            body:not(.mode-connexion) .menage-rupture small { color: #970000; }
            body:not(.mode-connexion) :is(input[type=date], input[type=time], input[type=datetime-local])::-webkit-calendar-picker-indicator {
                opacity: 1;
                cursor: pointer;
            }

            @media (max-width: 1220px) {
                body:not(.mode-connexion) .menu-principal,
                body:not(.mode-connexion) .menu-administration {
                    grid-template-columns: repeat(2, minmax(210px, 1fr));
                }

                body:not(.mode-connexion) .permissions-role {
                    grid-template-columns: repeat(2, minmax(190px, 1fr));
                }

                body:not(.mode-connexion) .caserne-raccourcis-publics {
                    grid-template-columns: repeat(2, minmax(200px, 1fr)) !important;
                }
            }
        }
    `;

    document.head.appendChild(style);

    const navigation = document.createElement("aside");
    navigation.id = "navigation-bureau";
    navigation.className = "masquee";
    document.body.appendChild(navigation);

    const appElement = document.getElementById("app");

    if (appElement) {

        const observateur =
            new MutationObserver(
                function () {
                    window.requestAnimationFrame(
                        actualiserInterfaceBureau
                    );
                }
            );

        observateur.observe(
            appElement,
            {
                childList: true,
                subtree: false
            }
        );
    }

    installerHistoriqueNavigationApplication();

    window.addEventListener(
        "resize",
        actualiserInterfaceBureau
    );

    actualiserInterfaceBureau();
}


function obtenirRubriqueBureauActive() {

    const titre =
        String(
            document.querySelector(
                "#app h1, #app h2"
            )?.textContent ||
            ""
        )
            .trim()
            .toLowerCase();

    if (document.querySelector("#app .portail-cis-page")) return "accueil-general";
    if (document.querySelector("#app .garde-menu-page, #app .garde-section")) {
        if (titre.includes("ménage")) return "equipe-menage";
        if (titre.includes("inventaire") || document.querySelector("#app .veh-card, #app .veh-inventaire-contenu, #app .veh-inventaire-liste")) return "equipe-vehicules";
        if (titre.includes("planning")) return "equipe-planning";
        if (titre.includes("heure")) return "equipe-heures";
        if (titre.includes("mail")) return "equipe-mail";
        return "equipe-accueil";
    }

    if (document.querySelector("#app .caserne-shell")) {
        if (titre.includes("actualités")) return "caserne-actualites";
        if (titre === "sport" || titre.includes("séance de sport")) return "caserne-sport";
        if (titre.includes("manœuvre")) return "caserne-manoeuvre";
        if (titre.includes("casernement")) return "caserne-casernement";
        if (titre.includes("réunion")) return "caserne-reunion";
        if (titre.includes("amical")) return "caserne-amical";
        if (titre.includes("comité de centre")) return "caserne-comite_centre";
        if (titre.includes("administratif")) return "caserne-administratif";
        if (titre.includes("entretien individuel")) return "caserne-entretien_individuel";
        if (titre === "menu") return "caserne-menu";
        return "caserne-actualites";
    }

    if (titre.includes("réapprovisionnement")) return "reappro";
    if (titre.includes("inventaire")) return "inventaire";
    if (titre.includes("retour")) return "retour";
    if (
        titre.includes("historique") ||
        titre.includes("archive") ||
        titre.includes("commande effectuée")
    ) return "historique";
    if (
        titre.includes("administrateur appli") ||
        titre.includes("utilisateur") ||
        titre.includes("rôle") ||
        titre.includes("notification")
    ) return "admin-appli";
    if (
        titre.includes("administration") ||
        titre.includes("matériel") ||
        titre.includes("catégorie")
    ) return "administration";
    if (titre.includes("profil")) return "profil";

    return "accueil";
}


function actualiserInterfaceBureau() {
    actualiserVisibiliteCentreNotifications();

    const navigation =
        document.getElementById(
            "navigation-bureau"
        );

    if (!navigation) {
        return;
    }

    if (
        !profilUtilisateurConnecte ||
        document.body.classList.contains(
            "mode-connexion"
        )
    ) {
        navigation.classList.add(
            "masquee"
        );
        return;
    }

    navigation.classList.remove(
        "masquee"
    );

    const role =
        obtenirRoleUtilisateur();

    const actif =
        obtenirRubriqueBureauActive();

    const bouton =
        function (
            id,
            libelle,
            action,
            visible = true,
            classe = ""
        ) {

            if (!visible) {
                return "";
            }

            return `
                <button
                    type="button"
                    class="bureau-nav-bouton ${actif === id ? "actif" : ""} ${classe}"
                    onclick="${action}"
                >
                    <span class="bureau-nav-puce"></span>
                    <span>${echapperHTML(libelle)}</span>
                </button>
            `;
        };

    const modeCaserne = Boolean(document.querySelector("#app .caserne-shell"));
    const modePortail = Boolean(document.querySelector("#app .portail-cis-page"));
    const modeEquipe = Boolean(document.querySelector("#app .garde-menu-page, #app .garde-section"));
    const liensEspaces = `
        ${bouton("caserne-actualites", "Espace Caserne", "afficherEspaceCaserne()", utilisateurAPermission("acces_espace_caserne"))}
        ${bouton("pharmacie", "Espace Pharmacie", "afficherAccueil()", utilisateurPeutAccederPharmacie())}
        ${bouton("equipe-accueil", "Espace équipe", "afficherEspaceGarde()", true, modeEquipe ? "actif" : "")}
    `;
    navigation.classList.toggle("theme-caserne", modeCaserne);

    if (modePortail) {
        navigation.classList.remove("theme-caserne");
        navigation.innerHTML = `
            <div class="bureau-marque">
                <img class="bureau-logo" src="./logo-version-pc.png" alt="Logo">
            </div>
            <nav class="bureau-nav" aria-label="Navigation générale">
                ${bouton("accueil-general", "Accueil général", "afficherPortailPrincipal()", true)}
                <div class="bureau-nav-separateur">Espaces</div>
                ${liensEspaces}
            </nav>
            <div class="bureau-utilisateur">
                <button type="button" class="bureau-profil" onclick="ouvrirProfilDepuisPageCourante()">
                    <strong>${echapperHTML(obtenirNomUtilisateurAffiche())}</strong>
                    <small>${echapperHTML(role?.nom || "")}</small>
                </button>
            </div>
        `;
        return;
    }

    if (modeEquipe) {
        navigation.innerHTML = `
            <div class="bureau-marque"><img class="bureau-logo" src="./logo-version-pc.png" alt="Logo"></div>
            <nav class="bureau-nav" aria-label="Navigation Espace équipe">
                ${bouton("accueil-general", "Accueil général", "afficherPortailPrincipal()")}
                <div class="bureau-nav-separateur">Espaces</div>
                ${liensEspaces}
                <div class="bureau-nav-separateur">Espace équipe</div>
                ${bouton("equipe-menage", "Ménage", "ouvrirRubriqueEquipe('menage')")}
                ${bouton("equipe-vehicules", "Inventaire véhicule", "ouvrirRubriqueEquipe('vehicules')")}
                ${bouton("equipe-planning", "Planning", "afficherPlanningEspaceGarde()")}
                ${bouton("equipe-heures", "Enregistrer des heures", "ouvrirRubriqueEquipe('heures')")}
                ${bouton("equipe-mail", "Envoi par mail", "afficherEnvoiDocumentsEquipe()", utilisateurAPermission("acces_envoi_mail"))}
                ${bouton("equipe-administratif", "Administratif", "afficherAdministrationEquipe()", utilisateurAccesAdministratifCentral())}
            </nav>
            <div class="bureau-utilisateur"><button type="button" class="bureau-profil" onclick="ouvrirProfilDepuisPageCourante()"><strong>${echapperHTML(obtenirNomUtilisateurAffiche())}</strong><small>${echapperHTML(role?.nom || "")}</small></button></div>
        `;
        return;
    }

    if (modeCaserne) {
        const rubriques = obtenirRubriquesCaserne().filter(utilisateurPeutVoirRubriqueCaserne);
        const boutonRubrique = (id, libelle) => bouton(
            `caserne-${id}`,
            libelle,
            `afficherRubriqueCaserne('${id}')`,
            true,
            "bureau-nav-sous-bouton"
        );

        const groupe = (titreGroupe, ids) => {
            const contenu = ids
                .map(id => rubriques.find(r => r[0] === id))
                .filter(Boolean)
                .map(r => boutonRubrique(r[0], r[1]))
                .join("");
            return contenu ? `<div class="bureau-nav-separateur">${echapperHTML(titreGroupe)}</div>${contenu}` : "";
        };

        navigation.innerHTML = `
            <div class="bureau-marque">
                <img class="bureau-logo" src="./logo-version-pc.png" alt="Logo">
            </div>
            <nav class="bureau-nav" aria-label="Navigation Espace Caserne">
                ${bouton("accueil-general", "Accueil général", "afficherPortailPrincipal()")}
                ${bouton("caserne-actualites", "Actualités", "afficherActualitesCaserne()")}
                ${groupe("Activités", ["sport","manoeuvre","casernement"])}
                ${groupe("Vie de la caserne", ["reunion","amical","comite_centre"])}
                ${groupe("Personnel", ["entretien_individuel"])}
                
                
                <div class="bureau-nav-separateur">Autres espaces</div>
                ${bouton("pharmacie", "Espace Pharmacie", "afficherAccueil()", utilisateurPeutAccederPharmacie())}
                ${bouton("equipe-accueil", "Espace équipe", "afficherEspaceGarde()")}
            </nav>
            <div class="bureau-utilisateur">
                <button type="button" class="bureau-profil ${actif === "profil" ? "actif" : ""}" onclick="ouvrirProfilDepuisPageCourante()">
                    <strong>${echapperHTML(obtenirNomUtilisateurAffiche())}</strong>
                    <small>${echapperHTML(role?.nom || "")}</small>
                </button>
            </div>
        `;
        return;
    }

    navigation.innerHTML = `
        <div class="bureau-marque">

            <img
                class="bureau-logo"
                src="./logo-version-pc.png"
                alt="Logo"
            >

        </div>

        <nav
            class="bureau-nav"
            aria-label="Navigation principale"
        >

            ${bouton(
                "accueil-general",
                "Accueil général",
                "afficherPortailPrincipal()"
            )}

            <div class="bureau-nav-separateur">Espace Pharmacie</div>

            ${bouton(
                "accueil",
                "Accueil Pharmacie",
                "afficherAccueil()"
            )}

            ${bouton(
                "inventaire",
                "Inventaire",
                "afficherInventaire()",
                utilisateurAPermission(
                    "acces_inventaire"
                )
            )}

            ${bouton(
                "retour",
                "Retour d'intervention",
                "afficherRetourIntervention()",
                utilisateurAPermission(
                    "acces_retour_intervention"
                )
            )}

            ${bouton(
                "historique",
                "Historique",
                "afficherHistorique()",
                utilisateurAPermission(
                    "acces_historique"
                )
            )}

            ${
                utilisateurAPermission(
                    "acces_administration"
                )
                    ? `
                        <div class="bureau-nav-separateur">
                            Gestion
                        </div>
                    `
                    : ""
            }

            ${bouton(
                "administration",
                "Administration",
                "afficherMenuAdministration()",
                utilisateurAPermission(
                    "acces_administration"
                )
            )}

            ${bouton(
                "reappro",
                "Réapprovisionnement",
                "afficherReapprovisionnementAdministration()",
                utilisateurAPermission(
                    "acces_reapprovisionnement"
                ),
                "reappro"
            )}

            ${bouton(
                "admin-appli",
                "Administrateur APPLI",
                "afficherMenuAdministrateurAppli()",
                utilisateurEstSPVAdmin()
            )}

            <div class="bureau-nav-separateur">Espaces</div>
            ${liensEspaces}

        </nav>

        <div class="bureau-utilisateur">

            <button
                type="button"
                class="bureau-profil ${actif === "profil" ? "actif" : ""}"
                onclick="ouvrirProfilDepuisPageCourante()"
            >
                <strong>
                    ${echapperHTML(
                        obtenirNomUtilisateurAffiche()
                    )}
                </strong>

                <small>
                    ${echapperHTML(
                        role?.nom || ""
                    )}
                </small>
            </button>

        </div>
    `;
}


/* Démarrage de l'interface bureau */
if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialiserInterfaceBureau
    );

} else {

    initialiserInterfaceBureau();

}


/* =========================================================
   TUTORIEL VISITEUR INTERACTIF
   L'utilisateur avance en cliquant lui-même sur les vrais boutons.
   Aucune action d'administration n'est présentée et l'événement de
   démonstration Caserne est uniquement visuel : rien n'est enregistré.
   ========================================================= */
let tutorielApplicationActif = false;
let tutorielApplicationEtape = 0;
let tutorielApplicationNettoyageClic = null;

function initialiserStyleTutorielApplication() {
    if (document.getElementById("style-tutoriel-application")) return;
    const style = document.createElement("style");
    style.id = "style-tutoriel-application";
    style.textContent = `
        .tutoriel-voile{position:fixed;inset:0;z-index:250000;background:rgba(8,12,16,.76);pointer-events:auto}
        .tutoriel-cible{position:relative!important;z-index:250002!important;isolation:isolate;border-radius:14px;box-shadow:0 0 0 4px rgba(255,255,255,.96),0 8px 30px rgba(0,0,0,.28)!important;pointer-events:auto!important}
        .tutoriel-bulle{position:fixed;z-index:250003;left:18px;right:18px;bottom:calc(105px + env(safe-area-inset-bottom,0px));max-width:460px;margin:0 auto;padding:15px 17px;box-sizing:border-box;border-radius:18px;background:#fff;color:#202124;box-shadow:0 14px 45px rgba(0,0,0,.32)}
        .tutoriel-bulle strong{display:block;font-size:18px;margin-bottom:5px}.tutoriel-bulle p{margin:0;font-size:15px;line-height:1.4}.tutoriel-indication{display:block;margin-top:8px;font-size:12px;font-weight:850;color:#7d2425}.tutoriel-actions{display:flex;justify-content:flex-end;margin-top:12px}.tutoriel-actions button{min-height:40px;border:0;border-radius:11px;padding:8px 13px;font:inherit;font-weight:800;background:#eceff1;color:#333}
        .tutoriel-evenement-factice{border:2px dashed #8b3437!important}.tutoriel-evenement-factice .caserne-badge-tuto{display:inline-flex;margin-bottom:8px;padding:5px 8px;border-radius:999px;background:#f4e1dc;color:#74292b;font-size:11px;font-weight:900}
        @media(min-width:900px){.tutoriel-bulle{bottom:30px}}
    `;
    document.head.appendChild(style);
}

function nettoyerEtapeTutorielApplication() {
    if (typeof tutorielApplicationNettoyageClic === "function") tutorielApplicationNettoyageClic();
    tutorielApplicationNettoyageClic = null;
    document.querySelectorAll(".tutoriel-cible").forEach(el => el.classList.remove("tutoriel-cible"));
    document.querySelectorAll(".tutoriel-voile,.tutoriel-bulle").forEach(el => el.remove());
}

function quitterTutorielApplication(terminer = false) {
    nettoyerEtapeTutorielApplication();
    tutorielApplicationActif = false;
    tutorielApplicationEtape = 0;
    document.querySelectorAll(".tutoriel-evenement-factice").forEach(el => el.remove());
    afficherPortailPrincipal();
    if (terminer) setTimeout(() => alert("Tutoriel terminé. Tu peux maintenant utiliser l'application normalement."), 80);
}

function ajouterEvenementFacticeTutoriel() {
    if (!tutorielApplicationActif || document.querySelector(".tutoriel-evenement-factice")) return;
    const fil=document.querySelector(".caserne-fil-actuel"); if(!fil)return; const article=document.createElement("article"); article.className="caserne-actu-card caserne-type-sport tutoriel-evenement-factice";
    article.innerHTML=`<span class="caserne-badge-tuto">EXEMPLE DU TUTORIEL</span><div class="caserne-actu-meta"><span>Sport</span><time>Samedi 19 septembre · 09:00</time></div><h2>Entraînement sportif</h2><p>Découvre d'abord le détail de l'événement.</p><button type="button" class="tutoriel-voir-detail petit-bouton">Voir le détail de l'événement</button>`; fil.prepend(article);
}
function afficherDetailEvenementFacticeTutoriel(){const app=document.getElementById("app");if(!app)return;app.innerHTML=`<main class="page caserne-shell navigation-fixe-page"><article class="caserne-actu-card caserne-type-sport tutoriel-evenement-factice"><span class="caserne-badge-tuto">EXEMPLE DU TUTORIEL</span><div class="caserne-actu-meta"><span>Sport</span><time>Samedi 19 septembre · 09:00</time></div><h2>Entraînement sportif</h2><p><strong>Horaire :</strong> 09:00 à 11:00</p><p><strong>Information :</strong> Entraînement collectif à la caserne. Tenue de sport et bouteille d'eau.</p><div class="caserne-zone-reponse caserne-zone-reponse-simple"><strong class="caserne-question-reponse">Seras-tu présent ?</strong><small class="caserne-etat-reponse">Ta réponse permet à l'organisateur de connaître les participants.</small><div class="caserne-boutons-reponse"><button type="button" class="tutoriel-present-factice">✓ Je serai présent</button><button type="button" disabled>✕ Je serai absent</button></div></div></article></main>${navigationPrincipale("caserne","caserne")}`;}
function afficherBulleTutoriel(titre,texte,cible,apresClic,options={}){if(!tutorielApplicationActif||!cible)return false;nettoyerEtapeTutorielApplication();cible.classList.add("tutoriel-cible");cible.scrollIntoView({behavior:"smooth",block:"center"});const voile=document.createElement("div");voile.className="tutoriel-voile";const bulle=document.createElement("div");bulle.className="tutoriel-bulle";bulle.innerHTML=`<strong>${echapperHTML(titre)}</strong><p>${echapperHTML(texte)}</p><span class="tutoriel-indication">Appuie sur le bouton éclairé pour continuer.</span><div class="tutoriel-actions"><button type="button" onclick="quitterTutorielApplication()">Quitter le tutoriel</button></div>`;document.body.appendChild(voile);document.body.appendChild(bulle);const gestionClic=(event)=>{if(options.empecherAction===true){event.preventDefault();event.stopImmediatePropagation();}cible.removeEventListener("click",gestionClic,true);tutorielApplicationNettoyageClic=null;nettoyerEtapeTutorielApplication();if(options.selectionPresent===true){cible.classList.add("selectionne","present");cible.textContent="✓ Présent sélectionné";}setTimeout(()=>apresClic?.(),options.delai||180);};cible.addEventListener("click",gestionClic,true);tutorielApplicationNettoyageClic=()=>cible.removeEventListener("click",gestionClic,true);return true;}
function boutonNavigationTutoriel(libelle){return [...document.querySelectorAll(".caserne-nav-bas button")].find(b=>String(b.textContent||"").toLowerCase().includes(libelle.toLowerCase()));}
function boutonMenuPharmacieTutoriel(libelle){return [...document.querySelectorAll(".menu-button,.caserne-menu-liste-simple>button")].find(b=>String(b.textContent||"").toLowerCase().includes(libelle.toLowerCase()));}
async function afficherEtapeTutorielApplication(numero){if(!tutorielApplicationActif)return;tutorielApplicationEtape=numero;
if(numero===0){afficherPortailPrincipal();await new Promise(r=>setTimeout(r,100));const cible=document.querySelector(".portail-cis-caserne");if(!cible)return afficherEtapeTutorielApplication(4);return afficherBulleTutoriel("Espace Caserne","Tu retrouves ici les actualités et événements de la caserne.",cible,()=>afficherEtapeTutorielApplication(1),{delai:600});}
if(numero===1){await new Promise(r=>setTimeout(r,450));ajouterEvenementFacticeTutoriel();const cible=document.querySelector(".tutoriel-voir-detail");if(!cible)return afficherEtapeTutorielApplication(3);return afficherBulleTutoriel("Un événement","Ouvre l'événement pour lire la date, l'horaire et les informations avant de répondre.",cible,()=>{afficherDetailEvenementFacticeTutoriel();afficherEtapeTutorielApplication(2);},{empecherAction:true,delai:180});}
if(numero===2){await new Promise(r=>setTimeout(r,120));const cible=document.querySelector(".tutoriel-present-factice");return afficherBulleTutoriel("Répondre à l'événement","Tu as maintenant toutes les informations. Indique ta présence. Cet exemple n'enregistre rien.",cible,()=>afficherEtapeTutorielApplication(3),{empecherAction:true,selectionPresent:true,delai:300});}
if(numero===3){const cible=boutonNavigationTutoriel("Accueil");if(!cible){afficherPortailPrincipal();return afficherEtapeTutorielApplication(4);}return afficherBulleTutoriel("Retour à l'accueil","Pour changer d'espace, reviens d'abord à l'accueil général.",cible,()=>afficherEtapeTutorielApplication(4),{delai:450});}
if(numero===4){await new Promise(r=>setTimeout(r,180));const cible=document.querySelector(".portail-cis-pharmacie");if(!cible)return afficherEtapeTutorielApplication(9);return afficherBulleTutoriel("Espace Pharmacie","Ouvre maintenant l'Espace Pharmacie.",cible,()=>afficherEtapeTutorielApplication(5),{delai:450});}
if(numero===5){await new Promise(r=>setTimeout(r,220));const cible=boutonMenuPharmacieTutoriel("Inventaire");if(!cible)return afficherEtapeTutorielApplication(7);return afficherBulleTutoriel("Inventaire","L'inventaire sert à rechercher le matériel et à vérifier les quantités disponibles.",cible,()=>afficherEtapeTutorielApplication(6),{delai:450});}
if(numero===6){await new Promise(r=>setTimeout(r,250));const cible=document.querySelector(".retour-button");if(!cible)return afficherEtapeTutorielApplication(7);return afficherBulleTutoriel("Dans l'inventaire","Tu peux parcourir les catégories, rechercher un matériel et voir son stock. Appuie sur Retour.",cible,()=>afficherEtapeTutorielApplication(7),{delai:400});}
if(numero===7){await new Promise(r=>setTimeout(r,220));const cible=boutonMenuPharmacieTutoriel("Retour d'intervention");if(!cible)return afficherEtapeTutorielApplication(9);return afficherBulleTutoriel("Retour d'intervention","Après une intervention, ouvre cet outil pour déclarer le matériel consommé.",cible,()=>afficherEtapeTutorielApplication(8),{delai:450});}
if(numero===8){await new Promise(r=>setTimeout(r,250));const cible=document.querySelector(".retour-button");if(!cible)return afficherEtapeTutorielApplication(9);return afficherBulleTutoriel("Remplir le retour","Renseigne la date, le numéro d'intervention et les quantités utilisées. Appuie sur Retour.",cible,()=>afficherEtapeTutorielApplication(9),{delai:400});}
if(numero===9){await new Promise(r=>setTimeout(r,180));const cible=boutonNavigationTutoriel("Accueil");if(!cible){afficherPortailPrincipal();return afficherEtapeTutorielApplication(10);}return afficherBulleTutoriel("Accueil général","Reviens à l'accueil général.",cible,()=>afficherEtapeTutorielApplication(10),{delai:350});}
if(numero===10){await new Promise(r=>setTimeout(r,180));const cible=boutonNavigationTutoriel("Profil");if(!cible)return quitterTutorielApplication(true);return afficherBulleTutoriel("Ton profil","Ton profil permet de gérer ton compte, tes notifications, le tutoriel et les mises à jour.",cible,()=>quitterTutorielApplication(true),{delai:350});}quitterTutorielApplication(true);}


function demarrerTutorielApplication() {
    initialiserStyleTutorielApplication();
    tutorielApplicationActif = true;
    tutorielApplicationEtape = 0;
    afficherPortailPrincipal();
    setTimeout(() => afficherEtapeTutorielApplication(0),80);
}

window.demarrerTutorielApplication = demarrerTutorielApplication;
window.afficherEtapeTutorielApplication = afficherEtapeTutorielApplication;
window.quitterTutorielApplication = quitterTutorielApplication;



/* =========================================================
   GESTION DES GARDES
   ========================================================= */

function initialiserStyleGardes() {
    if (document.getElementById("style-gestion-gardes")) return;
    const style = document.createElement("style");
    style.id = "style-gestion-gardes";
    style.textContent = `
        .garde-accueil-zone{margin:22px 0 110px}.garde-accueil-carte{box-sizing:border-box;width:100%;padding:20px;cursor:pointer;border-radius:18px;background:#171d24;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.12)}
        .garde-accueil-carte small{display:block;font-size:12px;font-weight:900;letter-spacing:.12em;opacity:.7;margin-bottom:8px}.garde-accueil-carte strong{display:block;font-size:20px;line-height:1.25}.garde-accueil-carte span{display:block;margin-top:7px;font-size:14px;opacity:.88}.garde-accueil-carte.ma-garde{background:#176b45}.garde-accueil-carte.pas-garde{background:#29313a}.garde-accueil-carte.sans-garde{background:#5b6168}
        .gestion-gardes-page{padding-bottom:110px}.gardes-bloc{margin:16px 0;padding:16px;border-radius:16px;background:#fff;box-shadow:0 4px 18px rgba(0,0,0,.08)}.gardes-bloc h3{margin:0 0 12px}.gardes-form-ligne{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.gardes-form-ligne input,.gardes-form-ligne select{min-height:44px;padding:9px 11px;border:1px solid #d5d9de;border-radius:10px;font:inherit;box-sizing:border-box}.gardes-form-ligne input{flex:1;min-width:170px}.gardes-form-ligne button,.garde-equipe-actions button,.garde-semaine button{min-height:42px;border:0;border-radius:10px;padding:9px 13px;font:inherit;font-weight:800;cursor:pointer}.gardes-form-ligne button{background:#1f6f4a;color:#fff}
        .garde-equipe{margin-top:12px;padding:14px;border:1px solid #e2e5e8;border-radius:13px}.garde-equipe-entete{display:flex;align-items:center;justify-content:space-between;gap:10px}.garde-equipe-entete strong{font-size:16px}.garde-equipe-actions{display:flex;gap:6px}.garde-equipe-actions button{min-height:36px;padding:7px 9px;background:#eef1f3}.garde-equipe-actions .danger{background:#fbe8e8;color:#9f2832}.garde-membres{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:7px;margin-top:12px}.garde-membres label{display:flex;gap:8px;align-items:center;padding:8px 9px;border-radius:9px;background:#f6f7f8;font-size:14px}.garde-membres input{width:18px;height:18px}.garde-enregistrer-membres{margin-top:10px;background:#171d24!important;color:#fff}
        .garde-semaine{display:grid;grid-template-columns:minmax(145px,1fr) minmax(150px,1fr);gap:9px;align-items:center;padding:10px 0;border-bottom:1px solid #eceef0}.garde-semaine:last-child{border-bottom:0}.garde-semaine span{font-size:14px;font-weight:700}.garde-semaine select{width:100%;min-height:42px;border:1px solid #d5d9de;border-radius:10px;padding:8px;font:inherit;background:#fff}
        @media(max-width:520px){.garde-semaine{grid-template-columns:1fr}.gardes-bloc{padding:14px}.portail-cis-page{padding-bottom:300px!important}.portail-cis-page .garde-accueil-zone{position:fixed;left:22px;right:22px;bottom:var(--equipe-accueil-bas,104px);z-index:90;margin:0;max-width:none}.portail-cis-page .garde-accueil-carte{padding:18px 20px;border-radius:18px}}
    `;
    document.head.appendChild(style);
}

function lundiDeLaSemaine(date = new Date()) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const jour = d.getDay() || 7;
    d.setDate(d.getDate() - jour + 1);
    return d;
}

function dateISOlocale(date) {
    const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,"0"), j=String(date.getDate()).padStart(2,"0");
    return `${y}-${m}-${j}`;
}

function libelleSemaineGarde(dateDebut) {
    const debut = new Date(`${dateDebut}T12:00:00`);
    const fin = new Date(debut); fin.setDate(fin.getDate()+7);
    const a = debut.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"});
    const b = fin.toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"});
    return `Du ${a} à 19 h au ${b} à 19 h`;
}

function vendrediReferenceGarde(date = new Date()) {
    const d = new Date(date);
    const jour = d.getDay();
    let recul = (jour - 5 + 7) % 7;
    // Friday before 19:00 still belongs to the guard that started the previous Friday.
    if (jour === 5 && d.getHours() < 19) recul = 7;
    d.setHours(12,0,0,0);
    d.setDate(d.getDate() - recul);
    return d;
}

async function chargerGardeSemaineCourante() {
    const supabase = obtenirClientSupabase();
    if (!supabase || !profilUtilisateurConnecte?.id) return null;

    const vendredi = dateISOlocale(vendrediReferenceGarde(new Date()));

    // Do not depend on the PostgREST relationship: fetch planning then team separately.
    const {data: planning,error} = await supabase
        .from("planning_gardes")
        .select("id,date_debut,equipe_id")
        .eq("date_debut",vendredi)
        .maybeSingle();

    if (error) throw error;
    if (!planning) return {date_debut:vendredi,equipe:null,estMembre:false};

    const [{data:equipe,error:errEquipe},{data:membre,error:errMembre}] = await Promise.all([
        supabase.from("equipes_garde").select("id,nom,actif").eq("id",planning.equipe_id).maybeSingle(),
        supabase.from("equipes_garde_membres").select("id").eq("equipe_id",planning.equipe_id).eq("utilisateur_id",profilUtilisateurConnecte.id).maybeSingle()
    ]);
    if (errEquipe) throw errEquipe;
    if (errMembre) throw errMembre;

    return {date_debut:vendredi,equipe:equipe||null,estMembre:!!membre};
}

try {
    const ancienneCarte=sessionStorage.getItem("cis_carte_equipe_accueil")||"";
    if(/indisponible|Chargement de la garde/i.test(ancienneCarte)) sessionStorage.removeItem("cis_carte_equipe_accueil");
} catch (_) {}

let cacheCarteGardeAccueilHTML = "";
try {
    const cacheVersion=sessionStorage.getItem("cis_carte_equipe_version");
    if(cacheVersion!=="v8"){
        sessionStorage.removeItem("cis_carte_equipe_accueil");
        sessionStorage.setItem("cis_carte_equipe_version","v8");
    }
} catch (_) {}
try { cacheCarteGardeAccueilHTML = sessionStorage.getItem("cis_carte_equipe_accueil") || ""; } catch (_) {}

function memoriserCarteEquipeAccueil(html) {
    cacheCarteGardeAccueilHTML = html || "";
    try { if (html) sessionStorage.setItem("cis_carte_equipe_accueil", html); } catch (_) {}
    return cacheCarteGardeAccueilHTML;
}

async function actualiserCarteGardeAccueil() {
    initialiserStyleGardes();
    const zone=document.getElementById("carte-garde-accueil");

    // Au retour de l'Espace équipe, on réaffiche immédiatement la dernière carte
    // au lieu de laisser "Chargement de la garde..." à l'écran.

    try {
        // Sécurité : Supabase ne peut plus laisser cette carte charger indéfiniment.
        const garde=await chargerGardeSemaineCourante();
        if(!garde) return;
        let htmlCarte="";
        if(!garde.equipe){
            htmlCarte=`<div class="garde-accueil-carte sans-garde" role="button" tabindex="0" onclick="afficherEspaceGarde()"><small>GARDE</small><strong>Aucune équipe programmée cette semaine</strong><span>${echapperHTML(libelleSemaineGarde(garde.date_debut))}</span></div>`;
        }else{
            htmlCarte=`<div class="garde-accueil-carte ${garde.estMembre?"ma-garde":"pas-garde"}" role="button" tabindex="0" onclick="afficherEspaceGarde()" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();afficherEspaceGarde();}"><small>ÉQUIPE · ${echapperHTML(garde.equipe.nom || "Équipe")}</small><strong>${garde.estMembre?"TU ES DE GARDE CETTE SEMAINE":"TU N’ES PAS DE GARDE CETTE SEMAINE"}</strong><span>${echapperHTML(libelleSemaineGarde(garde.date_debut))}</span></div>`;
        }
        cacheCarteGardeAccueilHTML=memoriserCarteEquipeAccueil(htmlCarte);
        const zoneActuelle=document.getElementById("carte-garde-accueil");
        if(zoneActuelle) zoneActuelle.innerHTML=cacheCarteGardeAccueilHTML;
    } catch(erreur) {
        console.error("Affichage garde :",erreur);
        if(zone && !cacheCarteGardeAccueilHTML){ zone.innerHTML=`<div class="garde-accueil-carte sans-garde" role="button" onclick="afficherEspaceGarde()"><small>ÉQUIPE</small><strong>ESPACE ÉQUIPE</strong></div>`; }
    }
}

async function chargerDonneesGardesAdmin() {
    if (!utilisateurEstSPVAdmin()) throw new Error("Accès réservé au rôle SPV ADMIN.");
    const supabase=obtenirClientSupabase(); if(!supabase) throw new Error("Supabase indisponible.");
    const [eq,mem,plan] = await Promise.all([
        supabase.from("equipes_garde").select("id,nom,actif").order("nom"),
        supabase.from("equipes_garde_membres").select("id,equipe_id,utilisateur_id"),
        supabase.from("planning_gardes").select("id,date_debut,equipe_id").order("date_debut")
    ]);
    if(eq.error) throw eq.error; if(mem.error) throw mem.error; if(plan.error) throw plan.error;
    if(!donneesGestionUtilisateurs.utilisateurs?.length) await chargerGestionUtilisateurs();
    return {equipes:eq.data||[],membres:mem.data||[],planning:plan.data||[],utilisateurs:donneesGestionUtilisateurs.utilisateurs.filter(u=>u.actif===true)};
}

async function afficherGestionGardes() {
    alert("L’application admin de production n’est pas accessible depuis cette version de test.");
    return;
    if(!utilisateurEstSPVAdmin()){ alert("Accès réservé au rôle SPV ADMIN."); return; }
    initialiserStyleGardes();
    document.getElementById("app").innerHTML=`<main class="page gestion-gardes-page"><button class="retour-button" onclick="afficherMenuAdministrateurAppli()">← Retour</button><h2>Gestion des gardes</h2><div class="gardes-bloc">Chargement…</div></main>${navigationPrincipale("", "accueil")}`;
    try { const d=await chargerDonneesGardesAdmin(); rendreGestionGardes(d); }
    catch(e){ console.error(e); document.querySelector(".gardes-bloc").innerHTML=`⚠️ ${echapperHTML(e?.message||"Chargement impossible.")}`; }
}

function rendreGestionGardes(d) {
    const actifs=d.equipes.filter(e=>e.actif!==false);
    const utilisateurs=[...d.utilisateurs].sort((a,b)=>`${a.nom||""} ${a.prenom||""}`.localeCompare(`${b.nom||""} ${b.prenom||""}`,"fr"));
    const cartes=d.equipes.map(e=>{
        const ids=new Set(d.membres.filter(m=>m.equipe_id===e.id).map(m=>m.utilisateur_id));
        return `<div class="garde-equipe"><div class="garde-equipe-entete"><strong>${echapperHTML(e.nom)}${e.actif===false?" (inactive)":""}</strong><div class="garde-equipe-actions"><button onclick="renommerEquipeGarde('${e.id}','${echapperHTML(String(e.nom).replaceAll("'","&#39;"))}')">Renommer</button><button class="danger" onclick="supprimerEquipeGarde('${e.id}')">Supprimer</button></div></div><div class="garde-membres">${utilisateurs.map(u=>`<label><input type="checkbox" data-garde-equipe="${e.id}" value="${u.id}" ${ids.has(u.id)?"checked":""}> ${echapperHTML([u.prenom,u.nom].filter(Boolean).join(" ")||u.identifiant||"Utilisateur")}</label>`).join("")||"Aucun utilisateur actif."}</div><button class="garde-enregistrer-membres" onclick="enregistrerMembresEquipeGarde('${e.id}')">Enregistrer les membres</button></div>`;
    }).join("");
    const lundi=lundiDeLaSemaine(new Date());
    const semaines=[]; for(let i=-4;i<20;i++){const x=new Date(lundi);x.setDate(x.getDate()+i*7);semaines.push(dateISOlocale(x));}
    const options=(valeur)=>`<option value="">Aucune équipe</option>`+actifs.map(e=>`<option value="${e.id}" ${e.id===valeur?"selected":""}>${echapperHTML(e.nom)}</option>`).join("");
    const lignes=semaines.map(date=>{const p=d.planning.find(x=>x.date_debut===date);return `<div class="garde-semaine"><span>${echapperHTML(libelleSemaineGarde(date))}</span><select onchange="attribuerEquipeSemaineGarde('${date}',this.value)">${options(p?.equipe_id||"")}</select></div>`}).join("");
    document.getElementById("app").innerHTML=`<main class="page gestion-gardes-page"><button class="retour-button" onclick="afficherMenuAdministrateurAppli()">← Retour</button><h2>Gestion des gardes</h2><section class="gardes-bloc"><h3>Équipes</h3><div class="gardes-form-ligne"><input id="nouvelle-equipe-garde" placeholder="Nom de l'équipe"><button onclick="creerEquipeGarde()">Créer l'équipe</button></div>${cartes||"<p>Aucune équipe créée.</p>"}</section><section class="gardes-bloc"><h3>Calendrier des gardes</h3><p>Choisis l'équipe de garde pour chaque semaine. La modification est enregistrée immédiatement.</p>${lignes}</section></main>${navigationPrincipale("", "accueil")}`;
    actualiserInterfaceBureau();
}

async function creerEquipeGarde(){const input=document.getElementById("nouvelle-equipe-garde"),nom=String(input?.value||"").trim();if(!nom){alert("Indique le nom de l'équipe.");return;}try{const s=obtenirClientSupabase();const {error}=await s.from("equipes_garde").insert({nom});if(error)throw error;await afficherGestionGardes();}catch(e){alert("⚠️ "+(e?.message||"Création impossible."));}}
async function renommerEquipeGarde(id,ancienNom){const nom=await afficherSaisieCIS("Nouveau nom de l'équipe :",ancienNom);if(nom===null||!String(nom).trim())return;try{const {error}=await obtenirClientSupabase().from("equipes_garde").update({nom:String(nom).trim(),updated_at:new Date().toISOString()}).eq("id",id);if(error)throw error;await afficherGestionGardes();}catch(e){alert("⚠️ "+(e?.message||"Modification impossible."));}}
async function supprimerEquipeGarde(id){if(!await afficherConfirmationCIS("Supprimer cette équipe ? Les semaines qui lui sont attribuées seront également supprimées."))return;try{const {error}=await obtenirClientSupabase().from("equipes_garde").delete().eq("id",id);if(error)throw error;await afficherGestionGardes();}catch(e){alert("⚠️ "+(e?.message||"Suppression impossible."));}}
async function enregistrerMembresEquipeGarde(equipeId){try{const s=obtenirClientSupabase();const ids=[...document.querySelectorAll(`input[data-garde-equipe="${CSS.escape(equipeId)}"]:checked`)].map(x=>x.value);const {error:e1}=await s.from("equipes_garde_membres").delete().eq("equipe_id",equipeId);if(e1)throw e1;if(ids.length){const {error:e2}=await s.from("equipes_garde_membres").insert(ids.map(utilisateur_id=>({equipe_id:equipeId,utilisateur_id})));if(e2)throw e2;}alert("✅ Membres de l'équipe enregistrés.");await afficherGestionGardes();}catch(e){alert("⚠️ "+(e?.message||"Enregistrement impossible."));}}
async function attribuerEquipeSemaineGarde(dateDebut,equipeId){try{const s=obtenirClientSupabase();if(!equipeId){const {error}=await s.from("planning_gardes").delete().eq("date_debut",dateDebut);if(error)throw error;}else{const {error}=await s.from("planning_gardes").upsert({date_debut:dateDebut,equipe_id:equipeId,updated_at:new Date().toISOString()},{onConflict:"date_debut"});if(error)throw error;}}catch(e){alert("⚠️ "+(e?.message||"Planning impossible à enregistrer."));await afficherGestionGardes();}}

window.afficherGestionGardes=afficherGestionGardes;
window.creerEquipeGarde=creerEquipeGarde;
window.renommerEquipeGarde=renommerEquipeGarde;
window.supprimerEquipeGarde=supprimerEquipeGarde;
window.enregistrerMembresEquipeGarde=enregistrerMembresEquipeGarde;
window.attribuerEquipeSemaineGarde=attribuerEquipeSemaineGarde;



/* =========================================================
   ESPACE GARDE UTILISATEUR — présentation comme le reste de l'app
   ========================================================= */

function personnelConnecteSaisie(){const u=typeof utilisateurConnecte!=='undefined'?utilisateurConnecte:null,p=typeof profilUtilisateurConnecte!=='undefined'?profilUtilisateurConnecte:null;const id=String(u?.id||p?.id||'');if(!id||p?.actif===false||u?.id&&p?.id&&String(u.id)!==String(p.id))return null;return {...u,...p,id};}
function personnesAvecAuteur(ids){const moi=personnelConnecteSaisie();return [...new Set([...(moi?[moi.id]:[]),...(ids||[]).map(String).filter(Boolean)])];}
function listePersonnelAvecAuteur(liste){const moi=personnelConnecteSaisie(),map=new Map((liste||[]).filter(p=>p?.id).map(p=>[String(p.id),p]));if(moi&&!map.has(moi.id))map.set(moi.id,moi);return [...map.values()].sort((a,b)=>Number(String(b.id)===moi?.id)-Number(String(a.id)===moi?.id));}
function nomsParticipantsInventaire(r,personnes=utilisateursEspaceGarde){const ids=[...new Set([r.controle_par,...(r.personnes_presentes||[])].filter(Boolean).map(String))],snap=new Map((Array.isArray(r.participants_noms)?r.participants_noms:[]).map(p=>[String(p.id),p]));return ids.map(id=>{const p=snap.get(id)||(personnes||[]).find(p=>String(p.id)===id);return p?[p.prenom,p.nom].filter(Boolean).join(' '):'Identité indisponible (ID : '+id.slice(0,8)+')';}).join(', ');}

const ZONES_MENAGE_GARDE = [
    "Remise à engin","Local VSAV","Vestiaire homme","Vestiaire femme",
    "Toilettes PMR","Foyer","Salle de cour","Salle radio","Poubelle de trie",
    "Bureau","Amical","Extérieur"
];
const VEHICULES_INVENTAIRE_GARDE = ["VSAV","CCRM","VTU","VL","VLHR"];
let utilisateursEspaceGarde = [];

function cleSelectionMenageGarde(){
    return "cis_garde_menage_" + dateISOlocale(vendrediReferenceGarde(new Date()));
}
function lireSelectionMenageGarde(){
    try{return JSON.parse(localStorage.getItem(cleSelectionMenageGarde())||'{"zones":[],"personnes":[]}')}
    catch(_){return {zones:[],personnes:[]}}
}
function sauvegarderSelectionMenageGarde(){
    try{localStorage.removeItem(cleSelectionMenageGarde())}catch(_){}
    actualiserPlanMenageGarde();
}
function actualiserPlanMenageGarde(){
    const zones=new Set([...document.querySelectorAll("[data-garde-zone]:checked")].map(x=>x.value));
    document.querySelectorAll("[data-plan-zone]").forEach(el=>{
        const actif=zones.has(el.dataset.planZone);
        el.classList.toggle("actif",actif);
        el.setAttribute("aria-pressed",actif?"true":"false");
    });
}

function basculerZoneDepuisPlanGarde(nomZone){
    const cases=[...document.querySelectorAll("[data-garde-zone]")];
    const cible=cases.find(x=>x.value===nomZone);
    if(!cible||cible.disabled)return;
    cible.checked=!cible.checked;
    sauvegarderSelectionMenageGarde();
}
function cleCacheMenage(nom, userId = utilisateurConnecte?.id) {
    if (!userId) throw new Error("Identifie-toi pour utiliser le ménage");
    return "cis_menage_hors_ligne_v1:" + userId + ":" + nom;
}
function lireCacheMenage(nom, defaut = null) {
    const texte = localStorage.getItem(cleCacheMenage(nom));
    return texte === null ? defaut : JSON.parse(texte);
}
async function chargerUtilisateursEspaceGarde(){
    const uid = String(utilisateurConnecte?.id || "");
    const cle = cleCacheMenage("personnels");
    const cache = JSON.parse(localStorage.getItem(cle) || "[]");
    const supabase = obtenirClientSupabase();
    if (!supabase || !navigator.onLine) return cache;
    try {
        const {data,error} = await supabase.rpc("lister_utilisateurs_menage");
        if (error) throw error;
        if (String(utilisateurConnecte?.id || "") !== uid) return cache;
        const liste = (data || []).filter(u=>u.actif!==false).map(u=>({id:u.id,prenom:u.prenom,nom:u.nom,identifiant:u.identifiant,actif:true}));
        localStorage.setItem(cle, JSON.stringify(liste));
        return liste;
    } catch (_) { return cache; }
}
async function chargerCatalogueMenageHorsConnexion() {
    const uid = String(utilisateurConnecte?.id || "");
    const cle = cleCacheMenage("produits");
    const cache = JSON.parse(localStorage.getItem(cle) || "null");
    if (!navigator.onLine || !obtenirClientSupabase()) return cache;
    try {
        const {data,error} = await obtenirClientSupabase().from("menage_produits").select("id,nom,stock").order("nom");
        if (error) throw error;
        if (String(utilisateurConnecte?.id || "") !== uid) return cache;
        localStorage.setItem(cle, JSON.stringify(data || []));
        return data || [];
    } catch (e) { if (cache !== null) return cache; throw e; }
}
async function chargerGardePourMenage(utiliserReseau = true) {
    const uid = String(utilisateurConnecte?.id || "");
    const vendredi = dateISOlocale(vendrediReferenceGarde(new Date()));
    const cle = cleCacheMenage("garde");
    let garde = JSON.parse(localStorage.getItem(cle) || "null");
    if (utiliserReseau && navigator.onLine) {
        try {
            const distante = await chargerGardeSemaineCourante();
            if (distante && String(utilisateurConnecte?.id || "") === uid) { garde = distante; localStorage.setItem(cle, JSON.stringify(garde)); }
        } catch (_) {}
    }
    return garde?.date_debut === vendredi ? garde : {date_debut:vendredi,equipe:null};
}
async function prechargerPlanMenageHorsConnexion() {
    const controleur = new AbortController();
    const delai = setTimeout(() => controleur.abort(),15000);
    try {
        const r = await fetch("./plan-caserne.png",{cache:"reload",signal:controleur.signal});
        if (!r.ok) throw new Error("Plan indisponible");
        if (typeof r.arrayBuffer === "function") await r.arrayBuffer();
    } finally { clearTimeout(delai); }
}
let preparationMenageHorsConnexionEnCours = null;
const preparationsMenageParUtilisateur = new Map();
async function preparerMenageHorsConnexion() {
    if (!navigator.onLine || !utilisateurConnecte?.id) return;
    if (preparationMenageHorsConnexionEnCours) return preparationMenageHorsConnexionEnCours;
    const uid = String(utilisateurConnecte.id);
    if (Date.now() < (preparationsMenageParUtilisateur.get(uid) || 0)) return;
    preparationsMenageParUtilisateur.set(uid, Date.now()+60000);
    const demande = (async () => {
        try {
            const sb = await assurerBibliothequeSupabaseDisponible();
            if (!sb) return;
            const session = await obtenirSessionPrincipaleValide(sb);
            if (String(session.user?.id) !== uid || String(utilisateurConnecte?.id) !== uid) return;
            await Promise.allSettled([
                chargerUtilisateursEspaceGarde(), chargerCatalogueMenageHorsConnexion(), chargerGardePourMenage(),
                prechargerPlanMenageHorsConnexion()
            ]);
        } catch (e) { console.warn("Préparation du ménage différée ; caches conservés.",e); }
    })();
    preparationMenageHorsConnexionEnCours = demande;
    try { await demande; }
    finally { preparationMenageHorsConnexionEnCours = null; }
}
function lireMenagesEnAttente() { return lireCacheMenage("envois", []); }
function texteMenagesEnAttente() {
    const lignes = lireMenagesEnAttente();
    if (!lignes.length) return navigator.onLine ? "" : "Hors connexion : la saisie sera conservée sur cet appareil, puis envoyée automatiquement.";
    return lignes.length + " ménage(s) conservé(s) sur cet appareil, en attente d’envoi automatique." +
        (lignes.find(l=>l.erreur)?.erreur ? " Dernière tentative : " + lignes.find(l=>l.erreur).erreur : "");
}
function actualiserStatutMenagesEnAttente() {
    const zone = document.getElementById("menages-hors-ligne-statut");
    if (zone) zone.textContent = texteMenagesEnAttente();
}
let envoiMenagesEnCours = null;
const reprisesMenageParUtilisateur = new Map();
async function synchroniserMenagesEnAttente(force = false) {
    if (!navigator.onLine || !utilisateurConnecte?.id) return false;
    if (envoiMenagesEnCours) return envoiMenagesEnCours;
    const proprietaire = String(utilisateurConnecte.id), cle = cleCacheMenage("envois", proprietaire);
    const reprise = reprisesMenageParUtilisateur.get(proprietaire) || {prochaine:0,derniere:0,echecs:0};
    reprisesMenageParUtilisateur.set(proprietaire,reprise);
    if ((!force && Date.now() < reprise.prochaine) || (reprise.derniere && Date.now()-reprise.derniere<5000)) return false;
    const demande = (async () => {
        const envois = JSON.parse(localStorage.getItem(cle) || "[]");
        if (!envois.length) return true;
        reprise.derniere = Date.now();
        try {
            const sb = await assurerBibliothequeSupabaseDisponible();
            if (!sb) throw new Error("Serveur indisponible");
            const session = await obtenirSessionPrincipaleValide(sb);
            if (String(session.user?.id || "") !== proprietaire) throw new Error("La session ne correspond pas à l’auteur du ménage");
            for (const envoi of envois) {
                if (String(utilisateurConnecte?.id || "") !== proprietaire) throw new Error("Utilisateur modifié pendant l’envoi");
                const {data,error} = await sb.rpc("menage_enregistrer_quantites", {
                    p_ligne:envoi.ligne,p_produits:envoi.produits,p_cle:envoi.cle
                });
                if (error) throw error;
                if (!data?.id) throw new Error("La base n’a pas confirmé l’enregistrement");
                if (String(utilisateurConnecte?.id || "") !== proprietaire) throw new Error("Compte modifié avant la confirmation du ménage");
                // The same server idempotency key survives network failures and restarts.
                const restants = JSON.parse(localStorage.getItem(cle) || "[]").filter(l=>l.cle!==envoi.cle);
                localStorage.setItem(cle, JSON.stringify(restants));
            }
            reprise.prochaine = 0;
            reprise.echecs = 0;
            preparationsMenageParUtilisateur.delete(proprietaire);
            void preparerMenageHorsConnexion();
            return true;
        } catch (e) {
            reprise.echecs++;
            reprise.prochaine = Date.now() + Math.min(300000,30000*2**Math.min(reprise.echecs-1,4));
            const restants = JSON.parse(localStorage.getItem(cle) || "[]");
            if (restants.length) { restants[0].erreur = e.message || "Connexion indisponible"; localStorage.setItem(cle, JSON.stringify(restants)); }
            console.warn("Ménage conservé localement ; envoi différé.", e);
            return false;
        } finally { if (String(utilisateurConnecte?.id || "") === proprietaire) actualiserStatutMenagesEnAttente(); }
    })();
    envoiMenagesEnCours = demande;
    try { return await demande; } finally { envoiMenagesEnCours = null; }
}
window.addEventListener("online", () => { void preparerMenageHorsConnexion(); void synchroniserMenagesEnAttente(true); });
window.addEventListener("pageshow", () => { void synchroniserMenagesEnAttente(true); });
window.addEventListener("focus", () => { void synchroniserMenagesEnAttente(); });
document.addEventListener("visibilitychange", () => { if (!document.hidden) void synchroniserMenagesEnAttente(); });
setInterval(() => { if (!document.hidden) void synchroniserMenagesEnAttente(); }, 5000);

function initialiserStyleEspaceGardeUtilisateur(){
    if(document.getElementById("style-espace-garde-utilisateur-v2"))return;
    const s=document.createElement("style");s.id="style-espace-garde-utilisateur-v2";
    s.textContent=`
      .garde-menu-page{padding:20px 18px 110px;max-width:760px;margin:0 auto;box-sizing:border-box}.garde-menu-page:before,.garde-section:before{content:"";position:fixed;inset:0;background:#f4f6f7;z-index:-1}
      
      .garde-menu-entete small{font-weight:900;letter-spacing:.1em;color:#68727a}.garde-menu-entete h1{margin:5px 0 20px;font-size:29px}
      .garde-menu-cartes{display:grid;gap:13px}
      .espace-equipe-menu .garde-menu-cartes{gap:15px}
      .espace-equipe-menu .garde-menu-carte{min-height:78px;padding:15px 20px;border-radius:14px;gap:18px}
      .espace-equipe-menu .garde-menu-carte .ico{width:48px;height:48px;border-radius:12px;font-size:26px}
      .espace-equipe-menu .garde-menu-carte strong{font-size:18px;color:#007aff}
      @media(max-width:600px){.espace-equipe-menu .garde-menu-carte{min-height:72px;padding:12px 14px}.espace-equipe-menu .garde-menu-carte .ico{width:42px;height:42px;font-size:23px}.espace-equipe-menu .garde-menu-carte strong{font-size:16px}}
      @media(min-width:1000px){body:not(.mode-connexion) .espace-equipe-menu .garde-menu-carte{min-height:76px;padding:15px 16px;gap:13px;border-radius:9px}body:not(.mode-connexion) .espace-equipe-menu .garde-menu-carte .ico{width:34px;height:34px;border-radius:8px;font-size:16px}body:not(.mode-connexion) .espace-equipe-menu .garde-menu-carte strong{font-size:13px;color:#75b9ff}}
      .garde-menu-carte{width:100%;box-sizing:border-box;border:0;border-radius:17px;background:#fff;box-shadow:0 4px 18px rgba(0,0,0,.09);padding:18px;text-align:left;display:flex;align-items:center;gap:15px;cursor:pointer}
      .garde-menu-carte .ico{width:49px;height:49px;border-radius:14px;background:#e8f4ee;display:grid;place-items:center;font-size:25px;flex:0 0 auto}
      .garde-menu-carte strong{display:block;font-size:18px;color:#20272b}.garde-menu-carte span{display:block;color:#707980;margin-top:3px;font-size:13px}.garde-menu-carte .fleche{margin-left:auto;font-size:25px;color:#a0a7ac}
      .garde-section{padding:18px 18px 110px;max-width:760px;margin:0 auto;box-sizing:border-box}.garde-section h1{font-size:27px;margin:3px 0 18px}
      .garde-zone,.garde-personne-v2{display:flex;align-items:center;gap:11px;background:#fff;border-radius:13px;padding:13px;margin:8px 0;box-shadow:0 2px 10px rgba(0,0,0,.06);font-weight:750}
      .garde-zone input,.garde-personne-v2 input{width:21px;height:21px;accent-color:#176b45}.garde-zone-exterieur{background:#e1e4e8!important;border:1px solid #a7afb8!important;color:#303943!important}.garde-zone-poubelle{background:#fff2a8!important;border:1px solid #e1bd2e}
      .garde-personnes-plus{width:100%;border:0;border-radius:12px;padding:12px;margin:7px 0 12px;background:#e8ecef;color:#263238;font-weight:900;cursor:pointer}
      .garde-personne-cachee{display:none!important}
      .garde-personnes-toutes .garde-personne-cachee{display:flex!important}
      .plan-menage-wrap{background:#fff;border-radius:15px;padding:10px;margin:0 0 18px;box-shadow:0 3px 14px rgba(0,0,0,.08)}
      .plan-menage{position:relative;width:100%;aspect-ratio:1200/850;overflow:hidden;border-radius:9px;background:#fff}
      .plan-menage img,.plan-menage canvas{display:block;width:100%;height:100%;object-fit:contain;position:relative;z-index:1}
      .plan-menage-zone{appearance:none;-webkit-appearance:none;display:block;position:absolute;margin:0;padding:0;border:3px solid transparent;border-radius:7px;box-sizing:border-box;pointer-events:auto;cursor:pointer;z-index:20;background:transparent;transition:background .15s,border-color .15s}
      .plan-menage-zone.actif{background:#24c95f!important;border:4px solid #087c2b!important;opacity:.72!important;box-shadow:inset 0 0 0 999px rgba(36,201,95,.18)!important}
      .pm-reunion{left:4.6%;top:6.5%;width:20.5%;height:44.5%}.pm-foyer{left:26.2%;top:6.5%;width:17.8%;height:21.8%}.pm-pmr{left:45.2%;top:6.5%;width:7.2%;height:21.8%}.pm-femme{left:53.7%;top:6.5%;width:14.1%;height:21.8%}.pm-homme{left:69%;top:6.5%;width:27%;height:21.8%}
      .pm-amical{left:4.6%;top:53%;width:20.5%;height:8%}.pm-radio{left:4.6%;top:62.5%;width:20.5%;height:8%}.pm-bureau{left:4.6%;top:72.5%;width:20.5%;height:21.5%}.pm-remise{left:26.2%;top:30%;width:49%;height:64%}.pm-vsav{left:76.6%;top:30%;width:19.4%;height:64%}

      .garde-sous-titre{margin:23px 0 8px;font-size:19px}
      .garde-vehicule-v2{background:#fff;border-radius:15px;padding:20px;margin:10px 0;box-shadow:0 3px 13px rgba(0,0,0,.07);font-size:19px;font-weight:900}
      .garde-menage-duree{width:100%;box-sizing:border-box;padding:14px;border:1px solid #d7dde1;border-radius:12px;background:#fff;font-size:16px;margin-bottom:12px}
      .garde-menage-enregistrer,.garde-menage-admin{width:100%;border:0;border-radius:13px;padding:15px;margin-top:10px;font-size:16px;font-weight:900;cursor:pointer}
      .garde-menage-statut{display:none;margin:12px 0;padding:13px;border-radius:12px;font-weight:850}.garde-menage-statut.ok{display:block;background:#dff6e7;color:#075d2b}.garde-menage-statut.err{display:block;background:#fde3e3;color:#8b1111}.garde-menage-enregistrer{background:#176b45;color:#fff}.garde-menage-admin{background:#e8ecef;color:#263238}
      .garde-admin-card{background:#fff;border-radius:14px;padding:15px;margin:10px 0;box-shadow:0 2px 10px rgba(0,0,0,.07)}
      .garde-admin-card button{width:100%;border:0;background:transparent;text-align:left;font:inherit;padding:0;cursor:pointer}
      .garde-stat-ligne{background:#fff;border-radius:12px;padding:12px;margin:7px 0}.garde-stat-ligne strong{display:block}.garde-stat-ligne small{color:#687078}.garde-stat-ligne-flex{display:flex;align-items:center;justify-content:space-between;gap:12px}.garde-date-recente{color:#12813b!important;font-weight:900;font-size:15px}.garde-date-ancienne{color:#c62828!important;font-weight:900;font-size:15px}.garde-presence-pct{font-size:18px;font-weight:900;color:#176b45;white-space:nowrap}.plan-menage-detail{pointer-events:none}
      .planning-photo-cliquable{cursor:zoom-in}
      .planning-modal{position:fixed;inset:0;z-index:99999;background:#111;display:flex;flex-direction:column}
      .planning-modal-bar{display:flex;gap:8px;padding:10px;background:#111}.planning-modal-bar button,.planning-modal-bar a{border:0;border-radius:9px;background:#fff;color:#111;padding:10px 13px;font-weight:850;text-decoration:none}
      .planning-modal-image{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:auto}
      .planning-modal-image img{max-width:none;height:auto;width:auto}
      @media (orientation:portrait){.planning-modal-image img{width:100vh;transform:rotate(90deg)}}
      @media (orientation:landscape){.planning-modal-image img{max-width:100%;max-height:100%;object-fit:contain}}

      .garde-planning-scroll{width:100%;overflow-x:auto;background:#fff;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,.10)}.garde-planning-img{display:block;width:max(1100px,100%);height:auto;background:#fff}.garde-planning-save{border:0;display:block;width:100%;box-sizing:border-box;margin-top:14px;padding:15px;border-radius:13px;background:#176b45;color:#fff;text-align:center;text-decoration:none;font-weight:900}
      .garde-planning-attente{background:#fff;border-radius:14px;padding:18px;color:#667078}

      .heures-form{display:grid;gap:14px}.heures-form label{display:grid;gap:7px}.heures-input{width:100%;box-sizing:border-box;padding:13px;border:1px solid #c8d0d5;border-radius:11px;background:#fff;font:inherit}.heures-recherche-wrap{position:relative}.heures-resultats{display:none;position:absolute;z-index:50;left:0;right:0;top:100%;background:#fff;border:1px solid #ccd4d8;border-radius:10px;box-shadow:0 8px 22px rgba(0,0,0,.15);overflow:hidden}.heures-resultats.ouvert{display:block}.heures-resultat{display:block;width:100%;border:0;border-bottom:1px solid #eee;background:#fff;text-align:left;padding:12px;font:inherit}.heures-vide{padding:12px;color:#667078}.heures-chips{display:flex;flex-wrap:wrap;gap:7px;min-height:36px}.heures-chip{display:inline-flex;align-items:center;gap:5px;background:#e8f3ed;border:1px solid #9cc8ad;border-radius:999px;padding:7px 10px;font-weight:800}.heures-chip button{border:0;background:transparent;font-size:18px;line-height:1;cursor:pointer}.heures-chip small{font-weight:600}
    `;
    document.head.appendChild(s);
}

function retourAccueilDepuisEspaceEquipe(){
    afficherPortailPrincipal();
    requestAnimationFrame(()=>requestAnimationFrame(()=>void actualiserCarteGardeAccueil()));
}

function afficherEspaceGarde(){
    initialiserStyleEspaceGardeUtilisateur();
    document.getElementById("app").innerHTML=`
      <main class="garde-menu-page espace-equipe-menu">
        <button class="retour-button" data-navigation-equipe onclick="retourAccueilDepuisEspaceEquipe()">← Retour</button>
        <header class="garde-menu-entete"><h1>Espace équipe</h1></header><p id="menages-hors-ligne-statut" role="status">${echapperHTML(texteMenagesEnAttente())}</p>
        <div class="garde-menu-cartes">
          <button id="travail-equipe-carte" class="garde-menu-carte" onclick="CISTravail.ouvrir()"><span class="ico" aria-hidden="true">✓</span><span><strong>Travail de l’équipe</strong><small>Ouvrir le travail de l’équipe</small></span><b class="fleche">›</b></button>
          <button class="garde-menu-carte" onclick="ouvrirRubriqueEquipe('menage')"><span class="ico">🧹</span><span><strong>Ménage</strong></span><b class="fleche">›</b></button>
          <button class="garde-menu-carte" onclick="ouvrirRubriqueEquipe('vehicules')"><span class="ico">🚒</span><span><strong>Inventaire véhicule</strong></span><b class="fleche">›</b></button>
          <button class="garde-menu-carte" onclick="CISFormations.ouvrir()"><span class="ico" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 4h6a4 4 0 0 1 3 1.4A4 4 0 0 1 15 4h6v16h-6a4 4 0 0 0-3 1 4 4 0 0 0-3-1H3zM12 5.4V21"/></svg></span><span><strong>Formation</strong></span><b class="fleche">›</b></button>
          <button class="garde-menu-carte" onclick="afficherPlanningEspaceGarde()"><span class="ico">📅</span><span><strong>Planning</strong></span><b class="fleche">›</b></button>
          <button class="garde-menu-carte" onclick="ouvrirRubriqueEquipe('heures')"><span class="ico">⏱️</span><span><strong>Enregistrer des heures</strong></span><b class="fleche">›</b></button>
          ${utilisateurAPermission("acces_envoi_mail")?`<button type="button" class="garde-menu-carte" onclick="afficherEnvoiDocumentsEquipe()"><span class="ico" aria-hidden="true"><svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg></span><span><strong>Envoi par mail</strong></span><b class="fleche">›</b></button>`:""}
          ${utilisateurAccesAdministratifCentral() ? `<button class="garde-menu-carte" onclick="afficherAdministrationEquipe()"><span class="ico">⚙️</span><span><strong>Administratif</strong></span><b class="fleche">›</b></button>` : ""}

        </div>
      </main>${navigationPrincipale("","accueil")}`;
    void window.CISTravail?.actualiserCarte();
    actualiserInterfaceBureau();window.scrollTo({top:0,behavior:"auto"});
}

function afficherAdministrationEquipe(){ afficherAdministratifCaserne(); }

window.afficherAdministrationEquipe=afficherAdministrationEquipe;

let menageTravailContexte=null;
function contexteMenageTravailActif(){return menageTravailContexte&&menageTravailContexte.owner===String(utilisateurConnecte?.id||'')&&document.querySelector('[data-menage-travail]')?menageTravailContexte:null;}
async function chargerMenagesTravail(c){
 const cle=cleCacheMenage('travail:'+c.id),cache=lireCacheMenage('travail:'+c.id,null);
 let lignes=cache;
 if(navigator.onLine){try{const ac=new AbortController();let timer;try{
 const lecture=(async()=>{const resultat=[];for(let off=0;;off+=200){let q=obtenirClientSupabase().from('menages_garde').select('*').eq('date_garde',c.date_garde).is('supprime_le',null);if(c.equipe_id)q=q.eq('equipe_id',c.equipe_id);const r=await q.order('date_menage').order('id').range(off,off+199).abortSignal(ac.signal);if(r.error)throw Error(r.error.message);resultat.push(...r.data);if(r.data.length<200)return resultat;}})();
 lignes=await Promise.race([lecture,new Promise((_,rej)=>timer=setTimeout(()=>{ac.abort();rej(Error('Lecture des ménages indisponible.'));},10000))]);
 if(c.owner!==String(utilisateurConnecte?.id||''))throw Error('Compte modifié.');localStorage.setItem(cle,JSON.stringify(lignes));
 }finally{clearTimeout(timer);}}catch(e){if(!lignes)throw e;}}
 if(!lignes){const preuves=[...new Map((c.taches||[]).filter(t=>t.type==='menage').flatMap(t=>t.preuves||[]).map(p=>[String(p.id),p])).values()];lignes=preuves.map(p=>({id:p.id,zones_nettoyees:p.zones||[],personnes_presentes:p.personnes||[]}));}
 const attente=lireMenagesEnAttente().filter(e=>e.ligne.date_garde===c.date_garde&&(!c.equipe_id||e.ligne.equipe_id===c.equipe_id)).map(e=>({...e.ligne,id:e.cle,en_attente:true}));
 return [...lignes,...attente];
}
function appliquerMenagesTravail(c,lignes){
 if(contexteMenageTravailActif()!==c)return;
 c.zones=new Set(lignes.flatMap(r=>r.zones_nettoyees||[]));c.personnes=new Set(lignes.flatMap(r=>r.personnes_presentes||[]).map(String));
 document.querySelectorAll('[data-garde-zone]').forEach(el=>{if(c.zones.has(el.value)){el.checked=true;el.disabled=true;el.dataset.dejaEnregistre='1';}});
 document.querySelectorAll('[data-garde-personne]').forEach(el=>{if(c.personnes.has(el.value)){el.checked=true;el.disabled=true;el.dataset.dejaEnregistre='1';el.closest('label')?.classList.remove('garde-personne-cachee');}});
 const box=document.getElementById('menage-travail-existant');if(box){const nom=id=>{const p=[...(c.personnels||[]),...utilisateursEspaceGarde].find(p=>String(p.id)===String(id));return p?[p.prenom,p.nom].filter(Boolean).join(' '):'Personnel précédemment enregistré';};box.innerHTML='<h2>Déjà enregistré pour cette garde</h2>'+(lignes.length?'<p><strong>Zones réalisées :</strong> '+[...c.zones].map(z=>echapperHTML(z==='Extérieur'?'Nettoyage extérieur':z)).join(' · ')+'</p><p><strong>Personnel :</strong> '+[...c.personnes].map(id=>echapperHTML(nom(id))).join(' · ')+'</p><p>Ces réalisations sont conservées. Tu peux ajouter des zones et du personnel ci-dessous.</p>':'<p>Aucun ménage enregistré pour cette garde.</p>')+(lignes.some(r=>r.en_attente)?'<p>Certains ajouts attendent leur synchronisation.</p>':'')+(c.fiche_resume?.valide?'<p>La fiche du chef de garde est validée : les nouveaux ajouts ne modifieront cette fiche qu’après sa réouverture et une nouvelle validation.</p>':'');}
 actualiserPlanMenageGarde();c.charge=true;
}
async function afficherMenageEspaceGarde(travail=null){
    menageTravailContexte=travail?{...travail,owner:String(utilisateurConnecte?.id||''),charge:false}:null;
    const contexteTravail=menageTravailContexte;

    initialiserStyleEspaceGardeUtilisateur();
    menageProduitsCharges=false;menageSaisieCle=null;menageSaisieSignature="";
    try{localStorage.removeItem(cleSelectionMenageGarde())}catch(_){}
    document.getElementById("app").innerHTML=`<main class="garde-section" ${contexteTravail?'data-menage-travail="1"':''}><button class="retour-button" data-navigation-equipe onclick="retourSaisieEquipe('menage')">← Retour</button><h1>Ménage</h1>${contexteTravail?'<section id="menage-travail-existant" class="garde-admin-card" role="status">Lecture des réalisations…</section>':''}<div id="menage-garde-chargement" class="garde-planning-attente">Chargement…</div></main>${navigationPrincipale("","accueil")}`;
    actualiserInterfaceBureau();
    const chargement=document.getElementById("menage-garde-chargement");
    utilisateursEspaceGarde=await chargerUtilisateursEspaceGarde();
    if(!chargement.isConnected)return;
    // Classe les personnels selon leur nombre réel de participations aux ménages.
    // Ceux qui participent le plus apparaissent en premier.
    try{
      if(!navigator.onLine)throw new Error("Classement local conservé");
      const supabase=obtenirClientSupabase();
      const {data:histPresence}=await supabase.from("menages_garde").select("personnes_presentes").is("supprime_le",null);
      const compte=new Map();
      (histPresence||[]).forEach(r=>(r.personnes_presentes||[]).forEach(id=>compte.set(String(id),(compte.get(String(id))||0)+1)));
      utilisateursEspaceGarde=[...utilisateursEspaceGarde].sort((a,b)=>(compte.get(String(b.id))||0)-(compte.get(String(a.id))||0)||([a.prenom,a.nom].filter(Boolean).join(" ")).localeCompare([b.prenom,b.nom].filter(Boolean).join(" "),"fr"));
    }catch(_){}
    if(!chargement.isConnected)return;
    utilisateursEspaceGarde=listePersonnelAvecAuteur(utilisateursEspaceGarde);
    document.getElementById("app").innerHTML=`
      <main class="garde-section" ${contexteTravail?'data-menage-travail="1"':''}>
       <button class="retour-button" data-navigation-equipe onclick="retourSaisieEquipe('menage')">← Retour</button>
       <h1>Ménage</h1>${contexteTravail?'<section id="menage-travail-existant" class="garde-admin-card" role="status">Lecture des réalisations…</section>':''}
       <p id="menages-hors-ligne-statut" role="status">${echapperHTML(texteMenagesEnAttente())}</p>
       <div class="plan-menage-wrap"><div class="plan-menage">
         <img src="./plan-caserne.png" alt="Plan de la caserne">
         <button type="button" class="plan-menage-zone pm-reunion" data-plan-zone="Salle de cour" aria-label="Salle de cour" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-foyer" data-plan-zone="Foyer" aria-label="Foyer" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-pmr" data-plan-zone="Toilettes PMR" aria-label="Toilettes PMR" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-femme" data-plan-zone="Vestiaire femme" aria-label="Vestiaire femme" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-homme" data-plan-zone="Vestiaire homme" aria-label="Vestiaire homme" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-amical" data-plan-zone="Amical" aria-label="Amical" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-radio" data-plan-zone="Salle radio" aria-label="Salle radio" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-bureau" data-plan-zone="Bureau" aria-label="Bureau" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-remise" data-plan-zone="Remise à engin" aria-label="Remise à engin" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
         <button type="button" class="plan-menage-zone pm-vsav" data-plan-zone="Local VSAV" aria-label="Local VSAV" onclick="basculerZoneDepuisPlanGarde(this.dataset.planZone)"></button>
       </div></div>
       <h2 class="garde-sous-titre">Zones</h2>
       ${ZONES_MENAGE_GARDE.map(n=>`<label class="garde-zone ${n==="Poubelle de trie"?"garde-zone-poubelle":n==="Extérieur"?"garde-zone-exterieur":""}"><input type="checkbox" data-garde-zone value="${echapperHTML(n)}"  onchange="sauvegarderSelectionMenageGarde()"><span>${echapperHTML(n==="Extérieur"?"Nettoyage extérieur":n)}</span></label>`).join("")}
       <h2 class="garde-sous-titre">Présents</h2>
       <div id="garde-personnes-liste">${utilisateursEspaceGarde.length?utilisateursEspaceGarde.map((u,i)=>{const n=[u.prenom,u.nom].filter(Boolean).join(" ")||u.identifiant||"Utilisateur";return `<label class="garde-personne-v2 ${i>=6?"garde-personne-cachee":""}"><input type="checkbox" data-garde-personne value="${echapperHTML(u.id)}" ${String(u.id)===personnelConnecteSaisie()?.id?"checked disabled":""} onchange="sauvegarderSelectionMenageGarde()"><span>${echapperHTML(n)}</span></label>`}).join(""):'<div class="garde-planning-attente">Liste des utilisateurs indisponible.</div>'}</div>
       ${utilisateursEspaceGarde.length>6?'<button type="button" id="garde-personnes-plus" class="garde-personnes-plus" onclick="basculerToutesPersonnesMenage()">Voir plus</button>':""}
       <h2 class="garde-sous-titre">${contexteTravail?"Temps passé pour cet ajout":"Temps passé"}</h2>
       <select id="garde-menage-duree" class="garde-menage-duree">
         <option value="">Sélectionner</option><option value="30">30 min</option><option value="60">1 h</option><option value="90">1 h 30</option>
       </select>
       <h2 class="garde-sous-titre">Matériel terminé</h2>
       <p>Ne cocher uniquement un produit vidé. Indique la quantité de produits entièrement vidés. Seules les cases cochées sont enregistrées.</p>
       <div id="menage-produits-vides" aria-live="polite">Chargement des produits…</div>
       ${utilisateurAPermission("acces_admin_menage")?'<button type="button" class="equipe-action-button" onclick="afficherInventaireMenage()">📦 Ménage inventaire</button>':""}
       <div id="garde-menage-statut" class="garde-menage-statut" aria-live="polite"></div>
       <button type="button" class="garde-menage-enregistrer" onclick="enregistrerMenageEquipe()">Enregistrer la saisie</button>
      </main>${navigationPrincipale("","accueil")}`;
    actualiserInterfaceBureau();actualiserPlanMenageGarde();chargerProduitsVidesMenage();window.scrollTo({top:0,behavior:"auto"});
    if(contexteTravail){try{const lignes=await chargerMenagesTravail(contexteTravail);appliquerMenagesTravail(contexteTravail,lignes);}catch(e){if(contexteMenageTravailActif()===contexteTravail){document.getElementById('menage-travail-existant').textContent=e.message+' Reviens au travail d’équipe puis réessaie.';document.querySelector('.garde-menage-enregistrer').disabled=true;}}}

}


function basculerToutesPersonnesMenage(){
    const liste=document.getElementById("garde-personnes-liste"),bouton=document.getElementById("garde-personnes-plus");
    if(!liste||!bouton)return;
    const ouvert=liste.classList.toggle("garde-personnes-toutes");
    bouton.textContent=ouvert?"Voir moins":"Voir plus";
}

// Inventaire véhicules : brouillon conservé en mémoire jusqu'à la validation finale.
let vehInventaireSession = null;
let vehInventaireCatalogue = [];
let vehInventaireZones = [];
let vehInventaireMateriels = [];
const vehInventaireHTML = valeur => echapperHTML(String(valeur ?? ""));
// Photos configurées dans l'application Admin (bucket Supabase privé).
const VEH_PHOTO_BUCKET = "cis-photos-inventaire";
let vehPhotoGeneration = 0;
function vehPhotoMiniature(chemin, taille = "materiel") {
 if (!chemin) return "";
 return `<button type="button" class="veh-photo-miniature veh-photo-${taille}" data-veh-photo-path="${vehInventaireHTML(chemin)}" aria-label="Agrandir la photo" onclick="vehInventaireAgrandirPhoto(this)"><img alt="" loading="lazy"></button>`;
}
async function vehInventaireChargerPhotos() {
 const generation = ++vehPhotoGeneration;
 const elements = [...document.querySelectorAll('.veh-photo-miniature[data-veh-photo-path]')];
 if (!elements.length) return;
 const sb = obtenirClientSupabase();
 if (!sb) return;
 const chemins = [...new Set(elements.map(e => e.dataset.vehPhotoPath).filter(Boolean))];
 await Promise.all(chemins.map(async chemin => {
  try {
   const {data,error} = await sb.storage.from(VEH_PHOTO_BUCKET).createSignedUrl(chemin,3600);
   if (error) throw error;
   if (generation !== vehPhotoGeneration) return;
   for (const bouton of elements.filter(e => e.dataset.vehPhotoPath === chemin)) {
    if (!bouton.isConnected) continue;
    const image = bouton.querySelector('img');
    if (image) image.src = data.signedUrl;
    bouton.dataset.vehPhotoUrl = data.signedUrl;
    bouton.classList.add('veh-photo-chargee');
   }
  } catch (erreur) { console.warn('Photo inventaire indisponible :', erreur); }
 }));
}
function vehInventaireAgrandirPhoto(bouton) {
 const url = bouton?.dataset?.vehPhotoUrl;
 if (!url) return;
 document.getElementById('veh-photo-plein-ecran')?.remove();
 const fond = document.createElement('div');
 fond.id = 'veh-photo-plein-ecran';
 fond.setAttribute('role','dialog');
 fond.setAttribute('aria-label','Photo agrandie');
 const image = document.createElement('img');
 image.src = url; image.alt = '';
 fond.appendChild(image);
 const fermer = () => { fond.remove(); document.removeEventListener('keydown', touche); };
 const touche = e => { if (e.key === 'Escape') fermer(); };
 fond.addEventListener('click', fermer);
 document.addEventListener('keydown', touche);
 document.body.appendChild(fond);
}

function vehInventaireStyle(){
 if(document.getElementById("veh-inventaire-style"))return;
 const st=document.createElement("style");st.id="veh-inventaire-style";
 st.textContent=`.veh-card{background:#fff;border:1px solid #e0e5e9;border-radius:15px;padding:18px;margin:13px 0;box-shadow:0 2px 9px #15202b0c}.veh-card button{cursor:pointer}.veh-action{display:block;width:100%;min-height:54px;border:0;border-radius:13px;padding:16px 18px;background:#246b4b;color:#fff;font:inherit;font-weight:800;font-size:17px;box-shadow:0 3px 10px #15202b1a}.veh-action:disabled{opacity:.45}.veh-muted{color:#68737e;font-size:14px}.veh-zone{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;min-height:67px;text-align:left;border:2px solid #367bd7;background:#eef5ff;color:#163c71;border-radius:14px;padding:18px;margin:12px 0;font:inherit;font-size:17px;font-weight:800;cursor:pointer}.veh-zone small{font-size:13px}.veh-zone.terminee{border-color:#21965c;background:#e8f8ef;color:#12613b}.veh-etat{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:14px 0}.veh-etat label{display:flex;align-items:center;justify-content:center;gap:6px;min-height:54px;padding:9px 5px;border:1px solid #b9c8d5;border-radius:12px;background:#f8fafc;font-size:14px;font-weight:750;cursor:pointer}.veh-etat label:has(input:checked){border-width:3px}.veh-etat label:has(input[value="bon"]:checked){background:#c7f3d7;border-color:#16834a;color:#07532b}.veh-etat label:has(input[value="a_surveiller"]:checked){background:#fff0a6;border-color:#d19a00;color:#6c4a00}.veh-etat label:has(input[value="hs"]:checked){background:#ffd1d1;border-color:#c52c2c;color:#821515}.veh-etat input{width:18px;height:18px;accent-color:#246b4b}.veh-note{box-sizing:border-box;width:100%;border:1px solid #ccd5df;border-radius:10px;padding:13px;font:inherit;font-size:16px}.veh-progress{height:10px;border-radius:99px;background:#e2e8f0;overflow:hidden}.veh-progress>div{height:100%;background:#21965c}.veh-retour{margin-bottom:14px;min-height:44px}.veh-inventaire-contenu{padding-bottom:18px}.veh-zone-identite{display:flex;align-items:center;gap:12px;min-width:0}.veh-photo-miniature{display:none;flex:0 0 auto;overflow:hidden;border:1px solid #cbd5e1;border-radius:11px;padding:0;background:#f1f5f9;cursor:zoom-in;align-items:center;justify-content:center}.veh-photo-miniature.veh-photo-chargee{display:flex}.veh-photo-miniature img{width:100%;height:100%;object-fit:cover;display:block}.veh-photo-zone{width:74px;height:74px}.veh-photo-materiel{width:105px;height:90px;margin:10px 0}.veh-photo-detail{width:min(100%,280px);height:175px;margin:12px 0}#veh-photo-plein-ecran{position:fixed;inset:0;z-index:400000;background:rgba(0,0,0,.97);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;cursor:zoom-out}#veh-photo-plein-ecran img{display:block;max-width:100%;max-height:100%;object-fit:contain}`;
 st.textContent += ` #veh-personnel .heures-chips{margin-bottom:12px}.veh-zone{box-sizing:border-box}.veh-zone-identite{flex:1}.veh-etat label:has(input[value="fait"]:checked),.veh-etat label:has(input[value="non_necessaire"]:checked){background:#c7f3d7;border-color:#16834a;color:#07532b}.veh-etat label:has(input[value="a_nettoyer"]:checked),.veh-etat label:has(input[value="non_realise"]:checked),.veh-etat label:has(input[value="non_realises"]:checked){background:#fff0a6;border-color:#d19a00;color:#6c4a00}.veh-etat label:has(input[value="non_fait"]:checked){background:#ffd1d1;border-color:#c52c2c;color:#821515} .veh-materiel-ligne{background:#fff;border:1px solid #dce3e9;border-radius:12px;margin:7px 0;padding:10px 12px}.veh-materiel-haut{display:flex;align-items:center;gap:10px}.veh-materiel-ouvrir{border:0;background:transparent;text-align:left;flex:1;min-width:0;padding:3px 0;color:#172b3d;font:inherit;cursor:pointer}.veh-materiel-ouvrir strong{display:block;font-size:17px;font-weight:850;line-height:1.3}.veh-materiel-ouvrir small{display:block;color:#5c6976;font-size:13px;margin-top:3px}.veh-materiel-chevron{font-size:20px;color:#657584}.veh-materiel-ligne .veh-etat{margin:8px 0 0;gap:5px}.veh-materiel-ligne .veh-etat label{min-height:39px;padding:5px 3px;font-size:12px}.veh-materiel-ligne .veh-etat input{width:15px;height:15px}.veh-materiel-details{display:none;border-top:1px solid #e5eaf0;margin-top:11px;padding-top:12px}.veh-materiel-ligne.ouvert .veh-materiel-details{display:block}.veh-quantite-saisie{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:10px 0}.veh-quantite-saisie input{width:95px;padding:9px;border:1px solid #bdc9d3;border-radius:9px;font:inherit;font-size:17px}.veh-quantite-erreur{color:#b42323!important;font-weight:800!important}.veh-materiel-ligne:has(.veh-quantite-erreur){border-color:#d95252}.veh-materiel-ligne .veh-photo-materiel{width:90px;height:76px;margin:5px 0 10px}`;
 document.head.appendChild(st);
}
function vehInventaireAfficher(corps){
 initialiserStyleEspaceGardeUtilisateur();vehInventaireStyle();
 document.getElementById("app").innerHTML=`<main class="garde-section">${corps}</main>${navigationPrincipale("","accueil")}`;
 void vehInventaireChargerPhotos();
 actualiserInterfaceBureau();window.scrollTo({top:0,behavior:"auto"});
}
const VEH_INVENTAIRE_AVERTISSEMENT="Quitter l'inventaire ?\n\nSi vous quittez sans terminer l'enregistrement, tous les contrôles effectués seront supprimés.";
let vehInventaireNavigationConfirmee=false;
async function vehInventaireQuitter(){
 if(vehInventaireSession && !(await afficherConfirmationCIS(VEH_INVENTAIRE_AVERTISSEMENT)))return;
 vehInventaireSession=null;afficherInventaireVehiculeEspaceGarde();
}
// Les navigations externes passent par la fenêtre de confirmation habituelle de l'application.
document.addEventListener("click",async function(event){
 if(!vehInventaireSession||vehInventaireNavigationConfirmee)return;
 // Les boutons de la fenêtre de confirmation ne sont pas une navigation.
 if(event.target?.closest?.(".fenetre-cis-overlay, .fenetre-cis"))return;
 const btn=event.target?.closest?.("button,a");if(!btn||btn.closest(".veh-inventaire-contenu"))return;
 if(!document.querySelector(".veh-inventaire-contenu"))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(!(await afficherConfirmationCIS(VEH_INVENTAIRE_AVERTISSEMENT)))return;
 vehInventaireSession=null;
 vehInventaireNavigationConfirmee=true;
 try{btn.click();}finally{vehInventaireNavigationConfirmee=false;}
},true);
async function afficherInventaireVehiculeEspaceGarde(){
 vehInventaireAfficher(`<div class="veh-inventaire-liste"><button class="retour-button veh-retour" onclick="retourSaisieEquipe('vehicules')">← Retour</button><h1>Inventaire véhicule</h1><div id="veh-liste" class="veh-muted">Chargement des véhicules…</div></div>`);
 try{
  const sb=obtenirClientSupabase();if(!sb)throw Error("Connexion Supabase indisponible");
  const {data,error}=await sb.from("cis_vehicules").select("id,nom,code,actif").eq("actif",true).order("nom");if(error)throw error;
  vehInventaireCatalogue=data||[];
  const zone=document.getElementById("veh-liste");if(!zone)return;
  zone.innerHTML=vehInventaireCatalogue.length?vehInventaireCatalogue.map(v=>`<button class="veh-zone" onclick="vehInventaireOuvrirVehicule('${v.id}')"><span>${vehInventaireHTML(v.nom)}</span><span>›</span></button>`).join(""):'Aucun véhicule configuré dans Admin.';
 }catch(e){const zone=document.getElementById("veh-liste");if(zone)zone.textContent="Impossible de charger les véhicules : "+e.message;}
}
async function vehInventaireOuvrirVehicule(id){
 const v=vehInventaireCatalogue.find(x=>x.id===id);if(!v)return;
 vehInventaireAfficher(`<button class="retour-button veh-retour" onclick="afficherInventaireVehiculeEspaceGarde()">← Véhicules</button><h1>${vehInventaireHTML(v.nom)}</h1><div class="veh-card"><p>Contrôler chaque coffre et son matériel, puis terminer l'enregistrement.</p><button class="veh-action" onclick="vehInventaireCommencer('${v.id}')">Réaliser l'inventaire</button></div>`);
}
async function vehInventaireCommencer(id){
 const v=vehInventaireCatalogue.find(x=>x.id===id);if(!v)return;
 vehInventaireAfficher(`<h1>${vehInventaireHTML(v.nom)}</h1><p>Chargement des coffres…</p>`);
 try{
  const sb=obtenirClientSupabase();
  const z=await sb.from("cis_vehicule_zones").select("id,vehicule_id,nom,cote,ordre,actif,photo_path").eq("vehicule_id",id).eq("actif",true).order("ordre");if(z.error)throw z.error;
  const zones=z.data||[];if(!zones.length){vehInventaireAfficher(`<button class="retour-button veh-retour" onclick="vehInventaireOuvrirVehicule('${id}')">← Retour</button><h1>${vehInventaireHTML(v.nom)}</h1><p>Configure d'abord les coffres dans l'application Admin.</p>`);return;}
  const m=await sb.from("cis_vehicule_materiels").select("id,zone_id,nom,quantite,etat_reference,notes,ordre,photo_path").in("zone_id",zones.map(x=>x.id)).order("ordre");if(m.error)throw m.error;
  vehInventaireZones=zones;vehInventaireMateriels=m.data||[];
  const signalements=await sb.rpc("inventaires_anomalies",{p_vehicule:id});if(signalements.error)throw signalements.error;
  const personnels=listePersonnelAvecAuteur(await chargerUtilisateursEspaceGarde());
  vehInventaireSession={vehicule:{id:v.id,nom:v.nom,code:v.code},controles:{},anomalies:signalements.data||[],participants:personnesAvecAuteur([]),personnels};
  vehInventaireAfficherZones();
 }catch(e){vehInventaireAfficher(`<button class="retour-button veh-retour" onclick="vehInventaireOuvrirVehicule('${id}')">← Retour</button><h1>Erreur de chargement</h1><p>${vehInventaireHTML(e.message)}</p>`);}
}
function vehInventaireAfficherZones(){
 const session=vehInventaireSession;if(!session)return;initialiserStyleEspaceGardeUtilisateur();initialiserStyleActionsEquipe();
 const nb=vehInventaireZones.filter(z=>CISTechnique.coffreComplet(z.id)).length;
 const total=vehInventaireZones.length+2,realises=nb+(CISTechnique.techniqueComplete(session.technique)?1:0)+(CISTechnique.annexeComplete(session.annexe)?1:0);
 const zone=(nom,complet,commence,action,photo='')=>`<div class="veh-zone ${complet?'terminee':''}" style="cursor:default"><div class="veh-zone-identite">${photo}<button type="button" class="veh-zone-ouvrir" style="border:0;background:transparent;color:inherit;font:inherit;font-weight:inherit;text-align:left;cursor:pointer;flex:1;padding:4px" onclick="${action}">${complet?'✓':'●'} ${vehInventaireHTML(nom)}</button></div><small>${complet?'Enregistré':commence?'Incomplet':'À contrôler'}</small></div>`;
 vehInventaireAfficher(`<div class="veh-inventaire-contenu"><button class="retour-button veh-retour" onclick="vehInventaireQuitter()">← Retour</button><h1>${vehInventaireHTML(session.vehicule.nom)}</h1><p class="veh-muted">Inventaire en cours · ${realises}/${total} rubriques contrôlées</p><div class="veh-progress"><div style="width:${100*realises/total}%"></div></div><div class="veh-card"><strong>Zones de contrôle</strong><p class="veh-muted">Sélectionne chaque zone pour contrôler son matériel. Les zones validées apparaissent en vert.</p>${vehInventaireZones.map(z=>zone(z.nom,CISTechnique.coffreComplet(z.id),session.controles[z.id],`vehInventaireOuvrirZone('${z.id}')`,vehPhotoMiniature(z.photo_path,'zone'))).join('')}${zone('Technique',CISTechnique.techniqueComplete(session.technique),session.technique,'CISTechnique.ouvrir()')}${zone('Annexe',CISTechnique.annexeComplete(session.annexe),session.annexe,'CISTechnique.ouvrirAnnexe()')}</div><section class="veh-card" id="veh-personnel"><h2>Personnel</h2><div class="heures-chips" id="veh-personnes-selectionnees"></div><div class="heures-recherche-wrap"><input class="heures-input" id="veh-recherche-personnel" type="search" placeholder="Écris les premières lettres d’un nom…" autocomplete="off" aria-label="Rechercher une personne à ajouter" aria-controls="veh-resultats-personnel" oninput="vehInventaireRechercherPersonnel()"><div class="heures-resultats" id="veh-resultats-personnel"></div></div></section><button type="button" class="veh-action" onclick="vehInventaireTerminer()">Terminer l'enregistrement</button></div>`);
 vehInventaireActualiserPersonnel();
}
function vehInventaireActualiserPersonnel(){const session=vehInventaireSession,box=document.getElementById('veh-personnes-selectionnees');if(!session||!box)return;session.participants=personnesAvecAuteur(session.participants);const personnes=listePersonnelAvecAuteur(session.personnels||[]),moi=String(personnelConnecteSaisie()?.id||'');box.innerHTML=session.participants.map(id=>{const p=personnes.find(p=>String(p.id)===id),nom=p?[p.prenom,p.nom].filter(Boolean).join(' '):'Personnel';return `<span class="heures-chip">${vehInventaireHTML(nom)}${id===moi?' <small>(toi)</small>':` <button type="button" onclick="vehInventaireRetirerPersonnel('${vehInventaireHTML(id)}')" aria-label="Retirer ${vehInventaireHTML(nom)}">×</button>`}</span>`;}).join('');}
function vehInventaireRechercherPersonnel(){const session=vehInventaireSession,input=document.getElementById('veh-recherche-personnel'),box=document.getElementById('veh-resultats-personnel');if(!session||!input||!box)return;const q=input.value.trim().toLocaleLowerCase('fr'),selection=new Set(personnesAvecAuteur(session.participants));if(!q){box.innerHTML='';box.classList.remove('ouvert');return;}const ps=listePersonnelAvecAuteur(session.personnels||[]).filter(p=>!selection.has(String(p.id))&&[p.prenom,p.nom].filter(Boolean).join(' ').toLocaleLowerCase('fr').includes(q)).slice(0,8);box.innerHTML=ps.map(p=>`<button type="button" class="heures-resultat" onclick="vehInventaireAjouterPersonnel('${vehInventaireHTML(p.id)}')">${vehInventaireHTML([p.prenom,p.nom].filter(Boolean).join(' '))}</button>`).join('')||'<div class="heures-vide">Aucun résultat.</div>';box.classList.add('ouvert');}
function vehInventaireAjouterPersonnel(id){const session=vehInventaireSession;if(!session||!(session.personnels||[]).some(p=>String(p.id)===id))return;session.participants=personnesAvecAuteur([...(session.participants||[]),id]);const input=document.getElementById('veh-recherche-personnel');if(input)input.value='';vehInventaireActualiserPersonnel();vehInventaireRechercherPersonnel();input?.focus();}
function vehInventaireRetirerPersonnel(id){if(!vehInventaireSession||String(id)===String(personnelConnecteSaisie()?.id))return;vehInventaireSession.participants=personnesAvecAuteur((vehInventaireSession.participants||[]).filter(p=>p!==id));vehInventaireActualiserPersonnel();vehInventaireRechercherPersonnel();}
function vehInventaireOuvrirPersonnel(){vehInventaireAfficherZones();document.getElementById('veh-personnel')?.scrollIntoView({block:'center'});document.getElementById('veh-recherche-personnel')?.focus({preventScroll:true});}
function vehInventaireEnregistrerPersonnel(){vehInventaireAfficherZones();}

function vehInventaireBasculerMateriel(id){
 const carte=document.querySelector(`[data-materiel="${id}"]`);if(!carte)return;
 const ouvert=carte.classList.toggle('ouvert');
 carte.querySelector('.veh-materiel-ouvrir')?.setAttribute('aria-expanded',String(ouvert));
}
function vehInventaireActualiserQuantite(input){
 const carte=input.closest('[data-materiel]');if(!carte)return;
 const attendue=Number(carte.dataset.quantiteAttendue);
 const valeur=input.value.trim()===''?NaN:Number(input.value);
 const erreur=!Number.isInteger(valeur)||valeur<0||valeur!==attendue;
 carte.querySelectorAll('.veh-quantite-statut').forEach(e=>{
  e.classList.toggle('veh-quantite-erreur',erreur);
  e.textContent=erreur?(Number.isInteger(valeur)&&valeur>=0&&valeur<attendue?'Matériel manquant : ':'Écart de quantité : ')+(Number.isInteger(valeur)&&valeur>=0?valeur:'à renseigner')+' / '+attendue:'Quantité conforme';
 });
}
function vehInventaireOuvrirZone(id){
 if(id==='__technique'){CISTechnique.ouvrir();return;}
 const session=vehInventaireSession,z=vehInventaireZones.find(x=>x.id===id);if(!session||!z)return;
 const materiels=vehInventaireMateriels.filter(m=>m.zone_id===id);
 const precedent=session.controles[id]||{};
 vehInventaireAfficher(`<div class="veh-inventaire-contenu"><button class="retour-button veh-retour" onclick="vehInventaireAfficherZones()">← Coffres</button><h1>${vehInventaireHTML(z.nom)}</h1>${vehPhotoMiniature(z.photo_path,"detail")}<p class="veh-muted">Choisis l'état de chaque matériel. Appuie sur son nom pour ajouter une observation ou modifier la quantité constatée.</p><div id="veh-materiels">${materiels.length?materiels.map(m=>{const alerte=(session.anomalies||[]).find(a=>a.materiel_id===m.id);const valeur=precedent[m.id]||{},q=valeur.quantite_constatee??m.quantite,ecart=Number(q)!==Number(m.quantite);return `<div class="veh-materiel-ligne" data-materiel="${m.id}" data-quantite-attendue="${Number(m.quantite)}"><div class="veh-materiel-haut"><button type="button" class="veh-materiel-ouvrir" aria-expanded="false" onclick="vehInventaireBasculerMateriel('${m.id}')"><strong>${vehInventaireHTML(m.nom)}</strong><small>Prévu : <b>${Number(m.quantite)}</b> ${ecart?`· <span class="veh-quantite-erreur">${Number(q)<Number(m.quantite)?'Matériel manquant':'Constaté'} : ${Number(q)}</span>`:''}</small></button><span class="veh-materiel-chevron" aria-hidden="true">⌄</span></div>${alerte?`<p role="note" style="padding:12px;border-radius:9px;background:${alerte.etat==='hs'?'#ffe1e1':'#fff0b3'};color:#442b25;border:2px solid ${alerte.etat==='hs'?'#bc2525':'#bc8d13'}"><strong>Dernier signalement : ${alerte.etat==='hs'?'HS':'À surveiller'}</strong>${alerte.observation?'<br>'+vehInventaireHTML(alerte.observation):''}<br><small>${new Date(alerte.date).toLocaleString('fr-FR')}</small></p>`:''}<div class="veh-etat">${[["bon","Bon"],["a_surveiller","À surveiller"],["hs","HS"]].map(([val,lib])=>`<label><input type="radio" name="etat-${m.id}" value="${val}" ${valeur.etat===val?"checked":""}> ${lib}</label>`).join("")}</div><div class="veh-materiel-details">${vehPhotoMiniature(m.photo_path,"materiel")}<label class="veh-quantite-saisie"><strong>Quantité constatée</strong><input type="number" min="0" step="1" inputmode="numeric" value="${Number(q)}" oninput="vehInventaireActualiserQuantite(this)" aria-label="Quantité constatée de ${vehInventaireHTML(m.nom)}"></label><p class="veh-quantite-statut ${ecart?'veh-quantite-erreur':''}">${ecart?`${Number(q)<Number(m.quantite)?'Matériel manquant':'Écart de quantité'} : ${Number(q)} / ${Number(m.quantite)}`:'Quantité conforme'}</p><label>Observation<textarea class="veh-note" rows="2" placeholder="Observation (facultatif)">${vehInventaireHTML(valeur.observation||"")}</textarea></label></div></div>`}).join(""):'<p>Aucun matériel configuré pour cette zone.</p>'}</div><button class="veh-action" onclick="vehInventaireEnregistrerZone('${id}')">Enregistrer ce coffre</button></div>`);
}
function vehInventaireEnregistrerZone(id){
 const session=vehInventaireSession;if(!session)return;
 const controles={};for(const m of vehInventaireMateriels.filter(x=>x.zone_id===id)){
  const card=document.querySelector(`[data-materiel="${m.id}"]`),etat=card?.querySelector('input[type="radio"]:checked')?.value;
  // Un contrôle non renseigné reste explicitement incomplet dans le rapport.
  const input=card.querySelector('input[type="number"]');
  const quantite=input.value.trim()===''?NaN:Number(input.value);
  if(!Number.isInteger(quantite)||quantite<0){card.classList.add('ouvert');input.focus();alert('Indique une quantité constatée valide pour '+m.nom+'.');return;}
  controles[m.id]={etat:etat||null,observation:card.querySelector('textarea')?.value?.trim()||"",quantite_constatee:quantite};
 }
 session.controles[id]=controles;vehInventaireAfficherZones();
}
let vehInventaireEnregistrementEnCours=false;
async function vehInventaireTerminer(){
 if(vehInventaireEnregistrementEnCours)return;
 vehInventaireEnregistrementEnCours=true;
 try{await vehInventaireTerminerInterne();}finally{vehInventaireEnregistrementEnCours=false;}
}
async function vehInventaireTerminerInterne(){
 const session=vehInventaireSession;if(!session)return;
 const manquants=CISTechnique.manquants(session);
 const avertissement=manquants.length?"Cet inventaire n’est pas entièrement complété :\n\n"+manquants.join("\n")+"\n\nEnregistrer quand même ? Les contrôles manquants resteront visibles.":"Confirmer l’enregistrement définitif de l’inventaire ?";
 if(!(await afficherConfirmationCIS(avertissement)))return;
 const btn=document.querySelector(".veh-inventaire-contenu > .veh-action");if(btn){btn.disabled=true;btn.textContent="Enregistrement…";}
 try{
  const sb=obtenirClientSupabase();const payload={vehicule_id:session.vehicule.id,vehicule_nom:session.vehicule.nom,controle_par:profilUtilisateurConnecte?.id,personnes_presentes:personnesAvecAuteur(session.participants),details:vehInventaireZones.map(z=>({zone_id:z.id,zone_nom:z.nom,cote:z.cote,materiels:vehInventaireMateriels.filter(m=>m.zone_id===z.id).map(m=>({materiel_id:m.id,nom:m.nom,quantite:m.quantite,quantite_constatee:session.controles[z.id]?.[m.id]?.quantite_constatee??m.quantite,etat_reference:m.etat_reference,etat:session.controles[z.id]?.[m.id]?.etat||null,observation:session.controles[z.id]?.[m.id]?.observation||""}))}))};
  payload.details.push(CISTechnique.zone(session.technique||{}),CISTechnique.zoneAnnexe(session.annexe||{}));
  const {error}=await sb.from("cis_inventaires_vehicules").insert(payload);if(error)throw error;
  vehInventaireSession=null;
  await animationValidationEnregistrementCIS("Inventaire enregistré", () => afficherEspaceGarde());
 }catch(e){alert("Enregistrement impossible : "+e.message+". Les contrôles sont conservés sur cette page.");if(btn){btn.disabled=false;btn.textContent="Terminer l'enregistrement";}}
}
window.vehInventaireOuvrirVehicule=vehInventaireOuvrirVehicule;
window.vehInventaireCommencer=vehInventaireCommencer;
window.vehInventaireOuvrirZone=vehInventaireOuvrirZone;
window.vehInventaireEnregistrerZone=vehInventaireEnregistrerZone;
window.vehInventaireAfficherZones=vehInventaireAfficherZones;
window.vehInventaireTerminer=vehInventaireTerminer;
window.vehInventaireQuitter=vehInventaireQuitter;

/* Calendrier consultable ; le modèle PNG reste réservé à l'enregistrement. */
const COULEURS_PLANNING_GARDE=["#ff5a5a","#92d050","#19a9e5","#ffc000","#9b6bd3","#5ac8c8","#ff8ac6","#70ad47"];
let calendrierPlanningGardeEtat=null;

function initialiserStyleCalendrierPlanningGarde(){
 if(document.getElementById('style-calendrier-planning-garde'))return;
 const style=document.createElement('style');style.id='style-calendrier-planning-garde';
 style.textContent=`
 .planning-mensuel-cadre{background:#fff;border:1px solid #dde3e8;border-radius:16px;padding:14px;color:#20272b}
 .planning-mensuel-entete{display:flex;align-items:center;gap:9px;margin-bottom:14px;flex-wrap:wrap}.planning-mensuel-entete h2{flex:1;min-width:140px;margin:0;font-size:22px;text-transform:capitalize}.planning-mensuel-commandes{display:flex;gap:6px;align-items:center}.planning-mensuel-commandes button{min-height:42px;min-width:42px;padding:8px 12px;border:1px solid #d1dae2;border-radius:10px;background:#f4f6f8;color:#007aff;font:inherit;font-weight:750;cursor:pointer}.planning-mensuel-commandes .planning-mois-fleche{font-size:25px;line-height:1}
 .planning-mensuel-table{--planning-jour-cadre:#172b4d;width:100%;border-collapse:collapse;table-layout:fixed;border:1px solid #9ca6af}.planning-mensuel-table th,.planning-mensuel-table td{height:28px;padding:4px 8px;border:1px solid #a8afb5;vertical-align:middle;box-sizing:border-box;font-size:13px;line-height:1.35;color:#20272b;background:#f5f6f7;overflow-wrap:anywhere}.planning-mensuel-table .planning-mensuel-numero,.planning-mensuel-table .planning-mensuel-jour{width:42px;text-align:center;font-weight:500;background:#eceeef}.planning-mensuel-table .planning-weekend .planning-mensuel-numero,.planning-mensuel-table .planning-weekend .planning-mensuel-jour{background:#dde1e4}.planning-mensuel-jour abbr{text-decoration:none}.planning-mensuel-table td[data-equipe]{background:var(--couleur-equipe);color:#111}.planning-mensuel-equipe{font-weight:750}.planning-mensuel-menage{font-weight:850;white-space:nowrap}.planning-mensuel-table tr[aria-current=date]>*{border-top:2px solid var(--planning-jour-cadre);border-bottom:2px solid var(--planning-jour-cadre)}.planning-mensuel-table tr[aria-current=date]>:first-child{border-left:2px solid var(--planning-jour-cadre)}.planning-mensuel-table tr[aria-current=date]>:last-child{border-right:2px solid var(--planning-jour-cadre)}.planning-mensuel-table tr[aria-current=date] .planning-mensuel-numero{font-weight:900;text-decoration:underline;text-underline-offset:3px}
 .planning-mensuel-table .planning-mensuel-affectation{position:relative;padding-right:28px}.planning-mensuel-etoile{position:absolute;right:8px;top:50%;transform:translateY(-40%);font-family:"Bradley Hand","Segoe Print",cursive;font-size:19px;font-weight:700;line-height:1;color:inherit}
 .planning-mensuel-note,.planning-mensuel-vide{font-size:12px;color:#64717d;line-height:1.5;margin:12px 0 0}.planning-mensuel-equipes{display:grid;gap:12px}.planning-mensuel-equipe-carte{padding:16px;background:#fff;border:1px solid #dce3e9;border-left:6px solid var(--couleur-equipe);border-radius:12px;color:#20272b}.planning-mensuel-equipe-carte h3{margin:0 0 10px;font-size:17px}.planning-mensuel-personnel{margin:0;padding-left:18px;columns:2;column-gap:20px;font-size:14px;line-height:1.7}.planning-mensuel-personnel li{break-inside:avoid;overflow-wrap:anywhere}.planning-mensuel-equipe-carte p{font-size:14px;margin:0;color:#64717d}.planning-mensuel-export-statut{font-size:14px;line-height:1.5;color:#a22020}.planning-mensuel-erreur button{display:block;margin-top:12px}
 @media(max-width:380px){.planning-mensuel-cadre{padding:10px 7px}.planning-mensuel-table th,.planning-mensuel-table td{padding:4px 6px}.planning-mensuel-table .planning-mensuel-numero,.planning-mensuel-table .planning-mensuel-jour{width:35px}.planning-mensuel-personnel{columns:1}}
 @media(min-width:700px){.planning-mensuel-table th,.planning-mensuel-table td{height:30px;font-size:14px}.planning-mensuel-equipes{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(min-width:1000px){body:not(.mode-connexion) .planning-mensuel-cadre,body:not(.mode-connexion) .planning-mensuel-equipe-carte{background:#141e27;color:#f5f7f9;border-color:#34424f}body:not(.mode-connexion) .planning-mensuel-equipe-carte{border-left-color:var(--couleur-equipe)}body:not(.mode-connexion) .planning-mensuel-commandes button{background:#202c36;border-color:#617687;color:#75b9ff}body:not(.mode-connexion) .planning-mensuel-table th,body:not(.mode-connexion) .planning-mensuel-note,body:not(.mode-connexion) .planning-mensuel-vide,body:not(.mode-connexion) .planning-mensuel-equipe-carte p{color:#a6b3c0}body:not(.mode-connexion) .planning-mensuel-table td:not([data-equipe]){background:#202c36;color:#f5f7f9}body:not(.mode-connexion) .planning-mensuel-table .planning-mensuel-numero,body:not(.mode-connexion) .planning-mensuel-table .planning-mensuel-jour{background:#202c36;color:#f5f7f9}body:not(.mode-connexion) .planning-mensuel-table .planning-weekend .planning-mensuel-numero,body:not(.mode-connexion) .planning-mensuel-table .planning-weekend .planning-mensuel-jour{background:#2c3b48}body:not(.mode-connexion) .planning-mensuel-table{--planning-jour-cadre:#fff}body:not(.mode-connexion) .planning-mensuel-export-statut{color:#ff9595}}
 `;document.head.appendChild(style);
}

function gardePourJourCalendrierPlanning(date,planning){
 const vendredi=new Date(date);vendredi.setDate(vendredi.getDate()-(vendredi.getDay()-6+7)%7-1);
 return planning.find(p=>p.date_debut===dateISOlocale(vendredi))||null;
}

async function afficherPlanningEspaceGarde(mois=null){
 initialiserStyleEspaceGardeUtilisateur();initialiserStyleCalendrierPlanningGarde();
 const date=typeof mois==='string'&&/^\d{4}-\d{2}$/.test(mois)?new Date(Number(mois.slice(0,4)),Number(mois.slice(5))-1,1,12):new Date();
 const etat={mois:new Date(date.getFullYear(),date.getMonth(),1,12),donnees:null,photo:null,exportEnCours:false};calendrierPlanningGardeEtat=etat;
 document.getElementById('app').innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="afficherEspaceGarde()">← Espace équipe</button><h1>Planning</h1><div id="garde-planning-calendrier" data-mois="${dateISOlocale(etat.mois).slice(0,7)}"><div class="garde-planning-attente" role="status">Chargement du planning…</div></div></main>${navigationPrincipale('','accueil')}`;
 const zone=document.getElementById('garde-planning-calendrier');actualiserInterfaceBureau();
 try{
  etat.donnees=await chargerDonneesPlanningGarde();
  if(!zone.isConnected||calendrierPlanningGardeEtat!==etat)return;
  rendreCalendrierPlanningGarde();
 }catch(erreur){
  if(zone.isConnected)zone.innerHTML=`<div class="garde-planning-attente planning-mensuel-erreur" role="status">Le planning n’est pas disponible pour le moment.<button type="button" class="equipe-action-button" onclick="afficherPlanningEspaceGarde('${dateISOlocale(etat.mois).slice(0,7)}')">Réessayer</button></div>`;
  console.warn('Calendrier des gardes :',erreur);
 }
}

function changerMoisPlanningGarde(decalage){
 const etat=calendrierPlanningGardeEtat;if(!etat?.donnees||![-1,0,1].includes(decalage))return;
 const d=decalage===0?new Date():new Date(etat.mois.getFullYear(),etat.mois.getMonth()+decalage,1,12);
 etat.mois=new Date(d.getFullYear(),d.getMonth(),1,12);rendreCalendrierPlanningGarde();
}

function rendreCalendrierPlanningGarde(){
 const zone=document.getElementById('garde-planning-calendrier'),etat=calendrierPlanningGardeEtat;if(!zone||!etat?.donnees)return;
 const {planning,teams,memberNames,members=[]}=etat.donnees,mois=etat.mois;
 const monId=String(profilUtilisateurConnecte?.id||'');
 const mesEquipes=new Set(members.filter(m=>monId&&String(m.utilisateur_id)===monId).map(m=>String(m.equipe_id)));
 const parId=new Map(teams.map(t=>[String(t.id),t]));
 const couleurs=new Map(teams.map((t,i)=>[String(t.id),COULEURS_PLANNING_GARDE[i%COULEURS_PLANNING_GARDE.length]]));
 const nbJours=new Date(mois.getFullYear(),mois.getMonth()+1,0,12).getDate(),aujourdhui=dateISOlocale(new Date());
 const lettres=['D','L','M','M','J','V','S'];
 let cellules='',programme=false;
 for(let jour=1;jour<=nbJours;jour++){
  const date=new Date(mois.getFullYear(),mois.getMonth(),jour,12),garde=gardePourJourCalendrierPlanning(date,planning);
  const equipe=garde?parId.get(String(garde.equipe_id)):null,nom=garde?(equipe?.nom||'Équipe'):'';
  if(garde)programme=true;
  const menage=!!garde&&date.getDay()===5,iso=dateISOlocale(date);
  const maGarde=!!garde&&mesEquipes.has(String(garde.equipe_id));
  const libelle=date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+(garde?' · '+nom:' · Aucune garde renseignée')+(menage?' · Ménage':'')+(maGarde?' · Ta semaine de garde':'');
  cellules+=`<tr data-date="${iso}" class="${date.getDay()===0||date.getDay()===6?'planning-weekend':''}" ${iso===aujourdhui?'aria-current="date"':''} aria-label="${echapperHTML(libelle)}"><th scope="row" class="planning-mensuel-numero">${jour}</th><td class="planning-mensuel-jour"><abbr title="${date.toLocaleDateString('fr-FR',{weekday:'long'})}">${lettres[date.getDay()]}</abbr></td><td class="planning-mensuel-affectation" ${garde?`data-equipe="${echapperHTML(String(garde.equipe_id))}" style="--couleur-equipe:${couleurs.get(String(garde.equipe_id))||'#dddddd'}"`:''}><span class="planning-mensuel-equipe">${garde?echapperHTML(nom):'—'}</span>${menage?'<span class="planning-mensuel-menage"> · MÉNAGE</span>':''}${maGarde?'<span class="planning-mensuel-etoile" aria-hidden="true" title="Ta semaine de garde">*</span>':''}</td></tr>`;
 }
 zone.dataset.mois=dateISOlocale(mois).slice(0,7);
 zone.innerHTML=`<section class="planning-mensuel-cadre" aria-labelledby="planning-mensuel-mois"><header class="planning-mensuel-entete"><h2 id="planning-mensuel-mois" aria-live="polite">${echapperHTML(mois.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}))}</h2><div class="planning-mensuel-commandes"><button type="button" class="planning-mois-fleche" aria-label="Mois précédent" onclick="changerMoisPlanningGarde(-1)">‹</button><button type="button" onclick="changerMoisPlanningGarde(0)">Aujourd’hui</button><button type="button" class="planning-mois-fleche" aria-label="Mois suivant" onclick="changerMoisPlanningGarde(1)">›</button></div></header><table class="planning-mensuel-table" aria-labelledby="planning-mensuel-mois"><tbody>${cellules}</tbody></table>${programme?'':'<p class="planning-mensuel-vide">Aucune garde programmée pour ce mois.</p>'}<p class="planning-mensuel-note">Relève le vendredi à 19 h. Le ménage du vendredi est indiqué sur la couleur de l’équipe sortante.</p></section><h2 class="garde-sous-titre">Équipes de garde</h2><div class="planning-mensuel-equipes">${teams.map(t=>{const noms=memberNames.get(String(t.id))||[];return `<section class="planning-mensuel-equipe-carte" style="--couleur-equipe:${couleurs.get(String(t.id))}"><h3>${echapperHTML(t.nom||'Équipe')}</h3>${noms.length?`<ul class="planning-mensuel-personnel">${noms.map(n=>`<li>${echapperHTML(n)}</li>`).join('')}</ul>`:'<p>Aucun personnel renseigné.</p>'}</section>`}).join('')||'<p>Aucune équipe enregistrée.</p>'}</div><button type="button" id="planning-mensuel-export" class="garde-planning-save" onclick="enregistrerPlanningMensuelEnPhoto()" ${etat.exportEnCours||!planning.length?'disabled':''}>${etat.exportEnCours?'Préparation de la photo…':'Enregistrer le planning en photo'}</button><p id="planning-mensuel-export-statut" class="planning-mensuel-export-statut" role="status"></p>`;
 memoriserTransitionNavigation();
}

async function enregistrerPlanningMensuelEnPhoto(){
 const etat=calendrierPlanningGardeEtat;if(!etat?.donnees||etat.exportEnCours||!etat.donnees.planning.length)return;
 etat.exportEnCours=true;
 const bouton=document.getElementById('planning-mensuel-export');if(bouton){bouton.disabled=true;bouton.textContent='Préparation de la photo…';}
 const statut=document.getElementById('planning-mensuel-export-statut');if(statut)statut.textContent='';
 try{
  etat.photo=etat.photo||await creerPhotoPlanningGarde(etat.donnees);
  if(calendrierPlanningGardeEtat!==etat||!document.getElementById('garde-planning-calendrier'))return;
  await enregistrerPhotoPlanningEquipe(etat.photo);
 }catch(erreur){
  const statut=document.getElementById('planning-mensuel-export-statut');if(statut)statut.textContent='Impossible de préparer la photo. Réessaie dans un instant.';
  console.warn('Photo du planning :',erreur);
 }finally{
  etat.exportEnCours=false;
  if(calendrierPlanningGardeEtat===etat){const b=document.getElementById('planning-mensuel-export');if(b){b.disabled=false;b.textContent='Enregistrer le planning en photo';}}
 }
}

async function chargerDonneesPlanningGarde(){
    const supabase=obtenirClientSupabase();
    if(!supabase||!navigator.onLine)throw new Error("hors ligne");
    const [pr,tr,mr]=await Promise.all([
      supabase.from("planning_gardes").select("date_debut,equipe_id").order("date_debut"),
      supabase.from("equipes_garde").select("id,nom,actif").order("nom"),
      supabase.from("equipes_garde_membres").select("equipe_id,utilisateur_id")
    ]);
    if(pr.error)throw pr.error;if(tr.error)throw tr.error;if(mr.error)throw mr.error;
    const planning=pr.data||[],teams=(tr.data||[]).filter(t=>t.actif!==false),members=mr.data||[];
    if(!utilisateursEspaceGarde.length)utilisateursEspaceGarde=await chargerUtilisateursEspaceGarde();

    const byTeam=new Map(teams.map(t=>[String(t.id),t]));
    const memberNames=new Map();
    teams.forEach(t=>memberNames.set(String(t.id),members.filter(m=>String(m.equipe_id)===String(t.id)).map(m=>{
      const u=utilisateursEspaceGarde.find(x=>String(x.id)===String(m.utilisateur_id));
      return u?([u.prenom,u.nom].filter(Boolean).join(" ")||u.identifiant):"";
    }).filter(Boolean)));

    return {planning,teams,members,byTeam,memberNames};
}

async function creerPhotoPlanningGarde(donnees=null){
    const {planning,teams,byTeam,memberNames}=donnees||await chargerDonneesPlanningGarde();
    if(!planning.length)throw new Error("vide");

    const now=new Date(), months=[];
    for(let k=-1;k<=4;k++)months.push(new Date(now.getFullYear(),now.getMonth()+k,1,12));
    const monthW=330,rowH=25,headerH=43,top=35,gap=15,maxDays=31;
    const legendRows=teams.reduce((n,t)=>n+1+Math.max(1,Math.ceil((memberNames.get(String(t.id))||[]).length/3)),0);
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1000,months.length*(monthW+gap)+60);
    canvas.height=top+headerH+maxDays*rowH+60+legendRows*24+55;
    const c=canvas.getContext("2d");c.fillStyle="#fff";c.fillRect(0,0,canvas.width,canvas.height);
    const palette=["#ff5a5a","#92d050","#19a9e5","#ffc000","#9b6bd3","#5ac8c8","#ff8ac6","#70ad47"];
    const teamColor=new Map(teams.map((t,i)=>[String(t.id),palette[i%palette.length]]));
    const key=d=>dateISOlocale(d);
    function guardForDay(d){
      const x=new Date(d);
      const delta=(x.getDay()-6+7)%7; // samedi de la période
      x.setDate(x.getDate()-delta-1); // vendredi 19h enregistré
      return planning.find(p=>p.date_debut===key(x))||null;
    }
    const letters=["D","L","M","M","J","V","S"];
    months.forEach((m,mi)=>{
      const x=30+mi*(monthW+gap);
      c.fillStyle="#888";c.fillRect(x,top,monthW,headerH);
      c.fillStyle="#fff";c.font="bold 22px Arial";c.textAlign="center";
      c.fillText(m.toLocaleDateString("fr-FR",{month:"long",year:"numeric"}),x+monthW/2,top+headerH/2+1);
      const days=new Date(m.getFullYear(),m.getMonth()+1,0).getDate();
      for(let day=1;day<=days;day++){
        const d=new Date(m.getFullYear(),m.getMonth(),day,12),y=top+headerH+(day-1)*rowH;
        c.fillStyle=(d.getDay()===0||d.getDay()===6)?"#e6e6e6":"#f7f7f7";c.fillRect(x,y,105,rowH);
        c.strokeStyle="#999";c.strokeRect(x,y,52,rowH);c.strokeRect(x+52,y,53,rowH);
        c.fillStyle="#444";c.font="14px Arial";c.textAlign="center";c.fillText(String(day),x+26,y+rowH/2);c.fillText(letters[d.getDay()],x+78,y+rowH/2);
        const g=guardForDay(d);c.fillStyle=g?(teamColor.get(String(g.equipe_id))||"#ddd"):"#fff";c.fillRect(x+105,y,monthW-105,rowH);c.strokeRect(x+105,y,monthW-105,rowH);
        if(g){const t=byTeam.get(String(g.equipe_id));c.fillStyle="#111";c.font="bold 13px Arial";c.textAlign="left";c.fillText((t?.nom||"Équipe")+(d.getDay()===5?"  •  MÉNAGE":""),x+113,y+rowH/2)}
      }
    });
    let ly=top+headerH+maxDays*rowH+42;c.fillStyle="#111";c.font="bold 21px Arial";c.textAlign="left";c.fillText("Équipes de garde",30,ly);ly+=31;
    teams.forEach(t=>{
      c.fillStyle=teamColor.get(String(t.id));c.fillRect(30,ly-11,48,22);c.strokeStyle="#777";c.strokeRect(30,ly-11,48,22);
      c.fillStyle="#111";c.font="bold 17px Arial";c.fillText(t.nom,92,ly);ly+=24;
      const names=memberNames.get(String(t.id))||[];c.font="14px Arial";
      if(!names.length){c.fillStyle="#666";c.fillText("Aucun membre",92,ly);ly+=24}
      else for(let i=0;i<names.length;i+=3){c.fillStyle="#333";c.fillText(names.slice(i,i+3).join("   •   "),92,ly);ly+=24}
      ly+=6;
    });
    return canvas.toDataURL("image/png");
}


async function enregistrerPhotoPlanningEquipe(url){
    try{
        const rep=await fetch(url);
        const blob=await rep.blob();
        if(estMacBureauExport()){await enregistrerDocumentPrincipal(blob,"planning-gardes-cis-le-chesne.png");return;}
        const fichier=new File([blob],"planning-gardes-cis-le-chesne.png",{type:"image/png"});
        if(navigator.share && (!navigator.canShare || navigator.canShare({files:[fichier]}))){
            await navigator.share({files:[fichier],title:"Planning des gardes"});
            return;
        }
        const a=document.createElement("a");a.href=url;a.download="planning-gardes-cis-le-chesne.png";document.body.appendChild(a);a.click();a.remove();
        alert("Le planning a été téléchargé.");
    }catch(e){
        if(e?.name!=="AbortError") alert("Impossible d’enregistrer la photo : "+(e?.message||"erreur inconnue"));
    }
}

function ouvrirPlanningEquipeGrand(url){
    document.getElementById("planning-modal-equipe")?.remove();
    const div=document.createElement("div");div.id="planning-modal-equipe";div.className="planning-modal";
    div.innerHTML=`<div class="planning-modal-bar"><button type="button" onclick="document.getElementById('planning-modal-equipe')?.remove()">← Retour</button><button type="button" onclick="enregistrerPhotoPlanningEquipe('${url}')">Enregistrer la photo</button></div><div class="planning-modal-image"><img src="${url}" alt="Planning des gardes"></div>`;
    document.body.appendChild(div);
}

async function attendreConfirmationMenage() {
    let delai;
    try {
        return await Promise.race([
            synchroniserMenagesEnAttente(true),
            new Promise(resolve => { delai=setTimeout(() => resolve(false),3000); })
        ]);
    } finally { clearTimeout(delai); }
}
let validationMenageEnCours = false;
async function enregistrerMenageEquipe(){
    if(validationMenageEnCours)return;
    const statut=document.getElementById("garde-menage-statut");
    const bouton=document.querySelector(".garde-menage-enregistrer");
    const afficherStatut=(message,ok)=>{if(statut){statut.textContent=message;statut.className="garde-menage-statut "+(ok?"ok":"err");}};
    const travail=contexteMenageTravailActif();
    if(travail&&!travail.charge){afficherStatut('Attends la lecture des réalisations déjà enregistrées.',false);return;}
    const selectionZones=[...document.querySelectorAll('[data-garde-zone]:checked')].map(x=>x.value);
    const nouvellesZones=selectionZones.filter(z=>!travail?.zones?.has(z));
    const nouveauxPersonnels=[...document.querySelectorAll('[data-garde-personne]:checked')].map(x=>x.value).filter(id=>!travail?.personnes?.has(id));
    if(travail&&!nouvellesZones.length&&!nouveauxPersonnels.length){afficherStatut('Aucune nouvelle zone ni personne à ajouter.',false);return;}
    const zones=travail?(nouvellesZones.length?nouvellesZones:selectionZones):selectionZones;
    const personnes=personnesAvecAuteur([...document.querySelectorAll("[data-garde-personne]:checked")].map(x=>x.value));
    const duree=Number(document.getElementById("garde-menage-duree")?.value||0);
    if(!zones.length){afficherStatut("Sélectionne au moins une zone nettoyée.",false);return}
    if(!personnes.length){afficherStatut("Sélectionne au moins une personne présente.",false);return}
    if(![30,60,90].includes(duree)){afficherStatut("Sélectionne 30 min, 1 h ou 1 h 30.",false);return}
    const auteur = String(utilisateurConnecte?.id || "");
    if (!auteur || String(profilUtilisateurConnecte?.id || "") !== auteur) return;
    validationMenageEnCours=true;
    try{
        if(bouton){bouton.disabled=true;bouton.textContent="Enregistrement…"}
        afficherStatut("Enregistrement en cours…",true);
        const garde=travail?{date_debut:travail.date_garde,equipe:{id:travail.equipe_id}}:await chargerGardePourMenage(false);
        if (String(utilisateurConnecte?.id || "") !== auteur) throw new Error("La session a changé avant l'enregistrement.");
        const ligne={date_menage:new Date().toISOString(),date_garde:garde?.date_debut||dateISOlocale(vendrediReferenceGarde(new Date())),equipe_id:garde?.equipe?.id||null,zones_nettoyees:zones,personnes_presentes:personnes,duree_minutes:duree,enregistre_par:profilUtilisateurConnecte?.id||null};
        if(!menageProduitsCharges)throw new Error("Les produits ne sont pas chargés. Actualise la rubrique avant d’enregistrer.");
        const produits=[...document.querySelectorAll("[data-menage-vide]:checked")].map(x=>{
            const q=x.closest('[data-menage-produit]').querySelector('[data-menage-quantite]');
            const quantite=Number(q.value);
            if(q.value.trim()===''||!Number.isInteger(quantite)||quantite<1||quantite>Number(q.max))throw new Error("Quantité de produits vidés invalide ou supérieure au stock.");
            return {id:x.value,quantite};
        }).sort((a,b)=>a.id.localeCompare(b.id));
        const {date_menage:dateIgnoree,...saisieStable}=ligne;
        const signature=JSON.stringify([saisieStable,produits]);
        if(signature!==menageSaisieSignature){menageSaisieSignature=signature;menageSaisieCle=genererUUID();}
        const cleJournal = cleCacheMenage("envois");
        const journal = lireMenagesEnAttente();
        if (!journal.some(l=>l.cle===menageSaisieCle)) journal.push({cle:menageSaisieCle,ligne,produits});
        // Always persist before attempting the network, including a connection lost mid-send.
        localStorage.setItem(cleJournal, JSON.stringify(journal));
        const synchronise = await attendreConfirmationMenage();
        if (String(utilisateurConnecte?.id || "") !== auteur) return;
        menageSaisieCle=null;
        localStorage.removeItem(cleSelectionMenageGarde());
        document.querySelectorAll("[data-garde-zone],[data-garde-personne]").forEach(x=>x.checked=false);
        const dureeEl=document.getElementById("garde-menage-duree");if(dureeEl)dureeEl.value="";
        actualiserPlanMenageGarde();
        await animationValidationEnregistrementCIS(synchronise ? "Ménage enregistré" : "Ménage enregistré sur cet appareil — envoi automatique en attente", () => {if(travail){menageTravailContexte=null;CISTravail.retourFiche();}else afficherEspaceGarde();});
    }catch(e){
        console.error("Enregistrement ménage :",e);
        afficherStatut("Échec de l’enregistrement : "+(e?.message||"erreur inconnue"),false);
    }finally{
        validationMenageEnCours=false;
        if(bouton){bouton.disabled=false;bouton.textContent="Enregistrer la saisie"}
    }
}

function formaterDateMenageLongue(v){
    if(!v)return "Jamais";
    return new Date(v).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
}
function classeDateMenage(v){
    if(!v)return "garde-date-ancienne";
    const age=(Date.now()-new Date(v).getTime())/86400000;
    return age<30?"garde-date-recente":"garde-date-ancienne";
}
function htmlPlanMenageHistorique(zones){
    const z=new Set(zones||[]);
    const defs=[["pm-reunion","Salle de cour"],["pm-foyer","Foyer"],["pm-pmr","Toilettes PMR"],["pm-femme","Vestiaire femme"],["pm-homme","Vestiaire homme"],["pm-amical","Amical"],["pm-radio","Salle radio"],["pm-bureau","Bureau"],["pm-remise","Remise à engin"],["pm-vsav","Local VSAV"]];
    return `<div class="plan-menage-wrap"><div class="plan-menage plan-menage-detail"><img src="./plan-caserne.png" alt="Plan des zones nettoyées">${defs.map(([c,n])=>`<span class="plan-menage-zone ${c} ${z.has(n)?"actif":""}"></span>`).join("")}</div></div>`;
}

async function afficherAdminMenageEquipe(){
    if(!utilisateurAPermission("acces_admin_menage")){alert("Accès non autorisé.");return}
    initialiserStyleEspaceGardeUtilisateur();
    document.getElementById("app").innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="retourAdminRubriqueEquipe('menage')">← Retour</button><h1>Administration ménage</h1><div id="admin-menage-chargement" class="garde-planning-attente">Chargement…</div></main>${navigationPrincipale("","accueil")}`;
    actualiserInterfaceBureau();
    const supabase=obtenirClientSupabase();
    const hist=await chargerMetadonneesHistorique(() => supabase.from("menages_garde").select("id,date_menage,zones_nettoyees,personnes_presentes,duree_minutes").is("supprime_le",null).order("date_menage",{ascending:false}).order("id",{ascending:false}));
    if(!document.getElementById("admin-menage-chargement"))return;
    if(hist.error){document.getElementById("admin-menage-chargement").textContent="Historique ménage indisponible.";return}
    const rows=hist.data||[];
    if(!utilisateursEspaceGarde.length)utilisateursEspaceGarde=await chargerUtilisateursEspaceGarde();
    if(!document.getElementById("admin-menage-chargement"))return;
    const nom=id=>{const u=utilisateursEspaceGarde.find(x=>String(x.id)===String(id));return u?([u.prenom,u.nom].filter(Boolean).join(" ")||u.identifiant):"Utilisateur"};
    const zones=[...new Set([...ZONES_MENAGE_GARDE,...rows.flatMap(r=>r.zones_nettoyees||[])])];
    const zoneStats=zones.map(z=>{const r=rows.find(x=>(x.zones_nettoyees||[]).includes(z));return {z,date:r?.date_menage}});
    const presence=new Map();rows.forEach(r=>(r.personnes_presentes||[]).forEach(id=>presence.set(String(id),(presence.get(String(id))||0)+1)));
    const totalPresences=[...presence.values()].reduce((a,b)=>a+b,0);
    const personnes=[...presence.keys()];
    document.getElementById("app").innerHTML=`<main class="garde-section">
      <button class="retour-button" data-navigation-equipe onclick="retourAdminRubriqueEquipe('menage')">← Retour</button><h1>Administration ménage</h1>
      <h2 class="garde-sous-titre">Dernier nettoyage par zone</h2>
      ${zoneStats.map(s=>`<div class="garde-stat-ligne"><strong>${echapperHTML(s.z)}</strong><small class="${classeDateMenage(s.date)}">${s.date?formaterDateMenageLongue(s.date):"Jamais"}</small></div>`).join("")}
      <h2 class="garde-sous-titre">Présences</h2>
      ${personnes.sort((a,b)=>(presence.get(b)||0)-(presence.get(a)||0)).map(id=>{const n=presence.get(id)||0,p=totalPresences?Math.round(n/totalPresences*100):0;return `<div class="garde-stat-ligne garde-stat-ligne-flex"><div><strong>${echapperHTML(nom(id))}</strong><small>${n} participation${n>1?"s":""} au ménage</small></div><span class="garde-presence-pct">${p}%</span></div>`}).join("")||'<div class="garde-stat-ligne">Aucune présence enregistrée.</div>'}
      <h2 class="garde-sous-titre">Historique</h2>
      ${rows.length ? creerListeHistoriqueProgressive(rows, 10, lot => lot.map(r=>`<div class="garde-admin-card"><button onclick="afficherDetailMenageEquipe('${r.id}')"><strong>${new Date(r.date_menage).toLocaleString("fr-FR")}</strong><br><small>${(r.zones_nettoyees||[]).length} zone(s) · ${r.duree_minutes||0} min</small></button></div>`).join("")) : "<div>Aucun ménage enregistré.</div>"}
    </main>${navigationPrincipale("","accueil")}`;void initialiserListesHistoriquesProgressives();actualiserInterfaceBureau();window.scrollTo({top:0,behavior:"auto"});
}
const suppressionsMenagesEnCours=new Set();
async function supprimerMenageEquipe(id,bouton=null){
 if(!utilisateurAPermission('acces_admin_menage'))return alert('Accès non autorisé.');
 if(suppressionsMenagesEnCours.has(String(id)))return;
 if(!navigator.onLine)return alert('Une connexion Internet est nécessaire pour supprimer un ménage.');
 if(!await afficherConfirmationCIS('Supprimer ce ménage de l’historique ? Il sera également retiré des statistiques, des prochains PDF et du suivi des travaux de l’équipe.'))return;
 if(suppressionsMenagesEnCours.has(String(id)))return;
 suppressionsMenagesEnCours.add(String(id));if(bouton)bouton.disabled=true;
 try{
  const sb=obtenirClientSupabase();if(!sb)throw new Error('Connexion au serveur indisponible.');
  await obtenirSessionPrincipaleValide(sb);
  const {data,error}=await sb.rpc('menage_supprimer_admin',{p_id:id});if(error)throw error;
  if(!data?.supprime||String(data.id)!==String(id))throw new Error('Le serveur n’a pas confirmé la suppression.');
  try{localStorage.removeItem('cis_travail_equipe_v1:'+utilisateurConnecte.id);}catch(_){}
  await afficherAdminMenageEquipe();
 }catch(e){alert('Suppression impossible : '+(e.message||String(e)));}
 finally{suppressionsMenagesEnCours.delete(String(id));if(bouton?.isConnected)bouton.disabled=false;}
}

async function afficherDetailMenageEquipe(id){
    if(!utilisateurAPermission("acces_admin_menage"))return alert("Accès non autorisé.");
    initialiserStyleEspaceGardeUtilisateur();
    document.getElementById("app").innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="afficherAdminMenageEquipe()">← Retour</button><h1>Détail du ménage</h1><div id="detail-menage-chargement" class="garde-planning-attente">Chargement…</div></main>${navigationPrincipale("","accueil")}`;
    actualiserInterfaceBureau();
    const supabase=obtenirClientSupabase();const {data:r,error}=await supabase.from("menages_garde").select("*").is("supprime_le",null).eq("id",id).single();
    if(!document.getElementById("detail-menage-chargement"))return;
    if(error||!r){document.getElementById("detail-menage-chargement").textContent="Détail indisponible.";return}
    if(!utilisateursEspaceGarde.length)utilisateursEspaceGarde=await chargerUtilisateursEspaceGarde();
    if(!document.getElementById("detail-menage-chargement"))return;
    const nom=id=>{const u=utilisateursEspaceGarde.find(x=>String(x.id)===String(id));return u?([u.prenom,u.nom].filter(Boolean).join(" ")||u.identifiant):"Utilisateur"};
    document.getElementById("app").innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="afficherAdminMenageEquipe()">← Retour</button><h1>Détail du ménage</h1>
    ${htmlPlanMenageHistorique(r.zones_nettoyees||[])}
    <div class="garde-admin-card"><strong>Enregistrement créé par</strong><p>${echapperHTML(nom(r.enregistre_par))}</p><strong>Date</strong><p>${new Date(r.date_menage).toLocaleString("fr-FR")}</p><strong>Temps passé</strong><p>${r.duree_minutes||0} min</p><strong>Zones nettoyées</strong><p>${(r.zones_nettoyees||[]).map(echapperHTML).join(" · ")}</p><strong>Personnes présentes</strong><p>${(r.personnes_presentes||[]).map(x=>echapperHTML(nom(x))).join(" · ")}</p>${(r.produits_vides||[]).length?`<strong>Produits vidés</strong><p>${r.produits_vides.map(p=>echapperHTML(p.nom||"Produit")+" × "+Number(p.quantite)).join(" · ")}</p>`:""}<p><button type="button" class="garde-menage-enregistrer" style="background:#b5232c;color:#fff" data-supprimer-menage="${echapperHTML(r.id)}" onclick="supprimerMenageEquipe(this.dataset.supprimerMenage,this)">Supprimer ce ménage</button></p></div></main>${navigationPrincipale("","accueil")}`;
    actualiserInterfaceBureau();
}


/* Inventaires admin : même présentation et même autorisation que Ménage admin. */
let inventairesAdminCache=[];
const inventairesAdminDate=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?'Date inconnue':d.toLocaleString('fr-FR')};
const inventairesAdminZones=r=>Array.isArray(r.details)?r.details:[];
const inventairesAdminMateriels=r=>inventairesAdminZones(r).flatMap(z=>Array.isArray(z.materiels)?z.materiels:[]);
const inventairesAdminNom=r=>r.numero_inventaire!=null?'INV-'+String(r.numero_inventaire).padStart(6,'0'):'Inventaire '+String(r.id||'').slice(0,8);
function inventairesAdminAuteur(r){
 const u=utilisateursEspaceGarde.find(x=>String(x.id)===String(r.controle_par));
 return u?([u.prenom,u.nom].filter(Boolean).join(' ')||u.identifiant):'Utilisateur non identifié';
}
async function afficherAdminInventairesEquipe(){
 if(!utilisateurAPermission('acces_admin_menage')){alert('Accès non autorisé.');return;}
 initialiserStyleEspaceGardeUtilisateur();
 document.getElementById('app').innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="retourAdminRubriqueEquipe('vehicules')">← Retour</button><h1>Administration inventaires</h1><div id="admin-inventaires-chargement" class="garde-planning-attente">Chargement…</div></main>${navigationPrincipale('','accueil')}`;
 actualiserInterfaceBureau();
 const sb=obtenirClientSupabase();
 if(!sb){document.getElementById('admin-inventaires-chargement').textContent='Connexion indisponible.';return;}
 let resultat=await chargerMetadonneesHistorique(() => sb.from('cis_inventaires_vehicules').select('id,numero_inventaire,vehicule_nom,controle_par,personnes_presentes,participants_noms,created_at').order('created_at',{ascending:false}).order('id',{ascending:false}));
 if(resultat.error&&/numero_inventaire/i.test(resultat.error.message||''))resultat=await chargerMetadonneesHistorique(() => sb.from('cis_inventaires_vehicules').select('id,vehicule_nom,controle_par,personnes_presentes,participants_noms,created_at').order('created_at',{ascending:false}).order('id',{ascending:false}));
 if(!document.getElementById('admin-inventaires-chargement'))return;
 if(resultat.error){document.getElementById('admin-inventaires-chargement').textContent='Historique indisponible : '+resultat.error.message;return;}
 inventairesAdminCache=resultat.data||[];
 if(!utilisateursEspaceGarde.length){try{utilisateursEspaceGarde=await chargerUtilisateursEspaceGarde();}catch(e){console.warn('Noms des contrôleurs indisponibles',e);}}
 if(!document.getElementById('admin-inventaires-chargement'))return;
 const vehicules=[...new Set(inventairesAdminCache.map(r=>r.vehicule_nom).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
 document.getElementById('app').innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="retourAdminRubriqueEquipe('vehicules')">← Retour</button><h1>Administration inventaires</h1>
 <h2 class="garde-sous-titre">Matériels à surveiller / HS</h2><div id="inventaires-anomalies-actuelles" role="status">Chargement des signalements…</div> <h2 class="garde-sous-titre">Dernier inventaire par véhicule</h2>
 ${vehicules.map(v=>{const r=inventairesAdminCache.find(x=>x.vehicule_nom===v);return `<div class="garde-stat-ligne"><strong>${echapperHTML(v)}</strong><small class="${classeDateMenage(r.created_at)}">${inventairesAdminDate(r.created_at)}</small></div>`}).join('')||'<div class="garde-stat-ligne">Aucun inventaire enregistré.</div>'}
 <h2 class="garde-sous-titre">Contrôles réalisés</h2>
 ${(()=>{const counts=new Map();inventairesAdminCache.forEach(r=>{const id=String(r.controle_par||'');counts.set(id,(counts.get(id)||0)+1)});return [...counts.entries()].sort((a,b)=>b[1]-a[1]).map(([id,n])=>{const r=inventairesAdminCache.find(x=>String(x.controle_par||'')===id);return `<div class="garde-stat-ligne garde-stat-ligne-flex"><div><strong>${echapperHTML(inventairesAdminAuteur(r))}</strong><small>${n} inventaire${n>1?'s':''} réalisé${n>1?'s':''}</small></div></div>`}).join('')})()||'<div class="garde-stat-ligne">Aucun contrôle enregistré.</div>'}
 <h2 class="garde-sous-titre">Historique</h2><div class="garde-admin-card"><label for="inventaires-admin-filtre"><strong>Véhicule</strong></label><select id="inventaires-admin-filtre" class="heures-input" onchange="filtrerAdminInventairesEquipe()"><option value="">Tous les véhicules</option>${vehicules.map(v=>`<option value="${echapperHTML(v)}">${echapperHTML(v)}</option>`).join('')}</select></div>
 <div id="inventaires-admin-liste"></div></main>${navigationPrincipale('','accueil')}`;
 void chargerAnomaliesAdminPrincipal();
 actualiserInterfaceBureau();filtrerAdminInventairesEquipe();window.scrollTo({top:0,behavior:'auto'});
}
async function chargerAnomaliesAdminPrincipal(){
 const box=document.getElementById('inventaires-anomalies-actuelles');if(!box||!utilisateurAPermission('acces_admin_menage'))return;
 const auteur=String(utilisateurConnecte?.id||'');let timer;box.textContent='Chargement des signalements…';
 try{const r=await Promise.race([obtenirClientSupabase().rpc('inventaires_anomalies',{p_vehicule:null}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Le serveur ne répond pas.')),10000)})]);if(!box.isConnected||String(utilisateurConnecte?.id||'')!==auteur)return;if(r.error)throw Error(r.error.message);
 box.innerHTML=(r.data||[]).map(a=>`<article class="garde-admin-card" style="background:${a.etat==='hs'?'#ffe1e1':'#fff0b3'}!important;color:#38251e!important;border:2px solid ${a.etat==='hs'?'#bc2525':'#bc8d13'}"><strong style="color:inherit!important">${echapperHTML(a.vehicule_nom)} · ${echapperHTML(a.zone_nom)} · ${echapperHTML(a.nom)}</strong><p style="color:inherit!important;font-weight:800">${a.etat==='hs'?'HS':'À surveiller'}</p>${a.observation?`<p style="color:inherit!important">${echapperHTML(a.observation)}</p>`:''}<small style="color:inherit!important">Dernier signalement : ${echapperHTML(new Date(a.date).toLocaleString('fr-FR'))}</small></article>`).join('')||'<p>Aucun matériel signalé à surveiller ou HS.</p>';
 }catch(e){if(!box.isConnected||String(utilisateurConnecte?.id||'')!==auteur)return;box.textContent='Signalements indisponibles : '+e.message;const b=document.createElement('button');b.type='button';b.className='equipe-action-button';b.textContent='Réessayer';b.onclick=chargerAnomaliesAdminPrincipal;box.appendChild(b);}finally{clearTimeout(timer);}
}
function filtrerAdminInventairesEquipe(){
 const liste=document.getElementById('inventaires-admin-liste');if(!liste)return;
 const filtre=document.getElementById('inventaires-admin-filtre')?.value||'';
 for(const option of document.querySelectorAll('#inventaires-admin-filtre option'))option.toggleAttribute('selected',option.value===filtre);
 const rows=inventairesAdminCache.filter(r=>!filtre||r.vehicule_nom===filtre);
 liste.innerHTML=rows.length ? creerListeHistoriqueProgressive(rows, 10, cartesInventairesProgressives) : '<div class="garde-stat-ligne">Aucun inventaire pour ce véhicule.</div>';
 void initialiserListesHistoriquesProgressives(liste);
}
async function cartesInventairesProgressives(lot){
 if(!utilisateurAPermission('acces_admin_menage'))throw new Error('Accès non autorisé.');
 const sb=obtenirClientSupabase();if(!sb)throw new Error('Connexion indisponible.');
 // Les gros détails des coffres et du matériel sont lus pour ce lot uniquement.
 const {data,error}=await sb.from('cis_inventaires_vehicules').select('id,details').in('id',lot.map(r=>r.id));
 if(error)throw error;
 const parId=new Map((data||[]).map(r=>[String(r.id),r]));
 const lignes=lot.filter(r=>parId.has(String(r.id))).map(r=>({...r,...parId.get(String(r.id))}));
 const enrichies=new Map(lignes.map(r=>[String(r.id),r]));
 inventairesAdminCache=inventairesAdminCache.map(r=>enrichies.get(String(r.id))||r);
 return lignes.map(r=>{const materiels=inventairesAdminMateriels(r),bon=materiels.filter(m=>m.etat==='bon').length,surv=materiels.filter(m=>m.etat==='a_surveiller').length,hs=materiels.filter(m=>m.etat==='hs').length;return `<div class="garde-admin-card"><button type="button" onclick="afficherDetailInventaireAdminEquipe('${echapperHTML(String(r.id))}')"><strong>${echapperHTML(inventairesAdminNom(r))} · ${echapperHTML(r.vehicule_nom||'Véhicule')}</strong><br><small class="${classeDateMenage(r.created_at)}">${inventairesAdminDate(r.created_at)}</small> · <small>${echapperHTML(inventairesAdminAuteur(r))}</small><br><small>${inventairesAdminZones(r).length} zone(s) · ${bon} Bon · ${surv} À surveiller · ${hs} HS</small></button></div>`}).join('');
}
function initialiserStyleEtatsInventaireAdmin(){
 if(document.getElementById('style-etats-inventaire-admin'))return;
 const style=document.createElement('style');style.id='style-etats-inventaire-admin';
 style.textContent=`#app .inventaire-etat{display:inline-block;margin-top:7px;padding:4px 9px;border:1px solid transparent;border-radius:7px;font-size:13px;font-weight:800;line-height:1.4}#app .inventaire-etat-bon{background:#dff5e7;color:#07532b;border-color:#8dc7a3}#app .inventaire-etat-a_surveiller{background:#fff0c2;color:#7a4b00;border-color:#d8b45b}#app .inventaire-etat-hs{background:#ffe2e2;color:#8b1c1c;border-color:#df9999}#app .inventaire-etat-inconnu{background:#e7ebef;color:#505c68;border-color:#b9c2cc}`;
 document.head.appendChild(style);
}

async function afficherDetailInventaireAdminEquipe(id){
 if(!utilisateurAPermission('acces_admin_menage')){alert('Accès non autorisé.');return;}
 let r=inventairesAdminCache.find(x=>String(x.id)===String(id));
 // Un retour du profil peut restaurer une carte dont le détail n'est plus en cache.
 if(!r||!Array.isArray(r.details)){
  try{
   const {data,error}=await obtenirClientSupabase().from('cis_inventaires_vehicules').select('*').eq('id',id).single();
   if(error||!data)throw error||new Error('Inventaire introuvable.');
   r=data;inventairesAdminCache=inventairesAdminCache.filter(x=>String(x.id)!==String(id)).concat([r]);
  }catch(erreur){alert('Détail indisponible : '+(erreur?.message||'Réessaie dans un instant.'));return;}
 }
 initialiserStyleEspaceGardeUtilisateur();initialiserStyleEtatsInventaireAdmin();
 const zones=inventairesAdminZones(r),materiels=inventairesAdminMateriels(r);
 const etat=m=>m.etat==='bon'?'Bon':m.etat==='a_surveiller'?'À surveiller':m.etat==='hs'?'HS':'Non renseigné';
 document.getElementById('app').innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="afficherAdminInventairesEquipe()">← Retour</button><h1>Détail de l’inventaire</h1>
 <div class="garde-admin-card"><strong>${echapperHTML(inventairesAdminNom(r))}</strong><p><strong>Véhicule :</strong> ${echapperHTML(r.vehicule_nom||'Non renseigné')}</p><p><strong>Date :</strong> <span class="${classeDateMenage(r.created_at)}">${inventairesAdminDate(r.created_at)}</span></p><p><strong>Enregistré par :</strong> ${echapperHTML(inventairesAdminAuteur(r))}</p><p><strong>Réalisé par :</strong> ${echapperHTML(nomsParticipantsInventaire(r))}</p><p><strong>Zones contrôlées :</strong> ${zones.length}</p><p><strong>Matériel :</strong> ${materiels.filter(m=>m.etat==='bon').length} Bon · ${materiels.filter(m=>m.etat==='a_surveiller').length} À surveiller · ${materiels.filter(m=>m.etat==='hs').length} HS</p></div>
 ${zones.map(z=>z.type==='annexe'?CISTechnique.resumeAnnexe(z):z.type==='technique'?CISTechnique.resume(z):`<h2 class="garde-sous-titre">${echapperHTML(z.zone_nom||'Zone')}</h2>${(Array.isArray(z.materiels)?z.materiels:[]).map(m=>`<div class="garde-stat-ligne"><strong>${echapperHTML(m.nom||'Matériel')} × ${Number(m.quantite)||1}${m.quantite_constatee!=null&&Number(m.quantite_constatee)!==Number(m.quantite)?` <span style="color:#b42323;font-weight:900">— QUANTITÉ CONSTATÉE : ${Number(m.quantite_constatee)} (prévu : ${Number(m.quantite)})</span>`:''}</strong><small class="inventaire-etat inventaire-etat-${['bon','a_surveiller','hs'].includes(m.etat)?m.etat:'inconnu'}">${echapperHTML(etat(m))}</small>${m.observation?`<p>Observation : ${echapperHTML(m.observation)}</p>`:''}</div>`).join('')||'<div class="garde-stat-ligne">Aucun matériel.</div>'}`).join('')||'<div class="garde-stat-ligne">Aucune zone enregistrée.</div>'}
 </main>${navigationPrincipale('','accueil')}`;
 actualiserInterfaceBureau();window.scrollTo({top:0,behavior:'auto'});
}
window.afficherAdminInventairesEquipe=afficherAdminInventairesEquipe;
window.filtrerAdminInventairesEquipe=filtrerAdminInventairesEquipe;
window.afficherDetailInventaireAdminEquipe=afficherDetailInventaireAdminEquipe;

let personnesHeuresSelectionnees=new Set();
let personnesHeuresCache=[];
function libelleDureeHeures(minutes){const h=Math.floor(minutes/60),m=minutes%60;return h?`${h}h${m?String(m).padStart(2,"0"):"00"}`:`${m} min`}
function nomPersonnelHeures(u){return [u?.prenom,u?.nom].filter(Boolean).join(" ")||u?.identifiant||"Utilisateur"}
function actualiserPersonnesHeures(){
 const zone=document.getElementById("heures-personnes-selectionnees");if(!zone)return;
 zone.innerHTML=[...personnesHeuresSelectionnees].map(id=>{const u=personnesHeuresCache.find(x=>String(x.id)===String(id));const obligatoire=String(id)===String(profilUtilisateurConnecte?.id);return `<span class="heures-chip">${echapperHTML(nomPersonnelHeures(u))}${obligatoire?' <small>(toi)</small>':` <button type="button" onclick="retirerPersonneHeures('${id}')">×</button>`}</span>`}).join("");
}
function rechercherPersonnesHeures(){
 const q=(document.getElementById("heures-recherche")?.value||"").trim().toLocaleLowerCase("fr");const box=document.getElementById("heures-resultats");if(!box)return;
 if(!q){box.innerHTML="";box.classList.remove("ouvert");return}
 const r=personnesHeuresCache.filter(u=>!personnesHeuresSelectionnees.has(String(u.id))&&nomPersonnelHeures(u).toLocaleLowerCase("fr").includes(q)).slice(0,8);
 box.innerHTML=r.length?r.map(u=>`<button type="button" class="heures-resultat" onclick="ajouterPersonneHeures('${u.id}')">${echapperHTML(nomPersonnelHeures(u))}</button>`).join(""):`<div class="heures-vide">Aucune personne trouvée.</div>`;box.classList.add("ouvert");
}
function ajouterPersonneHeures(id){personnesHeuresSelectionnees.add(String(id));const i=document.getElementById("heures-recherche");if(i)i.value="";const b=document.getElementById("heures-resultats");if(b){b.innerHTML="";b.classList.remove("ouvert")}actualiserPersonnesHeures()}
function retirerPersonneHeures(id){if(String(id)===String(profilUtilisateurConnecte?.id))return;personnesHeuresSelectionnees.delete(String(id));actualiserPersonnesHeures()}
function verifierMotifHeures(){const s=document.getElementById("heures-motif"),d=document.getElementById("heures-details");if(!s||!d)return;const opt=s.options[s.selectedIndex];const autre=opt?.dataset?.autre==="1";d.required=autre;d.placeholder=autre?"Détail obligatoire pour le motif Autre":"Détails (facultatif)"}
async function afficherEnregistrerHeuresEquipe(){
 initialiserStyleEspaceGardeUtilisateur();document.getElementById("app").innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="retourSaisieEquipe('heures')">← Retour</button><h1>Enregistrer des heures</h1><div class="garde-planning-attente">Chargement…</div></main>${navigationPrincipale("","accueil")}`;actualiserInterfaceBureau();
 const sb=obtenirClientSupabase();const [motifs,personnes]=await Promise.all([sb.from("motifs_heures").select("id,nom,est_autre").eq("actif",true).order("nom"),chargerUtilisateursEspaceGarde()]);
 if(!document.querySelector('.garde-section'))return;if(motifs.error){alert("Impossible de charger les motifs : "+motifs.error.message);return}
 personnesHeuresCache=personnes||[];personnesHeuresSelectionnees=new Set([String(profilUtilisateurConnecte?.id)]);
 const durees=[];for(let m=30;m<=720;m+=30)durees.push(`<option value="${m}">${libelleDureeHeures(m)}</option>`);
 document.getElementById("app").innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="retourSaisieEquipe('heures')">← Retour</button><h1>Enregistrer des heures</h1>
 <div class="heures-form"><label><strong>Personnes concernées</strong></label><div id="heures-personnes-selectionnees" class="heures-chips"></div><div class="heures-recherche-wrap"><input id="heures-recherche" class="heures-input" placeholder="Écris les premières lettres d’un nom…" oninput="rechercherPersonnesHeures()" autocomplete="off"><div id="heures-resultats" class="heures-resultats"></div></div>
 <label><strong>Motif</strong><select id="heures-motif" class="heures-input" onchange="verifierMotifHeures()">${(motifs.data||[]).map(m=>`<option value="${m.id}" data-autre="${m.est_autre?1:0}">${echapperHTML(m.nom)}</option>`).join("")}</select></label>
 <label><strong>Durée</strong><select id="heures-duree" class="heures-input">${durees.join("")}</select></label>
 <label><strong>Détails</strong><textarea id="heures-details" class="heures-input" rows="4" placeholder="Détails (facultatif)"></textarea></label>
 <button type="button" class="garde-menage-enregistrer" onclick="enregistrerHeuresEquipe()">Enregistrer les heures</button><div id="heures-statut" class="garde-menage-statut"></div></div></main>${navigationPrincipale("","accueil")}`;actualiserInterfaceBureau();actualiserPersonnesHeures();verifierMotifHeures();window.scrollTo({top:0,behavior:"auto"});
}
async function enregistrerHeuresEquipe(){
 const st=document.getElementById("heures-statut"),btn=document.querySelector(".garde-menage-enregistrer"),motif=document.getElementById("heures-motif"),details=(document.getElementById("heures-details")?.value||"").trim(),duree=Number(document.getElementById("heures-duree")?.value||0);const autre=motif?.options[motif.selectedIndex]?.dataset?.autre==="1";
 if(autre&&!details){if(st){st.textContent="Le détail est obligatoire avec le motif Autre.";st.className="garde-menage-statut err"}return}
 try{btn.disabled=true;btn.textContent="Enregistrement…";const sb=obtenirClientSupabase();const ids=[...personnesHeuresSelectionnees];if(!ids.includes(String(profilUtilisateurConnecte?.id)))ids.unshift(String(profilUtilisateurConnecte.id));const {error}=await sb.from("heures_equipe").insert({enregistre_par:profilUtilisateurConnecte.id,motif_id:motif.value,duree_minutes:duree,details:details||null,personnes_concernees:ids});if(error)throw error;await animationValidationEnregistrementCIS("Heures enregistrées", () => afficherEspaceGarde())}catch(e){st.textContent="Échec : "+(e?.message||"erreur inconnue");st.className="garde-menage-statut err"}finally{if(btn){btn.disabled=false;btn.textContent="Enregistrer les heures"}}
}
async function afficherHistoriqueHeuresEquipe(){
 if(!utilisateurAPermission("acces_admin_heures")){alert("Accès non autorisé.");return}initialiserStyleEspaceGardeUtilisateur();document.getElementById("app").innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="retourAdminRubriqueEquipe('heures')">← Retour</button><h1>Historique des heures</h1><button type="button" class="equipe-action-button" onclick="afficherChoixPDFEquipe('heures')">Télécharger le PDF des heures</button><div id="heures-hist" class="garde-planning-attente">Chargement…</div></main>${navigationPrincipale("","accueil")}`;actualiserInterfaceBureau();
 const sb=obtenirClientSupabase();const {data,error}=await sb.from("heures_equipe").select("id,created_at,duree_minutes,details,enregistre_par,personnes_concernees,motifs_heures(nom)").order("created_at",{ascending:false});if(!error){try{data.push(...await chargerHeuresTravailEquipe());data.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));}catch(e){document.getElementById("heures-hist").textContent=e.message;return;}}if(error){document.getElementById("heures-hist").textContent="Historique indisponible : "+error.message;return}if(!utilisateursEspaceGarde.length)utilisateursEspaceGarde=await chargerUtilisateursEspaceGarde();const nom=id=>nomPersonnelHeures(utilisateursEspaceGarde.find(x=>String(x.id)===String(id)));
 document.getElementById("heures-hist").outerHTML=`<div>${(data||[]).map(r=>`<div class="garde-admin-card"><strong>${new Date(r.created_at).toLocaleString("fr-FR")}</strong><p><b>${echapperHTML(r.motifs_heures?.nom||"Motif")}</b> · ${libelleDureeHeures(r.duree_minutes)}</p><p>${r.participants_noms?.length?r.participants_noms.map(p=>echapperHTML(nomPersonnelHeures(p))).join(" · "):(r.personnes_concernees||[]).map(id=>echapperHTML(nom(id))).join(" · ")}</p>${r.details?`<p>${echapperHTML(r.details)}</p>`:""}<small>Enregistré par ${echapperHTML(r.auteur_nom||nom(r.enregistre_par))}</small><p><button type="button" class="equipe-action-button" onclick="exporterEquipePDF('heures','${echapperHTML(String(r.id))}')">Télécharger le PDF</button></p></div>`).join("")||"Aucune heure enregistrée."}</div>`;
}
window.afficherEnregistrerHeuresEquipe=afficherEnregistrerHeuresEquipe;window.enregistrerHeuresEquipe=enregistrerHeuresEquipe;window.rechercherPersonnesHeures=rechercherPersonnesHeures;window.ajouterPersonneHeures=ajouterPersonneHeures;window.retirerPersonneHeures=retirerPersonneHeures;window.verifierMotifHeures=verifierMotifHeures;window.afficherHistoriqueHeuresEquipe=afficherHistoriqueHeuresEquipe;

window.ouvrirPlanningEquipeGrand=ouvrirPlanningEquipeGrand;
window.enregistrerPhotoPlanningEquipe=enregistrerPhotoPlanningEquipe;
window.enregistrerMenageEquipe=enregistrerMenageEquipe;
window.afficherAdminMenageEquipe=afficherAdminMenageEquipe;
window.afficherDetailMenageEquipe=afficherDetailMenageEquipe;
window.retourAccueilDepuisEspaceEquipe=retourAccueilDepuisEspaceEquipe;
window.afficherEspaceGarde=afficherEspaceGarde;
window.afficherMenageEspaceGarde=afficherMenageEspaceGarde;
window.afficherInventaireVehiculeEspaceGarde=afficherInventaireVehiculeEspaceGarde;
window.afficherPlanningEspaceGarde=afficherPlanningEspaceGarde;
window.sauvegarderSelectionMenageGarde=sauvegarderSelectionMenageGarde;
window.basculerZoneDepuisPlanGarde=basculerZoneDepuisPlanGarde;


/* ===== TRAÇABILITÉ PHARMACIE : Meducore / VSAV ===== */
function cleSignaturePharmacieCache(userId) {
    return "cis_signature_pharmacie_v1:" + userId;
}
function lireSignaturePharmacieCache(userId) {
    if (!userId) return null;
    return localStorage.getItem(cleSignaturePharmacieCache(userId)) || null;
}
async function chargerSignaturePharmacie() {
    const proprietaire = String(utilisateurConnecte?.id || "");
    if (!proprietaire) throw new Error("Session indisponible");
    if (!navigator.onLine) return lireSignaturePharmacieCache(proprietaire);
    const sb = obtenirClientSupabase();
    if (!sb) throw new Error("Session indisponible");
    const {data,error}=await sb.from("cis_signatures_spv").select("signature_png").eq("user_id",proprietaire).maybeSingle();
    if(error) throw error;
    const signature = data?.signature_png || null;
    if (signature) localStorage.setItem(cleSignaturePharmacieCache(proprietaire), signature);
    else localStorage.removeItem(cleSignaturePharmacieCache(proprietaire));
    return signature;
}

const CLE_CONTROLES_PHARMACIE_EN_ATTENTE = "cis_controles_pharmacie_en_attente_v1";
function lireControlesPharmacieEnAttente() {
    // Never silently overwrite a corrupt journal.
    const liste = JSON.parse(localStorage.getItem(CLE_CONTROLES_PHARMACIE_EN_ATTENTE) || "[]");
    if (!Array.isArray(liste)) throw new Error("La sauvegarde locale des contrôles est illisible");
    return liste;
}
function mettreControlesPharmacieEnAttente(c) {
    if (!c.meducore && !c.vsav) return;
    const proprietaire = String(utilisateurConnecte?.id || "");
    if (!proprietaire) throw new Error("Non connecté");
    const lignes = lireControlesPharmacieEnAttente();
    const nom = [profilUtilisateurConnecte?.prenom, profilUtilisateurConnecte?.nom].filter(Boolean).join(" ").trim();
    for (const type of ["meducore", "vsav"]) {
        if (!c[type] || lignes.some(l => l.user_id === proprietaire && l.intervention_ref === c.interventionId && l.type_controle === type)) continue;
        lignes.push({id:genererUUID(),type_controle:type,intervention_ref:c.interventionId,
            date_intervention:c.date,numero_intervention:c.numero,user_id:proprietaire,
            agent_nom:nom,signature_png:type === "vsav" ? c.signature : null,
            created_at:new Date().toISOString()});
    }
    localStorage.setItem(CLE_CONTROLES_PHARMACIE_EN_ATTENTE, JSON.stringify(lignes));
}
function texteStatutControlesPharmacie() {
    const lignes = lireControlesPharmacieEnAttente().filter(c => c.user_id === String(utilisateurConnecte?.id || ""));
    if (!lignes.length) return "";
    const signatureManquante = lignes.some(c => c.type_controle === "vsav" && !c.signature_png);
    return lignes.length + " contrôle(s) conservé(s) sur cet appareil, en attente d’envoi automatique." +
        (signatureManquante ? " La signature VSAV sera recherchée à la reconnexion. Si elle n’est pas encore enregistrée, ajoute-la dans Mon profil." : "");
}
function actualiserStatutControlesPharmacie() {
    const zone = document.getElementById("statut-controles-pharmacie");
    if (zone) zone.textContent = texteStatutControlesPharmacie();
}
let envoiControlesPharmacieEnCours = null;
async function synchroniserControlesPharmacieEnAttente() {
    if (envoiControlesPharmacieEnCours) return envoiControlesPharmacieEnCours;
    const demande = envoyerControlesPharmacieEnAttente();
    envoiControlesPharmacieEnCours = demande;
    try { return await demande; } finally { envoiControlesPharmacieEnCours = null; }
}
async function envoyerControlesPharmacieEnAttente() {
    if (!navigator.onLine || !utilisateurConnecte?.id) return;
    const proprietaire = String(utilisateurConnecte.id);
    const lignes = lireControlesPharmacieEnAttente().filter(c => c.user_id === proprietaire);
    if (!lignes.length) return;
    const sb = obtenirClientSupabase();
    if (!sb) throw new Error("Serveur indisponible");
    const session = await obtenirSessionPrincipaleValide(sb);
    if (String(session.user?.id || "") !== proprietaire) throw new Error("Session différente de l’agent des contrôles");
    let erreurSignature = null;
    const retoursConfirmes = new Set();
    for (const ligne of lignes) {
        if (String(utilisateurConnecte?.id || "") !== proprietaire) throw new Error("Utilisateur modifié pendant l’envoi");
        if (!retoursConfirmes.has(ligne.intervention_ref)) {
            const retour = await sb.from("interventions").select("id").eq("id",ligne.intervention_ref).maybeSingle();
            if (retour.error) throw retour.error;
            if (!retour.data) throw new Error("Le retour associé doit être synchronisé avant ses contrôles");
            retoursConfirmes.add(ligne.intervention_ref);
        }
        if (ligne.type_controle === "vsav" && !ligne.signature_png) {
            ligne.signature_png = await chargerSignaturePharmacie();
            if (!ligne.signature_png) {
                erreurSignature = new Error("Enregistre ta signature dans Mon profil pour envoyer l’entretien VSAV en attente");
                continue;
            }
            const journal = lireControlesPharmacieEnAttente().map(c => c.id === ligne.id ? ligne : c);
            localStorage.setItem(CLE_CONTROLES_PHARMACIE_EN_ATTENTE, JSON.stringify(journal));
        }
        // A fixed UUID survives retries, including a lost server acknowledgement.
        const {error} = await sb.from("cis_controles_pharmacie")
            .upsert(ligne, {onConflict:"id", ignoreDuplicates:true});
        if (error) throw error;
        // Re-read so a control queued in the meantime cannot be erased.
        localStorage.setItem(CLE_CONTROLES_PHARMACIE_EN_ATTENTE,
            JSON.stringify(lireControlesPharmacieEnAttente().filter(c => c.id !== ligne.id)));
    }
    actualiserStatutControlesPharmacie();
    if (erreurSignature) throw erreurSignature;
}
async function ouvrirSignaturePharmacie() {
    const ancien=document.getElementById("cis-signature-modal");if(ancien)ancien.remove();
    const overlay=document.createElement("div");overlay.id="cis-signature-modal";
    overlay.style.cssText="position:fixed;inset:0;z-index:300000;background:#0009;display:grid;place-items:center;padding:15px";
    overlay.innerHTML=`<div style="background:white;color:#202428;border-radius:18px;padding:18px;width:min(95vw,540px);box-sizing:border-box"><h3>✍️ Ma signature</h3><p>Signe avec ton doigt dans le cadre.</p><canvas id="cis-signature-canvas" style="width:100%;height:190px;background:#fff;border:2px solid #aab;border-radius:10px;touch-action:none"></canvas><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button id="cis-signature-effacer">Effacer</button><button id="cis-signature-enregistrer">Enregistrer</button><button id="cis-signature-fermer">Annuler</button></div><p id="cis-signature-info" role="status"></p></div>`;
    document.body.appendChild(overlay);
    const canvas=overlay.querySelector("canvas"),ctx=canvas.getContext("2d");
    canvas.width=900;canvas.height=320;ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#18232e";
    let dessin=false,trace=false;
    const position=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}};
    canvas.addEventListener("pointerdown",e=>{e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=position(e);ctx.beginPath();ctx.moveTo(p.x,p.y);dessin=true;});
    canvas.addEventListener("pointermove",e=>{if(!dessin)return;e.preventDefault();const p=position(e);ctx.lineTo(p.x,p.y);ctx.stroke();trace=true;});
    canvas.addEventListener("pointerup",()=>{dessin=false;});canvas.addEventListener("pointercancel",()=>{dessin=false;});
    overlay.querySelector("#cis-signature-effacer").onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);trace=false;};
    overlay.querySelector("#cis-signature-fermer").onclick=()=>overlay.remove();
    try {const existante=await chargerSignaturePharmacie();if(existante){const img=new Image();img.onload=()=>{ctx.drawImage(img,0,0,canvas.width,canvas.height);trace=true;};img.src=existante;}}catch(e){overlay.querySelector("#cis-signature-info").textContent=e.message;}
    overlay.querySelector("#cis-signature-enregistrer").onclick=async()=>{
        if(!trace){overlay.querySelector("#cis-signature-info").textContent="Signe avant d’enregistrer.";return;}
        const btn=overlay.querySelector("#cis-signature-enregistrer");btn.disabled=true;
        try{const sb=obtenirClientSupabase();const session=await obtenirSessionPrincipaleValide(sb);if(String(session.user?.id)!==String(utilisateurConnecte?.id))throw new Error("La session ne correspond pas au profil");const {error}=await sb.from("cis_signatures_spv").upsert({user_id:session.user.id,signature_png:canvas.toDataURL("image/png"),updated_at:new Date().toISOString()},{onConflict:"user_id"});if(error)throw error;localStorage.setItem(cleSignaturePharmacieCache(String(utilisateurConnecte.id)),canvas.toDataURL("image/png"));overlay.remove();reprendreHorsConnexionMaintenant();alert("Signature enregistrée.");}
        catch(e){overlay.querySelector("#cis-signature-info").textContent="Échec : "+e.message;btn.disabled=false;}
    };
}


const CAPACITE_CONTROLES_PHARMACIE={meducore:14,vsav:16};
let archivesControlesPharmacie={meducore:[],vsav:[]};
async function afficherArchivesControlesPharmacie(){
 if(!utilisateurPeutExporterPharmaciePDF()){alert("Accès réservé aux administrateurs pharmacie.");return;}
 document.getElementById("app").innerHTML=`<main class="page navigation-fixe-page"><button class="retour-button" onclick="ouvrirAdministration()">← Retour</button><h2>Traçabilité pharmacie</h2><p>Contrôles du Meducore et entretiens du VSAV — feuilles distinctes et conservées.</p><div id="archives-controles-pharmacie">Chargement…</div></main>${navigationPrincipale("pharmacie","pharmacie")}`;
 const sb=obtenirClientSupabase();const {data,error}=await sb.from("cis_controles_pharmacie").select("id,type_controle,date_intervention,numero_intervention,agent_nom,signature_png,created_at").order("created_at",{ascending:true}).limit(10000);
 const zone=document.getElementById("archives-controles-pharmacie");if(!zone)return;
 if(error){zone.textContent="Impossible de charger les archives : "+error.message;return;}
 archivesControlesPharmacie={meducore:[],vsav:[]};
 for(const type of ["meducore","vsav"]){const lignes=(data||[]).filter(v=>v.type_controle===type);for(let i=0;i<lignes.length;i+=CAPACITE_CONTROLES_PHARMACIE[type])archivesControlesPharmacie[type].push(lignes.slice(i,i+CAPACITE_CONTROLES_PHARMACIE[type]));}
 zone.innerHTML=["meducore","vsav"].map(type=>`<section class="profil-carte" style="margin:16px 0;padding:15px"><h3>${type==="meducore"?"Contrôles du Meducore":"Entretiens du VSAV"}</h3>${archivesControlesPharmacie[type].length?archivesControlesPharmacie[type].map((p,i)=>`<div style="padding:12px 0;border-bottom:1px solid #ddd"><strong>Feuille ${i+1}</strong><div>Du ${echapperHTML(p[0].date_intervention)} au ${echapperHTML(p[p.length-1].date_intervention)} — ${p.length} ligne(s)</div><button type="button" class="profil-bouton-principal" onclick="exporterControlePharmaciePDF('${type}',${i})">Télécharger le PDF</button></div>`).join(""):"Aucune feuille enregistrée."}</section>`).join("");
}
async function bibliothequePDFControlesPharmacie(){
 if(window.PDFLib)return window.PDFLib;
 await new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";s.onload=resolve;s.onerror=()=>reject(new Error("Bibliothèque PDF inaccessible"));document.head.appendChild(s)});
 return window.PDFLib;
}

/* Placement mesuré sur les modèles A4 officiels (coordonnées PDF en points). */
async function remplirLignesControlesPharmacie(pdf, lignes, type, lib) {
 const page=pdf.getPages()[0];
 const font=await pdf.embedFont(lib.StandardFonts.HelveticaBold);
 const ink=lib.rgb(0,0,0);
 function texte(valeur, x, baselineTop, largeur, taille=10, minimum=7.3) {
  let contenu=String(valeur??"").trim();
  if(!contenu)return;
  while(taille>minimum && font.widthOfTextAtSize(contenu,taille)>largeur)taille-=0.25;
  if(font.widthOfTextAtSize(contenu,taille)>largeur){
   while(contenu.length>1 && font.widthOfTextAtSize(contenu+"...",taille)>largeur)contenu=contenu.slice(0,-1);
   contenu+="...";
  }
  page.drawText(contenu,{x,y:page.getHeight()-baselineTop,size:taille,font,color:ink});
 }
 async function signatureVisible(dataURL) {
  const image=new Image();image.src=dataURL;
  await new Promise((ok,ko)=>{image.onload=ok;image.onerror=ko;});
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
  // Conserve les traits de la signature et les rend noirs, plus lisibles sur papier.
  for(let j=0;j<pixels.data.length;j+=4){
   const a=pixels.data[j+3];
   if(a<18 || (pixels.data[j]>245 && pixels.data[j+1]>245 && pixels.data[j+2]>245)){
    pixels.data[j+3]=0;continue;
   }
   pixels.data[j]=0;pixels.data[j+1]=0;pixels.data[j+2]=0;
   pixels.data[j+3]=Math.min(255,Math.round(a*1.65));
  }
  ctx.putImageData(pixels,0,0);
  return pdf.embedPng(canvas.toDataURL('image/png'));
 }
 for(let i=0;i<lignes.length;i++){
  const v=lignes[i];
  const date=String(v.date_intervention||"").split('-').reverse().join('/');
  if(type==='meducore'){
   // Colonnes : date 50–185 ; agent 185–352 ; contexte 352–585.
   const baseline=244+i*40.42;
   texte(date,58,baseline,116,10);
   texte(v.agent_nom,194,baseline,148,10.5);
   // Après le « Suite intervention N° » déjà imprimé dans le modèle.
   texte(v.numero_intervention,473,baseline+1,104,9.2,7);
  }else{
   // Colonnes : date 39–133 ; agent 133–229 ; signature 229–322 ; retour 322–415.
   const baseline=293+i*29.06;
   texte(date,44,baseline,83,9.2,7.4);
   texte(v.agent_nom,139,baseline,84,9.3,7);
   texte('X',365,baseline+1,22,14);
   if(v.signature_png){
    try{
     const png=await signatureVisible(v.signature_png);
     const dimensions=png.scaleToFit(84,24);
     const x=229+(93.5-dimensions.width)/2;
     const centreY=274+i*29.06+14.53;
     page.drawImage(png,{x,y:page.getHeight()-centreY-dimensions.height/2,width:dimensions.width,height:dimensions.height,opacity:1});
    }catch(err){console.warn('Signature non lisible :',err);}
   }
  }
 }
}

async function exporterControlePharmaciePDF(type,index,modeMail=false){
 try{
 const lignes=archivesControlesPharmacie[type]?.[index];if(!lignes?.length)throw new Error("Feuille introuvable");
 const lib=await bibliothequePDFControlesPharmacie();
 const fichier=type==="meducore"?"controle_meducore.pdf":"tracabilite_entretien_vsav.pdf";
 const r=await fetch("./"+fichier);if(!r.ok)throw new Error("Modèle PDF manquant : "+fichier);
 const pdf=await lib.PDFDocument.load(await r.arrayBuffer());
 await remplirLignesControlesPharmacie(pdf,lignes,type,lib);
 const bytes=await pdf.save();
 if(modeMail)return pieceJointeDocumentMail(new Blob([bytes],{type:"application/pdf"}),`${type}-${lignes[0].date_intervention}-au-${lignes[lignes.length-1].date_intervention}-feuille-${index+1}.pdf`);
 if(estMacBureauExport()){await enregistrerDocumentPrincipal(new Blob([bytes],{type:"application/pdf"}),`${type}-${lignes[0].date_intervention}-au-${lignes[lignes.length-1].date_intervention}-feuille-${index+1}.pdf`);return;}
 const blob=new Blob([bytes],{type:"application/pdf"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${type}-${lignes[0].date_intervention}-au-${lignes[lignes.length-1].date_intervention}-feuille-${index+1}.pdf`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 }catch(e){if(modeMail)throw e;alert("Export impossible : "+e.message);}
}


// Produits de ménage : le serveur applique les mouvements et les permissions.
let menageProduitsCharges=false,menageSaisieCle=null,menageSaisieSignature="";
async function chargerProduitsVidesMenage(){
 menageProduitsCharges=false;menageSaisieCle=null;menageSaisieSignature="";
 styleInventaireMenage();
 const box=document.getElementById('menage-produits-vides');if(!box)return;
 try{
  const catalogue=await chargerCatalogueMenageHorsConnexion();
  if(catalogue===null)throw new Error("Ouvre une première fois l’application avec Internet pour mémoriser les produits du ménage.");
  const enAttente=lireMenagesEnAttente();
  const data=catalogue.map(p=>({...p,stock:Math.max(0,Number(p.stock)-enAttente.reduce((n,e)=>n+(e.produits||[]).filter(x=>x.id===p.id).reduce((q,x)=>q+x.quantite,0),0))}));
  if(!box.isConnected)return;
  box.innerHTML=(data||[]).map(p=>`<div class="garde-zone menage-produit-quantite" data-menage-produit><label style="display:flex;align-items:center;gap:11px;flex:1"><input type="checkbox" data-menage-vide value="${echapperHTML(p.id)}" ${p.stock<=0?'disabled':''} onchange="basculerQuantiteProduitMenage(this)"><span>${echapperHTML(p.nom)}${p.stock<=0?' — rupture de stock':''}</span></label><label>Quantité <input class="heures-input" style="width:80px" data-menage-quantite type="number" min="1" max="${p.stock}" step="1" value="1" disabled></label></div>`).join('')||'<p>Aucun produit configuré.</p>';
  menageProduitsCharges=true;
 }catch(e){if(box.isConnected)box.textContent='Produits indisponibles : '+e.message;}
}
function styleInventaireMenage(){
 if(document.getElementById('menage-stock-style'))return;
 const s=document.createElement('style');s.id='menage-stock-style';s.textContent='.menage-produit-quantite{flex-wrap:wrap}.menage-produit-quantite input[type=number]{width:80px;height:auto;box-sizing:border-box}.menage-rupture{background:#ffe5e5!important;border:3px solid #c40000!important;color:#970000!important}.menage-rupture strong{color:#b00000!important}.menage-stock-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px}.menage-stock-actions input{width:85px;padding:10px;border:1px solid #ccd5df;border-radius:8px;font:inherit}.menage-stock-actions button{padding:10px 14px;font:inherit;border-radius:8px;cursor:pointer}.menage-inventaire-actions{display:grid;grid-template-columns:minmax(110px,1fr) minmax(0,2fr);gap:10px;margin:12px 0 16px}.menage-inventaire-actions .equipe-action-button{width:100%;min-height:48px;margin:0;display:flex;align-items:center;justify-content:center;text-align:center;box-sizing:border-box;white-space:normal;line-height:1.35;padding:12px 15px;border-radius:12px}.menage-produit-actions{display:flex;flex-wrap:wrap;gap:10px}.menage-produit-actions .equipe-action-button{width:auto;min-height:46px;padding:12px 15px;background:#fff;border:1px solid #cdd5dc;border-radius:10px;text-align:center}.menage-inventaire-actions #menage-produit-ouvrir,.menage-produit-actions #menage-produit-creer{background:#176b45;color:#fff;border:1px solid #176b45;font-weight:800}@media(max-width:480px){.menage-inventaire-actions{grid-template-columns:minmax(0,1fr)}.menage-produit-actions .equipe-action-button{flex:1}}';document.head.appendChild(s);
}
async function afficherInventaireMenage(){
 if(!utilisateurAPermission('acces_admin_menage'))return alert('Accès non autorisé.');
 initialiserStyleEspaceGardeUtilisateur();initialiserStyleActionsEquipe();styleInventaireMenage();
 document.getElementById('app').innerHTML=`<main class="garde-section"><button class="retour-button" data-navigation-equipe onclick="retourAdminRubriqueEquipe('menage')">← Retour</button><h1>Ménage inventaire</h1><div class="menage-inventaire-actions"><button type="button" class="equipe-action-button" onclick="afficherInventaireMenage()">Actualiser</button> <button type="button" id="menage-produit-ouvrir" class="equipe-action-button" aria-expanded="false" aria-controls="menage-produit-creation" onclick="basculerCreationProduitMenage()">Créer un nouveau produit</button></div><form id="menage-produit-creation" class="garde-admin-card heures-form" hidden style="display:none" onsubmit="event.preventDefault();creerProduitMenageDepuisInventaire()"><h2 class="garde-sous-titre">Nouveau produit</h2><label for="menage-produit-nom">Nom du produit<input class="heures-input" id="menage-produit-nom" maxlength="120" required autocomplete="off"></label><label for="menage-produit-stock">Stock initial (unités)<input class="heures-input" id="menage-produit-stock" type="number" min="0" step="1" value="0" required inputmode="numeric"></label><div class="menage-produit-actions"><button type="submit" id="menage-produit-creer" class="equipe-action-button">Créer le produit</button> <button type="button" class="equipe-action-button" onclick="basculerCreationProduitMenage()">Annuler</button></div><p id="menage-produit-statut" role="status" aria-live="polite"></p></form><p id="menage-stock-message" role="status" aria-live="polite"></p><div id="menage-stock-liste" aria-live="polite">Chargement…</div></main>${navigationPrincipale('','accueil')}`;actualiserInterfaceBureau();
 const box=document.getElementById('menage-stock-liste');
 try{
  const {data,error}=await obtenirClientSupabase().from('menage_produits').select('id,nom,stock').order('nom');if(error)throw error;if(!box.isConnected)return;
  box.innerHTML=(data||[]).map(p=>`<div class="garde-admin-card ${p.stock===0?'menage-rupture':''}"><strong>${echapperHTML(p.nom)}</strong><p><b>${p.stock===0?'⚠ RUPTURE DE STOCK':'Stock actuel : '+p.stock+' unité(s)'}</b></p><div class="menage-stock-actions"><label>Quantité <input type="number" min="1" step="1" value="1" data-stock-quantite></label><button type="button" data-stock-id="${echapperHTML(p.id)}" onclick="ajusterStockMenage(this,1)">+ Ajouter</button><button type="button" data-stock-id="${echapperHTML(p.id)}" onclick="ajusterStockMenage(this,-1)">− Diminuer</button></div><p data-stock-statut role="status"></p></div>`).join('')||'<div class="garde-admin-card">Aucun produit. Crée un produit avec le bouton ci-dessus.</div>';
 }catch(e){if(box.isConnected)box.textContent='Inventaire indisponible : '+e.message;}
}

let creationProduitMenageCle=null,creationProduitMenageSignature='',creationProduitMenageEnCours=false;
function basculerCreationProduitMenage(){
 if(!utilisateurAPermission('acces_admin_menage')||creationProduitMenageEnCours)return;
 const form=document.getElementById('menage-produit-creation'),bouton=document.getElementById('menage-produit-ouvrir');if(!form||!bouton)return;
 const ouvrir=form.hidden;form.hidden=!ouvrir;form.style.display=ouvrir?'grid':'none';bouton.setAttribute('aria-expanded',String(ouvrir));
 if(ouvrir)document.getElementById('menage-produit-nom').focus();
}
async function creerProduitMenageDepuisInventaire(){
 if(!utilisateurAPermission('acces_admin_menage'))return alert('Accès non autorisé.');
 if(creationProduitMenageEnCours)return;
 const form=document.getElementById('menage-produit-creation');if(!form)return;
 const statut=document.getElementById('menage-produit-statut'),nom=document.getElementById('menage-produit-nom').value.trim(),raw=document.getElementById('menage-produit-stock').value,stock=Number(raw);
 if(!nom||nom.length>120||raw.trim()===''||!Number.isSafeInteger(stock)||stock<0){statut.textContent='Indique un nom et un stock entier positif ou nul.';return;}
 creationProduitMenageEnCours=true;
 const champs=[...form.querySelectorAll('input,button')];champs.forEach(c=>c.disabled=true);statut.textContent='Création du produit…';
 try{
  const signature=JSON.stringify([nom,stock]);
  if(signature!==creationProduitMenageSignature){creationProduitMenageSignature=signature;creationProduitMenageCle=crypto.randomUUID();}
  const sb=obtenirClientSupabase();if(!sb)throw new Error('Connexion indisponible.');
  const {error}=await sb.rpc('menage_creer_produit',{p_nom:nom,p_stock:stock,p_cle:creationProduitMenageCle});if(error)throw error;
  creationProduitMenageCle=null;creationProduitMenageSignature='';
  if(form.isConnected){await afficherInventaireMenage();const message=document.getElementById('menage-stock-message');if(message)message.textContent='Produit créé.';}
 }catch(erreur){if(form.isConnected)statut.textContent='Création impossible : '+(erreur?.message||'Réessaie dans un instant.');}
 finally{creationProduitMenageEnCours=false;champs.forEach(c=>c.disabled=false);}
}
async function ajusterStockMenage(btn,sens){
 if(!utilisateurAPermission('acces_admin_menage'))return;
 const card=btn.closest('.garde-admin-card'),input=card.querySelector('[data-stock-quantite]'),st=card.querySelector('[data-stock-statut]'),n=Number(input.value);
 if(!Number.isInteger(n)||n<1){st.textContent='Saisis une quantité entière supérieure à zéro.';return;}
 if(!confirm((sens>0?'Ajouter ':'Retirer ')+n+' unité(s) ?'))return;
 card.querySelectorAll('button').forEach(b=>b.disabled=true);
 // Conserve la clé en cas de réponse réseau perdue pour éviter un double mouvement.
 const signature=btn.dataset.stockId+':'+sens+':'+n;
 if(btn.dataset.signature!==signature){btn.dataset.signature=signature;btn.dataset.cle=crypto.randomUUID();}
 try{const {error}=await obtenirClientSupabase().rpc('menage_ajuster_stock',{p_id:btn.dataset.stockId,p_delta:sens*n,p_cle:btn.dataset.cle});if(error)throw error;await afficherInventaireMenage();}
 catch(e){st.textContent='Échec : '+e.message;card.querySelectorAll('button').forEach(b=>b.disabled=false);}
}

// Choix de rubrique réservés aux permissions admin existantes.
let rubriqueEquipeOrigine=null;
const rubriquesEquipeConfig={
 menage:{titre:'Ménage',permission:'acces_admin_menage',saisie:()=>afficherMenageEspaceGarde(),cartes:[['🧹','Enregistrer un ménage','afficherMenageEspaceGarde()'],['📦','Ménage inventaire','afficherInventaireMenage()'],['📋','Ménage admin','afficherAdminMenageEquipe()']]},
 vehicules:{titre:'Inventaire véhicule',permission:'acces_admin_menage',saisie:()=>afficherInventaireVehiculeEspaceGarde(),cartes:[['🚒','Enregistrer un inventaire','afficherInventaireVehiculeEspaceGarde()'],['📋','Inventaires admin','afficherAdminInventairesEquipe()'],['📄','Télécharger le PDF des inventaires',"afficherChoixPDFEquipe('vehicules')"]]},
 heures:{titre:'Heures',permission:'acces_admin_heures',saisie:()=>afficherEnregistrerHeuresEquipe(),cartes:[['⏱️','Enregistrer des heures','afficherEnregistrerHeuresEquipe()'],['📋','Heures admin','afficherHistoriqueHeuresEquipe()'],['📄','Télécharger le PDF des heures',"afficherChoixPDFEquipe('heures')"]]}
};
function ouvrirRubriqueEquipe(type){
 const cfg=rubriquesEquipeConfig[type];if(!cfg)return;
 rubriqueEquipeOrigine=type;
 if(!utilisateurAPermission(cfg.permission))return cfg.saisie();
 initialiserStyleEspaceGardeUtilisateur();
 document.getElementById('app').innerHTML=`<main class="garde-menu-page"><button class="retour-button" data-navigation-equipe onclick="afficherEspaceGarde()">← Espace équipe</button><header class="garde-menu-entete"><h1>${cfg.titre}</h1></header><div class="garde-menu-cartes">${cfg.cartes.map(([ico,nom,action])=>`<button type="button" class="garde-menu-carte" onclick="${action}"><span class="ico">${ico}</span><span><strong>${nom}</strong></span><b class="fleche">›</b></button>`).join('')}</div></main>${navigationPrincipale('','accueil')}`;
 actualiserInterfaceBureau();window.scrollTo({top:0,behavior:'auto'});
}
function retourSaisieEquipe(type){
 if(type==='menage'&&contexteMenageTravailActif()){menageTravailContexte=null;CISTravail.retourFiche();return;}

 const cfg=rubriquesEquipeConfig[type];
 if(cfg&&utilisateurAPermission(cfg.permission))ouvrirRubriqueEquipe(type);else afficherEspaceGarde();
}
function retourAdminRubriqueEquipe(type){
 if(rubriqueEquipeOrigine===type)ouvrirRubriqueEquipe(type);else afficherAdministratifCaserne();
}
function basculerQuantiteProduitMenage(caseProduit){
 const q=caseProduit.closest('[data-menage-produit]')?.querySelector('[data-menage-quantite]');if(!q)return;
 q.disabled=!caseProduit.checked;if(!caseProduit.checked)q.value='1';
}
async function chargerHeuresTravailEquipe(periode=null,id=null){
 const rows=[];const sb=obtenirClientSupabase();
 for(let offset=0;;offset+=200){
  const {data,error}=await sb.rpc('travail_heures_export',{p_debut:periode?.startISO||null,p_fin:periode?.endISO||null,p_offset:offset,p_semaine:id||null});
  if(error)throw new Error('Heures du travail d’équipe indisponibles : '+error.message);
  rows.push(...(data||[]));if((data?.length||0)<200)break;
 }return rows;
}
async function chargerLignesEquipePDF(type,id,periodeMail=null){
 const sb=obtenirClientSupabase();
 const table=type==='menage'?'menages_garde':type==='heures'?'heures_equipe':'cis_inventaires_vehicules';
 const select=type==='heures'?'id,created_at,duree_minutes,details,enregistre_par,personnes_concernees,motifs_heures(nom)':'*';
 const date=type==='menage'?'date_menage':'created_at';
 const filtreVehicule=type==='vehicules'&&!id?(document.getElementById('inventaires-admin-filtre')?.value||''):'';
 const periode=type!=='vehicules'&&!id?(periodeMail||lirePeriodePDFEquipe(type)):null;
 if(type==='heures'&&id?.startsWith('travail:'))return chargerHeuresTravailEquipe(null,id.slice(8));
 const rows=[];
 for(let debut=0;;debut+=500){
  let req=sb.from(table).select(select).order(date,{ascending:false}).order('id');
  if(table==='menages_garde')req=req.is('supprime_le',null);
  if(id)req=req.eq('id',id);
  if(periode)req=req.gte(date,periode.startISO).lt(date,periode.endISO);
  if(filtreVehicule)req=req.eq('vehicule_nom',filtreVehicule);
  const {data,error}=await req.range(debut,debut+499);if(error)throw error;
  rows.push(...(data||[]));if((data?.length||0)<500)break;
 }
 if(type==='heures'&&!id)rows.push(...await chargerHeuresTravailEquipe(periode));
 return rows;
}
async function exporterEquipePDF(type,id=null,modeMail=false,periodeMail=null){
 const cfg=rubriquesEquipeConfig[type];if(!cfg||!utilisateurAPermission(cfg.permission))return alert('Accès non autorisé.');
 const cle=type+':'+(id||'tous');if(exportsEquipePDFEnCours.has(cle))return;
 exportsEquipePDFEnCours.add(cle);
 // Ouvrir pendant le geste utilisateur pour éviter le blocage Safari après await.
 const estApple=/iPad|iPhone|iPod/.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);
 let apercu=!modeMail&&estApple?window.open('about:blank','_blank'):null;
 const statut=document.getElementById('equipe-pdf-statut');
 if(statut)statut.textContent='Création du PDF…';
 try{
  const [rows,personnes]=await Promise.all([chargerLignesEquipePDF(type,id,periodeMail),chargerUtilisateursEspaceGarde()]);
  if(!rows.length)throw new Error('Aucun enregistrement à exporter.');
  const PDF=await obtenirBibliothequesPDF();
  let doc;
  if(type==='vehicules'){
   if(rows.length!==1)throw new Error('Sélectionne un véhicule puis un inventaire précis.');
   doc=creerRapportInventaireEquipePDF(PDF,rows[0],personnes);
  }else doc=creerCalendrierEquipePDF(PDF,type,rows,personnes,id,periodeMail);
  if(!utilisateurAPermission(cfg.permission))throw new Error('Accès non autorisé.');
  const nom=nomFichierPDF(type==='vehicules'?`inventaire-${rows[0].numero_inventaire??rows[0].id}-${rows[0].vehicule_nom||'vehicule'}`:`${type}-cis-le-chesne-${id||'periode'}`);
  if(modeMail)return pieceJointeDocumentMail(doc.output('blob'),nom);
  if(estMacBureauExport()){const resultat=await enregistrerDocumentPrincipal(doc.output('blob'),nom);if(statut)statut.textContent=texteResultatExportPrincipal(resultat);return;}
  const url=URL.createObjectURL(doc.output('blob'));
  if(apercu){apercu.location.href=url;apercu=null;}
  else {const a=document.createElement('a');a.href=url;a.download=nom;document.body.appendChild(a);a.click();a.remove();}
  if(statut)statut.textContent=estApple?'PDF ouvert. Sur iPhone : Partager → Enregistrer dans Fichiers.':'PDF téléchargé.';
  setTimeout(()=>URL.revokeObjectURL(url),120000);
 }catch(e){if(apercu)apercu.close();if(modeMail)throw e;if(statut)statut.textContent=e.message||String(e);afficherErreurExportPDF(e);}finally{exportsEquipePDFEnCours.delete(cle);}
}
const exportsEquipePDFEnCours=new Set();

function creerRapportInventaireEquipePDF(PDF,r,personnes){
 const vehNum=inventairesAdminNom;
 const vehDate=d=>new Date(d).toLocaleString('fr-FR');
 const vehPerson=r=>{const u=personnes.find(p=>String(p.id)===String(r.controle_par));return u?nomPersonnelHeures(u):'Identité indisponible (ID : '+String(r.controle_par||'inconnu').slice(0,8)+')';};
 const doc=new PDF({unit:'mm',format:'a4'});
 const W=210,H=297,margin=14;let y=0,page=0;
 const palette={bon:[28,134,75],a_surveiller:[189,140,20],hs:[190,43,43],autre:[111,119,130]};
 const label={bon:'BON',a_surveiller:'À SURVEILLER',hs:'HS'};
 const clean=v=>String(v??'').replace(/[\u0000-\u001f]/g,' ').trim();
 const text=(value,x,yy,size=10,bold=false,color=[35,45,58])=>{doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(...color);doc.text(clean(value),x,yy);};
 const footer=()=>{doc.setDrawColor(221,226,232);doc.line(margin,282,W-margin,282);text('CIS LE CHESNE  |  DOCUMENT DE TRAÇABILITÉ',margin,288,7,false,[110,119,130]);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(110,119,130);doc.text('Page '+page,W-margin,288,{align:'right'});};
 const newPage=()=>{if(page){footer();doc.addPage();}page++;y=19;text('CIS LE CHESNE',margin,y,11,true,[29,52,72]);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(29,52,72);doc.text(vehNum(r),W-margin,y,{align:'right'});doc.setDrawColor(220,226,232);doc.line(margin,24,W-margin,24);y=31;};
 const ensure=h=>{if(y+h>276)newPage();};
 const wrapped=(value,x,width,size=9,color=[47,56,67],bold=false)=>{
  doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);
  const lines=doc.splitTextToSize(clean(value),width);
  const lineHeight=size*.48+1.3;ensure(lines.length*lineHeight+2);
  doc.setTextColor(...color);lines.forEach(t=>{doc.text(t,x,y);y+=lineHeight;});
 };
 const items=(Array.isArray(r.details)?r.details:[]).filter(z=>z.type!=='technique').flatMap(z=>Array.isArray(z.materiels)?z.materiels:[]);
 const counts={bon:items.filter(m=>m.etat==='bon').length,a_surveiller:items.filter(m=>m.etat==='a_surveiller').length,hs:items.filter(m=>m.etat==='hs').length};
 // jsPDF démarre avec une page vide : on la remplace par une page maîtrisée.
 newPage();
 text('RAPPORT D’INVENTAIRE VÉHICULE',margin,y,14,true,[25,49,72]);y+=7;
 doc.setFillColor(242,246,249);doc.roundedRect(margin,y,W-2*margin,24,2,2,'F');
 text('VÉHICULE',margin+5,y+5.5,7,true,[102,113,125]);text(r.vehicule_nom,margin+5,y+12,11,true);
 doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(25,49,72);doc.text('N° '+vehNum(r),W-margin-5,y+8,{align:'right'});
 text('Date : '+vehDate(r.created_at),margin+5,y+19,8);
 y+=28;
 doc.setFont('helvetica','bold');doc.setFontSize(9);for(const ligneParticipant of doc.splitTextToSize(clean('Contrôle réalisé par : '+nomsParticipantsInventaire(r,personnes)),W-2*margin)){ensure(6);text(ligneParticipant,margin,y,9,true);y+=5.6;}y+=1;
 const cardW=(W-2*margin-8)/3;
 [['bon','BON'],['a_surveiller','À SURVEILLER'],['hs','HS']].forEach(([key,t],idx)=>{
  const x=margin+idx*(cardW+4),c=palette[key];doc.setFillColor(...c);doc.roundedRect(x,y,cardW,14,2,2,'F');
  text(String(counts[key]),x+5,y+7,11,true,[255,255,255]);text(t,x+5,y+11.5,6.5,true,[255,255,255]);
 });y+=19;
 for(const z of (Array.isArray(r.details)?r.details:[])){
  if(z.type==='annexe'){ensure(22);for(const phrase of CISTechnique.annexeTextes(z)){doc.setFont('helvetica','normal');doc.setFontSize(9);for(const ligneAnnexe of doc.splitTextToSize(clean(phrase),W-2*margin)){ensure(6);text(ligneAnnexe,margin,y,9);y+=5.6;}y+=3;}continue;}
  if(z.type==='technique'){ensure(62);y+=CISTechnique.pdf(doc,z,margin,y,W-2*margin);if(z.observation){doc.setFont('helvetica','normal');doc.setFontSize(9);for(const ligneTechnique of doc.splitTextToSize(clean('Observation technique : '+z.observation),W-2*margin)){ensure(6);text(ligneTechnique,margin,y,9);y+=5.6;}y+=4;}continue;}
  ensure(13);doc.setFillColor(36,61,83);doc.roundedRect(margin,y,W-2*margin,8,1.5,1.5,'F');
  text((z.zone_nom||'Zone').toUpperCase(),margin+4,y+5.5,9,true,[255,255,255]);y+=11;
  const zoneItems=Array.isArray(z.materiels)?z.materiels:[];
  if(!zoneItems.length){wrapped('Aucun matériel enregistré',margin+3,W-2*margin-6,9);y+=3;}
  for(const m of zoneItems){
   const key=palette[m.etat]?m.etat:'autre',c=palette[key];
   doc.setFont('helvetica','normal');doc.setFontSize(9);
   const ecartQuantite=m.quantite_constatee!=null&&Number(m.quantite_constatee)!==Number(m.quantite);
    const name=clean(m.nom||'Matériel')+'  × '+(m.quantite||1);
    const ligneQuantite=ecartQuantite?'QUANTITÉ NON CONFORME : '+m.quantite_constatee+' constaté(s) / '+m.quantite+' prévu(s)':'';
   const nameLines=doc.splitTextToSize(name,125);
   const obs=m.observation?doc.splitTextToSize('Observation : '+clean(m.observation),W-2*margin-12):[];
   const height=Math.max(9,3.5+nameLines.length*3.7+obs.length*3.6+(ecartQuantite?5:0));
   ensure(height+2);
   doc.setFillColor(247,249,251);doc.roundedRect(margin,y,W-2*margin,height,1.5,1.5,'F');
   doc.setFillColor(...c);doc.roundedRect(margin+2,y+1.5,2.5,height-3,1,1,'F');
   doc.setTextColor(42,53,65);doc.setFontSize(8.5);doc.setFont('helvetica','bold');doc.text(nameLines,margin+8,y+5.8);
   const badge=label[key]||'NON RENSEIGNÉ';doc.setFontSize(7.5);doc.setTextColor(...c);doc.text(badge,W-margin-5,y+5.8,{align:'right'});
   if(obs.length){doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(88,97,107);doc.text(obs,margin+8,y+5.8+nameLines.length*3.7);}
    if(ecartQuantite){doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(190,35,35);doc.text(ligneQuantite,margin+8,y+5.8+nameLines.length*3.7+obs.length*3.6);}
   y+=height+2;
  }
  y+=2;
 }
 ensure(13);y+=2;wrapped('Référence permanente : '+r.id,margin,W-2*margin,7,[107,117,128]);
 footer();
 const filename='inventaire-'+String(r.numero_inventaire??r.id).replace(/[^a-z0-9-]/gi,'-')+'-'+String(r.vehicule_nom||'vehicule').replace(/[^a-z0-9-]/gi,'-')+'.pdf';
 return doc;
}

function initialiserStyleActionsEquipe(){
 if(document.getElementById('equipe-actions-style'))return;
 const s=document.createElement('style');s.id='equipe-actions-style';
 s.textContent=`.equipe-action-button{border:1px solid #cdd5dc;background:#fff;border-radius:10px;padding:12px 15px;margin:7px 0;font:inherit;font-weight:750;color:#263238;cursor:pointer}.equipe-action-button:disabled{opacity:.5;cursor:default}.equipe-pdf-form{display:grid;gap:14px}.equipe-pdf-form label{display:grid;gap:7px;font-weight:750}.equipe-pdf-form select,.equipe-pdf-form input{box-sizing:border-box;width:100%;min-height:46px;border:1px solid #ccd5df;border-radius:10px;padding:11px;background:white;font:inherit}.garde-section,.garde-menu-page{padding-bottom:calc(125px + env(safe-area-inset-bottom,0px))!important}.equipe-pdf-statut{white-space:normal;overflow-wrap:anywhere}`;
 document.head.appendChild(s);
}
const moisPDFEquipe=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
let choixInventairesPDFEquipe=[];
async function afficherChoixPDFEquipe(type){
 const cfg=rubriquesEquipeConfig[type];if(!cfg||!utilisateurAPermission(cfg.permission))return alert('Accès non autorisé.');
 initialiserStyleEspaceGardeUtilisateur();initialiserStyleActionsEquipe();
 const titre=type==='menage'?'PDF des ménages':type==='heures'?'PDF des heures':'PDF des inventaires';
 const d=new Date();
 document.getElementById('app').innerHTML=`<main class="garde-section"><button type="button" class="retour-button" data-navigation-equipe onclick="ouvrirRubriqueEquipe('${type}')">← Retour</button><h1>${titre}</h1><div id="equipe-pdf-form" class="garde-admin-card equipe-pdf-form">${type==='vehicules'?'Chargement des inventaires…':`<label>Période<select id="equipe-pdf-mode" onchange="basculerPeriodePDFEquipe()"><option value="month">Mois</option><option value="custom">Dates personnalisées</option></select></label><div data-pdf-mois><label>Mois<select id="equipe-pdf-mois">${moisPDFEquipe.map((m,i)=>`<option value="${i}" ${i===d.getMonth()?'selected':''}>${m}</option>`).join('')}</select></label><label>Année<input id="equipe-pdf-annee" type="number" min="2000" max="2100" value="${d.getFullYear()}"></label></div><div data-pdf-dates hidden><label>Du<input id="equipe-pdf-debut" type="date" value="${dateISOlocale(new Date(d.getFullYear(),d.getMonth(),1))}"></label><label>Au<input id="equipe-pdf-fin" type="date" value="${dateISOlocale(new Date(d.getFullYear(),d.getMonth()+1,0))}"></label></div><button type="button" class="equipe-action-button" onclick="exporterEquipePDF('${type}')">Télécharger le PDF</button>`}</div><p id="equipe-pdf-statut" class="equipe-pdf-statut" role="status"></p></main>${navigationPrincipale('','accueil')}`;
 actualiserInterfaceBureau();window.scrollTo({top:0,behavior:'auto'});
 if(type!=='vehicules')return;
 const form=document.getElementById('equipe-pdf-form');
 try{
  const sb=obtenirClientSupabase();const records=[];
  for(let debut=0;;debut+=500){const {data,error}=await sb.from('cis_inventaires_vehicules').select('*').order('created_at',{ascending:false}).order('id').range(debut,debut+499);if(error)throw error;records.push(...(data||[]));if((data?.length||0)<500)break;}
  if(!form.isConnected)return;choixInventairesPDFEquipe=records;
  const vehicules=[...new Set(records.map(r=>r.vehicule_nom||'Véhicule non renseigné'))].sort((a,b)=>a.localeCompare(b,'fr'));
  form.innerHTML=records.length?`<label>Véhicule<select id="equipe-pdf-vehicule" onchange="actualiserInventairesPDFEquipe()"><option value="">Sélectionner un véhicule</option>${vehicules.map(v=>`<option value="${echapperHTML(v)}">${echapperHTML(v)}</option>`).join('')}</select></label><label>Inventaire enregistré<select id="equipe-pdf-inventaire" disabled onchange="document.getElementById('equipe-pdf-telecharger').disabled=!this.value"><option value="">Sélectionner d’abord un véhicule</option></select></label><button type="button" id="equipe-pdf-telecharger" class="equipe-action-button" disabled onclick="telechargerInventairePDFSelectionne()">Télécharger cet inventaire</button>`:'Aucun inventaire enregistré.';
 }catch(e){if(form.isConnected)form.textContent='Historique indisponible : '+e.message;}
}
function actualiserInventairesPDFEquipe(){
 const v=document.getElementById('equipe-pdf-vehicule')?.value,select=document.getElementById('equipe-pdf-inventaire'),btn=document.getElementById('equipe-pdf-telecharger');if(!select||!btn)return;
 const rows=v?choixInventairesPDFEquipe.filter(r=>(r.vehicule_nom||'Véhicule non renseigné')===v):[];
 select.innerHTML='<option value="">Sélectionner un inventaire</option>'+rows.map(r=>`<option value="${echapperHTML(String(r.id))}">${echapperHTML(inventairesAdminNom(r)+' — '+new Date(r.created_at).toLocaleString('fr-FR'))}</option>`).join('');select.disabled=!rows.length;btn.disabled=true;
}
function telechargerInventairePDFSelectionne(){
 const id=document.getElementById('equipe-pdf-inventaire')?.value,v=document.getElementById('equipe-pdf-vehicule')?.value;
 if(!id||!choixInventairesPDFEquipe.some(r=>String(r.id)===id&&(r.vehicule_nom||'Véhicule non renseigné')===v))return alert('Sélectionne un véhicule et un inventaire.');
 return exporterEquipePDF('vehicules',id);
}
function basculerPeriodePDFEquipe(){
 const custom=document.getElementById('equipe-pdf-mode')?.value==='custom';
 document.querySelectorAll('[data-pdf-mois]').forEach(x=>x.hidden=custom);document.querySelectorAll('[data-pdf-dates]').forEach(x=>x.hidden=!custom);
}
function lirePeriodePDFEquipe(type){
 let from,to;
 if(document.getElementById('equipe-pdf-mode')?.value==='custom'){
  from=document.getElementById('equipe-pdf-debut')?.value;to=document.getElementById('equipe-pdf-fin')?.value;
 }else{
  const d=new Date(),m=Number(document.getElementById('equipe-pdf-mois')?.value??d.getMonth()),y=Number(document.getElementById('equipe-pdf-annee')?.value??d.getFullYear());
  if(!Number.isInteger(m)||m<0||m>11||!Number.isInteger(y)||y<2000||y>2100)throw new Error('Mois ou année invalide.');
  from=dateISOlocale(new Date(y,m,1));to=dateISOlocale(new Date(y,m+1,0));
 }
 if(!from||!to||from>to||!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to))throw new Error('Sélectionne une période valide.');
 const debut=new Date(from+'T00:00:00'),fin=new Date(to+'T00:00:00');fin.setDate(fin.getDate()+1);
 if(!Number.isFinite(debut.getTime())||!Number.isFinite(fin.getTime()))throw new Error('Dates invalides.');
 return {from,to,startISO:debut.toISOString(),endISO:fin.toISOString()};
}
function creerCalendrierEquipePDF(PDF,type,rows,personnes,id,periodeMail=null){
 const noms=ids=>(ids||[]).map(uid=>{const u=personnes.find(p=>String(p.id)===String(uid));return u?nomPersonnelHeures(u):'Utilisateur';}).join(', ');
 const periode=id?{from:dateISOlocale(new Date(rows[0][type==='menage'?'date_menage':'created_at'])),to:dateISOlocale(new Date(rows[0][type==='menage'?'date_menage':'created_at']))}:(periodeMail||lirePeriodePDFEquipe(type));
 const entries=rows.map(r=>({date:r[type==='menage'?'date_menage':'created_at'],names:r.participants_noms?.length?r.participants_noms.map(nomPersonnelHeures).join(', '):noms(r[type==='menage'?'personnes_presentes':'personnes_concernees']),motif:type==='menage'?'Ménage':r.motifs_heures?.nom||'Heures enregistrées',duration:libelleDureeHeures(r.duree_minutes||0)})).sort((a,b)=>new Date(a.date)-new Date(b.date));
 const doc=new PDF({orientation:'portrait',unit:'mm',format:'a4'});
 const first=new Date(periode.from+'T12:00:00'),last=new Date(periode.to+'T12:00:00');let month=new Date(first.getFullYear(),first.getMonth(),1,12),page=0;
 while(month<=last){
  if(page++)doc.addPage();const y=month.getFullYear(),mo=month.getMonth(),days=new Date(y,mo+1,0).getDate();
  const title=month.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}),titre=title.charAt(0).toUpperCase()+title.slice(1);
  doc.setFont('helvetica','bold');doc.setFontSize(16);doc.text(texteCompatiblePDF('CIS Le Chesne — '+titre),105,12,{align:'center'});let yy=20;
  const suite=()=>{doc.addPage();yy=15;doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text(texteCompatiblePDF(titre+' — suite'),105,9,{align:'center'});};
  for(let day=1;day<=days;day++){
   const d=new Date(y,mo,day,12),key=dateISOlocale(d);if(key<periode.from||key>periode.to)continue;
   const dayEntries=entries.filter(e=>dateISOlocale(new Date(e.date))===key),lines=[];
   doc.setFont('helvetica','normal');doc.setFontSize(7.5);
   for(const e of dayEntries)lines.push(...doc.splitTextToSize(texteCompatiblePDF(`${e.names||'Utilisateur'} — ${e.motif} — ${e.duration}`),154));
   let reste=lines.length?lines:['—'];
   while(reste.length){
    if(yy+10>287)suite();
    const max=Math.max(1,Math.floor((287-yy-6)/4.1)),chunk=reste.slice(0,max);reste=reste.slice(max);
    const h=Math.max(8,6+chunk.length*4.1);
    doc.setDrawColor(150);doc.rect(8,yy,194,h);doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(0);
    doc.text(d.toLocaleDateString('fr-FR',{weekday:'short',day:'2-digit',month:'2-digit'}),10,yy+5);
    doc.setFont('helvetica','normal');doc.setFontSize(7.5);let ly=yy+5;
    if(!dayEntries.length)doc.setTextColor(145);
    for(const ln of chunk){doc.text(texteCompatiblePDF(ln),46,ly);ly+=4.1;}doc.setTextColor(0);yy+=h;
    if(reste.length)suite();
   }
  }
  month=new Date(y,mo+1,1,12);
 }
 return doc;
}


/* Centre de notifications : même stockage que le service worker. */
function chargerHistoriqueNotificationsModule(){
 if(window.CISNotifications)return Promise.resolve(window.CISNotifications);
 if(window.__cisNotificationsModule)return window.__cisNotificationsModule;
 window.__cisNotificationsModule=new Promise((resolve,reject)=>{
  const s=document.createElement('script');s.src='./notifications-history.js';
  s.onload=()=>resolve(window.CISNotifications);
  s.onerror=()=>{s.remove();window.__cisNotificationsModule=null;reject(new Error('Historique des notifications indisponible.'));};
  document.head.appendChild(s);
 });return window.__cisNotificationsModule;
}
function notificationEstRuptureStock(r){
 const texte=[r.title,r.body].filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const cible=String(r.target||'').toLowerCase();
 const stockConcerne=['pharmacie','menage-inventaire'].includes(cible)||/pharma|menage/.test(texte);
 return stockConcerne && /\brupture\b/.test(texte);
}
function initialiserCentreNotifications(){
 if(document.getElementById('btn-historique-notifications'))return;
 const style=document.createElement('style');style.id='style-centre-notifications';
 style.textContent=`
 #btn-historique-notifications{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:calc(58px + env(safe-area-inset-right,0px));width:38px;height:38px;display:flex;align-items:center;justify-content:center;z-index:99999;border:0;padding:0;margin:0;background:transparent;color:#1687ff;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
 #btn-historique-notifications .notif-point{position:absolute;top:0;right:0;width:13px;height:13px;border-radius:50%;background:#dc2626;border:2px solid #fff;box-shadow:0 0 0 1px #dc2626;pointer-events:none}#btn-historique-notifications .notif-point[hidden]{display:none}#btn-historique-notifications[hidden]{display:none!important}#btn-historique-notifications svg{width:27px;height:27px}#btn-historique-notifications:focus-visible{outline:2px solid #1687ff;outline-offset:2px;border-radius:50%}
 html:has(#notifications-historique-page),body:has(#notifications-historique-page){background:#f3f4f6!important}.notifications-page{min-height:100vh;min-height:100dvh;max-width:780px;margin:0 auto;padding:64px 16px 125px;box-sizing:border-box}.notifications-page h1{font-size:28px;margin:24px 0}.notif-retour{border:1px solid #dce1e6;background:#fff;color:#222a32;padding:11px 15px;border-radius:12px;font:inherit;font-weight:700;cursor:pointer}.notif-liste{display:grid;gap:10px}.notif-ligne{width:100%;display:flex;align-items:center;gap:18px;padding:18px;text-align:left;border:1px solid #dfe4e9;border-radius:14px;background:#fff;color:#222a32;font:inherit;cursor:pointer;box-sizing:border-box}.notif-ligne.non-lue{background:#1687ff;border-color:#1687ff;color:#fff}.notif-ligne.non-lue .notif-contenu time,.notif-ligne.non-lue svg{color:#fff}.notif-ligne.non-lue.rupture-stock{background:#c62828;border-color:#c62828;color:#fff}.notif-ligne.non-lue.rupture-stock:focus-visible{outline-color:#c62828}.notif-contenu{min-width:0;flex:1}.notif-contenu strong{display:block;font-size:16px;line-height:1.4;overflow-wrap:anywhere}.notif-contenu p{font-size:14px;line-height:1.5;margin:6px 0 10px;overflow-wrap:anywhere}.notif-contenu time{font-size:12px;color:#68717b;display:block}.notif-ligne svg{width:18px;height:18px;flex-shrink:0;color:#79838e}.notif-vide{border:1px solid #dfe4e9;border-radius:14px;background:#fff;color:#68717b;padding:24px;line-height:1.5}.notif-ligne:focus-visible,.notif-retour:focus-visible{outline:2px solid #1687ff;outline-offset:3px}
 @media(min-width:1000px){html:has(#notifications-historique-page),body:has(#notifications-historique-page){background:var(--pc-fond,#0d141b)!important}body:not(.mode-connexion) .notif-ligne,body:not(.mode-connexion) .notif-retour,body:not(.mode-connexion) .notif-vide{background:#151f28;border-color:#34414c;color:#f2f5f7}body:not(.mode-connexion) .notif-ligne.non-lue{background:#1687ff;border-color:#1687ff;color:#fff}body:not(.mode-connexion) .notif-ligne.non-lue.rupture-stock{background:#c62828;border-color:#c62828;color:#fff}body:not(.mode-connexion) .notif-ligne.non-lue .notif-contenu time,body:not(.mode-connexion) .notif-ligne.non-lue svg{color:#fff}.notif-contenu time{color:#8796a6}}
 `;document.head.appendChild(style);
 const button=document.createElement('button');button.id='btn-historique-notifications';button.type='button';button.hidden=true;button.setAttribute('aria-label','Historique des notifications');button.title='Notifications';
 button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/></svg><span class="notif-point" hidden aria-hidden="true"></span>';
 button.addEventListener('click',afficherHistoriqueNotifications);document.body.appendChild(button);
 const app=document.getElementById('app');if(app)new MutationObserver(actualiserVisibiliteCentreNotifications).observe(app,{childList:true});
 new MutationObserver(actualiserVisibiliteCentreNotifications).observe(document.body,{attributes:true,attributeFilter:['class']});
 if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',event=>{
  const data=event.data||{};
  if(data.type==='CIS_NOTIFICATIONS_UPDATED'&&String(data.userId)===String(utilisateurConnecte?.id||'')){void actualiserPointNotifications();if(document.getElementById('notifications-liste'))void remplirHistoriqueNotifications();}
  if(data.type==='CIS_OPEN_NOTIFICATION'){window.__cisNotificationEnAttente=data.id;void traiterNotificationEnAttente();}
 });
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){void actualiserPointNotifications();if(document.getElementById('notifications-liste'))void remplirHistoriqueNotifications();}});
 const url=new URL(window.location.href),id=url.searchParams.get('notification');
 if(id){window.__cisNotificationEnAttente=id;url.searchParams.delete('notification');window.history.replaceState(window.history.state,'',url.href);}
 actualiserVisibiliteCentreNotifications();
}
function actualiserVisibiliteCentreNotifications(){
 const button=document.getElementById('btn-historique-notifications');if(!button)return;
 // Les menus pharmacie/principal réutilisent caserne-shell pour leur style.
 const caserne=document.querySelector('#app .caserne-shell:not(.menu-navigation-pharmacie):not(.menu-navigation-principal)');
 button.hidden=!profilUtilisateurConnecte||document.body.classList.contains('mode-connexion')||Boolean(caserne);
 void actualiserPointNotifications();
}
async function associerHistoriqueNotifications(abonnement,userId){
 if(!abonnement?.endpoint||!userId)return;
 try{const store=await chargerHistoriqueNotificationsModule();await store.bind(abonnement.endpoint,userId);await actualiserPointNotifications();}catch(e){console.warn('Association historique notifications :',e);}
}
async function afficherHistoriqueNotifications(){
 if(!utilisateurConnecte?.id||!profilUtilisateurConnecte)return;
 initialiserCentreNotifications();
 document.getElementById('app').innerHTML=`<main id="notifications-historique-page" class="notifications-page navigation-fixe-page"><button type="button" class="notif-retour" onclick="retourPagePrecedente()">Retour</button><h1>Notifications</h1><div id="notifications-liste" class="notif-liste" role="status">Chargement…</div></main>${navigationPrincipale('','accueil')}`;
 actualiserInterfaceBureau();window.scrollTo({top:0,behavior:'auto'});await remplirHistoriqueNotifications();
}
async function remplirHistoriqueNotifications(){
 const zone=document.getElementById('notifications-liste'),uid=utilisateurConnecte?.id;if(!zone||!uid)return;
 try{
  const store=await chargerHistoriqueNotificationsModule(),rows=await store.list(uid);
  if(!zone.isConnected||String(utilisateurConnecte?.id)!==String(uid))return;
  zone.innerHTML=rows.length?rows.map(r=>`<button type="button" class="notif-ligne ${r.read?'':'non-lue'} ${notificationEstRuptureStock(r)?'rupture-stock':''}" data-notification-id="${echapperHTML(r.id)}"><span class="notif-contenu"><strong>${echapperHTML(r.title)}</strong>${r.body?`<p>${echapperHTML(r.body)}</p>`:''}<time datetime="${echapperHTML(r.receivedAt)}">${echapperHTML(new Date(r.receivedAt).toLocaleString('fr-FR',{timeZone:'Europe/Paris',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}))}</time></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>`).join(''):'<p class="notif-vide">Aucune notification reçue depuis l’activation de cet historique.</p>';
  afficherEtatPointNotifications(rows.some(r=>!r.read));
  zone.querySelectorAll('[data-notification-id]').forEach(b=>b.addEventListener('click',()=>ouvrirNotificationHistorique(b.dataset.notificationId)));
 }catch(e){if(zone.isConnected)zone.innerHTML='<p class="notif-vide">Impossible de lire l’historique sur cet appareil. Réessayez en rouvrant l’application.</p>';console.warn('Historique notifications :',e);}
}
async function traiterNotificationEnAttente(){
 if(!window.__cisNotificationsApplicationPrete||!utilisateurConnecte?.id||!window.__cisNotificationEnAttente)return;
 const id=window.__cisNotificationEnAttente;window.__cisNotificationEnAttente=null;await ouvrirNotificationHistorique(id);
}
async function ouvrirNotificationHistorique(id){
 const uid=utilisateurConnecte?.id;if(!uid)return;
 try{
  const store=await chargerHistoriqueNotificationsModule(),r=await store.get(id,uid);
  if(String(utilisateurConnecte?.id)!==String(uid))return;
  if(!r)return alert('Cette notification n’est pas disponible pour ce compte.');
  const target=r.target;
  if(target==='menage-inventaire'&&!utilisateurAPermission('acces_admin_menage'))return alert('Vous n’avez plus accès à l’inventaire ménage.');
  if(target==='vehicules-inventaire'&&!utilisateurAPermission('acces_admin_menage'))return alert('Vous n’avez plus accès aux inventaires véhicules.');
  if(target.startsWith('caserne:')){const rubrique=obtenirRubriquesCaserne().find(x=>x[0]===target.slice(8));if(!rubrique||!utilisateurPeutVoirRubriqueCaserne(rubrique))return alert('Vous n’avez plus accès à cette rubrique.');}
  if(target==='pharmacie'&&!utilisateurPeutAccederPharmacie())return alert('Vous n’avez plus accès à la pharmacie.');
  await store.read(id,uid);
  await actualiserPointNotifications();
  if(String(utilisateurConnecte?.id)!==String(uid))return;
  if(target==='menage-inventaire'){rubriqueEquipeOrigine='menage';return afficherInventaireMenage();}
  if(target==='vehicules-inventaire'){rubriqueEquipeOrigine='vehicules';return afficherAdminInventairesEquipe();}
  if(target==='heures')return ouvrirRubriqueEquipe('heures');
  if(target.startsWith('caserne:'))return afficherRubriqueCaserne(target.slice(8));
  if(target==='pharmacie')return utilisateurAPermission('acces_inventaire')?afficherInventaire():afficherAccueil();
  return afficherPortailPrincipal();
 }catch(e){console.warn('Ouverture notification :',e);alert('Impossible d’ouvrir cette notification pour le moment.');}
}

function afficherEtatPointNotifications(nonLues){
 const button=document.getElementById('btn-historique-notifications'),point=button?.querySelector('.notif-point');if(!button||!point)return;
 point.hidden=!nonLues;button.setAttribute('aria-label',nonLues?'Notifications non ouvertes':'Historique des notifications');button.title=nonLues?'Notifications non ouvertes':'Notifications';
}
async function actualiserPointNotifications(){
 const uid=utilisateurConnecte?.id;
 if(!uid||!profilUtilisateurConnecte){afficherEtatPointNotifications(false);return;}
 // Une lecture plus récente ou un changement de compte invalide une réponse tardive.
 const sequence=(window.__cisPointNotificationsSequence||0)+1;window.__cisPointNotificationsSequence=sequence;
 try{
  const store=await chargerHistoriqueNotificationsModule(),rows=await store.list(uid);
  if(sequence!==window.__cisPointNotificationsSequence||String(utilisateurConnecte?.id)!==String(uid))return;
  afficherEtatPointNotifications(rows.some(r=>!r.read));
 }catch(e){console.warn('État notifications :',e);}
}

function basculerGestionProfil(type){
 const id=type==='notifications'?'profil-notifications-details':'profil-raccourcis-details',zone=document.getElementById(id),button=document.getElementById('profil-gerer-'+type);if(!zone||!button)return;
 const open=zone.dataset.ouvert!=='true';zone.dataset.ouvert=String(open);zone.style.display=open?'block':'none';button.setAttribute('aria-expanded',String(open));
}

function initialiserStyleAdministratifCarres(){
 if(document.getElementById('administratif-carres-style'))return;
 const style=document.createElement('style');style.id='administratif-carres-style';style.textContent=`
 #app .administratif-carres .garde-menu-cartes{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;max-width:520px;margin:0 auto}
 #app .administratif-carres .garde-menu-carte{aspect-ratio:1/1;width:100%!important;min-width:0!important;min-height:0!important;height:auto!important;box-sizing:border-box;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:10px!important;text-align:center!important;padding:12px!important}
 #app .administratif-carres .garde-menu-carte .ico{margin:0!important;width:48px;height:48px;font-size:26px}#app .administratif-carres .garde-menu-carte strong{font-size:15px;line-height:1.3;overflow-wrap:anywhere}#app .administratif-carres .garde-menu-carte span{margin:0!important}#app .administratif-carres .garde-menu-carte .fleche{display:none!important}
 `;document.head.appendChild(style);
}

// Documents par mail : mêmes modèles que les téléchargements existants.
let envoiDocumentsEquipeEtat=null;
async function pieceJointeDocumentMail(blob,filename){
 if(blob.size>10*1024*1024)throw new Error('Ce document dépasse 10 Mo. Choisis une période plus courte.');
 const content=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=()=>reject(new Error('Lecture du document impossible.'));r.readAsDataURL(blob);});
 return {filename,content};
}
async function lireDocumentsMail(table,select='*',order='id'){
 const rows=[],sb=obtenirClientSupabase();
 for(let offset=0;;offset+=500){const {data,error}=await sb.from(table).select(select).order(order).order('id').range(offset,offset+499);if(error)throw error;rows.push(...(data||[]));if((data?.length||0)<500)break;}
 return rows;
}
function styleEnvoiDocumentsEquipe(){
 if(document.getElementById('envoi-documents-style'))return;
 const s=document.createElement('style');s.id='envoi-documents-style';s.textContent=`.mail-doc-section{background:#fff;border-radius:14px;padding:16px;margin:15px 0}.mail-doc-section h2,.mail-doc-section summary{font-size:18px;font-weight:750;margin:0 0 12px}.mail-doc-section summary{cursor:pointer}.mail-doc-ligne{display:flex;gap:12px;align-items:flex-start;padding:13px 0;border-top:1px solid #e5e9ec;cursor:pointer}.mail-doc-ligne input{width:22px;height:22px;accent-color:#176b45;flex:0 0 auto;margin:1px 0}.mail-doc-ligne strong{display:block}.mail-doc-ligne small{display:block;color:#657079;margin-top:5px}.mail-doc-ligne:has(input:checked){background:#e7f4ec;border-radius:8px;padding-left:10px;padding-right:10px}.mail-doc-ligne[hidden]{display:none}.mail-doc-periode{display:grid;grid-template-columns:1fr 1fr;gap:12px}.mail-doc-periode input,.mail-doc-recherche{box-sizing:border-box;width:100%;padding:12px;border:1px solid #cdd5dc;border-radius:9px;background:white;font:inherit}.mail-doc-destinataire{overflow-wrap:anywhere;color:#53616b}.mail-doc-statut{white-space:pre-line;overflow-wrap:anywhere}.mail-doc-statut.erreur{color:#a22020}.mail-doc-statut.succes{color:#176b45}.mail-doc-envoi{width:100%;border:0;border-radius:12px;padding:16px;background:#176b45;color:white;font:inherit;font-weight:750;cursor:pointer}.mail-doc-envoi:disabled{opacity:.5;cursor:default}.mail-doc-compteur{font-weight:700}.mail-doc-section a{color:#176b45}`;document.head.appendChild(s);
}
async function afficherEnvoiDocumentsEquipe(){
 if(!utilisateurAPermission("acces_envoi_mail"))return alert("Tu n’as pas accès à l’envoi par mail.");
 if(!profilUtilisateurConnecte?.actif)return;
 initialiserStyleEspaceGardeUtilisateur();initialiserStyleActionsEquipe();styleEnvoiDocumentsEquipe();
 const d=new Date(),etat={documents:[],email:'',enCours:false,pending:null};envoiDocumentsEquipeEtat=etat;
 const periode=utilisateurAPermission('acces_admin_menage')||utilisateurAPermission('acces_admin_heures');
 document.getElementById('app').innerHTML=`<main class="garde-section"><button type="button" class="retour-button" data-navigation-equipe onclick="afficherEspaceGarde()">← Espace équipe</button><h1>Envoi par mail</h1><p id="mail-doc-destinataire" class="mail-doc-destinataire">Chargement de l’adresse mail…</p>${periode?`<section class="mail-doc-section"><h2>Période des ménages et des heures</h2><input id="equipe-pdf-mode" type="hidden" value="custom"><div class="mail-doc-periode"><label>Du<input id="equipe-pdf-debut" type="date" value="${dateISOlocale(new Date(d.getFullYear(),d.getMonth(),1))}" onchange="actualiserSelectionDocumentsMail()"></label><label>Au<input id="equipe-pdf-fin" type="date" value="${dateISOlocale(new Date(d.getFullYear(),d.getMonth()+1,0))}" onchange="actualiserSelectionDocumentsMail()"></label></div></section>`:''}<label for="mail-doc-recherche">Rechercher un document</label><input class="mail-doc-recherche" id="mail-doc-recherche" type="search" placeholder="Véhicule, date, document…" oninput="filtrerDocumentsMail(this.value)"><div id="mail-doc-liste" aria-busy="true"></div><p id="mail-doc-compteur" class="mail-doc-compteur">Aucun document sélectionné.</p><button type="button" id="mail-doc-envoyer" class="mail-doc-envoi" onclick="envoyerDocumentsEquipeParMail()" disabled>Recevoir les documents par mail</button><p id="mail-doc-statut" class="mail-doc-statut" role="status" aria-live="polite"></p></main>${navigationPrincipale('','accueil')}`;
 actualiserInterfaceBureau();window.scrollTo({top:0,behavior:'auto'});
 const liste=document.getElementById('mail-doc-liste');
 const ajouter=(type,label,groupe,extra={})=>etat.documents.push({key:etat.documents.length,type,label,groupe,...extra});
 ajouter('planning','Planning des gardes','Équipe',{detail:'Image PNG — planning actuellement affiché dans l’application'});
 if(utilisateurAPermission('acces_admin_menage'))ajouter('menage','Ménages de la période','Équipe',{detail:'PDF — période choisie ci-dessus'});
 if(utilisateurAPermission('acces_admin_heures'))ajouter('heures','Heures de la période','Équipe',{detail:'PDF — période choisie ci-dessus'});
 const afficher=()=>{
  if(!liste.isConnected||envoiDocumentsEquipeEtat!==etat)return;
  liste.innerHTML=[...new Set(etat.documents.map(x=>x.groupe))].map(g=>`<details class="mail-doc-section" ${g==='Équipe'?'open':''}><summary>${echapperHTML(g)}</summary>${etat.documents.filter(x=>x.groupe===g).map(x=>`<label class="mail-doc-ligne" data-mail-document="${x.key}"><input type="checkbox" value="${x.key}" onchange="actualiserSelectionDocumentsMail()"><span><strong>${echapperHTML(x.label)}</strong><small>${echapperHTML(x.detail||'PDF')}</small></span></label>`).join('')}</details>`).join('');
  actualiserSelectionDocumentsMail();
 };
 const travaux=[{nom:'Adresse mail',run:async()=>{
  const {data,error}=await obtenirClientSupabase().from('profils_utilisateurs').select('email_contact').eq('id',utilisateurConnecte.id).single();if(error)throw error;
  etat.email=String(data.email_contact||'').trim();
  const p=document.getElementById('mail-doc-destinataire');if(!liste.isConnected||!p)return;
  p.innerHTML=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(etat.email)?`Envoi à <strong>${echapperHTML(etat.email)}</strong>`:`Aucune adresse mail valide enregistrée. Demande à un administrateur de compléter ton adresse mail dans l’annuaire.`;
 }}];
 if(utilisateurAPermission('acces_admin_menage'))travaux.push({nom:'Inventaires véhicules',run:async()=>{
  const rows=await lireDocumentsMail('cis_inventaires_vehicules','*','created_at');
  for(const r of rows.reverse())ajouter('vehicules',`${r.vehicule_nom||'Véhicule'} — ${inventairesAdminNom(r)}`,'Inventaires véhicules',{id:r.id,detail:new Date(r.created_at).toLocaleString('fr-FR')});
 }});
 if(utilisateurPeutExporterPharmaciePDF())travaux.push({nom:'Traçabilité pharmacie',run:async()=>{
  const rows=await lireDocumentsMail('cis_controles_pharmacie','id,type_controle,date_intervention,numero_intervention,agent_nom,signature_png,created_at','created_at');
  const feuilles={meducore:[],vsav:[]};
  for(const type of ['meducore','vsav']){const lignes=rows.filter(x=>x.type_controle===type);for(let i=0;i<lignes.length;i+=CAPACITE_CONTROLES_PHARMACIE[type])feuilles[type].push(lignes.slice(i,i+CAPACITE_CONTROLES_PHARMACIE[type]));
   feuilles[type].forEach((p,index)=>ajouter(type,`${type==='meducore'?'Contrôles du Meducore':'Entretiens du VSAV'} — feuille ${index+1}`,'Pharmacie',{index,detail:`Du ${p[0].date_intervention} au ${p[p.length-1].date_intervention}`}));
  }etat.feuilles=feuilles;
  for(const r of archivesHistorique||[])ajouter('commande',`Commande du ${formaterDate(r.date)}`,'Pharmacie',{id:r.id,detail:'Archive des consommations'});
 }});
 const rubriques=obtenirRubriquesCaserne().filter(r=>r[0]!=='entretien_individuel'&&(utilisateurEstSPVAdmin()||utilisateurAPermission(r[3])));
 if(rubriques.length)travaux.push({nom:'Événements caserne',run:async()=>{
  const rows=await lireDocumentsMail('caserne_publications','*','created_at');
  for(const r of rows.reverse())if(rubriques.some(x=>x[0]===r.type_publication))ajouter('publication',`${obtenirLibelleTypeCaserne(r.type_publication)} — ${r.titre||'Événement'}`,'Caserne',{id:r.id,rubrique:r.type_publication,detail:r.date_evenement?formaterDateHeureCaserne(r.date_evenement):'Date non renseignée'});
 }});
 if(utilisateurEstSPVAdmin()||utilisateurAPermission('acces_entretien_individuel_admin'))ajouter('entretiens','Planning des entretiens individuels','Caserne',{detail:'PDF — ensemble des rendez-vous réservés'});
 const resultats=await Promise.allSettled(travaux.map(async x=>{let timer;try{return await Promise.race([x.run(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error("Délai de chargement dépassé.")),20000);})]);}finally{clearTimeout(timer);}}));
 if(!liste.isConnected||envoiDocumentsEquipeEtat!==etat)return;
 const echecs=resultats.flatMap((r,i)=>r.status==='rejected'?[travaux[i].nom]:[]);
 afficher();liste.setAttribute('aria-busy','false');
 if(echecs.length){document.getElementById('mail-doc-statut').textContent='Chargement impossible : '+echecs.join(', ')+'. Rouvre cette page pour réessayer.';if(echecs.includes('Adresse mail'))document.getElementById('mail-doc-destinataire').textContent='Adresse mail indisponible.';}
}
function selectionDocumentsMail(){return [...document.querySelectorAll('[data-mail-document] input:checked')].map(x=>envoiDocumentsEquipeEtat?.documents.find(d=>String(d.key)===x.value)).filter(Boolean);}
function actualiserSelectionDocumentsMail(){
 const e=envoiDocumentsEquipeEtat,btn=document.getElementById('mail-doc-envoyer');if(!e||!btn)return;e.pending=null;
 const n=selectionDocumentsMail().length;document.getElementById('mail-doc-compteur').textContent=n?`${n} document${n>1?'s':''} sélectionné${n>1?'s':''} (10 maximum).`:'Aucun document sélectionné.';
 btn.disabled=e.enCours||!navigator.onLine||!n||n>10||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email);
}
function filtrerDocumentsMail(recherche){
 const texte=recherche.trim().toLocaleLowerCase('fr');document.querySelectorAll('[data-mail-document]').forEach(x=>{x.hidden=!!texte&&!x.textContent.toLocaleLowerCase('fr').includes(texte)&&!x.querySelector('input').checked;if(texte&&!x.hidden)x.closest('details').open=true;});
}
async function creerDocumentSelectionneMail(d,etat,periode){
 if(['menage','heures','vehicules'].includes(d.type))return exporterEquipePDF(d.type,d.id||null,true,periode);
 if(d.type==='planning'){const url=await creerPhotoPlanningGarde();return pieceJointeDocumentMail(await (await fetch(url)).blob(),'planning-des-gardes.png');}
 if(d.type==='meducore'||d.type==='vsav'){if(!utilisateurPeutExporterPharmaciePDF())throw new Error('Accès non autorisé.');archivesControlesPharmacie=etat.feuilles;return exporterControlePharmaciePDF(d.type,d.index,true);}
 if(d.type==='commande')return exporterCommandeArchivePDF(d.id,true);
 if(d.type==='entretiens')return exporterEntretiensPDF(true);
 if(d.type==='publication'){
  const rows=await chargerDetailsPublicationsCaserne(await lireDocumentsMail('caserne_publications','*','created_at'));
  const r=rows.find(x=>String(x.id)===String(d.id));if(!r)throw new Error('Événement introuvable.');
  window.__publicationsCaserneParId=window.__publicationsCaserneParId||{};window.__publicationsCaserneParId[d.id]=r;
  return exporterPublicationCasernePDF(d.id,true);
 }
 throw new Error('Document non disponible.');
}
async function envoyerDocumentsEquipeParMail(){
 if(!utilisateurAPermission("acces_envoi_mail"))return alert("Tu n’as pas accès à l’envoi par mail.");
 const e=envoiDocumentsEquipeEtat,btn=document.getElementById('mail-doc-envoyer'),statut=document.getElementById('mail-doc-statut');if(!e||e.enCours||!btn||!statut)return;
 const selected=selectionDocumentsMail();if(!navigator.onLine){statut.textContent='Une connexion Internet est nécessaire.';return;}if(!selected.length||selected.length>10)return;
 e.enCours=true;btn.disabled=true;statut.className='mail-doc-statut';
 const inputs=[...document.querySelectorAll('[data-mail-document] input,#equipe-pdf-debut,#equipe-pdf-fin')];inputs.forEach(x=>x.disabled=true);
 try{
  if(!e.pending){const documents=[];let total=0;const periode=selected.some(d=>d.type==='menage'||d.type==='heures')?lirePeriodePDFEquipe():null;
   for(let i=0;i<selected.length;i++){const d=selected[i];statut.textContent=`Préparation du document ${i+1}/${selected.length}…`;const piece=await creerDocumentSelectionneMail(d,e,periode);if(!piece)throw new Error('Impossible de préparer : '+d.label);total+=Math.floor(piece.content.length*3/4)-(piece.content.endsWith('==')?2:piece.content.endsWith('=')?1:0);if(total>10*1024*1024)throw new Error('La sélection dépasse 10 Mo. Réduis le nombre de documents.');documents.push({...piece,type:d.type,rubrique:d.rubrique});}
   e.pending={request_id:crypto.randomUUID(),documents};
  }
  statut.textContent='Envoi du mail…';
  const {data,error}=await appelerFonctionPrincipale(obtenirClientSupabase(),'envoi-documents',{body:e.pending});
  if(error){let message=error.message;try{const details=await error.context.json();message=details.error||message;}catch(_){}throw new Error(message==='Failed to send a request to the Edge Function'?'Le service d’envoi est indisponible. Vérifie que la fonction envoi-documents est installée.':message);}
  if(!data?.ok)throw new Error(data?.error||'L’envoi n’a pas été confirmé.');
  if(statut.isConnected){statut.className='mail-doc-statut succes';statut.textContent=`Mail envoyé à ${data.email}. Vérifie également les courriers indésirables.`;document.querySelectorAll('[data-mail-document] input:checked').forEach(x=>x.checked=false);}e.pending=null;
 }catch(err){if(statut.isConnected){statut.className='mail-doc-statut erreur';statut.textContent=err.message||'Envoi impossible. Réessaie dans un instant.';}}
 finally{e.enCours=false;inputs.forEach(x=>x.disabled=false);if(envoiDocumentsEquipeEtat===e&&btn.isConnected){const pending=e.pending;actualiserSelectionDocumentsMail();e.pending=pending;}}
}













let suiviVSAVChargement;async function ouvrirSuiviVSAVPharma(){try{if(!window.CISSuiviVSAV){suiviVSAVChargement=suiviVSAVChargement||new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='./suivi-vsav.js?v=1';s.onload=resolve;s.onerror=()=>{suiviVSAVChargement=null;reject(Error('Module Suivi VSAV indisponible.'));};document.head.appendChild(s);});await suiviVSAVChargement;}await CISSuiviVSAV.ouvrir();}catch(e){alert(e.message);}}



