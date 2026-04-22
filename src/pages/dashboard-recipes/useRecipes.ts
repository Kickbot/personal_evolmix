import { useEffect, useState } from 'react';
import { recipe as recipeApi } from 'api';
import { useDebounce } from 'hooks/useDebounce';
import { useListControls } from 'hooks/useListControls';
import { usePagination } from 'hooks/usePagination';
import type {
  IRecipeListItem,
  IRecipeSearchBody,
  IRecipeSearchQueryParams,
  IRecipeStatus,
  IRecipeDoctorConfirmStatus,
  IRecipesResponse,
} from 'types/recipes.types';

type ArchivedStatus = 'archived' | 'nonarchived';

const SORT_MAP = {
  status: 'status',
  patient_name: 'full_name',
  gender: 'gender',
  created_at: 'date',
  doctor_confirm_status: 'doctor_confirm_status',
} as const;

export function useRecipes() {
  const { currentPage, totalPages, offset, pageSize, handlePageChange: onPageChange, resetPage, setTotal }
    = usePagination();
  const {
    sortField, sortDirection, handleSort: onSort, resetSort,
    searchName, setSearchName,
    isSearchLoading, setIsSearchLoading,
  } = useListControls();
  const [recipes, setRecipes] = useState<IRecipeListItem[]>([]);
  const [searchResults, setSearchResults] = useState<IRecipeListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [archivedStatus, setArchivedStatus] = useState<ArchivedStatus>('nonarchived');
  const [confirmFilter, setConfirmFilter] =
    useState<IRecipeDoctorConfirmStatus | ''>('');
  const [statusFilter, setStatusFilter] = useState<IRecipeStatus | ''>('');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearchName = useDebounce(searchName.trim(), 300);

  const reloadRecipes = () => setReloadKey((k) => k + 1);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    setExpandedRecipeId(null);
  };

  const handleSort = (field: string) => {
    onSort(field);
    resetPage();
    setExpandedRecipeId(null);
  };

  const handleArchiveToggle = () => {
    setIsLoading(true);
    if (searchName.trim()) setIsSearchLoading(true);
    setExpandedRecipeId(null);
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

  const handleConfirmFilterChange = (value: IRecipeDoctorConfirmStatus | '') => {
    setConfirmFilter(value);
    resetPage();
  };

  const handleStatusFilterChange = (value: IRecipeStatus | '') => {
    setStatusFilter(value);
    resetPage();
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    resetPage();
  };

  const handleRowClick = (recipeId: string) => {
    setExpandedRecipeId((current) => (current === recipeId ? null : recipeId));
  };

  const handleSearchResultClick = (r: IRecipeListItem) => {
    setExpandedRecipeId(r.id);
  };

  const handleArchiveRecipe = (recipeId: string, isArchived: boolean) => {
    recipeApi
      .patchRecipe(recipeId, { is_archived: !isArchived })
      .then((data) => {
        if ((data as { success: boolean }).success) {
          setRecipes((current) => current.filter((r) => r.id !== recipeId));
          setExpandedRecipeId(null);
        }
      });
  };

  useEffect(() => {
    const body: IRecipeSearchBody = {
      is_archived: archivedStatus === 'archived',
    };
    if (debouncedSearchName) body.patient_name = debouncedSearchName;
    if (confirmFilter) body.doctor_confirm_status = confirmFilter;
    if (statusFilter) body.status = statusFilter;
    if (dateFilter) body.created_at = dateFilter;

    const beField = sortField ? (SORT_MAP as Record<string, string>)[sortField] : undefined;
    const query: IRecipeSearchQueryParams = { limit: pageSize, offset };
    if (beField && sortDirection !== 'none') {
      query.order_by = beField as IRecipeSearchQueryParams['order_by'];
      query.sort_direction = sortDirection;
    }

    (recipeApi.postSearchRecipe(body, query) as Promise<IRecipesResponse>)
      .then((data) => {
        setError(null);
        setTotal(data.total);
        setRecipes(data.recipes);
        if (debouncedSearchName) setSearchResults(data.recipes);
      })
      .catch(() => {
        setRecipes([]);
        if (debouncedSearchName) setSearchResults([]);
        setError('Не удалось загрузить рецепты');
      })
      .finally(() => {
        setIsLoading(false);
        setIsSearchLoading(false);
      });
  }, [
    archivedStatus,
    confirmFilter,
    statusFilter,
    dateFilter,
    debouncedSearchName,
    offset,
    sortField,
    sortDirection,
    reloadKey,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleSearchResults = debouncedSearchName ? searchResults : [];

  return {
    isLoading,
    error,
    archivedStatus,
    searchName,
    handleSearchNameChange,
    isSearchLoading,
    visibleSearchResults,
    displayedRecipes: recipes,
    expandedRecipeId,
    sortField,
    sortDirection,
    confirmFilter,
    statusFilter,
    dateFilter,
    handleConfirmFilterChange,
    handleStatusFilterChange,
    handleDateFilterChange,
    handleArchiveToggle,
    handleArchiveRecipe,
    handleRowClick,
    handleSearchResultClick,
    handleSort,
    currentPage,
    totalPages,
    handlePageChange,
    reloadRecipes,
  };
}
