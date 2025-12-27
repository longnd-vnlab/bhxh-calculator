# Quick Start Guide - BHXH Calculator

## 🚀 Setup in 30 Minutes

### Prerequisites
- Node.js 18+ (for Next.js)
- Python 3.11+ (for FastAPI)
- PostgreSQL 15+
- Redis (optional for caching)
- OpenRouter API key (free)

---

## Frontend Setup (Next.js)

### 1. Create Next.js Project
```bash
npx create-next-app@latest bhxh-calculator-frontend --typescript --tailwind --app
cd bhxh-calculator-frontend
```

### 2. Install Dependencies
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install zustand react-hook-form zod
npm install axios swr
npm install jspdf html2canvas
npm install react-dropzone
npm install date-fns
```

### 3. Environment Setup
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-key-here
NEXT_PUBLIC_OCR_MODEL=qwen/qwen2.5-vl-72b-instruct:free
```

### 4. Get OpenRouter API Key (FREE)
1. Go to https://openrouter.ai/
2. Sign up with GitHub/Google
3. Go to "Keys" → "Create Key"
4. Copy key to `.env.local`

### 5. Project Structure
```bash
mkdir -p app/{manual,ocr,result}
mkdir -p components/{common,manual,ocr,result,layout}
mkdir -p lib/{services,store,utils,types}
```

### 6. Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

---

## Backend Setup (FastAPI)

### 1. Create Python Project
```bash
mkdir bhxh-calculator-backend
cd bhxh-calculator-backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic
pip install pydantic pydantic-settings
pip install python-multipart python-dotenv
pip install redis pytest pytest-cov
```

### 3. Create requirements.txt
```bash
pip freeze > requirements.txt
```

### 4. Environment Setup
```bash
# .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/bhxh_db
REDIS_URL=redis://localhost:6379/0
CORS_ORIGINS=["http://localhost:3000"]
SECRET_KEY=your-secret-key-here
```

### 5. Database Setup
```bash
# Create database
createdb bhxh_db

# Initialize Alembic
alembic init alembic

# Create first migration
alembic revision -m "Initial tables"

# Run migrations
alembic upgrade head
```

### 6. Project Structure
```bash
mkdir -p app/{models,schemas,routers,services,utils,tests}
touch app/__init__.py app/main.py app/config.py app/database.py
```

### 7. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
# Visit http://localhost:8000/docs for API docs
```

---

## Minimal Working Example

### Frontend: Landing Page (app/page.tsx)
```typescript
import Link from 'next/link';
import { Button, Container, Typography, Box, Card } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg" className="py-16">
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom className="font-bold text-[#00A551]">
          Tính BHXH Một Lần
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Chính xác - Minh bạch - Dễ sử dụng
        </Typography>
      </Box>

      <Box display="flex" gap={4} justifyContent="center" flexWrap="wrap">
        <Card className="p-8 max-w-sm hover:shadow-xl transition-shadow cursor-pointer">
          <Link href="/manual">
            <Typography variant="h5" gutterBottom>📝 Nhập Thủ công</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Nhập từng giai đoạn đóng BHXH và mức lương
            </Typography>
            <Button variant="contained" fullWidth sx={{ bgcolor: '#00A551' }}>
              Bắt đầu
            </Button>
          </Link>
        </Card>

        <Card className="p-8 max-w-sm hover:shadow-xl transition-shadow cursor-pointer">
          <Link href="/ocr">
            <Typography variant="h5" gutterBottom>📷 Tải ảnh Tự động</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Chụp ảnh app BHXH để trích xuất tự động
            </Typography>
            <Button variant="contained" fullWidth sx={{ bgcolor: '#0066CC' }}>
              Upload ảnh
            </Button>
          </Link>
        </Card>
      </Box>
    </Container>
  );
}
```

### Backend: Main App (app/main.py)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import calculation, coefficient
from app.config import settings

app = FastAPI(
    title="BHXH Calculator API",
    description="API for Vietnamese Social Insurance one-time payment calculation",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(calculation.router, prefix="/api/v1", tags=["calculation"])
app.include_router(coefficient.router, prefix="/api/v1", tags=["coefficient"])

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
```

### Backend: Calculation Router (app/routers/calculation.py)
```python
from fastapi import APIRouter, HTTPException
from app.schemas.calculation_request import CalculationRequest
from app.schemas.calculation_response import CalculationResponse
from app.services.calculation_engine import CalculationEngine
from app.services.coefficient_service import CoefficientService

router = APIRouter()

@router.post("/calculate", response_model=CalculationResponse)
async def calculate_bhxh(request: CalculationRequest):
    """
    Calculate BHXH one-time payment amount.

    Formula:
    Mức hưởng = (1.5 × Mbqtl × Years_Pre2014) + (2.0 × Mbqtl × Years_From2014)
    """
    try:
        # Get coefficients
        coeff_service = CoefficientService()
        coefficients = await coeff_service.get_all_active()

        # Calculate
        engine = CalculationEngine()
        result = engine.calculate(request.periods, coefficients)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Frontend: Vision OCR Service (lib/services/visionOcrService.ts)
```typescript
export class VisionOCRService {
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly MODEL = process.env.NEXT_PUBLIC_OCR_MODEL!;
  private readonly API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!;

