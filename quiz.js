// 1. Full 30-Question Pool (15 Web Dev + 15 Cybersecurity Essentials)
const quizBank = [
    // === 15 FRONTEND WEB DEVELOPMENT QUESTIONS ===
    { question: "Which HTML tag is used to define an internal style sheet?", options: ["<script>", "<css>", "<style>", "<link>"], correctAnswer: "<style>" },
    { question: "What is the correct syntax for referring to an external script called 'xxx.js'?", options: ["<script href='xxx.js'>", "<script name='xxx.js'>", "<script src='xxx.js'>", "<script file='xxx.js'>"], correctAnswer: "<script src='xxx.js'>" },
    { question: "Which of these is NOT a valid JavaScript loop statement?", options: ["for", "while", "foreach", "do...while"], correctAnswer: "foreach" },
    { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: "Cascading Style Sheets" },
    { question: "Which HTML attribute is used to define inline styles?", options: ["font", "class", "styles", "style"], correctAnswer: "style" },
    { question: "How do you write 'Hello World' in an alert box in JS?", options: ["msg('Hello World');", "alertBox('Hello World');", "alert('Hello World');", "msgBox('Hello World');"], correctAnswer: "alert('Hello World');" },
    { question: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "function = myFunction()", "new Function()"], correctAnswer: "function myFunction()" },
    { question: "How do you call a function named 'myFunction'?", options: ["call myFunction()", "myFunction()", "call function myFunction()", "redirect myFunction()"], correctAnswer: "myFunction()" },
    { question: "How can you add a comment in JavaScript?", options: ["'This is a comment", "<!--This is a comment-->", "//This is a comment", "*This is a comment*"], correctAnswer: "//This is a comment" },
    { question: "Which property is used to change the background color in CSS?", options: ["color", "bgcolor", "background-color", "bgColor"], correctAnswer: "background-color" },
    { question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], correctAnswer: "font-size" },
    { question: "How do you make the text bold in CSS?", options: ["font:bold;", "font-weight:bold;", "style:bold;", "text-weight:bold;"], correctAnswer: "font-weight:bold;" },
    { question: "Is JavaScript case-sensitive?", options: ["No", "Yes", "Only in variables", "Only in functions"], correctAnswer: "Yes" },
    { question: "Which operator is used to assign a value to a variable?", options: ["*", "-", "=", "x"], correctAnswer: "=" },
    { question: "Which array method removes the last element from an array?", options: ["shift()", "pop()", "push()", "splice()"], correctAnswer: "pop()" },

    // === 15 CYBERSECURITY & TRYHACKME ESSENTIALS QUESTIONS ===
    { question: "What does the CIA triad stand for in information security frameworks?", options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Control, Identity, Authentication", "Cyber Incident Assessment"], correctAnswer: "Confidentiality, Integrity, Availability" },
    { question: "Which protocol encrypts web browser traffic securely instead of transmitting in plaintext?", options: ["HTTP", "FTP", "HTTPS", "Telnet"], correctAnswer: "HTTPS" },
    { question: "What is a malicious software program designed to masquerade as a legitimate application called?", options: ["Trojan Horse", "Spyware", "Ransomware", "Worm"], correctAnswer: "Trojan Horse" },
    { question: "Which port does secure SSH terminal traffic utilize by default?", options: ["21", "22", "80", "443"], correctAnswer: "22" },
    { question: "What type of attack involves manipulating users via deceptive emails to harvest passwords?", options: ["DDoS", "Phishing", "SQL Injection", "Man-in-the-Middle"], correctAnswer: "Phishing" },
    { question: "What network security device controls incoming and outgoing traffic based on pre-defined rules?", options: ["Router", "Layer-2 Switch", "Firewall", "Repeater"], correctAnswer: "Firewall" },
    { question: "What does a 'DDoS' attack stand for?", options: ["Distributed Denial of Service", "Direct Data Over Syndrome", "Digital Domain Operating System", "Decentralized Defense of Systems"], correctAnswer: "Distributed Denial of Service" },
    { question: "Which cryptographic process transforms readable text into unreadable ciphertext?", options: ["Hashing", "Obfuscation", "Encryption", "Steganography"], correctAnswer: "Encryption" },
    { question: "What malware variant holds asset data hostage by encryption until a ransom is paid?", options: ["Adware", "Ransomware", "Rootkit", "Keylogger"], correctAnswer: "Ransomware" },
    { question: "What web vulnerability allows attackers to execute malicious backend queries on a database?", options: ["Cross-Site Scripting (XSS)", "SQL Injection (SQLi)", "Brute Force", "Buffer Overflow"], correctAnswer: "SQL Injection (SQLi)" },
    { question: "Which mechanism adds secondary verification steps like tokens alongside passwords?", options: ["Single Sign-On (SSO)", "Multi-Factor Authentication (MFA)", "Biometric Override", "Asymmetric Passphrase"], correctAnswer: "Multi-Factor Authentication (MFA)" },
    { question: "What classification is given to ethical hackers searching for bugs to reinforce defenses?", options: ["Black Hat", "Gray Hat", "White Hat", "Script Kiddie"], correctAnswer: "White Hat" },
    { question: "What string does the basic Linux command tool 'whoami' print out?", options: ["The server's public IP address", "The active session's username", "Current system kernel version", "Active memory distribution"], correctAnswer: "The active session's username" },
    { question: "What is an administrative group of compromised systems controlled remotely by a threat actor?", options: ["Botnet", "Server Farm", "Mainframe Cluster", "Proxy Loop"], correctAnswer: "Botnet" },
    { question: "Which algorithm family is commonly utilized to ensure payload file integrity checksums?", options: ["MD5", "SHA-256", "Base64", "ROT13"], correctAnswer: "SHA-256" }
];

