import httpAxios from "../Httpaxios";


function getAll()
{
    return httpAxios.get("category");
}

const CategoryService = {
    getAll,
    // getByParentId: getByParentId,
}
export default CategoryService;