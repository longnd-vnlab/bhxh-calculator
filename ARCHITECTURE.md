# Software Architecture Document
## BHXH Calculator - Next.js + FastAPI

**Version**: 1.0
**Date**: 2025-12-25
**Stack**: Next.js 15 (Frontend) + FastAPI (Backend)

---

## Implementation Approach

### Technology Stack Selection

#### Frontend: Next.js 15 + React 18
- **Next.js 15**: App Router with RSC (React Server Components) for SEO optimization and performance
- **React 18**: Modern hooks, Suspense for data fetching
- **Material-UI (MUI) v6**: Component library for consistent, accessible UI
- **Tailwind CSS v4**: Utility-first styling for rapid development
- **React Hook Form**: Performant form handling with validation
- **Zustand**: Lightweight state management (simpler than Redux)
- **React Dropzone**: Multi-file drag & drop upload
- **Tesseract.js**: Client-side OCR (privacy-focused, no backend dependency)
- **jsPDF + html2canvas**: Client-side PDF generation
- **SWR or TanStack Query**: Data fetching and caching

#### Backend: FastAPI + Python 3.11+
- **FastAPI**: High-performance async API framework with automatic OpenAPI docs
- **Pydantic v2**: Data validation and serialization
- **SQLAlchemy 2.0**: ORM for database operations (if needed for coefficient storage)
- **PostgreSQL**: Robust relational database for coefficient data
- **Alembic**: Database migration tool
- **python-multipart**: File upload handling
- **Pillow**: Image preprocessing before OCR
- **Google Cloud Vision API**: Optional high-accuracy OCR (P2 feature)
- **pytest**: Testing framework
- **Redis**: Optional caching for coefficient data

### Architecture Rationale

**Why Next.js + FastAPI?**

1. **Separation of Concerns**:
   - Frontend handles UI/UX, client-side OCR, PDF generation
   - Backend handles calculation logic, coefficient management, optional cloud OCR

2. **Performance**:
   - Next.js App Router: SSR/SSG for landing page → faster initial load
   - Client-side OCR (Tesseract.js): No server load, better privacy
   - FastAPI: Async endpoints for concurrent batch processing
   - API caching: Redis for frequently accessed coefficient data

3. **Scalability**:
   - Stateless backend → easy horizontal scaling
   - Client-side processing reduces server costs
   - CDN deployment for Next.js static assets

4. **Developer Experience**:
   - TypeScript (Next.js) + Python typing → better IDE support
   - FastAPI automatic OpenAPI docs
   - Hot reload in both stacks

### Difficult Points & Solutions

| Challenge | Solution |
|-----------|----------|
| **Batch OCR Processing** | Use Web Workers for parallel Tesseract.js processing (2-3 concurrent) |
| **Complex Calculation Logic** | Separate calculation engine in backend with comprehensive unit tests |
| **Coefficient Data Management** | Store in PostgreSQL with versioning, cache in Redis, expose via FastAPI |
| **Form State Management** | Zustand for global state + React Hook Form for field-level validation |
| **Mobile Responsiveness** | Tailwind mobile-first approach + MUI responsive components |
| **PDF Generation** | Client-side jsPDF to avoid server load |
| **Data Privacy** | Client-side OCR, no user data stored on server |

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Next.js 15 (App Router)                    │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌───────────────┐  │  │
│  │  │   Pages    │  │ Components  │  │  State (Zustand) │  │
│  │  │ (RSC/CSR)  │  │   (MUI)     │  │                │  │  │
│  │  └────────────┘  └─────────────┘  └───────────────┘  │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌───────────────┐  │  │
│  │  │ Services   │  │ Web Workers │  │   Utils       │  │  │
│  │  │ - OCR      │  │ - Tesseract │  │ - PDF Gen     │  │  │
│  │  │ - API      │  │             │  │ - Validation  │  │  │
│  │  └────────────┘  └─────────────┘  └───────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              FastAPI Backend                          │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌───────────────┐  │  │
│  │  │  Routers   │  │  Services   │  │    Models     │  │  │
│  │  │ /calculate │  │ - Calc Eng  │  │  (Pydantic)   │  │  │
│  │  │ /coeff     │  │ - Validator │  │               │  │  │
│  │  │ /ocr (opt) │  │ - OCR Cloud │  │               │  │  │
│  │  └────────────┘  └─────────────┘  └───────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │  Google      │      │
│  │ (Coefficient)│  │   (Cache)    │  │  Vision API  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION                            │
│                                                          │
│  ┌────────────────┐         ┌──────────────────────┐    │
│  │   Vercel       │         │   Railway/Render     │    │
│  │   Next.js      │◄───────►│   FastAPI            │    │
│  │   (Edge/CDN)   │  HTTPS  │   (Docker)           │    │
│  └────────────────┘         └──────────────────────┘    │
│         │                              │                │
│         │                              ↓                │
│         │                    ┌──────────────────┐       │
│         │                    │   Supabase/      │       │
│         │                    │   Neon           │       │
│         │                    │   (PostgreSQL)   │       │
│         │                    └──────────────────┘       │
│         │                              ↓                │
│         │                    ┌──────────────────┐       │
│         │                    │   Upstash        │       │
│         └───────────────────►│   (Redis)        │       │
│            Cache reads       └──────────────────┘       │
└──────────────────────────────────────────────────────────┘
```

---


## File Structure

### Frontend (Next.js)

```
bhxh-calculator-frontend/
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Landing page (RSC)
│   ├── manual/
│   │   └── page.tsx                  # Manual input page
│   ├── ocr/
│   │   └── page.tsx                  # OCR upload page
│   ├── result/
│   │   └── page.tsx                  # Calculation result page
│   └── api/                          # API routes (if needed)
│       └── health/
│           └── route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── MethodSelector.tsx        # Manual/OCR choice cards
│   │   └── Features.tsx
│   ├── manual/
│   │   ├── PeriodForm.tsx            # Single period input
│   │   ├── PeriodList.tsx            # Dynamic period list
│   │   └── HelpSection.tsx
│   ├── ocr/
│   │   ├── FileUploader.tsx          # Dropzone component
│   │   ├── FileList.tsx              # Upload progress list
│   │   ├── FileItem.tsx              # Single file status
│   │   ├── ExtractedDataReview.tsx   # Review OCR results
│   │   └── DataMerger.tsx            # Merge multiple extractions
│   ├── result/
│   │   ├── TotalAmount.tsx           # Prominent total display
│   │   ├── BreakdownSection.tsx      # Detailed breakdown
│   │   ├── PeriodCard.tsx            # Single period breakdown
│   │   ├── FormulaModal.tsx          # Formula explanation
│   │   └── ActionButtons.tsx         # PDF/Recalculate
│   └── common/
│       ├── Button.tsx
│       ├── TextField.tsx
│       ├── DatePicker.tsx
│       ├── CurrencyInput.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── store/
│   │   ├── calculationStore.ts       # Zustand store
│   │   └── ocrStore.ts
│   ├── services/
│   │   ├── api.ts                    # API client (axios)
│   │   ├── ocrService.ts             # Tesseract.js wrapper
│   │   ├── pdfService.ts             # jsPDF generator
│   │   └── calculationService.ts     # Client calculation helper
│   ├── utils/
│   │   ├── validation.ts             # Validation helpers
│   │   ├── formatting.ts             # Currency, date formatting
│   │   └── constants.ts              # App constants
│   └── types/
│       ├── calculation.ts            # TypeScript types
│       ├── period.ts
│       └── api.ts
├── workers/
│   └── ocrWorker.ts                  # Web Worker for OCR
├── public/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css                   # Tailwind imports
├── .env.local
├── .env.production
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Backend (FastAPI)

