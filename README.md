# RJMNetwork

Cómo correrlo localmente (Paso a paso)
En tu terminal se ve que falló el comando source venv/Scripts/activate porque la carpeta no existe. Seguí estos pasos en la terminal de VS Code:

Creá el entorno virtual: python -m venv venv

Activalo: venv\Scripts\activate (Si usás Git Bash en Windows, a veces es source venv/Scripts/activate).

Instalá las dependencias: pip install -r requirements.txt

Corré las migraciones: python manage.py migrate

Iniciá el servidor: python manage.py runserver