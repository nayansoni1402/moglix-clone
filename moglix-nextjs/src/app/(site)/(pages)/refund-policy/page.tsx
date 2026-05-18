import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Calendar, RotateCcw, Zap, Truck, X, ChevronRight } from "lucide-react";

export const metadata = { title: "Refund Policy | Moglix" };

export default function RefundPolicyPage() {
  return (
    <>
      <Breadcrumb title="Refund Policy" pages={["refund-policy"]} />
      <section className="pt-6 pb-16 bg-[#F4F5F9]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs text-dark-4 bg-white inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-3">
              <Calendar size={14} /> Last Updated: May 1, 2025
            </p>
            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">Refund & Return Policy</h1>
            <p className="text-dark-4 text-sm max-w-[600px]">
              We want you to be completely satisfied with your purchase. Here is everything you need to know about our return and refund process.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: <RotateCcw size={24} />, title: "7-Day Returns", desc: "Return within 7 days of delivery for a full refund" },
              { icon: <Zap size={24} />, title: "5–7 Day Refunds", desc: "Refund credited to your original payment method" },
              { icon: <Truck size={24} />, title: "Free Pickup", desc: "We arrange pickup from your doorstep at no cost" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-3 shadow-sm px-5 py-4 flex gap-4 items-start">
                <span className="text-blue mt-0.5">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-dark text-sm">{item.title}</h3>
                  <p className="text-xs text-dark-4 mt-0.5 leading-5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>


          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden">
              {[
                {
                  title: "1. Eligibility for Returns",
                  content: "Items must be returned within 7 days of delivery. Products must be unused, in original packaging with all tags and accessories intact. The following items are not eligible for returns: custom-cut cables and wires, consumables (blades, drill bits), and items marked as 'non-returnable' on the product page.",
                },
                {
                  title: "2. How to Initiate a Return",
                  steps: ["Log in to your Quant Procure account and go to My Orders.", "Select the item and click &quot;Request Return&quot;.", "Choose the reason and upload a photo if the item is damaged.", "Our team will schedule a pickup within 48 hours."],
                },
                {
                  title: "3. Refund Timeline",
                  content: "Once we receive and inspect the returned item, your refund will be processed within 5–7 business days. Refunds are credited to your original payment method — UPI, credit/debit card, net banking, or Quant Procure wallet.",
                },
                {
                  title: "4. Damaged or Defective Items",
                  content: "If you received a damaged or defective product, please contact us within 48 hours of delivery at support@moglix.com with your order ID and photos. We will arrange an immediate replacement or full refund.",
                },
              ].map((sec, i, arr) => (
                <div key={i} className={`px-7 py-6 ${i !== arr.length - 1 ? "border-b border-gray-3" : ""}`}>
                  <h2 className="font-bold text-dark text-base mb-2">{sec.title}</h2>
                  {sec.steps ? (
                    <ol className="list-decimal ml-5 space-y-1.5 text-sm text-dark-3 leading-6">
                      {sec.steps.map((s, j) => <li key={j}>{s}</li>)}
                    </ol>
                  ) : (
                    <p className="text-dark-3 text-sm leading-7">{sec.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-blue rounded-xl p-5 text-white">
                <h3 className="font-bold text-base mb-1">Need Help with a Return?</h3>
                <p className="text-white/80 text-sm mb-4">Our support team is available 24/7 to help you with your return request.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-blue font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-gray-1 transition-colors">
                  Contact Support <ChevronRight size={14} />
                </Link>

              </div>
              <div className="bg-white rounded-xl border border-gray-3 p-5">
                <h3 className="font-bold text-dark text-sm mb-3">Items Not Eligible</h3>
                <ul className="space-y-2 text-sm text-dark-3">
                  {["Custom-cut cables & wires", "Consumables (blades, bits)", "Items marked non-returnable", "Used / damaged by buyer"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><span className="text-red"><X size={14} /></span> {item}</li>
                  ))}
                </ul>

              </div>
              <div className="bg-white rounded-xl border border-gray-3 p-5">
                <h3 className="font-bold text-dark text-sm mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  {[["Privacy Policy", "/privacy-policy"], ["Terms of Use", "/terms-of-use"], ["FAQ's", "/faq"]].map(([label, href]) => (
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
