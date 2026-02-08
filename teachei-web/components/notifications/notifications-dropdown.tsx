"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { NotificationItem, type Notification } from "./notification-item";

interface NotificationsDropdownProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
}

export function NotificationsDropdown({
  notifications = [],
  onNotificationClick,
  onMarkAllRead,
}: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasNotifications = notifications.length > 0;

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white hover:shadow-md transition-all border-2 border-transparent hover:border-primary/10 relative text-muted hover:text-primary"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-error rounded-full border-2 border-surface" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[1001]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-surface rounded-3xl shadow-2xl shadow-primary/10 border border-white/20 z-[1002] animate-scale-in origin-top-right overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-foreground">Notificações</h3>
              {hasNotifications && unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <Check size={14} />
                  <span>Marcar como lidas</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {hasNotifications ? (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mb-4">
                    <Bell className="text-muted" size={28} />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Nenhuma notificação
                  </p>
                  <p className="text-xs text-muted text-center">
                    Você receberá notificações sobre ofertas, pagamentos e atualizações aqui.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
