import { useStorage } from "@vueuse/core";

export const coursesStorage = useStorage<{
	courses: Record<string, Omit<CourseDTO, "id">>;
}>("courses", {
	courses: {
		"eth-101": {
			title: "Ethics 101",
		},
		"193980": {
			title: "Lineare Algebra",
			lecturers: [
				{
					firstname: "Bernd",
					lastname: "Gärtner",
					title: "Prof. Dr.",
				},
				{
					firstname: "Robert",
					lastname: "Weismantel",
					title: "Prof. Dr.",
				},
			] as Lecturer[],
			code: "401-0131-00L",
			description:
				"Vectors and matrices, solving systems of linear equations, vector spaces and subspaces, orthogonality and least squares, determinants, eigenvalues and eigenvectors, singular value decomposition and linear transformations. Applications in and links to computer science.",
			links: {
				moodle: "https://moodle-app2.let.ethz.ch/course/view.php?id=26165",
				examRepo: "https://exams.vis.ethz.ch/category/LineareAlgebra",
			},
		},
	},
});
