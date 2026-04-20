import { useEffect, useState } from 'react';
import { patient as patientApi } from 'api';
import { useDebounce } from 'hooks/useDebounce';
import { useListControls } from 'hooks/useListControls';
import { usePagination } from 'hooks/usePagination';
import { upsertById } from 'utils';
import type { IPatientListItem, IPatientSearchParams } from 'types/patients.types';

const SORT_MAP = {
  is_archived: 'status',
  last_name: 'full_name',
  gender: 'gender',
  date_of_birth: 'date_of_birth',
} as const;

export function usePatients() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const {
    sortField, sortDirection, handleSort: onSort, resetSort,
    searchName, setSearchName,
    isSearchLoading, setIsSearchLoading,
  } = useListControls();
  const [patients, setPatients] = useState<IPatientListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [archivedStatus, setArchivedStatus] =
    useState<IPatientSearchParams['archived_status']>('nonarchived');
  const [searchResults, setSearchResults] = useState<IPatientListItem[]>([]);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);
  const debouncedSearchName = useDebounce(searchName.trim(), 300);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    setExpandedPatientId(null);
  };

  const handleSort = (field: string) => {
    onSort(field);
    resetPage();
    setExpandedPatientId(null);
  };

  const handleArchiveToggle = () => {
    setIsLoading(true);
    if (searchName.trim()) {
      setIsSearchLoading(true);
    }
    setExpandedPatientId(null);
    resetPage();
    resetSort();
    setArchivedStatus((current) =>
      current === 'nonarchived' ? 'archived' : 'nonarchived',
    );
  };

  const handleSearchNameChange = (value: string) => {
    setSearchName(value);
    resetPage();
    if (value.trim()) {
      setIsSearchLoading(true);
    } else {
      setIsSearchLoading(false);
      setSearchResults([]);
    }
  };

  const handleRowClick = (patientId: string) => {
    setExpandedPatientId((current) => (current === patientId ? null : patientId));
  };

  const handleSearchResultClick = (patient: IPatientListItem) => {
    setExpandedPatientId(patient.id);
  };

  const handleArchivePatient = (patientId: string, isArchived: boolean) => {
    patientApi
      .patchPatient(patientId, { is_archived: !isArchived })
      .then((data) => {
        if ((data as { success: boolean }).success) {
          setPatients((current) => current.filter((p) => p.id !== patientId));
          setExpandedPatientId(null);
        }
      });
  };

  const handlePatientUpdated = (updatedPatient?: IPatientListItem) => {
    if (!updatedPatient) return;
    setPatients((current) => upsertById(current, updatedPatient));
    setSearchResults((current) => upsertById(current, updatedPatient));
  };

  useEffect(() => {
    const beField = sortField ? (SORT_MAP as Record<string, string>)[sortField] : undefined;
    const sortParams: Pick<IPatientSearchParams, 'order_by' | 'sort_direction'> = {};
    if (beField && sortDirection !== 'none') {
      sortParams.order_by = beField as IPatientSearchParams['order_by'];
      sortParams.sort_direction = sortDirection;
    }

    if (debouncedSearchName) {
      patientApi
        .getSearchPatient({
          name: debouncedSearchName,
          archived_status: archivedStatus,
          ...sortParams,
          limit: pageSize,
          offset,
        })
        .then((data: { total: number; patients: IPatientListItem[] }) => {
          setError(null);
          setTotal(data.total);
          setSearchResults(data.patients);
          setPatients(data.patients);
        })
        .catch(() => {
          setPatients([]);
          setSearchResults([]);
          setError('Не удалось загрузить пациентов');
        })
        .finally(() => {
          setIsLoading(false);
          setIsSearchLoading(false);
        });
    } else {
      patientApi
        .getAllPatient({
          archived_status: archivedStatus,
          ...sortParams,
          limit: pageSize,
          offset,
        })
        .then((data: { total: number; patients: IPatientListItem[] }) => {
          setError(null);
          setTotal(data.total);
          setPatients(data.patients);
        })
        .catch(() => {
          setPatients([]);
          setError('Не удалось загрузить пациентов');
        })
        .finally(() => setIsLoading(false));
    }
  }, [archivedStatus, debouncedSearchName, offset, sortField, sortDirection]);// eslint-disable-line react-hooks/exhaustive-deps

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  return {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedPatients: patients,
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
  };
}
