document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.querySelector('.site-header');
    const nav = document.getElementById('site-nav');
    const toggle = document.getElementById('nav-toggle');
    const progress = document.querySelector('.scroll-progress span');
    const sections = [...document.querySelectorAll('main > section')];
    const navLinks = [...document.querySelectorAll('.site-nav a, .side-dots a')];

    document.getElementById('year').textContent = new Date().getFullYear();

    /* ---------- Menu mobile ---------- */
    function setMenu(open) {
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setMenu(!nav.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target)) setMenu(false);
    });

    /* ---------- Navigation : tient compte des sections épinglées ---------- */
    function sectionTop(el) {
        const anchor = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
        return anchor.getBoundingClientRect().top + window.scrollY;
    }

    document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            setMenu(false);
            window.scrollTo({ top: sectionTop(target), behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    /* ---------- Progression + section active ---------- */
    let ticking = false;

    function onScroll() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        header.classList.toggle('scrolled', window.scrollY > 20);

        let current = sections[0].id;
        const mid = window.scrollY + window.innerHeight * 0.45;
        sections.forEach(sec => {
            if (sectionTop(sec) <= mid) current = sec.id;
        });
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    /* ---------- Terminal du hero ---------- */
    const termLines = [
        ['p', '$ ', 'c', 'whoami'],
        ['', 'charly, étudiant Epitech Rennes'],
        ['p', '$ ', 'c', 'cat focus.txt'],
        ['k', '› ', '', 'Cybersécurité offensive & défensive'],
        ['k', '› ', '', 'Pentest web · CTF · Cryptographie'],
        ['k', '› ', '', 'Développement full-stack'],
        ['p', '$ ', 'c', './status --alternance'],
        ['', 'Disponible · rentrée 2027 ✔'],
    ];
    const termOut = document.getElementById('terminal-out');

    function renderTerminal(upTo, partial) {
        const html = termLines.slice(0, upTo).map(line => {
            let out = '';
            for (let i = 0; i < line.length; i += 2) {
                const cls = line[i];
                const txt = line[i + 1];
                out += cls ? `<span class="${cls}">${txt}</span>` : txt;
            }
            return out;
        });
        if (partial !== undefined) html.push(partial);
        termOut.innerHTML = html.join('\n') + '<span class="caret"></span>';
    }

    if (reduceMotion) {
        renderTerminal(termLines.length);
    } else {
        let li = 0;
        let ci = 0;
        const typeNext = () => {
            if (li >= termLines.length) return renderTerminal(li);
            const line = termLines[li];
            const plain = line.filter((_, i) => i % 2 === 1).join('');
            const isCmd = line[0] === 'p';
            if (ci <= plain.length) {
                renderTerminal(li, plain.slice(0, ci).replace(/^\$ /, '<span class="p">$ </span>'));
                ci++;
                setTimeout(typeNext, isCmd ? 45 : 12);
            } else {
                li++;
                ci = 0;
                setTimeout(typeNext, isCmd ? 260 : 120);
            }
        };
        setTimeout(typeNext, 700);
    }

    /* ---------- Étoiles (Star Citizen) ---------- */
    const stars = document.getElementById('stars');
    const NS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 160; i++) {
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

    if (reduceMotion) {
        document.querySelectorAll('svg').forEach(svg => svg.pauseAnimations && svg.pauseAnimations());
    }

    /* ---------- Animations au scroll ---------- */
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
        onScroll();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('anim');

    // Préparer les câbles du homelab pour l'effet "tracé"
    document.querySelectorAll('.cable').forEach(path => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
    });

    // Hero
    gsap.from('.hero-title .line span', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.1 });
    gsap.from(['.status-pill', '.hero-role', '.hero-actions', '.hero-meta'], { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.35 });
    gsap.from('.hero-card', { y: 40, opacity: 0, rotateX: 10, duration: 1.2, ease: 'power3.out', delay: 0.5 });
    gsap.to('.hero-inner', {
        yPercent: -12, opacity: 0.2, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // Éléments simples
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.from(el, {
            y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
        });
    });

    /* Timelines de chaque scène (jouées au scroll) */
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
                .from('.scene-edu .scene-text > *', { x: 60, opacity: 0, duration: 0.6, stagger: 0.15 }, '<')
                .from('#grad-cap', { opacity: 0, duration: 0.4 });
        },
        homelab() {
            return gsap.timeline()
                .from('#lab-switch', { y: -80, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' })
                .from(['#lab-minipc', '#lab-nas', '#lab-rpi'], { y: 120, opacity: 0, duration: 0.7, stagger: 0.25, ease: 'power3.out' }, '<0.2')
                .to('.cable', { strokeDashoffset: 0, duration: 0.8, stagger: 0.2, ease: 'none' })
                .from('#lab-svg .packets', { opacity: 0, duration: 0.3 })
                .from('.scene-lab .scene-text > *', { x: 60, opacity: 0, duration: 0.6, stagger: 0.12 }, 0.3);
        },
        skills() {
            return gsap.timeline()
                .from('.coin', { scale: 0, z: -600, opacity: 0, duration: 1, stagger: { each: 0.05, from: 'random' }, ease: 'back.out(1.4)' })
                .from('.skills-panel', { y: 60, opacity: 0, duration: 0.8 }, '<0.2')
                .from('.skills-panel .skill-cat', { y: 30, opacity: 0, duration: 0.5, stagger: 0.06 }, '<0.3')
                .from('.skills-panel .chip', { y: 20, opacity: 0, duration: 0.4, stagger: 0.03 }, '<0.3')
                .from('.lang-bar span', { scaleX: 0, transformOrigin: '0 50%', duration: 0.8, stagger: 0.2 }, '<0.3');
        },
        offit() {
            return gsap.timeline()
                .from('#resto', { opacity: 0, duration: 0.5 })
                .from('#waiter', { x: -260, duration: 1, ease: 'power2.out' }, '<0.1')
                .from('#card-waiter', { x: 60, opacity: 0, duration: 0.6 }, '<')
                .from('#internat', { opacity: 0, duration: 0.6 })
                .from('#warden', { x: 260, duration: 1, ease: 'power2.out' }, '<0.1')
                .from('#card-warden', { x: 60, opacity: 0, duration: 0.6 }, '<')
                .from('#torch-beam', { opacity: 0, duration: 0.3 })
                .to('#night-shade', { opacity: 0.25, duration: 0.5 }, '<');
        },
    };

    /* Boucles : elles démarrent quand on arrive sur la section et se mettent en pause quand on la quitte */
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
                .fromTo('#ship', { x: -260, y: 330, scale: 0.5, rotation: 0 }, { x: 1460, y: 250, scale: 0.5, duration: 7, ease: 'none' })
                .to('#ship', { rotation: -4, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0), 0);
            tl.add(gsap.timeline({ repeat: -1, repeatDelay: 2.5, delay: 1.5 })
                .fromTo('#shooting-star', { x: 200, y: 40, opacity: 0 }, { x: 700, y: 210, opacity: 1, duration: 0.35, ease: 'power1.in' })
                .to('#shooting-star', { x: 900, y: 277, opacity: 0, duration: 0.35 }), 0);
            // Minecraft : la pioche frappe le minerai jusqu'à ce qu'il casse, puis il réapparaît
            gsap.set('#mc-bits', { opacity: 0 });
            const hit = () => gsap.timeline()
                .to('#mc-pick', { rotation: -28, svgOrigin: '405 523', duration: 0.18, ease: 'power2.in' })
                .to('#mc-ore', { x: 1.5, duration: 0.05, yoyo: true, repeat: 1 })
                .to('#mc-pick', { rotation: 0, svgOrigin: '405 523', duration: 0.25, ease: 'power1.out' });
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
            tl.add(gsap.to('#sf-drill', { y: 10, duration: 0.3, ease: 'power2.in', yoyo: true, repeat: -1 }), 0);
            return tl;
        },
    };

    function attachLoops() {
        Object.entries(loops).forEach(([id, make]) => {
            const el = document.getElementById(id);
            const tl = make();
            const trigger = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
            ScrollTrigger.create({
                trigger,
                start: 'top 30%',
                end: 'bottom 30%',
                onToggle: self => (self.isActive ? tl.play() : tl.pause()),
            });
        });
    }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 960px) and (min-height: 640px)', () => {
        // Scènes épinglées : la progression suit le scroll (défilé).
        // L'animation démarre un peu avant l'épinglage pour que la scène ne soit jamais vide.
        const vh = () => window.innerHeight;
        const pinScene = (id, length, animation) => {
            ScrollTrigger.create({
                trigger: '#' + id,
                start: 'top top',
                end: () => '+=' + vh() * length,
                pin: true,
                anticipatePin: 1,
            });
            ScrollTrigger.create({
                trigger: '#' + id,
                start: 'top 65%',
                end: () => '+=' + vh() * (length + 0.65),
                scrub: 1,
                animation,
            });
        };

        pinScene('education', 1.6, scenes.education());

        // Projets d'études : défilement horizontal
        const track = document.querySelector('.h-track');
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
                trigger: '#projects',
                start: 'top top',
                end: () => '+=' + (distance() + window.innerHeight * 0.3),
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });
        gsap.from('.h-head > *', {
            y: 40, opacity: 0, stagger: 0.1, duration: 0.8,
            scrollTrigger: { trigger: '#projects', start: 'top 70%' },
        });

        pinScene('homelab', 1.4, scenes.homelab());
        const panel = document.querySelector('.skills-panel');
        if (panel.offsetHeight < window.innerHeight - 90) {
            pinScene('skills', 1, scenes.skills());
        } else {
            ScrollTrigger.create({ trigger: '#skills', start: 'top 70%', end: 'bottom 60%', scrub: 1, animation: scenes.skills() });
        }
        pinScene('offit', 2, scenes.offit());

        // Hobbies : terrain de sport → espace (Star Citizen)
        pinScene('hobbies', 2.6, gsap.timeline()
            .from('#hobby-sport', { y: 50, opacity: 0, duration: 0.5 })
            .from(['#ath-run', '#ath-gym', '#ath-foot'], { y: 200, opacity: 0, duration: 0.8, stagger: 0.25, ease: 'back.out(1.2)' }, '<')
            .to({}, { duration: 0.8 })
            .to('#sport-svg', { yPercent: -100, duration: 1.2, ease: 'power2.inOut' })
            .fromTo('#space-svg', { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: 'power2.inOut' }, '<')
            .to('#hobby-sport', { autoAlpha: 0, y: -30, duration: 0.4 }, '<')
            .to('#hobby-space', { autoAlpha: 1, duration: 0.5 }, '<0.6')
            .to('#planet-g', { y: -40, duration: 2.2, ease: 'none' })
            .to('#stars', { x: -80, duration: 2.2, ease: 'none' }, '<'));

        // Pièces 3D : parallaxe selon la profondeur + souris
        gsap.utils.toArray('.coin').forEach(coin => {
            const d = parseFloat(getComputedStyle(coin).getPropertyValue('--d')) || 1;
            gsap.to(coin, {
                yPercent: -60 * d,
                ease: 'none',
                scrollTrigger: { trigger: '#skills', start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });
        const coinsLayer = document.querySelector('.coins');
        const skillsSec = document.getElementById('skills');
        const tiltX = gsap.quickTo(coinsLayer, 'rotationY', { duration: 0.8 });
        const tiltY = gsap.quickTo(coinsLayer, 'rotationX', { duration: 0.8 });
        const onMove = (e) => {
            tiltX((e.clientX / window.innerWidth - 0.5) * 14);
            tiltY((e.clientY / window.innerHeight - 0.5) * -10);
        };
        skillsSec.addEventListener('mousemove', onMove);
        attachLoops();
        return () => skillsSec.removeEventListener('mousemove', onMove);
    });

    mm.add('(max-width: 959px), (max-height: 639px)', () => {
        // Mobile : chaque scène se joue une fois en entrant dans l'écran
        Object.keys(scenes).forEach(id => {
            const tl = scenes[id]();
            tl.pause();
            ScrollTrigger.create({ trigger: '#' + id, start: 'top 70%', once: true, onEnter: () => tl.play() });
        });
        document.querySelectorAll('.h-head > *, .xp-card, .hobby-text, .stage-layer').forEach(el => {
            gsap.from(el, {
                y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 90%' },
            });
        });
        attachLoops();
    });

    ScrollTrigger.addEventListener('refresh', onScroll);
    window.addEventListener('load', () => ScrollTrigger.refresh());
    onScroll();
});
