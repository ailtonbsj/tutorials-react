import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './service/ProductService';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getProducts().then(data => setProducts(data));
  }, []);

  return (
    <>
      <h1>Basic Datatable</h1>
      <div className="card">
        <DataTable showGridlines stripedRows value={products} tableStyle={{ minWidth: '50rem' }}
          paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} sortMode="multiple">
          <Column field="code" header="Code" sortable style={{ width: '8%' }}></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="category" header="Category" sortable></Column>
          <Column field="quantity" header="Quantity" sortable></Column>
        </DataTable>
      </div>
    </>
  )
}

export default App
