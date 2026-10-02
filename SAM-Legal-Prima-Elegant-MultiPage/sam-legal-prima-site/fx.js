/* Efek tambahan: progress scroll, header, spotlight kartu, tilt hero, partikel emas, kursor glow, transisi halaman */
(function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var d = document, body = d.body;

    /* 1. Progress bar scroll + header */
    var bar = d.createElement('div'); bar.className = 'fx-progress'; body.appendChild(bar);
    var header = d.querySelector('.site-header');
    function onScroll() {
        var h = d.documentElement.scrollHeight - innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
        if (header) header.classList.toggle('scrolled', scrollY > 30);
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    /* 2. Spotlight emas mengikuti kursor di kartu */
    if (fine) {
        d.querySelectorAll('.card, .service-card, .feature, .team-card, .contact-card, .step').forEach(function (el) {
            el.classList.add('fx-spot');
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                el.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });
    }

    /* 3. Kursor glow lembut */
    if (fine && !reduced) {
        var glow = d.createElement('div'); glow.className = 'fx-glow'; body.appendChild(glow);
        var gx = -999, gy = -999, tx = gx, ty = gy;
        addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; }, { passive: true });
        (function loop() {
            gx += (tx - gx) * .12; gy += (ty - gy) * .12;
            glow.style.transform = 'translate(' + (gx - 180) + 'px,' + (gy - 180) + 'px)';
            requestAnimationFrame(loop);
        })();
    }

    /* 4. Hero: tilt 3D ilustrasi + partikel konstelasi emas */
    var hero = d.querySelector('.hero');
    if (hero && !reduced) {
        var card = hero.querySelector('.hero-card'), art = hero.querySelector('.hero-art');
        if (card && art && fine) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
                art.style.transition = 'transform .08s linear';
                art.style.transform = 'perspective(900px) rotateX(' + (-y * 9) + 'deg) rotateY(' + (x * 11) + 'deg) scale(1.03)';
            });
            card.addEventListener('mouseleave', function () {
                art.style.transition = 'transform .6s ease'; art.style.transform = '';
            });
        }

        var cv = d.createElement('canvas'); cv.className = 'fx-particles'; hero.insertBefore(cv, hero.firstChild);
        var ctx = cv.getContext('2d'), W, H, dpr = Math.min(devicePixelRatio || 1, 2), P = [], mouse = { x: -999, y: -999 }, running = false;
        function size() {
            var r = hero.getBoundingClientRect(); W = r.width; H = r.height;
            cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var n = W < 700 ? 26 : 56; P = [];
            for (var i = 0; i < n; i++) P.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6 });
        }
        function frame() {
            if (!running) return;
            ctx.clearRect(0, 0, W, H);
            for (var i = 0; i < P.length; i++) {
                var a = P[i]; a.x += a.vx; a.y += a.vy;
                if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
                ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fillStyle = 'rgba(218,185,120,.75)'; ctx.fill();
                for (var j = i + 1; j < P.length; j++) {
                    var b = P[j], dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) { ctx.strokeStyle = 'rgba(218,185,120,' + (.16 * (1 - dist / 110)) + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
                }
                var mx = a.x - mouse.x, my = a.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
                if (md < 150) { ctx.strokeStyle = 'rgba(255,236,190,' + (.4 * (1 - md / 150)) + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
            }
            requestAnimationFrame(frame);
        }
        size(); addEventListener('resize', size);
        hero.addEventListener('mousemove', function (e) { var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
        hero.addEventListener('mouseleave', function () { mouse.x = mouse.y = -999; });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) {
                var vis = en[0].isIntersecting;
                if (vis && !running) { running = true; frame(); } else if (!vis) running = false;
            }).observe(hero);
        } else { running = true; frame(); }
    }

    /* 5. Transisi halaman: tirai navy halus saat pindah halaman */
    var curtain = d.createElement('div'); curtain.className = 'fx-curtain'; body.appendChild(curtain);
    addEventListener('pageshow', function () { curtain.classList.remove('on'); });
    if (!reduced) {
        d.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href]');
            if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
            if (a.target === '_blank' || a.hasAttribute('download')) return;
            var u = new URL(a.href, location.href);
            if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash) || !/\.html?$|\/$/.test(u.pathname)) return;
            e.preventDefault(); curtain.classList.add('on');
            setTimeout(function () { location.href = a.href; }, 320);
        });
    }
})();