```
bhxh-calculator-backend/
├── app/
│   ├── main.py                       # FastAPI app entry
│   ├── config.py                     # Settings (Pydantic BaseSettings)
│   ├── database.py                   # SQLAlchemy setup
│   ├── dependencies.py               # Dependency injection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── coefficient.py            # SQLAlchemy model
│   │   └── calculation.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── period.py                 # Pydantic schemas
│   │   ├── calculation_request.py
│   │   ├── calculation_response.py
│   │   └── coefficient.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── calculation.py            # POST /api/calculate
│   │   ├── coefficient.py            # GET /api/coefficients
│   │   └── ocr.py                    # POST /api/ocr (optional cloud)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── calculation_engine.py     # Core calculation logic
│   │   ├── coefficient_service.py    # Coefficient CRUD
│   │   ├── validation_service.py     # Business validation
│   │   └── ocr_cloud_service.py      # Google Vision wrapper
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── date_helpers.py
│   │   └── exceptions.py             # Custom exceptions
│   └── tests/
│       ├── __init__.py
│       ├── test_calculation.py
│       ├── test_api.py
│       └── fixtures/
│           └── sample_data.json
├── alembic/
│   ├── versions/
│   │   └── 001_initial.py
│   └── env.py
├── scripts/
│   ├── seed_coefficients.py          # Load initial data
│   └── update_coefficients.py
├── .env
├── .env.production
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── pytest.ini
```


## Data Structures and Interfaces

### Class Diagram

```mermaid
classDiagram
    %% Frontend TypeScript Types
    class Period {
        +string id
        +Date startDate
        +Date endDate
        +number monthlySalary
        +number months
        +number coefficient
        +number adjustedSalary
        +validate() ValidationResult
        +calculateMonths() number
    }

    class CalculationRequest {
        +Period[] periods
        +string calculationYear
        +validate() boolean
        +toJSON() object
    }

    class CalculationResult {
        +number totalAmount
        +number averageSalary
        +PeriodBreakdown[] periodBreakdowns
        +FormulaExplanation explanation
        +Date calculatedAt
        +toPDF() Blob
    }

    class PeriodBreakdown {
        +string periodId
        +Date startDate
        +Date endDate
        +number months
        +number years
        +number originalSalary
        +number coefficient
        +number adjustedSalary
        +number multiplier
        +number amount
        +boolean isPre2014
    }

    class FormulaExplanation {
        +string formula
        +Step[] steps
        +string description
    }

    class OCRResult {
        +string imageId
        +string status
        +Period[] extractedPeriods
        +number confidence
        +string errorMessage?
        +retryCount number
    }

    class OCRBatchResult {
        +OCRResult[] results
        +number successCount
        +number failureCount
        +Period[] mergedPeriods
    }

    %% Backend Python Models
    class CoefficientModel {
        +int id
        +int year
        +int month
        +float coefficient
        +datetime effective_from
        +datetime effective_to
        +boolean is_active
        +datetime created_at
        +datetime updated_at
    }

    class CalculationRequestSchema {
        +List~PeriodSchema~ periods
        +str calculation_year
        +model_validator() Self
    }

    class PeriodSchema {
        +str start_date
        +str end_date
        +float monthly_salary
        +field_validator() Any
    }

    class CalculationResponseSchema {
        +float total_amount
        +float average_salary
        +int total_months
        +List~PeriodBreakdownSchema~ period_breakdowns
        +FormulaExplanationSchema explanation
        +str calculated_at
    }

    class PeriodBreakdownSchema {
        +str start_date
        +str end_date
        +int months
        +float years
        +float original_salary
        +float coefficient
        +float adjusted_salary
        +float multiplier
        +float amount
        +bool is_pre_2014
    }

    class CalculationEngine {
        +calculate(periods: List~PeriodSchema~, coefficients: List~CoefficientModel~) CalculationResponseSchema
        -_get_coefficient(year: int, month: int) float
        -_calculate_mbqtl(periods: List~PeriodSchema~) float
        -_calculate_period_amount(period: PeriodSchema, mbqtl: float) float
        -_generate_explanation(periods: List~PeriodSchema~) FormulaExplanationSchema
    }

    class CoefficientService {
        +get_coefficients(year: int) List~CoefficientModel~
        +get_all_coefficients() List~CoefficientModel~
        +update_coefficient(id: int, data: dict) CoefficientModel
        +bulk_import(data: List~dict~) List~CoefficientModel~
    }

    class ValidationService {
        +validate_period(period: PeriodSchema) ValidationResult
        +validate_date_range(start: str, end: str) bool
        +validate_salary_range(salary: float) bool
        +check_overlapping_periods(periods: List~PeriodSchema~) ValidationResult
    }

    %% Relationships
    CalculationRequest --> Period : contains
    CalculationResult --> PeriodBreakdown : contains
    CalculationResult --> FormulaExplanation : contains
    OCRBatchResult --> OCRResult : contains
    OCRResult --> Period : extracts
    
    CalculationRequestSchema --> PeriodSchema : contains
    CalculationResponseSchema --> PeriodBreakdownSchema : contains
    CalculationEngine --> CoefficientModel : uses
    CalculationEngine --> CalculationRequestSchema : processes
    CalculationEngine --> CalculationResponseSchema : returns
    CoefficientService --> CoefficientModel : manages
    ValidationService --> PeriodSchema : validates
```

