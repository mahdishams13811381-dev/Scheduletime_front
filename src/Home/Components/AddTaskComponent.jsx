import React, { useState , useRef, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import TaskService from "../../Services/TaskService";

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
  
  const CURRENT_USER_ID = 1; // Hardcoded as per requirements
  
  const allUsers = [
    { id: 101, name: "دکتر احمدی", role: "استاد راهنما", avatar: "https://i.pravatar.cc/150?u=101" },
    { id: 102, name: "مهندس رضایی", role: "مدیر آموزش", avatar: "https://i.pravatar.cc/150?u=102" },
    { id: 103, name: "سارا موسوی", role: "دانشجو", avatar: "https://i.pravatar.cc/150?u=103" },
    { id: 104, name: "علی کریمی", role: "پژوهشگر", avatar: "https://i.pravatar.cc/150?u=104" },
    { id: 105, name: "دکتر حسینی", role: "رئیس دانشکده", avatar: "https://i.pravatar.cc/150?u=105" },
  ];
  
  const statusOptions = ["انجام نشده", "در حال انجام", "انجام شده"];
  const priorityOptions = ["کم", "متوسط", "زیاد"];

  const filteredUsers = allUsers.filter(u => 
    u.name.includes(searchQuery) && !selectedParticipants.find(s => s.id === u.id)
  );

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
      "انجام نشده": "Pending",
      "در حال انجام": "InProgress",
      "انجام شده": "Completed"
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
        description: title.trim(), // Use title as description if not provided
        status: mapPersianStatusToEnum(status),
        dueDate: null,
        reminderDate: null,
        supervisorApproved: false,
        assignedByUserId: CURRENT_USER_ID,
        supervisorUserId: supervisorUserId,
        tagIds: []
      };

      const createdTask = await TaskService.createTask(taskModel);
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
      
      <div className="bg-white w-full max-w-[650px] rounded-3xl p-6 shadow-2xl relative z-10 border border-slate-100 overflow-hidden" dir="rtl">
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
                  className={`px-4 py-2 text-xs rounded-xl border transition-all ${
                    status === option 
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
      disabled={!!forcedAssignee} // غیرقابل تغییر در صورت وجود مقدار اجباری
      className={`w-full px-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all ${forcedAssignee ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      <option value="خودم">خودم</option>
      <option value="دیگران">دیگران</option>
    </select>
  </div>

{assigneeType === "دیگران" && (
  <div className="grid grid-cols-[80px_1fr] items-start gap-2 relative" ref={searchRef}>
    <label className="text-sm font-bold mt-2 text-slate-800">اعضا:</label>
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button 
          type="button" 
          onClick={() => setIsSearchOpen(!isSearchOpen)} 
          className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold flex items-center justify-center hover:bg-indigo-100"
        >
          +
        </button>
        {selectedParticipants.map(user => (
          <div key={user.id} onClick={() => setSelectedParticipants(selectedParticipants.filter(s => s.id !== user.id))} className="flex items-center gap-2 pr-1 pl-3 py-1 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-rose-300">
            <img src={user.avatar} className="w-7 h-7 rounded-full object-cover" />
            <span className="text-xs font-bold text-slate-700">{user.name}</span>
          </div>
        ))}
      </div>
      
      {isSearchOpen && (
        <div className="absolute top-full right-0 w-80 mt-1 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden">
          <input 
            autoFocus 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="جستجوی نام افراد..." 
            className="w-full p-3 text-xs border-b border-slate-50 outline-none" 
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} onClick={() => { setSelectedParticipants([...selectedParticipants, user]); setIsSearchOpen(false); setSearchQuery(""); }} className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3">
                  <img src={user.avatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-bold text-sm text-slate-800">{user.name}</div>
                    <div className="text-[10px] text-indigo-600">{user.role}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-xs text-slate-400 text-center">موردی یافت نشد</div>
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
