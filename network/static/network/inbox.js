let id_post_global = -1;
var rs = getComputedStyle(document.querySelector(":root"));

// var body = document.querySelector('.body');

document.addEventListener('DOMContentLoaded', function(){

    
    let url=window.location.pathname;
    newurl = url.split('/');
    // alert(newurl[2])
    if(newurl[2] != "%20"){
        // alert("pepin")
        load_postbox('search bar',null)
    }
    else
        document.querySelector("#lookup-form").style.display = "none";
    // if(document.querySelector('#new_post_view')){
        // document.querySelector('#new_post_view').style.display = 'none';
    // }
    if(document.querySelector('#new_post'))
        document.querySelector('#new_post').addEventListener('click', () => load_postbox('new post',null));
    if(document.querySelector('#nav-search'))
        document.querySelector('#nav-search').addEventListener('click', () => load_postbox('search bar',null));
    if(document.querySelector('#all_posts_view')){
        // alert("entrando");
        document.querySelector('#all_posts_view').style.display = 'block';
        document.querySelector('#edit_profile_view').style.display = 'none';
        document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--green-color");
        if(document.querySelector('#nav-liked-posts svg path'))
            document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--black-logo");
        if(document.querySelector('#nav-following svg path'))
            document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--black-logo");
        // document.querySelector('#nav-search svg path').style.fill = rs.getPropertyValue("--black-logo");

    }
    // var url = window.location.href;
    // var c = url.searchParams.get("c");
    // console.log(url.pathname);
    // console.log(window.location.pathname);
    var pathArray = window.location.pathname.split('/');
    // console.log(pathArray[1]);
    if(pathArray[1] == "following"){
        document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--yellow-color");
        document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--black-logo");
        document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--black-logo");
        // document.querySelector('#nav-search svg path').style.fill = rs.getPropertyValue("--black-logo");
    }
    else if(pathArray[1] == "liked_posts"){
        document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--pink-color");
        document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--black-logo");
        document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--black-logo");
        // document.querySelector('#nav-search svg path').style.fill = rs.getPropertyValue("--black-logo");
    }
    else if(pathArray[1] == "profile"){
        document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--black-color");
        document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--black-logo");
        document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--black-logo");
    }
    // console.log(document.querySelector('#nav-following'))

    
    // const image_input = document.querySelector("#change_profile_picture");
    // image_input.addEventListener("change", function() {
    //     const reader = new FileReader();
    //     reader.addEventListener("load", () => {
    //         const uploaded_image = reader.result;
    //         document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
    //     });
    //     reader.readAsDataURL(this.files[0]);
    // });    
    const image_input = document.querySelector("#change_profile_picture");
    image_input.addEventListener("change", function(e) {
        if (e.target.files) {
            let imageFile = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement("img");
                img.onload = function (event) {
                    // Dynamically create a canvas element
                    var canvas = document.createElement("canvas");

                    // var canvas = document.getElementById("canvas");
                    var ctx = canvas.getContext("2d");

                    // Actual resizing
                    ctx.drawImage(img, 0, 0, 300, 160);

                    // Show resized image in preview element
                    var dataurl = canvas.toDataURL(imageFile.type);
                    document.getElementById("display-image").src = dataurl;
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(imageFile);
            document.getElementById("no_profile_picture_background").style.display="none";
            document.getElementById("display-image").style.opacity=1;
            // document.getElementById("display-image").style.removeProperty("background-color");
            
            // console.log("quepasasa")

        }

    });


    
      
    //   const p = document.querySelector('p')
      
    //   for (let i = 1; i <= 100; i++) {
    //     const p = document.createElement('p')
    //     p.textContent = i
    //     div.appendChild(p)
    //   }
      
    //   console.log(scrollbarVisible(p))
      console.log(scrollbarVisible(document.querySelector('.body')))



})
function load_postbox(postbox, user_log){
    if(postbox === 'new post'){
        if(document.querySelector('#new_post_view')){
            // alert(`first alert: ` + document.querySelector('.modal').style.display);
            if(document.querySelector('.modal').style.display === 'block'){
            // if(document.querySelector('.modal').style.opacity == 1){
                document.querySelector('#new_post_view').style.display = 'none';
                document.querySelector('.modal').style.display = 'none';
                unLockScroll();
                // document.querySelector('.modal').style.opacity = 0;
            }
            else{
                // alert(`second alert: ` + document.querySelector('.modal').style.display);
                document.querySelector('.modal').style.display = 'block';
                // document.querySelector('.modal').style.opacity = 1;
                document.querySelector('#new_post_view').style.display = 'block';
                document.querySelector('body').style.overflowy = 'hidden';
                lockScroll()
            }
            // alert(`third alert: ` + document.querySelector('.modal').style.display);
            document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--black-logo");
            document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--black-logo");
            document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--black-logo");
            document.querySelector('#nav-search svg path').style.fill = rs.getPropertyValue("--black-logo");
            // alert("dalechango");
        }
        // document.querySelector('.cover').style.display="block";
        
        // const post = document.createElement('div');
    // document.querySelector('#new_post_view').innerHTML =`<a href="#close" class="modal-close" onclick="unLockScroll();">
    //                 <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                     <g clip-path="url(#clip0_57083_1326)">
    //                     <path d="M27.1875 -0.125H2.8125C1.25977 -0.125 0 1.13477 0 2.6875V23.3125C0 24.8652 1.25977 26.125 2.8125 26.125H27.1875C28.7402 26.125 30 24.8652 30 23.3125V2.6875C30 1.13477 28.7402 -0.125 27.1875 -0.125ZM22.2891 16.8965C22.5703 17.1777 22.5703 17.6348 22.2891 17.916L19.916 20.2891C19.6348 20.5703 19.1777 20.5703 18.8965 20.2891L15 16.3574L11.1035 20.2891C10.8223 20.5703 10.3652 20.5703 10.084 20.2891L7.71094 17.916C7.42969 17.6348 7.42969 17.1777 7.71094 16.8965L11.6426 13L7.71094 9.10352C7.42969 8.82227 7.42969 8.36524 7.71094 8.08399L10.084 5.71094C10.3652 5.42969 10.8223 5.42969 11.1035 5.71094L15 9.64258L18.8965 5.71094C19.1777 5.42969 19.6348 5.42969 19.916 5.71094L22.2891 8.08399C22.5703 8.36524 22.5703 8.82227 22.2891 9.10352L18.3574 13L22.2891 16.8965Z" fill="#D90062"/>
    //                     </g>
    //                     <rect x="0.25" y="0.25" width="29.5" height="25.5" rx="2.75" stroke="black" stroke-width="0.5"/>
    //                     <defs>
    //                     <clipPath id="clip0_57083_1326">
    //                     <rect width="30" height="26" rx="3" fill="white"/>
    //                     </clipPath>
    //                     </defs>
    //                 </svg>
    //             </a>
    //             <h5>${postbox.charAt(0).toUpperCase() + postbox.slice(1,4) + postbox.charAt(4).toUpperCase() + postbox.slice(5) }</h5>
    //                 <form id="compose-form">
    //                     <textarea class="form-control" id="compose-body" ></textarea>
    //                     <input id="send_post" type="submit" class="page_button"/>
    //                 </form>`;
        document.getElementById("compose-body").focus();
        document.querySelector('form').onsubmit = () => {
            // alert("holise")
            var descrip = document.querySelector('#compose-body').value;
            fetch('/posts', {
                method: 'POST',
                body: JSON.stringify({
                    description: descrip
                })
            })
            .then(response => response.json())
            .then(result => {
                load_postbox('all posts', result.user_log);
            });
            return false;
       };

       


    }
    if(postbox === 'search bar'){

        console.log(document.querySelector('#nav-following svg path').style.fill)
        console.log(document.querySelector('#nav-liked-posts svg path').style.fill)
        console.log(document.querySelector('#nav-home svg path').style.fill)
        let url=window.location.pathname;
        newurl = url.split('/');
        // newurl[2] = datos_buscados;
        console.log(newurl[2])
  

        if(document.getElementById('lookup-form').style.display === 'none' || newurl[2] != "%20"){
            if (newurl[2] != "%20"){
                document.getElementById("search").value=newurl[2];
            }
            
            document.getElementById('lookup-form').style.display = 'block';
            document.querySelector(".search-text").focus();
            document.querySelector('#nav-search svg path').style.fill = rs.getPropertyValue("--blue-color");
            // document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--black-logo");
            // document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--black-logo");
            // document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--black-logo");
      
            // Searching
            // Search by pressing enter
            document.getElementById("lookup-form").onsubmit = "searching";
            // Clean search when the input is empty (when press the x too)
            // document.getElementById("search").addEventListener("input", (e) => {
            //     if (e.currentTarget.value == "") searching();
            // });
            // Search by clicking the magnifying glass icon
            document.querySelector("#submitSearch").addEventListener("click", searching);

        }
        else{
            document.getElementById('lookup-form').style.display = 'none';
            document.querySelector('#nav-search svg path').style.fill = rs.getPropertyValue("--black-color");



        }

    }
    if(postbox === 'all posts'){
        window.location.pathname="";
        // document.querySelector('#new_post_view').style.display = 'none';
        if(document.querySelector('#profile_view')){
            document.querySelector('#profile_view').style.display = 'none';
        }
        let div_all_posts_view = document.querySelector('#all_posts_view')
        div_all_posts_view.style.display = 'block';
        // document.querySelector('.cover').style.display="none";
        pages(user_log, 0, 1)
        return false;
    }
    if(postbox === 'edit profile'){
        //  alert("kacepapa");
        if(document.querySelector('#edit_profile_view')){
            // alert("kacepapa2");
            if(document.querySelector('#alert_modal_message').style.display === "block"){
                document.querySelector('#edit_profile_view').style.display = 'none'
                document.querySelector('#alert_modal_message').style.display = "none";
            }
            // document.querySelector('#edit_profile_options').style.display = "none";
            // document.querySelector('#alert_modal_message').style.display = "block";
            if(document.querySelector('#edit_profile_view').style.display === 'block'){
                // alert("kacepapa3");
                document.querySelector('#edit_profile_view').style.display = 'none';
                // document.querySelector('.modal').style.opacity = 0;
                document.querySelector('.modal').style.display = 'none';
                
                document.querySelector('#edit_profile_view h5').innerHTML = 'Changes to be made: ';
                unLockScroll();
            }
            else{
                if(document.querySelector('#profile_view_picture').src){
                    document.querySelector('#display-image').src = document.querySelector('#profile_view_picture').src;
                }
                // console.log(document.querySelector('#display-image').src);
                document.querySelector('.modal').style.display = 'block';
                // console.log( document.querySelector('#new_post_view').style.display);
                document.querySelector('#new_post_view').style.display = 'none';
                // console.log( document.querySelector('#new_post_view').style.display);
                document.querySelector('#edit_profile_view').style.display = 'block';
                document.querySelector('#edit_profile_view #edit_close').style.display = 'block';
                document.querySelector('#edit_profile_options').style.display = "flex";
                document.querySelector('#edit_profile_view h5').innerHTML = 'Edit profile ';    
                // document.querySelector('.modal').style.opacity = 1;
                
                // document.querySelector('.modal').style.display = 'none';
                lockScroll();
            }
        }
        // document.querySelector('#edit_profile_view').innerHTML =`<h5>${postbox.charAt(0).toUpperCase() + postbox.slice(1,4) + postbox.charAt(4).toUpperCase() + postbox.slice(5) }</h5>
        // <form id="compose-form">
        //     <input class="form-control" id="username" type="text" name="username" placeholder="Username" autocomplete="off">
        //     <input class="form-control" id="emailsddress" type="email" name="emailsddress" placeholder="Email Address">
        //     <input class="form-control" id="password" type="password" name="password" placeholder="Password">
        //     <input class="form-control" id="confirmpassword" type="password" name="confirmpassword" placeholder="Confirm Password">
        //     <a class="form-control" >Change profile picture</a>
        //     <input id="send_post" type="submit" class="page_button"/>
        // </form>`;
        
        // alert("antes del function");
        document.querySelector('#username').focus();
        
        // document.querySelector('#change_profile_picture').addEventListener('click', () =>{
        //     alert("holse");
        // });
    //     document.querySelector('#edit_profile_form').onsubmit = () => {
    //         // alert("entrando al function");
    //         var username = document.querySelector('#username').value;
    //         var emailaddress = document.querySelector('#emailaddress').value;
    //         var password = document.querySelector('#password').value;
    //         var confirmpassword = document.querySelector('#confirmpassword').value;
    //         var change_profile_picture = document.querySelector('#change_profile_picture');
    //         // var change_profile_picture = 'C:/Users/rodri/Downloads/WhatsApp Image 2022-06-06 at 6.23.25 PM.jpeg'
            
    //         console.log("aquivamos");
    //         console.log(change_profile_picture);
    //         fetch('/edit_profile', {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 username: username,
    //                 emailaddress: emailaddress,
    //                 password: password,
    //                 confirmpassword: confirmpassword,
    //                 change_profile_picture: change_profile_picture,
    //             })
    //         })
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log(result);
    //             // alert("response");
    //             document.querySelector('#edit_profile_view').style.display = 'none';
    //             document.querySelector('#alert_modal_message h5').innerHTML = 'Holitas';
    //             if(result.message_username || result.message_emailaddress || result.message_password){
    //             document.querySelector('#alert_modal_message #messages').innerHTML = `${result.message_username}
    //                                                                             ${result.message_emailaddress}
    //                                                                             ${result.message_password}`;
    //             }
    //             else
    //                 document.querySelector('#alert_modal_message #messages').innerHTML = `No changes`;

    //             document.querySelector('#alert_modal_message').style.display = 'block';
    //             document.querySelector('#ok_message').addEventListener('click', () =>location.reload());
    //             // load_postbox('all posts', result.user_log);
    //             // window.location.href = 'profile/16';
    //             // location.reload();
    //         });
    //         return false;
    //    };
    }
}


function edit_field(id_post){
    const textarea = document.querySelector(`#edit-box-${id_post}`);
    // actual_display = document.querySelector(`#edit-box-${id_post}`).style.display;
    actual_display = textarea.style.display;
    if( actual_display == 'none'){
        new_display = 'block';
        setTimeout(function() {
            const end = textarea.value.length;
            textarea.setSelectionRange(end,end);
            textarea.focus();
        }, 0);
    }else{
        new_display = 'none';
    }
    document.querySelector(`#edit-box-${id_post}`).style.display = new_display;
    document.querySelector(`#edit-save-btn-${id_post}`).style.display = new_display;
    if(id_post_global != id_post && id_post_global > 0 ){
        document.querySelector(`#edit-box-${id_post_global}`).style.display = 'none';
        document.querySelector(`#edit-save-btn-${id_post_global}`).style.display = 'none';
    }
    
    id_post_global = id_post;
}
function save_edit(id_post){
    var edited_descrip = document.querySelector(`#edit-box-${id_post}`).value;
    fetch(`/edit`, {
        method: 'POST',
        body: JSON.stringify({
            id_post: id_post,
            description: edited_descrip,
        })
    })
    .then(response => response.json())
    .then(result => {
        document.querySelector(`#post-description-${ id_post }`).textContent = result.description;     
        edit_field(id_post)
    })
}
function like(id_post){
    user_like=document.querySelector(`#like-btn-${id_post}`);
    fetch(`/like/${id_post}`, {
        method: 'PUT',
        body: JSON.stringify({
            like_action:user_like.value
        })
    })
    .then(response => response.json())
    .then(result => {
        setTimeout(function(){ 
            document.querySelector(`#heart-img-${id_post}`).innerHTML = '';
            if(result.prev_status=="heart_empty"){
                // document.querySelector(`#heart-img-${id_post}`).src = "/static/network/images/heart_full.jpg";
                document.querySelector(`#heart-img-${id_post}`).innerHTML = '<path d="M33.6751 7.9851C32.7561 7.05963 31.6632 6.32493 30.4593 5.82324C29.2555 5.32155 27.9643 5.06277 26.6601 5.06177C24.1931 5.06217 21.8162 5.98889 20 7.65843C18.1841 5.98861 15.8071 5.06185 13.34 5.06177C12.0343 5.06313 10.7417 5.3227 9.53661 5.82555C8.33155 6.3284 7.23783 7.06459 6.31838 7.99177C2.39672 11.9301 2.39838 18.0901 6.32172 22.0118L20 35.6901L33.6784 22.0118C37.6017 18.0901 37.6034 11.9301 33.6751 7.9851Z" fill="#DA2D57"/>';
                document.querySelector(`#like-btn-${id_post}`).value = "heart_full";
                document.querySelector(`#like-count-${id_post}`).firstChild.data = result.likers_array.length;
            }
            else{
                // document.querySelector(`#heart-img-${id_post}`).src = "/static/network/images/heart_empty.jpg";
                document.querySelector(`#heart-img-${id_post}`).innerHTML = '<path d="M20 7.65843C18.1841 5.98861 15.8071 5.06185 13.34 5.06177C12.0343 5.06313 10.7417 5.3227 9.53661 5.82555C8.33155 6.3284 7.23783 7.06459 6.31838 7.99177C2.39672 11.9301 2.39838 18.0901 6.32172 22.0118L18.5417 34.2318C18.825 34.7301 19.3717 35.0518 20 35.0518C20.258 35.0493 20.5119 34.9863 20.7411 34.8679C20.9704 34.7495 21.1686 34.579 21.32 34.3701L33.6784 22.0118C37.6017 18.0884 37.6017 11.9301 33.675 7.9851C32.7561 7.05963 31.6632 6.32493 30.4593 5.82324C29.2555 5.32155 27.9643 5.06277 26.66 5.06177C24.1931 5.06217 21.8162 5.98889 20 7.65843ZM31.3184 10.3418C33.9234 12.9601 33.925 17.0501 31.3217 19.6551L20 30.9768L8.67838 19.6551C6.07505 17.0501 6.07672 12.9601 8.67505 10.3484C9.94172 9.08843 11.5984 8.3951 13.34 8.3951C15.0817 8.3951 16.7317 9.08843 17.9884 10.3451L18.8217 11.1784C18.9764 11.3333 19.16 11.4562 19.3622 11.5401C19.5644 11.6239 19.7812 11.6671 20 11.6671C20.2189 11.6671 20.4357 11.6239 20.6379 11.5401C20.8401 11.4562 21.0237 11.3333 21.1784 11.1784L22.0117 10.3451C24.5317 7.8301 28.8017 7.83677 31.3184 10.3418Z" fill="#3D3D3D"/>';
                document.querySelector(`#like-btn-${id_post}`).value = "heart_empty";
                document.querySelector(`#like-count-${id_post}`).firstChild.data = result.likers_array.length;
            }
         }, 200);
    });
}
function follow(id_poster, user_log, followed_by2){
    user_following=document.querySelector(`#follow-btn`);
    fetch(`/follow/${id_poster}`, {
        method: 'PUT',
        body: JSON.stringify({
            follower: user_log,
            follow_action:user_following.value 

        })
    })
    .then(response => response.json())
    .then(result => {
        if(user_following.value == "Follow"){
            user_following.firstChild.data = "Unfollow";
            user_following.value = "Unfollow";
            sum = parseInt(document.querySelector(`#profile_followers_count`).firstChild.data) + 1;
            document.querySelector(`#profile_followers_count`).firstChild.data = sum;   
        }
        else{
            user_following.firstChild.data = "Follow";
            user_following.value= "Follow";
            rest = parseInt(document.querySelector(`#profile_followers_count`).firstChild.data) - 1;
            document.querySelector(`#profile_followers_count`).firstChild.data = rest;
        }
    });
}

function pages(user_log, next_page, jump_page){
    // alert(next_page)
    // alert(jump_page)
    next_page = parseInt(next_page) + parseInt(jump_page);
// alert(next_page)
    // window.location.href = 'http://www.google.com';
    let url=window.location.pathname;
    // console.log(url.split)
    newurl = url.split('/').slice(0,-1).join('/')+'/'+next_page;
    window.location.href = newurl;

    // fetch(`/postsbox/1/jump_page=${next_page}`, {
    //     method: 'GET',
    //     body: JSON.stringify({
    //         description: descrip
    //     })
    // })
    // .then(response => response.json())
    // .then(result => {
    //     load_postbox('all posts', result.user_log);
    // });
    // return false;

}
// function pages_prev(user_log, prev_page, next_page){
//     console.log("entra aca papapapa")
//     prev_page = parseInt(prev_page);
//     next_page = parseInt(next_page);
//     var clean = document.getElementById(`page_${prev_page}`);
//     if(clean)
//         clean.remove();
//     start_post = ( next_page ) * 10;
//     end_post = start_post + 11;
//     let url=window.location.pathname;
//     let id_poster = url.split("/");
//     url = url.substring(0,7);
//     fetch(`/pagesposts?start=${start_post}&end=${end_post}&url=${url}&id_poster=${id_poster[2]}`, {
//         method: 'POST',
//         body: JSON.stringify({
//             start: start_post,
//             end: end_post,
//         })
//     })
//     .then(response => response.json())
//     .then(result => {
//         // console.log(result.all_posts_json)
        
//         console.log(result.user_color) 
//         console.log("ese deberia ser el array de los colores")
//         data_all_posts = JSON.parse(result.all_posts_json);
//         data_users_json = JSON.parse(result.all_users_json);
//         // console.log(all_posts_json)
//         console.log(data_all_posts)
//         // console.log(all_users_json)
//         console.log(data_users_json)
//         const posts = document.createElement("div");
//         posts.id=(`page_${next_page}`);
//         document.querySelector(`#all_posts_view`).append(posts);
//         var cont_posts = 0;
//         // console.log(data_all_posts);
//         for (var data_post of data_all_posts) {
//             if(cont_posts < 10){
//                 // var newArray = homes.filter(function (el) {
//                 //     return el.price <= 1000 &&
//                 //            el.sqft >= 500 &&
//                 //            el.num_of_beds >=2 &&
//                 //            el.num_of_baths >= 2.5;
//                 //   });
//                 // console.log(data_post.fields.poster);
                                
//                 var user_post = JSON.parse(result.all_users_json).filter(function (entry) {
//                     return entry.pk == data_post.fields.poster;
//                 });
//                 var date_added_string = data_post.fields.date_added;
//                 date_added_string = Date.parse(date_added_string);
//                 date = new Date(date_added_string ),
//                 datevalues = {
//                     anio : date.getFullYear(),
//                     mes_num : date.getMonth()+1,
//                     mes : date.toLocaleString('default', { month: 'short' }),
//                     dia : ('0'+date.getDate()).slice(-2),
//                     hora : date.getHours(),
//                     min :('0'+date.getMinutes()).slice(-2),
//                     seg : date.getSeconds()
//                 };
//                 fecha = datevalues.mes + " " + datevalues.dia + ", " + datevalues.anio + ", " + datevalues.hora + ":" + datevalues.min;
//                 const post = document.createElement("div");
//                 post.className=("border border-secondary rounded p-3 mt-2");
//                 post.id=("posts_style");

                
//                 console.log(data_post);
        
//                 //  if post.poster.header_image 
//                 //     <img class="posts_profile_picture" alt="Image not found" src="/media/{{ post.poster.header_image }}">
//                 // else 
//                 //     <div class="no_profile_picture">
//                 //         <svg id="dropbtn-profile" class="no_profile_picture_circle" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 //             <path id="dropbtn-profile" d="M40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.9543 8.95431 0 20 0C31.0457 0 40 8.9543 40 20Z" fill="#{{user_color|keyvalue:post.poster.id}}"/>
//                 //         </svg>
//                 //         <div  class="no_profile_picture_letter">
//                 //             {{ post.poster|make_list|first|capfirst }}
//                 //         </div>
//                 //     </div>


//                 post_string = `  <!--div id="post-${data_post.pk}"> ${ data_post.pk } </div-->
//                                 <div id="posts-flex-order">
//                                     <div id="posts-flex-order-child1">
//                                         <svg id="dropbtn-profile" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path id="dropbtn-profile" d="M40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.9543 8.95431 0 20 0C31.0457 0 40 8.9543 40 20Z" fill="#00BAAF"/>
//                                             <path id="dropbtn-profile" d="M10.42 25V14.35H14.83C15.29 14.35 15.71 14.445 16.09 14.635C16.48 14.825 16.815 15.085 17.095 15.415C17.375 15.735 17.595 16.095 17.755 16.495C17.915 16.885 17.995 17.285 17.995 17.695C17.995 18.275 17.865 18.825 17.605 19.345C17.355 19.855 17 20.27 16.54 20.59C16.08 20.91 15.54 21.07 14.92 21.07H11.47V25H10.42ZM11.47 20.14H14.875C15.295 20.14 15.66 20.025 15.97 19.795C16.28 19.565 16.52 19.265 16.69 18.895C16.86 18.525 16.945 18.125 16.945 17.695C16.945 17.255 16.845 16.85 16.645 16.48C16.445 16.11 16.18 15.82 15.85 15.61C15.53 15.39 15.175 15.28 14.785 15.28H11.47V20.14ZM19.541 25V17.185H20.561V25H19.541ZM19.541 15.55V14.05H20.561V15.55H19.541ZM26.1976 25.15C25.6276 25.15 25.1026 25.045 24.6226 24.835C24.1526 24.615 23.7376 24.315 23.3776 23.935C23.0276 23.555 22.7526 23.12 22.5526 22.63C22.3626 22.14 22.2676 21.62 22.2676 21.07C22.2676 20.33 22.4326 19.655 22.7626 19.045C23.0926 18.435 23.5526 17.95 24.1426 17.59C24.7326 17.23 25.4126 17.05 26.1826 17.05C26.9126 17.05 27.5576 17.22 28.1176 17.56C28.6776 17.89 29.0926 18.34 29.3626 18.91L28.3726 19.225C28.1526 18.825 27.8426 18.515 27.4426 18.295C27.0526 18.065 26.6176 17.95 26.1376 17.95C25.6176 17.95 25.1426 18.085 24.7126 18.355C24.2826 18.625 23.9376 18.995 23.6776 19.465C23.4276 19.935 23.3026 20.47 23.3026 21.07C23.3026 21.66 23.4326 22.195 23.6926 22.675C23.9526 23.155 24.2976 23.54 24.7276 23.83C25.1576 24.11 25.6326 24.25 26.1526 24.25C26.4926 24.25 26.8176 24.19 27.1276 24.07C27.4476 23.95 27.7226 23.79 27.9526 23.59C28.1926 23.38 28.3526 23.155 28.4326 22.915L29.4376 23.215C29.2976 23.585 29.0626 23.92 28.7326 24.22C28.4126 24.51 28.0326 24.74 27.5926 24.91C27.1626 25.07 26.6976 25.15 26.1976 25.15Z" fill="white"/>
//                                         </svg>
//                                     </div>
//                                     <div id="posts-flex-order-child2">
//                                         <div id="posts-first-line">
//                                             <a id="profile"  href="/profile/${ data_post.fields.poster }">${ user_post[0].fields.username }</a>
//                                             <div id="post-${ fecha }" class="date_post"> ${ fecha }</div>
//                                         </div>
//                                         <div id="post-description-${ data_post.pk }"> ${ data_post.fields.description } </div>`;
//                 if( data_post.fields.poster == user_log  ){
//                     post_string += `    <div id="edit" onclick="edit_field('${ data_post.pk }')">Edit</div>`;
//                 }
//                 post_string += `        <textarea class="form-control mb-2" id="edit-box-${data_post.pk}" name="edit-box" style="display:none;">${ data_post.fields.description }</textarea>
//                                         <div id="edit-btns">
//                                             <button id="edit-save-btn-${data_post.pk}" class="page_button" style="display:none;" onclick="save_edit('${data_post.pk}')">Save</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div id="like_complete">    
//                                 <!--button class="btn mr-1 d-inline-block" style="background-color:white; border-color: red;" id="like-btn-${data_post.pk}" onclick="like('${data_post.pk}')"></button-->   
//                                 <!--div id="like-count-${data_post.pk}" class="d-inline-block">${data_post.fields.likes}</div-->`;
//                 if( result.all_likers_id[cont_posts].includes(parseInt(user_log))){
//                     // like_icon = "heart_full";
//                     like_svg = `<button class="yes_button" id="like-btn-{{post.id}}" value="heart_full" onclick="like('{{ post.id }}')">
//                                     <svg id="heart-img-{{ post.id }}" alt="jacket" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                         <path d="M33.6751 7.9851C32.7561 7.05963 31.6632 6.32493 30.4593 5.82324C29.2555 5.32155 27.9643 5.06277 26.6601 5.06177C24.1931 5.06217 21.8162 5.98889 20 7.65843C18.1841 5.98861 15.8071 5.06185 13.34 5.06177C12.0343 5.06313 10.7417 5.3227 9.53661 5.82555C8.33155 6.3284 7.23783 7.06459 6.31838 7.99177C2.39672 11.9301 2.39838 18.0901 6.32172 22.0118L20 35.6901L33.6784 22.0118C37.6017 18.0901 37.6034 11.9301 33.6751 7.9851Z" fill="#DA2D57"/>
//                                     </svg>
//                                  </button>`
//                 }else{
//                     // like_icon = "heart_empty";
//                     like_svg = `<button class="yes_button" id="like-btn-{{post.id}}" value="heart_empty"  onclick="like('{{ post.id }}')">
//                                     <svg id="heart-img-{{ post.id }}" alt="jacket" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                         <path d="M20 7.65843C18.1841 5.98861 15.8071 5.06185 13.34 5.06177C12.0343 5.06313 10.7417 5.3227 9.53661 5.82555C8.33155 6.3284 7.23783 7.06459 6.31838 7.99177C2.39672 11.9301 2.39838 18.0901 6.32172 22.0118L18.5417 34.2318C18.825 34.7301 19.3717 35.0518 20 35.0518C20.258 35.0493 20.5119 34.9863 20.7411 34.8679C20.9704 34.7495 21.1686 34.579 21.32 34.3701L33.6784 22.0118C37.6017 18.0884 37.6017 11.9301 33.675 7.9851C32.7561 7.05963 31.6632 6.32493 30.4593 5.82324C29.2555 5.32155 27.9643 5.06277 26.66 5.06177C24.1931 5.06217 21.8162 5.98889 20 7.65843ZM31.3184 10.3418C33.9234 12.9601 33.925 17.0501 31.3217 19.6551L20 30.9768L8.67838 19.6551C6.07505 17.0501 6.07672 12.9601 8.67505 10.3484C9.94172 9.08843 11.5984 8.3951 13.34 8.3951C15.0817 8.3951 16.7317 9.08843 17.9884 10.3451L18.8217 11.1784C18.9764 11.3333 19.16 11.4562 19.3622 11.5401C19.5644 11.6239 19.7812 11.6671 20 11.6671C20.2189 11.6671 20.4357 11.6239 20.6379 11.5401C20.8401 11.4562 21.0237 11.3333 21.1784 11.1784L22.0117 10.3451C24.5317 7.8301 28.8017 7.83677 31.3184 10.3418Z" fill="#3D3D3D"/>
//                                     </svg>
//                                 </button>`
//                 }
//                 // post_string += `<button class="yes_button" id="like-btn-${data_post.pk}" value="${like_icon}" onclick="like(${data_post.pk})">
//                 //                     <img id="heart-img-${data_post.pk}" src="/static/network/images/${like_icon}.jpg" alt="like_image" width="25" >
//                 //                 </button>   
//                 //                 <div id="like-count-${data_post.pk}" class="d-inline-block">${result.all_likers_id[cont_posts].length} </div> likes`;
                
//                 post_string += `${like_svg}  
//                                 <div id="like-count-${data_post.pk}" class="d-inline-block">${result.all_likers_id[cont_posts].length} </div> likes`;
//                 post.innerHTML = post_string;
//                 document.querySelector(`#page_${next_page}`).append(post);
//             }
//             cont_posts++;   
//         }
//         var page_buttons = document.createElement("div");
//         page_buttons.id=("id_page_buttons");
//         post_buttons = "";
//         if(next_page!=0){
//             prev_button_next_page =  next_page - 1;
//             post_buttons = `  <button class="page_button" onclick="pages('${ user_log }', ${next_page}, ${prev_button_next_page})">Prev page</button>   `;
//         }
//         for(i_page in result.list_total_pages){
//             page = result.list_total_pages[i_page];
//             if(page == next_page+1){
//                 // post_buttons += `  <button id="selected_button" class="no-button">${page}</button>   `;
//                 post_buttons += `  <button id="selected_button" class="page_button" >${page}</button>   `;
                        
//             }else{
//                 post_buttons += `  <button class="page_button" id="not_selected_button" onclick="pages('${ user_log }', ${next_page}, ${page}-1)">${page}</button>   `;    
//             }
//         }
//         if(cont_posts==11){
//             next_button_next_page=  next_page + 1;
//             post_buttons += `  <button class="page_button" onclick="pages('${ user_log }', ${next_page}, ${next_button_next_page})">Next page</button>   `;
//         }
//         page_buttons.innerHTML = post_buttons;
//         document.querySelector(`#page_${next_page}`).append(page_buttons);
//     });
//     // setTimeout(function(){ 
//         console.log(scrollbarVisible(document.querySelector('.body')));
//             //  }, 5000);
    
//     return false;
// }
// function close_cover(){
//     document.querySelector('.cover').style.display="none";
//     // document.querySelector('#new_post_view').style.display = 'none';
// }

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
var cont=0;
window.onclick = function(event) {
    console.log(event.target);
    
    // if (cont==1) { 
    // debugger;
    // }
    // cont=1;
    // setTimeout(alert(event.target),50000);
    // if (!event.target.matches('.dropbtn')) {
    if (event.target.matches('#open_profile')) {
        // console.log(document.querySelector(`#open_profile`));
        // alert("peditos");

        // fetch('/profile/1', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         description: "descrip"
        //     })
        // })
        // .then(response => response.json())
        // .then(result => {
        //     load_postbox('all posts', result.user_log);
        // });
        // return false;


    }
    else if(event.target.matches('#log_out')){
        // alert("kquita");
    }

    if (!event.target.matches('#dropbtn-profile') && 
        !event.target.matches('#profile_letter')&& 
        !event.target.matches('#profile_img')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }

    }
}
   
