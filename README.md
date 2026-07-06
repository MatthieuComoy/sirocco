# Sirroco Marine Navigation ⛵

Sirroco Marine Navigation est une application web progressive (PWA) d'aide à la navigation pour les voiliers. Conçue pour fonctionner de manière autonome et hors-ligne, elle propose une cartographie marine interactive (OpenSeaMap), un suivi de trace précis, une alarme de mouillage de sécurité, et des prévisions météo et de marées locales.

L'application est accessible en ligne et installable en tant que PWA à l'adresse suivante : [https://sirroconavigation.netlify.app/](https://sirroconavigation.netlify.app/)

---

## 🌟 Fonctionnalités clés

* **Cartographie Leaflet & Tuiles Hors-ligne :** Couple les cartes OpenStreetMap et la couche marine OpenSeaMap. Intègre un module de téléchargement de cartes hors-ligne pour la PWA (Europe entière ou côtes de pays individuels) stockant les tuiles nautiques directement dans le Cache Storage du navigateur.
* **Alertes à la Navigation (S-124 SHOM) :** Récupère en temps réel et décode les avis de sécurité urgents (AVURNAV, AVURNAV locaux, AVINAV) du portail SHOM PING (standard S-124 XML) et NAVAREA II, affichés sous forme de tracés géométriques interactifs cliquables sur la carte.
* **Superposition Météo GRIB Interactive :** Affiche une carte de chaleur (heatmap) interpolée de la vitesse du vent et de la température, complétée par des barbules de vent dynamiques (wind barbs). Comprend une barre de temps interactive (timeline) animée avec fonctions lecture/pause.
* **Planification de Route & Routage :** Permet de rechercher des itinéraires maritimes de sécurité calculés à partir de points de passage (waypoints) prédéfinis.
* **Alarme de Mouillage de Sécurité :** Trace un cercle de sécurité autour de l'ancre. Si le bateau dérive au-delà du rayon défini, une sirène sonore modulée (Web Audio API) retentit. L'ancre peut être déplacée par glisser-déposer sur la carte.
* **Simulateur GPS Intégré :** Simule le cap, la vitesse et la dérive pour valider l'alarme ou tester l'application hors-mer.
* **Suivi de Traces & Historique :** Enregistre vos routes réelles, calcule les statistiques (vitesse max, moyenne, distance) et les allures (Près, Travers, Largue, etc.) avec export GPX.
* **Annuaire des Ports (En Ligne/Hors-Ligne) :** Recherche dynamique via OpenStreetMap Overpass doublée d'une base de données locale intégrée (`french_marinas.js`). Affiche les coordonnées, le VHF et signale si le tirant d'eau ou la longueur du bateau dépassent les capacités d'accueil.
* **Météo & Marée en Direct :** Fournit les prévisions de vent/température géolocalisées et trace le graphique SVG de hauteur d'eau de la marée locale calculé à partir de la position, de la phase lunaire et du coefficient. Le rapport météo reste verrouillé sur le bateau même pendant l'exploration de la carte.
* **Zones de Danger Militaires :** Détecte la proximité avec les polygones de tir militaire (Toulon, Levant, Brest, Lorient, etc.) et déclenche une alerte rouge.

---

## 📁 Organisation du Projet

Le projet a été restructuré pour séparer la logique applicative en modules ES6 autonomes sous le dossier `js/` afin de respecter les bonnes pratiques de lisibilité et de maintenance :

```text
Sirroco/
├── icons/                  # Favicons, icônes PWA et icônes d'application mobiles
├── js/                     # Modules JavaScript ES6
│   ├── app.js              # Point d'entrée, initialisation de Leaflet et liaisons d'événements
│   ├── state.js            # État centralisé réactif partagé de l'application
│   ├── utils.js            # Fonctions de calcul (Haversine, allures, modèle mathématique des marées)
│   ├── i18n.js             # Gestion du dictionnaire de traduction (24 langues de l'UE)
│   ├── dangerZones.js      # Base GeoJSON et avertissements de proximité des zones militaires
│   ├── anchorAlarm.js      # Logique de mouillage, dessine le cercle et génère la sirène audio
│   ├── gpsSimulator.js     # Boucle de simulation GPS et suivi de la géolocalisation réelle
│   ├── weatherTides.js     # Intégration météo et dessin SVG interactif de la courbe de marée
│   ├── harbors.js          # Requêtage Overpass, filtrage selon le tirant d'eau et popups des ports
│   ├── tracking.js         # Logging de route, statistiques d'allure et sérialisation GPX
│   ├── routing.js          # Moteur de recherche d'itinéraire et gestion des waypoints
│   ├── offlineMaps.js      # Gestionnaire de téléchargement et projection des tuiles de carte hors-ligne
│   ├── pingWarnings.js     # Décodage et tracé des alertes de navigation XML (S-124 SHOM & NGA)
│   └── french_marinas.js   # Base de données locale de secours pour les ports de plaisance français
├── browserconfig.xml       # Configuration de la tuile Windows
├── generate_icons.py       # Script Python pour générer l'ensemble des icônes du projet
├── index.html              # Structure HTML principale de l'application (SPA)
├── manifest.json           # Manifeste PWA pour l'installation sur mobile/ordinateur
├── robots.txt              # Configuration d'indexation SEO
├── sitemap.xml             # Sitemap SEO
├── style.css               # Design UI/UX complet (verre dépoli, thèmes sombre et clair, responsive)
└── sw.js                   # Service Worker gérant la mise en cache dynamique et le mode hors-ligne
```

---

## 🚀 Démarrer l'application en local

### Prérequis
Étant donné que l'application utilise des modules JavaScript ES6 natifs (`type="module"`) et un Service Worker pour le mode hors-ligne, elle nécessite d'être servie via un serveur HTTP pour éviter les blocages CORS liés au protocole `file://`.

### Lancer un serveur local rapide
Ouvrez votre terminal dans le dossier du projet et lancez l'une des commandes suivantes :

* **Avec Python (Recommandé) :**
  ```bash
  python3 -m http.server 8000
  ```
  Accédez ensuite à l'adresse : [http://localhost:8000](http://localhost:8000)

* **Avec PHP :**
  ```bash
  php -S localhost:8000
  ```

* **Avec Node.js (si installé) :**
  ```bash
  npx http-server -p 8000
  ```

---

## 🛠️ Maintenance & Script d'icônes

Le script Python `generate_icons.py` permet de regénérer l'ensemble des icônes de l'application (PWA, favicon, Apple Touch Icon) à partir de la bibliothèque Pillow.
Pour le lancer :
```bash
pip install Pillow
python3 generate_icons.py
```
Les icônes générées seront directement enregistrées dans le sous-dossier `icons/`.
