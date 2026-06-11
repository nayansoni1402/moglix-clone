"use client";
import React from "react";
import { useConfig } from "@/app/context/ConfigContext";

const HomeSeoDescription = () => {
  const { seoDescription } = useConfig();

  return (
    <section className="bg-gray-1 py-10 mt-10 border-t border-gray-3">
      <div className="max-w-[1300px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {seoDescription ? (
          <div className="text-sm text-dark-3 space-y-4">
            {parseMarkdown(seoDescription)}
          </div>
        ) : (
          <div className="text-sm text-dark-3 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-dark mb-2">Quant Procure – Trusted B2B & B2C E-commerce Platform for Industrial Products</h2>
              <p className="mb-3">
                Quant Procure is a leading e-commerce platform serving both B2B and B2C customers with a wide range of industrial and business products. We provide a seamless digital procurement experience for industries, businesses, and individual buyers across India.
              </p>
              <p className="mb-3">
                Quant Procure offers products across multiple categories, including industrial tools, electrical equipment, home appliances, office supplies, agricultural tools, construction products, medical equipment, safety products, and automotive parts.
              </p>
              <p>
                With 800,000+ SKUs across 1,500+ categories, Quant Procure helps businesses simplify procurement, manage supply chains, and source quality products from trusted sellers. We support industries such as manufacturing, agriculture, construction, healthcare, automotive, and commercial sectors with reliable solutions and nationwide delivery.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-dark mb-2">Top-Selling B2B Categories</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Home & Kitchen Appliances:</strong> Quant Procure provides a wide range of home and kitchen appliances including air conditioners, refrigerators, televisions, geysers, heaters, fans, mixer grinders, blenders, cookers, gas stoves, cooktops, and more from trusted brands.</li>
                <li><strong>Industrial Tools:</strong> Improve productivity and efficiency with Quant Procure’s industrial tool range. Our products include power tools, drills, grinders, pneumatic tools, material handling equipment, precision measuring tools, cutting tools, welding machines, tool kits, saws, spanners, vices, clamps, and other professional tools.</li>
                <li><strong>Electrical Tools & Equipment:</strong> Find reliable electrical products designed for industrial and commercial requirements. Our range includes wires, cables, switches, circuit breakers, fuses, generators, transformers, solar inverters, electrical accessories, and more.</li>
                <li><strong>Safety & Industrial Supplies:</strong> Quant Procure also offers essential industrial supplies including safety equipment, workplace tools, maintenance products, and construction essentials to help businesses operate efficiently.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-dark mb-2">Why Choose Quant Procure for Industrial Shopping?</h2>
              <ul className="list-disc pl-5 space-y-2 mb-3">
                <li>Trusted by 1,50,000+ SMEs and enterprises across India</li>
                <li>Access to 8,00,000+ products across multiple categories</li>
                <li>Partner network of 10,000+ sellers</li>
                <li>Digital procurement solutions for businesses of all sizes</li>
                <li>Nationwide delivery across 25,000+ PIN codes</li>
                <li>Reliable sourcing for industrial, commercial, and everyday business needs</li>
              </ul>
              <p>
                Quant Procure makes industrial procurement simple, faster, and more efficient by bringing thousands of products and trusted suppliers together on one platform.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Simple yet extremely robust custom Markdown parser to avoid large NPM dependencies
function parseMarkdown(md: string) {
  if (!md) return null;
  
  // Split by any number of newlines to process line-by-line safely
  const lines = md.split(/\n+/);
  
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    
    // 1. Heading: Starts and ends with ** (like **Heading Title**)
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <h2 key={idx} className="text-lg font-semibold text-dark mt-6 mb-2 block">
          {trimmed.slice(2, -2)}
        </h2>
      );
    }
    
    // 2. Standard Markdown Headings
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-base font-semibold text-dark mt-6 mb-2 block">
          {renderInline(trimmed.substring(4))}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-lg font-semibold text-dark mt-6 mb-2 block">
          {renderInline(trimmed.substring(3))}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-xl font-bold text-dark mt-6 mb-2 block">
          {renderInline(trimmed.substring(2))}
        </h1>
      );
    }
    
    // 3. Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const cleanItem = trimmed.replace(/^[-*]\s+/, "");
      return (
        <ul key={idx} className="list-disc pl-5 my-2">
          <li>{renderInline(cleanItem)}</li>
        </ul>
      );
    }
    
    // 4. Auto-bold prefix list items (e.g. "Category Name: Description of category")
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex > 0 && colonIndex < 40) {
      const prefix = trimmed.substring(0, colonIndex);
      const suffix = trimmed.substring(colonIndex + 1);
      return (
        <p key={idx} className="mb-3 leading-relaxed">
          <strong>{prefix}:</strong>{renderInline(suffix)}
        </p>
      );
    }
    
    // 5. Standard paragraph
    return (
      <p key={idx} className="mb-3 leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });
}

function renderInline(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
}

export default HomeSeoDescription;
