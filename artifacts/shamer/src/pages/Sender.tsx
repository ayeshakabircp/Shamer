      import { useState, useRef, useEffect } from "react";
      import "../shamer.css";
      import { supabase } from "../lib/supabase";
      import { nanoid } from "nanoid";
import html2canvas from "html2canvas";

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
            padding: "0 16px", background: "transparent", zIndex: 1000,
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

      export default function Sender() {
        const [templateIndex, setTemplateIndex] = useState(0);
        const [customText, setCustomText] = useState("");
        const [useCustom, setUseCustom] = useState(false);
        const [shameLink, setShameLink] = useState("");
        const [copied, setCopied] = useState(false);
        const [selectedWeapon, setSelectedWeapon] = useState("🍅");
        const [shameCount, setShameCount] = useState<number | null>(null);
        const [showCard, setShowCard] = useState(false);
        const cardRef = useRef<HTMLDivElement>(null);
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        const currentTemplate = SHAME_TEMPLATES[templateIndex];
        const displayText = useCustom ? customText : currentTemplate;

        useEffect(() => {
          supabase
            .from("shames")
            .select("*", { count: "exact", head: true })
            .then(({ count }) => setShameCount(count));
        }, []);

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

        function handleReset() {
          setShameLink("");
          setCustomText("");
          setUseCustom(false);
          setTemplateIndex(0);
          setSelectedWeapon("🍅");
          setShowCard(false);
        }

        return (
          <>
            <Nav showLetterIcon={true} onLogoClick={handleReset} />

            {showCard && (
              <div
                style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99998, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
                onClick={() => setShowCard(false)}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ background: "#FCF4F0", borderRadius: "24px", padding: "32px 24px", maxWidth: "360px", width: "100%", textAlign: "center", position: "relative" }}
                >
                  <button
                    onClick={() => setShowCard(false)}
                    style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#995a5a", lineHeight: 1, padding: "4px" }}
                  >
                    ✕
                  </button>
                  <div ref={cardRef} style={{
                    background: "linear-gradient(135deg, #FFECE3 0%, #FCF4F0 100%)",
                    border: "1.5px solid #F3AB93", borderRadius: "16px", padding: "28px 20px", marginBottom: "20px",
                  }}>
                    <p style={{ fontSize: "10px", fontWeight: 700, color: "#c97a6a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                      I just AI-shamed someone
                    </p>
                    <p style={{ fontSize: "52px", marginBottom: "12px", lineHeight: 1 }}>{selectedWeapon}</p>
                    <p style={{ fontSize: "14px", color: "#444", fontStyle: "italic", lineHeight: 1.7, marginBottom: "16px" }}>
                      "{displayText.length > 80 ? displayText.slice(0, 80) + "..." : displayText}"
                    </p>
                    <div style={{ height: "1px", background: "#F3AB93", opacity: 0.5, margin: "0 0 16px" }} />
                    <p style={{ fontSize: "11px", color: "#c97a6a", letterSpacing: "0.08em", fontWeight: 600 }}>
                      SHAMER.APP 🍅
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={async () => {
                        if (!cardRef.current) return;
                        const { default: html2canvas } = await import("html2canvas");
                        const canvas = await html2canvas(cardRef.current, {
                          backgroundColor: "#FCF4F0",
                          scale: 2,
                        });
                        const link = document.createElement("a");
                        link.download = "my-shame-card.png";
                        link.href = canvas.toDataURL();
                        link.click();
                      }}
                      className="shamer-btn-secondary"
                      style={{ flex: 1, padding: "12px", fontSize: "14px" }}
                    >
                      Save
                    </button>
                    
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
                      Send 
                    </button>
                    
                  </div>
                  
                </div>
              </div>
            )}

            <div className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center p-6 mobile-top-padding" style={{ paddingTop: "96px" }}>
              <div className="flex-1 flex items-center justify-center w-full">
                <div style={{ width: "100%", maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>

                  <h1 className="shamer-font-display mb-3 uppercase mobile-headline" style={{ fontSize: "clamp(60px, 8vw, 88px)", color: "#F51818", lineHeight: 0.9 }}>
                    Were you just<br />AI-ed?
                  </h1>

                  <p className="leading-relaxed mobile-subtitle" style={{ fontSize: "16px", color: "#444", maxWidth: "500px", margin: "0 auto 4px", textAlign: "center" }}>
                    Got a text that felt a little too perfect? A LinkedIn post that wrote itself? A dating bio no human actually wrote?
                  </p>

                  <p className="mobile-callout" style={{ fontSize: "15px", color: "#995a5a", maxWidth: "440px", margin: "0 auto 28px", textAlign: "center" }}>
                    <strong>Shamer helps you call them out.</strong>
                  </p>
                  {!shameLink && (
                    <>
                      <div className="stepper-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "20px" }}>
                        {[
                          { label: "WRITE THE SHAME" },
                          { label: "PICK YOUR WEAPON" },
                          { label: "SEND THE LINK" },
                        ].map(({ label }, i, arr) => (
                          <>
                            <span key={label} style={{ fontSize: "12px", fontWeight: 700, color: "#995a5a", letterSpacing: "0.1em", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                              {label}
                            </span>
                            {i < arr.length - 1 && <span style={{ fontSize: "10px" }}>🍅</span>}
                          </>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="mobile-card" style={{ background: "rgba(243,171,147,0.2)", borderRadius: "24px", padding: "28px 28px 24px", maxWidth: "520px", margin: "0 auto" }}>


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
                        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                          <button
                            className="shamer-btn-secondary"
                            style={{ flex: 1, padding: "12px", fontSize: "15px" }}
                            onClick={() => window.open(shameLink, "_blank")}
                          >
                            Preview 👀
                          </button>
                          <button
                            className="shamer-btn-primary"
                            style={{ flex: 1, padding: "12px", fontSize: "15px" }}
                            onClick={() => setShowCard(true)}
                          >
                            Share 🍅
                          </button>
                        </div>
                        <button
                          onClick={handleReset}
                          style={{ background: "none", border: "none", fontSize: "14px", color: "#ad0d00", cursor: "pointer", fontWeight: 700, fontFamily: "'chauncy-pro', Georgia, serif", padding: "4px" }}
                        >
                          Shame someone else →
                        </button>
                      </div>

                    ) : (
                      <>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "#c97a6a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                          Pick a template or write your own
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
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                              }}
                            >
                              <span className="weapon-emoji" style={{ fontSize: "52px" }}>{emoji}</span>
                            </button>
                          ))}
                        </div>

                        <div style={{ height: "1px", background: "#F3AB93", opacity: 0.7, margin: "0 0 16px" }} />
                        <a href="/test" className="ai-test-link" style={{ fontSize: "13px", color: "#995a5a", display: "block", marginBottom: "14px", textAlign: "center", textDecoration: "none", transition: "color 0.2s" }}>
                          Not sure it's even AI? Test it first →
                        </a>
                        <button onClick={handleGenerate} disabled={!displayText.trim()} className="shamer-btn-primary px-6 py-4 text-base" style={{ width: "100%", display: "block" }}>
                          Get my shame link
                        </button>
                      </>
                    )}
                  </div>

                  <p style={{ fontSize: "12px", color: "#ad0d00", marginTop: "32px", textAlign: "center" }} className="font-bold">
                    AI-built AI Shamer 🍅 · <a href="/story" style={{ color: "#ad0d00", textDecoration: "underline" }}>Wait, why?</a>
                  </p>
                  {shameCount !== null && (
                    <p style={{ fontSize: "12px", color: "#995a5a", marginTop: "10px", textAlign: "center" }}>
                     <strong>{shameCount.toLocaleString()} shames sent and counting</strong> 
                    </p>
                  )}

                </div>
              </div>
            </div>
          </>
        );
      }