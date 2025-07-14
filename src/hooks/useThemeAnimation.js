import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Import animation files
import heroAnimation from '../assets/Hero_section_animation.json';
import aboutAnimation from '../assets/About_section_animation.json';

export const useThemeAnimation = (animationType) => {
    const { isDark } = useTheme();

    const animationData = useMemo(() => {
        const baseAnimations = {
            hero: heroAnimation,
            about: aboutAnimation,
        };

        const selectedAnimation = baseAnimations[animationType] || baseAnimations.hero;

        // Modify animation colors based on theme
        return {
            ...selectedAnimation,
            layers: selectedAnimation.layers?.map(layer => ({
                ...layer,
                ks: {
                    ...layer.ks,
                    o: {
                        ...layer.ks?.o,
                        k: Array.isArray(layer.ks?.o?.k)
                            ? layer.ks.o.k.map(frame => ({
                                ...frame,
                                s: frame.s ? frame.s.map(val => Math.min(val * (isDark ? 3 : 4), 100)) : [100]
                            }))
                            : Math.min((layer.ks?.o?.k || 15) * (isDark ? 4 : 6), 100)
                    }
                },
                shapes: layer.shapes?.map(shape => ({
                    ...shape,
                    ...(shape.ty === 'fl' && {
                        c: {
                            ...shape.c,
                            k: isDark
                                ? [0.6, 0.8, 1, 1] // Light blue for dark mode
                                : shape.c?.k || [0.12, 0.15, 0.25, 1]
                        }
                    })
                })) || layer.shapes
            })) || []
        };
    }, [isDark, animationType]);

    return animationData;
};