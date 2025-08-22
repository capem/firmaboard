"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Database,
  Upload,
  Shield,
  Check,
  FileJson,
  FileSpreadsheet,
  Wifi,
  Loader2,
  X,
} from "lucide-react";
import UploadFilesStep from "./UploadFilesStep";
import { api, ENDPOINTS } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface DataConnectionStepProps {
  selectedConnection: string;
  setSelectedConnection: (connection: string) => void;
}

const connections = [
  {
    id: "live-data",
    title: "Connect Live Plant Data",
    icon: Database,
    description:
      "Real-time connection to your SCADA, DCS, or historian systems",
    features: [
      { icon: Wifi, text: "Secure API integration" },
      { icon: Shield, text: "End-to-end encryption" },
      { icon: Check, text: "99.9% uptime SLA" },
    ],
  },
  {
    id: "file-upload",
    title: "Upload Files",
    icon: Upload,
    description: "Upload historical data files for analysis",
    features: [
      { icon: FileJson, text: "Support for CSV, JSON, XML" },
      { icon: FileSpreadsheet, text: "Excel workbook support" },
      { icon: Shield, text: "Automated data validation" },
    ],
  },
] as const;

const DataConnectionStep = ({
  selectedConnection,
  setSelectedConnection,
}: DataConnectionStepProps) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState<Record<string, number>>({});
  const [results, setResults] = React.useState<
    { key: string; name: string; ok: boolean; error?: string }[]
  >([]);
  const { toast } = useToast();

  const keyFor = (f: File) => `${f.name}-${f.size}`;
  const resetState = () => {
    setProgress({});
    setResults([]);
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast({
        title: "No files selected",
        description: "Please choose one or more files to upload.",
      });
      return;
    }
    try {
      setUploading(true);
      setResults([]);
      let successCount = 0;
      const uploads = files.map(async (file) => {
        const key = keyFor(file);
        const form = new FormData();
        form.append("file", file);
        try {
          await api.post(ENDPOINTS.dataImport.uploads, form, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              const pct = Math.round((evt.loaded / evt.total) * 100);
              setProgress((p) => ({ ...p, [key]: pct }));
            },
          });
          successCount += 1;
          setResults((r) => [...r, { key, name: file.name, ok: true }]);
        } catch (err: any) {
          const message = err?.response?.data?.detail || "Upload failed";
          setResults((r) => [
            ...r,
            { key, name: file.name, ok: false, error: message },
          ]);
        }
      });
      await Promise.all(uploads);
      toast({
        title: "Upload complete",
        description: `${successCount} of ${files.length} file(s) uploaded.`,
      });
      setFiles([]);
      setProgress({});
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description:
          err?.response?.data?.detail ||
          "An error occurred while uploading files.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col h-220 w-200 overflow-y-auto border p-1">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Connect Your Data
        </h2>
        <p className="text-muted-foreground">
          Choose how you'd like to connect your renewable energy data to our
          platform.
        </p>
      </div>

      <RadioGroup
        value={selectedConnection}
        onValueChange={setSelectedConnection}
        className="grid gap-4 flex-1 my-6 md:my-8"
      >
        {connections.map((connection) => {
          const isSelected = selectedConnection === connection.id;

          return (
            <motion.div
              key={connection.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              <Label
                htmlFor={connection.id}
                className={cn(
                  "relative block p-6 rounded-lg border-2 cursor-pointer transition-all duration-200",
                  "hover:bg-primary/5 hover:border-primary/50",
                  isSelected && "border-primary bg-primary/5 shadow-sm",
                  !isSelected && "border-muted"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <connection.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium leading-none">
                        {connection.title}
                      </h3>
                      <RadioGroupItem
                        id={connection.id}
                        value={connection.id}
                        className="sr-only"
                      />
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {connection.description}
                    </p>

                    <motion.div
                      initial={false}
                      animate={{ height: isSelected ? "auto" : 0 }}
                      className="overflow-hidden"
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 pt-4 border-t space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            {connection.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <feature.icon className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                  {feature.text}
                                </span>
                              </div>
                            ))}
                          </div>

                          {connection.id === "file-upload" && (
                            <div className="space-y-4">
                              <UploadFilesStep
                                files={files}
                                setFiles={(fs) => {
                                  setFiles(fs);
                                  resetState();
                                }}
                              />

                              {files.length > 0 && (
                                <div className="rounded-md border bg-card p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium">
                                      Ready to upload
                                    </p>
                                    {!uploading && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setFiles([]);
                                          resetState();
                                        }}
                                      >
                                        <X className="h-4 w-4 mr-1" />
                                        Clear
                                      </Button>
                                    )}
                                  </div>
                                  <ul className="space-y-2 max-h-40 overflow-auto">
                                    {files.map((file) => {
                                      const key = keyFor(file);
                                      const pct = progress[key] || 0;
                                      const result = results.find(
                                        (r) => r.key === key
                                      );
                                      return (
                                        <li key={key} className="text-sm">
                                          <div className="flex items-center justify-between">
                                            <span
                                              className="truncate mr-2"
                                              title={file.name}
                                            >
                                              {file.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              {Math.round(file.size / 1024)} KB
                                            </span>
                                          </div>
                                          {uploading && (
                                            <div className="mt-1 h-2 w-full overflow-hidden rounded bg-muted">
                                              <div
                                                className="h-2 bg-primary transition-all"
                                                style={{ width: `${pct}%` }}
                                              />
                                            </div>
                                          )}
                                          {result && (
                                            <div
                                              className={cn(
                                                "mt-1 text-xs",
                                                result.ok
                                                  ? "text-green-600"
                                                  : "text-red-600"
                                              )}
                                            >
                                              {result.ok
                                                ? "Uploaded successfully"
                                                : `Failed: ${result.error}`}
                                            </div>
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}

                              <div className="flex justify-end">
                                <Button
                                  onClick={handleUpload}
                                  disabled={uploading || files.length === 0}
                                >
                                  {uploading ? (
                                    <span className="inline-flex items-center">
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                      Uploading…
                                    </span>
                                  ) : (
                                    "Upload selected files"
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </Label>
            </motion.div>
          );
        })}
      </RadioGroup>

      <div className="rounded-lg border bg-muted/40 p-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            Your data is protected by enterprise-grade security measures
          </span>
        </div>
      </div>
    </div>
  );
};

export default DataConnectionStep;
