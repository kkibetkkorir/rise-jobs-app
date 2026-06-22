# create a jobs app with perfect modern minimalist and clean ui for:

- https://api.joinrise.io/api/v1/jobs/public?page=1&limit=20&sort=asc&sortedBy=createdAt&includeDescription=true&isTrending=true

This is a complete, responsive HTML document for a modern job board application. It fetches live data from the provided Rise API endpoints, displaying job listings with company details, and includes features like search, pagination, and category filtering.

`index.html`

# now create single-job.html that will open when user clicks apply now so that they will first open a page that shows details before user going to apply link

Here is the HTML code for a detailed job view page (`single-job.html`). It's designed to open when a user clicks "Apply →" from the main job board, displaying full job details before they proceed to the external application link.

`single-job.html`

# how should i pass it from index.html . don't rewrite code, just point out

Great question! Here's how to pass the job ID from `index.html` to `single-job.html`:

## In `index.html` (the job board):

When you generate each job card, the "Apply →" link should point to `single-job.html` with the job ID as a query parameter:

```html
<a href="single-job.html?id=${job._id}" class="job-link">Apply →</a>
```

**Instead of:**

```html
<a href="${job.url}" target="_blank" class="job-link">Apply →</a>
```

## Example of the updated job card link in `index.html`:

```javascript
// Inside your renderJobs function, when creating the job card:
const applyLink = `single-job.html?id=${job._id}`;

// Then in the HTML:
<a href="${applyLink}" class="job-link">Apply →</a>
```

## How `single-job.html` receives it:

The `single-job.html` page already has this code to read the ID:

```javascript
function getJobIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || params.get('jobId') || null;
}
```

So when a user clicks "Apply →" on a job card, they'll go to:

```
single-job.html?id=6a300247e1138d5e3e591843
```

The `single-job.html` page will then:

1. Extract the ID from the URL
2. Fetch the full job details using that ID
3. Display the complete job description and details
4. Show the actual "Apply now" button that links to the real application URL (`job.url`)

This creates a two-step flow:

1. **Index page** → shows job cards with "Apply →"
2. **Single-job page** → shows full details + final "Apply now" button

The "Apply now" button on `single-job.html` should use the actual application URL from the job data:

```html
<a href="${applyUrl}" target="_blank" rel="noopener noreferrer" class="apply-btn">
  Apply now →
</a>
```

This way, users see the full job details before being redirected to the external application site.

# create a walthrough.html

Here's a `walkthrough.html` file that explains the complete flow of the job board application, from browsing jobs to viewing details and applying.

`walkthrough-dev.html`

# i mean walkthrough for users not developers

Here's a user-friendly `walkthrough.html` that explains the job application flow from a user's perspective, with clear steps and visual guidance.

`walkthrough.html`

# create auth.html with login and register with referral code entering and other features including google and facebook auth etc

Here's a complete `auth.html` file with login, registration, referral code entry, and social authentication features.

`auth.html`

# create index account.html with profile, saved notification and settings tabs

Here's a complete `account.html` file with profile, saved jobs, notifications, and settings tabs for a user account dashboard.

`account.html`

Here's a complete `notifications.html` file that displays user notifications with filtering, read/unread status, and interactive features.

`notifications.html`

# create terms-of-service.html and privacy-policy.html

Here are complete `terms-of-service.html` and `privacy-policy.html` files for the Rise job board application.

## terms-of-service.html

`terms-of-service.html`

## privacy-policy.html

`privacy-policy.html`

# create about.html and contact.html

Here are complete `about.html` and `contact.html` files for the Rise job board application.

## about.html

`about.html`

## contact.html

`contact.html`

# create index.html with only nav header , i will integrate to the job list as home . don't write other things

Here's `index.html` with only the navigation header that you can integrate with your job list as the home page.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rise · Job Board</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="nav.css" />
</head>
<body>

<!-- ===== NAVIGATION ===== -->
<nav class="navbar" id="navbar">
    <div class="nav-container">
        <!-- Logo -->
        <a href="index.html" class="nav-logo">
            <span class="logo-icon">🚀</span>
            <span class="logo-text">Rise</span>
            <span class="logo-badge">Jobs</span>
        </a>

        <!-- Desktop Links -->
        <ul class="nav-links">
            <li><a href="index.html" class="active">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="notifications.html">🔔</a></li>
        </ul>

        <!-- Right Actions -->
        <div class="nav-actions">
            <a href="auth.html" class="btn-outline">Sign In</a>
            <a href="auth.html?tab=register" class="btn-primary">Sign Up</a>
            <!-- User avatar (hidden by default, shown when logged in) -->
            <!-- <img src="https://ui-avatars.com/api/?name=John+Doe&background=0b1a2f&color=fff&size=36" alt="User" class="user-avatar" onclick="window.location.href='account.html'" /> -->
            <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">☰</button>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu">
        <a href="index.html" class="active">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="notifications.html">🔔 Notifications</a>
        <div class="mobile-actions">
            <a href="auth.html" class="btn-outline-mobile">Sign In</a>
            <a href="auth.html?tab=register" class="btn-primary-mobile">Sign Up</a>
        </div>
    </div>
