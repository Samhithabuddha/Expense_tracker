# 💰 **ExpenseTrack - Personal Finance Management Dashboard**

## 📌 **Project Overview**
ExpenseTrack is a modern web-based expense management application that helps users track income and expenses, visualize spending patterns, and analyze financial data through interactive dashboards and charts.
The application is built using React.js, Chart.js, HTML, CSS, and JavaScript, with browser LocalStorage used for data persistence. It provides a responsive and user-friendly interface for managing personal finances without requiring any backend server.

---

## 🚀 **Features**
### 📊 Dashboard Overview
- View Net Balance
- Track Total Income
- Monitor Total Expenses
- Display Total Number of Transactions

### 💳 Transaction Management
- Add new income and expense records
- Categorize transactions
- Select transaction dates
- Delete transactions
- Filter transactions by:
  - All Transactions
  - Income
  - Expenses

### 📈 Analytics & Visualization
- Monthly Income vs Expense Bar Chart
- Income vs Expense Doughnut Chart
- Category-wise Spending Pie Chart
- Expense Breakdown Analysis
- Percentage-based Category Distribution

### 💾 Data Persistence
- Stores all transaction data using LocalStorage
- Automatically loads saved data on page refresh
- No database or backend required

### 📱 Responsive Design
- Desktop-friendly dashboard layout
- Mobile-responsive interface
- Sidebar navigation for easy access

---

## 🛠️ **Tech Stack**
| Technology | Purpose |
|------------|----------|
| HTML5 | Structure and Layout |
| CSS3 | Styling and Responsive Design |
| JavaScript (ES6+) | Application Logic |
| React.js | User Interface Components |
| Chart.js | Data Visualization |
| Font Awesome | Icons |
| LocalStorage | Data Persistence |

---

## 🏗️ **PROJECT ARCHITECTURE**

```text
USER INTERFACE (HTML + CSS)
            │
            ▼
      REACT COMPONENTS
            │
            ▼
   JAVASCRIPT BUSINESS LOGIC
            │
            ▼
       LOCAL STORAGE
            │
            ▼
     DATA PERSISTENCE
```

---

### 🔹 **Architecture Breakdown**

#### HTML
Provides the root container and application structure.

#### CSS
Handles:
- Dark theme design
- Responsive layouts
- Sidebar navigation
- Cards and charts styling
- Form styling

#### React Components
Responsible for:
- Dashboard
- Analytics
- Transaction Management
- Charts
- Navigation

#### JavaScript Logic
Manages:
- Adding transactions
- Deleting transactions
- Filtering records
- Financial calculations
- Chart rendering

#### LocalStorage
Stores transaction data locally in the browser and retrieves it when the application loads.

---

### 🔁 **Data Flow**
1. User enters transaction details.
2. React validates the input.
3. Transaction is added to state.
4. Data is saved to LocalStorage.
5. Dashboard and charts update automatically.
6. Data remains available after page refresh.  

---

## 📂 **Folder Structure**

```text
ExpenseTrack/

│── ExpenseTrack.html
│── expense.js
│── README.md
```

---

## 📊 Available Categories

- Food
- Transport
- Shopping
- Health
- Entertainment
- Bills
- Salary
- Other

---

## ▶️ **How to Run the Project**
### Option 1: Direct Browser Execution

1. Download the project files.
2. Ensure the following files are in the same folder:

```text
ExpenseTrack.html
expense.js
```

3. Open `ExpenseTrack.html` in any modern web browser.

4. Start managing your expenses.

### No Installation Required

The project uses CDN links for:
- React
- ReactDOM
- Babel
- Chart.js
- Font Awesome

So no npm installation is necessary.

---

## 📈 Dashboard Modules

### Dashboard
Provides a financial overview including:
- Net Balance
- Income
- Expenses
- Transaction Count

### Transactions
Allows:
- Adding transactions
- Viewing history
- Filtering records
- Deleting entries

### Analytics
Displays:
- Category-wise expense analysis
- Monthly financial trends
- Spending distribution charts

---

## 🔒 Data Storage

All transaction records are stored using:

```javascript
localStorage
```

Storage Key:

```javascript
et_transactions
```

This ensures data remains available even after browser refresh.

---

## 📚 **Key Learnings**
Through this project, developers can learn:

- React Functional Components
- React Hooks (useState, useEffect, useMemo, useRef)
- State Management
- Event Handling
- Form Validation
- LocalStorage Integration
- Data Visualization using Chart.js
- Dynamic UI Rendering
- Responsive Web Design

---

## 🔮 **Future Enhancements**
- Edit Existing Transactions
- Export Reports to PDF
- Export Data to CSV
- Monthly Budget Limits
- Budget Alert Notifications
- Dark/Light Theme Toggle
- User Authentication
- Cloud Data Synchronization
- Expense Search Functionality
- Advanced Filtering Options


---
