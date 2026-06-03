const BASE = process.env.REACT_APP_API_BASE || '';

const toJson = async (res) => {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const RequestService = {
  // existing name kept for backward compatibility
  getInboxRequests: async (userId) => {
    const res = await fetch(`${BASE}/api/request/my-inbox?userId=${userId}`);
    return toJson(res);
  },

  // new names per spec
  getMyInboxRequests: async (userId) => {
    const res = await fetch(`${BASE}/api/request/my-inbox?userId=${userId}`);
    return toJson(res);
  },

  getMyInboxRequestCount: async (userId) => {
    const res = await fetch(`${BASE}/api/request/my-inbox/count?userId=${userId}`);
    return toJson(res);
  },

  getMyRequests: async (userId) => {
    const res = await fetch(`${BASE}/api/request/my-requests?userId=${userId}`);
    return toJson(res);
  },

  getGroupedRequests: async (userId) => {
    const res = await fetch(`${BASE}/api/request/grouped?userId=${userId}`);
    return toJson(res);
  },

  createRequest: async (model) => {
    const res = await fetch(`${BASE}/api/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model)
    });
    return toJson(res);
  }
};

export default RequestService;
