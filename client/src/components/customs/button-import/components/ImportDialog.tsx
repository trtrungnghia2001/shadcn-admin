import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { memo } from "react";
import { Loader } from "lucide-react";

const fileTypes = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onImport?: (file: File) => void;
  isLoading?: boolean;
}

const formSchema = z.object({
  files: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: "Please upload a file",
    })
    .refine(
      (files) => fileTypes.includes(files?.[0]?.type),
      "Please upload csv format."
    ),
});

const ImportDialog = ({
  open,
  onOpenChange,
  title = "Import File",
  description = "Import file quickly from a CSV file.",
  onImport,
  isLoading,
}: ImportDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { files: undefined },
  });

  const fileRef = form.register("files");

  const onSubmit = () => {
    const files = form.getValues("files");

    if (files && files[0] && onImport) {
      onImport(files[0]);
    }
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        form.reset();
      }}
    >
      <DialogContent className="gap-2 sm:max-w-sm">
        <DialogHeader className="text-start">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="import-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem className="my-2">
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...fileRef}
                      accept={fileTypes.toString()}
                      className="h-8 py-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit" form="import-form">
            {isLoading && <Loader size={18} className="animate-spin" />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ImportDialog);
