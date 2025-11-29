# Automated MAD Orchestration Design (Exploration - Not Currently Needed)

> **Status:** 🚧 **Exploration/Reference Only** - We're sticking with the local Cursor setup for now. The execution layer is more important than orchestration, and we've already built most of the orchestration through MAD workflows.
>
> **Note:** This is **separate infrastructure tooling**, not part of the HeyLina mobile app. It's located in `tools/mad-orchestrator/` and can be used with any project that uses MAD workflows. Consider moving this to a separate repository for reusability across projects.

## Goal

Automate the MAD workflow orchestration so that `gen_pm_auto` can run on a schedule (e.g., every 3 hours) and automatically progress through the full chain: PM → Impl → QA → Pub, with proper state management, error handling, and push-back loops.

---

## Architecture Overview

### Hybrid Model: LangGraph (Orchestration) + LangChain Agents (Execution)

**Important:** Cursor is a desktop IDE, not a service. It doesn't have an API or CLI for programmatic execution. Instead, we use **LangChain agents** (which LangGraph is built on) to replicate Cursor's capabilities.

```
┌─────────────────────────────────────────────────────────┐
│  LangGraph Orchestrator (Stateful Workflow Engine)      │
│  - Manages agent handoffs                               │
│  - Tracks workflow state                                │
│  - Handles conditional routing (pass/fail loops)        │
│  - Schedules recurring workflows                        │
│  - Persists state for resumability                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Calls LangChain Agent Executor
                   │ with MAD command + context
                   ▼
┌─────────────────────────────────────────────────────────┐
│  LangChain Agent Executor (Execution Layer)             │
│  - Receives agent role + context                        │
│  - Has file system tools (read/write files)             │
│  - Has command execution tools (yarn, npm, etc.)        │
│  - Reads MAD workflow SOPs and follows them             │
│  - Executes MAD command (gen_pm_auto, gen_impl, etc.)   │
│  - Returns results + status to LangGraph                │
└─────────────────────────────────────────────────────────┘
```

**Why LangChain Agents Instead of Cursor?**
- ✅ LangGraph is built on LangChain - they work together natively
- ✅ LangChain agents can have file system access, code understanding, tool execution
- ✅ Can run headless on servers (no IDE required)
- ✅ Full programmatic control for automation
- ✅ Same workflow logic (reads your MAD SOPs and follows them)

---

## Core Components

### 1. LangGraph Workflow Definition

**State Schema:**
```python
from typing import TypedDict, Literal
from datetime import datetime

class MADWorkflowState(TypedDict):
    # Workflow metadata
    workflow_id: str
    created_at: datetime
    last_updated: datetime
    status: Literal["pending", "pm", "impl", "qa", "pub", "done", "failed", "pushed_back"]
    
    # Feature document tracking
    feature_name: str
    feature_file: str  # e.g., "docs/feat_onboarding_PRD.md"
    current_stage: Literal["PRD", "IMPL", "QA", "DONE"]
    
    # Agent outputs
    pm_output: dict | None
    impl_output: dict | None
    qa_output: dict | None
    pub_output: dict | None
    
    # Push-back tracking
    push_back_count: int
    push_back_history: list[dict]
    
    # Error handling
    error_message: str | None
    retry_count: int
```

