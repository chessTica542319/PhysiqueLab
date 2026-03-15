document.addEventListener("DOMContentLoaded", () => {
  const cardioForm = document.getElementById("cardio-form");
  const restingHrInput = document.getElementById("resting-hr-input");
  const postHrInput = document.getElementById("post-hr-input");
  const cardioHistoryBody = document.getElementById("cardio-history-body");
  const selectAllCardioCb = document.getElementById("select-all-cardio");
  const deleteCardioBtn = document.getElementById("delete-cardio-btn");

  const chartWrapper = document.getElementById("cardio-chart-wrapper");
  const toggleChartBtn = document.getElementById("toggle-chart-btn");
  const canvasContainer = document.getElementById("canvas-container");
  const ctx = document.getElementById("cardio-chart");
  let cardioChartInstance = null; 

  const bmiDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");

  const cardioAdvice = {
    "Excellent": {
      title: "ELITE CARDIO",
      text: "Outstanding! Your heart recovers very quickly, indicating a strong, highly efficient cardiovascular system. Keep up your current training routine!",
      color: "#00C851"
    },
    "Good": {
      title: "HEALTHY CARDIO",
      text: "Great job. Your heart rate recovery is in a very healthy range. To push to the next level, consider adding one High-Intensity Interval Training (HIIT) session per week.",
      color: "#33b5e5"
    },
    "Average": {
      title: "AVERAGE CARDIO",
      text: "You are right in the middle! To improve your heart's efficiency, try incorporating 30 minutes of steady-state cardio (like brisk walking, cycling, or swimming) 3-4 times a week.",
      color: "#ffbb33"
    },
    "Below Average": {
      title: "ROOM FOR IMPROVEMENT",
      text: "Your heart is working a bit harder to recover. Focus on steady, low-impact movement. Start with 15-20 minutes of light walking daily and slowly build up your stamina over the next month.",
      color: "#ff4444"
    },
    "Invalid": {
      title: "INVALID DATA",
      text: "Your post-exercise heart rate cannot be lower than or equal to your resting heart rate. Please delete this record and enter accurate data.",
      color: "#888888"
    }
  };

  function getCardioCategory(postHr, restingHr) {
    const p = parseInt(postHr);
    const r = parseInt(restingHr);
    
    if (p <= r) return { text: "Invalid", color: "#888888" };
    if (p <= 85) return { text: "Excellent", color: "#00C851" };
    if (p > 85 && p <= 100) return { text: "Good", color: "#33b5e5" };
    if (p > 100 && p <= 115) return { text: "Average", color: "#ffbb33" };
    return { text: "Below Average", color: "#ff4444" };
  }

  function updateChart() {
    if (!ctx) return;
    const userData = getUserData();
    const logs = userData.cardioLogs || [];

    if (logs.length === 0) {
      if (chartWrapper) chartWrapper.style.display = "none";
      return;
    }

    if (chartWrapper) chartWrapper.style.display = "block";

    const dailyData = {};
    logs.forEach(log => {
      if (!dailyData[log.date]) {
        dailyData[log.date] = { restSum: 0, postSum: 0, count: 0 };
      }
      dailyData[log.date].restSum += parseInt(log.restingHr);
      dailyData[log.date].postSum += parseInt(log.postHr);
      dailyData[log.date].count += 1;
    });

    const dates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    const labels = [];
    const restingData = [];
    const postData = [];

    let lastRestAvg = dailyData[dates[0]].restSum / dailyData[dates[0]].count;
    let lastPostAvg = dailyData[dates[0]].postSum / dailyData[dates[0]].count;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toLocaleDateString();
      labels.push(dateString);

      if (dailyData[dateString]) {
        lastRestAvg = dailyData[dateString].restSum / dailyData[dateString].count;
        lastPostAvg = dailyData[dateString].postSum / dailyData[dateString].count;
      }
      
      restingData.push(Math.round(lastRestAvg));
      postData.push(Math.round(lastPostAvg));
    }

    if (cardioChartInstance) {
      cardioChartInstance.destroy();
    }

    cardioChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Avg Post-Exercise HR',
            data: postData,
            borderColor: '#ff4444',
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            borderWidth: 2,
            tension: 0.3, 
            fill: true
          },
          {
            label: 'Avg Resting HR',
            data: restingData, 
            borderColor: '#33b5e5',
            backgroundColor: 'rgba(51, 181, 229, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 0,
        layout: {
          padding: { top: 10, bottom: 10, left: 5, right: 5 }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 10,
              padding: 10, 
              font: { size: 12 },
              color: '#888' 
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: 50,
            suggestedMax: 150,
            grid: { color: 'rgba(255,255,255,0.05)' }, 
            ticks: { color: '#888', font: { size: 10 } }
          },
          x: {
            grid: { display: false }, 
            ticks: { color: '#888', font: { size: 10 } }
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

  function renderCardioTable() {
    if (!cardioHistoryBody) return;
  
    const userData = getUserData();
    const cardioLogs = userData.cardioLogs || [];
  
    cardioHistoryBody.innerHTML = "";
    if (selectAllCardioCb) selectAllCardioCb.checked = false;
  
    if (cardioLogs.length === 0) {
      cardioHistoryBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">No step test data logged yet. Try it today!</td></tr>`;
      updateChart(); 
      return;
    }
  
    [...cardioLogs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = cardioLogs.length - 1 - reversedIndex;
      const category = getCardioCategory(log.postHr, log.restingHr);
      
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";
      
      tr.innerHTML = `
        <td style="padding: 10px;"><input type="checkbox" class="row-cb-cardio" data-index="${trueIndex}"></td>
        <td style="padding: 10px;">${log.date}</td>
        <td style="padding: 10px;">${log.restingHr} bpm</td>
        <td style="padding: 10px; font-weight: bold;">${log.postHr} bpm</td>
        <td style="padding: 10px; color: ${category.color}; font-weight: 700; display: flex; align-items: center;">
          ${category.text.toUpperCase()}
          <button type="button" class="info-icon-btn cardio-info-btn" data-category="${category.text}">
            <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>
        </td>
      `;
      cardioHistoryBody.appendChild(tr);
    });
  
    const rowCbs = document.querySelectorAll(".row-cb-cardio");
    if (selectAllCardioCb) {
      rowCbs.forEach(cb => {
        cb.addEventListener("change", () => {
          selectAllCardioCb.checked = Array.from(rowCbs).every(c => c.checked);
        });
      });
    }

    updateChart(); 
  }

  if (cardioForm) {
    renderCardioTable(); 
    
    cardioForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const restingVal = parseInt(restingHrInput.value);
      const postVal = parseInt(postHrInput.value);

      // BOUNDARY CHECK: Prevents non-human input
      if (restingVal < 30 || restingVal > 250 || postVal < 30 || postVal > 250) {
        alert("Please enter realistic heart rate values (between 30 and 250 bpm).");
        return;
      }

      if (postVal <= restingVal) {
        alert("Post-exercise heart rate must be higher than your resting heart rate. Please check your inputs.");
        return;
      }
      
      const newLog = {
        date: new Date().toLocaleDateString(),
        restingHr: restingVal,
        postHr: postVal
      };
      
      const userData = getUserData();
      if (!userData.cardioLogs) userData.cardioLogs = [];
      userData.cardioLogs.push(newLog);
      
      saveUserData(userData);
      cardioForm.reset();
      renderCardioTable(); 
    });
    
    if (selectAllCardioCb) {
      selectAllCardioCb.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll(".row-cb-cardio").forEach(cb => cb.checked = isChecked);
      });
    }
    
    if (deleteCardioBtn) {
      deleteCardioBtn.setAttribute("type", "button");
      
      deleteCardioBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const selectedRows = document.querySelectorAll(".row-cb-cardio:checked");
        
        if (selectedRows.length === 0) {
          alert("Please select at least one record to delete.");
          return;
        }
        
        if (confirm("Are you sure you want to delete the selected records? This will also update your chart.")) {
          const indicesToDelete = Array.from(selectedRows).map(cb => parseInt(cb.getAttribute("data-index")));
          const userData = getUserData();
          
          if (!userData.cardioLogs) return;
          
          userData.cardioLogs = userData.cardioLogs.filter((_, index) => !indicesToDelete.includes(index));
          
          saveUserData(userData);
          
          if (selectAllCardioCb) selectAllCardioCb.checked = false;
          
          renderCardioTable();
        }
      });
    }
  }

  if (cardioHistoryBody) {
    cardioHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".cardio-info-btn");
      if (!btn) return; 
      
      const catText = btn.getAttribute("data-category");
      const advice = cardioAdvice[catText];
      
      if (advice && bmiDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        bmiDrawer.classList.add("open");
      }
    });
  }
});
