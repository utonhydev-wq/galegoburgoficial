/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Instagram,
  Share2,
  Check,
  ExternalLink,
  Flame,
  QrCode,
  X,
  Heart,
  Navigation,
  Clock,
  ArrowUp,
  Star
} from 'lucide-react';

const LINKS = {
  logo: '/logo.jpg',
  fallbackLogo: 'https://i.postimg.cc/g2DZWcJR/527476370-18324407854230826-6751280860243887092-n.jpg',
  order99Food:
    'https://h5.didiglobal.com/silver-bullet-online/8FTSBVvN4wxCUanV-UY0W?ddlCode=aRwqET&area=BR&lang=pt-BR&appKey=dlp9&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcAUw8f5leHRuA2FlbQIxMQBwZG9mAnNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp7OyYWXC5IuSAtQVK8RhJMnjl-lF4mHpeKKVCvOdTs02IuDaUuKdmzEt8JTx_aem_L-5U5-eQWltjlncajgnAkQ&redirectType=0&params=utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAaezsmFlwuSLkgLUFSvEYSTJ45fpReJh6XiilQrznU7NNiLg2lLinZsxLfCU8Q_aem_L-5U5-eQWltjlncajgnAkQ',
  instagram: 'https://www.instagram.com/galegoburgoficial__?stkn=d2VvNDQzYXY4NXQx',
  maps: 'https://maps.app.goo.gl/hgo2kjLjBwzNyQu46',
  googleReview: 'https://search.google.com/local/writereview?placeid=ChIJk09WoJThqgcR9SG25fNBaBg',
};

interface StoreStatus {
  isOpen: boolean;
  statusTitle: string;
  badgeLabel: string;
  currentDayKey: 'dom-seg' | 'ter-qui' | 'sex-sab';
  currentTimeStr: string;
  nextOpeningMsg: string;
}

// Compute store status strictly based on local time in Jaboatão dos Guararapes - PE (America/Recife, UTC-3)
function computeStoreStatus(): StoreStatus {
  try {
    const now = new Date();
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Recife',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = dtf.formatToParts(now);
    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;

    const weekday = map.weekday; // 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    const hours = parseInt(map.hour ?? '0', 10);
    const minutes = parseInt(map.minute ?? '0', 10);
    const currentMins = hours * 60 + minutes;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    let isOpen = false;
    let currentDayKey: 'dom-seg' | 'ter-qui' | 'sex-sab' = 'dom-seg';
    let nextOpeningMsg = '';

    // Grupo 1: Domingo e Segunda (17:30 - 22:45)
    if (weekday === 'Sun' || weekday === 'Mon') {
      currentDayKey = 'dom-seg';
      if (currentMins >= 17 * 60 + 30 && currentMins <= 22 * 60 + 45) {
        isOpen = true;
      } else if (currentMins < 17 * 60 + 30) {
        nextOpeningMsg = 'Abre hoje às 17:30';
      } else {
        nextOpeningMsg = weekday === 'Sun' ? 'Abre amanhã (segunda) às 17:30' : 'Abre amanhã (terça) às 17:00';
      }
    }
    // Grupo 2: Terça a Quinta (17:00 - 22:45)
    else if (weekday === 'Tue' || weekday === 'Wed' || weekday === 'Thu') {
      currentDayKey = 'ter-qui';
      if (currentMins >= 17 * 60 && currentMins <= 22 * 60 + 45) {
        isOpen = true;
      } else if (currentMins < 17 * 60) {
        nextOpeningMsg = 'Abre hoje às 17:00';
      } else {
        nextOpeningMsg = 'Abre amanhã às 17:00';
      }
    }
    // Grupo 3: Sexta e Sábado (17:00 - 23:00)
    else if (weekday === 'Fri' || weekday === 'Sat') {
      currentDayKey = 'sex-sab';
      if (currentMins >= 17 * 60 && currentMins <= 23 * 60) {
        isOpen = true;
      } else if (currentMins < 17 * 60) {
        nextOpeningMsg = 'Abre hoje às 17:00';
      } else if (weekday === 'Fri') {
        nextOpeningMsg = 'Abre amanhã (sábado) às 17:00';
      } else {
        nextOpeningMsg = 'Abre amanhã (domingo) às 17:30';
      }
    }

    return {
      isOpen,
      statusTitle: isOpen ? 'Online no 99Food' : 'Offline no 99Food',
      badgeLabel: isOpen ? 'Aberto Agora' : 'Fechado',
      currentDayKey,
      currentTimeStr: timeStr,
      nextOpeningMsg,
    };
  } catch {
    return {
      isOpen: false,
      statusTitle: 'Offline no 99Food',
      badgeLabel: 'Fechado',
      currentDayKey: 'dom-seg',
      currentTimeStr: '',
      nextOpeningMsg: 'Consulte os horários',
    };
  }
}

