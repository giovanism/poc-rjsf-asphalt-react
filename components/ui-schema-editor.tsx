'use client';

import { JSONEditor } from './json-editor';

interface UISchemaEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function UISchemaEditor({ value, onChange }: UISchemaEditorProps) {
  return <JSONEditor title="UI Schema" value={value} onChange={onChange} />;
}
