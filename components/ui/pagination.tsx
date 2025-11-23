"use client";

import { Button } from "@/components/ui/button";
import { PaginatedResult } from "@/types/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  meta: PaginatedResult<any>["meta"];
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, hasNextPage, hasPreviousPage } = meta;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
