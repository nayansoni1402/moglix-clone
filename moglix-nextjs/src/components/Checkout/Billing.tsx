import React from "react";

const inputClass =
  "rounded-lg border border-gray-3 bg-[#F4F5F9] placeholder:text-dark-5 w-full py-2.5 px-4 text-sm outline-none transition-all focus:border-blue focus:ring-2 focus:ring-blue/20";

const labelClass = "block text-sm font-medium text-dark-3 mb-1.5";

const Billing = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full">
          <label htmlFor="firstName" className={labelClass}>
            First Name <span className="text-red">*</span>
          </label>
          <input type="text" name="firstName" id="firstName" placeholder="John" className={inputClass} />
        </div>
        <div className="w-full">
          <label htmlFor="lastName" className={labelClass}>
            Last Name <span className="text-red">*</span>
          </label>
          <input type="text" name="lastName" id="lastName" placeholder="Doe" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="companyName" className={labelClass}>
          Company Name <span className="text-dark-5 text-xs">(optional)</span>
        </label>
        <input type="text" name="companyName" id="companyName" placeholder="Your company" className={inputClass} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full">
          <label htmlFor="phone" className={labelClass}>
            Phone <span className="text-red">*</span>
          </label>
          <input type="tel" name="phone" id="phone" placeholder="+91 98765 43210" className={inputClass} />
        </div>
        <div className="w-full">
          <label htmlFor="email" className={labelClass}>
            Email Address <span className="text-red">*</span>
          </label>
          <input type="email" name="email" id="email" placeholder="you@example.com" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="address" className={labelClass}>
          Street Address <span className="text-red">*</span>
        </label>
        <input type="text" name="address" id="address" placeholder="House number and street name" className={inputClass} />
      </div>

      <div>
        <input
          type="text"
          name="addressTwo"
          id="addressTwo"
          placeholder="Apartment, suite, unit, etc. (optional)"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full">
          <label htmlFor="town" className={labelClass}>
            City / Town <span className="text-red">*</span>
          </label>
          <input type="text" name="town" id="town" placeholder="Mumbai" className={inputClass} />
        </div>
        <div className="w-full">
          <label htmlFor="state" className={labelClass}>
            State <span className="text-red">*</span>
          </label>
          <select id="state" className={`${inputClass} appearance-none`}>
            <option value="">Select state</option>
            <option>Maharashtra</option>
            <option>Delhi</option>
            <option>Karnataka</option>
            <option>Tamil Nadu</option>
            <option>Gujarat</option>
            <option>Rajasthan</option>
            <option>Uttar Pradesh</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="pincode" className={labelClass}>
            PIN Code <span className="text-red">*</span>
          </label>
          <input type="text" name="pincode" id="pincode" placeholder="400001" className={inputClass} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" id="saveAddress" className="rounded border-gray-3 text-blue" />
        <label htmlFor="saveAddress" className="text-sm text-dark-4 cursor-pointer">
          Save this address for future orders
        </label>
      </div>
    </div>
  );
};

export default Billing;
