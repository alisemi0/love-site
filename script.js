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

let globalStartDate = new Date("2023-02-14T00:00:00").getTime(); 

function bindFilterEvents() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filterValue = btn.getAttribute("data-filter");
            const gridItems = document.querySelectorAll(".grid-item");

            gridItems.forEach(item => {
                if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                    item.style.display = "block";
                    setTimeout(() => item.style.opacity = "1", 50);
                } else {
                    item.style.opacity = "0";
                    setTimeout(() => item.style.display = "none", 300);
                }
            });
        });
    });
}

function loadDynamicContent() {
    const timelineContainer = document.getElementById("timeline-container");
    const gridContainer = document.getElementById("grid-container");
    const secretNote = document.getElementById("dynamic-secret-note");
    const filterContainer = document.getElementById("dynamic-filters");
    const highlightContainer = document.getElementById("dynamic-highlight");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    database.ref('settings/timer').on('value', snap => {
        if(snap.val() && snap.val().startDate) {
            globalStartDate = new Date(snap.val().startDate).getTime();
        }
    });

    if(highlightContainer) {
        database.ref('settings/highlight').on('value', snap => {
            const hl = snap.val();
            if (hl && hl.active) {
                let contentHTML = "";
                if (hl.img && hl.img.trim() !== "") {
                    contentHTML += `<img src="${hl.img}" class="highlight-img" alt="Özel Alan">`;
                }
                if (hl.text && hl.text.trim() !== "") {
                    contentHTML += `<p class="highlight-text">${hl.text}</p>`;
                }
                
                if (contentHTML !== "") {
                    highlightContainer.innerHTML = contentHTML;
                    highlightContainer.style.display = "flex";
                    setTimeout(() => highlightContainer.classList.add('visible'), 50);
                } else {
                    highlightContainer.style.display = "none";
                }
            } else {
                highlightContainer.style.display = "none";
            }
        });
    }

    if (filterContainer) {
        database.ref('categories').on('value', snap => {
            filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">Tümü</button>';
            if(snap.exists()) {
                snap.forEach(child => {
                    const cat = child.val();
                    if(cat && cat.slug && cat.name) {
                        filterContainer.innerHTML += `<button class="filter-btn" data-filter="${cat.slug}">${cat.name}</button>`;
                    }
                });
            }
            bindFilterEvents();
        });
    }

    if (timelineContainer) {
        database.ref('stories').on('value', (snapshot) => {
            timelineContainer.innerHTML = ''; 
            if(!snapshot.exists()) return;
            let storiesArray = [];
            snapshot.forEach((childSnapshot) => { storiesArray.push(childSnapshot.val()); });
            storiesArray.reverse();
            storiesArray.forEach((story) => {
                const div = document.createElement("div");
                div.className = "timeline-item slide-up";
                div.innerHTML = `
                    <div class="timeline-content dark-glass">
                        <img src="${story.img}" alt="Anı">
                        <h3>${story.title}</h3>
                        <span class="date">${story.date}</span>
                        <p>${story.desc}</p>
                    </div>`;
                timelineContainer.appendChild(div);
                observer.observe(div);
            });
        });
    }

    if (gridContainer) {
        database.ref('gallery').on('value', (snapshot) => {
            gridContainer.innerHTML = ''; 
            if(!snapshot.exists()) return;
            let galleryArray = [];
            snapshot.forEach((childSnapshot) => { galleryArray.push(childSnapshot.val()); });
            galleryArray.reverse();
            galleryArray.forEach((photo) => {
                const div = document.createElement("div");
                div.className = "grid-item polaroid dark-glass slide-up";
                div.setAttribute("data-category", photo.category);
                div.innerHTML = `
                    <img src="${photo.img}" class="gallery-image" alt="Fotoğraf">
                    <div class="caption">${photo.caption}</div>`;
                gridContainer.appendChild(div);
                observer.observe(div);
            });
        });
    }

    if (secretNote) {
        database.ref('specialNote').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && data.message) {
                secretNote.innerText = data.message;
            } else {
                secretNote.innerText = "";
            }
        });
    }
}

