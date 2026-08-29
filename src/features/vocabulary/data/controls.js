export const controlsEntries = [
  {
    "id": "button",
    "name": "按钮",
    "en": "Button",
    "category": "controls",
    "level": "基础",
    "tags": [
      "操作",
      "code-control",
      "可访问性"
    ],
    "ask": "帮我加个按钮，点一下就把内容保存下来。",
    "definition": "按钮触发当前页面内的动作，例如提交、保存、打开、切换或删除。",
    "role": "按钮应该告诉用户‘会发生一个动作’，而不是伪装成跳转链接。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "按钮的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "动作文案",
        "明确结果，不使用模糊的‘确定’"
      ],
      [
        "层级",
        "主、次要、危险操作的视觉差异"
      ],
      [
        "图标",
        "仅作辅助，不替代文字"
      ],
      [
        "状态",
        "hover、active、focus、disabled、loading"
      ]
    ],
    "variants": [
      [
        "Primary",
        "当前页面最重要的动作"
      ],
      [
        "Secondary",
        "次要或取消动作"
      ],
      [
        "Icon button",
        "空间紧张时的单一熟悉动作"
      ]
    ],
    "states": [
      [
        "悬停/按下",
        "反馈及时，不引发布局跳动"
      ],
      [
        "聚焦",
        "高对比 focus ring"
      ],
      [
        "禁用/加载",
        "解释原因或保留进行中状态"
      ]
    ],
    "useWhen": [
      "动作发生在当前页面或当前组件",
      "需要提交、切换或触发反馈"
    ],
    "avoidWhen": [
      "点击会导航到新页面，优先使用链接",
      "操作后果危险却没有确认或撤销"
    ],
    "confusedWith": "Button 做动作；Link 做导航。外观可以相似，但语义和键盘行为不同。",
    "codeUI": [
      "button type、aria-label、focus-visible、disabled、aria-busy"
    ],
    "media": [
      "按钮、图标、状态和文字全部由代码呈现，不需要配图"
    ],
    "prompt": "请用真实 button 元素实现保存动作，提供主/次级层级和 default、hover、active、focus、disabled、loading、success、error 状态；点击后显示可恢复反馈。",
    "related": [
      "cta",
      "form",
      "checkbox",
      "menu",
      "toast"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
  },
  {
    "id": "checkbox",
    "name": "复选框",
    "en": "Checkbox",
    "category": "controls",
    "level": "基础",
    "tags": [
      "表单",
      "多选",
      "状态"
    ],
    "ask": "这几项可以同时选中，用户勾完以后再一起提交。",
    "definition": "复选框表示一个独立的二元选择；同组多个选项可以同时被选中。",
    "role": "它让用户明确控制每个选择，并可表达全选时的未选、部分选中和全部选中状态。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "复选框的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "方框控件",
        "显示未选、选中或混合状态"
      ],
      [
        "可点击标签",
        "说明选择含义并扩大点击区域"
      ],
      [
        "说明/错误",
        "补充后果、约束或验证反馈"
      ],
      [
        "分组",
        "用 fieldset 与 legend 表达同一问题"
      ]
    ],
    "variants": [
      [
        "单个确认",
        "同意条款或开启一个独立选项"
      ],
      [
        "多选组",
        "多个选项可以同时选择"
      ],
      [
        "全选/混合",
        "父项反映部分子项已选择"
      ]
    ],
    "states": [
      [
        "未选/选中",
        "视觉和 checked 状态同步"
      ],
      [
        "混合",
        "使用 indeterminate 表达部分选中"
      ],
      [
        "禁用/错误",
        "保留标签可读性并解释限制"
      ]
    ],
    "useWhen": [
      "用户可以选择零项、一项或多项",
      "需要明确记录每个独立选择"
    ],
    "avoidWhen": [
      "选项互斥，应使用单选按钮",
      "设置点击后立即生效且无需提交，开关更合适"
    ],
    "confusedWith": "复选框支持多选并常随表单提交；单选按钮互斥；开关表达立即生效的设置。",
    "codeUI": [
      "input type=checkbox、label、fieldset/legend、indeterminate、错误关联"
    ],
    "media": [
      "方框、勾选状态和文字全部由代码渲染，不使用图片"
    ],
    "prompt": "请用原生 Checkbox 实现多选组：标签整行可点击，使用 fieldset/legend 描述问题，支持未选、选中、indeterminate、禁用和错误状态；不要用开关替代需要提交的多选项。",
    "related": [
      "form",
      "toggle",
      "filter-chips",
      "data-table"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/"
  },
  {
    "id": "form",
    "name": "输入框与表单",
    "en": "Input / Form",
    "category": "controls",
    "level": "基础",
    "tags": [
      "输入",
      "校验",
      "code-control"
    ],
    "ask": "做一个注册表单，用户填完信息后可以提交，而且错误要说清楚。",
    "definition": "表单把多个输入、说明、校验和提交动作组织成一条可完成的任务路径。",
    "role": "降低输入成本，及时发现错误，并让用户知道信息会如何被使用。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "输入框与表单的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "标签",
        "说明字段需要填写什么"
      ],
      [
        "控件",
        "输入、选择、开关等真实表单元素"
      ],
      [
        "帮助/错误",
        "靠近字段，说明修复方式"
      ],
      [
        "提交区",
        "显示可用、加载和结果状态"
      ]
    ],
    "variants": [
      [
        "单列表单",
        "移动端和新手流程优先"
      ],
      [
        "分步表单",
        "信息多但任务顺序明确"
      ],
      [
        "内联编辑",
        "详情页中少量字段即时修改"
      ]
    ],
    "states": [
      [
        "聚焦",
        "标签和边框状态清楚"
      ],
      [
        "校验错误",
        "文本 + 颜色说明，不只用红色"
      ],
      [
        "提交中",
        "锁定重复提交并显示进度"
      ]
    ],
    "useWhen": [
      "需要收集或修改结构化信息",
      "有明确提交、保存或下一步"
    ],
    "avoidWhen": [
      "只需要一个搜索词",
      "字段太多但没有分组或优先级"
    ],
    "confusedWith": "输入框是单个字段；表单是多个字段与提交逻辑组成的任务。",
    "codeUI": [
      "label、input、fieldset、校验、autocomplete、错误关联"
    ],
    "media": [
      "表单结构、文字和状态必须是代码"
    ],
    "prompt": "请实现一列优先的可访问表单：每个字段有 label、帮助文本和错误关联；提交按钮包含 loading/success/error 状态，移动端键盘不会遮挡当前字段。",
    "related": [
      "button",
      "search",
      "empty-state"
    ],
    "source": "https://www.w3.org/WAI/tutorials/forms/"
  },
  {
    "id": "toggle",
    "name": "开关",
    "en": "Switch",
    "category": "controls",
    "level": "基础",
    "tags": [
      "二元状态",
      "设置",
      "code-control"
    ],
    "ask": "像手机设置一样，这个功能一拨就开，再拨就关。",
    "definition": "开关表达一个可以立即生效的二元设置，开和关都应该拥有清晰的文字或状态反馈。",
    "role": "让用户快速控制持续性偏好，而不必通过提交表单才能知道结果。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "开关的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "标签",
        "说明被控制的设置"
      ],
      [
        "轨道",
        "表达开/关的容器"
      ],
      [
        "滑块",
        "当前值的视觉位置"
      ],
      [
        "反馈",
        "需要时显示已保存或失败"
      ]
    ],
    "variants": [
      [
        "即时保存",
        "切换后立即保存"
      ],
      [
        "本地偏好",
        "主题、通知、筛选等"
      ],
      [
        "带说明开关",
        "复杂设置需要补充文本"
      ]
    ],
    "states": [
      [
        "on/off",
        "不只依赖颜色，提供文字或形状差异"
      ],
      [
        "禁用",
        "说明受其他设置限制"
      ],
      [
        "保存失败",
        "允许重试并保留原状态"
      ]
    ],
    "useWhen": [
      "设置只有开/关两种值",
      "切换后可以立即生效"
    ],
    "avoidWhen": [
      "需要多个选项",
      "切换会执行危险动作且没有确认"
    ],
    "confusedWith": "开关适合持续设置；Checkbox 更适合表单提交时的多选。",
    "codeUI": [
      "button role=switch 或 input、aria-checked、键盘 Space"
    ],
    "media": [
      "轨道、滑块和状态都用代码渲染"
    ],
    "prompt": "请实现一个可访问开关：标签说明设置，Space 可切换，状态用 aria-checked 与视觉同时表达；切换后显示保存成功或失败，不要让开关尺寸变化。",
    "related": [
      "form",
      "checkbox",
      "button",
      "segmented"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/switch/"
  },
  {
    "id": "menu",
    "name": "菜单",
    "en": "Menu",
    "category": "controls",
    "level": "进阶",
    "tags": [
      "操作",
      "浮层",
      "键盘"
    ],
    "ask": "把重命名、复制和删除这些次要操作收到一个更多菜单里。",
    "definition": "菜单是在触发后显示的一组相关命令或选项，通常用于节省空间并组织次要操作。",
    "role": "它把低频命令放到可预测的位置，同时保留键盘导航和清晰的关闭路径。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "菜单的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "触发控件",
        "按钮提供名称、展开状态和关联关系"
      ],
      [
        "菜单容器",
        "浮层位置靠近触发点"
      ],
      [
        "菜单项",
        "使用动词和一致的图标语义"
      ],
      [
        "分组/危险项",
        "用分隔和颜色区分但不只依赖颜色"
      ]
    ],
    "variants": [
      [
        "操作菜单",
        "重命名、复制、归档等命令"
      ],
      [
        "选择菜单",
        "从一组值中选一个"
      ],
      [
        "级联菜单",
        "桌面复杂工具可用，移动端应减少层级"
      ]
    ],
    "states": [
      [
        "关闭/展开",
        "aria-expanded 与可见状态同步"
      ],
      [
        "键盘导航",
        "方向键移动，Enter 触发，Escape 关闭并返回触发点"
      ],
      [
        "禁用项",
        "可感知但不可触发，并说明原因"
      ]
    ],
    "useWhen": [
      "空间有限且操作属于同一对象",
      "次要命令需要按组呈现"
    ],
    "avoidWhen": [
      "最主要的下一步不应被隐藏",
      "只有一个操作，直接使用按钮更清晰"
    ],
    "confusedWith": "菜单承载命令或选项；Popover 可以放任意轻量内容；原生 select 专门选择表单值。",
    "codeUI": [
      "button、aria-expanded、menu/menuitem 语义、定位、焦点与 Escape"
    ],
    "media": [
      "菜单文字、图标和状态全部由代码渲染，不需要图片"
    ],
    "prompt": "请为对象操作实现一个 Menu：由有名称的更多按钮触发，打开时焦点进入第一项，支持方向键、Enter 和 Escape；危险操作独立分组，关闭后焦点回到触发按钮，主操作不要藏进菜单。",
    "related": [
      "button",
      "top-nav",
      "modal",
      "drawer"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/"
  }
];

