# Slide 1

# Description:
---
doc_title: "99P Embedded system design for hardware agnostic-software patterns"
page_index: 5
total_pages: 1
page_type: mixed
confidence_overall: 0.66
languages_detected: ["English"]
detected_sections: ["Start / End:", "Director of Project:", "End-User:", "A00 Develop a software defined ecosystem with flexibility and scale utilizing the latest technologies", "Targets / Minimum Viable Prototype", "Recent Achievements", "Project Plan", "Background, Current Challenges and Barriers", "Challenges:"]
figures_detected: 4
tables_detected: 1
equations_detected: 0
footnotes_detected: 0
watermarks_or_stamps: false
---

# Theme Poster: 99P Embedded system design for hardware agnostic-software patterns

Start / End: Jan 2024 – Dec 2025
Director of Project: Duane Detwiler
End-User: HG/HM/ADC

PIC:
Collaborators: Brian Coy
Ben Davis, Luka Brkljacic (Internal)

---

## A00 Develop a software defined ecosystem with flexibility and scale utilizing the latest technologies

---

### Targets / Minimum Viable Prototype

1) Develop Over The Air (OTA) to deliver updates to devices
2) Create cloud development environment
3) Cluster compute for embedded systems
4) Containerized applications with Robotic Operating System (ROS)
5) Peer to Peer (P2P) Communication

---

### Recent Achievements

- P2P communication
- Cluster computation for embedded systems

Papers: x1 submitted / x1 planning
Patents: Not Applicable
HTF: x2

---

### Project Plan

- Timeline months shown: May → Jun → Jul → Aug → Sep → Oct → Nov → Dec
- Tasks indicated:
  - Task 3 (spans from May → Jun)
  - Task 4 (spans from Jun → Sep)
  - Task 5 (spans from Jul → Dec)
  - HTF (star marker at Dec)

---

## Background, Current Challenges and Barriers

Containerization to enable the flexibility to only affect the application(s) that is intended to affect

**Figure 1. Containerization diagrams and VM vs Containers comparison**
- Visible elements:
  - Three deployment diagrams labeled (left to right): Traditional Deployment, Virtualized Deployment, Container Deployment (visual stacks of App, Bin/Library, Operating System, Hypervisor, Hardware, Container Runtime shown)
  - A comparison table with two columns: "VMs" and "Containers"
- Table contents (as visible):

| VMs | Containers |
|---|---|
| Heavyweight. | Lightweight. |
| Limited performance. | Native performance. |
| Each VM runs in its own OS. | All containers share the host OS. |
| Hardware-level virtualization. | OS virtualization. |
| Startup time in minutes. | Startup time in milliseconds. |
| Allocates required memory. | Requires less memory space. |
| Fully isolated and hence more secure. | Process-level isolation, possibly less secure. |

```csv
"VMs","Containers"
"Heavyweight.","Lightweight."
"Limited performance.","Native performance."
"Each VM runs in its own OS.","All containers share the host OS."
"Hardware-level virtualization.","OS virtualization."
"Startup time in minutes.","Startup time in milliseconds."
"Allocates required memory.","Requires less memory space."
"Fully isolated and hence more secure.","Process-level isolation, possibly less secure."
```

**Figure 2. Migration from a Client/Server (Centralized) architecture to a Peer to Peer (Decentralized) to distribute software.**
- Visible elements:
  - Left diagram labeled "Centralized architecture" showing cloud connecting to multiple cars/devices.
  - Right diagram labeled "De-centralized architecture" showing devices (cars) connected to each other with many-to-many links.
  - A red divider between centralized and decentralized illustrations.
- Caption text (red): "Migration from a Client/Server (Centralized) architecture to a Peer to Peer (Decentralized) to distribute software."

Challenges:
1. Long range communication
2. File transfer with intermittently connected devices
3. Combining multiple devices to act as a centralized system of individual compute

**Figure 3. Small map / P2P Process image**
- Visible elements:
  - A map image with inset labeled "P2P Process" (small inset with route lines).
  - On the inset/top of image, small labels appear: "Jim's Apps" and "Mike's Apps" (visible).
