'use client';

import { JSONEditor } from './json-editor';

interface SchemaEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SchemaEditor({ value, onChange }: SchemaEditorProps) {
  return <JSONEditor title="JSON Schema" value={value} onChange={onChange} />;
}