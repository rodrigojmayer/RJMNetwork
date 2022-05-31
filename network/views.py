import json, math
from django.contrib.auth import authenticate, login, logout
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
import time

from django.core.paginator import Paginator

from .models import User, NewPost, Followers, Likers

def index(request):
    all_posts = NewPost.objects.select_related('poster')
    total_posts=all_posts.count()
    total_pages=math.ceil(total_posts/10)
    list_total_pages = []
    for i in range(2, total_pages+1):
        list_total_pages.append(i)
    all_posts = all_posts.order_by("-date_added")[:10]
    all_likers = Likers.objects.all()
    for post in all_posts:
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
    return render(request, "network/index.html", {
        "all_posts": all_posts,
        "list_total_pages":list_total_pages,
    })


def new_post(request):
    return render(request, "network/new_post.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def compose_post(request):
    # Composing a new email must be via POST
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


@csrf_exempt
@login_required
def postbox(request, postbox):
    all_posts = NewPost.objects.select_related('poster')
    return render(request, "network/index.html", {
        "all_posts": all_posts,
        "add_post_available": True
    })


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

        return render(request, "network/profile.html", {
            "poster":user_poster,
            "followed_by":followed_by,
            "followers":followers,
            "profile_posts":profile_posts,
            "user_following":user_following,
            "list_total_pages":list_total_pages,
        })
    else:
        return render(request, "network/register.html")


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


def following(request):

    if request.user.id:
        follows_filter=[]
        followers = Followers.objects.filter(follower=request.user.id)
        for each_followers_filter in followers:
            print(each_followers_filter.followed.id)
            follows_filter.append(each_followers_filter.followed.id)
        all_posts = NewPost.objects.all()
        all_posts = all_posts.order_by("-date_added")
        all_posts2=all_posts.filter(poster__in=follows_filter)
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
        return render(request, "network/following.html",{
            "follows_filter":follows_filter,
            "all_posts":all_posts2,
            "list_total_pages":list_total_pages,
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
            print(each_likers_filter)
            # likers_filter.append(each_likers_filter.followed.id)
            likers_filter.append(each_likers_filter.post.id)
        all_posts = NewPost.objects.all()
        all_posts = all_posts.order_by("-date_added")
        all_posts2=all_posts.filter(poster__in=likers_filter)
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
        return render(request, "network/liked_posts.html",{
            "likers_filter":likers_filter,
            "all_posts":all_posts2,
            "list_total_pages":list_total_pages,
        })
    else:
        return render(request, "network/register.html")

@csrf_exempt
def pagesposts(request):

    # Composing a new email must be via POST
    # Get start and end points
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    # Artificially delay speed of response
    time.sleep(1)

    all_posts = NewPost.objects.select_related('poster')

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
        for each_liker in likers:
            post.likers = each_liker.liker.all()
            post.number_likes = each_liker.liker.count()
            for each in each_liker.liker.all():
                likers_id.append(each.id)
            all_likers_id.append( likers_id)

    all_users = User.objects.all()
    print(all_posts)
    print("---------------------------------")
    all_posts_json = serializers.serialize('json', all_posts)
    all_users_json = serializers.serialize('json', all_users)
    print("------------------------------------------")
    print(all_posts_json)

    return JsonResponse({"message":"probando",
                        "all_likers_id": all_likers_id,
                        "all_posts_json": all_posts_json,
                        "all_users_json": all_users_json,
                        "list_total_pages": list_total_pages,
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


@csrf_exempt
@login_required
def edit_profile(request):
    print("adondeestalalibertad")
    print(json.loads(request.body))
    data = json.loads(request.body)
    data_username = data.get("username")
    print(request.user.id)
    print(data_username)
    print("......")
    
    try:
        user = User.objects.get(id=request.user.id)
        
        print(user)
        print(user.username)
        user.username = data.get("username")
        user.save()

        return JsonResponse({"message":"probando",
                            "id_post": "id_post",
                            "description": "description",
                            }, status=201)

    except Likers.DoesNotExist:
        return JsonResponse({"error": "Liker not found."}, status=404)

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