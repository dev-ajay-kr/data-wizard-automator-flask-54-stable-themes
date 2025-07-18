# ETLHub - AI-Powered Data Analysis Platform

## Project Overview

ETLHub is a sophisticated web application that combines data processing capabilities with AI-powered analysis. It allows users to upload, analyze, and visualize data using Google Gemini AI integration, providing intelligent insights and recommendations for data processing workflows.

## 🚀 Key Features

- **AI-Powered Chat Interface**: Interactive chat with Google Gemini AI for data analysis
- **File Upload & Processing**: Support for CSV, Excel, and JSON file formats
- **Data Visualization**: Advanced charting and dashboard capabilities
- **ETL Functions**: Comprehensive suite of data transformation tools
- **Theme System**: Multiple beautiful themes with dark/light mode support
- **API Key Management**: Secure management of AI service API keys
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Responsive Design**: Modern, mobile-first interface

## 📁 Complete Project Structure

```
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                              # shadcn/ui components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── [other ui components]
│   │   ├── functions/                       # Function-specific components
│   │   │   ├── DocumentationTab.tsx         # API documentation viewer
│   │   │   ├── FunctionCard.tsx            # Individual function display
│   │   │   ├── PreviewPanel.tsx            # Function preview interface
│   │   │   ├── betaData.ts                 # Beta feature definitions
│   │   │   ├── data.ts                     # Core function data
│   │   │   ├── types.ts                    # Function type definitions
│   │   │   └── utils.ts                    # Function utilities
│   │   ├── AnalysisFunctions.tsx           # AI analysis functions
│   │   ├── ApiKeyManager.tsx               # API key management
│   │   ├── CSVUpload.tsx                   # CSV file upload handler
│   │   ├── ChatInterface.tsx               # Main chat interface
│   │   ├── ChartVisualization.tsx          # Data visualization
│   │   ├── DashboardPreview.tsx            # Dashboard builder
│   │   ├── DatasourceUtilities.tsx         # Data source tools
│   │   ├── FileUpload.tsx                  # File upload component
│   │   ├── Footer.tsx                      # Application footer
│   │   ├── Functions.tsx                   # ETL functions panel
│   │   ├── MessageBubble.tsx               # Chat message display
│   │   ├── Navigation.tsx                  # Main navigation
│   │   ├── OnlineDatasource.tsx            # Online data sources
│   │   ├── ProjectDocumentation.tsx        # Project docs
│   │   ├── ResponseFormatter.tsx           # AI response formatting
│   │   ├── SettingsPanel.tsx               # Application settings
│   │   └── VerticalNavigation.tsx          # Vertical nav component
│   ├── contexts/
│   │   ├── FileContext.tsx                 # File management state
│   │   └── ThemeContext.tsx                # Theme management state
│   ├── hooks/
│   │   ├── use-mobile.tsx                  # Mobile detection hook
│   │   ├── use-toast.ts                    # Toast notification hook
│   │   ├── useGemini.ts                    # Gemini AI integration
│   │   └── useTheme.ts                     # Theme management hook
│   ├── lib/
│   │   └── utils.ts                        # Utility functions
│   ├── pages/
│   │   ├── Home.tsx                        # Landing page
│   │   ├── Index.tsx                       # Main application page
│   │   └── NotFound.tsx                    # 404 error page
│   ├── services/
│   │   └── apiService.ts                   # API service layer
│   ├── styles/
│   │   ├── themes/                         # Theme definitions
│   │   │   ├── brown.css
│   │   │   ├── classic.css
│   │   │   ├── nature.css
│   │   │   └── neon.css
│   │   ├── animations.css                  # Animation utilities
│   │   ├── base.css                        # Base styles
│   │   ├── theme-animations.css            # Theme animations
│   │   ├── theme-base.css                  # Theme base styles
│   │   ├── theme-buttons.css               # Theme button styles
│   │   ├── theme-cards.css                 # Theme card styles
│   │   ├── theme-components.css            # Theme component styles
│   │   ├── theme-overrides.css             # Theme overrides
│   │   ├── theme-text.css                  # Theme typography
│   │   └── index.css                       # Main CSS entry
│   ├── types/
│   │   └── theme.ts                        # Theme type definitions
│   ├── utils/
│   │   ├── advancedExportUtils.ts          # Advanced export utilities
│   │   ├── dataProcessing.ts               # Data processing utilities
│   │   ├── errorHandling.ts                # Error handling utilities
│   │   ├── exportUtils.ts                  # Export utilities
│   │   ├── performance.ts                  # Performance monitoring
│   │   ├── searchUtils.ts                  # Search and filter utilities
│   │   ├── settingsConfig.ts               # Settings management
│   │   ├── themeUtils.ts                   # Theme utilities
│   │   └── visualizationUtils.ts           # Visualization utilities
│   ├── constants/
│   │   └── themes.ts                       # Theme constants
│   ├── App.css                             # Application styles
│   ├── App.tsx                             # Main App component
│   ├── index.css                           # Global styles
│   ├── main.tsx                            # Application entry point
│   └── vite-env.d.ts                       # Vite type definitions
├── .gitignore                              # Git ignore rules
├── README.md                               # Project documentation
├── components.json                         # shadcn/ui configuration
├── eslint.config.js                        # ESLint configuration
├── index.html                              # HTML entry point
├── package.json                            # Project dependencies
├── postcss.config.js                       # PostCSS configuration
├── tailwind.config.ts                      # Tailwind configuration
├── tsconfig.json                           # TypeScript configuration
└── vite.config.ts                          # Vite configuration
```

