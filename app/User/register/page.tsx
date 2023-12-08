'use client';
import { FormEvent } from "react"
import {toast, Toaster} from "react-hot-toast";



export default async function registerPage({ }: {}) {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await fetch(`/api/auth/register`, {
          method: 'POST',
          body: JSON.stringify({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
          }),
        });
        // Console log message from response
        const body = await response.json();
        const message = body.message;
        console.log({ message });
        if (response.status === 200) {
          window.location.href = '/User/login';
        } else {
            toast.error("Не удалось зарегистрироваться")
        }
      };
    return (

        <div className="flex h-screen justify-center">
            <div><Toaster/></div>
            <div className="w-full bg-background-gray flex items-center justify-center">
                <div className="max-w-md w-full p-6">
                    <h1 className="text-3xl font-semibold mb-6 text-gray-100 text-center">Sign Up</h1>
                    <div className="mt-4 text-sm text-gray-100 text-center">
                        <p>or with email</p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username"
                                   className="block text-sm font-medium text-gray-100">Username</label>
                            <input type="text" id="username" name="username"
                                   className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email</label>
                            <input type="email" id="email" name="email"
                                   className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"/>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-gray-100">Password</label>
                            <input type="password" id="password" name="password"
                                   className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"/>
                        </div>
                        <div>
                            <button type="submit"
                                    className="w-full bg-black font-bold text-white p-2 rounded-md hover:bg-gray-200 hover:text-black focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">Sign
                                Up
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-sm text-gray-400 text-center">
                        <p>Already have an account? <a href="/User/login" className="text-white hover:underline">Login
                            here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}