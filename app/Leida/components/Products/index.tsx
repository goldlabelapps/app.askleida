import Products from './Products';
import ProductDetail from './components/ProductDetail';
import ProductNew from './components/ProductNew';
import { initProducts } from './actions/initProducts';
import { useProducts } from './hooks/useProducts';
import { setProducts } from './actions/setProducts';
import { createProduct } from './actions/createProduct';
import { patchProduct } from './actions/patchProduct';
import { deleteProduct } from './actions/deleteProduct';
export {
    Products,
    ProductDetail,
    ProductNew,
    initProducts,
    useProducts,
    setProducts,
    createProduct,
    patchProduct,
    deleteProduct,
};
