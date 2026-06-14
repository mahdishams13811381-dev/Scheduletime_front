import React from 'react';
import TaskCard from './TaskCard';

const DailyView = ({ events = [], loading, onEventClick }) => {
  const hours = Array.from({ length: 19 }, (_, i) => i + 6);
  const rowHeight = 50;

  const renderEvents = events
    .map((event) => {
      const eventDate = new Date(event.eventDate || event.EventDate);
      const start = eventDate.getHours() + eventDate.getMinutes() / 60;
      const duration = (event.type || event.Type) === 'Meeting' ? 1.5 : 1;
      const end = start + duration;

      return {
        ...event,
        start,
        end,
        time: eventDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        desc: (event.type || event.Type) === 'Meeting' ? `وضعیت: ${event.status || event.Status}` : `مهلت: ${eventDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`,
        location: (event.type || event.Type) === 'Meeting' ? 'جلسه' : 'تسک',
        colorClass: event.color || event.Color || 'bg-slate-100'
      };
    })
    .sort((a, b) => a.start - b.start);

  return (
    <div className="relative w-full min-w-[320px] bg-white p-3 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-[0_0_35px_rgba(15,23,42,0.35)] ring-2 ring-blue-500/50 overflow-x-auto">      {loading && <div className="absolute top-6 right-10 text-slate-400 text-sm">در حال بارگذاری...</div>}

      {hours.map((hour) => (
        <div key={hour} className="flex border-t border-slate-100" style={{ height: `${rowHeight}px` }}>
          <div className="w-12 md:w-20 text-xs md:text-[15px] text-slate-400 pt-2">{hour}:00</div>
          <div className="flex-1 border-r border-slate-50 border-dashed"></div>
        </div>
      ))}

      {renderEvents.map((event) => (
        <div
          key={`${event.Type}-${event.Id}-${event.start}`}
          className="absolute right-16 md:right-28 left-2 md:left-8 cursor-pointer"
          style={{
            top: `${Math.max(0, (event.start - 6) * rowHeight + 24)}px`,
            height: `${Math.max(30, (event.end - event.start) * rowHeight)}px`
          }}
          onClick={() => onEventClick?.(event)}
        >
          <TaskCard
            title={event.title || event.Title}
            desc={event.desc}
            time={event.time}
            location={event.location}
            colorClass={event.colorClass}
          />
        </div>
      ))}
    </div>
  );
};

export default DailyView;