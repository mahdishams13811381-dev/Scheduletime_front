import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import MeetingRow from './Components/MeetingRow';
import AddMeetingModal from './../Home/Components/AddMeetingModal'
import { useMeeting } from '../Services/MeetingContext';

const MeetingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("همه جلسات");

  // تعریف ستون‌ها و استایل‌های متناظر با تصویر
  const columnConfig = {
    "جلسات حضوری داخل دانشگاه": { border: "border-green-600", text: "text-green-700", badge: "bg-green-100 text-green-700" },
    "جلسات حضوری خارج دانشگاه": { border: "border-red-600", text: "text-red-700", badge: "bg-red-100 text-red-700" },
    "جلسات آنلاین": { border: "border-amber-500", text: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
    "سایر جلسات": { border: "border-blue-600", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" }
  };

  const tabs = ["همه جلسات", "سایر جلسات", "جلسات آنلاین", "جلسات حضوری خارج دانشگاه", "جلسات حضوری داخل دانشگاه"];

  const categoryKeys = [
    "جلسات حضوری داخل دانشگاه",
    "جلسات حضوری خارج دانشگاه",
    "جلسات آنلاین",
    "سایر جلسات"
  ];

  const normalizeGrouped = (groupedData) => {
    const emptyMap = categoryKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {});

    if (!groupedData || typeof groupedData !== 'object') return emptyMap;

    const isCategoryShape = categoryKeys.some(key => Array.isArray(groupedData[key]));
    if (isCategoryShape) {
      return categoryKeys.reduce((acc, key) => ({ ...acc, [key]: Array.isArray(groupedData[key]) ? groupedData[key] : [] }), {});
    }

    const normalized = { ...emptyMap };
    const addTo = (meeting) => {
      const type = (meeting?.type || '').toLowerCase();
      if (type === 'online') normalized['جلسات آنلاین'].push(meeting);
      else if (type === 'internaluniversity') normalized['جلسات حضوری داخل دانشگاه'].push(meeting);
      else if (type === 'externaluniversity') normalized['جلسات حضوری خارج دانشگاه'].push(meeting);
      else normalized['سایر جلسات'].push(meeting);
    };

    ['pending', 'held', 'rejected'].forEach((status) => {
      const statusObj = groupedData[status] || {};
      Object.values(statusObj).forEach((arr) => (Array.isArray(arr) ? arr.forEach(addTo) : null));
    });

    return normalized;
  };

  const [data, setData] = useState(() => ({
    "جلسات حضوری داخل دانشگاه": [],
    "جلسات حضوری خارج دانشگاه": [],
    "جلسات آنلاین": [],
    "سایر جلسات": []
  }));
  console.log('🚀 ~ file: MeetingPage.jsx:50 ~ MeetingPage ~ data:', data);

  // ذخیره در localStorage با هر تغییر در data
  const { grouped, loadGrouped } = useMeeting();

  useEffect(() => {
    if (!grouped) return;
    setData(normalizeGrouped(grouped));
  }, [grouped]);

  const handleAddMeeting = (newRequest) => {
  console.log("در حال افزودن جلسه:", newRequest); // این خط را اضافه کنید
  setData(prev => ({
    ...prev,
    "جلسات حضوری داخل دانشگاه": [...prev["جلسات حضوری داخل دانشگاه"], { ...newRequest, id: Date.now().toString() }]
  }));
  setIsModalOpen(false);
};

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    
    const newData = { ...data };
    const [movedItem] = newData[source.droppableId].splice(source.index, 1);
    newData[destination.droppableId].splice(destination.index, 0, movedItem);
    setData(newData);
  };
  

  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      {/* هدر صفحه */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800">همه جلسات</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          + افزودن
        </button>
      </div>

      {/* تب‌ها */}
      <div className="flex gap-8 mb-8 border-b border-slate-200">
        {tabs.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-indigo-400"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* بورد جلسات */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.keys(columnConfig).filter(col => activeTab === "همه جلسات" || col === activeTab).map((columnName) => (
            <Droppable key={columnName} droppableId={columnName}>
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className="flex flex-col md:min-h-[500px]"
                >
                  <div className={`flex justify-between items-center mb-4 pb-2 border-b-2 ${columnConfig[columnName].border}`}>
                    <Link to={`/meetingsList?status=${columnName}`} className={`font-bold text-lg ${columnConfig[columnName].text}`}>
                      {columnName}
                    </Link>
                    <span className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-black shadow-md ${columnConfig[columnName].badge}`}>
                      {data[columnName]?.length || 0}
                    </span>
                  </div>
                  
                  {data[columnName]?.map((item, index) => (
                    <Draggable key={`${columnName}-${item.id}`} draggableId={String(item.id)} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps} 
                          className="mb-3"
                        >
                          <MeetingRow {...item} />
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

      {isModalOpen && (
  <AddMeetingModal
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)} 
    onAdd={handleAddMeeting} 
  />
)}
    </div>
  );
};

export default MeetingPage;