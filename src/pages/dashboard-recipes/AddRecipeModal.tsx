import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  patient as patientApi,
  recipe as recipeApi,
  solvent as solventApi,
  substance as substanceApi,
  user as userApi,
} from 'api';
import ROLES from 'const/roles';
import { Input } from 'ui/input';
import { Select } from 'ui/select';
import { Button } from 'ui/button';
import { AddSaveIcon } from 'ui/icons/AddSaveIcon';
import { CheckCircleIcon } from 'ui/icons/CheckCircleIcon';
import { SearchInput, SearchDropdown } from 'components/search-input';
import Loader from 'ui/loader';
import { useDebounce } from 'hooks/useDebounce';
import { formatDate, formatNowDate } from 'utils/date';
import { fullName, shortName } from 'utils/name';
import type { ApiFormError } from 'features/form/types/api-error';
import { applyServerErrors } from 'features/form/lib/applyServerErrors';
import {
  addRecipeSchema,
  type AddRecipeFormValues,
} from 'features/recipes/model/addRecipe.schema';
import type { IPatientListItem, IPatientResponse } from 'types/patients.types';
import type { IUserListItem, IUserResponse } from 'types/users.types';
import type {
  ISolventListItem,
  ISolventResponse,
} from 'types/solvents.types';
import type {
  ISubstanceListItem,
  ISubstanceResponse,
} from 'types/substances.types';
import type {
  IRecipeListItem,
  IRecipesResponse,
} from 'types/recipes.types';
import './addRecipeModal.css';

interface AddRecipeModalProps {
  onSuccess?: () => void;
}

const EMPTY_VALUES: AddRecipeFormValues = {
  patient_id: '',
  patient_query: '',
  doctor_id: '',
  doctor_query: '',
  active_substance_id: '',
  solvent_id: '',
  active_substance_dosage: '',
  solvent_dosage: '',
};

const genderLabel = (g: 'male' | 'female' | null | undefined) =>
  g === 'male' ? 'М' : g === 'female' ? 'Ж' : '';

