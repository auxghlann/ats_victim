import { Application } from "@/types/database";

/**
 * Escapes a cell value according to RFC 4180 specifications:
 * - Wrap in quotes if it contains commas, double quotes, or newlines.
 * - Escape internal double quotes by doubling them (" -> "").
 */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const raw = String(value);
  const str = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export interface DownloadCsvOptions {
  filename: string;
  headers: string[];
  rows: (string | number | null | undefined)[][];
}

/**
 * Formats headers and rows into an RFC 4180 CSV payload.
 */
export function buildCsvContent(
  headers: string[],
  rows: (string | number | null | undefined)[][]
): string {
  const headerLine = headers.map(escapeCsvCell).join(",");
  const rowLines = rows.map((row) => row.map(escapeCsvCell).join(","));
  return [headerLine, ...rowLines].join("\r\n");
}

/**
 * Generates and triggers browser download of a CSV file using native Blob and Object URLs.
 */
export function downloadCsv({ filename, headers, rows }: DownloadCsvOptions): void {
  const csvContent = buildCsvContent(headers, rows);

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Formats a list of applications and triggers client CSV file download.
 */
export function exportApplicationsToCsv(applications: Application[]): void {
  const headers = [
    "Company",
    "Role",
    "Status",
    "Location",
    "Work Setup",
    "Currency",
    "Salary Min",
    "Salary Max",
    "Date Applied",
    "Last Activity",
  ];

  const rows = applications.map((app) => [
    app.company_name,
    app.job_title,
    app.status,
    app.location || "",
    app.work_setup || "",
    app.salary_currency || "PHP",
    app.salary_min ?? "",
    app.salary_max ?? "",
    app.date_applied ?? "",
    app.last_activity_date ?? "",
  ]);

  const dateStr = new Date().toISOString().split("T")[0];
  downloadCsv({
    filename: `applications_export_${dateStr}.csv`,
    headers,
    rows,
  });
}
