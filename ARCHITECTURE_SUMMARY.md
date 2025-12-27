# BHXH Calculator - Architecture Summary

## Quick Overview

**Project**: Vietnamese Social Insurance One-Time Payment Calculator
**Stack**: Next.js 15 (Frontend) + FastAPI (Backend) + PostgreSQL + Redis
**Timeline**: 10 weeks (2.5 months)
**Budget**: $15,700 - $26,500

---

## Technology Stack

### Frontend
- Next.js 15 (App Router + RSC)
- React 18 + TypeScript
- Material-UI v6 + Tailwind CSS
- Zustand (state management)
- React Hook Form (forms)
- Tesseract.js (client-side OCR)
- jsPDF (PDF generation)

### Backend
- FastAPI + Python 3.11+
- PostgreSQL (coefficient data)
- Redis (caching)
- SQLAlchemy 2.0 + Alembic
- Pydantic v2 (validation)
- pytest (testing)

### Deployment
- Frontend: Vercel (CDN + Edge)
- Backend: Railway/Render (Docker)
- Database: Supabase/Neon (PostgreSQL)
- Cache: Upstash (Redis)

---

## System Architecture

```
┌─────────────────────────────────────────┐
│   Next.js (Client + Server Components) │
│   ├── Pages (RSC)                       │
│   ├── Components (MUI + Tailwind)       │
│   ├── State (Zustand)                   │
│   ├── OCR (Tesseract.js Web Worker)    │
│   └── PDF (jsPDF)                       │
└────────────────┬────────────────────────┘
                 │ HTTP/REST API
┌────────────────▼────────────────────────┐
│   FastAPI Backend                       │
│   ├── Routers (/calculate, /coeff)     │
│   ├── Services (CalculationEngine)     │
│   ├── Models (Pydantic + SQLAlchemy)   │
│   └── Cache (Redis)                     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   PostgreSQL (Coefficient Data)         │
│   Redis (Cache Layer)                   │
└─────────────────────────────────────────┘
```

---

## Key Features

### 1. Manual Input
- Dynamic form with multiple periods
- Client-side validation (React Hook Form)
- Real-time calculation preview
- Responsive mobile design

### 2. OCR Batch Upload
- Drag & drop 5-10 images
- Parallel processing (2-3 concurrent)
- Progress tracking per image
- Review & edit extracted data
- Auto-merge periods

### 3. Calculation Engine
- Accurate formula: `(1.5 × Mbqtl × Years_Pre2014) + (2.0 × Mbqtl × Years_From2014)`
- Coefficient management (Thông tư 01/2025)
- Detailed breakdown per period
- Formula explanation

### 4. PDF Export
- Client-side generation (no server load)
- Professional template
- Detailed breakdown table

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/calculate` | Calculate BHXH one-time payment |
| GET | `/api/v1/coefficients` | Get all inflation coefficients |
| GET | `/api/v1/coefficients/{year}` | Get coefficients for year |
| GET | `/api/v1/coefficients/range` | Get range of coefficients |
| POST | `/api/v1/ocr/cloud` | Cloud OCR (P2 feature) |
| GET | `/api/v1/health` | Health check |

---

## Data Flow Examples

### Manual Input Flow
```
User → Fill Form → Validate → POST /calculate → Backend Engine
→ Query Coefficients → Calculate → Response → Display Result → Export PDF
```

### OCR Batch Flow
```
User → Upload 4 Images → Tesseract.js (Web Worker x2-3 concurrent)
→ Extract Periods → Review & Edit → Merge → POST /calculate → Result
```

---

## File Structure Highlights

### Frontend (Next.js)
```
app/
├── page.tsx                 # Landing page (RSC)
├── manual/page.tsx          # Manual input
├── ocr/page.tsx             # OCR upload
└── result/page.tsx          # Calculation result

