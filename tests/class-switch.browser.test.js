// Browser regression test — opens the app from disk; needs puppeteer-core:
//   cd tests && npm i --no-save puppeteer-core@23 && node class-switch.browser.test.js
const p=require('puppeteer-core');
const { launch, openApp } = require('./browser');
(async()=>{
const b=await launch();
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await openApp(pg);
const results=await pg.evaluate(async()=>{
  saveData=()=>{}; openStartingProfsModal=()=>{}; _showApp();
  const out=[]; const check=(name,cond,detail)=>out.push((cond?'PASS ':'FAIL ')+name+(cond?'':'  → '+JSON.stringify(detail)));
  const wait=()=>new Promise(r=>setTimeout(r,50));
  const names=l=>(l||[]).map(s=>typeof s==='object'?s.name:s);
  function mk(cls,lvl){const ch=newCharacter('T','Human',cls,lvl);ch.edition='2024';migrateCharacter(ch);db.characters[ch.id]=ch;currentCharId=ch.id;currentView='character';renderApp();return ch;}

  // 1. Header dropdown keeps both copies of subclass state in sync, and tags features
  let ch=mk('Cleric',3);
  applySubclass(ch.id,'Cleric','Life Domain'); await wait();
  check('header dropdown sets classes[0].subclass', ch.classes[0].subclass==='Life Domain', ch.classes);
  check('subclass features tagged with class', ch.featuresList.filter(f=>f._subclass).every(f=>f._forClass==='Cleric'), ch.featuresList.filter(f=>f._subclass));

  // 2. Level change keeps the subclass
  chClassField(0,'level','5');
  check('level change keeps subclass', ch.subclass==='Life Domain' && ch.classes[0].subclass==='Life Domain', {sub:ch.subclass, classes:ch.classes});

  // 3. Class switch removes subclass features + subclass spells, keeps own picks and feat spells
  applySubclassSpells(ch.id); closeModal();
  ch.spells.known.push({name:'Guiding Bolt',level_int:1});
  ch.spells.known.push({name:'Bless',level_int:1,_fromFeat:true,_sfId:'x'});
  chClassField(0,'class','Fighter');
  check('class switch removes subclass features', !ch.featuresList.some(f=>f._subclass), ch.featuresList.filter(f=>f._subclass).map(f=>f.name));
  check('class switch removes subclass spells', !names(ch.spells.known).includes('Cure Wounds') && !names(ch.spells.prepared).includes('Cure Wounds'), {k:names(ch.spells.known),p:names(ch.spells.prepared)});
  check('class switch keeps own spell picks', names(ch.spells.known).includes('Guiding Bolt'), names(ch.spells.known));
  check('class switch keeps feat-granted spells', ch.spells.known.some(s=>s.name==='Bless'&&s._fromFeat), names(ch.spells.known));

  // 4. Changing subclass removes the previous subclass's spells
  ch=mk('Cleric',3);
  applySubclass(ch.id,'Cleric','Life Domain'); await wait(); applySubclassSpells(ch.id); closeModal();
  applySubclass(ch.id,'Cleric','Light Domain'); await wait();
  check('subclass change removes old subclass spells', !names(ch.spells.known).includes('Cure Wounds'), names(ch.spells.known));
  check('subclass change removes old subclass features', !ch.featuresList.some(f=>f._subclass==='Life Domain'), ch.featuresList.filter(f=>f._subclass).map(f=>f.name));

  // 5. Existing saves (untagged features, subclass only in ch.subclass) are repaired
  ch=mk('Cleric',3);
  ch.subclass='Life Domain'; ch.classes[0].subclass='';
  ch.featuresList.push({name:'Disciple of Life',desc:'',_subclass:'Life Domain'});
  migrateCharacter(ch);
  check('migration restores classes[0].subclass', ch.classes[0].subclass==='Life Domain', ch.classes);
  chClassField(0,'class','Wizard');
  check('old saves: class switch removes subclass features', !ch.featuresList.some(f=>f._subclass), ch.featuresList.filter(f=>f._subclass));

  // 6. Multiclass: changing the primary subclass leaves the other class's subclass alone
  ch=mk('Cleric',3); ch.classes.push({class:'Fighter',subclass:'',level:3}); syncClassFields(ch);
  chClassField(1,'subclass','Champion');
  applySubclass(ch.id,'Cleric','Life Domain'); await wait();
  check('multiclass: other class subclass features survive', ch.featuresList.some(f=>f._subclass==='Champion'), ch.featuresList.filter(f=>f._subclass).map(f=>f.name));
  return out;
});
results.forEach(r=>console.log(r)); if(errs.length) console.log('PAGE ERRORS',errs);
const failed=results.filter(r=>r.startsWith('FAIL')).length; console.log(`\n${results.length-failed}/${results.length} passed`);
await b.close(); process.exit(failed||errs.length?1:0);})();
