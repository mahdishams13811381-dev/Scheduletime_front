import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MeetingElement from './MeetingElement';
import AddMeetingModal from './../../Home/Components/AddMeetingModal';
import MeetingReportModal from './MeetingReportModal';
import { useMeeting } from '../../Services/MeetingContext';

const categoryKeys = [
  "جلسات حضوری داخل دانشگاه",
  "جلسات حضوری خارج دانشگاه",
  "جلسات آنلاین",
  "سایر جلسات"
];

const normalizeGrouped = (groupedData) => {
  const emptyMap = categoryKeys.reduce(
    (acc, key) => ({ ...acc, [key]: [] }),
    {}
  );

  if (!groupedData) return emptyMap;

  const normalized = { ...emptyMap };

  const addTo = (meeting) => {
    const type = (meeting?.type || '').toLowerCase();

    if (type === 'online')
      normalized['جلسات آنلاین'].push(meeting);
    else if (type === 'internaluniversity')
      normalized['جلسات حضوری داخل دانشگاه'].push(meeting);
    else if (type === 'externaluniversity')
      normalized['جلسات حضوری خارج دانشگاه'].push(meeting);
    else
      normalized['سایر جلسات'].push(meeting);
  };

  ['pending', 'held', 'rejected'].forEach((status) => {
    const statusObj = groupedData[status] || {};

    Object.values(statusObj).forEach((arr) => {
      if (Array.isArray(arr)) {
        arr.forEach(addTo);
      }
    });
  });

  return normalized;
};

const MeetingsList = () => {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const { grouped, loading } = useMeeting();

  const statusFilter = searchParams.get('status');

  const normalizedGrouped = normalizeGrouped(grouped);

  const handleOpenReport = (meeting) => {
    setSelectedMeeting(meeting);
    setIsReportOpen(true);
  };

  const handleEditClick = (meeting) => {
    setEditingMeeting(meeting);
    setIsModalOpen(true);
  };

  const groupsToShow = statusFilter
    ? [statusFilter]
    : [
        "جلسات آنلاین",
        "جلسات حضوری داخل دانشگاه",
        "جلسات حضوری خارج دانشگاه",
        "سایر جلسات"
      ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen" dir="rtl">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        لیست {statusFilter || "همه جلسات"}
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th className="p-4">ساعت</th>
              <th className="p-4">تاریخ</th>
              <th className="p-4 text-right">عنوان جلسه</th>
              <th className="p-4 text-right">توضیحات</th>
              <th className="p-4">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  در حال بارگذاری...
                </td>
              </tr>
            )}

            {!loading &&
              groupsToShow.map((groupName) => {
                const meetings = normalizedGrouped[groupName] || [];

                if (meetings.length === 0) {
                  return (
                    <tr key={groupName}>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-slate-500"
                      >
                        جلسه‌ای یافت نشد
                      </td>
                    </tr>
                  );
                }

                return (
                  <React.Fragment key={groupName}>
                    {!statusFilter && (
                      <tr className="bg-slate-50">
                        <td colSpan="5" className="p-3 font-bold">
                          {groupName}
                        </td>
                      </tr>
                    )}

                    {meetings.map((meeting) => (
                      <MeetingElement
                        key={meeting.id}
                        title={meeting.title}
                        description={meeting.subject}
                        date={new Date(
                          meeting.meetingDate
                        ).toLocaleDateString("fa-IR")}
                        time={new Date(
                          meeting.meetingDate
                        ).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                        status={meeting.status}
                        onEdit={() => handleEditClick(meeting)}
                        onReport={() => handleOpenReport(meeting)}
                        onDelete={() =>
                          console.log("delete", meeting.id)
                        }
                      />
                    ))}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>

        <MeetingReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          meeting={selectedMeeting}
        />
      </div>

      {isModalOpen && (
        <AddMeetingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMeeting(null);
          }}
          initialData={editingMeeting}
        />
      )}
    </div>
  );
};

export default MeetingsList;