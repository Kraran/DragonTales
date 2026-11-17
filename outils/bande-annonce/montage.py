import json, subprocess, os
S=json.load(open('/tmp/tr/shots.json')); FPS=30; OUT='/tmp/tr/v'; os.makedirs(OUT,exist_ok=True)
ENC=['-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p','-r','30','-an']
def fades(n,fi,fo):
    f=[]
    if fi: f.append(f"fade=t=in:st=0:d={fi}")
    if fo: f.append(f"fade=t=out:st={n/FPS-fo:.3f}:d={fo}")
    return f
def run(cmd,dst):
    tmp=dst.replace('.mp4','.tmp.mp4'); r=subprocess.run(cmd+[tmp,'-y','-v','error']); assert r.returncode==0,cmd; os.replace(tmp,dst)
def still(name,sec,zoom,fi,fo,dst):
    n=round(sec*FPS); img=S[name][-1][0]
    vf=[ "scale=3840:2160", f"zoompan=z='1+{zoom}*on/{n-1}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={n}:s=1920x1080:fps=30" ] if zoom else ["loop=-1:1",f"trim=duration={sec}"]
    vf+= ["format=yuv420p"]+fades(n,fi,fo)
    run(['ffmpeg','-framerate','30','-i',img,'-vf',','.join(vf),'-frames:v',str(n)]+ENC,dst); return n
def seq(name,fi,fo,dst,extra=0):
    L=S[name]; lst=f'{OUT}/{name}.txt'
    with open(lst,'w') as f:
        for i,(img,k) in enumerate(L):
            k=k+(extra if i==len(L)-1 else 0); f.write(f"file '{img}'\nduration {k/FPS:.5f}\n")
        f.write(f"file '{L[-1][0]}'\n")
    n=sum(k for _,k in L)+extra
    vf=['fps=30','format=yuv420p']+fades(n,fi,fo)
    run(['ffmpeg','-f','concat','-safe','0','-i',lst,'-vf',','.join(vf),'-frames:v',str(n)]+ENC,dst); return n
plan=[('c1','still',4.0,0,.8,.5),('c2','still',4.6,.035,.5,.5),('shelf','seq',.3,.2,0),('introED','still',5.0,.06,.2,.25),
 ('desert','seq',.2,.15,0),('canyon','seq',.15,.15,0),('cabane','seq',.15,.15,0),('machette','seq',.15,.15,0),
 ('carte','still',5.0,.07,.15,.15),('piece','seq',.15,.15,0),('classique','seq',.15,.4,6),('c3','still',2.8,0,.5,.5),
 ('introDM','still',3.6,.05,.3,.2),('introPS','still',3.6,.05,.2,.3),('fin','still',7.6,.025,.8,1.4)]
files=[]; total=0
for p in plan:
    dst=f'{OUT}/{len(files):02d}-{p[0]}.mp4'
    n=still(p[0],p[2],p[3],p[4],p[5],dst) if p[1]=='still' else seq(p[0],p[2],p[3],dst,p[4])
    files.append(dst); total+=n; print(p[0],n/FPS)
with open(f'{OUT}/all.txt','w') as f: f.write(''.join(f"file '{x}'\n" for x in files))
run(['ffmpeg','-f','concat','-safe','0','-i',f'{OUT}/all.txt','-c','copy'],f'{OUT}/video.mp4')
dur=total/FPS; music='/home/claude/dragontales/aventures/eldiablero/musique.ogg'; start=281.9-dur-0.2
run(['ffmpeg','-i',f'{OUT}/video.mp4','-ss',f'{start:.2f}','-i',music,'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k',
     '-af',f'afade=t=in:st=0:d=1.5,afade=t=out:st={dur-3:.2f}:d=3','-t',f'{dur:.3f}','-movflags','+faststart'],'/tmp/tr/DragonTales-trailer.mp4')
print('total',dur,'music from',start)
