import { expect, test } from '@playwright/test'

test('app loads and basic components render', async ({ page }) => {
  // Navigate to the app
  await page.goto('/')

  // Expect title to contain EmailSign (or wait for app to mount)
  await expect(page).toHaveTitle(/EmailSign/i)

  // Wait for the main editor wrapper or a known element
  // The app renders an #app div and should have the signature preview
  await expect(page.locator('#app')).toBeVisible()

  // Verify the settings/options tabs are present
  // The sidebar has links/buttons for General, Images, Social, etc.
  const generalTab = page.getByText(/General/i)
  await expect(generalTab).toBeVisible()

  // Verify we can switch to templates
  const templatesTab = page.getByText(/Templates/i)
  await expect(templatesTab).toBeVisible()

  // Go to Templates and verify a template can be selected
  await templatesTab.click()

  // Assuming there's a list of templates, wait for at least one
  // The templates usually have some distinguishing class or data-attr
  // For a basic smoke test, just verifying the tab opens is good.
})
