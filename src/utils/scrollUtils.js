// Smooth scroll utility function
export const scrollToSection = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        const headerHeight = 80; // Height of fixed header
        const elementPosition = element.offsetTop - headerHeight;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// Get current active section - Updated with new sections
export const getCurrentSection = () => {
    const sections = ['home', 'about', 'services', 'pricing', 'portfolio', 'team', 'trusted-clients', 'contact'];
    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
            return sections[i];
        }
    }
    return 'home';
};