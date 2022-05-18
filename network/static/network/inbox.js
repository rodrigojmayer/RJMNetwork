let id_post_global = -1;
var rs = getComputedStyle(document.querySelector(":root"));


document.addEventListener('DOMContentLoaded', function(){
    if(document.querySelector('#new_post_view')){
        document.querySelector('#new_post_view').style.display = 'none';
    }
    if(document.querySelector('#new_post'))
        document.querySelector('#new_post').addEventListener('click', () => load_postbox('new post',null));
    if(document.querySelector('#all_posts_view')){
        document.querySelector('#all_posts_view').style.display = 'block';
        document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--green-color");
        document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--black-logo");
        document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--black-logo");

    }
    // var url = window.location.href;
    // var c = url.searchParams.get("c");
    // console.log(url.pathname);
    console.log(window.location.pathname);
    if(window.location.pathname == "/following"){
        document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--yellow-color");
        document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--black-logo");
        document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--black-logo");
    }
    else if(window.location.pathname == "/liked_posts"){
        document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--pink-color");
        document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--black-logo");
        document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--black-logo");
        

    }
    // console.log(document.querySelector('#nav-following'))
})
function load_postbox(postbox, user_log){
    if(postbox === 'new post'){
        if(document.querySelector('#new_post_view')){
            document.querySelector('#new_post_view').style.display = 'block';
            document.querySelector('#nav-following svg path').style.fill = rs.getPropertyValue("--black-logo");
            document.querySelector('#nav-home svg path').style.fill = rs.getPropertyValue("--black-logo");
            document.querySelector('#nav-liked-posts svg path').style.fill = rs.getPropertyValue("--black-logo");
            // alert("dalechango");
        }
        document.querySelector('.cover').style.display="block";
        
        const post = document.createElement('div');
        document.querySelector('#new_post_view').innerHTML =`<h3>${postbox.charAt(0).toUpperCase() + postbox.slice(1,4) + postbox.charAt(4).toUpperCase() + postbox.slice(5) }</h3>
                        <form id="compose-form">
                            <textarea class="form-control" id="compose-body" ></textarea>
                            <input id="send_post" type="submit" class="page_button"/>
                        </form>`;
        document.getElementById("compose-body").focus();
        document.querySelector('form').onsubmit = () => {
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
    if(postbox === 'all posts'){
        window.location.pathname="";
        document.querySelector('#new_post_view').style.display = 'none';
        if(document.querySelector('#profile_view')){
            document.querySelector('#profile_view').style.display = 'none';
        }
        let div_all_posts_view = document.querySelector('#all_posts_view')
        div_all_posts_view.style.display = 'block';
        document.querySelector('.cover').style.display="none";
        pages(user_log, 0, 0)
        return false;
    }
}


function edit_field(id_post){
    actual_display = document.querySelector(`#edit-box-${id_post}`).style.display;
    if( actual_display == 'none'){
        new_display = 'block';
    }else{
        new_display = 'none';
    }
    document.querySelector(`#edit-box-${id_post}`).style.display = new_display;
    document.querySelector(`#edit-save-btn-${id_post}`).style.display = new_display;
    if(id_post_global != id_post && id_post_global > 0 ){
        document.querySelector(`#edit-box-${id_post_global}`).style.display = 'none';
        document.querySelector(`#edit-save-btn-${id_post_global}`).style.display = 'none';
    }id_post_global = id_post;
}
function save_edit(id_post){
    var edited_descrip = document.querySelector(`#edit-box-${id_post}`).value;
    fetch(`/edit`, {
        method: 'PUT',
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
            if(result.prev_status=="heart_empty"){
                document.querySelector(`#heart-img-${id_post}`).src = "/static/network/images/heart_full.jpg";
                document.querySelector(`#like-btn-${id_post}`).value = "heart_full";
                document.querySelector(`#like-count-${id_post}`).firstChild.data = result.likers_array.length;
            }
            else{
                document.querySelector(`#heart-img-${id_post}`).src = "/static/network/images/heart_empty.jpg";
                document.querySelector(`#like-btn-${id_post}`).value = "heart_empty";
                document.querySelector(`#like-count-${id_post}`).firstChild.data = result.likers_array.length;
            }
         }, 500);
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
function pages(user_log, prev_page, next_page){
    prev_page = parseInt(prev_page);
    next_page = parseInt(next_page);
    var clean = document.getElementById(`page_${prev_page}`);
    if(clean)
        clean.remove();
    start_post = ( next_page ) * 10;
    end_post = start_post + 11;
    let url=window.location.pathname;
    let id_poster = url.split("/");
    url = url.substring(0,7);
    fetch(`/pagesposts?start=${start_post}&end=${end_post}&url=${url}&id_poster=${id_poster[2]}`, {
        method: 'POST',
        body: JSON.stringify({
            start: start_post,
            end: end_post,
        })
    })
    .then(response => response.json())
    .then(result => {

        data_all_posts = JSON.parse(result.all_posts_json);
        data_users_json = JSON.parse(result.all_users_json);
        const posts = document.createElement("div");
        posts.id=(`page_${next_page}`);
        document.querySelector(`#all_posts_view`).append(posts);
        var cont_posts = 0;
        console.log(data_all_posts);
        for (var data_post of data_all_posts) {
            if(cont_posts < 10){
                var user_post = JSON.parse(result.F).filter(function (entry) {
                    return entry.pk == data_post.fields.poster;
                });
                var date_added_string = data_post.fields.date_added;
                date_added_string = Date.parse(date_added_string);
                date = new Date(date_added_string ),
                datevalues = {
                    anio : date.getFullYear(),
                    mes_num : date.getMonth()+1,
                    mes : date.toLocaleString('default', { month: 'short' }),
                    dia : ('0'+date.getDate()).slice(-2),
                    hora : date.getHours(),
                    min :('0'+date.getMinutes()).slice(-2),
                    seg : date.getSeconds()
                };
                fecha = datevalues.mes + " " + datevalues.dia + ", " + datevalues.anio + ", " + datevalues.hora + ":" + datevalues.min;
                const post = document.createElement("div");
                post.className=("border border-secondary rounded p-3 mt-2");
                post.id=("posts_style");
                post_string = `  <!--div id="post-${data_post.pk}"> ${ data_post.pk } </div-->
                                    <a id="profile"  href="/profile/${ data_post.fields.poster }">${ user_post[0].fields.username }</a>
                                    <div id="post-description-${ data_post.pk }"> ${ data_post.fields.description } </div>`;
                if( data_post.fields.poster == user_log  ){
                    post_string += `<div id="edit" onclick="edit_field('${ data_post.pk }')">Edit</div>`;
                }
                post_string += `    <textarea class="form-control mb-2" id="edit-box-${data_post.pk}" name="edit-box" style="display:none;">${ data_post.fields.description }</textarea>
                                    <div id="edit-btns">
                                        <button id="edit-save-btn-${data_post.pk}" class="page_button" style="display:none;" onclick="save_edit('${data_post.pk}')">Save</button>
                                    </div>
                                    <!--button class="btn mr-1 d-inline-block" style="background-color:white; border-color: red;" id="like-btn-${data_post.pk}" onclick="like('${data_post.pk}')"></button-->   
                                    <!--div id="like-count-${data_post.pk}" class="d-inline-block">${data_post.fields.likes}</div-->`;
                if( result.all_likers_id[cont_posts].includes(parseInt(user_log))){
                    like_icon = "heart_full";
                }else{
                    like_icon = "heart_empty";
                }
                post_string += `<button class="yes_button" id="like-btn-${data_post.pk}" value="${like_icon}" onclick="like(${data_post.pk})">
                                    <img id="heart-img-${data_post.pk}" src="/static/network/images/${like_icon}.jpg" alt="like_image" width="25" >
                                </button>   
                                <div id="like-count-${data_post.pk}" class="d-inline-block">${result.all_likers_id[cont_posts].length} </div> likes
                                <div id="post-${ fecha }" class="date_post"> ${ fecha }</div>`;
                post.innerHTML = post_string;
                document.querySelector(`#page_${next_page}`).append(post);
            }
            cont_posts++;   
        }
        var page_buttons = document.createElement("div");
        page_buttons.id=("id_page_buttons");
        post_buttons = "";
        if(next_page!=0){
            prev_button_next_page =  next_page - 1;
            post_buttons = `  <button class="page_button" onclick="pages('${ user_log }', ${next_page}, ${prev_button_next_page})">Prev page</button>   `;
        }
        for(i_page in result.list_total_pages){
            page = result.list_total_pages[i_page];
            if(page == next_page+1){
                post_buttons += `  <button id="selected_button" class="no-button">${page}</button>   `;
            }else{
                post_buttons += `  <button class="page_button" id="not_selected_button" onclick="pages('${ user_log }', ${next_page}, ${page}-1)">${page}</button>   `;    
            }
        }
        if(cont_posts==11){
            next_button_next_page=  next_page + 1;
            post_buttons += `  <button class="page_button" onclick="pages('${ user_log }', ${next_page}, ${next_button_next_page})">Next page</button>   `;
        }
        page_buttons.innerHTML = post_buttons;
        document.querySelector(`#page_${next_page}`).append(page_buttons);
    });
    return false;
}
function close_cover(){
    document.querySelector('.cover').style.display="none";
    document.querySelector('#new_post_view').style.display = 'none';
}

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
            alert("kquita");
        }

        if (!event.target.matches('#dropbtn-profile')) {
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