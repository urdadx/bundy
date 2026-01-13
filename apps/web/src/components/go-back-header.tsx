import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { MoveLeft } from "lucide-react";

export const GoBackHeader = () => {
  return (
    <div className="sticky top-0 mb-5 flex items-center justify-between border-b-2 bg-white p-2 text-muted-foreground z-100">
      <Button variant="ghost" size="default" className="text-inherit flex items-center gap-2">
        <Link to="/">
          <MoveLeft className="size-5" strokeWidth={2} />
        </Link>
        <h1 className="text-lg capitalize font-bold ">Back</h1>
      </Button>
    </div>
  );
};
