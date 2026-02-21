/* ============================================
   DAY 1 WORKSHOP - INTERACTIVE JAVASCRIPT
   ============================================ */

// Global State
let currentSession = 0;
const totalSessions = 7;
let mistakeCount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCalculator();
    initKeyboardNavigation();
    updateProgress();
    updateTime();
    setInterval(updateTime, 60000);
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    // Session dot clicks
    document.querySelectorAll('.session-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const session = parseInt(dot.dataset.session);
            goToSession(session);
        });
    });
}

function goToSession(sessionIndex) {
    if (sessionIndex < 0 || sessionIndex >= totalSessions) return;
    
    // Hide current session
    const currentEl = document.querySelector(`.session[data-session="${currentSession}"]`);
    if (currentEl) {
        currentEl.classList.remove('active');
    }
    
    // Mark previous sessions as completed
    document.querySelectorAll('.session-dot').forEach((dot, index) => {
        dot.classList.remove('active');
        if (index < sessionIndex) {
            dot.classList.add('completed');
        } else {
            dot.classList.remove('completed');
        }
    });
    
    // Show new session
    currentSession = sessionIndex;
    const newEl = document.querySelector(`.session[data-session="${currentSession}"]`);
    if (newEl) {
        newEl.classList.add('active');
    }
    
    // Update active dot
    const activeDot = document.querySelector(`.session-dot[data-session="${currentSession}"]`);
    if (activeDot) {
        activeDot.classList.add('active');
    }
    
    updateProgress();
    
    // Trigger animations for the new session
    triggerSessionAnimations(sessionIndex);
}

function nextSession() {
    if (currentSession < totalSessions - 1) {
        goToSession(currentSession + 1);
    }
}

function prevSession() {
    if (currentSession > 0) {
        goToSession(currentSession - 1);
    }
}

function updateProgress() {
    const progress = (currentSession / (totalSessions - 1)) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
}

function triggerSessionAnimations(sessionIndex) {
    // Reset and trigger specific animations based on session
    if (sessionIndex === 1) {
        // Story timeline animations
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = '';
            }, 10);
        });
    }
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextSession();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevSession();
                break;
            case 'Home':
                e.preventDefault();
                goToSession(0);
                break;
            case 'End':
                e.preventDefault();
                goToSession(totalSessions - 1);
                break;
        }
    });
}

/* ============================================
   CALCULATOR (Session 2)
   ============================================ */
function initCalculator() {
    // Part 1: Owner Time
    const calc1Hours = document.getElementById('calc1_hours');
    const calc1Rate = document.getElementById('calc1_rate');
    
    // Part 2: Onboarding
    const calc2Hires = document.getElementById('calc2_hires');
    const calc2Months = document.getElementById('calc2_months');
    const calc2Salary = document.getElementById('calc2_salary');
    
    // Part 3: Turnover
    const calc3Resign = document.getElementById('calc3_resign');
    const calc3Recovery = document.getElementById('calc3_recovery');
    const calc3Loss = document.getElementById('calc3_loss');
    
    if (!calc1Hours) return;
    
    // Add event listeners
    [calc1Hours, calc2Hires, calc2Months, calc3Resign, calc3Recovery].forEach(slider => {
        if (slider) {
            slider.addEventListener('input', () => {
                updateSliderDisplay(slider);
                calculateAll();
            });
        }
    });
    
    [calc1Rate, calc2Salary, calc3Loss].forEach(input => {
        if (input) {
            input.addEventListener('input', calculateAll);
            input.addEventListener('blur', () => formatCurrencyInput(input));
            input.addEventListener('focus', () => {
                const value = parseCurrency(input.value);
                input.value = value || '';
            });
        }
    });
    
    // Initial calculation
    calculateAll();
}

function updateSliderDisplay(slider) {
    const displayId = slider.id + '_val';
    const display = document.getElementById(displayId);
    if (display) {
        display.textContent = slider.value;
    }
}

function parseCurrency(str) {
    return parseInt(String(str).replace(/\D/g, '')) || 0;
}

function formatCurrency(num) {
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
}

function formatCurrencyInput(input) {
    const value = parseCurrency(input.value);
    input.value = formatCurrency(value);
}