### Database Schema

```mermaid
erDiagram
    COEFFICIENT {
        int id PK
        int year
        int month
        float coefficient
        timestamp effective_from
        timestamp effective_to
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    CALCULATION_LOG {
        uuid id PK
        jsonb request_data
        jsonb response_data
        float total_amount
        int period_count
        timestamp created_at
        string ip_address
    }
    
    COEFFICIENT ||--o{ CALCULATION_LOG : "used_in"
```


## API Endpoints

### Backend API (FastAPI)

#### Base URL: `/api/v1`

| Method | Endpoint | Description | Request Body | Response | Auth |
|--------|----------|-------------|--------------|----------|------|
| **POST** | `/calculate` | Calculate BHXH one-time payment | CalculationRequest | CalculationResponse | None |
| **GET** | `/coefficients` | Get all inflation coefficients | - | List[Coefficient] | None |
| **GET** | `/coefficients/{year}` | Get coefficients for specific year | - | List[Coefficient] | None |
| **GET** | `/coefficients/range` | Get coefficients for date range | ?start_year, ?end_year | List[Coefficient] | None |
| **POST** | `/ocr/cloud` | Process image with Cloud Vision (P2) | MultipartFile | OCRResult | API Key |
| **GET** | `/health` | Health check | - | {status: "ok"} | None |
| **GET** | `/docs` | OpenAPI documentation | - | Swagger UI | None |

#### Detailed API Specifications

**1. POST /api/v1/calculate**

Request:
```typescript
{
  "periods": [
    {
      "start_date": "2010-01-01",
      "end_date": "2013-12-31",
      "monthly_salary": 5000000
    },
    {
      "start_date": "2014-01-01",
      "end_date": "2023-12-31",
      "monthly_salary": 10000000
    }
  ],
  "calculation_year": "2025"
}
```

Response (200 OK):
```typescript
{
  "total_amount": 287943812,
  "average_salary": 11074762,
  "total_months": 168,
  "period_breakdowns": [
    {
      "start_date": "2010-01-01",
      "end_date": "2013-12-31",
      "months": 48,
      "years": 4.0,
      "original_salary": 5000000,
      "coefficient": 1.927,
      "adjusted_salary": 9635000,
      "multiplier": 1.5,
      "amount": 66448572,
      "is_pre_2014": true
    },
    {
      "start_date": "2014-01-01",
      "end_date": "2023-12-31",
      "months": 120,
      "years": 10.0,
      "original_salary": 10000000,
      "coefficient": 1.165,
      "adjusted_salary": 11650000,
      "multiplier": 2.0,
      "amount": 221495240,
      "is_pre_2014": false
    }
  ],
  "explanation": {
    "formula": "Mức hưởng = (1.5 × Mbqtl × Năm trước 2014) + (2.0 × Mbqtl × Năm từ 2014)",
    "steps": [
      {
        "step": 1,
        "description": "Điều chỉnh lương theo hệ số trượt giá",
        "calculation": "Giai đoạn 1: 5,000,000 × 1.927 = 9,635,000 VNĐ"
      },
      {
        "step": 2,
        "description": "Tính mức bình quân tiền lương (Mbqtl)",
        "calculation": "Mbqtl = 1,860,480,000 ÷ 168 = 11,074,762 VNĐ"
      },
      {
        "step": 3,
        "description": "Tính số tiền hưởng",
        "calculation": "Tổng = 66,448,572 + 221,495,240 = 287,943,812 VNĐ"
      }
    ]
  },
  "calculated_at": "2025-12-25T10:30:00Z"
}
```

Error Responses:
- **400 Bad Request**: Invalid period data, overlapping periods
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Calculation engine error

**2. GET /api/v1/coefficients**

Response (200 OK):
```typescript
[
  {
    "id": 1,
    "year": 2024,
    "month": 1,
    "coefficient": 1.00,
    "effective_from": "2024-01-01T00:00:00Z",
    "effective_to": "2024-12-31T23:59:59Z",
    "is_active": true
  },
  {
    "id": 2,
    "year": 2023,
    "month": 1,
    "coefficient": 1.08,
    "effective_from": "2023-01-01T00:00:00Z",
    "effective_to": "2023-12-31T23:59:59Z",
    "is_active": true
  }
  // ... more coefficients
]
```

