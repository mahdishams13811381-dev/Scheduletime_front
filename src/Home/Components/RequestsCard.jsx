import React, { useState } from "react";
import RequestItem from "./RequestItem";
import AddRequestModal from "./AddRequestModal";
import { useRequest } from "../../Services/RequestContext";

const RequestsCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { inbox, createRequest } = useRequest();

  const requestsData = inbox.map(r => ({
    id: r.id,
    name: `${r.senderUser.firstName} ${r.senderUser.lastName}`.trim(),
    date: new Date(r.createdAt).toLocaleDateString('fa-IR'),
    description: r.content,
    status: mapStatus(r.status),
    avatarUrl: r.senderUser.profileImageUrl || ''
  }));

  function mapStatus(status) {
    if (!status) return 'pending';
    if (status.toLowerCase().includes('approved')) return 'approved';
    if (status.toLowerCase().includes('rejected')) return 'rejected';
    return 'pending';
  }

  const handleAdd = async (form) => {
    try {
      const payload = {
        title: form.title,
        content: form.description,
        status: 1, // PendingApproval
        senderUserId: 1,
        currentOwnerUserId: (form.people && form.people[0] && form.people[0].id) || 1,
        tagIds: []
      };
      await createRequest(payload);
      window.alert('درخواست با موفقیت ساخته شد.');
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      window.alert('خطا در ایجاد درخواست');
    }
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-900/10 shadow-[0_0_25px_rgba(15,23,42,0.22)] flex flex-col h-[350px] md:h-[300px] min-h-0 transition-all duration-300 hover:shadow-[0_0_35px_rgba(15,23,42,0.35)] ring-2 ring-blue-500/50" dir="rtl">

      {/* هدر کارت */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-base font-bold text-slate-800">درخواست‌ها</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-gray-400 hover:text-slate-700 text-lg cursor-pointer"
          >
            ＋
          </button>
          <button className="text-gray-400 hover:text-slate-700 font-bold cursor-pointer">···</button>
        </div>
      </div>

      {/* محفظه اسکرول داخلی لیست - 🛠️ اصلاح شد: با حذف حداکثر ارتفاع، لیست داخل کارت اسکرول می‌شود نه خود کارت */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
        <div className="flex flex-col divide-y divide-gray-100  px-2">
          {requestsData.map((request) => (
            <RequestItem
              key={request.id}
              name={request.name}
              date={request.date}
              description={request.description}
              status={request.status}
              avatarUrl={request.avatarUrl}
            />
          ))}
        </div>
      </div>

      {isModalOpen && <AddRequestModal onClose={() => setIsModalOpen(false)} onAdd={handleAdd} />}

    </div>
  );
};

export default RequestsCard;
