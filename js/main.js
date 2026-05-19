document.addEventListener('DOMContentLoaded', () => {

    const toggleButton = document.getElementById('nav-toggle');
    const closeButton = document.getElementById('nav-close');
    const navBar = document.querySelector('.header-nav-bar');


    if (window.innerWidth > 1200) {
        closeButton.style.display = "none"
    }


    toggleButton.addEventListener('click', () => {
        closeButton.style.display = "block"
        navBar.classList.toggle('open');
    });

    closeButton.addEventListener('click', () => {
        closeButton.style.display = "none"
        navBar.classList.remove('open');
    });

    const navLinks = navBar.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navBar.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navBar.contains(e.target) && e.target !== toggleButton) {
            navBar.classList.remove('open');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
            });
            }
    });
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


