import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom'; // اضافه شد
import RequestRow from './Components/RequestRow';
import AddRequestModal from './../Home/Components/AddRequestModal';
import { useRequest } from '../Services/RequestContext';

const RequestPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("همه درخواست‌ها");

  const columnStyles = {
    "تایید شده": { border: "border-green-500", text: "text-slate-900", badge: "bg-green-100 text-green-700" },
    "تایید نشده": { border: "border-red-500", text: "text-slate-900", badge: "bg-red-100 text-red-700" },
    "در انتظار": { border: "border-amber-400", text: "text-slate-900", badge: "bg-amber-100 text-amber-700" },
    "ارجاعات": { border: "border-blue-500", text: "text-slate-900", badge: "bg-blue-100 text-blue-700" }
  };

  const { grouped, createRequest } = useRequest();

  const data = useMemo(() => ({
    "تایید شده": (grouped.approved || []).map(r => ({ id: r.id.toString(), ...r })),
    "تایید نشده": (grouped.rejected || []).map(r => ({ id: r.id.toString(), ...r })),
    "در انتظار": (grouped.pending || []).map(r => ({ id: r.id.toString(), ...r })),
    "ارجاعات": []
  }), [grouped]);

  const handleAddRequest = async (newRequest) => {
    try {
      const payload = {
        title: newRequest.title,
        content: newRequest.description,
        status: 1,
        senderUserId: 1,
        currentOwnerUserId: (newRequest.people && newRequest.people[0] && newRequest.people[0].id) || 1,
        tagIds: []
      };
      await createRequest(payload);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      window.alert('خطا در ایجاد درخواست');
    }
  };
  const onDragEnd = (result) => {
    // client-side drag only; not persisted to backend in this iteration
  };

  const tabs = ["همه درخواست‌ها", "ارجاعات", "در انتظار", "تایید نشده", "تایید شده"];

  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800">همه درخواست‌ها</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all">+ افزودن</button>
      </div>

      <div className="flex gap-8 mb-8 border-b border-slate-200">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500"}`}>{tab}</button>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.keys(data).filter(col => activeTab === "همه درخواست‌ها" || col === activeTab).map((columnName) => (
            <Droppable key={columnName} droppableId={columnName}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col md:min-h-[500px]">
                  <div className={`flex justify-between items-center mb-4 pb-2 border-b-2 ${columnStyles[columnName].border}`}>
                    <Link to={`/requestsList?status=${columnName}`} className={`font-bold text-lg ${columnStyles[columnName].text}`}>
                      {columnName}
                    </Link>
                    <span className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-black shadow-md ${columnStyles[columnName].badge}`}>{data[columnName].length}</span>
                  </div>
                  {data[columnName].map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-3">
                          <RequestRow {...item} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && <AddRequestModal onClose={() => setIsModalOpen(false)} onAdd={handleAddRequest} />}
    </div>
  );
};

export default RequestPage;