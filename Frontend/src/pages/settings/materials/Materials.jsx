import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { ChevronLeft, FolderTree, Plus, Search, Pencil, RulerDimensionLine, ChevronLeft as PreviousIcon, ChevronRight as NextIcon } from "lucide-react";

import Button from '../../../components/common/Button'
import { AddNewMaterial as createMaterial, fetchMaterialsList, fetchCategoryList } from '../../../api/materialListApi';


const Materials = () => {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [searchMaterial, setSearchMaterial] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    material_name: "",
    material_code: "",
    material_category: "",
    material_status: "Active"
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getMaterialList = async () => {
    try {
      const data = await fetchMaterialsList();

      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
      setMaterials([]);
    }
  };

  const getCategoryList = async () => {
    try {
      const data = await fetchCategoryList();

      setCategoryList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategoryList([]);
    }
  };

  useEffect(() => {
    getMaterialList();
    getCategoryList();
  }, []);

  // Input change
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const materialName = form.material_name.trim();
    const materialCode = form.material_code.trim();
    const materialCategory = form.material_category.trim();
    const materialStatus = form.material_status.trim();

    if (!materialName) {
      alert("Please enter a material name.");
      return;
    }

    if (!materialCategory) {
      alert("Please enter a material category.");
      return;
    }

    if (!materialStatus) {
      alert("Please enter a material status.");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await createMaterial({
        material_name: materialName,
        material_code: materialCode,
        material_category: materialCategory,
        material_status: materialStatus
      });

      toast.success(
        data.message,
        { duration: 4000, }
      );

      // Reset form
      setForm({
        material_name: "",
        material_code: "",
        material_category: "",
        material_status: "Active"
      });

      // Refresh list
      await getMaterialList();

      // Go back to first page after adding
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to create material:", error);

      alert(
        error?.response?.data?.message ||
        "Error while creating new material."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter materials
  const filteredMaterials = useMemo(() => {
    const search = searchMaterial.toLowerCase().trim();

    if (!search) {
      return materials;
    }

    return materials.filter((item) => {
      return (
        item.material_name?.toLowerCase().includes(search) ||
        item.material_code?.toLowerCase().includes(search) ||
        item.material_category?.toLowerCase().includes(search) ||
        item.material_status?.toLowerCase().includes(search)
      );
    });
  }, [materials, searchMaterial]);

  // Total pages
  const totalPages = Math.ceil(
    filteredMaterials.length / itemsPerPage
  );

  // Current page data
  const paginatedMaterials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredMaterials.slice(startIndex, endIndex);
  }, [filteredMaterials, currentPage, itemsPerPage]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchMaterial]);

  // Make sure current page remains valid
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startItem = filteredMaterials.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    currentPage * itemsPerPage,
    filteredMaterials.length
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

          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Settings</p>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Materials</h1>
        <p className="mt-1 text-sm text-slate-500">Create and manage materials.</p>
      </div>

      {/* Main Content */}
      <div className="grid min-h-0 h-[calc(100%-92px)] grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.6fr]">

        {/* Materials List */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* List Header */}
          <div className="shrink-0 border-b border-slate-200 px-5 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FolderTree size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900">All Materials</h2>

                  <p className="text-xs text-slate-500">
                    {materials.length}{" "}
                    {materials.length === 1 ? "material" : "materials"}
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
                  value={searchMaterial}
                  onChange={(e) => setSearchMaterial(e.target.value)}
                  placeholder="Search materials..."
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Table Header */}
            <div className="mt-4 shrink-0 flex items-center rounded-lg bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <div className="w-12 shrink-0 text-center">#</div>
              <div className="min-w-0 flex-1">Material</div>
              <div className="w-28 shrink-0">Material Code</div>
              <div className="w-32 shrink-0">Category</div>
              <div className="w-24 shrink-0">Status</div>
              <div className="w-16 shrink-0 text-center">Action</div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            {paginatedMaterials.length > 0 ? (
              <div className="px-4">
                {paginatedMaterials.map((item, index) => {
                  const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

                  return (
                    <div
                      key={item.material_id}
                      className="group flex items-center border-b border-slate-100 px-4 py-3 text-sm transition hover:bg-slate-50"
                    >
                      {/* Serial Number */}
                      <div className="w-12 shrink-0 text-center text-xs font-medium text-slate-400">
                        {serialNumber}
                      </div>

                      {/* Material */}
                      <div className="flex flex-1 min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <RulerDimensionLine size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-800">
                            {item.material_name}
                          </p>

                          <p className="text-[11px] text-slate-400">Material</p>
                        </div>
                      </div>

                      {/* Material Code */}
                      <div className="w-28 shrink-0 min-w-0 pr-2">
                        <p className="truncate font-medium text-slate-800">
                          {item.material_code}
                        </p>
                      </div>

                      {/* Material Category */}
                      <div className="w-32 shrink-0 min-w-0 pr-2">
                        <p className="truncate font-medium text-slate-800">
                          {item.material_category}
                        </p>
                      </div>

                      {/* Material Status */}
                      <div className="w-24 shrink-0">
                        <p className="truncate font-medium text-slate-800">
                          {item.material_status}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex w-16 shrink-0 justify-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                          title="Edit material"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <FolderTree size={22} />
                </div>

                <h3 className="text-sm font-semibold text-slate-700">No materials found</h3>

                <p className="mt-1 max-w-xs text-xs text-slate-400">
                  {searchMaterial ? "Try changing your search term." : "Create your first material using the form."}
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
                <span className="font-medium text-slate-600">{filteredMaterials.length}</span>
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

        {/* Add Material */}
        <section className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Form Header */}
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Plus size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">Add Material</h2>
                <p className="text-xs text-slate-500">Use a clear and unique name for this material.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5">

            {/* Material Name */}
            <div>
              <label htmlFor="material_name" className="mb-1 block text-xs font-semibold text-slate-700">
                Material Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="material_name"
                type="text"
                name="material_name"
                value={form.material_name}
                onChange={handleChange}
                placeholder="Enter material name"
                disabled={isSubmitting}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                required
              />
            </div>

            {/* Material Code */}
            <div className="mt-4">
              <label htmlFor="material_code" className="mb-1 block text-xs font-semibold text-slate-700">
                Material Code
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="material_code"
                type="text"
                name="material_code"
                value={form.material_code}
                onChange={handleChange}
                placeholder="Enter material code"
                disabled={isSubmitting}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                required
              />
            </div>

            {/* Material Category */}
            <div className="mt-4">
              <label htmlFor="material_category" className="mb-1 block text-xs font-semibold text-slate-700">
                Material Category
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                name="material_category"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                onChange={handleChange}
                value={form.material_category}
                disabled={isSubmitting}
                required
              >
                <option value="" disabled>Select Category</option>
                {categoryList.map((c) => (
                  <option key={c.material_category_id} value={c.material_category}>
                    {c.material_category}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex justify-end gap-2">

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setForm({
                  material_name: "",
                  material_code: "",
                  material_category: "",
                  material_status: "",
                })}
                className="rounded-lg bg-slate-100 px-5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

              <Button
                type="submit"
                disabled={isSubmitting}
                lable={isSubmitting ? "Adding..." : "Add Material"}
                className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </form>
        </section>
      </div >
    </main >
  )
}

export default Materials