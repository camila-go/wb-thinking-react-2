import { useState } from 'react';
import axios from 'axios';
import EditableRowModeButtons from './EditableRowModeButtons.jsx';
import EditableDescriptionCell from './EditableDescriptionCell.jsx';
import EditableRateCell from './EditableRateCell.jsx';
import EditableHoursCell from './EditableHoursCell.jsx';
import formatCurrency from '../utils/formatCurrency.js';

function InvoiceTableRow({ initialInvoiceData, initialIsEditing, onDeleteRow }) {
  const [isEditing, setIsEditing] = useState(initialIsEditing);

  const [description, setDescription] = useState(initialInvoiceData.description);
  const [rate, setRate] = useState(initialInvoiceData.rate);
  const [hours, setHours] = useState(initialInvoiceData.hours);

  const setEditMode = () => setIsEditing(true);
  const setNormalMode = async () => {
    const { data } = await axios.put(`/api/invoice/${initialInvoiceData.id}`, {
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

export default InvoiceTableRow;
