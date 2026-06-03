// import React, { useState, useRef, useEffect } from "react";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";

// const AddMeetingModal = ({ isOpen, onClose , initialData }) => {
//   const allUsers = [
//     { id: 101, name: "دکتر احمدی", role: "استاد راهنما", avatar: "https://i.pravatar.cc/150?u=101" },
//     { id: 102, name: "مهندس رضایی", role: "مدیر آموزش", avatar: "https://i.pravatar.cc/150?u=102" },
//     { id: 103, name: "سارا موسوی", role: "دانشجو", avatar: "https://i.pravatar.cc/150?u=103" },
//     { id: 104, name: "علی کریمی", role: "پژوهشگر", avatar: "https://i.pravatar.cc/150?u=104" },
//     { id: 105, name: "دکتر حسینی", role: "رئیس دانشکده", avatar: "https://i.pravatar.cc/150?u=105" },
//   ];
// const [meetingTitle, setMeetingTitle] = useState(initialData?.title || "");
//   const [startTime, setStartTime] = useState("07:00");
//   const [endTime, setEndTime] = useState("07:30");
//   const [selectedParticipants, setSelectedParticipants] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isStartOpen, setIsStartOpen] = useState(false);
//   const [isEndOpen, setIsEndOpen] = useState(false);
//   const [timeError, setTimeError] = useState("");
//   const searchRef = useRef(null);
//   const startRef = useRef(null);
//   const endRef = useRef(null);
//   const [meetingDate, setMeetingDate] = useState(null);

//   const timeSlots = [];
//   for (let hour = 7; hour <= 23; hour++) {
//     timeSlots.push(`${hour}:00`);
//     timeSlots.push(`${hour}:30`);
//   }
//   timeSlots.push("24:00");

//   useEffect(() => {
//     function handleClickOutside(event) {
//       const isInsideAny = [searchRef, startRef, endRef].some(
//         (ref) => ref.current && ref.current.contains(event.target)
//       );
//       if (!isInsideAny) {
//         setIsSearchOpen(false);
//         setIsStartOpen(false);
//         setIsEndOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const sIndex = timeSlots.indexOf(startTime);
//     const eIndex = timeSlots.indexOf(endTime);
//     if (eIndex <= sIndex) {
//       setTimeError("زمان پایان باید بعد از زمان شروع باشد.");
//       setIsEndOpen(true);
//       return;
//     }
//     if (!meetingTitle || !meetingTitle.trim()) {
//       alert("لطفاً عنوان جلسه را وارد کنید.");
//       return;
//     }
//     if (!meetingDate) {
//       alert("لطفاً تاریخ جلسه را انتخاب کنید.");
//       return;
//     }
//     if (!selectedParticipants || selectedParticipants.length === 0) {
//       alert("لطفاً حداقل یک عضو برای جلسه انتخاب کنید.");
//       return;
//     }

//     setTimeError("");
//     let dateStr = "";
//     try {
//       if (meetingDate && typeof meetingDate.format === 'function') {
//         dateStr = meetingDate.format("YYYY/MM/DD");
//       } else if (meetingDate && meetingDate.toDate) {
//         dateStr = meetingDate.toDate().toLocaleDateString('fa-IR');
//       } else if (meetingDate instanceof Date) {
//         dateStr = meetingDate.toLocaleDateString('fa-IR');
//       } else {
//         dateStr = String(meetingDate);
//       }
//     } catch (err) {
//       dateStr = String(meetingDate);
//     }

//     alert(`موفقیت\nجلسه‌ی ${meetingTitle} در تاریخ ${dateStr} با موفقیت ذخیره شد.`);
//     onClose();
//   };

//   if (!isOpen) return null;

//   const filteredUsers = allUsers.filter(user =>
//     user.name.includes(searchQuery) && !selectedParticipants.some(s => s.id === user.id)
//   );

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//       <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      
//       <div className="bg-white w-full max-w-[650px] rounded-3xl p-6 shadow-2xl relative z-10 border border-slate-100 text-slate-800 overflow-hidden" dir="rtl">
//         <button onClick={onClose} className="text-slate-400 hover:text-rose-500 mb-4 cursor-pointer">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
//         </button>

//         <h2 className="text-lg font-bold text-slate-800 mb-4">ایجاد جلسه ی جدید</h2>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//           <div className="grid grid-cols-[80px_1fr] items-center gap-2">
//             <label className="text-sm font-bold">عنوان:</label>
//             <input value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} type="text" className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" />
//           </div>

//           <div className="grid grid-cols-[80px_1fr] items-start gap-2">
//             <label className="text-sm font-bold mt-2">توضیحات:</label>
//             <textarea rows="3" className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 resize-none"></textarea>
//           </div>

