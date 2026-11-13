const C=document.getElementById('c'),g=C.getContext('2d'),ov=document.getElementById('ov'),touchControls=document.getElementById('touch-controls'),W=900,H=560;let GOAL=100;
const R=(a,b)=>a+Math.random()*(b-a),D=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const keys={},mouse={x:W/2,y:H/2,down:false};
let mode='title',S,B,M,prev='map',last=0;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;if(k==' '){e.preventDefault();miniPress()}if(k=='escape')pauseGame();if(k=='e')toggleEvo();if('123'.includes(k)&&k.length==1)setStrain('bps'[+k-1]);if('zxcv'.includes(k)&&k.length==1)useAb(k);if(k=='q'&&mode=='body')leave();if(k.startsWith('arrow'))e.preventDefault()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
function aim(e){const r=C.getBoundingClientRect();mouse.x=(e.clientX-r.left)*W/r.width;mouse.y=(e.clientY-r.top)*H/r.height}
C.addEventListener('pointermove',aim);
C.addEventListener('pointerdown',e=>{aim(e);mouse.down=true;miniPress()});
addEventListener('pointerup',()=>mouse.down=false);
addEventListener('pointercancel',()=>mouse.down=false);
addEventListener('blur',()=>{mouse.down=false;for(const k in keys)keys[k]=0});
touchControls.querySelectorAll('[data-key]').forEach(button=>{
 const key=button.dataset.key;
 button.addEventListener('pointerdown',e=>{e.preventDefault();keys[key]=1;button.setPointerCapture(e.pointerId)});
 const release=()=>keys[key]=0;
 button.addEventListener('pointerup',release);
 button.addEventListener('pointercancel',release);
 button.addEventListener('lostpointercapture',release)
});
touchControls.querySelectorAll('[data-action]').forEach(button=>{
 button.addEventListener('pointerdown',e=>{
  e.preventDefault();
  const action=button.dataset.action;
  if(action=='shoot'){mouse.down=true;miniPress();button.setPointerCapture(e.pointerId)}
  else if(action=='evo')toggleEvo();
  else if(action=='leave'&&mode=='body')leave();
  else if(action.startsWith('strain-'))setStrain(action.slice(7));
  else if(action.startsWith('ability-'))useAb(action.slice(8))
 });
 if(button.dataset.action=='shoot'){
  const release=()=>mouse.down=false;
  button.addEventListener('pointerup',release);
  button.addEventListener('pointercancel',release);
  button.addEventListener('lostpointercapture',release)
 }
});
const specks=Array.from({length:140},()=>({x:R(0,W),y:R(0,H),r:R(1,3)}));
const UPS=[{k:'tox',n:'Toxina Letal',d:'+dano dos tiros e infecção mais rápida'},{k:'spd',n:'Flagelo Veloz',d:'+velocidade de movimento'},{k:'rate',n:'Cadência de Toxinas',d:'atira mais rápido'},{k:'hp',n:'Cápsula Resistente',d:'+25 de vida máxima e cura'},{k:'spr',n:'Pulgas Infectadas',d:'+raio de contágio (corpos e aura)'}];
const stage=()=>S.kills<GOAL*.1?0:S.kills<GOAL*.3?1:2;
const STN=['Peste Bubônica','Peste Pneumônica','Peste Septicêmica'];
const inE=(x,y,k)=>((x-450)/(420*k))**2+((y-280)/(255*k))**2<=1;
const WW=1800,WH=1100;
const TY={V:{n:'Camponês',c:'#a88a5a',sp:32,diff:1,b:0},A:{n:'Soldado do Reino',c:'#3b6fd1',sp:40,diff:2,b:1},B:{n:'Soldado Invasor',c:'#c23b3b',sp:40,diff:2,b:1},K:{n:'Cavaleiro',c:'#9aa3ad',sp:55,diff:3,b:3},M:{n:'Monge',c:'#6b4a2a',sp:26,diff:2,b:2},N:{n:'Nobre',c:'#c9a227',sp:38,diff:2,b:4},D:{n:'Médico',c:'#5a3a6e',sp:30,diff:3,b:5},T:{n:'Mercador',c:'#2f8f6a',sp:22,diff:2,b:3},F:{n:'Flagelante',c:'#d8d0c0',sp:30,diff:1,b:1},C:{n:'Criança',c:'#d89acb',sp:48,diff:1,b:0}};
const SN={b:'Bubônica',p:'Pneumônica',s:'Septicêmica'},INC={b:11,p:8,s:4.5},SM={b:1,p:1.3,s:1.7},SC={b:'#9bd14f',p:'#6fd6e0',s:'#a05fe0'},NEED={b:0,p:5,s:12};
function setStrain(k){if(!S||mode!='map')return;if(S.kills>=NEED[k]){S.strain=k;banner('Cepa ativa: '+SN[k])}else banner('Cepa bloqueada: faltam '+(NEED[k]-S.kills)+' mortes')}
function start(n){if(n)GOAL=n;
 S={hp:100,max:100,dna:0,kills:0,war:0,strain:'b',u:{tox:0,spd:0,rate:0,hp:0,spr:0},p:{x:WW/2,y:WH-90},cam:{x:0,y:0},hum:[],cor:[],fire:[],rat:[],pt:[],tx:[],ln:[],rg:[],rt:[],cl:[],un:{z:0,x:0,c:0,v:0},cd:{z:0,x:0,c:0,v:0},evT:10,ban:'',bt:0,siege:0,sp:0,docT:15,inv:0,t:0};
 const mk=(t,n)=>{for(let i=0;i<n;i++)spawn(t)};mk('V',40);mk('A',14);mk('B',14);mk('M',8);mk('N',6);mk('K',3);mk('T',8);mk('F',6);mk('C',12);
 for(let i=0;i<8;i++)S.rat.push({x:R(40,500),y:R(WH-300,WH-30)});
 mode='map';ov.className='';bar.style.display='flex';ov.style.display='none';banner('1347: o mundo é grande. Invada humanos e espalhe a peste! (1-3 troca a cepa)')}
