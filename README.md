<<<<<<< HEAD
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
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
"# webhook-frontend-processor" 
>>>>>>> 3ea112a27631c8341e824252f3fe596fd60354fb
