const BASE = process.env.REACT_APP_API_BASE || '';

const toJson = async (res) => {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const MeetingService = {
  getInboxMeetings: async (userId) => {
    const res = await fetch(`${BASE}/api/meeting/my-inbox?userId=${userId}`);
    return toJson(res);
  },

  getMyMeetings: async (userId) => {
    const res = await fetch(`${BASE}/api/meeting/my-meetings?userId=${userId}`);
    return toJson(res);
  },

  getGroupedMeetings: async (userId) => {
    const res = await fetch(`${BASE}/api/meeting/grouped?userId=${userId}`);
    return toJson(res);
  },

  createMeeting: async (model) => {
    const res = await fetch(`${BASE}/api/meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model)
    });
    return toJson(res);
  }
};

export default MeetingService;
