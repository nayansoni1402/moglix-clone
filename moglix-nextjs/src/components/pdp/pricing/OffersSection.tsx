import { Tag, Smartphone, Percent, Gift, CreditCard } from "lucide-react";
import type { ApplicablePromo, PrepaidDiscount } from "@/types/product";

interface OffersSectionProps {
  promo?: ApplicablePromo;
  prepaidDiscount?: PrepaidDiscount;
}

export default function OffersSection({ promo, prepaidDiscount }: OffersSectionProps) {
  const offers = [
    promo && {
      icon: <Smartphone size={16} className="text-blue" />,
      title: "App Offer",
      desc: promo.promoDescription,
      code: promo.promoCode,
      color: "border-blue/20 bg-blue/5",
    },
    prepaidDiscount && {
      icon: <CreditCard size={16} className="text-green" />,
      title: "Prepaid Discount",
      desc: `${prepaidDiscount.percentageDiscount}% off on prepaid orders above ₹${prepaidDiscount.minimumCartValue.toLocaleString("en-IN")}`,
      code: null,
      color: "border-green/20 bg-green/5",
    },
    {
      icon: <Percent size={16} className="text-orange" />,
      title: "Bank Offer",
      desc: "5% Unlimited Cashback on Axis Bank Credit Cards",
      code: null,
      color: "border-orange/20 bg-orange/5",
    },
    {
      icon: <Gift size={16} className="text-red" />,
      title: "Special Offer",
      desc: "Get GST invoice and save up to 28% on business purchases",
      code: null,
      color: "border-red/20 bg-red/5",
    },
  ].filter(Boolean);

  if (!offers.length) return null;

  return (
    <div className="border border-gray-1 rounded-xl p-4 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={16} className="text-orange" />
        <h3 className="text-sm font-bold text-body">Available Offers</h3>
      </div>
      <div className="space-y-2.5">
        {offers.map((offer: any, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 border rounded-lg p-3 ${offer.color}`}
          >
            <div className="mt-0.5 shrink-0">{offer.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-body mb-0.5">{offer.title}</p>
              <p className="text-xs text-dark-3 font-medium leading-snug">{offer.desc}</p>
              {offer.code && (
                <div className="flex items-center gap-2 mt-1.5">
                  <code className="text-xs font-mono font-bold text-blue bg-blue/10 px-2 py-0.5 rounded border border-blue/20">
                    {offer.code}
                  </code>
                  <button className="text-xs text-blue font-bold hover:underline">Copy</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
