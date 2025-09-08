import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiFetch("/products").then(setProducts);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            <strong>{p.name}</strong> - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}