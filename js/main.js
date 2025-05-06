// /* Tab */
// document.addEventListener("DOMContentLoaded", function () {
//     document.querySelectorAll(".tab-group").forEach(group => {
//         const buttons = group.querySelectorAll(".tab-btn");
//         const contents = group.querySelectorAll(".tab-content");

//         buttons.forEach(button => {
//             button.addEventListener("click", function () {
//                 const targetId = this.getAttribute("data-target");

//                 // Deactivate all tabs
//                 buttons.forEach(btn => btn.classList.remove("tab-btn__active"));
//                 contents.forEach(content => content.classList.remove("active"));

//                 // Activate the clicked tab
//                 this.classList.add("tab-btn__active");
//                 const targetContent = group.querySelector(`#${targetId}`);
//                 if (targetContent) {
//                     targetContent.classList.add("active");

//                     // Initialize any carousels inside the newly active tab
//                     targetContent.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
//                         const carousel = wrapper.querySelector('.carousel');
//                         if (carousel && !carousel.dataset.initialized) {
//                             const controls = initializeCarousel(carousel);
//                             wrapper.querySelector('.next')?.addEventListener('click', controls.scrollNext);
//                             wrapper.querySelector('.prev')?.addEventListener('click', controls.scrollPrev);
//                             carousel.dataset.initialized = 'true';
//                         }
//                     });
//                 }
//             });
//         });

//         // Auto-activate the first tab (which also initializes carousels inside it)
//         if (buttons[0]) buttons[0].click();
//     });
// });


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


// /* Carousel */
// function initializeCarousel(carouselElement, gap = 23) {
//     const cards = carouselElement.querySelectorAll('.popularMovie__item');
//     if (cards.length === 0) return;

//     const cardWidth = cards[0].offsetWidth + gap;

//     function scrollCarousel(direction) {
//         const maxScrollLeft = carouselElement.scrollWidth - carouselElement.clientWidth;
//         const currentScroll = carouselElement.scrollLeft;

//         if (direction === 1 && currentScroll >= maxScrollLeft - 1) {
//             carouselElement.scrollTo({ left: 0, behavior: 'smooth' });
//         } else if (direction === -1 && currentScroll <= 0) {
//             carouselElement.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
//         } else {
//             carouselElement.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
//         }
//     }

//     return {
//         scrollNext: () => scrollCarousel(1),
//         scrollPrev: () => scrollCarousel(-1),
//     };
// }


/* Tabs + Carousel */
function initializeCarousel(carouselElement, gap = 23) {
    const cards = carouselElement.querySelectorAll('.popularMovie__item');
    if (cards.length === 0) return;

    function scrollCarousel(direction) {
        const cardWidth = cards[0].offsetWidth + gap;
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

    carouselElement._controls = {
        scrollNext: () => scrollCarousel(1),
        scrollPrev: () => scrollCarousel(-1),
    };
}

function initVisibleCarousels(root = document) {
    root.querySelectorAll('.carousel').forEach(carousel => {
        if (!carousel.dataset.initialized) {
            initializeCarousel(carousel);
            carousel.dataset.initialized = 'true';
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize carousels that are visible on load
    initVisibleCarousels();

    // Tab functionality
    document.querySelectorAll(".tab-group").forEach(group => {
        const buttons = group.querySelectorAll(".tab-btn");
        const contents = group.querySelectorAll(".tab-content");

        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const targetId = this.getAttribute("data-target");

                buttons.forEach(btn => btn.classList.remove("tab-btn__active"));
                contents.forEach(content => content.classList.remove("active"));

                this.classList.add("tab-btn__active");
                const targetContent = group.querySelector(`#${targetId}`);
                if (targetContent) {
                    targetContent.classList.add("active");

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            initVisibleCarousels(targetContent);
                        });
                    });
                }
            });
        });

        // Auto-activate the first tab
        if (buttons[0]) buttons[0].click();
    });

    // Global event listeners for all carousel buttons
    document.querySelectorAll('.carousel-btn').forEach(button => {
        const targetSelector = button.dataset.target;
        const carousel = document.querySelector(targetSelector);
        if (!carousel) return;

        button.addEventListener('click', () => {
            const isNext = button.classList.contains('next');
            if (!carousel._controls) {
                initializeCarousel(carousel);
            }
            if (carousel._controls) {
                isNext ? carousel._controls.scrollNext() : carousel._controls.scrollPrev();
            }
        });
    });
});


document.querySelectorAll('.latestNews__body').forEach(gallery => {
    const selectedImage = gallery.querySelector('.latestNews__selected-image');
    const selectedTitle = gallery.querySelector('.latestNews__selected-title');
    const selectedDescription = gallery.querySelector('.latestNews__selected-description');
    const scrollContainer = gallery.querySelector('.latestNews__scroll-container');
    const cards = scrollContainer.querySelectorAll('.latestNews__thumbnail-card');

    function updateSelectedCardById(id) {
        const card = [...cards].find(card => card.dataset.id === id);
        if (card) {
            const img = card.querySelector('.latestNews__thumbnail-image');
            selectedImage.src = img.src;
            selectedImage.alt = img.alt;
            selectedTitle.textContent = card.dataset.title;
            selectedDescription.textContent = card.dataset.description;

            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        }
    }

    // Initialize with first card
    if (cards.length > 0) {
        updateSelectedCardById(cards[0].dataset.id);
    }

    // Add click listeners
    cards.forEach(card => {
        card.addEventListener('click', () => {
            updateSelectedCardById(card.dataset.id);
        });
    });

    // Enable drag scroll
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
});


/* Button Up */
window.onscroll = function () { scrollFunction() };

const upbuttons = document.querySelectorAll(".top__btn");

for (const upbutton of upbuttons) {
    upbutton.addEventListener("click", clickHandler);
}

function clickHandler(e) {
    e.preventDefault();
    const href = this.getAttribute("href");

    document.querySelector(href).scrollIntoView({
        behavior: "smooth"
    });
}

function scrollFunction() {
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
        document.getElementById('btnUp').className = 'top__btn visible';
    } else {
        document.getElementById('btnUp').className = 'top__btn hidden';
    }
}

/* Modal login */
function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 400);
}

function switchModal(fromId, toId) {
    closeModal(fromId);
    setTimeout(() => openModal(toId), 400);
}

// Click outside to close
window.onclick = function (event) {
    const modals = ['loginModal', 'recoveryModal', 'registerModal', 'recoverylastModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (event.target == modal) {
            closeModal(id);
        }
    });
}