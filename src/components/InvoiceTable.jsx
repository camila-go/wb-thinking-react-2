import { useState } from 'react';
import axios from 'axios';
import InvoiceTableRow from './InvoiceTableRow.jsx';
import InvoiceTableHeader from './InvoiceTableHeader.jsx';
import InvoiceTableAddButton from './InvoiceTableAddButton.jsx';

import './InvoiceTable.css';

function InvoiceTable({ initialInvoiceList }) {
  const [invoiceList, setInvoiceList] = useState(initialInvoiceList);

  const addInvoiceRow = async () => {
    const { data } = await axios.post('/api/invoice', { description: 'Description' });

    const newInvoice = { ...data, isEditing: true };
    setInvoiceList([...invoiceList, newInvoice]);
  };

  const deleteInvoiceRow = async (id) => {
    const { data } = await axios.delete(`/api/invoice/${id}/delete`);

    if (!data.error) {
      const newInvoiceList = [...invoiceList];

      const index = newInvoiceList.findIndex((invoice) => invoice.id === data.id);
      newInvoiceList.splice(index, 1);
      setInvoiceList(newInvoiceList);
    }
  };

  const rows = invoiceList.map(({ id, description, rate, hours, isEditing }) => (
    <InvoiceTableRow
      key={id}
      initialInvoiceData={{ id, description, rate, hours }}
      initialIsEditing={isEditing}
      onDeleteRow={() => deleteInvoiceRow(id)}
    />
  ));

  return (
    <table>
      <thead>
        <InvoiceTableHeader />
      </thead>
      <tbody>{rows}</tbody>
      <tfoot>
        <InvoiceTableAddButton onClick={addInvoiceRow} />
      </tfoot>
    </table>
  );
}

export default InvoiceTable;
