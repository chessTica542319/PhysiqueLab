document.addEventListener("DOMContentLoaded", () => {
  const coordinationForm = document.getElementById("coordination-form");
  const coordinationInput = document.getElementById("coordination-input");
  const coordinationHistoryBody = document.getElementById("coordination-history-body");
  const selectAllCoordinationCb = document.getElementById("select-all-coordination");
  const deleteCoordinationBtn = document.getElementById("delete-coordination-btn");
  
  const chartWrapper = document.getElementById("coordination-chart-wrapper");
  const toggleChartBtn = document.getElementById("toggle-coordination-chart-btn");
  const canvasContainer = document.getElementById("coordination-canvas-container");
  const ctx = document.getElementById("coordination-chart");
  let chartInstance = null;
  
  const bmiDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");
  
  const coordinationAdvice = {
    "Superhuman": {
      title: "SPIDER-SENSE TINGLING",
      text: "Did a radioactive spider bite you? Catching the ball this many times in 30 seconds means your hands are basically a blur. The circus called, they want their star juggler back.",
      color: "#aa66cc"
    },
    "Excellent": {
      title: "ELITE HAND-EYE",
      text: "Outstanding coordination! Your hand-eye tracking and motor skills are razor-sharp. Keep engaging in racket sports or ball games to maintain this.",
      color: "#00C851"
    },
    "Good": {
      title: "SOLID TRACKING",
      text: "Great job! Your hand-eye coordination is above average. Keep practicing to hit that elite 35+ catches mark.",
      color: "#33b5e5"
    },
    "Average": {
      title: "AVERAGE CATCHER",
      text: "You have a normal baseline for coordination. Doing simple juggling drills or reaction ball exercises can help improve this.",
      color: "#ffbb33"
    },
    "Below Average": {
      title: "BUILDING COORDINATION",
      text: "Coordination is a learned skill! Start by practicing throwing and catching with two hands before switching to the alternate-hand method.",
      color: "#ff4444"
    }
  };
  
  function getCoordinationCategory(catches) {
    if (catches >= 60) return { text: "Superhuman", color: "#aa66cc" };
    if (catches >= 35) return { text: "Excellent", color: "#00C851" };
    if (catches >= 30) return { text: "Good", color: "#33b5e5" };
    if (catches >= 20) return { text: "Average", color: "#ffbb33" };
    return { text: "Below Average", color: "#ff4444" };
  }
  
  function updateChart() {
    if (!ctx) return;
    const userData = getUserData();
    const logs = userData.coordinationLogs || [];
    
    if (logs.length === 0) {
      if (chartWrapper) chartWrapper.style.display = "none";
      return;
    }
    
    if (chartWrapper) chartWrapper.style.display = "block";
    
    const labels = logs.map(log => log.date);
    const data = logs.map(log => log.catches);
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Successful Catches',
          data: data,
          backgroundColor: 'rgba(255, 136, 0, 0.5)',
          borderColor: '#FF8800',
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
    if (!coordinationHistoryBody) return;
    const userData = getUserData();
    const logs = userData.coordinationLogs || [];
    
    coordinationHistoryBody.innerHTML = "";
    if (selectAllCoordinationCb) selectAllCoordinationCb.checked = false;
    
    if (logs.length === 0) {
      coordinationHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No coordination data logged yet.</td></tr>`;
      updateChart();
      return;
    }
    
    [...logs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = logs.length - 1 - reversedIndex;
      const category = getCoordinationCategory(log.catches);
      
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";
      tr.innerHTML = `
        <td style="padding: 10px;"><input type="checkbox" class="row-cb-coordination" data-index="${trueIndex}"></td>
        <td style="padding: 10px;">${log.date}</td>
        <td style="padding: 10px; font-weight: bold;">${log.catches}</td>
        <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
          ${category.text.toUpperCase()}
          <button type="button" class="info-icon-btn coord-info-btn" data-category="${category.text}">
            <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </td>
      `;
      coordinationHistoryBody.appendChild(tr);
    });
    
    const rowCbs = document.querySelectorAll(".row-cb-coordination");
    if (selectAllCoordinationCb) {
      rowCbs.forEach(cb => cb.addEventListener("change", () => {
        selectAllCoordinationCb.checked = Array.from(rowCbs).every(c => c.checked);
      }));
    }
    updateChart();
  }
  
  if (coordinationForm) {
    renderTable();
    coordinationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const catches = parseInt(coordinationInput.value);
      if (catches < 0) return alert("Please enter a valid number of catches.");
      
      const userData = getUserData();
      if (!userData.coordinationLogs) userData.coordinationLogs = [];
      userData.coordinationLogs.push({ date: new Date().toLocaleDateString(), catches: catches });
      
      saveUserData(userData);
      coordinationForm.reset();
      renderTable();
    });
    
    if (selectAllCoordinationCb) {
      selectAllCoordinationCb.addEventListener("change", (e) => {
        document.querySelectorAll(".row-cb-coordination").forEach(cb => cb.checked = e.target.checked);
      });
    }
    
    if (deleteCoordinationBtn) {
      deleteCoordinationBtn.setAttribute("type", "button");
      deleteCoordinationBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedRows = document.querySelectorAll(".row-cb-coordination:checked");
        if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
        
        if (confirm("Delete selected coordination records?")) {
          const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
          const userData = getUserData();
          userData.coordinationLogs = userData.coordinationLogs.filter((_, index) => !indicesToDelete.includes(index));
          saveUserData(userData);
          renderTable();
        }
      });
    }
  }
  
  if (coordinationHistoryBody) {
    coordinationHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".coord-info-btn");
      if (!btn) return;
      const advice = coordinationAdvice[btn.getAttribute("data-category")];
      if (advice && bmiDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        bmiDrawer.classList.add("open");
      }
    });
  }
});