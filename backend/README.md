# Cyprus For Christ - Backend API

Plateforme spirituelle digitale avec Django REST Framework, MySQL, et Intelligence Artificielle biblique.

## 🎯 Objectif

Backend API moderne pour église Cyprus For Christ, incluant:
- 🔐 Authentification JWT + 2FA
- 📖 Gestion sermons (PDF + YouTube)
- 🙏 Requêtes de prière confidentielles
- 🤖 Assistant IA biblique (OpenAI + Louis Segond)
- 💰 Dons PayPal avec reçus automatiques
- 📱 Contact WhatsApp
- 📊 Dashboard pasteur/admin

## 🛠️ Technologies

- **Framework:** Django 5.0 + Django REST Framework
- **Base de données:** MySQL
- **Authentication:** JWT + django-otp (2FA)
- **IA:** OpenAI GPT-3.5-turbo
- **Paiements:** PayPal REST SDK
- **PDF:** ReportLab (reçus)

## 📁 Structure du Projet

```
backend/
├── cyprus_api/          # Projet Django principal
│   ├── settings.py      # Configuration
│   ├── urls.py          # Routes principales
│   └── wsgi.py          # WSGI server
│
├── users/               # Authentification & utilisateurs
│   ├── models.py        # User, Profile
│   ├── serializers.py   # API serializers
│   ├── views.py         # Login, Register, 2FA
│   └── permissions.py   # Role-based permissions
│
├── sermons/             # Gestion des sermons
│   ├── models.py        # Sermon, SermonComment
│   ├── views.py         # CRUD sermons
│   └── utils.py         # Upload PDF, YouTube
│
├── prayers/             # Requêtes de prière
│   ├── models.py        # PrayerRequest (encrypted)
│   └── views.py         # Submission, Pastor access
│
├── rhema/               # Rhéma quotidien
│   ├── models.py        # RhemaDaily
│   └── views.py         # Daily verse + meditation
│
├── ai_assistant/        # Assistant IA biblique
│   ├── models.py        # AIConversation, BibleVerse
│   ├── services/        # OpenAI integration
│   │   └── openai_service.py
│   └── management/      # Commands
│       └── commands/
│           └── load_bible.py
│
├── donations/           # Dons PayPal
│   ├── models.py        # Donation
│   ├── services/        # PayPal & Receipt services
│   └── views.py         # Payment flow
│
├── contact/             # Contact WhatsApp
│   └── views.py         # WhatsApp links
│
├── dashboard/           # Dashboard stats
│   ├── views.py         # Statistics API
│   └── services/        # Analytics
│
├── media/               # Uploads
│   ├── sermons/         # PDFs sermons
│   └── receipts/        # Reçus donations
│
├── requirements.txt     # Dépendances Python
├── .env.example         # Template variables
└── manage.py            # Django CLI
```

## 🚀 Installation

### 1. Prérequis

- Python 3.11+
- MySQL 8.0+ (installé et lancé)
- pip

### 2. Installation

```bash
# Cloner le projet
cd Cyprusforchrist/backend

# Créer environnement virtuel
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Installer dépendances
pip install -r requirements.txt

# Configuration
copy .env.example .env
# Éditez .env avec vos valeurs
```

### 3. Configuration MySQL

Voir [`MYSQL_SETUP.md`](MYSQL_SETUP.md) pour les instructions détaillées.

```bash
# Démarrer MySQL (Windows)
net start MySQL

# Créer la base de données
mysql -u root -p
> CREATE DATABASE cyprus_for_christ;
> exit
```

### 4. Configuration Django

```bash
# Migrations
python manage.py makemigrations
python manage.py migrate

# Créer superuser (Admin)
python manage.py createsuperuser

# Charger la Bible Louis Segond
python manage.py load_bible

# Lancer serveur
python manage.py runserver
```

API disponible sur: `http://localhost:8000/api/`

## 🔑 Configuration OpenAI

1. Créer compte sur https://platform.openai.com/
2. Obtenir API key (5$ gratuits au démarrage)
3. Ajouter dans `.env`: `OPENAI_API_KEY=sk-...`

## 💳 Configuration PayPal

1. Créer compte Developer: https://developer.paypal.com/
2. Mode Sandbox (test): 
   - Créer app sandbox
   - Copier Client ID + Secret
3. Mode Live (production):
   - Passer en mode live dans `.env`
   - Utiliser vraies credentials

## 📱 Configuration WhatsApp

Dans `.env`:
```
WHATSAPP_NUMBER=+357XXXXXXXX
```

Format du lien généré:
```
https://wa.me/357XXXXXXXX?text=Message personnalisé
```

## 🔐 Rôles & Permissions

| Rôle | Droits |
|------|--------|
| **VISITOR** | Voir sermons, IA, contact (non connecté) |
| **MEMBER** | + Commenter, requêtes prière, profil |
| **MODERATOR** | + Modérer commentaires, gérer contenu |
| **PASTOR** | + Gérer sermons, voir prières, stats |
| **ADMIN** | Accès total système |

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/verify-2fa/` - Vérification 2FA
- `POST /api/auth/enable-2fa/` - Activer 2FA
- `GET /api/auth/profile/` - Profil

### Sermons
- `GET /api/sermons/` - Liste (public)
- `POST /api/sermons/` - Créer (PASTOR+)
- `GET /api/sermons/{id}/` - Détail
- `POST /api/sermons/{id}/comments/` - Commenter (MEMBER+)

### Prayer Requests
- `POST /api/prayers/` - Soumettre (MEMBER+)
- `GET /api/prayers/` - Liste (PASTOR seulement)

### Rhéma Quotidien
- `GET /api/rhema/today/` - Rhéma du jour (public)
- `POST /api/rhema/` - Créer (PASTOR)

### AI Assistant
- `POST /api/ai/chat/` - Discussion IA (public)
- `POST /api/ai/search-bible/` - Recherche biblique

### Donations
- `POST /api/donations/create/` - Créer paiement
- `POST /api/donations/execute/` - Finaliser
- `GET /api/donations/{id}/receipt/` - Reçu PDF

### Dashboard
- `GET /api/dashboard/stats/` - Statistiques (PASTOR+)

## 🧪 Tests

```bash
# Tous les tests
python manage.py test

# Tests spécifiques
python manage.py test users
python manage.py test sermons
python manage.py test ai_assistant

# Avec coverage
coverage run --source='.' manage.py test
coverage report
```

## 📖 Documentation API

Une fois le serveur lancé, documentation interactive disponible:
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

## 🌍 Langues

L'API supporte le français et l'anglais:
- Header: `Accept-Language: fr` ou `en`
- Par défaut: français

## 🚀 Déploiement

Voir le guide de déploiement pour:
- Heroku
- DigitalOcean
- AWS EC2
- MySQL

## 📧 Support

Contact: contact@cyprusforchrist.org

---

**Cyprus For Christ** - Plateforme spirituelle moderne 🙏✨
