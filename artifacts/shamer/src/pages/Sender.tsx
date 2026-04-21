import { useState, useRef } from "react";
import "../shamer.css";

const SHAME_TEMPLATES = [
  "Babe... did you just outsource your feelings to a robot? Gross.",
  "Uncle Frank. That joke wasn't yours. We know. The whole chat knows.",
  "Another Monday. Another 'thought leadership' post written by a robot pretending to be you. Definitely original.",
  "Sir that is not you in that photo. You are not that symmetrical. Be for real",
  "Do better",
  "It's giving ctrl+C, ctrl+V. Give me a break Jessica",
];

type Screen = "home" | "link";

function generateShameLink(shameText: string): string {
  const encoded = btoa(encodeURIComponent(shameText));
  return `${window.location.origin}/shame?t=${encoded}`;
}

function Nav({ showLetterIcon, onLogoClick }: { showLetterIcon: boolean; onLogoClick: () => void }) {
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "#FCF4F0",
      zIndex: 1000,
    }}>
      <button
        onClick={onLogoClick}
        style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span style={{ fontSize: "20px" }}>🍅</span>
        <span className="shamer-font-display" style={{ fontSize: "24px", color: "#F51818" }}>SHAMER</span>
      </button>
      {showLetterIcon && (
        <img src="/love-letter.svg" height={28} alt="" />
      )}
    </nav>
  );
}

export default function Sender() {
  const [screen, setScreen] = useState<Screen>("home");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [shameLink, setShameLink] = useState("");
  const [copied, setCopied] = useState(false);
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

  function handleGenerate() {
    const link = generateShameLink(displayText);
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

  if (screen === "link") {
    return (
      <>
        <Nav showLetterIcon={false} onLogoClick={() => setScreen("home")} />
        <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center" style={{ paddingTop: "56px" }}>
          <div className="mb-6">
            <img src="/thumbs-up.png" alt="Thumbs up" style={{ width: "100px", height: "100px", objectFit: "contain" }} />
          </div>
          <h2
            className="shamer-font-h2 mb-2 leading-tight"
            style={{ fontSize: "52px", color: "#F51818" }}
          >
            Your shame link is ready.
          </h2>
          <p className="text-sm mb-8" style={{ color: "#666" }}>
            Totally innocent looking. They'll never see it coming.
          </p>

          <button
            onClick={handleCopy}
            className="w-full max-w-sm px-6 py-4 text-left font-mono text-sm break-all border-2 transition-all"
            style={{
              borderRadius: "50px",
              background: copied ? "#ad0d00" : "#fff",
              borderColor: "#F3AB93",
              color: copied ? "#fff" : "#1A1A1A",
            }}
          >
            {copied ? "✓ Copied!" : shameLink}
          </button>

          <p className="text-xs mt-2 mb-8" style={{ color: "#995a5a" }}>
            tap to copy
          </p>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              className="shamer-btn-primary w-full px-6 py-4 text-base"
              onClick={() => window.open(shameLink, "_blank")}
            >
              Preview Shame
            </button>
            <button
              className="shamer-btn-secondary w-full px-6 py-4 text-base"
              onClick={() => {
                setScreen("home");
                setCustomText("");
                setUseCustom(false);
              }}
            >
              Shame Someone Else
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav showLetterIcon={true} onLogoClick={() => setScreen("home")} />
      <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center p-10" style={{ paddingTop: "56px" }}>
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-sm text-center">
            <h1
              className="shamer-font-display mb-3 uppercase"
              style={{ fontSize: "64px", color: "#F51818", lineHeight: 0.9 }}
            >
              Were you just<br />AI-ed?
            </h1>

            <p className="mb-8 leading-relaxed" style={{ fontSize: "16px", color: "#444" }}>
              There are some places AI just doesn't belong.
              If you're here, you're probably a victim.
              Go ahead, <strong>SHAME THEM.</strong>
            </p>

            <p className="text-xs mb-3" style={{ color: "#995a5a" }}>Pick a template or write your own</p>

            <div
              className="rounded-3xl p-4 mb-8 border-2"
              style={{ background: "#fff", borderColor: "#F3AB93" }}
            >
              <textarea
                ref={textareaRef}
                className="w-full text-sm resize-none outline-none bg-transparent leading-relaxed text-center"
                style={{ color: "#1A1A1A", minHeight: "80px", fontFamily: "inherit" }}
                value={useCustom ? customText : currentTemplate}
                onChange={(e) => handleCustomType(e.target.value)}
                placeholder="Write your own shame..."
                onClick={() => {
                  if (!useCustom) {
                    setUseCustom(true);
                    setCustomText(currentTemplate);
                  }
                }}
              />

              {!useCustom && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#F3AB93" }}>
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                    style={{ background: "#FFECE3", color: "#ad0d00" }}
                  >
                    ←
                  </button>
                  <span className="text-xs" style={{ color: "#995a5a" }}>
                    {templateIndex + 1} of {SHAME_TEMPLATES.length} templates
                  </span>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                    style={{ background: "#FFECE3", color: "#ad0d00" }}
                  >
                    →
                  </button>
                </div>
              )}

              {useCustom && (
                <button
                  onClick={() => { setUseCustom(false); setCustomText(""); }}
                  className="mt-2 text-xs underline"
                  style={{ color: "#995a5a" }}
                >
                  use a template instead
                </button>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!displayText.trim()}
              className="shamer-btn-primary w-full px-6 py-4 text-base"
            >
              Generate Shame Link
            </button>
          </div>
        </div>
        <p style={{ fontSize: "12px", color: "#8f4040" }} className="font-bold">AI-built AI shamer.</p>
      </div>
    </>
  );
}
