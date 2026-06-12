// প্রতীতি লাইব্রেরী - ক্লায়েন্ট স্ক্রিপ্ট (app.js)
// --- ইউটিলিটি ফাংশনসমূহ ---
// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
function toBengaliNumber(num) {
    if (num === undefined || num === null) return '';
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/[0-9]/g, digit => bengaliDigits[parseInt(digit)]);
}
// টোস্ট নোটিফিকেশন প্রদর্শন
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') {
        icon = '<i class="fa-solid fa-circle-xmark"></i>';
    } else if (type === 'warning') {
        icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    }
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    // অ্যানিমেশন ট্রিগার করা
    setTimeout(() => toast.classList.add('show'), 50);
    // ৩ সেকেন্ড পর রিমুভ করা
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
// বুক কভার ইমেজ লোড করতে ব্যর্থ হলে ব্যাকআপ কভার
function getBookCoverFallback(title, author) {
    const encodedTitle = encodeURIComponent(title);
    const encodedAuthor = encodeURIComponent(author);
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%231e40af;stop-opacity:1"/><stop offset="100%" style="stop-color:%230f172a;stop-opacity:1"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><rect x="15" y="15" width="270" height="370" fill="none" stroke="%23ffffff" stroke-width="2" stroke-opacity="0.2" rx="8"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">${encodedTitle}</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="%23fbbf24" font-family="system-ui, sans-serif" font-size="14">${encodedAuthor}</text></svg>`;
}
// --- থিম ম্যানেজার (ডার্ক মোড) ---
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (!themeToggleBtn) return;
    // পূর্বে সংরক্ষিত থিম চেক করা
    const savedTheme = localStorage.getItem('protiti_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.classList.remove('dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('protiti_theme', isDark ? 'dark' : 'light');
        
        if (isDark) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            showToast('ডার্ক মোড সক্রিয় করা হয়েছে', 'success');
        } else {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            showToast('লাইট মোড সক্রিয় করা হয়েছে', 'success');
        }
    });
}
// --- মোবাইল মেনু ---
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            mobileBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });
        // বাইরে ক্লিক করলে মেনু বন্ধ করা
        document.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
        // মেনু লিঙ্কে ক্লিক করলে মেনু বন্ধ করা
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }
}
// --- রাউটিং লজিক ---
class Router {
    constructor() {
        this.routes = {
            'home': () => this.renderHome(),
            'about': () => this.renderAbout(),
            'founder': () => this.renderFounder(),
            'books': () => this.renderBooks(),
            'gallery': () => this.renderGallery(),
            'contact': () => this.renderContact(),
            'register': () => this.renderRegister(),
            'admin': () => {
                if (window.adminManager) {
                    window.adminManager.renderAdminView();
                } else {
                    document.getElementById('app-content').innerHTML = `<div class="container" style="padding: 60px 24px; text-align: center;"><i class="fa-solid fa-circle-notch fa-spin fa-3x" style="color: var(--primary);"></i><p style="margin-top: 15px;">এডমিন মডিউল লোড হচ্ছে...</p></div>`;
                    setTimeout(() => {
                        if (window.adminManager) window.adminManager.renderAdminView();
                    }, 500);
                }
            }
        };
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => {
            this.handleRoute();
            initTheme();
            initMobileMenu();
        });
    }
    handleRoute() {
        const hash = window.location.hash || '#/';
        let route = 'home';
        if (hash.startsWith('#/about')) route = 'about';
        else if (hash.startsWith('#/founder')) route = 'founder';
        else if (hash.startsWith('#/books')) route = 'books';
        else if (hash.startsWith('#/gallery')) route = 'gallery';
        else if (hash.startsWith('#/contact')) route = 'contact';
        else if (hash.startsWith('#/register')) route = 'register';
        else if (hash.startsWith('#/admin')) route = 'admin';
        // একটিভ লিংক হাইলাইট করা
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-route') === route) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        // এসইও এবং টাইটেল আপডেট করা
        const settings = window.db.getSettings();
        const baseTitle = settings.libraryName || 'প্রতীতি লাইব্রেরী';
        
        const pageTitles = {
            'home': 'হোম - জ্ঞানের আলোয় আলোকিত ভবিষ্যৎ',
            'about': 'আমাদের সম্পর্কে - ইতিহাস ও উদ্দেশ্য',
            'founder': 'প্রতিষ্ঠাতার পরিচিতি - ড. এম. এ. লতিফ',
            'books': 'বইসমূহ - বইয়ের তালিকা ও অনুসন্ধান',
            'gallery': 'গ্যালারি - লাইব্রেরীর কার্যক্রম ও ছবি',
            'contact': 'যোগাযোগ - আমাদের সাথে যোগাযোগ করুন',
            'register': 'সদস্য নিবন্ধন - লাইব্রেরীর সদস্য হোন',
            'admin': 'এডমিন প্যানেল - ড্যাশবোর্ড'
        };
        document.title = `${baseTitle} | ${pageTitles[route] || ''}`;
        // পেজ রেন্ডার করা
        if (this.routes[route]) {
            this.routes[route]();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    // --- পেজ রেন্ডার মেথডসমূহ ---
    // ১. হোম পেজ
    renderHome() {
        const stats = window.db.getStats();
        const settings = window.db.getSettings();
        const contentArea = document.getElementById('app-content');
        contentArea.innerHTML = `
            <!-- হিরো সেকশন -->
            <section class="hero-section">
                <div class="container hero-grid">
                    <div class="hero-content">
                        <span class="hero-tagline">জ্ঞানের আলোয় আলোকিত ভবিষ্যৎ</span>
                        <h1 class="hero-title">স্বাগতম, ${settings.libraryName}!</h1>
                        <p class="hero-desc">
                            বই হচ্ছে মানুষের শ্রেষ্ঠ বন্ধু। প্রতীতি লাইব্রেরীর উন্মুক্ত অঙ্গনে আপনাকে আমন্ত্রণ। আসুন, বই পড়ি, নিজেকে সমৃদ্ধ করি এবং একটি সুন্দর সমাজ গঠনে ভূমিকা রাখি।
                        </p>
                        <div class="hero-buttons">
                            <a href="#/books" class="btn btn-primary"><i class="fa-solid fa-book-open"></i> বইসমূহ খুঁজুন</a>
                            <a href="#/register" class="btn btn-secondary"><i class="fa-solid fa-user-plus"></i> সদস্য নিবন্ধন</a>
                        </div>
                    </div>
                    <div></div> <!-- খালি কলাম যা ইমেজ ব্যাকগ্রাউন্ডের সাথে সামঞ্জস্য রাখে -->
                </div>
            </section>
            <!-- স্ট্যাটিস্টিকস ওভারলে কার্ডসমূহ -->
            <section class="container">
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fa-solid fa-calendar-check"></i></div>
                        <div class="stat-number">${toBengaliNumber(stats.establishYear)}</div>
                        <div class="stat-label">প্রতিষ্ঠার সাল</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fa-solid fa-book"></i></div>
                        <div class="stat-number">${toBengaliNumber(stats.totalBooks)}</div>
                        <div class="stat-label">মোট বইয়ের সংখ্যা</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                        <div class="stat-number">${toBengaliNumber(stats.totalMembers)}</div>
                        <div class="stat-label">নিবন্ধিত সদস্য</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fa-solid fa-images"></i></div>
                        <div class="stat-number">${toBengaliNumber(stats.totalGalleryItems)}</div>
                        <div class="stat-label">গ্যালারি ছবি</div>
                    </div>
                </div>
            </section>
            <!-- সংক্ষিপ্ত পরিচিতি -->
            <section class="container" style="margin-bottom: 80px;">
                <div class="about-brief-grid">
                    <div class="about-brief-image">
                        <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800" alt="লাইব্রেরী রিডিং রুম">
                    </div>
                    <div class="about-brief-content">
                        <span class="section-tag">সংক্ষিপ্ত পরিচিতি</span>
                        <h3>জ্ঞান ও সংস্কৃতির মিলনমেলা</h3>
                        <p>
                            ${settings.libraryName} একটি সম্পূর্ণ অলাভজনক সামাজিক ও শিক্ষা সহায়ক প্রতিষ্ঠান। আমাদের লাইব্রেরীটি সকল স্তরের পাঠকদের জন্য উন্মুক্ত। এখানে একাডেমিক বইয়ের পাশাপাশি দেশী-বিদেশী সমৃদ্ধ সাহিত্যগ্রন্থ, ম্যাগাজিন এবং গবেষণামূলক জার্নাল রয়েছে।
                        </p>
                        <p>
                            আমাদের আধুনিক পাঠাগারে রয়েছে শান্ত ও মনোরম পরিবেশ, যেখানে বসে অনায়াসে পড়াশোনা করা যায়। এছাড়াও আমরা নিয়মিত সাহিত্য আড্ডা, কবিতা পাঠের আসর ও তরুণদের জন্য সৃজনশীল প্রতিযোগিতার আয়োজন করে থাকি।
                        </p>
                        <div class="about-brief-features">
                            <div class="feature-item">
                                <i class="fa-solid fa-circle-check"></i>
                                <span>মনোরম পাঠ পরিবেশ</span>
                            </div>
                            <div class="feature-item">
                                <i class="fa-solid fa-circle-check"></i>
                                <span>বিনামূল্যে সদস্যপদ</span>
                            </div>
                            <div class="feature-item">
                                <i class="fa-solid fa-circle-check"></i>
                                <span>সমৃদ্ধ সাহিত্য কর্নার</span>
                            </div>
                            <div class="feature-item">
                                <i class="fa-solid fa-circle-check"></i>
                                <span>ওয়াই-ফাই সুবিধা</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    // ২. আমাদের সম্পর্কে
    renderAbout() {
        const settings = window.db.getSettings();
        const contentArea = document.getElementById('app-content');
        contentArea.innerHTML = `
            <div class="container" style="padding-top: 48px;">
                <div class="section-title-wrapper">
                    <span class="section-tag">প্রতীতি লাইব্রেরী</span>
                    <h2 class="section-title">আমাদের সম্পর্কে</h2>
                </div>
                <div class="about-full-layout">
                    <!-- ইতিহাস -->
                    <div class="history-card">
                        <h3 style="color: var(--primary); margin-bottom: 16px; font-size: 24px;"><i class="fa-solid fa-hourglass-start" style="margin-right: 10px;"></i> আমাদের ইতিহাস</h3>
                        <p style="text-align: justify; margin-bottom: 16px;">
                            ${settings.libraryName} এর যাত্রা শুরু হয়েছিল ${toBengaliNumber(settings.establishYear)} সালের ফেব্রুয়ারি মাসে। এলাকার কিছু উদ্যমী তরুণ ও স্থানীয় শিক্ষাবিদদের যৌথ প্রচেষ্টায় একটি জরাজীর্ণ ভাড়া ঘরে সামান্য কিছু বই নিয়ে এই লাইব্রেরীটি চালু করা হয়। পরবর্তীতে আমাদের সম্মানিত প্রতিষ্ঠাতা লাইব্রেরীর নামে জমি দান করার পর সেখানে একটি স্থায়ী ভবন নির্মাণ করা হয়।
                        </p>
                        <p style="text-align: justify;">
                            বিগত এক দশকেরও বেশি সময় ধরে লাইব্রেরীটি এই অঞ্চলের মানুষের মধ্যে জ্ঞানের আলো ছড়িয়ে দিচ্ছে। আজ এটি হাজারো বইয়ের এক সুবিশাল সংগ্রহশালা এবং সংস্কৃতি চর্চার প্রাণকেন্দ্রে পরিণত হয়েছে।
                        </p>
                    </div>
                    <!-- লক্ষ্য ও উদ্দেশ্য -->
                    <div class="vision-mission-cards">
                        <div class="vision-mission-grid">
                            <div class="vision-card">
                                <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 20px;"><i class="fa-solid fa-eye" style="margin-right: 8px;"></i> আমাদের লক্ষ্য (Vision)</h3>
                                <p style="font-size: 15px; color: var(--text-secondary); text-align: justify;">
                                    একটি তথ্যসমৃদ্ধ, কুসংস্কারমুক্ত ও প্রগতিশীল সমাজ গঠন করা, যেখানে প্রত্যেক নাগরিক বই পড়ার মাধ্যমে নিজের মেধা ও মননের বিকাশ ঘটানোর সুযোগ পাবেন।
                                </p>
                            </div>
                            <div class="vision-card">
                                <h3 style="color: var(--primary); margin-bottom: 12px; font-size: 20px;"><i class="fa-solid fa-bullseye" style="margin-right: 8px;"></i> আমাদের উদ্দেশ্য (Mission)</h3>
                                <p style="font-size: 15px; color: var(--text-secondary); text-align: justify;">
                                    সকল শ্রেণীর মানুষের জন্য মানসম্মত বইয়ের সহজলভ্যতা নিশ্চিত করা, যুব সমাজকে ডিজিটাল পর্দার আসক্তি থেকে বইয়ের পাতায় ফিরিয়ে আনা এবং এলাকায় নিয়মিত সাহিত্য ও জ্ঞানচর্চার প্রসার ঘটানো।
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- কার্যক্রম -->
                    <div class="activities-section">
                        <h3 style="text-align: center; color: var(--text-primary); margin-bottom: 30px; font-size: 24px;">আমাদের কার্যক্রমসমূহ</h3>
                        <div class="activity-grid">
                            <div class="activity-card">
                                <i class="fa-solid fa-book-reader"></i>
                                <h4>দৈনিক পাঠাগার সেবা</h4>
                                <p>সপ্তাহে ৬ দিন সর্বসাধারণের জন্য লাইব্রেরীর রিডিং রুম খোলা থাকে। নীরব ও শান্তিপূর্ণ পরিবেশে এখানে এসে পড়াশোনা করা যায়।</p>
                            </div>
                            <div class="activity-card">
                                <i class="fa-solid fa-people-carry-box"></i>
                                <h4>বই ধার নেয়ার সুযোগ</h4>
                                <p>নিবন্ধিত সদস্যরা লাইব্রেরী থেকে পছন্দের বই বাড়িতে নিয়ে পড়ার সুযোগ পান। আমাদের কোনো অতিরিক্ত চার্জ দিতে হয় না।</p>
                            </div>
                            <div class="activity-card">
                                <i class="fa-solid fa-masks-theater"></i>
                                <h4>সাহিত্য ও সংস্কৃতি অনুষ্ঠান</h4>
                                <p>নতুন বইয়ের মোড়ক উন্মোচন, সাহিত্য আড্ডা এবং শিশু-কিশোরদের জন্য বিতর্ক ও কুইজ প্রতিযোগিতার নিয়মিত আয়োজন।</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // ৩. প্রতিষ্ঠাতার পরিচিতি
    renderFounder() {
        const founder = window.db.getFounder();
        const contentArea = document.getElementById('app-content');
        contentArea.innerHTML = `
            <div class="container" style="padding-top: 48px;">
                <div class="section-title-wrapper">
                    <span class="section-tag">শ্রদ্ধা ও কৃতজ্ঞতা</span>
                    <h2 class="section-title">প্রতিষ্ঠাতার পরিচিতি</h2>
                </div>
                <div class="founder-profile-grid">
                    <!-- ছবি ও বেসিক তথ্য -->
                    <div class="founder-img-wrapper">
                        <img src="${founder.photoUrl}" alt="${founder.name}" class="founder-photo" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'">
                        <h3>${founder.name}</h3>
                        <p>প্রতিষ্ঠাতা ও পৃষ্ঠপোষক</p>
                    </div>
                    <!-- জীবনী ও অবদান -->
                    <div class="founder-bio-card">
                        <h3 style="color: var(--primary); margin-bottom: 20px; font-size: 24px;"><i class="fa-solid fa-address-card" style="margin-right: 10px;"></i> জীবনী</h3>
                        <p style="margin-bottom: 24px; line-height: 1.8;">
                            ${founder.bio}
                        </p>
                        <h4><i class="fa-solid fa-graduation-cap" style="margin-right: 8px;"></i> শিক্ষাগত যোগ্যতা</h4>
                        <p style="margin-bottom: 24px;">
                            ${founder.education}
                        </p>
                        <h4><i class="fa-solid fa-award" style="margin-right: 8px;"></i> অবদান ও সমাজসেবা</h4>
                        <p style="line-height: 1.8;">
                            ${founder.contributions}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    // ৪. বইসমূহ (বইয়ের তালিকা, সার্চ ও ফিল্টার)
    renderBooks() {
        const contentArea = document.getElementById('app-content');
        const books = window.db.getBooks();
        const categories = window.db.getCategories();
        contentArea.innerHTML = `
            <div class="container" style="padding-top: 48px;">
                <div class="section-title-wrapper">
                    <span class="section-tag">সংগ্রহশালা</span>
                    <h2 class="section-title">বইয়ের তালিকা</h2>
                </div>
                <!-- সার্চ ও ফিল্টার বার -->
                <div class="books-filter-bar">
                    <!-- সার্চ বক্স -->
                    <div class="search-box-wrapper">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="book-search-input" placeholder="বইয়ের নাম বা লেখকের নাম দিয়ে খুঁজুন...">
                    </div>
                    <!-- ক্যাটাগরি ফিল্টার বাটনস -->
                    <div class="category-filter-buttons" id="category-filter-container">
                        <button class="filter-btn active" data-id="all">সব বই</button>
                        ${categories.map(cat => `
                            <button class="filter-btn" data-id="${cat.id}">${cat.name}</button>
                        `).join('')}
                    </div>
                </div>
                <!-- বইয়ের গ্রিড -->
                <div class="books-grid" id="books-grid">
                    <!-- বই কার্ড জাভাস্ক্রিপ্ট দিয়ে ডাইনামিকালি জেনারেট হবে -->
                </div>
            </div>
        `;
        // ফিল্টারিং এর ইভেন্ট বাইন্ডিং
        this.bindBooksFilter();
    }
    bindBooksFilter() {
        const searchInput = document.getElementById('book-search-input');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const booksGrid = document.getElementById('books-grid');
        let activeCategoryId = 'all';
        let searchQuery = '';
        const filterAndRender = () => {
            const books = window.db.getBooks();
            const categories = window.db.getCategories();
            const filteredBooks = books.filter(book => {
                const matchesCategory = activeCategoryId === 'all' || book.categoryId === activeCategoryId;
                const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      book.author.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            });
            if (filteredBooks.length === 0) {
                booksGrid.innerHTML = `
                    <div class="no-results">
                        <i class="fa-solid fa-book-bookmark"></i>
                        <p>দুঃখিত, কোনো বই পাওয়া যায়নি। অন্য কিছু লিখে অনুসন্ধান করুন।</p>
                    </div>
                `;
                return;
            }
            booksGrid.innerHTML = filteredBooks.map(book => {
                const cat = categories.find(c => c.id === book.categoryId);
                const catName = cat ? cat.name : 'অন্যান্য';
                const isAvail = parseInt(book.available || 0) > 0;
                
                return `
                    <div class="book-card">
                        <div class="book-cover-wrapper">
                            <img class="book-cover" src="${book.coverImage}" alt="${book.title}" 
                                 onerror="this.onerror=null; this.src=getBookCoverFallback('${book.title}', '${book.author}')">
                            <span class="book-category-badge">${catName}</span>
                        </div>
                        <div class="book-info">
                            <h4 class="book-title">${book.title}</h4>
                            <p class="book-author"><i class="fa-solid fa-pen-nib"></i> ${book.author}</p>
                            <p class="book-publisher"><i class="fa-solid fa-print"></i> প্রকাশনী: ${book.publisher}</p>
                            
                            <!-- বর্ণনা কার্ডের হোভার বা অন্য কাজে লাগতে পারে -->
                            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${book.description}">
                                ${book.description}
                            </p>
                            <div class="book-status">
                                <span class="status-indicator ${isAvail ? 'available' : 'unavailable'}">
                                    ${isAvail ? 'পড়ার জন্য আছে' : 'ধার দেয়া হয়েছে'}
                                </span>
                                <span class="book-qty">কপি: ${toBengaliNumber(book.available)}/${toBengaliNumber(book.quantity)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        };
        // সার্চ ইনপুট লিসেনার
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.trim();
                filterAndRender();
            });
        }
        // ফিল্টার বাটন লিসেনার
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategoryId = btn.getAttribute('data-id');
                filterAndRender();
            });
        });
        // ইনিশিয়াল রেন্ডার
        filterAndRender();
    }
    // ৫. গ্যালারি
    renderGallery() {
        const contentArea = document.getElementById('app-content');
        const galleryItems = window.db.getGallery();
        contentArea.innerHTML = `
            <div class="container" style="padding-top: 48px;">
                <div class="section-title-wrapper">
                    <span class="section-tag">ফটোগ্রাফি</span>
                    <h2 class="section-title">ছবি গ্যালারি</h2>
                </div>
                <div class="gallery-grid" id="gallery-grid">
                    ${galleryItems.map(item => `
                        <div class="gallery-card">
                            <img src="${item.imageUrl}" alt="${item.title}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'">
                            <div class="gallery-overlay">
                                <h4 class="gallery-card-title">${item.title}</h4>
                                <span class="gallery-card-tag"><i class="fa-solid fa-tag"></i> ${item.category}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    // ৬. যোগাযোগ পেজ
    renderContact() {
        const settings = window.db.getSettings();
        const contentArea = document.getElementById('app-content');
        contentArea.innerHTML = `
            <div class="container" style="padding-top: 48px;">
                <div class="section-title-wrapper">
                    <span class="section-tag">যোগাযোগ করুন</span>
                    <h2 class="section-title">যোগাযোগ</h2>
                </div>
                <div class="contact-grid">
                    <!-- বাম কলাম: যোগাযোগের ঠিকানা ও ম্যাপ -->
                    <div class="contact-info-card">
                        <div class="contact-detail-item">
                            <i class="fa-solid fa-map-location-dot"></i>
                            <div class="contact-detail-text">
                                <h4>ঠিকানা</h4>
                                <p>${settings.address}</p>
                            </div>
                        </div>
                        <div class="contact-detail-item">
                            <i class="fa-solid fa-phone-volume"></i>
                            <div class="contact-detail-text">
                                <h4>ফোন নম্বর</h4>
                                <p>${settings.phone}</p>
                            </div>
                        </div>
                        <div class="contact-detail-item">
                            <i class="fa-solid fa-envelope-open-text"></i>
                            <div class="contact-detail-text">
                                <h4>ইমেইল ঠিকানা</h4>
                                <p>${settings.email}</p>
                            </div>
                        </div>
                        <!-- গুগল ম্যাপ ফ্রেম -->
                        <div class="google-map-wrapper">
                            <iframe src="${settings.mapUrl}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                    <!-- ডান কলাম: যোগাযোগ ফরম -->
                    <div class="contact-form-card">
                        <h3 style="margin-bottom: 20px; color: var(--primary); font-size: 22px;"><i class="fa-solid fa-paper-plane" style="margin-right: 10px;"></i> আমাদের বার্তা পাঠান</h3>
                        <form id="contact-form">
                            <div class="form-group">
                                <label class="form-label" for="contact-name">আপনার নাম <span style="color:var(--danger)">*</span></label>
                                <input type="text" id="contact-name" class="form-input" placeholder="যেমন: আবদুর রহমান" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="contact-email">ইমেইল ঠিকানা <span style="color:var(--danger)">*</span></label>
                                <input type="email" id="contact-email" class="form-input" placeholder="যেমন: rahman@email.com" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="contact-subject">বিষয়</label>
                                <input type="text" id="contact-subject" class="form-input" placeholder="বার্তা পাঠানোর মূল বিষয়...">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="contact-msg">বার্তার বিবরণ <span style="color:var(--danger)">*</span></label>
                                <textarea id="contact-msg" class="form-textarea" placeholder="আপনার মতামত বা তথ্যটি এখানে লিখুন..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="fa-solid fa-paper-plane"></i> বার্তা জমা দিন</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        // ফরম সাবমিশন ইভেন্ট
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                showToast('আপনার বার্তাটি সফলভাবে প্রেরণ করা হয়েছে। ধন্যবাদ!', 'success');
                form.reset();
            });
        }
    }
    // ৭. সদস্য নিবন্ধন পেজ
    renderRegister() {
        const contentArea = document.getElementById('app-content');
        contentArea.innerHTML = `
            <div class="container" style="padding-top: 48px;">
                <div class="section-title-wrapper">
                    <span class="section-tag">মেম্বারশিপ</span>
                    <h2 class="section-title">সদস্য নিবন্ধন</h2>
                </div>
                <div class="register-container">
                    <div class="register-form-card" id="register-container-box">
                        <h3 style="margin-bottom: 20px; color: var(--primary); font-size: 22px; text-align: center;"><i class="fa-solid fa-address-card" style="margin-right: 10px;"></i> নিবন্ধন ফরম</h3>
                        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 30px;">
                            প্রতীতি লাইব্রেরীর সদস্য হয়ে আনলিমিটেড বইয়ের জগতে প্রবেশ করুন। ফরমটি সতর্কতার সাথে পূরণ করুন।
                        </p>
                        <form id="member-register-form">
                            <div class="form-group">
                                <label class="form-label" for="reg-name">পূর্ণ নাম <span style="color:var(--danger)">*</span></label>
                                <input type="text" id="reg-name" class="form-input" placeholder="আপনার পুরো নাম লিখুন" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="reg-phone">মোবাইল নম্বর <span style="color:var(--danger)">*</span></label>
                                <input type="tel" id="reg-phone" class="form-input" placeholder="যেমন: ০১৭১২৩৪৫৬৭৮" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="reg-email">ইমেইল ঠিকানা <span style="color:var(--danger)">*</span></label>
                                <input type="email" id="reg-email" class="form-input" placeholder="যেমন: custom@email.com" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="reg-address">ঠিকানা <span style="color:var(--danger)">*</span></label>
                                <textarea id="reg-address" class="form-textarea" placeholder="আপনার স্থায়ী ও বর্তমান ঠিকানা লিখুন" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="fa-solid fa-user-plus"></i> নিবন্ধন সম্পন্ন করুন</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        // সদস্য নিবন্ধন ফর্ম সাবমিশন লজিক
        const form = document.getElementById('member-register-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const newMember = {
                    name: document.getElementById('reg-name').value.trim(),
                    phone: document.getElementById('reg-phone').value.trim(),
                    email: document.getElementById('reg-email').value.trim(),
                    address: document.getElementById('reg-address').value.trim()
                };
                // ডাটাবেজে সংরক্ষণ করা
                const savedMember = window.db.saveMember(newMember);
                if (savedMember) {
                    showToast('আপনার নিবন্ধন সফল হয়েছে!', 'success');
                    
                    // ফরম কন্টেইনারে একটি সুন্দর ডিজিটাল সদস্য কার্ড প্রদর্শন করা
                    const containerBox = document.getElementById('register-container-box');
                    const settings = window.db.getSettings();
                    
                    containerBox.style.animation = 'fadeInUp 0.6s ease-out';
                    containerBox.innerHTML = `
                        <div style="text-align: center; margin-bottom: 24px;">
                            <i class="fa-solid fa-circle-check" style="font-size: 54px; color: var(--success); margin-bottom: 16px;"></i>
                            <h3 style="color: var(--success);">নিবন্ধন সফল হয়েছে!</h3>
                            <p style="color: var(--text-secondary); margin-top: 8px;">আপনার ডিজিটাল সদস্য কার্ডটি তৈরি করা হয়েছে। কার্ড নম্বরটি সংরক্ষণ করুন।</p>
                        </div>
                        
                        <!-- সদস্য কার্ড ডিজাইন -->
                        <div style="background: linear-gradient(135deg, var(--primary), #0f172a); color: #ffffff; border-radius: 12px; padding: 24px; box-shadow: var(--shadow-lg); text-align: left; position: relative; overflow: hidden; font-family: var(--font-english); margin-bottom: 30px;">
                            <div style="position: absolute; right: -20px; bottom: -20px; opacity: 0.1; font-size: 150px; color: #ffffff; transform: rotate(-15deg);">
                                <i class="fa-solid fa-book-open"></i>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 12px; margin-bottom: 16px;">
                                <div style="font-family: var(--font-bengali); font-weight: 700; font-size: 18px;">
                                    ${settings.libraryName}
                                </div>
                                <div style="font-size: 11px; background-color: var(--accent); color: #000; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
                                    MEMBER
                                </div>
                            </div>
                            <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
                                <div style="background-color: rgba(255,255,255,0.1); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                                    <i class="fa-solid fa-user"></i>
                                </div>
                                <div>
                                    <div style="font-family: var(--font-bengali); font-size: 20px; font-weight: 700; color: #ffffff;">${savedMember.name}</div>
                                    <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 2px;">আইডি: ${savedMember.id}</div>
                                </div>
                            </div>
                            <div style="font-size: 13px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 12px; font-family: var(--font-bengali);">
                                <div>
                                    <span style="color: rgba(255,255,255,0.6); display: block; font-size: 11px;">মোবাইল নম্বর</span>
                                    <strong>${savedMember.phone}</strong>
                                </div>
                                <div>
                                    <span style="color: rgba(255,255,255,0.6); display: block; font-size: 11px;">নিবন্ধন তারিখ</span>
                                    <strong>${toBengaliNumber(savedMember.registrationDate)}</strong>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button onclick="window.print()" class="btn btn-secondary" style="border-color: var(--primary); color: var(--primary);"><i class="fa-solid fa-print"></i> কার্ড প্রিন্ট করুন</button>
                            <a href="#/books" class="btn btn-primary"><i class="fa-solid fa-book-open"></i> বইসমূহ দেখুন</a>
                        </div>
                    `;
                } else {
                    showToast('নিবন্ধন ব্যর্থ হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
                }
            });
        }
    }
}
// রাউটার অবজেক্ট তৈরি করা
window.appRouter = new Router();
