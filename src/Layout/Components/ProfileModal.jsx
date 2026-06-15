import React, { useState, useEffect, useRef } from 'react';
import { getDefaultProfileImage, getProfileImageUrl, getUserFullName, getUserPosition, normalizeUserProfile } from '../../Utils/userProfile';

const ProfileModal = ({ user, isOpen, onClose, onSave, canEdit = false }) => {
  const [formData, setFormData] = useState(normalizeUserProfile(user));
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(normalizeUserProfile(user));
    setValidationErrors({});
    setIsSaving(false);
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (validationErrors[name]) {
      setValidationErrors((previousErrors) => {
        const nextErrors = { ...previousErrors };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !user?.id) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://localhost:5000/api/user/${user.id}/profile-image`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error("خطا در آپلود تصویر");
      }

      const result = await response.json();

      setFormData(prev => ({
        ...prev,
        profileImageUrl: result.profileImageUrl
      }));
    } catch (error) {
      console.error(error);
      alert("خطا در آپلود تصویر");
    }
  };

  const handleSave = async () => {
    const nextErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = 'نام را وارد کنید.';
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = 'نام خانوادگی را وارد کنید.';
    }

    if (!formData.position.trim()) {
      nextErrors.position = 'سمت را وارد کنید.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    try {
      await onSave?.(formData);
      onClose?.();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const profileImageUrl = getProfileImageUrl(formData);
  const displayName = getUserFullName(formData);
  const displayPosition = getUserPosition(formData);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white w-full max-w-[500px] rounded-[24px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">

        {/* بخش عکس و نام */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden mb-3 border-4 border-slate-50 shadow-md group cursor-pointer"
            onClick={() => canEdit && fileInputRef.current?.click()}
          >
            <img src={profileImageUrl || getDefaultProfileImage()} alt="Profile" className="w-full h-full object-cover" />
            {canEdit && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                تغییر عکس
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
          <p className="text-indigo-600 text-xs font-medium">{displayPosition}</p>
        </div>

        {canEdit ? (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <Field label="نام" name="firstName" value={formData.firstName} error={validationErrors.firstName} onChange={handleChange} />
              <Field label="نام خانوادگی" name="lastName" value={formData.lastName} error={validationErrors.lastName} onChange={handleChange} />
            </div>
            <Field label="سمت" name="position" value={formData.position} error={validationErrors.position} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="دانشگاه" name="university" value={formData.university} onChange={handleChange} />
              <Field label="دانشکده" name="faculty" value={formData.faculty} onChange={handleChange} />
            </div>
            <Field label="گروه / دپارتمان" name="department" value={formData.department} onChange={handleChange} />

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 text-xs">بیوگرافی:</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                className="w-full p-2 bg-slate-50 border border-indigo-200 rounded-lg outline-none text-xs"
                rows="2"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <ReadOnlyField label="نام" value={displayName} />
            <ReadOnlyField label="سمت" value={displayPosition} />
            <div className="grid grid-cols-2 gap-3">
              <ReadOnlyField label="دانشگاه" value={formData.university || '—'} />
              <ReadOnlyField label="دانشکده" value={formData.faculty || '—'} />
            </div>
            <ReadOnlyField label="گروه / دپارتمان" value={formData.department || '—'} />
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 text-xs">بیوگرافی:</label>
              <p className="text-slate-700 p-2 leading-relaxed text-xs min-h-[40px]">{formData.biography || '—'}</p>
            </div>
          </div>
        )}

        {/* بخش دکمه‌ها */}
        <div className="flex flex-col gap-2 mt-6">
          {canEdit ? (
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2 text-slate-500 font-semibold text-sm">انصراف</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm disabled:opacity-70">
                {isSaving ? 'ذخیره...' : 'ذخیره'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-xs hover:bg-emerald-100 transition-colors">مشاهده برنامه</button>
                <button className="py-2 bg-amber-50 text-amber-700 rounded-lg font-bold text-xs hover:bg-amber-100 transition-colors">تغییر برنامه</button>
              </div>
              <button onClick={onClose} className="w-full py-2 border-2 border-slate-100 rounded-lg font-semibold text-slate-600 text-sm">بستن</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, error, onChange }) => (
  <div className="flex flex-col gap-0.5">
    <label className="text-slate-400 text-xs">{label}:</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="bg-slate-50 border border-indigo-200 rounded-lg px-2 py-1.5 text-left w-full text-sm"
    />
    {error && <span className="text-rose-500 text-[10px] font-medium">{error}</span>}
  </div>
);

const ReadOnlyField = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-slate-400 text-xs">{label}:</span>
    <span className="font-medium text-slate-800 text-sm">{value}</span>
  </div>
);

export default ProfileModal;