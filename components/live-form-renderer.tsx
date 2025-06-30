'use client';

import { useState, useMemo, useEffect } from 'react';
import Form from '@rjsf/core';
import { FieldProps, RegistryFieldsType } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { CustomSpecificationField } from './custom-specification-field';
import { Button } from './ui/button';
import { PostgrestClient } from '@supabase/postgrest-js';

interface LiveFormRendererProps {
  schema: string;
  uiSchema: string;
  formData: string;
  postgrestTable?: string;
  onFormDataChange: (data: string) => void;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

const fields: RegistryFieldsType = {
  '/schemas/custom-specification': CustomSpecificationField,
};

export function LiveFormRenderer({ schema, uiSchema, formData, postgrestTable, onFormDataChange }: LiveFormRendererProps) {
  const [activeTab, setActiveTab] = useState('create');
  const [errors, setErrors] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);

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
        fields={fields}
        formData={initialData}
        validator={validator}
        onChange={onChangeHandler}
        onSubmit={handleFormSubmit}
        className="rjsf"
      />
    );
  };

  const fetchTableData = async () => {
    if (!postgrestTable) return;

    setIsLoading(true);
    try {
      const offset = (pagination.page - 1) * pagination.pageSize;
      const rangeStart = offset;
      const rangeEnd = offset + pagination.pageSize - 1;

      const POSTGREST_URL = 'http://localhost:3001';
      const postgrest = new PostgrestClient(POSTGREST_URL);
      const { count, data, error } = await postgrest.from(postgrestTable).select('*', { count: 'exact' })
        .range(rangeStart, rangeEnd);
      
      if (error) {
        throw new Error(`PostgREST Error: ${error.message}`);
      }
      
      setTableData(data);
      setPagination(prev => ({
        ...prev,
        total: count ? count : 0,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrors(prev => [...prev, `Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postgrestTable && activeTab === 'list') {
      fetchTableData();
    }
  }, [postgrestTable, activeTab, pagination.page, pagination.pageSize]);

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
            <TabsList className={`grid w-full ${postgrestTable ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <TabsTrigger value="create">Create Form</TabsTrigger>
              <TabsTrigger value="update">Update Form</TabsTrigger>
              <TabsTrigger value="view">View Object</TabsTrigger>
              {postgrestTable && <TabsTrigger value="list">List Objects</TabsTrigger>}
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

          {postgrestTable && (
            <TabsContent value="list" className="flex-1 min-h-0 px-6 pb-6 mt-0">
              <div className="h-full flex flex-col">
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Loading...
                    </div>
                  </div>
                ) : tableData.length > 0 ? (
                  <>
                    <div className="flex-1 overflow-auto">
                      <div className="space-y-4">
                        {tableData.map((item, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <pre className="text-sm bg-muted p-4 rounded-md overflow-auto whitespace-pre-wrap">
                                {JSON.stringify(item, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {`Showing ${((pagination.page - 1) * pagination.pageSize) + 1}-${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total}`}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      No data available
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
