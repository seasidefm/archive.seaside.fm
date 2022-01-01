import React from "react";
import Image from "next/image";

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="https://bulma.io">
                    <Image
                        src="https://bulma.io/images/bulma-logo.png"
                        alt={"Logo"}
                        width="112"
                        height="28"
                    />
                </a>

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

                    <a className="navbar-item">Documentation</a>

                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">More</a>

                        <div className="navbar-dropdown">
                            <a className="navbar-item">About</a>
                            <a className="navbar-item">Jobs</a>
                            <a className="navbar-item">Contact</a>
                            <hr className="navbar-divider" />
                            <a className="navbar-item">Report an issue</a>
                        </div>
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <a
                                href={`https://id.twitch.tv/oauth2/authorize
    ?client_id=<your client ID>
    &redirect_uri=<your registered redirect URI>
    &response_type=code
    &scope=user:read:subscriptions%20user:read:email`}
                                style={{
                                    backgroundColor: "#6441a5",
                                }}
                                className="button is-dark"
                            >
                                <strong>Log in with Twitch</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
