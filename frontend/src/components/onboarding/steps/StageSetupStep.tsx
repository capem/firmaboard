import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Stage, StageType } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import { Plus, Trash2, CheckCircle2, Search, X, Loader2 } from "lucide-react";
import { api, ENDPOINTS } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface StageSetupStepProps {
  stages: Stage[];
  setStages: (stages: Stage[]) => void;
  localSuggestions?: {
    type: "wind" | "solar";
    manufacturer: string;
    model_name: string;
  }[];
  onSuggestionAdded?: (s: {
    type: "wind" | "solar";
    manufacturer: string;
    model_name: string;
  }) => void;
}

const windfarmFields: {
  key: string;
  label: string;
  type: "text" | "number";
}[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
  { key: "total_area", label: "Total Area (ha)", type: "number" },
  { key: "nominal_power", label: "Nominal Power (MW)", type: "number" },
  { key: "number_of_turbines", label: "Number of Turbines", type: "number" },
];

const solarfarmFields: {
  key: string;
  label: string;
  type: "text" | "number" | "boolean";
}[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
  { key: "total_area", label: "Total Area (ha)", type: "number" },
  { key: "nominal_power", label: "Nominal Power (MW)", type: "number" },
  { key: "number_of_panels", label: "Number of Panels", type: "number" },
  // boolean field handled with Checkbox
];

