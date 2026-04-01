(function(){
  if(document.getElementById("miniDesktopContainer")) return;

  let zIndexCounter = 999;

  // ---- Mini Desktop Container ----
  const desk = document.createElement("div");
  desk.id = "miniDesktopContainer";
  desk.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    width:400px; height:300px;
    background:linear-gradient(145deg,#6fa8dc,#3d85c6);
    border:3px solid #222; border-radius:10px;
    z-index:${zIndexCounter};
    box-shadow:5px 5px 20px rgba(0,0,0,0.6);
    display:flex; flex-direction:column;
    font-family:sans-serif; user-select:none;
  `;

  // ---- Title Bar ----
  const titleBar = document.createElement("div");
  titleBar.style.cssText = `
    background:#222; color:white; padding:5px; cursor:move;
    display:flex; justify-content:space-between; align-items:center;
    border-top-left-radius:8px; border-top-right-radius:8px;
  `;
  titleBar.innerHTML = `<span>MiniDesktop</span>`;
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "X";
  closeBtn.style.cssText = "background:red;color:white;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;";
  closeBtn.onclick = () => desk.remove();
  titleBar.appendChild(closeBtn);
  desk.appendChild(titleBar);

  // ---- Workspace ----
  const workspace = document.createElement("div");
  workspace.style.cssText = `
    flex:1; display:flex; flex-wrap:wrap; padding:10px; gap:10px;
    background:linear-gradient(to bottom,#6fa8dc,#3d85c6);
    position:relative; overflow:hidden;
  `;
  desk.appendChild(workspace);

  // ---- Taskbar ----
  const taskbar = document.createElement("div");
  taskbar.style.cssText = `
    height:30px; background:#111; color:white; display:flex; align-items:center; padding:0 5px;
    border-bottom-left-radius:8px; border-bottom-right-radius:8px;
  `;
  taskbar.innerHTML = "<span style='font-size:12px;'>Start</span>";
  desk.appendChild(taskbar);

  // ---- Spin Button ----
  const spinBtn = document.createElement("button");
  spinBtn.innerText = "Spin";
  spinBtn.style.cssText = "margin-left:5px;padding:2px 5px;";
  spinBtn.onclick = () => {
    workspace.childNodes.forEach(icon => {
      icon.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 500 });
    });
  };
  taskbar.appendChild(spinBtn);

  // ---- Add TextBox ----
  const addTextBox = document.createElement("input");
  addTextBox.type = "text";
  addTextBox.placeholder = "Add icon text";
  addTextBox.style.cssText = "margin-left:5px;";
  taskbar.appendChild(addTextBox);

  addTextBox.addEventListener("keydown", e => {
    if(e.key === "Enter" && addTextBox.value.trim()){
      const icon = document.createElement("div");
      icon.style.cssText = `
        width:60px;height:60px;display:flex;flex-direction:column;
        align-items:center;justify-content:center;cursor:pointer;color:white;
        text-shadow:1px 1px 2px #000;font-size:12px;
      `;
      icon.innerHTML = `<div style="font-size:24px;">📝</div>${addTextBox.value}`;
      workspace.appendChild(icon);
      addTextBox.value = "";
    }
  });

  document.body.appendChild(desk);

  // ---- Drag Desktop ----
  let draggingDesk=false, offsetXDesk=0, offsetYDesk=0;
  titleBar.onmousedown = e => { draggingDesk=true; offsetXDesk=e.clientX-desk.offsetLeft; offsetYDesk=e.clientY-desk.offsetTop; }
  document.onmouseup = () => draggingDesk=false;
  document.onmousemove = e => { if(draggingDesk){ desk.style.left=(e.clientX-offsetXDesk)+"px"; desk.style.top=(e.clientY-offsetYDesk)+"px"; } }

  // ---- Open Pop-Out Window ----
  function openWindow(title, contentHTML){
    const win = document.createElement("div");
    win.style.cssText = `
      position:absolute; top:50px; left:50px;
      width:280px; height:200px;
      background:#fff; border:2px solid #555; border-radius:6px;
      display:flex; flex-direction:column; box-shadow:3px 3px 15px rgba(0,0,0,0.5);
      z-index: ${++zIndexCounter};
    `;
    const winBar = document.createElement("div");
    winBar.style.cssText = `
      background:#444; color:white; padding:4px;
      cursor:move; display:flex; justify-content:space-between;
    `;
    winBar.innerText = title;
    const winClose = document.createElement("button");
    winClose.textContent = "X";
    winClose.style.cssText = "background:red;color:white;border:none;padding:1px 4px;border-radius:3px;cursor:pointer;";
    winClose.onclick = () => win.remove();
    winBar.appendChild(winClose);
    win.appendChild(winBar);

    const content = document.createElement("div");
    content.style.cssText = "flex:1; overflow:auto; font-size:12px; padding:4px;";
    content.innerHTML = contentHTML;
    win.appendChild(content);

    desk.appendChild(win);

    // Drag logic
    let draggingWin=false, offsetXWin=0, offsetYWin=0;
    winBar.addEventListener("mousedown", e=>{
      draggingWin=true;
      offsetXWin = e.clientX - win.offsetLeft;
      offsetYWin = e.clientY - win.offsetTop;
      win.style.zIndex = ++zIndexCounter;
    });
    document.addEventListener("mouseup", ()=>draggingWin=false);
    document.addEventListener("mousemove", e=>{
      if(draggingWin){ win.style.left=(e.clientX-offsetXWin)+"px"; win.style.top=(e.clientY-offsetYWin)+"px"; }
    });
    return content;
  }

  // ---- Apps ----
  const apps = [
    ["NumCrunch","🧮"], ["QuickPad","📒"], ["TimeKeeper","⏱️"], ["SlitherDash","🐍"],
    ["PixelBrush","🎨"], ["BumperBlast","🎱"], ["WorldPlay","🌍"], ["MiniMusic","🎵"],
    ["MiniTetris","⬛"], ["YouTube","▶️"]
  ];

  apps.forEach(a=>{
    const icon = document.createElement("div");
    icon.style.cssText = `
      width:60px;height:60px;display:flex;flex-direction:column;
      align-items:center;justify-content:center;cursor:pointer;color:white;
      text-shadow:1px 1px 2px #000;font-size:12px;
    `;
    icon.innerHTML = `<div style="font-size:24px;">${a[1]}</div>${a[0]}`;
    workspace.appendChild(icon);

    icon.addEventListener("click", ()=>{
      // ---- Calculator ----
      if(a[0]==="NumCrunch"){
        const c = openWindow("Calculator","");
        const input = document.createElement("input"); input.style.width="90%";
        const btn = document.createElement("button"); btn.textContent="=";
        btn.onclick = ()=>{ try{ input.value = Function("return "+input.value)(); }catch(e){ alert("Error"); } };
        c.appendChild(input); c.appendChild(btn);
      }
      // ---- Notes ----
      if(a[0]==="QuickPad"){
        const c = openWindow("Notes","");
        const ta = document.createElement("textarea"); ta.style.width="100%"; ta.style.height="100%";
        c.appendChild(ta);
      }
      // ---- Clock ----
      if(a[0]==="TimeKeeper"){
        const c = openWindow("Clock","");
        const d = document.createElement("div"); c.appendChild(d);
        setInterval(()=>{ d.textContent=new Date().toLocaleTimeString(); },1000);
      }
      // ---- Snake ----
      if(a[0]==="SlitherDash"){
        const c = openWindow("Snake",'<canvas width="260" height="180" style="background:#000;"></canvas>');
        const canvas = c.querySelector("canvas"); const ctx = canvas.getContext("2d");
        let snake=[{x:10,y:10}], dx=10, dy=0, food={x:100,y:50}, gameOver=false;
        function draw(){ ctx.fillStyle="#000"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle="#0f0"; snake.forEach(s=>ctx.fillRect(s.x,s.y,10,10)); ctx.fillStyle="#f00"; ctx.fillRect(food.x,food.y,10,10); }
        function move(){ if(gameOver) return; const head={x:snake[0].x+dx,y:snake[0].y+dy}; if(head.x<0||head.x>=canvas.width||head.y<0||head.y>=canvas.height||snake.some(s=>s.x===head.x&&s.y===head.y)){gameOver=true;return;} snake.unshift(head); if(head.x===food.x&&head.y===food.y){food={x:Math.floor(Math.random()*26)*10,y:Math.floor(Math.random()*18)*10};}else{snake.pop();} }
        document.addEventListener("keydown",e=>{ if(e.key==="ArrowUp"&&dy===0){dx=0;dy=-10;} if(e.key==="ArrowDown"&&dy===0){dx=0;dy=10;} if(e.key==="ArrowLeft"&&dx===0){dx=-10;dy=0;} if(e.key==="ArrowRight"&&dx===0){dx=10;dy=0;} });
        setInterval(()=>{ move(); draw(); },150);
      }
      // ---- Paint ----
      if(a[0]==="PixelBrush"){
        const c = openWindow("Paint",'<canvas width="260" height="180" style="background:#fff;border:1px solid #000;"></canvas>');
        const canvas = c.querySelector("canvas"); const ctx = canvas.getContext("2d"); let drawing=false;
        canvas.onmousedown=e=>{drawing=true; ctx.beginPath(); ctx.moveTo(e.offsetX,e.offsetY);}
        canvas.onmouseup=()=>drawing=false;
        canvas.onmousemove=e=>{if(drawing){ctx.lineTo(e.offsetX,e.offsetY); ctx.stroke();}}
      }
      // ---- Pinball ----
      if(a[0]==="BumperBlast"){
        const c = openWindow("Pinball",'<canvas width="260" height="180" style="background:#222;"></canvas>');
        const canvas=c.querySelector("canvas"); const ctx=canvas.getContext("2d");
        let ball={x:130,y:90,dx:2,dy:2,r:5};
        function draw(){ ctx.fillStyle="#222"; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle="#ff0"; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill(); }
        function move(){ ball.x+=ball.dx; ball.y+=ball.dy; if(ball.x<0||ball.x>canvas.width) ball.dx*=-1; if(ball.y<0||ball.y>canvas.height) ball.dy*=-1; }
        setInterval(()=>{ move(); draw(); },20);
      }
      // ---- Sandbox/WorldPlay ----
      if(a[0]==="WorldPlay"){
        const c = openWindow("WorldPlay",`
          <canvas width="350" height="220" style="background:#88ccee;border:1px solid #000;"></canvas>
          <div style="margin-top:5px;">
            <button id="addBall">Add Ball</button>
            <button id="addBox">Add Box</button>
            <button id="addNPC">Add NPC</button>
            <button id="clearAll">Clear</button>
          </div>
        `);
        // -- Sandbox code here (physics & drag) --
        // I can add optimized physics if you want a **better grab experience**
      }

      // ---- Mini Tetris ----
      if(a[0]==="MiniTetris"){
        const c = openWindow("Tetris",'<canvas width="260" height="180" style="background:#000;"></canvas>');
        const canvas = c.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const COLS = 10, ROWS = 18, BLOCK=10;
        const board = Array.from({length:ROWS}, ()=>Array(COLS).fill(0));
        const pieces = [
          {shape:[[1,1,1,1]], color:"cyan"},
          {shape:[[1,1],[1,1]], color:"yellow"},
          {shape:[[0,1,1],[1,1,0]], color:"red"},
          {shape:[[1,1,0],[0,1,1]], color:"green"},
          {shape:[[1,0,0],[1,1,1]], color:"blue"},
          {shape:[[0,0,1],[1,1,1]], color:"orange"},
          {shape:[[0,1,0],[1,1,1]], color:"purple"}
        ];
        let cur = {...pieces[Math.floor(Math.random()*pieces.length)], x:3, y:0};
        function draw(){ ctx.fillStyle="#000"; ctx.fillRect(0,0,canvas.width,canvas.height);
          for(let r=0;r<ROWS;r++){for(let c=0;c<COLS;c++){if(board[r][c]){ctx.fillStyle=board[r][c];ctx.fillRect(c*BLOCK,r*BLOCK,BLOCK,BLOCK);}}}
          cur.shape.forEach((row, y)=>row.forEach((val,x)=>{if(val){ctx.fillStyle=cur.color;ctx.fillRect((cur.x+x)*BLOCK,(cur.y+y)*BLOCK,BLOCK,BLOCK);}}));
        }
        function valid(move){ for(let y=0;y<move.shape.length;y++){for(let x=0;x<move.shape[y].length;x++){if(move.shape[y][x]){let nx=move.x+x, ny=move.y+y; if(nx<0||nx>=COLS||ny>=ROWS||board[ny][nx]) return false;}}} return true; }
        function merge(){ cur.shape.forEach((row,y)=>row.forEach((val,x)=>{if(val) board[cur.y+y][cur.x+x]=cur.color;})); cur = {...pieces[Math.floor(Math.random()*pieces.length)], x:3, y:0;}; if(!valid(cur)) alert("Game Over"); }
        function drop(){ cur.y++; if(!valid(cur)) {cur.y--; merge();} draw(); }
        document.addEventListener("keydown",e=>{ let temp = {...cur}; if(e.key==="ArrowLeft"){temp.x--; if(valid(temp)) cur.x--; } if(e.key==="ArrowRight"){temp.x++; if(valid(temp)) cur.x++; } if(e.key==="ArrowDown"){drop();} draw(); });
        setInterval(drop,500); draw();
      }

      // ---- YouTube ----
      if(a[0]==="YouTube"){
        const c = openWindow("YouTube",'<iframe width="100%" height="100%" src="https://www.youtube.com/embed?autoplay=1" frameborder="0" allowfullscreen></iframe>');
      }

    });
  });
})();
