# Синхронизация данных Call между сайтами

## Описание

Сигналы (Call), созданные на **служебном сайте** (для коллеров), автоматически отображаются на **students-app** (для трейдеров) в разделе **Club → Лента**.

## Архитектура

Оба сайта используют **один и тот же Firebase проект** и **одну коллекцию Firestore** `calls`:

- **Служебный сайт** (`src/pages/Call.tsx`): создание и управление сигналами
- **Students-app** (`students-app/src/pages/Club.tsx`): просмотр сигналов в ленте

## Настройка Firebase

### 1. Убедитесь, что оба сайта используют один Firebase проект

**Служебный сайт** (`src/firebase/config.ts`):
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... остальные параметры
}
```

**Students-app** (`students-app/src/firebase/config.ts`):
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... остальные параметры
}
```

### 2. Настройте переменные окружения

**Служебный сайт** (`.env` в корне проекта):
```env
VITE_FIREBASE_API_KEY=ваш_api_key
VITE_FIREBASE_AUTH_DOMAIN=ваш_auth_domain
VITE_FIREBASE_PROJECT_ID=ваш_project_id
VITE_FIREBASE_STORAGE_BUCKET=ваш_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=ваш_messaging_sender_id
VITE_FIREBASE_APP_ID=ваш_app_id
```

**Students-app** (`.env` в папке `students-app/`):
```env
VITE_FIREBASE_API_KEY=ваш_api_key
VITE_FIREBASE_AUTH_DOMAIN=ваш_auth_domain
VITE_FIREBASE_PROJECT_ID=ваш_project_id
VITE_FIREBASE_STORAGE_BUCKET=ваш_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=ваш_messaging_sender_id
VITE_FIREBASE_APP_ID=ваш_app_id
```

**Важно:** Все значения должны быть **одинаковыми** для обоих сайтов!

### 3. Настройте правила Firestore

В Firebase Console → Firestore Database → Rules добавьте:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Коллекция calls - доступна для чтения всем, запись только авторизованным
    match /calls/{callId} {
      allow read: if true; // Все могут читать сигналы
      allow create: if request.auth != null; // Создавать могут только авторизованные
      allow update, delete: if request.auth != null; // Обновлять/удалять могут только авторизованные
    }
    
    // Остальные коллекции...
  }
}
```

## Как это работает

### Создание сигнала (служебный сайт)

1. Коллер заходит на страницу **Call** (`/call`)
2. Нажимает "Создать новый сигнал"
3. Заполняет форму в `CallForm.tsx`
4. При сохранении вызывается `addCall()` из `firestoreService.ts`
5. Данные сохраняются в коллекцию `calls` в Firestore

### Отображение сигнала (students-app)

1. Трейдер заходит на страницу **Club** (`/club`)
2. Выбирает вкладку **Лента**
3. Компонент `Club.tsx` подписывается на real-time обновления через `subscribeToCalls()`
4. При добавлении нового сигнала на служебном сайте, лента автоматически обновляется
5. Сигналы отображаются в карточках с полной информацией

## Real-time обновления

На students-app реализована подписка на real-time обновления коллекции `calls`:

```typescript
// Автоматическое обновление при изменении данных
const unsubscribe = subscribeToCalls(
  (updatedCalls) => {
    setCalls(updatedCalls)
  },
  { activeOnly: true, status: 'active' }
)
```

Это означает, что:
- ✅ Новые сигналы появляются в ленте **мгновенно** без перезагрузки страницы
- ✅ Изменения в существующих сигналах отображаются **автоматически**
- ✅ Удаленные сигналы исчезают из ленты **автоматически**

## Структура данных Call

```typescript
interface Call {
  id: string
  userId: string // ID трейдера (коллера)
  network: Network // solana, bsc, ethereum, base, ton, tron, sui, cex
  ticker: string // PEPE, DOGE, etc.
  pair: string // PEPE/USDT
  entryPoint: string // Точка входа
  target: string // Цели
  strategy: Strategy // flip, medium, long
  risks: string // Риски
  cancelConditions?: string // Условия отмены
  comment?: string // Комментарий
  createdAt: string // ISO timestamp
  status: CallStatus // active, completed, cancelled, reviewed
  
  // Опциональные поля для аналитики
  maxProfit?: number
  currentPnL?: number
  currentMarketCap?: number
  signalMarketCap?: number
  currentPrice?: number
  entryPrice?: number
}
```

## Проверка работы

1. **Создайте тестовый сигнал** на служебном сайте:
   - Зайдите на `/call`
   - Нажмите "Создать новый сигнал"
   - Заполните форму и сохраните

2. **Проверьте отображение** на students-app:
   - Зайдите на `/club`
   - Откройте вкладку "Лента"
   - Новый сигнал должен появиться автоматически

3. **Проверьте Firebase Console**:
   - Зайдите в Firebase Console → Firestore Database
   - Откройте коллекцию `calls`
   - Убедитесь, что документ создан

## Решение проблем

### Сигналы не отображаются на students-app

1. Проверьте, что оба сайта используют один Firebase проект:
   - Сравните `projectId` в конфигурации обоих сайтов
   - Убедитесь, что переменные окружения установлены правильно

2. Проверьте правила Firestore:
   - Убедитесь, что `allow read: if true` для коллекции `calls`

3. Проверьте консоль браузера:
   - Откройте DevTools → Console
   - Ищите ошибки подключения к Firebase

### Real-time обновления не работают

1. Проверьте подключение к интернету
2. Проверьте, что Firebase проект активен
3. Убедитесь, что используется `onSnapshot` вместо `getDocs`

### Данные не сохраняются

1. Проверьте авторизацию на служебном сайте
2. Проверьте правила Firestore (должны разрешать создание)
3. Проверьте консоль браузера на наличие ошибок

## Дополнительная информация

- Коллекция `calls` используется **только для чтения** на students-app
- Все изменения (создание, редактирование, удаление) происходят на служебном сайте
- Real-time подписка автоматически очищается при размонтировании компонента

