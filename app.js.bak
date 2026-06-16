// Sirroco Marine Navigation Core Logic

// 1. i18n Translation Dictionary (24 Official EU Languages)
const translations = {
  en: {
    title: "Sirroco Marine",
    lat: "Latitude",
    lon: "Longitude",
    speed: "Speed (kts)",
    cog: "Course (°)",
    track_status: "Route Logging",
    start_track: "Start Track",
    stop_track: "Stop Track",
    anchor_status: "Anchor Alarm",
    radius: "Radius (NM)",
    drift_dist: "Drift Distance (NM)",
    active: "Active",
    inactive: "Inactive",
    map_view: "Map",
    routes_view: "Tracks",
    weather_view: "Weather & Tides",
    danger_view: "Danger Zones",
    settings_view: "Settings",
    theme_lbl: "Theme",
    lang_lbl: "Language",
    siren_test: "Test Siren",
    alarm_alert: "ANCHOR ALARM!",
    alarm_msg: "Your boat has drifted past the safety radius!",
    dismiss: "Dismiss",
    simulator_lbl: "GPS Simulator",
    sim_active: "Simulation Active",
    sim_inactive: "Use Real GPS",
    danger_zone_name: "Toulon Exercise Zone (G1)",
    danger_zone_desc: "Military firing zone. Check local maritime authorities for exercise schedule.",
    clear_tracks: "Clear History",
    no_tracks: "No saved tracks.",
    tide_lbl: "Tide Forecast (Toulon)",
    weather_wind: "Wind",
    weather_waves: "Waves",
    weather_baro: "Barometer",
    weather_desc: "GRIB weather interface placeholder. Future capability for sailor route planning.",
    clear_alarm_track: "Stop Alarm & Track",
    ping_title: "SHOM PING Portal",
    ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform.",
    avg_speed: "Avg Speed",
    max_speed: "Max Speed",
    max_shelter_dist: "Max Shelter"
  },
  fr: {
    title: "Sirroco Marine",
    lat: "Latitude",
    lon: "Longitude",
    speed: "Vitesse (noeuds)",
    cog: "Cap (°)",
    track_status: "Suivi du trajet",
    start_track: "Démarrer trace",
    stop_track: "Arrêter trace",
    anchor_status: "Alerte Ancrage",
    radius: "Rayon (NM)",
    drift_dist: "Distance de dérive (NM)",
    active: "Actif",
    inactive: "Inactif",
    map_view: "Carte",
    routes_view: "Traces",
    weather_view: "Météo & Marée",
    danger_view: "Zones Danger",
    settings_view: "Réglages",
    theme_lbl: "Thème",
    lang_lbl: "Langue",
    siren_test: "Tester sirène",
    alarm_alert: "ALARME ANCRAGE !",
    alarm_msg: "Le bateau a dépassé le rayon de sécurité de l'ancre !",
    dismiss: "Acquitter",
    simulator_lbl: "Simulateur GPS",
    sim_active: "Simulation active",
    sim_inactive: "Utiliser GPS Réel",
    danger_zone_name: "Zone de tir de Toulon (G1)",
    danger_zone_desc: "Zone d'exercice militaire française. Entrée réglementée en cas de tir.",
    clear_tracks: "Effacer l'historique",
    no_tracks: "Aucun trajet enregistré.",
    tide_lbl: "Prédiction Marée (Toulon)",
    weather_wind: "Vent",
    weather_waves: "Vagues",
    weather_baro: "Baromètre",
    weather_desc: "Interface GRIB météo planifiée. Permettra d'optimiser vos plans de navigation.",
    clear_alarm_track: "Arrêter Alarme & Trace",
    ping_title: "Portail PING (SHOM)",
    ping_desc: "Consultez en direct les Avis Urgents aux Navigateurs (AVURNAV) et zones réglementées officielles du SHOM sur la plateforme PING.",
    avg_speed: "Vit. Moyenne",
    max_speed: "Vit. Max",
    max_shelter_dist: "Max Abri"
  },
  es: {
    title: "Sirroco Marine",
    lat: "Latitud",
    lon: "Longitud",
    speed: "Velocidad (nudos)",
    cog: "Rumbo (°)",
    track_status: "Seguimiento",
    start_track: "Iniciar ruta",
    stop_track: "Parar ruta",
    anchor_status: "Alarma de Ancla",
    radius: "Radio (NM)",
    drift_dist: "Distancia de deriva (NM)",
    active: "Activa",
    inactive: "Inactiva",
    map_view: "Mapa",
    routes_view: "Rutas",
    weather_view: "Meteorología",
    danger_view: "Zonas Peligro",
    settings_view: "Ajustes",
    theme_lbl: "Tema",
    lang_lbl: "Idioma",
    siren_test: "Probar sirena",
    alarm_alert: "¡ALARMA DE ANCLA!",
    alarm_msg: "El barco ha derivado fuera del radio de seguridad.",
    dismiss: "Desactivar",
    simulator_lbl: "Simulador GPS",
    sim_active: "Simulación activa",
    sim_inactive: "Usar GPS Real",
    danger_zone_name: "Zona de Ejercicio Toulón (G1)",
    danger_zone_desc: "Zona militar de tiro. Verifique avisos a los navegantes.",
    clear_tracks: "Borrar historial",
    no_tracks: "No hay rutas guardadas.",
    tide_lbl: "Predicción de Mareas (Toulon)",
    weather_wind: "Viento",
    weather_waves: "Olas",
    weather_baro: "Barómetro",
    weather_desc: "Módulo meteorológico futuro para planificación de rutas en vela.",
    clear_alarm_track: "Detener Alarma y Ruta",
    ping_title: "Portal PING (SHOM)",
    ping_desc: "Acceda a avisos a los navegantes (AVURNAVs) y zonas reguladas en la plataforma oficial PING del SHOM.",
    avg_speed: "Vel. Media",
    max_speed: "Vel. Máx",
    max_shelter_dist: "Dist. Máx. Abrigo"
  },
  de: {
    title: "Sirroco Marine",
    lat: "Breitengrad",
    lon: "Längengrad",
    speed: "Tempo (kn)",
    cog: "Kurs Over Ground (°)",
    track_status: "Routenaufzeichnung",
    start_track: "Track starten",
    stop_track: "Track stoppen",
    anchor_status: "Ankerwache",
    radius: "Radius (NM)",
    drift_dist: "Abdrift-Entfernung (NM)",
    active: "Aktiv",
    inactive: "Inaktiv",
    map_view: "Karte",
    routes_view: "Routen",
    weather_view: "Wetter & Gezeiten",
    danger_view: "Gefahrenzonen",
    settings_view: "Einstellungen",
    theme_lbl: "Thema",
    lang_lbl: "Sprache",
    siren_test: "Sirenentest",
    alarm_alert: "ANKER-ALARM!",
    alarm_msg: "Das Boot driftet außerhalb des Sicherheitsradius!",
    dismiss: "Quittieren",
    simulator_lbl: "GPS Simulator",
    sim_active: "Simulation aktiv",
    sim_inactive: "Echtes GPS nutzen",
    danger_zone_name: "Schießgebiet Toulon (G1)",
    danger_zone_desc: "Militärisches Sperrgebiet. Zugang während Übungen eingeschränkt.",
    clear_tracks: "Verlauf löschen",
    no_tracks: "Keine gespeicherten Tracks.",
    tide_lbl: "Gezeiten Toulon",
    weather_wind: "Wind",
    weather_waves: "Wellen",
    weather_baro: "Barometer",
    weather_desc: "Zukünftiges GRIB-Wettermodul zur Segelroutenplanung.",
    clear_alarm_track: "Alarm & Track stoppen",
    ping_title: "SHOM PING Portal",
    ping_desc: "Greifen Sie auf aktive Warnungen (AVURNAVs) und Regelungszonen direkt auf der offiziellen PING-Plattform des SHOM zu."
  },
  it: {
    title: "Sirroco Marine",
    lat: "Latitudine",
    lon: "Longitudine",
    speed: "Velocità (nodi)",
    cog: "Rotta (°)",
    track_status: "Tracciamento rotta",
    start_track: "Avvia traccia",
    stop_track: "Ferma traccia",
    anchor_status: "Allarme Ancora",
    radius: "Raggio (NM)",
    drift_dist: "Distanza deriva (NM)",
    active: "Attivo",
    inactive: "Inattivo",
    map_view: "Mappa",
    routes_view: "Rotte",
    weather_view: "Meteo & Maree",
    danger_view: "Zone Pericolo",
    settings_view: "Impostazioni",
    theme_lbl: "Tema",
    lang_lbl: "Lingua",
    siren_test: "Prova sirena",
    alarm_alert: "ALLARME ANCORA!",
    alarm_msg: "La barca ha superato il raggio di sicurezza dell'ancora!",
    dismiss: "Disattiva",
    simulator_lbl: "Simulatore GPS",
    sim_active: "Simulatore attivo",
    sim_inactive: "Usa GPS Reale",
    danger_zone_name: "Zona Militare Tolone (G1)",
    danger_zone_desc: "Zona esercitazione Marina Militare. Transito regolamentato.",
    clear_tracks: "Cancella cronologia",
    no_tracks: "Nessuna rotta salvata.",
    tide_lbl: "Marea (Tolone)",
    weather_wind: "Vento",
    weather_waves: "Onde",
    weather_baro: "Barometro",
    weather_desc: "Futuro modulo meteo GRIB per la pianificazione di viaggi a vela.",
    clear_alarm_track: "Ferma Allarme & Traccia",
    ping_title: "Portale PING (SHOM)",
    ping_desc: "Accedi agli avvisi urgenti ai naviganti (AVURNAV) e alle zone regolamentate direttamente sulla piattaforma ufficiale PING del SHOM."
  },
  nl: {
    title: "Sirroco Marine",
    lat: "Breedtegraad",
    lon: "Lengtegraad",
    speed: "Snelheid (kn)",
    cog: "Koers (°)",
    track_status: "Routelogging",
    start_track: "Start tracking",
    stop_track: "Stop tracking",
    anchor_status: "Ankerwacht",
    radius: "Radius (NM)",
    drift_dist: "Driftafstand (NM)",
    active: "Actief",
    inactive: "Inactief",
    map_view: "Kaart",
    routes_view: "Routes",
    weather_view: "Weer & Getijden",
    danger_view: "Gevarenzones",
    settings_view: "Instellingen",
    theme_lbl: "Thema",
    lang_lbl: "Taal",
    siren_test: "Test sirene",
    alarm_alert: "ANKERALARM!",
    alarm_msg: "De boot is buiten de veiligheidsstraal gedreven!",
    dismiss: "Sluiten",
    simulator_lbl: "GPS Simulator",
    sim_active: "Simulatie actief",
    sim_inactive: "Gebruik Echte GPS",
    danger_zone_name: "Toulon Oefengebied (G1)",
    danger_zone_desc: "Militair schietgebied. Toegang beperkt tijdens oefeningen.",
    clear_tracks: "Geschiedenis wissen",
    no_tracks: "Geen opgeslagen routes.",
    tide_lbl: "Getijden Toulon",
    weather_wind: "Wind",
    weather_waves: "Golven",
    weather_baro: "Barometer",
    weather_desc: "Toekomstige GRIB-weermodule voor het plannen van zeilreizen.",
    clear_alarm_track: "Stop Alarm & Track",
    ping_title: "SHOM PING Portaal",
    ping_desc: "Toegang tot actieve waarschuwingen (AVURNAVs) en gereguleerde zones direct op het officiële PING-platform van SHOM."
  },
  pt: {
    title: "Sirroco Marine",
    lat: "Latitude",
    lon: "Longitude",
    speed: "Velocidade (nós)",
    cog: "Rumo (°)",
    track_status: "Registo de rota",
    start_track: "Iniciar rota",
    stop_track: "Parar rota",
    anchor_status: "Alarme de Âncora",
    radius: "Raio (NM)",
    drift_dist: "Distância de deriva (NM)",
    active: "Ativo",
    inactive: "Inativo",
    map_view: "Mapa",
    routes_view: "Rotas",
    weather_view: "Meteo & Marés",
    danger_view: "Zonas de Perigo",
    settings_view: "Definições",
    theme_lbl: "Tema",
    lang_lbl: "Idioma",
    siren_test: "Testar sirene",
    alarm_alert: "ALARME DE ÂNCORA!",
    alarm_msg: "O barco derivou além do raio de segurança!",
    dismiss: "Silenciar",
    simulator_lbl: "Simulador GPS",
    sim_active: "Simulador Ativo",
    sim_inactive: "Usar GPS Real",
    danger_zone_name: "Zona de Exercícios Toulon (G1)",
    danger_zone_desc: "Zona de tiro militar. Entrada restrita durante exercícios.",
    clear_tracks: "Limpar histórico",
    no_tracks: "Nenhuma rota guardada.",
    tide_lbl: "Previsão de Marés (Toulon)",
    weather_wind: "Vento",
    weather_waves: "Ondas",
    weather_baro: "Barómetro",
    weather_desc: "Interface meteorológica GRIB planeada para planeamento de vela.",
    clear_alarm_track: "Parar Alarme e Rota",
    ping_title: "Portal PING (SHOM)",
    ping_desc: "Aceda a avisos aos navegantes (AVURNAVs) e zonas reguladas na plataforma oficial PING do SHOM."
  },
  bg: { title: "Sirroco Marine", lat: "Ширина", lon: "Дължина", speed: "Скорост (kn)", cog: "Курс", track_status: "Проследяване", start_track: "Старт трасе", stop_track: "Стоп трасе", anchor_status: "Котвена аларма", radius: "Радиус (NM)", drift_dist: "Отклонение (NM)", active: "Активно", inactive: "Неактивно", map_view: "Карта", routes_view: "Маршрути", weather_view: "Време/Приливи", danger_view: "Опасни зони", settings_view: "Настройки", theme_lbl: "Тема", lang_lbl: "Език", siren_test: "Тест сирена", alarm_alert: "КОТВЕНА АЛАРМА!", alarm_msg: "Лодката излезе извън радиуса на сигурност!", dismiss: "Спри", simulator_lbl: "GPS Симулатор", sim_active: "Симулация", sim_inactive: "Реално GPS", danger_zone_name: "Военна зона Тулон (G1)", danger_zone_desc: "Военно стрелбище. Влизането ограничено при учения.", clear_tracks: "Изчисти", no_tracks: "Няма записи.", tide_lbl: "Прилив Тулон", weather_wind: "Вятър", weather_waves: "Вълни", weather_baro: "Барометър", weather_desc: "GRIB модул за прогноза.", clear_alarm_track: "Спри Аларма & Трасе", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  hr: { title: "Sirroco Marine", lat: "Širina", lon: "Dužina", speed: "Brzina (čv)", cog: "Kurs", track_status: "Bilježenje", start_track: "Započni tragu", stop_track: "Zaustavi tragu", anchor_status: "Sidreni alarm", radius: "Polumjer (NM)", drift_dist: "Udaljenost (NM)", active: "Aktivno", inactive: "Neaktivno", map_view: "Karta", routes_view: "Tragovi", weather_view: "Vrijeme/Mijene", danger_view: "Opasne zone", settings_view: "Postavke", theme_lbl: "Tema", lang_lbl: "Jezik", siren_test: "Test sirene", alarm_alert: "SIDRENI ALARM!", alarm_msg: "Brod je skrenuo s dopuštenog polumjera!", dismiss: "Utišaj", simulator_lbl: "GPS Simulator", sim_active: "Simulacija aktivna", sim_inactive: "Stvarni GPS", danger_zone_name: "Vojna zona Toulon (G1)", danger_zone_desc: "Vojno vježbalište. Zabranjena zona.", clear_tracks: "Očisti povijest", no_tracks: "Nema spremljenih tragova.", tide_lbl: "Mijene Toulon", weather_wind: "Vjetar", weather_waves: "Valovi", weather_baro: "Barometar", weather_desc: "Budući meteo modul.", clear_alarm_track: "Zaustavi Alarm & Tragu", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  cs: { title: "Sirroco Marine", lat: "Šířka", lon: "Délka", speed: "Rychlost (uz)", cog: "Kurz", track_status: "Záznam trasy", start_track: "Spustit trasu", stop_track: "Zastavit trasu", anchor_status: "Kotevní hlídka", radius: "Poloměr (NM)", drift_dist: "Odchylka (NM)", active: "Aktivní", inactive: "Neaktivní", map_view: "Mapa", routes_view: "Trasy", weather_view: "Počasí & Slap", danger_view: "Nebezpečné zóny", settings_view: "Nastavení", theme_lbl: "Motiv", lang_lbl: "Jazyk", siren_test: "Test sirény", alarm_alert: "ALARMY KOTVY!", alarm_msg: "Loď splula mimo bezpečnostní poloměr!", dismiss: "Vypnout", simulator_lbl: "GPS Simulátor", sim_active: "Simulace aktivní", sim_inactive: "Použít Reálné GPS", danger_zone_name: "Cvična zóna Toulon (G1)", danger_zone_desc: "Vojenský prostor se střelbou.", clear_tracks: "Smazat historii", no_tracks: "Žádné uložené trasy.", tide_lbl: "Příliv Toulon", weather_wind: "Vítr", weather_waves: "Vlny", weather_baro: "Tlakoměr", weather_desc: "Budoucí GRIB počasí.", clear_alarm_track: "Zastavit Alarm a Trasu", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  da: { title: "Sirroco Marine", lat: "Breddegrad", lon: "Længdegrad", speed: "Fart (kn)", cog: "Kurs Over Grund", track_status: "Rutesporing", start_track: "Start spor", stop_track: "Stop spor", anchor_status: "Ankervagt", radius: "Radius (NM)", drift_dist: "Afdrift (NM)", active: "Aktiv", inactive: "Inaktiv", map_view: "Kort", routes_view: "Spor", weather_view: "Vejr & Tidevand", danger_view: "Farezoner", settings_view: "Indstillinger", theme_lbl: "Tema", lang_lbl: "Sprog", siren_test: "Test sirene", alarm_alert: "ANKERALARM!", alarm_msg: "Båden er drevet uden for sikkerhedsradius!", dismiss: "Afvis", simulator_lbl: "GPS Simulator", sim_active: "Simulering aktiv", sim_inactive: "Brug Real GPS", danger_zone_name: "Toulon Skydeterræn (G1)", danger_zone_desc: "Militært øvelsesområde.", clear_tracks: "Ryd historik", no_tracks: "Ingen gemte ruter.", tide_lbl: "Tidevand Toulon", weather_wind: "Vind", weather_waves: "Bølger", weather_baro: "Barometer", weather_desc: "Kommende vejr-interface.", clear_alarm_track: "Stop Alarm & Rute", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  et: { title: "Sirroco Marine", lat: "Laiuskraad", lon: "Pikkuskraad", speed: "Kiirus (kn)", cog: "Kurss", track_status: "Teekonna salvestus", start_track: "Alusta jälge", stop_track: "Peata jälg", anchor_status: "Ankruvalvur", radius: "Raadius (NM)", drift_dist: "Hälve (NM)", active: "Aktiivne", inactive: "Mitteaktiivne", map_view: "Kaart", routes_view: "Jäljed", weather_view: "Ilm/Tõusud", danger_view: "Ohualad", settings_view: "Seaded", theme_lbl: "Teema", lang_lbl: "Keel", siren_test: "Testi sireeni", alarm_alert: "ANKRUALARM!", alarm_msg: "Laev on triivinut ohutusraadiusest välja!", dismiss: "Vaigista", simulator_lbl: "GPS Simulaator", sim_active: "Simulatsioon aktiivne", sim_inactive: "Kasuta päris GPS", danger_zone_name: "Touloni laskeala (G1)", danger_zone_desc: "Sõjaväe harjutusala.", clear_tracks: "Kustuta ajalugu", no_tracks: "Salvestatud jäljed puuduvad.", tide_lbl: "Tõus Toulon", weather_wind: "Tuul", weather_waves: "Lained", weather_baro: "Baromeeter", weather_desc: "Tulevikumuusika veebiliides.", clear_alarm_track: "Peata Alarm & Jälg", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  fi: { title: "Sirroco Marine", lat: "Leveyspiiri", lon: "Pituuspiiri", speed: "Nopeus (kn)", cog: "Suunta Over Ground", track_status: "Reitin tallennus", start_track: "Aloita jälki", stop_track: "Lopeta jälki", anchor_status: "Ankkurivahti", radius: "Säde (NM)", drift_dist: "Ajelehtimen (NM)", active: "Aktiivinen", inactive: "Poissa", map_view: "Kartta", routes_view: "Jäljet", weather_view: "Sää & Vuorovesi", danger_view: "Vaara-alueet", settings_view: "Asetukset", theme_lbl: "Teema", lang_lbl: "Kieli", siren_test: "Testaa sireeniä", alarm_alert: "ANKKURIHÄLYTYS!", alarm_msg: "Vene on ajelehtinut turvasäteen ulkopuolelle!", dismiss: "Kuittaa", simulator_lbl: "GPS Simulaattori", sim_active: "Simulointi päällä", sim_inactive: "Käytä GPS:ää", danger_zone_name: "Toulonin harjoitusalue (G1)", danger_zone_desc: "Armeijan ampuma-alue.", clear_tracks: "Tyhjennä historia", no_tracks: "Ei tallennettuja jälkiä.", tide_lbl: "Vuorovesi Toulon", weather_wind: "Tuuli", weather_waves: "Aallot", weather_baro: "Barometri", weather_desc: "Tuleva säätoiminto reittisuunnitteluun.", clear_alarm_track: "Pysäytä Hälytys & Jälki", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  el: { title: "Sirroco Marine", lat: "Γεωγρ. Πλάτος", lon: "Γεωγρ. Μήκος", speed: "Ταχύτητα (kn)", cog: "Πορεία (°)", track_status: "Καταγραφή πορείας", start_track: "Έναρξη τροχιάς", stop_track: "Τερματισμός τροχιάς", anchor_status: "Συναγερμός Άγκυρας", radius: "Ακτίνα (NM)", drift_dist: "Απόσταση έκπτωσης (NM)", active: "Ενεργό", inactive: "Ανενεργό", map_view: "Χάρτης", routes_view: "Διαδρομές", weather_view: "Καιρός & Παλίρροια", danger_view: "Επικίνδυνες Ζώνες", settings_view: "Ρυθμίσεις", theme_lbl: "Θέμα", lang_lbl: "Γλώσσα", siren_test: "Δοκιμή σειρήνας", alarm_alert: "ΣΥΝΑΓΕΡΜΟΣ ΑΓΚΥΡΑΣ!", alarm_msg: "Το σκάφος έχει ξεπεράσει την ακτίνα ασφαλείας!", dismiss: "Απόρριψη", simulator_lbl: "Προσομοιωτής GPS", sim_active: "Προσομοίωση Ενεργή", sim_inactive: "Χρήση πραγματικού GPS", danger_zone_name: "Στρατιωτική Ζώνη Τουλόν (G1)", danger_zone_desc: "Ζώνη βολών ναυτικού. Είσοδος υπό περιορισμούς.", clear_tracks: "Καθαρισμός ιστορικού", no_tracks: "Δen υπάρχουν διαδρομές.", tide_lbl: "Παλίρροια Τουλόν", weather_wind: "Άνεμος", weather_waves: "Κύματα", weather_baro: "Βαρόμετρο", weather_desc: "Μελλοντική διασύνδεση καιρού GRIB.", clear_alarm_track: "Διακοπή Συναγερμού & Τροχιάς", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  hu: { title: "Sirroco Marine", lat: "Szélesség", lon: "Hosszúság", speed: "Sebesség (cs)", cog: "Irány (°)", track_status: "Útvonal rögzítés", start_track: "Nyomvonal indítása", stop_track: "Nyomvonal leállítása", anchor_status: "Horgonyőr", radius: "Sugár (NM)", drift_dist: "Sodródás (NM)", active: "Aktív", inactive: "Inaktív", map_view: "Térkép", routes_view: "Nyomvonalak", weather_view: "Időjárás & Árapály", danger_view: "Veszélyes zónák", settings_view: "Beállítások", theme_lbl: "Téma", lang_lbl: "Nyelv", siren_test: "Sziréna teszt", alarm_alert: "HORGONY RIASZTÁS!", alarm_msg: "A hajó elsodródott a biztonsági sugárból!", dismiss: "Némítás", simulator_lbl: "GPS Szimulátor", sim_active: "Szimuláció aktív", sim_inactive: "Valós GPS használata", danger_zone_name: "Touloni katonai zóna (G1)", danger_zone_desc: "Lőgyakorlati terület.", clear_tracks: "Előzmények törlése", no_tracks: "Nincsenek rögzített nyomvonalak.", tide_lbl: "Árapály Toulon", weather_wind: "Szél", weather_waves: "Hullámzás", weather_baro: "Barométer", weather_desc: "GRIB időjárási modul előkészítés.", clear_alarm_track: "Riasztás és Nyomvonal leállítása", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  ga: { title: "Sirroco Marine", lat: "Domhanfhad", lon: "Domhanleithead", speed: "Luas (snaidhm)", cog: "Treoir (°)", track_status: "Logáil Rianta", start_track: "Tosaigh Rian", stop_track: "Stad Rian", anchor_status: "Aláram Ancaire", radius: "Ga (NM)", drift_dist: "Fad Dríodar (NM)", active: "Gníomhach", inactive: "Neamhghníomhach", map_view: "Léarscáil", routes_view: "Rianta", weather_view: "Aimsir & Taoide", danger_view: "Limistéir Chontúirte", settings_view: "Socruithe", theme_lbl: "Téama", lang_lbl: "Teanga", siren_test: "Tástáil Seirín", alarm_alert: "ALÁRAM ANCAIRE!", alarm_msg: "D'imigh an bád thar an nga sábháilteachta!", dismiss: "Bíseach", simulator_lbl: "Insamhlóir GPS", sim_active: "Insamhlú Gníomhach", sim_inactive: "Úsáid GPS Réadúil", danger_zone_name: "Limistéar Toulon (G1)", danger_zone_desc: "Limistéar lámhaigh míleata.", clear_tracks: "Glan Stair", no_tracks: "Uimh rianta sábháilte.", tide_lbl: "Taoide Toulon", weather_wind: "Gaoth", weather_waves: "Tonnta", weather_baro: "Baróiméadar", weather_desc: "Comhéadan aimsire don seoltóireacht sa todhchaí.", clear_alarm_track: "Stad Aláram & Rian", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  lv: { title: "Sirroco Marine", lat: "Platums", lon: "Garums", speed: "Ātrums (mezgli)", cog: "Kurss", track_status: "Ceļa ierakstīšana", start_track: "Sākt ceļu", stop_track: "Apturēt ceļu", anchor_status: "Enkura uzraudzība", radius: "Rādiuss (NM)", drift_dist: "Dreifs (NM)", active: "Aktīvs", inactive: "Neaktīvs", map_view: "Karte", routes_view: "Maršruti", weather_view: "Laika apstākļi & Plūdmaiņas", danger_view: "Bīstamās zonas", settings_view: "Iestatījumi", theme_lbl: "Tēma", lang_lbl: "Valoda", siren_test: "Sirēnas tests", alarm_alert: "ENKURA ALARM!", alarm_msg: "Laiva ir nodreifējusi tālāk par drošības rādiusu!", dismiss: "Noraidīt", simulator_lbl: "GPS Simulators", sim_active: "Simulācija aktīva", sim_inactive: "Lietot reālu GPS", danger_zone_name: "Tulonas mācību zona (G1)", danger_zone_desc: "Militāro šaušanas mācību zona.", clear_tracks: "Dzēst vēsturi", no_tracks: "Nav saglabātu maršrutu.", tide_lbl: "Plūdmaiņas Tulonā", weather_wind: "Vējš", weather_waves: "Viļņi", weather_baro: "Barometrs", weather_desc: "GRIB laikapstākļu planotājs.", clear_alarm_track: "Apturēt Signalizāciju & Ceļu", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  lt: { title: "Sirroco Marine", lat: "Platuma", lon: "Ilguma", speed: "Greitis (mazgai)", cog: "Kursas Over Ground", track_status: "Kelio sekimas", start_track: "Pradėti sekti", stop_track: "Sustabdyti sekti", anchor_status: "Inkaro signalas", radius: "Spindulys (NM)", drift_dist: "Dreifas (NM)", active: "Aktyvus", inactive: "Neaktyvus", map_view: "Žemėlapis", routes_view: "Keliai", weather_view: "Orai & Potvyniai", danger_view: "Pavojaus zonos", settings_view: "Nustatymai", theme_lbl: "Tema", lang_lbl: "Kalba", siren_test: "Sirenos testas", alarm_alert: "INKARO SIGNALAS!", alarm_msg: "Laivas nudreifavo už saugumo ribų!", dismiss: "Išjungti", simulator_lbl: "GPS Simuliatorius", sim_active: "Simuliacija aktyvi", sim_inactive: "Naudoti tikrą GPS", danger_zone_name: "Tulono karinė zona (G1)", danger_zone_desc: "Karinių pratybų zona.", clear_tracks: "Valyti istoriją", no_tracks: "Nėra išsaugotų maršrutų.", tide_lbl: "Potvyniai Tulone", weather_wind: "Vėjas", weather_waves: "Bangos", weather_baro: "Barometras", weather_desc: "Būsimas GRIB orų modulis buriavimui.", clear_alarm_track: "Sustabdyti Signalą ir Kelią", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  mt: { title: "Sirroco Marine", lat: "Latitudni", lon: "Lonġitudni", speed: "Veloċità (kn)", cog: "Kors (°)", track_status: "Ruta Tracking", start_track: "Ibda Traċċa", stop_track: "Waqqaf Traċċa", anchor_status: "Allarm tal-Ankra", radius: "Raġġ (NM)", drift_dist: "Distanza ta' drift (NM)", active: "Attiv", inactive: "Mhux Attiv", map_view: "Mappa", routes_view: "Rotot", weather_view: "Temp/Marea", danger_view: "Żoni ta' Periklu", settings_view: "Settings", theme_lbl: "Tema", lang_lbl: "Lingwa", siren_test: "Ittestja s-Sirena", alarm_alert: "ALLARM TAL-ANKRA!", alarm_msg: "Id-dgħajsa tbiegħdet mir-raġġ tas-sigurtà!", dismiss: "Agħlaq", simulator_lbl: "Simulatur tal-GPS", sim_active: "Simulazzjoni Attiva", sim_inactive: "Uża GPS Reali", danger_zone_name: "Żona Toulon (G1)", danger_zone_desc: "Żona militari ta' sparar.", clear_tracks: "Ħassar l-Istorja", no_tracks: "L-ebda traċċa ma ġiet salvata.", tide_lbl: "Marea Toulon", weather_wind: "Riħ", weather_waves: "Mewġ", weather_baro: "Barometru", weather_desc: "Modulu tat-temp fil-futur.", clear_alarm_track: "Waqqaf l-Allarm u r-Ruta", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  pl: { title: "Sirroco Marine", lat: "Szerokość", lon: "Długość", speed: "Prędkość (węzły)", cog: "Kurs (°)", track_status: "Zapis trasy", start_track: "Zapisuj trasę", stop_track: "Zatrzymaj zapis", anchor_status: "Alarm Kotwiczny", radius: "Promień (NM)", drift_dist: "Odległość dryfu (NM)", active: "Aktywny", inactive: "Nieaktywny", map_view: "Mapa", routes_view: "Trasy", weather_view: "Pogoda & Przypływy", danger_view: "Strefy Zagrożeń", settings_view: "Ustawienia", theme_lbl: "Motyw", lang_lbl: "Język", siren_test: "Test syreny", alarm_alert: "ALARM KOTWICZNY!", alarm_msg: "Jacht dryfuje poza promień bezpieczeństwa!", dismiss: "Wyłącz", simulator_lbl: "Symulator GPS", sim_active: "Symulacja aktywna", sim_inactive: "Użyj realnego GPS", danger_zone_name: "Poligon wojskowy Tulon (G1)", danger_zone_desc: "Strefa ćwiczeń wojskowych. Wstęp ograniczony.", clear_tracks: "Wyczyść historię", no_tracks: "Brak zapisanych tras.", tide_lbl: "Przypływy Tulon", weather_wind: "Wiatr", weather_waves: "Fale", weather_baro: "Barometr", weather_desc: "Przyszły moduł pogodowy GRIB.", clear_alarm_track: "Zatrzymaj Alarm i Zapis", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  ro: { title: "Sirroco Marine", lat: "Latitudine", lon: "Longitudine", speed: "Viteză (noduri)", cog: "Curs (°)", track_status: "Înregistrare traseu", start_track: "Pornește traseu", stop_track: "Oprește traseu", anchor_status: "Alarmă ancoră", radius: "Rază (NM)", drift_dist: "Distanță derivă (NM)", active: "Activ", inactive: "Inactiv", map_view: "Hartă", routes_view: "Trasee", weather_view: "Meteo & Maree", danger_view: "Zone Periculoase", settings_view: "Setări", theme_lbl: "Temă", lang_lbl: "Limbă", siren_test: "Test sirena", alarm_alert: "ALARMĂ ANCORĂ!", alarm_msg: "Ambarcațiunea a depășit raza de siguranță!", dismiss: "Ignoră", simulator_lbl: "Simulator GPS", sim_active: "Simulare activă", sim_inactive: "Folosește GPS Real", danger_zone_name: "Zona de exerciții Toulon (G1)", danger_zone_desc: "Zonă de trageri militare marine.", clear_tracks: "Șterge istoricul", no_tracks: "Niciun traseu salvat.", tide_lbl: "Maree Toulon", weather_wind: "Vânt", weather_waves: "Valuri", weather_baro: "Barometru", weather_desc: "Interfață GRIB planificată pentru viitor.", clear_alarm_track: "Oprește Alarmă și Traseu", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  sk: { title: "Sirroco Marine", lat: "Zem. Šírka", lon: "Zem. Dĺžka", speed: "Rýchlosť (uz)", cog: "Kurz (°)", track_status: "Záznam trasy", start_track: "Spustiť trasu", stop_track: "Zastaviť trasu", anchor_status: "Kotevná stráž", radius: "Polomer (NM)", drift_dist: "Odchýlka (NM)", active: "Aktívny", inactive: "Neaktívny", map_view: "Mapa", routes_view: "Trasy", weather_view: "Počasie & Príliv", danger_view: "Nebezpečné zóny", settings_view: "Nastavenia", theme_lbl: "Téma", lang_lbl: "Jazyk", siren_test: "Test sirény", alarm_alert: "ALARM KOTVY!", alarm_msg: "Loď sa odchýlila z bezpečnostného okruhu!", dismiss: "Zrušiť", simulator_lbl: "GPS Simulátor", sim_active: "Simulácia aktívna", sim_inactive: "Použiť Reálne GPS", danger_zone_name: "Vojenský priestor Toulon (G1)", danger_zone_desc: "Cvičná strelnica vojnového loďstva.", clear_tracks: "Vymazať históriu", no_tracks: "Žiadne uložené trasy.", tide_lbl: "Príliv Toulon", weather_wind: "Vietor", weather_waves: "Vlny", weather_baro: "Barometer", weather_desc: "Plánované meteo rozhranie pre plavbu.", clear_alarm_track: "Zastaviť Alarm a Trasu", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  sl: { title: "Sirroco Marine", lat: "Širina", lon: "Dolžina", speed: "Hitrost (vozli)", cog: "Smer (°)", track_status: "Snemanje poti", start_track: "Začni sled", stop_track: "Ustavi sled", anchor_status: "Sidrni alarm", radius: "Polmer (NM)", drift_dist: "Distančna odklon (NM)", active: "Aktivno", inactive: "Neaktivno", map_view: "Zemljevid", routes_view: "Poti", weather_view: "Vreme & Plimovanje", danger_view: "Nevarne cone", settings_view: "Nastavitve", theme_lbl: "Tema", lang_lbl: "Jezik", siren_test: "Test sirene", alarm_alert: "SIDRNI ALARM!", alarm_msg: "Sidro je popustilo, plovilo se premika!", dismiss: "Utišaj", simulator_lbl: "GPS Simulator", sim_active: "Simulacija aktivna", sim_inactive: "Uporabi realni GPS", danger_zone_name: "Konec vadbe Toulon (G1)", danger_zone_desc: "Območje vojaških vaj.", clear_tracks: "Počisti zgodovino", no_tracks: "Ni shranjenih poti.", tide_lbl: "Plimovanje Toulon", weather_wind: "Veter", weather_waves: "Valovi", weather_baro: "Barometer", weather_desc: "Bodoči modul vremenskih kart GRIB.", clear_alarm_track: "Ustavi Alarm in Sled", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." },
  sv: { title: "Sirroco Marine", lat: "Breddgrad", lon: "Längdgrad", speed: "Fart (kn)", cog: "Kurs Over Ground", track_status: "Ruttloggning", start_track: "Starta rutt", stop_track: "Stoppa rutt", anchor_status: "Ankarvakt", radius: "Radie (NM)", drift_dist: "Driftavstånd (NM)", active: "Aktiv", inactive: "Inaktiv", map_view: "Kort", routes_view: "Rutter", weather_view: "Väder & Tidvatten", danger_view: "Farozoner", settings_view: "Inställningar", theme_lbl: "Tema", lang_lbl: "Språk", siren_test: "Testa sirén", alarm_alert: "ANKARLARM!", alarm_msg: "Båten har drivit utanför säkerhetsradien!", dismiss: "Kvittera", simulator_lbl: "GPS Simulator", sim_active: "Simulering aktiv", sim_inactive: "Använd Riktig GPS", danger_zone_name: "Toulon övningsområde (G1)", danger_zone_desc: "Militärt skjutområde.", clear_tracks: "Rensa historik", no_tracks: "Inga sparade rutter.", tide_lbl: "Tidvatten Toulon", weather_wind: "Vind", weather_waves: "Vågor", weather_baro: "Barometer", weather_desc: "Kommande väderplaneringsfunktion.", clear_alarm_track: "Stoppa Larm & Rutt", ping_title: "SHOM PING Portal", ping_desc: "Access active navigational warnings (AVURNAVs) and regulation zones directly on the official PING platform." }
};

let currentLang = 'fr'; // Default to French as requested

// Dynamically injected new translation keys
const newTranslations = {
  fr: {
    mode_consultation: "Consultation",
    mode_navigation: "Navigation",
    control_center: "Centre de Contrôle",
    settings_general: "Général",
    settings_boat: "Mon Bateau",
    settings_simulator: "Simulateur GPS",
    boat_name: "Nom du Bateau",
    boat_length: "Longueur (m)",
    boat_width: "Largeur (m)",
    boat_draft: "Tirant d'eau (m)",
    boat_clearance: "Pied de pilote (m)",
    save_boat: "Enregistrer le Profil",
    nav_active: "Navigation en cours",
    stop_navigation: "Terminer le trajet",
    anchorages_title: "Mouillages possibles",
    harbors_title: "Ports de plaisance",
    anchorages_view: "Ancre",
    layers_view: "Calques",
    depth: "Sondeur",
    nav_duration: "Durée",
    nav_distance: "Distance",
    wind: "Vent",
    weather_wind_dir: "Direction",
    weather_wind_gusts: "Rafales",
    weather_wave_dir: "Dir. vagues",
    weather_wave_period: "Période",
    weather_temp: "Température",
    harbor_zoom_prompt: "Zoomez sur la carte pour charger les ports de plaisance de la zone.",
    harbor_capitainerie: "Capitainerie",
    harbor_vhf: "VHF",
    harbor_email: "Email",
    harbor_address: "Adresse",
    harbor_places: "Places",
    harbor_max_len: "Longueur Max",
    harbor_max_draft: "Tirant d'eau Max",
    harbor_services: "Services",
    harbor_type: "Port de plaisance",
    harbor_no_data: "Aucun port de plaisance trouvé dans cette zone.",
    harbor_loading: "Chargement des ports..."
  },
  en: {
    mode_consultation: "Consultation",
    mode_navigation: "Navigation",
    control_center: "Control Center",
    settings_general: "General",
    settings_boat: "My Boat",
    settings_simulator: "GPS Simulator",
    boat_name: "Boat Name",
    boat_length: "Length (m)",
    boat_width: "Beam (m)",
    boat_draft: "Draft (m)",
    boat_clearance: "Under-keel Clearance (m)",
    save_boat: "Save Profile",
    nav_active: "Navigation Active",
    stop_navigation: "Finish Track",
    anchorages_title: "Possible Anchorages",
    harbors_title: "Marinas",
    anchorages_view: "Anchor",
    layers_view: "Layers",
    depth: "Depth",
    nav_duration: "Duration",
    nav_distance: "Distance",
    wind: "Wind",
    weather_wind_dir: "Dir.",
    weather_wind_gusts: "Gusts",
    weather_wave_dir: "Wave Dir",
    weather_wave_period: "Period",
    weather_temp: "Temp",
    harbor_zoom_prompt: "Zoom in on the map to load the harbors in the area.",
    harbor_capitainerie: "Harbour office",
    harbor_vhf: "VHF",
    harbor_email: "Email",
    harbor_address: "Address",
    harbor_places: "Berths",
    harbor_max_len: "Max Length",
    harbor_max_draft: "Max Draft",
    harbor_services: "Services",
    harbor_type: "Marina",
    harbor_no_data: "No marinas found in this area.",
    harbor_loading: "Loading harbors..."
  }
};

// Merge new keys into translations dictionary
for (let lang in translations) {
  const source = newTranslations[lang] || newTranslations.en;
  Object.assign(translations[lang], source);
}

// i18n helper function
function translateUI(lang) {
  if (!translations[lang]) lang = 'en';
  currentLang = lang;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      // Check if it's an input placeholder or select option
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.setAttribute('placeholder', translations[lang][key]);
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  // Translate recenter button tooltip
  const recenterBtn = document.querySelector('.recenter-control-btn');
  if (recenterBtn) {
    recenterBtn.title = lang === 'fr' ? 'Centrer sur la position' : 'Recenter to boat position';
  }

  // Refresh weather translations if already initialized
  if (typeof lastFetchedLat !== 'undefined' && lastFetchedLat !== null && lastFetchedLon !== null) {
    updateWeatherAndTides(lastFetchedLat, lastFetchedLon, true);
  }

  // Refresh saved tracks with the new language
  if (typeof renderSavedTracks === 'function') {
    renderSavedTracks();
  }

  // Save selection
  localStorage.setItem('sirroco_lang', lang);
}

// Update recenter button styling based on auto-centering state
function updateRecenterButtonUI() {
  const btn = document.querySelector('.recenter-control-btn');
  if (btn) {
    if (autoCenter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }
}


// 2. State Management
let map = null;
let userMarker = null;
let trackLine = null;
let currentTrack = [];
let isTracking = false;
let savedTracks = [];

// App Operation Modes
let appMode = 'consultation'; // 'consultation' or 'navigation'
let autoCenter = true; // Auto-center map on user/boat position


// Boat Profile
let boatProfile = {
  name: 'Sirroco II',
  length: 11.5,
  width: 3.8,
  draft: 1.9,
  clearance: 0.5
};

// Navigation Session Stats
let navigationStartTime = null;
let navigationDistance = 0;
let lastNavLatLng = null;
let navTimerInterval = null;

// Harbors (Ports de plaisance) dynamic data state
let currentHarbors = [];
let harborMarkers = [];
let harborsLayer = null;
let allHarborsCache = new Map();
let isFetchingHarbors = false;
let harborsDebounceTimeout = null;

// Anchor Alarm State
let isAnchorAlarmActive = false;
let anchorLatLng = null;
let alarmRadius = 0.030; // default 0.030 NM (approx. 55 meters)
let anchorMarker = null;
let anchorCircle = null;

// Telemetry State
let currentLat = 43.1167; // Toulon Lat
let currentLon = 5.9333;  // Toulon Lon
let currentSpeed = 0.0;   // Knots
let currentHeading = 0;   // Degrees
let currentWindDirection = null; // Degrees (from weather API)

// GPS Simulation State
let isSimulating = true; // default true for testing and PC environment
let simHeading = 180;    // south
let simSpeed = 4.5;      // 4.5 knots
let simTimer = null;
let isDrifting = false;

// Web Audio API Synth Alarm
let audioCtx = null;
let alarmOscInterval = null;

// Danger Zone GeoJSON Data
// French maritime military and restricted zones (official zones, publicly known)
const dangerZoneGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de tir de Toulon (G1)",
        "name_en": "Toulon Military Firing Zone (G1)",
        "type": "military_firing",
        "status": "permanent",
        "authority": "Marine Nationale",
        "description": "Zone d'exercice de tir de la Marine Nationale. Accès interdit en période de tirs. Consulter les AVURNAV locaux."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [5.7000, 43.0200], [6.2000, 43.0200],
          [6.2000, 42.7500], [5.7000, 42.7500],
          [5.7000, 43.0200]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de tir de l'île du Levant (F)",
        "name_en": "Île du Levant Military Zone (F)",
        "type": "military_restricted",
        "status": "permanent",
        "authority": "DGA / Marine Nationale",
        "description": "Zone réservée aux essais de missiles et torpilles. Navigation interdite sans autorisation préalable."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [6.3500, 43.0800], [6.6500, 43.0800],
          [6.6500, 42.8500], [6.3500, 42.8500],
          [6.3500, 43.0800]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone OTAN - Secteur Méditerranée NW",
        "name_en": "NATO Exercise Area - NW Mediterranean",
        "type": "nato_exercise",
        "status": "periodic",
        "authority": "OTAN / NATO",
        "description": "Zone d'exercices OTAN en Méditerranée nord-occidentale. Activée périodiquement. Vérifier les avis locaux."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [4.0000, 42.5000], [6.5000, 42.5000],
          [6.5000, 41.0000], [4.0000, 41.0000],
          [4.0000, 42.5000]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de tir de Brest (Penmarc'h)",
        "name_en": "Brest Naval Firing Zone (Penmarc'h)",
        "type": "military_firing",
        "status": "permanent",
        "authority": "Marine Nationale - Brest",
        "description": "Zone de tir de la Marine Nationale au large du Finistère. Consulter l'AVURNAV de Brest avant navigation."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-5.2000, 47.8000], [-4.0000, 47.8000],
          [-4.0000, 47.2000], [-5.2000, 47.2000],
          [-5.2000, 47.8000]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de tir de Lorient (G.D.)",
        "name_en": "Lorient Naval Exercise Zone",
        "type": "military_firing",
        "status": "periodic",
        "authority": "Marine Nationale - Lorient",
        "description": "Zone de tir et d'exercice naval au large de Lorient. Activée lors des exercices de la flotte de sous-marins."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-4.5000, 47.6500], [-3.2000, 47.6500],
          [-3.2000, 47.0000], [-4.5000, 47.0000],
          [-4.5000, 47.6500]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Couloir de Sécurité - Rade de Brest",
        "name_en": "Safety Corridor - Brest Harbour",
        "type": "restricted_navigation",
        "status": "permanent",
        "authority": "Préfecture Maritime Atlantique",
        "description": "Zone de trafic séparé à l'entrée de la rade de Brest. Respecter les règles de circulation maritime."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-4.6500, 48.3800], [-4.4000, 48.3800],
          [-4.4000, 48.2500], [-4.6500, 48.2500],
          [-4.6500, 48.3800]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de mouillage interdit - Golfe du Lion",
        "name_en": "No-Anchor Zone - Gulf of Lion (Pipelines)",
        "type": "anchoring_prohibited",
        "status": "permanent",
        "authority": "Préfecture Maritime Méditerranée",
        "description": "Zone de mouillage interdit en raison de pipelines et câbles sous-marins. Fond dangereux pour l'ancre."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [3.5000, 43.3000], [4.8000, 43.3000],
          [4.8000, 43.0000], [3.5000, 43.0000],
          [3.5000, 43.3000]
        ]]
      }
    }
  ]
};
let dangerZoneLayer = null;
let avurnavNotices = [];
let pingWmsLayer = null;
let osm = null;
let openseamap = null;

// 3. Leaflet Map Setup
function initMap() {
  // Center on Toulon
  map = L.map('map', {
    center: [currentLat, currentLon],
    zoom: 13,
    zoomControl: true
  });

  // Base Layers
  osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  });

  // Add OSM as default base layer
  osm.addTo(map);

  // Overlays
  openseamap = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
    attribution: '© OpenSeaMap'
  });

  openseamap.addTo(map);

  // Danger zone layer - color-coded by type with interactive popups
  const zoneColors = {
    'military_firing':       { color: '#ef4444', fill: '#ef4444', fillOpacity: 0.20 },
    'military_restricted':   { color: '#f97316', fill: '#f97316', fillOpacity: 0.18 },
    'nato_exercise':         { color: '#a855f7', fill: '#a855f7', fillOpacity: 0.12 },
    'anchoring_prohibited':  { color: '#eab308', fill: '#eab308', fillOpacity: 0.20 },
    'restricted_navigation': { color: '#3b82f6', fill: '#3b82f6', fillOpacity: 0.18 },
  };

  dangerZoneLayer = L.geoJSON(dangerZoneGeoJSON, {
    style: (feature) => {
      const t = feature.properties.type || 'military_firing';
      const c = zoneColors[t] || zoneColors['military_firing'];
      return {
        color: c.color,
        fillColor: c.fill,
        fillOpacity: c.fillOpacity,
        weight: 2.5,
        dashArray: '6, 4'
      };
    },
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      const statusIcon = p.status === 'permanent' ? '🔴' : '🟡';
      const typeLabels = {
        'military_firing': '💣 Tir militaire',
        'military_restricted': '⛔ Zone restreinte militaire',
        'nato_exercise': '🔵 Exercice OTAN',
        'anchoring_prohibited': '⚓ Mouillage interdit',
        'restricted_navigation': '🚫 Navigation restreinte',
      };
      const typeLabel = typeLabels[p.type] || p.type;
      layer.bindPopup(`
        <div style="font-family: var(--font-family, sans-serif); min-width: 200px;">
          <strong style="font-size: 0.95rem;">${p.name}</strong><br>
          <span style="color: #888; font-size: 0.8rem;">${typeLabel} ${statusIcon}</span><br>
          <hr style="margin: 4px 0; border-color: #333;">
          <span style="font-size: 0.8rem;">${p.description}</span><br>
          <small style="color: #666;">Autorité: ${p.authority}</small>
        </div>
      `, { maxWidth: 280 });
    }
  });
  dangerZoneLayer.addTo(map);

  // PING AVURNAV WMS layer (live navigational warnings from SHOM PING portal)
  // This WMS overlay provides official French navigational warnings as an overlay
  pingWmsLayer = L.tileLayer.wms('https://geoserver.ping-info-nautique.fr/geoserver/wms', {
    layers: 'ping:avurnav_zone',
    format: 'image/png',
    transparent: true,
    opacity: 0.7,
    attribution: '© SHOM / PING - Avis Urgents aux Navigateurs',
    crossOrigin: true
  });
  // Note: We add it to overlayMaps but don't add to map by default (server may not be accessible)

  // Initialize harbors layer group and add to map
  harborsLayer = L.layerGroup().addTo(map);

  // Initialize Route Line
  trackLine = L.polyline([], { color: '#06b6d4', weight: 4 }).addTo(map);

  // Custom boat symbol SVG with stylized top-down sailboat and dynamic sails
  const boatIcon = L.divIcon({
    className: 'custom-boat-marker',
    html: `
      <div class="allures-rose-container">
        <!-- Point of Sail Rose -->
        <div id="allures-rose" class="allures-rose"></div>
        <!-- Sailboat SVG -->
        <svg id="boat-svg" style="position: absolute; left: 30px; top: 30px; width: 40px; height: 40px; transform: rotate(0deg); z-index: 2;" viewBox="0 0 40 40">
          <g class="boat-hull-group" style="transform-origin: 20px 20px;">
            <!-- Hull -->
            <path class="boat-hull-path" d="M 20,4 C 14,10 12,18 13,34 L 27,34 C 28,18 26,10 20,4 Z" fill="#0f172a" stroke="#22d3ee" stroke-width="1.8"/>
            <!-- Deck Cabin -->
            <path d="M 20,11 C 17.5,15 16.5,19 17.2,28 L 22.8,28 C 23.5,19 22.5,15 20,11 Z" fill="#1e293b" stroke="#0891b2" stroke-width="1"/>
            <!-- Mast -->
            <circle cx="20" cy="18" r="1.5" fill="#f8fafc"/>
            <!-- Mainsail (back) -->
            <path id="boat-mainsail" d="M 20,18 L 20,32" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" style="transform-origin: 20px 18px; transition: transform 0.4s ease;"/>
            <!-- Jib (front) -->
            <path id="boat-jib" d="M 20,18 L 20,8" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="transform-origin: 20px 18px; transition: transform 0.4s ease;"/>
          </g>
        </svg>
      </div>
    `,
    iconSize: [100, 100],
    iconAnchor: [50, 50]
  });

  userMarker = L.marker([currentLat, currentLon], { icon: boatIcon }).addTo(map);
  updateBoatSails(currentHeading, currentWindDirection);
  
  // Click on map to position anchor if settings menu isn't active
  map.on('click', (e) => {
    if (isAnchorAlarmActive && anchorMarker) {
      // update anchor position to clicked coordinates
      updateAnchorLocation(e.latlng.lat, e.latlng.lng);
    }
  });

  // Add a recenter button control to the map (top left)
  L.Control.Recenter = L.Control.extend({
    onAdd: function(m) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const btn = L.DomUtil.create('a', 'recenter-control-btn', container);
      btn.href = '#';
      btn.title = currentLang === 'fr' ? 'Centrer sur la position' : 'Recenter to boat position';
      btn.innerHTML = '📍';
      
      L.DomEvent.disableClickPropagation(btn);
      L.DomEvent.disableScrollPropagation(btn);
      
      L.DomEvent.on(btn, 'click', function(e) {
        L.DomEvent.preventDefault(e);
        L.DomEvent.stopPropagation(e);
        autoCenter = true;
        m.setView([currentLat, currentLon], m.getZoom());
        updateRecenterButtonUI();
      });
      return container;
    },
    onRemove: function(m) {}
  });
  L.control.recenter = function(opts) { return new L.Control.Recenter(opts); };
  L.control.recenter({ position: 'topleft' }).addTo(map);

  // Stop auto-following if the user manually drags/pans the map
  map.on('dragstart', () => {
    autoCenter = false;
    updateRecenterButtonUI();
  });

  // Set initial recenter button active status
  updateRecenterButtonUI();

  // Weather & tides scroll update listener
  map.on('moveend', onMapMove);

  // Harbors viewport update listener
  map.on('moveend', onMapMoveHarbors);
}

// 4. Anchor Alarm Logic
function updateAnchorLocation(lat, lng) {
  anchorLatLng = L.latLng(lat, lng);
  
  if (anchorMarker) {
    anchorMarker.setLatLng(anchorLatLng);
  } else {
    const anchorIcon = L.divIcon({
      className: 'anchor-point-marker',
      html: `
        <svg style="width: 24px; height: 24px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
          <circle cx="12" cy="5" r="3" fill="#ef4444"/>
          <line x1="12" y1="8" x2="12" y2="20" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <path d="M6,12 C6,18 18,18 18,12" />
        </svg>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    anchorMarker = L.marker(anchorLatLng, { draggable: true, icon: anchorIcon }).addTo(map);
    
    anchorMarker.on('drag', (e) => {
      const position = e.target.getLatLng();
      updateAnchorLocation(position.lat, position.lng);
    });
  }

  if (anchorCircle) {
    anchorCircle.setLatLng(anchorLatLng);
    anchorCircle.setRadius(alarmRadius * 1852);
  } else {
    anchorCircle = L.circle(anchorLatLng, {
      radius: alarmRadius * 1852,
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.15,
      weight: 1.5
    }).addTo(map);
  }

  document.getElementById('anchor-lat').textContent = lat.toFixed(5);
  document.getElementById('anchor-lon').textContent = lng.toFixed(5);
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // returns distance in meters
}

function checkAnchorAlarm() {
  if (!isAnchorAlarmActive || !anchorLatLng) return;

  const distMeters = calculateHaversineDistance(currentLat, currentLon, anchorLatLng.lat, anchorLatLng.lng);
  const distNM = distMeters / 1852;
  document.getElementById('drift-distance-val').textContent = `${distNM.toFixed(3)} NM`;

  if (distNM > alarmRadius) {
    triggerAlarm(distNM);
  } else {
    dismissAlarmUIOnly();
  }
}

// 5. Sound Synthesizer (Web Audio API)
function playAlarmSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (alarmOscInterval) return;

  // Pulse siren sweeps
  alarmOscInterval = setInterval(() => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch
    osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.45); // Pitch sweep down

    gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.49);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  }, 600);
}

function stopAlarmSound() {
  if (alarmOscInterval) {
    clearInterval(alarmOscInterval);
    alarmOscInterval = null;
  }
}

function triggerAlarm(distance) {
  document.getElementById('alarm-modal-distance').textContent = `${distance.toFixed(3)} NM`;
  document.getElementById('alarm-overlay').classList.add('active');
  document.getElementById('anchor-status-indicator').className = "status-indicator warning";
  playAlarmSound();
}

function dismissAlarm() {
  // Dismisses alarm but does NOT turn off anchor alarm mode (snoozes sound)
  stopAlarmSound();
  document.getElementById('alarm-overlay').classList.remove('active');
}

function deactivateAnchorAlarm() {
  isAnchorAlarmActive = false;
  
  const toggle = document.getElementById('anchor-alarm-toggle');
  if (toggle) toggle.checked = false;
  
  stopAlarmSound();
  
  const overlay = document.getElementById('alarm-overlay');
  if (overlay) overlay.classList.remove('active');
  
  if (anchorMarker) {
    map.removeLayer(anchorMarker);
    anchorMarker = null;
  }
  if (anchorCircle) {
    map.removeLayer(anchorCircle);
    anchorCircle = null;
  }

  const statusText = document.getElementById('anchor-status-text');
  if (statusText) statusText.textContent = translations[currentLang].inactive;
  
  const statusIndicator = document.getElementById('anchor-status-indicator');
  if (statusIndicator) statusIndicator.className = "status-indicator";
  
  const driftVal = document.getElementById('drift-distance-val');
  if (driftVal) driftVal.textContent = "--";
  
  const anchorLat = document.getElementById('anchor-lat');
  if (anchorLat) anchorLat.textContent = "--";
  
  const anchorLon = document.getElementById('anchor-lon');
  if (anchorLon) anchorLon.textContent = "--";

  const anchorBadge = document.getElementById('status-anchor-badge');
  if (anchorBadge) anchorBadge.style.display = 'none';

  const anchorToggleBtn = document.getElementById('anchor-toggle-btn');
  if (anchorToggleBtn) anchorToggleBtn.classList.remove('active');
}

function dismissAlarmUIOnly() {
  document.getElementById('alarm-overlay').classList.remove('active');
  stopAlarmSound();
  if (isAnchorAlarmActive) {
    document.getElementById('anchor-status-indicator').className = "status-indicator active";
  }
}

// 6. Navigation and Tracking
function updatePosition(lat, lng, speedKts, headingDeg) {
  currentLat = lat;
  currentLon = lng;
  currentSpeed = speedKts;
  currentHeading = headingDeg;

  // Update telemetry text elements
  document.getElementById('telemetry-lat').textContent = lat.toFixed(5);
  document.getElementById('telemetry-lon').textContent = lng.toFixed(5);
  document.getElementById('telemetry-speed').textContent = speedKts.toFixed(1);
  document.getElementById('telemetry-cog').textContent = Math.round(headingDeg).toString().padStart(3, '0');

  // Update map marker
  const newLatLng = L.latLng(lat, lng);
  if (userMarker) {
    userMarker.setLatLng(newLatLng);
    // Rotate boat icon
    const boatSvg = document.getElementById('boat-svg');
    if (boatSvg) {
      boatSvg.style.transform = `rotate(${headingDeg}deg)`;
      updateBoatSails(headingDeg, currentWindDirection);
    }
  }

  // Active navigation HUD updates and auto-centering
  if (appMode === 'navigation') {
    if (lastNavLatLng) {
      const step = calculateHaversineDistance(lat, lng, lastNavLatLng.lat, lastNavLatLng.lng);
      navigationDistance += step;
    }
    lastNavLatLng = newLatLng;

    // Update SOG, COG, Depth, Distance in HUD
    document.getElementById('hud-speed').textContent = speedKts.toFixed(1);
    document.getElementById('hud-cog').textContent = Math.round(headingDeg).toString().padStart(3, '0');
    
    const depth = getSimulatedDepth(lat, lng);
    document.getElementById('hud-depth').textContent = depth.toFixed(1);

    const distNM = navigationDistance / 1852;
    document.getElementById('hud-distance').textContent = distNM.toFixed(2) + " NM";

    // Relative wind arrow rotation (Simulating wind from WNW 290deg at 12 Kts)
    document.getElementById('hud-wind-val').textContent = "12 kts";
    const windArrow = document.getElementById('hud-wind-arrow');
    if (windArrow) {
      const relativeAngle = 290 - headingDeg;
      windArrow.style.transform = `rotate(${relativeAngle}deg)`;
    }

    // Auto-follow position in navigation mode if auto-center is active
    if (autoCenter && map) {
      map.panTo(newLatLng);
    }

    // Safety and proximity checks for warnings banner
    let warningText = null;
    const criticalDepth = boatProfile.draft + boatProfile.clearance;
    if (depth <= boatProfile.draft) {
      warningText = currentLang === 'fr' ? `⚠️ ÉCHOUEMENT PROCHE ! Sondeur: ${depth.toFixed(1)}m` : `⚠️ GROUNDING RISK! Depth: ${depth.toFixed(1)}m`;
    } else if (depth <= criticalDepth) {
      warningText = currentLang === 'fr' ? `⚠️ PROFONDEUR BASSE ! Sondeur: ${depth.toFixed(1)}m` : `⚠️ SHALLOW DEPTH! Depth: ${depth.toFixed(1)}m`;
    }

    if (!warningText) {
      const prox = checkDangerZoneProximity(lat, lng);
      if (prox.warningText) {
        warningText = `⚠️ ${prox.warningText}`;
      }
    }

    const banner = document.getElementById('danger-warning-banner');
    const bannerText = document.getElementById('danger-warning-text');
    if (warningText) {
      if (banner) banner.style.display = 'flex';
      if (bannerText) bannerText.textContent = warningText;
    } else {
      if (banner) banner.style.display = 'none';
    }
  }

  // Active tracking
  if (isTracking) {
    const windDir = currentWindDirection !== null ? currentWindDirection : 290;
    const allure = getPointOfSail(headingDeg, windDir);
    currentTrack.push({
      lat: lat,
      lng: lng,
      time: Date.now(),
      speed: speedKts,
      heading: headingDeg,
      windDir: windDir,
      pointOfSail: allure
    });
    trackLine.setLatLngs(currentTrack.map(p => [p.lat, p.lng]));
  }

  // Check alarm
  checkAnchorAlarm();
}

function startRouteTracking() {
  if (isTracking) return;
  isTracking = true;
  const windDir = currentWindDirection !== null ? currentWindDirection : 290;
  const allure = getPointOfSail(currentHeading, windDir);
  currentTrack = [{
    lat: currentLat,
    lng: currentLon,
    time: Date.now(),
    speed: currentSpeed,
    heading: currentHeading,
    windDir: windDir,
    pointOfSail: allure
  }];
  trackLine.setLatLngs(currentTrack.map(p => [p.lat, p.lng]));
  
  document.getElementById('track-status-text').textContent = translations[currentLang].active;
  document.getElementById('track-status-indicator').className = "status-indicator active";
  document.getElementById('start-track-btn').style.display = 'none';
  document.getElementById('stop-track-btn').style.display = 'inline-flex';

  const trackBadge = document.getElementById('status-track-badge');
  if (trackBadge) trackBadge.style.display = 'flex';

  const navRec = document.getElementById('nav-rec-indicator');
  if (navRec) navRec.style.display = 'inline-flex';
}

function stopRouteTracking() {
  if (!isTracking) return;
  isTracking = false;
  
  document.getElementById('track-status-text').textContent = translations[currentLang].inactive;
  document.getElementById('track-status-indicator').className = "status-indicator";
  document.getElementById('start-track-btn').style.display = 'inline-flex';
  document.getElementById('stop-track-btn').style.display = 'none';

  const trackBadge = document.getElementById('status-track-badge');
  if (trackBadge) trackBadge.style.display = 'none';

  const navRec = document.getElementById('nav-rec-indicator');
  if (navRec) navRec.style.display = 'none';

  if (currentTrack.length > 1) {
    const trackName = `Track ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Calculate speed metrics
    const speeds = currentTrack.map(p => p.speed || 0);
    const maxSpeed = Math.max(...speeds, 0);
    const avgSpeed = speeds.length > 0 ? (speeds.reduce((a, b) => a + b, 0) / speeds.length) : 0;
    
    // Calculate max distance to shelter
    const maxShelterDist = calculateMaxDistanceToShelter(currentTrack);

    // Calculate time spent in each point of sail
    const recap = {
      'Bout au vent': 0,
      'Près': 0,
      'Bon plein': 0,
      'Travers': 0,
      'Largue': 0,
      'Grand largue': 0,
      'Vent arrière': 0
    };
    
    for (let i = 0; i < currentTrack.length - 1; i++) {
      const ptCurrent = currentTrack[i];
      const ptNext = currentTrack[i+1];
      const durationMs = ptNext.time - ptCurrent.time;
      if (durationMs > 0 && durationMs < 600000) { // Gaps < 10 mins
        const pos = ptCurrent.pointOfSail || 'Bout au vent';
        if (recap[pos] !== undefined) {
          recap[pos] += durationMs;
        }
      }
    }

    const trackGeoJSON = {
      name: trackName,
      date: new Date().toISOString(),
      coordinates: currentTrack,
      distance: calculateTrackDistance(currentTrack),
      avgSpeed: avgSpeed,
      maxSpeed: maxSpeed,
      maxShelterDist: maxShelterDist,
      pointsOfSailRecap: recap
    };
    savedTracks.push(trackGeoJSON);
    localStorage.setItem('sirroco_saved_tracks', JSON.stringify(savedTracks));
    renderSavedTracks();
  }
}

function getCoordLatLng(coord) {
  if (!coord) return { lat: 0, lng: 0 };
  if (Array.isArray(coord)) {
    return { lat: coord[0], lng: coord[1] };
  }
  return { lat: coord.lat || 0, lng: coord.lng || 0 };
}

function calculateTrackDistance(coords) {
  let totalDist = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = getCoordLatLng(coords[i]);
    const p2 = getCoordLatLng(coords[i+1]);
    totalDist += calculateHaversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
  }
  return totalDist; // returns meters
}

function calculateMaxDistanceToShelter(coords) {
  if (!allHarborsCache || allHarborsCache.size === 0) return null;
  
  let maxMinDist = 0; // maximum of the minimum distances (meters)
  const harbors = Array.from(allHarborsCache.values());
  
  for (let i = 0; i < coords.length; i++) {
    const p = getCoordLatLng(coords[i]);
    let minDist = Infinity;
    
    for (let j = 0; j < harbors.length; j++) {
      const h = harbors[j];
      const dist = calculateHaversineDistance(p.lat, p.lng, h.lat, h.lng);
      if (dist < minDist) {
        minDist = dist;
      }
    }
    
    if (minDist !== Infinity && minDist > maxMinDist) {
      maxMinDist = minDist;
    }
  }
  
  return maxMinDist; // returns meters
}

function getPointOfSail(heading, windDir) {
  if (heading === null || windDir === null || heading === undefined || windDir === undefined) {
    return 'Bout au vent';
  }
  
  let diff = Math.abs(heading - windDir) % 360;
  if (diff > 180) {
    diff = 360 - diff;
  }
  
  if (diff < 35) {
    return 'Bout au vent';
  } else if (diff >= 35 && diff < 55) {
    return 'Près';
  } else if (diff >= 55 && diff < 80) {
    return 'Bon plein';
  } else if (diff >= 80 && diff < 110) {
    return 'Travers';
  } else if (diff >= 110 && diff < 145) {
    return 'Largue';
  } else if (diff >= 145 && diff < 165) {
    return 'Grand largue';
  } else {
    return 'Vent arrière';
  }
}

function formatDurationShort(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

window.exportTrackToGPX = function(index) {
  const track = savedTracks[index];
  if (!track) return;

  const name = track.name || `Track_${index}`;
  const dateStr = track.date || new Date().toISOString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<gpx version="1.1" creator="Sirroco Marine" xmlns="http://www.topografix.com/GPX/1/1" xmlns:sirroco="https://sirroco.app/gpx/1/0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n`;
  xml += `  <metadata>\n`;
  xml += `    <name>${escapeXml(name)}</name>\n`;
  xml += `    <time>${dateStr}</time>\n`;
  xml += `  </metadata>\n`;
  xml += `  <trk>\n`;
  xml += `    <name>${escapeXml(name)}</name>\n`;
  
  // Add global summary stats extensions
  xml += `    <extensions>\n`;
  if (track.distance !== undefined) {
    xml += `      <sirroco:distanceNM>${(track.distance / 1852).toFixed(2)}</sirroco:distanceNM>\n`;
  }
  if (track.avgSpeed !== undefined) {
    xml += `      <sirroco:avgSpeedKts>${track.avgSpeed.toFixed(2)}</sirroco:avgSpeedKts>\n`;
  }
  if (track.maxSpeed !== undefined) {
    xml += `      <sirroco:maxSpeedKts>${track.maxSpeed.toFixed(2)}</sirroco:maxSpeedKts>\n`;
  }
  if (track.maxShelterDist !== undefined && track.maxShelterDist !== null) {
    xml += `      <sirroco:maxShelterDistNM>${(track.maxShelterDist / 1852).toFixed(2)}</sirroco:maxShelterDistNM>\n`;
  }
  if (track.pointsOfSailRecap) {
    Object.entries(track.pointsOfSailRecap).forEach(([allure, ms]) => {
      if (ms > 0) {
        // Safe alphanumeric tag
        const tag = allure.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "");
        xml += `      <sirroco:duration${tag}Ms>${ms}</sirroco:duration${tag}Ms>\n`;
      }
    });
  }
  xml += `    </extensions>\n`;
  
  xml += `    <trkseg>\n`;

  track.coordinates.forEach(pt => {
    const latLng = getCoordLatLng(pt);
    xml += `      <trkpt lat="${latLng.lat.toFixed(6)}" lon="${latLng.lng.toFixed(6)}">\n`;
    if (pt.time) {
      xml += `        <time>${new Date(pt.time).toISOString()}</time>\n`;
    }
    
    const hasExtensions = (pt.speed !== undefined || pt.heading !== undefined || pt.windDir !== undefined || pt.pointOfSail !== undefined);
    if (hasExtensions) {
      xml += `        <extensions>\n`;
      if (pt.speed !== undefined) {
        // standard speed is in m/s
        const speedMs = pt.speed * 0.514444;
        xml += `          <speed>${speedMs.toFixed(2)}</speed>\n`;
        xml += `          <sirroco:speedKts>${pt.speed.toFixed(1)}</sirroco:speedKts>\n`;
      }
      if (pt.heading !== undefined) {
        xml += `          <sirroco:heading>${Math.round(pt.heading)}</sirroco:heading>\n`;
      }
      if (pt.windDir !== undefined) {
        xml += `          <sirroco:windDir>${Math.round(pt.windDir)}</sirroco:windDir>\n`;
      }
      if (pt.pointOfSail !== undefined) {
        xml += `          <sirroco:pointOfSail>${escapeXml(pt.pointOfSail)}</sirroco:pointOfSail>\n`;
      }
      xml += `        </extensions>\n`;
    }
    xml += `      </trkpt>\n`;
  });

  xml += `    </trkseg>\n`;
  xml += `  </trk>\n`;
  xml += `</gpx>`;

  const blob = new Blob([xml], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

window.deleteTrack = function(index) {
  if (confirm(currentLang === 'fr' ? 'Supprimer cette trace ?' : 'Delete this track?')) {
    savedTracks.splice(index, 1);
    localStorage.setItem('sirroco_saved_tracks', JSON.stringify(savedTracks));
    renderSavedTracks();
  }
};

function renderSavedTracks() {
  const container = document.getElementById('history-list');
  container.innerHTML = '';

  if (savedTracks.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;" data-i18n="no_tracks">${translations[currentLang].no_tracks}</p>`;
    return;
  }

  // Language translation keys fallbacks
  const avgSpeedLabel = translations[currentLang].avg_speed || translations['en'].avg_speed;
  const maxSpeedLabel = translations[currentLang].max_speed || translations['en'].max_speed;
  const maxShelterLabel = translations[currentLang].max_shelter_dist || translations['en'].max_shelter_dist;

  savedTracks.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const distNM = (track.distance / 1852).toFixed(2);
    
    // Fallback for speed metrics if they don't exist (e.g. old format tracks)
    const avgSpeed = track.avgSpeed !== undefined ? track.avgSpeed.toFixed(1) : '--';
    const maxSpeed = track.maxSpeed !== undefined ? track.maxSpeed.toFixed(1) : '--';
    
    // Fallback for shelter distance
    let shelterDistStr = '--';
    if (track.maxShelterDist !== undefined && track.maxShelterDist !== null) {
      shelterDistStr = `${(track.maxShelterDist / 1852).toFixed(2)} NM`;
    }
    
    let alluresHtml = '';
    if (track.pointsOfSailRecap) {
      const recap = track.pointsOfSailRecap;
      const totalMs = Object.values(recap).reduce((sum, val) => sum + val, 0);
      
      if (totalMs > 0) {
        let rowsHtml = '';
        Object.entries(recap).forEach(([allure, ms]) => {
          if (ms > 0) {
            const pct = (ms / totalMs) * 100;
            const durationText = formatDurationShort(ms);
            
            let displayAllureName = allure;
            if (currentLang === 'en') {
              const engNames = {
                'Bout au vent': 'Head to Wind',
                'Près': 'Close-hauled',
                'Bon plein': 'Full and by',
                'Travers': 'Beam Reach',
                'Largue': 'Broad Reach',
                'Grand largue': 'Training Run',
                'Vent arrière': 'Running'
              };
              displayAllureName = engNames[allure] || allure;
            } else if (currentLang === 'es') {
              const espNames = {
                'Bout au vent': 'Proa al viento',
                'Près': 'Ceñida',
                'Bon plein': 'Buen viaje',
                'Travers': 'Través',
                'Largue': 'Largo',
                'Grand largue': 'Aleta',
                'Vent arrière': 'Empopada'
              };
              displayAllureName = espNames[allure] || allure;
            }
            
            rowsHtml += `
              <div class="allure-row">
                <div class="allure-label-row">
                  <span class="allure-name">⛵ ${displayAllureName}</span>
                  <span class="allure-value">${pct.toFixed(0)}% (${durationText})</span>
                </div>
                <div class="allure-progress-bar">
                  <div class="allure-progress-fill" style="width: ${pct}%"></div>
                </div>
              </div>
            `;
          }
        });
        
        if (rowsHtml) {
          const title = currentLang === 'fr' ? 'Allures (Récap)' : (currentLang === 'es' ? 'Rumbos de Vela' : 'Points of Sail');
          alluresHtml = `
            <div class="allures-recap-container">
              <div class="allures-recap-title">${title} :</div>
              ${rowsHtml}
            </div>
          `;
        }
      }
    }
    
    item.innerHTML = `
      <div class="history-info" style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <span class="history-name">${track.name}</span>
          <div style="display: flex; gap: 0.35rem;">
            <button class="icon-btn compact-btn" onclick="showTrackOnMap(${index})" title="Zoom / Afficher">
              <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            <button class="icon-btn compact-btn" onclick="exportTrackToGPX(${index})" title="Export GPX">
              <svg viewBox="0 0 24 24" style="fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            </button>
            <button class="icon-btn compact-btn btn-danger-hover" onclick="deleteTrack(${index})" title="Supprimer">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        <div class="history-metrics-grid">
          <div>📏 Dist: <span class="metric-val">${distNM} NM</span></div>
          <div>⏱️ ${avgSpeedLabel}: <span class="metric-val">${avgSpeed} kts</span></div>
          <div>⚡ ${maxSpeedLabel}: <span class="metric-val">${maxSpeed} kts</span></div>
          <div>🛡️ ${maxShelterLabel}: <span class="metric-val">${shelterDistStr}</span></div>
        </div>
        ${alluresHtml}
      </div>
    `;
    container.appendChild(item);
  });
}

window.showTrackOnMap = function(index) {
  const track = savedTracks[index];
  if (!track) return;
  
  // Plot line mapping coordinates to ensure compat with object structures
  const latLngs = track.coordinates.map(p => {
    const c = getCoordLatLng(p);
    return [c.lat, c.lng];
  });
  const historyLine = L.polyline(latLngs, { color: '#ef4444', weight: 3, dashArray: '5, 5' }).addTo(map);
  map.fitBounds(historyLine.getBounds());
  autoCenter = false;
  updateRecenterButtonUI();
  
  // Visual removal after 10s or user zoom change
  setTimeout(() => {
    map.removeLayer(historyLine);
  }, 12000);
};

function clearHistory() {
  savedTracks = [];
  localStorage.setItem('sirroco_saved_tracks', JSON.stringify(savedTracks));
  renderSavedTracks();
}

// 7. GPS Simulator
function toggleSimulator(active) {
  isSimulating = active;
  
  const statusText = document.getElementById('sim-status-text-modal');
  const controlsCard = document.getElementById('sim-controls-modal');
  const toggle = document.getElementById('simulator-toggle-modal');

  if (isSimulating) {
    if (statusText) statusText.textContent = translations[currentLang].sim_active;
    if (controlsCard) controlsCard.style.display = 'flex';
    if (toggle) toggle.checked = true;
    
    // Stop Real Geolocation
    stopRealGPS();
    
    // Start Simulation Loop
    startSimLoop();
  } else {
    if (statusText) statusText.textContent = translations[currentLang].sim_inactive;
    if (controlsCard) controlsCard.style.display = 'none';
    if (toggle) toggle.checked = false;
    
    stopSimLoop();
    
    // Start Real Geolocation
    startRealGPS();
  }
}

function startSimLoop() {
  if (simTimer) return;
  simTimer = setInterval(() => {
    // Calculate new position based on speed and heading
    // 1 knot = 1.852 km/h = 0.514444 m/s
    const dt = 1; // 1 second
    const speedMs = simSpeed * 0.514444;
    const distanceMeters = speedMs * dt;
    
    const bearingRad = (simHeading * Math.PI) / 180;
    
    // Very simple flat projection for small movement:
    // 1 degree latitude = 111,111 meters
    // 1 degree longitude = 111,111 * cos(lat) meters
    const deltaLat = (distanceMeters * Math.cos(bearingRad)) / 111111;
    const deltaLon = (distanceMeters * Math.sin(bearingRad)) / (111111 * Math.cos(currentLat * Math.PI / 180));
    
    let nextLat = currentLat + deltaLat;
    let nextLon = currentLon + deltaLon;
    
    updatePosition(nextLat, nextLon, simSpeed, simHeading);
  }, 1000);
}

function stopSimLoop() {
  if (simTimer) {
    clearInterval(simTimer);
    simTimer = null;
  }
}

let realWatchId = null;
function startRealGPS() {
  if ("geolocation" in navigator) {
    realWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = position.coords;
        // speed is in m/s, convert to knots
        const speedKts = coords.speed ? (coords.speed * 1.94384) : 0;
        const headingDeg = coords.heading ? coords.heading : 0;
        updatePosition(coords.latitude, coords.longitude, speedKts, headingDeg);
      },
      (error) => {
        console.error("GPS Watch error: ", error);
        // Fallback to simulation
        alert("GPS Signal failed. Switched to Simulation Mode.");
        const toggle = document.getElementById('simulator-toggle-modal');
        if (toggle) toggle.checked = true;
        toggleSimulator(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    alert("Geolocation API not supported. Switched to Simulation Mode.");
    const toggle = document.getElementById('simulator-toggle-modal');
    if (toggle) toggle.checked = true;
    toggleSimulator(true);
  }
}

function stopRealGPS() {
  if (realWatchId !== null) {
    navigator.geolocation.clearWatch(realWatchId);
    realWatchId = null;
  }
}

function triggerSimulatorDrift() {
  isDrifting = true;
  simSpeed = 8.0; // speed up
  simHeading = 180; // drift south directly away from anchor
  
  const speedVal = document.getElementById('sim-speed-val-modal');
  const speedSlider = document.getElementById('sim-speed-slider-modal');
  const headingVal = document.getElementById('sim-heading-val-modal');
  const headingSlider = document.getElementById('sim-heading-slider-modal');

  if (speedVal) speedVal.textContent = '8.0';
  if (speedSlider) speedSlider.value = '8.0';
  if (headingVal) headingVal.textContent = '180';
  if (headingSlider) headingSlider.value = '180';
}

// 8. Real Weather & Tide Calculations & Drawing
let lastFetchedLat = null;
let lastFetchedLon = null;
let weatherDebounceTimeout = null;
let currentTideData = null;

function getWindCardinal(degrees) {
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return cardinals[index];
}

function getTideRangeForCoords(lat, lon) {
  // Mediterranean Sea: tiny tides (0.15m - 0.35m)
  if (lat >= 30 && lat <= 46 && lon >= -6 && lon <= 36) {
    return 0.3;
  }
  // English Channel & North Sea: huge tides!
  if (lat >= 48.2 && lat <= 58 && lon >= -6 && lon <= 9) {
    const distToStMalo = calculateHaversineDistance(lat, lon, 48.64, -2.02);
    if (distToStMalo < 120000) { // within 120km of St Malo
      return 11.5;
    }
    return 6.5;
  }
  // French & Iberian Atlantic: medium-high tides
  if (lat >= 36 && lat <= 48.2 && lon >= -10 && lon <= -1) {
    return 4.2;
  }
  // Baltic Sea: very small tides
  if (lat >= 53 && lat <= 70 && lon >= 9 && lon <= 30) {
    return 0.15;
  }
  // US East Coast / Atlantic: medium
  if (lat >= 25 && lat <= 48 && lon >= -85 && lon <= -65) {
    return 2.2;
  }
  // US West Coast / Pacific: medium
  if (lat >= 30 && lat <= 60 && lon >= -130 && lon <= -115) {
    return 2.6;
  }
  // Default ocean range
  return 2.0;
}

function calculateTidesForDay(lat, lon, date) {
  const baseRange = getTideRangeForCoords(lat, lon);

  // 1. Calculate moon age (days since new moon)
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceNewMoon = ((date.getTime() - knownNewMoon.getTime()) / msPerDay) % 29.530588853;

  // Spring/Neap coefficient (vive-eau / morte-eau)
  const springNeapFactor = 0.85 + 0.35 * Math.cos(2 * Math.PI * (daysSinceNewMoon % 14.765294) / 14.765294);
  const tideCoefficient = Math.round(20 + 100 * ((springNeapFactor - 0.5) / 0.8));

  // 2. High tide phase shift.
  const longitudeOffsetHours = -lon / 15.0; // 15 deg = 1h
  
  // Calculate first high tide time of the day
  let rawHighTideHour = (daysSinceNewMoon * 0.835 + longitudeOffsetHours + 2.5) % 12.4206;
  if (rawHighTideHour < 0) rawHighTideHour += 12.4206;

  // Generate hourly samples (48 points, every 30 minutes)
  const samples = [];
  const amplitude = (baseRange / 2) * springNeapFactor;
  const meanLevel = baseRange / 2 + 0.1;
  
  for (let i = 0; i <= 48; i++) {
    const decimalHour = i * 0.5;
    const height = meanLevel + amplitude * Math.cos(2 * Math.PI * (decimalHour - rawHighTideHour) / 12.4206);
    samples.push({
      hour: decimalHour,
      height: Math.max(0.01, height)
    });
  }

  // 3. Find high tides and low tides in the 24-hour period
  const extremes = [];
  for (let i = 1; i < samples.length - 1; i++) {
    const prev = samples[i-1].height;
    const curr = samples[i].height;
    const next = samples[i+1].height;
    
    if (curr > prev && curr > next) {
      extremes.push({
        type: 'high',
        hour: samples[i].hour,
        height: curr
      });
    } else if (curr < prev && curr < next) {
      extremes.push({
        type: 'low',
        hour: samples[i].hour,
        height: curr
      });
    }
  }
  
  const formatTime = (decimalHour) => {
    const h = Math.floor(decimalHour);
    const m = Math.round((decimalHour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const formattedExtremes = extremes.map(e => ({
    type: e.type,
    timeStr: formatTime(e.hour),
    hour: e.hour,
    height: e.height
  }));

  // Calculate current tide height for the current time
  const now = new Date();
  const currentDecimalHour = now.getHours() + now.getMinutes() / 60;
  const currentHeight = meanLevel + amplitude * Math.cos(2 * Math.PI * (currentDecimalHour - rawHighTideHour) / 12.4206);

  return {
    range: baseRange * springNeapFactor,
    coefficient: tideCoefficient,
    samples: samples,
    extremes: formattedExtremes,
    currentHeight: Math.max(0.01, currentHeight),
    currentHour: currentDecimalHour
  };
}

function updateWeatherUI(weatherData, marineData) {
  const curWeather = weatherData.current;
  const curMarine = marineData ? marineData.current : null;

  // Wind speed
  const windSpeedEl = document.getElementById('weather-wind-speed');
  if (windSpeedEl && curWeather.wind_speed_10m !== undefined) {
    windSpeedEl.textContent = `${Math.round(curWeather.wind_speed_10m)} Kts`;
  }

  // Wind Dir
  const windDirEl = document.getElementById('weather-wind-dir');
  const windArrow = document.getElementById('weather-wind-arrow');
  if (curWeather.wind_direction_10m !== undefined) {
    currentWindDirection = curWeather.wind_direction_10m;
    if (windDirEl) windDirEl.textContent = getWindCardinal(curWeather.wind_direction_10m);
    if (windArrow) {
      windArrow.style.transform = `rotate(${curWeather.wind_direction_10m + 180}deg)`;
    }
    // Update boat sails dynamically when wind data changes
    updateBoatSails(currentHeading, currentWindDirection);
  }

  // Wind Gusts
  const windGustsEl = document.getElementById('weather-wind-gusts');
  if (windGustsEl && curWeather.wind_gusts_10m !== undefined) {
    windGustsEl.textContent = `${Math.round(curWeather.wind_gusts_10m)} Kts`;
  }

  // Barometer
  const baroEl = document.getElementById('weather-barometer');
  if (baroEl && curWeather.pressure_msl !== undefined) {
    baroEl.textContent = `${Math.round(curWeather.pressure_msl)} hPa`;
  }

  // Temperature
  const tempEl = document.getElementById('weather-temp');
  if (tempEl && curWeather.temperature_2m !== undefined) {
    tempEl.textContent = `${curWeather.temperature_2m.toFixed(1)} °C`;
  }

  // Wave Height
  const waveHeightEl = document.getElementById('weather-wave-height');
  if (waveHeightEl) {
    if (curMarine && curMarine.wave_height !== null && curMarine.wave_height !== undefined) {
      waveHeightEl.textContent = `${curMarine.wave_height.toFixed(2)} m`;
    } else {
      waveHeightEl.textContent = '--';
    }
  }

  // Wave Dir
  const waveDirEl = document.getElementById('weather-wave-dir');
  const waveArrow = document.getElementById('weather-wave-arrow');
  if (waveDirEl) {
    if (curMarine && curMarine.wave_direction !== null && curMarine.wave_direction !== undefined) {
      waveDirEl.textContent = getWindCardinal(curMarine.wave_direction);
      if (waveArrow) {
        waveArrow.style.display = 'inline-block';
        waveArrow.style.transform = `rotate(${curMarine.wave_direction + 180}deg)`;
      }
    } else {
      waveDirEl.textContent = '--';
      if (waveArrow) waveArrow.style.display = 'none';
    }
  }

  // Wave Period
  const wavePeriodEl = document.getElementById('weather-wave-period');
  if (wavePeriodEl) {
    if (curMarine && curMarine.wave_period !== null && curMarine.wave_period !== undefined) {
      wavePeriodEl.textContent = `${Math.round(curMarine.wave_period)} s`;
    } else {
      wavePeriodEl.textContent = '--';
    }
  }
}

// Dynamic sail trimming simulator based on heading and relative wind direction
function updateBoatSails(heading, windDir) {
  const mainsail = document.getElementById('boat-mainsail');
  const jib = document.getElementById('boat-jib');
  if (!mainsail || !jib) return;

  if (windDir === null || windDir === undefined || isNaN(windDir)) {
    // Default sail setting (beam reach on port tack) when wind is not loaded
    mainsail.style.transform = 'rotate(30deg)';
    jib.style.transform = 'rotate(35deg)';
    mainsail.classList.remove('sail-flutter');
    jib.classList.remove('sail-flutter');
    return;
  }

  // Calculate apparent wind angle relative to boat bow (0 is head-to-wind, 180/-180 is tailwind)
  let alpha = (windDir - heading) % 360;
  if (alpha > 180) alpha -= 360;
  if (alpha < -180) alpha += 360;

  const absAlpha = Math.abs(alpha);
  // Sails swing to the opposite side of the wind
  // wind from starboard (alpha > 0) -> sails swing to port/left (negative degrees)
  // wind from port (alpha < 0) -> sails swing to starboard/right (positive degrees)
  const side = alpha >= 0 ? -1 : 1;

  let mainAngle = 0;
  let jibAngle = 0;
  let isFluttering = false;

  if (absAlpha < 30) {
    // Head to wind: sails flapping in the centerline
    mainAngle = 0;
    jibAngle = 0;
    isFluttering = true;
  } else if (absAlpha < 55) {
    // Close-hauled: sails trimmed tight
    mainAngle = side * 10;
    jibAngle = side * 15;
  } else if (absAlpha < 110) {
    // Beam reach: sails opened halfway
    mainAngle = side * 30;
    jibAngle = side * 35;
  } else if (absAlpha < 155) {
    // Broad reach: sails opened wide
    mainAngle = side * 55;
    jibAngle = side * 60;
  } else {
    // Running (downwind): sails wing-on-wing
    mainAngle = side * 75;
    jibAngle = -side * 70; // Jib is trimmed to the opposite side!
  }

  mainsail.style.transform = `rotate(${mainAngle}deg)`;
  jib.style.transform = `rotate(${jibAngle}deg)`;

  if (isFluttering) {
    mainsail.classList.add('sail-flutter');
    jib.classList.add('sail-flutter');
  } else {
    mainsail.classList.remove('sail-flutter');
    jib.classList.remove('sail-flutter');
  }
}

async function updateWeatherAndTides(lat, lon, force = false) {
  if (!force && lastFetchedLat !== null && lastFetchedLon !== null) {
    const dist = calculateHaversineDistance(lat, lon, lastFetchedLat, lastFetchedLon);
    if (dist < 150) {
      return;
    }
  }

  lastFetchedLat = lat;
  lastFetchedLon = lon;

  const loadingIndicator = document.getElementById('weather-loading');
  const locationEl = document.getElementById('weather-location');

  if (loadingIndicator) loadingIndicator.style.display = 'inline-block';
  if (locationEl) {
    locationEl.textContent = currentLang === 'fr' ? 'Recherche de la position...' : 'Searching location...';
  }

  try {
    let locationName = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
    
    // Reverse Geocoding via Nominatim with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=${currentLang}`;
      const geoRes = await fetch(geoUrl, {
        headers: { 'User-Agent': 'SirrocoMarineNavigation/1.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.address) {
          const addr = geoData.address;
          const place = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || addr.country;
          if (place) {
            locationName = place;
            if (addr.country && addr.country !== place) {
              locationName += `, ${addr.country}`;
            }
          } else if (geoData.display_name) {
            locationName = geoData.display_name.split(',').slice(0, 2).join(',');
          }
        }
      }
    } catch (err) {
      console.warn("Nominatim geocoding failed/timed out:", err);
    }

    if (locationEl) locationEl.textContent = locationName;

    // Update tide title
    const tideTitle = document.getElementById('tide-title');
    if (tideTitle) {
      const titleSpan = tideTitle.querySelector('span[data-i18n="tide_lbl"]') || tideTitle;
      const baseTitle = currentLang === 'fr' ? 'Prédiction Marée' : 'Tide Forecast';
      titleSpan.textContent = `${baseTitle} (${locationName.split(',')[0]})`;
    }

    // Fetch Weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Weather API failed");
    const weatherData = await weatherRes.json();

    // Fetch Marine waves from Open-Meteo
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period&timezone=auto`;
    let marineData = null;
    try {
      const marineRes = await fetch(marineUrl);
      if (marineRes.ok) {
        marineData = await marineRes.json();
      }
    } catch (e) {
      console.warn("Marine waves fetch failed:", e);
    }

    updateWeatherUI(weatherData, marineData);

    // Calculate & draw tides
    const date = new Date();
    const tideData = calculateTidesForDay(lat, lon, date);
    currentTideData = tideData;
    drawTideChart(lat, lon, tideData);

  } catch (error) {
    console.error("Error fetching weather/tides:", error);
    if (locationEl) {
      locationEl.textContent = currentLang === 'fr' ? 'Données indisponibles (Hors-ligne)' : 'Data unavailable (Offline)';
    }
    // Draw tide curve with calculated simulation anyway
    const date = new Date();
    const tideData = calculateTidesForDay(lat, lon, date);
    currentTideData = tideData;
    drawTideChart(lat, lon, tideData);
  } finally {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }
}

function onMapMove() {
  if (appMode !== 'weather') return;
  
  if (weatherDebounceTimeout) clearTimeout(weatherDebounceTimeout);
  weatherDebounceTimeout = setTimeout(() => {
    if (map) {
      const center = map.getCenter();
      updateWeatherAndTides(center.lat, center.lng);
    }
  }, 500);
}

function onMapMoveHarbors() {
  if (harborsDebounceTimeout) clearTimeout(harborsDebounceTimeout);
  harborsDebounceTimeout = setTimeout(() => {
    fetchHarborsInViewport();
  }, 600);
}

function drawTideChart(lat, lon, tideData) {
  const container = document.getElementById('tide-widget-content');
  if (!container) return;

  if (!tideData) {
    const targetLat = lat !== undefined ? lat : currentLat;
    const targetLon = lon !== undefined ? lon : currentLon;
    tideData = calculateTidesForDay(targetLat, targetLon, new Date());
  }

  const rangeBadge = document.getElementById('tide-range-badge');
  if (rangeBadge) {
    const coefText = currentLang === 'fr' ? `Coef: ${tideData.coefficient}` : `Coef: ${tideData.coefficient}`;
    const rangeText = currentLang === 'fr' ? `Marnage: ${tideData.range.toFixed(2)}m` : `Range: ${tideData.range.toFixed(2)}m`;
    rangeBadge.textContent = `${rangeText} | ${coefText}`;
  }

  let maxHeight = 0.1;
  let minHeight = 99999;
  tideData.samples.forEach(s => {
    if (s.height > maxHeight) maxHeight = s.height;
    if (s.height < minHeight) minHeight = s.height;
  });

  const heightDiff = maxHeight - minHeight;
  const yMax = maxHeight + Math.max(0.1, heightDiff * 0.1);
  const yMin = Math.max(0, minHeight - Math.max(0.1, heightDiff * 0.1));
  const yScaleRange = yMax - yMin;

  const getX = (hour) => 15 + (hour / 24) * 270;
  const getY = (height) => 85 - ((height - yMin) / yScaleRange) * 70;

  let curvePath = "";
  tideData.samples.forEach((s, idx) => {
    const x = getX(s.hour);
    const y = getY(s.height);
    if (idx === 0) {
      curvePath += `M ${x},${y}`;
    } else {
      curvePath += ` L ${x},${y}`;
    }
  });

  const curX = getX(tideData.currentHour);
  const curY = getY(tideData.currentHeight);

  let extremesHtml = "";
  tideData.extremes.forEach(e => {
    const x = getX(e.hour);
    const y = getY(e.height);
    const isHigh = e.type === 'high';
    const label = isHigh ? (currentLang === 'fr' ? 'PM' : 'HW') : (currentLang === 'fr' ? 'BM' : 'LW');
    const yOffset = isHigh ? -10 : 12;
    const colorClass = isHigh ? "var(--warning-color)" : "var(--text-muted)";
    extremesHtml += `
      <circle cx="${x}" cy="${y}" r="3.5" fill="${colorClass}" />
      <text x="${x}" y="${y + yOffset}" fill="var(--text-light)" font-size="7" font-weight="600" text-anchor="middle">
        ${label}: ${e.height.toFixed(2)}m (${e.timeStr})
      </text>
    `;
  });

  let gridLines = "";
  for (let h = 3; h < 24; h += 3) {
    const x = getX(h);
    gridLines += `
      <line x1="${x}" y1="10" x2="${x}" y2="90" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
      <text x="${x}" y="98" fill="var(--text-muted)" font-size="6.5" text-anchor="middle">${h}h</text>
    `;
  }

  const badgeX = Math.min(230, Math.max(10, curX - 30));
  const badgeY = curY < 50 ? curY + 15 : curY - 28;

  container.innerHTML = `
    <svg width="100%" height="110" viewBox="0 0 300 110" style="overflow: visible; user-select: none;">
      <line x1="15" y1="90" x2="285" y2="90" stroke="var(--border-color)" stroke-width="1" />
      <text x="15" y="98" fill="var(--text-muted)" font-size="6.5" text-anchor="middle">0h</text>
      <text x="285" y="98" fill="var(--text-muted)" font-size="6.5" text-anchor="middle">24h</text>
      ${gridLines}

      <path d="${curvePath}" fill="none" stroke="var(--accent-color)" stroke-width="2.5" stroke-linecap="round" />
      
      ${extremesHtml}
      
      <line x1="${curX}" y1="10" x2="${curX}" y2="90" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.5" stroke-dasharray="3,3" />
      <circle cx="${curX}" cy="${curY}" r="5" fill="var(--warning-color)" stroke="var(--surface-color)" stroke-width="1" />
      
      <g transform="translate(${badgeX}, ${badgeY})">
        <rect x="0" y="0" width="60" height="18" rx="4" fill="rgba(11, 15, 25, 0.85)" stroke="var(--accent-color)" stroke-width="1" />
        <text x="30" y="12" fill="var(--accent-color)" font-size="8" font-weight="800" text-anchor="middle">${tideData.currentHeight.toFixed(2)} m</text>
      </g>
    </svg>
  `;
}

// 8.5 Danger Zone Sidebar Rendering
function renderZoneList() {
  const container = document.getElementById('zone-list-container');
  if (!container) return;

  const typeConfig = {
    'military_firing':       { icon: '💣', color: '#ef4444', label: 'Tir militaire' },
    'military_restricted':   { icon: '⛔', color: '#f97316', label: 'Zone restreinte' },
    'nato_exercise':         { icon: '🔵', color: '#a855f7', label: 'Exercice OTAN' },
    'anchoring_prohibited':  { icon: '⚓', color: '#eab308', label: 'Mouillage interdit' },
    'restricted_navigation': { icon: '🚫', color: '#3b82f6', label: 'Navigation restreinte' },
  };

  const features = dangerZoneGeoJSON.features || [];
  container.innerHTML = features.map((f) => {
    const p = f.properties;
    const cfg = typeConfig[p.type] || { icon: '⚠️', color: '#ef4444', label: p.type };
    const statusLabel = p.status === 'permanent' ? '🔴 Permanent' : '🟡 Périodique';
    const statusBg = p.status === 'permanent' ? `rgba(${hexToRgb(cfg.color)}, 0.15)` : 'rgba(234,179,8,0.1)';
    const statusBorder = p.status === 'permanent' ? cfg.color : '#eab308';
    const statusTextColor = p.status === 'permanent' ? cfg.color : '#ca8a04';

    return `
      <div class="card zone-item" style="margin-bottom: 0.5rem; border-left: 3px solid ${cfg.color}; cursor: pointer;"
           onclick="zoomToZone(${JSON.stringify(f.geometry.coordinates[0])})">
        <div class="zone-header">
          <span class="zone-title" style="color: ${cfg.color};">${cfg.icon} ${p.name}</span>
          <div class="status-badge" style="background: ${statusBg}; border-color: ${statusBorder}; color: ${statusTextColor}; font-size: 0.65rem; white-space: nowrap;">${statusLabel}</div>
        </div>
        <p class="zone-desc" style="margin: 0.2rem 0 0.1rem;">${p.description}</p>
        <small style="color: var(--text-muted); font-size: 0.7rem;">🏛️ ${p.authority}</small>
      </div>
    `;
  }).join('');
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function zoomToZone(coords) {
  if (!map || !coords || !coords.length) return;
  const latLngs = coords.map(c => [c[1], c[0]]);
  map.fitBounds(L.latLngBounds(latLngs), { padding: [20, 20] });
  autoCenter = false;
  updateRecenterButtonUI();
  // Switch to map tab (Calques)
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const layersBtn = document.querySelector('[data-target="panel-layers"]');
  const layersPanel = document.getElementById('panel-layers');
  if (layersBtn) layersBtn.classList.add('active');
  if (layersPanel) layersPanel.classList.add('active');
}

// Dynamic Keel Depth simulation based on distance to Toulon harbor center (shoreline proximity)
function getSimulatedDepth(lat, lng) {
  const harborCenter = L.latLng(43.115, 5.93);
  const dist = calculateHaversineDistance(lat, lng, harborCenter.lat, harborCenter.lng);
  
  // Depth decreases near harbor/shore, increases out to open sea (south)
  let depth = 15.0 - 13.0 * Math.max(0, 1.0 - dist / 2500);
  if (depth < 1.2) depth = 1.2;
  return depth;
}

// Proximity checker to military/restricted danger zones
function checkDangerZoneProximity(lat, lng) {
  let warningText = null;
  let minDistance = Infinity;

  dangerZoneGeoJSON.features.forEach(feature => {
    const coords = feature.geometry.coordinates[0];
    const name = feature.properties.name;
    
    // Check bounding box
    const lats = coords.map(c => c[1]);
    const lngs = coords.map(c => c[0]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    let isInsideBBox = lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    
    // Check distance to all vertices
    coords.forEach(coord => {
      const dist = calculateHaversineDistance(lat, lng, coord[1], coord[0]);
      if (dist < minDistance) {
        minDistance = dist;
      }
    });

    if (isInsideBBox) {
      minDistance = 0;
      warningText = `DANGER : Dans ${name}`;
    }
  });

  // 0.5 NM is 926 meters
  if (!warningText && minDistance < 926) {
    warningText = `ZONE DANGER PROCHE : ${((minDistance / 1852).toFixed(2))} NM`;
  }

  return { warningText, minDistance };
}

// Display a status or helper message in the harbors sidebar list
function displayHarborMessage(msg) {
  const container = document.getElementById('harbors-list-container');
  if (container) {
    container.innerHTML = `
      <div style="padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.85rem; font-style: italic; line-height: 1.4;">
        ${msg}
      </div>
    `;
  }
}

// Clear markers and local active harbor list array
function clearHarborMarkers() {
  harborMarkers.forEach(m => {
    if (harborsLayer) harborsLayer.removeLayer(m);
  });
  harborMarkers = [];
  currentHarbors = [];
}

// Parse OSM elements, clean duplicate landmarks, merge properties and update local cache
function parseAndCacheHarbors(elements) {
  if (!elements) return;

  elements.forEach(el => {
    const tags = el.tags || {};
    // Extract a valid harbor name or bypass
    const name = tags.name || tags["name:fr"] || tags["name:en"];
    if (!name) return;

    const lat = el.lat || (el.center && el.center.lat);
    const lon = el.lon || (el.center && el.center.lon);
    if (!lat || !lon) return;

    // Contact details parsing
    const phone = tags["contact:phone"] || tags["phone"] || "-";
    const email = tags["contact:email"] || tags["email"] || "-";
    const website = tags["contact:website"] || tags["website"] || tags["url"] || "";
    
    // VHF radio channels
    const vhf = tags["communication:vhf"] || tags["vhf"] || tags["seamark:communication:vhf"] || tags["seamark:harbour:vhf"] || "-";
    
    // Berth capacities
    const berths = tags["capacity"] || tags["capacity:harbour"] || tags["harbour:capacity"] || tags["capacity:pleasure_boat"] || "-";
    
    // Draft & Length restrictions
    const maxDraft = parseFloat(tags["maxdraft"] || tags["draft_max"] || tags["seamark:harbour:max_draft"] || tags["seamark:harbour:draft_max"] || "0");
    const maxLength = parseFloat(tags["maxlength"] || tags["length_max"] || tags["seamark:harbour:max_length"] || "0");

    // Map boolean osm flags to localized amenities/services text list
    const servicesList = [];
    const isFr = (currentLang === 'fr');
    if (tags["fuel"] === "yes" || tags["fuel:marine"] === "yes" || tags["seamark:harbour:fuel"] === "yes") {
      servicesList.push(isFr ? "Carburant" : "Fuel");
    }
    if (tags["water"] === "yes" || tags["drinking_water"] === "yes" || tags["seamark:harbour:water"] === "yes") {
      servicesList.push(isFr ? "Eau douce" : "Fresh Water");
    }
    if (tags["electricity"] === "yes" || tags["power_supply"] === "yes") {
      servicesList.push(isFr ? "Électricité" : "Electricity");
    }
    if (tags["toilets"] === "yes" || tags["toilet"] === "yes") {
      servicesList.push(isFr ? "Toilettes" : "Toilets");
    }
    if (tags["shower"] === "yes" || tags["showers"] === "yes") {
      servicesList.push(isFr ? "Douches" : "Showers");
    }
    if (tags["waste_disposal"] === "yes" || tags["pump_out"] === "yes") {
      servicesList.push(isFr ? "Déchets" : "Waste Disposal");
    }
    if (tags["wifi"] === "yes" || tags["internet_access"] === "wlan") {
      servicesList.push("Wi-Fi");
    }
    const services = servicesList.join(', ') || "-";

    const info = tags["description"] || tags["note"] || "";

    const newHarbor = {
      name: name.trim(),
      lat,
      lng: lon,
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      address: "-",
      vhf: vhf.trim(),
      berths: berths.toString().trim(),
      maxLength: maxLength > 0 ? maxLength : null,
      maxDraft: maxDraft > 0 ? maxDraft : null,
      services,
      info: info.trim()
    };

    // Build physical address line from individual OSM address tags
    const street = tags["addr:street"] || "";
    const housenumber = tags["addr:housenumber"] || "";
    const postcode = tags["addr:postcode"] || "";
    const city = tags["addr:city"] || "";
    let address = tags["addr:full"] || "";
    if (!address) {
      const parts = [];
      if (housenumber || street) parts.push(`${housenumber} ${street}`.trim());
      if (postcode || city) parts.push(`${postcode} ${city}`.trim());
      address = parts.join(', ') || "-";
    }
    newHarbor.address = address.trim();

    // Deduplicate: check if there's an existing cache record with same name within 1 km
    let existingHarbor = null;
    let existingKey = null;
    for (let [key, val] of allHarborsCache.entries()) {
      if (val.name.toLowerCase() === newHarbor.name.toLowerCase()) {
        const dist = calculateHaversineDistance(newHarbor.lat, newHarbor.lng, val.lat, val.lng);
        if (dist < 1000) {
          existingHarbor = val;
          existingKey = key;
          break;
        }
      }
    }

    if (existingHarbor) {
      // Merge values, keeping the most detailed parameters
      if (existingHarbor.phone === '-' && newHarbor.phone !== '-') existingHarbor.phone = newHarbor.phone;
      if (existingHarbor.email === '-' && newHarbor.email !== '-') existingHarbor.email = newHarbor.email;
      if (!existingHarbor.website && newHarbor.website) existingHarbor.website = newHarbor.website;
      if (existingHarbor.vhf === '-' && newHarbor.vhf !== '-') existingHarbor.vhf = newHarbor.vhf;
      if (existingHarbor.berths === '-' && newHarbor.berths !== '-') existingHarbor.berths = newHarbor.berths;
      if (existingHarbor.address === '-' && newHarbor.address !== '-') existingHarbor.address = newHarbor.address;
      if (!existingHarbor.maxLength && newHarbor.maxLength) existingHarbor.maxLength = newHarbor.maxLength;
      if (!existingHarbor.maxDraft && newHarbor.maxDraft) existingHarbor.maxDraft = newHarbor.maxDraft;
      if (newHarbor.services !== '-') {
        existingHarbor.services = existingHarbor.services !== '-' ? 
          Array.from(new Set([...existingHarbor.services.split(', '), ...newHarbor.services.split(', ')])).join(', ') : 
          newHarbor.services;
      }
      if (!existingHarbor.info && newHarbor.info) existingHarbor.info = newHarbor.info;
    } else {
      const uniqueKey = `${el.type}-${el.id}`;
      allHarborsCache.set(uniqueKey, newHarbor);
    }
  });
}

// Update currentHarbors from global map cache filtering by the map bounds
function updateCurrentHarborsFromCache(bounds) {
  const viewportHarbors = [];
  allHarborsCache.forEach(harbor => {
    if (bounds.contains([harbor.lat, harbor.lng])) {
      viewportHarbors.push(harbor);
    }
  });

  // Sort alphabetically
  viewportHarbors.sort((a, b) => a.name.localeCompare(b.name));
  currentHarbors = viewportHarbors;
  renderHarborListAndMarkers();
}

// Query OSM Overpass API for harbors within current map view coordinates
async function fetchHarborsInViewport() {
  if (!map) return;

  const layerHarbors = document.getElementById('layer-harbors');
  if (layerHarbors && !layerHarbors.checked) {
    displayHarborMessage(currentLang === 'fr' ? "Activez le calque 'Ports de plaisance' pour voir la liste." : "Enable 'Marinas' layer to see the list.");
    clearHarborMarkers();
    return;
  }

  const zoom = map.getZoom();
  if (zoom < 11) {
    const zoomPrompt = translations[currentLang]?.harbor_zoom_prompt || translations.en.harbor_zoom_prompt;
    displayHarborMessage(zoomPrompt);
    clearHarborMarkers();
    return;
  }

  const bounds = map.getBounds();
  
  // Instantly draw from local cached data to avoid latency
  updateCurrentHarborsFromCache(bounds);

  // If already querying, let the existing fetch finish
  if (isFetchingHarbors) return;

  isFetchingHarbors = true;

  // Show loading indicator in sidebar list if we don't have cached harbors in view
  if (currentHarbors.length === 0) {
    const loadingText = translations[currentLang]?.harbor_loading || translations.en.harbor_loading;
    displayHarborMessage(loadingText);
  }

  const south = bounds.getSouth();
  const west = bounds.getWest();
  const north = bounds.getNorth();
  const east = bounds.getEast();
  const bbox = `${south},${west},${north},${east}`;

  const query = `[out:json][timeout:15];
(
  node["harbour"](${bbox});
  node["marina"](${bbox});
  node["seamark:type"="harbour"](${bbox});
  node["seamark:type"="marina"](${bbox});
  way["harbour"](${bbox});
  way["marina"](${bbox});
  way["seamark:type"="harbour"](${bbox});
  way["seamark:type"="marina"](${bbox});
);
out body center;`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Overpass request failed");
    const data = await res.json();

    parseAndCacheHarbors(data.elements);
    updateCurrentHarborsFromCache(bounds);
  } catch (err) {
    console.warn("OSM harbor search failed/offline:", err);
    // Offline / API error fallback: display whatever we have cached
    if (currentHarbors.length === 0) {
      displayHarborMessage(currentLang === 'fr' ? "Erreur de connexion aux données des ports." : "Error connecting to harbors database.");
    }
  } finally {
    isFetchingHarbors = false;
  }
}

// Render harbors on map and update sidebar list under Calques
function renderHarborListAndMarkers() {
  if (!map || !harborsLayer) return;

  // Clear previous markers
  harborMarkers.forEach(m => harborsLayer.removeLayer(m));
  harborMarkers = [];

  const listContainer = document.getElementById('harbors-list-container');
  if (listContainer) {
    listContainer.innerHTML = '';
  }

  if (currentHarbors.length === 0) {
    const noDataText = translations[currentLang]?.harbor_no_data || translations.en.harbor_no_data;
    displayHarborMessage(noDataText);
    return;
  }

  const t = translations[currentLang] || translations.en;
  
  const labelCapitainerie = t.harbor_capitainerie || "Capitainerie";
  const labelVHF = t.harbor_vhf || "VHF";
  const labelEmail = t.harbor_email || "Email";
  const labelAddress = t.harbor_address || "Adresse";
  const labelPlaces = t.harbor_places || "Places";
  const labelMaxLen = t.harbor_max_len || "Longueur Max";
  const labelMaxDraft = t.harbor_max_draft || "Tirant d'eau Max";
  const labelServices = t.harbor_services || "Services";
  const labelType = t.harbor_type || "Port de plaisance";

  currentHarbors.forEach((harbor, idx) => {
    // Check boat profile constraints
    const draftWarning = (harbor.maxDraft && boatProfile.draft > harbor.maxDraft);
    const lengthWarning = (harbor.maxLength && boatProfile.length > harbor.maxLength);

    const draftStyle = draftWarning ? "color: #ef4444; font-weight: 700;" : "";
    const lengthStyle = lengthWarning ? "color: #ef4444; font-weight: 700;" : "";
    
    const draftIcon = draftWarning ? "⚠️ " : "";
    const lengthIcon = lengthWarning ? "⚠️ " : "";

    const draftValText = harbor.maxDraft ? `${harbor.maxDraft.toFixed(1)} m` : "-";
    const lenValText = harbor.maxLength ? `${harbor.maxLength.toFixed(1)} m` : "-";

    // Build custom Leaflet DivIcon
    const borderCls = (draftWarning || lengthWarning) ? "#f97316" : "#06b6d4";
    const bgCls = (draftWarning || lengthWarning) ? "rgba(249, 115, 22, 0.15)" : "rgba(6, 182, 212, 0.15)";
    
    const harborIcon = L.divIcon({
      className: 'custom-harbor-marker',
      html: `
        <div style="background: ${bgCls}; border: 2.5px solid ${borderCls}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4); transition: all 0.3s ease;">
          <svg style="width: 16px; height: 16px; fill: none; stroke: ${borderCls}; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="3"/>
            <line x1="12" y1="8" x2="12" y2="20"/>
            <line x1="6" y1="12" x2="18" y2="12"/>
            <path d="M6 12c0 6 12 6 12 0"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    let websiteHtml = "";
    if (harbor.website) {
      websiteHtml = `<div><strong>🌐 Web:</strong> <a href="${harbor.website}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: none;">${harbor.website.replace(/^https?:\/\/(www\.)?/, '')}</a></div>`;
    }

    let warningHtml = "";
    if (draftWarning || lengthWarning) {
      const warnMsg = currentLang === 'fr' ? "⚠️ Dépasse les limites de votre bateau" : "⚠️ Exceeds your boat's limits";
      warningHtml = `<div style="color: #ef4444; font-size: 0.75rem; font-weight: 600; margin-top: 0.35rem; text-align: center;">${warnMsg}</div>`;
    }

    const infoText = harbor.info || (currentLang === 'fr' ? "Aucune information supplémentaire." : "No additional information.");

    const popupContent = `
      <div style="font-family: var(--font-family, sans-serif); min-width: 240px; color: var(--text-color); line-height: 1.4;">
        <strong style="font-size: 1.05rem; color: var(--accent-color);">⚓ ${harbor.name}</strong><br>
        <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">${labelType}</span>
        <hr style="margin: 6px 0; border-color: var(--border-color);">
        
        <div style="font-size: 0.85rem; margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.35rem;">
          <div><strong>📞 ${labelCapitainerie} :</strong> ${harbor.phone}</div>
          <div><strong>📡 ${labelVHF} :</strong> ${harbor.vhf}</div>
          ${harbor.email !== '-' ? `<div><strong>✉️ ${labelEmail} :</strong> <a href="mailto:${harbor.email}" style="color: var(--accent-color); text-decoration: none;">${harbor.email}</a></div>` : ''}
          ${websiteHtml}
          <div><strong>📍 ${labelAddress} :</strong> ${harbor.address}</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.5rem; font-size: 0.8rem; margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;"><span>${labelPlaces}:</span><strong>${harbor.berths}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;"><span>${labelMaxLen}:</span><strong style="${lengthStyle}">${lengthIcon}${lenValText}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;"><span>${labelMaxDraft}:</span><strong style="${draftStyle}">${draftIcon}${draftValText}</strong></div>
          <div style="border-top: 1px solid var(--border-color); padding-top: 0.3rem; margin-top: 0.3rem;">
            <strong>${labelServices} :</strong> ${harbor.services}
          </div>
          ${warningHtml}
        </div>
        
        <p style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-bottom: 0.2rem; line-height: 1.35;">
          ${infoText}
        </p>
      </div>
    `;

    const marker = L.marker([harbor.lat, harbor.lng], { icon: harborIcon }).bindPopup(popupContent, { maxWidth: 280 });
    marker.addTo(harborsLayer);
    harborMarkers.push(marker);

    // Sidebar list population
    if (listContainer) {
      const item = document.createElement('div');
      item.className = 'history-item';
      
      // Highlight sidebar item border in orange if boat constraints exceeded
      const borderTheme = (draftWarning || lengthWarning) ? "#f97316" : "var(--accent-color)";
      item.style.borderLeft = `3px solid ${borderTheme}`;
      
      const warnBadge = (draftWarning || lengthWarning) ? " ⚠️" : "";
      
      item.innerHTML = `
        <div class="history-info" onclick="zoomToHarbor(${idx})" style="cursor: pointer;">
          <div class="history-name" style="font-weight: 600;">${harbor.name}${warnBadge}</div>
          <div class="history-meta" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
            📞 ${harbor.phone} | 📡 ${labelVHF} ${harbor.vhf}
          </div>
        </div>
        <button class="icon-btn" onclick="zoomToHarbor(${idx})" title="Zoom / Infos">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </button>
      `;
      listContainer.appendChild(item);
    }
  });
}

// Zoom and focus on a selected harbor
window.zoomToHarbor = function(idx) {
  const harbor = currentHarbors[idx];
  const marker = harborMarkers[idx];
  if (!map || !harbor) return;
  map.setView([harbor.lat, harbor.lng], 15);
  if (marker) marker.openPopup();
  autoCenter = false;
  updateRecenterButtonUI();
  
  // Switch to map tab (Calques)
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const layersBtn = document.querySelector('[data-target="panel-layers"]');
  const layersPanel = document.getElementById('panel-layers');
  if (layersBtn) layersBtn.classList.add('active');
  if (layersPanel) layersPanel.classList.add('active');
};

// Set Mode switching function
function setAppMode(mode) {
  appMode = mode;
  document.body.setAttribute('data-app-mode', mode);
  
  const consBtn = document.getElementById('mode-consultation-btn');
  const navBtn = document.getElementById('mode-navigation-btn');
  const weatherBtn = document.getElementById('mode-weather-btn');
  const sidebar = document.getElementById('sidebar-drawer');
  const hud = document.getElementById('navigation-hud');
  const telemetry = document.getElementById('telemetry-overlay');
  const warnBanner = document.getElementById('danger-warning-banner');
  
  const sidebarTabs = document.querySelector('.sidebar-tabs');
  const weatherHeader = document.getElementById('weather-sidebar-header');

  // Deactivate all mode buttons
  if (consBtn) consBtn.classList.remove('active');
  if (navBtn) navBtn.classList.remove('active');
  if (weatherBtn) weatherBtn.classList.remove('active');

  if (mode === 'navigation') {
    if (navBtn) navBtn.classList.add('active');
    
    // Auto collapse sidebar
    if (sidebar) sidebar.classList.add('collapsed');
    
    // Toggle overlays
    if (hud) hud.style.display = 'flex';
    if (telemetry) telemetry.style.display = 'none';

    // Start auto track
    startRouteTracking();
    
    // Reset stats
    navigationStartTime = Date.now();
    navigationDistance = 0;
    lastNavLatLng = L.latLng(currentLat, currentLon);
    
    // Update Boat Name in HUD
    const hudBoatName = document.getElementById('hud-boat-name');
    if (hudBoatName) hudBoatName.textContent = boatProfile.name;
    
    // Set Map View zoom on user and enable auto-centering
    if (map) map.setView([currentLat, currentLon], 15);
    autoCenter = true;
    updateRecenterButtonUI();
    // Duration timer update loop
    if (navTimerInterval) clearInterval(navTimerInterval);
    navTimerInterval = setInterval(() => {
      if (!navigationStartTime) return;
      const elapsedMs = Date.now() - navigationStartTime;
      const seconds = Math.floor((elapsedMs / 1000) % 60);
      const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
      const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
      
      const durationStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const hudDur = document.getElementById('hud-duration');
      if (hudDur) hudDur.textContent = durationStr;
    }, 1000);

  } else if (mode === 'weather') {
    if (weatherBtn) weatherBtn.classList.add('active');

    // Expand sidebar
    if (sidebar) sidebar.classList.remove('collapsed');

    // Hide standard sidebar tabs and show weather specific title
    if (sidebarTabs) sidebarTabs.style.display = 'none';
    if (weatherHeader) weatherHeader.style.display = 'block';

    // Set panel-weather active and others inactive
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const weatherPanel = document.getElementById('panel-weather');
    if (weatherPanel) weatherPanel.classList.add('active');

    // Hide navigation overlays
    if (hud) hud.style.display = 'none';
    if (telemetry) telemetry.style.display = 'none';
    if (warnBanner) warnBanner.style.display = 'none';

    // Stop navigation timer
    if (navTimerInterval) {
      clearInterval(navTimerInterval);
      navTimerInterval = null;
    }

    // Immediately trigger weather update for the current map center
    if (map) {
      const center = map.getCenter();
      updateWeatherAndTides(center.lat, center.lng, true);
    }

  } else {
    // Mode Consultation
    if (consBtn) consBtn.classList.add('active');
    
    // Expand sidebar if on desktop
    if (sidebar && window.innerWidth > 768) {
      sidebar.classList.remove('collapsed');
    }
    
    // Show standard sidebar tabs and hide weather specific title
    if (sidebarTabs) sidebarTabs.style.display = 'flex';
    if (weatherHeader) weatherHeader.style.display = 'none';

    // Set panel-layers active in sidebar
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const layersBtn = document.querySelector('[data-target="panel-layers"]');
    const layersPanel = document.getElementById('panel-layers');
    if (layersBtn) layersBtn.classList.add('active');
    if (layersPanel) layersPanel.classList.add('active');

    // Toggle overlays
    if (hud) hud.style.display = 'none';
    if (telemetry) telemetry.style.display = 'flex';
    if (warnBanner) warnBanner.style.display = 'none';

    // Clear navigation timer
    if (navTimerInterval) {
      clearInterval(navTimerInterval);
      navTimerInterval = null;
    }
  }

  // Trigger map resize check to adapt to sidebar layout changes
  if (map) {
    map.invalidateSize();
    setTimeout(() => { if (map) map.invalidateSize(); }, 100);
    setTimeout(() => { if (map) map.invalidateSize(); }, 350);
  }
}

// Load and save boat profile
function loadBoatProfile() {
  const saved = localStorage.getItem('sirroco_boat_profile');
  if (saved) {
    boatProfile = JSON.parse(saved);
  }
  
  // Populate form
  document.getElementById('boat-name').value = boatProfile.name;
  document.getElementById('boat-length').value = boatProfile.length;
  document.getElementById('boat-width').value = boatProfile.width;
  document.getElementById('boat-draft').value = boatProfile.draft;
  document.getElementById('boat-clearance').value = boatProfile.clearance;
}

function saveBoatProfile(profile) {
  boatProfile = profile;
  localStorage.setItem('sirroco_boat_profile', JSON.stringify(boatProfile));
  
  // Update display values
  const hudBoatName = document.getElementById('hud-boat-name');
  if (hudBoatName) hudBoatName.textContent = boatProfile.name;
  
  const draftDisp = document.getElementById('panel-boat-draft-display');
  if (draftDisp) draftDisp.textContent = boatProfile.draft.toFixed(1);

  // Re-evaluate anchorages (now harbors)
  renderHarborListAndMarkers();
}

// 9. Initializations & Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load local settings
  const cachedLang = localStorage.getItem('sirroco_lang') || 'fr';
  const modalLangSelector = document.getElementById('lang-selector-modal');
  if (modalLangSelector) {
    modalLangSelector.value = cachedLang;
  }
  
  const savedHistory = localStorage.getItem('sirroco_saved_tracks');
  if (savedHistory) {
    savedTracks = JSON.parse(savedHistory);
  }

  // Load boat profile settings
  loadBoatProfile();

  // Init Map
  initMap();
  
  // Set Language
  translateUI(cachedLang);

  // Render initial harbors on map and list
  fetchHarborsInViewport();

  // Render history list
  renderSavedTracks();

  // Initial weather and tides fetch for current user position
  updateWeatherAndTides(currentLat, currentLon, true);

  // Render danger zone list in sidebar
  renderZoneList();

  // Mode Switcher Controls
  document.getElementById('mode-consultation-btn').addEventListener('click', () => {
    setAppMode('consultation');
  });

  document.getElementById('mode-navigation-btn').addEventListener('click', () => {
    setAppMode('navigation');
  });

  const modeWeatherBtn = document.getElementById('mode-weather-btn');
  if (modeWeatherBtn) {
    modeWeatherBtn.addEventListener('click', () => {
      setAppMode('weather');
    });
  }

  // Navigation HUD Stop Button
  document.getElementById('stop-nav-btn').addEventListener('click', () => {
    setAppMode('consultation');
    stopRouteTracking();
  });

  // Control Center Settings Modal Toggle
  const settingsModal = document.getElementById('settings-modal');
  document.getElementById('settings-toggle-btn').addEventListener('click', () => {
    if (settingsModal) settingsModal.style.display = 'flex';
  });

  document.getElementById('modal-close-btn').addEventListener('click', () => {
    if (settingsModal) settingsModal.style.display = 'none';
  });

  // Hide modal on background click
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
      }
    });
  }

  // Anchor Direct Toggle
  const anchorToggleBtn = document.getElementById('anchor-toggle-btn');
  if (anchorToggleBtn) {
    anchorToggleBtn.addEventListener('click', () => {
      const activeText = currentLang === 'fr' ? "Activer l'alarme de mouillage (rayon : 0.030 NM) ?" : 
                        (currentLang === 'es' ? "¿Activar alarma de ancla (radio: 0.030 NM)?" : "Activate anchor alarm (radius: 0.030 NM)?");
      const deactiveText = currentLang === 'fr' ? "Désactiver l'alarme de mouillage ?" : 
                          (currentLang === 'es' ? "¿Desactivar alarma de ancla?" : "Deactivate anchor alarm?");
      
      if (!isAnchorAlarmActive) {
        if (confirm(activeText)) {
          isAnchorAlarmActive = true;
          alarmRadius = 0.030;
          
          // Update radius labels if they exist
          const radiusVal = document.getElementById('alarm-radius-val');
          if (radiusVal) radiusVal.textContent = alarmRadius.toFixed(3);
          const radiusInput = document.getElementById('alarm-radius-input');
          if (radiusInput) radiusInput.value = alarmRadius;
          
          updateAnchorLocation(currentLat, currentLon);
          
          anchorToggleBtn.classList.add('active');
          const anchorBadge = document.getElementById('status-anchor-badge');
          if (anchorBadge) anchorBadge.style.display = 'flex';
          
          const toggle = document.getElementById('anchor-alarm-toggle');
          if (toggle) toggle.checked = true;
          
          const statusText = document.getElementById('anchor-status-text');
          if (statusText) statusText.textContent = translations[currentLang].active;
          const statusIndicator = document.getElementById('anchor-status-indicator');
          if (statusIndicator) statusIndicator.className = "status-indicator active";
        }
      } else {
        if (confirm(deactiveText)) {
          deactivateAnchorAlarm();
        }
      }
    });
  }

  // Settings Modal Tabs selection
  const modalTabs = document.querySelectorAll('.modal-tab-btn');
  const modalPanes = document.querySelectorAll('.modal-pane');
  modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modalTabs.forEach(t => t.classList.remove('active'));
      modalPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = tab.getAttribute('data-tab');
      const pane = document.getElementById(targetPane);
      if (pane) pane.classList.add('active');
    });
  });

  // Boat profile form submission
  document.getElementById('boat-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const profile = {
      name: document.getElementById('boat-name').value,
      length: parseFloat(document.getElementById('boat-length').value) || 11.5,
      width: parseFloat(document.getElementById('boat-width').value) || 3.8,
      draft: parseFloat(document.getElementById('boat-draft').value) || 1.9,
      clearance: parseFloat(document.getElementById('boat-clearance').value) || 0.5
    };
    saveBoatProfile(profile);
    if (settingsModal) settingsModal.style.display = 'none';
  });

  // PING AVURNAV button: open portal in new tab
  const avurnavBtn = document.getElementById('show-avurnav-btn');
  if (avurnavBtn) {
    avurnavBtn.addEventListener('click', () => {
      window.open('https://portail.ping-info-nautique.fr/avurnav-notice', '_blank', 'noopener,noreferrer');
    });
  }

  // Overlays Custom Controls

  const layerDangers = document.getElementById('layer-dangers');
  if (layerDangers) {
    layerDangers.addEventListener('change', (e) => {
      if (!dangerZoneLayer || !map) return;
      if (e.target.checked) {
        dangerZoneLayer.addTo(map);
      } else {
        map.removeLayer(dangerZoneLayer);
      }
    });
  }

  const layerAvurnav = document.getElementById('layer-avurnav');
  if (layerAvurnav) {
    layerAvurnav.addEventListener('change', (e) => {
      if (!pingWmsLayer || !map) return;
      if (e.target.checked) {
        pingWmsLayer.addTo(map);
      } else {
        map.removeLayer(pingWmsLayer);
      }
    });
  }

  const layerHarbors = document.getElementById('layer-harbors');
  if (layerHarbors) {
    layerHarbors.addEventListener('change', (e) => {
      if (!harborsLayer || !map) return;
      if (e.target.checked) {
        harborsLayer.addTo(map);
        fetchHarborsInViewport();
      } else {
        map.removeLayer(harborsLayer);
        clearHarborMarkers();
        displayHarborMessage(currentLang === 'fr' ? "Activez le calque 'Ports de plaisance' pour voir la liste." : "Enable 'Marinas' layer to see the list.");
      }
    });
  }

  // Language selector inside Modal
  if (modalLangSelector) {
    modalLangSelector.addEventListener('change', (e) => {
      translateUI(e.target.value);
      renderHarborListAndMarkers(); // Re-render to update harbors list/markers on translation
    });
  }

  // Theme switcher inside Modal
  const themeBtnModal = document.getElementById('theme-toggle-modal');
  if (themeBtnModal) {
    themeBtnModal.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('sirroco_theme', newTheme);
    });
  }

  // Set initial theme
  const cachedTheme = localStorage.getItem('sirroco_theme') || 'dark';
  document.body.setAttribute('data-theme', cachedTheme);

  // Sidebar Tabs Navigation (Consultation Mode)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetPanel = btn.getAttribute('data-target');
      const panel = document.getElementById(targetPanel);
      if (panel) panel.classList.add('active');
      
      // Fetch fresh weather data when entering the weather panel
      if (targetPanel === 'panel-weather' && map) {
        const center = map.getCenter();
        updateWeatherAndTides(center.lat, center.lng);
      }
      
      // On small screens, if sidebar tab changes, keep open or toggle
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar-drawer').classList.remove('collapsed');
      }
    });
  });

  // Sidebar Drawer Toggle for Mobile
  const drawerBtn = document.getElementById('drawer-toggle-btn');
  const sidebar = document.getElementById('sidebar-drawer');
  if (drawerBtn && sidebar) {
    drawerBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Track Buttons
  document.getElementById('start-track-btn').addEventListener('click', startRouteTracking);
  document.getElementById('stop-track-btn').addEventListener('click', stopRouteTracking);
  document.getElementById('clear-tracks-btn').addEventListener('click', clearHistory);

  // Anchor Alarm Setup
  const anchorToggle = document.getElementById('anchor-alarm-toggle');
  anchorToggle.addEventListener('change', (e) => {
    isAnchorAlarmActive = e.target.checked;
    
    if (isAnchorAlarmActive) {
      document.getElementById('anchor-status-text').textContent = translations[currentLang].active;
      document.getElementById('anchor-status-indicator').className = "status-indicator active";
      updateAnchorLocation(currentLat, currentLon);
      const btn = document.getElementById('anchor-toggle-btn');
      if (btn) btn.classList.add('active');
      const badge = document.getElementById('status-anchor-badge');
      if (badge) badge.style.display = 'flex';
    } else {
      deactivateAnchorAlarm();
    }
  });

  document.getElementById('alarm-radius-input').addEventListener('input', (e) => {
    alarmRadius = parseFloat(e.target.value) || 0.01;
    document.getElementById('alarm-radius-val').textContent = alarmRadius.toFixed(3);
    if (anchorCircle) {
      anchorCircle.setRadius(alarmRadius * 1852);
    }
    checkAnchorAlarm();
  });

  // Test siren play/stop inside Modal
  let isSirenTesting = false;
  const testSirenBtnModal = document.getElementById('test-siren-btn-modal');
  if (testSirenBtnModal) {
    testSirenBtnModal.addEventListener('click', (e) => {
      isSirenTesting = !isSirenTesting;
      if (isSirenTesting) {
        playAlarmSound();
        e.target.classList.add('btn-danger');
        e.target.textContent = "Stop Test";
      } else {
        stopAlarmSound();
        e.target.classList.remove('btn-danger');
        e.target.textContent = translations[currentLang].siren_test;
      }
    });
  }

  // Clear alarm AND stop route tracking in one button as requested
  document.getElementById('alarm-clear-all-btn').addEventListener('click', () => {
    deactivateAnchorAlarm();
    stopRouteTracking();
  });
  
  // Set default radius label text
  document.getElementById('alarm-radius-val').textContent = alarmRadius.toFixed(3);

  // GPS Simulator settings inside Modal
  const simToggleModal = document.getElementById('simulator-toggle-modal');
  if (simToggleModal) {
    simToggleModal.addEventListener('change', (e) => {
      toggleSimulator(e.target.checked);
    });
  }

  const speedSliderModal = document.getElementById('sim-speed-slider-modal');
  if (speedSliderModal) {
    speedSliderModal.addEventListener('input', (e) => {
      simSpeed = parseFloat(e.target.value);
      const valDisp = document.getElementById('sim-speed-val-modal');
      if (valDisp) valDisp.textContent = simSpeed.toFixed(1);
    });
  }

  const headingSliderModal = document.getElementById('sim-heading-slider-modal');
  if (headingSliderModal) {
    headingSliderModal.addEventListener('input', (e) => {
      simHeading = parseInt(e.target.value);
      const valDisp = document.getElementById('sim-heading-val-modal');
      if (valDisp) valDisp.textContent = simHeading.toString().padStart(3, '0');
    });
  }

  const simDriftBtnModal = document.getElementById('sim-drift-btn-modal');
  if (simDriftBtnModal) {
    simDriftBtnModal.addEventListener('click', triggerSimulatorDrift);
  }

  // Window resize handler for Leaflet
  window.addEventListener('resize', () => {
    if (map) map.invalidateSize();
  });

  // Initialize Simulator Active by default
  toggleSimulator(true);
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered!', reg.scope))
      .catch(err => console.log('Service Worker failed to register', err));
  });
}
