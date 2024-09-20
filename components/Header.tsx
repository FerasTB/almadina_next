// components/Header.tsx

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      <div className="relative ml-auto flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8"
        />
      </div>
      <div className="flex items-center">
        <Link href="#">
          <a className="overflow-hidden rounded-full">
            <Image
              src="/placeholder-user.jpg"
              width={36}
              height={36}
              alt="User Avatar"
              className="overflow-hidden rounded-full"
            />
          </a>
        </Link>
      </div>
    </header>
  );
}
