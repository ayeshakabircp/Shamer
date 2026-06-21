import { useState, useRef, useEffect } from "react";
import React from "react";
import "../shamer.css";
import { encodeShame } from "../lib/encoding";

const SHAME_TEMPLATES = [
  "Babe... did you just outscore your feelings to a robot? Gross.",
  "Sir, that is not you in that photo. You are not that symmetrical. Be for real.",
  "Uncle Frank. That joke wasn't yours. We know. The whole chat knows.",
  "Another Monday. Another recycled 'thought leadership' post written by a robot pretending to be you. Definitely original.",
  "Do better.",
  "It's giving ctrl+C, ctrl+V. Give me a break Jessica.",
];

function generateShameLink(shameText: string, weapon: string): string {
  const encoded = encodeShame(shameText, weapon);
  return `${window.location.origin}/shame?m=${encodeURIComponent(encoded)}&w=${encodeURIComponent(weapon)}`;
}

function Nav({ onLogoClick, showLetterIcon }: { onLogoClick: () => void; showLetterIcon: boolean }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "72px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", background: "transparent", zIndex: 1000,
    }}>
      <button onClick={onLogoClick} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: 2 }}>
        <span style={{ fontSize: "20px" }}>🍅</span>
        <span className="shamer-font-display" style={{ fontSize: "24px", color: "#F51818" }}>SHAMER</span>
      </button>
      {showLetterIcon && (
        <a href="/story" className="nav-story-btn" style={{
          display: "flex", alignItems: "center", gap: "6px", textDecoration: "none",
          fontSize: "14px", color: "#ad0d00", fontFamily: "'Hanken Grotesk', sans-serif",
          fontWeight: 700, background: "rgba(243,171,147,0.35)", border: "1.5px solid #F3AB93",
          borderRadius: "999px", padding: "8px 16px",
        }}>
          <img src="/love-letter.svg" alt="" style={{ width: "1.4em", height: "1.4em", display: "inline", verticalAlign: "middle" }} />
          <span className="nav-btn-text">What is this?</span>
        </a>
      )}
    </nav>
  );
}

