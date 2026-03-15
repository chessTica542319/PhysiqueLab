document.addEventListener("DOMContentLoaded", () => {
  const agilityForm = document.getElementById("agility-form");
  const agilityInput = document.getElementById("agility-input");
  const agilityHistoryBody = document.getElementById("agility-history-body");
  const selectAllAgilityCb = document.getElementById("select-all-agility");
  const deleteAgilityBtn = document.getElementById("delete-agility-btn");
  
  const chartWrapper = document.getElementById("agility-chart-wrapper");
  const toggleChartBtn = document.getElementById("toggle-agility-chart-btn");
  const canvasContainer = document.getElementById("agility-canvas-container");
  const ctx = document.getElementById("agility-chart");
  let chartInstance = null;
  
  const bmiDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");
  
  const agilityAdvice = {
    "Superhuman": {
      title: "TELEPORTER",
      text: "Did you just use Instant Transmission? Moving through a complex cone course this fast breaks the laws of physics. Absolutely unreal.",
      color: "#aa66cc"
    },
    "Excellent": {
      title: "NINJA AGILITY",
      text: "Incredible change of direction! Your body control and deceleration/acceleration mechanics are elite.",
      color: "#00C851"
    },
    "Good": {
      title: "SOLID AGILITY",
      text: "Great run! You maneuvered through the course very well. Incorporate lateral lunges and ladder drills to keep improving.",
      color: "#33b5e5"
    },
    "Average": {
      title: "AVERAGE AGILITY",
      text: "You have a solid baseline. To get faster at changing directions, work on your core stability and try quick cone drills.",
      color: "#ffbb33"
    },
    "Below Average": {
      title: "BUILDING AGILITY",
      text: "Agility takes coordination and strength! Start with slower cone weaves to focus on your footwork and balance before adding speed.",
      color: "#ff4444"
    }
  };
  
  function getAgilityCategory(seconds) {
    if (seconds <= 10.0) return { text: "Superhuman", color: "#aa66cc" };
    if (seconds <= 16.0) return { text: "Excellent", color: "#00C851" };
    if (seconds <= 18.0) return { text: "Good", color: "#33b5e5" };
    if (seconds <= 20.0) return { text: "Average", color: "#ffbb33" };
    return { text: "Below Average", color: "#ff4444" };
  }
  
  function updateChart() {
    if (!ctx) return;
    const userData = getUserData();
    const logs = userData.agilityLogs || [];
    
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
          label: 'Agility Time (s)',
          data: data,
          borderColor: '#ff4444',
          backgroundColor: 'rgba(255, 68, 68, 0.1)',
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
    if (!agilityHistoryBody) return;
    const userData = getUserData();
    const logs = userData.agilityLogs || [];
    
    agilityHistoryBody.innerHTML = "";
    if (selectAllAgilityCb) selectAllAgilityCb.checked = false;
    
    if (logs.length === 0) {
      agilityHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No agility data logged yet.</td></tr>`;
      updateChart();
      return;
    }
    
    [...logs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = logs.length - 1 - reversedIndex;
      const category = getAgilityCategory(log.seconds);
      
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";
      tr.innerHTML = `
        <td style="padding: 10px;"><input type="checkbox" class="row-cb-agility" data-index="${trueIndex}"></td>
        <td style="padding: 10px;">${log.date}</td>
        <td style="padding: 10px; font-weight: bold;">${log.seconds}s</td>
        <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
          ${category.text.toUpperCase()}
          <button type="button" class="info-icon-btn agility-info-btn" data-category="${category.text}">
            <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </td>
      `;
      agilityHistoryBody.appendChild(tr);
    });
    
    const rowCbs = document.querySelectorAll(".row-cb-agility");
    if (selectAllAgilityCb) {
      rowCbs.forEach(cb => cb.addEventListener("change", () => {
        selectAllAgilityCb.checked = Array.from(rowCbs).every(c => c.checked);
      }));
    }
    updateChart();
  }
  
  if (agilityForm) {
    renderTable();
    agilityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const seconds = parseFloat(agilityInput.value);
      if (seconds <= 0) return alert("Please enter a valid time.");
      
      const userData = getUserData();
      if (!userData.agilityLogs) userData.agilityLogs = [];
      userData.agilityLogs.push({
        date: new Date().toLocaleDateString(),
        seconds: seconds
      });
      
      saveUserData(userData);
      agilityForm.reset();
      renderTable();
    });
    
    if (selectAllAgilityCb) {
      selectAllAgilityCb.addEventListener("change", (e) => {
        document.querySelectorAll(".row-cb-agility").forEach(cb => cb.checked = e.target.checked);
      });
    }
    
    if (deleteAgilityBtn) {
      deleteAgilityBtn.setAttribute("type", "button");
      deleteAgilityBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedRows = document.querySelectorAll(".row-cb-agility:checked");
        if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
        
        if (confirm("Delete selected agility records?")) {
          const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
          const userData = getUserData();
          userData.agilityLogs = userData.agilityLogs.filter((_, index) => !indicesToDelete.includes(index));
          saveUserData(userData);
          renderTable();
        }
      });
    }
  }
  
  if (agilityHistoryBody) {
    agilityHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".agility-info-btn");
      if (!btn) return;
      const advice = agilityAdvice[btn.getAttribute("data-category")];
      if (advice && bmiDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        bmiDrawer.classList.add("open");
      }
    });
  }
});