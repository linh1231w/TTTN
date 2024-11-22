import httpAxios from "../Httpaxios";


function getAll()
{
    return httpAxios.get("brand");
}

const BrandService = {
    getAll,
    // getByParentId: getByParentId,
}
export default BrandService;