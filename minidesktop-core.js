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
bar.innerHTML="MiniDesktop FIXED";
const close=document.createElement("button");
close.textContent="X";
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

// ---- Drag Desktop (SAFE) ----
let dragging=false,ox=0,oy=0;
bar.addEventListener("mousedown",e=>{
dragging=true;
ox=e.clientX-desk.offsetLeft;
oy=e.clientY-desk.offsetTop;
});
document.addEventListener("mouseup",()=>dragging=false);
document.addEventListener("mousemove",e=>{
if(dragging){
desk.style.left=e.clientX-ox+"px";
desk.style.top=e.clientY-oy+"px";
}
});

// ---- Window System ----
function front(w){z++;w.style.zIndex=z;}

function open(title){
const w=document.createElement("div");
w.style.cssText="position:absolute;top:40px;left:40px;width:260px;height:200px;background:#fff;border:2px solid #555;display:flex;flex-direction:column;resize:both;overflow:hidden;";
front(w);

const t=document.createElement("div");
t.style.cssText="background:#444;color:#fff;padding:3px;cursor:move;display:flex;justify-content:space-between;";
t.innerHTML=title;

const cbtn=document.createElement("button");
cbtn.textContent="X";
cbtn.onclick=()=>w.remove();
t.appendChild(cbtn);
w.appendChild(t);

const content=document.createElement("div");
content.style.cssText="flex:1;overflow:auto;font-size:12px;padding:4px;";
w.appendChild(content);

// drag window (SAFE)
let wd=false,dx=0,dy=0;
t.addEventListener("mousedown",e=>{
wd=true;
dx=e.clientX-w.offsetLeft;
dy=e.clientY-w.offsetTop;
front(w);
});
document.addEventListener("mouseup",()=>wd=false);
document.addEventListener("mousemove",e=>{
if(wd){
w.style.left=e.clientX-dx+"px";
w.style.top=e.clientY-dy+"px";
}
});

w.onclick=()=>front(w);

// taskbar
const ti=document.createElement("button");
ti.textContent=title;
ti.onclick=()=>front(w);
task.appendChild(ti);

desk.appendChild(w);
return content;
}

// ---- Apps ----
const apps=[
["NumCrunch","🧮"],
["QuickPad","📒"],
["TimeKeeper","⏱️"],
["Snake","🐍"],
["PixelBrush","🎨"],
["WorldPlay","🌍"],
["Sandbox","🧪"],
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
const c=open("Calc");
const input=document.createElement("input");
input.style.width="90%";
const btn=document.createElement("button");
btn.textContent="=";
btn.onclick=()=>{
try{input.value=Function("return "+input.value)();}
catch(e){alert("error");}
};
c.appendChild(input);
c.appendChild(btn);
}

// ---- Notes ----
if(a[0]==="QuickPad"){
const c=open("Notes");
const ta=document.createElement("textarea");
ta.style.width="100%";
ta.style.height="100%";
c.appendChild(ta);
}

// ---- Clock ----
if(a[0]==="TimeKeeper"){
const c=open("Clock");
const d=document.createElement("div");
c.appendChild(d);
setInterval(()=>{d.textContent=new Date().toLocaleTimeString();},1000);
}

// ---- Snake ----
if(a[0]==="Snake"){
const c=open("Snake");
const canvas=document.createElement("canvas");
canvas.width=200; canvas.height=150;
c.appendChild(canvas);
const ctx=canvas.getContext("2d");

let x=100,y=75,dx=10,dy=0;

window.addEventListener("keydown",e=>{
if(e.key==="ArrowUp"){dx=0;dy=-10;}
if(e.key==="ArrowDown"){dx=0;dy=10;}
if(e.key==="ArrowLeft"){dx=-10;dy=0;}
if(e.key==="ArrowRight"){dx=10;dy=0;}
});

setInterval(()=>{
x+=dx;y+=dy;
ctx.fillStyle="black";ctx.fillRect(0,0,200,150);
ctx.fillStyle="lime";ctx.fillRect(x,y,10,10);
},100);
}

// ---- Paint ----
if(a[0]==="PixelBrush"){
const c=open("Paint");
const canvas=document.createElement("canvas");
canvas.width=200; canvas.height=150;
canvas.style.background="#fff";
c.appendChild(canvas);
const ctx=canvas.getContext("2d");

let draw=false;
canvas.onmousedown=e=>{draw=true;ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY);}
canvas.onmouseup=()=>draw=false;
canvas.onmousemove=e=>{if(draw){ctx.lineTo(e.offsetX,e.offsetY);ctx.stroke();}};
}

// ---- Sandbox ----
if(a[0]==="Sandbox"){
const c=open("Sandbox");
const canvas=document.createElement("canvas");
canvas.width=220; canvas.height=150;
c.appendChild(canvas);
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

// ---- WorldPlay ----
if(a[0]==="WorldPlay"){
const c=open("WorldPlay");
const canvas=document.createElement("canvas");
canvas.width=260; canvas.height=180;
c.appendChild(canvas);
const ctx=canvas.getContext("2d");

let objs=[];
canvas.onclick=()=>objs.push({x:100,y:20,vx:Math.random()*4-2,vy:0});

function loop(){
ctx.fillStyle="#88ccee";ctx.fillRect(0,0,260,180);
objs.forEach(o=>{
o.vy+=0.4;
o.x+=o.vx;o.y+=o.vy;
if(o.y>170){o.y=170;o.vy*=-0.6;}
ctx.fillStyle="red";
ctx.beginPath();ctx.arc(o.x,o.y,8,0,6.28);ctx.fill();
});
requestAnimationFrame(loop);
}
loop();
}

// ---- YouTube ----
if(a[0]==="YouTube"){
const c=open("YouTube");

const input=document.createElement("input");
input.placeholder="URL or ID";
input.style.width="90%";

const btn=document.createElement("button");
btn.textContent="Load";

const player=document.createElement("div");

btn.onclick=()=>{
let val=input.value.trim();
let id=val;

const m=val.match(/(?:v=|\\/|shorts\\/)([\\w-]{11})/);
if(m) id=m[1];

if(!id || id.length!==11){
alert("invalid");
return;
}

player.innerHTML=`<iframe width="220" height="130" src="https://www.youtube.com/embed/${id}?autoplay=1"></iframe>`;
};

c.appendChild(input);
c.appendChild(btn);
c.appendChild(player);
}

};
});

})();
