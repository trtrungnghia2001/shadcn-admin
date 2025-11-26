export type ApiResponse<T> = {
  data: T;
  message: string;

  page: number;
  limit: number;
  offset: number;
  totalPages: number;
  totals: number;
};
