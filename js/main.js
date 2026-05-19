document.addEventListener('DOMContentLoaded', () => {

    const toggleButton = document.getElementById('nav-toggle');
    const closeButton = document.getElementById('nav-close');
    const navBar = document.querySelector('.header-nav-bar');
    const navLinks = navBar.querySelectorAll('a');

    let isOpen = false;

    function openMenu() {
        navBar.classList.add('open');
        closeButton.style.display = "block";
        isOpen = true;
    }

    function closeMenu() {
        navBar.classList.remove('open');
        closeButton.style.display = "none";
        isOpen = false;
    }

    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen ? closeMenu() : openMenu();
    });

    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
    });

    document.addEventListener('click', (e) => {
        if (isOpen && !navBar.contains(e.target) && e.target !== toggleButton) {
            closeMenu();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const target = document.querySelector(link.getAttribute('href'));

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            closeMenu();
        });
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        document.body.classList.add("resize-animation-stopper");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove("resize-animation-stopper");
        }, 200);

        if (window.innerWidth > 1200) {
            closeMenu();
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.main-content > section');
    sections.forEach(section => {
        observer.observe(section);
    });

    window.generateTxt = function(event) {
        event.preventDefault();
        const form = event.target;
        
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
        form.reset();
    };
});


