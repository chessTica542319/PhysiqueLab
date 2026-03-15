// Shared Global Utilities
const currentUser = sessionStorage.getItem("currentUser");

function getUserData() {
    const users = JSON.parse(localStorage.getItem("physiqueUsers") || "{}");
    return users[currentUser] || {};
}

function saveUserData(userData) {
    const users = JSON.parse(localStorage.getItem("physiqueUsers") || "{}");
    users[currentUser] = userData;
    localStorage.setItem("physiqueUsers", JSON.stringify(users));
}

// Main App Core UI & Auth
document.addEventListener("DOMContentLoaded", () => {
    
    // Strict Route Protection
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    
    if (isAuthenticated !== "true" || !currentUser) {
        window.location.replace("index.html");
        return;
    }
    
    // Personalize Dashboard
    const welcomeMsg = document.getElementById("welcome-msg");
    if (welcomeMsg) {
        welcomeMsg.innerText = `WELCOME, ${currentUser.toUpperCase()}`;
    }
    
    // Logout Functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.clear();
            window.location.replace("index.html");
        });
    }
    
    // SaaS Menu Tab Switching
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".content-section");
    
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
            
            sections.forEach(section => section.classList.remove("active"));
            
            const targetId = item.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        });
    });
    
    // Mobile Sidebar Slide Animation
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.querySelector(".sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    
    function toggleMobileMenu() {
        sidebar.classList.toggle("open");
        sidebarOverlay.classList.toggle("active");
    }
    
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener("click", toggleMobileMenu);
        sidebarOverlay.addEventListener("click", toggleMobileMenu);
        
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                if (window.innerWidth <= 850) {
                    sidebar.classList.remove("open");
                    sidebarOverlay.classList.remove("active");
                }
            });
        });
    }
    
    // Change Password Logic
    const changePwdForm = document.getElementById("change-pwd-form");
    const pwdMsg = document.getElementById("pwd-msg");
    const changePwdBtn = document.getElementById("change-pwd-btn");
    const currentPwdInput = document.getElementById("current-pwd");
    const newPwdInput = document.getElementById("new-pwd");
    const confirmPwdInput = document.getElementById("confirm-pwd");
    
    if (currentPwdInput) currentPwdInput.addEventListener("input", () => pwdMsg.innerText = "");
    if (newPwdInput) newPwdInput.addEventListener("input", () => pwdMsg.innerText = "");
    if (confirmPwdInput) confirmPwdInput.addEventListener("input", () => pwdMsg.innerText = "");
    
    if (changePwdForm) {
        changePwdForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (changePwdBtn.disabled) return;
            
            const currentPwd = currentPwdInput.value;
            const newPwd = newPwdInput.value;
            const confirmPwd = confirmPwdInput.value;
            
            pwdMsg.style.color = "var(--error)";
            pwdMsg.innerText = "";
            
            if (newPwd !== confirmPwd) {
                pwdMsg.innerText = "New passwords do not match.";
                return;
            }
            
            changePwdBtn.disabled = true;
            const originalText = changePwdBtn.innerText;
            changePwdBtn.innerText = "VERIFYING...";
            
            try {
                const users = JSON.parse(localStorage.getItem("physiqueUsers") || "{}");
                const user = users[currentUser];
                
                if (!user) {
                    pwdMsg.innerText = "Fatal error: User account not found.";
                    return;
                }
                
                const hashedCurrent = await hashPassword(currentPwd);
                if (user.hash !== hashedCurrent) {
                    pwdMsg.innerText = "Current password is incorrect.";
                    return;
                }
                
                const hashedNew = await hashPassword(newPwd);
                users[currentUser].hash = hashedNew;
                localStorage.setItem("physiqueUsers", JSON.stringify(users));
                
                pwdMsg.style.color = "#00C851";
                pwdMsg.innerText = "Password successfully updated!";
                changePwdForm.reset();
                
            } catch (error) {
                console.error("Password Update Error:", error);
                pwdMsg.innerText = "A system error occurred. Please try again.";
            } finally {
                changePwdBtn.disabled = false;
                changePwdBtn.innerText = originalText;
            }
        });
    }
    
    // Dashboard Password Visibility Toggles
    const togglePasswordBtns = document.querySelectorAll(".toggle-password-btn");
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const wrapper = this.closest('.password-wrapper');
            const input = wrapper.querySelector('input');
            const eyeIcon = this.querySelector('.eye-icon');
            
            const isPassword = input.getAttribute("type") === "password";
            input.setAttribute("type", isPassword ? "text" : "password");
            
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
    });
    
    // Shared Drawer Close Logic
    const sharedDrawer = document.getElementById("bmi-info-drawer");
    const closeDrawerBtn = document.getElementById("close-drawer-btn");
    
    if (closeDrawerBtn && sharedDrawer) {
        closeDrawerBtn.addEventListener("click", () => {
            sharedDrawer.classList.remove("open");
        });
    }
    
    // Drag-to-Scroll Logic for Tables
    const tableContainer = document.querySelector('.table-responsive');
    let isDown = false;
    let startX;
    let scrollLeft;
    
    if (tableContainer) {
        tableContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            tableContainer.style.cursor = 'grabbing';
            startX = e.pageX - tableContainer.offsetLeft;
            scrollLeft = tableContainer.scrollLeft;
        });
        
        tableContainer.addEventListener('mouseleave', () => {
            isDown = false;
            tableContainer.style.cursor = 'grab';
        });
        
        tableContainer.addEventListener('mouseup', () => {
            isDown = false;
            tableContainer.style.cursor = 'grab';
        });
        
        tableContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - tableContainer.offsetLeft;
            const walk = (x - startX) * 2;
            tableContainer.scrollLeft = scrollLeft - walk;
        });
    }
});