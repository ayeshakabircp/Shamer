import { useState, useEffect, useRef, useCallback } from "react";
import "./../_group.css";

type ReceiverScreen =
  | "shame"
  | "deserved"
  | "didnt-use-ai"
  | "but-you-did"
  | "never-wrong";

interface Tomato {
  id: number;
  x: number;
  startY: number;
  scale: number;
  opacity: number;
  duration: number;
  delay: number;
  rotation: number;
}

function useTomatoes(count = 14) {
  const [tomatoes] = useState<Tomato[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      startY: -20 - Math.random() * 30,
      scale: 0.6 + Math.random() * 0.8,
      opacity: 0.7 + Math.random() * 0.3,
      duration: 2.5 + Math.random() * 2,
      delay: Math.random() * 3,
      rotation: -30 + Math.random() * 60,
    }))
  );
  return tomatoes;
}

function TomatoSplash() {
  const tomatoes = useTomatoes(14);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {tomatoes.map((t) => (
        <div
          key={t.id}
          className="absolute"
          style={{
            left: `${t.x}%`,
            top: `${t.startY}%`,
            fontSize: `${t.scale * 2.5}rem`,
            opacity: t.opacity,
            animation: `tomatoDrop ${t.duration}s ${t.delay}s ease-in infinite`,
            transform: `rotate(${t.rotation}deg)`,
          }}
        >
          🍅
        </div>
      ))}
      <style>{`
        @keyframes tomatoDrop {
          0% { transform: rotate(${0}deg) translateY(0) scaleY(1); opacity: 0.9; }
          70% { opacity: 0.85; }
          90% { transform: rotate(15deg) translateY(110vh) scaleY(1); }
          95% { transform: rotate(15deg) translateY(110vh) scaleY(0.4) scaleX(1.6); opacity: 0.6; }
          100% { transform: rotate(15deg) translateY(115vh) scaleY(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function BouncingThumbsDown() {
  return (
    <div
      style={{
        display: "inline-block",
        animation: "thumbBounce 1.2s ease-in-out infinite",
        fontSize: "3rem",
      }}
    >
      👎
      <style>{`
        @keyframes thumbBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

interface WiggleButtonProps {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

function WiggleButton({ label, onClick, style, className, anchorRef }: WiggleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResettingRef = useRef(false);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const BW = btn.offsetWidth || 140;
    const BH = btn.offsetHeight || 44;

    function getOrigin() {
      if (anchorRef?.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        return {
          x: rect.left + (rect.width - BW) / 2,
          y: rect.bottom + 16,
        };
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return {
        x: (vw - BW) / 2,
        y: (vh - BH) / 2 + 60,
      };
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
      isResettingRef.current = true;
      const o = originRef.current ?? getOrigin();
      btn.style.transition = "left 1.8s cubic-bezier(0.25,0.1,0.25,1), top 1.8s cubic-bezier(0.25,0.1,0.25,1)";
      btn.style.left = `${o.x}px`;
      btn.style.top = `${o.y}px`;
      setTimeout(() => { isResettingRef.current = false; }, 1900);
    }

    function scheduleReset() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(resetToOrigin, 1200);
    }

    function onMove(clientX: number, clientY: number) {
      if (!btn) return;
      isResettingRef.current = false;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const BW2 = btn.offsetWidth || 140;
      const BH2 = btn.offsetHeight || 44;

      const cx = vw / 2;
      const cy = vh / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;

      const targetX = Math.max(8, Math.min(vw - BW2 - 8, cx - dx - BW2 / 2));
      const targetY = Math.max(8, Math.min(vh - BH2 - 8, cy - dy - BH2 / 2));

      btn.style.transition = "left 0.25s ease-out, top 0.25s ease-out";
      btn.style.left = `${targetX}px`;
      btn.style.top = `${targetY}px`;

      scheduleReset();
    }

    function handleMouseMove(e: MouseEvent) {
      onMove(e.clientX, e.clientY);
    }

    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={className}
      style={{
        ...style,
        position: "fixed",
        whiteSpace: "nowrap",
        zIndex: 9999,
      }}
    >
      {label}
    </button>
  );
}

interface ReceiverAppProps {
  shameText?: string;
}

export function ReceiverApp({ shameText }: ReceiverAppProps) {
  const [screen, setScreen] = useState<ReceiverScreen>("shame");
  const deservedBtnRef = useRef<HTMLButtonElement>(null);

  const text =
    shameText || "Babe... did you just outsource your feelings to a robot? Gross.";

  if (screen === "deserved") {
    return (
      <div
        className="shamer-font-body min-h-screen flex flex-col items-center justify-center p-10 text-center"
        style={{ background: "#1A1A1A" }}
      >
        <div className="text-5xl mb-6">✅</div>
        <h2 className="shamer-font-display text-3xl font-black mb-4 text-white leading-tight">
          Apology accepted.
        </h2>
        <p className="text-base mb-10" style={{ color: "#aaa" }}>
          Do better next time.
        </p>
        <button
          onClick={() => setScreen("shame")}
          className="rounded-2xl px-6 py-4 font-bold text-base transition-all hover:opacity-90"
          style={{ background: "#ff6161", color: "#fff" }}
        >
          Shame Someone Else
        </button>
      </div>
    );
  }

  if (screen === "didnt-use-ai") {
    return (
      <div
        className="shamer-font-body min-h-screen flex flex-col items-center justify-center p-10 text-center"
        style={{ background: "#1A1A1A" }}
      >
        <div className="text-5xl mb-6">🤔</div>
        <h2 className="shamer-font-display text-3xl font-black mb-4 text-white leading-tight">
          But you did.
        </h2>
        <button
          onClick={() => setScreen("never-wrong")}
          className="w-full max-w-xs rounded-2xl px-6 py-4 font-bold text-base transition-all hover:opacity-90"
          style={{ background: "#ff6161", color: "#fff" }}
        >
          No I didn't!
        </button>
      </div>
    );
  }

  if (screen === "never-wrong") {
    return (
      <div
        className="shamer-font-body min-h-screen flex flex-col items-center justify-center p-10 text-center overflow-hidden relative"
        style={{ background: "#1A1A1A" }}
      >
        <div className="text-5xl mb-6">⚖️</div>
        <h2 className="shamer-font-display text-3xl font-black mb-4 text-white leading-tight">
          The person who sent this to you is never wrong.
        </h2>
        <p className="text-sm mb-8" style={{ color: "#aaa" }}>
          Accept your shame.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs items-center">
          <button
            ref={deservedBtnRef}
            onClick={() => setScreen("deserved")}
            className="w-full rounded-2xl px-6 py-4 font-bold text-base transition-all hover:opacity-90"
            style={{ background: "#ff6161", color: "#fff" }}
          >
            I deserved this
          </button>
        </div>
        <WiggleButton
          label="No I won't!"
          onClick={() => {}}
          anchorRef={deservedBtnRef}
          className="rounded-2xl px-6 py-3 font-bold text-sm border-2"
          style={{ borderColor: "#555", color: "#fff", background: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div
      className="shamer-font-body min-h-screen flex flex-col items-center justify-center p-10 text-center relative overflow-hidden bg-[#fff7f0]"
      style={{ background: "#1A1A1A" }}
    >
      <TomatoSplash />
      <div className="relative z-10 w-full max-w-sm">
        <h1
          className="shamer-font-display font-black mb-4 uppercase text-center"
          style={{ fontSize: "64px", color: "#ff6161", lineHeight: 1.1 }}
        >You've been shamed!</h1>

        <p className="mb-6 leading-relaxed text-center" style={{ fontSize: "16px", color: "#ddd" }}>
          {text}
        </p>

        <div className="mb-8">
          <BouncingThumbsDown />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setScreen("deserved")}
            className="w-full rounded-2xl px-6 py-4 font-bold text-base transition-all hover:opacity-90"
            style={{ background: "#ff6161", color: "#fff" }}
          >
            I deserved this
          </button>
          <button
            onClick={() => setScreen("didnt-use-ai")}
            className="w-full rounded-2xl px-6 py-4 font-bold text-base border-2 transition-all hover:opacity-80"
            style={{ borderColor: "#555", color: "#fff", background: "transparent" }}
          >
            But I didn't use AI
          </button>
        </div>
      </div>
    </div>
  );
}
