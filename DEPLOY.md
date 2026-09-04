# Deployment Guide

### 1. Build & Deploy
```bash
npm run build
npm run deploy
```

---

### 2. Full Workflow (Git + Build + Deploy)
```bash
git add .
git commit -m "Update website"
git push origin master

npm run build
npm run deploy
```

---

### 3. Local Development / Preview
```bash
npx gulp
# Open http://localhost:3000 (EN) or http://localhost:3000/index-ar.html (AR)
```
