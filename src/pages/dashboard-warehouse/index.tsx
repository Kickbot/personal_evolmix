import { useState, useRef } from 'react';
import { DataTable } from 'components/data-table';
import { SearchInput } from 'components/search-input';
import { PageToolbar } from 'components/page-toolbar';
import { Pagination } from 'components/pagination';
import { Button } from 'ui/button';
import { AddPlusIcon } from 'ui/icons/AddPlusIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import Loader from 'ui/loader';
import { warehouseColumns } from './warehouseColumns';
import type { IWarehouseListItem } from 'types/warehouse.types';
import './warehouse.css';
import { useWarehouse } from './useWarehouse';
import { AddWarehouseModal } from './AddWarehouseModal';

export default function Warehouse() {
  const [editingWarehouse, setEditingWarehouse] = useState<IWarehouseListItem | null>(null);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);

  const {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedWarehouse,
    sortField,
    sortDirection,
    handleArchiveToggle,
    handleArchiveWarehouse,
    handleSort,
    handleWarehouseUpdated,
    currentPage,
    totalPages,
    handlePageChange,
  } = useWarehouse();

  const handleRowClick = (warehouseId: string) => {
    const warehouse = displayedWarehouse.find((w) => w.id === warehouseId);
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setTimeout(() => {
        modalTriggerRef.current?.click();
      }, 0);
    }
  };

  if (isLoading) return <Loader position="fixed" />;

  return (
    <>
      <div className="warehouse-header mb-4">
        <PageToolbar>
          <SearchInput
            value={searchName}
            onChange={handleSearchNameChange}
            isLoading={isSearchLoading}
            placeholder="Поиск"
          >
            {visibleSearchResults.length > 0
              ? visibleSearchResults.map((warehouse) => (
                  <button
                    key={warehouse.id}
                    type="button"
                    className="warehouse-search-dropdown__item"
                  >
                    <span className="warehouse-search-dropdown__name">
                      <strong>{warehouse.active_substance.name}</strong>
                    </span>
                  </button>
                ))
              : null}
          </SearchInput>
          <Button
            className="primary has-icon"
            iconBefore={<AddPlusIcon />}
            data-bs-toggle="modal"
            data-bs-target="#addWarehouseModal"
            onClick={() => setEditingWarehouse(null)}
          >
            Добавить товар на склад
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
        data-bs-target="#addWarehouseModal"
        style={{ display: 'none' }}
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DataTable
        columns={warehouseColumns}
        data={displayedWarehouse}
        keyExtractor={(w) => w.id}
        onRowClick={handleRowClick}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="Нет товаров на складе"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <AddWarehouseModal
        editingWarehouse={editingWarehouse}
        onSuccess={handleWarehouseUpdated}
        onArchive={() => {
          if (editingWarehouse) {
            handleArchiveWarehouse(editingWarehouse.id, editingWarehouse.is_archived);
            setTimeout(() => {
              modalTriggerRef.current?.click();
            }, 100);
          }
        }}
      />
    </>
  );
}
