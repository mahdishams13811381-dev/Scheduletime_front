import React, { useState, useRef, useEffect } from "react";
import LogoUni from "../assets/image/University-of-Isfahan-Logo.png";
import RequestDetailModal from '../Components/RequestDetailModal';
import RequestComponent from './RequestComponent'
import NotificationComponent from './NotificationComponent'
import AddMeetingModal from "../../Home/Components/AddMeetingModal";
import { useUser } from '../../Context/UserContext';
import { getProfileImageUrl, getUserFullName, getUserPosition } from '../../Utils/userProfile';
function Header({ onMenuToggle }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const chatRef = useRef(null);
  const notifRef = useRef(null);

  const {
    currentUser,
    isLoadingUser,
    openProfileModal
  } = useUser();

  const [viewingRequest, setViewingRequest] = useState(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)

  const [requests, setRequests] = useState([
    { id: 1, name: "محمد رضایی", date: "۱۴۰۵/۰۲/۰۵", time: "۸:۰۰ – ۹:۳۰" },
    { id: 2, name: "سارا موسوی", date: "۱۴۰۵/۰۲/۰۵", time: "۸:۰۰ – ۹:۳۰" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "status", text: "درخواست شماره #۱۲۴ شما در مرحله بررسی نهایی دانشکده قرار گرفت.", timeAgo: "۱۰ دقیقه پیش" },
    { id: 2, type: "meeting", text: "امروز ساعت ۱۳:۳۰ جلسه بررسی پروپوزال با دکتر احمدی دارید.", timeAgo: "۱ ساعت پیش" },
    { id: 3, type: "status", text: "درخواست تایید نمرات شما تایید شده و به آموزش کل ارسال شد.", timeAgo: "دیروز" },
  ]);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleRequestAction = (id, message) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    setAlertConfig({
      isOpen: true,
      title: "عملیات موفق",
      message: message
    });
    setViewingRequest(null);
  };

  const handleNotificationRead = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (alertConfig.isOpen) return;
      if (chatRef.current && !chatRef.current.contains(event.target)) setChatOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [alertConfig.isOpen]);

  return (
    <header className="w-full h-20 bg-[#0f172a] flex items-center justify-between px-4 md:px-6 z-30 relative" dir="rtl">

      {/* سمت راست: منو همبرگری و لوگو */}
      <div className="flex items-center h-full select-none">
        <button
          onClick={onMenuToggle}
          className="md:hidden flex items-center justify-center text-slate-300 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer"
        >
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-2 flex-shrink-0">
          <img src={LogoUni} alt="لوگو" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-base sm:text-2xl md:text-2xl font-bold text-white whitespace-nowrap leading-none">
            {isLoadingUser ? 'در حال بارگذاری...' : (currentUser ? getUserFullName(currentUser) : 'دانشگاه اصفهان')}
          </span>
          <span className="text-xs text-slate-300 mt-0.5">
            {isLoadingUser ? 'لطفاً صبر کنید' : (currentUser ? getUserPosition(currentUser) : 'University of Isfahan')}
          </span>
        </div>
      </div>

      {/* سمت چپ: دکمه‌های فرم‌ها */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div ref={chatRef} className="relative flex items-center">
          <button
            type="button"
            onClick={() => { setChatOpen(!chatOpen); setNotifOpen(false); }}
            className="relative flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors rounded-xl p-2"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {requests.length > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-[#0f172a]">
                {requests.length}
              </span>
            )}
          </button>

          {chatOpen && (
            <>
              <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => !alertConfig.isOpen && setChatOpen(false)} />
              <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[315px] md:absolute md:top-full md:left-0 md:right-auto md:translate-x-0 md:mt-2 md:w-[340px] bg-[#f8fafc] border border-slate-200 rounded-2xl shadow-2xl text-slate-800 z-40 overflow-hidden">
                <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">درخواست ها</span>
                  <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className="p-3 flex flex-col gap-3 max-h-[60vh] md:max-h-[360px] overflow-y-auto">
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <RequestComponent
                        key={req.id}
                        request={req}
                        onAction={handleRequestAction}
                        onView={() => setViewingRequest(req)} // این خط باعث می‌شود با کلیک روی هر درخواست، آن در مودال ست شود
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium">هیچ درخواست جدیدی وجود ندارد.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div ref={notifRef} className="relative flex items-center">
          <button
            type="button"
            onClick={() => { setNotifOpen(!notifOpen); setChatOpen(false); }}
            className="relative flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors rounded-xl p-2"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 bg-amber-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-[#0f172a]">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => !alertConfig.isOpen && setNotifOpen(false)} />
              <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[315px] md:absolute md:top-full md:left-0 md:right-auto md:translate-x-0 md:mt-2 md:w-[340px] bg-[#f8fafc] border border-slate-200 rounded-2xl shadow-2xl text-slate-800 z-40 overflow-hidden">
                <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">اعلان‌ها و رویدادها</span>
                  <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className="p-3 flex flex-col gap-3 max-h-[60vh] md:max-h-[360px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <NotificationComponent key={notif.id} notification={notif} onRead={handleNotificationRead} />
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium">هیچ اعلان جدیدی یافت نشد.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <button className="flex items-center justify-center text-slate-400 p-2 hover:text-white"><svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-[22px] h-[22px]"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></button>
        <div onClick={openProfileModal} className="w-10 h-10 rounded-full border border-slate-700 overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 ring-indigo-500 transition-all">
          <img src={getProfileImageUrl(currentUser)} alt="پروفایل" className="w-full h-full object-cover" />
        </div>
      </div>

      {alertConfig.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={closeAlert} />
          <div className="bg-white rounded-2xl p-5 w-full max-w-[320px] text-slate-800 shadow-2xl relative z-50 border border-slate-100 text-center animate-in scale-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 mb-1">{alertConfig.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">{alertConfig.message}</p>
            <button onClick={closeAlert} className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer">متوجه شدم</button>
          </div>
        </div>
      )}
      {viewingRequest && (
        <RequestDetailModal
          request={viewingRequest}
          onClose={() => setViewingRequest(null)}
          onAction={(message) => handleRequestAction(viewingRequest.id, message)}
          onOpenMeeting={() => {
            setIsMeetingModalOpen(true);
            // دقت کن: اینجا setViewingRequest(null) را برداشتم تا مودال جزئیات بسته نشود 
            // مگر اینکه خودت بخواهی بسته شود.
          }}
        />
      )}

      {isMeetingModalOpen && (
        <AddMeetingModal
          isOpen={isMeetingModalOpen} // این خط حیاتی بود که در کد شما خالی بود!
          onClose={() => {
            setIsMeetingModalOpen(false);
            // اختیاری: اگر می‌خواهی بعد از ذخیره جلسه، درخواست از لیست حذف شود:
            setRequests(prev => prev.filter(req => req.id !== viewingRequest?.id));
            setViewingRequest(null);
          }}
          initialData={{ title: viewingRequest?.name ? `جلسه با ${viewingRequest.name}` : "" }}
        />
      )}
    </header>
  );
}

export default Header;