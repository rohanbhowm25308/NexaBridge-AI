(()=>{
'use strict';
const canvas=document.getElementById('circuitCanvas');if(!canvas)return;
const ctx=canvas.getContext('2d');if(!ctx)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let w=0,h=0,dpr=1,paths=[],raf=0;
const rand=(a,b)=>a+Math.random()*(b-a);
function build(){
 dpr=Math.min(window.devicePixelRatio||1,2);w=window.innerWidth;h=window.innerHeight;
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 const gap=w<650?65:86;
 paths=[];
 const cols=Math.ceil(w/gap),rows=Math.ceil(h/gap);
 for(let i=0;i<Math.min(90,Math.ceil(w*h/16500));i++){
   let x=Math.floor(rand(0,cols+1))*gap,y=Math.floor(rand(0,rows+1))*gap;
   let pts=[[x,y]];const steps=Math.floor(rand(2,7));let direction=Math.random()<.5?1:-1;
   for(let j=0;j<steps;j++){
     if(j%2===0)x+=direction*gap*rand(.6,1.8);
     else y+=(Math.random()<.5?-1:1)*gap*rand(.5,1.4);
     x=Math.max(-20,Math.min(w+20,x));y=Math.max(-20,Math.min(h+20,y));pts.push([x,y]);
   }
   let len=0;const segments=[];
   for(let j=1;j<pts.length;j++){const a=pts[j-1],b=pts[j],l=Math.hypot(b[0]-a[0],b[1]-a[1]);segments.push({a,b,l});len+=l;}
   paths.push({pts,segments,len,speed:rand(30,110),offset:rand(0,Math.max(len,1)),opacity:rand(.13,.38),width:Math.random()<.15?1.6:1});

 }
}
function trace(p){ctx.beginPath();p.pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=`rgba(40,157,220,${p.opacity})`;ctx.lineWidth=p.width;ctx.stroke();}
// Trace a moving *line segment* along each path; never draw circles or nodes.
function drawMovingLine(p, start, distance){
 let travelled=0;
 ctx.beginPath();
 let started=false;
 for(const seg of p.segments){
  if(seg.l<0.001)continue;
  const from=Math.max(start,travelled),to=Math.min(start+distance,travelled+seg.l);
  if(to>from){
   const t0=(from-travelled)/seg.l,t1=(to-travelled)/seg.l;
   const x0=seg.a[0]+(seg.b[0]-seg.a[0])*t0,y0=seg.a[1]+(seg.b[1]-seg.a[1])*t0;
   const x1=seg.a[0]+(seg.b[0]-seg.a[0])*t1,y1=seg.a[1]+(seg.b[1]-seg.a[1])*t1;
   if(!started){ctx.moveTo(x0,y0);started=true;}else ctx.lineTo(x0,y0);
   ctx.lineTo(x1,y1);
  }
  travelled+=seg.l;
 }
 if(started){ctx.strokeStyle='rgba(75,214,255,.88)';ctx.lineWidth=2;ctx.lineCap='butt';ctx.lineJoin='miter';ctx.stroke();}
}
function render(t){
 ctx.clearRect(0,0,w,h);
 const gap=43;ctx.strokeStyle='rgba(35,112,169,.055)';ctx.lineWidth=.65;
 ctx.beginPath();for(let x=0;x<w;x+=gap){ctx.moveTo(x,0);ctx.lineTo(x,h)}for(let y=0;y<h;y+=gap){ctx.moveTo(0,y);ctx.lineTo(w,y)}ctx.stroke();
 const sec=t/1000;
 for(const p of paths){
  trace(p);
  if(reduce.matches||p.len<1)continue;
  const lineLength=Math.min(95,Math.max(32,p.len*.23));
  const pos=(p.offset+sec*p.speed)%(p.len+lineLength)-lineLength;
  drawMovingLine(p,Math.max(0,pos),Math.min(lineLength, p.len-pos));
 }
 if(!reduce.matches)raf=requestAnimationFrame(render);
}
function restart(){cancelAnimationFrame(raf);build();raf=requestAnimationFrame(render)}
let resizeId=0;window.addEventListener('resize',()=>{clearTimeout(resizeId);resizeId=setTimeout(restart,150)});
reduce.addEventListener?.('change',restart);restart();
})();