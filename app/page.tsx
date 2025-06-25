'use client';

import { useState } from 'react';
import { SchemaEditor } from '@/components/schema-editor';
import { JSONObjectEditor } from '@/components/json-object-editor';
import { LiveFormRenderer } from '@/components/live-form-renderer';
import { Button } from '@/components/ui/button';
import { RefreshCw, Code, FileText } from 'lucide-react';

const defaultSchema = `{
  "type": "object",
  "title": "User Profile",
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First Name",
      "minLength": 2
    },
    "lastName": {
      "type": "string",
      "title": "Last Name",
      "minLength": 2
    },
    "email": {
      "type": "string",
      "title": "Email",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "title": "Age",
      "minimum": 18,
      "maximum": 120
    },
    "bio": {
      "type": "string",
      "title": "Biography",
      "description": "Tell us about yourself"
    },
    "isActive": {
      "type": "boolean",
      "title": "Active User",
      "default": true
    },
    "role": {
      "type": "string",
      "title": "Role",
      "enum": ["user", "admin", "moderator"],
      "enumNames": ["User", "Administrator", "Moderator"]
    }
  },
  "required": ["firstName", "lastName", "email"]
}`;

const defaultFormData = `{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "bio": "Full-stack developer with 5+ years of experience",
  "isActive": true,
  "role": "user"
}`;

export default function Home() {
  const [schema, setSchema] = useState(defaultSchema);
  const [formData, setFormData] = useState(defaultFormData);

  const handleReset = () => {
    setSchema(defaultSchema);
    setFormData(defaultFormData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6 h-screen flex flex-col">
        <div className="mb-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                JSON Schema Editor
              </h1>
              <p className="text-gray-600 text-lg">
                Build and test JSON schemas with live form rendering
              </p>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Example
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Left Panel - Editors */}
          <div className="flex flex-col gap-6 min-h-0">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 flex-shrink-0">
              <Code className="w-4 h-4" />
              Code Editors
            </div>
            
            <div className="flex-1 min-h-0">
              <SchemaEditor value={schema} onChange={setSchema} />
            </div>
            
            <div className="flex-1 min-h-0">
              <JSONObjectEditor value={formData} onChange={setFormData} />
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="flex flex-col gap-6 min-h-0">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 flex-shrink-0">
              <FileText className="w-4 h-4" />
              Live Preview
            </div>
            
            <div className="flex-1 min-h-0">
              <LiveFormRenderer
                schema={schema}
                formData={formData}
                onFormDataChange={setFormData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}