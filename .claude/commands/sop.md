# Software Company SOP Pipeline

Core Philosophy: **Code = SOP(Team)**
Materialize SOP and apply it to teams composed of LLMs.

## Requirement
$ARGUMENTS

---

## Pipeline

```
Requirement → Product Manager → Architect → Engineer → Code Review
                    ↓               ↓           ↓            ↓
                   PRD          System       Code      LGTM/LBTM
                              Design
```

---

## Phase 1: Product Manager

### Output: PRD Document

| Field | Description |
|-------|-------------|
| Language | Match user's requirement language |
| Programming Language | Default: Vite, React, MUI, Tailwind CSS |
| Original Requirements | User's requirements |
| Project Name | snake_case style |
| Product Goals | Up to 3 clear, orthogonal goals |
| User Stories | 3-5 scenario-based stories |
| Competitive Analysis | 5-7 competitive products |
| Competitive Quadrant Chart | Mermaid quadrantChart |
| Requirement Analysis | Detailed analysis |
| Requirement Pool | Top-5 with P0/P1/P2 priority |
| UI Design draft | UI elements, functions, style, layout |
| Anything UNCLEAR | Unclear aspects to clarify |

---

## Phase 2: Architect

### Output: System Design

| Field | Description |
|-------|-------------|
| Implementation approach | Difficult points analysis, framework selection |
| File list | Relative paths only |
| Data structures and interfaces | Mermaid classDiagram, VERY DETAILED |
| Program call flow | Mermaid sequenceDiagram, COMPLETE |
| Anything UNCLEAR | Unclear aspects to clarify |

---

## Phase 3: Engineer

### Rules
- MUST FOLLOW "Data structures and interfaces"
- DON'T CHANGE ANY DESIGN
- Write EVERY CODE DETAIL
- DON'T LEAVE TODO OR PLACEHOLDER
- Write one file at a time with FULL implementation

### Output
- All source code files as specified in File list
- Complete, runnable code

---

## Phase 4: Code Review

### Checklist
1. Code implemented as per requirements?
2. Code logic completely correct?
3. Follows "Data structures and interfaces"?
4. All functions implemented?
5. All dependencies imported?
6. Methods reused correctly?

### Result
- **LGTM**: Code approved, proceed to build
- **LBTM**: Rewrite code and re-review

---

## Execution

Execute phases sequentially:

1. Complete Phase 1 → Output PRD
2. Complete Phase 2 → Output System Design  
3. Complete Phase 3 → Output Code
4. Complete Phase 4 → LGTM/LBTM
5. If LBTM → Fix and re-review
6. If LGTM → Build and deploy

After each phase:
```
✅ Phase {N} Complete
📄 Deliverables: {files}
➡️ Proceeding to Phase {N+1}
```
