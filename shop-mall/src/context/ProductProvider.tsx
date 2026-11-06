import { useState } from "react"
import { ProductContext } from "./ProductContext"
import type {NewProduct, Product} from "../types/product"
import {initialProducts} from "../datas/products"

const ProductProvider = ({children} : {children: React.ReactNode}) => {

    const [products, setProducts] = useState<Product[]>(initialProducts);

    // 상품 추가 함수
    const addProduct = (newProduct: NewProduct) => {
        const product: Product = {...newProduct, id: Date.now()};
        setProducts([...products, product])
    }

    return(
        <ProductContext.Provider value={{products, addProduct}}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductProvider