const BASE = process.env.REACT_APP_API_BASE || '';

const toJson = async (res) => {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const NotificationService = {
  getNotifications: async (userId) => {
    const res = await fetch(`${BASE}/api/notification/my-items?userId=${userId}`);
    return toJson(res);
  },

  getNotificationCount: async (userId) => {
    const res = await fetch(`${BASE}/api/notification/count?userId=${userId}`);
    return toJson(res);
  }
};

export default NotificationService;
