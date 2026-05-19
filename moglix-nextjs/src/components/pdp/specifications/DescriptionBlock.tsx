import type { ProductGroup } from "@/types/product";
import { sanitizeHtml } from "@/lib/utils/product";

interface DescriptionBlockProps {
  product: ProductGroup;
}

export default function DescriptionBlock({ product }: DescriptionBlockProps) {
  const description = product.productDescripton;

  return (
    <div>
      <h2 className="text-lg font-bold text-body mb-4">Product Description</h2>

      {/* Key Features */}
      {product.productKeyFeatures?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-body mb-3">Key Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.productKeyFeatures.map((feat, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 bg-gray-1 rounded-lg px-3 py-2.5 text-sm text-dark-3"
              >
                <span className="w-5 h-5 rounded-full bg-blue/10 text-blue flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="font-medium">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Description Text */}
      {description && (
        <div className="prose prose-sm max-w-none">
          <div className="text-sm text-dark-3 leading-relaxed font-medium">
            {parseDescription(description)}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Item Dimensions",
            value: product.itemDimension,
          },
          {
            label: "Item Weight",
            value: product.itemWeight,
          },
          {
            label: "Package Contents",
            value: product.productCategoryDetails?.categoryName || "—",
          },
        ]
          .filter((r) => r.value)
          .map((row, i) => (
            <div key={i} className="bg-gray-1 rounded-lg p-3">
              <p className="text-xs text-gray-5 font-bold uppercase tracking-wide mb-1">
                {row.label}
              </p>
              <p className="text-sm text-body font-semibold">{row.value}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

function parseDescription(desc: string) {
  if (!desc) return null;
  
  // If it looks like HTML, render it directly
  if (desc.trim().startsWith("<") || /<\/?[a-z][\s\S]*>/i.test(desc)) {
    return (
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(desc) }} className="space-y-3" />
    );
  }
  
  // Parse simple Markdown
  const lines = desc.split(/\n+/);
  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-base font-bold text-dark mt-4 mb-2">
              {renderInline(trimmed.substring(4))}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-lg font-bold text-dark mt-4 mb-2">
              {renderInline(trimmed.substring(3))}
            </h2>
          );
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <ul key={idx} className="list-disc pl-5 space-y-1">
              <li>{renderInline(trimmed.replace(/^[-*]\s+/, ""))}</li>
            </ul>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-bold text-dark">{part}</strong>;
    }
    return part;
  });
}
