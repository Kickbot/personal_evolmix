import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { warehouse as warehouseApi, substance as substanceApi } from 'api';
import { Input } from 'ui/input';
import { Button } from 'ui/button';
import { Select } from 'ui/select';
import './addWarehouseModal.css';
import { AddSaveIcon } from 'ui/icons/AddSaveIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import { CloseIcon } from 'ui/icons';
import type { IWarehouseListItem } from 'types/warehouse.types';
import type { ISubstanceListItem } from 'types/substances.types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addWarehouseSchema,
  type AddWarehouseFormValues,
} from 'features/warehouses/model/addWarehouse.schema';

interface AddWarehouseModalProps {
  onSuccess?: (updatedWarehouse?: IWarehouseListItem) => void;
  editingWarehouse?: IWarehouseListItem | null;
  onArchive?: () => void;
}

const EMPTY_VALUES: AddWarehouseFormValues = {
  active_substance_id: '',
  volume: undefined,
  wh_quantity: undefined,
};

export function AddWarehouseModal({
  onSuccess,
  editingWarehouse,
  onArchive,
}: AddWarehouseModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [closeRequestId, setCloseRequestId] = useState(0);
  const [substances, setSubstances] = useState<ISubstanceListItem[]>([]);
  const [isLoadingSubstances, setIsLoadingSubstances] = useState(false);
  const isEditMode = Boolean(editingWarehouse);

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<AddWarehouseFormValues>({
    defaultValues: EMPTY_VALUES,
    resolver: zodResolver(addWarehouseSchema),
  });

  useEffect(() => {
    const loadSubstances = async () => {
      setIsLoadingSubstances(true);
      try {
        const data = await substanceApi.getAllSubstance({
          archived_status: 'nonarchived',
          limit: 1000,
          offset: 0,
        }) as { total: number; substances: ISubstanceListItem[] };
        setSubstances(data.substances);
      } catch {
        setSubstances([]);
      } finally {
        setIsLoadingSubstances(false);
      }
    };
    loadSubstances();
  }, []);

  const onSubmit = async (values: AddWarehouseFormValues) => {
    clearErrors();
    try {
      if (editingWarehouse) {
        const payload = {
          volume: values.volume ? Number(values.volume.replace(',', '.')) : null,
          wh_quantity: values.wh_quantity ? Number(values.wh_quantity.replace(',', '.')) : null,
          is_archived: editingWarehouse.is_archived,
        };
        const response = (await warehouseApi.patchWarehouse(
          editingWarehouse.id,
          payload,
        )) as IWarehouseListItem;
        onSuccess?.(response);
      } else {
        const payload = {
          active_substance_id: values.active_substance_id,
          volume: values.volume ? Number(values.volume.replace(',', '.')) : null,
          wh_quantity: values.wh_quantity ? Number(values.wh_quantity.replace(',', '.')) : null,
        };
        const response = (await warehouseApi.createWarehouse(payload)) as IWarehouseListItem;
        onSuccess?.(response);
      }
      reset(EMPTY_VALUES);
      setCloseRequestId((current) => current + 1);
    } catch (error) {
      console.error('Error saving warehouse item:', error);
    }
  };

  useEffect(() => {
    if (editingWarehouse) {
      reset({
        active_substance_id: editingWarehouse.active_substance_id,
        volume: editingWarehouse.volume?.toString() ?? '',
        wh_quantity: editingWarehouse.wh_quantity?.toString() ?? '',
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [editingWarehouse, reset]);

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

  const substanceOptions = substances.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="addWarehouseModal"
      tabIndex={-1}
      aria-labelledby="addWarehouseModalLabel"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addWarehouseModalLabel">
              {isEditMode
                ? 'Редактировать товар на складе'
                : 'Добавить товар на склад'}
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
              className="add-warehouse-form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="add-warehouse-form__fields">
                <div className="add-warehouse-form__left">
                  {!isEditMode && (
                    <Select
                      id="add-warehouse-substance"
                      {...register('active_substance_id', {
                        onChange: () => clearErrors('active_substance_id'),
                      })}
                      label="Действующее вещество"
                      placeholder="Выберите вещество"
                      required
                      error={errors.active_substance_id?.message}
                      disabled={isLoadingSubstances}
                      options={substanceOptions}
                    />
                  )}
                  {isEditMode && (
                    <Select
                      id="add-warehouse-substance"
                      {...register('active_substance_id', {
                        onChange: () => clearErrors('active_substance_id'),
                      })}
                      label="Действующее вещество"
                      required
                      error={errors.active_substance_id?.message}
                      disabled
                      options={substanceOptions}
                    />
                  )}
                  <Input
                    id="add-warehouse-volume"
                    {...register('volume', {
                      onChange: () => clearErrors('volume'),
                    })}
                    label="Тара (мг/мл)"
                    placeholder="Тара"
                    autoComplete="off"
                    error={errors.volume?.message}
                  />
                  <Input
                    id="add-warehouse-quantity"
                    {...register('wh_quantity', {
                      onChange: () => clearErrors('wh_quantity'),
                    })}
                    label="Количество"
                    placeholder="Количество"
                    autoComplete="off"
                    error={errors.wh_quantity?.message}
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
                {editingWarehouse?.is_archived
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
