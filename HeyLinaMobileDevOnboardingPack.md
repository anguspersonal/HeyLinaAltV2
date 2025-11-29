# HeyLina Mobile Developer Onboarding Pack

Audience: Mobile front end developer
Scope: Mobile client only, integrating with existing and evolving HeyLina backend and AI stack.

---

## 1. What HeyLina Is And Why It Exists

### 1.1 The human problem we are solving

Modern dating is emotionally chaotic:

* People do not need more matches, they need more emotional clarity.
* Typical users feel exhausted by dating apps, struggle to read signals, and get conflicting advice from friends, TikTok, and generic AI tools like ChatGPT. 

Our archetypal user is:

> Julie, 28, London, works in a professional role, is actively dating with the intention of finding a relationship. She is burnt out by dating apps, overthinks messages and dates, and wants clarity, accountability, and someone to talk to.

### 1.2 The product in one line

**HeyLina is an AI companion that gives emotionally intelligent, context aware guidance for modern dating, helping users make better relationship decisions and feel less alone.**

We are not a dating app. We do not match people. We sit underneath dating and relationships as the emotional intelligence layer.

### 1.3 Our vision, mission, and values

**Vision**

* We envision a world where nobody has to feel alone when making relationship choices.
* Emotional decision making should have the same level of structured support and clarity that people already expect in finance, health, and work.

**Mission**

* Right now, our mission is to support emotional decision making through:

  * AI guided conversations
  * Behavioural science and CBT influenced techniques
  * Pattern recognition on past decisions and emotional states

You should feel this mission in the app’s UX: the UI is there to create calm, reflection and insight, not dopamine spikes.

**Core values**

Three values drive product and tech decisions:

1. **Integrity**

   * Data integrity and structural integrity of the AI stack.
   * We do not fudge UX at the cost of honesty. If the model is not certain, we let the user know.
2. **Trust**

   * Trust is our moat. If Lina is not trusted, nothing else matters.
   * We avoid gimmicky or manipulative patterns.
3. **Compassion**

   * We design for people dealing with anxiety, heartbreak, and self doubt. Tone and microcopy must be gentle and validating, not clinical or judgmental.

Your work on the mobile app is part of how we make these values real.

---

## 2. Who We Are Building For

### 2.1 Target user persona

From our strategy sessions, which combined founder insight and research, our early target user looks like this: 

* Age: 28 to 35
* Location: Major UK cities (London, Manchester, Birmingham, Leeds, Bristol, Brighton)
* Relationship status: Single, actively dating with intention to find a partner
* Lifestyle:

  * Professional job, ambitious, tries to stay active
  * Social, but not heavy clubbing
  * Consumes a mix of entertainment and self help content (Love Island, relationship TikTok, therapy content, self development)
* Characteristics:

  * Has had some relationships and dating experience
  * Often struggles with anxious thoughts, rumination, and attachment patterns
  * Wants to feel more in control and less “delulu” about dating

### 2.2 Emotional triggers that send them to Lina

Most people come to Lina around sharp emotional moments, for example: 

* Breakup, being ghosted, or infidelity
* Being stood up, boundary violations, or inconsistent communication
* “No second dates” pattern
* Doubting themselves: “Am I being unreasonable?”, “Am I the problem?”

The app should feel like the natural place to turn in these moments. That should influence navigation and what is on the home screen.

---

## 3. Core Product Concepts You Must Understand

### 3.1 Lina as a character

Lina is:

* A best friend who is emotionally intelligent and non judgmental
* Informed by therapist practices and CBT, but clearly not a therapist
* A space for reflection first, solutions second

Compared with generic AI chat, we optimise for:

* Feeling heard and emotionally held
* Helping the user think, not just giving them an answer
* Sustained context over time (not isolated chats)

### 3.2 Emotional / Relationship Health Score

We are developing a proprietary score that captures emotional patterns over time, across several dimensions such as:

* Self awareness
* Boundaries
* Communication patterns
* Attachment dynamics
* Emotional volatility

This appears in the deck as an Emotional Health Score that builds over weeks through repeated check ins, not a one off quiz.

For you this means:

* The score is central to the product narrative.
* The experience should feel like an ongoing journey, not a static badge.

