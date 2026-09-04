import { getDatabase } from "@/lib/db";
import { Application, ApplicationStatus } from "@/types/database";

export interface ListApplicationsOptions {
  search?: string;
  status?: string;
  sortBy?: "company_name" | "status" | "last_activity_date" | "date_applied";
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
    sortBy = "last_activity_date",
    sortOrder = "desc",
    page = 1,
    pageSize = 50,
  } = options;

  const conditions: string[] = ["user_id = ?"];
  const params: (string | number)[] = [userId];

  if (status && status !== "all") {
    conditions.push("status = ?");
    params.push(status);
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

  const allowedSortColumns = ["company_name", "status", "last_activity_date", "date_applied"];
  const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "last_activity_date";
  const safeSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

  const offset = (page - 1) * pageSize;
  const querySql = `
    SELECT * FROM applications 
    WHERE ${whereClause} 
    ORDER BY ${safeSortBy} ${safeSortOrder} 
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
      id, user_id, company_name, job_title, status, location,
      salary_min, salary_max, salary_currency, date_applied, last_activity_date,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
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

export const applicationsRepository = {
  listApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getStatusCounts,
};
