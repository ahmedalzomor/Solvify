// Main JavaScript for Solvify Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initModalSystem();
    initFileUpload();
    initAIChat();
    initServiceCategories();
    initContactForm();
});

// Navigation functionality
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Modal System
function initModalSystem() {
    const modal = document.getElementById('problemModal');
    const closeBtn = document.getElementById('closeModal');
    const submitBtn = document.getElementById('submitProblem');
    
    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Submit problem functionality
    if (submitBtn) {
        submitBtn.addEventListener('click', submitProblem);
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal() {
    const modal = document.getElementById('problemModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('problemModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Service Categories
function initServiceCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            openModal();
            selectCategory(category);
        });
    });
}

function selectCategory(category) {
    // Remove active class from all type buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate the most relevant type button based on category
    const typeMapping = {
        'student': 'text',
        'tech': 'image', 
        'home': 'text'
    };
    
    const preferredType = typeMapping[category] || 'text';
    const typeBtn = document.querySelector(`[data-type="${preferredType}"]`);
    if (typeBtn) {
        typeBtn.classList.add('active');
    }
}

// File Upload System
function initFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!fileUploadArea || !fileInput) return;
    
    // Click to upload
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop functionality
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleDrop);
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Type button functionality
    const typeButtons = document.querySelectorAll('.type-btn');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            typeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateFileUploadHint(this.dataset.type);
        });
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    // Show file preview
    showFilePreview(files[0]);
    
    // Update upload area text
    const uploadText = fileUploadArea.querySelector('p');
    const uploadHint = fileUploadArea.querySelector('.upload-hint');
    
    if (files.length > 0) {
        uploadText.textContent = `تم اختيار: ${files[0].name}`;
        uploadHint.textContent = 'يمكنك اختيار ملف آخر بالنقر هنا';
    }
}

