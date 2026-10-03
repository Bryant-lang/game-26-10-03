import React from 'react';

interface IconProps {
  id: string;
  className?: string;
  size?: number;
}

export const PixelIcon: React.FC<IconProps> = ({ id, className = '', size = 32 }) => {
  const s = size;

  switch (id) {
    // 💡 主要資源：靈感
    case 'inspiration':
    case 'lightbulb':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          {/* Outer glow */}
          <circle cx="12" cy="9" r="8" fill="#F59E0B" fillOpacity="0.25" />
          {/* Bulb glass */}
          <path d="M12 2C8.134 2 5 5.134 5 9c0 2.38 1.19 4.47 3 5.74V17h8v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.866-3.134-7-7-7z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          {/* Filament highlight */}
          <circle cx="10" cy="7" r="1.5" fill="#FEF3C7" />
          <path d="M10 10c.8 1 3.2 1 4 0" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bulb base */}
          <rect x="9" y="17" width="6" height="2" fill="#9CA3AF" />
          <rect x="9.5" y="19" width="5" height="1.5" fill="#6B7280" />
          <rect x="10.5" y="20.5" width="3" height="1.5" fill="#4B5563" />
        </svg>
      );

    // ⚡ 點擊力量 / 閃電
    case 'lightning':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          <path d="M13 2L4 14h7l-2 8 11-12h-7l2-8z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="miter" />
          <path d="M11 6L7 13h4l-1 4 5-6h-4l1-5z" fill="#FEF08A" />
        </svg>
      );

    // 🔥 Combo 火焰
    case 'flame':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          <path d="M12 2c-.5 3-3 5-4.5 7.5C6 12 5 14 5 16a7 7 0 0014 0c0-3-2-6-4.5-9-1 2.5-3 3-2.5-5z" fill="#EF4444" />
          <path d="M12 7c-.5 2-2 3.5-3 5-1 1.5-1.5 2.5-1.5 4a4.5 4.5 0 009 0c0-2-1.5-4-3-6-.5 1.5-1.5 2-1.5-3z" fill="#F97316" />
          <circle cx="12" cy="17" r="2.5" fill="#FDE047" />
        </svg>
      );

    // ❄️ 冷卻中 / 冰晶
    case 'snowflake':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="#38BDF8" strokeWidth="2" strokeLinecap="square" />
          <path d="M10 4l2-2 2 2M10 20l2 2 2-2M4 10l-2 2 2 2M20 10l2 2-2 2" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="square" />
          <circle cx="12" cy="12" r="2" fill="#E0F2FE" />
        </svg>
      );

    // 📈 倍率 / 自動產生
    case 'rate':
    case 'multiplier':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          <path d="M3 17l6-6 4 4 8-8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
          <path d="M15 7h6v6" stroke="#10B981" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      );

    // ✏️ 鉛筆圖示 (靈感工坊 Logo)
    case 'pencil':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          <polygon points="14,3 21,10 8,23 1,23 1,16" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <polygon points="1,23 5,23 1,19" fill="#1E293B" />
          <circle cx="2.5" cy="21.5" r="0.8" fill="#F8FAFC" />
          <line x1="12" y1="5" x2="19" y2="12" stroke="#FEF08A" strokeWidth="1" />
          <polygon points="17,1 23,7 20,10 14,4" fill="#F43F5E" />
          <rect x="13.5" y="4.5" width="2" height="7" transform="rotate(45 13.5 4.5)" fill="#CBD5E1" />
        </svg>
      );

    // ⚙️ 齒輪圖示
    case 'gear':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="#94A3B8" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      );

    // ⬆️ 向上箭頭 (全域升級 3)
    case 'up_arrow':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          <polygon points="12,3 4,11 9,11 9,21 15,21 15,11 20,11" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          <polygon points="12,6 7,11 10,11 10,19 14,19 14,11 17,11" fill="#BAE6FD" />
        </svg>
      );

    // ⭐ 金色星星 (全域升級 4)
    case 'star':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={`inline-block ${className}`}>
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          <polygon points="12,5 14,10 19,10 15,14 16,18 12,15 8,18 9,14 5,10 10,10" fill="#FEF08A" />
        </svg>
      );

    // 1. 草稿桌
    case 'draft_table':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <rect x="4" y="10" width="24" height="4" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <rect x="6" y="14" width="4" height="14" fill="#92400E" />
          <rect x="22" y="14" width="4" height="14" fill="#92400E" />
          {/* Papers */}
          <rect x="8" y="7" width="8" height="5" transform="rotate(-6 8 7)" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8" />
          <line x1="9" y1="8" x2="14" y2="8" stroke="#92400E" strokeWidth="0.6" />
          {/* Plant */}
          <rect x="22" y="6" width="4" height="4" fill="#D97706" />
          <circle cx="23" cy="5" r="2" fill="#15803D" />
          <circle cx="25" cy="4" r="2" fill="#16A34A" />
        </svg>
      );

    // 2. 靈感書架
    case 'bookshelf':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <rect x="4" y="4" width="24" height="24" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          <rect x="6" y="6" width="20" height="9" fill="#92400E" />
          <rect x="6" y="17" width="20" height="9" fill="#92400E" />
          {/* Top shelf books */}
          <rect x="8" y="7" width="3" height="8" fill="#DC2626" />
          <rect x="12" y="8" width="2.5" height="7" fill="#2563EB" />
          <rect x="15.5" y="7.5" width="3" height="7.5" fill="#16A34A" />
          <rect x="19.5" y="7" width="4" height="8" fill="#F59E0B" />
          {/* Bottom shelf books */}
          <rect x="8" y="18" width="4" height="8" fill="#9333EA" />
          <rect x="13" y="19" width="3" height="7" fill="#0D9488" />
          <rect x="17" y="18" width="2.5" height="8" fill="#EA580C" />
          <rect x="20.5" y="18.5" width="3.5" height="7.5" fill="#D97706" />
        </svg>
      );

    // 3. 創作電腦
    case 'computer':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          {/* Desk */}
          <rect x="2" y="24" width="28" height="3" fill="#4B5563" />
          <rect x="4" y="27" width="3" height="4" fill="#374151" />
          <rect x="25" y="27" width="3" height="4" fill="#374151" />
          {/* Monitor */}
          <rect x="6" y="6" width="16" height="12" rx="1" fill="#1E293B" stroke="#0EA5E9" strokeWidth="1" />
          <rect x="8" y="8" width="12" height="8" fill="#0284C7" />
          <line x1="9" y1="10" x2="13" y2="10" stroke="#E0F2FE" strokeWidth="1" />
          <line x1="9" y1="12" x2="18" y2="12" stroke="#BAE6FD" strokeWidth="0.8" />
          <rect x="12" y="18" width="4" height="4" fill="#475569" />
          <rect x="10" y="22" width="8" height="2" fill="#334155" />
          {/* PC Tower */}
          <rect x="23" y="10" width="6" height="14" rx="1" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <circle cx="26" cy="13" r="1" fill="#06B6D4" />
          <line x1="25" y1="17" x2="27" y2="17" stroke="#334155" strokeWidth="1" />
        </svg>
      );

    // 4. 專業工作站
    case 'workstation':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <rect x="2" y="23" width="28" height="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          {/* Dual monitors */}
          <rect x="3" y="8" width="12" height="11" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
          <rect x="5" y="10" width="8" height="7" fill="#0369A1" />
          <rect x="16" y="8" width="13" height="11" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
          <rect x="18" y="10" width="9" height="7" fill="#0284C7" />
          {/* Blue graphs on screen */}
          <polyline points="19,15 21,12 23,14 25,11" stroke="#BAE6FD" strokeWidth="1" />
          {/* Keyboard & accessories */}
          <rect x="11" y="21" width="10" height="2" fill="#334155" />
          <circle cx="23" cy="22" r="1" fill="#64748B" />
        </svg>
      );

    // 5. 創意工作室
    case 'studio':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          {/* Studio building/greenhouse frame */}
          <polygon points="16,3 3,11 3,28 29,28 29,11" fill="#14532D" stroke="#166534" strokeWidth="1" />
          <rect x="6" y="13" width="8" height="13" fill="#84CC16" fillOpacity="0.25" stroke="#22C55E" strokeWidth="1" />
          <rect x="17" y="13" width="9" height="13" fill="#FDE047" fillOpacity="0.25" stroke="#EAB308" strokeWidth="1" />
          {/* Easel inside */}
          <line x1="9" y1="24" x2="11" y2="15" stroke="#B45309" strokeWidth="1" />
          <line x1="13" y1="24" x2="11" y2="15" stroke="#B45309" strokeWidth="1" />
          <rect x="8" y="17" width="6" height="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8" />
          {/* Roof decoration */}
          <circle cx="16" cy="7" r="2" fill="#F59E0B" />
        </svg>
      );

    // 6. 研究中心
    case 'research_center':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          {/* Base building */}
          <rect x="4" y="14" width="24" height="14" rx="2" fill="#1E293B" stroke="#0284C7" strokeWidth="1" />
          {/* Glass Dome */}
          <path d="M10 14a6 6 0 0112 0H10z" fill="#38BDF8" fillOpacity="0.6" stroke="#0284C7" strokeWidth="1" />
          {/* Observatory telescope/antenna */}
          <line x1="16" y1="8" x2="22" y2="3" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="square" />
          {/* Windows / Labs */}
          <rect x="7" y="18" width="5" height="4" fill="#0EA5E9" />
          <rect x="14" y="18" width="4" height="4" fill="#38BDF8" />
          <rect x="20" y="18" width="5" height="4" fill="#0EA5E9" />
          {/* Foundation */}
          <rect x="2" y="27" width="28" height="3" fill="#0F172A" />
        </svg>
      );

    // 7. 大型創作基地
    case 'creation_base':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          {/* Left Tower */}
          <rect x="3" y="10" width="7" height="18" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          {/* Center Main Spire */}
          <rect x="12" y="4" width="8" height="24" fill="#334155" stroke="#64748B" strokeWidth="1" />
          <polygon points="12,4 16,1 20,4" fill="#0284C7" />
          {/* Right Tower */}
          <rect x="22" y="12" width="7" height="16" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          {/* Bridge connection */}
          <rect x="10" y="14" width="12" height="3" fill="#0EA5E9" fillOpacity="0.6" />
          {/* Neon lights */}
          <circle cx="16" cy="9" r="1.5" fill="#38BDF8" />
          <circle cx="6.5" cy="14" r="1" fill="#F59E0B" />
          <circle cx="25.5" cy="16" r="1" fill="#10B981" />
        </svg>
      );

    // 8. 創意工廠
    case 'creative_factory':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          {/* Chimneys */}
          <rect x="6" y="5" width="4" height="10" fill="#713F12" stroke="#451A03" strokeWidth="1" />
          <rect x="13" y="3" width="4" height="12" fill="#713F12" stroke="#451A03" strokeWidth="1" />
          <rect x="20" y="7" width="4" height="8" fill="#713F12" stroke="#451A03" strokeWidth="1" />
          {/* Smoke clouds */}
          <circle cx="8" cy="3" r="2.5" fill="#E2E8F0" fillOpacity="0.7" />
          <circle cx="15" cy="1" r="2.5" fill="#E2E8F0" fillOpacity="0.8" />
          {/* Main factory hall with saw roof */}
          <polygon points="4,15 11,12 11,15 18,12 18,15 25,12 28,15 28,28 4,28" fill="#475569" stroke="#1E293B" strokeWidth="1" />
          {/* Factory gate & glowing yellow windows */}
          <rect x="12" y="21" width="8" height="7" fill="#0F172A" />
          <rect x="6" y="18" width="4" height="3" fill="#FBBF24" />
          <rect x="22" y="18" width="4" height="3" fill="#FBBF24" />
        </svg>
      );

    // ==========================================
    // 設備專屬升級圖示
    // ==========================================
    case 'high_grade_paper':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M6 3h9l5 5v13H6V3z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <path d="M15 3v5h5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          <line x1="9" y1="11" x2="15" y2="11" stroke="#B45309" strokeWidth="1.2" />
          <line x1="9" y1="14" x2="15" y2="14" stroke="#B45309" strokeWidth="1.2" />
          <line x1="9" y1="17" x2="13" y2="17" stroke="#B45309" strokeWidth="1.2" />
        </svg>
      );

    case 'quick_concept':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="10" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          <line x1="12" y1="2" x2="12" y2="4" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="5" x2="6.5" y2="6.5" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
          <line x1="19" y1="5" x2="17.5" y2="6.5" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
          <rect x="9.5" y="16" width="5" height="3" fill="#6B7280" />
        </svg>
      );

    case 'categorize':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="16" width="16" height="4" rx="1" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1" />
          <rect x="5" y="11" width="14" height="4" rx="1" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1" />
          <rect x="6" y="6" width="12" height="4" rx="1" fill="#059669" stroke="#047857" strokeWidth="1" />
        </svg>
      );

    case 'inspiration_index':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="3" width="15" height="18" rx="2" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />
          <rect x="3" y="5" width="3" height="14" fill="#3B82F6" />
          {/* Bookmark ribbon */}
          <polygon points="12,3 15,3 15,10 13.5,8.5 12,10" fill="#EF4444" />
          <circle cx="11.5" cy="14" r="2.5" fill="#FBBF24" />
        </svg>
      );

    case 'fast_cpu':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="5" y="5" width="14" height="14" rx="2" fill="#0F172A" stroke="#06B6D4" strokeWidth="1.5" />
          <rect x="8" y="8" width="8" height="8" fill="#0284C7" />
          {/* Pins */}
          <line x1="8" y1="2" x2="8" y2="5" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="12" y1="2" x2="12" y2="5" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="16" y1="2" x2="16" y2="5" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="8" y1="19" x2="8" y2="22" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="12" y1="19" x2="12" y2="22" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="16" y1="19" x2="16" y2="22" stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
      );

    case 'multitasking':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="3" width="18" height="13" rx="1.5" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Multi-windows */}
          <rect x="5" y="5" width="6" height="4" fill="#0284C7" />
          <rect x="13" y="5" width="6" height="4" fill="#10B981" />
          <rect x="5" y="10.5" width="14" height="4" fill="#F59E0B" />
          <rect x="10" y="16" width="4" height="4" fill="#64748B" />
          <line x1="8" y1="20" x2="16" y2="20" stroke="#64748B" strokeWidth="2" />
        </svg>
      );

    case 'pro_equipment':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="#1E293B" />
          <rect x="11" y="2" width="2" height="4" fill="#F59E0B" />
          <rect x="11" y="18" width="2" height="4" fill="#F59E0B" />
          <rect x="2" y="11" width="4" height="2" fill="#F59E0B" />
          <rect x="18" y="11" width="4" height="2" fill="#F59E0B" />
        </svg>
      );

    case 'optimized_flow':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="5" r="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
          <circle cx="6" cy="17" r="3" fill="#10B981" stroke="#047857" strokeWidth="1" />
          <circle cx="18" cy="17" r="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <line x1="12" y1="8" x2="6" y2="14" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="12" y1="8" x2="18" y2="14" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="9" y1="17" x2="15" y2="17" stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
      );

    case 'full_toolset':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="8" width="16" height="12" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#9CA3AF" strokeWidth="1.5" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="#7F1D1D" strokeWidth="1.5" />
          <rect x="10.5" y="11" width="3" height="3" fill="#F59E0B" />
        </svg>
      );

    case 'efficient_process':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <polygon points="6,18 6,10 9,10 9,18" fill="#10B981" />
          <polygon points="4,10 7.5,5 11,10" fill="#10B981" />
          <polygon points="12,18 12,8 15,8 15,18" fill="#22C55E" />
          <polygon points="10,8 13.5,3 17,8" fill="#22C55E" />
          <polygon points="18,18 18,12 21,12 21,18" fill="#4ADE80" />
          <polygon points="16,12 19.5,7 23,12" fill="#4ADE80" />
        </svg>
      );

    case 'data_center':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="5" y="3" width="14" height="5" rx="1" fill="#1E293B" stroke="#0EA5E9" strokeWidth="1" />
          <circle cx="8" cy="5.5" r="1" fill="#10B981" />
          <circle cx="11" cy="5.5" r="1" fill="#38BDF8" />
          <rect x="5" y="9.5" width="14" height="5" rx="1" fill="#1E293B" stroke="#0EA5E9" strokeWidth="1" />
          <circle cx="8" cy="12" r="1" fill="#10B981" />
          <circle cx="11" cy="12" r="1" fill="#38BDF8" />
          <rect x="5" y="16" width="14" height="5" rx="1" fill="#1E293B" stroke="#0EA5E9" strokeWidth="1" />
          <circle cx="8" cy="18.5" r="1" fill="#10B981" />
          <circle cx="11" cy="18.5" r="1" fill="#38BDF8" />
        </svg>
      );

    case 'highspeed_research':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 16a8 8 0 1116 0H4z" fill="#0F172A" stroke="#EF4444" strokeWidth="1.5" />
          <line x1="12" y1="16" x2="17" y2="10" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="2" fill="#EF4444" />
        </svg>
      );

    case 'modular_production':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="12" width="8" height="8" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
          <rect x="13" y="12" width="8" height="8" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
          <rect x="8" y="4" width="8" height="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
        </svg>
      );

    case 'smart_management':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="18" width="6" height="4" fill="#334155" />
          <line x1="7" y1="18" x2="11" y2="11" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="square" />
          <line x1="11" y1="11" x2="17" y2="8" stroke="#93C5FD" strokeWidth="2" strokeLinecap="square" />
          <circle cx="11" cy="11" r="2" fill="#2563EB" />
          <polygon points="17,6 20,8 17,10" fill="#F59E0B" />
        </svg>
      );

    case 'automation':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="15" width="18" height="4" rx="2" fill="#334155" stroke="#1E293B" strokeWidth="1" />
          <circle cx="7" cy="17" r="1.5" fill="#64748B" />
          <circle cx="12" cy="17" r="1.5" fill="#64748B" />
          <circle cx="17" cy="17" r="1.5" fill="#64748B" />
          {/* Cogs above conveyor */}
          <circle cx="8" cy="9" r="4" fill="#D97706" stroke="#92400E" strokeWidth="1" />
          <circle cx="16" cy="9" r="4" fill="#D97706" stroke="#92400E" strokeWidth="1" />
        </svg>
      );

    case 'total_optimization':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.5" fill="#0F172A" />
          <circle cx="12" cy="12" r="1.5" fill="#60A5FA" />
        </svg>
      );

    // ==========================================
    // 全域升級圖示
    // ==========================================
    case 'habit':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          {/* Notebook */}
          <rect x="5" y="4" width="14" height="17" rx="1.5" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="#92400E" strokeWidth="1" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="#92400E" strokeWidth="1" />
          <line x1="8" y1="16" x2="13" y2="16" stroke="#92400E" strokeWidth="1" />
          {/* Pencil */}
          <polygon points="16,15 19,6 21,7 18,17 15,18" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
        </svg>
      );

    case 'thinking':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          {/* Brain */}
          <path d="M12 5C10 3 6 4 6 7c-2 1-3 4-1 6 0 1-1 3 1 4 2 1 3 1 4 0v2h4v-2c1 1 2 1 4 0 2-1 1-3 1-4 2-2 1-5-1-6 0-3-4-4-6-2z" fill="#C084FC" stroke="#7E22CE" strokeWidth="1.5" />
          <line x1="12" y1="5" x2="12" y2="17" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="9" r="1" fill="#F3E8FF" />
          <circle cx="15" cy="9" r="1" fill="#F3E8FF" />
        </svg>
      );

    case 'environment':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          {/* Soil */}
          <path d="M4 19c2-2 6-2 8-1s6-1 8 1v2H4v-2z" fill="#78350F" />
          {/* Sprout Stem */}
          <path d="M12 18V8" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M12 12C12 9 8 8 7 10c0 3 4 3 5 2z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
          <path d="M12 10C12 7 16 6 17 8c0 3-4 3-5 2z" fill="#4ADE80" stroke="#16A34A" strokeWidth="1" />
        </svg>
      );

    case 'creator_state':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          {/* Golden Crown */}
          <polygon points="3,17 4,9 8,13 12,6 16,13 20,9 21,17" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          <rect x="3" y="17" width="18" height="3" fill="#D97706" />
          {/* Crown gems */}
          <circle cx="4" cy="9" r="1.5" fill="#EF4444" />
          <circle cx="12" cy="6" r="2" fill="#3B82F6" />
          <circle cx="20" cy="9" r="1.5" fill="#EF4444" />
          <circle cx="12" cy="18.5" r="1" fill="#FFFFFF" />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#4B5563" />
        </svg>
      );
  }
};
