import './App.css';
import InvoiceTable from './components/InvoiceTable.jsx';

function App({ initialInvoiceList }) {
  return <InvoiceTable initialInvoiceList={initialInvoiceList} />;
}

export default App;
