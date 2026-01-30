'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(createPageURL(page));
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        title="First Page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 mx-2">
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Last Page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
