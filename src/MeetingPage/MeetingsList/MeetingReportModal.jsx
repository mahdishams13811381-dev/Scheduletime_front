// import React, { useState } from "react";
// import { FiDownload, FiTrash2, FiUpload, FiX } from "react-icons/fi";

// const MeetingReportModal = ({ isOpen, onClose, meeting }) => {
// const [file, setFile] = useState(meeting?.reportFile || "صورت_جلسه_نمونه.pdf");
//   if (!isOpen) return null;

//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     if (uploadedFile) setFile(uploadedFile.name);
//   };
  

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//       <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
//       <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative z-10" dir="rtl">
//         <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600"><FiX /></button>
        
//         <h2 className="text-lg font-bold text-slate-800 mb-2">گزارش جلسه</h2>
//         <p className="text-sm text-slate-600 mb-6 font-bold">{meeting?.title}</p>

//         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
//           <p className="text-xs text-slate-500 mb-1">توضیحات تکمیلی:</p>
//           <p className="text-sm text-slate-700">{meeting?.description}</p>
//         </div>

//         <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
//           {file ? (
//             <div className="flex items-center justify-between bg-white border border-indigo-100 p-3 rounded-xl shadow-sm">
//               <span className="text-xs font-bold text-indigo-700 truncate">{file}</span>
//               <div className="flex gap-2">
//                 <a 
//         href="/report.pdf" 
//         download="صورت_جلسه_نهایی.pdf"
//         className="text-slate-400 hover:text-indigo-600 transition-colors"
//       >
//         <FiDownload size={16} />
//       </a>
//             <button onClick={() => setFile(null)} className="text-slate-400 hover:text-rose-600"><FiTrash2 size={16} /></button>
//               </div>
//             </div>
//           ) : (
//             <label className="cursor-pointer flex flex-col items-center gap-2">
//               <FiUpload size={24} className="text-slate-400" />
//               <span className="text-xs font-bold text-slate-500">انتخاب فایل صورت‌جلسه</span>
//               <input type="file" className="hidden" onChange={handleFileChange} />
//             </label>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MeetingReportModal;
import React, { useState } from "react";
import { FiDownload, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import RequestRow from "../../RequestsPage/Components/RequestRow";

const MeetingReportModal = ({ isOpen, onClose, meeting }) => {
  const [file, setFile] = useState(meeting?.reportFile || "صورت_جلسه_نمونه.pdf");
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setFile(uploadedFile.name);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative z-10" dir="rtl">
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600"><FiX /></button>
        
        <h2 className="text-lg font-bold text-slate-800 mb-4">گزارش جلسه: {meeting?.title}</h2>

        {/* جزئیات جلسه */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block">تاریخ:</span>
            <span className="font-bold text-slate-700">{meeting?.date || "---"}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
    <span className="text-xs text-slate-400 block">زمان:</span>
    <span className="font-bold text-slate-700">
      {meeting?.startTime || "--:--"} تا {meeting?.endTime || "--:--"}
    </span>
  </div>
          <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block">لینک جلسه:</span>
            <a href={meeting?.link} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold truncate block">{meeting?.link || "---"}</a>
          </div>
          <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-400 block">اعضا:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {meeting?.participants?.map((p, index) => (
                <span key={index} className="text-xs bg-white px-2 py-1 rounded-md border border-slate-200">{p.name}</span>
              )) || <span className="text-slate-400">بدون عضو</span>}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
          <p className="text-xs text-slate-500 mb-1">توضیحات تکمیلی:</p>
          <p className="text-sm text-slate-700">{meeting?.description}</p>
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
          {file ? (
            <div className="flex items-center justify-between bg-white border border-indigo-100 p-3 rounded-xl shadow-sm">
              <span className="text-xs font-bold text-indigo-700 truncate">{file}</span>
              <div className="flex gap-2">
                <a href="/report.pdf" download="صورت_جلسه_نهایی.pdf" className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <FiDownload size={16} />
                </a>
                <button onClick={() => setFile(null)} className="text-slate-400 hover:text-rose-600"><FiTrash2 size={16} /></button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <FiUpload size={24} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500">انتخاب فایل صورت‌جلسه</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingReportModal;