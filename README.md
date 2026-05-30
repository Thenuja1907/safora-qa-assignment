# Safora QA Assignment - Contact Form Automation

QA Engineering Intern Assignment - Part 2

Automation framework: Playwright (TypeScript)

Target: https://safora.se/en/contact.html

## Tests Covered

- TC-004: Valid form submission shows success message
- TC-005: Empty form does not submit successfully
- TC-006: Invalid email - BUG confirmed (form accepts invalid email)
- TC-008: XSS injection does not execute

## How to Run

Step 1 - Install Node.js from https://nodejs.org

Step 2 - Open terminal in this folder and run:
```bash
npm install @playwright/test
```

Step 3 - Install browser:
```bash
npx playwright install chromium
```

Step 4 - Run the tests:
```bash
npx playwright test --headed --project=chromium
```

Step 5 - View the HTML report:
```bash
npx playwright show-report
```

## Results

All 4 automated tests passed on Google Chrome.

1 bug found: BUG-001 - Contact form accepts invalid email format.

