export type DataImportTable = 'timeseries_alarm' | 'timeseries_solarfarmtimeseries' | 'timeseries_windfarmtimeseries';

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
  dataConnection: string;
  dataType?: DataImportTable;
  dataFiles: File[];
}
