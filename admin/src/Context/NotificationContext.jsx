import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import axios from "axios";
import { adminDataContext } from "./AdminProvider";
import { authDataContext } from "./AuthProvider";

export const adminNotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { adminData } = useContext(adminDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = async () => {
    if (!adminData) return;
    try {
      const response = await axios.get(`${serverUrl}/api/notifications/admin`, {
        withCredentials: true,
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Error fetching admin notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${serverUrl}/api/notifications/${id}/read`, {}, {
        withCredentials: true,
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${serverUrl}/api/notifications/read-all-admin`, {}, {
        withCredentials: true,
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All admin notifications marked as read");
    } catch (err) {
      console.error("Error marking all admin read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/notifications/${id}`, {
        withCredentials: true,
      });
      const wasUnread = notifications.find((n) => n._id === id && !n.read);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  useEffect(() => {
    if (adminData) {
      fetchNotifications();

      const newSocket = io(serverUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("🔌 Admin Socket.io connected");
      });

      newSocket.on("notification", (newNotif) => {
        console.log("👑 New admin notification received:", newNotif);
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.info(
          <div>
            <strong className="block text-sm font-semibold">{newNotif.title}</strong>
            <span className="text-xs">{newNotif.message}</span>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [adminData, serverUrl]);

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <adminNotificationContext.Provider value={value}>
      {children}
    </adminNotificationContext.Provider>
  );
}

export default NotificationProvider;
