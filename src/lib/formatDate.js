
const formatDate = (d) => {
	if(!d) return

	let m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const date = new Date(d);
	return m[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
}

export default formatDate