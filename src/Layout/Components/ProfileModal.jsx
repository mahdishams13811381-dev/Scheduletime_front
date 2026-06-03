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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImageUrl: reader.result });
      };
      reader.readAsDataURL(file);
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
      <div className="bg-white w-full max-w-[420px] rounded-[24px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* بخش عکس و نام */}
        <div className="flex flex-col items-center text-center">
          <div 
            className="relative w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-slate-50 shadow-md group cursor-pointer"
            onClick={() => canEdit && fileInputRef.current?.click()}
          >
            <img src={profileImageUrl || getDefaultProfileImage()} alt="Profile" className="w-full h-full object-cover" />
            {canEdit && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                تغییر عکس
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
          <p className="text-indigo-600 text-sm font-medium">{displayPosition}</p>
        </div>

        {canEdit ? (
          <div className="mt-8 space-y-4 text-sm">
            <Field label="نام" name="firstName" value={formData.firstName} error={validationErrors.firstName} onChange={handleChange} />
            <Field label="نام خانوادگی" name="lastName" value={formData.lastName} error={validationErrors.lastName} onChange={handleChange} />
            <Field label="سمت" name="position" value={formData.position} error={validationErrors.position} onChange={handleChange} />
            <Field label="لینک تصویر پروفایل" name="profileImageUrl" value={formData.profileImageUrl} onChange={handleChange} />
            <Field label="دانشگاه" name="university" value={formData.university} onChange={handleChange} />
            <Field label="دانشکده" name="faculty" value={formData.faculty} onChange={handleChange} />
            <Field label="گروه / دپارتمان" name="department" value={formData.department} onChange={handleChange} />

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 text-xs">بیوگرافی:</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-indigo-200 rounded-xl outline-none"
                rows="3"
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-4 text-sm">
            <ReadOnlyField label="نام" value={displayName} />
            <ReadOnlyField label="سمت" value={displayPosition} />
            <ReadOnlyField label="دانشگاه" value={formData.university || '—'} />
            <ReadOnlyField label="دانشکده" value={formData.faculty || '—'} />
            <ReadOnlyField label="گروه / دپارتمان" value={formData.department || '—'} />
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 text-xs">بیوگرافی:</label>
              <p className="text-slate-700 p-2 leading-relaxed min-h-[60px]">{formData.biography || '—'}</p>
            </div>
          </div>
        )}

        {/* بخش دکمه‌ها (فقط یک‌بار در اینجا قرار گرفت) */}
        <div className="flex flex-col gap-3 mt-8">
          {canEdit ? (
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 text-slate-500 font-semibold">انصراف</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-70">
                {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors">مشاهده برنامه</button>
                <button className="py-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs hover:bg-amber-100 transition-colors">تغییر برنامه</button>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-100 rounded-xl font-semibold text-slate-600 text-sm">بستن</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, error, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-slate-400 text-xs">{label}:</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="bg-slate-50 border border-indigo-200 rounded-lg px-3 py-2 text-left w-full"
    />
    {error && <span className="text-rose-500 text-[11px] font-medium">{error}</span>}
  </div>
);

const ReadOnlyField = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

export default ProfileModal;