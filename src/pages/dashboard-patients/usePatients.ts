import { useEffect, useState } from 'react';
import { patient as patientApi } from 'api';
import type { IPatientListItem } from 'types/patients.types';

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

export function usePatients() {
  const [patients, setPatients] = useState<IPatientListItem[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  useEffect(() => {
    patientApi.getAllPatient({
      archived_status: 'all', // Available values : all, archived, nonarchived
      // Default value : nonarchived
      limit: DEFAULT_LIMIT,
      offset: DEFAULT_OFFSET,
    }).then((data: { patients: IPatientListItem[] }) => {
      setPatients(data.patients);
    })
  }, []);

  return {
    patients,
    // isLoading,
    expandedPatientId,
    setExpandedPatientId,
  };
}
