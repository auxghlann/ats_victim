import { getDatabase } from "./index";

export function seed() {
  const db = getDatabase();
  console.log("Seeding SQLite database...");

  // 1. Seed Dev User
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, name, avatar_url)
    VALUES (@id, @email, @name, @avatar_url)
  `);

  insertUser.run({
    id: "dev-user-001",
    email: "alex.dev@example.com",
    name: "Alex Dev",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  });

  // 2. Seed Applications
  const applications = [
    {
      id: "app-google-001",
      user_id: "dev-user-001",
      company_name: "Google",
      job_title: "Senior AI Engineer",
      status: "interview",
      location: "Mountain View, CA",
      work_setup: "hybrid",
      salary_min: 195000,
      salary_max: 265000,
      salary_currency: "USD",
      date_applied: "2026-08-15",
      last_activity_date: "2026-09-02",
    },
    {
      id: "app-stripe-002",
      user_id: "dev-user-001",
      company_name: "Stripe",
      job_title: "Full Stack Infrastructure Engineer",
      status: "applied",
      location: "San Francisco, CA",
      work_setup: "remote",
      salary_min: 180000,
      salary_max: 230000,
      salary_currency: "USD",
      date_applied: "2026-08-28",
      last_activity_date: "2026-08-28",
    },
    {
      id: "app-meta-003",
      user_id: "dev-user-001",
      company_name: "Meta",
      job_title: "Production Engineer - ML Systems",
      status: "viewed",
      location: "Menlo Park, CA",
      work_setup: "on-site",
      salary_min: 185000,
      salary_max: 245000,
      salary_currency: "USD",
      date_applied: "2026-08-20",
      last_activity_date: "2026-08-30",
    },
    {
      id: "app-openai-004",
      user_id: "dev-user-001",
      company_name: "OpenAI",
      job_title: "Member of Technical Staff - Applied AI",
      status: "accepted",
      location: "San Francisco, CA",
      work_setup: "hybrid",
      salary_min: 240000,
      salary_max: 330000,
      salary_currency: "USD",
      date_applied: "2026-08-01",
      last_activity_date: "2026-09-01",
    },
    {
      id: "app-netflix-005",
      user_id: "dev-user-001",
      company_name: "Netflix",
      job_title: "Senior Platform Engineer",
      status: "rejected",
      location: "Los Gatos, CA",
      work_setup: "remote",
      salary_min: 200000,
      salary_max: 270000,
      salary_currency: "USD",
      date_applied: "2026-08-10",
      last_activity_date: "2026-08-25",
    },
  ];

  const insertApp = db.prepare(`
    INSERT OR REPLACE INTO applications (
      id, user_id, company_name, job_title, status, location, work_setup,
      salary_min, salary_max, salary_currency, date_applied, last_activity_date
    ) VALUES (
      @id, @user_id, @company_name, @job_title, @status, @location, @work_setup,
      @salary_min, @salary_max, @salary_currency, @date_applied, @last_activity_date
    )
  `);

  for (const app of applications) {
    insertApp.run(app);
  }

  // 3. Seed Application Details
  const applicationDetails = [
    {
      id: "detail-google-001",
      application_id: "app-google-001",
      posting_url: "https://careers.google.com/jobs/results/12345-senior-ai-engineer",
      job_description: `## Role Overview
Join Google's Core AI team building next-generation agentic workflows, model distillation, and production LLM orchestration platforms.

### Responsibilities
- Architect scalable inference pipelines and low-latency serving stacks.
- Partner with research scientists to deploy experimental architectures to billions of users.
- Drive best practices in multi-modal evaluation and retrieval-augmented systems.`,
      notes: "Initial phone screen with recruiter Sarah completed. Technical system design round scheduled for next week with Staff Engineer.",
      timeline: JSON.stringify([
        {
          status: "applied",
          date: "2026-08-15",
          snippet: "Thank you for applying to Google. We have received your application for Senior AI Engineer.",
        },
        {
          status: "viewed",
          date: "2026-08-22",
          snippet: "Your application was reviewed by the engineering hiring team.",
        },
        {
          status: "interview",
          date: "2026-09-02",
          snippet: "We would like to invite you for a 60-minute technical interview.",
        },
      ]),
    },
    {
      id: "detail-stripe-002",
      application_id: "app-stripe-002",
      posting_url: "https://stripe.com/jobs/listings/full-stack-infra",
      job_description: `## About Stripe
Stripe builds economic infrastructure for the internet. Millions of companies use Stripe's software to accept payments and manage business online.

### Qualifications
- Experience shipping high-reliability distributed systems.
- Strong proficiency in TypeScript, Go, or Ruby.`,
      notes: "Submitted application via employee referral from David.",
      timeline: JSON.stringify([
        {
          status: "applied",
          date: "2026-08-28",
          snippet: "Your application for Full Stack Infrastructure Engineer has been submitted.",
        },
      ]),
    },
    {
      id: "detail-meta-003",
      application_id: "app-meta-003",
      posting_url: "https://www.metacareers.com/jobs/production-engineer-ml",
      job_description: `## About the Team
