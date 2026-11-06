const App = {
  currentView: 'customer',

  init() {
    this.renderBranding();
    Storefront.renderCategoryTabs();
    Storefront.renderMenus();
    Dashboard.renderSalesReport();
    if (window.lucide) lucide.createIcons();
  },

  renderBranding() {
    const c = Storage.getConfig();
    document.getElementById('headerStoreName').innerText = c.storeName;
    document.getElementById('headerTagline').innerText = c.tagline;
    document.getElementById('heroBadge').innerText = c.heroBadge;
    document.getElementById('heroTitle').innerText = c.heroTitle;
    document.getElementById('heroSubtext').innerText = c.heroSubtext;
  },

  toast(msg) {
    const el = document.getElementById('toastNotification');
    document.getElementById('toastMessage').innerText = msg;
    el.classList.remove('-translate-y-24', 'opacity-0');
    setTimeout(() => el.classList.add('-translate-y-24', 'opacity-0'), 2500);
  },

  switchView(view) {
    this.currentView = view;
    document.getElementById('customerView').classList.toggle('hidden', view !== 'customer');
    document.getElementById('ownerView').classList.toggle('hidden', view !== 'owner');
    document.getElementById('navOwnerText').innerText = view === 'owner' ? 'กลับหน้าร้าน' : 'สำหรับเจ้าของร้าน';
    if (view === 'owner') Dashboard.renderSalesReport();
    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  toggleOwnerView() {
    if (this.currentView === 'owner') {
      this.switchView('customer');
    } else {
      document.getElementById('pinInput').value = '';
      document.getElementById('pinModal').classList.remove('hidden');
    }
  },

  closePinModal() {
    document.getElementById('pinModal').classList.add('hidden');
  },

  verifyPin(e) {
    e.preventDefault();
    const pin = document.getElementById('pinInput').value;
    const config = Storage.getConfig();
    if (pin === config.ownerPin) {
      this.closePinModal();
      this.switchView('owner');
      this.toast('เข้าสู่ระบบสำเร็จ');
    } else {
      alert('รหัส PIN ไม่ถูกต้อง (ค่าเริ่มต้น: 1234)');
    }
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());