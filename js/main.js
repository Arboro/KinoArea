/* Tab */
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tab-group").forEach(group => {
        const buttons = group.querySelectorAll(".tab-btn");
        const contents = group.querySelectorAll(".tab-content");

        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const targetId = this.getAttribute("data-target");

                // Deactivate all tabs
                buttons.forEach(btn => btn.classList.remove("tab-btn__active"));
                contents.forEach(content => content.classList.remove("active"));

                // Activate the clicked tab
                this.classList.add("tab-btn__active");
                const targetContent = group.querySelector(`#${targetId}`);
                if (targetContent) {
                    targetContent.classList.add("active");

                    // Initialize any carousels inside the newly active tab
                    targetContent.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
                        const carousel = wrapper.querySelector('.carousel');
                        if (carousel && !carousel.dataset.initialized) {
                            const controls = initializeCarousel(carousel);
                            wrapper.querySelector('.next')?.addEventListener('click', controls.scrollNext);
                            wrapper.querySelector('.prev')?.addEventListener('click', controls.scrollPrev);
                            carousel.dataset.initialized = 'true';
                        }
                    });
                }
            });
        });

        // Auto-activate the first tab (which also initializes carousels inside it)
        if (buttons[0]) buttons[0].click();
    });
});


/* Slider */
const scrollContainer = document.getElementById('scrollContainer');
const selectedVideo = document.getElementById('selectedVideo');
const selectedTitle = document.getElementById('selectedTitle');
const cards = scrollContainer.querySelectorAll('.newTrailer__scroll__item');

// Prevent image drag behavior
const videos = scrollContainer.querySelectorAll('.newTrailer__scroll__item__img');
videos.forEach(video => {
    video.ondragstart = () => false;
});

function updateSelectedCard(card) {
    const video = card.querySelector('.newTrailer__scroll__item__img');
    selectedVideo.src = video.src;
    selectedVideo.alt = video.alt;
    selectedTitle.textContent = card.dataset.title;

    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
}

// Initialize with the first card
if (cards.length > 0) {
    updateSelectedCard(cards[0]);
}

// Click handler
cards.forEach(card => {
    card.addEventListener('click', () => {
        updateSelectedCard(card);
    });
});

// Drag-to-scroll logic
let isDown = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener('mouseleave', () => isDown = false);
scrollContainer.addEventListener('mouseup', () => isDown = false);

scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
});


/*Like */
var btn1 = document.querySelector('#like');
var btn2 = document.querySelector('#dislike');

btn1.addEventListener('click', function () {

    if (btn2.classList.contains('like-dislike')) {
        btn2.classList.remove('like-dislike');
    }
    this.classList.toggle('like-dislike');

});

btn2.addEventListener('click', function () {

    if (btn1.classList.contains('like-dislike')) {
        btn1.classList.remove('like-dislike');
    }
    this.classList.toggle('like-dislike');

});


/* Carousel */
function initializeCarousel(carouselElement, gap = 23) {
    const cards = carouselElement.querySelectorAll('.popularMovie__item');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + gap;

    function scrollCarousel(direction) {
        const maxScrollLeft = carouselElement.scrollWidth - carouselElement.clientWidth;
        const currentScroll = carouselElement.scrollLeft;

        if (direction === 1 && currentScroll >= maxScrollLeft - 1) {
            carouselElement.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (direction === -1 && currentScroll <= 0) {
            carouselElement.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            carouselElement.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
        }
    }

    return {
        scrollNext: () => scrollCarousel(1),
        scrollPrev: () => scrollCarousel(-1),
    };
}