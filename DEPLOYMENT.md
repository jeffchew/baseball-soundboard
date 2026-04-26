# Deployment Guide

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Initial Setup

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Baseball Soundboard"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/baseball-soundboard.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

3. **Configure Custom Domain (Optional)**
   - If using a custom domain like `ballpark.jchew.com`:
     - Add a `CNAME` file to the `public/` directory with your domain
     - Configure DNS settings with your domain provider:
       - Add a CNAME record pointing to `YOUR-USERNAME.github.io`
     - In GitHub Settings → Pages, add your custom domain

### Automatic Deployment

The project uses GitHub Actions for automatic deployment:
- Every push to the `main` branch triggers a build and deployment
- The workflow is defined in `.github/workflows/deploy.yml`
- Build artifacts are automatically deployed to GitHub Pages

### Manual Deployment (Alternative)

If you prefer manual deployment using gh-pages:

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/baseball-soundboard/', // Use your repo name
   })
   ```

2. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### Custom Domain Setup

For `ballpark.jchew.com`:

1. **Create CNAME file**
   ```bash
   echo "ballpark.jchew.com" > public/CNAME
   ```

2. **DNS Configuration**
   Add these DNS records with your domain provider:
   ```
   Type: CNAME
   Name: ballpark (or @)
   Value: YOUR-USERNAME.github.io
   TTL: 3600
   ```

3. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/', // Root path for custom domain
   })
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add custom domain"
   git push
   ```

### Adding Audio Files

1. Place your audio files in the appropriate directories:
   - `/public/audio/walkups/` - Player walk-up music
   - `/public/audio/sounds/` - Sound effects
   - `/public/audio/songs/` - Full-length tracks
   - `/public/audio/pregame/` - Background loops

2. Update `src/config.js` with your audio file names and settings

3. Commit and push:
   ```bash
   git add public/audio/
   git add src/config.js
   git commit -m "Add audio files"
   git push
   ```

### Troubleshooting

**404 Errors on Refresh**
- GitHub Pages serves a single-page app correctly
- The app uses client-side routing, which works with the current setup

**Audio Not Playing**
- Ensure audio files are in the correct format (MP3 recommended)
- Check browser console for loading errors
- Verify file paths in `src/config.js` match actual file locations
- Remember to click "Initialize Audio" button before playing

**Build Failures**
- Check GitHub Actions tab for error details
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version compatibility (requires Node 20+)

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

No environment variables are required for basic deployment. All configuration is in `src/config.js`.

### Performance Optimization

- Audio files are loaded on-demand
- Only one audio track plays at a time (singleton pattern)
- Smooth fade transitions reduce jarring audio changes
- Mobile-optimized with large touch targets

### Browser Support

- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Audio autoplay requires user interaction (Initialize Audio button)