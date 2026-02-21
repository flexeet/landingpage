// Flexeet x Cekat - JavaScript
// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initHeader();
    initArchitectureLayers();
    initLayerBoxes();
    initWorkflowSteps();
    initChatDemo();
    initFadeElements();
    initSmoothScroll();
});

// ========== Header Scroll Effect ==========
function initHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ========== Architecture Layer Animation ==========
function initArchitectureLayers() {
    const layers = document.querySelectorAll('.architecture-layer');
    
    const layerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const layerId = entry.target.id;
                const arrowId = layerId.replace('layer', 'arrow');
                const arrow = document.getElementById(arrowId);
                if (arrow) {
                    setTimeout(() => arrow.classList.add('active'), 600);
                }
            }
        });
    }, { threshold: 0.3 });

    layers.forEach(layer => layerObserver.observe(layer));
}

// ========== Layer Box Click (WITHOUT auto-scroll) ==========
function initLayerBoxes() {
    const boxes = document.querySelectorAll('.layer-box');
    
    boxes.forEach(box => {
        box.addEventListener('click', function() {
            const layer = parseInt(this.dataset.layer);
            
            // Remove active from all boxes in same layer
            boxes.forEach(b => {
                if (parseInt(b.dataset.layer) === layer) {
                    b.classList.remove('active');
                }
            });
            
            // Add active to clicked box
            this.classList.add('active');
            
            // REMOVED: Auto-scroll to next layer
            // User can manually scroll instead
        });
    });
    
    // REMOVED: Auto-cycle setInterval that causes auto-scroll
    // The boxes will only be highlighted when user clicks on them
}

// ========== Workflow Step Animation ==========
function initWorkflowSteps() {
    const steps = document.querySelectorAll('.workflow-step');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    steps.forEach(step => stepObserver.observe(step));
}

