const CohortsPageLayout = ({
	children,
	create_cohort_modal,
}: {
	children: React.ReactNode;
	create_cohort_modal: React.ReactNode;
}) => {
	return (
		<>
			{children}
			{create_cohort_modal}
		</>
	);
};

export default CohortsPageLayout;
