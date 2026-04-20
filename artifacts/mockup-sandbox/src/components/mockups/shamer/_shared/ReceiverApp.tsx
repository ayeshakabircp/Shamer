import { useState, useEffect, useRef } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import "./../_group.css";

type ReceiverScreen =
  | "shame"
  | "deserved"
  | "didnt-use-ai"
  | "but-you-did"
  | "never-wrong";

interface TomatoSplashProps {
  lottieRef: React.RefObject<LottieRefCurrentProps | null>;
  onComplete: () => void;
}

function TomatoSplash({ lottieRef, onComplete }: TomatoSplashProps) {
  const [animData, setAnimData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/__mockup/tomato-lottie.json")
      .then((r) => r.json())
      .then(setAnimData)
      .catch(() => {});
  }, []);

  if (!animData) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animData}
        loop={false}
        autoplay
        onComplete={onComplete}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
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

export function ReceiverApp({ shameText: initialShameText }: ReceiverAppProps) {
  const [screen, setScreen] = useState<ReceiverScreen>("shame");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioDone, setAudioDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liveShameText, setLiveShameText] = useState<string | undefined>(initialShameText);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const deservedBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ch = new BroadcastChannel("shamer-preview");
    ch.onmessage = (e) => {
      if (e.data?.type === "preview-shame") {
        setLiveShameText(e.data.text);
        setScreen("shame");
        setAudioDone(false);
        setAnimDone(false);
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().then(() => setAudioPlaying(true)).catch(() => {});
        }
        lottieRef.current?.goToAndPlay(0, true);
      }
    };
    return () => ch.close();
  }, []);

  const bothDone = audioDone && animDone;

  const text =
    liveShameText || "Babe... did you just outsource your feelings to a robot? Gross.";

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
    } else {
      setMuted((m) => !m);
    }
  }

  const audioIcon = bothDone ? "↺" : !audioPlaying && !audioDone ? "▶" : muted ? "🔇" : "🔊";

  function renderScreen() {
    if (screen === "deserved") {
      return (
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center">
          <div className="text-5xl mb-6">✅</div>
          <h2
            className="shamer-font-h2 mb-4 leading-tight"
            style={{ fontSize: "52px", color: "#F51818" }}
          >
            Apology accepted.
          </h2>
          <p className="text-base mb-10" style={{ color: "#666" }}>
            Do better next time.
          </p>
          <button
            onClick={() => setScreen("shame")}
            className="shamer-btn-primary px-6 py-4 text-base"
          >
            Shame Someone Else
          </button>
        </div>
      );
    }

    if (screen === "didnt-use-ai") {
      return (
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center">
          <div className="text-5xl mb-6">🤔</div>
          <h2
            className="shamer-font-h2 mb-8 leading-tight"
            style={{ fontSize: "52px", color: "#F51818" }}
          >
            But you did.
          </h2>
          <button
            onClick={() => setScreen("never-wrong")}
            className="shamer-btn-primary w-full max-w-xs px-6 py-4 text-base"
          >
            No I didn't!
          </button>
        </div>
      );
    }

    if (screen === "never-wrong") {
      return (
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center overflow-hidden relative">
          <div className="text-5xl mb-6">⚖️</div>
          <h2
            className="shamer-font-h2 mb-4 leading-tight"
            style={{ fontSize: "52px", color: "#F51818" }}
          >
            The person who sent this to you is never wrong.
          </h2>
          <p className="text-sm mb-8" style={{ color: "#666" }}>
            Accept your shame.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs items-center">
            <button
              ref={deservedBtnRef}
              onClick={() => setScreen("deserved")}
              className="shamer-btn-primary w-full px-6 py-4 text-base"
            >
              I deserved this
            </button>
          </div>
          <WiggleButton
            label="No I won't!"
            onClick={() => {}}
            anchorRef={deservedBtnRef}
            className="shamer-btn-secondary px-6 py-3 text-sm"
          />
        </div>
      );
    }

    return (
      <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
        <TomatoSplash lottieRef={lottieRef} onComplete={() => setAnimDone(true)} />
        <button
          onClick={handleAudioButton}
          aria-label={bothDone ? "Replay" : !audioPlaying && !audioDone ? "Play" : muted ? "Unmute" : "Mute"}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 99999,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1.5px solid #F3AB93",
            background: "#FFECE3",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ad0d00",
          }}
        >
          {audioIcon}
        </button>
        <div className="relative z-10 w-full max-w-sm">
          <h1
            className="shamer-font-display mb-4 uppercase text-center"
            style={{ fontSize: "64px", color: "#F51818", lineHeight: 1.1 }}
          >
            You've been shamed!
          </h1>
          <p className="mb-6 leading-relaxed text-center" style={{ fontSize: "16px", color: "#444" }}>
            {text}
          </p>
          <div className="mb-8">
            <BouncingThumbsDown />
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setScreen("deserved")}
              className="shamer-btn-primary w-full px-6 py-4 text-base"
            >
              I deserved this
            </button>
            <button
              onClick={() => setScreen("didnt-use-ai")}
              className="shamer-btn-secondary w-full px-6 py-4 text-base"
            >
              But I didn't use AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} src="/__mockup/boo.mp3" preload="auto" />
      {renderScreen()}
    </>
  );
}
