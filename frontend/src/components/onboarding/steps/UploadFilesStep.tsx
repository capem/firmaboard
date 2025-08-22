import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, File as FileIcon, X } from 'lucide-react';

interface UploadFilesStepProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const MAX_FILES = 50;
const MAX_FILE_SIZE_MB = 10;

const UploadFilesStep: React.FC<UploadFilesStepProps> = ({ files, setFiles }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const onFilesSelected = React.useCallback((selected: FileList | null) => {
    if (!selected) return;
    try {
      let newFiles = Array.from(selected);
      // Filter by size to avoid large freezes
      newFiles = newFiles.filter((f) => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
      // Enforce a reasonable cap to keep UI responsive
      const remainingSlots = Math.max(0, MAX_FILES - files.length);
      if (newFiles.length > remainingSlots) {
        newFiles = newFiles.slice(0, remainingSlots);
      }
      // De-duplicate by name + size
      const map = new Map<string, File>();
      [...files, ...newFiles].forEach((f) => {
        map.set(`${f.name}-${f.size}`, f);
      });
      setFiles(Array.from(map.values()));
    } catch (error) {
      console.warn('Error processing files:', error);
    }
  }, [files, setFiles]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onFilesSelected(e.dataTransfer.files);
  };

  const removeFile = (idx: number) => {
    const next = [...files];
    next.splice(idx, 1);
    setFiles(next);
  };

  const openPicker = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const input = inputRef.current;
    if (!input) return;
    
    try {
      // Modern browsers support showPicker
      if ('showPicker' in input && typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        // Fallback to click
        input.click();
      }
    } catch (error) {
      // Fallback if showPicker fails
      console.warn('File picker failed, using fallback:', error);
      input.click();
    }
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      <div
        className="flex-1 rounded-lg border border-dashed p-6 text-center flex flex-col items-center justify-center gap-3 bg-muted/20"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        role="region"
        aria-label="File upload dropzone"
      >
        <Upload className="h-8 w-8 text-primary" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="text-xs text-muted-foreground">or</p>
        </div>
        <Button type="button" variant="secondary" onClick={openPicker}>
          Browse files
        </Button>
        <input
          ref={inputRef}
          id="onboarding-file-input"
          type="file"
          className="hidden"
          multiple
          accept=".csv,.json,.xml,.xlsx,.xls,.pdf,.docx,.png,.jpg,.jpeg,.txt"
          onChange={(e) => onFilesSelected(e.target.files)}
          aria-hidden
        />
        <p className="mt-2 text-xs text-muted-foreground">Accepted: PDF, CSV, XLSX, DOCX, PNG, JPG (max ~10MB each)</p>
      </div>

      {files.length > 0 && (
        <Card className="p-4 space-y-2 max-h-40 overflow-auto">
          <Label className="text-sm">Selected files</Label>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li key={`${file.name}-${file.size}-${idx}`} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 truncate">
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate" title={file.name}>{file.name}</span>
                  <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(idx)} aria-label={`Remove ${file.name}`}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default UploadFilesStep;
