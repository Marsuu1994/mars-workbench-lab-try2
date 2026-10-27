import type {MatrixData} from '@/services/matrixService';

/**
 * What the Priorities page needs: the matrix's one-offs and the week's active
 * plan as the server returns them, and the week its header shows (the plan's,
 * else the current ISO week).
 */
export interface PrioritiesPageData extends MatrixData {
  periodKey: string;
}
