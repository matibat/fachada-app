# Pre-Launch Checklist

Use this checklist before deploying your portfolio to production.

## ✅ Configuration

- [ ] Updated `src/config.ts` with your personal information
  - [ ] Name and title
  - [ ] Description/tagline
  - [ ] Production URL
  - [ ] Social media links (GitHub, LinkedIn, Twitter, Email)
  - [ ] Theme colors match your brand
  - [ ] Analytics configured (if using)

- [ ] Deployment configured
  - [ ] GitHub repository created
  - [ ] GitHub Pages enabled in repository settings (Settings > Pages > Source > GitHub Actions)
  - [ ] Custom domain configured (if using)

## 📝 Content

- [ ] Replaced example projects with your actual projects
  - [ ] At least 3 quality project case studies
  - [ ] Live URLs working
  - [ ] GitHub links valid
  - [ ] Images/screenshots added to `public/`
  - [ ] Tags accurately represent tech stack

- [ ] Added blog posts (or removed blog if not using)
  - [ ] At least 3 posts for initial launch
  - [ ] Proper dates set
  - [ ] Tags relevant

- [ ] Updated About section in `src/components/sections/About.astro`
  - [ ] Bio reflects your experience
  - [ ] CTA makes sense

- [ ] Updated Skills section in `src/components/sections/Skills.astro`
  - [ ] Technologies you actually use
  - [ ] Proficiency levels accurate

- [ ] Updated Hero section in `src/components/sections/Hero.astro`
  - [ ] Headline is compelling
  - [ ] Subheading clear
  - [ ] CTA buttons point to correct sections/links

## 🎨 Visual Assets

- [ ] Added favicon set to `public/`
  - [ ] favicon.ico (32x32)
  - [ ] apple-touch-icon.png (180x180)
  - [ ] favicon-16x16.png
  - [ ] favicon-32x32.png
  - [ ] favicon-192x192.png
  - [ ] favicon-512x512.png

- [ ] Created OG image
  - [ ] 1200x630px PNG/JPG in `public/og-image.png`
  - [ ] Includes your name/brand
  - [ ] Looks good when shared on social media

- [ ] Project images/screenshots
  - [ ] High quality (min 1200px wide)
  - [ ] Optimized for web (compressed)
  - [ ] Descriptive filenames

- [ ] Profile photo (if using)
  - [ ] Professional quality
  - [ ] Good lighting
  - [ ] Appropriate background

## 🔍 SEO & Performance

- [ ] Run Lighthouse audit (target: 90+ all categories)

  ```bash
  make build
  make preview
  # Open Chrome DevTools > Lighthouse
  ```

  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+

- [ ] Verify meta tags
  - [ ] Title tags under 60 characters
  - [ ] Meta descriptions 150-160 characters
  - [ ] OG tags present on all pages
  - [ ] Canonical URLs correct

- [ ] Test sitemap
  - [ ] Build and verify `/sitemap-index.xml` exists
  - [ ] All pages included
  - [ ] No broken links

- [ ] Test robots.txt
  - [ ] Accessible at `/robots.txt`
  - [ ] Allows search engine crawling
  - [ ] Sitemap URL included

- [ ] Image optimization
  - [ ] All images compressed
  - [ ] Using WebP where possible
  - [ ] Lazy loading implemented (if needed)

## 🧪 Testing

- [ ] All tests passing

  ```bash
  make test
  ```

  - [ ] Config tests (6/6)
  - [ ] Component tests (3/3)
  - [ ] Utility tests (6/6)

- [ ] Build successful

  ```bash
  make build
  ```

  - [ ] No TypeScript errors
  - [ ] No build warnings
  - [ ] 10+ pages generated

- [ ] Preview build locally

  ```bash
  make preview
  ```

  - [ ] All pages load correctly
  - [ ] Navigation works
  - [ ] Links functional

## 🎯 Functionality

- [ ] Dark mode toggle
  - [ ] Works on all pages
  - [ ] Persists on refresh
  - [ ] No FOUC (flash of unstyled content)
  - [ ] System preference detected

- [ ] Navigation
  - [ ] All internal links work
  - [ ] Smooth scrolling (if enabled)
  - [ ] Active states correct
  - [ ] Mobile menu (if implemented)

- [ ] Forms & interactions
  - [ ] Contact links work
  - [ ] Email links open mail client
  - [ ] Social media links open in new tabs
  - [ ] External links have security attributes

- [ ] Responsive design
  - [ ] Test on mobile (375px+)
  - [ ] Test on tablet (768px+)
  - [ ] Test on desktop (1024px+)
  - [ ] Test on large screens (1920px+)

## 🚀 Deployment

- [ ] GitHub repository
  - [ ] Code pushed to main branch
  - [ ] .gitignore includes dist/, node_modules/, .env
  - [ ] README updated with your project info
  - [ ] License file appropriate

- [ ] CI/CD configured
  - [ ] GitHub Actions workflows active
  - [ ] Test job runs on PRs
  - [ ] Deploy job runs on main pushes to GitHub Pages

- [ ] GitHub Pages enabled
  - [ ] GitHub repository created and pushed
  - [ ] Pages enabled in repository settings (Settings > Pages > Source > GitHub Actions)
  - [ ] Custom domain connected (if using)
  - [ ] SSL certificate active (automatic via GitHub Pages)

- [ ] Environment variables
  - [ ] No sensitive data in code
  - [ ] Analytics keys configured
  - [ ] API keys in secrets (if needed)

## 📊 Post-Launch

- [ ] Analytics verification
  - [ ] Tracking code working
  - [ ] Events firing correctly
  - [ ] Privacy policy compliant

- [ ] Search Console
  - [ ] Google Search Console setup
  - [ ] Sitemap submitted
  - [ ] Domain ownership verified

- [ ] Social media
  - [ ] Share on LinkedIn
  - [ ] Share on Twitter/X
  - [ ] Update GitHub profile link
  - [ ] Test OG image preview

- [ ] Monitoring
  - [ ] Uptime monitoring setup (UptimeRobot, etc.)
  - [ ] Error tracking configured (if using)
  - [ ] Performance monitoring baseline

## 🔐 Security

- [ ] Dependencies up to date

  ```bash
  yarn upgrade-interactive
  ```

- [ ] No exposed secrets
  - [ ] No API keys in code
  - [ ] No credentials in git history
  - [ ] .env files in .gitignore

- [ ] Security headers
  - [ ] CSP configured (if needed)
  - [ ] HTTPS enforced
  - [ ] No mixed content warnings

## 📱 Cross-Browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader tested (basic)
- [ ] Alt text on all images
- [ ] Semantic HTML used
- [ ] Color contrast passes WCAG AA
- [ ] ARIA labels where needed

## 📋 Final Checks

- [ ] No console errors
- [ ] No broken links
- [ ] Fonts loading correctly
- [ ] Animations smooth
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Print styles (if relevant)

---

## 🎉 Launch!

Once all items are checked:

1. Deploy to production

   ```bash
   make firebase-deploy
   ```

2. Verify production URL

3. Test from multiple devices/networks

4. Share with the world! 🚀

## 📅 Maintenance

Schedule regular checks:

- **Weekly**: Monitor analytics, check for broken links
- **Monthly**: Dependencies update, security scan
- **Quarterly**: Content refresh, Lighthouse audit