- Note: finer map text and some inset details are small and partly illegible.

**Figure 4. Additional small diagrams (icons: drone, cars, traffic lights)**
- Visible elements:
  - Icons of vehicles, drone, and simple network lines illustrating connectivity patterns.
  - Labels near clouds and devices: "Centralized architecture" (visible).
- Many small callouts and icons are present; some textual labels on these small diagrams are partially illegible.

## References
[none visible]

## Page artifacts
- Header: "Theme Poster: 99P Embedded system design for hardware agnostic-software patterns" (center)
- Left top small TRL colored boxes 1..9 with "6" highlighted in red (visual)
- Footer: none visible (no legible footer text)
- Page number: 5 (top right)
- Watermark or stamp: none visible

## Lossy_Description
- Small inset map details and many small diagram callouts are partially illegible due to size/resolution; where specific small labels could not be confidently read they are marked as partially illegible or omitted.
- Some collaborator/PIC placement in the header area was inferred by proximity; exact original layout (column boundaries and separators) preserved as best visible.

# Slide 2

# Description:
---
doc_title: "99P Embedded system design for hardware agnostic-software patterns"
page_index: 1
total_pages: 1
page_type: content
confidence_overall: 0.88
languages_detected: ["English"]
detected_sections: ["99P Embedded system design for hardware agnostic-software patterns", "1. Background", "2. Methods", "3. Findings"]
figures_detected: 0
tables_detected: 0
equations_detected: 0
footnotes_detected: 0
watermarks_or_stamps: false
---

# 99P Embedded system design for hardware agnostic-software patterns

This project is building a flexible,
hardware-agnostic software
ecosystem for embedded systems
using containerization, cloud tools,
and peer-to-peer communication.
It enables scalable, over-the-air
updates and decentralized
computing across diverse devices.

## 99P Labs Team:
Brian Coy
Ben Davis
Luka Brklijacic

## 1. Background
Embedded systems are the backbone of many smart devices, from vehicles to industrial machines. However, traditional embedded software is often tightly coupled with specific hardware, making it hard to update, scale, or repurpose across platforms. This project tackles that challenge by designing a flexible, software-defined ecosystem that is hardware-agnostic. The goal is to decouple applications from underlying hardware through modern technologies like containerization, cloud environments, and peer-to-peer (P2P) communication. The team is also addressing a shift from centralized (client-server) architectures to decentralized, peer-based systems, enabling more resilient and scalable networks for connected devices.

## 2. Methods
The project is using a container-based approach, where each software component runs in isolated environments, allowing specific applications to be updated or managed without affecting the entire system. Key technologies and design methods include:
- Over-The-Air (OTA) updates to remotely deliver new features or fixes.
- Cloud-based development environments to streamline testing and deployment.
- Cluster computing for embedded systems, enabling devices to pool their computing resources.
- Integration with Robot Operating System (ROS) for containerized robotic applications.
- Implementation of Peer-to-Peer (P2P) communication to enhance decentralization and reduce single points of failure.

A phased project timeline runs from January 2024 to December 2025, with recent accomplishments including working prototypes for P2P communication and cluster computing.

## 3. Findings
So far, the team has demonstrated working P2P communication and cluster computation capabilities among embedded systems, confirming the feasibility of this decentralized, container-based architecture. These advances pave the way for scalable deployment across varied hardware platforms.

Notably, the migration from centralized to decentralized systems has allowed:
- Better system resilience.
- Flexibility in updates and deployment.
- Support for dynamic, distributed computing models.

However, challenges remain, including:
- Managing long-range communication efficiently.
- Handling intermittent connectivity between devices.
- Coordinating multiple edge devices as part of a coherent, centralized logic model.

## Page artifacts
- Header: [none visible]
- Footer: [none visible]
- Page number: [none visible]
- Watermark or stamp: none

## Lossy_Description
- Text is transcribed faithfully from the single-page image. No significant content was illegible.