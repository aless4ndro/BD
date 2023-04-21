jQuery(document).ready(function ($) {
    const srcImg = "images/"; // emplacement des images de l'appli
    const albumDefaultMini = srcImg + "noComicsMini.jpeg";
    const albumDefault = srcImg + "noComics.jpeg";
    const srcAlbumMini = "albumsMini/"; // emplacement des images des albums en petit
    const srcAlbum = "albums/"; // emplacement des images des albums en grand
    const $searchResults = $("#searchResults");
    $("#searchField").val(""); // Ajoutez cette ligne pour initialiser la valeur de l'élément de recherche

    $("#searchQuery").on("input", updateSearch);// Ajoutez cette ligne pour mettre à jour la recherche à chaque fois que l'utilisateur tape quelque chose
    $("#searchOption").on("change", updateSearch);// Ajoutez cette ligne pour mettre à jour la recherche à chaque fois que l'utilisateur change l'option de recherche


    function updateSearch() {
        const searchText = $("#searchField").val() || "";
        const searchOption = $("input[name='searchOption']:checked").val();

        if (searchOption === "author") {
            displayAlbumsByAuthor(searchText);
        } else {
            displayAlbums(searchText);
        }
    }


    // Affichage des BD par auteur==================================================
    function displayAlbums(searchText) {
        const $listBySeries = $("<p>");
        const searchOption = $("input[name='searchOption']:checked").val();
        const searchTextLower = searchText.toLowerCase();

        for (const [idSerie, serie] of series.entries()) {// Pour chaque série
            const $li = $("<p>").text(serie.nom).addClass("serie-name"); // Créer un élément de liste
            const $ul = $("<ul>");// Créer une liste imbriquée
            //creer aussi un boutton pour ajouter la bd au panier



            for (const [idAlbum, album] of albums.entries()) {
                if (album.idSerie !== idSerie) {
                    continue;
                }

                const auteur = auteurs.get(album.idAuteur);// Récupérer l'auteur de l'album
                let match = false; // Indique si l'album correspond à la recherche

                switch (searchOption) {// Vérifier si l'album correspond à la recherche
                    case "all":
                        match = (
                            album.titre.toLowerCase().includes(searchTextLower) ||// Vérifier si le titre de l'album contient le texte recherché
                            serie.nom.toLowerCase().includes(searchTextLower) ||// Vérifier si le nom de la série contient le texte recherché
                            auteur.nom.toLowerCase().includes(searchTextLower)
                        );
                        break;
                    case "title":
                        match = album.titre.toLowerCase().includes(searchTextLower);
                        break;
                    case "author":
                        match = auteur.nom.toLowerCase().includes(searchTextLower);
                        break;
                    case "serie":
                        match = serie.nom.toLowerCase().includes(searchTextLower);
                        break;
                }

                if (!match) {
                    continue;
                }

                const $liAlbum = $("<li>").addClass("album-info");
                const $albumText = $("<span>").html(
                    `Album N°${album.numero}<br> ${album.titre} <br>Auteur: ${auteur.nom}`
                ).addClass("album-text");
                $liAlbum.append($albumText);

                const nomFic = `${serie.nom}-${album.numero}-${album.titre}`.replace(/'|!|\?|\.|"|:|\$/g, "");
                const $img = $("<img>")
                    .attr("src", `${srcAlbumMini}${nomFic}.jpg`)
                    .addClass("album-image");
                $liAlbum.append($img);

                const $addToCartBtn = $("<button>")// Ajouter un bouton pour ajouter l'album au panier
                    .text("Ajouter au panier")
                    .addClass("add-to-cart").addClass("add-to-cart-btn");
                $liAlbum.append($addToCartBtn);


                $liAlbum.attr("data-id", idAlbum);
                $ul.append($liAlbum);
            }

            $li.append($ul);

            if ($ul.children().length > 0) {
                $listBySeries.append($li);
            }
        }

        $searchResults
            .empty()
            .append($listBySeries);
        $searchResults.show();
    };



    function displayAlbumsByAuthor(searchText) {
        const $searchResults = $("#searchResults");
        $searchResults.empty();

        for (const [idAuteur, auteur] of auteurs.entries()) {
            if (auteur.nom.toLowerCase().includes(searchText.toLowerCase())) {
                for (const [idAlbum, album] of albums.entries()) {
                    if (album.idAuteur == idAuteur) {
                        const serie = series.get(album.idSerie);
                        const result = auteur.nom + ", Album N°" + album.numero + " " + album.titre + ", Série:" +
                            serie.nom;
                        const $result = $("<div>").text(result);
                        $searchResults.append($result);
                    }
                }
            }
        }
    }

    $("#searchBtn").on("click", function () {
        const searchText = $("#searchField").val();
        const searchOption = $("input[name='searchOption']:checked").val();
        console.log(searchOption);
        if (searchOption === "author") {
            displayAlbumsByAuthor(searchText);
        } else {
            displayAlbums(searchText);
        }
    });

    $("#searchField").on("keyup", function (event) {// Ajoutez cette ligne pour mettre à jour la recherche à chaque fois que l'utilisateur appuie sur la touche Entrée
        if (event.keyCode === 13) {//Condition pour vérifier si la touche appuyée est la touche Entrée 13 est le code de la touche Entrée
            $("#searchBtn").click();// Simuler un clic sur le bouton de recherche
        }

    });


    var txtSerie = document.getElementById("serie");
    var txtNumero = document.getElementById("numero");
    var txtTitre = document.getElementById("titre");
    var txtAuteur = document.getElementById("auteur");
    var txtPrix = document.getElementById("prix");
    // var imgAlbum = document.getElementById("album");
    //var imgAlbumMini = document.getElementById("albumMini");

    //imgAlbum.addEventListener("error", function () {prbImg(this)});
    //  imgAlbumMini.addEventListener("error", function () {prbImg(this)});

    /**
     * Récupération de l'album par son id et appel de
     * la fonction d'affichage
     *
     * @param {number} num
     */
    function getAlbum(num) {

        var album = albums.get(num.value);

        if (album === undefined) {
            txtSerie.value = "";
            txtNumero.value = "";
            txtTitre.value = "";
            txtAuteur.value = "";
            txtPrix.value = 0;

            afficheAlbums($("#albumMini"), $("#album"), albumDefaultMini, albumDefault);

        } else {

            var serie = series.get(album.idSerie);
            var auteur = auteurs.get(album.idAuteur);

            txtSerie.value = serie.nom;
            txtNumero.value = album.numero;
            txtTitre.value = album.titre;
            txtAuteur.value = auteur.nom;
            txtPrix.value = album.prix;

            var nomFic = serie.nom + "-" + album.numero + "-" + album.titre;

            // Utilisation d'une expression régulière pour supprimer les caractères non
            // autorisés dans les noms de fichiers : '!?.":$
            nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, "");

            afficheAlbums(
                $("#albumMini"),
                $("#album"),
                srcAlbumMini + nomFic + ".jpg",
                srcAlbum + nomFic + ".jpg"
            );

        }
    }

    /**
     * Affichage des images, les effets sont chainés et traités
     * en file d'attente par jQuery d'où les "stop()) et "clearQueue()"
     * pour éviter l'accumulation d'effets si défilement rapide des albums.
     *
     * @param {object jQuery} $albumMini
     * @param {object jQuery} $album
     * @param {string} nomFic
     * @param {string} nomFicBig
     */
    function afficheAlbums($albumMini, $album, nomFicMini, nomFic) {
        $album
            .stop(true, true)
            .clearQueue()
            .fadeOut(100, function () {
                $album.attr('src', nomFic);
                $albumMini
                    .stop(true, true)
                    .clearQueue()
                    .fadeOut(150, function () {
                        $albumMini.attr('src', nomFicMini);
                        $albumMini.slideDown(200, function () {
                            $album.slideDown(200);
                        });
                    })
            });

    }

    /**
     * Affichage de l'image par défaut si le chargement de l'image de l'album
     * ne s'est pas bien passé
     *
     * @param {object HTML} element
     */
    function prbImg(element) {
        // console.log(element);
        if (element.id === "albumMini")
            element.src = albumDefaultMini;
        else
            element.src = albumDefault;

    }

    // listener sur les liens de la liste des albums
    $searchResults.on("click", "li", function () {
        var albumId = $(this).attr("data-id");
        if (albumId) {
            var album = albums.get(albumId.toString());
            if (album) {
                openModal(album);
            }
        }
    });

    // fonction d'affichage du modal
    function openModal(album) {
        // Créez les éléments du modal
        const $modal = $('<div>').addClass('modal fade').attr('id', 'modal').attr('tabindex', '-1').attr('role', 'dialog').attr('aria-labelledby', 'modalLabel').attr('aria-hidden', 'true');
        const $modalDialog = $('<div>').addClass('modal-dialog').attr('role', 'document');
        const $modalContent = $('<div>').addClass('modal-content');
        const $modalHeader = $('<div>').addClass('modal-header');
        const $modalTitle = $('<h5>').addClass('modal-title').attr('id', 'modal-title');
        const $closeButton = $('<button>').addClass('close').attr('type', 'button').attr('data-bs-dismiss', 'modal').attr('aria-label', 'Close');
        const $closeSpan = $('<span>').attr('aria-hidden', 'true').html('&times;');
        const $modalBody = $('<div>').addClass('modal-body').attr('id', 'modal-body');
        const $modalImage = $('<img>').attr('src', '').attr('alt', '').attr('id', 'modal-image').addClass('img-fluid');
        const $infosAlbum = $('<ul>').attr('id', 'infos-album');
        const $modalContentDiv = $('<div>').attr('id', 'modal-content');
        const $modalFooter = $('<div>').addClass('modal-footer');

        // Assemblez les éléments du modal
        $closeButton.append($closeSpan);
        $modalHeader.append($modalTitle).append($closeButton);
        $modalBody.append($modalImage).append($infosAlbum).append($modalContentDiv);
        $modalContent.append($modalHeader).append($modalBody).append($modalFooter);
        $modalDialog.append($modalContent);
        $modal.append($modalDialog);

        // Ajoutez le modal au DOM
        $('body').append($modal);

        const auteur = auteurs.get(album.idAuteur);
        const serie = series.get(album.idSerie);

        $modalTitle.text("Album N°" + album.numero + " " + album.titre);

        var nomFic = serie.nom + "-" + album.numero + "-" + album.titre;
        nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, "");

        const prix = parseFloat(album.prix); // Convertir le prix en nombre

        $infosAlbum
            .empty()
            .append("<li>Auteur: " + auteur.nom + "</li>")
            .append("<li>Série: " + serie.nom + "</li>")
            .append("<li>Prix: " + album.prix + " €</li>");


        $('#modal').modal('show');

        // Supprimer le modal du DOM après sa fermeture
        $('#modal').on('hidden.bs.modal', function () {
            $('#modal').remove();
        });
    }
});


