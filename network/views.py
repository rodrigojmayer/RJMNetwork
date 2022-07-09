import json, math
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
#from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from datetime import datetime
from django.db.models import Q
from array import array
from random import randrange
from django.core.files.uploadedfile import UploadedFile
from django.core.paginator import Paginator

import random

import time


from .models import User, NewPost, Followers, Likers


# @csrf_exempt
# @login_required
def postsbox(request, filter_view, user_id, jump_page):
    

    print("user_id")
    print(user_id)
    print("filter_view")
    print(filter_view)
    if(user_id == 0):
        user_id = request.user.id

    user_poster = User.objects.get(id=user_id)


    all_posts = NewPost.objects.select_related('poster')
    all_posts = all_posts.order_by("-date_added")
    followed_by = None
    followers = None
    user_following = None
    if request.user.id:
        if filter_view == "following":
            follows_filter=[]
            followers = Followers.objects.filter(follower=request.user.id)
            for each_followers_filter in followers:
                follows_filter.append(each_followers_filter.followed.id)
            all_posts=all_posts.filter(poster__in=follows_filter)

        elif filter_view == "liked_posts":
            likers_filter=[]
            likers = Likers.objects.filter(liker=request.user.id)
            for each_likers_filter in likers:
                likers_filter.append(each_likers_filter.post.id)
            all_posts = all_posts.filter(id__in=likers_filter)

        elif filter_view == "profile":
            # user_poster = User.objects.get(id=id_poster)
            try:
                followed_by = Followers.objects.filter(followed=user_id)
            except Followers.DoesNotExist:
                followed_by = None
        
            followers_obj = Followers.objects.filter(follower__id=user_id)
            followers=[]
            for follower in followers_obj:
                followers.append(follower.followed)

            all_posts = all_posts.filter(poster=user_id)
            user_id=int(user_id)
            
            user_following = followed_by.filter(follower__id=request.user.id)
            if(user_following):
                user_following="Unfollow"
            else:
                user_following="Follow"
    
    else:
        return render(request, "network/register.html")


    p = Paginator(all_posts, 10)
    list_total_pages = []
    for i in range(1, p.num_pages+1):
        list_total_pages.append(i)
    num_page = jump_page
    page = p.page(num_page)
    page_posts = page.object_list
    all_likers = Likers.objects.all()
    posters_id = []
    for post in page_posts:
        if post.poster.id not in posters_id:
            posters_id.append(post.poster.id)
        post.date_added = (post.date_added.strftime("%b %d, %Y, %H:%M"))
        post.number_likes=0
        likers = all_likers.filter(post=post.id)
        likers_id = []
        for each_liker in likers:
            post.likers = each_liker.liker.all()
            post.number_likes = each_liker.liker.count()
            for each in each_liker.liker.all():
                likers_id.append(each.id)
            post.likers_id = likers_id

    users=User.objects.filter(id__in=posters_id)
    user_color = {}
    colors_list = ["C37D7D", "FC792F", "4950F8", "EBFC2F", "15A2F1", "58FC2F", "36F9E1", "2ECF65", "B549F8", "FF83EB", "FCCF2F"]
    for j in users:
        user_color[j.id] = random.choice(colors_list)
        colors_list.remove(user_color[j.id])




    # return render(request, "network/index.html", {
    return render(request, "network/"+filter_view+".html", {
        "all_posts": page_posts,
        "users": users,
        "list_total_pages": list_total_pages,
        # "random_number": random_number,
        "user_color": user_color,
        "p_actual": num_page,
        "p_last": p.num_pages,
        "poster":user_poster,
        "followed_by":followed_by,
        "followers":followers,
        "user_following":user_following,
    })










