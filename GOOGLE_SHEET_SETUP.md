# Google Sheet Integration Setup Guide

Follow these steps to connect your landing page to a Google Sheet that automatically saves emails.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet and name it `ClinicSync AI Beta Signups`
3. Set up columns:
   - Column A: `Email`
   - Column B: `Timestamp`

## Step 2: Create a Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code and replace it with this script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add new row with email and timestamp
    sheet.appendRow([data.email, data.timestamp]);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (Ctrl+S or Cmd+S)
4. Give it a name like `ClinicSync Email Handler`

## Step 3: Deploy the Script

1. Click **Deploy** → **New Deployment**
2. Select type: **Web app**
3. Set "Execute as" to your Google account
4. Set "Who has access" to **Anyone**
5. Click **Deploy**
6. You'll get a deployment URL like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercallback`
7. Copy this entire URL

## Step 4: Update Your React App

1. Open `d:\Landing Page\src\App.tsx`
2. Find this line (around line 156):
   ```javascript
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercallback';
   ```
3. Replace `YOUR_SCRIPT_ID` with the actual script ID from your deployment URL
   - The URL will look like: `https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXX/usercallback`
   - Use the entire URL

## Step 5: Test It!

1. Run your app: `npm run dev`
2. Try submitting an email from either form
3. Go back to your Google Sheet - you should see the email and timestamp appear!

## Troubleshooting

**Emails not appearing in the sheet?**
- Check that you deployed the script as a "Web app" with "Anyone" access
- Make sure you copied the correct deployment URL
- Check browser Dev Tools (F12) Console for any errors
- Try a different email address

**Getting CORS errors?**
- This is normal with Google Apps Script - the `mode: 'no-cors'` in the code handles this

**Script not saving emails?**
- Make sure your Google Sheet has the correct columns (Email, Timestamp)
- Verify the script was actually deployed (not just saved)

---

Once set up, every time someone submits their email, it will automatically be added to your Google Sheet with the submission date and time!
