// ConteniQ - Cloudflare Worker
// Deploy: cd conteniq && wrangler deploy

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    // /api/generate — AI içerik üretimi
    if (path === "/api/generate" && request.method === "POST") {
      try {
        const body = await request.json();
        const apiKey = request.headers.get("X-Api-Key") || env.ANTHROPIC_API_KEY;
        if (!apiKey) return Response.json({ error: "API key gerekli" }, { status: 400, headers: cors });

        const { sector, city, goal, audience, detail, hasVideo } = body;

        const prompt = `Sen Türkiye pazarında uzman, yüksek dönüşüm odaklı bir sosyal medya stratejisti ve kısa video (Reels/TikTok) içerik üretim uzmanısın.

Kullanıcı bilgileri:
- Sektör: ${sector}
- Şehir: ${city || "Türkiye"}
- Hedef: ${goal}
- Hedef Kitle: ${audience || "genel"}
${detail ? "- Detay: " + detail : ""}
- Video: ${hasVideo ? "Video var" : "Video yok"}

7 adet Reels içeriği üret. SADECE JSON:
{"meta":{"sector":"${sector}","city":"${city||"Türkiye"}","goal":"${goal}"},"contents":[{"num":1,"angle":"tema","hook":"max 10 kelime hook","video_flow":[{"scene":1,"desc":"Hook sahnesi","duration":"0-3sn"},{"scene":2,"desc":"Problem","duration":"3-8sn"},{"scene":3,"desc":"Değer","duration":"8-15sn"},{"scene":4,"desc":"Kanıt","duration":"15-22sn"},{"scene":5,"desc":"CTA","duration":"22-27sn"}],"script":"max 100 kelime script","subtitles":[{"text":"altyazı 1","highlight":["VURGU"]},{"text":"altyazı 2","highlight":["KELIME"]}],"trigger":"aciliyet mesajı","cta":"tek aksiyon","caption":"2-3 cümle","hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5"]}]}

7 içerik üret, hepsi farklı açıdan, sektöre özel, Türkçe.`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, messages: [{ role: "user", content: prompt }] }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        const raw = data.content.map(x => x.text || "").join("");
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        return Response.json(parsed, { headers: cors });
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: cors });
      }
    }

    // /api/transcribe — Whisper
    if (path === "/api/transcribe" && request.method === "POST") {
      try {
        const apiKey = request.headers.get("X-Api-Key") || env.OPENAI_API_KEY;
        if (!apiKey) return Response.json({ error: "OpenAI API key gerekli" }, { status: 400, headers: cors });
        const formData = await request.formData();
        const audioBlob = formData.get("audio");
        const wf = new FormData();
        wf.append("file", audioBlob, "audio.webm");
        wf.append("model", "whisper-1");
        wf.append("language", "tr");
        wf.append("response_format", "verbose_json");
        wf.append("timestamp_granularities[]", "word");
        const wr = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST", headers: { "Authorization": "Bearer " + apiKey }, body: wf,
        });
        const wd = await wr.json();
        return Response.json(wd, { headers: cors });
      } catch (e) {
        return Response.json({ error: e.message, words: [] }, { status: 500, headers: cors });
      }
    }

    if (path === "/api/health") return Response.json({ ok: true }, { headers: cors });
    return new Response("Not found", { status: 404 });
  },
};
