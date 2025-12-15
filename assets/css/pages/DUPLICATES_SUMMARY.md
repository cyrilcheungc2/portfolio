# CSS Duplicate Analysis Summary

**Scan Date:** October 12, 2025  
**Scope:** `assets/css/pages/*.css`

---

## Statistics

### Full Block Duplicates (Entire Selectors Commented Out)

| File | Full Blocks Commented | Details |
|------|----------------------|---------|
| **illustrator.css** | 10 blocks | body, li, input#click, .logo, nav, nav ul, nav ul li a, a, a:after, .wrapper |
| **index.css** | 10 blocks | body, li, input#click, .logo, nav, nav ul, nav ul li a, a, a:after, a:hover:after, nav ul li a:hover, nav .menu-btn i, + media query block |
| **photo.css** | 10 blocks | body, li, input#click, .logo, nav, nav ul, nav ul li a, a, a:after, a:hover:after, .wrapper, + media query block |
| **video.css** | 16 blocks | body, li, input#click + 13 internal duplicates (nav blocks repeated twice in same file), + media query block |
| **graphic.css** | 0 blocks | **REFERENCE FILE** - kept as original source |
| **resume.css** | 0 blocks | Unique Bootstrap-based implementation |
| **uiux.css** | 0 blocks | Unique slider implementation (different pattern) |

**Total Full Blocks Commented:** **46 blocks**

---

### Single-Line Property Duplicates (Individual Properties Commented)

| File | Properties Commented | Context |
|------|---------------------|---------|
| **illustrator.css** | 32 lines | Within `@media (max-width: 768px)` - mobile nav properties |
| **index.css** | 32 lines | Within `@media (max-width: 768px)` - mobile nav properties |
| **photo.css** | 32 lines | Within `@media (max-width: 768px)` - mobile nav properties |
| **video.css** | 48 lines | Within both `@media (max-width: 768px)` blocks (duplicate media queries) |

**Total Property Lines Commented:** **144 lines**

---

## Duplicate Patterns Identified

### 1. Base Styles (Cross-file Duplicates)
- `body { margin: 0; font-family: Arial, Helvetica, sans-serif; }`
  - **Source:** graphic.css (implicit), illustrator.css (first explicit)
  - **Duplicates:** index.css, photo.css, video.css

- `li { display: flex; }`
  - **Source:** graphic.css (first occurrence)
  - **Duplicates:** illustrator.css, index.css, photo.css, video.css

### 2. Navigation Infrastructure (Cross-file Duplicates)
Complete nav system found in 5 files:
- `input#click { visibility: hidden; }`
- `.logo { width: 75px; height: 35px; }`
- `nav { ... }` (6 properties)
- `nav ul { display: flex; list-style: none; }`
- `nav ul li a { ... }` (8 properties)
- `nav .menu-btn i { ... }` (4 properties)
- `.wrapper { display: inline-flex; }`

**Source:** illustrator.css  
**Duplicates:** index.css, photo.css, video.css

### 3. Navbar Hover Effects (Cross-file Duplicates)
- `a { ... }` (6 properties)
- `a:after { ... }` (4 properties)
- `nav ul li a:hover::after { ... }` (6 properties)
- `a:hover:after { width: 80%; }`
- `nav ul li a:hover { color: #fc6d6d; }`

**Source:** graphic.css  
**Duplicates:** illustrator.css, index.css, photo.css, video.css

### 4. Hero Section (Cross-file Duplicates)
- `section#page1 { ... }` with gradient background

**Source:** illustrator.css  
**Duplicates:** index.css, photo.css, video.css (appears TWICE in video.css)

### 5. Mobile Menu (Media Query Duplicates)
Entire `@media screen and (max-width: 768px) { ... }` block with ~12 rules

**Source:** illustrator.css  
**Duplicates:** index.css, photo.css, video.css

### 6. Responsive Typography (Media Query Duplicates)
`@media screen and (max-width: 900px) and (min-width: 320px) { ... }`

**Source:** illustrator.css  
**Duplicates:** index.css, photo.css, video.css

---

## Internal Duplicates (Within Same File)

### video.css - CRITICAL ISSUE
**Problem:** Navigation code appears TWICE in the same file
- First occurrence: Lines 1-11 (partial)
- Second occurrence: Lines 207-293 (complete nav system)

**Action Taken:** Commented out the second occurrence entirely (lines 207-293)

---

## Files Analyzed

| File | Status | Lines | Duplicates Found |
|------|--------|-------|------------------|
| **graphic.css** | ✅ Reference (untouched) | 208 | 0 (source file) |
| **illustrator.css** | ✅ Cleaned | 627 | 42 items commented |
| **index.css** | ✅ Cleaned | 569 | 42 items commented |
| **photo.css** | ✅ Cleaned | 267 | 42 items commented |
| **video.css** | ✅ Cleaned | 503 | 64 items commented |
| **resume.css** | ⚪ Unique | 2107 | 0 (Bootstrap, different pattern) |
| **uiux.css** | ⚪ Unique | 281 | 0 (slider, different pattern) |

---

## Recommendations

### Immediate Next Steps
1. **Test all pages** to ensure visual appearance is unchanged
2. **Remove commented blocks** from duplicates once verified
3. **Consolidate** common code into `assets/css/main2.css`
4. **Update HTML files** to include shared stylesheet before page-specific CSS

### HTML Link Order
```html
<link rel="stylesheet" href="/assets/css/main.css">
<link rel="stylesheet" href="/assets/css/main2.css">  <!-- Shared styles -->
<link rel="stylesheet" href="/assets/css/pages/[page].css">  <!-- Page-specific -->
```

### Code Cleanup Priority
1. **High:** Remove 46 duplicate selector blocks
2. **Medium:** Consolidate mobile menu code (144 duplicate property lines)
3. **Low:** Consider refactoring unique page patterns

---

## Visual Benefits in VSCode

✅ **Foldable regions:** All commented blocks can be collapsed using VSCode's folding feature  
✅ **Easy identification:** 🔁 emoji makes duplicates instantly visible  
✅ **Safe refactoring:** Original code preserved, can be uncommented if needed  
✅ **Clear hierarchy:** Reference files vs. duplicate files clearly marked  

---

*Analysis complete. No code was deleted. All duplicates are commented and can be folded.*



