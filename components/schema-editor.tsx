'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Wand2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface SchemaEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SchemaEditor({ value, onChange }: SchemaEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    try {
      if (value.trim()) {
        JSON.parse(value);
        setIsValid(true);
        setError(null);
      } else {
        setIsValid(false);
        setError(null);
      }
    } catch (e) {
      setIsValid(false);
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }, [value]);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
    } catch (e) {
      // Don't format if JSON is invalid
    }
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">JSON Schema</CardTitle>
          <div className="flex items-center gap-2">
            {isValid ? (
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Valid
              </Badge>
            ) : error ? (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Invalid
              </Badge>
            ) : null}
            <Button
              onClick={formatJSON}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
            >
              <Wand2 className="w-3 h-3 mr-1" />
              Format
            </Button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1 truncate">{error}</p>
        )}
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
        <div className="h-full w-full border-t">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="json"
            value={value}
            onChange={handleEditorChange}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: 'on',
              bracketPairColorization: { enabled: true },
              folding: true,
              foldingHighlight: true,
              showFoldingControls: 'mouseover',
              padding: { top: 8, bottom: 8 },
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}