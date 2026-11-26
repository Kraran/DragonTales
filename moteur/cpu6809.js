// Emulateur Motorola 6809 minimal (suffisant pour El Diablero et Madness and the Minotaur)
function CPU6809(mem){
  let A=0,B=0,X=0,Y=0,U=0,S=0,PC=0,DP=0,CC=0x50;
  const rd=a=>mem[a&0xffff], wr=(a,v)=>{mem[a&0xffff]=v&0xff;};
  const rd16=a=>(rd(a)<<8)|rd(a+1), wr16=(a,v)=>{wr(a,v>>8);wr(a+1,v);};
  const f8=()=>{const v=mem[PC];PC=(PC+1)&0xffff;return v;};
  const f16=()=>{const v=(mem[PC]<<8)|mem[(PC+1)&0xffff];PC=(PC+2)&0xffff;return v;};
  const s8=v=>(v&0x80)?v-256:v, s16=v=>(v&0x8000)?v-65536:v;
  const D=()=>(A<<8)|B, setD=v=>{A=(v>>8)&0xff;B=v&0xff;};
  const nz8=v=>{CC=(CC&~0x0C)|((v&0x80)?8:0)|((v&0xff)===0?4:0);};
  const nz16=v=>{CC=(CC&~0x0C)|((v&0x8000)?8:0)|((v&0xffff)===0?4:0);};
  const add8=(a,b,c)=>{const r=a+b+c;CC&=~0x2F;if((a^b^r)&0x10)CC|=0x20;if((a^r)&(b^r)&0x80)CC|=2;if(r&0x100)CC|=1;nz8(r);return r&0xff;};
  const sub8=(a,b,c)=>{const r=a-b-c;CC&=~0x0F;if((a^b)&(a^r)&0x80)CC|=2;if(r&0x100)CC|=1;nz8(r);return r&0xff;};
  const add16=(a,b)=>{const r=a+b;CC&=~0x0F;if((a^r)&(b^r)&0x8000)CC|=2;if(r&0x10000)CC|=1;nz16(r);return r&0xffff;};
  const sub16=(a,b)=>{const r=a-b;CC&=~0x0F;if((a^b)&(a^r)&0x8000)CC|=2;if(r&0x10000)CC|=1;nz16(r);return r&0xffff;};
  const ld8=v=>{CC&=~2;nz8(v);return v;}, ld16=v=>{CC&=~2;nz16(v);return v;};
  const pshs8=v=>{S=(S-1)&0xffff;wr(S,v);}, pshs16=v=>{pshs8(v);pshs8(v>>8);};
  const puls8=()=>{const v=rd(S);S=(S+1)&0xffff;return v;}, puls16=()=>{const h=puls8();return (h<<8)|puls8();};
  const pshu8=v=>{U=(U-1)&0xffff;wr(U,v);}, pshu16=v=>{pshu8(v);pshu8(v>>8);};
  const pulu8=()=>{const v=rd(U);U=(U+1)&0xffff;return v;}, pulu16=()=>{const h=pulu8();return (h<<8)|pulu8();};
  const getR=i=>[X,Y,U,S][i], setR=(i,v)=>{v&=0xffff;if(i===0)X=v;else if(i===1)Y=v;else if(i===2)U=v;else S=v;};
  function eaIdx(){
    const pb=f8(),r=(pb>>5)&3;let ea;
    if(!(pb&0x80)){let o=pb&0x1f;if(o>15)o-=32;return (getR(r)+o)&0xffff;}
    switch(pb&0x0f){
      case 0:ea=getR(r);setR(r,ea+1);break;
      case 1:ea=getR(r);setR(r,ea+2);break;
      case 2:setR(r,getR(r)-1);ea=getR(r);break;
      case 3:setR(r,getR(r)-2);ea=getR(r);break;
      case 4:ea=getR(r);break;
      case 5:ea=getR(r)+s8(B);break;
      case 6:ea=getR(r)+s8(A);break;
      case 8:ea=getR(r)+s8(f8());break;
      case 9:ea=getR(r)+s16(f16());break;
      case 11:ea=getR(r)+D();break;
      case 12:{const o=s8(f8());ea=PC+o;break;}
      case 13:{const o=s16(f16());ea=PC+o;break;}
      case 15:ea=f16();break;
      default:throw new Error('postbyte indexe invalide '+pb.toString(16)+' @'+PC.toString(16));
    }
    ea&=0xffff;
    if(pb&0x10)ea=rd16(ea);
    return ea;
  }
  const eaDir=()=>(DP<<8)|f8(), eaExt=()=>f16();
  const eaMode=m=>m===1?eaDir():m===2?eaIdx():eaExt();
  const cond=c=>{const Cf=CC&1,Vf=(CC>>1)&1,Zf=(CC>>2)&1,Nf=(CC>>3)&1;
    switch(c){case 0:return true;case 1:return false;case 2:return !(Cf|Zf);case 3:return !!(Cf|Zf);
      case 4:return !Cf;case 5:return !!Cf;case 6:return !Zf;case 7:return !!Zf;case 8:return !Vf;case 9:return !!Vf;
      case 10:return !Nf;case 11:return !!Nf;case 12:return !(Nf^Vf);case 13:return !!(Nf^Vf);
      case 14:return !(Zf|(Nf^Vf));default:return !!(Zf|(Nf^Vf));}};
  function unop(op,v){ // retourne nouvelle valeur ou undefined (TST)
    let r;
    switch(op){
      case 0:r=sub8(0,v,0);return r;
      case 3:r=(~v)&0xff;CC&=~2;CC|=1;nz8(r);return r;
      case 4:r=v>>1;CC=(CC&~9)|(v&1);nz8(r);return r;
      case 6:r=(v>>1)|((CC&1)<<7);CC=(CC&~1)|(v&1);nz8(r);return r;
      case 7:r=(v>>1)|(v&0x80);CC=(CC&~1)|(v&1);nz8(r);return r;
      case 8:r=(v<<1)&0xff;CC&=~3;if(v&0x80)CC|=1;if((v^r)&0x80)CC|=2;nz8(r);return r;
      case 9:r=((v<<1)|(CC&1))&0xff;CC&=~3;if(v&0x80)CC|=1;if((v^r)&0x80)CC|=2;nz8(r);return r;
      case 10:r=(v-1)&0xff;CC&=~2;if(v===0x80)CC|=2;nz8(r);return r;
      case 12:r=(v+1)&0xff;CC&=~2;if(v===0x7f)CC|=2;nz8(r);return r;
      case 13:CC&=~2;nz8(v);return undefined;
      case 15:CC=(CC&~0x0F)|4;return 0;
      default:throw new Error('op unaire invalide '+op);
    }
  }
  const trGet=i=>{switch(i){case 0:return D();case 1:return X;case 2:return Y;case 3:return U;case 4:return S;case 5:return PC;case 8:return A;case 9:return B;case 10:return CC;case 11:return DP;default:return 0xff;}};
  const trSet=(i,v)=>{switch(i){case 0:setD(v&0xffff);break;case 1:X=v&0xffff;break;case 2:Y=v&0xffff;break;case 3:U=v&0xffff;break;case 4:S=v&0xffff;break;case 5:PC=v&0xffff;break;case 8:A=v&0xff;break;case 9:B=v&0xff;break;case 10:CC=v&0xff;break;case 11:DP=v&0xff;break;}};
  function step(){
    const pc0=PC;let op=f8();
    if(op===0x10||op===0x11){
      const pg=op;op=f8();
      if(pg===0x10){
        if(op>=0x21&&op<=0x2f){const o=s16(f16());if(cond(op&15))PC=(PC+o)&0xffff;return;}
        const m=(op>>4)&3;
        switch(op&0xcf){
          case 0x83:{const v=m?rd16(eaMode(m)):f16();sub16(D(),v);return;}
          case 0x8c:{const v=m?rd16(eaMode(m)):f16();sub16(Y,v);return;}
          case 0x8e:Y=ld16(m?rd16(eaMode(m)):f16());return;
          case 0x8f:wr16(eaMode(m),ld16(Y));return;
          case 0xce:S=ld16(m?rd16(eaMode(m)):f16());return;
          case 0xcf:wr16(eaMode(m),ld16(S));return;
        }
      }else{
        const m=(op>>4)&3;
        switch(op&0xcf){
          case 0x83:{const v=m?rd16(eaMode(m)):f16();sub16(U,v);return;}
          case 0x8c:{const v=m?rd16(eaMode(m)):f16();sub16(S,v);return;}
        }
      }
      throw new Error('opcode inconnu '+pg.toString(16)+op.toString(16)+' @'+pc0.toString(16));
    }
    if(op<0x10||(op>=0x60&&op<0x80)){
      const ea=op<0x10?eaDir():op<0x70?eaIdx():eaExt();const o=op&15;
      if(o===14){PC=ea;return;}
      const r=unop(o,o===15?0:rd(ea));if(r!==undefined)wr(ea,r);return;
    }
    if(op>=0x40&&op<0x60){
      const o=op&15;
      if(op<0x50){const r=unop(o,A);if(r!==undefined)A=r;}else{const r=unop(o,B);if(r!==undefined)B=r;}
      return;
    }
    if(op>=0x20&&op<0x30){const o=s8(f8());if(cond(op&15))PC=(PC+o)&0xffff;return;}
    if(op>=0x80){
      const m=(op>>4)&3,lo=op&15,isB=op>=0xc0;
      // operations 16 bits et sauts
      if(lo===3){const v=m?rd16(eaMode(m)):f16();setD(isB?add16(D(),v):sub16(D(),v));return;}
      if(lo===12){const v=m?rd16(eaMode(m)):f16();if(isB)setD(ld16(v));else sub16(X,v);return;}
      if(lo===13){
        if(isB){wr16(eaMode(m),ld16(D()));return;}
        if(m===0){const o=s8(f8());pshs16(PC);PC=(PC+o)&0xffff;return;}
        const ea=eaMode(m);pshs16(PC);PC=ea;return;
      }
      if(lo===14){const v=m?rd16(eaMode(m)):f16();if(isB)U=ld16(v);else X=ld16(v);return;}
      if(lo===15){wr16(eaMode(m),ld16(isB?U:X));return;}
      if(lo===7){wr(eaMode(m),ld8(isB?B:A));return;}
      const v=m?rd(eaMode(m)):f8();let r=isB?B:A;
      switch(lo){
        case 0:r=sub8(r,v,0);break;
        case 1:sub8(r,v,0);return;
        case 2:r=sub8(r,v,CC&1);break;
        case 4:r=ld8(r&v);break;
        case 5:ld8(r&v);return;
        case 6:r=ld8(v);break;
        case 8:r=ld8(r^v);break;
        case 9:r=add8(r,v,CC&1);break;
        case 10:r=ld8(r|v);break;
        case 11:r=add8(r,v,0);break;
      }
      if(isB)B=r;else A=r;return;
    }
    switch(op){
      case 0x12:return;
      case 0x16:{const o=s16(f16());PC=(PC+o)&0xffff;return;}
      case 0x17:{const o=s16(f16());pshs16(PC);PC=(PC+o)&0xffff;return;}
      case 0x19:{let cf=0;const lsn=A&15,msn=A>>4;if(lsn>9||(CC&0x20))cf|=6;if(msn>9||(CC&1)||(msn>8&&lsn>9))cf|=0x60;const r=A+cf;if(r&0x100)CC|=1;A=r&0xff;nz8(A);return;}
      case 0x1a:CC|=f8();return;
      case 0x1c:CC&=f8();return;
      case 0x1d:A=(B&0x80)?0xff:0;nz16(D());return;
      case 0x1e:{const pb=f8(),a=trGet(pb>>4),b=trGet(pb&15);trSet(pb>>4,b);trSet(pb&15,a);return;}
      case 0x1f:{const pb=f8();trSet(pb&15,trGet(pb>>4));return;}
      case 0x30:X=eaIdx();CC=(CC&~4)|(X===0?4:0);return;
      case 0x31:Y=eaIdx();CC=(CC&~4)|(Y===0?4:0);return;
      case 0x32:S=eaIdx();return;
      case 0x33:U=eaIdx();return;
      case 0x34:{const pb=f8();if(pb&0x80)pshs16(PC);if(pb&0x40)pshs16(U);if(pb&0x20)pshs16(Y);if(pb&0x10)pshs16(X);if(pb&8)pshs8(DP);if(pb&4)pshs8(B);if(pb&2)pshs8(A);if(pb&1)pshs8(CC);return;}
      case 0x35:{const pb=f8();if(pb&1)CC=puls8();if(pb&2)A=puls8();if(pb&4)B=puls8();if(pb&8)DP=puls8();if(pb&0x10)X=puls16();if(pb&0x20)Y=puls16();if(pb&0x40)U=puls16();if(pb&0x80)PC=puls16();return;}
      case 0x36:{const pb=f8();if(pb&0x80)pshu16(PC);if(pb&0x40)pshu16(S);if(pb&0x20)pshu16(Y);if(pb&0x10)pshu16(X);if(pb&8)pshu8(DP);if(pb&4)pshu8(B);if(pb&2)pshu8(A);if(pb&1)pshu8(CC);return;}
      case 0x37:{const pb=f8();if(pb&1)CC=pulu8();if(pb&2)A=pulu8();if(pb&4)B=pulu8();if(pb&8)DP=pulu8();if(pb&0x10)X=pulu16();if(pb&0x20)Y=pulu16();if(pb&0x40)S=pulu16();if(pb&0x80)PC=pulu16();return;}
      case 0x39:PC=puls16();return;
      case 0x3b:CC=puls8();if(CC&0x80){A=puls8();B=puls8();DP=puls8();X=puls16();Y=puls16();U=puls16();}PC=puls16();return;   // RTI
      case 0x3a:X=(X+B)&0xffff;return;
      case 0x3d:{const r=A*B;setD(r);CC=(CC&~5)|(r===0?4:0)|((r&0x80)?1:0);return;}
    }
    throw new Error('opcode inconnu '+op.toString(16)+' @'+pc0.toString(16));
  }
  return {step,
    get PC(){return PC;},set PC(v){PC=v&0xffff;},get A(){return A;},set A(v){A=v&0xff;},get B(){return B;},set B(v){B=v&0xff;},
    get X(){return X;},set X(v){X=v&0xffff;},get Y(){return Y;},set Y(v){Y=v&0xffff;},get U(){return U;},set U(v){U=v&0xffff;},
    get S(){return S;},set S(v){S=v&0xffff;},get CC(){return CC;},set CC(v){CC=v&0xff;},get DP(){return DP;},set DP(v){DP=v&0xff;},
    rts(){PC=puls16();},
    // interruption IRQ (Madness and the Minotaur) : si elle n'est pas masquée, empile tout l'état et saute au vecteur
    irq(vec){ if(CC&0x10) return false; CC|=0x80; pshs16(PC);pshs16(U);pshs16(Y);pshs16(X);pshs8(DP);pshs8(B);pshs8(A);pshs8(CC); CC|=0x10; PC=vec&0xffff; return true; },setZ(z){CC=z?(CC|4):(CC&~4);},
    dump(){return {A,B,X,Y,U,S,PC,DP,CC};},load(s){({A,B,X,Y,U,S,PC,DP,CC}=s);}};
}
if(typeof module!=='undefined')module.exports=CPU6809;