def index(request):
    all_posts = NewPost.objects.select_related('poster')
    all_fields= NewPost._meta.fields
    users = User.objects.all()
    user_color = {}
    colors_list = ["C37D7D", "FC792F", "4950F8", "EBFC2F", "15A2F1", "58FC2F", "36F9E1", "2ECF65", "B549F8", "FF83EB", "FCCF2F"]
    for j in users:
        user_color[j.id] = random.choice(colors_list)
        colors_list.remove(user_color[j.id])
    # print(users)
    # print("estos son los campos - - - ")
    # print(all_fields)
    total_posts=all_posts.count()
    total_pages=math.ceil(total_posts/10)
    list_total_pages = []
    for i in range(2, total_pages+1):
        list_total_pages.append(i)
    all_posts = all_posts.order_by("-date_added")[:10]
    all_likers = Likers.objects.all()
    for post in all_posts:
        # print(post.poster)
        post.date_added = (post.date_added.strftime("%b %d, %Y, %H:%M"))
        post.number_likes=0
        likers = all_likers.filter(post=post.id)
        likers_id = []
        for each_liker in likers:
            post.likers = each_liker.liker.all()
            post.number_likes = each_liker.liker.count()
            for each in each_liker.liker.all():
                likers_id.append(each.id)
            post.likers_id = likers_id
        # print(post._meta.fields)
        # print(post.poster.id)
        # # print(users.objects.get(id=post.poster.id).randim)
        # user_color = users.objects.get(id=post.poster.id)
        # print(user_color.randim)

    random_number = randrange(100)
    return render(request, "network/index.html", {
        "all_posts": all_posts,
        "users": users,
        "list_total_pages":list_total_pages,
        "random_number":random_number,
        "user_color": user_color
    })




def following(request):

    if request.user.id:
        follows_filter=[]
        followers = Followers.objects.filter(follower=request.user.id)
        for each_followers_filter in followers:
            # print(each_followers_filter.followed.id)
            follows_filter.append(each_followers_filter.followed.id)
        all_posts = NewPost.objects.all()
        all_posts = all_posts.order_by("-date_added")
        all_posts2=all_posts.filter(poster__in=follows_filter)
        # print(follows_filter)
        # print("1--------------")
        # print(all_posts)
        # print("-2-------------")
        # print(all_posts2)
        total_posts=all_posts2.count()
        all_posts2=all_posts2[:10]
        total_pages=math.ceil(total_posts/10)
        list_total_pages = []
        for i in range(2, total_pages+1):
            list_total_pages.append(i)
        all_likers = Likers.objects.all()
    
        for post in all_posts2:
            post.date_added = (post.date_added.strftime("%b %d, %Y, %H:%M"))
            post.number_likes=0
            likers = all_likers.filter(post=post.id)
            likers_id = []
            for each_liker in likers:
                post.likers = each_liker.liker.all()
                post.number_likes = each_liker.liker.count()
                for each in each_liker.liker.all():
                    likers_id.append(each.id)
                post.likers_id = likers_id

        users = User.objects.all()
        user_color = {}
        colors_list = ["C37D7D", "FC792F", "4950F8", "EBFC2F", "15A2F1", "58FC2F", "36F9E1", "2ECF65", "B549F8", "FF83EB", "FCCF2F"]
        for j in users:
            user_color[j.id] = random.choice(colors_list)
            colors_list.remove(user_color[j.id])
        return render(request, "network/following.html",{
            "follows_filter":follows_filter,
            "all_posts":all_posts2,
            "list_total_pages":list_total_pages,
            "user_color": user_color,
        })
    else:
        return render(request, "network/register.html")



