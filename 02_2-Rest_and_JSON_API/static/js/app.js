const URL = "http://localhost:5000/api";

function createCupcakeHTML(cupcake) {
    return `
        <div data-cupcake-id=${cupcake.id}>
            <li>
                ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
                <button class="delete-button">X</button>
            </li>
            <img class="cupcake-img"
                src="${cupcake.image}"
                alt="(no image provided)">
        </div>
        `;
}

async function appendCupcakes() {
    const resp = await axios.get(`${URL}/cupcakes`);
    for (let cupcake of resp.data.cupcakes) {
        let newCupcake = $(createCupcakeHTML(cupcake));
        $("#cupcake-container").append(newCupcake);
    }
}

$(appendCupcakes);

$("#cupcake-container").on("click", ".delete-button", async function (evt) {
    evt.preventDefault();

    let $cupcake = $(evt.target).closest("div");
    let cupcakeId = $cupcake.attr("data-cupcake-id");

    await axios.delete(`${URL}/cupcakes/${cupcakeId}`);
    $cupcake.remove();
});

$("#cupcake-form").on("submit", async function (evt) {
    evt.preventDefault();

    let flavor = $("#flavor-form").val();
    let size = $("#size-form").val();
    let rating = $("#rating-form").val();
    let image = $("#image-form").val();

    const newCupcakeResp = await axios.post(`${URL}/cupcakes`, {
        flavor, rating, size, image
    });

    let newCupcake = $(createCupcakeHTML(newCupcakeResp.data.cupcake));
    $("#cupcake-container").append(newCupcake);
    $("#cupcake-form").trigger("reset");
});