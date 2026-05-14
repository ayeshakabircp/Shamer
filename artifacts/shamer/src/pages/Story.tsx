import "../shamer.css";

function Nav() {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: "56px", display: "flex", alignItems: "center", padding: "0 24px", background: "transparent", zIndex: 1000 }}>
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
      <div className="shamer-bg min-h-screen flex flex-col items-center justify-center" style={{ paddingTop: "100px", paddingBottom: "40px" }}>
        <img
          src="/My_Story.png"
          alt="My Story"
          style={{ width: "100%", maxWidth: "min(90vh, 1000px)", height: "auto", display: "block", margin: "0 auto" }}
        />
        <button
          onClick={() => setScreen("builder")}
          className="shamer-btn-primary"
          style={{ width: "auto", minWidth: "280px", padding: "16px 48px", fontSize: "18px" }}
        >
          Shame someone 🍅
        </button>
      </div>
    </>
  );
}