import { useState, useRef } from 'react';
import { DataTable } from 'components/data-table';
import { SearchInput, SearchDropdown } from 'components/search-input';
import { PageToolbar } from 'components/page-toolbar';
import { Pagination } from 'components/pagination';
import { Button } from 'ui/button';
import { AddPlusIcon } from 'ui/icons/AddPlusIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import Loader from 'ui/loader';
import { substanceColumns } from './substanceColumns';
import type { ISubstanceListItem } from 'types/substances.types';
import './substance.css';
import { useSubstance } from './useSubstance';
import { AddSubstanceModal } from './AddSubstanceModal';

export default function Substance() {
  const [editingSubstance, setEditingSubstance] = useState<ISubstanceListItem | null>(null);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedSubstances,
    sortField,
    sortDirection,
    handleArchiveToggle,
    handleArchiveSubstance,
    handleSort,
    handleSubstanceUpdated,
    currentPage,
    totalPages,
    handlePageChange,
  } = useSubstance();

  const handleRowClick = (substanceId: string) => {
    const substance = displayedSubstances.find((s) => s.id === substanceId);
    if (substance) {
      setEditingSubstance(substance);
      setTimeout(() => {
        modalTriggerRef.current?.click();
      }, 0);
    }
  };

  if (isLoading) return <Loader position="fixed" />;

  return (
    <>
      <div className="substance-header mb-4">
        <PageToolbar>
          <SearchInput
            value={searchName}
            onChange={handleSearchNameChange}
            isLoading={isSearchLoading}
            hasResults={visibleSearchResults.length > 0}
            placeholder="Поиск"
          >
            <SearchDropdown
              items={visibleSearchResults}
              getKey={(s) => s.id}
              renderItem={(s) => (
                <span className="search-dropdown__name">
                  <strong>{s.name}</strong>
                </span>
              )}
            />
          </SearchInput>
          <Button
            className="primary has-icon"
            iconBefore={<AddPlusIcon />}
            data-bs-toggle="modal"
            data-bs-target="#addSubstanceModal"
            onClick={() => setEditingSubstance(null)}
          >
            Добавить новое лекарство
          </Button>
          <Button
            className="bordered has-icon"
            iconAfter={<ArchiveIcon />}
            onClick={handleArchiveToggle}
          >
            {archivedStatus === 'archived' ? 'Активные' : 'Архив'}
          </Button>
        </PageToolbar>
      </div>

      {/* Скрытая кнопка для программного открытия модального окна */}
      <button
        ref={modalTriggerRef}
        data-bs-toggle="modal"
        data-bs-target="#addSubstanceModal"
        style={{ display: 'none' }}
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DataTable
        columns={substanceColumns}
        data={displayedSubstances}
        keyExtractor={(s) => s.id}
        onRowClick={handleRowClick}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="Нет веществ"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <AddSubstanceModal 
        editingSubstance={editingSubstance} 
        onSuccess={handleSubstanceUpdated}
        onArchive={() => {
          if (editingSubstance) {
            handleArchiveSubstance(editingSubstance.id, editingSubstance.is_archived);
            setTimeout(() => {
              modalTriggerRef.current?.click();
            }, 100);
          }
        }}
      />
    </>
  );
}
