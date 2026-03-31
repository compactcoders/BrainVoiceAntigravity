// Global variables
let blogEntries = [];
let postsData = [];

// DOM Elements
const grid = document.getElementById('blogGrid');
const postsGrid = document.getElementById('postsGrid');
const subBtn = document.getElementById('subscribeBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const filterButtons = document.querySelectorAll('.filter-btn');
const paginationBtns = document.querySelectorAll('.page-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Fetch blog data from JSON file
  fetchBlogData();
  
  // Setup event listeners
  setupEventListeners();
});

// Fetch blog data from JSON file
async function fetchBlogData() {
  try {
    // Show loading state
    if (grid) {
      grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p>Loading posts...</p></div>';
    }
    
    // Fetch the JSON file
    const response = await fetch('blog-data.json');
    const data = await response.json();
    
    // Assign data to global variables
    blogEntries = data.posts;
    postsData = blogEntries.map(entry => ({
      id: entry.id,
      title: entry.title,
      desc: entry.excerpt,
      category: entry.category,
      tag: entry.category,
      icon: entry.icon,
      readTime: entry.readTime,
      author: entry.author,
      date: entry.date,
      color: entry.color
    }));
    
    // Populate grids
    if (grid) {
      populateBlogGrid();
    }
    
    if (postsGrid) {
      populatePostsGrid('all');
    }
    
  } catch (error) {
    console.error('Error loading blog data:', error);
    if (grid) {
      grid.innerHTML = `
        <div class="error-container">
          <i class="fas fa-exclamation-circle"></i>
          <h3>Failed to load posts</h3>
          <p>Please try again later.</p>
        </div>
      `;
    }
  }
}

// Populate blog grid
function populateBlogGrid() {
  grid.innerHTML = '';
  blogEntries.forEach(entry => {
    const card = createBlogCard(entry);
    grid.appendChild(card);
  });
}

// Create blog card
function createBlogCard(entry) {
  const card = document.createElement('article');
  card.className = 'blog-card';
  card.setAttribute('data-id', entry.id);
  
  // Create gradient style based on entry color
  const gradientStyle = `linear-gradient(135deg, ${entry.color}, ${adjustColor(entry.color, 20)})`;
  
  card.innerHTML = `
    <div class="card-img" style="background: ${gradientStyle}">
      <i class="fas ${entry.icon} fa-3x"></i>
      <span class="card-tag">${entry.category}</span>
    </div>
    <div class="blog-content">
      <div class="blog-meta">
        <span>${entry.date}</span>
        <span>✧</span>
        <span>${entry.readTime}</span>
      </div>
      <h3 class="blog-title">${entry.title}</h3>
      <p class="blog-excerpt">${entry.excerpt}</p>
      <div class="blog-footer">
        <span class="blog-author">By ${entry.author}</span>
        <button class="read-more-btn" data-id="${entry.id}">
          Read article <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
  
  // Add click handler for the read more button
  const readMoreBtn = card.querySelector('.read-more-btn');
  readMoreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPostInNewTab(entry.id);
  });
  
  // Make entire card clickable except buttons
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.read-more-btn')) {
      openPostInNewTab(entry.id);
    }
  });
  
  return card;
}

// Create post card for the posts grid
function createPostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card';
  card.setAttribute('data-id', post.id);
  card.setAttribute('data-category', post.tag.toLowerCase());
  
  // Create gradient style based on post color
  const gradientStyle = `linear-gradient(135deg, ${post.color}, ${adjustColor(post.color, 20)})`;
  
  card.innerHTML = `
    <div class="post-img" style="background: ${gradientStyle}">
      <i class="fas ${post.icon} fa-3x"></i>
    </div>
    <div class="post-content">
      <span class="post-tag">${post.tag}</span>
      <h3 class="post-title">${post.title}</h3>
      <p class="post-desc">${post.desc}</p>
      <div class="post-footer">
        <div class="post-meta">
          <span class="post-author">${post.author}</span>
          <span class="post-date">${post.date}</span>
        </div>
        <button class="read-post-btn" data-id="${post.id}">Read →</button>
      </div>
    </div>
  `;
  
  // Add click handler for the read button
  const readBtn = card.querySelector('.read-post-btn');
  readBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPostInNewTab(post.id);
  });
  
  // Make entire card clickable
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.read-post-btn')) {
      openPostInNewTab(post.id);
    }
  });
  
  return card;
}

// Open post in new tab
function openPostInNewTab(postId) {
  // Find the post data
  const post = blogEntries.find(p => p.id === postId);
  
  if (post) {
    // Store post data in sessionStorage for the new tab to access
    sessionStorage.setItem(`post_${postId}`, JSON.stringify(post));
    
    // Open new tab with post.html and post ID as parameter
    window.open(`post.html?id=${postId}`, '_blank');
  }
}

// Populate posts grid with filter
function populatePostsGrid(filter = 'all') {
  if (!postsGrid) return;
  
  postsGrid.innerHTML = '';
  
  let filteredPosts = postsData;
  if (filter !== 'all') {
    filteredPosts = postsData.filter(post => 
      post.tag.toLowerCase() === filter.toLowerCase()
    );
  }
  
  if (filteredPosts.length === 0) {
    postsGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No posts found</h3>
        <p>Try selecting a different filter category.</p>
      </div>
    `;
  } else {
    filteredPosts.forEach(post => {
      const card = createPostCard(post);
      postsGrid.appendChild(card);
    });
  }
}

// Helper function to adjust color brightness for gradients
function adjustColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) + percent;
  const g = ((num >> 8) & 0x00FF) + percent;
  const b = (num & 0x0000FF) + percent;
  
  const newR = Math.min(255, Math.max(0, r));
  const newG = Math.min(255, Math.max(0, g));
  const newB = Math.min(255, Math.max(0, b));
  
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

// Setup event listeners
function setupEventListeners() {
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
  
  // Filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter') || this.textContent.toLowerCase();
      populatePostsGrid(filter);
    });
  });
  
  // Pagination
  paginationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.disabled) return;
      
      if (this.classList.contains('prev')) {
        const currentActive = document.querySelector('.page-btn.active');
        const prevBtn = currentActive?.previousElementSibling;
        if (prevBtn && !prevBtn.classList.contains('prev')) {
          paginationBtns.forEach(b => b.classList.remove('active'));
          prevBtn.classList.add('active');
        }
      } else if (this.classList.contains('next')) {
        const currentActive = document.querySelector('.page-btn.active');
        const nextBtn = currentActive?.nextElementSibling;
        if (nextBtn && !nextBtn.classList.contains('next')) {
          paginationBtns.forEach(b => b.classList.remove('active'));
          nextBtn.classList.add('active');
        }
      } else {
        paginationBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  
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

// Toggle mobile menu
function toggleMobileMenu() {
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
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

console.log('Brainvoice Blog JS loaded successfully - Dynamic data from JSON');