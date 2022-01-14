import { NextPage } from "next";
import { MainLayout } from "../src/layouts/MainLayout";
import { useUserState } from "../src/context/UserContext";
import { useQuery } from "react-query";
import moment from "moment";
import { IRequest } from "../src/services/backend/database/Request.model";
import Link from "next/link";

function formatYoutubeLink(artist: string, song: string) {
    return `https://www.youtube.com/results?search_query=${artist.replace(
        " ",
        "+"
    )}+${song.replace(" ", "+")}`;
}

const RequestsPage: NextPage = () => {
    const { user } = useUserState();
    const { data, isLoading } = useQuery<Array<IRequest>>(
        ["requests"],
        async () => {
            const res = await fetch("/api/user/requests", {
                method: "GET",
            }).then((r) => r.json());

            return res.data;
        }
    );
    return (
        <MainLayout>
            <div className="container p-5">
                <h1 className={"title mt-5"}>Your Requested Songs</h1>
                <p>
                    To add more, use{" "}
                    <code>?request artist name - song title</code> during the
                    stream! Please note, we only allow <strong>2 MAX</strong>{" "}
                    requests per stream to keep things fair :)
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
                                    <strong>Request Date</strong>
                                </td>
                                <td>
                                    <strong>Streamed Date</strong>
                                </td>{" "}
                                <td>
                                    <strong>YouTube Search</strong>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {user && isLoading && (
                                <tr>
                                    <td colSpan={4}>
                                        <div>Loading requested songs...</div>
                                    </td>
                                </tr>
                            )}
                            {!user && (
                                <tr>
                                    <td colSpan={4}>
                                        <div>
                                            Please login to see your requested
                                            songs!
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {data?.map((entry) => {
                                const {
                                    artist,
                                    song_title,
                                    stream_date,
                                    request_date,
                                } = entry;
                                return (
                                    <tr key={`${artist}-${song_title}`}>
                                        <td>{artist}</td>
                                        <td>{song_title}</td>
                                        <td>
                                            {request_date
                                                ? moment(request_date).format(
                                                      "DD MMMM, YYYY"
                                                  )
                                                : "N/A"}
                                        </td>{" "}
                                        <td>
                                            {stream_date
                                                ? moment(request_date).format(
                                                      "DD MMMM, YYYY"
                                                  )
                                                : "N/A"}
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
                                                        song_title
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
                                        {/*<td>*/}
                                        {/*    <div*/}
                                        {/*        style={{*/}
                                        {/*            height: "100%",*/}
                                        {/*        }}*/}
                                        {/*        className={*/}
                                        {/*            "is-flex is-align-items-center"*/}
                                        {/*        }*/}
                                        {/*    >*/}
                                        {/*        <a*/}
                                        {/*            onClick={async () => {*/}
                                        {/*                await fetch(*/}
                                        {/*                    "/api/user/remove-favorite",*/}
                                        {/*                    {*/}
                                        {/*                        method: "POST",*/}
                                        {/*                        body: JSON.stringify(*/}
                                        {/*                            entry*/}
                                        {/*                        ),*/}
                                        {/*                        headers: {*/}
                                        {/*                            "Content-Type":*/}
                                        {/*                                "application/json",*/}
                                        {/*                        },*/}
                                        {/*                    }*/}
                                        {/*                );*/}
                                        {/*                await refetchSongs();*/}
                                        {/*            }}*/}
                                        {/*            type={"button"}*/}
                                        {/*            className={*/}
                                        {/*                "has-text-danger"*/}
                                        {/*            }*/}
                                        {/*        >*/}
                                        {/*            Delete*/}
                                        {/*        </a>*/}
                                        {/*    </div>*/}
                                        {/*</td>*/}
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

export default RequestsPage;
