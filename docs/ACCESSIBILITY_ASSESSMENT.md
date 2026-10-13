# Accessibility assessment — v2 release candidate

This records the rc.1 baseline scope. Corrected-candidate route widths, keyboard and automated results are supplied in the final execution receipts; PDF improvements and remaining limits are assessed in `PDF_ACCESSIBILITY.md`.

Assessment date: 11 October 2026. This is an internal assessment, not WCAG certification.

All four routes were exercised in Chromium at narrow and desktop widths. Automated checks cover 320-pixel reflow, accessible names, headings, contrast and axe checks after deferred dashboard sections load. Keyboard checks cover navigation, indicator selection and deferred-section activation. A discovered focus-loss defect was fixed: keyboard activation now focuses the named section, and Tab reaches its first control. Horizontally scrolling data tables are keyboard focusable. Charts have text alternatives, errors expose retry actions, and reduced-motion preferences are respected.

The final automated suite passed 12 browser tests. These results establish the tested scope only. NVDA, JAWS, VoiceOver, real mobile devices, browser zoom across the full application, and tagged-PDF accessibility have not been tested. Independent assistive-technology review remains pending. The generated PDFs have been visually and textually checked but are not certified accessible documents.
