/**
 * Universal Card - Performance Utilities
 * 
 * Functions for optimizing performance: debounce, throttle,
 * requestAnimationFrame wrappers, batch updates.
 * 
 * @module utils/performance
 */

// =============================================================================
// DEBOUNCE
// =============================================================================

/**
 * Creates a debounced function that delays invoking func until after
 * wait milliseconds have elapsed since the last time it was invoked.
 * 
 * @param {Function} fn - Function to debounce
 * @param {number} [wait=100] - Milliseconds to delay
 * @param {Object} [options={}] - Options
 * @param {boolean} [options.leading=false] - Invoke on leading edge
 * @param {boolean} [options.trailing=true] - Invoke on trailing edge
 * @returns {Function} Debounced function with .cancel() method
 * 
 * @example
 * const debouncedSave = debounce(() => save(), 300);
 * debouncedSave(); // Called after 300ms of inactivity
 * debouncedSave.cancel(); // Cancel pending call
 */
export function debounce(fn, wait = 100, options = {}) {
  const { leading = false, trailing = true } = options;
  
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  let result = null;
  let lastCallTime = null;
  
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = null;
    lastThis = null;
    lastCallTime = time;
    result = fn.apply(thisArg, args);
    
    return result;
  }
  
  function shouldInvoke(time) {
    const timeSinceLastCall = lastCallTime === null 
      ? wait 
      : time - lastCallTime;
    
    return lastCallTime === null || timeSinceLastCall >= wait;
  }
  
  function timerExpired() {
    const time = Date.now();
    
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    
    timeoutId = setTimeout(timerExpired, wait - (time - lastCallTime));
  }
  
  function trailingEdge(time) {
    timeoutId = null;
    
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    
    lastArgs = null;
    lastThis = null;
    return result;
  }
  
  function leadingEdge(time) {
    lastCallTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    
    return leading ? invokeFunc(time) : result;
  }
  
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    
    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(time);
      }
    }
    
    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    
    return result;
  }
  
  debounced.cancel = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastArgs = null;
    lastThis = null;
    lastCallTime = null;
    timeoutId = null;
  };
  
  debounced.flush = function() {
    if (timeoutId !== null) {
      return trailingEdge(Date.now());
    }
    return result;
  };
  
  debounced.pending = function() {
    return timeoutId !== null;
  };
  
  return debounced;
}

// =============================================================================
// THROTTLE
// =============================================================================

/**
 * Creates a throttled function that only invokes func at most once
 * per every wait milliseconds.
 * 
 * @param {Function} fn - Function to throttle
 * @param {number} [wait=16] - Milliseconds between invocations (16ms = 60fps)
 * @param {Object} [options={}] - Options
 * @param {boolean} [options.leading=true] - Invoke on leading edge
 * @param {boolean} [options.trailing=true] - Invoke on trailing edge
 * @returns {Function} Throttled function with .cancel() method
 * 
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(fn, wait = 16, options = {}) {
  const { leading = true, trailing = true } = options;
  
  let lastCallTime = 0;
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  
  function invokeFunc() {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = null;
    lastThis = null;
    lastCallTime = Date.now();
    
    return fn.apply(thisArg, args);
  }
  
  function throttled(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    lastArgs = args;
    lastThis = this;
    
    if (timeSinceLastCall >= wait) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      if (leading) {
        return invokeFunc();
      }
    }
    
    if (timeoutId === null && trailing) {
      const remaining = wait - timeSinceLastCall;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        invokeFunc();
      }, remaining > 0 ? remaining : 0);
    }
  }
  
  throttled.cancel = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCallTime = 0;
    lastArgs = null;
    lastThis = null;
  };
  
  return throttled;
}

// =============================================================================
// REQUEST ANIMATION FRAME
// =============================================================================

/**
 * Execute callback on next animation frame
 * 
 * @param {Function} callback - Function to execute
 * @returns {number} Animation frame ID
 */
export function raf(callback) {
  return requestAnimationFrame(callback);
}

/**
 * Execute callback on next animation frame (double RAF for layout)
 * Ensures DOM has been updated and laid out
 * 
 * @param {Function} callback - Function to execute
 * @returns {Promise<void>}
 */
export function rafDouble(callback) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        callback();
        resolve();
      });
    });
  });
}

/**
 * Cancel animation frame
 * 
 * @param {number} id - Animation frame ID
 */
export function cancelRaf(id) {
  cancelAnimationFrame(id);
}

// =============================================================================
// BATCH UPDATES
// =============================================================================

/**
 * Batch multiple DOM updates into a single animation frame
 * 
 * @param {Function[]} updates - Array of update functions
 * @returns {Promise<void>}
 * 
 * @example
 * batchUpdates([
 *   () => element1.style.opacity = '1',
 *   () => element2.classList.add('visible'),
 *   () => element3.textContent = 'Updated'
 * ]);
 */
export function batchUpdates(updates) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      updates.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.error('[UniversalCard] Batch update error:', error);
        }
      });
      resolve();
    });
  });
}

/**
 * Create a batch updater that collects updates and executes them together
 * 
 * @returns {Object} Batch updater with add() and flush() methods
 * 
 * @example
 * const batch = createBatchUpdater();
 * batch.add(() => updateA());
 * batch.add(() => updateB());
 * // Updates are automatically flushed on next frame
 */
export function createBatchUpdater() {
  const updates = [];
  let scheduled = false;
  
  function flush() {
    if (updates.length === 0) return;
    
    const toExecute = [...updates];
    updates.length = 0;
    scheduled = false;
    
    batchUpdates(toExecute);
  }
  
  function add(fn) {
    updates.push(fn);
    
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  }
  
  return { add, flush };
}

// =============================================================================
// IDLE CALLBACK
// =============================================================================

/**
 * Execute callback when browser is idle
 * Falls back to setTimeout if requestIdleCallback is not available
 * 
 * @param {Function} callback - Function to execute
 * @param {Object} [options={}] - Options
 * @param {number} [options.timeout=1000] - Timeout in ms
 * @returns {number} Callback ID
 */
export function whenIdle(callback, options = {}) {
  const { timeout = 1000 } = options;
  
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout });
  }
  
  // Fallback
  return setTimeout(callback, 1);
}

/**
 * Cancel idle callback
 * 
 * @param {number} id - Callback ID
 */
export function cancelIdle(id) {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

// =============================================================================
// PERFORMANCE MEASUREMENT
// =============================================================================

/**
 * Measure execution time of a function
 * 
 * @param {string} label - Label for logging
 * @param {Function} fn - Function to measure
 * @returns {*} Function result
 * 
 * @example
 * const result = measureTime('render', () => renderCards());
 */
export function measureTime(label, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.debug(`[UniversalCard] ${label}: ${(end - start).toFixed(2)}ms`);
  
  return result;
}

/**
 * Create a performance observer for long tasks
 * 
 * @param {Function} callback - Called when long task detected
 * @param {number} [threshold=50] - Threshold in ms
 * @returns {Function} Cleanup function
 */
export function observeLongTasks(callback, threshold = 50) {
  if (!('PerformanceObserver' in window)) {
    return () => {};
  }
  
  try {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.duration > threshold) {
          callback(entry);
        }
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    
    return () => observer.disconnect();
  } catch {
    return () => {};
  }
}

// =============================================================================
// MEMORY
// =============================================================================

/**
 * Get approximate memory usage (if available)
 * 
 * @returns {Object|null} Memory info or null
 */
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = performance.memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
    };
  }
  return null;
}
