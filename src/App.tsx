/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Instagram,
  Share2,
  Check,
  ExternalLink,
  Flame,
  QrCode,
  X,
  Sparkles,
  ChevronRight,
  Heart,
  Navigation,
  Clock,
  ArrowUp
} from 'lucide-react';

const LINKS = {
  logo: 'https://i.postimg.cc/g2DZWcJR/527476370-18324407854230826-6751280860243887092-n.jpg',
  order99Food:
    'https://h5.didiglobal.com/silver-bullet-online/8FTSBVvN4wxCUanV-UY0W?ddlCode=aRwqET&area=BR&lang=pt-BR&appKey=dlp9&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcAUw8f5leHRuA2FlbQIxMQBwZG9mAnNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp7OyYWXC5IuSAtQVK8RhJMnjl-lF4mHpeKKVCvOdTs02IuDaUuKdmzEt8JTx_aem_L-5U5-eQWltjlncajgnAkQ&redirectType=0&params=utm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAaezsmFlwuSLkgLUFSvEYSTJ45fpReJh6XiilQrznU7NNiLg2lLinZsxLfCU8Q_aem_L-5U5-eQWltjlncajgnAkQ',
  instagram: 'https://www.instagram.com/galegoburgoficial__?stkn=d2VvNDQzYXY4NXQx',
  maps: 'https://maps.app.goo.gl/hgo2kjLjBwzNyQu46',
};

