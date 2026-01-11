import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "../animate-ui/components/radix/dropdown-menu";
import { Button } from "./button";


export default function Notification() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"ghost"}>
          <Bell size={24}/>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
