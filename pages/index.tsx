import type { NextPage } from "next";
import Image from "next/image";
import { MainLayout } from "../src/layouts/MainLayout";

const Home: NextPage = () => {
    return (
        <MainLayout>
            <div
                style={{
                    height: "100%",
                    width: "100%",
                }}
            >
                <Image
                    src={"/background.png"}
                    width={1920}
                    height={1080}
                    layout={"responsive"}
                />

                {/*<div className="column is-flex is-flex-direction-column">*/}
                {/*    <h1 className="title">The Seaside FM Archives</h1>*/}
                {/*    <p>Welcome!</p>*/}
                {/*    /!*<video preload={"auto"} playsInline controls>*!/*/}
                {/*    /!*    <source*!/*/}
                {/*    /!*        src={*!/*/}
                {/*    /!*            "/api/stream?v=adb9e62c-fe05-47eb-8d48-dbbfc5a4140f"*!/*/}
                {/*    /!*        }*!/*/}
                {/*    /!*        type={"video/mp4"}*!/*/}
                {/*    /!*    />*!/*/}
                {/*    /!*</video>*!/*/}
                {/*</div>*/}
            </div>
        </MainLayout>
    );
};

export default Home;
