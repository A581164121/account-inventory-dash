import React from 'react';
import Modal from './Modal';
import { EditLog } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface RecordHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordName: string;
  history: EditLog[];
}

const RecordHistoryModal: React.FC<RecordHistoryModalProps> = ({ isOpen, onClose, recordName, history = [] }) => {
    const { users } = useAppContext();
    const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown';
    
    const formatValue = (value: any) => {
        if (typeof value === 'boolean') return value ? 'True' : 'False';
        if (value === null || value === undefined || value === '') return <i className="text-gray-400">empty</i>;
        return String(value);
    }
    
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`History for ${recordName}`}>
      <div className="max-h-[60vh] overflow-y-auto">
        {history.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white dark:bg-dark-secondary">
              <tr className="border-b dark:border-gray-700">
                <th className="p-2 font-semibold">Date</th>
                <th className="p-2 font-semibold">User</th>
                <th className="p-2 font-semibold">Field</th>
                <th className="p-2 font-semibold">Old Value</th>
                <th className="p-2 font-semibold">New Value</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((log, index) => (
                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-2">{getUserName(log.userId)}</td>
                  <td className="p-2 font-semibold capitalize">{log.field}</td>
                  <td className="p-2">{formatValue(log.oldValue)}</td>
                  <td className="p-2 text-primary">{formatValue(log.newValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No edit history found for this record.</p>
        )}
      </div>
    </Modal>
  );
};

export default RecordHistoryModal;