**3. GET /api/v1/coefficients/range?start_year=2010&end_year=2023**

Response (200 OK):
```typescript
[
  {
    "year": 2010,
    "coefficient": 1.927,
    "is_active": true
  },
  {
    "year": 2011,
    "coefficient": 1.850,
    "is_active": true
  }
  // ... filtered results
]
```

**4. POST /api/v1/ocr/cloud (P2 Feature)**

Request (multipart/form-data):
```
image: <binary file>
language: "vie"
```

Response (200 OK):
```typescript
{
  "image_id": "uuid-string",
  "status": "success",
  "extracted_periods": [
    {
      "start_date": "2010-01-01",
      "end_date": "2013-12-31",
      "monthly_salary": 5000000,
      "confidence": 0.95
    }
  ],
  "confidence": 0.92,
  "processing_time_ms": 850
}
```

### Frontend API Integration

```typescript
// lib/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// API Methods
export const calculationApi = {
  calculate: async (request: CalculationRequest): Promise<CalculationResult> => {
    const { data } = await api.post('/calculate', request);
    return data;
  },
  
  getCoefficients: async (): Promise<Coefficient[]> => {
    const { data } = await api.get('/coefficients');
    return data;
  },
  
  getCoefficientsByRange: async (startYear: number, endYear: number): Promise<Coefficient[]> => {
    const { data } = await api.get('/coefficients/range', {
      params: { start_year: startYear, end_year: endYear }
    });
    return data;
  },
};

export const ocrApi = {
  processCloudOCR: async (file: File): Promise<OCRResult> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('language', 'vie');
    
    const { data } = await api.post('/ocr/cloud', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
};
```


## Program Call Flow

### 1. Manual Input Flow

```mermaid
sequenceDiagram
    actor User
    participant LP as LandingPage
    participant MF as ManualForm
    participant Store as Zustand Store
    participant Val as ValidationService
    participant API as FastAPI Backend
    participant Engine as CalculationEngine
    participant DB as PostgreSQL
    participant Result as ResultPage
    participant PDF as PDFService

    User->>LP: Visit homepage
    LP->>LP: Render Hero + Method Selector (RSC)
    User->>LP: Click "Nhập Thủ công"
    LP->>MF: Navigate to /manual
    
    MF->>MF: Initialize empty period form
    User->>MF: Fill period 1 (dates, salary)
    MF->>Val: Validate period data
    Val-->>MF: Validation result
    
    User->>MF: Click "Thêm giai đoạn"
    MF->>Store: Add period to state
    Store-->>MF: Updated periods array
    
    User->>MF: Fill period 2
    User->>MF: Click "Tính toán ngay"
    
    MF->>Val: Validate all periods
    Val->>Val: Check date ranges
    Val->>Val: Check overlaps
    Val->>Val: Check salary ranges
    Val-->>MF: All valid
    
    MF->>Store: Set loading state
    MF->>API: POST /api/v1/calculate
    API->>API: Parse request body
    API->>Engine: calculate(periods)
    
    Engine->>DB: Query coefficients for period years
    DB-->>Engine: List[CoefficientModel]
    
    Engine->>Engine: For each period:
    Engine->>Engine: 1. Get coefficient(year)
    Engine->>Engine: 2. Adjust salary = salary × coefficient
    Engine->>Engine: 3. Calculate months
    
    Engine->>Engine: Calculate Mbqtl
    Note over Engine: Mbqtl = Σ(adjusted_salary × months) / Σ(months)
    
    Engine->>Engine: Calculate amounts:
    Note over Engine: Pre-2014: 1.5 × Mbqtl × years<br/>From 2014: 2.0 × Mbqtl × years
    
    Engine->>Engine: Generate explanation
    Engine-->>API: CalculationResponseSchema
    API-->>MF: 200 OK with result
    
    MF->>Store: Set calculation result
    MF->>Result: Navigate to /result
    
    Result->>Store: Get calculation result
    Store-->>Result: CalculationResult
    Result->>Result: Render total amount
    Result->>Result: Render period breakdowns
    
    User->>Result: Click "Xuất PDF"
    Result->>PDF: Generate PDF(result)
    PDF->>PDF: Create jsPDF instance
    PDF->>PDF: Add company header
    PDF->>PDF: Add calculation details
    PDF->>PDF: Add breakdown table
    PDF-->>Result: Blob
    Result->>User: Download PDF file
```

### 2. OCR Batch Upload Flow

