/* ═══════════════════════════════════════════════
   a3outsourcing — Shared Layout Components
   Injects Navbar + Footer into each page
   ═══════════════════════════════════════════════ */

/* ── SVG Icon library (inline, no dependencies) ── */
const ICONS = {
  mapPin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  arrowUp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  arrowRight: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  // KPI icons
  clipboardCheck: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',
  shield: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  briefcase: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  // Service icons
  helpCircle: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  fileText: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  shieldLg: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  refreshCw: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>',
  // Growth icons
  zap: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  globe: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  barChart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  // Services page
  heart: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  car: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>',
  home: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  userCheck: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>',
  chevronRight: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  checkCircle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  star: '★',
  quote: '<svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.05"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
};

// function getNavbar(active) {
//   return `
//   <nav class="navbar" id="main-nav">
//     <div class="nav-inner">
//       <a href="index.html" style="display:flex;align-items:center;gap:11px">
//         <img class="a3-logo md" src="assets/logos/a3outsourcing.png" alt="a3outsourcing logo">
//         <span class="a3-brand">a3outsourcing</span>
//       </a>
//       <div class="desktop-only" style="display:flex;align-items:center;gap:6px">
//         <a href="index.html" class="nav-link ${active === 'home' ? 'active' : ''}">Home</a>
//         <a href="services.html" class="nav-link ${active === 'services' ? 'active' : ''}">Services</a>
//         <a href="contact.html" class="nav-link ${active === 'contact' ? 'active' : ''}">Contact</a>
//         <a href="contact.html" class="nav-cta">Get Consultation</a>
//       </div>
//       <button id="menu-toggle" class="mobile-only" style="display:none;background:none;border:none;color:var(--text-primary);cursor:pointer;padding:8px;align-items:center;justify-content:center">${ICONS.menu}</button>
//     </div>
//     <div id="mobile-menu" style="display:none;position:absolute;top:100%;left:0;width:100%;background:rgba(244,244,245,0.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid rgba(0,0,0,0.08);box-shadow:0 8px 24px rgba(0,0,0,0.08);padding:12px 24px 20px;animation:fadeIn .25s ease">
//       <a href="index.html" class="nav-link ${active === 'home' ? 'active' : ''}" style="display:block;padding:14px 16px;font-size:16px;margin-bottom:4px;width:100%">Home</a>
//       <a href="services.html" class="nav-link ${active === 'services' ? 'active' : ''}" style="display:block;padding:14px 16px;font-size:16px;margin-bottom:4px;width:100%">Services</a>
//       <a href="contact.html" class="nav-link ${active === 'contact' ? 'active' : ''}" style="display:block;padding:14px 16px;font-size:16px;margin-bottom:4px;width:100%">Contact</a>
//       <a href="contact.html" class="nav-cta" style="display:block;text-align:center;width:100%;margin-top:8px;margin-left:0">Get Consultation</a>
//     </div>
//   </nav>`;
// }


function getNavbar(active) {
  return `
  <nav class="navbar" id="main-nav">
    <div class="nav-inner">
      <a href="index.html" style="display:flex;align-items:center;gap:11px">
        <img class="a3-logo md" src="assets/logos/a3outsourcing.png" alt="a3outsourcing logo">
        <!-- brand text removed for centered nav alignment -->
      </a>
      <div class="desktop-only" style="display:flex;align-items:center;gap:6px">
        <div class="nav-links">
          <a href="index.html" class="nav-link ${active === 'home' ? 'active' : ''}">Home</a>
          <a href="about.html" class="nav-link ${active === 'about' ? 'active' : ''}">About</a>
          <a href="services.html" class="nav-link ${active === 'services' ? 'active' : ''}">Services</a>
          <a href="contact.html" class="nav-link ${active === 'contact' ? 'active' : ''}">Contact</a>
        </div>
        <a href="contact.html" class="nav-cta">Get Consultation</a>
      </div>
      <button id="menu-toggle" class="mobile-only" style="display:none;background:none;border:none;color:var(--text-primary);cursor:pointer;padding:8px;align-items:center;justify-content:center">${ICONS.menu}</button>
    </div>
    <div id="mobile-menu" style="display:none;position:absolute;top:100%;left:0;width:100%;background:rgba(244,244,245,0.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid rgba(0,0,0,0.08);box-shadow:0 8px 24px rgba(0,0,0,0.08);padding:12px 24px 20px;animation:fadeIn .25s ease">
      <a href="index.html" class="nav-link ${active === 'home' ? 'active' : ''}" style="display:block;padding:14px 16px;font-size:16px;margin-bottom:4px;width:100%">Home</a>
      <a href="about.html" class="nav-link ${active === 'about' ? 'active' : ''}" style="display:block;padding:14px 16px;font-size:16px;margin-bottom:4px;width:100%">About</a>
      <a href="services.html" class="nav-link ${active === 'services' ? 'active' : ''}" style="display:block;padding:14px 16px;font-size:16px;margin-bottom:4px;width:100%">Services</a>
      <a href="contact.html" class="nav-link ${active === 'contact' ? 'active' : ''}" style="display:block;padding:14px 16px;font-size:16px;margin-bottom:4px;width:100%">Contact</a>
      <a href="contact.html" class="nav-cta" style="display:block;text-align:center;width:100%;margin-top:8px;margin-left:0">Get Consultation</a>
    </div>
  </nav>`;
}

