// Password Configuration
const CORRECT_PASSWORD = 'emily';
const SESSION_KEY = 'watchlist_authenticated';

// Check if user is already authenticated on page load
window.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = sessionStorage.getItem(SESSION_KEY);
    
    if (isAuthenticated === 'true') {
        showWatchlist();
    } else {
        // Focus on password input
        document.getElementById('password-input').focus();
    }
    
    // Allow Enter key to submit password
    document.getElementById('password-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});

// Check password function
function checkPassword() {
    const input = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const password = input.value;
    
    if (password === CORRECT_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        showWatchlist();
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
        input.value = '';
        input.focus();
        
        // Shake animation
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
}

// Show watchlist content
function showWatchlist() {
    document.getElementById('password-overlay').style.display = 'none';
    document.getElementById('watchlist-content').classList.remove('hidden');
}

// Logout function
function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    document.getElementById('watchlist-content').classList.add('hidden');
    document.getElementById('password-overlay').style.display = 'flex';
    document.getElementById('password-input').value = '';
    document.getElementById('error-message').textContent = '';
    document.getElementById('password-input').focus();
}

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
