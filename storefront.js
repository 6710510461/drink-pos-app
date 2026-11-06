const Storefront = {
  cart: [],
  filterCategory: 'all',
  searchTerm: '',
  customizingItem: null,
  selection: { type: 'iced', sweetness: '100%', ice: 'ปกติ', toppings: [] },

  renderCategoryTabs() {
    const container = document.getElementById('categoryFilterContainer');
    container.innerHTML = Config.CATEGORIES.map(cat => `
      <button onclick="Storefront.setCategory('${cat.id}')" class="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${this.filterCategory === cat.id ? 'bg-amber-600 text-white shadow-sm' : 'bg-white border border-stone-200 text-stone-600'}">
        ${cat.name}
      </button>
    `).join('');
  },

  setCategory(catId) {
    this.filterCategory = catId;
    this.renderCategoryTabs();
    this.renderMenus();
  },

  handleSearch(val) {
    this.searchTerm = val.trim().toLowerCase();
    this.renderMenus();
  },

  renderMenus() {
    const menus = Storage.getMenus();
    const grid = document.getElementById('menuGrid');
    const empty = document.getElementById('noMenuState');
    const filtered = menus.filter(m => {
      const matchCat = this.filterCategory === 'all' || m.category === this.filterCategory;
      const matchSearch = m.name.toLowerCase().includes(this.searchTerm);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    grid.innerHTML = filtered.map(m => {
      const minPrice = Math.min(...Object.values(m.prices).filter(p => p > 0));
      return `
        <div onclick="Storefront.openCustomizeModal('${m.id}')" class="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-stone-100 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between">
          <div class="aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 mb-2 sm:mb-3 relative">
            <img src="${m.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500'}" alt="${m.name}" class="w-full h-full object-cover">
          </div>
          <div>
            <h3 class="font-bold text-xs sm:text-sm text-stone-800 line-clamp-1">${m.name}</h3>
            <div class="flex items-center justify-between mt-1 sm:mt-2">
              <span class="text-amber-600 font-bold text-xs sm:text-sm">฿${minPrice}</span>
              <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-bold">+</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    if (window.lucide) lucide.createIcons();
  },

  openCustomizeModal(menuId) {
    const menus = Storage.getMenus();
    const item = menus.find(m => m.id === menuId);
    if (!item) return;
    this.customizingItem = item;
    const availableTypes = Object.keys(item.prices);
    this.selection = {
      type: availableTypes.includes('iced') ? 'iced' : availableTypes[0],
      sweetness: '100%',
      ice: 'ปกติ',
      toppings: []
    };
    this.renderCustomizeUI();
    document.getElementById('customizeModal').classList.remove('hidden');
  },

  closeCustomizeModal() {
    document.getElementById('customizeModal').classList.add('hidden');
  },

  renderCustomizeUI() {
    const item = this.customizingItem;
    document.getElementById('cName').innerText = item.name;
    const typeLabels = { hot: 'ร้อน', iced: 'เย็น', frappe: 'ปั่น' };
    
    document.getElementById('cTypes').innerHTML = Object.entries(item.prices).map(([t, price]) => `
      <button onclick="Storefront.selectType('${t}')" class="py-2 rounded-xl text-xs font-semibold border ${this.selection.type === t ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-600'}">
        ${typeLabels[t]} (฿${price})
      </button>
    `).join('');

    const sweetLevels = ['0%', '25%', '50%', '100%'];
    document.getElementById('cSweetness').innerHTML = sweetLevels.map(s => `
      <button onclick="Storefront.selectSweetness('${s}')" class="py-1.5 rounded-xl text-xs border ${this.selection.sweetness === s ? 'border-amber-600 bg-amber-50 text-amber-700 font-bold' : 'border-stone-200 text-stone-600'}">
        ${s}
      </button>
    `).join('');

    const iceWrapper = document.getElementById('cIceWrapper');
    if (this.selection.type === 'hot') {
      iceWrapper.classList.add('hidden');
    } else {
      iceWrapper.classList.remove('hidden');
      const iceLevels = ['ปกติ', 'น้อย', 'ไม่ใส่'];
      document.getElementById('cIce').innerHTML = iceLevels.map(i => `
        <button onclick="Storefront.selectIce('${i}')" class="py-1.5 rounded-xl text-xs border ${this.selection.ice === i ? 'border-amber-600 bg-amber-50 text-amber-700 font-bold' : 'border-stone-200 text-stone-600'}">
          ${i}
        </button>
      `).join('');
    }

    document.getElementById('cToppings').innerHTML = Config.TOPPINGS.map(top => {
      const checked = this.selection.toppings.some(t => t.id === top.id);
      return `
        <div onclick="Storefront.toggleTopping('${top.id}')" class="flex items-center justify-between p-2 rounded-xl border cursor-pointer ${checked ? 'border-amber-600 bg-amber-50' : 'border-stone-200'}">
          <span class="text-xs font-medium text-stone-700">${top.name}</span>
          <span class="text-xs font-bold text-amber-700">+฿${top.price}</span>
        </div>
      `;
    }).join('');

    document.getElementById('cTotalPrice').innerText = `฿${this.calcCustomTotal()}`;
  },

  selectType(t) { this.selection.type = t; this.renderCustomizeUI(); },
  selectSweetness(s) { this.selection.sweetness = s; this.renderCustomizeUI(); },
  selectIce(i) { this.selection.ice = i; this.renderCustomizeUI(); },
  toggleTopping(id) {
    const top = Config.TOPPINGS.find(t => t.id === id);
    const idx = this.selection.toppings.findIndex(t => t.id === id);
    if (idx >= 0) this.selection.toppings.splice(idx, 1);
    else this.selection.toppings.push(top);
    this.renderCustomizeUI();
  },

  calcCustomTotal() {
    const base = this.customizingItem.prices[this.selection.type] || 0;
    const topSum = this.selection.toppings.reduce((acc, t) => acc + t.price, 0);
    return base + topSum;
  },

  confirmAddToCart() {
    this.cart.push({
      id: Date.now().toString(),
      name: this.customizingItem.name,
      type: this.selection.type,
      sweetness: this.selection.sweetness,
      ice: this.selection.type === 'hot' ? '-' : this.selection.ice,
      toppings: [...this.selection.toppings],
      price: this.calcCustomTotal(),
      quantity: 1
    });
    this.closeCustomizeModal();
    this.updateCartBadge();
    App.toast('เพิ่มลงตะกร้าแล้ว');
  },

  updateCartBadge() {
    const qty = this.cart.reduce((sum, it) => sum + it.quantity, 0);
    const total = this.cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const badge = document.getElementById('headerCartCount');
    const floatBar = document.getElementById('floatingCartBar');

    if (qty > 0) {
      badge.classList.remove('hidden');
      badge.innerText = qty;
      floatBar.classList.remove('hidden');
      document.getElementById('floatingCartQty').innerText = qty;
      document.getElementById('floatingCartTotal').innerText = `฿${total}`;
    } else {
      badge.classList.add('hidden');
      floatBar.classList.add('hidden');
    }
  },

  openCartModal() {
    const list = document.getElementById('cartList');
    const empty = document.getElementById('emptyCart');
    const footer = document.getElementById('cartFooter');

    if (this.cart.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      footer.classList.add('hidden');
    } else {
      empty.classList.add('hidden');
      footer.classList.remove('hidden');
      list.innerHTML = this.cart.map((c, i) => `
        <div class="py-2.5 flex justify-between items-start gap-2">
          <div>
            <h4 class="font-bold text-xs text-stone-800">${c.name} (${c.type})</h4>
            <p class="text-[11px] text-stone-500">หวาน: ${c.sweetness} | น้ำแข็ง: ${c.ice}</p>
            ${c.toppings.length ? `<p class="text-[10px] text-amber-700">+ ${c.toppings.map(t=>t.name).join(', ')}</p>` : ''}
            <span class="font-bold text-xs text-amber-600">฿${c.price}</span>
          </div>
          <button onclick="Storefront.removeFromCart(${i})" class="text-rose-500 p-1 text-xs">ลบ</button>
        </div>
      `).join('');
      const grandTotal = this.cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
      document.getElementById('cartGrandTotal').innerText = `฿${grandTotal}`;
    }
    document.getElementById('cartModal').classList.remove('hidden');
  },

  closeCartModal() {
    document.getElementById('cartModal').classList.add('hidden');
  },

  removeFromCart(i) {
    this.cart.splice(i, 1);
    this.updateCartBadge();
    this.openCartModal();
  },

  checkout() {
    this.closeCartModal();
    const total = this.cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    Payment.open(total, [...this.cart]);
  }
};