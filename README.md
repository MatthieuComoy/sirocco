# Sirroco Marine Navigation ⛵

Sirroco Marine Navigation est une application web progressive (PWA) d'aide à la navigation pour les voiliers. Conçue pour fonctionner de manière autonome et hors-ligne, elle propose une cartographie marine interactive (OpenSeaMap), un suivi de trace précis, une alarme de mouillage de sécurité, et des prévisions météo et de marées locales.

---

## 🌟 Fonctionnalités clés

* **Cartographie Leaflet & Calques :** Intègre la carte OpenStreetMap couplée à la couche nautique OpenSeaMap pour afficher les balises, feux et indications marines.
* **Alarme de Mouillage de Sécurité :** Trace un cercle de sécurité autour de l'ancre. Si le bateau dérive au-delà du rayon défini, une sirène sonore modulée (générée via la Web Audio API) se déclenche. L'ancre peut être repositionnée par simple glisser-déposer sur la carte.
* **Simulateur GPS Intégré :** Permet de simuler le cap et la vitesse pour tester l'application ou naviguer sans signal GPS réel. Inclut une commande rapide pour simuler une dérive afin de tester l'alarme.
* **Suivi de Traces & Historique :** Enregistre vos routes en temps réel, calcule la distance parcourue, la vitesse moyenne, la vitesse maximale et la distance maximale d'un abri. Affiche un graphique récapitulatif du temps passé à chaque allure (Près, Travers, Largue, etc.) et permet l'exportation des traces au format GPX.
* **Annuaire Dynamique des Ports :** Recherche et liste les ports de plaisance de la zone affichée via l'API OpenStreetMap Overpass. Indique les coordonnées de la capitainerie (téléphone, canal VHF, e-mail), le nombre de places et signale par une alerte visuelle si le tirant d'eau ou la longueur du bateau dépassent les limites du port.
* **Météo & Marée en Direct :** Récupère les données météo de vent, température et vagues en direct depuis Open-Meteo avec géocodage inversé de la position. Un algorithme propriétaire calcule la courbe de marée locale sous forme de graphique SVG interactif (basé sur la position, la phase de la lune et le coefficient).
* **Zones de Danger Militaires :** Intègre les polygones des zones d'exercice de tir (Toulon, Levant, Brest, Lorient, etc.) et des couloirs de navigation avec alerte de proximité immédiate.

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
│   └── tracking.js         # Logging de route, statistiques d'allure et sérialisation GPX
├── browserconfig.xml       # Configuration de la tuile Windows
├── generate_icons.py       # Script Python pour générer l'ensemble des icônes du projet
├── index.html              # Structure HTML principale de l'application (SPA)
├── manifest.json           # Manifeste PWA pour l'installation sur mobile/ordinateur
├── robots.txt              # Configuration d'indexation SEO
├── sitemap.xml             # Sitemap SEO
├── style.css               # Design UI/UX complet (verre dépoli, thèmes sombre et clair)
└── sw.js                   # Service Worker pour le support du mode hors-ligne
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
