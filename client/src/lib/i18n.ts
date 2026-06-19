import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Khai báo tài nguyên ngôn ngữ
const resources = {
  en: {
    translation: {
      sidebar: {
        general: "General",
        dashboard: "Dashboard",
        tasks: "Tasks",
        apps: "Apps",
        notes: "Notes",
        chats: "Chats",
        users: "Users",
        page: "Page",
        auth: "Auth",
        errors: "Errors",
        other: "Other",
        settings: "Settings",
        account: "Account",
        appearance: "Appearance",
        notification: "Notification",
        display: "Display",
        helpCenter: "Help Center",
      },
      dashboard: {
        title: "Dashboard",
        totalRevenue: "Total Revenue",
        subscriptions: "Subscriptions",
        sales: "Sales",
        activeNow: "Active Now",
        recentSales: "Recent Sales",
        salesCount: "You made {{count}} sales this month.",
      },
    },
  },
  vi: {
    translation: {
      sidebar: {
        general: "Tổng quan",
        dashboard: "Bảng điều khiển",
        tasks: "Công việc",
        apps: "Ứng dụng",
        notes: "Ghi chú",
        chats: "Trò chuyện",
        users: "Người dùng",
        page: "Trang",
        auth: "Xác thực",
        errors: "Lỗi hệ thống",
        other: "Khác",
        settings: "Cài đặt",
        account: "Tài khoản",
        appearance: "Giao diện",
        notification: "Thông báo",
        display: "Hiển thị",
        helpCenter: "Trung tâm trợ giúp",
      },
      dashboard: {
        title: "Bảng điều khiển",
        totalRevenue: "Tổng doanh thu",
        subscriptions: "Lượt đăng ký",
        sales: "Doanh số",
        activeNow: "Đang hoạt động",
        recentSales: "Doanh thu gần đây",
        salesCount: "Bạn đã đạt {{count}} doanh số trong tháng này.",
      },
    },
  },
};

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ của trình duyệt hoặc từ localStorage
  .use(initReactI18next) // Kết nối với react-i18next
  .init({
    resources,
    fallbackLng: "vi", // Nếu không tìm thấy ngôn ngữ phù hợp thì mặc định dùng Tiếng Việt
    interpolation: {
      escapeValue: false, // React đã tự động chống XSS rồi nên không cần
    },
    detection: {
      order: ["localStorage", "navigator"], // Ưu tiên check localStorage trước, sau đó mới tới cài đặt trình duyệt
      caches: ["localStorage"], // Tự động lưu lựa chọn ngôn ngữ của user vào localStorage
    },
  });

export default i18n;
