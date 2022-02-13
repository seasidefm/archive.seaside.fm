import React, { Fragment, useEffect, useState } from "react";

export interface GDPRStateActions {
    setConsent(consent: boolean): void;
}

const COOKIE_CONSENT = "cookie-consent";
export const GDPRModalProvider: React.FC = ({ children }) => {
    const [consent, setConsent] = useState<boolean>(false);
    const [modalState, setModalState] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const existingConsent = localStorage.getItem(COOKIE_CONSENT);
            if (!consent && existingConsent) {
                setConsent(true);
                setModalState(false);
            } else {
                setModalState(true);
            }
        }
    }, [consent, setConsent]);

    const actions: GDPRStateActions = {
        setConsent(c: boolean) {
            localStorage.setItem(COOKIE_CONSENT, JSON.stringify(true));
            setConsent(c);
            setModalState(false);
        },
    };

    return (
        <Fragment>
            <div
                // For some reason, JUST checking modalState does not work here?
                className={`modal ${modalState && !consent ? "is-active" : ""}`}
            >
                <div
                    className="modal-background"
                    onClick={() => actions.setConsent(true)}
                />
                <div className="modal-content">
                    <div className="card p-5">
                        <h3 className="title is-4">GDPR/Cookie Consent</h3>
                        <p>
                            This site uses <strong>functional</strong> cookies
                            only. We only save your Twitch login{" "}
                            <i>in your browser</i> as long as your browser is
                            open! (Session cookie)
                        </p>
                        <br />
                        <p>
                            The only other data we keep is what you give us.
                            That means requests/favorite songs from the stream
                            and similar actions. We will <strong>NEVER</strong>{" "}
                            sell this to anyone.
                        </p>
                        <br />
                        <p>
                            By clicking OKAY or closing this modal, you agree to
                            these functional cookies :)
                        </p>
                        <div className="mt-5 is-flex is-flex-direction-row">
                            <button
                                onClick={() => actions.setConsent(true)}
                                className={"ml-auto button is-primary"}
                            >
                                <strong>Okay</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </Fragment>
    );
};
