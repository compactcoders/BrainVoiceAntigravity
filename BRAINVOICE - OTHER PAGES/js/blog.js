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

// Fetch blog data from Sanity CMS
async function fetchBlogData() {
  try {
    // Show loading state
    if (grid) {
      grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p>Loading posts...</p></div>';
    }
    
    // Fetch from Sanity Content Delivery API
    const projectId = 'vurt722v';
    const dataset = 'production';
    const query = encodeURIComponent('*[_type == "post"] | order(date desc)');
    const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=${query}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Assign data to global variables
    blogEntries = data.result || [];
    // Ensure every entry has a consistent id property (using slug)
    blogEntries.forEach(entry => {
      entry.id = entry.slug?.current || entry.id || entry._id;
    });
    
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
    console.error('Error loading blog data from Sanity:', error);
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
  
  const color = entry.color || '#13B0CB';
  // Create gradient style based on entry color
  const gradientStyle = `linear-gradient(135deg, ${color}, ${adjustColor(color, 20)})`;
  
  card.innerHTML = `
    <div class="card-img" style="background: ${gradientStyle}">
      <i class="fas ${entry.icon || 'fa-pen-nib'} fa-3x"></i>
      <span class="card-tag">${entry.category || 'Insight'}</span>
    </div>
    <div class="blog-content">
      <div class="blog-meta">
        <span>${entry.date || 'Recent'}</span>
        <span>✧</span>
        <span>${entry.readTime || '3 min read'}</span>
      </div>
      <h3 class="blog-title">${entry.title || 'Untitled'}</h3>
      <p class="blog-excerpt">${entry.excerpt || ''}</p>
      <div class="blog-footer">
        <span class="blog-author">By ${entry.author || 'Brainvoice Team'}</span>
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
  card.setAttribute('data-category', (post.tag || 'Insight').toLowerCase());
  
  const color = post.color || '#13B0CB';
  // Create gradient style based on post color
  const gradientStyle = `linear-gradient(135deg, ${color}, ${adjustColor(color, 20)})`;
  
  card.innerHTML = `
    <div class="post-img" style="background: ${gradientStyle}">
      <i class="fas ${post.icon || 'fa-pen-nib'} fa-3x"></i>
    </div>
    <div class="post-content">
      <span class="post-tag">${post.tag || 'Insight'}</span>
      <h3 class="post-title">${post.title || 'Untitled'}</h3>
      <p class="post-desc">${post.desc || ''}</p>
      <div class="post-footer">
        <div class="post-meta">
          <span class="post-author">${post.author || 'Brainvoice Team'}</span>
          <span class="post-date">${post.date || 'Recent'}</span>
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
  const post = blogEntries.find(p => String(p.id) === String(postId));
  
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
      (post.tag || '').toLowerCase() === filter.toLowerCase()
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
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
    return '#13B0CB';
  }
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = (num >> 16) + percent;
    const g = ((num >> 8) & 0x00FF) + percent;
    const b = (num & 0x0000FF) + percent;
    
    const newR = Math.min(255, Math.max(0, r));
    const newG = Math.min(255, Math.max(0, g));
    const newB = Math.min(255, Math.max(0, b));
    
    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
  } catch (e) {
    return hex;
  }
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

// Toggle mobile menu
function toggleMobileMenu() {
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
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