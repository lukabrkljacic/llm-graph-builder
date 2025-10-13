# Preprocessing Pipeline

This preprocessing pipeline handles the conversion of project files into markdown format while preserving project context.

## Folder Structure

```
preprocessing/
├── input_data/
│   ├── not_processed/          # Source files to be processed
│   │   └── {project_name}/
│   │       ├── metadata.json   # Project metadata
│   │       ├── file1.ext
│   │       └── file2.ext
│   └── processed/             # Processed files
│       └── {project_name}/
│           ├── metadata.json   # Project metadata (copied)
│           ├── file1.md        # Converted markdown
│           └── file2.md
└── Archivist_Project_Pipeline.ipynb  # Main processing pipeline
```

## Features

1. Processes each folder in `not_processed` as a separate project
2. Reads `metadata.json` from each project folder to provide context
3. Adds project context to the beginning of each markdown file
4. Stores processed files in corresponding folders in `processed`
5. Handles different file types appropriately:
   - PDF files: Convert to PNGs, then to markdown
   - PNG files: Direct markdown conversion
   - Other formats: Standard conversion
6. Maintains original file relationships and structure

## Usage

Run the Archivist_Project_Pipeline.ipynb notebook to process all projects.