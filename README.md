# project18

Static landing page with a Telegram mini app mock.

## Local development

1. Ensure dependencies are installed (`npm install`).
2. Compile the React mock if changes are made:
   ```bash
   npx babel mock/miniapp_mock.jsx --out-file mock/miniapp_mock.js --presets @babel/preset-react
   ```
3. Open `index.html` in a browser to preview the landing page and mini app mock.

## Deployment

The repository includes a GitHub Actions workflow that publishes the site to GitHub Pages on every push to the `main` branch.