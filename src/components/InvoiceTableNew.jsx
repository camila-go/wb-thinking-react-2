import axios from 'axios';
import { useState } from 'react';
import formatCurrency from '../utils/formatCurrency.js';
import './InvoiceTable.css';

function InvoiceTableHeader() {
  return (
    <tr>
      <th></th>
      <th>Description</th>
      <th>Rate</th>
      <th>Hours</th>
      <th>Amount</th>
    </tr>
  );
}

function EditableRowModeButtons({ isEditing, onEditClick, onSaveClick, onDeleteClick }) {
  return isEditing ? (
    <td>
      <button onClick={onSaveClick}>Save</button>
    </td>
  ) : (
    <td>
      <button onClick={onDeleteClick}>Delete</button>
      <button onClick={onEditClick}>Edit</button>
    </td>
  );
}

function EditableDescriptionCell({ value, isEditing, onValueChange }) {
  return isEditing ? (
    <td>
      <input type="text" value={value} onChange={(e) => onValueChange(e.target.value)} />
    </td>
  ) : (
    <td>{value}</td>
  );
}

function EditableRateCell({ value, isEditing, onValueChange }) {
  return isEditing ? (
    <td>
      $<input type="text" value={value} onChange={(e) => onValueChange(e.target.value)} />
      /hr
    </td>
  ) : (
    <td>{formatCurrency(value)}/hr</td>
  );
}

function EditableHoursCell({ value, isEditing, onValueChange }) {
  return isEditing ? (
    <td>
      <input type="text" value={value} onChange={(e) => onValueChange(e.target.value)} />
    </td>
  ) : (
    <td>{value}</td>
  );
}

function InvoiceTableRow({ initialInvoiceData, initialIsEditing, onDeleteRow }) {
  const [isEditing, setIsEditing] = useState(initialIsEditing);

  const [description, setDescription] = useState(initialInvoiceData.description);
  const [rate, setRate] = useState(initialInvoiceData.rate);
  const [hours, setHours] = useState(initialInvoiceData.hours);

  const setEditMode = () => setIsEditing(true);
  const setNormalMode = async () => {
    const { data } = await axios.post(`/api/invoice/${initialInvoiceData.id}`, {
      description,
      rate,
      hours,
    });

    if (!data.error) {
      setDescription(data.description);
      setRate(data.rate);
      setHours(data.hours);
    }

    setIsEditing(false);
  };

  return (
    <tr>
      <EditableRowModeButtons
        isEditing={isEditing}
        onEditClick={setEditMode}
        onSaveClick={setNormalMode}
        onDeleteClick={onDeleteRow}
      />
      <EditableDescriptionCell
        value={description}
        isEditing={isEditing}
        onValueChange={setDescription}
      />
      <EditableRateCell value={rate} isEditing={isEditing} onValueChange={setRate} />
      <EditableHoursCell value={hours} isEditing={isEditing} onValueChange={setHours} />
      <td>{formatCurrency(rate * hours)}</td>
    </tr>
  );
}

function InvoiceTableAddButton({ onClick }) {
  return (
    <tr>
      <td></td>
      <td colSpan="4">
        <button onClick={onClick}>Add</button>
      </td>
    </tr>
  );
}

function InvoiceTable({ initialInvoiceList }) {
  const [invoiceList, setInvoiceList] = useState(initialInvoiceList);

  const addInvoiceRow = async () => {
    const { data } = await axios.post('/api/invoice', { description: 'Description' });

    const newInvoice = { ...data, isEditing: true };
    setInvoiceList([...invoiceList, newInvoice]);
  };

  const deleteInvoiceRow = async (id) => {
    const { data } = await axios.post(`/api/invoice/${id}/delete`);

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
