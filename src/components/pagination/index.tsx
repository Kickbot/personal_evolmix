import { IconButton } from 'ui/button';
import './pagination.css';
import { cn } from 'utils';

const DOTS = '...' as const;

type PageItem = number | typeof DOTS;
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 2,
): PageItem[] {
  const totalSlots = siblingCount + 4;

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: siblingCount + 2 },
      (_, i) => i + 1,
    );
    return [...leftRange, DOTS, totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: siblingCount + 2 },
      (_, i) => totalPages - (siblingCount + 2) + i + 1,
    );
    return [1, DOTS, ...rightRange];
  }

  return [
    1,
    DOTS,
    ...Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, i) => leftSibling + i,
    ),
    DOTS,
    totalPages,
  ];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  const pages = getPageRange(currentPage, totalPages, siblingCount);

  if (totalPages <= 1) return null;

  return (
    <nav className={cn('pagination', className)} aria-label="Pagination">
      <IconButton
        className="pagination__arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Предыдущая страница"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </IconButton>

      <ul className="pagination__list">
        {pages.map((page, index) =>
          page === DOTS ? (
            <li key={`dots-${index}`} className="pagination__dots">
              {DOTS}
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                className={cn(
                  'pagination__item',
                  currentPage === page && 'pagination__item--active',
                )}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          ),
        )}
      </ul>

      <IconButton
        className="pagination__arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Следующая страница"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </IconButton>
    </nav>
  );
};
