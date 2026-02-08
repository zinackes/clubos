import { type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { DataTablePagination } from "../ui/table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../animate-ui/components/radix/dropdown-menu";
import { Button } from "../ui/button";
import { Ban, CheckCircle, Cross, Hourglass, PlusCircle, Shrink, X } from "lucide-react";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}


export function DataTable<TData, TValue>({
    columns,
    data
} : DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters
        },
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel()

    })
    
    const statusFilterValue = (table.getColumn("status")?.getFilterValue() as string[]) ?? [];

    const toggleFilter = (val: string) => {
        const newValue = statusFilterValue.includes(val) ?
            statusFilterValue.filter((v) => v !== val)
            : [...statusFilterValue, val];
            table.getColumn("status")?.setFilterValue(newValue?.length ? newValue : undefined);
    }

    return (
        <div>
            <div className="flex items-center py-4 gap-5">
                <Input
                    placeholder="Rechercher un code..."
                    value={(table.getColumn("label")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                    table.getColumn("label")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"}>
                            <PlusCircle/>
                            Status
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuCheckboxItem
                            checked={statusFilterValue.includes("actif")}
                            onSelect={(e) => { e.preventDefault(); toggleFilter("actif"); }}
                        >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Actif
                        </DropdownMenuCheckboxItem>
                        
                        <DropdownMenuCheckboxItem
                            checked={statusFilterValue.includes("nearly_expired")}
                            onSelect={(e) => { e.preventDefault(); toggleFilter("nearly_expired"); }}
                        >
                            <Hourglass className="mr-2 h-4 w-4 text-amber-500" />
                            Expire bientôt
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuCheckboxItem
                            checked={statusFilterValue.includes("expired")}
                            onSelect={(e) => { e.preventDefault(); toggleFilter("expired"); }}
                        >
                            <Ban className="mr-2 h-4 w-4 text-red-500" />
                            Expiré
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuCheckboxItem
                            checked={statusFilterValue.includes("disabled")}
                            onSelect={(e) => { e.preventDefault(); toggleFilter("disabled"); }}
                        >
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Desactivé
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuCheckboxItem
                            checked={statusFilterValue.includes("full")}
                            onSelect={(e) => { e.preventDefault(); toggleFilter("full"); }}
                        >
                            <Shrink className="mr-2 h-4 w-4 text-orange-500" />
                            Plein
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-gray-200/40">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? 
                                            null 
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext() )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="bg-white/40">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow 
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => 
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>)}
                                </TableRow>
                            ))
                        ) :  (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucun résultat
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table}/>
        </div>
    )
}