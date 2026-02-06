import type { paths } from "#open-fetch-schemas/vvz";

type UnitLecturersErrorResponse =
	paths["/api/v1/unit/{unit_id}/lecturers"]["get"]["responses"]["422"]["content"]["application/json"];
type UnitLecturersSuccessResponse =
	paths["/api/v1/unit/{unit_id}/lecturers"]["get"]["responses"]["200"]["content"]["application/json"];
/***
 * Union type for possible responses from the /unit/{unit_id}/lecturers endpoint
 ***/
export type UnitLecturersResponse =
	| UnitLecturersSuccessResponse
	| UnitLecturersErrorResponse;

type LecturerProfileErrorResponse =
	paths["/api/v1/lecturer/get/{lecturer_id}"]["get"]["responses"]["422"]["content"]["application/json"];
type LecturerProfileSuccessResponse =
	paths["/api/v1/lecturer/get/{lecturer_id}"]["get"]["responses"]["200"]["content"]["application/json"];
/***
 * Union type for possible responses from the /lecturer/get/{lecturer_id} endpoint
 ***/
export type LecturerProfileResponse =
	| LecturerProfileSuccessResponse
	| LecturerProfileErrorResponse;

type UnitErrorResponse =
	paths["/api/v1/unit/{unit_id}/get"]["get"]["responses"]["422"]["content"]["application/json"];
type UnitSuccessResponse =
	paths["/api/v1/unit/{unit_id}/get"]["get"]["responses"]["200"]["content"]["application/json"];
/***
 * Union type for possible responses from the /unit/{unit_id}/get endpoint
 ***/
export type UnitResponse = UnitSuccessResponse | UnitErrorResponse;
