import React, { useEffect, useState } from 'react';
import { getDashboardData, DashboardData } from '../store/Product';

const SuperAdminPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!dashboardData) return <div>Failed to load data</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Super Admin Panel</h1>
      <p>Welcome to the Super Admin dashboard.</p>

      <div>
        <h2>Products ({dashboardData.products.length})</h2>
        <ul>
          {dashboardData.products.map(product => (
            <li key={product.id} style={{ marginBottom: 8 }}>
              <strong>{product.productName}</strong> - {product.price}₽
              {product.color && ` (${product.color})`}
              {product.categoryName && ` - ${product.categoryName}`}
              {product.quantity !== undefined && ` (Qty: ${product.quantity})`}
              {product.hasDiscount && ` - Discount: ${product.discountPrice}₽`}
              {product.image && (
                <div>
                  <img 
                    src={`https://store-api.softclub.tj/images/${product.image}`} 
                    alt={product.productName} 
                    width={50} 
                    style={{ display: 'block', marginTop: 4 }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>

        <h2>Colors ({dashboardData.colors.length})</h2>
        <ul>
          {dashboardData.colors.map(color => (
            <li key={color.id}>{color.colorName}</li>
          ))}
        </ul>

        <h2>Brands ({dashboardData.brands.length})</h2>
        <ul>
          {dashboardData.brands.map(brand => (
            <li key={brand.id}>{brand.brandName}</li>
          ))}
        </ul>

        <h2>Price Range</h2>
        <p>{dashboardData.minMaxPrice.minPrice}₽ - {dashboardData.minMaxPrice.maxPrice}₽</p>
      </div>
    </div>
  );
};

export default SuperAdminPage;
