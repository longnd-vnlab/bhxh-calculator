# Getting Started - BHXH Calculator

## 🚀 Quick Start (5 Minutes)

### Step 1: Get OpenRouter API Key (FREE)

1. Visit https://openrouter.ai/
2. Click "Sign Up" (use GitHub or Google)
3. Go to "Keys" tab
4. Click "Create Key"
5. Copy the key (starts with `sk-or-v1-`)

### Step 2: Configure Environment

```bash
# Navigate to project directory
cd /home/dinhlongit/Documents/bhxh-calculator

# Copy environment file
cp .env.example .env

# Open .env file and paste your API key
nano .env
```

Add this line to `.env`:
```
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 3: Start Application

```bash
# Make start script executable (one time only)
chmod +x start.sh

# Run the start script
./start.sh
```

**OR** manually with Docker:

```bash
docker-compose up --build
```

### Step 4: Access Application

Open your browser and go to:
- **Main App**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

## 📖 How to Use

### Option 1: Manual Input

1. Click "Nhập Thủ Công" on homepage
2. Add periods by clicking "Thêm giai đoạn"
3. Fill in:
   - Start date (Từ tháng/năm)
   - End date (Đến tháng/năm)
   - Monthly salary (Mức lương tháng)
4. Click "Tính toán ngay"
5. View detailed results!

### Option 2: OCR Upload

1. Click "Tải Ảnh Tự Động" on homepage
2. Drag & drop images from BHXH app
   - Or click to select files
   - Can upload multiple images at once
3. Wait for AI to extract data
4. Review extracted periods
5. Click "Xác nhận và tính toán"
6. View results!

## 🛠️ Common Commands

```bash
# Start application
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Restart after code changes
docker-compose up --build

# Reset database
docker-compose down -v
docker-compose up --build

# Check service status
docker-compose ps
```

## 🔍 Troubleshooting

### Problem: Port 3000 already in use

**Solution 1**: Stop other applications using port 3000

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Solution 2**: Change port in `docker-compose.yml`

```yaml
frontend:
  ports:
    - "3001:3000"  # Change 3000 to 3001
```

### Problem: Database connection error

```bash
# Restart database
docker-compose restart postgres

# View database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Problem: OCR not working

1. **Check API Key**
   ```bash
   cat .env | grep OPENROUTER_API_KEY
   ```
   Ensure it starts with `sk-or-v1-`

2. **Test API Key**
   Visit https://openrouter.ai/playground
   Enter your API key and test

3. **Check logs**
   ```bash
   docker-compose logs frontend
   ```

### Problem: Frontend shows blank page

1. **Check if container is running**
   ```bash
   docker-compose ps
   ```

2. **View frontend logs**
   ```bash
   docker-compose logs frontend
   ```

3. **Rebuild frontend**
   ```bash
   docker-compose up --build frontend
   ```

## 📊 Viewing Data

### Check Database Tables

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U bhxh_user -d bhxh_db

# List tables
\dt

# View coefficients
SELECT year, coefficient FROM coefficient ORDER BY year DESC;

# Exit
\q
```

### Check Redis Cache

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# List keys
KEYS *

# Get value
GET <key>

# Exit
exit
```

## 🎯 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Get coefficients
curl http://localhost:8000/api/v1/coefficients

# Calculate (example)
curl -X POST http://localhost:8000/api/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "periods": [{
      "start_date": "2010-01-01",
      "end_date": "2013-12-31",
      "monthly_salary": 5000000
    }],
    "calculation_year": "2025"
  }'
```

### Test Frontend

1. Go to http://localhost:3000
2. Click "Nhập Thủ Công"
3. Add a test period:
   - Start: 2010-01-01
   - End: 2013-12-31
   - Salary: 5,000,000
4. Click "Tính toán ngay"
5. You should see results!

## 📝 Development

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run dev server (outside Docker)
npm run dev

# Build for production
npm run build
```

### Backend Development

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run dev server (outside Docker)
uvicorn app.main:app --reload
```

## 🎨 Customization

### Change Primary Color

Edit `frontend/tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#00A551',  // Change this
    light: '#33B972',
    dark: '#008641',
  },
}
```

### Update Coefficients

Edit `backend/init.sql` and change values, then:

```bash
docker-compose down -v
docker-compose up --build
```

### Add New API Endpoints

1. Create router in `backend/app/routers/`
2. Add to `backend/app/main.py`
3. Restart backend

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **OpenRouter**: https://openrouter.ai/docs
- **Docker**: https://docs.docker.com

## 🆘 Getting Help

1. Check logs: `docker-compose logs -f`
2. Check README.md for detailed info
3. Review ARCHITECTURE.md for system design
4. Check PRD.md for requirements

## 🎉 Success Checklist

- [ ] Docker containers are running (`docker-compose ps`)
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API docs at http://localhost:8000/docs
- [ ] Can add periods manually
- [ ] Can upload images (if API key is configured)
- [ ] Calculation results display correctly
- [ ] No errors in logs (`docker-compose logs`)

---

**Congratulations!** You're ready to calculate BHXH! 🎊
