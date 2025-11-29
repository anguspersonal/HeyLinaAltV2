# Agent Manifest & Capability Map

**Goal:** This is the "Brain" for the Agent. It defines the capabilities, roles, and where to find the detailed Standard Operating Procedures (SOPs).

**Long-Term Vision:** Orchestration via **LangGraph**.

---

## 1. Capability Map

| Capability | Command | Role | SOP Location |
| :--- | :--- | :--- | :--- |
| **Create Feature (Interview)** | `gen_feature` or `gen_pm` | Product Manager | `.mad-workflows/workflows/feature-creation.md` |
| **Create Feature (Auto-Scope)** | `gen_pm_auto` | Product Manager (Autonomous) | `.mad-workflows/workflows/feature-creation.md` |
| **Implement Feature** | `gen_impl` | Architect+Implementer | `.mad-workflows/workflows/feature-creation.md` |
| **Test Feature** | `gen_qa` | QA Engineer | `.mad-workflows/workflows/feature-creation.md` |
| **Deploy Feature** | `gen_pub` | Publisher | `.mad-workflows/workflows/feature-creation.md` |
| **PM Push-Back (from User)** | `gen_pm_back` | Product Manager | `.mad-workflows/workflows/feature-creation.md` |
| **Implementer Push-Back** | `gen_impl_back` | Architect+Implementer | `.mad-workflows/workflows/feature-creation.md` |
| **QA Push-Back** | `gen_qa_back` | QA Engineer | `.mad-workflows/workflows/feature-creation.md` |
| **Manual Review** | `mrsop` | Senior Engineer | `.mad-workflows/workflows/quality-assurance.md` |
| **Auto Review** | `arsop` | Code Reviewer | `.mad-workflows/workflows/quality-assurance.md` |
| **Auto Fix** | `afsop` | Maintenance Dev | `.mad-workflows/workflows/quality-assurance.md` |
| **Documentation Audit** | `gen_doc_audit` | Documentation Curator | `.mad-workflows/workflows/documentation-curation.md` |
| **Documentation Audit** | `curate_docs` | Documentation Curator | `.mad-workflows/workflows/documentation-curation.md` |

---

## 2. Workflow Descriptions

### A. Feature Creation (The "Forward" Motion)
*Source: `.mad-workflows/workflows/feature-creation.md`*

A sequential handoff chain to build new features from scratch.

**Two PM modes:**
- **Interview Mode** (`gen_pm`): PM interviews user to extract requirements
- **Autonomous Mode** (`gen_pm_auto`): PM reviews docs and autonomously scopes a project

**Standard flow:**
1.  **PM**: Interviews user OR reviews docs -> Creates PRD
2.  **Arch+Impl**: Designs & Implements -> Creates Code
3.  **QA**: Verifies against PRD, fixes trivial issues, pushes back big issues -> Creates Test Report
4.  **Publisher**: Builds & Deploys -> Creates Release

**🔄 Push-Back Flow (ENCOURAGED):**
- **PM** can push back on **User** if requirements unclear (`gen_pm_back`)
- **Implementer** can push back on **PM** if PRD has gaps (`gen_impl_back`)
- **QA** fixes trivial issues (styling, typos) but pushes back BIG issues (broken functionality, missing features) to **Implementer** (`gen_qa_back`)
- Push-back includes a "Message back to [role]" section in the feature document
- Push-back commands may run in fresh agents, so context is in the document

**⚠️ Error Handling:**
- If a command is run when that stage is already complete (e.g., `gen_qa` when file is `_QA.md`), the agent will ask for clarification
- If a command is run out of order (e.g., `gen_qa` with a `_PRD.md` file), the agent will suggest the correct file
- See "Handling Command Errors & Re-runs" section in `workflows/feature-creation.md`

### B. Quality Assurance (The "Cleanup" Motion)
*Source: `.mad-workflows/workflows/quality-assurance.md`*

A maintenance loop to ensure code quality.
*   **Manual Review (`mrsop`)**: Human-in-the-loop review for complex changes.
*   **Auto Review (`arsop`)**: Broad scan for bugs and debt.
*   **Auto Fix (`afsop`)**: Targeted validation and fixing of logged issues.

### C. Documentation Curation (The "Clarity" Motion)
*Source: `.mad-workflows/workflows/documentation-curation.md`*

A maintenance workflow to keep documentation clean, organized, and newcomer-friendly.
*   **Documentation Audit (`gen_doc_audit`)**: Scan repository for ephemeral artifacts, contradictions, redundancy, and organizational issues. Produces comprehensive audit report with cleanup recommendations.

### C. Documentation Curation (The "Clarity" Motion)
*Source: `.mad-workflows/workflows/documentation-curation.md`*

A periodic audit to maintain documentation health and newcomer accessibility.
*   **Documentation Audit (`curate_docs`)**: Scan all docs, identify ephemeral content, suggest deletions/consolidations, resolve contradictions from pivots, ensure clear hierarchy linking to vision docs and README.

---

## 3. Reference Material

*   **Error Handling Guide**: `.mad-workflows/docs/error-handling-guide.md` - What to do when commands fail, stages are already complete, or files are missing.
*   **System Research**: `.mad-workflows/reference/system-research.md` - The "Why" behind MAD (Net Engineering Momentum).
*   **Templates**: `.mad-workflows/templates/` - Standardized output formats for all agents:
    *   `1-prd.md` - Product Requirements Document
    *   `2-impl-design.md` - Implementation Design
    *   `3-qa-report.md` - Quality Assurance Report
    *   `4-deployment.md` - Deployment Report
    *   `5-doc-audit.md` - Documentation Audit Report
*   **Project Context**: `.mad-workflows/docs/project-context-heylina.md` - HeyLina-specific guidance, creative freedom, product vision.
*   **Autonomous PM Guide**: `.mad-workflows/docs/autonomous-pm-guide.md` - How to use `gen_pm_auto` mode.
