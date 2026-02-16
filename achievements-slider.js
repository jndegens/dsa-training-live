/**
 * Achievements Slider - Auto-scrolling marquee with student cards
 * Two rows scrolling in opposite directions
 *
 * Config: Set window.ACHIEVEMENTS_SLIDER_CONFIG before loading:
 *   window.ACHIEVEMENTS_SLIDER_CONFIG = {
 *     jsonUrl: './achievements.json',
 *     title: 'Wat Onze Studenten Zeggen',
 *     cardsPerRow: 8,
 *     speed: 30,          // seconds for one full scroll cycle
 *   };
 */
(function () {
    var config = window.ACHIEVEMENTS_SLIDER_CONFIG || {};
    var JSON_URL = config.jsonUrl || './achievements.json';
    var TITLE = config.title || 'Wat Onze Studenten Zeggen';
    var CARDS_PER_ROW = config.cardsPerRow || 8;
    var SPEED = config.speed || 30;

    var LEVEL_COLORS = {
        'Level 3: 100k+': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '100K+' },
        'Level 2: 50-100k': { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: '50-100K' },
        'Level 1: 10-50k': { color: '#00e5c8', bg: 'rgba(0,229,200,0.12)', label: '10-50K' },
        '0-10k': { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', label: '0-10K' },
        'Eerste Sale': { color: '#34d399', bg: 'rgba(52,211,153,0.12)', label: 'Eerste Sale' },
    };

    function injectStyles() {
        if (document.getElementById('as-styles')) return;
        var s = document.createElement('style');
        s.id = 'as-styles';
        s.textContent = '\
            .as-section { padding: 50px 0; overflow: hidden; }\
            .as-title { font-size: clamp(24px, 4vw, 34px); font-weight: 900; color: #fff; text-align: center; margin-bottom: 36px; line-height: 1.3; }\
            .as-title .as-highlight { background: linear-gradient(135deg, #00e5c8 0%, #00b4d8 50%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\
            \
            .as-track-wrapper { position: relative; margin-bottom: 16px; }\
            .as-track-wrapper::before,\
            .as-track-wrapper::after {\
                content: ""; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none;\
            }\
            .as-track-wrapper::before { left: 0; background: linear-gradient(to right, #080c14 0%, transparent 100%); }\
            .as-track-wrapper::after { right: 0; background: linear-gradient(to left, #080c14 0%, transparent 100%); }\
            \
            .as-track { display: flex; gap: 16px; width: max-content; }\
            .as-track.scroll-left { animation: asScrollLeft var(--as-speed) linear infinite; }\
            .as-track.scroll-right { animation: asScrollRight var(--as-speed) linear infinite; }\
            .as-track:hover { animation-play-state: paused; }\
            \
            @keyframes asScrollLeft {\
                0% { transform: translateX(0); }\
                100% { transform: translateX(-50%); }\
            }\
            @keyframes asScrollRight {\
                0% { transform: translateX(-50%); }\
                100% { transform: translateX(0); }\
            }\
            \
            .as-card {\
                flex-shrink: 0; width: 340px; background: #111827; border: 1px solid rgba(255,255,255,0.06);\
                border-radius: 16px; overflow: hidden; transition: border-color 0.3s, transform 0.2s;\
            }\
            .as-card:hover { border-color: rgba(0,229,200,0.25); transform: translateY(-2px); }\
            \
            .as-card-img { width: 100%; height: 180px; object-fit: cover; }\
            \
            .as-card-body { padding: 16px 18px; }\
            \
            .as-card-quote { font-size: 13px; color: #cbd5e1; line-height: 1.55; font-style: italic; margin-bottom: 14px;\
                display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }\
            .as-card-quote::before { content: open-quote; color: #00e5c8; font-size: 16px; font-weight: 700; margin-right: 2px; }\
            \
            .as-card-footer { display: flex; align-items: center; gap: 10px; }\
            .as-card-avatar {\
                width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center;\
                justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; overflow: hidden;\
            }\
            .as-card-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }\
            .as-card-name { font-size: 14px; font-weight: 700; color: #fff; }\
            .as-card-level { font-size: 11px; color: #64748b; }\
            .as-card-badge {\
                margin-left: auto; padding: 4px 10px; border-radius: 20px;\
                font-size: 11px; font-weight: 700; white-space: nowrap; flex-shrink: 0;\
            }\
            \
            @media (max-width: 640px) {\
                .as-card { width: 280px; }\
                .as-card-img { height: 150px; }\
            }\
        ';
        document.head.appendChild(s);
    }

    function esc(str) {
        var d = document.createElement('div');
        d.textContent = str || '';
        return d.innerHTML;
    }

    function buildCard(a) {
        var lc = LEVEL_COLORS[a.achievement] || LEVEL_COLORS['Eerste Sale'];
        var initial = (a.name || '?')[0].toUpperCase();
        var html = '<div class="as-card">';

        if (a.screenshot) {
            html += '<img class="as-card-img" src="' + esc(a.screenshot) + '" alt="' + esc(a.name) + '" loading="lazy">';
        }

        html += '<div class="as-card-body">';

        if (a.quote) {
            html += '<div class="as-card-quote">' + esc(a.quote) + '</div>';
        }

        html += '<div class="as-card-footer">';

        if (a.avatar) {
            html += '<div class="as-card-avatar"><img src="' + esc(a.avatar) + '" alt="' + esc(a.name) + '" loading="lazy"></div>';
        } else {
            html += '<div class="as-card-avatar" style="background:' + lc.bg + ';color:' + lc.color + '">' + initial + '</div>';
        }

        html += '<div><div class="as-card-name">' + esc(a.name) + '</div>';
        html += '<div class="as-card-level">DSA Student</div></div>';
        html += '<span class="as-card-badge" style="background:' + lc.bg + ';color:' + lc.color + '">' + lc.label + '</span>';
        html += '</div></div></div>';

        return html;
    }

    function render(data) {
        var container = document.getElementById('achievements-slider');
        if (!container) return;

        injectStyles();

        var achievements = data.achievements || [];

        // Filter: must have quote AND screenshot AND avatar for best visual
        var withAll = achievements.filter(function (a) { return a.quote && a.screenshot && a.avatar; });
        var withBoth = achievements.filter(function (a) { return a.quote && a.screenshot; });
        var withQuote = achievements.filter(function (a) { return a.quote && a.avatar; });

        // Prefer cards with all three, then both, then quote+avatar
        var pool = withAll.length >= CARDS_PER_ROW * 2 ? withAll : withBoth.length >= CARDS_PER_ROW * 2 ? withBoth : withQuote;

        // Sort by level (higher first) then shuffle within levels
        var levelOrder = ['Level 3: 100k+', 'Level 2: 50-100k', 'Level 1: 10-50k', '0-10k', 'Eerste Sale'];
        pool.sort(function (a, b) {
            return levelOrder.indexOf(a.achievement) - levelOrder.indexOf(b.achievement);
        });

        // Take top cards for each row
        var row1Items = pool.slice(0, CARDS_PER_ROW);
        var row2Items = pool.slice(CARDS_PER_ROW, CARDS_PER_ROW * 2);

        // If not enough for row2, reuse some from pool
        if (row2Items.length < 4) {
            row2Items = pool.slice(0, CARDS_PER_ROW);
        }

        // Build HTML for each row (duplicate for infinite scroll)
        function buildRow(items) {
            var cards = '';
            items.forEach(function (a) { cards += buildCard(a); });
            return cards + cards; // duplicate for seamless loop
        }

        var html = '<section class="as-section">';
        if (TITLE) {
            // Support {highlight} markers in title
            var titleHtml = TITLE.replace(/\{([^}]+)\}/g, '<span class="as-highlight">$1</span>');
            html += '<div class="as-title">' + titleHtml + '</div>';
        }

        html += '<div class="as-track-wrapper">';
        html += '<div class="as-track scroll-left" style="--as-speed:' + SPEED + 's">';
        html += buildRow(row1Items);
        html += '</div></div>';

        html += '<div class="as-track-wrapper">';
        html += '<div class="as-track scroll-right" style="--as-speed:' + (SPEED + 5) + 's">';
        html += buildRow(row2Items);
        html += '</div></div>';

        html += '</section>';
        container.innerHTML = html;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('achievements-slider');
        if (!container) return;

        if (config.data) {
            render(config.data);
            return;
        }

        fetch(JSON_URL)
            .then(function (r) { return r.json(); })
            .then(render)
            .catch(function (err) {
                console.warn('Achievements slider: could not load data', err);
            });
    });
})();
