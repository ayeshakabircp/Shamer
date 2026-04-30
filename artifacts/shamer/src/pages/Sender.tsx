import { useState, useRef, useEffect } from "react";
import "../shamer.css";
import { supabase } from "../lib/supabase";
import { nanoid } from "nanoid";

const SHAME_TEMPLATES = [
  "Babe... did you just outsource your feelings to a robot? Gross.",
  "Sir, that is not you in that photo. You are not that symmetrical. Be for real.",
  "Uncle Frank. That joke wasn't yours. We know. The whole chat knows.",
  "Another Monday. Another recycled 'thought leadership' post written by a robot pretending to be you. Definitely original.",
  "Do better.",
  "It's giving ctrl+C, ctrl+V. Give me a break Jessica.",
];

async function generateShameLink(shameText: string, weapon: string): Promise<string> {
  const id = nanoid(6);
  await supabase.from("shames").insert({ id, message: shameText, weapon });
  const apiBase = window.location.origin.replace("3000", "8080");
  return `${apiBase}/s/${id}`;
}

function Nav({ showLetterIcon, onLogoClick }: { showLetterIcon: boolean; onLogoClick: () => void }) {
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
            <a href="/story" style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
              fontSize: "14px",
              color: "#ad0d00",
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontWeight: 700,
              background: "rgba(243,171,147,0.7)",
              borderRadius: "999px",
              padding: "8px 16px",
            }}>
              <img src="/love-letter.svg" alt="" style={{ width: "1.4em", height: "1.4em", display: "inline", verticalAlign: "middle" }} />
          What Is This?
        </a>
      )}

    </nav>
  );
}

