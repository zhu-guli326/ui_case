export const feedbackEntries = [
  {
    "id": "modal",
    "name": "模态框",
    "en": "Modal",
    "category": "feedback",
    "level": "进阶",
    "tags": [
      "浮层",
      "打断",
      "dialog"
    ],
    "ask": "点一下之后中间弹个框，背景变灰，先完成这个任务再回去。",
    "definition": "模态框通过遮罩暂时阻断背景交互，把用户注意力集中到一个短任务或确认动作。",
    "role": "用于确认、编辑、选择或需要集中注意的短流程，但不应滥用来承载普通详情。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "模态框的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "遮罩",
        "降低背景对比度并阻止点击"
      ],
      [
        "标题/说明",
        "解释任务和后果"
      ],
      [
        "内容区",
        "表单、选择或确认信息"
      ],
      [
        "关闭/动作",
        "Escape、关闭按钮和明确 CTA"
      ]
    ],
    "variants": [
      [
        "确认模态",
        "删除、退出、覆盖等动作"
      ],
      [
        "编辑模态",
        "少量字段的集中修改"
      ],
      [
        "全屏模态",
        "移动端复杂内容"
      ]
    ],
    "states": [
      [
        "打开",
        "焦点进入对话框"
      ],
      [
        "提交中",
        "防止重复提交"
      ],
      [
        "关闭",
        "返回触发点或保存后的上下文"
      ]
    ],
    "useWhen": [
      "动作需要确认或短暂集中注意",
      "背景内容暂时不应操作"
    ],
    "avoidWhen": [
      "只是查看详情，抽屉或内联面板更自然",
      "表单很长且需要上下文"
    ],
    "confusedWith": "模态框会阻断背景；Popover/Tooltip 不阻断；抽屉通常保留更多上下文。",
    "codeUI": [
      "dialog、focus trap、aria-modal、Escape、遮罩与恢复焦点"
    ],
    "media": [
      "背景媒体可用图片，但对话框文字/控件必须是代码"
    ],
    "prompt": "请实现一个可访问 modal：打开后焦点进入对话框，Escape 和关闭按钮可退出，背景不能操作，关闭后焦点回到触发按钮；移动端宽度不溢出。",
    "related": [
      "drawer",
      "toast",
      "detail-panel"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  },
  {
    "id": "drawer",
    "name": "抽屉",
    "en": "Drawer",
    "category": "feedback",
    "level": "进阶",
    "tags": [
      "浮层",
      "详情",
      "响应式"
    ],
    "ask": "从右边滑出一块详情，背后的列表还看得见，关掉后回到原来的位置。",
    "definition": "抽屉是从屏幕边缘滑入的面板，适合承载详情、筛选或次级导航，同时保留背景上下文。",
    "role": "在桌面端避免跳页，在移动端可以转换成底部抽屉或全屏面板。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "抽屉的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "边缘入口",
        "右侧、左侧或底部出现"
      ],
      [
        "遮罩",
        "可选，决定背景是否可操作"
      ],
      [
        "标题/关闭",
        "说明当前面板和退出方式"
      ],
      [
        "内容滚动区",
        "面板内部独立滚动"
      ]
    ],
    "variants": [
      [
        "右侧抽屉",
        "桌面详情和筛选"
      ],
      [
        "左侧抽屉",
        "导航或工作区列表"
      ],
      [
        "底部抽屉",
        "移动端操作和筛选"
      ]
    ],
    "states": [
      [
        "打开/关闭",
        "有明确触发与回退"
      ],
      [
        "拖拽",
        "移动端可拖动但不能替代关闭按钮"
      ],
      [
        "错误",
        "面板保留尺寸并提供重试"
      ]
    ],
    "useWhen": [
      "需要保留列表/背景上下文",
      "详情或筛选内容比 popover 更丰富"
    ],
    "avoidWhen": [
      "内容只有一句提示",
      "任务需要完全阻断背景且必须确认"
    ],
    "confusedWith": "抽屉强调侧边上下文；模态框强调阻断；Popover 强调触发点附近的短信息。",
    "codeUI": [
      "dialog/aside、focus management、滑入过渡、内部滚动"
    ],
    "media": [
      "面板中的对象图片可用外部占位图，面板结构与控件由代码呈现"
    ],
    "prompt": "请实现一个桌面右侧 Drawer，展示选中对象详情；移动端切换为底部 sheet 或全屏面板；支持 Escape、关闭按钮和点击遮罩，打开后保留来源列表滚动位置。",
    "related": [
      "detail-panel",
      "modal",
      "bottom-tabs"
    ],
    "source": "https://m3.material.io/components/navigation-drawer/overview"
  },
  {
    "id": "toast",
    "name": "轻提示",
    "en": "Toast",
    "category": "feedback",
    "level": "基础",
    "tags": [
      "反馈",
      "状态",
      "code-status"
    ],
    "ask": "角落冒出一句‘已保存’，过两秒自动消失，但用户也能知道结果。",
    "definition": "轻提示是短暂、非阻断的操作反馈，告诉用户刚刚发生了什么或下一步可以做什么。",
    "role": "提供即时确认，不打断用户继续浏览；持续性或高风险信息应使用更强的反馈。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "轻提示的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "消息",
        "短句说明结果"
      ],
      [
        "状态色",
        "成功、警告、错误有语义差异"
      ],
      [
        "持续时间",
        "给足阅读时间，不只闪一下"
      ],
      [
        "撤销/关闭",
        "重要操作可提供撤销"
      ]
    ],
    "variants": [
      [
        "成功提示",
        "保存、复制、收藏完成"
      ],
      [
        "错误提示",
        "请求失败并提供重试"
      ],
      [
        "带操作提示",
        "撤销、查看详情或恢复"
      ]
    ],
    "states": [
      [
        "出现",
        "不抢焦点但可被读屏感知"
      ],
      [
        "堆叠",
        "限制数量，避免互相覆盖"
      ],
      [
        "关闭",
        "自动消失与手动关闭并存"
      ]
    ],
    "useWhen": [
      "短暂反馈即可，不需要用户停下来处理",
      "操作结果明确且可继续浏览"
    ],
    "avoidWhen": [
      "错误需要修复",
      "信息必须持续可见",
      "反馈会改变数据但没有撤销"
    ],
    "confusedWith": "Toast 短暂反馈；Alert/Banner 持续存在；Modal 会阻断任务。",
    "codeUI": [
      "role=status/alert、计时、堆叠位置、撤销按钮"
    ],
    "media": [
      "提示框、文字和图标必须由代码渲染"
    ],
    "prompt": "请添加一个不会阻断操作的 toast 系统：成功/错误有不同语义，默认持续 3-5 秒，重要操作提供撤销；使用 aria-live，不覆盖移动端底部导航。",
    "related": [
      "empty-state",
      "button",
      "modal"
    ],
    "source": "https://www.w3.org/WAI/ARIA/apg/patterns/alert/"
  },
  {
    "id": "skeleton",
    "name": "加载骨架屏",
    "en": "Loading Skeleton",
    "category": "feedback",
    "level": "进阶",
    "tags": [
      "加载",
      "性能感知",
      "布局稳定"
    ],
    "ask": "数据还没回来时先保留卡片形状，别只放一个转圈，也别加载完突然跳。",
    "definition": "加载骨架屏用接近最终内容的占位结构表示数据正在到达，并保持页面布局稳定。",
    "role": "它减少空白等待和布局位移，让用户提前理解内容结构，但不会伪装成真实数据。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "加载骨架屏的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "结构占位",
        "对应最终标题、媒体、正文或列表行"
      ],
      [
        "加载状态",
        "容器使用 aria-busy，避免逐块播报装饰骨架"
      ],
      [
        "尺寸约束",
        "与最终组件宽高接近"
      ],
      [
        "替换策略",
        "真实内容到达后原位替换并恢复可操作状态"
      ]
    ],
    "variants": [
      [
        "卡片骨架",
        "媒体、标题和摘要块"
      ],
      [
        "列表骨架",
        "重复行与头像占位"
      ],
      [
        "局部骨架",
        "仅替换正在刷新的面板或字段"
      ]
    ],
    "states": [
      [
        "首次加载",
        "显示完整结构但不伪造文字"
      ],
      [
        "后台刷新",
        "尽量保留已有内容并提示更新"
      ],
      [
        "失败",
        "停止骨架并显示可恢复的错误状态"
      ]
    ],
    "useWhen": [
      "内容加载时间可感知且最终结构已知",
      "需要避免页面在数据到达后跳动"
    ],
    "avoidWhen": [
      "操作几乎即时完成",
      "结构未知或等待需要明确进度百分比"
    ],
    "confusedWith": "骨架屏表示结构化内容正在加载；进度条表示可测量进度；空状态表示加载完成但没有内容。",
    "codeUI": [
      "aria-busy、稳定尺寸、CSS 动效、reduced-motion、内容原位替换"
    ],
    "media": [
      "骨架形状由 CSS 渲染；不要生成含伪文字或伪数据的图片"
    ],
    "prompt": "请为卡片网格添加 Loading Skeleton：占位块与最终媒体、标题和摘要尺寸一致，容器标记 aria-busy；支持 prefers-reduced-motion，真实内容原位替换，失败时切换为带重试的错误状态。",
    "related": [
      "empty-state",
      "card-grid",
      "list",
      "responsive"
    ],
    "source": "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy"
  },
  {
    "id": "empty-state",
    "name": "空状态 / 无结果",
    "en": "Empty / No-results State",
    "category": "feedback",
    "level": "基础",
    "tags": [
      "状态",
      "首次使用",
      "恢复"
    ],
    "ask": "列表确实没有内容，或者搜索一个结果都没匹配时，告诉用户下一步能做什么。",
    "definition": "空状态在加载完成但集合没有内容时解释原因，并提供一个与当前上下文相关的下一步。",
    "role": "它区分首次使用、集合为空和筛选无结果，让正常的‘没有内容’不会看起来像页面损坏。",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "空状态与无结果的代码组件预览",
      "caption": "界面结构、文字和控件由代码渲染；照片仅使用可替换的外部占位图片。",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "状态标题",
        "直接说明这里为什么为空"
      ],
      [
        "简短解释",
        "补充上下文，不责怪用户"
      ],
      [
        "下一步",
        "创建、导入、清除筛选或返回"
      ],
      [
        "可选视觉",
        "辅助理解但不承载必要文字"
      ]
    ],
    "variants": [
      [
        "首次使用",
        "解释价值并提供第一个创建动作"
      ],
      [
        "集合为空",
        "说明还没有对象或对象已归档"
      ],
      [
        "无结果",
        "保留搜索/筛选条件并指导放宽"
      ]
    ],
    "states": [
      [
        "默认空状态",
        "一个明确主行动足够"
      ],
      [
        "无结果",
        "显示当前查询并提供清除"
      ],
      [
        "操作后为空",
        "说明刚刚发生的变化并允许撤销"
      ]
    ],
    "useWhen": [
      "加载已经完成且集合确实为空",
      "搜索或筛选没有任何匹配项"
    ],
    "avoidWhen": [
      "数据仍在加载，使用骨架或进度反馈",
      "请求失败，使用带恢复动作的错误状态"
    ],
    "confusedWith": "空状态是有效的内容缺失；骨架屏表示内容尚未到达；错误状态表示请求或操作失败。",
    "codeUI": [
      "语义标题、状态说明、真实行动按钮、动态更新时的 status 提示"
    ],
    "media": [
      "可选插画或照片使用外部占位图片，但所有文字和操作保持代码渲染"
    ],
    "prompt": "请为列表分别设计首次使用、集合为空和无搜索结果状态：保留当前查询或筛选，说明为什么没有内容，并只提供一个清晰的下一步；加载与错误使用各自独立的状态组件。",
    "related": [
      "search",
      "toast",
      "skeleton",
      "card-grid"
    ],
    "source": "https://www.nngroup.com/articles/empty-state-interface-design/"
  }
];