// Ajoutez ce script pour initialiser le panier
let cart = [];

function addToCart(idAlbum) {// Ajoutez un album au panier
    const album = albums.get(idAlbum);// Récupérez l'album à partir de son id
    const cartItem = {// Créez un objet représentant l'album
        ...album,// Copiez toutes les propriétés de l'album
        quantity: 1// Ajoutez une propriété quantity
    };
    cart.push(cartItem);// Ajoutez l'objet à la fin du tableau cart
    updateCartDisplay();// Mettez à jour l'affichage du panier
}



function updateCartDisplay() {
    const $cartItems = $('#cart ul');
    $cartItems.empty();

    let total = 0;

    cart.forEach((item, index) => {
        const auteur = auteurs.get(item.idAuteur);
        const li = $('<li>')
            .html(`<span class="remove-item" data-index="${index}">&times;</span> ${auteur.nom} - ${item.titre} 
                   <button class="minus" data-index="${index}">-</button>
                   <span class="quantity">${item.quantity}</span>
                   <button class="plus" data-index="${index}">+</button>`)
            .data('index', index);
        $cartItems.append(li);
        total += parseFloat(item.prix) * item.quantity;
    });

    $('.total').text(total.toFixed(2));
}


$(document).off("click", ".add-to-cart").on("click", ".add-to-cart", function () {
    const idAlbum = $(this).parent().attr("data-id");
    addToCart(idAlbum);
});

$("#pay").on("click", function () {
    if (cart.length === 0) {
        alert("Votre panier est vide.");
    } else {
        // Ici, vous pouvez ajouter le code pour gérer le processus de paiement.
        alert("Le paiement a été effectué avec succès.");
        cart = [];
        updateCartDisplay();
    }

});


// Ajoutez un écouteur d'événement "click" pour la croix
$(document).on("click", ".remove-item", function () {
    const itemIndex = $(this).data('index');
    removeCartItem(itemIndex);
});

function removeCartItem(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}


// Gestion des boutons + et -

$(document).on("click", ".plus", function () {
    const itemIndex = $(this).data('index');
    const item = cart[itemIndex];
    item.quantity++;
    updateCartDisplay();
});

$(document).on("click", ".minus", function () {
    const itemIndex = $(this).data('index');
    const item = cart[itemIndex];
    if (item.quantity > 1) {
        item.quantity--;
        updateCartDisplay();
    }
});






