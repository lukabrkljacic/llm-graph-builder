# Slide 1

# Description:
---
doc_title: "99P Multimodal Data Management for Mobility"
page_index: 1
total_pages: 1
page_type: mixed
confidence_overall: 0.79
languages_detected: ["English"]
detected_sections: ["Theme Poster: 99P Multimodal Data Management for Mobility", "Start / End:", "A00", "Targets / Minimum Viable Prototype", "Recent Achievements", "Project Plan", "Background, Current Challenges and Barriers"]
figures_detected: 2
tables_detected: 0
equations_detected: 0
footnotes_detected: 0
watermarks_or_stamps: false
---

# Theme Poster: 99P Multimodal Data Management for Mobility

Start / End: Jan 2024 – Dec 2025
Director of Project: Duane Detwiler
PIC: Rajeev Chhajer, Ryan Lingo
End-User: HG/HM (anticipate tools/infra for HG/HM)
Collaborators: Hojin Yoo(PhD student), Prof Arnab Nandi

---

## A00
Investigate methods to unify diverse mobility data using a multi-modal learning approach

---

## Targets / Minimum Viable Prototype
1) Multimodal mobility embeddings
2) Guided querying over Videos
3) Dataset summarization
4) Embeddings Explorer for Videos
5) Multi-modal data to knowledge graphs generation

---

## Recent Achievements
- Search phrase with emoji generation
- Agent-Based Trip Summarization
- Development of Embeddings explorer

Papers: x1 submitted / x1 planning
Patents: Not Applicable
HTF: x2

(Three small illustrative images / screenshots present in original page: thumbnails of embedding visualizations and UI screenshots.)

---

## Project Plan
Timeline (May → Dec) with tasks and HTF milestone:

- May → Jun → Jul → Aug → Sep → Oct → Nov → Dec
  - Task 3 (arrow spanning May→Jul)
  - Task 4 (arrow spanning Jul→Oct)
  - Task 5 (arrow spanning Aug→Nov)
  - HTF (star at Dec)

(Note: original contains a graphical timeline with chevron month markers and arrows for each task; reproduced here as text.)

---

## Background, Current Challenges and Barriers

Time series data
- CAN bus, V2X sensors, radar

Video and image data
- Dashcam, surround cameras, LiDAR

Spatial and positional data
- GPS, accelerometer

Text data
- Location description, user profiles

Vehicle (icon present near data types)

**Heterogeneity in nature of data: difficult to integrate and use together .**

Extracting insights & intelligence from multi-modal data is hard, limiting a sustainable way to build AI applications in Mobility leveraging a rich data ecosystem

A foundation model (LLM) for mobility will enable the distillation of observed transportation knowledge into a powerful artifact. Such a model can be used to power a variety of use cases ranging from vehicle design, mobility analytics, to multi-vehicle traffic operations.

The overarching vision of a foundation model will require infrastructure for preparation of training, fine-tuning, and prompting data. This project seeks to develop building blocks of such a data infrastructure.

**Figure 1. Mobility data types diagram (summary)**
- Elements visible:
  - Time series data: "CAN bus, V2X sensors, radar"
  - Video and image data: "Dashcam, surround cameras, LiDAR"
  - Spatial and positional data: "GPS, accelerometer"
  - Text data: "Location description, user profiles"
  - Central vehicle icon labeled "Vehicle"

**Figure 2. System / capability stack (colored stacked boxes)**
- Top layer (green): "Mobility Conductor" (left) and "Trip Summarization" (right)
  - Right of boxes label: "MOBILITY AI APPLICATIONS"
  - Tag near "Trip Summarization": "RT3"
- Second layer (light blue): "Foundation Models" (left) and "Mobility Embeddings" (right)
  - Tag near "Mobility Embeddings": "RT1"
  - Label under this layer: "MODEL INFRASTRUCTURE"
- Third layer (blue): "Multimodal Integration" (left) and "Vector Indexing" (right)
  - Tags: left "RT1", right "RT2"
  - Label under this layer: "FEATURE & PERFORMANCE ENGINEERING"
