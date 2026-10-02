const toggle=document.querySelector('.nav-toggle');const mobile=document.querySelector('.mobile-nav');if(toggle&&mobile){toggle.addEventListener('click',()=>mobile.classList.toggle('open'));mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')))}
const search=document.querySelector('#serviceSearch');const filters=[...document.querySelectorAll('.filter')];const cards=[...document.querySelectorAll('.service-card')];const empty=document.querySelector('#empty');let active='all';function apply(){let q=(search?.value||'').toLowerCase().trim(),n=0;cards.forEach(c=>{let ok=(active==='all'||c.dataset.cat===active)&&(!q||c.innerText.toLowerCase().includes(q));c.style.display=ok?'flex':'none';if(ok)n++});if(empty)empty.style.display=n?'none':'block'}filters.forEach(f=>f.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));f.classList.add('active');active=f.dataset.filter;apply()}));search?.addEventListener('input',apply);

/* Animasi muncul saat elemen di-scroll ke layar (progressive enhancement, aman tanpa JS) */
(function(){
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCount(b){
        var raw = b.textContent.trim();
        var match = raw.match(/^(\d+)(.*)$/);
        if (!match) return;
        var target = parseInt(match[1], 10);
        var suffix = match[2] || '';
        if (reduced || !target) { return; }
        var start = null, duration = 1100;
        function step(ts){
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            b.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var targets = document.querySelectorAll(
        '.card, .service-card, .team-card, .feature, .contact-card, .step, .stat, .section-head, .quote, .team-photo, .seal-strip-inner'
    );
    if (!targets.length) return;
    if (!('IntersectionObserver' in window) || reduced) {
        targets.forEach(function(el){ el.classList.add('in-view'); });
        return;
    }
    var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('stat')) {
                    var b = entry.target.querySelector('b');
                    if (b) animateCount(b);
                }
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function(el){
        el.classList.add('reveal');
        io.observe(el);
    });
})();

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const toggle = document.querySelector('.nav-toggle');
const mobile = document.querySelector('.mobile-nav');

if (toggle && mobile) {
    toggle.addEventListener('click', () => {
        mobile.classList.toggle('open');
    });

    mobile.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            mobile.classList.remove('open');
        });
    });
}


/* =========================================================
   SERVICE SEARCH & FILTER
========================================================= */

const search = document.querySelector('#serviceSearch');
const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.service-card')];
const empty = document.querySelector('#empty');

let active = 'all';

function apply() {
    let q = (search?.value || '').toLowerCase().trim();
    let n = 0;

    cards.forEach(c => {
        let ok =
            (active === 'all' || c.dataset.cat === active) &&
            (!q || c.innerText.toLowerCase().includes(q));

        c.style.display = ok ? 'flex' : 'none';

        if (ok) {
            n++;
        }
    });

    if (empty) {
        empty.style.display = n ? 'none' : 'block';
    }
}

filters.forEach(f => {
    f.addEventListener('click', () => {
        filters.forEach(x => x.classList.remove('active'));

        f.classList.add('active');
        active = f.dataset.filter;

        apply();
    });
});

search?.addEventListener('input', apply);


/* =========================================================
   ANIMASI MUNCUL SAAT ELEMEN DI-SCROLL KE LAYAR
   Progressive enhancement, aman tanpa JS
========================================================= */

(function () {
    var reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    function animateCount(b) {
        var raw = b.textContent.trim();
        var match = raw.match(/^(\d+)(.*)$/);

        if (!match) return;

        var target = parseInt(match[1], 10);
        var suffix = match[2] || '';

        if (reduced || !target) {
            return;
        }

        var start = null;
        var duration = 1100;

        function step(ts) {
            if (!start) {
                start = ts;
            }

            var p = Math.min(
                (ts - start) / duration,
                1
            );

            var eased = 1 - Math.pow(1 - p, 3);

            b.textContent =
                Math.round(eased * target) + suffix;

            if (p < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    var targets = document.querySelectorAll(
        '.card, .service-card, .team-card, .feature, .contact-card, .step, .stat, .section-head, .quote, .team-photo, .seal-strip-inner'
    );

    if (!targets.length) {
        return;
    }

    if (
        !('IntersectionObserver' in window) ||
        reduced
    ) {
        targets.forEach(function (el) {
            el.classList.add('in-view');
        });

        return;
    }

    var io = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    if (
                        entry.target.classList.contains('stat')
                    ) {
                        var b = entry.target.querySelector('b');

                        if (b) {
                            animateCount(b);
                        }
                    }

                    io.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    targets.forEach(function (el) {
        el.classList.add('reveal');
        io.observe(el);
    });
})();


/* =========================================================
   MINI CONSULTATION WIDGET
   Hanya berjalan jika widget ada di halaman
========================================================= */

(function () {
    var widget = document.getElementById('consultationWidget');
    var close = document.getElementById('consultationClose');

    if (!widget || !close) {
        return;
    }

    var closedByUser = false;
    var showTimer;
    var hideTimer;
    var nextTimer;

    function showWidget() {
        if (closedByUser) {
            return;
        }

        widget.classList.add('show');

        hideTimer = setTimeout(function () {
            widget.classList.remove('show');

            nextTimer = setTimeout(function () {
                showWidget();
            }, 8000);
        }, 13000);
    }

    close.addEventListener('click', function () {
        closedByUser = true;

        clearTimeout(showTimer);
        clearTimeout(hideTimer);
        clearTimeout(nextTimer);

        widget.classList.remove('show');
    });

    showTimer = setTimeout(function () {
        showWidget();
    }, 2500);
})();
