const btnSubmit = document.querySelector('.btn-submit-createProduct');

function addProduct(idProduct, labelProduct, descriptionProduct, imageProduct, categoryProduct) {
    // FETCH POST
    fetch('')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Erreur', error))
}

function deleteProduct() {
    // FETCH DELETE
}

function editProduct() {
    // FETCH PATCH
}

function getProduct() {
    // FETCH GET
}

btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    const idProduct = document.querySelector('.input-id');
    const labelProduct = document.querySelector('.input-label');
    const descriptionProduct = document.querySelector('.input-description');
    const imageProduct = document.querySelector('.input-image');
    const categoryProduct = document.querySelector('.input-category');

    addProduct(idProduct, labelProduct, descriptionProduct, imageProduct, categoryProduct)
})
