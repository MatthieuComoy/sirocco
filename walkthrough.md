# Walkthrough - Refactorisation Modulaire et Nettoyage de Sirroco Marine

Nous avons divisé le fichier monolithique `app.js` en plusieurs modules JavaScript ES6 réutilisables sous `js/`, nettoyé le répertoire racine en organisant les icônes, et créé la documentation du projet.

## Modifications apportées

### 1. Organisation des fichiers JavaScript
La logique applicative a été répartie dans les modules autonomes suivants dans le sous-dossier `js/` :
- [state.js](file:///var/home/matthieu/Documents/Sirroco/js/state.js) : État global réactif partagé.
- [utils.js](file:///var/home/matthieu/Documents/Sirroco/js/utils.js) : Calculs géographiques (Haversine, allures, modèle mathématique des marées).
- [i18n.js](file:///var/home/matthieu/Documents/Sirroco/js/i18n.js) : Dictionnaires de traduction et fonction de localisation.
- [dangerZones.js](file:///var/home/matthieu/Documents/Sirroco/js/dangerZones.js) : Polygones GeoJSON et alertes de zones militaires.
- [anchorAlarm.js](file:///var/home/matthieu/Documents/Sirroco/js/anchorAlarm.js) : Alarme de mouillage, tracé carte et sirène sonore.
- [gpsSimulator.js](file:///var/home/matthieu/Documents/Sirroco/js/gpsSimulator.js) : Boucle de simulation GPS et suivi de position réel.
- [weatherTides.js](file:///var/home/matthieu/Documents/Sirroco/js/weatherTides.js) : Données météo Open-Meteo, calculs et tracé SVG de la courbe de marée.
- [harbors.js](file:///var/home/matthieu/Documents/Sirroco/js/harbors.js) : Annuaire des ports de plaisance via OSM Overpass API.
- [tracking.js](file:///var/home/matthieu/Documents/Sirroco/js/tracking.js) : Logging de route, statistiques d'allures et export GPX.
- [app.js](file:///var/home/matthieu/Documents/Sirroco/js/app.js) : Point d'entrée de l'application, initialisation Leaflet et liaisons d'événements.

### 2. Organisation & Nettoyage des icônes
Tous les fichiers d'icônes et favicons ont été regroupés dans un nouveau sous-dossier `icons/` :
- `apple-touch-icon.png`
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `icon-192.png`
- `icon-512.png`
- `mstile-150x150.png`
- `safari-pinned-tab.svg`

Les chemins de référence ont été mis à jour dans :
- [index.html](file:///var/home/matthieu/Documents/Sirroco/index.html)
- [manifest.json](file:///var/home/matthieu/Documents/Sirroco/manifest.json)
- [browserconfig.xml](file:///var/home/matthieu/Documents/Sirroco/browserconfig.xml)
- [sw.js](file:///var/home/matthieu/Documents/Sirroco/sw.js)
- [generate_icons.py](file:///var/home/matthieu/Documents/Sirroco/generate_icons.py) (mis à jour pour générer les icônes directement dans `icons/`)

### 3. Documentation du projet
- Un fichier [README.md](file:///var/home/matthieu/Documents/Sirroco/README.md) détaillé a été créé à la racine. Il décrit le projet, son architecture modulaire et explique comment lancer l'application localement.

## Validation des changements

### Éléments à tester lors de l'exécution :
1. **Initialisation de la carte** : La carte Leaflet se charge correctement et se centre sur Toulon au chargement.
2. **Affichage des icônes** : Les favicons s'affichent correctement dans l'onglet du navigateur et les métadonnées Twitter/Facebook pointent vers les nouveaux chemins.
3. **Simulateur GPS** : Activer le simulateur et tester la simulation de dérive pour s'assurer que le signal audio fonctionne toujours.
4. **Météo, Marées & Ports** : Vérifier que les requêtes API météo et Overpass s'exécutent sans erreur et peuplent l'interface.
5. **Mode hors-ligne (Service Worker)** : Tester en mode déconnecté (onglet Application > Service Workers > Offline dans Chrome/Firefox DevTools). L'application doit continuer à se charger grâce aux fichiers mis en cache.
