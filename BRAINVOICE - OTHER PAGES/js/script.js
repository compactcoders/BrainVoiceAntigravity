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

// Mobile Not Supported Overlay Injector
(function() {
  if (window.innerWidth <= 1024) {
    const overlay = document.createElement('div');
    overlay.id = 'mobile-not-supported-overlay';
    overlay.innerHTML = `
      <div class="mns-top-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#a0fcf0" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 10px rgba(160,252,240,0.8));">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
          <path d="M14 7l2 -2m0 0v2m0 -2h-2"></path>
          <path d="M10 11l-2 2m0 0v-2m0 2h2"></path>
        </svg>
      </div>
      <h1 class="mns-heading">DESKTOP EXPERIENCE<br>REQUIRED</h1>
      <hr class="mns-separator">
      <div class="mns-text">
        <p>THIS IMMERSIVE<br>WEBSITE IS OPTIMIZED<br>FOR LARGER SCREENS.</p>
        <br>
        <p>PLEASE VISIT US ON A<br>PC OR LAPTOP FOR THE<br>FULL EXPERIENCE.</p>
      </div>
      <div class="mns-bottom-icons">
        <svg width="120" height="60" viewBox="0 0 60 30" fill="none" stroke="#169b8b" stroke-width="1.2" stroke-linejoin="round">
          <rect x="2" y="14" width="14" height="10" rx="1"></rect>
          <path d="M0 24h18v1.5H0z"></path>
          <rect x="20" y="4" width="22" height="15" rx="1"></rect>
          <path d="M28 19v4h6v-4"></path>
          <path d="M24 23h14v1.5H24z"></path>
          <rect x="46" y="6" width="10" height="18" rx="1"></rect>
          <line x1="49" y1="9" x2="53" y2="9"></line>
          <line x1="49" y1="11" x2="53" y2="11"></line>
          <circle cx="51" cy="20" r="1"></circle>
        </svg>
      </div>
    `;
    
    const injectOverlay = () => {
      if (!document.getElementById('mobile-not-supported-overlay')) {
        document.body.appendChild(overlay);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectOverlay);
    } else {
      injectOverlay();
    }
  }
})();
