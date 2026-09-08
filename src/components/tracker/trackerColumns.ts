import { ApplicationSortColumn } from "@/lib/repositories/applicationsRepository";

export interface TrackerColumnDef {
  key: string;
  label: string;
  sortKey?: ApplicationSortColumn;
  align?: "left" | "right" | "center";
  defaultWidth: number;
  minWidth: number;
  maxWidth?: number;
  resizable?: boolean;
}

export const TRACKER_COLUMNS: TrackerColumnDef[] = [
  {
    key: "company",
    label: "Company",
    sortKey: "company_name",
    defaultWidth: 120,
    minWidth: 100,
    maxWidth: 350,
  },
  {
    key: "role",
    label: "Role",
    sortKey: "job_title",
    defaultWidth: 160,
    minWidth: 130,
    maxWidth: 450,
  },
  {
    key: "status",
    label: "Status",
    sortKey: "status",
    defaultWidth: 80,
    minWidth: 80,
    maxWidth: 160,
  },
  {
    key: "location",
    label: "Location",
    sortKey: "location",
    defaultWidth: 110,
    minWidth: 100,
    maxWidth: 260,
  },
  {
    key: "salary",
    label: "Salary",
    sortKey: "salary_min",
    defaultWidth: 120,
    minWidth: 90,
    maxWidth: 220,
  },
  {
    key: "activity",
    label: "Last Activity",
    sortKey: "last_activity_date",
    defaultWidth: 120,
    minWidth: 90,
    maxWidth: 220,
  },
  {
    key: "actions",
    label: "Actions",
    align: "center",
    defaultWidth: 60,
    minWidth: 50,
    maxWidth: 80,
    resizable: false,
  },
];
