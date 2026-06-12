import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import MeetingService from './MeetingService';

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
const MeetingContext = createContext(null);

export const useMeeting = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
  const [inbox, setInbox] = useState([]);
  const [myMeetings, setMyMeetings] = useState([]);
  const [grouped, setGrouped] = useState({ pending: {}, held: {}, rejected: {} });
  const [loading, setLoading] = useState(false);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    try {
      const data = await MeetingService.getInboxMeetings(CURRENT_USER_ID);
      setInbox(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const loadMyMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await MeetingService.getMyMeetings(CURRENT_USER_ID);
      setMyMeetings(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const loadGrouped = useCallback(async () => {
    setLoading(true);
    try {
      const data = await MeetingService.getGroupedMeetings(CURRENT_USER_ID);
      setGrouped(data || { pending: {}, held: {}, rejected: {} });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadInbox(); loadMyMeetings(); loadGrouped(); }, [loadInbox, loadMyMeetings, loadGrouped]);

  const createMeeting = async (model) => {
    const created = await MeetingService.createMeeting(model);
    await Promise.all([loadInbox(), loadMyMeetings(), loadGrouped()]);
    return created;
  };

  return (
    <MeetingContext.Provider value={{ inbox, myMeetings, grouped, loading, loadInbox, loadMyMeetings, loadGrouped, createMeeting }}>
      {children}
    </MeetingContext.Provider>
  );
};
