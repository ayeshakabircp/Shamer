import { useState, useEffect, useRef } from "react";
import { useSearch } from "wouter";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import "../shamer.css";
import { decodeShame } from "../lib/encoding";
import { useLocation } from "wouter";

type ReceiverScreen = "shame" | "deserved" | "didnt-use-ai" | "never-wrong";

function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "56px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", background: "transparent", zIndex: 1000,
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
        <span style={{ fontSize: "20px" }}>🍅</span>
        <span className="shamer-font-display" style={{ fontSize: "24px", color: "#F51818" }}>SHAMER</span>
      </a>
    </nav>
  );
}

function TomatoSplash({ lottieRef, onComplete }: { lottieRef: React.RefObject<LottieRefCurrentProps | null>; onComplete: () => void }) {
  const [animData, setAnimData] = useState<object | null>(null);
  useEffect(() => {
    fetch("/tomato-lottie.json").then(r => r.json()).then(setAnimData).catch(() => {});
  }, []);
  if (!animData) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <Lottie lottieRef={lottieRef} animationData={animData} loop={false} autoplay onComplete={onComplete} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
}

function EggSplash({ onComplete, lottieRef }: { onComplete: () => void; lottieRef: React.RefObject<LottieRefCurrentProps | null> }) {
  const [animData, setAnimData] = useState<object | null>(null);
  useEffect(() => {
    fetch("/Eggss.json").then(r => r.json()).then(setAnimData).catch(() => {});
  }, []);
  if (!animData) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
      <Lottie lottieRef={lottieRef} animationData={animData} loop={false} onComplete={onComplete} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />
    </div>
  );
}

function PoopSplash({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, []);

  const poops = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: Math.random() * 90 + 2,
    size: Math.floor(Math.random() * 40) + 40,
    duration: Math.random() * 1.5 + 1.2,
    delay: Math.random() * 2.5,
    wobble: (Math.random() - 0.5) * 60,
  }));

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {poops.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: "-100px", left: `${p.left}%`,
          fontSize: `${p.size}px`,
          animation: `poopFall ${p.duration}s ease-in ${p.delay}s forwards`,
          "--wobble": `${p.wobble}px`,
        } as React.CSSProperties}>
          💩
        </div>
      ))}
      <style>{`
        @keyframes poopFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: translateY(50vh) rotate(180deg) translateX(var(--wobble)); }
          100% { transform: translateY(110vh) rotate(360deg) translateX(calc(var(--wobble) * -1)); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

function BouncingThumbsDown() {
  return (
    <div style={{ display: "inline-block", animation: "thumbBounce 1.2s ease-in-out infinite" }}>
      <img src="/thumbs-down.png" alt="Thumbs down" style={{ width: "3rem", height: "3rem", objectFit: "contain" }} />
      <style>{`
        @keyframes thumbBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

function WiggleButton({ label, onClick, style, className, anchorRef }: {
  label: string; onClick: () => void; style?: React.CSSProperties;
  className?: string; anchorRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const BW = btn.offsetWidth || 140;
    const BH = btn.offsetHeight || 44;

    function getOrigin() {
      if (anchorRef?.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        return { x: rect.left + (rect.width - BW) / 2, y: rect.bottom + 16 };
      }
      return { x: (window.innerWidth - BW) / 2, y: (window.innerHeight - BH) / 2 + 60 };
    }

    if (!originRef.current) {
      const o = getOrigin();
      originRef.current = o;
      btn.style.position = "fixed";
      btn.style.left = `${o.x}px`;
      btn.style.top = `${o.y}px`;
      btn.style.zIndex = "9999";
      btn.style.transition = "none";
    }

    function resetToOrigin() {
      if (!btn) return;
      const o = originRef.current ?? getOrigin();
      btn.style.transition = "left 1.8s cubic-bezier(0.25,0.1,0.25,1), top 1.8s cubic-bezier(0.25,0.1,0.25,1)";
      btn.style.left = `${o.x}px`;
      btn.style.top = `${o.y}px`;
    }

    function scheduleReset() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(resetToOrigin, 1200);
    }

    function onMove(clientX: number, clientY: number) {
      if (!btn) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const BW2 = btn.offsetWidth || 140;
      const BH2 = btn.offsetHeight || 44;
      const cx = vw / 2; const cy = vh / 2;
      const targetX = Math.max(8, Math.min(vw - BW2 - 8, cx - (clientX - cx) - BW2 / 2));
      const targetY = Math.max(8, Math.min(vh - BH2 - 8, cy - (clientY - cy) - BH2 / 2));
      btn.style.transition = "left 0.25s ease-out, top 0.25s ease-out";
      btn.style.left = `${targetX}px`;
      btn.style.top = `${targetY}px`;
      scheduleReset();
    }

    function handleMouseMove(e: MouseEvent) { onMove(e.clientX, e.clientY); }
    function handleTouchMove(e: TouchEvent) { if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY); }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <button ref={btnRef} onClick={onClick} className={className} style={{ ...style, position: "fixed", whiteSpace: "nowrap", zIndex: 9999 }}>
      {label}
    </button>
  );
}

