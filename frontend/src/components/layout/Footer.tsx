"use client";
import Link from "next/link";
import Logo from "../ui/Logo";
import { Send, Phone } from "lucide-react";

interface FooterProps {
  data?: {
    description?: string;
    address?: string;
    email?: string;
    phone?: string;
    whatsapp_link?: string;
    telegram_link?: string;
    social_text?: string;
    copyright_text?: string;
    privacy_link?: string;
    developer_name?: string;
    developer_link?: string;
  } | null;
}

export default function Footer({ data }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const footer = data || {
    description: "Строительная компания полного цикла. Создаем современные жилые пространства.",
    address: "г. Благовещенск, ул. Ленина, 178/2, офис 52",
    email: "info@tayga-dev.ru",
    phone: "+7 (4162) 57-75-75",
    whatsapp_link: "https://wa.me/79990000000",
    telegram_link: "https://t.me/taygadev",
    social_text: "Подпишитесь на наш канал, чтобы следить за ходом строительства.",
    copyright_text: "Tayga Development. Все права защищены.",
    privacy_link: "/privacy",
    developer_name: "YOUR NAME",
    developer_link: "https://your-studio.com",
  };

  return (
    <footer className="bg-taiga-dark text-white border-t border-white/10 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Лого и описание */}
          <div className="space-y-6">
            <Logo color="light" className="!w-24" />
            {footer.description && (
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                {footer.description}
              </p>
            )}
          </div>

          {/* 2. Навигация */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Компания</h4>
            <ul className="space-y-4 text-white/70">
              <li><Link href="/#projects" className="hover:text-taiga-accent transition-colors">Объекты</Link></li>
              <li><Link href="/news" className="hover:text-taiga-accent transition-colors">Новости</Link></li>
              <li><Link href="/#contacts" className="hover:text-taiga-accent transition-colors">О нас</Link></li>
              <li><Link href="/#contacts" className="hover:text-taiga-accent transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* 3. Контакты */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Связь</h4>
            <ul className="space-y-4 text-white/70">
              {footer.address && <li>{footer.address}</li>}
              {footer.email && (
                <li><a href={`mailto:${footer.email}`} className="hover:text-taiga-accent transition-colors">{footer.email}</a></li>
              )}
              {footer.phone && (
                <li>
                  <a href={`tel:${footer.phone.replace(/\s/g, '')}`} className="text-xl text-white font-bold hover:text-taiga-accent transition-colors">
                    {footer.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* 4. Мессенджеры и Соцсети */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Мы в сети</h4>
            <div className="flex gap-4 mb-6">
              {footer.whatsapp_link && (
                <a 
                  href={footer.whatsapp_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-green-900/20"
                  aria-label="WhatsApp"
                >
                  <Phone size={20} fill="currentColor" className="stroke-none" />
                </a>
              )}
              {footer.telegram_link && (
                <a 
                  href={footer.telegram_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-[#229ED9] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-blue-900/20"
                  aria-label="Telegram"
                >
                  <Send size={20} className="-ml-1 mt-0.5" />
                </a>
              )}
            </div>
            {footer.social_text && (
              <p className="text-xs text-white/40">
                {footer.social_text}
              </p>
            )}
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <div>
            © {currentYear} {footer.copyright_text || 'Tayga Development'}
            <br className="md:hidden"/>
            {footer.privacy_link && (
              <Link href={footer.privacy_link} className="hover:text-white underline decoration-taiga-accent/50 ml-0 md:ml-4">Политика конфиденциальности</Link>
            )}
          </div>
          
          {footer.developer_link && footer.developer_name && (
            <div className="flex items-center gap-2">
              <span>Разработка сайта —</span>
              <a href={footer.developer_link} target="_blank" rel="noopener noreferrer" className="text-taiga-accent hover:underline font-bold">
                {footer.developer_name}
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

