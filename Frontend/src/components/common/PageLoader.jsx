const PageLoader = ({ text = "Loading..." }) => {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>

                <p className="text-sm text-slate-500">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default PageLoader;