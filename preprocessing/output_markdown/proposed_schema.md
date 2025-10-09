# Proposed Graph Schema for Output Markdown Corpus

## Entity Types
- Project
- Person
- Organization
- Team
- Objective
- Deliverable
- Capability
- Achievement
- Challenge
- DataType
- Technique
- UseCase
- Milestone
- Domain

## Relationship Triplets
- Project-HAS_DIRECTOR->Person
- Project-SERVES_END_USER->Organization
- Project-HAS_PIC->Person
- Project-COLLABORATES_WITH->Person
- Project-COLLABORATES_WITH->Organization
- Project-HAS_TEAM->Team
- Team-INCLUDES_MEMBER->Person
- Project-HAS_OBJECTIVE->Objective
- Project-PURSUING_TARGET->Deliverable
- Project-DELIVERS_CAPABILITY->Capability
- Project-RECENT_ACHIEVEMENT->Achievement
- Project-FACES_CHALLENGE->Challenge
- Project-USES_DATATYPE->DataType
- Project-APPLIES_TECHNIQUE->Technique
- Project-ENABLES_USE_CASE->UseCase
- Project-ALIGNS_WITH_DOMAIN->Domain
- Project-HAS_MILESTONE->Milestone
- Milestone-FOCUSES_ON->Deliverable

## Notes on Usage
- Treat specific initiatives such as "99P Deploying Data Driven Digital Twins" or "99P Cloud Edge Emulator" as `Project` nodes. Their directors, PICs, collaborators, and team rosters populate the `Person`, `Organization`, and `Team` entities described in the markdown files.
- Capture articulated objectives, targets, and background focus areas as `Objective`, `Deliverable`, `Capability`, `UseCase`, `Technique`, or `Domain` nodes depending on whether they describe goals, concrete outputs, platform abilities, application scenarios, enabling methods, or thematic areas.
- Timeline callouts (for example, Task 1–3 bars or HTF milestones) become `Milestone` nodes that can be linked back to the relevant deliverables they advance.
- Use `DataType` nodes for the modality breakdowns (e.g., CAN bus, LiDAR, GPS, text) so mobility projects can relate to the heterogeneous sources they integrate.
- Apply the `Project-APPLIES_TECHNIQUE->Technique` edge for architectural approaches such as digital twins, containerization, or modular LLM decomposition.
