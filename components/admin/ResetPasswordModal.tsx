import React, { useState } from 'react';
import { User } from '../../types';
import { useAppContext } from '../../context/AppContext';
import Modal from '../ui/Modal';
import { Save } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, user }) => {
  const { resetUserPassword } = useAppContext();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true);
    setError('');
    try {
        await resetUserPassword(user.id, password);
        alert('Password has been reset successfully.');
        onClose();
    } catch (err: any) {
        setError(err.message || 'Failed to reset password.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleClose = () => {
      setPassword('');
      setConfirmPassword('');
      setError('');
      setIsLoading(false);
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Reset Password for ${user.name}`}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center space-x-2 disabled:opacity-50">
                <Save size={20} />
                <span>{isLoading ? 'Saving...' : 'Reset Password'}</span>
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;