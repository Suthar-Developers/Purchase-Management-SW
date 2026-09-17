import React, { useState, useMemo, useEffect } from "react"
import { updateProject } from "../../api/projectApi"
import { State, City } from "country-state-city"
import Button from "../common/Button"

const EMPTY_SECONDARY_CONTACT = {
  name: "",
  number: "",
  email: "",
};

const EMPTY_PERSON = {
  name: "",
  number: "",
  email: "",
};

/* Reusable Field Component */
const formatDate = (dateStr) => {
  if (!dateStr) return ""

  const date = new Date(dateStr)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const getPerson = (person) => ({
  name: person?.name || "",
  number: person?.number || person?.phone || "",
  email: person?.email || "",
});

const normalizeProject = (project) => {
  const contacts = project?.contacts || {};

  const primaryContact =
    contacts.primaryContactPerson ||
    (project?.contactPersonName
      ? {
        name: project.contactPersonName,
        phone: project.contactPersonNumber,
        email: project.contactPersonEmail,
      }
      : null);

  const secondaryContact =
    contacts.secondaryContactPersons?.[0] || project?.secondaryContactPerson;

  const manager =
    contacts.projectManager ||
    (project?.projectManagerName
      ? {
        name: project.projectManagerName,
        phone: project.projectManagerNumber,
        email: project.projectManagerEmail,
      }
      : null);

  const primarySupervisor =
    contacts.primarySupervisor ||
    (project?.supervisorName
      ? {
        name: project.supervisorName,
        phone: project.supervisorNumber,
        email: project.supervisorEmail,
      }
      : null);

  const secondarySupervisors =
    contacts.secondarySupervisors ||
    project?.secondarySupervisors ||
    [];

  const stateObj = State.getStatesOfCountry("IN").find(
    (state) => state.name === project?.state
  );

  return {
    ...project,

    projectName: project?.projectName || "",
    projectCode: project?.projectCode || "",
    clientName: project?.clientName || "",
    projectAreaSqft: project?.projectAreaSqft ?? "",
    scopeOfWork: project?.scopeOfWork || "",

    startDate: formatDate(project?.startDate),
    endDate: formatDate(project?.endDate),

    state: project?.state || "",
    stateCode: project?.stateCode || stateObj?.isoCode || "",
    city: project?.city || "",
    address: project?.address || "",

    status: project?.status || "Planned",
    budget: project?.budget ?? "",
    description: project?.description || "",

    contactPerson: getPerson(primaryContact),
    secondaryContactPerson: getPerson(secondaryContact),

    projectManager: getPerson(manager),

    supervisor: getPerson(primarySupervisor),
    secondarySupervisors: Array.isArray(secondarySupervisors)
      ? secondarySupervisors.map((person, index) => ({
        id: person.contact_id || person.id || `existing-${index}`,
        name: person.name || "",
        number: person.phone || person.number || "",
        email: person.email || "",
      }))
      : [],
  };
};

const Field = ({ label, name, value, isEditing, onChange, options, type = "text", readOnly = false, placeholder = "" }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      {isEditing && !readOnly ? (
        options ? (
          <select
            name={name}
            value={value ?? ""}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        )
      ) : (
        <p className="min-h-7.5 wrap-break text-sm font-semibold text-slate-800">
          {type === "date" ? formatDate(value) || "—" : value || "—"}
        </p>
      )}
    </div>
  );
};

