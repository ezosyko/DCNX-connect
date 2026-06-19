/* ================= VARIABLES ================= */

let currentRoom = "MainChat";

let profile = { name: "Anonyme", color: "#ffffff" };

let rooms = {
  MainChat: [],
  Spam: [],
  OffTopic: [],
  logs: []
};

let roomUsers = {
  MainChat: [],
  Spam: [],
  OffTopic: [],
  logs: []
};

let users = [];
let blocked = [];

let effects = {
  neon: false,
  pixel: false
};

/* ================= STAFF =============================================== */

let staffCodes = {
  "Adm13062013/*/": "Admin",
  "Modo19062026//*": "Modérateur"
};

let isStaff = false;
let staffRole = null;

let mutedUsers = [];
let bannedUsers = [];
let reports = [];

function openStaffLogin() {
  document.getElementById("staffPopup").classList.remove("hidden");
}

function loginStaff() {
  const code = document.getElementById("staffCode").value;

  if (staffCodes[code]) {
    isStaff = true;
    staffRole = staffCodes[code];

    if (staffRole === "Admin") {
      profile.name = "ᦠ" + profile.name;
    } else {
      profile.name = "⏾" + profile.name;
    }

    alert("Connecté en tant que " + staffRole);
    document.getElementById("staffPopup").classList.add("hidden");
  } else {
    alert("Code invalide");
  }

  document.getElementById("staffCode").value = "";
}

function blockUser(name) {
  if (!blocked.includes(name)) {
    blocked.push(name);
  }
  displayMessages();
}

function unblockUser(name) {
  blocked = blocked.filter(u => u !== name);
  displayMessages();
}

function muteUser(name) {
  if (!mutedUsers.includes(name)) {
    mutedUsers.push(name);
  }
  addLog(name + " a été mute");
}

function banUser(name) {
  if (!bannedUsers.includes(name)) {
    bannedUsers.push(name);
  }

  rooms[currentRoom] = rooms[currentRoom].filter(msg => msg.user !== name);

  addLog(name + " a été banni");
  displayMessages();
}

/* ======= Profil ================================================================ */

function updateUsers() {
  const list = document.getElementById("users");
  list.innerHTML = "";

  users.forEach(user => {
    const li = document.createElement("li");

    li.style.color = user.color;
    li.textContent = user.name;

    list.appendChild(li);
  });
}

function saveProfile() {
  const nameInput = document.getElementById("pseudo");
  const colorInput = document.getElementById("color");

  if (!nameInput || !colorInput) {
    console.error("Inputs profil introuvables");
    return;
  }

  let name = nameInput.value.trim();
  let color = colorInput.value.trim();

  // sécurité staff
  if (name.startsWith("⏾") || name.startsWith("ᦠ")) {
    alert("Symbole réservé au staff !");
    return;
  }

  if (!name) {
    alert("Pseudo requis");
    return;
  }

  if (!/^#[0-9A-F]{6}$/i.test(color)) {
    alert("Couleur invalide (format #RRGGBB)");
    return;
  }

  profile.name = name;
  profile.color = color;

  if (!users.find(u => u.name === name)) {
    users.push(profile);
  }

  updateUsers();

  console.log("Profil enregistré :", profile);

  alert("Profile updated");
}

/* CODES DE PROFIL ============================================================== */
let effect = null; // effet actif = 1
let gradientColors = null;


function applyCode() {
  const code = document.getElementById("codeInput").value;

  if (code === "N30N") effects.neon = true;
  if (code === "MCPX") effects.pixel = true;
  if (code === "GR34") effects.gradient = true;

  alert("Code has been activated");
}

/* EFFETS CODES PROFIL */

if (effects.gradient) {
  name.style.background = "linear-gradient(90deg, #3b82f6, #9333ea)";
  name.style.webkitBackgroundClip = "text";
  name.style.color = "transparent";
}

let effect = null;
let effectData = {};

function applyCode() {
  const code = document.getElementById("codeInput").value;

  // reset
  effect = null;
  effectData = {};

  // NEON SIMPLE
  if (code === "N30N") {
    const color = prompt("Couleur du néon (HEX)");

    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      alert("Wrong color");
      return;
    }

    effect = "neon";
    effectData.color = color;
  }

  //  PIXEL tah MC tu sais
  else if (code === "MCPX") {
    effect = "pixel";
  }

  // DOUBLE NEON DIAGONAL
  else if (code === "DNE0N") {
    const c1 = prompt("Première couleur HEX");
    const c2 = prompt("Deuxième couleur HEX");

    if (
      !/^#[0-9A-F]{6}$/i.test(c1) ||
      !/^#[0-9A-F]{6}$/i.test(c2)
    ) {
      alert("Couleurs invalides !");
      return;
    }

    effect = "doubleNeon";
    effectData.colors = [c1, c2];
  }

  else {
    alert("Code isn't working");
    return;
  }

  alert("Effect on");
}



/* ======= OUTILS STAFF ========================================================= */
let dms = {};
let currentDM = null;

function openUserMenu(username) {
  let options = "1: Message privé\n2: Block\n3: Unblock";

  if (isStaff) options += "\n4: Mute";
  if (staffRole === "Admin") options += "\n5: Ban";

  const action = prompt("Action sur " + username + "\n" + options);

  if (action === "1") startDM(username);
  if (action === "2") blockUser(username);
  if (action === "3") unblockUser(username);
  if (action === "4" && isStaff) muteUser(username);
  if (action === "5" && staffRole === "Admin") banUser(username);
}

