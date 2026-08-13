---
name: IMAGE2 UI Design System Lab
description: A restrained comparison workspace for design-system decisions.
colors:
  canvas: "#f2f3f0"
  surface: "#ffffff"
  surface-subtle: "#f8f9f6"
  ink: "#191a18"
  muted: "#5f635d"
  line: "#d8dad4"
  accent: "#168143"
  accent-soft: "#eaf4ed"
typography:
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "0"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0"
rounded:
  control: "5px"
  panel: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "40px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "40px"
---

# Design System: IMAGE2 UI Design System Lab

## Overview

**Creative North Star: "The Comparison Bench"**

The laboratory is a dense, calm work surface where the preview remains more visually expressive than the shell around it. It uses stable rails, compact controls, and explicit states. It rejects marketing composition, decorative card walls, and controls whose meaning depends on novelty.

## Colors

Neutral surfaces carry structure; green is reserved for current selection, success, and system-level focus.

- **Canvas** (#f2f3f0): Workbench background.
- **Surface** (#ffffff): Primary panels and controls.
- **Ink** (#191a18): Primary text and commands.
- **Signal Green** (#168143): Selection, focus reinforcement, and success.
- **Line** (#d8dad4): Structural dividers and control boundaries.

## Typography

One system sans-serif family carries the complete product UI. Titles stay compact and labels use weight rather than tracked uppercase styling. Body prose is limited to 72ch while mappings and tokens may use denser rows.

## Elevation

The shell is flat by default. Borders and tonal surface changes create hierarchy; shadows are reserved for menus, dialogs, and the framed preview device.

## Components

Buttons, segmented controls, selects, tabs, and icon controls share 4-6px radii and stable 40-44px heights. Selected state combines background, text weight, and semantics. Preview frames may change shape with device and design system, but laboratory controls do not.

## Do's and Don'ts

### Do:

- **Do** show a usable account-settings template on first load.
- **Do** keep page, system, theme, and device changes independent.
- **Do** show visible focus and text-backed state changes.
- **Do** keep provenance and export limitations beside each system.

### Don't:

- **Don't** place an oversized hero before the working tool.
- **Don't** turn every option into a floating card.
- **Don't** create filter combinations that resolve to empty results.
- **Don't** ship flattened or non-interactive mockups as previews.
- **Don't** imply that Apple HIG is an official web component library or that maintained-state limitations do not exist.
