# Fitness & Performance Tracker

A comprehensive, lightweight web application designed for athletes and coaches to track specialized athletic performance metrics. This dashboard provides data visualization, history logging, and performance-based advice for various physical attributes.



## Features

* **Athletic Testing Suite:** Dedicated modules for Speed, Agility, Balance, Coordination, and Reaction Time.
* **Data Visualization:** Interactive line and bar charts (via Chart.js) to track progress over time.
* **Performance Tiers:** Automated categorization ranging from "Below Average" to "Superhuman" based on industry-standard testing results.
* **Persistent Storage:** Data is saved locally in the browser, ensuring your logs remain available between sessions.
* **Smart Feedback:** Dynamic advice system providing coaching tips based on your current performance level.
* **Mobile-Friendly:** Responsive design that works across desktop and mobile devices.

---

##  Athletic Tests Included

| Test | Method | Metric |
| :--- | :--- | :--- |
| **Speed** | 50-Meter Sprint | Seconds (Lower is better) |
| **Balance** | Stork Stand Test | Seconds (Higher is better) |
| **Agility** | Illinois Agility Test | Seconds (Lower is better) |
| **Coordination** | Wall Toss Test (30s) | Total Catches (Higher is better) |
| **Reaction Time** | Ruler Drop Test | Millimeters (Lower is better) |

---

## Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Charts:** [Chart.js](https://www.chartjs.org/)
* **Storage:** Browser LocalStorage API
* **Icons:** Inline SVG and Favicon.png

---

## Installation & Usage

1.  **Clone or Download:** Save the project files to your local machine.
2.  **Asset Setup:** Ensure `favicon.png` is located in the root directory.
3.  **Launch:** Open `index.html` in any modern web browser.
4.  **Logging Data:** * Navigate to a specific test (e.g., Speed).
    * Enter your result and click "Submit."
    * Use the "Show/Hide Chart" toggle to visualize your improvement.
    * Click the "Info" icon in the table to see coaching advice for that specific score.

---

##  Data Management

* **Auto-Save:** All entries are automatically saved to your browser's `localStorage`.
* **Deleting Records:** Select individual or multiple records using the checkboxes in the history table and click the delete button to remove them.
* **Device Sync:** Since this app uses local storage, data is specific to the device and browser used. For mobile users, ensure you stay in the same browser mode (Standard vs. Desktop) to maintain data consistenc
