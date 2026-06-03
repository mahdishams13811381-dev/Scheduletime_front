import React from 'react';

const persianMonthNames = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

const YearlyView = ({ events = [], selectedDate, onMonthSelect }) => {
  const current = selectedDate ? new Date(selectedDate) : new Date();
  const year = current.getFullYear();

  const eventsByMonth = events.reduce((result, event) => {
    const eventDate = new Date(event.eventDate || event.EventDate);
    const key = `${eventDate.getFullYear()}-${eventDate.getMonth()}`;
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});

  const monthCards = Array.from({ length: 12 }, (_, monthIndex) => {
    const key = `${year}-${monthIndex}`;
    const count = eventsByMonth[key] || 0;
    return {
      monthIndex,
      label: persianMonthNames[monthIndex],
      count
    };
  });

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-[0_0_35px_rgba(15,23,42,0.35)] ring-2 ring-blue-500/50">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">نمای سالانه</h2>
          <p className="text-sm text-slate-500">رویدادهای {year} را بر اساس ماه ببینید.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {monthCards.map((month) => (
          <button
            key={month.monthIndex}
            onClick={() => onMonthSelect?.(new Date(year, month.monthIndex, 1))}
            className="text-left p-4 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-bold text-slate-800">{month.label}</span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{month.count} رویداد</span>
            </div>
            <div className="text-sm text-slate-500">برای دیدن جزئیات روی این ماه کلیک کنید.</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearlyView;
