export const visualEntries = [
  {
    "id": "typography",
    "name": "排版层级",
    "en": "Typography",
    "category": "visual",
    "level": "基础",
    "tags": [
      "视觉",
      "可读性",
      "code-text"
    ],
    "ask": "标题、正文和提示要分出重点，别让整页文字糊成一片。",
    "definition": "排版层级用字体、字号、字重、行高和宽度建立阅读顺序。",
    "role": "它决定用户先看什么、读起来累不累，以及 UI 是否显得可信。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "排版层级的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "标题层级",
        "页面、区段、组件标题"
      ],
      [
        "正文",
        "稳定字号和行高，控制阅读宽度"
      ],
      [
        "辅助信息",
        "标签、时间和说明，不能变成噪点"
      ],
      [
        "代码/数字",
        "使用适合扫描的等宽或数字字形"
      ]
    ],
    "variants": [
      [
        "单一无衬线",
        "产品和工具 UI 的稳妥选择"
      ],
      [
        "衬线标题 + 无衬线正文",
        "编辑/品牌语境"
      ],
      [
        "紧凑数据型",
        "仪表盘和表格"
      ]
    ],
    "states": [
      [
        "响应式",
        "字号有上下限，标题可换行"
      ],
      [
        "聚焦/选中",
        "不要只靠字重变化"
      ],
      [
        "截断",
        "只在明确允许时使用省略号"
      ]
    ],
    "useWhen": [
      "页面需要快速扫描或连续阅读",
      "信息有明显主次关系"
    ],
    "avoidWhen": [
      "用颜色或渐变替代真正层级",
      "正文小到无法在手机上阅读"
    ],
    "confusedWith": "排版层级是视觉规则；标题区/页头是页面结构角色。",
    "codeUI": [
      "真实文本、font-size、line-height、max-width、text-wrap"
    ],
    "media": [
      "所有可编辑文字由代码呈现，排版预览不需要配图"
    ],
    "prompt": "请建立清晰的排版 token：页面标题、区段标题、正文、辅助文字和代码各有固定字号与行高；正文保持 16px 左右，移动端长标题可换行，不使用负字距。",
    "related": [
      "header",
      "card",
      "responsive"
    ],
    "source": "https://www.w3.org/WAI/tips/designing.html"
  }
];

export const visualEnglish = {
  "typography": {
    "name": "Typography",
    "level": "Foundation",
    "tags": [
      "Visual design",
      "Readability",
      "Code text"
    ],
    "ask": "Give headings, body copy, and supporting text clear priority so the page does not become one undifferentiated block.",
    "definition": "Typographic hierarchy establishes reading order through typeface, size, weight, line height, and measure.",
    "role": "It determines what users notice first, how comfortably they read, and whether the interface feels credible.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Frontend guide typography code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Heading levels",
        "Page, section, and component headings"
      ],
      [
        "Body copy",
        "Stable size and line height within a readable measure"
      ],
      [
        "Supporting text",
        "Labels, time, and help that do not become noise"
      ],
      [
        "Code and numbers",
        "Glyphs optimized for scanning"
      ]
    ],
    "variants": [
      [
        "Single sans serif",
        "A reliable product and tool choice"
      ],
      [
        "Serif heading and sans body",
        "Editorial or brand contexts"
      ],
      [
        "Compact data type",
        "Dashboards and tables"
      ]
    ],
    "states": [
      [
        "Responsive",
        "Sizes have limits and headings can wrap"
      ],
      [
        "Focused or selected",
        "Does not rely only on weight"
      ],
      [
        "Truncation",
        "Uses ellipsis only where explicitly allowed"
      ]
    ],
    "useWhen": [
      "A page needs quick scanning or continuous reading",
      "Information has a clear primary and secondary order"
    ],
    "avoidWhen": [
      "Color or gradients replace actual hierarchy",
      "Body copy is too small to read on a phone"
    ],
    "confusedWith": "Typography is a visual rule; a title block or header is a structural page role.",
    "codeUI": [
      "Real text, font-size, line-height, max-width, and text wrapping"
    ],
    "media": [
      "All editable text stays code-rendered; the typography preview needs no imagery"
    ],
    "prompt": "Create fixed typography tokens for page titles, section headings, body copy, supporting text, and code, each with an appropriate size and line height. Keep body text near 16px, let long mobile headings wrap, and do not use negative letter spacing."
  }
};
