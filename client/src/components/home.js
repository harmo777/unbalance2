import React, { Component } from 'react'
import { Link } from 'react-router'
import TreeMenu from 'react-tree-menu'

import ConsolePanel from './consolePanel'

import { humanBytes, percentage, scramble } from '../lib/utils'

import styles from '../styles/core.scss'
import classNames from 'classnames/bind'

require('./tree-view.css')

let cx = classNames.bind(styles)

export default class Home extends Component {
	// componentWillMount() {
	// 	let { store, history } = this.props
	// 	if (store.state.config.folders.length === 0) {
	// 		history.pushState(null, '/settings')
	// 	}
	// }

	// componentDidMount() {
	// 	// // let { model, history } = this.props
	// 	// // if (!model.config) {
	// 	// // 	history.pushState(null, '/settings')
	// 	// // }
	// 	// // console.log('home.didmount.props: ', this.props)
	// 	// this.props.dispatch(C.GET_STORAGE)
	// 	let { actions, dispatch } = this.props.store
	// 	dispatch(actions.getStorage)
	// }

	render() {
		let { state, actions } = this.props.store
		// let { dispatch, model } = this.props

		// const data = [
		// 	{label: 'films', checkbox: true, collapsed: true, collapsible: true, children: [{label: 'bluray'},{label: 'blurip'}]},
		// 	{label: 'tvshows', checkbox: true, collapsed: true, collapsible: true, children: [{label: 'Loading ...'}]},
		// 	{label: 'storage', checkbox: true, collapsed: true, collapsible: true, children: [{label: 'Loading ...'}]},
		// 	{label: 'backup', checkbox: true, collapsed: true, collapsible: true, children: [{label: 'Loading ...'}]}
		// ]

		if (!state.unraid) {
			return null
		}

		if (state.unraid.condition.state !== "STARTED") {
			return (
				<section className={cx('row', 'bottom-spacer-half')}>
					<div className={cx('col-xs-12')}>
						<p className={cx('bg-warning')}>The array is not started. Please start the array before perfoming any operations with unBALANCE.</p>
					</div>
				</section>
			)
		}

		// <span style="width: {((state.unraid.condition.size-state.unraid.condition.free) / state.unraid.condition.size )}"></span>

		let consolePanel = null
		if (state.lines.length !== 0) {
			consolePanel = (
				<section className={cx('row', 'bottom-spacer-half')}>
					<div className={cx('col-xs-12')}>
						<ConsolePanel lines={state.lines} style={'console-feedback'} />
					</div>
				</section>
			)
		}

					// {percentage(disk.free/disk.size)}

		let rows = 	state.unraid.disks.map( (disk, i) => {
			let diskChanged = cx({
				'label': disk.newFree !== disk.free,
				'label-success': disk.newFree !== disk.free && state.fromDisk[disk.path],
			})

			const percent = percentage((disk.size - disk.free) / disk.size)

			// console.log("disk.name.length: ", disk.name.length)

			// let serial = scramble(disk.serial)
			if (disk.type === "Cache" && disk.name.length > 5) {
				return (
					<tr key={i}>
						<td>{disk.name}</td>
						<td>{disk.fsType}</td>
						<td colSpan="7">{disk.serial} ({disk.device})</td>
					</tr>
				)
			} else {
				// lines initially contains the disk row, which includes the
				// checkbox indicating it's either the from disk or a to disk
				let lines = [
					<tr key={i}>
						<td>{disk.name}</td>
						<td>{disk.fsType}</td>
						<td>{disk.serial} ({disk.device})</td>
						<td><input type="checkbox" checked={state.fromDisk[disk.path]} onChange={this._checkFrom(disk.path)} /></td>
						<td><input type="checkbox" checked={state.toDisk[disk.path]} onChange={this._checkTo(disk.path)} /></td>
						<td>{humanBytes(disk.size)}</td>
						<td>{humanBytes(disk.free)}</td>
						<td>
							<div className={cx('progress')}>
								<span style={{width: percent}}></span>
							</div>
						</td>
						<td>
							<span className={diskChanged}>{humanBytes(disk.newFree)}</span>
						</td>
					</tr>
				]

				// if it's the source disk, let's add a second row, with the
				// tree-menu
				if (state.fromDisk[disk.path]) {
					const key = i + 100
					lines.push(
						<tr key={key}>
							<td colSpan="3">
							<b>Select folders/files to move</b><br/>
							<TreeMenu
								expandIconClass="fa fa-chevron-right"
						        collapseIconClass="fa fa-chevron-down"
								onTreeNodeClick={this.onClick}
								onTreeNodeCollapseChange={this.onCollapse}
								onTreeNodeCheckChange={this.onCheck}
								collapsible={true}
								collapsed={false}
								data={state.tree.items}
							/>
							</td>
							<td colSpan="6" className={cx('topAlign')}>
								<b>Currently selected</b><br/>
								<ul>
								{ Object.keys(state.tree.chosen).map( chosen => <li>- {chosen}</li> )}
								</ul>
							</td>
						</tr>
					)
				}

				return lines
			}
		})

		let grid = (
			<section className={cx('row', 'bottom-spacer-half')}>
				<div className={cx('col-xs-12')}>
					<table>
						<thead>
							<tr>
								<th style={{width: '70px'}}>DISK</th>
								<th style={{width: '75px'}}>TYPE</th>
								<th>SERIAL</th>
								<th style={{width: '50px'}}>FROM </th>
								<th style={{width: '50px'}}>TO</th>
								<th style={{width: '100px'}}>SIZE</th>
								<th style={{width: '85px'}}>FREE</th>
								<th style={{width: '100px'}}>FILL</th>
								<th style={{width: '100px'}}>PLAN</th>
							</tr>
						</thead>
						<tbody>
							{ rows }
						</tbody>
						<tfoot>
							<tr>
								<th colSpan="5">TOTAL</th>
								<th>{humanBytes(state.unraid.condition.size)}</th>
								<th>{humanBytes(state.unraid.condition.free)}</th>
								<th>
									<div className={cx('progress')}>
									</div>
								</th>
								<th>{humanBytes(state.unraid.condition.free)}</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</section>
		)

		return (
			<div>
				{ consolePanel }

				{ grid }
			</div>
		)
	}

	_checkFrom = (path) => (e) => {
		let { checkFrom } = this.props.store.actions
		checkFrom(path)
	}

	_checkTo = (path) => (e) => {
		let { state, actions: {checkTo} } = this.props.store

		if (state.fromDisk[path]) {
			e.preventDefault()
			return
		}

		checkTo(path)
	}

	onClick = (node) => {
		// console.log(`click-node-${JSON.stringify(node)}`)
	}

	onCollapse = (node) => {
		// console.log(`collapse-node-${JSON.stringify(node)}`)
		let { treeCollapsed } = this.props.store.actions
		treeCollapsed(node)
	}

	onCheck = (node) => {
		// console.log(`check-node-${JSON.stringify(node)}`)
		let { treeChecked } = this.props.store.actions
		treeChecked(node)
	}
}
