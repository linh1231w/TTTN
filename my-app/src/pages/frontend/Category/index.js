
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CategoryService from "../../../Service/CategorySV";

function Category({ onCategoryChange, isHomePage }) {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('*');
    const location = useLocation();

    useEffect(() => {
        CategoryService.getAll()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu danh mục:', error);
            });
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryId = searchParams.get('category');
        setActiveCategory(categoryId || '*');
    }, [location.search]);

    const handleCategoryClick = (event, categoryId) => {
        event.preventDefault();
        setActiveCategory(categoryId);
        onCategoryChange(categoryId === '*' ? null : categoryId);

        if (isHomePage) {
            // On home page, just update state without changing URL
            return;
        }
        
        if (categoryId === '*') {
            // For 'All Products', refresh the page
            window.location.href = '/product';
        } else {
            // For other categories, update URL without refreshing
            const newUrl = `/product?category=${categoryId}`;
            window.history.pushState({}, '', newUrl);
        }
    };

    return (
        <div className="flex-w flex-sb-m p-b-52">
            <div className="flex-w flex-l-m filter-tope-group m-tb-10">
                <button
                    onClick={(event) => handleCategoryClick(event, '*')}
                    className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${activeCategory === '*' ? 'how-active1' : ''}`}
                    data-filter="*"
                >
                    All Products
                </button>
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={(event) => handleCategoryClick(event, category.id)}
                        className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${activeCategory === category.id.toString() ? 'how-active1' : ''}`}
                        data-filter={`.${category.name.toLowerCase().replace(/\s+/g, '_')}`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Category;