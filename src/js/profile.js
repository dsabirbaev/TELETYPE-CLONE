

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

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("token") || localStorage.getItem("user")) {
    } else {
        window.location.href = "./index.html";
    }
});


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
    console.log(state);
    if (state.length) {
        state?.forEach((el) => {
            const card = document.createElement("div");
            card.classList.add("card");

            if (localStorage.getItem("token") && localStorage.getItem("user_id") === localStorage.getItem("user")) {
                card.innerHTML = `
                     <div class="post_item border relative shadow-md hover:shadow-xl duration-150 font-['inter'] rounded-lg p-4">
                          
                           <div class="flex absolute right-3 gap-x-3">
                                 <button type="button" data-del="${
                                     el.id
                                 }" class="bg-red-500 delete-post  w-8 h-8 rounded-lg">
                                    <i data-del="${el.id}" class="bx bx-trash delete-post text-xl text-white"></i>
                                 </button>

                                  <button type="button" class="bg-blue-500 w-8 h-8 rounded-lg">
                                     <i class="bx bxs-edit text-xl text-white"></i>
                                  </button>
                           </div>


                            <h2 class="post__title text-3xl font-bold leading-[39px] mb-5">
                               ${el.title}
                            </h2>

                            <p class="post__text mb-[25.5px] leading-[25.5px] text-[17px] font-normal">
                                ${el.body?.substring(0, 256)} . . .
                            </p>

     
                            <strong class="mb-[10px] leading-[25.5px]"> </strong>

                            <div class="flex items-center gap-x-3 my-4">
                                <span>${el.createdAt.substring(0, 10)}</span>
                                <i class="bx bx-show"></i>
                                <span>${el.views}</span>
                            </div>
                        </div>
                `;
            } else {
                card.innerHTML = `
                     <div class="post_item border relative shadow-md hover:shadow-xl duration-150 font-['inter'] rounded-lg p-4">
                          
                          


                            <h2 class="post__title text-3xl font-bold leading-[39px] mb-5">
                               ${el.title}
                            </h2>

                            <p class="post__text mb-[25.5px] leading-[25.5px] text-[17px] font-normal">
                                ${el.body?.substring(0, 256)} . . .
                            </p>

     
                            <strong class="mb-[10px] leading-[25.5px]"> </strong>

                            <div class="flex items-center gap-x-3 my-4">
                                <span>${el.createdAt.substring(0, 10)}</span>
                                <i class="bx bx-show"></i>
                                <span>${el.views}</span>
                            </div>
                        </div>
                `;
            }

            $("#" + selector).append(card);
        });
    } else {
        $("#" + selector).innerHTML = `<h1 class='text-center'>${selector.toUpperCase()} NOT FOUND</h1>`;
    }
}


/////////////////// delete posts //////////////////////////////////////////////

function deletePosts(id) {
    console.log(id);
    if (id) {
        fetch(`https://nest-blog-qdsa.onrender.com/api/blog/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => res.json())
        .then(() => {
            alert("Post item deleted successfully");
            window.location.reload();
        });
    }
}

$("#posts").addEventListener("click", (e) => {
    console.log("on clicked");
    if (e.target.classList.contains("delete-post")) {
        let uniqueID = e.target.getAttribute("data-del");
        deletePosts(uniqueID);
    }
});



