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
  const tabs: { id: "all" | "pending" | "completed"; label: string; mobileLabel: string; count: number }[] = [
    { id: "all", label: "All Tasks", mobileLabel: "All", count: counts.all },
    { id: "pending", label: "Pending", mobileLabel: "Pending", count: counts.pending },
    { id: "completed", label: "Completed", mobileLabel: "Done", count: counts.completed },
  ];

  return (
    <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 w-full sm:w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`justify-center px-2 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 sm:gap-2 cursor-pointer ${
            currentTab === tab.id
              ? "bg-surface text-primary shadow-xs font-bold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.mobileLabel}</span>
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
