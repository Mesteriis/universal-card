/**
 * Performance Profiler - профилировщик производительности
 * 
 * Измеряет и отображает метрики производительности
 * карточки: время рендеринга, обновления, память.
 * 
 * @module devtools/PerformanceProfiler
 */

/**
 * Типы метрик
 */
export const METRIC_TYPES = {
  RENDER: 'render',
  UPDATE: 'update',
  HASS_UPDATE: 'hass_update',
  CONFIG_CHANGE: 'config_change',
  ANIMATION: 'animation',
  NETWORK: 'network',
  MEMORY: 'memory'
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  enabled: false,
  sampleSize: 100,        // Количество сохраняемых измерений
  warningThreshold: 16,   // ms (60fps = 16.67ms)
  errorThreshold: 50,     // ms
  autoProfile: false,     // Автоматическое профилирование
  trackMemory: true
};

/**
 * Класс профилировщика производительности
 */
export class PerformanceProfiler {
  constructor(config = {}) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._metrics = new Map();
    this._activeTimers = new Map();
    this._panel = null;
    this._isVisible = false;
    this._memoryInterval = null;
    this._fpsHistory = [];
    this._lastFrameTime = 0;

    this._initMetricTypes();
  }

  /**
   * Инициализирует типы метрик
   */
  _initMetricTypes() {
    for (const type of Object.values(METRIC_TYPES)) {
      this._metrics.set(type, {
        samples: [],
        min: Infinity,
        max: 0,
        total: 0,
        count: 0
      });
    }
  }

  /**
   * Включает профилировщик
   */
  enable() {
    this._config.enabled = true;
    
    if (this._config.trackMemory) {
      this._startMemoryTracking();
    }
    
    if (this._config.autoProfile) {
      this._startFPSTracking();
    }
  }

  /**
   * Выключает профилировщик
   */
  disable() {
    this._config.enabled = false;
    this._stopMemoryTracking();
    this._stopFPSTracking();
  }

  /**
   * Начинает измерение
   * @param {string} name - Уникальное имя измерения
   * @param {string} type - Тип метрики
   * @returns {Function} Функция для завершения измерения
   */
  start(name, type = METRIC_TYPES.RENDER) {
    if (!this._config.enabled) {
      return () => {};
    }

    const startTime = performance.now();
    const id = `${type}:${name}:${startTime}`;
    
    this._activeTimers.set(id, {
      name,
      type,
      startTime
    });

    return () => this._end(id);
  }

  /**
   * Завершает измерение
   * @param {string} id 
   */
  _end(id) {
    const timer = this._activeTimers.get(id);
    if (!timer) return;

    const duration = performance.now() - timer.startTime;
    this._activeTimers.delete(id);

    this._recordMetric(timer.type, timer.name, duration);
  }

  /**
   * Измеряет асинхронную операцию
   * @param {string} name 
   * @param {string} type 
   * @param {Function} fn - Асинхронная функция
   * @returns {Promise<*>}
   */
  async measure(name, type, fn) {
    const end = this.start(name, type);
    try {
      return await fn();
    } finally {
      end();
    }
  }

  /**
   * Измеряет синхронную операцию
   * @param {string} name 
   * @param {string} type 
   * @param {Function} fn 
   * @returns {*}
   */
  measureSync(name, type, fn) {
    const end = this.start(name, type);
    try {
      return fn();
    } finally {
      end();
    }
  }

  /**
   * Записывает метрику
   * @param {string} type 
   * @param {string} name 
   * @param {number} duration 
   */
  _recordMetric(type, name, duration) {
    const metric = this._metrics.get(type);
    if (!metric) return;

    const sample = {
      name,
      duration,
      timestamp: Date.now()
    };

    metric.samples.push(sample);
    
    // Ограничиваем количество samples
    if (metric.samples.length > this._config.sampleSize) {
      metric.samples.shift();
    }

    // Обновляем статистику
    metric.min = Math.min(metric.min, duration);
    metric.max = Math.max(metric.max, duration);
    metric.total += duration;
    metric.count++;

    // Логируем предупреждения
    if (duration > this._config.errorThreshold) {
      console.warn(`[Profiler] Slow ${type}: ${name} took ${duration.toFixed(2)}ms`);
    } else if (duration > this._config.warningThreshold) {
      console.debug(`[Profiler] ${type}: ${name} took ${duration.toFixed(2)}ms`);
    }

    // Обновляем панель если открыта
    if (this._isVisible) {
      this._updatePanel();
    }
  }

  /**
   * Записывает метрику памяти
   */
  _recordMemoryMetric() {
    if (!performance.memory) return;

    const metric = this._metrics.get(METRIC_TYPES.MEMORY);
    const memory = {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      timestamp: Date.now()
    };

    metric.samples.push(memory);
    
    if (metric.samples.length > this._config.sampleSize) {
      metric.samples.shift();
    }
  }

  /**
   * Запускает отслеживание памяти
   */
  _startMemoryTracking() {
    if (!performance.memory) return;
    
    this._stopMemoryTracking();
    this._memoryInterval = setInterval(() => {
      this._recordMemoryMetric();
    }, 1000);
  }

  /**
   * Останавливает отслеживание памяти
   */
  _stopMemoryTracking() {
    if (this._memoryInterval) {
      clearInterval(this._memoryInterval);
      this._memoryInterval = null;
    }
  }

  /**
   * Запускает отслеживание FPS
   */
  _startFPSTracking() {
    const measureFPS = (timestamp) => {
      if (!this._config.enabled || !this._config.autoProfile) return;

      if (this._lastFrameTime) {
        const delta = timestamp - this._lastFrameTime;
        const fps = 1000 / delta;
        
        this._fpsHistory.push({
          fps,
          timestamp: Date.now()
        });

        if (this._fpsHistory.length > 60) {
          this._fpsHistory.shift();
        }
      }

      this._lastFrameTime = timestamp;
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  /**
   * Останавливает отслеживание FPS
   */
  _stopFPSTracking() {
    this._lastFrameTime = 0;
    this._fpsHistory = [];
  }

  /**
   * Получает статистику по типу метрики
   * @param {string} type 
   * @returns {Object}
   */
  getStats(type) {
    const metric = this._metrics.get(type);
    if (!metric || metric.count === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        count: 0,
        samples: []
      };
    }

    return {
      min: metric.min,
      max: metric.max,
      avg: metric.total / metric.count,
      count: metric.count,
      samples: [...metric.samples]
    };
  }

  /**
   * Получает текущий FPS
   * @returns {number}
   */
  getCurrentFPS() {
    if (this._fpsHistory.length === 0) return 0;
    const sum = this._fpsHistory.reduce((acc, f) => acc + f.fps, 0);
    return sum / this._fpsHistory.length;
  }

  /**
   * Получает использование памяти
   * @returns {Object|null}
   */
  getMemoryUsage() {
    const samples = this._metrics.get(METRIC_TYPES.MEMORY)?.samples;
    if (!samples || samples.length === 0) return null;
    
    return samples[samples.length - 1];
  }

  /**
   * Сбрасывает все метрики
   */
  reset() {
    this._initMetricTypes();
    this._fpsHistory = [];
    this._activeTimers.clear();
  }

  /**
   * Показывает панель профилировщика
   */
  showPanel() {
    if (this._panel) {
      this._panel.style.display = 'flex';
      this._isVisible = true;
      this._updatePanel();
      return;
    }

    this._panel = document.createElement('div');
    this._panel.className = 'uc-profiler-panel';
    this._panel.innerHTML = `
      <div class="uc-profiler-header">
        <span class="uc-profiler-title">Performance Profiler</span>
        <div class="uc-profiler-controls">
          <button class="uc-profiler-btn uc-profiler-reset" title="Reset">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </button>
          <button class="uc-profiler-btn uc-profiler-export" title="Export">
            <ha-icon icon="mdi:download"></ha-icon>
          </button>
          <button class="uc-profiler-btn uc-profiler-close" title="Close">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      </div>
      <div class="uc-profiler-summary"></div>
      <div class="uc-profiler-charts"></div>
      <div class="uc-profiler-details"></div>
    `;

    document.body.appendChild(this._panel);
    this._isVisible = true;

    // События
    this._panel.querySelector('.uc-profiler-close').addEventListener('click', () => this.hidePanel());
    this._panel.querySelector('.uc-profiler-reset').addEventListener('click', () => {
      this.reset();
      this._updatePanel();
    });
    this._panel.querySelector('.uc-profiler-export').addEventListener('click', () => this._export());

    this._updatePanel();

    // Автообновление
    this._panelUpdateInterval = setInterval(() => {
      if (this._isVisible) {
        this._updatePanel();
      }
    }, 500);
  }

  /**
   * Скрывает панель
   */
  hidePanel() {
    if (this._panel) {
      this._panel.style.display = 'none';
      this._isVisible = false;
    }
    
    if (this._panelUpdateInterval) {
      clearInterval(this._panelUpdateInterval);
      this._panelUpdateInterval = null;
    }
  }

  /**
   * Переключает видимость панели
   */
  togglePanel() {
    if (this._isVisible) {
      this.hidePanel();
    } else {
      this.showPanel();
    }
  }

  /**
   * Обновляет панель
   */
  _updatePanel() {
    if (!this._panel) return;

    // Summary
    const summary = this._panel.querySelector('.uc-profiler-summary');
    const fps = this.getCurrentFPS();
    const memory = this.getMemoryUsage();
    const renderStats = this.getStats(METRIC_TYPES.RENDER);

    summary.innerHTML = `
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value ${fps < 30 ? 'warning' : fps < 55 ? 'caution' : ''}">${fps.toFixed(0)}</span>
        <span class="uc-profiler-stat-label">FPS</span>
      </div>
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value ${renderStats.avg > this._config.warningThreshold ? 'warning' : ''}">${renderStats.avg.toFixed(1)}</span>
        <span class="uc-profiler-stat-label">Avg Render (ms)</span>
      </div>
      ${memory ? `
        <div class="uc-profiler-stat">
          <span class="uc-profiler-stat-value">${(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}</span>
          <span class="uc-profiler-stat-label">Memory (MB)</span>
        </div>
      ` : ''}
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value">${renderStats.count}</span>
        <span class="uc-profiler-stat-label">Renders</span>
      </div>
    `;

    // Charts
    const charts = this._panel.querySelector('.uc-profiler-charts');
    charts.innerHTML = `
      <div class="uc-profiler-chart">
        <div class="uc-profiler-chart-title">Render Times</div>
        <div class="uc-profiler-chart-bars">
          ${this._renderBars(renderStats.samples.slice(-30))}
        </div>
      </div>
      ${this._fpsHistory.length > 0 ? `
        <div class="uc-profiler-chart">
          <div class="uc-profiler-chart-title">FPS</div>
          <div class="uc-profiler-chart-line">
            ${this._renderLineChart(this._fpsHistory.slice(-60).map(f => f.fps), 60)}
          </div>
        </div>
      ` : ''}
    `;

    // Details
    const details = this._panel.querySelector('.uc-profiler-details');
    const allTypes = Object.values(METRIC_TYPES).filter(t => t !== METRIC_TYPES.MEMORY);
    
    details.innerHTML = allTypes.map(type => {
      const stats = this.getStats(type);
      if (stats.count === 0) return '';
      
      return `
        <div class="uc-profiler-detail">
          <div class="uc-profiler-detail-header">${type}</div>
          <div class="uc-profiler-detail-stats">
            <span>Min: ${stats.min.toFixed(2)}ms</span>
            <span>Max: ${stats.max.toFixed(2)}ms</span>
            <span>Avg: ${stats.avg.toFixed(2)}ms</span>
            <span>Count: ${stats.count}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Рендерит столбчатую диаграмму
   * @param {Object[]} samples 
   * @returns {string}
   */
  _renderBars(samples) {
    if (samples.length === 0) return '<div class="uc-profiler-no-data">No data</div>';

    const max = Math.max(...samples.map(s => s.duration), this._config.errorThreshold);
    
    return samples.map(sample => {
      const height = (sample.duration / max) * 100;
      let className = 'uc-profiler-bar';
      
      if (sample.duration > this._config.errorThreshold) {
        className += ' error';
      } else if (sample.duration > this._config.warningThreshold) {
        className += ' warning';
      }
      
      return `<div class="${className}" style="height: ${height}%" title="${sample.name}: ${sample.duration.toFixed(2)}ms"></div>`;
    }).join('');
  }

  /**
   * Рендерит линейный график
   * @param {number[]} values 
   * @param {number} targetMax 
   * @returns {string}
   */
  _renderLineChart(values, targetMax = 60) {
    if (values.length < 2) return '';

    const max = Math.max(...values, targetMax);
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - (v / max) * 100;
      return `${x},${y}`;
    }).join(' ');

    // Линия target (60 fps)
    const targetY = 100 - (targetMax / max) * 100;

    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="${targetY}" x2="100" y2="${targetY}" class="uc-profiler-target-line" />
        <polyline points="${points}" class="uc-profiler-line" />
      </svg>
    `;
  }

  /**
   * Экспортирует данные
   */
  _export() {
    const data = {
      timestamp: new Date().toISOString(),
      fps: this.getCurrentFPS(),
      memory: this.getMemoryUsage(),
      metrics: {}
    };

    for (const type of Object.values(METRIC_TYPES)) {
      data.metrics[type] = this.getStats(type);
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uc-performance-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Уничтожает профилировщик
   */
  destroy() {
    this.disable();
    this.hidePanel();
    
    if (this._panel) {
      this._panel.remove();
      this._panel = null;
    }
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-profiler-panel {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 350px;
        max-width: calc(100vw - 40px);
        background: var(--ha-card-background, #1c1c1c);
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        font-family: monospace;
        font-size: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        max-height: 500px;
        overflow: hidden;
      }

      .uc-profiler-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px 12px 0 0;
      }

      .uc-profiler-title {
        font-weight: 600;
        font-size: 14px;
      }

      .uc-profiler-controls {
        display: flex;
        gap: 4px;
      }

      .uc-profiler-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-profiler-summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        padding: 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-profiler-stat {
        text-align: center;
      }

      .uc-profiler-stat-value {
        display: block;
        font-size: 20px;
        font-weight: 600;
        color: var(--primary-color);
      }

      .uc-profiler-stat-value.warning {
        color: var(--error-color);
      }

      .uc-profiler-stat-value.caution {
        color: var(--warning-color);
      }

      .uc-profiler-stat-label {
        font-size: 10px;
        color: var(--secondary-text-color);
      }

      .uc-profiler-charts {
        padding: 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-profiler-chart {
        margin-bottom: 12px;
      }

      .uc-profiler-chart:last-child {
        margin-bottom: 0;
      }

      .uc-profiler-chart-title {
        font-size: 10px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }

      .uc-profiler-chart-bars {
        display: flex;
        align-items: flex-end;
        height: 40px;
        gap: 1px;
        background: var(--secondary-background-color);
        border-radius: 4px;
        padding: 2px;
      }

      .uc-profiler-bar {
        flex: 1;
        background: var(--primary-color);
        border-radius: 1px;
        min-height: 2px;
        transition: height 0.1s;
      }

      .uc-profiler-bar.warning {
        background: var(--warning-color);
      }

      .uc-profiler-bar.error {
        background: var(--error-color);
      }

      .uc-profiler-chart-line {
        height: 40px;
        background: var(--secondary-background-color);
        border-radius: 4px;
      }

      .uc-profiler-chart-line svg {
        width: 100%;
        height: 100%;
      }

      .uc-profiler-line {
        fill: none;
        stroke: var(--primary-color);
        stroke-width: 2;
        vector-effect: non-scaling-stroke;
      }

      .uc-profiler-target-line {
        stroke: var(--success-color, #4caf50);
        stroke-width: 1;
        stroke-dasharray: 4 2;
        vector-effect: non-scaling-stroke;
      }

      .uc-profiler-details {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
      }

      .uc-profiler-detail {
        margin-bottom: 8px;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 6px;
      }

      .uc-profiler-detail-header {
        font-weight: 600;
        text-transform: capitalize;
        margin-bottom: 4px;
      }

      .uc-profiler-detail-stats {
        display: flex;
        gap: 12px;
        font-size: 10px;
        color: var(--secondary-text-color);
      }

      .uc-profiler-no-data {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
      }
    `;
  }
}

// Глобальный экземпляр
let instance = null;

/**
 * Получает экземпляр профилировщика
 * @returns {PerformanceProfiler}
 */
export function getProfiler() {
  if (!instance) {
    instance = new PerformanceProfiler();
  }
  return instance;
}

export default PerformanceProfiler;
