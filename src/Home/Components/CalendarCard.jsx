import React, { useState, useEffect } from "react";
import "react-day-picker/dist/style.css";
import { DayPicker, faIR } from "@daypicker/persian";
import TaskService from "./../../Services/TaskService"
import MeetingService from "./../../Services/MeetingService"

const CalendarCard = () => {
  const [selected, setSelected] = useState(new Date());

  const formatCaption = (date) => {
    return new Intl.DateTimeFormat("fa-IR", { month: "long", year: "numeric" }).format(date);
  };
  const [taskDates, setTaskDates] = useState([]);
  const [meetingDates, setMeetingDates] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const getCurrentUserId = () => {
          const token = localStorage.getItem("accessToken");

          if (!token) return null;

          try {
            const payload = JSON.parse(
              atob(token.split(".")[1])
            );

            return Number(
              payload[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
              ]
            );
          } catch {
            return null;
          }
        };

        const tasks = await TaskService.getMyTasks(getCurrentUserId());
        const meetings = await MeetingService.getMyMeetings(getCurrentUserId());
        console.log("API RESULT:", meetings);

        setTaskDates(
          tasks.map(t => new Date(t.deadline))
        );

        const dates = meetings.map(m => new Date(m.meetingDate));
        console.log("DATES:", dates);

        setMeetingDates(dates);
        console.log("SET STATE CALLED");

      } catch (err) {
        console.error(err);
      }
    };


    loadData();
  }, []);

  const iranHolidays = [
  ];

  return (
    /* 🛠️ اضافه شدن min-h-0 جهت هماهنگی با انقباض گرید دسکتاپ */
    <div class="bg-white w-full max-w-full p-4 rounded-3xl border border-slate-900/10 
            shadow-[0_0_25px_rgba(15,23,42,0.22)] flex flex-col h-[400px] min-h-0 
            transition-all duration-300 hover:shadow-[0_0_35px_rgba(15,23,42,0.35)] 
            ring-2 ring-blue-500/50 overflow-hidden select-none 
            sm:p-5 sm:h-[500px] sm:max-h-[400px] 
            md:h-[630px] md:max-h-none 
            lg:max-w-2xl lg:mx-auto 
            xl:max-w-3xl">
      <div className="flex flex-row justify-between items-start sm:items-center mb-4 gap-3 flex-shrink-0 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-slate-800 min-w-0 truncate">تقویم</h3>
        <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">امروز</span>
      </div>

      <div className="flex justify-center items-start md:pt-10 h-full bg-slate-50 rounded-2xl md:p-2 min-h-0">
        <div className="w-full flex justify-center">
          <DayPicker
            className="calendar-large"
            mode="single"
            selected={selected}
            onSelect={setSelected}
            locale={faIR}
            showOutsideDays
            fixedWeeks
            modifiers={{
              task: taskDates,
              meeting: (date) =>
                meetingDates.some(
                  d => d.toDateString() === date.toDateString()
                ),
              holiday: (date) =>
                date.getDay() === 5 ||
                iranHolidays.some(
                  h => h.toDateString() === date.toDateString()
                ),
            }}
            modifiersClassNames={{
              task: "task-day",
              meeting: "meeting-day",
              holiday: "holiday-day",
            }}
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