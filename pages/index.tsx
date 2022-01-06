import type { NextPage } from "next";
import { MainLayout } from "../src/layouts/MainLayout";

const Home: NextPage = () => {
    return (
        <MainLayout>
            <div className="columns mt-2">
                <div className="column is-flex is-flex-direction-row">
                    {/*<video preload={"auto"} playsInline controls>*/}
                    {/*    <source*/}
                    {/*        src={*/}
                    {/*            "/api/stream?v=adb9e62c-fe05-47eb-8d48-dbbfc5a4140f"*/}
                    {/*        }*/}
                    {/*        type={"video/mp4"}*/}
                    {/*    />*/}
                    {/*</video>*/}
                </div>
            </div>
        </MainLayout>
    );
};

export default Home;
