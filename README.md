# PayIn Admin Dashboard

Premium dark-theme React admin panel for the PayIn webhook gateway.

## Features
- Admin login (credentials in `.env`)
- Merchant management — create & view merchant cards
- Webhook logs table with click-to-expand detail drawer
- Merchant ↔ Webhook matching via `client_id`
- Live data from your Express backend (falls back to demo data if API is unreachable)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your backend URL in .env
#    (already set to http://localhost:5000 by default)

# 3. Start the dev server
npm start
```

Open http://localhost:3000

## Environment Variables

| Variable                    | Default               | Description                  |
|-----------------------------|-----------------------|------------------------------|
| `REACT_APP_API_BASE_URL`    | `http://localhost:5000` | Your Express backend URL    |
| `REACT_APP_ADMIN_USERNAME`  | `admin`               | Admin login username         |
| `REACT_APP_ADMIN_PASSWORD`  | `admin@123`           | Admin login password         |

Edit `.env` to change any of these.

## Backend API Endpoints Used

| Method | Path                  | Purpose                        |
|--------|-----------------------|--------------------------------|
| GET    | `/api/webhook/logs`   | Fetch all webhook log entries  |
| POST   | `/api/webhook/receive`| Receive a new webhook          |
| GET    | `/api/merchants`      | Fetch all merchants            |
| POST   | `/api/merchants`      | Create a new merchant          |

> The merchant routes need to be added to your Express backend.  
> If they're missing, the frontend will save merchants locally in state.

## Project Structure

```
src/
├── App.js                  # Root component, data loading
├── api.js                  # Axios instance + all API calls
├── utils.js                # Shared helpers (fmt, initials, shortId)
├── styles.css              # Global dark theme CSS
├── index.js                # React entry point
├── components/
│   ├── Common.jsx          # StatusTag, Spinner, EmptyState
│   ├── LoginPage.jsx       # Login screen
│   ├── Sidebar.jsx         # Navigation sidebar
│   └── MerchantModal.jsx   # Create merchant form modal
└── pages/
    ├── OverviewPage.jsx    # Stats + recent activity
    ├── MerchantsPage.jsx   # Merchant card grid
    └── WebhooksPage.jsx    # Webhook logs table
```

## Production Build

```bash
npm run build
# Outputs to /build — serve with any static host or nginx
```
