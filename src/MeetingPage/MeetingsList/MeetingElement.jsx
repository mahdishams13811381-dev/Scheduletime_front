// import React from 'react';
// import { FiEdit2, FiTrash2, FiFileText } from "react-icons/fi";

// const MeetingElement = ({ title, description, date, time, status, onEdit, onDelete, onReport }) => {
  
//   // تعریف استایل‌ها بر اساس وضعیت‌های مختلف
//   const statusStyles = {
//     'جلسات حضوری داخل دانشگاه': 'bg-emerald-100 text-emerald-700',
//     'جلسات حضوری خارج دانشگاه': 'bg-red-100 text-red-700',
//     'جلسات آنلاین': 'bg-amber-100 text-amber-700',
//     'سایر جلسات': 'bg-blue-100 text-blue-700',
//     'تایید شده': 'bg-emerald-100 text-emerald-700',
//     'در انتظار': 'bg-amber-100 text-amber-700',
//   };

//   // دریافت استایل مربوطه یا بازگرداندن استایل پیش‌فرض خاکستری
//   const getStatusStyle = (status) => statusStyles[status] || 'bg-slate-100 text-slate-700';

//   return (
//     <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-all text-center text-sm">
//       {/* ساعت */}
//       <td className="p-4 font-mono text-slate-600 font-bold">{time || "--:--"}</td>
      
//       {/* تاریخ */}
//       <td className="p-4 text-slate-500">{date || "----/--/--"}</td>

//       {/* عنوان */}
//       <td className="p-4 font-bold text-slate-800 text-right">{title}</td>
      
//       {/* توضیحات */}
//       <td className="p-4 text-slate-500 text-right truncate max-w-[200px]">{description}</td>

//       {/* وضعیت */}
//       <td className="p-4">
//         <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(status)}`}>
//           {status || "نامشخص"}
//         </span>
//       </td>

//       {/* عملیات */}
//       <td className="p-4">
//         <div className="flex justify-center items-center gap-2">
//           <button onClick={onReport} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
//             <FiFileText size={16} /> 
//           </button>
          
//           <button onClick={onEdit} className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
//             <FiEdit2 size={16} />
//           </button>
          
//           <button onClick={onDelete} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
//             <FiTrash2 size={16} />
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// };

// export default MeetingElement;
import React, {useState} from 'react';
import { FiEdit2, FiTrash2, FiFileText } from "react-icons/fi";

const MeetingElement = ({ title, description, date, time, onEdit, onDelete, onReport }) => {
   
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-all text-center text-sm">
      {/* ساعت */}
      <td className="p-4 font-mono text-slate-600 font-bold">{time || "--:--"}</td>
      
      {/* تاریخ */}
      <td className="p-4 text-slate-500">{date || "----/--/--"}</td>

      {/* عنوان */}
      <td className="p-4 font-bold text-slate-800 text-right">{title}</td>
      
      {/* توضیحات */}
      <td className="p-4 text-slate-500 text-right truncate max-w-[200px]">{description}</td>

      {/* عملیات */}
      <td className="p-4">
        <div className="flex justify-center items-center gap-2">
          <button onClick={onReport} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <FiFileText size={16} /> 
          </button>
          
          <button onClick={onEdit} className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
            <FiEdit2 size={16} />
          </button>
          
          <button onClick={onDelete} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
    
  );
};

export default MeetingElement;