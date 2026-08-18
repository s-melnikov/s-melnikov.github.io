export type ComponentCategory =
  | 'board'
  | 'hero'
  | 'card'
  | 'die'
  | 'token'
  | 'figure';

export interface BoxComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  boxCount: number;
  initialTableCount: number | 'scenario-dependent' | 'hero-dependent';
  placement: string;
  notes?: string;
}

/** Base-game inventory and the initial one-hero table setup. */
export const baseGameComponents: readonly BoxComponent[] = [
  {
    id: 'board',
    name: 'Игровое поле',
    category: 'board',
    boxCount: 1,
    initialTableCount: 1,
    placement: 'Центр стола',
  },
  {
    id: 'hero-cards',
    name: 'Карты героев',
    category: 'hero',
    boxCount: 6,
    initialTableCount: 1,
    placement: 'Область игрока',
    notes: 'На столе находится только выбранный герой.',
  },
  {
    id: 'hero-figures',
    name: 'Фигурки героев',
    category: 'figure',
    boxCount: 6,
    initialTableCount: 1,
    placement: 'Стартовый гекс выбранного героя',
  },
  {
    id: 'adventure-combat',
    name: 'Колода боевых приключений',
    category: 'card',
    boxCount: 40,
    initialTableCount: 30,
    placement: 'Правая панель колод',
    notes: 'После выбора сценария: базовые карты плюс карты выбранного сценария.',
  },
  {
    id: 'adventure-exploration',
    name: 'Колода исследований',
    category: 'card',
    boxCount: 40,
    initialTableCount: 30,
    placement: 'Правая панель колод',
  },
  {
    id: 'adventure-social',
    name: 'Колода социальных приключений',
    category: 'card',
    boxCount: 40,
    initialTableCount: 30,
    placement: 'Правая панель колод',
  },
  {
    id: 'story-cards',
    name: 'Сюжетные карты',
    category: 'card',
    boxCount: 20,
    initialTableCount: 'scenario-dependent',
    placement: 'Панель сценария',
    notes: 'Используется только сюжетная колода выбранного сценария.',
  },
  {
    id: 'scenario-cards',
    name: 'Карты сценариев',
    category: 'card',
    boxCount: 2,
    initialTableCount: 1,
    placement: 'Панель сценария, лицом вверх',
  },
  {
    id: 'skill-cards',
    name: 'Карты навыков',
    category: 'card',
    boxCount: 60,
    initialTableCount: 60,
    placement: 'Левая панель колод и рука игрока',
  },
  {
    id: 'asset-cards',
    name: 'Карты активов',
    category: 'card',
    boxCount: 60,
    initialTableCount: 60,
    placement: 'Колода активов и четыре рынка',
    notes: 'В начале 12 карт открыты: по 3 в каждом городе.',
  },
  {
    id: 'terrain-dice',
    name: 'Кубики местности',
    category: 'die',
    boxCount: 5,
    initialTableCount: 5,
    placement: 'Лоток кубиков',
  },
  {
    id: 'adventure-gems',
    name: 'Самоцветы приключений',
    category: 'token',
    boxCount: 27,
    initialTableCount: 27,
    placement: 'По одному на каждом соответствующем гексе',
  },
  {
    id: 'combat-tokens',
    name: 'Боевые жетоны',
    category: 'token',
    boxCount: 60,
    initialTableCount: 'hero-dependent',
    placement: 'Область игрока, банк и боевая область',
    notes: '18 жетонов героев, 34 активов и 8 врагов.',
  },
  {
    id: 'time-token',
    name: 'Жетон времени',
    category: 'token',
    boxCount: 1,
    initialTableCount: 1,
    placement: 'Первое деление шкалы времени',
  },
  {
    id: 'villain-tokens',
    name: 'Жетоны злодеев',
    category: 'token',
    boxCount: 2,
    initialTableCount: 'scenario-dependent',
    placement: 'Резерв сценария; затем указанный гекс',
  },
  {
    id: 'gold-tokens',
    name: 'Жетоны золота',
    category: 'token',
    boxCount: 24,
    initialTableCount: 24,
    placement: 'Банк и область игрока',
  },
  {
    id: 'damage-tokens',
    name: 'Жетоны ран',
    category: 'token',
    boxCount: 36,
    initialTableCount: 36,
    placement: 'Банк',
  },
  {
    id: 'story-tokens',
    name: 'Сюжетные жетоны',
    category: 'token',
    boxCount: 24,
    initialTableCount: 24,
    placement: 'Банк и указанные сценарием места',
  },
  {
    id: 'scenario-quest-tokens',
    name: 'Сценарные жетоны заданий',
    category: 'token',
    boxCount: 6,
    initialTableCount: 'scenario-dependent',
    placement: 'Резерв выбранного сценария',
  },
] as const;

export const virtualTableZones = [
  'Canvas: игровое поле, фигурки героев, пять кубиков и 27 самоцветов приключений',
  'Левая UI-панель: сценарий, приключения, навыки, активы и сюжетная колода',
  'Правая UI-панель: герой, ресурсы, карты героя и рынок',
  'Модальная UI-панель боя: враг, жетоны обеих сторон и журнал ИИ',
] as const;