function spawn(t,x,y){S.hum.push({type:t,x:x??(t=='A'?R(40,WW/2-100):t=='B'?R(WW/2+100,WW-40):R(40,WW-40)),y:y??R(150,WH-60),inf:0,s:'b',cd:0,tx:0,ty:0,wt:0,ph:R(0,6)})}
function banner(t){S.ban=t;S.bt=4.5}
function go(h,tx,ty,sp,dt){const d=Math.hypot(tx-h.x,ty-h.y)||1;h.x=Math.max(5,Math.min(WW-5,h.x+(tx-h.x)/d*sp*dt));h.y=Math.max(5,Math.min(WH-5,h.y+(ty-h.y)/d*sp*dt))}
function wander(h,sp,dt){h.wt-=dt;if(h.wt<=0||Math.hypot(h.tx-h.x,h.ty-h.y)<8){h.tx=R(20,WW-20);h.ty=R(70,WH-20);h.wt=R(2,6)}go(h,h.tx,h.ty,sp,dt)}
function die(h,why){S.hum=S.hum.filter(x=>x!==h);S.cor.push({x:h.x,y:h.y,t:30,s:h.s||S.strain});if(why=='plague'){const o=stage();S.kills++;S.tx.push({x:h.x,y:h.y-10,t:1.4,s:'☠ '+TY[h.type].n});if(stage()>o)banner('Evolução! Fase: '+STN[stage()]);if(S.kills>=GOAL)endGame(true)}else S.war++}
function burst(x,y,c,n,sp){for(let i=0;i<n;i++){const a=R(0,6.28),v=R(40,sp);S.pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:R(.5,1),c,r:R(2,5)})}}
function infect(o,k,src){if(o.inf)return;o.inf=INC[k];o.s=k;S.rg.push({x:o.x,y:o.y,t:.8,c:SC[k]});if(src)S.ln.push({x1:src.x,y1:src.y,x2:o.x,y2:o.y,t:.7,c:SC[k]})}
function events(){
 const ev=[
 ['⚔️ Batalha campal! Os exércitos se chocam.',()=>{const x=R(300,WW-300),y=R(250,WH-250);for(let i=0;i<7;i++){spawn('A',x+R(-60,60),y+R(-60,60));spawn('B',x+R(-60,60),y+R(-60,60))}}],
 ['🏰 Cerco ao castelo! Soldados correm para o forte.',()=>S.siege=18],
 ['🏃 Êxodo! Refugiados fogem da guerra.',()=>{const x=Math.random()<.5?10:WW-10;for(let i=0;i<10;i++)spawn('V',x,R(100,WH-60))}],
 ['🔥 Fogueiras de purificação! Cuidado com o fogo.',()=>{for(let i=0;i<5;i++)S.fire.push({x:R(100,WW-100),y:R(150,WH-80),t:22});spawn('D',R(60,WW-60),70)}],
 ['🐀 Navio de ratos no porto! Colete-os para ganhar DNA.',()=>{for(let i=0;i<8;i++)S.rat.push({x:R(30,300),y:R(WH-120,WH-20)})}],
 ['🧑‍⚕️ Médicos da corte chegam com máscaras de bico!',()=>{for(let i=0;i<2;i++)spawn('D',R(60,WW-60),70)}],
 ['⛪ Procissão religiosa! Monges enterram os mortos.',()=>{const x=R(200,WW-200),y=R(200,WH-200);for(let i=0;i<6;i++)spawn('M',x+R(-50,50),y+R(-50,50))}],
 ['👑 Nobres fogem do castelo para o campo.',()=>{for(let i=0;i<4;i++)spawn('N',WW/2+R(-50,50),130)}]];
 const e=ev[Math.floor(Math.random()*ev.length)];banner(e[0]);e[1]()}
