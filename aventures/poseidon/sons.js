// S.S. Poseidon — bruitages du navire, synthétisés comme ceux du moteur (moteur/sfx.js) : aucun fichier son.
// Chaque son reçoit (contexte audio, sortie, instant de départ, outils tone/hiss/noiseSrc/env/swell).
// Les bips (SOUND) et les petits airs (PLAY) du programme d'origine sont joués à part, par le moteur.
const PS_SFX={
 // la vapeur qui fuse dans la cuisine
 ps_steam(c,o,t,H){ H.hiss(c,o,t,{dur:1.6,peak:.32,type:'highpass',f0:2600,attack:.25}); H.hiss(c,o,t+.5,{dur:1.1,peak:.18,type:'bandpass',f0:5200,Q:1.2,attack:.05}); },
 // un incendie : grondement sourd et crépitements
 ps_fire(c,o,t,H){ H.hiss(c,o,t,{dur:2,peak:.4,f0:420,attack:.5});
   for(let i=0;i<14;i++) H.hiss(c,o,t+.1+Math.random()*1.7,{dur:.03,peak:.35+Math.random()*.3,type:'highpass',f0:2500+Math.random()*3000,attack:.001}); },
 // la salle des machines : ronronnement grave, coups de piston
 ps_engine(c,o,t,H){ [48,72,96].forEach((f,i)=>H.tone(c,o,t,{type:'sawtooth',f0:f,dur:2.2,peak:.12-i*.03,attack:.6}));
   for(let i=0;i<4;i++) H.hiss(c,o,t+.3+i*.45,{dur:.12,peak:.3,f0:900,attack:.005}); },
 // la salle de bal inondée : l'eau qui s'engouffre
 ps_flood(c,o,t,H){ H.hiss(c,o,t,{dur:2.2,peak:.5,f0:700,f1:300,attack:.4}); H.hiss(c,o,t+.2,{dur:1.6,peak:.2,type:'bandpass',f0:1800,Q:.6,attack:.3}); },
 // la coque gémit : tôle qui se tord
 ps_creak(c,o,t,H){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=520; bp.Q.value=5; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(70,t); os.frequency.linearRampToValueAtTime(110,t+.9); os.frequency.linearRampToValueAtTime(64,t+1.7);
   const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=13; lg.gain.value=18; l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t+1.8);
   os.connect(H.env(c,bp,t,.3,.8,1.75)); os.start(t); os.stop(t+1.8); },
 // grimper au câble : le câble d'acier qui grince, efforts
 ps_climb(c,o,t,H){ for(let i=0;i<5;i++){ const s=t+i*.32; H.tone(c,o,s,{type:'triangle',f0:1300+i*60,f1:1100+i*60,dur:.16,peak:.08,attack:.01}); H.hiss(c,o,s,{dur:.12,peak:.22,type:'bandpass',f0:1400,Q:2,attack:.01}); }
   PS_SFX.ps_creak(c,o,t+1.5,H); },
 // la porte d'acier arrachée : grincement aigu, puis le choc
 ps_door(c,o,t,H){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1500; bp.Q.value=7; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(220,t); os.frequency.linearRampToValueAtTime(420,t+.8);
   const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=31; lg.gain.value=60; l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t+.95);
   os.connect(H.env(c,bp,t,.05,.6,.9)); os.start(t); os.stop(t+.95);
   [180,262,371,523].forEach((f,i)=>H.tone(c,o,t+.95,{f0:f,dur:1.6-i*.25,peak:.2-i*.03,attack:.002})); H.hiss(c,o,t+.95,{dur:.4,peak:.5,f0:1200,f1:200,attack:.002}); },
 // trouver quelque chose
 ps_find(c,o,t,H){ [784,988,1319].forEach((f,i)=>H.tone(c,o,t+i*.09,{f0:f,dur:.7,peak:.12,attack:.004})); },
 // le mur d'eau
 ps_wave(c,o,t,H){ H.hiss(c,o,t,{dur:2.4,peak:.85,f0:2600,f1:260,attack:.3}); H.tone(c,o,t,{f0:60,f1:35,dur:2,peak:.5,attack:.3}); PS_SFX.ps_bubbles(c,o,t+1.6,H); },
 ps_bubbles(c,o,t,H){ for(let i=0;i<9;i++){ const f=200+Math.random()*500; H.tone(c,o,t+i*.13+Math.random()*.06,{f0:f,f1:f*1.9,dur:.08,peak:.3,attack:.01}); } },
 // la chute dans le mazout en flammes
 ps_oil(c,o,t,H){ H.tone(c,o,t,{type:'triangle',f0:800,f1:120,dur:.9,peak:.25,attack:.03}); H.hiss(c,o,t+.85,{dur:1.6,peak:.7,f0:3000,f1:300,attack:.01}); PS_SFX.ps_fire(c,o,t+1.1,H); },
 // l'extincteur
 ps_extinguish(c,o,t,H){ H.hiss(c,o,t,{dur:1.8,peak:.55,type:'highpass',f0:1800,attack:.03}); H.hiss(c,o,t+1.6,{dur:.6,peak:.2,f0:500,f1:150,attack:.05}); },
 // une coupure
 ps_cut(c,o,t,H){ H.hiss(c,o,t,{dur:.18,peak:.5,type:'highpass',f0:4000,f1:1500,attack:.002}); H.tone(c,o,t+.15,{type:'triangle',f0:330,f1:260,dur:.4,peak:.15,attack:.01}); },
 // boire les vitamines, puis le vertige
 ps_drink(c,o,t,H){ for(let i=0;i<3;i++) H.tone(c,o,t+i*.28,{f0:180,f1:90,dur:.16,peak:.35,attack:.01});
   [440,466,494].forEach((f,i)=>H.tone(c,o,t+1,{f0:f,dur:1.3,peak:.05,attack:.4,vib:5,vibDepth:20})); },
 ps_burp(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:95,f1:70,dur:.5,peak:.3,attack:.03,vib:28,vibDepth:15}); },
 // se balancer au bout de la corde
 ps_swing(c,o,t,H){ H.hiss(c,o,t,{dur:.9,peak:.4,type:'bandpass',f0:500,f1:1600,Q:1.2,attack:.4}); H.hiss(c,o,t+.95,{dur:.12,peak:.4,f0:800,attack:.002}); },
 // nouer la corde
 ps_tie(c,o,t,H){ for(let i=0;i<4;i++) H.hiss(c,o,t+i*.14,{dur:.11,peak:.3,type:'bandpass',f0:1100+i*200,Q:2,attack:.02}); H.hiss(c,o,t+.65,{dur:.06,peak:.4,f0:600,attack:.002}); },
 // le passage secret : un panneau glisse, et l'eau entre
 ps_secret(c,o,t,H){ H.hiss(c,o,t,{dur:.9,peak:.4,type:'bandpass',f0:300,Q:1.5,attack:.1}); H.tone(c,o,t,{type:'sawtooth',f0:55,dur:.9,peak:.12,attack:.1}); PS_SFX.ps_flood(c,o,t+.9,H); },
 // plus de lumière
 ps_dark(c,o,t,H){ [55,58].forEach(f=>H.tone(c,o,t,{f0:f,dur:2.4,peak:.2,attack:.8})); PS_SFX.ps_creak(c,o,t+.6,H); },
 // trop tard : le navire sombre
 ps_sink(c,o,t,H){ PS_SFX.ps_creak(c,o,t,H); H.hiss(c,o,t+.8,{dur:2.6,peak:.6,f0:500,f1:150,attack:.8}); PS_SFX.ps_bubbles(c,o,t+2.2,H); },
 // la liberté : la clé à molette, la tôle qui tombe, le grand air
 ps_freedom(c,o,t,H){ for(let i=0;i<6;i++) H.hiss(c,o,t+i*.12,{dur:.03,peak:.5,type:'highpass',f0:3500,attack:.001});
   [140,210,297].forEach((f,i)=>H.tone(c,o,t+.9,{f0:f,dur:1.4-i*.3,peak:.25,attack:.002})); H.hiss(c,o,t+.9,{dur:.4,peak:.5,f0:900,f1:200,attack:.002});
   H.hiss(c,o,t+1.4,{dur:2.4,peak:.25,f0:900,attack:.8});
   [0,.5].forEach(d=>H.tone(c,o,t+1.8+d,{type:'triangle',f0:2100,f1:1500,dur:.35,peak:.07,attack:.03,vib:12,vibDepth:80})); }
};
// ---- ajoutés le 17/11/2026 ----
Object.assign(PS_SFX,{
 // le navire gîte quand l'eau franchit un palier (genoux, taille, cou) : grondement de la coque et ressac
 ps_lurch(c,o,t,H){ H.tone(c,o,t,{f0:42,f1:30,dur:2.4,peak:.45,attack:.5}); PS_SFX.ps_creak(c,o,t+.2,H);
   H.hiss(c,o,t+.6,{dur:1.8,peak:.45,type:'bandpass',f0:600,f1:250,Q:.7,attack:.5}); [0,.5,1].forEach(d=>H.hiss(c,o,t+1.4+d,{dur:.3,peak:.18,f0:2400,attack:.05})); },
 // plus que dix coups : le klaxon d'alarme du navire, deux fois
 ps_klaxon(c,o,t,H){ [0,1].forEach(i=>{ const s=t+i*.9; H.tone(c,o,s,{type:'sawtooth',f0:330,dur:.65,peak:.12,attack:.02}); H.tone(c,o,s,{type:'sawtooth',f0:415,dur:.65,peak:.1,attack:.02}); }); },
 // gouttes dans les croisements obscurs
 ps_drip(c,o,t,H){ for(let i=0;i<5;i++){ const s=t+i*.38+Math.random()*.2, f=900+Math.random()*700; H.tone(c,o,s,{f0:f,f1:f*1.6,dur:.07,peak:.18,attack:.003}); } },
 // pas sur la passerelle de métal
 ps_walkway(c,o,t,H){ for(let i=0;i<4;i++){ const s=t+i*.34; H.tone(c,o,s,{type:'triangle',f0:620-i*15,dur:.25,peak:.12,attack:.002}); H.tone(c,o,s,{f0:1460,dur:.18,peak:.05,attack:.002}); H.hiss(c,o,s,{dur:.05,peak:.25,f0:1800,attack:.001}); } },
 // contre la coque : la mer cogne de l'autre côté
 ps_hull(c,o,t,H){ [0,1.1].forEach(d=>{ H.tone(c,o,t+d,{f0:70,f1:45,dur:.7,peak:.4,attack:.01}); H.hiss(c,o,t+d,{dur:1,peak:.3,f0:500,f1:200,attack:.2}); }); },
 // le vent qui siffle dans les puits des passages bas
 ps_shaft(c,o,t,H){ H.hiss(c,o,t,{dur:2.2,peak:.25,type:'bandpass',f0:380,f1:620,Q:6,attack:.7}); H.hiss(c,o,t+.4,{dur:1.6,peak:.15,type:'bandpass',f0:820,f1:540,Q:8,attack:.5}); },
 // la radio en court-circuit : grésillements et étincelles
 ps_static(c,o,t,H){ H.hiss(c,o,t,{dur:1.2,peak:.22,type:'bandpass',f0:2600,Q:.8,attack:.02});
   for(let i=0;i<6;i++) H.hiss(c,o,t+.1+Math.random()*1,{dur:.025,peak:.5,type:'highpass',f0:5000,attack:.001});
   H.tone(c,o,t+.2,{type:'square',f0:60,dur:.8,peak:.04,attack:.05}); },
 // l'armoire coincée qu'on secoue
 ps_jam(c,o,t,H){ for(let i=0;i<4;i++){ const s=t+i*.12; H.tone(c,o,s,{type:'triangle',f0:260+Math.random()*60,dur:.1,peak:.18,attack:.002}); H.hiss(c,o,s,{dur:.06,peak:.3,f0:1600,attack:.001}); } },
 // le gilet de sauvetage : toile froissée, boucle qui claque
 ps_jacket(c,o,t,H){ for(let i=0;i<3;i++) H.hiss(c,o,t+i*.18,{dur:.15,peak:.3,type:'bandpass',f0:2200,Q:1.5,attack:.03}); SFX.E.click(c,o,t+.7); },
 // monter sur la chaise : le bois qui craque
 ps_chair(c,o,t,H){ H.tone(c,o,t,{type:'triangle',f0:180,f1:150,dur:.25,peak:.2,attack:.01,vib:30,vibDepth:20}); H.hiss(c,o,t+.05,{dur:.2,peak:.2,type:'bandpass',f0:900,Q:3,attack:.02}); },
 // incassable : le métal sonne
 ps_clang(c,o,t,H){ [440,697,1180].forEach((f,i)=>H.tone(c,o,t,{f0:f,dur:1-i*.2,peak:.18-i*.04,attack:.002})); H.hiss(c,o,t,{dur:.08,peak:.4,f0:3000,attack:.001}); },
 // lire : papier
 ps_paper(c,o,t,H){ for(let i=0;i<3;i++) H.hiss(c,o,t+i*.12,{dur:.1,peak:.22,type:'highpass',f0:3000+i*500,attack:.01}); },
 // prendre, poser
 ps_take(c,o,t,H){ H.hiss(c,o,t,{dur:.12,peak:.22,type:'bandpass',f0:1500,Q:1.2,attack:.01}); H.tone(c,o,t+.05,{type:'triangle',f0:520,dur:.08,peak:.08,attack:.003}); },
 ps_drop(c,o,t,H){ H.tone(c,o,t,{f0:110,f1:70,dur:.2,peak:.35,attack:.002}); H.hiss(c,o,t,{dur:.12,peak:.25,f0:700,attack:.002}); H.hiss(c,o,t+.08,{dur:.35,peak:.1,f0:1800,f1:600,attack:.05}); },
 // la lampe torche s'allume, et le câble apparaît
 ps_torch(c,o,t,H){ SFX.E.click(c,o,t); PS_SFX.ps_find(c,o,t+.35,H); },
 // flotter jusqu'à la pièce voisine
 ps_float(c,o,t,H){ for(let i=0;i<3;i++) H.hiss(c,o,t+i*.6,{dur:.8,peak:.25,type:'bandpass',f0:500+i*80,Q:1,attack:.35}); },
 // la corde tendue retient
 ps_taut(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:140,f1:190,dur:.5,peak:.1,attack:.05}); H.hiss(c,o,t,{dur:.45,peak:.2,type:'bandpass',f0:1200,Q:4,attack:.05}); }
});
// paliers d'eau, comme world.status : genoux, taille, cou
function psWaterStep(t,mt){ return [.25,.5,.75].filter(x=>t>mt*x).length; }
// son lié à une ligne du programme (anglais) ou à la commande envoyée
function psSfxFor(line,cmd,mem){
  const l=line.replace(/ +/g,' ');
  if(/MADE IT UP TO THE NEXT LEVEL/.test(l)) return 'ps_climb';
  if(/RIP THE DOOR OPEN/.test(l)) return 'ps_door';
  if(/YOU FIND SOMETHING/.test(l)&&/^USE FLA/.test(cmd||'')) return 'ps_torch';
  if(/^LOOK!|YOU FIND SOMETHING/.test(l)) return 'ps_find';
  if(/WALL OF WATER/.test(l)) return 'ps_wave';
  if(/YOU DROWNED|HOLD YOUR BREATH|WATER CAUGHT YOU/.test(l)) return 'ps_bubbles';
  if(/CHOKE TO DEATH/.test(l)) return 'ps_fire';
  if(/FELL DOWN A SHAFT/.test(l)) return 'fall';
  if(/FELL INTO THE OIL/.test(l)) return 'ps_oil';
  if(/FIRE'S OUT/.test(l)) return 'ps_extinguish';
  if(/YOU CUT YOURSELF|CUT OFF YOUR FOOT/.test(l)) return 'ps_cut';
  if(/FEEL SOMEWHAT STRANGE/.test(l)) return 'ps_drink';
  if(/BURP/.test(l)) return 'ps_burp';
  if(/SWING ACROSS/.test(l)) return 'ps_swing';
  if(/SECRET PASSAGE/.test(l)) return 'ps_secret';
  if(/TOO DARK TO SEE/.test(l)) return 'ps_dark';
  if(/YOU WERE TOO LATE/.test(l)) return 'ps_sink';
  if(/MADE IT TO FREEDOM/.test(l)) return 'ps_freedom';
  if(/^OKAY\.$/.test(l.trim())&&/^TO /.test(cmd||'')) return 'ps_tie';
  if(/^OKAY\.$/.test(l.trim())&&/^(GET|TAKE) /.test(cmd||'')) return 'ps_take';
  if(/^OKAY\.$/.test(l.trim())&&/^(DROP|PUT|THROW) /.test(cmd||'')) return 'ps_drop';
  if(/SHORTED OUT/.test(l)) return 'ps_static';
  if(/JAMMED SHUT/.test(l)) return 'ps_jam';
  if(/FITS PERFECTLY/.test(l)) return 'ps_jacket';
  if(/YOU'RE ON THE CHAIR/.test(l)) return 'ps_chair';
  if(/UNBREAKABLE/.test(l)) return 'ps_clang';
  if(/^(IT SAYS|SIGN:)/.test(l.trim())&&/^READ /.test(cmd||'')) return 'ps_paper';
  if(/FLOAT INTO THE NEXT ROOM/.test(l)) return 'ps_float';
  if(/WITH THE ROPE ATTACHED/.test(l)) return 'ps_taut';
  if(/^---> $/.test(line)&&mem){                          // à l'invite : l'eau a-t-elle franchi un palier ? plus que dix coups ?
    const t=mem.v('T'), mt=mem.v('MT');
    if(mt&&t>1&&mt-t===10) return 'ps_klaxon';
    if(mt&&t>1&&psWaterStep(t,mt)>psWaterStep(t-1,mt)) return 'ps_lurch';
  }
  return null;
}