function startDM(user) {
  currentDM = user;

  if (!dms[user]) {
    dms[user] = [];
  }

  document.getElementById("roomTitle").textContent = "DM : " + user;

  displayDM();
}

/* les DM========================================================== */

function displayDM() {
  const container = document.getElementById("messages");
  container.innerHTML = "";

  dms[currentDM].forEach(msg => {
    const div = document.createElement("div");
    div.textContent = msg.user + " : " + msg.text;
    container.appendChild(div);
  });
}




/* ======= LOGS ======= */
function addLog(text) {
  rooms["logs"].push({
    user: "SYSTEM",
    color: "#60a5fa",
    text: text,
    time: Date.now()
  });
}


function toggleReport() {
  document.getElementById("reportPopup").classList.toggle("hidden");
}

function sendReport() {
  const user = document.getElementById("reportUser").value;
  const msg = document.getElementById("reportMsg").value;

  if (!user || !msg) return alert("Champs requis");

  reports.push({ user, msg });

  addLog("Report sur " + user + " : " + msg);

  document.getElementById("reportUser").value = "";
  document.getElementById("reportMsg").value = "";

  alert("Report envoyé");
  toggleReport();
}

/* ======= MESSAGES ========================================================= */

function updateRoomHeader() {
  const title = document.getElementById("roomTitle");
  const count = document.getElementById("roomCount");

  if (!title || !count) return;

  title.textContent = currentRoom;

  const usersCount = roomUsers[currentRoom]
    ? roomUsers[currentRoom].length
    : 0;

  count.textContent = usersCount + " user(s)";
}

/* FONCTION DISPLAY MESSAGE */
function displayMessages() {
  if (msg.user === profile.name) {

  //  NEON simple (couleur personnalisée)
  if (effect === "neon") {
    name.style.textShadow = `
      0 0 5px ${effectData.color},
      0 0 10px ${effectData.color},
      0 0 20px ${effectData.color}
    `;
  }

  //  PIXEL
  if (effect === "pixel") {
    name.style.fontFamily = "'Courier New', monospace";
    name.style.letterSpacing = "1px";
  }

  //  DOUBLE NEON DIAGONAL
  if (effect === "doubleNeon") {
    const [c1, c2] = effectData.colors;

    name.style.textShadow = `
      2px -2px 8px ${c1},
     -2px 2px 8px ${c2}
    `;
  }
}

  const container = document.getElementById("messages");
  container.innerHTML = "";

  if (!rooms[currentRoom]) return;
  if (currentRoom === "logs" && !isStaff) return;

  rooms[currentRoom].forEach(msg => {
    if (blocked.includes(msg.user)) return;

    const div = document.createElement("div");
    div.classList.add("message");

    const isMe = msg.user === profile.name;
    div.classList.add(isMe ? "me" : "other");

    const name = document.createElement("span");
    name.textContent = msg.user;
    name.style.color = msg.color;
    name.style.cursor = "pointer";

    name.onclick = () => openUserMenu(msg.user);

    div.appendChild(name);
    div.innerHTML += " : " + msg.text;

    container.appendChild(div);
  });
}

function sendMessage() {
  const input = document.getElementById("messageInput");

  if (!input) return;

  const text = input.value.trim();

  if (!text) return;

  if (mutedUsers.includes(profile.name)) {
    alert("Vous êtes mute !");
    return;
  }

  if (bannedUsers.includes(profile.name)) {
    alert("Vous êtes banni !");
    return;
  }

  //  DM
  if (currentDM) {
    if (!dms[currentDM]) dms[currentDM] = [];

    dms[currentDM].push({
      user: profile.name,
      text: text
    });

    input.value = "";
    displayDM();
    return;
  }

  //  salon normal
  if (!rooms[currentRoom]) {
    rooms[currentRoom] = [];
  }

  rooms[currentRoom].push({
    user: profile.name,
    color: profile.color,
    text: text,
    time: Date.now()
  });

  input.value = "";
  displayMessages();
}
``

function selectRoom(room) {
  if (!room) return;

  if (room === "logs" && !isStaff) {
    alert("Accès réservé au staff");
    return;
  }

  if (currentRoom === room) return;

  currentRoom = room;

  if (!rooms[currentRoom]) {
    rooms[currentRoom] = [];
  }

  updateRoomHeader();
  displayMessages();
}

/* Time's up */

function checkAutoDelete() {
  const now = Date.now();

  rooms[currentRoom] = rooms[currentRoom].filter(msg => {
    const age = now - msg.time;

    // 1h55 → warning
    if (age > 6900000 && !msg.warned) {
      msg.warned = true;

      addSystemMessage("SYSTEM : messages will be deleted in 5min");
    }

    return age < 7200000; // 2h
  });
}

function addSystemMessage(text) {
  rooms[currentRoom].push({
    user: "SYSTEM",
    color: "#60a5fa",
    text: text,
    time: Date.now()
  });
}


/* Creation de room =====================================================*/
function createRoom() {
  const name = prompt("Nom du salon");

  if (!name) return;

  if (rooms[name]) {
    alert("Salon déjà existant");
    return;
  }

  rooms[name] = [];
  roomUsers[name] = [];

  const btn = document.createElement("button");
  btn.textContent = name;
  btn.onclick = () => selectRoom(name);

  document.querySelector(".rooms").appendChild(btn);
}