// 2. Quiz State Variables
let currentIdx = 0;
let userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || new Array(quizBank.length).fill(null);

// 3. Countdown Timer Variables
let totalTimeSeconds = parseInt(localStorage.getItem("quizTimeLeft")) || 30 * 60; 
let timerInterval;

// 4. Select Elements
const questionTracker = document.getElementById("question-tracker");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const timerDisplay = document.getElementById("quiz-timer-display");
const progressBar = document.getElementById("quiz-progress-bar");
const matrixGrid = document.getElementById("question-matrix-grid");

// Interface Views
const startScreen = document.getElementById("quiz-start-screen");
const activeScreen = document.getElementById("quiz-active-screen");
const realStartBtn = document.getElementById("real-start-btn");

// Side Panel Counters
const sumTotalNode = document.getElementById("summary-total-count");
const sumAnsweredNode = document.getElementById("summary-answered-count");
const sumRemainingNode = document.getElementById("summary-remaining-count");

// =========================================================================
// --- STRICT PRIVACY COMPONENT FLOW: LOCK HISTORY TO LOGGED-IN USER ---
// =========================================================================
function loadDashboardHistoryReceipts() {
    const dashboardTableBody = document.getElementById("quiz-page-history-body");
    if (!dashboardTableBody) return;

    // 1. Identify who is securely logged in right now
    const activeStudentName = localStorage.getItem("currentStudentName") || "Student";
    
    // 2. Load all raw scores from client storage array
    const recordsLog = JSON.parse(localStorage.getItem("studentQuizHistoryRecords")) || [];
    dashboardTableBody.innerHTML = "";

    // 3. Keep records that match this specific student EXACTLY (Case-Insensitive & Trimmed)
    const matches = recordsLog.filter(entry => {
        if (!entry.student) return false;
        return entry.student.trim().toLowerCase() === activeStudentName.trim().toLowerCase();
    });

    // 4. If this specific student has no matching history entries, show the empty state message
    if (matches.length === 0) {
        dashboardTableBody.innerHTML = `<tr><td colspan="4" style="color:#64748b; font-style:italic; padding: 1rem 0; text-align:center;">No history found for ${activeStudentName}. Your future receipts will display here!</td></tr>`;
        return;
    }

    // 5. Print ONLY this student's records to the dashboard table layout (newest first)
    [...matches].reverse().forEach(run => {
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
        
        tr.innerHTML = `
            <td style="padding: 0.75rem 0; color: #cbd5e1;">${run.timestamp}</td>
            <td style="font-weight: 600; color: #22c55e;">${run.score} / ${run.total}</td>
            <td style="font-weight: bold; color: #ffffff;">${run.percent}%</td>
            <td style="color: #94a3b8;">${run.time || "--"}</td>
        `;
        dashboardTableBody.appendChild(tr);
    });
}

