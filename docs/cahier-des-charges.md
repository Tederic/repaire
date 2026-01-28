Cahier des charges — Plateforme de gestion des tables de JDR

1. Objectif du projet

Créer un site web permettant de :
- Centraliser la création et la gestion des tables de JDR (vendredi / samedi).
- Permettre aux MJ de déclarer leurs tables de manière autonome.
- Permettre aux joueurs de s’inscrire facilement.
- Donner à l’exploitant une vision claire de l’occupation, de la rentabilité et de la charge opérationnelle.

Finalité business :
- Remplir les tables.
- Réduire la charge de gestion manuelle.
- Structurer l’activité JDR comme un produit récurrent.

2. Périmètre fonctionnel (MVP obligatoire)

2.1 Rôles utilisateurs

Joueur
- Consulter les tables disponibles par date.
- Voir les détails d’une table.
- S’inscrire à une table (places limitées).
- Se désinscrire (si autorisé).

Maître de Jeu (MJ)
- Créer une table.
- Définir les paramètres de la table.
- Voir la liste des inscrits.
- Clôturer ou annuler une table.

Administrateur (Exploitant)
- Voir toutes les tables.
- Forcer l’ouverture / fermeture des inscriptions.
- Supprimer ou modifier une table.
- Accéder aux statistiques globales.

2.2 Gestion des tables de JDR

Champs obligatoires
- Date
- Créneau horaire (ex : 20h30 – 00h00)
- Jeu / univers
- Type de partie (initiation / campagne / one-shot)
- Nombre de places
- Niveau requis (optionnel)
- MJ responsable
- Description courte

Règles
- Pas de sur-inscription.
- Une table = un créneau précis.
- Tables visibles uniquement si validées par l’admin (option activable).

2.3 Inscription des joueurs

Inscription via :
- Compte utilisateur
- OU mode simplifié (email + pseudo) en MVP

Confirmation automatique.
Liste d’attente si table pleine (option).

2.4 Planning & affichage public

Vue calendrier par date (vendredi / samedi).
Vue liste des tables par soirée.

Code couleur :
- Places disponibles
- Table complète
- Table annulée

3. Fonctionnalités secondaires (non bloquantes mais prévues)

3.1 Paiement / entrée (phase 2)

Association d’une table à :
- Une entrée payante
- Une boisson incluse

Paiement en ligne optionnel.
Marquage “payé / sur place”.

À implémenter après validation du modèle économique.

3.2 Fidélisation

Historique des participations.
Badge MJ / Joueur régulier.
Statistiques :
- Taux de remplissage
- Tables par MJ
- No-show (plus tard).

3.3 Intégrations

Lien Discord (invite / pseudo).
Export CSV.
QR code vers la soirée.

4. Contraintes techniques

4.1 Architecture

Frontend :
- Responsive (mobile prioritaire).
- Accès public sans compte obligatoire (lecture).

Backend :
- API REST ou équivalent.
- Gestion des rôles.

Base de données :
- Tables, utilisateurs, inscriptions.

4.2 Sécurité

Protection contre :
- Double inscription.
- Spam.

RGPD :
- Données minimales.
- Suppression à la demande.

4.3 Hébergement

Compatible VPS Linux.
Déploiement simple.
Sauvegarde quotidienne.

5. UX / Expérience utilisateur

Joueurs
- En 2 clics : voir → s’inscrire.
- Pas de jargon technique.

MJ
- Création d’une table en moins de 2 minutes.
- Interface claire, orientée contenu.

Exploitant
- Vue synthétique par soirée :
  - Nombre de tables
  - Nombre de joueurs
  - Taux de remplissage
