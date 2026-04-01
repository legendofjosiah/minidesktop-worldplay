(function(){
if(document.getElementById("miniDesktopContainer")) return;

let z=100;

// ---- Desktop ----
const desk=document.createElement("div");
desk.id="miniDesktopContainer";
desk.style.cssText=`
position:fixed; bottom:20px; right:20px;
width:450px; height:340px;
background:linear-gradient(145deg,#6fa8dc,#3d85c6);
border:3px solid #222; border-radius:10px;
display:flex; flex-direction:column;
font-family:sans-serif; z-index:999999;
`;

const bar=document.createElement("div");
bar.style.cssText="background:#222;color:#fff;padding:5px;cursor:move;display:flex;justify-content:space-between;";
bar.innerHTML="MiniDesktop X MAX";
const close=document.createElement("button");
close.innerText="X";
close.onclick=()=>desk.remove();
bar.appendChild(close);
desk.appendChild(bar);

const area=document.createElement("div");
area.style.cssText="flex:1;display:flex;flex-wrap:wrap;padding:10px;gap:10px;";
desk.appendChild(area);

const task=document.createElement("div");
task.style.cssText="height:30px;background:#111;color:#fff;display:flex;gap:5px;align-items:center;padding:0 5px;overflow-x:auto;";
desk.appendChild(task);

document.body.appendChild(desk);

// ---- Drag Desktop ----
let d=false,ox,oy;
bar.onmousedown=e=>{d=true;ox=e.clientX-desk.offsetLeft;oy=e.clientY-desk.offsetTop;}
document.addEventListener("mouseup",()=>d=false);
document.addEventListener("mousemove",e=>{if(d){desk.style.left=e.clientX-ox+"px";desk.style.top=e.clientY-oy+"px";}});

function front(w){z++;w.style.zIndex=z;}

// ---- Window ----
function open(title,html){
const w=document.createElement("div");
w.style.cssText="position:absolute;top:40px;left:40px;width:270px;height:210px;background:#fff;border:2px solid #555;display:flex;flex-direction:column;resize:both;overflow:hidden;";
front(w);

const t=document.createElement("div");
t.style.cssText="background:#444;color:#fff;padding:3px;cursor:move;display:flex;justify-content:space-between;";
t.innerHTML=title;

const cbtn=document.createElement("button");
cbtn.innerText="X";
cbtn.onclick=()=>w.remove();
t.appendChild(cbtn);
w.appendChild(t);

const c=document.createElement("div");
c.style.cssText="flex:1;overflow:auto;font-size:12px;";
c.innerHTML=html;
w.appendChild(c);

// drag window
let wd=false,dx,dy;
t.onmousedown=e=>{wd=true;dx=e.clientX-w.offsetLeft;dy=e.clientY-w.offsetTop;front(w);}
document.addEventListener("mouseup",()=>wd=false);
document.addEventListener("mousemove",e=>{if(wd){w.style.left=e.clientX-dx+"px";w.style.top=e.clientY-dy+"px";}});
w.onclick=()=>front(w);

// taskbar
const ti=document.createElement("button");
ti.innerText=title;
ti.onclick=()=>front(w);
task.appendChild(ti);

desk.appendChild(w);
return w;
}

// ---- Apps ----
const apps=[
["NumCrunch","🧮"],
["QuickPad","📒"],
["TimeKeeper","⏱️"],
["Snake","🐍"],
["PixelBrush","🎨"],
["BumperBlast","🎱"],
["WorldPlay","🌍"],
["Sandbox","🧪"],
["MiniTetris","⬛"],
["YouTube","▶️"]
];

apps.forEach(a=>{
const ic=document.createElement("div");
ic.style.cssText="width:60px;height:60px;text-align:center;color:white;cursor:pointer;";
ic.innerHTML=`<div style="font-size:24px;">${a[1]}</div>${a[0]}`;
area.appendChild(ic);

ic.ondblclick=()=>{

// ---- Calculator ----
if(a[0]==="NumCrunch"){
open("Calc",`
<input id=cI style="width:90%">
<button onclick="try{cI.value=Function('return '+cI.value)()}catch(e){alert('error')}">=</button>
`);
}

// ---- Notes ----
if(a[0]==="QuickPad"){
open("QuickPad",'<textarea style="width:100%;height:100%;"></textarea>');
}

// ---- Clock ----
if(a[0]==="TimeKeeper"){
const w=open("Clock",'<div id=clock></div>');
setInterval(()=>{w.querySelector("#clock").innerText=new Date().toLocaleTimeString();},1000);
}

// ---- Snake ----
if(a[0]==="Snake"){
const w=open("Snake","<canvas width=200 height=150></canvas>");
const ctx=w.querySelector("canvas").getContext("2d");
let x=100,y=75,dx=10,dy=0;

document.onkeydown=e=>{
if(e.key==="ArrowUp"){dx=0;dy=-10;}
if(e.key==="ArrowDown"){dx=0;dy=10;}
if(e.key==="ArrowLeft"){dx=-10;dy=0;}
if(e.key==="ArrowRight"){dx=10;dy=0;}
};

setInterval(()=>{
x+=dx;y+=dy;
ctx.fillStyle="black";ctx.fillRect(0,0,200,150);
ctx.fillStyle="lime";ctx.fillRect(x,y,10,10);
},100);
}

// ---- Paint ----
if(a[0]==="PixelBrush"){
const w=open("Paint","<canvas width=200 height=150 style='background:#fff'></canvas>");
const c=w.querySelector("canvas");
const ctx=c.getContext("2d");
let draw=false;
c.onmousedown=e=>{draw=true;ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY);}
c.onmouseup=()=>draw=false;
c.onmousemove=e=>{if(draw){ctx.lineTo(e.offsetX,e.offsetY);ctx.stroke();}};
}

// ---- Pinball ----
if(a[0]==="BumperBlast"){
const w=open("Pinball","<canvas width=200 height=150></canvas>");
const c=w.querySelector("canvas");
const ctx=c.getContext("2d");
let ball={x:100,y:75,dx:3,dy:3};

setInterval(()=>{
ctx.fillStyle="#222";ctx.fillRect(0,0,200,150);
ctx.fillStyle="yellow";
ctx.beginPath();ctx.arc(ball.x,ball.y,6,0,6.28);ctx.fill();
ball.x+=ball.dx;ball.y+=ball.dy;
if(ball.x<0||ball.x>200) ball.dx*=-1;
if(ball.y<0||ball.y>150) ball.dy*=-1;
},20);
}

// ---- WORLDPLAY (ADVANCED SANDBOX) ----
if(a[0]==="WorldPlay"){
const w=open("WorldPlay","<canvas width=260 height=180></canvas>");
const canvas=w.querySelector("canvas");
const ctx=canvas.getContext("2d");

let objs=[];
let grab=null;

canvas.onclick=()=>objs.push({x:100,y:20,vx:Math.random()*4-2,vy:0});

canvas.onmousedown=e=>{
const r=canvas.getBoundingClientRect();
const mx=e.clientX-r.left,my=e.clientY-r.top;
objs.forEach(o=>{
if(Math.hypot(o.x-mx,o.y-my)<10) grab=o;
});
};
canvas.onmouseup=()=>grab=null;
canvas.onmousemove=e=>{
if(grab){
const r=canvas.getBoundingClientRect();
grab.x=e.clientX-r.left;
grab.y=e.clientY-r.top;
grab.vx=0;grab.vy=0;
}
};

function loop(){
ctx.fillStyle="#88ccee";ctx.fillRect(0,0,260,180);
objs.forEach(o=>{
if(grab!==o){
o.vy+=0.4;
o.x+=o.vx;o.y+=o.vy;
if(o.y>170){o.y=170;o.vy*=-0.6;}
}
ctx.fillStyle="red";
ctx.beginPath();ctx.arc(o.x,o.y,8,0,6.28);ctx.fill();
});
requestAnimationFrame(loop);
}
loop();
}

// ---- EXTRA SANDBOX ----
if(a[0]==="Sandbox"){
const w=open("Sandbox","<canvas width=220 height=150></canvas>");
const canvas=w.querySelector("canvas");
const ctx=canvas.getContext("2d");

let o={x:100,y:50,vx:0,vy:0},grab=false;

canvas.onmousedown=()=>grab=true;
canvas.onmouseup=()=>grab=false;
canvas.onmousemove=e=>{
if(grab){
const r=canvas.getBoundingClientRect();
o.x=e.clientX-r.left;
o.y=e.clientY-r.top;
o.vx=0;o.vy=0;
}
};

function loop(){
ctx.fillStyle="black";ctx.fillRect(0,0,220,150);
if(!grab){
o.vy+=0.3;
o.x+=o.vx;o.y+=o.vy;
if(o.y>140){o.y=140;o.vy*=-0.6;}
}
ctx.fillStyle="orange";
ctx.beginPath();ctx.arc(o.x,o.y,8,0,6.28);ctx.fill();
requestAnimationFrame(loop);
}
loop();
}

// ---- TETRIS ----
if(a[0]==="MiniTetris"){
const w=open("Tetris","<canvas width=120 height=180></canvas>");
const ctx=w.querySelector("canvas").getContext("2d");
let y=0;
setInterval(()=>{
ctx.fillStyle="black";ctx.fillRect(0,0,120,180);
ctx.fillStyle="cyan";ctx.fillRect(50,y,20,20);
y+=5;if(y>180)y=0;
},100);
}

// ---- YOUTUBE ----
if(a[0]==="YouTube"){
const w=open("YouTube",`
<input id=url placeholder="URL" style="width:90%">
<input id=id placeholder="Video ID" style="width:90%">
<button id=go>Load</button>
<div id=p></div>
`);
const load=()=>{
let id=w.querySelector("#id").value;
const url=w.querySelector("#url").value;
if(!id&&url){
const m=url.match(/(?:v=|\\/|shorts\\/)([\\w-]{11})/);
if(m) id=m[1];
}
if(!id) return alert("invalid");
w.querySelector("#p").innerHTML=
\`<iframe width=220 height=130 src="https://www.youtube.com/embed/\${id}?autoplay=1"></iframe>\`;
};
w.querySelector("#go").onclick=load;
}

};
});

})();