## 🎯 Internal Application Logic & Flow

### Core Application Architecture

The application follows a modular, component-based architecture with clear separation of concerns:

#### 1. **State Management Flow**
- **FileContext**: Manages uploaded files and their processing state
- **ThemeContext**: Handles theme selection and application-wide styling
- **Local Storage**: Persists API keys, theme preferences, and user settings

#### 2. **Data Processing Pipeline**
```
File Upload → Validation → Parsing → Analysis → Visualization
     ↓            ↓          ↓         ↓          ↓
FileUpload → DataProcessor → AI Chat → Charts → Export
```

#### 3. **AI Integration Flow**
```
User Input → Context Building → API Call → Response Processing → UI Update
     ↓             ↓              ↓           ↓              ↓
ChatInterface → buildContext → Gemini API → ResponseFormatter → Display
```

#### 4. **Key Application Workflows**

**File Processing Workflow:**
1. User uploads file via FileUpload component
2. File validation using validateFileData utility
3. Data parsing and structure analysis
4. Context building for AI analysis
5. Integration with chat interface for AI insights

**AI Chat Workflow:**
1. User submits query through ChatInterface
2. System builds contextual prompt with file data
3. API call to Gemini AI with retry logic
4. Response processing and formatting
5. Display with export options

**Theme System Workflow:**
1. Theme selection in SettingsPanel
2. Theme variables applied via themeUtils
3. CSS custom properties updated
4. Component re-rendering with new styles

#### 5. **Error Handling Strategy**
- **API Errors**: Handled by ErrorHandler utility with retry logic
- **File Errors**: Validation and user feedback via toast notifications
- **Performance**: Monitored by performanceMonitor utility
- **User Feedback**: Toast notifications for all user actions

#### 6. **Security Measures**
- API keys masked in UI with option to edit (blank field for security)
- Local storage for sensitive data with encryption considerations
- Input validation and sanitization
- Secure file upload handling

#### 7. **Performance Optimizations**
- React.memo for expensive components
- Lazy loading for large datasets
- Debounced search and filter operations
- Efficient state updates and minimal re-renders
- Performance monitoring and metrics collection

### Component Interaction Map

```
App
├── Navigation (global navigation)
├── ThemeProvider (theme management)
├── FileProvider (file state management)
├── QueryClient (API state management)
└── Router
    ├── Home (landing page)
    └── Index (main app)
        ├── ChatInterface (AI interaction)
        ├── FileUpload (data input)
        ├── Functions (ETL tools)
        ├── SettingsPanel (configuration)
        └── Visualizations (charts/dashboards)
```

## 🛠 Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **State Management**: React Context + Local Storage
- **AI Integration**: Google Gemini API
- **Data Processing**: Custom utilities for CSV/Excel/JSON
- **Charts**: Recharts library
- **Routing**: React Router Dom
- **HTTP Client**: Native fetch with retry logic

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
1. Configure your Google Gemini API key in the application settings
2. Select your preferred theme
3. Upload data files to start analysis

## 📝 Usage Guide

### Basic Workflow
1. **Upload Data**: Use the file upload feature to import CSV, Excel, or JSON files
2. **Configure AI**: Set up your Gemini API key in the settings panel
3. **Analyze Data**: Chat with the AI to get insights about your data
4. **Visualize**: Create charts and dashboards from your analysis
5. **Export**: Export results in various formats (Excel, PNG, etc.)

### Advanced Features
- **ETL Functions**: Use built-in functions for data transformation
- **Online Data Sources**: Connect to external data sources
- **Custom Themes**: Switch between different visual themes
- **Performance Monitoring**: Track application performance metrics

## 🎨 Design System

The application uses a comprehensive design system with:
- **Semantic color tokens** defined in index.css
- **Theme-responsive components** that adapt to different color schemes
- **Consistent spacing and typography** across all components
- **Accessible design patterns** following WCAG guidelines

## 📊 Data Processing Capabilities

- **File Format Support**: CSV, Excel (.xlsx), JSON
- **Data Validation**: Automatic structure analysis and validation
- **Data Cleaning**: Remove duplicates, handle null values, trim strings
- **Data Aggregation**: Sum, average, count, min/max operations
- **Export Options**: Excel, CSV, JSON, PNG charts

## 🔧 API Integration

The application integrates with Google Gemini AI for:
- **Data Analysis**: Intelligent insights from uploaded datasets
- **Query Processing**: Natural language queries about data
- **Recommendations**: Suggestions for data processing and visualization
- **Error Handling**: Robust retry logic and user feedback

## 📱 Responsive Design

- **Mobile-first approach** with responsive breakpoints
- **Touch-friendly interfaces** for mobile devices
- **Adaptive layouts** that work across all screen sizes
- **Progressive enhancement** for modern browsers

## 🔒 Security & Privacy

- **Local Data Storage**: Files processed locally for privacy
- **API Key Security**: Keys masked in UI, stored securely
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Boundaries**: Graceful error handling to prevent crashes

## 🚀 Deployment

This project can be deployed using:
- **Lovable Platform**: Direct deployment from the Lovable interface
- **Vercel/Netlify**: Static site deployment
- **Custom Domain**: Connect your own domain via project settings

## 📋 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## 📄 License

This project is developed with Lovable and follows standard web development practices.

---

**Project URL**: https://lovable.dev/projects/f6a6a7d9-162a-48a8-be00-8a4619ff589a

For more information about Lovable projects, visit [Lovable Documentation](https://docs.lovable.dev/).