</nav>

<!-- ===== MAIN CONTENT ===== -->
<main class="main-content">
    <!--
        ================================================================
        YOUR JOB LIST CONTENT GOES HERE
        ================================================================
        This is where you should place your job board content:
        - Search bar
        - Filter chips
        - Job grid
        - Pagination
    -->
    <div class="placeholder">
        <div class="big-icon">💼</div>
        <h2>Your Job Board Content Here</h2>
        <p>Integrate your job list, search, filters, and pagination below the navigation.</p>
        <p style="margin-top: 8px; font-size: 0.85rem; color: #8b9bb0;">
            ⚡ The navigation is ready to use with your existing job list implementation.
        </p>
    </div>
</main>
<script src="./nav.js"></script>
</body>
</html>
```

# now assume it was bottom nav like mobile phones and create the navigation again

Here's `index.html` with a bottom navigation bar designed for mobile phones, with the job list content area above it.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Rise · Job Board</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="bottom-nav.css" />
</head>
<body>

<!-- ===== MAIN CONTENT ===== -->
<main class="main-content">
    <!--
        ================================================================
        YOUR JOB LIST CONTENT GOES HERE
        ================================================================
    -->
    <div class="placeholder">
        <div class="big-icon">💼</div>
        <h2>Your Job Board Content Here</h2>
        <p>Integrate your job list, search, filters, and pagination above the bottom navigation.</p>
        <p style="margin-top: 8px; font-size: 0.85rem; color: #8b9bb0;">
            ⚡ The bottom navigation is ready to use with your existing job list implementation.
        </p>
    </div>

    <!-- Sample job cards to show how content flows above nav -->
    <div style="margin-top: 16px;">
        <div class="job-card-preview">
            <div class="company-row">
                <div class="company-avatar"></div>
                <div>
                    <div style="font-weight:600;font-size:0.9rem;">Google</div>
                    <div style="font-size:0.75rem;color:#6b8aa8;">Mountain View, CA</div>
                </div>
            </div>
            <div class="job-title">Senior Software Engineer</div>
            <div class="job-meta">Hybrid · Full-time</div>
        </div>

        <div class="job-card-preview">
            <div class="company-row">
                <div class="company-avatar"></div>
                <div>
                    <div style="font-weight:600;font-size:0.9rem;">Microsoft</div>
                    <div style="font-size:0.75rem;color:#6b8aa8;">Seattle, WA</div>
                </div>
            </div>
            <div class="job-title">Product Manager</div>
            <div class="job-meta">Hybrid · Full-time</div>
        </div>

        <div class="job-card-preview">
            <div class="company-row">
                <div class="company-avatar"></div>
                <div>
                    <div style="font-weight:600;font-size:0.9rem;">Apple</div>
                    <div style="font-size:0.75rem;color:#6b8aa8;">Cupertino, CA</div>
                </div>
            </div>
            <div class="job-title">UX Designer</div>
            <div class="job-meta">Onsite · Full-time</div>
        </div>
    </div>
</main>

<!-- ===== BOTTOM NAVIGATION ===== -->
<nav class="bottom-nav" id="bottomNav">
    <!-- Home -->
    <a href="index.html" class="nav-item active" data-tab="home">
        <span class="icon">🏠</span>
        <span class="label">Home</span>
    </a>

    <!-- Search -->
    <a href="#" class="nav-item" data-tab="search" onclick="alert('🔍 Search page coming soon!')">
        <span class="icon">🔍</span>
        <span class="label">Search</span>
    </a>

    <!-- Center Action Button (Post/Apply) -->
    <a href="auth.html" class="nav-item center-btn" data-tab="post">
        <span class="icon">➕</span>
        <span class="label">Post</span>
    </a>

    <!-- Saved Jobs -->
    <a href="account.html?tab=saved" class="nav-item" data-tab="saved">
        <span class="icon">⭐</span>
        <span class="label">Saved</span>
        <span class="badge">3</span>
    </a>

    <!-- Profile -->
    <a href="account.html" class="nav-item" data-tab="profile">
        <span class="icon">👤</span>
        <span class="label">Profile</span>
    </a>
</nav>

<script src="./bottom-nav.js"></script>

</body>
</html>
```

# write service-workers, optimized manifest for seo optimization and create sitemap for the endpoints and tell me where to place in index.html without including .html content when showing

Here's the complete SEO optimization setup including service workers, manifest, and sitemap.

