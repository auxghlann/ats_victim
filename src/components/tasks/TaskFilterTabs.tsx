interface TaskFilterTabsProps {
  currentTab: "all" | "pending" | "completed";
  onTabChange: (tab: "all" | "pending" | "completed") => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export function TaskFilterTabs({ currentTab, onTabChange, counts }: TaskFilterTabsProps) {
  const tabs: { id: "all" | "pending" | "completed"; label: string; count: number }[] = [
    { id: "all", label: "All Tasks", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "completed", label: "Completed", count: counts.completed },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            currentTab === tab.id
              ? "bg-surface text-primary shadow-xs font-bold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {tab.label}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
              currentTab === tab.id
                ? "bg-primary/10 text-primary"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
