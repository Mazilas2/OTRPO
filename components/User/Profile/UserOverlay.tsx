"use client"
import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import {signIn, signOut, useSession} from "next-auth/react";
import axios from 'axios';
import React, {useState} from "react";
// @ts-ignore
import qrcode from "qrcode";
import {QRCodeSVG} from 'qrcode.react';
import {authenticator} from "otplib";
import Image from "next/image";
import {toast, Toaster} from "react-hot-toast";

const UserOverlay: React.FC = ({}) => {
    const {data: session} = useSession();
    const [tfaQR, settfaQR] = useState("")
    const handleGithub = () => {
        signIn('github')
    }
    const handle2FA = () => {
        const response = axios.get(
            `/api/getFA?email=${session?.user?.email}`
        )
            .then((response) => response.data)
            .then(async (data) => {
                console.log(data);
                if (data.activate) {
                    const user = session?.user?.email?.toString();
                    const service = 'OTRPO';
                    if (user != null) {

                        let secret = authenticator.generateSecret();
                        const postQR = await axios.post(
                            "/api/setFA",
                            {
                                "email": user,
                                "secret": secret
                            }
                        )
                        if (postQR.status === 200) {
                            const otpauth = authenticator.keyuri(user, service, secret);
                            qrcode.toDataURL(otpauth, (err: any, imageUrl: any) => {
                                if (err) {
                                    console.log('Error with QR');
                                    return;
                                }
                                settfaQR(imageUrl);
                            });
                        } else {
                            console.log(postQR.status)
                        }
                    }

                } else {
                    settfaQR("");
                    toast.success("2FA removed")
                }
            })
    }
    return (
        <div className="card w-96 bg-white shadow-xl">
            <div><Toaster/></div>
            <div className="card-body items-center text-center">
                <div className="card-actions">
                    <button className="btn btn-primary"
                            onClick={() => {
                                signOut();
                            }}
                    >
                        Signout
                    </button>
                    <button className="btn btn-primary"
                            onClick={handleGithub}
                    >
                        Connect/Disconnect Github
                    </button>
                    <button className="btn btn-primary"
                            onClick={handle2FA}
                    >
                        Enable/Disable 2FA
                    </button>
                    <Image src={tfaQR} alt={"QRCODE_TFA"} width={200} height={200}
                           style={{visibility: tfaQR != "" ? 'visible' : 'hidden'}}/>
                </div>
            </div>
        </div>
    );
}

export default UserOverlay;