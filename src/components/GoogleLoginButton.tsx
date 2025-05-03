
import { jwtDecode } from "jwt-decode";
import Script from "next/script";
import { useEffect, useState } from "react";

declare const google: any;

interface Props {
    onUserNotFound: () => void;
  }

export default function GoogleLoginButton({onUserNotFound}:Props) {
    useEffect(()=>{
        const initializeGoogleSignIn = () => {
            google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });
            google.accounts.id.renderButton(
                document.getElementById("google-button"),
                {
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "pill",
                    logo_alignment: "left",
                    width: 280,
                }
            );
        };

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
    }, []);

    const handleCredentialResponse = async (response: { credential: string }) => {
        const decoded = jwtDecode(response.credential);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.credential }),
        });

        const data = await res.json();
        if (data.status === 404) {
            console.log("User not found");
            onUserNotFound();
        } else {
            console.log("User found");
        }
        // console.log("Credential response:", response.credential);
    } 
        return(
            <div id="google-button"></div>
        )
    
}