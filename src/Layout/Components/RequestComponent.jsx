import React from "react";
function RequestComponent({ request, onView }) {

  const created = request.createdAt
    ? new Date(request.createdAt).toLocaleString("fa-IR")
    : "";

  const sender = request.senderUser
    ? `${request.senderUser.firstName || ""} ${request.senderUser.lastName || ""}`.trim()
    : "";

  return (
    <div className="border border-slate-100 rounded-xl p-3 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-700 truncate">
              {request.title}
            </div>

            <div className="text-[11px] text-slate-500">
              {sender && `${sender}`}
            </div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 mb-4">
        {created}
      </div>

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