import { useEffect, useState } from "react";
import "./TovarCard.css";
import StoreProductsService, {
  StoreProduct,
} from "../services/StoreProductsService";
import ProductsService from "../services/ProductsService";

const TovarCard = () => {
  const [storeProduct, setStoreProduct] = useState<StoreProduct>();
  useEffect(() => {
    const fetchStoreProduct = async () => {
      const storeProductService = new StoreProductsService();
      const response = await storeProductService.getRowByUPC(
        StoreProductsService.UPC
      );
      setStoreProduct(response);
      // if (response.id_product) ProductsService.id = response.id_product;
    };

    fetchStoreProduct();
  }, []);

  return (
    <div>
      {storeProduct && (
        <div className="tovar-card">
          <h1>{storeProduct.product_name}</h1>
          <p className="tovar-card price">
            Ціна: {storeProduct.selling_price} грн.
          </p>
          <p className="tovar-card amount">
            Кількість наявних одиниць товару: {storeProduct.products_number}
          </p>
          <p className="tovar-card amount">
            Характеристики: {storeProduct.characteristics}
          </p>
        </div>
      )}
    </div>
  );
};

export default TovarCard;
