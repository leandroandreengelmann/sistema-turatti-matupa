interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  step?: number;
}

export default function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  required = false,
  placeholder = '',
  step
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="px-3 py-3 w-full h-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          step={step}
          className="px-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      )}
    </div>
  );
} 