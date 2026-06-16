import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
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
import LoginPage from "./Login/Login";
import MeetingsList from "./MeetingPage/MeetingsList/MeetingsList";
import SecondSideBar from "./Second_SideBar/Second_SideBar";
import AddMeetingModal from './Home/Components/AddMeetingModal';
import AddRequestModal from './Home/Components/AddRequestModal';
import AddTaskComponent from './Home/Components/AddTaskComponent';
import TaskAssigned from './TaskAssigned/TaskAssigned';
import TaskAssignedList from './TaskAssigned/TaskAssignedList/TaskAssignedList';
import MyCalendar from './MyCalendarPage/MyCalendarPage';
import { UserProvider, useUser } from './Context/UserContext';
import { useRequest } from './Services/RequestContext';
import { MeetingProvider } from './Services/MeetingContext';
import { CalendarProvider } from './Services/CalendarContext';
import TaskPage from './TaskPage/TaskPage';
import TaskList from './TaskPage/TaskList/TaskList';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <UserProvider>
      <MeetingProvider>
        <CalendarProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <BrowserRouter>
            {/* اکنون SidebarManager داخل BrowserRouter است و خطا رفع می‌شود */}
            <AppContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          </BrowserRouter>
        </CalendarProvider>
      </MeetingProvider>
    </UserProvider>
  );
}

function AppContent({ isSidebarOpen, setIsSidebarOpen }) {
   const token = localStorage.getItem("accessToken");
  const [activeModal, setActiveModal] = useState(null);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  const {
    currentUser,
    isProfileModalOpen,
    closeProfileModal,
    updateCurrentUser
  } = useUser();

  const { createRequest } = useRequest();

  return (
    <div className="w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden" dir="rtl">

      {/* هدر فقط در صفحات غیر لاگین */}
      {!isLoginPage && (
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
      )}

      <div className="flex flex-1 w-full overflow-hidden relative">

        {/* سایدبار فقط در صفحات غیر لاگین */}
        {!isLoginPage && (
          <>
            {isHome ? (
              <SideBar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                setActiveModal={setActiveModal}
              />
            ) : (
              <div className="hidden md:block h-full">
                <SecondSideBar />
              </div>
            )}
          </>
        )}

        <div className="flex-1 h-full overflow-y-auto">
          <Routes>

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/"
              element={
                token
                  ? <Home />
                  : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/requests"
              element={
                token
                  ? <RequestsPage />
                  : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/requestsList"
              element={
                token
                  ? <RequestsList />
                  : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/meetings"
              element={
                token
                  ? <MeetingPage />
                  : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/meetingsList"
              element={
                token
                  ? <MeetingsList />
                  : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/mytasks"
              element={
                token
                  ? <TaskPage />
                  : <Navigate to="/login" replace />
              }
            />
              <Route
              path="/tasksList"
              element={
                token
                  ? <TaskList />
                  : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/taskassigned"
              element={
                token
                  ? <TaskAssigned />
                  : <Navigate to="/login" replace />
              }
            /> 
              <Route
              path="/TaskAssignedList"
              element={
                token
                  ? <TaskAssignedList />
                  : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/mycalendar"
              element={
                token
                  ? <MyCalendar />
                  : <Navigate to="/login" replace />
              }
            />

          </Routes>
        </div>
      </div>

      {/* مودال‌ها فقط در صفحات غیر لاگین */}
      {!isLoginPage && (
        <>
          {activeModal === 'meeting' && (
            <AddMeetingModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
            />
          )}

          {activeModal === 'request' && (
            <AddRequestModal
              onClose={() => setActiveModal(null)}
              onAdd={async (form) => {
                try {
                  const payload = {
                    title: form.title,
                    content: form.description,
                    status: 1,
                    senderUserId: 1,
                    currentOwnerUserId:
                      (form.people && form.people[0] && form.people[0].id) || 1,
                    tagIds: []
                  };

                  await createRequest(payload);
                  setActiveModal(null);
                  window.alert('درخواست با موفقیت ساخته شد.');
                } catch (e) {
                  console.error(e);
                  window.alert('خطا در ایجاد درخواست');
                }
              }}
            />
          )}

          {activeModal === 'task' && (
            <AddTaskComponent onClose={() => setActiveModal(null)} />
          )}

          <ProfileModal
            user={currentUser}
            isOpen={isProfileModalOpen}
            onClose={closeProfileModal}
            onSave={updateCurrentUser}
            canEdit={true}
          />
        </>
      )}
    </div>
  );
}
export default App