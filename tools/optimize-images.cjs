const sharp = require('../.asset-tools/node_modules/sharp');
const fs=require('node:fs/promises');const path=require('node:path');
(async()=>{
 const out='dist/assets/responsive';await fs.mkdir(out,{recursive:true});
 const inputs=[['utkarsha-home-hero','dist/assets/Blue Hour 3 BHK Property Enquiry Utkarsha.png',[480,800,1200]],['maple-woods-home-card','dist/assets/Luxury 3 BHK Enquiry Poster Maple Woods.png',[400,800]],['mvv-grand-display','dist/mvv-gv-grand/artwork.png',[400,800]],['west-winds-project','dist/assets/projects/vaisakhi-west-winds.jpg',[480,960]],['utkarsha-project','dist/assets/projects/utkarsha-capital-towers.jpg',[480,960]]];
 const manifest={};
 for(const [name,input,widths] of inputs){manifest[name]=[];for(const width of widths){const output=`${out}/${name}-${width}.webp`;const info=await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:72,effort:5}).toFile(output);manifest[name].push({file:output.replace('dist/',''),width:info.width,height:info.height,bytes:info.size});}}
 for(const slug of ['mvv-gv-grand','vaisakhi-west-winds','a-square-maple-woods','utkarsha-capital-towers']){manifest[slug+'-banner']=[];for(const width of [640,1280]){const output=`${out}/${slug}-banner-${width}.webp`;const info=await sharp(`artwork/project-banners/${slug}.png`).resize({width}).webp({quality:73,effort:5}).toFile(output);manifest[slug+'-banner'].push({file:output.replace('dist/',''),width:info.width,height:info.height,bytes:info.size});}}
 await fs.writeFile('tools/image-manifest.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