## 1. Service Worker (`sw.js`)

Place this file in the root directory of your website.

`sw.js`

## 2. Manifest File (`manifest.json`)

Place this file in the root directory of your website.

`manifest.json`

## 3. Sitemap (`sitemap.xml`)

Place this file in the root directory of your website.

`sitemap.xml`

## 4. Robots.txt (`robots.txt`)

Place this file in the root directory of your website.

```txt

```

## 5. Offline Page (`offline.html`)

Place this file in the root directory of your website.

`offline.html`

## 6. Where to Place in `index.html`

Add these tags in the `<head>` section of your `index.html` (and all other pages):

```html
<!-- ===== SEO META TAGS ===== -->
<!-- Primary Meta Tags -->
<title>Rise - Find Your Next Career Opportunity | Job Board</title>
<meta name="title" content="Rise - Find Your Next Career Opportunity | Job Board" />
<meta name="description" content="Browse thousands of jobs from top companies. Search by title, location, or category. Apply directly to employers with Rise - the modern job board." />
<meta name="keywords" content="jobs, career, hiring, employment, job search, remote jobs, hybrid jobs, technology jobs" />
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />
<meta name="revisit-after" content="1 day" />
<link rel="canonical" href="https://rise.app/" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://rise.app/" />
<meta property="og:title" content="Rise - Find Your Next Career Opportunity" />
<meta property="og:description" content="Browse thousands of jobs from top companies. Apply directly with Rise - the modern job board." />
<meta property="og:image" content="https://rise.app/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://rise.app/" />
<meta property="twitter:title" content="Rise - Find Your Next Career Opportunity" />
<meta property="twitter:description" content="Browse thousands of jobs from top companies. Apply directly with Rise - the modern job board." />
<meta property="twitter:image" content="https://rise.app/og-image.jpg" />

<!-- ===== PWA / MANIFEST ===== -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0b1a2f" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Rise Jobs" />
<link rel="apple-touch-icon" href="/icon-192x192.png" />

<!-- ===== SERVICE WORKER ===== -->
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registered successfully');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed:', err);
        });
    });
  }
</script>

<!-- ===== STRUCTURED DATA (JSON-LD) ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Rise Job Board",
  "url": "https://rise.app/",
  "description": "Find your next career opportunity with Rise - the modern job board connecting talent with opportunity.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://rise.app/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Rise",
  "url": "https://rise.app/",
  "logo": "https://rise.app/icon-512x512.png",
  "description": "Modern job board connecting talent with opportunity.",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@rise.app",
    "contactType": "customer service",
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "https://twitter.com/risejobs",
    "https://linkedin.com/company/risejobs",
    "https://github.com/risejobs"
  ]
}
</script>

<!-- ===== BREADCRUMB STRUCTURED DATA ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://rise.app/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Jobs",
      "item": "https://rise.app/?tab=jobs"
    }
  ]
}
</script>

<!-- ===== JOB SEARCH STRUCTURED DATA ===== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  "name": "Job Search Results",
  "description": "Search results for jobs on Rise",
  "about": {
    "@type": "Thing",
    "name": "Job Search",
    "description": "Find jobs by title, company, location, or category"
  },
  "mainEntity": {
    "@type": "WebPageElement",
    "name": "Job Listings",
    "description": "List of available job opportunities"
  }
}
</script>

<!-- ===== WEB APP SHORTCUTS ===== -->
<link rel="preconnect" href="https://api.joinrise.io" />
<link rel="dns-prefetch" href="https://api.joinrise.io" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## 7. File Structure Summary

```
/ (root)
├── index.html                    # Main job board
├── about.html                    # About page
├── contact.html                  # Contact page
├── auth.html                     # Login/Register
├── account.html                  # User account
├── notifications.html            # Notifications
├── single-job.html               # Job detail view
├── terms-of-service.html         # Terms
├── privacy-policy.html           # Privacy policy
├── offline.html                  # Offline fallback
├── sw.js                         # Service Worker
├── manifest.json                 # PWA manifest
├── sitemap.xml                   # XML sitemap
├── robots.txt                    # Robots directive
├── og-image.jpg                  # Open Graph image (1200x630)
├── screenshot-mobile.png         # Mobile screenshot (1080x1920)
├── screenshot-desktop.png        # Desktop screenshot (1920x1080)
├── icon-72x72.png                # PWA icons
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

## 8. Verification Steps

1. **Service Worker**: Open Chrome DevTools → Application → Service Workers → Check if registered
2. **Manifest**: Chrome DevTools → Application → Manifest → Check if loaded
3. **Sitemap**: Visit `https://rise.app/sitemap.xml` in browser
4. **Robots.txt**: Visit `https://rise.app/robots.txt`
5. **SEO**: Use Google's Rich Results Test and Lighthouse for validation
