/* ============================================
   DAY 2 WORKSHOP: REBUILD - JAVASCRIPT
   ============================================ */

// Global State
let currentSession = 0;
const totalSessions = 7;

// Layer content data
const layerDetails = {
    1: {
        icon: '🎙️',
        title: 'CAPTURE',
        content: `
            <h4>Principle: Record everything, lose nothing</h4>
            <p>Setiap percakapan berharga HARUS di-record. Kalau gak di-record, ilang selamanya.</p>
            <h4 style="margin-top: 20px;">Tools:</h4>
            <ul>
                <li>Plaud Note AI — ~Rp 3jt hardware + Rp 4jt/tahun unlimited</li>
                <li>Otter.ai — Alternative untuk meeting virtual</li>
                <li>Voice notes HP — Minimum viable, tapi ribet</li>
            </ul>
            <h4 style="margin-top: 20px;">Use Cases:</h4>
            <ul>
                <li>Meeting internal dengan tim</li>
                <li>Coaching session dengan manager</li>
                <li>Workshop/seminar yang lo hadiri</li>
                <li>Ngobrol dengan partner/supplier</li>
                <li>Voice notes owner waktu lagi mikir</li>
            </ul>
        `
    },
    2: {
        icon: '⚡',
        title: 'EXTRACT',
        content: `
            <h4>Principle: Convert recording into knowledge</h4>
            <p>Recording 1 jam ≠ Knowledge. Perlu di-extract jadi insight yang actionable.</p>
            <h4 style="margin-top: 20px;">Flow:</h4>
            <ul>
                <li>Recording (1 jam ngobrol)</li>
                <li>→ Transcript (text mentah)</li>
                <li>→ AI Processing (dengan prompt yang tepat)</li>
                <li>→ Extracted Knowledge (key decisions, action items, insights)</li>
            </ul>
            <h4 style="margin-top: 20px;">What to Extract:</h4>
            <ul>
                <li>Key decisions yang dibuat</li>
                <li>Action items & deadlines</li>
                <li>Insights & learnings</li>
                <li>New SOPs atau updates</li>
                <li>Problems & solutions discussed</li>
            </ul>
            <h4 style="margin-top: 20px;">Critical Note:</h4>
            <p>Prompting yang tepat = KUNCI. Generic prompt → generic result. Context-aware prompt → actionable knowledge.</p>
        `
    },
    3: {
        icon: '🗂️',
        title: 'STRUCTURE',
        content: `
            <h4>Principle: Organize for retrievability</h4>
            <p>Knowledge yang gak bisa ditemukan = knowledge yang gak ada.</p>
            <h4 style="margin-top: 20px;">Elements per Knowledge Piece:</h4>
            <ul>
                <li><strong>Metadata:</strong> Topic, division, date, speaker</li>
                <li><strong>Classification:</strong> SOP, Decision, Lesson Learned, Product Knowledge</li>
                <li><strong>Relationships:</strong> Related topics, supersedes version mana, conflicts dengan apa</li>
                <li><strong>Tags:</strong> Keywords untuk searchability</li>
            </ul>
            <h4 style="margin-top: 20px;">Good vs Bad Structure:</h4>
            <ul>
                <li>✓ "SOP Handling Refund — Update 5 Jan 2025 — supersedes Oct 2024 version — applies to CS team"</li>
                <li>✗ "Meeting notes 5 Jan" (no context, not retrievable)</li>
            </ul>
        `
    },
    4: {
        icon: '🤖',
        title: 'ACTIVATE',
        content: `
            <h4>Principle: Make accessible via AI 24/7</h4>
            <p>Knowledge yang cuma bisa diakses lewat lo = bottleneck. AI jadi interface yang scalable.</p>
            <h4 style="margin-top: 20px;">Technical Flow:</h4>
            <ul>
                <li>Structured Knowledge → Vector Database (Pinecone)</li>
                <li>→ AI Interface (Telegram Bot)</li>
                <li>→ Tim tanya pertanyaan</li>
                <li>→ AI jawab + kasih 3 follow-up questions</li>
            </ul>
            <h4 style="margin-top: 20px;">Why 3 Follow-up Questions?</h4>
            <ul>
                <li>Forces critical thinking — tim gak cuma terima jawaban</li>
                <li>Prevents dependency — encourage deeper understanding</li>
                <li>Reveals gaps — kalau banyak follow-up, mungkin knowledge belum lengkap</li>
            </ul>
            <h4 style="margin-top: 20px;">Who Can Use:</h4>
            <ul>
                <li>Owner — Strategic sparring partner</li>
                <li>Manager — Decision validation</li>
                <li>Staff — Ask SOPs, product knowledge</li>
                <li>External — Affiliators, partners (with limited access)</li>
            </ul>
        `
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initKeyboardNavigation();
    updateProgress();
    updateTime();
    setInterval(updateTime, 60000);
    
    // Open first category by default
    setTimeout(() => {
        const firstCategory = document.querySelector('.advisor-category');
        if (firstCategory) {
            firstCategory.classList.add('open');
        }
    }, 100);
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    document.querySelectorAll('.session-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const session = parseInt(dot.dataset.session);
            goToSession(session);
        });
    });
}

