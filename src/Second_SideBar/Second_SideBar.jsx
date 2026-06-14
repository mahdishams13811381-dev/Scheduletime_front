import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns-jalali';
import { FaSignOutAlt, FaEnvelope, FaCommentDots, FaHeadset, FaCalendarAlt, FaUserFriends, FaFileAlt, FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";
import { FaUserTag } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { useUser } from '../Context/UserContext';
import { getProfileImageUrl } from '../Utils/userProfile';



const Second_SideBar = () => {
  const [currentMonth] = useState(new Date());
  const { currentUser } = useUser();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const [selectedFilter, setSelectedFilter] = useState('جلسات');

  return (
    <div className="flex h-full bg-white border-l border-gray-100 shadow-xl" style={{ width: '256px' }}>
      
      <div className="w-16 bg-gray-50 flex flex-col items-center py-6 justify-between border-l border-gray-100">
        <div className="flex flex-col items-center gap-6">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={getProfileImageUrl(currentUser)} alt="پرو" className="w-full h-full object-cover" />
          </div>
          

          <div className="flex flex-col items-center gap-y-3">
            
            <div className="flex flex-col gap-6 text-indigo-600">
                <Link to="/" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">
               <FaHome title='صفحه اصلی' size={20} />
            </Link>             
              <Link to="/mycalendar" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">
               <FaCalendarAlt title='تقویم شخصی' size={20} />
            </Link>
            <Link to="/meetings" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">

              <FaUserFriends title='جلسات' size={20} />
            </Link>
            <Link to="/requests" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">
            <FaFileAlt title='درخواست ها' size={20} />
            </Link>
            <Link to="/mytasks" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">
            <FaUserTie title='کارهای من' size={20} />
            </Link>
            <Link to="/taskassigned" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">
            <FaUserTag title='کارهای محوله' size={20} />
            </Link>
            </div>
          </div>
        </div>

        <button  title="خروج از حساب" className="text-rose-500">
          <FaSignOutAlt size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-y-auto border-r border-gray-100">
        <div className="text-center text-sm font-bold text-slate-800 mb-4">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-gray-400 mb-2">
           {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => <span key={d}>{d}</span>)}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
           {days.map((day, i) => (
             <div key={i} className="w-7 h-7 flex items-center justify-center text-xs rounded-full hover:bg-indigo-50 cursor-pointer text-slate-600">
               {format(day, 'd')}
             </div>
           ))}
        </div>
        
        <div className="border-t border-gray-100 my-6"></div>
        
        {/* <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 mb-4">فیلتر نمایش</h3>
            <Link to="/meetings" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">

          <FilterItem 
            label="جلسات" 
            active={selectedFilter === 'جلسات'} 
            onClick={() => setSelectedFilter('جلسات')} 
          />
          </Link>
          <Link to="/requests" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">

          <FilterItem 
            label="درخواست‌ها" 
            active={selectedFilter === 'درخواست‌ها'} 
            onClick={() => setSelectedFilter('درخواست‌ها')} 
          />
          </Link>
         <Link to="/mytasks" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">

          <FilterItem 
            label="کارهای من" 
            active={selectedFilter === 'کارهای من'} 
            onClick={() => setSelectedFilter('کارهای من')} 
          />
          </Link>
          <Link to="/taskassigned" className="text-[10px] text-indigo-700 font-bold whitespace-nowrap text-center mt-2">

          <FilterItem 
            label="کارهای محوله" 
            active={selectedFilter === 'کارهای محوله'} 
            onClick={() => setSelectedFilter('کارهای محوله')} 
          />
          </Link>
        </div> */}
      </div>
      
    </div>
  );
};

const FilterItem = ({ label, active, onClick }) => (
  <div className="flex items-center gap-3 cursor-pointer group" onClick={onClick}>
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-indigo-600' : 'border-gray-300'}`}>
      {active && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
    </div>
    <span className={`text-sm ${active ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}>
      {label}
    </span>
  </div>
);

export default Second_SideBar;