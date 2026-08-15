import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Profile } from "./models/Profile.js";

const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/next-quest";
const CORS_ORIGIN = (
  process.env.CORS_ORIGIN ||
  "http://localhost:5173,http://localhost:5174,http://localhost:5175"
)
  .split(",")
  .map((s) => s.trim());

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (CORS_ORIGIN.includes("*")) return cb(null, true);
      if (CORS_ORIGIN.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: false,
  }),
);

const isValidProfileId = (id) =>
  typeof id === "string" && /^[a-zA-Z0-9_-]{6,64}$/.test(id);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

app.get("/api/profile/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidProfileId(id)) {
    return res.status(400).json({ error: "invalid profile id" });
  }
  const doc = await Profile.findById(id).lean();
  if (!doc) return res.status(404).json({ error: "profile not found" });
  res.json({
    id: doc._id,
    revision: doc.revision,
    displayName: doc.displayName,
    state: doc.state,
    updatedAt: doc.updatedAt,
  });
});

/**
 * Upsert profile state.
 * Body: { revision: number, state: object, displayName?: string }
 *
 * Last-write-wins by revision: the client supplies the revision it has;
 * if the server's stored revision is greater, we return 409 with the server copy
 * so the client can merge / reconcile. Otherwise we accept and bump revision.
 */
app.put("/api/profile/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidProfileId(id)) {
    return res.status(400).json({ error: "invalid profile id" });
  }

  const { revision, state, displayName } = req.body ?? {};
  if (typeof revision !== "number" || !state || typeof state !== "object") {
    return res
      .status(400)
      .json({ error: "body must include { revision: number, state: object }" });
  }

  const existing = await Profile.findById(id).lean();
  if (existing && existing.revision > revision) {
    return res.status(409).json({
      error: "stale revision",
      server: {
        id: existing._id,
        revision: existing.revision,
        displayName: existing.displayName,
        state: existing.state,
        updatedAt: existing.updatedAt,
      },
    });
  }

  const newRevision = (existing?.revision ?? 0) + 1;
  const update = {
    state,
    revision: newRevision,
    ...(displayName ? { displayName: String(displayName).slice(0, 64) } : {}),
  };

  const saved = await Profile.findByIdAndUpdate(
    id,
    { $set: update, $setOnInsert: { _id: id } },
    { new: true, upsert: true, lean: true, setDefaultsOnInsert: true },
  );

  res.json({
    id: saved._id,
    revision: saved.revision,
    displayName: saved.displayName,
    updatedAt: saved.updatedAt,
  });
});

app.delete("/api/profile/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidProfileId(id)) {
    return res.status(400).json({ error: "invalid profile id" });
  }
  await Profile.findByIdAndDelete(id);
  res.json({ ok: true });
});

// Centralized error handler so we never crash on bad JSON, etc.
app.use((err, _req, res, _next) => {
  console.error("[server error]", err);
  res.status(err.status || 500).json({
    error: err.message || "internal server error",
  });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`[next-quest-server] mongo connected → ${MONGODB_URI}`);
  } catch (err) {
    console.error("[next-quest-server] mongo connection failed:", err.message);
    console.error(
      "Is mongod running? Try: `brew services start mongodb-community`",
    );
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[next-quest-server] listening on http://localhost:${PORT}`);
    console.log(`[next-quest-server] CORS allowed: ${CORS_ORIGIN.join(", ")}`);
  });
}

start();