function updMap(dt){
 S.t+=dt;S.bt-=dt;S.inv-=dt;S.siege-=dt;S.evT-=dt;if(S.evT<=0){events();S.evT=R(20,28)}
 const p=S.p,sp=150+S.u.spd*28;let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
 if(dx||dy){const l=Math.hypot(dx,dy);p.x+=dx/l*sp*dt;p.y+=dy/l*sp*dt}
 p.x=Math.max(10,Math.min(WW-10,p.x));p.y=Math.max(10,Math.min(WH-10,p.y));
 S.cam.x=Math.max(0,Math.min(WW-W,p.x-W/2));S.cam.y=Math.max(0,Math.min(WH-H,p.y-H/2));
 const st=S.strain,aura=st=='p'?42+S.u.spr*10:0,sr=S.u.spr*16;
 S.sp-=dt;if(S.hum.filter(h=>h.type!='D'&&h.type!='K').length<90&&S.sp<=0){const t=['V','V','V','C','C','M','N','A','B','T','F'][Math.floor(Math.random()*11)];if(Math.random()<.5)spawn(t,Math.random()<.5?5:WW-5,R(150,WH-50));else spawn(t,R(50,WW-50),WH-5);S.sp=.5}
 if(S.kills>=6){S.docT-=dt;if(S.docT<=0){if(S.hum.filter(h=>h.type=='D'||h.type=='K').length<3+stage()*2)spawn(S.kills>=12&&Math.random()<.5?'K':'D',R(100,WW-100),60);S.docT=16}}
 for(const h of [...S.hum]){if(!S.hum.includes(h))continue;h.cd-=dt;const ty=h.type,T=TY[ty];
  if(ty=='A'||ty=='B'){let n=null,nd=170;for(const o of S.hum)if(o.type==(ty=='A'?'B':'A')){const d=D(h,o);if(d<nd){nd=d;n=o}}
   if(S.siege>0)go(h,WW/2+(ty=='A'?-70:70),170,70,dt);else if(n)go(h,n.x,n.y,55,dt);else wander(h,T.sp,dt);
   if(n&&nd<14&&Math.random()<dt*.55)die(n,'war')}
  else if(ty=='D'||ty=='K'){const d=D(h,p);if(d<320)go(h,p.x,p.y,ty=='K'?58:62,dt);else wander(h,T.sp,dt);if(d<16&&S.inv<=0)S.hp-=(ty=='K'?10:16)*dt}
  else if(ty=='M'){const c=S.cor.find(c=>D(c,h)<240);if(c){go(h,c.x,c.y,36,dt);if(D(c,h)<20&&Math.random()<dt*.6)S.cor.splice(S.cor.indexOf(c),1)}else wander(h,T.sp,dt)}
  else if(ty=='F'){const c=S.cor.find(c=>D(c,h)<260);if(c)go(h,c.x,c.y,34,dt);else wander(h,T.sp,dt)}
  else if(ty=='N'&&D(h,p)<180)go(h,h.x*2-p.x,h.y*2-p.y,56,dt);
  else wander(h,T.sp,dt);
  if(h.inf>0){h.inf-=dt;const k=h.s;
   if(Math.random()<dt*(k=='p'?3:2.5))burst(h.x,h.y,k=='p'?'#9fe8f0':SC[k],1,28);
   if(h.inf<=0){if(k=='b'){burst(h.x,h.y,'#c8e86a',26,190);S.tx.push({x:h.x,y:h.y-22,t:1,s:'💥 bubão!'});for(const o of S.hum)if(o!==h&&D(o,h)<70+sr)infect(o,'b',h)}
    else burst(h.x,h.y,SC[k],12,90);S.dna+=2;die(h,'plague');continue}
   const cr=k=='p'?36:k=='s'?12:0;if(cr)for(const o of S.hum)if(!o.inf&&D(h,o)<cr&&Math.random()<dt*.6)infect(o,k,h)}
  else{for(const c of S.cor)if(D(h,c)<(c.s=='s'?85:c.s=='b'?60:50)+sr&&Math.random()<dt*.35){infect(h,c.s,c);break}
   if(aura&&D(h,p)<aura&&Math.random()<dt*.6)infect(h,'p',p)}
  if(S.inv<=0&&h.cd<=0&&D(h,p)<14){startBody(h);return}}
 for(const c of S.cor){c.t-=dt;if(D(c,p)<26)S.hp=Math.min(S.max,S.hp+6*dt)}S.cor=S.cor.filter(c=>c.t>0);
 for(const f of S.fire){f.t-=dt;if(D(f,p)<28)S.hp-=22*dt}S.fire=S.fire.filter(f=>f.t>0);
 S.rat=S.rat.filter(r=>{if(D(r,p)<16){S.dna+=1;S.hp=Math.min(S.max,S.hp+6);return false}r.x+=R(-1,1)*30*dt;r.y+=R(-1,1)*30*dt;return true});
 for(const k of 'zxcv')S.cd[k]=Math.max(0,S.cd[k]-dt);
 S.rt=S.rt.filter(r=>{r.t-=dt;let n=null,nd=400;for(const o of S.hum)if(!o.inf){const d=D(o,r);if(d<nd){nd=d;n=o}}if(n){const d=Math.hypot(n.x-r.x,n.y-r.y)||1;r.x+=(n.x-r.x)/d*130*dt;r.y+=(n.y-r.y)/d*130*dt;if(d<10){infect(n,S.strain,r);burst(n.x,n.y,'#c33',6,60);return false}}else{r.x+=R(-1,1)*60*dt;r.y+=R(-1,1)*60*dt}return r.t>0});
 S.cl=S.cl.filter(c=>{c.t-=dt;if(Math.random()<dt*20)burst(c.x+R(-80,80),c.y+R(-80,80),SC[S.strain],1,20);for(const o of S.hum)if(!o.inf&&D(o,c)<100&&Math.random()<dt*.9)infect(o,S.strain,c);return c.t>0});
 S.ln=S.ln.filter(l=>(l.t-=dt)>0);S.rg=S.rg.filter(r=>(r.t-=dt)>0);
 S.pt=S.pt.filter(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.95;q.vy*=.95;q.t-=dt*1.1;return q.t>0});
 S.tx=S.tx.filter(q=>{q.y-=24*dt;q.t-=dt;return q.t>0});
 if(S.hp<=0)endGame(false)}
function startBody(h){
 const diff=TY[h.type].diff;
 if(diff==1&&Math.random()<.5){mode='mini';M={h,diff,a:0,s:2.6,za:R(0,6.28),zw:1.1,hits:0,fails:0};return}
 mode='body';B={h,diff,tissue:[],wbc:[],bul:[],rbc:[],p:{x:W/2,y:H/2+150,a:0},sh:0,dna:0,wt:1,t:0,n:0};
 for(let i=0,n=6+diff*3;i<n;i++){let x,y,ok;do{x=R(110,W-110);y=R(80,H-80);ok=inE(x,y,.82)&&B.tissue.every(t=>Math.hypot(t.x-x,t.y-y)>46)&&Math.hypot(x-B.p.x,y-B.p.y)>110}while(!ok);B.tissue.push({x,y,r:15,pr:0})}
 for(let i=0;i<14;i++)B.rbc.push({x:R(100,W-100),y:R(70,H-70),vx:R(-18,18),vy:R(-18,18)})}
function leave(){B.h.cd=6;S.p.x=B.h.x+30;S.p.y=B.h.y+30;S.inv=1;mode='map';banner('Você escapou. O hospedeiro está em alerta.')}
function kill(h,d){S.dna+=d+TY[h.type].b;h.s=S.strain;die(h,'plague');S.p.x=h.x;S.p.y=h.y;S.inv=1.5;if(mode!='title'&&S.kills<GOAL){mode='map';banner('☠ Hospedeiro morto! +'+d+' DNA')}}
function updBody(dt){
 B.t+=dt;const p=B.p,sp=170+S.u.spd*28;
 let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
 if(dx||dy){const l=Math.hypot(dx,dy);p.x+=dx/l*sp*dt;p.y+=dy/l*sp*dt}
 const nx=(p.x-450)/410,ny=(p.y-280)/245,l=Math.hypot(nx,ny);if(l>1){p.x=450+nx/l*410;p.y=280+ny/l*245}
 p.a=Math.atan2(mouse.y-p.y,mouse.x-p.x);B.sh-=dt;
 if((mouse.down||keys[' '])&&B.sh<=0){B.sh=Math.max(.09,.3-.035*S.u.rate);B.bul.push({x:p.x,y:p.y,vx:Math.cos(p.a)*440,vy:Math.sin(p.a)*440,t:1.2})}
 for(const b of B.bul){b.x+=b.vx*dt;b.y+=b.vy*dt;b.t-=dt;for(const w of B.wbc)if(b.t>0&&Math.hypot(w.x-b.x,w.y-b.y)<w.r+3){w.hp-=1+S.u.tox*.5;b.t=0;w.hit=.1}}
 B.bul=B.bul.filter(b=>b.t>0&&inE(b.x,b.y,1.02));
 for(const w of B.wbc)if(w.hp<=0){B.dna+=w.big?3:1}
 B.wbc=B.wbc.filter(w=>w.hp>0);
 B.wt-=dt;if(B.wt<=0&&B.wbc.length<3+B.diff*2){B.n++;const a=R(0,6.28),big=B.n%5==0;B.wbc.push({x:450+Math.cos(a)*400,y:280+Math.sin(a)*235,hp:big?5+B.diff:2+B.diff,r:big?19:12,big,hit:0});B.wt=2.8-B.diff*.45}
 for(const w of B.wbc){w.hit-=dt;const d=Math.hypot(p.x-w.x,p.y-w.y)||1,s=(46+B.diff*12)*(w.big?.75:1);w.x+=(p.x-w.x)/d*s*dt;w.y+=(p.y-w.y)/d*s*dt;if(d<w.r+9)S.hp-=(w.big?18:11)*(.6+B.diff*.3)*dt}
 for(const r of B.rbc){r.x+=r.vx*dt;r.y+=r.vy*dt;if(!inE(r.x,r.y,.95)){r.vx*=-1;r.vy*=-1}if(Math.hypot(r.x-p.x,r.y-p.y)<16){S.hp=Math.min(S.max,S.hp+7);r.x=R(150,W-150);r.y=R(100,H-100)}}
 let all=true;for(const t of B.tissue){if(Math.hypot(t.x-p.x,t.y-p.y)<t.r+30)t.pr=Math.min(1,t.pr+dt*(.5+.1*S.u.tox)*SM[S.strain]);
  if(t.pr>=1)for(const o of B.tissue)if(o!==t&&Math.hypot(o.x-t.x,o.y-t.y)<75)o.pr=Math.min(1,o.pr+dt*.07);if(t.pr<1)all=false}
 if(all){kill(B.h,2+B.diff*2+B.dna);return}
 if(S.hp<=0)endGame(false)}
