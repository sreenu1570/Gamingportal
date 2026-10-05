function currentUser(){return JSON.parse(localStorage.getItem("currentUser")||"null")}
function saveScore(game,score){
 const u=currentUser();if(!u||u.role!=="user"){alert("Please login as a user first.");location.href="../login.html";return}
 const scores=JSON.parse(localStorage.getItem("scores")||"[]");
 scores.push({userId:u.id,userName:u.name,game,score:Number(score),date:new Date().toLocaleString()});
 localStorage.setItem("scores",JSON.stringify(scores));
}

/* TIC TAC TOE */
if(document.getElementById("tttBoard")){
 let board=Array(9).fill(""),player="X",over=false;
 const boardEl=document.getElementById("tttBoard"),status=document.getElementById("tttStatus");
 function render(){boardEl.innerHTML=board.map((v,i)=>`<button class="ttt-cell" data-i="${i}">${v}</button>`).join("");boardEl.querySelectorAll(".ttt-cell").forEach(b=>b.onclick=()=>move(+b.dataset.i))}
 function move(i){if(over||board[i])return;board[i]=player;const win=check();if(win){status.textContent=`Player ${player} wins!`;over=true;saveScore("Tic Tac Toe",10);return}if(board.every(Boolean)){status.textContent="Draw!";over=true;return}player=player==="X"?"O":"X";status.textContent=`Player ${player}'s turn`;render()}
 function check(){return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(([a,b,c])=>board[a]&&board[a]===board[b]&&board[a]===board[c])}
 document.getElementById("tttReset").onclick=()=>{board=Array(9).fill("");player="X";over=false;status.textContent="Player X's turn";render()};render();
}

/* ROCK PAPER SCISSORS */
if(document.querySelector(".choice")){
 let score=0;const choices=["Rock","Paper","Scissors"],result=document.getElementById("rpsResult");
 document.querySelectorAll(".choice").forEach(btn=>btn.onclick=()=>{
  const user=btn.dataset.choice,computer=choices[Math.floor(Math.random()*3)];
  let text;if(user===computer)text=`Draw! Computer chose ${computer}.`;
  else if((user==="Rock"&&computer==="Scissors")||(user==="Paper"&&computer==="Rock")||(user==="Scissors"&&computer==="Paper")){score+=10;text=`You win! Computer chose ${computer}.`;saveScore("Rock Paper Scissors",score)}
  else text=`You lose. Computer chose ${computer}.`;
  document.getElementById("rpsScore").textContent=score;result.textContent=text;
 });
}

/* MEMORY */
if(document.getElementById("memoryBoard")){
 let symbols=["🍎","🍎","🚀","🚀","⚽","⚽","🎵","🎵"],open=[],matches=0,locked=false;
 const board=document.getElementById("memoryBoard"),status=document.getElementById("memoryStatus");
 function shuffle(a){return a.sort(()=>Math.random()-.5)}
 function render(){board.innerHTML=symbols.map((s,i)=>`<button class="memory-card" data-i="${i}">${open.includes(i)||symbols[i]==="*" ? s:"?"}</button>`).join("");board.querySelectorAll("button").forEach(b=>b.onclick=()=>flip(+b.dataset.i))}
 function flip(i){if(locked||open.includes(i)||symbols[i]==="*")return;open.push(i);render();if(open.length===2){locked=true;const [a,b]=open;if(symbols[a]===symbols[b]){symbols[a]=symbols[b]="*";matches++;status.textContent=`Matches: ${matches} / 4`;open=[];locked=false;render();if(matches===4){status.textContent="You completed the game! +40 points";saveScore("Memory Game",40)}}else setTimeout(()=>{open=[];locked=false;render()},650)}}
 document.getElementById("memoryReset").onclick=()=>{symbols=shuffle(["🍎","🍎","🚀","🚀","⚽","⚽","🎵","🎵"]);open=[];matches=0;locked=false;status.textContent="Matches: 0 / 4";render()};symbols=shuffle(symbols);render();
}

/* SNAKE */
if(document.getElementById("snakeCanvas")){
 const canvas=document.getElementById("snakeCanvas"),ctx=canvas.getContext("2d"),scoreEl=document.getElementById("snakeScore");let snake,food,dir,score,timer;
 function start(){clearInterval(timer);snake=[{x:200,y:200},{x:180,y:200},{x:160,y:200}];food=randomFood();dir={x:20,y:0};score=0;scoreEl.textContent=0;timer=setInterval(tick,120);draw()}
 function randomFood(){return{x:Math.floor(Math.random()*20)*20,y:Math.floor(Math.random()*20)*20}}
 function tick(){const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=400||head.y<0||head.y>=400||snake.some(s=>s.x===head.x&&s.y===head.y)){clearInterval(timer);saveScore("Snake Game",score);alert(`Game Over! Score: ${score}`);return}snake.unshift(head);if(head.x===food.x&&head.y===food.y){score+=10;scoreEl.textContent=score;food=randomFood()}else snake.pop();draw()}
 function draw(){ctx.fillStyle="#06101d";ctx.fillRect(0,0,400,400);ctx.fillStyle="#ff6878";ctx.fillRect(food.x,food.y,20,20);ctx.fillStyle="#55d98b";snake.forEach(s=>ctx.fillRect(s.x,s.y,18,18))}
 document.addEventListener("keydown",e=>{const k=e.key;if(k==="ArrowUp"&&dir.y===0)dir={x:0,y:-20};if(k==="ArrowDown"&&dir.y===0)dir={x:0,y:20};if(k==="ArrowLeft"&&dir.x===0)dir={x:-20,y:0};if(k==="ArrowRight"&&dir.x===0)dir={x:20,y:0}});document.getElementById("snakeStart").onclick=start;draw();
}
