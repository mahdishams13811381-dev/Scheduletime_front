import React from 'react';
import MonthlyViewItem from './MonthlyViewItem';

const MonthlyView = ({ events = [], selectedDate, onEventClick }) => {
  const daysOfWeek = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
  const current = selectedDate ? new Date(selectedDate) : new Date();
  const year = current.getFullYear();
  const month = current.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 1) % 7;

  const dayCells = [];
  for (let i = 0; i < offset; i++) {
    dayCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    dayCells.push(new Date(year, month, day));
  }

  const eventsByDay = events.reduce((map, event) => {
    const eventDate = new Date(event.eventDate || event.EventDate);
    const day = eventDate.getDate();
    const key = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${day}`;
    if (!map[key]) map[key] = [];
    map[key].push({ ...event, colorClass: event.color || event.Color || 'bg-slate-100' });
    return map;
  }, {});

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-sm font-bold text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayCells.map((date, index) => {
          if (date === null) {
            return <div key={`empty-${index}`} className="h-32 border border-slate-100 rounded-xl bg-slate-50/20"></div>;
          }

          const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const dayEvents = eventsByDay[key] || [];
          const shortDate = date.toLocaleDateString('fa-IR-u-ca-persian', { day: '2-digit' });

          return (
            <div
              key={key}
              className="h-32 border border-slate-100 rounded-xl p-2 bg-slate-50/30 flex flex-col gap-2 transition-all hover:bg-slate-50 cursor-pointer"
              onClick={() => onEventClick?.(date)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-400">{shortDate}</span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full">
                    {dayEvents.length} مورد
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 overflow-hidden">
                {dayEvents.slice(0, 2).map((event) => (
                  <MonthlyViewItem key={`${event.type || event.Type}-${event.id || event.Id}`} meeting={event} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyView;