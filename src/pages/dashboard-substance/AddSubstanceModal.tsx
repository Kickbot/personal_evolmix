import { useForm, Controller } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { substance as substanceApi } from 'api';
import { Input } from 'ui/input';
import { Button } from 'ui/button';
import { Switch } from 'ui/switch';
import 'ui/switch/switch.css';
import './addSubstanceModal.css';
import { AddSaveIcon } from 'ui/icons/AddSaveIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import type { ISubstanceListItem } from 'types/substances.types';
import { CloseIcon } from 'ui/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSubstanceSchema, type AddSubstanceFormValues } from 'features/substances/model/addSubstance.schema';

interface AddSubstanceModalProps {
  onSuccess?: (updatedSubstance?: ISubstanceListItem) => void;
  editingSubstance?: ISubstanceListItem | null;
  onArchive?: () => void;
}

const EMPTY_VALUES: AddSubstanceFormValues = {
  name: '',
  manufacturer: '',
  country: '',
  is_lyophilizate: false,
  concentration: '',
  density: '',
};

export function AddSubstanceModal({
  onSuccess,
  editingSubstance,
  onArchive,
}: AddSubstanceModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [closeRequestId, setCloseRequestId] = useState(0);
  const isEditMode = Boolean(editingSubstance);

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_VALUES,
    resolver: zodResolver(addSubstanceSchema),
  });

  const onSubmit = async (values: AddSubstanceFormValues) => {
    try {
      if (editingSubstance) {
        const payload = {
          name: values.name,
          manufacturer: values.manufacturer,
          country: values.country,
          is_lyophilizate: values.is_lyophilizate,
          concentration: values.concentration
            ? Number(values.concentration.replace(',', '.'))
            : 0,
          density: values.density
            ? Number(values.density.replace(',', '.'))
            : 0,
          is_archived: editingSubstance.is_archived,
        };
        const response = (await substanceApi.patchSubstance(
          editingSubstance.id,
          payload,
        )) as { substance: ISubstanceListItem };
        onSuccess?.(response.substance);
      } else {
        const payload = {
          name: values.name,
          manufacturer: values.manufacturer,
          country: values.country,
          concentration: values.concentration
            ? Number(values.concentration.replace(',', '.'))
            : 0,
          density: values.density
            ? Number(values.density.replace(',', '.'))
            : 0,
          is_lyophilizate: values.is_lyophilizate,
        };
        const response = (await substanceApi.createSubstance(payload)) as {
          success: boolean;
          substance: ISubstanceListItem;
        };
        onSuccess?.(response.substance);
      }
      reset(EMPTY_VALUES);
      setCloseRequestId((current) => current + 1);
    } catch (error) {
      console.error('Error saving substance:', error);
    }
  };

  useEffect(() => {
    if (editingSubstance) {
      reset({
        name: editingSubstance.name,
        manufacturer: editingSubstance.manufacturer,
        country: editingSubstance.country,
        is_lyophilizate: editingSubstance.is_lyophilizate,
        concentration: editingSubstance.concentration?.toString() ?? '',
        density: editingSubstance.density?.toString() ?? '',
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [editingSubstance, reset]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;
    const handleShow = (event: Event) => {
      const customEvent = event as Event & {
        relatedTarget?: EventTarget | null;
      };
      const trigger = customEvent.relatedTarget;
      lastTriggerRef.current = trigger instanceof HTMLElement ? trigger : null;
    };
    const handleHide = () => {
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && modalElement.contains(activeElement)) {
        activeElement.blur();
      }
    };
    const handleHidden = () => {
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
  }, []);

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
      id="addSubstanceModal"
      tabIndex={-1}
      aria-labelledby="addSubstanceModalLabel"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addSubstanceModalLabel">
              {isEditMode
                ? 'Данные о препарате'
                : 'Добавление нового препарата'}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <form
              className="add-substance-form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="add-substance-form__fields">
                <div className="add-substance-form__left">
                  <Input
                    id="add-substance-name"
                    {...register('name', {
                      onChange: () => clearErrors('name'),
                    })}
                    label="Действующее вещество"
                    placeholder="Действующее вещество"
                    required
                    autoComplete="off"
                    error={errors.name?.message}
                  />
                  <Input
                    id="add-substance-concentration"
                    {...register('concentration', {
                      onChange: () => clearErrors('concentration'),
                    })}
                    label="Концентрация: мг/1мл"
                    placeholder="Концентрация"
                    required
                    autoComplete="off"
                    error={errors.concentration?.message}
                  />
                  <Input
                    id="add-substance-manufacturer"
                    {...register('manufacturer', {
                      onChange: () => clearErrors('manufacturer'),
                    })}
                    label="Производитель"
                    placeholder="Производитель"
                    required
                    autoComplete="off"
                    error={errors.manufacturer?.message}
                  />
                  <Input
                    id="add-substance-country"
                    {...register('country', {
                      onChange: () => clearErrors('country'),
                    })}
                    label="Страна"
                    placeholder="Страна"
                    required
                    autoComplete="off"
                    error={errors.country?.message}
                  />
                  <Controller
                    name="is_lyophilizate"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="add-substance-lyophilizate"
                        label="Лиофилизат"
                        labelClassName="text-uppercase"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-actions">
                <Button
                  className={`primary has-icon ${!isEditMode ? 'w-100' : ''}`}
                  type="submit"
                  iconBefore={<AddSaveIcon />}
                >
                  {isEditMode ? 'Обновить данные' : 'Сохранить'}
                </Button>
                {isEditMode && onArchive && (
                  <Button
                    className="secondary has-icon"
                    type="button"
                    iconBefore={<CloseIcon />}
                    data-bs-dismiss="modal"
                  >
                    Закрыть
                  </Button>
                )}
              </div>
            </form>
            {isEditMode && onArchive && (
              <div className="add-to-archive">
              <Button
                className="w-100 bordered has-icon"
                type="button"
                iconAfter={<ArchiveIcon />}
                onClick={onArchive}
              >
                {editingSubstance?.is_archived
                  ? 'Восстановить из архива'
                  : 'Переместить в архив'}
              </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