**Node Functions:**
```python
def pm_agent_node(state: MADWorkflowState) -> MADWorkflowState:
    """Calls LangChain agent to execute gen_pm_auto"""
    result = langchain_agent_executor.execute(
        command="gen_pm_auto",
        workspace_path=state["workspace_path"],
        context={
            "vision_doc": "HeyLinaMobileDevOnboardingPack.md",
            "planning_docs": ["docs/roadmap.md", "docs/backlog.md"]
        }
    )
    
    # Extract feature file from result
    state["feature_file"] = result["feature_file"]
    state["feature_name"] = result["feature_name"]
    state["current_stage"] = "PRD"
    state["pm_output"] = result
    state["status"] = "impl"
    return state

def impl_agent_node(state: MADWorkflowState) -> MADWorkflowState:
    """Calls LangChain agent to execute gen_impl"""
    result = langchain_agent_executor.execute(
        command=f"gen_impl {state['feature_file']}",
        workspace_path=state["workspace_path"],
        context={"prd_file": state["feature_file"]}
    )
    
    # Update feature file (PRD -> IMPL)
    state["feature_file"] = result["updated_file"]
    state["current_stage"] = "IMPL"
    state["impl_output"] = result
    state["status"] = "qa"
    return state

def qa_agent_node(state: MADWorkflowState) -> MADWorkflowState:
    """Calls LangChain agent to execute gen_qa"""
    result = langchain_agent_executor.execute(
        command=f"gen_qa {state['feature_file']}",
        workspace_path=state["workspace_path"],
        context={"impl_file": state["feature_file"]}
    )
    
    if result["status"] == "pass":
        state["feature_file"] = result["updated_file"]
        state["current_stage"] = "QA"
        state["qa_output"] = result
        state["status"] = "pub"
    else:
        # Push back to implementer
        state["push_back_count"] += 1
        state["push_back_history"].append({
            "from": "qa",
            "to": "impl",
            "reason": result["failure_reason"],
            "timestamp": datetime.now()
        })
        state["status"] = "pushed_back"
        state["qa_output"] = result
    return state

def pub_agent_node(state: MADWorkflowState) -> MADWorkflowState:
    """Calls LangChain agent to execute gen_pub"""
    result = langchain_agent_executor.execute(
        command=f"gen_pub {state['feature_file']}",
        workspace_path=state["workspace_path"],
        context={"qa_file": state["feature_file"]}
    )
    
    state["feature_file"] = result["updated_file"]
    state["current_stage"] = "DONE"
    state["pub_output"] = result
    state["status"] = "done"
    return state
```

**Conditional Routing:**
```python
def should_continue_to_impl(state: MADWorkflowState) -> str:
    """Route after PM completes"""
    if state["status"] == "impl" and state["feature_file"]:
        return "impl"
    return "end"

def should_continue_to_qa(state: MADWorkflowState) -> str:
    """Route after Impl completes"""
    if state["status"] == "qa":
        return "qa"
    return "end"

def should_continue_to_pub(state: MADWorkflowState) -> str:
    """Route after QA - check pass/fail"""
    if state["status"] == "pub":
        return "pub"
    elif state["status"] == "pushed_back":
        # Check push-back count - too many = fail
        if state["push_back_count"] > 3:
            return "end"  # Max retries exceeded
        return "impl"  # Loop back to implementer
    return "end"
```

**Workflow Graph:**
```python
from langgraph.graph import StateGraph, END

workflow = StateGraph(MADWorkflowState)

# Add nodes
workflow.add_node("pm", pm_agent_node)
workflow.add_node("impl", impl_agent_node)
workflow.add_node("qa", qa_agent_node)
workflow.add_node("pub", pub_agent_node)

# Define edges
workflow.set_entry_point("pm")
workflow.add_conditional_edges("pm", should_continue_to_impl)
workflow.add_edge("impl", "qa")
workflow.add_conditional_edges("qa", should_continue_to_pub)
workflow.add_edge("pub", END)

# Push-back loop
workflow.add_conditional_edges("qa", should_continue_to_pub, {
    "impl": "impl",  # Loop back on push-back
    "pub": "pub",
    "end": END
})

app = workflow.compile()
```

---

### 2. Execution Layer: LangChain Agents (Not Cursor)

**Critical Reality Check:**

**Cursor is a desktop IDE, not a service.** It doesn't have:
- ❌ A public API for agent execution
- ❌ A CLI for programmatic agent calls
- ❌ A cloud service to call

**The Solution: Use LangChain Agents Instead**

Since LangGraph is built on LangChain, we use **LangChain agents** with file system tools to replicate Cursor's capabilities:

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool
from langchain_openai import ChatOpenAI
import subprocess
import os

