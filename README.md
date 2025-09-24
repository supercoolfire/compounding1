# 📈 Compounded Investment Calculator

A simple web app that calculates:

- **Final investment amount** after a certain number of days.
- **Days needed** to reach a target investment amount.

It compounds at **1% increase 3 times per day** and rounds each increase to the nearest tenth — just like the provided Python version.  

Users can enter a start amount, pick start & end dates, or input the number of days. The app automatically keeps the days and end date in sync.

---

## 🚀 Features

✅ Calculate the **final amount** after compounding  
✅ Calculate the **days needed** to reach a target amount  
✅ Pick **start & end dates** with automatic day calculation  
✅ Enter a **number of days** and automatically update the end date  
✅ Uses **Bootstrap 5** for a clean, responsive UI  
✅ Works entirely in the browser — no server needed  

---

## 🛠️ Tech Stack

- **HTML5** — Markup
- **CSS (Bootstrap 5)** — Styling & layout
- **JavaScript (Vanilla)** — Core logic for calculations and date syncing

---

## 🧮 How the Calculation Works

- **Compounding:** 3 times per day  
- **Increase rate:** 1% per period  
- **Rounding:** Each increase is rounded to the nearest tenth before adding  

Example for one compounding:
increase = current_amount × 0.01
rounded_increase = round(increase to nearest 0.1)
new_amount = current_amount + rounded_increase

This repeats 3 times per day for the chosen number of days.

---

## ⚡ Getting Started

1. **Clone or download** this repository:
    ```bash
    git clone https://github.com/yourusername/compounded-investment-calculator.git
    ```

2. **Open the HTML file** in your browser:
    ```
    index.html
    ```

That’s it — no installation or server required!

---

## 🧪 Usage

1. Enter your **Starting Amount**.
2. Choose **Start Date** (defaults to today).
3. Either:
   - Enter the **Number of Days** → End date updates automatically.
   - Pick an **End Date** → Number of days updates automatically.
4. Click **Calculate Final Amount** to see your investment growth.
5. Or enter a **Target Amount** and click **Calculate Days to Reach Target**.

---

## 🖼️ Screenshot

![App Screenshot](screenshot.png) 

---

## 📜 License

MIT License — feel free to use and modify.

---

## 👨‍💻 Author

Created by **Jayser Pilapil**.
