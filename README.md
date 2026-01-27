# LUADA Advertorial / Ratgeber

Statische Magazin-Website für Advertorials und informative Artikel rund um Senioren-Sicherheit und die LUADA Notrufuhr.

## 🚀 Quick Start

### Lokale Entwicklung

```bash
# Einfach die index.html im Browser öffnen
# Oder mit einem lokalen Server:
npx serve .
# oder
python -m http.server 8000
```

### Deployment auf Cloudflare Pages

1. Repository zu GitHub pushen
2. In Cloudflare Dashboard: Pages → Create a project → Connect to Git
3. Repository auswählen
4. Build-Einstellungen:
   - **Build command**: (leer lassen)
   - **Build output directory**: `/` (Root)
5. Deploy!

---

## 📁 Projektstruktur

```
Advertorials/
├── index.html                    # Startseite / Artikelübersicht
├── assets/
│   ├── css/
│   │   ├── base.css             # Basis-Styles (Layout, Header, Footer)
│   │   └── article.css          # Artikel-spezifische Styles
│   └── js/
│       └── tracking.js          # Tracking-Modul (GTM-ready)
├── editorial/
│   ├── stuerze-im-alter/
│   │   └── index.html           # Hauptartikel
│   └── notrufuhr-vs-hausnotruf/
│       └── index.html           # Beispiel-Artikel 2
├── _templates/
│   └── article-template.html    # Template für neue Artikel
├── README.md                    # Diese Datei
└── _headers                     # Cloudflare Pages Headers
```

---

## 📊 Tracking-Integration

### Übersicht

Das Tracking-Modul (`assets/js/tracking.js`) ist **GTM-ready** und pusht alle Events in den `window.dataLayer`. Diese können dann im Google Tag Manager konfiguriert werden, um an Stape.io, GA4 oder andere Ziele weitergeleitet zu werden.

### Events

| Event | Auslöser | Parameter |
|-------|----------|-----------|
| `page_view` | Beim Laden | `page_path`, `page_title`, `page_url`, `referrer` |
| `scroll_depth` | Bei 25%, 50%, 75%, 100% | `scroll_percentage`, `page_path` |
| `cta_click` | Klick auf `[data-track="cta"]` | `cta_text`, `cta_url`, `cta_id`, `page_path` |
| `link_click` | Klick auf `[data-track="link"]` | `link_text`, `link_url`, `page_path` |
| `phone_click` | Klick auf Telefon-Links | `phone_number`, `page_path` |
| `contact_click` | Klick auf `[data-track="contact"]` | `contact_type`, `contact_text`, `page_path` |
| `outbound_link` | Klick auf externe Links | `link_url`, `link_text`, `page_path` |
| `page_engagement` | Beim Verlassen | `engagement_time_seconds`, `page_path` |

### Tracking-Attribute

Um Elemente zu tracken, einfach `data-track` Attribut hinzufügen:

```html
<!-- CTA Button -->
<a href="..." class="btn" data-track="cta">Jetzt kaufen</a>

<!-- Wichtiger Link -->
<a href="..." data-track="link">Mehr erfahren</a>

<!-- Telefonnummer (automatisch erkannt bei href="tel:...") -->
<a href="tel:+4980012345678" data-track="phone">Anrufen</a>

<!-- Kontakt mit Typ -->
<a href="..." data-track="contact" data-contact-type="footer">Kontakt</a>
```

### GTM einrichten

1. **GTM Container erstellen** und GTM-ID kopieren
2. **GTM Snippet einfügen** in jeder HTML-Datei (im `<head>`):

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

3. **Trigger im GTM anlegen** für Custom Events:
   - Trigger Type: "Custom Event"
   - Event name: z.B. `scroll_depth`
   
4. **Tags erstellen** für Stape.io/GA4 mit den entsprechenden Variablen

### Debug-Modus

```javascript
// In Browser-Konsole:
LuadaTracking.enableDebug();  // Aktiviert Console-Logs
LuadaTracking.disableDebug(); // Deaktiviert

// Manuell Event pushen:
LuadaTracking.pushEvent('custom_event', { key: 'value' });
```