function close_window(){
    // alert("tre");
    unLockScroll();
    document.querySelector('#new_post_view').style.display = 'none';
    document.querySelector('#edit_profile_view').style.display = 'none';
    document.querySelector('.modal').style.display = 'none';
    // document.querySelector('#edit_profile_options').style.display = "block";
    document.querySelector('#alert_modal_message').style.display = "none";

    // alert(document.querySelector("#username").value);
    document.querySelector("#username").value = null;
    // alert(document.querySelector("#username").value);
    document.querySelector("#emailaddress").value = null;
    document.querySelector("#password").value = null;
    document.querySelector("#change_profile_picture").value = null;

    document.getElementById("no_profile_picture_background").style.display="block";
    document.getElementById("display-image").style.opacity=0;

}

function lockScroll() {
    // document.querySelector('#new_post_view').style.display = 'block';
    // document.querySelector('.modal').style.display = 'block';
    document.body.classList.add("lock-scroll");
    document.body.classList.remove("un-lock-scroll");
    // alert("lockScroll");
    // document.querySelector("html").style.marginRight = "17px";
    // document.querySelector(".logo").style.paddingRight = "17px";
    // document.getElementById("navbar").style.paddingRight = "17px";
    // document.getElementById("new_post").style.paddingRight = "17px";
}
function unLockScroll() {
        
    // document.querySelector('#new_post_view').style.display = 'none';
    // document.querySelector('.modal').style.display = 'none';
    document.body.classList.remove("lock-scroll");
    document.body.classList.add("un-lock-scroll");
    // alert("unLockScroll");
    // document.querySelector("html").style.marginRight = "0px";
    // document.querySelector(".logo").style.paddingRight = "0px";
    // document.getElementById("navbar").style.paddingRight = "0px";
    // document.getElementById("new_post").style.paddingRight = "0px";
}




