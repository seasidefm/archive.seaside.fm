import React from "react";
import Image from "next/image";
import Link from "next/link";

const twitchRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
        redirect = process.env.NEXT_PUBLIC_TWITCH_REDIRECT;
    return `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=user:read:subscriptions`;
};

export const Navbar: React.FC = () => {
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

                <a
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

            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-start">
                    <a className="navbar-item">Home</a>

                    <Link href={"/privacy"}>
                        <a className="navbar-item">Privacy</a>
                    </Link>

                    {/*<Link href={"/"}>*/}
                    {/*    <a className="navbar-item">*/}
                    {/*        Past Streams - COMING SOON!*/}
                    {/*    </a>*/}
                    {/*</Link>*/}
                    {/*<Link href={"/"}>*/}
                    {/*    <a className="navbar-item">New Mixes - COMING SOON!</a>*/}
                    {/*</Link>*/}

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">Stream Links</a>

                        <div className="navbar-dropdown">
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
                    {/*<div className="navbar-item has-dropdown is-hoverable">*/}
                    {/*    <a className="navbar-link">Dev Links</a>*/}

                    {/*    <div className="navbar-dropdown">*/}
                    {/*        <Link*/}
                    {/*            href={*/}
                    {/*                "https://github.com/seasidefm/archive.seaside.fm"*/}
                    {/*            }*/}
                    {/*        >*/}
                    {/*            <a className="navbar-item">View Source Code</a>*/}
                    {/*        </Link>*/}
                    {/*        /!*<hr className="navbar-divider" />*!/*/}
                    {/*        /!*<a*!/*/}
                    {/*        /!*    className="navbar-item"*!/*/}
                    {/*        /!*    href={"https://forms.gle/C1iLLzX9RtW5zXgf7"}*!/*/}
                    {/*        /!*>*!/*/}
                    {/*        /!*    Report an issue*!/*/}
                    {/*        /!*</a>*!/*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
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
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
