# 🗄️ GUIDE MONGODB - Cyprus For Christ

Guide complet pour installer et configurer MongoDB sur Windows pour Cyprus For Christ.

---

## 📋 Table des Matières

1. [Téléchargement et Installation](#1-téléchargement-et-installation)
2. [Vérification de l'Installation](#2-vérification-de-linstallation)
3. [Configuration MongoDB](#3-configuration-mongodb)
4. [Création de la Base de Données](#4-création-de-la-base-de-données)
5. [Connexion depuis Django](#5-connexion-depuis-django)
6. [Test de Connexion](#6-test-de-connexion)
7. [Commandes Utiles](#7-commandes-utiles)

---

## 1. Téléchargement et Installation

### Étape 1.1: Télécharger MongoDB

1. **Aller sur le site officiel**:
   - URL: https://www.mongodb.com/try/download/community
   - Sélectionner:
     - **Version**: 7.0.x (latest)
     - **Platform**: Windows x64
     - **Package**: MSI

2. **Télécharger** le fichier `.msi` (environ 400 MB)

### Étape 1.2: Installer MongoDB

1. **Lancer l'installateur** (double-clic sur le fichier .msi)

2. **Assistant d'installation**:
   - ✅ Cliquer sur **"Next"**
   - ✅ Accepter les termes de licence → **"I accept"** → **"Next"**
   - ✅ Choisir **"Complete"** installation → **"Next"**

3. **Configuration du Service**:
   - ✅ Cocher **"Install MongoDB as a Service"**
   - ✅ Service Name: **"MongoDB"**
   - ✅ Data Directory: `C:\Program Files\MongoDB\Server\7.0\data\`
   - ✅ Log Directory: `C:\Program Files\MongoDB\Server\7.0\log\`
   - ✅ Cliquer **"Next"**

4. **MongoDB Compass** (interface graphique):
   - ⚠️ **Décocher** "Install MongoDB Compass" (optionnel, on l'installera séparément si besoin)
   - ✅ Cliquer **"Next"**

5. **Finaliser**:
   - ✅ Cliquer **"Install"**
   - ⏳ Attendre la fin de l'installation (2-5 minutes)
   - ✅ Cliquer **"Finish"**

---

## 2. Vérification de l'Installation

### Étape 2.1: Vérifier que MongoDB fonctionne

1. **Ouvrir PowerShell en tant qu'Administrateur**:
   - Clic droit sur le menu Démarrer → **"Windows PowerShell (Admin)"**

2. **Vérifier le service MongoDB**:
   ```powershell
   Get-Service MongoDB
   ```

   **Résultat attendu**:
   ```
   Status   Name               DisplayName
   ------   ----               -----------
   Running  MongoDB            MongoDB Server
   ```

3. **Si le service n'est pas démarré**:
   ```powershell
   net start MongoDB
   ```

### Étape 2.2: Vérifier MongoDB Shell

1. **Ouvrir un nouveau PowerShell** (pas besoin d'admin):
   ```powershell
   mongosh
   ```

   **Résultat attendu**:
   ```
   Current Mongosh Log ID: ...
   Connecting to:          mongodb://127.0.0.1:27017/
   Using MongoDB:          7.0.x
   Using Mongosh:          2.x.x

   test>
   ```

2. **Taper `exit` pour quitter**:
   ```javascript
   exit
   ```

✅ **MongoDB est installé et fonctionne!**

---

## 3. Configuration MongoDB

### Étape 3.1: Créer un Utilisateur Admin (Optionnel mais Recommandé)

1. **Ouvrir MongoDB Shell**:
   ```powershell
   mongosh
   ```

2. **Se connecter à la base `admin`**:
   ```javascript
   use admin
   ```

3. **Créer un utilisateur administrateur**:
   ```javascript
   db.createUser({
     user: "cyprusadmin",
     pwd: "VotreMotDePasseSecurise123!",
     roles: [
       { role: "userAdminAnyDatabase", db: "admin" },
       { role: "readWriteAnyDatabase", db: "admin" }
     ]
   })
   ```

   **Résultat attendu**:
   ```
   { ok: 1 }
   ```

4. **Quitter**:
   ```javascript
   exit
   ```

### Étape 3.2: Configuration Avancée (Optionnel)

Si vous avez créé un utilisateur, éditez le fichier de configuration MongoDB:

**Fichier**: `C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`

Ajouter (si absent):
```yaml
security:
  authorization: enabled
```

Puis redémarrer le service:
```powershell
net stop MongoDB
net start MongoDB
```

---

## 4. Création de la Base de Données

### Étape 4.1: Se connecter et créer la base

1. **Ouvrir MongoDB Shell**:
   ```powershell
   mongosh
   ```

   **OU avec authentification (si configurée)**:
   ```powershell
   mongosh -u cyprusadmin -p VotreMotDePasseSecurise123! --authenticationDatabase admin
   ```

2. **Créer/Utiliser la base de données Cyprus For Christ**:
   ```javascript
   use cyprus_for_christ
   ```

   **Résultat**:
   ```
   switched to db cyprus_for_christ
   ```

3. **Créer une collection de test**:
   ```javascript
   db.createCollection("config")
   ```

4. **Insérer un document de test**:
   ```javascript
   db.config.insertOne({
     name: "Cyprus For Christ",
     version: "1.0.0",
     created_at: new Date()
   })
   ```

   **Résultat**:
   ```javascript
   {
     acknowledged: true,
     insertedId: ObjectId("...")
   }
   ```

5. **Vérifier la création**:
   ```javascript
   db.config.find()
   ```

   **Résultat**: Vous devriez voir votre document

6. **Lister les bases de données**:
   ```javascript
   show dbs
   ```

   **Résultat**: `cyprus_for_christ` devrait apparaître dans la liste

7. **Quitter**:
   ```javascript
   exit
   ```

✅ **Base de données `cyprus_for_christ` créée avec succès!**

---

## 5. Connexion depuis Django

### Étape 5.1: Configurer le fichier .env

1. **Ouvrir le fichier** `C:\Users\Administrator\Documents\Cyprusforchrist\backend\.env`

2. **Configuration SANS authentification** (par défaut):
   ```env
   # MongoDB Configuration
   MONGO_DB_NAME=cyprus_for_christ
   MONGO_HOST=localhost
   MONGO_PORT=27017
   MONGO_USERNAME=
   MONGO_PASSWORD=
   ```

3. **Configuration AVEC authentification** (si vous avez créé un user):
   ```env
   # MongoDB Configuration
   MONGO_DB_NAME=cyprus_for_christ
   MONGO_HOST=localhost
   MONGO_PORT=27017
   MONGO_USERNAME=cyprusadmin
   MONGO_PASSWORD=VotreMotDePasseSecurise123!
   ```

4. **Sauvegarder** le fichier

### Étape 5.2: Vérifier settings.py

Le fichier `cyprus_api/settings.py` est déjà configuré pour se connecter à MongoDB:

```python
# MongoDB Connection via MongoEngine
import mongoengine

MONGODB_SETTINGS = {
    'db': config('MONGO_DB_NAME', default='cyprus_for_christ'),
    'host': config('MONGO_HOST', default='localhost'),
    'port': config('MONGO_PORT', default=27017, cast=int),
    'username': config('MONGO_USERNAME', default=''),
    'password': config('MONGO_PASSWORD', default=''),
}

# Connect to MongoDB
try:
    mongoengine.connect(**MONGODB_SETTINGS)
except Exception as e:
    print(f"MongoDB connection warning: {e}")
```

✅ **Django est configuré pour MongoDB!**

---

## 6. Test de Connexion

### Étape 6.1: Tester la connexion depuis Django

1. **Arrêter le serveur Django** si il tourne (CTRL+C dans le terminal)

2. **Ouvrir le shell Django**:
   ```powershell
   python manage.py shell
   ```

3. **Tester la connexion MongoDB**:
   ```python
   import mongoengine
   from decouple import config
   
   # Afficher la connexion active
   print("MongoDB Connection:")
   print(f"Database: {config('MONGO_DB_NAME', default='cyprus_for_christ')}")
   print(f"Host: {config('MONGO_HOST', default='localhost')}")
   print(f"Port: {config('MONGO_PORT', default=27017)}")
   
   # Tester une requête simple
   try:
       from mongoengine import connection
       db = connection.get_db()
       collections = db.list_collection_names()
       print(f"\nCollections trouvées: {collections}")
       print("\n✅ Connexion MongoDB réussie!")
   except Exception as e:
       print(f"\n❌ Erreur: {e}")
   ```

4. **Quitter le shell**:
   ```python
   exit()
   ```

### Étape 6.2: Redémarrer le serveur

```powershell
python manage.py runserver
```

**Vérifier** qu'il n'y a pas d'erreur MongoDB au démarrage.

✅ **Tout fonctionne!**

---

## 7. Commandes Utiles

### Gestion du Service MongoDB

```powershell
# Démarrer MongoDB
net start MongoDB

# Arrêter MongoDB
net stop MongoDB

# Redémarrer MongoDB
net stop MongoDB && net start MongoDB

# Vérifier le statut
Get-Service MongoDB
```

### MongoDB Shell (mongosh)

```javascript
// Se connecter
mongosh

// Avec authentification
mongosh -u cyprusadmin -p VotreMotDePasseSecurise123! --authenticationDatabase admin

// Lister les bases de données
show dbs

// Utiliser une base
use cyprus_for_christ

// Lister les collections
show collections

// Voir tous les documents d'une collection
db.collection_name.find()

// Compter les documents
db.collection_name.countDocuments()

// Supprimer une collection
db.collection_name.drop()

// Supprimer une base de données (attention!)
use cyprus_for_christ
db.dropDatabase()

// Quitter
exit
```

### Backup & Restore

```powershell
# Backup (dump) de la base de données
mongodump --db cyprus_for_christ --out C:\backup\mongodb\

# Restore
mongorestore --db cyprus_for_christ C:\backup\mongodb\cyprus_for_christ\
```

---

## 📊 Structure de Base de Données Cyprus For Christ

### Collections qui seront créées par Django/MongoEngine:

```
cyprus_for_christ/
├── sermons                  # Sermons (PDF + YouTube)
├── sermon_comments          # Commentaires sur sermons
├── prayer_requests          # Requêtes de prière (encrypted)
├── rhema_daily              # Rhéma quotidien
├── ai_conversations         # Historique conversations IA
├── bible_verses             # Bible Louis Segond
├── donations                # Dons PayPal
├── analytics_logs           # Logs statistiques
└── config                   # Configuration (test)
```

Ces collections seront créées **automatiquement** par MongoEngine quand on développera les modèles.

---

## 🔧 Troubleshooting

### Problème: MongoDB ne démarre pas

**Solution**:
```powershell
# Vérifier les logs
Get-Content "C:\Program Files\MongoDB\Server\7.0\log\mongod.log" -Tail 50
```

### Problème: Port 27017 déjà utilisé

**Solution**:
```powershell
# Vérifier ce qui utilise le port
netstat -ano | findstr :27017

# Tuer le processus (remplacer PID par l'ID du processus)
taskkill /PID <PID> /F
```

### Problème: Erreur d'authentification

**Solution**:
- Vérifier username/password dans `.env`
- Vérifier que l'utilisateur existe dans MongoDB
- Vérifier `authenticationDatabase` (généralement `admin`)

---

## ✅ Checklist Finale

Avant de continuer le développement, vérifier:

- [x] MongoDB installé et service démarré
- [x] Base de données `cyprus_for_christ` créée
- [x] Collection de test créée et fonctionnelle
- [x] Fichier `.env` configuré avec les bons paramètres
- [x] Connexion Django → MongoDB testée et fonctionnelle
- [x] Aucune erreur au démarrage du serveur Django

---

## 🎯 Prochaine Étape

Une fois MongoDB configuré, nous pouvons:

1. ✅ Développer les **modèles MongoEngine** pour chaque app
2. ✅ Créer les collections automatiquement via Django
3. ✅ Tester les opérations CRUD
4. ✅ Développer les API endpoints

**MongoDB est maintenant prêt pour Cyprus For Christ!** 🙏✨

---

## 📚 Ressources

- **MongoDB Documentation**: https://www.mongodb.com/docs/
- **MongoDB Shell**: https://www.mongodb.com/docs/mongodb-shell/
- **MongoEngine**: http://mongoengine.org/
- **MongoDB Compass** (GUI): https://www.mongodb.com/products/compass

---

**Créé pour Cyprus For Christ** 🇨🇾⛪✨