```mermaid
sequenceDiagram
    actor User
    participant LP as LandingPage
    participant OCR as OCRPage
    participant Uploader as FileUploader
    participant Worker as OCRWorker
    participant Tess as Tesseract.js
    participant Store as OCRStore
    participant Review as DataReview
    participant API as FastAPI Backend
    participant Result as ResultPage

    User->>LP: Visit homepage
    User->>LP: Click "Tải ảnh Tự động"
    LP->>OCR: Navigate to /ocr
    
    OCR->>Uploader: Render dropzone
    User->>Uploader: Drag & drop 4 images
    
    Uploader->>Store: Add files to queue
    Store->>Store: Initialize file states (pending)
    Store-->>Uploader: Update UI with file list
    
    par Process Image 1
        Uploader->>Worker: postMessage(image1)
        Worker->>Tess: Initialize Tesseract
        Tess-->>Worker: Ready
        Worker->>Tess: recognize(image1, 'vie')
        Tess->>Tess: OCR processing...
        Tess-->>Worker: {text, confidence}
        Worker->>Worker: Parse text to Period[]
        Worker-->>Uploader: OCRResult (success)
        Uploader->>Store: Update file1 status = success
    and Process Image 2
        Uploader->>Worker: postMessage(image2)
        Worker->>Tess: recognize(image2, 'vie')
        Tess-->>Worker: {text, confidence}
        Worker->>Worker: Parse text
        Worker-->>Uploader: OCRResult (success)
        Uploader->>Store: Update file2 status = success
    and Process Image 3 (concurrent limit = 2)
        Note over Uploader: Waiting for slot...
        Uploader->>Worker: postMessage(image3)
        Worker->>Tess: recognize(image3, 'vie')
        Tess-->>Worker: {text, confidence}
        Worker-->>Uploader: OCRResult (success)
        Uploader->>Store: Update file3 status = success
    and Process Image 4
        Note over Uploader: Waiting...
        Uploader->>Worker: postMessage(image4)
        Worker->>Tess: recognize(image4, 'vie')
        Tess-->>Worker: Error
        Worker-->>Uploader: OCRResult (error)
        Uploader->>Store: Update file4 status = error
    end
    
    Store-->>OCR: All files processed (3 success, 1 error)
    OCR->>OCR: Show progress: 3/4 success
    
    User->>OCR: Click "Thử lại" on image4
    OCR->>Worker: Retry image4
    Worker->>Tess: recognize(image4, 'vie')
    Tess-->>Worker: {text, confidence}
    Worker-->>OCR: Success
    Store->>Store: Update file4 status = success
    
    OCR->>Review: Show extracted data tabs
    User->>Review: Review Tab "Ảnh 1"
    Review->>Store: Get extracted periods from image1
    Store-->>Review: Period[]
    Review->>Review: Render editable form
    
    User->>Review: Edit salary for period 1
    Review->>Store: Update period data
    
    User->>Review: Switch to Tab "Ảnh 2"
    User->>Review: Verify data
    
    User->>Review: Click "Gộp tất cả"
    Review->>Store: Merge all periods
    Store->>Store: Combine Period[] from all images
    Store->>Store: Sort by start_date
    Store->>Store: Validate no overlaps
    Store-->>Review: Merged periods
    
    User->>Review: Click "Xác nhận và tính toán"
    Review->>API: POST /api/v1/calculate
    API->>API: Process calculation
    API-->>Review: CalculationResult
    
    Review->>Result: Navigate to /result
    Result->>Result: Display results
```

### 3. Coefficient Data Flow

```mermaid
sequenceDiagram
    participant Admin as Admin Script
    participant API as FastAPI
    participant Service as CoefficientService
    participant DB as PostgreSQL
    participant Cache as Redis
    participant Client as Next.js App

    Admin->>API: POST /api/v1/coefficients/bulk-import
    Note over Admin: Upload CSV with 2025 coefficients
    API->>Service: bulk_import(csv_data)
    
    Service->>Service: Validate CSV format
    Service->>Service: Parse rows
    loop For each row
        Service->>DB: INSERT coefficient
        DB-->>Service: CoefficientModel
    end
    
    Service->>Cache: FLUSHDB coefficients:*
    Note over Cache: Clear old cache
    Service-->>API: List[CoefficientModel]
    API-->>Admin: 201 Created
    
    Client->>API: GET /api/v1/coefficients
    API->>Cache: GET coefficients:all
    Cache-->>API: null (cache miss)
    
    API->>Service: get_all_coefficients()
    Service->>DB: SELECT * FROM coefficient WHERE is_active=true
    DB-->>Service: List[CoefficientModel]
    Service-->>API: List[Coefficient]
    
    API->>Cache: SET coefficients:all (TTL 24h)
    Cache-->>API: OK
    API-->>Client: 200 OK + coefficients
    
    Client->>Client: Store in memory
    Note over Client: Use for client-side validation
```

### 4. Error Handling Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as FastAPI
    participant Engine as CalculationEngine
    participant DB as PostgreSQL

    User->>UI: Submit calculation with invalid dates
    UI->>UI: Client-side validation
    UI-->>User: Show error: "Ngày kết thúc phải sau ngày bắt đầu"
    
    User->>UI: Fix and resubmit
    UI->>API: POST /calculate
    API->>API: Pydantic validation
    
    alt Invalid salary (negative)
        API-->>UI: 422 Unprocessable Entity
        UI-->>User: Toast error message
    else Valid data
        API->>Engine: calculate()
        Engine->>DB: Query coefficients
        
        alt Database connection error
            DB-->>Engine: Connection timeout
            Engine-->>API: Raise DatabaseError
            API-->>UI: 503 Service Unavailable
            UI->>UI: Show retry button
            UI-->>User: "Lỗi kết nối, vui lòng thử lại"
        else Coefficient not found
            DB-->>Engine: Empty result
            Engine-->>API: Raise CoefficientNotFoundError
            API-->>UI: 400 Bad Request
            UI-->>User: "Hệ số trượt giá chưa được cập nhật cho năm {year}"
        else Success
            DB-->>Engine: Coefficients
            Engine->>Engine: Calculate
            Engine-->>API: Result
            API-->>UI: 200 OK
            UI-->>User: Show result
        end
    end
```


## Deployment Strategy

### Development Environment

**Frontend (Next.js)**
```bash
# Local development
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run start        # Production preview

# Environment variables (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_OCR_MODE=client  # client | cloud
```

**Backend (FastAPI)**
```bash
# Local development
uvicorn app.main:app --reload --port 8000

# With Docker
docker-compose up -d

# Environment variables (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/bhxh_db
REDIS_URL=redis://localhost:6379/0
GOOGLE_CLOUD_VISION_API_KEY=xxx  # Optional P2
CORS_ORIGINS=["http://localhost:3000"]
```

### Production Deployment

#### Frontend: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Auto-deploy on git push to main branch
```

