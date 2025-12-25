"use client";
import { useState } from "react";
import Button from "../ui/Button";
import { fetchAPI } from "@/lib/api";

interface ContactSectionProps {
  data?: {
    title?: string;
    description?: string;
    office_label?: string;
    office_address?: string;
    phone_label?: string;
    phone?: string;
    form_button_text?: string;
    form_success_title?: string;
    form_success_text?: string;
    privacy_text?: string;
  } | null;
}

export default function ContactSection({ data }: ContactSectionProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const contact = data || {
    title: "Остались вопросы?",
    description: "Заполните форму, и менеджер отдела продаж свяжется с вами в течение 15 минут, чтобы помочь с выбором.",
    office_label: "Офис продаж",
    office_address: "г. Таежный, ул. Лесная, 1",
    phone_label: "Телефон",
    phone: "+7 (999) 000-00-00",
    form_button_text: "Получить консультацию",
    form_success_title: "Заявка отправлена!",
    form_success_text: "Мы скоро перезвоним вам.",
    privacy_text: "Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Подготавливаем данные для отправки
      const payload: any = {
        data: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          source: "Main Page Form"
        }
      };

      // Добавляем message только если оно не пустое
      if (formData.message && formData.message.trim()) {
        payload.data.message = formData.message.trim();
      }

      console.log('[Form] Sending lead:', payload);

      // Отправляем данные в Strapi (в коллекцию 'leads')
      const response = await fetchAPI("/leads", {}, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      console.log('[Form] Response:', response);

      if (response?.error) {
        console.error("[Form] Error sending lead:", response.error);
        console.error("[Form] Error details:", JSON.stringify(response.error, null, 2));
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ name: "", phone: "", message: "" }); // Очистка формы
    } catch (error: any) {
      console.error("[Form] Exception sending lead:", error);
      console.error("[Form] Error message:", error.message);
      console.error("[Form] Error stack:", error.stack);
      setStatus("error");
    }
  };

  return (
    <section className="bg-taiga-dark text-white py-24 rounded-t-[3rem] -mt-10 relative z-30" id="contacts">
      <div className="container px-4 mx-auto grid lg:grid-cols-2 gap-16">
        
        {/* Левая колонка: Инфо */}
        <div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {contact.title}
          </h2>
          {contact.description && (
            <p className="text-lg text-white/70 mb-10 max-w-md">
              {contact.description}
            </p>
          )}
          
          <div className="space-y-6">
            <div>
              <div className="text-sm text-taiga-accent uppercase tracking-wider mb-1">{contact.office_label}</div>
              <div className="text-2xl font-heading font-bold">{contact.office_address}</div>
            </div>
            {contact.phone && (
              <div>
                <div className="text-sm text-taiga-accent uppercase tracking-wider mb-1">{contact.phone_label}</div>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-2xl font-heading font-bold hover:text-taiga-accent transition-colors">
                  {contact.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Форма */}
        <div className="bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10">
          {status === "success" ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 bg-taiga-accent rounded-full flex items-center justify-center text-taiga-dark text-3xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2">{contact.form_success_title}</h3>
              <p className="text-white/60 mb-6">{contact.form_success_text}</p>
              <button 
                onClick={() => setStatus('idle')} 
                className="text-taiga-accent underline hover:text-taiga-accent/80 transition-colors"
              >
                Отправить еще
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-white/60 pl-4">Ваше имя</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    placeholder="Иван"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-taiga-accent transition-colors placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60 pl-4">Телефон</label>
                  <input 
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel" 
                    placeholder="+7 (999) 000-00-00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-taiga-accent transition-colors placeholder:text-white/20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/60 pl-4">Комментарий (необязательно)</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-taiga-accent transition-colors placeholder:text-white/20"
                />
              </div>

              {status === "error" && (
                <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-xl p-3 space-y-2">
                  <div className="font-bold">Ошибка при отправке</div>
                  <div className="text-red-300/80">
                    Проверьте подключение к интернету и попробуйте еще раз.
                  </div>
                  {contact.phone && (
                    <div className="text-xs text-red-400/60 mt-2">
                      Или позвоните нам: <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="underline">{contact.phone}</a>
                    </div>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full justify-center mt-4" 
                disabled={status === "loading"}
              >
                {status === "loading" ? "Отправка..." : contact.form_button_text}
              </Button>
              
              {contact.privacy_text && (
                <p className="text-xs text-white/30 text-center">
                  {contact.privacy_text}
                </p>
              )}
            </form>
          )}
        </div>

      </div>
    </section>
  );
}

