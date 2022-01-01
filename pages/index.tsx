import type { NextPage } from "next";
import { Navbar } from "../src/components/Navbar";
import { Fragment } from "react";
import Head from "next/head";

const Home: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <title>Home - SeasideFM Archive</title>
            </Head>
            <Navbar />
            <video controls autoPlay height={620} width={480}>
                <source src={"/api/stream"} type={"video/mp4"} />
            </video>
        </Fragment>
    );
};

export default Home;
