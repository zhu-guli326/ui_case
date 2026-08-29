import { foundationEntries, foundationEnglish } from "./foundation.js";
import { layoutEntries1, layoutEnglish1 } from "./layout-1.js";
import { layoutEntries2, layoutEnglish2 } from "./layout-2.js";
import { navigationEntries1, navigationEnglish1 } from "./navigation-1.js";
import { navigationEntries2, navigationEnglish2 } from "./navigation-2.js";
import { contentEntries1, contentEnglish1 } from "./content-1.js";
import { contentEntries2, contentEnglish2 } from "./content-2.js";
import { contentEntries3, contentEnglish3 } from "./content-3.js";
import { controlsEntries, controlsEnglish } from "./controls.js";
import { feedbackEntries, feedbackEnglish } from "./feedback.js";
import { visualEntries, visualEnglish } from "./visual.js";

export const vocabularyCategories = [
  {
    "id": "all",
    "label": "全部词条",
    "en": "All terms",
    "countLabel": "44"
  },
  {
    "id": "foundation",
    "label": "页面基础",
    "en": "Page foundations",
    "countLabel": "5"
  },
  {
    "id": "layout",
    "label": "页面布局",
    "en": "Page layouts",
    "countLabel": "7"
  },
  {
    "id": "navigation",
    "label": "导航与发现",
    "en": "Navigation and discovery",
    "countLabel": "8"
  },
  {
    "id": "content",
    "label": "内容展示",
    "en": "Content display",
    "countLabel": "13"
  },
  {
    "id": "controls",
    "label": "控件与表单",
    "en": "Controls and forms",
    "countLabel": "5"
  },
  {
    "id": "feedback",
    "label": "反馈与浮层",
    "en": "Feedback and overlays",
    "countLabel": "5"
  },
  {
    "id": "visual",
    "label": "视觉与实现",
    "en": "Visual design",
    "countLabel": "1"
  },
  {
    "id": "favorites",
    "label": "我的收藏",
    "en": "Favorites",
    "countLabel": "0"
  }
];

const vocabularyEntryPool = Object.fromEntries([...foundationEntries, ...layoutEntries1, ...layoutEntries2, ...navigationEntries1, ...navigationEntries2, ...contentEntries1, ...contentEntries2, ...contentEntries3, ...controlsEntries, ...feedbackEntries, ...visualEntries].map((entry) => [entry.id, entry]));
const vocabularyOrder = [
  "app-shell",
  "header",
  "hero",
  "cta",
  "responsive",
  "top-nav",
  "sidebar",
  "breadcrumbs",
  "bottom-tabs",
  "tabs",
  "segmented",
  "search",
  "filter-chips",
  "card",
  "card-grid",
  "list",
  "media-tile",
  "detail-panel",
  "data-table",
  "button",
  "checkbox",
  "form",
  "toggle",
  "menu",
  "modal",
  "drawer",
  "toast",
  "skeleton",
  "empty-state",
  "typography",
  "layout-single-column",
  "layout-landing-page",
  "layout-masonry",
  "layout-fullscreen",
  "layout-split-pane",
  "layout-dashboard",
  "layout-modular",
  "carousel-fade",
  "carousel-3d",
  "carousel-stack",
  "carousel-page",
  "carousel-accordion",
  "carousel-360",
  "carousel-parallax"
];
const vocabularyEnglishById = Object.assign({}, foundationEnglish, layoutEnglish1, layoutEnglish2, navigationEnglish1, navigationEnglish2, contentEnglish1, contentEnglish2, contentEnglish3, controlsEnglish, feedbackEnglish, visualEnglish);

export const vocabularyEntries = vocabularyOrder.map((id) => vocabularyEntryPool[id]).filter(Boolean);

export function localizeVocabularyEntry(entry, language = "zh") {
  if (!entry || language !== "en") return entry;
  if (entry.componentKind) {
    const categoryNames = { hero: "hero", card: "card", button: "button", modal: "modal", form: "form", tabs: "tabs" };
    const categoryName = categoryNames[entry.componentKind] || "UI";
    return {
      ...entry,
      name: entry.en,
      level: "Component term",
      tags: [categoryName[0].toUpperCase() + categoryName.slice(1), "Reusable pattern"],
      ask: `I need a ${entry.en} for a product interface.`,
      definition: `A ${entry.en} is a reusable ${categoryName} interface pattern.`,
      role: "It gives the page a clear, reusable structure.",
      anatomy: [["Structure", "Keep content, actions, and states clearly organized"], ["Responsive behavior", "Adapt the layout and size to the available space"], ["Interaction states", "Cover default, hover, focus, loading, and error states"]],
      variants: [["Default form", "Use the standard version for the main scenario"], ["Small-screen form", "Keep content readable and actions reachable on mobile"]],
      states: [["Default", "Content and the main action are visible"], ["Focused", "Keyboard users can see the current position"], ["Loading or error", "Feedback appears without shifting the layout"]],
      useWhen: ["The interface needs this reusable structure", "You need a clear term for design or engineering collaboration"],
      avoidWhen: ["The content goal does not match the pattern"],
      confusedWith: `A ${entry.en} is a reusable interface structure, not an entire page or business workflow.`,
      codeUI: ["Semantic HTML, stable dimensions, responsive layout, and keyboard focus"],
      media: ["Images, video, and illustration remain replaceable content media"],
      prompt: `Build a ${entry.en} for a product interface. Keep it responsive, accessible, and complete with default, focus, loading, and error states.`,
    };
  }
  return { ...entry, ...(vocabularyEnglishById[entry.id] || {}), en: entry.en };
}

export const vocabularyById = Object.fromEntries(vocabularyEntries.map((entry) => [entry.id, entry]));
