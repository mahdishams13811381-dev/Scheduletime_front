import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import { Toaster } from 'react-hot-toast';
import './App.css';
import RequestsPage from "./RequestsPage/RequestsPage";
import { Home } from './Home/Home';
import Header from './Layout/Components/Header';
import SideBar from './Layout/Components/SideBar';
import ProfileModal from './Layout/Components/ProfileModal';
import RequestsList from "./RequestsPage/RequestsList/RequestsList";
import MeetingPage from "./MeetingPage/MeetingPage";
import MeetingsList from "./MeetingsList/MeetingsList";
import SecondSideBar from "./Second_SideBar/Second_SideBar";
import AddMeetingModal from './Home/Components/AddMeetingModal';
import AddRequestModal from './Home/Components/AddRequestModal';
import AddTaskComponent from './Home/Components/AddTaskComponent';
import MyTasks from './MyTasks/MyTask';
import TaskAssigned from './TaskAssigned/TaskAssigned';
import MyCalendar from './MyCalendarPage/MyCalendarPage';
import { UserProvider, useUser } from './Context/UserContext';
import { useRequest } from './Services/RequestContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <UserProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        {/* اکنون SidebarManager داخل BrowserRouter است و خطا رفع می‌شود */}
        <AppContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </BrowserRouter>
    </UserProvider>
  );
}

function AppContent({ isSidebarOpen, setIsSidebarOpen }) {
  const [activeModal, setActiveModal] = useState(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const {
    currentUser,
    isProfileModalOpen,
    closeProfileModal,
    updateCurrentUser
  } = useUser();
  const { createRequest } = useRequest();

  return (
    <div className="w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden" dir="rtl">
      <Header onMenuToggle={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 w-full overflow-hidden relative">
        {/* مدیریت سایدبار */}
        {isHome ? (
          <SideBar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            setActiveModal={setActiveModal} 
          />
        ) : (
          <div className="hidden md:block h-full"><SecondSideBar /></div>
        )}
        
        {/* محتوای اصلی */}
        <div className="flex-1 h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/requestsList" element={<RequestsList />} />
            <Route path="/meetings" element={<MeetingPage/>} />
            <Route path="/meetingsList" element={<MeetingsList />} />
            <Route path="/mytasks" element={<MyTasks />} />
            <Route path="/taskassigned" element={<TaskAssigned />} />
            <Route path="/mycalendar" element={<MyCalendar />} />
            
            
          
          </Routes>
        </div>
      </div>

      {/* مودال‌ها مستقیماً اینجا رندر می‌شوند و بالاتر از سایدبار قرار می‌گیرند */}
      {activeModal === 'meeting' && <AddMeetingModal isOpen={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'request' && (
        <AddRequestModal onClose={() => setActiveModal(null)} onAdd={async (form) => {
          try {
            const payload = {
              title: form.title,
              content: form.description,
              status: 1,
              senderUserId: 1,
              currentOwnerUserId: (form.people && form.people[0] && form.people[0].id) || 1,
              tagIds: []
            };
            await createRequest(payload);
            setActiveModal(null);
            window.alert('درخواست با موفقیت ساخته شد.');
          } catch (e) {
            console.error(e);
            window.alert('خطا در ایجاد درخواست');
          }
        }} />
      )}
      {activeModal === 'task' && <AddTaskComponent onClose={() => setActiveModal(null)} />}

      <ProfileModal
        user={currentUser}
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        onSave={updateCurrentUser}
        canEdit={true}
      />
    </div>
  );
}
export default App