function getFooter() {
  return `
  <footer class="footer">
    <div class="footer-grid-bg"></div>

    <div style="max-width:1200px;margin:0 auto;padding:76px 24px 44px;position:relative;z-index:1">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:52px">

        <!-- Brand col -->
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
            <img class="a3-logo sm" src="assets/logos/a3outsourcing.png" alt="a3outsourcing logo" style="border-radius:9px">
            <span class="a3-brand" style="color:#3C3C3F;font-size:18px">a3outsourcing</span>
          </div>
          <p style="color:#666668;font-size:14px;line-height:1.82;max-width:250px">With 17+ years of trusted expertise, we deliver comprehensive insurance solutions — policy selection, claims, and renewals.</p>
          <div style="display:flex;gap:8px;margin-top:24px">
            <a href="#" class="footer-social-icon" aria-label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#555"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" class="footer-social-icon" aria-label="Twitter / X">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#555"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="footer-social-icon" aria-label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#555"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="footer-social-icon" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        <!-- Policies col -->
        <div>
          <h4 class="footer-title">Insurance Policies</h4>
          <a href="services.html" class="footer-link" style="display:block">Health Insurance</a>
          <a href="services.html" class="footer-link" style="display:block">Life Insurance</a>
          <a href="services.html" class="footer-link" style="display:block">Motor Insurance</a>
          <a href="services.html" class="footer-link" style="display:block">Home Insurance</a>
          <a href="services.html" class="footer-link" style="display:block">Personal Accident Insurance</a>
        </div>

        <!-- Quick links col -->
        <div>
          <h4 class="footer-title">Quick Links</h4>
          <a href="index.html" class="footer-link" style="display:block">Home</a>
          <a href="services.html" class="footer-link" style="display:block">Services</a>
          <a href="contact.html" class="footer-link" style="display:block">Contact</a>
          <div style="margin-top:26px;padding:15px 18px;background:rgba(255,42,42,0.07);border:1px solid rgba(255,42,42,0.18);border-radius:12px">
            <p style="font-size:12px;color:#666;line-height:1.6;margin-bottom:10px">Need a quick consultation?</p>
            <a href="contact.html" style="font-size:13px;font-weight:700;color:#c0392b;display:inline-flex;align-items:center;gap:6px;transition:gap 0.3s" onmouseover="this.style.gap='10px'" onmouseout="this.style.gap='6px'">
              Get in touch ${ICONS.arrowRight}
            </a>
          </div>
        </div>

        <!-- Contact col -->
        <div>
          <h4 class="footer-title">Contact Us</h4>
          <div style="display:flex;align-items:flex-start;gap:11px;margin-bottom:15px">
            <span style="color:#c0392b;flex-shrink:0;margin-top:1px">${ICONS.mapPin}</span>
            <span style="color:#555;font-size:14px;line-height:1.6">Chennai, Tamil Nadu, India</span>
          </div>
          <div style="display:flex;align-items:center;gap:11px;margin-bottom:15px">
            <span style="color:#c0392b;flex-shrink:0">${ICONS.phone}</span>
            <a href="tel:8939635733" class="footer-link" style="padding:0;display:inline">8939635733</a>
          </div>
          <div style="display:flex;align-items:center;gap:11px">
            <span style="color:#c0392b;flex-shrink:0">${ICONS.mail}</span>
            <a href="mailto:info@a3outsourcing.com" class="footer-link" style="padding:0;display:inline;font-size:13px">info@a3outsourcing.com</a>
          </div>
          <!-- IRDAI badge -->
          <div style="margin-top:22px;display:inline-flex;align-items:center;gap:8px;background:rgba(255,42,42,0.09);border:1px solid rgba(255,42,42,0.2);border-radius:8px;padding:6px 12px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style="font-size:11px;font-weight:700;color:#c0392b;letter-spacing:0.5px">IRDAI Registered</span>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div style="margin-top:52px;padding-top:22px;border-top:1px solid rgba(0,0,0,0.12);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
        <span style="color:#666;font-size:13px">&copy; 2026 a3outsourcing. All rights reserved.</span>
        <div style="display:flex;align-items:center;gap:7px">
          <span style="width:7px;height:7px;border-radius:50%;background:var(--brand-red);display:inline-block;animation:pulseRing 2s ease-out infinite"></span>
          <span style="color:#555;font-size:12px;font-weight:600">Live Support · Chennai, India</span>
        </div>
      </div>
    </div>
  </footer>`;
}

function injectLayout(active) {
  document.getElementById('navbar-root').innerHTML = getNavbar(active);
  document.getElementById('footer-root').innerHTML = getFooter();
  // initNavbar must run AFTER the navbar HTML is in the DOM
  if (typeof initNavbar === 'function') initNavbar();
}