function miniPress(){
 if(mode!='mini')return;let d=Math.abs(((M.a-M.za+Math.PI*3)%(Math.PI*2))-Math.PI);
 const df=Math.abs(((M.a-M.za)%(Math.PI*2)+Math.PI*2)%(Math.PI*2));const dist=Math.min(df,Math.PI*2-df);
 if(dist<M.zw/2){M.hits++;M.s+=.5;M.zw=Math.max(.5,M.zw-.12);M.za=R(0,6.28)}else{M.fails++;S.hp-=10}
 if(M.hits>=3){kill(M.h,2+M.diff);return}
 if(M.fails>=3||S.hp<=0){if(S.hp<=0)return endGame(false);M.h.cd=6;S.p.x=M.h.x+30;S.p.y=M.h.y+30;S.inv=1;mode='map';banner('A invasão falhou! Você foi expulso.')}}
function endGame(win){mode='over';ov.style.display='flex';ov.innerHTML=win?`<div class="box"><h1>A Europa sucumbiu</h1><p>Você matou ${S.kills} humanos e a guerra fez o resto. A Morte Negra será lembrada por séculos.</p><button onclick="start()">Jogar de novo</button><button class="ghost" onclick="showTitle()">Menu inicial</button></div>`:`<div class="box"><h1>Colônia extinta</h1><p>Os médicos, o fogo e as defesas humanas venceram desta vez. Mortes causadas: ${S.kills}/${GOAL}.</p><button onclick="start()">Tentar de novo</button><button class="ghost" onclick="showTitle()">Menu inicial</button></div>`}
function toggleEvo(){if(mode=='map'){mode='evo';showEvo()}else if(mode=='evo'){mode='map';ov.style.display='none'}}
const AB={z:{n:'Enxame de Pulgas',d:'Infecta todos num raio de 150',c:6,cd:12},x:{n:'Ratos Infectados',d:'Solta 6 ratos que caçam humanos sãos',c:8,cd:15},c:{n:'Névoa Miasma',d:'Nuvem de 9s que infecta quem entra',c:12,cd:20},v:{n:'Detonar Infectados',d:'Todos os infectados explodem em cadeia',c:15,cd:25}};
function useAb(k){if(!S||mode!='map'||!S.un[k]||S.cd[k]>0)return;S.cd[k]=AB[k].cd;const p=S.p,st=S.strain;
 if(k=='z'){burst(p.x,p.y,SC[st],40,260);S.rg.push({x:p.x,y:p.y,t:.8,c:SC[st],big:1});for(const o of S.hum)if(D(o,p)<150+S.u.spr*12)infect(o,st,p)}
 if(k=='x')for(let i=0;i<6;i++)S.rt.push({x:p.x+R(-30,30),y:p.y+R(-30,30),t:14});
 if(k=='c')S.cl.push({x:p.x,y:p.y,t:9});
 if(k=='v'){let n=0;for(const o of S.hum)if(o.inf>0){o.inf=Math.min(o.inf,.2+R(0,1.6));n++}banner('💥 '+n+' infectados detonando em cadeia!')}}
