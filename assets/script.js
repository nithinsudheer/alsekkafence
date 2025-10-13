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

// Gallery Filter and Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let currentImageIndex = 0;
  let visibleImages = [];

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      updateVisibleImages();
    });
  });

  // Update visible images array
  function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  }

  updateVisibleImages();

  // Open lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      currentImageIndex = visibleImages.indexOf(this);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target === lightboxImg) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Navigate lightbox
  document.querySelector('.lightbox-prev').addEventListener('click', function(e) {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    updateLightboxImage();
  });

  document.querySelector('.lightbox-next').addEventListener('click', function(e) {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    updateLightboxImage();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
      updateLightboxImage();
    }
    if (e.key === 'ArrowRight') {
      currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
      updateLightboxImage();
    }
  });

  function updateLightboxImage() {
    const currentItem = visibleImages[currentImageIndex];
    const img = currentItem.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }
});