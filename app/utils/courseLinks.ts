export const courseLinks: Record<
	string,
	{ moodle?: string; examRepo?: string }
> = {
	"252-0025-01L": {
		moodle: "https://moodle-app2.let.ethz.ch/course/view.php?id=12345",
		examRepo: "https://exams.vis.ethz.ch/exams/252-0025-01L",
	},
	"eth-101": { moodle: "https://moodle-app2.let.ethz.ch/" },
};

export function getLinksForCourse(id: string) {
	return courseLinks[id];
}
