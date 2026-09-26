import { test, expect } from '@playwright/test';

test.describe('EducaTech Gamificação - Fluxos Completos', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start with a fresh state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('Fluxo 1: Navegação Inicial, Acessibilidade e Alto Contraste', async ({ page }) => {
    // Check main title
    await expect(page.locator('#main-navigation-header').getByText('EDUCATECH')).toBeVisible();
    await expect(page.locator('#main-navigation-header').getByText('Canindé Distribuidora')).toBeVisible();

    // Check accessibility toolbar
    const highContrastBtn = page.locator('#btn-toggle-high-contrast');
    await expect(highContrastBtn).toBeVisible();

    // Toggle High Contrast on
    await highContrastBtn.click();
    const isHighContrast = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
    expect(isHighContrast).toBe(true);

    // Toggle High Contrast off
    await highContrastBtn.click();
    const isHighContrastOff = await page.evaluate(() => document.documentElement.classList.contains('high-contrast'));
    expect(isHighContrastOff).toBe(false);

    // Toggle CC Captions
    const captionsBtn = page.locator('#btn-toggle-captions');
    await expect(captionsBtn).toBeVisible();
  });

  test('Fluxo 2: Abrir Planilha, Safe-Fail, Checklist e Edição de Células', async ({ page }) => {
    // Open Spreadsheet from Hub
    const openBtn = page.locator('#btn-quick-start-demo-mission');
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    // Verify modal is open
    const modal = page.locator('#spreadsheet-modal-backdrop');
    await expect(modal).toBeVisible();
    await expect(page.locator('#modal-excel-title')).toContainText('Controle de Vendas');

    // Verify NPCs are present inside the modal
    await expect(page.locator('#spreadsheet-window-container').getByText('Juvenildo Canindé').first()).toBeVisible();
    await expect(page.locator('#spreadsheet-window-container').getByText('Zequinha Silva').first()).toBeVisible();

    // Verify formula bar input is present
    const formulaInput = page.locator('#excel-formula-bar-input');
    await expect(formulaInput).toBeVisible();

    // Test Safe-Fail trigger: try submitting before completing checklist
    const submitBtn = page.locator('#btn-submit-artifact-evaluation');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Safe-Fail banner must appear
    const safeFailAlert = page.locator('role=alert');
    await expect(safeFailAlert).toBeVisible();
    await expect(safeFailAlert).toContainText('Segunda Chance Ativada');

    // Dismiss safe-fail alert
    const dismissAlertBtn = safeFailAlert.locator('button');
    await dismissAlertBtn.click();
    await expect(safeFailAlert).not.toBeVisible();

    // Click cell E4 in spreadsheet
    const cellE4 = page.locator('[aria-label*="Célula E4"]');
    await expect(cellE4).toBeVisible();
    await cellE4.click();

    // Click the "+ =SOMA()" quick button
    const somaBtn = page.locator('button:has-text("+ =SOMA()")');
    await somaBtn.click();

    // Verify E4 now contains calculation
    await expect(cellE4).toContainText(/15[\.,]?800/);

    // Fill E5, E6, E7
    await page.locator('[aria-label*="Célula E5"]').click();
    await formulaInput.fill('=SOMA(B5:D5)');
    await formulaInput.press('Enter');

    await page.locator('[aria-label*="Célula E6"]').click();
    await formulaInput.fill('=SOMA(B6:D6)');
    await formulaInput.press('Enter');

    await page.locator('[aria-label*="Célula E7"]').click();
    await formulaInput.fill('=SOMA(B7:D7)');
    await formulaInput.press('Enter');

    // Fill meta situation SE formulas
    await page.locator('[aria-label*="Célula F4"]').click();
    await formulaInput.fill('=SE(E4>=15000; "Atingiu"; "Abaixo")');
    await formulaInput.press('Enter');

    await page.locator('[aria-label*="Célula F5"]').click();
    await formulaInput.fill('=SE(E5>=15000; "Atingiu"; "Abaixo")');
    await formulaInput.press('Enter');

    await page.locator('[aria-label*="Célula F6"]').click();
    await formulaInput.fill('=SE(E6>=15000; "Atingiu"; "Abaixo")');
    await formulaInput.press('Enter');

    await page.locator('[aria-label*="Célula F7"]').click();
    await formulaInput.fill('=SE(E7>=15000; "Atingiu"; "Abaixo")');
    await formulaInput.press('Enter');

    // Fill Total Geral, Média, Máximo, Mínimo on rows 9, 10, 11, 12
    await page.locator('[aria-label*="Célula E9"]').click();
    await formulaInput.fill('=SOMA(E4:E7)');
    await formulaInput.press('Enter');

    await page.locator('[aria-label*="Célula E10"]').click();
    await formulaInput.fill('=MÉDIA(E4:E7)');
    await formulaInput.press('Enter');

    await page.locator('[aria-label*="Célula E11"]').click();
    await formulaInput.fill('=MÁXIMO(E4:E7)');
    await formulaInput.press('Enter');

    await page.locator('[aria-label*="Célula E12"]').click();
    await formulaInput.fill('=MÍNIMO(E4:E7)');
    await formulaInput.press('Enter');

    // Write justification in the student input
    const justificationInput = page.locator('#student-justification-input');
    await justificationInput.fill('Utilizei a fórmula SOMA para totalizar os três meses de cada vendedor. Apliquei SE para verificar quem atingiu a meta de R$ 15.000. Recomendo premiar Tiago, Ivone e Socorro, e oferecer capacitação comercial para Raimundo.');

    // Deliver artifact
    await submitBtn.click();

    // Evaluation modal must open
    const evalModal = page.locator('#evaluation-modal-backdrop');
    await expect(evalModal).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#evaluation-modal-title')).toBeVisible();

    // Verify Bloom breakdown cards are visible
    await expect(page.locator('text=1. Lembrar as Fórmulas')).toBeVisible();
    await expect(page.locator('text=3. Fazer as Contas')).toBeVisible();

    // Test Safe-Fail revision button
    const reviseBtn = page.locator('button:has-text("Corrigir na Planilha")');
    await reviseBtn.click();

    // Must return to spreadsheet with data intact
    await expect(modal).toBeVisible();
    await expect(cellE4).toContainText(/15[\.,]?800/);

    // Close modal
    const closeBtn = page.locator('#btn-close-spreadsheet-modal');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Fluxo 3: Painel do Professor (Criação de Missão com IA e Publicação)', async ({ page }) => {
    // Navigate to Professor Panel
    const profNavLink = page.locator('#nav-link-professor');
    await profNavLink.click();

    // Verify Professor Panel loaded
    await expect(page.locator('text=Painel de Criação e Rúbrica Pedagógica')).toBeVisible();

    // Click template "Modelo: Estoque do Sertão"
    const templateBtn = page.locator('button:has-text("Estoque do Sertão")');
    await templateBtn.click();

    // Verify input changed
    const contentInput = page.locator('#input-conteudo-excel');
    await expect(contentInput).toHaveValue(/Estoque/i);

    // Click "Gerar Missão com IA"
    const generateBtn = page.locator('#btn-generate-ai-mission');
    await generateBtn.click();

    // Verify mission generated
    await expect(page.locator('text=Prévia do Exercício Padronizado')).toBeVisible({ timeout: 15000 });

    // Click "Publicar Missão"
    const publishBtn = page.locator('#btn-publish-mission-to-students');
    await publishBtn.click();

    // Should return to Hub with published mission
    await expect(page.locator('#hub-hero-title')).toBeVisible();
  });

  test('Fluxo 4: Loja Pedagógica e Economia Gamificada', async ({ page }) => {
    // Navigate to Store
    const storeNavLink = page.locator('#nav-link-store');
    await storeNavLink.click();

    // Check store root and coins balance
    await expect(page.locator('text=Loja Pedagógica & Central de Vantagens')).toBeVisible();
    await expect(page.locator('text=Moedas Canindé')).toBeVisible();

    // Check purchase buttons
    const buyButtons = page.locator('#pedagogical-store-root button:has-text("Comprar")');
    const count = await buyButtons.count();
    expect(count).toBeGreaterThan(0);

    // Buy first affordable item
    await buyButtons.first().click();

    // Verify item shows "Adquirido"
    await expect(page.locator('text=Adquirido').first()).toBeVisible();
  });
});