def liked_posts(request):

    if request.user.id:
        likers_filter=[]
        likers = Likers.objects.filter(liker=request.user.id)
        for each_likers_filter in likers:
            # print(each_likers_filter.followed.id)
            # print(each_likers_filter.post.id)
            # print(each_likers_filter)
            # likers_filter.append(each_likers_filter.followed.id)
            likers_filter.append(each_likers_filter.post.id)
        all_posts = NewPost.objects.all()
        all_posts = all_posts.order_by("-date_added")
        # all_posts2=all_posts.filter(poster__in=[15])
        all_posts2=all_posts.filter(id__in=likers_filter)
        # print(likers_filter)
        # print("1--------------")
        # print(all_posts)
        # print("-2-------------")
        # print(all_posts2)
        total_posts=all_posts2.count()
        all_posts2=all_posts2[:10]
        total_pages=math.ceil(total_posts/10)
        list_total_pages = []
        for i in range(2, total_pages+1):
            list_total_pages.append(i)
        all_likers = Likers.objects.all()
    
        for post in all_posts2:
            post.date_added = (post.date_added.strftime("%b %d, %Y, %H:%M"))
            post.number_likes=0
            likers = all_likers.filter(post=post.id)
            likers_id = []
            for each_liker in likers:
                post.likers = each_liker.liker.all()
                post.number_likes = each_liker.liker.count()
                for each in each_liker.liker.all():
                    likers_id.append(each.id)
                post.likers_id = likers_id

                
        users = User.objects.all()
        user_color = {}
        colors_list = ["C37D7D", "FC792F", "4950F8", "EBFC2F", "15A2F1", "58FC2F", "36F9E1", "2ECF65", "B549F8", "FF83EB", "FCCF2F"]
        for j in users:
            user_color[j.id] = random.choice(colors_list)
            colors_list.remove(user_color[j.id])
            
        return render(request, "network/liked_posts.html",{
            "likers_filter":likers_filter,
            "all_posts":all_posts2,
            "list_total_pages":list_total_pages,
            "user_color": user_color,
        })
    else:
        return render(request, "network/register.html")


def profile(request, id_poster):
    
    if request.user.id:
        user_poster = User.objects.get(id=id_poster)
        try:
            followed_by = Followers.objects.filter(followed=id_poster)
        except Followers.DoesNotExist:
            followed_by = None
        
        followers_obj = Followers.objects.filter(follower__id=id_poster)
        followers=[]
        for follower in followers_obj:
            followers.append(follower.followed)

        profile_posts = NewPost.objects.filter(poster=id_poster)
        profile_posts = profile_posts.order_by("-date_added")
        id_poster=int(id_poster)

        total_posts=profile_posts.count()
        profile_posts=profile_posts[:10]
        total_pages=math.ceil(total_posts/10)
        list_total_pages = []
        for i in range(2, total_pages+1):
            list_total_pages.append(i)


        user_following = followed_by.filter(follower__id=request.user.id)
        if(user_following):
            user_following="Unfollow"
        else:
            user_following="Follow"
        
        all_likers = Likers.objects.all()
    
        for post in profile_posts:
            post.date_added = (post.date_added.strftime("%b %d, %Y, %H:%M"))
            post.number_likes=0
            likers = all_likers.filter(post=post.id)
            likers_id = []
            for each_liker in likers:
                post.likers = each_liker.liker.all()
                post.number_likes = each_liker.liker.count()
                for each in each_liker.liker.all():
                    likers_id.append(each.id)
                post.likers_id = likers_id
        users = User.objects.all()
        user_color = {}
        colors_list = ["C37D7D", "FC792F", "4950F8", "EBFC2F", "15A2F1", "58FC2F", "36F9E1", "2ECF65", "B549F8", "FF83EB", "FCCF2F"]
        for j in users:
            user_color[j.id] = random.choice(colors_list)
            colors_list.remove(user_color[j.id])

        return render(request, "network/profile.html", {
            "poster":user_poster,
            "followed_by":followed_by,
            "followers":followers,
            "profile_posts":profile_posts,
            "user_following":user_following,
            "list_total_pages":list_total_pages,
            "user_color": user_color
        })
    else:
        return render(request, "network/register.html")




def new_post(request):
    return render(request, "network/new_post.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password) 
        # users = User.objects.all()
        # user_color = {}
        # colors_list = ["C37D7D", "FC792F", "4950F8", "EBFC2F", "15A2F1", "58FC2F", "36F9E1", "2ECF65", "B549F8", "FF83EB", "FCCF2F"]
        # for j in users:
            # user_color[j.id] = random.choice(colors_list)
            # colors_list.remove(user_color[j.id])

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password.",
                # "user": user,
                # "user_color": user_color
            })
    else:
        return render(request, "network/login.html", {
                "user": 0})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            followers = Followers.objects.create(followed=user)
            followers.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html", {
                "user": 0})

