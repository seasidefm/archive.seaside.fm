import { NextPage } from "next";
import { OAuthScreen } from "../../src/layouts/OAuthScreen";
import { useRouter } from "next/router";

const TwitchRedirectPage: NextPage = () => {
    const router = useRouter();
    return <OAuthScreen {...router.query} />;
};

export default TwitchRedirectPage;
