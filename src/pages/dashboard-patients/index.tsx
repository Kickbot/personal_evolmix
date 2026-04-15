import { DataTable } from 'components/data-table';
import { SearchInput } from 'components/search-input';
import { PageToolbar } from 'components/page-toolbar';
import { Pagination } from 'components/pagination';
import { Button } from 'ui/button';
import { AddPlusIcon } from 'ui/icons/AddPlusIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import Loader from 'ui/loader';
import { patientColumns } from './patientColumns';
import { PatientDetails } from './patientDetails';
import { usePatients } from './usePatients';
import './patients.css';

export default function Patients() {
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
          {archivedStatus !== 'archived' && (
            <Button
              className="primary has-icon"
              iconBefore={<AddPlusIcon />}
              onClick={() => {}}
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
          />
        )}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="Нет пациентов"
      />
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    </>
  );
}
