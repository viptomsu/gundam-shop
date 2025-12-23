### Implementation Plan: Refactor Store Navigation Components

I have refactored the store navigation components (`CategoryNav`, `SeriesNav`, `BrandNav`) to reduce code duplication and handle multi-line titles gracefully.

#### 1. Created `NavSectionGrid` Component

- Created `components/store/nav-section-grid.tsx`.
- This component encapsulates the shared UI logic for displaying a grid of navigation cards.
- It accepts standardized props: `items`, `title`, `baseHref`, `viewAllHref`, and options for labeling and theming (`variant`, `badgeLabel`, `actionLabel`).
- Added `truncate` to the title `h3` to fix the multi-line overflow issue by forcing a single line with ellipsis.
- Limited the number of displayed items to 4 (`slice(0, 4)`) as per user request to rely on the "View All" button.
- Implemented logic to handle both "default" (primary color, cover image) and "brand" (accent color, contain logo) variants.

#### 2. Refactored `CategoryNav`

- Updated `components/store/category-nav.tsx` to fetch data and then map it to the `NavSectionItem` structure.
- Removed the inline JSX and replaced it with `<NavSectionGrid />`.

#### 3. Refactored `SeriesNav`

- Updated `components/store/series-nav.tsx` similarly to `CategoryNav`.
- Used `badgeLabel="UNITS"` to match the original design.

#### 4. Refactored `BrandNav`

#### 5. Prioritized Brands, Categories, and Series

- Modified Prisma schema:
  - Removed `isFeatured` from `Brand`.
  - Added `order` (Int, default 0) to `Brand`, `Category`, and `Series`.
- Updated API Routes:
  - `app/api/brands/route.ts`: Sort by `order` asc, then `createdAt` desc.
  - `app/api/categories/route.ts`: Sort by `order` asc, then `createdAt` desc.
  - `app/api/series/route.ts`: Sort by `order` asc, then `createdAt` desc.
- Updated `pnpm db push` to apply changes.
- Frontend components (`BrandNav`, `CategoryNav`, `SeriesNav`) now rely on the API returning data in the correct `order`.

- Updated `components/store/brand-nav.tsx`.
- Mapped `brand.logo` to the `image` prop.
- Used `variant="brand"`, `badgeLabel="PRODUCTS"`, and `actionLabel="VIEW ALL"` to match the original design.

### Verification

- Checked that all 3 files now look much cleaner and delegate the UI rendering to `NavSectionGrid`.
- The `NavSectionGrid` correctly handles the visual differences (colors, image sizing) based on the `variant` prop.
- The multi-line title issue is addressed via CSS line clamping.
