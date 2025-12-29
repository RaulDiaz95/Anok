import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function PageContainer({ children, className }: Props) {
  return (
    <div
      className={`w-full sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}
