// Funcionalidades del sitio TechSolutions
document.addEventListener('DOMContentLoaded', function() {
    
    // ====================
    // 1. CONFIGURACIONES GENERALES
    // ====================
    
    // Actualizar año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Menú hamburguesa para móviles
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // ====================
    // 2. MANEJO DE FORMULARIOS
    // ====================
    
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        // Crear elemento de feedback
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'form-feedback';
        feedbackDiv.style.display = 'none';
        form.appendChild(feedbackDiv);
        
        // Manejar envío del formulario
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const feedback = this.querySelector('.form-feedback');
            
            // Validación básica
            if (!validateForm(this)) {
                showFeedback(feedback, 'Por favor, completa todos los campos requeridos correctamente.', 'error');
                return;
            }
            
            // Cambiar estado del botón
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            try {
                // Enviar formulario a Formspree
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Éxito
                    showFeedback(feedback, '¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
                    this.reset();
                    
                    // Redirigir después de 3 segundos (si está configurado)
                    const redirectUrl = this.querySelector('input[name="_next"]')?.value;
                    if (redirectUrl) {
                        setTimeout(() => {
                            window.location.href = redirectUrl;
                        }, 3000);
                    }
                } else {
                    // Error del servidor
                    throw new Error('Error en el servidor');
                }
            } catch (error) {
                // Error de red o del servidor
                showFeedback(feedback, 'Hubo un error al enviar el mensaje. Por favor, contáctame directamente por WhatsApp.', 'error');
                console.error('Error en formulario:', error);
            } finally {
                // Restaurar botón después de 3 segundos
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    feedback.style.display = 'none';
                }, 5000);
            }
        });
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
    
    // ====================
    // 3. FUNCIONES DE VALIDACIÓN
    // ====================
    
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Limpiar estilos previos
        field.classList.remove('error', 'success');
        
        // Validar campo requerido
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            isValid = false;
        }
        
        // Validar email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                isValid = false;
            }
        }
        
        // Validar teléfono (solo si tiene valor)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                field.classList.add('error');
                isValid = false;
            }
        }
        
        // Si es válido y tiene valor, marcar como éxito
        if (isValid && value) {
            field.classList.add('success');
        }
        
        return isValid;
    }
    
    function showFeedback(element, message, type) {
        element.textContent = message;
        element.className = `form-feedback ${type}`;
        element.style.display = 'block';
        
        // Desplazar hasta el feedback
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // ====================
    // 4. SMOOTH SCROLL
    // ====================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if(this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ====================
    // 5. ANIMACIONES AL SCROLL
    // ====================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.service-card, .benefit, .step, .portfolio-card, .contact-card').forEach(el => {
        observer.observe(el);
    });
    
    // ====================
    // 6. HEADER AL SCROLL
    // ====================
    
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if(window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // ====================
    // 7. WHATSAPP DIRECT
    // ====================
    
    // Botón de WhatsApp en el footer/info
    const whatsappBtn = document.querySelector('.contact-info .fa-whatsapp').closest('.info-item');
    if (whatsappBtn) {
        whatsappBtn.style.cursor = 'pointer';
        whatsappBtn.addEventListener('click', function() {
            const phone = '+584143568666';
            const message = 'Hola! Vi tu página web y me interesan tus servicios. ¿Podrías ayudarme?';
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        });
    }
});

// Función auxiliar para debug
function logFormData(form) {
    const data = new FormData(form);
    console.log('=== Datos del Formulario ===');
    for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
    }
}

// FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
    });
});
