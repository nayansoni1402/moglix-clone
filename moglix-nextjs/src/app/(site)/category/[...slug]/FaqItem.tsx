"use client";

import React, { useState } from "react";

export default function FaqItem({ faq }: { faq: { question: string; answer: string } }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-3 rounded-md overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 text-left text-sm font-semibold transition-colors ${isOpen ? "bg-gray-1 text-blue" : "bg-white text-dark hover:bg-gray-50"}`}
            >
                <span>{faq.question}</span>
                <span className="text-lg">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
                <div className="p-4 pt-0 bg-gray-1">
                    <p className="text-dark-3 text-sm leading-relaxed">{faq.answer}</p>
                </div>
            )}
        </div>
    );
}
