/**
 * Prashant Jha - AI Control Dashboard Workspace JavaScript Engine
 * Features: Dashboard Pane Router, High-Visibility Obsidian Console, Three.js WebGL Cosmic Scene,
 * Numerical Counters, Project Filters & FormSubmit Email Dispatcher.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. DASHBOARD WORKSPACE PANE ROUTER ENGINE
    // --------------------------------------------------------------------------
    const panes = document.querySelectorAll('.dashboard-pane');
    const navItems = document.querySelectorAll('.nav-item');
    const paneTriggers = document.querySelectorAll('[data-pane]');
    const topViewTitle = document.getElementById('top-view-title');
    const sidebarNav = document.getElementById('sidebar-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    const paneTitles = {
        'dashboard': 'OVERVIEW DASHBOARD',
        'about': 'DEVELOPER BRIEFING',
        'skills': 'CAPABILITIES MATRIX',
        'projects': 'SOFTWARE ARCHITECTURES',
        'terminal': 'AI CONSOLE ENGINE',
        'contact': 'TRANSMIT SIGNAL'
    };

    function switchPane(paneId) {
        if (!paneId) paneId = 'dashboard';
        const targetId = paneId.replace('#', '');
        let targetPane = document.getElementById(`pane-${targetId}`);
        
        if (!targetPane) {
            targetPane = document.getElementById('pane-dashboard');
        }

        // Deactivate all panes
        panes.forEach(p => p.classList.remove('active-pane'));

        // Activate target pane
        if (targetPane) {
            targetPane.classList.add('active-pane');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update Nav Active State
        navItems.forEach(item => {
            item.classList.remove('active');
            const itemPane = item.getAttribute('data-pane');
            if (itemPane === targetId) {
                item.classList.add('active');
            }
        });

        // Update Top Bar View Title
        if (topViewTitle && paneTitles[targetId]) {
            topViewTitle.textContent = paneTitles[targetId];
        }

        // Close mobile sidebar drawer and overlay if open
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebarNav) {
            sidebarNav.classList.remove('active-drawer');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active-overlay');
        }
    }

    // Attach click handlers to all data-pane elements
    paneTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const paneId = trigger.getAttribute('data-pane');
            if (paneId) {
                switchPane(paneId);
            }
        });
    });

    // Mobile Hamburger Toggle Button & Overlay Click
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (mobileMenuBtn && sidebarNav) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebarNav.classList.toggle('active-drawer');
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active-overlay');
            }
        });
    }

    if (sidebarOverlay && sidebarNav) {
        sidebarOverlay.addEventListener('click', () => {
            sidebarNav.classList.remove('active-drawer');
            sidebarOverlay.classList.remove('active-overlay');
        });
    }

    // Hash navigation change
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) switchPane(hash);
    });

    // Initial load route
    const initialHash = window.location.hash.substring(1);
    switchPane(initialHash || 'dashboard');

    // --------------------------------------------------------------------------
    // 2. WEB AUDIO SYNTHESIZER SOUND ENGINE
    // --------------------------------------------------------------------------
    let isSoundEnabled = false;
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSynthSound(freqStart, freqEnd, duration, type = 'sine') {
        if (!isSoundEnabled || !audioCtx) return;
        try {
            initAudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freqStart, audioCtx.currentTime);
            if (freqEnd) {
                osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);
            }
            
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio play failed:', e);
        }
    }

    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            initAudioContext();
            isSoundEnabled = !isSoundEnabled;
            if (isSoundEnabled) {
                soundToggleBtn.classList.add('active');
                soundToggleBtn.querySelector('.sound-icon').textContent = '🔊';
                soundToggleBtn.querySelector('.sound-text').textContent = 'SFX ON';
                playSynthSound(800, 1200, 0.15, 'sine');
            } else {
                soundToggleBtn.classList.remove('active');
                soundToggleBtn.querySelector('.sound-icon').textContent = '🔇';
                soundToggleBtn.querySelector('.sound-text').textContent = 'SFX OFF';
            }
        });
    }

    document.querySelectorAll('button, a, .filter-btn, .t-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (isSoundEnabled) playSynthSound(600, 800, 0.05, 'sine');
        });
        el.addEventListener('click', () => {
            if (isSoundEnabled) playSynthSound(900, 400, 0.08, 'triangle');
        });
    });

    // --------------------------------------------------------------------------
    // 3. THREE.JS 3D PLANETARY COSMIC SPACE WEBGL ENGINE
    // --------------------------------------------------------------------------
    function initThreeJS() {
        const canvas = document.getElementById('bg-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 35;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting System
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(20, 20, 20);
        scene.add(dirLight);

        const pointLight = new THREE.PointLight(0xffffff, 2, 80);
        pointLight.position.set(-15, -10, 15);
        scene.add(pointLight);

        // --- 1. DENSE WHITE & SILVER STARFIELD ---
        const starCount = 2800;
        const starGeo = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starScales = new Float32Array(starCount);

        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 140;
            starPositions[i + 1] = (Math.random() - 0.5) * 140;
            starPositions[i + 2] = (Math.random() - 0.5) * 140;
            starScales[i / 3] = Math.random() * 0.4 + 0.1;
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        const starMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.25,
            transparent: true,
            opacity: 0.85
        });

        const starSystem = new THREE.Points(starGeo, starMat);
        scene.add(starSystem);

        // --- 2. PLANET 1: SATURN-STYLE RINGED GAS GIANT ---
        const planetGroup1 = new THREE.Group();
        planetGroup1.position.set(16, 6, -15);

        // Planet Body
        const p1Geo = new THREE.SphereGeometry(4.2, 32, 32);
        const p1Mat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.4,
            metalness: 0.6,
            wireframe: false
        });
        const planet1 = new THREE.Mesh(p1Geo, p1Mat);
        planetGroup1.add(planet1);

        // Wireframe Overlay Grid for High-Tech Aesthetic
        const p1WireMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.12
        });
        const planet1Wire = new THREE.Mesh(p1Geo, p1WireMat);
        planetGroup1.add(planet1Wire);

        // Planetary Ring
        const ringGeo = new THREE.RingGeometry(5.4, 8.5, 64);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
            metalness: 0.8
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        ring.rotation.y = -0.2;
        planetGroup1.add(ring);

        scene.add(planetGroup1);

        // --- 3. PLANET 2: CRATERED MONOCHROME MOON ---
        const planetGroup2 = new THREE.Group();
        planetGroup2.position.set(-18, 12, -22);

        const p2Geo = new THREE.SphereGeometry(2.5, 24, 24);
        const p2Mat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.8,
            metalness: 0.3
        });
        const planet2 = new THREE.Mesh(p2Geo, p2Mat);
        planetGroup2.add(planet2);

        const p2WireMat = new THREE.MeshBasicMaterial({
            color: 0xe2e8f0,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const planet2Wire = new THREE.Mesh(p2Geo, p2WireMat);
        planetGroup2.add(planet2Wire);

        scene.add(planetGroup2);

        // --- 4. PLANET 3: DISTANT ICE SPHERE ---
        const p3Geo = new THREE.SphereGeometry(1.8, 20, 20);
        const p3Mat = new THREE.MeshStandardMaterial({
            color: 0x475569,
            roughness: 0.5,
            metalness: 0.5
        });
        const planet3 = new THREE.Mesh(p3Geo, p3Mat);
        planet3.position.set(-14, -16, -18);
        scene.add(planet3);

        // --- MOUSE & TOUCH PARALLAX INTERACTIVITY ---
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        function updatePointer(clientX, clientY) {
            targetMouseX = (clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (clientY / window.innerHeight - 0.5) * 2;
        }

        window.addEventListener('mousemove', (e) => {
            updatePointer(e.clientX, e.clientY);
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updatePointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Rotate Starfield
            starSystem.rotation.y = elapsedTime * 0.015;
            starSystem.rotation.x = elapsedTime * 0.008;

            // Rotate Planets
            planetGroup1.rotation.y = elapsedTime * 0.04;
            planet1Wire.rotation.y = -elapsedTime * 0.02;

            planetGroup2.rotation.y = -elapsedTime * 0.03;
            planet2.rotation.x = elapsedTime * 0.01;

            planet3.rotation.y = elapsedTime * 0.025;

            // Camera Parallax Panning
            camera.position.x = mouseX * 5;
            camera.position.y = -mouseY * 5;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initThreeJS();

    // --------------------------------------------------------------------------
    // 4. DYNAMIC TYPING SUBTITLE ENGINE
    // --------------------------------------------------------------------------
    function initTypingEffect() {
        const typedTextEl = document.getElementById('typed-text');
        if (!typedTextEl) return;

        const phrases = [
            "AI & ML Pipelines",
            "Multi-stage RAG Systems",
            "Encrypted Health Vaults",
            "Cross-Platform Apps",
            "Next-Gen Software Engines"
        ];

        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const typeSpeed = 90;
        const deleteSpeed = 45;
        const pauseDelay = 2200;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typedTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typedTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeLoop, pauseDelay);
                return;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }

            const speed = isDeleting ? deleteSpeed : typeSpeed;
            setTimeout(typeLoop, speed);
        }

        typeLoop();
    }

    initTypingEffect();

    // --------------------------------------------------------------------------
    // 5. HIGH-VISIBILITY OBSIDIAN ICE TERMINAL CONSOLE ENGINE
    // --------------------------------------------------------------------------
    function initTerminal() {
        const terminalForm = document.getElementById('terminal-form');
        const terminalInput = document.getElementById('terminal-input');
        const terminalOutput = document.getElementById('terminal-output');
        const quickBtns = document.querySelectorAll('.t-btn');

        if (!terminalOutput || !terminalInput) return;

        const commands = {
            'help': () => `
<div class="t-line t-output-title">[Available Space Console Queries]</div>
<div class="t-line">• <span class="t-highlight">whoami</span> : Display developer credentials & academic status.</div>
<div class="t-line">• <span class="t-highlight">skills</span> : Output technical AI/ML & full-stack matrix.</div>
<div class="t-line">• <span class="t-highlight">projects</span> : List featured software architectures.</div>
<div class="t-line">• <span class="t-highlight">contact</span> : Display direct communication channels.</div>
<div class="t-line">• <span class="t-highlight">clear</span> : Clear console screen.</div>`,

            'whoami': () => `
<div class="t-line t-output-title">[Developer Profile Briefing]</div>
<div class="t-line">Name: Prashant Jha</div>
<div class="t-line">Degree: B.E. Artificial Intelligence & Machine Learning</div>
<div class="t-line">Institute: St. Francis Institute of Technology (SFIT), Mumbai</div>
<div class="t-line">Current Status: Semester IV • Active Engineering Student</div>
<div class="t-line">Opportunities: Seeking AI & ML Engineering Internships</div>
<div class="t-line">Mission: Constructing high-throughput intelligent AI architectures.</div>`,

            'skills': () => `
<div class="t-line t-output-title">[Technical Matrix & Stack]</div>
<div class="t-line">• <b>AI/ML:</b> Gemini API, RAG Systems, SBERT Embeddings, TF-IDF, Ensemble Learning</div>
<div class="t-line">• <b>Languages:</b> Python, Dart (Flutter), JavaScript, C/C++, HTML5/CSS3, SQL</div>
<div class="t-line">• <b>Frameworks:</b> Flutter, React.js, Next.js, FastAPI, Firebase, Node.js</div>
<div class="t-line">• <b>DevOps & Tools:</b> Git, GitHub, Docker, VS Code, Zod Validation, AES-256</div>`,

            'projects': () => `
<div class="t-line t-output-title">[Featured Architectures]</div>
<div class="t-line">1. <b>MediLocker:</b> Cross-platform medical vault with AES-256 encryption & Gemini AI summary.</div>
<div class="t-line">2. <b>AI Forge:</b> Multi-stage software compiler with Zod schema validation & auto-repair.</div>
<div class="t-line">3. <b>TruthLens:</b> Fake news detection system with SBERT sentence embeddings & RAG verification.</div>
<div class="t-line">4. <b>TaskFlow:</b> Reactive task manager with state synchronization & priority scheduler.</div>`,

            'contact': () => `
<div class="t-line t-output-title">[Direct Communication Channels]</div>
<div class="t-line">Email: pkj0446@gmail.com</div>
<div class="t-line">Phone: +91 9167260747</div>
<div class="t-line">Location: Mumbai, India</div>
<div class="t-line">LinkedIn: linkedin.com/in/prashant-jha-4p/</div>
<div class="t-line">GitHub: github.com/Prashantj44</div>`,

            'clear': () => null
        };

        function executeCommand(cmdRaw) {
            const cmd = cmdRaw.trim().toLowerCase();
            if (!cmd) return;

            if (cmd === 'clear') {
                terminalOutput.innerHTML = '';
                return;
            }

            const userLine = document.createElement('div');
            userLine.className = 't-line';
            userLine.innerHTML = `<span class="t-prompt-label">prashant@ai-core:~$</span> <span style="color:#ffffff; font-weight:600;">${cmdRaw}</span>`;
            terminalOutput.appendChild(userLine);

            if (commands[cmd]) {
                const responseHtml = commands[cmd]();
                if (responseHtml) {
                    const responseContainer = document.createElement('div');
                    responseContainer.innerHTML = responseHtml;
                    terminalOutput.appendChild(responseContainer);
                }
            } else {
                const errLine = document.createElement('div');
                errLine.className = 't-line';
                errLine.innerHTML = `<span style="color:#ef4444;">Command not recognized: '${cmdRaw}'. Type <span class="t-highlight">help</span> for available commands.</span>`;
                terminalOutput.appendChild(errLine);
            }

            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            if (isSoundEnabled) playSynthSound(1000, 500, 0.1, 'sawtooth');
        }

        if (terminalForm) {
            terminalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const val = terminalInput.value;
                executeCommand(val);
                terminalInput.value = '';
            });
        }

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.getAttribute('data-cmd');
                executeCommand(cmd);
            });
        });
    }

    initTerminal();

    // --------------------------------------------------------------------------
    // 6. PROJECT CATEGORY FILTERING ENGINE
    // --------------------------------------------------------------------------
    function initProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.vault-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    if (filter === 'all' || (categories && categories.includes(filter))) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    initProjectFiltering();

    // --------------------------------------------------------------------------
    // 7. NUMERICAL COUNTER ANIMATION ENGINE
    // --------------------------------------------------------------------------
    function initStatsCounter() {
        const counters = document.querySelectorAll('.metric-val[data-target]');
        const observerOptions = { threshold: 0.5 };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    let current = 0;
                    const increment = Math.ceil(target / 30);
                    const duration = 1000;
                    const stepTime = duration / (target / increment);

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = current;
                        }
                    }, stepTime);

                    obs.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(c => observer.observe(c));
    }

    initStatsCounter();

    // --------------------------------------------------------------------------
    // 8. REAL EMAIL DISPATCH ENGINE (FORMSUBMIT API + MAILTO FALLBACK)
    // --------------------------------------------------------------------------
    function initRealEmailDispatch() {
        const contactForm = document.getElementById('profile-contact-form');
        const statusBox = document.getElementById('form-status');
        const submitBtn = document.getElementById('contact-submit-btn');

        if (!contactForm || !statusBox || !submitBtn) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showStatus('Please complete all required fields.', 'error');
                return;
            }

            showStatus('⏳ Transmitting message directly to pkj0446@gmail.com...', 'sending');
            submitBtn.disabled = true;
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span> 🚀';

            try {
                const response = await fetch("https://formsubmit.co/ajax/pkj0446@gmail.com", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New Portfolio Message from ${name}`
                    })
                });

                const result = await response.json();

                if (response.ok || result.success === "true" || result.message) {
                    showStatus(`✓ Message transmitted! Prashant has received your email at pkj0446@gmail.com.`, 'success');
                    if (isSoundEnabled) playSynthSound(1200, 1600, 0.25, 'sine');
                    contactForm.reset();
                } else {
                    throw new Error('FormSubmit API response error');
                }
            } catch (err) {
                console.warn('AJAX Email dispatch fallback triggered:', err);
                showStatus(`✓ Opening mail client to send message to pkj0446@gmail.com...`, 'success');
                
                setTimeout(() => {
                    const mailtoUrl = `mailto:pkj0446@gmail.com?subject=${encodeURIComponent('Portfolio Message from ' + name)}&body=${encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message)}`;
                    window.location.href = mailtoUrl;
                }, 800);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });

        function showStatus(text, type) {
            statusBox.className = `form-status-msg ${type}`;
            statusBox.textContent = text;
            statusBox.style.display = 'block';
        }
    }

    initRealEmailDispatch();
});
