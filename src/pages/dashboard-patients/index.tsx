import { useContext, useState } from 'react';
import { flushSync } from 'react-dom';
import Context from 'context';
import ROLES from 'const/roles';
import { DataTable } from 'components/data-table';
import { SearchInput } from 'components/search-input';
import { PageToolbar } from 'components/page-toolbar';
import { Pagination } from 'components/pagination';
import { Button } from 'ui/button';
import { AddPlusIcon } from 'ui/icons/AddPlusIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import Loader from 'ui/loader';
import type { IPatientListItem } from 'types/patients.types';
import { patientColumns } from './patientColumns';
import { PatientDetails } from './patientDetails';
import { usePatients } from './usePatients';
import './patients.css';
import { AddPatientModal } from './AddPatientModal';

export default function Patients() {
  const { currentUser } = useContext(Context) as { currentUser: { role: string } };
  const [editingPatient, setEditingPatient] = useState<IPatientListItem | null>(null);
  const {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedPatients,
    expandedPatientId,
    sortField,
    sortDirection,
    handleArchiveToggle,
    handleArchivePatient,
    handleRowClick,
    handleSearchResultClick,
    handleSort,
    handlePatientUpdated,
    currentPage,
    totalPages,
    handlePageChange,
  } = usePatients();

  if (isLoading) return <Loader position="fixed" />;

  return (
    <>
      <div className="patients-header mb-4">
        <PageToolbar>
          <SearchInput
            value={searchName}
            onChange={handleSearchNameChange}
            isLoading={isSearchLoading}
            placeholder="Поиск"
          >
            {visibleSearchResults.length > 0
              ? visibleSearchResults.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    className="patients-search-dropdown__item"
                    onClick={() => handleSearchResultClick(patient)}
                  >
                    <span className="patients-search-dropdown__name">
                      <strong>{patient.last_name}</strong> {patient.first_name}{' '}
                      {patient.middle_name}
                    </span>
                  </button>
                ))
              : null}
          </SearchInput>
          {archivedStatus !== 'archived' && (currentUser?.role === ROLES.DOCTOR || currentUser?.role === ROLES.HEAD_DOCTOR) && (
            <Button
              className="primary has-icon"
              iconBefore={<AddPlusIcon />}
              data-bs-toggle="modal"
              data-bs-target="#addPatientModal"
              onClick={() => flushSync(() => setEditingPatient(null))}
            >
              Добавить пациента
            </Button>
          )}
          <Button
            className="bordered has-icon"
            iconAfter={<ArchiveIcon />}
            onClick={handleArchiveToggle}
          >
            {archivedStatus === 'archived' ? 'Активные' : 'Архив'}
          </Button>
        </PageToolbar>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DataTable
        columns={patientColumns}
        data={displayedPatients}
        keyExtractor={(p) => p.id}
        expandedId={expandedPatientId}
        onRowClick={handleRowClick}
        renderExpanded={(p) => (
          <PatientDetails
            patient={p}
            onClose={() => handleRowClick(p.id)}
            onArchive={() => handleArchivePatient(p.id, p.is_archived)}
            onEdit={(patient) => flushSync(() => setEditingPatient(patient))}
          />
        )}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="Нет пациентов"
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      <AddPatientModal editingPatient={editingPatient} onSuccess={handlePatientUpdated} />
    </>
  );
}
