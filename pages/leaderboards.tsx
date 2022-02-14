import { NextPage } from "next";
import { MainLayout } from "../src/layouts/MainLayout";
import { useQuery } from "react-query";
import { SeasideApi } from "../src/services/backend/seaside-api";

const LeaderboardsPage: NextPage = () => {
    const { data, isLoading } = useQuery<
        Array<{ user: string; numberOfSongs: number }>
    >(["favorites"], async () => {
        const res = await fetch("/api/leaderboards", {
            method: "GET",
        }).then((r) => r.json());

        return res.data;
    });

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
        const api = new SeasideApi();

        return await api.getLeaderboard();
    });

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
                    <table
                        className="table"
                        style={{
                            width: "100%",
                        }}
                    >
                        <thead>
                            <tr>
                                <td>
                                    <strong>Place</strong>
                                </td>
                                <td>
                                    <strong>User</strong>
                                </td>
                                <td>
                                    <strong>Song Number</strong>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={4}>
                                        <div>Loading leaderboard...</div>
                                    </td>
                                </tr>
                            )}
                            {d?.map((entry, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{entry.name}</td>
                                        <td>{entry._count.favorites}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
};

export default LeaderboardsPage;
