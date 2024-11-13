const AvailabilityPageLayout = ({
	children,
	add_mentor_availability,
}: {
	children: React.ReactNode;
	add_mentor_availability: React.ReactNode;
}) => {
	return (
		<>
			{children}
			{add_mentor_availability}
		</>
	);
};

export default AvailabilityPageLayout;
