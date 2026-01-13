/**
 * Formatte le nom du pasteur pour l'affichage
 * ex: pasteur_vincent -> Pasteur Vincent
 */
export const formatPastorName = (name) => {
    if (!name) return 'Pasteur';
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Formatte la catégorie de sermon pour l'affichage (si c'est une clé technique)
 * ex: SUNDAY_SERVICE -> Culte Dominical
 */
export const formatCategory = (category, t) => {
    if (!category) return '';

    const map = {
        'SUNDAY_SERVICE': 'Culte Dimanche',
        'BIBLE_STUDY': 'Étude Biblique',
        'PRAYER_MEETING': 'Réunion de Prière',
        'YOUTH_SERVICE': 'Jeunesse',
        'CONFERENCE': 'Conférence',
        'OTHER': 'Autre'
    };

    if (map[category]) return map[category];

    // Fallback: Title Case
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Formatte une référence biblique
 * ex: galate_verset_1:11-12 -> Galates 1:11-12
 */
export const formatBibleReference = (ref) => {
    if (!ref) return '';
    // Gestion spécifique pour "galate_verset_..."
    let formatted = ref.replace(/_verset_/g, ' ');
    formatted = formatted.replace(/_/g, ' ');
    // Capitalize
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};
