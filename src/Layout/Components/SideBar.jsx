import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaFileAlt, FaRegFileAlt, FaPlus, FaEdit, FaSignOutAlt, FaTimes, FaHome } from "react-icons/fa";

import AddMeetingModal from "../../Home/Components/AddMeetingModal";
import AddRequestModal from "../../Home/Components/AddRequestModal";
import AddTaskComponent from "../../Home/Components/AddTaskComponent";
import { useUser } from '../../Context/UserContext';
import { getProfileImageUrl, getUserFullName, getUserPosition } from '../../Utils/userProfile';

const SideBar = ({ isOpen, onClose }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [taskModalConfig, setTaskModalConfig] = useState({ isOpen: false, forcedAssignee: null });
  const {
    currentUser,
    isLoadingUser,
    openProfileModal
  } = useUser();

  const handleOpenModal = (e, modalType) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveModal(modalType);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-gray-100 border-l border-gray-200 
        z-[9999] transition-transform duration-300 shadow-2xl
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex justify-end md:hidden mb-4">
              <button onClick={onClose} className="p-2 text-slate-500"><FaTimes size={20} /></button>
            </div>

            <div className="flex flex-col items-center border-b border-gray-200 pb-5 mb-4">
              <img src={getProfileImageUrl(currentUser)} alt="پروفایل" className="w-24 h-24 rounded-full border-2 border-indigo-600 p-0.5 mb-2" />
              <h2 className="font-bold text-slate-800">{isLoadingUser ? 'در حال بارگذاری...' : getUserFullName(currentUser)}</h2>
              <p className="text-xs text-slate-500 mt-1">{isLoadingUser ? '...' : getUserPosition(currentUser)}</p>
            </div>

            <ul className="space-y-1">
              <li>
                <Link to="/" onClick={onClose} className="flex items-center gap-3 p-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
                  <FaHome /> صفحه اصلی
                </Link>
              </li>
              <li>
                <Link to="/mycalendar" onClick={onClose} className="flex items-center gap-3 p-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
                  <FaCalendarAlt /> تقویم
                </Link>
              </li>

              <li className="flex justify-between items-center px-3 py-1 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition-colors">
                <Link to="/meetings" onClick={onClose} className="flex-1 flex items-center gap-3 py-2 text-slate-700">
                  <FaUsers /> جلسات
                </Link>
                <button onClick={(e) => handleOpenModal(e, 'meeting')} className="p-1 hover:text-indigo-600">
                  <FaPlus />
                </button>
              </li>

              <li className="flex justify-between items-center px-3 py-1 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition-colors">
                <Link to="/requests" onClick={onClose} className="flex-1 flex items-center gap-3 py-2 text-slate-700">
                  <FaFileAlt /> درخواست‌ها
                </Link>
                <button onClick={(e) => handleOpenModal(e, 'request')} className="p-1 hover:text-indigo-600">
                  <FaPlus />
                </button>
              </li>

              <li className="flex justify-between items-center px-3 py-1 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition-colors">
                <Link to="/mytasks" onClick={onClose} className="flex-1 flex items-center gap-3 py-2 text-slate-700">
                  <FaRegFileAlt /> کارهای من
                </Link>
                <button onClick={() => setTaskModalConfig({ isOpen: true, forcedAssignee: 'خودم' })} className="p-1 hover:text-indigo-600">
                  <FaPlus />
                </button>
              </li>

              <li className="flex justify-between items-center px-3 py-1 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition-colors">
                <Link to="/taskassigned" onClick={onClose} className="flex-1 flex items-center gap-3 py-2 text-slate-700">
                  <FaRegFileAlt /> کارهای محوله
                </Link>
                <button onClick={() => setTaskModalConfig({ isOpen: true, forcedAssignee: 'دیگران' })} className="p-1 hover:text-indigo-600">
                  <FaPlus />
                </button>
              </li>
            </ul>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <button onClick={openProfileModal} className="w-full p-2 mb-2 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
              <FaEdit /> ویرایش پروفایل
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                window.location.href = "/login";
              }}
              className="w-full p-2 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
            >
              <FaSignOutAlt />
              خروج
            </button>
          </div>
        </div>
      </aside>

      {activeModal === 'meeting' && <AddMeetingModal isOpen={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'request' && <AddRequestModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'task' && <AddTaskComponent onClose={() => setActiveModal(null)} />}
      {taskModalConfig.isOpen && (
        <AddTaskComponent
          onClose={() => setTaskModalConfig({ isOpen: false, forcedAssignee: null })}
          forcedAssignee={taskModalConfig.forcedAssignee}
        />
      )}
    </>

  );
};

export default SideBar;