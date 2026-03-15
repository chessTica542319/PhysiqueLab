document.addEventListener("DOMContentLoaded", () => {
  const bmiForm = document.getElementById("bmi-form");
  const ageInput = document.getElementById("age-input");
  const heightInput = document.getElementById("height-input");
  const weightInput = document.getElementById("weight-input");
  const bmiHistoryBody = document.getElementById("bmi-history-body");
  const selectAllCb = document.getElementById("select-all-cb");
  const deleteSelectedBtn = document.getElementById("delete-selected-btn");
  
  const sharedDrawer = document.getElementById("bmi-info-drawer");
  const drawerTitle = document.getElementById("drawer-title");
  const drawerContent = document.getElementById("drawer-content");
  
  const bmiAdvice = {
    "Underweight": {
      title: "UNDERWEIGHT INSIGHTS",
      text: "Your BMI suggests you may be underweight. Focus on nutrient-dense foods like nuts, avocados, lean proteins, and complex carbohydrates to build healthy mass safely. Consider consulting a nutritionist or doctor to ensure you are meeting your body's energy needs.",
      color: "#ffbb33"
    },
    "Normal": {
      title: "OPTIMAL RANGE",
      text: "Excellent work! Your BMI is right in the healthy, optimal range. Maintain your current lifestyle by continuing to balance a nutritious, protein-rich diet with regular strength-training and cardiovascular exercise.",
      color: "#00C851"
    },
    "Overweight": {
      title: "OVERWEIGHT INSIGHTS",
      text: "Your BMI indicates you are slightly above the standard range. Incorporating a bit more daily activity (like a 30-minute walk) and focusing on whole foods, lean proteins, and a slight caloric deficit can help optimize your body composition over time.",
      color: "#ffbb33"
    },
    "Obese": {
      title: "ACTION REQUIRED",
      text: "Your BMI falls into the higher risk category. The best approach is steady, sustainable changes rather than crash diets. Prioritize daily movement, hydration, and replacing processed items with whole foods. Consulting a healthcare professional for a safe, personalized action plan is highly recommended.",
      color: "#ff4444"
    }
  };
  
  function getBMICategory(bmi) {
    const value = parseFloat(bmi);
    if (value < 18.5) return { text: "Underweight", color: "#ffbb33" };
    if (value >= 18.5 && value < 25) return { text: "Normal", color: "#00C851" };
    if (value >= 25 && value < 30) return { text: "Overweight", color: "#ffbb33" };
    return { text: "Obese", color: "#ff4444" };
  }
  
  function renderBMITable() {
    if (!bmiHistoryBody) return;
    
    const userData = getUserData();
    const bmiLogs = userData.bmiLogs || [];
    
    bmiHistoryBody.innerHTML = "";
    if (selectAllCb) selectAllCb.checked = false;
    
    if (bmiLogs.length === 0) {
      bmiHistoryBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">No data logged yet. Start tracking above!</td></tr>`;
      return;
    }
    
    [...bmiLogs].reverse().forEach((log, reversedIndex) => {
      const trueIndex = bmiLogs.length - 1 - reversedIndex;
      const category = getBMICategory(log.bmi);
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td><input type="checkbox" class="row-cb" data-index="${trueIndex}"></td>
                <td>${log.date}</td>
                <td>${log.age}</td>
                <td>${log.height} cm</td>
                <td>${log.weight} kg</td>
                <td style="color: var(--primary); font-weight: bold;">${log.bmi}</td>
                <td style="color: ${category.color}; font-weight: 700; letter-spacing: 0.5px; display: flex; align-items: center;">
                    ${category.text.toUpperCase()}
                    <button type="button" class="info-icon-btn bmi-info-btn" data-category="${category.text}">
                        <svg style="pointer-events: none;" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </button>
                </td>
            `;
      bmiHistoryBody.appendChild(tr);
    });
    
    const rowCbs = document.querySelectorAll(".row-cb");
    if (selectAllCb) {
      rowCbs.forEach(cb => {
        cb.addEventListener("change", () => {
          const allChecked = Array.from(rowCbs).every(c => c.checked);
          selectAllCb.checked = allChecked;
        });
      });
    }
  }
  
  if (bmiForm) {
    renderBMITable();
    
    bmiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const age = parseInt(ageInput.value);
      const height = parseFloat(heightInput.value);
      const weight = parseFloat(weightInput.value);
      
      if (age <= 0 || height <= 0 || weight <= 0) {
        alert("Please enter valid positive numbers for your measurements.");
        return;
      }
      
      if (age > 120) {
        alert("Please enter a valid age. The maximum allowed age is 120.");
        return;
      }
      
      if (height > 350) {
        alert("Please enter a valid height. The maximum allowed height is 350 cm.");
        return;
      }
      
      if (weight > 250) {
        alert("Please enter a valid weight. The maximum allowed weight is 250 kg.");
        return;
      }
      
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      
      const newLog = {
        date: new Date().toLocaleDateString(),
        age: age,
        height: height,
        weight: weight,
        bmi: bmi
      };
      
      const userData = getUserData();
      if (!userData.bmiLogs) userData.bmiLogs = [];
      userData.bmiLogs.push(newLog);
      
      saveUserData(userData);
      bmiForm.reset();
      renderBMITable();
    });
    
    if (selectAllCb) {
      selectAllCb.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        const rowCbs = document.querySelectorAll(".row-cb");
        rowCbs.forEach(cb => cb.checked = isChecked);
      });
    }
    
    if (deleteSelectedBtn) {
      deleteSelectedBtn.addEventListener("click", () => {
        const rowCbs = document.querySelectorAll(".row-cb:checked");
        if (rowCbs.length === 0) return;
        
        const indicesToDelete = Array.from(rowCbs).map(cb => parseInt(cb.getAttribute("data-index")));
        
        const userData = getUserData();
        if (!userData.bmiLogs) return;
        
        userData.bmiLogs = userData.bmiLogs.filter((_, index) => !indicesToDelete.includes(index));
        
        saveUserData(userData);
        renderBMITable();
      });
    }
  }
  
  if (bmiHistoryBody) {
    bmiHistoryBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".bmi-info-btn");
      if (!btn) return;
      
      const catText = btn.getAttribute("data-category");
      const advice = bmiAdvice[catText];
      
      if (advice && sharedDrawer) {
        drawerTitle.innerText = advice.title;
        drawerTitle.style.color = advice.color;
        drawerContent.innerText = advice.text;
        sharedDrawer.classList.add("open");
      }
    });
  }
});