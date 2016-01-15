import fetch from 'isomorphic-fetch'

export default class Api {
	constructor() {
		this.hostr = 'http://' + document.location.host + '/api/v1'
	}

	getConfig() {
		// console.log('this.hostr', this.hostr)
		return fetch(this.hostr + '/config')
			.then(resp => resp.json())
	}

	setNotifyCalc(notify) {
		return fetch(this.hostr + '/config/notifyCalc', {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({payload: notify})
		})
		.then(resp => resp.json())
	}

	setNotifyMove(notify) {
		return fetch(this.hostr + '/config/notifyMove', {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({payload: notify})
		})
		.then(resp => resp.json())
	}

	setReservedSpace(amount, unit) {
		return fetch(this.hostr + '/config/reservedSpace', {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({payload: JSON.stringify({amount, unit})})
		})
		.then(resp => resp.json())
	}

	addFolder(folder) {
		// console.log('sending: ', folder)
		return fetch(this.hostr + '/config/folder', {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({payload: folder})
		})
		.then(resp => resp.json())
	}

	deleteFolder(folder) {
		// console.log('sending: ', folder)
		return fetch(this.hostr + '/config/folder', {
			method: 'DELETE',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({payload: folder})
		})
		.then(resp => resp.json())
	}

	getStorage() {
		// console.log('this.hostr', this.hostr)
		return fetch(this.hostr + '/storage')
			.then(resp => resp.json())
	}

	getTree(path) {
		return fetch(this.hostr + '/tree', {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({payload: path})
		})
		.then(resp => resp.json())
	}

	toggleDryRun(dryRun) {
		return fetch(this.hostr + '/config/dryRun', {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({payload: dryRun})
		})
		.then(resp => resp.json())
	}
}