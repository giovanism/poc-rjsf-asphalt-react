'use client';

import { JSONEditor } from './json-editor';

interface JSONObjectEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function JSONObjectEditor({ value, onChange }: JSONObjectEditorProps) {
  return <JSONEditor title="Form Data" value={value} onChange={onChange} />;
}