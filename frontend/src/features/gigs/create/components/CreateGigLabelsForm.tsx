import React, { useState } from "react";
import { useNavigate } from "react-router";
import { HiOutlinePlus } from "react-icons/hi";
import { HiX } from "react-icons/hi";

import StepNavigation from "./StepNavigation";

import { useCreateGig } from "../hooks/useCreateGig";

const labels = [
  { name: "networking", isSelected: false },
  { name: "conference", isSelected: false },
  { name: "meeting", isSelected: false },
  { name: "startup", isSelected: false },
  { name: "pitch", isSelected: false },
  { name: "interview", isSelected: false },
  { name: "workshop", isSelected: false },
  { name: "trade show", isSelected: false },
  { name: "errands", isSelected: false },
  { name: "tech event", isSelected: false },
  { name: "social gathering", isSelected: false },
  { name: "ceremony", isSelected: false },
  { name: "fundraiser", isSelected: false },
  { name: "business visit", isSelected: false },
  { name: "product launch", isSelected: false },
];

function Label({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <li
      className="flex items-center px-3 py-1.5 rounded-full border border-gray-500 gap-1.5 cursor-pointer hover:bg-gray-200 capitalize active:bg-gray-300"
      onClick={onClick}
    >
      <span className="text-sm">{label}</span>
      {icon}
    </li>
  );
}

function CreateGigLabelsForm() {
  const { setCreateGigData, createGigData } = useCreateGig();

  const [appLabels, setAppLabels] = useState(() => {
    const submittedLabels = createGigData.labels || [];
    if (submittedLabels.length === 0) return labels;
    return labels.map((label) => {
      for (const submittedLabel of submittedLabels) {
        if (label.name === submittedLabel)
          return { ...label, isSelected: true };
      }
      return { ...label };
    });
  });

  const [customLabels, setCustomLabels] = useState<string[]>(() => {
    const customLabels = [];
    const submittedLabels = createGigData.labels || [];
    for (const submittedLabel of submittedLabels) {
      if (!labels.some((l) => l.name === submittedLabel)) {
        customLabels.push(submittedLabel);
      }
    }
    return customLabels;
  });

  const navigate = useNavigate();

  const selectedLabels = [
    ...appLabels.filter((l) => l.isSelected).map((l) => l.name),
    ...customLabels,
  ];

  function selectAppLabel(label: string) {
    setAppLabels((prev) =>
      prev.map((l) => (l.name === label ? { ...l, isSelected: true } : l))
    );
  }

  function unselectAppLabel(label: string) {
    setAppLabels((prev) =>
      prev.map((l) => (l.name === label ? { ...l, isSelected: false } : l))
    );
  }

  function addCustomLabel(label: string) {
    const labelIsSelected = selectedLabels.some(
      (l) => l.toLowerCase() === label.toLowerCase()
    );
    if (labelIsSelected) return;

    for (const appLabel of appLabels) {
      if (appLabel.name.toLowerCase() === label.toLowerCase()) {
        selectAppLabel(appLabel.name);
        return;
      }
    }

    setCustomLabels([...customLabels, label]);
  }

  function removeCustomLabel(customLabel: string) {
    setCustomLabels((prev) => prev.filter((label) => label !== customLabel));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateGigData((createGigData) => ({
      ...createGigData,
      labels: selectedLabels,
    }));
    navigate("/gigs/new/location&time");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <h1 className="text-2xl mb-5 md:font-medium">
          Select labels that match your event details.
        </h1>
        <div className="mb-5">
          <input
            id="title"
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-offset-4 text-sm"
            placeholder="Add a custom label..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (value) {
                  addCustomLabel(value);
                }
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
      </label>

      {selectedLabels.length > 0 && <p className="mb-3">Currently selected</p>}
      <ul className="flex flex-wrap gap-2 mb-5">
        {appLabels.map(
          (appLabel) =>
            appLabel.isSelected && (
              <Label
                label={appLabel.name}
                key={appLabel.name}
                onClick={() => unselectAppLabel(appLabel.name)}
                icon={<HiX />}
              />
            )
        )}
        {customLabels.map((customLabel) => (
          <Label
            label={customLabel}
            key={customLabel}
            icon={<HiX />}
            onClick={() => removeCustomLabel(customLabel)}
          />
        ))}
      </ul>

      <p className="mb-3">Commonly used labels</p>

      <ul className="flex flex-wrap gap-2">
        {appLabels.map(
          (appLabel) =>
            !appLabel.isSelected && (
              <Label
                label={appLabel.name}
                key={appLabel.name}
                onClick={() => selectAppLabel(appLabel.name)}
                icon={<HiOutlinePlus />}
              />
            )
        )}
      </ul>
      <StepNavigation
        handleBack={() => {
          navigate("/gigs/new/description");
        }}
        isValid={selectedLabels.length > 0}
        nextStepName="Location & Time"
      />
    </form>
  );
}

export default CreateGigLabelsForm;
