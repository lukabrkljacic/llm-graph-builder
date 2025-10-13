# Knowledge Graph Schema

The `output_markdown` schema supports a comprehensive organizational knowledge graph.

## Key Node Types
- **Person**: Individuals within the organization
- **Organization**: Departments, groups, or teams
- **Project**: Research or development initiatives
- **Team**: Collaborative groups
- **Paper**: Published research papers
- **Conference**: Academic conferences
- **Award**: Recognition awards
- **Skill**: Technical or soft skills
- **ResearchArea**: Areas of research focus
- **Department**: Organizational departments
- **Event**: Workshops, seminars, meetings
- **DataFile**: Files/data associated with projects
- **Tool**: Software/tools used in projects
- **Location**: Physical or virtual locations

## Key Relationships

### People & Affiliations
- `Person-HAS_AFFILIATION->Organization`
- `Person-WORKS_ON->Project`
- `Person-COLLABORATES_WITH->Person`
- `Person-ASSIGNED_TO->Team`

### Publications & Recognition
- `Person-WROTE_PAPER->Paper`
- `Person-ATTENDED_EVENT->Event`
- `Person-RECEIVED_AWARD->Award`
- `Person-MASTERS_SKILL->Skill`
- `Person-HAS_RESEARCH_AREA->ResearchArea`

### Organization Structure
- `Organization-HAS_DEPARTMENT->Department`
- `Organization-CONTAINS->Person`
- `Organization-OWNS->Project`
- `Organization-ALLOCATES_RESOURCES_TO->Project`

### Projects & Deliverables
- `Project-HAS_DIRECTOR->Person`
- `Project-SERVES_END_USER->Organization`
- `Project-HAS_PIC->Person`
- `Project-COLLABORATES_WITH->Person`
- `Project-COLLABORATES_WITH->Organization`
- `Project-HAS_TEAM->Team`
- `Project-HAS_OBJECTIVE->Objective`
- `Project-PURSUING_TARGET->Deliverable`
- `Project-DELIVERS_CAPABILITY->Capability`
- `Project-RECENT_ACHIEVEMENT->Achievement`
- `Project-FACES_CHALLENGE->Challenge`
- `Project-USES_DATATYPE->DataType`
- `Project-APPLIES_TECHNIQUE->Technique`
- `Project-ENABLES_USE_CASE->UseCase`
- `Project-ALIGNS_WITH_DOMAIN->Domain`
- `Project-HAS_MILESTONE->Milestone`
- `Project-STORES_DATA->DataFile`
- `Project-REFERENCES_DATA->DataFile`
- `Project-PUBLISHES->Paper`
- `Project-USES_TOOL->Tool`

### Publications & Citations
- `Paper-PUBLISHED_BY->Person`
- `Paper-PUBLISHED_IN->Conference`
- `Paper-REFERENCES->Paper`
- `Paper-CITED_BY->Paper`

### Skills & Competencies
- `Skill-USED_IN->Project`
- `Skill-DEVELOPED_BY->Person`

### Research Areas
- `ResearchArea-EXPLORED_BY->Person`
- `ResearchArea-RELATED_TO->Domain`

### Events & Locations
- `Event-INVOLVES->Person`
- `Event-ORGANIZED_BY->Organization`
- `Event-RELATED_TO->Project`
- `Location-CONTAINS->Organization`

## Capabilities Enabled by Schema

This schema enables users to:
1. Search by person to find their projects, collaborations, skills, and publications
2. Explore projects and see team members, collaborators, and associated data
3. Find colleagues with specific expertise or research areas
4. Discover relevant publications and papers
5. Identify potential collaborators based on shared projects or skills
6. Understand organizational structure and departmental affiliations
7. Locate data and files associated with specific projects
8. Find events and conferences relevant to their interests
9. See recognition and awards received by team members