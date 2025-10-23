# Design Guidelines: Reve AI Image Generation Platform

## Design Approach

**Selected Approach**: Reference-Based (Modern AI Creative Tools)

Drawing inspiration from: Midjourney, Replicate, RunwayML, and Hugging Face Spaces - focusing on clean, functional interfaces that let generated content shine while maintaining professional tool aesthetics.

**Core Principles**:
- Content-first: Generated images are the hero, not decorative elements
- Functional clarity: Each model interface is distinct and immediately understandable
- Progressive disclosure: Advanced options hidden until needed
- Gallery-focused: Image outputs take visual precedence

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - UI, body text, labels
- Accent: JetBrains Mono (Google Fonts) - API keys, technical details

**Hierarchy**:
- Page Title: text-4xl font-bold (Inter)
- Section Headers: text-2xl font-semibold (Inter)
- Model Tabs: text-lg font-medium (Inter)
- Body Text: text-base (Inter)
- Labels: text-sm font-medium (Inter)
- Helper Text: text-xs text-gray-600 (Inter)
- Code/API: text-sm font-mono (JetBrains Mono)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: gap-6, gap-8, space-y-8
- Micro spacing: gap-2, gap-4

**Container Structure**:
- Max width: max-w-7xl mx-auto
- Side padding: px-4 md:px-8
- Vertical sections: py-8 md:py-12

**Grid System**:
- Template gallery: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- Generation history: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Two-column layouts (form + preview): grid-cols-1 lg:grid-cols-2 gap-8

---

## Page Structure

**Header Section** (sticky top-0):
- Logo/title on left
- API key input field (password type with eye toggle) on right
- Trust indicator: "Your API key is stored locally and never sent to our servers"
- Height: h-16, backdrop blur effect when scrolled

**Model Navigation Tabs**:
- Three prominent tabs: "Text-to-Image" | "Edit" | "Remix"
- Active state with underline indicator
- Icons from Heroicons: SparklesIcon, PencilIcon, ArrowPathIcon

**Main Content Area** (scrollable):

1. **Active Model Interface** (changes per tab):
   - Prompt textarea (h-24 md:h-32, prominent positioning)
   - Template pills section below prompt (horizontal scrollable chips)
   - Model-specific controls:
     - Text-to-Image: Aspect ratio selector, image count
     - Edit: Image upload zone (drag-drop), edit instructions
     - Remix: Reference image upload, style strength slider
   - Generate button: Large, prominent (h-12, w-full md:w-auto px-12)

2. **Template Gallery Section**:
   - Heading: "Quick Start Templates"
   - 8-12 template cards in grid
   - Card structure: Image preview (aspect-square), prompt text overlay on hover, one-click apply

3. **Generation Output Area**:
   - Live status indicator during generation (progress bar + percentage)
   - Generated images in masonry/grid layout
   - Each image card: Full image, download button (top-right overlay), prompt used (bottom overlay on hover)
   - Empty state: Illustration + "Generate your first image" message

**Footer** (minimal):
- Links: FAL.ai Documentation, API Reference, GitHub
- Copyright notice
- Height: h-16

---

## Component Library

**Input Components**:
- Text inputs: Rounded-lg border with focus ring, h-10 for single-line, h-24+ for textareas
- File upload zones: Dashed border, rounded-lg, p-8, icon + helper text centered
- Sliders: Custom track with visible value indicator
- Dropdowns: Rounded-md with chevron icon, shadow-sm

**Cards**:
- Template cards: Rounded-lg overflow-hidden, shadow-md hover:shadow-xl transition
- Image result cards: Rounded-xl overflow-hidden, relative positioning for overlays
- Glass morphism for overlay buttons: backdrop-blur-md bg-white/10

**Buttons**:
- Primary (Generate): Rounded-lg px-6 py-3, font-medium, shadow-md
- Secondary (Download, Apply): Rounded-md px-4 py-2, font-medium
- Icon-only: Square (h-10 w-10), rounded-md, icon size 5
- Buttons on images: backdrop-blur-md bg-white/90 (no hover color changes, rely on native states)

**Icons** (Heroicons via CDN):
- SparklesIcon, PencilIcon, ArrowPathIcon, PhotoIcon, ArrowDownTrayIcon, XMarkIcon, EyeIcon, EyeSlashIcon

**Loading States**:
- Skeleton screens for image placeholders: Rounded-xl bg-gray-200 animate-pulse
- Spinner: Circular progress from Heroicons
- Progress bar: h-2 rounded-full with animated fill

**Status Indicators**:
- Success: Checkmark icon, brief toast notification
- Error: Warning icon with error message text
- Processing: Animated spinner with status text

---

## Images Strategy

**Generated Content** (primary focus):
- All generated images displayed at high quality
- Aspect ratios preserved (square, landscape, portrait based on model output)
- Lazy loading for gallery performance
- Click to enlarge modal (full-screen lightbox)

**Template Previews**:
- Small preview images (aspect-square) for each template
- Optimized thumbnails for fast loading
- Fallback placeholders if image fails to load

**Placeholder Graphics**:
- Empty state illustration: Abstract image generation concept (upload icon + sparkles)
- Upload zones: Simple icon-based placeholders

**No Hero Section**: This is a utility tool, not a marketing page - content begins immediately with interface

---

## Interaction Patterns

**API Key Management**:
- Inline input in header (always visible)
- Save to localStorage on input
- Clear visual feedback when key is saved
- Disabled generate buttons when no API key present

**Template Selection**:
- Click template → auto-fills prompt
- Visual highlight on selected template
- One-click workflow: Select template → Adjust if needed → Generate

**Model Switching**:
- Tabs preserve individual model states
- Each model remembers last used settings
- Smooth content transitions between tabs

**Generation Flow**:
1. Enter prompt or select template
2. Configure model-specific options
3. Click generate → Show loading state
4. Display result in output area
5. Enable download/save actions

**Image Actions**:
- Hover reveals download button and prompt
- Click image opens full-screen modal
- Right-click disabled (optional protection)

---

## Responsive Behavior

**Desktop (lg+)**:
- Full two-column layout for form + preview
- Template gallery: 4 columns
- History grid: 3 columns
- Header: Full horizontal layout

**Tablet (md)**:
- Template gallery: 3 columns
- History grid: 2 columns
- Form and preview stack vertically
- Header: Compact API input

**Mobile (base)**:
- All grids: Single column
- Horizontal scrolling for template pills
- Stacked interface elements
- Sticky header with compact API input (modal entry)

---

## Accessibility & Polish

- All images have alt text (generated from prompts)
- Focus indicators on all interactive elements
- Keyboard navigation for tabs and templates
- ARIA labels for icon-only buttons
- Screen reader announcements for generation status
- Minimum touch target size: 44×44px
- High contrast text (WCAG AA compliant)

**Animation Budget**:
- Subtle fade-ins for generated images (duration-300)
- Smooth tab transitions (duration-200)
- Hover scale on template cards (scale-105)
- Loading spinner rotation
- No decorative or scroll-triggered animations