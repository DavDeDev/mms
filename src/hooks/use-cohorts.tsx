"use client";

import { type ReactNode, createContext, useContext, useState } from "react";

type Cohort = {
	id: string;
	name: string;
	// Add other cohort properties as needed
};

type CohortContextType = {
	cohorts: Cohort[] | null;
	currentCohort: Cohort | null;
	setCurrentCohort: (cohort: Cohort) => void;
};

const CohortContext = createContext<CohortContextType | null>(null);

export const CohortProvider = ({
	children,
	initialCohorts,
}: { children: ReactNode; initialCohorts: Cohort[] | null }) => {
	const [cohorts] = useState(initialCohorts);
	const [currentCohort, setCurrentCohort] = useState<Cohort | null>(
		cohorts && cohorts.length > 0 ? cohorts[0] : null,
	);

	return (
		<CohortContext.Provider
			value={{ cohorts, currentCohort, setCurrentCohort }}
		>
			{children}
		</CohortContext.Provider>
	);
};

export const useCohorts = () => {
	const context = useContext(CohortContext);
	if (context === null) {
		throw new Error("useCohorts must be used within a CohortProvider");
	}
	return context;
};