export default function App() {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(12);
    }
  };

  const handleShare = async () => {
    triggerHaptic();
    const shareData = {
      title: 'Galego Burg e Pizzaria',
      text: 'Confira o bio site do Galego Burg e Pizzaria! Peça pelo 99Food ou veja a localização.',
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
      setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // QR Code URL for sharing current page or 99Food
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://galegoburg.com';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=ffffff&bgcolor=171923&format=png&data=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div className="relative min-h-screen w-full bg-[#090a0d] text-[#f4f4f6] flex flex-col items-center justify-between overflow-x-hidden selection:bg-amber-500 selection:text-black">
      {/* Dynamic Ambient Background Illumination */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Gold-Amber Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-gradient-to-b from-amber-500/22 via-orange-600/12 to-transparent blur-[120px] rounded-full pointer-events-none" />
        
        {/* Side Accents */}
        <div className="absolute top-[40%] -left-32 w-[340px] h-[340px] bg-amber-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] -right-28 w-[360px] h-[360px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Subtle Texture Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Top Action Bar (QR Code & Share buttons) */}
      <header className="relative z-10 w-full max-w-[480px] px-5 pt-4 pb-2 flex justify-between items-center">
        {/* Live Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13151c]/90 border border-white/10 backdrop-blur-md shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-zinc-300 tracking-wide uppercase">
            Aberto no 99Food
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* QR Code trigger */}
          <button
            onClick={() => {
              triggerHaptic();
              setShowQrModal(true);
            }}
            className="w-8 h-8 rounded-full bg-[#161820]/90 hover:bg-[#20232d] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-sm active:scale-90 cursor-pointer"
            title="Ver QR Code do Bio Site"
            aria-label="Ver QR Code"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161820]/90 hover:bg-[#20232d] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Compartilhar Bio Site"
            aria-label="Compartilhar Bio Site"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Compartilhar</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-[480px] px-5 py-2 flex flex-col items-center">
        {/* TOPO: Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center text-center w-full"
        >
          {/* Logo Showcase with Amber Aura & Sleek Border */}
          <div className="relative mb-3 flex items-center justify-center">
            {/* Animated Glow Halo */}
            <div className="absolute inset-0 -m-3 bg-gradient-to-tr from-amber-500/35 via-orange-500/25 to-amber-600/30 rounded-full blur-2xl animate-pulse-subtle" />
            
            <div className="relative p-1 rounded-full bg-gradient-to-b from-amber-400/50 via-orange-500/30 to-amber-500/20 shadow-2xl backdrop-blur-md">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-[#14161d] border-2 border-amber-400/60 shadow-inner">
                <img
                  src={LINKS.logo}
                  alt="Galego Burg e Pizzaria"
                  className="w-full h-full object-cover rounded-full select-none transition-transform duration-300 hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Restaurant Official Name */}
          <h1 className="font-display text-2xl sm:text-[27px] font-black tracking-tight text-white uppercase drop-shadow-md mb-2">
            GALEGO BURG E PIZZARIA
          </h1>

          {/* Short Phrase */}
          <p className="text-zinc-200 text-sm sm:text-[15px] font-medium leading-relaxed max-w-[340px] mb-2.5">
            Seu lanche favorito está aqui! 🍔🍕<br />
            <span className="text-amber-400 font-bold">Peça agora e aproveite!</span>
          </p>

          {/* Location Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151720]/80 border border-white/10 text-zinc-300 text-xs font-medium tracking-wide mb-5 shadow-sm backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Jaboatão dos Guararapes - PE</span>
          </div>

          {/* Quality Badges / Highlights */}
          <div className="grid grid-cols-3 gap-2 w-full mb-6">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#12141a]/80 border border-white/5 backdrop-blur-sm">
              <span className="text-lg mb-0.5">🍔</span>
              <span className="text-[11px] font-bold text-zinc-300">Burgers</span>
              <span className="text-[9px] text-zinc-500 font-medium">Suculentos</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#12141a]/80 border border-white/5 backdrop-blur-sm">
              <span className="text-lg mb-0.5">🍕</span>
              <span className="text-[11px] font-bold text-zinc-300">Pizzas</span>
              <span className="text-[9px] text-zinc-500 font-medium">No Capricho</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#12141a]/80 border border-white/5 backdrop-blur-sm">
              <span className="text-lg mb-0.5">⚡</span>
              <span className="text-[11px] font-bold text-zinc-300">Delivery</span>
              <span className="text-[9px] text-zinc-500 font-medium">99Food Rápido</span>
            </div>
          </div>
        </motion.div>

        {/* BOTÕES PRINCIPAIS */}
        <div className="w-full flex flex-col gap-3.5 mb-7">
          {/* 1. BOTÃO PRINCIPAL: PEDIR PELO 99FOOD (MAIS DESTACADO) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <a
              href={LINKS.order99Food}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="relative group overflow-hidden block w-full rounded-2xl p-[2px] transition-all duration-300 active:scale-[0.98] shadow-[0_0_35px_rgba(245,158,11,0.28)] hover:shadow-[0_0_45px_rgba(245,158,11,0.5)] cursor-pointer"
            >
              {/* Outer Vibrant Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 rounded-2xl" />

              {/* Shimmer Light Reflection Sweep */}
              <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />

              {/* Button Core Surface */}
              <div className="relative bg-gradient-to-r from-[#d97706] via-[#ea580c] to-[#c2410c] px-5 py-4 rounded-[14px] flex items-center justify-between text-white">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-black/25 flex items-center justify-center shrink-0 border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                    <span className="text-2xl leading-none select-none">🍔</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                        Peça Agora
                      </span>
                    </div>
                    <div className="font-display text-base sm:text-lg font-black tracking-wide uppercase drop-shadow-sm text-white">
                      PEDIR PELO 99FOOD
                    </div>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>
            </a>
          </motion.div>

          {/* 2. INSTAGRAM */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="group block w-full rounded-2xl bg-[#13151c] hover:bg-[#1a1c25] border border-white/10 hover:border-pink-500/40 p-4 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-pink-500/15 active:scale-[0.98] cursor-pointer"
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
          </motion.div>

          {/* 3. COMO CHEGAR */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <a
              href={LINKS.maps}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="group block w-full rounded-2xl bg-[#13151c] hover:bg-[#1a1c25] border border-white/10 hover:border-amber-400/40 p-4 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-500/15 active:scale-[0.98] cursor-pointer"
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
          </motion.div>
        </div>

        {/* SEÇÃO LOCALIZAÇÃO */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="w-full rounded-2xl bg-[#111319]/95 border border-white/10 p-5 mb-7 shadow-xl backdrop-blur-md relative overflow-hidden"
        >
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
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#1d2029] hover:bg-[#252935] border border-white/15 hover:border-amber-400/50 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-100 hover:text-white transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>VER NO GOOGLE MAPS</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>
        </motion.section>
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

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-xs rounded-2xl bg-[#14161f] border border-white/15 p-6 flex flex-col items-center text-center shadow-2xl"
            >
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
                  className="w-48 h-48 rounded-lg select-none"
                  loading="lazy"
                />
              </div>

              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider transition-colors active:scale-95 cursor-pointer"
              >
                {copied ? 'Link Copiado!' : 'Copiar Link da Página'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Copy Feedback Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 z-50 px-4 py-2.5 rounded-full bg-zinc-900 border border-emerald-500/50 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Link copiado com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
