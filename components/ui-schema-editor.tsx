'use client';

import { Card } from '@/components/ui/card';
import Editor from '@monaco-editor/react';

interface UISchemaEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function UISchemaEditor({ value, onChange }: UISchemaEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Card className="h-full overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          folding: true,
          formatOnPaste: true,
          formatOnType: true
        }}
      />
    </Card>
  );
}
