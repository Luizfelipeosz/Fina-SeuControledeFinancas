// === Seleção de elementos ===
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const recoverForm = document.getElementById("recover-form");

const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const forgotPassword = document.getElementById("forgot-password");
const backToLogin = document.getElementById("back-to-login");

// === Alternância entre telas ===

// Mostrar cadastro
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  recoverForm.classList.add("hidden");
});

// Voltar ao login
showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  recoverForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Mostrar recuperação de senha
forgotPassword.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  recoverForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

// Voltar da recuperação → login
backToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  recoverForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// === Funções auxiliares (LocalStorage) ===
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// === Login ===
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("⚠️ Preencha todos os campos!");
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    alert("❌ Usuário não encontrado ou Email errado. Tente novamente ou Cadastre-se para continuar.");
    return;
  }
  
  if (user.password !== password) {
    alert("❌ Senha incorreta. Tente novamente.");
    return;
  }
  // Salva quem está logado
  localStorage.setItem("loggedUser", user.email);

  // Garante que o usuário tenha seu próprio arquivo de transações
  const key = `fina_transactions_${user.email}`;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify([]));
  }

  alert(`✅ Bem-vindo(a), ${user.name}!`);
  window.location.href = "fina.html";
});

// === Cadastro ===
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim().toLowerCase();
  const password = document.getElementById("register-password").value.trim();

  if (!name || !email || !password) {
    alert("⚠️ Preencha todos os campos!");
    return;
  }

  const users = getUsers();
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    alert("⚠️ Já existe uma conta com esse e-mail. Faça login ou use outro.");
    return;
  }

  users.push({ name, email, password });
  saveUsers(users);

  alert("✅ Conta criada com sucesso! Faça login.");
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// === Recuperação de Senha ===
recoverForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("recover-email").value.trim().toLowerCase();
  const users = getUsers();

  const user = users.find(u => u.email === email);

  if (!user) {
    alert("⚠️ Nenhuma conta encontrada com esse e-mail.");
    return;
  }

  alert(`📩 Um e-mail de recuperação foi enviado para: ${email}
(Exemplo — pois estamos usando localStorage)`);

  recoverForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});
