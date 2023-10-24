"use client"
import Link from 'next/link'
import styles from './page.module.css'
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from 'react';
import { useRouter, useSearchParams } from  "next/navigation"


const page = () => {

    const [error, setError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        try {

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password

                }),
            });
            res.status === 201 && router.push("/login?success=Account has been created");

        } catch (err) {
            setError(true);
        }
    };


    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} >
                <div className="flex flex-col items-center justify-center min-h-screen py-2 ">
                    <div className=" bg-[#2D3131] rounded-2xl rounded-tr-3xl rounded-br-3xl shadow-2xl flex  w-[850px]">
                        <div className="font-bold w-2/5  rounded-tl-2xl rounded-bl-2xl py-40 px-12 ">
                            <h2 className="text-3xl font-bold mb-2">Hello, Friend</h2>
                            <div className="border-2 w-10 border-white inline-block mb-2"></div>
                            <p className="mb-10">
                                Fill up personal information and start jouney with us.
                            </p>
                            <Link href="/login">
                                <p className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-[#2D3131]">
                                    Sign In
                                </p>
                            </Link>
                        </div>
                        <div className="text-black  w-3/5 p-5 bg-gray-100 rounded-tr-2xl rounded-br-2xl ">
                            <div className="text-left font-bold">
                                <span className="text-red-500">NFT </span>Webtoon{" "}
                            </div>
                            <div className="py-10">
                                <h2 className="text-3xl font-bold text-[#2D3131] mb-2">
                                    Sign Up to Account
                                </h2>
                                <div className="border-2 w-10 border-[#2D3131] inline-block mb-2"></div>
                                <p className="text-gray-400 my-3">or use your email account</p>
                                <div className="flex flex-col items-center">
                                    <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                                        <UserIcon className="h-6 w-6 text-gray-400 mr-2" />
                                        <input
                                            type="text"
                                            name="Name"
                                            placeholder="Name"
                                            className="bg-gray-200 outline-none text-sm flex-1"
                                        />
                                    </div>
                                    <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                                        <EnvelopeIcon className="h-6 w-6 text-gray-400 mr-2" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            className="bg-gray-200 outline-none text-sm flex-1"
                                        />
                                    </div>
                                    <div className="bg-gray-200 w-64 p-2 flex items-center mb-3">
                                        <LockClosedIcon className="h-6 w-6 text-gray-400 mr-2" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            className="bg-gray-200 outline-none text-sm flex-1"
                                        />
                                    </div>
                                    <button>
                                        <p className="border-2 border-[#2D3131] rounded-full px-12 py-2 inline-block font-semibold hover:bg-[#2D3131] hover:text-white">
                                            Sign Up
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" text-red-600 text-sm">
                  {error && error}
                  </div>
            </form>

        </div>
    )
}

export default page