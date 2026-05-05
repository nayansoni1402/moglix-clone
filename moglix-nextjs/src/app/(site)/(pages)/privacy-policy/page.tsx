import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";

export const metadata = { title: "Privacy Policy | Moglix" };

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly to us, such as when you create an account, place an order, or contact our support team. This includes your name, email address, phone number, shipping address, and payment information. We also automatically collect usage data such as IP address, browser type, and pages visited.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use the information we collect to process your orders, send transactional emails and SMS, manage your account, provide customer support, send promotional communications (with your consent), improve our services and website, and comply with legal obligations.",
  },
  {
    title: "3. Information Sharing",
    content:
      "We do not sell or rent your personal data to third parties. We may share your data with trusted service providers such as payment processors (Razorpay, PayPal), logistics partners (Blue Dart, Delhivery), and analytics providers, solely to fulfill orders and improve our service.",
  },
  {
    title: "4. Data Security",
    content:
      "We implement industry-standard security measures including SSL/TLS encryption, PCI-DSS compliant payment processing, and regular security audits to protect your personal information from unauthorized access, disclosure, alteration, or destruction.",
  },
  {
    title: "5. Cookies",
    content:
      "We use cookies and similar technologies to improve your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our platform.",
  },
  {
    title: "6. Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us at privacy@moglix.com. We will respond to your request within 30 days.",
  },
  {
    title: "7. Contact Us",
    content: "",
    isContact: true,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumb title="Privacy Policy" pages={["privacy-policy"]} />
      <section className="pt-6 pb-16 bg-[#F4F5F9]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs text-dark-4 bg-white inline-block px-3 py-1.5 rounded-full border border-gray-3">
              📅 Last Updated: May 1, 2025
            </p>
            <h1 className="text-2xl font-bold text-dark mt-3 mb-2">Privacy Policy</h1>
            <p className="text-dark-4 text-sm max-w-[600px]">
              At Moglix, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — main content */}
            <div className="lg:col-span-2 space-y-0 bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden">
              {sections.map((sec, i) => (
                <div key={i} className={`px-7 py-6 ${i !== sections.length - 1 ? "border-b border-gray-3" : ""}`}>
                  <h2 className="font-bold text-dark text-base mb-2">{sec.title}</h2>
                  {sec.isContact ? (
                    <p className="text-dark-3 text-sm leading-7">
                      Have questions about this Privacy Policy? <Link href="/contact" className="text-blue font-medium hover:underline">Contact our support team</Link> and we will get back to you within 24 hours.
                    </p>
                  ) : (
                    <p className="text-dark-3 text-sm leading-7">{sec.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Right — sidebar */}
            <div className="space-y-4">
              <div className="bg-blue rounded-xl p-5 text-white">
                <h3 className="font-bold text-base mb-3">🔒 Your Data is Safe</h3>
                <ul className="space-y-2 text-sm text-blue-light">
                  {["256-bit SSL Encryption", "PCI-DSS Compliant Payments", "No data sold to 3rd parties", "GDPR & IT Act compliant"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/90">
                      <span className="text-green-300">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-gray-3 p-5">
                <h3 className="font-bold text-dark text-sm mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  {[["Refund Policy", "/refund-policy"], ["Terms of Use", "/terms-of-use"], ["FAQ's", "/faq"], ["Contact Us", "/contact"]].map(([label, href]) => (
                    <li key={href}><Link href={href} className="text-blue hover:underline">→ {label}</Link></li>
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
