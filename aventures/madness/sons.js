// Madness and the Minotaur — bruitages du labyrinthe, synthétisés comme ceux du moteur (moteur/sfx.js) : aucun fichier.
// Chaque son reçoit (contexte audio, sortie, instant de départ, outils tone/hiss/noiseSrc/env/swell).
// Le jeu affiche ses messages par morceaux de 32 colonnes : on garde le texte du tour pour reconnaître un message coupé
// en deux. Ces bruitages ne jouent que dans la version moderne.
const MM_SFX={
 mm_take(c,o,t,H){ H.hiss(c,o,t,{dur:.12,peak:.16,type:'bandpass',f0:2200,Q:1.2,attack:.01}); },
 mm_drop(c,o,t,H){ H.tone(c,o,t,{f0:160,f1:90,dur:.18,peak:.28,attack:.003}); H.hiss(c,o,t,{dur:.1,peak:.12,type:'lowpass',f0:900,attack:.002}); },
 // l'air crépite d'enchantements
 mm_crackle(c,o,t,H){ for(let i=0;i<14;i++) H.hiss(c,o,t+i*.09+Math.random()*.05,{dur:.025,peak:.16,type:'highpass',f0:3500+Math.random()*2500,attack:.001});
   H.tone(c,o,t,{f0:220,dur:1.4,peak:.05,attack:.4,vib:7,vibDepth:6}); },
 // coups : le choc, l'arme qui fend l'air
 mm_hit(c,o,t,H){ H.tone(c,o,t,{f0:130,f1:55,dur:.22,peak:.5,attack:.002}); H.hiss(c,o,t,{dur:.15,peak:.35,type:'lowpass',f0:1400,attack:.002}); },
 mm_swish(c,o,t,H){ H.hiss(c,o,t,{dur:.28,peak:.28,type:'bandpass',f0:900,f1:3500,Q:2,attack:.04}); },
 // le Minotaure mugit, l'hydre siffle
 mm_roar(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:95,f1:70,dur:1.4,peak:.3,attack:.12,vib:9,vibDepth:10}); H.tone(c,o,t,{type:'sawtooth',f0:142,f1:104,dur:1.3,peak:.12,attack:.15});
   H.hiss(c,o,t,{dur:1.3,peak:.14,type:'bandpass',f0:500,Q:1.5,attack:.2}); },
 mm_hydra(c,o,t,H){ for(let i=0;i<3;i++) H.hiss(c,o,t+i*.35,{dur:.5,peak:.2,type:'highpass',f0:3200+i*400,attack:.05}); },
 // la fumée violette d'une créature qui disparaît, ou de l'Oracle
 mm_poof(c,o,t,H){ H.hiss(c,o,t,{dur:.9,peak:.35,type:'bandpass',f0:1800,f1:300,Q:.8,attack:.02}); H.tone(c,o,t+.1,{f0:880,f1:220,dur:.7,peak:.08,attack:.05}); },
 // le vent qui arrache la lampe, la force magique qui repousse
 mm_gust(c,o,t,H){ H.hiss(c,o,t,{dur:1.4,peak:.4,type:'bandpass',f0:300,f1:1200,Q:.7,attack:.15}); H.tone(c,o,t+.9,{type:'triangle',f0:1300,f1:700,dur:.2,peak:.12,attack:.002}); },
 mm_push(c,o,t,H){ H.tone(c,o,t,{f0:70,f1:140,dur:.5,peak:.45,attack:.01}); H.tone(c,o,t,{type:'sawtooth',f0:440,f1:110,dur:.6,peak:.1,attack:.01}); H.hiss(c,o,t,{dur:.5,peak:.2,type:'lowpass',f0:600,attack:.01}); },
 // le brouillard qui monte du sol
 mm_fog(c,o,t,H){ H.hiss(c,o,t,{dur:2.4,peak:.14,type:'lowpass',f0:500,f1:1600,attack:.9}); H.tone(c,o,t,{f0:110,f1:104,dur:2.4,peak:.08,attack:1,vib:4,vibDepth:3}); },
 // le rat voleur
 mm_squeak(c,o,t,H){ for(let i=0;i<4;i++){ const f=2600+Math.random()*900; H.tone(c,o,t+i*.12,{type:'triangle',f0:f,f1:f*1.2,dur:.06,peak:.08,attack:.003}); }
   for(let i=0;i<6;i++) H.hiss(c,o,t+.5+i*.06,{dur:.03,peak:.1,type:'highpass',f0:4000,attack:.002}); },
 mm_find(c,o,t,H){ [587,784,988].forEach((f,i)=>H.tone(c,o,t+i*.09,{f0:f,dur:.7,peak:.1,attack:.004})); },
 // l'air de flûte de la partition (la corniche apparaît)
 mm_flute(c,o,t,H){ [[659,.3],[784,.3],[880,.3],[784,.3],[988,.6],[880,.9]].reduce((d,[f,l])=>{ H.tone(c,o,t+d,{type:'triangle',f0:f,dur:l,peak:.12,attack:.04,vib:5,vibDepth:6}); H.hiss(c,o,t+d,{dur:l*.6,peak:.02,type:'bandpass',f0:f*2,Q:4,attack:.05}); return d+l; },0); },
 // le couvercle de la crypte retombe, l'éboulement
 mm_slam(c,o,t,H){ H.hiss(c,o,t,{dur:.8,peak:.25,type:'bandpass',f0:600,Q:1,attack:.3}); H.tone(c,o,t+.8,{f0:90,f1:40,dur:.6,peak:.6,attack:.002}); H.hiss(c,o,t+.8,{dur:.5,peak:.3,type:'lowpass',f0:800,attack:.002}); },
 // manger, boire
 mm_eat(c,o,t,H){ for(let i=0;i<6;i++) H.hiss(c,o,t+i*.17+Math.random()*.05,{dur:.06,peak:.16,type:'bandpass',f0:700+Math.random()*500,Q:2,attack:.004}); },
 mm_gulp(c,o,t,H){ for(let i=0;i<3;i++) H.tone(c,o,t+i*.32,{f0:220,f1:120,dur:.14,peak:.25,attack:.01}); },
 // la lampe : la mèche qui prend, la flamme qui meurt
 mm_lamp(c,o,t,H){ H.hiss(c,o,t,{dur:.25,peak:.25,type:'highpass',f0:2500,f1:1200,attack:.005}); H.hiss(c,o,t+.2,{dur:.6,peak:.07,type:'lowpass',f0:600,attack:.1}); },
 mm_out(c,o,t,H){ H.hiss(c,o,t,{dur:.35,peak:.18,type:'bandpass',f0:1200,f1:400,Q:1,attack:.01}); },
 // ambiances : l'eau qui goutte dans les dédales, le vent qui monte d'une fosse, la forêt la nuit
 mm_drip(c,o,t,H){ for(let i=0;i<4;i++){ const f=900+Math.random()*700; H.tone(c,o,t+i*.6+Math.random()*.2,{f0:f,f1:f*1.7,dur:.06,peak:.06,attack:.003}); }
   H.hiss(c,o,t,{dur:2.6,peak:.03,type:'lowpass',f0:250,attack:1}); },
 mm_wind(c,o,t,H){ H.hiss(c,o,t,{dur:2.8,peak:.1,type:'bandpass',f0:220,f1:420,Q:.7,attack:1}); },
 mm_night(c,o,t,H){ for(let i=0;i<10;i++){ const s=t+i*.25+Math.random()*.08; H.tone(c,o,s,{type:'triangle',f0:4300,dur:.04,peak:.03,attack:.004}); H.tone(c,o,s+.06,{type:'triangle',f0:4300,dur:.04,peak:.03,attack:.004}); }
   H.tone(c,o,t+.6,{f0:380,f1:350,dur:.35,peak:.07,attack:.05}); H.tone(c,o,t+1.1,{f0:370,f1:330,dur:.6,peak:.07,attack:.05}); },
 mm_chant(c,o,t,H){ [220,277,330].forEach((f,i)=>H.tone(c,o,t+i*.3,{f0:f,dur:2.2-i*.3,peak:.05,attack:.6,vib:5,vibDepth:4})); }
};
// les messages du jeu (en anglais, comme ils sortent du programme) et leur son
const MM_SOUNDS=[
 [/CONGRATULATIONS|YOU WIN/,'victory'],
 [/KILLED YOURSELF|FALLEN AND DIED|DIED FROM|POISON FOG HAS KILLED|BETTER LUCK NEXT TIME/,'death'],
 [/YOU NOW KNOW THE SECRET/,'magic'],
 [/AIR IS CRACKLING/,'mm_crackle'],
 [/MINOTAUR IS ATTACKING/,'mm_roar'],
 [/(TROGLODYTE|SATYR) IS ATTACKING/,'growl'],
 [/SCORPION HAS JUST STUNG|IT'S POISONOUS/,'sting'],
 [/OUCH|HEADS IS LOPPED/,'mm_hit'],
 [/YOU MISSED/,'mm_swish'],
 [/HYDRA IS DEAD/,'mm_roar'],
 [/NINE-HEADED HYDRA|MAD HYDRA IS TIED/,'mm_hydra'],
 [/DYING EFFORT|SCORPION DISAPPEARS|ORACLE DISAPPEARS/,'mm_poof'],
 [/ORACLE SPEAKS|REFLECTION IN THE POOL/,'dream'],
 [/GROUND IS SHAKING|CAVED IN/,'rumble'],
 [/BOLT OF LIGHTNING/,'flash'],
 [/GUST OF WIND/,'mm_gust'],
 [/MAGIC FORCE STRIKES|SPELL HAS PUSHED/,'mm_push'],
 [/MYSTERIOUS FOG/,'mm_fog'],
 [/PHOSPHORESCENT GLOW|LIGHT GROWS STRONGER|SCARAB IS GLOWING|ENCHANTED AURA/,'glow'],
 [/PACKRAT SCURRIES/,'mm_squeak'],
 [/THANK THE PACKRAT|NOW LAYING AT YOUR FEET/,'mm_find'],
 [/SECRET LEDGE/,'mm_flute'],
 [/TOP FALLS SHUT/,'mm_slam'],
 [/STUMBLED AND FALLEN/,'fall'],
 [/IT WAS YUMMY/,'mm_eat'],
 [/I NEEDED THAT|STRONG MEDICINE/,'mm_gulp'],
 [/FILLED WITH (WATER|OIL)/,'bubbles'],
 [/THE LAMP IS ON/,'mm_lamp'],
 [/LAMP HAS JUST GONE OFF|THE LAMP IS OFF/,'mm_out'],
 [/YOU DROPPED THE/,'mm_drop']
];
let mmBuf='', mmCmd=null;
function mmSfxFor(line,cmd,mem){
  if(cmd!==mmCmd){ mmCmd=cmd; mmBuf=''; }                  // nouveau tour
  mmBuf=(mmBuf+' '+line).replace(/\s+/g,' ').slice(-400);
  for(const [re,s] of MM_SOUNDS) if(re.test(mmBuf)){ mmBuf=''; return s; }
  if(/^OK\b/.test(line.trim())) return /^(GET|TAKE)\b/.test(cmd||'')?'mm_take':/^DROP\b/.test(cmd||'')?'mm_drop':null;
  return null;
}
// Ambiance à l'entrée d'un lieu (0 à 255), d'après sa sorte (data.js)
function mmAmbient(mem,room){
  const kind=(ROOMS[room]||[])[2];
  if(room===202) return ['mm_night'];
  if(room===mem.b(0x33)&&mem.b(0x0E)!==1) return ['mm_hydra'];
  if(kind==='temple') return ['mm_chant'];
  if(kind==='pit'||kind==='shaft') return ['mm_wind'];
  if(kind==='maze'||kind==='pool'||kind==='cave') return Math.random()<.5?['mm_drip']:[];
  return [];
}
