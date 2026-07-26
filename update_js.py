import re

with open("js/apply.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace total slides config
js = re.sub(
    r'var TOTAL_SLIDES = 8; // 0=welcome, 1-7=questions\s*var TOTAL_STEPS  = 7; // question slides only \(for counter\)',
    'var TOTAL_SLIDES = 14; // 0=welcome, 1-13=questions\n  var TOTAL_STEPS  = 13; // question slides only (for counter)',
    js
)

new_validate = """  /* ---- Validation ------------------------------------------------------ */
  function validateSlide(idx) {
    var slide = slides[idx];
    var valid = true;

    if (idx === 1) { // Contact Details
      var name = document.getElementById("q_name");
      if (!name.value.trim()) {
        name.closest(".floating-field").classList.add("has-error");
        valid = false;
      } else {
        name.closest(".floating-field").classList.remove("has-error");
      }
      var phone = document.getElementById("q_phone");
      if (!phone.value.trim()) {
        phone.closest(".floating-field").classList.add("has-error");
        valid = false;
      } else {
        phone.closest(".floating-field").classList.remove("has-error");
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

    // idx === 6 is Experience (optional)
    // idx === 7 is Sponsorship (optional)

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

    // idx === 11 is Ideas (optional)
    // idx === 12 is Outside Experience (optional)
    // idx === 13 is Review (no inputs to validate before submit)

    if (!valid) {
      // Shake the slide
      var content = slide.querySelector(".slide-content");
      content.classList.remove("shake");
      void content.offsetWidth; // reflow
      content.classList.add("shake");
    }

    return valid;
  }"""

js = re.sub(
    r'  /\* ---- Validation ------------------------------------------------------ \*/.*?return valid;\n  }',
    new_validate,
    js,
    flags=re.DOTALL
)

with open("js/apply.js", "w", encoding="utf-8") as f:
    f.write(js)