function goToSession(sessionIndex) {
    if (sessionIndex < 0 || sessionIndex >= totalSessions) return;
    
    const currentEl = document.querySelector(`.session[data-session="${currentSession}"]`);
    if (currentEl) {
        currentEl.classList.remove('active');
    }
    
    document.querySelectorAll('.session-dot').forEach((dot, index) => {
        dot.classList.remove('active');
        if (index < sessionIndex) {
            dot.classList.add('completed');
        } else {
            dot.classList.remove('completed');
        }
    });
    
    currentSession = sessionIndex;
    const newEl = document.querySelector(`.session[data-session="${currentSession}"]`);
    if (newEl) {
        newEl.classList.add('active');
    }
    
    const activeDot = document.querySelector(`.session-dot[data-session="${currentSession}"]`);
    if (activeDot) {
        activeDot.classList.add('active');
    }
    
    updateProgress();
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

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        
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
            case 'Escape':
                closeLayerDetail();
                closeRegistration();
                break;
        }
    });
}

/* ============================================
   FRAMEWORK LAYERS (Session 2)
   ============================================ */
function showLayerDetail(layerNum) {
    const detail = document.getElementById('layerDetail');
    const data = layerDetails[layerNum];
    
    if (!data) return;
    
    // Update active state on cards
    document.querySelectorAll('.layer-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`.layer-card[data-layer="${layerNum}"]`).classList.add('active');
    
    // Update detail content
    document.getElementById('detailIcon').textContent = data.icon;
    document.getElementById('detailTitle').textContent = data.title;
    document.getElementById('detailContent').innerHTML = data.content;
    
    // Show detail
    detail.classList.add('show');
    
    // Scroll to detail
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeLayerDetail() {
    const detail = document.getElementById('layerDetail');
    detail.classList.remove('show');
    
    document.querySelectorAll('.layer-card').forEach(card => {
        card.classList.remove('active');
    });
}

/* ============================================
   EXTRACTION SIMULATOR (Session 3)
   ============================================ */
function toggleConversation() {
    const content = document.getElementById('convContent');
    content.classList.toggle('hidden');
}

function validateExtraction() {
    const topic = document.getElementById('extractTopic').value.trim();
    const category = document.getElementById('extractCategory').value;
    const points = document.getElementById('extractPoints').value.trim();
    const tags = document.getElementById('extractTags').value.trim();
    
    const resultEl = document.getElementById('extractionResult');
    
    // Calculate score
    let score = 0;
    let feedback = [];
    
    // Check topic
    if (topic.length > 10) {
        score += 25;
        feedback.push('✓ Topic jelas dan descriptive');
    } else {
        feedback.push('✗ Topic kurang descriptive — harus jelas konteksnya');
    }
    
    // Check category
    if (category) {
        score += 25;
        feedback.push('✓ Category sudah dipilih');
    } else {
        feedback.push('✗ Category belum dipilih — penting untuk organization');
    }
    
    // Check key points
    const pointLines = points.split('\n').filter(line => line.trim().length > 0);
    if (pointLines.length >= 3) {
        score += 25;
        feedback.push(`✓ ${pointLines.length} key points extracted — good detail`);
    } else if (pointLines.length > 0) {
        score += 10;
        feedback.push(`△ ${pointLines.length} key points — coba extract lebih detail`);
    } else {
        feedback.push('✗ Key points kosong — ini yang paling penting!');
    }
    
    // Check tags
    const tagCount = (tags.match(/#/g) || []).length;
    if (tagCount >= 3) {
        score += 25;
        feedback.push(`✓ ${tagCount} tags — good for searchability`);
    } else if (tagCount > 0) {
        score += 10;
        feedback.push(`△ ${tagCount} tags — tambah lebih banyak untuk searchability`);
    } else {
        feedback.push('✗ No tags — penting untuk retrieval nanti');
    }
    
    // Generate result HTML
    let scoreClass = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error';
    let scoreMessage = score >= 75 ? 'Excellent! 🎉' : score >= 50 ? 'Good progress! 👍' : 'Needs improvement 💪';
    
    resultEl.innerHTML = `
        <h4>Validation Result: ${score}/100 — ${scoreMessage}</h4>
        <div style="margin-top: 16px;">
            ${feedback.map(f => `<p style="margin-bottom: 8px;">${f}</p>`).join('')}
        </div>
        ${score < 75 ? `<p style="margin-top: 16px; color: var(--accent);"><strong>Tips:</strong> Coba review conversation lagi dan extract lebih detail. Setiap keputusan, setiap kondisi, setiap exception — harus di-capture.</p>` : ''}
    `;
    
    resultEl.classList.add('show');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ============================================
   ADVISORS CATEGORIES (Session 4)
   ============================================ */
function toggleCategory(categoryId) {
    const category = document.querySelector(`.advisor-category[data-category="${categoryId}"]`);
    
    if (category.classList.contains('open')) {
        category.classList.remove('open');
    } else {
        // Close others
        document.querySelectorAll('.advisor-category').forEach(cat => {
            cat.classList.remove('open');
        });
        category.classList.add('open');
    }
}

/* ============================================
   FAQ ACCORDION (Session 6)
   ============================================ */
function toggleFaq(element) {
    const isOpen = element.classList.contains('open');
    
    // Close all
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
    });
    
    // Open clicked one if it wasn't open
    if (!isOpen) {
        element.classList.add('open');
    }
}

/* ============================================
   REGISTRATION MODAL
   ============================================ */
function showRegistration() {
    document.getElementById('registrationModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeRegistration() {
    document.getElementById('registrationModal').classList.remove('show');
    document.body.style.overflow = '';
}

function submitRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const button = form.querySelector('.btn-submit');
    const originalText = button.innerHTML;
    
    // Show loading
    button.innerHTML = '<span>Submitting...</span>';
    button.disabled = true;
    
    // Simulate submission
    setTimeout(() => {
        button.innerHTML = '<span>✓ Submitted! Tim akan hubungi via WA</span>';
        button.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        
        setTimeout(() => {
            closeRegistration();
            form.reset();
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
    }, 1500);
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeRegistration();
    }
});

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

// Console Easter Egg
console.log('%c🚀 DAY 2: REBUILD', 'font-size: 24px; font-weight: bold; color: #10b981;');
console.log('%cThe AI CEO Workshop', 'font-size: 14px; color: #a1a1aa;');
console.log('%cToday is ACTION day! Let\'s go! 💪', 'font-size: 12px; color: #71717a;');