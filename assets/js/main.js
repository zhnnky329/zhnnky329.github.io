document.addEventListener('DOMContentLoaded', function () {
    const topNav = document.querySelector('.top-nav');
    const sectionLinks = document.querySelectorAll('.top-nav-link');
    const sections = Array.from(document.querySelectorAll('.section'));
    const backToTopButton = document.getElementById('backToTop');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let scheduled = false;

    function updateScrollState() {
        const offset = (topNav ? topNav.offsetHeight : 0) + 40;
        let current = '#top';

        if (window.scrollY > 40) {
            sections.forEach(function (section) {
                if (section.getBoundingClientRect().top <= offset) {
                    current = '#' + section.id;
                }
            });
            // The final section may be too short to reach the top of the viewport.
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
                current = '#' + sections[sections.length - 1].id;
            }
        }

        if (topNav) topNav.classList.toggle('is-scrolled', window.scrollY > 8);

        sectionLinks.forEach(function (link) {
            const active = link.getAttribute('href') === current;
            link.classList.toggle('active', active);
            if (active) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        if (backToTopButton) {
            backToTopButton.classList.toggle('is-visible', window.scrollY > 300);
        }
        scheduled = false;
    }

    function scheduleUpdate() {
        if (!scheduled) {
            scheduled = true;
            window.requestAnimationFrame(updateScrollState);
        }
    }

    // Native anchors preserve URL fragments, history, and keyboard focus.
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
            const homeLink = document.querySelector('.top-nav-link[href="#top"]');
            if (homeLink) {
                homeLink.focus({ preventScroll: true });
                homeLink.parentElement.scrollTo({ left: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
            }
            if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        });
    }
    updateScrollState();
});
