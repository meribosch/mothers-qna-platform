import express from "express";
import cors from "cors";
import "dotenv/config";

console.log("DEBUG SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("📡 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔐 SUPABASE_KEY:", process.env.SUPABASE_ANON_KEY?.slice(0, 20) + "...");

import { createClient } from "@supabase/supabase-js";

const app = express();

// Middleware para extraer el usuario desde el token Authorization
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);
    if (data?.user) {
      req.user = data.user;
    }
  }
  next();
});


app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
});


app.post("/comments", async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Usuario no autenticado" });

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Comentario vacío" });

  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    content: content,
  });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Comentario guardado con éxito" });
});

app.get("/comments", async (req, res) => {
  const { data, error } = await supabase
    .from("comments")
    .select("content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

app.listen(3000, () => {
  console.log("✅ Servidor corriendo en http://localhost:3000");
});
