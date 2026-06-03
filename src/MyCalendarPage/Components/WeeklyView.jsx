import React from 'react';
import WeeklyTaskCard from './WeeklyTaskCard';

const WeeklyView = ({ events = [], selectedDate, onEventClick }) => {
  const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const rowHeight = 60;

  const weekStart = (() => {
    const current = selectedDate ? new Date(selectedDate) : new Date();
    current.setHours(0, 0, 0, 0);
    const dayOfWeek = current.getDay();
    const offset = (dayOfWeek + 1) % 7;
    current.setDate(current.getDate() - offset);
    return current;
  })();

  const headerDates = days.map((_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date.toLocaleDateString('fa-IR-u-ca-persian', { day: '2-digit' });
  });

  const normalizedEvents = events
    .map((event) => {
      const eventDate = new Date(event.eventDate || event.EventDate);
      const eventDay = new Date(eventDate);
      eventDay.setHours(0, 0, 0, 0);
      const dayIndex = Math.round((eventDay.getTime() - weekStart.getTime()) / 86400000);
      const start = eventDate.getHours() + eventDate.getMinutes() / 60;
      const duration = (event.type || event.Type) === 'Meeting' ? 1.5 : 1;
      return {
        ...event,
        dayIndex,
        start,
        end: start + duration,
        location: event.type || event.Type,
        time: eventDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        colorClass: event.color || event.Color || 'bg-slate-100'
      };
    })
    .filter((event) => event.dayIndex >= 0 && event.dayIndex < 7)
    .sort((a, b) => a.dayIndex - b.dayIndex || a.start - b.start);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl mt-10 overflow-x-auto" dir="rtl">
      <div className="grid grid-cols-8 border-b border-slate-200 pb-4 mb-2">
        <div className="w-16"></div>
        {days.map((d, index) => (
          <div key={d} className="text-center">
            <div className="font-bold text-slate-800">{d}</div>
            <div className="text-[12px] text-slate-400 font-medium">{headerDates[index]}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 relative border-t border-slate-200">
        <div className="border-l-2 border-slate-300 bg-slate-50/50">
          {hours.map((h) => (
            <div key={h} className="text-[15px] text-slate-500 font-bold text-center border-b border-slate-200 flex items-center justify-center" style={{ height: `${rowHeight}px` }}>
              {h}:00
            </div>
          ))}
        </div>

        {days.map((_, dayIndex) => (
          <div key={dayIndex} className="border-l border-slate-200 relative">
            {hours.map((h) => (
              <div key={h} className="border-b border-slate-200" style={{ height: `${rowHeight}px` }}></div>
            ))}

            {normalizedEvents
              .filter((event) => event.dayIndex === dayIndex)
              .map((event) => (
                <div
                  key={`${event.Id}-${event.start}`}
                  className="absolute left-1 right-1 z-10 cursor-pointer"
                  style={{
                    top: `${Math.max(0, (event.start - 6) * rowHeight)}px`,
                    height: `${Math.max(45, (event.end - event.start) * rowHeight)}px`
                  }}
                  onClick={() => onEventClick?.(event)}
                >
                  <WeeklyTaskCard title={event.title || event.Title} location={event.location} colorClass={event.colorClass} />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;