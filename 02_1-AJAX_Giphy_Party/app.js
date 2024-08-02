document.addEventListener("DOMContentLoaded", function () {
    const imageContainer = document.getElementById("image-container");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    function loadImages() {
        let images = localStorage.getItem("images");
        if (images == null) {
            images = [];
        } else {
            images = JSON.parse(images);
        }
        return images;
    }

    function appendImages() {
        let images = loadImages();

        for (i of images) {
            let image = document.createElement("img");
            image.setAttribute("data-img-id", i.id);
            image.src = i.src;
            imageContainer.appendChild(image);
        }
    }

    function saveImages(images) {
        localStorage.setItem("images", JSON.stringify(images));
    }

    appendImages();

    function addNewImage(searchTerm) {
        axios.get("https://api.giphy.com/v1/gifs/random", {
            params: {
                api_key: "Zkbn1pXPtJ0y00l3PotCmgEyQ2OXtPQW",
                tag: searchTerm
            }
        }).then(function (response) {
            console.log(response);

            let id = response.data.data.id;
            let src = response.data.data.images.original.url;
            let image = document.createElement("img");
            let images = loadImages();

            image.setAttribute("data-img-id", id);
            image.src = src;
            imageContainer.appendChild(image);

            images.push({ id, src });
            saveImages(images);
        }).catch(function (error) {
            console.log(error);
        });
    }

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let searchTerm = searchInput.value.trim();
        searchInput.value = '';
        addNewImage(searchTerm);
    });

    searchForm.addEventListener("reset", function (event) {
        if (searchInput.value != '')
            searchInput.value = '';

        let images = document.querySelectorAll('[data-img-id]');
        for (i of images)
            i.remove();

        saveImages([]);
    });
});