import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import NotificationService from './NotificationService';

const CURRENT_USER_ID = 1;

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await NotificationService.getNotifications(CURRENT_USER_ID);
      setItems(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const loadCount = useCallback(async () => {
    try {
      const res = await NotificationService.getNotificationCount(CURRENT_USER_ID);
      setCount(res?.count ?? 0);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadItems(); loadCount(); }, [loadItems, loadCount]);

  return (
    <NotificationContext.Provider value={{ items, count, loading, loadItems, loadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