function calculateAll() {
    // Parse all values
    const hours = parseInt(document.getElementById('calc1_hours')?.value) || 0;
    const rate = parseCurrency(document.getElementById('calc1_rate')?.value);
    
    const hires = parseInt(document.getElementById('calc2_hires')?.value) || 0;
    const onboardMonths = parseInt(document.getElementById('calc2_months')?.value) || 0;
    const salary = parseCurrency(document.getElementById('calc2_salary')?.value);
    
    const resignations = parseInt(document.getElementById('calc3_resign')?.value) || 0;
    const recoveryMonths = parseInt(document.getElementById('calc3_recovery')?.value) || 0;
    const revenueLoss = parseCurrency(document.getElementById('calc3_loss')?.value);
    
    // Calculate each part
    const part1 = hours * rate * 4 * 12; // weekly * 4 weeks * 12 months
    const part2 = hires * onboardMonths * salary;
    const part3 = resignations * recoveryMonths * revenueLoss;
    const total = part1 + part2 + part3;
    
    // Update displays
    updateResult('calc1_result', part1);
    updateResult('calc2_result', part2);
    updateResult('calc3_result', part3);
    
    // Update total
    const totalEl = document.getElementById('calcTotal');
    if (totalEl) {
        let displayValue;
        if (total >= 1000000000) {
            displayValue = (total / 1000000000).toFixed(1) + 'M';
        } else if (total >= 1000000) {
            displayValue = formatCurrency(total / 1000000) + 'jt';
        } else {
            displayValue = formatCurrency(total);
        }
        
        totalEl.textContent = displayValue;
        totalEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalEl.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Calculate ROI
    const aiManagerCostPerYear = 10000000 * 12;
    const roi = Math.round(total / aiManagerCostPerYear);
    const roiEl = document.getElementById('calcROI');
    if (roiEl) {
        roiEl.textContent = roi;
    }
}

function updateResult(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = 'Rp ' + formatCurrency(value);
    }
}

/* ============================================
   MISTAKES QUIZ (Session 3)
   ============================================ */
function toggleMistake(button) {
    const card = button.closest('.mistake-card');
    const wasChecked = card.classList.contains('checked');
    
    card.classList.toggle('checked');
    
    if (wasChecked) {
        mistakeCount--;
    } else {
        mistakeCount++;
    }
    
    updateMistakeScore();
}

