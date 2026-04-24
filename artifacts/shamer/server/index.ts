import express from "express";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_KEY!
);

const disguises = [
  {
    title: "Someone shared a playlist with you 🎵",
    description: "This made me think of you",
    image: "/previews/music.jpg"
  },
  {
    title: "I challenge you to beat my highscore! 📱",
    description: "Tap to play",
    image: "/previews/quickplay.jpg"
  },
  {
    title: "Someone sent you a note on BigNotes 📝",
    description: "Open to read it",
    image: "/previews/note.jpg"
  },
  {
    title: "You've been mentioned in a photo",
    description: "See who tagged you",
    image: "/previews/photo.jpg"
  },
];

app.get("/s/:id", async (req, res) => {
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
  const shameUrl = `/shame?t=${btoa(encodeURIComponent(data.message))}&w=${encodeURIComponent(data.weapon)}`;

  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta property="og:title" content="${d.title}" />
  <meta property="og:description" content="${d.description}" />
  <meta property="og:image" content="${d.image}" />
  <meta property="og:type" content="website" />
  <meta http-equiv="refresh" content="0;url=${shameUrl}" />
  <title>${d.title}</title>
</head>
<body>
  <script>window.location.href = "${shameUrl}"</script>
</body>
</html>`);
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));