// Simple client-side sentiment analysis for static GitHub Pages version
(function() {
    'use strict';
    
    // Simple sentiment analysis using keyword matching
    function analyzeSentiment(text) {
        const lowerText = text.toLowerCase();
        
        // Positive keywords
        const positiveWords = [
            'good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'perfect',
            'happy', 'fine', 'well', 'better', 'best', 'love', 'enjoy', 'pleasant',
            'comfortable', 'calm', 'relaxed', 'energetic', 'healthy', 'fresh', 'clear',
            'bine', 'minunat', 'excelent', 'fericit', 'perfect' // Romanian words
        ];
        
        // Negative keywords
        const negativeWords = [
            'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'hate', 'pain',
            'sick', 'ill', 'unwell', 'worse', 'tired', 'exhausted', 'stuffy', 'congested',
            'itchy', 'sneezing', 'coughing', 'difficulty', 'breathing', 'headache',
            'miserable', 'suffering', 'uncomfortable', 'irritated', 'watery', 'eyes',
            'rau', 'groaznic', 'bolnav', 'obosit', 'durere' // Romanian words
        ];
        
        let positiveScore = 0;
        let negativeScore = 0;
        
        // Count positive words
        positiveWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\w*\\b', 'gi');
            const matches = lowerText.match(regex);
            if (matches) {
                positiveScore += matches.length;
            }
        });
        
        // Count negative words
        negativeWords.forEach(word => {
            const regex = new RegExp('\\b' + word + '\\w*\\b', 'gi');
            const matches = lowerText.match(regex);
            if (matches) {
                negativeScore += matches.length;
            }
        });
        
        // Determine sentiment
        let sentiment, confidence;
        
        if (negativeScore > positiveScore) {
            sentiment = 'NEGATIVE';
            const total = positiveScore + negativeScore;
            confidence = total > 0 ? negativeScore / total : 0.6;
        } else if (positiveScore > negativeScore) {
            sentiment = 'POSITIVE';
            const total = positiveScore + negativeScore;
            confidence = total > 0 ? positiveScore / total : 0.6;
        } else {
            // If no clear sentiment or equal, default to neutral/positive
            sentiment = 'POSITIVE';
            confidence = 0.5;
        }
        
        return { sentiment, confidence: Math.min(confidence, 0.99) };
    }
    
    // Make recommendation based on sentiment and pollen data
    function makeRecommendation(pollenLevels, sentiment, selectedPollens) {
        const recommendations = [];
        
        selectedPollens.forEach(pollen => {
            const pollenKey = `${pollen}_pollen`;
            if (pollenKey in pollenLevels && pollenLevels[pollenKey]) {
                // Calculate average for the day (all 24 hours)
                const dailyValues = pollenLevels[pollenKey].filter(val => val !== null && val !== undefined);
                if (dailyValues.length > 0) {
                    const avgPollen = dailyValues.reduce((sum, val) => sum + val, 0) / dailyValues.length;
                    
                    // Pollen level categories
                    const pollenLow = avgPollen < 21;
                    const pollenMedium = avgPollen >= 21 && avgPollen < 51;
                    const pollenHigh = avgPollen >= 51;
                    
                    // Generate recommendation for this specific pollen
                    const pollenName = pollen.charAt(0).toUpperCase() + pollen.slice(1);
                    let tip;
                    
                    if (sentiment === 'POSITIVE') {
                        if (pollenHigh) {
                            tip = `${pollenName}: You are feeling well today, but there are high levels of ${pollen} pollen in the air, take precautions.`;
                        } else if (pollenMedium) {
                            tip = `${pollenName}: You are feeling well today, but there are moderate levels of ${pollen} pollen in the air, take precautions.`;
                        } else {
                            tip = `${pollenName}: Low levels of ${pollen} pollen today and you are feeling well, there should be no issues!`;
                        }
                    } else {
                        if (pollenHigh) {
                            tip = `${pollenName}: Feeling unwell and high ${pollen} pollen today. Avoid going outside and take medication if needed.`;
                        } else if (pollenMedium) {
                            tip = `${pollenName}: Feeling unwell and moderate ${pollen} pollen today. Avoid going outside and take care.`;
                        } else {
                            tip = `${pollenName}: Feeling unwell but ${pollen} pollen is low. Should be safe outside and symptoms should get better.`;
                        }
                    }
                    
                    recommendations.push(tip);
                }
            }
        });
        
        return recommendations;
    }
    
    // Calculate risk analysis
    function calculateRiskAnalysis(pollenData, selectedPollens) {
        if (!pollenData || !pollenData.hourly) {
            return {};
        }
        
        const hourly = pollenData.hourly;
        const analysis = {};
        
        selectedPollens.forEach(pollen => {
            const pollenKey = `${pollen}_pollen`;
            if (!(pollenKey in hourly)) {
                return;
            }
            
            const values = hourly[pollenKey];
            const times = hourly.time;
            
            // Today (first 24 hours)
            const todayValues = values.slice(0, 24).filter(v => v !== null && v !== undefined);
            const todayTimes = times.slice(0, 24);
            
            // Tomorrow (next 24 hours)
            const tomorrowValues = values.slice(24, 48).filter(v => v !== null && v !== undefined);
            const tomorrowTimes = times.slice(24, 48);
            
            let todayAvg = 0, todayMax = 0, todayPeakTime = 'N/A', todayRisk = 'Low';
            if (todayValues.length > 0) {
                todayAvg = todayValues.reduce((sum, v) => sum + v, 0) / todayValues.length;
                todayMax = Math.max(...todayValues);
                const todayPeakIdx = values.slice(0, 24).indexOf(todayMax);
                todayPeakTime = todayPeakIdx >= 0 ? todayTimes[todayPeakIdx].split('T')[1].substring(0, 5) : 'N/A';
                todayRisk = todayAvg < 21 ? 'Low' : todayAvg < 51 ? 'Medium' : 'High';
            }
            
            let tomorrowAvg = 0, tomorrowMax = 0, tomorrowPeakTime = 'N/A', tomorrowRisk = 'Low';
            if (tomorrowValues.length > 0) {
                tomorrowAvg = tomorrowValues.reduce((sum, v) => sum + v, 0) / tomorrowValues.length;
                tomorrowMax = Math.max(...tomorrowValues);
                const tomorrowPeakIdx = values.slice(24, 48).indexOf(tomorrowMax);
                tomorrowPeakTime = tomorrowPeakIdx >= 0 ? tomorrowTimes[tomorrowPeakIdx].split('T')[1].substring(0, 5) : 'N/A';
                tomorrowRisk = tomorrowAvg < 21 ? 'Low' : tomorrowAvg < 51 ? 'Medium' : 'High';
            }
            
            analysis[pollen] = {
                today: {
                    risk: todayRisk,
                    avg: Math.round(todayAvg * 10) / 10,
                    peak_value: todayMax,
                    peak_time: todayPeakTime
                },
                tomorrow: {
                    risk: tomorrowRisk,
                    avg: Math.round(tomorrowAvg * 10) / 10,
                    peak_value: tomorrowMax,
                    peak_time: tomorrowPeakTime
                }
            };
        });
        
        return analysis;
    }
    
    // Get alert level based on sentiment and risk analysis
    function getAlertLevel(sentiment, riskAnalysis) {
        if (!riskAnalysis || Object.keys(riskAnalysis).length === 0) {
            return null;
        }
        
        const todayHighCount = Object.values(riskAnalysis).filter(p => p.today.risk === 'High').length;
        const tomorrowHighCount = Object.values(riskAnalysis).filter(p => p.tomorrow.risk === 'High').length;
        const todayLowCount = Object.values(riskAnalysis).filter(p => p.today.risk === 'Low').length;
        
        const symptomsHigh = sentiment === 'NEGATIVE';
        const pollenHighToday = todayHighCount > 0;
        const pollenLowToday = todayLowCount === Object.keys(riskAnalysis).length;
        const forecastRising = tomorrowHighCount > todayHighCount;
        
        if (symptomsHigh && (pollenHighToday || !pollenLowToday)) {
            return {
                level: 'Critical',
                icon: '🚨',
                title: 'CRITICAL THREAT: Symptoms are spiking severely!',
                tips: [
                    'Rescue Action: Take rescue medication and perform a full saline nasal rinse immediately.',
                    'Find Cause: Check your other triggers if the listed triggers are low.',
                    'No Outdoors: Do not go outside until your symptoms are under control. Run the HEPA filter on maximum.'
                ]
            };
        } else if (pollenHighToday && !symptomsHigh) {
            return {
                level: 'High Risk',
                icon: '⚠️',
                title: 'High Risk Today: Pollen is high, but you\'re handling it well!',
                tips: [
                    'Stay Protected: Wear a hat and sunglasses if you go outside to shield your face and eyes.',
                    'Indoor Safety: Use the recirculate setting on your car A/C.',
                    'Change Clothes: Immediately change out of clothes worn outside to avoid tracking pollen indoors.'
                ]
            };
        } else if (pollenLowToday && forecastRising) {
            return {
                level: 'Proactive',
                icon: '🟢',
                title: 'Prepare for Spike: Pollen is low now, but we forecast a major rise in the next 48 hours.',
                tips: [
                    'Medicate Early: Start your full dose of medication today for maximum effect when the count spikes.',
                    'Clean Air: Run your HEPA filter now to purify indoor air before the threat arrives.',
                    'Avoid Laundry: Plan to dry all laundry indoors for the next three days.'
                ]
            };
        } else if (pollenLowToday && !symptomsHigh) {
            return {
                level: 'Clear',
                icon: '✅',
                title: 'All Clear: All your triggers are very low.',
                tips: [
                    'Enjoy Outdoors: A great day for a longer walk or light exercise.',
                    'Home Prep: Change filters now while the air is clear.',
                    'Consistency: Don\'t skip your preventative nasal spray even on a good day.'
                ]
            };
        } else {
            return {
                level: 'Maintenance',
                icon: '🔄',
                title: 'Stick to Routine: Low counts, but consistency is key to symptom control.',
                tips: [
                    'Rinse: Use a simple saline nasal spray before bed to clear out minor irritants.',
                    'Review: Are you following your treatment plan exactly? Small lapses can cause minor symptoms.',
                    'Check Indoor: Run your dehumidifier to control mold/dust mite levels.'
                ]
            };
        }
    }
    
    // Override the feeling form submission for static version
    document.addEventListener('DOMContentLoaded', function() {
        const feelingForm = document.getElementById('feelingForm');
        if (feelingForm) {
            // Remove existing listener and add new one
            const newForm = feelingForm.cloneNode(true);
            feelingForm.parentNode.replaceChild(newForm, feelingForm);
            
            newForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const feelingText = document.getElementById('feelingText').value;
                const selectedPollens = Array.from(document.querySelectorAll('input[name="pollens"]:checked')).map(cb => cb.value);
                
                if (!feelingText.trim()) {
                    alert('Please describe how you feel today.');
                    return;
                }
                
                if (selectedPollens.length === 0) {
                    alert('Please select at least one pollen allergen.');
                    return;
                }
                
                // Perform sentiment analysis
                const { sentiment, confidence } = analyzeSentiment(feelingText);
                
                // Get pollen data for 2 days
                const lat = window.currentLat || 44.3302;
                const lon = window.currentLon || 23.7949;
                const pollenUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&forecast_days=2`;
                
                fetch(pollenUrl)
                    .then(response => response.json())
                    .then(pollenData => {
                        const pollenLevels = pollenData.hourly || {};
                        
                        // Calculate risk analysis
                        const riskAnalysis = calculateRiskAnalysis(pollenData, selectedPollens);
                        
                        // Get alert level
                        const alertLevel = getAlertLevel(sentiment, riskAnalysis);
                        
                        // Generate recommendations
                        const recommendations = makeRecommendation(pollenLevels, sentiment, selectedPollens);
                        
                        // Display results
                        displayResults(sentiment, confidence, riskAnalysis, alertLevel, recommendations);
                    })
                    .catch(error => {
                        console.error('Error fetching pollen data:', error);
                        document.getElementById('sentimentResult').innerHTML = '<div class="sentiment-neutral">Error fetching pollen data. Please try again.</div>';
                    });
            });
        }
    });
    
    function displayResults(sentiment, confidence, riskAnalysis, alertLevel, recommendations) {
        const resultDiv = document.getElementById('sentimentResult');
        const sentimentClass = sentiment.toLowerCase() === 'positive' ? 'sentiment-positive' : 
                              sentiment.toLowerCase() === 'negative' ? 'sentiment-negative' : 'sentiment-neutral';
        
        let alertHtml = '';
        if (alertLevel) {
            const tipsText = window.translateText ? window.translateText('Tips') : 'Tips';
            alertHtml = `
                <br><div style="margin: 15px 0; padding: 15px; background: #e8f4fd; border-left: 4px solid #007bff; border-radius: 5px;">
                    <strong>${alertLevel.icon} ${alertLevel.title}</strong><br>
                    <strong>${tipsText}:</strong>
                    <ol style="margin: 10px 0; padding-left: 20px;">
                        ${alertLevel.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ol>
                </div>
            `;
        }
        
        let combinedHtml = '';
        if (riskAnalysis && Object.keys(riskAnalysis).length > 0) {
            const analysisText = window.translateText ? window.translateText('Analysis & Recommendations') : 'Analysis & Recommendations';
            combinedHtml = `<br><strong>${analysisText}:</strong><br>`;
            Object.keys(riskAnalysis).forEach(pollen => {
                const analysis = riskAnalysis[pollen];
                const recommendation = recommendations.find(rec => rec.toLowerCase().includes(pollen.toLowerCase()));
                
                const pollenName = pollen.charAt(0).toUpperCase() + pollen.slice(1);
                const recommendationsText = window.translateText ? window.translateText('Pollen Recommendations') : 'Pollen Recommendations';
                const todayText = window.translateText ? window.translateText('Today') : 'Today';
                const tomorrowText = window.translateText ? window.translateText('Tomorrow') : 'Tomorrow';
                const riskText = window.translateText ? window.translateText('risk') : 'risk';
                const avgText = window.translateText ? window.translateText('avg') : 'avg';
                const peakText = window.translateText ? window.translateText('Peak at') : 'Peak at';
                
                combinedHtml += `
                    <div style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px;">
                        <strong>${pollenName} ${recommendationsText}:</strong><br>
                        ${recommendation ? `<p style="margin: 5px 0; font-style: italic;">${recommendation}</p>` : ''}
                        <strong>${todayText}:</strong> ${analysis.today.risk} ${riskText} (${avgText}: ${analysis.today.avg}), ${peakText} ${analysis.today.peak_time} (${analysis.today.peak_value})<br>
                        <strong>${tomorrowText}:</strong> ${analysis.tomorrow.risk} ${riskText} (${avgText}: ${analysis.tomorrow.avg}), ${peakText} ${analysis.tomorrow.peak_time} (${analysis.tomorrow.peak_value})
                    </div>
                `;
            });
        }
        
        const sentimentText = window.translateText ? window.translateText('Sentiment') : 'Sentiment';
        const confidenceText = window.translateText ? window.translateText('confidence') : 'confidence';
        
        resultDiv.innerHTML = `
            <div>
                ${sentimentText}: ${sentiment} (${Math.round(confidence * 100)}% ${confidenceText})
                ${alertHtml}
                ${combinedHtml}
            </div>
        `;
    }
})();
