'use client';

import { WidgetProps } from '@rjsf/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function TextWidget(props: WidgetProps) {
  const { id, value, required, disabled, readonly, placeholder, onChange } = props;
  
  return (
    <Input
      id={id}
      value={value || ''}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
}

export function TextareaWidget(props: WidgetProps) {
  const { id, value, required, disabled, readonly, placeholder, onChange } = props;
  
  return (
    <Textarea
      id={id}
      value={value || ''}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[100px]"
    />
  );
}

export function CheckboxWidget(props: WidgetProps) {
  const { id, value, disabled, readonly, label, onChange } = props;
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={value || false}
        disabled={disabled || readonly}
        onCheckedChange={(checked) => onChange(checked)}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

export function SelectWidget(props: WidgetProps) {
  const { id, value, required, disabled, readonly, options, onChange } = props;
  
  return (
    <Select
      value={value || ''}
      onValueChange={(newValue) => onChange(newValue)}
      disabled={disabled || readonly}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option..." />
      </SelectTrigger>
      <SelectContent>
        {options.enumOptions?.map((option: any) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SubmitButton(props: any) {
  return (
    <Button type="submit" className="w-full mt-4">
      Submit
    </Button>
  );
}