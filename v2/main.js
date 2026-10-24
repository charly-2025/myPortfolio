document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    root.classList.add('js');

    document.getElementById('year').textContent = new Date().getFullYear();

    /* ---------- Menu mobile ---------- */
    const nav = document.getElementById('top-nav');
    const toggle = document.getElementById('top-toggle');
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Fermer' : 'Menu';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
    }));

    /* ---------- En-tête et section active ---------- */
    const top = document.querySelector('.top');
    const links = [...nav.querySelectorAll('a')];
    const chapters = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const onScroll = () => {
        top.classList.toggle('scrolled', window.scrollY > 8);
        const mid = window.innerHeight * 0.35;
        let current = null;
        chapters.forEach(c => { if (c.getBoundingClientRect().top <= mid) current = c.id; });
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    };
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { onScroll(); ticking = false; });
    }, { passive: true });
    onScroll();

    /* ---------- Apparition au scroll ---------- */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-in');
            revealObserver.unobserve(e.target);
        });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    /* ---------- Étoiles de la planche spatiale ---------- */
    const stars = document.getElementById('stars');
    const NS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 120; i++) {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', (Math.random() * 1200).toFixed(1));
        c.setAttribute('cy', (Math.random() * 600).toFixed(1));
        c.setAttribute('r', (Math.random() * 1.4 + 0.3).toFixed(2));
        c.setAttribute('fill', '#fff');
        c.setAttribute('opacity', (Math.random() * 0.6 + 0.3).toFixed(2));
        if (i % 4 === 0) {
            c.classList.add('twinkle');
            c.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
        }
        stars.appendChild(c);
    }

    /* ---------- Planches : animations en pause hors écran ---------- */
    const plates = [...document.querySelectorAll('.plate')];
    const plateObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            const visible = e.isIntersecting && !reduceMotion;
            e.target.classList.toggle('offscreen', !visible);
            const svg = e.target.querySelector('svg');
            if (svg && svg.pauseAnimations) {
                if (visible) svg.unpauseAnimations();
                else svg.pauseAnimations();
            }
        });
    }, { rootMargin: '150px 0px' });
    plates.forEach(p => plateObserver.observe(p));

    if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Câbles du homelab prêts pour l'effet "tracé"
    document.querySelectorAll('.cable').forEach(path => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
    });

    /* Construction des illustrations, liée au scroll */
    const scenes = {
        education() {
            return gsap.timeline()
                .from('#edu-ground', { scaleX: 0, transformOrigin: '50% 50%', duration: 0.6 })
                .from('#school-wings', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.6 }, '<0.2')
                .from('#school-main', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'power2.out' }, '<')
                .from('#trees .tree', { scale: 0, transformOrigin: '50% 100%', duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, '<0.3')
                .from('#edu-sky', { opacity: 0, y: 20, duration: 0.6 }, '<')
                .from('#epi-sign', { y: -140, opacity: 0, duration: 0.9, ease: 'bounce.out' })
                .to('#school-svg .win', { fill: '#ffd36b', duration: 0.1, stagger: { each: 0.03, from: 'random' } }, '<0.2')
                .from('#grad-cap', { opacity: 0, duration: 0.4 });
        },
        homelab() {
            return gsap.timeline()
                .from('#lab-switch', { y: -80, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' })
                .from(['#lab-minipc', '#lab-nas', '#lab-rpi'], { y: 120, opacity: 0, duration: 0.7, stagger: 0.25, ease: 'power3.out' }, '<0.2')
                .to('.cable', { strokeDashoffset: 0, duration: 0.8, stagger: 0.2, ease: 'none' })
                .from('#lab-svg .packets', { opacity: 0, duration: 0.3 })
        },
    };

    const build = { 'fig-school': 'education', 'fig-lab': 'homelab', 'fig-offit': 'offit' };
    Object.entries(build).forEach(([figId, scene]) => {
        ScrollTrigger.create({
            trigger: '#' + figId,
            start: 'top 85%',
            end: 'center 45%',
            scrub: 0.8,
            animation: scenes[scene](),
        });
    });

    /* Boucles : elles tournent uniquement quand la planche est visible */
    const loops = {
        education() {
            const tl = gsap.timeline({ paused: true });
            // Des étudiants entrent dans l'école à tour de rôle
            gsap.utils.toArray('#students .student').forEach((st, i) => {
                tl.add(gsap.timeline({ repeat: -1, delay: 0.8 + i * 2.4 })
                    .set(st, { x: -30, y: 358, scale: 1, opacity: 0, transformOrigin: '50% 100%' })
                    .to(st, { opacity: 1, duration: 0.4 })
                    .to(st, { x: 300, duration: 6.4, ease: 'none' }, 0)
                    .to(st, { opacity: 0, scale: 0.6, duration: 0.5 }, '-=0.5'), 0);
            });
            // Lancer de toque
            tl.add(gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
                .set('#grad-cap', { transformOrigin: '50% 50%' })
                .to('#grad-cap', { y: -80, rotation: 200, duration: 0.8, ease: 'power2.out' })
                .to('#grad-cap', { y: 0, rotation: 360, duration: 0.8, ease: 'power2.in' })
                .set('#grad-cap', { rotation: 0 }), 0);
            tl.add(gsap.to('#clouds', { x: 50, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 }), 0);
            tl.add(gsap.to('#sign-glow', { opacity: 0.35, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }), 0);
            // Quelques fenêtres qui clignotent (quelqu'un passe devant)
            gsap.utils.shuffle(gsap.utils.toArray('#school-main .win')).slice(0, 5).forEach(w => {
                tl.add(gsap.to(w, { opacity: 0.35, duration: 0.25, yoyo: true, repeat: -1, repeatDelay: 1.5 + Math.random() * 2.5 }), Math.random() * 2);
            });
            return tl;
        },
        offit() {
            const tl = gsap.timeline({ paused: true });
            gsap.set('.steam', { opacity: 0 });
            // Le serveur soulève la cloche, la vapeur s'échappe, puis il la repose
            tl.add(gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
                .to('#cloche-lid', { y: -70, rotation: -18, transformOrigin: '0% 100%', duration: 0.8, ease: 'power2.out' })
                .to('.steam', { opacity: 1, duration: 0.4 }, '<0.3')
                .to({}, { duration: 1.8 })
                .to('#cloche-lid', { y: 0, rotation: 0, duration: 0.7, ease: 'bounce.out' })
                .to('.steam', { opacity: 0, duration: 0.3 }, '<'), 0);
            tl.add(gsap.to('#waiter-inner', { y: -5, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }), 0);
            gsap.utils.toArray('#resto .lamp').forEach((lamp, i) => {
                const x = i === 0 ? 70 : 330;
                tl.add(gsap.fromTo(lamp, { rotation: -3, svgOrigin: x + ' 0' }, { rotation: 3, svgOrigin: x + ' 0', duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }), i * 0.6);
            });
            // Le surveillant fait sa ronde en balayant le couloir avec sa lampe
            tl.add(gsap.to(['#warden-inner', '#beam-move'], { x: -45, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 }), 0);
            gsap.utils.toArray('#warden-inner .w-leg').forEach((leg, i) => {
                const hip = leg.dataset.hip;
                tl.add(gsap.fromTo(leg, { rotation: i ? 12 : -12, svgOrigin: hip }, { rotation: i ? -12 : 12, svgOrigin: hip, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }), 0);
            });
            tl.add(gsap.fromTo('#torch-beam', { rotation: -12, svgOrigin: '700 248' }, { rotation: 14, svgOrigin: '700 248', duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }), 0);
            return tl;
        },
        hobbies() {
            const tl = gsap.timeline({ paused: true });
            // Le vaisseau traverse l'écran en boucle
            tl.add(gsap.timeline({ repeat: -1, repeatDelay: 0.6 })
                .fromTo('#ship', { x: -260, y: 335, scale: 0.5, rotation: 0 }, { x: 1460, y: 350, scale: 0.5, duration: 7, ease: 'none' })
                .to('#ship', { rotation: -4, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0), 0);
            tl.add(gsap.timeline({ repeat: -1, repeatDelay: 2.5, delay: 1.5 })
                .fromTo('#shooting-star', { x: 200, y: 40, opacity: 0 }, { x: 700, y: 210, opacity: 1, duration: 0.35, ease: 'power1.in' })
                .to('#shooting-star', { x: 900, y: 277, opacity: 0, duration: 0.35 }), 0);
            // Minecraft : la pioche frappe le minerai jusqu'à ce qu'il casse, puis il réapparaît
            gsap.set('#mc-bits', { opacity: 0 });
            const hit = () => gsap.timeline()
                .to('#mc-pick', { rotation: -28, svgOrigin: '435 531', duration: 0.18, ease: 'power2.in' })
                .to('#mc-ore', { x: 1.5, duration: 0.05, yoyo: true, repeat: 1 })
                .to('#mc-pick', { rotation: 0, svgOrigin: '435 531', duration: 0.25, ease: 'power1.out' });
            tl.add(gsap.timeline({ repeat: -1, repeatDelay: 0.4 })
                .add(hit()).add(hit()).add(hit())
                .to('#mc-ore', { scale: 0, transformOrigin: '50% 60%', duration: 0.2, ease: 'back.in(2)' })
                .fromTo('#mc-bits', { opacity: 1, y: 0 }, { opacity: 0, y: 26, duration: 0.6, ease: 'power1.in' }, '<')
                .to({}, { duration: 0.6 })
                .to('#mc-ore', { scale: 1, duration: 0.35, ease: 'back.out(2)' }), 0);
            tl.add(gsap.to('#mc-island', { y: -8, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }), 0);

            // Rocket League : la voiture boost, saute, frappe le ballon et marque
            tl.add(gsap.timeline({ repeat: -1, repeatDelay: 0.6 })
                .set('#rl-car', { x: 0, y: 0, rotation: 0, opacity: 1 })
                .set('#rl-ball', { x: 0, y: 0, rotation: 0, opacity: 1 })
                .to('#rl-boost', { opacity: 1, duration: 0.2 })
                .to('#rl-car', { x: 56, duration: 0.9, ease: 'power2.in' }, '<')
                .to('#rl-car', { x: 120, y: -24, rotation: -10, transformOrigin: '50% 100%', duration: 0.32, ease: 'power1.out' })
                .to('#rl-ball', { x: 96, y: -16, rotation: 300, transformOrigin: '50% 50%', duration: 0.45, ease: 'power2.out' }, '<0.1')
                .to('#rl-boost', { opacity: 0, duration: 0.2 }, '<')
                .fromTo('#rl-burst', { scale: 0.3, opacity: 1, transformOrigin: '50% 50%' }, { scale: 1.8, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.05')
                .to('#rl-ball', { opacity: 0, duration: 0.2 }, '<')
                .to('#rl-car', { x: 170, y: 0, rotation: 0, duration: 0.4, ease: 'power1.in' }, '<')
                .to('#rl-car', { x: 220, opacity: 0, duration: 0.4 })
                .to({}, { duration: 0.4 }), 0);

            // Satisfactory : la foreuse tape en rythme
            tl.add(gsap.to('#sf-drill', { y: 6, duration: 0.3, ease: 'power2.in', yoyo: true, repeat: -1 }), 0);
            return tl;
        },
    };


    const loopFigs = { education: 'fig-school', offit: 'fig-offit', hobbies: 'fig-space' };
    Object.entries(loops).forEach(([name, make]) => {
        const tl = make();
        ScrollTrigger.create({
            trigger: '#' + loopFigs[name],
            start: 'top bottom',
            end: 'bottom top',
            onToggle: self => (self.isActive ? tl.play() : tl.pause()),
        });
    });
});
