import React from 'react';
import { Landmark } from 'lucide-react';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenDataSource: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenPrivacy,
  onOpenDataSource,
}) => {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200/80 py-8 px-6 md:px-12 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm text-center md:text-left">
          <Landmark className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Institutional rates via Monetary Authority of Singapore (MAS) API Feed</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm font-semibold text-slate-500">
          <button
            onClick={onOpenTerms}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={onOpenPrivacy}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenDataSource}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Data Source
          </button>
        </div>
      </div>
    </footer>
  );
};
