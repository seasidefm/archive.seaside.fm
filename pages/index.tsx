import type { NextPage } from "next";
import { Navbar } from "../src/components/Navbar";
import Head from "next/head";

const Home: NextPage = () => {
    return (
        <div
            className={"is-flex is-flex-direction-column"}
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <Head>
                <title>Home - SeasideFM Archive</title>
            </Head>
            <div className="container">
                <Navbar />
                <div className="columns mt-2">
                    <div className="column">
                        <video
                            preload={"auto"}
                            playsInline
                            controls
                            width={"100%"}
                        >
                            <source
                                src={
                                    "/api/stream?v=adb9e62c-fe05-47eb-8d48-dbbfc5a4140f"
                                }
                                type={"video/mp4"}
                            />
                        </video>
                    </div>
                </div>
            </div>
            <footer className="footer mt-auto">
                <div className="content has-text-centered">
                    <p>
                        <strong>Video content</strong> created under Fair Use
                        conditions by{" "}
                        <a href="https://twitch.tv/seasidefm">SeasideFM</a>.
                        Content is licensed under Creative Commons except where
                        not applicable by law.
                        <br />
                        <strong>Website</strong> programmed by{" "}
                        <a href="https://github.com/DukeFerdinand">
                            Doug Flynn
                        </a>
                        . The source code is licensed{" "}
                        <strong>
                            <a href="http://opensource.org/licenses/mit-license.php">
                                MIT
                            </a>
                        </strong>
                        .
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
