document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");
  const authBtn = document.getElementById("auth-btn");
  const nicknameInput = document.getElementById("nickname");
  const passwordInput = document.getElementById("master-password");
  const title = document.getElementById("auth-title");
  const errorMsg = document.getElementById("auth-error");
  const toggleBtn = document.getElementById("toggle-mode-btn");
  
  const togglePasswordBtn = document.getElementById("toggle-password-btn");
  const eyeIcon = document.getElementById("eye-icon");
  
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";
    
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    
    if (isPassword) {
      eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
      eyeIcon.style.color = "var(--primary)";
    } else {
      eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
      eyeIcon.style.color = "var(--text-muted)";
    }
  });
  
  function getUsers() {
    return JSON.parse(localStorage.getItem("physiqueUsers") || "{}");
  }
  
  let isLoginMode = Object.keys(getUsers()).length > 0;
  
  function updateUI() {
    errorMsg.innerText = "";
    passwordInput.value = "";
    
    if (isLoginMode) {
      title.innerText = "Unlock Your Vault";
      authBtn.innerText = "Unlock Vault";
      toggleBtn.innerText = "New user? Create a vault here.";
    } else {
      title.innerText = "Create Your Vault";
      authBtn.innerText = "Register Vault";
      toggleBtn.innerText = "Already have a vault? Unlock it here.";
    }
  }
  
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateUI();
  });
  
  nicknameInput.addEventListener("input", () => errorMsg.innerText = "");
  passwordInput.addEventListener("input", () => errorMsg.innerText = "");
  
  updateUI();
  
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nickname = nicknameInput.value.trim();
    const password = passwordInput.value;
    
    if (authBtn.disabled) return;
    
    authBtn.disabled = true;
    const originalBtnText = authBtn.innerText;
    authBtn.innerText = "Processing...";
    errorMsg.innerText = "";
    
    try {
      const hashedInput = await hashPassword(password);
      const users = getUsers();
      
      if (!isLoginMode) {
        if (users[nickname]) {
          errorMsg.innerText = "Nickname taken. Please choose another or unlock.";
          return;
        }
        
        users[nickname] = { hash: hashedInput };
        localStorage.setItem("physiqueUsers", JSON.stringify(users));
        
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("currentUser", nickname);
        window.location.replace("dashboard.html");
        
      } else {
        if (!users[nickname]) {
          errorMsg.innerText = "User not found. Please check your nickname.";
          return;
        }
        
        if (users[nickname].hash === hashedInput) {
          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("currentUser", nickname);
          window.location.replace("dashboard.html");
        } else {
          errorMsg.innerText = "Incorrect password.";
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      errorMsg.innerText = "A system error occurred. Please try again.";
    } finally {
      authBtn.disabled = false;
      authBtn.innerText = originalBtnText;
    }
  });
});