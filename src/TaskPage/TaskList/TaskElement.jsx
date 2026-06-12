import React from "react";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

const TaskElement = ({
  title,
  description,
  date,
  time,
  status,
  onEdit,
  onDelete,
  onView
}) => {
  const statusMap = {
    Pending: {
      label: "انجام نشده",
      className: "bg-slate-100 text-slate-700"
    },
    InProgress: {
      label: "در حال انجام",
      className: "bg-indigo-100 text-indigo-700"
    },
    WaitingSupervisorApproval: {
      label: "در انتظار تایید",
      className: "bg-yellow-100 text-yellow-700"
    },
    Completed: {
      label: "انجام شده",
      className: "bg-green-100 text-green-700"
    }
  };

  const currentStatus =
    statusMap[status] || {
      label: status,
      className: "bg-slate-100 text-slate-700"
    };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80 transition-all text-center text-sm">
      {/* ساعت */}
      <td className="p-4 font-mono text-slate-600 font-bold">
        {time || "--:--"}
      </td>

      {/* تاریخ */}
      <td className="p-4 text-slate-500">
        {date || "----/--/--"}
      </td>

      {/* عنوان */}
      <td className="p-4 font-bold text-slate-800 text-right">
        {title}
      </td>

      {/* توضیحات */}
      <td className="p-4 text-slate-500 text-right truncate max-w-[250px]">
        {description}
      </td>

      {/* وضعیت */}
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${currentStatus.className}`}
        >
          {currentStatus.label}
        </span>
      </td>

      {/* عملیات */}
      <td className="p-4">
        <div className="flex justify-center items-center gap-2">
          {onView && (
            <button
              onClick={onView}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <FiEye size={16} />
            </button>
          )}

          <button
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
          >
            <FiEdit2 size={16} />
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TaskElement;