import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// This intercepts /s/:id before React loads
app.get("/s/:id", async (req, res) => {
  const { id } = req.params;

  // Pick a random disguise
  const disguises = [
    {
      title: "Someone shared a playlist with you 🎵",
      description: "This made me think of you",
      image: "/previews/spotify.jpg"
    },
    {
      title: "You have a new voicemail",
      description: "Tap to listen",
      image: "/previews/voicemail.jpg"
    },
    {
      title: "Someone sent you a note 📝",
      description: "Open to read it",
      image: "/previews/note.jpg"
    },
    {
      title: "You've been mentioned in a photo",
      description: "See who tagged you",
      image: "/previews/photo.jpg"
    }
  ];

  const d = disguises[Math.floor(Math.random() * disguises.length)];

  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="${d.title}" />
  <meta property="og:description" content="${d.description}" />
  <meta property="og:image" content="${d.image}" />
  <meta property="og:url" content="${req.url}" />
  <meta http-equiv="refresh" content="0;url=/shame?id=${id}" />
</head>
<body>Loading...</body>
</html>`);
});

app.listen(3000);