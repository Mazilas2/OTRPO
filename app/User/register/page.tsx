'use client';
import { FormEvent } from "react"


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
        console.log({ response });
        // Console log message from response
        const body = await response.json();
        const message = body.message;
        console.log({ message });
      };
    return (    
        <div className="flex h-screen justify-center">
            <div className="w-full bg-background-gray flex items-center justify-center">
                <div className="max-w-md w-full p-6">
                    <h1 className="text-3xl font-semibold mb-6 text-gray-100 text-center">Sign Up</h1>
                    <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
                        <div className="w-full">
                            <button type="button" className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-800 font-bold p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="github" className="w-4">
                                    <path d="M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z"></path>
                                </svg> Sign Up with Github </button>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-100 text-center">
                        <p>or with email</p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-100">Username</label>
                            <input type="text" id="username" name="username" className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email</label>
                            <input type="email" id="email" name="email" className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
                            <input type="password" id="password" name="password" className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"/>
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-black font-bold text-white p-2 rounded-md hover:bg-gray-200 hover:text-black focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">Sign Up</button>
                        </div>
                    </form>
                    <div className="mt-4 text-sm text-gray-400 text-center">
                        <p>Already have an account? <a href="/User/login" className="text-white hover:underline">Login here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}