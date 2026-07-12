# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-12
### Added
- Playwright end-to-end and accessibility testing (using `@axe-core/playwright` WCAG scans).
- Stryker mutation testing for pure logic modules.
- Pre-commit gates with Husky, lint-staged, and commitlint for conventional commits.
- Architecture enforcement rules using dependency-cruiser.
- Semgrep SAST step in CI workflow.
- CycloneDX SBOM generation step on build.
- Programmatic Lighthouse CI performance/accessibility gate.
- Size-limit checks for client JS bundles.
- Offline/low-connectivity fallback capabilities (R9 feature), caching venue data and live operations snapshot client-side, showing offline banners, and serving local Q&A answers.
- Public accessibility statement page.
- k6 matchday traffic load test script and documented results.
- Fault-injection integration tests for Gemini timeout and database down states.
- Support for Arabic auto-direction and RTL computed direction check.
- RFC 9116 security.txt Express route.

## [1.0.0] - 2026-06-01
### Added
- Initial release of ArenaFlow smart stadium operations and fan assistant application.
