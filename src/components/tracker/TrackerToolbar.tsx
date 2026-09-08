interface TrackerToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedWorkSetup: string;
  onWorkSetupChange: (setup: string) => void;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
  isExporting: boolean;
  onSyncGmail: () => void;
  isPending: boolean;
}

export function TrackerToolbar({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedWorkSetup,
  onWorkSetupChange,
  onOpenAddModal,
  onExportCsv,
  isExporting,
  onSyncGmail,
  isPending,
}: TrackerToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Application Tracker
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Track and manage your active job applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync Gmail Trigger */}
          <button
            type="button"
            onClick={onSyncGmail}
            disabled={isPending}
            className="px-4 py-2.5 rounded-full border border-outline-variant/60 bg-surface text-xs font-semibold text-on-surface hover:bg-surface-container transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            title="Sync latest emails from Gmail"
          >
            <span
              className={`material-symbols-outlined text-base text-primary ${
                isPending ? "animate-spin" : ""
              }`}
            >
              sync
            </span>
            <span>{isPending ? "Syncing..." : "Sync Gmail"}</span>
          </button>

          {/* Add Application Trigger */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add Application
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-2.5 rounded-2xl border border-outline-variant/40 shadow-xs">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company, role, location..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/60"
          />
        </div>

        {/* Dropdown Filters & CSV Export */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="viewed">Viewed</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
              filter_list
            </span>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Work Setup Filter */}
          <div className="relative">
            <select
              value={selectedWorkSetup}
              onChange={(e) => onWorkSetupChange(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Work Setups</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
              location_on
            </span>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCsv}
            disabled={isExporting}
            className="px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
            title="Export filtered applications as CSV"
          >
            <span
              className={`material-symbols-outlined text-sm text-primary ${
                isExporting ? "animate-spin" : ""
              }`}
            >
              {isExporting ? "progress_activity" : "download"}
            </span>
            <span className="hidden md:inline">{isExporting ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
