# Как настроить размер и позицию логотипа

## Изменение размера

В файле `src/components/ui/Logo.tsx` на строке 13:

**Текущий размер:**
```tsx
<div className={`w-12 md:w-16 ${className}`}>
```

### Варианты размеров (Tailwind CSS):

- `w-8` = 32px (очень маленький)
- `w-10` = 40px (маленький)
- `w-12` = 48px (текущий, мобильные)
- `w-14` = 56px
- `w-16` = 64px (текущий, десктоп)
- `w-20` = 80px (большой)
- `w-24` = 96px (очень большой)

### Примеры:

**Сделать меньше:**
```tsx
<div className={`w-10 md:w-14 ${className}`}>
```

**Сделать больше:**
```tsx
<div className={`w-14 md:w-20 ${className}`}>
```

**Одинаковый размер на всех экранах:**
```tsx
<div className={`w-16 ${className}`}>
```

**Кастомный размер в пикселях:**
```tsx
<div className={className} style={{ width: '60px' }}>
```

## Изменение позиции (поднять/опустить)

На строке 13 уже добавлен `marginTop: '-2px'` для поднятия на 2px.

### Варианты:

**Поднять больше:**
```tsx
<div className={`w-12 md:w-16 ${className}`} style={{ marginTop: '-4px' }}>
```

**Поднять меньше:**
```tsx
<div className={`w-12 md:w-16 ${className}`} style={{ marginTop: '-1px' }}>
```

**Опустить:**
```tsx
<div className={`w-12 md:w-16 ${className}`} style={{ marginTop: '2px' }}>
```

**Использовать Tailwind классы:**
```tsx
<div className={`w-12 md:w-16 -mt-0.5 ${className}`}>  // -2px
<div className={`w-12 md:w-16 -mt-1 ${className}`}>    // -4px
<div className={`w-12 md:w-16 mt-0.5 ${className}`}>   // +2px
```

## Комбинированный пример

**Увеличить размер и поднять на 3px:**
```tsx
<div className={`w-14 md:w-18 ${className}`} style={{ marginTop: '-3px' }}>
```

## Где используется логотип

Логотип используется в:
- `src/components/layout/Header.tsx` (строка 36)
- `src/components/layout/Footer.tsx` (строка 16)

Если нужно разное позиционирование в Header и Footer, можно передать дополнительные классы через проп `className`:

```tsx
// В Header
<Logo color="light" className="!w-14 -mt-1" />

// В Footer
<Logo color="light" className="!w-24" />
```




