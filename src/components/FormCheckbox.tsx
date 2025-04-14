interface FormCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function FormCheckbox({ id, label, checked, onChange, className = '' }: FormCheckboxProps) {
  return (
    <label htmlFor={id} className={`inline-flex items-center cursor-pointer ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-5 h-5 border-2 rounded transition-colors
          border-blue-500 bg-white peer-checked:bg-blue-500
          after:content-[''] after:absolute after:left-[7px] after:top-[3px]
          after:w-[6px] after:h-[10px] after:border-white after:border-r-2 
          after:border-b-2 after:transform after:rotate-45 after:opacity-0
          peer-checked:after:opacity-100"
        />
      </div>
      <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
} 