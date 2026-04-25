import { Button } from 'ui/button';
import { ArchiveIcon, CloseIcon, CheckCircleIcon } from 'ui/icons';
import { formatDate } from 'utils/date';
import { shortName } from 'utils/name';
import type { ITaskListItem } from 'types/tasks.types';
import type { IRecipeListItem } from 'types/recipes.types';
import type { IWarehouseListItem } from 'types/warehouse.types';

interface TaskDetailsProps {
  task: ITaskListItem;
  onClose: () => void;
}

function DoseTable({ recipes }: { recipes: IRecipeListItem[] }) {
  return (
    <table className="td-table">
      <thead>
        <tr>
          <th>№</th>
          <th>Пациент</th>
          <th>Лечащие врачи</th>
          <th>Акт. Вещество / мг</th>
          <th>Раствор / мл</th>
          <th>Общий вес</th>
        </tr>
      </thead>
      <tbody>
        {recipes.length === 0 ? (
          <tr>
            <td colSpan={6} className="td-empty">Нет доз</td>
          </tr>
        ) : (
          recipes.map((r, i) => (
            <tr key={r.id}>
              <td>{i + 1}</td>
              <td>{shortName(r.patient)}</td>
              <td>{shortName(r.doctor)}</td>
              <td>
                {r.active_substance?.name} / {r.active_substance_dosage} мг.
              </td>
              <td>
                {r.solvent?.name} / {r.solvent_dosage} мл.
              </td>
              <td>{r.total_dosage_ml ?? '-'} г.</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function MaterialsTable({ packs }: { packs: IWarehouseListItem[] }) {
  return (
    <table className="td-table">
      <thead>
        <tr>
          <th>№</th>
          <th>Акт. Вещество</th>
          <th>Количество / шт</th>
          <th>Тара (мг/мл)</th>
        </tr>
      </thead>
      <tbody>
        {packs.length === 0 ? (
          <tr>
            <td colSpan={4} className="td-empty">Нет материалов</td>
          </tr>
        ) : (
          packs.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td>
                {p.active_substance?.name} / {p.active_substance?.manufacturer},{' '}
                {p.active_substance?.country}
              </td>
              <td>{p.wh_quantity ?? '-'}</td>
              <td>
                {p.volume ?? '-'}/{p.active_substance?.concentration ?? '-'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function Module({
  title,
  modifier,
  recipes,
  packs,
}: {
  title: string;
  modifier: 'a' | 'b';
  recipes: IRecipeListItem[];
  packs: IWarehouseListItem[];
}) {
  return (
    <div className="td-module">
      <div className={`td-module__title td-module__title--${modifier}`}>
        {title}
      </div>
      <div className="td-module__section-title">Список плановых доз:</div>
      <DoseTable recipes={recipes} />
      <div className="td-module__section-title mt-3">
        Исходные материалы (обработаны фармацевтом):
      </div>
      <MaterialsTable packs={packs} />
    </div>
  );
}

export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  const recipesA = task.recipes.filter((r) => r.recipie_type === 'A');
  const recipesB = task.recipes.filter((r) => r.recipie_type === 'B');

  return (
    <div className="dt-details p-4">
      <div className="td-card">
        <div className="td-card__header">
          <div className="td-card__doses">
            <span className="td-card__doses-num">{task.recipes.length}</span>
            <span className="td-card__doses-label">Дозы</span>
          </div>
          <div className="td-card__info">
            <div className="td-card__info-row">
              <span className="td-card__info-label">Фармацевт:</span>
              <span className="td-card__info-value">
                {shortName(task.pharmacist) || '-'}
              </span>
              <span className="td-card__info-date">
                {formatDate(task.created_at)}
              </span>
            </div>
            <div className="td-card__info-row">
              <span className="td-card__info-label">Оператор:</span>
              <span className="td-card__info-value">
                {shortName(task.operator) || '-'}
              </span>
              <span className="td-card__info-date">
                {formatDate(task.processed_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="td-modules">
          <Module
            title="Модуль  A"
            modifier="a"
            recipes={recipesA}
            packs={task.active_substance_packs_a}
          />
          <Module
            title="Модуль  B"
            modifier="b"
            recipes={recipesB}
            packs={task.active_substance_packs_b}
          />
        </div>
      </div>

      <div className="dt-details-btn">
        <Button
          className="primary has-icon"
          iconBefore={<CheckCircleIcon />}
          onClick={() => {}}
        >
          Взять в работу
        </Button>
        <Button
          className="bordered has-icon"
          iconAfter={<ArchiveIcon />}
          onClick={() => {}}
        >
          Переместить в архив
        </Button>
        <Button
          className="secondary has-icon ms-auto"
          iconBefore={<CloseIcon />}
          onClick={onClose}
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
}
