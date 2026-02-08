import type { ClubInvitationLinkDbType } from "@server/db/schema";
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "../ui/table/data-table-column-header";



export const columns: ColumnDef<ClubInvitationLinkDbType>[] = [
    {
        accessorKey: "label",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nom du code"/>
        ),

    },
    {
        accessorKey: "preassigned_team_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Equipe assigné"/>
        ),
    },
    {
        accessorKey: "expiry_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date d'expiration"/>
        ),
        cell: ({ row }) => {
            const rawValue = row.getValue('expiry_date');
      
            if (!rawValue) {
              return <div className="text-muted-foreground">Jamais</div>;
            }
      
            const date = new Date(rawValue as string);
      
            if (isNaN(date.getTime())) {
              return <div className="text-destructive">Date invalide</div>;
            }
      
            return <div>{date.toLocaleDateString('fr-FR')}</div>;
        }
    },
    {
        accessorKey: "max_uses",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Utilisation(s) max"/>
        ),
    },
    {
        accessorKey: "uses",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Utilisation(s)"/>
        ),
    },
    {
        id: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status"/>
        ),
        cell: ({ row }) => {
            const { is_active, is_deleted, is_expired, expiry_date, max_uses, uses } = row.original;
            
            const isFull = (max_uses ?? 0) > 0 && (uses ?? 0) >= (max_uses ?? 0);

            if(!is_active || is_deleted){
                return <Badge className="rounded-sm" variant="secondary">Désactivé</Badge>;
            }
            if (is_expired) {
                return <Badge className="rounded-sm" variant="destructive">Expiré</Badge>;
              }
          
            if (isFull) {
                return <Badge variant="outline" className="border-orange-500 text-orange-500 rounded-sm">Complet</Badge>;
            }

            return <Badge className="bg-green-600 rounded-sm">Actif</Badge>;
        }
    },
    {
        accessorKey: "code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Code"/>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const code = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>   
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            Archiver
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]