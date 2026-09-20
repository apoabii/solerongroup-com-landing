(function(G){
const C={bg:'#151715',ink:'#f1eee7',muted:'#a9ad9f',gold:'#d0ad70',green:'#9eafa0',red:'#be8e7b',rule:'#343a33',soft:'#20261f'};
function scene(kind,phase=2,variant='normal'){
 const a=[];const R=(x,y,w,h,c,r=0)=>a.push({k:'rect',x,y,w,h,c,r});const L=(x,y,x2,y2,c=C.rule,w=1,dash='')=>a.push({k:'line',x,y,x2,y2,c,w,dash});const T=(t,x,y,size=18,c=C.ink,weight=400)=>a.push({k:'text',t,x,y,size,c,weight});const P=(pts,c=C.gold,w=3)=>a.push({k:'poly',pts,c,w});const O=(x,y,r,c)=>a.push({k:'circle',x,y,r,c});
 R(0,0,1000,460,C.bg,24);
 const grid=()=>{for(let y=110;y<380;y+=60)L(55,y,945,y);};
 if(kind==='book'){
  T('BUYERS',55,46,16,C.green,600);T('SELLERS',390,46,16,C.red,600);T('WHAT THE BOT ASSESSES',680,46,15,C.gold,600);
  T('Relative size of pending orders',55,77,16,C.muted);L(642,30,642,417,C.rule);
  const bids=[.46,.58,.37,.71,.57,.83,.66],asks=[.38,.52,.68,.31,.51,.43,.28];
  for(let i=0;i<7;i++){let y=103+i*38;const w=bids[i]*244;R(299-w,y,w,23,C.green,3);if(i!==3)R(334,y,asks[i]*244,23,C.red,3);T(String(i+1).padStart(2,'0'),307,y+18,12,C.muted);}
  const wall=phase===1?228:phase===2?31:75;R(334,217,wall,23,phase===1?C.gold:C.red,3);
  if(phase===1){L(563,228,610,228,C.gold,2);T('?',588,210,26,C.gold,600);}
  const titles=['Order balance','Sudden order cluster','Passive execution'];
  T('0'+(phase+1),680,114,35,C.gold);T(titles[phase],680,162,26,C.ink,600);
  const copy=[['The concentration and','rate of change on each side','are assessed together.'],['A large cluster of orders','appears. The system assesses','the consistency of behaviour.'],['If suspicious liquidity','is detected, the documented','response is passive execution.']][phase];copy.forEach((x,i)=>T(x,680,209+i*28,19,C.muted));
  T('ORDER DEPTH',55,405,13,C.muted,600);T('Illustrative sizes; not actual orders or prices.',55,434,14,C.muted);
  T('Aim',680,334,14,C.gold,600);T('Adjusting execution in response',680,366,19);T('to potentially misleading liquidity',680,394,18);
 }
 if(kind==='strategy'){
  const trend=variant==='trend',fail=variant==='adverse';grid();
  T(trend?'TREND / MOMENTUM':'MEAN REVERSION',55,45,15,C.gold,600);T(trend?'MRCryptoAI 5-2-0':'Mr-Crypto-AI',55,80,25,C.ink,600);
  const ys=trend?[325,316,330,291,303,278,287,247,256,222,235,196,213,181,164,184,151,142]:fail?[230,211,243,237,251,278,312,328,348,337,365,378,352,375,389,365,384,394]:[230,211,243,237,251,278,312,328,307,288,304,268,247,256,232,214,237,226];
  const pts=ys.map((v,i)=>[60+i*48,v]);
  if(!trend){L(55,232,910,232,C.muted,1,'5 6');T('Reference zone',748,182,16,C.muted);}
  const count=phase===0?7:phase===1?12:18;
  for(let i=0;i<count;i++){let y=ys[i],prev=ys[Math.max(0,i-1)],x=60+i*48;L(x,Math.min(y,prev)-9,x,Math.max(y,prev)+10,y<prev?C.green:C.red,1.5);R(x-7,Math.min(y,prev),14,Math.max(4,Math.abs(y-prev)),y<prev?C.green:C.red,2);}
  if(phase>0){O(396,ys[7],8,C.gold);L(396,ys[7]+12,396,403,C.gold,1);T(trend?'Directional persistence is assessed':'Deviation from reference is assessed',55,434,18,C.gold);}
  if(phase===2){O(876,ys[17],7,C.gold);T(fail?'Reversion may not occur':trend?'Continuation is not guaranteed':'Aim: assess a return towards reference',490,434,16,C.muted);}
  T('Illustrative price',772,47,14,C.muted);T('Time',895,400,13,C.muted);
 }
 if(kind==='risk'){
  T('ILLUSTRATIVE LONG POSITION IN PROFIT',55,45,15,C.gold,600);T('Moving the stop towards breakeven',55,82,26,C.ink,600);grid();
  const pts=[[65,303],[125,303],[180,282],[235,291],[295,250],[350,260],[410,211],[470,226],[530,177],[590,188],[650,149],[710,165],[770,151],[840,175]];
  const stop=phase===0?357:phase===1?326:303;
  R(55,303,835,Math.max(0,stop-303),'#30231f',0);L(55,303,895,303,C.muted,1,'4 6');T('Entry',905,288,16,C.muted);
  L(55,stop,895,stop,C.red,2,'8 5');T('Stop',905,stop+24,16,C.red);
  if(phase===2){L(55,357,895,357,C.rule,1,'4 6');T('Initial stop level',715,380,14,C.muted);}const n=phase===0?4:phase===1?9:14;P(pts.slice(0,n));O(...pts[n-1],7,C.gold);
  const labs=['Position opened','Price moves favourably','Stop approaches the entry level'];T('0'+(phase+1)+'  '+labs[phase],55,432,20,C.gold);
  T('Illustrative price / not an actual trade',661,432,14,C.muted);
 }
 return a;
}
function esc(t){return String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')}
function svg(kind,phase=2,variant='normal',compact=false){let list=scene(kind,phase,variant);if(compact){list=list.filter(o=>{if(o.k==='rect'&&o.x===0)return false;if(kind==='book')return o.x<640 && (o.k!=='text'||o.y===46);return o.k!=='text'||['Reference zone','Entry','Stop'].includes(o.t);}).map(o=>{let q={...o},scale=kind==='book'?.83:.54;if(q.x!==undefined)q.x*=scale;if(q.x2!==undefined)q.x2*=scale;if(q.w!==undefined&&q.k==='rect')q.w*=scale;if(q.pts)q.pts=q.pts.map(([x,y])=>[x*scale,y]);if(q.k==='text'){q.size=18;if(q.t==='Reference zone')q.x=350;if(q.t==='Entry'||q.t==='Stop')q.x=490;}return q;});list.unshift({k:'rect',x:0,y:0,w:560,h:410,c:C.bg,r:24});}return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${compact?560:1000} ${compact?410:460}" role="img" aria-label="${kind==='book'?'Order-book assessment':kind==='risk'?'Adjusting the stop level':'Schematic strategy explanation'}"><g font-family="Mona, Mona Sans, Arial, sans-serif">`+list.map(o=>o.k==='rect'?`<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.r}" fill="${o.c}"/>`:o.k==='line'?`<line x1="${o.x}" y1="${o.y}" x2="${o.x2}" y2="${o.y2}" stroke="${o.c}" stroke-width="${o.w}" stroke-dasharray="${o.dash}"/>`:o.k==='text'?`<text x="${o.x}" y="${o.y}" font-size="${o.size}" fill="${o.c}" font-weight="${o.weight}">${esc(o.t)}</text>`:o.k==='circle'?`<circle cx="${o.x}" cy="${o.y}" r="${o.r}" fill="${o.c}"/>`:`<polyline points="${o.pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${o.c}" stroke-width="${o.w}" stroke-linejoin="round"/>`).join('')+'</g></svg>';}
const meta={book:{title:'The bot also reads the orders behind the price',source:'Technical Deck, pp. 3–5 and 7',note:'Order sizes are illustrative. An order disappearing is not, by itself, evidence of manipulation.'},strategy:{title:'Different strategy approaches in the same market',source:'Institutional Performance Report, p. 1',note:'Price paths illustrate strategy categories, not actual entry or exit points or performance data.'},risk:{title:'Decisions continue after a trade is opened',source:'Technical Deck, pp. 7 and 9',note:'A breakeven stop does not guarantee zero loss. Fees, slippage and execution affect the outcome.'}};
G.SoleronScenes={scene,svg,meta};
})(typeof window==='undefined'?globalThis:window);