export const controlsEnglish = {
  "button": {
    "name": "Button",
    "level": "Foundation",
    "tags": [
      "Action",
      "Code control",
      "Accessibility"
    ],
    "ask": "Add a button that saves the content when I press it.",
    "definition": "A button triggers an action in the current page, such as submit, save, open, switch, or delete.",
    "role": "It tells users that an action will occur, instead of pretending to be a navigation link.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Recipe detail button code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Action label",
        "Explains the result instead of saying only OK"
      ],
      [
        "Hierarchy",
        "Separates primary, secondary, and destructive actions"
      ],
      [
        "Icon",
        "Supports the label without replacing it"
      ],
      [
        "States",
        "Hover, active, focus, disabled, and loading"
      ]
    ],
    "variants": [
      [
        "Primary",
        "The most important action on the page"
      ],
      [
        "Secondary",
        "An alternate or cancel action"
      ],
      [
        "Icon button",
        "A familiar single action in constrained space"
      ]
    ],
    "states": [
      [
        "Hover and pressed",
        "Responds immediately without layout shift"
      ],
      [
        "Focus",
        "Uses a high-contrast focus ring"
      ],
      [
        "Disabled and loading",
        "Explains unavailability or preserves progress"
      ]
    ],
    "useWhen": [
      "The action happens in the current page or component",
      "The user submits, switches, or triggers feedback"
    ],
    "avoidWhen": [
      "Clicking navigates to another page; use a link",
      "A dangerous result has no confirmation or undo"
    ],
    "confusedWith": "A button performs an action and a link navigates. Their appearance can overlap, but semantics and keyboard behavior differ.",
    "codeUI": [
      "button type, accessible name, focus-visible, disabled, and aria-busy"
    ],
    "media": [
      "Buttons, icons, labels, and states are entirely code-rendered and need no imagery"
    ],
    "prompt": "Implement the save action with a real button element. Provide primary and secondary hierarchy plus default, hover, active, focus, disabled, loading, success, and error states, then show recoverable feedback after activation."
  },
  "checkbox": {
    "name": "Checkbox",
    "level": "Foundation",
    "tags": [
      "Forms",
      "Multiple selection",
      "State"
    ],
    "ask": "Let people select several independent items and submit them together.",
    "definition": "A checkbox represents one independent binary choice, and multiple checkboxes in a group can be selected at once.",
    "role": "It gives users explicit control over each choice and can represent unchecked, partially selected, and fully selected group states.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Checkbox code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Box control",
        "Shows unchecked, checked, or mixed state"
      ],
      [
        "Clickable label",
        "Names the choice and expands the hit area"
      ],
      [
        "Help or error",
        "Explains consequences, constraints, or validation"
      ],
      [
        "Group",
        "Uses fieldset and legend for one shared question"
      ]
    ],
    "variants": [
      [
        "Single confirmation",
        "Accepts terms or one independent option"
      ],
      [
        "Multi-select group",
        "Allows several selections at once"
      ],
      [
        "Select all or mixed",
        "Parent reflects partially selected children"
      ]
    ],
    "states": [
      [
        "Unchecked or checked",
        "Visual and checked state stay synchronized"
      ],
      [
        "Mixed",
        "Uses indeterminate for partial selection"
      ],
      [
        "Disabled or invalid",
        "Keeps labels readable and explains the constraint"
      ]
    ],
    "useWhen": [
      "Users can choose zero, one, or several items",
      "Each independent choice must be recorded explicitly"
    ],
    "avoidWhen": [
      "Options are mutually exclusive and need radio buttons",
      "A setting applies immediately and a switch is clearer"
    ],
    "confusedWith": "Checkboxes allow multiple selections and often submit with a form; radios are exclusive; switches express immediately applied settings.",
    "codeUI": [
      "input type=checkbox, label, fieldset/legend, indeterminate, and error association"
    ],
    "media": [
      "The box, check state, and label stay entirely code-rendered"
    ],
    "prompt": "Use native checkboxes for a multi-select group. Make each full label clickable, describe the question with fieldset and legend, and support unchecked, checked, indeterminate, disabled, and invalid states. Do not replace submitted multi-select choices with switches."
  },
  "form": {
    "name": "Input / Form",
    "level": "Foundation",
    "tags": [
      "Input",
      "Validation",
      "Code control"
    ],
    "ask": "Build a sign-up form that users can submit and explain every validation error clearly.",
    "definition": "A form organizes inputs, guidance, validation, and submission into one completable task path.",
    "role": "It reduces input effort, catches errors early, and explains how submitted information will be used.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Meal selection form code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Label",
        "Explains what a field requests"
      ],
      [
        "Control",
        "A real input, select, switch, or other form element"
      ],
      [
        "Help and error",
        "Sits near the field and explains how to recover"
      ],
      [
        "Submit area",
        "Shows available, loading, and result states"
      ]
    ],
    "variants": [
      [
        "Single-column form",
        "Preferred for mobile and beginner flows"
      ],
      [
        "Multi-step form",
        "Useful when information is long but ordered"
      ],
      [
        "Inline edit",
        "Updates a few fields inside a detail view"
      ]
    ],
    "states": [
      [
        "Focus",
        "Label and border state are clear"
      ],
      [
        "Validation error",
        "Uses text plus color and explains the fix"
      ],
      [
        "Submitting",
        "Prevents duplicates and reports progress"
      ]
    ],
    "useWhen": [
      "The product collects or edits structured information",
      "There is a clear submit, save, or next step"
    ],
    "avoidWhen": [
      "Only one search query is needed",
      "There are many ungrouped fields with no priority"
    ],
    "confusedWith": "An input is one field; a form is the task composed of fields and submission logic.",
    "codeUI": [
      "label, input, fieldset, validation, autocomplete, and error associations"
    ],
    "media": [
      "Form structure, text, and states must remain code"
    ],
    "prompt": "Implement an accessible, single-column-first form where every field has a label, help text, and associated error. Include loading, success, and error states on submission, and keep the mobile keyboard from covering the active field."
  },
  "toggle": {
    "name": "Switch",
    "level": "Foundation",
    "tags": [
      "Binary state",
      "Settings",
      "Code control"
    ],
    "ask": "Make this setting turn on and off immediately like a switch in phone settings.",
    "definition": "A switch controls a binary setting that takes effect immediately, with clear labels or feedback for both on and off.",
    "role": "It gives direct control over a persistent preference without requiring form submission to reveal the result.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Saved-items setting switch code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Label",
        "Names the controlled setting"
      ],
      [
        "Track",
        "Contains the on and off positions"
      ],
      [
        "Thumb",
        "Shows the current value spatially"
      ],
      [
        "Feedback",
        "Reports save success or failure when needed"
      ]
    ],
    "variants": [
      [
        "Immediate save",
        "Persists as soon as it changes"
      ],
      [
        "Local preference",
        "Theme, notifications, and filters"
      ],
      [
        "Described switch",
        "Adds explanation for a complex setting"
      ]
    ],
    "states": [
      [
        "On and off",
        "Uses text or shape in addition to color"
      ],
      [
        "Disabled",
        "Explains which other setting limits it"
      ],
      [
        "Save failure",
        "Allows retry and restores the original value"
      ]
    ],
    "useWhen": [
      "A setting has exactly on and off values",
      "The change can take effect immediately"
    ],
    "avoidWhen": [
      "Several choices are needed",
      "Switching performs a dangerous action without confirmation"
    ],
    "confusedWith": "A switch controls a persistent setting; a checkbox is better for independent selections submitted with a form.",
    "codeUI": [
      "button role=switch or input, aria-checked, and Space-key behavior"
    ],
    "media": [
      "Track, thumb, and state are always rendered in code"
    ],
    "prompt": "Implement an accessible switch with a clear label, Space-key activation, and synchronized visual plus aria-checked states. Report save success or failure after switching and keep its dimensions fixed."
  },
  "menu": {
    "name": "Menu",
    "level": "Advanced",
    "tags": [
      "Actions",
      "Overlay",
      "Keyboard"
    ],
    "ask": "Put secondary actions such as Rename, Duplicate, and Delete in a More menu.",
    "definition": "A menu is a triggered collection of related commands or options used to conserve space and organize secondary actions.",
    "role": "It puts low-frequency commands in a predictable place while preserving keyboard navigation and a clear way to close it.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Menu code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Trigger",
        "A named button exposes expanded state and relationship"
      ],
      [
        "Menu surface",
        "Appears close to its trigger"
      ],
      [
        "Menu items",
        "Use verbs and consistent icon semantics"
      ],
      [
        "Groups and danger",
        "Use separation and more than color alone"
      ]
    ],
    "variants": [
      [
        "Action menu",
        "Rename, duplicate, archive, and similar commands"
      ],
      [
        "Selection menu",
        "Chooses one value from a set"
      ],
      [
        "Cascading menu",
        "Useful in complex desktop tools but limited on mobile"
      ]
    ],
    "states": [
      [
        "Closed or expanded",
        "aria-expanded matches visibility"
      ],
      [
        "Keyboard navigation",
        "Arrow keys move, Enter activates, Escape closes and restores focus"
      ],
      [
        "Disabled item",
        "Remains perceivable but cannot run and explains why"
      ]
    ],
    "useWhen": [
      "Space is limited and actions belong to the same object",
      "Secondary commands benefit from grouping"
    ],
    "avoidWhen": [
      "The primary next step should remain visible",
      "One action is clearer as a direct button"
    ],
    "confusedWith": "A menu contains commands or options, a popover may contain any lightweight content, and a native select chooses a form value.",
    "codeUI": [
      "Button, aria-expanded, menu or menuitem semantics, positioning, focus, and Escape behavior"
    ],
    "media": [
      "Menu labels, icons, and states stay entirely code-rendered"
    ],
    "prompt": "Implement an object action menu from a named More button. Move focus to the first item on open, support arrow keys, Enter, and Escape, separate dangerous commands, restore focus to the trigger on close, and keep the primary action outside the menu."
  }
};
