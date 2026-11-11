/**
 * Моковые данные платформы.
 * В боевой версии заменяются на запросы к API/БД.
 */

export type CategoryId = "ai" | "startup" | "data" | "no-code" | "web" | "security";

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  icon: string; // ключ иконки из ui/icons
  gradient: string; // tailwind-классы градиента для карточки
  coursesCount: number;
}

export interface Course {
  id: string;
  title: string;
  categoryId: CategoryId;
  level: "Начальный" | "Средний" | "Продвинутый";
  weeks: number;
  format: "Онлайн" | "Оффлайн" | "Гибрид";
  price: number; // 0 = бесплатно
  students: number;
  rating: number;
  tag?: string;
  short: string;
  description: string;
  instructor: { name: string; role: string };
  syllabus: string[];
  startsAt: string; // ISO
  seatsTotal: number;
  seatsTaken: number;
}

export interface Hackathon {
  id: string;
  title: string;
  theme: string;
  startsAt: string; // ISO, начало
  endsAt: string;
  location: string;
  online: boolean;
  prizePool: number;
  seatsTotal: number;
  seatsTaken: number;
  description: string;
  tracks: string[];
}

export interface EventItem {
  id: string;
  title: string;
  kind: "Митап" | "Воркшоп" | "Демо-день" | "Лекция";
  startsAt: string;
  location: string;
  free: boolean;
  description: string;
  speaker?: string;
}

export const categories: Category[] = [
  {
    id: "ai",
    title: "Искусственный интеллект",
    description: "LLM, агенты, RAG, MLOps — строим продукты нового поколения",
    icon: "brain",
    gradient: "from-emerald-500/25 via-teal-500/10 to-transparent",
    coursesCount: 12,
  },
  {
    id: "startup",
    title: "Стартапы и бизнес",
    description: "От идеи до MVP: бизнес-модели, юнит-экономика, питчинг",
    icon: "rocket",
    gradient: "from-amber-500/25 via-orange-500/10 to-transparent",
    coursesCount: 8,
  },
  {
    id: "data",
    title: "Данные и аналитика",
    description: "Python, SQL, BI-дашборды и data science на реальных данных",
    icon: "chart",
    gradient: "from-sky-500/25 via-blue-500/10 to-transparent",
    coursesCount: 9,
  },
  {
    id: "no-code",
    title: "No-code",
    description: "Запускай цифровые продукты без строк кода",
    icon: "blocks",
    gradient: "from-fuchsia-500/25 via-purple-500/10 to-transparent",
    coursesCount: 6,
  },
  {
    id: "web",
    title: "Web-разработка",
    description: "TypeScript, React, Next.js, API и деплой в продакшен",
    icon: "code",
    gradient: "from-cyan-500/25 via-sky-500/10 to-transparent",
    coursesCount: 10,
  },
  {
    id: "security",
    title: "Кибербезопасность",
    description: "Пентестинг, OSINT и защищённая архитектура систем",
    icon: "shield",
    gradient: "from-rose-500/25 via-red-500/10 to-transparent",
    coursesCount: 5,
  },
];

