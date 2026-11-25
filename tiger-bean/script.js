/* ==========================================================================
   TIGER BEAN | ناب النمر — Shared behaviour
   - Arabic / English switching with RTL / LTR
   - Mobile navigation
   - Product category filtering
   - Accessible accordions
   - WhatsApp order links and contact form
   - Scroll reveal + image fallback
   ========================================================================== */

(function () {
  "use strict";

  var WA_PHONE = "966537529505";
  var LANG_KEY = "tigerbean:lang";
  var NAME_PREFIX = "tigerbean:lang=";

  var productCatalog = {
    ethiopia: {
      ar: { name: "حبوب قهوة إثيوبية (جوجي) 250غ", price: 78 },
      en: { name: "Ethiopian Guji beans, 250g", price: 78 }
    },
    colombia: {
      ar: { name: "حبوب قهوة كولومبية (هويلا) 250غ", price: 72 },
      en: { name: "Colombian Huila beans, 250g", price: 72 }
    },
    "house-blend": {
      ar: { name: "خلطة الإسبريسو الخاصة 250غ", price: 65 },
      en: { name: "House espresso blend, 250g", price: 65 }
    },
    yemen: {
      ar: { name: "حبوب قهوة يمنية (موكا) 250غ", price: 95 },
      en: { name: "Yemeni Mokha beans, 250g", price: 95 }
    },
    v60: {
      ar: { name: "أداة V60 سيراميك — مقاس 02", price: 95 },
      en: { name: "V60 ceramic dripper, size 02", price: 95 }
    },
    kettle: {
      ar: { name: "إبريق غلي ذو عنق إوزة 600 مل", price: 189 },
      en: { name: "Gooseneck kettle, 600ml", price: 189 }
    },
    chemex: {
      ar: { name: "ماكينة Chemex — 6 أكواب", price: 165 },
      en: { name: "Chemex brewer, 6-cup", price: 165 }
    },
    server: {
      ar: { name: "إبريق تقديم زجاجي 500 مل", price: 75 },
      en: { name: "Glass server, 500ml", price: 75 }
    },
    "grinder-hand": {
      ar: { name: "مطحنة يدوية احترافية", price: 245 },
      en: { name: "Hand grinder pro", price: 245 }
    },
    "grinder-electric": {
      ar: { name: "مطحنة كهربائية مخروطية", price: 520 },
      en: { name: "Electric conical grinder", price: 520 }
    },
    cups: {
      ar: { name: "طقم أكواب سيراميك — قطعتان", price: 120 },
      en: { name: "Ceramic cup set, 2 pieces", price: 120 }
    },
    tamper: {
      ar: { name: "تامبر باريستا 58 مم", price: 110 },
      en: { name: "Barista tamper, 58mm", price: 110 }
    }
  };

  var planCatalog = {
    start: {
      ar: { name: "اشتراك البداية", price: 69 },
      en: { name: "Starter plan", price: 69 }
    },
    pro: {
      ar: { name: "اشتراك المحترفين", price: 119 },
      en: { name: "Professional plan", price: 119 }
    },
    elite: {
      ar: { name: "اشتراك النخبة", price: 169 },
      en: { name: "Elite plan", price: 169 }
    }
  };

  var formMessages = {
    ar: {
      name: "الاسم لازم يكون حرفين على الأقل.",
      phone: "أدخل رقم جوال سعودي صحيح، مثال: 0537529505.",
      message: "اكتب رسالة من 10 أحرف على الأقل.",
      success: "تم تجهيز رسالتك. أكمل الإرسال من نافذة واتساب.",
      fallback: "إذا لم تُفتح نافذة واتساب، اضغط هنا.",
      intro: "رسالة جديدة من موقع ناب النمر:",
      nameLabel: "الاسم",
      phoneLabel: "رقم الجوال",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة"
    },
    en: {
      name: "Please enter at least two characters for your name.",
      phone: "Enter a valid Saudi mobile number, e.g. 0537529505.",
      message: "Please write a message of at least 10 characters.",
      success: "Your message is ready. Complete sending it in WhatsApp.",
      fallback: "If the WhatsApp window did not open, tap here.",
      intro: "New message from the NAB AL NIMR website:",
      nameLabel: "Name",
      phoneLabel: "Mobile",
      openMenu: "Open menu",
      closeMenu: "Close menu"
    }
  };

  function getLang() {
    return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "ar";
  }

  function waLink(message) {
    return "https://wa.me/" + WA_PHONE + "?text=" + encodeURIComponent(message);
  }

  function generalMessage(lang) {
    return lang === "ar"
      ? "السلام عليكم، وصلت لكم من موقع ناب النمر وأرغب بالاستفسار."
      : "Hello, I found the NAB AL NIMR website and would like to ask a question.";
  }

  function subscriptionMessage(lang) {
    return lang === "ar"
      ? "السلام عليكم، أرغب بطلب اشتراك قهوة شهري. أحتاج مساعدة في اختيار نوع البن والوزن وتكرار التوصيل."
      : "Hello, I would like to order a monthly coffee subscription. I need help choosing the bean, weight and delivery frequency.";
  }

  function productMessage(id, lang) {
    var product = productCatalog[id];
    if (!product) {
      return generalMessage(lang);
    }
    var item = product[lang];
    if (lang === "ar") {
      return (
        "السلام عليكم، أرغب بطلب: " +
        item.name +
        " — " +
        item.price +
        " ر.س.\nهل المنتج متوفر؟"
      );
    }
    return (
      "Hello, I would like to order: " +
      item.name +
      " — " +
      item.price +
      " SAR.\nIs it available?"
    );
  }

  function planMessage(id, lang) {
    var plan = planCatalog[id];
    if (!plan) {
      return subscriptionMessage(lang);
    }
    var item = plan[lang];
    if (lang === "ar") {
      return (
        "السلام عليكم، أرغب بالاشتراك في " +
        item.name +
        " (" +
        item.price +
        " ر.س شهريًا).\nأرجو تأكيد تفاصيل نوع البن والوزن والتوصيل."
      );
    }
    return (
      "Hello, I would like to join the " +
      item.name +
      " (" +
      item.price +
      " SAR per month).\nPlease confirm the bean, weight and delivery details."
    );
  }

  function messageForKey(key, lang) {
    if (key === "general") {
      return generalMessage(lang);
    }
    if (key === "subscribe") {
      return subscriptionMessage(lang);
    }
    if (planCatalog[key]) {
      return planMessage(key, lang);
    }
    return productMessage(key, lang);
  }

  function updateWhatsAppLinks(lang) {
    document.querySelectorAll("[data-wa]").forEach(function (link) {
      var key = link.getAttribute("data-wa");
      link.setAttribute("href", waLink(messageForKey(key, lang)));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function updateMetaContent(selector, lang) {
    document.querySelectorAll(selector).forEach(function (element) {
      var value = element.getAttribute(lang === "ar" ? "data-ar" : "data-en");
      if (value) {
        if (element.tagName === "META") {
          element.setAttribute("content", value);
        } else {
          element.textContent = value;
        }
      }
    });
  }

  function updateNavToggleLabel() {
    var lang = getLang();
    var toggle = document.getElementById("navToggle");
    if (!toggle) {
      return;
    }
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    var label = isOpen
      ? formMessages[lang].closeMenu
      : formMessages[lang].openMenu;
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("data-aria-ar", formMessages.ar[isOpen ? "closeMenu" : "openMenu"]);
    toggle.setAttribute("data-aria-en", formMessages.en[isOpen ? "closeMenu" : "openMenu"]);
  }

  function persistLanguage(lang) {
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch (error) {
      /* localStorage can be unavailable on file:// in some browsers */
    }
    try {
      window.name = NAME_PREFIX + lang;
      document.cookie = LANG_KEY + "=" + lang + "; max-age=31536000; path=/; SameSite=Lax";
    } catch (error) {
      /* ignore */
    }
  }

  function applyLanguage(lang, options) {
    options = options || {};
    var root = document.documentElement;

    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    root.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-aria-ar]").forEach(function (element) {
      var label = element.getAttribute(
        lang === "ar" ? "data-aria-ar" : "data-aria-en"
      );
      if (label) {
        element.setAttribute("aria-label", label);
      }
    });

    document.querySelectorAll("[data-ph-ar]").forEach(function (element) {
      var placeholder = element.getAttribute(
        lang === "ar" ? "data-ph-ar" : "data-ph-en"
      );
      if (placeholder) {
        element.setAttribute("placeholder", placeholder);
      }
    });

    document.querySelectorAll("img[data-alt-ar]").forEach(function (image) {
      var alt = image.getAttribute(lang === "ar" ? "data-alt-ar" : "data-alt-en");
      if (alt) {
        image.setAttribute("alt", alt);
      }
    });

    updateMetaContent("title[data-ar]", lang);
    updateMetaContent('meta[name="description"]', lang);
    updateMetaContent('meta[property="og:title"]', lang);
    updateMetaContent('meta[property="og:description"]', lang);
    updateMetaContent('meta[property="og:locale"]', lang);
    updateMetaContent('meta[name="twitter:title"]', lang);
    updateMetaContent('meta[name="twitter:description"]', lang);

    document.querySelectorAll(".lang-opt").forEach(function (option) {
      var active = option.getAttribute("data-lang-opt") === lang;
      option.classList.toggle("is-active", active);
    });

    var langToggle = document.getElementById("langToggle");
    if (langToggle) {
      langToggle.setAttribute(
        "aria-label",
        lang === "ar"
          ? "AR / EN — Switch language to English"
          : "AR / EN — التبديل إلى اللغة العربية"
      );
    }

    updateNavToggleLabel();
    updateWhatsAppLinks(lang);

    if (options.persist !== false) {
      persistLanguage(lang);
    }
  }

  function initLanguage() {
    var saved = null;
    try {
      saved = window.localStorage.getItem(LANG_KEY);
    } catch (error) {
      saved = null;
    }

    if (saved !== "ar" && saved !== "en") {
      try {
        if (window.name && window.name.indexOf(NAME_PREFIX) === 0) {
          saved = window.name.slice(NAME_PREFIX.length);
        }
      } catch (error) {
        saved = null;
      }
    }

    if (saved !== "ar" && saved !== "en") {
      saved = "ar";
    }

    applyLanguage(saved, { persist: true });

    var toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        applyLanguage(getLang() === "ar" ? "en" : "ar");
      });
    }
  }

  function initHeader() {
    var header = document.querySelector(".site-header");
    var navToggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");

    function onScroll() {
      if (header) {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!navToggle || !nav) {
      return;
    }

    function setMenu(open) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      updateNavToggleLabel();
    }

    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        navToggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (
        isOpen &&
        !nav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        setMenu(false);
      }
    });

    var desktopQuery = window.matchMedia("(min-width: 981px)");
    function handleDesktop(event) {
      if (event.matches) {
        setMenu(false);
      }
    }
    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleDesktop);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleDesktop);
    }
  }

  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!items.length) {
      return;
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initFilters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(
      document.querySelectorAll("#catalogGrid [data-category]")
    );
    var count = document.getElementById("resultCount");

    if (!buttons.length || !cards.length) {
      return;
    }

    function applyFilter(category) {
      var visible = 0;

      cards.forEach(function (card) {
        var show = category === "all" || card.getAttribute("data-category") === category;
        card.hidden = !show;
        card.classList.remove("is-filtering");
        if (show) {
          /* restart the small entrance animation */
          void card.offsetWidth;
          card.classList.add("is-filtering");
          visible += 1;
        }
      });

      buttons.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          button.getAttribute("data-filter") === category ? "true" : "false"
        );
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.getAttribute("data-filter") || "all");
      });
    });

    applyFilter("all");
  }

  function initAccordions() {
    document.querySelectorAll(".accordion-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        var panelId = button.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        var expanded = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (panel) {
          panel.hidden = expanded;
        }
      });
    });
  }

  function normalisePhone(value) {
    return value.replace(/[\s\-()]/g, "");
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) {
      return;
    }

    var nameInput = document.getElementById("contactName");
    var phoneInput = document.getElementById("contactPhone");
    var messageInput = document.getElementById("contactMessage");
    var successBox = document.getElementById("formSuccess");

    if (!nameInput || !phoneInput || !messageInput || !successBox) {
      return;
    }

    var nameError = document.getElementById("nameError");
    var phoneError = document.getElementById("phoneError");
    var messageError = document.getElementById("messageError");

    function setError(input, errorElement, message) {
      input.setAttribute("aria-invalid", "true");
      if (errorElement) {
        errorElement.textContent = message;
      }
    }

    function clearError(input, errorElement) {
      input.removeAttribute("aria-invalid");
      if (errorElement) {
        errorElement.textContent = "";
      }
    }

    [nameInput, phoneInput, messageInput].forEach(function (input) {
      input.addEventListener("input", function () {
        clearError(
          input,
          input === nameInput ? nameError : input === phoneInput ? phoneError : messageError
        );
        successBox.hidden = true;
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var lang = getLang();
      var copy = formMessages[lang];
      var name = nameInput.value.trim();
      var phone = phoneInput.value.trim();
      var message = messageInput.value.trim();
      var firstInvalid = null;

      clearError(nameInput, nameError);
      clearError(phoneInput, phoneError);
      clearError(messageInput, messageError);

      if (name.length < 2) {
        setError(nameInput, nameError, copy.name);
        firstInvalid = firstInvalid || nameInput;
      }

      if (!/^(?:\+?966|0)?5\d{8}$/.test(normalisePhone(phone))) {
        setError(phoneInput, phoneError, copy.phone);
        firstInvalid = firstInvalid || phoneInput;
      }

      if (message.length < 10) {
        setError(messageInput, messageError, copy.message);
        firstInvalid = firstInvalid || messageInput;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        successBox.hidden = true;
        return;
      }

      var text =
        lang === "ar"
          ? "السلام عليكم، " +
            copy.intro +
            "\n\n" +
            copy.nameLabel +
            ": " +
            name +
            "\n" +
            copy.phoneLabel +
            ": " +
            phone +
            "\n\n" +
            message
          : "Hello, " +
            copy.intro +
            "\n\n" +
            copy.nameLabel +
            ": " +
            name +
            "\n" +
            copy.phoneLabel +
            ": " +
            phone +
            "\n\n" +
            message;

      var url = waLink(text);

      var helper = document.createElement("a");
      helper.href = url;
      helper.target = "_blank";
      helper.rel = "noopener noreferrer";
      document.body.appendChild(helper);
      helper.click();
      helper.remove();

      successBox.hidden = false;
      successBox.textContent = copy.success + " ";

      var fallback = document.createElement("a");
      fallback.href = url;
      fallback.target = "_blank";
      fallback.rel = "noopener noreferrer";
      fallback.textContent = copy.fallback;
      successBox.appendChild(fallback);

      form.reset();
      successBox.focus({ preventScroll: true });
    });
  }

  function initImageFallbacks() {
    var wrappers =
      ".media, .product-media, .hero-frame, .story-img, .sub-photo, .collage-img, .about-hero-frame, .about-band, .map-card, .contact-icon";

    document.querySelectorAll("img").forEach(function (image) {
      function showFallback() {
        var wrapper = image.closest(wrappers);
        if (!wrapper || wrapper.querySelector(".img-fallback-label")) {
          return;
        }
        wrapper.classList.add("img-fallback");
        var fallback = document.createElement("span");
        fallback.className = "img-fallback-label";
        fallback.setAttribute("aria-hidden", "true");
        fallback.textContent = "TIGER BEAN";
        wrapper.appendChild(fallback);
      }

      if (image.complete && image.naturalWidth === 0) {
        showFallback();
      }
      image.addEventListener("error", showFallback, { once: true });
    });
  }

  function initYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (element) {
      element.textContent = year;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLanguage();
    initHeader();
    initReveal();
    initFilters();
    initAccordions();
    initContactForm();
    initImageFallbacks();
    initYear();
  });
})();
