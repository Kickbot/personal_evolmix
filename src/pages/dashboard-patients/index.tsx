import { useState } from 'react';
import { DataTable } from 'components/data-table';
import { SearchInput } from 'components/search-input';
import { PageToolbar } from 'components/page-toolbar';
import { Pagination } from 'components/pagination';
// import { AddPatientModal } from './AddPatientModal';
import { patientColumns } from './patientColumns';
import { usePatients } from './usePatients';
import './patients.css';
import { Button } from 'ui/button';
import { AddPlusIcon } from 'ui/icons/AddPlusIcon';
import { ArchiveIcon } from 'ui/icons/ArchiveIcon';
import { PatientDetails } from './patientDetails';

export default function Patients() {
  const { patients, expandedPatientId, setExpandedPatientId } = usePatients();
  const [searchName, setSearchName] = useState('');

  return (
    <>
      <div className="patients-header mb-4">
        <PageToolbar>
          <SearchInput
            value={searchName}
            onChange={setSearchName}
            placeholder="Поиск"
          />
          <Button
            className="primary has-icon"
            iconBefore={<AddPlusIcon />}
            onClick={() => {}}
          >
            Добавить пациента
          </Button>
          <Button
            className="bordered has-icon"
            iconAfter={<ArchiveIcon />}
          >
            Архив
          </Button>
        </PageToolbar>
      </div>

      <DataTable
        columns={patientColumns}
        data={patients}
        keyExtractor={(p) => p.id}
        expandedId={expandedPatientId}
        onRowClick={setExpandedPatientId}
        renderExpanded={(p) => <PatientDetails patient={p} />}
      />
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
      {/* <AddPatientModal /> */}
    </>
  );
}
