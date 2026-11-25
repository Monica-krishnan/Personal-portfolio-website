/* ---- Stars ---- */
(function(){
  var c=document.getElementById('stars-bg'), ctx=c.getContext('2d'), st=[];
  function rs(){ c.width=innerWidth; c.height=innerHeight; }
  rs(); window.addEventListener('resize',rs);
  for(var i=0;i<160;i++) st.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.5+0.3,o:Math.random(),s:Math.random()*0.02+0.005});
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    for(var i=0;i<st.length;i++){
      var s=st[i]; s.o+=s.s; if(s.o>1||s.o<0)s.s=-s.s;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+s.o+')'; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- Typing ---- */
var roles=['Frontend Developer','MCA Student','Web Designer','HTML & CSS Enthusiast','JavaScript Learner'];
var ri=0,ci=0,del=false;
function type(){
  var el=document.getElementById('typed-el'), w=roles[ri];
  if(!del){ ci++; el.textContent=w.slice(0,ci); if(ci===w.length) setTimeout(function(){del=true;},1800); }
  else { ci--; el.textContent=w.slice(0,ci); if(ci===0){del=false; ri=(ri+1)%roles.length;} }
  setTimeout(type,del?65:115);
}
type();

/* ---- Page switching ---- */
var curPage='home';
function showPage(id){
  if(curPage===id) return; curPage=id;
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('show');});
  document.querySelectorAll('.nav-menu li button, .mobile-menu button').forEach(function(b){b.classList.remove('active');});
  document.getElementById('pg-'+id).classList.add('show');
  var nb=document.getElementById('nb-'+id); if(nb) nb.classList.add('active');
  var mb=document.getElementById('mb-'+id); if(mb) mb.classList.add('active');
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  window.scrollTo(0,0);
  if(id==='skills'){
    setTimeout(function(){
      document.querySelectorAll('.sk-fill').forEach(function(f){f.style.width=f.getAttribute('data-w')+'%';});
    },200);
  }
  if(id==='projects') renderProjects();
}

document.getElementById('logo-btn'   ).addEventListener('click',function(){showPage('home');});
document.getElementById('nb-home'    ).addEventListener('click',function(){showPage('home');});
document.getElementById('nb-about'   ).addEventListener('click',function(){showPage('about');});
document.getElementById('nb-skills'  ).addEventListener('click',function(){showPage('skills');});
document.getElementById('nb-projects').addEventListener('click',function(){showPage('projects');});
document.getElementById('nb-contact' ).addEventListener('click',function(){showPage('contact');});
document.getElementById('mb-home'    ).addEventListener('click',function(){showPage('home');});
document.getElementById('mb-about'   ).addEventListener('click',function(){showPage('about');});
document.getElementById('mb-skills'  ).addEventListener('click',function(){showPage('skills');});
document.getElementById('mb-projects').addEventListener('click',function(){showPage('projects');});
document.getElementById('mb-contact' ).addEventListener('click',function(){showPage('contact');});

/* Hamburger */
document.getElementById('hamburger').addEventListener('click',function(){
  this.classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
});

/* ---- Click Me ---- */
document.getElementById('clickme-btn').addEventListener('click',function(){
  var t=document.getElementById('toast');
  t.classList.add('show'); setTimeout(function(){t.classList.remove('show');},4000);
  var wrap=document.getElementById('confetti-wrap');
  var cols=['#7c3aed','#ec4899','#f59e0b','#06b6d4','#10b981','#ef4444','#a855f7','#ffffff'];
  for(var i=0;i<90;i++){
    var d=document.createElement('div'); d.className='confetto';
    d.style.left=(Math.random()*100)+'vw'; d.style.top='-12px';
    d.style.background=cols[Math.floor(Math.random()*cols.length)];
    d.style.width=(Math.random()*7+4)+'px'; d.style.height=(Math.random()*7+4)+'px';
    d.style.borderRadius=Math.random()>0.5?'50%':'2px';
    d.style.animationDuration=(Math.random()*2+1.5)+'s';
    d.style.animationDelay=(Math.random()*0.5)+'s';
    wrap.appendChild(d);
    (function(el){setTimeout(function(){el.remove();},4500);})(d);
  }
  var btn=this; btn.textContent='🎉 Thanks!';
  btn.style.background='linear-gradient(135deg,#10b981,#06b6d4)';
  setTimeout(function(){btn.textContent='✨ Click Me!'; btn.style.background='';},3500);
});

/* =========================================================
   PROJECT SYSTEM — stored in localStorage
========================================================= */
var STORAGE_KEY = 'portfolio_projects';
var activeFilter = 'all';

/* Load projects from storage */
function loadProjects(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch(e){ return []; }
}

