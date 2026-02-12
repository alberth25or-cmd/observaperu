# Scripts de Procesamiento

Este directorio contiene scripts para procesar y organizar datos de candidatos.

## Scripts Disponibles

### 1. `organize-pdfs.js`
Organiza PDFs desde la carpeta de Downloads y los copia a `public/pdfs/` con nombres normalizados.

**Uso:**
```bash
node scripts/organize-pdfs.js
```

### 2. `update-pdf-links-v2.js`
Actualiza los enlaces a PDFs en `candidatos-detalle.ts`.

**Uso:**
```bash
node scripts/update-pdf-links-v2.js
```

### 3. `generar_metricas.py`
Procesa PDFs de candidatos y genera métricas estadísticas con procesamiento paralelo.

**Requisitos:**
```bash
pip install -r requirements.txt
```

**Uso:**
```bash
python scripts/generar_metricas.py
```

**Output:**
- `public/data/candidatos_features.csv` - Features crudas (conteos objetivos)
- `public/data/candidatos_scores.json` - Scores normalizados (0-100)
- `public/data/candidatos_scores.csv` - Scores en formato CSV

**Características:**
- Procesamiento paralelo (4 workers por defecto)
- Pipeline determinístico y auditable
- Normalización truncada con máximos teóricos fijos
- Manejo robusto de archivos faltantes

