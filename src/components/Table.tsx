import React from "react";

export interface TableColumn {
    column: string;
    displayName: string;
}

export type TableRow = Record<string, any>;

export interface TableProps<T = TableColumn> {
    loading: boolean;
    columns: TableColumn[];
    rows: TableRow[];
}

export const Table: React.FC<TableProps> = ({ columns, rows, loading }) => {
    return (
        <table
            className="table"
            style={{
                width: "100%",
            }}
        >
            <thead>
                <tr>
                    {columns.map((c, i) => {
                        return (
                            <td key={i}>
                                <strong>{c.displayName}</strong>
                            </td>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {loading && (
                    <tr>
                        <td colSpan={4}>
                            <div>Loading...</div>
                        </td>
                    </tr>
                )}
                {rows?.map((r, i) => {
                    return (
                        <tr key={i}>
                            {Object.keys(r).map((cell, i2) => {
                                return <td key={i2}>{r[cell]}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
