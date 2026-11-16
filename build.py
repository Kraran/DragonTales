# Assemble DragonTales.html : le moteur (moteur/) et toutes les aventures (aventures/<nom>/) dans une seule page.
#   python build.py            -> DragonTales.html à côté de ce script
# Le numéro de version est lu dans le fichier VERSION.
# Une aventure est un dossier contenant :
#   aventure.js      la fiche (DragonTales.register({...})), assemblée en dernier
#   *.js             ses autres modules (traduction, lieux, dessins, indices…), assemblés par ordre alphabétique avant la fiche
#   programme.bin    le code machine d'origine          boite.jpg       l'image de l'étagère
#   couverture.jpg   le fond de l'écran d'introduction    musique.ogg     la musique (facultative)
# Tous ces fichiers arrivent dans la fiche sous le nom ASSETS : ASSETS.programme, ASSETS.boite, ASSETS.couverture, ASSETS.musique.
import base64, json, os, re, sys
ROOT=os.path.dirname(os.path.abspath(__file__))
rd=lambda *p:open(os.path.join(ROOT,*p),encoding='utf-8').read()
b64=lambda *p:base64.b64encode(open(os.path.join(ROOT,*p),'rb').read()).decode()
MIME={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.ogg':'audio/ogg','.mp3':'audio/mpeg','.m4a':'audio/mp4','.bin':'application/octet-stream'}
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

names=sorted(n for n in os.listdir(os.path.join(ROOT,'aventures')) if os.path.exists(os.path.join(ROOT,'aventures',n,'aventure.js')))
t=rd('moteur','template.html')
font='data:font/ttf;base64,'+b64('moteur','dragon.ttf')
version=rd('VERSION').strip()
for k,v in (('@@VERSION@@',version),('@@FONT@@',font),('@@CPU@@',strip(rd('moteur','cpu6809.js'))),('@@MACHINE@@',strip(rd('moteur','machine.js'))),('@@SFX@@',strip(rd('moteur','sfx.js'))),
            ('@@AVENTURES@@','\n'.join(aventure(n) for n in names)),('@@MOTEUR@@',rd('moteur','dragontales.js'))):
    assert k in t,k
    t=t.replace(k,v)
out=os.path.join(ROOT,'DragonTales.html')
open(out,'w',encoding='utf-8').write(t)
print('DragonTales %s : %d aventure(s) (%s), %.1f Mo'%(version,len(names),', '.join(names),len(t.encode())/1e6))