class MADAgentExecutor:
    """LangChain agent that executes MAD commands with file system access"""
    
    def __init__(self, workspace_path: str, llm: ChatOpenAI):
        self.workspace_path = workspace_path
        self.llm = llm
        self.tools = self._create_tools()
        self.agent = self._create_agent()
    
    def _create_tools(self) -> list[Tool]:
        """Create tools for file operations, code execution, etc."""
        return [
            Tool(
                name="read_file",
                func=self._read_file,
                description="Read a file from the workspace"
            ),
            Tool(
                name="write_file",
                func=self._write_file,
                description="Write content to a file"
            ),
            Tool(
                name="run_command",
                func=self._run_command,
                description="Run a shell command (yarn, npm, etc.)"
            ),
            Tool(
                name="read_workflow_sop",
                func=self._read_workflow_sop,
                description="Read MAD workflow SOP for a specific command"
            ),
            # ... more tools
        ]
    
    def _create_agent(self):
        """Create LangChain agent with tools"""
        prompt = self._load_agent_prompt()  # Load MAD workflow SOP
        return create_openai_functions_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )
    
    def execute(self, command: str, context: dict) -> dict:
        """Execute a MAD command (gen_pm_auto, gen_impl, etc.)"""
        # Load the appropriate SOP
        sop = self._load_sop_for_command(command)
        
        # Create agent prompt with SOP + context
        agent_input = {
            "input": f"Execute: {command}\n\nContext: {context}\n\nSOP: {sop}",
            "workspace_path": self.workspace_path
        }
        
        # Execute agent
        executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            verbose=True
        )
        
        result = executor.invoke(agent_input)
        
        # Parse result and extract feature file, status, etc.
        return self._parse_agent_result(result, command)
    
    def _read_file(self, filepath: str) -> str:
        """Tool: Read file from workspace"""
        full_path = os.path.join(self.workspace_path, filepath)
        with open(full_path, "r") as f:
            return f.read()
    
    def _write_file(self, filepath: str, content: str) -> str:
        """Tool: Write file to workspace"""
        full_path = os.path.join(self.workspace_path, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w") as f:
            f.write(content)
        return f"File written: {filepath}"
    
    def _run_command(self, command: str) -> str:
        """Tool: Run shell command"""
        result = subprocess.run(
            command.split(),
            cwd=self.workspace_path,
            capture_output=True,
            text=True
        )
        return result.stdout or result.stderr
    
    def _read_workflow_sop(self, command: str) -> str:
        """Tool: Read MAD workflow SOP"""
        sop_file = ".mad-workflows/workflows/feature-creation.md"
        return self._read_file(sop_file)
```

**Key Insight:**

Instead of "calling Cursor," we're **replacing Cursor agents with LangChain agents** that have:
- ✅ File system access (read/write files)
- ✅ Code understanding (via LLM)
- ✅ Tool execution (run commands, tests, linters)
- ✅ Same workflow logic (read MAD SOPs and follow them)

**This is actually better** because:
- LangGraph + LangChain are designed to work together
- Full programmatic control (no IDE dependency)
- Can run headless on servers
- Better for automation and scheduling

---

### 3. Scheduler Component

**Using APScheduler (or similar):**
```python
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

class MADScheduler:
    def __init__(self, workflow_app, agent_executor):
        self.workflow_app = workflow_app
        self.agent_executor = agent_executor
        self.scheduler = BackgroundScheduler()
    
    def schedule_auto_pm(self, interval_hours: int = 3):
        """Schedule gen_pm_auto to run every N hours"""
        self.scheduler.add_job(
            self._run_auto_pm_workflow,
            trigger=IntervalTrigger(hours=interval_hours),
            id="auto_pm_workflow",
            replace_existing=True
        )
        self.scheduler.start()
    
    def _run_auto_pm_workflow(self):
        """Trigger a new MAD workflow starting with gen_pm_auto"""
        initial_state = {
            "workflow_id": str(uuid.uuid4()),
            "created_at": datetime.now(),
            "status": "pending",
            "workspace_path": "/path/to/HeyLinaAlt",
            "push_back_count": 0,
            "push_back_history": [],
            "retry_count": 0
        }
        
        # Run workflow
        final_state = self.workflow_app.invoke(initial_state)
        
        # Log result
        self._log_workflow_result(final_state)
```

---

### 4. State Persistence

**Using LangGraph's built-in checkpointer:**
```python
from langgraph.checkpoint.sqlite import SqliteSaver

# Create checkpointer
checkpointer = SqliteSaver.from_conn_string(":memory:")  # Or file path

# Compile with checkpointer
app = workflow.compile(checkpointer=checkpointer)

# Resume workflow
thread_id = "workflow_123"
app.invoke(initial_state, config={"configurable": {"thread_id": thread_id}})
```

**Custom persistence for scheduled workflows:**
```python
class WorkflowPersistence:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_db()
    
    def save_workflow_state(self, state: MADWorkflowState):
        """Save workflow state to database"""
        # Store in SQLite/PostgreSQL
        pass
    
    def load_workflow_state(self, workflow_id: str) -> MADWorkflowState:
        """Load workflow state from database"""
        pass
    
    def list_active_workflows(self) -> list[MADWorkflowState]:
        """List all active (non-done) workflows"""
        pass
```

---

## Implementation Plan

### Phase 1: MVP (Manual Trigger)
1. ✅ Create LangGraph workflow definition
2. ✅ Implement Cursor agent interface (Option C - file-based)
3. ✅ Test single workflow run (PM → Impl → QA → Pub)
4. ✅ Add state persistence
5. ✅ Handle push-back loops

### Phase 2: Scheduling
1. ✅ Add scheduler component
2. ✅ Configure 3-hour interval
3. ✅ Add workflow queue (handle overlapping runs)
4. ✅ Add logging/monitoring

### Phase 3: Production Hardening
1. ✅ Error recovery and retries
2. ✅ Notification system (Slack/Discord on completion/failure)
3. ✅ Workflow dashboard/UI
4. ✅ Rate limiting and resource management

---

## File Structure

**Location:** `tools/mad-orchestrator/` (separate from HeyLina app code)

```
tools/
└── mad-orchestrator/
    ├── __init__.py
    ├── workflow.py          # LangGraph workflow definition
    ├── cursor_interface.py  # Cursor agent interface
    ├── scheduler.py         # Scheduling component
    ├── persistence.py       # State persistence
    ├── config.py            # Configuration
    ├── config.yaml          # Configuration file
    ├── requirements.txt     # Python dependencies
    └── scripts/
        ├── start_orchestrator.py  # Main entry point
        └── run_workflow.py        # Manual workflow trigger
```

**Documentation:** `.mad-workflows/docs/automated-orchestration-design.md` (this file)

---

## Configuration

**`tools/mad-orchestrator/config.yaml`:**
```yaml
workspace:
  path: "/path/to/HeyLinaAlt"
  
scheduling:
  auto_pm_interval_hours: 3
  enabled: true
  
workflow:
  max_push_backs: 3
  max_retries: 2
  timeout_minutes: 60
  
agent:
  type: "langchain"  # Using LangChain agents (not Cursor)
  llm_provider: "openai"  # or "anthropic", "ollama", etc.
  model: "gpt-4"  # or "claude-3-opus", etc.
  api_key: null  # OpenAI/Anthropic API key (set via env var)
  
persistence:
  type: "sqlite"
  db_path: "tools/mad-orchestrator/workflows.db"
  
notifications:
  enabled: false
  webhook_url: null
```

---

## Usage

### Start Orchestrator
```bash
cd tools/mad-orchestrator
python scripts/start_orchestrator.py
```

### Manual Trigger
```bash
cd tools/mad-orchestrator
python scripts/run_workflow.py
```

### Check Status
```bash
cd tools/mad-orchestrator
python scripts/status.py
```

---

## Challenges & Solutions

### Challenge 1: No Cursor API/CLI
**Problem:** Cursor is a desktop IDE, not a service. It doesn't have an API or CLI for programmatic agent execution.

**Solution:** 
- Use LangChain agents instead (which LangGraph is built on)
- LangChain agents can have file system access, code understanding, and tool execution
- They read your MAD workflow SOPs and follow them, just like Cursor agents would
- This is actually better for automation since it's designed for programmatic use

### Challenge 2: Long-Running Workflows
**Problem:** Full MAD cycle (PM → Impl → QA → Pub) can take hours.

**Solution:**
- Use LangGraph checkpointer for state persistence
- Workflows can pause/resume
- Async execution with proper timeout handling

### Challenge 3: Push-Back Loops
**Problem:** QA might push back multiple times, creating infinite loops.

**Solution:**
- Track `push_back_count` in state
- Set max retries (e.g., 3)
- After max retries, mark workflow as "failed" and notify

### Challenge 4: Concurrent Workflows
**Problem:** Scheduled workflow might start while previous one is still running.

**Solution:**
- Workflow queue system
- Check for active workflows before starting new one
- Option: Skip if active, or queue for later

---

## Next Steps

1. **Validate approach** - Review this design with team
2. **Set up environment** - Install LangGraph, dependencies
3. **Implement MVP** - Start with Phase 1 (manual trigger)
4. **Test end-to-end** - Run full workflow manually
5. **Add scheduling** - Implement Phase 2
6. **Deploy** - Run as background service

---

## References

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [APScheduler Documentation](https://apscheduler.readthedocs.io/)
- MAD Workflows: `.mad-workflows/workflows/feature-creation.md`

