export interface MenuItem {
  title: string;
  link: string;
  fragment?: string;
}

// Пункты меню общие для шапки и подвала
export const MENU: MenuItem[] = [
  { title: 'Услуги', link: '/', fragment: 'services' },
  { title: 'О нас', link: '/', fragment: 'about' },
  { title: 'Статьи', link: '/blog' },
  { title: 'Отзывы', link: '/', fragment: 'reviews' },
  { title: 'Контакты', link: '/', fragment: 'contacts' },
];

export const CONTACTS = {
  phone: '+7 (499) 343-13-34',
  phoneHref: 'tel:+74993431334',
  email: 'info@itstorm.com',
  address: 'Пресненская наб., 12, Москва, Россия, 123317.',
  socials: [
    { name: 'ВКонтакте', icon: 'vk', url: 'https://vk.com' },
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com' },
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com' },
  ],
};
