import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [availableProducts, setAvailableProducts] = useState([]);
  
  const [selectedProductIds, setSelectedProductIds] = useState(['', '', '', '', '']);
  const [total, setTotal] = useState(null);

  const [selectedIvaProductId, setSelectedIvaProductId] = useState('');
  const [ivaResult, setIvaResult] = useState(null);

  const [selectedExpProductId, setSelectedExpProductId] = useState('');
  const [daysLeft, setDaysLeft] = useState(null);

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setAvailableProducts(data);
      }
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  const handleSelectProduct = (index, productId) => {
    const updated = [...selectedProductIds];
    updated[index] = productId;
    setSelectedProductIds(updated);
  };

  const computeTotal = async () => {
    try {
      const productsToSubmit = selectedProductIds
        .map(id => availableProducts.find(p => p._id === id || p.id === id))
        .filter(Boolean);

      const response = await fetch(`${API_URL}/api/total`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: productsToSubmit })
      });
      if (response.ok) {
        const data = await response.json();
        setTotal(data.total);
      }
    } catch (e) {
      console.error("Error computing total:", e);
    }
  };

  const computeIVA = async () => {
    try {
      const selectedProd = availableProducts.find(p => p._id === selectedIvaProductId || p.id === selectedIvaProductId);
      if (!selectedProd) return;

      const response = await fetch(`${API_URL}/api/iva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedProd.name, price: selectedProd.price })
      });
      if (response.ok) {
        const data = await response.json();
        setIvaResult(data.iva);
      }
    } catch (e) {
      console.error("Error computing IVA:", e);
    }
  };

  const computeExpiration = async () => {
    try {
      const selectedProd = availableProducts.find(p => p._id === selectedExpProductId || p.id === selectedExpProductId);
      if (!selectedProd) return;

      const response = await fetch(`${API_URL}/api/expiration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedProd.name,
          day: selectedProd.day,
          month: selectedProd.month,
          year: selectedProd.year
        })
      });
      if (response.ok) {
        const data = await response.json();
        setDaysLeft(data.daysLeft);
      }
    } catch (e) {
      console.error("Error computing expiration time:", e);
    }
  };

  const selectedIvaProduct = availableProducts.find(p => p._id === selectedIvaProductId || p.id === selectedIvaProductId);
  const selectedExpProduct = availableProducts.find(p => p._id === selectedExpProductId || p.id === selectedExpProductId);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Product Management System</h1>
        <p>Frontend Computations Interface</p>
      </header>

      <main className="grid-container">
        <section className="card feature-card">
          <div className="card-header">
            <h2>🛒 Compute Total</h2>
            <p>Select 5 products to calculate the total price.</p>
          </div>
          <div className="card-body">
            {selectedProductIds.map((selectedId, index) => {
              const matchedProduct = availableProducts.find(p => p._id === selectedId || p.id === selectedId);
              return (
                <div key={index} className="input-group">
                  <select
                    value={selectedId}
                    onChange={(e) => handleSelectProduct(index, e.target.value)}
                    className="input-field"
                  >
                    <option value="">-- Select Product {index + 1} --</option>
                    {availableProducts.map(p => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.name} (${p.price})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Price"
                    value={matchedProduct ? `$${matchedProduct.price}` : ''}
                    disabled
                    className="input-field"
                  />
                </div>
              );
            })}
            <button className="primary-btn" onClick={computeTotal}>Calculate Total</button>
            {total !== null && (
              <div className="result-box">
                <span className="result-label">Total Price:</span>
                <span className="result-value">${total.toFixed(2)}</span>
              </div>
            )}
          </div>
        </section>

        <section className="card feature-card">
          <div className="card-header">
            <h2>🧾 Compute IVA</h2>
            <p>Select a product to calculate its IVA (15%).</p>
          </div>
          <div className="card-body">
            <div className="input-group">
              <select
                value={selectedIvaProductId}
                onChange={(e) => setSelectedIvaProductId(e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Product --</option>
                {availableProducts.map(p => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Price"
                value={selectedIvaProduct ? `$${selectedIvaProduct.price}` : ''}
                disabled
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

        <section className="card feature-card">
          <div className="card-header">
            <h2>⏳ Expiration Time</h2>
            <p>Select a product to calculate days left.</p>
          </div>
          <div className="card-body">
            <div className="input-group">
              <select
                value={selectedExpProductId}
                onChange={(e) => setSelectedExpProductId(e.target.value)}
                className="input-field full-width"
              >
                <option value="">-- Select Product --</option>
                {availableProducts.map(p => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group date-inputs">
              <input
                type="text"
                placeholder="DD"
                value={selectedExpProduct ? selectedExpProduct.day : ''}
                disabled
                className="input-field"
              />
              <input
                type="text"
                placeholder="MM"
                value={selectedExpProduct ? selectedExpProduct.month : ''}
                disabled
                className="input-field"
              />
              <input
                type="text"
                placeholder="YYYY"
                value={selectedExpProduct ? selectedExpProduct.year : ''}
                disabled
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
