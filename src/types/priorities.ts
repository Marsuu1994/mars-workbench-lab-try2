import type {MatrixData} from '@/services/matrixService';

/** What the Priorities page needs, shaped by its route: the matrix as the
    server reads it, plus the week its header shows. */
export interface PrioritiesPageData extends MatrixData {
  /** The active plan's week; with no plan, the current ISO week */
  periodKey: string;
}
