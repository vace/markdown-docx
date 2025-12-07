// 主题配置定义
const themeConfigs = {
  default: {
    name: 'Default',
    theme: {
      heading1: "2F5597",
      heading2: "5B9BD5",
      heading3: "44546A",
      heading4: "44546A",
      heading5: "44546A",
      heading6: "44546A",
      link: "0563C1",
      code: "C7254E",
      blockquote: "666666",
      del: "FF0000"
    }
  },
  elegant: {
    name: 'Elegant',
    theme: {
      heading1: "1A202C",
      heading2: "2D3748",
      heading3: "4A5568",
      heading4: "4A5568",
      heading5: "4A5568",
      heading6: "4A5568",
      link: "2B6CB0",
      code: "B83280",
      blockquote: "4A5568",
      del: "E53E3E"
    }
  },
  academic: {
    name: 'Academic',
    theme: {
      heading1: "111827",
      heading2: "1F2937",
      heading3: "374151",
      heading4: "374151",
      heading5: "374151",
      heading6: "374151",
      link: "1D4ED8",
      code: "7C2D12",
      blockquote: "6B7280",
      del: "DC2626"
    }
  },
  modern: {
    name: 'Modern',
    theme: {
      heading1: "5B21B6",
      heading2: "7C3AED",
      heading3: "8B5CF6",
      heading4: "8B5CF6",
      heading5: "8B5CF6",
      heading6: "8B5CF6",
      link: "3B82F6",
      code: "EC4899",
      blockquote: "6B7280",
      del: "EF4444"
    }
  }
};

// 全局主题状态
let currentTheme = 'default';

// 主题切换功能
function switchTheme(themeName) {
  if (themeConfigs[themeName]) {
    currentTheme = themeName;
    localStorage.setItem('markdown-docx-theme', themeName);

    // 更新UI显示
    updateThemeDisplay(themeName);

    // 触发自定义事件通知主题已变更
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: {
        theme: themeName,
        config: themeConfigs[themeName]
      }
    }));
  }
}

function updateThemeDisplay(themeName) {
  const config = themeConfigs[themeName];
  const themeButton = document.getElementById('theme-toggle');
  const themeSelect = document.getElementById('doc-theme');

  // 更新按钮文本
  if (themeButton) {
    const span = themeButton.querySelector('span');
    if (span) span.textContent = config.name;
  }

  // 更新选择框
  if (themeSelect) {
    themeSelect.value = themeName;
  }

  // 在预览区域显示主题色彩示例
  updatePreviewTheme(config);
}

function updatePreviewTheme(config) {
  // 在markdown预览区域应用主题色彩示例
  const preview = document.getElementById('markdown-preview');
  if (preview) {
    preview.style.setProperty('--theme-primary', `#${config.theme.primary}`);
    preview.style.setProperty('--theme-heading1', `#${config.theme.heading1}`);
    preview.style.setProperty('--theme-heading2', `#${config.theme.heading2}`);
    preview.style.setProperty('--theme-link', `#${config.theme.link}`);
    preview.style.setProperty('--theme-code', `#${config.theme.code}`);
  }
}

// 获取当前主题配置
function getCurrentTheme() {
  return {
    name: currentTheme,
    config: themeConfigs[currentTheme]
  };
}

// 初始化主题功能
document.addEventListener('DOMContentLoaded', function () {
  // 从localStorage恢复主题设置
  const savedTheme = localStorage.getItem('markdown-docx-theme') || 'default';
  currentTheme = savedTheme;

  // 初始化UI
  updateThemeDisplay(currentTheme);

  // 绑定主题切换按钮事件
  const themeToggle = document.getElementById('theme-toggle');
  const themeDropdown = document.getElementById('theme-dropdown');

  if (themeToggle && themeDropdown) {
    themeToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      themeDropdown.classList.toggle('hidden');
    });

    // 绑定主题选项点击事件
    themeDropdown.addEventListener('click', function (e) {
      const themeOption = e.target.closest('.theme-option');
      if (themeOption) {
        const themeName = themeOption.dataset.theme;
        switchTheme(themeName);
        themeDropdown.classList.add('hidden');
      }
    });
  }

  // 绑定模态框中的主题选择器
  const themeSelect = document.getElementById('doc-theme');
  if (themeSelect) {
    themeSelect.addEventListener('change', function () {
      switchTheme(this.value);
    });
  }

  // 点击其他地方关闭下拉菜单
  document.addEventListener('click', function () {
    if (themeDropdown) {
      themeDropdown.classList.add('hidden');
    }
  });
});

export const ThemeManager ={
  getCurrentTheme,
  switchTheme,
  themeConfigs
};