const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY_HERE"; 
const ONESIGNAL_APP_ID = "YOUR_ONESIGNAL_APP_ID_HERE";
const ONESIGNAL_REST_API_KEY = "YOUR_ONESIGNAL_REST_API_KEY_HERE";
const ONESIGNAL_API_URL = "https://api.codetabs.com/v1/proxy?quest=https://onesignal.com/api/v1/notifications";

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASE_URL",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const placeholderStory = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231a1a24%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23e2e2e2%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EGorsel%20Bekleniyor...%3C%2Ftext%3E%3C%2Fsvg%3E";
const placeholderGallery = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231a1a24%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23e2e2e2%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EGorsel%20Bekleniyor...%3C%2Ftext%3E%3C%2Fsvg%3E";

function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMsg");
    const icon = toast.querySelector("i");
    toastMsg.innerText = message;
    if(isError) {
        toast.style.borderLeftColor = "#ff3b6b";
        icon.className = "fa-solid fa-circle-xmark";
        icon.style.color = "#ff3b6b";
    } else {
        toast.style.borderLeftColor = "#4ade80";
        icon.className = "fa-solid fa-circle-check";
        icon.style.color = "#4ade80";
    }
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 3000);
}

async function sendAutomaticNotification(title, message) {
    if (!ONESIGNAL_APP_ID || ONESIGNAL_APP_ID.includes("HERE")) return; 
    try {
        await fetch(ONESIGNAL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + ONESIGNAL_REST_API_KEY
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                included_segments: ["Subscribed Users"], 
                headings: { "en": title, "tr": title },
                contents: { "en": message, "tr": message }
            })
        });
    } catch (error) {
        console.error(error);
    }
}

async function uploadImageToImgBB(file) {
    if(!IMGBB_API_KEY || IMGBB_API_KEY.includes("HERE")) {
        throw new Error("ImgBB API Anahtari eksik.");
    }
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
    });
    const data = await response.json();
    if(data.success) return data.data.url;
    else throw new Error(data.error.message);
}

