import React, { useState } from 'react';

const TransferModal = ({ isOpen, onClose, recipient, onTransfer }) => {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [currency, setCurrency] = useState('HIVE');
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) < 0.001) {
      alert('Minimum transfer amount is 0.001');
      return;
    }
    
    setIsLoading(true);
    try {
      await onTransfer(amount, memo, currency);
      setAmount('');
      setMemo('');
      setCurrency('HIVE');
      onClose();
    } catch (error) {
      console.error('Transfer error:', error);
      alert('Transfer failed: ' + error.message);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Transfer to @{recipient}</h3>
        <div className="modal-form">
          <div className="form-group">
            <label>Amount</label>
            <div className="amount-input-group">
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000"
                disabled={isLoading}
                className="amount-input"
              />
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={isLoading}
                className="currency-select"
              >
                <option value="HIVE">HIVE</option>
                <option value="HBD">HBD</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Memo (optional)</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add a public memo..."
              disabled={isLoading}
              maxLength={2048}
            />
            <small className="memo-hint">
              Note: Memos are public and stored on the blockchain
            </small>
          </div>
          <div className="transfer-info">
            <div className="info-item">
              <span>Recipient:</span>
              <strong>@{recipient}</strong>
            </div>
            <div className="info-item">
              <span>Amount:</span>
              <strong>{amount || '0.000'} {currency}</strong>
            </div>
            <div className="info-item">
              <span>Transaction Type:</span>
              <strong>Transfer</strong>
            </div>
          </div>
          <div className="modal-buttons">
            <button 
              className="cancel-button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="transfer-button" 
              onClick={handleTransfer}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Processing...</span>
                </>
              ) : (
                `Send ${currency}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal; 