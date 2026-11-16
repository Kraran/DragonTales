# Extrait le binaire d une cassette Dragon (.cas) : python outils/cas.py jeu.cas programme.bin
import sys
d=open(sys.argv[1],'rb').read()
i=0;out=bytearray();blocks=[]
while i<len(d):
    if d[i]==0x55: i+=1; continue
    if d[i]==0x3C:
        t=d[i+1];l=d[i+2];data=d[i+3:i+3+l];ck=d[i+3+l]
        ok=(t+l+sum(data))&255==ck
        blocks.append((i,t,l,ok))
        if t==0: print('HDR',data[:8],data[8:].hex())
        if t==1: out+=data
        i+=4+l
    else:
        print('junk at',hex(i),hex(d[i])); i+=1
print(len(blocks),'blocks; bad:',[b for b in blocks if not b[3]]); print('types',set(b[1] for b in blocks)); print('size',len(out))
open(sys.argv[2],'wb').write(out)