window.deleteStory = function(key) {
    if(confirm("Silmek istediginize emin misiniz?")) {
        database.ref('stories/' + key).remove().then(() => showToast("Silindi!"));
    }
}
window.deleteGallery = function(key) {
    if(confirm("Silmek istediginize emin misiniz?")) {
        database.ref('gallery/' + key).remove().then(() => showToast("Silindi!"));
    }
}
window.deleteCategory = function(key) {
    if(confirm("Silmek istediginize emin misiniz?")) {
        database.ref('categories/' + key).remove().then(() => showToast("Silindi!"));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const adminAuthScreen = document.getElementById("admin-auth-screen");
    const adminPassInput = document.getElementById("admin-password");
    const adminAuthBtn = document.getElementById("admin-auth-btn");
    const adminAuthError = document.getElementById("admin-auth-error");

    database.ref('settings/passwords').once('value').then((snapshot) => {
        const passwords = snapshot.val() || {};
        const correctAdminPass = passwords.admin || "admin1453"; 
        const correctEditorPass = passwords.editor || "121212";  

        adminAuthBtn.addEventListener("click", () => {
            const girilenSifre = adminPassInput.value.trim();

            if (girilenSifre === correctAdminPass) {
                document.querySelectorAll(".master-only").forEach(el => el.style.display = "");
                adminAuthScreen.style.opacity = "0";
                setTimeout(() => { adminAuthScreen.style.display = "none"; }, 500);
            } 
            else if (girilenSifre === correctEditorPass) {
                document.querySelectorAll(".master-only").forEach(el => el.style.display = "none");
                adminAuthScreen.style.opacity = "0";
                setTimeout(() => { adminAuthScreen.style.display = "none"; }, 500);
                showToast("Editor Modu");
            } 
            else {
                adminAuthError.style.display = "block";
                adminPassInput.value = "";
            }
        });

        adminPassInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") adminAuthBtn.click();
        });
    });

    document.getElementById("sitePass").value = "14531453";
    document.getElementById("adminPass").value = "admin1453";
    const editorPassInput = document.getElementById("editorPass");
    if(editorPassInput) editorPassInput.value = "121212";
    
    document.getElementById("themeColor").value = "#ff3b6b";
    document.getElementById("themeBg1").value = "#1c0a11";
    document.getElementById("themeBg2").value = "#260e17";
    document.getElementById("themeFont").value = "'Great Vibes', cursive";
    document.getElementById("themeTitle").value = "Seninle Her Saniye";
    document.getElementById("themeSubtitle").value = "Karanlığımı aydınlatan en güzel yıldızsın.";
    document.getElementById("themeLoader").value = "Aşk Yükleniyor...";
    document.getElementById("themeTimer").value = "2023-02-14T00:00";

    database.ref('settings').once('value').then((snapshot) => {
        const settings = snapshot.val();
        if(settings) {
            if(settings.passwords) {
                if(settings.passwords.site) document.getElementById("sitePass").value = settings.passwords.site;
                if(settings.passwords.admin) document.getElementById("adminPass").value = settings.passwords.admin;
                if(settings.passwords.editor && editorPassInput) editorPassInput.value = settings.passwords.editor;
            }
            if(settings.theme) {
                if(settings.theme.color) document.getElementById("themeColor").value = settings.theme.color;
                if(settings.theme.bg1) document.getElementById("themeBg1").value = settings.theme.bg1;
                if(settings.theme.bg2) document.getElementById("themeBg2").value = settings.theme.bg2;
                if(settings.theme.font) document.getElementById("themeFont").value = settings.theme.font;
                if(settings.theme.title) document.getElementById("themeTitle").value = settings.theme.title;
                if(settings.theme.subtitle) document.getElementById("themeSubtitle").value = settings.theme.subtitle;
                if(settings.theme.loader) document.getElementById("themeLoader").value = settings.theme.loader;
            }
            if(settings.timer && settings.timer.startDate) {
                document.getElementById("themeTimer").value = settings.timer.startDate;
            }
            if(settings.highlight) {
                document.getElementById("hlActive").checked = settings.highlight.active || false;
                document.getElementById("hlImg").value = settings.highlight.img || "";
                document.getElementById("hlText").value = settings.highlight.text || "";
            }
        }
    });

    const navBtns = document.querySelectorAll(".nav-btn[data-tab]");
    const tabContents = document.querySelectorAll(".tab-content");

    navBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            navBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const target = btn.getAttribute("data-tab");
            tabContents.forEach(tab => tab.classList.remove("active"));
            document.getElementById(target).classList.add("active");
        });
    });

    const storyImgInput = document.getElementById("storyImg");
    if(storyImgInput) storyImgInput.addEventListener("input", function() { document.getElementById("storyPreview").src = this.value || placeholderStory; });
    
    const galleryImgInput = document.getElementById("galleryImg");
    if(galleryImgInput) galleryImgInput.addEventListener("input", function() { document.getElementById("galleryPreview").src = this.value || placeholderGallery; });
    
    const galleryCaptionInput = document.getElementById("galleryCaption");
    if(galleryCaptionInput) galleryCaptionInput.addEventListener("input", function() { document.getElementById("galleryCaptionPreview").innerText = this.value || "Notunuz burada görünecek"; });
    
    const noteTextInput = document.getElementById("noteText");
    if(noteTextInput) noteTextInput.addEventListener("input", function() { document.getElementById("notePreview").innerText = this.value || "Yazınız burada belirecek..."; });

    const storyFileInput = document.getElementById('storyFile');
    if(storyFileInput) {
        storyFileInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if(!file) return;
            const btn = document.getElementById('storyUploadBtn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";
            try {
                const downloadURL = await uploadImageToImgBB(file);
                document.getElementById('storyImg').value = downloadURL;
                document.getElementById('storyPreview').src = downloadURL;
                showToast("Yüklendi");
            } catch (error) { showToast(error.message, true); }
            btn.innerHTML = originalHTML;
        });
    }

    const galleryFileInput = document.getElementById('galleryFile');
    if(galleryFileInput) {
        galleryFileInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if(!file) return;
            const btn = document.getElementById('galleryUploadBtn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";
            try {
                const downloadURL = await uploadImageToImgBB(file);
                document.getElementById('galleryImg').value = downloadURL;
                document.getElementById('galleryPreview').src = downloadURL;
                showToast("Yüklendi");
            } catch (error) { showToast(error.message, true); }
            btn.innerHTML = originalHTML;
        });
    }

    document.getElementById("storyForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const btn = this.querySelector(".submit-btn");
        const originalText = btn.innerHTML;
        btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";
        const newStory = { title: document.getElementById("storyTitle").value, date: document.getElementById("storyDate").value, img: document.getElementById("storyImg").value, desc: document.getElementById("storyDesc").value, timestamp: Date.now() };
        
        database.ref('stories').push(newStory).then(() => { 
            this.reset(); 
            document.getElementById("storyPreview").src = placeholderStory; 
            showToast("Basarili"); 
            btn.innerHTML = originalText; 
            sendAutomaticNotification("Yeni Anı! 💖", newStory.title);
        }).catch(error => { showToast(error.message, true); btn.innerHTML = originalText; });
    });

    document.getElementById("galleryForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const btn = this.querySelector(".submit-btn");
        const originalText = btn.innerHTML;
        btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";
        const newPhoto = { category: document.getElementById("galleryCategory").value, img: document.getElementById("galleryImg").value, caption: document.getElementById("galleryCaption").value, timestamp: Date.now() };
        
        database.ref('gallery').push(newPhoto).then(() => { 
            this.reset(); 
            document.getElementById("galleryPreview").src = placeholderGallery; 
            document.getElementById("galleryCaptionPreview").innerText = ""; 
            showToast("Basarili"); 
            btn.innerHTML = originalText; 
            sendAutomaticNotification("Yeni Fotoğraf! 📸", newPhoto.caption);
        }).catch(error => { showToast(error.message, true); btn.innerHTML = originalText; });
    });

    document.getElementById("noteForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const btn = this.querySelector(".submit-btn");
        const originalText = btn.innerHTML;
        btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";
        const newNoteMsg = document.getElementById("noteText").value;
        
        database.ref('specialNote').set({ message: newNoteMsg, timestamp: Date.now() }).then(() => { 
            this.reset(); 
            document.getElementById("notePreview").innerText = ""; 
            showToast("Basarili"); 
            btn.innerHTML = originalText; 
            sendAutomaticNotification("Yeni Not! ✉️", newNoteMsg);
        }).catch(error => { showToast(error.message, true); btn.innerHTML = originalText; });
    });

    document.getElementById("passForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const passData = { 
            site: document.getElementById("sitePass").value, 
            admin: document.getElementById("adminPass").value 
        };
        const editorInput = document.getElementById("editorPass");
        if(editorInput) passData.editor = editorInput.value;
        database.ref('settings/passwords').set(passData).then(() => { showToast("Guncellendi"); });
    });

    document.getElementById("themeForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const themeData = {
            color: document.getElementById("themeColor").value,
            bg1: document.getElementById("themeBg1").value,
            bg2: document.getElementById("themeBg2").value,
            font: document.getElementById("themeFont").value,
            title: document.getElementById("themeTitle").value,
            subtitle: document.getElementById("themeSubtitle").value,
            loader: document.getElementById("themeLoader").value
        };
        const timerData = { startDate: document.getElementById("themeTimer").value };
        database.ref('settings/theme').set(themeData);
        database.ref('settings/timer').set(timerData).then(() => { showToast("Uygulandı"); });
    });

    const highlightForm = document.getElementById("highlightForm");
    if(highlightForm) {
        highlightForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const btn = this.querySelector(".submit-btn");
            const originalText = btn.innerHTML;
            btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";

            const hlData = {
                active: document.getElementById("hlActive").checked,
                img: document.getElementById("hlImg").value,
                text: document.getElementById("hlText").value
            };

            database.ref('settings/highlight').set(hlData).then(() => {
                showToast("Güncellendi");
                btn.innerHTML = originalText;
            }).catch(error => { showToast(error.message, true); btn.innerHTML = originalText; });
        });
    }

    document.getElementById("resetThemeBtn").addEventListener("click", () => {
        if(confirm("Sifirlansin mi?")) {
            const defaultTheme = { color: "#ff3b6b", bg1: "#1c0a11", bg2: "#260e17", font: "'Great Vibes', cursive", title: "Seninle Her Saniye", subtitle: "Karanlığımı aydınlatan en güzel yıldızsın.", loader: "Aşk Yükleniyor..." };
            const defaultPass = { site: "14531453", admin: "admin1453", editor: "121212" };
            const defaultTimer = { startDate: "2023-02-14T00:00" };
            database.ref('settings/theme').set(defaultTheme);
            database.ref('settings/timer').set(defaultTimer);
            database.ref('settings/passwords').set(defaultPass).then(() => {
                showToast("Sıfırlandı");
                setTimeout(() => { location.reload(); }, 1500);
            });
        }
    });

    const customNotifForm = document.getElementById("customNotifForm");
    if(customNotifForm) {
        customNotifForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const btn = this.querySelector(".submit-btn");
            const originalText = btn.innerHTML;
            btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i>";

            const title = document.getElementById("notifTitle").value;
            const message = document.getElementById("notifBody").value;

            if (!ONESIGNAL_APP_ID || ONESIGNAL_APP_ID.includes("HERE")) {
                showToast("Eksik Key", true);
                btn.innerHTML = originalText;
                return;
            }

            try {
                const response = await fetch(ONESIGNAL_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic " + ONESIGNAL_REST_API_KEY
                    },
                    body: JSON.stringify({
                        app_id: ONESIGNAL_APP_ID,
                        included_segments: ["Subscribed Users"], 
                        headings: { "en": title, "tr": title },
                        contents: { "en": message, "tr": message }
                    })
                });

                if(response.ok) {
                    showToast("Gonderildi");
                    this.reset();
                } else {
                    const errData = await response.json();
                    showToast(errData.errors ? errData.errors[0] : "Hata", true);
                }
            } catch (error) {
                showToast(error.message, true);
            }
            btn.innerHTML = originalText;
        });
    }

    database.ref('categories').on('value', snap => {
        const select = document.getElementById("galleryCategory");
        const catList = document.getElementById("manage-category-list");
        if(select) select.innerHTML = '<option value="all">Tümü (Genel)</option>';
        if(catList) catList.innerHTML = '';
        
        if(snap.exists()) {
            snap.forEach(child => {
                const key = child.key;
                const cat = child.val();
                if(select) select.innerHTML += `<option value="${cat.slug}">${cat.name}</option>`;
                if(catList) {
                    catList.innerHTML += `
                        <div class="cat-badge">
                            <span>${cat.name}</span>
                            <button type="button" class="action-btn" onclick="deleteCategory('${key}')"><i class="fa-solid fa-xmark"></i></button>
                        </div>`;
                }
            });
        }
    });

    const addCatBtn = document.getElementById("addCatBtn");
    if(addCatBtn) {
        addCatBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const input = document.getElementById("newCatName");
            const name = input.value.trim();
            if(name) {
                const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                database.ref('categories').push({ name, slug }).then(() => {
                    input.value = "";
                    showToast("Eklendi");
                });
            }
        });
    }

    database.ref('stories').on('value', snap => {
        const list = document.getElementById("manage-stories-list");
        if(!list) return;
        list.innerHTML = '';
        if(!snap.exists()) return;
        let stories = [];
        snap.forEach(child => { stories.push({ key: child.key, val: child.val() }); });
        stories.reverse(); 
        stories.forEach(item => {
            list.innerHTML += `
                <div class="manage-item">
                    <div class="info">
                        <img src="${item.val.img}" alt="thumbnail">
                        <div>
                            <span class="title">${item.val.title}</span>
                            <span class="date-cat">${item.val.date}</span>
                        </div>
                    </div>
                    <button type="button" class="action-btn" onclick="deleteStory('${item.key}')" title="Sil"><i class="fa-solid fa-trash"></i></button>
                </div>`;
        });
    });

    database.ref('gallery').on('value', snap => {
        const list = document.getElementById("manage-gallery-list");
        if(!list) return;
        list.innerHTML = '';
        if(!snap.exists()) return;
        let photos = [];
        snap.forEach(child => { photos.push({ key: child.key, val: child.val() }); });
        photos.reverse();
        photos.forEach(item => {
            list.innerHTML += `
                <div class="manage-item">
                    <div class="info">
                        <img src="${item.val.img}" alt="thumbnail">
                        <div>
                            <span class="title">${item.val.caption}</span>
                            <span class="date-cat">Kategori: ${item.val.category}</span>
                        </div>
                    </div>
                    <button type="button" class="action-btn" onclick="deleteGallery('${item.key}')" title="Sil"><i class="fa-solid fa-trash"></i></button>
                </div>`;
        });
    });
});