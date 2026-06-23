# MBK Transit - Système de gestion de transit

Application Next.js pour la gestion des expéditions, clients, fournisseurs et finances de MBK Transit.

## Technologies utilisées
- **Framework** : Next.js 16 (App Router)
- **ORM** : Prisma
- **Base de données** : PostgreSQL (Supabase)
- **UI** : React 19 + Radix UI

---

## ⚠️ Informations importantes (ne pas commit ceci dans un repo public)

**Mot de passe Supabase** : `transit_mbk@123`

---

## Configuration locale

1. **Installer les dépendances** :
```bash
npm install
```

2. **Configurer les variables d'environnement** :
   - Copiez `.env.example` vers `.env`
   - Remplissez les valeurs avec vos credentials Supabase (voir ci-dessous)

3. **Générer le client Prisma** :
```bash
npx prisma generate
```

4. **Appliquer les migrations** :
```bash
npx prisma migrate deploy
```

5. **Lancer le serveur de développement** :
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## Configuration Supabase

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `mbk-transit`
3. Allez dans **Project Settings → Database**
4. Copiez les **Connection string** :
   - **URI** → `DATABASE_URL` (ajoutez `?pgbouncer=true&connection_limit=1` à la fin)
   - **Session mode** → `DIRECT_URL`

Exemple de `.env` :
```env
DATABASE_URL="postgresql://postgres:transit_mbk%40123@db.votre-projet.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:transit_mbk%40123@db.votre-projet.supabase.co:5432/postgres"
JWT_SECRET="votre-secret-jwt-tres-long"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

⚠️ **Important** : Dans les URL, remplacez `@` par `%40` dans le mot de passe !

---

## Déploiement sur Vercel

1. Poussez votre code sur GitHub/GitLab
2. Allez sur [Vercel](https://vercel.com/) et importez votre repo
3. Ajoutez les **Environment Variables** dans les paramètres du projet Vercel :
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
4. Cliquez sur **Deploy**

---

## Commandes utiles

```bash
# Générer le client Prisma
npx prisma generate

# Créer une nouvelle migration
npx prisma migrate dev --name nom-de-la-migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface graphique pour la DB)
npx prisma studio
```
