import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import TaskService from "./TaskService";

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

const TaskContext = createContext(null);

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [myTasks, setMyTasks] = useState([]);
  const [assignTasks, setAssignTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await TaskService.getMyTasks(CURRENT_USER_ID);
      setMyTasks(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAssignTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await TaskService.getAssignTasks(CURRENT_USER_ID);
      setAssignTasks(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyTasks();
    loadAssignTasks();
  }, [loadMyTasks, loadAssignTasks]);

  const createTask = async (model) => {
    const created = await TaskService.createTask(model);

    await Promise.all([
      loadMyTasks(),
      loadAssignTasks()
    ]);

    return created;
  };

  const updateTask = async (model) => {
    const updated = await TaskService.updateTask(model);

    await Promise.all([
      loadMyTasks(),
      loadAssignTasks()
    ]);

    return updated;
  };

  const deleteTask = async (id) => {
    await TaskService.deleteTask(id);

    await Promise.all([
      loadMyTasks(),
      loadAssignTasks()
    ]);
  };

  return (
    <TaskContext.Provider
      value={{
        myTasks,
        assignTasks,
        loading,
        loadMyTasks,
        loadAssignTasks,
        createTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};