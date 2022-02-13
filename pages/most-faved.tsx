import { NextPage } from "next";
import { MainLayout } from "../src/layouts/MainLayout";
import { useQuery } from "react-query";

type MostFavedResponse = [
    { _id: "songs"; songs: Array<{ name: string; faveCount: number }> }
];

const LeaderboardsPage: NextPage = () => {
    const { data, isLoading } = useQuery<MostFavedResponse>(
        ["favorites"],
        async () => {
            const res = await fetch("/api/leaderboards/most-faved", {
                method: "GET",
            }).then((r) => r.json());

            return res.data;
        }
    );
    return (
        <MainLayout disableLoadingScreen>
            {/*<>{!isLoading && JSON.stringify(data[0].songs)}</>*/}
            <div className="container p-5">
                <h1 className={"title mt-5"}>Favorite Song Leaderboard</h1>
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
                                    <strong>Artist</strong>
                                </td>
                                <td>
                                    <strong>Song</strong>
                                </td>
                                <td>
                                    <strong>Faves</strong>
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
                            {data &&
                                data[0].songs.map((entry, index) => {
                                    const [artist, song] =
                                        entry.name.split(" - ");
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{artist}</td>
                                            <td>{song}</td>
                                            <td>{entry.faveCount}</td>
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