function showEvo(){ov.style.display='flex';ov.innerHTML=`<div class="box"><h1>Evolução</h1><p>DNA: <b>${S.dna}</b></p><p><b>Mutações</b></p>`+UPS.map(u=>{const lv=S.u[u.k],c=3+lv*3;return `<div class="up"><div><b>${u.n}</b> (nv ${lv}/10)<small>${u.d}</small></div><button ${lv>=10||S.dna<c?'disabled':''} onclick="buy('${u.k}')">${lv>=10?'MAX':c+' DNA'}</button></div>`}).join('')+`<p><b>Habilidades ativas</b></p>`+Object.keys(AB).map(k=>{const a=AB[k],has=S.un[k];return `<div class="up"><div><b>${a.n}</b> [${k.toUpperCase()}]<small>${a.d} · recarga ${a.cd}s</small></div><button ${has||S.dna<a.c?'disabled':''} onclick="buyAb('${k}')">${has?'OK':a.c+' DNA'}</button></div>`}).join('')+`<button onclick="toggleEvo()">Voltar à guerra (E)</button></div>`}
function buyAb(k){const a=AB[k];if(S.un[k]||S.dna<a.c)return;S.dna-=a.c;S.un[k]=1;showEvo()}
function buy(k){const c=3+S.u[k]*3;if(S.dna<c||S.u[k]>=10)return;S.dna-=c;S.u[k]++;if(k=='hp'){S.max=100+25*S.u.hp;S.hp=Math.min(S.max,S.hp+25)}showEvo()}
// ---------- desenho ----------
const dec={tr:Array.from({length:80},()=>({x:R(0,WW),y:R(0,WH),r:R(10,20)})),ho:[],sp:Array.from({length:420},()=>({x:R(0,WW),y:R(0,WH),r:R(1,3)}))};
[[420,450],[1320,560],[900,830]].forEach(([cx,cy])=>{for(let i=0;i<6;i++)dec.ho.push({x:cx+R(-90,90),y:cy+R(-60,60),w:R(26,38)})});
function drawMap(){
 const c=S.cam;g.save();g.translate(-c.x,-c.y);
 g.fillStyle='#2b3a1e';g.fillRect(c.x,c.y,W,H);g.fillStyle='#34452a';for(const s of dec.sp){g.beginPath();g.arc(s.x,s.y,s.r,0,7);g.fill()}
 g.fillStyle='#4a3a28';g.fillRect(0,WH/2-24,WW,48);g.fillRect(WW/2-20,130,40,WH);
 g.fillStyle='#1f4a52';g.beginPath();g.ellipse(1450,260,140,75,0,0,7);g.fill();g.fillStyle='#1b3550';g.fillRect(0,WH-110,300,110);g.fillStyle='#6a4a2a';g.fillRect(40,WH-92,90,30);g.fillRect(80,WH-120,3,30);
 g.fillStyle='#1d3317';for(const t of dec.tr){g.beginPath();g.arc(t.x,t.y,t.r,0,7);g.fill()}
 for(const h of dec.ho){g.fillStyle='#7a5a3a';g.fillRect(h.x,h.y,h.w,h.w*.7);g.fillStyle='#8a3a2a';g.fillRect(h.x-2,h.y-5,h.w+4,8)}
 g.fillStyle='#6b6761';g.fillRect(WW/2-60,40,120,80);g.fillStyle='#55514b';for(const x of [-70,50])g.fillRect(WW/2+x,26,24,100);g.fillStyle='#2a2620';g.fillRect(WW/2-12,90,24,30);
 g.fillStyle='#b9a88e';g.font='13px Georgia';g.fillText('Castelo',WW/2-22,20);g.fillText('Porto',120,WH-125);g.fillText('Pântano',1410,160);g.fillText('Vila',400,380);
 if(S.siege>0){g.strokeStyle='rgba(220,60,40,.5)';g.setLineDash([8,8]);g.beginPath();g.arc(WW/2,170,70,0,7);g.stroke();g.setLineDash([])}
 for(const o of S.cor){g.fillStyle=SC[o.s]+'22';g.beginPath();g.arc(o.x,o.y,(o.s=='s'?85:o.s=='b'?60:50)+S.u.spr*16,0,7);g.fill();g.strokeStyle='#bbb';g.lineWidth=3;g.beginPath();g.moveTo(o.x-6,o.y-6);g.lineTo(o.x+6,o.y+6);g.moveTo(o.x+6,o.y-6);g.lineTo(o.x-6,o.y+6);g.stroke()}
 for(const f of S.fire){const r=18+Math.sin(S.t*12+f.x)*3;g.fillStyle='rgba(255,120,20,.35)';g.beginPath();g.arc(f.x,f.y,28,0,7);g.fill();g.fillStyle='#ff9a2e';g.beginPath();g.arc(f.x,f.y,r*.7,0,7);g.fill();g.fillStyle='#ffe27a';g.beginPath();g.arc(f.x,f.y,r*.35,0,7);g.fill()}
 g.fillStyle='#6a5b4d';for(const r of S.rat){g.beginPath();g.ellipse(r.x,r.y,7,4,0,0,7);g.fill();g.fillRect(r.x+6,r.y-1,6,1.5)}
 for(const c of S.cl){const gr=g.createRadialGradient(c.x,c.y,10,c.x,c.y,110);gr.addColorStop(0,SC[S.strain]+'77');gr.addColorStop(1,SC[S.strain]+'00');g.globalAlpha=Math.min(1,c.t/2);g.fillStyle=gr;g.beginPath();g.arc(c.x,c.y,110+Math.sin(S.t*3)*6,0,7);g.fill();g.globalAlpha=1}
 for(const l of S.ln){g.globalAlpha=l.t/.7;g.strokeStyle=l.c;g.lineWidth=2;g.beginPath();g.moveTo(l.x1,l.y1);g.lineTo(l.x2,l.y2);g.stroke()}
 for(const r of S.rg){g.globalAlpha=r.t/.8;g.strokeStyle=r.c;g.lineWidth=3;g.beginPath();g.arc(r.x,r.y,(r.big?170:34)*(1-r.t/.8)+4,0,7);g.stroke()}g.globalAlpha=1;
 for(const r of S.rt){g.fillStyle='#5a4a3e';g.beginPath();g.ellipse(r.x,r.y,8,5,0,0,7);g.fill();g.fillStyle='#f33';g.fillRect(r.x+5,r.y-2,2,2)}
 for(const h of S.hum)drawH(h);
 const p=S.p,aura=S.strain=='p'?42+S.u.spr*10:0;
 if(aura){g.strokeStyle=SC.p;g.globalAlpha=.4;g.beginPath();g.arc(p.x,p.y,aura+Math.sin(S.t*4)*3,0,7);g.stroke();g.globalAlpha=1}
 if(S.inv>0&&Math.floor(S.t*10)%2)g.globalAlpha=.4;drawBac(p.x,p.y,S.t*2,1);g.globalAlpha=1;
 for(const q of S.pt){g.globalAlpha=Math.min(1,q.t);g.fillStyle=q.c;g.beginPath();g.arc(q.x,q.y,q.r,0,7);g.fill()}g.globalAlpha=1;
 g.font='bold 13px Georgia';g.textAlign='center';for(const q of S.tx){g.globalAlpha=Math.min(1,q.t);g.fillStyle='#ffd27a';g.fillText(q.s,q.x,q.y)}g.globalAlpha=1;g.textAlign='left';
 g.strokeStyle='#5a4a3a';g.lineWidth=4;g.strokeRect(0,0,WW,WH);g.restore();
 let ni=0;for(const h of S.hum)if(h.inf>0)ni++;const vr=Math.min(.55,ni/Math.max(1,S.hum.length)*1.8);
 if(vr>.02){const v=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);v.addColorStop(0,SC[S.strain]+'00');v.addColorStop(1,SC[S.strain]);g.globalAlpha=vr;g.fillStyle=v;g.fillRect(0,0,W,H);g.globalAlpha=1}}
