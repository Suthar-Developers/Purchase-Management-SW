import { useEffect, useState } from 'react'
import { Package, ChevronRight, Plus, ListSortAscending, Ruler, PocketKnife } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import { fetchMaterialsList, fetchCategoryList, fetchUnitList } from '../../api/materialListApi';

const Settings = () => {
    const navigate = useNavigate();

    const [materialData, setMaterialData] = useState({
        totalMaterials: [],
        totalCategories: [],
        totalUnits: []
    })
    const [lastUpdated, setLastUpdated] = useState('')

    const getMaterialsList = async () => {
        try {
            const data = await fetchMaterialsList();
            setMaterialData((prev) => ({
                ...prev,
                totalMaterials: Array.isArray(data) ? data : []
            }));
            setLastUpdated(
                new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })
            );
        } catch (error) {
            console.error("Failed to fetch materials:", error);

            setMaterialData((prev) => ({
                ...prev,
                totalMaterials: []
            }));
        }
    };

    const getCategoryList = async () => {
        try {
            const data = await fetchCategoryList();
            setMaterialData((prev) => ({
                ...prev,
                totalCategories: Array.isArray(data) ? data : []
            }));
            setLastUpdated(
                new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })
            );
        } catch (error) {
            console.error("Failed to fetch categories:", error);

            setMaterialData((prev) => ({
                ...prev,
                totalCategories: []
            }));
        }
    };

    const getUnitList = async () => {
        try {
            const data = await fetchUnitList();
            setMaterialData((prev) => ({
                ...prev,
                totalUnits: Array.isArray(data) ? data : []
            }));
            setLastUpdated(
                new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })
            );
        } catch (error) {
            console.error("Failed to fetch units:", error);

            setMaterialData((prev) => ({
                ...prev,
                totalUnits: []
            }));
        }
    };

    useEffect(() => { 
        getMaterialsList();
        getCategoryList(); 
        getUnitList(); 
    }, []);

    const openMaterialsPage = () => {
        navigate("/materials")
    }

    const openCategoryPage = () => {
        navigate("/material-categories")
    }

    const openUnitPage = () => {
        navigate("/material-units")
    }

    const categories = [
        {
            id: 1,
            name: "Material List",
            description: "Manage all materials",
            subPart: materialData.totalMaterials.length,
            subPartDescription: "Materials",
            icon: <PocketKnife className='text-red-700' size={22} />,
            onClick: openMaterialsPage
        },
        {
            id: 2,
            name: "Units",
            description: "Manage all material units",
            subPart: materialData.totalUnits.length,
            subPartDescription: "Units",
            icon: <Ruler className='text-green-700' size={22} />,
            onClick: openUnitPage
        },
        {
            id: 3,
            name: "Categories",
            description: "Manage all material categories",
            subPart: materialData.totalCategories.length,
            subPartDescription: "Categories",
            icon: <ListSortAscending className='text-blue-700' size={22} />,
            onClick: openCategoryPage
        },
    ];

    return (
        <main className="min-h-full bg-slate-50 px-5 py-5 lg:px-8">

            {/* Page Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Workspace profile</p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-950">Settings</h1>

                    <p className="mt-2 max-w-2xl text-sm text-slate-600">
                        Manage your settings, categories,
                        and day-to-day workspace preferences.
                    </p>
                </div>
            </div>

            <div className='flex w-full'>
                <div className="w-1/2 rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Package size={22} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Materials
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Browse materials by category
                                </p>
                            </div>
                        </div>

                        <button className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700">
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Category List */}
                    <div className="p-3">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={category.onClick}
                                className="group flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-gray-50"
                            >
                                {/* Category Icon */}
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                                    {category.icon}
                                </div>

                                {/* Category Details */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-medium text-gray-900">
                                        {category.name}
                                    </h3>

                                    <p className="truncate text-sm text-gray-500">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Material Count */}
                                <div className="hidden text-right sm:block">
                                    <p className="font-semibold text-gray-900">
                                        {category.subPart}
                                    </p>

                                    <p className="text-xs text-gray-500">{category.subPartDescription}</p>
                                </div>

                                <ChevronRight
                                    size={20}
                                    className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Settings
