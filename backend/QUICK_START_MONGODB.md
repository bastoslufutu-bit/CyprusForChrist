# ⚡ QUICK START MongoDB - Cyprus For Christ

Guide ultra-rapide pour démarrer avec MongoDB en 5 minutes! ⏱️

---

## 🚀 Installation Rapide (Windows)

### 1. Télécharger & Installer

```powershell
# Aller sur:
https://www.mongodb.com/try/download/community

# Télécharger MongoDB 7.0 Windows MSI
# Installer avec toutes les options par défaut ✅
```

### 2. Vérifier l'Installation

```powershell
# Ouvrir PowerShell
mongosh

# Si ça fonctionne ✅ vous voyez:
# test>

# Quitter
exit
```

---

## 🗄️ Créer la Base de Données (2 minutes)

### Méthode Simple (Sans Authentification)

```javascript
// 1. Ouvrir mongosh
mongosh

// 2. Créer la base
use cyprus_for_christ

// 3. Créer une collection test
db.createCollection("config")

// 4. Insérer un document test
db.config.insertOne({ name: "Cyprus For Christ", ready: true })

// 5. Vérifier
db.config.find()

// 6. ✅ Parfait! Quitter
exit
```

---

## 🔌 Connecter à Django (1 minute)

### Éditer `.env`

Ouvrir: `backend\.env`

```env
# MongoDB Configuration
MONGO_DB_NAME=cyprus_for_christ
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USERNAME=
MONGO_PASSWORD=
```

**C'est tout!** ✅

---

## ✅ Tester la Connexion

```powershell
# Dans le dossier backend
python manage.py shell
```

```python
# Dans le shell Python
import mongoengine
from mongoengine import connection

db = connection.get_db()
print(db.list_collection_names())
# Devrait afficher: ['config']

exit()
```

**✅ MongoDB connecté à Django!**

---

## 📝 Commandes Essentielles

```powershell
# Démarrer MongoDB
net start MongoDB

# Arrêter MongoDB
net stop MongoDB

# Ouvrir MongoDB Shell
mongosh

# Voir les bases de données
show dbs

# Utiliser cyprus_for_christ
use cyprus_for_christ

# Voir les collections
show collections
```

---

## 🎯 Vous êtes Prêt!

MongoDB est configuré et connecté à Django. On peut maintenant:
- ✅ Développer les modèles
- ✅ Créer les collections
- ✅ Stocker les données

**Guide complet**: Voir `MONGODB_SETUP.md` pour plus de détails.

---

**Cyprus For Christ** 🙏✨