//           <div className="grid grid-cols-[80px_1fr] items-start gap-2 relative" ref={searchRef}>
//             <label className="text-sm font-bold mt-2">اعضا:</label>
//             <div className="w-full flex flex-col gap-2">
//               <div className="flex flex-wrap items-center gap-2">
//                 <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold">+</button>
//                 {selectedParticipants.map(user => (
//                   <div key={user.id} onClick={() => setSelectedParticipants(selectedParticipants.filter(s => s.id !== user.id))} className="flex items-center gap-2 pr-1 pl-3 py-1 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-rose-300">
//                     <img src={user.avatar} className="w-7 h-7 rounded-full object-cover" />
//                     <span className="text-xs font-bold">{user.name}</span>
//                   </div>
//                 ))}
//               </div>
//               {isSearchOpen && (
//                 <div className="absolute top-full right-0 w-80 mt-1 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden">
//                   <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="جستجو..." className="w-full p-3 text-xs border-b border-slate-50 outline-none" />
//                   <div className="max-h-60 overflow-y-auto">
//                     {filteredUsers.map(user => (
//                       <div key={user.id} onClick={() => { setSelectedParticipants([...selectedParticipants, user]); setIsSearchOpen(false); }} className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3">
//                         <img src={user.avatar} className="w-10 h-10 rounded-full" />
//                         <div>
//                           <div className="font-bold text-sm">{user.name}</div>
//                           <div className="text-[10px] text-indigo-950">{user.role}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

// <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//   <div className="flex flex-col gap-1.5">
//     <label className="text-xs font-bold">تاریخ:</label>
//     <DatePicker 
//       calendar={persian} 
//       locale={persian_fa} 
//       portal={true} 
//       inputClass="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500" 
//       containerClassName="w-full" 
//       value={meetingDate}
//       onChange={setMeetingDate}
//     />
//   </div>
  
// <div className="flex flex-col gap-1.5" ref={startRef}>
//   <label className="text-xs font-bold">شروع:</label>
//   <div className="relative w-full">
//     <button
//       type="button"
//       onClick={() => { setIsStartOpen((prev) => !prev); setIsEndOpen(false); }}
//       className="relative w-full text-left px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//     >
//       <span>{startTime}</span>
//       <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">▾</span>
//     </button>
//     {isStartOpen && (
//       <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
//         {timeSlots.map((t) => (
//           <button
//             key={t}
//             type="button"
//             onClick={() => {
//               setStartTime(t);
//               setIsStartOpen(false);
//               const selectedIndex = timeSlots.indexOf(t);
//               const endIndex = timeSlots.indexOf(endTime);
//               if (selectedIndex >= endIndex && selectedIndex < timeSlots.length - 1) {
//                 setEndTime(timeSlots[selectedIndex + 1]);
//               }
//             }}
//             className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100"
//           >
//             {t}
//           </button>
//         ))}
//       </div>
//     )}
//   </div>
// </div>

// <div className="flex flex-col gap-1.5" ref={endRef}>
//   <label className="text-xs font-bold">اتمام:</label>
//   <div className="relative w-full">
//     <button
//       type="button"
//       onClick={() => { setIsEndOpen((prev) => !prev); setIsStartOpen(false); }}
//       className="relative w-full text-left px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//     >
//       <span>{endTime}</span>
//       <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">▾</span>
//     </button>
//     {isEndOpen && (
//       <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
//         {(() => {
//           const available = timeSlots.slice(timeSlots.indexOf(startTime) + 1);
//           if (available.length === 0) return <div className="p-3 text-xs text-slate-400">زمانی بعد از شروع وجود ندارد</div>;
//           return available.map((t) => (
//             <button
//               key={t}
//               type="button"
//               onClick={() => {
//                 setEndTime(t);
//                 setIsEndOpen(false);
//               }}
//               className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100"
//             >
//               {t}
//             </button>
//           ));
//         })()}
//       </div>
//     )}
//   </div>
// </div>
// </div>

//           {timeError && <div className="text-rose-600 text-xs text-right">{timeError}</div>}
//           <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all">ذخیره جلسه</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMeetingModal;


import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useMeeting } from '../../Services/MeetingContext';
import toast from 'react-hot-toast';

