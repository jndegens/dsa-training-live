/**
 * Achievements Widget v4
 * Grouped by category, expandable sections, screenshots + quotes
 *
 * Config: Set window.ACHIEVEMENTS_CONFIG before loading this script:
 *   window.ACHIEVEMENTS_CONFIG = {
 *     jsonUrl: './achievements.json',
 *     initialCards: 3,           // cards visible per category before expanding
 *     showStats: true,
 *     showScreenshots: true,
 *     title: 'Live Resultaten',
 *   };
 */
(function () {
    var config = window.ACHIEVEMENTS_CONFIG || {};
    var JSON_URL = config.jsonUrl || './achievements.json';
    var MAX_CARDS = config.maxCards || 6;
    var SHOW_STATS = config.showStats !== false;
    var SHOW_SCREENSHOTS = config.showScreenshots !== false;
    var TITLE = config.title || 'Live Resultaten';
    var SUBTITLE = config.subtitle || 'Echte resultaten van echte studenten';

    var LEVELS = [
        { key: 'Level 3: 100k+', label: '100K+ Omzet', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', icon: '🏆', desc: 'Studenten die meer dan €100.000 omzet hebben gedraaid' },
        { key: 'Level 2: 50-100k', label: '50-100K Omzet', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)', icon: '💎', desc: 'Op weg naar de 100K milestone' },
        { key: 'Level 1: 10-50k', label: '10-50K Omzet', color: '#00e5c8', bg: 'rgba(0,229,200,0.12)', border: 'rgba(0,229,200,0.25)', icon: '🚀', desc: 'Serieuze groei en consistente omzet' },
        { key: '0-10k', label: '0-10K Omzet', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.25)', icon: '📈', desc: 'De eerste stappen naar succes' },
        { key: 'Eerste Sale', label: 'Eerste Sale', color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)', icon: '🎉', desc: 'Het begin van hun e-commerce reis' },
    ];

    function injectStyles() {
        if (document.getElementById('aw-styles')) return;
        var style = document.createElement('style');
        style.id = 'aw-styles';
        style.textContent = '\
            .aw-section { padding: 50px 20px; }\
            .aw-container { max-width: 960px; margin: 0 auto; }\
            .aw-label { font-size: 13px; font-weight: 700; color: #00e5c8; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 10px; }\
            .aw-subtitle { font-size: 15px; color: #94a3b8; text-align: center; margin-bottom: 30px; }\
            \
            .aw-stats { display: flex; justify-content: center; gap: 32px; margin-bottom: 40px; flex-wrap: wrap; }\
            .aw-stat { text-align: center; }\
            .aw-stat-num { font-size: 32px; font-weight: 900; background: linear-gradient(135deg, #00e5c8, #00b4d8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2; }\
            .aw-stat-label { font-size: 12px; color: #64748b; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }\
            \
            /* Category section */\
            .aw-category { margin-bottom: 36px; }\
            .aw-cat-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }\
            .aw-cat-icon { font-size: 24px; }\
            .aw-cat-info { flex: 1; }\
            .aw-cat-title { font-size: 18px; font-weight: 800; color: #fff; }\
            .aw-cat-desc { font-size: 13px; color: #64748b; margin-top: 2px; }\
            .aw-cat-count { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; height: 28px; padding: 0 10px; border-radius: 14px; font-size: 13px; font-weight: 700; flex-shrink: 0; }\
            \
            /* Cards grid */\
            .aw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }\
            \
            .aw-card { background: rgba(17,24,39,0.8); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; transition: border-color 0.3s, transform 0.2s, box-shadow 0.3s; backdrop-filter: blur(8px); }\
            .aw-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }\
            \
            \
            .aw-screenshot { width: 100%; aspect-ratio: 16/10; overflow: hidden; cursor: pointer; position: relative; }\
            .aw-screenshot img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }\
            .aw-screenshot:hover img { transform: scale(1.03); }\
            .aw-screenshot .aw-zoom { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.6); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 6px; opacity: 0; transition: opacity 0.3s; }\
            .aw-screenshot:hover .aw-zoom { opacity: 1; }\
            \
            .aw-card-body { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }\
            \
            .aw-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; flex-shrink: 0; overflow: hidden; }\
            .aw-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }\
            .aw-avatar-ring { box-shadow: 0 0 0 2px rgba(0,229,200,0.3); }\
            \
            .aw-info { flex: 1; min-width: 0; }\
            .aw-name { font-size: 14px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\
            .aw-detail { font-size: 12px; color: #64748b; margin-top: 1px; }\
            \
            .aw-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }\
            \
            .aw-quote { padding: 0 16px 14px; font-size: 13px; color: #cbd5e1; line-height: 1.5; font-style: italic; }\
            .aw-quote::before { content: open-quote; color: #00e5c8; font-size: 18px; font-weight: 700; margin-right: 2px; }\
            \
            /* Lightbox */\
            .aw-lightbox { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: rgba(0,0,0,0.92); align-items: center; justify-content: center; padding: 20px; cursor: zoom-out; }\
            .aw-lightbox.active { display: flex; }\
            .aw-lightbox img { max-width: 95vw; max-height: 90vh; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }\
            .aw-lightbox-close { position: absolute; top: 20px; right: 24px; color: #fff; font-size: 32px; cursor: pointer; line-height: 1; opacity: 0.7; transition: opacity 0.2s; }\
            .aw-lightbox-close:hover { opacity: 1; }\
            \
            /* Fade-in */\
            .aw-card { opacity: 0; animation: awFadeIn 0.4s ease forwards; }\
            @keyframes awFadeIn {\
                from { opacity: 0; transform: translateY(8px); }\
                to { opacity: 1; transform: translateY(0); }\
            }\
            \
            @media (max-width: 640px) {\
                .aw-grid { grid-template-columns: 1fr; }\
                .aw-stats { gap: 20px; }\
                .aw-stat-num { font-size: 26px; }\
                .aw-cat-header { flex-wrap: wrap; }\
            }\
        ';
        document.head.appendChild(style);
    }

    function render(data) {
        var container = document.getElementById('achievements-wall');
        if (!container) return;

        injectStyles();

        var achievements = data.achievements || [];
        var stats = data.stats || {};

        // Group by achievement level
        var groups = {};
        achievements.forEach(function(a) {
            var key = a.achievement;
            if (!groups[key]) groups[key] = [];
            groups[key].push(a);
        });

        // Sort within each group: avatar required, then screenshot+quote first
        // Then take only the top MAX_CARDS per category
        Object.keys(groups).forEach(function(key) {
            // Filter to only students with avatars first
            var withAvatar = groups[key].filter(function(a) { return a.avatar; });
            var pool = withAvatar.length >= 2 ? withAvatar : groups[key];
            pool.sort(function(a, b) {
                var sa = (a.avatar ? 8 : 0) + (a.screenshot && SHOW_SCREENSHOTS ? 4 : 0) + (a.quote ? 2 : 0);
                var sb = (b.avatar ? 8 : 0) + (b.screenshot && SHOW_SCREENSHOTS ? 4 : 0) + (b.quote ? 2 : 0);
                return sb - sa;
            });
            groups[key] = pool.slice(0, MAX_CARDS);
        });

        var html = '<section class="aw-section"><div class="aw-container">';
        html += '<div class="aw-label">' + esc(TITLE) + '</div>';
        html += '<p class="aw-subtitle">' + esc(SUBTITLE) + '</p>';

        // Stats bar
        if (SHOW_STATS && stats.per_level) {
            var total = stats.total || 0;
            var highLevel = (stats.per_level['Level 3: 100k+'] || 0)
                + (stats.per_level['Level 2: 50-100k'] || 0)
                + (stats.per_level['Level 1: 10-50k'] || 0);
            html += '<div class="aw-stats">';
            html += '<div class="aw-stat"><div class="aw-stat-num">' + total + '</div><div class="aw-stat-label">Achievements</div></div>';
            html += '<div class="aw-stat"><div class="aw-stat-num">' + highLevel + '</div><div class="aw-stat-label">10K+ behaald</div></div>';
            html += '<div class="aw-stat"><div class="aw-stat-num">' + (stats.per_level['Level 3: 100k+'] || 0) + '</div><div class="aw-stat-label">100K+ club</div></div>';
            html += '</div>';
        }

        // Render each category
        LEVELS.forEach(function(level) {
            var items = groups[level.key];
            if (!items || items.length === 0) return;

            html += '<div class="aw-category">';

            // Category header
            html += '<div class="aw-cat-header">';
            html += '<span class="aw-cat-icon">' + level.icon + '</span>';
            html += '<div class="aw-cat-info">';
            html += '<div class="aw-cat-title" style="color:' + level.color + '">' + level.label + '</div>';
            html += '<div class="aw-cat-desc">' + level.desc + '</div>';
            html += '</div>';
            html += '</div>';

            // Cards grid
            html += '<div class="aw-grid">';
            items.forEach(function(a, i) {
                var delay = Math.min(i * 0.06, 0.5);

                html += '<div class="aw-card" style="animation-delay:' + delay + 's;border-color:' + level.border + '">';

                // Screenshot
                if (SHOW_SCREENSHOTS && a.screenshot) {
                    html += '<div class="aw-screenshot" onclick="awLightbox(\'' + escAttr(a.screenshot) + '\')">';
                    html += '<img src="' + escAttr(a.screenshot) + '" alt="Screenshot ' + escAttr(a.name) + '" loading="lazy">';
                    html += '<span class="aw-zoom">Bekijk screenshot</span>';
                    html += '</div>';
                }

                // Card body
                html += '<div class="aw-card-body">';
                var initial = (a.name || '?')[0].toUpperCase();

                if (a.avatar) {
                    html += '<div class="aw-avatar aw-avatar-ring"><img src="' + escAttr(a.avatar) + '" alt="' + escAttr(a.name) + '" loading="lazy" onerror="this.parentElement.innerHTML=\'' + initial + '\';this.parentElement.style.background=\'' + level.bg + '\';this.parentElement.style.color=\'' + level.color + '\'"></div>';
                } else {
                    html += '<div class="aw-avatar" style="background:' + level.bg + ';color:' + level.color + '">' + initial + '</div>';
                }

                html += '<div class="aw-info">';
                html += '<div class="aw-name">' + esc(a.name) + '</div>';
                html += '<div class="aw-detail">' + (a.date ? formatDate(a.date) : '') + '</div>';
                html += '</div>';
                html += '<div class="aw-badge" style="background:' + level.bg + ';color:' + level.color + '">' + level.icon + ' ' + level.label.split(' ')[0] + '</div>';
                html += '</div>';

                // Quote
                if (a.quote) {
                    html += '<div class="aw-quote">' + esc(a.quote) + '</div>';
                }

                html += '</div>';
            });
            html += '</div>';

            html += '</div>';
        });

        // Lightbox
        html += '<div class="aw-lightbox" id="aw-lb" onclick="this.classList.remove(\'active\')">';
        html += '<span class="aw-lightbox-close">&times;</span>';
        html += '<img src="" alt="Screenshot">';
        html += '</div>';

        html += '</div></section>';
        container.innerHTML = html;
    }

    // Global lightbox function
    window.awLightbox = function(src) {
        var lb = document.getElementById('aw-lb');
        if (!lb) return;
        lb.querySelector('img').src = src;
        lb.classList.add('active');
    };

    function esc(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function formatDate(dateStr) {
        try {
            var d = new Date(dateStr);
            return d.toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var container = document.getElementById('achievements-wall');
        if (!container) return;

        // Als data al inline is meegegeven, gebruik die direct
        if (config.data) {
            render(config.data);
            return;
        }

        fetch(JSON_URL)
            .then(function(r) { return r.json(); })
            .then(render)
            .catch(function(err) {
                console.warn('Achievements widget: could not load data', err);
            });
    });
})();
