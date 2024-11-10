import "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		// Define mutually exclusive types for filterOptions and searchBarPlaceholder
		filterOptions?: {
			label: string;
			value: string;
			icon?: React.ComponentType<{ className?: string }>;
		}[];
		searchBarPlaceholder?: string;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}
}
