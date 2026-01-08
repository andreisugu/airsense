// UI handling for localStorage features (history, recent cities, data management)
(function() {
    'use strict';
    
    // Display recent cities
    function displayRecentCities() {
        if (!window.airsenseStorage) return;
        
        const recentCities = window.airsenseStorage.getRecentCities();
        const container = document.getElementById('recentCitiesList');
        
        if (!container) return;
        
        if (recentCities.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">No recent cities yet. Search for a city to see it here.</p>';
            return;
        }
        
        container.innerHTML = recentCities.map(city => `
            <button class="recent-city-item" data-city='${JSON.stringify(city)}'>
                📍 ${city.name}, ${city.country}
            </button>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.recent-city-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const city = JSON.parse(this.dataset.city);
                if (typeof selectCity === 'function') {
                    selectCity(city);
                }
            });
        });
    }
    
    // Display history
    function displayHistory() {
        if (!window.airsenseStorage) return;
        
        const history = window.airsenseStorage.getHistory();
        const container = document.getElementById('historyList');
        
        if (!container) return;
        
        if (history.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;" data-translate="No interactions found. Start using the app to see your history here!">No interactions found. Start using the app to see your history here!</p>';
            return;
        }
        
        container.innerHTML = history.map((interaction, index) => {
            const date = new Date(interaction.timestamp);
            const dateStr = date.toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const timeStr = date.toLocaleTimeString(undefined, { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const sentimentClass = interaction.sentiment.toLowerCase() === 'positive' ? 'sentiment-positive' : 
                                  interaction.sentiment.toLowerCase() === 'negative' ? 'sentiment-negative' : 'sentiment-neutral';
            
            let alertHtml = '';
            if (interaction.alertLevel) {
                const tipsHtml = interaction.alertLevel.tips.map(tip => `<li>${tip}</li>`).join('');
                alertHtml = `
                    <div class="alert-level" style="margin: 10px 0; padding: 10px; background: #e8f4fd; border-left: 4px solid #007bff; border-radius: 5px;">
                        <strong>${interaction.alertLevel.icon} ${interaction.alertLevel.title}</strong>
                        <ul style="margin: 5px 0; padding-left: 20px; font-size: 0.9em;">
                            ${tipsHtml}
                        </ul>
                    </div>
                `;
            }
            
            let riskHtml = '';
            if (interaction.riskAnalysis && Object.keys(interaction.riskAnalysis).length > 0) {
                riskHtml = '<div class="risk-analysis" style="margin: 10px 0;">';
                Object.keys(interaction.riskAnalysis).forEach(pollen => {
                    const analysis = interaction.riskAnalysis[pollen];
                    const pollenName = pollen.charAt(0).toUpperCase() + pollen.slice(1);
                    riskHtml += `
                        <div style="margin: 5px 0; padding: 8px; background: #f9f9f9; border-radius: 3px; font-size: 0.9em;">
                            <strong>${pollenName}:</strong> 
                            Today: ${analysis.today.risk} risk (avg: ${analysis.today.avg}) | 
                            Tomorrow: ${analysis.tomorrow.risk} risk (avg: ${analysis.tomorrow.avg})
                        </div>
                    `;
                });
                riskHtml += '</div>';
            }
            
            return `
                <div class="history-card">
                    <div class="card-header">
                        <span class="date">${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span class="time">${timeStr}</span>
                    </div>
                    
                    <div class="card-body">
                        <div class="interaction-date">${dateStr}</div>
                        
                        <div class="user-feeling">
                            <strong>Feeling:</strong> ${escapeHtml(interaction.feeling)}
                        </div>
                        
                        <div class="sentiment-info ${sentimentClass}" style="margin: 10px 0;">
                            <strong>Sentiment:</strong> 
                            ${interaction.sentiment} (${Math.round(interaction.confidence * 100)}% confidence)
                        </div>
                        
                        <div class="allergies-tags">
                            ${interaction.allergies.map(allergy => 
                                `<span class="allergy-tag" style="background: #007bff; color: white; padding: 3px 8px; border-radius: 3px; margin-right: 5px; display: inline-block;">${allergy}</span>`
                            ).join('')}
                        </div>
                        
                        ${alertHtml}
                        ${riskHtml}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Clear history with confirmation
    function clearHistoryWithConfirm() {
        if (!window.airsenseStorage) return;
        
        const translateText = window.translateText || ((text) => text);
        const message = translateText('Are you sure you want to clear all history? This action cannot be undone.');
        
        if (confirm(message)) {
            if (window.airsenseStorage.clearHistory()) {
                displayHistory();
                alert(translateText('History cleared successfully!'));
            } else {
                alert(translateText('Error clearing history. Please try again.'));
            }
        }
    }
    
    // Export history
    function exportHistoryData() {
        if (!window.airsenseStorage) return;
        
        window.airsenseStorage.exportHistory();
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Display initial data
        displayRecentCities();
        displayHistory();
        
        // Setup event listeners
        const clearBtn = document.getElementById('clearHistory');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearHistoryWithConfirm);
        }
        
        const exportBtn = document.getElementById('exportHistory');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportHistoryData);
        }
        
        // Listen for updates to history
        const originalSubmit = document.getElementById('feelingForm');
        if (originalSubmit) {
            originalSubmit.addEventListener('submit', function() {
                // Delay to allow the form to be processed
                setTimeout(() => {
                    displayHistory();
                }, 1000);
            });
        }
        
        // Update recent cities when city is selected
        const cityInput = document.getElementById('cityInput');
        if (cityInput) {
            // Listen for city selection events
            document.addEventListener('citySelected', function() {
                displayRecentCities();
            });
        }
    });
    
    // Make functions globally available for external calls
    window.updateHistoryDisplay = displayHistory;
    window.updateRecentCitiesDisplay = displayRecentCities;
})();
