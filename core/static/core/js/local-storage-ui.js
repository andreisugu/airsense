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
    
    // Import history
    function importHistoryData() {
        if (!window.airsenseStorage) return;
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // Validate data structure
                    if (!Array.isArray(data)) {
                        alert('Invalid history file format. Expected an array of interactions.');
                        return;
                    }
                    
                    // Merge with existing history
                    const existingHistory = window.airsenseStorage.getHistory();
                    const mergedHistory = [...data, ...existingHistory];
                    
                    // Remove duplicates based on timestamp
                    const uniqueHistory = mergedHistory.filter((item, index, self) =>
                        index === self.findIndex(t => t.timestamp === item.timestamp)
                    );
                    
                    // Sort by timestamp (newest first)
                    uniqueHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    // Keep only last 50
                    const trimmedHistory = uniqueHistory.slice(0, 50);
                    
                    // Save to localStorage
                    localStorage.setItem('airsense_history', JSON.stringify(trimmedHistory));
                    
                    // Refresh display
                    displayHistory();
                    
                    if (window.showToast) {
                        window.showToast(`Successfully imported ${data.length} interactions!`, 'success');
                    }
                } catch (error) {
                    console.error('Error importing history:', error);
                    if (window.showToast) {
                        window.showToast('Error importing history. Please ensure the file is a valid AirSense history export.', 'error');
                    }
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // Filter history by search term
    let currentFilter = { search: '', allergen: '', dateFrom: '', dateTo: '' };
    
    function filterHistory(options = {}) {
        currentFilter = { ...currentFilter, ...options };
        
        if (!window.airsenseStorage) return;
        
        let history = window.airsenseStorage.getHistory();
        const container = document.getElementById('historyList');
        
        if (!container) return;
        
        // Apply filters
        if (currentFilter.search) {
            const searchLower = currentFilter.search.toLowerCase();
            history = history.filter(item => 
                item.feeling.toLowerCase().includes(searchLower) ||
                item.sentiment.toLowerCase().includes(searchLower)
            );
        }
        
        if (currentFilter.allergen) {
            history = history.filter(item => 
                item.allergies && item.allergies.includes(currentFilter.allergen)
            );
        }
        
        if (currentFilter.dateFrom) {
            const fromDate = new Date(currentFilter.dateFrom);
            history = history.filter(item => new Date(item.timestamp) >= fromDate);
        }
        
        if (currentFilter.dateTo) {
            const toDate = new Date(currentFilter.dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            history = history.filter(item => new Date(item.timestamp) <= toDate);
        }
        
        // Display filtered results
        if (history.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">No interactions match your filters.</p>';
            return;
        }
        
        // Use the same display logic but with filtered data
        displayFilteredHistory(history);
    }
    
    function displayFilteredHistory(history) {
        const container = document.getElementById('historyList');
        if (!container) return;
        
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
    
    // Calculate statistics from history
    function calculateStatistics() {
        if (!window.airsenseStorage) return null;
        
        const history = window.airsenseStorage.getHistory();
        
        if (history.length === 0) return null;
        
        const stats = {
            totalInteractions: history.length,
            positiveCount: 0,
            negativeCount: 0,
            allergyCount: {},
            riskLevels: { Critical: 0, 'High Risk': 0, Proactive: 0, Clear: 0, Maintenance: 0 },
            avgConfidence: 0
        };
        
        let totalConfidence = 0;
        
        history.forEach(item => {
            // Count sentiments
            if (item.sentiment === 'POSITIVE') stats.positiveCount++;
            if (item.sentiment === 'NEGATIVE') stats.negativeCount++;
            
            // Count allergies
            if (item.allergies) {
                item.allergies.forEach(allergy => {
                    stats.allergyCount[allergy] = (stats.allergyCount[allergy] || 0) + 1;
                });
            }
            
            // Count risk levels
            if (item.alertLevel && item.alertLevel.level) {
                const level = item.alertLevel.level;
                if (stats.riskLevels[level] !== undefined) {
                    stats.riskLevels[level]++;
                }
            }
            
            // Sum confidence
            totalConfidence += item.confidence || 0;
        });
        
        stats.avgConfidence = (totalConfidence / history.length * 100).toFixed(1);
        
        return stats;
    }
    
    // Display statistics
    function displayStatistics() {
        const stats = calculateStatistics();
        const statsContainer = document.getElementById('statisticsContainer');
        
        if (!statsContainer || !stats) return;
        
        const positivePercent = ((stats.positiveCount / stats.totalInteractions) * 100).toFixed(1);
        const negativePercent = ((stats.negativeCount / stats.totalInteractions) * 100).toFixed(1);
        
        // Find most common allergy
        let mostCommonAllergy = 'None';
        let maxCount = 0;
        Object.keys(stats.allergyCount).forEach(allergy => {
            if (stats.allergyCount[allergy] > maxCount) {
                maxCount = stats.allergyCount[allergy];
                mostCommonAllergy = allergy;
            }
        });
        
        const translateText = window.translateText || ((text) => text);
        
        statsContainer.innerHTML = `
            <div class="statistics-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalInteractions}</div>
                    <div class="stat-label">${translateText('Total Interactions')}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${positivePercent}%</div>
                    <div class="stat-label">${translateText('Positive Sentiment')}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${negativePercent}%</div>
                    <div class="stat-label">${translateText('Negative Sentiment')}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.avgConfidence}%</div>
                    <div class="stat-label">${translateText('Avg Confidence')}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${mostCommonAllergy}</div>
                    <div class="stat-label">${translateText('Top Allergy')}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.riskLevels.Critical + stats.riskLevels['High Risk']}</div>
                    <div class="stat-label">${translateText('High Risk Days')}</div>
                </div>
            </div>
        `;
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Display initial data
        displayRecentCities();
        displayHistory();
        displayStatistics();
        
        // Setup event listeners
        const clearBtn = document.getElementById('clearHistory');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearHistoryWithConfirm);
        }
        
        const exportBtn = document.getElementById('exportHistory');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportHistoryData);
        }
        
        const importBtn = document.getElementById('importHistory');
        if (importBtn) {
            importBtn.addEventListener('click', importHistoryData);
        }
        
        // History filter listeners
        const searchInput = document.getElementById('historySearch');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                filterHistory({ search: e.target.value });
            });
        }
        
        const allergenFilter = document.getElementById('historyAllergenFilter');
        if (allergenFilter) {
            allergenFilter.addEventListener('change', function(e) {
                filterHistory({ allergen: e.target.value });
            });
        }
        
        const dateFromFilter = document.getElementById('historyDateFrom');
        if (dateFromFilter) {
            dateFromFilter.addEventListener('change', function(e) {
                filterHistory({ dateFrom: e.target.value });
            });
        }
        
        const dateToFilter = document.getElementById('historyDateTo');
        if (dateToFilter) {
            dateToFilter.addEventListener('change', function(e) {
                filterHistory({ dateTo: e.target.value });
            });
        }
        
        // Listen for updates to history
        const originalSubmit = document.getElementById('feelingForm');
        if (originalSubmit) {
            originalSubmit.addEventListener('submit', function() {
                // Delay to allow the form to be processed
                setTimeout(() => {
                    displayHistory();
                    displayStatistics();
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
    window.updateStatisticsDisplay = displayStatistics;
    window.filterHistory = filterHistory;
})();
