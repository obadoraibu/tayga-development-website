"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import Logo from "../ui/Logo";

const DEFAULT_PHONE = "+7 (4162) 57-75-75";
const DEFAULT_SCHEDULE = "Ежедневно с 9:00 до 21:00";

interface HeaderProps {
  /** Телефон из Strapi (footer/contact). Если не передан — используется fallback. */
  phone?: string | null;
  /** Время работы из Strapi (footer/contact). Если не передан — используется fallback. */
  schedule?: string | null;
}

export default function Header({ phone, schedule }: HeaderProps) {
  const displayPhone = phone?.trim() || DEFAULT_PHONE;
  const telHref = `tel:${displayPhone.replace(/\s/g, "")}`;
  const displaySchedule = schedule?.trim() || DEFAULT_SCHEDULE;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние меню

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isScrolled ? "bg-taiga-dark/95 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link href="/" className="relative z-50 flex-shrink-0">
             <Logo color={isMenuOpen || isScrolled ? "light" : "light"} />
          </Link>

          {/* Десктоп меню - скрыто на мобильных */}
          <nav className="hidden md:flex items-center gap-8 text-white font-medium text-sm tracking-wide absolute left-1/2 -translate-x-1/2">
            {[
              { label: 'Проекты', href: '/#projects' },
              { label: 'Новости', href: '/news' },
              { label: 'Партнерам', href: '/partners' },
              { label: 'О нас', href: '/about' }
            ].map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                className="hover:text-taiga-accent transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 relative z-50 flex-shrink-0 ml-auto">
            <a href={telHref} className="hidden lg:flex items-center gap-2 text-white hover:text-taiga-accent transition-colors">
              <Phone size={18} />
              <span className="font-heading font-bold">{displayPhone}</span>
            </a>
            
            {/* Кнопка Меню (Бургер) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Мобильное Меню (Overlay) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-taiga-dark flex flex-col justify-center px-8 md:hidden"
          >
            <nav className="flex flex-col gap-8 text-3xl font-heading font-bold text-white">
              {[
                { label: 'Главная', href: '/' },
                { label: 'Проекты', href: '/#projects' },
                { label: 'Новости', href: '/news' },
                { label: 'Партнерам', href: '/partners' },
                { label: 'О нас', href: '/about' }
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link 
                    href={item.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-taiga-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 pt-12 border-t border-white/10"
            >
              <a href={telHref} className="text-taiga-accent text-2xl font-bold block mb-2">{displayPhone}</a>
              <p className="text-white/50">{displaySchedule}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