/* =========================================================
   LUXE — pembuka mewah, judul per-kata, kursor ring, tombol magnetik
========================================================= */
(function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var d = document, root = d.documentElement, body = d.body;

    /* A. Pembuka segel emas (beranda, sekali per sesi) */
    var isHome = !!d.querySelector('.hero');
    var seen = false; try { seen = sessionStorage.getItem('slp-splash') === '1'; } catch (e) {}
    if (isHome && !seen && !reduced) {
        try { sessionStorage.setItem('slp-splash', '1'); } catch (e) {}
        root.classList.add('fx-splashing');
        var sp = d.createElement('div'); sp.className = 'fx-splash';
        sp.innerHTML = '<svg viewBox="0 0 200 200" aria-hidden="true"><circle class="sp-r1" cx="100" cy="100" r="86"/><circle class="sp-r2" cx="100" cy="100" r="68"/><path class="sp-ck" d="M68 102 L90 124 L134 76"/></svg><div class="sp-t">SAM LEGAL PRIMA</div><div class="sp-s">Solusi Legalitas Anda</div>';
        body.appendChild(sp);
        setTimeout(function () { sp.classList.add('out'); }, 1900);
        setTimeout(function () { sp.remove(); root.classList.remove('fx-splashing'); }, 2700);
    }

    /* B. Judul masuk per kata (mask reveal) */
    if (!reduced) {
        d.querySelectorAll('.hero h1, .page-head h1').forEach(function (h) {
            var i = 0;
            (function walk(node) {
                Array.prototype.slice.call(node.childNodes).forEach(function (c) {
                    if (c.nodeType === 3) {
                        var frag = d.createDocumentFragment();
                        c.textContent.split(/(\s+)/).forEach(function (t) {
                            if (!t) return;
                            if (/^\s+$/.test(t)) { frag.appendChild(d.createTextNode(' ')); return; }
                            var w = d.createElement('span'), s = d.createElement('span');
                            w.className = 'fx-w'; s.textContent = t; s.style.setProperty('--i', i++); w.appendChild(s); frag.appendChild(w);
                        });
                        node.replaceChild(frag, c);
                    } else if (c.nodeType === 1) { walk(c); }
                });
            })(h);
        });
    }

    /* C. Petunjuk scroll di hero */
    var hero = d.querySelector('.hero');
    if (hero) { var sc = d.createElement('div'); sc.className = 'fx-scroll'; sc.innerHTML = '<i></i>'; hero.appendChild(sc); }

    if (fine && !reduced) {
        /* D. Ring kursor emas */
        var ring = d.createElement('div'); ring.className = 'fx-ring'; body.appendChild(ring);
        var rx = -99, ry = -99, px = rx, py = ry;
        addEventListener('mousemove', function (e) { px = e.clientX; py = e.clientY; ring.style.opacity = 1; }, { passive: true });
        d.addEventListener('mouseover', function (e) {
            ring.classList.toggle('big', !!(e.target.closest && e.target.closest('a, button, .card, .service-card, .team-card')));
        });
        (function loop() {
            rx += (px - rx) * .2; ry += (py - ry) * .2;
            ring.style.transform = 'translate(' + (rx - 18) + 'px,' + (ry - 18) + 'px)';
            requestAnimationFrame(loop);
        })();

        /* E. Tombol magnetik (pakai properti translate, tidak bentrok dengan efek lama) */
        d.querySelectorAll('.btn, .wa').forEach(function (b) {
            b.addEventListener('mousemove', function (e) {
                var r = b.getBoundingClientRect();
                b.style.translate = ((e.clientX - r.left - r.width / 2) * .22) + 'px ' + ((e.clientY - r.top - r.height / 2) * .35) + 'px';
            });
            b.addEventListener('mouseleave', function () { b.style.translate = ''; });
        });
    }
})();

(function(){var g=document.createElement('div');g.className='fx-grain';document.body.appendChild(g);})();
