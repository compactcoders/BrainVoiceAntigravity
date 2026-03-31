// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const subBtn = document.getElementById('subscribeBtn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  initializeCounters();
  highlightActiveNavLink();
  initializeRevealAnimations();
  setupFooterForms();
});

// Setup event listeners
function setupEventListeners() {
  // Mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        (!mobileMenuBtn || !mobileMenuBtn.contains(e.target))) {
      navLinks.classList.remove('active');
    }
  });
  
  // Newsletter subscription
  if (subBtn) {
    subBtn.addEventListener('click', handleSubscribe);
    
    const emailInput = document.getElementById('newsletterEmail');
    if (emailInput) {
      emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSubscribe(e);
        }
      });
    }
  }
}

// Highlight active navigation link based on current page
function highlightActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  const aliases = {
    'blog.html': 'blogs.html',
    'contact.html': 'contactus.html'
  };
  const normalizedPage = aliases[currentPage] || currentPage;
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    if (linkPage === normalizedPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Toggle mobile menu
function toggleMobileMenu() {
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

function initializeRevealAnimations() {
  const targets = document.querySelectorAll('main section, .featured-ribbon, .featured-card, .posts-section, .blog-grid, .post-container > *');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach((target) => {
    target.classList.add('reveal-on-scroll');
    observer.observe(target);
  });
}

function setupFooterForms() {
  const forms = document.querySelectorAll('.footer-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showNotification('Thanks! We received your details and will reach out shortly.', 'success');
      form.reset();
    });
  });
}

// Handle newsletter subscription
function handleSubscribe(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  const email = emailInput.value.trim();
  
  if (!email) {
    showNotification('Please enter your email address', 'error');
    emailInput.focus();
  } else if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    emailInput.focus();
  } else {
    showNotification('Thanks for subscribing! We\'ll send updates to ' + email, 'success');
    emailInput.value = '';
    
    // Store in localStorage for demo
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    subscribers.push({ email, date: new Date().toISOString() });
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
  }
}

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Initialize counter animations
function initializeCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const value = stat.textContent;
    if (value.includes('+') || value.includes('%') || value.includes('hrs')) {
      const numValue = parseInt(value.replace(/[^0-9]/g, ''));
      if (!isNaN(numValue)) {
        animateCounter(stat, numValue, value.includes('%') ? '%' : value.includes('+') ? '+' : '');
      }
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        animateCounter(stat, numValue);
      }
    }
  });
}

// Animate counter
function animateCounter(element, target, suffix = '') {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 20);
}

// Notification system
function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  
  notification.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;
  
  const colors = {
    success: { bg: '#51C186' },
    error: { bg: '#ff4444' },
    info: { bg: '#13B0CB' }
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type].bg};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Add animation keyframes if not exists
if (!document.querySelector('#notification-keyframes')) {
  const style = document.createElement('style');
  style.id = 'notification-keyframes';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Console log that JS is loaded
console.log('Brainvoice Global JS loaded successfully');
