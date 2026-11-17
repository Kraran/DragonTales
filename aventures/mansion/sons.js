// Mansion of Doom — bruitages du manoir, synthétisés comme ceux du moteur (moteur/sfx.js) : aucun fichier son.
// Chaque son reçoit (contexte audio, sortie, instant de départ, outils tone/hiss/noiseSrc/env/swell).
// Les bips (SOUND) et le coup de feu en PLAY du programme d'origine sont joués à part, par le moteur, dans les deux versions ;
// ces bruitages-ci ne jouent que dans la version moderne.
const MD_SFX={
 // grincement de bois : porte, cercueil, cassette, trappe (hauteur et durée réglables)
 md_creak(c,o,t,H,k){ k=k||{}; const f=k.f||420, d=k.d||1.1, bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=f*2.2; bp.Q.value=6; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(f*.18,t); os.frequency.linearRampToValueAtTime(f*.3,t+d*.5); os.frequency.linearRampToValueAtTime(f*.16,t+d);
   const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=k.r||17; lg.gain.value=f*.05; l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t+d+.05);
   os.connect(H.env(c,bp,t,.08,k.p||.9,d)); os.start(t); os.stop(t+d+.05); },
 md_door(c,o,t,H){ MD_SFX.md_creak(c,o,t,H,{f:520,d:1.2}); H.tone(c,o,t+1.15,{f0:90,f1:60,dur:.35,peak:.35,attack:.005}); },
 md_coffin(c,o,t,H){ MD_SFX.md_creak(c,o,t,H,{f:260,d:2.2,r:9,p:1}); H.hiss(c,o,t+2,{dur:.8,peak:.2,f0:600,f1:200,attack:.1}); H.tone(c,o,t+.2,{f0:55,dur:2.4,peak:.18,attack:.8}); },
 md_casket(c,o,t,H){ MD_SFX.md_creak(c,o,t,H,{f:700,d:.8,r:23}); },
 md_trapdoor(c,o,t,H){ MD_SFX.md_creak(c,o,t,H,{f:360,d:.9}); H.tone(c,o,t+.85,{f0:110,f1:50,dur:.5,peak:.45,attack:.003}); H.hiss(c,o,t+.85,{dur:.5,peak:.3,f0:900,f1:200,attack:.003}); },
 // le coffre du grenier : déclic, puis la chute
 md_trap(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:2400,dur:.03,peak:.3,attack:.001}); H.tone(c,o,t+.08,{type:'square',f0:1700,dur:.03,peak:.25,attack:.001});
   H.tone(c,o,t+.3,{type:'triangle',f0:900,f1:90,dur:1.3,peak:.3,attack:.02}); H.hiss(c,o,t+.3,{dur:1.3,peak:.25,f0:3000,f1:400,attack:.2}); },
 // le corps qui s'écrase au fond du puits
 md_splat(c,o,t,H){ H.tone(c,o,t,{f0:120,f1:40,dur:.5,peak:.7,attack:.002}); H.hiss(c,o,t,{dur:.35,peak:.6,f0:1500,f1:150,attack:.002}); },
 // quelque chose tombe (le sac, la balle)
 md_thud(c,o,t,H){ H.tone(c,o,t,{f0:150,f1:70,dur:.25,peak:.4,attack:.003}); H.hiss(c,o,t,{dur:.15,peak:.25,f0:800,attack:.003}); },
 // prendre et poser
 md_take(c,o,t,H){ H.hiss(c,o,t,{dur:.14,peak:.18,type:'bandpass',f0:2600,Q:1.2,attack:.01}); },
 md_drop(c,o,t,H){ H.tone(c,o,t,{f0:180,f1:110,dur:.18,peak:.28,attack:.003}); },
 // l'interrupteur à couteau : le claquement, l'arc électrique, puis le bourdonnement du courant
 md_switch(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:160,f1:90,dur:.12,peak:.4,attack:.001}); H.hiss(c,o,t+.02,{dur:.25,peak:.5,type:'highpass',f0:5000,attack:.001});
   MD_SFX.md_hum(c,o,t+.2,H); },
 md_hum(c,o,t,H){ [50,100,150].forEach((f,i)=>H.tone(c,o,t,{type:i?'sine':'sawtooth',f0:f,dur:1.8,peak:.1-i*.025,attack:.3})); },
 md_lightsout(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:160,f1:90,dur:.12,peak:.4,attack:.001}); H.tone(c,o,t+.1,{type:'sawtooth',f0:100,f1:30,dur:1,peak:.12,attack:.01}); },
 // l'acide qui bouillonne
 md_acid(c,o,t,H){ H.hiss(c,o,t,{dur:2,peak:.3,type:'highpass',f0:3000,attack:.3}); for(let i=0;i<16;i++){ const f=180+Math.random()*420; H.tone(c,o,t+i*.12+Math.random()*.05,{f0:f,f1:f*2.2,dur:.07,peak:.22,attack:.01}); } },
 md_fizz(c,o,t,H){ H.hiss(c,o,t,{dur:2.4,peak:.6,type:'highpass',f0:2200,f1:6000,attack:.05}); MD_SFX.md_acid(c,o,t+.3,H); },
 // le serpent siffle, la mangouste le chasse
 md_snake(c,o,t,H){ H.hiss(c,o,t,{dur:1,peak:.4,type:'highpass',f0:5500,attack:.15}); for(let i=0;i<6;i++) H.tone(c,o,t+.9+i*.1,{type:'triangle',f0:1800+Math.random()*600,f1:2600,dur:.06,peak:.12,attack:.005}); H.hiss(c,o,t+1.1,{dur:.6,peak:.25,f0:1200,f1:300,attack:.02}); },
 md_chirp(c,o,t,H){ for(let i=0;i<4;i++) H.tone(c,o,t+i*.11,{type:'triangle',f0:2000+i*150,f1:2900,dur:.07,peak:.14,attack:.005}); H.tone(c,o,t+.5,{type:'square',f0:520,dur:.25,peak:.08,attack:.002}); },
 // la fiole qui se brise, et le temps qui recule
 md_shatter(c,o,t,H){ H.hiss(c,o,t,{dur:.15,peak:.6,type:'highpass',f0:3500,attack:.001}); [2637,3520,4186,3136].forEach((f,i)=>H.tone(c,o,t+.02+i*.05,{f0:f,dur:.4,peak:.08,attack:.002}));
   [1568,1319,1047,784,523].forEach((f,i)=>H.tone(c,o,t+.6+i*.12,{f0:f,dur:.6,peak:.09,attack:.01})); },
 // un coup de vent souffle la bougie
 md_gust(c,o,t,H){ H.hiss(c,o,t,{dur:1.4,peak:.45,type:'bandpass',f0:500,f1:1400,Q:.8,attack:.4}); },
 // le vent sur la lande, devant le manoir
 md_wind(c,o,t,H){ const n=H.noiseSrc(c), bp=c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=4; bp.frequency.setValueAtTime(300,t); bp.frequency.linearRampToValueAtTime(700,t+1.2); bp.frequency.linearRampToValueAtTime(380,t+2.6);
   n.connect(bp); bp.connect(H.swell(c,o,t,2.8,.5)); n.start(t); n.stop(t+2.9); },
 // la chouette, la nuit
 md_owl(c,o,t,H){ [[0,.5],[.7,.25],[1,.7]].forEach(([d,l])=>H.tone(c,o,t+d,{f0:420,f1:380,dur:l,peak:.2,attack:.05,vib:6,vibDepth:8})); },
 // le glas du soir, au loin
 md_toll(c,o,t,H){ for(let i=0;i<3;i++) [[1,.22,3.5],[2.4,.1,2.2],[3.2,.06,1.4]].forEach(p=>H.tone(c,o,t+i*1.6,{f0:196*p[0],dur:p[2],peak:p[1],attack:.004})); },
 // les chauves-souris : battements d'ailes et cris aigus
 md_bats(c,o,t,H){ for(let i=0;i<14;i++) H.hiss(c,o,t+i*.09+Math.random()*.04,{dur:.06,peak:.25,type:'bandpass',f0:900,Q:1.5,attack:.005});
   for(let i=0;i<5;i++) H.tone(c,o,t+.2+Math.random()*1.1,{f0:5200+Math.random()*1800,f1:4200,dur:.05,peak:.07,attack:.003}); },
 // les rats
 md_rats(c,o,t,H){ for(let i=0;i<4;i++) H.tone(c,o,t+i*.2+Math.random()*.08,{type:'triangle',f0:3200+Math.random()*900,f1:2600,dur:.08,peak:.1,attack:.005});
   for(let i=0;i<8;i++) H.hiss(c,o,t+.8+i*.05,{dur:.03,peak:.12,type:'highpass',f0:4000,attack:.002}); },
 // la ménagerie : bêtes en cage
 md_beasts(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:90,f1:70,dur:.8,peak:.14,attack:.1,vib:20,vibDepth:12}); MD_SFX.md_chirp(c,o,t+.9,H); H.tone(c,o,t+1.4,{type:'square',f0:660,f1:880,dur:.2,peak:.05,attack:.01}); },
 // gouttes d'eau dans la pierre
 md_drip(c,o,t,H){ for(let i=0;i<4;i++){ const f=900+Math.random()*700; H.tone(c,o,t+i*.5+Math.random()*.2,{f0:f,f1:f*1.6,dur:.08,peak:.16,attack:.004}); } },
 // les vers qui grouillent, le sol gluant
 md_squelch(c,o,t,H){ for(let i=0;i<6;i++) H.hiss(c,o,t+i*.18+Math.random()*.1,{dur:.12,peak:.22,type:'bandpass',f0:400+Math.random()*300,Q:3,attack:.02}); },
 // le grondement grave d'une crypte
 md_drone(c,o,t,H){ H.tone(c,o,t,{f0:55,dur:2.6,peak:.2,attack:.9}); H.tone(c,o,t,{f0:57,dur:2.6,peak:.16,attack:.9}); H.tone(c,o,t+.5,{type:'triangle',f0:82.4,dur:2,peak:.06,attack:.8}); },
 // un cœur qui bat dans le noir
 md_heart(c,o,t,H){ for(let i=0;i<3;i++){ H.tone(c,o,t+i*.8,{f0:60,f1:40,dur:.14,peak:.5,attack:.005}); H.tone(c,o,t+i*.8+.18,{f0:55,f1:38,dur:.12,peak:.35,attack:.005}); } },
 // la chapelle : un accord d'orgue
 md_organ(c,o,t,H){ [130.8,196,261.6,311.1].forEach((f,i)=>{ H.tone(c,o,t,{type:'triangle',f0:f,dur:2.6,peak:.07,attack:.5}); H.tone(c,o,t,{f0:f*2,dur:2.6,peak:.03,attack:.5}); }); },
 // la galerie des glaces et la salle magique : un scintillement
 md_shimmer(c,o,t,H){ [1047,1319,1568,2093,2637].forEach((f,i)=>H.tone(c,o,t+i*.13,{f0:f,dur:1.4,peak:.06,attack:.05,vib:5,vibDepth:6})); },
 // le feu de cheminée
 md_hearth(c,o,t,H){ H.hiss(c,o,t,{dur:2,peak:.2,f0:500,attack:.5}); for(let i=0;i<10;i++) H.hiss(c,o,t+.1+Math.random()*1.7,{dur:.03,peak:.3,type:'highpass',f0:2500+Math.random()*2500,attack:.001}); },
 // la cuisine, la chambre froide : le bourdonnement du froid
 md_cold(c,o,t,H){ H.hiss(c,o,t,{dur:2.2,peak:.12,type:'bandpass',f0:2800,Q:4,attack:.6}); H.tone(c,o,t,{f0:110,dur:2.2,peak:.05,attack:.6}); },
 // les sables mouvants
 md_glug(c,o,t,H){ for(let i=0;i<6;i++){ const f=90+Math.random()*80; H.tone(c,o,t+i*.28,{f0:f,f1:f*1.8,dur:.18,peak:.35,attack:.02}); } H.hiss(c,o,t,{dur:2,peak:.2,f0:300,attack:.4}); },
 // les fers qui tombent
 md_chains(c,o,t,H){ for(let i=0;i<9;i++) H.tone(c,o,t+i*.07+Math.random()*.03,{type:'square',f0:2200+Math.random()*1800,dur:.05,peak:.07,attack:.001}); H.tone(c,o,t+.7,{f0:300,f1:200,dur:.3,peak:.2,attack:.002}); },
 // le pieu enfoncé dans le cœur du vampire : coups de maillet, puis son dernier cri
 md_stake(c,o,t,H){ for(let i=0;i<3;i++) H.tone(c,o,t+i*.35,{f0:130,f1:70,dur:.2,peak:.6,attack:.002});
   const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1200; bp.Q.value=3; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(700,t+1.1); os.frequency.exponentialRampToValueAtTime(180,t+2.4);
   const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=9; lg.gain.value=40; l.connect(lg); lg.connect(os.frequency); l.start(t+1.1); l.stop(t+2.5);
   os.connect(H.env(c,bp,t+1.1,.05,.6,1.3)); os.start(t+1.1); os.stop(t+2.5); },
 // la morsure du vampire
 md_bite(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:110,dur:1.2,peak:.18,attack:.02}); H.tone(c,o,t,{type:'sawtooth',f0:116.5,dur:1.2,peak:.18,attack:.02}); MD_SFX.md_heart(c,o,t+.6,H); },
 // la princesse tombe en cendres
 md_ash(c,o,t,H){ H.hiss(c,o,t,{dur:2.4,peak:.4,type:'bandpass',f0:2400,f1:300,Q:.7,attack:.2}); [220,207.7,196,174.6].forEach((f,i)=>H.tone(c,o,t+i*.35,{type:'triangle',f0:f,dur:1,peak:.12,attack:.02})); },
 // la princesse retrouvée
 md_found(c,o,t,H){ [523,659,784,1047].forEach((f,i)=>H.tone(c,o,t+i*.12,{f0:f,dur:1.2,peak:.12,attack:.01})); },
 // trouver quelque chose (livres, passage)
 md_find(c,o,t,H){ [784,988,1319].forEach((f,i)=>H.tone(c,o,t+i*.09,{f0:f,dur:.7,peak:.1,attack:.004})); },
 // la foule du village qui acclame
 md_cheer(c,o,t,H){ for(let k=0;k<3;k++) H.hiss(c,o,t+k*.15,{dur:2.4-k*.3,peak:.35,type:'bandpass',f0:900+k*500,Q:.9,attack:.25});
   for(let i=0;i<10;i++) H.tone(c,o,t+.2+Math.random()*1.6,{type:'triangle',f0:500+Math.random()*700,f1:900+Math.random()*600,dur:.25,peak:.05,attack:.02}); },
 // la place du village : murmure de la foule
 md_crowd(c,o,t,H){ H.hiss(c,o,t,{dur:2.4,peak:.16,type:'bandpass',f0:700,Q:1.2,attack:.6}); H.hiss(c,o,t+.3,{dur:2,peak:.1,type:'bandpass',f0:1500,Q:1.5,attack:.6}); }
};
// Bruitage d'une ligne affichée par le jeu (en anglais, telle que le programme l'écrit). cmd : la commande anglaise.
function mdSfxFor(line,cmd,mem){
  const l=line.replace(/ +/g,' '), c=cmd||'';
  if(/SOMETHING CLICKED/.test(l)) return 'md_trap';
  if(/YOU ARE FALLING/.test(l)) return 'fall';
  if(/SPLAT/.test(l)) return 'md_splat';
  if(/WEREWOLF JUST RIPPED/.test(l)) return 'growl';
  if(/^BANG/.test(l.trim())) return 'shot';
  if(/^CLICK$/.test(l.trim())) return 'click';
  if(/COFFIN CREAKS OPEN/.test(l)) return 'md_coffin';
  if(/CASKET CREAKS OPEN/.test(l)) return 'md_casket';
  if(/YOU SEE A WAY DOWN/.test(l)) return 'md_trapdoor';
  if(/RED GLOW/.test(l)) return 'md_switch';
  if(/LIGHTS WENT OUT/.test(l)) return 'md_lightsout';
  if(/ACID BUBBLES FURIOUSLY/.test(l)) return 'md_fizz';
  if(/MONGOOSE CHASED/.test(l)) return 'md_snake';
  if(/CAUGHT THE MONGOOSE/.test(l)) return 'md_chirp';
  if(/BOTTLE SHATTERED/.test(l)) return 'md_shatter';
  if(/GUST OF WIND/.test(l)) return 'md_gust';
  if(/STAKE THROUGH THE HEART/.test(l)) return 'md_stake';
  if(/VAMPIRE (JUST ATTACKED|ATTACKS YOU)/.test(l)) return 'md_bite';
  if(/BIT BY THE BATS/.test(l)) return 'md_bats';
  if(/SHACKELS FALL AWAY/.test(l)) return 'md_chains';
  if(/TURNS TO ASH|ASHES CRUMBLE/.test(l)) return 'md_ash';
  if(/YOU FOUND THE PRINCESS/.test(l)) return 'md_found';
  if(/YOU FOUND A|SOMETHING FELL OUT|A SACK FELL OUT/.test(l)) return /FELL/.test(l)?'md_thud':'md_find';
  if(/QUICKSAND SWALLOWS/.test(l)) return 'md_glug';
  if(/WON THIS ADVENTURE/.test(l)) return 'md_cheer';
  if(/YOU ARE (VERY )?DEAD|YOU HAVE LOST/.test(l)) return 'death';
  if(/^OK, (IT|HE|SHE|THEY) (IS|ARE) OPEN/.test(l)&&/^OPEN DOO/.test(c)) return 'md_door';
  if(/^OK, YOU HAVE /.test(l)||/LOADED THE/.test(l)) return 'md_take';
  if(/^OK, YOU DROPPED/.test(l)) return 'md_drop';
  // à l'invite : le soir tombe, puis la nuit (le glas sonne au loin)
  if(/WHAT NOW/.test(l)&&mem){ const h=mem.v('H'), r=mem.v('R'); if(r&&((h>=r-90&&h-2<r-90)||(h>=r&&h-2<r))) return 'md_toll'; }
  return null;
}
// Ambiance à l'entrée d'un lieu (numéro du lieu 1 à 77)
function mdAmbient(mem,r){
  const night=mem.v('R')&&mem.v('H')>=mem.v('R'), dark=r>48&&mem.v('A6')===0;
  if(r===1) return night?['md_wind','md_owl']:['md_wind','crow'];
  if(r===77) return ['md_crowd','bell'];
  if(dark) return ['md_heart'];
  const A={18:['md_rats'],24:['md_beasts'],25:['md_cold'],26:['md_cold'],31:['md_shimmer'],35:['md_organ'],39:['md_hearth'],12:['md_drip'],
   47:['md_squelch'],52:['md_shimmer'],53:['md_acid'],55:['md_drip','md_squelch'],60:['md_heart'],63:['md_wind'],65:['md_wind'],66:['md_bats'],
   67:['md_drip'],69:['md_drip'],70:['md_wind'],71:['md_glug'],72:['md_drip'],73:['md_drip'],75:['md_drone'],76:['fall'],62:['md_drip'],64:['md_drone'],56:['md_drone']};
  if(r===48&&mem.v('A6')===1) return ['md_hum'];
  if(r===74) return mem.v('A8')===1?['md_drip']:['md_acid'];
  return A[r]||[];
}
