/**
 * =================================================================
 * Main JavaScript for Interactive Portfolio
 * =================================================================
 * This script handles:
 * 1. Physics-based node navigation using Matter.js
 * 2. Background particle effects using particles.js
 * 3. Opening/closing content sections with GSAP animations
 * 4. Theme (dark/light mode) toggling
 * 5. Interactive sliders for Projects and Education
 * 6. Command Line Interface (CLI) functionality
 * 7. Image modal/lightbox for resume previews
 * 8. Contact form submission handling
 * =================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =================================== */
    /* == 1. INITIALIZATION & SETUP ====== */
    /* =================================== */

    // --- Matter.js Engine Setup ---
    const { Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create({ constraintIterations: 5 });
    const world = engine.world;
    engine.world.gravity.y = 0;

    // --- Core DOM Element Constants ---
    const container = document.querySelector('.container');
    const svgContainer = document.getElementById('line-svg');
    const nodeLabelDisplay = document.getElementById('node-label-display');
    const themeToggle = document.querySelector('.theme-toggle');
    const contentSections = document.querySelectorAll('.content__section');

    // --- Node Configuration Data ---
    const nodes = [];
    const svgLines = [];
    const nodeData = [
        { id: 'about', icon: 'user' },
        { id: 'skills', icon: 'settings' },
        { id: 'projects', icon: 'briefcase' },
        { id: 'resume', icon: 'file-text' },
        { id: 'contact', icon: 'send' },
        { id: 'education', icon: 'book-open' },
        { id: 'achievements', icon: 'award' }
    ];
    const nodeDisplayNames = {
        about: 'About Me',
        skills: 'Skills',
        projects: 'Projects',
        resume: 'Resume',
        contact: 'Contact',
        education: 'Education',
        achievements: 'Achievements'
    };
    const center = { x: container.clientWidth / 2, y: container.clientHeight / 2 };
    const radius = 60;
    const nodeOptions = {
        frictionAir: 0.4,
        restitution: 0.5
    };

    // --- State Variables ---
    let isSectionOpen = false;

    /* =================================== */
    /* == 2. CORE LOGIC & FUNCTIONS ====== */
    /* =================================== */

    function initParticles(isDarkMode) {
        const particleColor = isDarkMode ? "#7E57C2" : "#5C6BC0";
        const lineColor = isDarkMode ? "#5E35B1" : "#3949AB";
        const particleCount = window.innerWidth < 768 ? 150 : 300;

        particlesJS('particles-js', {
            "particles": { "number": { "value": particleCount, "density": { "enable": true, "value_area": 1400 } }, "color": { "value": particleColor }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": true }, "size": { "value": 20, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": lineColor, "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false } },
            "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } } },
            "retina_detect": true
        });
    }

    function updateTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = `<i data-feather="${isDarkMode ? 'sun' : 'moon'}"></i>`;
        feather.replace();
        updateLineStyles();
        initParticles(isDarkMode);
    }

    function updateLineStyles() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const strokeColor = isDarkMode ? '#7E57C2' : '#5C6BC0';
        svgLines.forEach(({ element }) => {
            element.setAttribute('stroke', strokeColor);
            element.setAttribute('stroke-width', '4');
        });
    }

    function openSection(nodeId) {
        if (isSectionOpen) return;
        isSectionOpen = true;
        mouseConstraint.collisionFilter.mask = 0;
        const section = document.getElementById(nodeId);
        const nodeElement = document.getElementById(`node-${nodeId}`);
        nodeElement.classList.add('node-expanded');
        const nodeIcon = nodeElement.querySelector('svg');
        const nodeRect = nodeElement.getBoundingClientRect();
        const nodeBody = nodes.find(n => n.label === nodeId);
        if (nodeBody) Matter.Body.setStatic(nodeBody, true);
        const padding = 80;
        const timeline = gsap.timeline();
        timeline
            .set(nodeElement, { zIndex: 100 })
            .to(nodeIcon, { duration: 0.3, autoAlpha: 0, ease: 'power2.in' }, 0)
            .to(nodeElement, { duration: 0.8, x: -nodeRect.left + padding, y: -nodeRect.top + padding, width: `calc(100vw - ${padding * 2}px)`, height: `calc(100vh - ${padding * 2}px)`, borderRadius: '20px', ease: 'power3.inOut' }, 0)
            .to(section, { duration: 0.4, autoAlpha: 1, ease: 'power2.inOut', clipPath: `inset(0 0 0 0 round 20px)` }, '>-0.4')
            .call(() => {
                if (nodeId === 'projects') initProjectSlider();
                if (nodeId === 'education') initEducationSlider();
                if (nodeId === 'achievements') initAchievementsSection();
                feather.replace();
                setTimeout(() => section.focus(), 100);
            });
    }

    function closeSection(nodeId) {
        mouseConstraint.collisionFilter.mask = -1;
        const section = document.getElementById(nodeId);
        const nodeElement = document.getElementById(`node-${nodeId}`);
        const nodeIcon = nodeElement.querySelector('svg');
        const nodeBody = nodes.find(n => n.label === nodeId);
        const timeline = gsap.timeline({
            onComplete: () => {
                if (nodeBody) Matter.Body.setStatic(nodeBody, false);
                Matter.Body.setStatic(mainNode, true);
                gsap.set(nodeElement, { zIndex: '' });
                gsap.set(section, { clipPath: '' });
                nodeElement.classList.remove('node-expanded');
                isSectionOpen = false;
            }
        });
        timeline
            .to(section, { duration: 0.4, autoAlpha: 0, ease: 'power2.inOut', clipPath: `inset(50% 50% 50% 50% round 20px)` })
            .to(nodeElement, { duration: 0.8, x: 0, y: 0, width: `${radius * 2}px`, height: `${radius * 2}px`, borderRadius: '50%', ease: 'power3.inOut' }, '>-0.6')
            .to(nodeIcon, { duration: 0.3, autoAlpha: 1, ease: 'power2.out' }, '>-0.3');
    }

    /* =================================== */
    /* == 3. UI COMPONENT FUNCTIONS ====== */
    /* =================================== */

    function initProjectSlider() {
        const slider = document.querySelector('.project-slider');
        if (!slider) return;
        const track = slider.querySelector('.slider__track');
        const prevButton = slider.querySelector('.slider__button--left');
        const nextButton = slider.querySelector('.slider__button--right');
        const updateButtons = () => {
            const maxScrollLeft = track.scrollWidth - track.clientWidth;
            prevButton.disabled = track.scrollLeft <= 1;
            nextButton.disabled = track.scrollLeft >= maxScrollLeft - 1;
        };
        const scrollTo = (direction) => {
            const cardWidth = track.querySelector('.project-card').offsetWidth;
            const gap = parseInt(window.getComputedStyle(track).gap);
            const scrollAmount = cardWidth + gap;
            track.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
        };
        nextButton.addEventListener('click', () => scrollTo('next'));
        prevButton.addEventListener('click', () => scrollTo('prev'));
        track.addEventListener('scroll', updateButtons);
        updateButtons();
    }

    function initEducationSlider() {
        const slider = document.querySelector('.education-slider');
        if (!slider) return;
        const track = slider.querySelector('.education__track');
        const prevButton = slider.querySelector('.education-slider__button--left');
        const nextButton = slider.querySelector('.education-slider__button--right');
        const dotsContainer = slider.querySelector('.timeline-dots');
        const dots = slider.querySelectorAll('.timeline-dot');
        const cards = track.querySelectorAll('.education-card');
        if (!track || !prevButton || !nextButton || !dotsContainer || dots.length === 0) return;
        const updateUI = () => {
            const scrollLeft = track.scrollLeft;
            const maxScrollLeft = track.scrollWidth - track.clientWidth;
            const tolerance = 1;
            prevButton.disabled = scrollLeft <= tolerance;
            nextButton.disabled = scrollLeft >= maxScrollLeft - tolerance;
            let closestCardIndex = 0;
            let minDistance = Infinity;
            const trackCenter = track.clientWidth / 2;
            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft - scrollLeft + card.offsetWidth / 2;
                const distance = Math.abs(trackCenter - cardCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCardIndex = index;
                }
            });
            dots.forEach((dot, index) => dot.classList.toggle('active', index === closestCardIndex));
            const scrollPercentage = scrollLeft / (maxScrollLeft || 1);
            const dotsMovableWidth = dotsContainer.scrollWidth - dotsContainer.parentElement.clientWidth;
            dotsContainer.style.left = `${-scrollPercentage * dotsMovableWidth}px`;
        };
        const scrollToCard = (index) => {
            if (cards[index]) {
                cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        };
        nextButton.addEventListener('click', () => {
            const currentActive = slider.querySelector('.timeline-dot.active');
            let currentIndex = Array.from(dots).indexOf(currentActive);
            if (currentIndex < cards.length - 1) scrollToCard(currentIndex + 1);
        });
        prevButton.addEventListener('click', () => {
            const currentActive = slider.querySelector('.timeline-dot.active');
            let currentIndex = Array.from(dots).indexOf(currentActive);
            if (currentIndex > 0) scrollToCard(currentIndex - 1);
        });
        dots.forEach((dot, index) => dot.addEventListener('click', () => scrollToCard(index)));
        track.addEventListener('scroll', () => window.requestAnimationFrame(updateUI));
        window.addEventListener('resize', updateUI);
        updateUI();
    }

    function initAchievementsSection() {
        const slidesContainer = document.getElementById('certificate-slides-container');
        if (!slidesContainer) return;
        const slides = slidesContainer.querySelectorAll('.certificate-slide');
        const certPrevBtn = document.querySelector('.achievement-viewer__nav--left');
        const certNextBtn = document.querySelector('.achievement-viewer__nav--right');
        let currentCertIndex = 0;
        function updateCertButtonsState() {
            const scrollLeft = slidesContainer.scrollLeft;
            currentCertIndex = Math.round(scrollLeft / slidesContainer.clientWidth);
            certPrevBtn.disabled = currentCertIndex === 0;
            certNextBtn.disabled = currentCertIndex === slides.length - 1;
        }
        function scrollToCert(index) {
            slidesContainer.scrollTo({ left: index * slidesContainer.clientWidth, behavior: 'smooth' });
        }
        certPrevBtn?.addEventListener('click', () => { if (currentCertIndex > 0) scrollToCert(currentCertIndex - 1); });
        certNextBtn?.addEventListener('click', () => { if (currentCertIndex < slides.length - 1) scrollToCert(currentCertIndex + 1); });
        slidesContainer?.addEventListener('scroll', () => {
            clearTimeout(slidesContainer.scrollTimeout);
            slidesContainer.scrollTimeout = setTimeout(updateCertButtonsState, 150);
        });
        const linksTrack = document.getElementById('achievement-links-track');
        const linksPrevBtn = document.getElementById('achievements-links-prev');
        const linksNextBtn = document.getElementById('achievements-links-next');
        function updateLinkButtonsState() {
            if (!linksTrack) return;
            const maxScrollLeft = linksTrack.scrollWidth - linksTrack.clientWidth;
            linksPrevBtn.disabled = linksTrack.scrollLeft < 1;
            linksNextBtn.disabled = linksTrack.scrollLeft > maxScrollLeft - 1;
        }
        function scrollLinksSlider(direction) {
            if (!linksTrack) return;
            const scrollAmount = linksTrack.clientWidth * 0.8;
            linksTrack.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
        }
        linksPrevBtn?.addEventListener('click', () => scrollLinksSlider('prev'));
        linksNextBtn?.addEventListener('click', () => scrollLinksSlider('next'));
        linksTrack?.addEventListener('scroll', updateLinkButtonsState);
        updateCertButtonsState();
        updateLinkButtonsState();
        feather.replace();
    }

    function initImageModal() {
        const modal = document.getElementById("image-modal");
        const modalImg = document.getElementById("modal-image");
        const closeBtn = document.querySelector(".modal-close");
        const resumeImages = document.querySelectorAll(".resume-preview img");
        resumeImages.forEach(img => {
            img.onclick = function() {
                modal.style.display = "block";
                modalImg.src = this.src;
            }
        });
        function closeModal() {
            modal.style.display = "none";
        }
        if (closeBtn) closeBtn.onclick = closeModal;
        window.onclick = function(event) {
            if (event.target == modal) closeModal();
        }
    }

    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        let statusTimer;
        function showStatusMessage(message, type) {
            clearTimeout(statusTimer);
            formStatus.textContent = message;
            formStatus.className = ``;
            formStatus.classList.add(type, 'visible');
            statusTimer = setTimeout(() => {
                formStatus.classList.add('fly-out');
                setTimeout(() => formStatus.classList.remove('visible', 'fly-out'), 500);
            }, 4000);
        }
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const form = e.target;
                const data = new FormData(form);
                const action = form.action;
                const submitButton = form.querySelector('button[type="submit"]');
                const originalButtonHTML = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = `Sending... <i data-feather="loader" class="spinner"></i>`;
                const style = document.createElement('style');
                style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }`;
                document.head.appendChild(style);
                feather.replace();
                fetch(action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
                    .then(response => {
                        if (response.ok) {
                            showStatusMessage("Thanks! Your message has been sent.", 'success');
                            form.reset();
                        } else {
                            response.json().then(data => {
                                const errorMessage = data.errors ? data.errors.map(err => err.message).join(', ') : "Oops! Something went wrong.";
                                showStatusMessage(errorMessage, 'error');
                            });
                        }
                    }).catch(error => {
                        showStatusMessage("Network error. Please try again.", 'error');
                    }).finally(() => {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonHTML;
                        feather.replace();
                        document.head.removeChild(style);
                    });
            });
        }
    }

    function initCLI() {
        const cliTrigger = document.querySelector('.cli__trigger');
        const cliWindow = document.querySelector('.cli__window');
        const cliOutput = document.querySelector('.cli__output');
        const cliInput = document.querySelector('.cli__input');
        cliTrigger.addEventListener('click', () => {
            cliWindow.classList.add('is-open');
            cliInput.focus();
            if (!cliOutput.innerHTML.includes('Welcome')) {
                const welcome = document.createElement('div');
                welcome.innerHTML = `Welcome to the interactive terminal. Type <strong>help</strong> to see available commands.`;
                cliOutput.appendChild(welcome);
            }
        });
        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = cliInput.value.trim();
                handleCommand(command);
                cliInput.value = '';
            }
        });
        function handleCommand(command) {
            const outputLine = document.createElement('div');
            outputLine.innerHTML = `<span class="cli__prompt">&gt;</span> ${command}`;
            cliOutput.appendChild(outputLine);
            const responseLine = document.createElement('div');
            let response = '';
            switch (command.toLowerCase()) {
                case 'help': response = 'Available commands: help, clear, about, skills, projects, resume, contact, education, achievements, theme [light|dark], exit'; break;
                case 'clear': cliOutput.innerHTML = ''; return;
                case 'about': case 'skills': case 'projects': case 'resume': case 'contact': case 'education': case 'achievements':
                    openSection(command.toLowerCase());
                    response = `Navigating to ${command}...`;
                    break;
                case 'theme light': document.body.classList.remove('dark-mode'); updateTheme(); response = 'Theme set to light'; break;
                case 'theme dark': document.body.classList.add('dark-mode'); updateTheme(); response = 'Theme set to dark'; break;
                case 'exit': cliWindow.classList.remove('is-open'); return;
                default: response = `Command not found: ${command}`;
            }
            responseLine.innerHTML = response;
            cliOutput.appendChild(responseLine);
            cliOutput.scrollTop = cliOutput.scrollHeight;
        }
    }

    /* =================================== */
    /* == 4. MATTER.JS WORLD CREATION ==== */
    /* =================================== */

    const mainNode = Bodies.circle(center.x, center.y, radius, { ...nodeOptions, label: 'about', isStatic: true });
    nodes.push(mainNode);

    for (let i = 1; i < nodeData.length; i++) {
        const angle = (i - 1) * (Math.PI * 2) / (nodeData.length - 1);
        const x = center.x + Math.cos(angle) * 250;
        const y = center.y + Math.sin(angle) * 250;
        const node = Bodies.circle(x, y, radius, { ...nodeOptions, label: nodeData[i].id });
        nodes.push(node);
        const constraint = Constraint.create({ bodyA: mainNode, bodyB: node, stiffness: 0.05, damping: 0.5, length: 250 });
        World.add(world, constraint);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svgLines.push({ constraint: constraint, element: line });
        svgContainer.appendChild(line);
    }

    for (let i = 1; i < nodes.length; i++) {
        const nextNode = (i + 1) >= nodes.length ? nodes[1] : nodes[i + 1];
        const constraint = Constraint.create({ bodyA: nodes[i], bodyB: nextNode, stiffness: 0.05, damping: 0.5, length: 150 });
        World.add(world, constraint);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svgLines.push({ constraint: constraint, element: line });
        svgContainer.appendChild(line);
    }
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const constraint = Constraint.create({ bodyA: nodes[i], bodyB: nodes[j], stiffness: 0.0005 });
            World.add(world, constraint);
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            svgLines.push({ constraint: constraint, element: line });
            svgContainer.appendChild(line);
        }
    }

    World.add(world, nodes);

    const wallOptions = { isStatic: true };
    World.add(world, [
        Bodies.rectangle(container.clientWidth / 2, -25, container.clientWidth, 50, wallOptions),
        Bodies.rectangle(container.clientWidth / 2, container.clientHeight + 25, container.clientWidth, 50, wallOptions),
        Bodies.rectangle(-25, container.clientHeight / 2, 50, container.clientHeight, wallOptions),
        Bodies.rectangle(container.clientWidth + 25, container.clientHeight / 2, 50, container.clientHeight, wallOptions)
    ]);

    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });
    World.add(world, mouseConstraint);

    /* =================================== */
    /* == 5. DOM ELEMENT CREATION ======== */
    /* =================================== */

    nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');
        nodeElement.id = `node-${node.label}`;
        nodeElement.style.width = `${radius * 2}px`;
        nodeElement.style.height = `${radius * 2}px`;
        const iconName = nodeData.find(d => d.id === node.label).icon;
        nodeElement.innerHTML = `<i data-feather="${iconName}"></i>`;
        nodeElement.setAttribute('tabindex', '0');
        nodeElement.setAttribute('role', 'button');
        nodeElement.setAttribute('aria-label', `Open ${nodeDisplayNames[node.label]} section`);
        container.appendChild(nodeElement);
    });

    contentSections.forEach(section => {
        const backButton = document.createElement('button');
        backButton.classList.add('back-button');
        backButton.innerHTML = '<i data-feather="arrow-left"></i>';
        backButton.setAttribute('aria-label', 'Go back to navigation');
        backButton.addEventListener('click', () => closeSection(section.id));
        section.appendChild(backButton);
    });

    /* =================================== */
    /* == 6. EVENT LISTENERS ============= */
    /* =================================== */

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        updateTheme();
    });

    nodes.forEach(node => {
        const nodeElement = document.getElementById(`node-${node.label}`);
        nodeElement.addEventListener('click', () => openSection(node.label));
        nodeElement.addEventListener('keydown', (e) => { if (e.key === 'Enter') openSection(node.label); });
        nodeElement.addEventListener('mouseenter', () => {
            const displayName = nodeDisplayNames[node.label] || '';
            nodeLabelDisplay.textContent = displayName;
            gsap.to(nodeLabelDisplay, { opacity: 1, duration: 0.3 });
        });
        nodeElement.addEventListener('mouseleave', () => {
            gsap.to(nodeLabelDisplay, { opacity: 0, duration: 0.3 });
        });
    });

    /* =================================== */
    /* == 7. ANIMATION LOOP & STARTUP ==== */
    /* =================================== */

    (function update() {
        Engine.update(engine, 1000 / 60);
        svgLines.forEach(({ constraint, element }) => {
            const posA = constraint.bodyA.position;
            const posB = constraint.bodyB.position;
            element.setAttribute('x1', posA.x);
            element.setAttribute('y1', posA.y);
            element.setAttribute('x2', posB.x);
            element.setAttribute('y2', posB.y);
        });
        nodes.forEach(node => {
            const nodeElement = document.getElementById(`node-${node.label}`);
            if (nodeElement && !gsap.isTweening(nodeElement)) {
                nodeElement.style.left = `${node.position.x - radius}px`;
                nodeElement.style.top = `${node.position.y - radius}px`;
            }
        });
        requestAnimationFrame(update);
    })();

    updateTheme();
    initCLI();
    initImageModal();
    initContactForm();
});
