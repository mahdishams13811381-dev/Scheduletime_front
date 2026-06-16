import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useMeeting } from '../../Services/MeetingContext';
import { userService } from "../../Services/UserService";
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

  const [allUsers, setAllUsers] = useState([]);

  const timeSlots = [];

  for (let hour = 0; hour < 24; hour++) {
    timeSlots.push(
      `${hour.toString().padStart(2, "0")}:00`,
      `${hour.toString().padStart(2, "0")}:30`
    );
  }
  useEffect(() => {
    if (!isOpen) return;

    userService.getAllUsers()
      .then(result => {
        setAllUsers(result.items || []);
      })
      .catch(err => {
        console.error(err);
        toast.error("خطا در دریافت کاربران");
      });

  }, [isOpen]);

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

    const currentUserId = Number(userService.getCurrentUserId());

    // Prepare payload according to CreateMeetingViewModel
    const payload = {
      title: meetingTitle.trim(),
      subject: description || '',
      meetingDate: meetingDate.toDate ? meetingDate.toDate().toISOString() : new Date(meetingDate).toISOString(),
      requestDate: new Date().toISOString(),
      status: 1, // Pending
      type: parseInt(selectedType, 10),
      requesterUserIds: [currentUserId],
      assignedUserIds: [
        currentUserId,
        ...selectedParticipants.map(x => x.id)
      ], tagIds: []
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


  const filteredUsers = allUsers.filter(
    u =>
      (`${u.firstName} ${u.lastName}`)
        .includes(searchQuery) &&
      !selectedParticipants.some(
        s => s.id === u.id
      )
  );

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

            <div className="flex flex-col gap-2">

              {/* اعضای انتخاب شده */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(prev => !prev)}
                  className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-lg font-bold"
                >
                  +
                </button>

                {selectedParticipants.map(user => (
                  <div
                    key={user.id}
                    onClick={() =>
                      setSelectedParticipants(
                        selectedParticipants.filter(x => x.id !== user.id)
                      )
                    }
                    className="flex items-center gap-2 bg-white border rounded-full px-2 py-1 cursor-pointer hover:border-red-300"
                  >
                    <img
                      src={user.profileImageUrl || "/default-avatar.png"}
                      className="w-7 h-7 rounded-full object-cover"
                      alt=""
                    />

                    <span className="text-xs font-bold">
                      {user.firstName} {user.lastName}
                    </span>

                    <span className="text-red-500 text-xs">✕</span>
                  </div>
                ))}
              </div>

              {/* لیست کاربران */}
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border shadow-xl rounded-2xl z-50 overflow-hidden">

                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی اعضا..."
                    className="w-full p-3 border-b outline-none text-sm"
                  />

                  <div className="max-h-64 overflow-y-auto">

                    {filteredUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => {
                          setSelectedParticipants(prev => [...prev, user]);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                      >
                        <img
                          src={user.profileImageUrl || "/default-avatar.png"}
                          className="w-10 h-10 rounded-full object-cover"
                          alt=""
                        />

                        <div>
                          <div className="font-bold text-sm">
                            {user.firstName} {user.lastName}
                          </div>

                          <div className="text-xs text-slate-500">
                            {user.position}
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredUsers.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400">
                        کاربری یافت نشد
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* تاریخ و زمان */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DatePicker calendar={persian} locale={persian_fa} value={meetingDate} onChange={setMeetingDate} inputClass="w-full px-3 py-2 text-xs border rounded-xl" placeholder="تاریخ" />
            <div className="relative" ref={startRef}><button type="button" onClick={() => setIsStartOpen(!isStartOpen)} className="w-full py-2 text-xs border rounded-xl">{startTime} ▾</button>
              {isStartOpen && <div className="absolute w-full bg-white border rounded-xl max-h-40 overflow-y-auto">{timeSlots.map(t => <button key={t} type="button" onClick={() => { setStartTime(t); setIsStartOpen(false) }} className="block w-full p-2 text-xs hover:bg-slate-100">{t}</button>)}</div>}
            </div>
            <div className="relative" ref={endRef}><button type="button" onClick={() => setIsEndOpen(!isEndOpen)} className="w-full py-2 text-xs border rounded-xl">{endTime} ▾</button>
              {isEndOpen && <div className="absolute w-full bg-white border rounded-xl max-h-40 overflow-y-auto">{timeSlots.map(t => <button key={t} type="button" onClick={() => { setEndTime(t); setIsEndOpen(false) }} className="block w-full p-2 text-xs hover:bg-slate-100">{t}</button>)}</div>}
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