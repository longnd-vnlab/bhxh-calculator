# BHXH Calculator - Vietnamese Social Insurance Calculator

Ứng dụng tính toán số tiền bảo hiểm xã hội (BHXH) một lần theo quy định mới nhất của Việt Nam năm 2025.

## Features

- ✅ **Nhập thủ công**: Nhập từng giai đoạn đóng BHXH chi tiết
- 📷 **OCR tự động**: Tải ảnh app BHXH để trích xuất thông tin bằng AI (Qwen2.5-VL-72B)
- 📊 **Báo cáo chi tiết**: Xem breakdown từng giai đoạn với giải thích công thức
- 🎨 **UI hiện đại**: Minimalist design với Tailwind CSS
- 🐳 **Docker**: Full-stack deployment với Docker Compose
- 🔒 **Bảo mật**: Client-side processing, không lưu trữ dữ liệu người dùng

## Tech Stack

### Frontend
- **Next.js 15** (App Router with RSC)
- **React 18** + TypeScript
- **Tailwind CSS** + MUI components
- **Zustand** (State management)
- **OpenRouter API** (Vision OCR with Qwen2.5-VL-72B)

### Backend
- **FastAPI** (Python 3.11+)
- **PostgreSQL 15** (Coefficient storage)
- **Redis** (Caching)
- **SQLAlchemy 2.0** (ORM)
- **Pydantic v2** (Validation)

## Prerequisites

- Docker & Docker Compose
- OpenRouter API Key (Free - https://openrouter.ai/)

## Quick Start

### 1. Clone & Setup Environment

```bash
cd /home/dinhlongit/Documents/bhxh-calculator

# Copy environment file
cp .env.example .env

# Edit .env and add your OpenRouter API key
nano .env
# Add: OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### 2. Get OpenRouter API Key (FREE)

1. Go to https://openrouter.ai/
2. Sign up with GitHub/Google
3. Navigate to "Keys" → "Create Key"
4. Copy key and paste into `.env` file

### 3. Start Application with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 4. Access Application

Open your browser and navigate to:
- **App**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

## Development

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Development

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000

# Run tests
pytest
```

## Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up --build

# Reset database
docker-compose down -v
docker-compose up --build
```

## Project Structure

```
bhxh-calculator/
├── frontend/                 # Next.js application
│   ├── app/                  # App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── manual/          # Manual input page
│   │   ├── ocr/             # OCR upload page
│   │   └── result/          # Result display page
│   ├── components/          # React components
│   ├── lib/                 # Services, stores, utils
│   └── package.json
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py          # FastAPI app entry
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API routes
│   │   ├── services/        # Business logic
│   │   └── database.py      # Database config
│   ├── init.sql             # Database initialization
│   └── requirements.txt
│
└── docker-compose.yml        # Docker orchestration
```

## API Endpoints

### Calculation
- `POST /api/v1/calculate` - Calculate BHXH amount
- `GET /api/v1/health` - Health check

### Coefficients
- `GET /api/v1/coefficients` - Get all coefficients
- `GET /api/v1/coefficients/{year}` - Get coefficient by year
- `GET /api/v1/coefficients/range?start_year=2010&end_year=2023` - Get range

## Calculation Formula

According to **Thông tư 01/2025/TT-BLĐTBXH**:

```
Mức hưởng = (1.5 × Mbqtl × Years_Pre2014) + (2.0 × Mbqtl × Years_From2014)

Where:
- Mbqtl = Average adjusted monthly salary
- Adjusted salary = Original salary × Coefficient
- Coefficient varies by year (inflation adjustment)
```

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-key
NEXT_PUBLIC_OCR_MODEL=qwen/qwen2.5-vl-72b-instruct:free
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://bhxh_user:bhxh_password@postgres:5432/bhxh_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your-secret-key
CORS_ORIGINS=["http://localhost:3000"]
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest --cov=app
```

## Deployment

### Production Build

```bash
# Build frontend
cd frontend && npm run build

# Backend already built in Docker
docker-compose -f docker-compose.prod.yml up -d
```

### Recommended Hosting
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Fly.io
- **Database**: Supabase, Neon
- **Redis**: Upstash

## Troubleshooting

### CORS Error
- Check `CORS_ORIGINS` in backend `.env`
- Ensure frontend URL is included

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### OCR Not Working
- Verify OpenRouter API key in `.env`
- Check API key format: `sk-or-v1-...`
- Test at https://openrouter.ai/playground

### Port Already in Use
```bash
# Stop existing processes
docker-compose down

# Or change ports in docker-compose.yml
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/bhxh-calculator/issues)
- Email: support@bhxh-calculator.com

## Acknowledgments

- Thông tư 01/2025/TT-BLĐTBXH (Vietnamese Social Insurance regulations)
- OpenRouter for free AI vision API
- Next.js, FastAPI, and all open-source contributors

---

**Note**: This application provides calculation reference only. Please consult official BHXH agencies for authoritative information.

**Version**: 1.0.0
**Last Updated**: 2025-12-25
