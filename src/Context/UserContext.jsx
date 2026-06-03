import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { userService } from '../Services/UserService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const loadCurrentUser = useCallback(async ({ forceRefresh = false } = {}) => {
    setIsLoadingUser(true);
    setUserError('');

    try {
      const user = await userService.getCurrentUser({ forceRefresh });
      setCurrentUser(user);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load the current user.';
      setUserError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const updateCurrentUser = useCallback(async (model) => {
    setIsSavingUser(true);

    try {
      const refreshedUser = await userService.updateUser(model);
      setCurrentUser(refreshedUser);
      setUserError('');
      setIsProfileModalOpen(false);
      toast.success('پروفایل با موفقیت بروزرسانی شد.');
      return refreshedUser;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed.';
      toast.error(message);
      throw error;
    } finally {
      setIsSavingUser(false);
    }
  }, []);

  const value = useMemo(() => ({
    currentUser,
    isLoadingUser,
    userError,
    isSavingUser,
    isProfileModalOpen,
    openProfileModal: () => setIsProfileModalOpen(true),
    closeProfileModal: () => setIsProfileModalOpen(false),
    refreshCurrentUser: () => loadCurrentUser({ forceRefresh: true }),
    updateCurrentUser
  }), [currentUser, isLoadingUser, userError, isSavingUser, isProfileModalOpen, loadCurrentUser, updateCurrentUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider.');
  }

  return context;
};