# MAD Workflows System

**Multi-Agent Debate (MAD) Workflows for Software Development**

This directory contains a complete MAD workflow system that can be used across multiple projects.

---

## 📁 Directory Structure

```
.mad-workflows/
├── README.md                   # This file (Setup Guide)
├── AGENT_MANIFEST.md           # The "Brain" - Command list & Capability map
├── workflows/                  # Detailed SOPs
│   ├── feature-creation.md     # PM -> Arch+Impl -> QA -> Pub
│   ├── quality-assurance.md    # Review, Auto-Review, Auto-Fix
│   └── documentation-curation.md # Documentation audit & cleanup
├── templates/                  # Standardized Output Formats
│   ├── 1-prd.md
│   ├── 2-impl-design.md
│   ├── 3-qa-report.md
│   ├── 4-deployment.md
│   └── 5-doc-audit.md
└── reference/                  # Background Reading
    └── system-research.md      # Research on MAD effectiveness
```

---

## 🚀 Quick Start

### 1. Copy to Your Project

```bash
# Copy this entire directory to your project root
cp -r .mad-workflows /path/to/your/project/
```

### 2. Update `.gitignore`

Ensure your `.gitignore` allows the MAD workflow files:

```gitignore
# Allow MAD workflow files
!.mad-workflows/
!.mad-workflows/**
```

### 3. Usage

Refer to **`AGENT_MANIFEST.md`** for the full list of commands and capabilities.

**Common Commands:**
- `gen_pm` or `gen_feature` - Start a new feature (interview mode)
- `gen_pm_auto` - Auto-scope a project from documentation (~1 week work)
- `gen_impl [file]` - Implement from PRD
- `gen_qa [file]` - Test implementation
- `gen_pub [file]` - Deploy feature
- `gen_pm_back [file]` - PM clarifies requirements after push-back
- `gen_impl_back [file]` - Implementer responds to push-back (from PM or QA)
- `gen_qa_back [file]` - QA re-tests after implementer fixes
- `mrsop` - Start a manual code review
- `arsop` - Start an automated code review
- `gen_doc_audit` - Audit and clean up documentation
- `curate_docs` - Audit and cleanup documentation

**⚠️ Important:** If you run a command when that stage is already complete or out of order, the agent will ask for clarification. See "Handling Command Errors" in `workflows/feature-creation.md`.

---

## 🎯 Why MAD Works

**Multi-Agent Debate increases accuracy by:**
- ✅ **Separate contexts** - Each agent validates with fresh eyes
- ✅ **Role specialization** - PM focuses on requirements, QA on testing, etc.
- ✅ **Structured handoffs** - Single evolving document per feature with clear naming
- ✅ **Push-back encouraged** - Agents challenge each other for clarity and quality
- ✅ **Audit trail** - Timestamps and status tracking throughout
- ✅ **Traceability** - Complete feature history from requirements to deployment in one file

---

## 🔧 Customization

- **Templates**: Edit files in `templates/` to change the output format of agents.
- **Workflows**: Edit files in `workflows/` to change the steps agents take.
- **Project Context**: See `docs/project-context-heylina.md` for HeyLina-specific guidance for all agents.

## 📝 Documentation Standards

**Feature Documentation Naming:**
- All feature workflow documents follow the pattern: `docs/feat_[featurename]_[STAGE].md`
- Example: `docs/feat_user_auth_PRD.md` → `docs/feat_user_auth_IMPL.md` → `docs/feat_user_auth_QA.md` → `docs/feat_user_auth_DONE.md`
- **One feature = One document** that evolves through stages
- Agents append their sections using templates from `templates/` directory
- No separate planning documents or side files per feature

---

## 📚 Additional Documentation

- **Push-Back Guide**: `docs/push-back-guide.md` - How to use push-back commands for quality control
- **Error Handling Guide**: `docs/error-handling-guide.md` - What to do when commands fail or stages are already complete
- **Autonomous PM Guide**: `docs/autonomous-pm-guide.md` - How to use `gen_pm_auto`
- **HeyLina Project Context**: `docs/project-context-heylina.md` - Product vision, creative freedom, tech stack
- **System Evaluation**: `docs/system_evaluation.md` - MAD effectiveness research
