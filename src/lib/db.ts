/**
 * Слой данных: SQLite через встроенный node:sqlite (Node 22.5+, без зависимостей).
 * Файл БД: <проект>/data/novahub.db (игнорируется git).
 */
import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import {
  courses as seedCourses,
  hackathons as seedHackathons,
  events as seedEvents,
  type Course,
  type Hackathon,
  type EventItem,
} from "./data";
import { computeXp } from "./xp";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "novahub.db");

let db: DatabaseSync | null = null;

/** Доступ к БД (ленивая инициализация + сид при первом запуске) */
export function getDb(): DatabaseSync {
  if (db) return db;
  mkdirSync(DATA_DIR, { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  migrate(db);
  seedIfEmpty(db);
  return db;
}

function migrate(d: DatabaseSync) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tg_id TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      is_admin INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category_id TEXT NOT NULL,
      level TEXT NOT NULL,
      weeks INTEGER NOT NULL,
      format TEXT NOT NULL,
      price INTEGER NOT NULL DEFAULT 0,
      students INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 4.5,
      tag TEXT,
      short TEXT NOT NULL,
      description TEXT NOT NULL,
      instructor_name TEXT NOT NULL,
      instructor_role TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      seats_total INTEGER NOT NULL DEFAULT 100,
      seats_taken INTEGER NOT NULL DEFAULT 0,
      syllabus TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS hackathons (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      theme TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      ends_at TEXT NOT NULL,
      location TEXT NOT NULL,
      online INTEGER NOT NULL DEFAULT 0,
      prize_pool INTEGER NOT NULL DEFAULT 0,
      seats_total INTEGER NOT NULL DEFAULT 100,
      seats_taken INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      tracks TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      kind TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      location TEXT NOT NULL,
      free INTEGER NOT NULL DEFAULT 1,
      description TEXT NOT NULL,
      speaker TEXT
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS progress (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      lesson_index INTEGER NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, course_id, lesson_index)
    );
  `);
}

/* ================= Сид ================= */

function seedIfEmpty(d: DatabaseSync) {
  const { n } = d.prepare("SELECT COUNT(*) AS n FROM courses").get() as { n: number };
  if (n > 0) return;

  const insCourse = d.prepare(`
    INSERT INTO courses (id, title, category_id, level, weeks, format, price, students,
      rating, tag, short, description, instructor_name, instructor_role, starts_at,
      seats_total, seats_taken, syllabus)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of seedCourses) {
    insCourse.run(
      c.id, c.title, c.categoryId, c.level, c.weeks, c.format, c.price, c.students,
      c.rating, c.tag ?? null, c.short, c.description, c.instructor.name,
      c.instructor.role, c.startsAt, c.seatsTotal, c.seatsTaken, JSON.stringify(c.syllabus)
    );
  }

  const insHack = d.prepare(`
    INSERT INTO hackathons (id, title, theme, starts_at, ends_at, location, online,
      prize_pool, seats_total, seats_taken, description, tracks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const h of seedHackathons) {
    insHack.run(
      h.id, h.title, h.theme, h.startsAt, h.endsAt, h.location, h.online ? 1 : 0,
      h.prizePool, h.seatsTotal, h.seatsTaken, h.description, JSON.stringify(h.tracks)
    );
  }

  const insEvent = d.prepare(`
    INSERT INTO events (id, title, kind, starts_at, location, free, description, speaker)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const e of seedEvents) {
    insEvent.run(
      e.id, e.title, e.kind, e.startsAt, e.location, e.free ? 1 : 0,
      e.description, e.speaker ?? null
    );
  }
}

/* ================= Типы ================= */

export interface CourseRow {
  id: string;
  title: string;
  category_id: string;
  level: string;
  weeks: number;
  format: string;
  price: number;
  students: number;
  rating: number;
  tag: string | null;
  short: string;
  description: string;
  instructor_name: string;
  instructor_role: string;
  starts_at: string;
  seats_total: number;
  seats_taken: number;
  syllabus: string;
}

export interface HackathonRow {
  id: string;
  title: string;
  theme: string;
  starts_at: string;
  ends_at: string;
  location: string;
  online: number;
  prize_pool: number;
  seats_total: number;
  seats_taken: number;
  description: string;
  tracks: string;
}

export interface EventRow {
  id: string;
  title: string;
  kind: string;
  starts_at: string;
  location: string;
  free: number;
  description: string;
  speaker: string | null;
}

