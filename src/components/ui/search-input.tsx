import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10"
      />
    </div>
  );
}