import { NextPage } from "next";
import { MainLayout } from "../src/layouts/MainLayout";
import { useQuery } from "react-query";
import { Table, TableColumn } from "../src/components/Table";
import { useMemo } from "react";

type MostFavedResponse = [
    { _id: "songs"; songs: Array<{ name: string; faveCount: number }> }
];

const MostFavedColumns: TableColumn[] = [
    {
        column: "place",
        displayName: "Place",
    },
    {
        column: "artist",
        displayName: "Artist",
    },
    {
        column: "song",
        displayName: "Song",
    },
    {
        column: "faves",
        displayName: "Favorites",
    },
];

const MostFavedPage: NextPage = () => {
    const { data, isLoading } = useQuery<MostFavedResponse>(
        ["favorites"],
        async () => {
            const res = await fetch("/api/leaderboards/most-faved", {
                method: "GET",
            }).then((r) => r.json());

            return res.data;
        }
    );

    const rows = useMemo(() => {
        return data
            ? data[0].songs.map((s, i) => {
                  const [artist, song] = s.name.split("-").map((e) => e.trim());
                  return {
                      place: i + 1,
                      artist,
                      song,
                      faves: s.faveCount,
                  };
              })
            : [];
    }, [data]);

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
                    <Table
                        loading={isLoading}
                        columns={MostFavedColumns}
                        rows={rows}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default MostFavedPage;
