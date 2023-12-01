"use client";
import { signOut } from 'next-auth/react';

interface paramProps {
    userId: string;
}

export default async function userPage({ }: { }) {
    return (
        <div className="card w-96 bg-white shadow-xl">
            <div className="card-body items-center text-center">
                <div className="card-actions">
                    <button className="btn btn-primary"
                        onClick={() => {
                            signOut();}}
                    >
                        Signout</button>
                    <button className="btn btn-primary"
                        
                    >
                        connect Github
                    </button>
                </div>
            </div>
        </div>
    );
}