function updateMistakeScore() {
    const scoreEl = document.getElementById('mistakeScore');
    const messageEl = document.getElementById('mistakeMessage');
    
    if (scoreEl) {
        scoreEl.textContent = mistakeCount;
        scoreEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scoreEl.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (messageEl) {
        const messages = [
            "Klik kesalahan yang lo lakuin",
            "1 kesalahan — Lumayan, tapi masih ada ruang improve",
            "2 kesalahan — Hmm, AI lo belum optimal nih",
            "3 kesalahan — Banyak yang bisa diperbaiki!",
            "4 kesalahan — Pantesan AI lo belum ngefek",
            "5 kesalahan — Lo butuh bantuan serius. Untung ada workshop ini! 😅"
        ];
        messageEl.textContent = messages[mistakeCount] || messages[0];
    }
}

/* ============================================
   PLAUD SIMULATION (Session 4)
   ============================================ */
let simulationRunning = false;
let simulationStep = 0;

function startRecordingSimulation() {
    const button = document.getElementById('startSimulation');
    
    if (simulationRunning) {
        resetSimulation();
        return;
    }
    
    simulationRunning = true;
    button.innerHTML = '<span class="sim-icon">⏹</span><span>Stop Demo</span>';
    button.classList.add('running');
    
    // Reset all
    document.querySelectorAll('.demo-step').forEach(s => s.classList.remove('active'));
    document.getElementById('simRecording').classList.remove('active');
    document.getElementById('simTranscript').classList.remove('active');
    document.getElementById('simInsight').classList.remove('active');
    
    // Step 1: Recording
    simulationStep = 1;
    document.querySelector('.demo-step[data-step="1"]').classList.add('active');
    document.getElementById('simRecording').classList.add('active');
    
    // Step 2: Transcript (after 3 seconds)
    setTimeout(() => {
        if (!simulationRunning) return;
        simulationStep = 2;
        document.querySelector('.demo-step[data-step="1"]').classList.remove('active');
        document.querySelector('.demo-step[data-step="2"]').classList.add('active');
        document.getElementById('simRecording').classList.remove('active');
        document.getElementById('simTranscript').classList.add('active');
        
        // Typewriter effect for transcript
        typewriterEffect();
    }, 3000);
    
    // Step 3: Extract (after 6 seconds)
    setTimeout(() => {
        if (!simulationRunning) return;
        simulationStep = 3;
        document.querySelector('.demo-step[data-step="2"]').classList.remove('active');
        document.querySelector('.demo-step[data-step="3"]').classList.add('active');
    }, 6000);
    
    // Step 4: Knowledge (after 8 seconds)
    setTimeout(() => {
        if (!simulationRunning) return;
        simulationStep = 4;
        document.querySelector('.demo-step[data-step="3"]').classList.remove('active');
        document.querySelector('.demo-step[data-step="4"]').classList.add('active');
        document.getElementById('simTranscript').classList.remove('active');
        document.getElementById('simInsight').classList.add('active');
    }, 8000);
    
    // Auto reset after completion
    setTimeout(() => {
        if (simulationRunning) {
            setTimeout(() => {
                resetSimulation();
            }, 5000);
        }
    }, 8000);
}

function resetSimulation() {
    simulationRunning = false;
    simulationStep = 0;
    
    const button = document.getElementById('startSimulation');
    button.innerHTML = '<span class="sim-icon">▶</span><span>Mulai Demo</span>';
    button.classList.remove('running');
    
    document.querySelectorAll('.demo-step').forEach(s => s.classList.remove('active'));
    document.querySelector('.demo-step[data-step="1"]').classList.add('active');
    
    document.getElementById('simRecording').classList.remove('active');
    document.getElementById('simTranscript').classList.remove('active');
    document.getElementById('simInsight').classList.remove('active');
    
    // Clear transcript
    document.querySelector('.transcript-text').textContent = '';
}

function typewriterEffect() {
    const text = `[00:00] Aji: "Untuk handle komplain refund di atas 7 hari, pertama cek history customer dulu ya."

[00:08] Aji: "Kalau dia VIP, customer yang udah repeat order lebih dari 5x, langsung tawarkan store credit 110%."

[00:18] Aji: "Tapi kalau bukan VIP, jelaskan policy kita dengan empati. Jangan defensive. Dengarkan dulu keluhannya."

[00:28] Aji: "Kalau tetap minta full refund dan case-nya valid, eskalasi ke CS Lead untuk approval."`;
    
    const transcriptEl = document.querySelector('.transcript-text');
    transcriptEl.textContent = '';
    
    let i = 0;
    const speed = 15;
    
    function type() {
        if (!simulationRunning) return;
        if (i < text.length) {
            transcriptEl.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ============================================
   AI ADVISOR CHAT (Session 5)
   ============================================ */
const advisorPersonalities = {
    marketing: {
        icon: '📈',
        name: 'Marketing Expert',
        greeting: 'Hai! Gue AI Marketing Expert. Tanya apa aja soal marketing, ads, atau growth strategy. Gue siap bantu. 🚀',
        responses: {
            'scale fb ads': `Great question! Untuk scale FB Ads dengan budget terbatas, ini strategynya:

1. **Start with Winning Creatives** — Jangan scale sebelum tau creative mana yang convert. Test minimal 3-5 creative dulu.

2. **Vertical Scaling** — Naikin budget 20-30% setiap 3-4 hari di adset yang udah profitable. Jangan langsung 2x lipat.

3. **Horizontal Scaling** — Duplicate winning adset ke audience baru. Lookalike 1%, 2%, 3% dari customer database lo.

4. **CBO vs ABO** — Mulai dengan ABO untuk testing, pindah ke CBO kalau udah tau winning combo.

5. **Retargeting** — Allocate 20-30% budget untuk retarget warm audience. ROAS biasanya lebih tinggi.

Mau gue breakdown lebih detail yang mana?`,
            'content b2b': `Content marketing B2B itu game yang berbeda! Here's the strategy:

1. **Thought Leadership** — CEO/Founder harus visible. LinkedIn posts, podcast guest, speaking engagement. Trust comes from people, not brands.

2. **Case Studies** — B2B buyers butuh PROOF. Dokumentasikan every win dengan metrics yang clear.

3. **Educational Content** — Blog, webinar, whitepaper. Solve their problems BEFORE they buy. Position as expert.

4. **Email Nurturing** — B2B sales cycle panjang. Build email sequence 6-12 touchpoints.

5. **LinkedIn Organic** — Post 3-5x seminggu. Mix: 60% value, 30% story, 10% soft CTA.

Yang paling quick win untuk lo sekarang: mulai dari LinkedIn personal dulu.`,
            'conversion rate': `Conversion rate optimization — ini favoritku! 🎯

Quick wins yang bisa lo implement sekarang:

1. **Speed** — Load time < 3 detik. Setiap 1 detik delay = -7% conversion.

2. **Social Proof** — Testimoni, review, logo client. Taruh di atas fold.

3. **Clear CTA** — Satu halaman, satu goal. Jangan confuse visitor dengan banyak CTA.

4. **Mobile First** — 70%+ traffic dari mobile. Test di HP lo sendiri.

5. **Reduce Friction** — Kurangin form fields. Nama + WA cukup untuk lead gen.

6. **Urgency** — Scarcity atau deadline. Tapi yang real, jangan fake.

7. **Exit Intent** — Popup saat mau close. Offer something valuable.

Baseline conversion rate lo sekarang berapa?`,
            'default': `Good question! Let me think about this...

Berdasarkan pengalaman dan data yang gue punya, ini perspektif gue:

Setiap bisnis itu unik, jadi strateginya perlu di-customize. Yang penting adalah:
- Test, measure, iterate
- Focus on fundamentals dulu
- Jangan chase every trend

Bisa kasih tau lebih detail tentang situasi bisnis lo? Biar gue bisa kasih advice yang lebih specific.`
        }
    },
    sales: {
        icon: '💰',
        name: 'Sales Master',
        greeting: 'Yo! Gue Sales Master AI. Mau closing lebih banyak? Handling objection? Let\'s talk! 💪',
        responses: {
            'default': `Ini insight dari pengalaman closing ribuan deals:

**The Golden Rule:** People buy from people they trust. Build relationship first.

**Framework SPIN:**
- Situation: Understand their current state
- Problem: Dig into pain points
- Implication: Show the cost of NOT solving
- Need-Payoff: Present your solution

**Handling Objections:**
- "Mahal" → "Compared to what? Apa cost of doing nothing?"
- "Pikir dulu" → "Boleh tau apa yang perlu dipikirin? Maybe I can help clarify."
- "Nanti aja" → "I understand. Apa yang bikin sekarang bukan waktu yang tepat?"

Lo lagi struggle di bagian mana? Prospecting? Presentation? Closing?`
        }
    },
    operations: {
        icon: '⚙️',
        name: 'Operations Pro',
        greeting: 'Halo! Gue Operations Pro AI. SOP, efficiency, process improvement — that\'s my jam! 🔧',
        responses: {
            'default': `Operations excellence = competitive advantage yang sustainable.

**Key Principles:**
1. Document everything — If it's not written, it doesn't exist
2. Automate repetitive tasks — Free humans for creative work
3. Measure what matters — KPIs that drive behavior
4. Continuous improvement — Kaizen mindset

**Quick Wins:**
- Create SOP for top 5 recurring tasks
- Implement checklist for critical processes  
- Set up weekly ops review meeting
- Build feedback loop dari frontline team

Apa biggest operational challenge lo sekarang?`
        }
    },
    finance: {
        icon: '📊',
        name: 'Finance Advisor',
        greeting: 'Hello! Gue Finance Advisor AI. Cash flow, budgeting, financial planning — let\'s optimize! 📈',
        responses: {
            'default': `Financial health = business survival.

**Key Metrics to Track:**
- Gross Margin: >50% for services, >30% for products
- Net Profit Margin: >15% is healthy
- Cash Runway: Always have 3-6 months expenses
- CAC:LTV Ratio: Should be 1:3 minimum

**Cash Flow Tips:**
- Invoice immediately after delivery
- Negotiate payment terms with suppliers
- Build recurring revenue streams
- Maintain emergency fund

**Tax Planning:**
- Structure matters — PT vs CV vs Perorangan
- Maximize deductible expenses
- Plan quarterly, not yearly

What specific financial challenge are you facing?`
        }
    },
    leadership: {
        icon: '🚀',
        name: 'Leadership Coach',
        greeting: 'Hey there! Gue Leadership Coach AI. Team building, delegation, scaling — I\'m here to help you grow! 🌟',
        responses: {
            'default': `Leadership is about multiplying yourself through others.

**Core Principles:**
1. **Vision** — People follow direction, not just orders
2. **Trust** — Build it daily, lose it instantly  
3. **Delegation** — Give ownership, not just tasks
4. **Feedback** — Frequent, specific, actionable

**Scaling Your Leadership:**
- Document your decision-making process
- Create systems that work without you
- Develop next layer of leaders
- Schedule strategic thinking time

**Common Traps:**
- Micromanaging (kills initiative)
- Being "too nice" (avoiding hard conversations)
- Hero complex (doing everything yourself)

What leadership challenge are you working through?`
        }
    }
};

let currentAdvisor = 'marketing';

function selectAdvisor(advisorId) {
    currentAdvisor = advisorId;
    const advisor = advisorPersonalities[advisorId];
    
    // Update buttons
    document.querySelectorAll('.advisor-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.advisor-btn[data-advisor="${advisorId}"]`).classList.add('active');
    
    // Update header
    document.getElementById('chatAdvisorIcon').textContent = advisor.icon;
    document.getElementById('chatAdvisorName').textContent = advisor.name;
    
    // Clear and add greeting
    const messagesEl = document.getElementById('chatMessages');
    messagesEl.innerHTML = `
        <div class="chat-message ai">
            <div class="message-avatar">${advisor.icon}</div>
            <div class="message-bubble">
                <p>${advisor.greeting}</p>
            </div>
        </div>
    `;
    
    // Update quick questions based on advisor
    updateQuickQuestions(advisorId);
}

function updateQuickQuestions(advisorId) {
    const questions = {
        marketing: [
            { text: 'Scale FB Ads?', query: 'Gimana cara scale FB Ads dengan budget terbatas?' },
            { text: 'Content B2B?', query: 'Strategi content marketing untuk B2B?' },
            { text: 'Conversion rate?', query: 'Tips meningkatkan conversion rate?' }
        ],
        sales: [
            { text: 'Handle objection?', query: 'Cara handle objection "mahal" dari prospect?' },
            { text: 'Closing tips?', query: 'Tips closing high ticket?' },
            { text: 'Follow up?', query: 'Strategi follow up yang efektif?' }
        ],
        operations: [
            { text: 'Buat SOP?', query: 'Gimana cara bikin SOP yang efektif?' },
            { text: 'Reduce error?', query: 'Cara mengurangi human error di operasional?' },
            { text: 'Scale ops?', query: 'Gimana scale operasional tanpa nambah banyak orang?' }
        ],
        finance: [
            { text: 'Cash flow?', query: 'Tips improve cash flow?' },
            { text: 'Tax planning?', query: 'Strategi tax planning untuk UMKM?' },
            { text: 'Pricing?', query: 'Gimana determine pricing yang optimal?' }
        ],
        leadership: [
            { text: 'Delegation?', query: 'Cara delegasi yang efektif?' },
            { text: 'Build team?', query: 'Tips membangun team yang solid?' },
            { text: 'Manage remote?', query: 'Cara manage remote team?' }
        ]
    };
    
    const quickContainer = document.querySelector('.quick-questions');
    quickContainer.innerHTML = questions[advisorId].map(q => 
        `<button class="quick-btn" onclick="askQuestion('${q.query}')">${q.text}</button>`
    ).join('');
}

function askQuestion(question) {
    addUserMessage(question);
    
    // Simulate typing delay
    setTimeout(() => {
        const response = generateResponse(question);
        addAIMessage(response);
    }, 1000 + Math.random() * 1000);
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    // Simulate typing delay
    setTimeout(() => {
        const response = generateResponse(message);
        addAIMessage(response);
    }, 1000 + Math.random() * 1000);
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function addUserMessage(text) {
    const messagesEl = document.getElementById('chatMessages');
    const messageHTML = `
        <div class="chat-message user">
            <div class="message-bubble">
                <p>${escapeHtml(text)}</p>
            </div>
        </div>
    `;
    messagesEl.insertAdjacentHTML('beforeend', messageHTML);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addAIMessage(text) {
    const advisor = advisorPersonalities[currentAdvisor];
    const messagesEl = document.getElementById('chatMessages');
    const messageHTML = `
        <div class="chat-message ai">
            <div class="message-avatar">${advisor.icon}</div>
            <div class="message-bubble">
                <p>${text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
            </div>
        </div>
    `;
    messagesEl.insertAdjacentHTML('beforeend', messageHTML);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function generateResponse(question) {
    const advisor = advisorPersonalities[currentAdvisor];
    const lowerQ = question.toLowerCase();
    
    // Check for keyword matches
    for (const [key, response] of Object.entries(advisor.responses)) {
        if (key !== 'default' && lowerQ.includes(key)) {
            return response;
        }
    }
    
    // Return default response
    return advisor.responses.default;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Console Easter Egg
console.log('%c🚀 DAY 1: BONGKAR', 'font-size: 24px; font-weight: bold; color: #f97316;');
console.log('%cThe AI CEO Workshop', 'font-size: 14px; color: #a1a1aa;');
console.log('%cUse arrow keys to navigate between sessions', 'font-size: 12px; color: #71717a;');