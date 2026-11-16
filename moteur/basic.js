// DragonTales — interpréteur Dragon BASIC pour les aventures écrites en BASIC.
// Il lit le programme tokenisé tel qu'il est sur la cassette et l'exécute en suivant les règles du BASIC du Dragon :
// seuls les deux premiers caractères d'un nom de variable comptent, RND(n) rend un entier de 1 à n, NEXT X,Y, ON…GOTO, etc.
// Même interface que Machine (moteur/machine.js) : run() exécute jusqu'à la prochaine attente et rend
// 'line' (saisie d'une ligne), 'end' (fin du programme) ; line(s) fournit la ligne tapée.
//   io.out(texte)      texte affiché (avec '\n')
//   io.cls(couleur)    effacement de l'écran (CLS, CLS n)
//   io.input(prompt)   appelé au début d'une saisie (prompt = texte de INPUT "…" ou '')
//   io.end()           fin du programme
// cfg (fiche de l'aventure, facultatif) : seed (graine du hasard, pour les essais), maxSteps (garde-fou),
//   patches : {numéro de ligne: 'texte BASIC'} — corrections du programme d'origine ('' supprime la ligne) ;
//             appliquées sauf si io.fixes === false (pour comparer avec le programme d'origine).
function Basic(bin, io, cfg){
  cfg = cfg || {};
  // ---------- tokens du BASIC du Dragon ----------
  const KW = ("FOR GO REM ' ELSE IF DATA PRINT ON INPUT END NEXT DIM READ LET RUN RESTORE RETURN STOP POKE CONT LIST CLEAR NEW DEF "+
    "CLOAD CSAVE OPEN CLOSE LLIST SET RESET CLS MOTOR SOUND AUDIO EXEC SKIPF DEL EDIT TRON TROFF LINE PCLS PSET PRESET SCREEN "+
    "PCLEAR COLOR CIRCLE PAINT GET PUT DRAW PCOPY PMODE PLAY DLOAD RENUM TAB( TO SUB FN THEN NOT STEP OFF + - * / ^ AND OR > = < USING").split(' ');
  const FN = ("SGN INT ABS POS RND SQR LOG EXP SIN COS TAN ATN PEEK LEN STR$ VAL ASC CHR$ EOF JOYSTK FIX HEX$ LEFT$ RIGHT$ MID$ POINT "+
    "INKEY$ MEM VARPTR INSTR TIMER PPOINT STRING$ USR").split(' ');
  const OPS = new Set(['+','-','*','/','^','AND','OR','>','=','<','NOT']);

  // ---------- lecture du programme ----------
  // ligne = { n: numéro, t: tokens } ; token = {k:'kw'|'fn'|'num'|'str'|'id'|'p'|'raw', v}
  const lines = [], byNum = new Map(), data = [];
  (function parse(){
    const d = bin; let p = 0, base = null;
    while(p + 4 <= d.length){
      const nxt = d[p]<<8 | d[p+1]; if(!nxt) break;
      let e = p + 4; while(d[e] !== 0) e++;
      if(base === null) base = nxt - (e + 1);
      const n = d[p+2]<<8 | d[p+3], t = tokenize(d.subarray(p+4, e));
      byNum.set(n, lines.length); lines.push({n, t});
      p = nxt - base;
    }
    // corrections du programme d'origine, écrites en BASIC lisible
    if(cfg.patches && io.fixes !== false) for(const k of Object.keys(cfg.patches)){
      const n = +k, src = cfg.patches[k], i = byNum.get(n);
      if(!src){ if(i !== undefined) lines.splice(i, 1); }
      else { const l = {n, t: tokenize(crunch(src))}; if(i !== undefined) lines[i] = l; else { let j = lines.findIndex(x => x.n > n); if(j < 0) j = lines.length; lines.splice(j, 0, l); } }
      byNum.clear(); lines.forEach((l, j) => byNum.set(l.n, j));
    }
    // valeurs des DATA, dans l'ordre du programme
    lines.forEach((l, li) => l.t.forEach(tk => { if(tk.k === 'data') splitData(tk.v).forEach(v => data.push(v)); }));
  })();
  function tokenize(b){
    const t = []; let i = 0;
    const ch = k => String.fromCharCode(b[k]);
    while(i < b.length){
      const c = b[i];
      if(c === 0x20){ i++; continue; }
      if(c === 0x22){ let j = i + 1, s = ''; while(j < b.length && b[j] !== 0x22){ s += ch(j); j++; } t.push({k:'str', v:s}); i = j + 1; continue; }
      if(c === 0xFF){ t.push({k:'fn', v:FN[b[i+1]-0x80]}); i += 2; continue; }
      if(c >= 0x80){
        const w = KW[c-0x80];
        if(w === 'REM' || w === "'"){ t.push({k:'kw', v:'REM'}); break; }
        if(w === 'DATA'){ // texte brut jusqu'au ':' hors guillemets
          let j = i + 1, s = '', q = false;
          while(j < b.length && (q || b[j] !== 0x3A)){ if(b[j] === 0x22) q = !q; s += ch(j); j++; }
          t.push({k:'data', v:s}); i = j; continue;
        }
        t.push({k: OPS.has(w) ? 'op' : 'kw', v:w}); i++; continue;
      }
      if((c >= 0x30 && c <= 0x39) || c === 0x2E){
        let j = i, s = '';
        while(j < b.length && ((b[j] >= 0x30 && b[j] <= 0x39) || b[j] === 0x2E)){ s += ch(j); j++; }
        if(j < b.length && b[j] === 0x45 && j+1 < b.length && /[0-9+\-]/.test(ch(j+1))){ s += 'E'; j++; while(j < b.length && /[0-9+\-]/.test(ch(j))){ s += ch(j); j++; } }
        t.push({k:'num', v:parseFloat(s)}); i = j; continue;
      }
      if(c >= 0x41 && c <= 0x5A){
        let j = i, s = '';
        while(j < b.length && ((b[j] >= 0x41 && b[j] <= 0x5A) || (b[j] >= 0x30 && b[j] <= 0x39))){ s += ch(j); j++; }
        if(j < b.length && b[j] === 0x24){ s += '$'; j++; }
        t.push({k:'id', v:s}); i = j; continue;
      }
      t.push({k:'p', v:ch(i)}); i++;
    }
    return t;
  }
  // texte BASIC -> octets tokenisés, comme le fait le Dragon quand on tape une ligne (mot-clé le plus long d'abord)
  function crunch(src){
    const words = KW.map((w, i) => [w, [0x80 + i]]).concat(FN.map((w, i) => [w, [0xFF, 0x80 + i]])).sort((a, b) => b[0].length - a[0].length);
    const out = []; let i = 0, q = false, raw = false;
    while(i < src.length){
      const c = src[i];
      if(raw || q || c === '"'){ if(c === '"' && !raw) q = !q; out.push(c.charCodeAt(0)); i++; continue; }
      const w = words.find(([k]) => src.startsWith(k, i));
      if(w){ out.push(...w[1]); i += w[0].length; if(w[0] === 'REM' || w[0] === "'" || w[0] === 'DATA') raw = true; continue; }
      out.push(c.toUpperCase().charCodeAt(0)); i++;
    }
    return Uint8Array.from(out);
  }
  function splitData(s){
    const out = []; let cur = '', q = false, quoted = false;
    for(const c of s){
      if(c === '"'){ q = !q; quoted = true; continue; }
      if(c === ',' && !q){ out.push(quoted ? cur : cur.trim()); cur = ''; quoted = false; continue; }
      if(q || c !== ' ' || cur) cur += c;
    }
    out.push(quoted ? cur : cur.trim());
    return out;
  }

  // ---------- état (tout ce qu'il faut pour une sauvegarde) ----------
  let S;
  function fresh(){ return {li:0, ti:0, vars:{}, arrs:{}, stack:[], dp:0, col:0, seed:(cfg.seed === undefined ? (Date.now() & 0x7fffffff) : cfg.seed) >>> 0 || 1, input:null, ended:false}; }
  S = fresh();
  let wait = null;

  const vname = (s) => { const str = s.endsWith('$'); const b = str ? s.slice(0, -1) : s; return b.slice(0, 2) + (str ? '$' : ''); };
  const isStr = n => n.endsWith('$');
  function rnd(){ // générateur reproductible (pour sauvegarder et rejouer)
    let x = S.seed; x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; S.seed = x || 1; return (x >>> 0) / 4294967296;
  }

  // ---------- lecture des tokens ----------
  let T, P; // tokens de la ligne courante, position
  const peek = () => T[P];
  const at = (k, v) => { const t = T[P]; return !!t && t.k === k && (v === undefined || t.v === v); };
  const eat = (k, v) => { if(at(k, v)){ P++; return true; } return false; };
  const need = (k, v) => { if(!eat(k, v)) err('?SN ERROR'); };
  function err(m){ const e = new Error(m + ' IN ' + (lines[S.li] ? lines[S.li].n : '?')); e.basic = true; throw e; }
  const endStmt = () => P >= T.length || at('p', ':') || at('kw', 'ELSE');

  // ---------- expressions ----------
  function expr(){ return orE(); }
  function orE(){ let a = andE(); while(eat('op','OR')){ const b = andE(); a = (a | b); } return a; }
  function andE(){ let a = notE(); while(eat('op','AND')){ const b = notE(); a = (a & b); } return a; }
  function notE(){ if(eat('op','NOT')) return ~notE(); return rel(); }
  function rel(){
    let a = add();
    for(;;){
      let op = '';
      while(at('op','<') || at('op','=') || at('op','>')){ op += peek().v; P++; }
      if(!op) return a;
      const b = add();
      let r;
      switch(op){
        case '=': r = a === b; break; case '<>': case '><': r = a !== b; break;
        case '<': r = a < b; break; case '>': r = a > b; break;
        case '<=': case '=<': r = a <= b; break; case '>=': case '=>': r = a >= b; break;
        default: err('?SN ERROR');
      }
      a = r ? -1 : 0;
    }
  }
  function add(){
    let a = mul();
    for(;;){
      if(eat('op','+')){ const b = mul(); a = (typeof a === 'string' || typeof b === 'string') ? String(a) + String(b) : a + b; }
      else if(eat('op','-')){ a = a - mul(); }
      else return a;
    }
  }
  function mul(){ let a = pw(); for(;;){ if(eat('op','*')) a = a * pw(); else if(eat('op','/')){ const b = pw(); if(b === 0) err('?/0 ERROR'); a = a / b; } else return a; } }
  function pw(){ let a = unary(); while(eat('op','^')) a = Math.pow(a, unary()); return a; }
  function unary(){ if(eat('op','-')) return -unary(); if(eat('op','+')) return unary(); return atom(); }
  function args(){ need('p','('); const a = [expr()]; while(eat('p',',')) a.push(expr()); need('p',')'); return a; }
  function atom(){
    const t = peek(); if(!t) err('?SN ERROR');
    if(t.k === 'num'){ P++; return t.v; }
    if(t.k === 'str'){ P++; return t.v; }
    if(eat('p','(')){ const v = expr(); need('p',')'); return v; }
    if(t.k === 'fn'){ P++; return fn(t.v); }
    if(t.k === 'id'){ P++; return getVar(t.v); }
    err('?SN ERROR');
  }
  function fn(f){
    if(f === 'INKEY$') return '';
    if(f === 'TIMER') return 0;
    const a = args();
    switch(f){
      case 'RND': { const n = Math.floor(a[0]); if(n > 1) return 1 + Math.floor(rnd() * n); if(n === 1) return 1; if(n < 0){ S.seed = (-n * 2654435761) >>> 0 || 1; } return rnd(); }
      case 'INT': return Math.floor(a[0]);
      case 'FIX': return Math.trunc(a[0]);
      case 'ABS': return Math.abs(a[0]);
      case 'SGN': return Math.sign(a[0]);
      case 'SQR': return Math.sqrt(a[0]);
      case 'LEN': return String(a[0]).length;
      case 'LEFT$': return String(a[0]).slice(0, Math.max(0, a[1]));
      case 'RIGHT$': { const s = String(a[0]); return a[1] >= s.length ? s : s.slice(s.length - a[1]); }
      case 'MID$': { const s = String(a[0]); return a.length > 2 ? s.substr(a[1] - 1, Math.max(0, a[2])) : s.substr(a[1] - 1); }
      case 'STR$': return numStr(a[0]).trimEnd();
      case 'VAL': { const v = parseFloat(String(a[0]).trim()); return isNaN(v) ? 0 : v; }
      case 'ASC': return String(a[0]).charCodeAt(0) || 0;
      case 'CHR$': return String.fromCharCode(a[0]);
      case 'INSTR': { let st = 1, s, w; if(a.length > 2){ st = a[0]; s = a[1]; w = a[2]; } else { s = a[0]; w = a[1]; } const i = String(s).indexOf(String(w), st - 1); return i < 0 ? 0 : i + 1; }
      case 'STRING$': return (typeof a[1] === 'string' ? a[1][0] : String.fromCharCode(a[1])).repeat(Math.max(0, a[0]));
      case 'PEEK': return 0;
      default: err('?FC ERROR (' + f + ')');
    }
  }
  function numStr(v){ const s = Number.isInteger(v) ? String(v) : String(+v.toPrecision(9)); return (v >= 0 ? ' ' : '') + s + ' '; }

  // ---------- variables ----------
  function getVar(name){
    const n = vname(name);
    if(at('p','(')){ const ix = args(); const a = arr(n, ix.length); return a.v[idx(a, ix)]; }
    const v = S.vars[n]; return v === undefined ? (isStr(n) ? '' : 0) : v;
  }
  function arr(n, dims){
    let a = S.arrs[n];
    if(!a){ const d = Array(dims).fill(10); a = S.arrs[n] = {d, v: Array(d.reduce((x, y) => x * (y + 1), 1)).fill(isStr(n) ? '' : 0)}; }
    return a;
  }
  function idx(a, ix){
    if(ix.length !== a.d.length) err('?BS ERROR');
    let k = 0; for(let i = 0; i < ix.length; i++){ const j = Math.floor(ix[i]); if(j < 0 || j > a.d[i]) err('?BS ERROR'); k = k * (a.d[i] + 1) + j; }
    return k;
  }
  function ref(){ // cible d'une affectation : {n, a, k}
    const t = peek(); if(!t || t.k !== 'id') err('?SN ERROR'); P++;
    const n = vname(t.v);
    if(at('p','(')){ const ix = args(); const a = arr(n, ix.length); return {n, a, k: idx(a, ix)}; }
    return {n};
  }
  function set(r, v){
    if(isStr(r.n) !== (typeof v === 'string')) err('?TM ERROR');
    if(r.a) r.a.v[r.k] = v; else S.vars[r.n] = v;
  }

  // ---------- affichage ----------
  function out(s){
    if(!s) return;
    io.out(s);
    const i = s.lastIndexOf('\n'); S.col = i < 0 ? S.col + s.length : s.length - i - 1;
  }

  // ---------- instructions ----------
  function jump(n){ const i = byNum.get(n); if(i === undefined) err('?UL ERROR'); S.li = i; S.ti = 0; return 'jump'; }
  function lineNum(){ const t = peek(); if(!t || t.k !== 'num') err('?SN ERROR'); P++; return t.v; }
  function skipToEnd(){ while(P < T.length && !at('p', ':')) P++; }

  function statement(){
    const t = peek(); if(!t) return;
    if(t.k === 'id'){ const r = ref(); need('op','='); set(r, expr()); return; }
    if(t.k === 'data'){ P++; return; }
    if(t.k !== 'kw') err('?SN ERROR');
    P++;
    switch(t.v){
      case 'REM': P = T.length; return;
      case 'LET': { const r = ref(); need('op','='); set(r, expr()); return; }
      case 'CLEAR': skipToEnd(); return;
      case 'CLS': { let c = 0; if(!endStmt()) c = expr(); S.col = 0; io.cls && io.cls(c); return; }
      case 'DIM':
        do { const nm = peek(); need('id'); const n = vname(nm.v); const d = args().map(Math.floor);
             S.arrs[n] = {d, v: Array(d.reduce((x, y) => x * (y + 1), 1)).fill(isStr(n) ? '' : 0)}; } while(eat('p', ','));
        return;
      case 'PRINT': return print();
      case 'INPUT': return input();
      case 'IF': {
        const c = expr();
        if(!eat('kw','THEN') && !at('kw','GO')) err('?SN ERROR');
        if(c){
          if(at('num')) return jump(lineNum());
          return 'then';
        }
        // condition fausse : ELSE éventuel, sinon ligne suivante
        let depth = 0;
        while(P < T.length){ if(at('kw','IF')) depth++; if(at('kw','ELSE')){ if(!depth){ P++; if(at('num')) return jump(lineNum()); return 'then'; } depth--; } P++; }
        return;
      }
      case 'ELSE': P = T.length; return;
      case 'GO': {
        if(eat('kw','TO')) return jump(lineNum());
        if(eat('kw','SUB')){ const n = lineNum(); S.stack.push({k:'g', li:S.li, ti:P}); return jump(n); }
        err('?SN ERROR');
      }
      case 'RETURN': {
        while(S.stack.length && S.stack[S.stack.length-1].k !== 'g') S.stack.pop();
        const f = S.stack.pop(); if(!f) err('?RG ERROR');
        S.li = f.li; S.ti = f.ti; return 'jump';
      }
      case 'ON': {
        const v = Math.floor(expr());
        let sub = false; need('kw','GO'); if(eat('kw','SUB')) sub = true; else need('kw','TO');
        const ns = [lineNum()]; while(eat('p',',')) ns.push(lineNum());
        if(v < 1 || v > ns.length) return;
        if(sub) S.stack.push({k:'g', li:S.li, ti:P});
        return jump(ns[v-1]);
      }
      case 'FOR': {
        const r = ref(); if(r.a) err('?SN ERROR'); need('op','='); set(r, expr());
        need('kw','TO'); const to = expr(); let st = 1; if(eat('kw','STEP')) st = expr();
        for(let i = S.stack.length - 1; i >= 0; i--) if(S.stack[i].k === 'f' && S.stack[i].n === r.n){ S.stack.splice(i); break; }
        S.stack.push({k:'f', n:r.n, to, st, li:S.li, ti:P});
        return;
      }
      case 'NEXT': {
        do {
          let n = null; if(at('id')){ n = vname(peek().v); P++; }
          let i = S.stack.length - 1;
          while(i >= 0 && !(S.stack[i].k === 'f' && (n === null || S.stack[i].n === n))) i--;
          if(i < 0) err('?NF ERROR');
          S.stack.splice(i + 1);
          const f = S.stack[i], v = S.vars[f.n] + f.st; S.vars[f.n] = v;
          if(f.st >= 0 ? v <= f.to : v >= f.to){ S.li = f.li; S.ti = f.ti; return 'jump'; }
          S.stack.pop();
        } while(eat('p',','));
        return;
      }
      case 'READ':
        do { const r = ref(); if(S.dp >= data.length) err('?OD ERROR'); const raw = data[S.dp++];
             set(r, isStr(r.n) ? raw : (raw === '' ? 0 : parseFloat(raw) || 0)); } while(eat('p',','));
        return;
      case 'RESTORE': S.dp = 0; if(at('num')) P++; return;
      case 'END': case 'STOP': S.ended = true; return 'end';
      case 'SOUND': case 'PLAY': case 'POKE': case 'AUDIO': case 'MOTOR': case 'SCREEN': case 'PMODE': case 'PCLS': case 'COLOR':
        { const args = []; while(!endStmt()){ if(eat('p',',')) continue; args.push(expr()); } io.sound && t.v === 'SOUND' && io.sound(args[0], args[1]); return; }
      default: err('?SN ERROR (' + t.v + ')');
    }
  }
  function print(){
    let s = '', nl = true;
    if(eat('p','@')){ expr(); eat('p',','); }   // PRINT @ : position ignorée (texte qui défile)
    while(!endStmt()){
      if(eat('p',';')){ nl = false; continue; }
      if(eat('p',',')){ const c = S.col + s.length; s += ' '.repeat(16 - c % 16); nl = false; continue; }
      if(eat('kw','TAB(')){ const n = expr(); need('p',')'); const c = S.col + s.length; if(n > c) s += ' '.repeat(n - c); nl = false; continue; }
      const v = expr(); s += typeof v === 'string' ? v : numStr(v); nl = true;
    }
    out(nl ? s + '\n' : s);
  }
  function input(){
    let prompt = '';
    if(at('str')){ prompt = peek().v; P++; if(!eat('p',';')) eat('p',','); }
    const refs = []; do refs.push(ref()); while(eat('p',','));
    out(prompt + '? ');
    S.input = {refs: refs.map(r => ({n:r.n, a:r.a ? r.n : null, k:r.k})), prompt};
    io.input && io.input(prompt);
    return 'input';
  }
  function giveLine(text){
    const inp = S.input; if(!inp) return;
    const parts = String(text).toUpperCase().split(',');
    if(cfg.echo !== false) io.out(String(text).toUpperCase() + '\n');   // l'interface affiche elle-même la commande
    S.col = 0;
    inp.refs.forEach((r, i) => {
      const raw = (parts[i] || '').trim(), target = r.a ? {n:r.n, a:S.arrs[r.a], k:r.k} : {n:r.n};
      set(target, isStr(r.n) ? raw : (parseFloat(raw) || 0));
    });
    S.input = null;
  }

  // ---------- exécution ----------
  function run(){
    if(S.ended){ wait = 'end'; return wait; }
    if(S.input){ wait = 'line'; return wait; }
    let steps = 0; const max = cfg.maxSteps || 2e6;
    while(S.li < lines.length){
      T = lines[S.li].t; P = S.ti;
      let r;
      while(P < T.length){
        if(eat('p', ':')) continue;
        r = statement();
        if(r === 'jump') break;
        if(r === 'then') { r = undefined; continue; }
        if(r === 'end'){ wait = 'end'; io.end && io.end(); return wait; }
        if(r === 'input'){ S.ti = P; wait = 'line'; return wait; }
        if(P < T.length && !eat('p', ':') && !at('kw', 'ELSE')) err('?SN ERROR');
        if(at('kw','ELSE')) P = T.length;   // fin d'un THEN exécuté : on saute le ELSE
        if(++steps > max) err('BOUCLE SANS FIN ?');
      }
      if(r === 'jump'){ if(++steps > max) err('BOUCLE SANS FIN ?'); continue; }
      S.li++; S.ti = 0;
    }
    S.ended = true; wait = 'end'; io.end && io.end(); return wait;
  }

  const api = {
    kind: 'basic',
    get wait(){ return wait; },
    yesNo: false,
    run,
    line(s){ giveLine(s); },
    key(){ },
    reset(){ const seed = cfg.seed; S = fresh(); if(seed === undefined) S.seed = (Date.now() & 0x7fffffff) || 1; wait = null; },
    // lecture des variables du programme par la fiche de l'aventure
    mem: {
      v(name){ const n = vname(name); const x = S.vars[n]; return x === undefined ? (isStr(n) ? '' : 0) : x; },
      a(name, ...ix){ const n = vname(name), a = S.arrs[n]; if(!a) return isStr(n) ? '' : 0; let k = 0; for(let i = 0; i < ix.length; i++) k = k * (a.d[i] + 1) + ix[i]; return a.v[k]; },
      line(){ return lines[S.li] ? lines[S.li].n : 0; },
      prompt(){ return S.input ? S.input.prompt : null; }
    },
    snapshot(){ return {m: JSON.stringify(S), c: {}}; },
    restore(s){ S = JSON.parse(typeof s.m === 'string' ? s.m : new TextDecoder().decode(s.m)); wait = S.ended ? 'end' : S.input ? 'line' : null; },
    lines: () => lines.map(l => l.n)
  };
  return api;
}
if(typeof module !== 'undefined') module.exports = Basic;
