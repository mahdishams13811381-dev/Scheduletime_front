import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { userService } from "../../Services/UserService";

const MeetingDetailsModal = ({ isOpen, onClose, initialData }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!isOpen || !initialData) return;

    if (initialData.assignedUsers && Array.isArray(initialData.assignedUsers)) {
      setParticipants(initialData.assignedUsers);
    } else if (initialData.assignedUserIds) {
      userService.getAllUsers().then((result) => {
        const users = result.items || [];
        setParticipants(
          users.filter((u) => initialData.assignedUserIds.includes(u.id))
        );
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen || !initialData) return null;

  const meetingTypeMap = {
    1: "سایر",
    2: "مجازی",
    3: "حضوری داخل دانشگاه",
    4: "حضوری خارج دانشگاه",
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="bg-white w-full max-w-[650px] rounded-3xl p-6 shadow-2xl relative z-[10000]">
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-rose-500 mb-4 cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold text-slate-800 mb-6">
          اطلاعات جلسه
        </h2>

        <div className="flex flex-col gap-5">

          {/* عنوان */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-sm font-bold">عنوان:</label>

            <input
              value={initialData.title || ""}
              disabled
              className="w-full px-4 py-2 text-sm bg-slate-100 border rounded-xl"
            />
          </div>

          {/* توضیحات */}
          <div className="grid grid-cols-[80px_1fr] items-start gap-2">
            <label className="text-sm font-bold mt-2">توضیحات:</label>

            <textarea
              value={initialData.subject || ""}
              disabled
              rows="3"
              className="w-full px-4 py-2 text-sm bg-slate-100 border rounded-xl resize-none"
            />
          </div>

          {/* اعضا */}
          <div className="grid grid-cols-[80px_1fr] items-start gap-2">
            <label className="text-sm font-bold mt-2">اعضا:</label>

            <div className="flex flex-wrap gap-2">
              {participants.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 bg-white border rounded-full px-2 py-1"
                >
                  <img
                    src={user.profileImageUrl || "/default-avatar.png"}
                    className="w-7 h-7 rounded-full object-cover"
                    alt=""
                  />

                  <span className="text-xs font-bold">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* تاریخ */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-sm font-bold">تاریخ:</label>

            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={
                initialData.meetingDate
                  ? new Date(initialData.meetingDate)
                  : null
              }
              disabled
              inputClass="w-full px-3 py-2 text-xs border rounded-xl bg-slate-100"
            />
          </div>

          {/* ساعت شروع و پایان */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-2 text-sm font-bold">
                ساعت شروع
              </label>

              <input
                value={initialData.startTime || ""}
                disabled
                className="w-full py-2 text-center text-sm border rounded-xl bg-slate-100"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold">
                ساعت پایان
              </label>

              <input
                value={initialData.endTime || ""}
                disabled
                className="w-full py-2 text-center text-sm border rounded-xl bg-slate-100"
              />
            </div>

          </div>

          {/* نوع جلسه */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-sm font-bold">نوع:</label>

            <input
              value={meetingTypeMap[initialData.type] || ""}
              disabled
              className="w-full px-4 py-2 text-sm bg-slate-100 border rounded-xl"
            />
          </div>

          {/* وضعیت */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-sm font-bold">وضعیت:</label>

            <input
              value={initialData.statusText || initialData.status || ""}
              disabled
              className="w-full px-4 py-2 text-sm bg-slate-100 border rounded-xl"
            />
          </div>

          <button
            onClick={onClose}
            className="mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;