function loadDynamicTheme() {
    database.ref('settings/theme').on('value', (snapshot) => {
        const theme = snapshot.val();
        if (theme) {
            if(theme.color) document.documentElement.style.setProperty('--accent-red', theme.color);
            if(theme.bg1) document.documentElement.style.setProperty('--bg-color-1', theme.bg1);
            if(theme.bg2) document.documentElement.style.setProperty('--bg-color-2', theme.bg2);
            if(theme.font) document.documentElement.style.setProperty('--font-romantic', theme.font);
            
            if(theme.title) {
                const titleEl = document.querySelector('.hero-title');
                if(titleEl) titleEl.innerText = theme.title;
            }
            if(theme.subtitle) {
                const subtitleEl = document.querySelector('.hero-subtitle');
                if(subtitleEl) subtitleEl.innerText = theme.subtitle;
            }
            if(theme.loader) {
                const loaderEl = document.querySelector('.loader-text');
                if(loaderEl) loaderEl.innerText = theme.loader;
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    
    const authScreen = document.getElementById("auth-screen");
    const authPassword = document.getElementById("auth-password");
    const authBtn = document.getElementById("auth-btn");
    const authError = document.getElementById("auth-error");
    const loader = document.getElementById("loader");
    const goAdminBtn = document.getElementById("go-admin-btn");

    if(goAdminBtn) {
        goAdminBtn.addEventListener("click", () => {
            window.location.href = "admin.html";
        });
    }

    if (authScreen) {
        document.body.style.overflow = "hidden";
        
        database.ref('settings/passwords/site').once('value').then((snapshot) => {
            const correctSitePass = snapshot.val() || "14531453"; 
            
            authBtn.addEventListener("click", () => {
                if (authPassword.value === correctSitePass) {
                    authScreen.style.opacity = "0";
                    setTimeout(() => { 
                        authScreen.style.display = "none"; 
                        loader.style.display = "flex";
                        setTimeout(() => {
                            loader.style.opacity = "0";
                            setTimeout(() => { 
                                loader.style.display = "none"; 
                                document.body.style.overflowY = "auto";
                                document.body.style.overflowX = "hidden";
                            }, 800);
                        }, 1500);
                    }, 600);
                } else {
                    authError.style.display = "block";
                    authPassword.value = "";
                    authPassword.focus();
                    authError.style.animation = 'none';
                    authError.offsetHeight; 
                    authError.style.animation = null; 
                }
            });

            authPassword.addEventListener("keypress", (e) => {
                if (e.key === "Enter") authBtn.click();
            });
        });
    }

    loadDynamicTheme();
    loadDynamicContent();

    let isInitialCustomNotifLoad = true;
    database.ref('customNotification').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.timestamp > pageLoadTime) {
            if (!isInitialCustomNotifLoad) {
                sendDeviceNotification(data.title, data.body);
            }
        }
        isInitialCustomNotifLoad = false;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.fade-in, .slide-up').forEach((el) => observer.observe(el));

    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");
    const indicator = document.querySelector(".nav-indicator");

    function updateIndicator(item) {
        if(!item || !indicator) return;
        const itemRect = item.getBoundingClientRect();
        const navRect = item.parentElement.getBoundingClientRect();
        const offsetLeft = itemRect.left - navRect.left + (itemRect.width / 2);
        indicator.style.left = `${offsetLeft}px`;
    }

    const activeItem = document.querySelector(".nav-item.active");
    if(activeItem) setTimeout(() => updateIndicator(activeItem), 100);

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
            updateIndicator(item);

            pages.forEach(page => {
                page.classList.remove("active");
                if (page.id === target) {
                    setTimeout(() => page.classList.add("active"), 50);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    });

    window.addEventListener("resize", () => {
        const currentActive = document.querySelector(".nav-item.active");
        if(currentActive) updateIndicator(currentActive);
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const pageOrder = ['home', 'story', 'gallery', 'message'];
    const pagesContainer = document.getElementById("pages-container");

    if(pagesContainer) {
        pagesContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});

        pagesContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, {passive: true});
    }

    function handleSwipe() {
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const currentActive = document.querySelector(".nav-item.active");
            if(!currentActive) return;
            
            const currentTarget = currentActive.getAttribute("data-target");
            let currentIndex = pageOrder.indexOf(currentTarget);

            if (diffX > 0) {
                if (currentIndex < pageOrder.length - 1) {
                    const nextNav = document.querySelector(`.nav-item[data-target="${pageOrder[currentIndex + 1]}"]`);
                    if(nextNav) nextNav.click();
                }
            } else {
                if (currentIndex > 0) {
                    const prevNav = document.querySelector(`.nav-item[data-target="${pageOrder[currentIndex - 1]}"]`);
                    if(prevNav) prevNav.click();
                }
            }
        }
    }

    function updateTimer() {
        const now = new Date().getTime();
        let difference = now - globalStartDate;
        
        if (difference < 0) difference = globalStartDate - now;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        if(daysEl) {
            daysEl.innerText = days.toString().padStart(2, '0');
            document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
            document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
        }
    }
    setInterval(updateTimer, 1000);
    updateTimer();

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close-lightbox");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const smartGrid = document.getElementById("grid-container");
    
    let currentImages = [];
    let currentIndex = 0;

    function updateLightboxImages() {
        const visibleItems = Array.from(document.querySelectorAll(".grid-item")).filter(item => item.style.display !== "none");
        currentImages = visibleItems.map(item => item.querySelector(".gallery-image").src);
    }

    if(smartGrid) {
        smartGrid.addEventListener("click", (e) => {
            if(e.target.classList.contains("gallery-image")) {
                updateLightboxImages();
                currentIndex = currentImages.indexOf(e.target.src);
                if(lightboxImg) lightboxImg.src = currentImages[currentIndex];
                lightbox.classList.add("show");
            }
        });
    }

    if(prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentImages.length - 1;
            if(lightboxImg) lightboxImg.src = currentImages[currentIndex];
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex < currentImages.length - 1) ? currentIndex + 1 : 0;
            if(lightboxImg) lightboxImg.src = currentImages[currentIndex];
        });
    }

    function closeLightbox() { if(lightbox) lightbox.classList.remove("show"); }
    if(closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if(lightbox) lightbox.addEventListener("click", (e) => { if(e.target === lightbox) closeLightbox(); });

    const envelope = document.getElementById("envelope");
    if(envelope) envelope.addEventListener("click", () => envelope.classList.add("open"));

    const particlesContainer = document.getElementById("particles-container");
    function createSparkle() {
        if(!particlesContainer) return;
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        const size = Math.random() * 4 + 2; 
        sparkle.style.width = size + "px";
        sparkle.style.height = size + "px";
        sparkle.style.left = Math.random() * 100 + "vw";
        sparkle.style.animationDuration = (Math.random() * 5 + 5) + "s"; 
        particlesContainer.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 10000);
    }
    setInterval(createSparkle, 300); 
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .catch(err => console.log('SW Error:', err));
    });
}