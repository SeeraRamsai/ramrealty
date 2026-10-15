"""Create low-data walkthrough copies; leave original footage untouched."""
from pathlib import Path
import argparse,subprocess,json,re,struct
import imageio_ffmpeg
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--validate-only',action='store_true')
args=parser.parse_args()
exe=imageio_ffmpeg.get_ffmpeg_exe()
output=Path('dist/assets/videos/mobile');output.mkdir(exist_ok=True)
report=[]
def metadata(p):
 r=subprocess.run([exe,'-hide_banner','-i',str(p)],capture_output=True,text=True)
 m=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',r.stderr)
 duration=int(m[1])*3600+int(m[2])*60+float(m[3]) if m else None
 return duration,'Audio:' in r.stderr
for src in sorted(Path('dist/assets/videos').glob('*.mp4')):
 dst=output/(src.stem+'-v1.mp4')
 if not args.validate_only and not dst.exists():
  command=[exe,'-hide_banner','-loglevel','error','-y','-i',str(src),'-map','0:v:0','-map','0:a:0?','-vf',"scale=w='if(gte(iw,ih),min(iw,640),-2)':h='if(gte(iw,ih),-2,min(ih,640))',fps=24",'-c:v','libx264','-preset','medium','-crf','28','-maxrate','450k','-bufsize','900k','-profile:v','main','-pix_fmt','yuv420p','-g','48','-keyint_min','24','-threads','2','-c:a','aac','-b:a','48k','-ac','1','-ar','44100','-movflags','+faststart',str(dst)]
  subprocess.run(command,check=True)
 if not dst.exists():raise RuntimeError(f'Missing optimized video: {dst}')
 old_duration,old_audio=metadata(src);new_duration,new_audio=metadata(dst)
 if old_duration is None or new_duration is None or abs(old_duration-new_duration)>.2:raise RuntimeError(f'Duration mismatch: {dst}')
 if old_audio and not new_audio:raise RuntimeError(f'Missing audio: {dst}')
 if dst.stat().st_size>=src.stat().st_size:raise RuntimeError(f'No file-size saving: {dst}')
 # Decode the entire output: catches corrupt/truncated streams beyond the opening frame.
 subprocess.run([exe,'-hide_banner','-loglevel','error','-xerror','-i',str(dst),'-f','null','-'],check=True)
 atoms=[]
 with dst.open('rb') as f:
  while True:
   head=f.read(8)
   if len(head)!=8:break
   size,kind=struct.unpack('>I4s',head);header=8
   if size==1:size=struct.unpack('>Q',f.read(8))[0];header=16
   atoms.append(kind.decode())
   if size<header:break
   f.seek(size-header,1)
 if atoms.index('moov')>atoms.index('mdat'):raise RuntimeError(f'Missing faststart: {dst}')
 entry={'original':str(src).replace('\\','/'),'mobile':str(dst).replace('\\','/'),'originalBytes':src.stat().st_size,'mobileBytes':dst.stat().st_size,'durationSeconds':new_duration,'audioPreserved':old_audio==new_audio,'decoded':True,'faststart':True}
 report.append(entry)
 print(json.dumps(entry),flush=True)
Path('tools/video-manifest.json').write_text(json.dumps(report,indent=2))
print('Validated all videos:',len(report),flush=True)
