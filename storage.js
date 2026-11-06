const Storage = {
  getConfig() {
    return JSON.parse(localStorage.getItem('drink_store_config')) || Config.INITIAL_CONFIG;
  },
  saveConfig(config) {
    localStorage.setItem('drink_store_config', JSON.stringify(config));
  },
  getMenus() {
    return JSON.parse(localStorage.getItem('drink_store_menus')) || Config.INITIAL_MENUS;
  },
  saveMenus(menus) {
    localStorage.setItem('drink_store_menus', JSON.stringify(menus));
  },
  getOrders() {
    return JSON.parse(localStorage.getItem('drink_store_orders')) || [];
  },
  saveOrders(orders) {
    localStorage.setItem('drink_store_orders', JSON.stringify(orders));
  }
};