### 3.3 Longitudinal relationship intelligence

Our differentiation and defensibility come from longitudinal data:

* We track decision histories, emotional states, and outcomes over time.
* We feed that into AI models and RAG so that Lina can spot patterns, not just answer isolated questions.

The mobile app is the primary surface where this data is gathered and reflected back in a meaningful way.

### 3.4 AI and RAG under the hood (what you need to know)

We use AI in three main ways:

1. **Chat**

   * The core interaction between user and Lina.
   * Powered by large language models via our backend.

2. **Retrieval Augmented Generation (RAG)**

   * Pulls from a curated corpus grounded in CBT and relationship psychology.
   * Helps keep answers more evidence based and aligned with our principles.

3. **Scoring and insights**

   * Assigns or updates an Emotional Health Score.
   * Generates pattern summaries and suggested next steps.

You do not need to build AI logic on mobile. You do need to:

* Design the UI so that RAG and context use are visible and understandable.
* Handle latency and errors gracefully.
* Make it obvious when the model is thinking, and what the user can safely expect.

---

## 4. Product Scope For The Mobile App

### 4.1 High level roadmap

The pitch deck and strategy work frame three pillars for mobile:

1. Launch a high quality mobile app focused on chat and early scoring.
2. Expand the Emotional Health Score system in depth and reliability, co developed with therapists.
3. Scale growth via creators, community, and referral mechanics.

Your work in the first months is mainly in pillar 1, with some groundwork for pillar 2 and 3.

### 4.2 V1 feature set (front end)

At a minimum, V1 mobile should support:

1. **Account creation and login**

   * Email based login, with room for social sign in later.
   * Clear consent and privacy language.

2. **Onboarding and intention setting**

   * A short, guided introduction to:

     * What Lina is and is not.
     * How data is used.
     * What the user gets if they engage regularly.
   * Optional initial questionnaire to seed context:

     * Relationship status
     * Dating goals
     * Key patterns they struggle with

3. **Chat with Lina**

   * Core chat screen with:

     * Message bubbles for user and Lina
     * Typing indicator
     * Optional quick reply buttons for structured prompts
   * System messages for:

     * Session summaries
     * Safety guidance
     * Next best actions

4. **Score and insights view**

   * A section where users can:

     * See their current Emotional Health Score.
     * View trends over time (simple graph or timeline).
     * Read short, humane explanations of what this means.

5. **History and bookmarks**

   * Ability to:

     * View past chats organised by topic, person, or time.
     * Bookmark key conversations or “insights” for quick access.

6. **Notifications and check ins**

   * Lightweight daily or weekly check ins:

     * “How are you feeling about dating today?”
     * “Anything you want to talk to Lina about after last night’s date?”
   * Flexible snooze and reminder controls.

7. **Subscription and paywall**

   * Pricing in the deck currently positions HeyLina as a premium emotional clarity companion at around £14.99 per month with a 14 day free trial. 
   * The app must:

     * Make the value of premium clear.
     * Handle upgrade flows.
     * Communicate trial start and end clearly.

8. **Settings and safety**

   * Manage profile, notification preferences.
   * Data controls:

     * Log out
     * Request data export or deletion (even if wired later on backend, UI should be ready).
   * Safety links and crisis information.

Anything beyond this is “nice to have” until we are confident core flows are solid.

---

## 5. Core User Journeys And UX Notes

Below are the journeys you should design and implement first.

### 5.1 First time open

**Goal**
Give enough clarity and safety for the user to feel “this is for me” and proceed to sign up.

**Flow**

1. Splash screen with short tagline:

   * Example: “When dating feels chaotic, Lina helps you make sense of it.”
2. Swipeable intro or single explainer:

   * What Lina is
   * What Lina is not (therapy, crisis support)
   * A one line about AI and privacy
3. Call to action:

   * “Get started” button leading to sign up.

**Tone**

* Clean, friendly, non clinical.
* Avoid heavy jargon like “LLM”, “RAG” on user facing screens.

### 5.2 Sign up and onboarding

**Goal**
Create a lightweight identity and collect just enough context to be helpful.

**Flow**

1. Sign up:

   * Email and password, or magic link.
   * Terms of service and privacy notice with concise summaries.
