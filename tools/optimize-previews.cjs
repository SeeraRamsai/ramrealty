// Recreate small preview derivatives; original photographs/artwork stay intact.
const sharp = require('../.asset-tools/node_modules/sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const out = 'dist/assets/responsive';
  await fs.mkdir(out, {recursive:true});
  const manifest = [];
  for (const filename of (await fs.readdir('dist/assets/video-thumbnails')).filter(f => f.endsWith('.jpg'))) {
    const input = `dist/assets/video-thumbnails/${filename}`;
    const derivatives = [];
    for (const width of [640, 1200]) {
      const file = `${out}/${path.parse(filename).name}-preview-${width}.webp`;
      const info = await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:72,effort:5}).toFile(file);
      derivatives.push({file:file.replace('dist/',''),width:info.width,height:info.height,bytes:info.size});
    }
    manifest.push({input,originalBytes:(await fs.stat(input)).size,derivatives});
  }
  const logo = `${out}/ram-realty-logo-v1.webp`;
  const info = await sharp('dist/assets/ram-realty-logo-small.png').webp({quality:80,effort:5}).toFile(logo);
  manifest.push({input:'dist/assets/ram-realty-logo-small.png',originalBytes:(await fs.stat('dist/assets/ram-realty-logo-small.png')).size,derivatives:[{file:logo.replace('dist/',''),width:info.width,height:info.height,bytes:info.size}]});
  await fs.writeFile('tools/preview-manifest.json',JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify(manifest.map(m=>({input:m.input,originalBytes:m.originalBytes,optimizedBytes:m.derivatives.map(d=>d.bytes)})),null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
