# ConteniQ Pro — Kurulum Rehberi

## 5 Adımda Canlıya Al (Ücretsiz)

### Adım 1: Hesaplar
- **Anthropic**: https://console.anthropic.com → API key al (sk-ant-...)
- **GitHub**: https://github.com → ücretsiz hesap
- **Cloudflare**: https://cloudflare.com → ücretsiz hesap

### Adım 2: GitHub'a yükle
1. GitHub'da "New repository" → `conteniq` adıyla oluştur
2. Bu klasördeki TÜM dosyaları sürükle-bırak ile yükle
3. "Commit changes" tıkla

### Adım 3: Cloudflare Pages (Frontend)
1. dash.cloudflare.com → **Pages** → "Create a project"
2. "Connect to Git" → GitHub hesabını bağla
3. `conteniq` reposunu seç
4. Build settings:
   - Build command: (boş bırak)
   - Output directory: (boş bırak)
5. **Deploy** tıkla
6. 2 dakikada `https://conteniq.pages.dev` gibi URL alırsın

### Adım 4: Cloudflare Workers (API)
1. dash.cloudflare.com → **Workers & Pages** → "Create"
2. "Create Worker" → isim: `conteniq-api`
3. Worker kodunu aç → worker.js içeriğini yapıştır → Deploy
4. Worker URL'ini kopyala: `https://conteniq-api.YOUR.workers.dev`

### Adım 5: URL'i bağla
`index.html` dosyasını aç, üst kısmı bul:
```js
const WORKER_URL = window.location.hostname === "localhost"
  ? "http://localhost:8787"
  : "";  // ← buraya worker URL'ini yaz
```
Şöyle yap:
```js
  : "https://conteniq-api.YOUR.workers.dev"
```
GitHub'a push → Cloudflare otomatik deploy eder.

## Kullanım
1. Siteye git
2. Anthropic API key'ini gir (sadece senin tarayıcında kalır)
3. Sektörü seç → 7 İçerik Üret
4. Video yükle → 🎙️ Sesi Yazıya Çevir (Whisper)
5. İçerik seç → Videoyu İşle & İndir

## Özellikler
- ✅ AI ile 7 profesyonel Reels içeriği
- ✅ Whisper ile ses → kelime zamanlamalı altyazı
- ✅ 9:16 / 1:1 / 16:9 otomatik kırpma
- ✅ Hook overlay (ilk 3sn)
- ✅ Kelime kelime senkronize altyazı
- ✅ CTA gradient pill (son 5sn)
- ✅ 6 altyazı stili
- ✅ Tüm içerikleri kopyala/indir

## Maliyet: SIFIR
- Cloudflare Pages: Ücretsiz (sınırsız)
- Cloudflare Workers: Ücretsiz (100k istek/gün)
- API key: Kendi Anthropic key'in (kullandıkça öde)
