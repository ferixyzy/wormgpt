# Luna Chat — GPT-5.6 Luna

Aplikasi chat AI bergaya ChatGPT web, dibangun dengan Next.js (App Router) + Tailwind CSS.

## Fitur
- Layout ChatGPT-style: sidebar percakapan, area chat, input besar di bawah.
- Streaming jawaban token-by-token.
- Markdown lengkap: heading, list, tabel, blockquote, code block dengan syntax highlight + tombol salin.
- Dark / light mode (tersimpan di localStorage).
- Riwayat percakapan tersimpan di localStorage browser.
- Sidebar jadi drawer di mobile, responsive penuh.

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env
# isi AI_API_BASE_URL, AI_API_KEY, AI_MODEL di .env
npm run dev
```

Buka http://localhost:3000

## Menghubungkan model AI

Route backend ada di `app/api/chat/route.ts`. Route ini memanggil endpoint
**OpenAI-compatible** apa pun (`POST {AI_API_BASE_URL}/chat/completions`) dengan
`stream: true`, lalu meneruskan token yang masuk langsung ke browser.

Isi `.env`:

```
AI_API_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

Provider apa pun yang kompatibel dengan format `/v1/chat/completions` OpenAI
bisa dipakai (OpenAI, Groq, Together AI, OpenRouter, server lokal
vLLM/Ollama/LM Studio, dsb). Nama "GPT-5.6 Luna" yang tampil di UI adalah
branding tampilan saja (`lib/types.ts` → `MODEL_DISPLAY_NAME`), tidak terikat
pada provider tertentu.

> ⚠️ Catatan: hindari layanan "gateway" yang mengklaim mengakses ChatGPT/Claude/dll
> lewat *browser cookies* / sesi web (bukan API resmi). Ini melanggar syarat
> layanan provider terkait dan berisiko akun/API key kamu diblokir atau
> datamu disalahgunakan.

## Deploy ke Vercel

1. Push folder ini ke repo GitHub (atau upload langsung).
2. Import project di [vercel.com/new](https://vercel.com/new).
3. Set Environment Variables di dashboard Vercel: `AI_API_BASE_URL`, `AI_API_KEY`, `AI_MODEL`.
4. Deploy — selesai.

Atau via CLI:

```bash
npm i -g vercel
vercel
```

## Struktur proyek

```
app/
  api/chat/route.ts   # backend streaming proxy ke provider AI
  layout.tsx
  page.tsx            # state utama: conversations, streaming, dsb
  globals.css
components/
  Sidebar.tsx
  Header.tsx
  ChatArea.tsx
  ChatInput.tsx
  Message.tsx
  CodeBlock.tsx
  TypingIndicator.tsx
  Icons.tsx
lib/
  types.ts
  storage.ts
```
