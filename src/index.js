import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RequestProvider } from './Services/RequestContext';
import { NotificationProvider } from './Services/NotificationContext';
import reportWebVitals from './reportWebVitals';

document.title = 'داشبورد دانشگاه اصفهان';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RequestProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </RequestProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