**Vercel Configuration (vercel.json)**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.bhxh-calculator.com/api/v1"
  },
  "regions": ["sin1"]  # Singapore region (closest to Vietnam)
}
```

#### Backend: Railway or Render

**Railway Deployment**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up

# Auto-deploy from GitHub
```

**railway.json**
```json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/api/v1/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY ./app ./app
COPY ./alembic ./alembic
COPY alembic.ini .

# Run migrations and start server
CMD alembic upgrade head && \
    uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### Database: Supabase or Neon

- **Supabase**: Free tier with 500MB database
- **Neon**: Serverless PostgreSQL with auto-scaling

#### Cache: Upstash Redis

- Serverless Redis with pay-per-request pricing
- Global edge caching

### CI/CD Pipeline (GitHub Actions)

**.github/workflows/ci.yml**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd backend && pip install -r requirements.txt
      - run: pytest --cov=app
      - run: mypy app

  deploy-frontend:
    needs: test-frontend
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test-backend
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: bhxh-api
```

---

## Testing Strategy

### Frontend Testing

**Unit Tests (Jest + React Testing Library)**
```typescript
// __tests__/components/manual/PeriodForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PeriodForm } from '@/components/manual/PeriodForm';

describe('PeriodForm', () => {
  it('validates date range correctly', () => {
    render(<PeriodForm onSubmit={jest.fn()} />);
    
    const startDate = screen.getByLabelText('Từ tháng/năm');
    const endDate = screen.getByLabelText('Đến tháng/năm');
    
    fireEvent.change(startDate, { target: { value: '2020-01-01' } });
    fireEvent.change(endDate, { target: { value: '2019-12-31' } });
    
    expect(screen.getByText('Ngày kết thúc phải sau ngày bắt đầu')).toBeInTheDocument();
  });
});
```

**Integration Tests (Playwright)**
```typescript
// e2e/manual-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete manual calculation flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Nhập Thủ công');
  
  await page.fill('[name="startDate"]', '2010-01-01');
  await page.fill('[name="endDate"]', '2013-12-31');
  await page.fill('[name="salary"]', '5000000');
  
  await page.click('text=Tính toán ngay');
  
  await expect(page).toHaveURL('/result');
  await expect(page.locator('text=TỔNG SỐ TIỀN NHẬN ĐƯỢC')).toBeVisible();
});
```

### Backend Testing

**Unit Tests (pytest)**
```python
# app/tests/test_calculation_engine.py
import pytest
from app.services.calculation_engine import CalculationEngine
from app.schemas.period import PeriodSchema

def test_calculate_mbqtl():
    periods = [
        PeriodSchema(
            start_date="2010-01-01",
            end_date="2013-12-31",
            monthly_salary=5000000
        )
    ]
    coefficients = [...]  # Mock coefficient data
    
    engine = CalculationEngine()
    result = engine.calculate(periods, coefficients)
    
    assert result.total_amount > 0
    assert result.average_salary > 0
    assert len(result.period_breakdowns) == 1

def test_pre_2014_multiplier():
    period = create_period("2010-01-01", "2013-12-31")
    engine = CalculationEngine()
    
    amount = engine._calculate_period_amount(period, mbqtl=10000000)
    
    # Should use 1.5 multiplier for pre-2014
    assert amount == 10000000 * 1.5 * 4  # 4 years
```

**API Tests**
```python
# app/tests/test_api.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_calculate_endpoint():
    response = client.post("/api/v1/calculate", json={
        "periods": [
            {
                "start_date": "2010-01-01",
                "end_date": "2013-12-31",
                "monthly_salary": 5000000
            }
        ],
        "calculation_year": "2025"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "total_amount" in data
    assert "period_breakdowns" in data

def test_invalid_period_returns_422():
    response = client.post("/api/v1/calculate", json={
        "periods": [
            {
                "start_date": "2020-01-01",
                "end_date": "2019-12-31",  # Invalid: end before start
                "monthly_salary": 5000000
            }
        ]
    })
    
    assert response.status_code == 422
```

---

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**
   - Route-based splitting (Next.js default)
   - Dynamic imports for heavy components
   ```typescript
   const PDFViewer = dynamic(() => import('./PDFViewer'), {
     loading: () => <LoadingSpinner />,
     ssr: false
   });
   ```

2. **Image Optimization**
   - Use Next.js Image component with WebP format
   - Lazy loading for below-fold images

3. **Caching Strategy**
   - SWR for coefficient data (stale-while-revalidate)
   - LocalStorage for calculation history

4. **Web Workers**
   - OCR processing in background thread
   - Prevents UI blocking during heavy computation

### Backend Optimizations

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_coefficient_year_month ON coefficient(year, month);
   CREATE INDEX idx_coefficient_active ON coefficient(is_active) WHERE is_active = true;
   ```

2. **Redis Caching**
   - Cache coefficient data (24h TTL)
   - Cache calculation results (1h TTL) with hash key

3. **Connection Pooling**
   ```python
   # app/database.py
   engine = create_engine(
       DATABASE_URL,
       pool_size=10,
       max_overflow=20,
       pool_pre_ping=True
   )
   ```

4. **Async Endpoints**
   - All FastAPI routes use async/await
   - Concurrent database queries for batch processing

---

## Security Considerations

### Frontend Security

1. **Input Sanitization**
   - Validate all user inputs client-side
   - Use React Hook Form schema validation

2. **XSS Prevention**
   - React's JSX auto-escaping
   - DOMPurify for user-generated HTML (if needed)

3. **CSRF Protection**
   - SameSite cookies
   - CSRF tokens for state-changing operations

### Backend Security

1. **CORS Configuration**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://bhxh-calculator.vercel.app"],
       allow_credentials=True,
       allow_methods=["GET", "POST"],
       allow_headers=["*"],
   )
   ```

