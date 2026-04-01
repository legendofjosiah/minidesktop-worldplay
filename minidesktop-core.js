// minidesktop.js
(function() {
  if (document.getElementById("miniDesktopContainer")) return;

  let zIndexCounter = 100;

  // ---- Desktop ----
  const desk = document.createElement("div");
  desk.id = "miniDesktopContainer";
  desk.style.cssText = `
    position:fixed; bottom:20px; right:20px;
    width:450px; height:340px;
    background:linear-gradient(145deg,#6fa8dc,#3d85c6);
    border:3px solid #222; border-radius:10px;
    display:flex; flex-direction:column; font-family:sans-serif;
    z-index:999999;
  `;

  // ---- Title Bar ----
  const titleBar = document.createElement("div");
  titleBar.style.cssText = `
    background:#222; color:white; padding:5px;
    cursor:move; display:flex; justify-content:space-between;
  `;
  titleBar.innerText = "MiniDesktop";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "X";
  closeBtn.style.cssText = `
    background:red; color:white; border:none; padding:2px 6px;
    border-radius:4px; cursor:pointer;
  `;
  closeBtn.onclick = () => desk.remove();
  titleBar.appendChild(closeBtn);
  desk.appendChild(titleBar);

  // ---- Workspace ----
  const workspace = document.createElement("div");
  workspace.style.cssText = `
    flex:1; display:flex; flex-wrap:wrap;
    padding:10px; gap:10px; position:relative; overflow:hidden;
  `;
  desk.appendChild(workspace);

  // ---- Taskbar ----
  const taskbar = document.createElement("div");
  taskbar.style.cssText = `
    height:30px; background:#111; color:white; display:flex;
    align-items:center; padding:0 5px; gap:5px; overflow-x:auto;
  `;
  desk.appendChild(taskbar);

  document.body.appendChild(desk);

  // ---- Drag Desktop ----
  let dragging = false, offsetX = 0, offsetY = 0;
  titleBar.addEventListener("mousedown", e => {
    dragging = true;
    offsetX = e.clientX - desk.offsetLeft;
    offsetY = e.clientY - desk.offsetTop;
  });
  document.addEventListener("mouseup", () => dragging = false);
  document.addEventListener("mousemove", e => {
    if (dragging) {
      desk.style.left = e.clientX - offsetX + "px";
      desk.style.top = e.clientY - offsetY + "px";
    }
  });

  // ---- Window System ----
  function bringToFront(win) { zIndexCounter++; win.style.zIndex = zIndexCounter; }

  function openWindow(title) {
    const win = document.createElement("div");
    win.style.cssText = `
      position:absolute; top:40px; left:40px;
      width:260px; height:200px;
      background:#fff; border:2px solid #555;
      display:flex; flex-direction:column; resize:both; overflow:hidden;
    `;
    bringToFront(win);

    // Window Title Bar
    const winBar = document.createElement("div");
    winBar.style.cssText = `
      background:#444; color:white; padding:3px;
      cursor:move; display:flex; justify-content:space-between;
    `;
    winBar.innerText = title;

    const winClose = document.createElement("button");
    winClose.textContent = "X";
    winClose.style.cssText = `
      background:red; color:white; border:none; padding:1px 4px;
      border-radius:3px; cursor:pointer;
    `;
    winClose.onclick = () => win.remove();
    winBar.appendChild(winClose);
    win.appendChild(winBar);

    const content = document.createElement("div");
    content.style.cssText = "flex:1; overflow:auto; font-size:12px; padding:4px;";
    win.appendChild(content);

    // Drag window
    let winDrag = false, dx = 0, dy = 0;
    winBar.addEventListener("mousedown", e => {
      winDrag = true;
      dx = e.clientX - win.offsetLeft;
      dy = e.clientY - win.offsetTop;
      bringToFront(win);
    });
    document.addEventListener("mouseup", () => winDrag = false);
    document.addEventListener("mousemove", e => {
      if (winDrag) {
        win.style.left = e.clientX - dx + "px";
        win.style.top = e.clientY - dy + "px";
      }
    });

    win.addEventListener("mousedown", () => bringToFront(win));

    // Taskbar button
    const btn = document.createElement("button");
    btn.textContent = title;
    btn.onclick = () => bringToFront(win);
    taskbar.appendChild(btn);

    return content;
  }

  // ---- Apps ----
  const apps = [
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
    const icon = document.createElement("div");
    icon.style.cssText = `
      width:60px; height:60px; text-align:center;
      cursor:pointer; color:white; font-size:12px; text-shadow:1px 1px 2px #000;
    `;
    icon.innerHTML = `<div style="font-size:24px;">${a[1]}</div>${a[0]}`;
    workspace.appendChild(icon);

    icon.ondblclick = () => {
      // ---- Calculator ----
      if(a[0]==="NumCrunch"){
        const c = openWindow("Calculator");
        const input = document.createElement("input");
        input.style.width="90%";
        const btn = document.createElement("button");
        btn.textContent="=";
        btn.onclick = () => {
          try{ input.value = Function("return "+input.value)(); }
          catch(e){ alert("Error"); }
        };
        c.appendChild(input); c.appendChild(btn);
      }

      // ---- Notes ----
      if(a[0]==="QuickPad"){
        const c = openWindow("Notes");
        const ta = document.createElement("textarea");
        ta.style.width="100%"; ta.style.height="100%";
        c.appendChild(ta);
      }

      // ---- Clock ----
      if(a[0]==="TimeKeeper"){
        const c = openWindow("Clock");
        const d = document.createElement("div"); c.appendChild(d);
        setInterval(()=>{ d.textContent=new Date().toLocaleTimeString(); },1000);
      }

      // ---- YouTube ----
      if(a[0]==="YouTube"){
        const c = openWindow("YouTube");
        const input = document.createElement("input");
        input.placeholder="URL or ID"; input.style.width="90%";
        const btn = document.createElement("button"); btn.textContent="Load";
        const player = document.createElement("div");

        btn.onclick = ()=>{
          let val = input.value.trim();
          let id = val;
          const m = val.match(/(?:v=|\/|shorts\/)([\w-]{11})/);
          if(m) id = m[1];
          if(!id || id.length!==11){ alert("Invalid ID"); return; }
          player.innerHTML=`<iframe width="220" height="130" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
        };
        c.appendChild(input); c.appendChild(btn); c.appendChild(player);
      }

      // ---- Add more apps here like Snake, Paint, Sandbox, WorldPlay ----
    };
  });

})();
