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
                if (onConfirm) onConfirm(); // Fire any redirect codes or dashboard updates smoothly!
            }, 300); // 300ms matches the smooth fade out beautifully
        });
    }
}

// Target the login form element from index.html
const loginForm = document.getElementById('login-form');

// Listen for when the student clicks "Login" or presses Enter
loginForm.addEventListener('submit', function(event) {
    // Stop the page from instantly reloading or redirecting automatically
    event.preventDefault(); 
    
    // Grab the ID typed by the user and trim off any accidental spaces
    const enteredID = document.getElementById('student-id').value.trim();
    
    // 1. Fetch the dynamic list of registered students from localStorage
    // If no one has signed up yet, default to an empty array []
    const storedStudents = JSON.parse(localStorage.getItem('registeredStudents')) || [];
    
    // 2. Check if the entered ID matches any student in our registered list
    const matchedStudent = storedStudents.find(student => student.id === enteredID);
    
    if (matchedStudent) {
        // ID verified! Save their individual session data to localStorage
        localStorage.setItem("currentStudentName", matchedStudent.name);
        localStorage.setItem("currentStudentID", matchedStudent.id);
        
        // Clear any leftover scores from a previous quiz attempt
        localStorage.removeItem("quizScore"); 
        
        // Take them straight to the quiz panel
        window.location.href = "quiz.html";
    } else {
        // ID doesn't exist in localStorage - REPLACED WITH ANIMATED MODAL
        showAnimatedPopup(
            "🔒 Access Denied", 
            "The Student ID entered was not recognized. Please verify your credentials or register a new profile below!",
            () => {
                // Keep them on the page so they can try again or click sign up
                document.getElementById('student-id').focus();
            }
        );
    }
});