const StageSetupStep: React.FC<StageSetupStepProps> = ({
  stages,
  setStages,
  localSuggestions = [],
  onSuggestionAdded,
}) => {
  const { toast } = useToast();
  const [companyAssets, setCompanyAssets] = React.useState<Stage[]>([]);

  React.useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get(ENDPOINTS.farms.assets);
        const assets = response.data.map((asset: any) => ({
          id: asset.id,
          type: asset.type === "wind" ? "windfarm" : "solarfarm",
          data: asset,
          saved: true,
        }));
        setCompanyAssets(assets);
      } catch (error) {
        console.error("Failed to fetch company assets:", error);
      }
    };

    fetchAssets();
  }, []);

  const allStages = React.useMemo(() => {
    const combined = [
      ...companyAssets,
      ...stages.filter((s) => !companyAssets.some((ca) => ca.id === s.id)),
    ];
    return combined;
  }, [companyAssets, stages]);

  const addStage = () => {
    const newStage: Stage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: "windfarm",
      data: {},
      saved: false,
    };
    setStages([...(stages || []), newStage]);
  };

  const updateStageType = (id: string, type: StageType) => {
    setStages(
      (stages || []).map((s) =>
        s.id === id ? { ...s, type, saved: false } : s
      )
    );
  };

  const updateStageField = (id: string, key: string, value: any) => {
    setStages(
      (stages || []).map((s) =>
        s.id === id
          ? { ...s, data: { ...s.data, [key]: value }, saved: false }
          : s
      )
    );
  };

  const toggleSolarTracking = (id: string, checked: boolean) => {
    updateStageField(id, "tracking_system", checked);
  };

  const removeStage = (id: string) => {
    setStages((stages || []).filter((s) => s.id !== id));
  };

  const saveAsset = async (id: string | number) => {
    const stage = allStages.find((s) => s.id === id);
    if (!stage) return;

    const isNew = typeof id === "string";

    const payload = {
      ...stage.data,
      type: stage.type === "solarfarm" ? "solar" : "wind",
    };

    if (isNew) {
      delete payload.id;
    }

    console.log("Saving asset with payload:", payload);

    try {
      let savedAsset;
      if (isNew) {
        const response = await api.post(ENDPOINTS.farms.assets, payload);
        savedAsset = response.data;
      } else {
        const response = await api.put(
          `${ENDPOINTS.farms.assets}${id}/`,
          payload
        );
        savedAsset = response.data;
      }

      const newAssetState: Stage = {
        id: savedAsset.id,
        type: savedAsset.type === "wind" ? "windfarm" : "solarfarm",
        data: savedAsset,
        saved: true,
      };

      if (isNew) {
        setStages(stages.filter((s) => s.id !== id));
        setCompanyAssets((prev) => [...prev, newAssetState]);
      } else {
        setCompanyAssets((prev) =>
          prev.map((a) => (a.id === id ? newAssetState : a))
        );
        setStages(stages.map((s) => (s.id === id ? newAssetState : s)));
      }

      toast({
        title: "Asset Saved!",
        description: `Asset "${savedAsset.name}" has been successfully saved.`,
      });
    } catch (err) {
      console.error("Failed to save asset", err);
      toast({
        title: "Save Failed",
        description:
          "An error occurred while saving the asset. It might be incomplete.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto px-1">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Configure Assets
          </h2>
          <p className="text-muted-foreground">
            Add one or more assets and choose the data type.
          </p>
        </div>
        <Button onClick={addStage} className="gap-2">
          <Plus className="w-4 h-4" />
          ADD ASSET
        </Button>
      </div>

      <div className="flex-1 space-y-3 md:space-y-4">
        {(allStages || []).length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            No assets added yet. Click "ADD ASSET" to begin.
          </Card>
        )}

        {(allStages || []).map((stage, idx) => {
          const isSolar = stage.type === "solarfarm";
          return (
            <Card key={stage.id} className="p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Asset {idx + 1}</h3>
                  {stage.saved && (
                    <Badge
                      variant="secondary"
                      className="inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />{" "}
                      Saved
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStage(stage.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-3 grid gap-4">
                <div className="space-y-2">
                  <Label>Data Type</Label>
                  <RadioGroup
                    value={stage.type}
                    onValueChange={(val) =>
                      updateStageType(stage.id, val as StageType)
                    }
                    className="grid grid-cols-2 gap-3 md:max-w-sm"
                  >
                    <div
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border p-3",
                        stage.type === "windfarm" && "border-primary"
                      )}
                    >
                      <RadioGroupItem
                        id={`${stage.id}-wind`}
                        value="windfarm"
                      />
                      <Label htmlFor={`${stage.id}-wind`} className="text-sm">
                        Windfarm
                      </Label>
                    </div>
                    <div
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border p-3",
                        stage.type === "solarfarm" && "border-primary"
                      )}
                    >
                      <RadioGroupItem
                        id={`${stage.id}-solar`}
                        value="solarfarm"
                      />
                      <Label htmlFor={`${stage.id}-solar`} className="text-sm">
                        Solarfarm
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Farm Model selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {isSolar ? "Panel Model" : "Turbine Model"}
                  </Label>
                  <FarmModelSelector
                    stage={stage}
                    extraLocal={(localSuggestions || [])
                      .filter((s) => s.type === (isSolar ? "solar" : "wind"))
                      .map((s) => ({
                        label: `${s.manufacturer} - ${s.model_name}`,
                      }))}
                    onAddedSuggestion={onSuggestionAdded}
                    onSelect={(id: number | null, label: string) => {
                      console.log("FarmModelSelector onSelect:", { id, label });
                      if (stage.type === "solarfarm") {
                        updateStageField(stage.id, "panel_model_id", id);
                        updateStageField(stage.id, "panel_model_label", label);
                        updateStageField(stage.id, "custom_model", id === null);
                      } else {
                        updateStageField(stage.id, "turbine_model_id", id);
                        updateStageField(
                          stage.id,
                          "turbine_model_label",
                          label
                        );
                        updateStageField(stage.id, "custom_model", id === null);
                      }
                    }}
                    onClear={() => {
                      if (stage.type === "solarfarm") {
                        updateStageField(stage.id, "panel_model_id", null);
                        updateStageField(stage.id, "panel_model_label", "");
                      } else {
                        updateStageField(stage.id, "turbine_model_id", null);
                        updateStageField(stage.id, "turbine_model_label", "");
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(isSolar ? solarfarmFields : windfarmFields).map((f) => (
                    <div key={`${stage.id}-${f.key}`} className="space-y-1.5">
                      <Label
                        htmlFor={`${stage.id}-${f.key}`}
                        className="text-sm"
                      >
                        {f.label}
                      </Label>
                      <Input
                        id={`${stage.id}-${f.key}`}
                        type={f.type === "number" ? "number" : "text"}
                        value={stage.data?.[f.key] ?? ""}
                        onChange={(e) =>
                          updateStageField(
                            stage.id,
                            f.key,
                            f.type === "number"
                              ? e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                              : e.target.value
                          )
                        }
                      />
                    </div>
                  ))}

                  {isSolar && (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`${stage.id}-tracking_system`}
                        className="text-sm"
                      >
                        Tracking System
                      </Label>
                      <div className="flex items-center gap-2 h-10">
                        <Checkbox
                          id={`${stage.id}-tracking_system`}
                          checked={!!stage.data?.tracking_system}
                          onCheckedChange={(v) =>
                            toggleSolarTracking(stage.id, Boolean(v))
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          Enable tracking
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <Button
                    variant="secondary"
                    onClick={() => saveAsset(stage.id)}
                    className="gap-2"
                  >
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
const FarmModelSelector: React.FC<{
  stage: Stage;
  onSelect: (id: number | null, label: string) => void;
  onClear: () => void;
  extraLocal?: { label: string }[];
  onAddedSuggestion?: (s: {
    type: "wind" | "solar";
    manufacturer: string;
    model_name: string;
  }) => void;
}> = ({ stage, onSelect, onClear, extraLocal = [], onAddedSuggestion }) => {
  const isSolar = stage.type === "solarfarm";
  const { toast } = useToast();
  const selectedLabel: string = isSolar
    ? stage.data?.panel_model_label || ""
    : stage.data?.turbine_model_label || "";

  const [query, setQuery] = React.useState(selectedLabel);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<
    {
      id: number | string;
      label: string;
      manufacturer?: string;
      model_name?: string;
    }[]
  >([]);
  const [showAdd, setShowAdd] = React.useState(false);
  const [manufacturer, setManufacturer] = React.useState("");
  const [modelName, setModelName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    setQuery(selectedLabel);
  }, [selectedLabel]);

  React.useEffect(() => {
    let active = true;
    const fetchModels = async () => {
      const q = query.trim();
      if (!focused || q.length < 2 || q === selectedLabel) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const url = isSolar
          ? ENDPOINTS.farms.solarModels
          : ENDPOINTS.farms.windModels;
        const resp = await api.get(url, { params: { q } });
        if (!active) return;
        setResults((resp.data || []) as { id: number; label: string }[]);
      } catch (e) {
        if (!active) return;
        setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    const timer = setTimeout(() => fetchModels(), 200); // Debounce
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, isSolar, focused, selectedLabel]);

  const handleSelect = (item: { id: number | string; label: string }) => {
    const idToSend = typeof item.id === "number" ? item.id : null;
    onSelect(idToSend, item.label);
    setQuery(item.label);
    setResults([]);
    setFocused(false);
  };

  const handleClear = () => {
    onClear();
    setQuery("");
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    if (value.trim() === "" && selectedLabel) {
      onClear();
    }
  };

  const useCustomModel = async () => {
    const m = manufacturer.trim();
    const n = modelName.trim();
    const label = `${m} - ${n}`.trim().replace(/^\s*-\s*$/, "");
    if (!m || !n || !label || label === "-") return;

    setSaving(true);
    try {
      const url = isSolar
        ? ENDPOINTS.farms.solarModels
        : ENDPOINTS.farms.windModels;
      const response = await api.post(url, {
        manufacturer: m,
        model_name: n,
      });

      if (response.data && response.data.id) {
        handleSelect(response.data);
        toast({
          title: "Model Saved",
          description: `Successfully saved "${response.data.label}".`,
        });
      } else {
        onSelect(null, label);
      }
      onAddedSuggestion?.({
        type: isSolar ? "solar" : "wind",
        manufacturer: m,
        model_name: n,
      });
    } catch (error) {
      console.error("Failed to save new model:", error);
      toast({
        title: "Error",
        description: "Could not save the new model. Please try again.",
        variant: "destructive",
      });
      onSelect(null, label);
    } finally {
      setSaving(false);
      setShowAdd(false);
      setManufacturer("");
      setModelName("");
    }
  };

  const hasSelection = Boolean(selectedLabel);

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                isSolar
                  ? "Search panel models (e.g., Jinko 410W)"
                  : "Search turbine models (e.g., Vestas V90)"
              }
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)} // Delay to allow click
              className="pl-8"
            />
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            )}
            {hasSelection && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => setShowAdd((s) => !s)}
          >
            {showAdd ? "Cancel" : "Add model"}
          </Button>
        </div>

        {focused && results.length > 0 && (
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
            <Input
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="e.g., Vestas / Jinko"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Model Name</Label>
            <Input
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g., V90 / Tiger Neo"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              className="w-full"
              onClick={useCustomModel}
              disabled={!manufacturer || !modelName || saving}
            >
              {saving ? "Saving..." : "Use this model"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageSetupStep;
