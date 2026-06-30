document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
            }, 500);
        });
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 3000);
    }

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        let current = '';
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    if (sections.length > 0) {
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const subjectError = document.getElementById('subjectError');
        const messageError = document.getElementById('messageError');

        function showError(input, errorEl, message) {
            input.classList.remove('success');
            input.classList.add('error');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('visible');
            }
        }

        function showSuccess(input, errorEl) {
            input.classList.remove('error');
            input.classList.add('success');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
        }

        function validateName() {
            const val = nameInput.value.trim();
            if (!val) {
                showError(nameInput, nameError, 'Name is required.');
                return false;
            }
            if (val.length < 2) {
                showError(nameInput, nameError, 'Name must be at least 2 characters.');
                return false;
            }
            showSuccess(nameInput, nameError);
            return true;
        }

        function validateEmail() {
            const val = emailInput.value.trim();
            if (!val) {
                showError(emailInput, emailError, 'Email is required.');
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                showError(emailInput, emailError, 'Please enter a valid email address.');
                return false;
            }
            showSuccess(emailInput, emailError);
            return true;
        }

        function validatePhone() {
            const val = phoneInput.value.trim();
            if (!val) {
                showError(phoneInput, phoneError, 'Phone number is required.');
                return false;
            }
            const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
            if (!phoneRegex.test(val)) {
                showError(phoneInput, phoneError, 'Please enter a valid phone number.');
                return false;
            }
            showSuccess(phoneInput, phoneError);
            return true;
        }

        function validateSubject() {
            const val = subjectInput.value;
            if (!val) {
                showError(subjectInput, subjectError, 'Please select a subject.');
                return false;
            }
            showSuccess(subjectInput, subjectError);
            return true;
        }

        function validateMessage() {
            const val = messageInput.value.trim();
            if (!val) {
                showError(messageInput, messageError, 'Message is required.');
                return false;
            }
            if (val.length < 10) {
                showError(messageInput, messageError, 'Message must be at least 10 characters.');
                return false;
            }
            showSuccess(messageInput, messageError);
            return true;
        }

        nameInput.addEventListener('blur', validateName);
        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', validateEmail);
        phoneInput.addEventListener('blur', validatePhone);
        phoneInput.addEventListener('input', validatePhone);
        subjectInput.addEventListener('change', validateSubject);
        messageInput.addEventListener('blur', validateMessage);
        messageInput.addEventListener('input', validateMessage);

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isSubjectValid = validateSubject();
            const isMessageValid = validateMessage();
            if (isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid) {
                showToast('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                [nameInput, emailInput, phoneInput, messageInput].forEach(function(input) {
                    input.classList.remove('success', 'error');
                });
                if (subjectInput) subjectInput.classList.remove('success', 'error');
            } else {
                showToast('Please fix the errors in the form.', 'error');
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    }

    function showToast(message, type) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast-message' + (type === 'error' ? ' error' : '');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(function() {
                toast.remove();
            }, 400);
        }, 4000);
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(function(el) {
        observer.observe(el);
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        function animateCounter(counter) {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;
            const increment = function() {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString() + '+';
                    return;
                }
                counter.textContent = current.toLocaleString() + '+';
                requestAnimationFrame(increment);
            };
            increment();
        }
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function(counter) {
            counterObserver.observe(counter);
        });
    }

    (function() {
        const style = document.createElement('style');
        style.textContent = '.toast-message { transition: all 0.4s ease; }';
        document.head.appendChild(style);
    })();
});
