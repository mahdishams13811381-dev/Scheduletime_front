import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import AddTaskComponent from "../Home/Components/AddTaskComponent";
import TaskService from "../Services/TaskService";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("همه کارها");
  const [loading, setLoading] = useState(true);

  const getCurrentUserId = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

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

  const columnConfig = {
    Pending: {
      title: "انجام نشده",
      border: "border-slate-600",
      text: "text-slate-700",
      badge: "bg-slate-100 text-slate-700"
    },
    InProgress: {
      title: "در حال انجام",
      border: "border-indigo-600",
      text: "text-indigo-700",
      badge: "bg-indigo-100 text-indigo-700"
    },
    WaitingSupervisorApproval: {
      title: "در انتظار تایید",
      border: "border-yellow-600",
      text: "text-yellow-700",
      badge: "bg-yellow-100 text-yellow-700"
    },
    Completed: {
      title: "انجام شده",
      border: "border-green-600",
      text: "text-green-700",
      badge: "bg-green-100 text-green-700"
    }
  };

  const tabs = [
    "همه کارها",
    "انجام نشده",
    "در حال انجام",
    "در انتظار تایید",
    "انجام شده"
  ];

  const loadTasks = async () => {
    try {
      setLoading(true);

      const result = await TaskService.getMyTasks(CURRENT_USER_ID);

      setTasks(result || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const data = {
    Pending: tasks.filter((x) => x.status === "Pending"),
    InProgress: tasks.filter((x) => x.status === "InProgress"),
    WaitingSupervisorApproval: tasks.filter(
      (x) => x.status === "WaitingSupervisorApproval"
    ),
    Completed: tasks.filter((x) => x.status === "Completed")
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    const movedTask =
      data[source.droppableId][source.index];

    const updatedTasks = tasks.map((task) =>
      task.id === movedTask.id
        ? {
          ...task,
          status: destination.droppableId
        }
        : task
    );

    setTasks(updatedTasks);

    // اگر API آپدیت وضعیت داری اینجا صدا بزن
    // await TaskService.updateStatus(...)
  };

  const handleTaskCreated = () => {
    loadTasks();
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800">
          مدیریت کارها
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          + افزودن کار
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === tab
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-indigo-400"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">
          در حال بارگذاری...
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.keys(columnConfig)
              .filter(
                (statusKey) =>
                  activeTab === "همه کارها" ||
                  columnConfig[statusKey].title === activeTab
              )
              .map((statusKey) => (
                <Droppable
                  key={statusKey}
                  droppableId={statusKey}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col md:min-h-[500px]"
                    >
                      <div
                        className={`flex justify-between items-center mb-4 pb-2 border-b-2 ${columnConfig[statusKey].border}`}
                      >
                        <Link
                          to={`/tasksList?status=${encodeURIComponent(
                            columnConfig[statusKey].title
                          )}`}
                          className={`font-bold text-lg ${columnConfig[statusKey].text}`}
                        >
                          {columnConfig[statusKey].title}
                        </Link>

                        <span
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-black shadow-md ${columnConfig[statusKey].badge}`}
                        >
                          {data[statusKey]?.length || 0}
                        </span>
                      </div>
                      {data[statusKey]?.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-3 rounded-xl shadow mb-3 border"
                            >
                              <div className="font-bold text-slate-800">
                                {task.title}
                              </div>

                              <div className="text-sm text-slate-500">
                                {task.description}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
          </div>
        </DragDropContext>
      )}

      {isModalOpen && (
        <AddTaskComponent
          onClose={() => setIsModalOpen(false)}
          forcedAssignee="خودم"
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default TaskPage;