export const feedbackEnglish = {
  "modal": {
    "name": "Modal",
    "level": "Advanced",
    "tags": [
      "Overlay",
      "Interruption",
      "Dialog"
    ],
    "ask": "Open a centered dialog over a dimmed background and make me finish this short task before returning.",
    "definition": "A modal temporarily blocks background interaction and concentrates attention on a short task or confirmation.",
    "role": "It supports confirmation, editing, selection, or focused short flows, but should not become a default container for ordinary details.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Recipe detail modal code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Scrim",
        "Reduces background contrast and blocks interaction"
      ],
      [
        "Title and description",
        "Explain the task and its consequences"
      ],
      [
        "Content",
        "Form, selection, or confirmation information"
      ],
      [
        "Close and actions",
        "Escape, a close button, and a clear CTA"
      ]
    ],
    "variants": [
      [
        "Confirmation modal",
        "Delete, exit, or overwrite decisions"
      ],
      [
        "Edit modal",
        "A focused set of fields"
      ],
      [
        "Full-screen modal",
        "Complex content on mobile"
      ]
    ],
    "states": [
      [
        "Open",
        "Focus enters the dialog"
      ],
      [
        "Submitting",
        "Duplicate submission is prevented"
      ],
      [
        "Closed",
        "Focus returns to the trigger or saved context"
      ]
    ],
    "useWhen": [
      "An action needs confirmation or brief concentration",
      "The background must be temporarily unavailable"
    ],
    "avoidWhen": [
      "The user is only viewing details and a drawer fits",
      "The form is long and depends on background context"
    ],
    "confusedWith": "A modal blocks the background, popovers and tooltips do not, and a drawer usually preserves more context.",
    "codeUI": [
      "dialog, focus trap, aria-modal, Escape, scrim, and focus restoration"
    ],
    "media": [
      "Background media may be an image, but all dialog copy and controls remain code"
    ],
    "prompt": "Implement an accessible modal that moves focus inside when opened, closes with Escape or its close button, prevents background interaction, and restores focus to its trigger. Keep it within the mobile viewport."
  },
  "drawer": {
    "name": "Drawer",
    "level": "Advanced",
    "tags": [
      "Overlay",
      "Details",
      "Responsive"
    ],
    "ask": "Slide details in from the right while keeping the source list visible, then return me to the same position when it closes.",
    "definition": "A drawer enters from a screen edge and contains detail, filtering, or secondary navigation while preserving background context.",
    "role": "It prevents unnecessary page changes on desktop and can become a bottom sheet or full-screen panel on mobile.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Detail drawer content code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Edge",
        "Enters from the right, left, or bottom"
      ],
      [
        "Scrim",
        "Optionally decides whether the background remains interactive"
      ],
      [
        "Title and close",
        "Name the panel and provide an exit"
      ],
      [
        "Scroll region",
        "Panel content scrolls independently"
      ]
    ],
    "variants": [
      [
        "Right drawer",
        "Desktop detail and filtering"
      ],
      [
        "Left drawer",
        "Navigation or workspace lists"
      ],
      [
        "Bottom drawer",
        "Mobile actions and filters"
      ]
    ],
    "states": [
      [
        "Open and close",
        "Has a clear trigger and return path"
      ],
      [
        "Drag",
        "Can support touch dragging without replacing a close button"
      ],
      [
        "Error",
        "Keeps its dimensions and offers retry"
      ]
    ],
    "useWhen": [
      "The source list or background context must remain visible",
      "Detail or filter content is richer than a popover"
    ],
    "avoidWhen": [
      "The content is only one short message",
      "The task must block the background and require confirmation"
    ],
    "confusedWith": "A drawer emphasizes edge context, a modal emphasizes interruption, and a popover stays near its trigger.",
    "codeUI": [
      "dialog or aside, focus management, slide transition, and internal scrolling"
    ],
    "media": [
      "Object media may use external placeholders, while drawer structure and controls stay in code"
    ],
    "prompt": "Implement a desktop right drawer for selected-object details and switch it to a bottom sheet or full-screen panel on mobile. Support Escape, a close button, and scrim dismissal while preserving the source list's scroll position."
  },
  "toast": {
    "name": "Toast",
    "level": "Foundation",
    "tags": [
      "Feedback",
      "Status",
      "Code status"
    ],
    "ask": "Show a brief 'Saved' message in the corner for a couple of seconds so users know the action succeeded.",
    "definition": "A toast is brief, non-blocking feedback that reports what just happened or suggests an optional next action.",
    "role": "It confirms an operation without interrupting browsing; persistent or high-risk information needs a stronger pattern.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Membership action feedback code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Message",
        "A short sentence describing the result"
      ],
      [
        "Semantic state",
        "Success, warning, and error are distinguishable"
      ],
      [
        "Duration",
        "Allows enough reading time"
      ],
      [
        "Undo or close",
        "Important changes can be reversed"
      ]
    ],
    "variants": [
      [
        "Success toast",
        "Save, copy, or favorite completed"
      ],
      [
        "Error toast",
        "Request failed with a recovery path"
      ],
      [
        "Action toast",
        "Includes undo, view, or restore"
      ]
    ],
    "states": [
      [
        "Appearing",
        "Does not steal focus but is announced"
      ],
      [
        "Stacking",
        "Limits quantity to prevent overlap"
      ],
      [
        "Closing",
        "Supports timeout and manual dismissal"
      ]
    ],
    "useWhen": [
      "Brief feedback is enough and work can continue",
      "The result is clear and low risk"
    ],
    "avoidWhen": [
      "An error requires correction",
      "The message must remain visible",
      "Data changes without an undo path"
    ],
    "confusedWith": "A toast is temporary, an alert or banner persists, and a modal interrupts the task.",
    "codeUI": [
      "role=status or alert, timer, stacking position, and undo action"
    ],
    "media": [
      "Toast surface, message, and icons must be code-rendered"
    ],
    "prompt": "Add a non-blocking toast system with distinct success and error semantics, a default duration of three to five seconds, and undo for important operations. Use aria-live and do not cover mobile bottom navigation."
  },
  "skeleton": {
    "name": "Loading Skeleton",
    "level": "Advanced",
    "tags": [
      "Loading",
      "Perceived performance",
      "Layout stability"
    ],
    "ask": "Reserve the card shapes while data loads so the page does not show only a spinner or jump when content arrives.",
    "definition": "A loading skeleton uses placeholders close to the final content structure to communicate that data is arriving while keeping layout stable.",
    "role": "It reduces blank waiting and layout shift, previews content structure, and never pretends placeholder values are real data.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Loading skeleton code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "Structure placeholders",
        "Correspond to final media, headings, text, or rows"
      ],
      [
        "Loading state",
        "Uses aria-busy on the container without announcing decorative blocks"
      ],
      [
        "Size constraints",
        "Stay close to final component dimensions"
      ],
      [
        "Replacement strategy",
        "Swaps real content in place and restores interaction"
      ]
    ],
    "variants": [
      [
        "Card skeleton",
        "Media, title, and summary blocks"
      ],
      [
        "List skeleton",
        "Repeated rows and avatar placeholders"
      ],
      [
        "Local skeleton",
        "Refreshes only the pending panel or field"
      ]
    ],
    "states": [
      [
        "Initial load",
        "Shows structure without fake labels"
      ],
      [
        "Background refresh",
        "Keeps existing content when practical and indicates updating"
      ],
      [
        "Failure",
        "Stops the skeleton and shows a recoverable error state"
      ]
    ],
    "useWhen": [
      "Loading time is noticeable and the final structure is known",
      "Layout must not jump when data arrives"
    ],
    "avoidWhen": [
      "The operation completes almost instantly",
      "Structure is unknown or progress needs a measured percentage"
    ],
    "confusedWith": "A skeleton represents structured content loading, a progress bar represents measurable progress, and an empty state means loading finished with no content.",
    "codeUI": [
      "aria-busy, stable dimensions, CSS motion, reduced-motion, and in-place replacement"
    ],
    "media": [
      "Skeleton shapes come from CSS; do not use an image containing fake text or data"
    ],
    "prompt": "Add loading skeletons to the card grid with placeholder media, title, and summary dimensions matching the final cards. Mark the container aria-busy, support prefers-reduced-motion, replace content in place, and switch to a retryable error state on failure."
  },
  "empty-state": {
    "name": "Empty / No-results State",
    "level": "Foundation",
    "tags": [
      "State",
      "First use",
      "Recovery"
    ],
    "ask": "When a list is genuinely empty or a search matches nothing, explain what users can do next.",
    "definition": "An empty state explains why a collection has no content after loading is complete and offers a context-appropriate next step.",
    "role": "It distinguishes first use, an empty collection, and filtered no-results so a valid absence does not look like a broken page.",
    "example": {
      "src": "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80",
      "alt": "Empty and no-results code component preview",
      "caption": "Layout, copy, and controls are rendered in code; photos use replaceable external placeholders only.",
      "source": "external-placeholder"
    },
    "anatomy": [
      [
        "State title",
        "Says directly why this area is empty"
      ],
      [
        "Short explanation",
        "Adds context without blaming the user"
      ],
      [
        "Next step",
        "Create, import, clear filters, or return"
      ],
      [
        "Optional visual",
        "Supports understanding without carrying required text"
      ]
    ],
    "variants": [
      [
        "First use",
        "Explains value and offers the first creation action"
      ],
      [
        "Empty collection",
        "Explains that no objects exist or all are archived"
      ],
      [
        "No results",
        "Keeps the query or filters and shows how to broaden them"
      ]
    ],
    "states": [
      [
        "Default empty",
        "One clear primary action is enough"
      ],
      [
        "No results",
        "Shows the current query and a reset action"
      ],
      [
        "Empty after an action",
        "Explains the change and allows undo when appropriate"
      ]
    ],
    "useWhen": [
      "Loading is complete and the collection is genuinely empty",
      "Search or filters have no matching items"
    ],
    "avoidWhen": [
      "Data is still loading and needs a skeleton or progress feedback",
      "A request failed and needs a recoverable error state"
    ],
    "confusedWith": "An empty state is a valid absence, a skeleton means content has not arrived, and an error state means a request or action failed.",
    "codeUI": [
      "Semantic heading, state copy, a real action button, and status announcement for dynamic updates"
    ],
    "media": [
      "An optional illustration or photo may use external media, while all copy and actions remain code-rendered"
    ],
    "prompt": "Design separate first-use, empty-collection, and no-search-results states. Preserve the current query or filters, explain why content is absent, and offer one clear next step. Keep loading and error feedback in their own state components."
  }
};
