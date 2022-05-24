
from django.urls import path

from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index, name="index"),
    path("new_post", views.new_post, name="new_post"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("posts", views.compose_post, name="compose_post"),
    path("posts/<str:postbox>", views.postbox, name="postbox"),
    path("profile/<str:id_poster>", views.profile, name="profile"),
    path("follow/<int:id_poster>", views.follow, name="follow"),
    path("following", views.following, name="following"),
    path("liked_posts", views.liked_posts, name="liked_posts"),
    path("pagesposts", views.pagesposts, name="pagesposts"),
    path("edit", views.edit, name="edit"),
    path("edit_profile", views.edit_profile, name="edit_profile"),
    path("like/<int:id_post>", views.like, name="like"),
   
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