export default function Receiver() {
  const [location] = useLocation();
const params = new URLSearchParams(location.split("?")[1]);
const encoded = params.get("m") ?? "";
const shameData = encoded ? decodeShame(decodeURIComponent(encoded)) : null;
const shameText = shameData?.message ?? "Babe... did you just outsource your feelings to a robot? Gross.";
const selectedWeapon = params.get("w") ?? "🍅";

  const [screen, setScreen] = useState<ReceiverScreen>("shame");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioDone, setAudioDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const deservedBtnRef = useRef<HTMLButtonElement>(null);

  const bothDone = audioDone && animDone;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.7;
    audio.play().then(() => setAudioPlaying(true)).catch(() => {});
    const onEnded = () => { setAudioPlaying(false); setAudioDone(true); };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  function handleAudioButton() {
    const audio = audioRef.current;
    if (!audio) return;
    if (bothDone || (!audioPlaying && !audioDone)) {
      audio.currentTime = 0;
      audio.play().then(() => setAudioPlaying(true)).catch(() => {});
      lottieRef.current?.goToAndPlay(0, true);
      setAudioDone(false);
      setAnimDone(false);
      setReplayKey(k => k + 1);
    } else {
      setMuted(m => !m);
    }
  }

  const audioIcon = bothDone ? "↺" : !audioPlaying && !audioDone ? "▶" : muted ? "🔇" : "🔊";

  if (screen === "deserved") {
    return (
      <>
        <Nav />
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center" style={{ paddingTop: "56px" }}>
          <h2 className="shamer-font-h2 mb-4" style={{ fontSize: "52px", color: "#ad0d00" }}>
            Apology accepted{" "}
            <img src="/check-thumbs.png" alt="Check" style={{ width: "0.8em", height: "0.8em", objectFit: "contain", display: "inline", verticalAlign: "middle" }} />
          </h2>
          <p className="text-base mb-10" style={{ fontSize: 16, color: "#444" }}>
            Do better next time. And tell them you're sorry.
          </p>
          <button onClick={() => window.location.href = "/"} className="shamer-btn-primary px-6 py-4 text-base">
            Shame Someone Else
          </button>
        </div>
      </>
    );
  }

  if (screen === "didnt-use-ai") {
    return (
      <>
        <Nav />
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center" style={{ paddingTop: "56px" }}>
          <h2 className="shamer-font-h2 mb-8" style={{ fontSize: "52px", color: "#ad0d00", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "nowrap" }}>
            But you did
            <img src="/finger-point.png" alt="Pointing finger" style={{ width: "0.8em", height: "0.8em", objectFit: "contain", flexShrink: 0 }} />
          </h2>
          <button onClick={() => setScreen("never-wrong")} className="shamer-btn-primary w-full max-w-xs px-6 py-4 text-base">
            No I didn't!
          </button>
        </div>
      </>
    );
  }

  if (screen === "never-wrong") {
    return (
      <>
        <Nav />
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center overflow-hidden relative" style={{ paddingTop: "56px" }}>
          <h2 className="shamer-font-h2 mb-4" style={{ fontSize: "52px", color: "#ad0d00" }}>
            Accept your shame{" "}
            <img src="/fist.png" alt="Fist" style={{ width: "0.8em", height: "0.8em", objectFit: "contain", display: "inline", verticalAlign: "middle" }} />
          </h2>
          <p className="text-sm mb-8" style={{ fontSize: 16, color: "#444" }}>The person who sent this to you is never wrong.</p>
          <div className="flex flex-col gap-4 w-full max-w-xs items-center">
            <button ref={deservedBtnRef} onClick={() => setScreen("deserved")} className="shamer-btn-primary w-full px-6 py-4 text-base">
              I deserved this
            </button>
          </div>
          <WiggleButton label="No I won't!" onClick={() => {}} anchorRef={deservedBtnRef} className="shamer-btn-secondary px-6 py-3 text-sm" />
        </div>
      </>
    );
  }

  const weaponTheme = {
    "🍅": { bg: "rgba(252,244,240,0.85)", accent: "#F51818" },
    "🥚": { bg: "rgba(255,250,240,0.85)", accent: "#E8691E" },
    "💩": { bg: "rgba(245,240,232,0.85)", accent: "#8B6914" },
  }[selectedWeapon] ?? { bg: "rgba(252,244,240,0.85)", accent: "#F51818" };
  return (
    <>
      <Nav />
      <audio ref={audioRef} src="/boo.mp3" preload="auto" />
      <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center relative overflow-hidden" style={{ paddingTop: "56px" }}>
        {selectedWeapon === "🥚"
          ? <EggSplash key={replayKey} onComplete={() => setAnimDone(true)} lottieRef={lottieRef} />
          : selectedWeapon === "💩"
          ? <PoopSplash key={replayKey} onComplete={() => setAnimDone(true)} />
          : <TomatoSplash lottieRef={lottieRef} onComplete={() => setAnimDone(true)} />
        }
        <button
          onClick={handleAudioButton}
          style={{
            position: "fixed", top: 16, right: 24, zIndex: 99999,
            width: 40, height: 40, borderRadius: "50%",
            border: "1.5px solid #F3AB93", background: "#FFECE3",
            cursor: "pointer", fontSize: "1.1rem", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#ad0d00",
          }}
        >
          {audioIcon}
        </button>
        <div style={{ position: "relative", zIndex: 10 }} className="w-full max-w-sm">
                  <h1 className="shamer-font-display mb-4 uppercase text-center" style={{ fontSize: "64px", color: weaponTheme.accent, lineHeight: 1.1 }}>
                  You've been shamed!
                </h1>
                <p className="mb-6 leading-relaxed text-center" style={{ fontSize: "16px", color: "#444" }}>
                  {shameText}
                </p>
                <div className="mb-8">
                  <BouncingThumbsDown />
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => setScreen("deserved")} className="shamer-btn-primary w-full px-6 py-4 text-base">
                    I deserved this
                  </button>
                  <button onClick={() => setScreen("didnt-use-ai")} className="shamer-btn-secondary w-full px-6 py-4 text-base">
                    But I didn't use AI
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      }
