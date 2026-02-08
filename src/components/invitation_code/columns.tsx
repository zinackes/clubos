import type { ClubInvitationLinkDbType } from "@server/db/schema";
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/animate-ui/components/radix/dropdown-menu';
import { Button } from "../ui/button";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";
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
        cell: ({ row })=> {
            const { max_uses } = row.original;

            return <div>{max_uses === 0 ? "Illimité" : max_uses}</div>
        }
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
            const { is_active, is_archived, is_expired, is_nearly_expired, is_full } = row.original;

            if(is_archived){
                return <Badge className="rounded-sm" variant="secondary">Désactivé</Badge>;
            }

            if (is_expired) {
                return <Badge className="rounded-sm" variant="destructive">Expiré</Badge>;
            }
            
            if (is_nearly_expired) {
                return <Badge 
                    className="rounded-sm border border-amber-300 bg-amber-100 text-amber-600"
                >
                    Expire bientôt
                </Badge>
            }
          
            if (is_full) {
                return <Badge variant="outline" className="border-orange-500 text-orange-500 rounded-sm">Complet</Badge>;
            }

            return <Badge className="bg-green-600 rounded-sm">Actif</Badge>;
        },
        filterFn: (row, id, value: string[]) => {
            if(!value.length) return true;

            const { is_active, is_archived, is_expired, is_nearly_expired, is_full } = row.original;

            const statusChecks: Record<string, boolean> = {
                actif: is_active && !is_archived && !is_expired && !is_nearly_expired && !is_full,
                expired: is_expired,
                nearly_expired: is_nearly_expired,
                full: is_full,
                disabled: is_archived
            };
    
            return value.some(filter => statusChecks[filter]);
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
                        <DropdownMenuLabel className="text-xs">
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Copy/>
                            Copier le lien d'invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Archiver
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]