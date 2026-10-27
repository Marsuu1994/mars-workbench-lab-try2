import type {MatrixData} from '@/services/matrixService';

/**
 * What the Priorities page needs: the matrix as the server reads it — every
 * non-done one-off, the rows the page keeps as state and patches
 * optimistically, and the active plan (null: none this week) — plus the week
 * the header shows.
 */
export interface PrioritiesPageData extends MatrixData {
  periodKey: string;
}
