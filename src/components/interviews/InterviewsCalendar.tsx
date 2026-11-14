"use client";

import { useState, useMemo } from "react";
import { Application, EnrichedInterview } from "@/types/database";
import { toLocalDateString } from "@/lib/utils/date";
import {
  createInterviewAction,
  updateInterviewAction,
  deleteInterviewAction,
} from "@/app/actions/interviewsAction";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid, CalendarCell } from "./CalendarGrid";
import { DateSchedulePanel } from "./DateSchedulePanel";
import { ScheduleInterviewModal, ScheduleInterviewData } from "./ScheduleInterviewModal";
import { DeleteModal } from "@/components/common/DeleteModal";

interface InterviewsCalendarProps {
  initialInterviews: EnrichedInterview[];
  applications: Application[];
}

export function InterviewsCalendar({ initialInterviews, applications }: InterviewsCalendarProps) {
  const [interviews, setInterviews] = useState<EnrichedInterview[]>(initialInterviews);

  // Calendar View State: Always default to current month and today's local date
  const [viewDate, setViewDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDateStr, setSelectedDateStr] = useState<string>(() =>
    toLocalDateString(new Date())
  );

  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Schedule / Edit Interview Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState<EnrichedInterview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<EnrichedInterview | null>(null);

  const shiftDate = (daysDelta: number) => {
    const cur = new Date(`${selectedDateStr}T00:00:00`);
    cur.setDate(cur.getDate() + daysDelta);
    setSelectedDateStr(toLocalDateString(cur));
    setViewDate(new Date(cur.getFullYear(), cur.getMonth(), 1));
  };

  const handlePrev = () => {
    if (viewMode === "month") {
      setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else {
      shiftDate(viewMode === "week" ? -7 : -1);
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else {
      shiftDate(viewMode === "week" ? 7 : 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(toLocalDateString(today));
  };

  // Month metadata
  const currentYear = viewDate.getFullYear();
  const currentMonthIdx = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Map of interviews by date string YYYY-MM-DD
  const interviewsByDate = useMemo(() => {
    const map: Record<string, EnrichedInterview[]> = {};
    for (const interview of interviews) {
      const datePart = toLocalDateString(interview.scheduled_at);
      if (datePart) {
        if (!map[datePart]) map[datePart] = [];
        map[datePart].push(interview);
      }
    }
    return map;
  }, [interviews]);

  // Calendar cells computation (42 cells: 6 weeks x 7 days)
  const calendarCells = useMemo<CalendarCell[]>(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonthIdx, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonthIdx, 0).getDate();

    const cells: CalendarCell[] = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const dateStr = toLocalDateString(new Date(currentYear, currentMonthIdx - 1, dayNum));
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        events: interviewsByDate[dateStr] || [],
      });
    }

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateStr = toLocalDateString(new Date(currentYear, currentMonthIdx, dayNum));
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: true,
        events: interviewsByDate[dateStr] || [],
      });
    }

    const remaining = 42 - cells.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const dateStr = toLocalDateString(new Date(currentYear, currentMonthIdx + 1, dayNum));
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        events: interviewsByDate[dateStr] || [],
      });
    }

    return cells;
  }, [currentYear, currentMonthIdx, interviewsByDate]);

  const handleModalSubmit = async (data: ScheduleInterviewData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const matchedApp = applications.find((a) => a.id === data.applicationId);
      if (editingInterview) {
        const updated = await updateInterviewAction(editingInterview.id, data);
        if (updated) {
          const enriched: EnrichedInterview = {
            ...updated,
            company_name: matchedApp?.company_name || null,
            job_title: matchedApp?.job_title || null,
            status: matchedApp?.status || null,
          };
          setInterviews((prev) => prev.map((i) => (i.id === updated.id ? enriched : i)));
          setEditingInterview(null);
        }
      } else {
        const created = await createInterviewAction(data);
        if (created) {
          const enriched: EnrichedInterview = {
            ...created,
            company_name: matchedApp?.company_name || null,
            job_title: matchedApp?.job_title || null,
            status: matchedApp?.status || null,
          };
          setInterviews((prev) => [...prev, enriched]);
          setShowScheduleModal(false);
          setSelectedDateStr(toLocalDateString(data.scheduledAt) || toLocalDateString(new Date()));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInterview = (interviewId: string) => {
    const interview = interviews.find((i) => i.id === interviewId) || null;
    setInterviewToDelete(interview);
  };

  const handleConfirmDeleteInterview = async () => {
    if (!interviewToDelete) return;
    const interviewId = interviewToDelete.id;
    const originalInterviews = interviews;
    setInterviews((prev) => prev.filter((i) => i.id !== interviewId));

    try {
      await deleteInterviewAction(interviewId);
    } catch {
      setInterviews(originalInterviews);
    }
  };

  const selectedDateEvents = interviewsByDate[selectedDateStr] || [];

  const totalMonthEvents = useMemo(() => {
    return interviews.filter((i) => {
      const d = new Date(i.scheduled_at);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonthIdx;
    }).length;
  }, [interviews, currentYear, currentMonthIdx]);

  return (
    <div className="space-y-8">
      <CalendarHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrevMonth={handlePrev}
        onNextMonth={handleNext}
        onToday={handleToday}
        onOpenScheduleModal={() => {
          setEditingInterview(null);
          setShowScheduleModal(true);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarGrid
            viewMode={viewMode}
            monthName={monthName}
            totalMonthEvents={totalMonthEvents}
            cells={calendarCells}
            selectedDateStr={selectedDateStr}
            onSelectDate={setSelectedDateStr}
            interviewsByDate={interviewsByDate}
          />
        </div>

        <DateSchedulePanel
          selectedDateStr={selectedDateStr}
          events={selectedDateEvents}
          onEditInterview={(interview) => setEditingInterview(interview)}
          onDeleteInterview={handleDeleteInterview}
          onOpenScheduleModal={() => {
            setEditingInterview(null);
            setShowScheduleModal(true);
          }}
        />
      </div>

      <ScheduleInterviewModal
        isOpen={showScheduleModal || Boolean(editingInterview)}
        onClose={() => {
          setShowScheduleModal(false);
          setEditingInterview(null);
        }}
        onSubmit={handleModalSubmit}
        applications={applications}
        interview={editingInterview}
        defaultDateTime={`${selectedDateStr}T14:00`}
        isSubmitting={isSubmitting}
      />

      <DeleteModal
        isOpen={Boolean(interviewToDelete)}
        onClose={() => setInterviewToDelete(null)}
        onConfirm={handleConfirmDeleteInterview}
        title="Delete Interview"
        itemName={
          interviewToDelete
            ? `${interviewToDelete.round_name || "Interview"} with ${interviewToDelete.company_name}`
            : undefined
        }
      />
    </div>
  );
}
