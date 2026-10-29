(function(g){'use strict';
 const nom=p=>[p.prenom,p.nom].filter(Boolean).join(' ');
 const date=s=>s?new Date(s).toLocaleString('fr-FR',{timeZone:'Europe/Paris',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'Non renseignée';
 async function creer(d,modele,lib){
  const original=await lib.PDFDocument.load(modele),pdf=await lib.PDFDocument.create();const pages=await pdf.copyPages(original,[0]);pdf.addPage(pages[0]);
  const font=await pdf.embedFont(lib.StandardFonts.Helvetica),bold=await pdf.embedFont(lib.StandardFonts.HelveticaBold),page=pdf.getPages()[0],H=page.getHeight(),annexes=[];
  const safe=s=>[...String(s??'')].map(c=>{if(c==='\n')return c;if(c==='\t')return ' ';try{font.encodeText(c);return c;}catch(_){return c.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7e]/g,'?');}}).join('');
  function lignes(s,width,size,f=font){const out=[];for(const para of safe(s).split('\n')){let line='';for(const word of para.split(/\s+/)){if(!word)continue;if(f.widthOfTextAtSize((line?line+' ':'')+word,size)<=width)line+=(line?' ':'')+word;else{if(line)out.push(line);line='';let chunk='';for(const ch of word){if(f.widthOfTextAtSize(chunk+ch,size)>width){out.push(chunk);chunk='';}chunk+=ch;}line=chunk;}}out.push(line);}return out;}
  function bloc(s,x,top,width,height,{taille=8,min=7,gras=false,titre='Complément'}={}){if(!s)return;let size=taille,ls;const f=gras?bold:font;for(;;){ls=lignes(s,width,size,f);if(ls.length*size*1.25<=height||size<=min)break;size-=.25;}if(ls.length*size*1.25>height){const repere=annexes.length+1;annexes.push({titre:repere+'. '+titre,texte:s});ls=lignes('Voir annexe, repere '+repere+'.',width,7,font);size=7;}ls.forEach((line,i)=>page.drawText(line,{x,y:H-top-size-i*size*1.25,size,font:f,color:lib.rgb(.08,.08,.08)}));}
  bloc(`${d.equipe_nom} - Semaine ${d.semaine_iso} / ${d.annee_iso} - ${d.valide_le?(d.validation_incomplete?'VALIDÉE - INCOMPLÈTE':'VALIDÉE'):'EN ATTENTE DE VALIDATION'}`,13,83,505,14,{taille:8,min:7,gras:true,titre:'Identification de la garde'});
  for(const l of d.lignes){if(l.etat==='fait'||l.etat==='non_fait')page.drawText('X',{x:l.etat==='fait'?272:316,y:H-(l.haut+l.bas)/2-4,size:11,font:bold});bloc((l.etat!=='fait'?(l.etat==='non_fait'?'Non fait. ':'Non complété. '):'')+(l.avec_anomalie?'Réalisé avec anomalie. ':'')+(l.observation||''),343,l.haut+3,170,l.bas-l.haut-6,{titre:l.titre});}
  bloc(date(d.date_controle),13,685,165,43,{taille:9,titre:'Date de l’auto-contrôle'});
  const names=(d.personnes||[]).map(nom).join(', ');bloc(names||'Aucune réalisation enregistrée',189,685,197,50,{taille:9,titre:'Réalisé par'});
  const h=Math.floor((d.minutes||0)/60),m=(d.minutes||0)%60;bloc(`${h} h ${String(m).padStart(2,'0')}\nDurées renseignées`,395,685,122,43,{taille:9,titre:'Durée des travaux'});
  if(d.valide_le&&d.valide_signature_png){
   // Signature figée lors de la validation, jamais relue depuis le profil à l’export.
   let signature;try{signature=await pdf.embedPng(d.valide_signature_png);}catch(_){throw Error('La signature du chef de garde enregistrée sur cette fiche est illisible. Le PDF n’a pas été généré.');}
   const facteur=Math.min(180/signature.width,33/signature.height);
   page.drawImage(signature,{x:13,y:H-800,width:signature.width*facteur,height:signature.height*facteur});
   bloc(d.valide_nom,13,803,500,13,{taille:10,min:8,gras:true,titre:'Nom du chef de garde'});
   bloc(`Validé le ${date(d.valide_le)} - version ${d.revision}`,13,818,500,12,{taille:8,min:7,titre:'Date de validation'});
  }else{
  bloc(d.valide_le?`${d.valide_nom}\nValidé le ${date(d.valide_le)} - version ${d.revision}`:'En attente de validation du chef de garde',13,767,500,43,{taille:10,min:8,titre:'Validation du responsable de garde'});
  }
  if(d.consigne_suivante)annexes.push({titre:'Consignes pour l’équipe suivante',texte:d.consigne_suivante});
  const statut=v=>({attente:'À compléter',en_cours:'Partiellement réalisé',fait:'Fait',non_fait:'Non réalisé'})[v]||v||'Non renseigné';
  let precedent=null;for(const j of d.journal||[]){const c=j.contenu||{},doc=c.document||(Array.isArray(c.lignes)?c:null),changements=[];
   if(j.action==='correction'){const x=c.correction||{};changements.push((c.avant?.titre||c.cle||'Rubrique')+' : '+statut(c.avant?.etat)+' -> '+(x.annulee?'Suivi automatique':statut(x.etat)));if(!x.annulee)changements.push('Observation : '+(c.avant?.observation||'Aucune')+' -> '+(x.observation||'Aucune'));}
   else if(j.action==='transmission')changements.push('Consignes : '+(c.avant||'Aucune')+' -> '+(c.apres||'Aucune'));
   else if(doc&&precedent){for(const l of doc.lignes||[]){const old=(precedent.lignes||[]).find(x=>x.cle===l.cle);if(old&&(old.etat!==l.etat||old.observation!==l.observation))changements.push(l.titre+' : '+statut(old.etat)+' -> '+statut(l.etat)+'; observation : '+(old.observation||'Aucune')+' -> '+(l.observation||'Aucune'));}if(doc.minutes!==precedent.minutes)changements.push('Durée : '+precedent.minutes+' -> '+doc.minutes+' min');if(JSON.stringify(doc.personnes)!==JSON.stringify(precedent.personnes))changements.push('Personnel : '+(precedent.personnes||[]).map(nom).join(', ')+' -> '+(doc.personnes||[]).map(nom).join(', '));}
   if(c.motif)changements.push('Motif : '+c.motif);if(doc)precedent=doc;
   annexes.push({titre:'Historique - '+date(j.date)+' - '+j.auteur+' - '+j.action+' (version '+j.revision+')',texte:changements.join('\n')||'Aucune modification des rubriques, participants ou durées.'});
  }
  let annexe=null,y=0;
  function nouveau(){annexe=pdf.addPage([595.276,841.89]);y=48;annexe.drawText('Fiche de fin de garde - Compléments',{x:38,y:805,size:14,font:bold});annexe.drawText(safe(`${d.equipe_nom} - Semaine ${d.semaine_iso} / ${d.annee_iso}`),{x:38,y:785,size:9,font});y=76;}
  for(const a of annexes){if(!annexe||y>730)nouveau();for(const [text,gras] of [[a.titre,true],[a.texte,false]])for(const line of lignes(text,515,9,gras?bold:font)){if(y>790)nouveau();annexe.drawText(line,{x:38,y:841.89-y-9,size:9,font:gras?bold:font});y+=12;}y+=18;}
  pdf.setTitle(`Fiche de fin de garde - ${d.equipe_nom} - ${d.date_garde}`);pdf.setSubject(d.valide_le?'Fiche validée par le chef de garde':'Fiche en attente de validation');
  return pdf.save();
 }
 g.CISFichePDF={creer,date,nom};
})(globalThis);