2. **Rate Limiting**
   ```python
   from slowapi import Limiter
   
   limiter = Limiter(key_func=get_remote_address)
   
   @app.post("/api/v1/calculate")
   @limiter.limit("10/minute")
   async def calculate():
       ...
   ```

3. **Data Validation**
   - Pydantic schema validation
   - SQL injection prevention (SQLAlchemy ORM)
   - File upload validation (size, type)

4. **Environment Variables**
   - Never commit secrets to Git
   - Use .env files and secret managers

---

## Monitoring and Logging

### Application Monitoring

**Frontend: Vercel Analytics**
- Page view tracking
- Web Vitals (LCP, FID, CLS)
- Error tracking

**Backend: Sentry**
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
    environment=settings.ENVIRONMENT
)
```

### Logging

```python
# app/main.py
import logging
from logging.config import dictConfig

dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default"
        }
    },
    "root": {
        "level": "INFO",
        "handlers": ["console"]
    }
})

logger = logging.getLogger(__name__)

@app.post("/api/v1/calculate")
async def calculate(request: CalculationRequest):
    logger.info(f"Calculation requested with {len(request.periods)} periods")
    try:
        result = calculation_engine.calculate(request.periods)
        logger.info(f"Calculation successful: {result.total_amount}")
        return result
    except Exception as e:
        logger.error(f"Calculation failed: {str(e)}", exc_info=True)
        raise
```

---

## Anything UNCLEAR

### Clarification Needed:

1. **Coefficient Data Source**
   - Do we have access to the official Thông tư 01/2025/TT-BLĐTBXH document with exact coefficients?
   - Who will be responsible for updating coefficient data annually?
   - Should we provide an admin panel for coefficient management, or will it be updated via scripts?

2. **User Authentication**
   - Is user authentication required for MVP?
   - If yes, should we implement email/password or social login (Google, Facebook)?
   - Do we need to store user calculation history in the database?

3. **OCR Accuracy Requirements**
   - What is the minimum acceptable OCR accuracy rate (currently targeting 80%)?
   - Should we start with client-side Tesseract.js or go directly to Google Cloud Vision API?
   - What is the budget for Cloud Vision API calls per month?

4. **Legal Disclaimer**
   - What specific disclaimer text should we display about the calculation results?
   - Does it need to be approved by legal counsel?
   - Should users accept terms before using the calculator?

5. **Analytics and Privacy**
   - Can we collect anonymous usage analytics (page views, button clicks)?
   - Can we log calculation requests (without PII) for improving the service?
   - Do we need GDPR compliance (for Vietnamese users abroad)?

6. **PDF Template**
   - Do we have a specific PDF template design?
   - Should the PDF include a QR code linking back to the web app?
   - What branding elements should be included (logo, colors)?

7. **Mobile App**
   - Is a native mobile app (iOS/Android) planned for the future?
   - Should we optimize the web app for progressive web app (PWA) features?

8. **Backend Hosting Budget**
   - What is the monthly budget for backend hosting?
   - Railway free tier has limits - should we plan for paid hosting from day 1?
   - Do we expect high traffic (>10,000 requests/month)?

9. **Database Backup**
   - How often should coefficient data be backed up?
   - Who manages database backups and disaster recovery?

10. **API Versioning**
    - Should we plan for API versioning from the start (v1, v2)?
    - How will we handle breaking changes in the future?

### Assumptions Made:

1. **No user authentication** required for MVP (public calculator)
2. **No server-side storage** of user data (privacy-first approach)
3. **Client-side OCR** for MVP, Cloud OCR for P2
4. **Vietnamese language only** for MVP, English for P2
5. **Modern browsers** only (Chrome 90+, Firefox 88+, Safari 14+)
6. **Free tier hosting** initially (Vercel, Railway, Supabase free tiers)
7. **Static coefficient data** loaded from database (manual updates)

---

## Next Steps (Implementation Roadmap)

### Phase 1: MVP (Weeks 1-4)

**Week 1: Project Setup**
- Initialize Next.js and FastAPI projects
- Set up Git repository with branching strategy
- Configure ESLint, Prettier, TypeScript
- Set up local PostgreSQL and Redis
- Create initial database schema

**Week 2: Backend Core**
- Implement coefficient model and API
- Build calculation engine with unit tests
- Create calculation API endpoint
- Seed coefficient data for 2010-2025
- Set up FastAPI documentation

**Week 3: Frontend Core**
- Build landing page with method selector
- Implement manual input form with validation
- Create result display page
- Integrate with backend API
- Add responsive design

**Week 4: Testing & Deployment**
- Write E2E tests for manual flow
- Fix bugs and edge cases
- Deploy to Vercel (frontend) and Railway (backend)
- Performance optimization
- Documentation

### Phase 2: OCR Feature (Weeks 5-7)

**Week 5: Client-side OCR**
- Integrate Tesseract.js
- Build file upload UI
- Implement Web Worker for OCR processing

**Week 6: Batch Processing**
- Add multi-file support
- Implement progress tracking
- Build data review and merge UI

**Week 7: Testing & Polish**
- Test with real BHXH screenshots
- Optimize OCR accuracy
- Add error handling and retry logic

### Phase 3: Enhancements (Weeks 8-10)

**Week 8: PDF Export**
- Integrate jsPDF
- Design PDF template
- Add download functionality

**Week 9: UX Improvements**
- Add onboarding flow
- Implement help tooltips
- Add calculation history (localStorage)

**Week 10: Final Polish**
- SEO optimization
- Performance tuning
- User acceptance testing
- Launch preparation

---

**Document End**

**Total Estimated Timeline**: 10 weeks (2.5 months)

**Team Recommendation**:
- 1 Frontend Developer (Next.js/React)
- 1 Backend Developer (FastAPI/Python)
- 1 UI/UX Designer (part-time)
- 1 QA Engineer (part-time)

**Budget Estimate**:
- Development: $15,000 - $25,000
- Hosting (year 1): $500 - $1,000
- Third-party services: $200 - $500
- **Total**: $15,700 - $26,500


---

## UPDATE: LLM Vision OCR Strategy

### Change from Traditional OCR to LLM Vision

**Previous Approach**: Tesseract.js (client-side OCR)
**New Approach**: **Qwen2.5-VL-72B** via OpenRouter API (free)

### Why the Change?

| Benefit | Description |
|---------|-------------|
| **Higher Accuracy** | 90-95% vs 75-85% with Tesseract |
| **Structured Output** | Native JSON response (no parsing needed) |
| **Vietnamese Excellence** | Better handling of Vietnamese text |
| **Table Understanding** | LLM understands table layouts |
| **Simpler Implementation** | API call vs complex WASM setup |
| **FREE** | OpenRouter offers free access to Qwen models |

### Updated Technology Stack

**Frontend**:
- Remove: ~~Tesseract.js~~, ~~Web Workers~~
- Add: OpenRouter API client
- Add: Image preprocessing (compression)

**External Service**:
- OpenRouter API (https://openrouter.ai/api/v1/chat/completions)
- Model: `qwen/qwen2.5-vl-72b-instruct:free`

### Updated API Integration

```typescript
// lib/services/visionOcrService.ts
export class VisionOCRService {
  private readonly OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly MODEL_ID = 'qwen/qwen2.5-vl-72b-instruct:free';
  
