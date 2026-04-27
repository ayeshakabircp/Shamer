import { useState, useEffect, useRef } from "react";
import "../shamer.css";

const TIERS = [
  {
    max: 33,
    label: "Kinda Sus",
    weapon: "🍅",
    color: "#F5A623",
    desc: "Could be AI. Could be they just had a lot of thoughts. Either way, suspicious.",
  },
  {
    max: 66,
    label: "Very Sus",
    weapon: "🥚",
    color: "#E8691E",
    desc: "This is giving ChatGPT with the temperature set to 0.8. We see you.",
  },
  {
    max: 100,
    label: "Obviously AI",
    weapon: "💩",
    color: "#F51818",
    desc: "No human has ever written this. Not once. Not ever. Caught.",
  },
];

function getTier(score: number) {
  return TIERS.find((t) => score <= t.max) ?? TIERS[2];
}

function CounterAnimation({
  target,
  duration = 800,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    function step(timestamp: number) {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return <>{count}</>;
}

function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "transparent",
        zIndex: 1000,
      }}
    >
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: "20px" }}>🍅</span>
        <span
          className="shamer-font-display"
          style={{ fontSize: "24px", color: "#F51818" }}
        >
          SHAMER
        </span>
      </a>
    </nav>
  );
}

export default function AIDetector() {
  const [text, setText] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState<"input" | "result">("input");

  async function handleCheck() {
    if (!text.trim()) return;
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const lower = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;
    let rawScore = 0;

    // AI buzzwords - single word hits
    const aiWords = [
      "delve", "tapestry", "underscores", "pivotal", "leverage", "foster",
      "facilitate", "robust", "comprehensive", "seamlessly", "cutting-edge",
      "scalable", "streamline", "empower", "ecosystem", "paradigm", "synergy",
      "holistic", "utilize", "innovative", "actionable", "impactful", "kudos",
      "bandwidth", "ideate", "liaise", "align", "pivot", "authenticity",
      "vulnerability", "transparency", "nuanced", "multifaceted", "intricate",
      "profound", "resonate", "elevate", "navigate", "landscape", "boundaries",
      "stakeholders", "deliverables", "learnings", "takeaways", "unpack",
      "reimagine", "disruptive", "visionary", "catalyze", "amplify",
      "aforementioned", "heretofore", "nevertheless", "notwithstanding",
      "whilst", "amongst", "henceforth", "thusly", "ergo",
    ];

    // AI phrases - multi word hits (weighted higher)
    const aiPhrases = [
      "i truly appreciate", "i want to acknowledge", "that being said",
      "it's worth noting", "i hope this finds you", "as we navigate",
      "i believe it's important", "meaningful connection", "deep dive",
      "reach out", "in this day and age", "at its core",
      "i'd like to take a moment", "i wanted to take a moment",
      "i hope this message", "i wanted to reach out",
      "i'm here for you", "you are not alone", "your feelings are valid",
      "i see you", "that must be really hard", "i can imagine how",
      "it's completely understandable", "you deserve", "be kind to yourself",
      "i appreciate you", "it's important to", "furthermore", "in conclusion",
      "absolutely", "certainly", "of course", "i want to assure",
      "touch base", "circle back", "going forward", "at the end of the day",
      "please don't hesitate", "feel free to", "moving forward",
      "best regards", "kind regards", "emotional landscape", "safe space",
      "take a step back", "it sounds like", "i hear you",
      "not just", "not only", "but also", "more than just",
      "game changer", "thought leader", "thought leadership",
      "i hope you're doing well", "hope this helps", "let me know if",
      "i want to be honest with you",
      "out of respect for",
      "i think the right thing to do",
      "i'm so grateful for",
      "i'm ready to move on",
      "i've spent a lot of time thinking",
      "where we're headed",
      "i don't see a future",
      "i think it's best if",
      "i need some space to process",
      "i won't be responding",
      "i wish you nothing but the best",
      "i wish you all the best",
      "after four years",
      "incredibly hard to write",
      "everything we've shared",
    ];

    // Structural patterns
    const emDashCount = (text.match(/—/g) || []).length;
    const notNotButPattern = /not\s+\w+[\.,]?\s+not\s+\w+[\.,]?\s+but\s+/i.test(text);
    const tripleStructure = /(\w+,\s*\w+,\s*and\s*\w+)/i.test(text);
    const hasBullets = text.includes("•") || /^\s*[-*]\s/m.test(text);
    const hasNumberedList = /^\s*\d+\.\s/m.test(text);
    const longSentences = text.split(/[.!?]/).filter(s => s.trim().split(/\s+/).length > 25).length;
    const avgWordLength = text.replace(/\s/g, "").length / wordCount;
    const hasParenthetical = (text.match(/\([^)]{10,}\)/g) || []).length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);

    // Score word hits
    let wordHits = 0;
    aiWords.forEach(word => {
      if (lower.includes(word)) wordHits++;
    });

    // Score phrase hits
    let phraseHits = 0;
    aiPhrases.forEach(phrase => {
      if (lower.includes(phrase)) phraseHits++;
    });

    // Base score
    rawScore += wordHits * 4;
    rawScore += phraseHits * 6;

    // Compound bonuses
    if (wordHits >= 2) rawScore += 15;
    if (wordHits >= 4) rawScore += 15;
    if (phraseHits >= 2) rawScore += 15;
    if (phraseHits >= 4) rawScore += 20;

    // Structural bonuses
    if (emDashCount >= 1) rawScore += 12;
    if (emDashCount >= 2) rawScore += 8;
    if (notNotButPattern) rawScore += 20;
    if (tripleStructure) rawScore += 8;
    if (hasBullets) rawScore += 15;
    if (hasNumberedList) rawScore += 12;
    if (longSentences >= 1) rawScore += 12;
    if (longSentences >= 3) rawScore += 10;
    if (avgWordLength > 5.2) rawScore += 10;
    if (avgWordLength > 6) rawScore += 10;
    if (hasParenthetical >= 2) rawScore += 8;
    if (avgSentenceLength > 20) rawScore += 10;
    if (wordCount > 80) rawScore += 8;
    if (wordCount > 150) rawScore += 8;

    // Short text penalty
    if (wordCount < 15) rawScore *= 0.4;
    else if (wordCount < 30) rawScore *= 0.8;
    else if (wordCount < 60) rawScore *= 0.9;

    // Concession-pivot pattern — "X, but Y" / "not X, but Y"
    const concessionPattern = (text.match(/\b(at the same time|that said|that doesn't mean|but also|but i|not in a|not as a|rather than|while i|even though|although)/gi) || []).length;
    if (concessionPattern >= 2) rawScore += 15;
    if (concessionPattern >= 4) rawScore += 20;

    // No informal language — absence of human noise
    const informalWords = ["tbh", "lol", "ngl", "idk", "anyway", "like i said", "you know", "i mean", "kinda", "sorta", "honestly though", "wait", "ugh", "ugh", "haha", "hm ", "hmm", "omg"];
    const informalHits = informalWords.filter(w => lower.includes(w)).length;
    if (informalHits === 0 && wordCount > 100) rawScore += 20;

    // Every sentence ends cleanly — no trailing thoughts
    const trailingThoughts = (text.match(/\.\.\.|—$| - $|\?{2,}|!{2,}/g) || []).length;
    if (trailingThoughts === 0 && wordCount > 80) rawScore += 10;

    // Perfectly balanced paragraph count with similar lengths
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const paraLengths = paragraphs.map(p => p.split(/\s+/).length);
    const avgParaLength = paraLengths.reduce((a, b) => a + b, 0) / Math.max(paraLengths.length, 1);
    const paraVariance = paraLengths.reduce((sum, l) => sum + Math.pow(l - avgParaLength, 2), 0) / Math.max(paraLengths.length, 1);
    if (paragraphs.length >= 4) rawScore += 10;
    if (paragraphs.length >= 6) rawScore += 10;
    if (paraVariance < 200 && paragraphs.length >= 3) rawScore += 20;

    // Suspiciously calibrated tone — controversial content in diplomatic language
    const diplomaticPhrases = [
      "natural balance", "natural ownership", "shared responsibility",
      "primary responsibility", "from my side", "i don't fully align",
      "i personally feel", "i'd prefer", "i respect that",
      "find a middle ground", "both of us", "some clarity",
      "not in a rigid", "not in a forced", "runs smoothly",
      "without it feeling like", "more central role",
      "taking priority", "some adjustment",
    ];
    const diplomaticHits = diplomaticPhrases.filter(p => lower.includes(p)).length;
    if (diplomaticHits >= 2) rawScore += 20;
    if (diplomaticHits >= 4) rawScore += 20;

    // Functional word consistency across sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const stopWords = ["the", "a", "an", "it", "of", "in", "is", "was", "to", "and", "or", "but", "that", "this", "with", "for", "on", "are", "be", "as", "at", "by", "we", "i", "you", "he", "she", "they"];

    const stopWordRatios = sentences.map(s => {
      const words = s.toLowerCase().split(/\s+/);
      const stops = words.filter(w => stopWords.includes(w)).length;
      return stops / Math.max(words.length, 1);
    });

    if (stopWordRatios.length >= 3) {
      const avgRatio = stopWordRatios.reduce((a, b) => a + b, 0) / stopWordRatios.length;
      const ratioVariance = stopWordRatios.reduce((sum, r) => sum + Math.pow(r - avgRatio, 2), 0) / stopWordRatios.length;
      if (ratioVariance < 0.005) rawScore += 25;
      else if (ratioVariance < 0.01) rawScore += 15;
    }

    // Sandwich pattern — broad intro + structured middle + conclusion ending
    const introPatterns = ["i want to", "i think", "i've been", "i'd like to", "we need to", "it's important", "i'm writing"];
    const conclusionPatterns = ["i hope", "i wish you", "thank you", "i appreciate", "looking forward", "in conclusion", "to summarize", "all the best", "let me know", "feel free"];
    const hasIntro = introPatterns.some(p => lower.slice(0, 100).includes(p));
    const hasConclusion = conclusionPatterns.some(p => lower.slice(-150).includes(p));
    if (hasIntro && hasConclusion && wordCount > 60) rawScore += 20;
    if (hasIntro && hasConclusion && hasBullets) rawScore += 20;

    // Sentence length consistency — AI writes very even sentence lengths
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    if (sentenceLengths.length >= 4) {
      const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
      const lenVariance = sentenceLengths.reduce((sum, l) => sum + Math.pow(l - avgLen, 2), 0) / sentenceLengths.length;
      if (lenVariance < 10 && sentences.length >= 4) rawScore += 20;
      else if (lenVariance < 20 && sentences.length >= 6) rawScore += 10;
    }

    // Common AI n-grams not already in phrases
    const aiNgrams = [
      "it is important to note",
      "it is worth noting",
      "in this context",
      "as mentioned",
      "as previously",
      "this is because",
      "in order to",
      "due to the fact",
      "it can be seen",
      "plays a crucial role",
      "plays an important role",
      "serves as a",
      "allows us to",
      "enables us to",
      "it is essential",
      "one of the most",
      "when it comes",
      "in terms of",
      "refers to the",
    ];
    const ngramHits = aiNgrams.filter(n => lower.includes(n)).length;
    rawScore += ngramHits * 8;
    if (ngramHits >= 2) rawScore += 15;

    const finalScore = Math.min(Math.round(rawScore), 99);
    setScore(finalScore);
    setLoading(false);
    setScreen("result");
  }

  const tier = score !== null ? getTier(score) : null;

  if (screen === "result" && score !== null && tier) {
    return (
      <>
        <Nav />
        <div
          className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-8 text-center"
          style={{ paddingTop: "56px" }}
        >
          <div
            style={{
              marginBottom: "8px",
              fontSize: "13px",
              color: "#995a5a",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            AI-ness score
          </div>

          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: tier.color,
              lineHeight: 1,
              marginBottom: "4px",
              fontFamily: "inherit",
            }}
          >
            <CounterAnimation target={score} />%
          </div>

          <div style={{ fontSize: "48px", marginBottom: "8px" }}>
            {tier.weapon}
          </div>

          <h2
            className="shamer-font-display uppercase"
            style={{ fontSize: "36px", color: "#F51818", marginBottom: "12px" }}
          >
            {tier.label}
          </h2>

          <p
            style={{
              fontSize: "15px",
              color: "#444",
              maxWidth: "300px",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            {tier.desc}
          </p>

          <div
            style={{
              background: "#fff",
              border: "1.5px solid #F3AB93",
              borderRadius: "16px",
              padding: "16px",
              marginBottom: "24px",
              maxWidth: "340px",
              width: "100%",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "#995a5a",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              The offending text:
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#444",
                lineHeight: 1.7,
                fontStyle: "italic",
                textAlign: "left",
              }}
            >
              "{text.length > 120 ? text.slice(0, 120) + "..." : text}"
            </p>
          </div>

          <a
            href={`/?prefill=${encodeURIComponent(text)}`}
            className="shamer-btn-primary"
            style={{
              padding: "14px 32px",
              fontSize: "15px",
              textDecoration: "none",
              marginBottom: "12px",
              display: "block",
              width: "100%",
              maxWidth: "340px",
              textAlign: "center",
            }}
          >
            Generate Shame Link 🍅
          </a>

          <button
            onClick={() => {
              setScreen("input");
              setText("");
              setScore(null);
            }}
            className="shamer-btn-secondary"
            style={{
              padding: "12px 32px",
              fontSize: "14px",
              width: "100%",
              maxWidth: "340px",
            }}
          >
            Test another text
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div
        className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center justify-center p-8 text-center"
        style={{ paddingTop: "56px" }}
      >
        <h1
          className="shamer-font-display uppercase mb-3"
          style={{ fontSize: "64px", color: "#F51818", lineHeight: 1.0 }}
        >
          Is it even AI?
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#444",
            marginBottom: "32px",
            maxWidth: "320px",
            lineHeight: 1.7,
          }}
        >
          Paste the text in question below. <br></br>We'll tell you exactly how bad it is.
        </p>

        <div
          style={{
            background: "#fff",
            border: "2px solid #F3AB93",
            borderRadius: "24px",
            padding: "16px",
            width: "100%",
            maxWidth: "400px",
            marginBottom: "16px",
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste their message here..."
            style={{
              width: "100%",
              minHeight: "140px",
              resize: "none",
              outline: "none",
              border: "none",
              fontSize: "14px",
              fontFamily: "inherit",
              lineHeight: 1.7,
              color: "#1A1A1A",
              background: "transparent",
            }}
          />
        </div>

        <button
          onClick={handleCheck}
          disabled={!text.trim() || loading}
          className="shamer-btn-primary"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "14px",
            fontSize: "15px",
          }}
        >
          {loading ? "Sniffing for AI..." : "Check the vibe 🔍"}
        </button>

        <p style={{ fontSize: "13px", color: "#995a5a", maxWidth: "320px",  marginTop: "16px" }}>
          <strong>Pattern-based detection. Catches the obvious ones, for the sneaky ones, trust your gut.</strong>
        </p>
      </div>
    </>
  );
}
