
(function(){
  var KEY="glass-todo-v1", THEME="glass-todo-theme";
  var todos=[], filter="all";
  var $=function(id){return document.getElementById(id)};
  var list=$("list"), input=$("input");
 
  function load(){
    try{var s=localStorage.getItem(KEY); if(s){todos=JSON.parse(s)||[]}}catch(e){todos=[]}
    if(!Array.isArray(todos)) todos=[];
    if(!todos.length && !load.seen){
      todos=[{id:1,text:"Tap the circle to finish a task",done:false},
             {id:2,text:"Add your own above",done:false}];
    }
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(todos))}catch(e){}}
 
  function render(){
    list.innerHTML="";
    var shown=todos.filter(function(t){
      return filter==="all"||(filter==="done"?t.done:!t.done);
    });
    if(!shown.length){
      var e=document.createElement("li");
      e.className="glass empty";
      e.textContent=filter==="done"?"Nothing finished yet.":
        filter==="active"?"All caught up.":"No tasks yet. Add one above.";
      list.appendChild(e);
    }
    shown.forEach(function(t){
      var li=document.createElement("li");
      li.className="glass"+(t.done?" done":"");
      var c=document.createElement("button");
      c.className="check"; c.textContent=t.done?"✓":"";
      c.setAttribute("aria-label",t.done?"Mark as not done":"Mark as done");
      c.onclick=function(){t.done=!t.done;save();render()};
      var l=document.createElement("span");
      l.className="label"; l.textContent=t.text;
      var d=document.createElement("button");
      d.className="del"; d.textContent="✕"; d.setAttribute("aria-label","Delete task");
      d.onclick=function(){todos=todos.filter(function(x){return x.id!==t.id});save();render()};
      li.append(c,l,d); list.appendChild(li);
    });
    var left=todos.filter(function(t){return !t.done}).length;
    $("count").textContent=left+(left===1?" task left":" tasks left");
    $("clear").style.visibility=todos.some(function(t){return t.done})?"visible":"hidden";
    document.querySelectorAll(".tabs button").forEach(function(b){
      b.setAttribute("aria-pressed",String(b.dataset.f===filter));
    });
  }
 
  function add(){
    var v=input.value.trim(); if(!v) return;
    todos.unshift({id:Date.now(),text:v,done:false});
    input.value=""; save(); render(); input.focus();
  }
 
  $("addBtn").onclick=add;
  input.addEventListener("keydown",function(e){if(e.key==="Enter")add()});
  document.querySelectorAll(".tabs button").forEach(function(b){
    b.onclick=function(){filter=b.dataset.f;render()};
  });
  $("clear").onclick=function(){todos=todos.filter(function(t){return !t.done});save();render()};
 
  $("theme").onclick=function(){
    var root=document.documentElement;
    var dark=root.dataset.theme?root.dataset.theme==="dark":
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next=dark?"light":"dark";
    root.dataset.theme=next;
    try{localStorage.setItem(THEME,next)}catch(e){}
  };
  try{var th=localStorage.getItem(THEME); if(th) document.documentElement.dataset.theme=th}catch(e){}
 
  $("sub").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
 
  load(); render();
})();