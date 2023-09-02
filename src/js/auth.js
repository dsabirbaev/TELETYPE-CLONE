

let BASE_URL = "https://nest-blog.up.railway.app";


function signUp(data){
    return  fetch(`${BASE_URL}/api/user/signup`, {
        method: "POST",
        headers: {
            "Content-type" : "application/json",
        },
        body: JSON.stringify(data),
    })
}


function signIn(data){
    return  fetch(`${BASE_URL}/api/user/signin`, {
        method: "POST",
        headers: {
            "Content-type" : "application/json",
        },
        body: JSON.stringify(data),
    })
}





export {signIn, signUp}




