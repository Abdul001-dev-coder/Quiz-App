// 1. Gather all data saved into Local Storage
const studentName = localStorage.getItem("currentStudentName") || "Student";
const score = parseInt(localStorage.getItem("quizScore"), 10) || 0;
const totalQuestions = parseInt(localStorage.getItem("totalQuestions"), 10) || 30;

const quizBank = JSON.parse(localStorage.getItem("savedQuizBank")) || [];
const userAnswers = JSON.parse(localStorage.getItem("savedUserAnswers")) || [];

const wrongAnswers = totalQuestions - score;
const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

// 2. Dynamic Time Used Calculation Engine
const totalDurationAllowed = 30 * 60; // 30 minutes in seconds (1800s)
const timeLeftAtEnd = parseInt(localStorage.getItem("quizTimeLeftAtEnd"), 10) || (26 * 60 + 18);
const timeUsedSeconds = Math.max(0, totalDurationAllowed - timeLeftAtEnd);

const minutesUsed = Math.floor(timeUsedSeconds / 60);
const secondsUsed = timeUsedSeconds % 60;

let timeUsedDisplayString = `${minutesUsed}m ${secondsUsed}s`;
if (minutesUsed === 0) {
    timeUsedDisplayString = `${secondsUsed}s`;
}

// 3. Inject Values Safely into HTML DOM
const correctStatCard = document.getElementById("correct-card");
const wrongStatCard = document.getElementById("wrong-card");
const timeUsedElement = document.getElementById("time-used-count");

if(document.getElementById("greeting-name")) {
    document.getElementById("greeting-name").textContent = `Congratulations, ${studentName}!`;
}
if(document.getElementById("final-percentage")) {
    document.getElementById("final-percentage").textContent = `${percentage}%`;
}
if(document.getElementById("correct-count")) {
    document.getElementById("correct-count").textContent = score;
}
if(document.getElementById("wrong-count")) {
    document.getElementById("wrong-count").textContent = wrongAnswers;
}
if(document.getElementById("total-stat-count")) {
    document.getElementById("total-stat-count").textContent = totalQuestions;
}

if (timeUsedElement) {
    timeUsedElement.textContent = timeUsedDisplayString;
}

// Setup Interactive Cards Styling
[correctStatCard, wrongStatCard].forEach(card => {
    if (card) {
        card.style.cursor = "pointer";
        card.style.userSelect = "none";
        card.style.webkitUserSelect = "none"; 
        card.style.transition = "all 0.2s ease";
        card.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    }
});

// Adjust pass/fail tag color status
const tagElement = document.getElementById("pass-fail-tag");
if (tagElement) {
    if (percentage >= 50) {
        tagElement.textContent = "Passed Successfully";
        tagElement.style.backgroundColor = "#22c55e"; 
    } else {
        tagElement.textContent = "Review Needed";
        tagElement.style.backgroundColor = "#ef4444"; 
    }
}

// 4. Core Filter Render Logic
const reviewContainer = document.getElementById("detailed-review-container");

function renderFilteredReview(filterType) {
    if (!reviewContainer) return;
    reviewContainer.innerHTML = "";
    
    if (correctStatCard) correctStatCard.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    if (wrongStatCard) wrongStatCard.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    if (correctStatCard) correctStatCard.style.transform = "scale(1)";
    if (wrongStatCard) wrongStatCard.style.transform = "scale(1)";
    if (correctStatCard) correctStatCard.style.backgroundColor = "transparent";
    if (wrongStatCard) wrongStatCard.style.backgroundColor = "transparent";

    if (filterType === "correct" && correctStatCard) {
        correctStatCard.style.border = "2px solid #22c55e";
        correctStatCard.style.transform = "scale(1.03)";
        correctStatCard.style.backgroundColor = "rgba(34, 197, 94, 0.08)";
    } else if (filterType === "wrong" && wrongStatCard) {
        wrongStatCard.style.border = "2px solid #ef4444";
        wrongStatCard.style.transform = "scale(1.03)";
        wrongStatCard.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
    }

    // GRACEFUL EXIT: If returning to view history without an active quiz session
    if (!quizBank || quizBank.length === 0) {
        reviewContainer.innerHTML = `<p style="color: #64748b; font-style: italic; text-align: center; padding: 2rem;">Take a new quiz to view question review details.</p>`;
        return;
    }

    let itemsCount = 0;

    quizBank.forEach((q, index) => {
        const studentChoice = userAnswers[index];
        const isCorrect = (studentChoice === q.correctAnswer);
        
        if (filterType === "correct" && !isCorrect) return;
        if (filterType === "wrong" && isCorrect) return;

        itemsCount++;

        const block = document.createElement("div");
        block.style.borderLeft = isCorrect ? "5px solid #22c55e" : "5px solid #ef4444";
        block.style.padding = "1.2rem";
        block.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
        block.borderRadius = "6px";
        block.style.marginBottom = "1rem";
        
        const heading = document.createElement("h4");
        heading.style.fontSize = "1.1rem";
        heading.style.marginBottom = "0.6rem";
        heading.textContent = `Q${index + 1}: ${q.question}`;
        block.appendChild(heading);
        
        const choice = document.createElement("p");
        choice.style.margin = "0.3rem 0";
        choice.innerHTML = `<strong>Your Selection:</strong> <span style="color: ${isCorrect ? '#22c55e' : '#ef4444'}">${studentChoice || "Unanswered"}</span>`;
        block.appendChild(choice);
        
        if (!isCorrect) {
            const correction = document.createElement("p");
            correction.style.margin = "0.3rem 0";
            correction.innerHTML = `<strong>Correct Answer:</strong> <span style="color: #22c55e">${q.correctAnswer}</span>`;
            block.appendChild(correction);
        }
        
        reviewContainer.appendChild(block);
    });

    if (itemsCount === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.style.color = "#64748b";
        emptyMsg.style.fontStyle = "italic";
        emptyMsg.style.textAlign = "center";
        emptyMsg.style.padding = "1rem";
        emptyMsg.textContent = filterType === "correct" ? "No correct answers to display." : "No incorrect answers to display! Perfect job.";
        reviewContainer.appendChild(emptyMsg);
    }
}

