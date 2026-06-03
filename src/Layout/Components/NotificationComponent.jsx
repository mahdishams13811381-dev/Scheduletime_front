export default function NotificationComponent({ notification, onRead, onClick }) {
  const isMeeting = (notification.ItemType || '').toLowerCase() === 'meeting';
  const dateStr = notification.Date ? new Date(notification.Date).toLocaleString() : '';

  return (
    <div onClick={onClick} className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col gap-2 shadow-xs hover:border-indigo-100 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2.5 min-w-0">
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isMeeting ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
          }`}>
            {isMeeting ? (
              <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            ) : (
              <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 leading-relaxed">
              {notification.Title}
            </span>
            <span className="text-[10px] text-slate-400 mt-1" dir="rtl">{notification.Status} • {dateStr}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onRead && onRead(notification.EntityId); }}
          className="text-[10px] font-bold text-indigo-600 bg-indigo-50/60 hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        >
          متوجه شدم
        </button>
      </div>
    </div>
  );
}