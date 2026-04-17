import { useState, useEffect, useRef } from "react";
import "./../_group.css";

const SHAME_TEMPLATES = [
  "Babe... did you just outsource your feelings to a robot? Gross.",
  "Do better.",
  "I poured my heart out and you sent me a ChatGPT response. I'm done.",
  "This relationship is not a prompt. Try again, human.",
];

type Screen = "home" | "link";

function generateFakeLink() {
  const adjectives = ["tiny", "quick", "neat", "cozy", "bright", "calm"];
  const nouns = ["panda", "toast", "cloud", "spark", "link", "note"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const code = Math.random().toString(36).slice(2, 7);
  return `share.me/${adj}-${noun}-${code}`;
}

export function SenderApp() {
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
    const link = generateFakeLink();
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
      <div
        className="shamer-font-body min-h-screen flex flex-col items-center justify-center p-10 text-center"
        style={{ background: "#FFF7F0" }}
      >
        <div className="mb-6">
          <span className="text-5xl">🔗</span>
        </div>
        <h2 className="shamer-font-display text-3xl font-black mb-2" style={{ color: "#1A1A1A" }}>
          Your shame link is ready.
        </h2>
        <p className="text-sm mb-8" style={{ color: "#666" }}>
          Totally innocent looking. They'll never see it coming.
        </p>

        <button
          onClick={handleCopy}
          className="w-full max-w-sm rounded-2xl px-6 py-4 text-left font-mono text-sm break-all border-2 transition-all"
          style={{
            background: copied ? "#1A1A1A" : "#fff",
            borderColor: "#1A1A1A",
            color: copied ? "#fff" : "#1A1A1A",
          }}
        >
          {copied ? "✓ Copied!" : shameLink}
        </button>

        <p className="text-xs mt-2 mb-8" style={{ color: "#999" }}>
          tap to copy
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            className="rounded-2xl px-6 py-4 font-bold text-base transition-all hover:opacity-90"
            style={{ background: "#ff6161", color: "#fff" }}
            onClick={() => {
              const msg = encodeURIComponent(displayText);
              window.parent.postMessage({ type: "preview-shame", text: displayText }, "*");
            }}
          >
            Preview Shame
          </button>
          <button
            className="rounded-2xl px-6 py-4 font-bold text-base border-2 transition-all hover:opacity-80"
            style={{ borderColor: "#1A1A1A", color: "#1A1A1A", background: "transparent" }}
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
    );
  }

  return (
    <div
      className="shamer-font-body min-h-screen flex flex-col items-center justify-center p-10"
      style={{ background: "#FFF7F0" }}
    >
      <div className="w-full max-w-sm text-center">
        <h1 className="shamer-font-display font-black mb-3 leading-tight" style={{ fontSize: "64px", color: "#1A1A1A" }}>
          Were you just<br />AI-ed?
        </h1>

        <p className="mb-8 leading-relaxed text-[#262626]" style={{ fontSize: "16px", color: "#444" }}>
          There are some places AI just doesn't belong.
          If you're here, you're probably a victim.
          Go ahead, <strong>SHAME THEM.</strong>
        </p>

        <p className="text-xs mb-3" style={{ color: "#999" }}>
          pick a template or write your own
        </p>

        <div
          className="rounded-3xl p-4 mb-8 border-2"
          style={{ background: "#fff", borderColor: "#E5DDD5" }}
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
            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#E5DDD5" }}>
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                style={{ background: "#F0EBE5", color: "#1A1A1A" }}
              >
                ←
              </button>
              <span className="text-xs" style={{ color: "#999" }}>
                {templateIndex + 1} of {SHAME_TEMPLATES.length} templates
              </span>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                style={{ background: "#F0EBE5", color: "#1A1A1A" }}
              >
                →
              </button>
            </div>
          )}

          {useCustom && (
            <button
              onClick={() => { setUseCustom(false); setCustomText(""); }}
              className="mt-2 text-xs underline"
              style={{ color: "#999" }}
            >
              use a template instead
            </button>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!displayText.trim()}
          className="w-full rounded-2xl px-6 py-4 text-base transition-all hover:opacity-90 disabled:opacity-40 border-t-[#b8b8b8] border-r-[#b8b8b8] border-b-[#b8b8b8] border-l-[#b8b8b8] border-t-[0.5px] border-r-[0.5px] border-b-[0.5px] border-l-[0.5px] rounded-tl-[8px] rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] font-semibold bg-[#ff6161]"
          style={{ background: "#ff6161", color: "#fff" }}
        >
          Generate Shame Link
        </button>
      </div>
    </div>
  );
}
