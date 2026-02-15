# Funnel Overzicht - "Het Experiment" Live Training
**Laatst bijgewerkt:** 14 februari 2026
**Live domein:** https://live.dropshipacademy.nl
**Hosting:** Netlify (site: dsa-experiment)

---

## 1. Funnel Flow

```
Meta Ad → Opt-in Pagina → Thank You Page → WebinarJam Email (met link) → Live Training
```

### Stappen:
1. Bezoeker komt via Meta ad op een opt-in pagina
2. Vult voornaam, email (+ optioneel telefoon als VIP) in
3. Data gaat via Zapier webhook naar WebinarJam
4. Bezoeker wordt doorgestuurd naar de Thank You page
5. WebinarJam stuurt automatisch de bevestigingsmail met de live link
6. Op de Thank You page staat: "Check je inbox" (geen directe link)

---

## 2. Actieve Pagina's

| Pagina | URL | Doel |
|--------|-----|------|
| Het Experiment (lang) | `live.dropshipacademy.nl` | Hoofd opt-in pagina (lang formaat met video, reviews, achievements) |
| Optintraining | `live.dropshipacademy.nl/optintraining` | Alternatieve opt-in (lang formaat, 4 reviews, grotere banner) |
| Experiment Sales Page | `live.dropshipacademy.nl/experiment-sp` | Sales letter stijl opt-in |
| Thank You | `live.dropshipacademy.nl/thankyou` | Bevestigingspagina na aanmelding |

### Niet-actief (legacy):
| Pagina | URL | Opmerking |
|--------|-----|-----------|
| Short | `live.dropshipacademy.nl/short` | Korte opt-in (oud pixel) |
| Sales | `live.dropshipacademy.nl/sales` | Originele sales letter (oud pixel) |
| Bevestigd | `live.dropshipacademy.nl/bevestigd` | Oude bevestigingspagina (oud pixel) |

---

## 3. Webhook (Zapier)

**Webhook URL:** `https://hooks.zapier.com/hooks/catch/4678145/ue1ytts/`
**Methode:** POST (mode: no-cors)

### Data die verstuurd wordt:
```json
{
    "first_name": "Voornaam",
    "email": "email@voorbeeld.nl",
    "phone": "+31612345678",
    "phone_country_code": "+31",
    "vip": true/false,
    "registered_at": "2026-02-14T12:00:00.000Z",
    "source": "long-optin",
    "training": "new-beginning-dfy-mentorship"
}
```

### Source per pagina:
| Pagina | Source waarde |
|--------|--------------|
| Het Experiment (index) | `long-optin` |
| Optintraining | `optintraining` |
| Experiment SP | `experiment-sp` |

> De `source` waarde geeft aan van welke pagina de opt-in komt. Hiermee kun je in Zapier/WebinarJam zien welke pagina het beste converteert.

---

## 4. WebinarJam Emails

De live link wordt **niet** op de Thank You page getoond. In plaats daarvan:
- Thank You page zegt: **"Check je inbox"**
- WebinarJam stuurt automatisch een bevestigingsmail met de persoonlijke live link
- WebinarJam handelt alle herinneringen en follow-ups af

### WebinarJam variabelen (voor emails/notificaties):
| Variabele | Waarde |
|-----------|--------|
| `{FIRST_NAME}` | Voornaam deelnemer |
| `{LAST_NAME}` | Achternaam deelnemer |
| `{ATTENDEE_EMAIL}` | Email deelnemer |
| `{DATE}` | Datum van de training |
| `{TIME}` | Tijd van de training |
| `{LIVE_LINK}` | Persoonlijke link naar de live room |
| `{TITLE}` | Titel van de training |
| `{PASSWORD}` | Wachtwoord (indien ingesteld) |

> **Let op:** Gebruik ALTIJD variabelen, nooit hardcoded datums of links in WebinarJam emails.

---

## 5. Meta Pixel Tracking

**Pixel ID:** `1648819232196660`

### Events per pagina:
| Pagina | Events |
|--------|--------|
| Het Experiment (index) | `PageView` |
| Optintraining | `PageView` |
| Experiment SP | `PageView` |
| Thank You | `PageView` + `Lead` |

### Hoe het werkt:
- Alle opt-in pagina's tracken alleen een **PageView** bij het laden
- De **Lead** event wordt pas gefired op de Thank You page (= succesvolle aanmelding)
- Meta kan hiermee optimaliseren op daadwerkelijke conversies (Lead), niet op page loads

---

## 6. Thank You Page Details

**URL:** `live.dropshipacademy.nl/thankyou`

### Wat de bezoeker ziet:
- Groen vinkje met "Je Bent Aangemeld!"
- "Check je inbox voor de bevestigingsmail met je persoonlijke link"
- Training details: Gratis Live Training, datum (eerstvolgende donderdag), 19:00 uur, Joshua Kaats
- **Link:** "Check je inbox" (geen directe WebinarJam link)
- Countdown timer naar eerstvolgende donderdag 19:00
- 3 tips: Zoom installeren, agenda blokken, notitieboek
- Social proof: 7 studentenfoto's + "8.000+ ondernemers"
- Trustpilot widget
- Achievements wall (139 studenten met foto's, gegroepeerd op omzetniveau)

### Countdown logica:
- Target: eerstvolgende **donderdag 19:00 CET**
- Als het donderdag is en voor 19:00: target is vandaag
- Als het donderdag is na 19:00: target is volgende donderdag
- Evergreen: past zich automatisch aan

---

## 7. Opt-in Formulier Velden

| Veld | Verplicht | Opmerking |
|------|-----------|-----------|
| Voornaam | Ja | |
| Achternaam | Ja (experiment-sp) / Nee (index, optintraining) | Verschilt per pagina |
| Email | Ja | |
| VIP checkbox | Nee | "Ja, ik wil VIP herinneringen" |
| Telefoon | Nee | Verschijnt alleen als VIP is aangevinkt |

### Telefoon landcodes:
NL (+31), BE (+32), DE (+49), UK (+44), FR (+33), ES (+34), IT (+39), PT (+351), AT (+43), CH (+41), SE (+46), NO (+47), DK (+45), PL (+48), TR (+90)

---

## 8. Achievements Wall

- **Bron:** `achievements.json` (221 resultaten)
- **Avatars:** 139 studenten met profielfoto (uit Circle.so community)
- **Categorieën:** 100K+ Omzet, 50-100K, 10-50K, 0-10K, Eerste Sale
- **Max per categorie:** 6 kaarten getoond
- **Sortering:** Screenshot + quote + avatar prioriteit
- **Lightbox:** Klik op screenshot voor groot beeld

---

## 9. Technische Setup

| Item | Waarde |
|------|--------|
| Hosting | Netlify |
| Site naam | dsa-experiment |
| Domein | live.dropshipacademy.nl |
| SSL | Automatisch via Netlify |
| Deploy | `npx netlify-cli deploy --prod --dir=.` |
| Bestanden | Statische HTML (geen build stap) |
| Fonts | Inter (Google Fonts) |
| Trustpilot | Widget v5 bootstrap |
