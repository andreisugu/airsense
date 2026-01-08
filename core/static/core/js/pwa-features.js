// PWA Install and Enhanced Features
(function() {
    'use strict';
    
    let deferredPrompt;
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show install button
        showInstallPromotion();
    });
    
    // Show install promotion
    function showInstallPromotion() {
        const installContainer = document.getElementById('installPrompt');
        if (!installContainer) return;
        
        const translateText = window.translateText || ((text) => text);
        
        installContainer.innerHTML = `
            <div class="install-banner" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 15px; border-radius: 10px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);">
                <div style="flex: 1;">
                    <strong>📱 ${translateText('Install AirSense')}</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em;">${translateText('Install the app for quick access and offline support!')}</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button id="installButton" class="btn-install" style="background: white; color: #2196f3; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">${translateText('Install')}</button>
                    <button id="dismissInstall" style="background: transparent; color: white; border: 1px solid white; padding: 10px 15px; border-radius: 5px; cursor: pointer;">${translateText('Later')}</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('installButton').addEventListener('click', installApp);
        document.getElementById('dismissInstall').addEventListener('click', () => {
            installContainer.style.display = 'none';
            // Remember dismissal for 7 days
            localStorage.setItem('installPromptDismissed', Date.now());
        });
        
        // Check if previously dismissed within 7 days
        const dismissedTime = localStorage.getItem('installPromptDismissed');
        if (dismissedTime) {
            const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) {
                installContainer.style.display = 'none';
            }
        }
    }
    
    // Install app
    async function installApp() {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response to the install prompt: ${outcome}`);
        
        // Clear the deferred prompt
        deferredPrompt = null;
        
        // Hide the install promotion
        const installContainer = document.getElementById('installPrompt');
        if (installContainer) {
            installContainer.style.display = 'none';
        }
    }
    
    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
        console.log('AirSense was installed');
        deferredPrompt = null;
        
        const installContainer = document.getElementById('installPrompt');
        if (installContainer) {
            installContainer.style.display = 'none';
        }
        
        // Show success message
        showToast('AirSense installed successfully! 🎉', 'success');
    });
    
    // Toast notification system
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        toast.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: transparent; border: none; color: white; cursor: pointer; font-size: 1.2em; margin-left: 15px;">×</button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        return container;
    }
    
    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/airsense/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
    
    // Check online/offline status
    function updateOnlineStatus() {
        const statusIndicator = document.getElementById('onlineStatus');
        if (!statusIndicator) return;
        
        const translateText = window.translateText || ((text) => text);
        
        if (navigator.onLine) {
            statusIndicator.innerHTML = `<span style="color: #4caf50;">● ${translateText('Online')}</span>`;
        } else {
            statusIndicator.innerHTML = `<span style="color: #f44336;">● ${translateText('Offline')}</span>`;
            showToast(translateText('You are offline. Some features may be limited.'), 'info');
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
        updateOnlineStatus();
    });
    
    // Make functions globally available
    window.showToast = showToast;
    window.installApp = installApp;
})();
