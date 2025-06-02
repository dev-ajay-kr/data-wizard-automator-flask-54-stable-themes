
import { FunctionItem } from './types';

// Machine Learning Pipeline Functions
export const machineLearningFunctions: FunctionItem[] = [
  {
    id: 'auto-feature-engineering',
    name: 'Auto Feature Engineering',
    description: 'Intelligent feature selection and engineering for machine learning models.',
    category: 'Machine Learning',
    status: 'beta',
    details: 'Advanced automated feature engineering using statistical analysis, correlation detection, and domain knowledge. Automatically creates new features, selects optimal feature sets, and handles categorical encoding, scaling, and transformation.',
    prompt: 'Perform comprehensive feature engineering on the dataset. Analyze feature importance, create new derived features, handle categorical variables, apply scaling/normalization, and recommend the optimal feature set for machine learning. Provide detailed explanations for each transformation.'
  },
  {
    id: 'model-training',
    name: 'Model Training',
    description: 'Automated classification, regression, and clustering model training.',
    category: 'Machine Learning',
    status: 'beta',
    details: 'Comprehensive ML model training pipeline supporting multiple algorithms including Random Forest, SVM, Neural Networks, K-Means, and more. Automatically selects best algorithms based on data characteristics and provides hyperparameter optimization.',
    prompt: 'Analyze the dataset and train multiple machine learning models. Determine if this is a classification, regression, or clustering problem. Train appropriate models, perform hyperparameter tuning, and recommend the best performing model with detailed performance metrics.'
  },
  {
    id: 'performance-evaluation',
    name: 'Performance Evaluation',
    description: 'Cross-validation and comprehensive model performance metrics.',
    category: 'Machine Learning',
    status: 'beta',
    details: 'Advanced model evaluation using cross-validation, precision, recall, F1-score, ROC curves, confusion matrices, and feature importance analysis. Provides actionable insights for model improvement.',
    prompt: 'Evaluate machine learning model performance using cross-validation techniques. Calculate comprehensive metrics including accuracy, precision, recall, F1-score, and create confusion matrices. Analyze feature importance and provide recommendations for model improvement.'
  },
  {
    id: 'model-deployment',
    name: 'Model Deployment',
    description: 'REST API generation and model deployment recommendations.',
    category: 'Machine Learning',
    status: 'beta',
    details: 'Generates deployment strategies and API specifications for trained models. Provides code templates for model serving, scaling recommendations, and monitoring strategies.',
    prompt: 'Generate a deployment strategy for the trained machine learning model. Create REST API specifications, provide code templates for model serving, recommend infrastructure requirements, and suggest monitoring and scaling strategies.'
  }
];

// Real-time Analytics Functions
export const realtimeAnalyticsFunctions: FunctionItem[] = [
  {
    id: 'stream-processing',
    name: 'Stream Processing',
    description: 'Apache Kafka integration and real-time data processing setup.',
    category: 'Real-time Analytics',
    status: 'beta',
    details: 'Designs real-time data processing pipelines using streaming technologies. Analyzes data patterns to recommend optimal streaming architectures, buffering strategies, and processing windows.',
    prompt: 'Analyze the dataset for real-time processing requirements. Design a streaming data pipeline architecture, recommend appropriate technologies (Kafka, Apache Storm, etc.), define processing windows, and suggest data partitioning strategies for optimal performance.'
  },
  {
    id: 'realtime-dashboards',
    name: 'Real-time Dashboards',
    description: 'Live updating charts and dashboard configurations.',
    category: 'Real-time Analytics',
    status: 'beta',
    details: 'Creates specifications for real-time dashboard implementations with live updating visualizations, KPI monitoring, and alert thresholds based on data characteristics.',
    prompt: 'Design real-time dashboard specifications for the dataset. Identify key metrics to monitor, create live chart configurations, define update frequencies, set alert thresholds, and recommend optimal visualization types for real-time data display.'
  },
  {
    id: 'anomaly-detection',
    name: 'Anomaly Detection',
    description: 'Real-time alerts and anomaly detection algorithms.',
    category: 'Real-time Analytics',
    status: 'beta',
    details: 'Implements advanced anomaly detection using statistical methods, machine learning algorithms, and time-series analysis. Provides real-time alerting strategies and threshold recommendations.',
    prompt: 'Implement comprehensive anomaly detection for the dataset. Use statistical methods, machine learning algorithms, and time-series analysis to identify anomalies. Set up alert thresholds, define anomaly types, and create real-time monitoring strategies.'
  },
  {
    id: 'performance-monitoring',
    name: 'Performance Monitoring',
    description: 'System health tracking and performance optimization.',
    category: 'Real-time Analytics',
    status: 'beta',
    details: 'Comprehensive system performance monitoring including resource utilization, throughput analysis, latency tracking, and optimization recommendations for data processing pipelines.',
    prompt: 'Analyze system performance requirements for the dataset. Design monitoring strategies for throughput, latency, resource utilization, and data quality. Provide optimization recommendations and set up performance alerting thresholds.'
  }
];

