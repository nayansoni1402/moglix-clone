"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProductFilterAttribute } from "@/types/product";

// Wire colour → CSS colour for the swatch
const COLOUR_MAP: Record<string, string> = {
  Red: "#E53E3E",
  Blue: "#3182CE",
  Green: "#38A169",
  Black: "#1A1A1A",
  White: "#E2E8F0",
  Yellow: "#D69E2E",
  Brown: "#92400E",
  Grey: "#718096",
  Orange: "#DD6B20",
};

interface Props {
  filters: ProductFilterAttribute[];
  currentMsn: string;
}

export default function VariantSelector({ filters, currentMsn }: Props) {
  const router = useRouter();

  if (!filters || filters.length === 0) return null;

  const handleVariantClick = (msn: string) => {
    if (msn.toLowerCase() !== currentMsn.toLowerCase()) {
      router.push(`/product/${msn.toLowerCase()}`);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <Separator />
      {filters.map((group) => (
        <div key={group.name} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.name}
            </span>
          </div>

          {group.name.toLowerCase().includes("colour") ? (
            // ── Colour Swatches ────────────────────────────────────────
            <div className="flex flex-wrap gap-2">
              {group.items
                .filter((item) => item.active === 1)
                .map((item) => {
                  const isSelected = item.selected === 1;
                  const hex = COLOUR_MAP[item.value] ?? "#999";
                  return (
                    <button
                      key={item.msn}
                      title={item.value}
                      onClick={() => handleVariantClick(item.msn)}
                      className={`relative flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full border-2 text-xs font-medium transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <span className={isSelected ? "text-blue-700 font-semibold" : "text-gray-700"}>
                        {item.value}
                      </span>
                    </button>
                  );
                })}
            </div>
          ) : (
            // ── Pill Selector (Nominal Size, Pack Size, etc.) ──────────
            <div className="flex flex-wrap gap-2">
              {group.items
                .filter((item) => item.active === 1)
                .map((item) => {
                  const isSelected = item.selected === 1;
                  return (
                    <button
                      key={item.msn}
                      onClick={() => handleVariantClick(item.msn)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-blue-600 text-blue border-blue-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {item.value}
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      ))}
      <Separator />
    </div>
  );
}
