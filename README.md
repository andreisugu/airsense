# AirSense: AI-Powered Allergy Forecast & Recommendation App

[![Django CI](https://github.com/mihail-pop/airsense/actions/workflows/django.yml/badge.svg?branch=main)](https://github.com/mihail-pop/airsense/actions/workflows/django.yml)

**Developed for Hackathon Craiova 2025 by Team Cloud**
*(Alin Radu Andrei Moisă, Andrei Șugubete, Mihail Popescu)*

### **Know Before You Go: Your Personal AI Allergy Assistant**

AirSense is an intelligent web application designed to help you proactively manage your allergies. By combining real-time weather forecasts, local pollen data, and AI-powered analysis of your symptoms, AirSense provides personalized recommendations and smart alerts to help you navigate your day with confidence.

## Core Features

* **Local Forecasts:** Automatically get weather and pollen data for your current location, or search for any city worldwide.
* **AI-Powered Insights:** Describe how you're feeling in your own words. Our sentiment analysis model understands your input to tailor its advice.
* **Dynamic Risk Analysis:** Select your specific allergens and instantly see a calculated risk level (Low, Medium, High) for today and tomorrow.
* **Personalized Recommendations:** Receive actionable advice based on the unique combination of your symptoms, local pollen counts, and weather conditions.
* **Smart Alert System:** Get categorized alerts (e.g., Critical, High Risk, Proactive) with clear, immediate tips to help you take action.
* **Interactive Data Visualization:** View beautiful charts of weather and pollen forecasts, powered by Chart.js.
* **Interaction History:** Keep track of your symptoms and our recommendations over time in a clear, card-based history log.
* **Automated Notifications:** Opt-in to receive proactive pollen alerts via Email, Webhook, or Telegram before your day even starts.
* **Secure & Private:** Full user authentication, profile management, and GDPR compliance to ensure your data is safe and you are in control.

## 🌐 GitHub Pages Static Version

AirSense is now available as a **static web application** that can run entirely in your browser without any backend server! This version is perfect for quick deployment on GitHub Pages.

### **Live Demo**

Visit the live demo at: `https://YOUR_USERNAME.github.io/airsense/`

### **Features of the Static Version**

* ✅ Full weather and pollen forecasting
* ✅ Interactive data visualization with Chart.js
* ✅ City search with autocomplete
* ✅ Client-side sentiment analysis (keyword-based)
* ✅ Personalized allergy recommendations
* ✅ Risk analysis and alert system
* ✅ Bilingual support (English/Romanian)
* ✅ Fully responsive design
* ✅ **100% client-side - No data stored on servers**
* ❌ No user authentication or history (requires backend)

### **How to Deploy on GitHub Pages**

1. **Fork or Clone this repository**

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
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
   - Your site will be available at: `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`
   - For example: `https://andreisugu.github.io/airsense/`

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

---

##  Getting Started (Full Django Version)

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

### **Static Version (GitHub Pages)**

1.  **User Input:** The user describes how they are feeling and selects the pollens they are allergic to.
2.  **Data Collection:** The browser fetches the user's location via geolocation API, then retrieves 7-day weather and pollen forecasts directly from Open-Meteo APIs.
3.  **Client-Side Analysis:**
    * A **keyword-based sentiment analysis** determines if the user's feeling is 'POSITIVE' or 'NEGATIVE' by analyzing word patterns.
    * Custom JavaScript logic combines this sentiment with pollen and weather data to calculate risk, generate recommendations, and assign an alert level.
4.  **Response:** The analysis is displayed immediately in the browser. No data is stored anywhere.

### **Full Django Version**

1.  **User Input:** The user describes how they are feeling and selects the pollens they are allergic to.
2.  **Data Collection:** The backend fetches the user's location, a 7-day weather forecast, and a 7-day pollen forecast from the Open-Meteo and Air-Quality APIs.
3.  **AI Analysis:**
    * A **Hugging Face sentiment analysis model** (`distilbert-base-uncased-finetuned-sst-2-english`) determines if the user's feeling is 'POSITIVE' or 'NEGATIVE'.
    * Our custom logic combines this sentiment with pollen and weather data to calculate risk, generate recommendations, and assign an alert level.
4.  **Response & Storage:** The analysis is sent to the user's browser. If logged in, the entire interaction is saved to their private history for future reference.

##  Technologies Used

### **Static Version (GitHub Pages)**

| Category   | Technology / Service                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| **Frontend** | HTML5, CSS3, JavaScript, Chart.js                                                                         |
| **AI / ML** | Client-side keyword-based sentiment analysis                                                              |
| **APIs** | Open-Meteo (Weather & Air-Quality), BigDataCloud (Geolocation)                                           |
| **Hosting** | GitHub Pages (static files only)                                                                          |

### **Full Django Version**

| Category   | Technology / Service                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| **Backend** | Python, Django                                                                                            |
| **Frontend** | HTML5, CSS3, JavaScript, Chart.js                                                                         |
| **AI / ML** | Hugging Face Transformers (`distilbert-base-uncased-finetuned-sst-2-english`)                               |
| **APIs** | Open-Meteo (Weather & Air-Quality), ip-api.com (Geolocation)                                              |
| **Database** | SQLite (default), PostgreSQL (production-ready)                                                           |

##  Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Don't forget to give the project a star! Thanks again!

## License

Distributed under the MIT License. See `LICENSE` for more information.
