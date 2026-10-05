function requireUser(){const u=JSON.parse(localStorage.getItem("currentUser")||"null");if(!u||u.role!=="user"){location.href="../login.html";return null}return u}
document.addEventListener("DOMContentLoaded",()=>{
 const u=requireUser();if(!u)return;
 document.getElementById("logoutBtn")?.addEventListener("click",()=>{localStorage.removeItem("currentUser");location.href="../login.html"});
 const scores=JSON.parse(localStorage.getItem("scores")||"[]");
 const best={};scores.forEach(s=>{if(!best[s.userId]||s.score>best[s.userId].score)best[s.userId]=s});
 const rows=Object.values(best).sort((a,b)=>b.score-a.score);
 document.getElementById("leaderboard").innerHTML=`<table><thead><tr><th>Rank</th><th>Player</th><th>Game</th><th>Best Score</th></tr></thead><tbody>${rows.map((s,i)=>`<tr><td>${i+1}</td><td>${s.userName}${s.userId===u.id?" ⭐":""}</td><td>${s.game}</td><td>${s.score}</td></tr>`).join("")||"<tr><td colspan='4'>No scores yet. Play a game!</td></tr>"}</tbody></table>`;
});
