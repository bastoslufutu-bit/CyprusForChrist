# 🗄️ GUIDE MYSQL - Cyprus For Christ

Guide complet pour installer et configurer MySQL sur Windows pour Cyprus For Christ.

---

## 1. Téléchargement et Installation

### Étape 1.1: Télécharger MySQL Installer

1. **Aller sur le site officiel**:
   - URL: https://dev.mysql.com/downloads/installer/
   - Télécharger le **MySQL Installer for Windows**.

### Étape 1.2: Installation

1. **Lancer l'installateur**.
2. Choisir **"Developer Default"** ou **"Server only"**.
3. Suivre les instructions pour configurer le serveur (port par défaut : 3306).
4. **IMPORTANT** : Définissez un mot de passe pour l'utilisateur `root` et notez-le.

---

## 2. Création de la Base de Données

1. Ouvrez le **MySQL Command Line Client** ou utilisez **MySQL Workbench**.
2. Connectez-vous avec votre mot de passe root.
3. Exécutez la commande suivante pour créer la base de données :

```sql
CREATE DATABASE cyprus_for_christ CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 3. Configuration de Django

### Étape 3.1: Installer les drivers (déjà fait si vous avez exécuté pip install)

Si vous avez des erreurs d'installation de `mysqlclient`, vous aurez peut-être besoin d'installer les [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

### Étape 3.2: Configurer le fichier .env

Ouvrez votre fichier `.env` et mettez à jour les variables suivantes :

```env
DB_NAME=cyprus_for_christ
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_root
DB_HOST=localhost
DB_PORT=3306
```

---

## 4. Initialisation de la Base de Données

Une fois MySQL configuré et la base de données créée :

1. Ouvrez votre terminal dans le dossier `backend`.
2. Exécutez les migrations Django pour créer les tables :

```bash
python manage.py migrate
```

---

## 5. Dépannage (Troubleshooting)

### Erreur: "mysqlclient" failing to install
Si l'installation de `mysqlclient` échoue sur Windows, vous pouvez essayer d'installer le connecteur officiel à la place (il est déjà dans les requirements) ou utiliser une version pré-compilée (wheel).

### Erreur: "Access denied for user 'root'@'localhost'"
Vérifiez que le mot de passe dans votre fichier `.env` correspond exactement au mot de passe que vous avez défini lors de l'installation de MySQL.

---

**Cyprus For Christ** 🙏✨
