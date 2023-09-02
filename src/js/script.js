

import {$, $$, createElement} from "./utils.js"
import {signIn, signUp} from "./auth.js"

let BASE_URL = "https://nest-blog.up.railway.app";

$$('.change-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        localStorage.setItem('tabNumber', index);
        showContent(index)
    })
    
})

//////////// tab activation actions  ////////////////

function hideContent(){
    $$('.tab-item').forEach(tab => {
        tab.style.display = "none";
    })
}



function showContent(index){
    hideContent()
    $$('.tab-item')[index].style.display = "block";
}


hideContent()
showContent(localStorage.getItem("tabNumber") || 1)



//////////// Modal actions ///////////////



$('#openModal').addEventListener('click', () => {
    $('.modal-wrapper').classList.add('grid');
    $('.modal-wrapper').classList.remove('hidden');
    document.body.style.cssText = "overflow: hidden;" 
})

$('#closeModal').addEventListener('click', () => {
    $('.modal-wrapper').classList.add('hidden');
    $('.modal-wrapper').classList.remove('grid');
    document.body.style.cssText = "overflow: avto;" 
})


$('#add_btn').addEventListener('click', () => {
    $('.modal-wrapper').classList.add('grid');
    $('.modal-wrapper').classList.remove('hidden');
    document.body.style.cssText = "overflow: hidden;" 
})



///////////////////// Authorization  actions  ////////////////////

$("#signup").addEventListener("click", (e) => {
    e.preventDefault();

    const signUpForm = {
        full_name: $("#full_name").value,
        password: $("#password").value,
        username: $("#user_name").value,
    };

    if ($("#confirm_password").value.trim() === signUpForm.password.trim()) {
        $("#password").classList.add("border", "border-2", "border-green-500");
        $("#confirm_password").classList.add("border", "border-2", "border-green-500");

        signUp(signUpForm)
        .then((response) => response.json())
        .then((result) => {
            if (result.statusCode == "400") {
                alert(result.message);
            } else {
                alert("Success!");
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    } else {
        $("#password").classList.add("border", "border-2", "border-red-500");
        $("#confirm_password").classList.add("border", "border-2", "border-red-500");
    }
});

$("#signin").addEventListener("click", (e) => {
    e.preventDefault();

    const signInForm = {
        password: $("#login_password").value,
        username: $("#login_user").value,
    };

    if (signInForm.password.trim().length === 0 || signInForm.username.trim().length === 0) {
        alert("Please enter your password or username");
        $("#login_password").classList.add("border", "border-2", "border-red-500");
        $("#login_user").classList.add("border", "border-2", "border-red-500");
    } else {
        signIn(signInForm)
        .then((response) => response.json())
        .then((result) => {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", result.user.id);
            localStorage.setItem("user_id", result.user.id);
            localStorage.setItem("username", result?.user?.full_name);

            window.location.href = "./profile.html";

            if (result.statusCode == "400") {
                
                $("#login_password").classList.add("border", "border-2", "border-red-500");
                $("#login_user").classList.add("border", "border-2", "border-red-500");
            } else {

                $("#login_password").classList.add("border", "border-2", "border-green-500");
                $("#login_user").classList.add("border", "border-2", "border-green-500");
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    }
});


////////////////////////// Auth check //////////////////

function authCeck(){
    if(localStorage.getItem("token")){
        $(".menu").classList.remove("hidden");
        $("#openModal").classList.add("hidden");
        $('#user_info').textContent = localStorage.getItem('username');
        
        $("#auth").classList.add("hidden");
        $("#addpost").classList.remove("hidden");
        $("#add_btn").classList.remove("hidden");
    }else {
        $(".menu").classList.add("hidden");
        $(".dropdown").classList.add("hidden");
        $("#openModal").classList.remove("hidden");

        $("#auth").classList.remove("hidden");
        $("#addpost").classList.add("hidden");
        $("#add_btn").classList.add("hidden");
    }
}

authCeck()

$('.menu').addEventListener('click', () => {
    $('.dropdown').classList.toggle('hidden');
})


$('#logout').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
})


////////////////////// Blog post ///////////////

function addPost(){
    const newBlog = {
        title: $("#blog_title").value,
        body: $("#blog_text").value,
        user_id: localStorage.getItem("user")
    }

   
    if(newBlog.title.trim().length === 0 || newBlog.body.trim().length === 0){
        alert("Please fill title and body!");
    }else{
        fetch(`${BASE_URL}/api/blog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(newBlog),
        })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err.message))
    }
}


$('#save').addEventListener('click', () => {
    addPost();
    $('.modal-wrapper').classList.add('hidden');
})



/////////////////// All blogs //////////////

$(".post_wrapper").innerHTML = "<div class='loader_wrapper'> <div class='spinner'></div> </div>";

async function getAllPosts() {
    try {
        const response = await fetch(`${BASE_URL}/api/blog`);
        const results = await response.json();
        if (results.length) {
            $(".post_wrapper").innerHTML = "";
            listRender(results);
        } else {
            $(".post_wrapper").innerHTML = "<h1>DATA NOT FOUND</h1>";
        }
    } catch (err) {
        
    } finally {
    
    }
}



function listRender(state) {
  
    if (state.length) {
        state?.forEach((el) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                     <div class="post_item border relative shadow-md hover:shadow-xl duration-150 font-['inter'] rounded-lg p-4">
                          
                         
                            <h2 class="post__title text-3xl font-bold leading-[39px] mb-5 cursor-pointer" data-post-id="${el.id}">
                               ${el.title}
                            </h2>

                            <p class="post__text mb-[25.5px] leading-[25.5px] text-[17px] font-normal">
                                ${el.body?.substring(0, 256)} . . .
                            </p>

     
                            <a class="user hover:text-red-600 transition" href="./profile.html" target="_blank"   data-user="${el?.user?.id}">
                               <strong class="user mb-[10px] leading-[25.5px]" data-user="${el?.user?.id}"> ● ${el?.user?.full_name}</strong>
                            </a>

                            <div class="flex items-center gap-x-3 my-4">
                                <span>${el.createdAt.substring(0, 10)}</span>
                                <i class="bx bx-show"></i>
                                <span>${el.views}</span>
                            </div>
                        </div>
                `;
            $(".post_wrapper").append(card);
        });
    } else {
        $(".post_wrapper").innerHTML = `<h1 class='text-center'>${selector.toUpperCase()} NOT FOUND</h1>`;
    }
}



getAllPosts();


$(".post_wrapper").addEventListener("click", (e) => {
    if (e.target.classList.contains("user")) {
        
        let userId = e.target.getAttribute("data-user");
        localStorage.setItem("user", userId);
    }
});


// ------------- redirect to my blog -------------

$$(".user_id").forEach((item) => {
    item.addEventListener("click", () => {
        localStorage.setItem("user", localStorage.getItem("user_id"));
    });
});


///////////////////////  redirect to blog page ////////////////////

$('.post_wrapper').addEventListener('click', (e) => {
    if(e.target.classList.contains('post__title')){
        let idPost = e.target.getAttribute("data-post-id"); 
        localStorage.setItem('blog_id', idPost)
        window.location.href = "./blog.html"
    }
})

///////////////////// dark and mode  ///////////////

$('#dark_mode').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark')
    $('#dark').classList.toggle('bxs-moon')
    $('#dark').classList.toggle('bxs-sun')
    $('#dark').classList.toggle('text-white')
    $('.logo_svg').classList.toggle('logo-svg')
 
})