// Advanced Data Profiling Functions
export const dataProfilingFunctions: FunctionItem[] = [
  {
    id: 'data-lineage-tracking',
    name: 'Data Lineage Tracking',
    description: 'Source to destination mapping and data flow analysis.',
    category: 'Data Profiling',
    status: 'beta',
    details: 'Comprehensive data lineage analysis tracking data flow from source to destination. Maps transformations, identifies dependencies, and provides impact analysis for changes.',
    prompt: 'Analyze data lineage and flow patterns in the dataset. Map data sources, transformations, and destinations. Identify data dependencies, create lineage documentation, and provide impact analysis for potential changes.'
  },
  {
    id: 'schema-evolution',
    name: 'Schema Evolution',
    description: 'Automated schema management and evolution tracking.',
    category: 'Data Profiling',
    status: 'beta',
    details: 'Advanced schema analysis including evolution tracking, compatibility assessment, and automated schema management recommendations. Handles schema versioning and migration strategies.',
    prompt: 'Analyze schema structure and evolution patterns. Identify schema changes over time, assess compatibility issues, recommend versioning strategies, and provide migration plans for schema updates.'
  },
  {
    id: 'data-quality-scoring',
    name: 'Data Quality Scoring',
    description: 'Comprehensive quality metrics and scoring system.',
    category: 'Data Profiling',
    status: 'beta',
    details: 'Advanced data quality assessment using multiple dimensions including completeness, accuracy, consistency, timeliness, and validity. Provides actionable quality improvement recommendations.',
    prompt: 'Perform comprehensive data quality assessment. Calculate quality scores across multiple dimensions (completeness, accuracy, consistency, validity, timeliness). Identify quality issues, provide detailed scoring, and recommend specific improvement actions.'
  },
  {
    id: 'sensitivity-detection',
    name: 'Sensitivity Detection',
    description: 'PII and sensitive data identification and classification.',
    category: 'Data Profiling',
    status: 'beta',
    details: 'Automated detection and classification of personally identifiable information (PII), sensitive data, and compliance-related content. Provides data protection recommendations and masking strategies.',
    prompt: 'Scan the dataset for personally identifiable information (PII) and sensitive data. Classify data sensitivity levels, identify compliance requirements (GDPR, HIPAA, etc.), and recommend data protection and masking strategies.'
  }
];

