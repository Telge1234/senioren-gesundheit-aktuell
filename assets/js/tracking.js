/**
 * LUADA Advertorial - Tracking Module
 * 
 * Dieses Modul bereitet alle Events für Google Tag Manager (GTM) vor.
 * Die Events werden über window.dataLayer gepusht und können im GTM
 * konfiguriert werden, um an Stape.io/GA4/etc. weitergeleitet zu werden.
 * 
 * Events:
 * - page_view: Beim Laden der Seite
 * - scroll_depth: Bei 25%, 50%, 75%, 100% Scroll-Tiefe
 * - cta_click: Klick auf CTA-Buttons
 * - link_click: Klick auf wichtige Links
 * - phone_click: Klick auf Telefonnummer
 * - contact_click: Klick auf Kontakt-Elemente
 * 
 * @version 1.0.0
 */

(function() {
  'use strict';

  // DataLayer initialisieren (falls noch nicht vorhanden)
  window.dataLayer = window.dataLayer || [];

  // Konfiguration
  const CONFIG = {
    // Scroll-Tiefe Schwellenwerte (in Prozent)
    scrollThresholds: [25, 50, 75, 100],
    
    // Selektoren für klickbare Elemente
    selectors: {
      cta: '[data-track="cta"]',
      link: '[data-track="link"]',
      phone: '[data-track="phone"], a[href^="tel:"]',
      contact: '[data-track="contact"]'
    },
    
    // Debug-Modus (console.log aktivieren)
    debug: false
  };

  // Bereits gefeuerte Scroll-Events speichern
  const firedScrollEvents = new Set();

  /**
   * Event an dataLayer senden
   * @param {string} eventName - Name des Events
   * @param {Object} eventParams - Zusätzliche Parameter
   */
  function pushEvent(eventName, eventParams = {}) {
    const eventData = {
      event: eventName,
      ...eventParams,
      timestamp: new Date().toISOString()
    };

    window.dataLayer.push(eventData);

    if (CONFIG.debug) {
      console.log('[Tracking]', eventName, eventParams);
    }
  }

  /**
   * Page View Event
   */
  function trackPageView() {
    pushEvent('page_view', {
      page_path: window.location.pathname,
      page_title: document.title,
      page_url: window.location.href,
      referrer: document.referrer || '(direct)'
    });
  }

  /**
   * Scroll-Tiefe berechnen und tracken
   */
  function initScrollTracking() {
    let ticking = false;

    function calculateScrollDepth() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (docHeight <= 0) return 0;
      
      return Math.round((scrollTop / docHeight) * 100);
    }

    function checkScrollThresholds() {
      const depth = calculateScrollDepth();

      CONFIG.scrollThresholds.forEach(threshold => {
        if (depth >= threshold && !firedScrollEvents.has(threshold)) {
          firedScrollEvents.add(threshold);
          pushEvent('scroll_depth', {
            scroll_percentage: threshold,
            page_path: window.location.pathname
          });
        }
      });
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          checkScrollThresholds();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Initial check (falls Seite bereits gescrollt geladen wird)
    checkScrollThresholds();
  }

  /**
   * Klick-Tracking initialisieren
   */
  function initClickTracking() {
    document.addEventListener('click', function(e) {
      const target = e.target.closest('a, button');
      if (!target) return;

      // CTA Clicks
      if (target.matches(CONFIG.selectors.cta)) {
        pushEvent('cta_click', {
          cta_text: target.textContent.trim(),
          cta_url: target.href || null,
          cta_id: target.id || null,
          page_path: window.location.pathname
        });
      }

      // Link Clicks
      if (target.matches(CONFIG.selectors.link)) {
        pushEvent('link_click', {
          link_text: target.textContent.trim(),
          link_url: target.href || null,
          page_path: window.location.pathname
        });
      }

      // Phone Clicks
      if (target.matches(CONFIG.selectors.phone)) {
        const phoneNumber = target.href ? target.href.replace('tel:', '') : target.textContent.trim();
        pushEvent('phone_click', {
          phone_number: phoneNumber,
          page_path: window.location.pathname
        });
      }

      // Contact Clicks
      if (target.matches(CONFIG.selectors.contact)) {
        pushEvent('contact_click', {
          contact_type: target.dataset.contactType || 'general',
          contact_text: target.textContent.trim(),
          page_path: window.location.pathname
        });
      }
    });
  }

  /**
   * Outbound Link Tracking
   */
  function initOutboundTracking() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="http"]');
      if (!link) return;

      // Prüfen ob externer Link
      if (link.hostname !== window.location.hostname) {
        pushEvent('outbound_link', {
          link_url: link.href,
          link_text: link.textContent.trim(),
          page_path: window.location.pathname
        });
      }
    });
  }

  /**
   * Engagement Time Tracking (vereinfacht)
   */
  function initEngagementTracking() {
    let startTime = Date.now();
    let engaged = true;

    // Visibility Change tracken
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        engaged = false;
      } else {
        startTime = Date.now();
        engaged = true;
      }
    });

    // Bei Verlassen der Seite
    window.addEventListener('beforeunload', function() {
      if (engaged) {
        const engagementTime = Math.round((Date.now() - startTime) / 1000);
        pushEvent('page_engagement', {
          engagement_time_seconds: engagementTime,
          page_path: window.location.pathname
        });
      }
    });
  }

  /**
   * Alle Tracking-Module initialisieren
   */
  function init() {
    // Warten bis DOM bereit ist
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    trackPageView();
    initScrollTracking();
    initClickTracking();
    initOutboundTracking();
    initEngagementTracking();

    if (CONFIG.debug) {
      console.log('[Tracking] Initialized');
    }
  }

  // Public API
  window.LuadaTracking = {
    init: init,
    pushEvent: pushEvent,
    enableDebug: function() { CONFIG.debug = true; },
    disableDebug: function() { CONFIG.debug = false; }
  };

  // Auto-Init
  init();

})();
