# Slide 1

# Description:
---
doc_title: "Theme Poster: 99P Cloud Edge Emulator"
page_index: 3
total_pages: 1
page_type: mixed
confidence_overall: 0.85
languages_detected: ["en"]
detected_sections: ["Header", "A00", "Targets / Minimum Viable Prototype", "Recent Achievements", "Project Plan", "Background, Current Challenges and Barriers", "Areas of Interest", "Page artifacts"]
figures_detected: 1
tables_detected: 1
equations_detected: 0
footnotes_detected: 0
watermarks_or_stamps: false
---

# Theme Poster: 99P Cloud Edge Emulator

## Header (top metadata)
- TRL: [visual row of boxes labeled 1 2 3 4 5 6 7 8 9 with 6 highlighted]
- Start / End:
  - 5/2024 – 5/2026 +
- Director of Project:
  - Duane Detwiler
- End-User:
  - HGRX
- PIC:
  - Tony Fontana, Rajeev Chhajer
- Collaborators:
  - Majd Sakr, Anthony Rowe, Greg Ganger, Chris Bogart – CMU
  - Deepak Ganesan - UMass Amherst (Potential)

---

## A00
Develop a cloud-edge emulator that can facilitate streamlined cloud-edge development in software, effectively manage compute system resource allocation, optimize performance, and evaluate complex compute, networking and real-world simulation systems.

---

## Targets / Minimum Viable Prototype
- Internally develop MVP for the emulation environment. Create toolset that can constrain compute and networking accurately to represent complex compute systems.
- Create evaluation metrics for a successful compute and application system, trade off study development.
- Develop more detailed network emulation system. (Network type considerations, real world interference, more realism).

---

## Recent Achievements
- [Left image] Emulator design creation
- [Right image] CPU + GPU + Network constraints developed in MVP, Test case developed, testing began

---

## Project Plan
- Timeline graphic with quarters (Q1 Q2 Q3 Q4 Q1 Q2) and milestones including:
  - "24Ki Q1" (left)
  - "25Ki Q1" (near right)
  - MVP Kick-off & Development (Internal)
  - HTF & Correlations
  - Partner Identification (Possible UMass Amherst)
  - Schedule TBD

(Graphic timeline; exact positions and some short labels are partially illegible.)

---

## Background, Current Challenges and Barriers

**[Figure 1. Digital space ⇄ Real world schematic]**
- Axes / Elements visible:
  - Top label: "Digital space"
  - Bottom label: "Real world"
  - Arrows showing flow between digital and real
  - Multiple small inset images/icons showing vehicles, sensors, people, road, infrastructure
  - Callouts: "Predict future risks", "Respond to risks 10 seconds ahead to prevent them", "Feed back response method", and other small annotations (some annotations partially illegible)
- Legend / labels: several boxes and arrows illustrating information flow from sensors to digital simulations and back.

With on-demand computing penetrating across the hardware and cloud continuum in a smart city context, many architectures and full-stack software paradigms are emerging such as Centralized, Decentralized, Distributed and Mesh as a few examples to enable "Systems to Cooperate"

- Embedding systems and edge compute are increasingly important for managing latency, throughput, performance, cost, and scale.
- Careful consideration needed in system design before deployment.
- These systems are becoming so complex with hundreds of IoT components and devices all needing to communicate and collaborate.
- **There is no current way to benchmark, measure or evaluate these complex systems**

> Lack of benchmarking metrics adds complexity to creating optimal systems. Emulation environments help design, test, and speed up system development.

---

## Areas of Interest
- Multi-modal Network Emulation
- Workload Placement Optimization
  - Study where workloads should run: cloud, edge server, or device.
- Resource-Constrained Compute Models
- Real-World Stimuli
  - Trigger edge cases like network drop, power loss, interference.

---

## References
[none visible on page]

## Page artifacts
- Header: "Theme Poster: 99P Cloud Edge Emulator"
- Footer: [none legible]
- Page number: 3 (top-right)
- Watermark or stamp: none visible

