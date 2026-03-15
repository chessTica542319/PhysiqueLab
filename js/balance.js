document.addEventListener("DOMContentLoaded", () => {
  const balanceForm = document.getElementById("balance-form");
  const balanceInput = document.getElementById("balance-input");
  const balanceHistoryBody = document.getElementById("balance-history-body");
  const selectAllBalanceCb = document.getElementById("select-all-balance");
  const deleteBalanceBtn = document.getElementById("delete-balance-btn");
  
  const chartWrapper = document.getElementById("balance-chart-wrapper");
  const toggleChartBtn = document.getElementById("toggle-balance-chart-btn");
  const canvasContainer = document.getElementById("balance-canvas-container");
  const ctx = document.getElementById("balance-chart");
  let chartInstance = null;
  
  const bmiDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");
  
  const balanceAdvice = {
    "Superhuman": {
      title: "FLAMINGO GENETICS",
      text: "Are you a literal statue? A ninja master? The level of proprioception you have is unnatural. A hurricane couldn't knock you over.",
      color: "#aa66cc"
    },
    "Excellent": {
      title: "ELITE BALANCE",
      text: "Outstanding! Your core stability and ankle strength are top-tier. You have excellent neuromuscular control.",
      color: "#00C851"
    },
    "Good": {
      title: "SOLID BALANCE",
      text: "Great job! You have very good body awareness and stability. Try practicing with your eyes closed to challenge yourself further.",
      color: "#33b5e5"
    },
    "Average": {
      title: "AVERAGE BALANCE",
      text: "You have a normal baseline. To improve, try incorporating single-leg exercises like Bulgarian split squats into your routine.",
      color: "#ffbb33"
    },
    "Below Average": {
      title: "BUILDING BALANCE",
      text: "Balance takes practice! Start by just standing on one flat foot (no tiptoes) while brushing your teeth to build ankle stability.",
      color: "#ff4444"
    }
  };
  
  function getBalanceCategory(seconds) {
    if (seconds >= 300) return { text: "Superhuman", color: "#aa66cc" };
    if (seconds >= 50) return { text: "Excellent", color: "#00C851" };
    if (seconds >= 40) return { text: "Good", color: "#33b5e5" };
    if (seconds >= 25) return { text: "Average", color: "#ffbb33" };
    return { text: "Below Average", color: "#ff4444" };
  }
  
  function updateChart() {
    if (!ctx) return;
    const userData = getUserData();
    const logs = userData.balanceLogs || [];
    
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
          label: 'Balance Time (s)',
          data: data,
          borderColor: '#00C851',
          backgroundColor: 'rgba(0, 200, 81, 0.1)',
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
    if (!balanceHistoryBody) return;
    const userData = getUserData();
    const logs = userData.balanceLogs || [];
    
    balanceHistoryBody.innerHTML = "";
    if (selectAllBalanceCb) selectAllBalanceCb.checked = false;
    
    if (logs.length === 0) {
      balanceHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No balance data logged yet.</td></tr>`;
      updateChart();
      return;
    }
    
    [...logs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = logs.length - 1 - reversedIndex;
      const category = getBalanceCategory(log.seconds);
      
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";
      tr.innerHTML = `
        <td style="padding: 10px;"><input type="checkbox" class="row-cb-balance" data-index="${trueIndex}"></td>
        <td style="padding: 10px;">${log.date}</td>
        <td style="padding: 10px; font-weight: bold;">${log.seconds}s</td>
        <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
          ${category.text.toUpperCase()}
          <button type="button" class="info-icon-btn balance-info-btn" data-category="${category.text}">
            <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </td>
      `;
      balanceHistoryBody.appendChild(tr);
    });
    
    const rowCbs = document.querySelectorAll(".row-cb-balance");
    if (selectAllBalanceCb) {
      rowCbs.forEach(cb => cb.addEventListener("change", () => {
        selectAllBalanceCb.checked = Array.from(rowCbs).every(c => c.checked);
      }));
    }
    updateChart();
  }
  
  if (balanceForm) {
    renderTable();
    balanceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const seconds = parseInt(balanceInput.value);
      if (seconds <= 0) return alert("Please enter a valid time.");
      
      const userData = getUserData();
      if (!userData.balanceLogs) userData.balanceLogs = [];
      userData.balanceLogs.push({ date: new Date().toLocaleDateString(), seconds: seconds });
      
      saveUserData(userData);
      balanceForm.reset();
      renderTable();
    });
    
    if (selectAllBalanceCb) {
      selectAllBalanceCb.addEventListener("change", (e) => {
        document.querySelectorAll(".row-cb-balance").forEach(cb => cb.checked = e.target.checked);
      });
    }
    
    if (deleteBalanceBtn) {
      deleteBalanceBtn.setAttribute("type", "button");
      deleteBalanceBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedRows = document.querySelectorAll(".row-cb-balance:checked");
        if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
        
        if (confirm("Delete selected balance records?")) {
          const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
          const userData = getUserData();
          userData.balanceLogs = userData.balanceLogs.filter((_, index) => !indicesToDelete.includes(index));
          saveUserData(userData);
          renderTable();
        }
      });
    }
  }
  
  if (balanceHistoryBody) {
    balanceHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".balance-info-btn");
      if (!btn) return;
      const advice = balanceAdvice[btn.getAttribute("data-category")];
      if (advice && bmiDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        bmiDrawer.classList.add("open");
      }
    });
  }
});