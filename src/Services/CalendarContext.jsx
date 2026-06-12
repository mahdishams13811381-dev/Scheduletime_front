import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import CalendarService from './CalendarService';

const getCurrentUserId = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return Number(
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    );
  } catch {
    return null;
  }
};

const CURRENT_USER_ID = getCurrentUserId();const CalendarContext = createContext(null);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider.');
  }
  return context;
};

const getWeeklyRange = (date) => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  const dayOfWeek = current.getDay();
  const offset = (dayOfWeek + 1) % 7;
  const fromDate = new Date(current);
  fromDate.setDate(current.getDate() - offset);
  const toDate = new Date(fromDate);
  toDate.setDate(fromDate.getDate() + 6);
  return { fromDate, toDate };
};

const getMonthlyRange = (date) => {
  const current = new Date(date);
  const fromDate = new Date(current.getFullYear(), current.getMonth(), 1);
  const toDate = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  return { fromDate, toDate };
};

const getYearlyRange = (date) => {
  const current = new Date(date);
  const fromDate = new Date(current.getFullYear(), 0, 1);
  const toDate = new Date(current.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { fromDate, toDate };
};

export const CalendarProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('روزانه');
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef({});

  const buildCacheKey = (fromDate, toDate, type) => {
    return `${fromDate.toISOString().slice(0, 10)}_${toDate.toISOString().slice(0, 10)}_${type}`;
  };

  const getRange = useCallback((currentView, date) => {
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);

    if (currentView === 'روزانه') {
      const fromDate = new Date(current);
      const toDate = new Date(current);
      toDate.setHours(23, 59, 59, 999);
      return { fromDate, toDate };
    }

    if (currentView === 'هفتگی') {
      const range = getWeeklyRange(current);
      range.fromDate.setHours(0, 0, 0, 0);
      range.toDate.setHours(23, 59, 59, 999);
      return range;
    }

    if (currentView === 'سالیانه') {
      const range = getYearlyRange(current);
      return range;
    }

    const range = getMonthlyRange(current);
    range.fromDate.setHours(0, 0, 0, 0);
    range.toDate.setHours(23, 59, 59, 999);
    return range;
  }, []);

  const loadEvents = useCallback(async ({ currentView, date, type, forceRefresh = false } = {}) => {
    const viewName = currentView || view;
    const effectiveFilter = type || filter;
    const activeDate = date ? new Date(date) : selectedDate;
    const range = getRange(viewName, activeDate);
    const key = buildCacheKey(range.fromDate, range.toDate, effectiveFilter);

    if (!forceRefresh && cacheRef.current[key]) {
      setEvents(cacheRef.current[key]);
      return cacheRef.current[key];
    }

    setLoading(true);
    try {
      const data = await CalendarService.getEvents(CURRENT_USER_ID, range.fromDate, range.toDate, effectiveFilter);
      setEvents(data || []);
      cacheRef.current[key] = data || [];
      return data || [];
    } catch (error) {
      console.error(error);
      setEvents([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [filter, getRange, selectedDate, view]);

  useEffect(() => {
    void loadEvents({ currentView: view, date: selectedDate, type: filter });
  }, [view, filter, selectedDate, loadEvents]);

  const refreshEvents = useCallback(() => {
    void loadEvents({ currentView: view, date: selectedDate, type: filter, forceRefresh: true });
  }, [filter, loadEvents, selectedDate, view]);

  const changeView = useCallback((newView) => {
    setView(newView);
  }, []);

  const changeFilter = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const goToPrevious = useCallback(() => {
    const current = new Date(selectedDate);
    if (view === 'روزانه') {
      current.setDate(current.getDate() - 1);
    } else if (view === 'هفتگی') {
      current.setDate(current.getDate() - 7);
    } else if (view === 'سالیانه') {
      current.setFullYear(current.getFullYear() - 1);
    } else {
      current.setMonth(current.getMonth() - 1);
    }
    setSelectedDate(current);
  }, [selectedDate, view]);

  const goToNext = useCallback(() => {
    const current = new Date(selectedDate);
    if (view === 'روزانه') {
      current.setDate(current.getDate() + 1);
    } else if (view === 'هفتگی') {
      current.setDate(current.getDate() + 7);
    } else if (view === 'سالیانه') {
      current.setFullYear(current.getFullYear() + 1);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
    setSelectedDate(current);
  }, [selectedDate, view]);

  return (
    <CalendarContext.Provider value={{
      selectedDate,
      view,
      filter,
      events,
      loading,
      changeView,
      changeFilter,
      setSelectedDate,
      goToToday,
      goToPrevious,
      goToNext,
      refreshEvents,
      loadEvents
    }}>
      {children}
    </CalendarContext.Provider>
  );
};
