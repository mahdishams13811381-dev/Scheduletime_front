import React, { useState, useEffect, useRef } from "react";
import { userService } from "../../Services/UserService";
import toast from "react-hot-toast";
import RequestService from "../../Services/RequestService";

const AddRequestModal = ({ onClose, onAdd, requestData }) => {
  // ۱. مقداردهی اولیه فرم - اگر requestData وجود داشت، فیلدها پر می‌شوند
  const [formData, setFormData] = useState({
    title: requestData?.title || "",
    description: requestData?.description || "",
    status: requestData?.status || "در انتظار",
    people: requestData?.people || []
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    userService.getAllUsers()
      .then(result => {
        setAllUsers(result.items || []);
      })
      .catch(err => {
        console.error(err);
        toast.error("خطا در دریافت کاربران");
      });
  }, []);

  const filteredUsers = allUsers.filter(
    u =>
      (`${u.firstName} ${u.lastName}`)
        .includes(searchQuery) &&
      !formData.people.some(
        p => p.id === u.id
      )
  );

  const removePerson = (id) => {
    setFormData({ ...formData, people: formData.people.filter((p) => p.id !== id) });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("لطفاً عنوان درخواست را وارد کنید.");
      return;
    }

    if (formData.people.length === 0) {
      toast.error("لطفاً یک مسئول برای درخواست انتخاب کنید.");
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.description,
      status: 1,
      senderUserId: userService.getCurrentUserId(),
      currentOwnerUserId: formData.people[0]?.id,
      tagIds: []
    };

    setSubmitting(true);

    RequestService.createRequest(payload)
      .then(() => {
        toast.success("درخواست با موفقیت ثبت شد.");

        if (onAdd) {
          onAdd(payload);
        }

        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast.error("خطا در ثبت درخواست");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="bg-white w-full max-w-[650px] rounded-3xl p-6 shadow-2xl relative z-10 border border-slate-100" dir="rtl">
        <h2 className="text-lg font-bold text-slate-800 mb-6">
          {requestData ? "ویرایش درخواست" : "ساخت درخواست جدید"}
        </h2>

        <form className="flex flex-col gap-5">
          {/* عنوان */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-sm font-bold text-slate-800">عنوان:</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          {/* توضیحات */}
          <div className="grid grid-cols-[80px_1fr] items-start gap-2">
            <label className="text-sm font-bold text-slate-800 mt-2">توضیحات:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              rows="3"
            />
          </div>



          {/* اعضا */}
          <div className="grid grid-cols-[80px_1fr] items-start gap-2 relative" ref={searchRef}>
            <label className="text-sm font-bold mt-2">اعضا:</label>

            <div className="flex flex-col gap-2">

              {/* اعضای انتخاب شده */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(prev => !prev)}
                  className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-lg font-bold"
                >
                  +
                </button>

                {formData.people.map(user => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        people: [user]
                      });

                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-2 bg-white border rounded-full px-2 py-1 cursor-pointer hover:border-red-300"
                  >
                    <img
                      src={user.profileImageUrl || "/default-avatar.png"}
                      className="w-7 h-7 rounded-full object-cover"
                      alt=""
                    />

                    <span className="text-xs font-bold">
                      {user.firstName} {user.lastName}
                    </span>

                    <span className="text-red-500 text-xs">✕</span>
                  </div>
                ))}
              </div>

              {/* لیست کاربران */}
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border shadow-xl rounded-2xl z-50 overflow-hidden">

                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی اعضا..."
                    className="w-full p-3 border-b outline-none text-sm"
                  />

                  <div className="max-h-64 overflow-y-auto">

                    {filteredUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            people: [...formData.people, user]
                          });
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                      >
                        <img
                          src={user.profileImageUrl || "/default-avatar.png"}
                          className="w-10 h-10 rounded-full object-cover"
                          alt=""
                        />

                        <div>
                          <div className="font-bold text-sm">
                            {user.firstName} {user.lastName}
                          </div>

                          <div className="text-xs text-slate-500">
                            {user.position}
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredUsers.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400">
                        کاربری یافت نشد
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleSave}
            className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all mt-4 disabled:opacity-50"
          >
            {submitting ? "در حال ثبت..." : "ذخیره تغییرات"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRequestModal;