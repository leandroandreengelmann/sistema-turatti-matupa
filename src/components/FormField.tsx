import React, { ReactNode } from 'react';

interface BaseFormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  gridSpan?: 'full' | 'half';
}

interface InputFieldProps extends BaseFormFieldProps {
  type: 'text' | 'tel' | 'email' | 'password' | 'number' | 'color';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
}

interface SelectFieldProps extends BaseFormFieldProps {
  type: 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  emptyOption?: string;
  disabled?: boolean;
}

interface CheckboxFieldProps extends BaseFormFieldProps {
  type: 'checkbox';
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TextareaFieldProps extends BaseFormFieldProps {
  type: 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

type FormFieldProps = 
  | InputFieldProps 
  | SelectFieldProps 
  | CheckboxFieldProps
  | TextareaFieldProps;

export default function FormField(props: FormFieldProps) {
  // Extraindo propriedades comuns e específicas baseado no tipo
  const { id, label, type, required = false, error, labelClassName } = props;
  
  // Valores específicos por tipo
  const value = 'checked' in props ? props.checked : ('value' in props ? props.value : '');
  const onChange = props.onChange;
  const placeholder = 'placeholder' in props ? props.placeholder : '';
  const min = 'min' in props ? props.min : undefined;
  const max = 'max' in props ? props.max : undefined;
  const step = 'step' in props ? props.step : undefined;
  const pattern = 'pattern' in props ? props.pattern : undefined;
  const options = 'options' in props ? props.options : [];
  const emptyOption = 'emptyOption' in props ? props.emptyOption : undefined;
  const disabled = 'disabled' in props ? props.disabled : false;
  const rows = 'rows' in props ? props.rows : 4;
  
  const wrapperClassName = `${'gridSpan' in props && props.gridSpan === 'full' ? 'md:col-span-2' : ''} ${error ? 'has-error' : ''}`;
  const labelClasses = `block ${labelClassName || 'text-lg text-gray-700'} mb-2`;
  const inputClasses = "w-full h-[47px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-colors";
  const errorClasses = "mt-1 text-sm text-red-600";

  const renderField = (): ReactNode => {
    switch (type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'password':
      case 'number':
        return (
          <input
            type={type}
            id={id}
            value={'value' in props ? props.value : ''}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            className={inputClasses}
            required={required}
            placeholder={placeholder as string}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
          />
        );
      case 'color':
        return (
          <div className="flex items-center">
            <input
              type="color"
              id={id}
              value={value as string}
              onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
              className="w-12 h-10 border border-gray-300 rounded-md mr-2"
            />
            <input
              type="text"
              value={value as string}
              onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#RRGGBB"
              pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            />
          </div>
        );
      case 'select':
        return (
          <select
            id={id}
            value={value as string}
            onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
            className={`${inputClasses} appearance-none bg-white bg-no-repeat bg-right`}
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
            required={required}
            disabled={disabled}
          >
            {emptyOption && (
              <option value="">{emptyOption}</option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <label className="flex items-center cursor-pointer mt-2">
            <input
              type="checkbox"
              id={id}
              checked={value as boolean}
              onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-lg text-gray-700">{label}</span>
          </label>
        );
      case 'textarea':
        return (
          <>
            <label className={labelClasses} htmlFor={id}>
              {label}{required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={id}
              value={value as string}
              onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
              className={`${inputClasses} h-auto`}
              required={required}
              placeholder={placeholder as string}
              rows={rows}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={wrapperClassName}>
      {type !== 'checkbox' && type !== 'textarea' && (
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  );
} 