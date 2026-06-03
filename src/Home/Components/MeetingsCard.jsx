import React, { useState } from "react";
import MeetingItem from "./MeetingItem";
import AddMeetingModal from "./AddMeetingModal"; // 🔹 ایمپورت کامپوننت جدید فرم
import { useMeeting } from '../../Services/MeetingContext';

const MeetingsCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { inbox } = useMeeting();
  const meetingsData = inbox || [];
  console.log('🚀 ~ file: MeetingsCard.jsx:11 ~ MeetingsCard ~ meetingsData:', meetingsData);
  return (
    <>
      <div className="bg-white p-6 rounded-3xl border border-slate-900/10 shadow-[0_0_25px_rgba(15,23,42,0.22)] flex flex-col h-[350px] md:h-[300px] min-h-0 transition-all duration-300 hover:shadow-[0_0_35px_rgba(15,23,42,0.35)] ring-2 ring-blue-500/50" dir="rtl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h3 className="text-base font-bold text-slate-800">جلسات</h3>
          <div className="flex gap-2">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="text-gray-400 hover:text-indigo-600 text-xl cursor-pointer transition-colors p-1"
             >
               ＋
             </button>
             <button className="text-gray-400 hover:text-slate-700 font-bold cursor-pointer p-1">···</button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 px-2">
          {meetingsData.map((meeting) => (
            <MeetingItem key={meeting.id}
              title={meeting.title}
              description={meeting.subject}
              date={new Date(meeting.meetingDate).toLocaleDateString('fa-IR')}
              time={new Date(meeting.meetingDate).toLocaleTimeString('fa-IR')}
              type={meeting.type}
              participants={(meeting.requesterUsers || []).slice(0,4).map(u => ({ id: u.id, name: u.firstName + ' ' + u.lastName , profileImageUrl: u.profileImageUrl }))} // 🔹 تبدیل داده‌ها به فرمت مورد نیاز
            />
          ))}
        </div>

      </div>

      {/* 🗓️ فراخوانی کامپوننت فرم جدا شده */}
      <AddMeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default MeetingsCard;