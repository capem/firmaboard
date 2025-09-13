export type DataImportTable = 'timeseries_alarm' | 'timeseries_solarfarmtimeseries' | 'timeseries_windfarmtimeseries';

export type StageType = 'windfarm' | 'solarfarm';

export interface Stage {
  id: string;
  type: StageType;
  // Data captured for the selected stage type. Keys depend on type.
  data: Record<string, any>;
  saved?: boolean;
}

export interface ModelSuggestion {
  type: 'wind' | 'solar';
  manufacturer: string;
  model_name: string;
}

export interface OnboardingData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: string;
  companyName: string;
  companyDefinitions: string[];
  mainOutput: string;
  // New Stage Setup step data
  stages: Stage[];
  dataConnection: string;
  dataType?: DataImportTable;
  dataFiles: File[];
  // Suggestions added during asset setup to be persisted after registration (if needed)
  pendingModelSuggestions: ModelSuggestion[];
}
