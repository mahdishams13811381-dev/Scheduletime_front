import React from 'react';
import { FaMapMarkerAlt, FaLink } from 'react-icons/fa';

const MonthlyViewItem = ({ meeting }) => {
  const title = meeting.title || meeting.Title || 'بدون عنوان';
  const category = (meeting.type || meeting.Type) === 'Task' ? 'تسک' : 'جلسه';
  const detail = (meeting.status || meeting.Status) ? `${category} • ${meeting.status || meeting.Status}` : category;
  const time = meeting.eventDate || meeting.EventDate ? new Date(meeting.eventDate || meeting.EventDate).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="group flex flex-col p-2 rounded-xl transition-all duration-300 hover:bg-indigo-50/50 cursor-pointer border border-transparent hover:border-indigo-100 bg-white shadow-sm w-full ring-2 ring-blue-500/50 shadow-[0_0_25px_rgba(15,23,42,0.22)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-700">
          {title.slice(0, 2)}
        </div>
        <div className="flex flex-col truncate">
          <span className="text-[10px] font-bold text-slate-800 truncate">{title}</span>
          <span className="text-[9px] text-slate-400">{detail}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[9px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
        <div className="flex items-center gap-1 truncate">
          <FaMapMarkerAlt className="text-indigo-400 shrink-0" />
          <span className="truncate">{meeting.type || meeting.Type}</span>
        </div>
        <div className="ml-auto text-indigo-600 text-[9px] font-semibold">{time}</div>
      </div>
    </div>
  );
};

export default MonthlyViewItem;