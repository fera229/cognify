import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Sidebar } from './sidebar';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent
        aria-describedby={'This is the sidebar content'}
        side={'left'}
        className="bg-white p-0"
      >
        {/* accessibility improvements: add dialog title and description */}
        <DialogTitle className="sr-only">Sidebar</DialogTitle>
        <DialogDescription className="sr-only">
          This is the sidebar content
        </DialogDescription>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
