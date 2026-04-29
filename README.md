# SRE TraceFlow

A modern, structured web application for Site Reliability Engineering tasks, featuring trace extraction, log analysis, and KQL query generation designed for Kubernetes microservice architecture.

## 📁 Project Structure

```
SRE TraceFlow/
├── index.html                    # Home page
├── trace-extractor.html          # Trace ID extraction and KQL query tool
├── log-analyzer.html            # Log analysis tool
├── advanced-kql-query.html       # Advanced KQL query builder
├── extended-search.html          # Extended Search tool
├── assets/
│   ├── css/
│   │   ├── common.css           # Shared styles
│   │   ├── home.css            # Home page specific styles
│   │   └── tools.css           # Tool pages specific styles
│   └── js/
│       └── common.js            # Shared JavaScript functionality
├── README.md                    # Project documentation
└── .git/                        # Git repository
```

## 🛠️ Tools

### 1. Trace Extractor (`trace-extractor.html`)
- **Purpose**: Extract trace IDs and generate KQL queries for log analytics
- **Features**:
  - Trace extraction from identifiers
  - Trace formatting for Azure Log Analytics
  - KQL query generation for Azure Monitor
  - Time range management

### 2. Log Analyzer (`log-analyzer.html`)
- **Purpose**: Advanced log analysis and filtering
- **Features**:
  - Keyword filtering with dynamic messages
  - Syntax highlighting for trace IDs
  - Export capabilities
  - Enhanced loading animations

### 3. Advanced KQL Query (`advanced-kql-query.html`)
- **Purpose**: Advanced KQL query generation
- **Features**:
  - Time range filtering
  - Container-specific log analysis
  - Dynamic time offset configuration
  - Pre-built query templates

<!-- SRE Helper page removed -->

### 5. Extended Search (`extended-search.html`)
- **Purpose**: Extended search functionality
- **Features**:
  - Advanced search capabilities
  - Extended query options

## 🎨 Design System

### CSS Architecture
- **`common.css`**: Shared styles for navigation, forms, buttons, and responsive design
- **`home.css`**: Home page specific styles (cards, grid layout)
- **`tools.css`**: Tool pages specific styles (wrapper layouts)

### JavaScript Architecture
- **`common.js`**: Shared functionality for clipboard operations, form validation, and UI feedback

## 🚀 Features

- **Modern UI**: Glassmorphism design with smooth animations
- **Responsive Design**: Works on desktop and mobile devices
- **Consistent Navigation**: Easy navigation between tools
- **Copy to Clipboard**: One-click copy functionality with visual feedback
- **Form Validation**: Client-side validation with helpful error messages
- **Modular Structure**: Clean separation of concerns with external CSS/JS files

## 🔧 Technical Details

### Dependencies
- **Fonts**: Inter font family from Google Fonts
- **Icons**: Font Awesome 6.4.0
- **No JavaScript frameworks**: Vanilla JavaScript for better performance

### Browser Support
- Modern browsers with CSS Grid and Flexbox support
- ES6+ JavaScript features

## 📱 Usage

1. Open `index.html` in your web browser
2. Navigate to the desired tool using the navigation menu
3. Use the tools according to their specific purposes
4. Copy generated results using the copy buttons

## 🎯 Key Benefits

- **Structured Codebase**: Easy to maintain and extend
- **Reusable Components**: Shared styles and JavaScript functions
- **Performance Optimized**: Minimal dependencies and efficient code
- **User-Friendly**: Intuitive interface with helpful feedback
- **Professional Design**: Modern, clean aesthetic suitable for professional use
