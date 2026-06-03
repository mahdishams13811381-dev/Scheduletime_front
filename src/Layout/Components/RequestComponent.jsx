// export default function RequestComponent({ request, onAction }) {
//   return (
//     <div className="bg-white border-2 border-blue-400 rounded-2xl p-3 flex flex-col gap-3 shadow-sm">
//       <div className="flex items-center justify-between gap-2">
//         <div className="flex items-center gap-2 min-w-0">
//           <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
//             <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 text-blue-500">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
//             </svg>
//           </div>
//           <span className="text-xs font-bold text-slate-800 truncate">{request.name}</span>
//         </div>
//         <span className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0" dir="ltr">
//           <span>{request.time}</span>
//           <span>—</span>
//           <span>{request.date}</span>
//         </span>
//       </div>
//       <div className="grid grid-cols-2 gap-3 text-xs font-bold">
//         <button 
//           onClick={() => onAction(request.id, "approve")}
//           className="py-2 px-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer text-center"
//         >
//           تایید
//         </button>
//         <button 
//           onClick={() => onAction(request.id, "reject")}
//           className="py-2 px-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer text-center"
//         >
//           عدم تایید
//         </button>
//       </div>
//     </div>
//   );
// }
import React from "react";


function RequestComponent({ request, onAction, onView }) {
  const created = request.CreatedAt ? new Date(request.CreatedAt).toLocaleString() : '';
  const sender = request.SenderUser ? `${request.SenderUser.firstName || request.SenderUser.FirstName || ''} ${request.SenderUser.lastName || request.SenderUser.LastName || ''}`.trim() : '';

  return (
    <div className="border border-slate-100 rounded-xl p-3 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-700 truncate">{request.Title}</div>
            <div className="text-[11px] text-slate-500">{request.Status} • {sender}</div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 mb-4">{created}</div>

      <button 
        onClick={onView}
        className="w-full py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
      >
        نمایش
      </button>
    </div>
  );
}

export default RequestComponent;
