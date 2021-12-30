export function format(s: string, ...args: any[]) {
	return s.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] !== "undefined" ? args[number] : match;
	});
}
