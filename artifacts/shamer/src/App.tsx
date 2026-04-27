import { Switch, Route, Router as WouterRouter, useParams } from "wouter";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import Sender from "@/pages/Sender";
import Receiver from "@/pages/Receiver";
import Story from "@/pages/Story";
import AIDetector from "@/pages/AIDetector";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FCF4F0" }}>
      <div className="text-center">
        <h1 style={{ fontSize: "48px", color: "#F51818", fontFamily: "chauncy-pro, Georgia, serif" }}>404</h1>
        <p style={{ color: "#666" }}>Page not found.</p>
        <a href="/" style={{ color: "#ad0d00", textDecoration: "underline", fontSize: "14px" }}>Go home</a>
      </div>
    </div>
  );
}

function ShameRedirect() {
  const { id } = useParams();
  useEffect(() => {
    async function resolve() {
      const { data } = await supabase
        .from("shames")
        .select("*")
        .eq("id", id)
        .single();
      if (!data) {
        window.location.href = "/";
        return;
      }
      const t = btoa(encodeURIComponent(data.message));
      const w = encodeURIComponent(data.weapon);
      window.location.href = `/shame?t=${t}&w=${w}`;
    }
    resolve();
  }, [id]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FCF4F0" }}>
      <p style={{ color: "#666", fontSize: "14px" }}>Loading...</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Sender} />
      <Route path="/shame" component={Receiver} />
      <Route path="/story" component={Story} />
      <Route path="/test" component={AIDetector} />
      <Route path="/s/:id" component={ShameRedirect} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;