# Deployment Talimatları

## Backend (Render.com) ✅

Backend zaten deploy edildi: **https://revecanvas.onrender.com**

## Frontend (Netlify veya Cloudflare Pages)

### Adım 1: Build Alın

```bash
npm run build
```

Bu komut `dist/public` klasörünü oluşturacak.

### Adım 2: Netlify'a Deploy

#### Option A: Netlify CLI ile
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/public
```

#### Option B: Netlify UI ile
1. https://app.netlify.com/ adresine gidin
2. "Add new site" > "Deploy manually"
3. `dist/public` klasörünü sürükleyip bırakın

### Adım 3: Environment Variable Ekleyin (Opsiyonel)

Eğer backend URL'ini değiştirmek isterseniz:

**Netlify'da:**
1. Site Settings > Environment Variables
2. Yeni variable ekleyin:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://revecanvas.onrender.com`
3. Site'i yeniden deploy edin

**Cloudflare Pages'te:**
1. Settings > Environment Variables
2. Production variable ekleyin:
   - Variable name: `VITE_BACKEND_URL`
   - Value: `https://revecanvas.onrender.com`
3. Yeniden deploy edin

### Adım 4: Test Edin

1. Deploy edilen site URL'inizi açın
2. FAL.ai API key'inizi girin
3. Bir prompt ile resim oluşturun
4. Backend'in çalıştığını doğrulayın

## Önemli Notlar

⚠️ **CORS Sorunu Olursa:**

Backend'de (Render.com) environment variable ekleyin:
- Key: `ALLOWED_ORIGINS`
- Value: `https://your-netlify-site.netlify.app`

Sonra backend'i yeniden deploy edin.

⚠️ **Render Free Tier:**

- İlk istek 30-60 saniye sürebilir (backend uyanıyor)
- 15 dakika aktivite yoksa sleep moduna geçer
- Bu normal bir durumdur, sabırlı olun

## Başarılı Deploy Kontrolü

✅ Frontend Netlify/Cloudflare'de çalışıyor  
✅ Backend Render.com'da çalışıyor  
✅ API istekleri backend'e gidiyor  
✅ Resim üretimi çalışıyor  

Tebrikler! 🎉
