import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

export const metadata = { title: "Terms of Use | Quant Procure" };

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing or using the Quant Procure website and services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform. Your continued use of the platform constitutes acceptance of any updates to these terms." },
  { title: "2. Use of the Platform", bullets: ["Use the platform in any way that violates applicable laws or regulations.", "Attempt to gain unauthorized access to any portion of the platform.", "Submit false or misleading information during checkout or registration.", "Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the platform."], intro: "You may use Quant Procure solely for lawful purposes. You agree not to:" },
  { title: "3. Account Responsibility", content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use at support@quantprocure.com." },
  { title: "4. Intellectual Property", content: "All content on this platform, including text, images, logos, and product descriptions, is the property of Quant Procure or its content suppliers and is protected by Indian and international copyright laws. You may not reproduce or distribute any content without prior written permission." },
  { title: "5. Pricing & Availability", content: "Quant Procure reserves the right to change product prices and availability at any time without notice. In the event of a pricing error, we reserve the right to cancel affected orders and issue a full refund." },
  { title: "6. Limitation of Liability", content: "To the fullest extent permitted by law, Quant Procure shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the platform or its services." },
  { title: "7. Governing Law", content: "These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India." },
  { title: "8. Changes to Terms", content: "We may update these Terms from time to time. We will notify you of significant changes by posting a notice on our website. Your continued use of the platform after changes are made constitutes your acceptance of the new Terms." },
];

export default function TermsOfUsePage() {
  return (
    <>
      <Breadcrumb title="Terms of Use" pages={["terms-of-use"]} />
      <section className="pt-6 pb-16 bg-[#F4F5F9]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          <div className="mb-8">
            <p className="text-xs text-dark-4 bg-white inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-3">
              <Calendar size={14} /> Effective Date: May 1, 2025
            </p>

            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">Terms of Use</h1>
            <p className="text-dark-4 text-sm max-w-[600px]">
              Please read these terms carefully before using Quant Procure. By using our platform, you agree to these terms and conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Content */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden">
              {sections.map((sec, i) => (
                <div key={i} className={`px-7 py-6 ${i !== sections.length - 1 ? "border-b border-gray-3" : ""}`}>
                  <h2 className="font-bold text-dark text-base mb-2">{sec.title}</h2>
                  {sec.bullets ? (
                    <>
                      <p className="text-dark-3 text-sm leading-7 mb-2">{sec.intro}</p>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-dark-3 leading-6">
                        {sec.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    </>
                  ) : (
                    <p className="text-dark-3 text-sm leading-7">{sec.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Table of Contents */}
              <div className="bg-white rounded-xl border border-gray-3 shadow-sm p-5">
                <h3 className="font-bold text-dark text-sm mb-3">Contents</h3>
                <ul className="space-y-1.5 text-sm">
                  {sections.map((sec, i) => (
                    <li key={i} className="text-dark-4 hover:text-blue cursor-pointer transition-colors text-xs leading-5">
                      {sec.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue rounded-xl p-5 text-white">
                <h3 className="font-bold text-sm mb-1">Have a Question?</h3>
                <p className="text-white/80 text-xs mb-3 leading-5">If anything in our Terms is unclear, please reach out.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-blue font-bold text-sm px-4 py-2 rounded-lg hover:bg-gray-1 transition-colors">
                  Contact Us <ChevronRight size={14} />
                </Link>

              </div>
              <div className="bg-white rounded-xl border border-gray-3 p-5">
                <h3 className="font-bold text-dark text-sm mb-3">Related Policies</h3>
                <ul className="space-y-2 text-sm">
                  {[["Privacy Policy", "/privacy-policy"], ["Refund Policy", "/refund-policy"], ["FAQ's", "/faq"]].map(([label, href]) => (
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
