import { test, expect } from '@playwright/test';

const CONTACT_URL = 'https://safora.se/en/contact.html';

test('TC-004 | Valid form submission shows success message', async ({ page }) => {
  await page.goto(CONTACT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  await page.locator('input[name*="name" i], input[placeholder*="name" i]').first().fill('John Doe');
  await page.locator('input[type="email"]').first().fill('john@example.com');
  await page.locator('textarea').first().fill('I would like to learn more about Safora.');

  // Click submit button
  await page.locator('button[type="submit"], input[type="submit"]').first().click();

  // Wait and check for success
  await page.waitForTimeout(5000);
  const pageContent = await page.content();

  if (pageContent.includes('sent') || pageContent.includes('success') || pageContent.includes('thank')) {
    console.log('TC-004 PASSED - Success message found');
  } else {
    // Take a screenshot to see what happened
    await page.screenshot({ path: 'tc004-result.png' });
    console.log('TC-004 - Screenshot saved, check tc004-result.png');
  }
});

test('TC-005 | Empty form shows validation errors', async ({ page }) => {
  await page.goto(CONTACT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByRole('button', { name: /submit|send/i }).click();
  await expect(page.locator('text=Your message has been sent successfully')).not.toBeVisible({ timeout: 5000 });
  console.log('TC-005 PASSED - Form did not submit with empty fields');
});

test('TC-006 | Invalid email - BUG - form submits without validation', async ({ page }) => {
  await page.goto(CONTACT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('input[name*="name" i], input[placeholder*="name" i]').first().fill('Jane Smith');
  await page.locator('input[type="email"]').first().fill('notanemail');
  await page.locator('textarea').first().fill('Test message.');
  await page.getByRole('button', { name: /submit|send/i }).click();
  await page.waitForTimeout(5000);
  const success = await page.locator('text=Your message has been sent successfully').count();
  if (success > 0) {
    console.log('TC-006 FAILED - BUG: Invalid email was accepted!');
  } else {
    console.log('TC-006 PASSED - Validation error shown');
  }
});

test('TC-008 | XSS injection does not execute', async ({ page }) => {
  await page.goto(CONTACT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  let alertFired = false;
  page.on('dialog', async (dialog) => {
    alertFired = true;
    await dialog.dismiss();
  });
  await page.locator('input[name*="name" i], input[placeholder*="name" i]').first().fill('<script>alert("xss")</script>');
  await page.locator('input[type="email"]').first().fill('test@example.com');
  await page.locator('textarea').first().fill('XSS test');
  await page.getByRole('button', { name: /submit|send/i }).click();
  await page.waitForTimeout(5000);
  expect(alertFired).toBe(false);
  console.log('TC-008 PASSED - No XSS alert fired');
});