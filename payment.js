const Payment = {
  currentOrderItems: [],
  currentTotal: 0,

  open(total, items) {
    this.currentTotal = total;
    this.currentOrderItems = items;
    const config = Storage.getConfig();

    document.getElementById('paymentModal').classList.remove('hidden');
    const qrSec = document.getElementById('qrPaySection');
    const cashSec = document.getElementById('cashPaySection');

    if (config.qrEnabled && config.promptPayId) {
      qrSec.classList.remove('hidden');
      cashSec.classList.add('hidden');
      document.getElementById('payTotalAmount').innerText = `฿${total}`;
      this.generateQR(config.promptPayId, total);
    } else {
      qrSec.classList.add('hidden');
      cashSec.classList.remove('hidden');
      document.getElementById('cashTotal').innerText = `฿${total}`;
    }
  },

  closeModal() {
    document.getElementById('paymentModal').classList.add('hidden');
  },

  generateQR(promptPayId, amount) {
    const qrContainer = document.getElementById('qrCanvas');
    qrContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = `https://promptpay.io/${promptPayId}/${amount}.png`;
    img.className = 'w-36 h-36 sm:w-40 sm:h-40 object-contain mx-auto';
    qrContainer.appendChild(img);
  },

  finishOrder() {
    const config = Storage.getConfig();
    const orders = Storage.getOrders();
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      items: this.currentOrderItems,
      totalAmount: this.currentTotal,
      paymentMethod: config.qrEnabled ? 'PromptPay' : 'Cash'
    };

    orders.unshift(newOrder);
    Storage.saveOrders(orders);

    Storefront.cart = [];
    Storefront.updateCartBadge();
    this.closeModal();
    App.toast('สั่งซื้อสำเร็จ ขอบคุณครับ!');
  }
};