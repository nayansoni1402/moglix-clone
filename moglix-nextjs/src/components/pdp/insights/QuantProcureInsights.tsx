"use client";

import { TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProductWidget } from "@/types/product";

interface Props {
  widget: ProductWidget;
}

// Strip HTML tags from Quant Procure widget messages
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

// Extract bold parts from HTML like <b>FAB</b> is top brand...
function parseWidgetMessage(html: string) {
  const parts: { text: string; bold: boolean }[] = [];
  const regex = /(<b>([^<]+)<\/b>)|([^<]+)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match[2]) {
      parts.push({ text: match[2], bold: true });
    } else if (match[3]) {
      parts.push({ text: match[3], bold: false });
    }
  }
  return parts;
}

export default function QuantProcureInsights({ widget }: Props) {
  if (!widget?.brand && !widget?.price) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
          Quant Procure Insights
        </span>
      </div>

      <Separator className="bg-blue-100" />

      <div className="space-y-3">
        {/* Brand Insight */}
        {widget.brand && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-gray-600">
                  {parseWidgetMessage(widget.brand.message).map((part, i) =>
                    part.bold ? (
                      <strong key={i} className="text-gray-900 font-semibold">
                        {part.text}
                      </strong>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="text-[10px] font-bold bg-amber-100 text-amber-700 border-amber-200"
              >
                {widget.brand.orderPercentage}%
              </Badge>
            </div>
            <Progress
              value={widget.brand.orderPercentage}
              className="h-1.5 bg-amber-100 [&>div]:bg-amber-500"
            />
          </div>
        )}

        {/* Price Insight */}
        {widget.price && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {parseWidgetMessage(widget.price.message).map((part, i) =>
                  part.bold ? (
                    <strong key={i} className="text-gray-900 font-semibold">
                      {part.text}
                    </strong>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )}
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] font-bold bg-blue-100 text-blue-700 border-blue-200"
              >
                {widget.price.orderPercentage}%
              </Badge>
            </div>
            <Progress
              value={widget.price.orderPercentage}
              className="h-1.5 bg-blue-100 [&>div]:bg-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
