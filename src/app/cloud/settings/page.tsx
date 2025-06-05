import { FiSettings, FiUser, FiLock, FiBell, FiDatabase, FiShare2, FiCreditCard, FiHelpCircle, FiMoon, FiLogOut } from 'react-icons/fi';

const SettingsPage = () => {
  const settingsCategories = [
    {
      title: "Account",
      icon: <FiUser className="text-blue-500" />,
      items: [
        { name: "Profile Information", description: "Update your name, email, and profile picture" },
        { name: "Change Password", description: "Update your account password" },
        { name: "Two-factor Authentication", description: "Add an extra layer of security" }
      ]
    },
    {
      title: "Notifications",
      icon: <FiBell className="text-purple-500" />,
      items: [
        { name: "Email Notifications", description: "Manage what emails you receive" },
        { name: "Push Notifications", description: "Control app notifications" },
        { name: "Sound & Vibration", description: "Customize alert preferences" }
      ]
    },
    {
      title: "Storage",
      icon: <FiDatabase className="text-green-500" />,
      items: [
        { name: "Storage Plan", description: "Upgrade or change your storage plan" },
        { name: "Auto Cleanup", description: "Set up automatic file cleanup" },
        { name: "Download Preferences", description: "Configure download settings" }
      ]
    },
    {
      title: "Sharing",
      icon: <FiShare2 className="text-yellow-500" />,
      items: [
        { name: "Link Sharing", description: "Manage default sharing settings" },
        { name: "Collaboration", description: "Set team collaboration preferences" },
        { name: "Access Requests", description: "Control who can request access" }
      ]
    }
  ];

  const otherSettings = [
    { name: "Billing & Payments", icon: <FiCreditCard className="text-gray-600" /> },
    { name: "Appearance", icon: <FiMoon className="text-gray-600" /> },
    { name: "Help & Support", icon: <FiHelpCircle className="text-gray-600" /> },
    { name: "Log Out", icon: <FiLogOut className="text-gray-600" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <FiSettings className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500">Manage your account preferences</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Settings Content */}
          <div className="flex-1">
            {settingsCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-gray-100 mr-3">
                    {category.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{category.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Settings Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">More Settings</h2>
              
              <div className="space-y-2">
                {otherSettings.map((setting, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                    <div className="p-2 rounded-lg bg-gray-100 mr-3">
                      {setting.icon}
                    </div>
                    <span className="font-medium text-gray-700">{setting.name}</span>
                  </div>
                ))}
              </div>

              {/* User Profile Card */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    JD
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">John Doe</h3>
                    <p className="text-sm text-gray-500">Free Plan • 2.6 GB available</p>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                  Manage Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;