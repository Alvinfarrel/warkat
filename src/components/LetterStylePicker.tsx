"use client";

import { LETTER_PRESETS, LetterPreset } from "@/lib/presets";
import { Check } from "lucide-react";

interface LetterStylePickerProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
}

export default function LetterStylePicker({
  selectedStyle,
  onSelectStyle,
}: LetterStylePickerProps) {
  const presetsList = Object.values(LETTER_PRESETS);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#2D231C]">
          Pilih Bentuk & Gaya Surat
        </label>
        <span className="text-xs text-[#7A6E65]">5 Pilihan Tematik</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {presetsList.map((preset: LetterPreset) => {
          const isSelected = selectedStyle === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectStyle(preset.id)}
              className={`relative rounded-xl border p-3.5 text-left transition-all min-h-[44px] flex flex-col justify-between select-none ${
                preset.envelopeColor
              } ${preset.envelopeBorder} ${
                isSelected
                  ? "ring-2 ring-[#9B2C2C] ring-offset-2 scale-[1.01] shadow-md"
                  : "opacity-85 hover:opacity-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10 text-inherit">
                    {preset.badgeText}
                  </span>
                  <h3 className="mt-1.5 font-serif font-bold text-sm text-inherit">
                    {preset.name}
                  </h3>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif shadow-xs border ${
                    preset.sealColor
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  ) : (
                    "W"
                  )}
                </div>
              </div>

              <p className="mt-2 text-xs text-inherit/75 line-clamp-2">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
