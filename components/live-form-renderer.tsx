'use client';

import { useState, useMemo } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { 
  TextWidget, 
  TextareaWidget, 
  CheckboxWidget, 
  SelectWidget,
  SubmitButton 
} from './custom-form-widgets';

interface LiveFormRendererProps {
  schema: string;
  uiSchema: string;
  formData: string;
  onFormDataChange: (data: string) => void;
}

const widgets = {
  TextWidget,
  TextareaWidget,
  CheckboxWidget,
  SelectWidget,
};

export function LiveFormRenderer({ schema, uiSchema, formData, onFormDataChange }: LiveFormRendererProps) {
  const [activeTab, setActiveTab] = useState('create');
  const [errors, setErrors] = useState<string[]>([]);

  const { parsedSchema, parsedUISchema, parsedFormData, isSchemaValid, isFormDataValid } = useMemo(() => {
    let parsedSchema = null;
    let parsedUISchema = null;
    let parsedFormData = null;
    let isSchemaValid = false;
    let isFormDataValid = false;
    let newErrors: string[] = [];

    try {
      if (schema.trim()) {
        parsedSchema = JSON.parse(schema);
        isSchemaValid = true;
      }
    } catch (e) {
      newErrors.push(`Schema Error: ${e instanceof Error ? e.message : 'Invalid JSON'}`);
    }

    try {
      if (uiSchema.trim()) {
        parsedUISchema = JSON.parse(uiSchema);
      }
    } catch (e) {
      newErrors.push(`UI Schema Error: ${e instanceof Error ? e.message : 'Invalid JSON'}`);
    }

    try {
      if (formData.trim()) {
        parsedFormData = JSON.parse(formData);
        isFormDataValid = true;
      }
    } catch (e) {
      newErrors.push(`Form Data Error: ${e instanceof Error ? e.message : 'Invalid JSON'}`);
    }

    setErrors(newErrors);

    return {
      parsedSchema,
      parsedUISchema,
      parsedFormData,
      isSchemaValid,
      isFormDataValid,
    };
  }, [schema, uiSchema, formData]);

  const handleFormChange = (data: any) => {
    const formDataString = JSON.stringify(data.formData, null, 2);
    onFormDataChange(formDataString);
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data.formData);
  };

  const renderForm = (initialData?: any, onChangeHandler?: (data: any) => void) => {
    if (!isSchemaValid || !parsedSchema) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Please provide a valid JSON schema</p>
          </div>
        </div>
      );
    }

    return (
      <Form
        schema={parsedSchema}
        uiSchema={parsedUISchema}
        formData={initialData}
        validator={validator}
        onChange={onChangeHandler}
        onSubmit={handleFormSubmit}
        widgets={widgets}
        className="space-y-4"
        >
        <SubmitButton />
      </Form>
    );
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Live Form Preview</CardTitle>
          <div className="flex gap-2">
            {errors.map((error, index) => (
              <Badge key={index} variant="destructive" className="text-xs">
                Error
              </Badge>
            ))}
          </div>
        </div>
        {errors.length > 0 && (
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-600 truncate">{error}</p>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-6 pt-6 pb-2 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create Form</TabsTrigger>
              <TabsTrigger value="update">Update Form</TabsTrigger>
              <TabsTrigger value="view">View Object</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="create" className="flex-1 min-h-0 px-6 pb-6 mt-0">
            <div className="h-full overflow-auto">
              {renderForm()}
            </div>
          </TabsContent>
          
          <TabsContent value="update" className="flex-1 min-h-0 px-6 pb-6 mt-0">
            <div className="h-full overflow-auto">
              {renderForm(parsedFormData, handleFormChange)}
            </div>
          </TabsContent>
          
          <TabsContent value="view" className="flex-1 min-h-0 px-6 pb-6 mt-0">
            <div className="h-full overflow-auto">
              {isFormDataValid && parsedFormData ? (
                <Card>
                  <CardContent className="p-4">
                    <pre className="text-sm bg-muted p-4 rounded-md overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(parsedFormData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No valid form data to display</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