2. Basic profile:

   * Name or nickname
   * Age bracket, city
   * Relationship status and primary goal (for example: “healing from a breakup”, “dating with intention”, “improving communication in my relationship”).
3. Expectation setting:

   * One screen clarifying:

     * Lina is AI, not a human or therapist.
     * Data is private, end user can opt out in settings.
     * Crisis situations should go to professional support.

### 5.3 First chat

**Goal**
Deliver a “wow, this feels like it gets me” moment without overpromising.

**Flow**

1. Pre seeded message from Lina:

   * Warm welcome.
   * Asks a focused opening question, for example:

     * “What is on your mind about dating right now?”
2. User types or uses suggested prompts:

   * Quick actions like:

     * “Talk about someone I am dating.”
     * “Process a breakup.”
     * “I am anxious after a date.”
3. Response handling:

   * Show typing indicator while backend generates.
   * Deliver response in readable chunks.
   * Offer follow up suggestions like:

     * “Want to go deeper on this pattern?”
     * “Save this insight.”

**UX points**

* Design for long text input.
* Maintain conversational rhythm, avoid hard context resets.
* Ensure errors are handled in a reassuring way (“Something went wrong, but your message is safe. Let us try that again.”).

### 5.4 Score and insights

**Goal**
Make the Emotional Health Score feel like a meaningful reflection, not a judgement.

**Flow**

1. Summary card on home or separate tab:

   * Shows current score.
   * Uses language like:

     * “Your emotional clarity is improving.”
     * Avoids grades like “bad” or “failing”.
2. Drill down:

   * Break score into components.
   * Show small, digestible insights such as:

     * “You are getting better at naming your feelings.”
     * “You often doubt yourself after mixed signals from others.”
3. Call to action:

   * Suggest specific chats or exercises to work on weaker areas.

**UX constraints**

* No harsh colours or alarmist visuals.
* Treat this as a reflective dashboard, not a gamified leaderboard.

### 5.5 Notifications and re engagement

**Goal**
Build habit loops without feeling spammy or clingy.

**Ideas**

* Morning check in a few times per week.
* Post event prompts:

  * “How did the date go?” if the user mentioned a planned date.
* Weekly reflection:

  * “Want to see how your Emotional Health Score changed this week?”

All notifications should be easy to mute, snooze, or fine tune.

---

## 6. Brand, Tone, And Visual Direction

### 6.1 Tone of voice

The deck and strategy notes imply a voice that is:

* Warm and conversational
* Direct but kind
* Slightly playful, but never mocking
* Confident enough to set boundaries

Examples of the wrong tone:

* Too clinical: “Your attachment schema indicates persistent anxious patterns.”
* Too flippant: “Huge red flag babe, dump him lol.”

Examples of better tone:

* “It makes sense that you feel anxious after he went quiet.”
* “Given what you told me before, this behaviour is not aligned with the kind of relationship you want.”

As a front end dev you will often stub in copy or microcopy. Default to this tone and avoid anything that conflicts clearly with it.

### 6.2 Visual style

The deck points towards:

* A modern consumer wellness app, not a corporate health product
* Soft, calm colours and rounded shapes
* A look closer to “journalling meets therapy chat” than “trading dashboard”

You will work with design, but if you make UI decisions:

* Prioritise legibility and calm.
* Make key actions obvious, but no casino style visuals.
* Ensure accessibility: font sizes, contrast, and motion controls.

---

## 7. Technical Overview For The Mobile Front End

### 7.1 Assumed tech stack

Unless agreed otherwise, assume:

* **Framework**: React Native
* **Language**: TypeScript
* **Navigation**: React Navigation (stack + tab)
* **Networking**: fetch or axios, thin wrapper on top
* **State**:

  * Local UI state with React hooks
  * Server state with something like React Query or SWR
* **Storage**:

  * Secure local storage for auth tokens
  * AsyncStorage for non sensitive prefs

If we choose a different stack later, the architecture principles below still apply.

### 7.2 High level architecture

We want a clear separation between:

1. **UI layer**
   Presentational components, layout, styling.

2. **State and data layer**
   Hooks and stores handling:

   * User session
   * Chat threads
   * Score data
   * Settings