function showFilePreview(file) {
    if (!file) return;
    
    // Remove existing preview
    const existingPreview = document.querySelector('.file-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    // Create new preview
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    
    const icon = getFileIcon(file.type);
    const size = formatFileSize(file.size);
    
    preview.innerHTML = `
        <div class="file-preview-icon">${icon}</div>
        <div class="file-preview-info">
            <div class="file-preview-name">${file.name}</div>
            <div class="file-preview-size">${size}</div>
        </div>
        <button class="remove-file" onclick="removeFilePreview()">×</button>
    `;
    
    const fileUploadArea = document.getElementById('fileUploadArea');
    fileUploadArea.appendChild(preview);
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📁';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFilePreview() {
    const preview = document.querySelector('.file-preview');
    if (preview) {
        preview.remove();
    }
    
    // Reset upload area text
    const fileUploadArea = document.getElementById('fileUploadArea');
    const uploadText = fileUploadArea.querySelector('p');
    const uploadHint = fileUploadArea.querySelector('.upload-hint');
    
    uploadText.textContent = 'اسحب الملفات هنا أو اضغط للرفع';
    uploadHint.textContent = 'يدعم: الصور، الفيديوهات، الصوتيات، المستندات';
    
    // Clear file input
    document.getElementById('fileInput').value = '';
}

function updateFileUploadHint(type) {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const uploadText = fileUploadArea.querySelector('p');
    const uploadHint = fileUploadArea.querySelector('.upload-hint');
    
    const hints = {
        'text': 'يدعم: المستندات النصية (.txt, .doc, .pdf)',
        'image': 'يدعم: الصور (.jpg, .png, .gif)',
        'video': 'يدعم: الفيديوهات (.mp4, .avi, .mov)',
        'audio': 'يدعم: الصوتيات (.mp3, .wav, .ogg)'
    };
    
    uploadHint.textContent = hints[type] || 'يدعم: جميع أنواع الملفات';
}

// Problem Submission
function submitProblem() {
    const submitBtn = document.getElementById('submitProblem');
    const description = document.getElementById('problemDescription').value.trim();
    
    if (!description) {
        showMessage('يرجى إدخال وصف للمشكلة', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> جاري الإرسال...';
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'إرسال المشكلة';
        
        // Show success message
        showMessage('تم إرسال مشكلتك بنجاح! سيتم التواصل معك قريباً', 'success');
        
        // Close modal and reset form
        setTimeout(() => {
            closeModal();
            resetProblemForm();
            showPriceOffer();
        }, 2000);
        
    }, 2000);
}

function resetProblemForm() {
    document.getElementById('problemDescription').value = '';
    removeFilePreview();
    
    // Reset type buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.type-btn[data-type="text"]').classList.add('active');
}

function showPriceOffer() {
    // This would normally be called from a real API
    // For demo purposes, we'll show a mock price offer
    const modal = document.createElement('div');
    modal.className = 'modal price-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>عرض السعر</h2>
                <button class="close-btn" onclick="closePriceModal()">&times;</button>
            </div>
            <div class="price-offer">
                <p>تم تقييم مشكلتك من قبل خبرائنا</p>
                <div class="offer-details">
                    <h3>الخدمة المطلوبة</h3>
                    <p class="offer-description">حل مشكلة تقنية في التطبيق</p>
                    <div class="offer-price">50 ريال</div>
                    <p>تشمل: تحليل المشكلة + الحل + المتابعة لمدة 24 ساعة</p>
                </div>
                <div class="offer-actions">
                    <button class="btn-secondary" onclick="rejectOffer()">رفض</button>
                    <button class="submit-btn" onclick="acceptOffer()">قبول والدفع</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closePriceModal() {
    const modal = document.querySelector('.price-modal');
    if (modal) {
        modal.remove();
    }
}

function rejectOffer() {
    closePriceModal();
    showMessage('تم رفض العرض. يمكنك إرسال مشكلة جديدة في أي وقت.', 'info');
}

function acceptOffer() {
    closePriceModal();
    showPaymentProcess();
}

function showPaymentProcess() {
    const modal = document.createElement('div');
    modal.className = 'modal payment-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>إتمام الدفع</h2>
                <button class="close-btn" onclick="closePaymentModal()">&times;</button>
            </div>
            <div class="payment-processing">
                <h3>اختر طريقة الدفع</h3>
                <div class="payment-options">
                    <div class="payment-option" onclick="selectPayment(this, 'visa')">
                        <div class="payment-option-icon">💳</div>
                        <div class="payment-option-name">فيزا</div>
                    </div>
                    <div class="payment-option" onclick="selectPayment(this, 'mastercard')">
                        <div class="payment-option-icon">💳</div>
                        <div class="payment-option-name">ماستركارد</div>
                    </div>
                    <div class="payment-option" onclick="selectPayment(this, 'paypal')">
                        <div class="payment-option-icon">🅿️</div>
                        <div class="payment-option-name">PayPal</div>
                    </div>
                    <div class="payment-option" onclick="selectPayment(this, 'apple')">
                        <div class="payment-option-icon">📱</div>
                        <div class="payment-option-name">Apple Pay</div>
                    </div>
                </div>
                <button class="submit-btn" onclick="processPayment()" style="margin-top: 24px;">
                    دفع 50 ريال
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function selectPayment(element, method) {
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
}

function processPayment() {
    const submitBtn = event.target;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> جاري المعالجة...';
    
    setTimeout(() => {
        closePaymentModal();
        showMessage('تم الدفع بنجاح! سيتم التواصل معك خلال دقائق', 'success');
        showLiveChatInvitation();
    }, 3000);
}

function closePaymentModal() {
    const modal = document.querySelector('.payment-modal');
    if (modal) {
        modal.remove();
    }
}

function showLiveChatInvitation() {
    const invitation = document.createElement('div');
    invitation.className = 'live-chat-invitation';
    invitation.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 24px;
        background: #10B981;
        color: white;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
        z-index: 1500;
        max-width: 280px;
        animation: slideInUp 0.3s ease-out;
    `;
    
    invitation.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">💬</div>
            <div>
                <h4 style="margin: 0 0 4px 0;">دردشة مباشرة</h4>
                <p style="margin: 0; font-size: 14px;">تواصل مع خبيرك مباشرة!</p>
            </div>
            <button onclick="openLiveChat(); this.parentElement.parentElement.remove();" 
                    style="background: white; color: #10B981; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer; margin-right: auto;">
                فتح
            </button>
        </div>
    `;
    
    document.body.appendChild(invitation);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (invitation.parentElement) {
            invitation.remove();
        }
    }, 10000);
}

function openLiveChat() {
    showMessage('سيتم فتح الدردشة المباشرة قريباً...', 'info');
}

// AI Chat System
function initAIChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatBody = document.getElementById('chatBody');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatToggle || !chatInput || !sendMessage) return;
    
    // Toggle chat
    chatToggle.addEventListener('click', function() {
        const aiChat = document.getElementById('aiChat');
        aiChat.classList.toggle('expanded');
    });
    
    // Send message functionality
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = getAIResponse(message);
            addChatMessage(response, 'ai');
        }, 1000);
    }
    
    sendMessage.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(message) {
    // Simple AI response system
    const responses = {
        'مرحبا': 'مرحباً بك في Solvify! كيف يمكنني مساعدتك اليوم؟',
        'السلام': 'وعليكم السلام! أهلاً بك، أنا هنا لمساعدتك في حل مشاكلك.',
        'مساعدة': 'يمكنني مساعدتك في:\n• فهم خدماتنا\n• إرشادك لاختيار الخدمة المناسبة\n• الإجابة على استفساراتك العامة',
        'خدمة': 'نقدم ثلاث خدمات رئيسية:\n🎓 الخدمات الطلابية\n💻 الدعم التقني\n🔧 خدمات المنزل',
        'سعر': 'أسعارنا تختلف حسب نوع الخدمة وتعقيد المشكلة. ستجد عرض السعر بعد إرسال مشكلتك.',
        'دفع': 'نقبل جميع طرق الدفع: فيزا، ماستركارد، PayPal، Apple Pay',
        'وقت': 'نقدم حلولاً فورية! معظم المشاكل تُحل خلال دقائق من التواصل.',
        'شكرا': 'العفو! نحن هنا لمساعدتك دائماً. لا تتردد في التواصل معنا.'
    };
    
    // Check for keywords in message
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key.toLowerCase())) {
            return response;
        }
    }
    
    // Default responses
    const defaultResponses = [
        'هذا سؤال جيد! سأقوم بإرشادك للحصول على مساعدة أفضل.',
        'لمساعدتك بشكل أفضل، يرجى إرسال مشكلتك من خلال النموذج أعلاه.',
        'أنا هنا لمساعدتك! هل تود معرفة المزيد عن خدماتنا؟',
        'يمكنني مساعدتك في اختيار الخدمة المناسبة لمشكلتك.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'جاري الإرسال...';
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
                this.reset();
            }, 2000);
        });
    }
}

// Utility Functions
function showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.innerHTML = `
        <span>${getMessageIcon(type)}</span>
        <span>${text}</span>
    `;
    
    // Position message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

function getMessageIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || icons.info;
}

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);