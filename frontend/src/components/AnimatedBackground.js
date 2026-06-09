import React, { useMemo } from 'react';
import '../styles/globals.css';
const SOCIAL_ICONS = ['📱', '🎵', '📸', '🎬', '💬', '⭐', '🔗', '📺', '🎭', '🎪', '🎨', '📹'];
const AnimatedIcon = ({ icon, delay, duration, top, direction }) => {
    return (<div className={`animated-icon ${direction}`} style={{
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
        }}>
      {icon}
    </div>);
};
export const AnimatedBackground = ({ iconCount = 15 }) => {
    const icons = useMemo(() => {
        return Array.from({ length: iconCount }).map((_, i) => ({
            id: i,
            icon: SOCIAL_ICONS[Math.floor(Math.random() * SOCIAL_ICONS.length)],
            delay: Math.random() * 5,
            duration: 20 + Math.random() * 10,
            top: Math.random() * 100,
            direction: Math.random() > 0.5 ? 'left' : 'right',
        }));
    }, [iconCount]);
    return (<>
      {icons.map((item) => (<AnimatedIcon key={item.id} icon={item.icon} delay={item.delay} duration={item.duration} top={item.top} direction={item.direction}/>))}
    </>);
};
export default AnimatedBackground;
//# sourceMappingURL=AnimatedBackground.js.map