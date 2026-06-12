// প্রতীতি লাইব্রেরী - এডমিন প্যানেল স্ক্রিপ্ট (admin.js)
class AdminManager {
    constructor() {
        this.activeTab = 'dashboard';
        this.editingItemId = null; // এডিটিং অবজেক্ট ট্র্যাকিং
    }
    // এডমিন ভিউ রেন্ডারার (লগইন বা ড্যাশবোর্ড)
    renderAdminView() {
        const contentArea = document.getElementById('app-content');
        if (!window.db.isAdminLoggedIn()) {
            this.renderLogin(contentArea);
        } else {
            this.renderDashboardLayout(contentArea);
        }
    }
    // ১. এডমিন লগইন ভিউ
    renderLogin(container) {
        container.innerHTML = `
            <div class="container admin-login-container">
                <div class="login-card">
                    <div class="login-card-header">
                        <i class="fa-solid fa-lock-open"></i>
                        <h2>এডমিন লগইন</h2>
                        <p style="color: var(--text-muted); font-size:14px; margin-top:5px;">প্রতীতি লাইব্রেরী এডমিন প্যানেল</p>
                    </div>
                    <form id="admin-login-form">
                        <div class="form-group">
                            <label class="form-label" for="login-username">ইউজারনেম</label>
                            <input type="text" id="login-username" class="form-input" placeholder="ইউজারনেম দিন (admin)" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="login-password">পাসওয়ার্ড</label>
                            <input type="password" id="login-password" class="form-input" placeholder="পাসওয়ার্ড দিন (admin123)" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="fa-solid fa-right-to-bracket"></i> লগইন করুন</button>
                    </form>
                </div>
            </div>
        `;
        const form = document.getElementById('admin-login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = document.getElementById('login-username').value.trim();
                const pass = document.getElementById('login-password').value.trim();
                if (window.db.loginAdmin(user, pass)) {
                    showToast('সফলভাবে লগইন করা হয়েছে!', 'success');
                    this.renderAdminView();
                    // এডমিন বাটন আপডেট
                    this.updateAdminNavBtn();
                } else {
                    showToast('ভুল ইউজারনেম বা পাসওয়ার্ড!', 'error');
                }
            });
        }
    }
    // এডমিন নেভিগেশন বাটনের লেখা পরিবর্তন
    updateAdminNavBtn() {
        const btn = document.getElementById('admin-nav-btn');
        if (!btn) return;
        if (window.db.isAdminLoggedIn()) {
            btn.innerHTML = `<i class="fa-solid fa-desktop"></i> <span>ড্যাশবোর্ড</span>`;
        } else {
            btn.innerHTML = `<i class="fa-solid fa-user-shield"></i> <span>এডমিন প্যানেল</span>`;
        }
    }
    // ২. ড্যাশবোর্ড লেআউট
    renderDashboardLayout(container) {
        const settings = window.db.getSettings();
        container.innerHTML = `
            <div class="container" style="padding-top: 48px;">
                <div class="section-title-wrapper" style="margin-bottom:30px">
                    <span class="section-tag">${settings.libraryName}</span>
                    <h2 class="section-title">এডমিন প্যানেল</h2>
                </div>
                <div class="admin-dashboard-layout">
                    <!-- বাম সাইডবার মেনু -->
                    <aside class="admin-sidebar">
                        <div class="admin-sidebar-header">
                            <h4>এডমিন ড্যাশবোর্ড</h4>
                            <p>অনলাইন মোড</p>
                        </div>
                        <ul class="admin-menu">
                            <li class="admin-menu-item ${this.activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
                                <i class="fa-solid fa-chart-pie"></i> ড্যাশবোর্ড
                            </li>
                            <li class="admin-menu-item ${this.activeTab === 'books' ? 'active' : ''}" data-tab="books">
                                <i class="fa-solid fa-book"></i> বই ব্যবস্থাপনা
                            </li>
                            <li class="admin-menu-item ${this.activeTab === 'categories' ? 'active' : ''}" data-tab="categories">
                                <i class="fa-solid fa-tags"></i> ক্যাটাগরি ব্যবস্থাপনা
                            </li>
                            <li class="admin-menu-item ${this.activeTab === 'members' ? 'active' : ''}" data-tab="members">
                                <i class="fa-solid fa-users"></i> সদস্য ব্যবস্থাপনা
                            </li>
                            <li class="admin-menu-item ${this.activeTab === 'gallery' ? 'active' : ''}" data-tab="gallery">
                                <i class="fa-solid fa-image"></i> গ্যালারি ব্যবস্থাপনা
                            </li>
                            <li class="admin-menu-item ${this.activeTab === 'founder' ? 'active' : ''}" data-tab="founder">
                                <i class="fa-solid fa-user-tie"></i> প্রতিষ্ঠাতা তথ্য
                            </li>
                            <li class="admin-menu-item ${this.activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
                                <i class="fa-solid fa-gears"></i> ওয়েবসাইট সেটিংস
                            </li>
                            <li class="admin-menu-item logout" id="admin-logout-btn">
                                <i class="fa-solid fa-right-from-bracket"></i> লগআউট করুন
                            </li>
                        </ul>
                    </aside>
                    <!-- ডান কন্টেন্ট প্যানেল -->
                    <section class="admin-content-card" id="admin-main-panel">
                        <!-- ডাইনামিকালি রেন্ডার হবে -->
                    </section>
                </div>
            </div>
        `;
        // সাইডবার মেনু নেভিগেশন বাইন্ড করা
        const menuItems = document.querySelectorAll('.admin-menu-item:not(.logout)');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.activeTab = item.getAttribute('data-tab');
                this.renderActiveTab();
            });
        });
        // লগআউট হ্যান্ডলার
        const logoutBtn = document.getElementById('admin-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.db.logoutAdmin();
                showToast('সফলভাবে লগআউট করা হয়েছে!', 'success');
                this.renderAdminView();
                this.updateAdminNavBtn();
            });
        }
        // একটিভ ট্যাব রেন্ডার করা
        this.renderActiveTab();
    }
    // ৩. মেথড যা একটিভ ট্যাব রেন্ডার করে
    renderActiveTab() {
        const panel = document.getElementById('admin-main-panel');
        if (!panel) return;
        switch (this.activeTab) {
            case 'dashboard':
                this.renderDashboardTab(panel);
                break;
            case 'books':
                this.renderBooksTab(panel);
                break;
            case 'categories':
                this.renderCategoriesTab(panel);
                break;
            case 'members':
                this.renderMembersTab(panel);
                break;
            case 'gallery':
                this.renderGalleryTab(panel);
                break;
            case 'founder':
                this.renderFounderTab(panel);
                break;
            case 'settings':
                this.renderSettingsTab(panel);
                break;
        }
    }
    // ৩.১ ড্যাশবোর্ড ট্যাব রেন্ডার
    renderDashboardTab(panel) {
        const stats = window.db.getStats();
        const members = window.db.getMembers().slice(-3).reverse();
        const books = window.db.getBooks().slice(-3).reverse();
        panel.innerHTML = `
            <div class="admin-card-header">
                <h3>ড্যাশবোর্ড পরিসংখ্যান</h3>
            </div>
            
            <div class="admin-stats-grid">
                <div class="admin-stat-box">
                    <div class="admin-stat-box-left">
                        <h5>মোট বইয়ের কপি</h5>
                        <h3>${toBengaliNumber(stats.totalBooks)}</h3>
                    </div>
                    <div class="admin-stat-box-icon"><i class="fa-solid fa-book"></i></div>
                </div>
                <div class="admin-stat-box">
                    <div class="admin-stat-box-left">
                        <h5>নিবন্ধিত সদস্য</h5>
                        <h3>${toBengaliNumber(stats.totalMembers)}</h3>
                    </div>
                    <div class="admin-stat-box-icon"><i class="fa-solid fa-users"></i></div>
                </div>
                <div class="admin-stat-box">
                    <div class="admin-stat-box-left">
                        <h5>বইয়ের আইটেম</h5>
                        <h3>${toBengaliNumber(stats.uniqueBooksCount)}</h3>
                    </div>
                    <div class="admin-stat-box-icon"><i class="fa-solid fa-tags"></i></div>
                </div>
            </div>
            <div class="recent-activity-section" style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                <div>
                    <h4 style="margin-bottom:12px; color:var(--primary)"><i class="fa-solid fa-user-plus"></i> সদ্য নিবন্ধিত সদস্য</h4>
                    <div class="table-responsive">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>নাম</th>
                                    <th>ফোন</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${members.map(m => `
                                    <tr>
                                        <td>${m.name}</td>
                                        <td style="font-family:var(--font-english)">${m.phone}</td>
                                    </tr>
                                `).join('')}
                                ${members.length === 0 ? '<tr><td colspan="2" style="text-align:center">কোন সদস্য নেই</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h4 style="margin-bottom:12px; color:var(--primary)"><i class="fa-solid fa-book-medical"></i> নতুন বইসমূহ</h4>
                    <div class="table-responsive">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>কভার</th>
                                    <th>বইয়ের নাম</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${books.map(b => `
                                    <tr>
                                        <td><img src="${b.coverImage}" class="table-img" onerror="this.src=getBookCoverFallback('${b.title}', '${b.author}')"></td>
                                        <td><strong>${b.title}</strong><br><small>${b.author}</small></td>
                                    </tr>
                                `).join('')}
                                ${books.length === 0 ? '<tr><td colspan="2" style="text-align:center">কোন বই নেই</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    // ৩.২ বই ব্যবস্থাপনা ট্যাব রেন্ডার (CRUD)
    renderBooksTab(panel) {
        const books = window.db.getBooks();
        const categories = window.db.getCategories();
        panel.innerHTML = `
            <div class="admin-card-header">
                <h3>বই ব্যবস্থাপনা</h3>
                <button class="btn btn-primary" id="add-book-btn" style="padding: 8px 16px; font-size:14px;">
                    <i class="fa-solid fa-circle-plus"></i> নতুন বই যোগ
                </button>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>কভার</th>
                            <th>বইয়ের নাম</th>
                            <th>লেখক</th>
                            <th>ক্যাটাগরি</th>
                            <th>সংখ্যা (পড়ার/মোট)</th>
                            <th>অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${books.map(book => {
                            const cat = categories.find(c => c.id === book.categoryId);
                            const catName = cat ? cat.name : 'অন্যান্য';
                            return `
                                <tr>
                                    <td><img src="${book.coverImage}" class="table-img" onerror="this.src=getBookCoverFallback('${book.title}', '${book.author}')"></td>
                                    <td><strong>${book.title}</strong><br><small>${book.publisher}</small></td>
                                    <td>${book.author}</td>
                                    <td>${catName}</td>
                                    <td style="font-family:var(--font-english)">${book.available} / ${book.quantity}</td>
                                    <td>
                                        <div class="action-btns">
                                            <button class="btn-icon btn-icon-edit edit-book-btn" data-id="${book.id}" title="সম্পাদনা"><i class="fa-solid fa-pen"></i></button>
                                            <button class="btn-icon btn-icon-delete delete-book-btn" data-id="${book.id}" title="মুছে ফেলুন"><i class="fa-solid fa-trash-can"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                        ${books.length === 0 ? '<tr><td colspan="6" style="text-align:center">কোন বই পাওয়া যায়নি</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        `;
        // ইভেন্ট লিসেনার বাইন্ড করা
        document.getElementById('add-book-btn').addEventListener('click', () => this.openBookModal());
        
        document.querySelectorAll('.edit-book-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.openBookModal(id);
            });
        });
        document.querySelectorAll('.delete-book-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('আপনি কি নিশ্চিত যে এই বইটি মুছে ফেলতে চান?')) {
                    window.db.deleteBook(id);
                    showToast('বইটি মুছে ফেলা হয়েছে!', 'success');
                    this.renderActiveTab();
                }
            });
        });
    }
    // বই যোগ বা এডিটের মডাল ওপেন
    openBookModal(bookId = null) {
        this.editingItemId = bookId;
        const categories = window.db.getCategories();
        let book = { title: '', author: '', categoryId: '', publisher: '', description: '', coverImage: '', quantity: 1 };
        
        if (bookId) {
            const found = window.db.getBooks().find(b => b.id === bookId);
            if (found) book = { ...found };
        }
        // মডাল ওভারলে জেনারেট ও ডিক্লেয়ার করা
        let modal = document.getElementById('admin-modal-overlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'admin-modal-overlay';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div class="modal-content-card">
                <div class="modal-header">
                    <h4>${bookId ? 'বই তথ্য সম্পাদনা' : 'নতুন বই যোগ করুন'}</h4>
                    <button class="modal-close-btn" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="book-modal-form">
                    <div class="form-group">
                        <label class="form-label" for="m-title">বইয়ের নাম <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="m-title" class="form-input" value="${book.title}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="m-author">লেখক <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="m-author" class="form-input" value="${book.author}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="m-cat">ক্যাটাগরি <span style="color:var(--danger)">*</span></label>
                        <select id="m-cat" class="form-select" required>
                            <option value="">ক্যাটাগরি সিলেক্ট করুন</option>
                            ${categories.map(c => `
                                <option value="${c.id}" ${book.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="m-pub">প্রকাশনী <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="m-pub" class="form-input" value="${book.publisher}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="m-img">কভার ছবি (URL)</label>
                        <input type="url" id="m-img" class="form-input" value="${book.coverImage}" placeholder="যেমন: https://unsplash.com/...">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="m-qty">মোট কপি সংখ্যা <span style="color:var(--danger)">*</span></label>
                        <input type="number" id="m-qty" class="form-input" value="${book.quantity}" min="1" required style="font-family:var(--font-english)">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="m-desc">বইয়ের বিবরণ</label>
                        <textarea id="m-desc" class="form-textarea" required>${book.description}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%"><i class="fa-solid fa-floppy-disk"></i> সংরক্ষণ করুন</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
        // মডাল ক্লোজ লিসেনার
        const closeModal = () => modal.classList.remove('active');
        document.getElementById('modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        // ফর্ম সাবমিট হ্যান্ডলার
        document.getElementById('book-modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const updatedBook = {
                title: document.getElementById('m-title').value.trim(),
                author: document.getElementById('m-author').value.trim(),
                categoryId: document.getElementById('m-cat').value,
                publisher: document.getElementById('m-pub').value.trim(),
                coverImage: document.getElementById('m-img').value.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
                quantity: parseInt(document.getElementById('m-qty').value),
                description: document.getElementById('m-desc').value.trim()
            };
            if (this.editingItemId) {
                updatedBook.id = this.editingItemId;
            }
            window.db.saveBook(updatedBook);
            showToast(this.editingItemId ? 'বই তথ্য আপডেট করা হয়েছে!' : 'নতুন বই সফলভাবে যুক্ত করা হয়েছে!', 'success');
            closeModal();
            this.renderActiveTab();
        });
    }
    // ৩.৩ ক্যাটাগরি ব্যবস্থাপনা ট্যাব রেন্ডার (CRUD)
    renderCategoriesTab(panel) {
        const categories = window.db.getCategories();
        panel.innerHTML = `
            <div class="admin-card-header">
                <h3>ক্যাটাগরি ব্যবস্থাপনা</h3>
                <button class="btn btn-primary" id="add-cat-btn" style="padding: 8px 16px; font-size:14px;">
                    <i class="fa-solid fa-plus"></i> নতুন ক্যাটাগরি
                </button>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>আইডি</th>
                            <th>ক্যাটাগরি নাম</th>
                            <th>অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${categories.map(cat => `
                            <tr>
                                <td style="font-family:var(--font-english)">${cat.id}</td>
                                <td><strong>${cat.name}</strong></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="btn-icon btn-icon-edit edit-cat-btn" data-id="${cat.id}"><i class="fa-solid fa-pen"></i></button>
                                        <button class="btn-icon btn-icon-delete delete-cat-btn" data-id="${cat.id}"><i class="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${categories.length === 0 ? '<tr><td colspan="3" style="text-align:center">কোন ক্যাটাগরি পাওয়া যায়নি</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('add-cat-btn').addEventListener('click', () => this.openCategoryModal());
        document.querySelectorAll('.edit-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.openCategoryModal(id);
            });
        });
        document.querySelectorAll('.delete-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('ক্যাটাগরি ডিলিট করলে ঐ ক্যাটাগরির বইগুলো ক্যাটাগরিহীন হয়ে যাবে। ডিলিট করতে চান?')) {
                    window.db.deleteCategory(id);
                    showToast('ক্যাটাগরি মুছে ফেলা হয়েছে!', 'success');
                    this.renderActiveTab();
                }
            });
        });
    }
    // ক্যাটাগরি মডাল ওপেন
    openCategoryModal(catId = null) {
        this.editingItemId = catId;
        let cat = { name: '' };
        if (catId) {
            const found = window.db.getCategories().find(c => c.id === catId);
            if (found) cat = { ...found };
        }
        let modal = document.getElementById('admin-modal-overlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'admin-modal-overlay';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div class="modal-content-card" style="max-width: 450px;">
                <div class="modal-header">
                    <h4>${catId ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি যোগ করুন'}</h4>
                    <button class="modal-close-btn" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="cat-modal-form">
                    <div class="form-group">
                        <label class="form-label" for="mc-name">ক্যাটাগরির নাম <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="mc-name" class="form-input" value="${cat.name}" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%"><i class="fa-solid fa-floppy-disk"></i> সংরক্ষণ করুন</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
        const closeModal = () => modal.classList.remove('active');
        document.getElementById('modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.getElementById('cat-modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedCat = {
                name: document.getElementById('mc-name').value.trim()
            };
            if (this.editingItemId) {
                updatedCat.id = this.editingItemId;
            }
            window.db.saveCategory(updatedCat);
            showToast(this.editingItemId ? 'ক্যাটাগরি আপডেট করা হয়েছে!' : 'নতুন ক্যাটাগরি যুক্ত করা হয়েছে!', 'success');
            closeModal();
            this.renderActiveTab();
        });
    }
    // ৩.৪ সদস্য ব্যবস্থাপনা ট্যাব রেন্ডার (সদস্য তালিকা ও ডিলিট)
    renderMembersTab(panel) {
        const members = window.db.getMembers();
        panel.innerHTML = `
            <div class="admin-card-header">
                <h3>সদস্য তালিকা</h3>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>আইডি</th>
                            <th>নাম</th>
                            <th>মোবাইল</th>
                            <th>ইমেইল</th>
                            <th>ঠিকানা</th>
                            <th>নিবন্ধন তারিখ</th>
                            <th>অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${members.map(mem => `
                            <tr>
                                <td style="font-family:var(--font-english)">${mem.id}</td>
                                <td><strong>${mem.name}</strong></td>
                                <td style="font-family:var(--font-english)">${mem.phone}</td>
                                <td style="font-family:var(--font-english)">${mem.email}</td>
                                <td>${mem.address}</td>
                                <td style="font-family:var(--font-english)">${mem.registrationDate}</td>
                                <td>
                                    <div class="action-btns">
                                        <button class="btn-icon btn-icon-delete delete-mem-btn" data-id="${mem.id}"><i class="fa-solid fa-user-minus"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${members.length === 0 ? '<tr><td colspan="7" style="text-align:center">কোন সদস্যের তথ্য পাওয়া যায়নি</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        `;
        document.querySelectorAll('.delete-mem-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('আপনি কি নিশ্চিত যে এই সদস্যের সদস্যপদ বাতিল ও ডিলিট করতে চান?')) {
                    window.db.deleteMember(id);
                    showToast('সদস্য তথ্য মুছে ফেলা হয়েছে!', 'success');
                    this.renderActiveTab();
                }
            });
        });
    }
    // ৩.৫ গ্যালারি ব্যবস্থাপনা ট্যাব রেন্ডার (CRUD)
    renderGalleryTab(panel) {
        const gallery = window.db.getGallery();
        panel.innerHTML = `
            <div class="admin-card-header">
                <h3>গ্যালারি ব্যবস্থাপনা</h3>
                <button class="btn btn-primary" id="add-gal-btn" style="padding: 8px 16px; font-size:14px;">
                    <i class="fa-solid fa-plus"></i> ছবি যোগ করুন
                </button>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ছবি</th>
                            <th>শিরোনাম</th>
                            <th>ট্যাগ/ক্যাটাগরি</th>
                            <th>অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${gallery.map(item => `
                            <tr>
                                <td><img src="${item.imageUrl}" class="table-img" style="width:64px; height:48px;" onerror="this.src='https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'"></td>
                                <td><strong>${item.title}</strong></td>
                                <td>${item.category}</td>
                                <td>
                                    <div class="action-btns">
                                        <button class="btn-icon btn-icon-delete delete-gal-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${gallery.length === 0 ? '<tr><td colspan="4" style="text-align:center">গ্যালারিতে কোন ছবি নেই</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('add-gal-btn').addEventListener('click', () => this.openGalleryModal());
        document.querySelectorAll('.delete-gal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('আপনি কি গ্যালারি থেকে এই ছবিটি মুছে ফেলতে চান?')) {
                    window.db.deleteGalleryItem(id);
                    showToast('ছবিটি মুছে ফেলা হয়েছে!', 'success');
                    this.renderActiveTab();
                }
            });
        });
    }
    // গ্যালারি ছবি যোগ করার মডাল
    openGalleryModal() {
        let modal = document.getElementById('admin-modal-overlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'admin-modal-overlay';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div class="modal-content-card" style="max-width: 500px;">
                <div class="modal-header">
                    <h4>নতুন গ্যালারি ছবি যোগ করুন</h4>
                    <button class="modal-close-btn" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="gal-modal-form">
                    <div class="form-group">
                        <label class="form-label" for="mg-title">ছবির শিরোনাম <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="mg-title" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="mg-url">ছবির লিংক (URL) <span style="color:var(--danger)">*</span></label>
                        <input type="url" id="mg-url" class="form-input" placeholder="যেমন: https://unsplash.com/..." required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="mg-cat">ক্যাটাগরি/ট্যাগ <span style="color:var(--danger)">*</span></label>
                        <select id="mg-cat" class="form-select" required>
                            <option value="">সিলেক্ট করুন</option>
                            <option value="লাইব্রেরী প্রাঙ্গণ">লাইব্রেরী প্রাঙ্গণ</option>
                            <option value="অনুষ্ঠানসমূহ">অনুষ্ঠানসমূহ</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%"><i class="fa-solid fa-floppy-disk"></i> যোগ করুন</button>
                </form>
            </div>
        `;
        modal.classList.add('active');
        const closeModal = () => modal.classList.remove('active');
        document.getElementById('modal-close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.getElementById('gal-modal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = {
                title: document.getElementById('mg-title').value.trim(),
                imageUrl: document.getElementById('mg-url').value.trim(),
                category: document.getElementById('mg-cat').value
            };
            window.db.saveGalleryItem(newItem);
            showToast('গ্যালারিতে নতুন ছবি যুক্ত করা হয়েছে!', 'success');
            closeModal();
            this.renderActiveTab();
        });
    }
    // ৩.৬ প্রতিষ্ঠাতা তথ্য সম্পাদনা ট্যাব
    renderFounderTab(panel) {
        const founder = window.db.getFounder();
        panel.innerHTML = `
            <div class="admin-card-header">
                <h3>প্রতিষ্ঠাতা তথ্য সম্পাদনা</h3>
            </div>
            
            <form id="admin-founder-form">
                <div class="form-group">
                    <label class="form-label" for="f-name">প্রতিষ্ঠাতার নাম</label>
                    <input type="text" id="f-name" class="form-input" value="${founder.name}" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="f-bio">জীবনী</label>
                    <textarea id="f-bio" class="form-textarea" style="height:150px;" required>${founder.bio}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="f-edu">শিক্ষা</label>
                    <input type="text" id="f-edu" class="form-input" value="${founder.education}" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="f-cont">অবদান</label>
                    <textarea id="f-cont" class="form-textarea" style="height:100px;" required>${founder.contributions}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="f-img">ছবির পথ (Local Assets বা URL)</label>
                    <input type="text" id="f-img" class="form-input" value="${founder.photoUrl}" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; max-width:200px;"><i class="fa-solid fa-floppy-disk"></i> সংরক্ষণ করুন</button>
            </form>
        `;
        document.getElementById('admin-founder-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const updated = {
                name: document.getElementById('f-name').value.trim(),
                bio: document.getElementById('f-bio').value.trim(),
                education: document.getElementById('f-edu').value.trim(),
                contributions: document.getElementById('f-cont').value.trim(),
                photoUrl: document.getElementById('f-img').value.trim()
            };
            window.db.saveFounder(updated);
            showToast('প্রতিষ্ঠাতার তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!', 'success');
        });
    }
    // ৩.৭ ওয়েবসাইট সেটিংস সম্পাদনা ট্যাব
    renderSettingsTab(panel) {
        const settings = window.db.getSettings();
        panel.innerHTML = `
            <div class="admin-card-header">
                <h3>ওয়েবসাইট সেটিংস</h3>
            </div>
            
            <form id="admin-settings-form">
                <div class="form-group" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                    <div>
                        <label class="form-label" for="s-name">লাইব্রেরীর নাম</label>
                        <input type="text" id="s-name" class="form-input" value="${settings.libraryName}" required>
                    </div>
                    <div>
                        <label class="form-label" for="s-year">প্রতিষ্ঠার সাল</label>
                        <input type="text" id="s-year" class="form-input" value="${settings.establishYear}" required style="font-family:var(--font-english)">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="s-addr">ঠিকানা</label>
                    <input type="text" id="s-addr" class="form-input" value="${settings.address}" required>
                </div>
                <div class="form-group" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                    <div>
                        <label class="form-label" for="s-phone">ফোন নম্বর (কমা দিয়ে একাধিক)</label>
                        <input type="text" id="s-phone" class="form-input" value="${settings.phone}" required>
                    </div>
                    <div>
                        <label class="form-label" for="s-email">ইমেইল ঠিকানা</label>
                        <input type="email" id="s-email" class="form-input" value="${settings.email}" required style="font-family:var(--font-english)">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="s-map">গুগল ম্যাপ এমবেড লিংক (iframe src)</label>
                    <textarea id="s-map" class="form-textarea" style="height:90px; font-family:var(--font-english)" required>${settings.mapUrl}</textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; max-width:200px;"><i class="fa-solid fa-floppy-disk"></i> সেটিংস সংরক্ষণ করুন</button>
            </form>
        `;
        document.getElementById('admin-settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const updated = {
                libraryName: document.getElementById('s-name').value.trim(),
                establishYear: document.getElementById('s-year').value.trim(),
                address: document.getElementById('s-addr').value.trim(),
                phone: document.getElementById('s-phone').value.trim(),
                email: document.getElementById('s-email').value.trim(),
                mapUrl: document.getElementById('s-map').value.trim()
            };
            window.db.saveSettings(updated);
            showToast('ওয়েবসাইট সেটিংস সফলভাবে সেভ করা হয়েছে!', 'success');
            
            // সাইটের নেভিগেশন বার রিফ্রেশ করতে রিলোড ট্রিগার
            setTimeout(() => window.location.reload(), 1000);
        });
    }
}
// গ্লোবাল ডিক্লেয়ারেশন
window.adminManager = new AdminManager();
window.adminManager.updateAdminNavBtn();
