import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../../components/common/Button";
import { AddNewCategory as createCategory, fetchCategoryList } from "../../../api/materialListApi";

import { ChevronLeft, FolderTree, Plus, Search, Pencil, Layers3, ChevronLeft as PreviousIcon, ChevronRight as NextIcon } from "lucide-react";

const Categories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [searchCategory, setSearchCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        material_category: "",
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const getCategoryList = async () => {
        try {
            const data = await fetchCategoryList();

            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
        }
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryName = form.material_category.trim();

        if (!categoryName) {
            alert("Please enter a category name.");
            return;
        }

        try {
            setIsSubmitting(true);

            const data = await createCategory({
                material_category: categoryName,
            });

            toast.success(
                data.message,
                { duration: 4000, }
            );

            setForm({
                material_category: "",
            });

            await getCategoryList();

            // Go back to first page after adding
            setCurrentPage(1);
        } catch (error) {
            console.error("Failed to create category:", error);

            alert(
                error?.response?.data?.message ||
                "Error while creating new category."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter categories
    const filteredCategories = useMemo(() => {
        return categories.filter((item) =>
            item.material_category?.toLowerCase().includes(searchCategory.toLowerCase())
        );
    }, [categories, searchCategory]);

    // Total pages
    const totalPages = Math.ceil(
        filteredCategories.length / itemsPerPage
    );

    // Current page data
    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return filteredCategories.slice(startIndex, endIndex);
    }, [filteredCategories, currentPage, itemsPerPage]);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchCategory]);

    // Make sure current page remains valid
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const startItem = filteredCategories.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        filteredCategories.length
    );

    return (
        <main className="h-full min-h-0 overflow-hidden bg-slate-100 px-5 py-2 lg:px-8">

            {/* Page Header */}
            <div className="mb-3 shrink-0">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Materials</p>
                </div>

                <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                <p className="mt-1 text-sm text-slate-500">Create and manage material categories.</p>
            </div>

            {/* Main Content */}
            <div className="grid min-h-0 h-[calc(100%-92px)] grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.6fr]">

                {/* Categories List */}
                <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* List Header */}
                    <div className="shrink-0 border-b border-slate-200 px-5 py-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <FolderTree size={20} />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">All Categories</h2>

                                    <p className="text-xs text-slate-500">
                                        {categories.length}{" "}
                                        {categories.length === 1 ? "category" : "categories"}
                                    </p>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    placeholder="Search categories..."
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="mx-4 mt-4 shrink-0 flex items-center rounded-lg bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <div className="w-14 text-center">#</div>
                        <div className="flex-1">Category</div>
                        <div className="w-20 text-center">Action</div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-2">
                        {paginatedCategories.length > 0 ? (
                            paginatedCategories.map(
                                (item, index) => {
                                    const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

                                    return (
                                        <div
                                            key={item.material_category_id}
                                            className="group flex items-center border-b border-slate-100 px-4 py-3 text-sm transition hover:bg-slate-50"
                                        >
                                            {/* Serial Number */}
                                            <div className="w-14 text-center text-xs font-medium text-slate-400">
                                                {serialNumber}
                                            </div>

                                            {/* Category */}
                                            <div className="flex flex-1 items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                    <Layers3 size={15} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-slate-800">
                                                        {item.material_category}
                                                    </p>

                                                    <p className="text-[11px] text-slate-400">Category</p>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <div className="flex w-20 justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(item)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                                                    title="Edit category"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                    <FolderTree size={22} />
                                </div>

                                <h3 className="text-sm font-semibold text-slate-700">No categories found</h3>

                                <p className="mt-1 max-w-xs text-xs text-slate-400">
                                    {searchCategory ? "Try changing your search term." : "Create your first material category using the form."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    <div className="shrink-0 border-t border-slate-200 px-5 py-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            {/* Results */}
                            <p className="text-xs text-slate-400">
                                Showing{" "}
                                <span className="font-medium text-slate-600">{startItem}</span>
                                {" - "}
                                <span className="font-medium text-slate-600">{endItem}</span>
                                {" of "}
                                <span className="font-medium text-slate-600">{filteredCategories.length}</span>
                            </p>

                            <div className="flex items-center gap-3">

                                {/* Items Per Page */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Rows:</span>

                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>

                                {/* Previous */}
                                <button
                                    type="button"
                                    disabled={currentPage === 1 || totalPages === 0}
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Previous page"
                                >
                                    <PreviousIcon size={15} />
                                </button>

                                {/* Page Number */}
                                <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-blue-600 px-2 text-xs font-semibold text-white">
                                    {totalPages === 0 ? 0 : currentPage}
                                </div>

                                <span className="text-xs text-slate-400">
                                    of {totalPages}
                                </span>

                                {/* Next */}
                                <button
                                    type="button"
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Next page"
                                >
                                    <NextIcon size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Add Category */}
                <section className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Form Header */}
                    <div className="border-b border-slate-200 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Plus size={20} />
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Add Category</h2>
                                <p className="text-xs text-slate-500">Create a new material category</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-5">
                        <div>
                            <label htmlFor="material_category" className="mb-2 block text-xs font-semibold text-slate-700">
                                Category Name
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <input
                                id="material_category"
                                type="text"
                                name="material_category"
                                value={form.material_category}
                                onChange={handleChange}
                                placeholder="Enter category name"
                                disabled={isSubmitting}
                                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                required
                            />

                            <p className="mt-2 text-[11px] leading-4 text-slate-400">
                                Use a clear and unique name for
                                this material category.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => setForm({ material_category: "", })}
                                className="rounded-lg bg-slate-100 px-5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Clear
                            </button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                lable={isSubmitting ? "Adding..." : "Add Category"}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default Categories;