components/
├── manual/
│   ├── PeriodForm.tsx       # Dynamic period form
│   └── PeriodList.tsx
├── ocr/
│   ├── FileUploader.tsx     # Multi-file dropzone
│   ├── FileList.tsx         # Progress tracking
│   └── DataMerger.tsx       # Merge extracted data
└── result/
    ├── TotalAmount.tsx      # Prominent display
    └── BreakdownSection.tsx # Detailed breakdown

lib/
├── services/
│   ├── api.ts               # Backend API client
│   ├── ocrService.ts        # Tesseract.js wrapper
│   └── pdfService.ts        # jsPDF generator
└── store/
    └── calculationStore.ts  # Zustand state
```

### Backend (FastAPI)
```
app/
├── main.py                  # FastAPI app
├── routers/
│   ├── calculation.py       # POST /calculate
│   └── coefficient.py       # GET /coefficients
├── services/
│   ├── calculation_engine.py # Core calculation
│   └── coefficient_service.py # CRUD operations
├── models/
│   └── coefficient.py       # SQLAlchemy model
└── schemas/
    ├── calculation_request.py  # Pydantic schemas
    └── calculation_response.py
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| OCR Processing | < 10 seconds (per image) |
| Calculation Time | < 1 second |
| API Response Time | < 500ms |

---

## Security Measures

1. **Frontend**: Input sanitization, XSS prevention, CSRF protection
2. **Backend**: CORS configuration, rate limiting (10/min), Pydantic validation
3. **Database**: SQL injection prevention (ORM), connection pooling
4. **Privacy**: Client-side OCR, no user data storage, HTTPS only

---

## Testing Strategy

- **Frontend**: Jest + React Testing Library (unit), Playwright (E2E)
- **Backend**: pytest (unit + integration), FastAPI TestClient
- **Coverage Target**: 80%+

---

## Deployment Steps

1. **Frontend (Vercel)**
   ```bash
   vercel --prod
   ```
   - Auto-deploy on git push
   - Edge CDN distribution
   - Built-in analytics

2. **Backend (Railway)**
   ```bash
   railway up
   ```
   - Docker container
   - Auto-scaling
   - PostgreSQL addon

3. **Database (Supabase)**
   - Create project → Copy connection string
   - Run migrations: `alembic upgrade head`
   - Seed coefficients: `python scripts/seed_coefficients.py`

---

## Questions to Clarify

1. **Coefficient Data**: Who will update annual coefficients? Admin panel needed?
2. **User Auth**: Required for MVP? Email/password or social login?
3. **OCR Budget**: Start with client-side or invest in Cloud Vision API?
4. **Legal Disclaimer**: Specific text for calculation results?
5. **Analytics**: Can we collect anonymous usage data?
6. **Hosting Budget**: Expected traffic volume? Free tier sufficient?

---

## Next Steps

### Phase 1: MVP (4 weeks)
- Week 1: Project setup + database schema
- Week 2: Backend calculation engine + API
- Week 3: Frontend manual input + result display
- Week 4: Testing + deployment

### Phase 2: OCR (3 weeks)
- Week 5: Tesseract.js integration
- Week 6: Batch upload + merge UI
- Week 7: Testing with real screenshots

### Phase 3: Enhancements (3 weeks)
- Week 8: PDF export
- Week 9: UX improvements (onboarding, help)
- Week 10: Final polish + launch

---

## Team & Budget

**Recommended Team**:
- 1 Frontend Developer (Next.js/React)
- 1 Backend Developer (FastAPI/Python)
- 1 UI/UX Designer (part-time)
- 1 QA Engineer (part-time)

**Cost Breakdown**:
- Development: $15,000 - $25,000
- Hosting (year 1): $500 - $1,000
- Third-party services: $200 - $500
- **Total**: $15,700 - $26,500

---

## Key Success Factors

1. **Accuracy**: 95%+ calculation accuracy vs. official BHXH results
2. **UX**: Simple, intuitive interface for non-tech users
3. **Performance**: Fast OCR + calculation (< 15 seconds total)
4. **Mobile**: 60%+ mobile traffic → responsive design critical
5. **Privacy**: Client-side OCR → no user data sent to server

---

For detailed architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)
