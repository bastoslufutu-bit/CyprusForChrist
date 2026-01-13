# Comment Lancer le Projet Cyprus For Christ

Ce dossier contient les instructions pour démarrer le site web (Backend + Frontend).

Pour que le site fonctionne, vous devez ouvrir **deux terminaux** (fenêtres de commande) et lancer les commandes suivantes dans chacun d'eux.

## 1. Lancer le Backend (Serveur Django)
C'est le cerveau du site (base de données, admin).

1.  Ouvrez un terminal.
2.  Allez dans le dossier du backend :
    ```bash
    cd backend
    ```
3.  Activez l'environnement virtuel (si vous en utilisez un, sinon sautez cette étape) :
    ```bash
    env\Scripts\activate
    ```
4.  Lancez le serveur :
    ```bash
    python manage.py runserver
    ```
    > Vous devriez voir : "Starting development server at http://127.0.0.1:8000/"

## 2. Lancer le Frontend (Site React)
C'est ce que vous voyez à l'écran.

1.  Ouvrez un **deuxième** terminal.
2.  Allez dans le dossier du frontend :
    ```bash
    cd frontend
    ```
3.  Lancez le site :
    ```bash
    npm run dev
    ```
    > Vous devriez voir un lien comme : "Local: http://localhost:5173/"

---

## Liens Utiles
- **Site Web :** [http://localhost:5173](http://localhost:5173)
- **Administration (Backend) :** [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
