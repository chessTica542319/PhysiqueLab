document.addEventListener("DOMContentLoaded", () => {
  const speedForm = document.getElementById("speed-form");
  const speedInput = document.getElementById("speed-input");
  const speedHistoryBody = document.getElementById("speed-history-body");
  const selectAllSpeedCb = document.getElementById("select-all-speed");
  const deleteSpeedBtn = document.getElementById("delete-speed-btn");
  
  const chartWrapper = document.getElementById("speed-chart-wrapper");
  const toggleChartBtn = document.getElementById("toggle-speed-chart-btn");
  const canvasContainer = document.getElementById("speed-canvas-container");
  const ctx = document.getElementById("speed-chart");
  let chartInstance = null;
  
  const bmiDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");
  
  const speedAdvice = {
    "Superhuman": {
      title: "THE FLASH",
      text: "Are you tapping into the Speed Force? Did you use a motorcycle? You are literally breaking the sound barrier right now. Leave some speed for the rest of us!",
      color: "#aa66cc"
    },
    "Excellent": {
      title: "ELITE SPRINTER",
      text: "Lightning fast! Your acceleration and top-end speed are phenomenal. Maintain this by incorporating short, max-effort hill sprints into your training.",
      color: "#00C851"
    },
    "Good": {
      title: "SOLID SPEED",
      text: "Great run! You have very good speed mechanics. To shave off a few more fractions of a second, focus on your starting stance and arm drive.",
      color: "#33b5e5"
    },
    "Average": {
      title: "AVERAGE PACE",
      text: "You have a solid baseline. Speed can be improved by strengthening your hamstrings and practicing short 20-meter burst sprints.",
      color: "#ffbb33"
    },
    "Below Average": {
      title: "BUILDING SPEED",
      text: "Everyone runs at their own pace! To get faster, start by improving your running form and building leg strength through squats and lunges.",
      color: "#ff4444"
    }
  };
  
  function getSpeedCategory(seconds) {
    if (seconds <= 5.0) return { text: "Superhuman", color: "#aa66cc" };
    if (seconds <= 6.5) return { text: "Excellent", color: "#00C851" };
    if (seconds <= 7.5) return { text: "Good", color: "#33b5e5" };
    if (seconds <= 8.5) return { text: "Average", color: "#ffbb33" };
    return { text: "Below Average", color: "#ff4444" };
  }
  
  function updateChart() {
    if (!ctx) return;
    const userData = getUserData();
    const logs = userData.speedLogs || [];
    
    if (logs.length === 0) {
      if (chartWrapper) chartWrapper.style.display = "none";
      return;
    }
    
    if (chartWrapper) chartWrapper.style.display = "block";
    
    const labels = logs.map(log => log.date);
    const data = logs.map(log => log.seconds);
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sprint Time (s)',
          data: data,
          borderColor: '#33b5e5',
          backgroundColor: 'rgba(51, 181, 229, 0.1)',
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
          y: {
            reverse: true,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#888' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#888' }
          }
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
    if (!speedHistoryBody) return;
    const userData = getUserData();
    const logs = userData.speedLogs || [];
    
    speedHistoryBody.innerHTML = "";
    if (selectAllSpeedCb) selectAllSpeedCb.checked = false;
    
    if (logs.length === 0) {
      speedHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No speed data logged yet.</td></tr>`;
      updateChart();
      return;
    }
    
    [...logs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = logs.length - 1 - reversedIndex;
      const category = getSpeedCategory(log.seconds);
      
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";
      tr.innerHTML = `
        <td style="padding: 10px;"><input type="checkbox" class="row-cb-speed" data-index="${trueIndex}"></td>
        <td style="padding: 10px;">${log.date}</td>
        <td style="padding: 10px; font-weight: bold;">${log.seconds}s</td>
        <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
          ${category.text.toUpperCase()}
          <button type="button" class="info-icon-btn speed-info-btn" data-category="${category.text}">
            <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </td>
      `;
      speedHistoryBody.appendChild(tr);
    });
    
    const rowCbs = document.querySelectorAll(".row-cb-speed");
    if (selectAllSpeedCb) {
      rowCbs.forEach(cb => cb.addEventListener("change", () => {
        selectAllSpeedCb.checked = Array.from(rowCbs).every(c => c.checked);
      }));
    }
    updateChart();
  }
  
  if (speedForm) {
    renderTable();
    speedForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const seconds = parseFloat(speedInput.value);
      if (seconds <= 0) return alert("Please enter a valid time.");
      
      const userData = getUserData();
      if (!userData.speedLogs) userData.speedLogs = [];
      userData.speedLogs.push({
        date: new Date().toLocaleDateString(),
        seconds: seconds
      });
      
      saveUserData(userData);
      speedForm.reset();
      renderTable();
    });
    
    if (selectAllSpeedCb) {
      selectAllSpeedCb.addEventListener("change", (e) => {
        document.querySelectorAll(".row-cb-speed").forEach(cb => cb.checked = e.target.checked);
      });
    }
    
    if (deleteSpeedBtn) {
      deleteSpeedBtn.setAttribute("type", "button");
      deleteSpeedBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedRows = document.querySelectorAll(".row-cb-speed:checked");
        if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
        
        if (confirm("Delete selected speed records?")) {
          const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
          const userData = getUserData();
          userData.speedLogs = userData.speedLogs.filter((_, index) => !indicesToDelete.includes(index));
          saveUserData(userData);
          renderTable();
        }
      });
    }
  }
  
  if (speedHistoryBody) {
    speedHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".speed-info-btn");
      if (!btn) return;
      const advice = speedAdvice[btn.getAttribute("data-category")];
      if (advice && bmiDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        bmiDrawer.classList.add("open");
      }
    });
  }
});