if (correctStatCard) correctStatCard.addEventListener("click", () => renderFilteredReview("correct"));
if (wrongStatCard) wrongStatCard.addEventListener("click", () => renderFilteredReview("wrong"));

renderFilteredReview("wrong");

const breakdownPercent = document.getElementById("breakdown-percent");
const breakdownBar = document.getElementById("breakdown-bar");
if (breakdownPercent) breakdownPercent.textContent = `${percentage}%`;
if (breakdownBar) breakdownBar.style.width = `${percentage}%`;


// =========================================================================
// --- CORE ENHANCEMENT: DASHBOARD HISTORY PRIVACY MANAGEMENT ---
// =========================================================================

const historyTableBody = document.getElementById("history-log-table-body");
const saveHistoryBtn = document.getElementById("save-history-btn");

// Function to pull records from localStorage and output rows onto table layout
function updateHistoryDashboardTable() {
    if (!historyTableBody) return;
    
    const recordsLog = JSON.parse(localStorage.getItem("studentQuizHistoryRecords")) || [];
    historyTableBody.innerHTML = "";
    
    // Filter out only the records belonging to the current user on the results page as well
    const matches = recordsLog.filter(entry => {
        if (!entry.student) return false;
        return entry.student.trim().toLowerCase() === studentName.trim().toLowerCase();
    });
    
    if (matches.length === 0) {
        historyTableBody.innerHTML = `<tr><td colspan="4" style="color:#64748b; font-style:italic; padding: 1rem 0; text-align:center;">No saved attempts found yet. Click 'Save' above!</td></tr>`;
        return;
    }
    
    // Print logs
    [...matches].reverse().forEach(run => {
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
        
        tr.innerHTML = `
            <td style="padding: 0.75rem 0; color: #cbd5e1;">${run.timestamp}</td>
            <td style="font-weight: 600; color: #22c55e;">${run.score} / ${run.total}</td>
            <td style="font-weight: bold; color: #ffffff;">${run.percent}%</td>
            <td style="color: #94a3b8;">${run.time}</td>
        `;
        historyTableBody.appendChild(tr);
    });
}

// Event handler for clicking the Save Button
if (saveHistoryBtn) {
    saveHistoryBtn.addEventListener("click", () => {
        const recordsLog = JSON.parse(localStorage.getItem("studentQuizHistoryRecords")) || [];
        
        const now = new Date();
        const dateString = now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // CRITICAL FIX: Stamping the active username onto the logged object
        const currentAttemptData = {
            student: studentName, // Stored safely to differentiate users
            timestamp: dateString,
            score: score,
            total: totalQuestions,
            percent: percentage,
            time: timeUsedDisplayString
        };
        
        recordsLog.push(currentAttemptData);
        localStorage.setItem("studentQuizHistoryRecords", JSON.stringify(recordsLog));
        
        // REPLACED WITH AN ANIMATED PREMIUM GLASSMODAL CALL
        showAnimatedPopup(
            "🎯 Metrics Vaulted", 
            "Your performance assessment attempt metrics have been safely written onto your master profile dashboard logs!",
            () => {
                saveHistoryBtn.disabled = true;
                saveHistoryBtn.innerText = "✓ Record Saved";
                saveHistoryBtn.style.backgroundColor = "#64748b";
                updateHistoryDashboardTable();
            },
            false
        );
    });
}

// Initial load rendering task for the dashboard table
updateHistoryDashboardTable();

// 3. WhatsApp Score Share Feature
const shareBtn = document.getElementById("share-whatsapp-btn");
if (shareBtn) {
    shareBtn.addEventListener("click", () => {
        const messageText = `🔥 I just completed the QuizMaster Pro Assessment!\n\n` +
                            `👤 Student: ${studentName}\n` +
                            `🎯 Score: ${score}/${totalQuestions} (${percentage}%)\n` +
                            `💻 Tracks Covered: Frontend Web Dev & Cybersecurity Essentials\n\n` +
                            `Think you can match my score? Let's see you try!`;
        
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
        window.open(whatsappUrl, "_blank");
    });
}

// 4. Secure Session Discard & Logout Redirect
const logoutBtn = document.getElementById("logout-nav-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // REPLACED WITH THE INTERACTIVE POPUP ENGINE
        showAnimatedPopup(
            "🔒 Discard Active Session", 
            "Are you completely certain you want to tear down your local terminal keys and completely log out of your session dashboard?", 
            () => {
                localStorage.removeItem("currentStudentName");
                localStorage.removeItem("currentStudentID");
                localStorage.removeItem("quizScore");
                localStorage.removeItem("quizTimeLeftAtEnd");
                localStorage.removeItem("savedUserAnswers");
                localStorage.removeItem("savedQuizBank");
                
                window.location.assign("./index (1).html");
            },
            true
        );
    });
}


// =========================================================================
// --- CUSTOM ANIMATED MODAL INJECTOR ENGINE (SUPPORT INFOS & CONFIRMS) ---
// =========================================================================
function showAnimatedPopup(title, message, onConfirm, isConfirmation = false) {
    const overlay = document.createElement("div");
    overlay.className = "custom-popup-overlay";
    
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