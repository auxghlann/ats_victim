"use client";

import { useState, useMemo } from "react";
import { Application, EnrichedInterview } from "@/types/database";
import { CreateInterviewInput } from "@/lib/services/interviewsService";
import { toLocalDateString } from "@/lib/utils/date";
import {
  createInterviewAction,
  updateInterviewAction,
  deleteInterviewAction,
} from "@/app/actions/interviewsAction";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid, CalendarCell } from "./CalendarGrid";
import { DateSchedulePanel } from "./DateSchedulePanel";
import { ScheduleInterviewModal } from "./ScheduleInterviewModal";
import { EditInterviewModal } from "./EditInterviewModal";
import { DeleteModal } from "@/components/common/DeleteModal";

interface InterviewsCalendarProps {
  initialInterviews: EnrichedInterview[];
  applications: Application[];
}

export function InterviewsCalendar({ initialInterviews, applications }: InterviewsCalendarProps) {
  const [interviews, setInterviews] = useState<EnrichedInterview[]>(initialInterviews);

  // Calendar View State: Month viewed
  const [viewDate, setViewDate] = useState(() => {
    if (initialInterviews.length > 0) {
      const firstDate = new Date(initialInterviews[0].scheduled_at);
      if (!isNaN(firstDate.getTime())) {
        return new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
      }
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Selected date for schedule sidebar
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    if (initialInterviews.length > 0) {
      const local = toLocalDateString(initialInterviews[0].scheduled_at);
      if (local) return local;
    }
    return toLocalDateString(new Date());
  });

  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Schedule Interview Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Interview Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState<EnrichedInterview | null>(null);
  const [isUpdatingInterview, setIsUpdatingInterview] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<EnrichedInterview | null>(null);

  // Dynamic navigation handlers for Month, Week, and Day
  const handlePrev = () => {
    if (viewMode === "month") {
      setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (viewMode === "week") {
      const cur = new Date(`${selectedDateStr}T00:00:00`);
      cur.setDate(cur.getDate() - 7);
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      const dStr = `${y}-${m}-${d}`;
      setSelectedDateStr(dStr);
      setViewDate(new Date(cur.getFullYear(), cur.getMonth(), 1));
    } else {
      const cur = new Date(`${selectedDateStr}T00:00:00`);
      cur.setDate(cur.getDate() - 1);
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      const dStr = `${y}-${m}-${d}`;
      setSelectedDateStr(dStr);
      setViewDate(new Date(cur.getFullYear(), cur.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (viewMode === "week") {
      const cur = new Date(`${selectedDateStr}T00:00:00`);
      cur.setDate(cur.getDate() + 7);
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      const dStr = `${y}-${m}-${d}`;
      setSelectedDateStr(dStr);
      setViewDate(new Date(cur.getFullYear(), cur.getMonth(), 1));
    } else {
      const cur = new Date(`${selectedDateStr}T00:00:00`);
      cur.setDate(cur.getDate() + 1);
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      const dStr = `${y}-${m}-${d}`;
      setSelectedDateStr(dStr);
      setViewDate(new Date(cur.getFullYear(), cur.getMonth(), 1));
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

    // Prev month padding
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthDate = new Date(currentYear, currentMonthIdx - 1, dayNum);
      const dateStr = toLocalDateString(prevMonthDate);
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        events: interviewsByDate[dateStr] || [],
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const cellDate = new Date(currentYear, currentMonthIdx, dayNum);
      const dateStr = toLocalDateString(cellDate);
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: true,
        events: interviewsByDate[dateStr] || [],
      });
    }

    // Next month padding to fill grid
    const remaining = 42 - cells.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextMonthDate = new Date(currentYear, currentMonthIdx + 1, dayNum);
      const dateStr = toLocalDateString(nextMonthDate);
      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        events: interviewsByDate[dateStr] || [],
      });
    }

    return cells;
  }, [currentYear, currentMonthIdx, interviewsByDate]);

  // Create Interview submit handler
  const handleScheduleSubmit = async (data: import("./ScheduleInterviewModal").ScheduleInterviewData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const input: CreateInterviewInput = {
        applicationId: data.applicationId,
        roundName: data.roundName,
        scheduledAt: data.scheduledAt,
        meetingLink: data.meetingLink,
        notes: data.notes,
      };

      const created = await createInterviewAction(input);
      if (created) {
        const matchedApp = applications.find((a) => a.id === data.applicationId);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (interview: EnrichedInterview) => {
    setEditingInterview(interview);
    setShowEditModal(true);
  };

  // Save Edit Interview
  const handleSaveEdit = async (data: import("./EditInterviewModal").EditInterviewData) => {
    if (!editingInterview || isUpdatingInterview) return;

    setIsUpdatingInterview(true);
    try {
      const updated = await updateInterviewAction(editingInterview.id, {
        applicationId: data.applicationId,
        roundName: data.roundName,
        scheduledAt: data.scheduledAt,
        meetingLink: data.meetingLink,
        notes: data.notes,
      });

      if (updated) {
        const matchedApp = applications.find((a) => a.id === data.applicationId);
        const enriched: EnrichedInterview = {
          ...updated,
          company_name: matchedApp?.company_name || null,
          job_title: matchedApp?.job_title || null,
          status: matchedApp?.status || null,
        };
        setInterviews((prev) => prev.map((i) => (i.id === updated.id ? enriched : i)));
        setShowEditModal(false);
        setEditingInterview(null);
      }
    } finally {
      setIsUpdatingInterview(false);
    }
  };

  // Delete Interview handler
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
      {/* Calendar Header */}
      <CalendarHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrevMonth={handlePrev}
        onNextMonth={handleNext}
        onToday={handleToday}
        onOpenScheduleModal={() => setShowScheduleModal(true)}
      />

      {/* Main Grid: Calendar Grid & Daily Schedule */}
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

        {/* Selected Date Schedule Panel */}
        <DateSchedulePanel
          selectedDateStr={selectedDateStr}
          events={selectedDateEvents}
          onEditInterview={handleOpenEdit}
          onDeleteInterview={handleDeleteInterview}
          onOpenScheduleModal={() => setShowScheduleModal(true)}
        />
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSubmit={handleScheduleSubmit}
        applications={applications}
        defaultDateTime={`${selectedDateStr}T14:00`}
        isSubmitting={isSubmitting}
      />

      {/* Edit Interview Modal */}
      {editingInterview && (
        <EditInterviewModal
          key={editingInterview.id}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingInterview(null);
          }}
          onSubmit={handleSaveEdit}
          applications={applications}
          interview={editingInterview}
          isSubmitting={isUpdatingInterview}
        />
      )}

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
