import { useEffect, useState } from "react";
import MenuService from "../../../Service/MenuSV";

function Menu() {
    const [menus, setMenus] = useState([]);



//goi api
useEffect(() => {
    MenuService.getAll()
      .then(response => {
        setMenus(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

console.log(menus)

  return (
    <div className="menu-desktop">
      <ul className="main-menu">
      {menus.map(menu => (
        <li key={menu.id}>
          <a href={menu.url}>{menu.name}</a>
        </li>
       
         ))}
      </ul>
    </div>
  );
}

export default Menu;
