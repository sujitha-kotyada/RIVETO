import { useContext } from 'react';
import { notificationContext } from '../context/NotificationContext';
import { BsBell, BsTrash, BsCheckCircle } from 'react-icons/bs';
import { FaInbox, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useContext(notificationContext);
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'order_status_updated':
        return <BsCheckCircle className="text-green-500 text-lg" />;
      default:
        return <BsBell className="text-blue-500 text-lg" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] pt-28 px-4 md:px-10 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Back and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white dark:bg-[#121826] text-gray-700 dark:text-gray-300 shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="text-sm font-semibold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="self-start sm:self-auto text-sm font-medium py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-[#121826] rounded-2xl p-10 text-center shadow-md">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaInbox className="text-gray-400 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your inbox is clean!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              We'll notify you when there are updates on your orders or account.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#121826] rounded-2xl shadow-md divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-5 flex items-start gap-4 transition-all duration-200 ${
                  notif.read ? 'bg-transparent' : 'bg-blue-50/20 dark:bg-blue-900/10'
                } hover:bg-gray-50 dark:hover:bg-[#1a2332]`}
              >
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl mt-1 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-base font-semibold truncate ${
                      notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          title="Mark as read"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                        >
                          <FaCheck className="text-xs" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif._id)}
                        title="Delete notification"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                      >
                        <BsTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
