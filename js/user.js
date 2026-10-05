function requireUser(){
 const u=JSON.parse(localStorage.getItem("currentUser")||"null");
 if(!u||u.role!=="user"){location.href="../login.html";return null} return u;
}
function getGames(){return JSON.parse(localStorage.getItem("games")||"[]")}
function getScores(){return JSON.parse(localStorage.getItem("scores")||"[]")}
function logout(){localStorage.removeItem("currentUser");location.href="../login.html"}
function renderGames(container){
 const games=getGames();
 container.innerHTML=games.map(g=>{
  const playable=["snake","tictactoe","rps","memory"].includes(g.id);
  const target=playable?`../games/${g.id}.html`:"#";
  return `<article class="game-card"><div class="game-icon">${g.icon}</div><h3>${g.name}</h3><small>${g.category} • ${g.difficulty}</small><p>${g.description}</p>${playable?`<a class="btn" href="${target}">Play Game</a>`:`<button class="btn" disabled>Coming Soon</button>`}</article>`;
 }).join("");
}
document.addEventListener("DOMContentLoaded",()=>{
 const u=requireUser();if(!u)return;
 document.getElementById("logoutBtn")?.addEventListener("click",logout);
 const welcome=document.getElementById("welcome");if(welcome)welcome.textContent=`Welcome, ${u.name}!`;
 const cards=document.getElementById("gameCards");if(cards)renderGames(cards);
 const scores=getScores().filter(s=>s.userId===u.id);
 const gameCount=document.getElementById("gameCount");if(gameCount)gameCount.textContent=getGames().length;
 const best=document.getElementById("myBest");if(best)best.textContent=scores.length?Math.max(...scores.map(s=>s.score)):0;
 const plays=document.getElementById("myPlays");if(plays)plays.textContent=scores.length;
 const name=document.getElementById("profileName");if(name)name.textContent=u.name;
 const email=document.getElementById("profileEmail");if(email)email.textContent=u.email;
 const avatar=document.getElementById("avatar");if(avatar)avatar.textContent=u.name.charAt(0).toUpperCase();
 const history=document.getElementById("myScores");
 if(history){
  history.innerHTML=`<table><thead><tr><th>Game</th><th>Score</th><th>Date</th></tr></thead><tbody>${scores.sort((a,b)=>b.score-a.score).map(s=>`<tr><td>${s.game}</td><td>${s.score}</td><td>${s.date}</td></tr>`).join("")||"<tr><td colspan='3'>No scores yet.</td></tr>"}</tbody></table>`;
 }
});
