// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const subBtn = document.getElementById('subscribeBtn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  initializeCounters();
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
        !mobileMenuBtn.contains(e.target)) {
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

// Toggle mobile menu
function toggleMobileMenu() {
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
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
    // Show loading state
    const originalBtnText = subBtn ? subBtn.innerHTML : 'Subscribe';
    if (subBtn) {
      subBtn.disabled = true;
      subBtn.innerHTML = 'Subscribing... <i class="fas fa-spinner fa-spin"></i>';
    }
    
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '66d77104-7dfb-4961-b5b2-d83058045a3a',
        subject: 'New Newsletter Subscription',
        email: email
      })
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        showNotification('Thanks for subscribing! We\'ll send updates to ' + email, 'success');
        emailInput.value = '';
        
        // Store in localStorage for demo
        const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        subscribers.push({ email, date: new Date().toISOString() });
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
      } else {
        showNotification(json.message || 'Something went wrong. Please try again.', 'error');
      }
    })
    .catch(error => {
      console.error(error);
      showNotification('Subscription failed. Please check your internet connection.', 'error');
    })
    .then(() => {
      if (subBtn) {
        subBtn.disabled = false;
        subBtn.innerHTML = originalBtnText;
      }
    });
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
      // For values with symbols, we'll just animate the numbers
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
  const increment = target / 50; // Divide into 50 steps
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
console.log('Brainvoice About Us JS loaded successfully');