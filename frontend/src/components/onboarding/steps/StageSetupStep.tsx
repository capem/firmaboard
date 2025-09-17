import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Stage, StageType } from '@/types/onboarding';
import { cn } from '@/lib/utils';
import { Plus, Trash2, CheckCircle2, Search, X, Loader2 } from 'lucide-react';
import { api, ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

interface StageSetupStepProps {
  stages: Stage[];
  setStages: (stages: Stage[]) => void;
  localSuggestions?: { type: 'wind' | 'solar'; manufacturer: string; model_name: string }[];
  onSuggestionAdded?: (s: { type: 'wind' | 'solar'; manufacturer: string; model_name: string }) => void;
}

const windfarmFields: { key: string; label: string; type: 'text' | 'number' }[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'latitude', label: 'Latitude', type: 'number' },
  { key: 'longitude', label: 'Longitude', type: 'number' },
  { key: 'total_area', label: 'Total Area (ha)', type: 'number' },
  { key: 'nominal_power', label: 'Nominal Power (MW)', type: 'number' },
  { key: 'number_of_turbines', label: 'Number of Turbines', type: 'number' },
];

const solarfarmFields: { key: string; label: string; type: 'text' | 'number' | 'boolean' }[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'latitude', label: 'Latitude', type: 'number' },
  { key: 'longitude', label: 'Longitude', type: 'number' },
  { key: 'total_area', label: 'Total Area (ha)', type: 'number' },
  { key: 'nominal_power', label: 'Nominal Power (MW)', type: 'number' },
  { key: 'number_of_panels', label: 'Number of Panels', type: 'number' },
  // boolean field handled with Checkbox
];

