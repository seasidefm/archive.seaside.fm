import { NextPage } from "next";
import Link from "next/link";
import { MainLayout } from "../src/layouts/MainLayout";
import { useUserState } from "../src/context/UserContext";

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

const testSongs: Array<FavoriteSong> = [
    {
        favoriteDate: Date.now(),
        artist: "Tatsuro Yamashita",
        song: "Ride on Time",
    },
    {
        favoriteDate: Date.now(),
        artist: "Tatsuro Yamashita",
        song: "Ride on Time",
    },
    {
        favoriteDate: Date.now(),
        artist: "Tatsuro Yamashita",
        song: "Ride on Time",
    },
];

const FavoritesPage: NextPage = () => {
    const { user } = useUserState();
    return (
        <MainLayout>
            <div className="container p-5">
                <h1 className={"title mt-5"}>Your Favorite Songs</h1>
                <p>
                    To add more, use <code>?fave</code> during the stream!
                </p>
                <br />
                <p className={"is-hidden-desktop mt-1 mb-2"}>
                    <strong>Scroll sideways for more info!</strong>
                </p>
                <div
                    style={{
                        width: "100%",
                        overflow: "scroll",
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
                                <td>Date Saved</td>
                                <td>Artist</td>
                                <td>Song Title</td>
                                <td>Search Links</td>
                                <td>Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            {!user && (
                                <tr>
                                    <td colSpan={4}>
                                        <div>
                                            Please login to see your saved
                                            songs!
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {testSongs.map((song) => {
                                return (
                                    <tr key={`${song.artist}-${song.song}`}>
                                        <td>
                                            <div
                                                style={{
                                                    height: "100%",
                                                }}
                                                className={
                                                    "is-flex is-align-items-center"
                                                }
                                            >
                                                {new Date(
                                                    song.favoriteDate
                                                ).toDateString()}
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
                                                {song.artist}
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
                                                {song.song}
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
                                                        song.artist,
                                                        song.song
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
                                                    type={"button"}
                                                    className={
                                                        "has-text-danger"
                                                    }
                                                >
                                                    Un-Favorite
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