export function AddRecipeModal({ onSuccess }: AddRecipeModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [closeRequestId, setCloseRequestId] = useState(0);

  const [substances, setSubstances] = useState<ISubstanceListItem[]>([]);
  const [solvents, setSolvents] = useState<ISolventListItem[]>([]);

  const [selectedPatient, setSelectedPatient] = useState<IPatientListItem | null>(null);
  const [createdAt, setCreatedAt] = useState<string>(formatNowDate());

  const [history, setHistory] = useState<IRecipeListItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [patientResults, setPatientResults] = useState<IPatientListItem[]>([]);
  const [isPatientLoading, setIsPatientLoading] = useState(false);
  const [doctorResults, setDoctorResults] = useState<IUserListItem[]>([]);
  const [isDoctorLoading, setIsDoctorLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddRecipeFormValues>({
    resolver: zodResolver(addRecipeSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: EMPTY_VALUES,
  });

  const patientQuery = watch('patient_query') ?? '';
  const doctorQuery = watch('doctor_query') ?? '';
  const patientId = watch('patient_id');
  const doctorId = watch('doctor_id');
  const activeSubstanceId = watch('active_substance_id');
  const activeSubstanceDosage = watch('active_substance_dosage');
  const solventId = watch('solvent_id');
  const solventDosage = watch('solvent_dosage');
  const debouncedPatientQuery = useDebounce(patientQuery.trim(), 300);
  const debouncedDoctorQuery = useDebounce(doctorQuery.trim(), 300);

  const selectedSubstance = substances.find((s) => s.id === activeSubstanceId) ?? null;
  const selectedSolvent = solvents.find((s) => s.id === solventId) ?? null;

  const toNumber = (v: string | undefined) => {
    if (!v) return null;
    const n = Number(v.replace(',', '.'));
    return Number.isNaN(n) ? null : n;
  };
  const substanceDosageNum = toNumber(activeSubstanceDosage);
  const solventDosageNum = toNumber(solventDosage);
  const concentration = selectedSubstance?.concentration ?? null;
  const substanceDosageMl =
    substanceDosageNum != null && concentration != null && concentration !== 0
      ? substanceDosageNum / concentration
      : null;
  const totalWeight =
    substanceDosageMl != null || solventDosageNum != null
      ? (substanceDosageMl ?? 0) + (solventDosageNum ?? 0)
      : null;

  useEffect(() => {
    if (selectedSolvent?.is_prefilled) {
      setValue('solvent_dosage', String(selectedSolvent.prefilled_volume), {
        shouldValidate: true,
      });
      clearErrors('solvent_dosage');
    }
  }, [selectedSolvent, setValue, clearErrors]);

  // Load substances + solvents once on mount.
  useEffect(() => {
    (substanceApi.getAllSubstance({ limit: 1000, offset: 0 }) as Promise<ISubstanceResponse>)
      .then((data) => setSubstances(data.substances ?? []))
      .catch(() => setSubstances([]));

    (solventApi.getAllSolvent({ limit: 1000, offset: 0 }) as Promise<ISolventResponse>)
      .then((data) => setSolvents(data.solvents ?? []))
      .catch(() => setSolvents([]));
  }, []);

  // Patient search.
  useEffect(() => {
    if (!debouncedPatientQuery || !patientQuery.trim() || patientId) {
      setPatientResults([]);
      setIsPatientLoading(false);
      return;
    }
    setIsPatientLoading(true);
    (patientApi.getSearchPatient({
      name: debouncedPatientQuery,
      limit: 10,
      offset: 0,
    }) as Promise<IPatientResponse>)
      .then((data) => setPatientResults(data.patients ?? []))
      .catch(() => setPatientResults([]))
      .finally(() => setIsPatientLoading(false));
  }, [debouncedPatientQuery, patientQuery, patientId]);

  // Doctor search.
  useEffect(() => {
    if (!debouncedDoctorQuery || !doctorQuery.trim() || doctorId) {
      setDoctorResults([]);
      setIsDoctorLoading(false);
      return;
    }
    setIsDoctorLoading(true);
    (userApi.search({
      name: debouncedDoctorQuery,
      limit: 1000,
      offset: 0,
    }) as Promise<IUserResponse>)
      .then((data) =>
        setDoctorResults(
          (data.users ?? []).filter(
            (u) => u.role === ROLES.DOCTOR || u.role === ROLES.HEAD_DOCTOR,
          ),
        ),
      )
      .catch(() => setDoctorResults([]))
      .finally(() => setIsDoctorLoading(false));
  }, [debouncedDoctorQuery, doctorQuery, doctorId]);

  const handlePatientPick = (p: IPatientListItem) => {
    setValue('patient_id', p.id, { shouldValidate: true });
    setValue('patient_query', fullName(p));
    setSelectedPatient(p);
    setPatientResults([]);
    clearErrors('patient_id');
  };

  const handleDoctorPick = (d: IUserListItem) => {
    setValue('doctor_id', d.id, { shouldValidate: true });
    setValue('doctor_query', fullName(d));
    setDoctorResults([]);
    clearErrors('doctor_id');
  };

  const handleApplyHistory = () => {
    if (!selectedHistoryId) return;
    const recipe = history.find((r) => r.id === selectedHistoryId);
    if (!recipe) return;

    setValue('patient_id', recipe.patient.id, { shouldValidate: true });
    setValue('patient_query', fullName(recipe.patient));
    setSelectedPatient(recipe.patient);

    setValue('doctor_id', recipe.doctor.id, { shouldValidate: true });
    setValue('doctor_query', fullName(recipe.doctor));

    setValue('active_substance_id', recipe.active_substance.id, { shouldValidate: true });
    setValue('solvent_id', recipe.solvent.id, { shouldValidate: true });
    setValue('active_substance_dosage', String(recipe.active_substance_dosage ?? ''), {
      shouldValidate: true,
    });
    setValue('solvent_dosage', String(recipe.solvent_dosage ?? ''), {
      shouldValidate: true,
    });

    clearErrors();
  };

  const onSubmit = async (values: AddRecipeFormValues) => {
    clearErrors('root');
    const payload = {
      patient_id: values.patient_id,
      doctor_id: values.doctor_id,
      active_substance_id: values.active_substance_id,
      solvent_id: values.solvent_id,
      active_substance_dosage: Number(values.active_substance_dosage.replace(',', '.')),
      solvent_dosage: Number(values.solvent_dosage.replace(',', '.')),
    };

    try {
      await recipeApi.createRecipe(payload);
      onSuccess?.();
      reset(EMPTY_VALUES);
      setCloseRequestId((current) => current + 1);
    } catch (error) {
      applyServerErrors(error as ApiFormError, setError);
    }
  };

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;
    const handleShow = (event: Event) => {
      const customEvent = event as Event & {
        relatedTarget?: EventTarget | null;
      };
      const trigger = customEvent.relatedTarget;
      lastTriggerRef.current = trigger instanceof HTMLElement ? trigger : null;
      setCreatedAt(formatNowDate());
    };
    const handleHide = () => {
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && modalElement.contains(activeElement)) {
        activeElement.blur();
      }
    };
    const handleHidden = () => {
      reset(EMPTY_VALUES);
      clearErrors();
      setPatientResults([]);
      setDoctorResults([]);
      setSelectedPatient(null);
      setHistory([]);
      setSelectedHistoryId(null);
      lastTriggerRef.current?.focus();
    };
    modalElement.addEventListener('show.bs.modal', handleShow);
    modalElement.addEventListener('hide.bs.modal', handleHide);
    modalElement.addEventListener('hidden.bs.modal', handleHidden);
    return () => {
      modalElement.removeEventListener('show.bs.modal', handleShow);
      modalElement.removeEventListener('hide.bs.modal', handleHide);
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, [clearErrors, reset]);

  useEffect(() => {
    if (!doctorId) {
      setHistory([]);
      setSelectedHistoryId(null);
      return;
    }
    setIsHistoryLoading(true);
    (recipeApi.postSearchRecipe(
      { doctor_id: doctorId },
      { limit: 50, offset: 0, order_by: 'date', sort_direction: 'desc' },
    ) as Promise<IRecipesResponse>)
      .then((data) => setHistory(data.recipes ?? []))
      .catch(() => setHistory([]))
      .finally(() => setIsHistoryLoading(false));
    setSelectedHistoryId(null);
  }, [doctorId]);

  useEffect(() => {
    if (closeRequestId === 0) return;
    modalRef.current
      ?.querySelector<HTMLButtonElement>('[data-bs-dismiss="modal"]')
      ?.click();
  }, [closeRequestId]);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="addRecipeModal"
      tabIndex={-1}
      aria-labelledby="addRecipeModalLabel"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addRecipeModalLabel">
              Создание рецепта
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <div className="add-recipe-layout">
              <div className="add-recipe-layout__card">
                <h6 className="add-recipe-layout__title">Новый рецепт</h6>
                <form
                  className="add-recipe-form"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="add-recipe-form__fields">
                <div className="add-recipe-form__col">
                  <Controller
                    control={control}
                    name="doctor_query"
                    render={({ field }) => (
                      <div className="add-recipe-form__picker">
                        <label className="form-label required" htmlFor="doctor-search">
                          Врач
                        </label>
                        <SearchInput
                          id="doctor-search"
                          value={field.value ?? ''}
                          onChange={(v) => {
                            field.onChange(v);
                            setValue('doctor_id', '');
                          }}
                          isLoading={isDoctorLoading}
                          hasResults={doctorResults.length > 0}
                          placeholder="Поиск врача"
                        >
                          <SearchDropdown
                            items={doctorResults}
                            getKey={(d) => d.id}
                            onSelect={handleDoctorPick}
                            renderItem={(d) => (
                              <span className="search-dropdown__name">
                                <strong>{d.last_name}</strong>{' '}
                                {d.first_name} {d.middle_name}
                              </span>
                            )}
                          />
                        </SearchInput>
                        {errors.doctor_id?.message && (
                          <div className="invalid-feedback d-block">
                            {errors.doctor_id.message}
                          </div>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    control={control}
                    name="patient_query"
                    render={({ field }) => (
                      <div className="add-recipe-form__picker">
                        <label className="form-label required" htmlFor="patient-search">
                          Пациент
                        </label>
                        <SearchInput
                          id="patient-search"
                          value={field.value ?? ''}
                          onChange={(v) => {
                            field.onChange(v);
                            setValue('patient_id', '');
                            setSelectedPatient(null);
                          }}
                          isLoading={isPatientLoading}
                          hasResults={patientResults.length > 0}
                          placeholder="Поиск пациента"
                        >
                          <SearchDropdown
                            items={patientResults}
                            getKey={(p) => p.id}
                            onSelect={handlePatientPick}
                            renderItem={(p) => (
                              <span className="search-dropdown__name">
                                <strong>{p.last_name}</strong>{' '}
                                {p.first_name} {p.middle_name}
                              </span>
                            )}
                          />
                        </SearchInput>
                        {errors.patient_id?.message && (
                          <div className="invalid-feedback d-block">
                            {errors.patient_id.message}
                          </div>
                        )}
                      </div>
                    )}
                  />

                  <Input
                    id="add-recipe-patient-gender"
                    label="Пол"
                    value={genderLabel(selectedPatient?.gender)}
                    readOnly
                    disabled
                    autoComplete="off"
                  />

                  <Input
                    id="add-recipe-patient-dob"
                    label="Дата рождения"
                    value={selectedPatient ? formatDate(selectedPatient.date_of_birth) : ''}
                    readOnly
                    disabled
                    autoComplete="off"
                  />

                  <Input
                    id="add-recipe-patient-department"
                    label="Отделение"
                    value={selectedPatient?.department ?? ''}
                    readOnly
                    disabled
                    autoComplete="off"
                  />

                  <Input
                    id="add-recipe-patient-room"
                    label="Палата"
                    value={
                      selectedPatient?.room_number != null
                        ? String(selectedPatient.room_number)
                        : ''
                    }
                    readOnly
                    disabled
                    autoComplete="off"
                  />

                  <Input
                    id="add-recipe-created-at"
                    label="Дата"
                    value={createdAt}
                    readOnly
                    disabled
                    autoComplete="off"
                  />
                </div>

                <div className="add-recipe-form__col">
                  <div className="add-recipe-form__row-2">
                    <Input
                      id="add-recipe-patient-height"
                      label="Рост (см)"
                      value={
                        selectedPatient?.height != null
                          ? String(selectedPatient.height)
                          : ''
                      }
                      readOnly
                      disabled
                      autoComplete="off"
                    />
                    <Input
                      id="add-recipe-patient-weight"
                      label="Вес (кг)"
                      value={
                        selectedPatient?.weight != null
                          ? String(selectedPatient.weight)
                          : ''
                      }
                      readOnly
                      disabled
                      autoComplete="off"
                    />
                  </div>

                  <Select
                    id="add-recipe-substance"
                    {...register('active_substance_id', {
                      onChange: () => clearErrors('active_substance_id'),
                    })}
                    label="Действующее вещество"
                    placeholder="Выберите вещество"
                    required
                    error={errors.active_substance_id?.message}
                    options={substances.map((s) => ({
                      value: s.id,
                      label: `${s.name} (${s.manufacturer})`,
                    }))}
                  />

                  <Input
                    id="add-recipe-substance-concentration"
                    label="Концентрация: мг/1мл"
                    value={
                      selectedSubstance?.concentration != null
                        ? String(selectedSubstance.concentration)
                        : ''
                    }
                    readOnly
                    disabled
                    autoComplete="off"
                  />

                  <div className="add-recipe-form__row-2">
                    <span className="required">Количество Д/В в дозе: мг/мл</span>
                    <Input
                      id="add-recipe-substance-dosage"
                      {...register('active_substance_dosage', {
                        onChange: () => clearErrors('active_substance_dosage'),
                      })}
                      placeholder="0"
                      type="number"
                      step="any"
                      inputMode="decimal"
                      required
                      autoComplete="off"
                      error={errors.active_substance_dosage?.message}
                    />
                    <Input
                      id="add-recipe-substance-dosage-ml"
                      value={substanceDosageMl != null ? String(substanceDosageMl) : ''}
                      readOnly
                      disabled
                      autoComplete="off"
                    />
                  </div>

                  <Select
                    id="add-recipe-solvent"
                    {...register('solvent_id', {
                      onChange: () => clearErrors('solvent_id'),
                    })}
                    label="Растворитель"
                    placeholder="Выберите растворитель"
                    required
                    error={errors.solvent_id?.message}
                    options={solvents.map((s) => ({
                      value: s.id,
                      label: `${s.name} (${s.manufacturer})`,
                    }))}
                  />

                  <Input
                    id="add-recipe-solvent-dosage"
                    {...register('solvent_dosage', {
                      onChange: () => clearErrors('solvent_dosage'),
                    })}
                    label="Кол-во растворителя/мл"
                    placeholder="0"
                    type="number"
                    step="any"
                    inputMode="decimal"
                    required
                    autoComplete="off"
                    disabled={selectedSolvent?.is_prefilled}
                    error={errors.solvent_dosage?.message}
                  />

                  <Input
                    id="add-recipe-total-weight"
                    label="Общий вес дозы/г"
                    value={totalWeight != null ? String(totalWeight) : ''}
                    readOnly
                    disabled
                    autoComplete="off"
                  />
                </div>
              </div>

                  {errors.root?.server?.message && (
                    <div className="invalid-feedback d-block">
                      {errors.root.server.message}
                    </div>
                  )}

                  <Button
                    className="primary w-100 has-icon"
                    type="submit"
                    iconBefore={<AddSaveIcon />}
                  >
                    Создать рецепт
                  </Button>
                </form>
              </div>

              <div className="add-recipe-layout__card">
                <h6 className="add-recipe-layout__title">История рецептов</h6>
                {isHistoryLoading ? (
                  <Loader position="absolute" />
                ) : history.length === 0 ? (
                  <div className="add-recipe-history__empty">Нет рецептов</div>
                ) : (
                  <div className="add-recipe-history__table-wrap">
                    <table className="add-recipe-history__table">
                      <thead>
                        <tr>
                          <th>№</th>
                          <th />
                          <th>№ Рецепта</th>
                          <th>Пациент</th>
                          <th>Пол</th>
                          <th>Дата</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((r, idx) => {
                          const isSelected = selectedHistoryId === r.id;
                          return (
                            <tr
                              key={r.id}
                              className={
                                isSelected ? 'add-recipe-history__row--selected' : undefined
                              }
                              onClick={() =>
                                setSelectedHistoryId(isSelected ? null : r.id)
                              }
                            >
                              <td>{idx + 1}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={isSelected}
                                  onChange={() =>
                                    setSelectedHistoryId(isSelected ? null : r.id)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label="Выбрать рецепт"
                                />
                              </td>
                              <td>{r.recipe_number}</td>
                              <td>{shortName(r.patient)}</td>
                              <td>{genderLabel(r.patient?.gender)}</td>
                              <td>{formatDate(r.created_at)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <Button
                  className="primary w-100 has-icon"
                  type="button"
                  iconBefore={<CheckCircleIcon />}
                  disabled={!selectedHistoryId}
                  onClick={handleApplyHistory}
                >
                  Применить в новом рецепте
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
