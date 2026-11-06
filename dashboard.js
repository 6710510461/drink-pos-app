const Dashboard = {
  salesFilter: 'today',
  tempImageData: '',

  switchTab(tab) {
    ['sales', 'menu', 'settings'].forEach(t => {
      const cap = t.charAt(0).toUpperCase() + t.slice(1);
      document.getElementById(`tab${cap}`).classList.toggle('hidden', t !== tab);
      const btn = document.getElementById(`btnTab${cap}`);
      if (t === tab) {
        btn.className = 'px-3 sm:px-4 py-2 text-xs font-semibold border-b-2 border-amber-600 text-amber-600 whitespace-nowrap';
      } else {
        btn.className = 'px-3 sm:px-4 py-2 text-xs font-medium text-stone-500 whitespace-nowrap';
      }
    });

    if (tab === 'sales') this.renderSalesReport();
    if (tab === 'menu') this.renderOwnerMenuList();
    if (tab === 'settings') this.loadSettings();
  },

  setSalesFilter(flt) {
    this.salesFilter = flt;
    ['today', 'month', 'year', 'all'].forEach(f => {
      const btn = document.getElementById(`flt${f.charAt(0).toUpperCase() + f.slice(1)}`);
      if (f === flt) {
        btn.className = 'px-2.5 sm:px-3 py-1 rounded-lg bg-white shadow-sm font-semibold text-stone-900';
      } else {
        btn.className = 'px-2.5 sm:px-3 py-1 rounded-lg text-stone-600';
      }
    });
    this.renderSalesReport();
  },

  renderSalesReport() {
    const orders = Storage.getOrders();
    const now = new Date();
    const filtered = orders.filter(o => {
      const d = new Date(o.timestamp);
      if (this.salesFilter === 'today') return d.toDateString() === now.toDateString();
      if (this.salesFilter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (this.salesFilter === 'year') return d.getFullYear() === now.getFullYear();
      return true;
    });

    const rev = filtered.reduce((sum, o) => sum + o.totalAmount, 0);
    const cups = filtered.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0);

    document.getElementById('statRevenue').innerText = `฿${rev.toLocaleString()}`;
    document.getElementById('statOrders').innerText = filtered.length;
    document.getElementById('statCups').innerText = cups;
    document.getElementById('orderCountBadge').innerText = `${filtered.length} รายการ`;

    // Mobile Card List
    document.getElementById('salesCardListMobile').innerHTML = filtered.map(o => `
      <div class="p-3 text-xs space-y-1.5">
        <div class="flex justify-between items-center">
          <span class="font-mono font-bold text-stone-800">${o.id}</span>
          <span class="text-[11px] text-stone-400">${new Date(o.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <p class="text-stone-600">${o.items.map(it => `${it.name} (${it.quantity})`).join(', ')}</p>
        <div class="flex justify-between items-center pt-1">
          <span class="px-2 py-0.5 rounded-full text-[10px] ${o.paymentMethod === 'PromptPay' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'}">${o.paymentMethod}</span>
          <span class="font-bold text-stone-900">฿${o.totalAmount}</span>
        </div>
      </div>
    `).join('') || '<p class="text-center py-6 text-stone-400 text-xs">ไม่มีรายการในช่วงเวลานี้</p>';

    // Desktop Table
    document.getElementById('salesTableBody').innerHTML = filtered.map(o => `
      <tr>
        <td class="py-2.5 px-4 text-stone-500">${new Date(o.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
        <td class="py-2.5 px-4 font-mono font-medium">${o.id}</td>
        <td class="py-2.5 px-4">${o.items.map(it => `${it.name} (${it.quantity})`).join(', ')}</td>
        <td class="py-2.5 px-4"><span class="px-2 py-0.5 rounded-full text-[10px] ${o.paymentMethod === 'PromptPay' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'}">${o.paymentMethod}</span></td>
        <td class="py-2.5 px-4 text-right font-bold text-stone-900">฿${o.totalAmount}</td>
      </tr>
    `).join('') || '<tr><td colspan="5" class="text-center py-6 text-stone-400">ไม่มีรายการคำสั่งซื้อในช่วงเวลานี้</td></tr>';
  },

  clearOrders() {
    if (confirm('ยืนยันล้างข้อมูลยอดขายทั้งหมด?')) {
      Storage.saveOrders([]);
      this.renderSalesReport();
      App.toast('ล้างยอดขายเรียบร้อย');
    }
  },

  exportCSV() {
    const orders = Storage.getOrders();
    let csv = 'Timestamp,OrderID,Items,Method,Total\n';
    orders.forEach(o => {
      const itemSummary = o.items.map(it => `${it.name}x${it.quantity}`).join(';');
      csv += `"${o.timestamp}","${o.id}","${itemSummary}","${o.paymentMethod}",${o.totalAmount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sales_report_${Date.now()}.csv`;
    a.click();
  },

  renderOwnerMenuList() {
    const menus = Storage.getMenus();
    document.getElementById('ownerMenuList').innerHTML = menus.map(m => `
      <div class="bg-white p-3 rounded-2xl border flex gap-3 items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <img src="${m.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200'}" class="w-12 h-12 rounded-xl object-cover shrink-0">
          <div class="min-w-0">
            <h4 class="font-bold text-xs text-stone-900 truncate">${m.name}</h4>
            <p class="text-[11px] text-stone-500">เย็น ฿${m.prices.iced || '-'}</p>
          </div>
        </div>
        <div class="flex gap-1.5 shrink-0">
          <button onclick="Dashboard.openMenuModal('${m.id}')" class="p-1.5 px-2.5 rounded-lg border text-stone-600 text-xs font-medium">แก้ไข</button>
          <button onclick="Dashboard.deleteMenu('${m.id}')" class="p-1.5 px-2.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-medium">ลบ</button>
        </div>
      </div>
    `).join('');
  },

  openMenuModal(id = null) {
    document.getElementById('editMenuId').value = id || '';
    document.getElementById('menuModalTitle').innerText = id ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่';
    document.getElementById('menuFileInput').value = '';

    if (id) {
      const menus = Storage.getMenus();
      const m = menus.find(x => x.id === id);
      document.getElementById('menuName').value = m.name;
      document.getElementById('menuCat').value = m.category;
      document.getElementById('priceHot').value = m.prices.hot || '';
      document.getElementById('priceIced').value = m.prices.iced || '';
      document.getElementById('priceFrappe').value = m.prices.frappe || '';
      document.getElementById('menuImg').value = m.image || '';
      this.tempImageData = m.image || '';
      document.getElementById('imagePreview').src = m.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200';
    } else {
      document.getElementById('menuName').value = '';
      document.getElementById('priceHot').value = '';
      document.getElementById('priceIced').value = '';
      document.getElementById('priceFrappe').value = '';
      document.getElementById('menuImg').value = '';
      this.tempImageData = '';
      document.getElementById('imagePreview').src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200';
    }
    document.getElementById('menuModal').classList.remove('hidden');
  },

  closeMenuModal() {
    document.getElementById('menuModal').classList.add('hidden');
  },

  handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSize = 500;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height *= maxSize / width));
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width *= maxSize / height));
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        this.tempImageData = compressed;
        document.getElementById('imagePreview').src = compressed;
        document.getElementById('menuImg').value = '';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  },

  handleImageUrlInput(url) {
    if (url.trim()) {
      this.tempImageData = url.trim();
      document.getElementById('imagePreview').src = url.trim();
    }
  },

  saveMenu(e) {
    e.preventDefault();
    const id = document.getElementById('editMenuId').value;
    const prices = {};
    if (document.getElementById('priceHot').value) prices.hot = Number(document.getElementById('priceHot').value);
    if (document.getElementById('priceIced').value) prices.iced = Number(document.getElementById('priceIced').value);
    if (document.getElementById('priceFrappe').value) prices.frappe = Number(document.getElementById('priceFrappe').value);

    const data = {
      id: id || 'm_' + Date.now(),
      name: document.getElementById('menuName').value,
      category: document.getElementById('menuCat').value,
      prices: prices,
      image: this.tempImageData || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500'
    };

    const menus = Storage.getMenus();
    if (id) {
      const idx = menus.findIndex(m => m.id === id);
      menus[idx] = data;
    } else {
      menus.push(data);
    }

    Storage.saveMenus(menus);
    this.closeMenuModal();
    this.renderOwnerMenuList();
    Storefront.renderMenus();
    App.toast('บันทึกเมนูสำเร็จ');
  },

  deleteMenu(id) {
    if (confirm('ต้องการลบเมนูนี้หรือไม่?')) {
      const menus = Storage.getMenus().filter(m => m.id !== id);
      Storage.saveMenus(menus);
      this.renderOwnerMenuList();
      Storefront.renderMenus();
      App.toast('ลบเมนูเรียบร้อย');
    }
  },

  loadSettings() {
    const c = Storage.getConfig();
    document.getElementById('cfgStoreName').value = c.storeName;
    document.getElementById('cfgTagline').value = c.tagline;
    document.getElementById('cfgHeroTitle').value = c.heroTitle;
    document.getElementById('cfgHeroSubtext').value = c.heroSubtext;
    document.getElementById('cfgPromptPayId').value = c.promptPayId || '';
    document.getElementById('cfgQrEnabled').checked = !!c.qrEnabled;
    document.getElementById('cfgOwnerPin').value = c.ownerPin;
  },

  saveSettings(e) {
    e.preventDefault();
    const old = Storage.getConfig();
    const updated = {
      storeName: document.getElementById('cfgStoreName').value,
      tagline: document.getElementById('cfgTagline').value,
      heroTitle: document.getElementById('cfgHeroTitle').value,
      heroSubtext: document.getElementById('cfgHeroSubtext').value,
      heroBadge: old.heroBadge,
      promptPayId: document.getElementById('cfgPromptPayId').value,
      qrEnabled: document.getElementById('cfgQrEnabled').checked,
      ownerPin: document.getElementById('cfgOwnerPin').value
    };
    Storage.saveConfig(updated);
    App.renderBranding();
    App.toast('บันทึกการตั้งค่าร้านแล้ว');
  }
  
  downloadAppFile() {
    const htmlContent = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    const config = Storage.getConfig();
    const filename = (config.storeName || 'drink_pos_app').replace(/\s+/g, '_') + '.html';
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    App.toast('ดาวน์โหลดแอปเรียบร้อยแล้ว');
  }
};