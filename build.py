# Assemble DragonTales.html : le moteur (moteur/) et toutes les aventures (aventures/<nom>/) dans une seule page.
#   python build.py            -> DragonTales.html à côté de ce script
#   python build.py --tout     -> y compris les aventures en cours d'intégration (dossiers avec EN-COURS.md)
# Le numéro de version est lu dans le fichier VERSION, sa date dans CHANGELOG.md.
# Une aventure est un dossier contenant :
#   aventure.js      la fiche (DragonTales.register({...})), assemblée en dernier
#   *.js             ses autres modules (traduction, lieux, dessins, indices…), assemblés par ordre alphabétique avant la fiche
#   programme.bin    le code machine d'origine          boite.webp      l'image de l'étagère (ou .jpg, .png)
#   couverture.webp  le fond de l'écran d'introduction    musique.ogg     la musique (facultative)
# Pour garder la page légère : images en WebP qualité 82, musique en Opus 56 kbit/s (voir docs/AJOUTER-UNE-AVENTURE.md).
# Tous ces fichiers arrivent dans la fiche sous le nom ASSETS : ASSETS.programme, ASSETS.boite, ASSETS.couverture, ASSETS.musique.
import base64, json, os, re, sys
ROOT=os.path.dirname(os.path.abspath(__file__))
rd=lambda *p:open(os.path.join(ROOT,*p),encoding='utf-8').read()
b64=lambda *p:base64.b64encode(open(os.path.join(ROOT,*p),'rb').read()).decode()
MIME={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.ogg':'audio/ogg','.mp3':'audio/mpeg','.m4a':'audio/mp4','.bin':'application/octet-stream'}
strip=lambda js:re.sub(r"^.*typeof (require|module)!=='undefined'.*$","",js,flags=re.M)   # lignes réservées aux essais sous Node

def aventure(name):
    d=os.path.join(ROOT,'aventures',name)
    files=sorted(os.listdir(d))
    assets={}
    for f in files:
        base,ext=os.path.splitext(f)
        if ext.lower() in MIME: assets[base]={'mime':MIME[ext.lower()],'b64':b64('aventures',name,f)}
    for need in ('programme','boite','couverture'):
        if need not in assets: sys.exit('aventures/%s : il manque %s'%(name,need))
    mods=[f for f in files if f.endswith('.js') and f!='aventure.js']
    js='\n'.join(strip(rd('aventures',name,f)) for f in mods+['aventure.js'])
    return '<script>\n(function(){\nconst ASSETS=%s;\n%s\n})();\n</script>'%(json.dumps(assets),js)

TOUT='--tout' in sys.argv   # inclure aussi les aventures en cours d'intégration
names=[]
for n in sorted(os.listdir(os.path.join(ROOT,'aventures'))):
    d=os.path.join(ROOT,'aventures',n)
    if not os.path.exists(os.path.join(d,'aventure.js')): continue
    if os.path.exists(os.path.join(d,'EN-COURS.md')) and not TOUT: print('aventures/%s : en cours d\'intégration, non incluse (python build.py --tout pour l\'inclure)'%n); continue
    names.append(n)
t=rd('moteur','template.html')
font='data:font/ttf;base64,'+b64('moteur','dragon.ttf')
version=rd('VERSION').strip()
# date de la version : lue dans CHANGELOG.md, titre « ## X.Y.Z — 16 novembre 2026 »
MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
m=re.search(r'^## %s — (\d{1,2})(?:er)? (\S+) (\d{4})'%re.escape(version),rd('CHANGELOG.md'),re.M)
date='%s-%02d-%02d'%(m.group(3),MOIS.index(m.group(2).lower())+1,int(m.group(1))) if m and m.group(2).lower() in MOIS else ''
auteur='data:image/webp;base64,'+b64('moteur','auteur.webp')
for k,v in (('@@VERSION@@',version),('@@DATE@@',date),('@@AUTEUR@@',auteur),('@@FONT@@',font),('@@CPU@@',strip(rd('moteur','cpu6809.js'))),('@@MACHINE@@',strip(rd('moteur','machine.js'))),('@@BASIC@@',strip(rd('moteur','basic.js'))),('@@FLUX@@',strip(rd('moteur','flux.js'))),('@@SFX@@',strip(rd('moteur','sfx.js'))),
            ('@@AVENTURES@@','\n'.join(aventure(n) for n in names)),('@@MOTEUR@@',rd('moteur','dragontales.js'))):
    assert k in t,k
    t=t.replace(k,v)
out=os.path.join(ROOT,'DragonTales.html')
open(out,'w',encoding='utf-8').write(t)
print('DragonTales %s : %d aventure(s) (%s), %.1f Mo'%(version,len(names),', '.join(names),len(t.encode())/1e6))
