const ADMIN={username:"admin",password:"admin123",role:"admin",name:"Administrator"};
function getUsers(){return JSON.parse(localStorage.getItem("users")||"[]")}
function saveUsers(users){localStorage.setItem("users",JSON.stringify(users))}
function seedData(){
  if(!localStorage.getItem("games")){
    localStorage.setItem("games",JSON.stringify([
      {id:"snake",name:"Snake Game",category:"Arcade",difficulty:"Medium",icon:"🐍",description:"Classic snake game using keyboard controls."},
      {id:"tictactoe",name:"Tic Tac Toe",category:"Board",difficulty:"Easy",icon:"❌",description:"Two-player game. Get three symbols in a row."},
      {id:"rps",name:"Rock Paper Scissors",category:"Casual",difficulty:"Easy",icon:"✊",description:"Choose rock, paper or scissors against the computer."},
      {id:"memory",name:"Memory Game",category:"Puzzle",difficulty:"Medium",icon:"🧠",description:"Flip cards and find all matching pairs."}
    ]));
  }
  if(!localStorage.getItem("scores")) localStorage.setItem("scores","[]");
}
seedData();

document.addEventListener("DOMContentLoaded",()=>{
 const loginForm=document.getElementById("loginForm");
 if(loginForm) loginForm.addEventListener("submit",e=>{
   e.preventDefault();
   const id=document.getElementById("loginId").value.trim();
   const pass=document.getElementById("loginPassword").value;
   const msg=document.getElementById("loginMessage");
   if((id==="admin"||id==="admin@example.com")&&pass===ADMIN.password){
     localStorage.setItem("currentUser",JSON.stringify(ADMIN));
     location.href="admin/dashboard.html"; return;
   }
   const user=getUsers().find(u=>(u.email.toLowerCase()===id.toLowerCase()||u.name.toLowerCase()===id.toLowerCase())&&u.password===pass);
   if(!user){msg.textContent="Invalid username/email or password.";msg.style.color="#ff8d8d";return}
   localStorage.setItem("currentUser",JSON.stringify({...user,role:"user"}));
   location.href="user/dashboard.html";
 });
 const signupForm=document.getElementById("signupForm");
 if(signupForm) signupForm.addEventListener("submit",e=>{
   e.preventDefault();
   const name=document.getElementById("signupName").value.trim();
   const email=document.getElementById("signupEmail").value.trim().toLowerCase();
   const password=document.getElementById("signupPassword").value;
   const confirm=document.getElementById("signupConfirm").value;
   const msg=document.getElementById("signupMessage");
   if(password!==confirm){msg.textContent="Passwords do not match.";msg.style.color="#ff8d8d";return}
   const users=getUsers();
   if(users.some(u=>u.email===email)){msg.textContent="Email already registered.";msg.style.color="#ff8d8d";return}
   users.push({id:Date.now().toString(),name,email,password});
   saveUsers(users);
   msg.textContent="Account created successfully. Redirecting to login...";
   setTimeout(()=>location.href="login.html",900);
 });
});
