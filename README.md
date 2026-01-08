# AirSense: AI-Powered Allergy Forecast & Recommendation App

[![Django CI](https://github.com/andreisugu/airsense/actions/workflows/django.yml/badge.svg?branch=main)](https://github.com/andreisugu/airsense/actions/workflows/django.yml)

**Originally developed for Hackathon Craiova 2025 by Team Cloud**
*(Alin Radu Andrei Moisă, Andrei Șugubete, Mihail Popescu)*

> **Note:** This is **@andreisugu's fork** of the original project, actively maintained and enhanced post-hackathon. The project has evolved towards a **serverless, static-first architecture** optimized for GitHub Pages deployment, with PWA (Progressive Web App) capabilities for offline use.

### **Know Before You Go: Your Personal AI Allergy Assistant**

AirSense is an intelligent web application designed to help you proactively manage your allergies. By combining real-time weather forecasts, local pollen data, and AI-powered analysis of your symptoms, AirSense provides personalized recommendations and smart alerts to help you navigate your day with confidence.

## 🚀 Post-Hackathon Evolution: Serverless Architecture

Following the hackathon, this fork has been enhanced with a focus on:
* **Serverless deployment** via GitHub Pages (no backend infrastructure required)
* **Progressive Web App (PWA)** capabilities with offline support
* **100% client-side operation** - all processing happens in your browser
* **Zero-cost hosting** - deploy for free on GitHub Pages
* **Privacy-first design** - no data leaves your device unless you explicitly configure notifications

The Django backend remains available for those who want user authentication, persistent history, and advanced notification features, but the **primary focus is now the serverless static version**.

## 🌐 Serverless Static Version (Recommended)

AirSense is now available as a **serverless static web application** that runs entirely in your browser without any backend server! This version is perfect for quick deployment on GitHub Pages and provides a privacy-first, zero-cost solution.

### **✨ Live Demo**

Visit the live demo at: **[https://andreisugu.github.io/airsense/](https://andreisugu.github.io/airsense/)**

### **Key Features**

* ✅ **Serverless & Static** - No backend infrastructure needed
* ✅ **PWA Support** - Install as an app, works offline
* ✅ **Daily Pollen Notifications** - Subscribe to receive pollen alerts at your preferred time
* ✅ Full weather and pollen forecasting
* ✅ Interactive data visualization with Chart.js
* ✅ City search with autocomplete
* ✅ Client-side sentiment analysis (keyword-based)
* ✅ Personalized allergy recommendations
* ✅ Risk analysis and alert system
* ✅ Bilingual support (English/Romanian)
* ✅ Fully responsive design
* ✅ **Privacy-focused** - No data stored on servers
* ❌ No user authentication or persistent history (requires Django backend)

### **Quick Start: Deploy Your Own**

1. **Fork this repository**
   - Click the "Fork" button at the top of this page
   - This creates your own copy of AirSense

2. **Enable GitHub Pages:**
   - Go to your forked repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Select branch: **main** (or your preferred branch)
   - Select folder: **/ (root)**
   - Click **Save**

3. **Wait for deployment:**
   - GitHub will automatically build and deploy your site
   - This usually takes 1-2 minutes
   - You'll see a green checkmark when it's ready

4. **Access your site:**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/airsense/`
   - Example: `https://andreisugu.github.io/airsense/`

### **Testing Locally**

To test the static version locally before deploying:

```bash
# Navigate to the repository
cd airsense

# Start a simple HTTP server
python3 -m http.server 8080

# Open your browser and visit
# http://localhost:8080/index.html
```

Or use any other static file server like:
```bash
# Using Node.js http-server
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

### **Daily Pollen Notifications**

The serverless version now supports **browser-based daily pollen notifications**! This feature allows users to:

* **Subscribe to daily alerts** at their preferred time (6 AM - 8 PM)
* **Receive personalized notifications** based on their selected allergies
* **Get smart pollen forecasts** with actionable recommendations
* **Stay informed** about pollen levels without opening the app

#### How to Enable:
1. Open the **Profile** page in AirSense
2. Scroll to the "Daily Pollen Notifications" section
3. Choose your preferred notification time
4. Click **"Enable Daily Notifications"**
5. Grant browser notification permissions when prompted

#### Privacy Note:
* All notifications are handled **locally in your browser**
* No notification data is sent to any server
* Preferences are stored in browser localStorage
* You can disable notifications at any time from the Profile page

#### Browser Compatibility:
Daily notifications work in modern browsers that support the Web Notifications API:
* ✅ Chrome/Edge (Desktop & Android)
* ✅ Firefox (Desktop & Android)
* ✅ Safari (macOS & iOS 16.4+)
* ✅ Opera (Desktop & Android)

**Note:** Notifications require the browser/tab to be running in the background. For best results, install AirSense as a PWA.

---

##  Full Django Version (Optional Backend)

For users who need server-side features, the full Django backend is still available and provides:

* **🔐 User Authentication:** Full user registration and login system
* **📚 Interaction History:** Track your symptoms and recommendations over time
* **📧 Automated Notifications:** Opt-in to receive proactive pollen alerts via Email, Webhook, or Telegram
* **🤖 Advanced AI:** Server-side Hugging Face sentiment analysis model
* **🛡️ GDPR Compliance:** Full data privacy controls and user data management

###  Getting Started with Django Backend

Follow these instructions to get the full Django version of AirSense running locally with all features including user authentication, history, and notifications.

### **Prerequisites**

* Python 3.9+
* Pip (Python Package Installer)
* Git

### **Installation & Setup**

1.  **Clone the repository:**
    ```
    git clone [https://github.com/your-username/airsense.git](https://github.com/your-username/airsense.git)
    cd airsense
    ```
2.  **Create and activate a virtual environment:**
    * **Windows:**
        ```
        python -m venv venv
        .\venv\Scripts\activate
        ```
    * **macOS / Linux:**
        ```
        python3 -m venv venv
        source venv/bin/activate
        ```
3.  **Install the dependencies:**
    ```
    pip install -r requirements.txt
    ```
4.  **Apply database migrations:**
    ```
    python manage.py migrate
    ```
5.  **Run the development server:**
    ```
    python manage.py runserver
    ```
    The application will be available at `http://127.0.0.1:8000/`.

##  Setting Up Automated Notifications

To enable proactive alerts, you need to schedule a command to run periodically. This is done using **Cron** on Linux/macOS or **Task Scheduler** on Windows.

The command you need to schedule is:
```
python manage.py send_notifications
```

### **On Linux / macOS (using Cron)**

1.  Open your terminal and edit the crontab file by running:
    ```
    crontab -e
    ```
2.  Add a new line to the file to schedule the task. For example, to run the command every day at 7:00 AM, add the following line. **Remember to replace the placeholder paths** with the absolute paths to your project's `python` executable and `manage.py` file.

    ```
    # Example: Run daily at 7:00 AM
    0 7 * * * /path/to/your/project/airsense/venv/bin/python /path/to/your/project/airsense/manage.py send_notifications
    ```
3.  Save the file and exit the editor. Cron will now automatically run the command at the scheduled time.

### **On Windows (using Task Scheduler)**

1.  Open the **Task Scheduler** from the Start Menu.
2.  In the right-hand "Actions" pane, click **Create Basic Task...**.
3.  **Name and Description:** Give the task a name like "AirSense Daily Notifications" and click Next.
4.  **Trigger:** Choose how often you want the notifications to be sent (e.g., **Daily**) and click Next. Specify a start time, like **7:00:00 AM**.
5.  **Action:** Select **Start a program** and click Next.
6.  **Configure Program/Script:**
    * In the "Program/script" field, browse to and select the `python.exe` interpreter inside your project's virtual environment. For example: `C:\Users\YourUser\projects\airsense\venv\Scripts\python.exe`
    * In the "Add arguments (optional)" field, enter the full path to your `manage.py` file followed by the command name. For example: `C:\Users\YourUser\projects\airsense\manage.py send_notifications`
7.  Click **Next**, review the summary, and click **Finish**. The task is now scheduled.

##  How It Works

### **Serverless Static Version** (Primary Architecture)

1.  **User Input:** The user describes how they are feeling and selects the pollens they are allergic to.
2.  **Data Collection:** The browser fetches the user's location via geolocation API, then retrieves 7-day weather and pollen forecasts directly from Open-Meteo APIs.
3.  **Client-Side Analysis:**
    * A **keyword-based sentiment analysis** determines if the user's feeling is 'POSITIVE' or 'NEGATIVE' by analyzing word patterns.
    * Custom JavaScript logic combines this sentiment with pollen and weather data to calculate risk, generate recommendations, and assign an alert level.
4.  **Local Storage:** All data is stored in the browser's local storage for session persistence. No data is sent to any server.
5.  **PWA Features:** Service worker enables offline functionality and app-like experience.

### **Full Django Version** (Optional Backend)

1.  **User Input:** The user describes how they are feeling and selects the pollens they are allergic to.
2.  **Data Collection:** The backend fetches the user's location, a 7-day weather forecast, and a 7-day pollen forecast from the Open-Meteo and Air-Quality APIs.
3.  **AI Analysis:**
    * A **Hugging Face sentiment analysis model** (`distilbert-base-uncased-finetuned-sst-2-english`) determines if the user's feeling is 'POSITIVE' or 'NEGATIVE'.
    * Our custom logic combines this sentiment with pollen and weather data to calculate risk, generate recommendations, and assign an alert level.
4.  **Response & Storage:** The analysis is sent to the user's browser. If logged in, the entire interaction is saved to their private history for future reference.

##  Technologies Used

### **Serverless Static Version** (Primary)

| Category   | Technology / Service                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Chart.js                                                                |
| **PWA** | Service Workers, Web App Manifest, LocalStorage API                                                       |
| **AI / ML** | Client-side keyword-based sentiment analysis                                                              |
| **APIs** | Open-Meteo (Weather & Air-Quality), BigDataCloud (Geolocation)                                           |
| **Hosting** | GitHub Pages (serverless static hosting)                                                                  |
| **Deployment** | Git-based continuous deployment                                                                         |

### **Full Django Version** (Optional Backend)

| Category   | Technology / Service                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| **Backend** | Python 3.9+, Django                                                                                       |
| **Frontend** | HTML5, CSS3, JavaScript, Chart.js                                                                         |
| **AI / ML** | Hugging Face Transformers (`distilbert-base-uncased-finetuned-sst-2-english`)                               |
| **APIs** | Open-Meteo (Weather & Air-Quality), ip-api.com (Geolocation)                                              |
| **Database** | SQLite (default), PostgreSQL (production-ready)                                                           |

##  Contributing

This is an actively maintained fork by [@andreisugu](https://github.com/andreisugu), evolved from the original Hackathon Craiova 2025 project. Contributions are welcome and greatly appreciated!

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Don't forget to give the project a star! Thanks again!

## 📜 Project History

* **January 2025**: Hackathon Craiova 2025 - Original development by Team Cloud
* **Post-Hackathon**: Forked and maintained by @andreisugu with focus on serverless architecture
* **Current**: Active development emphasizing PWA capabilities, GitHub Pages deployment, and privacy-first design

## License

Distributed under the MIT License. See `LICENSE` for more information.
