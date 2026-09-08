interface TrackerPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TrackerPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: TrackerPaginationProps) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-surface border-t border-outline-variant/30 text-xs text-on-surface-variant">
      <div>
        Showing <span className="font-bold text-on-surface">{startItem}</span> to{" "}
        <span className="font-bold text-on-surface">{endItem}</span> of{" "}
        <span className="font-bold text-on-surface">{total}</span> applications
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 rounded-lg border border-outline-variant/40 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none hover:bg-surface-container transition-colors cursor-pointer text-on-surface"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              page === p
                ? "bg-primary text-on-primary shadow-xs"
                : "border border-outline-variant/40 hover:bg-surface-container text-on-surface"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-8 h-8 rounded-lg border border-outline-variant/40 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none hover:bg-surface-container transition-colors cursor-pointer text-on-surface"
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