// function showFile(ths){
//     console.log("pepito");
//     console.log(ths.value);
//     console.log(ths.files.name);
//     console.log(ths.files[0].name);
//     console.log(ths.files);
//     console.log(ths.files[0]);
//     console.log(ths.files[0].pathname);
//     console.log(ths.pathname);
    
//     // document.querySelector("#edit_profile_form #profile_img").src = ths.files[0].name;
//     // document.querySelector("#edit_profile_form #profile_img").src = "C:/Users/rodri/Downloads/logo1.png";



//     setTimeout(function(){
//         console.log("retrasando")
//      }, 5000);


    
    
    
//     console.log("pepin");
    
//     // document.querySelector('#profile_img').src=ths.value;

//     // fetch('/pre_edit_profile', {
//     //     method: 'PUT',
//     //     body: JSON.stringify({
//     //         src: ths.files[0].name,
//     //     })
//     // })
//     // .then(response => response.json())
//     // .then(result => {
//     //     console.log(result);
    
//     // });
//     // return false;


//     // document.querySelector('#change_profile_picture').value.style.visibility="visible";
//     // document.querySelector('div .image_selected').innerHTML=ths.value;
//     // document.querySelector('#image_selected').src=ths.value;
//     // document.querySelector('#change_profile_picture').style.width="auto";
//     // document.querySelector('#change_profile_picture').style.height="auto";
// }