@csrf_exempt
@login_required
def compose_post(request):
    # Composing a new email must be via POST
    
    print("request------------------------------")
    print(request)

    if request.method != "POST":
        # Get start and end points
        start = int(request.GET.get("start") or 0)
        end = int(request.GET.get("end") or (start + 9))
        # Generate list of posts
        data = []
        for i in range(start, end + 1):
            data.append(f"Post #{i}")
        # Artificially delay speed of response
        time.sleep(1)
        return JsonResponse({"message":"probando",
                            "data": data,
                            }, status=400)
    else:
        # Check post words
        data = json.loads(request.body)
        words = [word.strip() for word in data.get("description").split(" ")]
        if words == [""]:
            return JsonResponse({
                "error": "At least one recipient required."
            }, status=400)
        # Convert post to NewPost object
        description = data.get("description", "")
        new_post = NewPost(poster=request.user, description=description, )
        new_post.save()
        new_liker = Likers.objects.create(post=new_post)
        new_liker.save()
        return JsonResponse({"message":"Post saved successfully.",
                    "user_log": request.user.id,
                    }, status=201)


# @csrf_exempt
# @login_required
# def post(request, postbox):
#     all_posts = NewPost.objects.select_related('poster')
#     return render(request, "network/index.html", {
#         "all_posts": all_posts,
#         "add_post_available": True
#     })



@csrf_exempt
@login_required
def follow(request, id_poster):
    
   # Following must be via POST
    try:
        follow = Followers.objects.get(followed=id_poster)
    except Followers.DoesNotExist:
        return JsonResponse({"error": "Follow not found."}, status=404)
    data = json.loads(request.body)
    follower_var = data.get("follower", "")
    follow_action = data.get("follow_action", "")
    if(follow_action == "Follow"):
        follow.follower.add(follower_var)
    else:
        follow.follower.remove(follower_var)
    followers_array=[]
    for each_follower in follow.follower.all():
        each_follower=str(each_follower)
        followers_array.append(each_follower)
    return JsonResponse({
        "followers_array":followers_array,
        "message": "Profile followed successfully."
    }
    , status=201)


@csrf_exempt
def pagesposts(request):

    # Composing a new email must be via POST
    # Get start and end points
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    # Artificially delay speed of response
    time.sleep(1)

    all_posts = NewPost.objects.select_related('poster')

    users_without_color=[]

    if(request.GET.get("url") == "/follow"):
        follows_filter=[]
        followers = Followers.objects.filter(follower=request.user.id)
        for each_followers_filter in followers:
            follows_filter.append(each_followers_filter.followed.id)
        
        all_posts=all_posts.filter(poster__in=follows_filter)
    elif(request.GET.get("url") == "/profil"):
        all_posts = NewPost.objects.filter(poster=request.GET.get("id_poster"))

    total_posts=all_posts.count()
    total_pages=math.ceil(total_posts/10)
    list_total_pages = []
    for i in range(1, total_pages+1):
        list_total_pages.append(i)

    all_posts = all_posts.order_by("-date_added")[start:end]
    all_likers = Likers.objects.all()
    all_likers_id = []
    for post in all_posts:
        post.number_likes=0
        likers = all_likers.filter(post=post.id)
        likers_id = []
        users_without_color.insert(int(post.poster.id), int(post.poster.id))
        print(post.poster.id)
        print("$#----------------------#$")
        for each_liker in likers:
            post.likers = each_liker.liker.all()
            post.number_likes = each_liker.liker.count()
            for each in each_liker.liker.all():
                likers_id.append(each.id)
            all_likers_id.append( likers_id)

    all_users = User.objects.all()
    print(users_without_color)
    print("---------------gdasdg------------------")
    print(all_posts)
    print("---------------------------------")
    all_posts_json = serializers.serialize('json', all_posts)
    all_users_json = serializers.serialize('json', all_users)
    print("------------------------------------------")
    print(all_posts_json)



            
    users = User.objects.all()
    user_color = {}
    colors_list = ["C37D7D", "FC792F", "4950F8", "EBFC2F", "15A2F1", "58FC2F", "36F9E1", "2ECF65", "B549F8", "FF83EB", "FCCF2F"]
    for j in users_without_color:
    # for j in users:
        # print(j)
        # print("--------fdsaf")
        user_color[j] = random.choice(colors_list)
        colors_list.remove(user_color[j])


    return JsonResponse({"message":"probando",
                        "all_likers_id": all_likers_id,
                        "all_posts_json": all_posts_json,
                        "all_users_json": all_users_json,
                        "list_total_pages": list_total_pages,
                        "user_color": user_color,
                        }, status=201)

