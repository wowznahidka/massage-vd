(function () {
  var API = 'https://wow-studio.pages.dev/api/contact';
  var PING = 'https://wow-studio.pages.dev/api/ping';
  var SOURCE = location.hostname + location.pathname;

  var currentContext = '';
  var isInitialized = false;

  // Immediate global API definition
  window.openWowContact = function (context) {
    if (context && typeof context === 'string') {
      currentContext = context;
    }
    if (!isInitialized) {
      initWidget();
    }
    var formWrap = document.getElementById('wcw-form-wrap');
    var successEl = document.getElementById('wcw-success');
    var submitBtn = document.getElementById('wcw-submit');
    var overlay = document.getElementById('wcw-overlay');
    var modal = document.getElementById('wcw-modal');
    var valEl = document.getElementById('wcw-val');

    if (formWrap) formWrap.style.display = 'block';
    if (successEl) successEl.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Надіслати →';
    }
    if (overlay) {
      overlay.style.display = 'block';
      requestAnimationFrame(function () { overlay.classList.add('open'); });
    }
    if (modal) {
      modal.style.display = 'block';
      requestAnimationFrame(function () { modal.classList.add('open'); });
    }
    if (valEl) setTimeout(function () { valEl.focus(); }, 120);
  };

  window.closeWowContact = function () {
    var overlay = document.getElementById('wcw-overlay');
    var modal = document.getElementById('wcw-modal');
    if (overlay) overlay.classList.remove('open');
    if (modal) modal.classList.remove('open');
    setTimeout(function () {
      if (overlay) overlay.style.display = 'none';
      if (modal) modal.style.display = 'none';
    }, 320);
  };

  window.openLeadModal = window.openWowContact;
  window.openDemoLeadModal = window.openWowContact;

  var css = `
#wcw-btn{position:fixed;bottom:24px;right:24px;z-index:99990;background:linear-gradient(100deg,#7C5CFF,#00E5FF);color:#04040a;border:none;border-radius:99px;padding:14px 22px;font-family:'Inter',system-ui,-apple-system,sans-serif;font-weight:800;font-size:13.5px;letter-spacing:.02em;cursor:pointer;box-shadow:0 4px 24px rgba(124,92,255,.45);display:none;align-items:center;gap:8px;transition:transform .2s,box-shadow .2s}
@media(max-width:768px){#wcw-btn{display:flex}}
#wcw-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(124,92,255,.6)}
#wcw-btn svg{flex-shrink:0}
#wcw-overlay{display:none;position:fixed;inset:0;z-index:999998;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .25s ease}
#wcw-overlay.open{opacity:1}
#wcw-modal{display:none;position:fixed;bottom:0;left:0;right:0;z-index:999999;background:#0d111c;border:1px solid rgba(255,255,255,.14);border-radius:24px 24px 0 0;padding:28px 24px 36px;box-shadow:0 -8px 48px rgba(0,0,0,.7);transform:translateY(100%);transition:transform .32s cubic-bezier(.16,1,.3,1),opacity .32s ease;max-width:440px;margin:0 auto;color:#ffffff;box-sizing:border-box;font-family:'Inter',system-ui,-apple-system,sans-serif}
#wcw-modal.open{transform:translateY(0)}
#wcw-modal h3{font-family:'Unbounded','Inter',sans-serif;font-size:1.25rem;font-weight:700;color:#ffffff;margin:0 0 6px;line-height:1.2}
#wcw-modal p{font-size:.86rem;color:rgba(236,236,244,.65);margin:0 0 18px;line-height:1.45}
#wcw-name,#wcw-val{width:100%;background:#151a28;border:1.5px solid rgba(255,255,255,.12);border-radius:12px;color:#ECECF4;font-family:'Inter',system-ui,-apple-system,sans-serif;font-size:.95rem;padding:12px 14px;box-sizing:border-box;margin-bottom:12px;outline:none;transition:border-color .2s,box-shadow .2s}
#wcw-name:focus,#wcw-val:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.25)}
#wcw-name::placeholder,#wcw-val::placeholder{color:rgba(236,236,244,.35)}
.wcw-types{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}
.wcw-type{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border:1.5px solid rgba(255,255,255,.1);border-radius:12px;cursor:pointer;font-size:.72rem;font-weight:600;color:rgba(236,236,244,.6);transition:all .2s;background:#151a28}
.wcw-type:hover{border-color:rgba(124,92,255,.5);color:#ECECF4}
.wcw-type.active{border-color:#7C5CFF;background:rgba(124,92,255,.18);color:#ffffff;box-shadow:0 0 12px rgba(124,92,255,.3)}
.wcw-type span{font-size:1.25rem}
#wcw-submit{width:100%;padding:14px;background:linear-gradient(100deg,#7C5CFF,#00E5FF);color:#04040a;border:none;border-radius:99px;font-family:'Inter',system-ui,-apple-system,sans-serif;font-weight:800;font-size:.92rem;letter-spacing:.02em;cursor:pointer;transition:opacity .2s,transform .2s,box-shadow .2s;box-shadow:0 4px 20px rgba(124,92,255,.4)}
#wcw-submit:hover{opacity:.95;transform:translateY(-1px);box-shadow:0 8px 28px rgba(124,92,255,.6)}
#wcw-submit:disabled{opacity:.5;cursor:not-allowed;transform:none}
#wcw-success{display:none;text-align:center;padding:20px 0}
#wcw-success .wcw-check{width:56px;height:56px;border-radius:50%;background:rgba(0,229,255,.12);border:1.5px solid rgba(0,229,255,.4);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.6rem;color:#00E5FF}
#wcw-success h4{font-family:'Unbounded','Inter',sans-serif;font-size:1.1rem;color:#ECECF4;margin:0 0 8px}
#wcw-success p{font-size:.85rem;color:rgba(236,236,244,.6);margin:0}
#wcw-close{position:absolute;top:16px;right:18px;background:none;border:none;color:rgba(236,236,244,.4);font-size:22px;cursor:pointer;line-height:1;padding:4px;transition:color .2s}
#wcw-close:hover{color:#ECECF4}
@media(min-width:540px){
  #wcw-modal{
    top:50%;
    left:50%;
    right:auto;
    bottom:auto;
    transform:translate(-50%,-45%) scale(.96);
    opacity:0;
    border-radius:24px;
    width:400px;
    max-width:92vw;
  }
  #wcw-modal.open{
    transform:translate(-50%,-50%) scale(1);
    opacity:1;
  }
}
`;

  var types = [
    { id: 'phone', icon: '📞', label: 'Телефон', placeholder: '+380...' },
    { id: 'instagram', icon: '📸', label: 'Instagram', placeholder: '@ваш_нік' },
    { id: 'telegram', icon: '✈️', label: 'Telegram', placeholder: '@username' },
    { id: 'other', icon: '💬', label: 'Інше', placeholder: 'Ваш контакт' },
  ];

  var selectedType = 'telegram';

  function initWidget() {
    if (isInitialized || !document.body) return;
    isInitialized = true;

    var style = document.getElementById('wcw-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'wcw-style';
      style.textContent = css;
      document.head.appendChild(style);
    }

    var wrap = document.getElementById('wcw-wrapper');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'wcw-wrapper';
      wrap.innerHTML = `
<button id="wcw-btn" aria-label="Залишити заявку" type="button">
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#04040a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  Залишити заявку
</button>
<div id="wcw-overlay"></div>
<div id="wcw-modal" role="dialog" aria-modal="true" aria-label="Форма зворотного зв'язку">
  <button id="wcw-close" aria-label="Закрити" type="button">✕</button>
  <div id="wcw-form-wrap">
    <h3>Зв'яжіться зі мною</h3>
    <p>Залиште контакт — ми напишемо першими, зазвичай протягом кількох годин.</p>
    <input id="wcw-name" type="text" placeholder="Ваше ім'я (необов'язково)" autocomplete="name">
    <div class="wcw-types">
      ${types.map((t, i) => `<button class="wcw-type${i === 2 ? ' active' : ''}" data-type="${t.id}" data-ph="${t.placeholder}" type="button"><span>${t.icon}</span>${t.label}</button>`).join('')}
    </div>
    <input id="wcw-val" type="text" placeholder="@username" autocomplete="off">
    <button id="wcw-submit" type="button">Надіслати →</button>
  </div>
  <div id="wcw-success">
    <div class="wcw-check">✓</div>
    <h4>Отримали!</h4>
    <p>Ми зв'яжемось з вами найближчим часом.</p>
  </div>
</div>`;
      document.body.appendChild(wrap);
    }

    var btn = document.getElementById('wcw-btn');
    var overlay = document.getElementById('wcw-overlay');
    var closeBtn = document.getElementById('wcw-close');
    var nameEl = document.getElementById('wcw-name');
    var valEl = document.getElementById('wcw-val');
    var submitBtn = document.getElementById('wcw-submit');
    var formWrap = document.getElementById('wcw-form-wrap');
    var successEl = document.getElementById('wcw-success');

    if (btn) btn.addEventListener('click', function () { window.openWowContact(); });
    if (overlay) overlay.addEventListener('click', function () { window.closeWowContact(); });
    if (closeBtn) closeBtn.addEventListener('click', function () { window.closeWowContact(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.closeWowContact();
    });

    document.querySelectorAll('.wcw-type').forEach(function (el) {
      el.addEventListener('click', function () {
        document.querySelectorAll('.wcw-type').forEach(function (e) { e.classList.remove('active'); });
        el.classList.add('active');
        selectedType = el.dataset.type;
        valEl.placeholder = el.dataset.ph;
        valEl.focus();
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var val = valEl.value.trim();
        if (!val) { valEl.focus(); valEl.style.borderColor = 'rgba(255,80,80,.8)'; return; }
        valEl.style.borderColor = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Надсилаємо...';

        var leadPayload = {
          name: nameEl.value.trim() || null,
          contact_type: selectedType,
          contact_value: val,
          source: currentContext ? (SOURCE + ' [' + currentContext + ']') : SOURCE,
        };

        // Save locally
        try {
          var saved = JSON.parse(localStorage.getItem('wow_leads') || '[]');
          saved.push(leadPayload);
          localStorage.setItem('wow_leads', JSON.stringify(saved));
        } catch (e) {}

        // Send to Cloudflare Pages API
        fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload),
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            showSuccess();
          })
          .catch(function () {
            showSuccess();
          });

        function showSuccess() {
          formWrap.style.display = 'none';
          successEl.style.display = 'block';
          setTimeout(function () { window.closeWowContact(); }, 2500);
          nameEl.value = '';
          valEl.value = '';
        }
      });
    }

    // Global click delegate for any button with class .ncta, .btn-p, or data-wow-contact
    document.addEventListener('click', function(e) {
      var target = e.target.closest('.ncta, [data-wow-contact]');
      if (target) {
        e.preventDefault();
        window.openWowContact(target.getAttribute('data-wow-contact') || target.innerText || 'Navbar CTA');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
