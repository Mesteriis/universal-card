/**
 * Universal Card - Theme Styles
 * 
 * CSS стили для встроенных тем карточки.
 * Темы применяются через CSS классы theme-{name}.
 * Стили наследуются на все вложенные карточки.
 * 
 * default - не меняет ничего, использует стандартные стили HA
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module styles/themes
 */

export const THEME_STYLES = `
  /* ============================= */
  /* DEFAULT THEME */
  /* ============================= */
  /* Не добавляет никаких стилей - использует HA dashboard theme */
  .theme-default {
    /* inherit all from ha-card */
  }
  
  /* ============================= */
  /* TRANSPARENT THEME */
  /* ============================= */
  /* Полностью прозрачная - сливается с фоном */
  .theme-transparent {
    --ha-card-background: transparent;
    --card-background-color: transparent;
    
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  .theme-transparent .header:hover {
    background: rgba(255, 255, 255, 0.03);
  }
  
  /* ============================= */
  /* SOLID THEME */
  /* ============================= */
  .theme-solid {
    --ha-card-background: #1a1a1a;
    --card-background-color: #1a1a1a;
    --primary-text-color: #e0e0e0;
    --secondary-text-color: #888;
  }
  
  /* ============================= */
  /* GLASS / GLASSMORPHISM THEME */
  /* ============================= */
  .theme-glass,
  .theme-glassmorphism {
    --ha-card-background: rgba(30, 30, 30, 0.7);
    --card-background-color: rgba(30, 30, 30, 0.7);
    
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  }
  
  /* ============================= */
  /* NEUMORPHISM THEME */
  /* ============================= */
  .theme-neumorphism {
    --ha-card-background: #1e1e1e;
    --card-background-color: #1e1e1e;
    
    border: none !important;
    box-shadow: 
      6px 6px 12px rgba(0, 0, 0, 0.5),
      -6px -6px 12px rgba(255, 255, 255, 0.03) !important;
  }
  
  /* ============================= */
  /* MINIMAL THEME */
  /* ============================= */
  .theme-minimal {
    --ha-card-background: transparent;
    --card-background-color: transparent;
    
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: none !important;
  }
  
  /* ============================= */
  /* GRADIENT THEME */
  /* ============================= */
  .theme-gradient {
    --ha-card-background: linear-gradient(135deg, #1a1a2e, #16213e);
    
    background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
  }
  
  /* ============================= */
  /* DARK THEME */
  /* ============================= */
  .theme-dark {
    --ha-card-background: #121212;
    --card-background-color: #121212;
    --primary-text-color: #ffffff;
    --secondary-text-color: #888;
    
    background: #121212 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  
  /* ============================= */
  /* NEON THEME */
  /* ============================= */
  .theme-neon {
    --ha-card-background: rgba(0, 0, 0, 0.9);
    --card-background-color: rgba(0, 0, 0, 0.9);
    --primary-color: #00ff88;
    
    background: rgba(0, 0, 0, 0.9) !important;
    border: 1px solid #00ff88 !important;
    box-shadow: 
      0 0 5px #00ff88,
      0 0 10px rgba(0, 255, 136, 0.5),
      0 0 20px rgba(0, 255, 136, 0.3),
      inset 0 0 30px rgba(0, 255, 136, 0.05) !important;
  }
  
  .theme-neon .header-icon {
    color: #00ff88 !important;
    filter: drop-shadow(0 0 4px #00ff88);
  }
  
  .theme-neon .header-title {
    color: #ffffff !important;
    text-shadow: 0 0 10px #00ff88;
  }
  
  /* ============================= */
  /* AURORA THEME */
  /* ============================= */
  .theme-aurora {
    --ha-card-background: #0a0a0f;
    --card-background-color: #0a0a0f;
    
    background: 
      linear-gradient(135deg, 
        rgba(0, 212, 170, 0.1),
        rgba(124, 58, 237, 0.1),
        rgba(14, 165, 233, 0.1)
      ),
      #0a0a0f !important;
    border: 1px solid rgba(0, 212, 170, 0.2) !important;
    box-shadow: 
      0 0 40px rgba(0, 212, 170, 0.1),
      0 0 80px rgba(124, 58, 237, 0.05) !important;
  }
  
  /* ============================= */
  /* CARBON THEME */
  /* ============================= */
  .theme-carbon {
    --ha-card-background: #0d0d0d;
    --card-background-color: #0d0d0d;
    --primary-text-color: #c0c0c0;
    --secondary-text-color: #666;
    
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 1px,
        rgba(255, 255, 255, 0.02) 1px,
        rgba(255, 255, 255, 0.02) 2px
      ),
      #0d0d0d !important;
    border: 1px solid #222 !important;
  }
  
  /* ============================= */
  /* SLATE THEME */
  /* ============================= */
  .theme-slate {
    --ha-card-background: #1e293b;
    --card-background-color: #1e293b;
    --primary-text-color: #f1f5f9;
    --secondary-text-color: #94a3b8;
    
    background: #1e293b !important;
    border: 1px solid #334155 !important;
  }
  
  /* ============================= */
  /* OBSIDIAN THEME */
  /* ============================= */
  .theme-obsidian {
    --ha-card-background: #0f0f0f;
    --card-background-color: #0f0f0f;
    --primary-text-color: #d4d4d4;
    --secondary-text-color: #737373;
    
    background: #0f0f0f !important;
    border: 1px solid #262626 !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
  }
  
  /* ============================= */
  /* CHARCOAL THEME */
  /* ============================= */
  .theme-charcoal {
    --ha-card-background: #1f1f1f;
    --card-background-color: #1f1f1f;
    --primary-text-color: #e5e5e5;
    --secondary-text-color: #808080;
    
    background: #1f1f1f !important;
    border: 1px solid #333 !important;
  }
  
  /* ============================= */
  /* MIDNIGHT THEME */
  /* ============================= */
  .theme-midnight {
    --ha-card-background: #0f172a;
    --card-background-color: #0f172a;
    --primary-text-color: #e2e8f0;
    --secondary-text-color: #64748b;
    --primary-color: #3b82f6;
    
    background: #0f172a !important;
    border: 1px solid #1e3a5f !important;
  }
  
  /* ============================= */
  /* CYBER THEME */
  /* ============================= */
  .theme-cyber {
    --ha-card-background: #0a0a0a;
    --card-background-color: #0a0a0a;
    --primary-color: #00d4ff;
    --primary-text-color: #00d4ff;
    --secondary-text-color: #0088aa;
    
    background: #0a0a0a !important;
    border: 1px solid #00d4ff !important;
    box-shadow: 
      0 0 3px #00d4ff,
      inset 0 0 20px rgba(0, 212, 255, 0.03) !important;
  }
  
  .theme-cyber .header-title {
    text-shadow: 0 0 8px #00d4ff;
  }
  
  /* ============================= */
  /* VOID THEME */
  /* ============================= */
  .theme-void {
    --ha-card-background: #000000;
    --card-background-color: #000000;
    --primary-text-color: #a0a0a0;
    --secondary-text-color: #505050;
    
    background: #000000 !important;
    border: 1px solid #1a1a1a !important;
  }
  
  /* ============================= */
  /* EMBER THEME */
  /* ============================= */
  .theme-ember {
    --ha-card-background: #1a0a0a;
    --card-background-color: #1a0a0a;
    --primary-color: #ff4444;
    --primary-text-color: #ffcccc;
    --secondary-text-color: #aa6666;
    
    background: linear-gradient(135deg, #1a0a0a, #0a0505) !important;
    border: 1px solid #441111 !important;
    box-shadow: 0 0 30px rgba(255, 68, 68, 0.1) !important;
  }
  
  /* ============================= */
  /* FOREST THEME */
  /* ============================= */
  .theme-forest {
    --ha-card-background: #0a1a0a;
    --card-background-color: #0a1a0a;
    --primary-color: #22c55e;
    --primary-text-color: #bbffcc;
    --secondary-text-color: #558866;
    
    background: linear-gradient(135deg, #0a1a0a, #050a05) !important;
    border: 1px solid #114411 !important;
  }
  
  /* ============================= */
  /* OCEAN THEME */
  /* ============================= */
  .theme-ocean {
    --ha-card-background: #0a0f1a;
    --card-background-color: #0a0f1a;
    --primary-color: #0ea5e9;
    --primary-text-color: #bae6fd;
    --secondary-text-color: #5588aa;
    
    background: linear-gradient(135deg, #0a0f1a, #050810) !important;
    border: 1px solid #113344 !important;
  }
  
  /* ============================= */
  /* PURPLE HAZE THEME */
  /* ============================= */
  .theme-purple-haze {
    --ha-card-background: #120a1a;
    --card-background-color: #120a1a;
    --primary-color: #a855f7;
    --primary-text-color: #e9d5ff;
    --secondary-text-color: #8866aa;
    
    background: linear-gradient(135deg, #120a1a, #0a050f) !important;
    border: 1px solid #2d1a44 !important;
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.1) !important;
  }
  
  /* ============================= */
  /* MATRIX THEME */
  /* ============================= */
  .theme-matrix {
    --ha-card-background: #000500;
    --card-background-color: #000500;
    --primary-color: #00ff00;
    --primary-text-color: #00ff00;
    --secondary-text-color: #008800;
    
    background: #000500 !important;
    border: 1px solid #003300 !important;
  }
  
  .theme-matrix .header-title,
  .theme-matrix .header-subtitle {
    font-family: 'Courier New', monospace;
  }
  
  .theme-matrix .header-title {
    text-shadow: 0 0 5px #00ff00;
  }
  
  /* ============================= */
  /* GRAPHITE THEME */
  /* ============================= */
  .theme-graphite {
    --ha-card-background: #252525;
    --card-background-color: #252525;
    --primary-text-color: #d0d0d0;
    --secondary-text-color: #808080;
    
    background: #252525 !important;
    border: 1px solid #3a3a3a !important;
  }
  
  /* ============================= */
  /* SMOKE THEME */
  /* ============================= */
  .theme-smoke {
    --ha-card-background: rgba(40, 40, 40, 0.85);
    --card-background-color: rgba(40, 40, 40, 0.85);
    
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background: rgba(40, 40, 40, 0.85) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
  }
  
  /* ============================= */
  /* NORD THEME */
  /* ============================= */
  .theme-nord {
    --ha-card-background: #2e3440;
    --card-background-color: #2e3440;
    --primary-color: #88c0d0;
    --primary-text-color: #eceff4;
    --secondary-text-color: #d8dee9;
    
    background: #2e3440 !important;
    border: 1px solid #3b4252 !important;
  }
  
  /* ============================= */
  /* DRACULA THEME */
  /* ============================= */
  .theme-dracula {
    --ha-card-background: #282a36;
    --card-background-color: #282a36;
    --primary-color: #bd93f9;
    --primary-text-color: #f8f8f2;
    --secondary-text-color: #6272a4;
    
    background: #282a36 !important;
    border: 1px solid #44475a !important;
  }
  
  /* ============================= */
  /* MONOKAI THEME */
  /* ============================= */
  .theme-monokai {
    --ha-card-background: #272822;
    --card-background-color: #272822;
    --primary-color: #a6e22e;
    --primary-text-color: #f8f8f2;
    --secondary-text-color: #75715e;
    
    background: #272822 !important;
    border: 1px solid #3e3d32 !important;
  }
  
  /* ============================= */
  /* TOKYO NIGHT THEME */
  /* ============================= */
  .theme-tokyo-night {
    --ha-card-background: #1a1b26;
    --card-background-color: #1a1b26;
    --primary-color: #7aa2f7;
    --primary-text-color: #c0caf5;
    --secondary-text-color: #565f89;
    
    background: #1a1b26 !important;
    border: 1px solid #292e42 !important;
  }
  
  /* ============================= */
  /* CATPPUCCIN THEME (Mocha) */
  /* ============================= */
  .theme-catppuccin {
    --ha-card-background: #1e1e2e;
    --card-background-color: #1e1e2e;
    --primary-color: #cba6f7;
    --primary-text-color: #cdd6f4;
    --secondary-text-color: #6c7086;
    
    background: #1e1e2e !important;
    border: 1px solid #313244 !important;
  }
`;

export default THEME_STYLES;
