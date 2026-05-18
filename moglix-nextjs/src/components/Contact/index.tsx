import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { 
  Mail, 
  MapPin, 
  Map, 
  Phone, 
  Building, 
  Factory, 
  Timer, 
  Send,
  ChevronRight 
} from "lucide-react";


const inputClass =
  "rounded-lg border border-gray-3 bg-[#F4F5F9] placeholder:text-dark-5 w-full py-2.5 px-4 text-sm outline-none transition-all focus:border-blue focus:ring-2 focus:ring-blue/20";
const labelClass = "block text-sm font-medium text-dark-3 mb-1.5";

const Contact = () => {
  return (
    <>
      <Breadcrumb title={"Contact"} pages={["contact"]} />

      <section className="pt-4 pb-16 bg-[#F4F5F9]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-dark mb-1">Get in Touch</h1>
            <p className="text-dark-4 text-sm">Our support team is available 24/7. We typically respond within 2–4 hours.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT — Contact Form */}
            <div className="lg:flex-1">

              {/* Contact Form Card */}
              <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden mb-5">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-3 bg-[#F4F5F9]">
                  <span className="w-6 h-6 rounded-full bg-blue text-white text-xs flex items-center justify-center font-bold"><Mail size={14} /></span>
                  <h3 className="font-bold text-dark text-sm">Send us a Message</h3>
                </div>

                <div className="p-5 sm:p-7">
                  <form>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="firstName" className={labelClass}>First Name <span className="text-red">*</span></label>
                        <input type="text" name="firstName" id="firstName" placeholder="John" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="lastName" className={labelClass}>Last Name <span className="text-red">*</span></label>
                        <input type="text" name="lastName" id="lastName" placeholder="Doe" className={inputClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="email" className={labelClass}>Email Address <span className="text-red">*</span></label>
                        <input type="email" name="email" id="email" placeholder="you@example.com" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelClass}>Phone Number</label>
                        <input type="tel" name="phone" id="phone" placeholder="+91 98765 43210" className={inputClass} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="subject" className={labelClass}>Subject <span className="text-red">*</span></label>
                      <select id="subject" name="subject" className={`${inputClass} appearance-none`}>
                        <option value="">Select a topic</option>
                        <option>Order Tracking</option>
                        <option>Return / Refund Request</option>
                        <option>Product Inquiry</option>
                        <option>Bulk / B2B Orders</option>
                        <option>Payment Issue</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="message" className={labelClass}>Message <span className="text-red">*</span></label>
                      <textarea
                        name="message"
                        id="message"
                        rows={5}
                        placeholder="Describe your issue or question in detail..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 font-bold text-white bg-blue py-3 px-8 rounded-lg transition-all duration-200 hover:bg-blue-dark shadow-sm text-sm uppercase tracking-wider"
                    >
                      Send Message <Send size={16} />
                    </button>


                  </form>
                </div>
              </div>

              {/* Map / Location Card */}
              <div className="bg-white rounded-xl border border-gray-3 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-3 bg-[#F4F5F9]">
                  <span className="text-blue"><MapPin size={20} /></span>
                  <h3 className="font-bold text-dark text-sm">Our Location</h3>
                </div>

                <div className="p-5">
                  <div className="w-full h-[200px] bg-[#F4F5F9] rounded-lg flex items-center justify-center border border-gray-3">
                    <div className="flex flex-col items-center text-center">
                      <span className="text-blue/40 mb-3"><Map size={48} /></span>
                      <p className="text-sm text-dark-4 font-bold">Quant Procure India Headquarters</p>
                      <p className="text-xs text-dark-5 mt-1">B-25, Sector 58, Noida, Uttar Pradesh 201301</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT — Info Sidebar (sticky) */}
            <div className="lg:w-[350px] shrink-0">
              <div className="sticky top-[170px] space-y-4">

                {/* Contact Info */}
                <div className="bg-blue rounded-xl p-5 text-white">
                  <h3 className="font-bold text-base mb-4">Contact Information</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-white/70 mt-0.5"><Phone size={20} /></span>

                      <div>
                        <p className="font-semibold text-sm">Phone / WhatsApp</p>
                        <p className="text-white/80 text-sm">+91 1800-XXX-XXXX</p>
                        <p className="text-white/60 text-xs">Mon–Sat, 9 AM – 8 PM</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-white/70 mt-0.5"><Mail size={20} /></span>

                      <div>
                        <p className="font-semibold text-sm">Email Support</p>
                        <p className="text-white/80 text-sm">support@moglix.com</p>
                        <p className="text-white/60 text-xs">Response within 2–4 hours</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-white/70 mt-0.5"><Building size={20} /></span>

                      <div>
                        <p className="font-semibold text-sm">Head Office</p>
                        <p className="text-white/80 text-sm leading-5">B-25, Sector 58, Noida,<br />Uttar Pradesh 201301</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-white/70 mt-0.5"><Factory size={20} /></span>

                      <div>
                        <p className="font-semibold text-sm">B2B / Enterprise</p>
                        <p className="text-white/80 text-sm">b2b@moglix.com</p>
                        <p className="text-white/60 text-xs">Bulk orders & procurement</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Response Time */}
                <div className="bg-white rounded-xl border border-gray-3 shadow-sm p-5">
                  <h3 className="font-bold text-dark text-sm mb-3 flex items-center gap-2">
                    <Timer size={18} className="text-blue" /> Response Times
                  </h3>

                  <ul className="space-y-2.5 text-sm">
                    {[
                      { channel: "Live Chat", time: "Under 5 mins", dot: "bg-green-400" },
                      { channel: "WhatsApp", time: "Under 30 mins", dot: "bg-green-400" },
                      { channel: "Email", time: "2–4 hours", dot: "bg-yellow-400" },
                      { channel: "Call Back", time: "24 hours", dot: "bg-orange-400" },
                    ].map((item) => (
                      <li key={item.channel} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-dark-3">
                          <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                          {item.channel}
                        </span>
                        <span className="text-dark font-medium text-xs">{item.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl border border-gray-3 shadow-sm p-5">
                  <h3 className="font-bold text-dark text-sm mb-3">Quick Help</h3>
                  <ul className="space-y-2 text-sm">
                    {[["Track My Order", "/my-account"], ["Return / Refund", "/refund-policy"], ["FAQ's", "/faq"], ["Privacy Policy", "/privacy-policy"]].map(([label, href]) => (
                      <li key={href}><Link href={href} className="text-blue hover:underline flex items-center gap-1"><ChevronRight size={14} /> {label}</Link></li>
                    ))}

                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
