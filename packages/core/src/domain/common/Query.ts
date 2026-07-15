export type QueryFilter<T> = Partial<{
  where: Partial<T>;
  orderBy: keyof T;
  order: 'asc' | 'desc';
  limit: number;
  offset: number;
}>;

export interface PaginatedResult<T> {
  readonly items: T[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}