  async extractPeriods(imageFile: File): Promise<Period[]> {
    const base64 = await this.fileToBase64(imageFile);

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: this.getPrompt() },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
          ]
        }],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      })
    });

    const data = await response.json();
    const extracted = JSON.parse(data.choices[0].message.content);

    return extracted.periods.map(p => ({
      id: crypto.randomUUID(),
      startDate: new Date(p.start_date),
      endDate: new Date(p.end_date),
      monthlySalary: p.monthly_salary,
    }));
  }

  private getPrompt(): string {
    return `Extract BHXH periods from this image.
Return JSON:
{
  "periods": [
    {
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "monthly_salary": <number>
    }
  ]
}`;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
```

---

## Database Schema

### Create Coefficient Table
```sql
CREATE TABLE coefficient (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    coefficient DECIMAL(10, 4) NOT NULL,
    effective_from TIMESTAMP NOT NULL,
    effective_to TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month)
);

-- Index for fast lookup
CREATE INDEX idx_coefficient_year_month ON coefficient(year, month);
CREATE INDEX idx_coefficient_active ON coefficient(is_active) WHERE is_active = TRUE;
```

### Seed Data (Example)
```sql
INSERT INTO coefficient (year, month, coefficient, effective_from, effective_to, is_active) VALUES
(2024, 1, 1.00, '2024-01-01', '2024-12-31', TRUE),
(2023, 1, 1.08, '2023-01-01', '2023-12-31', TRUE),
(2022, 1, 1.18, '2022-01-01', '2022-12-31', TRUE),
(2021, 1, 1.29, '2021-01-01', '2021-12-31', TRUE),
(2020, 1, 1.41, '2020-01-01', '2020-12-31', TRUE),
(2019, 1, 1.52, '2019-01-01', '2019-12-31', TRUE),
(2018, 1, 1.64, '2018-01-01', '2018-12-31', TRUE),
(2017, 1, 1.75, '2017-01-01', '2017-12-31', TRUE),
(2016, 1, 1.85, '2016-01-01', '2016-12-31', TRUE),
(2015, 1, 1.96, '2015-01-01', '2015-12-31', TRUE),
(2014, 1, 2.06, '2014-01-01', '2014-12-31', TRUE),
(2013, 1, 2.18, '2013-01-01', '2013-12-31', TRUE),
(2012, 1, 2.29, '2012-01-01', '2012-12-31', TRUE),
(2011, 1, 2.41, '2011-01-01', '2011-12-31', TRUE),
(2010, 1, 2.53, '2010-01-01', '2010-12-31', TRUE);
```

---

## Testing

### Frontend Test (components/manual/PeriodForm.test.tsx)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import PeriodForm from './PeriodForm';

describe('PeriodForm', () => {
  it('validates date range', () => {
    render(<PeriodForm onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2020-01-01' }
    });
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2019-12-31' }
    });

    expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
  });
});
```

### Backend Test (app/tests/test_calculation.py)
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_calculate_endpoint():
    response = client.post("/api/v1/calculate", json={
        "periods": [{
            "start_date": "2010-01-01",
            "end_date": "2013-12-31",
            "monthly_salary": 5000000
        }],
        "calculation_year": "2025"
    })

    assert response.status_code == 200
    data = response.json()
    assert "total_amount" in data
    assert data["total_amount"] > 0
```

---

## Deployment

### Quick Deploy to Vercel (Frontend)
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Quick Deploy to Railway (Backend)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

## Troubleshooting

### Common Issues

**1. CORS Error**
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**2. OpenRouter API Key Invalid**
- Check `.env.local` file
- Verify key starts with `sk-or-v1-`
- Test at https://openrouter.ai/playground

**3. Database Connection Error**
- Check PostgreSQL is running: `pg_isready`
- Verify connection string in `.env`
- Test connection: `psql $DATABASE_URL`

**4. Rate Limit on OpenRouter**
- Wait 60 seconds
- Reduce concurrent requests to 2-3
- Consider adding delay between requests

---

## Next Steps

1. ✅ Follow this guide to set up basic project
2. 📖 Read [ARCHITECTURE.md](./ARCHITECTURE.md) for full details
3. 🎨 Read [OCR_STRATEGY.md](./OCR_STRATEGY.md) for vision model setup
4. 💡 Implement features from [PRD.md](./PRD.md)
5. 🚀 Deploy to production

---

## Need Help?

- **Documentation**: See ARCHITECTURE.md, PRD.md, OCR_STRATEGY.md
- **API Docs**: http://localhost:8000/docs (after backend setup)
- **OpenRouter**: https://openrouter.ai/docs
- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com/

Good luck! 🎉