/* Save projects to storage */
function saveProjects(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/* Render project cards */
function renderProjects(){
  var projects = loadProjects();
  var grid = document.getElementById('proj-grid');
  var empty = document.getElementById('proj-empty');

  /* clear old cards (keep empty state) */
  var oldCards = grid.querySelectorAll('.proj-card');
  for(var i=0;i<oldCards.length;i++) oldCards[i].remove();

  /* filter */
  var filtered = activeFilter==='all' ? projects : projects.filter(function(p){return p.cat===activeFilter;});

  if(filtered.length===0){
    empty.style.display='flex';
    if(activeFilter!=='all'){
      empty.querySelector('p').innerHTML = 'No <strong style="color:var(--accent)">'+activeFilter+'</strong> projects yet.<br/>Click <strong style="color:var(--accent)">"+ Add Project"</strong> to add one!';
    } else {
      empty.querySelector('p').innerHTML = 'No projects yet.<br/>Click <strong style="color:var(--accent)">"+ Add Project"</strong> to upload your first project!';
    }
    return;
  }

  empty.style.display='none';

  filtered.forEach(function(proj){
    var card = document.createElement('div');
    card.className = 'proj-card';
    card.setAttribute('data-id', proj.id);

    /* tags html */
    var tagsHtml = '';
    if(proj.tags && proj.tags.length){
      proj.tags.forEach(function(t){
        tagsHtml += '<span class="ptag">'+escHtml(t.trim())+'</span>';
      });
    }

    /* links html */
    var linksHtml = '';
    if(proj.github) linksHtml += '<a href="'+escHtml(proj.github)+'" target="_blank" class="proj-link"><i class="fab fa-github"></i> Code</a>';
    if(proj.live)   linksHtml += '<a href="'+escHtml(proj.live)+'"   target="_blank" class="proj-link"><i class="fas fa-eye"></i> Live</a>';
    if(!linksHtml)  linksHtml = '<span style="font-size:0.75rem;color:var(--muted);">No links added</span>';

    card.innerHTML =
      '<button class="proj-delete" data-id="'+proj.id+'" title="Delete project"><i class="fas fa-trash"></i> Delete</button>'+
      '<div class="proj-emoji">'+(proj.emoji||'💻')+'</div>'+
      '<div class="proj-title">'+escHtml(proj.title)+'</div>'+
      '<div class="proj-desc">'+escHtml(proj.desc)+'</div>'+
      '<div class="proj-tags">'+tagsHtml+'</div>'+
      '<div class="proj-links">'+linksHtml+'</div>';

    grid.appendChild(card);

    /* delete button */
    card.querySelector('.proj-delete').addEventListener('click',function(){
      var pid = this.getAttribute('data-id');
      if(confirm('Delete this project?')){
        var arr = loadProjects().filter(function(p){return p.id!==pid;});
        saveProjects(arr);
        renderProjects();
      }
    });
  });
}

/* Escape HTML */
function escHtml(str){
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* Filter buttons */
document.querySelectorAll('.filter-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
    this.classList.add('active');
    activeFilter = this.getAttribute('data-filter');
    renderProjects();
  });
});

/* ---- MODAL ---- */
function openModal(){
  document.getElementById('modal-overlay').classList.add('open');
  /* clear form */
  document.getElementById('f-title').value='';
  document.getElementById('f-desc').value='';
  document.getElementById('f-emoji').value='';
  document.getElementById('f-cat').value='html';
  document.getElementById('f-tags').value='';
  document.getElementById('f-github').value='';
  document.getElementById('f-live').value='';
  document.getElementById('f-title').focus();
}
function closeModal(){
  document.getElementById('modal-overlay').classList.remove('open');
}

document.getElementById('open-modal-btn').addEventListener('click', openModal);
document.getElementById('close-modal-btn').addEventListener('click', closeModal);
document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click',function(e){
  if(e.target===this) closeModal();
});

/* Save project */
document.getElementById('save-proj-btn').addEventListener('click',function(){
  var title = document.getElementById('f-title').value.trim();
  var desc  = document.getElementById('f-desc').value.trim();
  if(!title){ alert('Please enter a project title.'); document.getElementById('f-title').focus(); return; }
  if(!desc)  { alert('Please enter a description.'); document.getElementById('f-desc').focus(); return; }

  var tagsRaw = document.getElementById('f-tags').value.trim();
  var tags = tagsRaw ? tagsRaw.split(',').map(function(t){return t.trim();}).filter(function(t){return t;}) : [];

  var proj = {
    id:     Date.now().toString(),
    title:  title,
    desc:   desc,
    emoji:  document.getElementById('f-emoji').value.trim() || '💻',
    cat:    document.getElementById('f-cat').value,
    tags:   tags,
    github: document.getElementById('f-github').value.trim(),
    live:   document.getElementById('f-live').value.trim()
  };

  var arr = loadProjects();
  arr.unshift(proj); /* newest first */
  saveProjects(arr);

  closeModal();
  activeFilter = 'all';
  document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
  renderProjects();
});

/* Initial render */
renderProjects();