function drawH(h){const T=TY[h.type],inf=h.inf>0,pr=inf?1-h.inf/INC[h.s]:0,col=inf?SC[h.s]:null,t=h.type;g.save();g.translate(h.x,h.y);if(t=='C')g.scale(.72,.72);
 g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(0,4,9,5,0,0,7);g.fill();
 g.fillStyle=T.c;g.beginPath();g.arc(0,0,8,0,7);g.fill();
 if(inf){const gr=g.createRadialGradient(0,0,2,0,0,24+pr*10);gr.addColorStop(0,col+'bb');gr.addColorStop(1,col+'00');g.fillStyle=gr;g.beginPath();g.arc(0,0,34,0,7);g.fill();g.globalAlpha=.3+.5*pr;g.fillStyle=col;g.beginPath();g.arc(0,0,8,0,7);g.fill();g.globalAlpha=1}
 g.fillStyle='#e8c9a0';g.beginPath();g.arc(0,-1,4.5,0,7);g.fill();
 if(t=='A'||t=='B'){g.strokeStyle='#ddd';g.lineWidth=2;g.beginPath();g.moveTo(9,-7);g.lineTo(9,8);g.stroke()}
 if(t=='D'){g.fillStyle='#d8c9a0';g.beginPath();g.moveTo(-2,-3);g.lineTo(2,-3);g.lineTo(0,5);g.fill()}
 if(t=='K'){g.fillStyle='#cfd6de';g.beginPath();g.arc(0,-2,5,Math.PI,0);g.fill();g.fillStyle='#c23b3b';g.fillRect(-1,-9,2,5)}
 if(t=='M'){g.fillStyle='#3d2a16';g.beginPath();g.arc(0,-2,5.5,Math.PI,0);g.fill();g.fillStyle='#eee';g.fillRect(-1,3,2,6);g.fillRect(-3,5,6,2)}
 if(t=='T'){g.fillStyle='#7a4a1a';g.fillRect(-10,-3,6,9)}
 if(t=='F'){g.strokeStyle='#a22';g.lineWidth=1.5;g.beginPath();g.moveTo(8,-4);g.lineTo(13,3+Math.sin(S.t*8)*3);g.stroke()}
 if(t=='N'){g.fillStyle='#ffd23a';g.beginPath();g.moveTo(-4,-5);g.lineTo(-4,-9);g.lineTo(-2,-6);g.lineTo(0,-10);g.lineTo(2,-6);g.lineTo(4,-9);g.lineTo(4,-5);g.fill()}
 if(inf){const k=h.s;
  if(k=='b')for(let i=0;i<5;i++){const a=i*1.25+h.ph,r=2+pr*5+Math.sin(S.t*6+i)*pr*1.2,bx=Math.cos(a)*7,by=Math.sin(a)*7;g.fillStyle=col;g.beginPath();g.arc(bx,by,r,0,7);g.fill();g.fillStyle='rgba(255,255,255,.65)';g.beginPath();g.arc(bx-r*.3,by-r*.3,r*.3,0,7);g.fill()}
  else if(k=='p'){g.strokeStyle=col;g.globalAlpha=.5;for(let i=0;i<2;i++){g.beginPath();g.arc(0,0,11+((S.t*9+i*4+h.ph*3)%9),0,7);g.stroke()}g.globalAlpha=1}
  else{g.strokeStyle='#3a1a5a';g.lineWidth=1.5;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-7,-6+i*4);g.lineTo(7,-4+i*4);g.stroke()}g.strokeStyle=col;g.beginPath();g.arc(0,0,10,0,7);g.stroke()}
  g.fillStyle='#000a';g.fillRect(-9,-17,18,4);g.fillStyle=col;g.fillRect(-9,-17,18*pr,4)}
 if(h.cd>0){g.strokeStyle='#ff0';g.beginPath();g.arc(0,0,12,0,7);g.stroke()}g.restore()}
function drawBac(x,y,a,s){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='rgba(143,209,79,.25)';g.beginPath();g.arc(0,0,20+Math.sin(a*2)*2,0,7);g.fill();
 g.rotate(a);g.strokeStyle='#b8f06a';g.lineWidth=1.5;for(let i=0;i<6;i++){const q=i*1.05;g.beginPath();g.moveTo(Math.cos(q)*8,Math.sin(q)*5);g.lineTo(Math.cos(q)*15,Math.sin(q)*11+Math.sin(a*5+i)*3);g.stroke()}
 g.fillStyle='#8fd14f';g.beginPath();g.ellipse(0,0,11,6,0,0,7);g.fill();g.fillStyle='#4a7a22';g.beginPath();g.arc(-4,0,2,0,7);g.arc(4,0,2,0,7);g.fill();g.restore()}
