// Reproducible delivery copies; edit the root sources, then regenerate.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {minify}=require('terser');
const check=process.argv.includes('--check');
const manifest=require('./startup-assets.json');
(async()=>{
  if(require('terser/package.json').version!=='5.51.2')throw Error('Use terser@5.51.2');
  fs.mkdirSync('assets',{recursive:true});
  const tags=[];
  for(const entry of manifest){
    const parts=[];
    for(const source of entry.sources){
      // No compression, property mangling, or top-level renaming. Each original
      // script is parsed independently; combining the two IIFEs preserves order.
      const result=await minify(fs.readFileSync(source,'utf8'),{compress:false,mangle:{toplevel:false},format:{comments:false}});
      parts.push(result.code);
    }
    const code=parts.join(';\n')+'\n';
    const target=path.join('assets',entry.file);
    if(check){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==code)throw Error('Stale generated asset: '+target);}
    else fs.writeFileSync(target,code);
    const version=crypto.createHash('sha256').update(code).digest('hex').slice(0,16);
    tags.push(`<script${entry.defer?' defer':''} src="${target}?v=${version}"></script>`);
  }
  const html=fs.readFileSync('index.html','utf8');
  const pattern=/<script[^>]+src="[^"\n]+\.js(?:\?[^"\n]*)?"[^>]*><\/script>/g;
  let first=true;
  const next=html.replace(pattern,()=>{if(!first)return '';first=false;return tags.join('');});
  if(first)throw Error('Missing startup script tags');
  if(check){if(next!==html)throw Error('Stale startup tags: regenerate assets');}
  else fs.writeFileSync('index.html',next);
  console.log(`${manifest.length} startup scripts; ${manifest.reduce((n,x)=>n+fs.statSync('assets/'+x.file).size,0)} bytes; generated assets ${check?'verified':'written'}`);
})().catch(e=>{console.error(e);process.exit(1)});
