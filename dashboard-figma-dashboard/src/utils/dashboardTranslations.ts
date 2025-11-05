export type LanguageType = 'en' | 'es' | 'ru';

export const dashboardTranslations = {
  en: {
    // Header
    moodMeterDashboard: 'MoodMeter Dashboard',
    realTimeAnalytics: 'Real-time analytics and insights from mood tracking data',
    
    // Navigation & Controls
    adminLogin: 'Admin Login',
    logout: 'Logout',
    settings: 'Settings',
    nightVision: 'Night Vision',
    language: 'Language',
    location: 'Location',
    allLocations: 'All Locations',
    
    // Time Periods
    day: 'Day',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    
    // Buttons & Actions
    export: 'Export',
    exportCSV: 'Export CSV',
    exportPDF: 'Export PDF',
    search: 'Search',
    dateRange: 'Date Range',
    quickStats: 'Quick Stats',
    clearFilters: 'Clear Filters',
    
    // Date Search
    searchSpecificDate: 'Search Specific Date',
    pickADate: 'Pick a date',
    clear: 'Clear',
    selectDateRange: 'Select Date Range',
    from: 'From',
    to: 'To',
    
    // Charts & Analytics
    moodDistribution: 'Mood Distribution',
    moodTrends: 'Mood Trends',
    emotionBreakdown: 'Emotion Breakdown',
    themePreferenceAnalytics: 'Theme Preference Analytics',
    locationStats: 'Location Statistics',
    
    // Stats Cards
    totalEntries: 'Total Entries',
    totalResponses: 'Total Responses',
    pleasantMoods: 'Pleasant Moods',
    highEnergy: 'High Energy',
    averageIntensity: 'Average Intensity',
    avgIntensity: 'Avg Intensity',
    avgResponseTime: 'Avg Response Time',
    responseTime: 'Response Time',
    mostCommonEmotion: 'Most Common Emotion',
    
    // Theme Names
    dayTheme: 'Day',
    darkTheme: 'Dark',
    lightblueTheme: 'Light Blue',
    yellowTheme: 'Yellow',
    
    // Categories
    highEnergyPleasant: 'High Energy Pleasant',
    highEnergyUnpleasant: 'High Energy Unpleasant',
    lowEnergyPleasant: 'Low Energy Pleasant',
    lowEnergyUnpleasant: 'Low Energy Unpleasant',
    
    // Messages
    noDataMessage: 'No data available for the selected period',
    loadingMessage: 'Loading data...',
    
    // Chart Labels
    distributionStudents: 'Distribution of student theme toggle selections',
    topEmotions: 'Top Emotions',
    topL2Emotions: 'Top L2 Emotions',
    emotionCounts: 'Emotion Counts',
    averageResponseTime: 'Average Response Time',
    responses: 'responses',
    avgResponse: 'Avg response',
    moodDistributionAnalytics: 'Mood Distribution Analytics',
    moodTrendsOverTime: 'Mood Trends Over Time',
    l1CategoryComparison: 'L1 Category Comparison',
    selectUpToTwoCategories: 'Select up to 2 categories to compare',
    expandedView: 'Expanded View',
    detailedMoodCategoryView: 'Detailed view of mood category distribution across different time periods',
    
    // Y-axis labels
    numberOfEntries: 'Number of Entries',
    checkInCount: 'Check-in Count',
    hourOfDay: 'Hour of Day',
    
    dataCorrelationAnalysis: 'Data Correlation Analysis',
    categoryVsResponseTime: 'Category vs Response Time',
    categoryDistributionByHour: 'Category Distribution by Hour',
    intensityVsResponseTime: 'Intensity vs Response Time',
    checkinsByLocation: 'Check-ins by Location',
    distributionMoodEntries: 'Distribution of mood entries across kiosk locations',
    checkins: 'check-ins',
    addLocation: 'Add Location',
    pleaseEnterLocationName: 'Please enter a location name',
    addedLocation: 'Added location',
    mostCommonL1: 'Most Common L1',
    topL2Emotion: 'Top L2 Emotion',
    dataPoints: 'Data Points',
    entriesAnalyzed: 'entries analyzed',
    notAvailable: 'N/A',
    
    // Theme preferences
    unknownTheme: 'Unknown',
    themeLabel: 'Theme',
    
    // Time Labels
    seconds: 'seconds',
    milliseconds: 'ms',
    entries: 'entries',
    selections: 'selections'
  },
  
  es: {
    // Header
    moodMeterDashboard: 'Panel de Control del Medidor de Ánimo',
    realTimeAnalytics: 'Análisis e información en tiempo real de los datos de seguimiento del estado de ánimo',
    
    // Navigation & Controls
    adminLogin: 'Iniciar Sesión de Administrador',
    logout: 'Cerrar Sesión',
    settings: 'Configuración',
    nightVision: 'Visión Nocturna',
    language: 'Idioma',
    location: 'Ubicación',
    allLocations: 'Todas las Ubicaciones',
    
    // Time Periods
    day: 'Día',
    week: 'Semana',
    month: 'Mes',
    year: 'Año',
    
    // Buttons & Actions
    export: 'Exportar',
    exportCSV: 'Exportar CSV',
    exportPDF: 'Exportar PDF',
    search: 'Buscar',
    dateRange: 'Rango de Fechas',
    quickStats: 'Estadísticas Rápidas',
    clearFilters: 'Limpiar Filtros',
    
    // Charts & Analytics
    moodDistribution: 'Distribución del Estado de Ánimo',
    moodTrends: 'Tendencias del Estado de Ánimo',
    emotionBreakdown: 'Desglose de Emociones',
    themePreferenceAnalytics: 'Análisis de Preferencias de Tema',
    locationStats: 'Estadísticas de Ubicación',
    
    // Stats Cards
    totalEntries: 'Entradas Totales',
    totalResponses: 'Respuestas Totales',
    pleasantMoods: 'Estados de Ánimo Agradables',
    highEnergy: 'Alta Energía',
    averageIntensity: 'Intensidad Promedio',
    avgIntensity: 'Intensidad Prom.',
    avgResponseTime: 'Tiempo de Respuesta Prom.',
    responseTime: 'Tiempo de Respuesta',
    mostCommonEmotion: 'Emoción Más Común',
    
    // Theme Names
    dayTheme: 'Día',
    darkTheme: 'Oscuro',
    lightblueTheme: 'Azul Claro',
    yellowTheme: 'Amarillo',
    
    // Categories
    highEnergyPleasant: 'Alta Energía Agradable',
    highEnergyUnpleasant: 'Alta Energía Desagradable',
    lowEnergyPleasant: 'Baja Energía Agradable',
    lowEnergyUnpleasant: 'Baja Energía Desagradable',
    
    // Messages
    noDataMessage: 'No hay datos disponibles para el período seleccionado',
    loadingMessage: 'Cargando datos...',
    
    // Chart Labels
    distributionStudents: 'Distribución de selecciones de tema por estudiantes',
    topEmotions: 'Principales Emociones',
    topL2Emotions: 'Principales Emociones L2',
    emotionCounts: 'Conteos de Emociones',
    averageResponseTime: 'Tiempo de Respuesta Promedio',
    responses: 'respuestas',
    avgResponse: 'Respuesta prom.',
    moodDistributionAnalytics: 'Análisis de Distribución del Estado de Ánimo',
    moodTrendsOverTime: 'Tendencias del Estado de Ánimo a lo Largo del Tiempo',
    l1CategoryComparison: 'Comparación de Categorías L1',
    selectUpToTwoCategories: 'Seleccione hasta 2 categorías para comparar',
    expandedView: 'Vista Ampliada',
    detailedMoodCategoryView: 'Vista detallada de la distribución de categorías de estado de ánimo en diferentes períodos de tiempo',
    
    // Y-axis labels
    numberOfEntries: 'Número de Entradas',
    checkInCount: 'Recuento de Registros',
    hourOfDay: 'Hora del Día',
    
    dataCorrelationAnalysis: 'Análisis de Correlación de Datos',
    categoryVsResponseTime: 'Categoría vs Tiempo de Respuesta',
    categoryDistributionByHour: 'Distribución de Categorías por Hora',
    intensityVsResponseTime: 'Intensidad vs Tiempo de Respuesta',
    searchSpecificDate: 'Buscar Fecha Específica',
    pickADate: 'Elegir una fecha',
    clear: 'Limpiar',
    selectDateRange: 'Seleccionar Rango de Fechas',
    from: 'Desde',
    to: 'Hasta',
    customDateRange: 'Rango de Fechas Personalizado',
    checkinsByLocation: 'Check-ins por Ubicación',
    distributionMoodEntries: 'Distribución de entradas de estado de ánimo en ubicaciones de quiosco',
    checkins: 'check-ins',
    addLocation: 'Agregar Ubicación',
    pleaseEnterLocationName: 'Por favor ingrese un nombre de ubicación',
    addedLocation: 'Ubicación agregada',
    mostCommonL1: 'L1 Más Común',
    topL2Emotion: 'Emoción L2 Principal',
    dataPoints: 'Puntos de Datos',
    entriesAnalyzed: 'entradas analizadas',
    notAvailable: 'N/A',
    
    // Theme preferences
    unknownTheme: 'Desconocido',
    themeLabel: 'Tema',
    
    // Time Labels
    seconds: 'segundos',
    milliseconds: 'ms',
    entries: 'entradas',
    selections: 'selecciones'
  },
  
  ru: {
    // Header
    moodMeterDashboard: 'Панель Управления Измерителя Настроения',
    realTimeAnalytics: 'Аналитика и аналитические данные в реальном времени из данных отслеживания настроения',
    
    // Navigation & Controls
    adminLogin: 'Вход Администратора',
    logout: 'Выйти',
    settings: 'Настройки',
    nightVision: 'Ночное Видение',
    language: 'Язык',
    location: 'Местоположение',
    allLocations: 'Все Местоположения',
    
    // Time Periods
    day: 'День',
    week: 'Неделя',
    month: 'Месяц',
    year: 'Год',
    
    // Buttons & Actions
    export: 'Экспорт',
    exportCSV: 'Экспорт CSV',
    exportPDF: 'Экспорт PDF',
    search: 'Поиск',
    dateRange: 'Диапазон Дат',
    quickStats: 'Быстрая Статистика',
    clearFilters: 'Очистить Фильтры',
    
    // Charts & Analytics
    moodDistribution: 'Распределение Настроения',
    moodTrends: 'Тенденции Настроения',
    emotionBreakdown: 'Разбор Эмоций',
    themePreferenceAnalytics: 'Аналитика Предпочтений Темы',
    locationStats: 'Статистика Местоположения',
    
    // Stats Cards
    totalEntries: 'Всего Записей',
    totalResponses: 'Всего Ответов',
    pleasantMoods: 'Приятные Настроения',
    highEnergy: 'Высокая Энергия',
    averageIntensity: 'Средняя Интенсивность',
    avgIntensity: 'Ср. Интенсивность',
    avgResponseTime: 'Ср. Время Отклика',
    responseTime: 'Время Отклика',
    mostCommonEmotion: 'Самая Частая Эмоция',
    
    // Theme Names
    dayTheme: 'День',
    darkTheme: 'Тёмная',
    lightblueTheme: 'Голубая',
    yellowTheme: 'Жёлтая',
    
    // Categories
    highEnergyPleasant: 'Высокая Энергия Приятная',
    highEnergyUnpleasant: 'Высокая Энергия Неприятная',
    lowEnergyPleasant: 'Низкая Энергия Приятная',
    lowEnergyUnpleasant: 'Низкая Энергия Неприятная',
    
    // Messages
    noDataMessage: 'Нет данных для выбранного периода',
    loadingMessage: 'Загрузка данных...',
    
    // Chart Labels
    distributionStudents: 'Распределение выборов темы студентами',
    topEmotions: 'Топ Эмоций',
    topL2Emotions: 'Топ Эмоций L2',
    emotionCounts: 'Количество Эмоций',
    averageResponseTime: 'Среднее Время Отклика',
    responses: 'ответы',
    avgResponse: 'Ср. ответ',
    moodDistributionAnalytics: 'Аналитика Распределения Настроения',
    moodTrendsOverTime: 'Тенденции Настроения Во Времени',
    l1CategoryComparison: 'Сравнение Категорий L1',
    selectUpToTwoCategories: 'Выберите до 2 категорий для сравнения',
    expandedView: 'Расширенный Вид',
    detailedMoodCategoryView: 'Подробный вид распределения категорий настроения в разные периоды времени',
    
    // Y-axis labels
    numberOfEntries: 'Количество Записей',
    checkInCount: 'Количество Регистраций',
    hourOfDay: 'Час Дня',
    
    dataCorrelationAnalysis: 'Анализ Корреляции Данных',
    categoryVsResponseTime: 'Категория против Времени Отклика',
    categoryDistributionByHour: 'Распределение Категорий по Часам',
    intensityVsResponseTime: 'Интенсивность против Времени Отклика',
    searchSpecificDate: 'Поиск Конкретной Даты',
    pickADate: 'Выберите дату',
    clear: 'Очистить',
    selectDateRange: 'Выбрать Диапазон Дат',
    from: 'С',
    to: 'По',
    customDateRange: 'Пользовательский Диапазон Дат',
    checkinsByLocation: 'Регистрации по Местоположению',
    distributionMoodEntries: 'Распределение записей настроения по местоположениям киосков',
    checkins: 'регистрации',
    addLocation: 'Добавить Местоположение',
    pleaseEnterLocationName: 'Пожалуйста, введите название местоположения',
    addedLocation: 'Местоположение добавлено',
    mostCommonL1: 'Самая Частая L1',
    topL2Emotion: 'Топ Эмоция L2',
    dataPoints: 'Точки Данных',
    entriesAnalyzed: 'записей проанализировано',
    notAvailable: 'Н/Д',
    
    // Theme preferences
    unknownTheme: 'Неизвестно',
    themeLabel: 'Тема',
    
    // Time Labels
    seconds: 'секунд',
    milliseconds: 'мс',
    entries: 'записей',
    selections: 'выборов'
  }
};

export function useTranslation(language: LanguageType) {
  return (key: keyof typeof dashboardTranslations.en) => {
    return dashboardTranslations[language][key] || dashboardTranslations.en[key];
  };
}