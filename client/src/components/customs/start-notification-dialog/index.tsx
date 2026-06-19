import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";
import { useNotificationStore } from "./store";

const StartNotificationDialog = () => {
  const { isOpen, onChange } = useNotificationStore();

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center text-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BellRing className="size-6" />
          </div>

          <DialogTitle className="text-xl">Thông báo hệ thống</DialogTitle>

          <DialogDescription className="text-center pt-2">
            Chào mừng bro đã quay trở lại! Hiện tại hệ thống đang được tối ưu
            hóa hiệu năng trên môi trường Vercel. Các tính năng realtime tạm
            thời được chuyển sang cơ chế kiểm tra định kỳ (polling) để đảm bảo
            độ ổn định cao nhất.
          </DialogDescription>
          <DialogDescription className="text-center pt-2">
            Nếu vẫn muốn sử dụng realtime, bro có thể clone github và chạy trên
            localhost. Xin lỗi vì sự bất tiện này.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            onClick={() => onChange(false)}
            className="w-full sm:w-auto min-w-[100px]"
          >
            Đã hiểu, cảm ơn bro!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartNotificationDialog;