export interface UserRow {
  id: number;
  tg_id: string | null;
  name: string;
  email: string | null;
  is_admin: number;
  created_at: string;
}

/** Преобразование строки БД в объект курса (формат src/lib/data.ts) */
export function rowToCourse(r: CourseRow) {
  return {
    id: r.id,
    title: r.title,
    categoryId: r.category_id as Course["categoryId"],
    level: r.level as Course["level"],
    weeks: r.weeks,
    format: r.format as Course["format"],
    price: r.price,
    students: r.students,
    rating: r.rating,
    tag: r.tag ?? undefined,
    short: r.short,
    description: r.description,
    instructor: { name: r.instructor_name, role: r.instructor_role },
    syllabus: JSON.parse(r.syllabus) as string[],
    startsAt: r.starts_at,
    seatsTotal: r.seats_total,
    seatsTaken: r.seats_taken,
  } as Course;
}

export function rowToHackathon(r: HackathonRow) {
  return {
    id: r.id,
    title: r.title,
    theme: r.theme,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
    location: r.location,
    online: Boolean(r.online),
    prizePool: r.prize_pool,
    seatsTotal: r.seats_total,
    seatsTaken: r.seats_taken,
    description: r.description,
    tracks: JSON.parse(r.tracks) as string[],
  } as Hackathon;
}

export function rowToEvent(r: EventRow) {
  return {
    id: r.id,
    title: r.title,
    kind: r.kind as EventItem["kind"],
    startsAt: r.starts_at,
    location: r.location,
    free: Boolean(r.free),
    description: r.description,
    speaker: r.speaker ?? undefined,
  } as EventItem;
}

/* ================= Запросы: чтение ================= */

export function listCourses() {
  return (getDb().prepare("SELECT * FROM courses ORDER BY starts_at ASC").all() as unknown as CourseRow[]).map(rowToCourse);
}

export function courseById(id: string) {
  const r = getDb().prepare("SELECT * FROM courses WHERE id = ?").get(id) as CourseRow | undefined;
  return r ? rowToCourse(r) : undefined;
}

export function listHackathons() {
  return (getDb().prepare("SELECT * FROM hackathons ORDER BY starts_at ASC").all() as unknown as HackathonRow[]).map(rowToHackathon);
}

export function hackathonById(id: string) {
  const r = getDb().prepare("SELECT * FROM hackathons WHERE id = ?").get(id) as HackathonRow | undefined;
  return r ? rowToHackathon(r) : undefined;
}

export function listEvents() {
  return (getDb().prepare("SELECT * FROM events ORDER BY starts_at ASC").all() as unknown as EventRow[]).map(rowToEvent);
}

/* ================= Пользователи и запись ================= */

export function findUserByEmail(email: string) {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
}

export function findUserByTgId(tgId: string) {
  return getDb().prepare("SELECT * FROM users WHERE tg_id = ?").get(tgId) as UserRow | undefined;
}

export function userById(id: number) {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
}

export function upsertUser(opts: { name: string; email: string | null; tgId?: string | null; isAdmin?: boolean }): UserRow {
  const d = getDb();
  const existing =
    (opts.tgId ? findUserByTgId(opts.tgId) : undefined) ??
    (opts.email ? findUserByEmail(opts.email) : undefined);

  if (existing) {
    d.prepare(
      "UPDATE users SET name = ?, email = COALESCE(?, email), is_admin = MAX(is_admin, ?) WHERE id = ?"
    ).run(opts.name, opts.email ?? null, opts.isAdmin ? 1 : 0, existing.id);
    return userById(existing.id)!;
  }

  const res = d
    .prepare("INSERT INTO users (tg_id, name, email, is_admin) VALUES (?, ?, ?, ?)")
    .run(opts.tgId ?? null, opts.name, opts.email ?? null, opts.isAdmin ? 1 : 0);
  return userById(Number(res.lastInsertRowid))!;
}

export function enrollUser(userId: number, courseId: string) {
  const d = getDb();
  const res = d.prepare("INSERT OR IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)").run(userId, courseId);
  // Увеличиваем занятые места только если запись реально добавилась
  if (Number(res.changes) > 0) {
    d.prepare("UPDATE courses SET seats_taken = MIN(seats_taken + 1, seats_total) WHERE id = ?").run(courseId);
  }
}

