import { PaginationParams } from "@/types/pagination";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export function getPaginationParams(params: PaginationParams) {
  const page = Number(params.page) || DEFAULT_PAGE;
  const limit = Number(params.limit) || DEFAULT_LIMIT;
  const search = params.search || "";

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    search,
    skip,
    take: limit,
  };
}

export function getPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
