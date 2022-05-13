from django.contrib import admin
from .models import User, NewPost, Followers, Likers

# Register your models here.
admin.site.register(User)
admin.site.register(NewPost)
admin.site.register(Followers)
admin.site.register(Likers)