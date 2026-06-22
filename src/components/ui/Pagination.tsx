'use client';

import React from 'react';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export function Pagination({
  currentPage, totalPages, totalItems,
  rowsPerPage, onPageChange, onRowsPerPageChange,
}: PaginationProps) {
  return (
    <div className="pagination-bar">
      <div className="pagination-left">
        <span className="pagination-label">Lignes par page</span>
        <select
          className="pagination-select"
          value={rowsPerPage}
          onChange={e => onRowsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className="pagination-info">
          Total: <strong className="pagination-info-strong">{totalItems}</strong> élément(s)
        </span>
      </div>

      <div className="pagination-right">
        <span className="pagination-page-info">
          Page <strong>{currentPage}</strong> sur <strong>{totalPages || 1}</strong>
        </span>
        <div className="pagination-buttons">
          <button
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, index, array) => {
              if (index > 0 && array[index - 1] !== page - 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className="pagination-btn" style={{ cursor: 'default', opacity: 0.5 }}>...</span>
                    <button
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              }
              return (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              );
            })}

          <button
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
