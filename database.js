// প্রতীতি লাইব্রেরী - ডাটাবেজ মডিউল (database.js)
const DB_KEYS = {
    BOOKS: 'protiti_books',
    CATEGORIES: 'protiti_categories',
    MEMBERS: 'protiti_members',
    GALLERY: 'protiti_gallery',
    FOUNDER: 'protiti_founder',
    SETTINGS: 'protiti_settings',
    LOGGED_IN: 'protiti_admin_logged_in'
};
// ডিফল্ট ডেটা (সীড ডেটা)
const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'উপন্যাস' },
    { id: 'cat-2', name: 'কবিতা' },
    { id: 'cat-3', name: 'ইতিহাস ও প্রবন্ধ' },
    { id: 'cat-4', name: 'বিজ্ঞান ও কল্পকাহিনী' }
];
const DEFAULT_BOOKS = [
    {
        id: 'book-1',
        title: 'গীতাঞ্জলি',
        author: 'রবীন্দ্রনাথ ঠাকুর',
        categoryId: 'cat-2',
        publisher: 'বিশ্বভারতী গ্রন্থনবিভাগ',
        description: 'নোবেল বিজয়ী কাব্যগ্রন্থ গীতাঞ্জলি। এতে রয়েছে রবীন্দ্রনাথ ঠাকুরের কালজয়ী ১৫৭টি গীতিকবিতা ও গানের সংকলন, যা মানুষের আধ্যাত্মিকতা ও প্রকৃতির বন্ধনকে তুলে ধরে।',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
        quantity: 5,
        available: 5
    },
    {
        id: 'book-2',
        title: 'অগ্নিবীণা',
        author: 'কাজী নজরুল ইসলাম',
        categoryId: 'cat-2',
        publisher: 'বেঙ্গল পাবলিশার্স',
        description: 'জাতীয় কবি কাজী নজরুল ইসলামের প্রথম কাব্যগ্রন্থ। এতে বিদ্রোহী, প্রলয়োল্লাস সহ মোট ১২টি ওজস্বী ও দ্রোহের কবিতা স্থান পেয়েছে যা অন্যায় ও শোষণের বিরুদ্ধে রুখে দাঁড়ানোর অনুপ্রেরণা দেয়।',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
        quantity: 3,
        available: 3
    },
    {
        id: 'book-3',
        title: 'হিমুর হাতে কয়েকটি নীলপদ্ম',
        author: 'হুমায়ূন আহমেদ',
        categoryId: 'cat-1',
        publisher: 'অন্যপ্রকাশ',
        description: 'জনপ্রিয় কথাসাহিত্যিক হুমায়ূন আহমেদের বিখ্যাত কাল্পনিক চরিত্র "হিমু" সিরিজের একটি জনপ্রিয় উপন্যাস। হলুদ পাঞ্জাবি পরিহিত উদাসীন এক যুবকের অদ্ভুত জীবনদর্শন ও রহস্যময়তা এতে চমৎকারভাবে বর্ণিত হয়েছে।',
        coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600',
        quantity: 8,
        available: 8
    },
    {
        id: 'book-4',
        title: 'লালসালু',
        author: 'সৈয়দ ওয়ালীউল্লাহ্',
        categoryId: 'cat-1',
        publisher: 'নওরোজ কিতাবিস্তান',
        description: 'সামাজিক উপন্যাস। গ্রামীণ সমাজের ধর্মান্ধতা, কুসংস্কার এবং ধর্ম ব্যবসায়ী মজিদের প্রতারণা ও আধিপত্য বিস্তারের এক নিপুণ চিত্র তুলে ধরেছেন লেখক।',
        coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
        quantity: 4,
        available: 4
    },
    {
        id: 'book-5',
        title: 'পদ্মা নদীর মাঝি',
        author: 'মানিক বন্দ্যোপাধ্যায়',
        categoryId: 'cat-1',
        publisher: 'বেঙ্গল পাবলিশার্স',
        description: 'পদ্মা পাড়ের জেলেদের সংগ্রামী ও অবহেলিত জীবন, ক্ষুধা, দারিদ্র্য ও মানুষের মধ্যকার আদিম প্রবৃত্তি ও প্রেমের টান নিয়ে রচিত বাংলা উপন্যাসের এক ধ্রুপদী সৃষ্টি।',
        coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
        quantity: 6,
        available: 6
    },
    {
        id: 'book-6',
        title: 'প্রফেশ্বর শঙ্কু সমগ্র',
        author: 'সত্যজিৎ রায়',
        categoryId: 'cat-4',
        publisher: 'আনন্দ পাবলিশার্স',
        description: 'বিখ্যাত চলচ্চিত্রকার সত্যজিৎ রায়ের তৈরি কালজয়ী বিজ্ঞানী চরিত্র প্রফেসর ত্রিলোকেশ্বর শঙ্কুর অসাধারণ সব বৈজ্ঞানিক আবিষ্কার ও দেশ-বিদেশের অ্যাডভেঞ্চারের রোমাঞ্চকর সংকলন।',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
        quantity: 7,
        available: 7
    },
    {
        id: 'book-7',
        title: 'পথের পাঁচালী',
        author: 'বিभूतिভূষণ বন্দ্যোপাধ্যায়',
        categoryId: 'cat-1',
        publisher: 'সিগনেট প্রেস',
        description: 'অপুর শৈশব ও গ্রামীণ বাংলার নিটোল চিত্র নিয়ে রচিত বিশ্বখ্যাত উপন্যাস। প্রকৃতির কোলে বেড়ে ওঠা দুই ভাইবোনের আনন্দ-বেদনা ও পারিবারিক দারিদ্র্যের এক অমর আখ্যান।',
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        quantity: 5,
        available: 5
    },
    {
        id: 'book-8',
        title: 'হাজার বছর ধরে',
        author: 'জহির রায়হান',
        categoryId: 'cat-1',
        publisher: 'সন্ধানী প্রকাশনী',
        description: 'বাংলার গ্রামীণ জনপদের হাজার বছরের ঐতিহ্য, কুসংস্কার, প্রেম ও পারিবারিক দ্বন্দ্বের টানাপোড়েন ফুটিয়ে তুলেছে এই হৃদয়স্পর্শী উপন্যাস।',
        coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=600',
        quantity: 4,
        available: 4
    }
];
const DEFAULT_MEMBERS = [
    {
        id: 'mem-1',
        name: 'সাকিব আল হাসান',
        phone: '০১৭১২৩৪৫६৭৮',
        email: 'shakib@email.com',
        address: 'মিরপুর, ঢাকা',
        registrationDate: '২০২৫-০১-১০'
    },
    {
        id: 'mem-2',
        name: 'তাসনিম রহমান',
        phone: '০১৯৮৭৬৫৪৩২১',
        email: 'tasnim@email.com',
        address: 'ধানমন্ডি, ঢাকা',
        registrationDate: '২০২৫-০৩-১৫'
    },
    {
        id: 'mem-3',
        name: 'ড. আশরাফুল ইসলাম',
        phone: '০১৫৫৫৬৬৭৭৮৮',
        email: 'ashraful@email.com',
        address: 'উত্তরা, ঢাকা',
        registrationDate: '২০২৫-০৫-০১'
    }
];
const DEFAULT_GALLERY = [
    {
        id: 'gal-1',
        title: 'লাইব্রেরীর মূল রিডিং রুম',
        imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800',
        category: 'লাইব্রেরী প্রাঙ্গণ'
    },
    {
        id: 'gal-2',
        title: 'সাপ্তাহিক সাহিত্য আসর ও কবি আড্ডা',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
        category: 'অনুষ্ঠানসমূহ'
    },
    {
        id: 'gal-3',
        title: 'শিশু-কিশোরদের জন্য বিশেষ বইয়ের কর্নার',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800',
        category: 'লাইব্রেরী প্রাঙ্গণ'
    },
    {
        id: 'gal-4',
        title: 'নতুন বই সংগ্রহ ও মোড়ক উন্মোচন উৎসব',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
        category: 'অনুষ্ঠানসমূহ'
    }
];
const DEFAULT_FOUNDER = {
    name: 'অধ্যাপক ড. এম. এ. লতিফ',
    bio: 'অধ্যাপক ড. এম. এ. লতিফ একজন প্রখ্যাত শিক্ষাবিদ, সাহিত্য অনুরাগী এবং সমাজসেবক। তিনি দীর্ঘ ৩০ বছর ঢাকা বিশ্ববিদ্যালয়ের বাংলা বিভাগে অধ্যাপনা করেছেন। অবসর গ্রহণের পর নিজের এলাকার সাধারণ মানুষের মাঝে জ্ঞানের আলো ছড়িয়ে দেয়ার জন্য এবং যুব সমাজকে বই পড়ায় উদ্বুদ্ধ করতে তিনি "প্রতীতি লাইব্রেরী" প্রতিষ্ঠার উদ্যোগ গ্রহণ করেন। তাঁর ব্যক্তিগত বিশাল বইয়ের সংগ্রহশালা দিয়েই এই লাইব্রেরীর যাত্রা শুরু হয়েছিল।',
    education: 'বি.এ (সম্মান) ও এম.এ (বাংলা), ঢাকা বিশ্ববিদ্যালয়; পিএইচডি (বাংলা সাহিত্য), কলকাতা বিশ্ববিদ্যালয়।',
    contributions: 'তিনি বাংলা সাহিত্য এবং শিক্ষা বিস্তারে অনবদ্য অবদানের জন্য একুশে পদকে ভূষিত হয়েছেন। তাঁর লিখিত প্রায় ১৫টি গবেষণা গ্রন্থ রয়েছে। লাইব্রেরীর জন্য তিনি জমি দান করেছেন এবং নিজস্ব তহবিল থেকে প্রতি বছর নতুন বই ক্রয়ের ব্যবস্থা করে আসছেন।',
    photoUrl: 'assets/founder.png'
};
const DEFAULT_SETTINGS = {
    libraryName: 'প্রতীতি লাইব্রেরী',
    establishYear: '২০১০',
    address: 'বাড়ি নং ১২, রোড নং ৫, ব্লক-সি, বনানী, ঢাকা-১২১৩',
    phone: '+৮৮০ ২-৯৮৭৬৫৪৩, +৮৮০ ১৭১২৩৪৫৬৭৮',
    email: 'info@protitilibrary.org',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.156381489679!2d90.40263657606994!3d23.795241187719602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70c69d80d19%3A0xcd50a006db2354c2!2sBanani%20Graveyard%20Mosque!5e0!3m2!1sen!2sbd!4v1718223847253!5m2!1sen!2sbd'
};
// ডাটাবেজ হেলপার ক্লাস
class Database {
    constructor() {
        this.init();
    }
    init() {
        if (!localStorage.getItem(DB_KEYS.CATEGORIES)) {
            localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
        }
        if (!localStorage.getItem(DB_KEYS.BOOKS)) {
            localStorage.setItem(DB_KEYS.BOOKS, JSON.stringify(DEFAULT_BOOKS));
        }
        if (!localStorage.getItem(DB_KEYS.MEMBERS)) {
            localStorage.setItem(DB_KEYS.MEMBERS, JSON.stringify(DEFAULT_MEMBERS));
        }
        if (!localStorage.getItem(DB_KEYS.GALLERY)) {
            localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
        }
        if (!localStorage.getItem(DB_KEYS.FOUNDER)) {
            localStorage.setItem(DB_KEYS.FOUNDER, JSON.stringify(DEFAULT_FOUNDER));
        }
        if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
            localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        }
    }
    // জেনেরিক গেটার
    _get(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
    // --- BOOKS ---
    getBooks() {
        return this._get(DB_KEYS.BOOKS);
    }
    _set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    saveBook(book) {
        const books = this.getBooks();
        if (book.id) {
            const index = books.findIndex(b => b.id === book.id);
            if (index !== -1) {
                const diff = parseInt(book.quantity) - parseInt(books[index].quantity || 0);
                book.available = Math.max(0, parseInt(books[index].available || 0) + diff);
                books[index] = book;
            }
        } else {
            book.id = 'book-' + Date.now();
            book.available = parseInt(book.quantity);
            books.push(book);
        }
        this._set(DB_KEYS.BOOKS, books);
        return book;
    }
    deleteBook(id) {
        let books = this.getBooks();
        books = books.filter(b => b.id !== id);
        this._set(DB_KEYS.BOOKS, books);
    }
    // --- CATEGORIES ---
    getCategories() {
        return this._get(DB_KEYS.CATEGORIES);
    }
    saveCategory(cat) {
        const categories = this.getCategories();
        if (cat.id) {
            const index = categories.findIndex(c => c.id === cat.id);
            if (index !== -1) categories[index] = cat;
        } else {
            cat.id = 'cat-' + Date.now();
            categories.push(cat);
        }
        this._set(DB_KEYS.CATEGORIES, categories);
        return cat;
    }
    deleteCategory(id) {
        let categories = this.getCategories();
        categories = categories.filter(c => c.id !== id);
        this._set(DB_KEYS.CATEGORIES, categories);
        // ক্যাটাগরি ডিলিট হলে বইয়ের ক্যাটাগরি ফাকা করা
        let books = this.getBooks();
        books = books.map(book => {
            if (book.categoryId === id) {
                book.categoryId = '';
            }
            return book;
        });
        this._set(DB_KEYS.BOOKS, books);
    }
    // --- MEMBERS ---
    getMembers() {
        return this._get(DB_KEYS.MEMBERS);
    }
    saveMember(member) {
        const members = this.getMembers();
        if (member.id) {
            const index = members.findIndex(m => m.id === member.id);
            if (index !== -1) members[index] = member;
        } else {
            member.id = 'mem-' + Date.now();
            if (!member.registrationDate) {
                const today = new Date();
                member.registrationDate = today.toISOString().split('T')[0];
            }
            members.push(member);
        }
        this._set(DB_KEYS.MEMBERS, members);
        return member;
    }
    deleteMember(id) {
        let members = this.getMembers();
        members = members.filter(m => m.id !== id);
        this._set(DB_KEYS.MEMBERS, members);
    }
    // --- GALLERY ---
    getGallery() {
        return this._get(DB_KEYS.GALLERY);
    }
    saveGalleryItem(item) {
        const gallery = this.getGallery();
        if (item.id) {
            const index = gallery.findIndex(g => g.id === item.id);
            if (index !== -1) gallery[index] = item;
        } else {
            item.id = 'gal-' + Date.now();
            gallery.push(item);
        }
        this._set(DB_KEYS.GALLERY, gallery);
        return item;
    }
    deleteGalleryItem(id) {
        let gallery = this.getGallery();
        gallery = gallery.filter(g => g.id !== id);
        this._set(DB_KEYS.GALLERY, gallery);
    }
    // --- FOUNDER ---
    getFounder() {
        return JSON.parse(localStorage.getItem(DB_KEYS.FOUNDER)) || DEFAULT_FOUNDER;
    }
    saveFounder(founder) {
        localStorage.setItem(DB_KEYS.FOUNDER, JSON.stringify(founder));
    }
    // --- SETTINGS ---
    getSettings() {
        return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    }
    saveSettings(settings) {
        localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
    }
    // --- ADMIN AUTH ---
    isAdminLoggedIn() {
        return localStorage.getItem(DB_KEYS.LOGGED_IN) === 'true';
    }
    loginAdmin(username, password) {
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem(DB_KEYS.LOGGED_IN, 'true');
            return true;
        }
        return false;
    }
    logoutAdmin() {
        localStorage.removeItem(DB_KEYS.LOGGED_IN);
    }
    // --- STATISTICS ---
    getStats() {
        const books = this.getBooks();
        const categories = this.getCategories();
        const members = this.getMembers();
        const gallery = this.getGallery();
        const settings = this.getSettings();
        const totalBookItems = books.reduce((acc, curr) => acc + parseInt(curr.quantity || 0), 0);
        
        return {
            totalBooks: totalBookItems,
            uniqueBooksCount: books.length,
            totalCategories: categories.length,
            totalMembers: members.length,
            totalGalleryItems: gallery.length,
            establishYear: settings.establishYear
        };
    }
}
// গ্লোবাল অবজেক্ট
window.db = new Database();
