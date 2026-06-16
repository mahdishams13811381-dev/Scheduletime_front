import CalendarCard from "./Components/CalendarCard";
import MyTasksCard from './Components/MyTaskCard';
import MeetingsCard from './Components/MeetingsCard';
import RequestsCard from './Components/RequestsCard';


export function Home() {
  return (
    <main className="flex-1 p-4 md:pb-24 md:p-6 bg-[#f8fafc] h-auto md:h-full overflow-y-auto md:overflow-hidden flex flex-col min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-auto md:h-full max-w-full flex-1 min-h-0">
        <div className="md:col-span-1">
          <CalendarCard />
        </div>
        <div className="md:col-span-2 grid md:grid-rows-3 gap-6 h-full">

          <div className="gap-6 w-full h-auto md:h-full max-w-full flex-1 min-h-0">
            <div className="flex gap-6 grid grid-cols-1 md:grid-cols-2">
              <MyTasksCard />
              <MeetingsCard />
            </div>
            <div className="pt-8 w-full h-auto md:h-full max-w-full flex-1 min-h-0">
              <RequestsCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}