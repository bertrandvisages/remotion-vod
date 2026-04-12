import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { createReadStream, existsSync } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join, resolve } from "node:path";
import Fastify from "fastify";

const PORT = process.env.PORT || 3100;
const RENDERS_DIR = resolve("renders");

await mkdir(RENDERS_DIR, { recursive: true });

// --------------- Bundle Remotion ---------------
console.log("Bundling Remotion project...");
const bundled = await bundle({
  entryPoint: resolve("src/index.ts"),
  webpackOverride: (config) => config,
});
console.log("Bundle ready.");

// --------------- Job store ---------------
const jobs = new Map();

// --------------- Render job ---------------
async function renderJob(jobId, props) {
  jobs.get(jobId).status = "processing";

  const outputPath = join(RENDERS_DIR, `${jobId}.mp4`);
  const fps = props.fps || 30;

  // Calculer la durée totale en frames
  const introDuration = Math.round((props.intro?.duree || 4) * fps);
  const outroDuration = Math.round((props.outro?.duree || 3) * fps);
  const segmentsDuration = (props.segments || []).reduce((acc, seg) => {
    return acc + Math.round((seg.tcOut - seg.tcIn) * fps);
  }, 0);
  const totalDuration = introDuration + segmentsDuration + outroDuration;

  try {
    const composition = await selectComposition({
      serveUrl: bundled,
      id: "FilmDestination",
      inputProps: props,
    });

    // Override la durée calculée
    composition.durationInFrames = totalDuration;
    composition.fps = fps;
    composition.width = props.width || 1920;
    composition.height = props.height || 1080;

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
    });

    jobs.get(jobId).status = "done";

    // Callback si une URL est fournie
    if (props.callbackUrl && props.filmId) {
      const publicUrl = process.env.PUBLIC_URL || `http://127.0.0.1:${PORT}`;
      fetch(props.callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmId: props.filmId,
          jobId,
          status: "done",
          downloadUrl: `${publicUrl}/render/${jobId}/download`,
        }),
      }).catch((e) => console.error("Callback error:", e));
    }
  } catch (err) {
    const job = jobs.get(jobId);
    job.status = "failed";
    job.error = err.message;
    console.error("Render error:", err);
    await unlink(outputPath).catch(() => {});

    // Callback erreur
    if (props.callbackUrl && props.filmId) {
      fetch(props.callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmId: props.filmId,
          jobId,
          status: "failed",
          error: err.message,
        }),
      }).catch(() => {});
    }
  }
}

// --------------- Fastify app ---------------
const app = Fastify({ logger: true });

// Health
app.get("/health", async () => ({ status: "ok" }));

// POST /render-film — enqueue a render job
app.post("/render-film", async (request, reply) => {
  const props = request.body || {};

  if (!props.segments || props.segments.length === 0) {
    return reply.code(400).send({ error: "'segments' is required" });
  }

  const jobId = randomUUID();
  jobs.set(jobId, { status: "pending", createdAt: new Date().toISOString() });

  // Fire and forget
  renderJob(jobId, props);

  return reply.code(202).send({ jobId });
});

// GET /render/:jobId — job status
app.get("/render/:jobId", async (request, reply) => {
  const { jobId } = request.params;
  const job = jobs.get(jobId);

  if (!job) {
    return reply.code(404).send({ error: "Job not found" });
  }

  return {
    jobId,
    status: job.status,
    createdAt: job.createdAt,
    ...(job.error && { error: job.error }),
  };
});

// GET /render/:jobId/download — stream the MP4
app.get("/render/:jobId/download", async (request, reply) => {
  const { jobId } = request.params;
  const job = jobs.get(jobId);

  if (!job || job.status !== "done") {
    return reply.code(404).send({ error: "not ready" });
  }

  const filePath = join(RENDERS_DIR, `${jobId}.mp4`);
  if (!existsSync(filePath)) {
    return reply.code(404).send({ error: "File missing" });
  }

  const stream = createReadStream(filePath);
  return reply
    .type("video/mp4")
    .header("Content-Disposition", `attachment; filename="${jobId}.mp4"`)
    .send(stream);
});

// --------------- Start ---------------
await app.listen({ port: Number(PORT), host: "0.0.0.0" });
console.log(`remotion-vod listening on :${PORT}`);
