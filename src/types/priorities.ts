import type {MatrixData} from '@/services/matrixService';

/**
 * What the Priorities page needs: the matrix as the server returns it — the
 * one-offs the page keeps as state and patches optimistically, and the plan
 * tracking writes into (null: no plan this week yet) — plus the week its
 * header shows.
 */
export interface PrioritiesPageData extends MatrixData {
  periodKey: string;
}
