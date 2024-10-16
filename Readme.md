# Outlier.ai Earnings Masker - Chrome Extension

This Chrome extension obfuscates dollar amounts (`$`) on the [Outlier.ai](https://app.outlier.ai) website, replacing them with `***` for privacy or testing purposes. The extension dynamically detects dollar amounts across the page, including the **Total Earnings** and **Past Earnings** sections, and automatically replaces them with `***`.

## Features

- **Earnings Obfuscation**: Replaces dollar signs and amounts displayed in the **Total Earnings**, **Reward Earnings**, and **Past Earnings** sections.
- **Dynamic Handling**: Automatically detects dynamically loaded content on the page and replaces any new dollar amounts.
- **Skip Specific Fields**: Easily configure the extension to skip certain fields if you want to keep specific amounts visible.
- **Simple Installation**: Easily install the extension through Chrome's developer mode or download the pre-built extension from the GitHub releases page.

## How to Use the Extension

### Installation via GitHub Releases

1. **Download the Latest Release**:
   - Go to the [Releases](https://github.com/NymphSolutions/wizard-tools) page of this repository.
   - Download the latest `.zip` file containing the Chrome extension's build (e.g., `wizard-tools.zip`).

2. **Extract the ZIP File**:
   - Unzip the downloaded file to a local directory.

3. **Install the Extension**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click on **Load unpacked** and select the folder where you extracted the extension.

4. **Visit Outlier.ai**:
   - Open [Outlier.ai](https://app.outlier.ai) and the extension will automatically replace dollar amounts on the earnings page with `***`.

### Skipping Specific Fields

If you want to **skip specific fields** and prevent them from being obfuscated, follow these steps:

1. **Edit `content.js`**:
   - Open the `content.js` file in the root of the extension folder.

2. **Find the Field to Skip**:
   - In your browser, inspect the field that you want to skip by right-clicking on the element and selecting "Inspect".
   - Identify the class or unique identifier of the element.

3. **Modify the Script**:
   - In `content.js`, modify the code to exclude the field you want to skip. Add a condition like this:
   
   ```javascript
   elements.forEach(element => {
     // Skip a specific field by class name or unique identifier
     if (element.classList.contains('skip-obfuscation') || element.id === 'specific-id') {
       return;  // Skip this element, leave it unchanged
     }
     
     // Existing obfuscation logic for other elements
     const dollarAmountRegex = /\$\s?\d{1,3}(,\d{3})*(\.\d{2})?/;
     const numberRegex = /^\d{1,3}(,\d{3})*(\.\d{2})?$/;

     if (element.innerText.trim() === '$') {
       element.innerText = '***';
     }

     if (numberRegex.test(element.innerText.trim())) {
       element.innerText = '***';
     }

     if (dollarAmountRegex.test(element.innerText.trim())) {
       element.innerText = element.innerText.replace(dollarAmountRegex, '***');
     }
   });
   ```

4. **Save and Reload**:
   - Save the changes to `content.js`.
   - Go to `chrome://extensions/` and click the **Reload** button for your extension.
   - The selected field will no longer be obfuscated, while all other fields will continue to be replaced.

### Example Skipping Fields

Here’s an example of how to skip fields:

- If you want to skip a field with the class `total-earnings`, add this condition:

   ```javascript
   if (element.classList.contains('total-earnings')) {
     return;  // Skip this field
   }
   ```

- If you want to skip a field with the ID `specific-id`, add this condition:

   ```javascript
   if (element.id === 'specific-id') {
     return;  // Skip this field
   }
   ```

This flexibility allows you to control which fields get replaced and which ones remain visible.

### Building from Source

If you want to build the extension manually from source, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/outlier-earnings-masker.git
   cd outlier-earnings-masker
   ```

2. **Build the Extension**:
   - Zip the necessary files manually, or use the provided GitHub Action for building (see below).

3. **Install the Extension**:
   - Follow the same process as above to load the unpacked extension via Chrome.

## GitHub Actions - Automating Builds

To automate the build process and generate downloadable artifacts (ZIP files) for users to easily install, we’ve set up a GitHub Actions workflow. This workflow:
1. Zips the necessary extension files.
2. Attaches the ZIP file as an artifact in the release.

### GitHub Actions Workflow

Create a `.github/workflows/build-extension.yml` file in your repository with the following content:

```yaml
name: Build Chrome Extension

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Create ZIP file of the extension
        run: |
          mkdir -p release
          zip -r release/outlier-earnings-masker.zip manifest.json content.js

      - name: Upload the artifact (ZIP)
        uses: actions/upload-artifact@v3
        with:
          name: outlier-earnings-masker
          path: release/outlier-earnings-masker.zip

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'release'

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v3
        with:
          name: outlier-earnings-masker

      - name: Create a new release with the ZIP file
        uses: softprops/action-gh-release@v1
        with:
          files: release/outlier-earnings-masker.zip
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Setting Up GitHub Secrets

- You don’t need any special secrets for this workflow to work, as GitHub automatically provides the `GITHUB_TOKEN` environment variable that allows the workflow to upload release assets.

## Release Management

### Creating a Release

1. **Tagging a Release**:
   - In the GitHub repository, go to the **Releases** tab.
   - Click **Draft a new release**.
   - Choose a tag (e.g., `v1.0.0`), fill in the release notes, and publish the release.

2. **GitHub Actions Auto-build**:
   - Once you publish the release, the GitHub Action will automatically generate the ZIP file and attach it to the release.

### Downloading the Built Extension

- After the release is published, go to the **Releases** page and download the ZIP file directly from the release assets. This ZIP file can be installed directly in Chrome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This updated **`README.md`** provides a detailed guide on how to use, build, and skip fields, and it also includes the GitHub Actions workflow for generating and managing releases.

Let me know if you need any further adjustments!