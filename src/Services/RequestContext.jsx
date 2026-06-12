import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import RequestService from './RequestService';

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

const CURRENT_USER_ID = getCurrentUserId();
const RequestContext = createContext(null);

export const useRequest = () => useContext(RequestContext);

export const RequestProvider = ({ children }) => {
  const [inbox, setInbox] = useState([]);
  const [inboxCount, setInboxCount] = useState(0);
  const [myRequests, setMyRequests] = useState([]);
  const [grouped, setGrouped] = useState({ pending: [], approved: [], rejected: [] });
  const [loading, setLoading] = useState(false);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    try {
      const data = await RequestService.getInboxRequests(CURRENT_USER_ID);
      setInbox(data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, []);

  const loadInboxCount = useCallback(async () => {
    try {
      const res = await RequestService.getMyInboxRequestCount(CURRENT_USER_ID);
      setInboxCount(res?.count ?? 0);
    } catch (e) { console.error(e); }
  }, []);

  const loadMyRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await RequestService.getMyRequests(CURRENT_USER_ID);
      setMyRequests(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const loadGrouped = useCallback(async () => {
    setLoading(true);
    try {
      const data = await RequestService.getGroupedRequests(CURRENT_USER_ID);
      setGrouped({ pending: data.pending || [], approved: data.approved || [], rejected: data.rejected || [] });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadInbox(); loadMyRequests(); loadGrouped(); }, [loadInbox, loadMyRequests, loadGrouped]);

  useEffect(() => { loadInboxCount(); }, [loadInboxCount]);

  const createRequest = async (model) => {
    // model should include Title, Content, Status (number), SenderUserId, CurrentOwnerUserId, TagIds
    const created = await RequestService.createRequest(model);
    // refresh caches
    await Promise.all([loadInbox(), loadMyRequests(), loadGrouped(), loadInboxCount()]);
    return created;
  };

  return (
    <RequestContext.Provider value={{ inbox, inboxCount, myRequests, grouped, loading, loadInbox, loadMyRequests, loadGrouped, loadInboxCount, createRequest }}>
      {children}
    </RequestContext.Provider>
  );
};
