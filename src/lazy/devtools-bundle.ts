/**
 * Universal Card - Lazy Devtools Bundle
 *
 * Optional devtools modules loaded on demand.
 */

import { EventLogger } from '../devtools/EventLogger.js';
import { StateInspector } from '../devtools/StateInspector.js';
import { PerformanceProfiler } from '../devtools/PerformanceProfiler.js';

export const devtools = {
  EventLogger,
  StateInspector,
  PerformanceProfiler
};
