import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Upload, FileSpreadsheet, AlertCircle, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import * as XLSX from 'xlsx';

interface SceneImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (scenes: any[], replace: boolean, movieName?: string) => void;
}

interface ParsedScene {
  description: string;
  startTime: string;
  endTime: string;
  details: string;
  startSeconds: number;
  endSeconds: number;
}

export function SceneImportDialog({ isOpen, onClose, onImport }: SceneImportDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedScenes, setParsedScenes] = useState<ParsedScene[]>([]);
  const [movieName, setMovieName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const parseTime = (timeStr: string | number): number => {
    if (typeof timeStr === 'number') return timeStr;
    if (!timeStr) return 0;
    
    const str = timeStr.toString().trim();
    
    // Handle HH:MM:SS or MM:SS
    if (str.includes(':')) {
      const parts = str.split(':').map(Number);
      if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      }
    }
    
    // Handle plain seconds
    const seconds = parseFloat(str);
    return isNaN(seconds) ? 0 : seconds;
  };

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(csv|xlsx|xls)$/)) {
      setError('Please upload a valid spreadsheet (.csv, .xlsx, .xls)');
      return;
    }

    setFile(file);
    setError(null);
    setParsedScenes([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError('The spreadsheet appears to be empty.');
          return;
        }

        // Validate and map data
        const scenes: ParsedScene[] = [];
        let detectedMovieName = '';

        // Try to identify columns flexibly
        const firstRow = jsonData[0] as any;
        const keys = Object.keys(firstRow);
        
        // Helper to find key case-insensitively
        const findKey = (search: string) => keys.find(k => k.toLowerCase().includes(search.toLowerCase()));

        const movieKey = findKey('Movie');
        const descKey = findKey('Scene Description') || findKey('Description') || findKey('Title');
        const startKey = findKey('Start Time') || findKey('Start');
        const endKey = findKey('End Time') || findKey('End');
        const detailsKey = findKey('Scene Details') || findKey('Dialogue') || findKey('Context') || findKey('Details');

        if (!descKey || !startKey || !endKey) {
          setError('Could not identify required columns (Scene Description, Start Time, End Time). Please check the spreadsheet format.');
          return;
        }

        if (movieKey && firstRow[movieKey]) {
            detectedMovieName = firstRow[movieKey];
            setMovieName(detectedMovieName);
        }

        jsonData.forEach((row: any, index) => {
          const startTime = row[startKey];
          const endTime = row[endKey];
          const startSeconds = parseTime(startTime);
          const endSeconds = parseTime(endTime);

          if (startSeconds >= 0 && endSeconds > startSeconds) {
            scenes.push({
              description: row[descKey] || `Scene ${index + 1}`,
              startTime: startTime?.toString() || '',
              endTime: endTime?.toString() || '',
              details: detailsKey ? row[detailsKey] || '' : '',
              startSeconds,
              endSeconds
            });
          }
        });

        if (scenes.length === 0) {
          setError('No valid scenes found. Please check timestamp formats.');
        } else {
          setParsedScenes(scenes);
        }

      } catch (err) {
        console.error(err);
        setError('Failed to parse the file. Please ensure it is a valid spreadsheet.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (parsedScenes.length === 0) return;
    onImport(parsedScenes, importMode === 'replace', movieName);
    onClose();
    setFile(null);
    setParsedScenes([]);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]" hideCloseButton>
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <DialogTitle className="text-lg leading-none font-semibold">Import Scenes from Spreadsheet</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Upload a CSV or Excel file with columns: Movie, Scene Description, Start Time, End Time, Scene Details.
          </DialogDescription>
        </div>

        {!parsedScenes.length ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-gray-600 dark:text-[#9CA3AF]" />
              <p className="text-sm font-medium">Click to browse or drag file here</p>
              <p className="text-xs text-gray-500">Supports .xlsx, .xls, .csv</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{file?.name}</p>
                        <p className="text-xs text-gray-500">{parsedScenes.length} scenes found {movieName && `• ${movieName}`}</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                    setParsedScenes([]);
                    setFile(null);
                }}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="h-[200px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scene</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedScenes.map((scene, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{scene.description}</TableCell>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                        {scene.startTime} - {scene.endTime}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 max-w-[200px] truncate">
                        {scene.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                    <input 
                        type="radio" 
                        id="replace" 
                        name="mode" 
                        checked={importMode === 'replace'} 
                        onChange={() => setImportMode('replace')}
                        className="text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="replace" className="text-sm cursor-pointer">Replace existing scenes</label>
                </div>
                <div className="flex items-center gap-2">
                    <input 
                        type="radio" 
                        id="append" 
                        name="mode" 
                        checked={importMode === 'append'} 
                        onChange={() => setImportMode('append')}
                        className="text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="append" className="text-sm cursor-pointer">Append to list</label>
                </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport} disabled={parsedScenes.length === 0}>
            Import {parsedScenes.length > 0 ? `${parsedScenes.length} Scenes` : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}