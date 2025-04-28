/* Tab */
function openMovie(evt, movieName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("nowCinema__tabs__item");
    for (i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("nowCinema__tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("tab-btn__active");
    }
    document.getElementById(movieName).classList.add("active");
    evt.currentTarget.classList.add("tab-btn__active");
}

// Auto-click the first tab on page load
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".nowCinema__tab-btn").click();
});