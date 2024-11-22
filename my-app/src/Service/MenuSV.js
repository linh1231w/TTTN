import httpAxios from "../Httpaxios";


function getAll()
{
    return httpAxios.get("menu");
}

const MenuService = {
    getAll,
    // getByParentId: getByParentId,
}
export default MenuService;