function drawBody(){
 const gr=g.createRadialGradient(450,280,40,450,280,430);gr.addColorStop(0,'#5a1a24');gr.addColorStop(1,'#2a0910');g.fillStyle='#120508';g.fillRect(0,0,W,H);
 g.fillStyle=gr;g.beginPath();g.ellipse(450,280,425,258,0,0,7);g.fill();g.strokeStyle='#8a3040';g.lineWidth=4;g.stroke();
 g.fillStyle='rgba(200,40,50,.55)';for(const r of B.rbc){g.beginPath();g.arc(r.x,r.y,9,0,7);g.fill();g.fillStyle='rgba(120,10,20,.6)';g.beginPath();g.arc(r.x,r.y,3.5,0,7);g.fill();g.fillStyle='rgba(200,40,50,.55)'}
 let tot=0;for(const t of B.tissue){tot+=t.pr;const k=t.pr;g.fillStyle=`rgb(${Math.round(230-120*k)},${Math.round(150+50*k)},${Math.round(170-100*k)})`;g.beginPath();g.arc(t.x,t.y,t.r,0,7);g.fill();if(k>0){g.globalAlpha=.25+.35*k;g.fillStyle=SC[S.strain];g.beginPath();g.arc(t.x,t.y,t.r+5+Math.sin(B.t*5+t.x)*2,0,7);g.fill();g.globalAlpha=1}g.fillStyle=k>=1?'#2d4a14':'#a04a62';g.beginPath();g.arc(t.x,t.y,6,0,7);g.fill();
  if(Math.hypot(t.x-B.p.x,t.y-B.p.y)<t.r+30&&k<1){g.strokeStyle='#b8f06a';g.lineWidth=2;g.beginPath();g.arc(t.x,t.y,t.r+4,0,Math.PI*2*k);g.stroke()}}
 for(const w of B.wbc){g.fillStyle=w.hit>0?'#fff':'#cfd8f0';g.beginPath();g.arc(w.x,w.y,w.r,0,7);g.fill();g.fillStyle='#6a78b8';g.beginPath();g.arc(w.x-3,w.y-2,w.r*.35,0,7);g.arc(w.x+3,w.y+3,w.r*.3,0,7);g.fill();if(w.big){g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(w.x,w.y,w.r+3,0,7);g.stroke()}}
 g.fillStyle='#b8f06a';for(const b of B.bul){g.beginPath();g.arc(b.x,b.y,3.5,0,7);g.fill()}
 drawBac(B.p.x,B.p.y,B.p.a,1);
 g.strokeStyle='rgba(184,240,106,.3)';g.setLineDash([4,6]);g.beginPath();g.moveTo(B.p.x,B.p.y);g.lineTo(mouse.x,mouse.y);g.stroke();g.setLineDash([]);
 const pc=tot/B.tissue.length;g.fillStyle='#000a';g.fillRect(250,12,400,14);g.fillStyle='#8fd14f';g.fillRect(250,12,400*pc,14);
 g.fillStyle='#fff';g.font='13px Georgia';g.textAlign='center';g.fillText('Infecção do hospedeiro '+Math.round(pc*100)+'% — fique perto das células rosas, mate os glóbulos brancos',450,40);g.textAlign='left'}
function drawMini(){
 g.fillStyle='#1a0a0e';g.fillRect(0,0,W,H);const cx=450,cy=290,r=170;
 g.fillStyle='#fff';g.font='20px Georgia';g.textAlign='center';g.fillText('Invasão da Linfa: aperte ESPAÇO/clique quando a agulha estiver na zona verde',450,60);
 g.fillText('Acertos '+M.hits+'/3 · Falhas '+M.fails+'/3',450,95);
 g.strokeStyle='#5a2030';g.lineWidth=26;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();
 g.strokeStyle='#8fd14f';g.beginPath();g.arc(cx,cy,r,M.za-M.zw/2,M.za+M.zw/2);g.stroke();
 g.strokeStyle='#fff';g.lineWidth=4;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(M.a)*(r+16),cy+Math.sin(M.a)*(r+16));g.stroke();drawBac(cx,cy,M.a,1.4);g.textAlign='left'}
function hud(){
 g.fillStyle='#000b';g.fillRect(0,0,W,30);g.font='14px Georgia';g.fillStyle='#e8dcc8';
 g.fillText('Vida',10,20);g.fillStyle='#400';g.fillRect(48,8,120,14);g.fillStyle='#d33';g.fillRect(48,8,120*Math.max(0,S.hp)/S.max,14);
 g.fillStyle='#e8dcc8';g.fillText('DNA: '+S.dna,185,20);g.fillText('Mortes: '+S.kills+'/'+GOAL,270,20);g.fillStyle=SC[S.strain];g.fillText('Cepa: '+SN[S.strain]+' · '+STN[stage()],390,20);
 g.fillStyle='#e8dcc8';g.fillText('[E] Evoluir',790,20);g.fillStyle=SC[S.strain];g.fillRect(0,30,W*Math.min(1,S.kills/GOAL),3);
 if(mode=='map'||mode=='evo'||(mode=='pause'&&pm=='map')){
  ['b','p','s'].forEach((k,i)=>{const x=10+i*150,ok=S.kills>=NEED[k],on=S.strain==k;g.fillStyle=on?SC[k]:'#000a';g.fillRect(x,36,142,22);g.strokeStyle=SC[k];g.lineWidth=1;g.strokeRect(x,36,142,22);g.fillStyle=on?'#10200a':ok?SC[k]:'#777';g.font='12px Georgia';g.fillText((i+1)+' '+SN[k]+(ok?'':' 🔒'+NEED[k]),x+6,51)});
  'zxcv'.split('').forEach((k,i)=>{const x=470+i*105,a=AB[k],on=S.un[k],cd=S.cd[k];g.fillStyle='#000a';g.fillRect(x,36,100,22);if(on){g.fillStyle=cd>0?'#554':'#5a7a2a';g.fillRect(x,36,cd>0?100*(1-cd/a.cd):100,22)}g.strokeStyle=on?'#b8f06a':'#555';g.strokeRect(x,36,100,22);g.fillStyle=on?'#fff':'#777';g.font='11px Georgia';g.fillText(k.toUpperCase()+' '+a.n.split(' ')[0]+(on?(cd>0?' '+Math.ceil(cd):''):' 🔒'),x+5,51)});
  const al=S.hum.length,ic={b:0,p:0,s:0};S.hum.forEach(h=>{if(h.inf>0)ic[h.s]++});const inf=ic.b+ic.p+ic.s;
  g.fillStyle='#000b';g.fillRect(8,H-124,232,116);g.fillStyle='#e8dcc8';g.font='bold 12px Georgia';g.fillText('PAINEL EPIDEMIOLÓGICO',16,H-108);g.font='12px Georgia';
  g.fillText('Vivos: '+(al-inf)+' sãos · '+inf+' infectados',16,H-92);
  [['b','Bub.'],['p','Pneu.'],['s','Sept.']].forEach(([k,n],i)=>{const y=H-84+i*16;g.fillStyle='#e8dcc8';g.fillText(n,16,y+10);g.fillStyle='#222';g.fillRect(62,y,118,10);g.fillStyle=SC[k];g.fillRect(62,y,118*ic[k]/Math.max(1,al),10);g.fillStyle='#e8dcc8';g.fillText(ic[k],188,y+10)});
  g.fillStyle='#e8dcc8';g.fillText('☠ Peste: '+S.kills+'   ⚔ Guerra: '+S.war+'   ⚰ '+S.cor.length,16,H-14);
  const mx=W-170,my=H-106,sx=162/WW,sy=98/WH;g.fillStyle='#000c';g.fillRect(mx-2,my-2,166,102);g.fillStyle='#2b3a1e';g.fillRect(mx,my,162,98);
  for(const h of S.hum){g.fillStyle=h.inf>0?SC[h.s]:(h.type=='D'||h.type=='K')?'#d0f':'#999';g.fillRect(mx+h.x*sx,my+h.y*sy,2.5,2.5)}
  g.fillStyle='#fff';g.fillRect(mx+S.p.x*sx-2,my+S.p.y*sy-2,5,5);g.strokeStyle='#fff8';g.lineWidth=1;g.strokeRect(mx+S.cam.x*sx,my+S.cam.y*sy,W*sx,H*sy)}
 if(S.bt>0){g.globalAlpha=Math.min(1,S.bt);g.fillStyle='#000c';g.fillRect(250,H-50,430,34);g.fillStyle='#ffd27a';g.font='13px Georgia';g.textAlign='center';g.fillText(S.ban,465,H-28);g.textAlign='left';g.globalAlpha=1}}
