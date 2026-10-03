import React, { useEffect, useState } from 'react';
import { TutorialNotice } from '../game/useTutorial';

interface TutorialOverlayProps {
  notice: TutorialNotice | null;
  comboToast: string | null;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ notice, comboToast }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // 當 targetId 變更時，定位目標元素位置以繪製指引箭頭與高亮外框
  useEffect(() => {
    if (!notice?.targetId) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.getElementById(notice.targetId!);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [notice?.targetId]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden font-mono select-none">
      {/* 1. Target Element Spotlight Highlight Ring */}
      {targetRect && (
        <div
          style={{
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
          }}
          className="absolute border-2 border-black animate-pulse rounded-none pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.35)]"
        />
      )}

      {/* 2. Compact Tutorial Hint Box */}
      {notice && (
        <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 w-11/12 max-w-md pointer-events-auto">
          <div className="bg-white text-black border-2 border-black p-3 rounded-none shadow-[4px_4px_0px_#000000] flex flex-col space-y-1.5 transition-none">
            <div className="flex justify-between items-center border-b border-black pb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-black text-white px-1.5 py-0.5">
                {notice.badge || 'GUIDE // 指引'}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#525252]">
                ATELIER TUTORIAL
              </span>
            </div>

            <div className="flex items-center gap-2">
              {notice.arrow === 'down' && <span className="text-base font-bold animate-bounce">↓</span>}
              {notice.arrow === 'up' && <span className="text-base font-bold animate-bounce">↑</span>}
              {notice.arrow === 'right' && <span className="text-base font-bold animate-bounce">→</span>}
              {notice.arrow === 'left' && <span className="text-base font-bold animate-bounce">←</span>}

              <div className="text-xs sm:text-sm font-bold leading-snug">
                {notice.text}
              </div>
            </div>

            {notice.subText && (
              <div className="text-[11px] text-[#525252] border-t border-black/10 pt-1">
                {notice.subText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Combo Milestone Floating Notification Toast */}
      {comboToast && (
        <div className="absolute bottom-6 right-6 pointer-events-none z-50 animate-slideUp">
          <div className="bg-black text-white border-2 border-white px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,0.4)] flex items-center gap-2">
            <span className="w-2 h-2 bg-white animate-ping" />
            <span>{comboToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};