## Lossy_Description
- Small timeline labels and some numeric labels ("24Ki", "25Ki") are partially illegible and their precise meaning/context could not be fully determined.
- Some small annotations and text inside the central figure are partially illegible; figure elements are summarized rather than fully transcribed.
- Very small images/captions in "Recent Achievements" reproduced as short captions; detailed contents of those images are not fully legible.

# Slide 2

# Description:
---
doc_title: "99P Cloud Edge Emulator"
page_index: 1
total_pages: 1
page_type: content
confidence_overall: 0.88
languages_detected: ["English"]
detected_sections: ["99P Cloud Edge Emulator", "1. Background", "2. Methods", "3. Findings", "99P Labs Team:", "CMU Team:"]
figures_detected: 0
tables_detected: 0
equations_detected: 0
footnotes_detected: 0
watermarks_or_stamps: false
---

# 99P Cloud Edge Emulator

The 99P Cloud Edge Emulator is a
software-only sandbox that lets
engineers rehearse cloud-to-edge
deployments, dynamically modeling
CPU, GPU, and network constraints.
By surfacing bottlenecks and
quantifying trade-offs before any
hardware is purchased, it cuts
design risk, cost, and time-to-
deploy.

99P Labs Team:
- Tony Fontana
- Rajeev Chhajer

CMU Team:
- Majd Sakr
- Anthony Rowe
- Greg Ganger
- Chris Bogart

1. Background
Digital services increasingly straddle “the cloud” and the physical world. Smart-city cameras, factory sensors and autonomous vehicles all push data to nearby edge servers for rapid processing, while still relying on remote cloud clusters for heavier analytics. Designing these split-layer systems is tricky: developers must juggle CPU, GPU and networking limits, decide where each workload should run, and be confident the final design will survive real-world glitches such as congestion or a sudden power cut. Today there is no standard way to benchmark or rehearse such complex, distributed deployments before expensive hardware is purchased or deployed in the field.

2. Methods
The 99P Cloud Edge Emulator tackles this gap by building a purely software testbed that can:
- **Constrain resources on demand** – The platform dials CPU, GPU and network capacity up or down, reproducing everything from a lightweight IoT device to a 5G backhaul link.
- **Inject realistic network conditions** – Latency spikes, packet loss, radio interference and power outages can be scripted to mirror harsh, real-world scenarios.
- **Guide workload placement** – Built-in analytics explore “what-if” mappings (cloud vs. edge vs. device) to spot the trade-offs among latency, cost and energy.
- **Define objective metrics** – A new scorecard quantifies overall system performance, resource efficiency and quality of experience, making designs comparable across projects.

The internal team has produced a minimum viable prototype (MVP) and toolset, collaborating with researchers at Carnegie Mellon and (potentially) UMass Amherst. A detailed roadmap runs from Q1 2024 through mid-2026, adding multi-modal network emulation, richer compute models and expanded real-world stimuli.

3. Findings
Early tests show the emulator can already replicate combined CPU + GPU limits and network constraints for a sample application, allowing engineers to detect bottlenecks before hardware purchase. The approach promises three tangible benefits:
- **Faster design cycles** – Teams iterate in software rather than re-cabling lab gear or shipping devices to the field.
- **Better-performing deployments** – Quantitative metrics highlight the most efficient workload split, trimming latency and energy use.
- **Shared benchmarks for the community** – A common yardstick will let industry and academia compare edge-cloud architectures head-to-head, accelerating research on decentralized, distributed and mesh systems.

As the project matures, the 99P Cloud Edge Emulator aims to become the go-to “flight simulator” for edge computing, helping designers build trustworthy, scalable systems before a single sensor is screwed into place.

## References
[none visible]

## Page artifacts
- Header: [none visible]
- Footer: [none visible]
- Page number: 1
- Watermark or stamp: none

## Lossy_Description
- Minor line-wrapping decisions were normalized into paragraph form (left-column paragraph originally displayed with visual line breaks). No substantive text was illegible.