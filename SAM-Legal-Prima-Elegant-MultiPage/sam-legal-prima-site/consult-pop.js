/* Popup animasi konsultasi: muncul beberapa detik, hilang, lalu muncul lagi tiap ±1 menit lebih.
   Markup dibuat otomatis oleh file ini, jadi cukup pasang <script src="consult-pop.js"> di halaman mana pun. */
(function () {
    var pop = document.getElementById('consultPop');
    if (!pop) {
        pop = document.createElement('aside');
        pop.id = 'consultPop';
        pop.className = 'consult-pop';
        pop.setAttribute('aria-label', 'Ilustrasi konsultasi');
        pop.innerHTML = `<button class="consult-close" type="button" aria-label="Tutup">&times;</button>
<div class="consult-scene"><span class="consult-chip"><i></i>Sedang konsultasi</span><svg viewBox="0 0 260 130" aria-hidden="true">
<rect width="260" height="130" fill="#F2ECDC"/><rect y="102" width="260" height="28" fill="#E6DFCB"/><rect y="100" width="260" height="3" fill="#DAB978"/>
<g class="cp-person cp-a"><rect x="36" y="64" width="48" height="42" rx="15" fill="#141F38"/><path d="M53 64 L60 80 L67 64 Z" fill="#fff"/><path d="M58 70 L62 70 L63 82 L60 86 L57 82 Z" fill="#AD8547"/><circle cx="60" cy="50" r="14" fill="#E8C39E"/><path d="M46 50 Q46 34 60 34 Q74 34 74 50 Q68 42 60 42 Q52 42 46 50 Z" fill="#2A2018"/></g>
<g class="cp-person cp-b"><rect x="176" y="66" width="48" height="40" rx="15" fill="#AD8547"/><path d="M200 36 Q222 36 222 56 L222 64 Q200 60 178 64 L178 56 Q178 36 200 36 Z" fill="#3A2A22"/><circle cx="200" cy="52" r="13" fill="#C99A6B"/><path d="M187 50 Q188 38 200 38 Q212 38 213 50 Q206 44 200 44 Q194 44 187 50 Z" fill="#3A2A22"/></g>
<rect x="108" y="90" width="44" height="12" rx="2" fill="#fff" stroke="#DAB978"/><rect x="114" y="94" width="24" height="2.5" rx="1" fill="#DAB978"/><rect x="114" y="98" width="16" height="2.5" rx="1" fill="#DAB978" opacity=".6"/>
<g class="cp-dots cp-d1"><rect x="150" y="8" width="42" height="22" rx="11" fill="#fff" stroke="#DAB978"/><circle cx="163" cy="19" r="2.5"/><circle cx="171" cy="19" r="2.5"/><circle cx="179" cy="19" r="2.5"/></g>
<g class="cp-msg cp-m1"><rect x="122" y="8" width="102" height="24" rx="11" fill="#fff" stroke="#DAB978"/><path d="M186 32 L192 42 L198 32 Z" fill="#fff" stroke="#DAB978"/><rect x="185" y="31" width="14" height="2" fill="#fff"/><text x="173" y="24" text-anchor="middle">Saya mau buat PT</text></g>
<g class="cp-dots cp-d2"><rect x="30" y="8" width="42" height="22" rx="11" fill="#141F38"/><circle class="w" cx="43" cy="19" r="2.5"/><circle class="w" cx="51" cy="19" r="2.5"/><circle class="w" cx="59" cy="19" r="2.5"/></g>
<g class="cp-msg cp-m2"><rect x="14" y="8" width="102" height="24" rx="11" fill="#141F38"/><path d="M54 32 L60 42 L66 32 Z" fill="#141F38"/><text class="w" x="65" y="24" text-anchor="middle">Siap, kami bantu!</text></g>
<g class="cp-ok"><circle cx="130" cy="72" r="11" fill="#AD8547"/><path d="M124.5 72 L128.5 76 L136 67.5" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
</svg></div>
<div class="consult-foot"><span class="consult-live" aria-hidden="true"></span><div class="consult-txt"><strong>Konsultasi Gratis</strong><small>Sesi berlangsung · tim kami siap</small></div><a class="consult-btn" href="https://wa.me/62895414915315" target="_blank">Chat</a></div>`;
        document.body.appendChild(pop);
    }

    var FIRST_DELAY = 4000;   // muncul pertama kali setelah 4 detik
    var SHOW_FOR = 12000;     // tampil 12 detik
    var GAP_MIN = 70000;      // jeda minimal sebelum muncul lagi (70 detik)
    var GAP_MAX = 90000;      // jeda maksimal (90 detik)
    var timer;

    function hide() {
        pop.classList.remove('show');
        clearTimeout(timer);
        timer = setTimeout(show, GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN));
    }
    var ASK = ['Saya mau buat PT', 'Urus CV bisa?', 'Butuh SKK / SBU', 'Urus halal bisa?', 'Mau urus ISO', 'Daftar Yayasan?', 'Buat PT PMA?'];
    var ANS = ['Siap, kami bantu!', 'Bisa, kami bantu', 'Tentu, kami urus'];
    var n = 0;
    function show() {
        var q = pop.querySelector('.cp-m1 text'), a = pop.querySelector('.cp-m2 text');
        if (q) q.textContent = ASK[n % ASK.length];
        if (a) a.textContent = ANS[n % ANS.length];
        n++;
        pop.classList.add('show');
        timer = setTimeout(hide, SHOW_FOR);
    }

    pop.querySelector('.consult-close').addEventListener('click', hide);
    timer = setTimeout(show, FIRST_DELAY);
})();