const bar=document.getElementById('bar');let pm='map',tt=0;
const tp=Array.from({length:80},()=>({x:R(0,W),y:R(0,H),v:R(8,32),r:R(1,4),ph:R(0,6)}));
function drawTitle(dt){tt+=dt;g.fillStyle='#0b0706';g.fillRect(0,0,W,H);
 const gr=g.createRadialGradient(W/2,H*.95,30,W/2,H*.95,W*.7);gr.addColorStop(0,'#3a6a2288');gr.addColorStop(1,'#0b070600');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.globalAlpha=.85;g.fillStyle='#d8d0b0';g.beginPath();g.arc(150,110,38,0,7);g.fill();g.fillStyle='#0b0706';g.beginPath();g.arc(165,102,34,0,7);g.fill();g.globalAlpha=1;
 g.fillStyle='#050303';g.beginPath();g.moveTo(0,H);g.lineTo(0,H-90);for(let x=0;x<=W;x+=30)g.lineTo(x,H-90-Math.sin(x*.01)*25-Math.sin(x*.027)*12);g.lineTo(W,H);g.fill();
 g.fillRect(650,H-200,170,120);for(const x of [640,730,800])g.fillRect(x,H-245,32,165);for(const x of [640,730,800])for(let i=0;i<3;i++)g.fillRect(x+i*11,H-257,8,12);
 g.fillStyle='#d9b36a';g.fillRect(742,H-200,8,14);
 for(const q of tp){q.y-=q.v*dt;q.x+=Math.sin(tt+q.ph)*10*dt;if(q.y<-5){q.y=H+5;q.x=R(0,W)}g.globalAlpha=.25+.25*Math.sin(tt*2+q.ph);g.fillStyle='#9bd14f';g.beginPath();g.arc(q.x,q.y,q.r,0,7);g.fill()}g.globalAlpha=1}
function showTitle(){mode='title';bar.style.display='none';ov.className='t';ov.style.display='flex';
 ov.innerHTML=`<div class="box"><div class="skull">☠</div><h1>PESTE NEGRA</h1><div class="sub">A Pandemia · Europa, 1347</div><p>Exércitos se massacram, a fome corre solta e você é a <i>Yersinia pestis</i>. Invada corpos, vença as defesas humanas e deixe a Europa de joelhos.</p><div class="modes"><button class="mode" onclick="start(100)"><b>Pandemia</b><small>100 mortes · ideal para começar</small></button><button class="mode" onclick="start(1000)"><b>Apocalipse</b><small>1000 mortes · desafio extremo</small></button></div><button class="ghost" onclick="howTo()">📖 Como jogar</button><div class="foot">Dica: a guerra muda tudo. Fique de olho nos eventos.</div></div>`}
function howTo(){ov.className='t';ov.innerHTML=`<div class="box"><h1 style="font-size:28px">Como jogar</h1><p><b>WASD/setas</b> mover · <b>Mouse/Espaço</b> atirar toxinas · <b>Q</b> sair do corpo · <b>E</b> evoluir · <b>1/2/3</b> trocar cepa · <b>Z/X/C/V</b> habilidades · <b>Esc</b> pausar</p><p>Encoste em um humano para invadir. Dentro, infecte as células rosas e mate os glóbulos brancos, ou acerte o ritmo no minigame. Corpos e infectados espalham a peste.</p><div class="leg"><span>🧑‍🌾 Camponês/Criança: fáceis</span><span>⚔️ Soldados: lutam entre si</span><span>🛡️ Cavaleiro: forte, te caça</span><span>🧑‍⚕️ Médico: te caça e drena vida</span><span>⛪ Monge: enterra cadáveres</span><span>👑 Nobre: foge de você</span><span>💰 Mercador: DNA extra</span><span>✝ Flagelante: busca cadáveres</span></div><p><b>Cepas:</b> Bubônica (bubões explosivos), Pneumônica (tosse e aura), Septicêmica (rápida e letal).</p><button onclick="showTitle()">← Voltar</button></div>`}
function pauseGame(){if(mode=='pause'){resume();return}if(!['map','body','mini'].includes(mode))return;pm=mode;mode='pause';ov.className='';ov.style.display='flex';ov.innerHTML=`<div class="box"><h1>Pausa</h1><button onclick="resume()">▶ Continuar</button><button class="ghost" onclick="start()">↻ Reiniciar partida</button><button class="ghost" onclick="askQuit()">🚪 Sair para o menu</button></div>`}
function resume(){mode=pm;ov.style.display='none'}
function askQuit(){if(mode=='title')return;if(mode=='over'){showTitle();return}if(mode!='pause'){pm=mode=='evo'?'map':mode;mode='pause'}ov.className='';ov.style.display='flex';ov.innerHTML=`<div class="box"><h1>Sair do jogo?</h1><p>Seu progresso nesta partida será perdido.</p><button onclick="showTitle()">Sim, sair</button><button class="ghost" onclick="resume()">Não, continuar</button></div>`}
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;touchControls.classList.toggle('active',['map','body','mini'].includes(mode));
 if(mode=='title'||!S)drawTitle(dt);else{
  if(mode=='map')updMap(dt);else if(mode=='body')updBody(dt);else if(mode=='mini')M.a+=M.s*dt;
  const dm=mode=='pause'?pm:mode;
  if(dm=='body')drawBody();else if(dm=='mini')drawMini();else drawMap();
  hud()}
 requestAnimationFrame(loop)}
showTitle();
requestAnimationFrame(loop);
