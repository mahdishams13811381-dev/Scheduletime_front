import React from "react";
import { FiX } from "react-icons/fi";

const TaskDetailModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const statusLabels = {
    Pending: "انجام نشده",
    InProgress: "در حال انجام",
    WaitingSupervisorApproval: "در انتظار تایید",
    Completed: "انجام شده"
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative z-10"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-600"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          جزئیات کار
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">
              عنوان
            </span>

            <span className="font-bold text-slate-700">
              {task.title || "---"}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">
              وضعیت
            </span>

            <span className="font-bold text-slate-700">
              {statusLabels[task.status] || task.status}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">
              تاریخ سررسید
            </span>

            <span className="font-bold text-slate-700">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("fa-IR")
                : "---"}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block mb-1">
              ساعت سررسید
            </span>

            <span className="font-bold text-slate-700">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit"
                })
                : "---"}
            </span>
          </div>

          {task.priority && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">
                اولویت
              </span>

              <span className="font-bold text-slate-700">
                {task.priority}
              </span>
            </div>
          )}

          {task.assigneeName && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">
                مسئول انجام
              </span>

              <span className="font-bold text-slate-700">
                {task.assigneeName}
              </span>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-xs text-slate-500 mb-2">
            توضیحات
          </p>

          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {task.description || "توضیحی ثبت نشده است"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;