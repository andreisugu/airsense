// Simple translation system
(function() {
    'use strict';
    
    const translations = {
        en: {
            'Weather & Pollen Tracker': 'Weather & Pollen Tracker',
        'Weather Forecast': 'Weather Forecast',
        'Pollen Forecast': 'Pollen Forecast',
        'Pollen Allergies': 'Pollen Allergies',
        'How do you feel today?': 'How do you feel today?',
        'Enter city name...': 'Enter city name...',
        'Search': 'Search',
        'Submit': 'Submit',
        'Describe how you feel today...': 'Describe how you feel today...',
        'Your History': 'Your History',
        'Feeling:': 'Feeling:',
        'Recommendations:': 'Recommendations:',
        'No interactions found. Start using the app to see your history here!': 'No interactions found. Start using the app to see your history here!',
        'Hourly Forecast': 'Hourly Forecast',
        'Hour': 'Hour',
        'Temperature': 'Temperature',
        'Humidity': 'Humidity',
        'Wind Speed': 'Wind Speed',
        'Condition': 'Condition',
        'Hourly Pollen Forecast': 'Hourly Pollen Forecast',
        'Alder': 'Alder',
        'Birch': 'Birch',
        'Grass': 'Grass',
        'Mugwort': 'Mugwort',
        'Olive': 'Olive',
        'Ragweed': 'Ragweed',
        'Alder Pollen': 'Alder Pollen',
        'Birch Pollen': 'Birch Pollen',
        'Grass Pollen': 'Grass Pollen',
        'Mugwort Pollen': 'Mugwort Pollen',
        'Olive Pollen': 'Olive Pollen',
        'Ragweed Pollen': 'Ragweed Pollen',
        'Today': 'Today',
        'Sun': 'Sun',
        'Mon': 'Mon',
        'Tue': 'Tue',
        'Wed': 'Wed',
        'Thu': 'Thu',
        'Fri': 'Fri',
        'Sat': 'Sat',
        'Clear sky': 'Clear sky',
        'Mainly clear': 'Mainly clear',
        'Partly cloudy': 'Partly cloudy',
        'Overcast': 'Overcast',
        'Fog': 'Fog',
        'Light drizzle': 'Light drizzle',
        'Moderate drizzle': 'Moderate drizzle',
        'Dense drizzle': 'Dense drizzle',
        'Slight rain': 'Slight rain',
        'Moderate rain': 'Moderate rain',
        'Heavy rain': 'Heavy rain',
        'Clean': 'Clean',
        'Low': 'Low',
        'Medium': 'Medium',
        'High': 'High',
        'Zero': 'Zero',
        'Sentiment': 'Sentiment',
        'confidence': 'confidence',
        'Tips': 'Tips',
        'Analysis & Recommendations': 'Analysis & Recommendations',
        'Today': 'Today',
        'Tomorrow': 'Tomorrow',
        'risk': 'risk',
        'avg': 'avg',
        'Peak at': 'Peak at',
        'All Clear': 'All Clear',
        'Enjoy Outdoors': 'Enjoy Outdoors',
        'Home Prep': 'Home Prep',
        'Consistency': 'Consistency',
        'Pollen Recommendations': 'Pollen Recommendations',
        'Low levels of': 'Low levels of',
        'pollen today and you are feeling well': 'pollen today and you are feeling well',
        'there should be no issues': 'there should be no issues',
        'UV Index': 'UV Index',
        'Moderate': 'Moderate',
        'Very High': 'Very High',
        'Extreme': 'Extreme',
        'UV Protection': 'UV Protection',
        'Recent Cities': 'Recent Cities',
        'Export Data': 'Export Data',
        'Clear History': 'Clear History',
        'Import Data': 'Import Data',
        'Your Statistics': 'Your Statistics',
        'Total Interactions': 'Total Interactions',
        'Positive Sentiment': 'Positive Sentiment',
        'Negative Sentiment': 'Negative Sentiment',
        'Avg Confidence': 'Avg Confidence',
        'Top Allergy': 'Top Allergy',
        'High Risk Days': 'High Risk Days',
        'Search feelings...': 'Search feelings...',
        'All Allergens': 'All Allergens',
        'From date': 'From date',
        'To date': 'To date',
        'Install AirSense': 'Install AirSense',
        'Install the app for quick access and offline support!': 'Install the app for quick access and offline support!',
        'Install': 'Install',
        'Later': 'Later',
        'Online': 'Online',
        'Offline': 'Offline',
        'You are offline. Some features may be limited.': 'You are offline. Some features may be limited.',
        'Keyboard Shortcuts': 'Keyboard Shortcuts',
        'Focus city search': 'Focus city search',
        'Focus history search': 'Focus history search',
        'Export history': 'Export history',
        'Import history': 'Import history',
        'Clear filters': 'Clear filters',
        'Show this help': 'Show this help',
        'Are you sure you want to clear all history? This action cannot be undone.': 'Are you sure you want to clear all history? This action cannot be undone.',
        'History cleared successfully!': 'History cleared successfully!',
        'Error clearing history. Please try again.': 'Error clearing history. Please try again.'
    },
    ro: {
        'Weather & Pollen Tracker': 'Monitorizare Vreme & Polen',
        'Weather Forecast': 'Prognoza Meteo',
        'Pollen Forecast': 'Prognoza Polen',
        'Pollen Allergies': 'Alergii la Polen',
        'How do you feel today?': 'Cum te simti astazi?',
        'Enter city name...': 'Introdu numele orasului...',
        'Search': 'Cauta',
        'Submit': 'Trimite',
        'Describe how you feel today...': 'Descrie cum te simti astazi...',
        'Your History': 'Istoricul Tau',
        'Feeling:': 'Stare:',
        'Recommendations:': 'Recomandari:',
        'No interactions found. Start using the app to see your history here!': 'Nu s-au gasit interactiuni. Incepe sa folosesti aplicatia pentru a-ti vedea istoricul aici!',
        'Hourly Forecast': 'Prognoza pe Ore',
        'Hour': 'Ora',
        'Temperature': 'Temperatura',
        'Humidity': 'Umiditate',
        'Wind Speed': 'Viteza Vantului',
        'Condition': 'Conditii',
        'Hourly Pollen Forecast': 'Prognoza Polen pe Ore',
        'Alder': 'Arin',
        'Birch': 'Mesteacan',
        'Grass': 'Iarba',
        'Mugwort': 'Pelin',
        'Olive': 'Maslin',
        'Ragweed': 'Ambrozie',
        'Alder Pollen': 'Polen Arin',
        'Birch Pollen': 'Polen Mesteacan',
        'Grass Pollen': 'Polen Iarba',
        'Mugwort Pollen': 'Polen Pelin',
        'Olive Pollen': 'Polen Maslin',
        'Ragweed Pollen': 'Polen Ambrozie',
        'Today': 'Astazi',
        'Sun': 'Dum',
        'Mon': 'Lun',
        'Tue': 'Mar',
        'Wed': 'Mie',
        'Thu': 'Joi',
        'Fri': 'Vin',
        'Sat': 'Sam',
        'Clear sky': 'Cer senin',
        'Mainly clear': 'Predominant senin',
        'Partly cloudy': 'Partial innorat',
        'Overcast': 'Innorat',
        'Fog': 'Ceata',
        'Light drizzle': 'Burniță ușoară',
        'Moderate drizzle': 'Burniță moderată',
        'Dense drizzle': 'Burniță densă',
        'Slight rain': 'Ploaie ușoară',
        'Moderate rain': 'Ploaie moderată',
        'Heavy rain': 'Ploaie torențială',
        'Clean': 'Curat',
        'Low': 'Scazut',
        'Medium': 'Mediu',
        'High': 'Ridicat',
        'Zero': 'Zero',
        'Sentiment': 'Sentiment',
        'confidence': 'incredere',
        'Tips': 'Sfaturi',
        'Analysis & Recommendations': 'Analiza si Recomandari',
        'Today': 'Astazi',
        'Tomorrow': 'Maine',
        'risk': 'risc',
        'avg': 'medie',
        'Peak at': 'Varf la',
        'All Clear': 'Totul Curat',
        'Enjoy Outdoors': 'Bucura-te de Exterior',
        'Home Prep': 'Pregatire Acasa',
        'Consistency': 'Consistenta',
        'Pollen Recommendations': 'Recomandari Polen',
        'Low levels of': 'Nivele scazute de',
        'pollen today and you are feeling well': 'polen astazi si te simti bine',
        'there should be no issues': 'nu ar trebui sa fie probleme',
        'UV Index': 'Indice UV',
        'Moderate': 'Moderat',
        'Very High': 'Foarte Ridicat',
        'Extreme': 'Extrem',
        'UV Protection': 'Protectie UV',
        'Recent Cities': 'Orase Recente',
        'Export Data': 'Exporta Date',
        'Clear History': 'Sterge Istoricul',
        'Import Data': 'Importa Date',
        'Your Statistics': 'Statisticile Tale',
        'Total Interactions': 'Interactiuni Totale',
        'Positive Sentiment': 'Sentiment Pozitiv',
        'Negative Sentiment': 'Sentiment Negativ',
        'Avg Confidence': 'Confidenta Medie',
        'Top Allergy': 'Alergie Principala',
        'High Risk Days': 'Zile cu Risc Ridicat',
        'Search feelings...': 'Cauta sentimente...',
        'All Allergens': 'Toti Alergenii',
        'From date': 'De la data',
        'To date': 'Pana la data',
        'Install AirSense': 'Instaleaza AirSense',
        'Install the app for quick access and offline support!': 'Instaleaza aplicatia pentru acces rapid si suport offline!',
        'Install': 'Instaleaza',
        'Later': 'Mai tarziu',
        'Online': 'Online',
        'Offline': 'Offline',
        'You are offline. Some features may be limited.': 'Esti offline. Unele functii pot fi limitate.',
        'Keyboard Shortcuts': 'Comenzi Rapide',
        'Focus city search': 'Focuseaza cautare oras',
        'Focus history search': 'Focuseaza cautare istoric',
        'Export history': 'Exporta istoric',
        'Import history': 'Importa istoric',
        'Clear filters': 'Sterge filtre',
        'Show this help': 'Arata acest ajutor',
        'Are you sure you want to clear all history? This action cannot be undone.': 'Esti sigur ca vrei sa stergi tot istoricul? Aceasta actiune nu poate fi anulata.',
        'History cleared successfully!': 'Istoric sters cu succes!',
        'Error clearing history. Please try again.': 'Eroare la stergerea istoricului. Te rog incearca din nou.'
    }
    };

    var currentLang = localStorage.getItem('language') || 'en';

function translateText(text) {
    if (translations[currentLang] && translations[currentLang][text]) {
        return translations[currentLang][text];
    }
    return text;
}

function translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translations[currentLang][key];
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
    
    // Translate dynamic content
    translateDynamicContent();
    
    // Update GDPR links
    updateGdprLinks();
    
    // Update language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'en' ? 'RO' : 'EN';
    }
}

