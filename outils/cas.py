# Extrait les programmes d'une cassette Dragon (.cas).
#   python outils/cas.py jeu.cas programme.bin
# La lecture se fait bit à bit : elle retrouve les blocs même quand la copie de la cassette a glissé d'un ou plusieurs
# bits ou que l'amorce est abîmée (cas de Poseidon Adventure). Une cassette peut contenir plusieurs fichiers (un
# chargeur puis le jeu) : s'il y en a plusieurs, ils sont écrits sous programme-1.bin, programme-2.bin, etc.
import sys, os
d=open(sys.argv[1],'rb').read()
bits=[]
for b in d:
    for k in range(8): bits.append((b>>k)&1)          # le Dragon écrit le bit de poids faible en premier
def byte(p): return sum(bits[p+k]<<k for k in range(8)) if 0<=p and p+8<=len(bits) else None
LEADER={0x55,0x54,0x57,0x5D,0x75,0xD5,0x15,0x45,0x51}  # 0x55, éventuellement abîmé d'un bit
blocks=[]; p=8; chained=False                       # chained : juste après un bloc valide (certaines copies n'ont pas d'amorce entre les blocs)
while p<len(bits)-24:
    if byte(p)==0x3C and (chained or byte(p-8) in LEADER):
        t=byte(p+8); n=byte(p+16); data=[byte(p+24+8*i) for i in range(n)]; ck=byte(p+24+8*n)
        if None in data or ck is None: break
        if (t+n+sum(data))&255==ck:                   # bloc valide seulement : une fausse synchro se rattrape au bit suivant
            blocks.append((p,t,bytes(data))); p+=32+8*n
            while byte(p) in LEADER: p+=8
            chained=byte(p)==0x3C; continue
    chained=False; p+=1
files=[]
for p,t,data in blocks:
    if t==0: files.append({'name':data[:8].decode('latin-1').rstrip(),'type':data[8],'data':bytearray()})
    elif t==1 and files: files[-1]['data']+=data
out=sys.argv[2]; base,ext=os.path.splitext(out)
for k,f in enumerate(files,1):
    path=out if len(files)==1 else '%s-%d%s'%(base,k,ext)
    open(path,'wb').write(f['data'])
    print('%s : « %s », %s, %d octets'%(path,f['name'],'BASIC' if f['type']==0 else 'données' if f['type']==1 else 'code machine',len(f['data'])))
