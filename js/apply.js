/* ==========================================================================
   Apply Quest — Immersive gamified form with localStorage persistence
   ========================================================================== */
(function () {
  "use strict";

  /* ---- State ----------------------------------------------------------- */
  var current = 0;
  var TOTAL_SLIDES = 16;
  var TOTAL_STEPS  = 15;
  var formData = {};
  var skills = {};

  /* ---- DOM refs -------------------------------------------------------- */
  var slides, orbs, progressFill;
  var prevBtn, nextBtn, submitBtn, navCounter, questNav;
  var successOverlay, confettiCanvas;

  /* ---- Init ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    slides       = document.querySelectorAll(".quest-slide");
    orbs         = document.querySelectorAll(".quest-orb");
    progressFill = document.getElementById("progressFill");
    prevBtn      = document.getElementById("prevSlide");
    nextBtn      = document.getElementById("nextSlide");
    submitBtn    = document.getElementById("submitQuest");
    navCounter   = document.getElementById("navCounter");
    questNav     = document.getElementById("questNav");
    successOverlay = document.getElementById("questSuccess");
    confettiCanvas = document.getElementById("confettiCanvas");

    if (slides && slides.length > 0) {
      TOTAL_SLIDES = slides.length;
      TOTAL_STEPS = TOTAL_SLIDES - 1;
    }

    // Hide bottom nav until quest starts
    questNav.style.display = "none";

    initParticles();
    initStartButton();
    initNav();
    initCardSelects();
    initChipSelects();
    initXpSelects();
    initCommitCards();
    initSkillBars();
    initSlider();
    initSpeechToText();
    initInputCleaners();
    updateUI();
  });

  /* ---- Start Button ---------------------------------------------------- */
  function initStartButton() {
    var btn = document.getElementById("startQuest");
    if (!btn) return;
    btn.addEventListener("click", function () {
      goToSlide(1);
      questNav.style.display = "";
    });
  }

  /* ---- Navigation ------------------------------------------------------ */
  function initNav() {
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (current > 1) goToSlide(current - 1);
        else if (current === 1) {
          goToSlide(0);
          questNav.style.display = "none";
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (validateSlide(current)) {
          if (current < TOTAL_SLIDES - 1) {
            goToSlide(current + 1);
          }
        }
      });
    }

    submitBtn.addEventListener("click", function () {
      if (validateSlide(current)) {
        submitForm();
      }
    });

    // Swipe & Keyboard navigation
    var touchStartX = null;
    var touchEndX = null;
    var touchStartY = null;
    var touchEndY = null;

    function handleDragStart(e) {
      if (e.target.closest('input, textarea, button, .card-option, .chip, .scale-slider, .mic-btn, a')) {
        touchStartX = null;
        touchStartY = null;
        return;
      }
      touchStartX = e.type.includes('mouse') ? e.screenX : e.changedTouches[0].screenX;
      touchStartY = e.type.includes('mouse') ? e.screenY : e.changedTouches[0].screenY;
    }

    function handleDragEnd(e) {
      if (touchStartX === null || touchStartY === null) return;
      touchEndX = e.type.includes('mouse') ? e.screenX : e.changedTouches[0].screenX;
      touchEndY = e.type.includes('mouse') ? e.screenY : e.changedTouches[0].screenY;
      handleSwipe();
      touchStartX = null;
      touchStartY = null;
    }

    document.addEventListener("touchstart", handleDragStart, {passive: true});
    document.addEventListener("touchend", handleDragEnd, {passive: true});
    document.addEventListener("mousedown", handleDragStart, {passive: true});
    document.addEventListener("mouseup", handleDragEnd, {passive: true});

    let wheelDebounce = false;
    document.addEventListener("wheel", function(e) {
      if (e.target.closest('input, textarea, button, .card-option, .chip, .scale-slider, .mic-btn, a')) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
        if (wheelDebounce) return;
        wheelDebounce = true;
        // e.deltaX > 0 means swipe left (next)
        if (e.deltaX > 0) {
          if (validateSlide(current) && current < TOTAL_SLIDES - 1) {
            goToSlide(current + 1);
          }
        } else {
          if (current > 1) {
            goToSlide(current - 1);
          } else if (current === 1) {
            goToSlide(0);
            questNav.style.display = "none";
          }
        }
        setTimeout(() => wheelDebounce = false, 800);
      }
    }, {passive: true});

    function handleSwipe() {
      var dx = touchEndX - touchStartX;
      var dy = touchEndY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) {
          // Swipe left -> Next
          if (validateSlide(current) && current < TOTAL_SLIDES - 1) {
            goToSlide(current + 1);
          }
        } else {
          // Swipe right -> Prev
          if (current > 1) {
            goToSlide(current - 1);
          } else if (current === 1) {
            goToSlide(0);
            questNav.style.display = "none";
          }
        }
      }
    }

    document.addEventListener("keydown", function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === "ArrowRight") {
        if (validateSlide(current) && current < TOTAL_SLIDES - 1) {
          goToSlide(current + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (current > 1) goToSlide(current - 1);
        else if (current === 1) {
          goToSlide(0);
          questNav.style.display = "none";
        }
      }
    });
  }

  function getDynamicTextForSlide(idx) {
    var name = document.getElementById("q_name") ? document.getElementById("q_name").value.trim() : "";
    var firstName = name ? name.split(" ")[0] : "there";
    
    function getVal(field) { return formData[field] || ""; }
    function getOther(field) {
       var el = document.getElementById(field + "_other");
       return el ? el.value.trim() : "";
    }
    
    switch (idx) {
      case 2: 
        return "Great to meet you, " + firstName + "! Let's see if that phone number is real later. Just kidding! Which one describes you best?";
      case 3: 
        var status = getVal("q_status");
        if (status === "IT Student") return "Ah, an IT Student! Have you tried turning yourself off and on again? What event responsibilities excite you?";
        if (status === "Business Student") return "A Business Student! Let me guess, you have a pitch deck ready? What event responsibilities excite you?";
        if (status === "Alumni") return "An Alumni! Back to relive the glory days? We love it. What event responsibilities excite you?";
        if (status === "Not Member") return "Not a member yet? We'll fix that soon enough. What event responsibilities excite you?";
        if (getOther("q_status")) return "Interesting status! You do you. What event responsibilities excite you?";
        return "Awesome! Tell me, " + firstName + ", what event responsibilities excite you?";
      case 4: 
        var resps = getVal("q_responsibilities");
        if (!resps) resps = [];
        if (resps.includes("Planning Events")) return "A planner! We desperately need people who know what a calendar is. Where do you see yourself contributing?";
        if (resps.includes("Managing Budgets") || resps.includes("Getting Sponsorships")) return "Handling the money? Please tell me you're better at math than I am. Where do you see yourself contributing?";
        return "Love the ambition! We'll definitely keep you busy. Where do you see yourself contributing?";
      case 5: 
        var invs = getVal("q_involvement");
        if (!invs) invs = [];
        if (invs.includes("Main Stage Anchoring") || invs.includes("Guest Hosting")) return "Ooo, somebody likes the spotlight! 🌟 Do you lean towards planning strategy or hands-on execution?";
        if (invs.includes("Technical Support")) return "Tech Support! Our literal savior when the mic stops working. Do you lean towards planning strategy or hands-on execution?";
        return "Sounds like a solid plan. We need all hands on deck! Do you lean towards planning strategy or hands-on execution?";
      case 6: 
        var sideVal = parseInt(document.getElementById("q_side").value);
        if (sideVal < 30) return "A mastermind! Sitting in the shadows pulling the strings. Got it. Any prior event or hackathon experience?";
        if (sideVal > 70) return "An action hero! Less talking, more doing. Any prior event or hackathon experience?";
        return "A true all-rounder! Perfectly balanced, as all things should be. Any prior event or hackathon experience?";
      case 7: 
        var exp = document.getElementById("q_experience").value.trim();
        if (exp.length > 15) return "Wow, sounds like quite the journey! Do you have any sponsorship experience or want to try getting sponsors?";
        return "Got it. Everyone starts somewhere! Do you have any sponsorship experience or want to try getting sponsors?";
      case 8: 
        var spons = document.getElementById("q_sponsorship").value.trim();
        if (spons.length > 5) return "Noted! Money makes the world go round. Okay, rate your overall event management or anchoring level.";
        return "Fair enough! Okay, rate your overall event management or anchoring level.";
      case 9: 
        var anc = getVal("q_anchoring");
        if (anc === "Entry Level") return "A rookie! Don't worry, we'll train you like a Jedi. Let's do a quick skills check.";
        if (anc === "Some Experience") return "A seasoned warrior! You've seen some things. Let's do a quick skills check.";
        if (anc === "Expert") return "A legend walks among us! Please don't steal my job. Let's do a quick skills check.";
        return "Let's do a quick skills check. Tap to rate your level.";
      case 10: 
        return "I see those skill bars! Don't worry, I won't test you... yet. How many hours a week can you commit?";
      case 11: 
        var hrs = getVal("q_hours");
        if (hrs.includes("5")) return "5+ hours?! Are you sure you still sleep? We love the dedication! Got any cool event ideas for the community?";
        if (hrs.includes("3")) return "3-5 hours. Now we're talking! Got any cool event ideas for the community?";
        return "Hey, every little bit helps! Got any cool event ideas for the community?";
      case 12: 
        var ideas = document.getElementById("q_ideas").value.trim();
        if (ideas.length > 15) return "Oooh, I'll definitely pitch those ideas to the team! Do you know anyone outside IRC with event experience?";
        return "Good to know! Do you know anyone outside IRC with event experience?";
      case 13:
        return "Tell us a little more about yourself! What makes you unique?";
      case 14:
        return "Almost at the finish line! Do you have any questions for us?";
      case 15: 
        return "You made it, " + firstName + "! Review your application below and click Launch when ready.";
      default: 
        return null;
    }
  }

  function goToSlide(idx) {
    if (idx === current) return;

    var isNext = idx > current;
    var oldSlide = slides[current];
    var newSlide = slides[idx];

    // Animate out
    oldSlide.classList.remove("is-active", "anim-enter-next", "anim-enter-prev");
    oldSlide.classList.add(isNext ? "anim-exit-next" : "anim-exit-prev");

    setTimeout(function () {
      oldSlide.classList.remove("anim-exit-next", "anim-exit-prev");

      // Animate in
      newSlide.classList.add("is-active", isNext ? "anim-enter-next" : "anim-enter-prev");
      current = idx;
      updateUI();

      // Trigger typewriter on new slide
      var tw = newSlide.querySelector(".typewriter:not(.done)");
      if (tw) {
        var dynamicText = getDynamicTextForSlide(idx);
        if (dynamicText) tw.setAttribute("data-text", dynamicText);
        runTypewriter(tw);
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 350);
  }

  function updateUI() {
    // Orbs
    orbs.forEach(function (orb, i) {
      orb.classList.remove("is-active", "is-done");
      if (i < current) orb.classList.add("is-done");
      if (i === current) {
        orb.classList.add("is-active");
        // Scroll the orb into view (horizontally centered)
        orb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });

    // Progress fill
    var pct = current === 0 ? 0 : ((current) / (TOTAL_SLIDES - 1)) * 100;
    progressFill.style.width = pct + "%";

    if (questNav) {
      questNav.style.display = current === 0 ? "none" : "";
    }

    // Buttons
    if (prevBtn) prevBtn.disabled = current === 0;

    if (current === TOTAL_SLIDES - 1) {
      if (nextBtn) nextBtn.style.display = "none";
      submitBtn.style.display = "";
      if (document.getElementById("swipeHint")) document.getElementById("swipeHint").style.display = "none";
      if (document.getElementById("staticSwipeHint")) document.getElementById("staticSwipeHint").style.display = "none";
      buildReview();
    } else {
      if (nextBtn) nextBtn.style.display = "";
      submitBtn.style.display = "none";
      if (current < 2) {
        if (document.getElementById("swipeHint")) document.getElementById("swipeHint").style.display = "flex";
        if (document.getElementById("staticSwipeHint")) document.getElementById("staticSwipeHint").style.display = "none";
      } else {
        if (document.getElementById("swipeHint")) document.getElementById("swipeHint").style.display = "none";
        if (document.getElementById("staticSwipeHint")) document.getElementById("staticSwipeHint").style.display = "block";
      }
    }

    // Counter
    if (navCounter) {
      if (current >= 1) {
        navCounter.textContent = current + " / " + TOTAL_STEPS;
      } else {
        navCounter.textContent = "";
      }
    }
  }



  /* ---- Typewriter Effect ----------------------------------------------- */
  function runTypewriter(el) {
    var text = el.getAttribute("data-text");
    if (!text) return;
    el.style.display = "grid";
    el.innerHTML = '<span style="visibility:hidden; grid-area:1/1; pointer-events:none;">' + text + '</span><span class="tw-text" style="grid-area:1/1;"></span>';
    el.classList.remove("done");

    var twText = el.querySelector('.tw-text');

    var i = 0;
    var speed = 25;
    function type() {
      if (i < text.length) {
        twText.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        el.classList.add("done");
      }
    }
    type();
  }

  /* ---- Speech to Text (Global) ----------------------------------------- */
  function initSpeechToText() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    var recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    var isRecording = false;
    var originalText = "";
    var activeInputEl = null;

    // Create STT Controls Container
    var sttControls = document.createElement("div");
    sttControls.className = "stt-controls is-disabled";
    
    // Create Global Lang Button
    var globalLangBtn = document.createElement("button");
    globalLangBtn.type = "button";
    globalLangBtn.className = "global-lang-btn";
    globalLangBtn.title = "Toggle Language";
    globalLangBtn.innerHTML = '🇺🇸';
    
    // Create Global Mic Button
    var globalMicBtn = document.createElement("button");
    globalMicBtn.type = "button";
    globalMicBtn.className = "global-mic-btn";
    globalMicBtn.title = "Click to Speak";
    globalMicBtn.innerHTML = '🎤';

    sttControls.appendChild(globalLangBtn);
    sttControls.appendChild(globalMicBtn);
    document.body.appendChild(sttControls);

    // Keep input focused when tapping the container gap
    sttControls.addEventListener("mousedown", function(e) { e.preventDefault(); });
    sttControls.addEventListener("touchstart", function(e) { e.preventDefault(); }, {passive: false});
    
    // Action Handlers
    var isNepali = false;
    function toggleLang() {
      if (isRecording) {
        recognition.stop();
      }
      isNepali = !isNepali;
      globalLangBtn.innerHTML = isNepali ? '🇳🇵' : '🇺🇸';
      recognition.lang = isNepali ? 'ne-NP' : 'en-US';
    }

    function toggleMic() {
      if (isRecording) {
        recognition.stop();
        return;
      }
      if (activeInputEl) {
        try {
          recognition.start();
        } catch(err) {
          alert("Microphone Error! Ensure you granted mic permissions and are running this on a secure connection (HTTPS).");
          console.error("Speech recognition error", err);
        }
      }
    }

    // Unified Touch/Mouse binding to prevent default (keeps input focused) while executing the action
    var lastTap = 0;
    function bindAction(el, actionFn) {
      function handler(e) {
        e.preventDefault();
        e.stopPropagation();
        var now = Date.now();
        if (now - lastTap < 300) return; // Prevent double-fire from touchstart + mousedown
        lastTap = now;
        actionFn();
      }
      el.addEventListener("mousedown", handler);
      el.addEventListener("touchstart", handler, {passive: false});
    }

    bindAction(globalLangBtn, toggleLang);
    bindAction(globalMicBtn, toggleMic);

    recognition.onstart = function() {
      isRecording = true;
      globalMicBtn.classList.add("is-recording");
      globalMicBtn.innerHTML = '🛑';
      if (activeInputEl) {
        originalText = activeInputEl.value.trim();
        if (originalText.length > 0) originalText += " ";
      }
    };

    recognition.onresult = function(e) {
      if (!activeInputEl) return;
      var transcript = "";
      for (var i = e.resultIndex; i < e.results.length; ++i) {
        transcript += e.results[i][0].transcript;
      }
      
      var displayValue = originalText + transcript;
      
      // Cleanups
      if (activeInputEl.tagName.toLowerCase() === 'input') {
        displayValue = displayValue.replace(/\.+$/, "").trim();
        if (activeInputEl.type === 'email' || activeInputEl.type === 'tel') {
          displayValue = displayValue.replace(/\s+/g, '');
          if (activeInputEl.type === 'email') {
            displayValue = displayValue.toLowerCase().replace(/at/g, '@').replace(/dot/g, '.');
          }
        }
      }

      activeInputEl.value = displayValue;
      activeInputEl.dispatchEvent(new Event("input")); // Triggers visual updates & mutual exclusivity
    };

    recognition.onend = function() {
      isRecording = false;
      globalMicBtn.classList.remove("is-recording");
      globalMicBtn.innerHTML = '🎤';
    };
    
    recognition.onerror = function(e) {
      isRecording = false;
      globalMicBtn.classList.remove("is-recording");
      globalMicBtn.innerHTML = '🎤';
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        alert("Microphone access denied! Please allow microphone permissions in your browser settings.");
      } else {
        console.error("Speech recognition error: ", e.error);
      }
    };

    // Bind Focus/Blur Events to all valid text inputs
    document.querySelectorAll(".floating-field textarea, .floating-field input:not([type='range']):not([type='radio']):not([type='checkbox'])").forEach(function(inputEl) {
      inputEl.addEventListener("focus", function() {
        if (isRecording && activeInputEl !== this) {
          recognition.stop(); // Stop recording if they switch fields
        }
        activeInputEl = this;
        
        // Dynamically attach controls to the focused field to avoid mobile keyboard overlap
        var field = this.closest(".floating-field");
        if (field) {
          field.appendChild(sttControls);
        }
        
        requestAnimationFrame(function() {
          sttControls.classList.remove("is-disabled");
        });
      });

      inputEl.addEventListener("blur", function() {
        setTimeout(function() {
          if (document.activeElement !== activeInputEl && !isRecording) {
            sttControls.classList.add("is-disabled");
          }
        }, 150);
      });
    });
  }

  /* ---- Auto-resize Textareas & Clean Inputs --------------------------- */
  function initInputCleaners() {
    document.querySelectorAll("textarea").forEach(function(textarea) {
      function resize() {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
      textarea.addEventListener("input", resize);
      setTimeout(resize, 100);
    });

    document.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], textarea").forEach(function(input) {
      // Add Clear Button logic
      var field = input.closest(".floating-field");
      if (field) {
        var clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "clear-btn";
        clearBtn.title = "Clear Text";
        clearBtn.innerHTML = '✖';
        field.appendChild(clearBtn);

        function toggleClearBtn() {
          if (input.value.length > 0) {
            clearBtn.classList.add("is-visible");
          } else {
            clearBtn.classList.remove("is-visible");
          }
        }

        clearBtn.addEventListener("click", function(e) {
          e.preventDefault();
          input.value = "";
          input.dispatchEvent(new Event("input"));
          input.focus();
        });

        input.addEventListener("input", toggleClearBtn);
        toggleClearBtn();
      }

      if (input.tagName.toLowerCase() === 'input') {
        input.addEventListener("blur", function() {
          if (this.value) {
            var val = this.value.replace(/\.+$/, "").trim();
            if (this.type === 'email' || this.type === 'tel') {
              val = val.replace(/\s+/g, '');
            }
            this.value = val;
            this.dispatchEvent(new Event("input"));
          }
        });
      }
    });
  }

  /* ---- Card Selects (single) ------------------------------------------- */
  function initCardSelects() {
    document.querySelectorAll(".card-select").forEach(function (group) {
      group.querySelectorAll(".card-option").forEach(function (card) {
        card.addEventListener("click", function () {
          group.querySelectorAll(".card-option").forEach(function (c) { c.classList.remove("is-selected"); });
          card.classList.add("is-selected");
          group.classList.remove("has-error");
          formData[group.dataset.field] = card.dataset.value;
          
          // Mutual Exclusivity: Clear associated "Other" input if a predefined option is clicked
          var otherInput = document.getElementById(group.dataset.field + "_other");
          if (otherInput) {
            otherInput.value = "";
            otherInput.dispatchEvent(new Event("input"));
          }
        });
      });
      
      // Mutual Exclusivity: Clear predefined options if user types in the "Other" input
      var otherInput = document.getElementById(group.dataset.field + "_other");
      if (otherInput) {
        otherInput.addEventListener("input", function() {
          if (this.value.trim().length > 0) {
            group.querySelectorAll(".card-option").forEach(function (c) { c.classList.remove("is-selected"); });
            formData[group.dataset.field] = null;
          }
        });
      }
    });
  }

  /* ---- Chip Selects (multi) -------------------------------------------- */
  function initChipSelects() {
    document.querySelectorAll(".chip-select").forEach(function (group) {
      group.querySelectorAll(".chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
          chip.classList.toggle("is-selected");
          group.classList.remove("has-error");
          var selected = [];
          group.querySelectorAll(".chip.is-selected").forEach(function (c) {
            selected.push(c.dataset.value);
          });
          formData[group.dataset.field] = selected;
        });
      });
    });
  }

  /* ---- XP Cards (single) ----------------------------------------------- */
  function initXpSelects() {
    document.querySelectorAll(".xp-selector").forEach(function (group) {
      group.querySelectorAll(".xp-card").forEach(function (card) {
        card.addEventListener("click", function () {
          group.querySelectorAll(".xp-card").forEach(function (c) { c.classList.remove("is-selected"); });
          card.classList.add("is-selected");
          group.classList.remove("has-error");
          formData[group.dataset.field] = card.dataset.value;
        });
      });
    });
  }

  /* ---- Commitment Cards (single) --------------------------------------- */
  function initCommitCards() {
    document.querySelectorAll(".commitment-cards").forEach(function (group) {
      group.querySelectorAll(".commit-card").forEach(function (card) {
        card.addEventListener("click", function () {
          group.querySelectorAll(".commit-card").forEach(function (c) { c.classList.remove("is-selected"); });
          card.classList.add("is-selected");
          group.classList.remove("has-error");
          formData[group.dataset.field] = card.dataset.value;
        });
      });
    });
  }

  /* ---- Skill Bars ------------------------------------------------------ */
  function initSkillBars() {
    document.querySelectorAll(".skill-bar").forEach(function (bar) {
      var skillName = bar.dataset.skill;
      bar.querySelectorAll(".skill-bar__seg").forEach(function (seg) {
        seg.addEventListener("click", function () {
          var level = parseInt(seg.dataset.level);
          skills[skillName] = level;
          bar.classList.remove("has-error");
          // Fill segments up to clicked level
          bar.querySelectorAll(".skill-bar__seg").forEach(function (s) {
            s.classList.toggle("is-filled", parseInt(s.dataset.level) <= level);
          });
        });
      });
    });
  }

  /* ---- Slider ---------------------------------------------------------- */
  function initSlider() {
    var slider = document.getElementById("q_side");
    var label = document.getElementById("sideLabel");
    if (!slider || !label) return;
    function update() {
      var v = parseInt(slider.value);
      if (v < 30) label.textContent = "🧠 Planning & Strategy First!";
      else if (v > 70) label.textContent = "⚡ Hands-on Execution Machine!";
      else label.textContent = "🎯 Both — A True All-Rounder!";
    }
    slider.addEventListener("input", update);
    update();
  }

  /* ---- Validation ------------------------------------------------------ */
  function validateSlide(idx) {
    var slide = slides[idx];
    var valid = true;

    if (idx === 1) { // Contact Details
      var nameEl = slide.querySelector("#q_name");
      var phoneEl = slide.querySelector("#q_phone");
      if (!nameEl.value.trim()) {
        nameEl.closest(".floating-field").classList.add("has-error");
        valid = false;
      }
      var phoneVal = phoneEl.value.trim();
      var phoneRegex = /^\d{10}$/; // exactly 10 digits
      if (!phoneVal || !phoneRegex.test(phoneVal)) {
        phoneEl.closest(".floating-field").classList.add("has-error");
        valid = false;
      }
      var emailEl = slide.querySelector("#q_email");
      var emailVal = emailEl.value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        emailEl.closest(".floating-field").classList.add("has-error");
        valid = false;
      }
    }

    if (idx === 2) { // Status
      var statusGroup = slide.querySelector('[data-field="q_status"]');
      if (!formData.q_status) {
        statusGroup.classList.add("has-error");
        valid = false;
      }
    }

    if (idx === 3) { // Responsibilities
      var respGroup = slide.querySelector('[data-field="q_responsibilities"]');
      if (!formData.q_responsibilities || formData.q_responsibilities.length === 0) {
        respGroup.classList.add("has-error");
        valid = false;
      }
    }

    if (idx === 4) { // Involvement
      var invGroup = slide.querySelector('[data-field="q_involvement"]');
      if (!formData.q_involvement || formData.q_involvement.length === 0) {
        invGroup.classList.add("has-error");
        valid = false;
      }
    }

    // idx === 5 is Strategy slider, always has a value

    if (idx === 6) { // Experience
      var expEl = slide.querySelector("#q_experience");
      if (!expEl.value.trim()) {
        expEl.closest(".floating-field").classList.add("has-error");
        valid = false;
      }
    }

    if (idx === 7) { // Sponsorship
      var sponsEl = slide.querySelector("#q_sponsorship");
      if (!sponsEl.value.trim()) {
        sponsEl.closest(".floating-field").classList.add("has-error");
        valid = false;
      }
    }

    if (idx === 8) { // Anchoring Level
      var ancGroup = slide.querySelector('[data-field="q_anchoring"]');
      if (!formData.q_anchoring) {
        ancGroup.classList.add("has-error");
        valid = false;
      }
    }

    if (idx === 9) { // Skills
      var allRated = true;
      slide.querySelectorAll(".skill-bar").forEach(function (bar) {
        if (!skills[bar.dataset.skill]) {
          bar.classList.add("has-error");
          allRated = false;
        }
      });
      if (!allRated) valid = false;
    }

    if (idx === 10) { // Hours commit
      var hoursGroup = slide.querySelector('[data-field="q_hours"]');
      if (!formData.q_hours) {
        hoursGroup.classList.add("has-error");
        valid = false;
      }
    }

    if (idx === 11) { // Ideas
      var ideasEl = slide.querySelector("#q_ideas");
      if (!ideasEl.value.trim()) {
        ideasEl.closest(".floating-field").classList.add("has-error");
        valid = false;
      }
    }

    if (idx === 12) { // Outside Experience
      var outEl = slide.querySelector("#q_outside");
      if (!outEl.value.trim()) {
        outEl.closest(".floating-field").classList.add("has-error");
        valid = false;
      }
    }

    // idx === 13 is Review (no inputs to validate before submit)

    if (!valid) {
      // Shake the slide
      var content = slide.querySelector(".slide-content");
      content.classList.remove("shake");
      void content.offsetWidth; // reflow
      content.classList.add("shake");
    }

    return valid;
  }

  // Clear errors on input
  document.addEventListener("input", function (e) {
    var field = e.target.closest(".floating-field");
    if (field) field.classList.remove("has-error");
  });

  /* ---- Review Card ----------------------------------------------------- */
  function buildReview() {
    var el = document.getElementById("finalReview");
    if (!el) return;

    var name = document.getElementById("q_name").value || "—";
    var phone = document.getElementById("q_phone").value || "—";
    var slider = document.getElementById("q_side");
    var sideVal = parseInt(slider.value);
    var side = sideVal < 30 ? "Planning" : sideVal > 70 ? "Execution" : "Both";

    var statusOther = document.getElementById("q_status_other") ? document.getElementById("q_status_other").value.trim() : "";
    var finalStatus = statusOther ? statusOther : (formData.q_status || "—");

    var respsOther = document.getElementById("q_responsibilities_other") ? document.getElementById("q_responsibilities_other").value.trim() : "";
    var respsArr = formData.q_responsibilities || [];
    if (respsOther && !respsArr.includes(respsOther)) respsArr = respsArr.concat(respsOther);
    var finalResps = respsArr.join(", ") || "—";

    var invsOther = document.getElementById("q_involvement_other") ? document.getElementById("q_involvement_other").value.trim() : "";
    var invsArr = formData.q_involvement || [];
    if (invsOther && !invsArr.includes(invsOther)) invsArr = invsArr.concat(invsOther);
    var finalInvs = invsArr.join(", ") || "—";

    var rows = [
      { l: "Name", v: name },
      { l: "Phone", v: phone },
      { l: "Status", v: finalStatus },
      { l: "Responsibilities", v: finalResps },
      { l: "Involvement", v: finalInvs },
      { l: "Focus", v: side },
      { l: "Experience Level", v: formData.q_anchoring || "—" },
      { l: "Hours/Week", v: formData.q_hours || "—" }
    ];

    var html = '<h3>📋 Your Application Summary</h3>';
    rows.forEach(function (r) {
      html += '<div class="review-row"><span class="label">' + r.l + '</span><span class="value">' + r.v + '</span></div>';
    });
    el.innerHTML = html;
  }

  // ✏️ SUPABASE CONFIG
  var SUPABASE_URL  = "https://mhrivffbzxiwshehslng.supabase.co";
  var SUPABASE_KEY  = "sb_publishable_pcCRGpOfgNYf1g9CwVF4gg_pd3DXyNi";
  var SUPABASE_TABLE = "event_applications";

  var supabase = null;
  function getSupabase() {
    if (supabase) return supabase;
    if (typeof window.supabase !== "undefined" && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return supabase;
  }

  function submitForm() {
    var slider = document.getElementById("q_side");
    var sideVal = parseInt(slider.value);

    var skillLabels = { 1: "Need Training", 2: "Competent", 3: "Expert" };
    var skillsReadable = {};
    for (var sk in skills) {
      if (skills.hasOwnProperty(sk)) skillsReadable[sk] = skillLabels[skills[sk]] || skills[sk];
    }

    var statusOther = document.getElementById("q_status_other") ? document.getElementById("q_status_other").value.trim() : "";
    var finalStatus = statusOther ? statusOther : (formData.q_status || "");

    var respsOther = document.getElementById("q_responsibilities_other") ? document.getElementById("q_responsibilities_other").value.trim() : "";
    var respsArr = formData.q_responsibilities || [];
    if (respsOther && !respsArr.includes(respsOther)) respsArr = respsArr.concat(respsOther);

    var invsOther = document.getElementById("q_involvement_other") ? document.getElementById("q_involvement_other").value.trim() : "";
    var invsArr = formData.q_involvement || [];
    if (invsOther && !invsArr.includes(invsOther)) invsArr = invsArr.concat(invsOther);

    var getMore = function(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    };

    var submission = {
      full_name: document.getElementById("q_name").value.trim(),
      phone: document.getElementById("q_phone").value.trim(),
      email: document.getElementById("q_email").value.trim(),
      college_status: finalStatus,
      college_status_more: getMore("q_status_more"),
      responsibilities: respsArr.join(", "),
      responsibilities_more: getMore("q_responsibilities_more"),
      involvement: invsArr.join(", "),
      involvement_more: getMore("q_involvement_more"),
      plan_vs_execution: sideVal < 30 ? "Planning & Strategy" : sideVal > 70 ? "On-the-ground Execution" : "Both",
      plan_vs_execution_more: getMore("q_side_more"),
      prior_experience: document.getElementById("q_experience").value.trim(),
      sponsorship_experience: document.getElementById("q_sponsorship").value.trim(),
      anchoring_level: formData.q_anchoring || "",
      anchoring_level_more: getMore("q_anchoring_more"),
      skills: skillsReadable,
      skills_more: getMore("q_skills_more"),
      hours_per_week: formData.q_hours || "",
      hours_per_week_more: getMore("q_hours_more"),
      event_ideas: document.getElementById("q_ideas").value.trim(),
      outside_experience: document.getElementById("q_outside").value.trim(),
      about_you: document.getElementById("q_about_you") ? document.getElementById("q_about_you").value.trim() : "",
      questions: document.getElementById("q_questions") ? document.getElementById("q_questions").value.trim() : ""
    };

    // Show loading
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;

    var client = getSupabase();
    if (client) {
      // Save to Supabase
      client.from(SUPABASE_TABLE).insert([submission]).then(function (res) {
        if (res.error) {
          console.error("Supabase error:", res.error);
          alert("Submission failed: " + res.error.message);
          submitBtn.textContent = "🚀 Launch Application";
          submitBtn.disabled = false;
          return;
        }
        showSuccess();
      });
    } else {
      // Fallback: localStorage if Supabase not configured
      console.warn("Supabase not configured — saving to localStorage instead.");
      var KEY = "irc_eventUnitApplications";
      var existing = [];
      try {
        var raw = localStorage.getItem(KEY);
        if (raw) { var parsed = JSON.parse(raw); if (parsed && Array.isArray(parsed.items)) existing = parsed.items; }
      } catch (e) {}
      submission.id = "app_" + Date.now();
      submission.submitted_at = new Date().toISOString();
      existing.unshift(submission);
      localStorage.setItem(KEY, JSON.stringify({ v: 1, items: existing, updatedAt: new Date().toISOString() }));
      setTimeout(showSuccess, 800);
    }
  }

  function showSuccess() {
    questNav.style.display = "none";
    successOverlay.classList.add("is-visible");
    fireConfetti();
  }

  /* ---- Confetti -------------------------------------------------------- */
  function fireConfetti() {
    var canvas = confettiCanvas;
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var pieces = [];
    var colors = ["#7c3aed", "#3b82f6", "#06b6d4", "#ff2a85", "#10b981", "#f59e0b", "#fff"];
    for (var i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 3,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    var frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      pieces.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rv;
        if (frame > 120) p.opacity -= 0.01;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (frame < 250) requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---- Particle Background --------------------------------------------- */
  function initParticles() {
    var canvas = document.getElementById("particleBg");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var particles = [];
    var mouse = { x: -9999, y: -9999 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    document.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for (var i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p, i) {
        // Mouse repulsion
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(124, 58, 237, " + p.opacity + ")";
        ctx.fill();

        // Connect nearby
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var d = Math.sqrt((p.x - p2.x) * (p.x - p2.x) + (p.y - p2.y) * (p.y - p2.y));
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(124, 58, 237, " + (0.06 * (1 - d / 150)) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

})();
