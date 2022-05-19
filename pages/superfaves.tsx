import { NextPage } from "next";
import Link from "next/link";
import { MainLayout } from "../src/layouts/MainLayout";
import { useUserState } from "../src/context/UserContext";
import { useQuery } from "react-query";
import { IFavorite } from "../src/services/backend/database/Favorite.model";
import moment from "moment";
import { deleteFavorite } from "../src/utils/deleteFavorite";

interface FavoriteSong {
    favoriteDate: number;
    artist: string;
    song: string;
}

function formatYoutubeLink(artist: string, song: string) {
    return `https://www.youtube.com/results?search_query=${artist.replace(
        " ",
        "+"
    )}+${song.replace(" ", "+")}`;
}

const FavoritesPage: NextPage = () => {
    const { user } = useUserState();
    console.log(user);
    const {
        data,
        isLoading,
        refetch: refetchSongs,
    } = useQuery<IFavorite["songs"]>(
        ["favorites", { userId: user?.id }],
        async ({ queryKey }) => {
            const userId = (queryKey[1] as { userId?: number }).userId;
            if (userId) {
                console.log(userId);
                const res = await fetch(`/api/superfaves?user=${userId}`, {
                    method: "GET",
                }).then((r) => r.json());

                return res.data;
            }
            return [];
        },
        {}
    );
    return (
        <MainLayout>
            <div className="container p-5">
                <h1 className={"title mt-5"}>Your Superfave Songs</h1>
                <p>
                    To add more, use <code>?superfave</code> during the stream!
                </p>
                <p className={"mt-5"}>
                    <b>
                        Songs are currently sorted newest to oldest. Sort +
                        search are in the works :)
                    </b>
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
                                    <strong>Artist</strong>
                                </td>
                                <td>
                                    <strong>Song Title</strong>
                                </td>
                                <td>
                                    <strong>Date Superfaved</strong>
                                </td>
                                <td>
                                    <strong>Search Links</strong>
                                </td>
                                <td>
                                    <strong>Actions</strong>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {user && isLoading && (
                                <tr>
                                    <td colSpan={4}>
                                        <div>Loading superfaved songs...</div>
                                    </td>
                                </tr>
                            )}
                            {!user && (
                                <tr>
                                    <td colSpan={4}>
                                        <div>
                                            Please login to see your superfaved
                                            songs!
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {data?.map((entry) => {
                                const [artist, song] = entry.song.split(" - ");
                                return (
                                    <tr key={`${artist}-${song}`}>
                                        <td>
                                            <div
                                                style={{
                                                    height: "100%",
                                                }}
                                                className={
                                                    "is-flex is-align-items-center"
                                                }
                                            >
                                                {artist}
                                            </div>
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    height: "100%",
                                                }}
                                                className={
                                                    "is-flex is-align-items-center"
                                                }
                                            >
                                                {song}
                                            </div>
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    height: "100%",
                                                }}
                                                className={
                                                    "is-flex is-align-items-center"
                                                }
                                            >
                                                {moment(entry.timestamp).format(
                                                    "HH:mm DD MMMM, YYYY"
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    height: "100%",
                                                }}
                                                className={
                                                    "is-flex is-align-items-center"
                                                }
                                            >
                                                <Link
                                                    href={formatYoutubeLink(
                                                        artist,
                                                        song
                                                    )}
                                                >
                                                    <a
                                                        className={
                                                            "has-text-primary"
                                                        }
                                                    >
                                                        YouTube Search
                                                    </a>
                                                </Link>
                                            </div>
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    height: "100%",
                                                }}
                                                className={
                                                    "is-flex is-align-items-center"
                                                }
                                            >
                                                <a
                                                    onClick={async () =>
                                                        await deleteFavorite(
                                                            entry._id.$oid,
                                                            refetchSongs,
                                                            true
                                                        )
                                                    }
                                                    type={"button"}
                                                    className={
                                                        "has-text-danger"
                                                    }
                                                >
                                                    Delete
                                                </a>
                                            </div>
                                        </td>
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

export default FavoritesPage;
