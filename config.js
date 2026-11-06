const Config = {
  INITIAL_CONFIG: {
    storeName: 'ร้านน้ำชงใจ',
    tagline: 'ชา กาแฟ และเครื่องดื่มสดชื่น',
    heroTitle: 'สดชื่นทุกแก้ว ใส่ใจทุกขั้นตอน',
    heroSubtext: 'เครื่องดื่มชา กาแฟ และเมนูผลไม้คัดสรรวัตถุดิบชั้นดี สั่งง่ายไม่ต้องรอคิว',
    heroBadge: 'เปิดให้บริการแล้ววันนี้',
    promptPayId: '0812345678',
    qrEnabled: true,
    ownerPin: '1234'
  },

  INITIAL_MENUS: [
    { id: 'm1', name: 'ชาไทยต้นตำรับ', category: 'tea', prices: { hot: 35, iced: 45, frappe: 50 }, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60' },
    { id: 'm2', name: 'ชาเขียวมัทฉะลาเต้', category: 'tea', prices: { hot: 45, iced: 55, frappe: 60 }, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60' },
    { id: 'm3', name: 'เอสเพรสโซ่เย็น', category: 'coffee', prices: { hot: 40, iced: 50, frappe: 55 }, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=60' },
    { id: 'm4', name: 'โกโก้เข้มข้น', category: 'milk', prices: { hot: 40, iced: 50, frappe: 55 }, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=60' },
    { id: 'm5', name: 'สตรอว์เบอร์รีโซดา', category: 'soda', prices: { iced: 45 }, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' }
  ],

  TOPPINGS: [
    { id: 'boba', name: 'ไข่มุกหนึบ', price: 10 },
    { id: 'grass', name: 'เฉาก๊วยโบราณ', price: 10 },
    { id: 'jelly', name: 'บุกคริสตัล', price: 15 }
  ],

  CATEGORIES: [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'tea', name: 'ชา' },
    { id: 'coffee', name: 'กาแฟ' },
    { id: 'milk', name: 'นม/โกโก้' },
    { id: 'soda', name: 'โซดา' }
  ]
};