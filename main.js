document.addEventListener('DOMContentLoaded', () => {
    // --- THE FIX: Switched to particles.js with a theme-aware configuration ---
    function initParticles(isDarkMode) {
        const particleColor = isDarkMode ? "#7E57C2" : "#5C6BC0";
        const lineColor = isDarkMode ? "#5E35B1" : "#3949AB";

        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 300,
                    "density": {
                        "enable": true,
                        "value_area": 1400
                    }
                },
                "color": {
                    "value": particleColor
                },
                "shape": {
                    "type": "circle",
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                },
                "size": {
                    "value": 20,
                    "random": true,
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": lineColor,
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    },
                }
            },
            "retina_detect": true
        });
    }

    // --- Get DOM Elements ---
    const container = document.querySelector('.container');
    const svgContainer = document.getElementById('line-svg');
    const nodeLabelDisplay = document.getElementById('node-label-display');

    // --- Matter.js setup (Physics Engine ONLY) ---
    const { Engine, World, Bodies, Body, Constraint, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create({ constraintIterations: 5 });
    const world = engine.world;
    engine.world.gravity.y = 0;

    // --- Node and SVG Line Data ---
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

    // --- Create Physics Bodies and SVG Lines ---
    const mainNode = Bodies.circle(center.x, center.y, radius, { ...nodeOptions, label: 'about', isStatic: true });
    nodes.push(mainNode);

    // Create the primary (structural) connections
    for (let i = 1; i < nodeData.length; i++) {
        const angle = (i - 1) * (Math.PI * 2) / (nodeData.length - 1);
        const x = center.x + Math.cos(angle) * 250;
        const y = center.y + Math.sin(angle) * 250;
        const node = Bodies.circle(x, y, radius, { ...nodeOptions, label: nodeData[i].id });
        nodes.push(node);

        const constraint = Constraint.create({
            bodyA: mainNode,
            bodyB: node,
            stiffness: 0.05,
            damping: 0.5,
            length: 250
        });
        World.add(world, constraint);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svgLines.push({ constraint: constraint, element: line });
        svgContainer.appendChild(line);
    }

    // Create the outer ring connections
    for (let i = 1; i < nodes.length; i++) {
        const nextNode = (i + 1) > nodes.length - 1 ? nodes[1] : nodes[i + 1];
        const constraint = Constraint.create({
            bodyA: nodes[i],
            bodyB: nextNode,
            stiffness: 0.05,
            damping: 0.5,
            length: 150
        });
        World.add(world, constraint);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svgLines.push({ constraint: constraint, element: line });
        svgContainer.appendChild(line);
    }

    // Connect all nodes to each other
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const constraint = Constraint.create({
                bodyA: nodes[i],
                bodyB: nodes[j],
                stiffness: 0.0005,
            });
            World.add(world, constraint);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            svgLines.push({ constraint: constraint, element: line });
            svgContainer.appendChild(line);
        }
    }

    World.add(world, nodes);

    // Add walls
    const wallOptions = { isStatic: true };
    World.add(world, [
        Bodies.rectangle(container.clientWidth / 2, -25, container.clientWidth, 50, wallOptions),
        Bodies.rectangle(container.clientWidth / 2, container.clientHeight + 25, container.clientWidth, 50, wallOptions),
        Bodies.rectangle(-25, container.clientHeight / 2, 50, container.clientHeight, wallOptions),
        Bodies.rectangle(container.clientWidth + 25, container.clientHeight / 2, 50, container.clientHeight, wallOptions)
    ]);

    // Mouse control
    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    World.add(world, mouseConstraint);

    // --- Create DOM Elements for Nodes ---
    nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');
        nodeElement.id = `node-${node.label}`;
        nodeElement.style.width = `${radius * 2}px`;
        nodeElement.style.height = `${radius * 2}px`;
        const iconName = nodeData.find(d => d.id === node.label).icon;
        nodeElement.innerHTML = `<i data-feather="${iconName}"></i>`;

        // Add event listeners for hover effect
        nodeElement.addEventListener('mouseenter', () => {
            const displayName = nodeDisplayNames[node.label] || '';
            nodeLabelDisplay.textContent = displayName;
            gsap.to(nodeLabelDisplay, { opacity: 1, duration: 0.3 });
        });

        nodeElement.addEventListener('mouseleave', () => {
            gsap.to(nodeLabelDisplay, { opacity: 0, duration: 0.3 });
        });

        container.appendChild(nodeElement);
    });
    
    // --- Create Back Buttons in Content Sections ---
    const contentSections = document.querySelectorAll('.content__section');
    contentSections.forEach(section => {
        const backButton = document.createElement('button');
        backButton.classList.add('back-button');
        backButton.innerHTML = '<i data-feather="arrow-left"></i>';
        backButton.addEventListener('click', () => closeSection(section.id));
        section.appendChild(backButton);
    });

    // --- Theme and Line Style Management ---
    const themeToggle = document.querySelector('.theme-toggle');

    function updateTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        // FIX: Recreate the icon element each time to avoid issues with feather.replace()
        themeToggle.innerHTML = `<i data-feather="${isDarkMode ? 'sun' : 'moon'}"></i>`;
        feather.replace(); // This call now correctly targets the new icon
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

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        updateTheme();
    });

    // Initial setup
    updateTheme(); // Sets up theme and calls feather.replace() for the first time

    // --- Main Animation Loop ---
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

    // --- GSAP Animation for opening/closing sections ---
    let isSectionOpen = false; // BUG FIX: State to prevent double-click issues

    function openSection(nodeId) {
        if (isSectionOpen) return; // BUG FIX: Don't run if a section is already open
        isSectionOpen = true; // BUG FIX: Set the flag

        mouseConstraint.collisionFilter.mask = 0;

        const section = document.getElementById(nodeId);
        const nodeElement = document.getElementById(`node-${nodeId}`);
        nodeElement.classList.add('node-expanded'); // VISUAL CHANGE: Add class for glass effect
        const nodeIcon = nodeElement.querySelector('svg');
        const nodeRect = nodeElement.getBoundingClientRect();

        const nodeBody = nodes.find(n => n.label === nodeId);
        if (nodeBody) {
            Matter.Body.setStatic(nodeBody, true);
        }

        const padding = 80;

        const timeline = gsap.timeline();

        timeline
            .set(nodeElement, { zIndex: 100 })
            .to(nodeIcon, { duration: 0.3, autoAlpha: 0, ease: 'power2.in' }, 0)
            .to(nodeElement, {
                duration: 0.8,
                x: -nodeRect.left + padding,
                y: -nodeRect.top + padding,
                width: `calc(100vw - ${padding * 2}px)`,
                height: `calc(100vh - ${padding * 2}px)`,
                borderRadius: '20px',
                ease: 'power3.inOut'
            }, 0)
            .to(section, {
                duration: 0.4,
                autoAlpha: 1,
                ease: 'power2.inOut',
                clipPath: `inset(0 0 0 0 round 20px)`
            }, '>-0.4')
            .call(() => {
                // Initialize slider for the projects section when it opens
                if (nodeId === 'projects') {
                    initProjectSlider();
                }
                // NEW: Initialize slider for the education section
                if (nodeId === 'education') {
                    initEducationSlider();
                }
                // Re-run feather icons for any new content
                feather.replace();
            });
    }

    function closeSection(nodeId) {
        mouseConstraint.collisionFilter.mask = -1;

        const section = document.getElementById(nodeId);
        const nodeElement = document.getElementById(`node-${nodeId}`);
        const nodeIcon = nodeElement.querySelector('svg');

        const timeline = gsap.timeline({
            onComplete: () => {
                const nodeBody = nodes.find(n => n.label === nodeId);
                if (nodeBody) {
                    Matter.Body.setStatic(nodeBody, false);
                }
                Matter.Body.setStatic(mainNode, true);
                gsap.set(nodeElement, { zIndex: '' });
                gsap.set(section, { clipPath: '' });
                nodeElement.classList.remove('node-expanded'); // VISUAL CHANGE: Remove class
                isSectionOpen = false; // BUG FIX: Reset the flag
            }
        });

        timeline
            .to(section, {
                duration: 0.4,
                autoAlpha: 0,
                ease: 'power2.inOut',
                clipPath: `inset(50% 50% 50% 50% round 20px)`
            })
            .to(nodeElement, {
                duration: 0.8,
                x: 0,
                y: 0,
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                borderRadius: '50%',
                ease: 'power3.inOut'
            }, '>-0.6')
            .to(nodeIcon, { duration: 0.3, autoAlpha: 1, ease: 'power2.out' }, '>-0.3');
    }

    nodes.forEach(node => {
        const nodeElement = document.getElementById(`node-${node.label}`);
        nodeElement.addEventListener('click', () => openSection(node.label));
    });

    // CLI Functionality
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
            case 'help':
                response = 'Available commands: help, clear, about, skills, projects, resume, contact, education, achievements, theme [light|dark], exit';
                break;
            case 'clear':
                cliOutput.innerHTML = '';
                return;
            case 'about':
            case 'skills':
            case 'projects':
            case 'resume':
            case 'contact':
            case 'education':
            case 'achievements':
                openSection(command.toLowerCase());
                response = `Navigating to ${command}...`;
                break;
            case 'theme light':
                document.body.classList.remove('dark-mode');
                updateTheme();
                response = 'Theme set to light';
                break;
            case 'theme dark':
                document.body.classList.add('dark-mode');
                updateTheme();
                response = 'Theme set to dark';
                break;
            case 'exit':
                cliWindow.classList.remove('is-open');
                return;
            default:
                response = `Command not found: ${command}`;
        }

        responseLine.innerHTML = response;
        cliOutput.appendChild(responseLine);
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    // ================== START: PROJECT SLIDER LOGIC ==================
    function initProjectSlider() {
        const slider = document.querySelector('.project-slider');
        if (!slider) return;

        const track = slider.querySelector('.slider__track');
        const prevButton = slider.querySelector('.slider__button--left');
        const nextButton = slider.querySelector('.slider__button--right');
        
        const updateButtons = () => {
            const maxScrollLeft = track.scrollWidth - track.clientWidth;
            prevButton.disabled = track.scrollLeft <= 1;
            nextButton.disabled = track.scrollLeft >= maxScrollLeft -1;
        };

        const scrollTo = (direction) => {
            const cardWidth = track.querySelector('.project-card').offsetWidth;
            const gap = parseInt(window.getComputedStyle(track).gap);
            const scrollAmount = cardWidth + gap;
            
            track.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        };

        nextButton.addEventListener('click', () => scrollTo('next'));
        prevButton.addEventListener('click',()=> scrollTo('prev'));

        // Update buttons on scroll (e.g., from user swiping)
        track.addEventListener('scroll', updateButtons);

        // Initial state
        updateButtons();
    }
    // =================== END: PROJECT SLIDER LOGIC ===================

    // ================== START: SIMPLIFIED EDUCATION SLIDER LOGIC ==================
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
            // Update button states and highlight the correct dot.
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

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === closestCardIndex);
            });

            // Slide the timeline dots
            const scrollPercentage = scrollLeft / (maxScrollLeft || 1);
            const dotsMovableWidth = dotsContainer.scrollWidth - dotsContainer.parentElement.clientWidth;
            const dotsNewLeft = -scrollPercentage * dotsMovableWidth;
            
            dotsContainer.style.left = `${dotsNewLeft}px`;
        };

        const scrollToCard = (index) => {
            // Simplified scroll logic using scrollIntoView
            if (cards[index]) {
                cards[index].scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        };

        nextButton.addEventListener('click', () => {
            const currentActive = slider.querySelector('.timeline-dot.active');
            let currentIndex = Array.from(dots).indexOf(currentActive);
            if (currentIndex < cards.length - 1) {
                scrollToCard(currentIndex + 1);
            } else {
                // If on the last card, a "next" click does nothing.
                // This prevents trying to scroll past the end.
            }
        });

        prevButton.addEventListener('click', () => {
            const currentActive = slider.querySelector('.timeline-dot.active');
            let currentIndex = Array.from(dots).indexOf(currentActive);
            if (currentIndex > 0) {
                scrollToCard(currentIndex - 1);
            }
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                scrollToCard(index);
            });
        });

        // The scroll event listener now only updates the UI. No snapping.
        track.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateUI);
        });

        window.addEventListener('resize', updateUI);

        // Initial state
        updateUI();
    }
    // =================== END: SIMPLIFIED EDUCATION SLIDER LOGIC ===================
});
