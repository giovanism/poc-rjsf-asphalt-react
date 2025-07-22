import React from "react";
import { WidgetProps, RegistryWidgetsType, ErrorListProps } from "@rjsf/utils";
import { Button } from "@asphalt-react/button";
import { Textfield } from "@asphalt-react/textfield";
import { Checkbox } from "@asphalt-react/checkbox";
import { Card } from "@asphalt-react/card";
import { Dropdown } from "@asphalt-react/selection";

// Asphalt Text Input Widget
const TextWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    placeholder,
    required,
    readonly,
    disabled,
    type,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    rawErrors = [],
  } = props;

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange(value === "" ? options.emptyValue : value);

  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);

  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const inputType = type || (schema.type === "string" ? "text" : type);
  const hasError = rawErrors.length > 0;

  return (
    <div className="mb-4">
      <Textfield
        id={id}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        autoFocus={autofocus}
        value={value || ""}
        type={inputType}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        className={hasError ? "border-red-500" : ""}
      />
    </div>
  );
};

// Asphalt Textarea Widget
const TextareaWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    placeholder,
    required,
    readonly,
    disabled,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    rawErrors = [],
  } = props;

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) =>
    onChange(value === "" ? options.emptyValue : value);

  const _onBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLTextAreaElement>) => onBlur(id, value);

  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLTextAreaElement>) => onFocus(id, value);

  const hasError = rawErrors.length > 0;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        autoFocus={autofocus}
        value={value || ""}
        rows={options.rows || 4}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          hasError ? "border-red-500" : "border-gray-300"
        } ${
          disabled || readonly ? "bg-gray-50 cursor-not-allowed" : "bg-white"
        }`}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{rawErrors.join(", ")}</p>
      )}
      {schema.description && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{schema.description}</p>
      )}
    </div>
  );
};

// Asphalt Select Widget - fallback to native select
const SelectWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    required,
    readonly,
    disabled,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    options,
    schema,
    uiSchema,
    rawErrors = [],
  } = props;

  const { enumOptions, enumDisabled } = options;

  console.log("uiSchema:", uiSchema);
  console.log("options:", options);

  const _onChange = (item: { value: string, id: string })  =>
    onChange(item);

  const _onBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLSelectElement>) => onBlur(id, value);

  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);
  // somehow asphalt onFocus does not want React.FocusEvent<HTMLSelectElement>

  const hasError = rawErrors.length > 0;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Dropdown
        id={id}
        labelId={label}
        required={required}
        disabled={disabled || readonly}
        value={value || ""}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        items={enumOptions ? enumOptions.map(({ value, label }) => ({
          id: value,
          key: label,
        })) : []}
        placeholder="Select an option..."
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{rawErrors.join(", ")}</p>
      )}
      {schema.description && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{schema.description}</p>
      )}
    </div>
  );
};

// Asphalt Checkbox Widget
const CheckboxWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    required,
    readonly,
    disabled,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    options,
    schema,
    rawErrors = [],
  } = props;

  const _onChange = ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => onChange(checked);

  const _onBlur = () => onBlur(id, value);
  const _onFocus = () => onFocus(id, value);

  const hasError = rawErrors.length > 0;

  return (
    <div className="mb-4">
      <Checkbox
        id={id}
        label={label}
        required={required}
        disabled={disabled || readonly}
        checked={value || false}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{rawErrors.join(", ")}</p>
      )}
      {schema.description && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{schema.description}</p>
      )}
    </div>
  );
};

// Asphalt Number Input Widget
const NumberWidget: React.FC<WidgetProps> = (props) => {
  const {
    id,
    placeholder,
    required,
    readonly,
    disabled,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    rawErrors = [],
  } = props;

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = value === "" ? options.emptyValue : Number(value);
    onChange(numValue);
  };

  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value === "" ? options.emptyValue : Number(value));

  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) =>
    onFocus(id, value === "" ? options.emptyValue : Number(value));

  const hasError = rawErrors.length > 0;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Textfield
        id={id}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        autoFocus={autofocus}
        value={value || ""}
        type="number"
        min={schema.minimum}
        max={schema.maximum}
        step={schema.multipleOf || 1}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        className={hasError ? "border-red-500" : ""}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{rawErrors.join(", ")}</p>
      )}
      {schema.description && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{schema.description}</p>
      )}
    </div>
  );
};

// Asphalt Submit Button
const SubmitButton: React.FC<WidgetProps> = (props) => {
  const { uiSchema } = props;
  const submitButtonOptions = uiSchema?.["ui:submitButtonOptions"] || {};
  const submitText = submitButtonOptions.submitText || "Submit";
  const norender = submitButtonOptions.norender;

  if (norender) {
    return null;
  }

  return (
    <Button type="submit" size="m">
      {submitText}
    </Button>
  );
};

// Simple Title Component
const TitleField: React.FC<{ title: string; required?: boolean }> = ({
  title,
  required,
}) => {
  return (
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      {title}
      {required && <span className="text-red-500 ml-1">*</span>}
    </h3>
  );
};

// Simple Description Component
const DescriptionField: React.FC<{ description: string }> = ({
  description,
}) => {
  return <p className="text-sm text-gray-600 mb-4">{description}</p>;
};

// Asphalt Form Object Field Template
const ObjectFieldTemplate: React.FC<any> = (props) => {
  const { title, description, properties, required } = props;

  return (
    <Card className="p-6 mb-4">
      <div>
        {title && <TitleField title={title} required={required} />}
        {description && <DescriptionField description={description} />}
        <div className="space-y-4">
          {properties.map((element: any) => (
            <div key={element.name} className="property-wrapper">
              {element.content}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Asphalt Form Array Field Template
const ArrayFieldTemplate: React.FC<any> = (props) => {
  const { title, items, canAdd, onAddClick, required } = props;

  return (
    <Card className="p-6 mb-4">
      <div>
        {title && <TitleField title={title} required={required} />}
        <div className="space-y-4">
          {items.map((element: any) => (
            <Card
              key={element.index}
              className="p-4 border-dashed border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Item {element.index + 1}
                </h4>
                <div className="flex space-x-2">
                  {element.hasMoveUp && (
                    <Button
                      size="s"
                      onClick={element.onReorderClick(
                        element.index,
                        element.index - 1
                      )}
                    >
                      ↑
                    </Button>
                  )}
                  {element.hasMoveDown && (
                    <Button
                      size="s"
                      onClick={element.onReorderClick(
                        element.index,
                        element.index + 1
                      )}
                    >
                      ↓
                    </Button>
                  )}
                  {element.hasRemove && (
                    <Button
                      size="s"
                      onClick={element.onDropIndexClick(element.index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {element.children}
              </div>
            </Card>
          ))}
          {canAdd && (
            <Button size="m" onClick={onAddClick} className="w-full">
              Add Item
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Asphalt Form Error List Template
const ErrorListTemplate: React.FC<ErrorListProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Card className="p-4 mb-4 border-red-200 bg-red-50">
      <div>
        <h4 className="text-md font-medium text-red-800 mb-2">Errors</h4>
        <ul className="space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="text-sm text-red-700">
              {error.message || String(error)}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

// Export the widgets registry
export const asphaltWidgets: RegistryWidgetsType = {
  TextWidget,
  TextareaWidget,
  SelectWidget,
  CheckboxWidget,
  NumberWidget,
  SubmitButton,
};

// Export the theme configuration
export const asphaltTheme = {
  widgets: asphaltWidgets,
  templates: {
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    ErrorListTemplate,
    ButtonTemplates: {
      SubmitButton,
    }
  },
};

export default asphaltTheme;
