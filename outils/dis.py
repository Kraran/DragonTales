# Desassembleur 6809 de travail (pip install MC6809). Adapter BASE et le nom du binaire au jeu etudie.
import sys
from MC6809.components.MC6809data.MC6809_op_data import OP_DATA
OPS={}
for ins,v in OP_DATA.items():
    for mn,m in v['mnemonic'].items():
        for op,o in m['ops'].items(): OPS[op]=(mn,o['addr_mode'],o['bytes'])
BASE=0x0F00
mem=open('diablero.bin','rb').read()+bytes(8)
def b(a): return mem[a-BASE]
def w(a): return b(a)<<8|b(a+1)
R=['X','Y','U','S']
def s8(v): return v-256 if v>127 else v
def s16(v): return v-65536 if v>32767 else v
def indexed(a):
    pb=b(a);r=R[(pb>>5)&3];n=1
    if not pb&0x80:
        o=pb&0x1f; o=o-32 if o>15 else o
        return f"{o},{r}",1
    ind=pb&0x10;m=pb&0x0f
    if m==0:s=f",{r}+"
    elif m==1:s=f",{r}++"
    elif m==2:s=f",-{r}"
    elif m==3:s=f",--{r}"
    elif m==4:s=f",{r}"
    elif m==5:s=f"B,{r}"
    elif m==6:s=f"A,{r}"
    elif m==8:s=f"{s8(b(a+1))},{r}";n=2
    elif m==9:s=f"${w(a+1):04X},{r}";n=3
    elif m==11:s=f"D,{r}"
    elif m==12:s=f"${(a+2+s8(b(a+1)))&0xffff:04X},PCR";n=2
    elif m==13:s=f"${(a+3+s16(w(a+1)))&0xffff:04X},PCR";n=3
    elif m==15:s=f"${w(a+1):04X}";n=3
    else:s=f"?{pb:02X}"
    if ind:s=f"[{s}]"
    return s,n
TR=['D','X','Y','U','S','PC','?','?','A','B','CC','DP']
def psh(pb,u):
    n=['CC','A','B','DP','X','Y',u,'PC']
    return ','.join(n[i] for i in range(8) if pb>>i&1)
def dis(a):
    op=b(a);l=1
    if op in(0x10,0x11): op=op<<8|b(a+1);l=2
    if op not in OPS: return f"FCB ${b(a):02X}",1
    mn,mode,nb=OPS[op]
    mode=mode or 'INHERENT'
    p=a+l
    if mode=='INHERENT':
        if mn in('TFR','EXG'):
            pb=b(p);return f"{mn} {TR[pb>>4] if pb>>4<12 else '?'},{TR[pb&15] if pb&15<12 else '?'}",l+1
        if mn.startswith('PSH') or mn.startswith('PUL'):
            return f"{mn} {psh(b(p),'S' if mn[-1]=='U' else 'U')}",l+1
        return mn,l
    if mode=='IMMEDIATE':
        if mn in('TFR','EXG'):
            pb=b(p);return f"{mn} {TR[pb>>4] if pb>>4<12 else '?'},{TR[pb&15] if pb&15<12 else '?'}",l+1
        if mn[:3] in('PSH','PUL'): return f"{mn} {psh(b(p),'S' if mn[-1]=='U' else 'U')}",l+1
        return f"{mn} #${b(p):02X}",l+1
    if mode=='IMMEDIATE_WORD': return f"{mn} #${w(p):04X}",l+2
    if mode.startswith('DIRECT'): return f"{mn} <${b(p):02X}",l+1
    if mode.startswith('EXTENDED'): return f"{mn} ${w(p):04X}",l+2
    if mode=='RELATIVE': return f"{mn} ${(p+1+s8(b(p)))&0xffff:04X}",l+1
    if mode=='RELATIVE_WORD': return f"{mn} ${(p+2+s16(w(p)))&0xffff:04X}",l+2
    if mode.startswith('INDEXED'):
        s,n=indexed(p);return f"{mn} {s}",l+n
    return f"?? {mode}",l
if __name__=='__main__':
    a=int(sys.argv[1],16);e=int(sys.argv[2],16)
    while a<e:
        s,l=dis(a)
        print(f"{a:04X}: {' '.join(f'{b(a+i):02X}' for i in range(l)):<15} {s}")
        a+=l
