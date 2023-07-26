

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

$("#user_profile").innerText = `Blogs ${localStorage.getItem("username")}`;


//////////////////  auth guards  //////////////////////

window.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem('token')){
        window.location.href = "./index.html";
    }
})


//////////////// profile fetching data /////////////////////



let id = localStorage.getItem('user');

async function getUser() {

    try {
        const response = await fetch(`https://nest-blog-qdsa.onrender.com/api/user/${id}`);
        const result = await response.json();
        console.log(result)
        dataRender(result);

        listRender(result.blog , 'posts');
        listRender(result.followers, 'followers');
        listRender(result.followings, 'following');
        
    } catch (err) {
        console.log(err.message);
    } finally {
        console.log("tugadi");
    }
}

getUser();



function dataRender(state) {
    console.log(state)
    if (state) {
        $('#user_name').textContent = state.username;
        $('#full_name').textContent = state.full_name;
    }
}


function listRender(state, selector) {
 
    if (state.length) {
      
        state?.forEach(() => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `<img src="https://picsum.photos/id/211/300/300"><h1>Lorem </h1>`;
                $("#" + selector).append(card);
        })
    } else {
        $('#'+selector).innerHTML = `<h1 class='text-center'>${selector.toUpperCase()} NOT FOUND</h1>`;
   }
}


