import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Download, Upload, Loader2, AlertTriangle } from 'lucide-react';

const DataManagement: React.FC = () => {
    const { backupData, restoreData } = useAppContext();
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const handleBackupClick = async () => {
        setIsBackingUp(true);
        await backupData();
        setIsBackingUp(false);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsRestoring(true);
            await restoreData(file);
            // The app will reload on success, so no need to set isRestoring to false
        }
        // Reset file input
        event.target.value = '';
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Data Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Backup Section */}
                <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Download size={22} className="mr-2" />
                        Backup Data
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Create a full backup of your entire ERP database. The data will be saved as a JSON file on your computer. Keep this file in a safe place.
                    </p>
                    <button
                        onClick={handleBackupClick}
                        disabled={isBackingUp}
                        className="w-full bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isBackingUp ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Backing up...</span>
                            </>
                        ) : (
                           <span>Download Backup File</span>
                        )}
                    </button>
                </div>

                {/* Restore Section */}
                <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Upload size={22} className="mr-2" />
                        Restore Data
                    </h2>
                     <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md mb-6" role="alert">
                        <div className="flex">
                            <div className="py-1"><AlertTriangle className="h-5 w-5 text-red-500 mr-3" /></div>
                            <div>
                                <p className="font-bold">Warning!</p>
                                <p className="text-sm">Restoring from a backup file will permanently overwrite all existing data in the application. This action cannot be undone.</p>
                            </div>
                        </div>
                    </div>

                    <label
                        htmlFor="restore-file-upload"
                        className={`w-full cursor-pointer bg-secondary text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-600 ${isRestoring ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isRestoring ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Restoring...</span>
                            </>
                        ) : (
                           <span>Choose Backup File to Restore</span>
                        )}
                    </label>
                    <input
                        id="restore-file-upload"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isRestoring}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
