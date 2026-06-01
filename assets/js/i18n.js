/* ============================================================
   PlayerDNA Labs — i18n (RTL-aware)
   Two layers:
   1) DICT keyed by [data-i18n] / [data-i18n-html] / [data-i18n-ph]
   2) PHRASES keyed by the English text — a TreeWalker auto-
      translates any matching text node (no markup needed).
   Persists choice; Arabic = RTL; AR/JA fonts lazy-load.
   ============================================================ */
(function () {
  "use strict";

  var RTL = { ar: true };
  var FONTS = {
    ar: "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap",
    ja: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
  };

  var DICT = {
    en: {
      "nav.capabilities": "Capabilities", "nav.how": "Benefits", "nav.modules": "Modules", "nav.dashboard": "Dashboard", "nav.technology": "Technology", "nav.login": "Log in", "nav.getStarted": "Get started",
      "hero.eyebrow": "First AI Athlete Academy",
      "hero.h1a": "AI that decodes every athlete.",
      "hero.h1b": "Reveal the football <span class=\"gradient-text\">position</span> they're built for.",
      "hero.lead": "PlayerDNA Labs turns a training video, a live session or a guided self-assessment into a complete performance profile — movement, speed, power, stamina, biomechanics and injury risk — then recommends the football positions where each player will thrive.",
      "hero.btnStart": "Start screening", "hero.btnExplore": "Explore the platform",
      "hero.stat1": "Analysis modules & engines", "hero.stat2": "Positions modeled", "hero.stat3": "Metrics per athlete",
      "pitch.title": "Turn any camera into an <span class=\"gradient-text\">AI scout</span>.",
      "pitch.lead": "Screen movement, speed, jump, agility, posture &amp; best position from a phone — <strong>no hardware</strong> — then scale the same athlete profile up to pro <strong>force-plate, VO₂ &amp; lactate</strong> testing.",
      "how.title": "From any input to a <span class=\"gradient-text\">personalized</span> plan",
      "cta.eyebrow": "Ready when you are", "cta.title": "Find every player's best position",
      "cta.lead": "Create your workspace and run your first athlete scan. Connect your own analysis backend when you're ready to go live.",
      "cta.btn1": "Get started free", "cta.btn2": "View a sample dashboard",
      "footer.tagline": "AI football position & athlete intelligence — from a single video to a complete, coach-ready development profile.",
      "footer.platform": "Platform", "footer.capabilities": "Capabilities", "footer.account": "Account"
    },
    ar: {
      "nav.capabilities": "الإمكانات", "nav.how": "الفوائد", "nav.modules": "الوحدات", "nav.dashboard": "لوحة التحكم", "nav.technology": "التقنية", "nav.login": "تسجيل الدخول", "nav.getStarted": "ابدأ الآن",
      "hero.eyebrow": "First AI Athlete Academy",
      "hero.h1a": "ذكاء اصطناعي يحلّل كل لاعب.",
      "hero.h1b": "اكتشف <span class=\"gradient-text\">المركز</span> المثالي لكل لاعب.",
      "hero.lead": "تحوّل PlayerDNA Labs مقطع تدريب أو بثًا مباشرًا أو تقييمًا ذاتيًا موجّهًا إلى ملف أداء كامل — الحركة والسرعة والقوة والتحمّل والميكانيكا الحيوية وخطر الإصابة — ثم توصي بالمراكز التي يتألق فيها كل لاعب.",
      "hero.btnStart": "ابدأ التحليل", "hero.btnExplore": "استكشف المنصة",
      "hero.stat1": "وحدة ومحرك تحليل", "hero.stat2": "مركزًا مُنمذجًا", "hero.stat3": "مقياسًا لكل لاعب",
      "pitch.title": "حوّل أي كاميرا إلى <span class=\"gradient-text\">كشّاف بالذكاء الاصطناعي</span>.",
      "pitch.lead": "قِس الحركة والسرعة والقفز والرشاقة والوضعية وأفضل مركز من هاتف — <strong>دون أي أجهزة</strong> — ثم ارتقِ بنفس ملف اللاعب إلى اختبارات احترافية لـ<strong>منصّة القوة وVO₂ واللاكتات</strong>.",
      "how.title": "من أي مُدخل إلى خطة <span class=\"gradient-text\">مخصّصة</span>",
      "cta.eyebrow": "جاهزون متى كنت مستعدًا", "cta.title": "اعثر على أفضل مركز لكل لاعب",
      "cta.lead": "أنشئ مساحة عملك وشغّل أول تحليل للاعب. اربط نظام التحليل الخاص بك عندما تكون جاهزًا للانطلاق.",
      "cta.btn1": "ابدأ مجانًا", "cta.btn2": "شاهد لوحة تحكم نموذجية",
      "footer.tagline": "ذكاء اصطناعي لتحديد المراكز وتحليل الرياضيين — من مقطع واحد إلى ملف تطوير متكامل جاهز للمدرب.",
      "footer.platform": "المنصة", "footer.capabilities": "الإمكانات", "footer.account": "الحساب"
    },
    de: {
      "nav.capabilities": "Funktionen", "nav.how": "Vorteile", "nav.modules": "Module", "nav.dashboard": "Dashboard", "nav.technology": "Technologie", "nav.login": "Anmelden", "nav.getStarted": "Loslegen",
      "hero.eyebrow": "First AI Athlete Academy",
      "hero.h1a": "KI, die jeden Athleten entschlüsselt.",
      "hero.h1b": "Finde die <span class=\"gradient-text\">Position</span>, für die er gemacht ist.",
      "hero.lead": "PlayerDNA Labs verwandelt ein Trainingsvideo, eine Live-Session oder eine geführte Selbsteinschätzung in ein vollständiges Leistungsprofil — Bewegung, Geschwindigkeit, Kraft, Ausdauer, Biomechanik und Verletzungsrisiko — und empfiehlt die Positionen, auf denen jeder Spieler glänzt.",
      "hero.btnStart": "Screening starten", "hero.btnExplore": "Plattform entdecken",
      "hero.stat1": "Analysemodule & Engines", "hero.stat2": "Modellierte Positionen", "hero.stat3": "Metriken pro Athlet",
      "pitch.title": "Mach jede Kamera zum <span class=\"gradient-text\">KI-Scout</span>.",
      "pitch.lead": "Erfasse Bewegung, Geschwindigkeit, Sprung, Agilität, Haltung &amp; beste Position per Smartphone — <strong>ohne Hardware</strong> — und skaliere dasselbe Athletenprofil bis zu professionellen <strong>Force-Plate-, VO₂- &amp; Laktat</strong>-Tests.",
      "how.title": "Von jeder Eingabe zu einem <span class=\"gradient-text\">personalisierten</span> Plan",
      "cta.eyebrow": "Bereit, wenn du es bist", "cta.title": "Finde die beste Position für jeden Spieler",
      "cta.lead": "Erstelle deinen Workspace und starte deinen ersten Athleten-Scan. Verbinde dein eigenes Analyse-Backend, wenn du live gehen willst.",
      "cta.btn1": "Kostenlos starten", "cta.btn2": "Beispiel-Dashboard ansehen",
      "footer.tagline": "KI-Positions- und Athletenintelligenz für Fußball — von einem einzigen Video zu einem vollständigen, trainerfertigen Entwicklungsprofil.",
      "footer.platform": "Plattform", "footer.capabilities": "Funktionen", "footer.account": "Konto"
    },
    fr: {
      "nav.capabilities": "Fonctionnalités", "nav.how": "Avantages", "nav.modules": "Modules", "nav.dashboard": "Tableau de bord", "nav.technology": "Technologie", "nav.login": "Connexion", "nav.getStarted": "Commencer",
      "hero.eyebrow": "First AI Athlete Academy",
      "hero.h1a": "Une IA qui décode chaque athlète.",
      "hero.h1b": "Révélez le <span class=\"gradient-text\">poste</span> fait pour lui.",
      "hero.lead": "PlayerDNA Labs transforme une vidéo d'entraînement, une session en direct ou une auto-évaluation guidée en un profil de performance complet — mouvement, vitesse, puissance, endurance, biomécanique et risque de blessure — puis recommande les postes où chaque joueur s'épanouira.",
      "hero.btnStart": "Lancer l'analyse", "hero.btnExplore": "Explorer la plateforme",
      "hero.stat1": "Modules et moteurs d'analyse", "hero.stat2": "Postes modélisés", "hero.stat3": "Mesures par athlète",
      "pitch.title": "Transformez n'importe quelle caméra en <span class=\"gradient-text\">recruteur IA</span>.",
      "pitch.lead": "Évaluez mouvement, vitesse, saut, agilité, posture &amp; meilleur poste depuis un téléphone — <strong>sans matériel</strong> — puis faites évoluer le même profil vers des tests pro <strong>plateforme de force, VO₂ &amp; lactate</strong>.",
      "how.title": "De n'importe quelle entrée à un plan <span class=\"gradient-text\">personnalisé</span>",
      "cta.eyebrow": "Prêt quand vous l'êtes", "cta.title": "Trouvez le meilleur poste de chaque joueur",
      "cta.lead": "Créez votre espace et lancez votre premier scan d'athlète. Connectez votre propre backend d'analyse quand vous serez prêt.",
      "cta.btn1": "Commencer gratuitement", "cta.btn2": "Voir un tableau de bord exemple",
      "footer.tagline": "Intelligence de position et d'athlète par IA pour le football — d'une seule vidéo à un profil de développement complet, prêt pour le coach.",
      "footer.platform": "Plateforme", "footer.capabilities": "Fonctionnalités", "footer.account": "Compte"
    },
    ja: {
      "nav.capabilities": "機能", "nav.how": "メリット", "nav.modules": "モジュール", "nav.dashboard": "ダッシュボード", "nav.technology": "テクノロジー", "nav.login": "ログイン", "nav.getStarted": "始める",
      "hero.eyebrow": "First AI Athlete Academy",
      "hero.h1a": "すべての選手をAIが解析。",
      "hero.h1b": "最適な<span class=\"gradient-text\">ポジション</span>を導き出す。",
      "hero.lead": "PlayerDNA Labsは、練習動画・ライブ映像・ガイド付き自己評価を、動き・スピード・パワー・スタミナ・バイオメカニクス・けがリスクを含む完全なパフォーマンスプロファイルに変換し、各選手が輝くポジションを提案します。",
      "hero.btnStart": "スクリーニング開始", "hero.btnExplore": "プラットフォームを見る",
      "hero.stat1": "分析モジュールとエンジン", "hero.stat2": "モデル化ポジション", "hero.stat3": "選手ごとの指標",
      "pitch.title": "あらゆるカメラを<span class=\"gradient-text\">AIスカウト</span>に。",
      "pitch.lead": "動き・スピード・ジャンプ・敏捷性・姿勢・最適ポジションをスマホで計測 — <strong>機材不要</strong> — そして同じ選手プロファイルを、プロの<strong>フォースプレート・VO₂・乳酸</strong>測定へ拡張。",
      "how.title": "あらゆる入力から<span class=\"gradient-text\">パーソナライズ</span>された計画へ",
      "cta.eyebrow": "準備はいつでもOK", "cta.title": "すべての選手に最適なポジションを",
      "cta.lead": "ワークスペースを作成し、最初の選手スキャンを実行しましょう。準備ができたら、自社の分析バックエンドを接続できます。",
      "cta.btn1": "無料で始める", "cta.btn2": "サンプルのダッシュボードを見る",
      "footer.tagline": "サッカーのためのAIポジション＆アスリート分析 — 1本の動画から、コーチがすぐ使える完全な育成プロファイルへ。",
      "footer.platform": "プラットフォーム", "footer.capabilities": "機能", "footer.account": "アカウント"
    },
    es: {
      "nav.capabilities": "Capacidades", "nav.how": "Beneficios", "nav.modules": "Módulos", "nav.dashboard": "Panel", "nav.technology": "Tecnología", "nav.login": "Iniciar sesión", "nav.getStarted": "Comenzar",
      "hero.eyebrow": "First AI Athlete Academy",
      "hero.h1a": "IA que descifra a cada atleta.",
      "hero.h1b": "Revela la <span class=\"gradient-text\">posición</span> para la que está hecho.",
      "hero.lead": "PlayerDNA Labs convierte un vídeo de entrenamiento, una sesión en directo o una autoevaluación guiada en un perfil de rendimiento completo — movimiento, velocidad, potencia, resistencia, biomecánica y riesgo de lesión — y recomienda las posiciones donde cada jugador destacará.",
      "hero.btnStart": "Iniciar análisis", "hero.btnExplore": "Explorar la plataforma",
      "hero.stat1": "Módulos y motores de análisis", "hero.stat2": "Posiciones modeladas", "hero.stat3": "Métricas por atleta",
      "pitch.title": "Convierte cualquier cámara en un <span class=\"gradient-text\">ojeador con IA</span>.",
      "pitch.lead": "Evalúa movimiento, velocidad, salto, agilidad, postura &amp; mejor posición desde un teléfono — <strong>sin hardware</strong> — y escala el mismo perfil a pruebas pro de <strong>plataforma de fuerza, VO₂ &amp; lactato</strong>.",
      "how.title": "De cualquier entrada a un plan <span class=\"gradient-text\">personalizado</span>",
      "cta.eyebrow": "Listos cuando tú lo estés", "cta.title": "Encuentra la mejor posición de cada jugador",
      "cta.lead": "Crea tu espacio y ejecuta tu primer análisis de atleta. Conecta tu propio backend de análisis cuando estés listo para empezar.",
      "cta.btn1": "Empezar gratis", "cta.btn2": "Ver un panel de ejemplo",
      "footer.tagline": "Inteligencia de posición y de atletas con IA para el fútbol — de un solo vídeo a un perfil de desarrollo completo, listo para el entrenador.",
      "footer.platform": "Plataforma", "footer.capabilities": "Capacidades", "footer.account": "Cuenta"
    }
  };

  /* Text-node phrases: English -> { ar, de, fr, ja, es } */
  var P = {
    // eyebrows
    "Core capabilities": { ar: "الإمكانات الأساسية", de: "Kernfunktionen", fr: "Fonctionnalités clés", ja: "コア機能", es: "Capacidades principales" },
    "How it works": { ar: "كيف يعمل", de: "So funktioniert's", fr: "Comment ça marche", ja: "仕組み", es: "Cómo funciona" },
    "Position intelligence": { ar: "ذكاء المراكز", de: "Positionsintelligenz", fr: "Intelligence de poste", ja: "ポジション分析", es: "Inteligencia de posición" },
    "The full platform": { ar: "المنصة الكاملة", de: "Die komplette Plattform", fr: "La plateforme complète", ja: "プラットフォーム全体", es: "La plataforma completa" },
    "Sample output": { ar: "نموذج المخرجات", de: "Beispielausgabe", fr: "Exemple de résultat", ja: "出力サンプル", es: "Resultado de muestra" },
    "Technology": { ar: "التقنية", de: "Technologie", fr: "Technologie", ja: "テクノロジー", es: "Tecnología" },
    "Built for the touchline": { ar: "مصمّم لخط التماس", de: "Für die Seitenlinie gebaut", fr: "Conçu pour le terrain", ja: "ピッチサイドのために", es: "Hecho para la banda" },
    "From grassroots to elite": { ar: "من القاعدة إلى النخبة", de: "Von der Basis zur Elite", fr: "De l'amateur à l'élite", ja: "草の根からエリートまで", es: "De la base a la élite" },
    // section titles
    "Eight engines that read the game": { ar: "ثمانية محرّكات تقرأ اللعبة", de: "Acht Engines, die das Spiel lesen", fr: "Huit moteurs qui lisent le jeu", ja: "試合を読む8つのエンジン", es: "Ocho motores que leen el juego" },
    "From academy trials to first-team screening": { ar: "من اختبارات الأكاديمية إلى فحص الفريق الأول", de: "Von Akademie-Probetrainings bis zum Erstteam-Screening", fr: "Des essais en académie au screening de l'équipe première", ja: "アカデミー入団テストからトップチーム評価まで", es: "De las pruebas de cantera al cribado del primer equipo" },
    "Nineteen advanced modules, three intelligence pillars": { ar: "تسعة عشر وحدة متقدمة، وثلاثة أعمدة للذكاء", de: "Neunzehn erweiterte Module, drei Intelligenz-Säulen", fr: "Dix-neuf modules avancés, trois piliers d'intelligence", ja: "19の高度なモジュール、3つの知能の柱", es: "Diecinueve módulos avanzados, tres pilares de inteligencia" },
    "A complete athlete dashboard": { ar: "لوحة تحكم متكاملة للاعب", de: "Ein vollständiges Athleten-Dashboard", fr: "Un tableau de bord athlète complet", ja: "完全なアスリートダッシュボード", es: "Un panel de atleta completo" },
    "Pro-grade AI, built for the pitch": { ar: "ذكاء اصطناعي احترافي، مصمّم للملعب", de: "Profi-KI, gebaut für den Platz", fr: "Une IA pro, conçue pour le terrain", ja: "ピッチのためのプロ仕様AI", es: "IA de nivel pro, hecha para el campo" },
    // leads
    "Every athlete passes through the full pipeline — from raw footage to a defensible position recommendation and a downloadable report.": { ar: "يمرّ كل لاعب عبر المسار الكامل — من اللقطات الأولية إلى توصية مركز موثوقة وتقرير قابل للتنزيل.", de: "Jeder Athlet durchläuft die gesamte Pipeline — von Rohaufnahmen zu einer belastbaren Positionsempfehlung und einem herunterladbaren Bericht.", fr: "Chaque athlète suit le pipeline complet — des images brutes à une recommandation de poste défendable et un rapport téléchargeable.", ja: "すべての選手が全パイプラインを通過 — 生の映像から、根拠あるポジション提案とダウンロード可能なレポートまで。", es: "Cada atleta pasa por todo el proceso — del metraje en bruto a una recomendación de posición defendible y un informe descargable." },
    "Beyond the eight core engines, PlayerDNA Labs is a complete athlete-screening, injury-risk, youth-development and position-intelligence platform.": { ar: "إلى جانب المحرّكات الثمانية الأساسية، تُعدّ PlayerDNA Labs منصة متكاملة لفحص اللاعبين وخطر الإصابة وتطوير الناشئين وذكاء المراكز.", de: "Über die acht Kern-Engines hinaus ist PlayerDNA Labs eine komplette Plattform für Athleten-Screening, Verletzungsrisiko, Nachwuchsförderung und Positionsintelligenz.", fr: "Au-delà des huit moteurs principaux, PlayerDNA Labs est une plateforme complète de screening, de risque de blessure, de développement des jeunes et d'intelligence de poste.", ja: "8つのコアエンジンに加え、PlayerDNA Labsは選手評価・けがリスク・育成・ポジション分析を網羅する完全なプラットフォームです。", es: "Más allá de los ocho motores principales, PlayerDNA Labs es una plataforma completa de cribado, riesgo de lesión, desarrollo juvenil e inteligencia de posición." },
    "Open the full sample report PlayerDNA Labs produces from a single scan — score cards, performance radar, movement heatmap, best-fit positions, injury risk and a development plan.": { ar: "افتح التقرير النموذجي الكامل الذي تنتجه PlayerDNA Labs من مسح واحد — بطاقات النتائج ورادار الأداء وخريطة الحركة الحرارية وأنسب المراكز وخطر الإصابة وخطة تطوير.", de: "Öffne den vollständigen Beispielbericht, den PlayerDNA Labs aus einem einzigen Scan erstellt — Score-Karten, Leistungsradar, Bewegungs-Heatmap, beste Positionen, Verletzungsrisiko und Entwicklungsplan.", fr: "Ouvrez le rapport exemple complet que PlayerDNA Labs produit à partir d'un seul scan — fiches de score, radar de performance, heatmap de mouvement, meilleurs postes, risque de blessure et plan de développement.", ja: "1回のスキャンからPlayerDNA Labsが生成する完全なサンプルレポートを開きましょう — スコアカード、パフォーマンスレーダー、移動ヒートマップ、最適ポジション、けがリスク、育成プラン。", es: "Abre el informe de muestra completo que PlayerDNA Labs genera de un solo análisis — tarjetas de puntuación, radar de rendimiento, mapa de calor, mejores posiciones, riesgo de lesión y plan de desarrollo." },
    "From a single clip to a defensible athlete profile — every layer tuned for accuracy, speed and the trust of coaches and players.": { ar: "من مقطع واحد إلى ملف لاعب موثوق — كل طبقة مُحسّنة للدقة والسرعة وثقة المدربين واللاعبين.", de: "Von einem einzigen Clip zu einem belastbaren Athletenprofil — jede Schicht auf Genauigkeit, Geschwindigkeit und das Vertrauen von Trainern und Spielern abgestimmt.", fr: "D'un seul clip à un profil d'athlète défendable — chaque couche optimisée pour la précision, la vitesse et la confiance des coachs et joueurs.", ja: "1本のクリップから、根拠あるアスリートプロファイルへ — すべての層が精度・速度・コーチと選手の信頼のために最適化。", es: "De un solo clip a un perfil de atleta defendible — cada capa ajustada para precisión, velocidad y la confianza de técnicos y jugadores." },
    "One upload turns a phone clip into a measured, comparable athlete profile — so coaches, scouts and sports scientists make position calls on evidence, not gut feel.": { ar: "رفع واحد يحوّل مقطع هاتف إلى ملف لاعب قابل للقياس والمقارنة — ليتخذ المدربون والكشّافون وعلماء الرياضة قرارات المراكز بناءً على الأدلة، لا الحدس.", de: "Ein Upload macht aus einem Handy-Clip ein messbares, vergleichbares Athletenprofil — damit Trainer, Scouts und Sportwissenschaftler Positionsentscheidungen auf Basis von Daten treffen, nicht aus dem Bauch.", fr: "Un seul upload transforme un clip de téléphone en un profil d'athlète mesurable et comparable — pour que coachs, recruteurs et scientifiques du sport décident des postes sur des preuves, pas à l'instinct.", ja: "1回のアップロードで、スマホ映像が計測可能で比較できる選手プロファイルに — コーチ・スカウト・スポーツ科学者が勘ではなく根拠でポジションを判断。", es: "Una sola subida convierte un clip de móvil en un perfil de atleta medible y comparable — para que técnicos, ojeadores y científicos deportivos decidan posiciones con evidencia, no por intuición." },
    // capability cards
    "Video Movement Analysis": { ar: "تحليل الحركة بالفيديو", de: "Video-Bewegungsanalyse", fr: "Analyse du mouvement vidéo", ja: "映像モーション解析", es: "Análisis de movimiento por vídeo" },
    "Body & Pose Analysis": { ar: "تحليل الجسم والوضعية", de: "Körper- & Haltungsanalyse", fr: "Analyse du corps et de la posture", ja: "身体・姿勢解析", es: "Análisis de cuerpo y postura" },
    "Athlete Input Profile": { ar: "ملف بيانات اللاعب", de: "Athleten-Eingabeprofil", fr: "Profil de saisie de l'athlète", ja: "選手入力プロファイル", es: "Perfil de datos del atleta" },
    "Position Recommendation Engine": { ar: "محرّك توصية المراكز", de: "Positions-Empfehlungs-Engine", fr: "Moteur de recommandation de poste", ja: "ポジション推薦エンジン", es: "Motor de recomendación de posición" },
    "Performance Dashboard": { ar: "لوحة تحكم الأداء", de: "Leistungs-Dashboard", fr: "Tableau de bord de performance", ja: "パフォーマンスダッシュボード", es: "Panel de rendimiento" },
    "Professional Report": { ar: "تقرير احترافي", de: "Professioneller Bericht", fr: "Rapport professionnel", ja: "プロ向けレポート", es: "Informe profesional" },
    "Injury-Risk & Biomechanics": { ar: "خطر الإصابة والميكانيكا الحيوية", de: "Verletzungsrisiko & Biomechanik", fr: "Risque de blessure et biomécanique", ja: "けがリスク＆バイオメカニクス", es: "Riesgo de lesión y biomecánica" },
    "Cognitive & Tactical": { ar: "الإدراك والتكتيك", de: "Kognitiv & Taktisch", fr: "Cognitif et tactique", ja: "認知＆戦術", es: "Cognitivo y táctico" },
    // flow
    "Capture": { ar: "التقاط", de: "Erfassen", fr: "Capturer", ja: "取り込み", es: "Capturar" },
    "Upload a video, stream live, or self-assess.": { ar: "ارفع فيديو، أو بثّ مباشر، أو قيّم نفسك.", de: "Lade ein Video hoch, streame live oder mache eine Selbsteinschätzung.", fr: "Téléversez une vidéo, diffusez en direct ou auto-évaluez-vous.", ja: "動画をアップロード、ライブ配信、または自己評価。", es: "Sube un vídeo, transmite en vivo o autoevalúate." },
    "Track & pose": { ar: "التتبّع والوضعية", de: "Tracking & Pose", fr: "Suivi et posture", ja: "トラッキングと姿勢", es: "Seguimiento y postura" },
    "AI tracks movement and body pose, frame by frame.": { ar: "يتتبّع الذكاء الاصطناعي الحركة ووضعية الجسم إطارًا بإطار.", de: "Die KI verfolgt Bewegung und Körperhaltung, Bild für Bild.", fr: "L'IA suit le mouvement et la posture, image par image.", ja: "AIが動きと姿勢をフレームごとに追跡。", es: "La IA sigue el movimiento y la postura, fotograma a fotograma." },
    "Score": { ar: "التقييم", de: "Bewerten", fr: "Évaluer", ja: "スコア化", es: "Puntuar" },
    "16 dimensions — speed, power, biomechanics, injury risk.": { ar: "16 بُعدًا — السرعة والقوة والميكانيكا الحيوية وخطر الإصابة.", de: "16 Dimensionen — Geschwindigkeit, Kraft, Biomechanik, Verletzungsrisiko.", fr: "16 dimensions — vitesse, puissance, biomécanique, risque de blessure.", ja: "16の指標 — スピード、パワー、バイオメカニクス、けがリスク。", es: "16 dimensiones — velocidad, potencia, biomecánica, riesgo de lesión." },
    "Personalize": { ar: "التخصيص", de: "Personalisieren", fr: "Personnaliser", ja: "パーソナライズ", es: "Personalizar" },
    "A tailored position fit and development plan.": { ar: "ملاءمة مركز مخصّصة وخطة تطوير.", de: "Eine maßgeschneiderte Positionswahl und ein Entwicklungsplan.", fr: "Un poste adapté et un plan de développement sur mesure.", ja: "最適なポジション適性と育成プラン。", es: "Un ajuste de posición a medida y un plan de desarrollo." },
    "Self-assess": { ar: "تقييم ذاتي", de: "Selbsttest", fr: "Auto-éval", ja: "自己評価", es: "Autoeval" },
    // technology cards
    "Computer Vision": { ar: "الرؤية الحاسوبية", de: "Computer Vision", fr: "Vision par ordinateur", ja: "コンピュータビジョン", es: "Visión por computador" },
    "Tracks every player and joint in 3D, frame by frame.": { ar: "يتتبّع كل لاعب ومفصل في الأبعاد الثلاثية، إطارًا بإطار.", de: "Verfolgt jeden Spieler und jedes Gelenk in 3D, Bild für Bild.", fr: "Suit chaque joueur et articulation en 3D, image par image.", ja: "すべての選手と関節を3Dでフレームごとに追跡。", es: "Sigue a cada jugador y articulación en 3D, fotograma a fotograma." },
    "Performance AI": { ar: "ذكاء الأداء", de: "Performance-KI", fr: "IA de performance", ja: "パフォーマンスAI", es: "IA de rendimiento" },
    "Turns raw movement into speed, power, stamina & biomechanics scores.": { ar: "يحوّل الحركة الخام إلى درجات للسرعة والقوة والتحمّل والميكانيكا الحيوية.", de: "Verwandelt rohe Bewegung in Werte für Geschwindigkeit, Kraft, Ausdauer & Biomechanik.", fr: "Transforme le mouvement brut en scores de vitesse, puissance, endurance et biomécanique.", ja: "生の動きをスピード・パワー・スタミナ・バイオメカニクスのスコアへ。", es: "Convierte el movimiento en puntuaciones de velocidad, potencia, resistencia y biomecánica." },
    "Real-Time Engine": { ar: "محرّك الزمن الحقيقي", de: "Echtzeit-Engine", fr: "Moteur temps réel", ja: "リアルタイムエンジン", es: "Motor en tiempo real" },
    "Processes uploaded video, live feeds and self-assessments at scale.": { ar: "يعالج الفيديوهات المرفوعة والبثّ المباشر والتقييمات الذاتية على نطاق واسع.", de: "Verarbeitet hochgeladene Videos, Live-Feeds und Selbsteinschätzungen in großem Maßstab.", fr: "Traite à grande échelle les vidéos, flux en direct et auto-évaluations.", ja: "アップロード動画・ライブ映像・自己評価を大規模に処理。", es: "Procesa a gran escala vídeos subidos, transmisiones en vivo y autoevaluaciones." },
    "Athlete Reports": { ar: "تقارير اللاعبين", de: "Athletenberichte", fr: "Rapports d'athlète", ja: "アスリートレポート", es: "Informes de atleta" },
    "Position fit, injury risk and a personalized development plan — export-ready.": { ar: "ملاءمة المركز وخطر الإصابة وخطة تطوير مخصّصة — جاهزة للتصدير.", de: "Positionswahl, Verletzungsrisiko und ein personalisierter Entwicklungsplan — exportbereit.", fr: "Adéquation au poste, risque de blessure et plan de développement personnalisé — prêt à exporter.", ja: "ポジション適性・けがリスク・パーソナライズされた育成プラン — エクスポート可能。", es: "Ajuste de posición, riesgo de lesión y plan de desarrollo personalizado — listo para exportar." },
    // compatible-with
    "Aligned with the standards & tools elite football trusts": { ar: "متوافق مع المعايير والأدوات التي تثق بها كرة القدم النخبوية", de: "Abgestimmt auf die Standards & Tools, denen der Spitzenfußball vertraut", fr: "Aligné sur les standards et outils auxquels le football d'élite fait confiance", ja: "エリートサッカーが信頼する基準とツールに準拠", es: "Alineado con los estándares y herramientas que el fútbol de élite confía" },
    "injury-prevention protocol": { ar: "بروتوكول الوقاية من الإصابات", de: "Verletzungspräventions-Protokoll", fr: "protocole de prévention des blessures", ja: "傷害予防プロトコル", es: "protocolo de prevención de lesiones" },
    "load & distance": { ar: "الحِمل والمسافة", de: "Last & Distanz", fr: "charge et distance", ja: "負荷と距離", es: "carga y distancia" },
    "camera & video": { ar: "الكاميرا والفيديو", de: "Kamera & Video", fr: "caméra et vidéo", ja: "カメラと映像", es: "cámara y vídeo" },
    "movement screening": { ar: "فحص الحركة", de: "Bewegungs-Screening", fr: "dépistage du mouvement", ja: "動作スクリーニング", es: "cribado del movimiento" },
    "endurance tests": { ar: "اختبارات التحمّل", de: "Ausdauertests", fr: "tests d'endurance", ja: "持久力テスト", es: "pruebas de resistencia" },
    "jump & power": { ar: "القفز والقوة", de: "Sprung & Kraft", fr: "saut et puissance", ja: "ジャンプとパワー", es: "salto y potencia" },
    "open data export": { ar: "تصدير بيانات مفتوح", de: "offener Datenexport", fr: "export de données ouvert", ja: "オープンデータ書き出し", es: "exportación de datos abierta" },
    // pitch chips + button
    "Camera AI estimates": { ar: "تقديرات الكاميرا بالذكاء الاصطناعي", de: "Kamera-KI schätzt", fr: "L'IA caméra estime", ja: "カメラAIが推定", es: "La IA de cámara estima" },
    "Hardware confirms": { ar: "الأجهزة تؤكّد", de: "Hardware bestätigt", fr: "Le matériel confirme", ja: "ハードウェアが確認", es: "El hardware confirma" },
    "Want a 10-min demo?": { ar: "هل تريد عرضًا توضيحيًا في 10 دقائق؟", de: "Lust auf eine 10-Min-Demo?", fr: "Envie d'une démo de 10 min ?", ja: "10分のデモはいかが？", es: "¿Quieres una demo de 10 min?" },
    // modules pillars
    "Physical performance": { ar: "الأداء البدني", de: "Körperliche Leistung", fr: "Performance physique", ja: "フィジカルパフォーマンス", es: "Rendimiento físico" },
    "Movement & health": { ar: "الحركة والصحة", de: "Bewegung & Gesundheit", fr: "Mouvement et santé", ja: "動作と健康", es: "Movimiento y salud" },
    "Intelligence & development": { ar: "الذكاء والتطوير", de: "Intelligenz & Entwicklung", fr: "Intelligence et développement", ja: "知能と育成", es: "Inteligencia y desarrollo" },
    // report panels
    "Performance radar": { ar: "رادار الأداء", de: "Leistungsradar", fr: "Radar de performance", ja: "パフォーマンスレーダー", es: "Radar de rendimiento" },
    "Movement heatmap": { ar: "خريطة الحركة الحرارية", de: "Bewegungs-Heatmap", fr: "Heatmap de mouvement", ja: "移動ヒートマップ", es: "Mapa de calor de movimiento" },
    "Position recommendation": { ar: "توصية المركز", de: "Positionsempfehlung", fr: "Recommandation de poste", ja: "ポジション提案", es: "Recomendación de posición" },
    "Injury-risk map": { ar: "خريطة خطر الإصابة", de: "Verletzungsrisiko-Karte", fr: "Carte de risque de blessure", ja: "けがリスクマップ", es: "Mapa de riesgo de lesión" },
    "Physical test results": { ar: "نتائج الاختبارات البدنية", de: "Ergebnisse der Fitnesstests", fr: "Résultats des tests physiques", ja: "フィジカルテスト結果", es: "Resultados de pruebas físicas" },
    "Body & biomechanics": { ar: "الجسم والميكانيكا الحيوية", de: "Körper & Biomechanik", fr: "Corps et biomécanique", ja: "身体とバイオメカニクス", es: "Cuerpo y biomecánica" },
    "Targeted development plan": { ar: "خطة تطوير موجّهة", de: "Gezielter Entwicklungsplan", fr: "Plan de développement ciblé", ja: "重点育成プラン", es: "Plan de desarrollo específico" },
    "Pipeline trace": { ar: "تتبّع المسار", de: "Pipeline-Verlauf", fr: "Traçabilité du pipeline", ja: "パイプライン履歴", es: "Traza del proceso" },
    // footer links
    "Core engines": { ar: "المحرّكات الأساسية", de: "Kern-Engines", fr: "Moteurs principaux", ja: "コアエンジン", es: "Motores principales" },
    "All 19 modules": { ar: "كل الوحدات الـ19", de: "Alle 19 Module", fr: "Les 19 modules", ja: "19のモジュール全て", es: "Los 19 módulos" },
    "Dashboard": { ar: "لوحة التحكم", de: "Dashboard", fr: "Tableau de bord", ja: "ダッシュボード", es: "Panel" },
    "Injury risk": { ar: "خطر الإصابة", de: "Verletzungsrisiko", fr: "Risque de blessure", ja: "けがリスク", es: "Riesgo de lesión" },
    "Youth development": { ar: "تطوير الناشئين", de: "Nachwuchsförderung", fr: "Développement des jeunes", ja: "ユース育成", es: "Desarrollo juvenil" },
    "Return-to-play": { ar: "العودة للعب", de: "Return-to-Play", fr: "Retour au jeu", ja: "復帰判断", es: "Vuelta al juego" },
    "Position engine": { ar: "محرّك المراكز", de: "Positions-Engine", fr: "Moteur de poste", ja: "ポジションエンジン", es: "Motor de posición" },
    "Create account": { ar: "إنشاء حساب", de: "Konto erstellen", fr: "Créer un compte", ja: "アカウント作成", es: "Crear cuenta" },
    "Safety & ethics": { ar: "السلامة والأخلاقيات", de: "Sicherheit & Ethik", fr: "Sécurité et éthique", ja: "安全と倫理", es: "Seguridad y ética" },
    // auth modal
    "Welcome back": { ar: "مرحبًا بعودتك", de: "Willkommen zurück", fr: "Bon retour", ja: "おかえりなさい", es: "Bienvenido de nuevo" },
    "Sign in to your PlayerDNA Labs workspace.": { ar: "سجّل الدخول إلى مساحة عمل PlayerDNA Labs.", de: "Melde dich in deinem PlayerDNA Labs Workspace an.", fr: "Connectez-vous à votre espace PlayerDNA Labs.", ja: "PlayerDNA Labs のワークスペースにログイン。", es: "Inicia sesión en tu espacio de PlayerDNA Labs." },
    "Sign in": { ar: "تسجيل الدخول", de: "Anmelden", fr: "Connexion", ja: "ログイン", es: "Iniciar sesión" },
    "Full name": { ar: "الاسم الكامل", de: "Vollständiger Name", fr: "Nom complet", ja: "氏名", es: "Nombre completo" },
    "Club / academy": { ar: "النادي / الأكاديمية", de: "Verein / Akademie", fr: "Club / académie", ja: "クラブ / アカデミー", es: "Club / academia" },
    "Email": { ar: "البريد الإلكتروني", de: "E-Mail", fr: "E-mail", ja: "メール", es: "Correo" },
    "Password": { ar: "كلمة المرور", de: "Passwort", fr: "Mot de passe", ja: "パスワード", es: "Contraseña" },
    "Remember me": { ar: "تذكّرني", de: "Angemeldet bleiben", fr: "Se souvenir de moi", ja: "ログイン状態を保持", es: "Recordarme" },
    "I agree to the terms": { ar: "أوافق على الشروط", de: "Ich stimme den Bedingungen zu", fr: "J'accepte les conditions", ja: "規約に同意します", es: "Acepto los términos" },
    "Forgot password?": { ar: "نسيت كلمة المرور؟", de: "Passwort vergessen?", fr: "Mot de passe oublié ?", ja: "パスワードをお忘れですか？", es: "¿Olvidaste tu contraseña?" },
    "or continue with": { ar: "أو تابع عبر", de: "oder weiter mit", fr: "ou continuer avec", ja: "または次で続行", es: "o continúa con" }
  };

  var loaded = {}, captured = null;
  function ensureFont(lang) {
    if (FONTS[lang] && !loaded[lang]) {
      var l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONTS[lang];
      document.head.appendChild(l); loaded[lang] = true;
    }
  }

  function skip(node) {
    var p = node.parentNode;
    while (p && p.nodeType === 1) {
      var tag = p.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "svg" || p.namespaceURI === "http://www.w3.org/2000/svg") return true;
      if (p.id === "loader") return true;
      if (p.hasAttribute("data-i18n") || p.hasAttribute("data-i18n-html") || p.hasAttribute("data-type")) return true;
      if (p.classList && (p.classList.contains("lang-menu") || p.classList.contains("lang-row") || p.classList.contains("lang-code"))) return true;
      p = p.parentNode;
    }
    return false;
  }

  function captureNodes() {
    captured = [];
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      var t = n.nodeValue.replace(/\s+/g, " ").trim();
      if (t && P[t] && !skip(n)) captured.push({ node: n, en: t, raw: n.nodeValue });
    }
  }

  function tr(lang, key) {
    var d = DICT[lang] || {};
    return d[key] != null ? d[key] : DICT.en[key];
  }

  function apply(lang) {
    if (!DICT[lang]) lang = "en";
    ensureFont(lang);
    var html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", RTL[lang] ? "rtl" : "ltr");

    var i, els;
    els = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < els.length; i++) { var v = tr(lang, els[i].getAttribute("data-i18n")); if (v != null) els[i].textContent = v; }
    els = document.querySelectorAll("[data-i18n-html]");
    for (i = 0; i < els.length; i++) { var vh = tr(lang, els[i].getAttribute("data-i18n-html")); if (vh != null) els[i].innerHTML = vh; }
    els = document.querySelectorAll("[data-i18n-ph]");
    for (i = 0; i < els.length; i++) { var vp = tr(lang, els[i].getAttribute("data-i18n-ph")); if (vp != null) els[i].setAttribute("placeholder", vp); }

    if (!captured) captureNodes();
    for (i = 0; i < captured.length; i++) {
      var c = captured[i], e = P[c.en];
      var val = lang === "en" ? c.en : (e && e[lang]) || c.en;
      c.node.nodeValue = c.raw.replace(c.en, val);
    }

    var codes = document.querySelectorAll(".lang-code");
    for (i = 0; i < codes.length; i++) codes[i].textContent = lang.toUpperCase();
    var opts = document.querySelectorAll("[data-lang]");
    for (i = 0; i < opts.length; i++) {
      var on = opts[i].getAttribute("data-lang") === lang;
      opts[i].setAttribute("aria-selected", on ? "true" : "false");
      opts[i].classList.toggle("active", on);
    }
    try { localStorage.setItem("pdna_lang", lang); } catch (e2) {}
  }

  function closeAll() {
    var open = document.querySelectorAll(".lang-switch.open");
    for (var i = 0; i < open.length; i++) {
      open[i].classList.remove("open");
      var b = open[i].querySelector(".lang-btn");
      if (b) b.setAttribute("aria-expanded", "false");
    }
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem("pdna_lang"); } catch (e) {}
    var browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    apply(saved || (DICT[browser] ? browser : "en"));

    var btns = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function (e) {
        e.stopPropagation();
        var sw = this.closest(".lang-switch");
        var willOpen = !sw.classList.contains("open");
        closeAll();
        if (willOpen) { sw.classList.add("open"); this.setAttribute("aria-expanded", "true"); }
      });
    }
    var opts = document.querySelectorAll("[data-lang]");
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener("click", function (e) {
        e.preventDefault();
        apply(this.getAttribute("data-lang"));
        closeAll();
        var mm = document.querySelector(".mobile-menu"); if (mm) mm.classList.remove("open");
        var nt = document.querySelector(".nav-toggle"); if (nt) nt.classList.remove("open");
      });
    }
    document.addEventListener("click", closeAll);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