Meta's Production Engineering team blends software and systems engineering to build massive planetary-scale infrastructure.`,
      notes: "Recruiter viewed LinkedIn profile after application.",
      timeline: JSON.stringify([
        {
          status: "applied",
          date: "2026-08-20",
          snippet: "Application submitted.",
        },
        {
          status: "viewed",
          date: "2026-08-30",
          snippet: "Application viewed by Meta recruiting.",
        },
      ]),
    },
    {
      id: "detail-openai-004",
      application_id: "app-openai-004",
      posting_url: "https://openai.com/careers/applied-ai-mts",
      job_description: `## Mission
Our mission is to ensure that artificial general intelligence benefits all of humanity.`,
      notes: "Final offer letter received and reviewed. Signing by September 8th.",
      timeline: JSON.stringify([
        {
          status: "applied",
          date: "2026-08-01",
          snippet: "Application submitted.",
        },
        {
          status: "interview",
          date: "2026-08-14",
          snippet: "Invited to onsite rounds.",
        },
        {
          status: "accepted",
          date: "2026-09-01",
          snippet: "Formal offer extended and accepted!",
        },
      ]),
    },
    {
      id: "detail-netflix-005",
      application_id: "app-netflix-005",
      posting_url: "https://jobs.netflix.com/jobs/platform-eng",
      job_description: `## Freedom and Responsibility
Netflix offers candid feedback, high context with low control, and stunning colleagues.`,
      notes: "Position closed internally.",
      timeline: JSON.stringify([
        {
          status: "applied",
          date: "2026-08-10",
          snippet: "Application submitted.",
        },
        {
          status: "rejected",
          date: "2026-08-25",
          snippet: "We decided to proceed with internal candidates.",
        },
      ]),
    },
  ];

  const insertDetail = db.prepare(`
    INSERT OR REPLACE INTO application_details (
      id, application_id, posting_url, job_description, notes, timeline
    ) VALUES (
      @id, @application_id, @posting_url, @job_description, @notes, @timeline
    )
  `);

  for (const detail of applicationDetails) {
    insertDetail.run(detail);
  }

  // 4. Seed Tasks
  const tasks = [
    {
      id: "task-001",
      user_id: "dev-user-001",
      application_id: "app-google-001",
      title: "Prepare system design architecture notes for Google round",
      due_date: "2026-09-10",
      completed: 0,
      priority: "high",
    },
    {
      id: "task-002",
      user_id: "dev-user-001",
      application_id: "app-stripe-002",
      title: "Send follow-up note to David regarding Stripe referral",
      due_date: "2026-09-12",
      completed: 0,
      priority: "medium",
    },
    {
      id: "task-003",
      user_id: "dev-user-001",
      application_id: "app-openai-004",
      title: "Review OpenAI compensation breakdown and health benefits",
      due_date: "2026-09-08",
      completed: 0,
      priority: "high",
    },
  ];

  const insertTask = db.prepare(`
    INSERT OR REPLACE INTO tasks (
      id, user_id, application_id, title, due_date, completed, priority
    ) VALUES (
      @id, @user_id, @application_id, @title, @due_date, @completed, @priority
    )
  `);

  for (const task of tasks) {
    insertTask.run(task);
  }

  // 5. Seed Interviews
  const interviews = [
    {
      id: "interview-001",
      user_id: "dev-user-001",
      application_id: "app-google-001",
      round_name: "Technical Screen - System Design",
      scheduled_at: "2026-09-10T14:00:00Z",
      meeting_link: "https://meet.google.com/abc-defg-hij",
      notes: "Focus on distributed model serving and token streaming.",
    },
    {
      id: "interview-002",
      user_id: "dev-user-001",
      application_id: "app-meta-003",
      round_name: "Recruiter Phone Screen",
      scheduled_at: "2026-09-15T16:30:00Z",
      meeting_link: "https://meet.google.com/xyz-uvw-rst",
      notes: "Discuss team matching and location preferences.",
    },
  ];

  const insertInterview = db.prepare(`
    INSERT OR REPLACE INTO interviews (
      id, user_id, application_id, round_name, scheduled_at, meeting_link, notes
    ) VALUES (
      @id, @user_id, @application_id, @round_name, @scheduled_at, @meeting_link, @notes
    )
  `);

  for (const interview of interviews) {
    insertInterview.run(interview);
  }

  console.log("Database seeded successfully with 5 applications, 3 tasks, and 2 interviews.");
}

// Allow direct CLI execution: `npx tsx src/lib/db/seed.ts`
if (require.main === module) {
  seed();
}