export default function Sender() {
  const [templateIndex, setTemplateIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [shameLink, setShameLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState("🍅");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [shameCount, setShameCount] = useState<number | null>(null);
  useEffect(() => {
    supabase
      .from("shames")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setShameCount(count));
  }, []);

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

  return (
    <>
      <Nav showLetterIcon={true} onLogoClick={() => {
        setShameLink("");
        setCustomText("");
        setUseCustom(false);
        setTemplateIndex(0);
        setSelectedWeapon("🍅");
      }} />
      <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center p-6 mobile-top-padding" style={{ paddingTop: "96px" }}>
        <div className="flex-1 flex items-center justify-center w-full">
          <div style={{ width: "100%", maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>

            <h1
              className="shamer-font-display mb-3 uppercase mobile-headline"
              style={{ fontSize: "clamp(60px, 8vw, 88px)", color: "#F51818", lineHeight: 0.9 }}
            >
              Were you just<br />AI-ed?
            </h1>

            <p
              className="leading-relaxed mobile-subtitle"
              style={{ fontSize: "16px", color: "#444", maxWidth: "500px", margin: "0 auto 8px", textAlign: "center" }}
            >
              Got a text that felt a little too perfect? A LinkedIn post that wrote itself? A dating bio no human actually wrote?
            </p>

            <p style={{ fontSize: "14px", color: "#995a5a", maxWidth: "440px", margin: "0 auto 28px", textAlign: "center" }}>
              <strong>Shamer helps you call them out.</strong>
            </p>

            <div className="mobile-card" style={{ background: "rgba(243,171,147,0.2)", borderRadius: "24px", padding: "28px 28px 24px", maxWidth: "520px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "20px", color: "#995a5a" }}>
                {[
                  { label: "WRITE THE SHAME" },
                  { label: "PICK YOUR WEAPON" },
                  { label: "SEND THE LINK" },
                ].map(({ label }, i, arr) => (
                  <>
                    <span key={label} style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#995a5a",
                      letterSpacing: "0.1em",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    }}>
                      {label}
                    </span>
                    {i < arr.length - 1 && (
                    <span style={{ fontSize: "10px", color: "#000" }}>🍅</span>
                    )}
                  </>
                ))}
              </div>
              <div style={{ height: "1px", background: "#F3AB93", opacity: 0.7, margin: "0 0 20px" }} />
              {shameLink ? (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "#995a5a", marginBottom: "0px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Your shame link is ready ✓
                  </p>
                  <p style={{ fontSize: "14px", color: "#995a5a", marginBottom: "20px", lineHeight: 1.6 }}>
                    Send this to them. They won't know what's coming.
                  </p>
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
                  <div className="mobile-btn-row" style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="shamer-btn-primary px-4 py-3"
                      style={{ flex: 1, fontSize: "16px" }}
                      onClick={() => window.open(shameLink, "_blank")}
                    >
                      Preview 👀
                    </button>
                    <button
                      className="shamer-btn-secondary px-4 py-3"
                      style={{ flex: 1, fontSize: "16px" }}
                      onClick={() => {
                        setShameLink("");
                        setCustomText("");
                        setUseCustom(false);
                        setTemplateIndex(0);
                        setSelectedWeapon("🍅");
                      }}
                    >
                      Shame someone else
                    </button>
                  </div>
                </div>

              ) : (
                <>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#c97a6a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                    Pick a template or write your own
                  </p>

                  <div
                    className="rounded-3xl border-2 template-picker"
                    style={{ background: "#fff", borderColor: "#FFECE3",transition: "border-color 0.2s", width: "100%", margin: "0 0 20px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                  >
                    <textarea
                      ref={textareaRef}
                      className="w-full text-sm resize-none outline-none bg-transparent leading-relaxed text-center"
                      style={{ color: "#1A1A1A", minHeight: "60px", fontFamily: "inherit" }}
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
                        Use a template instead
                      </button>
                    )}
                  </div>
                  <div style={{ height: "1px", background: "#F3AB93", opacity: 0.7, margin: "0 0 20px" }} />

                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#c97a6a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                    Pick your weapon
                  </p>

                      <div style={{ display: "flex", gap: "20px", justifyContent: "center", width: "100%", marginBottom: "20px" }}>
                    {[{ emoji: "🍅" }, { emoji: "🥚" }, { emoji: "💩" }].map(({ emoji }) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedWeapon(emoji)}
                        className="weapon-card"
                        style={{
                          flex: 1, height: "140px", borderRadius: "12px",
                          border: selectedWeapon === emoji ? "2px solid #F51818" : "1.5px solid #F3AB93",
                          background: selectedWeapon === emoji ? "#FFECE3" : "#fff",
                          cursor: "pointer", display: "flex", alignItems: "center",
                          justifyContent: "center", transition: "all 0.15s",
                        }}
                      >
                        <span className="weapon-emoji" style={{ fontSize: "52px" }}>{emoji}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ height: "1px", background: "#F3AB93", opacity: 0.7, margin: "0 0 16px" }} />
                  <a href="/test" className="ai-test-link" style={{ fontSize: "12px", color: "#995a5a", display: "block", marginBottom: "12px", textAlign: "center", textDecoration: "none", transition: "color 0.2s" }}>
                    Is it even AI? Test the text in question first →
                  </a>
                  <button
                    onClick={handleGenerate}
                    disabled={!displayText.trim()}
                    className="shamer-btn-primary px-6 py-4 text-base"
                    style={{ width: "100%", display: "block" }}
                  >
                    Get my shame link
                  </button>
                </>
              )}
            </div>

            <p style={{ fontSize: "12px", color: "#8f4040", marginTop: "32px", textAlign: "center" }} className="font-bold">
              AI-built AI Shamer 🍅 · <a href="/story" style={{ color: "#8f4040", textDecoration: "underline" }}>Wait, why?</a>
            </p>
            {shameCount !== null && (
              <p style={{ fontSize: "12px", color: "#ad0d00", marginTop: "10px", textAlign: "center" }}>
                 {shameCount.toLocaleString()} shames sent and counting
              </p>
            )}

          </div>
        </div>
      </div>
    </>
  );
}