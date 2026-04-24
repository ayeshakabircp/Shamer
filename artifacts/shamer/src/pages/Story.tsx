import "../shamer.css";

function Nav() {
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "56px",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      background: "transparent",
      zIndex: 1000,
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
        <span style={{ fontSize: "20px" }}>🍅</span>
        <span className="shamer-font-display" style={{ fontSize: "24px", color: "#F51818" }}>SHAMER</span>
      </a>
    </nav>
  );
}

export default function Story() {
  return (
    <>
      <Nav />
      <div
        className="shamer-font-body shamer-bg min-h-screen flex flex-col items-center p-10"
        style={{ paddingTop: "80px", maxWidth: "600px", margin: "0 auto" }}
      >
        <h1
          className="shamer-font-display uppercase mb-8 text-center"
          style={{ fontSize: "52px", color: "#F51818", lineHeight: 1.0 }}
        >
          Things Got Personal.
        </h1>

        <div style={{ fontSize: "16px", color: "#444", lineHeight: 1.9, textAlign: "left" }}>
          <p style={{ marginBottom: "20px" }}>
            In the aftermath of having received long GPT texts in what was supposed to be a personal conversation, this thought kept bugging me “I should’ve called them out”. 
          </p>

          <p style={{ marginBottom: "20px" }}>
            Reading yet another “Claude just killed xxxx” post was my final straw, I had seen my fair share of recycled AI thoughts on LinkedIn by then. And I remembered the growing influx of Instagram reels that my algo is so kindly pushing, people talking about their dating app horror stories of AI generated bios, photos and texts.  
          </p>

          <p style={{ marginBottom: "20px" }}>
            They were donnee and so am I.
          </p>

          <p style={{ marginBottom: "20px" }}>
            <strong>This 👏 must 👏 end.</strong>
          </p>

          <p style={{ marginBottom: "20px" }}>
            So Shamer was born. My very own AI built AI shamer.
            A fun, lighthearted (but very much ill-intentioned)
            way to call it out. Get your link. Rick roll your misuser into clicking it.
            Let the tomatoes fly.
          </p>

          <p style={{ marginBottom: "40px" }}>
            Have fun.
          </p>

        </div>

        <a
          href="/"
          className="shamer-btn-primary"
          style={{ marginTop: "48px", padding: "14px 32px", fontSize: "15px", textDecoration: "none" }}
        >
          Call 👏 them 👏 out
        </a>

      </div>
    </>
  );
}