import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import AddTaskComponent from "./AddTaskComponent";
import EditTaskModal from "./EditTaskModal";
import TaskService from "../../Services/TaskService";
import { useTask } from "../../Services/TaskContext";

const MyTasksCard = () => {
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

  const CURRENT_USER_ID = getCurrentUserId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);


  const mapStatusToPersian = (status) => {
    const mapping = {
      "Pending": "انجام نشده",
      "InProgress": "در حال انجام",
      "Completed": "انجام شده",
      "WaitingSupervisorApproval": "درانتظار تایید"
    };
    return mapping[status] || status;
  };

  const { myTasks, loading } = useTask();
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (updatedTask) => {
    setEditingTask(null);
  };


  const formattedTasks = myTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: mapStatusToPersian(task.status),
    dueDate: task.dueDate,
    reminderDate: task.reminderDate,
    assignedByUser: task.assignedByUser,
    supervisorUser: task.supervisorUser,
    createdAt: task.createdAt,
    supervisorApproved: task.supervisorApproved,
    tags: task.tags
  }));

  return (
    <div className="bg-white w-full max-w-full p-6 rounded-3xl border border-slate-100 shadow-xl flex flex-col  h-[350px] md:h-[300px] overflow-hidden ring-2 ring-blue-500/50 shadow-[0_0_25px_rgba(15,23,42,0.22)] duration-300 hover:shadow-[0_0_35px_rgba(15,23,42,0.35)]" dir="rtl">

      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-base font-bold text-slate-800">کارهای من</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-400 hover:text-indigo-600 text-2xl transition-colors"
          >
            ＋
          </button>
          <button className="text-gray-400 hover:text-slate-700 font-bold">
            ···
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading  ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-slate-500 text-sm">در حال بارگذاری...</p>
          </div>
        ) : formattedTasks.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-slate-400 text-sm">کاری موجود نیست</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {formattedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddTaskComponent
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default MyTasksCard;