export function enrolledCourses(userId: number) {
  const rows = getDb()
    .prepare(
      `SELECT c.* FROM courses c
       JOIN enrollments e ON e.course_id = c.id
       WHERE e.user_id = ?
       ORDER BY c.starts_at ASC`
    )
    .all(userId) as unknown as CourseRow[];
  return rows.map(rowToCourse);
}

export function isEnrolled(userId: number, courseId: string) {
  const r = getDb()
    .prepare("SELECT 1 AS x FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId);
  return Boolean(r);
}

/* ================= Прогресс обучения, XP, лидерборд ================= */

export interface CourseProgress {
  total: number;
  completed: number[]; // индексы пройденных уроков
  pct: number; // 0..100
  done: boolean; // все уроки пройдены
}

/** Отметить урок пройденным (только для записанных, индекс в пределах программы). */
export function completeLesson(userId: number, courseId: string, lessonIndex: number): CourseProgress | null {
  const course = courseById(courseId);
  if (!course || !isEnrolled(userId, courseId)) return null;
  if (lessonIndex < 0 || lessonIndex >= course.syllabus.length) return null;
  getDb()
    .prepare("INSERT OR IGNORE INTO progress (user_id, course_id, lesson_index) VALUES (?, ?, ?)")
    .run(userId, courseId, lessonIndex);
  return courseProgress(userId, courseId);
}

/** Прогресс пользователя по курсу (null, если не записан). */
export function courseProgress(userId: number, courseId: string): CourseProgress | null {
  const course = courseById(courseId);
  if (!course || !isEnrolled(userId, courseId)) return null;
  const rows = getDb()
    .prepare("SELECT lesson_index FROM progress WHERE user_id = ? AND course_id = ?")
    .all(userId, courseId) as { lesson_index: number }[];
  const completed = rows.map((r) => r.lesson_index).sort((a, b) => a - b);
  const total = course.syllabus.length;
  return {
    total,
    completed,
    pct: total ? Math.min(100, Math.round((completed.length / total) * 100)) : 0,
    done: total > 0 && completed.length >= total,
  };
}

/** Прогресс по всем записанным курсам пользователя. */
export function userProgressMap(userId: number): Map<string, CourseProgress> {
  const courses = enrolledCourses(userId);
  const rows = getDb()
    .prepare("SELECT course_id, lesson_index FROM progress WHERE user_id = ?")
    .all(userId) as { course_id: string; lesson_index: number }[];
  const byCourse = new Map<string, number[]>();
  for (const r of rows) {
    const arr = byCourse.get(r.course_id) ?? [];
    arr.push(r.lesson_index);
    byCourse.set(r.course_id, arr);
  }
  const map = new Map<string, CourseProgress>();
  for (const c of courses) {
    const completed = (byCourse.get(c.id) ?? []).sort((a, b) => a - b);
    const total = c.syllabus.length;
    map.set(c.id, {
      total,
      completed,
      pct: total ? Math.min(100, Math.round((completed.length / total) * 100)) : 0,
      done: total > 0 && completed.length >= total,
    });
  }
  return map;
}

/** Статистика для расчёта XP: сколько модулей и целых курсов пройдено. */
export function userXpStats(userId: number): { lessons: number; courses: number } {
  const lessons =
    (getDb().prepare("SELECT COUNT(*) AS n FROM progress WHERE user_id = ?").get(userId) as { n: number }).n;
  let courses = 0;
  for (const p of userProgressMap(userId).values()) if (p.done) courses++;
  return { lessons, courses };
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  xp: number;
  levelTitle: string;
  levelIndex: number;
  coursesCompleted: number;
}

/** Топ по XP (регистрация + модули + пройденные курсы). */
export function leaderboard(limit = 10): LeaderboardEntry[] {
  const users = getDb()
    .prepare("SELECT id, name FROM users ORDER BY name ASC")
    .all() as { id: number; name: string }[];
  return users
    .map((u) => {
      const stats = userXpStats(u.id);
      const xp = computeXp(stats);
      return {
        id: u.id,
        name: u.name,
        xp: xp.xp,
        levelTitle: xp.levelTitle,
        levelIndex: xp.levelIndex,
        coursesCompleted: stats.courses,
      };
    })
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name, "ru"))
    .slice(0, limit);
}

