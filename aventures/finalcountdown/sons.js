// The Final Countdown — bruitages de la base, synthétisés comme ceux du moteur (moteur/sfx.js) : aucun fichier son.
// Chaque son reçoit (contexte audio, sortie, instant de départ, outils tone/hiss/noiseSrc/env/swell).
// Le programme d'origine n'a ni SOUND ni PLAY : ces bruitages ne jouent que dans la version moderne.
const FC_SFX={
 // le vent du désert
 fc_wind(c,o,t,H){ const n=H.noiseSrc(c), bp=c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=3; bp.frequency.setValueAtTime(400,t); bp.frequency.linearRampToValueAtTime(900,t+1.3); bp.frequency.linearRampToValueAtTime(500,t+2.6);
   n.connect(bp); bp.connect(H.swell(c,o,t,2.8,.4)); n.start(t); n.stop(t+2.9); },
 // la sonnette du crotale
 fc_rattle(c,o,t,H){ const n=H.noiseSrc(c), hp=c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=5000; const am=c.createGain(); am.gain.value=0;
   const l=c.createOscillator(); l.type='square'; l.frequency.value=48; const lg=c.createGain(); lg.gain.value=.5; l.connect(lg); lg.connect(am.gain);
   n.connect(hp); hp.connect(am); am.connect(H.swell(c,o,t,1.4,.5)); n.start(t); n.stop(t+1.5); l.start(t); l.stop(t+1.5); },
 // le grésillement d'une radio
 fc_static(c,o,t,H){ H.hiss(c,o,t,{dur:1.2,peak:.3,type:'bandpass',f0:2200,Q:.8,attack:.02}); for(let i=0;i<6;i++) H.tone(c,o,t+.1+i*.15,{type:'square',f0:300+Math.random()*900,dur:.05,peak:.05,attack:.002}); },
 // le message qui passe à la radio
 fc_radio(c,o,t,H){ FC_SFX.fc_static(c,o,t,H); for(let i=0;i<5;i++) H.tone(c,o,t+.5+i*.14,{type:'sawtooth',f0:180+Math.random()*120,dur:.11,peak:.06,attack:.01}); },
 // la voix métallique de la caméra
 fc_voice(c,o,t,H){ for(let i=0;i<6;i++){ const f=140+(i%3)*30; H.tone(c,o,t+i*.13,{type:'square',f0:f,f1:f*.9,dur:.11,peak:.05,attack:.01,vib:60,vibDepth:20}); } },
 // la grille de l'entrée qui coulisse
 fc_gate(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:880,dur:.12,peak:.08,attack:.005}); H.tone(c,o,t+.15,{type:'square',f0:1320,dur:.12,peak:.08,attack:.005});
   H.hiss(c,o,t+.3,{dur:1.4,peak:.3,type:'bandpass',f0:600,Q:2,attack:.2}); H.tone(c,o,t+.3,{type:'sawtooth',f0:55,dur:1.4,peak:.1,attack:.2}); H.tone(c,o,t+1.7,{f0:90,f1:60,dur:.3,peak:.4,attack:.003}); },
 // le refus : un buzzer
 fc_deny(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:110,dur:.5,peak:.15,attack:.005}); H.tone(c,o,t,{type:'square',f0:116,dur:.5,peak:.12,attack:.005}); },
 // un clic de bouton
 fc_button(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:1800,dur:.025,peak:.25,attack:.001}); H.tone(c,o,t+.04,{type:'square',f0:900,dur:.02,peak:.15,attack:.001}); },
 // l'incendie
 fc_fire(c,o,t,H){ H.hiss(c,o,t,{dur:2,peak:.4,f0:420,attack:.5}); for(let i=0;i<14;i++) H.hiss(c,o,t+.1+Math.random()*1.7,{dur:.03,peak:.35+Math.random()*.3,type:'highpass',f0:2500+Math.random()*3000,attack:.001}); },
 fc_extinguish(c,o,t,H){ H.hiss(c,o,t,{dur:1.8,peak:.55,type:'highpass',f0:1800,attack:.03}); H.hiss(c,o,t+1.6,{dur:.6,peak:.2,f0:500,f1:150,attack:.05}); },
 // l'ascenseur
 fc_lift(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:70,f1:90,dur:1.8,peak:.1,attack:.4}); H.hiss(c,o,t,{dur:1.8,peak:.12,f0:300,attack:.4}); [1047,831].forEach((f,i)=>H.tone(c,o,t+1.9+i*.3,{f0:f,dur:.9,peak:.12,attack:.005})); },
 // la télévision : le générique d'une sitcom, à peine audible
 fc_tv(c,o,t,H){ FC_SFX.fc_static(c,o,t,H); [523,659,784,659,880].forEach((f,i)=>H.tone(c,o,t+.5+i*.18,{type:'triangle',f0:f,dur:.2,peak:.06,attack:.01})); },
 // l'armoire métallique qu'on traîne, ou qu'on ouvre
 fc_scrape(c,o,t,H){ H.hiss(c,o,t,{dur:1,peak:.35,type:'bandpass',f0:900,Q:3,attack:.05}); H.tone(c,o,t,{type:'sawtooth',f0:65,f1:80,dur:1,peak:.12,attack:.05}); H.tone(c,o,t+1,{f0:120,f1:70,dur:.25,peak:.3,attack:.003}); },
 fc_unlock(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:2400,dur:.03,peak:.2,attack:.001}); H.tone(c,o,t+.12,{type:'square',f0:1600,dur:.04,peak:.25,attack:.001}); H.hiss(c,o,t+.3,{dur:.5,peak:.2,type:'bandpass',f0:3000,Q:5,attack:.02}); },
 // le pistolet paralysant
 fc_taser(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:3000,f1:800,dur:.5,peak:.2,attack:.002,vib:90,vibDepth:400}); H.hiss(c,o,t,{dur:.5,peak:.35,type:'highpass',f0:4000,attack:.002}); },
 // le général : il surgit (un cri rauque), il s'enfuit
 fc_general(c,o,t,H){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=700; bp.Q.value=2; bp.connect(o);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(160,t); os.frequency.linearRampToValueAtTime(240,t+.25); os.frequency.linearRampToValueAtTime(130,t+.8);
   os.connect(H.env(c,bp,t,.03,.7,.9)); os.start(t); os.stop(t+.95); H.tone(c,o,t,{type:'square',f0:660,dur:.15,peak:.06,attack:.005}); },
 fc_flee(c,o,t,H){ FC_SFX.fc_taser(c,o,t,H); for(let i=0;i<6;i++) H.tone(c,o,t+.6+i*.14,{f0:120,f1:80,dur:.08,peak:.25,attack:.003}); },
 // la vitre brisée
 fc_glass(c,o,t,H){ H.hiss(c,o,t,{dur:.2,peak:.7,type:'highpass',f0:3500,attack:.001}); for(let i=0;i<10;i++) H.tone(c,o,t+.05+Math.random()*.7,{f0:2500+Math.random()*3500,dur:.25,peak:.06,attack:.002}); H.tone(c,o,t+1,{f0:110,f1:60,dur:.4,peak:.4,attack:.003}); },
 // la décharge électrique
 fc_shock(c,o,t,H){ H.tone(c,o,t,{type:'sawtooth',f0:100,dur:1.2,peak:.3,attack:.002,vib:50,vibDepth:30}); H.hiss(c,o,t,{dur:1.2,peak:.4,type:'highpass',f0:3000,attack:.002}); },
 // le panneau qui s'ouvre
 fc_panel(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:440,dur:.08,peak:.1,attack:.005}); H.hiss(c,o,t+.1,{dur:.6,peak:.25,type:'bandpass',f0:1200,Q:2,attack:.1}); H.tone(c,o,t+.7,{f0:200,f1:140,dur:.2,peak:.3,attack:.003}); },
 // le fil coupé : le compte à rebours s'arrête
 fc_snip(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:2600,dur:.03,peak:.35,attack:.001}); H.hiss(c,o,t,{dur:.08,peak:.4,type:'highpass',f0:5000,attack:.001});
   H.tone(c,o,t+.2,{type:'sawtooth',f0:220,f1:40,dur:1.2,peak:.15,attack:.01}); [523,659,784,1047].forEach((f,i)=>H.tone(c,o,t+1.5+i*.15,{f0:f,dur:1,peak:.12,attack:.01})); },
 // le décollage : grondement, puis le missile qui part
 fc_launch(c,o,t,H){ const n=H.noiseSrc(c), lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(200,t); lp.frequency.linearRampToValueAtTime(1800,t+2.5);
   n.connect(lp); lp.connect(H.swell(c,o,t,3,.9)); n.start(t); n.stop(t+3.1); H.tone(c,o,t,{f0:45,f1:30,dur:3,peak:.6,attack:.6}); },
 // la sirène d'alerte (dix coups avant la fin)
 fc_klaxon(c,o,t,H){ for(let i=0;i<3;i++){ H.tone(c,o,t+i*.6,{type:'square',f0:420,f1:620,dur:.45,peak:.12,attack:.01}); } },
 // le bip du compte à rebours
 fc_beep(c,o,t,H){ H.tone(c,o,t,{type:'square',f0:1000,dur:.08,peak:.08,attack:.002}); },
 // les salles : néons, ordinateurs, radar, transmissions
 fc_hum(c,o,t,H){ [60,120,180].forEach((f,i)=>H.tone(c,o,t,{type:i?'sine':'sawtooth',f0:f,dur:2,peak:.06-i*.015,attack:.4})); },
 fc_computer(c,o,t,H){ FC_SFX.fc_hum(c,o,t,H); for(let i=0;i<8;i++) H.tone(c,o,t+.2+i*.2,{type:'square',f0:[880,1320,660,990][i%4],dur:.06,peak:.05,attack:.003}); },
 fc_radar(c,o,t,H){ for(let i=0;i<2;i++){ H.tone(c,o,t+i*1.1,{f0:1400,f1:1300,dur:.9,peak:.12,attack:.005}); H.tone(c,o,t+i*1.1,{f0:2800,dur:.5,peak:.03,attack:.005}); } },
 fc_steps(c,o,t,H){ for(let i=0;i<5;i++) H.tone(c,o,t+i*.32,{f0:140,f1:90,dur:.09,peak:.2,attack:.003}); },
 fc_found(c,o,t,H){ [784,988,1319].forEach((f,i)=>H.tone(c,o,t+i*.09,{f0:f,dur:.7,peak:.1,attack:.004})); },
 fc_take(c,o,t,H){ H.hiss(c,o,t,{dur:.14,peak:.18,type:'bandpass',f0:2600,Q:1.2,attack:.01}); },
 fc_drop(c,o,t,H){ H.tone(c,o,t,{f0:180,f1:110,dur:.18,peak:.28,attack:.003}); }
};
// Bruitage d'une ligne affichée par le jeu (en anglais, telle que le programme l'écrit). cmd : la commande anglaise.
function fcSfxFor(line,cmd,mem){
  const l=line.replace(/ +/g,' '), c=cmd||'';
  if(/the general/.test(l)) return 'fc_general';                  // il n'apparaît dans les listes que lorsqu'il surgit
  if(/YOU STUNNED HIM/.test(l)) return 'fc_flee';
  if(/GENERAL GOT YOU|BATTERY ON YOUR TASER/.test(l)) return 'death';
  if(/AUTHORIZATION ACCEPTED/.test(l)) return 'fc_gate';
  if(/AUTHORIZATION (INSUFFICIENT|REFUSED)/.test(l)) return 'fc_deny';
  if(/A METALLIC VOICE/.test(l)) return 'fc_voice';
  if(/GARGLED|MESSAGE COMES THROUGH/.test(l)) return 'fc_radio';
  if(/NOISE IN THE OTHER/.test(l)) return 'fc_fire';
  if(/FIRE IS OUT/.test(l)) return 'fc_extinguish';
  if(/SMOKE FILLS/.test(l)) return 'death';
  if(/I LOVE LUCY/.test(l)) return 'fc_tv';
  if(/^CLICK\.$/.test(l.trim())) return 'fc_button';
  if(/LAUNCHED A MISSILE|BURST OUT OF THE SILO/.test(l)) return 'fc_launch';
  if(/WOW! LOOK!/.test(l)) return 'fc_scrape';
  if(/^IT'S OPEN\.$/.test(l.trim())&&/^UNL/.test(c)) return 'fc_unlock';
  if(/LOOK WHAT YOU FOUND|YOU FIND SOMETHING/.test(l)) return 'fc_found';
  if(/THROUGH THE GLASS/.test(l)) return 'fc_glass';
  if(/CURRENT CURSES/.test(l)) return 'fc_shock';
  if(/A PANEL JUST OPENED/.test(l)) return 'fc_panel';
  if(/STOPPED THE COUNTDOWN/.test(l)) return 'fc_snip';
  if(/RATTLESNAKE|VENOMOUS/.test(l)&&/^EXA|^LOO/.test(c)) return 'fc_rattle';
  if(/^NOTHING HAPPENED\.$/.test(l.trim())&&/^SHO/.test(c)) return 'fc_taser';
  if(/^OKAY\.$/.test(l.trim())&&/^(GET|TAK)/.test(c)) return 'fc_take';
  if(/^OKAY\.$/.test(l.trim())&&/^(DRO|PUT|THR)/.test(c)) return 'fc_drop';
  // à l'invite : dix coups avant la fin, la sirène ; ensuite, un bip à chaque coup
  if(/COMMUNICATIONS/.test(l)&&/^(GO UP|U)$/.test(c)) return 'fc_lift';
  if(l.trim()===':'&&mem){ const left=mem.v('MT')-mem.v('T'); if(mem.v('MT')&&left===10) return 'fc_klaxon'; if(mem.v('MT')&&left>0&&left<10) return 'fc_beep'; }
  return null;
}
// Ambiance à l'entrée d'un lieu (numéro du lieu 1 à 20)
function fcAmbient(mem,r){
  if(r===1) return ['fc_wind','fc_rattle'];
  if(r===2||r===3) return ['fc_wind'];
  if(r===5) return ['fc_computer'];
  if(r===10&&mem.v('F2')===1) return ['fc_fire'];
  if(r===11&&/UP/.test(mem.a('R$',11,2)||'')) return ['fc_hum'];
  if(r===12) return ['fc_radar'];
  if(r===16) return ['fc_static'];
  if(r===13) return ['fc_steps'];
  if(r===7||r===14||r===19||r===20) return ['fc_hum'];
  return [];
}
