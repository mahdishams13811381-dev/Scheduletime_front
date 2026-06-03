import React , {useState}from 'react';
import { FiEdit2, FiTrash2, FiFileText } from "react-icons/fi";

const RequestElement = ({ title, description, date, time, status, onEdit, onView }) => {
  
  const getStatusStyle = (status) => {
    // Accept both Persian status strings and backend enum strings like 'PendingApproval'
    switch ((status || '').toString()) {
      case 'تایید شده':
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'تایید نشده':
      case 'Rejected':
        return 'bg-rose-100 text-rose-700';
      case 'در انتظار':
      case 'PendingApproval':
        return 'bg-amber-100 text-amber-700';
      case 'ارجاعات':
        return 'bg-sky-100 text-sky-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

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

      {/* وضعیت */}
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(status)}`}>
          {status}
        </span>
      </td>

      {/* عملیات */}
      <td className="p-4">
        <div className="flex justify-center items-center gap-2">
          {/* دکمه گزارش */}
          <button 
            onClick={onView} 
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <FiFileText size={16} /> 
          </button>
          
          {/* دکمه ویرایش */}
          <button 
            onClick={onEdit} 
            className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
          >
            <FiEdit2 size={16} />
          </button>
          
          {/* دکمه حذف */}
          <button 
            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RequestElement;