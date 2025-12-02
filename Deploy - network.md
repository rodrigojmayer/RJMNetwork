## Deploying This Project

-> Clone repository
``` bash
git clone https://github.com/rodrigojmayer/RJMNetwork.git
```

-> Create a Virtual environment using
``` bash

cd rjmnetwork

mkvirtualenv --python=/usr/bin/python3.8 venv


```

-> Install all requirements using
``` bash

pip install -r requirements.txt


```

-> Add a new web app (select the last option to configure manually, no Django. And then the Python 3.8 version)

```
-> Setting up your Web app and WSGI file 

```
Source code: /home/rjmnetwork/RJMNetwork_pythonanywhere

Working directory: /home/rjmnetwork/

Virtual     /home/rjmnetwork/.virtualenvs/venv

# Paths
/static/    /home/rjmnetwork/RJMNetwork_pythonanywhere/network/static

/media/	    /home/rjmnetwork/RJMNetwork_pythonanywhere/network/static/media/images

```

Force HTTPS: ENABLE

```
-> WSGI
```

import os
import sys


path = os.path.expanduser('~/RJMNetwork_pythonanywhere')

if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'project4.settings'

from django.core.wsgi import get_wsgi_application

from django.contrib.staticfiles.handlers import StaticFilesHandler
application = StaticFilesHandler(get_wsgi_application())

```

THE SECRET KEY AND CLOUDINARY .ENV CONFIGURATION IN PROJECTS FILE SERVERS GOOGLE SPREADSHEET
