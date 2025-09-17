import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { DataImportTable } from '@/types/onboarding';

interface ColumnMappingStepProps {
  dataType?: DataImportTable;
  files: File[];
  mapping: Record<string, string>;
  setMapping: (m: Record<string, string>) => void;
}

const defaultAvailableColumns = [
  'TimeOn',
  'TimeOff',
  'StationId',
  'Alarmcode',
  'Parameter',
  'ID',
  'UK Text',
  'Error Type',
  'NewTimeOn',
  'EffectiveAlarmTime',
  'Period Siemens(s)',
  'Period Tarec(s)',
  'Error Group',
];

const alarmFields = [
  { id: 'turbineId', label: 'Turbine ID', required: true, description: 'Unique identifier for the turbine' },
  { id: 'alarmId', label: 'Alarm ID', required: true, description: 'Unique identifier for the alarm' },
  { id: 'timeOn', label: 'Time On', required: true, description: 'Original alarm start time' },
  { id: 'timeOff', label: 'Time Off', required: true, description: 'Alarm end time' },
  { id: 'newTimeOn', label: 'New Time On', required: true, description: 'Processed/adjusted alarm start time' },
  { id: 'alarmCategory', label: 'Alarm Category', required: true, description: '0 = Non-penalizing, 1 = Penalizing' },
];

// Wind farm timeseries (backend.timeseries.WindFarmTimeseries)
const windFields = [
  { id: 'time', label: 'Timestamp', required: true, description: 'Measurement time (UTC recommended)' },
  { id: 'node_id', label: 'Node ID', required: true, description: 'Turbine or measurement node identifier' },
  { id: 'active_power_min', label: 'Active Power (min)', required: false, description: 'kW' },
  { id: 'active_power_max', label: 'Active Power (max)', required: false, description: 'kW' },
  { id: 'active_power_mean', label: 'Active Power (mean)', required: false, description: 'kW' },
  { id: 'energy_accumulated', label: 'Energy Accumulated', required: false, description: 'kWh' },
  { id: 'energy_accumulated_export', label: 'Energy Exported', required: false, description: 'kWh' },
  { id: 'energy_accumulated_import', label: 'Energy Imported', required: false, description: 'kWh' },
  { id: 'wind_speed_mean', label: 'Wind Speed (mean)', required: false, description: 'm/s' },
  { id: 'wind_speed_stddev', label: 'Wind Speed (stddev)', required: false, description: 'm/s' },
  { id: 'wind_direction_mean', label: 'Wind Direction (mean)', required: false, description: 'degrees' },
  { id: 'wind_direction_stddev', label: 'Wind Direction (stddev)', required: false, description: 'degrees' },
  { id: 'power_reduction_time', label: 'Power Reduction Time', required: false, description: 'minutes/seconds (as provided)' },
  { id: 'measurement_wind_speed_mean', label: 'Measured Wind Speed (mean)', required: false, description: 'm/s' },
  { id: 'measurement_wind_direction_mean', label: 'Measured Wind Direction (mean)', required: false, description: 'degrees' },
];

// Solar farm timeseries (backend.timeseries.SolarFarmTimeseries)
const solarFields = [
  { id: 'time', label: 'Timestamp', required: true, description: 'Measurement time (UTC recommended)' },
  { id: 'node_id', label: 'Node ID', required: true, description: 'String/array combiner / inverter identifier' },
  { id: 'solar_irradiance', label: 'Solar Irradiance', required: true, description: 'W/m²' },
  { id: 'power_output', label: 'Power Output', required: true, description: 'kW' },
  { id: 'module_temperature', label: 'Module Temperature', required: true, description: '°C' },
];

const ColumnMappingStep: React.FC<ColumnMappingStepProps> = ({ dataType, files, mapping, setMapping }) => {
  const [available, setAvailable] = React.useState<string[]>(defaultAvailableColumns);

  React.useEffect(() => {
    // Try to parse header row from first text-based file (CSV/TXT)
    const f = files && files.length ? files[0] : undefined;
    if (!f) return;
    const lower = f.name.toLowerCase();
    const looksText = lower.endsWith('.csv') || lower.endsWith('.txt');
    if (!looksText) return;

    const detectDelimiter = (line: string): string => {
      const candidates = [',', ';', '\t', '|'];
      let best = ',';
      let bestCount = -1;
      for (const c of candidates) {
        const count = (line.match(new RegExp(`\\${c}`, 'g')) || []).length;
        if (count > bestCount) { bestCount = count; best = c; }
      }
      return best;
    };

    const splitHeader = (line: string): string[] => {
      const cleaned = line.replace(/^\uFEFF/, '').trim();
      const delim = detectDelimiter(cleaned);
      return cleaned
        .split(delim)
        .map(s => s.replace(/^\s*"|"\s*$/g, '').trim())
        .filter(Boolean);
    };

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const firstNonEmpty = (text.split(/\r?\n/).find(l => l.trim().length > 0) || '');
        const headers = splitHeader(firstNonEmpty);
        if (headers.length > 0) setAvailable(headers);
      } catch {}
    };
    reader.readAsText(f);
  }, [files]);

  // Prevent assigning the same source column to multiple target fields
  const usedColumns = React.useMemo(() => new Set(Object.values(mapping || {}).filter(Boolean)), [mapping]);

  const fields = React.useMemo(() => {
    if (dataType === 'timeseries_alarm') return alarmFields;
    if (dataType === 'timeseries_windfarmtimeseries') return windFields;
    if (dataType === 'timeseries_solarfarmtimeseries') return solarFields;
    return [];
  }, [dataType]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto px-1">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Column Mapping</h2>
        <p className="text-muted-foreground">Map columns from your file to the required database fields.</p>
      </div>

      {fields.length === 0 && (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          Column mapping will be enabled for the selected data type.
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <span>{field.label}</span>
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
                {mapping[field.id] && (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <Check className="h-3.5 w-3.5" />
                    <span>Mapped</span>
                  </div>
                )}
              </div>

              <Select
                value={mapping[field.id] || ''}
                onValueChange={(val) => setMapping({ ...mapping, [field.id]: val })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {available.map((col) => (
                    <SelectItem
                      key={`${field.id}-${col}`}
                      value={col}
                      disabled={usedColumns.has(col) && mapping[field.id] !== col}
                    >
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">{field.description}</p>
            </div>
          ))}

          {/* Alarm Category Note */}
          <div className="mt-2 p-3 rounded-md border bg-muted/50">
            <h4 className="text-xs font-medium mb-1">Note on Alarm Category:</h4>
            <p className="text-xs text-muted-foreground">• 0 = Non-penalizing</p>
            <p className="text-xs text-muted-foreground">• 1 = Penalizing</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Available Columns</h3>
        <div className="flex flex-wrap gap-2">
          {available.map((col) => (
            <Badge key={`avail-${col}`} variant="secondary" className="capitalize">
              {col}
            </Badge>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
        You can finalize mapping now or refine it later from the data import section.
      </div>
    </div>
  );
};

export default ColumnMappingStep;
