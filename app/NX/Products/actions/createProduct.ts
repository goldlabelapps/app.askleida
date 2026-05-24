import { T_Product } from '../exampleProduct';

export const CREATE_PRODUCT = 'CREATE_PRODUCT';

export function createProduct(product: T_Product) {
  return {
    type: CREATE_PRODUCT,
    payload: product,
  };
}
