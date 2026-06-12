const MeetingRow = ({ title, subject, meetingDate, requesterUsers }) => {
  const requester = Array.isArray(requesterUsers) ? requesterUsers[0] : null;
  const name = title || `${requester?.firstName || ''} ${requester?.lastName || ''}`.trim();
  const avatar = requester?.profileImageUrl || 'https://via.placeholder.com/64?text=?';
  const description = subject || 'بدون توضیحات';
  const date = meetingDate ? new Date(meetingDate).toLocaleString('fa-IR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }) : 'تاریخ نامشخص';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all mb-3 text-right">
      <div className="flex flex-row-reverse justify-between items-center mb-3">
        <span className="text-slate-400 cursor-pointer text-xl">...</span>
        <div className="flex items-center gap-2">
          <img 
            src={avatar} 
            alt={name} 
            className="w-8 h-8 rounded-full object-cover border border-slate-200" 
          />
          <span className="text-sm font-bold text-slate-800">{name}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-5 mb-4 text-right">
        {description}
      </p>
      <div className="text-[10px] text-slate-400 font-bold text-left">
        {date}
      </div>
    </div>
  );
};

export default MeetingRow;