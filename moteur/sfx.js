// Effets sonores synthétisés (Web Audio) : aucun fichier son, tout est calculé à la volée.
const SFX=(function(){
let ctx=null, master=null, vol=0.7, enabled=true;
function ensure(){
  if(!ctx){ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null;
    ctx=new AC(); master=ctx.createGain(); master.gain.value=vol;
    const lim=ctx.createDynamicsCompressor(); lim.threshold.value=-8; lim.knee.value=6; lim.ratio.value=12; lim.attack.value=.002; lim.release.value=.15; master.connect(lim); lim.connect(ctx.destination); }
  if(ctx.state==='suspended') ctx.resume();
  return ctx;
}
function noiseSrc(c){
  if(!c._nb){ const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate), d=b.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; c._nb=b; }
  const s=c.createBufferSource(); s.buffer=c._nb; s.loop=true; return s;
}
// enveloppe : attaque linéaire puis décroissance exponentielle
function env(c,out,t,attack,peak,dur){ const g=c.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(peak,t+attack); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); g.connect(out); return g; }
function tone(c,out,t,o){ // o: type,f0,f1,dur,peak,attack,vib,vibDepth
  const os=c.createOscillator(); os.type=o.type||'sine'; os.frequency.setValueAtTime(o.f0,t);
  if(o.f1) os.frequency.exponentialRampToValueAtTime(o.f1,t+o.dur);
  if(o.vib){ const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=o.vib; lg.gain.value=o.vibDepth||20; l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t+o.dur+.05); }
  os.connect(env(c,out,t,o.attack||0.005,o.peak||0.3,o.dur)); os.start(t); os.stop(t+o.dur+.05); return os;
}
function hiss(c,out,t,o){ // o: dur,peak,attack,type,f0,f1,Q
  const n=noiseSrc(c), f=c.createBiquadFilter(); f.type=o.type||'lowpass'; f.frequency.setValueAtTime(o.f0,t);
  if(o.f1) f.frequency.exponentialRampToValueAtTime(o.f1,t+o.dur); f.Q.value=o.Q||0.7;
  n.connect(f); f.connect(env(c,out,t,o.attack||0.005,o.peak||0.4,o.dur)); n.start(t); n.stop(t+o.dur+.05);
}
function swell(c,out,t,dur,peak){ const g=c.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(peak,t+dur*.45); g.gain.linearRampToValueAtTime(0.0001,t+dur); g.connect(out); return g; }
const E={
 shot(c,o,t){ hiss(c,o,t,{dur:.5,peak:.62,f0:5000,f1:250}); tone(c,o,t,{f0:150,f1:38,dur:.32,peak:.5}); hiss(c,o,t+.05,{dur:1.5,peak:.22,type:'bandpass',f0:700,f1:300,Q:.6}); },
 crow(c,o,t){ for(let i=0;i<3;i++){ const s=t+i*.36, bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1500; bp.Q.value=2.5; bp.connect(o);
     tone(c,bp,s,{type:'sawtooth',f0:640-i*20,f1:470,dur:.26,peak:1.3,attack:.02,vib:55,vibDepth:90}); hiss(c,o,s,{dur:.22,peak:.2,type:'bandpass',f0:2200,Q:1.5,attack:.02}); } },
 rattle(c,o,t){ const n=noiseSrc(c), hp=c.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=4500; const am=c.createGain(); am.gain.value=0;
   const l=c.createOscillator(); l.type='square'; l.frequency.setValueAtTime(22,t); l.frequency.linearRampToValueAtTime(34,t+1.2); const lg=c.createGain(); lg.gain.value=.5; l.connect(lg); lg.connect(am.gain);
   n.connect(hp); hp.connect(am); am.connect(swell(c,o,t,1.3,.7)); n.start(t); l.start(t); n.stop(t+1.35); l.stop(t+1.35); },
 eagle(c,o,t){ const bp=c.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2400; bp.Q.value=1.2; bp.connect(o);
   tone(c,bp,t,{type:'sawtooth',f0:2700,f1:1700,dur:.9,peak:.75,attack:.04,vib:17,vibDepth:160}); tone(c,bp,t+.95,{type:'sawtooth',f0:2500,f1:1900,dur:.4,peak:.5,attack:.03,vib:17,vibDepth:140}); },
 magic(c,o,t){ [523,784,1047,1319,1568,2093].forEach((f,i)=>{ const os=c.createOscillator(); os.type='sine'; os.frequency.setValueAtTime(f*(1+(i%2?.004:-.004)),t+i*.07); os.frequency.linearRampToValueAtTime(f*1.03,t+1.8);
     os.connect(swell(c,o,t+i*.07,1.7,.13)); os.start(t+i*.07); os.stop(t+i*.07+1.75); });
   tone(c,o,t,{f0:110,dur:1.8,peak:.16,attack:.5}); tone(c,o,t,{f0:113.5,dur:1.8,peak:.16,attack:.5});
   const n=noiseSrc(c), bp=c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=6; bp.frequency.setValueAtTime(900,t); bp.frequency.exponentialRampToValueAtTime(5200,t+1.5); n.connect(bp); bp.connect(swell(c,o,t,1.6,.2)); n.start(t); n.stop(t+1.65); },
 glow(c,o,t){ [880,1320,1760].forEach((f,i)=>tone(c,o,t+i*.09,{f0:f,dur:1.1,peak:.14,attack:.15,vib:6,vibDepth:8})); },
 dream(c,o,t){ const n=noiseSrc(c), bp=c.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=2.5; bp.frequency.setValueAtTime(250,t); bp.frequency.exponentialRampToValueAtTime(2600,t+1.1); bp.frequency.exponentialRampToValueAtTime(350,t+2.3);
   n.connect(bp); bp.connect(swell(c,o,t,2.4,.5)); n.start(t); n.stop(t+2.45);
   const os=c.createOscillator(); os.frequency.setValueAtTime(70,t); os.frequency.linearRampToValueAtTime(96,t+2.3); os.connect(swell(c,o,t,2.4,.3)); os.start(t); os.stop(t+2.45);
   [392,587].forEach((f,i)=>tone(c,o,t+.5+i*.3,{f0:f,dur:1.5,peak:.08,attack:.4,vib:4,vibDepth:6})); },
 flash(c,o,t){ hiss(c,o,t,{dur:.9,peak:.45,type:'highpass',f0:1800,f1:400,attack:.01}); tone(c,o,t,{f0:1800,f1:200,dur:.7,peak:.3}); E.magic(c,o,t+.15); },
 coin(c,o,t){ [1568,2093,2637,3136].forEach((f,i)=>{ tone(c,o,t+i*.075,{f0:f,dur:.9,peak:.22}); tone(c,o,t+i*.075,{f0:f*2.01,dur:.4,peak:.06}); }); hiss(c,o,t,{dur:.35,peak:.08,type:'highpass',f0:6000}); },
 splash(c,o,t){ hiss(c,o,t,{dur:.7,peak:.7,f0:3200,f1:400,attack:.02}); hiss(c,o,t+.1,{dur:1.1,peak:.2,type:'bandpass',f0:900,f1:500,Q:.8,attack:.1});
   for(let i=0;i<5;i++){ const f=280+Math.random()*420; tone(c,o,t+.25+i*.11+Math.random()*.05,{f0:f,f1:f*1.9,dur:.07,peak:.16,attack:.01}); } },
 bubbles(c,o,t){ hiss(c,o,t,{dur:1.6,peak:.22,f0:320,attack:.3});
   for(let i=0;i<8;i++){ const f=220+Math.random()*520; tone(c,o,t+i*.16+Math.random()*.08,{f0:f,f1:f*1.8,dur:.08,peak:.34,attack:.01}); } },
 bell(c,o,t){ [[1,.32,3],[2,.16,2.2],[2.76,.13,1.6],[5.4,.06,.9],[8.93,.03,.5]].forEach(p=>tone(c,o,t,{f0:660*p[0],dur:p[2],peak:p[1],attack:.003})); },
 click(c,o,t){ tone(c,o,t,{type:'square',f0:1900,dur:.03,peak:.25,attack:.001}); tone(c,o,t+.035,{type:'square',f0:950,dur:.05,peak:.25,attack:.001}); hiss(c,o,t,{dur:.05,peak:.2,type:'highpass',f0:3000,attack:.001}); },
 rumble(c,o,t){ const n=noiseSrc(c), lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=170; n.connect(lp); lp.connect(swell(c,o,t,1.7,1.6)); n.start(t); n.stop(t+1.75);
   tone(c,o,t,{f0:62,f1:40,dur:1.6,peak:.5,attack:.4}); hiss(c,o,t+1.1,{dur:.5,peak:.3,f0:900,f1:200}); },
 smash(c,o,t){ hiss(c,o,t,{dur:.12,peak:.5,type:'highpass',f0:2200,attack:.001}); for(let i=0;i<6;i++) tone(c,o,t+.02+i*.045+Math.random()*.03,{type:'triangle',f0:1400+Math.random()*2600,dur:.16,peak:.16,attack:.001}); },
 growl(c,o,t){ const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=420; lp.connect(o); const am=c.createGain(); am.gain.value=.6; am.connect(lp);
   const l=c.createOscillator(); l.frequency.value=24; const lg=c.createGain(); lg.gain.value=.4; l.connect(lg); lg.connect(am.gain); l.start(t); l.stop(t+1.5);
   const os=c.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(64,t); os.frequency.linearRampToValueAtTime(82,t+.7); os.frequency.linearRampToValueAtTime(58,t+1.4); os.connect(swell(c,am,t,1.45,.7)); os.start(t); os.stop(t+1.5); },
 sting(c,o,t){ [110,116.5,164.8].forEach(f=>tone(c,o,t,{type:'sawtooth',f0:f,dur:1.3,peak:.24,attack:.02})); hiss(c,o,t,{dur:.25,peak:.3,f0:1200,f1:200}); },
 fall(c,o,t){ tone(c,o,t,{type:'triangle',f0:900,f1:90,dur:1.3,peak:.3,attack:.05}); hiss(c,o,t,{dur:1.3,peak:.2,type:'bandpass',f0:2000,f1:300,Q:1.5,attack:.2}); },
 death(c,o,t){ [220,174.6,146.8,110].forEach((f,i)=>tone(c,o,t+i*.32,{type:'triangle',f0:f,dur:1.2,peak:.28,attack:.02})); tone(c,o,t+1.3,{f0:55,dur:1.6,peak:.4,attack:.05}); },
 victory(c,o,t){ [523,659,784,1047,1319,1568].forEach((f,i)=>{ tone(c,o,t+i*.14,{f0:f,dur:1.4,peak:.2}); tone(c,o,t+i*.14,{f0:f*2,dur:.7,peak:.05}); }); E.glow(c,o,t+.9); }
};
function play(name,delay){
  if(!enabled||!E[name]) return false;
  const c=ensure(); if(!c) return false;
  try{ E[name](c,master,c.currentTime+.03+(delay||0)); }catch(e){ return false; }
  return true;
}
return {play,E,names:()=>Object.keys(E),setVolume(v){ vol=v; if(master) master.gain.value=v; },setEnabled(b){ enabled=b; },get enabled(){ return enabled; }};
})();
if(typeof module!=='undefined')module.exports=SFX;