- Bottom layer (yellow): "Synthetic Data Generation" (left) and "Existing Datasets" (right)
  - Tag near "Synthetic Data Generation": "RT4"
  - Label under this layer: "DATA PREPARATION"

(No explicit numeric data table present in figures.)

---

## References
[None visible on page]

## Page artifacts
- Header: "Theme Poster: 99P Multimodal Data Management for Mobility" (center)
- Left-top: TRL row with squares 1..9, 6 highlighted (graphic)
- Page number: 9 (top-right)
- Footer: none clearly visible

## Lossy_Description
- Several small images/screenshots and fine graphical elements (embedding scatterplot, UI screenshots, timeline chevrons) could not be transcribed as text; they are referenced but not fully reproduced.
- Exact layout, colors, and small icon text (where extremely small) were summarized rather than exact-character transcribed.

# Slide 2

# Description:
---
doc_title: "99P Multimodal Data Management for Mobility"
page_index: 1
total_pages: 1
page_type: content
confidence_overall: 0.92
languages_detected: ["English"]
detected_sections: ["Title / Intro paragraph", "99P Labs Team", "The Ohio State University Team", "1. Background", "2. Methods", "3. Findings", "Concluding paragraph"]
figures_detected: 0
tables_detected: 0
equations_detected: 0
footnotes_detected: 0
watermarks_or_stamps: false
---

# 99P Multimodal Data Management for Mobility

This project develops AI methods to unify diverse mobility data such as video, sensor, and GPS using a multi-modal learning approach, enabling smarter and more integrated transportation analytics. By building foundational tools for data integration, it paves the way for scalable AI applications in mobility, from trip summarization to multi-vehicle coordination.

99P Labs Team:
Rajeev Chhajer
Ryan Lingo

The Ohio State University Team:
Hojin Yoo
Arnad Nandi

## 1. Background
Modern transportation systems generate vast and varied data, including GPS and accelerometer readings, video footage, vehicle sensor data, and user-generated text. While rich in insights, this multi-modal data is extremely heterogeneous, which makes it difficult to integrate, analyze, and apply effectively in AI-driven mobility solutions. This project addresses that challenge by aiming to unify these diverse data sources to support more intelligent and efficient mobility systems.
The goal is to lay the groundwork for AI tools and infrastructure that can operate effectively across this complex data landscape, enabling better decision-making, planning, and mobility analytics.

## 2. Methods
To address the data fragmentation problem, the project is developing a foundation model (LIM: Large-scale Integrated Model) tailored for mobility applications. This model will be capable of learning from multiple data types and will enable several downstream tasks, such as:
- Multimodal mobility embeddings, which create unified representations of data from video, sensors, text, and more
- Guided querying over videos, allowing for interactive and context-aware exploration
- Dataset summarization, which compresses large-scale data into more understandable formats
- Embeddings Explorer for Videos, a visual tool for interpreting how AI models understand video content
- Graph-based knowledge generation, which turns raw data into structured knowledge
The architecture includes an integrated pipeline for data ingestion, synthetic data generation, embedding creation, vector indexing, and search. Tools like the "Trip Summarization" and "Mobility Conductor" modules are also being developed to showcase practical applications.

## 3. Findings
Although the project is still in progress ( Jan 2024 to Dec 2025), several milestones have already been achieved:
- A search phrase system with emoji generation for intuitive querying
- An Agent–Based Trip Summarization method that simplifies mobility event data
- An initial version of the Embeddings Explorer, which helps visualize and interpret AI-generated representations

These early results show that integrating multi-modal mobility data into a unified learning framework is not only feasible but can significantly enhance transportation analytics and planning. With one paper submitted and another in planning, the project is making strong research contributions while also focusing on tools that will be useful for a wide range of mobility applications. The outcomes are expected to support smarter mobility systems, improve data accessibility, and enable scalable AI infrastructure for transportation.

## References
[None visible]

## Page artifacts
- Header: "99P Multimodal Data Management for Mobility" (large title at top-left)
- Footer: none visible
- Page number: none visible
- Watermark or stamp: none visible

## Lossy_Description
- Text on the page was legible and transcribed; no significant content was unreadable.