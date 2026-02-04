import { useStorage } from "@vueuse/core";

export const coursesStorage = useStorage<{
	courses: Record<string, Omit<Course, "id">>;
}>("courses", {
	courses: {
		"eth-101": {
			title: "Ethics 101",
		},
		"193980": {
			title: "Lineare Algebra",
			description:
				"Vectors and matrices, solving systems of linear equations, vector spaces and subspaces, orthogonality and least squares, determinants, eigenvalues and eigenvectors, singular value decomposition and linear transformations. Applications in and links to computer science.",
			links: {
				moodle: "",
				examRepo: "",
			},
		},
	},
});
