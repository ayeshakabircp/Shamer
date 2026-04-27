import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_KEY!
);

const disguises = [
  {
    title: "Someone shared a playlist with you 🎵",
    description: "This made me think of you",
  },
  {
    title: "You have a new voicemail 📱",
    description: "Tap to listen",
  },
  {
    title: "Someone sent you a note 📝",
    description: "Open to read it",
  },
  {
    title: "You've been mentioned in a photo",
    description: "See who tagged you",
  },
];

router.get("/s/:id", async (req, res) => {
  const { id } = req.params;

  const { data } = await supabase
    .from("shames")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    res.redirect("/");
    return;
  }

  const d = disguises[Math.floor(Math.random() * disguises.length)];
  const t = btoa(encodeURIComponent(data.message));
  const w = encodeURIComponent(data.weapon);
  const shameUrl = `/shame?t=${t}&w=${w}`;

  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta property="og:title" content="${d.title}" />
  <meta property="og:description" content="${d.description}" />
  <meta property="og:type" content="website" />
  <meta http-equiv="refresh" content="0;url=${shameUrl}" />
  <title>${d.title}</title>
</head>
<body>
  <script>window.location.href = "${shameUrl}"</script>
</body>
</html>`);
});

export default router;