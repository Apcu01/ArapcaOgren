import { sql } from 'drizzle-orm';
import {
  bigint, boolean, char, customType, datetime, double, index, int, json, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar
} from 'drizzle-orm/mysql-core';
import type { Item, LookupResult, Mistake, Question, ReportContext, Section, Word } from '@/lib/types';

// Ses dosyaları veritabanında saklanır (her barındırmada çalışsın, ayrı dosya depolaması gerekmesin)
const mediumBlob = customType<{ data: Buffer }>({ dataType: () => 'mediumblob' });

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 80 }).notNull(),
  email: varchar('email', { length: 190 }).notNull().unique(),
  // Yalnızca Google ile giriş yapan hesaplarda şifre olmayabilir
  passwordHash: varchar('password_hash', { length: 100 }),
  googleSub: varchar('google_sub', { length: 64 }).unique(),
  role: mysqlEnum('role', ['user', 'admin']).notNull().default('user'),
  lastTopic: varchar('last_topic', { length: 64 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at')
});

export const sessions = mysqlTable('sessions', {
  // Çerezdeki rastgele belirtecin SHA-256 özeti; belirtecin kendisi saklanmaz
  id: char('id', { length: 64 }).primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: datetime('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
}, (t) => [index('sessions_user_idx').on(t.userId)]);

export const topics = mysqlTable('topics', {
  id: varchar('id', { length: 64 }).primaryKey(),
  n: int('n').notNull().default(0),
  level: varchar('level', { length: 20 }).notNull().default('Başlangıç'),
  glyph: varchar('glyph', { length: 32 }).notNull().default(''),
  ar: varchar('ar', { length: 191 }).notNull().default(''),
  name: varchar('name', { length: 191 }).notNull(),
  description: text('description').notNull(),
  long: text('long'),
  tags: text('tags'),
  readMins: int('read_mins').notNull().default(10),
  intro: text('intro').notNull(),
  lesson: json('lesson').$type<Section[]>().notNull(),
  keyPoints: json('key_points').$type<string[]>().notNull(),
  mistakes: json('mistakes').$type<Mistake[]>().notNull(),
  words: json('words').$type<Word[]>().notNull(),
  summaryNarr: text('summary_narr'),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
});

export const activities = mysqlTable('activities', {
  id: int('id').autoincrement().primaryKey(),
  topicId: varchar('topic_id', { length: 64 }).notNull().references(() => topics.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  position: int('position').notNull().default(0),
  type: varchar('type', { length: 16 }).notNull(),
  mode: varchar('mode', { length: 8 }),
  title: varchar('title', { length: 191 }).notNull(),
  description: text('description').notNull(),
  glyph: varchar('glyph', { length: 64 }).notNull().default(''),
  keepOrder: boolean('keep_order').notNull().default(false),
  items: json('items').$type<Item[] | null>(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
}, (t) => [index('activities_topic_idx').on(t.topicId, t.position)]);

export const topicProgress = mysqlTable('topic_progress', {
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  topicId: varchar('topic_id', { length: 64 }).notNull(),
  lessonRead: boolean('lesson_read').notNull().default(false),
  readAt: timestamp('read_at').notNull().defaultNow()
}, (t) => [primaryKey({ columns: [t.userId, t.topicId] })]);

export const activityProgress = mysqlTable('activity_progress', {
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  topicId: varchar('topic_id', { length: 64 }).notNull(),
  actKey: varchar('act_key', { length: 64 }).notNull(),
  best: double('best').notNull().default(0),
  last: double('last').notNull().default(0),
  done: boolean('done').notNull().default(false),
  tries: int('tries').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
}, (t) => [primaryKey({ columns: [t.userId, t.topicId, t.actKey] })]);

export const studyDays = mysqlTable('study_days', {
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  day: char('day', { length: 10 }).notNull(),
  // O gün okunan ders ve bitirilen etkinlik sayısı (çalışma takvimi için)
  n: int('n').notNull().default(1)
}, (t) => [primaryKey({ columns: [t.userId, t.day] })]);

// Site istatistikleri: sayfa görüntüleme, ders okuma ve etkinlik bitirme (misafirler dahil)
export const events = mysqlTable('events', {
  id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
  type: varchar('type', { length: 16 }).notNull(),
  userId: int('user_id'),
  anonId: varchar('anon_id', { length: 64 }),
  path: varchar('path', { length: 255 }),
  topicId: varchar('topic_id', { length: 64 }),
  actKey: varchar('act_key', { length: 64 }),
  score: double('score'),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (t) => [index('events_created_idx').on(t.createdAt), index('events_type_idx').on(t.type, t.createdAt)]);


// Kullanıcının yanlış yaptığı sorular ("Hatalarım"); soru, oynatılabilir biçimde saklanır
export const mistakes = mysqlTable('mistakes', {
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  mkey: varchar('mkey', { length: 64 }).notNull(),
  topicId: varchar('topic_id', { length: 64 }).notNull(),
  question: json('question').$type<Question>().notNull(),
  count: int('count').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
}, (t) => [primaryKey({ columns: [t.userId, t.mkey] })]);

// Soru bazında toplu istatistik (misafirler dahil)
export const questionStats = mysqlTable('question_stats', {
  topicId: varchar('topic_id', { length: 64 }).notNull(),
  actKey: varchar('act_key', { length: 64 }).notNull(),
  qkey: varchar('qkey', { length: 64 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  attempts: int('attempts').notNull().default(0),
  correct: int('correct').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
}, (t) => [primaryKey({ columns: [t.topicId, t.actKey, t.qkey] })]);

// Yönetim panelinden yüklenen ya da kaydedilen sesler; Arapça metnin harekesiz biçimiyle eşleşir
export const audio = mysqlTable('audio', {
  id: int('id').autoincrement().primaryKey(),
  textKey: varchar('text_key', { length: 191 }).notNull().unique(),
  text: varchar('text', { length: 500 }).notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  size: int('size').notNull(),
  data: mediumBlob('data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// Kaba kuvvet koruması için giriş/kayıt denemeleri
export const authAttempts = mysqlTable('auth_attempts', {
  id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
  kind: varchar('kind', { length: 16 }).notNull(),
  ip: varchar('ip', { length: 64 }).notNull(),
  email: varchar('email', { length: 190 }),
  ok: boolean('ok').notNull().default(false),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (t) => [index('auth_ip_idx').on(t.ip, t.createdAt), index('auth_email_idx').on(t.email, t.createdAt)]);

// Ders anlatımı sesleri; anahtar = model + ses + metnin SHA-256 özeti (metin değişince ses geçersiz olur)
export const narrationAudio = mysqlTable('narration_audio', {
  id: int('id').autoincrement().primaryKey(),
  nkey: char('nkey', { length: 64 }).notNull().unique(),
  topicId: varchar('topic_id', { length: 64 }).notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  size: int('size').notNull(),
  data: mediumBlob('data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
}, (t) => [index('narration_topic_idx').on(t.topicId)]);

// Kullanıcıların bildirdiği içerik hataları (soru, kelime ya da ders bölümü)
export const reports = mysqlTable('reports', {
  id: int('id').autoincrement().primaryKey(),
  topicId: varchar('topic_id', { length: 64 }).notNull(),
  kind: varchar('kind', { length: 16 }).notNull(),
  reason: varchar('reason', { length: 40 }).notNull(),
  message: text('message'),
  context: json('context').$type<ReportContext>().notNull(),
  userId: int('user_id').references(() => users.id, { onDelete: 'set null' }),
  anonId: varchar('anon_id', { length: 64 }),
  status: mysqlEnum('status', ['open', 'done']).notNull().default('open'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at')
}, (t) => [index('reports_status_idx').on(t.status, t.createdAt), index('reports_topic_idx').on(t.topicId)]);

// Yapay zekâ ile kelime arama sonuçları (önbellek): aynı arama tekrar sorulunca modele gidilmez
export const lookups = mysqlTable('lookups', {
  id: int('id').autoincrement().primaryKey(),
  qkey: varchar('qkey', { length: 120 }).notNull().unique(),
  query: varchar('query', { length: 80 }).notNull(),
  model: varchar('model', { length: 120 }).notNull(),
  result: json('result').$type<LookupResult>().notNull(),
  hits: int('hits').notNull().default(1),
  cost: double('cost').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastAt: timestamp('last_at').notNull().defaultNow()
}, (t) => [index('lookups_created_idx').on(t.createdAt)]);

// Kelime bul yerleşik sözlüğü: burada bulunan kelimeler yapay zekâya sorulmaz (scripts/lexicon-data.ts, npm run db:lexicon)
export const lexicon = mysqlTable('lexicon', {
  id: int('id').autoincrement().primaryKey(),
  // Veritabanında utf8mb4_bin: harekeye duyarlı (عَالِم âlim ile عَالَم dünya ayrı kelimeler)
  ar: varchar('ar', { length: 120 }).notNull().unique(),
  tl: varchar('tl', { length: 120 }).notNull(),
  tr: varchar('tr', { length: 300 }).notNull(),
  en: varchar('en', { length: 200 }).notNull().default(''),
  type: varchar('type', { length: 4 }).notNull(),
  variants: json('variants').$type<string[]>().notNull(),
  muAr: varchar('mu_ar', { length: 120 }),
  muTl: varchar('mu_tl', { length: 120 }),
  note: varchar('note', { length: 400 })
});

// Günlük sayaçlar (yönetim panelindeki 14 günlük grafik): dinlenen ders anlatımı, dinlenen kelime sesi, kelime bul araması, doğru ve yanlış cevap
export const dailyMetrics = mysqlTable('daily_metrics', {
  day: char('day', { length: 10 }).notNull(),
  metric: varchar('metric', { length: 24 }).notNull(),
  n: int('n').notNull().default(0)
}, (t) => [primaryKey({ columns: [t.day, t.metric] })]);
