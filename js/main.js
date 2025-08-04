	document.addEventListener('DOMContentLoaded', () => {
    // tsParticles initialization
    tsParticles.load('particles-js', {
        // ... (tsParticles config) ...
    });

    // Feather icons
    feather.replace();

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const icon = themeToggle.querySelector('i');
        
        if (isDarkMode) {
            icon.setAttribute('data-feather', 'sun');
        } else {
            icon.setAttribute('data-feather', 'moon');
        }
        feather.replace();

        // Update constraint colors
        const allConstraints = World.allConstraints(world);
        allConstraints.forEach(constraint => {
            constraint.render.strokeStyle = isDarkMode ? '#7E57C2' : '#5C6BC0';
        });
    });

    // Matter.js setup
    const container = document.querySelector('.container');
    const { Engine, Render, Runner, World, Bodies, Body, Constraint, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create({ constraintIterations: 5 });
    const world = engine.world;
    engine.world.gravity.y = 0; // Disable gravity for a floating effect

    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Node configuration
    const nodes = [];
    const nodeData = [
        { id: 'about', icon: 'user' },
        { id: 'skills', icon: 'settings' },
        { id: 'projects', icon: 'briefcase' },
        { id: 'resume', icon: 'file-text' },
        { id: 'contact', icon: 'send' },
        { id: 'education', icon: 'book-open' },
        { id: 'achievements', icon: 'award' }
    ];

    const center = { x: container.clientWidth / 2, y: container.clientHeight / 2 };
    const radius = 60;
    const nodeOptions = { 
        frictionAir: 0.1, 
        restitution: 0.5 
    };

    const mainNode = Bodies.circle(center.x, center.y, radius, { ...nodeOptions, label: 'about' });
    nodes.push(mainNode);

    // Fix the main node in the center
    const anchor = Constraint.create({
        pointA: { x: center.x, y: center.y },
        bodyB: mainNode,
        stiffness: 0.5,
        damping: 0.1,
        render: { visible: false }
    });
    World.add(world, anchor);

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
            length: 250,
            render: {
                lineWidth: 3,
                strokeStyle: '#5C6BC0'
            }
        });
        World.add(world, constraint);
    }

    // Connect outer nodes to each other to form a ring
    for (let i = 1; i < nodes.length; i++) {
        const nextNode = (i + 1) > nodes.length - 1 ? nodes[1] : nodes[i + 1];
        const constraint = Constraint.create({
            bodyA: nodes[i],
            bodyB: nextNode,
            stiffness: 0.05,
            damping: 0.5,
            length: 150,
            render: {
                lineWidth: 3,
                strokeStyle: '#5C6BC0'
            }
        });
        World.add(world, constraint);
    }

    World.add(world, nodes);

    // Add walls
    const wallOptions = { isStatic: true, render: { visible: false } };
    World.add(world, [
        Bodies.rectangle(container.clientWidth / 2, -25, container.clientWidth, 50, wallOptions), // top
        Bodies.rectangle(container.clientWidth / 2, container.clientHeight + 25, container.clientWidth, 50, wallOptions), // bottom
        Bodies.rectangle(-25, container.clientHeight / 2, 50, container.clientHeight, wallOptions), // left
        Bodies.rectangle(container.clientWidth + 25, container.clientHeight / 2, 50, container.clientHeight, wallOptions) // right
    ]);

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    World.add(world, mouseConstraint);

    // Create DOM elements for nodes
    nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');
        nodeElement.id = `node-${node.label}`;
        nodeElement.style.width = `${radius * 2}px`;
        nodeElement.style.height = `${radius * 2}px`;

        const iconName = nodeData.find(d => d.id === node.label).icon;
        nodeElement.innerHTML = `<i data-feather="${iconName}"></i>`;

        container.appendChild(nodeElement);
    });

    feather.replace();

    // GSAP Animation
    const contentSections = document.querySelectorAll('.content__section');

    function openSection(nodeId) {
        mouseConstraint.mouse.element.removeEventListener('mousedown', mouseConstraint.mousedown);
        mouseConstraint.mouse.element.removeEventListener('mousemove', mouseConstraint.mousemove);
        mouseConstraint.mouse.element.removeEventListener('mouseup', mouseConstraint.mouseup);
        const section = document.getElementById(nodeId);
        const nodeElement = document.getElementById(`node-${nodeId}`);
        const nodeIcon = nodeElement.querySelector('svg');
        const nodeRect = nodeElement.getBoundingClientRect();

        const nodeBody = nodes.find(n => n.label === nodeId);
        if (nodeBody) {
            Matter.Body.setStatic(nodeBody, true);
        }

        const padding = 80; // 40px padding on each side

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
                borderRadius: '20px', // Rounded corners for the window
                ease: 'power3.inOut'
            }, 0)
            .to(section, { 
                duration: 0.4, 
                autoAlpha: 1, 
                ease: 'power2.inOut',
                clipPath: `inset(0 0 0 0 round 20px)`
            }, '>-0.4');
    }

    function closeSection(nodeId) {
        mouseConstraint.mouse.element.addEventListener('mousedown', mouseConstraint.mousedown);
        mouseConstraint.mouse.element.addEventListener('mousemove', mouseConstraint.mousemove);
        mouseConstraint.mouse.element.addEventListener('mouseup', mouseConstraint.mouseup);
        const section = document.getElementById(nodeId);
        const nodeElement = document.getElementById(`node-${nodeId}`);
        const nodeIcon = nodeElement.querySelector('svg');

        const timeline = gsap.timeline({
            onComplete: () => {
                const nodeBody = nodes.find(n => n.label === nodeId);
                if (nodeBody && nodeId !== 'about') { // Ensure the main node is not set to dynamic
                    Matter.Body.setStatic(nodeBody, false);
                }
                gsap.set(nodeElement, { zIndex: '' });
                gsap.set(section, { clipPath: '' });
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

    // Event Listeners
    nodes.forEach(node => {
        const nodeElement = document.getElementById(`node-${node.label}`);
        nodeElement.addEventListener('click', () => openSection(node.label));
    });

    contentSections.forEach(section => {
        const backButton = document.createElement('button');
        backButton.classList.add('back-button');
        backButton.innerHTML = '<i data-feather="arrow-left"></i>';
        backButton.addEventListener('click', () => closeSection(section.id));
        section.appendChild(backButton);
        feather.replace();
    });

    // Sync DOM elements with Matter.js bodies
    (function update() {
        nodes.forEach(node => {
            const nodeElement = document.getElementById(`node-${node.label}`);
            if (nodeElement.style.width !== '100vw') { // Don't update position during animation
                nodeElement.style.left = `${node.position.x - radius}px`;
                nodeElement.style.top = `${node.position.y - radius}px`;
            }
        });
        requestAnimationFrame(update);
    })();

    // CLI Functionality
    const cliTrigger = document.querySelector('.cli__trigger');
    const cliWindow = document.querySelector('.cli__window');
    const cliOutput = document.querySelector('.cli__output');
    const cliInput = document.querySelector('.cli__input');

    cliTrigger.addEventListener('click', () => {
        cliWindow.classList.add('is-open');
        cliInput.focus();
        // Welcome message on open
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
                response = 'Theme set to light';
                break;
            case 'theme dark':
                document.body.classList.add('dark-mode');
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
});
