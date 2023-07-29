

import {$, $$, createElement} from "./utils.js"

let BASE_URL = "https://nest-blog-m711.onrender.com";

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


//////////////////  auth guards  //////////////////////

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("token") || localStorage.getItem("user")) {
    } else {
        window.location.href = "./index.html";
    }
});


//////////////// profile fetching data /////////////////////



let id = localStorage.getItem('user');

$("#posts").innerHTML = "<div class='loader_wrapper'><span class='loader'></span></div>";

async function getUser() {

    try {
        const response = await fetch(`${BASE_URL}/api/user/${id}`);
        const result = await response.json();
      
        if (result) {
            $("#posts").innerHTML = "";
            dataRender(result);
            listRender(result.blog, "posts");
            listRender(result.followers, "followers");
            followRender(result.followings);
        }
        
    } catch (err) {
        console.log(err.message);
    } finally {
        console.log("profile.js tugadi");
    }
}

getUser();



function dataRender(state) {

    if (state) {
        $('#user_name').textContent = state.username;
        $('#full_name').textContent = state.full_name;
    }
}


function listRender(state, selector) {
    
    if (state.length) {
        state?.forEach((el) => {
            const card = document.createElement("div");
            card.classList.add("card");

            if (localStorage.getItem("token") && localStorage.getItem("user_id") === localStorage.getItem("user")) {
                card.innerHTML = `
                     <div class="post_item border relative shadow-md hover:shadow-xl duration-150 font-['inter'] rounded-lg p-4">
                          
                           <div class="flex absolute right-3 gap-x-3">
                                 <button type="button" data-del="${el.id}" class="bg-red-500 delete-post  w-8 h-8 rounded-lg">
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



////////////////////////////  following and followers redner functions /////////////////

function followRender(state) {
   
    if (state.length) {
        state?.forEach((el) => {
           
            const followItem = document.createElement("div");
            followItem.classList.add("card", "p-3", "m-2", "shadow");
            followItem.innerHTML = `<h1>${el?.following?.full_name}</h1>
            <p> ${el?.following?.username}</p>`;
            $("#following").append(followItem);
        });
    } else {
        $("#following").innerHTML="<h1>NOT FOUND</h1>"
    }
}

/////////////////// delete posts //////////////////////////////////////////////

function deletePosts(id) {
   
    if (id) {
        fetch(`${BASE_URL}/api/blog/${id}`, {
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
    
    if (e.target.classList.contains("delete-post")) {
        let uniqueID = e.target.getAttribute("data-del");
        deletePosts(uniqueID);
    }
});

////////////// followers and following ///////////////////////////

function addFollow() {
    let userid = localStorage.getItem("user");
    return fetch(`${BASE_URL}/api/follow`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({following_id: userid}),
    });
}

$("#follow_btn").addEventListener("click", (e) => {
    addFollow()
    .then((res) => res.json())
    .then((data) => console.log(data));

    setTimeout(() => {
        // window.location.reload();
    }, 1500);
});