const StageSetupStep: React.FC<StageSetupStepProps> = ({ stages, setStages, localSuggestions = [], onSuggestionAdded }) => {
  const addStage = () => {
    const newStage: Stage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: 'windfarm',
      data: {},
      saved: false,
    };
    setStages([...(stages || []), newStage]);
  };

  const updateStageType = (id: string, type: StageType) => {
    setStages(
      (stages || []).map((s) => (s.id === id ? { ...s, type, saved: false } : s))
    );
  };

  const updateStageField = (id: string, key: string, value: any) => {
    setStages(
      (stages || []).map((s) =>
        s.id === id ? { ...s, data: { ...s.data, [key]: value }, saved: false } : s
      )
    );
  };

  const toggleSolarTracking = (id: string, checked: boolean) => {
    updateStageField(id, 'tracking_system', checked);
  };

  const removeStage = (id: string) => {
    setStages((stages || []).filter((s) => s.id !== id));
  };

  const markSaved = (id: string) => {
    setStages((stages || []).map((s) => (s.id === id ? { ...s, saved: true } : s)));
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Configure Assets</h2>
          <p className="text-muted-foreground">Add one or more assets and choose the data type.</p>
        </div>
        <Button onClick={addStage} className="gap-2">
          <Plus className="w-4 h-4" />
          ADD ASSET
        </Button>
      </div>

      <div className="flex-1 space-y-3 md:space-y-4">
        {(stages || []).length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            No assets added yet. Click "ADD ASSET" to begin.
          </Card>
        )}

        {(stages || []).map((stage, idx) => {
          const isSolar = stage.type === 'solarfarm';
          return (
            <Card key={stage.id} className="p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Asset {idx + 1}</h3>
                  {stage.saved && (
                    <Badge variant="secondary" className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Saved
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeStage(stage.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-3 grid gap-4">
                <div className="space-y-2">
                  <Label>Data Type</Label>
                  <RadioGroup
                    value={stage.type}
                    onValueChange={(val) => updateStageType(stage.id, val as StageType)}
                    className="grid grid-cols-2 gap-3 md:max-w-sm"
                  >
                    <div className={cn('flex items-center space-x-2 rounded-lg border p-3', stage.type === 'windfarm' && 'border-primary') }>
                      <RadioGroupItem id={`${stage.id}-wind`} value="windfarm" />
                      <Label htmlFor={`${stage.id}-wind`} className="text-sm">Windfarm</Label>
                    </div>
                    <div className={cn('flex items-center space-x-2 rounded-lg border p-3', stage.type === 'solarfarm' && 'border-primary') }>
                      <RadioGroupItem id={`${stage.id}-solar`} value="solarfarm" />
                      <Label htmlFor={`${stage.id}-solar`} className="text-sm">Solarfarm</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* FARM MODEL selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">FARM MODEL</Label>
                  <FarmModelSelector
                    stage={stage}
                    extraLocal={(localSuggestions || []).filter((s) => s.type === (isSolar ? 'solar' : 'wind')).map((s) => ({ label: `${s.manufacturer} - ${s.model_name}` }))}
                    onAddedSuggestion={onSuggestionAdded}
                    onSelect={(id: number | null, label: string) => {
                      if (stage.type === 'solarfarm') {
                        updateStageField(stage.id, 'panel_model_id', id);
                        updateStageField(stage.id, 'panel_model_label', label);
                        updateStageField(stage.id, 'custom_model', id === null);
                      } else {
                        updateStageField(stage.id, 'turbine_model_id', id);
                        updateStageField(stage.id, 'turbine_model_label', label);
                        updateStageField(stage.id, 'custom_model', id === null);
                      }
                    }}
                    onClear={() => {
                      if (stage.type === 'solarfarm') {
                        updateStageField(stage.id, 'panel_model_id', null);
                        updateStageField(stage.id, 'panel_model_label', '');
                      } else {
                        updateStageField(stage.id, 'turbine_model_id', null);
                        updateStageField(stage.id, 'turbine_model_label', '');
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(isSolar ? solarfarmFields : windfarmFields).map((f) => (
                    <div key={`${stage.id}-${f.key}`} className="space-y-1.5">
                      <Label htmlFor={`${stage.id}-${f.key}`} className="text-sm">{f.label}</Label>
                      <Input
                        id={`${stage.id}-${f.key}`}
                        type={f.type === 'number' ? 'number' : 'text'}
                        value={stage.data?.[f.key] ?? ''}
                        onChange={(e) => updateStageField(stage.id, f.key, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                      />
                    </div>
                  ))}

                  {isSolar && (
                    <div className="space-y-1.5">
                      <Label htmlFor={`${stage.id}-tracking_system`} className="text-sm">Tracking System</Label>
                      <div className="flex items-center gap-2 h-10">
                        <Checkbox
                          id={`${stage.id}-tracking_system`}
                          checked={!!stage.data?.tracking_system}
                          onCheckedChange={(v) => toggleSolarTracking(stage.id, Boolean(v))}
                        />
                        <span className="text-sm text-muted-foreground">Enable tracking</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <Button variant="secondary" onClick={() => markSaved(stage.id)} className="gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Save Asset
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="rounded-lg border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
        You can proceed to Data Integration after adding at least one asset.
      </div>
    </div>
  );
};

// Farm Model Selector component
const FarmModelSelector: React.FC<{ stage: Stage; onSelect: (id: number | null, label: string) => void; onClear: () => void; extraLocal?: { label: string }[]; onAddedSuggestion?: (s: { type: 'wind' | 'solar'; manufacturer: string; model_name: string }) => void; }> = ({ stage, onSelect, onClear, extraLocal = [], onAddedSuggestion }) => {
  const isSolar = stage.type === 'solarfarm';
  const { toast } = useToast();
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<{ id: number | string; label: string; manufacturer?: string; model_name?: string }[]>([]);
  const [showAdd, setShowAdd] = React.useState(false);
  const [manufacturer, setManufacturer] = React.useState('');
  const [modelName, setModelName] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const selectedLabel: string = isSolar ? (stage.data?.panel_model_label || '') : (stage.data?.turbine_model_label || '');

  React.useEffect(() => {
    let active = true;
    const fetchModels = async () => {
      const q = query.trim();
      if (q.length < 2) { setResults([]); return; }
      setLoading(true);
      try {
        const url = isSolar ? ENDPOINTS.farms.solarModels : ENDPOINTS.farms.windModels;
        const resp = await api.get(url, { params: { q } });
        if (!active) return;
        const serverItems = (resp.data || []) as { id: number; label: string }[];
        // Merge local extras that match the query
        const merged = [...serverItems];
        if (extraLocal && extraLocal.length) {
          const qLower = q.toLowerCase();
          const extraMatches = extraLocal
            .filter((x) => x.label.toLowerCase().includes(qLower))
            .filter((x) => !merged.some((m) => m.label.toLowerCase() === x.label.toLowerCase()))
            .map((x) => ({ id: `local:${x.label}`, label: x.label }));
          merged.push(...extraMatches);
        }
        setResults(merged);
      } catch (e) {
        if (!active) return;
        // Even if server fails, still show local extras
        const qLower = q.toLowerCase();
        const extraMatches = (extraLocal || [])
          .filter((x) => x.label.toLowerCase().includes(qLower))
          .map((x) => ({ id: `local:${x.label}`, label: x.label }));
        setResults(extraMatches);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchModels();
    return () => { active = false; };
  }, [query, isSolar, extraLocal]);

  const handleSelect = (item: { id: number | string; label: string }) => {
    const idToSend = typeof item.id === 'number' ? item.id : null;
    onSelect(idToSend, item.label);
    setQuery('');
  };

  const useCustomModel = async () => {
    const m = manufacturer.trim();
    const n = modelName.trim();
    const label = `${m} - ${n}`.trim().replace(/^\s*-\s*$/, '');
    if (!m || !n || !label || label === '-') return;
    setSaving(true);
    try {
      const url = isSolar ? ENDPOINTS.farms.solarModels : ENDPOINTS.farms.windModels;
      const resp = await api.post(url, { manufacturer: m, model_name: n });
      const item = resp.data as { id: number; label: string };
      onSelect(item.id, item.label);
      // Record locally so other assets immediately see this model
      onAddedSuggestion?.({ type: isSolar ? 'solar' : 'wind', manufacturer: m, model_name: n });
      setShowAdd(false);
      setManufacturer('');
      setModelName('');
    } catch (e: any) {
      const msg = e?.response?.data?.detail || 'Failed to save model to the database. Please try again.';
      toast({ title: 'Save model failed', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const hasSelection = Boolean(selectedLabel);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">
          {isSolar ? 'Solar Farm model' : 'Wind Farm model'}
        </Label>
        {hasSelection && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClear}>
            <X className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      {hasSelection && (
        <div className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm">
          <span className="truncate max-w-[280px]">{selectedLabel}</span>
        </div>
      )}

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={isSolar ? 'Search panel models (e.g., Jinko 410W)' : 'Search turbine models (e.g., Vestas V90)'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
            {loading && <Loader2 className="w-4 h-4 animate-spin absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />}
          </div>
          <Button type="button" variant="outline" className="h-10" onClick={() => setShowAdd((s) => !s)}>
            {showAdd ? 'Cancel' : 'Add model'}
          </Button>
        </div>

        {query.trim().length >= 2 && results.length > 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-md border bg-popover p-1 shadow-sm">
            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <div className="space-y-1">
            <Label className="text-xs">Manufacturer</Label>
            <Input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="e.g., Vestas / Jinko" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Model Name</Label>
            <Input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="e.g., V90 / Tiger Neo" />
          </div>
          <div className="flex items-end">
            <Button type="button" className="w-full" onClick={useCustomModel} disabled={!manufacturer || !modelName || saving}>
              {saving ? 'Saving...' : 'Use this model'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageSetupStep;

