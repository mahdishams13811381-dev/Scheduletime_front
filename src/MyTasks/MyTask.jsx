import React, { useState, useEffect } from 'react';
import MytaskRow from './MytasRow';
import AddTaskComponent from '../Home/Components/AddTaskComponent';
import TaskService from '../Services/TaskService';

const MyTasks = () => {
  const CURRENT_USER_ID = 1;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  const statusColors = {
    'Pending': { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-800', badge: 'bg-slate-100' },
    'InProgress': { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800', badge: 'bg-indigo-100' },
    'WaitingSupervisorApproval': { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800', badge: 'bg-yellow-100' },
    'Completed': { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', badge: 'bg-green-100' }
  };

  const statusLabels = {
    'Pending': 'انجام نشده',
    'InProgress': 'در حال انجام',
    'WaitingSupervisorApproval': 'درانتظار تایید',
    'Completed': 'انجام شده'
  };

  const getDueDateGroup = (dueDate) => {
    if (!dueDate) return 'بدون تاریخ';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'سررسیده';
    if (diffDays === 0) return 'امروز';
    if (diffDays === 1) return 'فردا';
    if (diffDays <= 7) return 'این هفته';
    return 'آینده';
  };

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTasks = await TaskService.getMyTasks(CURRENT_USER_ID);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('خطا در بارگذاری کارها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const groupedTasks = {
    'Pending': {},
    'InProgress': {},
    'WaitingSupervisorApproval': {},
    'Completed': {}
  };

  tasks.forEach(task => {
    const status = task.status;
    const dateGroup = getDueDateGroup(task.dueDate);
    
    if (!groupedTasks[status]) {
      groupedTasks[status] = {};
    }
    
    if (!groupedTasks[status][dateGroup]) {
      groupedTasks[status][dateGroup] = [];
    }
    
    groupedTasks[status][dateGroup].push(task);
  });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTaskCreated = () => {
    loadTasks();
  };

  const dateGroupOrder = ['سررسیده', 'امروز', 'فردا', 'این هفته', 'آینده', 'بدون تاریخ'];

  if (isLoading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center" dir="rtl">
        <p className="text-slate-600">در حال بارگذاری کارها...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center" dir="rtl">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-slate-800">مدیریت کارها</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          + افزودن کار
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(statusLabels).map(([statusKey, statusLabel]) => {
          const statusTasks = groupedTasks[statusKey];
          const totalCount = Object.values(statusTasks).reduce((sum, arr) => sum + arr.length, 0);
          const colors = statusColors[statusKey];
          
          return (
            <div key={statusKey} className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden`}>
              <div 
                className={`flex justify-between items-center p-4 border-b ${colors.border} cursor-pointer hover:opacity-90`}
                onClick={() => toggleSection(statusKey)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{expandedSections[statusKey] !== false ? '▼' : '◀'}</span>
                  <h2 className={`font-bold text-lg ${colors.text}`}>{statusLabel}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors.badge}`}>
                  {totalCount}
                </span>
              </div>

              {expandedSections[statusKey] !== false && (
                <div className="p-4 space-y-4">
                  {totalCount === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">کاری موجود نیست</p>
                  ) : (
                    dateGroupOrder.map(dateGroup => {
                      const groupTasks = statusTasks[dateGroup];
                      if (!groupTasks || groupTasks.length === 0) return null;

                      return (
                        <div key={`${statusKey}-${dateGroup}`} className="space-y-2">
                          <div className="flex items-center gap-2 px-2">
                            <span className="text-xs font-bold text-slate-600 uppercase">{dateGroup}</span>
                            <span className="text-xs text-slate-500">({groupTasks.length})</span>
                          </div>
                          <div className="space-y-2 pr-2">
                            {groupTasks.map(task => (
                              <MytaskRow 
                                key={task.id}
                                {...task}
                                title={task.title}
                                description={task.description}
                                date={task.dueDate ? new Date(task.dueDate).toLocaleDateString('fa-IR') : '-'}
                                time={task.dueDate ? new Date(task.dueDate).toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'}) : '-'}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <AddTaskComponent 
          onClose={() => setIsModalOpen(false)} 
          forcedAssignee='خودم'
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default MyTasks;