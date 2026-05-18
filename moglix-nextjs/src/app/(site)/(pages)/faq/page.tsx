"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Truck, RotateCcw, CreditCard, Wrench, ChevronRight } from "lucide-react";


const faqs = [
  {
    category: "Orders & Shipping",
    icon: <Truck size={18} />,
    items: [
      { q: "How do I track my order?", a: "Once your order is shipped, you will receive an SMS and email with your tracking number. You can also track your order from the 'My Orders' section in your account." },
      { q: "What are the delivery timeframes?", a: "Standard delivery takes 3–5 business days. Express delivery takes 1–2 business days. Same-day delivery is available in select metro cities for orders placed before 12 PM." },
      { q: "Do you offer bulk/B2B orders?", a: "Yes! Quant Procure specializes in B2B procurement. Contact our enterprise team at b2b@moglix.com or call 1800-XXX-XXXX for bulk pricing and dedicated account management." },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: <RotateCcw size={18} />,
    items: [
      { q: "What is your return policy?", a: "We offer a 7-day return window for most products. Items must be unused, in original packaging with all accessories. Visit our Refund Policy page for complete details." },
      { q: "How long do refunds take?", a: "Once we receive and inspect your return, refunds are processed within 5–7 business days to your original payment method." },
    ],
  },
  {
    category: "Payments",
    icon: <CreditCard size={18} />,
    items: [
      { q: "What payment methods do you accept?", a: "We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, EMI, and cash on delivery for select pin codes." },
      { q: "Is it safe to enter my card details?", a: "Absolutely. Our payment gateway is PCI-DSS compliant and uses 256-bit SSL encryption. We never store your card details on our servers." },
      { q: "Can I get a GST invoice for my purchase?", a: "Yes. A GST tax invoice is automatically generated for every order. Download it from the 'My Orders' section of your account." },
    ],
  },
  {
    category: "Products & Brands",
    icon: <Wrench size={18} />,
    items: [
      { q: "Are the products genuine?", a: "Yes, all products on Quant Procure are 100% genuine and sourced directly from brands or authorized distributors. We guarantee authenticity on every purchase." },
      { q: "Do products come with a manufacturer warranty?", a: "Most products come with a standard manufacturer warranty. The warranty period is mentioned on each product page. Contact our support team to claim a warranty." },
    ],
  },
];


export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...faqs.map((f) => f.category)];
  const filtered = activeCategory === "All" ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <>
      <Breadcrumb title="FAQ's" pages={["faq"]} />
      <section className="pt-6 pb-16 bg-[#F4F5F9]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-dark mb-2">Frequently Asked Questions</h1>
            <p className="text-dark-4 text-sm max-w-[550px]">
              Find answers to the most common questions about orders, shipping, returns, payments, and products.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — FAQ content */}
            <div className="lg:col-span-2">

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      activeCategory === cat
                        ? "bg-blue text-white border-blue"
                        : "bg-white text-dark-4 border-gray-3 hover:border-blue hover:text-blue"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Accordion */}
              <div className="space-y-4">
                {filtered.map((section) => (
                  <div key={section.category} className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 bg-[#F4F5F9] border-b border-gray-3">
                      <span>{section.icon}</span>
                      <h2 className="font-bold text-dark text-sm">{section.category}</h2>
                    </div>
                    <div className="divide-y divide-gray-3">
                      {section.items.map((item, i) => {
                        const key = `${section.category}-${i}`;
                        const isOpen = openKey === key;
                        return (
                          <div key={key}>
                            <button
                              onClick={() => setOpenKey(isOpen ? null : key)}
                              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F4F5F9] transition-colors"
                            >
                              <span className="font-semibold text-dark text-sm pr-4">{item.q}</span>
                              <span className={`text-blue text-lg shrink-0 font-bold transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>+</span>
                            </button>
                            {isOpen && (
                              <div className="px-5 pb-4 text-sm text-dark-3 leading-6 bg-[#F4F5F9] border-t border-gray-3">
                                <p className="pt-3">{item.a}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-blue rounded-xl p-5 text-white">
                <h3 className="font-bold text-base mb-1">Still Need Help?</h3>
                <p className="text-white/80 text-sm mb-4 leading-5">Can't find your answer? Our support team is available 24/7.</p>
                <Link href="/contact" className="flex items-center justify-center gap-2 bg-white text-blue font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-gray-1 transition-colors">
                  Contact Support <ChevronRight size={14} />
                </Link>

              </div>

              <div className="bg-white rounded-xl border border-gray-3 shadow-sm p-5">
                <h3 className="font-bold text-dark text-sm mb-3">Browse Categories</h3>
                <ul className="space-y-2">
                  {faqs.map((f) => (
                    <li key={f.category}>
                      <button
                        onClick={() => setActiveCategory(f.category)}
                        className="flex items-center gap-2 text-sm text-dark-4 hover:text-blue transition-colors w-full text-left"
                      >
                        <span>{f.icon}</span> {f.category}
                        <span className="ml-auto text-xs bg-[#F4F5F9] px-2 py-0.5 rounded-full">{f.items.length}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-gray-3 shadow-sm p-5">
                <h3 className="font-bold text-dark text-sm mb-3">Related Pages</h3>
                <ul className="space-y-2 text-sm">
                  {[["Refund Policy", "/refund-policy"], ["Privacy Policy", "/privacy-policy"], ["Terms of Use", "/terms-of-use"]].map(([label, href]) => (
                    <li key={href}><Link href={href} className="text-blue hover:underline flex items-center gap-1"><ChevronRight size={14} /> {label}</Link></li>
                  ))}

                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
