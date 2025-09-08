import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(form),
    });
    alert(JSON.stringify(res));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}