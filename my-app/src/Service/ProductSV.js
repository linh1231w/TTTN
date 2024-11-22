import httpAxios from "../Httpaxios";

function getAll(categoryId = null) {
    let url = "product";
    if (categoryId) {
        url += `?categoryId=${categoryId}`;
    }
    return httpAxios.get(url);
}

function getbyID(id) {
    return httpAxios.get(`product/${id}`);
}

const ProductService = {
    getAll,
    getbyID,
    // getByParentId: getByParentId,
}
export default ProductService;