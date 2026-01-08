// Keyboard shortcuts for better UX
(function() {
    'use strict';
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const cityInput = document.getElementById('cityInput');
            if (cityInput) {
                cityInput.focus();
                cityInput.select();
            }
        }
        
        // Ctrl/Cmd + H: Focus history search
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            const historySearch = document.getElementById('historySearch');
            if (historySearch) {
                historySearch.focus();
                historySearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Ctrl/Cmd + E: Export history
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            const exportBtn = document.getElementById('exportHistory');
            if (exportBtn) {
                exportBtn.click();
            }
        }
        
        // Ctrl/Cmd + I: Import history
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            const importBtn = document.getElementById('importHistory');
            if (importBtn) {
                importBtn.click();
            }
        }
        
        // Esc: Clear filters
        if (e.key === 'Escape') {
            const historySearch = document.getElementById('historySearch');
            const allergenFilter = document.getElementById('historyAllergenFilter');
            const dateFrom = document.getElementById('historyDateFrom');
            const dateTo = document.getElementById('historyDateTo');
            
            let needsUpdate = false;
            const updates = {};
            
            if (historySearch && historySearch.value) {
                historySearch.value = '';
                updates.search = '';
                needsUpdate = true;
            }
            if (allergenFilter && allergenFilter.value) {
                allergenFilter.value = '';
                updates.allergen = '';
                needsUpdate = true;
            }
            if (dateFrom && dateFrom.value) {
                dateFrom.value = '';
                updates.dateFrom = '';
                needsUpdate = true;
            }
            if (dateTo && dateTo.value) {
                dateTo.value = '';
                updates.dateTo = '';
                needsUpdate = true;
            }
            
            // Call filterHistory once with all updates
            if (needsUpdate && window.filterHistory) {
                window.filterHistory(updates);
            }
        }
        
        // ? or /: Show keyboard shortcuts help
        if (e.key === '?' || e.key === '/') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                showKeyboardShortcuts();
            }
        }
    });
    
    // Show keyboard shortcuts modal
    function showKeyboardShortcuts() {
        const translateText = window.translateText || ((text) => text);
        
        const modal = document.createElement('div');
        modal.id = 'shortcutsModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0;">⌨️ ${translateText('Keyboard Shortcuts')}</h2>
                    <button onclick="this.closest('#shortcutsModal').remove()" style="background: transparent; border: none; font-size: 1.5em; cursor: pointer; color: #666;">×</button>
                </div>
                
                <div style="display: grid; gap: 15px;">
                    <div class="shortcut-item">
                        <kbd>Ctrl/⌘ + K</kbd>
                        <span>${translateText('Focus city search')}</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl/⌘ + H</kbd>
                        <span>${translateText('Focus history search')}</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl/⌘ + E</kbd>
                        <span>${translateText('Export history')}</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl/⌘ + I</kbd>
                        <span>${translateText('Import history')}</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>${translateText('Clear filters')}</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>?</kbd>
                        <span>${translateText('Show this help')}</span>
                    </div>
                </div>
                
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .shortcut-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        background: #f5f5f5;
                        border-radius: 5px;
                    }
                    .shortcut-item kbd {
                        background: #fff;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 5px 10px;
                        font-family: monospace;
                        font-size: 0.9em;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .shortcut-item span {
                        flex: 1;
                        margin-left: 15px;
                        color: #555;
                    }
                </style>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on Escape
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    // Add keyboard shortcuts hint button
    document.addEventListener('DOMContentLoaded', function() {
        const footer = document.querySelector('.site-footer .footer-content');
        if (footer) {
            const helpBtn = document.createElement('button');
            helpBtn.textContent = '⌨️ Keyboard Shortcuts';
            helpBtn.style.cssText = `
                background: transparent;
                border: none;
                color: inherit;
                cursor: pointer;
                text-decoration: underline;
                margin-left: 15px;
            `;
            helpBtn.onclick = showKeyboardShortcuts;
            footer.appendChild(document.createTextNode(' | '));
            footer.appendChild(helpBtn);
        }
    });
})();
