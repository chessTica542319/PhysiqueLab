document.addEventListener("DOMContentLoaded", () => {
    const bmiDrawer = document.getElementById("bmi-info-drawer");
    const drawerTitle = document.getElementById("drawer-title");
    const drawerContent = document.getElementById("drawer-content");

    const strengthForm = document.getElementById("strength-form");
    const pushupsInput = document.getElementById("pushups-input");
    const strengthHistoryBody = document.getElementById("strength-history-body");
    const selectAllStrengthCb = document.getElementById("select-all-strength");
    const deleteStrengthBtn = document.getElementById("delete-strength-btn");

    const strengthChartWrapper = document.getElementById("strength-chart-wrapper");
    const toggleStrengthChartBtn = document.getElementById("toggle-strength-chart-btn");
    const strengthCanvasContainer = document.getElementById("strength-canvas-container");
    const strengthCtx = document.getElementById("strength-chart");
    let strengthChartInstance = null;

    const strengthAdvice = {
        "Superhuman": { 
            title: "CYBORG DETECTED", 
            text: "Okay, either you are a literal machine, Saitama from One Punch Man, or you fell asleep on the keyboard. If this is real, please spare us when the robot uprising begins.", 
            color: "#aa66cc" 
        },
        "Excellent": { 
            title: "ELITE STRENGTH", 
            text: "Amazing push-up max! Your upper body strength and core stability are top-tier. Keep challenging yourself with variations like diamond or decline push-ups.", 
            color: "#00C851" 
        },
        "Good": { 
            title: "SOLID STRENGTH", 
            text: "Great upper body strength! You are well above average. Keep pushing your limits to hit that Elite level.", 
            color: "#33b5e5" 
        },
        "Average": { 
            title: "AVERAGE STRENGTH", 
            text: "You have a solid foundation. To increase your numbers, try doing 3 sets of push-ups to failure twice a week.", 
            color: "#ffbb33" 
        },
        "Below Average": { 
            title: "BUILDING STRENGTH", 
            text: "Everyone starts somewhere! If standard push-ups are tough, start with knee push-ups or wall push-ups to build your chest and tricep strength safely.", 
            color: "#ff4444" 
        }
    };

    function getStrengthCategory(reps) {
        if (reps >= 350) return { text: "Superhuman", color: "#aa66cc" };
        if (reps >= 40) return { text: "Excellent", color: "#00C851" };
        if (reps >= 25) return { text: "Good", color: "#33b5e5" };
        if (reps >= 15) return { text: "Average", color: "#ffbb33" };
        return { text: "Below Average", color: "#ff4444" };
    }

    function updateStrengthChart() {
        if (!strengthCtx) return;
        const userData = getUserData();
        const logs = userData.strengthLogs || [];

        if (logs.length === 0) {
            if (strengthChartWrapper) strengthChartWrapper.style.display = "none";
            return;
        }

        if (strengthChartWrapper) strengthChartWrapper.style.display = "block";

        const labels = logs.map(log => log.date);
        const data = logs.map(log => log.reps);

        if (strengthChartInstance) strengthChartInstance.destroy();

        strengthChartInstance = new Chart(strengthCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Max Push-ups',
                    data: data,
                    backgroundColor: 'rgba(51, 181, 229, 0.5)',
                    borderColor: '#33b5e5',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 0,
                layout: { padding: { top: 10, bottom: 10, left: 5, right: 5 } },
                plugins: { legend: { display: false } }, 
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                    x: { grid: { display: false }, ticks: { color: '#888' } }
                }
            }
        });
    }

    if (toggleStrengthChartBtn && strengthCanvasContainer) {
        toggleStrengthChartBtn.addEventListener("click", () => {
            if (strengthCanvasContainer.style.display === "none") {
                strengthCanvasContainer.style.display = "block";
                toggleStrengthChartBtn.innerText = "HIDE CHART";
            } else {
                strengthCanvasContainer.style.display = "none";
                toggleStrengthChartBtn.innerText = "SHOW CHART";
            }
        });
    }

    function renderStrengthTable() {
        if (!strengthHistoryBody) return;
        const userData = getUserData();
        const logs = userData.strengthLogs || [];
        
        strengthHistoryBody.innerHTML = "";
        if (selectAllStrengthCb) selectAllStrengthCb.checked = false;
        
        if (logs.length === 0) {
            strengthHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No strength data logged yet.</td></tr>`;
            updateStrengthChart();
            return;
        }
        
        [...logs].reverse().forEach((log, reversedIndex) => {
            const trueIndex = logs.length - 1 - reversedIndex;
            const category = getStrengthCategory(log.reps);
            
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid var(--border)";
            tr.innerHTML = `
                <td style="padding: 10px;"><input type="checkbox" class="row-cb-strength" data-index="${trueIndex}"></td>
                <td style="padding: 10px;">${log.date}</td>
                <td style="padding: 10px; font-weight: bold;">${log.reps}</td>
                <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
                    ${category.text.toUpperCase()}
                    <button type="button" class="info-icon-btn strength-info-btn" data-category="${category.text}">
                        <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </button>
                </td>
            `;
            strengthHistoryBody.appendChild(tr);
        });
        
        const rowCbs = document.querySelectorAll(".row-cb-strength");
        if (selectAllStrengthCb) {
            rowCbs.forEach(cb => cb.addEventListener("change", () => {
                selectAllStrengthCb.checked = Array.from(rowCbs).every(c => c.checked);
            }));
        }
        updateStrengthChart();
    }

    if (strengthForm) {
        renderStrengthTable();
        strengthForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const reps = parseInt(pushupsInput.value);
            if (reps <= 0) return alert("Please enter a valid number of reps.");
            
            const userData = getUserData();
            if (!userData.strengthLogs) userData.strengthLogs = [];
            userData.strengthLogs.push({ date: new Date().toLocaleDateString(), reps: reps });
            
            saveUserData(userData);
            strengthForm.reset();
            renderStrengthTable();
        });

        if (selectAllStrengthCb) {
            selectAllStrengthCb.addEventListener("change", (e) => {
                document.querySelectorAll(".row-cb-strength").forEach(cb => cb.checked = e.target.checked);
            });
        }

        if (deleteStrengthBtn) {
            deleteStrengthBtn.setAttribute("type", "button");
            deleteStrengthBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const selectedRows = document.querySelectorAll(".row-cb-strength:checked");
                if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
                
                if (confirm("Delete selected strength records?")) {
                    const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
                    const userData = getUserData();
                    userData.strengthLogs = userData.strengthLogs.filter((_, index) => !indicesToDelete.includes(index));
                    saveUserData(userData);
                    renderStrengthTable();
                }
            });
        }
    }

    if (strengthHistoryBody) {
        strengthHistoryBody.addEventListener("click", (e) => {
            const btn = e.target.closest(".strength-info-btn");
            if (!btn) return;
            const advice = strengthAdvice[btn.getAttribute("data-category")];
            if (advice && bmiDrawer) {
                drawerTitle.innerText = advice.title;
                drawerTitle.style.color = advice.color;
                drawerContent.innerText = advice.text;
                bmiDrawer.classList.add("open");
            }
        });
    }

    const enduranceForm = document.getElementById("endurance-form");
    const plankInput = document.getElementById("plank-input");
    const enduranceHistoryBody = document.getElementById("endurance-history-body");
    const selectAllEnduranceCb = document.getElementById("select-all-endurance");
    const deleteEnduranceBtn = document.getElementById("delete-endurance-btn");
    
    const enduranceChartWrapper = document.getElementById("endurance-chart-wrapper");
    const toggleEnduranceChartBtn = document.getElementById("toggle-endurance-chart-btn");
    const enduranceCanvasContainer = document.getElementById("endurance-canvas-container");
    const enduranceCtx = document.getElementById("endurance-chart");
    let enduranceChartInstance = null;

    const enduranceAdvice = {
        "Superhuman": { 
            title: "GRAVITY DEFIED", 
            text: "Did time stop? Are you still in the plank right now? Legends say you are holding the Earth together. (But seriously, if you actually held a plank for this long, please call Guinness World Records).", 
            color: "#aa66cc" 
        },
        "Excellent": { 
            title: "IRON CORE", 
            text: "Over 2 minutes! Your core stability and muscular endurance are exceptional. Try adding weight plates or lifting one limb to increase difficulty.", 
            color: "#00C851" 
        },
        "Good": { 
            title: "SOLID ENDURANCE", 
            text: "Great job holding that plank! Your core is very strong. Keep practicing to reach that elite 2-minute mark.", 
            color: "#33b5e5" 
        },
        "Average": { 
            title: "AVERAGE ENDURANCE", 
            text: "Good foundation. To improve, try doing 3 sets of planks, aiming for 5-10 seconds longer each time.", 
            color: "#ffbb33" 
        },
        "Below Average": { 
            title: "BUILDING ENDURANCE", 
            text: "Core strength takes time! Try doing shorter planks more frequently, or start with knee planks to build up your foundational endurance.", 
            color: "#ff4444" 
        }
    };

    function getEnduranceCategory(seconds) {
        if (seconds >= 10000) return { text: "Superhuman", color: "#aa66cc" };
        if (seconds >= 120) return { text: "Excellent", color: "#00C851" };
        if (seconds >= 60) return { text: "Good", color: "#33b5e5" };
        if (seconds >= 30) return { text: "Average", color: "#ffbb33" };
        return { text: "Below Average", color: "#ff4444" };
    }

    function updateEnduranceChart() {
        if (!enduranceCtx) return;
        const userData = getUserData();
        const logs = userData.enduranceLogs || [];

        if (logs.length === 0) {
            if (enduranceChartWrapper) enduranceChartWrapper.style.display = "none";
            return;
        }

        if (enduranceChartWrapper) enduranceChartWrapper.style.display = "block";

        const labels = logs.map(log => log.date);
        const data = logs.map(log => log.seconds);

        if (enduranceChartInstance) enduranceChartInstance.destroy();

        enduranceChartInstance = new Chart(enduranceCtx, {
            type: 'line', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Plank Time (Seconds)',
                    data: data,
                    borderColor: '#ffbb33',
                    backgroundColor: 'rgba(255, 187, 51, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 0,
                layout: { padding: { top: 10, bottom: 10, left: 5, right: 5 } },
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                    x: { grid: { display: false }, ticks: { color: '#888' } }
                }
            }
        });
    }

    if (toggleEnduranceChartBtn && enduranceCanvasContainer) {
        toggleEnduranceChartBtn.addEventListener("click", () => {
            if (enduranceCanvasContainer.style.display === "none") {
                enduranceCanvasContainer.style.display = "block";
                toggleEnduranceChartBtn.innerText = "HIDE CHART";
            } else {
                enduranceCanvasContainer.style.display = "none";
                toggleEnduranceChartBtn.innerText = "SHOW CHART";
            }
        });
    }

    function renderEnduranceTable() {
        if (!enduranceHistoryBody) return;
        const userData = getUserData();
        const logs = userData.enduranceLogs || [];
        
        enduranceHistoryBody.innerHTML = "";
        if (selectAllEnduranceCb) selectAllEnduranceCb.checked = false;
        
        if (logs.length === 0) {
            enduranceHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No endurance data logged yet.</td></tr>`;
            updateEnduranceChart();
            return;
        }
        
        [...logs].reverse().forEach((log, reversedIndex) => {
            const trueIndex = logs.length - 1 - reversedIndex;
            const category = getEnduranceCategory(log.seconds);
            
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid var(--border)";
            tr.innerHTML = `
                <td style="padding: 10px;"><input type="checkbox" class="row-cb-endurance" data-index="${trueIndex}"></td>
                <td style="padding: 10px;">${log.date}</td>
                <td style="padding: 10px; font-weight: bold;">${log.seconds}s</td>
                <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
                    ${category.text.toUpperCase()}
                    <button type="button" class="info-icon-btn endurance-info-btn" data-category="${category.text}">
                        <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </button>
                </td>
            `;
            enduranceHistoryBody.appendChild(tr);
        });
        
        const rowCbs = document.querySelectorAll(".row-cb-endurance");
        if (selectAllEnduranceCb) {
            rowCbs.forEach(cb => cb.addEventListener("change", () => {
                selectAllEnduranceCb.checked = Array.from(rowCbs).every(c => c.checked);
            }));
        }
        updateEnduranceChart();
    }

    if (enduranceForm) {
        renderEnduranceTable();
        enduranceForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const seconds = parseInt(plankInput.value);
            if (seconds <= 0) return alert("Please enter a valid time in seconds.");
            
            const userData = getUserData();
            if (!userData.enduranceLogs) userData.enduranceLogs = [];
            userData.enduranceLogs.push({ date: new Date().toLocaleDateString(), seconds: seconds });
            
            saveUserData(userData);
            enduranceForm.reset();
            renderEnduranceTable();
        });

        if (selectAllEnduranceCb) {
            selectAllEnduranceCb.addEventListener("change", (e) => {
                document.querySelectorAll(".row-cb-endurance").forEach(cb => cb.checked = e.target.checked);
            });
        }

        if (deleteEnduranceBtn) {
            deleteEnduranceBtn.setAttribute("type", "button");
            deleteEnduranceBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const selectedRows = document.querySelectorAll(".row-cb-endurance:checked");
                if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
                
                if (confirm("Delete selected endurance records?")) {
                    const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
                    const userData = getUserData();
                    userData.enduranceLogs = userData.enduranceLogs.filter((_, index) => !indicesToDelete.includes(index));
                    saveUserData(userData);
                    renderEnduranceTable();
                }
            });
        }
    }

    if (enduranceHistoryBody) {
        enduranceHistoryBody.addEventListener("click", (e) => {
            const btn = e.target.closest(".endurance-info-btn");
            if (!btn) return;
            const advice = enduranceAdvice[btn.getAttribute("data-category")];
            if (advice && bmiDrawer) {
                drawerTitle.innerText = advice.title;
                drawerTitle.style.color = advice.color;
                drawerContent.innerText = advice.text;
                bmiDrawer.classList.add("open");
            }
        });
    }
});