@csrf_exempt
@login_required
def edit(request):
    
    data = json.loads(request.body)
    id_post = data.get("id_post", "")
    description = data.get("description", "")
    try:
        post = NewPost.objects.get(id=id_post)
    except Followers.DoesNotExist:
        return JsonResponse({"error": "Follow not found."}, status=404)
    
    if request.user.id==post.poster.id:
        post.description = description
        post.save()
        return JsonResponse({"message":"probando",
                            "id_post": id_post,
                            "description": description,
                            }, status=201)
    else:
        print("This post is not yours")

# @csrf_exempt
# @login_required
# def pre_edit_profile(request):
#     print('---------------change_profile_picture---------------')
#     # print(request.body[src])
#     user_999 = User.objects.filter(id=999)
#     if(user_999):
#         print(user_999)
#     else:
#         print("kkk")
#         user_999 = User.objects.create(id=999, username="user_999", email="email_user@999.com", password="password_user_999")
#         user_999.save()
#     # print(user_999)
#     data = json.loads(request.body)
#     src = data.get("src", "")
#     print(src)
#     print(request.FILES)
#     # if(src):
#         # user_999.header_image = src
#     # user_999.save()



    
#     instance = User(
#         header_image=UploadedFile(
#             file=open(src, 'rb')
#             # file=open('C:/Users/rodri/Downloads/logo1.png', 'rb')
#         )
#     )
#     instance.save()




#     return JsonResponse({"message_username":"holis",})

