/* Wunderwell US – product landing sections */
(function () {
  function initGallery(root) {
    root.querySelectorAll('[data-ww-gallery]').forEach(function (gallery) {
      if (gallery.dataset.wwReady) return;
      gallery.dataset.wwReady = 'true';
      var slides = gallery.querySelectorAll('.ww-gallery__slide');
      var thumbs = gallery.querySelectorAll('.ww-gallery__thumb');
      thumbs.forEach(function (thumb, index) {
        thumb.addEventListener('click', function () {
          slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
          thumbs.forEach(function (t, i) {
            t.classList.toggle('is-active', i === index);
            t.setAttribute('aria-current', i === index ? 'true' : 'false');
          });
        });
      });
    });
  }

  function initModals(root) {
    root.querySelectorAll('[data-ww-modal-open]').forEach(function (btn) {
      if (btn.dataset.wwReady) return;
      btn.dataset.wwReady = 'true';
      var dialog = document.getElementById(btn.dataset.wwModalOpen);
      if (!dialog) return;
      btn.addEventListener('click', function () { dialog.showModal(); });
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog || e.target.closest('[data-ww-modal-close]')) dialog.close();
      });
    });
  }

  function initPlans(root) {
    root.querySelectorAll('[data-ww-buy]').forEach(function (buy) {
      if (buy.dataset.wwReady) return;
      buy.dataset.wwReady = 'true';
      var plans = buy.querySelectorAll('.ww-plan');
      var sellingPlanInput = buy.querySelector('[data-ww-selling-plan]');
      var sectionId = buy.dataset.section;
      var sticky = document.querySelector('[data-ww-sticky="' + sectionId + '"]');

      function update() {
        var selected = buy.querySelector('.ww-plan input:checked');
        plans.forEach(function (plan) {
          plan.classList.toggle('is-selected', plan.contains(selected));
        });
        if (!selected) return;
        var planId = selected.dataset.sellingPlan || '';
        if (sellingPlanInput) {
          sellingPlanInput.value = planId;
          sellingPlanInput.disabled = planId === '';
        }
        if (sticky) {
          var now = sticky.querySelector('[data-ww-sticky-now]');
          var was = sticky.querySelector('[data-ww-sticky-was]');
          var save = sticky.querySelector('[data-ww-sticky-save]');
          var meta = sticky.querySelector('[data-ww-sticky-meta]');
          if (now) now.innerHTML = selected.dataset.priceHtml || '';
          if (was) {
            was.textContent = selected.dataset.compare || '';
            was.hidden = !selected.dataset.compare;
          }
          if (save) {
            save.textContent = selected.dataset.save || '';
            save.hidden = !selected.dataset.save;
          }
          if (meta) meta.textContent = selected.dataset.meta || '';
        }
      }

      plans.forEach(function (plan) {
        plan.querySelector('input').addEventListener('change', update);
      });
      update();
    });
  }

  function initVideos(root) {
    root.querySelectorAll('[data-ww-video]').forEach(function (wrap) {
      if (wrap.dataset.wwReady) return;
      wrap.dataset.wwReady = 'true';
      var video = wrap.querySelector('video');
      var btn = wrap.querySelector('.ww-vreview__sound');
      if (!video || !btn) return;
      var label = btn.querySelector('span');
      var onText = btn.dataset.onText;
      var offText = btn.dataset.offText;
      btn.addEventListener('click', function () {
        video.muted = !video.muted;
        if (!video.muted) video.play();
        label.textContent = video.muted ? offText : onText;
      });
    });
  }

  function initReviewTabs(root) {
    root.querySelectorAll('[data-ww-reviews]').forEach(function (section) {
      if (section.dataset.wwReady) return;
      section.dataset.wwReady = 'true';
      var tabs = section.querySelectorAll('.ww-tab');
      var cards = section.querySelectorAll('.ww-rcard');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var filter = tab.dataset.filter;
          tabs.forEach(function (t) {
            t.classList.toggle('is-active', t === tab);
            t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
          });
          cards.forEach(function (card) {
            var cats = (card.dataset.category || '').split(',');
            card.hidden = !(filter === 'all' || cats.indexOf(filter) !== -1);
          });
        });
      });
    });
  }

  function initSticky(root) {
    root.querySelectorAll('[data-ww-sticky]').forEach(function (sticky) {
      if (sticky.dataset.wwReady) return;
      sticky.dataset.wwReady = 'true';
      var target = document.getElementById('ww-buy-' + sticky.dataset.wwSticky);
      if (!target || !('IntersectionObserver' in window)) return;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          sticky.classList.toggle('is-visible', passed);
          sticky.setAttribute('aria-hidden', passed ? 'false' : 'true');
        });
      });
      observer.observe(target);
    });
  }

  /* Any link to #ww-buy scrolls to the purchase box on the page */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href="#ww-buy"]');
    if (!link) return;
    var buy = document.querySelector('[data-ww-buy]');
    if (!buy) return;
    e.preventDefault();
    buy.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function init(root) {
    root = root || document;
    initGallery(root);
    initModals(root);
    initPlans(root);
    initVideos(root);
    initReviewTabs(root);
    initSticky(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
