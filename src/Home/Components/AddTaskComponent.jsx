import React, { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import TaskService from "../../Services/TaskService";
import { userService } from "../../Services/UserService";
import { useTask  } from "../../Services/TaskContext";

const AddTaskComponent = ({ onClose, forcedAssignee, onTaskCreated }) => {
  const [status, setStatus] = useState("در حال انجام");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("متوسط");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [assigneeType, setAssigneeType] = useState(forcedAssignee || "خودم");
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const { createTask } = useTask();

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
  const [allUsers, setAllUsers] = useState([]);
  const statusOptions = ["انجام نشده", "در حال انجام", "انجام شده"];
  const priorityOptions = ["کم", "متوسط", "زیاد"];

  const filteredUsers = allUsers.filter(
    u =>
      (`${u.firstName} ${u.lastName}`)
        .includes(searchQuery) &&
      !selectedParticipants.some(
        p => p.id === u.id
      )
  );

  useEffect(() => {
    userService.getAllUsers()
      .then(result => {
        setAllUsers(result.items || []);
      })
      .catch(err => {
        console.error(err);
        toast.error("خطا در دریافت کاربران");
      });
  }, []);

  const mapStatusToPersian = (status) => {
    const mapping = {
      "Pending": "انجام نشده",
      "InProgress": "در حال انجام",
      "Completed": "انجام شده",
      "WaitingSupervisorApproval": "درانتظار تایید"
    };
    return mapping[status] || status;
  };

  const mapPersianStatusToEnum = (persianStatus) => {
    const mapping = {
      "انجام نشده": 1,
      "در حال انجام": 2,
      "انجام شده": 3
    };
    return mapping[persianStatus] || "Pending";
  };

  const handleSave = async () => {
    if (!title || !title.trim()) {
      toast.error("لطفاً عنوان تسک را وارد کنید.");
      return;
    }

    setIsLoading(true);

    try {
      // Determine supervisor user ID based on assignee type
      let supervisorUserId = CURRENT_USER_ID;
      if (assigneeType === "دیگران" && selectedParticipants.length > 0) {
        supervisorUserId = selectedParticipants[0].id;
      }

      const taskModel = {
        title: title.trim(),
        description: title.trim(),
        status: mapPersianStatusToEnum(status),
        dueDate: null,
        reminderDate: null,
        supervisorApproved: false,
        assignedByUserId: CURRENT_USER_ID,
        supervisorUserId: supervisorUserId,
        tagIds: []
      };


      const createdTask = await createTask(taskModel);
      toast.success(`تسک "${title}" با موفقیت ایجاد شد!`);

      // Call the callback to refresh the task list
      if (onTaskCreated) {
        onTaskCreated(createdTask);
      }

      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(`خطا در ایجاد تسک: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="bg-white w-full max-w-[650px] rounded-3xl p-6 shadow-2xl relative z-10 border border-slate-100 overflow-visible" dir="rtl">
        <button onClick={onClose} className="text-slate-400 hover:text-rose-500 mb-4 cursor-pointer p-1 rounded-full border-2 border-slate-300 hover:border-rose-300 w-7 h-7 flex items-center justify-center">
          <svg className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-lg font-bold text-slate-800 mb-4"> ایجاد کار جدید</h2>

        <form className="flex flex-col gap-5">
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-sm font-bold text-slate-800">عنوان:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              placeholder="عنوان تسک..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700">وضعیت:</label>
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`px-4 py-2 text-xs rounded-xl border transition-all ${status === option
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700 font-bold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700">اولویت:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700">مسئول:</label>
            <select
              value={assigneeType}
              onChange={(e) => setAssigneeType(e.target.value)}
              className={`w-full px-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all`}
            >
              <option value="خودم">خودم</option>
              <option value="دیگران">دیگران</option>
            </select>
          </div>

          {assigneeType === "دیگران" && (
            <div
              className="grid grid-cols-[80px_1fr] items-start gap-2 relative"
              ref={searchRef}
            >
              <label className="text-sm font-bold mt-2 text-slate-800">
                اعضا:
              </label>

              <div className="flex flex-col gap-2">

                {/* اعضای انتخاب شده */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(prev => !prev)}
                    className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-lg font-bold"
                  >
                    +
                  </button>

                  {selectedParticipants.map(user => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedParticipants(
                          selectedParticipants.filter(s => s.id !== user.id)
                        );
                      }}
                      className="flex items-center gap-2 bg-white border rounded-full px-2 py-1 cursor-pointer hover:border-red-300"
                    >
                      <img
                        src={user.profileImageUrl || "/default-avatar.png"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt=""
                      />

                      <div>
                        <div className="font-bold text-sm">
                          {user.firstName} {user.lastName}
                        </div>

                        <div className="text-xs text-slate-500">
                          {user.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* لیست کاربران */}
                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border shadow-xl rounded-2xl z-50 overflow-visible">

                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="جستجوی اعضا..."
                      className="w-full p-3 border-b outline-none text-sm"
                    />

                    <div className="max-h-64 overflow-y-auto">

                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => {
                            setSelectedParticipants([
                              ...selectedParticipants,
                              user
                            ]);
                            setSearchQuery("");
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                        >
                          <img
                            src={user.profileImageUrl || "/default-avatar.png"}
                            className="w-7 h-7 rounded-full object-cover"
                            alt=""
                          />

                          <span className="text-xs font-bold">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-red-500 text-xs">✕</span>
                        </div>
                      ))}

                      {filteredUsers.length === 0 && (
                        <div className="p-4 text-center text-xs text-slate-400">
                          کاربری یافت نشد
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskComponent;
