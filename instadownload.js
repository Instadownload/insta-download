// ==UserScript==
// @name         Insta Download
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description:es  Copia el ID de un perfil de Instagram al portapapeles y descarga sus seguidores, seguidos y archivos multimedia a un documento txt
// @description:en Copy the ID of an Instagram profile to the clipboard and download its followers, following and multimedia files to a txt document
// @author @instadownload1
// @homepage https://github.com/Instadownload/insta-download
// @match https://www.instagram.com/*/
// @match https://www.instagram.com/*/?hl=*
// @icon  https://www.google.com/s2/favicons?domain=instagram.com
// @grant GM_addStyle
// @grant GM_addElement
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @connect instagram.com
// @connect firebaseio.com
// @require https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @require https://cdn.jsdelivr.net/gh/Instadownload/parser@1.0/parser.js
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdn.jsdelivr.net/npm/sweetalert2@11.0.18/dist/sweetalert2.all.min.js
// @run-at  document-body
// ==/UserScript==

(function () {
    'use strict';
    // Variables globales de interfaz
    var btn_seguidores, btn_seguidos, btn_id, tab_media = '';

    // de la aplicación
    var seleccion = '';

    var agente = {
        id: '',
        username: ''
    }

    var objetivo = {
        accesible: '',
        id: '',
        nombre: '',
        biografia: '',
        seguidores: [],
        seguidos: [],
        media: [],
        mutual: [],
        pos_mutual: [],
        num_seguidores: '', // num_* => stats
        num_seguidos: '',
        num_media: '',
        num_mutual: null,
        media_edges: null
    }

    window.onload = waitForKeyElements(
        "ul.k9GMp" // elemento menu donde se encuentran los enlaces 'seguidores' y 'seguidos'
        , graph
    );

    /**
     * Elimina los parametros de la URL actual
     * @returns String Devuelve URL de la pagina actual
     */
    function limpiarUrl() {
        var exp = RegExp(/(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/((?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29})/igm);
        return exp.exec(document.location.href);
    }

    /**
     * Setea variables globales de la aplicacion
     * @param {node} Jnode 
     */
    function graph(Jnode) {
        // Jnode
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${limpiarUrl()[0]}/?__a=1`,
            onload: response => {
                if (response.status === 200) {
                    var datosJson = JSON.parse(response.responseText);
                    // Asignacion de variables de aplicacion
                    agente.id = unsafeWindow.window._sharedData.config.viewerId;
                    agente.username = unsafeWindow.window._sharedData.config.viewer.username;
                    var { id,
                        username,
                        biography,
                        is_private,
                        blocked_by_viewer,
                        followed_by_viewer,
                        has_blocked_viewer } = datosJson.graphql.user;

                    objetivo.id = id;
                    username === '' ? objetivo.nombre = '(no establecido)' : objetivo.nombre = username; // impide que se guarde un nombre vacio si el usuario no lo estableció
                    objetivo.biografia = biography;
                    objetivo.num_seguidores = datosJson.graphql.user.edge_followed_by.count;
                    objetivo.num_seguidos = datosJson.graphql.user.edge_follow.count;
                    objetivo.num_media = datosJson.graphql.user.edge_owner_to_timeline_media.count;

                    // Limpia las propiedades de objeto para que no se acumulen resultados
                    objetivo.seguidores = [];
                    objetivo.seguidos = [];
                    objetivo.mutual = [];
                    objetivo.pos_mutual = [];
                    objetivo.media = [];
                    objetivo.num_mutual = null;
                    objetivo.media_edges = null;

                    //Determina si un perfil es accesible o no:TRUE si se cumplen todas las condiciones de accesibilidad
                    if ((is_private && blocked_by_viewer && has_blocked_viewer) || (is_private && !followed_by_viewer)) {
                        objetivo.accesible = false;
                    } else {
                        objetivo.accesible = true;
                    }
                    crearElementosInterfaz();
                } else {
                    throw new Error(datosJson);
                }
            },
            onerror: error => {
                Swal.fire(
                    error,
                    'Inténtelo mas tarde',
                    'error'
                );
            }
        });
    }

    /**
     * Crea los elementos comunes a las interfaces (publica y privada)
     */
    function crearElementosInterfaz() {
        // Estilos CSS propios
        GM_addStyle('li.Y8-fY{margin-right: 5px;} button.download{border:none;color:white;border-radius: 4px;margin-right: 7px;}');
        GM_addStyle('button.publico{background-color:#0095f6;cursor:pointer} button.publico:disabled{background-color:#0095f66e;cursor:default} button.privado{background-color:#F08080}');
        GM_addStyle('button[name=btn_id]{width:30%;display:inline-block;margin-left:10px}');

        //Botones de la interfaz
        btn_seguidores = GM_addElement('button', {
            type: 'button',
            name: 'btn_seguidores',
            class: 'download'
        });

        btn_seguidos = GM_addElement('button', {
            type: 'button',
            name: 'btn_seguidos',
            class: 'download'
        });

        btn_id = GM_addElement('button', {
            type: 'button',
            name: 'btn_id',
            class: 'sqdOP  L3NKy   y3zKF',
            textContent: `ID:${objetivo.id}`
        });

        tab_media = GM_addElement('a', {
            "aria-selected": 'false',
            class: '_9VEo1',
            role: 'tab'
        });

        var tab_icono = GM_addElement(tab_media, 'span', {
            class: 'qzihg',
            textContent: '\u2605'
        })

        var tab_text = GM_addElement(tab_media, 'span', {
            class: '_08DtY',
            textContent: 'Media'
        })

        // Mostrar la interfaz
        interfaz();
    }

    /**
     * Establece la interfaz publica del script (botones, identificador usuario)
     */
    function interfaz() {
        // Condiciones de accesibilidad
        if (objetivo.accesible) {
            btn_seguidores.classList.add('publico');
            btn_seguidos.classList.add('publico');
            btn_seguidores.innerText = '\u2193';
            btn_seguidos.innerText = '\u2193';

            // Verificar que haya seguidores o seguidos que descargar
            objetivo.num_seguidores > 0 ? btn_seguidores.addEventListener('click', eventoDownload) : btn_seguidores.disabled = true;
            objetivo.num_seguidos > 0 ? btn_seguidos.addEventListener('click', eventoDownload) : btn_seguidos.disabled = true;

            // Verifica si tiene media
            if (objetivo.num_media > 0) {
                document.querySelector('div.fx7hk[role=tablist]').appendChild(tab_media);
                // añade event listener
                tab_media.addEventListener('click', () => {
                    seleccion = 'media';
                    obtenerLista();
                });
            }
        } else {
            btn_seguidores.classList.add('privado');
            btn_seguidos.classList.add('privado');
            btn_seguidores.innerText = 'X';
            btn_seguidos.innerText = 'X';
        };

        // Selectores del DOM
        var menu = document.querySelector('ul.k9GMp');
        let li_seguidores = GM_addElement('li', {
            id: 'seguidores',
            class: 'Y8-fY'
        });

        // Crear elementos de la interfaz
        let li_seguidos = GM_addElement('li', {
            id: 'seguidos',
            class: 'Y8-fY'
        });

        // Añadir botones a elementos de lista
        li_seguidos.appendChild(btn_seguidos);
        li_seguidores.appendChild(btn_seguidores);

        // Añadir elementos de lista a menu
        menu.insertBefore(li_seguidores, menu.childNodes[2]);
        menu.appendChild(li_seguidos);

        // Añade el boton ID
        if (document.querySelector('div.QGPIr>h1.Yk1V7') === null) {
            // Se da esta circunstancia cuando el usuario no tiene nombre establecido
            GM_addElement(document.querySelector('div.QGPIr'), 'h1', {
                class: 'Yk1V7'
            })
        }
        document.querySelector('div.QGPIr>h1.Yk1V7').appendChild(btn_id);

        // Funcionalidad boton 'copiar id'
        btn_id.addEventListener('click', () => {
            GM_setClipboard(objetivo.id);
            // Notificacion
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                text: 'Identificador copiado al portapapeles',
                timer: 3000,
                showConfirmButton: false
            })
        });

        // Listener
        function eventoDownload() {
            seleccion = this.name.split('_')[1];
            // Inutiliza el boton y su evento
            this.removeEventListener('click', eventoDownload);
            this.disabled = true;
            obtenerLista();
        }
    }

    /**
    * Obtiene el listado de seguidores, seguidos o media de un usuario de Instagam
    */
    function obtenerLista() {
        var numTotalPerfiles;

        var query_hash;
        var tipo_edge;
        var parametros;

        var edges = [];

        if (seleccion === 'seguidores') {
            query_hash = 'c76146de99bb02f6415203be841dd25a';
            tipo_edge = 'edge_followed_by';
        } else if (seleccion === 'seguidos') {
            query_hash = 'd04b0a864b4b54837c0d870b0e77e076';
            tipo_edge = 'edge_follow';
        } else if (seleccion === 'media') {
            query_hash = '003056d32c2554def87228bc3fd9668a';
            tipo_edge = 'edge_owner_to_timeline_media';
        }

        // Ventana de carga
        Swal.fire({
            icon: 'info',
            title: 'Cargando datos',
            text: 'Espere por favor',
            showConfirmButton: false
        });

        // Llamada a Instagram para recuperar datos
        llamada();

        /**
        * Función interna para la paginación de resultados
        * @param {string} cursor
        */
        function llamada(cursor) {
            if (typeof (cursor) === 'undefined') {
                parametros = {
                    'id': objetivo.id,
                    'first': 50
                }
            } else {
                parametros = {
                    'id': objetivo.id,
                    'first': 50,
                    'after': cursor
                }
            }

            var variables = encodeURIComponent(JSON.stringify(parametros));

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=${variables}`,
                responseType: 'json',
                onload: function (response) {
                    if (response.readyState === 4 && response.status === 200) {
                        var respuesta = JSON.parse(response.responseText);

                        if (eval(`respuesta.data.user.${tipo_edge}.edges`).length > 0) {
                            // Almacena recursivamente los resultados en un array 'edges'
                            edges = edges.concat(eval(`respuesta.data.user.${tipo_edge}.edges`));

                            // Calcula el numero de perfiles descargados respecto del total
                            if (seleccion === 'seguidores' || seleccion === 'seguidos') {
                                numTotalPerfiles = seleccion === 'seguidores' ? objetivo.num_seguidores : objetivo.num_seguidos;

                                if (typeof (numTotalPerfiles) !== undefined) {
                                    var numRestantes = numTotalPerfiles - edges.length;
                                    // Actualiza la ventana mostrando un mensaje de los perfiles que quedan
                                    Swal.update({
                                        text: `Quedan ${numRestantes} de ${numTotalPerfiles} perfiles`
                                    })
                                }
                            }
                        }

                        // Paginación en caso que haya más resultados
                        if (eval(`respuesta.data.user.${tipo_edge}.page_info.has_next_page`)) {
                            var cursor = eval(`respuesta.data.user.${tipo_edge}.page_info.end_cursor`);
                            llamada(cursor);

                        } else { // no hay mas resultados que recabar
                            // Cerrar ventana
                            Swal.close();
                            // Procesar resultados
                            procesarResultados(edges, seleccion);
                        }
                    }
                },
                onerror: function (error) { // error en la devolución de datos
                    Swal.update({
                        icon: 'error',
                        title: 'ERROR',
                        text: error,
                        showConfirmButton: true
                    })
                }
            });
        }
    }

    /**
     * Parsea los nodos resultantes y los graba en el objeto resultados
     * @param {json} edges nodos resultantes de la llamada
     * @param {string} tipo seleccion (media|seguidores|seguidos)
     */
    function procesarResultados(edges, tipo) {
        // Recorre todos los 'edges
        edges.forEach(nodo => {
            if (tipo === 'media') {
                // Asigna a variable
                objetivo.media_edges = edges;

                // Los tipos pueden ser 'video' o 'imagen' o de tipo 'carrousel' => https://techcrunch.com/2017/02/22/instagram-carousels/
                if (nodo.node.__typename === 'GraphVideo') objetivo.media.push(nodo.node.video_url);
                if (nodo.node.__typename === 'GraphImage') objetivo.media.push(nodo.node.thumbnail_resources[nodo.node.thumbnail_resources.length - 1].src);// Elige la imagen con mejor resolución
                if (nodo.node.__typename === 'GraphSidecar') {
                    nodo.node.edge_sidecar_to_children.edges.forEach(nodoHijo => {
                        if (nodoHijo.node.__typename === 'GraphImage') objetivo.media.push(nodoHijo.node.display_resources[nodoHijo.node.display_resources.length - 1].src);
                        if (nodoHijo.node.__typename === 'GraphVideo') objetivo.media.push(nodoHijo.node.video_url);
                    });
                };
            } else { // Seguidores o seguidos
                // Crea un objeto usuario
                var usuario = new Object();
                usuario.id = nodo.node.id;
                usuario.username = nodo.node.username;
                usuario.full_name = nodo.node.full_name;
                usuario.is_private = nodo.node.is_private;

                // Añade el usuario al array correspondiente
                if (seleccion === 'seguidores') {
                    objetivo.seguidores.push(usuario);
                } else {
                    objetivo.seguidos.push(usuario);
                }
            }
        });

        // Convertir datos a txt
        convertir(seleccion);
        parser(agente, objetivo);
    }

    /**
     * Convierte los resultados a texto
     * @param {string} seguidores | seguidos | media | completo
     */
    function convertir(seleccion) {
        var datosTexto = '';

        switch (seleccion) {
            case 'seguidores':
                objetivo.seguidores.forEach(function (e) {
                    datosTexto += `${e.id} ${e.full_name} https://instagram.com/${e.username}\n`;
                });
                descarga(`@${objetivo.nombre}_fllwers`, datosTexto);
                comprobarCoincidencias();
                break;

            case 'seguidos':
                objetivo.seguidos.forEach(function (e) {
                    datosTexto += `${e.id} ${e.full_name} https://instagram.com/${e.username}\n`;
                });
                descarga(`@${objetivo.nombre}_follows`, datosTexto);
                comprobarCoincidencias();
                break;

            case 'media':
                datosTexto += `LISTADO DE URLS MEDIA\nDescárguelas a su equipo con un gestor de descargas tipo JDownloader\n====================================================================\n`
                objetivo.media.forEach(function (e) {
                    datosTexto += `${e}\n`;
                });
                descarga(`@${objetivo.nombre}_media`, datosTexto);
                break;

            default:
                break;
        }

        /**
         * Funcion interna para comprobar coincidencias
         * despues que se hayan descargado ambas listas (seguidores y seguidos)
         */
        function comprobarCoincidencias() {
            // Analiza si hay resultados coincidentes, totales o parciales
            if (objetivo.seguidores.length > 0 && objetivo.seguidos.length > 0) {
                // Pregunta al usuario si desea buscar coincidencias
                Swal.fire({
                    title: 'Buscar coincidencias',
                    text: "¿Quieres buscar posibles perfiles mutuos?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Comprobar'
                }).then((result) => {
                    // Ventana 'Buscando datos'
                    if (result.isConfirmed) {
                        // Loop para buscar coincidencias entre los resultados
                        objetivo.seguidores.forEach(seguidor => {
                            objetivo.seguidos.forEach(seguido => {
                                // Coincidencia exacta: búsqueda por ID
                                if (seguidor.id === seguido.id) {
                                    objetivo.mutual.push(seguidor);
                                } else {
                                    // Coincidencia aproximada: busqueda por 'full_name'
                                    if (seguidor.full_name !== '') {
                                        if (seguidor.full_name === seguido.full_name) {
                                            // Añadimos al array los dos perfiles que difieren de su ID pero coincide su 'full name'
                                            objetivo.pos_mutual.push(seguidor);
                                            objetivo.pos_mutual.push(seguido);
                                        }
                                    }
                                }
                            })
                        });

                        // Procesa resultados de la busqueda de coincidencias
                        var existenCoincidencias = false;
                        var coincidencias = '';

                        if (objetivo.mutual.length > 0) {
                            existenCoincidencias = true;
                            coincidencias += `COINCIDENCIAS EXACTAS: ${objetivo.mutual.length}\n`;
                            objetivo.mutual.forEach((mut) => {
                                coincidencias += `${mut.id} ${mut.full_name} https://instagram.com/${mut.username}\n`;
                            });
                        } else if (objetivo.pos_mutual.length > 0) {
                            existenCoincidencias = true;
                            coincidencias += `\nCOINCIDENCIAS APROXIMADAS: ${objetivo.pos_mutual.length}\n`;
                            objetivo.pos_mutual.forEach((pos_mut) => {
                                coincidencias += `${pos_mut.id} ${pos_mut.full_name} https://instagram.com/${pos_mut.username}\n`;
                            })
                        }

                        if (existenCoincidencias) {
                            // Asigna el numero de coincidencias exactas a la variables
                            objetivo.num_mutual = objetivo.mutual.length;
                            parser(agente, objetivo);
                            descarga(`@${objetivo.nombre}_mutual`, coincidencias);
                        } else {
                            Swal.fire({
                                icon: 'info',
                                title: 'Resultado',
                                text: 'No hay coincidencias'
                            })
                        }
                    }
                })
            }
        }
    }

    /**
     * Genera la descarga del archivo
     * @param {string} filename nombre de archivo
     * @param {string} text contenido del archivo
     */
    function descarga(filename, text) {
        // Filename: sustituye los posibles puntos que pueda llevar
        var nombreArchivo = filename.replace(/\./g, '(p)');

        var el = GM_addElement(document.body, 'a', {
            href: `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
            download: nombreArchivo
        });

        el.style.display = 'none';
        el.click();
        document.body.removeChild(el);
    }
})();