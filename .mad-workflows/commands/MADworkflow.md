# Intelligent MAD Software Development Flow

**Goal:** Create a Multi-Agent Debate (MAD) system where specialized agents pass context and prompts to each other to achieve high-accuracy software development.

**Long-Term Vision:** Implement this orchestration using **LangGraph** to manage stateful loops and handoffs natively, replacing ad-hoc manual passing.

---

## 1. Core Workflows & Personas

### A. Feature Generation Flow (The "Creation" Chain)
*Implementation Strategy: Simpler orchestration (e.g., LangGraph or local script) than the backend-heavy review flow.*

1.  **Product Manager (PM)**
    *   **Role:** Interview the client (User) to extract requirements.
    *   **Input:** User idea/request.
    *   **Output:** Product Requirements Doc (PRD) + Prompt for Architect+Implementer.
    *   **Handoff:** Passes structured requirements to Architect+Implementer.

2.  **Architect + Implementer (Combined)**
    *   **Role:** Design the technical solution AND implement it. Embraces agent's natural planning-then-execution flow.
    *   **Input:** PRD from PM.
    *   **Output:** Technical Design + Implementation + Prompt for QA.
    *   **Handoff:** Passes implemented code context to QA.

3.  **QA Engineer (The "Tester")**
    *   **Role:** Verify the specific feature against the original PRD. (Distinct from Auto Review which checks general code quality).
    *   **Input:** Code + PRD.
    *   **Output:** Test Report (Pass/Fail) + Bug List.
    *   **Handoff:** If Pass -> Publisher. If Fail -> Back to Architect+Implementer.

4.  **Publisher**
    *   **Role:** Run build scripts, fix final lint/build errors, and merge/deploy.
    *   **Input:** Verified Code.
    *   **Output:** Deployed Feature.

### B. Review & Maintenance Flow (The "Cleanup" Chain)
*Implementation Strategy: Existing Supabase `backlog_api` + `review.md` SOPs.*

*   **Manual Review Agent (MRSOP)**: Human-in-the-loop review.
*   **Auto Review Agent (ARSOP)**: Broad scan for general code quality/bugs.
*   **Auto Fix Agent (AFSOP)**: Deep dive validation and fixing of specific issues.

### C. General Assistance Flow
*   **The "Guru" (Abstract Conversations)**: Discusses software principles, architecture patterns, and industry insights unrelated to the specific repo.
*   **The "Librarian" (Quick Qs)**: Answers quick syntax/command questions (e.g., "What's the command for X?") without deep context loading.

---

## 2. Meta-Process

### Process Review Agent (Backlog)
*   **Goal:** A meta-agent that reviews the *process itself* to find inefficiencies in the agent handoffs.
*   **Status:** Backlog. Needs research on how to implement self-optimizing workflows.

---

## 3. Command Reference

| Agent/Flow | Command | Description |
| :--- | :--- | :--- |
| **Manual Review** | `mrsop` | Trigger Manual Review SOP |
| **Auto Review** | `arsop` | Trigger Auto Review SOP |
| **Auto Fix** | `afsop` | Trigger Auto Fix SOP |
| **Feature Gen (PM)** | `gen_feature` or `gen_pm` | Start as Product Manager (interview mode) |
| **Feature Gen (PM Auto)** | `gen_pm_auto` | PM auto-scopes project from docs (~1 week work) |
| **Feature Gen (Impl)** | `gen_impl` | Start as Architect+Implementer (requires PRD) |
| **Feature Gen (QA)** | `gen_qa` | Start as QA Engineer (requires IMPL doc) |
| **Feature Gen (Pub)** | `gen_pub` | Start as Publisher (requires QA doc) |
| **Guru** | `chat_guru` | Start abstract dev discussion (Future) |
| **Librarian** | `quick_q` | Ask quick syntax question (Future) |
