import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import RequestService from './RequestService';

const CURRENT_USER_ID = 1;

const RequestContext = createContext(null);

export const useRequest = () => useContext(RequestContext);

export const RequestProvider = ({ children }) => {
  const [inbox, setInbox] = useState([]);
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

  const createRequest = async (model) => {
    // model should include Title, Content, Status (number), SenderUserId, CurrentOwnerUserId, TagIds
    const created = await RequestService.createRequest(model);
    // refresh caches
    await Promise.all([loadInbox(), loadMyRequests(), loadGrouped()]);
    return created;
  };

  return (
    <RequestContext.Provider value={{ inbox, myRequests, grouped, loading, loadInbox, loadMyRequests, loadGrouped, createRequest }}>
      {children}
    </RequestContext.Provider>
  );
};
