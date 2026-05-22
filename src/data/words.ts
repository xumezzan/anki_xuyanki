// Shared default vocabulary deck used by Vercel serverless API and frontend.
export const DEFAULT_PREMIUM_WORDS = [

  // ── IT & Tech ──────────────────────────────────────────────────────────────
  {
    word: "Merge",
    transcription: "[mɜːdʒ]",
    translation: "Объединять / Сливать",
    explanation: "Объединение двух или более элементов (например, веток кода) в единое целое.",
    example: "Let's merge the development branch into production.",
    exampleTranslation: "Давай зальём ветку разработки в продакшн.",
    emoji: "💻", partOfSpeech: "verb", category: "IT"
  },
  {
    word: "Refactoring",
    transcription: "[riːˈfæktərɪŋ]",
    translation: "Рефакторинг",
    explanation: "Улучшение структуры кода без изменения его поведения.",
    example: "We need a refactoring session to clean up this legacy code.",
    exampleTranslation: "Нам нужна сессия рефакторинга, чтобы навести порядок в старом коде.",
    emoji: "⚙️", partOfSpeech: "noun", category: "IT"
  },
  {
    word: "Deployment",
    transcription: "[dɪˈplɔɪmənt]",
    translation: "Развёртывание / Деплой",
    explanation: "Процесс переноса готового кода на рабочий сервер.",
    example: "The automatic deployment to Vercel was successful.",
    exampleTranslation: "Автоматический деплой на Vercel прошёл успешно.",
    emoji: "🚀", partOfSpeech: "noun", category: "IT"
  },
  {
    word: "Repository",
    transcription: "[rɪˈpɒzɪtəri]",
    translation: "Репозиторий",
    explanation: "Место хранения файлов проекта и истории изменений под контролем Git.",
    example: "Clone this repository to start working locally.",
    exampleTranslation: "Склонируй репозиторий, чтобы работать локально.",
    emoji: "📁", partOfSpeech: "noun", category: "IT"
  },
  {
    word: "Debugging",
    transcription: "[diːˈbʌɡɪŋ]",
    translation: "Отладка",
    explanation: "Процесс поиска и исправления ошибок в программном коде.",
    example: "I spent three hours debugging this nasty null pointer exception.",
    exampleTranslation: "Я потратил три часа на отладку этого противного исключения нулевого указателя.",
    emoji: "🐛", partOfSpeech: "noun", category: "IT"
  },
  {
    word: "API",
    transcription: "[ˌeɪ.piːˈaɪ]",
    translation: "Интерфейс программирования",
    explanation: "Набор правил, по которым программы общаются друг с другом.",
    example: "We call the weather API to get real-time forecast data.",
    exampleTranslation: "Мы обращаемся к API погоды, чтобы получать данные в реальном времени.",
    emoji: "🔌", partOfSpeech: "noun", category: "IT"
  },
  {
    word: "Framework",
    transcription: "[ˈfreɪmwɜːk]",
    translation: "Фреймворк",
    explanation: "Готовая платформа с инструментами для разработки приложений.",
    example: "React is a popular frontend framework developed by Meta.",
    exampleTranslation: "React — популярный фронтенд-фреймворк, разработанный Meta.",
    emoji: "🏗️", partOfSpeech: "noun", category: "IT"
  },
  {
    word: "Scalability",
    transcription: "[ˌskeɪləˈbɪlɪti]",
    translation: "Масштабируемость",
    explanation: "Способность системы справляться с ростом нагрузки без потери производительности.",
    example: "Scalability is a key requirement for any successful startup product.",
    exampleTranslation: "Масштабируемость — ключевое требование для любого успешного стартапа.",
    emoji: "📈", partOfSpeech: "noun", category: "IT"
  },
  {
    word: "Pull request",
    transcription: "[pʊl rɪˈkwest]",
    translation: "Пул-реквест",
    explanation: "Запрос на добавление изменений из одной ветки в другую с возможностью ревью.",
    example: "Open a pull request so the team can review your changes.",
    exampleTranslation: "Открой пул-реквест, чтобы команда могла проверить твои изменения.",
    emoji: "🔍", partOfSpeech: "noun", category: "IT"
  },
  {
    word: "Cache",
    transcription: "[kæʃ]",
    translation: "Кэш",
    explanation: "Временное хранилище данных для ускорения повторного доступа к ним.",
    example: "Clear the cache if you don't see the latest version of the page.",
    exampleTranslation: "Очисти кэш, если не видишь последнюю версию страницы.",
    emoji: "⚡", partOfSpeech: "noun", category: "IT"
  },

  // ── Travel ─────────────────────────────────────────────────────────────────
  {
    word: "Wanderlust",
    transcription: "[ˈwɒndəlʌst]",
    translation: "Страсть к путешествиям",
    explanation: "Непреодолимое желание путешествовать и исследовать мир.",
    example: "Her wanderlust led her to visit forty countries before thirty.",
    exampleTranslation: "Страсть к путешествиям привела её к посещению сорока стран до тридцати лет.",
    emoji: "✈️", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Itinerary",
    transcription: "[aɪˈtɪnərəri]",
    translation: "Маршрут / План поездки",
    explanation: "Подробный план путешествия с датами, местами и активностями.",
    example: "We built a detailed itinerary for our two-week trip to Japan.",
    exampleTranslation: "Мы составили подробный маршрут для двухнедельной поездки в Японию.",
    emoji: "🗺️", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Luggage",
    transcription: "[ˈlʌɡɪdʒ]",
    translation: "Багаж",
    explanation: "Чемоданы и сумки путешественника.",
    example: "Please label your luggage with your contact details before boarding.",
    exampleTranslation: "Пожалуйста, прикрепите бирку с контактами к багажу перед посадкой.",
    emoji: "🧳", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Layover",
    transcription: "[ˈleɪˌoʊvər]",
    translation: "Пересадка / Транзит",
    explanation: "Остановка в промежуточном аэропорту по пути к конечному пункту.",
    example: "We have a six-hour layover in Dubai before flying to Bangkok.",
    exampleTranslation: "У нас шестичасовая пересадка в Дубае перед перелётом в Бангкок.",
    emoji: "🛬", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Jet lag",
    transcription: "[dʒɛt læɡ]",
    translation: "Джетлаг / Смена часовых поясов",
    explanation: "Усталость и сбой биоритмов после перелёта через много часовых поясов.",
    example: "It took me three days to recover from the jet lag after flying to Tokyo.",
    exampleTranslation: "Мне потребовалось три дня, чтобы оправиться от джетлага после перелёта в Токио.",
    emoji: "😴", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Backpacking",
    transcription: "[ˈbækˌpækɪŋ]",
    translation: "Бэкпэкинг / Путешествие с рюкзаком",
    explanation: "Бюджетные самостоятельные путешествия с минимумом вещей.",
    example: "Backpacking through Southeast Asia is an unforgettable adventure.",
    exampleTranslation: "Бэкпэкинг по Юго-Восточной Азии — незабываемое приключение.",
    emoji: "🎒", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Visa",
    transcription: "[ˈviːzə]",
    translation: "Виза",
    explanation: "Официальное разрешение на въезд в страну.",
    example: "You need to apply for a visa at least two weeks before departure.",
    exampleTranslation: "Нужно подать заявление на визу минимум за две недели до отъезда.",
    emoji: "📋", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Hostel",
    transcription: "[ˈhɒstəl]",
    translation: "Хостел",
    explanation: "Бюджетное жильё с общими комнатами и удобствами для путешественников.",
    example: "We stayed at a cozy hostel in the heart of Barcelona for just €15 a night.",
    exampleTranslation: "Мы остановились в уютном хостеле в центре Барселоны всего за 15 евро в сутки.",
    emoji: "🏠", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Sightseeing",
    transcription: "[ˈsaɪtˌsiːɪŋ]",
    translation: "Осмотр достопримечательностей",
    explanation: "Посещение интересных и исторических мест в новом городе или стране.",
    example: "We spent the whole day sightseeing in Rome — the Colosseum was breathtaking.",
    exampleTranslation: "Мы целый день осматривали достопримечательности Рима — Колизей был потрясающим.",
    emoji: "🏛️", partOfSpeech: "noun", category: "Travel"
  },
  {
    word: "Customs",
    transcription: "[ˈkʌstəmz]",
    translation: "Таможня",
    explanation: "Государственный контроль на границе для проверки людей и товаров.",
    example: "Declare all goods over €300 when passing through customs.",
    exampleTranslation: "Декларируй все товары стоимостью свыше 300 евро при прохождении таможни.",
    emoji: "🛂", partOfSpeech: "noun", category: "Travel"
  },

  // ── Business ───────────────────────────────────────────────────────────────
  {
    word: "Synergy",
    transcription: "[ˈsɪnədʒi]",
    translation: "Синергия",
    explanation: "Совместные усилия дают результат больше, чем сумма отдельных вкладов.",
    example: "The merger created real synergy between the two product teams.",
    exampleTranslation: "Слияние создало настоящую синергию между двумя продуктовыми командами.",
    emoji: "💼", partOfSpeech: "noun", category: "Business"
  },
  {
    word: "Deadline",
    transcription: "[ˈdɛdlaɪn]",
    translation: "Крайний срок / Дедлайн",
    explanation: "Предельный срок завершения задачи или проекта.",
    example: "We must submit the proposal before the Friday deadline.",
    exampleTranslation: "Мы должны сдать предложение до пятничного дедлайна.",
    emoji: "⏳", partOfSpeech: "noun", category: "Business"
  },
  {
    word: "Outsource",
    transcription: "[ˈaʊtsɔːs]",
    translation: "Передавать на аутсорсинг",
    explanation: "Делегировать задачи внешним исполнителям или компаниям.",
    example: "Many startups outsource their design work to freelancers.",
    exampleTranslation: "Многие стартапы отдают дизайн на аутсорс фрилансерам.",
    emoji: "🌍", partOfSpeech: "verb", category: "Business"
  },
  {
    word: "Pitch",
    transcription: "[pɪtʃ]",
    translation: "Питч / Презентация идеи",
    explanation: "Короткая убедительная презентация идеи или продукта для инвесторов.",
    example: "The startup delivered an impressive pitch at the demo day.",
    exampleTranslation: "Стартап представил впечатляющий питч на демо-дне.",
    emoji: "🎤", partOfSpeech: "noun", category: "Business"
  },
  {
    word: "Revenue",
    transcription: "[ˈrɛvənjuː]",
    translation: "Выручка / Доход",
    explanation: "Общий доход компании от продаж товаров или услуг.",
    example: "The company's annual revenue grew by 40% this year.",
    exampleTranslation: "Годовая выручка компании выросла на 40% в этом году.",
    emoji: "💰", partOfSpeech: "noun", category: "Business"
  },
  {
    word: "Stakeholder",
    transcription: "[ˈsteɪkˌhoʊldər]",
    translation: "Заинтересованная сторона",
    explanation: "Человек или группа, которых затрагивают решения компании или проекта.",
    example: "We need to present the roadmap to all key stakeholders by Friday.",
    exampleTranslation: "Нам нужно представить дорожную карту всем ключевым стейкхолдерам до пятницы.",
    emoji: "🤝", partOfSpeech: "noun", category: "Business"
  },
  {
    word: "Leverage",
    transcription: "[ˈlɛvərɪdʒ]",
    translation: "Использовать с выгодой / Рычаг",
    explanation: "Использовать ресурсы, связи или преимущества для достижения цели.",
    example: "We can leverage our existing customer base to grow the new product.",
    exampleTranslation: "Мы можем задействовать нашу существующую базу клиентов для продвижения нового продукта.",
    emoji: "🔧", partOfSpeech: "verb", category: "Business"
  },
  {
    word: "KPI",
    transcription: "[ˌkeɪ.piːˈaɪ]",
    translation: "Ключевой показатель эффективности",
    explanation: "Измеримый показатель, отражающий успех в достижении бизнес-целей.",
    example: "Our main KPI this quarter is to reduce churn below five percent.",
    exampleTranslation: "Наш главный KPI в этом квартале — снизить отток ниже пяти процентов.",
    emoji: "📊", partOfSpeech: "noun", category: "Business"
  },
  {
    word: "Equity",
    transcription: "[ˈɛkwɪti]",
    translation: "Акционерный капитал / Доля",
    explanation: "Доля собственности в компании, выраженная в акциях.",
    example: "Early employees received equity as part of their compensation package.",
    exampleTranslation: "Первые сотрудники получили долю в компании как часть компенсационного пакета.",
    emoji: "📑", partOfSpeech: "noun", category: "Business"
  },
  {
    word: "Benchmark",
    transcription: "[ˈbɛntʃmɑːk]",
    translation: "Эталон / Ориентир",
    explanation: "Стандарт или точка отсчёта для сравнения показателей.",
    example: "Use industry benchmarks to evaluate your team's performance.",
    exampleTranslation: "Используй отраслевые ориентиры для оценки показателей своей команды.",
    emoji: "🏆", partOfSpeech: "noun", category: "Business"
  },

  // ── Everyday ───────────────────────────────────────────────────────────────
  {
    word: "Serendipity",
    transcription: "[ˌsɛrənˈdɪpɪti]",
    translation: "Счастливая случайность",
    explanation: "Случайное обнаружение чего-то приятного или ценного.",
    example: "Meeting my best friend on that train was pure serendipity.",
    exampleTranslation: "Встретить лучшего друга в том поезде — чистая счастливая случайность.",
    emoji: "✨", partOfSpeech: "noun", category: "Everyday"
  },
  {
    word: "Procrastinate",
    transcription: "[prəʊˈkræstɪneɪt]",
    translation: "Откладывать на потом",
    explanation: "Постоянно откладывать важные дела в пользу более приятных занятий.",
    example: "Stop procrastinating — just start with the first small step.",
    exampleTranslation: "Хватит откладывать — просто начни с первого маленького шага.",
    emoji: "🥱", partOfSpeech: "verb", category: "Everyday"
  },
  {
    word: "Cognizant",
    transcription: "[ˈkɒɡnɪzənt]",
    translation: "Осведомлённый / Сознающий",
    explanation: "Понимающий ситуацию и осознающий определённые факты.",
    example: "Be cognizant of your surroundings when walking alone at night.",
    exampleTranslation: "Будь внимателен к окружающей обстановке, когда идёшь один ночью.",
    emoji: "🧠", partOfSpeech: "adjective", category: "Everyday"
  },
  {
    word: "Empathy",
    transcription: "[ˈɛmpəθi]",
    translation: "Эмпатия / Сочувствие",
    explanation: "Способность понимать и разделять чужие чувства и переживания.",
    example: "Showing empathy is one of the most important skills in any relationship.",
    exampleTranslation: "Проявление эмпатии — один из важнейших навыков в любых отношениях.",
    emoji: "🫂", partOfSpeech: "noun", category: "Everyday"
  },
  {
    word: "Resilience",
    transcription: "[rɪˈzɪliəns]",
    translation: "Стойкость / Устойчивость",
    explanation: "Способность быстро восстанавливаться после трудностей и неудач.",
    example: "Her resilience after losing the job was truly inspiring.",
    exampleTranslation: "Её стойкость после потери работы была по-настоящему вдохновляющей.",
    emoji: "💪", partOfSpeech: "noun", category: "Everyday"
  },
  {
    word: "Mindset",
    transcription: "[ˈmaɪndset]",
    translation: "Образ мышления / Менталитет",
    explanation: "Устойчивые убеждения и способ видения мира, влияющие на поведение.",
    example: "Adopting a growth mindset will help you learn faster and fail better.",
    exampleTranslation: "Принятие установки на рост поможет тебе учиться быстрее и достойно переносить неудачи.",
    emoji: "🎯", partOfSpeech: "noun", category: "Everyday"
  },
  {
    word: "Acknowledge",
    transcription: "[əkˈnɒlɪdʒ]",
    translation: "Признавать / Подтверждать",
    explanation: "Открыто признавать существование чего-либо или выражать признательность.",
    example: "It's important to acknowledge your mistakes and learn from them.",
    exampleTranslation: "Важно признавать свои ошибки и учиться на них.",
    emoji: "👋", partOfSpeech: "verb", category: "Everyday"
  },
  {
    word: "Overwhelmed",
    transcription: "[ˌoʊvərˈwɛlmd]",
    translation: "Перегруженный / Подавленный",
    explanation: "Чувствовать себя неспособным справиться с количеством дел или эмоций.",
    example: "I felt completely overwhelmed by the amount of work during exam week.",
    exampleTranslation: "Я чувствовал себя полностью перегруженным объёмом работы в период экзаменов.",
    emoji: "😵", partOfSpeech: "adjective", category: "Everyday"
  },
  {
    word: "Awkward",
    transcription: "[ˈɔːkwəd]",
    translation: "Неловкий / Неудобный",
    explanation: "Ощущение дискомфорта или смущения в социальной ситуации.",
    example: "There was an awkward silence after he made that joke.",
    exampleTranslation: "После его шутки наступила неловкая тишина.",
    emoji: "😬", partOfSpeech: "adjective", category: "Everyday"
  },
  {
    word: "Spontaneous",
    transcription: "[spɒnˈteɪniəs]",
    translation: "Спонтанный / Импульсивный",
    explanation: "Действие без предварительного планирования, по внутреннему порыву.",
    example: "We made a spontaneous decision to drive to the sea at midnight.",
    exampleTranslation: "Мы приняли спонтанное решение поехать к морю в полночь.",
    emoji: "🌊", partOfSpeech: "adjective", category: "Everyday"
  },

  // ── Movies & TV ────────────────────────────────────────────────────────────
  {
    word: "Cliffhanger",
    transcription: "[ˈklɪfˌhæŋər]",
    translation: "Клиффхэнгер",
    explanation: "Обрыв серии на самом напряжённом моменте, заставляющий ждать продолжения.",
    example: "The season finale ended on a massive cliffhanger that shocked everyone.",
    exampleTranslation: "Финал сезона завершился огромным клиффхэнгером, который шокировал всех.",
    emoji: "🎬", partOfSpeech: "noun", category: "Movies"
  },
  {
    word: "Plot twist",
    transcription: "[plɒt twɪst]",
    translation: "Поворот сюжета",
    explanation: "Неожиданное изменение хода событий в истории.",
    example: "The plot twist at the end completely changed how I saw the whole film.",
    exampleTranslation: "Поворот сюжета в конце полностью изменил моё восприятие всего фильма.",
    emoji: "🔄", partOfSpeech: "noun", category: "Movies"
  },
  {
    word: "Blockbuster",
    transcription: "[ˈblɒkˌbʌstər]",
    translation: "Блокбастер",
    explanation: "Масштабный, дорогой фильм с огромной аудиторией.",
    example: "Avatar became the highest-grossing blockbuster of all time.",
    exampleTranslation: "«Аватар» стал самым кассовым блокбастером всех времён.",
    emoji: "🍿", partOfSpeech: "noun", category: "Movies"
  },
  {
    word: "Sequel",
    transcription: "[ˈsiːkwəl]",
    translation: "Сиквел / Продолжение",
    explanation: "Фильм или книга, продолжающие историю предыдущего произведения.",
    example: "The sequel was even better than the original movie.",
    exampleTranslation: "Сиквел оказался даже лучше оригинального фильма.",
    emoji: "2️⃣", partOfSpeech: "noun", category: "Movies"
  },
  {
    word: "Binge-watch",
    transcription: "[bɪndʒ wɒtʃ]",
    translation: "Смотреть запоем",
    explanation: "Смотреть множество эпизодов сериала подряд без перерыва.",
    example: "I binge-watched the entire first season of Squid Game in one night.",
    exampleTranslation: "Я посмотрел весь первый сезон «Игры в кальмара» за одну ночь.",
    emoji: "📺", partOfSpeech: "verb", category: "Movies"
  },
  {
    word: "Cameo",
    transcription: "[ˈkæmioʊ]",
    translation: "Камео",
    explanation: "Короткое появление известной личности или актёра в небольшой роли.",
    example: "Stan Lee was famous for his cameos in Marvel movies.",
    exampleTranslation: "Стэн Ли был знаменит своими камео в фильмах Marvel.",
    emoji: "👀", partOfSpeech: "noun", category: "Movies"
  },
  {
    word: "Spoiler",
    transcription: "[ˈspɔɪlər]",
    translation: "Спойлер",
    explanation: "Раскрытие важных деталей сюжета, которые снижают интерес к просмотру.",
    example: "Don't give me any spoilers — I haven't watched the finale yet!",
    exampleTranslation: "Не спойли мне — я ещё не смотрел финал!",
    emoji: "🚨", partOfSpeech: "noun", category: "Movies"
  },
  {
    word: "Protagonist",
    transcription: "[prəˈtæɡənɪst]",
    translation: "Главный герой / Протагонист",
    explanation: "Центральный персонаж истории, вокруг которого разворачивается сюжет.",
    example: "The protagonist's journey from rags to riches inspired millions.",
    exampleTranslation: "Путь главного героя от нищеты к богатству вдохновил миллионы.",
    emoji: "🦸", partOfSpeech: "noun", category: "Movies"
  },
  {
    word: "Screenplay",
    transcription: "[ˈskriːnpleɪ]",
    translation: "Сценарий",
    explanation: "Письменный текст фильма с диалогами, описанием сцен и ремарками.",
    example: "She won an Oscar for Best Original Screenplay.",
    exampleTranslation: "Она получила «Оскар» за лучший оригинальный сценарий.",
    emoji: "📝", partOfSpeech: "noun", category: "Movies"
  },
  {
    word: "Franchise",
    transcription: "[ˈfræntʃaɪz]",
    translation: "Франшиза",
    explanation: "Серия связанных фильмов, игр или продуктов под одним брендом.",
    example: "The Marvel franchise has grossed over $25 billion worldwide.",
    exampleTranslation: "Франшиза Marvel собрала в мировом прокате свыше 25 миллиардов долларов.",
    emoji: "🎥", partOfSpeech: "noun", category: "Movies"
  },

  // ── Slang ──────────────────────────────────────────────────────────────────
  {
    word: "Glow up",
    transcription: "[ɡloʊ ʌp]",
    translation: "Преображение / Глоу-ап",
    explanation: "Впечатляющая трансформация внешности или уверенности в себе.",
    example: "Her glow up from high school to college was absolutely stunning.",
    exampleTranslation: "Её преображение со школы до колледжа было просто потрясающим.",
    emoji: "💎", partOfSpeech: "noun", category: "Slang"
  },
  {
    word: "No cap",
    transcription: "[noʊ kæp]",
    translation: "Без шуток / Чистая правда",
    explanation: "Выражение, подтверждающее, что говоришь правду.",
    example: "This app is genuinely life-changing, no cap.",
    exampleTranslation: "Это приложение буквально меняет жизнь, без шуток.",
    emoji: "🧢", partOfSpeech: "adverb", category: "Slang"
  },
  {
    word: "Vibe check",
    transcription: "[vaɪb tʃɛk]",
    translation: "Проверка атмосферы",
    explanation: "Оценка настроения или энергетики человека / места / ситуации.",
    example: "He walked in and immediately failed the vibe check.",
    exampleTranslation: "Он вошёл и сразу не прошёл проверку на атмосферу.",
    emoji: "🙌", partOfSpeech: "noun", category: "Slang"
  },
  {
    word: "Slay",
    transcription: "[sleɪ]",
    translation: "Уничтожать / Выглядеть потрясающе",
    explanation: "Делать что-то блестяще или выглядеть абсолютно безупречно.",
    example: "She walked into the room and absolutely slayed in that outfit.",
    exampleTranslation: "Она вошла в комнату и выглядела просто убийственно в этом наряде.",
    emoji: "👑", partOfSpeech: "verb", category: "Slang"
  },
  {
    word: "Lowkey",
    transcription: "[ˈloʊˌkiː]",
    translation: "Тихо / Немного / Слегка",
    explanation: "Незаметно, без лишней огласки; или — откровенно говоря.",
    example: "I'm lowkey obsessed with this new playlist.",
    exampleTranslation: "Я тихонько помешан на этом новом плейлисте.",
    emoji: "🤫", partOfSpeech: "adverb", category: "Slang"
  },
  {
    word: "Bussin",
    transcription: "[ˈbʌsɪn]",
    translation: "Огонь / Очень вкусно / Топ",
    explanation: "Что-то невероятно хорошее, особенно о еде или музыке.",
    example: "Bro, this shawarma is absolutely bussin.",
    exampleTranslation: "Бро, эта шаурма — абсолютный огонь.",
    emoji: "🔥", partOfSpeech: "adjective", category: "Slang"
  },
  {
    word: "Ghosting",
    transcription: "[ˈɡoʊstɪŋ]",
    translation: "Гостинг / Игнор",
    explanation: "Внезапно прекратить общение с кем-то без объяснений.",
    example: "He ghosted her after three months of dating without any explanation.",
    exampleTranslation: "Он пропал после трёх месяцев отношений без каких-либо объяснений.",
    emoji: "👻", partOfSpeech: "noun", category: "Slang"
  },
  {
    word: "FOMO",
    transcription: "[ˈfoʊmoʊ]",
    translation: "Страх упустить / ФОМО",
    explanation: "Тревога от мысли, что другие веселятся или переживают что-то, а ты нет.",
    example: "I have serious FOMO seeing everyone's festival photos on Instagram.",
    exampleTranslation: "У меня жуткий ФОМО, когда я вижу чужие фестивальные фото в Инстаграме.",
    emoji: "😰", partOfSpeech: "noun", category: "Slang"
  },
  {
    word: "Flex",
    transcription: "[flɛks]",
    translation: "Хвастаться / Понтоваться",
    explanation: "Демонстрировать своё богатство, достижения или способности напоказ.",
    example: "He's always flexing his new sneakers on social media.",
    exampleTranslation: "Он постоянно выставляет свои новые кроссовки напоказ в соцсетях.",
    emoji: "💪", partOfSpeech: "verb", category: "Slang"
  },
  {
    word: "Periodt",
    transcription: "[ˈpɪərɪədt]",
    translation: "Точка / И всё тут",
    explanation: "Усиленное «и разговор окончен» — для завершения аргумента.",
    example: "She is the best singer of her generation, periodt.",
    exampleTranslation: "Она лучшая певица своего поколения, и точка.",
    emoji: "‼️", partOfSpeech: "interjection", category: "Slang"
  },
];