const PersonCard = ({ title, subtitle, person, isPrimary = false, isEditing, onChange, accent = "indigo", }) => {
  const accents = {
    indigo: {
      border: "border-indigo-200",
      bg: "bg-indigo-50/60",
      icon: "bg-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
    },
    emerald: {
      border: "border-emerald-200",
      bg: "bg-emerald-50/60",
      icon: "bg-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
    amber: {
      border: "border-amber-200",
      bg: "bg-amber-50/60",
      icon: "bg-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    sky: {
      border: "border-sky-200",
      bg: "bg-sky-50/60",
      icon: "bg-sky-600",
      badge: "bg-sky-100 text-sky-700",
    },
  };

  const style = accents[accent] || accents.indigo;

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} p-4`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${style.icon}`}>
            {person?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-slate-800">{title}</h4>

              {isPrimary && (
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${style.badge}`}>
                  PRIMARY
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={person?.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Full Name"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <input
            type="tel"
            value={person?.number || ""}
            onChange={(e) => onChange("number", e.target.value)}
            placeholder="Contact Number"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <input
            type="email"
            value={person?.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="Email Address"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <p className="text-[10px] font-medium uppercase text-slate-400">
              Name
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-800">
              {person?.name || "—"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase text-slate-400">
              Phone
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-800">
              {person?.number || "—"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase text-slate-400">
              Email
            </p>
            <p className="mt-1 break-all text-xs font-semibold text-slate-800">
              {person?.email || "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionHeader = ({ number, title, subtitle }) => (
  <div className="mb-4 flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
      {number}
    </div>

    <div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>
      )}
    </div>
  </div>
);

const ProjectView = ({ project, onClose, refreshProjects, startEditing }) => {
  const [isEditing, setIsEditing] = useState(Boolean(startEditing));
  const [formData, setFormData] = useState(() =>
    project ? normalizeProject(project) : {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const states = useMemo(() => State.getStatesOfCountry("IN"), []);

  const cities = useMemo(() => {
    if (!formData.stateCode) return [];
    return City.getCitiesOfState("IN", formData.stateCode);
  }, [formData.stateCode]);

  useEffect(() => {
    if (!project) return;

    setFormData(normalizeProject(project));
    setIsEditing(Boolean(startEditing));
  }, [project, startEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePerson = (personKey, field, value) => {
    setFormData((prev) => ({
      ...prev, [personKey]: {
        ...prev[personKey], [field]: value,
      },
    }));
  };

  const updateSecondarySupervisor = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      secondarySupervisors: prev.secondarySupervisors.map((person) =>
        person.id === id ? { ...person, [field]: value } : person
      ),
    }));
  };

  const addSecondarySupervisor = () => {
    setFormData((prev) => ({
      ...prev,
      secondarySupervisors: [
        ...prev.secondarySupervisors,
        {
          id: `new-${Date.now()}`,
          name: "",
          number: "",
          email: "",
        },
      ],
    }));
  };

  const removeSecondarySupervisor = (id) => {
    setFormData((prev) => ({
      ...prev,
      secondarySupervisors: prev.secondarySupervisors.filter(
        (person) => person.id !== id
      ),
    }));
  };

  const handleStateChange = (e) => {
    const selectedState = states.find(
      (state) => state.name === e.target.value
    );

    setFormData((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      stateCode: selectedState?.isoCode || "",
      city: "",
    }));
  };

  const handleUpdate = async () => {
    if (!formData.projectName?.trim()) {
      alert("Project name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        projectName: formData.projectName,
        projectCode: formData.projectCode,
        clientName: formData.clientName,
        projectAreaSqft: formData.projectAreaSqft,
        scopeOfWork: formData.scopeOfWork,

        state: formData.state,
        stateCode: formData.stateCode,
        city: formData.city,
        address: formData.address,

        startDate: formData.startDate || null,
        endDate: formData.endDate || null,

        contactPersonName: formData.contactPerson?.name || "",
        contactPersonNumber: formData.contactPerson?.number || "",
        contactPersonEmail: formData.contactPerson?.email || "",

        secondaryContactPerson: formData.secondaryContactPerson,

        projectManagerName: formData.projectManager?.name || "",
        projectManagerNumber: formData.projectManager?.number || "",
        projectManagerEmail: formData.projectManager?.email || "",

        supervisorName: formData.supervisor?.name || "",
        supervisorNumber: formData.supervisor?.number || "",
        supervisorEmail: formData.supervisor?.email || "",

        secondarySupervisors: formData.secondarySupervisors || [],

        status: formData.status,
        budget: formData.budget,
        description: formData.description,
      };

      const res = await updateProject(formData.project_id, payload);

      alert(res?.message || "Project updated successfully.");

      await refreshProjects();
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Update project error:", error);

      alert(
        error.response?.data?.message || "Failed to update project."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-200">
                {formData.projectName?.charAt(0)?.toUpperCase() || "P"}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {formData.projectName || "Project Details"}
                  </h2>

                  {formData.status && (
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
                      {formData.status}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Project Code:{" "}
                  <span className="font-semibold text-slate-600">
                    {formData.projectCode || "—"}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Header actions */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isEditing ? "Editing project information" : "Project overview"}
            </div>

            <div className="flex gap-2">
              <Button
                lable="Close"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              />

              {isEditing ? (
                <>
                  <Button
                    lable="Cancel"
                    onClick={() => {
                      setFormData(normalizeProject(project));
                      setIsEditing(false);
                    }}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                  />

                  <Button
                    lable={isSaving ? "Saving..." : "Save Changes"}
                    onClick={handleUpdate}
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                    disabled={isSaving}
                  />
                </>
              ) : (
                <Button
                  lable="Edit Project"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                />
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Project information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeader
                number="01"
                title="Project Information"
                subtitle="Basic project and commercial details"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Field
                  label="Project Name"
                  name="projectName"
                  value={formData.projectName}
                  isEditing={isEditing}
                  onChange={handleChange}
                />

                <Field
                  label="Project Code"
                  name="projectCode"
                  value={formData.projectCode}
                  isEditing={isEditing}
                  onChange={handleChange}
                  readOnly
                />

                <Field
                  label="Client Name"
                  name="clientName"
                  value={formData.clientName}
                  isEditing={isEditing}
                  onChange={handleChange}
                />

                <Field
                  label="Project Area (SQFT)"
                  name="projectAreaSqft"
                  value={formData.projectAreaSqft}
                  isEditing={isEditing}
                  onChange={handleChange}
                  type="number"
                />

                <Field
                  label="Budget"
                  name="budget"
                  value={formData.budget}
                  isEditing={isEditing}
                  onChange={handleChange}
                  type="number"
                />

                <Field
                  label="Status"
                  name="status"
                  value={formData.status}
                  isEditing={isEditing}
                  onChange={handleChange}
                  options={["Started", "Planned", "Completed", "Hold"]}
                />

                <Field
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  isEditing={isEditing}
                  onChange={handleChange}
                  type="date"
                />

                <Field
                  label="End Date"
                  name="endDate"
                  value={formData.endDate}
                  isEditing={isEditing}
                  onChange={handleChange}
                  type="date"
                />

                <Field
                  label="Scope of Work"
                  name="scopeOfWork"
                  value={formData.scopeOfWork}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* Location */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeader
                number="02"
                title="Project Location"
                subtitle="State, city and project address"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {isEditing ? (
                  <>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        State
                      </p>

                      <select
                        value={formData.state || ""}
                        onChange={handleStateChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="">Select State</option>

                        {states.map((state) => (
                          <option key={state.isoCode} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        City
                      </p>

                      <select
                        value={formData.city || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        disabled={!formData.stateCode}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none disabled:bg-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="">Select City</option>

                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Field
                      label="State Code"
                      name="stateCode"
                      value={formData.stateCode}
                      isEditing={false}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <Field
                      label="State"
                      name="state"
                      value={formData.state}
                      isEditing={false}
                      onChange={handleChange}
                    />

                    <Field
                      label="State Code"
                      name="stateCode"
                      value={formData.stateCode}
                      isEditing={false}
                      onChange={handleChange}
                    />

                    <Field
                      label="City"
                      name="city"
                      value={formData.city}
                      isEditing={false}
                      onChange={handleChange}
                    />
                  </>
                )}

                <div className="md:col-span-2 lg:col-span-3">
                  <Field
                    label="Project Address"
                    name="address"
                    value={formData.address}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* Contact person */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeader
                number="03"
                title="Contact Persons"
                subtitle="Primary and secondary project contacts"
              />

              <div className="space-y-3">
                <PersonCard
                  title="Primary Contact Person"
                  subtitle="Main client/project contact"
                  person={formData.contactPerson}
                  isPrimary
                  isEditing={isEditing}
                  accent="indigo"
                  onChange={(field, value) =>
                    updatePerson("contactPerson", field, value)
                  }
                />

                <PersonCard
                  title="Secondary Contact Person"
                  subtitle="Additional contact person"
                  person={formData.secondaryContactPerson}
                  isEditing={isEditing}
                  accent="sky"
                  onChange={(field, value) =>
                    updatePerson("secondaryContactPerson", field, value)
                  }
                />
              </div>
            </section>

            {/* Project manager */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeader
                number="04"
                title="Project Management"
                subtitle="People responsible for project coordination"
              />

              <PersonCard
                title="Project Manager"
                subtitle="Person responsible for project management"
                person={formData.projectManager}
                isPrimary
                isEditing={isEditing}
                accent="emerald"
                onChange={(field, value) =>
                  updatePerson("projectManager", field, value)
                }
              />
            </section>

            {/* Supervisors */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <SectionHeader
                  number="05"
                  title="Supervisors"
                  subtitle="Primary and secondary site supervisors"
                />

                {isEditing && (
                  <Button
                    lable="+ Add Supervisor"
                    onClick={addSecondarySupervisor}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-800"
                  />
                )}
              </div>

              <div className="space-y-3">
                <PersonCard
                  title="Primary Supervisor"
                  subtitle="Main supervisor responsible for the project"
                  person={formData.supervisor}
                  isPrimary
                  isEditing={isEditing}
                  accent="amber"
                  onChange={(field, value) =>
                    updatePerson("supervisor", field, value)
                  }
                />

                {formData.secondarySupervisors?.map(
                  (supervisor, index) => (
                    <div key={supervisor.id} className="relative">
                      <PersonCard
                        title={`Secondary Supervisor ${index + 1}`}
                        subtitle="Additional site supervisor"
                        person={supervisor}
                        isEditing={isEditing}
                        accent="sky"
                        onChange={(field, value) =>
                          updateSecondarySupervisor(
                            supervisor.id,
                            field,
                            value
                          )
                        }
                      />

                      {isEditing && (
                        <button
                          type="button"
                          onClick={() =>
                            removeSecondarySupervisor(supervisor.id)
                          }
                          className="absolute right-4 top-4 rounded-lg px-2 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )
                )}

                {formData.secondarySupervisors?.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
                    <p className="text-xs font-medium text-slate-500">
                      No secondary supervisors added
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {isEditing
                        ? "Use the Add Supervisor button if another supervisor is required."
                        : "No additional supervisors are assigned."}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeader
                number="06"
                title="Scope & Description"
                subtitle="Project scope and additional information"
              />

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Scope of Work
                  </p>

                  {isEditing ? (
                    <textarea
                      name="scopeOfWork"
                      value={formData.scopeOfWork || ""}
                      onChange={handleChange}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm font-semibold text-slate-800">
                      {formData.scopeOfWork || "—"}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Description
                  </p>

                  {isEditing ? (
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      rows={4}
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm font-semibold text-slate-800">
                      {formData.description || "—"}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Project #{formData.project_id || "—"}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Review all project information before saving changes.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  lable="Close"
                  onClick={onClose}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                />

                {isEditing && (
                  <Button
                    lable={isSaving ? "Saving..." : "Save Changes"}
                    onClick={handleUpdate}
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    disabled={isSaving}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectView