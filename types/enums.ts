export enum AppPermission {
	cohorts_delete = "cohorts.delete",
	cohorts_create = "cohorts.create",
	cohort_modify = "cohort.modify",
}

export enum CohortRole {
	admin = "admin",
	mentor = "mentor",
	mentee = "mentee",
	coordinator = "coordinator",
}

export enum CollegeCampuses {
	Progress = "Progress",
	Morningside = "Morningside",
	Downsview = "Downsview",
	Ashtonbee = "Ashtonbee",
	Story_Arts_Centre = "Story Arts Centre",
}

export enum CollegeSemesters {
	fall = "fall",
	winter = "winter",
	summer = "summer",
}

export enum MatchStatus {
	pending = "pending",
	confirmed = "confirmed",
	cancelled = "cancelled",
}

export enum UserSex {
	male = "male",
	female = "female",
	other = "other",
}
