// =========================================================================
// --- CUSTOM ANIMATED POPUP MODAL ENGINE ---
// =========================================================================
function showAnimatedPopup(title, message, onConfirm) {
    // 1. Build the raw HTML structure directly in memory
    const overlay = document.createElement("div");
    overlay.className = "custom-popup-overlay";
    
    overlay.innerHTML = `
        <div class="custom-popup-box">
            <div class="custom-popup-title">${title}</div>
            <div class="custom-popup-msg">${message}</div>
            <button class="custom-popup-btn" id="modal-close-trigger">Acknowledge</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 2. Trigger the animations by adding the CSS active class on the next rendering tick
    setTimeout(() => {
        overlay.classList.add("active");
    }, 10);
    
    // 3. Listen for the user clicking the button to dismiss the modal smoothly
    const closeBtn = overlay.querySelector("#modal-close-trigger");
    if (closeBtn) {
        closeBtn.focus();
        closeBtn.addEventListener("click", () => {
            overlay.classList.remove("active");
            setTimeout(() => {
                overlay.remove(); // Completely clear from HTML memory
                if (onConfirm) onConfirm(); // Fire any redirect codes smoothly!
            }, 300); // Smooth 300ms fade away
        });
    }
}

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nameInput = document.getElementById('signup-name').value.trim();
    const idInput = document.getElementById('signup-id').value.trim();

    // 1. Pull existing registered students from localStorage
    let storedStudents = JSON.parse(localStorage.getItem('registeredStudents')) || [];

    // 2. Check if the ID number is already taken
    const idExists = storedStudents.some(student => student.id === idInput);

    if (idExists) {
        // REPLACED WITH AN ANIMATED POPUP MODAL
        showAnimatedPopup(
            "⚠️ Profile Conflict", 
            "This Student ID number is already registered within our local database ledger! Please log in or verify your entry.",
            () => {
                document.getElementById('signup-id').focus();
            }
        );
        return;
    }

    // 3. Create the new student object and save it to the master list
    const newStudent = { name: nameInput, id: idInput };
    storedStudents.push(newStudent);
    localStorage.setItem('registeredStudents', JSON.stringify(storedStudents));

    // 4. AUTOMATIC LOGIN: Immediately set their active login session keys
    localStorage.setItem("currentStudentName", newStudent.name);
    localStorage.setItem("currentStudentID", newStudent.id);
    
    // Clear any residual scores from past sessions
    localStorage.removeItem("quizScore");

    // 5. Instantly jump directly to the quiz page using our smooth animated engine!
    showAnimatedPopup(
        "🚀 Profile Synchronized", 
        `Welcome aboard, ${newStudent.name}! Your workspace environment keys have been registered. Launching assessment dashboard...`,
        () => {
            window.location.href = "quiz.html";
        }
    );
});