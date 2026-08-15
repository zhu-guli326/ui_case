# BLOOM Eco-Rewards UI Deconstruction

## Visual Direction

- Product: gamified eco-habit and community rewards App.
- Presentation: two physical phones placed on a realistic meadow and daisy background.
- Core contrast: photographic nature outside the devices, flat acid-lime and pale-lime surfaces inside.
- Brand device: one hand-inked leaf mascot with black rubber-hose limbs and lavender/yellow props.
- UI character: energetic, friendly, chunky, and highly legible rather than finance-heavy.
- Internal phone canvas: fixed `390 x 693` (9:16).

## Presentation Layers

### Meadow Board

- Top-down natural meadow photograph with clover, moss, short grass, and white daisies.
- Left phone rotates approximately `-10deg`; right phone rotates approximately `2deg`.
- Device shadows follow one morning-light direction.
- The meadow is presentation media only and does not appear inside the App screens.

### Phone Shell

- One reusable black phone frame component.
- Thin metallic edge highlight and restrained glass reflection.
- Status bar, Dynamic Island, signal, Wi-Fi, battery, and home indicator remain code UI.
- Maintain stable phone dimensions so rotation never changes the board layout.

## Screen A: Onboarding

1. Acid-lime background.
2. Status bar.
3. Large central Sprig mascot illustration.
4. Short brand headline and supporting sentence.
5. Small onboarding pagination.
6. Wide emerald primary CTA with a circular arrow control.

Implementation notes:

- Mascot, arrow prop, and leaf-token stack are one illustration asset or one consistently generated asset group.
- Background, text, CTA, pagination, and arrow icon are code-rendered.
- Keep the mascot inside a stable `aspect-ratio: 1 / 1` stage so text does not shift across onboarding steps.
- The CTA touch target should be at least 52px high.

## Screen B: Rewards Dashboard

1. Pale-lime page background.
2. Greeting and notification action.
3. White points-summary panel.
4. Large points value and short change indicator.
5. Three quick-action buttons: Move, Recycle, Invite.
6. Dark plum streak/progress strip.
7. Recent activity list with four rows.
8. Floating dark bottom navigation.

Implementation notes:

- The balance is explicitly an in-App points count, not money or cryptocurrency.
- Quick actions are real buttons with icons from one code icon system.
- Activity rows use a fixed icon column, flexible copy column, and right-aligned timestamp.
- Bottom navigation reserves stable page padding so it never covers activity content.

## Design Tokens

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--acid` | `#b9f449` | Onboarding and selected accents |
| `--lime-soft` | `#dfff9a` | Dashboard background |
| `--emerald` | `#10a96b` | Primary CTA and Move action |
| `--lavender` | `#9b79ed` | Invite and illustration prop |
| `--yellow` | `#f4cb3f` | Recycle and reward highlight |
| `--plum` | `#34283d` | Progress strip and bottom nav |
| `--ink` | `#171817` | Main text and outlines |
| `--surface` | `#ffffff` | Information panels |
| `--muted` | `#74786f` | Secondary labels |

### Typography

| Role | Size | Weight | Line height |
| --- | --- | --- | --- |
| Onboarding headline | 36-42px | 800-900 | .98 |
| Points value | 36-42px | 750-850 | 1 |
| Section title | 20-22px | 700-800 | 1.1 |
| Row title | 15-16px | 600-700 | 1.25 |
| Supporting copy | 14-16px | 400-500 | 1.4 |
| Micro metadata | 12px | 500-600 | 1.2 |

### Shape And Spacing

- Screen horizontal inset: 20px.
- Primary panel radius: 18px.
- Quick action radius: 14px.
- Button height: 48-54px.
- Bottom nav height: 58-64px.
- Section gap: 20-28px.
- Activity row minimum height: 58px.
- Icon button hit area: 44x44px.

## Code UI Versus Image Assets

### Code-rendered

- All text, values, timestamps, streak counts, and labels.
- Summary panel, quick actions, progress strip, list rows, CTA, and bottom navigation.
- Notification, walk, recycle, invite, activity, arrow, and navigation icons.
- Status bar and phone shell.
- Flat lime backgrounds, color states, focus rings, and pressed states.

### Image-generated

- Meadow and daisy presentation background.
- Main Sprig mascot scene.
- Optional secondary mascot poses for empty, success, and streak states.

Generated illustration assets must contain no readable text, buttons, status bars, phone hardware, UI glyphs, or navigation.

## Icon Coverage

Use one library, preferably `@phosphor-icons/react`.

| Semantic name | Suggested icon | Size | State |
| --- | --- | --- | --- |
| `notification` | `Bell` | 20px | default, unread |
| `move` | `PersonSimpleWalk` | 22px | default, completed |
| `recycle` | `Recycle` | 22px | default, completed |
| `invite` | `UsersThree` | 22px | default, completed |
| `arrow` | `ArrowRight` | 20px | default, pressed |
| `home` | `House` | 22px | default, selected |
| `community` | `Users` | 22px | default, selected |
| `streak` | `Lightning` | 22px | default, selected |
| `rewards` | `Gift` | 22px | default, selected |
| `profile` | `UserCircle` | 22px | default, selected |

## Interaction Map

- `START BLOOMING`: advances to the dashboard.
- Onboarding pagination: switches mascot message and active dot.
- Move/Recycle/Invite: opens a local task sheet and records simulated completion.
- Streak strip: opens a seven-day progress view.
- Activity row: opens task details.
- Notification button: toggles the notifications panel.
- Bottom navigation: switches Home, Community, Streak, and Profile states.

## Implementation Order

1. Build the 390x693 phone canvas and shell.
2. Establish the lime/plum design tokens and unified icon registry.
3. Implement onboarding and dashboard with placeholder illustration slots.
4. Generate and integrate the meadow and Sprig assets.
5. Add task state, points updates, streak feedback, and navigation.
6. Build the two-phone presentation board with responsive transforms.
7. Validate text overflow, touch targets, contrast, mobile framing, icon alignment, and console output.

## Main Risks

- Acid lime can reduce contrast; black text should remain the default.
- Mascot illustration must not contain generated text or fake UI fragments.
- Quick-action buttons need distinct labels and icons, not color alone.
- Points language must stay clearly non-financial.
- Phone rotation can cause clipping on narrow screens; switch to a vertical board layout below the desktop breakpoint.