export default function App() {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(computeStoreStatus);

  // Auto-refresh schedule status every 15 seconds to reflect exact opening/closing minutes
  useEffect(() => {
    setStoreStatus(computeStoreStatus());
    const interval = setInterval(() => {
      setStoreStatus(computeStoreStatus());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(12);
    }
  };

  const handleShare = async () => {
    triggerHaptic();
    const shareData = {
      title: 'Galego Burg e Pizzaria',
      text: 'Confira o bio site do Galego Burg e Pizzaria! Peça pelo 99Food ou veja nossa localização.',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled share
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // QR Code URL (only loaded if modal opens)
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://galegoburg.com';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=ffffff&bgcolor=171923&format=png&data=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#090a0d] text-[#f4f4f6] flex flex-col items-center justify-between overflow-x-hidden selection:bg-amber-500 selection:text-black pt-[max(env(safe-area-inset-top),0.5rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[460px] h-[460px] bg-gradient-to-b from-amber-500/20 via-orange-600/10 to-transparent blur-[110px] rounded-full animate-pulse-subtle pointer-events-none" />
        <div className="absolute top-[40%] -left-32 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] -right-28 w-[320px] h-[320px] bg-orange-600/10 blur-[105px] rounded-full pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Top Action Bar (Live Status & Horários no 99Food + Quick actions) */}
      <header className="relative z-10 w-full max-w-[480px] px-3.5 sm:px-5 pt-2 sm:pt-3 pb-2 flex items-start justify-between gap-2 sm:gap-2.5 animate-fade-in-down">
        {/* Live Status indicator & Quadro de Horários - REORGANIZADO E OTIMIZADO */}
        <div
          className={`flex-1 p-3 rounded-2xl backdrop-blur-md text-left transition-all duration-300 border shadow-lg ${
            storeStatus.isOpen
              ? 'bg-[#0f1713]/95 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.16)]'
              : 'bg-[#181114]/95 border-rose-500/35 shadow-[0_0_25px_rgba(244,63,94,0.14)]'
          }`}
        >
          {/* Header do Quadro: Status & Tag */}
          <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {storeStatus.isOpen ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  </>
                ) : (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-70" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                  </>
                )}
              </span>
              <span
                className={`text-[11px] sm:text-xs font-black tracking-wide uppercase ${
                  storeStatus.isOpen ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {storeStatus.statusTitle}
              </span>
            </div>

            <span
              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border transition-colors ${
                storeStatus.isOpen
                  ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40'
                  : 'text-rose-300 bg-rose-500/20 border-rose-500/40'
              }`}
            >
              {storeStatus.badgeLabel}
            </span>
          </div>

          {/* Lista de Horários com Domingo Incluído */}
          <div className="flex flex-col gap-1.5 text-[10px] sm:text-[11px]">
            {/* Dom e Seg: 17:30 - 22:45 */}
            <div
              className={`flex items-center justify-between gap-2 px-2 py-1 rounded-lg transition-all ${
                storeStatus.currentDayKey === 'dom-seg'
                  ? 'bg-amber-400/15 text-amber-200 font-bold border border-amber-400/35 shadow-sm'
                  : 'bg-white/[0.02] text-zinc-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] sm:text-[11px] font-bold ${
                    storeStatus.currentDayKey === 'dom-seg' ? 'text-amber-300' : 'text-zinc-400'
                  }`}
                >
                  Dom e Seg
                </span>
                {storeStatus.currentDayKey === 'dom-seg' && (
                  <span className="text-[8px] bg-amber-400 text-black font-black px-1.5 py-0.2 rounded-full uppercase">
                    Hoje
                  </span>
                )}
              </div>
              <span className="font-semibold text-zinc-100 tracking-tight">17:30 - 22:45</span>
            </div>

            {/* Terça a Quinta: 17:00 - 22:45 */}
            <div
              className={`flex items-center justify-between gap-2 px-2 py-1 rounded-lg transition-all ${
                storeStatus.currentDayKey === 'ter-qui'
                  ? 'bg-amber-400/15 text-amber-200 font-bold border border-amber-400/35 shadow-sm'
                  : 'bg-white/[0.02] text-zinc-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] sm:text-[11px] font-bold ${
                    storeStatus.currentDayKey === 'ter-qui' ? 'text-amber-300' : 'text-zinc-400'
                  }`}
                >
                  Terça a Quinta
                </span>
                {storeStatus.currentDayKey === 'ter-qui' && (
                  <span className="text-[8px] bg-amber-400 text-black font-black px-1.5 py-0.2 rounded-full uppercase">
                    Hoje
                  </span>
                )}
              </div>
              <span className="font-semibold text-zinc-100 tracking-tight">17:00 - 22:45</span>
            </div>

            {/* Sexta e Sábado: 17:00 - 23:00 */}
            <div
              className={`flex items-center justify-between gap-2 px-2 py-1 rounded-lg transition-all ${
                storeStatus.currentDayKey === 'sex-sab'
                  ? 'bg-amber-400/15 text-amber-200 font-bold border border-amber-400/35 shadow-sm'
                  : 'bg-white/[0.02] text-zinc-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] sm:text-[11px] font-bold ${
                    storeStatus.currentDayKey === 'sex-sab' ? 'text-amber-300' : 'text-zinc-400'
                  }`}
                >
                  Sex e Sáb
                </span>
                {storeStatus.currentDayKey === 'sex-sab' && (
                  <span className="text-[8px] bg-amber-400 text-black font-black px-1.5 py-0.2 rounded-full uppercase">
                    Hoje
                  </span>
                )}
              </div>
              <span className="font-semibold text-zinc-100 tracking-tight">17:00 - 23:00</span>
            </div>
          </div>

          {/* Rodapé Informativo do Quadro */}
          <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-400">
            {storeStatus.isOpen ? (
              <span className="flex items-center gap-1 text-emerald-300 font-medium">
                <Flame className="w-3 h-3 text-emerald-400" />
                Aceitando pedidos no 99Food
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-300 font-medium">
                <Clock className="w-3 h-3 text-rose-400" />
                {storeStatus.nextOpeningMsg}
              </span>
            )}
            <span className="text-zinc-500 font-mono">PE (UTC-3)</span>
          </div>
        </div>

        {/* Action Buttons (QR Code & Share) */}
        <div className="flex flex-col gap-2 shrink-0 self-start">
          {/* QR Code trigger */}
          <button
            onClick={() => {
              triggerHaptic();
              setShowQrModal(true);
            }}
            className="w-9 h-9 rounded-xl bg-[#161820]/95 hover:bg-[#20232d] border border-white/10 hover:border-amber-400/40 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
            title="Ver QR Code do Bio Site"
            aria-label="Ver QR Code"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-xl bg-[#161820]/95 hover:bg-[#20232d] border border-white/10 hover:border-amber-400/40 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
            title="Compartilhar Bio Site"
            aria-label="Compartilhar Bio Site"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[480px] px-3.5 sm:px-5 py-1.5 flex flex-col items-center animate-fade-in-up">
        {/* TOPO: Logo & Branding */}
        <div className="flex flex-col items-center text-center w-full">
          {/* Logo Showcase with Amber Aura & Sleek Circular Border */}
          <div className="relative mb-2.5 flex items-center justify-center">
            {/* Animated Glow Halo */}
            <div className="absolute inset-0 -m-2.5 bg-gradient-to-tr from-amber-500/35 via-orange-500/25 to-amber-600/30 rounded-full blur-xl animate-pulse-subtle" />
            
            <div className="relative p-1 rounded-full bg-gradient-to-b from-amber-400/50 via-orange-500/30 to-amber-500/20 shadow-2xl backdrop-blur-md">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#14161d] border-2 border-amber-400/60 shadow-inner">
                <img
                  src={LINKS.logo}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== LINKS.fallbackLogo) {
                      target.src = LINKS.fallbackLogo;
                    }
                  }}
                  alt="Galego Burg e Pizzaria"
                  width="128"
                  height="128"
                  fetchPriority="high"
                  className="w-full h-full object-cover rounded-full select-none transition-transform duration-300 hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Restaurant Official Name */}
          <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-md mb-1.5">
            GALEGO BURG E PIZZARIA
          </h1>

          {/* Short Phrase */}
          <p className="text-zinc-200 text-xs sm:text-sm font-medium leading-relaxed max-w-[320px] mb-2">
            Seu lanche favorito está aqui! 🍔🍕<br />
            <span className="text-amber-400 font-bold">Peça agora e aproveite!</span>
          </p>

          {/* Location Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151720]/80 border border-white/10 text-zinc-300 text-[11px] sm:text-xs font-medium tracking-wide mb-3.5 shadow-sm backdrop-blur-md transition-transform hover:scale-105">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Jaboatão dos Guararapes - PE</span>
          </div>

          {/* Quality Badges / Highlights */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full mb-4">
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#12141a]/80 border border-white/5 backdrop-blur-sm shadow-sm transition-transform hover:scale-105">
              <span className="text-base sm:text-lg mb-0.5">🍔</span>
              <span className="text-[11px] font-bold text-zinc-200">Burgers</span>
              <span className="text-[9px] text-zinc-500 font-medium">Suculentos</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#12141a]/80 border border-white/5 backdrop-blur-sm shadow-sm transition-transform hover:scale-105">
              <span className="text-base sm:text-lg mb-0.5">🍕</span>
              <span className="text-[11px] font-bold text-zinc-200">Pizzas</span>
              <span className="text-[9px] text-zinc-500 font-medium">No Capricho</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center p-2 rounded-xl border backdrop-blur-sm shadow-sm transition-transform hover:scale-105 ${
                storeStatus.isOpen
                  ? 'bg-emerald-500/5 border-emerald-500/25'
                  : 'bg-rose-500/5 border-rose-500/25'
              }`}
            >
              <span className="text-base sm:text-lg mb-0.5">⚡</span>
              <span className={`text-[11px] font-bold ${storeStatus.isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                {storeStatus.isOpen ? 'Aberto' : 'Fechado'}
              </span>
              <span className="text-[9px] text-zinc-500 font-medium">99Food</span>
            </div>
          </div>
        </div>

        {/* BOTÕES PRINCIPAIS */}
        <div className="w-full flex flex-col gap-3.5 mb-7">
          {/* 1. BOTÃO PRINCIPAL: PEDIR PELO 99FOOD (MAIS DESTACADO) */}
          <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <a
              href={LINKS.order99Food}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className={`relative group overflow-hidden block w-full rounded-2xl p-[2px] transition-all duration-300 cursor-pointer ${
                storeStatus.isOpen
                  ? 'shadow-[0_0_35px_rgba(245,158,11,0.28)] hover:shadow-[0_0_45px_rgba(245,158,11,0.5)]'
                  : 'shadow-[0_0_30px_rgba(244,63,94,0.22)] hover:shadow-[0_0_40px_rgba(244,63,94,0.38)]'
              }`}
            >
              {/* Outer Vibrant Border Gradient */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  storeStatus.isOpen
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300'
                    : 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-400'
                }`}
              />

              {/* Shimmer Light Reflection Sweep */}
              <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />

              {/* Button Core Surface */}
              <div
                className={`relative px-4 sm:px-5 py-4 rounded-[14px] flex items-center justify-between text-white transition-all duration-300 ${
                  storeStatus.isOpen
                    ? 'bg-gradient-to-r from-[#d97706] via-[#ea580c] to-[#c2410c]'
                    : 'bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#881337]'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-black/25 flex items-center justify-center shrink-0 border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                    <span className="text-2xl leading-none select-none">🍔</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {storeStatus.isOpen ? (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                          Online • Peça Agora
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/40 text-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-300/30">
                          <Clock className="w-3 h-3 text-rose-300" />
                          Offline no Momento
                        </span>
                      )}
                    </div>
                    <div className="font-display text-base sm:text-lg font-black tracking-wide uppercase drop-shadow-sm text-white">
                      PEDIR PELO 99FOOD
                    </div>
                    <div className="text-[10px] text-zinc-100/90 font-medium tracking-tight">
                      {storeStatus.isOpen
                        ? 'Toque para abrir o cardápio e fazer seu pedido'
                        : `${storeStatus.nextOpeningMsg || 'Consulte horários'} • Toque para ver cardápio`}
                    </div>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>
            </a>
          </div>

          {/* 2. INSTAGRAM */}
          <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="group block w-full rounded-2xl bg-[#13151c] hover:bg-[#1a1c25] border border-white/10 hover:border-pink-500/40 p-4 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-pink-500/15 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-medium text-zinc-400">
                      @galegoburgoficial__
                    </div>
                    <div className="font-display text-sm sm:text-base font-bold tracking-wide uppercase text-zinc-100 group-hover:text-pink-300 transition-colors">
                      SIGA A GENTE NO INSTAGRAM
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </div>
              </div>
            </a>
          </div>

          {/* 3. COMO CHEGAR */}
          <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <a
              href={LINKS.maps}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="group block w-full rounded-2xl bg-[#13151c] hover:bg-[#1a1c25] border border-white/10 hover:border-amber-400/40 p-4 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-500/15 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#1f222c] group-hover:bg-[#282c38] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                    <Navigation className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-medium text-zinc-400">
                      Abrir rotas e navegação
                    </div>
                    <div className="font-display text-sm sm:text-base font-bold tracking-wide uppercase text-zinc-100 group-hover:text-amber-300 transition-colors">
                      COMO CHEGAR
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </div>
              </div>
            </a>
          </div>

          {/* 4. AVALIE NO GOOGLE */}
          <div className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <a
              href={LINKS.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="group block w-full rounded-2xl bg-[#13151c] hover:bg-[#1a1c25] border border-white/10 hover:border-amber-400/40 p-4 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-500/15 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 group-hover:from-amber-500/30 group-hover:to-yellow-500/30 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400/90">
                      <span>⭐⭐⭐⭐⭐</span>
                      <span className="text-zinc-400 text-[10px]">• Deixe sua opinião</span>
                    </div>
                    <div className="font-display text-sm sm:text-base font-bold tracking-wide uppercase text-zinc-100 group-hover:text-amber-300 transition-colors">
                      AVALIE NO GOOGLE
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* SEÇÃO LOCALIZAÇÃO */}
        <section className="w-full rounded-2xl bg-[#111319]/95 border border-white/10 p-5 mb-7 shadow-xl backdrop-blur-md relative overflow-hidden">
          {/* Top subtle gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          <div className="flex flex-col items-center text-center">
            {/* Header label */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h2 className="font-display text-xs font-bold tracking-wider uppercase text-amber-400">
                ENCONTRE A GENTE
              </h2>
            </div>

            {/* City & State */}
            <p className="text-base sm:text-lg font-bold text-white mb-4">
              Jaboatão dos Guararapes - PE
            </p>

            {/* Direct action button */}
            <a
              href={LINKS.maps}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#1d2029] hover:bg-[#252935] border border-white/15 hover:border-amber-400/50 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-100 hover:text-white transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer mb-2.5"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>VER NO GOOGLE MAPS</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>

            {/* Avaliação no Google */}
            <a
              href={LINKS.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400/50 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>AVALIE NO GOOGLE</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400/80" />
            </a>
          </div>
        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="relative z-10 w-full max-w-[480px] px-6 pb-8 pt-1 flex flex-col items-center text-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

        <div className="font-display text-sm font-extrabold tracking-wider text-zinc-100 uppercase mb-1">
          GALEGO BURG E PIZZARIA
        </div>

        <p className="text-xs text-zinc-400 font-medium mb-4 flex items-center justify-center gap-1.5">
          <span>🍔 Hambúrguer</span>
          <span>•</span>
          <span>🍕 Pizza</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-zinc-300">
            <Heart className="w-3 h-3 fill-red-500 text-red-500 inline" /> Sabor
          </span>
        </p>

        {/* Instagram Icon / Link */}
        <a
          href={LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={triggerHaptic}
          className="w-10 h-10 rounded-full bg-[#151720] hover:bg-[#1e212b] border border-white/10 hover:border-pink-500/40 flex items-center justify-center text-zinc-300 hover:text-pink-400 transition-all duration-200 mb-5 shadow-sm hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Abrir Instagram oficial"
        >
          <Instagram className="w-5 h-5" />
        </a>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 font-medium mb-4 transition-colors cursor-pointer"
        >
          <ArrowUp className="w-3 h-3" />
          <span>Voltar ao topo</span>
        </button>

        <div className="text-[11px] text-zinc-500 font-normal">
          © 2026 Galego Burg e Pizzaria
        </div>
      </footer>

      {/* QR Code Modal (Lazy rendered) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="relative w-full max-w-xs rounded-2xl bg-[#14161f] border border-white/15 p-6 flex flex-col items-center text-center shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
              <QrCode className="w-6 h-6 text-amber-400" />
            </div>

            <h3 className="font-display text-base font-bold text-white uppercase mb-1">
              Escanear Bio Site
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Aponte a câmera do seu celular para abrir o link na bio.
            </p>

            <div className="p-3 bg-[#1a1d28] rounded-xl border border-white/10 mb-4 shadow-inner">
              <img
                src={qrCodeUrl}
                alt="QR Code Galego Burg e Pizzaria"
                width="192"
                height="192"
                className="w-48 h-48 rounded-lg select-none"
                loading="lazy"
                decoding="async"
              />
            </div>

            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider transition-colors active:scale-95 cursor-pointer"
            >
              {copied ? 'Link Copiado!' : 'Copiar Link da Página'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Copy Feedback Toast */}
      {copied && (
        <div className="fixed bottom-6 z-50 px-4 py-2.5 rounded-full bg-zinc-900 border border-emerald-500/50 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Link copiado com sucesso!</span>
        </div>
      )}
    </div>
  );
}
