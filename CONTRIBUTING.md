# Contributing to SentinelAI

Öncelikle katkıda bulunmak için teşekkürler! 🙏

## 🤝 Katkı Süreci

### 1. Fork & Clone

```bash
# Repository'yi fork et
# Kendi bilgisayarına klonla
git clone https://github.com/YOUR_USERNAME/SentinelAI.git
cd SentinelAI

# Upstream remote ekle
git remote add upstream https://github.com/fatih3447-gif/SentinelAI.git
```

### 2. Feature Branch Oluştur

```bash
# Upstream'den latest al
git fetch upstream
git checkout -b feature/your-feature upstream/main

# Branch adlandırma:
# feature/new-feature-name
# bugfix/bug-description
# docs/documentation-update
```

### 3. Geliştirme Yap

```bash
# Ortam kur
make install
make build

# Hizmeti başlat
make up

# Değişiklikler yap...

# Test et
make test
make lint
make format
```

### 4. Commit & Push

```bash
# Anlamlı commit mesajları yazın
git add .
git commit -m "feat: Add real-time burnout alerts"

# Branch'i push et
git push origin feature/your-feature-name
```

### 5. Pull Request Oluştur

- GitHub'da Pull Request aç
- Açıklamayı detaylı yaz
- İlgili issue'ları reference et
- Screenshots/videos ekle (UI değişiklikleri için)

## 📋 Kod Standartları

### Python

```python
# Black formatter
make format

# Type hints kullan
def calculate_burnout(metrics: ShiftMetrics) -> BurnoutAlert:
    """
    Calculate burnout index.
    
    Args:
        metrics: Shift metrics
    
    Returns:
        BurnoutAlert with score and recommendation
    """
    pass

# Docstrings yazın
class MyService:
    """Service for doing important things."""
    pass
```

### TypeScript/React

```typescript
// Props interface
interface AgentCardProps {
  agent: Agent;
  onSelect: (id: string) => void;
}

// Functional components
const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect }) => {
  return <div>...</div>;
};

// Export at bottom
export default AgentCard;
```

### Git Commits

```
feat: Add new feature (50 chars max)
fix: Fix specific bug
docs: Documentation changes
refactor: Code refactoring
test: Add/update tests
chore: Dependencies, config
perf: Performance improvements

Kapsamlı açıklama (72 chars per line).
Lütfen şunun neden yapıldığını açıklayın.

İlgili issue'lar:
- Closes #123
- Fixes #456
```

## 🧪 Test Yazma

```python
# backend/tests/test_burnout.py
import pytest
from app.services.burnout import BurnoutEngine
from app.schemas.agent import ShiftMetrics

@pytest.mark.asyncio
async def test_calculate_high_burnout():
    """Test high burnout calculation."""
    engine = BurnoutEngine()
    metrics = ShiftMetrics(
        agent_id="test",
        total_calls=20,
        negative_calls=15,
        high_stress_calls=10
    )
    
    alert = await engine.calculate_shift_burnout(
        "agent_1",
        metrics
    )
    
    assert alert.burnout_level == BurnoutLevel.RED
    assert alert.burnout_score >= 75
```

## 📝 Documentation

- README.md - Proje özeti
- DEPLOYMENT.md - Deployment rehberi
- docs/ - Detaylı dokümantasyon
- Inline comments - Karmaşık kod için
- Docstrings - Tüm public functions/classes

## 🐛 Bug Report

```markdown
## Açıklama
Açıkça ne olduğunu açıkla.

## Tekrar Adımları
1. Adım 1
2. Adım 2
3. Adım 3

## Beklenen Davranış
Ne olması gerektiğini açıkla.

## Gerçek Davranış
Ne olduğunu açıkla.

## Ortam
- SentinelAI Version: 1.0.0
- OS: Ubuntu 22.04
- Docker: 20.10.x
```

## ✨ Feature Request

```markdown
## Özet
Yeni feature'ın kısa özeti.

## Problem
Çözmek istediği problemi açıkla.

## Çözüm
Nasıl çözmesi gerektiğini açıkla.

## Alternatifler
Başka seçenekler varsa açıkla.
```

## 🏆 Code Review Kriteriyası

- ✅ Kod standartlarına uygun
- ✅ Tests eklenmiş
- ✅ Documentation güncel
- ✅ Linting başarılı
- ✅ Commit mesajları açıklayıcı
- ✅ Backward compatibility
- ✅ Performance impact minimal
- ✅ Security issues yok

## 📚 Faydalı Kaynaklar

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Turkish NLP Guide](docs/TURKISH_NLP.md)
- [API Reference](docs/API_REFERENCE.md)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)

## 👥 Community

- Issues & Discussions: GitHub
- Email: support@sentinelai.dev
- Twitter: @sentinelai_io

## 📜 License

Tüm katkılar MIT License altında kabul edilir.

Sorularınız varsa çekinmeyin sorulara yanıt bekliyoruz! 🚀
