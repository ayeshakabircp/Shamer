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
}

function WiggleButton({ label, onClick, style, className }: WiggleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const flee = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const btn = btnRef.current;
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dx = btnCenterX - clientX;
    const dy = btnCenterY - clientY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const fleeX = (dx / dist) * 120 + (Math.random() - 0.5) * 60;
    const fleeY = (dy / dist) * 80 + (Math.random() - 0.5) * 60;

    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    posRef.current.x = Math.max(0, Math.min(maxX, posRef.current.x + fleeX));
    posRef.current.y = Math.max(0, Math.min(maxY, posRef.current.y + fleeY));

    btn.style.position = "absolute";
    btn.style.left = `${posRef.current.x}px`;
    btn.style.top = `${posRef.current.y}px`;
    btn.style.transition = "left 0.2s, top 0.2s";
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "60px" }}>
      <button
        ref={btnRef}
        onMouseEnter={flee}
        onTouchStart={flee}
        onTouchMove={flee}
        onClick={onClick}
        className={className}
        style={{
          ...style,
          position: "absolute",
          left: posRef.current.x,
          top: 0,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </button>
    </div>
  );
}

interface ReceiverAppProps {
  shameText?: string;
}

export function ReceiverApp({ shameText }: ReceiverAppProps) {
  const [screen, setScreen] = useState<ReceiverScreen>("shame");

  const text =
    shameText || "Babe... did you just outsource your feelings to a robot? Gross.";

  if (screen === "deserved") {
    return (
      <div
        className="shamer-font-body min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center"
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
          style={{ background: "#FF3B2F", color: "#fff" }}
        >
          Shame Someone Else
        </button>
      </div>
    );
  }

  if (screen === "didnt-use-ai") {
    return (
      <div
        className="shamer-font-body min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center"
        style={{ background: "#1A1A1A" }}
      >
        <div className="text-5xl mb-6">🤔</div>
        <h2 className="shamer-font-display text-3xl font-black mb-4 text-white leading-tight">
          But you did.
        </h2>
        <button
          onClick={() => setScreen("never-wrong")}
          className="w-full max-w-xs rounded-2xl px-6 py-4 font-bold text-base transition-all hover:opacity-90"
          style={{ background: "#FF3B2F", color: "#fff" }}
        >
          No I didn't!
        </button>
      </div>
    );
  }

  if (screen === "never-wrong") {
    return (
      <div
        className="shamer-font-body min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center overflow-hidden relative"
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
            onClick={() => setScreen("deserved")}
            className="w-full rounded-2xl px-6 py-4 font-bold text-base transition-all hover:opacity-90"
            style={{ background: "#FF3B2F", color: "#fff" }}
          >
            I deserved this
          </button>
          <div className="w-full" style={{ position: "relative", height: "60px" }}>
            <WiggleButton
              label="No I won't!"
              onClick={() => {}}
              className="rounded-2xl px-6 py-3 font-bold text-sm border-2"
              style={{ borderColor: "#555", color: "#fff", background: "transparent" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="shamer-font-body min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center relative overflow-hidden"
      style={{ background: "#1A1A1A" }}
    >
      <TomatoSplash />

      <div className="relative z-10 w-full max-w-sm">
        <h1
          className="shamer-font-display font-black leading-tight mb-4"
          style={{ fontSize: "2.5rem", color: "#FF3B2F" }}
        >
          You've been shamed.
        </h1>

        <p className="text-base mb-6 leading-relaxed" style={{ color: "#ddd" }}>
          {text}
        </p>

        <div className="mb-8">
          <BouncingThumbsDown />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setScreen("deserved")}
            className="w-full rounded-2xl px-6 py-4 font-bold text-base transition-all hover:opacity-90"
            style={{ background: "#FF3B2F", color: "#fff" }}
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
