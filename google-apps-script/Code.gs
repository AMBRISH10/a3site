/**
 * ═══════════════════════════════════════════════════
 *  a3outsourcing — Google Apps Script (Web App)
 * ═══════════════════════════════════════════════════
 *
 * SPREADSHEET ID : 1EXUxQVWPnNL_YdUcLIdY-6aCvZElhsGg8p4GYvnnTUs
 * SHEET NAME     : a3outsourcing_entries2026
 *
 * WHY doGet, NOT doPost:
 * ──────────────────────────────────────────────────────────────────
 * Apps Script web apps reply to POST with a 302 redirect. Browsers
 * convert cross-origin POST→redirects into GETs, silently dropping
 * the body. iframes are blocked by X-Frame-Options: sameorigin.
 *
 * Solution: the frontend sends a GET request with all form data as
 * URL query parameters (?name=...&email=...&phone=...). GET requests
 * follow redirects correctly and are not blocked by X-Frame-Options.
 * doGet(e) receives e.parameter with all fields intact.
 * ──────────────────────────────────────────────────────────────────
 *
 * DEPLOYMENT — every time you change the code:
 * 1. Deploy → Manage deployments → pencil (Edit) icon
 * 2. Version: "New version"  ← required, old version won't update
 * 3. Execute as  : Me
 * 4. Who has access : Anyone
 * 5. Copy /exec URL → paste into js/main.js APPS_SCRIPT_URL
 *
 * QUICK CHECK: paste the /exec URL in a browser →
 *   {"status":"ok","message":"a3outsourcing endpoint is live. (no submission data)"}
 *
 * TEST: run testDoGet() in the editor → check View → Executions → Logs
 */

const SPREADSHEET_ID = '1EXUxQVWPnNL_YdUcLIdY-6aCvZElhsGg8p4GYvnnTUs';
const SHEET_NAME     = 'a3outsourcing_entries2026';

/* ── Helper: open sheet, create tab + header row if missing ── */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('Tab "' + SHEET_NAME + '" missing → creating it.');
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    Logger.log('Empty sheet → adding header row.');
    const h = ['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Message'];
    sheet.appendRow(h);
    sheet.getRange(1, 1, 1, h.length).setFontWeight('bold').setBackground('#f3f3f3');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, h.length);
  }

  return sheet;
}

/* ── doGet: handles form submissions sent as GET query params ── */
function doGet(e) {
  const p = (e && e.parameter) ? e.parameter : {};

  Logger.log('doGet() called. Keys: ' + Object.keys(p).join(', '));

  // Health-check: if no name field, just return status
  if (!p.name && !p.email) {
    Logger.log('Health-check ping (no submission data).');
    return ContentService
      .createTextOutput(JSON.stringify({
        status:  'ok',
        message: 'a3outsourcing endpoint is live. (no submission data)'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Real submission
  try {
    Logger.log('name='    + p.name);
    Logger.log('email='   + p.email);
    Logger.log('phone='   + p.phone);
    Logger.log('service=' + p.service);
    Logger.log('message=' + p.message);

    const sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date(),
      (p.name    || '').trim(),
      (p.email   || '').trim(),
      (p.phone   || '').trim(),
      (p.service || '').trim(),
      (p.message || '').trim()
    ]);

    Logger.log('✅ Row appended.');

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('❌ ERROR: ' + err.toString());

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ── doPost: kept for safety but form no longer uses it ── */
function doPost(e) {
  Logger.log('doPost() called (not used by current frontend).');
  return doGet(e);
}

/* ── testDoGet: run inside the editor to verify without a browser ── */
function testDoGet() {
  const fakeEvent = {
    parameter: {
      name:    'Test User',
      email:   'test@example.com',
      phone:   '9876543210',
      service: 'Health Insurance',
      message: 'Editor test — ' + new Date().toISOString()
    }
  };

  Logger.log('Running testDoGet...');
  const result = doGet(fakeEvent);
  Logger.log('Response: ' + result.getContent());
  Logger.log('Check the sheet for a new row now.');
}

/* ── diagnose: run to check spreadsheet access ── */
function diagnose() {
  Logger.log('=== DIAGNOSIS ===');
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('✅ Spreadsheet: ' + ss.getName());
    Logger.log('Tabs: ' + ss.getSheets().map(s => s.getName()).join(', '));
    const sheet = ss.getSheetByName(SHEET_NAME);
    Logger.log(sheet
      ? '✅ Tab found. Rows: ' + sheet.getLastRow()
      : '⚠️  Tab not found — will be auto-created on first submission.'
    );
    Logger.log('Account: ' + Session.getActiveUser().getEmail());
  } catch(e) {
    Logger.log('❌ ' + e.toString());
  }
  Logger.log('=== DONE ===');
}