  async extractPeriodsFromImage(imageFile: File): Promise<Period[]> {
    const base64Image = await this.convertToBase64(imageFile);
    
    const response = await fetch(this.OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: this.MODEL_ID,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: this.getExtractionPrompt() },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 1000
      })
    });
    
    const result = await response.json();
    return this.parseExtractedData(result.choices[0].message.content);
  }
  
  private getExtractionPrompt(): string {
    return `Extract social insurance contribution periods from this BHXH screenshot.
    
Return JSON:
{
  "periods": [
    {
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "monthly_salary": <number>
    }
  ],
  "confidence": <0-1>
}

Rules:
- Convert Vietnamese date format to ISO
- Remove currency symbols from salary
- Extract ALL visible periods`;
  }
}
```

### Updated File Structure

**Frontend Changes**:
```diff
lib/
├── services/
-   ├── ocrService.ts        # Tesseract.js wrapper (REMOVED)
+   ├── visionOcrService.ts  # OpenRouter LLM Vision (NEW)
    ├── api.ts
    ├── pdfService.ts
    └── calculationService.ts
-workers/
-   └── ocrWorker.ts         # Web Worker (REMOVED)
```

### Performance Comparison

| Metric | Tesseract.js | Qwen2.5-VL-72B |
|--------|--------------|----------------|
| Processing Time | 5-10s | 2-4s |
| Accuracy (Vietnamese) | 75-85% | 90-95% |
| Structured Output | ❌ Manual parsing | ✅ Native JSON |
| Setup Complexity | High (WASM) | Low (API call) |
| Client Resources | High (CPU) | Low (network only) |
| Privacy | ✅ Local | ⚠️ API call |

### Privacy & Security

**Trade-off**: API-based solution means images sent to OpenRouter
**Mitigation**:
1. Show user consent banner before first upload
2. OpenRouter doesn't store data long-term
3. Provide manual input alternative
4. (Optional) Proxy through FastAPI backend to hide API key

**Privacy Notice**:
```typescript
// Display before first OCR use
<Alert severity="info">
  Hình ảnh sẽ được xử lý qua OpenRouter API để trích xuất dữ liệu.
  Chúng tôi không lưu trữ hình ảnh của bạn.
  <Link href="/privacy">Tìm hiểu thêm</Link>
</Alert>
```

### Cost Analysis

**Free Tier** (OpenRouter):
- ✅ Unlimited requests (fair use)
- ✅ ~20 req/min rate limit
- ✅ No credit card required

**Expected Usage** (Month 1):
- 500 DAU × 40% OCR users = 200 users/day
- 200 users × 3 images = 600 images/day
- **Monthly**: ~18,000 images

**Verdict**: **FREE tier sufficient** for MVP. Budget $10-20/month if we hit rate limits.

### Updated Deployment

**Environment Variables**:
```bash
# .env.local (Frontend)
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
NEXT_PUBLIC_OCR_MODEL=qwen/qwen2.5-vl-72b-instruct:free
```

**API Key Security**:
- Frontend: Expose API key (acceptable for free tier)
- Production: Proxy through backend to hide key (optional)

### Testing Strategy

**New Test Cases**:
1. Clear BHXH screenshot (95%+ accuracy expected)
2. Blurry image (70-80% accuracy)
3. Old app format (test prompt robustness)
4. Multiple periods in one image
5. Vietnamese text with special characters

**Acceptance Criteria**:
- ✅ 85%+ extraction accuracy
- ✅ <5 second response time
- ✅ Handles rate limits gracefully
- ✅ Returns structured JSON

### Migration Timeline

**Week 1**: Implement VisionOCRService
**Week 2**: UI integration + testing
**Week 3**: Batch processing + error handling
**Week 4**: Production deployment + monitoring

---

For detailed OCR strategy, see [OCR_STRATEGY.md](./OCR_STRATEGY.md)

