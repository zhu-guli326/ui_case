# Skill Detail Page Requirements

Last updated: 2026-08-31

## Page identity

- Public route: `skill-detail.html`
- Product role: focused detail view for one Skill resource
- Canonical implementation: `src/features/skills/skill-detail.js`, `src/features/skills/skill-detail.css`

## Page goal

Provide enough focused information about one Skill for a user to understand what it does, how it is useful and where to continue.

## Core user task

A user opening a Skill detail should be able to answer:

- What is this Skill?
- What problem does it help solve?
- How can I use or access it?
- Is there source code / an official repository / an external resource?

## Core functions

- Display one selected Skill and its essential metadata.
- Explain its value concisely.
- Provide the correct original / repository link where available.
- Surface reusable prompt or usage guidance only when it materially helps.
- Provide a clear way back to `skills.html`.

## Information structure

1. Skill identity
2. Short purpose / use case
3. Key capabilities or usage notes
4. Source / official link / action
5. Return to Skills directory

## Interaction rules

- Keep the page focused on one item.
- Avoid rebuilding the entire Skills directory inside the detail page.
- Do not duplicate global navigation.
- Chinese and English content should remain equivalent where translations exist.

## Keep

- Clear resource identity.
- Source / official destination.
- Concise usage context.

## Remove / avoid

- Dense unrelated recommendations.
- Full directory filtering controls.
- Launcher configuration features.
- Duplicate catalog state that belongs in `skills-data.js`.

## Modification boundary

This page is only for focused Skill detail. Any change that primarily improves browsing across many resources belongs in `skills.html` instead.
