import { FiHardDrive, FiImage, FiVideo, FiMusic, FiFile, FiMoreVertical } from 'react-icons/fi';

const StoragePage = () => {
  const storageData = {
    total: 5, // in GB
    used: 2.4,
    remaining: 2.6,
    files: {
      images: 45,
      videos: 12,
      audio: 23,
      documents: 18,
      others: 7
    }
  };

  const fileTypes = [
    { name: 'Images', count: storageData.files.images, icon: <FiImage className="text-blue-500" />, color: 'bg-blue-500', size: '1.2 GB' },
    { name: 'Videos', count: storageData.files.videos, icon: <FiVideo className="text-purple-500" />, color: 'bg-purple-500', size: '0.8 GB' },
    { name: 'Audio', count: storageData.files.audio, icon: <FiMusic className="text-green-500" />, color: 'bg-green-500', size: '0.3 GB' },
    { name: 'Documents', count: storageData.files.documents, icon: <FiFile className="text-yellow-500" />, color: 'bg-yellow-500', size: '0.1 GB' },
    { name: 'Others', count: storageData.files.others, icon: <FiMoreVertical className="text-gray-500" />, color: 'bg-gray-500', size: '0.1 GB' }
  ];

  const usedPercentage = (storageData.used / storageData.total) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Storage</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Upgrade Plan
          </button>
        </div>

        {/* Storage Overview Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FiHardDrive className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Storage Overview</h2>
              <p className="text-gray-500">Used {storageData.used} GB of {storageData.total} GB</p>
            </div>
          </div>

          {/* Storage Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" 
                style={{ width: `${usedPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Remaining Storage */}
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-gray-800">{storageData.remaining} GB</p>
            <p className="text-gray-500">storage remaining</p>
          </div>
        </div>

        {/* File Type Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">File Types</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {fileTypes.map((fileType, index) => (
              <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="p-2 rounded-lg bg-gray-100 mr-4">
                  {fileType.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">{fileType.name}</span>
                    <span className="text-gray-500">{fileType.count} files</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${fileType.color}`} 
                      style={{ width: `${(parseFloat(fileType.size.split(' ')[0]) / storageData.used) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{fileType.size}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Files Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Files</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Sample recent files - in a real app these would be mapped from actual data */}
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-4 mb-2">
                  <FiImage className="text-blue-500 mx-auto text-2xl" />
                </div>
                <p className="text-sm font-medium truncate">Vacation.jpg</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-lg p-4 mb-2">
                  <FiVideo className="text-purple-500 mx-auto text-2xl" />
                </div>
                <p className="text-sm font-medium truncate">Tutorial.mp4</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-lg p-4 mb-2">
                  <FiMusic className="text-green-500 mx-auto text-2xl" />
                </div>
                <p className="text-sm font-medium truncate">Song.mp3</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 rounded-lg p-4 mb-2">
                  <FiFile className="text-yellow-500 mx-auto text-2xl" />
                </div>
                <p className="text-sm font-medium truncate">Report.pdf</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-2">
                  <FiMoreVertical className="text-gray-500 mx-auto text-2xl" />
                </div>
                <p className="text-sm font-medium truncate">Archive.zip</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoragePage;