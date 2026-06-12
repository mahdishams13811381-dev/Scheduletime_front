import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AddRequestModal from '../../Home/Components/AddRequestModal';
import RequestElement from './RequestElement';
import RequestDetailModal from './RequestDetailModal';
import { useRequest } from '../../Services/RequestContext';

const RequestList = () => {
  const { grouped, createRequest } = useRequest();

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');

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
        currentOwnerUserId:
          (form.people && form.people[0] && form.people[0].id) || 1,
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
    date: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('fa-IR')
      : '',
    time: r.createdAt
      ? new Date(r.createdAt).toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit'
      })
      : '',
    status: r.status,
    onEdit: () => {
      setEditingRequest(r);
      setIsModalOpen(true);
    },
    onView: () => setViewingRequest(r)
  });

  const statusMap = {
      "در انتظار": "pending",
    'در انتظار تایید': 'pending',
    'تایید شده': 'approved',
    'رد شده': 'rejected'
  };

  const selectedRequests = statusFilter
    ? grouped?.[statusMap[statusFilter]] || []
    : [
      ...(grouped?.pending || []),
      ...(grouped?.approved || []),
      ...(grouped?.rejected || [])
    ];
  console.log("grouped:", grouped);
  console.log("statusFilter:", statusFilter);
  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800">
          {statusFilter
            ? `لیست ${statusFilter}`
            : 'لیست همه درخواست‌ها'}
        </h1>

        <button
          onClick={() => {
            setEditingRequest(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          + افزودن
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs">
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
            {selectedRequests.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-8 text-center text-slate-500"
                >
                  موردی یافت نشد
                </td>
              </tr>
            ) : (
              selectedRequests.map((r) => (
                <RequestElement
                  key={r.id}
                  {...mapToRowProps(r)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddRequestModal
          requestData={editingRequest}
          onClose={() => {
            setIsModalOpen(false);
            setEditingRequest(null);
          }}
          onAdd={handleAdd}
        />
      )}

      {viewingRequest && (
        <RequestDetailModal
          requestData={viewingRequest}
          onClose={() => setViewingRequest(null)}
        />
      )}
    </div>
  );
};

export default RequestList;