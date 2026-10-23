# Portfolio · Charly Richard-Fromont

My personal portfolio: a single-page website with scroll-driven
animated scenes that tell my journey as a computer science student
specializing in **cybersecurity** at Epitech Rennes.

**Live:** [charly-2025.github.io/myPortfolio](https://charly-2025.github.io/myPortfolio/)

`HTML` · `CSS` · `JavaScript` · `GSAP` · `ScrollTrigger` · `SVG`

## Highlights

- **Scroll storytelling**: pinned scenes animated as you scroll, built with GSAP ScrollTrigger
- **Hand-drawn SVG illustrations**: an Epitech campus that builds itself, a homelab with live network packets, sport characters, a spaceship flying over a planet
- **Looping idle animations** that start when a section comes into view and pause when it leaves
- **3D skill coins** floating behind the skills panel, with depth parallax and mouse tilt
- **Horizontal scroll** through my school projects, each linked to its GitHub repository
- **Responsive** layout with a dedicated mobile behavior, and full support for `prefers-reduced-motion`
- No framework and no build step: plain HTML, CSS and JavaScript

## Sections

Profile · Education · Work experience · School projects · Homelab · Personal
projects · Skills · Non-IT experience · Hobbies · Contact

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

```
index.html      page content and inline SVG scenes
style/index.css design tokens, layout and animations
js/main.js      navigation, terminal intro and scroll animations
```
