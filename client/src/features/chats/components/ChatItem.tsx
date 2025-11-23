import clsx from "clsx";

interface ChatItemProps {
  owner: boolean;
}
const ChatItem = ({ owner }: ChatItemProps) => {
  return (
    <div className={clsx([`flex`, owner ? `justify-end` : `justify-start`])}>
      <div
        className={clsx([
          `w-2/5 shadow-md p-2 rounded-xl space-y-1`,
          owner
            ? `bg-primary/90 rounded-br-none text-primary-foreground`
            : `bg-muted rounded-bl-none`,
        ])}
      >
        <p>Yeah, let me know what you think.</p>
        <p
          className={clsx([
            `italic text-xs`,
            owner ? `text-primary-foreground/70` : `text-muted-foreground/70`,
          ])}
        >
          9:25 AM
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