const AddMeetingModal = ({ isOpen, onClose, initialData, onCreated }) => {
  // --- هوک‌ها (Hooks) باید همیشه در ابتدای کامپوننت باشند ---
  const [meetingTitle, setMeetingTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState(null);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('2');
  const [submitting, setSubmitting] = useState(false);
  const { createMeeting } = useMeeting();

  const searchRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);

  const allUsers = [
    { id: 101, name: "دکتر احمدی", role: "استاد راهنما", avatar: "https://i.pravatar.cc/150?u=101" },
    { id: 102, name: "مهندس رضایی", role: "مدیر آموزش", avatar: "https://i.pravatar.cc/150?u=102" },
    { id: 103, name: "سارا موسوی", role: "دانشجو", avatar: "https://i.pravatar.cc/150?u=103" },
  ];

  const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"];

  // مدیریت کلیک خارج از باکس‌ها برای بستن منوها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
      if (startRef.current && !startRef.current.contains(event.target)) setIsStartOpen(false);
      if (endRef.current && !endRef.current.contains(event.target)) setIsEndOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // شرط خروج (بعد از هوک‌ها)
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!meetingTitle.trim()) return toast.error("لطفاً عنوان جلسه را وارد کنید.");
    if (!meetingDate) return toast.error("لطفاً تاریخ جلسه را انتخاب کنید.");
    if (!selectedType) return toast.error("لطفاً نوع جلسه را انتخاب کنید.");

    // Prepare payload according to CreateMeetingViewModel
    const payload = {
      title: meetingTitle.trim(),
      subject: description || '',
      meetingDate: meetingDate.toDate ? meetingDate.toDate().toISOString() : new Date(meetingDate).toISOString(),
      requestDate: new Date().toISOString(),
      status: 1, // Pending
      type: parseInt(selectedType, 10),
      requesterUserIds: [1], // current user
      assignedUserIds: [1], // assign to current user by default
      tagIds: []
    };

    setSubmitting(true);
    createMeeting(payload).then(() => {
      toast.success('جلسه با موفقیت ساخته شد.');
      if (onCreated) {
        onCreated();
      }
      onClose();
    }).catch((err) => {
      console.error(err);
      toast.error('خطا در ایجاد جلسه');
    }).finally(() => setSubmitting(false));
  };


  const filteredUsers = allUsers.filter(u => u.name.includes(searchQuery) && !selectedParticipants.some(s => s.id === u.id));

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white w-full max-w-[650px] rounded-3xl p-6 shadow-2xl relative z-[10000]">
        <button onClick={onClose} className="text-slate-400 hover:text-rose-500 mb-4 cursor-pointer">✕</button>
        <h2 className="text-lg font-bold text-slate-800 mb-4">ایجاد جلسه ی جدید</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* عنوان */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-sm font-bold">عنوان:</label>
            <input value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} type="text" className="w-full px-4 py-2 text-sm bg-slate-50 border rounded-xl outline-none focus:border-indigo-500" />
          </div>

          {/* توضیحات (اضافه شد) */}
          <div className="grid grid-cols-[80px_1fr] items-start gap-2">
            <label className="text-sm font-bold mt-2">توضیحات:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 text-sm bg-slate-50 border rounded-xl outline-none focus:border-indigo-500 resize-none"></textarea>
          </div>

          {/* اعضا */}
          <div className="grid grid-cols-[80px_1fr] items-start gap-2 relative" ref={searchRef}>
            <label className="text-sm font-bold mt-2">اعضا:</label>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-10 h-10 rounded-full bg-indigo-50 border text-indigo-600 font-bold">+</button>
              {selectedParticipants.map(user => (
                <div key={user.id} onClick={() => setSelectedParticipants(selectedParticipants.filter(s => s.id !== user.id))} className="flex items-center gap-2 pr-1 pl-3 py-1 bg-white border rounded-full cursor-pointer">
                  <img src={user.avatar} className="w-7 h-7 rounded-full" alt="" />
                  <span className="text-xs font-bold">{user.name}</span>
                </div>
              ))}
            </div>
            {isSearchOpen && (
              <div className="absolute top-full right-0 w-64 mt-2 bg-white border shadow-xl rounded-2xl z-50">
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="جستجو..." className="w-full p-3 text-xs border-b outline-none" />
                {filteredUsers.map(user => (
                  <div key={user.id} onClick={() => { setSelectedParticipants([...selectedParticipants, user]); setIsSearchOpen(false); }} className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3">
                    <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                    <span className="text-sm">{user.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* تاریخ و زمان */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <DatePicker calendar={persian} locale={persian_fa} value={meetingDate} onChange={setMeetingDate} inputClass="w-full px-3 py-2 text-xs border rounded-xl" placeholder="تاریخ" />
             <div className="relative" ref={startRef}><button type="button" onClick={() => setIsStartOpen(!isStartOpen)} className="w-full py-2 text-xs border rounded-xl">{startTime} ▾</button>
                {isStartOpen && <div className="absolute w-full bg-white border rounded-xl max-h-40 overflow-y-auto">{timeSlots.map(t => <button key={t} type="button" onClick={() => {setStartTime(t); setIsStartOpen(false)}} className="block w-full p-2 text-xs hover:bg-slate-100">{t}</button>)}</div>}
             </div>
             <div className="relative" ref={endRef}><button type="button" onClick={() => setIsEndOpen(!isEndOpen)} className="w-full py-2 text-xs border rounded-xl">{endTime} ▾</button>
                {isEndOpen && <div className="absolute w-full bg-white border rounded-xl max-h-40 overflow-y-auto">{timeSlots.map(t => <button key={t} type="button" onClick={() => {setEndTime(t); setIsEndOpen(false)}} className="block w-full p-2 text-xs hover:bg-slate-100">{t}</button>)}</div>}
             </div>
          </div>

          <div className="flex items-center gap-2">
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="px-3 py-2 border rounded-xl text-sm">
              <option value="2">مجازی</option>
              <option value="3">حضوری داخل دانشگاه</option>
              <option value="4">حضوری خارج دانشگاه</option>
              <option value="1">سایر</option>
            </select>
            <button disabled={submitting} type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">{submitting ? 'در حال ارسال...' : 'ذخیره جلسه'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMeetingModal;