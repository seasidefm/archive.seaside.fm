import { NextPage } from "next";
import { MainLayout } from "../src/layouts/MainLayout";
import { useQuery } from "react-query";
import { LeaderboardService } from "../src/services/ui/LeaderboardService";
import { Table, TableColumn } from "../src/components/Table";
import { useMemo } from "react";

const LeaderboardColumns: TableColumn[] = [
    {
        column: "place",
        displayName: "Place",
    },
    {
        column: "user",
        displayName: "User",
    },
    {
        column: "songs",
        displayName: "Song Number",
    },
];

const LeaderboardsPage: NextPage = () => {
    const {
        data: d,
        isLoading: l,
        error,
    } = useQuery<
        Array<{
            _count: { favorites: number };
            name: string;
        }>,
        string
    >(["fave-leaderboard"], async () => {
        const api = new LeaderboardService();

        return await api.getLeaderboard();
    });

    const rows = useMemo(() => {
        const formatted = d?.map((user, i) => {
            return {
                place: i + 1,
                user: user.name,
                songs: user._count.favorites,
            };
        });

        return formatted || [];
    }, [d]);

    return (
        <MainLayout disableLoadingScreen>
            <div className="container p-5">
                {error && <pre>{error}</pre>}
                <h1 className={"title mt-5"}>Song Collector Leaderboard</h1>
                <p>
                    To add more favorites, use <code>?fave</code> during the
                    stream!
                </p>
                <br />
                <p className={"is-hidden-desktop mt-1 mb-2"}>
                    <strong>Scroll sideways for more info!</strong>
                </p>
                <div
                    style={{
                        width: "100%",
                        overflow: "auto",
                    }}
                >
                    <Table
                        loading={l}
                        columns={LeaderboardColumns}
                        rows={rows}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default LeaderboardsPage;
