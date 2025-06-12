import { useState, useEffect } from "react";

const useNotifications = () => {
  const [permission, setPermission] = useState("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check browser support
    const supported = "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return "denied";

    try {
      let result;
      if (Notification.requestPermission && typeof Notification.requestPermission === "function") {
        if (Notification.requestPermission.length === 0) {
          result = await Notification.requestPermission();
        } else {
          result = await new Promise((resolve) => {
            Notification.requestPermission(resolve);
          });
        }
      }
      setPermission(result);
      return result;
    } catch (error) {
      console.error("Permission request error:", error);
      return "denied";
    }
  };

  const sendNotification = async (title, options = {}) => {
    if (!isSupported) {
      console.warn("Browser does not support notifications");
      return;
    }

    try {
      let currentPermission = permission;

      if (currentPermission === "default") {
        currentPermission = await requestPermission();
      }

      if (currentPermission === "granted") {
        const notification = new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          requireInteraction: false,
          silent: false,
          ...options,
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
          if (notification) {
            notification.close();
          }
        }, 5000);

        return notification;
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const sendBudgetAlert = async (categoryName, spent, budget) => {
    // Send browser notification
    await sendNotification("🚨 Budget Alert!", {
      body: `Your budget for ${categoryName} has been exceeded!\nBudget: $${budget.toFixed(2)}\nSpent: $${spent.toFixed(2)}\nOver by: $${(spent - budget).toFixed(2)}`,
      tag: `budget-alert-${categoryName}`,
    });

    // Send email notification
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName,
          spent,
          budget,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    sendBudgetAlert,
  };
};

export default useNotifications; 