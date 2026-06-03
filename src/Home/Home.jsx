import CalendarCard from "./Components/CalendarCard";
import MyTasksCard from './Components/MyTaskCard';
import MeetingsCard from './Components/MeetingsCard';
import RequestsCard from './Components/RequestsCard';

export function Home() {
  return (
    /* 🛠️ اصلاح کلیدی:
      h-auto در موبایل اجازه می‌دهد صفحه متناسب با کارت‌ها طول بگیرد.
      overflow-y-auto به خود کامپوننت اصلی اجازه اسکرول می‌دهد.
    */
    <main className="flex-1 p-4 pb-24 md:p-6 bg-[#f8fafc] h-auto md:h-full overflow-y-auto md:overflow-hidden flex flex-col min-h-0">

      {/* 🛠️ در موبایل grid-rows نداریم تا کارت‌ها قدِ طبیعی خود را داشته باشند.
        در دسکتاپ (md) تبدیل به دو ردیف مساوی می‌شود.
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-auto md:h-full max-w-full flex-1 min-h-0">

        {/* Left Side = 3/4 */}
        <div className="md:col-span-1">
          <CalendarCard />
        </div>

        {/* Right Side = 1/4 */}
        <div className="md:col-span-2 grid grid-rows-3 gap-6 h-full">

          <div className="gap-6 w-full h-auto md:h-full max-w-full flex-1 min-h-0">

            {/* Right Side = 1/4 */}
            <div className="flex gap-6 grid grid-cols-1 md:grid-cols-2">
              <MyTasksCard />
              <MeetingsCard />
            </div>

            {/* Left Side = 3/4 */}
            <div className="pt-8 w-full h-auto md:h-full max-w-full flex-1 min-h-0">
              <RequestsCard />
            </div>

          </div>
        </div>

      </div>

    </main>
  );
}