export const courses: Course[] = [
  {
    id: "llm-agents-zero",
    title: "LLM и агентные системы с нуля",
    categoryId: "ai",
    level: "Начальный",
    weeks: 6,
    format: "Гибрид",
    price: 0,
    students: 1240,
    rating: 4.9,
    tag: "Хит",
    short: "Постройте собственных ИИ-агентов: от промптов до деплоя.",
    description:
      "Практический курс по построению LLM-приложений и агентных систем. Научитесь работать с моделями, строить RAG-пайплайны, подключать инструменты и деплоить агентов в продакшен. Финал — свой агент, решающий реальную задачу.",
    instructor: { name: "Айдана Серикова", role: "AI Lead, партнёр платформы" },
    syllabus: [
      "Как устроены LLM: токены, контекст, ограничения",
      "Промпт-инжиниринг и структурированные ответы",
      "RAG: индексация, поиск, оценка качества",
      "Инструменты, функции, мультиагентность",
      "Оценка и отладка LLM-приложений",
      "Деплой: API, мониторинг, стоимость",
    ],
    startsAt: "2026-12-01T18:00:00",
    seatsTotal: 150,
    seatsTaken: 132,
  },
  {
    id: "prime-mvp",
    title: "Prime: от идеи до MVP",
    categoryId: "startup",
    level: "Начальный",
    weeks: 8,
    format: "Оффлайн",
    price: 149000,
    students: 320,
    rating: 4.8,
    tag: "Инкубатор",
    short: "Инкубационная программа: гипотезы, MVP, первые пользователи.",
    description:
      "Интенсив для тех, кто на стадии идеи. За 8 недель командам помогают сформулировать гипотезы, собрать минимально жизнеспособный продукт и выйти на первых пользователей. В финале — демо-день перед инвесторами.",
    instructor: { name: "Дален Мырзахмет", role: "Серийный предприниматель" },
    syllabus: [
      "Поиск проблемы и валидация гипотез",
      "Бизнес-модель и юнит-экономика",
      "Прототип: Figma и no-code",
      "Разработка MVP с ментором",
      "Гrowth: каналы первых 100 пользователей",
      "Питч-демо перед инвесторами",
    ],
    startsAt: "2026-12-07T10:00:00",
    seatsTotal: 40,
    seatsTaken: 28,
  },
  {
    id: "ds-python",
    title: "Data Science на Python",
    categoryId: "data",
    level: "Средний",
    weeks: 8,
    format: "Онлайн",
    price: 0,
    students: 980,
    rating: 4.7,
    short: "От сырых данных к рабочим моделям и инсайтам.",
    description:
      "Курс для тех, кто хочет уметь извлекать знания из данных: Python, pandas, визуализация, статистика и машинное обучение на реальных датасетах. В финале — аналитический проект с презентацией.",
    instructor: { name: "Марат Ахметов", role: "Senior Data Scientist" },
    syllabus: [
      "Python и pandas для анализа данных",
      "SQL и работа с витринами",
      "Эксплораторный анализ и визуализация",
      "Статистика и A/B-тесты",
      "Машинное обучение: от регрессии до градиентного бустинга",
      "Проект: аналитика реального продукта",
    ],
    startsAt: "2026-12-14T18:00:00",
    seatsTotal: 120,
    seatsTaken: 74,
  },
  {
    id: "nocode-product",
    title: "No-code продуктовая команда",
    categoryId: "no-code",
    level: "Начальный",
    weeks: 4,
    format: "Онлайн",
    price: 69000,
    students: 450,
    rating: 4.6,
    short: "Figma + Bubble: соберите продукт без строк кода.",
    description:
      "Научитесь проектировать и собирать веб-продукты на no-code стеке. К концу курса у вас будет работающий продукт с базой, авторизацией и аналитикой — готовый к показу клиентам.",
    instructor: { name: "Гульнара Иса", role: "Product Designer" },
    syllabus: [
      "Продуктовая логика и сценарии",
      "UI/UX-дизайн в Figma",
      "Логика и данные в Bubble",
      "Интеграции и запуск",
    ],
    startsAt: "2026-12-10T18:00:00",
    seatsTotal: 80,
    seatsTaken: 61,
  },
  {
    id: "fullstack-next",
    title: "Fullstack Web: TypeScript + Next.js",
    categoryId: "web",
    level: "Средний",
    weeks: 10,
    format: "Онлайн",
    price: 0,
    students: 1520,
    rating: 4.9,
    tag: "Хит",
    short: "Современный fullstack стек: от базы до продакшена.",
    description:
      "Полный цикл web-разработки: TypeScript, React, Next.js, база данных, аутентификация, тесты и деплой. Курс построен вокруг одного крупного проекта, который вы доведёте до продакшена.",
    instructor: { name: "Тимур Касымов", role: "Staff Engineer" },
    syllabus: [
      "TypeScript и сборка проектов",
      "React: компоненты, состояние, хуки",
      "Next.js: рендер, routing, API",
      "Базы данных и ORM",
      "Аутентификация и права доступа",
      "Тесты, CI/CD и деплой",
    ],
    startsAt: "2026-12-01T18:30:00",
    seatsTotal: 200,
    seatsTaken: 173,
  },
  {
    id: "pentest-basics",
    title: "Кибербезопасность: пентест для новичков",
    categoryId: "security",
    level: "Средний",
    weeks: 6,
    format: "Онлайн",
    price: 99000,
    students: 210,
    rating: 4.8,
    short: "Научитесь находить уязвимости и писать отчёты.",
    description:
      "Практический курс по тестированию на проникновение: разведка, веб-уязвимости, атаки и защита. Все задачи — в изолированном стенде. В финале — собственный пентест-отчёт.",
    instructor: { name: "Ерлан Нурлан", role: "Security Researcher" },
    syllabus: [
      "Базы: сети, веб, ОС",
      "Разведка и картирование",
      "OWASP Top 10 на практике",
      "Атаки на API",
      "Автоматизация отчётов",
    ],
    startsAt: "2027-01-11T18:00:00",
    seatsTotal: 60,
    seatsTaken: 37,
  },
  {
    id: "prompt-rag",
    title: "Промпт-инжиниринг и RAG на практике",
    categoryId: "ai",
    level: "Начальный",
    weeks: 3,
    format: "Онлайн",
    price: 0,
    students: 2100,
    rating: 4.8,
    tag: "Популярный",
    short: "Короткий курс: заставьте LLM работать на ваших данных.",
    description:
      "Три интенсивные недели: продвинутые промпты, работа с контекстом, построение RAG-системы поверх вашей базы знаний. Идеально как вход в направление ИИ.",
    instructor: { name: "Айдана Серикова", role: "AI Lead, партнёр платформы" },
    syllabus: [
      "Анатомия промпта и паттерны",
      "Контекст, память, структурированный вывод",
      "RAG-система: сборка за вечер",
    ],
    startsAt: "2026-11-24T18:00:00",
    seatsTotal: 300,
    seatsTaken: 268,
  },
  {
    id: "unit-economics",
    title: "Юнит-экономика и финмодели стартапов",
    categoryId: "startup",
    level: "Продвинутый",
    weeks: 4,
    format: "Онлайн",
    price: 49000,
    students: 180,
    rating: 4.7,
    short: "Считайте экономику продукта и стройте живые финмодели.",
    description:
      "Курс для основателей и аналитиков: CAC, LTV, маржинальность, кэшевые циклы. Строите финансовую модель собственного продукта и прогоняете её через стресс-тесты с ментором.",
    instructor: { name: "Сабина Юнусова", role: "Финансовый советник" },
    syllabus: [
      "Юнит-экономика: метрики и воронки",
      "Финмодель в таблице",
      "Сценарии и стресс-тесты",
      "Презентация модели инвестору",
    ],
    startsAt: "2027-01-04T18:00:00",
    seatsTotal: 50,
    seatsTaken: 22,
  },
  {
    id: "powerbi-biz",
    title: "Power BI: дашборды для бизнеса",
    categoryId: "data",
    level: "Начальный",
    weeks: 3,
    format: "Онлайн",
    price: 0,
    students: 760,
    rating: 4.5,
    short: "Превратите таблицы в понятные дашборды за 3 недели.",
    description:
      "Практический курс по Power BI: подключение данных, моделирование, DAX-формулы и дизайн дашбордов. В финале — интерактивный дашборд для реального бизнеса.",
    instructor: { name: "Марат Ахметов", role: "Senior Data Scientist" },
    syllabus: [
      "Подключение и подготовка данных",
      "Модель данных и меры",
      "DAX на практике",
      "Дизайн и публикация дашборда",
    ],
    startsAt: "2026-12-08T18:00:00",
    seatsTotal: 100,
    seatsTaken: 55,
  },
  {
    id: "mlops-prod",
    title: "MLOps: от модели в продакшен",
    categoryId: "ai",
    level: "Продвинутый",
    weeks: 6,
    format: "Онлайн",
    price: 129000,
    students: 150,
    rating: 4.9,
    tag: "Новый",
    short: "Деплой, мониторинг, ре-тренинг — полный цикл ML-продукта.",
    description:
      "Для инженеров, которые устали держать модели на ноутбуках. Пайплайны, версионирование данных, мониторинг дрейфа, A/B для ML и стоимость инференса. Финал — ML-сервис под нагрузкой.",
    instructor: { name: "Тимур Касымов", role: "Staff Engineer" },
    syllabus: [
      "Архитектура ML-сервисов",
      "Пайплайны и версионирование",
      "Мониторинг и дрейф данных",
      "A/B-тестирование моделей",
      "Оптимизация стоимости инференса",
    ],
    startsAt: "2027-01-18T18:00:00",
    seatsTotal: 70,
    seatsTaken: 41,
  },
];

