import { redisClient } from "../libs/redis.js";

/**
 * Middleware tự động quản lý cache (GET thì check/save, CUD thì xóa sạch theo cụm)
 * @param {string} prefixKey - Tên nhóm tính năng để gom nhóm cache
 * @param {number} ttl - Thời gian sống của cache (tính bằng giây, mặc định 5 phút)
 */
const autoCacheMiddleware = (prefixKey, ttl = 300) => {
  return async (req, res, next) => {
    if (!redisClient.isOpen) {
      return next();
    }

    const userId = req.user?.id || "guest";
    const cacheKey = `${prefixKey}:${userId}:${req.originalUrl}`;

    // Pattern để tìm và xóa sạch các key con khi có hành động CUD xảy ra
    const matchPattern = `${prefixKey}:${userId}:*`;

    const method = req.method;

    // ================= TRƯỜNG HỢP 1: LỆNH LẤY DỮ LIỆU (GET) =================
    if (method === "GET") {
      try {
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
          console.log(`🚀 [REDIS HIT] Trả về cache lập tức: ${cacheKey}`);
          return res.status(200).json(JSON.parse(cachedData));
        }

        console.log(`🐢 [REDIS MISS] Đang vào DB lấy dữ liệu...`);

        const originalJson = res.json;
        res.json = function (body) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            redisClient
              .set(cacheKey, JSON.stringify(body), { EX: ttl })
              .then(() =>
                console.log(`💾 [REDIS SAVED] Đã lưu cache: ${cacheKey}`),
              )
              .catch((err) =>
                console.error("❌ Lỗi khi lưu dữ liệu vào Redis:", err),
              );
          }
          return originalJson.call(this, body);
        };

        return next();
      } catch (error) {
        console.error("❌ Lỗi xử lý cache (GET):", error);
        return next();
      }
    }

    // ================= TRƯỜNG HỢP 2: LỆNH THAY ĐỔI DỮ LIỆU (POST, PUT, PATCH, DELETE) =================
    else {
      try {
        console.log(
          `🔥 [REDIS INVALIDATION] Phát hiện lệnh ${method}. Chuẩn bị dọn dẹp cache nhóm: ${prefixKey}`,
        );

        // Chặn đầu hàm res.json để đợi Controller lưu DB thành công xong xuôi thì mới xóa cache cũ
        const originalJson = res.json;
        res.json = function (body) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Dùng chiêu scanIterator (Quét an toàn thay vì dùng KEYS) để tìm và xóa sạch key liên quan
            (async () => {
              const keysToDelete = [];
              for await (const key of redisClient.scanIterator({
                MATCH: matchPattern,
                COUNT: 100,
              })) {
                keysToDelete.push(key);
              }

              if (keysToDelete.length > 0) {
                await redisClient.del(keysToDelete);
                console.log(
                  `🗑️ [REDIS DECLARED] Đã dọn dẹp ${keysToDelete.length} cache cũ lỗi thời!`,
                );
              }
            })().catch((err) =>
              console.error("❌ Lỗi khi dọn dẹp key Redis:", err),
            );
          }
          return originalJson.call(this, body);
        };

        return next();
      } catch (error) {
        console.error("❌ Lỗi xử lý cache (CUD):", error);
        return next();
      }
    }
  };
};

export default autoCacheMiddleware;
