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

  // Generate smart pagination page numbers with ellipsis windowing
  const pageNumbers = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    pages.add(page);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);

    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: (number | "...")[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        result.push("...");
      }
      result.push(sorted[i]);
    }
    return result;
  })();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-3.5 bg-surface border-t border-outline-variant/30 text-xs text-on-surface-variant">
      <div className="text-center sm:text-left">
        <span className="hidden sm:inline">
          Showing <span className="font-bold text-on-surface">{startItem}</span> to{" "}
          <span className="font-bold text-on-surface">{endItem}</span> of{" "}
          <span className="font-bold text-on-surface">{total}</span> applications
        </span>
        <span className="sm:hidden font-medium">
          <span className="font-bold text-on-surface">{startItem}&ndash;{endItem}</span> of{" "}
          <span className="font-bold text-on-surface">{total}</span>
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="w-8 h-8 rounded-lg border border-outline-variant/40 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none hover:bg-surface-container transition-colors cursor-pointer text-on-surface"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {/* Desktop Page Numbers with ellipsis windowing */}
        <div className="hidden sm:flex items-center gap-1.5">
          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-on-surface-variant/60"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p as number)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  page === p
                    ? "bg-primary text-on-primary shadow-xs"
                    : "border border-outline-variant/40 hover:bg-surface-container text-on-surface"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Mobile Compact Page Indicator */}
        <span className="sm:hidden px-2.5 py-1 text-xs font-semibold text-on-surface">
          Page {page} of {totalPages}
        </span>

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
