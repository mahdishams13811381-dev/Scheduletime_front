import React, { useState } from "react";
import "react-day-picker/dist/style.css";
import { DayPicker, faIR } from "@daypicker/persian";

const CalendarCard = () => {
  const [selected, setSelected] = useState(new Date());

  const formatCaption = (date) => {
    return new Intl.DateTimeFormat("fa-IR", { month: "long", year: "numeric" }).format(date);
  };

  return (
    /* 🛠️ اضافه شدن min-h-0 جهت هماهنگی با انقباض گرید دسکتاپ */
    <div className="bg-white w-full max-w-full p-4 sm:p-5 rounded-3xl border border-slate-900/10 shadow-[0_0_25px_rgba(15,23,42,0.22)] flex flex-col h-[630px] max-h-[520px] md:max-h-none min-h-0 transition-all duration-300 hover:shadow-[0_0_35px_rgba(15,23,42,0.35)] ring-2 ring-blue-500/50 overflow-hidden select-none">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 flex-shrink-0 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-800 min-w-0 truncate">تقویم</h3>
        <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">امروز</span>
      </div>

      <div className="flex justify-center items-start pt-10 h-full bg-slate-50 rounded-2xl p-2 min-h-0">
        <div className="w-full flex justify-center">
          <DayPicker
            className="calendar-large"
            mode="single"
            selected={selected}
            onSelect={setSelected}
            locale={faIR}
            showOutsideDays
            fixedWeeks
            formatters={{
              formatCaption: formatCaption,
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default CalendarCard;