# Détokenise un programme Dragon BASIC extrait d une cassette (voir cas.py) et affiche son listing.
#   python outils/detok.py programme.bin > programme.bas
import sys
T=("FOR GO REM ' ELSE IF DATA PRINT ON INPUT END NEXT DIM READ LET RUN RESTORE RETURN STOP POKE CONT LIST CLEAR NEW DEF "
   "CLOAD CSAVE OPEN CLOSE LLIST SET RESET CLS MOTOR SOUND AUDIO EXEC SKIPF DEL EDIT TRON TROFF LINE PCLS PSET PRESET SCREEN "
   "PCLEAR COLOR CIRCLE PAINT GET PUT DRAW PCOPY PMODE PLAY DLOAD RENUM TAB( TO SUB FN THEN NOT STEP OFF + - * / ^ AND OR > = < USING").split()
F=("SGN INT ABS POS RND SQR LOG EXP SIN COS TAN ATN PEEK LEN STR$ VAL ASC CHR$ EOF JOYSTK FIX HEX$ LEFT$ RIGHT$ MID$ POINT "
   "INKEY$ MEM VARPTR INSTR TIMER PPOINT STRING$ USR").split()
d=open(sys.argv[1],'rb').read(); base=int(sys.argv[2],16) if len(sys.argv)>2 else None
p=0; out=[]
while p+4<=len(d):
    nxt=d[p]<<8|d[p+1]
    if nxt==0: break
    if base is None: base=nxt-(d.index(0,p+4)+1)   # adresse du programme en mémoire
    ln=d[p+2]<<8|d[p+3]; q=p+4; s=''; inq=False; rem=False
    while d[q]!=0:
        c=d[q]
        if inq or rem:
            s+=chr(c); 
            if c==0x22 and not rem: inq=False
        elif c==0x22: inq=True; s+='"'
        elif c==0xFF: q+=1; s+=F[d[q]-0x80] if d[q]-0x80<len(F) else '<FF%02X>'%d[q]
        elif c>=0x80:
            t=T[c-0x80] if c-0x80<len(T) else '<%02X>'%c; s+=t
            if t in ('REM',"'"): rem=True
            if t=='DATA': rem=True
        else: s+=chr(c)
        q+=1
    out.append('%d %s'%(ln,s)); p=nxt-base
print('\n'.join(out))
