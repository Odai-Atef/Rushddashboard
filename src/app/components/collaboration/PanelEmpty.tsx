import { Inbox } from 'lucide-react';

interface PanelEmptyProps {
  message?: string;
}

export function PanelEmpty({ message = 'لا توجد بيانات' }: PanelEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
      <Inbox className="w-8 h-8 mb-3" />
      <p>{message}</p>
    </div>
  );
}
