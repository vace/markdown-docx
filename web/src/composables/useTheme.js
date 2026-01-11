import { ref, computed } from 'vue'

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
}

// 全局主题状态
const currentTheme = ref(localStorage.getItem('markdown-docx-theme') || 'default')

export function useTheme() {
  const theme = computed(() => currentTheme.value)
  const themeConfig = computed(() => themeConfigs[currentTheme.value])

  const setTheme = (themeName) => {
    if (themeConfigs[themeName]) {
      currentTheme.value = themeName
      localStorage.setItem('markdown-docx-theme', themeName)
    }
  }

  const getThemeConfig = (themeName) => {
    return themeConfigs[themeName] || themeConfigs.default
  }

  const getAllThemes = () => {
    return Object.keys(themeConfigs)
  }

  return {
    theme,
    themeConfig,
    themeConfigs,
    setTheme,
    getThemeConfig,
    getAllThemes
  }
}
