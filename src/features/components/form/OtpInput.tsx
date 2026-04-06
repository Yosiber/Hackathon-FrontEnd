import React, { useState, useRef, forwardRef } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface OtpInputProps {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
}

export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(
  ({ value = '', onChange, length = 6 }, ref) => {

    const toDigits = (val: string) =>
      Array.from({ length }, (_, i) => val[i] ?? '');

    const [digits, setDigits] = useState<string[]>(toDigits(value));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const emitChange = (newDigits: string[]) => {
      setDigits(newDigits);
      onChange?.(newDigits.join(''));
    };

    const focusAt = (index: number) => {
      const target = Math.max(0, Math.min(length - 1, index));
      inputRefs.current[target]?.focus();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const raw = e.target.value.replace(/\D/g, '');
      if (!raw) return;

      const newDigits = [...digits];
      newDigits[index] = raw.slice(-1);
      emitChange(newDigits);

      if (index < length - 1) {
        focusAt(index + 1);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        const newDigits = [...digits];

        if (digits[index]) {
          newDigits[index] = '';
          emitChange(newDigits);
        } else if (index > 0) {
          newDigits[index - 1] = '';
          emitChange(newDigits);
          focusAt(index - 1);
        }
      }

      if (e.key === 'ArrowLeft') focusAt(index - 1);
      if (e.key === 'ArrowRight') focusAt(index + 1);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, length)
        .split('');

      const newDigits = Array.from({ length }, (_, i) => pasted[i] ?? '');
      emitChange(newDigits);

      focusAt(Math.min(pasted.length, length - 1));
    };

    return (
      <div ref={ref} className="flex gap-3 justify-center">
        {digits.map((digit, index) => {
          const firstEmpty = digits.findIndex(v => v === '');
          const isFocused =
            firstEmpty === index || (digits.every(v => v !== '') && index === length - 1);

          return (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={e => handleChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`w-14 h-16 text-center text-2xl font-black transition-all rounded-t-xl border-b-4 outline-none caret-transparent selection:bg-transparent
                ${isFocused
                  ? 'bg-blue-100/50 border-blue-800 text-blue-900'
                  : 'bg-gray-200/40 border-gray-300 text-gray-500'
                }`}
              placeholder="•"
            />
          );
        })}
      </div>
    );
  }
);

OtpInput.displayName = 'OtpInput';

interface OtpInputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  length?: number;
}

export const OtpInputField = <T extends FieldValues>({ 
  control, 
  name, 
  length = 6 
}: OtpInputFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    rules={{
      required: 'El código es requerido',
      minLength: { value: length, message: `El código debe tener ${length} dígitos` },
    }}
    render={({ field }) => (
      <OtpInput
        value={field.value ?? ''}
        onChange={field.onChange}
        length={length}
      />
    )}
  />
);