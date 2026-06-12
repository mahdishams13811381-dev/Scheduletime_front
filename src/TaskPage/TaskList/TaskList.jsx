import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TaskElement from "./TaskElement";
import AddTaskComponent from "../../Home/Components/AddTaskComponent";
import TaskService from "../../Services/TaskService";

const statusMap = {
  Pending: "انجام نشده",
  InProgress: "در حال انجام",
  WaitingSupervisorApproval: "در انتظار تایید",
  Completed: "انجام شده"
};

const reverseStatusMap = {
  "انجام نشده": "Pending",
  "در حال انجام": "InProgress",
  "در انتظار تایید": "WaitingSupervisorApproval",
  "انجام شده": "Completed"
};

const TaskList = () => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);

  const statusFilter = searchParams.get("status");

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

  const loadTasks = async () => {
console.log("dddddddddddddddddddddd")
    try {
      setLoading(true);

      const result = await TaskService.getMyTasks(
        getCurrentUserId()
      );
      setTasks(result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const groupedTasks = {
    Pending: [],
    InProgress: [],
    WaitingSupervisorApproval: [],
    Completed: []
  };

  tasks.forEach((task) => {
    if (groupedTasks[task.status]) {
      groupedTasks[task.status].push(task);
    }
  });

  const groupsToShow = statusFilter
    ? [reverseStatusMap[statusFilter]]
    : [
      "Pending",
      "InProgress",
      "WaitingSupervisorApproval",
      "Completed"
    ];

  return (
    <div
      className="p-6 bg-slate-50 min-h-screen"
      dir="rtl"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        لیست {statusFilter || "همه کارها"}
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th className="p-4">ساعت</th>
              <th className="p-4">تاریخ</th>
              <th className="p-4 text-right">عنوان کار</th>
              <th className="p-4 text-right">توضیحات</th>
              <th className="p-4">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            )}

            {!loading &&
              groupsToShow.map((statusKey) => {
                const statusTasks =
                  groupedTasks[statusKey] || [];

                if (statusTasks.length === 0) {
                  return (
                    <tr key={statusKey}>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-slate-500"
                      >
                        کاری یافت نشد
                      </td>
                    </tr>
                  );
                }

                return (
                  <React.Fragment key={statusKey}>
                    {!statusFilter && (
                      <tr className="bg-slate-50">
                        <td
                          colSpan="5"
                          className="p-3 font-bold"
                        >
                          {statusMap[statusKey]}
                        </td>
                      </tr>
                    )}

                    {statusTasks.map((task) => (
                      <TaskElement
                        key={task.id}
                        title={task.title}
                        description={
                          task.description
                        }
                        date={
                          task.dueDate
                            ? new Date(
                              task.dueDate
                            ).toLocaleDateString(
                              "fa-IR"
                            )
                            : "-"
                        }
                        time={
                          task.dueDate
                            ? new Date(
                              task.dueDate
                            ).toLocaleTimeString(
                              "fa-IR",
                              {
                                hour: "2-digit",
                                minute: "2-digit"
                              }
                            )
                            : "-"
                        }
                        onEdit={() => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}
                        onView={() =>
                          setSelectedTask(task)
                        }
                        onDelete={() =>
                          console.log(
                            "delete",
                            task.id
                          )
                        }
                      />
                    ))}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddTaskComponent
          taskData={editingTask}
          onClose={() => {
            setEditingTask(null);
            setIsModalOpen(false);
          }}
          onTaskCreated={() => {
            loadTasks();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TaskList;