

import {$, $$, createElement} from "./utils.js"


function hideContent() {
    $$(".tab__contnet").forEach((item) => {
        item.style.display = "none";
    });

    $$(".active_tab").forEach((item) => {
        item.classList.remove("active_tab");
    });
}

function showContent(index) {
    $$(".tab__contnet")[index].style.display = "block";
    $$(".tab__item")[index].classList.add("active_tab");
}

$$(".tab__item").forEach((item, index) => {
    item.addEventListener("click", () => {
        hideContent();
        localStorage.setItem("active_index", index);
        showContent(index);
    });
});

hideContent();
showContent(localStorage.getItem("active_index") || 0);

$("#user_title").innerText = `Blogs ${localStorage.getItem("username")}`;