// Infrastructure & DevOps Functions
export const infrastructureFunctions: FunctionItem[] = [
  {
    id: 'multi-cloud-support',
    name: 'Multi-Cloud Support',
    description: 'AWS, Azure, GCP integration strategies and recommendations.',
    category: 'Cloud Platforms',
    status: 'beta',
    details: 'Comprehensive multi-cloud architecture design including service mapping, cost optimization, and migration strategies across AWS, Azure, and Google Cloud Platform.',
    prompt: 'Analyze the dataset and design multi-cloud architecture strategies. Recommend optimal services across AWS, Azure, and GCP, provide cost comparison, suggest migration strategies, and design disaster recovery plans.'
  },
  {
    id: 'serverless-etl',
    name: 'Serverless ETL',
    description: 'Auto-scaling data pipelines and serverless architecture.',
    category: 'Cloud Platforms',
    status: 'beta',
    details: 'Serverless data pipeline design using cloud-native services. Provides auto-scaling strategies, cost optimization, and event-driven processing recommendations.',
    prompt: 'Design serverless ETL architecture for the dataset. Recommend auto-scaling strategies, event-driven processing patterns, cost optimization techniques, and monitoring approaches for serverless data pipelines.'
  },
  {
    id: 'data-lake-management',
    name: 'Data Lake Management',
    description: 'S3, Azure Data Lake, BigQuery management strategies.',
    category: 'Cloud Platforms',
    status: 'beta',
    details: 'Comprehensive data lake architecture including storage optimization, partitioning strategies, security policies, and query performance optimization across major cloud platforms.',
    prompt: 'Design data lake management strategy for the dataset. Recommend storage formats, partitioning schemes, security policies, query optimization techniques, and lifecycle management across S3, Azure Data Lake, and BigQuery.'
  },
  {
    id: 'cost-optimization',
    name: 'Cost Optimization',
    description: 'Resource usage analytics and cost reduction strategies.',
    category: 'Cloud Platforms',
    status: 'beta',
    details: 'Advanced cost analysis and optimization strategies including resource rightsizing, usage pattern analysis, and automated cost monitoring with actionable recommendations.',
    prompt: 'Analyze resource usage patterns and provide cost optimization strategies. Recommend rightsizing approaches, identify cost-saving opportunities, design automated monitoring, and provide detailed cost reduction plans.'
  }
];

// AI & Intelligence Functions
export const aiFunctions: FunctionItem[] = [
  {
    id: 'intelligent-data-discovery',
    name: 'Intelligent Data Discovery',
    description: 'Auto data mapping and intelligent source discovery.',
    category: 'AI Intelligence',
    status: 'beta',
    details: 'AI-powered data discovery using semantic understanding, automatic source mapping, and intelligent metadata generation. Provides context-aware data interpretation and business glossary creation.',
    prompt: 'Perform intelligent data discovery on the dataset. Use semantic analysis to understand data context, automatically map data sources, generate business glossary terms, and provide intelligent metadata suggestions.'
  },
  {
    id: 'predictive-analytics',
    name: 'Predictive Analytics',
    description: 'Trend forecasting and capacity planning predictions.',
    category: 'AI Intelligence',
    status: 'beta',
    details: 'Advanced predictive analytics including time series forecasting, trend analysis, capacity planning, and resource requirement prediction using machine learning algorithms.',
    prompt: 'Perform predictive analytics on the dataset. Create time series forecasts, analyze trends, predict capacity requirements, forecast resource needs, and provide confidence intervals with actionable insights.'
  },
  {
    id: 'natural-language-interface',
    name: 'Natural Language Interface',
    description: 'Conversational ETL and SQL generation from plain English.',
    category: 'AI Intelligence',
    status: 'beta',
    details: 'Natural language processing for ETL operations including SQL query generation from plain English, conversational data analysis, and automated reporting with AI-generated insights.',
    prompt: 'Analyze the dataset to enable natural language querying. Generate sample SQL queries from plain English descriptions, create conversational analysis templates, and provide AI-generated insights with natural language explanations.'
  }
];

// Combined beta functions array
export const betaFunctions: FunctionItem[] = [
  ...machineLearningFunctions,
  ...realtimeAnalyticsFunctions,
  ...dataProfilingFunctions,
  ...infrastructureFunctions,
  ...aiFunctions
];

// Export individual categories for organized display
export const betaFunctionCategories = [
  {
    id: 'machine-learning',
    name: '🤖 Machine Learning Pipeline',
    description: 'Automated ML model training and deployment',
    functions: machineLearningFunctions
  },
  {
    id: 'realtime-analytics',
    name: '📈 Real-time Analytics', 
    description: 'Live data processing and monitoring',
    functions: realtimeAnalyticsFunctions
  },
  {
    id: 'data-profiling',
    name: '🔍 Advanced Data Profiling',
    description: 'Deep data understanding and quality assessment',
    functions: dataProfilingFunctions
  },
  {
    id: 'infrastructure',
    name: '☁️ Cloud Data Platforms',
    description: 'Multi-cloud support and serverless ETL',
    functions: infrastructureFunctions
  },
  {
    id: 'ai-intelligence',
    name: '🧠 AI & Intelligence',
    description: 'Intelligent data discovery and predictive analytics',
    functions: aiFunctions
  }
];