function openOkMessage(ths){
    // console.log("openOkMessage");
    console.log(ths.value);
    document.querySelector('#edit_profile_options').style.display = "none";
    document.querySelector('#alert_modal_message').style.display = "block";
    document.querySelector("#alert_modal_message").style.margin = "0";
    
    // document.querySelector('#alert_modal_message h5').innerHTML = 'You are ';
    // document.querySelector('#edit_profile_view #edit_close').style.display = 'none';
    
    let n = 0;
    let message = "";
    document.querySelector('#edit_profile_view h5').innerHTML = 'Changes to be made:';

    if(document.querySelector("#username").value){
        message += "- Username.<br>";
        // message += document.querySelector("#username").value;
    }
    if(document.querySelector("#emailaddress").value){
        message += "- Email Address<br>";
    }
    if(document.querySelector("#password").value){
        message += "- Password<br>";
    }
    if(document.querySelector("#change_profile_picture").value){
        message += "- Picture";
    }
    
    // console.log(message_username);
    // console.log(message_emailaddress);
    // console.log(message_password);
    console.log(message);
    if (message){
        document.querySelector("#alert_modal_message #messages").innerHTML = message;
    }
    else{
        // document.querySelector('#edit_profile_view h5').innerHTML = 'No changes';
        document.querySelector("#alert_modal_message #messages").innerHTML = 'No changes';
    }


    // if(message_username || message_emailaddress || message_password){
    // document.querySelector('#alert_modal_message #messages').innerHTML = `${message_username}
    //                                                                 ${message_emailaddress}
    //                                                                 ${message_password}`;
    // }
    // else
    //     document.querySelector('#alert_modal_message #messages').innerHTML = `No changes`;
}


const scrollbarVisible = (element) => {

    // console.log(element.scrollHeight);
    // console.log(window.innerWidth);
    // return element.scrollHeight > element.clientHeight;
    return element.scrollHeight > window.innerWidth;
    // return element.scrollHeight 
};




      



// The function Search
function searching() {
    datos_buscados = document.getElementById("search").value.toLowerCase();
    
    let url=window.location.pathname;
    newurl = url.split('/');

    // const post = document.querySelectorAll("#email");
    if (datos_buscados.length != 0 || newurl[2] != "%20"){
        if(datos_buscados.length == 0){
            datos_buscados = " ";
            alert("entra a los dos ifs")
        }
        
        //   datos_buscados=" ";
        newurl[2] = datos_buscados;
        newurl = newurl.join('/');
        window.location.href = newurl;

    }
    

  
  
    // return false;
  }