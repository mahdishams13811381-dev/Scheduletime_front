// import React, { useState } from 'react';
// import AddRequestModal from './../Home/Components/AddRequestModal';
// import RequestElement from './RequestElement';

// const RequestList = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("همه درخواست‌ها");

//   const requests = [
//     { id: 1, title: "عنوان کار ۱", description: "توضیحات مربوط به کار اول...", date: "۱۴۰۵/۰۱/۲۰", time: "۸:۰۰ - ۹:۳۰" },
//     { id: 2, title: "عنوان کار ۲", description: "توضیحات مربوط به کار دوم...", date: "۱۴۰۵/۰۱/۲۰", time: "۱۰:۰۰ - ۱۱:۳۰" },
//   ];

//   return (
//     <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-xl font-bold text-slate-800">لیست درخواست‌ها</h1>
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all"
//         >
//           + افزودن
//         </button>
//       </div>

//       <div className="flex items-center gap-6 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
//         <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
//           <span>فیلتر نمایش:</span>
//         </div>
//         <div className="flex items-center gap-4">
//           {["جلسات", "درخواست‌ها", "وظایف"].map((filter) => (
//             <label key={filter} className="flex items-center gap-2 cursor-pointer">
//               <input type="radio" name="filter" className="w-4 h-4 text-indigo-600" />
//               <span className="text-sm font-medium text-slate-700">{filter}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="flex flex-col">
//         {requests.map((req) => (
//           <RequestElement key={req.id} {...req} />
//         ))}
//       </div>

//       {isModalOpen && (
//         <AddRequestModal 
//           onClose={() => setIsModalOpen(false)} 
//           onAdd={(data) => {
//              console.log("درخواست جدید:", data);
//              setIsModalOpen(false);
//           }} 
//         />
//       )}
//     </div>
//   );
// };

// export default RequestList;
import React, { useState } from 'react';
import AddRequestModal from '../../Home/Components/AddRequestModal';
import RequestElement from './RequestElement';
import RequestDetailModal from './RequestDetailModal';
import { useRequest } from '../../Services/RequestContext';

const RequestList = () => {
  const { grouped, createRequest } = useRequest();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);

  const handleAdd = async (form) => {
    try {
      const payload = {
        title: form.title,
        content: form.description,
        status: 1,
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
  };

  const mapToRowProps = (r) => ({
    id: r.id,
    title: r.title,
    description: r.content,
    date: new Date(r.createdAt).toLocaleDateString('fa-IR'),
    time: '',
    status: r.status,
    onEdit: () => { setEditingRequest(r); setIsModalOpen(true); },
    onView: () => setViewingRequest(r)
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800">لیست درخواست‌ها</h1>
        <button onClick={() => { setEditingRequest(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all">+ افزودن</button>
      </div>

      {/* Pending Approval */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">در انتظار تایید</h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="p-4">ساعت</th>
                <th className="p-4">تاریخ</th>
                <th className="p-4">عنوان</th>
                <th className="p-4">توضیحات</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {(grouped.pending || []).map(r => (
                <RequestElement key={r.id} {...mapToRowProps(r)} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Approved */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">تایید شده</h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="p-4">ساعت</th>
                <th className="p-4">تاریخ</th>
                <th className="p-4">عنوان</th>
                <th className="p-4">توضیحات</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {(grouped.approved || []).map(r => (
                <RequestElement key={r.id} {...mapToRowProps(r)} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rejected */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">رد شده</h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="p-4">ساعت</th>
                <th className="p-4">تاریخ</th>
                <th className="p-4">عنوان</th>
                <th className="p-4">توضیحات</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {(grouped.rejected || []).map(r => (
                <RequestElement key={r.id} {...mapToRowProps(r)} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <AddRequestModal requestData={editingRequest} onClose={() => { setIsModalOpen(false); setEditingRequest(null); }} onAdd={handleAdd} />
      )}

      {viewingRequest && (
        <RequestDetailModal requestData={viewingRequest} onClose={() => setViewingRequest(null)} />
      )}
    </div>
  );
};

export default RequestList;