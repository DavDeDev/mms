"use client";

import { capitalizeWords } from "@/utils/utils";
import type { Column, Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "./button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { Input } from "./input";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

const getHeaderValue = <TData,>(column: Column<TData, unknown>): string => {
	const header = column.columnDef.header;

	if (typeof header === "string") {
		return header;
	}

	return capitalizeWords(column.id);
};

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				{table
					.getAllColumns()
					.filter((column) => column.getIsVisible())
					.map((column) => {
						const meta = column.columnDef.meta;

						// Render a search bar if `searchBarPlaceholder` is defined
						if (meta?.searchBarPlaceholder) {
							return (
								<Input
									key={column.id}
									placeholder={meta.searchBarPlaceholder}
									value={(column.getFilterValue() as string) ?? ""}
									onChange={(event) =>
										column.setFilterValue(event.target.value)
									}
									className="h-8 w-[150px] lg:w-[250px]"
								/>
							);
						}

						// Render a dropdown filter if `filterOptions` is defined
						if (meta?.filterOptions) {
							return (
								<DataTableFacetedFilter
									key={column.id}
									column={column}
									title={getHeaderValue(column)}
									options={meta.filterOptions}
								/>
							);
						}

						return null; // Skip if no meta is defined for filtering
					})}

				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<X />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