export const hackathons: Hackathon[] = [
  {
    id: "ai-sprint-2026",
    title: "AI Sprint 2026: Agent Hack",
    theme: "Агентные ИИ-системы, решающие реальные проблемы бизнеса",
    startsAt: "2026-12-05T09:00:00",
    endsAt: "2026-12-06T21:00:00",
    location: "Астана, главный хаб",
    online: false,
    prizePool: 1000000,
    seatsTotal: 2500,
    seatsTaken: 1840,
    description:
      "36 часов на то, чтобы собрать ИИ-агента, который решает конкретную задачу. ИИ-судья + жюри экспертов, демо-день и призовой фонд. Места ограничены — вход first come, first served.",
    tracks: ["Агенты для бизнеса", "AI для образования", "Open Data", "Стартап-трек"],
  },
  {
    id: "fintech-battle",
    title: "Fintech Battle",
    theme: "Финтех-продукты нового поколения: платежи, кредит, сбережения",
    startsAt: "2027-01-16T09:00:00",
    endsAt: "2027-01-17T21:00:00",
    location: "Алматы",
    online: false,
    prizePool: 750000,
    seatsTotal: 1200,
    seatsTaken: 220,
    description:
      "Хакатон с финтех-партнёрами: реальные API, данные и менторы из индустрии. Команды соревнуются за грант на прототип и место в акселераторе.",
    tracks: ["Платежи", "Кредитование", "Сбережения", "Риск-скоринг"],
  },
  {
    id: "web3-opendata",
    title: "Web3 & Open Data",
    theme: "Открытые данные и децентрализованные сервисы",
    startsAt: "2027-02-20T09:00:00",
    endsAt: "2027-02-21T21:00:00",
    location: "Астана + онлайн",
    online: true,
    prizePool: 500000,
    seatsTotal: 800,
    seatsTaken: 64,
    description:
      "Гибридный хакатон: офлайн на площадке в Астане и онлайн-трек. Работаем с открытыми данными города, строим сервисы для граждан и бизнеса.",
    tracks: ["Городские данные", "Экология", "Транспорт", "Web3"],
  },
];