---

## ✍️ Neuen Artikel erstellen

### Schritt 1: Ordner anlegen

```bash
mkdir editorial/mein-neuer-artikel
```

### Schritt 2: Template kopieren

Kopiere `_templates/article-template.html` nach `editorial/mein-neuer-artikel/index.html`

### Schritt 3: Anpassen

1. **Meta-Tags** aktualisieren (Title, Description, OG-Tags, Canonical)
2. **Inhalt** schreiben
3. **Datum** setzen
4. **Tracking-Attribute** zu CTAs und wichtigen Links hinzufügen

### Schritt 4: Zur Startseite hinzufügen

In `index.html` eine neue Article-Card im `.articles-grid` einfügen:

```html
<a href="/editorial/mein-neuer-artikel/" class="article-card" data-track="link">
  <div class="article-card__image">[Bildplatzhalter]</div>
  <div class="article-card__content">
    <span class="article-card__category">Kategorie</span>
    <h3 class="article-card__title">Mein neuer Artikel</h3>
    <p class="article-card__excerpt">Kurzbeschreibung...</p>
    <div class="article-card__meta">
      <time datetime="2026-01-27">27. Januar 2026</time> · X Min.
    </div>
  </div>
</a>
```

---

## 🎨 Verfügbare CSS-Komponenten

### Artikel-Elemente

| Klasse | Beschreibung |
|--------|--------------|
| `.article-header` | Artikelkopf mit Titel und Lead |
| `.article-content` | Hauptinhalt mit automatischem Styling |
| `.info-box` | Hervorgehobene Infobox |
| `.info-box--warning` | Warnungs-Variante (orange) |
| `.stat-box` | Statistik-Highlight |
| `.checklist` | Liste mit Checkmarks |
| `.cta-section` | Call-to-Action Bereich |
| `.product-teaser` | Dezenter Produkt-Teaser |
| `.related-articles` | Verwandte Artikel Grid |

### Buttons

```html
<a href="..." class="btn btn--primary">Primär</a>
<a href="..." class="btn btn--secondary">Sekundär</a>
<a href="..." class="btn btn--accent">Akzent</a>
```

---

## ⚡ Performance-Optimierung

### Umgesetzt

- ✅ Minimales CSS (~10KB gesamt)
- ✅ Nur ein kleines JS-File (Tracking)
- ✅ Keine externen Fonts (System Font Stack)
- ✅ Semantisches HTML
- ✅ Lazy-loading ready für Bilder
- ✅ Preconnect für GTM

### Bilder hinzufügen

Wenn Bilder verwendet werden:

```html
<img 
  src="bild.webp" 
  alt="Beschreibung"
  width="800" 
  height="450"
  loading="lazy"
  decoding="async"
>
```

- Moderne Formate: WebP bevorzugen
- Immer `width` und `height` angeben (CLS vermeiden)
- `loading="lazy"` für Below-the-fold Bilder

---

## 🔧 Konfiguration

### URLs anpassen

In allen HTML-Dateien die Canonical-URLs und OG-URLs auf die tatsächliche Domain ändern:

```html
<link rel="canonical" href="https://IHRE-DOMAIN.de/editorial/...">
<meta property="og:url" content="https://IHRE-DOMAIN.de/editorial/...">
```

### Telefonnummer ändern

Suchen & Ersetzen in allen Dateien:
- `+4980012345678` → Ihre Nummer
- `0800 123 456 78` → Ihre formatierte Nummer

### Favicon hinzufügen

1. Favicon-Dateien in `/assets/` ablegen
2. Im `<head>` einfügen:

```html
<link rel="icon" href="/assets/favicon.ico" sizes="any">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
```

---

## 📝 Lizenz

Proprietär – LUADA GmbH

---

## 🤝 Support

Bei Fragen zur technischen Umsetzung oder Erweiterung wenden Sie sich an das Entwicklungsteam.
