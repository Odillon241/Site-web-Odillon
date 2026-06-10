"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CompanyLogo } from "@/types/admin";

interface LogoRotatorProps {
  logos: CompanyLogo[];
  interval?: number; // in ms, default 3000
}

function LogoItem({ company }: { company: CompanyLogo }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative flex items-center justify-center w-20 h-14 sm:w-28 sm:h-18 md:w-36 md:h-22 lg:w-40 lg:h-24 transition-all duration-300">
      {!imageError && company.logo_path ? (
        <div className="relative w-full h-full flex items-center justify-center transition-all duration-300 group-hover:scale-105">
          <Image
            src={company.logo_path}
            alt={`${company.name} logo`}
            width={120}
            height={80}
            sizes="(max-width: 640px) 70px, (max-width: 768px) 100px, 120px"
            className="object-contain max-w-full max-h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="text-center w-full group-hover:scale-105 transition-transform">
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 text-odillon-teal/60 group-hover:text-odillon-teal transition-colors duration-300">
            {company.fallback}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
            {company.name}
          </div>
        </div>
      )}
    </div>
  );
}

export function LogoRotator({ logos, interval = 3000 }: LogoRotatorProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 4; // Show up to 4 logos at once

  const totalPages = Math.ceil(logos.length / itemsPerPage);

  useEffect(() => {
    if (logos.length <= itemsPerPage) return;

    const timer = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % totalPages);
    }, interval);

    return () => clearInterval(timer);
  }, [logos.length, totalPages, interval]);

  if (!logos || logos.length === 0) return null;

  // Extract the logos to show on the current page
  const displayedLogos: CompanyLogo[] = [];
  if (logos.length <= itemsPerPage) {
    displayedLogos.push(...logos);
  } else {
    const startIndex = pageIndex * itemsPerPage;
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (startIndex + i) % logos.length;
      displayedLogos.push(logos[index]);
    }
  }

  return (
    <div className="relative w-full overflow-hidden min-h-[60px] sm:min-h-[80px] md:min-h-[100px] flex items-center justify-center py-2">
      <AnimatePresence mode="wait">
        <m.div
          key={pageIndex}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="grid grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full items-center justify-items-center"
        >
          {displayedLogos.map((company, idx) => (
            <div
              key={`${company.id}-${idx}`}
              className={`items-center justify-center w-full ${idx === 3 ? "hidden md:flex" : "flex"}`}
            >
              <LogoItem company={company} />
            </div>
          ))}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
