/**
 * Prashant Jha - Space Sci-Fi Multi-Page Interactive Portfolio JavaScript Engine
 * Features: Three.js 3D Cosmic Starfield, Client-Side Multi-Page View Router,
 * Space Command AI Terminal (High-Visibility), Web Audio Synth, FormSubmit API Dispatcher.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. CLIENT-SIDE MULTI-PAGE ROUTER SYSTEM
    // --------------------------------------------------------------------------
    const pageViews = document.querySelectorAll('.page-view');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTriggers = document.querySelectorAll('[data-page]');

    function navigateToPage(pageId) {
        if (!pageId) pageId = 'home';
        // Clean hash string
        const targetId = pageId.replace('#', '');
        
        let targetView = document.getElementById(`page-${targetId}`);
        if (!targetView) {
            targetView = document.getElementById('page-home');
        }

        // Deactivate all page views
        pageViews.forEach(view => {
            view.classList.remove('active-page');
        });

        // Activate target page view
        if (targetView) {
            targetView.classList.add('active-page');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update Nav Active Link State
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('data-page');
            if (linkPage === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Attach click listeners to all data-page triggers
    pageTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const pageId = trigger.getAttribute('data-page');
            if (pageId) {
                navigateToPage(pageId);
                // Close mobile hamburger if open
                const hamburgerBtn = document.getElementById('hamburger-btn');
                const navLinksContainer = document.querySelector('.nav-links');
                if (hamburgerBtn && navLinksContainer) {
                    hamburgerBtn.classList.remove('active');
                    navLinksContainer.classList.remove('active');
                }
            }
        });
    });

    // Handle browser hash navigation
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) navigateToPage(hash);
    });

    // Initial page load route
    const initialHash = window.location.hash.substring(1);
    navigateToPage(initialHash || 'home');

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
    // 3. THREE.JS 3D COSMIC STARFIELD WEBGL CANVAS
    // --------------------------------------------------------------------------
    function initThreeJS() {
        const canvas = document.getElementById('bg-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Central 3D Sci-Fi Orbital Ring Core
        const coreGroup = new THREE.Group();
        
        const geoOuter = new THREE.IcosahedronGeometry(8, 1);
        const matOuter = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            wireframe: true,
            transparent: true,
            opacity: 0.18
        });
        const meshOuter = new THREE.Mesh(geoOuter, matOuter);
        coreGroup.add(meshOuter);

        const geoInner = new THREE.OctahedronGeometry(4.5, 0);
        const matInner = new THREE.MeshBasicMaterial({
            color: 0xffb703,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const meshInner = new THREE.Mesh(geoInner, matInner);
        coreGroup.add(meshInner);

        scene.add(coreGroup);

        // 3D Cosmic Particle Universe (Starfield)
        const particleCount = 1800;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0x00f3ff,
            size: 0.25,
            transparent: true,
            opacity: 0.65
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // Mouse Parallax Interactivity
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // Render Loop
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            meshOuter.rotation.x = elapsedTime * 0.12;
            meshOuter.rotation.y = elapsedTime * 0.18;

            meshInner.rotation.x = -elapsedTime * 0.22;
            meshInner.rotation.y = -elapsedTime * 0.28;

            particleSystem.rotation.y = elapsedTime * 0.04;
            particleSystem.rotation.x = elapsedTime * 0.02;

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
    // 5. HIGH-VISIBILITY SPACE COMMAND AI TERMINAL ENGINE (FIXED)
    // --------------------------------------------------------------------------
    function initTerminal() {
        const terminalForm = document.getElementById('terminal-form');
        const terminalInput = document.getElementById('terminal-input');
        const terminalOutput = document.getElementById('terminal-output');
        const quickBtns = document.querySelectorAll('.t-btn');
        const demoTriggers = document.querySelectorAll('.btn-demo-trigger');

        if (!terminalOutput || !terminalInput) return;

        const commands = {
            'help': () => `
<div class="t-line t-output-title">[Available Space Command Queries]</div>
<div class="t-line">• <span class="cmd-highlight">whoami</span> : Display developer credentials & academic details.</div>
<div class="t-line">• <span class="cmd-highlight">skills</span> : Output technical AI/ML & full-stack matrix.</div>
<div class="t-line">• <span class="cmd-highlight">projects</span> : List featured software architectures.</div>
<div class="t-line">• <span class="cmd-highlight">run medilocker</span> : Execute AES-256 encrypted health vault diagnostic.</div>
<div class="t-line">• <span class="cmd-highlight">run aiforge</span> : Trigger multi-stage AI software compilation demo.</div>
<div class="t-line">• <span class="cmd-highlight">run truthlens</span> : Execute SBERT & RAG misinformation verification pipeline.</div>
<div class="t-line">• <span class="cmd-highlight">contact</span> : Display direct communication channels.</div>
<div class="t-line">• <span class="cmd-highlight">clear</span> : Clear console screen.</div>`,

            'whoami': () => `
<div class="t-line t-output-title">[Developer Profile Briefing]</div>
<div class="t-line">Name: Prashant Jha</div>
<div class="t-line">Degree: B.E. Artificial Intelligence & Machine Learning</div>
<div class="t-line">Institute: St. Francis Institute of Technology (SFIT), Mumbai</div>
<div class="t-line">Current Status: Semester IV • Active Engineering Student</div>
<div class="t-line">Internship: AI Systems & Software Intern at InAmigos Foundation</div>
<div class="t-line">Mission: Constructing high-throughput intelligent AI architectures.</div>`,

            'skills': () => `
<div class="t-line t-output-title">[Technical Matrix & Stack]</div>
<div class="t-line">🤖 <b>AI/ML:</b> Gemini API, RAG Systems, SBERT Embeddings, TF-IDF, Ensemble Learning</div>
<div class="t-line">💻 <b>Languages:</b> Python, Dart (Flutter), JavaScript, C/C++, HTML5/CSS3, SQL</div>
<div class="t-line">🚀 <b>Frameworks:</b> Flutter, React.js, Next.js, FastAPI, Firebase, Node.js</div>
<div class="t-line">🛠️ <b>DevOps & Tools:</b> Git, GitHub, Docker, VS Code, Zod Validation, AES-256</div>`,

            'projects': () => `
<div class="t-line t-output-title">[Featured Architectures]</div>
<div class="t-line">1. <b>MediLocker:</b> Cross-platform medical vault with AES-256 encryption & Gemini AI summary.</div>
<div class="t-line">2. <b>AI Forge:</b> Multi-stage software compiler with Zod schema validation & auto-repair.</div>
<div class="t-line">3. <b>TruthLens:</b> Fake news detection system with SBERT sentence embeddings & RAG verification.</div>
<div class="t-line">4. <b>TaskFlow:</b> Reactive task manager with state synchronization & priority scheduler.</div>`,

            'run medilocker': () => `
<div class="t-line t-output-title">[MediLocker Vault Diagnostic]</div>
<div class="t-line">Encryption: AES-256 Payload CBC Mode ... [SECURE]</div>
<div class="t-line">Framework: Flutter Cross-Platform + Firebase Firestore ... [ACTIVE]</div>
<div class="t-line">AI Model: Gemini 1.5 Health Summary Pipeline ... [READY]</div>
<div class="t-output-json">{
  "vault_status": "LOCKED_SECURE",
  "cipher": "AES-256-CBC",
  "cross_platform": true,
  "ai_summary_engine": "GEMINI_PRO_ACTIVE"
}</div>`,

            'run aiforge': () => `
<div class="t-line t-output-title">[AI Forge Compiler Engine]</div>
<div class="t-line">Stage 1: Spec Analysis & AST Planning ... [COMPLETE]</div>
<div class="t-line">Stage 2: Code Generation with Zod Schema Validation ... [COMPLETE]</div>
<div class="t-line">Stage 3: Automated Static Analysis & Syntax Repair Loop ... [COMPLETE]</div>
<div class="t-output-json">{
  "compilation": "SUCCESS",
  "generated_modules": ["index.html", "style.css", "app.js"],
  "hallucination_repair": "0_ERRORS"
}</div>`,

            'run truthlens': () => `
<div class="t-line t-output-title">[TruthLens RAG Verification Engine]</div>
<div class="t-line">Vector Model: SBERT sentence-transformers/all-MiniLM-L6-v2</div>
<div class="t-line">Classification: Ensemble Model (TF-IDF + Cosine Similarity)</div>
<div class="t-output-json">{
  "verification": "VERIFIED_GENUINE",
  "confidence_score": 0.9982,
  "rag_knowledge_sources": 14,
  "latency_ms": 128
}</div>`,

            'contact': () => `
<div class="t-line t-output-title">[Direct Communication Channels]</div>
<div class="t-line">📧 Email: pkj0446@gmail.com</div>
<div class="t-line">📞 Phone: +91 9167260747</div>
<div class="t-line">📍 Location: Mumbai, India</div>
<div class="t-line">🔗 LinkedIn: linkedin.com/in/prashant-jha-4p/</div>
<div class="t-line">💻 GitHub: github.com/Prashantj44</div>`,

            'clear': () => null
        };

        function executeCommand(cmdRaw) {
            const cmd = cmdRaw.trim().toLowerCase();
            if (!cmd) return;

            if (cmd === 'clear') {
                terminalOutput.innerHTML = '';
                return;
            }

            // Append command prompt line
            const userLine = document.createElement('div');
            userLine.className = 't-line';
            userLine.innerHTML = `<span class="t-prompt">prashant@ai-core:~$</span> <span style="color:#ffffff; font-weight:600;">${cmdRaw}</span>`;
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
                errLine.innerHTML = `<span style="color:#ff5f56;">Command not recognized: '${cmdRaw}'. Type <span class="cmd-highlight">help</span> for available commands.</span>`;
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

        demoTriggers.forEach(btn => {
            btn.addEventListener('click', () => {
                const demoKey = btn.getAttribute('data-demo');
                // Navigate to terminal page view
                navigateToPage('terminal');
                setTimeout(() => {
                    executeCommand(`run ${demoKey}`);
                }, 400);
            });
        });
    }

    initTerminal();

    // --------------------------------------------------------------------------
    // 6. PROJECT CATEGORY FILTERING ENGINE
    // --------------------------------------------------------------------------
    function initProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

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
        const counters = document.querySelectorAll('.qstat-num');
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
            submitBtn.innerHTML = '<span>Transmitting...</span> 🚀';

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
                        _subject: `New Space Portfolio Message from ${name}`
                    })
                });

                const result = await response.json();

                if (response.ok || result.success === "true" || result.message) {
                    showStatus(`✓ Signal transmitted! Prashant has received your message at pkj0446@gmail.com.`, 'success');
                    if (isSoundEnabled) playSynthSound(1200, 1600, 0.25, 'sine');
                    contactForm.reset();
                } else {
                    throw new Error('FormSubmit API response error');
                }
            } catch (err) {
                console.warn('AJAX Email dispatch fallback triggered:', err);
                showStatus(`✓ Opening mail app to deliver message to pkj0446@gmail.com...`, 'success');
                
                setTimeout(() => {
                    const mailtoUrl = `mailto:pkj0446@gmail.com?subject=${encodeURIComponent('Space Portfolio Message from ' + name)}&body=${encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message)}`;
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

    // --------------------------------------------------------------------------
    // 9. NAVBAR SCROLL EFFECT & MOBILE HAMBURGER TOGGLE
    // --------------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburgerBtn && navLinksContainer) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }
});
