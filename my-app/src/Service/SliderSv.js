import httpAxios from "../Httpaxios";

function getAll() {
    return httpAxios.get("slider");
}

const SliderService = {
    getAll,
}

export default SliderService;