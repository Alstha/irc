import re

with open("apply.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace orbs
orbs_html = """        <div class="quest-progress__track"></div>
        <div class="quest-progress__fill" id="progressFill"></div>
        <button class="quest-orb is-active" data-orb="0"><span>👋</span></button>
        <button class="quest-orb" data-orb="1"><span>📝</span></button>
        <button class="quest-orb" data-orb="2"><span>🎓</span></button>
        <button class="quest-orb" data-orb="3"><span>🗓️</span></button>
        <button class="quest-orb" data-orb="4"><span>🎪</span></button>
        <button class="quest-orb" data-orb="5"><span>⚖️</span></button>
        <button class="quest-orb" data-orb="6"><span>💪</span></button>
        <button class="quest-orb" data-orb="7"><span>💎</span></button>
        <button class="quest-orb" data-orb="8"><span>🎤</span></button>
        <button class="quest-orb" data-orb="9"><span>🧠</span></button>
        <button class="quest-orb" data-orb="10"><span>⏱️</span></button>
        <button class="quest-orb" data-orb="11"><span>💡</span></button>
        <button class="quest-orb" data-orb="12"><span>🌐</span></button>
        <button class="quest-orb" data-orb="13"><span>🚀</span></button>"""

html = re.sub(
    r'<div class="quest-progress__track"></div>.*?<button class="quest-orb" data-orb="7"><span>🚀</span></button>',
    orbs_html,
    html,
    flags=re.DOTALL
)

slides_html = """    <!-- ================== SLIDE 2: STATUS ================== -->
    <section class="quest-slide" data-slide="2">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">🎓</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Great! Tell me, which one describes you best?"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <p class="slide-label">Your Current Status</p>
          <div class="card-select" data-field="q_status">
            <button class="card-option" data-value="IT Student">
              <span class="card-option__icon">💻</span>
              <span class="card-option__label">IT Student</span>
            </button>
            <button class="card-option" data-value="Business Student">
              <span class="card-option__icon">📊</span>
              <span class="card-option__label">Business Student</span>
            </button>
            <button class="card-option" data-value="Alumni">
              <span class="card-option__icon">🎓</span>
              <span class="card-option__label">Alumni</span>
            </button>
            <button class="card-option" data-value="Not Member">
              <span class="card-option__icon">🌟</span>
              <span class="card-option__label">Not a Member Yet</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 3: RESPONSIBILITIES ================== -->
    <section class="quest-slide" data-slide="3">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">🗓️</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="And what event responsibilities excite you?"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <p class="slide-label">Responsibilities <span class="tag tag--info">Pick many!</span></p>
          <div class="chip-select" data-field="q_responsibilities">
            <button class="chip" data-value="Planning Events">🗓 Planning Events</button>
            <button class="chip" data-value="Coordinating Logistics">📦 Coordinating Logistics</button>
            <button class="chip" data-value="Managing Budgets">💰 Managing Budgets</button>
            <button class="chip" data-value="Post-event Reports">📋 Post-event Reports</button>
            <button class="chip" data-value="Fostering Partnerships">🤝 Fostering Partnerships</button>
            <button class="chip" data-value="Getting Sponsorships">💎 Getting Sponsorships</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 4: INVOLVEMENT ================== -->
    <section class="quest-slide" data-slide="4">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">🎪</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Where do you see yourself contributing?"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <p class="slide-label">Where do you see yourself?</p>
          <div class="chip-select" data-field="q_involvement">
            <button class="chip" data-value="Event Coordination">🎪 Event Coordination</button>
            <button class="chip" data-value="Main Stage Anchoring">🎤 Main Stage Anchoring</button>
            <button class="chip" data-value="Guest Hosting">🙋 Guest Hosting</button>
            <button class="chip" data-value="Technical Support">🔧 Technical Support</button>
            <button class="chip" data-value="Backstage Management">🎭 Backstage Management</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 5: STRATEGY ================== -->
    <section class="quest-slide" data-slide="5">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">⚖️</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Do you lean towards planning strategy or execution?"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <p class="slide-label">Planning vs Execution</p>
          <div class="scale-slider">
            <span>🧠 Strategy</span>
            <input type="range" id="q_side" min="0" max="100" value="50" />
            <span>⚡ Execution</span>
          </div>
          <div class="scale-value" id="sideLabel">Both — A True All-Rounder!</div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 6: EXPERIENCE ================== -->
    <section class="quest-slide" data-slide="6">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">💪</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Got it! Any prior event or hackathon experience? (It's okay if you're a beginner!)"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <div class="floating-field">
            <textarea id="q_experience" rows="3" placeholder=" "></textarea>
            <label for="q_experience">Prior event/hackathon experience? (Optional)</label>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 7: SPONSORSHIP ================== -->
    <section class="quest-slide" data-slide="7">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">💎</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Sponsorship experience? Want to try getting sponsors?"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <div class="floating-field">
            <textarea id="q_sponsorship" rows="3" placeholder=" "></textarea>
            <label for="q_sponsorship">Sponsorship experience? (Optional)</label>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 8: ANCHORING ================== -->
    <section class="quest-slide" data-slide="8">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">🎤</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Rate your overall event management or anchoring level."></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <p class="slide-label">Anchoring / Event Management Level</p>
          <div class="xp-selector" data-field="q_anchoring">
            <button class="xp-card" data-value="Entry Level">
              <div class="xp-icon">🌱</div>
              <strong>Rookie</strong>
              <span>Just starting out</span>
            </button>
            <button class="xp-card" data-value="Some Experience">
              <div class="xp-icon">⚔️</div>
              <strong>Warrior</strong>
              <span>Got some battles</span>
            </button>
            <button class="xp-card" data-value="Expert">
              <div class="xp-icon">👑</div>
              <strong>Legend</strong>
              <span>Been there, done that</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 9: SKILLS ================== -->
    <section class="quest-slide" data-slide="9">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">🧠</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Let's do a quick skills check. Tap to rate your level."></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <p class="slide-label">Rate your skills</p>
          <div class="skill-bar-group">
            <div class="skill-bar" data-skill="Budgeting & Finance">
              <div class="skill-bar__label">💰 Budgeting & Finance</div>
              <div class="skill-bar__track">
                <button class="skill-bar__seg" data-level="1" title="Need Training">Need Training</button>
                <button class="skill-bar__seg" data-level="2" title="Competent">Competent</button>
                <button class="skill-bar__seg" data-level="3" title="Expert">Expert</button>
              </div>
            </div>
            <div class="skill-bar" data-skill="Public Speaking">
              <div class="skill-bar__label">🎤 Public Speaking</div>
              <div class="skill-bar__track">
                <button class="skill-bar__seg" data-level="1" title="Need Training">Need Training</button>
                <button class="skill-bar__seg" data-level="2" title="Competent">Competent</button>
                <button class="skill-bar__seg" data-level="3" title="Expert">Expert</button>
              </div>
            </div>
            <div class="skill-bar" data-skill="Logistics & Planning">
              <div class="skill-bar__label">📦 Logistics & Planning</div>
              <div class="skill-bar__track">
                <button class="skill-bar__seg" data-level="1" title="Need Training">Need Training</button>
                <button class="skill-bar__seg" data-level="2" title="Competent">Competent</button>
                <button class="skill-bar__seg" data-level="3" title="Expert">Expert</button>
              </div>
            </div>
            <div class="skill-bar" data-skill="Team Collaboration">
              <div class="skill-bar__label">🤝 Team Collaboration</div>
              <div class="skill-bar__track">
                <button class="skill-bar__seg" data-level="1" title="Need Training">Need Training</button>
                <button class="skill-bar__seg" data-level="2" title="Competent">Competent</button>
                <button class="skill-bar__seg" data-level="3" title="Expert">Expert</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 10: HOURS ================== -->
    <section class="quest-slide" data-slide="10">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">⏱️</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="How many hours a week can you commit?"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <p class="slide-label">Hours / Week</p>
          <div class="commitment-cards" data-field="q_hours">
            <button class="commit-card" data-value="1-2 hours">
              <div class="commit-emoji">🌤</div>
              <strong>Chill</strong>
              <span>1–2 hrs/week</span>
            </button>
            <button class="commit-card" data-value="3-5 hours">
              <div class="commit-emoji">🔥</div>
              <strong>Fired Up</strong>
              <span>3–5 hrs/week</span>
            </button>
            <button class="commit-card" data-value="5+ hours">
              <div class="commit-emoji">🚀</div>
              <strong>All In</strong>
              <span>5+ hrs/week</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 11: IDEAS ================== -->
    <section class="quest-slide" data-slide="11">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">💡</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Have any cool event ideas for the community?"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <div class="floating-field mt-6">
            <textarea id="q_ideas" rows="4" placeholder=" "></textarea>
            <label for="q_ideas">💡 Any event ideas? (Optional)</label>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 12: OUTSIDE EXP ================== -->
    <section class="quest-slide" data-slide="12">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">🌐</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="Last question! Do you know anyone outside IRC with event experience?"></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <div class="floating-field">
            <textarea id="q_outside" rows="2" placeholder=" "></textarea>
            <label for="q_outside">Know anyone outside IRC? (Optional)</label>
          </div>
        </div>
      </div>
    </section>

    <!-- ================== SLIDE 13: FINAL REVIEW ================== -->
    <section class="quest-slide" data-slide="13">
      <div class="slide-content">
        <div class="slide-chat">
          <div class="chat-bubble chat-bubble--bot">
            <div class="chat-avatar">🚀</div>
            <div class="chat-text">
              <strong>IRC Bot</strong>
              <p class="typewriter" data-text="You made it! Review your application below and click Launch when ready."></p>
            </div>
          </div>
        </div>
        <div class="slide-fields">
          <div class="final-review mt-6" id="finalReview">
            <!-- JS populates this summary card -->
          </div>
        </div>
      </div>
    </section>"""

html = re.sub(
    r'<!-- ================== SLIDE 2: STATUS & RESPONSIBILITIES ================== -->.*?</section>\s*<!-- Nav bar \(bottom floating\) -->',
    slides_html + '\n\n    <!-- Nav bar (bottom floating) -->',
    html,
    flags=re.DOTALL
)

with open("apply.html", "w", encoding="utf-8") as f:
    f.write(html)
