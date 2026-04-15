import React, { useMemo } from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  const wordCount = useMemo(
    () => value.split(/\s+/).filter(Boolean).length,
    [value]
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Invention Description / Patent Text
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          placeholder ||
          "Paste your invention description, patent draft, or idea here..."
        }
        rows={10}
        className="w-full rounded-lg border border-gray-300 p-4 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y leading-relaxed"
      />
      <p className="mt-1 text-xs text-gray-400">{wordCount} words</p>
    </div>
  );
}
