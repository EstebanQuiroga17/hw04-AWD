import React, { useState } from 'react';
import './App.css';

function App() {
  // Feature 1 State
  const [products, setProducts] = useState([
    { id: 1, name: '', price: '' },
    { id: 2, name: '', price: '' },
    { id: 3, name: '', price: '' },
    { id: 4, name: '', price: '' },
    { id: 5, name: '', price: '' },
  ]);
  const [total, setTotal] = useState(null);

  // Feature 2 State
  const [ivaProduct, setIvaProduct] = useState({ name: '', price: '' });
  const [ivaResult, setIvaResult] = useState(null);

  // Feature 3 State
  const [expProduct, setExpProduct] = useState({ name: '', day: '', month: '', year: '' });
  const [daysLeft, setDaysLeft] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const computeTotal = async () => {
    try {
      const response = await fetch(`${API_URL}/api/total`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: products.map(p => ({ ...p, price: parseFloat(p.price) || 0 })) })
      });
      if (response.ok) {
        const data = await response.json();
        setTotal(data.total);
      } else {
        throw new Error("Backend not connected");
      }
    } catch (e) {
      // Fallback calculation if backend is not running
      const sum = products.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
      setTotal(sum);
    }
  };

  const computeIVA = async () => {
    try {
      const response = await fetch(`${API_URL}/api/iva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(ivaProduct.price) || 0 })
      });
      if (response.ok) {
        const data = await response.json();
        setIvaResult(data.iva);
      } else {
        throw new Error("Backend not connected");
      }
    } catch (e) {
      // Fallback calculation
      setIvaResult((parseFloat(ivaProduct.price) || 0) * 0.15); // Assuming 15% IVA
    }
  };

  const computeExpiration = async () => {
    try {
      const response = await fetch(`${API_URL}/api/expiration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: parseInt(expProduct.day),
          month: parseInt(expProduct.month),
          year: parseInt(expProduct.year)
        })
      });
      if (response.ok) {
        const data = await response.json();
        setDaysLeft(data.daysLeft);
      } else {
        throw new Error("Backend not connected");
      }
    } catch (e) {
      // Fallback calculation
      const today = new Date();
      // month is 0-indexed in JS Date
      const expDate = new Date(parseInt(expProduct.year), parseInt(expProduct.month) - 1, parseInt(expProduct.day));
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Product Management System</h1>
        <p>Frontend Computations Interface</p>
      </header>

      <main className="grid-container">
        {/* Feature 1: Shopping Cart Total */}
        <section className="card feature-card">
          <div className="card-header">
            <h2>🛒 Compute Total</h2>
            <p>Add 5 products to calculate the total price.</p>
          </div>
          <div className="card-body">
            {products.map((product, index) => (
              <div key={product.id} className="input-group">
                <input
                  type="text"
                  placeholder={`Product ${index + 1} Name`}
                  value={product.name}
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                  className="input-field"
                />
              </div>
            ))}
            <button className="primary-btn" onClick={computeTotal}>Calculate Total</button>
            {total !== null && (
              <div className="result-box">
                <span className="result-label">Total Price:</span>
                <span className="result-value">${total.toFixed(2)}</span>
              </div>
            )}
          </div>
        </section>

        {/* Feature 2: Compute IVA */}
        <section className="card feature-card">
          <div className="card-header">
            <h2>🧾 Compute IVA</h2>
            <p>Calculate the IVA (15%) for a single product.</p>
          </div>
          <div className="card-body">
            <div className="input-group">
              <input
                type="text"
                placeholder="Product Name"
                value={ivaProduct.name}
                onChange={(e) => setIvaProduct({ ...ivaProduct, name: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Price"
                value={ivaProduct.price}
                onChange={(e) => setIvaProduct({ ...ivaProduct, price: e.target.value })}
                className="input-field"
              />
            </div>
            <button className="primary-btn" onClick={computeIVA}>Calculate IVA</button>
            {ivaResult !== null && (
              <div className="result-box">
                <span className="result-label">IVA Amount:</span>
                <span className="result-value">${ivaResult.toFixed(2)}</span>
              </div>
            )}
          </div>
        </section>

        {/* Feature 3: Expiration Time */}
        <section className="card feature-card">
          <div className="card-header">
            <h2>⏳ Expiration Time</h2>
            <p>Calculate days left based on expiration date.</p>
          </div>
          <div className="card-body">
            <div className="input-group">
              <input
                type="text"
                placeholder="Product Name"
                value={expProduct.name}
                onChange={(e) => setExpProduct({ ...expProduct, name: e.target.value })}
                className="input-field full-width"
              />
            </div>
            <div className="input-group date-inputs">
              <input
                type="number"
                placeholder="DD"
                min="1" max="31"
                value={expProduct.day}
                onChange={(e) => setExpProduct({ ...expProduct, day: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="MM"
                min="1" max="12"
                value={expProduct.month}
                onChange={(e) => setExpProduct({ ...expProduct, month: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="YYYY"
                value={expProduct.year}
                onChange={(e) => setExpProduct({ ...expProduct, year: e.target.value })}
                className="input-field"
              />
            </div>
            <button className="primary-btn" onClick={computeExpiration}>Calculate Days Left</button>
            {daysLeft !== null && (
              <div className={`result-box ${daysLeft < 0 ? 'expired' : 'valid'}`}>
                <span className="result-label">Status:</span>
                <span className="result-value">
                  {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : `${daysLeft} days left`}
                </span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
