import { desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import ReportsView, { type ReportRow } from '@/components/admin/ReportsView';

export const metadata = { title: 'Hata bildirimleri' };

export default async function ReportsPage() {
  const rows = await db.select({
    id: schema.reports.id,
    topicId: schema.reports.topicId,
    topicName: schema.topics.name,
    kind: schema.reports.kind,
    reason: schema.reports.reason,
    message: schema.reports.message,
    context: schema.reports.context,
    status: schema.reports.status,
    userId: schema.reports.userId,
    userName: schema.users.name,
    createdAt: schema.reports.createdAt,
    resolvedAt: schema.reports.resolvedAt
  })
    .from(schema.reports)
    .leftJoin(schema.topics, eq(schema.topics.id, schema.reports.topicId))
    .leftJoin(schema.users, eq(schema.users.id, schema.reports.userId))
    .orderBy(desc(schema.reports.createdAt))
    .limit(500);
  const list: ReportRow[] = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString(), resolvedAt: r.resolvedAt?.toISOString() ?? null }) as ReportRow);
  return <ReportsView rows={list} />;
}
