/**
 * Конфигурация игры
 */

const GAME_CONFIG = {
  // Основные настройки
  name: 'Test game',
  version: '1.0.0',
  
  // Размеры игрового стола
  table: {
    width: 3600,
    height: 1622,
    margin: 32
  },
  
  // Настройки зума
  zoom: {
    min: 0.1,
    max: 2.0,
    step: 0.1,
    wheelRatio: 0.1
  },
  
  // Настройки перетаскивания
  drag: {
    debounceMs: 16, // ~60fps
    cacheTimeout: 100
  },
  
  // Ресурсы игры
  resources: {
    stone: 20,
    cinders: 14,
    gold: 10,
    wood: 20
  },
  
  // Настройки игроков
  players: {
    defaultCount: 2,
    maxCount: 4
  },
  
  // Настройки localStorage
  storage: {
    tableStateKey: 'table',
    gameStateKey: 'game'
  },
  
  // Настройки производительности
  performance: {
    enableCaching: true,
    cacheTimeout: 100,
    enableDebouncing: true
  }
};

// Экспортируем конфигурацию
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_CONFIG;
} else {
  window.GAME_CONFIG = GAME_CONFIG;
}