// ========== Chat Demo ==========
function initChatDemo() {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Product data
    const productData = {
        "elektra": {
            name: "Hijacket Elektra",
            colors: ["Black", "Brown", "Burgundy", "Green", "Grey", "Teracotta"],
            sizes: ["L", "XL", "XXL"],
            price: "Rp 279.000",
            promo: "Rp 223.200",
            stock: {
                "Black": 15,
                "Brown": 8,
                "Burgundy": 12,
                "Green": 5,
                "Grey": 0,
                "Teracotta": 0
            }
        },
        "belva": {
            name: "Hijacket Belva",
            colors: ["Black Ebony", "Cloudgrey", "Indigo Blue", "Ivory", "Marigold", "Seaweed"],
            sizes: ["L", "XL", "XXL"],
            price: "Rp 499.000",
            promo: "Rp 399.200",
            stock: {
                "Black Ebony": 20,
                "Cloudgrey": 10,
                "Indigo Blue": 15,
                "Ivory": 8,
                "Marigold": 12,
                "Seaweed": 6
            }
        },
        "aisya": {
            name: "Hijacket Aisya",
            colors: ["Black", "Brown", "Red", "Moss", "Marine", "Rosewood"],
            sizes: ["All Size"],
            price: "Rp 359.000",
            promo: "Rp 287.200",
            stock: {
                "Black": 531,
                "Brown": 120,
                "Red": 89,
                "Moss": 156,
                "Marine": 203,
                "Rosewood": 94
            }
        }
    };

    // Add message to chat - scroll only within chat container, not the page
    function addMessage(content, type = 'ai', tools = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message message-${type}`;
        
        let html = '';
        
        if (type === 'ai') {
            html = `
                <div class="message-ai-avatar">
                    <i data-lucide="bot" width="16" height="16" style="color: white;"></i>
                </div>
                <div>
                    <div class="message-bubble">${content}</div>
                    ${tools ? `<div class="tool-call"><i data-lucide="tool" width="12" height="12"></i> ${tools}</div>` : ''}
                </div>
            `;
        } else if (type === 'user') {
            html = `<div class="message-bubble">${content}</div>`;
        } else if (type === 'system') {
            messageDiv.className = 'message-system';
            html = content;
        }
        
        messageDiv.innerHTML = html;
        chatMessages.appendChild(messageDiv);
        
        // Scroll only the chat container, not the whole page
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        lucide.createIcons();
    }

    // Simulate typing indicator
    function simulateTyping() {
        addMessage('AI sedang berpikir...', 'system');
        setTimeout(() => {
            if (chatMessages.lastChild) {
                chatMessages.removeChild(chatMessages.lastChild);
            }
        }, 1500);
    }

    // Handle question
    function handleQuestion(question) {
        addMessage(question, 'user');
        simulateTyping();

        setTimeout(() => {
            const lowerQ = question.toLowerCase();
            
            if (lowerQ.includes('elektra') && lowerQ.includes('warna')) {
                const product = productData.elektra;
                const availableColors = Object.entries(product.stock)
                    .filter(([_, stock]) => stock > 0)
                    .map(([color]) => color);
                const soldOutColors = Object.entries(product.stock)
                    .filter(([_, stock]) => stock === 0)
                    .map(([color]) => color);
                
                let response = `Halo Kak! Elektra ready dalam 6 warna:<br><br>`;
                availableColors.forEach(color => {
                    response += `✓ <strong>${color}</strong> (ready ${product.stock[color]} pcs)<br>`;
                });
                if (soldOutColors.length > 0) {
                    response += `<br>Maaf yang sold out:<br>`;
                    soldOutColors.forEach(color => {
                        response += `• ${color} (habis)<br>`;
                    });
                }
                response += `<br>Untuk size ${product.sizes.join('/')} semuanya ready ya 😊`;
                response += `<div class="product-card-mini"><strong>${product.name}</strong><br>Harga: ${product.price} → Promo: <strong>${product.promo}</strong></div>`;
                
                addMessage(response, 'ai', 'tool_flexeetproductcortex, tool_check_stock');
                
            } else if (lowerQ.includes('belva') && (lowerQ.includes('xl') || lowerQ.includes('size'))) {
                const product = productData.belva;
                let response = `Halo Kak! Belva size XL ready lengkap dalam 6 warna:<br><br>`;
                Object.entries(product.stock).forEach(([color, stock]) => {
                    response += `• ${color}: ${stock} pcs ready<br>`;
                });
                response += `<br>Mau warna apa Kak? 😊`;
                response += `<div class="product-card-mini"><strong>${product.name}</strong><br>Harga: ${product.price} → Promo: <strong>${product.promo}</strong></div>`;
                
                addMessage(response, 'ai', 'tool_check_stock');
                
            } else if (lowerQ.includes('aisya') && lowerQ.includes('harga')) {
                const product = productData.aisya;
                let response = `Halo Kak! Aisya harga normalnya ${product.price}, tapi sekarang lagi promo jadi <strong>${product.promo}</strong> aja! 🎉<br><br>`;
                response += `Aisya ini cape syar'i best seller loh Kak, all size dan ready stock banyak.<br><br>`;
                response += `Warna available:<br>`;
                Object.entries(product.stock).forEach(([color, stock]) => {
                    response += `• ${color}: ${stock} pcs<br>`;
                });
                response += `<br>Mau order Kak? 😊`;
                
                addMessage(response, 'ai', 'tool_flexeetproductcortex, tool_check_promo');
                
            } else if (lowerQ.includes('promo')) {
                let response = `Hari ini ada promo untuk beberapa produk Kak! 🎉<br><br>`;
                response += `🔥 <strong>Elektra</strong>: ${productData.elektra.price} → ${productData.elektra.promo}<br>`;
                response += `🔥 <strong>Belva</strong>: ${productData.belva.price} → ${productData.belva.promo}<br>`;
                response += `🔥 <strong>Aisya</strong>: ${productData.aisya.price} → ${productData.aisya.promo}<br><br>`;
                response += `Mau cek produk yang mana Kak? 😊`;
                
                addMessage(response, 'ai', 'tool_check_promo');
                
            } else {
                addMessage(
                    `Maaf Kak, saya belum paham maksudnya 😅<br><br>Coba tanya seperti ini:<br>• "Ada Elektra warna apa?"<br>• "Belva size XL ready?"<br>• "Harga Aisya berapa?"<br>• "Ada promo apa hari ini?"`,
                    'ai'
                );
            }
        }, 2000);
    }

    // Event listeners
    sendBtn.addEventListener('click', () => {
        const question = chatInput.value.trim();
        if (question) {
            handleQuestion(question);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    quickQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            handleQuestion(question);
        });
    });
}

// ========== Fade In Elements ==========
function initFadeElements() {
    const fadeElements = document.querySelectorAll('.fade-in-element');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
}

// ========== Smooth Scroll for Anchor Links ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
