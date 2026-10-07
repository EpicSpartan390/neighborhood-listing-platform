# Lab 2 Accessibility and Responsive Test Notes

**Test date:** October 6, 2026
**Branch:** `feature/ui-components`
**Environment:** Google Chrome using `http://localhost:3000`

## Keyboard Navigation

The page was tested without using a mouse after the initial page load.

### Forward Tab Sequence

1. Neighborhood select
2. Maximum price select
3. Minimum bedrooms select
4. Minimum bathrooms select
5. Search properties button
6. First property: Save property button
7. First property: View listing link
8. Second property: Save property button
9. Second property: View listing link
10. Third property: Save property button
11. Third property: View listing link
12. First sponsor link
13. Second sponsor link

### Keyboard Results

| Test | Observed result | Status |
|---|---|---|
| Tab | Focus moved through controls in the documented sequence. | Pass |
| Shift+Tab | Focus moved backward from the second card to the first card's listing link. | Pass |
| Space | Activated the Favorite button and changed its visible text from `Save property` to `Saved`. | Pass |
| Enter | Activated the first property's listing link and opened the matching Realtor.com page. | Pass |
| Alt+Left | Returned from Realtor.com to the local application. | Pass |
| Visible focus | A green focus-visible ring appeared around keyboard-focused controls. | Pass |

**Focus evidence:** [View keyboard-focus screenshot](screenshots/lab2-keyboard-focus.png)

## Form Validation and Feedback

Submitting the search form without choosing a neighborhood displayed:

> Choose a neighborhood before searching.

The neighborhood select used `aria-invalid` and `aria-describedby`, and the error used `role="alert"`.

A valid search for Pacific Palisades with a maximum price of $2,500,000 returned one property. Activating its Favorite button changed the button state to `Saved`.

- [View form-error screenshot](screenshots/lab2-search-form-error.png)
- [View filter-and-favorite screenshot](screenshots/lab2-filter-favorite-state.png)

## Responsive Layout Tests

| Viewport width | Expected layout | Observed result | Status |
|---:|---|---|---|
| 375 px | One property-card column | One column with no horizontal scrollbar or overlapping content | Pass |
| 768 px | Two property-card columns | Two columns with the third card on the next row | Pass |
| 1280 px | Three property-card columns | Three cards displayed in one row | Pass |

- [View 375 px screenshot](screenshots/lab2-responsive-375.png)
- [View 768 px screenshot](screenshots/lab2-responsive-768.png)
- [View 1280 px screenshot](screenshots/lab2-responsive-1280.png)

The property-grid classes are:

```text
grid gap-6 md:grid-cols-2 lg:grid-cols-3
```

The layout uses one column by default, two columns at the Tailwind `md` breakpoint, and three columns at the `lg` breakpoint.

## Semantic and Image Review

- The page uses one `<h1>`.
- Major page sections use `<h2>`.
- Property and sponsor titles use `<h3>`.
- Each property uses an `<article>` root.
- Each sponsor uses an `<aside>` root.
- Property image alt text dynamically combines the property address with its property-specific image description.
- Sponsor images receive descriptive alt text from typed sponsor data.
- Sponsored content includes a visible `Sponsored` label.

## Failures and Pending Tests

No unexpected keyboard or responsive-layout failures were observed during these manual tests.

The empty-neighborhood submission intentionally produced the expected validation error.

## Lighthouse Accessibility Audit

Lighthouse was run in Google Chrome using Navigation mode, Desktop device settings, and the Accessibility category.

- **Accessibility score:** 100
- **Failed automated accessibility audits:** None
- **Run warning:** Lighthouse reported that stored IndexedDB data could affect loading-performance results. This warning did not reduce the Accessibility score and was not an accessibility failure.
- **Manual-review items:** Lighthouse listed ten additional areas that automated testing cannot fully verify. Keyboard focus, purpose and state, tab order, visual/DOM order, focus trapping, landmarks, labels, and ARIA behavior were reviewed manually as documented above.

**Lighthouse evidence:** [View accessibility score screenshot](screenshots/lab2-lighthouse-accessibility-100.png)