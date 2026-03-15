# PhysiqueLab - Athlete Performance & Fitness Tracker

A comprehensive, client-side web application designed for athletes, coaches, and fitness enthusiasts to track, visualize, and evaluate specialized athletic performance metrics. All data is processed and stored locally in the browser, ensuring high privacy and offline capability.

---

## Table of Contents
1. [Features](#features)
2. [Athletic Modules](#athletic-modules)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Troubleshooting & Known Issues](#troubleshooting--known-issues)
7. [Future Enhancements](#future-enhancements)
8. [License](#license)

---

## Features

* **Comprehensive Tracking:** Log and monitor multiple fitness disciplines in one centralized dashboard.
* **Interactive Data Visualization:** Dynamic line and bar charts (powered by Chart.js) that automatically scale and update as new data is added.
* **Smart Coaching System:** Built-in logic that categorizes results (from "Below Average" to "Superhuman") and provides tailored advice via a slide-out information drawer.
* **Data Validation:** Strict input boundaries to prevent non-human entries (e.g., locking heart rates between 30 and 250 BPM, preventing negative times).
* **Persistent Local Storage:** Uses the browser's Native `localStorage` API to save user data permanently without requiring a backend database.
* **Responsive Design:** Fully functional across desktop and mobile devices.
* **Web Crypto API SHA-256:** Securely hashes user passwords on the client side before storing them in local storage, providing an extra layer of authentication security.

---

## Athletic Modules

This application tracks both health-related and skill-related fitness components, providing a complete athletic profile:

### Health-Related Components
| Component | Standard Protocol / Test | Measurement Metric | Target Goal |
| :--- | :--- | :--- | :--- |
| **Body Composition** | BMI Calculator | Height & Weight | Healthy Range (18.5 - 24.9) |
| **Cardio** | 3-Minute Step Test | Heart Rate (BPM) | Lower Post-Exercise HR |
| **Muscular Strength** | Push-Up Test | Repetitions | Higher Rep Count|
| **Muscular Endurance**| Plank Test | Time (Seconds) | Higher Time Hold |
| **Flexibility** | Sit-and-Reach Test | Distance (cm / inches)| Higher Distance |

### Skill-Related Components
| Component | Standard Protocol / Test | Measurement Metric | Target Goal |
| :--- | :--- | :--- | :--- |
| **Power** | Standing Long Jump | Distance / Height | Higher Measurement |
| **Speed** | 50-Meter Sprint | Time (Seconds) | Lower Time |
| **Agility** | Illinois Agility Test | Time (Seconds) | Lower Time |
| **Coordination** | Alternate-Hand Wall Toss | Total Catches (30s) | Higher Count |
| **Balance** | Stork Stand Test | Time (Seconds) | Higher Time |
| **Reaction Time** | Ruler Drop Test | Distance (Millimeters) | Lower Distance |

---

## Technology Stack

* **Frontend Structure:** HTML5
* **Styling:** CSS3 (Custom Variables, Flexbox, Grid)
* **Logic & Functionality:** Vanilla JavaScript (ES6+)
* **Data Visualization:** Chart.js
* **Storage Environment:** Window.localStorage API
* **Security:** Native Web Crypto API

---

## Project Structure

The directory layout for PhysiqueLab:

```text
/PhysiqueLab
│
├── index.html             # Landing and Authentication UI
├── dashboard.html         # Main application dashboard UI
├── favicon.png            # Browser tab icon
│
├── /css
│   └── style.css          # Global stylesheet
│
├── /js
│   ├── agility.js         # Logic, validation, and charting for Agility Test
│   ├── app.js             # Core application logic and shared utilities
│   ├── auth.js            # User authentication and session management
│   ├── balance.js         # Logic, validation, and charting for Balance Test
│   ├── bmi.js             # Logic for Body Composition calculations
│   ├── cardio.js          # Logic, validation, and charting for Step Test
│   ├── coordination.js    # Logic, validation, and charting for Wall Toss
│   ├── crypto.js          # SHA-256 hashing implementations
│   ├── flexibility.js     # Logic, validation, and charting for Flexibility Test
│   ├── mascular.js        # Logic, validation, and charting for Muscular metrics
│   ├── power.js           # Logic, validation, and charting for Power Tests
│   ├── reaction.js        # Logic, validation, and charting for Ruler Drop
│   └── speed.js           # Logic, validation, and charting for Speed Test
│
└── README.md              # Project documentation
```

---

## Installation & Setup

Because this is a strictly client-side application, no server installation or package managers are required.

1. **Download the Repository:** Clone or download the project folder to your local machine.
2. **Add Assets:** Ensure `favicon.png` is placed in the root directory.
3. **Run the App:** Open `index.html` directly in any modern web browser (Chrome, Safari, Firefox, Edge).
4. **Begin Tracking:** Create an account or log in, proceed to the dashboard (`dashboard.html`), navigate to a module, input your test results, and watch your charts generate automatically.

---

## Troubleshooting & Known Issues

**Data Disappears on Mobile (Chrome)**
If you are using Google Chrome on a mobile device and switch between "Standard Mode" and "Desktop Site," you may be temporarily logged out or see missing data. 
* **Cause:** Toggling Desktop mode changes the browser's User-Agent and occasionally resets the active browsing context, making it appear as if you are on a different site origin.
* **Solution:** Ensure your session logic relies strictly on `localStorage` rather than `sessionStorage`, and try to remain in one viewing mode while logging data.

**Charts Not Updating**
If a chart fails to render after adding new data:
* Check that you haven't inputted conflicting data (e.g., Post-Exercise HR being lower than Resting HR).
* Hard refresh your browser (Ctrl + F5 or Cmd + Shift + R) to clear any cached JavaScript.

---

## Future Enhancements (Roadmap)

* **Cloud Synchronization:** Future integration with a backend service (like Firebase) to allow cross-device data syncing.
* **Data Export:** Add the ability to export testing history as a CSV or PDF report to share with coaches or trainers.
* **Multi-User Profiles:** Support for tracking multiple athletes on a single device or browser.
* **Dark Mode:** A UI toggle for a dark theme to improve accessibility and reduce eye strain.

---

## Acknowledgments

* **[Chart.js](https://www.chartjs.org/)** - Utilized for rendering the interactive, responsive performance graphs.
* **MDN Web Docs** - Resource for the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) implementation used in the authentication flow.

---

## Author

**[By : chessTica542319 / RudaDev]**
* GitHub: [@chessTica542319](https://github.com/chessTica542319)
* Portfolio/Website: [ruda-dev.vercel.app](https://ruda-dev.vercel.app) 

---

## License

This project is open-source and available under the MIT License. You are free to copy, modify, and distribute this software for personal or commercial use.
