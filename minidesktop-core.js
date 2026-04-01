(function(){
if(document.getElementById("miniDesktopContainer")) return;

// ---- Mini Desktop Container ----
const miniDesktopContainer=document.createElement("div");
miniDesktopContainer.id="miniDesktopContainer";
miniDesktopContainer.style.cssText=`
position:fixed; bottom:20px; right:20px;
width:400px; height:300px;
background:linear-gradient(145deg,#6fa8dc,#3d85c6);
border:3px solid #222; border-radius:10px;
z-index:999999; box-shadow:5px 5px 20px rgba(0,0,0,0.6);
display:flex; flex-direction:column; font-family:sans-serif;
user-select:none;
`;

// ---- Title Bar ----
const titleBar=document.createElement("div");
titleBar.style.cssText=`
background:#222; color:white; padding:5px; cursor:move;
display:flex; justify-content:space-between; align-items:center;
border-top-left-radius:8px; border-top-right-radius:8px;
`;
titleBar.innerHTML=`<span>MiniDesktop</span>`;
const closeBtn=document.createElement("button");
closeBtn.innerText="X";
closeBtn.style.cssText="background:red;color:white;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;";
closeBtn.onclick=()=>miniDesktopContainer.remove();
titleBar.appendChild(closeBtn);
miniDesktopContainer.appendChild(titleBar);

// ---- Workspace Area ----
const workspaceArea=document.createElement("div");
workspaceArea.style.cssText=`
flex:1; display:flex; flex-wrap:wrap; padding:10px; gap:10px;
background:linear-gradient(to bottom,#6fa8dc,#3d85c6);
position:relative; overflow:hidden;
`;
miniDesktopContainer.appendChild(workspaceArea);

// ---- Taskbar ----
const desktopTaskbar=document.createElement("div");
desktopTaskbar.style.cssText=`
height:30px; background:#111; color:white; display:flex; align-items:center; padding:0 5px;
border-bottom-left-radius:8px; border-bottom-right-radius:8px;
`;
desktopTaskbar.innerHTML="<span style='font-size:12px;'>Start</span>";

// ---- Spin Button ----
const spinBtn=document.createElement("button");
spinBtn.innerText="Spin";
spinBtn.style.cssText="margin-left:5px;padding:2px 5px;";
spinBtn.onclick=()=>{workspaceArea.childNodes.forEach(icon=>{icon.animate([{transform:"rotate(0deg)"},{transform:"rotate(360deg)"}],{duration:500})});};
desktopTaskbar.appendChild(spinBtn);

// ---- Add TextBox for dynamic icons ----
const addTextBox=document.createElement("input");
addTextBox.type="text";
addTextBox.placeholder="Add icon text";
addTextBox.style.cssText="margin-left:5px;";
desktopTaskbar.appendChild(addTextBox);

addTextBox.addEventListener("keydown",e=>{
if(e.key==="Enter"&&addTextBox.value.trim()){
const textIcon=document.createElement("div");
textIcon.style.cssText="width:60px;height:60px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;color:white;text-shadow:1px 1px 2px #000;font-size:12px;";
textIcon.innerHTML=`<div style="font-size:24px;">📝</div>${addTextBox.value}`;
workspaceArea.appendChild(textIcon);
addTextBox.value="";
}
});

miniDesktopContainer.appendChild(desktopTaskbar);
document.body.appendChild(miniDesktopContainer);

// ---- Drag Desktop ----
let dragging=false, offsetX=0, offsetY=0;
titleBar.onmousedown=e=>{dragging=true; offsetX=e.clientX-miniDesktopContainer.offsetLeft; offsetY=e.clientY-miniDesktopContainer.offsetTop;};
document.onmouseup=()=>dragging=false;
document.onmousemove=e=>{if(dragging){miniDesktopContainer.style.left=(e.clientX-offsetX)+"px"; miniDesktopContainer.style.top=(e.clientY-offsetY)+"px";}}

// ---- Apps ----
const desktopApps=[
{name:"NumCrunch",emoji:"🧮"},
{name:"QuickPad",emoji:"📒"},
{name:"TimeKeeper",emoji:"⏱️"},
{name:"SlitherDash",emoji:"🐍"},
{name:"PixelBrush",emoji:"🎨"},
{name:"BumperBlast",emoji:"🎱"},
{name:"WorldPlay",emoji:"🌍"},
{name:"MiniMusic",emoji:"🎵"},
{name:"MiniTetris",emoji:"⬛"},
{name:"YouTube",emoji:"▶️"}
];

function openAppWindow(title,contentHTML){
const win=document.createElement("div");
win.style.cssText=`
position:absolute; top:50px; left:50px; width:250px; height:180px;
background:#fff; border:2px solid #555; border-radius:6px;
display:flex; flex-direction:column; box-shadow:3px 3px 15px rgba(0,0,0,0.5);
z-index:10; user-select:none;
`;
const winTitle=document.createElement("div");
winTitle.style.cssText="background:#444; color:white; padding:3px; cursor:move; display:flex; justify-content:space-between; align-items:center;";
winTitle.innerHTML=`<span>${title}</span>`;
const winClose=document.createElement("button");
winClose.innerText="X";
winClose.style.cssText="background:red;color:white;border:none;padding:1px 4px;border-radius:3px;cursor:pointer;";
winClose.onclick=()=>win.remove();
winTitle.appendChild(winClose);
win.appendChild(winTitle);

const content=document.createElement("div");
content.style.cssText="flex:1;padding:3px;overflow:auto;font-size:12px;";
content.innerHTML=contentHTML;
win.appendChild(content);

// Drag window
let winDrag=false,dx=0,dy=0;
winTitle.onmousedown=e=>{winDrag=true; dx=e.clientX-win.offsetLeft; dy=e.clientY-win.offsetTop;}
document.onmouseup=()=>winDrag=false;
document.onmousemove=e=>{if(winDrag){win.style.left=(e.clientX-dx)+"px"; win.style.top=(e.clientY-dy)+"px";}}

miniDesktopContainer.appendChild(win);
return win;
}

// ---- Add App Icons ----
desktopApps.forEach(app=>{
const icon=document.createElement("div");
icon.style.cssText="width:60px;height:60px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;color:white;text-shadow:1px 1px 2px #000;font-size:12px;";
icon.innerHTML=`<div style="font-size:24px;">${app.emoji}</div>${app.name}`;
workspaceArea.appendChild(icon);

icon.onclick=()=>{
if(app.name==="NumCrunch"){openAppWindow("NumCrunch",`<input type="text" id="calcInput" style="width:90%;margin-bottom:2px;"><button style="font-size:12px;" onclick="document.getElementById('calcInput').value=eval(document.getElementById('calcInput').value)">Calc</button>`);}
if(app.name==="QuickPad"){openAppWindow("QuickPad",'<textarea style="width:100%;height:100%;font-size:12px;"></textarea>');}
if(app.name==="TimeKeeper"){const win=openAppWindow("TimeKeeper",'<div id="clockDisplay" style="font-size:14px;"></div>'); setInterval(()=>{win.querySelector("#clockDisplay").innerText=new Date().toLocaleTimeString();},1000);}
if(app.name==="SlitherDash"){const win=openAppWindow("SlitherDash",'<canvas id="slitherDashCanvas" width="200" height="150" style="background:#000;"></canvas>'); const canvas=win.querySelector("#slitherDashCanvas"); const ctx=canvas.getContext("2d"); let snake=[{x:10,y:10}],dx=10,dy=0,food={x:100,y:50},gameOver=false; function draw(){ctx.fillStyle="#000";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#0f0";snake.forEach(s=>ctx.fillRect(s.x,s.y,10,10));ctx.fillStyle="#f00";ctx.fillRect(food.x,food.y,10,10);} function move(){if(gameOver)return; const head={x:snake[0].x+dx,y:snake[0].y+dy}; if(head.x<0||head.x>=canvas.width||head.y<0||head.y>=canvas.height||snake.some(s=>s.x===head.x&&s.y===head.y)){gameOver=true;return;} snake.unshift(head); if(head.x===food.x&&head.y===food.y){food={x:Math.floor(Math.random()*20)*10,y:Math.floor(Math.random()*15)*10};}else{snake.pop();}} document.addEventListener("keydown",e=>{if(e.key==="ArrowUp"&&dy===0){dx=0;dy=-10;}if(e.key==="ArrowDown"&&dy===0){dx=0;dy=10;}if(e.key==="ArrowLeft"&&dx===0){dx=-10;dy=0;}if(e.key==="ArrowRight"&&dx===0){dx=10;dy=0;}}); setInterval(()=>{move();draw();},150);}
if(app.name==="PixelBrush"){const win=openAppWindow("PixelBrush",'<canvas id="pixelBrushCanvas" width="200" height="150" style="background:#fff;border:1px solid #000;"></canvas>'); const canvas=win.querySelector("#pixelBrushCanvas"); const ctx=canvas.getContext("2d"); let drawing=false; canvas.onmousedown=e=>{drawing=true;ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY);}; canvas.onmouseup=()=>drawing=false; canvas.onmousemove=e=>{if(drawing){ctx.lineTo(e.offsetX,e.offsetY);ctx.stroke();}};}
if(app.name==="BumperBlast"){const win=openAppWindow("BumperBlast",'<canvas id="bumperBlastCanvas" width="200" height="150" style="background:#222;"></canvas>'); const canvas=win.querySelector("#bumperBlastCanvas"); const ctx=canvas.getContext("2d"); let ball={x:100,y:75,dx:2,dy:2,r:5}; function draw(){ctx.fillStyle="#222";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#ff0";ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,2*Math.PI);ctx.fill();} function move(){ball.x+=ball.dx;ball.y+=ball.dy;if(ball.x<0||ball.x>canvas.width)ball.dx*=-1;if(ball.y<0||ball.y>canvas.height)ball.dy*=-1;} setInterval(()=>{move();draw();},20);}
if(app.name==="WorldPlay"){
const win=openAppWindow("WorldPlay",`<canvas id="worldPlayCanvas" width="350" height="220" style="background:#88ccee;border:1px solid #000;"></canvas><div style="margin-top:5px;"><button id="addBall">Add Ball</button><button id="addBox">Add Box</button><button id="addNPC">Add NPC</button><button id="clearAll">Clear</button></div>`);
const canvas=win.querySelector("#worldPlayCanvas"); const ctx=canvas.getContext("2d"); const gravity=0.5; const friction=0.8; let objects=[]; let npcs=[];
class PhysObject{constructor(x,y,dx,dy,type){this.x=x;this.y=y;this.dx=dx;this.dy=dy;this.type=type;this.size=Math.random()*15+10;this.color="#"+Math.floor(Math.random()*16777215).toString(16);} update(){this.dy+=gravity;this.x+=this.dx;this.y+=this.dy;if(this.y+this.size>canvas.height){this.y=canvas.height-this.size;this.dy*=-friction;}if(this.x-this.size<0){this.x=this.size;this.dx*=-friction;}if(this.x+this.size>canvas.width){this.x=canvas.width-this.size;this.dx*=-friction;}} draw(){ctx.fillStyle=this.color;if(this.type==="ball"){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill();}else{ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);}}}
class NPC{constructor(x,y){this.x=x;this.y=y;this.width=15;this.height=30;this.color="#ffcc00";this.dx=1.5;} update(){this.x+=this.dx;if(this.x<0||this.x+this.width>canvas.width) this.dx*=-1;objects.forEach(o=>{const dx=o.x-(this.x+this.width/2);const dy=o.y-(this.y+this.height/2);const dist=Math.sqrt(dx*dx+dy*dy);if(dist<25){o.dx+=this.dx*0.1;o.dy-=1;}});} draw(){ctx.fillStyle=this.color;ctx.fillRect(this.x,this.y,this.width,this.height);}}
npcs.push(new NPC(50,canvas.height-35));
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);objects.forEach(o=>{o.update();o.draw();});npcs.forEach(n=>{n.update();n.draw();});requestAnimationFrame(animate);} animate();
win.querySelector("#addBall").onclick=()=>{objects.push(new PhysObject(Math.random()*canvas.width,20,Math.random()*4-2,0,"ball"));};
win.querySelector("#addBox").onclick=()=>{objects.push(new PhysObject(Math.random()*canvas.width,20,Math.random()*4-2,0,"box"));};
win.querySelector("#addNPC").onclick=()=>{npcs.push(new NPC(Math.random()*canvas.width,canvas.height-35));};
win.querySelector("#clearAll").onclick=()=>{objects=[];npcs=[];};
// Drag & Grab
let selected=null,ox=0,oy=0;
canvas.onmousedown=e=>{const rect=canvas.getBoundingClientRect(); const mx=e.clientX-rect.left,my=e.clientY-rect.top; selected=[...objects,...npcs].find(o=>{if(o instanceof PhysObject){if(o.type==="ball"){const dx=mx-o.x,dy=my-o.y;return dx*dx+dy*dy<=o.size*o.size;}else{return mx>=o.x-o.size/2&&mx<=o.x+o.size/2&&my>=o.y-o.size/2&&my<=o.y+o.size/2;}} else if(o instanceof NPC){return mx>=o.x&&mx<=o.x+o.width&&my>=o.y&&my<=o.y+o.height;}});if(selected){ox=mx-selected.x;oy=my-selected.y;if(selected instanceof PhysObject){selected.dx=0;selected.dy=0;}if(selected instanceof NPC){selected.dx=0;}}};
canvas.onmousemove=e=>{if(selected){const rect=canvas.getBoundingClientRect(); selected.x=e.clientX-rect.left-ox; selected.y=e.clientY-rect.top-oy;}};
canvas.onmouseup=()=>{selected=null;};
}
if(app.name==="MiniMusic"){const win=openAppWindow("MiniMusic",`<div style="display:flex; flex-direction:column; gap:5px; align-items:center;"><div><button data-note="261.6">C</button><button data-note="293.7">D</button><button data-note="329.6">E</button><button data-note="349.2">F</button><button data-note="392.0">G</button><button data-note="440.0">A</button><button data-note="493.9">B</button></div><div style="margin-top:5px;"><input type="text" id="ytURL" placeholder="YouTube URL" style="width:180px;"><button id="loadYT">Load</button></div><div id="ytPlayer" style="width:200px; height:120px; margin-top:5px;"></div></div>`); win.querySelectorAll("button[data-note]").forEach(btn=>{btn.onclick=()=>{const audioCtx=new (window.AudioContext||window.webkitAudioContext)(); const osc=audioCtx.createOscillator(); osc.type="sine"; osc.frequency.setValueAtTime(Number(btn.dataset.note),audioCtx.currentTime); osc.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime+0.5);};}); win.querySelector("#loadYT").onclick=()=>{const url=win.querySelector("#ytURL").value;if(!url)return; const match=url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/); if(!match)return alert("Invalid YouTube URL!"); const vidID=match[1]; win.querySelector("#ytPlayer").innerHTML=`<iframe width="200" height="120" src="https://www.youtube.com/embed/${vidID}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;};}
if(app.name==="MiniTetris"){const win=openAppWindow("MiniTetris",'<canvas id="tetrisCanvas" width="200" height="150" style="background:#000;"></canvas>');const canvas=win.querySelector("#tetrisCanvas");const ctx=canvas.getContext("2d");const ROWS=15,COLS=10,BLOCK=10;let board=Array.from({length:ROWS},()=>Array(COLS).fill(0));const pieces=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,0],[1,1,1]]];let current=null;function newPiece(){current={shape:pieces[Math.floor(Math.random()*pieces.length)],x:Math.floor(COLS/2)-1,y:0};}function draw(){ctx.fillStyle="#000";ctx.fillRect(0,0,COLS*BLOCK,ROWS*BLOCK);for(let r=0;r<ROWS;r++){for(let c=0;c<COLS;c++){if(board[r][c]){ctx.fillStyle="#0f0";ctx.fillRect(c*BLOCK,r*BLOCK,BLOCK,BLOCK);}}}if(current){ctx.fillStyle="#f00";current.shape.forEach((row,ri)=>row.forEach((cell,ci)=>{if(cell){ctx.fillRect((current.x+ci)*BLOCK,(current.y+ri)*BLOCK,BLOCK,BLOCK);}}));}}function collide(){for(let r=0;r<current.shape.length;r++){for(let c=0;c<current.shape[r].length;c++){if(current.shape[r][c]){let nx=current.x+c,ny=current.y+r;if(ny>=ROWS||nx<0||nx>=COLS||board[ny][nx])return true;}}}return false;}function merge(){current.shape.forEach((row,ri)=>row.forEach((cell,ci)=>{if(cell)board[current.y+ri][current.x+ci]=1;}));}function clearRows(){for(let r=ROWS-1;r>=0;r--){if(board[r].every(c=>c)){board.splice(r,1);board.unshift(Array(COLS).fill(0));r++;}}}function drop(){current.y++;if(collide()){current.y--;merge();clearRows();newPiece();if(collide()){board=Array.from({length:ROWS},()=>Array(COLS).fill(0));}}}document.addEventListener("keydown",e=>{if(!current)return;if(e.key==="ArrowLeft"){current.x--;if(collide())current.x++;}else if(e.key==="ArrowRight"){current.x++;if(collide())current.x--;}else if(e.key==="ArrowDown"){drop();}else if(e.key==="ArrowUp"){const rotated=current.shape[0].length===current.shape.length?current.shape.map((_,i)=>current.shape.map(row=>row[i]).reverse()):current.shape[0].map((_,i)=>current.shape.map(row=>row[i]).reverse()); const backup=current.shape; current.shape=rotated;if(collide())current.shape=backup;}}); newPiece(); setInterval(()=>{drop();draw();},500);}
};
});
})();