export const events: EventItem[] = [
  {
    id: "llm-agents-prod",
    title: "Митап: LLM-агенты в проде",
    kind: "Митап",
    startsAt: "2026-11-21T18:30:00",
    location: "Астана, главный хаб",
    free: true,
    description:
      "Команда продукта рассказывает, как перенесла ИИ-агентов в продакшен: архитектура, ошибки, стоимость инференса и что пошло не так.",
    speaker: "Команда AI-продукта партнёра платформы",
  },
  {
    id: "first-round",
    title: "Говорящая голова: как получить первый раунд",
    kind: "Лекция",
    startsAt: "2026-11-27T19:00:00",
    location: "Онлайн",
    free: true,
    description:
      "Разбор живых кейсов: что инвесторы реально смотрят в ранних раундах, типовые ошибки питчей и как готовиться к раунду без страха.",
    speaker: "Партнёр венчурного фонда",
  },
  {
    id: "figma-code",
    title: "Workshop: Figma → код за вечер",
    kind: "Воркшоп",
    startsAt: "2026-12-03T18:00:00",
    location: "Астана, главный хаб",
    free: false,
    description:
      "За один вечер переводите макет в аккуратный React-код. Берите ноутбук и макет — на выходе будет рабочий лендинг.",
    speaker: "Frontend-ментор платформы",
  },
  {
    id: "demo-day-1-5",
    title: "Демо-день выпускников когорты 1.5",
    kind: "Демо-день",
    startsAt: "2026-12-18T17:00:00",
    location: "Астана, главный хаб",
    free: true,
    description:
      "12 команд защищают продукты, созданные за 8 недель инкубационной программы. Живое голосование, обратная связь от экспертов и награждение.",
    speaker: "Выпускники программы Prime",
  },
];

export const stats = [
  { value: 12400, suffix: "+", label: "студентов" },
  { value: 40, suffix: "+", label: "курсов" },
  { value: 15, suffix: "", label: "хакатонов" },
  { value: 60, suffix: "+", label: "партнёров" },
];

export const gamificationLevels = [
  { title: "Новичок", xp: 0, perks: "Доступ к бесплатным курсам и митапам" },
  { title: "Разведчик", xp: 500, perks: "Приоритетная запись на хакатоны" },
  { title: "Практик", xp: 1500, perks: "Скидка 20% на платные курсы" },
  { title: "Эксперт", xp: 3000, perks: "Менторская сессия с индустриальным экспертом" },
  { title: "Легенда", xp: 5000, perks: "Личный трекер карьеры и реферал в партнёрские команды" },
];

export const xpRules = [
  { action: "Модуль курса", xp: 100 },
  { action: "Курс до конца", xp: 500 },
  { action: "Участие в митапе", xp: 50 },
  { action: "Хакатон (участие)", xp: 300 },
  { action: "Победа в хакатоне", xp: 1000 },
];

/** Хелперы */
export const courseById = (id: string) => courses.find((c) => c.id === id);
export const categoryById = (id: string) => categories.find((c) => c.id === id);
export const coursesByCategory = (id: string) => courses.filter((c) => c.categoryId === id);
