import { useEffect, useState } from 'react';
import { patient as patientApi } from 'api';
import { useDebounce } from 'hooks/useDebounce';
import { usePagination } from 'hooks/usePagination';
import type { IPatientListItem, IPatientSearchParams } from 'types/patients.types';
import type { SortDirection } from 'components/data-table';

export function usePatients() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const [patients, setPatients] = useState<IPatientListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [archivedStatus, setArchivedStatus] =
    useState<IPatientSearchParams['archived_status']>('nonarchived');
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<IPatientListItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const debouncedSearchName = useDebounce(searchName.trim(), 300);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    setExpandedPatientId(null);
  };

  const handleArchiveToggle = () => {
    setIsLoading(true);
    if (searchName.trim()) {
      setIsSearchLoading(true);
    }
    setExpandedPatientId(null);
    resetPage();
    setSortField(undefined);
    setSortDirection('none');
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
    setPatients((current) => {
      const exists = current.some((p) => p.id === updatedPatient.id);
      if (exists) {
        return current.map((p) =>
          p.id === updatedPatient.id ? { ...p, ...updatedPatient } : p,
        );
      }
      return [updatedPatient, ...current];
    });
    setSearchResults((current) => {
      const exists = current.some((p) => p.id === updatedPatient.id);
      if (exists) {
        return current.map((p) =>
          p.id === updatedPatient.id ? { ...p, ...updatedPatient } : p,
        );
      }
      return [updatedPatient, ...current];
    });
  };

  const handleSort = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
    } else {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    }
  };

  useEffect(() => {
    if (debouncedSearchName) {
      patientApi
        .getSearchPatient({
          name: debouncedSearchName,
          archived_status: archivedStatus,
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
  }, [archivedStatus, debouncedSearchName, offset]);// eslint-disable-line react-hooks/exhaustive-deps

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  const displayedPatients =
    !sortField || sortDirection === 'none'
      ? patients
      : [...patients].sort((a, b) => {
          let result = 0;
          if (sortField === 'last_name') {
            result = a.last_name.localeCompare(b.last_name, 'ru', {
              sensitivity: 'base',
            });
          } else if (sortField === 'date_of_birth') {
            result =
              new Date(a.date_of_birth).getTime() -
              new Date(b.date_of_birth).getTime();
          } else if (sortField === 'gender') {
            result = a.gender.localeCompare(b.gender);
          } else if (sortField === 'is_archived') {
            result = Number(a.is_archived) - Number(b.is_archived);
          }
          return sortDirection === 'asc' ? result : -result;
        });

  return {
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
  };
}
