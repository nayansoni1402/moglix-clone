"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { QnA } from "@/types/product";

interface FaqSectionProps {
  faqs: QnA[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  if (!faqs || faqs.length === 0)
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No FAQs available for this product.
      </div>
    );

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <HelpCircle size={20} className="text-blue" />
        <h2 className="text-lg font-bold text-body">Frequently Asked Questions</h2>
      </div>

      <div itemScope itemType="https://schema.org/FAQPage">
        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-2">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={faq.id ?? idx}
              value={`item-${idx}`}
              className="border border-gray-200 rounded-xl overflow-hidden px-0"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <AccordionTrigger
                className="px-5 py-4 text-sm font-bold text-body text-left hover:bg-gray-50 hover:no-underline [&[data-state=open]]:text-blue-600 transition-colors"
                itemProp="name"
              >
                {faq.questionText}
              </AccordionTrigger>
              <AccordionContent
                className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/50"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <span itemProp="text">{faq.answerText}</span>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
