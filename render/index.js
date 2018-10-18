const {ipcRenderer} = require('electron');
const moment = require('moment');

(function () {
	const old = console.log;
	const logger = document.getElementById('log');
	console.log = function (message) {
		old(message);
		if (typeof message === 'object') {
			logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
		} else {
			logger.innerHTML += message + '<br />';
		}
		logger.scrollTop = logger.scrollHeight;
	}
})();


function getfolder(e) {
	const files = e.target.files;
	const path = files[0].path;
	$('#fileLabel').text(path)
}

$(document).ready(function () {
	init();
});

function init() {
	$('#slow-check').prop('checked', true);
	setProcess(0);
	$('#start-btn').click(function () {
		startTravel();
	});
	ipcRenderer.on('response-request-travel', (event, arg) => {
		const percent = (arg.total - arg.remain) / arg.total * 100.0;
		setProcess(parseInt(percent));

		if (arg.msg) {
			console.log(arg.msg + ' ' + arg.remain + ' ' + parseInt(percent));
		}

		if (arg.remain == 0) {
			resetInputs();
		}
	});
	mock();
}

function disableInputs() {
	$('#start-btn').prop('disabled', true).text('正在执行...');
	$('#slow-check').prop('disabled', true);
	$('#customFile').prop('disabled', true);
	$('#from-date-input').prop('disabled', true);
	$('#to-date-input').prop('disabled', true);
}

function resetInputs() {
	$('#start-btn').prop('disabled', false).text('开始执行');
	$('#slow-check').prop('disabled', false);
	$('#customFile').prop('disabled', false);
	$('#from-date-input').prop('disabled', false);
	$('#to-date-input').prop('disabled', false);
}

function clearLog() {
	$('#log').html('');
}

function showProcess(percent) {
	$('#progress-bar').css('width', '50%').attr('aria-valuenow', 50).text('50%')
}

function setProcess(percent) {
	$('#progress-bar').css('width', percent + '%').attr('aria-valuenow', percent).text(percent + '%')
}

function startTravel() {
	const from = $('#from-date-input').val();
	const to = $('#to-date-input').val();
	const slowCheck = $('#slow-check').prop('checked');
	const saveDir = $('#fileLabel').text();

	if (!from || !to || !saveDir) {
		console.log('参数不正确');
	} else {
		if (moment(from, 'YYYY-MM-DD').isBefore(moment(to, 'YYYY-MM-DD'))) {
			clearLog();
			disableInputs();
			ipcRenderer.send('request-travel', {from, to, slowCheck, saveDir});
		} else {
			console.log('时间范围错误');
		}
	}
}

function mock() {
	$('#from-date-input').val('2018-10-01');
	$('#to-date-input').val('2018-10-10');
}
