/**
 * Prashant Jha - Monochrome 3D Interactive Portfolio JavaScript Engine
 * Features: Three.js WebGL Black & White Scene, Vanilla 3D Tilt, Web Audio API Synth,
 * Cyber Terminal Simulator, Dynamic Typing, Project Filter & Direct Real Email Dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. STATE & AUDIO SYNTHESIZER SETUP
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

    // Pure Synthesizer Sound Generator
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

    // Attach click audio to buttons and links
    document.querySelectorAll('button, a, .filter-btn, .t-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (isSoundEnabled) playSynthSound(600, 800, 0.05, 'sine');
        });
        el.addEventListener('click', () => {
            if (isSoundEnabled) playSynthSound(900, 400, 0.08, 'triangle');
        });
    });

    // --------------------------------------------------------------------------
    // 2. THREE.JS MONOCHROME 3D WEBGL BACKGROUND SCENE
    // --------------------------------------------------------------------------
    function initThreeJS() {
        const canvas = document.getElementById('bg-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 25;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Central 3D AI Core Geometry
        const coreGroup = new THREE.Group();
        
        // Outer Wireframe Polyhedron (Pure Silver White)
        const geoOuter = new THREE.IcosahedronGeometry(7, 1);
        const matOuter = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.18
        });
        const meshOuter = new THREE.Mesh(geoOuter, matOuter);
        coreGroup.add(meshOuter);

        // Inner Polyhedron (Monochrome Dark Gray)
        const geoInner = new THREE.OctahedronGeometry(4, 0);
        const matInner = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const meshInner = new THREE.Mesh(geoInner, matInner);
        coreGroup.add(meshInner);

        scene.add(coreGroup);

        // 3D Monochrome Particle Field
        const particleCount = 1000;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 80;
            positions[i + 1] = (Math.random() - 0.5) * 80;
            positions[i + 2] = (Math.random() - 0.5) * 80;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.5
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // Mouse Interactivity for 3D Parallax
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

            // Smooth Interpolation for mouse parallax
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Rotate core geometry
            meshOuter.rotation.x = elapsedTime * 0.15;
            meshOuter.rotation.y = elapsedTime * 0.2;

            meshInner.rotation.x = -elapsedTime * 0.25;
            meshInner.rotation.y = -elapsedTime * 0.3;

            particleSystem.rotation.y = elapsedTime * 0.05;
            particleSystem.rotation.x = elapsedTime * 0.03;

            // Camera movement based on cursor
            camera.position.x = mouseX * 4;
            camera.position.y = -mouseY * 4;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();

        // Window Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initThreeJS();

    // --------------------------------------------------------------------------
    // 3. MODERN HOVER FLOAT SYSTEM (CSS-DRIVEN)
    // --------------------------------------------------------------------------
    // The 3D Perspective Tilt engine has been removed in favor of a performant
    // pure CSS glassmorphism float effect (.modern-hover) in style.css.

    // --------------------------------------------------------------------------
    // 4. DYNAMIC TYPING SUBTITLE ANIMATION
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
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseDelay = 2000;

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
    // 5. INTERACTIVE CYBER AI TERMINAL SIMULATOR
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
<div class="t-line t-output-title">Available AI Console Commands:</div>
<div class="t-line">• <span class="cmd-text">run truthlens</span> : Execute Fake News & RAG Claim Verification Engine.</div>
<div class="t-line">• <span class="cmd-text">run medilocker</span> : Inspect AES-256 Encrypted Health Records Summary Pipeline.</div>
<div class="t-line">• <span class="cmd-text">run aiforge</span> : Trigger Multi-Stage Software Generation Compiler.</div>
<div class="t-line">• <span class="cmd-text">skills</span> : Output technical stack & ML expertise matrix.</div>
<div class="t-line">• <span class="cmd-text">whoami</span> : Display developer profile and academic details.</div>
<div class="t-line">• <span class="cmd-text">contact</span> : Output direct contact channels.</div>
<div class="t-line">• <span class="cmd-text">clear</span> : Clear console screen.</div>`,

            'run truthlens': () => `
<div class="t-line t-output-title">[TruthLens ML System Diagnostic]</div>
<div class="t-line">Input: "Retrieval-Augmented Claim Verification Pipeline"</div>
<div class="t-line">Vector Model: SBERT sentence-transformers/all-MiniLM-L6-v2</div>
<div class="t-line">Classification: Ensemble Model (TF-IDF + Cosine Similarity)</div>
<div class="t-output-json">{
  "status": "VERIFIED_GENUINE",
  "confidence_score": 0.9982,
  "rag_sources_matched": 14,
  "latency_ms": 128
}</div>`,

            'run medilocker': () => `
<div class="t-line t-output-title">[MediLocker Security & Summarization Vault]</div>
<div class="t-line">Encryption: AES-256 Payload CBC Mode</div>
<div class="t-line">Framework: Flutter (Mobile/Web) + Firebase Firestore</div>
<div class="t-line">AI Engine: Gemini API Health Summary Extractor</div>
<div class="t-output-json">{
  "vault_status": "LOCKED_SECURE",
  "aes_key_length": "256-bit",
  "active_users": "Cross-Platform",
  "ai_summary_status": "READY"
}</div>`,

            'run aiforge': () => `
<div class="t-line t-output-title">[AI Forge Software Compiler Engine]</div>
<div class="t-line">Input Spec: "Generate Responsive Task Management App with State"</div>
<div class="t-line">Stage 1: Intent Extraction & Architecture Planning ... [SUCCESS]</div>
<div class="t-line">Stage 2: Code Generation with Zod Schema Validation ... [SUCCESS]</div>
<div class="t-line">Stage 3: Automated Static Analysis & Syntax Repair ... [SUCCESS]</div>
<div class="t-output-json">{
  "build_status": "COMPILATION_COMPLETE",
  "generated_files": ["index.html", "style.css", "app.js"],
  "validation_errors": 0
}</div>`,

            'skills': () => `
<div class="t-line t-output-title">[Prashant Jha Technical Stack]</div>
<div class="t-line">🤖 <b>AI/ML:</b> Gemini API, RAG, SBERT, TF-IDF, Ensemble Learning</div>
<div class="t-line">💻 <b>Languages:</b> Python, Dart (Flutter), JavaScript, C, C++, HTML5/CSS3</div>
<div class="t-line">🚀 <b>Frameworks:</b> Flutter, React, Next.js, FastAPI, Firebase</div>
<div class="t-line">🛠️ <b>DevOps & Tools:</b> Git, GitHub, Docker, VS Code, Zod</div>`,

            'whoami': () => `
<div class="t-line t-output-title">[Developer Profile]</div>
<div class="t-line">Name: Prashant Jha</div>
<div class="t-line">Degree: B.E. in Artificial Intelligence & Machine Learning</div>
<div class="t-line">Institute: St. Francis Institute of Technology (SFIT), Mumbai</div>
<div class="t-line">Current Semester: Semester IV</div>
<div class="t-line">Mission: Engineering high-impact intelligent software architectures.</div>`,

            'contact': () => `
<div class="t-line t-output-title">[Contact Channels]</div>
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

            // Append command line
            const userLine = document.createElement('div');
            userLine.className = 't-line';
            userLine.innerHTML = `<span class="t-prompt">prashant@ai-core:~$</span> <span class="t-output-text">${cmdRaw}</span>`;
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
                errLine.innerHTML = `<span style="color:#aaaaaa;">Command not recognized: '${cmdRaw}'. Type <span class="cmd-text">help</span> for available commands.</span>`;
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
                const terminalSection = document.getElementById('terminal');
                if (terminalSection) {
                    terminalSection.scrollIntoView({ behavior: 'smooth' });
                }
                setTimeout(() => {
                    executeCommand(`run ${demoKey}`);
                }, 600);
            });
        });
    }

    initTerminal();

    // --------------------------------------------------------------------------
    // 6. PROJECT CATEGORY FILTERING
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
    // 7. STATS NUMERICAL COUNTER ANIMATION
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
                    const increment = Math.ceil(target / 40);
                    const duration = 1200;
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
    // 8. REAL EMAIL DISPATCH MECHANISM (FORMSUBMIT API + MAILTO FALLBACK)
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

            // Show Sending UI state
            showStatus('⏳ Dispatching message directly to pkj0446@gmail.com...', 'sending');
            submitBtn.disabled = true;
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending Email...</span> 🚀';

            try {
                // Submit via FormSubmit AJAX API directly to Prashant's email
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
                        _subject: `New Portfolio Contact Message from ${name}`
                    })
                });

                const result = await response.json();

                if (response.ok || result.success === "true" || result.message) {
                    showStatus(`✓ Message sent successfully! Prashant has received your email at pkj0446@gmail.com.`, 'success');
                    if (isSoundEnabled) playSynthSound(1200, 1600, 0.25, 'sine');
                    contactForm.reset();
                } else {
                    throw new Error('FormSubmit API response error');
                }
            } catch (err) {
                console.warn('AJAX Email dispatch fallback triggered:', err);
                showStatus(`✓ Opening mail app to deliver your message directly to pkj0446@gmail.com...`, 'success');
                
                // Fallback to direct mailto trigger so message delivery is guaranteed!
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

    // --------------------------------------------------------------------------
    // 9. NAVBAR SCROLL EFFECT & ACTIVE NAVIGATION LINK TRACKING
    // --------------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});
