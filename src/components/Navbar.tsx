import React, { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserState, useUserState } from "../context/UserContext";

const twitchRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
        redirect = process.env.NEXT_PUBLIC_TWITCH_REDIRECT;
    return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=user:read:subscriptions`;
};

const NavLinks: React.FC<{ user?: UserState["user"] }> = ({ user }) => {
    return (
        <Fragment>
            {" "}
            <div className="navbar-end">
                {" "}
                <Link href={"/"}>
                    <a className="navbar-item">Home</a>
                </Link>
                {/*<Link href={"/privacy"}>*/}
                {/*    <a className="navbar-item">Privacy</a>*/}
                {/*</Link>*/}
                <Link href={"/leaderboards"}>
                    <a className="navbar-item">Leaderboards</a>
                </Link>
                <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">My SeasideFM</a>

                    <div className="navbar-dropdown">
                        <Link href={"/requests"}>
                            <a className="navbar-item">My Requests</a>
                        </Link>
                        <Link href={"/favorites"}>
                            <a className="navbar-item">My Saved Songs</a>
                        </Link>
                        <hr className="navbar-divider" />
                        <a
                            className="navbar-item"
                            href={"https://forms.gle/C1iLLzX9RtW5zXgf7"}
                        >
                            Report a bug
                        </a>
                    </div>
                </div>
                <div className="navbar-item is-flex is-align-items-center is-justify-content-center">
                    <div
                        className="buttons"
                        style={{
                            marginBottom: "0 !important",
                        }}
                    >
                        {user ? (
                            <div className={"is-flex is-align-items-center"}>
                                <p className={"mr-3"}>
                                    <strong>{user?.display_name}</strong>
                                </p>
                                <Image
                                    src={user?.profile_image_url}
                                    alt={"Profile"}
                                    width={50}
                                    height={50}
                                />
                            </div>
                        ) : (
                            <a
                                href={twitchRedirect()}
                                style={{
                                    backgroundColor: "#6441a5",
                                }}
                                className="button is-dark"
                            >
                                <Image
                                    alt={"Twitch"}
                                    src={"/twitch.svg"}
                                    width={15}
                                    height={15}
                                />
                                <strong
                                    style={{
                                        marginLeft: "8px",
                                    }}
                                >
                                    Log in with Twitch
                                </strong>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export const Navbar: React.FC = () => {
    const { user } = useUserState();
    const [mobileNavOpen, setMobileNav] = useState(false);
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link href="/">
                    <a className="navbar-item">
                        <Image
                            src="/logo.png"
                            alt={"Logo"}
                            width="200"
                            height="200"
                        />
                    </a>
                </Link>
                <h3 className={"title is-4 mt-3 mr-5"}>Seaside FM Archives</h3>

                <a
                    onClick={() => setMobileNav(!mobileNavOpen)}
                    role="button"
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarBasicExample"
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </a>
            </div>

            <div className="navbar-menu is-desktop">
                <NavLinks {...{ user }} />
            </div>

            <div
                id="navbarBasicExample"
                style={{
                    display: mobileNavOpen ? "initial" : "none",
                }}
                className="navbar-menu is-mobile"
                onClick={() => setMobileNav(false)}
            >
                <NavLinks {...{ user }} />
            </div>
        </nav>
    );
};
