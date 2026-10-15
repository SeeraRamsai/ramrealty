// Format/size conversion only: existing concept masters are preserved unchanged.
const sharp = require('../.asset-tools/node_modules/sharp');
const fs = require('node:fs/promises');
(async () => {
  const results=[];
  for (const slug of ['mvv-gv-grand','vaisakhi-west-winds','a-square-maple-woods','utkarsha-capital-towers']) {
    const output=`dist/assets/responsive/${slug}-concept-hero-v1.jpg`;
    const info=await sharp(`artwork/project-banners/${slug}.png`).rotate().resize({width:1280,withoutEnlargement:true}).jpeg({quality:78,mozjpeg:true}).toFile(output);
    results.push({slug,file:output.replace('dist/',''),width:info.width,height:info.height,bytes:info.size});
  }
  await fs.writeFile('tools/project-hero-manifest.json',JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
