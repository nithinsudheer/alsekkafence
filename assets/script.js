// Mobile menu toggle
function toggleMenu() {
  const checkbox = document.getElementById('nav-toggle');
  checkbox.checked = !checkbox.checked;
}

// Toast notification function
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Dropdown accessibility
document.querySelectorAll('.dropdown button').forEach(button => {
  button.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown button').forEach(button => {
      button.setAttribute('aria-expanded', 'false');
    });
  }
});

// Smooth scrolling for anchor links
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

// Improved Smooth Parallax Effect
let ticking = false;
let scrollY = 0;

function updateParallax() {
  scrollY = window.pageYOffset;
  
  // Hero parallax background - slower movement for smoother effect
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const heroOffset = scrollY * 0.3; // Reduced from 0.5 to 0.3
    heroBg.style.transform = `translate3d(0, ${heroOffset}px, 0)`;
  }
  
  // Features parallax background
  const featuresBg = document.querySelector('.features-bg');
  if (featuresBg) {
    const featuresSection = document.querySelector('.features, .services, .products-overview');
    if (featuresSection) {
      const sectionTop = featuresSection.offsetTop;
      const sectionHeight = featuresSection.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Only apply parallax when section is in viewport
      if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
        const parallaxOffset = (scrollY - sectionTop + windowHeight) * 0.2; // Reduced intensity
        featuresBg.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
      }
    }
  }
  
  // Products parallax background
  const productsBg = document.querySelector('.products-bg');
  if (productsBg) {
    const productsSection = document.querySelector('.products, .product-details, .additional-services');
    if (productsSection) {
      const sectionTop = productsSection.offsetTop;
      const sectionHeight = productsSection.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Only apply parallax when section is in viewport
      if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
        const parallaxOffset = (scrollY - sectionTop + windowHeight) * 0.25; // Reduced intensity
        productsBg.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
      }
    }
  }
  
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

// Throttled scroll handler for better performance
let scrollTimeout;
function handleScroll() {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  
  requestTick();
  
  // Additional smooth update after scroll stops
  scrollTimeout = setTimeout(() => {
    requestTick();
  }, 50);
}

// Initialize parallax with proper performance optimization
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('load', updateParallax);
window.addEventListener('resize', updateParallax);

// Initial call
updateParallax();

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Animated Counter Function
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Enhanced Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.classList.contains('stats')) {
      // Animate all counters in the stats section
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-target'));
        setTimeout(() => {
          animateCounter(counter, 0, target, 1500); // Faster animation - 1.5 seconds
        }, index * 150); // Shorter stagger - 150ms apart
      });
      counterObserver.unobserve(entry.target); // Only animate once
    }
  });
}, {
  threshold: 0.3 // Trigger when 30% visible
});

// Initialize all observers
document.addEventListener('DOMContentLoaded', function() {
  // Observe cards and products for fade-in
  document.querySelectorAll('.card, .product, .product-detail-card, .category-card, .custom-card').forEach(element => {
    observer.observe(element);
  });
  
  // Observe stats section for counter animation
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }
});