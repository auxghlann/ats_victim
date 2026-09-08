import { getDatabase } from "@/lib/db";
import { Application, ApplicationStatus } from "@/types/database";

export type ApplicationSortColumn =
  | "company_name"
  | "job_title"
  | "status"
  | "location"
  | "salary_min"
  | "last_activity_date"
  | "date_applied";

export interface ListApplicationsOptions {
  search?: string;
  status?: string;
  workSetup?: string;
  sortBy?: ApplicationSortColumn;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export function listApplications(
  userId: string,
  options: ListApplicationsOptions = {}
): { items: Application[]; total: number } {
  const db = getDatabase();
  const {
    search,
    status,
    workSetup,
    sortBy = "last_activity_date",
    sortOrder = "desc",
    page = 1,
    pageSize = 10,
  } = options;

  const conditions: string[] = ["user_id = ?"];
  const params: (string | number)[] = [userId];

  if (status && status !== "all") {
    conditions.push("status = ?");
    params.push(status);
  }

  if (workSetup && workSetup !== "all") {
    conditions.push("work_setup = ?");
    params.push(workSetup);
  }

  if (search && search.trim() !== "") {
    conditions.push("(company_name LIKE ? OR job_title LIKE ? OR location LIKE ?)");
    const searchPattern = `%${search.trim()}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  const whereClause = conditions.join(" AND ");

  const countSql = `SELECT COUNT(*) as total FROM applications WHERE ${whereClause}`;
  const totalResult = db.prepare(countSql).get(...params) as { total: number };
  const total = totalResult ? totalResult.total : 0;

  const allowedSortColumns: Record<ApplicationSortColumn, string> = {
    company_name: "company_name COLLATE NOCASE",
    job_title: "job_title COLLATE NOCASE",
    status: "status",
    location: "location COLLATE NOCASE",
    salary_min: "salary_min",
    last_activity_date: "COALESCE(last_activity_date, date_applied)",
    date_applied: "date_applied",
  };

  const safeSortColumn =
    sortBy && sortBy in allowedSortColumns
      ? allowedSortColumns[sortBy]
      : "COALESCE(last_activity_date, date_applied)";
  const safeSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

  const offset = (page - 1) * pageSize;
  const querySql = `
    SELECT * FROM applications 
    WHERE ${whereClause} 
    ORDER BY ${safeSortColumn} ${safeSortOrder} 
    LIMIT ? OFFSET ?
  `;

  const items = db.prepare(querySql).all(...params, pageSize, offset) as Application[];
  return { items, total };
}

export function getApplicationById(userId: string, id: string): Application | null {
  const query = `SELECT * FROM applications WHERE user_id = ? AND id = ?`;
  return (getDatabase().prepare(query).get(userId, id) as Application) || null;
}

export function createApplication(
  userId: string,
  data: {
    company_name: string;
    job_title: string;
    status?: ApplicationStatus;
    location?: string | null;
    work_setup?: import("@/types/database").WorkSetup | null;
    salary_min?: number | null;
    salary_max?: number | null;
    salary_currency?: string;
    date_applied?: string | null;
  }
): Application {
  const db = getDatabase();
  const id = `app-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const dateApplied = data.date_applied || now.split("T")[0];
  const status = data.status || "applied";

  const insertSql = `
    INSERT INTO applications (
      id, user_id, company_name, job_title, status, location, work_setup,
      salary_min, salary_max, salary_currency, date_applied, last_activity_date,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?
    ) RETURNING *
  `;

  return db
    .prepare(insertSql)
    .get(
      id,
      userId,
      data.company_name,
      data.job_title,
      status,
      data.location || null,
      data.work_setup || null,
      data.salary_min || null,
      data.salary_max || null,
      data.salary_currency || "USD",
      dateApplied,
      dateApplied,
      now,
      now
    ) as Application;
}

export function updateApplication(
  userId: string,
  id: string,
  updates: Partial<Application>
): Application | null {
  const db = getDatabase();
  const fields: string[] = [];
  const params: (string | number | null)[] = [];

  const allowedFields: (keyof Application)[] = [
    "company_name",
    "job_title",
    "status",
    "location",
    "work_setup",
    "salary_min",
    "salary_max",
    "salary_currency",
    "date_applied",
    "last_activity_date",
  ];

  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(updates[key] ?? null);
    }
  }

  if (fields.length === 0) return getApplicationById(userId, id);

  fields.push("updated_at = ?");
  params.push(new Date().toISOString());
  params.push(userId, id);

  const updateSql = `
    UPDATE applications 
    SET ${fields.join(", ")} 
    WHERE user_id = ? AND id = ?
    RETURNING *
  `;

  return (db.prepare(updateSql).get(...params) as Application) || null;
}

export function deleteApplication(userId: string, id: string): boolean {
  const deleteSql = `DELETE FROM applications WHERE user_id = ? AND id = ?`;
  const result = getDatabase().prepare(deleteSql).run(userId, id);
  return result.changes > 0;
}

export function getStatusCounts(userId: string): Record<string, number> {
  const query = `
    SELECT status, COUNT(*) as count 
    FROM applications 
    WHERE user_id = ? 
    GROUP BY status
  `;
  const rows = getDatabase().prepare(query).all(userId) as { status: string; count: number }[];

  const counts: Record<string, number> = {
    all: 0,
    applied: 0,
    viewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  };

  let total = 0;
  for (const row of rows) {
    counts[row.status] = row.count;
    total += row.count;
  }
  counts.all = total;

  return counts;
}

export function getActivityCountByDate(userId: string, dateStr: string): number {
  const sql = `
    SELECT COUNT(*) as count 
    FROM applications 
    WHERE user_id = ? AND (date_applied = ? OR last_activity_date = ?)
  `;
  const row = getDatabase().prepare(sql).get(userId, dateStr, dateStr) as { count: number } | undefined;
  return row ? row.count : 0;
}

export const applicationsRepository = {
  listApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getStatusCounts,
  getActivityCountByDate,
};
