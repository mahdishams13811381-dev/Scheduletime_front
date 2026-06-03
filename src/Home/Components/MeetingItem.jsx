import React from 'react';

const MeetingItem = ({ title, description, date, time, type, participants }) => {
  return (
    <div className="py-5 border-b border-gray-100 last:border-0 flex items-start justify-between group transition-all" dir="rtl">
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          توضیحات: {description}
        </p>
        
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
             <i className="fa-regular fa-calendar-check opacity-70"></i>
             <span className="font-mono">{date}</span>
          </div>
          <div className="flex items-center gap-1 border-r pr-4 border-gray-200">
             <i className="fa-regular fa-clock opacity-70"></i>
             <span className="font-mono">{time}</span>
          </div>
          <div className="flex items-center gap-1 border-r pr-4 border-gray-200">
             <i className="fa-solid fa-video opacity-70 text-blue-400"></i>
             <span>{type}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center mr-4">
        <div className="flex -space-x-3 flex-row-reverse">
          {participants.map((person, index) => (
            <div 
              key={person.id} 
              className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center overflow-hidden shadow-sm"
              style={{ zIndex: 10 - index }}
            >
              {person.profileImageUrl ? (
                <img src={person.profileImageUrl} alt={person.name} className="w-full h-full object-cover" />
              ) : (
                <i className="fa-solid fa-user text-indigo-300 text-[10px]"></i>
              )}
            </div>
          ))}
          {participants.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 z-0">
              +{participants.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MeetingItem