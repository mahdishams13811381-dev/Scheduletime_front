// import React, { useState } from 'react';
// import MeetingElement from './MeetingElement';
// import AddMeetingModal from '../Home/Components/AddMeetingModal';

// const MeetingsList = () => {
// const [isModalOpen, setIsModalOpen] = useState(false);
// const [currentMeeting, setCurrentMeeting] = useState(null);

// const handleEditClick = (meeting) => {
//   setCurrentMeeting(meeting); // ست کردن داده‌های جلسه برای مودال
//   setIsModalOpen(true);       // باز کردن مودال
// };
//   const [editingMeeting, setEditingMeeting] = useState(null); // نگهداری دیتای جلسه برای ویرایش

// const handleEdit = (meeting) => {
//   setEditingMeeting(meeting); // ست کردن جلسه برای ویرایش
//   setIsModalOpen(true);       // باز کردن مودال
// };
//   // دیتای پیش‌فرض
//   const [meetings, setMeetings] = useState([
//     { id: 1, title: "جلسه شورای آموزشی", description: "بررسی سرفصل‌های جدید", date: "1405/02/10", time: "09:00", status: "تایید شده" },
//     { id: 2, title: "جلسه دفاع پایان‌نامه", description: "دفاع دانشجوی ارشد", date: "1405/02/12", time: "11:00", status: "در انتظار" },
//   ]);

//   // تابع دانلود گزارش
//   const handleDownloadReport = (meeting) => {
//     const reportContent = `گزارش جلسه: ${meeting.title}\nتاریخ: ${meeting.date}\nوضعیت: ${meeting.status}\nتوضیحات: ${meeting.description}`;
//     const blob = new Blob([reportContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Report_${meeting.title}.txt`;
//     a.click();
//   };

//   const handleDelete = (id) => setMeetings(meetings.filter(m => m.id !== id));
//   const handleDownloadFile = (fileUrl) => {
//   const a = document.createElement('a');
//   a.href = fileUrl; // آدرس فایل در سرور
//   a.download = 'صورت_جلسه.pdf';
//   a.click();
// };
//   return (
//     <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
//       <h2 className="text-xl font-bold mb-6">لیست جلسات</h2>
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//         <table className="w-full">
//           {/* ... همان ساختار thead قبلی ... */}
//           <tbody>
//   {meetingsToShow.map((meeting) => (
//     <MeetingElement 
//       key={meeting.id} 
//       {...meeting}
//       onEdit={() => handleEditClick(meeting)} // این خط مهم است!
//     />
//   ))}
// </tbody>
//         </table>
//       </div>
//       {isModalOpen && (
//   <AddMeetingModal 
//     isOpen={isModalOpen}
//     onClose={() => setIsModalOpen(false)}
//     initialData={currentMeeting} // فرستادن داده‌های جلسه به مودال
//   />
// )}
//     </div>
//   );
// };
// export default MeetingsList


import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MeetingElement from './MeetingElement';
import AddMeetingModal from './../Home/Components/AddMeetingModal';
import MeetingReportModal from './MeetingReportModal';
import { useMeeting } from '../Services/MeetingContext';

const MeetingsList = () => {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const { grouped, loading } = useMeeting();

  const meetings = [];

const statusFilter = searchParams.get('status');
const [isReportOpen, setIsReportOpen] = useState(false);
const [selectedMeeting, setSelectedMeeting] = useState(null);

const handleOpenReport = (meeting) => {
  setSelectedMeeting(meeting);
  setIsReportOpen(true);
};

  const handleEditClick = (meeting) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        لیست {statusFilter || "همه جلسات"}
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th className="p-4">ساعت</th>
              <th className="p-4">تاریخ</th>
              <th className="p-4 text-right">عنوان جلسه</th>
              <th className="p-4 text-right">توضیحات</th>
              <th className="p-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {/* Render grouped meetings by status -> type */}
            {loading && (
              <tr><td colSpan="6" className="p-8 text-center">در حال بارگذاری...</td></tr>
            )}

            {!loading && (
              <>
                {['Pending','Held','Rejected'].map(statusKey => {
                  const statusObj = (grouped || {})[statusKey.toLowerCase()] || {};
                  const hasAny = Object.values(statusObj).some(arr => (arr || []).length > 0);
                  return (
                    hasAny ? (
                      <React.Fragment key={statusKey}>
                        <tr className="bg-slate-50"><td colSpan="6" className="p-3 font-bold">{statusKey}</td></tr>
                        {['Online','InternalUniversity','ExternalUniversity','Other'].map(typeKey => {
                          const list = statusObj[typeKey.charAt(0).toLowerCase() + typeKey.slice(1)] || [];
                          if (!list || list.length === 0) return null;
                          return (
                            <React.Fragment key={typeKey}>
                              <tr className="bg-white"><td colSpan="6" className="p-2 text-sm font-semibold text-slate-600">{typeKey}</td></tr>
                              {list.map(meeting => (
                                <MeetingElement
                                  key={meeting.id}
                                  title={meeting.title}
                                  description={meeting.subject}
                                  date={new Date(meeting.meetingDate).toLocaleDateString('fa-IR')}
                                  time={new Date(meeting.meetingDate).toLocaleTimeString('fa-IR')}
                                  status={meeting.status}
                                  onEdit={() => handleEditClick(meeting)}
                                  onReport={() => handleOpenReport(meeting)}
                                  onDelete={() => console.log('delete', meeting.id)}
                                />
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    ) : null
                  );
                })}
              </>
            )}
          </tbody>
        </table>
        <MeetingReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        meeting={selectedMeeting} 
      />
      </div>

      {/* مودال برای ویرایش */}
      {isModalOpen && (
        <AddMeetingModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMeeting(null);
          }}
          initialData={editingMeeting}
        />
      )}
    </div>
  );
};

export default MeetingsList;