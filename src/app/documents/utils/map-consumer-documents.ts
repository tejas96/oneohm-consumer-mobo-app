import type { ConsumerDocument } from '@/data/types';

import type { DocumentItem } from '../hooks/useDocumentsLogic';

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) {
    return '—';
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDocumentDate(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCategoryLabel(category?: string): string {
  if (!category) {
    return 'General';
  }
  return category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function mapConsumerDocumentsToItems(
  documents: ConsumerDocument[],
): DocumentItem[] {
  return documents.map(doc => ({
    id: doc.id || doc.fileUrl || Math.random().toString(),
    title: doc.fileName || 'Document',
    category: formatCategoryLabel(doc.category),
    entityType: doc.entityType || 'property',
    date: formatDocumentDate(doc.createdAt),
    size: formatFileSize(doc.fileSizeBytes),
    fileUrl: doc.fileUrl || '',
  }));
}
