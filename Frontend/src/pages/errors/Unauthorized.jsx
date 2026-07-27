import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <div className="max-w-md rounded-xl bg-white p-8 shadow-lg text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <ShieldAlert size={32} />
                </div>

                <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    Access Denied
                </h1>

                <p className="mt-3 text-slate-600">
                    You don't have permission to access this page.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-flex rounded-lg bg-cyan-600 px-5 py-3 font-medium text-white hover:bg-cyan-700"
                >
                    Go to Dashboard
                </Link>

            </div>
        </div>
    );
};

export default Unauthorized;