/** Детерминированный код верификации сертификата, напр. NVH-2026-8F3KQ2 */
export function certificateCode(userId: number, courseId: string): string {
  const h = createHash("sha256")
    .update(`novahub:${userId}:${courseId}`)
    .digest("base64url")
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 6);
  return `NVH-${new Date().getFullYear()}-${h}`;
}

/* ================= Админка: запись и удаление ================= */


type CourseInput = Omit<Course, "id"> & { id?: string };

export function saveCourse(input: CourseInput): string {
  const d = getDb();
  const id = input.id ?? slugify(input.title);
  if (input.id) {
    d.prepare(`
      UPDATE courses SET title = ?, category_id = ?, level = ?, weeks = ?, format = ?, price = ?,
        students = ?, rating = ?, tag = ?, short = ?, description = ?, instructor_name = ?,
        instructor_role = ?, starts_at = ?, seats_total = ?, seats_taken = ?, syllabus = ?
      WHERE id = ?
    `).run(
      input.title, input.categoryId, input.level, input.weeks, input.format, input.price,
      input.students, input.rating, input.tag ?? null, input.short, input.description,
      input.instructor.name, input.instructor.role, input.startsAt,
      input.seatsTotal, input.seatsTaken, JSON.stringify(input.syllabus), input.id
    );
    return input.id;
  }
  d.prepare(`
    INSERT INTO courses (id, title, category_id, level, weeks, format, price, students,
      rating, tag, short, description, instructor_name, instructor_role, starts_at,
      seats_total, seats_taken, syllabus)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, input.title, input.categoryId, input.level, input.weeks, input.format, input.price,
    input.students, input.rating, input.tag ?? null, input.short, input.description,
    input.instructor.name, input.instructor.role, input.startsAt,
    input.seatsTotal, input.seatsTaken, JSON.stringify(input.syllabus)
  );
  return id;
}

export function deleteCourse(id: string) {
  const d = getDb();
  d.prepare("DELETE FROM enrollments WHERE course_id = ?").run(id);
  d.prepare("DELETE FROM courses WHERE id = ?").run(id);
}

type HackathonInput = Omit<Hackathon, "id"> & { id?: string };

export function saveHackathon(input: HackathonInput): string {
  const d = getDb();
  const id = input.id ?? slugify(input.title);
  if (input.id) {
    d.prepare(`
      UPDATE hackathons SET title = ?, theme = ?, starts_at = ?, ends_at = ?, location = ?,
        online = ?, prize_pool = ?, seats_total = ?, seats_taken = ?, description = ?, tracks = ?
      WHERE id = ?
    `).run(
      input.title, input.theme, input.startsAt, input.endsAt, input.location,
      input.online ? 1 : 0, input.prizePool, input.seatsTotal, input.seatsTaken,
      input.description, JSON.stringify(input.tracks), input.id
    );
    return input.id;
  }
  d.prepare(`
    INSERT INTO hackathons (id, title, theme, starts_at, ends_at, location, online,
      prize_pool, seats_total, seats_taken, description, tracks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, input.title, input.theme, input.startsAt, input.endsAt, input.location,
    input.online ? 1 : 0, input.prizePool, input.seatsTotal, input.seatsTaken,
    input.description, JSON.stringify(input.tracks)
  );
  return id;
}

export function deleteHackathon(id: string) {
  getDb().prepare("DELETE FROM hackathons WHERE id = ?").run(id);
}

type EventInput = Omit<EventItem, "id"> & { id?: string };

export function saveEvent(input: EventInput): string {
  const d = getDb();
  const id = input.id ?? slugify(input.title);
  if (input.id) {
    d.prepare(`
      UPDATE events SET title = ?, kind = ?, starts_at = ?, location = ?, free = ?, description = ?, speaker = ?
      WHERE id = ?
    `).run(
      input.title, input.kind, input.startsAt, input.location,
      input.free ? 1 : 0, input.description, input.speaker ?? null, input.id
    );
    return input.id;
  }
  d.prepare(`
    INSERT INTO events (id, title, kind, starts_at, location, free, description, speaker)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, input.title, input.kind, input.startsAt, input.location,
    input.free ? 1 : 0, input.description, input.speaker ?? null
  );
  return id;
}

export function deleteEvent(id: string) {
  getDb().prepare("DELETE FROM events WHERE id = ?").run(id);
}

/** Простой slug из названия (латиница/цифры/дефис) */
function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const unique = Date.now().toString(36);
  return base ? `${base}-${unique}` : `item-${unique}`;
}
