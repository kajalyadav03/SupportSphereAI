import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        notificationData,
        countData,
      ] = await Promise.all([
        api.get("/notifications"),
        api.get(
          "/notifications/unread-count"
        ),
      ]);

      setNotifications(
        notificationData.notifications || []
      );

      setUnreadCount(
        countData.unreadCount || 0
      );
    } catch (error) {
      console.error(
        "Get notifications error:",
        error
      );

      setError(
        error.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (
    notification
  ) => {
    if (notification.isRead) {
      return;
    }

    try {
      await api.patch(
        `/notifications/${notification._id}/read`
      );

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );

      setUnreadCount((previous) =>
        Math.max(previous - 1, 0)
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );

      setError(
        error.message ||
          "Failed to mark notification as read"
      );
    }
  };

  const handleNotificationClick = async (
    notification
  ) => {
    await markAsRead(notification);

    if (notification.ticket?._id) {
      navigate(
        `/tickets/${notification.ticket._id}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-0 min-h-screen lg:ml-64">

        <div className="mx-auto max-w-5xl px-4 py-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Updates
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Notifications
              </h1>

              <p className="mt-2 text-slate-400">
                Stay updated with your support
                activity.
              </p>
            </div>

            <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
              {unreadCount} unread
            </div>

          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
              {error}
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

            {loading ? (
              <div className="px-6 py-12 text-center text-slate-400">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-6 py-12 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-2xl">
                  🔔
                </div>

                <p className="mt-4 text-lg font-semibold">
                  No notifications
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  You're all caught up.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-white/10">

                {notifications.map(
                  (notification) => (
                    <button
                      key={notification._id}
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      className={`w-full px-6 py-5 text-left transition hover:bg-white/5 ${
                        notification.isRead
                          ? "bg-slate-900"
                          : "bg-cyan-500/5"
                      }`}
                    >

                      <div className="flex gap-4">

                        <div className="pt-1">

                          <div
                            className={`h-3 w-3 rounded-full ${
                              notification.isRead
                                ? "bg-slate-600"
                                : "bg-cyan-400"
                            }`}
                          />

                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <p
                              className={`font-semibold capitalize ${
                                notification.isRead
                                  ? "text-slate-300"
                                  : "text-white"
                              }`}
                            >
                              {notification.type
                                ?.replaceAll(
                                  "_",
                                  " "
                                ) ||
                                "Notification"}
                            </p>

                            <p className="text-xs text-slate-500">
                              {notification.createdAt
                                ? new Date(
                                    notification.createdAt
                                  ).toLocaleString()
                                : ""}
                            </p>

                          </div>

                          <p className="mt-2 text-sm text-slate-400">
                            {notification.message}
                          </p>

                          {notification.ticket && (
                            <p className="mt-2 text-xs text-cyan-400">
                              Ticket:{" "}
                              {notification.ticket
                                .title ||
                                "View Ticket"}
                            </p>
                          )}

                          {!notification.isRead && (
                            <p className="mt-2 text-xs text-cyan-400">
                              Unread · Click to open
                            </p>
                          )}

                        </div>

                      </div>

                    </button>
                  )
                )}

              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default Notifications;