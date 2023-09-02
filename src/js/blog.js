

import {$, $$, createElement} from "./utils.js"

let BASE_URL = "https://nest-blog.up.railway.app";

let id = localStorage.getItem('blog_id');

async function fetchBlog() {

    try {
        const response = await fetch(`${BASE_URL}/api/blog/${id}`);
        const result = await response.json();
        renderBlog(result)

    } catch (err) {
        console.log(err.message);
    } finally {
        $('.loader_wrapper').style.display = "none";
    }
}

fetchBlog()

function renderBlog(data){
    if(data){
        $('#blog_title').textContent = `${data?.title?.substring(0, 25)} . . .`
        $('#single-post_title').textContent = data?.title,
        $('#single-post_text').textContent = data?.body
    }
}