3. **Service layer**
   Modules responsible for:

   * API calls to backend
   * Analytics logging
   * Feature flags

Keep features modular:

* `features/auth`
* `features/chat`
* `features/score`
* `features/onboarding`
* `features/settings`

### 7.3 Expected API surface (illustrative)

The backend is evolving, but the mobile client will likely call endpoints similar to:

* `POST /auth/signup`
* `POST /auth/login`
* `POST /auth/logout`
* `GET /user/me`
* `GET /score/current`
* `GET /score/history`
* `GET /chats`
* `POST /chats`
* `POST /chats/:id/messages`
* `GET /chats/:id/messages`
* `POST /feedback/message`

Your responsibility:

* Implement client side services that wrap these calls.
* Handle response shaping, errors, and retries.
* Speak up if the API contract you get from backend is inconsistent with what the UX needs.

---

## 8. Product Quality, Safety, And Analytics

### 8.1 Safety and ethics in the UX

We have explicit risk notes on AI accuracy, ethics, and safety.

This means the app should:

* Never position Lina as a crisis line.
* Offer signposting to crisis resources where needed.
* Avoid implying guaranteed outcomes (“Lina will fix your love life”).
* Make it easy for users to pause or leave if they feel overwhelmed.

UI patterns you should support:

* Clear disclaimers in onboarding and in relevant screens.
* Inline warnings when topics cross into riskier territory (for example self harm, abuse, coercive control flagged by backend).

### 8.2 Data privacy and trust

From our risk and mitigation work:

* Users are understandably anxious about how relationship data is stored and used.
* We mitigate this through:

  * Transparent privacy copy
  * Understandable controls
  * Conservative defaults

Your side:

* Never log sensitive content to third party analytics by default.
* Treat auth tokens and personal identifiers as sensitive.
* Use secure storage where possible.

### 8.3 Analytics and metrics

We care about:

* Acquisition:

  * Install, sign up completion, onboarding completion.
* Engagement:

  * Daily and weekly active users.
  * Number of chat sessions per user.
  * Depth of conversation (message counts).
  * Use of score and insight views.
* Retention:

  * Day 1, 7, 30 retention.
  * Re engagement via notifications.
* Monetisation:

  * Trial start and completion.
  * Conversion to paid.
  * Churn events.

On your side:

* Work with product to define a minimal set of analytic events.
* Ensure event naming is consistent.
* Avoid over instrumenting, especially around sensitive content.

---

## 9. How We Work Together

### 9.1 Project structure and language

We follow an Epics → Projects → User Stories → Tasks hierarchy in our planning. 

For you this means:

* Epics: big outcomes like “Launch HeyLina Mobile MVP”.
* Projects: clusters such as “Onboarding and education”, “Chat experience”, “Score and insights”.
* User stories: user facing slices like:

  * “As a new user, I want a short guided intro so I understand what the app is for.”
* Tasks: your actionable units (implement screen X, integrate endpoint Y, add loading state for Z).

Expect briefs in this structure, and feel free to help refine them.

### 9.2 Ways of working

You can expect:

* A single source of truth in Notion or a similar tool for:

  * Product docs
  * Designs
  * Specs
* Regular check ins with the founder team:

  * Quick feedback cycles on UI branches
  * Early testing on TestFlight or internal distribution

We expect you to:

* Keep pull requests small and focused.
* Suggest improvements, not just implement specs.
* Flag risks early, especially around:

  * Performance
  * UX regressions
  * Safety and privacy

---

## 10. Glossary

* **HeyLina / Lina**
  The product and the AI persona.

* **EHS / Emotional Health Score**
  Score that captures the user’s emotional patterns and progress over time.

* **RHS / Relationship Health Score**
  Earlier term in some docs for a similar concept focused specifically on relationships. Where you see RHS in old docs, read it as an earlier framing of EHS. 

* **RAG (Retrieval Augmented Generation)**
  AI pattern where the model is grounded in a curated knowledge base rather than answering from general training alone.

* **BGV (Bethnal Green Ventures)**
  Impact investor that backed HeyLina with around £60k in early capital. 

* **MVP (Minimum Viable Product)**
  The smallest coherent product that users can get value from and that we can iterate on.

---
