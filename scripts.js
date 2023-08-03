class CS_GalleryFilter {
  filtersSelector = ".cs-button";
  galleriesSelector = ".cs-gallery";
  activeClass = "cs-active";
  hiddenClass = "cs-hidden";

  constructor() {
    this.$galleries = document.querySelectorAll(this.galleriesSelector);
    const $filters = document.querySelectorAll(this.filtersSelector);

    this.onClick($filters[0]);

    for (const $filter of $filters) {
      $filter.addEventListener("click", () => this.onClick($filter));
    }
  }

  onClick($filter) {
    this.filter($filter.dataset.filter);

    const { activeClass } = this;

    this.$activeFilter?.classList.remove(activeClass);
    $filter.classList.add(activeClass);

    this.$activeFilter = $filter;
  }

  filter(filter) {
    const showAll = filter == "all";
    const { hiddenClass } = this;

    for (const $gallery of this.$galleries) {
      const show = showAll || $gallery.dataset.category == filter;
      $gallery.classList.toggle(hiddenClass, !show);
    }
  }
}

new CS_GalleryFilter();

// JavaScript logic for carousel/slideshow
const slides = document.querySelectorAll(".carousel-slide");
let currentSlide = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let interval = null; // Variable to store the autoplay interval

function showSlide(slideIndex) {
  slides.forEach((slide, index) => {
    slide.classList.remove("active");
    if (index === slideIndex) {
      slide.classList.add("active");
    }
  });
}

function previousSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function touchStart(event) {
  isDragging = true;
  startPos = getPositionX(event);
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function touchEnd() {
  isDragging = false;
  const moveBy = currentTranslate - prevTranslate;

  if (moveBy < -100) {
    nextSlide();
  } else if (moveBy > 100) {
    previousSlide();
  }

  currentTranslate = 0;
  prevTranslate = 0;
}

// Add event listeners for touch events
slides.forEach((slide) => {
  slide.addEventListener("touchstart", touchStart);
  slide.addEventListener("touchmove", touchMove);
  slide.addEventListener("touchend", touchEnd);
});

// Add event listeners for mouse events
slides.forEach((slide) => {
  slide.addEventListener("mousedown", touchStart);
  slide.addEventListener("mousemove", touchMove);
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mouseleave", touchEnd);
});

// Autoplay function
function startAutoplay() {
  interval = setInterval(() => {
    nextSlide();
  }, 10000); // Adjust the autoplay duration as needed (in milliseconds)
}

function stopAutoplay() {
  clearInterval(interval);
}

// Start autoplay when the page loads
startAutoplay();

// Pause autoplay on carousel interaction
slides.forEach((slide) => {
  slide.addEventListener("mousedown", stopAutoplay);
  slide.addEventListener("touchstart", stopAutoplay);
});

// Resume autoplay after carousel interaction
slides.forEach((slide) => {
  slide.addEventListener("mouseup", startAutoplay);
  slide.addEventListener("touchend", startAutoplay);
});
