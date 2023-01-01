
const logElement = document.querySelector('pre')
const logsText = logElement.innerText

const logs = logsText.split('\n')

const logContainer = document.createElement('div')
const body = document.querySelector('body')

console.log(logContainer)
// document.querySelector('body').appendChild(logContainer)

body.innerHTML += `<section class="bx--structured-list bx--structured-list--border bx--structured-list--selection" data-structured-list>
<div class="bx--structured-list-thead">
	<div class="bx--structured-list-row bx--structured-list-row--header-row">
		<div class="bx--structured-list-th">Timestamp</div>
		<div class="bx--structured-list-th">Level</div>
		<div class="bx--structured-list-th">Description</div>
	</div>
</div>
<div class="bx--structured-list-tbody" id='log-list'></div>
</section>`

logs.slice().reverse().forEach((log) => {

	const l = log.split(' ')
	const [timestamp, level] = l.splice(0,2)
	const logDescription = l.join(' ')
	if(['TRACE','FATAL','DEBUG','WARN','INFO'].includes(level)){
		document.querySelector('#log-list').innerHTML += `
		<label for="${timestamp}" aria-label="${timestamp}" class="bx--structured-list-row ${level === 'FATAL'? 'danger'}" tabindex="0">
			<div class="bx--structured-list-td bx--structured-list-content--nowrap">${timestamp}</div>
			<div class="bx--structured-list-td">${level}</div>
			<div class="bx--structured-list-td">
				${logDescription}
			</div>
		</label>`
	}

})

