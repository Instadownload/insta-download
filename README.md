# Insta Download
![image](https://user-images.githubusercontent.com/94854958/143620213-97fb4bc0-82a6-475c-8c3b-e6313489ea73.png)

## ¿Que es? 🚀

_Insta Download_ es un script Javascript para _Instagram_ que permite:
- :id: Visualizar y copiar el identificador **ID** de un perfil de _Instagram_.
- :bust_in_silhouette: Descargar la **lista completa de los seguidores** de un perfil.
- :bust_in_silhouette: Descagar la **lista completa de los seguidos**.
- :busts_in_silhouette: Comparar ambas listas y **buscar coincidencias** en los perfiles.
- :city_sunset: Descargar las publicaciones: fotografías y videos.

¿Quieres saber más? Sigue leyendo... :point_down:

<a href="https://www.buymeacoffee.com/instadownload" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Pre-requisitos 📋

Utilizar _Insta Download_ es muy sencillo. No requiere dependencias ni instalar bibliotecas en tu equipo.
Tan sólo necesitarás utilizar la extensión Tampermonkey, disponible en la tienda de extensiones de los navegadores más conocidos.
- [TM Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=es) 
- [TM Firefox](https://addons.mozilla.org/es/firefox/addon/tampermonkey/)

## Instalación 🔧

Una vez instalado TamperMonkey en el navegador, el siguiente y último paso es añadir _Insta Download_ a la extensión.

_Haz click en la extensión_

```
Tampermonkey > Agregar nuevo script [Item]
```

_En la pestaña 'Utilidades'_

```
Install from URL (campo de formulario)
```
Pega la siguiente URL y pulsa 'Install'
```
https://raw.githubusercontent.com/Instadownload/insta-download/main/instadownload.js
```

![image](https://user-images.githubusercontent.com/94854958/143620037-fbc7b112-abfd-4cd8-a7dc-21d5489af814.png)


Ya tienes Insta Download instalado. ¿Sencillo verdad?

_Comprueba que se ha instalado correctamente, haciendo 'click' de nuevo en la extensión_

```
Tampermonkey > Dashboard
```
Si todo ha ido bien, verás el script instalado.
**¿Problemas?** 
Visita las F.A.Q [problemas de instalación](#problemas-de-instalaci%C3%B3n)

## Utilizando 'Insta Download' ⚙️

>**ADVERTENCIA:**
>El uso intensivo de este script, **puede provocar que Instagram detecte "actividad inusual"** en la cuenta y **exija un método de verficación**. Por ello, sigue las siguientes recomendaciones:
>1. Añade un número de teléfono a tu cuenta, como método de verificación.
>2. No trates descargar listas demasiado extensas (miles de seguidores) de un perfil o,
>3. No realices demasiadas descargas en un breve periodo de tiempo.

_Insta Download_ se activará **automáticamente**  cuando visites un **perfil** de Instagram.


### Obtener el identificador (ID) de un perfil

Cada vez que visites un perfil, su identificador (ID) se revelará al lado de su nombre de usuario, en forma de botón.
Pulsa en él, y una ventana emergente ¡te notificará que el ID ha sido copiado al portapapeles!

![image](https://user-images.githubusercontent.com/94854958/143543320-3e89e0d5-bf04-4c76-a6af-c281698d1abc.png)

### Obteniendo los seguidores y/o seguidos

Como podrás imaginar, es tan sencillo como hacer 'click' en los botones que se encuentran a la derecha.
Tan pronto se hayan descargado, podrás guardarlos en tu equipo como un archivo .txt.

### Obteniendo las publicaciones del perfil

Pulsa la pestaña _MEDIA_ para iniciar la descarga de las fotografías y videos que haya publicado el usuario.

![image](https://user-images.githubusercontent.com/94854958/143543889-46e17780-b597-4563-8b9b-396afa5125cd.png)

**Aún hay más, no dejes de mirar las F.A.Q.**

# F.A.Q.:pencil:

## Sobre la aplicación
### ¿Es gratuíta?
Si, lo es. Pero si te ha sido útil, puedes colaborar con el desarrollador aportando un [donativo](https://buymeacoffee.com/instadownload) :blush:
### ¿Es segura?
Si, pero no olvides leer la [advertencia](#utilizando-insta-download-%EF%B8%8F) y aplicar los consejos.
### ¿Necesito registrarme para utilizarla?
No. Simplemente instala y listo.
## Problemas de instalación
### Si una vez instalada la aplicación, no aparece la interfaz.
- Es necesario tener una cuenta de _Instagram_ y **estar logueado**.
- Asegurate que el **switch del script** está en modo _on_. Si lo está, prueba a recargar la página.

![image](https://user-images.githubusercontent.com/94854958/144005977-db47eb93-2418-471c-8a76-c126ad5c731c.png)

- Si has accedido a un perfil desde una página externa, es posible que debas limpiar la URL de parámetros (borra la parte de la URL a partir del signo de interrogación)
[https://instagram.com/usuario?parametro1&parametro2](https://www.instagram.com/instadownload44/)
_Insta Download_ sólo acepta URL's con el siguiente esquema: 
>[https://instagram.com/usuario](https://www.instagram.com/instadownload44/)
### En algunos casos, los botones de descarga aparecen en rojo y marcados con una equis...
No se pueden descargar datos de una cuenta privada.
## Sobre las descargas
### ¿Se puede exportar en otros formatos?
No. Todas las descargas se realizan en un archivo de texto .txt. De esta forma te será más fácil manipular los datos.
Por ejemplo, puedes importar el archivo a una hoja de Excel (importar datos externos) utilizando como separador, el espacio en blanco. De este modo, cada dato se mantendrá en una celda independiente.
### ¿Por qué me aparece una ventana emergente preguntando si deseo buscar coincidencias?
Cuando se descargan ambas listas (seguidores y seguidos), _Insta Download_ te ofrece la posibilidad de buscar coincidencias.
Hay dos tipos de coincidencias:
1. **Coincidencias exactas:** Son aquellos perfiles que aparecen tanto como seguidores como seguidos.
2. **Coincidencias aproximadas:** Aquellos perfiles que aparecen como seguidores y como seguidos, con el mismo nombre (__username__) pero con distinto __nickname__. Puede ser útil para revelar aquellos perfiles que siguen a otros, con dos cuentas distintas.
### ¿Y si no deseo descargar el archivo a mi equipo?
Simplemente cancela la ventana del explorador. Pero si luego cambias de idea, deberas refrescar la página o visitar de nuevo el perfil e iniciar la descarga otra vez.
### ¿Por qué las descargas de los archivos media se realiza mediante URL y no como archivo?
Por seguridad Javascript, no permite el acceso al disco local, por eso las imágenes y videos se descargan como URL y no como archivo en si.
### Al descargar las publicaciones _media_ de un perfil, observo que hay más _urls_ que publicaciones tiene.
Porque hay publicaciones de tipo _carousel_ o también conocidas como _de secuencia_. Es un tipo de publicación que cuenta con múltiples imágenes (hasta 10) que se pueden visualizar deslizando hacia la izquierda. _Insta Download_ descargará cada una de esas imagenes individualmente.
### ¿Que puedo hacer entonces para guardar las fotos y videos de un perfil en mi equipo?
Puedes utilizar un gestor de descargas, como [JDownloader](https://jdownloader.org/) y pasarle las URL's para que las descargue.


## Construido con 🛠️

* [SweetAlert](https://sweetalert2.github.io/)
* [WaitForKeysElements](https://gist.github.com/BrockA/2625891)

## Licencia 📄

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE.md](https://github.com/Instadownload/insta-download/blob/main/LICENSE) para más detalles.

## Colabora 🎁

* ¡Ayuda a la comunidad #OSINT difundiendo este proyecto! 📢
* Invita una [cerveza](https://buymeacoffee.com/instadownload) 🍺  al autor.
* ¿Errores? ¿Ideas o sugerencias? Ponte en contacto a través de correo electrónico o redes sociales 🤓.

## Contacto
* :email: instagramdownload2021@gmail.com
* :bird: [@InstaDownload1](https://twitter.com/instadownload1)