function FlowDiagram() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { emoji: "😤", label: "You get AI-ed" },
    { emoji: "✍️", label: "You craft the shame" },
    { emoji: "🔗", label: "Send them the link" },
    { emoji: "🍅", label: "Let the tomatoes fly" },
  ];

  return (
    <div style={{
      maxWidth: "420px", margin: "0 auto 48px",
      padding: "32px 24px 36px", borderRadius: "24px",
      background: "rgba(243,171,147,0.25)",
      border: "1.5px solid #F3AB93",
    }}>
      <p style={{ fontSize: "10px", fontWeight: 700, color: "#995a5a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px", textAlign: "center" }}>
        Here's how Shamer works
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
        {steps.map(({ emoji, label }, i) => (
          <React.Fragment key={label}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              transition: "all 0.4s ease",
              opacity: step === i ? 1 : 0.6,
              transform: step === i ? "scale(1.15)" : "scale(0.9)",
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "18px",
                background: step === i ? "rgba(243,171,147,0.4)" : "rgba(243,171,147,0.1)",
                border: step === i ? "1.5px solid #F3AB93" : "1.5px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "32px", transition: "all 0.4s ease",
              }}>
                {emoji}
              </div>
              <span style={{
                fontSize: "9px", fontWeight: 700, color: step === i ? "#ad0d00" : "#c97a6a",
                letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center",
                maxWidth: "60px", lineHeight: 1.3, transition: "color 0.4s ease",
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: "20px", height: "2px", marginBottom: "20px",
                background: step > i ? "#F3AB93" : "rgba(243,171,147,0.2)",
                transition: "background 0.4s ease", borderRadius: "2px", flexShrink: 0,
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function WeaponPreview({ weapon, onDone }: { weapon: string; onDone: () => void }) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setOpacity(0), 1800);
    const doneTimer = setTimeout(onDone, 2300);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  const items = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    left: Math.random() * 90 + 2,
    size: Math.floor(Math.random() * 32) + 28,
    duration: Math.random() * 1 + 0.8,
    delay: Math.random() * 1.2,
    rotate: Math.random() * 360,
    wobble: (Math.random() - 0.5) * 50,
  }));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 5, pointerEvents: "none",
      overflow: "hidden", opacity, transition: "opacity 0.5s ease",
    }}>
      {items.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          top: "-100px",
          left: `${p.left}%`,
          fontSize: `${p.size}px`,
          animation: `weaponFall ${p.duration}s ease-in ${p.delay}s forwards`,
          "--wobble": `${p.wobble}px`,
          "--endRotate": `${p.rotate}deg`,
        } as React.CSSProperties}>
          {weapon}
        </div>
      ))}
      <style>{`
        @keyframes weaponFall {
          0%   { transform: translateY(0) rotate(0deg) translateX(0px); opacity: 1; }
          50%  { transform: translateY(50vh) rotate(180deg) translateX(var(--wobble)); }
          100% { transform: translateY(110vh) rotate(var(--endRotate)) translateX(calc(var(--wobble) * -1)); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default function Sender() {
  const [screen, setScreen] = useState<"landing" | "builder" | "link">("landing");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [shameLink, setShameLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState("🍅");
  const [previewWeapon, setPreviewWeapon] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentTemplate = SHAME_TEMPLATES[templateIndex];
  const displayText = useCustom ? customText : currentTemplate;

  function handlePrev() {
    setUseCustom(false);
    setTemplateIndex((i) => (i - 1 + SHAME_TEMPLATES.length) % SHAME_TEMPLATES.length);
  }

  function handleNext() {
    setUseCustom(false);
    setTemplateIndex((i) => (i + 1) % SHAME_TEMPLATES.length);
  }

  async function handleGenerate() {
    const link = await generateShameLink(displayText, selectedWeapon);
    setShameLink(link);
    setScreen("link");
  }

  function handleCopy() {
    navigator.clipboard.writeText(shameLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCustomType(v: string) {
    setCustomText(v);
    setUseCustom(true);
  }

  function handleReset() {
    setShameLink("");
    setCustomText("");
    setUseCustom(false);
    setTemplateIndex(0);
    setSelectedWeapon("🍅");
    setShowCard(false);
    setPreviewWeapon(null);
    setScreen("landing");
  }

  // LANDING SCREEN
  if (screen === "landing") {
    return (
      <>
        <Nav onLogoClick={handleReset} showLetterIcon={true} />
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-6" style={{ paddingTop: "72px" }}>
          <div style={{ width: "100%", maxWidth: "560px", margin: "0 auto", textAlign: "center", paddingBottom: "120px" }}>
            <p style={{ fontSize: "13px", color: "#8f4040", marginTop: "32px", marginBottom: "32px", textAlign: "center" }} className="font-bold">
              Built with AI, to shame AI 🍅 · <a href="/story" style={{ color: "#8f4040", textDecoration: "underline" }}>Why I built this</a>
            </p>
            <h1 className="shamer-font-display uppercase mobile-headline" style={{ fontSize: "clamp(60px, 8vw, 88px)", color: "#F51818", lineHeight: 0.9, marginBottom: "12px", marginTop: "12px" }}>
              Were you just<br />AI-ed?
            </h1>
            <p className="leading-relaxed" style={{ fontSize: "16px", color: "#444", maxWidth: "500px", margin: "0 auto 32px", textAlign: "center" }}>
              Got a text that felt a little too perfect? A LinkedIn post that wrote itself? A dating bio no human actually wrote?
              <br /><strong>Shamer lets you call them out 💅</strong>
            </p>
            <FlowDiagram />
            <div style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              padding: "20px 24px 36px",
              background: "transparent",
              zIndex: 100, display: "flex", flexDirection: "column",
              alignItems: "center", gap: "12px",
            }}>
              <button
                onClick={() => setScreen("builder")}
                className="shamer-btn-primary"
                style={{ width: "auto", minWidth: "280px", padding: "16px 48px", fontSize: "18px" }}
              >
                Shame someone 🍅
              </button>
              <a href="/test" style={{ fontSize: "13px", color: "#995a5a", textAlign: "center", textDecoration: "none", marginTop: "8px" }}>
                <strong>Not sure it's even AI? Test the text first →</strong>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  // LINK READY SCREEN
  if (screen === "link") {
    return (
      <>
        <Nav onLogoClick={handleReset} showLetterIcon={false} />
        {showCard && (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99998, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
            onClick={() => setShowCard(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ background: "#FCF4F0", borderRadius: "24px", padding: "32px 24px", maxWidth: "360px", width: "100%", textAlign: "center", position: "relative" }}
            >
              <button onClick={() => setShowCard(false)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#995a5a" }}>✕</button>
              <div ref={cardRef} style={{
                background: "linear-gradient(135deg, #FFECE3 0%, #FCF4F0 100%)",
                border: "1.5px solid #F3AB93", borderRadius: "16px", padding: "28px 20px", marginBottom: "20px",
              }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#c97a6a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                  I just AI-shamed someone
                </p>
                <p style={{ fontSize: "52px", marginBottom: "12px", lineHeight: 1 }}>{selectedWeapon}</p>
                <div style={{ height: "1px", background: "#F3AB93", opacity: 0.5, margin: "0 0 16px" }} />
                <p style={{ fontSize: "14px", color: "#444", fontStyle: "italic", lineHeight: 1.7, marginBottom: "16px" }}>
                  "{displayText.length > 80 ? displayText.slice(0, 80) + "..." : displayText}"
                </p>
                <div style={{ height: "1px", background: "#F3AB93", opacity: 0.5, margin: "0 0 16px" }} />
                <p style={{ fontSize: "11px", color: "#c97a6a", letterSpacing: "0.08em", fontWeight: 600 }}>SHAMER.APP 🍅</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "I just AI-shamed someone 🍅",
                        text: `I caught someone using AI and sent them a shame link. Check out Shamer — ${shameLink}`,
                        url: shameLink,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(`I caught someone using AI and sent them a shame link 🍅\n\nCheck out Shamer: https://shamer.app`);
                      alert("Copied to clipboard!");
                    }
                  }}
                  className="shamer-btn-primary"
                  style={{ flex: 1, padding: "12px", fontSize: "14px" }}
                >
                  Share 🍅
                </button>
                <button
                  onClick={async () => {
                    if (!cardRef.current) return;
                    const { default: html2canvas } = await import("html2canvas");
                    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#FCF4F0", scale: 2 });
                    const link = document.createElement("a");
                    link.download = "my-shame-card.png";
                    link.href = canvas.toDataURL();
                    link.click();
                  }}
                  className="shamer-btn-secondary"
                  style={{ flex: 1, padding: "12px", fontSize: "14px" }}
                >
                  Save ↓
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-6" style={{ paddingTop: "72px" }}>
          <div style={{ width: "100%", maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
            <h2 className="shamer-font-display" style={{ fontSize: "52px", color: "#F51818", marginBottom: "8px", lineHeight: 1.1 }}>
              Send it to them.
            </h2>
            <p style={{ fontSize: "14px", color: "#ad0d00", marginBottom: "20px", lineHeight: 1.6 }}>
              They won't know what's coming 😈
            </p>
            <div style={{ background: "rgba(243,171,147,0.2)", borderRadius: "24px", padding: "28px" }}>
              <button
                onClick={handleCopy}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: "50px",
                  background: copied ? "#ad0d00" : "#fff",
                  border: "1.5px solid #F3AB93",
                  color: copied ? "#fff" : "#1A1A1A",
                  fontSize: "13px", fontFamily: "inherit", cursor: "pointer",
                  marginBottom: "8px", textAlign: "left",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}
              >
                {copied ? "✓ Copied!" : shameLink}
              </button>
              <p style={{ fontSize: "11px", color: "#995a5a", marginBottom: "20px" }}>tap to copy</p>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button className="shamer-btn-secondary" style={{ flex: 1, padding: "14px", fontSize: "15px" }} onClick={handleReset}>
                  Shame someone else 🍅
                </button>
                <button className="shamer-btn-primary" style={{ flex: 1, padding: "14px", fontSize: "15px" }} onClick={() => window.open(shameLink, "_blank")}>
                  Preview 👀
                </button>
              </div>
              <button
                onClick={() => setShowCard(true)}
                style={{ background: "none", border: "none", fontSize: "13px", color: "#ad0d00", cursor: "pointer", fontWeight: 700, fontFamily: "'chauncy-pro', Georgia, serif", padding: "4px", textDecoration: "underline" }}
              >
                Share on socials →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // BUILDER SCREEN
  return (
    <>
      {previewWeapon && (
        <WeaponPreview
          key={previewWeapon + Date.now()}
          weapon={previewWeapon}
          onDone={() => setPreviewWeapon(null)}
        />
      )}
      <Nav onLogoClick={handleReset} showLetterIcon={false} />
      <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center p-6" style={{ paddingTop: "96px" }}>
        <div className="flex-1 flex items-center justify-center w-full">
          <div style={{ width: "100%", maxWidth: "560px", margin: "0 auto", textAlign: "center", paddingBottom: "120px" }}>
            <h2 className="shamer-font-display" style={{ fontSize: "52px", color: "#F51818", marginBottom: "20px", lineHeight: 1.1 }}>
              Craft the shame
            </h2>
            <div className="mobile-card" style={{ background: "rgba(243,171,147,0.2)", borderRadius: "24px", padding: "28px 28px 24px", maxWidth: "520px", margin: "0 auto" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#ad0d00", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                Pick what you want to say or write your own
              </p>
              <div className="rounded-3xl border-2 template-picker" style={{ background: "#fff", borderColor: "#F3AB93", transition: "border-color 0.2s", width: "100%", margin: "0 0 20px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <textarea
                  ref={textareaRef}
                  className="w-full text-sm resize-none outline-none bg-transparent leading-relaxed text-center"
                  style={{ color: "#1A1A1A", minHeight: "60px", fontFamily: "inherit" }}
                  value={useCustom ? customText : currentTemplate}
                  onChange={(e) => handleCustomType(e.target.value)}
                  placeholder="Write your own shame..."
                  onClick={() => { if (!useCustom) { setUseCustom(true); setCustomText(currentTemplate); } }}
                />
                {!useCustom && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#F3AB93" }}>
                    <button onClick={handlePrev} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70" style={{ background: "#FFECE3", color: "#ad0d00" }}>←</button>
                    <span className="text-xs" style={{ color: "#995a5a" }}>{templateIndex + 1} of {SHAME_TEMPLATES.length} templates</span>
                    <button onClick={handleNext} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70" style={{ background: "#FFECE3", color: "#ad0d00" }}>→</button>
                  </div>
                )}
                {useCustom && (
                  <button onClick={() => { setUseCustom(false); setCustomText(""); }} className="mt-2 text-xs underline" style={{ color: "#995a5a" }}>
                    Use a template instead
                  </button>
                )}
              </div>
              <div style={{ height: "1px", background: "#F3AB93", opacity: 0.7, margin: "0 0 20px" }} />
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#ad0d00", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                Pick what you want to throw at them
              </p>
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", width: "100%", marginBottom: "20px" }}>
                {[{ emoji: "🍅" }, { emoji: "🥚" }, { emoji: "💩" }].map(({ emoji }) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setSelectedWeapon(emoji);
                      setPreviewWeapon(emoji);
                    }}
                    className="weapon-card"
                    style={{
                      flex: 1, height: "140px", borderRadius: "12px",
                      border: selectedWeapon === emoji ? "2px solid #F51818" : "1.5px solid #F3AB93",
                      background: selectedWeapon === emoji ? "#FFECE3" : "#fff",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                    }}
                  >
                    <span className="weapon-emoji" style={{ fontSize: "52px" }}>{emoji}</span>
                  </button>
                ))}
              </div>
              <div style={{ height: "1px", background: "#F3AB93", opacity: 0.7, margin: "0 0 32px" }} />
              <button onClick={handleGenerate} disabled={!displayText.trim()} className="shamer-btn-primary px-6 py-4 text-base" style={{ width: "100%", display: "block" }}>
                Get my shame link
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
