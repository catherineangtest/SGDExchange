import React from 'react';
import { BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationBannerProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  onAction?: () => void;
  actionText?: string;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible,
  message,
  onDismiss,
  onAction,
  actionText,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-[74px] md:bottom-6 left-1/2 w-[92%] max-w-[600px] bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-slate-700/80 z-50 gap-3"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-slate-100 truncate md:text-clip">
              {message}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onAction && actionText && (
              <button
                onClick={onAction}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                {actionText}
              </button>
            )}
            <button
              onClick={onDismiss}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
