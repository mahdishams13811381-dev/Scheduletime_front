const DEFAULT_PROFILE_IMAGE = 'https://placehold.co/160x160?text=User';

export const normalizeUserProfile = (user) => ({
  id: user?.id ?? 0,
  firstName: user?.firstName ?? user?.name?.split(' ')?.[0] ?? '',
  lastName: user?.lastName ?? user?.name?.split(' ')?.slice(1).join(' ') ?? '',
  position: user?.position ?? user?.role ?? user?.academicTitle ?? '',
  biography: user?.biography ?? user?.bio ?? '',
  profileImageUrl: user?.profileImageUrl ?? user?.avatar ?? '',
  university: user?.university ?? '',
  faculty: user?.faculty ?? '',
  department: user?.department ?? ''
});

export const getUserFullName = (user) => {
  const profile = normalizeUserProfile(user);
  return [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() || 'کاربر';
};

export const getUserPosition = (user) => normalizeUserProfile(user).position || '---';

export const getProfileImageUrl = (user) => normalizeUserProfile(user).profileImageUrl || DEFAULT_PROFILE_IMAGE;

export const getDefaultProfileImage = () => DEFAULT_PROFILE_IMAGE;