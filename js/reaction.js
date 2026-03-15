document.addEventListener("DOMContentLoaded", () => {
  const reactionForm = document.getElementById("reaction-form");
  const reactionInput = document.getElementById("reaction-input");
  const reactionHistoryBody = document.getElementById("reaction-history-body");
  const selectAllReactionCb = document.getElementById("select-all-reaction");
  const deleteReactionBtn = document.getElementById("delete-reaction-btn");
  
  const chartWrapper = document.getElementById("reaction-chart-wrapper");
  const toggleChartBtn = document.getElementById("toggle-reaction-chart-btn");
  const canvasContainer = document.getElementById("reaction-canvas-container");
  const ctx = document.getElementById("reaction-chart");
  let chartInstance = null;
  
  const bmiDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");
  
  const reactionAdvice = {
    "Superhuman": {
      title: "JEDI REFLEXES",
      text: "Are you using the Force? Catching the ruler this fast is almost predictive. Your central nervous system is firing on all cylinders.",
      color: "#aa66cc"
    },
    "Excellent": {
      title: "NINJA REACTION",
      text: "Incredible reflexes! You process visual information and execute motor commands extremely fast.",
      color: "#00C851"
    },
    "Good": {
      title: "SOLID REFLEXES",
      text: "Great catch! Your reaction time is above average. Engaging in fast-paced sports like table tennis can keep this sharp.",
      color: "#33b5e5"
    },
    "Average": {
      title: "NORMAL REFLEXES",
      text: "You have a normal baseline reaction time. Getting enough sleep and practicing reaction ball drops can improve this.",
      color: "#ffbb33"
    },
    "Below Average": {
      title: "SLOW REFLEXES",
      text: "A bit slow on the draw! Make sure you are well-rested, focus on the ruler, and try again. Practice makes perfect.",
      color: "#ff4444"
    },
    "Missed": {
      title: "COMPLETELY MISSED",
      text: "Whoops! The ruler hit the floor. Don't worry, anticipation is part of the test. Take a breath, keep your eyes on the bottom of the ruler, and try again!",
      color: "#888888"
    }
  };
  
  function getReactionCategory(mm) {
    if (mm === 0) return { text: "Missed", color: "#888888" };
    if (mm <= 3) return { text: "Superhuman", color: "#aa66cc" };
    if (mm <= 120) return { text: "Excellent", color: "#00C851" };
    if (mm <= 160) return { text: "Good", color: "#33b5e5" };
    if (mm <= 210) return { text: "Average", color: "#ffbb33" };
    return { text: "Below Average", color: "#ff4444" };
  }
  
  function updateChart() {
    if (!ctx) return;
    const userData = getUserData();
    const logs = userData.reactionLogs || [];
    
    if (logs.length === 0) {
      if (chartWrapper) chartWrapper.style.display = "none";
      return;
    }
    
    if (chartWrapper) chartWrapper.style.display = "block";
    
    const labels = logs.map(log => log.date);
    const data = logs.map(log => log.mm === 0 ? 300 : log.mm);
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Drop Distance (mm)',
          data: data,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
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
    if (!reactionHistoryBody) return;
    const userData = getUserData();
    const logs = userData.reactionLogs || [];
    
    reactionHistoryBody.innerHTML = "";
    if (selectAllReactionCb) selectAllReactionCb.checked = false;
    
    if (logs.length === 0) {
      reactionHistoryBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No reaction time data logged yet.</td></tr>`;
      updateChart();
      return;
    }
    
    [...logs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = logs.length - 1 - reversedIndex;
      const category = getReactionCategory(log.mm);
      const displayValue = log.mm === 0 ? "Missed" : `${log.mm} mm`;
      
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";
      tr.innerHTML = `
        <td style="padding: 10px;"><input type="checkbox" class="row-cb-reaction" data-index="${trueIndex}"></td>
        <td style="padding: 10px;">${log.date}</td>
        <td style="padding: 10px; font-weight: bold;">${displayValue}</td>
        <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
          ${category.text.toUpperCase()}
          <button type="button" class="info-icon-btn reaction-info-btn" data-category="${category.text}">
            <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        </td>
      `;
      reactionHistoryBody.appendChild(tr);
    });
    
    const rowCbs = document.querySelectorAll(".row-cb-reaction");
    if (selectAllReactionCb) {
      rowCbs.forEach(cb => cb.addEventListener("change", () => {
        selectAllReactionCb.checked = Array.from(rowCbs).every(c => c.checked);
      }));
    }
    updateChart();
  }
  
  if (reactionForm) {
    renderTable();
    reactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const mm = parseInt(reactionInput.value);
      if (mm < 0) return alert("Please enter a valid number.");
      
      const userData = getUserData();
      if (!userData.reactionLogs) userData.reactionLogs = [];
      userData.reactionLogs.push({
        date: new Date().toLocaleDateString(),
        mm: mm
      });
      
      saveUserData(userData);
      reactionForm.reset();
      renderTable();
    });
    
    if (selectAllReactionCb) {
      selectAllReactionCb.addEventListener("change", (e) => {
        document.querySelectorAll(".row-cb-reaction").forEach(cb => cb.checked = e.target.checked);
      });
    }
    
    if (deleteReactionBtn) {
      deleteReactionBtn.setAttribute("type", "button");
      deleteReactionBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedRows = document.querySelectorAll(".row-cb-reaction:checked");
        if (selectedRows.length === 0) return alert("Please select at least one record to delete.");
        
        if (confirm("Delete selected reaction records?")) {
          const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
          const userData = getUserData();
          userData.reactionLogs = userData.reactionLogs.filter((_, index) => !indicesToDelete.includes(index));
          saveUserData(userData);
          renderTable();
        }
      });
    }
  }
  
  if (reactionHistoryBody) {
    reactionHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".reaction-info-btn");
      if (!btn) return;
      const advice = reactionAdvice[btn.getAttribute("data-category")];
      if (advice && bmiDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        bmiDrawer.classList.add("open");
      }
    });
  }
});