$(document).ready(function() {
  $('.navbar-nav .nav-item').on('click', function() {
      $('.navbar-nav .nav-item').removeClass('active');
      $(this).addClass('active');
  });
});

$(document).ready(function(){
    // Initialize the carousel with a faster automatic transition
    $('#carouselFacilities').carousel({
        interval: 1500, // 1.5 seconds
        ride: 'carousel' // Automatically start the carousel
    });

    // Handle the scaling of items during transitions
    $('#carouselFacilities').on('slide.bs.carousel', function () {
        // Reset all facility items to their original scale
        $('.facility-item').css('transform', 'scale(1)');
    });

    $('#carouselFacilities').on('slid.bs.carousel', function () {
        // Scale up the active facility item
        $('.carousel-item.active .facility-item').css('transform', 'scale(1.2)');
    });
});
  document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-up');

    const options = {
      root: null,
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show'); // Add show class when in view
          observer.unobserve(entry.target); // Stop observing after it becomes visible
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);

    sections.forEach(section => {
      observer.observe(section);
    });
  });



