# 💖 Sonsuzluk & Biz - Çiftlere Özel Web Projesi

Bu proje, çiftlerin ilişkilerini dijital bir ortamda ölümsüzleştirmesi, anılarını saklaması ve birbirlerine özel mesajlar bırakabilmesi için tasarlanmış, **Yönetim Panelli (Admin Panel)** modern bir web uygulamasıdır.

Projeye dilediğiniz gibi anı ekleyebilir, renklerini değiştirebilir ve partnerinize sürpriz Push bildirimler gönderebilirsiniz.

## ✨ Özellikler

* ⏳ **Canlı İlişki Sayacı:** Ne zamandır birlikte olduğunuzu saniye saniye takip eden animasyonlu sayaç.
* 📖 **Zaman Çizelgesi (Hikaye Modu):** Birlikte geçirdiğiniz özel günleri tarih, fotoğraf ve notlarla ekleyebileceğiniz hikaye alanı.
* 📸 **Kategorize Edilebilir Galeri:** Fotoğraflarınızı "Doğum Günü", "Tatil" gibi kategorilere ayırarak polaroid tarzı kartlarda sergileyebileceğiniz anı arşivi.
* 💌 **Sürpriz Zarf (Özel Mesaj):** Üzerine tıklandığında açılan ve anlık olarak güncelleyebileceğiniz romantik gizli not alanı.
* 🔔 **Push Bildirimleri:** Arka planda çalışan sistem sayesinde, siteye yeni bir anı eklendiğinde veya partnerinize manuel bir bildirim atmak istediğinizde cihaza uyarı gönderimi.
* ⚙️ **Gelişmiş Yönetici Paneli:**
    * Tam yetkili (Master) ve sınırlı yetkili (Editor) olmak üzere çift kademeli şifreli giriş.
    * Sitenin ana renklerini, yazı tiplerini ve metinlerini anlık olarak değiştirme imkanı.
    * Vitrin alanını aktif edip kapatabilme.
* 📱 **Tam Mobil Uyumluluk & PWA:** Telefonlarda kusursuz görünür ve ana ekrana uygulama gibi eklenebilir. Kaydırma (swipe) hareketleriyle menüler arası geçiş desteklenir.

## 🛠 Kullanılan Teknolojiler

* **Frontend:** HTML5, CSS3 (Glassmorphism UI), Vanilla JavaScript
* **Veritabanı:** Firebase Realtime Database
* **Görsel Sunucusu:** ImgBB API (Otomatik görsel yükleme)
* **Bildirim Sistemi:** OneSignal REST API & Service Workers

## 🚀 Kurulum ve Ayarlar

Projeyi kendi ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Dosyaları İndirin
Projeyi bilgisayarınıza indirin veya forklayın.

### 2. Firebase Kurulumu
1. [Firebase Console](https://console.firebase.google.com/)'a gidin ve yeni bir proje oluşturun.
2. **Realtime Database** oluşturun ve test modunda (veya kurallarını güvenliğe uygun şekilde ayarlayarak) başlatın.
3. Proje ayarlarınızdan web uygulamanızın **Config (API) bilgilerini** alın.
4. İndirdiğiniz projedeki `admin.js`, `script.js` ve `sw.js` dosyalarını açın ve `firebaseConfig` değişkenini kendi bilgilerinizle güncelleyin.

### 3. ImgBB API Entegrasyonu (Fotoğraf Yükleme İçin)
1. [ImgBB](https://api.imgbb.com/) sitesinden ücretsiz bir API anahtarı alın.
2. `admin.js` dosyasının en üstündeki `IMGBB_API_KEY` değişkenine bu anahtarı yapıştırın.

### 4. OneSignal Kurulumu (Bildirimler İçin)
1. [OneSignal](https://onesignal.com/) üzerinde yeni bir Web Push uygulaması oluşturun.
2. Size verilen **APP ID** ve **REST API KEY** bilgilerini `admin.js` dosyasının en üstündeki ilgili değişkenlere yapıştırın.

### 5. Varsayılan Şifreler
Sistemi ilk kez kurduğunuzda varsayılan erişim bilgileri şu şekildedir (Admin panelinden `Sistem Ayarları` sekmesinden değiştirebilirsiniz):

* **Sitenin Ana Giriş Şifresi:** `14531453`
* **Tam Yetkili Admin Şifresi:** `admin1453`
* **İçerik Editörü Şifresi:** `121212` (Sadece fotoğraf ve yazı yazabilir.)

## 👨‍💻 Geliştirici
Bu proje, modern web tasarım trendleri olan **Dark Mode**, **Glassmorphism** ve **Neon Efektleri** kullanılarak saf (Vanilla) JavaScript ile geliştirilmiştir. API'ler ile hiçbir backend (sunucu tarafı) koduna ihtiyaç duymadan kendi başına dinamik olarak çalışır.
