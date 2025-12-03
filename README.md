# ApeVault - Командная панель управления

React приложение для управления командой с функциями расписания, заработка и рейтинга.

## Технологии

- React 18 + TypeScript
- Vite
- Firebase (Firestore)
- Tailwind CSS
- Zustand (state management)
- React Router
- date-fns

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне проекта:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. Запустите dev сервер:
```bash
npm run dev
```

## Деплой на Vercel

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в Vercel:
```bash
vercel login
```

3. Деплой:
```bash
vercel
```

4. Добавьте переменные окружения в настройках проекта на Vercel (Settings → Environment Variables)

## Настройка Firebase

1. Создайте проект в Firebase Console
2. Включите Firestore Database
3. Создайте следующие коллекции:
   - `workSlots` - рабочие слоты
   - `dayStatuses` - статусы дней (выходные, больничные, отпуска)
   - `earnings` - заработок
   - `ratings` - рейтинги

4. Настройте правила безопасности Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Учетные данные

- Артём: `artyom03` / `248artdex`
- Адель: `adel05` / `058adeldex`
- Ксения: `ksen03` / `907ksendex`
- Ольга: `olga04` / `638olgadex`
- Анастасия: `anastasia05` / `638anastadex`

## Пароль администратора

`9119ApeVault`

## Структура проекта

```
src/
├── components/        # React компоненты
│   ├── Management/   # Компоненты управления
│   ├── Earnings/     # Компоненты заработка
│   └── Rating/       # Компоненты рейтинга
├── pages/            # Страницы приложения
├── store/            # Zustand stores
├── services/         # Firebase сервисы
├── utils/            # Утилиты
└── types/            # TypeScript типы
```

## Функции

### Management
- Управление рабочими слотами
- Выходные, больничные, отпуска
- Два вида отображения: таблица и неделя
- Фильтрация по участникам
- Комментарии к слотам и статусам

### Earnings
- Добавление заработка и отчислений в пул
- Статистика за неделю и месяц
- Редактирование в пределах 500 рублей (для обычных пользователей)

### Rating
- Автоматический расчет рейтинга по формуле
- Цветовая индикация (1-100%)
- КПД команды
- Обновление каждые 7 дней

## Telegram Bot

Бот находится в отдельной папке `telegram-bot/`. См. README в этой папке для инструкций по настройке.



