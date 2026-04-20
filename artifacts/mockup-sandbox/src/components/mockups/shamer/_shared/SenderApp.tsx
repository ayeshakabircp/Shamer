import { useState, useRef } from "react";
import "./../_group.css";

const SHAME_TEMPLATES = [
  "Babe... did you just outsource your feelings to a robot? Gross.",
  "Uncle Frank. That joke wasn't yours. We know. The whole chat knows.",
  "Another Monday. Another 'thought leadership' post written by a robot pretending to be you. Definitely original.",
  "Sir that is not you in that photo. You are not that symmetrical. Be for real",
  "Do better",
  "It's giving ctrl+C, ctrl+V. Give me a break Jessica",
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

export function SenderApp({ bgClass = "" }: { bgClass?: string }) {
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
      <div className={`shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 text-center ${bgClass}`}>
        <div className="mb-6">
          <span className="text-5xl">🔗</span>
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

        <p className="text-xs mt-2 mb-8" style={{ color: "#999" }}>
          tap to copy
        </p>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            className="shamer-btn-primary w-full px-6 py-4 text-base"
            onClick={() => {
              const ch = new BroadcastChannel("shamer-preview");
              ch.postMessage({ type: "preview-shame", text: displayText });
              ch.close();
              window.parent.postMessage({ type: "preview-shame", text: displayText }, "*");
            }}
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
    );
  }

  return (
    <div className={`shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-10 ${bgClass}`}>
      <div className="w-full max-w-sm text-center">
        <h1
          className="shamer-font-display mb-3 leading-tight"
          style={{ fontSize: "64px", color: "#F51818" }}
        >
          Were you just<br />AI-ed?
        </h1>

        <p className="mb-8 leading-relaxed" style={{ fontSize: "16px", color: "#444" }}>
          There are some places AI just doesn't belong.
          If you're here, you're probably a victim.
          Go ahead, <strong>SHAME THEM.</strong>
        </p>

        <p className="text-xs mb-3" style={{ color: "#999" }}>Pick a template or write your own</p>

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
              <span className="text-xs" style={{ color: "#999" }}>
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
              style={{ color: "#999" }}
            >
              use a template instead
            </button>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!displayText.trim()}
          className="shamer-btn-primary w-full px-6 py-4 text-base rounded-tl-[24px] rounded-tr-[24px] rounded-br-[24px] rounded-bl-[24px]"
        >
          Generate Shame Link
        </button>
      </div>
    </div>
  );
}