@csrf_exempt
@login_required
def edit_profile(request):
    # print("adondeestalalibertad")
    # print(json.loads(request.body))
    # data = json.loads(request.body)
    # data_username = data.get("username")
    # print(request.user.id)
    # print(request.FILES)
    # print(data_username)
    # print("......ANDA O NO ANDA?")
    # print(request.POST['username'])
    user_logued = User.objects.get(id=request.user.id)
    # print(user_logued.email)
    message_username = ""
    message_emailaddress = ""
    message_password = ""
    message_image = ""

    if request.POST['username']:
    # if(User.objects.get(username=data.get("username"))):
        if User.objects.filter(username=request.POST['username']):
            print("hay coincidenciaaa")
            message_username = "- Username is already in use.<br>"
        else:
            print("no coincidióóóóó. Podemos proceder a cambiar el alias")
            message_username = "- Username changed successfully.<br>"
            user_logued.username = request.POST['username']
    if request.POST["emailaddress"]:
        if User.objects.filter(email=request.POST["emailaddress"]):
            message_emailaddress = "- Email is already in use.<br>"
        else:
            message_emailaddress = "- Email changed successfully.<br>"
            user_logued.email = request.POST["emailaddress"]
    # user_logued.password = data.get("password")
    if request.POST["password"]:
        if request.POST["password"]==request.POST["confirmpassword"]:
            # print("...------...")
            # print("YESIRRR")
            # print("...------...")
            message_password = "- Password changed successfully.<br>"
            user_logued.set_password(request.POST["password"])
            update_session_auth_hash(request, user_logued)
        else:
            message_password = "- Passwords must match.<br>"


    print("-----request.FILES--------")
    print(request.FILES)
    if(request.FILES):
        # print(request.FILES['change_profile_picture'])
        user_logued.header_image = request.FILES['change_profile_picture']
        message_image = "- Profile image changed."


    user_logued.save()

    # print(message_username)
    # print(message_emailaddress)
    # print(message_password)
    # print(message_image)



    return HttpResponseRedirect('/postsbox/profile/%s/1' % user_logued.id)







    # message_username = ""
    # message_emailaddress = ""
    # message_password = ""
    # return JsonResponse({"message_username":message_username,
    #                         "message_emailaddress":message_emailaddress,
    #                         "message_password":message_password,
    #                         "id_post": "id_post",
    #                         "description": "description",
    #                         }, status=201)
    # return render(request, "network/profile.html", {
    #         "poster":user_logued,
            # "followed_by":followed_by,
            # "followers":followers,
            # "profile_posts":profile_posts,
            # "user_following":user_following,
            # "list_total_pages":list_total_pages,
        # })

    # try:
    #     user_logued = User.objects.get(id=request.user.id)
        
    #     # print(dir(user_logued))
    #     # print(user_logued.email)
    #     # print(user_logued.password)
    #     # print("...asdf...")
    #     # print(user_logued.username)
    #     # print("...asdf...")
    #     message_username = ""
    #     message_emailaddress = ""
    #     message_password = ""
    #     if data.get("username"):
    #         # if(User.objects.get(username=data.get("username"))):
    #         if User.objects.filter(username=data.get("username")):
    #             # print("hay coincidenciaaa")
    #             message_username = "- Username is already in use.<br>"
    #         else:
    #             # print("no coincidióóóóó")
    #             message_username = "- Username changed successfully.<br>"
    #             user_logued.username = data.get("username")
    #     if data.get("emailaddress"):
    #         if User.objects.filter(email=data.get("emailaddress")):
    #             message_emailaddress = "- Email is already in use.<br>"
    #         else:
    #             message_emailaddress = "- Email changed successfully.<br>"
    #             user_logued.email = data.get("emailaddress")
    #     # user_logued.password = data.get("password")
    #     if data.get("password"):
    #         if data.get("password")==data.get("confirmpassword"):
    #             # print("...------...")
    #             # print("YESIRRR")
    #             # print("...------...")
    #             message_password = "- Password changed successfully.<br>"
    #             user_logued.set_password(data.get("password"))
    #             update_session_auth_hash(request, user_logued)
    #         else:
    #             message_password = "- Passwords must match.<br>"
            
    #         # request.user.set_password(form.cleaned_data['password'])

    #     print("  ")
    #     print(data)
    #     # print(request.get)
    #     print("  ")
    #     if data.get("change_profile_picture"):
    #         print("  ")
    #         print(data.get("change_profile_picture"))
    #         print("  ")
    #         user_logued.header_image = data.get("change_profile_picture")
    #         # user_logued.header_image = '\WhatsApp Image 2022-06-06 at 6.23.25 PM.jpeg'

    #     user_logued.save()

    #     return JsonResponse({"message_username":message_username,
    #                         "message_emailaddress":message_emailaddress,
    #                         "message_password":message_password,
    #                         "id_post": "id_post",
    #                         "description": "description",
    #                         }, status=201)

    # except Likers.DoesNotExist:
    #     return JsonResponse({"error": "Liker not found."}, status=404)

@csrf_exempt
@login_required
def like(request, id_post):


    try:
        liked = Likers.objects.get(post=id_post) 
    except Likers.DoesNotExist:
        return JsonResponse({"error": "Liker not found."}, status=404)

    data = json.loads(request.body)
    like_action = data.get("like_action", "")
    if(like_action == "heart_empty"):
        liked.liker.add(request.user.id)
    
    else:
        liked.liker.remove(request.user.id)
    likers_array=[]
    for each_liker in liked.liker.all():
        each_liker=str(each_liker)
        likers_array.append(each_liker)
    return JsonResponse({
        "likers_array":likers_array,
        "prev_status":like_action,
        "message": "Profile followed successfully."
    }
    , status=201)











