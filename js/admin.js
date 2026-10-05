function requireAdmin(){
 const u=JSON.parse(localStorage.getItem("currentUser")||"null");
 if(!u||u.role!=="admin"){location.href="../login.html";return null} return u;
}
function getGames(){return JSON.parse(localStorage.getItem("games")||"[]")}
function setGames(x){localStorage.setItem("games",JSON.stringify(x))}
function getUsers(){return JSON.parse(localStorage.getItem("users")||"[]")}
function getScores(){return JSON.parse(localStorage.getItem("scores")||"[]")}
function logout(){localStorage.removeItem("currentUser");location.href="../login.html"}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

document.addEventListener("DOMContentLoaded",()=>{
 if(!requireAdmin())return;
 document.getElementById("logoutBtn")?.addEventListener("click",logout);
 const users=getUsers(),games=getGames(),scores=getScores();
 const tu=document.getElementById("totalUsers"); if(tu)tu.textContent=users.length;
 const tg=document.getElementById("totalGames"); if(tg)tg.textContent=games.length;
 const ts=document.getElementById("totalScores"); if(ts)ts.textContent=scores.length;
 const hs=document.getElementById("highestScore"); if(hs)hs.textContent=scores.length?Math.max(...scores.map(s=>Number(s.score)||0)):0;

 const userTable=document.getElementById("userTable");
 const search=document.getElementById("userSearch");
 function renderUsers(filter=""){
  if(!userTable)return;
  const rows=users.filter(u=>(u.name+" "+u.email).toLowerCase().includes(filter.toLowerCase()));
  userTable.innerHTML=`<table><thead><tr><th>Name</th><th>Email</th><th>Registered</th><th>Action</th></tr></thead><tbody>${rows.map(u=>`<tr><td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td>${new Date(Number(u.id)).toLocaleDateString()}</td><td><button class="table-btn danger" data-delete-user="${u.id}">Delete</button></td></tr>`).join("")||"<tr><td colspan='4'>No users found.</td></tr>"}</tbody></table>`;
  userTable.querySelectorAll("[data-delete-user]").forEach(b=>b.onclick=()=>{
    const id=b.dataset.deleteUser;
    const next=getUsers().filter(u=>u.id!==id); localStorage.setItem("users",JSON.stringify(next)); location.reload();
  });
 }
 renderUsers(); search?.addEventListener("input",()=>renderUsers(search.value));

 const scoreTable=document.getElementById("scoreTable");
 if(scoreTable){
  const rows=[...scores].sort((a,b)=>b.score-a.score);
  scoreTable.innerHTML=`<table><thead><tr><th>Player</th><th>Game</th><th>Score</th><th>Date</th></tr></thead><tbody>${rows.map(s=>`<tr><td>${escapeHtml(s.userName)}</td><td>${escapeHtml(s.game)}</td><td>${s.score}</td><td>${escapeHtml(s.date)}</td></tr>`).join("")||"<tr><td colspan='4'>No scores yet.</td></tr>"}</tbody></table>`;
 }
 const form=document.getElementById("gameForm");
 const table=document.getElementById("gameTable");
 function renderGames(){
  if(!table)return;
  const gs=getGames();
  table.innerHTML=`<table><thead><tr><th>Game</th><th>Category</th><th>Difficulty</th><th>Description</th><th>Action</th></tr></thead><tbody>${gs.map(g=>`<tr><td>${g.icon} ${escapeHtml(g.name)}</td><td>${escapeHtml(g.category)}</td><td>${escapeHtml(g.difficulty)}</td><td>${escapeHtml(g.description)}</td><td><button class="table-btn" data-edit="${g.id}">Edit</button><button class="table-btn danger" data-delete="${g.id}">Delete</button></td></tr>`).join("")}</tbody></table>`;
  table.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>{
    const g=getGames().find(x=>x.id===b.dataset.edit);
    document.getElementById("gameId").value=g.id;document.getElementById("gameName").value=g.name;document.getElementById("gameCategory").value=g.category;document.getElementById("gameDifficulty").value=g.difficulty;document.getElementById("gameIcon").value=g.icon;document.getElementById("gameDescription").value=g.description;document.getElementById("formTitle").textContent="Edit Game";window.scrollTo(0,0);
  });
  table.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{
    if(confirm("Delete this game?")){setGames(getGames().filter(x=>x.id!==b.dataset.delete));renderGames()}
  });
 }
 renderGames();
 form?.addEventListener("submit",e=>{
  e.preventDefault();
  const id=document.getElementById("gameId").value;
  const obj={id:id||("custom-"+Date.now()),name:document.getElementById("gameName").value.trim(),category:document.getElementById("gameCategory").value.trim(),difficulty:document.getElementById("gameDifficulty").value,icon:document.getElementById("gameIcon").value.trim(),description:document.getElementById("gameDescription").value.trim()};
  let gs=getGames(); const index=gs.findIndex(g=>g.id===id);
  if(index>=0)gs[index]=obj;else gs.push(obj);setGames(gs);form.reset();document.getElementById("gameId").value="";document.getElementById("gameIcon").value="🎮";document.getElementById("formTitle").textContent="Add Game";document.getElementById("gameMessage").textContent="Game saved successfully.";renderGames();
 });
 document.getElementById("cancelEdit")?.addEventListener("click",()=>{form.reset();document.getElementById("gameId").value="";document.getElementById("gameIcon").value="🎮";document.getElementById("formTitle").textContent="Add Game"});
});
