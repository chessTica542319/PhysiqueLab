document.addEventListener("DOMContentLoaded", () => {
  const powerForm = document.getElementById("power-form");
  const powerInput = document.getElementById("power-input");
  const powerHistoryBody = document.getElementById("power-history-body");
  const selectAllPowerCb = document.getElementById("select-all-power");
  const deletePowerBtn = document.getElementById("delete-power-btn");
  
  const chartWrapper = document.getElementById("power-chart-wrapper");
  const toggleChartBtn = document.getElementById("toggle-power-chart-btn");
  const canvasContainer = document.getElementById("power-canvas-container");
  const ctx = document.getElementById("power-chart");
  let chartInstance = null;
  
  const bmiDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");
  
  const powerAdvice = {
    "Superhuman": {
      title: "KANGAROO GENETICS",
      text: "Are there springs in your shoes?! Jumping over 320cm is literally nearing Olympic broad jump records. You possess terrifying explosive power.",
      color: "#aa66cc"
    },
    "Excellent": {
      title: "EXPLOSIVE POWER",
      text: "Incredible jump! Your fast-twitch muscle fibers are highly developed. Keep doing plyometrics to maintain this elite explosiveness.",
      color: "#00C851"
    },
    "Good": {
      title: "SOLID JUMP",
      text: "Great power output. To push for 'Excellent', try adding box jumps and heavy squats to your routine.",
      color: "#33b5e5"
    },
    "Average": {
      title: "AVERAGE POWER",
      text: "You have a decent baseline. Power requires speed and strength combined. Try adding jump squats and lunges to your workouts.",
      color: "#ffbb33"
    },
    "Below Average": {
      title: "BUILDING POWER",
      text: "Your explosiveness needs a little work. Start with basic lower-body strength training (squats, calf raises) before moving into jumping exercises.",
      color: "#ff4444"
    }
  };
  
  function getPowerCategory(cm) {
    if (cm >= 320) return { text: "Superhuman", color: "#aa66cc" };
    if (cm >= 240) return { text: "Excellent", color: "#00C851" };
    if (cm >= 200) return { text: "Good", color: "#33b5e5" };
    if (cm >= 160) return { text: "Average", color: "#ffbb33" };
    return { text: "Below Average", color: "#ff4444" };
  }
  
  function updateChart() {
    if (!ctx) return;
    const userData = getUserData();
    const logs = userData.powerLogs || [];
    
    if (logs.length === 0) {
      if (chartWrapper) chartWrapper.style.display = "none";
      return;
    }
    
    if (chartWrapper) chartWrapper.style.display = "block";
    
    const labels = logs.map(log => log.date);
    const data = logs.map(log => log.cm);
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Jump Distance (cm)',
          data: data,
          backgroundColor: 'rgba(255, 68, 68, 0.5)',
          borderColor: '#ff4444',
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
  
  if (toggleChartBtn && canvasContainer) {
    toggleChartBtn.addEventListener("click", () => {
      if (canvasContainer.style.display === "none") {
        canvasContainer.style.display = "block";
        toggleChartBtn.innerText = "HIDE CHART";
      } else {
        canvasContainer.style.display = "none";
        toggleChartBtn.innerText = "SHOW CHART";
      }
    });
  }
  
  function renderTable() {
    if (!powerHistoryBody) return;
    const userData = getUserData();
    const logs = userData.powerLogs || [];
    
    powerHistoryBody.innerHTML = "";
    if (selectAllPowerCb) selectAllPowerCb.checked = false;
    
    if (logs.length === 0) {
      powerHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No power data logged yet.</td></tr>`;
      updateChart();
      return;
    }
    
    [...logs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = logs.length - 1 - reversedIndex;
      const category = getPowerCategory(log.cm);
      
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";
      tr.innerHTML = `
        <td style="padding: 10px;"><input type="checkbox" class="row-cb-power" data-index="${trueIndex}"></td>
        <td style="padding: 10px;">${log.date}</td>
        <td style="padding: 10px; font-weight: bold;">${log.cm} cm</td>
        <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
          ${category.text.toUpperCase()}
          <button type="button" class="info-icon-btn power-info-btn" data-category="${category.text}">
            <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </td>
      `;
      powerHistoryBody.appendChild(tr);
    });
    
    const rowCbs = document.querySelectorAll(".row-cb-power");
    if (selectAllPowerCb) {
      rowCbs.forEach(cb => cb.addEventListener("change", () => {
        selectAllPowerCb.checked = Array.from(rowCbs).every(c => c.checked);
      }));
    }
    updateChart();
  }
  
  if (powerForm) {
    renderTable();
    powerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cm = parseInt(powerInput.value);
      if (cm <= 0) return alert("Please enter a valid distance.");
      
      const userData = getUserData();
      if (!userData.powerLogs) userData.powerLogs = [];
      userData.powerLogs.push({ date: new Date().toLocaleDateString(), cm: cm });
      
      saveUserData(userData);
      powerForm.reset();
      renderTable();
    });
    
    if (selectAllPowerCb) {
      selectAllPowerCb.addEventListener("change", (e) => {
        document.querySelectorAll(".row-cb-power").forEach(cb => cb.checked = e.target.checked);
      });
    }
    
    if (deletePowerBtn) {
      deletePowerBtn.setAttribute("type", "button");
      deletePowerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedRows = document.querySelectorAll(".row-cb-power:checked");
        if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
        
        if (confirm("Delete selected power records?")) {
          const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
          const userData = getUserData();
          userData.powerLogs = userData.powerLogs.filter((_, index) => !indicesToDelete.includes(index));
          saveUserData(userData);
          renderTable();
        }
      });
    }
  }
  
  if (powerHistoryBody) {
    powerHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".power-info-btn");
      if (!btn) return;
      const advice = powerAdvice[btn.getAttribute("data-category")];
      if (advice && bmiDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        bmiDrawer.classList.add("open");
      }
    });
  }
});