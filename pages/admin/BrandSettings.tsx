import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/auth';
import { Permission, ThemeColors, CompanyProfile } from '../../types';
import { Upload, Trash2, Palette, Save, Briefcase } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import ImageEditorModal from '../../components/ui/ImageEditorModal';

const BrandSettings: React.FC = () => {
    const { logoUrl, setLogoUrl, themeColors, setThemeColors, companyProfile, setCompanyProfile } = useAppContext();
    const { hasPermission } = useAuth();
    
    const [colors, setColors] = useState<ThemeColors>(themeColors);
    const [profileData, setProfileData] = useState<CompanyProfile>(companyProfile);

    // State for save actions
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [showProfileSuccess, setShowProfileSuccess] = useState(false);
    const [isSavingTheme, setIsSavingTheme] = useState(false);
    const [showThemeSuccess, setShowThemeSuccess] = useState(false);

    // New state for logo editor
    const [isLogoEditorOpen, setIsLogoEditorOpen] = useState(false);
    const [tempLogoSrc, setTempLogoSrc] = useState<string | null>(null);

    const canManage = hasPermission(Permission.MANAGE_BRANDING);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validation
            const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Please upload a PNG, JPG, or SVG file.');
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File is too large. Please upload an image smaller than 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setTempLogoSrc(reader.result as string);
                setIsLogoEditorOpen(true);
            };
            reader.readAsDataURL(file);
        }
        // Clear the input value so the same file can be selected again
        e.target.value = '';
    };

    const handleSaveLogo = (processedLogo: string) => {
        setLogoUrl(processedLogo);
        setIsLogoEditorOpen(false);
        setTempLogoSrc(null);
    };
    
    const handleCloseLogoEditor = () => {
        setIsLogoEditorOpen(false);
        setTempLogoSrc(null);
    };

    const handleRemoveLogo = () => {
        if (window.confirm('Are you sure you want to remove the company logo?')) {
            setLogoUrl(null);
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColors({ ...colors, [e.target.name]: e.target.value });
    };

    const handleSaveTheme = () => {
        setIsSavingTheme(true);
        // Simulate API call
        setTimeout(() => {
            setThemeColors(colors);
            setIsSavingTheme(false);
            setShowThemeSuccess(true);
            setTimeout(() => setShowThemeSuccess(false), 3000);
        }, 500);
    };
    
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: name === 'salesTaxRate' ? Number(value) : value });
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileData.name.trim() || !profileData.address.trim() || !profileData.phone.trim() || !profileData.email.trim()) {
            alert("Please fill all required fields: Company Name, Address, Phone, and Email.");
            return;
        }

        setIsSavingProfile(true);
        // Simulate API call
        setTimeout(() => {
            setCompanyProfile(profileData);
            setIsSavingProfile(false);
            setShowProfileSuccess(true);
            setTimeout(() => setShowProfileSuccess(false), 3000);
        }, 500);
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Company Settings</h1>
            
            <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center"><Briefcase size={22} className="mr-2"/> Company Information</h2>
                <form onSubmit={handleProfileSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Name</label>
                            <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required disabled={!canManage} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} required disabled={!canManage} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} required disabled={!canManage} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <input type="text" name="website" value={profileData.website || ''} onChange={handleProfileChange} disabled={!canManage} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea name="address" value={profileData.address} onChange={handleProfileChange} required disabled={!canManage} rows={3} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70"></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Sales Tax Rate (%)</label>
                            <input type="number" name="salesTaxRate" value={profileData.salesTaxRate} onChange={handleProfileChange} required disabled={!canManage} min="0" step="0.01" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This rate will be used as the default for all new sales and purchases.</p>
                        </div>
                    </div>
                    {canManage && (
                        <div className="mt-6 flex justify-end items-center">
                             {showProfileSuccess && <span className="text-green-500 mr-4 transition-opacity duration-300">Saved!</span>}
                            <button type="submit" disabled={isSavingProfile} className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-emerald-600 disabled:opacity-50 min-w-[190px] justify-center">
                                <Save size={20} />
                                <span>{isSavingProfile ? 'Saving...' : 'Save Company Info'}</span>
                            </button>
                        </div>
                    )}
                </form>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Settings */}
                <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><Upload size={22} className="mr-2"/> Company Logo</h2>
                    <div className="flex flex-col items-center border-2 border-dashed dark:border-gray-600 rounded-lg p-8">
                        <p className="mb-4 text-sm text-gray-500">Current Logo:</p>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <Logo src={logoUrl} style={{ height: '60px' }} />
                        </div>
                    </div>
                    {canManage && (
                        <div className="mt-6 flex items-center justify-center space-x-4">
                            <label htmlFor="logo-upload" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700">
                                <Upload size={20} />
                                <span>{logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                            </label>
                            <input id="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml, image/jpg" className="hidden" onChange={handleLogoUpload}/>
                            {logoUrl && (
                                <button onClick={handleRemoveLogo} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600">
                                    <Trash2 size={20} />
                                    <span>Remove</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Color Scheme Settings */}
                <div className="bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><Palette size={22} className="mr-2"/> Color Scheme</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="primary-color" className="block text-sm font-medium mb-1">Primary Color</label>
                            <div className="flex items-center space-x-2">
                                <input type="color" id="primary-color" name="primary" value={colors.primary} onChange={handleColorChange} disabled={!canManage} className="h-10 w-10 p-1 border-none rounded-lg cursor-pointer disabled:cursor-not-allowed" />
                                <input type="text" value={colors.primary} onChange={handleColorChange} name="primary" disabled={!canManage} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="secondary-color" className="block text-sm font-medium mb-1">Secondary Color</label>
                            <div className="flex items-center space-x-2">
                                <input type="color" id="secondary-color" name="secondary" value={colors.secondary} onChange={handleColorChange} disabled={!canManage} className="h-10 w-10 p-1 border-none rounded-lg cursor-pointer disabled:cursor-not-allowed" />
                                <input type="text" value={colors.secondary} onChange={handleColorChange} name="secondary" disabled={!canManage} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                        </div>
                    </div>
                     {canManage && (
                        <div className="mt-6 flex justify-end items-center">
                            {showThemeSuccess && <span className="text-green-500 mr-4 transition-opacity duration-300">Saved!</span>}
                            <button onClick={handleSaveTheme} disabled={isSavingTheme} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 disabled:opacity-50 min-w-[150px] justify-center">
                                <Save size={20} />
                                <span>{isSavingTheme ? 'Saving...' : 'Save Theme'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ImageEditorModal
                isOpen={isLogoEditorOpen}
                src={tempLogoSrc}
                onSave={handleSaveLogo}
                onClose={handleCloseLogoEditor}
            />
        </div>
    );
};

export default BrandSettings;