function updateGdprLinks() {
    const gdprUrl = currentLang === 'ro' ? '/gdpr_ro/' : '/gdpr/';
    
    const footerGdprLink = document.getElementById('gdpr-link');
    if (footerGdprLink) {
        footerGdprLink.href = gdprUrl;
    }
    
    const termsGdprLink = document.getElementById('gdpr-terms-link');
    if (termsGdprLink) {
        termsGdprLink.href = gdprUrl;
    }
}

function translateDynamicContent() {
    // Translate day names in day bar
    document.querySelectorAll('.day-item').forEach(item => {
        const text = item.textContent.trim();
        item.textContent = translateText(text);
    });
    
    // Translate weather conditions in tables
    document.querySelectorAll('#hourly-table td:last-child').forEach(cell => {
        const text = cell.textContent.trim();
        cell.textContent = translateText(text);
    });
    
    // Translate current weather condition
    const currentCondition = document.getElementById('current-condition');
    if (currentCondition) {
        const text = currentCondition.textContent.trim();
        if (text !== 'Loading...') {
            currentCondition.textContent = translateText(text);
        }
    }
    
    // Translate pollen levels
    document.querySelectorAll('#pollen-hourly-table td').forEach(cell => {
        const text = cell.textContent.trim();
        if (['Clean', 'Low', 'Medium', 'High'].includes(text)) {
            cell.textContent = translateText(text);
        }
    });
}

function switchLanguage() {
    currentLang = currentLang === 'en' ? 'ro' : 'en';
    localStorage.setItem('language', currentLang);
    
    // Handle GDPR page redirects
    const currentPath = window.location.pathname;
    if (currentPath === '/gdpr/' && currentLang === 'ro') {
        window.location.href = '/gdpr_ro/';
        return;
    } else if (currentPath === '/gdpr_ro/' && currentLang === 'en') {
        window.location.href = '/gdpr/';
        return;
    }
    
    // Refresh the page to ensure all elements are properly translated
    window.location.reload();
}

    // Make translateText globally available
    window.translateText = translateText;

    // Initialize translations when page loads
    document.addEventListener('DOMContentLoaded', function() {
        translatePage();
        
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', switchLanguage);
        }
    });
})();