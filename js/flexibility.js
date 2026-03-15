document.addEventListener("DOMContentLoaded", () => {
  const flexibilityForm = document.getElementById("flexibility-form");
  const flexibilityInput = document.getElementById("flexibility-input");
  const flexibilityHistoryBody = document.getElementById("flexibility-history-body");
  const selectAllFlexibilityCb = document.getElementById("select-all-flexibility");
  const deleteFlexibilityBtn = document.getElementById("delete-flexibility-btn");
  
  const chartWrapper = document.getElementById("flexibility-chart-wrapper");
  const toggleChartBtn = document.getElementById("toggle-flexibility-chart-btn");
  const canvasContainer = document.getElementById("flexibility-canvas-container");
  const ctx = document.getElementById("flexibility-chart");
  let chartInstance = null;
  
  const bmiDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");
  
  const flexibilityAdvice = {
    "Superhuman": {
      title: "RUBBER BAND",
      text: "Are you part owl? Do you lack a spine? Your flexibility is so extreme that you could probably fold yourself into a suitcase. Incredible!",
      color: "#aa66cc"
    },
    "Excellent": {
      title: "NINJA FLEXIBILITY",
      text: "Outstanding range of motion! Your hamstrings and lower back are very supple, which greatly reduces your risk of injury.",
      color: "#00C851"
    },
    "Good": {
      title: "SOLID MOBILITY",
      text: "Great job! You have healthy flexibility. Keep doing daily stretches to maintain this range of motion.",
      color: "#33b5e5"
    },
    "Average": {
      title: "AVERAGE REACH",
      text: "You are right in the middle. Try adding 5-10 minutes of dedicated stretching after your workouts while your muscles are warm.",
      color: "#ffbb33"
    },
    "Below Average": {
      title: "TIGHT MUSCLES",
      text: "Your hamstrings and lower back are a bit tight. Don't force it! Start with gentle, dynamic stretches every morning to slowly loosen up.",
      color: "#ff4444"
    }
  };
  
  function getFlexibilityCategory(cm) {
    if (cm >= 60) return { text: "Superhuman", color: "#aa66cc" };
    if (cm >= 38) return { text: "Excellent", color: "#00C851" };
    if (cm >= 28) return { text: "Good", color: "#33b5e5" };
    if (cm >= 15) return { text: "Average", color: "#ffbb33" };
    return { text: "Below Average", color: "#ff4444" };
  }
  
  function updateChart() {
    if (!ctx) return;
    const userData = getUserData();
    const logs = userData.flexibilityLogs || [];
    
    if (logs.length === 0) {
      if (chartWrapper) chartWrapper.style.display = "none";
      return;
    }
    
    if (chartWrapper) chartWrapper.style.display = "block";
    
    const labels = logs.map(log => log.date);
    const data = logs.map(log => log.cm);
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Reach (cm)',
          data: data,
          borderColor: '#9933CC',
          backgroundColor: 'rgba(153, 51, 204, 0.1)',
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
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
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
    if (!flexibilityHistoryBody) return;
    const userData = getUserData();
    const logs = userData.flexibilityLogs || [];
    
    flexibilityHistoryBody.innerHTML = "";
    if (selectAllFlexibilityCb) selectAllFlexibilityCb.checked = false;
    
    if (logs.length === 0) {
      flexibilityHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No flexibility data logged yet.</td></tr>`;
      updateChart();
      return;
    }
    
    [...logs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = logs.length - 1 - reversedIndex;
      const category = getFlexibilityCategory(log.cm);
      
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";
      tr.innerHTML = `
        <td style="padding: 10px;"><input type="checkbox" class="row-cb-flex" data-index="${trueIndex}"></td>
        <td style="padding: 10px;">${log.date}</td>
        <td style="padding: 10px; font-weight: bold;">${log.cm} cm</td>
        <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
          ${category.text.toUpperCase()}
          <button type="button" class="info-icon-btn flex-info-btn" data-category="${category.text}">
            <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </td>
      `;
      flexibilityHistoryBody.appendChild(tr);
    });
    
    const rowCbs = document.querySelectorAll(".row-cb-flex");
    if (selectAllFlexibilityCb) {
      rowCbs.forEach(cb => cb.addEventListener("change", () => {
        selectAllFlexibilityCb.checked = Array.from(rowCbs).every(c => c.checked);
      }));
    }
    updateChart();
  }
  
  if (flexibilityForm) {
    renderTable();
    flexibilityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cm = parseInt(flexibilityInput.value);
      
      const userData = getUserData();
      if (!userData.flexibilityLogs) userData.flexibilityLogs = [];
      userData.flexibilityLogs.push({ date: new Date().toLocaleDateString(), cm: cm });
      
      saveUserData(userData);
      flexibilityForm.reset();
      renderTable();
    });
    
    if (selectAllFlexibilityCb) {
      selectAllFlexibilityCb.addEventListener("change", (e) => {
        document.querySelectorAll(".row-cb-flex").forEach(cb => cb.checked = e.target.checked);
      });
    }
    
    if (deleteFlexibilityBtn) {
      deleteFlexibilityBtn.setAttribute("type", "button");
      deleteFlexibilityBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedRows = document.querySelectorAll(".row-cb-flex:checked");
        if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
        
        if (confirm("Delete selected flexibility records?")) {
          const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
          const userData = getUserData();
          userData.flexibilityLogs = userData.flexibilityLogs.filter((_, index) => !indicesToDelete.includes(index));
          saveUserData(userData);
          renderTable();
        }
      });
    }
  }
  
  if (flexibilityHistoryBody) {
    flexibilityHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".flex-info-btn");
      if (!btn) return;
      const advice = flexibilityAdvice[btn.getAttribute("data-category")];
      if (advice && bmiDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        bmiDrawer.classList.add("open");
      }
    });
  }
});