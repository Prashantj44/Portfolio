document.addEventListener('DOMContentLoaded', () => {
    // Subtle background glow effect tracking the mouse
    const glowBg = document.querySelector('.glow-bg');
    
    if (glowBg) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            glowBg.style.setProperty('--mouse-x', `${x}px`);
            glowBg.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    // Add staggered fade-in delays to job cards and sidebar sections
    const staggerElements = document.querySelectorAll('.job-card, .sidebar-section, .about-body p, .client-logo');
    staggerElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animation = `fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.1 + 0.3}s`;
    });
});