function startTimer() {
    if (timerDisplay) timerDisplay.style.display = "block"; 
    timerInterval = setInterval(() => {
        if (totalTimeSeconds <= 0) {
            clearInterval(timerInterval);
            // REPLACED WITH SECURE ANIMS ENGINE MODAL
            showAnimatedPopup(
                "⏰ Time Depleted", 
                "Your 30-minute workspace session has timed out. System is archiving your choices now.", 
                () => { submitQuiz(); },
                false // Simple alert layout
            );
        } else {
            totalTimeSeconds--;
            localStorage.setItem("quizTimeLeft", totalTimeSeconds);
            
            const minutes = Math.floor(totalTimeSeconds / 60);
            const seconds = totalTimeSeconds % 60;
            if (timerDisplay) {
                timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }, 1000);
}

function displayStudentProfile() {
    const activeName = localStorage.getItem("currentStudentName") || "Guest Student";
    const activeID = localStorage.getItem("currentStudentID") || "Unknown ID";
    
    if(document.getElementById("student-name")) document.getElementById("student-name").textContent = activeName;
    if(document.getElementById("student-id-display")) document.getElementById("student-id-display").textContent = activeID;
    if(document.getElementById("student-avatar")) {
        document.getElementById("student-avatar").textContent = activeName.substring(0, 2).toUpperCase();
    }
}

function refreshSidebarMetrics() {
    let answeredCount = 0;
    userAnswers.forEach(ans => { if (ans !== null) answeredCount++; });
    let remainingCount = quizBank.length - answeredCount;

    if (sumTotalNode) sumTotalNode.textContent = quizBank.length;
    if (sumAnsweredNode) sumAnsweredNode.textContent = answeredCount;
    if (sumRemainingNode) sumRemainingNode.textContent = remainingCount;

    if (matrixGrid) {
        matrixGrid.innerHTML = "";
        quizBank.forEach((_, index) => {
            const blockLink = document.createElement("a");
            blockLink.href = "#";
            blockLink.textContent = index + 1;
            
            if (index === currentIdx) {
                blockLink.className = "active";
            } else if (userAnswers[index] !== null) {
                blockLink.style.backgroundColor = "rgba(34, 197, 94, 0.2)";
                blockLink.style.color = "#22c55e";
                blockLink.style.border = "1px solid #22c55e";
            }

            blockLink.addEventListener("click", (e) => {
                e.preventDefault();
                if (activeScreen.style.display !== "none") {
                    currentIdx = index;
                    displayQuestion();
                }
            });
            matrixGrid.appendChild(blockLink);
        });
    }
}

function displayQuestion() {
    const currentQuestion = quizBank[currentIdx];
    questionTracker.textContent = `Question ${currentIdx + 1} of ${quizBank.length}`;
    questionText.textContent = currentQuestion.question;
    
    if (progressBar) {
        const widthPercentage = ((currentIdx + 1) / quizBank.length) * 100;
        progressBar.style.width = `${widthPercentage}%`;
    }

    optionsContainer.innerHTML = '<legend class="sr-only">Answer options</legend>';
    
    currentQuestion.options.forEach((option, index) => {
        const optionLabel = document.createElement("label");
        const optionInput = document.createElement("input");
        
        optionInput.type = "radio";
        optionInput.name = "answer";
        optionInput.value = option;
        
        if (userAnswers[currentIdx] === option) {
            optionInput.checked = true;
        }
        
        optionInput.addEventListener("change", () => {
            userAnswers[currentIdx] = optionInput.value;
            localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
            refreshSidebarMetrics();
        });
        
        const labelPrefix = document.createElement("span");
        labelPrefix.textContent = String.fromCharCode(65 + index);
        
        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(labelPrefix);
        optionLabel.appendChild(document.createTextNode(` ${option}`));
        optionsContainer.appendChild(optionLabel);
    });
    
    prevBtn.style.visibility = currentIdx === 0 ? "hidden" : "visible";
    if (currentIdx === quizBank.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-block";
    } else {
        nextBtn.style.display = "inline-block";
        submitBtn.style.display = "none";
    }

    refreshSidebarMetrics();
}

function submitQuiz() {
    clearInterval(timerInterval);
    
    let finalScore = 0;
    quizBank.forEach((q, index) => {
        if (userAnswers[index] === q.correctAnswer) {
            finalScore++;
        }
    });
    
    localStorage.setItem("quizScore", finalScore);
    localStorage.setItem("totalQuestions", quizBank.length);
    localStorage.setItem("savedQuizBank", JSON.stringify(quizBank));
    localStorage.setItem("savedUserAnswers", JSON.stringify(userAnswers));
    localStorage.setItem("quizTimeLeftAtEnd", totalTimeSeconds);
    
    localStorage.removeItem("userAnswers");
    localStorage.removeItem("quizTimeLeft");
    
    window.location.assign("./result.html");
}

nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentIdx < quizBank.length - 1) { currentIdx++; displayQuestion(); }
});

prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentIdx > 0) { currentIdx--; displayQuestion(); }
});

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // REPLACED WITH AN ANIMATED PREMIUM GLASS CONFIRMATION MODAL
    showAnimatedPopup(
        "🚀 Submit Assessment", 
        "Are you completely ready to freeze your choices and process your final score parameters?", 
        () => { submitQuiz(); },
        true // Enables Cancel vs Proceed interactive logic
    );
});

// Setup Dashboard Control Button Click Handler
if (realStartBtn) {
    realStartBtn.addEventListener("click", () => {
        startScreen.style.display = "none";    
        activeScreen.style.display = "block";  
        displayQuestion();                     
        startTimer();                          
    });
}

// Boot Dashboard Sequences
loadDashboardHistoryReceipts();
displayStudentProfile();
refreshSidebarMetrics();


// =========================================================================
// --- CUSTOM ANIMATED MODAL INJECTOR ENGINE (SUPPORT INFOS & CONFIRMS) ---
// =========================================================================
function showAnimatedPopup(title, message, onConfirm, isConfirmation = false) {
    const overlay = document.createElement("div");
    overlay.className = "custom-popup-overlay";
    
    // Dynamic Action Buttons Layout depending on confirm style requested
    let actionButtonsHTML = `<button class="custom-popup-btn" id="modal-close-trigger">Acknowledge</button>`;
    if (isConfirmation) {
        actionButtonsHTML = `
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="custom-popup-btn" id="modal-cancel-trigger" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; box-shadow: none;">Cancel</button>
                <button class="custom-popup-btn" id="modal-close-trigger">Proceed</button>
            </div>
        `;
    }
    
    overlay.innerHTML = `
        <div class="custom-popup-box">
            <div class="custom-popup-title">${title}</div>
            <div class="custom-popup-msg">${message}</div>
            ${actionButtonsHTML}
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => { overlay.classList.add("active"); }, 10);
    
    const closeBtn = overlay.querySelector("#modal-close-trigger");
    const cancelBtn = overlay.querySelector("#modal-cancel-trigger");
    
    if (closeBtn) closeBtn.focus();
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            overlay.classList.remove("active");
            setTimeout(() => {
                overlay.remove();
                if (onConfirm) onConfirm();
            }, 300);
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            overlay.classList.remove("active");
            setTimeout(() => { overlay.remove(); }, 300);
        });
    }
}