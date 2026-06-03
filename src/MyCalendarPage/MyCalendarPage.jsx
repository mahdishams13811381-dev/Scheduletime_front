import { FaPlus, FaCalendarDay, FaUniversity, FaGlobe, FaThLarge, FaCheckCircle, FaEdit, FaSyncAlt } from 'react-icons/fa';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyView from './Components/DailyView';
import WeeklyView from './Components/WeeklyView';
import MonthlyView from './Components/MonthlyView';
import YearlyView from './Components/YearlyView';
import AddMeetingModal from '../Home/Components/AddMeetingModal';
import AddRequestModal from '../Home/Components/AddRequestModal';
import AddTaskComponent from '../Home/Components/AddTaskComponent';
import { useCalendar } from '../Services/CalendarContext';

const MyCalendar = () => {
  const {
    selectedDate,
    view,
    filter,
    events,
    loading,
    changeView,
    changeFilter,
    goToPrevious,
    goToNext,
    goToToday,
    refreshEvents,
    setSelectedDate
  } = useCalendar();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  const persianDate = selectedDate
    ? selectedDate.toLocaleDateString('fa-IR-u-ca-persian')
    : '';

  const categoryCards = [
    { title: 'آنلاین', color: 'bg-blue-100', icon: <FaGlobe className="text-blue-500" />, filterKey: 'online' },
    { title: 'دانشگاه', color: 'bg-green-100', icon: <FaUniversity className="text-green-500" />, filterKey: 'internal' },
    { title: 'خارجی', color: 'bg-amber-100', icon: <FaCalendarDay className="text-amber-500" />, filterKey: 'external' },
    { title: 'سایر', color: 'bg-slate-200', icon: <FaThLarge className="text-slate-600" />, filterKey: 'other' },
    { title: 'کارهای من', color: 'bg-rose-100', icon: <FaCheckCircle className="text-rose-500" />, filterKey: 'tasks' }
  ];

  const categoryCounts = {
    online: events.filter((e) => (e.color || e.Color) === 'bg-blue-100').length,
    internal: events.filter((e) => (e.color || e.Color) === 'bg-green-100').length,
    external: events.filter((e) => (e.color || e.Color) === 'bg-amber-100').length,
    other: events.filter((e) => (e.color || e.Color) === 'bg-slate-100').length,
    tasks: events.filter((e) => (e.type || e.Type) === 'Task').length
  };

  const filterButtons = [
    { key: 'all', label: 'همه' },
    { key: 'meetings', label: 'جلسات' },
    { key: 'tasks', label: 'تسک‌ها' }
  ];

  const handleEventClick = (event) => {
    navigate(event.navigationUrl || event.NavigationUrl);
  };

  const onEventCreated = () => {
    refreshEvents();
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10" dir="rtl">
      {activeModal === 'meeting' && (
        <AddMeetingModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onCreated={onEventCreated}
        />
      )}
      {activeModal === 'request' && <AddRequestModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'myTask' && (
        <AddTaskComponent
          onClose={() => setActiveModal(null)}
          forcedAssignee="خودم"
          onTaskCreated={onEventCreated}
        />
      )}
      {activeModal === 'assignedTask' && (
        <AddTaskComponent
          onClose={() => setActiveModal(null)}
          forcedAssignee="دیگران"
          onTaskCreated={onEventCreated}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
            >
              <FaPlus /> افزودن
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-14 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                {[
                  { title: 'جلسات', icon: <FaCalendarDay />, modal: 'meeting' },
                  { title: 'درخواست ها', icon: <FaSyncAlt />, modal: 'request' },
                  { title: 'کارهای من', icon: <FaCheckCircle />, modal: 'myTask' },
                  { title: 'کارهای محوله', icon: <FaEdit />, modal: 'assignedTask' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveModal(item.modal);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-medium transition-colors"
                  >
                    <span className="text-indigo-500">{item.icon}</span>
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button onClick={goToPrevious} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs text-slate-500 hover:bg-slate-50 transition-all">قبلی</button>

            <div className="flex bg-white border border-slate-100 rounded-full p-1 shadow-sm">
              {['سالیانه', 'ماهانه', 'هفتگی', 'روزانه'].map((item) => (
                <button
                  key={item}
                  onClick={() => changeView(item)}
                  className={`px-6 py-2 rounded-full text-sm transition-all ${view === item ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={goToNext} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs text-slate-500 hover:bg-slate-50 transition-all">بعدی</button>

              <button onClick={goToToday} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs text-slate-500 hover:bg-slate-50 transition-all">فعلی</button>
            </div>
          </div>

          <div className="text-slate-400 font-medium text-sm bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            {persianDate}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-6">
          {filterButtons.map((item) => (
            <button
              key={item.key}
              onClick={() => changeFilter(item.key)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === item.key ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-4 mb-10">
          {categoryCards.map((item, idx) => {
            const count = categoryCounts[item.filterKey] || 0;
            return (
              <div key={idx} className={`${item.color} h-28 p-5 rounded-3xl border border-white shadow-sm flex flex-col justify-between transition-all cursor-pointer hover:shadow-[0_0_35px_rgba(15,23,42,0.35)]`}>
                <div className="flex justify-between items-start">
                  <div className="text-xl">{item.icon}</div>
                  {count > 0 && (
                    <span className="bg-white/60 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-700">{count}</span>
                  )}
                </div>
                <span className="font-bold text-[12px] text-slate-800">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full px-4">
        {view === 'روزانه' && <DailyView events={events} loading={loading} onEventClick={handleEventClick} />}
        {view === 'هفتگی' && <WeeklyView events={events} selectedDate={selectedDate} onEventClick={handleEventClick} />}
        {view === 'ماهانه' && <MonthlyView events={events} selectedDate={selectedDate} onEventClick={setSelectedDate} />}
        {view === 'سالیانه' && <YearlyView events={events} selectedDate={selectedDate} onMonthSelect={setSelectedDate} />}
      </div>
    </div>
  );
};

export default MyCalendar;
