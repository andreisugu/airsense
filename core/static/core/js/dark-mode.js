// Dark Mode functionality with localStorage persistence
(function() {
    'use strict';
    
    // Check for saved dark mode preference or default to light mode
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    
    // Apply dark mode on page load if it was previously enabled
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }
    
    // Function to toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
        
        // Update button icon
        updateDarkModeButton();
    }
    
    // Function to update the dark mode button icon
    function updateDarkModeButton() {
        const darkModeButton = document.getElementById('darkModeToggle');
        if (!darkModeButton) return;
        
        const icon = darkModeButton.querySelector('.icon');
        if (document.body.classList.contains('dark-mode')) {
            icon.textContent = '☀️';
            darkModeButton.setAttribute('aria-label', 'Switch to light mode');
            darkModeButton.setAttribute('title', 'Switch to light mode');
        } else {
            icon.textContent = '🌙';
            darkModeButton.setAttribute('aria-label', 'Switch to dark mode');
            darkModeButton.setAttribute('title', 'Switch to dark mode');
        }
    }
    
    // Initialize dark mode button when DOM is ready
    function initDarkModeButton() {
        const darkModeButton = document.getElementById('darkModeToggle');
        if (!darkModeButton) {
            console.warn('Dark mode toggle button not found');
            return;
        }
        
        // Add click event listener
        darkModeButton.addEventListener('click', toggleDarkMode);
        
        // Set initial icon
        updateDarkModeButton();
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkModeButton);
    } else {
        initDarkModeButton();
    }
    
    // Make toggleDarkMode available globally for potential external use
    window.toggleDarkMode = toggleDarkMode;
})();
