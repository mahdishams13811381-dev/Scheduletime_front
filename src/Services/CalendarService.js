const BASE = process.env.REACT_APP_API_BASE || '';

const toJson = async (res) => {
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
};

const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }
  return date;
};

const getWeekBounds = (date) => {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  const dayOfWeek = current.getDay();
  const offset = (dayOfWeek + 1) % 7; // Saturday = 0, Sunday = 1, ...
  const start = new Date(current);
  start.setDate(current.getDate() - offset);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

const getMonthBounds = (date) => {
  const current = new Date(date);
  const start = new Date(current.getFullYear(), current.getMonth(), 1);
  const end = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  return { start, end };
};

const CalendarService = {
  getEvents: async (userId, fromDate, toDate, type = 'all') => {
    const from = formatDate(fromDate);
    const to = formatDate(toDate);
    const res = await fetch(`${BASE}/api/calendar/events?userId=${userId}&fromDate=${from}&toDate=${to}&type=${type}`);
    return toJson(res);
  },

  getDailyEvents: async (userId, date, type = 'all') => {
    const day = new Date(date);
    const from = new Date(day);
    from.setHours(0, 0, 0, 0);
    const to = new Date(day);
    to.setHours(23, 59, 59, 999);
    return CalendarService.getEvents(userId, from, to, type);
  },

  getWeeklyEvents: async (userId, date, type = 'all') => {
    const { start, end } = getWeekBounds(date);
    return CalendarService.getEvents(userId, start, end, type);
  },

  getMonthlyEvents: async (userId, date, type = 'all') => {
    const { start, end } = getMonthBounds(date);
    return CalendarService.getEvents(userId, start, end, type);
  }
};

export default CalendarService;
