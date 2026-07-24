import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
            <h1 className="text-4xl font-bold text-slate-900">
                403
            </h1>

            <p className="mt-3 text-lg font-semibold">
                Access Denied
            </p>

            <p className="mt-2 text-slate-600">
                You don't have permission to access this page.
            </p>

            <Link
                to="/"
                className="mt-6 rounded-md bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700"
            >
                Go to Dashboard
            </Link>
        </div>
    );
};

export default Unauthorized;