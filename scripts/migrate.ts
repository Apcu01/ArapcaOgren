/**
 * Veritabanını sitenin son hâline getirir (üretim veritabanı için): sonradan eklenen tabloları oluşturur,
 * var olan tablolarda eksik sütunları ekler. Birden çok kez çalıştırmak güvenlidir; veri silmez.
 *
 *   npm run db:migrate
 *
 * İlk kurulumda önce npm run db:push (ya da db:seed) ile temel tablolar oluşturulur.
 * Gerekli: .env.local içinde DATABASE_URL
 */
import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { DEFAULT_READINGS } from '../src/lib/readings';
import { DEFAULT_NEWS } from '../src/lib/news-shared';
import { cleanText } from '../src/lib/text';

config({ path: '.env.local', quiet: true });
config({ quiet: true });

// Sonradan eklenen tablolar (oluşturma sırası yabancı anahtarlara göre)
const TABLES: Record<string, string> = {
  lexicon: "CREATE TABLE IF NOT EXISTS `lexicon` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `ar` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,\n  `tl` varchar(120) NOT NULL,\n  `tr` varchar(300) NOT NULL,\n  `en` varchar(200) NOT NULL DEFAULT '',\n  `type` varchar(4) NOT NULL,\n  `variants` json NOT NULL,\n  `mu_ar` varchar(120) DEFAULT NULL,\n  `mu_tl` varchar(120) DEFAULT NULL,\n  `note` varchar(400) DEFAULT NULL,\n  `topic` varchar(80) DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `ar` (`ar`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
  daily_metrics: "CREATE TABLE IF NOT EXISTS `daily_metrics` (\n  `day` char(10) NOT NULL,\n  `metric` varchar(24) NOT NULL,\n  `n` int NOT NULL DEFAULT '0',\n  PRIMARY KEY (`day`,`metric`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
  word_lists: "CREATE TABLE IF NOT EXISTS `word_lists` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `user_id` int NOT NULL,\n  `title` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `description` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',\n  `best` json NOT NULL,\n  `studied_at` timestamp NULL DEFAULT NULL,\n  `share_token` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `copies` int NOT NULL DEFAULT '0',\n  `folder` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',\n  `tags` json DEFAULT NULL,\n  `source_list_id` int DEFAULT NULL,\n  `synced_at` timestamp(3) NULL DEFAULT NULL,\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `word_lists_share_token_unique` (`share_token`),\n  KEY `word_lists_user_idx` (`user_id`,`updated_at`),\n  KEY `word_lists_source_idx` (`source_list_id`),\n  CONSTRAINT `word_lists_source_fk` FOREIGN KEY (`source_list_id`) REFERENCES `word_lists` (`id`) ON DELETE SET NULL,\n  CONSTRAINT `word_lists_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  word_list_items: "CREATE TABLE IF NOT EXISTS `word_list_items` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `list_id` int NOT NULL,\n  `position` int NOT NULL DEFAULT '0',\n  `ar` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `tl` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',\n  `tr` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `note` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',\n  `starred` tinyint(1) NOT NULL DEFAULT '0',\n  `correct` int NOT NULL DEFAULT '0',\n  `wrong` int NOT NULL DEFAULT '0',\n  `streak` int NOT NULL DEFAULT '0',\n  `seen_at` timestamp NULL DEFAULT NULL,\n  `source_item_id` int DEFAULT NULL,\n  `created_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n  `updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),\n  PRIMARY KEY (`id`),\n  KEY `word_list_items_list_idx` (`list_id`,`position`),\n  CONSTRAINT `word_list_items_list_fk` FOREIGN KEY (`list_id`) REFERENCES `word_lists` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  lookup_log: "CREATE TABLE IF NOT EXISTS `lookup_log` (\n  `id` bigint NOT NULL AUTO_INCREMENT,\n  `query` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `context` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `qkey` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `source` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `near` tinyint(1) NOT NULL DEFAULT '0',\n  `result_ar` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `result_tr` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `user_id` int DEFAULT NULL,\n  `anon_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `lookup_log_created_idx` (`created_at`),\n  KEY `lookup_log_qkey_idx` (`qkey`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  live_results: "CREATE TABLE IF NOT EXISTS `live_results` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `user_id` int NOT NULL,\n  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `questions` int NOT NULL,\n  `players` int NOT NULL,\n  `accuracy` double NOT NULL DEFAULT '0',\n  `report` json NOT NULL,\n  `started_at` timestamp NOT NULL,\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `live_results_user_idx` (`user_id`,`created_at`),\n  CONSTRAINT `live_results_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  xp_log: "CREATE TABLE IF NOT EXISTS `xp_log` (\n  `user_id` int NOT NULL,\n  `day` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `xp` int NOT NULL DEFAULT '0',\n  PRIMARY KEY (`user_id`,`day`),\n  KEY `xp_log_day_idx` (`day`),\n  CONSTRAINT `xp_log_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  classes: "CREATE TABLE IF NOT EXISTS `classes` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `owner_id` int NOT NULL,\n  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `code` char(6) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `classes_code_uq` (`code`),\n  KEY `classes_owner_idx` (`owner_id`),\n  CONSTRAINT `classes_owner_fk` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  class_members: "CREATE TABLE IF NOT EXISTS `class_members` (\n  `class_id` int NOT NULL,\n  `user_id` int NOT NULL,\n  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`class_id`,`user_id`),\n  KEY `class_members_user_idx` (`user_id`),\n  CONSTRAINT `class_members_class_fk` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,\n  CONSTRAINT `class_members_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  class_tasks: "CREATE TABLE IF NOT EXISTS `class_tasks` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `class_id` int NOT NULL,\n  `kind` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `ref` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `due` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `class_tasks_class_idx` (`class_id`,`created_at`),\n  CONSTRAINT `class_tasks_class_fk` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  readings: "CREATE TABLE IF NOT EXISTS `readings` (\n  `slug` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `position` int NOT NULL DEFAULT '0',\n  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `level` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Başlangıç',\n  `topic` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `description` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',\n  `sentences` json NOT NULL,\n  `questions` json NOT NULL,\n  `published` tinyint(1) NOT NULL DEFAULT '0',\n  `ai` tinyint(1) NOT NULL DEFAULT '0',\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`slug`),\n  KEY `readings_pos_idx` (`published`,`position`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  class_posts: "CREATE TABLE IF NOT EXISTS `class_posts` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `class_id` int NOT NULL,\n  `body` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `class_posts_class_idx` (`class_id`,`created_at`),\n  CONSTRAINT `class_posts_class_fk` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  push_subscriptions: "CREATE TABLE IF NOT EXISTS `push_subscriptions` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `user_id` int NOT NULL,\n  `endpoint` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `p256dh` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `auth` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `kinds` json NOT NULL,\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `push_subscriptions_endpoint_uq` (`endpoint`),\n  KEY `push_subscriptions_user_idx` (`user_id`),\n  CONSTRAINT `push_subscriptions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  push_sends: "CREATE TABLE IF NOT EXISTS `push_sends` (\n  `user_id` int NOT NULL,\n  `kind` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `day` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`user_id`,`kind`,`day`),\n  CONSTRAINT `push_sends_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
  news: "CREATE TABLE IF NOT EXISTS `news` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `title` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,\n  `body` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',\n  `link` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n  `published` tinyint(1) NOT NULL DEFAULT '1',\n  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  KEY `news_pub_idx` (`published`,`created_at`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
};
// Sınırsız pratik etkinliğinin başlık ve açıklaması
const ENDLESS: Record<string, [string, string]> = {
  zamirler: ['Sınırsız zamir pratiği', 'Zamirin anlamı, Arapçası, dinleyerek bulma, zamir ile yüklem uyumu ve bu/şu işaret zamirleri. Sorular her seferinde farklı biçimde gelir, bitene kadar devam eder.'],
  iyelik: ['Sınırsız iyelik pratiği', 'Ekli isimlerin anlamı ve Arapçası, doğru eki bulma, dinleme ve "bende var" kalıbı. Sorular her seferinde farklı biçimde gelir, bitene kadar devam eder.'],
  words: ['Sınırsız kelime pratiği', 'Bu dersin kelimeleri farklı biçimlerde sorulur: anlamını bul, Arapçasını bul, dinleyip bul. Bitene kadar devam eder.']
};
// Eski tablolara sonradan eklenen sütunlar
const COLUMNS: [table: string, column: string, def: string][] = [
  ["users", "league_hidden", "tinyint(1) NOT NULL DEFAULT '0'"]
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL!);
  const has = async (t: string, c?: string) => {
    const [r] = await conn.query<mysql.RowDataPacket[]>(
      c ? "SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?"
        : "SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?", c ? [t, c] : [t]);
    return r.length > 0;
  };
  const q = (s: string) => "`" + s + "`";
  const addColumn = async (t: string, c: string, def: string) => {
    if (await has(t, c)) return;
    await conn.query("ALTER TABLE " + q(t) + " ADD COLUMN " + q(c) + " " + def);
    console.log("+ " + t + "." + c);
  };
  for (const [t, c, def] of COLUMNS) await addColumn(t, c, def);
  for (const [t, ddl] of Object.entries(TABLES)) {
    if (!(await has(t))) { await conn.query(ddl); console.log("+ " + t); continue; }
    // Tablo varsa: tanımdaki sütunlardan eksik olanlar eklenir (dizin ve anahtarlar değil)
    for (const line of ddl.split('\n')) {
      const m = line.trim().match(/^`([a-z_]+)` (.+?),?$/);
      if (m) await addColumn(t, m[1], m[2]);
    }
  }
  // Görünmez karakter temizliği: kopyala-yapıştırla gelen sıfır genişlikli boşluklar kelime eşleştirmeyi ve ses bulmayı bozar.
  // updated_at kendine eşitlenir: kopyalara "düzeltildi" önerisi çıkmasın
  const cl = (v: unknown) => cleanText(v).trim();
  const [items] = await conn.query<mysql.RowDataPacket[]>('SELECT id, ar, tl, tr, note FROM word_list_items');
  let fixed = 0;
  for (const r of items) {
    const c = { ar: cl(r.ar), tl: cl(r.tl), tr: cl(r.tr), note: cl(r.note) };
    if (c.ar === r.ar && c.tl === r.tl && c.tr === r.tr && c.note === r.note) continue;
    await conn.query('UPDATE word_list_items SET ar = ?, tl = ?, tr = ?, note = ?, updated_at = updated_at WHERE id = ?', [c.ar, c.tl, c.tr, c.note, r.id]);
    fixed++;
  }
  const [lists] = await conn.query<mysql.RowDataPacket[]>('SELECT id, title, description FROM word_lists');
  for (const r of lists) {
    const t = cl(r.title), d = cl(r.description);
    if (t === r.title && d === r.description) continue;
    await conn.query('UPDATE word_lists SET title = ?, description = ?, updated_at = updated_at WHERE id = ?', [t, d, r.id]);
    fixed++;
  }
  if (fixed) console.log('~ ' + fixed + ' liste kaydında görünmez karakter temizlendi');
  // Okuma metinleri: tablo boşsa ilk 8 metin yayında olarak yüklenir
  const [[cnt]] = await conn.query<mysql.RowDataPacket[]>('SELECT COUNT(*) n FROM readings');
  if (!Number(cnt.n)) {
    for (const [i, r] of DEFAULT_READINGS.entries()) {
      await conn.query('INSERT INTO readings (slug, position, title, ar, level, topic, description, sentences, questions, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
        [r.slug, i, r.title, r.ar, r.level, r.topic, r.desc, JSON.stringify(r.sentences), JSON.stringify(r.questions)]);
    }
    console.log('+ ' + DEFAULT_READINGS.length + ' okuma metni');
  }
  // Yenilikler: tablo boşsa ilk yazılar eklenir
  const [[nn]] = await conn.query<mysql.RowDataPacket[]>('SELECT COUNT(*) n FROM news');
  if (!Number(nn.n)) {
    for (const x of DEFAULT_NEWS) await conn.query('INSERT INTO news (title, body, link, published) VALUES (?, ?, ?, 1)', [x.title, x.body, x.link]);
    console.log('+ ' + DEFAULT_NEWS.length + ' yenilik yazısı');
  }
  // Sınırsız pratik: kelimesi olan her derse (saatlerin kendi sınırsız pratiği var) bir kez eklenir, konu testinden önceye
  const [tops] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT t.id FROM topics t WHERE t.id <> 'saatler' AND (t.id IN ('zamirler', 'iyelik') OR JSON_LENGTH(t.words) >= 4) AND NOT EXISTS (SELECT 1 FROM activities a WHERE a.topic_id = t.id AND a.type IN ('endless', 'clock'))");
  for (const { id } of tops) {
    const [acts] = await conn.query<mysql.RowDataPacket[]>('SELECT id, position, type FROM activities WHERE topic_id = ? ORDER BY position', [id]);
    const test = acts.find((a) => a.type === 'test');
    const pos = test ? Number(test.position) : acts.length ? Number(acts[acts.length - 1].position) + 1 : 0;
    if (test) await conn.query('UPDATE activities SET position = position + 1 WHERE topic_id = ? AND position >= ?', [id, pos]);
    const [title, desc] = ENDLESS[id] || ENDLESS.words;
    await conn.query('INSERT INTO activities (topic_id, position, type, title, description, glyph, keep_order, items) VALUES (?, ?, ?, ?, ?, ?, 0, NULL)', [id, pos, 'endless', title, desc, '∞']);
    console.log('+ sınırsız pratik: ' + id);
  }
  await conn.end();
  console.log("Veritabanı güncel.");
}

main().catch((e) => { console.error(e); process.exit(1); });
